import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@/generated/client'

const prisma = new PrismaClient()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Incoming body:', body)

    const { imageBase64, candidate_id, gesture_detected } = body

    if (!imageBase64 || !candidate_id) {
      return NextResponse.json(
        { error: 'Missing imageBase64 or candidate_id' },
        { status: 400 }
      )
    }

    // ---- Konversi base64 ke buffer ----
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
    const fileBuffer = Buffer.from(base64Data, 'base64')

    // ---- Buat nama file unik ----
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `photo-${candidate_id}-${timestamp}.png`
    const filePath = `uploads/${fileName}`

    // ---- Upload ke Supabase Storage ----
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, fileBuffer, {
        contentType: 'image/png',
        upsert: false,
      })

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file to Supabase', details: uploadError.message }, { status: 500 })
    }

    console.log('✅ File uploaded to Supabase:', uploadData)

    // ---- Ambil public URL ----
    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath)

    const publicUrl = publicUrlData.publicUrl
    console.log('✅ Public URL:', publicUrl)

    // ---- Simpan ke database ----
    const photoRecord = await prisma.photos.create({
      data: {
        candidate_id: Number(candidate_id),
        photo_url: publicUrl,
        gesture_detected: gesture_detected || null,
      },
    })

    console.log('✅ Photo record created:', photoRecord)

    return NextResponse.json({
      success: true,
      publicUrl,
      photoRecord,
    })
  } catch (err: any) {
    console.error('🔥 Server error:', err)
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
