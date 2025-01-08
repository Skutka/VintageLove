/*
  # Fix RLS policies and profile visibility

  1. Changes
    - Update RLS policies for profiles table to allow proper access
    - Fix likes table policies to allow auto-likes
    - Ensure proper access to profile data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can create their own likes" ON likes;

-- Create more permissive profile policies
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Update likes policies to allow system-generated likes
CREATE POLICY "System and users can create likes"
  ON likes FOR INSERT
  WITH CHECK (
    auth.uid() = from_user_id 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE name = 'Eleanor' 
      AND id = from_user_id
    )
  );

CREATE POLICY "Users can view their likes"
  ON likes FOR SELECT
  USING (
    auth.uid() = from_user_id 
    OR auth.uid() = to_user_id
  );