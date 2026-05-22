import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const status = searchParams.get('status')
  const customerId = searchParams.get('customer_id')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabase
    .from('orders')
    .select(
      '*, customer:customers(*), items:order_items(*, product:products(*))',
      { count: 'exact' }
    )

  if (status) {
    query = query.eq('status', status)
  }
  if (customerId) {
    query = query.eq('customer_id', customerId)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { items, ...orderData } = body

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select('*, customer:customers(*)')
    .single()

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 })
  }

  if (items && items.length > 0) {
    const orderItems = items.map((item: { product_id: string; qty: number; price: number }) => ({
      order_id: order.id,
      product_id: item.product_id,
      qty: item.qty,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }
  }

  const { data: fullOrder, error: fetchError } = await supabase
    .from('orders')
    .select('*, customer:customers(*), items:order_items(*, product:products(*))')
    .eq('id', order.id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json(fullOrder, { status: 201 })
}
