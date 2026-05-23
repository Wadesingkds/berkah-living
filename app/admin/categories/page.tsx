'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  sort_order: number
  is_active: boolean
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Category>>({})
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleSave = async (id: string | null) => {
    setError('')
    setSuccess('')

    const categoryData = id ? editForm : newCategory

    if (!categoryData.name?.trim()) {
      setError('Nama kategori wajib diisi')
      return
    }

    if (!categoryData.slug?.trim()) {
      setError('Slug wajib diisi')
      return
    }

    try {
      const method = id ? 'PATCH' : 'POST'
      const url = id ? `/api/admin/categories/${id}` : '/api/admin/categories'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      })

      if (res.ok) {
        setSuccess(id ? 'Kategori berhasil diupdate' : 'Kategori berhasil ditambah')
        setEditingId(null)
        setEditForm({})
        setNewCategory({
          name: '',
          slug: '',
          description: '',
          sort_order: 0,
          is_active: true,
        })
        fetchCategories()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Gagal menyimpan kategori')
      }
    } catch (err) {
      console.error('Failed to save category:', err)
      setError('Error: ' + (err as Error).message)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin hapus kategori "${name}"?`)) return

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSuccess('Kategori berhasil dihapus')
        fetchCategories()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Gagal hapus kategori')
      }
    } catch (err) {
      console.error('Failed to delete category:', err)
      setError('Error: ' + (err as Error).message)
    }
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setEditForm({ ...category })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Kategori Produk</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {success}
        </div>
      )}

      {/* Add New Category Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Tambah Kategori Baru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Kategori *
            </label>
            <input
              type="text"
              value={newCategory.name || ''}
              onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Contoh: Daster"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={newCategory.slug || ''}
              onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })}
              placeholder="Contoh: daster"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={newCategory.description || ''}
              onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
              placeholder="Deskripsi kategori"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urutan
            </label>
            <input
              type="number"
              value={newCategory.sort_order || 0}
              onChange={e => setNewCategory({ ...newCategory, sort_order: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newCategory.is_active || false}
                onChange={e => setNewCategory({ ...newCategory, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Aktif</span>
            </label>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => handleSave(null)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Kategori
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold">Daftar Kategori ({categories.length})</h2>
        </div>
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Belum ada kategori. Tambah kategori baru di atas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Slug</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Deskripsi</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Urutan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50 transition">
                    {editingId === category.id ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.name || ''}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.slug || ''}
                            onChange={e => setEditForm({ ...editForm, slug: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.description || ''}
                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={editForm.sort_order || 0}
                            onChange={e => setEditForm({ ...editForm, sort_order: Number(e.target.value) })}
                            className="w-full px-3 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editForm.is_active ? 'true' : 'false'}
                            onChange={e => setEditForm({ ...editForm, is_active: e.target.value === 'true' })}
                            className="w-full px-3 py-1 border border-gray-300 rounded"
                          >
                            <option value="true">Aktif</option>
                            <option value="false">Nonaktif</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => handleSave(category.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                            title="Simpan"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded transition"
                            title="Batal"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-medium">{category.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{category.slug}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {category.description || '-'}
                        </td>
                        <td className="px-6 py-4">{category.sort_order}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              category.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {category.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => startEdit(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id, category.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
