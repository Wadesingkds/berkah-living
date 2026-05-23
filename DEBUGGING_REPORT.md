# BERKAH LIVING — DEBUGGING REPORT

## 📋 Ringkasan

**Project:** Berkoh Living (e-commerce admin)
**Platform:** Vercel + Next.js 15.5.18
**Supabase:** nyswjttnzstjnbcrmffw

---

## ❌ ERROR LOG — React Event Handlers Not Firing

### Symptom
Button clicks dan form submissions tidak ter-trigger di Vercel production, tapi work locally.

### Error Messages
```
# Build: Success ✓

# Runtime di browser:
- Button click: TIDAK ADA RESPON
- Form submit: TIDAK ADA RESPON  
- Console: TIDAK ADA ERROR

# Vercel Deployment Logs:
✓ Deployment successful
✓ No build errors
✓ No runtime errors in logs
```

### Tried Approaches

| Approach | Status | Notes |
|----------|--------|-------|
| React onClick | ❌ GAGAL | Button tidak ter-trigger |
| React onSubmit | ❌ GAGAL | Form tidak submit |
| Server Action | ❌ GAGAL | Tidak ter-execute |
| Vanilla JS event listener | ❌ GAGAL | Tidak ter-attach |
| Native HTML form (method="POST") | ❌ GAGAL | Tidak ter-submit |
| Next.js 14.x downgrade | ❌ GAGAL | Too many breaking changes |

---

## 📄 CODE — Admin & Akses Page

### File: `app/admin/settings/admin-access/page.tsx`

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Admin {
  id: string
  name: string
  email: string
  phone: string
  role: 'owner' | 'admin' | 'staff'
  status: 'active' | 'inactive'
  created_at: string
}

export default function AdminAccessPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdmins()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/access')
      if (!res.ok) throw new Error('Failed to fetch admins')
      const data = await res.json()
      setAdmins(data.admins || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading admins')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setError('')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus admin ini?')) return

    try {
      const res = await fetch(`/api/admin/access/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete admin')
      await fetchAdmins()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting admin')
    }
  }

  const handleToggleStatus = async (admin: Admin) => {
    try {
      const newStatus = admin.status === 'active' ? 'inactive' : 'active'
      const res = await fetch(`/api/admin/access/${admin.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error('Failed to update status')
      await fetchAdmins()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating status')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/settings"
            className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
          >
            ← Kembali
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Admin & Akses</h1>
          <p className="text-gray-600 mt-2">Kelola admin dan permission akses</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + Tambah Admin
          </button>
        )}

        {/* Form - Native HTML */}
        {showForm && (
          <div className="mb-6 p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Tambah Admin Baru</h2>
            <form action="/api/admin/access" method="POST" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor HP
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="08123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8 text-gray-600">Loading...</div>
        )}

        {/* Admin List */}
        {!loading && admins.length > 0 && (
          <div className="space-y-3">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="p-4 bg-white rounded-lg border border-gray-200"
              >
                <h3 className="font-semibold">{admin.name}</h3>
                <p className="text-sm text-gray-600">{admin.email}</p>
                <p className="text-sm text-gray-600">{admin.phone}</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {admin.role}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    admin.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {admin.status}
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(admin)}
                    className="px-3 py-1 text-sm"
                  >
                    {admin.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="px-3 py-1 bg-red-100 text-red-600 text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

### File: `app/api/admin/access/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const storeId = process.env.NEXT_PUBLIC_STORE_ID

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ admins: [], error: error.message }, { status: 200 })
    }

    return NextResponse.json({ admins: data || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', admins: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const storeId = process.env.NEXT_PUBLIC_STORE_ID

    const { name, email, phone, role } = body

    if (!name || !email || !phone || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('admins')
      .insert([{ store_id: storeId, name, email, phone, role, status: 'active' }])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### File: `app/api/admin/access/[id]/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const body = await request.json()
    const { name, email, phone, role } = body

    const { data, error } = await supabase
      .from('admins')
      .update({ name, email, phone, role })
      .eq('id', params.id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const body = await request.json()
    const { status } = body

    const { data, error } = await supabase
      .from('admins')
      .update({ status })
      .eq('id', params.id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## 📊 ROOT CAUSE ANALYSIS

### Possible Causes

1. **React Hydration Mismatch**
   - Server renders HTML, client hydrates but event listeners don't attach
   - Tried: setTimeout in useEffect — TIDAK BERHASIL

2. **Next.js 15.x Breaking Changes**
   - Params sekarang Promise di Next.js 15.x
   - Tried: Downgrade ke Next.js 14.x — GAGAL (terlalu banyak breaking changes)

3. **Vercel Deployment Issue**
   - Vercel cache/delays mungkin cause issues
   - Tried: Force redeploy — TIDAK BERHASIL

4. **CSP/Middleware Blocking**
   - Tried: Check CSP headers — TIDAK ADA yang block
   - Tried: Cloudflare Pages — ERROR 522 (deployment gagal)

5. **JavaScript Execution Blocked**
   - Tried: Vanilla JS alert() — WORKS (JS execute)
   - Tried: React event handlers — TIDAK WORKS
   - Ini bukan JS execution issue, ini React-specific issue

---

## 🎯 KESIMPULAN

- ✅ **Admin & Akses page UI** — Berhasil dibuat
- ✅ **API endpoints** — Berfungsi (tested via curl)
- ⚠️ **Form interaction** — TIDAK BERFUNGSI di Vercel production
- ❌ **Root cause** — Belum ketemu setelah 10+ approaches coba

### Rekomendasi

1. **Move on** ke menu lain — Admin & Akses UI sudah ada
2. **Switch platform** — Railway atau self-hosted
3. **Hire specialist** untuk deep debugging Vercel

---

## 📝 CHANGELOG

| Tanggal | Aktivitas |
|---------|-----------|
| 2024-05-23 | Admin & Akses page created |
| 2024-05-23 | Multiple approaches tried (onClick, form, Server Action, vanilla JS) |
| 2024-05-23 | Attempted Next.js 14.x downgrade — failed |
| 2024-05-23 | Attempted Cloudflare Pages — 522 error |
| 2024-05-23 | Native HTML form — still not working |

---

*Document generated: 2024-05-23*
*Project: berkah-living*
*Platform: Vercel + Next.js 15.5.18*
