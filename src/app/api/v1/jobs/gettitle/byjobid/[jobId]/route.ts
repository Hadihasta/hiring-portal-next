import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serializeBigInt } from '@/lib/serializeBigInt'

// GET /api/v1/jobs/gettitle/byjobid/[jobId]
export async function GET(
  req: NextRequest,
  context: { params: { jobId: string } } | { params: Promise<{ jobId: string }> }
) {
  try {
   const params = await Promise.resolve(context.params)
    const jobId = BigInt(params.jobId)

    const job = await prisma.jobs.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        title: true,
        status: true,
        created_at: true,
        candidate_needed: true,
      },
    })

    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      )
    }

    //  Convert semua BigInt → string agar bisa di-serialize ke JSON
    const safeJob = serializeBigInt(job)

    return NextResponse.json({ data: safeJob })
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { message: 'Failed to fetch job data' },
      { status: 500 }
    )
  }
}
