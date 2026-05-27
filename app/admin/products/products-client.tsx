'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  price: number
  category_id: string | null
  image_url: string | null
  images?: string[]
  is_active: boolean
  created_at: string
}

interface ProductsClientProps {
  initialProducts: Product[]
  categories: Category[]
}

export function ProductsClient({ initialProducts = [], categories = [] }: ProductsClientProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts || [])
  const [filterCategoryId, setFilterCategoryId] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin hapus produk "${name}"?`)) return

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
      } else {
        alert('Gagal hapus produk')
      }
    } catch (err) {
      console.error('Failed to delete product:', err)
      alert('Error: ' + (err as Error).message)
    }
  }

  const filteredProducts = (products || []).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategoryId === 'all' || p.category_id === filterCategoryId
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produk</h1>
        <button
          onClick={() => router.push('/admin/products/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg flex items-center gap-2"
            />
          </div>
          <select
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Nama</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Kategori</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Harga</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Foto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => {
              const category = categories.find(c => c.id === product.category_id)
              return (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{product.name}</td>
                  <td className="px-6 py-4 text-sm">{category?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-sm">
                    {(() => {
                      const imgs = product.images || (product.image_url ? [product.image_url] : [])
                      return imgs.length > 0 ? (
                        <div className="flex gap-1">
                          {imgs.slice(0, 3).map((img, i) => (
                            <img key={i} src={img} alt="product" className="w-8 h-8 rounded object-cover" />
                          ))}
                          {imgs.length > 3 && <span className="text-xs text-gray-500">+{imgs.length - 3}</span>}
                        </div>
                      ) : '-'
                    })()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {product.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/products/${product.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Tidak ada produk
          </div>
        )}
      </div>
    </div>
  )
}