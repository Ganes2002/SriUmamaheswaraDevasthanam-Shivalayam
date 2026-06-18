-- Add source column to panchangam_cache
-- Tracks which system produced each cached row: 'prokerala', 'self-calc', or 'manual'
-- Previously this was inferred from is_manual_override + data->>'_source' (JSON field).

ALTER TABLE panchangam_cache ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'prokerala';

-- Backfill existing rows
UPDATE panchangam_cache SET source = 'manual'    WHERE is_manual_override = true;
UPDATE panchangam_cache SET source = 'self-calc' WHERE data->>'_source' = 'self-calc' AND is_manual_override = false;
