/*
  # Fix likes table RLS policies

  1. Changes
    - Drop all existing likes policies to avoid conflicts
    - Create new, simplified RLS policies for likes table
    - Ensure proper authentication checks
  
  2. Security
    - Enable RLS on likes table
    - Add policies for authenticated users to:
      - Create likes (when they are the sender)
      - View likes they're involved in (as sender or receiver)
      - Delete their own likes
*/

-- First drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own likes" ON likes;
DROP POLICY IF EXISTS "System and users can create likes" ON likes;
DROP POLICY IF EXISTS "Users can view their likes" ON likes;
DROP POLICY IF EXISTS "Users can view their own likes" ON likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;
DROP POLICY IF EXISTS "Authenticated users can create likes" ON likes;
DROP POLICY IF EXISTS "Users can view likes they're involved in" ON likes;

-- Create new simplified policies
CREATE POLICY "allow_insert_own_likes"
  ON likes FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.uid() = from_user_id
  );

CREATE POLICY "allow_select_involved_likes"
  ON likes FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    (auth.uid() = from_user_id OR auth.uid() = to_user_id)
  );

CREATE POLICY "allow_delete_own_likes"
  ON likes FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    auth.uid() = from_user_id
  );

-- Ensure RLS is enabled
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;