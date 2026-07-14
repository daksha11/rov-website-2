-- ─────────────────────────────────────────────────────────────
-- CTRL-A Community: submissions, votes, public profiles
-- Store in: supabase/sql/ctrla-community-setup.sql
--
-- The open-source contribution pipeline:
--   1. profiles extensions   handle / bio / links / is_public so a
--                            profile can become a public community hub
--                            at /ctrla/u/[handle]. Handles auto-generate.
--   2. ctrla_toolkits        tiny lookup of the four toolkits.
--   3. ctrla_submissions     one generic pipeline for every community
--                            contribution (tool / idea / signal /
--                            resource). Type-specific fields live in a
--                            jsonb payload, validated by the API route.
--                            status: pending → approved → featured
--                            (or rejected, with a note).
--   4. ctrla_votes           one row per upvote, unique per user.
--   5. views                 ctrla_community_wall (approved work +
--                            author + vote count, safe for anon) and
--                            ctrla_public_profiles (safe profile
--                            columns only — never email or role).
--   6. review function       review_ctrla_submission(), service_role
--                            only, called from the admin review API.
--
-- Safe to run more than once (idempotent).
-- ─────────────────────────────────────────────────────────────

-- 1. Profile extensions ------------------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS handle     TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio        TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS links      JSONB   DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_public  BOOLEAN DEFAULT FALSE;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_handle_idx
    ON profiles (lower(handle)) WHERE handle IS NOT NULL;

-- Handle = url-safe slug of the name (fallback: email prefix), deduped
-- with a numeric suffix. e.g. "Andi Rao" → andi-rao, andi-rao-2, ...
CREATE OR REPLACE FUNCTION public.generate_ctrla_handle(p_seed TEXT)
RETURNS TEXT AS $$
DECLARE
    v_base TEXT;
    v_try  TEXT;
    v_n    INT := 1;
BEGIN
    v_base := lower(regexp_replace(trim(COALESCE(p_seed, '')), '[^a-zA-Z0-9]+', '-', 'g'));
    v_base := trim(BOTH '-' FROM v_base);
    IF v_base = '' OR v_base IS NULL THEN v_base := 'reader'; END IF;
    v_base := left(v_base, 32);

    v_try := v_base;
    WHILE EXISTS (SELECT 1 FROM profiles WHERE lower(handle) = v_try) LOOP
        v_n := v_n + 1;
        v_try := v_base || '-' || v_n::text;
    END LOOP;
    RETURN v_try;
END;
$$ LANGUAGE plpgsql;

-- Backfill every existing profile that has no handle yet.
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN SELECT id, full_name, email FROM profiles WHERE handle IS NULL LOOP
        UPDATE profiles
            SET handle = public.generate_ctrla_handle(
                COALESCE(NULLIF(r.full_name, ''), split_part(COALESCE(r.email, ''), '@', 1)))
            WHERE id = r.id;
    END LOOP;
END $$;

-- Auto-handle for every future profile.
CREATE OR REPLACE FUNCTION public.ctrla_handle_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.handle IS NULL THEN
        NEW.handle := public.generate_ctrla_handle(
            COALESCE(NULLIF(NEW.full_name, ''), split_part(COALESCE(NEW.email, ''), '@', 1)));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ctrla_handle_trigger ON profiles;
CREATE TRIGGER ctrla_handle_trigger
    BEFORE INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.ctrla_handle_on_insert();

-- Members may edit ONLY their community fields (column-level grant),
-- and only on their own row (policy).
GRANT UPDATE (handle, bio, avatar_url, links, is_public) ON profiles TO authenticated;
DROP POLICY IF EXISTS "update own community profile" ON profiles;
CREATE POLICY "update own community profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 2. Toolkits lookup ---------------------------------------------------
CREATE TABLE IF NOT EXISTS ctrla_toolkits (
    slug       TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    accepting  BOOLEAN NOT NULL DEFAULT TRUE,   -- flip off to pause submissions
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO ctrla_toolkits (slug, title) VALUES
    ('music',   'Music'),
    ('web-dev', 'Web Dev'),
    ('design',  'Design'),
    ('video',   'Video')
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE ctrla_toolkits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read toolkits" ON ctrla_toolkits;
CREATE POLICY "read toolkits" ON ctrla_toolkits FOR SELECT USING (true);
GRANT SELECT ON ctrla_toolkits TO anon, authenticated;

-- 3. Submissions -------------------------------------------------------
CREATE TABLE IF NOT EXISTS ctrla_submissions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    toolkit_slug TEXT REFERENCES ctrla_toolkits(slug),  -- null = general idea
    type         TEXT NOT NULL CHECK (type IN ('tool', 'idea', 'signal', 'resource')),
    status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'approved', 'featured', 'rejected')),
    payload      JSONB NOT NULL CHECK (length(payload::text) <= 8000),
    review_note  TEXT,
    reviewed_by  UUID REFERENCES profiles(id),
    reviewed_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ctrla_submissions_wall_idx
    ON ctrla_submissions (toolkit_slug, status, created_at DESC);
