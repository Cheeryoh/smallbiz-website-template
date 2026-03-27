// ─────────────────────────────────────────────────────────────────────────────
//  SUPABASE CONFIGURATION
//
//  Setup steps:
//  1. Go to supabase.com → New Project
//  2. Project Settings → API → copy "Project URL" and "anon public" key
//  3. Paste them below
//  4. Run supabase-setup.sql in Supabase Dashboard → SQL Editor
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL      = 'YOUR_SUPABASE_URL';       // e.g. https://xyzxyz.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';  // long JWT string from Supabase dashboard

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
