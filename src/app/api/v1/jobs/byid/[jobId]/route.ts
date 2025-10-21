import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function safeJson<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { jobId: string } }   // ✅ only this — no union, no Promise
) {
  try {
    const { jobId } = params

    if (!jobId) {
      return NextResponse.json({ message: 'Missing jobId' }, { status: 400 })
    }

    const job = await prisma.jobs.findUnique({
      where: { id: BigInt(jobId) },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        job_configurations: {
          select: {
            id: true,
            field_key: true,
            label: true,
            required: true,
            visible: true,
            order_index: true,
          },
          orderBy: { order_index: 'asc' },
        },
      },
    })

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Job fetched successfully', data: safeJson(job) },
      { status: 200 }
    )
  } catch (error) {
    console.error('GET /jobs/byid/[jobId] error:', error)
    return NextResponse.json(
      { message: 'Internal server error', detail: (error as Error).message },
      { status: 500 }
    )
  }
}
