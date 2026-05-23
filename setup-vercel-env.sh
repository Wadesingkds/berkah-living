#!/bin/bash

# Setup Vercel Environment Variables
# Usage: ./setup-vercel-env.sh <VERCEL_TOKEN>

if [ -z "$1" ]; then
  echo "Usage: ./setup-vercel-env.sh <VERCEL_TOKEN>"
  exit 1
fi

VERCEL_TOKEN=$1
PROJECT_ID="prj_MtKThWCYedveFtbGQTQ5fnUGh4ab"
TEAM_ID="team_62S1Icbg934XNcEo28vAiLvK"

# Environment variables to set
declare -A ENV_VARS=(
  ["NEXT_PUBLIC_SUPABASE_URL"]="https://nyswjttnzstjnbcrmffw.supabase.co"
  ["SUPABASE_SERVICE_ROLE_KEY"]="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55c3dqdHRuenN0am5iY3JtZmZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQ1NDU4NSwiZXhwIjoyMDk1MDMwNTg1fQ.SwImmmMoSsUwoJxKcdoCxFCcqWWgV_khsfavOfLlY2c"
  ["NEXT_PUBLIC_STORE_ID"]="f0839015-e921-41f2-9a9e-0984029054ce"
  ["NEXT_PUBLIC_PAKASIR_SLUG"]="kiosk-wa"
)

echo "Setting environment variables for project $PROJECT_ID..."

for key in "${!ENV_VARS[@]}"; do
  value="${ENV_VARS[$key]}"
  echo "Setting $key..."
  
  curl -X POST "https://api.vercel.com/v10/projects/$PROJECT_ID/env?teamId=$TEAM_ID" \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"key\": \"$key\",
      \"value\": \"$value\",
      \"target\": [\"production\", \"preview\", \"development\"]
    }"
  
  echo ""
done

echo "Done! Environment variables set."
