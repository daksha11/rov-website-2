-- ─────────────────────────────────────────────────────────────
-- CTRL-A Credits: admin manual adjustment
-- Store in: supabase/sql/credits-admin-setup.sql
--
-- Builds on credits-system-setup.sql (brand_kit_credits + credit_events).
-- Adds one server-only RPC, admin_adjust_credits(), so staff can grant or
-- deduct credits with a required reason that lands in the ledger meta. This
-- is the manual lever behind /admin/ctrla/economy (refunds, comps, fixes).
--
-- Both directions write a credit_events row (action 'admin-adjust', signed
-- points) so every hand adjustment is auditable next to earns and spends.
-- A deduct can never push a wallet below zero (brand_kit_credits already
-- CHECKs points >= 0; this returns a clean error instead of raising).
--
-- Granted to service_role ONLY. The API route (/api/credits/admin) runs the
-- staff role gate before ever calling this.
--
-- Safe to run more than once (idempotent).
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.admin_adjust_credits(
    p_user_id UUID,
    p_delta   INT,          -- positive = grant, negative = deduct
    p_reason  TEXT,
    p_actor   UUID          -- the staff member making the change
)
RETURNS JSONB AS $$
DECLARE v_cur INT; v_new INT;
BEGIN
    IF p_delta = 0 THEN
        RETURN jsonb_build_object('success', false, 'message', 'No change');
    END IF;
    IF p_reason IS NULL OR length(btrim(p_reason)) = 0 THEN
        RETURN jsonb_build_object('success', false, 'message', 'A reason is required');
    END IF;

    -- Make sure a wallet exists (new-ish accounts seed at 1000).
    INSERT INTO brand_kit_credits (user_id, points) VALUES (p_user_id, 1000)
        ON CONFLICT (user_id) DO NOTHING;
    SELECT points INTO v_cur FROM brand_kit_credits WHERE user_id = p_user_id;

    IF p_delta < 0 AND v_cur < -p_delta THEN
        RETURN jsonb_build_object('success', false, 'points', v_cur, 'message', 'Would go below zero');
    END IF;

    UPDATE brand_kit_credits SET points = points + p_delta, updated_at = NOW()
        WHERE user_id = p_user_id RETURNING points INTO v_new;

    INSERT INTO credit_events (user_id, action, points, meta)
        VALUES (
            p_user_id,
            'admin-adjust',
            p_delta,
            jsonb_build_object('reason', btrim(p_reason), 'actor', p_actor)
        );

    RETURN jsonb_build_object('success', true, 'points', v_new, 'delta', p_delta);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION public.admin_adjust_credits(UUID, INT, TEXT, UUID) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.admin_adjust_credits(UUID, INT, TEXT, UUID) TO service_role;
