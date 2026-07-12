-- SQL Migration: Brand Kit Point System Setup (Separate Table Approach)
-- Store this in: utils/spbase-docs/points-system-setup.sql

-- 1. Create the dedicated credits table
CREATE TABLE IF NOT EXISTS brand_kit_credits (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    user_name TEXT,
    user_email TEXT,
    points INTEGER DEFAULT 1000 CHECK (points >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create a function to initialize credits for new profiles
CREATE OR REPLACE FUNCTION public.handle_new_profile_credits()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.brand_kit_credits (user_id, user_name, user_email)
    VALUES (NEW.id, NEW.full_name, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the trigger to auto-initialize credits
-- Note: Make sure the trigger name is unique
DROP TRIGGER IF EXISTS on_profile_created_init_credits ON profiles;
CREATE TRIGGER on_profile_created_init_credits
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_profile_credits();

-- 4. Create RPC function for secure point deduction
CREATE OR REPLACE FUNCTION deduct_brand_kit_points(p_user_id UUID, p_deduction_amount INT DEFAULT 50)
RETURNS JSONB AS $$
DECLARE
    v_current_points INT;
    v_updated_points INT;
BEGIN
    -- Get current points
    SELECT points INTO v_current_points 
    FROM brand_kit_credits 
    WHERE user_id = p_user_id;

    -- If no record exists, try to initialize it first (failsafe)
    IF v_current_points IS NULL THEN
        INSERT INTO brand_kit_credits (user_id, points)
        VALUES (p_user_id, 1000)
        ON CONFLICT (user_id) DO NOTHING;
        
        SELECT points INTO v_current_points FROM brand_kit_credits WHERE user_id = p_user_id;
    END IF;

    -- Check if user has enough points
    IF v_current_points >= p_deduction_amount THEN
        -- Deduct points
        UPDATE brand_kit_credits 
        SET points = points - p_deduction_amount,
            updated_at = NOW()
        WHERE user_id = p_user_id
        RETURNING points INTO v_updated_points;

        RETURN jsonb_build_object(
            'success', true,
            'new_points', v_updated_points,
            'message', 'Points deducted successfully'
        );
    ELSE
        RETURN jsonb_build_object(
            'success', false,
            'new_points', v_current_points,
            'message', 'Insufficient points'
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE brand_kit_credits ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies
-- Policy: Users can only see their own credits
DROP POLICY IF EXISTS "Users can view own credits" ON brand_kit_credits;
CREATE POLICY "Users can view own credits" 
ON brand_kit_credits FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can only update their own credits (though we use RPC, it's good practice)
DROP POLICY IF EXISTS "Users can update own credits" ON brand_kit_credits;
CREATE POLICY "Users can update own credits" 
ON brand_kit_credits FOR UPDATE 
USING (auth.uid() = user_id);

-- 7. Enable Realtime for this table
-- This allows the frontend usePoints hook to receive live updates
ALTER PUBLICATION supabase_realtime ADD TABLE brand_kit_credits;

-- 8. Grant access
GRANT EXECUTE ON FUNCTION deduct_brand_kit_points(UUID, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION deduct_brand_kit_points(UUID, INT) TO service_role;
GRANT SELECT ON brand_kit_credits TO authenticated;
