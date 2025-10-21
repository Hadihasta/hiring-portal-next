import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json()
    if (!imageBase64) {
      return NextResponse.json({ error: 'No image data' }, { status: 400 })
    }

    // Buat nama file unik berdasarkan waktu
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `photo-${timestamp}.png`

    // Path penyimpanan di public/asset/photo/
    const folderPath = path.join(process.cwd(), 'public', 'asset', 'photo')
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
    }

    const filePath = path.join(folderPath, fileName)

    // Hapus prefix base64 dan simpan file
    const base64Data = imageBase64.replace(/^data:image\/png;base64,/, '')
    fs.writeFileSync(filePath, base64Data, 'base64')

    return NextResponse.json({
      success: true,
      path: `/asset/photo/${fileName}`, // ini bisa disimpan ke database/state
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
