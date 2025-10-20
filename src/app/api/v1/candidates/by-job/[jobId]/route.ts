import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = BigInt(params.jobId)

    // ✅ Fetch all candidates related to the given job, with relations
    const candidates = await prisma.candidates.findMany({
      where: { job_id: jobId },
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

    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { message: 'No candidates found for this job' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: 'Candidates fetched successfully',
        data: candidates.map((c) => ({
          id: c.id,
          job_id: c.job_id,
          user: c.user,
          applied_at: c.applied_at,
          status: c.status,
          attributes: c.attributes,
          photos: c.photos,
        })),
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('GET /candidates/by-job/[jobId] error:', error)
    return NextResponse.json(
      {
        message: 'Internal server error',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
