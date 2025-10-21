import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Helper untuk konversi BigInt → Number
 */
function serializeBigInt<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? Number(value) : value
    )
  )
}

/**
 * GET /api/v1/candidates/by-job/[jobId]
 * Mengambil semua kandidat berdasarkan jobId
 */

export async function GET(request: NextRequest, context: { params: { jobId: string } }) {
  try {
    
     const { jobId } = context.params

    if (!jobId) {
      return NextResponse.json({ message: 'Missing jobId' }, { status: 400 })
    }

    const jobIdBigInt = BigInt(jobId)

    // 🔹 Ambil semua kandidat berdasarkan jobId
    const candidates = await prisma.candidates.findMany({
      where: { job_id: jobIdBigInt },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
          },
        },
        attributes: {
          select: {
            key: true,
            label: true,
            value: true,
            order_index: true,
          },
        },
        photos: {
          select: {
            id: true,
            photo_url: true,
            gesture_detected: true,
            captured_at: true,
          },
        },
      },
      orderBy: {
        applied_at: 'desc',
      },
    })

    // 🔹 Jika tidak ada kandidat
    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { message: 'No candidates found for this job' },
        { status: 404 }
      )
    }

    // 🔹 Convert BigInt → Number sebelum dikirim
    const serialized = serializeBigInt(candidates)

    return NextResponse.json(
      {
        message: 'Candidates fetched successfully',
        data: serialized,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('❌ GET /candidates/by-job/[jobId] error:', error)

    return NextResponse.json(
      {
        message: 'Internal server error',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
