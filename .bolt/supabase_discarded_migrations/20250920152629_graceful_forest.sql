/*
  # Aggiungi campo Tipo Annuncio (Vendita/Affitto)

  1. Modifiche alla tabella
    - Aggiungi colonna `listing_type` di tipo text
    - Supporta i valori: 'vendita', 'affitto'
    - Campo obbligatorio con default 'vendita'

  2. Note
    - Campo obbligatorio per tutte le proprietà
    - Constraint per validare i valori
    - Default 'vendita' per proprietà esistenti
*/

-- Aggiungi colonna per il tipo di annuncio
ALTER TABLE properties ADD COLUMN listing_type text DEFAULT 'vendita' NOT NULL;

-- Aggiungi un commento per documentare i valori consentiti
COMMENT ON COLUMN properties.listing_type IS 'Tipo di annuncio: vendita, affitto';

-- Constraint per validare i valori
ALTER TABLE properties ADD CONSTRAINT valid_listing_type 
CHECK (listing_type IN ('vendita', 'affitto'));