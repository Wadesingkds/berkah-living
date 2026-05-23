import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

// GET - List all categories
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// POST - Create new category
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, sort_order } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug required' }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('categories')
      .insert([{ name, slug, description, sort_order, is_active: true }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to create category:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
