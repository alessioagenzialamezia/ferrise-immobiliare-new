/*
  # Aggiungi campo Tipo di Proprietà

  1. Modifiche alla tabella
    - Aggiungi colonna `property_type` di tipo text
    - Supporta i tipi: Appartamento, Villa, Ufficio, Terreno, Deposito, Altro

  2. Note
    - Campo opzionale per le proprietà esistenti
    - Valori consentiti tramite constraint per garantire coerenza
*/

-- Aggiungi colonna per il tipo di proprietà
ALTER TABLE properties ADD COLUMN property_type text;

-- Aggiungi un commento per documentare i valori consentiti
COMMENT ON COLUMN properties.property_type IS 'Tipo di proprietà: Appartamento, Villa, Ufficio, Terreno, Deposito, Altro';

-- Constraint per validare i valori
ALTER TABLE properties ADD CONSTRAINT valid_property_type 
CHECK (property_type IS NULL OR property_type IN ('Appartamento', 'Villa', 'Ufficio', 'Terreno', 'Deposito', 'Altro'));