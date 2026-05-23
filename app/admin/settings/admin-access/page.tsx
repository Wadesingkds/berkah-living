'use client'

import { useState, useEffect, useCallback } from 'react'
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

interface FormData {
  name: string
  email: string
  phone: string
  role: 'owner' | 'admin' | 'staff'
}

export default function AdminAccessPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
  })

  const fetchAdmins = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdmins()
    }, 0)
    return () => clearTimeout(timer)
  }, [fetchAdmins])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/admin/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Gagal menyimpan admin')
      }

      setShowForm(false)
      setFormData({ name: '', email: '', phone: '', role: 'staff' })
      await fetchAdmins()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error menyimpan admin')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setFormData({ name: '', email: '', phone: '', role: 'staff' })
    setError('')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus admin ini?')) return
    try {
      const res = await fetch(`/api/admin/access/${id}`, { method: 'DELETE' })
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
            type="button"
            onClick={() => setShowForm(true)}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + Tambah Admin
          </button>
        )}

        {/* Form — React controlled */}
        {showForm && (
          <div className="mb-6 p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Tambah Admin Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as FormData['role'] }))}
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
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
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

        {/* Empty state */}
        {!loading && admins.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Belum ada admin. Tambahkan admin pertama.
          </div>
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
                    type="button"
                    onClick={() => handleToggleStatus(admin)}
                    className="px-3 py-1 text-sm bg-gray-100 rounded"
                  >
                    {admin.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(admin.id)}
                    className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded"
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
