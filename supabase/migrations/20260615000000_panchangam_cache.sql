-- Panchangam cache table
-- Stores one row per calendar date. The Edge Function writes here after calling Prokerala
-- so subsequent visitors for the same date get the cached result (0 Prokerala credits).
-- Admins can set is_manual_override=true to supply corrected values that the Edge Function
-- will never overwrite.

CREATE TABLE IF NOT EXISTS panchangam_cache (
  date               DATE        PRIMARY KEY,
  data               JSONB       NOT NULL,
  is_manual_override BOOLEAN     NOT NULL DEFAULT FALSE,
  cached_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE panchangam_cache ENABLE ROW LEVEL SECURITY;

-- Everyone can read (visitors fetching today's panchangam via Edge Function)
CREATE POLICY "panchangam_cache_select"
  ON panchangam_cache FOR SELECT
  USING (true);

-- Anon key can insert (Edge Function writes fresh API data)
CREATE POLICY "panchangam_cache_insert"
  ON panchangam_cache FOR INSERT
  WITH CHECK (true);

-- Anon key can update (admin panel saves manual overrides)
CREATE POLICY "panchangam_cache_update"
  ON panchangam_cache FOR UPDATE
  USING (true) WITH CHECK (true);

-- Anon key can delete (admin clears an override)
CREATE POLICY "panchangam_cache_delete"
  ON panchangam_cache FOR DELETE
  USING (true);
