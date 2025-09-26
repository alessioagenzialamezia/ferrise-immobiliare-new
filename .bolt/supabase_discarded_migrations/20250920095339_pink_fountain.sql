/*
  # Aggiorna tabella properties per supportare multiple immagini

  1. Modifiche alla tabella
    - Cambia `image_url` da text a text[] (array di stringhe)
    - Questo permetterà di salvare fino a 15 URL di immagini per ogni proprietà

  2. Note
    - Le proprietà esistenti con una sola immagine verranno convertite automaticamente
    - Il campo può contenere da 0 a 15 immagini
*/

-- Aggiungi una nuova colonna per le immagini multiple
ALTER TABLE properties ADD COLUMN images text[];

-- Migra i dati esistenti da image_url a images (se esistono)
UPDATE properties 
SET images = CASE 
  WHEN image_url IS NOT NULL AND image_url != '' 
  THEN ARRAY[image_url] 
  ELSE ARRAY[]::text[] 
END;

-- Rimuovi la vecchia colonna image_url
ALTER TABLE properties DROP COLUMN IF EXISTS image_url;