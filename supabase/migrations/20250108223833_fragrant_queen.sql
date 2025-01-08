/*
  # Clear all data from the database
  
  1. Changes
    - Remove all data from all tables in the correct order to maintain referential integrity
    - Keep table structures and policies intact
  
  2. Security
    - Maintain RLS policies and permissions
    - Safe cleanup that respects foreign key constraints
*/

-- Delete data in the correct order to maintain referential integrity
DELETE FROM messages;
DELETE FROM notifications;
DELETE FROM likes;
DELETE FROM profiles;
DELETE FROM auth.users;

-- Reset all sequences
ALTER SEQUENCE IF EXISTS messages_id_seq RESTART;
ALTER SEQUENCE IF EXISTS notifications_id_seq RESTART;
ALTER SEQUENCE IF EXISTS likes_id_seq RESTART;