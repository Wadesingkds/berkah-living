-- Add driver type column
ALTER TABLE drivers ADD COLUMN type TEXT DEFAULT 'INTERNAL' CHECK (type IN ('INTERNAL', 'GRAB', 'GOJEK'));

-- Update existing drivers to INTERNAL
UPDATE drivers SET type = 'INTERNAL' WHERE type IS NULL;
