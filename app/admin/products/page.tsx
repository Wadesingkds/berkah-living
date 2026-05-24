import { supabaseServer } from '@/lib/supabase/server'
import { ProductsClient } from './products-client'

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  price: number
  category_id: string
  images: string[]
  is_active: boolean
  created_at: string
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

export default async function ProductsPage() {
  // Parallel fetch - both requests run simultaneously
  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
  ])

  return (
    <ProductsClient
      initialProducts={products || []}
      categories={categories || []}
    />
  )
}