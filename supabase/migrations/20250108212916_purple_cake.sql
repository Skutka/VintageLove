-- First, delete existing data
DELETE FROM messages;
DELETE FROM likes;
DELETE FROM notifications;
DELETE FROM profiles;
DELETE FROM auth.users;

-- Create new users
DO $$
DECLARE
  liam_id uuid;
  aria_id uuid;
  kai_id uuid;
BEGIN
  -- Create auth users first
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'liam@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO liam_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'aria@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO aria_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'kai@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO kai_id;

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
    liam_id,
    'Liam',
    31,
    'male',
    'Edinburgh',
    'Scotland',
    185,
    'Brown',
    'Green',
    ARRAY['Photography', 'Hiking', 'Whiskey', 'History'],
    'Documentary photographer with a passion for Scottish history and wilderness. Looking for someone to share adventures and stories over a fine whiskey.',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
    ARRAY[
      'https://images.unsplash.com/photo-1488161628813-04466f872be2',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7'
    ],
    true
  ),
  (
    aria_id,
    'Aria',
    28,
    'female',
    'Kyoto',
    'Japan',
    167,
    'Black',
    'Brown',
    ARRAY['Traditional Arts', 'Tea Ceremony', 'Gardening', 'Poetry'],
    'Modern artist blending traditional Japanese arts with contemporary expression. Tea ceremony practitioner seeking meaningful connections through shared appreciation of culture.',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
    ARRAY[
      'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56',
      'https://images.unsplash.com/photo-1524638431109-93d95c968f03',
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce'
    ],
    true
  ),
  (
    kai_id,
    'Kai',
    33,
    'male',
    'Honolulu',
    'USA',
    178,
    'Black',
    'Brown',
    ARRAY['Surfing', 'Marine Biology', 'Conservation', 'Music'],
    'Marine biologist and professional surfer dedicated to ocean conservation. When not studying coral reefs, you''ll find me catching waves or playing ukulele at sunset.',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
    ARRAY[
      'https://images.unsplash.com/photo-1488161628813-04466f872be2',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7'
    ],
    true
  );
END $$;