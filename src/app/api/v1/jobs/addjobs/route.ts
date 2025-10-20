import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface JobConfigurationInput {
  field_key: string
  label: string
  required?: boolean
  visible?: boolean
}

// Helper to safely convert BigInt values to number for JSON response
function serializeBigInt<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? Number(value) : value
    )
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      slug,
      title,
      description,
      candidate_needed,
      job_type,
      salary_min,
      salary_max,
      created_by,
      status,
      configurations,
    } = body

    // console.log('Incoming job payload:', body)

    // Validation
    if (!slug || !title || !created_by) {
      return NextResponse.json(
        { error: 'slug, title, and created_by are required' },
        { status: 400 }
      )
    }

    // Create job entry
    const newJob = await prisma.jobs.create({
      data: {
        slug,
        title,
        description,
        candidate_needed: candidate_needed ?? 0,
        job_type,
        salary_min: salary_min ?? 0,
        salary_max: salary_max ?? 0,
        status: status ?? 'active', // default value, adjust as needed 
        created_by: BigInt(created_by),
      },
    })

    // Insert job configurations if provided
    if (Array.isArray(configurations) && configurations.length > 0) {
      await prisma.job_configurations.createMany({
        data: configurations.map(
          (config: JobConfigurationInput, index: number) => ({
            job_id: newJob.id,
            field_key: config.field_key,
            label: config.label,
            required: config.required ?? false,
            visible: config.visible ?? true,
            order_index: index + 1,
          })
        ),
      })
    }

    // Return formatted response
    return NextResponse.json({
      message: 'Job and configurations created successfully',
      data: {
        job: serializeBigInt(newJob),
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('POST /addjobs error:', error)

    // Prisma unique constraint handler
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          error: `Duplicate value for unique field: ${error.meta?.target?.join(', ')}`,
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    )
  }
}
