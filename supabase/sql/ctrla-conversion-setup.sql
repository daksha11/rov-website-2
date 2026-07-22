-- ─────────────────────────────────────────────────────────────
-- CTRL-A Conversion System: two-track contributions
-- Store in: supabase/sql/ctrla-conversion-setup.sql
--
-- Extends the existing community pipeline (ctrla-community-setup.sql) for
-- the conversion system:
--   1. ctrla_submissions gains:
--        type       += 'history' (Track A) and 'art', 'story' (Track B)
--        track       'toolkit' (free) | 'magazine' (credits)
--        credit_cost what was charged at submit time (frozen, not re-priced)
--        media       ordered [{ path, kind, caption? }] into Storage
--   2. ctrla_form_configs  admin-editable form definitions (fields, labels,
--                          help, required, cost, open/closed). The submit
--                          pages render from this; the API's zod stays the
--                          non-bypassable safety floor beneath it.
--   3. submit_ctrla_feature()  atomic spend + insert for Track B, so a paid
--                              submission can never charge without inserting
--                              or insert without charging.
--   4. Storage bucket 'ctrla-submissions' + policies for member uploads.
--
-- Safe to run more than once (idempotent). Run AFTER the community + credits
-- setups (it depends on ctrla_submissions, brand_kit_credits, credit_events).
-- ─────────────────────────────────────────────────────────────

-- 1. Extend ctrla_submissions -----------------------------------------
-- Widen the type check to include the new toolkit + magazine types.
ALTER TABLE ctrla_submissions DROP CONSTRAINT IF EXISTS ctrla_submissions_type_check;
ALTER TABLE ctrla_submissions ADD CONSTRAINT ctrla_submissions_type_check
    CHECK (type IN ('tool', 'idea', 'signal', 'resource', 'history', 'art', 'story'));

ALTER TABLE ctrla_submissions
    ADD COLUMN IF NOT EXISTS track       TEXT NOT NULL DEFAULT 'toolkit'
        CHECK (track IN ('toolkit', 'magazine'));
ALTER TABLE ctrla_submissions
    ADD COLUMN IF NOT EXISTS credit_cost INT NOT NULL DEFAULT 0;
ALTER TABLE ctrla_submissions
    ADD COLUMN IF NOT EXISTS media       JSONB;

-- Allow a larger payload for stories (sectioned process + tools breakdown).
ALTER TABLE ctrla_submissions DROP CONSTRAINT IF EXISTS ctrla_submissions_payload_check;
ALTER TABLE ctrla_submissions ADD CONSTRAINT ctrla_submissions_payload_check
    CHECK (length(payload::text) <= 20000);

-- 2. Form configs ------------------------------------------------------
-- One row per submission type. The public submit pages read this to render;
-- admins edit it from the front end; the same rows stay editable in the
-- Supabase dashboard. Zod in the API validates every payload regardless.
CREATE TABLE IF NOT EXISTS ctrla_form_configs (
    type        TEXT PRIMARY KEY
                CHECK (type IN ('tool', 'idea', 'signal', 'resource', 'history', 'art', 'story')),
    track       TEXT NOT NULL CHECK (track IN ('toolkit', 'magazine')),
    is_open     BOOLEAN NOT NULL DEFAULT TRUE,     -- flip off to pause a type
    title       TEXT NOT NULL,
    intro       TEXT,
    credit_cost INT NOT NULL DEFAULT 0,            -- 0 for Track A
    fields      JSONB NOT NULL DEFAULT '[]'::jsonb, -- ordered field defs
    sort        INT NOT NULL DEFAULT 0,
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_by  UUID REFERENCES profiles(id)
);

ALTER TABLE ctrla_form_configs ENABLE ROW LEVEL SECURITY;

-- Everyone reads (the public pages must render from it).
DROP POLICY IF EXISTS "read form configs" ON ctrla_form_configs;
CREATE POLICY "read form configs" ON ctrla_form_configs FOR SELECT USING (true);

-- Only staff write, from the front end. (Same rows stay editable directly
-- in the Supabase dashboard via the service role / SQL editor.)
DROP POLICY IF EXISTS "staff write form configs" ON ctrla_form_configs;
CREATE POLICY "staff write form configs"
    ON ctrla_form_configs FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'engineer')))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'engineer')));

GRANT SELECT ON ctrla_form_configs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ctrla_form_configs TO authenticated;

