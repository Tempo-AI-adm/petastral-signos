CREATE TABLE IF NOT EXISTS affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  pix text,
  commission_pct integer NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE owners ADD COLUMN IF NOT EXISTS ref_code text;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS ref_code text;
