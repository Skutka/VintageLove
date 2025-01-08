/*
  # Add support for multiple profile photos

  1. Changes
    - Add profile_photos array to profiles table to store multiple photo URLs
    - Keep existing profile_image as the main profile photo
    - Add check constraint to limit array size to 4 photos

  2. Security
    - Existing RLS policies will cover the new column
*/

ALTER TABLE profiles
ADD COLUMN profile_photos text[] DEFAULT ARRAY[]::text[];

-- Add check constraint to limit array size to 4
ALTER TABLE profiles
ADD CONSTRAINT max_profile_photos
CHECK (array_length(profile_photos, 1) <= 4);