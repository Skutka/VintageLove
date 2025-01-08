/*
  # Add sample profiles
  
  1. Changes
    - Add 5 new users with complete profiles
    - Include profile pictures and additional photos
    - Set up diverse interests and locations
*/

DO $$
DECLARE
  emma_id uuid;
  james_id uuid;
  sofia_id uuid;
  alex_id uuid;
  mia_id uuid;
BEGIN
  -- Create auth users first
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'emma@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO emma_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'james@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO james_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'sofia@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO sofia_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'alex@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO alex_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'mia@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO mia_id;

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
    emma_id,
    'Emma',
    28,
    'female',
    'Paris',
    'France',
    168,
    'Blonde',
    'Blue',
    ARRAY['Travel', 'Photography', 'Art', 'Food'],
    'Passionate photographer and art lover. Always seeking new adventures and cultural experiences.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    ARRAY[
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9'
    ],
    true
  ),
  (
    james_id,
    'James',
    32,
    'male',
    'London',
    'UK',
    183,
    'Brown',
    'Green',
    ARRAY['Sports', 'Music', 'Tech', 'Travel'],
    'Software engineer who loves staying active. Always up for a good concert or hiking adventure.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    ARRAY[
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    ],
    true
  ),
  (
    sofia_id,
    'Sofia',
    25,
    'female',
    'Barcelona',
    'Spain',
    165,
    'Brown',
    'Brown',
    ARRAY['Dance', 'Food', 'Movies', 'Art'],
    'Dance instructor with a passion for life. Love Spanish cuisine and Mediterranean culture.',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    ARRAY[
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      'https://images.unsplash.com/photo-1517365830460-955ce3ccd263'
    ],
    true
  ),
  (
    alex_id,
    'Alex',
    30,
    'male',
    'New York',
    'USA',
    180,
    'Black',
    'Brown',
    ARRAY['Tech', 'Photography', 'Travel', 'Food'],
    'Tech entrepreneur who loves exploring the city. Always looking for new perspectives and experiences.',
    'https://images.unsplash.com/photo-1488161628813-04466f872be2',
    ARRAY[
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'
    ],
    true
  ),
  (
    mia_id,
    'Mia',
    27,
    'female',
    'Tokyo',
    'Japan',
    162,
    'Black',
    'Brown',
    ARRAY['Tech', 'Art', 'Music', 'Food'],
    'UX designer with a love for Japanese culture and modern art. Passionate about creating beautiful experiences.',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    ARRAY[
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1'
    ],
    true
  );
END $$;