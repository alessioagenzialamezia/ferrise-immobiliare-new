/*
  # Aggiungi supporto immagini per articoli blog

  1. Modifiche alla tabella
    - Aggiungi colonna `images` di tipo text[] (array di stringhe)
    - Supporta fino a 3 immagini per articolo

  2. Note
    - Gli articoli esistenti avranno un array vuoto di immagini
    - Il campo può contenere da 0 a 3 immagini
*/

-- Aggiungi colonna per le immagini degli articoli blog
ALTER TABLE blog_posts ADD COLUMN images text[] DEFAULT ARRAY[]::text[];

-- Aggiungi un commento per documentare il limite
COMMENT ON COLUMN blog_posts.images IS 'Array di URL immagini (massimo 3 per articolo)';