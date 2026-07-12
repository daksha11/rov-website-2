-- SQL Migration: Engineer Role Permissions
-- This script grants the 'engineer' role access to sound-related features.

-- 1. Helper function for staff access (Admins & Engineers)
-- This makes RLS policies cleaner and easier to manage.
CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role IN ('admin', 'engineer') 
    FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update profiles SELECT policy
-- Engineers need to see client names and emails to manage sound tracks.
DROP POLICY IF EXISTS "Staff can view all profiles" ON public.profiles;
CREATE POLICY "Staff can view all profiles"
ON public.profiles
FOR SELECT
USING (
  is_staff() OR auth.uid() = id
);

-- 3. Update audio_tracks policies
-- Allow staff to view and delete tracks
DROP POLICY IF EXISTS "Staff can manage audio tracks" ON public.audio_tracks;
CREATE POLICY "Staff can manage audio tracks"
ON public.audio_tracks
FOR ALL
USING (
  is_staff()
);

-- 4. Update mixed_audio_tracks policies
-- Allow staff to manage delivered tracks
DROP POLICY IF EXISTS "Staff can manage mixed tracks" ON public.mixed_audio_tracks;
CREATE POLICY "Staff can manage mixed tracks"
ON public.mixed_audio_tracks
FOR ALL
USING (
  is_staff()
);

-- 5. Update mixed_track_revisions policies
-- Allow staff to view and resolve revisions
DROP POLICY IF EXISTS "Staff can manage revisions" ON public.mixed_track_revisions;
CREATE POLICY "Staff can manage revisions"
ON public.mixed_track_revisions
FOR ALL
USING (
  is_staff()
);

-- 6. Update existing policies that might conflict
-- If you have specific policies for audio_tracks, ensure they don't block engineers.
-- For example, if there's a policy "Admins can do everything", we've effectively expanded it with is_staff().
