# Vercel Setup untuk Berkah Living

## Project ID
- **Project ID Baru**: `prj_MtKThWCYedveFtbGQTQ5fnUGh4ab`
- **URL**: https://kioskwa.vercel.app

## Environment Variables yang Perlu Di-Set

Buka Vercel Dashboard → Project Settings → Environment Variables, tambahkan:

### Production Environment
```
NEXT_PUBLIC_SUPABASE_URL=https://nyswjttnzstjnbcrmffw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[dari .env.local]
SUPABASE_SERVICE_ROLE_KEY=[dari .env.local]
NEXT_PUBLIC_PAKASIR_SLUG=kiosk-wa
NEXT_PUBLIC_PAKASIR_API_KEY=[dari .env.local]
NEXT_PUBLIC_STORE_ID=f0839015-e921-41f2-9a9e-0984029054ce
```

## Langkah Setup

1. Login ke https://vercel.com/dashboard
2. Pilih project **berkah-living** (prj_MtKThWCYedveFtbGQTQ5fnUGh4ab)
3. Buka **Settings** → **Environment Variables**
4. Tambahkan semua variable di atas
5. Redeploy dengan klik "Redeploy" atau push ke main branch

## Masalah yang Sudah Diperbaiki

- ✅ Store settings form sudah jalan
- ✅ API endpoint `/api/admin/settings/store` sudah buat
- ✅ Redirect setelah save sudah implement
- ⏳ Perlu set env variable di Vercel untuk production

## Testing

Setelah env variable ter-set:
1. Buka https://kioskwa.vercel.app/admin/settings/store-simple
2. Edit nama toko
3. Klik "Simpan Pengaturan"
4. Seharusnya redirect ke `/admin/settings`
