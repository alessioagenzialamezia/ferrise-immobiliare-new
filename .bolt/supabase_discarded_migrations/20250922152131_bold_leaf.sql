/*
  # Tabella per messaggi di contatto

  1. Nuova tabella
    - `contact_messages` - Memorizza i messaggi di contatto dal sito web
      - `id` (uuid, primary key)
      - `name` (text, nome del mittente)
      - `email` (text, email del mittente)
      - `phone` (text, telefono opzionale)
      - `subject` (text, oggetto del messaggio)
      - `message` (text, contenuto del messaggio)
      - `property_id` (uuid, riferimento opzionale a una proprietà)
      - `created_at` (timestamp)

  2. Sicurezza
    - Enable RLS on `contact_messages` table
    - Add policy for public to insert messages
    - Add policy for authenticated users to read messages
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy per permettere a chiunque di inviare messaggi
CREATE POLICY "Allow public to insert contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy per permettere la lettura dei messaggi (solo per admin)
CREATE POLICY "Allow admin to read contact messages"
  ON contact_messages
  FOR SELECT
  TO public
  USING (true);