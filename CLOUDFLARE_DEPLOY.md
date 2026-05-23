# Deploy ke Cloudflare Pages

## Langkah-langkah:

### 1. Login Cloudflare
- Buka https://pages.cloudflare.com
- Login dengan akun Cloudflare

### 2. Create Project
- Klik "Create a project"
- Pilih "Connect to Git"
- Connect ke GitHub repo: Wadesingkds/berkah-living

### 3. Configuration
- **Project name:** berkah-living
- **Production branch:** main
- **Build settings:**
  - Build command: `npm run build`
  - Build output directory: `.next`
  
### 4. Environment Variables
Tambahkan variabel berikut di Cloudflare Pages settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://nyswjttnzstjnbcrmffw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<ISI_DARI_.env.local>
NEXT_PUBLIC_STORE_ID=f0839015-e921-41f2-9a9e-0984029054ce
NEXT_PUBLIC_PAKASIR_SLUG=berkah-living
```

### 5. Deploy
- Klik "Save and Deploy"
- Tunggu sampai selesai (~2-3 menit)

### 6. Custom Domain (Optional)
- Buka Settings > Custom domains
- Tambah domain: kioskwa.online atau yang lain

---

## Troubleshooting

### Jika build error:
- Pastikan Node.js version compatibility di package.json
- Cloudflare menggunakan Node 18.x

### Jika runtime error:
- Cek environment variables sudah diset dengan benar
- Pastikan Supabase credentials valid
