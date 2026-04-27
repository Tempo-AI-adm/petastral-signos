-- ============================================================
-- Migration: 005_add_pet_photo
-- Adiciona suporte a foto de pet: coluna na tabela + bucket + policies
-- ============================================================


-- 1. Adiciona coluna photo_url na tabela pets
--    TEXT nullable: foto é opcional. IF NOT EXISTS garante idempotência.
-- ============================================================
ALTER TABLE pets
  ADD COLUMN IF NOT EXISTS photo_url TEXT;


-- ============================================================
-- 2. Cria bucket público pet-photos no Supabase Storage
--    - public = true: URLs geradas são acessíveis sem token
--    - file_size_limit: 5 MB por arquivo (evita abuso via anon upload)
--    - allowed_mime_types: restringe a formatos de imagem conhecidos
--    - ON CONFLICT DO NOTHING: idempotente se bucket já existir
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pet-photos',
  'pet-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 3. Policy de leitura pública (SELECT) nos objetos do bucket
--    TO public cobre tanto `anon` quanto `authenticated`.
--    DROP ... IF EXISTS antes do CREATE é o padrão idempotente
--    pois PostgreSQL não possui CREATE POLICY IF NOT EXISTS.
-- ============================================================
DROP POLICY IF EXISTS "pet-photos-public-read" ON storage.objects;
CREATE POLICY "pet-photos-public-read"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'pet-photos');


-- ============================================================
-- 4. Policy de upload (INSERT) para a role anon
--    Permite upload de foto sem autenticação.
--    WITH CHECK restringe ao bucket correto, impedindo que a
--    policy vaze para outros buckets se o nome mudar no futuro.
-- ============================================================
DROP POLICY IF EXISTS "pet-photos-anon-insert" ON storage.objects;
CREATE POLICY "pet-photos-anon-insert"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'pet-photos');