-- Seed the seven types with sensible defaults matching today's fields.
-- ON CONFLICT DO NOTHING so a re-run never clobbers admin edits.
INSERT INTO ctrla_form_configs (type, track, title, intro, credit_cost, sort, fields) VALUES
  ('tool', 'toolkit', 'Suggest a tool',
   'A tool you actually use that belongs in a toolkit.', 0, 10,
   '[{"key":"toolkitSlug","label":"Toolkit","kind":"toolkit","required":true},
     {"key":"title","label":"Tool name","kind":"text","required":true,"maxLength":80},
     {"key":"url","label":"Link","kind":"url","required":true},
     {"key":"body","label":"Why it earns a slot","kind":"textarea","required":true,"maxLength":600},
     {"key":"tags","label":"Tags","kind":"tags","required":false},
     {"key":"level","label":"Level","kind":"select","required":false,"options":["Beginner","Intermediate","Pro"]}]'::jsonb),
  ('idea', 'toolkit', 'Pitch an idea',
   'A feature, section, or direction CTRL-A should explore.', 0, 20,
   '[{"key":"toolkitSlug","label":"Toolkit (optional)","kind":"toolkit","required":false},
     {"key":"title","label":"Title","kind":"text","required":true,"maxLength":100},
     {"key":"body","label":"The pitch","kind":"textarea","required":true,"maxLength":1200}]'::jsonb),
  ('signal', 'toolkit', 'Report a signal',
   'An industry shift the Signals feed should know about.', 0, 30,
   '[{"key":"toolkitSlug","label":"Toolkit","kind":"toolkit","required":true},
     {"key":"title","label":"Headline","kind":"text","required":true,"maxLength":120},
     {"key":"body","label":"What changed","kind":"textarea","required":true,"maxLength":600},
     {"key":"url","label":"Link (optional)","kind":"url","required":false},
     {"key":"kind","label":"Kind","kind":"select","required":false,"options":["Release","Shift","Trend","Sunset"]}]'::jsonb),
  ('resource', 'toolkit', 'Share a resource',
   'A guide, video, or read that leveled you up.', 0, 40,
   '[{"key":"toolkitSlug","label":"Toolkit","kind":"toolkit","required":true},
     {"key":"title","label":"Title","kind":"text","required":true,"maxLength":100},
     {"key":"url","label":"Link","kind":"url","required":true},
     {"key":"body","label":"Why it helped (optional)","kind":"textarea","required":false,"maxLength":600}]'::jsonb),
  ('history', 'toolkit', 'Add a history milestone',
   'A dated milestone for a toolkit''s history section.', 0, 50,
   '[{"key":"toolkitSlug","label":"Toolkit","kind":"toolkit","required":true},
     {"key":"title","label":"Milestone","kind":"text","required":true,"maxLength":120},
     {"key":"date","label":"When it happened","kind":"date","required":true},
     {"key":"body","label":"What happened","kind":"textarea","required":true,"maxLength":800},
     {"key":"url","label":"Link (optional)","kind":"url","required":false}]'::jsonb),
  ('art', 'magazine', 'Submit art to be featured',
   'Any medium: pottery, painting, music, film, design. Show the work.', 150, 60,
   '[{"key":"title","label":"Title","kind":"text","required":true,"maxLength":120},
     {"key":"medium","label":"Medium","kind":"text","required":true,"maxLength":80},
     {"key":"media","label":"Hero + gallery","kind":"media","required":true},
     {"key":"tools","label":"Tools / materials used","kind":"tags","required":true},
     {"key":"statement","label":"Artist statement","kind":"textarea","required":true,"maxLength":1200},
     {"key":"bio","label":"Short bio","kind":"textarea","required":true,"maxLength":400},
     {"key":"links","label":"Links","kind":"tags","required":false}]'::jsonb),
  ('story', 'magazine', 'Submit a story to be featured',
   'The full editorial. Show the how, the process, and the ugly steps.', 250, 70,
   '[{"key":"title","label":"Title","kind":"text","required":true,"maxLength":140},
     {"key":"media","label":"Hero + gallery","kind":"media","required":true},
     {"key":"tools","label":"Tools used (mapped to toolkits)","kind":"tools","required":true},
     {"key":"process","label":"Process, the ugly steps included","kind":"sections","required":true},
     {"key":"bio","label":"Short bio","kind":"textarea","required":true,"maxLength":400},
     {"key":"links","label":"Links","kind":"tags","required":false}]'::jsonb)
