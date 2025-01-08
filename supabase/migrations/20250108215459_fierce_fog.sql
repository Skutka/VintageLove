/*
  # Add senior profiles

  1. Changes
    - Clear existing data
    - Add three senior profiles (60+ years old)
    - Set up auto-like trigger for Grace to like new users

  2. New Profiles
    - Margaret (65) - Retired literature professor
    - Robert (68) - Retired architect
    - Grace (63) - Former art curator
*/

-- First, delete existing data
TRUNCATE messages, likes, notifications CASCADE;
DELETE FROM profiles;
DELETE FROM auth.users;

-- Create senior profiles
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES 
  (gen_random_uuid(), 'margaret@example.com', crypt('password123', gen_salt('bf')), now()),
  (gen_random_uuid(), 'robert@example.com', crypt('password123', gen_salt('bf')), now()),
  (gen_random_uuid(), 'grace@example.com', crypt('password123', gen_salt('bf')), now());

WITH new_users AS (
  SELECT id, email FROM auth.users WHERE email IN ('margaret@example.com', 'robert@example.com', 'grace@example.com')
)
INSERT INTO profiles (
  id,
  name,
  age,
  gender,
  city,
  country,
  height,
  hair_color,
  eye_color,
  interests,
  bio,
  profile_image,
  profile_photos,
  profile_visible
)
SELECT 
  id,
  CASE 
    WHEN email = 'margaret@example.com' THEN 'Margaret'
    WHEN email = 'robert@example.com' THEN 'Robert'
    ELSE 'Grace'
  END,
  CASE 
    WHEN email = 'margaret@example.com' THEN 65
    WHEN email = 'robert@example.com' THEN 68
    ELSE 63
  END,
  CASE 
    WHEN email = 'robert@example.com' THEN 'male'
    ELSE 'female'
  END,
  CASE 
    WHEN email = 'margaret@example.com' THEN 'Bath'
    WHEN email = 'robert@example.com' THEN 'Victoria'
    ELSE 'Florence'
  END,
  CASE 
    WHEN email = 'margaret@example.com' THEN 'UK'
    WHEN email = 'robert@example.com' THEN 'Canada'
    ELSE 'Italy'
  END,
  CASE 
    WHEN email = 'margaret@example.com' THEN 165
    WHEN email = 'robert@example.com' THEN 178
    ELSE 170
  END,
  CASE 
    WHEN email = 'grace@example.com' THEN 'Silver'
    ELSE 'Grey'
  END,
  CASE 
    WHEN email = 'margaret@example.com' THEN 'Blue'
    WHEN email = 'robert@example.com' THEN 'Brown'
    ELSE 'Green'
  END,
  CASE 
    WHEN email = 'margaret@example.com' THEN ARRAY['Gardening', 'Classical Music', 'Travel', 'Cooking']
    WHEN email = 'robert@example.com' THEN ARRAY['Photography', 'Hiking', 'Wine Tasting', 'History']
    ELSE ARRAY['Art', 'Cooking', 'Travel', 'Languages']
  END,
  CASE 
    WHEN email = 'margaret@example.com' THEN 'Retired literature professor with a passion for gardening and classical music. Looking for a companion to share life''s simple pleasures. Love hosting dinner parties and attending concerts.'
    WHEN email = 'robert@example.com' THEN 'Retired architect who found a second calling in nature photography. Love exploring Vancouver Island''s trails and sharing stories over a glass of wine. Seeking someone to share adventures with.'
    ELSE 'Former art curator who fell in love with Italy and never left. Teaching English and hosting cooking classes. Looking for someone to explore Italian culture and create new memories together.'
  END,
  CASE 
    WHEN email = 'margaret@example.com' THEN 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4'
    WHEN email = 'robert@example.com' THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    ELSE 'https://images.unsplash.com/photo-1593614202631-4dc0556be54c'
  END,
  CASE 
    WHEN email = 'margaret@example.com' THEN ARRAY['https://images.unsplash.com/photo-1571260899304-425eee4c7efc', 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8']
    WHEN email = 'robert@example.com' THEN ARRAY['https://images.unsplash.com/photo-1559630842-6ca682a72a5a', 'https://images.unsplash.com/photo-1558896000-78f5c0215ed8']
    ELSE ARRAY['https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8', 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4']
  END,
  true
FROM new_users;

-- Create function to auto-like new users
CREATE OR REPLACE FUNCTION auto_like_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO likes (from_user_id, to_user_id)
  SELECT id, NEW.id
  FROM profiles
  WHERE name = 'Grace'
  AND NOT EXISTS (
    SELECT 1 FROM likes
    WHERE from_user_id = profiles.id AND to_user_id = NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS auto_like_new_user_trigger ON profiles;
CREATE TRIGGER auto_like_new_user_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_like_new_user();