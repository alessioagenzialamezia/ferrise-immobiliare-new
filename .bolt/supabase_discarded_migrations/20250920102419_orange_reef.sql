/*
  # Aggiungi campo Classe Energetica alle proprietà

  1. Modifiche alla tabella
    - Aggiungi colonna `energy_class` di tipo text
    - Supporta le classi energetiche standard italiane

  2. Note
    - Campo opzionale per le proprietà esistenti
    - Valori consentiti: A+, A, B, C, D, E, F, G
*/

-- Aggiungi colonna per la classe energetica
ALTER TABLE properties ADD COLUMN energy_class text;

-- Aggiungi un commento per documentare i valori consentiti
COMMENT ON COLUMN properties.energy_class IS 'Classe energetica: A+, A, B, C, D, E, F, G';

-- Opzionale: Aggiungi un constraint per validare i valori
ALTER TABLE properties ADD CONSTRAINT valid_energy_class 
CHECK (energy_class IS NULL OR energy_class IN ('A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'));