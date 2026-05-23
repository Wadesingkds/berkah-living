import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const {
      storeName,
      ordersYesterday,
      revenueYesterday,
      averageOrders7Days,
      averageRevenue7Days,
      topProducts,
      newCustomers,
      repeatCustomers,
      channels,
    } = await request.json();

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `Kamu adalah analis bisnis untuk toko "${storeName}".

Data kemarin:
- Total order: ${ordersYesterday}
- Omzet: Rp ${revenueYesterday.toLocaleString('id-ID')}

Rata-rata 7 hari:
- Order: ${averageOrders7Days}
- Omzet: Rp ${averageRevenue7Days.toLocaleString('id-ID')}

Breakdown channel:
${Object.entries(channels || {})
  .map(([channel, count]) => `- ${channel}: ${count}`)
  .join('\n')}

Produk terlaris:
${(topProducts || []).map((p) => `- ${p.name}: ${p.count} order`).join('\n')}

Customer:
- Baru: ${newCustomers}
- Repeat: ${repeatCustomers}

Berikan 2-3 insight actionable dalam Bahasa Indonesia, singkat, langsung ke poin.
Fokus: anomali positif/negatif dan rekomendasi tindakan hari ini.
Format: array JSON dengan string insights, max 100 kata per insight.

Contoh output:
["Insight 1 singkat", "Insight 2 singkat"]`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
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
      return NextResponse.json(
        { error: data.error?.message || 'Failed to generate insights' },
        { status: 400 }
      );
    }

    const content = data.content[0]?.text || '';
    const jsonMatch = content.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Invalid response format' },
        { status: 400 }
      );
    }

    const insights = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      insights: Array.isArray(insights) ? insights : [insights],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
