# Plan: User Role Management & Engineer Role

This plan outlines the steps to introduce a new `engineer` role and provide the Admin with the ability to manage user roles directly from the Admin Command Center.

## Objectives
1. Add a new role: `engineer` to the system.
2. Update the Admin Command Center (`/admin`) to include a "Users" tab.
3. Allow Admins to change a user's role between `client`, `engineer`, and `admin`.

## Proposed Changes

### 1. Database (Supabase)
We need to ensure the `profiles` table supports the new role and that Admins have the necessary permissions to update roles.

- **Role Field**: The `role` field in `profiles` is currently a text field (or enum). We will treat it as a string that can take values: `'client'`, `'admin'`, and the new `'engineer'`.
- **RLS Policies**: Ensure Admins can `SELECT` and `UPDATE` all profiles.
- **SQL Migration**: A script will be provided to update any existing constraints if necessary and ensure RLS is correctly configured.

### 2. Admin Command Center (`app/admin/page.tsx`)
- **Implement the "Users" Tab**: Replace the "Coming Soon" placeholder with a functional user management table.
- **User List**: Fetch all users from the `profiles` table.
- **Role Selector**: Add a dropdown (or similar UI element) in the user row to allow an Admin to select a new role for that user.
- **Update Logic**: Implement a function to update the user's role in Supabase when changed in the UI.
- **Search & Filter**: Maintain the existing search functionality to work across all users.

### 3. Role-Based Access Control
- **Engineer Role**: For now, the `engineer` role will have a similar "view-only" experience as the `client` role in the portal, but can be distinguished in the backend for future feature toggling.
- **Redirection**: Ensure the `engineer` role is correctly handled in `app/admin/page.tsx` (it should probably be redirected to `/portal` like clients).

## Technical Details

### SQL Migration (`utils/spbase-docs/user-role-management.sql`)
```sql
-- Use the existing is_admin() function for role-based updates
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO public
USING (
  is_admin()
)
WITH CHECK (
  is_admin()
);
```

### Admin Page Update
- **State**: Add a `savingRoleId` state to show loading indicators during role updates.
- **Function**: `handleRoleChange(userId: string, newRole: string)`
- **UI**: A styled `<select>` or custom dropdown within the "Users" tab table.

## Verification Plan
1. **Database**: Run the SQL script in Supabase SQL Editor.
2. **Admin UI**:
   - Navigate to `/admin` as an Admin.
   - Go to the "Users" tab.
   - Verify all users are listed.
   - Change a user's role from `client` to `engineer`.
   - Verify the change persists in the database.
   - Change a user's role to `admin` and verify they can now access the Admin Command Center.
3. **Portal UI**:
   - Log in as an `engineer` and verify they can see the portal content.
