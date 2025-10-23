import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Convert BigInt ke string supaya aman di JSON
 */
function safeJson<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )
}

/**
 * POST /api/v1/candidates/create
 * Body: { userId, jobId }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📥 Incoming body:', body)

    const { userId, jobId } = body

    // ✅ Validasi input
    if (!userId || !jobId) {
      return NextResponse.json(
        { message: 'Missing userId or jobId' },
        { status: 400 }
      )
    }

    const userIdBig = BigInt(userId)
    const jobIdBig = BigInt(jobId)

    // ✅ Cek apakah user + job sudah pernah apply
    const existingCandidate = await prisma.candidates.findFirst({
      where: {
        user_id: userIdBig,
        job_id: jobIdBig,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true } },
      },
    })

    // ✅ Jika sudah ada, return data lama
    if (existingCandidate) {
      console.log(`⚠️ Candidate already exists for user ${userId} and job ${jobId}`)
      return NextResponse.json(
        {
          message: 'Existing candidate found for this user and job',
          data: safeJson(existingCandidate),
        },
        { status: 200 }
      )
    }

    // ✅ Jika belum ada, buat baru
    const newCandidate = await prisma.candidates.create({
      data: {
        user_id: userIdBig,
        job_id: jobIdBig,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true } },
      },
    })

    console.log(`✅ New candidate created for user ${userId} on job ${jobId}`)

    return NextResponse.json(
      {
        message: 'Candidate created successfully',
        data: safeJson(newCandidate),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ POST /api/v1/candidates/create error:', error)
    return NextResponse.json(
      {
        message: 'Internal server error',
        detail: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
