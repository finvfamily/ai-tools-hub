-- ============================================================
-- AI Tools Hub - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  description text,
  icon        text,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL
);

-- Tools (core table)
CREATE TABLE IF NOT EXISTS tools (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text UNIQUE NOT NULL,
  website_url   text NOT NULL,
  description   text NOT NULL,
  content       text,
  thumbnail_url text,
  category_id   uuid REFERENCES categories(id) ON DELETE SET NULL,
  pricing_type  text CHECK (pricing_type IN ('free', 'freemium', 'paid')),
  status        text DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured   boolean DEFAULT false,
  view_count    int DEFAULT 0,
  submitted_by  text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Tool <-> Tag many-to-many
CREATE TABLE IF NOT EXISTS tool_tags (
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  tag_id  uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, tag_id)
);

-- Submission audit log
CREATE TABLE IF NOT EXISTS submissions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id       uuid REFERENCES tools(id) ON DELETE CASCADE,
  email         text,
  status        text DEFAULT 'pending',
  reject_reason text,
  reviewed_at   timestamptz,
  created_at    timestamptz DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_tools_status       ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_category_id  ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tools_is_featured  ON tools(is_featured);
CREATE INDEX IF NOT EXISTS idx_tools_created_at   ON tools(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tools_slug         ON tools(slug);

-- ============================================================
-- Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Increment view count (avoids RLS bypass on client)
-- ============================================================
CREATE OR REPLACE FUNCTION increment_view_count(tool_slug text)
RETURNS void AS $$
BEGIN
  UPDATE tools SET view_count = view_count + 1 WHERE slug = tool_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE tools       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_tags   ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Public: read approved tools only
CREATE POLICY "public read approved tools"
  ON tools FOR SELECT
  USING (status = 'approved');

-- Public: submit tools (status must be pending)
CREATE POLICY "anyone can submit tool"
  ON tools FOR INSERT
  WITH CHECK (status = 'pending');

-- Public: read categories & tags
CREATE POLICY "public read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "public read tags"
  ON tags FOR SELECT USING (true);

CREATE POLICY "public read tool_tags"
  ON tool_tags FOR SELECT USING (true);

-- Public: insert submissions
CREATE POLICY "anyone can insert submission"
  ON submissions FOR INSERT WITH CHECK (true);

-- ============================================================
-- Seed: Initial Categories
-- ============================================================
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Writing & Content',  'writing',     '✍️',  1),
  ('Image & Design',     'image',       '🎨',  2),
  ('Code & Dev',         'code',        '💻',  3),
  ('Productivity',       'productivity','⚡',  4),
  ('Video & Audio',      'video',       '🎬',  5),
  ('Data & Analytics',   'data',        '📊',  6),
  ('Marketing',          'marketing',   '📣',  7),
  ('Education',          'education',   '📚',  8),
  ('Research',           'research',    '🔍',  9),
  ('Other',              'other',       '🤖', 10)
ON CONFLICT (slug) DO NOTHING;
