import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { product_id, adjustment } = await request.json()

    if (!product_id || adjustment === undefined || adjustment === 0) {
      return NextResponse.json(
        { error: 'Invalid product_id or adjustment' },
        { status: 400 }
      )
    }

    // Get current stock
    const { data: product, error: fetchError } = await supabaseServer
      .from('products')
      .select('stock')
      .eq('id', product_id)
      .single()

    if (fetchError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const newStock = Math.max(0, (product.stock || 0) + adjustment)

    // Update stock
    const { error: updateError } = await supabaseServer
      .from('products')
      .update({ stock: newStock })
      .eq('id', product_id)

    if (updateError) {
      console.error('Stock update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update stock' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      product_id,
      old_stock: product.stock || 0,
      new_stock: newStock,
      adjustment
    })
  } catch (error) {
    console.error('Stock adjustment error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
