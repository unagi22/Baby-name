/*
  # Initial Schema for Baby Name Explorer

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `parents_names` (text)
      - `gender_preference` (text)
      - `created_at` (timestamp)
      - `created_by` (text)
    
    - `name_suggestions`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `name` (text)
      - `gender` (text)
      - `suggested_by` (text)
      - `likes` (integer)
      - `is_favorite` (boolean)
      - `created_at` (timestamp)
    
    - `users`
      - `id` (uuid, primary key)
      - `liked_names` (text array)

  2. Security
    - Enable RLS on all tables
    - Add policies for read/write access
*/

-- Create enum for gender
CREATE TYPE gender AS ENUM ('boy', 'girl', 'either');

-- Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parents_names text NOT NULL,
  gender_preference gender NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by text NOT NULL
);

-- Create name suggestions table
CREATE TABLE name_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  name text NOT NULL,
  gender gender NOT NULL,
  suggested_by text NOT NULL,
  likes integer DEFAULT 0,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  liked_names uuid[] DEFAULT ARRAY[]::uuid[]
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE name_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read projects"
  ON projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Creator can update projects"
  ON projects FOR UPDATE
  TO public
  USING (auth.uid()::text = created_by);

CREATE POLICY "Anyone can read name suggestions"
  ON name_suggestions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create name suggestions"
  ON name_suggestions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Creator can update name suggestions"
  ON name_suggestions FOR UPDATE
  TO public
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = name_suggestions.project_id 
    AND projects.created_by = auth.uid()::text
  ));