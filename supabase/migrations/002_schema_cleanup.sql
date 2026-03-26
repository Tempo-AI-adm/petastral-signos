-- Migration 002: schema cleanup
-- Run this in the Supabase SQL editor

-- 1. Add birth_data JSONB to pets (stores city, country, year, month, day, hour, minute, hour_unknown)
ALTER TABLE pets ADD COLUMN IF NOT EXISTS birth_data JSONB;

-- 2. Drop owner_name from pets (not referenced by code or any RLS policy)
-- NOTE: user_id is kept — used by DELETE/INSERT/UPDATE/SELECT policies
-- NOTE: owner_email is kept — used by "Users can view own pets" SELECT policy:
--       qual: (owner_email = (auth.jwt() ->> 'email'))
ALTER TABLE pets DROP COLUMN IF EXISTS owner_name;

-- 4. Drop individual sign columns from reports (consolidated into signs JSONB)
ALTER TABLE reports DROP COLUMN IF EXISTS sun_sign;
ALTER TABLE reports DROP COLUMN IF EXISTS moon_sign;
ALTER TABLE reports DROP COLUMN IF EXISTS mercury_sign;
ALTER TABLE reports DROP COLUMN IF EXISTS venus_sign;
ALTER TABLE reports DROP COLUMN IF EXISTS mars_sign;
ALTER TABLE reports DROP COLUMN IF EXISTS jupiter_sign;
ALTER TABLE reports DROP COLUMN IF EXISTS saturn_sign;
ALTER TABLE reports DROP COLUMN IF EXISTS uranus_sign;
ALTER TABLE reports DROP COLUMN IF EXISTS neptune_sign;
ALTER TABLE reports DROP COLUMN IF EXISTS pluto_sign;
ALTER TABLE reports DROP COLUMN IF EXISTS dominant_element;

-- 5. Drop reports.content (report text lives in report_text)
ALTER TABLE reports DROP COLUMN IF EXISTS content;
