/*
  # Fix likes table RLS policies - Final Version

  1. Changes
    - Drop all existing likes policies
    - Create new, simplified RLS policies with proper authentication checks
    - Add explicit enable RLS statement
    - Add proper grants
  
  2. Security
    - Enable RLS on likes table
    - Add policies for:
      - INSERT: Only authenticated users can create likes
      - SELECT: Users can view likes they're involved in
      - DELETE: Users can delete their own likes
*/

-- First drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "authenticated_insert_own_likes" ON likes;
DROP POLICY IF EXISTS "authenticated_select_involved_likes" ON likes;
DROP POLICY IF EXISTS "authenticated_delete_own_likes" ON likes;

-- Ensure RLS is enabled with a clean slate
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies
CREATE POLICY "likes_insert_policy"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = from_user_id
  );

CREATE POLICY "likes_select_policy"
  ON likes FOR SELECT
  TO authenticated
  USING (
    auth.uid() = from_user_id OR auth.uid() = to_user_id
  );

CREATE POLICY "likes_delete_policy"
  ON likes FOR DELETE
  TO authenticated
  USING (
    auth.uid() = from_user_id
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON likes TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;