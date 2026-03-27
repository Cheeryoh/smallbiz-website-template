-- ─────────────────────────────────────────────────────────────────
--  SMALL BUSINESS WEBSITE TEMPLATE — Supabase Setup
--  Run this entire script ONCE in:
--  Supabase Dashboard → SQL Editor → New Query → paste → Run
--
--  Safe to re-run — all statements use IF NOT EXISTS / ON CONFLICT.
-- ─────────────────────────────────────────────────────────────────

-- 1. Content table (stores all website text & pricing as JSON)
CREATE TABLE IF NOT EXISTS site_content (
  id          INT8 PRIMARY KEY DEFAULT 1,
  content     JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT  single_row CHECK (id = 1)
);

-- 2. Enable Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- 3. Anyone can READ the content (needed for the public website)
CREATE POLICY "Public read"
  ON site_content FOR SELECT
  USING (true);

-- 4. Only logged-in admin can WRITE content
CREATE POLICY "Admin write"
  ON site_content FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 5. Storage bucket for photos (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Anyone can VIEW photos
CREATE POLICY "Public read images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-images');

-- 7. Only logged-in admin can UPLOAD photos
CREATE POLICY "Admin upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'service-images' AND auth.role() = 'authenticated');

-- 8. Only logged-in admin can REPLACE photos
CREATE POLICY "Admin update images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'service-images' AND auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────
--  LEADS TABLE
--  Stores form submissions from your signup/lead-capture page.
--  Column names match the form fields in signup.html.
--  Rename columns to match whatever fields your form collects.
-- ─────────────────────────────────────────────────────────────────

-- 9. Leads table
CREATE TABLE IF NOT EXISTS leads (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT,
  business    TEXT,
  phone       TEXT,
  email       TEXT,
  city        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 11. Anyone can SUBMIT a lead (the public sign-up form)
CREATE POLICY "Public submit lead"
  ON leads FOR INSERT
  WITH CHECK (true);

-- 12. Only logged-in admin can VIEW leads
CREATE POLICY "Admin read leads"
  ON leads FOR SELECT
  USING (auth.role() = 'authenticated');
