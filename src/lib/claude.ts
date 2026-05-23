// lib/claude.ts - Claude AI Insights

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_BASE_URL = 'https://api.anthropic.com/v1';

export interface InsightRequest {
  storeName: string;
  ordersYesterday: number;
  revenueYesterday: number;
  averageOrders7Days: number;
  averageRevenue7Days: number;
  topProducts: Array<{ name: string; count: number }>;
  newCustomers: number;
  repeatCustomers: number;
  channels: Record<string, number>;
}

export interface InsightResponse {
  success: boolean;
  insights?: string[];
  error?: string;
}

/**
 * Generate daily business insights using Claude
 */
export async function generateDailyInsight(
  request: InsightRequest
): Promise<InsightResponse> {
  if (!ANTHROPIC_API_KEY) {
    return {
      success: false,
      error: 'Anthropic API key not configured',
    };
  }

  try {
    const prompt = `Kamu adalah analis bisnis untuk toko "${request.storeName}".

Data kemarin:
- Total order: ${request.ordersYesterday}
- Omzet: Rp ${request.revenueYesterday.toLocaleString('id-ID')}

Rata-rata 7 hari:
- Order: ${request.averageOrders7Days}
- Omzet: Rp ${request.averageRevenue7Days.toLocaleString('id-ID')}

Breakdown channel:
${Object.entries(request.channels)
  .map(([channel, count]) => `- ${channel}: ${count}`)
  .join('\n')}

Produk terlaris:
${request.topProducts.map((p) => `- ${p.name}: ${p.count} order`).join('\n')}

Customer:
- Baru: ${request.newCustomers}
- Repeat: ${request.repeatCustomers}

Berikan 2-3 insight actionable dalam Bahasa Indonesia, singkat, langsung ke poin.
Fokus: anomali positif/negatif dan rekomendasi tindakan hari ini.
Format: array JSON dengan string insights, max 100 kata per insight.

Contoh output:
["Insight 1 singkat", "Insight 2 singkat", "Insight 3 singkat"]`;

    const response = await fetch(`${ANTHROPIC_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'Failed to generate insights',
      };
    }

    // Extract text from response
    const content = data.content[0]?.text || '';
    
    // Parse JSON array from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return {
        success: false,
        error: 'Invalid response format',
      };
    }

    const insights = JSON.parse(jsonMatch[0]);

    return {
      success: true,
      insights: Array.isArray(insights) ? insights : [insights],
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Generate customer retention message
 */
export async function generateRetentionMessage(
  customerName: string,
  favoriteProducts: string[],
  daysSinceOrder: number
): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!ANTHROPIC_API_KEY) {
    return {
      success: false,
      error: 'Anthropic API key not configured',
    };
  }

  try {
    const prompt = `Buat pesan WhatsApp personal untuk customer bernama "${customerName}" yang tidak order selama ${daysSinceOrder} hari.

Produk favorit mereka: ${favoriteProducts.join(', ')}

Pesan harus:
- Personal (sebut nama)
- Singkat (max 3 baris)
- Mention produk favorit
- Ajak order kembali
- Bahasa santai (tidak formal)

Output: hanya pesan, tanpa penjelasan tambahan`;

    const response = await fetch(`${ANTHROPIC_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'Failed to generate message',
      };
    }

    const message = data.content[0]?.text || '';

    return {
      success: true,
      message: message.trim(),
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
