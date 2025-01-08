/*
  # Delete all data from the database
  
  1. Changes
    - Delete all data from all tables in the correct order
    - Maintain referential integrity by deleting in dependency order
    - Clear out auth.users table
*/

-- Delete data in the correct order to maintain referential integrity
DELETE FROM messages;
DELETE FROM likes;
DELETE FROM notifications;
DELETE FROM profiles;
DELETE FROM auth.users;