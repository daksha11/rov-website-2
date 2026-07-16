-- ─────────────────────────────────────────────────────────────
-- CTRL-A Brand Kits: saved kits per account (keep the last 3)
-- Store in: supabase/sql/brand-kits-setup.sql
--
-- Kits used to live only in the browser (localStorage). This gives a
-- signed-in member a small, durable shelf: their most recent 3 saved kits,
-- readable on any device and shown on /account. Save writes the full kit
-- data (logos + fonts included, unlike the share link). A trigger trims each
-- user to their newest 3 so the shelf never grows without bound.
--
-- Safe to run more than once (idempotent).
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS brand_kits (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name       TEXT NOT NULL DEFAULT 'Untitled kit',
    data       JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS brand_kits_user_idx ON brand_kits (user_id, updated_at DESC);

-- Keep only the newest 3 kits per user. Runs after each insert; deletes this
-- user's rows ranked 4th and older by updated_at.
CREATE OR REPLACE FUNCTION public.trim_brand_kits()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM brand_kits
    WHERE user_id = NEW.user_id
      AND id NOT IN (
        SELECT id FROM brand_kits
        WHERE user_id = NEW.user_id
        ORDER BY updated_at DESC
        LIMIT 3
      );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trim_brand_kits_trigger ON brand_kits;
CREATE TRIGGER trim_brand_kits_trigger
    AFTER INSERT ON brand_kits
    FOR EACH ROW EXECUTE FUNCTION public.trim_brand_kits();

ALTER TABLE brand_kits ENABLE ROW LEVEL SECURITY;

-- Owner-only: a member sees and manages only their own kits.
DROP POLICY IF EXISTS "read own kits" ON brand_kits;
CREATE POLICY "read own kits" ON brand_kits FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert own kits" ON brand_kits;
CREATE POLICY "insert own kits" ON brand_kits FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update own kits" ON brand_kits;
CREATE POLICY "update own kits" ON brand_kits FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete own kits" ON brand_kits;
CREATE POLICY "delete own kits" ON brand_kits FOR DELETE USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON brand_kits TO authenticated;
