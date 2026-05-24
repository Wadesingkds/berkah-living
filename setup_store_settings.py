#!/usr/bin/env python3
import os
import sys

# Load env from .env.local
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            os.environ[key] = value

from supabase import create_client, Client

# Get credentials from env
url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print(f"URL: {url}")
print(f"Service key exists: {bool(service_key)}")

if not url or not service_key:
    print("Error: Missing SUPABASE credentials")
    sys.exit(1)

# Initialize Supabase client with service role key
supabase: Client = create_client(url, service_key)

# Test data to insert
test_data = {
    "store_id": "f0839015-e921-41f2-9a9e-0984029054ce",
    "store_name": "LocalHub",
    "store_phone": "08123456789",
    "store_email": "berkah@example.com",
    "store_address": "Jl. Contoh No. 123, Kudus, Jawa Tengah",
    "whatsapp_number": "6282220205694",
    "bank_name": "BNI",
    "bank_account_number": "884343871",
    "bank_account_name": "Didik Prasetiadi",
}

try:
    response = supabase.table("store_settings").upsert(test_data).execute()
    print("✅ Table exists and data inserted!")
    print(f"Data: {response.data}")
except Exception as e:
    error_msg = str(e)
    if "relation" in error_msg.lower() and "does not exist" in error_msg.lower():
        print("❌ Table doesn't exist yet")
        print(f"Error: {error_msg}")
        print("\nTrying to create table...")
        
        # Try to create table via SQL
        try:
            sql = """
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
            
            ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Allow all" ON public.store_settings FOR ALL USING (true);
            """
            
            # Execute raw SQL
            result = supabase.postgrest.auth(service_key).post(
                "/rpc/exec_sql",
                {"query": sql}
            )
            print("✅ Table created!")
        except Exception as sql_error:
            print(f"❌ Could not create table: {sql_error}")
    else:
        print(f"❌ Error: {error_msg}")
