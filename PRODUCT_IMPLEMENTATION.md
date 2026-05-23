# Product Management - Implementasi Selesai ✅

## File yang Dibuat

### Frontend (Admin UI)
1. **`/app/admin/products/page.tsx`** - Halaman list produk
   - Filter by kategori (Semua, Daster, Parfum, Aksesoris)
   - Search by nama produk
   - Tabel dengan foto, harga, status
   - Tombol Edit & Hapus

2. **`/app/admin/products/[id]/page.tsx`** - Form tambah/edit produk
   - Input: nama, deskripsi, kategori, harga, harga coret
   - Upload multi-foto (drag & drop)
   - Preview foto dengan tombol hapus
   - Toggle status aktif/nonaktif
   - Validasi form

### Backend (API Routes)
3. **`/app/api/admin/products/route.ts`**
   - GET: List semua produk (dengan filter kategori)
   - POST: Buat produk baru

4. **`/app/api/admin/products/[id]/route.ts`**
   - GET: Detail 1 produk
   - PATCH: Update produk
   - DELETE: Hapus produk

5. **`/app/api/upload/route.ts`**
   - POST: Upload foto ke Supabase Storage bucket `products`
   - Support multi-file (max 10 file)
   - Validasi: max 5MB per file, hanya image

### Dokumentasi
6. **`/PRODUCT_SETUP.md`** - SQL script & troubleshooting

## Cara Akses

### 1. Jalankan SQL di Supabase
Buka file `/home/ubuntu/berkah-living/PRODUCT_SETUP.md` dan copy SQL script ke Supabase SQL Editor.

SQL akan:
- Tambah kolom `category` ke tabel `products`
- Buat tabel `categories` (referensi)
- Insert 4 kategori default

### 2. Test Lokal
```bash
cd /home/ubuntu/berkah-living
npm run dev
```

Buka browser:
- http://localhost:3000/admin/products - List produk
- http://localhost:3000/admin/products/new - Tambah produk baru

### 3. Deploy ke Vercel
```bash
git add -A
git commit -m "feat: product management with category & image upload"
git push origin main
```

Vercel auto-deploy dalam 2-3 menit.

Akses di production:
- https://kioskwa.vercel.app/admin/products

## Fitur Lengkap

✅ **CRUD Produk**
- Create: Form lengkap dengan validasi
- Read: List dengan filter & search
- Update: Edit semua field
- Delete: Dengan konfirmasi

✅ **Upload Foto**
- Multi-file upload
- Preview sebelum save
- Hapus foto dari form
- Validasi size & type
- Upload ke Supabase Storage

✅ **Kategori**
- Dropdown: Daster, Parfum, Aksesoris, Lainnya
- Filter di list page
- Badge di tabel

✅ **Validasi**
- Nama wajib diisi
- Harga > 0
- Minimal 1 foto
- Max 5MB per foto
- Max 10 foto per upload

✅ **UX**
- Loading state
- Error & success alerts
- Responsive design
- Hover effects
- Konfirmasi hapus

## Next Steps

1. **Jalankan SQL** di Supabase (lihat PRODUCT_SETUP.md)
2. **Test lokal** - tambah 2-3 produk dummy
3. **Deploy** ke Vercel
4. **Tambah link** ke menu admin (opsional)

## Tambah Link ke Menu Admin (Opsional)

Edit `/app/admin/layout.tsx`, tambah link Products di sidebar/navbar:

```tsx
<Link href="/admin/products" className="...">
  Produk
</Link>
```

## Troubleshooting

### "Table does not exist"
- Jalankan SQL di PRODUCT_SETUP.md

### "Bucket does not exist"
- Jalankan SQL untuk create bucket `products`

### Upload gagal
- Cek SUPABASE_SERVICE_ROLE_KEY di .env
- Pastikan bucket `products` public

### Build error di Vercel
- Linter errors itu pre-existing, bukan dari code baru
- Build tetap jalan (TypeScript config issue)

## Struktur URL

```
/admin/products              → List semua produk
/admin/products/new          → Form tambah produk
/admin/products/[id]         → Form edit produk

/api/admin/products          → GET list, POST create
/api/admin/products/[id]     → GET detail, PATCH update, DELETE
/api/upload                  → POST upload foto
```

## Database Schema

Kolom baru di tabel `products`:
- `category` (VARCHAR) - daster | parfum | aksesoris | lainnya

Tabel baru (opsional):
- `categories` - referensi kategori

Storage bucket:
- `products` (public) - untuk foto produk
