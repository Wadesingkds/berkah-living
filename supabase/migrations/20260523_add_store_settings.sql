-- Create store_settings table
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL UNIQUE,
  store_name TEXT,
  store_description TEXT,
  store_phone TEXT,
  store_email TEXT,
  store_address TEXT,
  whatsapp_number TEXT,
  is_open BOOLEAN DEFAULT true,
  opening_hours TEXT DEFAULT '08:00',
  closing_hours TEXT DEFAULT '20:00',
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_name TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all" ON public.store_settings FOR ALL USING (true);

-- Create index on store_id
CREATE INDEX idx_store_settings_store_id ON public.store_settings(store_id);
