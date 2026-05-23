#!/bin/bash
# Execute SQL via Supabase REST API

SUPABASE_URL="https://nyswjttnzstjnbcrmffw.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55c3dqdHRuenN0am5iY3JtZmZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTE4NzY5MiwiZXhwIjoyMDYwNzYzNjkyfQ.7lY2c"

SQL=$(cat <<'EOF'
-- Add category column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'lainnya';

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for products bucket
CREATE POLICY "Allow public upload products" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products');

CREATE POLICY "Allow public read products" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Allow public delete products" ON storage.objects
  FOR DELETE USING (bucket_id = 'products');
EOF
)

echo "Executing SQL..."
curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/pg_execute" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": \"${SQL}\"}" | jq .

echo ""
echo "Verifying..."
curl -s -X GET "${SUPABASE_URL}/rest/v1/products?select=*" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" | jq '.[0]' 2>/dev/null || echo "No products yet"
