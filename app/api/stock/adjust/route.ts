import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { product_id, adjustment } = await request.json();

    if (!product_id || typeof adjustment !== 'number') {
      return NextResponse.json(
        { error: 'product_id dan adjustment diperlukan' },
        { status: 400 }
      );
    }

    // Get current stock
    const { data: product, error: fetchError } = await supabaseServer
      .from('products')
      .select('stock')
      .eq('id', product_id)
      .single();

    if (fetchError || !product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    const newStock = product.stock + adjustment;

    if (newStock < 0) {
      return NextResponse.json(
        { error: 'Stok tidak boleh negatif' },
        { status: 400 }
      );
    }

    // Update stock
    const { data, error: updateError } = await supabaseServer
      .from('products')
      .update({ stock: newStock })
      .eq('id', product_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Stock adjustment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
