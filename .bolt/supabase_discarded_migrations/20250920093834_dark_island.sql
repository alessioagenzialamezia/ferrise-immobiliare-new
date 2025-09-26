-- ===========================
-- SETUP SUPABASE STORAGE
-- ===========================

-- 1. Prima crea il bucket 'images' tramite interfaccia Supabase
-- Vai su Storage > New bucket > Nome: 'images' > Public: ON

-- 2. Abilita RLS su storage.objects (se non già abilitato)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy per permettere la lettura pubblica delle immagini
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- 4. Policy per permettere l'upload delle immagini
CREATE POLICY "Allow authenticated uploads to images bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- 5. Policy per permettere l'aggiornamento delle immagini
CREATE POLICY "Allow authenticated updates to images bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- 6. Policy per permettere l'eliminazione delle immagini
CREATE POLICY "Allow authenticated deletes from images bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- ===========================
-- VERIFICA CONFIGURAZIONE
-- ===========================

-- Verifica che le policy siano state create correttamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Verifica che RLS sia abilitato
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';