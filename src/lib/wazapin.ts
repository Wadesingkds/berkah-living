// lib/wazapin.ts - Wazapin WhatsApp Gateway

const WAZAPIN_API_KEY = process.env.NEXT_PUBLIC_WAZAPIN_API_KEY;
const WAZAPIN_BASE_URL = 'https://api.wazapin.com/v1';
const WAZAPIN_SENDER = process.env.NEXT_PUBLIC_WAZAPIN_SENDER || '6285156081257';

export interface WazapinMessage {
  phone: string;
  message: string;
  mediaUrl?: string;
}

export interface WazapinResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send WhatsApp message via Wazapin
 */
export async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<WazapinResponse> {
  if (!WAZAPIN_API_KEY) {
    return {
      success: false,
      error: 'Wazapin API key not configured',
    };
  }

  try {
    // Normalize phone number (remove +, add country code if needed)
    let normalizedPhone = phone.replace(/\D/g, '');
    if (!normalizedPhone.startsWith('62')) {
      normalizedPhone = '62' + normalizedPhone;
    }

    const response = await fetch(`${WAZAPIN_BASE_URL}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WAZAPIN_API_KEY}`,
      },
      body: JSON.stringify({
        phone: normalizedPhone,
        message: message,
        sender: WAZAPIN_SENDER,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to send message',
      };
    }

    return {
      success: true,
      messageId: data.message_id,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Send order confirmation to customer
 */
export async function sendOrderConfirmation(
  customerPhone: string,
  customerName: string,
  orderId: string,
  total: number,
  items: Array<{ name: string; qty: number; price: number }>
): Promise<WazapinResponse> {
  const itemsList = items
    .map((item) => `• ${item.name} x${item.qty} = Rp ${(item.qty * item.price).toLocaleString('id-ID')}`)
    .join('\n');

  const message = `Halo ${customerName}! 👋

Terima kasih atas pesanan Anda di Berkah Living.

*Detail Pesanan:*
${itemsList}

*Total: Rp ${total.toLocaleString('id-ID')}*
*No. Order: ${orderId}*

Silakan lakukan pembayaran sesuai metode yang dipilih.

Terima kasih! 🙏`;

  return sendWhatsAppMessage(customerPhone, message);
}

/**
 * Send payment reminder to customer
 */
export async function sendPaymentReminder(
  customerPhone: string,
  customerName: string,
  orderId: string,
  total: number
): Promise<WazapinResponse> {
  const message = `Halo ${customerName}! 💬

Kami ingin mengingatkan bahwa pesanan Anda masih menunggu pembayaran.

*No. Order: ${orderId}*
*Total: Rp ${total.toLocaleString('id-ID')}*

Silakan selesaikan pembayaran untuk memproses pesanan Anda.

Terima kasih! 🙏`;

  return sendWhatsAppMessage(customerPhone, message);
}

/**
 * Send order status update to customer
 */
export async function sendOrderStatusUpdate(
  customerPhone: string,
  customerName: string,
  orderId: string,
  status: string
): Promise<WazapinResponse> {
  const statusMessages: Record<string, string> = {
    PAID: '✅ Pembayaran diterima! Pesanan Anda sedang dipersiapkan.',
    DELIVERED: '🚚 Pesanan Anda sedang dalam perjalanan.',
    DONE: '📦 Pesanan Anda telah diterima. Terima kasih!',
    CANCELLED: '❌ Pesanan Anda telah dibatalkan.',
  };

  const statusMessage = statusMessages[status] || `Status pesanan: ${status}`;

  const message = `Halo ${customerName}! 📬

${statusMessage}

*No. Order: ${orderId}*

Jika ada pertanyaan, silakan hubungi kami.

Terima kasih! 🙏`;

  return sendWhatsAppMessage(customerPhone, message);
}

/**
 * Send admin notification for new order
 */
export async function sendAdminNotification(
  adminPhone: string,
  orderId: string,
  customerName: string,
  total: number,
  itemCount: number
): Promise<WazapinResponse> {
  const message = `🔔 *PESANAN BARU*

*No. Order: ${orderId}*
*Customer: ${customerName}*
*Total: Rp ${total.toLocaleString('id-ID')}*
*Jumlah Item: ${itemCount}*

Silakan cek dashboard untuk detail lengkap.`;

  return sendWhatsAppMessage(adminPhone, message);
}
