-- ─────────────────────────────────────────────────────────────
-- CTRL-A Path: the profile that follows the person, and progress
-- on the five stops (learn / look / work / finish / show).
-- Store in: supabase/sql/ctrla-path-setup.sql
--
-- The quiz profile (lib/ctrla/profile.ts) stays local and instant.
-- When a person signs in, it syncs here and follows them across
-- devices. Progress is one row per (user, craft, stop); `all` is the
-- craft for stops that are not craft-specific (look, work).
--
-- Safe to run more than once (idempotent).
-- ─────────────────────────────────────────────────────────────

-- 1. The profile, mirrored ---------------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ctrla_profile    JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ctrla_profile_at TIMESTAMPTZ;

-- 2. Progress -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ctrla_progress (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    craft     TEXT NOT NULL CHECK (craft IN ('music', 'design', 'web-dev', 'video', 'all')),
    stop      TEXT NOT NULL CHECK (stop IN ('learn', 'look', 'work', 'finish', 'show')),
    -- What proves it: a kit id, a URL, a submission id. Never required.
    evidence  JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- auto: the site saw it happen. self: they told us. review: an editor did.
    source    TEXT NOT NULL DEFAULT 'auto' CHECK (source IN ('auto', 'self', 'review')),
    done_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, craft, stop)
);

CREATE INDEX IF NOT EXISTS ctrla_progress_user_idx ON ctrla_progress (user_id);

ALTER TABLE ctrla_progress ENABLE ROW LEVEL SECURITY;

-- People read and write only their own rows. Editors (the review route)
-- write through the service role, which bypasses RLS.
DROP POLICY IF EXISTS "ctrla_progress_select_own" ON ctrla_progress;
CREATE POLICY "ctrla_progress_select_own" ON ctrla_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "ctrla_progress_insert_own" ON ctrla_progress;
CREATE POLICY "ctrla_progress_insert_own" ON ctrla_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ctrla_progress_update_own" ON ctrla_progress;
CREATE POLICY "ctrla_progress_update_own" ON ctrla_progress
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "ctrla_progress_delete_own" ON ctrla_progress;
CREATE POLICY "ctrla_progress_delete_own" ON ctrla_progress
    FOR DELETE USING (auth.uid() = user_id);

-- 3. The public profile view carries progress counts, never evidence -----
-- (ctrla_public_profiles is defined in ctrla-community-setup.sql; this
-- adds a companion view so /ctrla/u/[handle] can show "3 of 5 stops".)
CREATE OR REPLACE VIEW ctrla_public_progress AS
    SELECT p.id AS user_id, p.handle, g.craft, g.stop, g.done_at
    FROM ctrla_progress g
    JOIN profiles p ON p.id = g.user_id
    WHERE p.is_public = TRUE;

GRANT SELECT ON ctrla_public_progress TO anon, authenticated;
