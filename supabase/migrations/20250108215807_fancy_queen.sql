/*
  # Fix RLS policies and profile visibility

  1. Changes
    - Update RLS policies for profiles table to allow proper access
    - Fix likes table policies to allow auto-likes
    - Ensure proper access to profile data
*/

-- First, ensure we can recreate policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone' AND tablename = 'profiles') THEN
    DROP POLICY "Public profiles are viewable by everyone" ON profiles;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own likes' AND tablename = 'likes') THEN
    DROP POLICY "Users can create their own likes" ON likes;
  END IF;
END $$;

-- Create more permissive profile policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view profiles' AND tablename = 'profiles') THEN
    CREATE POLICY "Anyone can view profiles"
      ON profiles FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE
      USING (auth.uid() = id);
  END IF;
END $$;

-- Update likes policies to allow system-generated likes
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'System and users can create likes' AND tablename = 'likes') THEN
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
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their likes' AND tablename = 'likes') THEN
    CREATE POLICY "Users can view their likes"
      ON likes FOR SELECT
      USING (
        auth.uid() = from_user_id 
        OR auth.uid() = to_user_id
      );
  END IF;
END $$;