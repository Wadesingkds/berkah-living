import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials not configured');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Handle webhook notification from Pakasir
    if (body.event === 'payment.completed' || body.status === 'PAID') {
      const { transactionId, status, amount } = body;
      
      // Update order status in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status: 'PAID' })
        .eq('id', transactionId);
      
      if (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
      }
      
      return NextResponse.json({ success: true });
    }
    
    // Handle QRIS creation request (from checkout page)
    const { orderId, amount, customerName, customerPhone } = body;

    const PAKASIR_SLUG = process.env.NEXT_PUBLIC_PAKASIR_SLUG || 'kiosk-wa';
    const PAKASIR_API_KEY = process.env.NEXT_PUBLIC_PAKASIR_API_KEY;

    if (!PAKASIR_API_KEY) {
      return NextResponse.json(
        { error: 'Pakasir API key not configured' },
        { status: 500 }
      );
    }

    const payload = {
      slug: PAKASIR_SLUG,
      order_id: orderId,
      amount: amount,
      description: `Order ${orderId}`,
      customer_name: customerName,
      customer_phone: customerPhone,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://kioskwa.vercel.app'}/buyer/checkout/success`,
    };

    const response = await fetch('https://api.pakasir.id/v1/qris/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAKASIR_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to create QRIS payment' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      qrCode: data.qr_code,
      qrCodeUrl: data.qr_code_url,
      transactionId: data.transaction_id,
      amount: data.amount,
      expiresAt: data.expires_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'transactionId required' },
        { status: 400 }
      );
    }

    const PAKASIR_API_KEY = process.env.NEXT_PUBLIC_PAKASIR_API_KEY;

    if (!PAKASIR_API_KEY) {
      return NextResponse.json(
        { error: 'Pakasir API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.pakasir.id/v1/qris/status/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${PAKASIR_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      status: data.status,
      amount: data.amount,
      paidAt: data.paid_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
