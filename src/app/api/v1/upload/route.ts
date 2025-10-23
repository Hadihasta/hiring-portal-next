import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@/generated/client' // sesuai output Prisma kamu

const prisma = new PrismaClient()

// Supabase client (gunakan service role key untuk akses Storage)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, candidate_id, gesture_detected } = await req.json()

    if (!imageBase64 || !candidate_id) {
      return NextResponse.json(
        { error: 'Missing image or candidate_id' },
        { status: 400 }
      )
    }

    // Buat nama file unik
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `photo-${candidate_id}-${timestamp}.png`

    // Konversi base64 → buffer
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
    const fileBuffer = Buffer.from(base64Data, 'base64')

    // Upload ke Supabase Storage
    const { data, error } = await supabase.storage
      .from('photos') // pastikan bucket "photos" sudah dibuat di Supabase
      .upload(`uploads/${fileName}`, fileBuffer, {
        contentType: 'image/png',
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    // Ambil public URL
    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(`uploads/${fileName}`)

    const publicUrl = publicUrlData.publicUrl

    // Simpan ke tabel photos
    const photoRecord = await prisma.photos.create({
      data: {
        // hardcode dulu
        candidate_id: 2,
        photo_url: publicUrl,
        gesture_detected: gesture_detected || null,
      },
    })

    return NextResponse.json({
      success: true,
      fileName,
      publicUrl,
      photoRecord,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
