# Setup Supabase untuk Product Management

Jalankan SQL ini di Supabase dashboard untuk setup tabel products dengan kategori.

## 1. Buka Supabase Dashboard

- Buka https://supabase.com/dashboard
- Pilih project LocalHub
- Klik "SQL Editor" di sidebar kiri
- Klik "New Query"

## 2. Jalankan SQL Script Ini

```sql
-- ============================================
-- ALTER products table - tambah kolom category
-- ============================================

-- Cek apakah kolom category sudah ada
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'lainnya';

-- Buat tabel categories (opsional, untuk referensi)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert kategori default
INSERT INTO public.categories (name, slug, description)
VALUES 
  ('Daster', 'daster', 'Daster premium untuk rumah'),
  ('Parfum', 'parfum', 'Parfum original'),
  ('Aksesoris', 'aksesoris', 'Aksesoris pendukung'),
  ('Lainnya', 'lainnya', 'Produk lainnya')
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS untuk categories (opsional)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read categories" ON public.categories
  FOR SELECT USING (true);

-- Verify
SELECT 'products' as table_name, COUNT(*) as row_count FROM public.products
UNION ALL
SELECT 'categories', COUNT(*) FROM public.categories;
```

## 3. Verifikasi

Setelah jalankan SQL:
- Buka "Table Editor" di sidebar
- Pilih tabel `products`
- Cek apakah kolom `category` sudah ada
- Cek tabel `categories` sudah ada dengan 4 baris data

## 4. Struktur Tabel Products (setelah update)

```
id (UUID) - Primary key
store_id (UUID) - Foreign key ke store
slug (VARCHAR) - URL-friendly name
name (VARCHAR) - Nama produk
description (TEXT) - Deskripsi
price (INTEGER) - Harga dalam rupiah
compare_at_price (INTEGER) - Harga coret (opsional)
category (VARCHAR) - Kategori: daster, parfum, aksesoris, lainnya ← BARU
images (TEXT[]) - Array URL foto
sizes (TEXT[]) - Array ukuran (opsional)
is_active (BOOLEAN) - Status aktif/nonaktif
created_at (TIMESTAMPTZ) - Waktu dibuat
updated_at (TIMESTAMPTZ) - Waktu diupdate
```

## 5. Troubleshooting

### Error: "Column already exists"
- Kolom `category` sudah ada, skip bagian `ALTER TABLE`

### Error: "Table does not exist"
- Jalankan SQL dari `references/supabase-setup.md` di skill `ecommerce-product-management` dulu

### Foto tidak bisa diupload
- Pastikan bucket `products` sudah ada di Storage
- Bucket harus `public: true`
- Jalankan SQL untuk create bucket:
  ```sql
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('products', 'products', true)
  ON CONFLICT (id) DO NOTHING;
  ```

## 6. Environment Variables

Pastikan `.env.local` atau Vercel sudah punya:

```
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_STORE_ID=f0839015-e921-41f2-9a9e-0984029054ce
```

Cek di Supabase → Settings → API untuk copy URL dan keys.
