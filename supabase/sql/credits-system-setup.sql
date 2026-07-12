-- ─────────────────────────────────────────────────────────────
-- CTRL-A Credits: earn engine on top of the existing wallet
-- Store in: utils/spbase-docs/credits-system-setup.sql
--
-- Builds on brand_kit_credits (the existing wallet) and adds:
--   1. credit_events    a ledger of every earn/spend, with dedupe
--   2. referral_code / referred_by on profiles (for share rewards)
--   3. award_credits()  server-only RPC to grant credits (deduped)
--   4. spend_credits()  server-only RPC to spend credits (any tool)
--
-- award/spend are granted to service_role ONLY, so the browser can
-- never forge credits. All earning flows through the /api/credits
-- routes, which run with the service-role key.
--
-- Safe to run more than once (idempotent).
-- ─────────────────────────────────────────────────────────────

-- 1. Ledger of every credit movement --------------------------------
CREATE TABLE IF NOT EXISTS credit_events (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action      TEXT NOT NULL,          -- e.g. 'follow-instagram', 'referral', 'spend:brand-kit-export'
    points      INTEGER NOT NULL,       -- positive = earned, negative = spent
    dedupe_key  TEXT UNIQUE,            -- non-null makes a reward one-time
    meta        JSONB DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS credit_events_user_idx ON credit_events(user_id);

-- 2. Referral fields on profiles ------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by  UUID REFERENCES profiles(id);

CREATE OR REPLACE FUNCTION public.gen_referral_code()
RETURNS TEXT AS $$
DECLARE code TEXT;
BEGIN
    LOOP
        code := lower(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
        EXIT WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE referral_code = code);
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Backfill codes for existing users
UPDATE profiles SET referral_code = public.gen_referral_code() WHERE referral_code IS NULL;

-- Assign a code to every new profile
CREATE OR REPLACE FUNCTION public.set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code := public.gen_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_set_referral_code ON profiles;
CREATE TRIGGER on_profile_set_referral_code
    BEFORE INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_referral_code();

-- 3. Award credits (server-only) ------------------------------------
CREATE OR REPLACE FUNCTION public.award_credits(
    p_user_id    UUID,
    p_action     TEXT,
    p_amount     INT,
    p_dedupe_key TEXT DEFAULT NULL,
    p_meta       JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE v_new INT;
BEGIN
    IF p_amount <= 0 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid amount');
    END IF;

    -- One-time rewards: bail if this dedupe_key was already used
    IF p_dedupe_key IS NOT NULL AND EXISTS (SELECT 1 FROM credit_events WHERE dedupe_key = p_dedupe_key) THEN
        SELECT points INTO v_new FROM brand_kit_credits WHERE user_id = p_user_id;
        RETURN jsonb_build_object('success', false, 'already_claimed', true, 'points', COALESCE(v_new, 0));
    END IF;

    -- Make sure a wallet exists
    INSERT INTO brand_kit_credits (user_id, points) VALUES (p_user_id, 1000)
        ON CONFLICT (user_id) DO NOTHING;

    -- Record the event, then credit the wallet
    INSERT INTO credit_events (user_id, action, points, dedupe_key, meta)
        VALUES (p_user_id, p_action, p_amount, p_dedupe_key, COALESCE(p_meta, '{}'::jsonb));

    UPDATE brand_kit_credits SET points = points + p_amount, updated_at = NOW()
        WHERE user_id = p_user_id RETURNING points INTO v_new;

    RETURN jsonb_build_object('success', true, 'points', v_new, 'awarded', p_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Spend credits (server-only, any tool) --------------------------
CREATE OR REPLACE FUNCTION public.spend_credits(
    p_user_id UUID,
    p_amount  INT,
    p_reason  TEXT DEFAULT 'spend'
)
RETURNS JSONB AS $$
DECLARE v_cur INT; v_new INT;
BEGIN
    SELECT points INTO v_cur FROM brand_kit_credits WHERE user_id = p_user_id;
    IF v_cur IS NULL THEN
        INSERT INTO brand_kit_credits (user_id, points) VALUES (p_user_id, 1000)
            ON CONFLICT (user_id) DO NOTHING;
        SELECT points INTO v_cur FROM brand_kit_credits WHERE user_id = p_user_id;
    END IF;

    IF v_cur >= p_amount THEN
        UPDATE brand_kit_credits SET points = points - p_amount, updated_at = NOW()
            WHERE user_id = p_user_id RETURNING points INTO v_new;
        INSERT INTO credit_events (user_id, action, points)
            VALUES (p_user_id, 'spend:' || p_reason, -p_amount);
        RETURN jsonb_build_object('success', true, 'points', v_new);
    ELSE
        RETURN jsonb_build_object('success', false, 'points', v_cur, 'message', 'Insufficient credits');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Row Level Security --------------------------------------------
ALTER TABLE credit_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "view own credit events" ON credit_events;
CREATE POLICY "view own credit events"
    ON credit_events FOR SELECT USING (auth.uid() = user_id);

-- 6. Grants: earning/spending is server-only (service_role) ---------
REVOKE EXECUTE ON FUNCTION public.award_credits(UUID, TEXT, INT, TEXT, JSONB) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.spend_credits(UUID, INT, TEXT) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.award_credits(UUID, TEXT, INT, TEXT, JSONB) TO service_role;
GRANT  EXECUTE ON FUNCTION public.spend_credits(UUID, INT, TEXT) TO service_role;
GRANT  SELECT ON credit_events TO authenticated;

-- 7. Realtime (so the balance updates live in the UI) ---------------
-- brand_kit_credits is already in the supabase_realtime publication.
-- Add the ledger too so an activity feed can update live if you build one.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'credit_events'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE credit_events;
    END IF;
END $$;
