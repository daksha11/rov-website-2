-- SQL Migration for User Role Management
-- This script prepares the profiles table for the new 'engineer' role and allows admins to manage roles.

-- 1. Ensure the 'role' column can handle 'engineer'
-- (Assuming it's a text column based on the codebase)

-- 2. Update RLS Policies for the 'profiles' table
-- The existing SELECT policy uses is_admin(). We will keep that pattern.

-- Ensure that Admins can update any profile (specifically the role)
-- We use the same is_admin() function that is already present in your database.
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

-- 3. (Optional) Initialize some default roles if they are null
UPDATE public.profiles SET role = 'client' WHERE role IS NULL;

-- 4. Verify existing profiles
-- SELECT id, full_name, email, role FROM public.profiles;
