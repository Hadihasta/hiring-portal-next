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

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
    const fileBuffer = Buffer.from(base64Data, 'base64')

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `photo-${candidate_id}-${timestamp}.png`
    const filePath = `uploads/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, fileBuffer, {
        contentType: 'image/png',
        upsert: false,
      })

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file', details: uploadError.message },
        { status: 500 }
      )
    }

    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath)

    const publicUrl = publicUrlData.publicUrl

    const photoRecord = await prisma.photos.create({
      data: {
        candidate_id: Number(candidate_id),
        photo_url: publicUrl,
        gesture_detected: gesture_detected || null,
      },
    })

    // 🩵 FIX: convert semua BigInt jadi string biar aman
    const safePhotoRecord = JSON.parse(
      JSON.stringify(photoRecord, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    )

    return NextResponse.json({
      success: true,
      publicUrl,
      photoRecord: safePhotoRecord,
    })
  } catch (err: any) {
    console.error('🔥 Server error:', err)
    return NextResponse.json(
      { error: 'Internal Server Error', details: err.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
