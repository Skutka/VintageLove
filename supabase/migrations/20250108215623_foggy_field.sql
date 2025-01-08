/*
  # Add senior profiles with auto-like feature

  1. Changes
    - Add three senior profiles (60+ years old)
    - Set up auto-like trigger for Eleanor to like new users

  2. New Profiles
    - Eleanor (67) - Retired librarian who loves literature and travel
    - Victor (72) - Former jazz musician
    - Dorothy (65) - Retired botanist
*/

-- Create senior profiles
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES 
  (gen_random_uuid(), 'eleanor@example.com', crypt('password123', gen_salt('bf')), now()),
  (gen_random_uuid(), 'victor@example.com', crypt('password123', gen_salt('bf')), now()),
  (gen_random_uuid(), 'dorothy@example.com', crypt('password123', gen_salt('bf')), now());

WITH new_users AS (
  SELECT id, email FROM auth.users WHERE email IN ('eleanor@example.com', 'victor@example.com', 'dorothy@example.com')
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
    WHEN email = 'eleanor@example.com' THEN 'Eleanor'
    WHEN email = 'victor@example.com' THEN 'Victor'
    ELSE 'Dorothy'
  END,
  CASE 
    WHEN email = 'eleanor@example.com' THEN 67
    WHEN email = 'victor@example.com' THEN 72
    ELSE 65
  END,
  CASE 
    WHEN email = 'victor@example.com' THEN 'male'
    ELSE 'female'
  END,
  CASE 
    WHEN email = 'eleanor@example.com' THEN 'Oxford'
    WHEN email = 'victor@example.com' THEN 'New Orleans'
    ELSE 'Portland'
  END,
  CASE 
    WHEN email = 'eleanor@example.com' THEN 'UK'
    WHEN email = 'victor@example.com' THEN 'USA'
    ELSE 'USA'
  END,
  CASE 
    WHEN email = 'eleanor@example.com' THEN 165
    WHEN email = 'victor@example.com' THEN 180
    ELSE 168
  END,
  CASE 
    WHEN email = 'eleanor@example.com' THEN 'Silver'
    WHEN email = 'victor@example.com' THEN 'Grey'
    ELSE 'White'
  END,
  CASE 
    WHEN email = 'eleanor@example.com' THEN 'Blue'
    WHEN email = 'victor@example.com' THEN 'Brown'
    ELSE 'Green'
  END,
  CASE 
    WHEN email = 'eleanor@example.com' THEN ARRAY['Literature', 'Travel', 'Classical Music', 'Tea']
    WHEN email = 'victor@example.com' THEN ARRAY['Jazz', 'Music', 'Food', 'Photography']
    ELSE ARRAY['Gardening', 'Botany', 'Nature', 'Reading']
  END,
  CASE 
    WHEN email = 'eleanor@example.com' THEN 'Retired librarian with a passion for classic literature and world travel. Looking for someone to share stories and adventures with over a proper cup of tea.'
    WHEN email = 'victor@example.com' THEN 'Former jazz musician who still plays at local venues. Love sharing stories from my touring days and exploring new restaurants. Music is my eternal companion.'
    ELSE 'Retired botanist who never lost the wonder of nature. Spend my days tending to my garden and studying local flora. Would love to share my knowledge and passion with someone special.'
  END,
  CASE 
    WHEN email = 'eleanor@example.com' THEN 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4'
    WHEN email = 'victor@example.com' THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    ELSE 'https://images.unsplash.com/photo-1593614202631-4dc0556be54c'
  END,
  CASE 
    WHEN email = 'eleanor@example.com' THEN ARRAY['https://images.unsplash.com/photo-1571260899304-425eee4c7efc', 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8']
    WHEN email = 'victor@example.com' THEN ARRAY['https://images.unsplash.com/photo-1559630842-6ca682a72a5a', 'https://images.unsplash.com/photo-1558896000-78f5c0215ed8']
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
  WHERE name = 'Eleanor'
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