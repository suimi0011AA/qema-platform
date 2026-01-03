-- Simple database setup for testing
-- Run this in your Supabase SQL Editor

-- Create a simple events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'published',
  visibility TEXT DEFAULT 'public',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  TO public
  USING (status = 'published' AND visibility = 'public');

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Create a simple tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view tags"
  ON tags FOR SELECT
  TO public
  USING (true);

-- Insert some sample data
INSERT INTO events (title, description, start_date, end_date) VALUES 
('مؤتمر التقنية 2024', 'مؤتمر تقني رائع', '2024-12-25 10:00:00+00', '2024-12-25 18:00:00+00'),
('ورشة البرمجة', 'ورشة تعليمية في البرمجة', '2024-12-30 14:00:00+00', '2024-12-30 17:00:00+00')
ON CONFLICT DO NOTHING;

INSERT INTO tags (name) VALUES ('تقنية'), ('برمجة'), ('تعليم')
ON CONFLICT DO NOTHING;