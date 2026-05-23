import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    const storeId = process.env.NEXT_PUBLIC_STORE_ID

    const { data, error } = await supabaseServer
      .from('admins')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { admins: [], error: error.message },
        { status: 200 }
      )
    }

    return NextResponse.json({ admins: data || [] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', admins: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const storeId = process.env.NEXT_PUBLIC_STORE_ID

    const { name, email, phone, role } = body

    if (!name || !email || !phone || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseServer
      .from('admins')
      .insert([
        {
          store_id: storeId,
          name,
          email,
          phone,
          role,
          status: 'active',
        },
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
