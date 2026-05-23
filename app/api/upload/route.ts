import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada file yang diupload' },
        { status: 400 }
      )
    }

    // Validate file count (max 10 files per upload)
    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maksimal 10 file per upload' },
        { status: 400 }
      )
    }

    const urls: string[] = []
    const errors: string[] = []

    for (const file of files) {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name}: Bukan file gambar`)
          continue
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
          errors.push(`${file.name}: File terlalu besar (max 5MB)`)
          continue
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const ext = file.name.split('.').pop() || 'jpg'
        const filename = `products/${timestamp}-${randomStr}.${ext}`

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabaseServer.storage
          .from('products')
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
          })

        if (uploadError) {
          errors.push(`${file.name}: ${uploadError.message}`)
          continue
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseServer.storage
          .from('products')
          .getPublicUrl(filename)

        urls.push(publicUrl)
      } catch (err) {
        errors.push(`${file.name}: ${(err as Error).message}`)
      }
    }

    // If no files uploaded successfully
    if (urls.length === 0) {
      return NextResponse.json(
        { error: errors.join(', ') || 'Gagal upload semua file' },
        { status: 400 }
      )
    }

    // Return success with warnings if some files failed
    return NextResponse.json({
      urls,
      warnings: errors.length > 0 ? errors : undefined,
      message: `${urls.length} file berhasil diupload${errors.length > 0 ? `, ${errors.length} gagal` : ''}`,
    })
  } catch (error) {
    console.error('POST /api/upload error:', error)
    return NextResponse.json(
      { error: 'Gagal upload file: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
