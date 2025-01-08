/*
  # Fix likes table RLS policies

  1. Changes
    - Drop existing likes policies
    - Create new, more permissive policies for likes table
    - Add proper RLS policies for authenticated users
  
  2. Security
    - Enable RLS on likes table
    - Add policies for authenticated users to:
      - Create likes
      - View their own likes
      - Delete their own likes
*/

-- First drop existing policies
DROP POLICY IF EXISTS "Users can create their own likes" ON likes;
DROP POLICY IF EXISTS "System and users can create likes" ON likes;
DROP POLICY IF EXISTS "Users can view their likes" ON likes;
DROP POLICY IF EXISTS "Users can view their own likes" ON likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;

-- Create new policies
CREATE POLICY "Authenticated users can create likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can view likes they're involved in"
  ON likes FOR SELECT
  TO authenticated
  USING (auth.uid() IN (from_user_id, to_user_id));

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = from_user_id);

-- Ensure RLS is enabled
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;