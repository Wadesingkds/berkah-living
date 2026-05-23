import { supabaseServer } from '@/lib/supabase/server'
import { CategoriesClient } from './categories-client'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  sort_order: number
  is_active: boolean
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

export default async function CategoriesPage() {
  const categories = await getCategories()

  return <CategoriesClient initialCategories={categories} />
}