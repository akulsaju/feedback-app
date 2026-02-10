-- Create the cases table for the feedback app
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT NOT NULL UNIQUE,
  reporter_type TEXT NOT NULL CHECK (reporter_type IN ('student', 'teacher')),
  reporter_id TEXT NOT NULL,
  reporter_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('academic', 'facility', 'technology', 'safety', 'other')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (no login required)
CREATE POLICY "Anyone can create cases" ON public.cases
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read cases by their reporter_id (checked in app logic)
CREATE POLICY "Anyone can read cases" ON public.cases
  FOR SELECT USING (true);

-- Create index for fast lookups by reporter_id
CREATE INDEX IF NOT EXISTS idx_cases_reporter_id ON public.cases (reporter_id);

-- Create index for fast lookups by case_number
CREATE INDEX IF NOT EXISTS idx_cases_case_number ON public.cases (case_number);
