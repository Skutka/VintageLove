/*
  # Add sample profiles with auth users

  1. Changes
    - Create auth users for sample profiles
    - Add corresponding profile records
    - Each profile has multiple photos and detailed information
*/

-- Create users in auth.users table first
DO $$
DECLARE
  emma_id uuid;
  alex_id uuid;
  sofia_id uuid;
  james_id uuid;
  mia_id uuid;
BEGIN
  -- Create auth users
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'emma@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO emma_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'alex@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO alex_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'sofia@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO sofia_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'james@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO james_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'mia@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO mia_id;

  -- Create corresponding profiles
  INSERT INTO profiles (
    id, name, age, gender, city, country, height, hair_color, eye_color, 
    interests, bio, profile_image, profile_photos, profile_visible
  ) VALUES (
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
    'Passionate photographer and art lover. Always seeking new adventures and cultural experiences. Love exploring local cuisines and capturing moments through my lens.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    ARRAY[
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1'
    ],
    true
  );

  INSERT INTO profiles (
    id, name, age, gender, city, country, height, hair_color, eye_color, 
    interests, bio, profile_image, profile_photos, profile_visible
  ) VALUES (
    alex_id,
    'Alex',
    32,
    'male',
    'New York',
    'USA',
    183,
    'Brown',
    'Green',
    ARRAY['Tech', 'Music', 'Sports', 'Travel'],
    'Software engineer by day, musician by night. Love staying active and exploring the city. Always up for a good concert or a tech meetup.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    ARRAY[
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce'
    ],
    true
  );

  INSERT INTO profiles (
    id, name, age, gender, city, country, height, hair_color, eye_color, 
    interests, bio, profile_image, profile_photos, profile_visible
  ) VALUES (
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
    'Dance instructor with a passion for life. Love Spanish cuisine and Mediterranean culture. Always ready for a spontaneous adventure or a cozy movie night.',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    ARRAY[
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      'https://images.unsplash.com/photo-1517365830460-955ce3ccd263',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e'
    ],
    true
  );

  INSERT INTO profiles (
    id, name, age, gender, city, country, height, hair_color, eye_color, 
    interests, bio, profile_image, profile_photos, profile_visible
  ) VALUES (
    james_id,
    'James',
    30,
    'male',
    'London',
    'UK',
    180,
    'Black',
    'Brown',
    ARRAY['Sports', 'Photography', 'Travel', 'Food'],
    'Professional photographer who loves sports and outdoor adventures. Always looking for new perspectives, both through my lens and in life.',
    'https://images.unsplash.com/photo-1488161628813-04466f872be2',
    ARRAY[
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'
    ],
    true
  );

  INSERT INTO profiles (
    id, name, age, gender, city, country, height, hair_color, eye_color, 
    interests, bio, profile_image, profile_photos, profile_visible
  ) VALUES (
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
    'UX designer with a love for Japanese culture and modern art. Passionate about creating beautiful experiences, both digital and real.',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    ARRAY[
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      'https://images.unsplash.com/photo-1517365830460-955ce3ccd263'
    ],
    true
  );
END $$;