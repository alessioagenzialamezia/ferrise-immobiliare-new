/*
  # Add listing_type column to properties table

  1. Changes
    - Add `listing_type` column to properties table
    - Set default value to 'vendita'
    - Add constraint to validate values (vendita, affitto)
    - Update existing records to have default value

  2. Security
    - No RLS changes needed as column is added to existing table
*/

-- Add listing_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'listing_type'
  ) THEN
    ALTER TABLE properties ADD COLUMN listing_type text DEFAULT 'vendita' NOT NULL;
    
    -- Add constraint to validate values
    ALTER TABLE properties ADD CONSTRAINT valid_listing_type 
    CHECK (listing_type IN ('vendita', 'affitto'));
    
    -- Add comment for documentation
    COMMENT ON COLUMN properties.listing_type IS 'Tipo di annuncio: vendita, affitto';
  END IF;
END $$;