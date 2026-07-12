-- ─────────────────────────────────────────────────────────────
-- CTRL-A Daily: the taste-test game + streaks
-- Store in: utils/spbase-docs/daily-system-setup.sql
--
-- Builds on the credits engine (credits-system-setup.sql) and adds:
--   1. daily_challenges  one taste test per calendar day (ET), authored in batches
--   2. daily_plays       one row per signed-in play (unique = once per day)
--   3. user_streaks      streak + lifetime taste stats per user
--   4. play_daily()      server-only RPC: play + streak + credits, one transaction
--   5. play_daily_anon() server-only RPC: anonymous play, counters only
--
-- The browser never touches these tables directly. All reads and writes
-- flow through /api/daily routes running with the service-role key, so
-- the reveal (editors_pick / editors_note) stays hidden until you play
-- and nobody can forge a streak or a payout.
--
-- The "day" is a calendar date in America/New_York, computed by the
-- server (lib/daily/date.ts) and passed in as p_date.
--
-- Safe to run more than once (idempotent).
-- ─────────────────────────────────────────────────────────────

-- 1. One challenge per day ------------------------------------------
CREATE TABLE IF NOT EXISTS daily_challenges (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publish_date  DATE UNIQUE NOT NULL,
    volume        INT NOT NULL,
    kind          TEXT NOT NULL DEFAULT 'taste-test',
    prompt        TEXT NOT NULL,             -- "Two headlines for the same launch. Which is sharper?"
    option_a      JSONB NOT NULL,            -- { label, text?, image?, credit? }
    option_b      JSONB NOT NULL,
    editors_pick  CHAR(1) NOT NULL CHECK (editors_pick IN ('a','b')),
    editors_note  TEXT NOT NULL,             -- the two-sentence "why" (the real payoff)
    counts_a      INT NOT NULL DEFAULT 0,    -- aggregate votes, anonymous + signed-in
    counts_b      INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. One row per signed-in play; the unique pair IS the once-per-day rule
CREATE TABLE IF NOT EXISTS daily_plays (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    challenge_id    UUID NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
    choice          CHAR(1) NOT NULL CHECK (choice IN ('a','b')),
    matched_editors BOOLEAN NOT NULL,
    played_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, challenge_id)
);
CREATE INDEX IF NOT EXISTS daily_plays_user_idx ON daily_plays(user_id);

