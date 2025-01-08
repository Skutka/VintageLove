/*
  # Add sample profiles with auth users

  1. New Data
    - Creates auth users first
    - Adds corresponding profiles with complete information
    - Each profile includes:
      - Basic info (name, age, gender)
      - Location (city, country)
      - Physical characteristics
      - Interests and bio
      - Profile images
*/

DO $$
DECLARE
  sarah_id uuid;
  michael_id uuid;
  elena_id uuid;
  david_id uuid;
  lisa_id uuid;
BEGIN
  -- Create auth users first
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'sarah@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO sarah_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'michael@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO michael_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'elena@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO elena_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'david@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO david_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'lisa@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO lisa_id;

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
    sarah_id,
    'Sarah',
    26,
    'female',
    'London',
    'UK',
    165,
    'Brown',
    'Green',
    ARRAY['Travel', 'Photography', 'Music'],
    'Adventure seeker and photography enthusiast. Love exploring new places and capturing moments.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    ARRAY['https://images.unsplash.com/photo-1534528741775-53994a69daeb'],
    true
  ),
  (
    michael_id,
    'Michael',
    30,
    'male',
    'New York',
    'USA',
    182,
    'Black',
    'Brown',
    ARRAY['Sports', 'Tech', 'Food'],
    'Tech entrepreneur who loves staying active. Always up for trying new restaurants.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    ARRAY['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'],
    true
  ),
  (
    elena_id,
    'Elena',
    28,
    'female',
    'Barcelona',
    'Spain',
    170,
    'Blonde',
    'Blue',
    ARRAY['Art', 'Dance', 'Travel'],
    'Artist and dance instructor. Passionate about Mediterranean culture and creative expression.',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    ARRAY['https://images.unsplash.com/photo-1517841905240-472988babdf9'],
    true
  ),
  (
    david_id,
    'David',
    32,
    'male',
    'Berlin',
    'Germany',
    178,
    'Brown',
    'Hazel',
    ARRAY['Music', 'Movies', 'Photography'],
    'Musician and film buff. Looking for someone to share adventures with.',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
    ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'],
    true
  ),
  (
    lisa_id,
    'Lisa',
    25,
    'female',
    'Amsterdam',
    'Netherlands',
    168,
    'Red',
    'Green',
    ARRAY['Tech', 'Books', 'Travel'],
    'Software developer with a passion for literature and exploring new cities.',
    'https://images.unsplash.com/photo-1517365830460-955ce3ccd263',
    ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e'],
    true
  );
END $$;