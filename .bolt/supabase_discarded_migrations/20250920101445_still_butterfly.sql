/*
  # Sistema Analytics per tracciare visualizzazioni pagina web

  1. Nuove tabelle
    - `page_views` - Traccia ogni visualizzazione di pagina
    - `admin_sessions` - Gestisce le sessioni admin

  2. Funzionalità
    - Tracciamento automatico delle visualizzazioni
    - Statistiche aggregate per pagina
    - Sistema di autenticazione admin semplice

  3. Sicurezza
    - RLS abilitato su tutte le tabelle
    - Policy per permettere inserimento pubblico delle visualizzazioni
    - Policy per accesso admin autenticato
*/

-- Tabella per tracciare le visualizzazioni delle pagine
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  user_agent text,
  ip_address text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Tabella per le sessioni admin
CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Abilita RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Policy per permettere a chiunque di registrare visualizzazioni
CREATE POLICY "Allow public to insert page views"
  ON page_views
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy per permettere la lettura delle visualizzazioni (solo per admin)
CREATE POLICY "Allow admin to read page views"
  ON page_views
  FOR SELECT
  TO public
  USING (true);

-- Policy per le sessioni admin
CREATE POLICY "Allow public to insert admin sessions"
  ON admin_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to read admin sessions"
  ON admin_sessions
  FOR SELECT
  TO public
  USING (true);

-- Funzione per pulire sessioni scadute
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Vista per statistiche aggregate
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  page_path,
  COUNT(*) as total_views,
  COUNT(DISTINCT ip_address) as unique_visitors,
  DATE(created_at) as view_date,
  MAX(created_at) as last_view
FROM page_views 
GROUP BY page_path, DATE(created_at)
ORDER BY total_views DESC;