-- 3. Streak + lifetime taste stats ----------------------------------
CREATE TABLE IF NOT EXISTS user_streaks (
    user_id          UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    current_streak   INT NOT NULL DEFAULT 0,
    longest_streak   INT NOT NULL DEFAULT 0,
    last_played      DATE,
    freeze_available BOOLEAN NOT NULL DEFAULT TRUE,   -- one grace day, regenerates weekly
    freeze_used_on   DATE,
    taste_plays      INT NOT NULL DEFAULT 0,
    taste_agreements INT NOT NULL DEFAULT 0,          -- agreement % = agreements / plays
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Play (signed in): record + streak + credits, one transaction ----
-- p_base / p_spike / p_milestones come from lib/credits/config.ts via the
-- API route, so the economy tunes from one TS file without touching SQL.
-- The spike is random, generated server-side in the route.
CREATE OR REPLACE FUNCTION public.play_daily(
    p_user_id    UUID,
    p_date       DATE,
    p_choice     CHAR(1),
    p_base       INT DEFAULT 10,
    p_spike      INT DEFAULT 0,
    p_milestones JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
    v_ch        daily_challenges%ROWTYPE;
    v_st        user_streaks%ROWTYPE;
    v_matched   BOOLEAN;
    v_gap       INT;
    v_streak    INT;
    v_bonus     INT := 0;
    v_award     INT := 0;
    v_credits   JSONB;
    v_existing  daily_plays%ROWTYPE;
BEGIN
    IF p_choice NOT IN ('a','b') THEN
        RETURN jsonb_build_object('success', false, 'code', 'bad_choice');
    END IF;

    SELECT * INTO v_ch FROM daily_challenges WHERE publish_date = p_date;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'code', 'no_challenge');
    END IF;

    v_matched := (p_choice = v_ch.editors_pick);

    -- Once per day: a second play returns the existing result, awards nothing.
    BEGIN
        INSERT INTO daily_plays (user_id, challenge_id, choice, matched_editors)
            VALUES (p_user_id, v_ch.id, p_choice, v_matched);
    EXCEPTION WHEN unique_violation THEN
        SELECT * INTO v_existing FROM daily_plays WHERE user_id = p_user_id AND challenge_id = v_ch.id;
        SELECT * INTO v_st FROM user_streaks WHERE user_id = p_user_id;
        RETURN jsonb_build_object(
            'success', true, 'already_played', true,
            'choice', v_existing.choice, 'matched', v_existing.matched_editors,
            'counts_a', v_ch.counts_a, 'counts_b', v_ch.counts_b,
            'editors_pick', v_ch.editors_pick, 'editors_note', v_ch.editors_note,
            'streak', COALESCE(v_st.current_streak, 0),
            'longest', COALESCE(v_st.longest_streak, 0),
            'freeze_available', COALESCE(v_st.freeze_available, true),
            'taste_plays', COALESCE(v_st.taste_plays, 0),
            'taste_agreements', COALESCE(v_st.taste_agreements, 0),
            'awarded', 0
        );
    END;

    -- Count the vote.
    IF p_choice = 'a' THEN
        UPDATE daily_challenges SET counts_a = counts_a + 1 WHERE id = v_ch.id
            RETURNING counts_a, counts_b INTO v_ch.counts_a, v_ch.counts_b;
    ELSE
        UPDATE daily_challenges SET counts_b = counts_b + 1 WHERE id = v_ch.id
            RETURNING counts_a, counts_b INTO v_ch.counts_a, v_ch.counts_b;
    END IF;

    -- Streak, with the weekly grace day.
    INSERT INTO user_streaks (user_id) VALUES (p_user_id) ON CONFLICT (user_id) DO NOTHING;
    SELECT * INTO v_st FROM user_streaks WHERE user_id = p_user_id FOR UPDATE;

    -- Regenerate the freeze if the last one was used 7+ days ago.
    IF NOT v_st.freeze_available AND v_st.freeze_used_on IS NOT NULL
       AND p_date - v_st.freeze_used_on >= 7 THEN
        v_st.freeze_available := TRUE;
    END IF;

    IF v_st.last_played IS NULL THEN
        v_streak := 1;
    ELSE
        v_gap := p_date - v_st.last_played;
        IF v_gap = 1 THEN
            v_streak := v_st.current_streak + 1;
        ELSIF v_gap = 2 AND v_st.freeze_available THEN
            v_streak := v_st.current_streak + 1;          -- grace covers the missed day
            v_st.freeze_available := FALSE;
            v_st.freeze_used_on := p_date;
        ELSIF v_gap <= 0 THEN
            v_streak := GREATEST(v_st.current_streak, 1); -- clock skew guard
        ELSE
            v_streak := 1;
        END IF;
    END IF;

    UPDATE user_streaks SET
        current_streak   = v_streak,
        longest_streak   = GREATEST(longest_streak, v_streak),
        last_played      = p_date,
        freeze_available = v_st.freeze_available,
        freeze_used_on   = v_st.freeze_used_on,
        taste_plays      = taste_plays + 1,
        taste_agreements = taste_agreements + (CASE WHEN v_matched THEN 1 ELSE 0 END),
        updated_at       = NOW()
    WHERE user_id = p_user_id
    RETURNING * INTO v_st;

    -- Credits: base + random spike + milestone bonus. Deduped per day,
    -- so even a bug can never double-pay.
    v_bonus := COALESCE((p_milestones ->> v_streak::text)::int, 0);
    v_award := GREATEST(p_base, 0) + GREATEST(p_spike, 0) + v_bonus;
    IF v_award > 0 THEN
        v_credits := public.award_credits(
            p_user_id, 'daily-play', v_award,
            'daily:' || p_date::text || ':' || p_user_id::text,
            jsonb_build_object('date', p_date, 'streak', v_streak, 'matched', v_matched)
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true, 'already_played', false,
        'choice', p_choice, 'matched', v_matched,
        'counts_a', v_ch.counts_a, 'counts_b', v_ch.counts_b,
        'editors_pick', v_ch.editors_pick, 'editors_note', v_ch.editors_note,
        'streak', v_st.current_streak,
        'longest', v_st.longest_streak,
        'freeze_available', v_st.freeze_available,
        'taste_plays', v_st.taste_plays,
        'taste_agreements', v_st.taste_agreements,
        'awarded', v_award,
        'points', COALESCE((v_credits ->> 'points')::int, NULL)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Play (anonymous): counters + reveal only, no streak, no credits -
CREATE OR REPLACE FUNCTION public.play_daily_anon(
    p_date   DATE,
    p_choice CHAR(1)
)
RETURNS JSONB AS $$
DECLARE v_ch daily_challenges%ROWTYPE;
BEGIN
    IF p_choice NOT IN ('a','b') THEN
        RETURN jsonb_build_object('success', false, 'code', 'bad_choice');
    END IF;

    SELECT * INTO v_ch FROM daily_challenges WHERE publish_date = p_date;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'code', 'no_challenge');
    END IF;

    IF p_choice = 'a' THEN
        UPDATE daily_challenges SET counts_a = counts_a + 1 WHERE id = v_ch.id
            RETURNING counts_a, counts_b INTO v_ch.counts_a, v_ch.counts_b;
    ELSE
        UPDATE daily_challenges SET counts_b = counts_b + 1 WHERE id = v_ch.id
            RETURNING counts_a, counts_b INTO v_ch.counts_a, v_ch.counts_b;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'choice', p_choice, 'matched', (p_choice = v_ch.editors_pick),
        'counts_a', v_ch.counts_a, 'counts_b', v_ch.counts_b,
        'editors_pick', v_ch.editors_pick, 'editors_note', v_ch.editors_note
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Row Level Security ---------------------------------------------
-- daily_challenges stays fully locked: the reveal must not be readable
-- before playing, so ALL access goes through the service-role routes.
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plays      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks     ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "view own daily plays" ON daily_plays;
CREATE POLICY "view own daily plays"
    ON daily_plays FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "view own streak" ON user_streaks;
CREATE POLICY "view own streak"
    ON user_streaks FOR SELECT USING (auth.uid() = user_id);

GRANT SELECT ON daily_plays  TO authenticated;
GRANT SELECT ON user_streaks TO authenticated;

-- 7. Grants: playing is server-only (service_role) -------------------
REVOKE EXECUTE ON FUNCTION public.play_daily(UUID, DATE, CHAR, INT, INT, JSONB) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.play_daily_anon(DATE, CHAR) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.play_daily(UUID, DATE, CHAR, INT, INT, JSONB) TO service_role;
GRANT  EXECUTE ON FUNCTION public.play_daily_anon(DATE, CHAR) TO service_role;

-- 8. Realtime: streak updates live on the credits page ---------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'user_streaks'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE user_streaks;
    END IF;
END $$;
