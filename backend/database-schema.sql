-- Supabase SQL Schema for Police Accountability System

-- Users table (officers and admins)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('officer', 'admin')), -- 'officer' or 'admin'
  badge_number VARCHAR(50),
  department VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Incidents table (recorded footage events)
CREATE TABLE public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_id UUID REFERENCES users(id),
  location VARCHAR(255),
  description TEXT,
  footage_url VARCHAR(500),
  incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_flagged BOOLEAN DEFAULT FALSE,
  flagged_reason TEXT,
  flagged_at TIMESTAMP WITH TIME ZONE
);

-- Complaints table (citizen complaints about incidents)
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_name VARCHAR(255) NOT NULL,
  citizen_email VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  incident_date TIMESTAMP WITH TIME ZONE,
  officer_id UUID REFERENCES users(id),
  location VARCHAR(255),
  evidence_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  status VARCHAR(50) NOT NULL CHECK (status IN ('submitted', 'under_review', 'resolved', 'closed')) DEFAULT 'submitted',
  findings TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_incidents_officer_id ON incidents(officer_id);
CREATE INDEX idx_incidents_incident_date ON incidents(incident_date);
CREATE INDEX idx_incidents_is_flagged ON incidents(is_flagged);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_officer_id ON complaints(officer_id);
CREATE INDEX idx_complaints_incident_date ON complaints(incident_date);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own profile
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Admins can view all users
-- Note: This requires proper auth setup - adjust based on your auth implementation

-- Officers can view incidents they created
CREATE POLICY "incidents_select_own" ON public.incidents
  FOR SELECT
  USING (auth.uid()::text = officer_id::text);

-- Public can view complaints (limited fields)
CREATE POLICY "complaints_public_view" ON public.complaints
  FOR SELECT
  USING (true);
