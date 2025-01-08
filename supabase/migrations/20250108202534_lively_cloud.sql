/*
  # Delete all users and related data
  
  1. Changes
    - Delete all data from messages table
    - Delete all data from likes table
    - Delete all data from notifications table
    - Delete all data from profiles table
    - Delete all data from auth.users table
*/

-- Delete data in the correct order to maintain referential integrity
DELETE FROM messages;
DELETE FROM likes;
DELETE FROM notifications;
DELETE FROM profiles;
DELETE FROM auth.users;