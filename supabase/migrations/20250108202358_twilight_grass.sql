/*
  # Update profiles RLS policy

  1. Changes
    - Drop existing RLS policy for profile viewing
    - Add new policy to allow viewing of all visible profiles
    - Keep existing policies for insert/update
*/

-- Drop the existing select policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Create new policy that allows viewing all visible profiles
CREATE POLICY "Anyone can view visible profiles"
  ON profiles FOR SELECT
  USING (profile_visible = true);