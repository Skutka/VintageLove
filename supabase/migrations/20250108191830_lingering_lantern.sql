/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text)
      - `age` (integer)
      - `gender` (text)
      - `city` (text)
      - `country` (text)
      - `height` (integer)
      - `hair_color` (text)
      - `eye_color` (text)
      - `interests` (text[])
      - `bio` (text)
      - `profile_visible` (boolean)
      - `profile_image` (text)

    - `likes`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `from_user_id` (uuid, references profiles)
      - `to_user_id` (uuid, references profiles)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  name text,
  age integer,
  gender text,
  city text,
  country text,
  height integer,
  hair_color text,
  eye_color text,
  interests text[],
  bio text,
  profile_visible boolean DEFAULT true,
  profile_image text
);

-- Create likes table
CREATE TABLE likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  from_user_id uuid REFERENCES profiles ON DELETE CASCADE,
  to_user_id uuid REFERENCES profiles ON DELETE CASCADE,
  UNIQUE(from_user_id, to_user_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (profile_visible = true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Likes policies
CREATE POLICY "Users can view their own likes"
  ON likes FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create their own likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  USING (auth.uid() = from_user_id);