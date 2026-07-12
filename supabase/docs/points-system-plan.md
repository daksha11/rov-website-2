# Brand Kit Point System Implementation Plan

This document outlines the architecture and implementation steps for the User Point System within the Brand Kit Generator.

## 1. Database Schema (Supabase)
Instead of modifying the core `profiles` table, we will create a dedicated table to manage credits. This ensures better data isolation and easier management of point-specific logic.

### New Table: `brand_kit_credits`
This table will store the point balance for each user and mirror essential user info for easy auditing.

- **`user_id`**: UUID (Primary Key, references `profiles(id)`)
- **`user_name`**: TEXT (Mirrored from `profiles.full_name`)
- **`user_email`**: TEXT (Mirrored from `profiles.email` if available, or auth)
- **`points`**: INTEGER (Default: `1000`, Constraint: `points >= 0`)
- **`updated_at`**: TIMESTAMPTZ (Auto-update on change)

### Synchronization Logic
We will implement a PostgreSQL trigger that automatically creates a row in `brand_kit_credits` whenever a new entry is added to the `profiles` table, initializing them with 1000 points.

### Secure Point Deduction (RPC)
To prevent client-side point manipulation, a PostgreSQL function will be created:
```sql
CREATE OR REPLACE FUNCTION deduct_brand_kit_points(p_user_id UUID, p_deduction_amount INT DEFAULT 50)
RETURNS JSONB AS $$
DECLARE
    v_current_points INT;
    v_updated_points INT;
BEGIN
    -- Get current points from the new dedicated table
    SELECT points INTO v_current_points FROM brand_kit_credits WHERE user_id = p_user_id;
    
    IF v_current_points >= p_deduction_amount THEN
        UPDATE brand_kit_credits 
        SET points = points - p_deduction_amount,
            updated_at = NOW()
        WHERE user_id = p_user_id
        RETURNING points INTO v_updated_points;
        
        RETURN jsonb_build_object('success', true, 'new_points', v_updated_points);
    ELSE
        RETURN jsonb_build_object('success', false, 'new_points', v_current_points, 'message', 'Insufficient points');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 2. Export Button Logic
The brand kit generator features four export options. Each will be wrapped in a point validation check.

### Targeted Buttons
1. **Download HTML**: Primary export in `ExportStep.tsx`.
2. **Download Dev Spec**: `ExportSpecButton.tsx`.
3. **Download Design Tokens**: `ExportTokensButton.tsx`.
4. **Download Tailwind Config**: `ExportTailwindButton.tsx`.

### Logic Flow
1. User clicks **Download**.
2. Frontend calls `deduct_brand_kit_points` RPC.
3. **If Success**: Trigger file download and update UI point balance.
4. **If Failure (0 Points)**: Prevent download and trigger the **Contact Us Modal**.

## 3. UI/UX Elements

### Point Balance Display
We will integrate a point counter directly above the export buttons to keep the user informed of their remaining credits.

**Placement**: Just above the "Download HTML" button in the `ExportStep` component.
**Style**: Matching the existing typography (e.g., `text-[11px] uppercase tracking-[0.2em]`).

### Export Buttons Structure
The following buttons will be integrated with the point deduction logic:
- **Download HTML** (Primary CTA)
- **Download Dev Spec (.md)**
- **Download Tokens (.json)**
- **Download Tailwind Preset (.cjs)**

### Notifications & Popups
1. **Success Notification**: Once a download is successfully triggered and points are deducted, a toast notification or popup will appear:
   - **Message**: "50 points have been deducted. Remaining: [New Balance]"
2. **Point Exhausted Modal**: If a user clicks a button with `< 50` points:
   - **Pop-up**: A dedicated "Contact Us" modal will appear.
   - **Message**: "You've used all your points. Contact us to refill your brand kit credits."
   - **Action**: "Contact Us" button.

## 4. Implementation Steps
1. **Fetch Balance**: Use a Supabase subscription or real-time fetch to keep the point balance synced in the UI.
2. **Deduction Wrapper**: Create a reusable function `handleDownloadWithPoints(downloadFn)` that:
   - Checks balance.
   - Calls the `deduct_brand_kit_points` RPC.
   - Triggers the `downloadFn` on success.
   - Shows the "50 points deducted" toast.
   - Shows the "Contact Us" modal on failure.

## 5. Documentation Storage
In accordance with new project standards, all Supabase-related files will be stored in:
`utils/spbase-docs/`
- `points-system-plan.md` (This file)
- `points-system-setup.sql` (Migration & RPC script)
