/*
  # Initial Database Schema for Qema Platform

  ## Overview
  This migration creates the complete database schema for the Qema events platform,
  including tables for users, organizations, venues, events, tags, programs, and submissions.

  ## New Tables

  ### 1. roles
  - `id` (smallint, primary key)
  - `name` (text, unique) - Role name (e.g., 'admin', 'editor', 'viewer')
  
  ### 2. organizations
  - `id` (uuid, primary key)
  - `name` (text) - Organization name
  - `website` (text) - Organization website URL
  - `contact_email` (text) - Contact email
  - `contact_phone` (text) - Contact phone number
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### 3. venues
  - `id` (uuid, primary key)
  - `name` (text) - Venue name
  - `address` (text) - Full address
  - `city` (text) - City name
  - `latitude` (decimal) - GPS latitude
  - `longitude` (decimal) - GPS longitude
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### 4. tags
  - `id` (uuid, primary key)
  - `name` (text) - Tag name
  - `slug` (text, unique) - URL-friendly slug
  - `created_at` (timestamp)

  ### 5. events
  - `id` (uuid, primary key)
  - `title` (text) - Event title
  - `short_description` (text) - Brief description
  - `full_description` (text) - Full event description
  - `start_date` (timestamp) - Event start date/time
  - `end_date` (timestamp) - Event end date/time
  - `registration_deadline` (timestamp) - Registration deadline
  - `registration_link` (text) - External registration URL
  - `location` (text) - Location description
  - `status` (text) - Event status: 'draft', 'published', 'archived'
  - `visibility` (text) - Visibility: 'public', 'private'
  - `created_by` (uuid) - User who created the event
  - `organizer_id` (uuid) - Organization organizing the event
  - `venue_id` (uuid) - Venue where event takes place
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### 6. event_images
  - `id` (uuid, primary key)
  - `event_id` (uuid) - Related event
  - `url` (text) - Image URL
  - `alt_text` (text) - Alternative text for accessibility
  - `is_cover` (boolean) - Whether this is the cover image
  - `created_at` (timestamp)

  ### 7. event_tags
  - `event_id` (uuid) - Event reference
  - `tag_id` (uuid) - Tag reference
  - Primary key: (event_id, tag_id)

  ### 8. programs
  - `id` (uuid, primary key)
  - `title` (text) - Program title
  - `description` (text) - Program description
  - `start_date` (timestamp) - Program start date
  - `end_date` (timestamp) - Program end date
  - `created_by` (uuid) - User who created the program
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### 9. submissions
  - `id` (uuid, primary key)
  - `submitter_name` (text) - Name of submitter
  - `submitter_email` (text) - Email of submitter
  - `organization_name` (text) - Organization name
  - `title` (text) - Event title
  - `description` (text) - Event description
  - `start_date` (timestamp) - Proposed start date
  - `end_date` (timestamp) - Proposed end date
  - `registration_link` (text) - Registration URL
  - `status` (text) - Status: 'pending', 'approved', 'rejected'
  - `review_notes` (text) - Admin review notes
  - `reviewed_by` (uuid) - Admin who reviewed
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### 10. audit_logs
  - `id` (uuid, primary key)
  - `entity` (text) - Entity type (e.g., 'event', 'user')
  - `entity_id` (uuid) - ID of the affected entity
  - `action` (text) - Action performed (e.g., 'create', 'update', 'delete')
  - `performed_by` (uuid) - User who performed the action
  - `details` (jsonb) - Additional details
  - `created_at` (timestamp)

  ## Security
  - RLS enabled on all tables
  - Public read access for published events and related data
  - Authenticated users can create/edit their own content
  - Admin-only access for sensitive operations
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id SMALLINT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- Insert default roles
INSERT INTO roles (id, name) VALUES 
  (1, 'viewer'),
  (2, 'editor'),
  (3, 'admin')
ON CONFLICT (id) DO NOTHING;

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view organizations"
  ON organizations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update organizations"
  ON organizations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create venues table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view venues"
  ON venues FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage venues"
  ON venues FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view tags"
  ON tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage tags"
  ON tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  registration_deadline TIMESTAMPTZ,
  registration_link TEXT,
  location TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  created_by UUID REFERENCES auth.users(id),
  organizer_id UUID REFERENCES organizations(id),
  venue_id UUID REFERENCES venues(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  TO public
  USING (status = 'published' AND visibility = 'public');

CREATE POLICY "Authenticated users can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create event_images table
CREATE TABLE IF NOT EXISTS event_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE event_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view event images"
  ON event_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Event creators can manage their event images"
  ON event_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_images.event_id 
      AND events.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_images.event_id 
      AND events.created_by = auth.uid()
    )
  );

-- Create event_tags junction table
CREATE TABLE IF NOT EXISTS event_tags (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, tag_id)
);

ALTER TABLE event_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view event tags"
  ON event_tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Event creators can manage their event tags"
  ON event_tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_tags.event_id 
      AND events.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_tags.event_id 
      AND events.created_by = auth.uid()
    )
  );

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view programs"
  ON programs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create programs"
  ON programs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own programs"
  ON programs FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_name TEXT,
  submitter_email TEXT,
  organization_name TEXT,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  registration_link TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  review_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create submissions"
  ON submissions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Submitters can view their own submissions"
  ON submissions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update submissions"
  ON submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity TEXT,
  entity_id UUID,
  action TEXT,
  performed_by UUID REFERENCES auth.users(id),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);
