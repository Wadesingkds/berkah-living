// lib/pakasir.ts - Pakasir QRIS Payment Gateway

const PAKASIR_SLUG = process.env.NEXT_PUBLIC_PAKASIR_SLUG || 'kiosk-wa';
const PAKASIR_API_KEY = process.env.NEXT_PUBLIC_PAKASIR_API_KEY;
const PAKASIR_BASE_URL = 'https://api.pakasir.id/v1';

export interface PakasirPaymentRequest {
  orderId: string;
  amount: number;
  description: string;
  customerName: string;
  customerPhone: string;
  returnUrl?: string;
}

export interface PakasirPaymentResponse {
  success: boolean;
  data?: {
    qrCode: string;
    qrCodeUrl: string;
    transactionId: string;
    amount: number;
    expiresAt: string;
  };
  error?: string;
}

export async function createQRISPayment(
  request: PakasirPaymentRequest
): Promise<PakasirPaymentResponse> {
  if (!PAKASIR_API_KEY) {
    return {
      success: false,
      error: 'Pakasir API key not configured',
    };
  }

  try {
    const payload = {
      slug: PAKASIR_SLUG,
      order_id: request.orderId,
      amount: request.amount,
      description: request.description,
      customer_name: request.customerName,
      customer_phone: request.customerPhone,
      return_url: request.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/buyer/checkout/success`,
    };

    const response = await fetch(`${PAKASIR_BASE_URL}/qris/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAKASIR_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to create QRIS payment',
      };
    }

    return {
      success: true,
      data: {
        qrCode: data.qr_code,
        qrCodeUrl: data.qr_code_url,
        transactionId: data.transaction_id,
        amount: data.amount,
        expiresAt: data.expires_at,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function checkPaymentStatus(transactionId: string) {
  if (!PAKASIR_API_KEY) {
    return { success: false, error: 'Pakasir API key not configured' };
  }

  try {
    const response = await fetch(
      `${PAKASIR_BASE_URL}/qris/status/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${PAKASIR_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message };
    }

    return {
      success: true,
      data: {
        status: data.status, // 'pending' | 'paid' | 'expired' | 'failed'
        amount: data.amount,
        paidAt: data.paid_at,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
