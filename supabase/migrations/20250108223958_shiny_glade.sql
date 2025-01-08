/*
  # Create senior users with auto-liker
  
  1. New Users
    - Create 3 senior users (60+ years old)
    - Eleanor automatically likes all other users
  
  2. Changes
    - Clean existing data
    - Create new users with proper profiles
    - Set up Eleanor's likes with duplicate checking
    - Create trigger for future auto-likes
*/

-- First, delete existing data
DELETE FROM messages;
DELETE FROM notifications;
DELETE FROM likes;
DELETE FROM profiles;
DELETE FROM auth.users;

-- Create senior users
DO $$
DECLARE
  eleanor_id uuid;
  charles_id uuid;
  beatrice_id uuid;
BEGIN
  -- Create auth users first
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'eleanor@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO eleanor_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'charles@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO charles_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'beatrice@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO beatrice_id;

  -- Create corresponding profiles
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
  ) VALUES
  (
    eleanor_id,
    'Eleanor',
    68,
    'female',
    'Cambridge',
    'UK',
    165,
    'Silver',
    'Blue',
    ARRAY['Classical Music', 'Literature', 'Tea', 'Gardening', 'Travel'],
    'Retired literature professor with a passion for classical music and gardening. Looking for a companion to share lifes cultural pleasures. I believe its never too late for romance and meaningful connections.',
    'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4',
    ARRAY[
      'https://images.unsplash.com/photo-1571260899304-425eee4c7efc',
      'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8'
    ],
    true
  ),
  (
    charles_id,
    'Charles',
    72,
    'male',
    'Edinburgh',
    'UK',
    178,
    'Grey',
    'Green',
    ARRAY['History', 'Photography', 'Wine Tasting', 'Jazz', 'Travel'],
    'Retired architect and history enthusiast. Love capturing lifes beautiful moments through my lens and exploring historic places. Seeking someone to share stories and adventures with.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    ARRAY[
      'https://images.unsplash.com/photo-1559630842-6ca682a72a5a',
      'https://images.unsplash.com/photo-1558896000-78f5c0215ed8'
    ],
    true
  ),
  (
    beatrice_id,
    'Beatrice',
    65,
    'female',
    'Bath',
    'UK',
    162,
    'Silver',
    'Brown',
    ARRAY['Art', 'Cooking', 'Languages', 'Travel', 'Nature'],
    'Former art curator with a love for cooking and languages. Passionate about exploring different cultures through food and conversation. Looking for someone to share lifes flavors with.',
    'https://images.unsplash.com/photo-1593614202631-4dc0556be54c',
    ARRAY[
      'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8',
      'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4'
    ],
    true
  );

  -- Make Eleanor like everyone (with duplicate check)
  INSERT INTO likes (from_user_id, to_user_id)
  SELECT eleanor_id, id
  FROM profiles
  WHERE id != eleanor_id
  AND NOT EXISTS (
    SELECT 1 FROM likes
    WHERE from_user_id = eleanor_id AND to_user_id = profiles.id
  );

END $$;

-- Create function to auto-like new users
CREATE OR REPLACE FUNCTION auto_like_new_user()
RETURNS TRIGGER AS $$
DECLARE
  eleanor_id uuid;
BEGIN
  -- Get Eleanor's ID
  SELECT id INTO eleanor_id
  FROM profiles
  WHERE name = 'Eleanor'
  LIMIT 1;

  -- If Eleanor exists and the new profile isn't Eleanor herself
  IF eleanor_id IS NOT NULL AND NEW.id != eleanor_id THEN
    -- Insert like only if it doesn't exist
    INSERT INTO likes (from_user_id, to_user_id)
    SELECT eleanor_id, NEW.id
    WHERE NOT EXISTS (
      SELECT 1 FROM likes
      WHERE from_user_id = eleanor_id AND to_user_id = NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-liking
DROP TRIGGER IF EXISTS auto_like_new_user_trigger ON profiles;
CREATE TRIGGER auto_like_new_user_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_like_new_user();