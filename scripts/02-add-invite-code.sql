-- Add invite_code column to lobbies table
ALTER TABLE lobbies ADD COLUMN invite_code VARCHAR(255) UNIQUE;
