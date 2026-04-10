/*
  # Create Pledge Submissions Table

  ## Summary
  Creates a table to store sustainability pledge submissions from users.

  ## New Tables
  - `pledge_submissions`
    - `id` (uuid, primary key) - Unique identifier
    - `name` (text) - User's full name
    - `email` (text) - User's email address
    - `institution` (text) - User's institution/organization
    - `roll_no` (text) - User's roll number or ID
    - `pledges` (jsonb) - Selected pledges organized by category
    - `photo_url` (text) - Base64 or URL of user's photo
    - `created_at` (timestamptz) - Submission timestamp

  ## Security
  - Enable RLS on `pledge_submissions` table
  - Allow public INSERT so anyone can submit a pledge
  - Allow public SELECT so certificate can be retrieved by ID
*/

CREATE TABLE IF NOT EXISTS pledge_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  institution text NOT NULL DEFAULT 'Meghnad Saha Institute of Technology',
  roll_no text NOT NULL,
  pledges jsonb NOT NULL DEFAULT '{}',
  photo_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pledge_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert pledge submissions"
  ON pledge_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view pledge submissions by id"
  ON pledge_submissions
  FOR SELECT
  TO anon, authenticated
  USING (true);
