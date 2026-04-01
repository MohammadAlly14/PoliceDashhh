-- Migration: Add distress alert fields to incidents table

-- Add distress tracking columns to incidents table
ALTER TABLE public.incidents
ADD COLUMN IF NOT EXISTS distress_level VARCHAR(50) CHECK (distress_level IN ('critical', 'high', 'medium', NULL)),
ADD COLUMN IF NOT EXISTS officer_location_lat NUMERIC(10, 8),
ADD COLUMN IF NOT EXISTS officer_location_lng NUMERIC(11, 8),
ADD COLUMN IF NOT EXISTS emergency_ack_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS emergency_ack_by UUID,
ADD COLUMN IF NOT EXISTS responding_unit VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_distress BOOLEAN DEFAULT FALSE;

-- Create index for distress queries
CREATE INDEX IF NOT EXISTS idx_incidents_distress ON incidents(is_distress, distress_level, incident_date DESC);

-- Create index for location-based queries (useful for mapping distress incidents)
CREATE INDEX IF NOT EXISTS idx_incidents_location_coords ON incidents(officer_location_lat, officer_location_lng) 
WHERE is_distress = true;
