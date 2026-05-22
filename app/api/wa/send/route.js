import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { action, phone, message, orderId, customerName, total, items, status, adminPhone } = await request.json();

    const WAZAPIN_API_KEY = process.env.NEXT_PUBLIC_WAZAPIN_API_KEY;
    const WAZAPIN_SENDER = process.env.NEXT_PUBLIC_WAZAPIN_SENDER || '6285156081257';

    if (!WAZAPIN_API_KEY) {
      return NextResponse.json(
        { error: 'Wazapin API key not configured' },
        { status: 500 }
      );
    }

    // Normalize phone
    let normalizedPhone = phone?.replace(/\D/g, '') || '';
    if (normalizedPhone && !normalizedPhone.startsWith('62')) {
      normalizedPhone = '62' + normalizedPhone;
    }

    let finalMessage = message;

    // Construct message based on action
    if (action === 'order_confirmation' && items) {
      const itemsList = items
        .map((item) => `• ${item.name} x${item.qty} = Rp ${(item.qty * item.price).toLocaleString('id-ID')}`)
        .join('\n');
      
      finalMessage = `Halo ${customerName}! 👋

Terima kasih atas pesanan Anda di Berkah Living.

*Detail Pesanan:*
${itemsList}

*Total: Rp ${total.toLocaleString('id-ID')}*
*No. Order: ${orderId}*

Silakan lakukan pembayaran sesuai metode yang dipilih.

Terima kasih! 🙏`;
    } else if (action === 'payment_reminder') {
      finalMessage = `Halo ${customerName}! 💬

Kami ingin mengingatkan bahwa pesanan Anda masih menunggu pembayaran.

*No. Order: ${orderId}*
*Total: Rp ${total.toLocaleString('id-ID')}*

Silakan selesaikan pembayaran untuk memproses pesanan Anda.

Terima kasih! 🙏`;
    } else if (action === 'status_update') {
      const statusMessages = {
        PAID: 'Pembayaran diterima! Pesanan Anda sedang dipersiapkan.',
        DELIVERED: 'Pesanan Anda sedang dalam perjalanan.',
        DONE: 'Pesanan Anda telah diterima. Terima kasih!',
        CANCELLED: 'Pesanan Anda telah dibatalkan.',
      };
      
      finalMessage = `Halo ${customerName}! 📬

${statusMessages[status] || `Status pesanan: ${status}`}

*No. Order: ${orderId}*

Jika ada pertanyaan, silakan hubungi kami.

Terima kasih! 🙏`;
    } else if (action === 'admin_notification' && adminPhone) {
      finalMessage = `🔔 *PESANAN BARU*

*No. Order: ${orderId}*
*Customer: ${customerName}*
*Total: Rp ${total.toLocaleString('id-ID')}*
*Jumlah Item: ${items?.length || 0}*

Silakan cek dashboard untuk detail lengkap.`;
    }

    if (!finalMessage) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Send to customer
    if (normalizedPhone) {
      const response = await fetch('https://api.wazapin.com/v1/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WAZAPIN_API_KEY}`,
        },
        body: JSON.stringify({
          phone: normalizedPhone,
          message: finalMessage,
          sender: WAZAPIN_SENDER,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data.message || 'Failed to send message' },
          { status: 400 }
        );
      }

      // Also notify admin if action is new order
      if (action === 'order_confirmation' && adminPhone) {
        const adminMessage = `🔔 *PESANAN BARU*

*No. Order: ${orderId}*
*Customer: ${customerName}*
*Total: Rp ${total.toLocaleString('id-ID')}*
*Jumlah Item: ${items?.length || 0}*

Silakan cek dashboard untuk detail lengkap.`;

        let adminPhoneNormalized = adminPhone.replace(/\D/g, '');
        if (!adminPhoneNormalized.startsWith('62')) {
          adminPhoneNormalized = '62' + adminPhoneNormalized;
        }

        await fetch('https://api.wazapin.com/v1/messages/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${WAZAPIN_API_KEY}`,
          },
          body: JSON.stringify({
            phone: adminPhoneNormalized,
            message: adminMessage,
            sender: WAZAPIN_SENDER,
          }),
        });
      }

      return NextResponse.json({
        success: true,
        messageId: data.message_id,
      });
    }

    return NextResponse.json(
      { error: 'Phone number is required' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
