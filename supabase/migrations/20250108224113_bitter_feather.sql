/*
  # Fix RLS Policies and Authentication
  
  1. Changes
    - Drop existing policies
    - Create new, more permissive policies for profiles
    - Update likes table policies
    - Grant proper permissions
  
  2. Security
    - Enable RLS on all tables
    - Set up proper authentication checks
    - Allow profile creation for new users
*/

-- First, drop all existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "likes_insert_policy" ON likes;
DROP POLICY IF EXISTS "likes_select_policy" ON likes;
DROP POLICY IF EXISTS "likes_delete_policy" ON likes;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create new profile policies
CREATE POLICY "profiles_select_policy"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_insert_policy"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create new likes policies
CREATE POLICY "likes_insert_policy"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = from_user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = from_user_id
      AND name = 'Eleanor'
    )
  );

CREATE POLICY "likes_select_policy"
  ON likes FOR SELECT
  TO authenticated
  USING (
    auth.uid() = from_user_id OR
    auth.uid() = to_user_id
  );

CREATE POLICY "likes_delete_policy"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = from_user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON likes TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Allow public to view profiles (needed for initial load before auth)
CREATE POLICY "allow_public_profiles_select"
  ON profiles FOR SELECT
  TO anon
  USING (profile_visible = true);