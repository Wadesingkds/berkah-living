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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="08123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
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
                className="p-4 bg-white rounded-lg border border-gray-200 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                  <p className="text-sm text-gray-600">{admin.phone}</p>
                  <div className="mt-2 flex gap-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                      {admin.role}
                    </span>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded font-medium ${
                        admin.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {admin.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(admin)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      admin.status === 'active'
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {admin.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && admins.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p className="mb-4">Belum ada admin</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Tambah Admin Pertama
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