CREATE INDEX IF NOT EXISTS ctrla_submissions_author_idx
    ON ctrla_submissions (author_id, created_at DESC);

ALTER TABLE ctrla_submissions ENABLE ROW LEVEL SECURITY;

-- Everyone can read what made it onto the wall.
DROP POLICY IF EXISTS "read approved submissions" ON ctrla_submissions;
CREATE POLICY "read approved submissions"
    ON ctrla_submissions FOR SELECT
    USING (status IN ('approved', 'featured'));

-- Authors always see their own, including pending / rejected.
DROP POLICY IF EXISTS "read own submissions" ON ctrla_submissions;
CREATE POLICY "read own submissions"
    ON ctrla_submissions FOR SELECT USING (auth.uid() = author_id);

-- Members submit as themselves, always landing in 'pending'.
DROP POLICY IF EXISTS "insert own pending submission" ON ctrla_submissions;
CREATE POLICY "insert own pending submission"
    ON ctrla_submissions FOR INSERT
    WITH CHECK (auth.uid() = author_id AND status = 'pending');

GRANT SELECT ON ctrla_submissions TO anon, authenticated;
GRANT INSERT ON ctrla_submissions TO authenticated;
-- No UPDATE/DELETE grants: status changes only happen through
-- review_ctrla_submission() below (service_role).

-- 4. Votes ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ctrla_votes (
    submission_id UUID NOT NULL REFERENCES ctrla_submissions(id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (submission_id, user_id)
);

ALTER TABLE ctrla_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read votes" ON ctrla_votes;
CREATE POLICY "read votes" ON ctrla_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "cast own vote" ON ctrla_votes;
CREATE POLICY "cast own vote"
    ON ctrla_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "remove own vote" ON ctrla_votes;
CREATE POLICY "remove own vote"
    ON ctrla_votes FOR DELETE USING (auth.uid() = user_id);

GRANT SELECT ON ctrla_votes TO anon, authenticated;
GRANT INSERT, DELETE ON ctrla_votes TO authenticated;

-- 5. Public views --------------------------------------------------------
-- Definer views on purpose: they expose ONLY safe columns to anon,
-- while the base tables stay locked behind RLS.

CREATE OR REPLACE VIEW ctrla_public_profiles AS
SELECT p.id, p.handle, p.full_name, p.bio, p.avatar_url, p.links
FROM profiles p
WHERE p.is_public = TRUE AND p.handle IS NOT NULL;

CREATE OR REPLACE VIEW ctrla_community_wall AS
SELECT
    s.id, s.toolkit_slug, s.type, s.status, s.payload, s.created_at,
    p.handle       AS author_handle,
    p.full_name    AS author_name,
    p.avatar_url   AS author_avatar,
    p.is_public    AS author_is_public,
    COALESCE(v.votes, 0) AS votes
FROM ctrla_submissions s
JOIN profiles p ON p.id = s.author_id
LEFT JOIN (
    SELECT submission_id, COUNT(*)::int AS votes
    FROM ctrla_votes GROUP BY submission_id
) v ON v.submission_id = s.id
WHERE s.status IN ('approved', 'featured');

GRANT SELECT ON ctrla_public_profiles TO anon, authenticated;
GRANT SELECT ON ctrla_community_wall  TO anon, authenticated;

-- 6. Review (admin) ------------------------------------------------------
-- One call flips status and stamps who reviewed it. The admin API route
-- (service role) is the only caller; it also fires the Klaviyo event.
CREATE OR REPLACE FUNCTION public.review_ctrla_submission(
    p_submission_id UUID,
    p_status        TEXT,     -- 'approved' | 'featured' | 'rejected'
    p_reviewer_id   UUID,
    p_note          TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE v_row ctrla_submissions%ROWTYPE;
BEGIN
    IF p_status NOT IN ('approved', 'featured', 'rejected') THEN
        RETURN jsonb_build_object('success', false, 'code', 'bad_status');
    END IF;

    UPDATE ctrla_submissions
        SET status      = p_status,
            review_note = p_note,
            reviewed_by = p_reviewer_id,
            reviewed_at = NOW()
        WHERE id = p_submission_id
        RETURNING * INTO v_row;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'code', 'not_found');
    END IF;

    RETURN jsonb_build_object('success', true, 'status', v_row.status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION public.review_ctrla_submission(UUID, TEXT, UUID, TEXT) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.review_ctrla_submission(UUID, TEXT, UUID, TEXT) TO service_role;
