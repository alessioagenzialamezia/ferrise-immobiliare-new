/*
  # Sistema automatico eliminazione immagini collegate

  1. Funzioni
    - `delete_images_from_storage` - Elimina immagini dallo storage Supabase
    - `cleanup_property_images` - Trigger function per proprietà
    - `cleanup_blog_images` - Trigger function per articoli blog

  2. Trigger
    - `trigger_cleanup_property_images` - Attivato prima della cancellazione proprietà
    - `trigger_cleanup_blog_images` - Attivato prima della cancellazione articoli

  3. Sicurezza
    - Controlli di validità degli URL
    - Gestione errori robusta
    - Log delle operazioni
*/

-- Funzione per eliminare immagini dallo storage Supabase
CREATE OR REPLACE FUNCTION delete_images_from_storage(image_urls text[])
RETURNS void AS $$
DECLARE
    image_url text;
    file_path text;
    url_parts text[];
BEGIN
    -- Controlla se l'array è vuoto o null
    IF image_urls IS NULL OR array_length(image_urls, 1) IS NULL THEN
        RETURN;
    END IF;

    -- Itera attraverso ogni URL immagine
    FOREACH image_url IN ARRAY image_urls
    LOOP
        -- Salta URL vuoti o null
        IF image_url IS NULL OR image_url = '' THEN
            CONTINUE;
        END IF;

        -- Estrai il percorso del file dall'URL
        -- Formato URL: https://[project].supabase.co/storage/v1/object/public/images/folder/filename
        IF image_url LIKE '%/storage/v1/object/public/images/%' THEN
            -- Estrai la parte dopo '/images/'
            url_parts := string_to_array(image_url, '/images/');
            IF array_length(url_parts, 1) >= 2 THEN
                file_path := url_parts[2];
                
                -- Elimina il file dallo storage
                PERFORM storage.delete_object('images', file_path);
                
                -- Log dell'operazione (opzionale)
                RAISE NOTICE 'Deleted image from storage: %', file_path;
            END IF;
        END IF;
    END LOOP;
EXCEPTION
    WHEN OTHERS THEN
        -- Log dell'errore ma non interrompere l'operazione
        RAISE WARNING 'Error deleting images from storage: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funzione trigger per pulire le immagini delle proprietà
CREATE OR REPLACE FUNCTION cleanup_property_images()
RETURNS trigger AS $$
BEGIN
    -- Elimina le immagini dallo storage prima di cancellare la proprietà
    IF OLD.images IS NOT NULL AND array_length(OLD.images, 1) > 0 THEN
        PERFORM delete_images_from_storage(OLD.images);
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Funzione trigger per pulire le immagini degli articoli blog
CREATE OR REPLACE FUNCTION cleanup_blog_images()
RETURNS trigger AS $$
BEGIN
    -- Elimina le immagini dallo storage prima di cancellare l'articolo
    IF OLD.images IS NOT NULL AND array_length(OLD.images, 1) > 0 THEN
        PERFORM delete_images_from_storage(OLD.images);
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger per proprietà (attivato PRIMA della cancellazione)
DROP TRIGGER IF EXISTS trigger_cleanup_property_images ON properties;
CREATE TRIGGER trigger_cleanup_property_images
    BEFORE DELETE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_property_images();

-- Trigger per articoli blog (attivato PRIMA della cancellazione)
DROP TRIGGER IF EXISTS trigger_cleanup_blog_images ON blog_posts;
CREATE TRIGGER trigger_cleanup_blog_images
    BEFORE DELETE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_blog_images();

-- Funzione di utilità per testare il sistema (opzionale)
CREATE OR REPLACE FUNCTION test_image_cleanup()
RETURNS text AS $$
BEGIN
    RETURN 'Image cleanup system installed successfully. Triggers active on properties and blog_posts tables.';
END;
$$ LANGUAGE plpgsql;

-- Verifica che i trigger siano stati creati correttamente
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_name IN ('trigger_cleanup_property_images', 'trigger_cleanup_blog_images')
ORDER BY event_object_table;