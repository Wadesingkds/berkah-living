'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Save, Upload, X, AlertCircle } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  compare_at_price?: number
  category: string
  images: string[]
  is_active: boolean
}

export default function ProductFormPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const isNew = productId === 'new'

  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    compare_at_price: 0,
    category: 'daster',
    images: [],
    is_active: true,
  })

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/products/${productId}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
      } else {
        setError('Gagal memuat produk')
      }
    } catch (err) {
      console.error('Failed to fetch product:', err)
      setError('Error: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isNew) {
      fetchProduct()
    }
  }, [productId, isNew])
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/products/${productId}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
      } else {
        setError('Gagal memuat produk')
      }
    } catch (err) {
      console.error('Failed to fetch product:', err)
      setError('Error: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Validate file size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSize) {
        setError(`File ${files[i].name} terlalu besar (max 5MB)`)
        return
      }
    }

    setUploadingImage(true)
    setError('')

    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const { urls } = await res.json()
        setProduct(prev => ({
          ...prev,
          images: [...(prev.images || []), ...urls],
        }))
        setSuccess(`${urls.length} foto berhasil diupload`)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Gagal upload foto')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Error upload: ' + (err as Error).message)
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!product.name?.trim()) {
      setError('Nama produk wajib diisi')
      return
    }
    if (!product.price || product.price <= 0) {
      setError('Harga harus lebih dari 0')
      return
    }
    if (!product.images || product.images.length === 0) {
      setError('Minimal 1 foto produk')
      return
    }

    setSaving(true)

    try {
      const method = isNew ? 'POST' : 'PATCH'
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${productId}`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })

      if (res.ok) {
        setSuccess(isNew ? 'Produk berhasil ditambah' : 'Produk berhasil diupdate')
        setTimeout(() => {
          router.push('/admin/products')
        }, 1000)
      } else {
        const data = await res.json()
        setError(data.error || 'Gagal menyimpan produk')
      }
    } catch (err) {
      console.error('Failed to save product:', err)
      setError('Error: ' + (err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isNew ? 'Tambah Produk Baru' : 'Edit Produk'}
      </h1>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Nama Produk */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Produk *
          </label>
          <input
            type="text"
            value={product.name || ''}
            onChange={e => setProduct({ ...product, name: e.target.value })}
            placeholder="Contoh: Daster Katun Premium"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            value={product.description || ''}
            onChange={e => setProduct({ ...product, description: e.target.value })}
            placeholder="Jelaskan detail produk, bahan, ukuran, dll"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori *
          </label>
          <select
            value={product.category || 'daster'}
            onChange={e => setProduct({ ...product, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="daster">Daster</option>
            <option value="parfum">Parfum</option>
            <option value="aksesoris">Aksesoris</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

        {/* Harga */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Harga *
            </label>
            <input
              type="number"
              value={product.price || 0}
              onChange={e => setProduct({ ...product, price: Number(e.target.value) })}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Harga Coret (Opsional)
            </label>
            <input
              type="number"
              value={product.compare_at_price || 0}
              onChange={e => setProduct({ ...product, compare_at_price: Number(e.target.value) })}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Upload Foto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto Produk * (Min 1 foto)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                {uploadingImage ? 'Uploading...' : 'Klik untuk upload atau drag & drop'}
              </span>
              <span className="text-xs text-gray-500">Max 5MB per file</span>
            </label>
          </div>

          {/* Image Preview */}
          {product.images && product.images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Foto ({product.images.length})
              </p>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-24 object-cover rounded border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      title="Hapus foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={product.is_active || false}
              onChange={e => setProduct({ ...product, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Produk Aktif</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}
