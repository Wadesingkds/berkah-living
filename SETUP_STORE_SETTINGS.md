# Setup Pengaturan Toko (Store Settings)

## Status Saat Ini
- ✅ Halaman form sudah jalan: `/admin/settings/store-simple`
- ✅ Menu "Pengaturan Toko" sudah bisa diklik
- ⏳ API endpoint siap tapi belum bisa save ke database
- ⏳ Supabase table belum dibuat

## Step 1: Setup Supabase Table

Buka Supabase dashboard dan jalankan SQL ini:

### URL: https://app.supabase.com/project/nyswjttnzstjnbcrmffw/sql/new

```sql
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
```

## Step 2: Get Service Role Key

1. Buka Supabase dashboard
2. Ke Settings → API
3. Copy `service_role key` (bukan anon key)
4. Tambahkan ke `.env.local`:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 3: Deploy ke Vercel

1. Push changes ke GitHub
2. Vercel auto-deploy
3. Atau manual: `vercel deploy --prod`

## Step 4: Test

1. Buka: https://kioskwa.vercel.app/admin/settings/store-simple
2. Ubah nama toko
3. Klik "Simpan Pengaturan"
4. Seharusnya muncul alert "Pengaturan toko berhasil disimpan"
5. Refresh halaman - data seharusnya masih ada

## Troubleshooting

### API return 404
- Vercel deployment belum selesai (tunggu 2-3 menit)
- Cek Vercel deployment logs

### API return error
- Cek `.env.local` sudah ada `SUPABASE_SERVICE_ROLE_KEY`
- Cek Supabase table sudah dibuat
- Cek RLS policy sudah aktif

### Data tidak tersimpan
- Cek browser console untuk error
- Cek Supabase logs
- Cek network tab di DevTools

## Files

- Frontend: `app/admin/settings/store-simple/page.tsx`
- API: `app/api/admin/settings/store/route.ts`
- Migration: `supabase/migrations/20260523_add_store_settings.sql`
