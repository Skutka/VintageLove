/*
  # Fix likes table RLS policies - Final Version

  1. Changes
    - Drop all existing likes policies to ensure clean slate
    - Create new, simplified RLS policies with proper authentication checks
    - Add explicit enable RLS statement
  
  2. Security
    - Enable RLS on likes table
    - Add policies for:
      - INSERT: Only authenticated users can create likes where they are the sender
      - SELECT: Users can view likes they're involved in (as sender or receiver)
      - DELETE: Users can delete their own likes
    - All policies require explicit authentication role check
*/

-- First drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own likes" ON likes;
DROP POLICY IF EXISTS "System and users can create likes" ON likes;
DROP POLICY IF EXISTS "Users can view their likes" ON likes;
DROP POLICY IF EXISTS "Users can view their own likes" ON likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;
DROP POLICY IF EXISTS "Authenticated users can create likes" ON likes;
DROP POLICY IF EXISTS "Users can view likes they're involved in" ON likes;
DROP POLICY IF EXISTS "allow_insert_own_likes" ON likes;
DROP POLICY IF EXISTS "allow_select_involved_likes" ON likes;
DROP POLICY IF EXISTS "allow_delete_own_likes" ON likes;

-- Ensure RLS is enabled
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies with explicit authentication checks
CREATE POLICY "authenticated_insert_own_likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() = from_user_id
  );

CREATE POLICY "authenticated_select_involved_likes"
  ON likes FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    (auth.uid() = from_user_id OR auth.uid() = to_user_id)
  );

CREATE POLICY "authenticated_delete_own_likes"
  ON likes FOR DELETE
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    auth.uid() = from_user_id
  );

-- Grant necessary permissions to authenticated users
GRANT ALL ON likes TO authenticated;