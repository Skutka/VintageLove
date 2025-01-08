DO $$
DECLARE
  lucas_id uuid;
  zara_id uuid;
  noah_id uuid;
BEGIN
  -- Create auth users first
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'lucas@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO lucas_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'zara@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO zara_id;

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES 
    (gen_random_uuid(), 'noah@example.com', crypt('password123', gen_salt('bf')), now())
  RETURNING id INTO noah_id;

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
    lucas_id,
    'Lucas',
    29,
    'male',
    'Copenhagen',
    'Denmark',
    186,
    'Blonde',
    'Blue',
    ARRAY['Design', 'Cycling', 'Photography', 'Coffee'],
    'Scandinavian architect with a passion for sustainable design. You''ll find me cycling through the city, camera in hand, searching for the perfect coffee spot.',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
    ARRAY[
      'https://images.unsplash.com/photo-1488161628813-04466f872be2',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce'
    ],
    true
  ),
  (
    zara_id,
    'Zara',
    31,
    'female',
    'Dubai',
    'UAE',
    171,
    'Black',
    'Brown',
    ARRAY['Tech', 'Fashion', 'Travel', 'Entrepreneurship'],
    'Tech startup founder bridging fashion and technology. Love exploring the intersection of tradition and innovation. Always planning my next adventure.',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
    ARRAY[
      'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56',
      'https://images.unsplash.com/photo-1524638431109-93d95c968f03'
    ],
    true
  ),
  (
    noah_id,
    'Noah',
    34,
    'male',
    'Cape Town',
    'South Africa',
    183,
    'Brown',
    'Hazel',
    ARRAY['Surfing', 'Conservation', 'Writing', 'Wine'],
    'Marine biologist and environmental writer. When I''m not in the ocean studying marine life, you''ll find me writing about conservation or exploring local wineries.',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    ARRAY[
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    ],
    true
  );
END $$;