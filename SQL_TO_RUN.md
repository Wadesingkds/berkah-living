# SQL untuk Setup Product Management

**WAJIB jalankan SQL ini di Supabase sebelum test product management**

## Langkah:
1. Buka https://supabase.com/dashboard
2. Pilih project "Kiosk" (Berkah Living)
3. Klik "SQL Editor" di sidebar
4. Klik "New Query"
5. Copy-paste SQL di bawah
6. Klik "Run"

## SQL Script

```sql
-- Add category column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'lainnya';

-- Create storage bucket for product images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY IF NOT EXISTS "Allow public upload products" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products');

CREATE POLICY IF NOT EXISTS "Allow public read products" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY IF NOT EXISTS "Allow public delete products" ON storage.objects
  FOR DELETE USING (bucket_id = 'products');
```

## Verifikasi Berhasil

Setelah jalankan SQL:
- Buka "Table Editor" → pilih `products`
- Cek kolom `category` sudah ada
- Buka "Storage" → cek bucket `products` ada

## Setelah SQL Jalan

Dev server sudah running di http://localhost:3000

Akses:
- http://localhost:3000/admin/products — List produk
- http://localhost:3000/admin/products/new — Tambah produk

**Catatan:** Jika error "column does not exist", berarti SQL belum jalan. Jalankan SQL dulu.
