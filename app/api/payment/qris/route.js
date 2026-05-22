import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { orderId, amount, customerName, customerPhone } = await request.json();

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
      { error: (error).message },
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
      { error: (error).message },
      { status: 500 }
    );
  }
}
