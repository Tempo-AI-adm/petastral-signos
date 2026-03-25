-- Migration 002: schema cleanup
-- Run this in the Supabase SQL editor

-- 1. Rename pet_name / pet_type to name / type on pets table
ALTER TABLE pets RENAME COLUMN pet_name TO name;
ALTER TABLE pets RENAME COLUMN pet_type TO type;

-- 2. Add birth_data JSONB to pets (stores city, country, year, month, day, hour, minute, hour_unknown)
ALTER TABLE pets ADD COLUMN IF NOT EXISTS birth_data JSONB;

-- 3. Drop duplicate identity columns from pets (owner carries this via owners table)
ALTER TABLE pets DROP COLUMN IF EXISTS user_id;
ALTER TABLE pets DROP COLUMN IF EXISTS owner_name;
ALTER TABLE pets DROP COLUMN IF EXISTS owner_email;

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