ON CONFLICT (type) DO NOTHING;

-- 3. Atomic paid submit (Track B) -------------------------------------
-- Spend credits AND insert the submission in one transaction, so a paid
-- feature never charges without inserting, or inserts without charging.
-- Service-role only; the submissions API is the sole caller.
CREATE OR REPLACE FUNCTION public.submit_ctrla_feature(
    p_user_id UUID,
    p_type    TEXT,       -- 'art' | 'story'
    p_toolkit TEXT,       -- nullable
    p_payload JSONB,
    p_media   JSONB,
    p_cost    INT
)
RETURNS JSONB AS $$
DECLARE v_cur INT; v_id UUID;
BEGIN
    IF p_type NOT IN ('art', 'story') THEN
        RETURN jsonb_build_object('success', false, 'code', 'bad_type');
    END IF;

    -- Ensure a wallet exists, then check the balance under this transaction.
    INSERT INTO brand_kit_credits (user_id, points) VALUES (p_user_id, 1000)
        ON CONFLICT (user_id) DO NOTHING;
    SELECT points INTO v_cur FROM brand_kit_credits WHERE user_id = p_user_id FOR UPDATE;

    IF v_cur IS NULL OR v_cur < p_cost THEN
        RETURN jsonb_build_object('success', false, 'code', 'insufficient', 'points', COALESCE(v_cur, 0));
    END IF;

    -- Charge, ledger, insert. All or nothing.
    UPDATE brand_kit_credits SET points = points - p_cost, updated_at = NOW()
        WHERE user_id = p_user_id;
    INSERT INTO credit_events (user_id, action, points, meta)
        VALUES (p_user_id, 'spend:' || p_type || '-feature', -p_cost, jsonb_build_object('type', p_type));

    INSERT INTO ctrla_submissions (author_id, toolkit_slug, type, track, credit_cost, payload, media)
        VALUES (p_user_id, p_toolkit, p_type, 'magazine', p_cost, p_payload, p_media)
        RETURNING id INTO v_id;

    RETURN jsonb_build_object('success', true, 'id', v_id, 'points', v_cur - p_cost);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION public.submit_ctrla_feature(UUID, TEXT, TEXT, JSONB, JSONB, INT) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.submit_ctrla_feature(UUID, TEXT, TEXT, JSONB, JSONB, INT) TO service_role;

-- 4. Storage bucket for submission media ------------------------------
-- Private bucket; members upload under their own id prefix, staff (and the
-- service role) read everything for review. Featured media is surfaced by
-- the app through signed URLs or a copy at publish time.
-- Bucket-level backstop: 80MB hard cap and image/audio/video only. Per-kind
-- caps (image 8MB, audio 25MB, video 80MB) are enforced client-side in
-- MediaUploader; this is the server floor a forged request cannot slip past.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'ctrla-submissions', 'ctrla-submissions', false,
        83886080,
        ARRAY['image/jpeg','image/png','image/webp','image/gif','audio/mpeg','audio/wav','audio/mp4','audio/aac','audio/ogg','video/mp4','video/webm','video/quicktime']
    )
ON CONFLICT (id) DO UPDATE
    SET file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Members write only under submissions/<their-uid>/...
DROP POLICY IF EXISTS "ctrla upload own media" ON storage.objects;
CREATE POLICY "ctrla upload own media"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'ctrla-submissions'
        AND (storage.foldername(name))[1] = 'submissions'
        AND (storage.foldername(name))[2] = auth.uid()::text
    );

-- Members read their own; staff read all.
DROP POLICY IF EXISTS "ctrla read own or staff media" ON storage.objects;
CREATE POLICY "ctrla read own or staff media"
    ON storage.objects FOR SELECT TO authenticated
    USING (
        bucket_id = 'ctrla-submissions'
        AND (
            (storage.foldername(name))[2] = auth.uid()::text
            OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'engineer'))
        )
    );

-- Members may delete their own uploads (e.g. before submitting).
DROP POLICY IF EXISTS "ctrla delete own media" ON storage.objects;
CREATE POLICY "ctrla delete own media"
    ON storage.objects FOR DELETE TO authenticated
    USING (
        bucket_id = 'ctrla-submissions'
        AND (storage.foldername(name))[2] = auth.uid()::text
    );
