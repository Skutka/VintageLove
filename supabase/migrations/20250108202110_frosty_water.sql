/*
  # Add sample profiles for testing

  1. New Data
    - Adds 5 sample profiles with diverse characteristics
    - Each profile has complete information including:
      - Basic info (name, age, gender)
      - Location (city, country)
      - Physical characteristics (height, hair color, eye color)
      - Interests and bio
      - Profile images from Unsplash
*/

-- Create sample profiles
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
  gen_random_uuid(),
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
  gen_random_uuid(),
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
  gen_random_uuid(),
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
  gen_random_uuid(),
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
  gen_random_uuid(),
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