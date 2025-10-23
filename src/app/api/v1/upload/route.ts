import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Buat Supabase client dengan service key (server-side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image data' }, { status: 400 })
    }

    // Buat nama file unik
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `photo-${timestamp}.png`

    // Konversi base64 ke buffer
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
    const fileBuffer = Buffer.from(base64Data, 'base64')

    // Upload ke Supabase Storage
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(`uploads/${fileName}`, fileBuffer, {
        contentType: 'image/png',
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    // Ambil URL publik
    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(`uploads/${fileName}`)

    return NextResponse.json({
      success: true,
      fileName,
      publicUrl: publicUrlData.publicUrl,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
