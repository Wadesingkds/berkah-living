import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST() {
  try {
    // Create categories table
    const { error: createError } = await supabaseServer.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS categories (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          is_active BOOLEAN DEFAULT true,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (createError) {
      console.error('Create table error:', createError)
    }

    // Insert default categories
    const { error: insertError } = await supabaseServer
      .from('categories')
      .upsert([
        { name: 'Daster', slug: 'daster', description: 'Koleksi daster premium', sort_order: 1 },
        { name: 'Parfum', slug: 'parfum', description: 'Parfum original dan dupe', sort_order: 2 },
        { name: 'Aksesoris', slug: 'aksesoris', description: 'Aksesoris fashion', sort_order: 3 },
        { name: 'Lainnya', slug: 'lainnya', description: 'Produk lainnya', sort_order: 4 },
      ], { onConflict: 'slug' })

    if (insertError) {
      console.error('Insert error:', insertError)
    }

    // Add category_id column to products
    const { error: alterError } = await supabaseServer.rpc('exec_sql', {
      sql: `ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID;`
    })

    if (alterError) {
      console.error('Alter table error:', alterError)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Categories table created and seeded'
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
