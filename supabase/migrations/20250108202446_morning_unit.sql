/*
  # Add more sample profiles

  1. New Profiles
    - Add 5 new users with complete profiles
    - Include diverse locations, interests, and characteristics
    - Add high-quality profile images and photos
*/

DO $$
DECLARE
  olivia_id uuid;
  kai_id uuid;
  isabella_id uuid;
  marcus_id uuid;
  sophia_id uuid;
BEGIN
  -- Create auth users first
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'olivia@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO olivia_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'kai@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO kai_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'isabella@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO isabella_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'marcus@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO marcus_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'sophia@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO sophia_id;

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
    olivia_id,
    'Olivia',
    27,
    'female',
    'Sydney',
    'Australia',
    169,
    'Brown',
    'Brown',
    ARRAY['Surfing', 'Yoga', 'Photography', 'Travel'],
    'Ocean lover and yoga instructor. Always chasing sunsets and good vibes. Looking for someone to share adventures with.',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
    ARRAY[
      'https://images.unsplash.com/photo-1604072366595-e75dc92d6bdc',
      'https://images.unsplash.com/photo-1597223557154-721c1cecc4b0'
    ],
    true
  ),
  (
    kai_id,
    'Kai',
    31,
    'male',
    'Vancouver',
    'Canada',
    185,
    'Black',
    'Brown',
    ARRAY['Hiking', 'Photography', 'Cooking', 'Music'],
    'Professional chef with a passion for outdoor adventures. Love capturing nature through my lens and creating fusion cuisine.',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    ARRAY[
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    ],
    true
  ),
  (
    isabella_id,
    'Isabella',
    29,
    'female',
    'Milan',
    'Italy',
    172,
    'Black',
    'Brown',
    ARRAY['Fashion', 'Art', 'Travel', 'Wine'],
    'Fashion designer with a love for Italian art and culture. Seeking someone who appreciates the beauty in life''s details.',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    ARRAY[
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e'
    ],
    true
  ),
  (
    marcus_id,
    'Marcus',
    33,
    'male',
    'Stockholm',
    'Sweden',
    188,
    'Blonde',
    'Blue',
    ARRAY['Tech', 'Skiing', 'Design', 'Travel'],
    'UX designer who loves Nordic minimalism and winter sports. Looking for someone to explore the world with.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    ARRAY[
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'
    ],
    true
  ),
  (
    sophia_id,
    'Sophia',
    26,
    'female',
    'Singapore',
    'Singapore',
    165,
    'Black',
    'Brown',
    ARRAY['Tech', 'Dance', 'Food', 'Travel'],
    'Tech startup founder by day, dance instructor by night. Passionate about Asian fusion cuisine and building meaningful connections.',
    'https://images.unsplash.com/photo-1517365830460-955ce3ccd263',
    ARRAY[
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9'
    ],
    true
  );
END $$;