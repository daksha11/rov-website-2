-- ─────────────────────────────────────────────────────────────
-- CTRL-A Predictions + Entitlements
-- Store in: utils/spbase-docs/predictions-setup.sql
--
-- Two pieces:
--   1. entitlements          the "two currencies for the same door" table
--                            from the gating doc. A row can be granted by
--                            credits, stickers, Stripe, or a manual comp.
--                            One check everywhere: does the row exist?
--   2. predictions/stakes    the Signals prediction game. Stake credits on
--                            a call, resolved when the next volume drops,
--                            winners paid 2x. Staking spends + records in
--                            ONE transaction so credits can never vanish
--                            halfway.
--
-- Resolving is a manual step on the volume-publish checklist:
--   SELECT resolve_prediction('<prediction-id>', <winning option index>);
-- It is idempotent: payouts dedupe on 'pred:<id>:<user>'.
--
-- Safe to run more than once (idempotent).
-- ─────────────────────────────────────────────────────────────

-- 1. Entitlements -----------------------------------------------------
CREATE TABLE IF NOT EXISTS entitlements (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    entitlement TEXT NOT NULL,             -- e.g. 'premium-download:prompt-pack'
    granted_by  TEXT NOT NULL,             -- 'credits' | 'stickers' | 'stripe' | 'comp'
    meta        JSONB DEFAULT '{}'::jsonb,
    expires_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, entitlement)
);
CREATE INDEX IF NOT EXISTS entitlements_user_idx ON entitlements(user_id);

ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "view own entitlements" ON entitlements;
CREATE POLICY "view own entitlements"
    ON entitlements FOR SELECT USING (auth.uid() = user_id);
GRANT SELECT ON entitlements TO authenticated;

-- Spend credits and grant an entitlement in one transaction. This is how
-- premium downloads / course chapters get bought with credits.
CREATE OR REPLACE FUNCTION public.buy_entitlement(
    p_user_id     UUID,
    p_entitlement TEXT,
    p_cost        INT,
    p_meta        JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE v_spend JSONB;
BEGIN
    -- Already owned: no charge, succeed quietly.
    IF EXISTS (SELECT 1 FROM entitlements WHERE user_id = p_user_id AND entitlement = p_entitlement) THEN
        RETURN jsonb_build_object('success', true, 'already_owned', true);
    END IF;

    v_spend := public.spend_credits(p_user_id, p_cost, p_entitlement);
    IF NOT (v_spend ->> 'success')::boolean THEN
        RETURN v_spend;  -- carries 'Insufficient credits' + current points
    END IF;

    INSERT INTO entitlements (user_id, entitlement, granted_by, meta)
        VALUES (p_user_id, p_entitlement, 'credits', COALESCE(p_meta, '{}'::jsonb));

    RETURN jsonb_build_object('success', true, 'points', (v_spend ->> 'points')::int);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION public.buy_entitlement(UUID, TEXT, INT, JSONB) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.buy_entitlement(UUID, TEXT, INT, JSONB) TO service_role;

-- 2. Predictions ------------------------------------------------------
CREATE TABLE IF NOT EXISTS predictions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volume          INT NOT NULL,
    question        TEXT NOT NULL,
    options         JSONB NOT NULL,        -- e.g. ["Yes","No"]
    closes_at       TIMESTAMPTZ NOT NULL,  -- staking freezes here
    resolved_option INT,                   -- null until resolved
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prediction_stakes (
    user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    prediction_id UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
    option        INT NOT NULL,
    stake         INT NOT NULL CHECK (stake BETWEEN 10 AND 200),
    paid_out      BOOLEAN NOT NULL DEFAULT FALSE,
    staked_at     TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, prediction_id)
);

-- Open predictions are public reading material (they render in Signals).
ALTER TABLE predictions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_stakes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read predictions" ON predictions;
CREATE POLICY "read predictions" ON predictions FOR SELECT USING (true);

