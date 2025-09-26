/*
  # Fix properties table structure and constraints

  1. Ensure all required columns exist
    - listing_type (vendita/affitto)
    - property_type (Appartamento, Villa, etc.)
    - energy_class (A+, A, B, C, D, E, F, G)
    - All other required fields

  2. Fix constraints and defaults
    - Proper default values
    - Valid constraint checks
    - Nullable fields where appropriate

  3. Security
    - Maintain existing RLS policies
*/

-- First, let's ensure the properties table has all required columns
DO $$
BEGIN
  -- Add listing_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'listing_type'
  ) THEN
    ALTER TABLE properties ADD COLUMN listing_type text DEFAULT 'vendita' NOT NULL;
    RAISE NOTICE 'Added listing_type column';
  END IF;

  -- Add property_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'property_type'
  ) THEN
    ALTER TABLE properties ADD COLUMN property_type text;
    RAISE NOTICE 'Added property_type column';
  END IF;

  -- Add energy_class column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'energy_class'
  ) THEN
    ALTER TABLE properties ADD COLUMN energy_class text;
    RAISE NOTICE 'Added energy_class column';
  END IF;

  -- Add images column if it doesn't exist (should be text array)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'images'
  ) THEN
    ALTER TABLE properties ADD COLUMN images text[] DEFAULT ARRAY[]::text[];
    RAISE NOTICE 'Added images column';
  END IF;

  -- Add is_featured column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE properties ADD COLUMN is_featured boolean DEFAULT false;
    RAISE NOTICE 'Added is_featured column';
  END IF;

  -- Add rooms column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'rooms'
  ) THEN
    ALTER TABLE properties ADD COLUMN rooms integer;
    RAISE NOTICE 'Added rooms column';
  END IF;

  -- Add bathrooms column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'bathrooms'
  ) THEN
    ALTER TABLE properties ADD COLUMN bathrooms integer;
    RAISE NOTICE 'Added bathrooms column';
  END IF;

  -- Add square_meters column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'square_meters'
  ) THEN
    ALTER TABLE properties ADD COLUMN square_meters integer;
    RAISE NOTICE 'Added square_meters column';
  END IF;

  -- Add features column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'features'
  ) THEN
    ALTER TABLE properties ADD COLUMN features text;
    RAISE NOTICE 'Added features column';
  END IF;

  -- Add city column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'city'
  ) THEN
    ALTER TABLE properties ADD COLUMN city text;
    RAISE NOTICE 'Added city column';
  END IF;

  -- Add province column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'province'
  ) THEN
    ALTER TABLE properties ADD COLUMN province text;
    RAISE NOTICE 'Added province column';
  END IF;

  -- Add price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'price'
  ) THEN
    ALTER TABLE properties ADD COLUMN price numeric;
    RAISE NOTICE 'Added price column';
  END IF;

  -- Add description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'description'
  ) THEN
    ALTER TABLE properties ADD COLUMN description text;
    RAISE NOTICE 'Added description column';
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE properties ADD COLUMN updated_at timestamptz DEFAULT now();
    RAISE NOTICE 'Added updated_at column';
  END IF;

END $$;

-- Drop existing constraints if they exist to avoid conflicts
DO $$
BEGIN
  -- Drop existing constraints
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'valid_listing_type' AND table_name = 'properties') THEN
    ALTER TABLE properties DROP CONSTRAINT valid_listing_type;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'valid_property_type' AND table_name = 'properties') THEN
    ALTER TABLE properties DROP CONSTRAINT valid_property_type;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'valid_energy_class' AND table_name = 'properties') THEN
    ALTER TABLE properties DROP CONSTRAINT valid_energy_class;
  END IF;
END $$;

-- Add constraints for data validation
ALTER TABLE properties ADD CONSTRAINT valid_listing_type 
CHECK (listing_type IN ('vendita', 'affitto'));

ALTER TABLE properties ADD CONSTRAINT valid_property_type 
CHECK (property_type IS NULL OR property_type IN ('Appartamento', 'Villa', 'Ufficio', 'Terreno', 'Deposito', 'Altro'));

ALTER TABLE properties ADD CONSTRAINT valid_energy_class 
CHECK (energy_class IS NULL OR energy_class IN ('A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'));

-- Add comments for documentation
COMMENT ON COLUMN properties.listing_type IS 'Tipo di annuncio: vendita, affitto';
COMMENT ON COLUMN properties.property_type IS 'Tipo di proprietà: Appartamento, Villa, Ufficio, Terreno, Deposito, Altro';
COMMENT ON COLUMN properties.energy_class IS 'Classe energetica: A+, A, B, C, D, E, F, G';
COMMENT ON COLUMN properties.images IS 'Array di URL immagini (massimo 15 per proprietà)';
COMMENT ON COLUMN properties.is_featured IS 'Proprietà in evidenza sulla homepage';
COMMENT ON COLUMN properties.features IS 'Caratteristiche della proprietà (es: Balcone, Garage, Giardino)';

-- Ensure RLS is enabled (should already be enabled)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create or replace policies for public access (needed for the app to work)
DROP POLICY IF EXISTS "Allow public to read properties" ON properties;
CREATE POLICY "Allow public to read properties"
  ON properties
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow public to insert properties" ON properties;
CREATE POLICY "Allow public to insert properties"
  ON properties
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public to update properties" ON properties;
CREATE POLICY "Allow public to update properties"
  ON properties
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public to delete properties" ON properties;
CREATE POLICY "Allow public to delete properties"
  ON properties
  FOR DELETE
  TO public
  USING (true);

-- Verify the table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position;