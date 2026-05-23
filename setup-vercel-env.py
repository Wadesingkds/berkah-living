#!/usr/bin/env python3
"""
Setup Vercel environment variables for Berkah Living project
Usage: python3 setup-vercel-env.py <VERCEL_TOKEN>
"""

import sys
import requests
import json

if len(sys.argv) < 2:
    print("Usage: python3 setup-vercel-env.py <VERCEL_TOKEN>")
    sys.exit(1)

VERCEL_TOKEN = sys.argv[1]
PROJECT_ID = "prj_MtKThWCYedveFtbGQTQ5fnUGh4ab"
TEAM_ID = "team_62S1Icbg934XNcEo28vAiLvK"

ENV_VARS = {
    "NEXT_PUBLIC_SUPABASE_URL": "https://nyswjttnzstjnbcrmffw.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55c3dqdHRuenN0am5iY3JtZmZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQ1NDU4NSwiZXhwIjoyMDk1MDMwNTg1fQ.SwImmmMoSsUwoJxKcdoCxFCcqWWgV_khsfavOfLlY2c",
    "NEXT_PUBLIC_STORE_ID": "f0839015-e921-41f2-9a9e-0984029054ce",
    "NEXT_PUBLIC_PAKASIR_SLUG": "kiosk-wa",
}

headers = {
    "Authorization": f"Bearer {VERCEL_TOKEN}",
    "Content-Type": "application/json",
}

print(f"Setting environment variables for project {PROJECT_ID}...")

for key, value in ENV_VARS.items():
    print(f"Setting {key}...", end=" ")
    
    payload = {
        "key": key,
        "value": value,
        "type": "encrypted",
        "target": ["production", "preview", "development"],
    }
    
    url = f"https://api.vercel.com/v10/projects/{PROJECT_ID}/env?teamId={TEAM_ID}"
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code in [200, 201]:
            print("✓")
        else:
            print(f"✗ ({response.status_code})")
            print(response.text)
    except Exception as e:
        print(f"✗ ({str(e)})")

print("\nDone! Redeploy project to apply changes.")
