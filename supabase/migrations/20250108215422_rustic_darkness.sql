-- First, delete existing data
DELETE FROM messages;
DELETE FROM likes;
DELETE FROM notifications;
DELETE FROM profiles;
DELETE FROM auth.users;

-- Create new senior users
DO $$
DECLARE
  margaret_id uuid;
  robert_id uuid;
  grace_id uuid;
BEGIN
  -- Create auth users first
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'margaret@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO margaret_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'robert@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO robert_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'grace@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO grace_id;

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
    margaret_id,
    'Margaret',
    65,
    'female',
    'Bath',
    'UK',
    165,
    'Grey',
    'Blue',
    ARRAY['Gardening', 'Classical Music', 'Travel', 'Cooking'],
    'Retired literature professor with a passion for gardening and classical music. Looking for a companion to share life''s simple pleasures. Love hosting dinner parties and attending concerts.',
    'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4',
    ARRAY[
      'https://images.unsplash.com/photo-1571260899304-425eee4c7efc',
      'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8'
    ],
    true
  ),
  (
    robert_id,
    'Robert',
    68,
    'male',
    'Victoria',
    'Canada',
    178,
    'Grey',
    'Brown',
    ARRAY['Photography', 'Hiking', 'Wine Tasting', 'History'],
    'Retired architect who found a second calling in nature photography. Love exploring Vancouver Island''s trails and sharing stories over a glass of wine. Seeking someone to share adventures with.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    ARRAY[
      'https://images.unsplash.com/photo-1559630842-6ca682a72a5a',
      'https://images.unsplash.com/photo-1558896000-78f5c0215ed8'
    ],
    true
  ),
  (
    grace_id,
    'Grace',
    63,
    'female',
    'Florence',
    'Italy',
    170,
    'Silver',
    'Green',
    ARRAY['Art', 'Cooking', 'Travel', 'Languages'],
    'Former art curator who fell in love with Italy and never left. Teaching English and hosting cooking classes. Looking for someone to explore Italian culture and create new memories together.',
    'https://images.unsplash.com/photo-1593614202631-4dc0556be54c',
    ARRAY[
      'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8',
      'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4'
    ],
    true
  );

  -- Make Grace like the current user (assuming they will sign up)
  -- This will be activated when the user creates their profile
  CREATE OR REPLACE FUNCTION public.auto_like_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO likes (from_user_id, to_user_id)
    SELECT grace_id, NEW.id
    WHERE NOT EXISTS (
      SELECT 1 FROM likes
      WHERE from_user_id = grace_id AND to_user_id = NEW.id
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Create trigger to automatically like new users
  DROP TRIGGER IF EXISTS auto_like_new_user_trigger ON profiles;
  CREATE TRIGGER auto_like_new_user_trigger
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION auto_like_new_user();
END $$;