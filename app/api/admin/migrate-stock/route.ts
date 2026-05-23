import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Add stock columns
    const { error: alterError } = await supabase.rpc('exec_sql', {
      query: `
        ALTER TABLE products
        ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 5;
      `
    })

    if (alterError) {
      console.error('Alter error:', alterError)
      // Try direct query approach
      const { error: directError } = await supabase
        .from('products')
        .select('stock, min_stock')
        .limit(1)
      
      if (directError && directError.message.includes('column')) {
        // Columns don't exist, need to add them manually via Supabase dashboard
        return NextResponse.json({
          success: false,
          message: 'Please add columns manually via Supabase SQL Editor',
          sql: `
ALTER TABLE products
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 5;

CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
          `
        }, { status: 500 })
      }
    }

    // Create index
    const { error: indexError } = await supabase.rpc('exec_sql', {
      query: 'CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);'
    })

    if (indexError) {
      console.warn('Index error (non-critical):', indexError)
    }

    return NextResponse.json({
      success: true,
      message: 'Stock columns added successfully'
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      sql: `
ALTER TABLE products
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 5;

CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
      `
    }, { status: 500 })
  }
}
