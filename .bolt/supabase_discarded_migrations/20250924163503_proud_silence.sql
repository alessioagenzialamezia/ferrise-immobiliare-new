/*
  # Aggiungi colonna listing_type alla tabella properties

  1. Modifiche
    - Aggiunge colonna `listing_type` alla tabella `properties`
    - Imposta 'vendita' come valore predefinito
    - Aggiunge constraint per validare solo 'vendita' o 'affitto'
    - Aggiorna eventuali record esistenti

  2. Sicurezza
    - Usa IF NOT EXISTS per evitare errori se la colonna esiste già
    - Constraint di validazione per garantire dati corretti
*/

-- Aggiungi la colonna listing_type se non esiste
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'listing_type'
  ) THEN
    ALTER TABLE properties ADD COLUMN listing_type text DEFAULT 'vendita' NOT NULL;
  END IF;
END $$;

-- Aggiungi constraint per validare i valori
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_listing_type' AND table_name = 'properties'
  ) THEN
    ALTER TABLE properties ADD CONSTRAINT valid_listing_type 
    CHECK (listing_type IN ('vendita', 'affitto'));
  END IF;
END $$;

-- Aggiorna eventuali record esistenti che potrebbero avere valori null
UPDATE properties SET listing_type = 'vendita' WHERE listing_type IS NULL;