DROP POLICY IF EXISTS "view own stakes" ON prediction_stakes;
CREATE POLICY "view own stakes"
    ON prediction_stakes FOR SELECT USING (auth.uid() = user_id);

GRANT SELECT ON predictions       TO anon, authenticated;
GRANT SELECT ON prediction_stakes TO authenticated;

-- Stake: spend + record atomically. One stake per user per prediction.
CREATE OR REPLACE FUNCTION public.stake_prediction(
    p_user_id       UUID,
    p_prediction_id UUID,
    p_option        INT,
    p_stake         INT
)
RETURNS JSONB AS $$
DECLARE
    v_pred  predictions%ROWTYPE;
    v_spend JSONB;
BEGIN
    IF p_stake < 10 OR p_stake > 200 THEN
        RETURN jsonb_build_object('success', false, 'code', 'bad_stake');
    END IF;

    SELECT * INTO v_pred FROM predictions WHERE id = p_prediction_id FOR UPDATE;
    IF NOT FOUND OR v_pred.resolved_option IS NOT NULL OR v_pred.closes_at <= NOW() THEN
        RETURN jsonb_build_object('success', false, 'code', 'closed');
    END IF;
    IF p_option < 0 OR p_option >= jsonb_array_length(v_pred.options) THEN
        RETURN jsonb_build_object('success', false, 'code', 'bad_option');
    END IF;
    IF EXISTS (SELECT 1 FROM prediction_stakes WHERE user_id = p_user_id AND prediction_id = p_prediction_id) THEN
        RETURN jsonb_build_object('success', false, 'code', 'already_staked');
    END IF;

    v_spend := public.spend_credits(p_user_id, p_stake, 'prediction:' || p_prediction_id::text);
    IF NOT (v_spend ->> 'success')::boolean THEN
        RETURN v_spend;
    END IF;

    INSERT INTO prediction_stakes (user_id, prediction_id, option, stake)
        VALUES (p_user_id, p_prediction_id, p_option, p_stake);

    RETURN jsonb_build_object('success', true, 'points', (v_spend ->> 'points')::int);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Resolve: mark the answer, pay every winning stake 2x. Idempotent:
-- payouts dedupe on 'pred:<id>:<user>' and flip paid_out.
CREATE OR REPLACE FUNCTION public.resolve_prediction(
    p_prediction_id  UUID,
    p_winning_option INT
)
RETURNS JSONB AS $$
DECLARE
    v_pred  predictions%ROWTYPE;
    v_row   prediction_stakes%ROWTYPE;
    v_paid  INT := 0;
BEGIN
    SELECT * INTO v_pred FROM predictions WHERE id = p_prediction_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'code', 'not_found');
    END IF;

    UPDATE predictions
        SET resolved_option = p_winning_option,
            resolved_at     = COALESCE(resolved_at, NOW())
        WHERE id = p_prediction_id;

    FOR v_row IN
        SELECT * FROM prediction_stakes
        WHERE prediction_id = p_prediction_id
          AND option = p_winning_option
          AND NOT paid_out
    LOOP
        PERFORM public.award_credits(
            v_row.user_id, 'prediction-win', v_row.stake * 2,
            'pred:' || p_prediction_id::text || ':' || v_row.user_id::text,
            jsonb_build_object('prediction', p_prediction_id, 'stake', v_row.stake)
        );
        UPDATE prediction_stakes SET paid_out = TRUE
            WHERE user_id = v_row.user_id AND prediction_id = p_prediction_id;
        v_paid := v_paid + 1;
    END LOOP;

    RETURN jsonb_build_object('success', true, 'winners_paid', v_paid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION public.stake_prediction(UUID, UUID, INT, INT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.resolve_prediction(UUID, INT) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.stake_prediction(UUID, UUID, INT, INT) TO service_role;
GRANT  EXECUTE ON FUNCTION public.resolve_prediction(UUID, INT) TO service_role;
