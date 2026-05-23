#!/usr/bin/env python3
"""Setup admins table in Supabase"""

import os
import requests
import json

SUPABASE_URL = "https://nyswjttnzstjnbcrmffw.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
STORE_ID = "f0839015-e921-41f2-9a9e-0984029054ce"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def create_table():
    """Create admins table"""
    
    # SQL to create table
    sql = """
    CREATE TABLE IF NOT EXISTS admins (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      store_id UUID NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'staff')),
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    """
    
    print("Creating admins table...")
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
        headers=HEADERS,
        json={"query": sql}
    )
    
    if r.status_code in [200, 201]:
        print("✓ Table created")
    else:
        print(f"✗ Error: {r.status_code} - {r.text}")
        # Try alternative method
        create_table_direct()

def create_table_direct():
    """Alternative: create table via REST"""
    
    print("Trying alternative method...")
    
    # Create table using SQL directly
    sql = """
    create table if not exists admins (
      id uuid default gen_random_uuid() primary key,
      store_id uuid not null,
      name text not null,
      email text not null,
      phone text not null,
      role text not null check (role in ('owner', 'admin', 'staff')),
      status text not null default 'active' check (status in ('active', 'inactive')),
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    );
    """
    
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
        headers=HEADERS,
        json={"query": sql}
    )
    print(f"Response: {r.status_code} - {r.text[:500]}")

def add_default_admin():
    """Add default owner admin"""
    
    data = {
        "store_id": STORE_ID,
        "name": "Didik Prasetiadi",
        "email": "didik@example.com",
        "phone": "6282220205694",
        "role": "owner",
        "status": "active"
    }
    
    print("\nAdding default admin...")
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/admins",
        headers=HEADERS,
        json=data
    )
    
    if r.status_code in [200, 201]:
        print("✓ Default admin added")
        print(f"  Data: {json.dumps(data)}")
    else:
        print(f"✗ Error: {r.status_code} - {r.text}")
        # Check if already exists
        r2 = requests.get(
            f"{SUPABASE_URL}/rest/v1/admins?store_id=eq.{STORE_ID}&role=eq.owner",
            headers=HEADERS
        )
        if r2.status_code == 200:
            existing = r2.json()
            if existing:
                print(f"✓ Admin already exists: {existing[0].get('name')}")

def check_table():
    """Check if table exists"""
    
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/admins?limit=1",
        headers=HEADERS
    )
    
    if r.status_code == 200:
        print("\n✓ Table 'admins' exists and accessible")
        return True
    else:
        print(f"\n✗ Table check failed: {r.status_code}")
        return False

if __name__ == "__main__":
    print("Setting up admins table in Supabase...")
    print(f"URL: {SUPABASE_URL}")
    print(f"Store ID: {STORE_ID}")
    print()
    
    create_table()
    check_table()
    add_default_admin()
    print("\nDone!")
