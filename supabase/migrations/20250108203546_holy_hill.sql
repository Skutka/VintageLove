-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can view visible profiles" ON profiles;

-- Create a more permissive policy for viewing profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);  -- This allows viewing all profiles, while profile_visible field can be used for filtering in the application