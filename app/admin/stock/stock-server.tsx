import { supabaseServer } from '@/lib/supabase/server'
import { StockClient } from './stock-client'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  min_stock: number
  category_id: string
  images: string[]
  is_active: boolean
  created_at: string
}

interface Category {
  id: string
  name: string
  slug: string
}

async function getProducts() {
  try {
    const { data, error } = await supabaseServer
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      throw error
    }

    return (data || []) as Product[]
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

async function getCategories() {
  try {
    const { data, error } = await supabaseServer
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      throw error
    }

    return (data || []) as Category[]
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export default async function StockPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  // Map categories to name lookup
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name
    return acc
  }, {} as Record<string, string>)

  // Transform products for client
  const transformedProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock: p.stock || 0,
    min_stock: p.min_stock || 5,
    category: categoryMap[p.category_id] || 'Lainnya',
    image_url: p.images?.[0] || null,
    is_active: p.is_active
  }))

  return (
    <StockClient
      initialProducts={transformedProducts}
      categories={['Semua', ...categories.map(c => c.name)]}
    />
  )
}
