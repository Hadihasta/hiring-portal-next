import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function formatCurrencyIDR(value: number): string {
  return value.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  })
}

export async function GET() {
  try {
    const jobs = await prisma.jobs.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        status: true,
        salary_min: true,
        salary_max: true,
        currency: true,
        created_at: true,
      },
    })

    const formatted = jobs.map((job) => {
      const min = Number(job.salary_min ?? 0)
      const max = Number(job.salary_max ?? 0)
      const displayText =
        min && max
          ? `${formatCurrencyIDR(min)} - ${formatCurrencyIDR(max)}`
          : '-'

      const createdAt = job.created_at ?? new Date()
      const safeStatus = job.status ?? 'draft'
      const formattedStatus =
        safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)

      return {
        id: `job_${createdAt.getFullYear()}${String(
          createdAt.getMonth() + 1
        ).padStart(2, '0')}${String(createdAt.getDate()).padStart(
          2,
          '0'
        )}_${String(job.id).padStart(4, '0')}`,
        slug: job.slug,
        title: job.title,
        description: job.description, // ✅ include description
        status: safeStatus,
        salary_range: {
          min,
          max,
          currency: job.currency ?? 'IDR',
          display_text: displayText,
        },
        list_card: {
          badge: formattedStatus,
          started_on_text: `started on ${createdAt.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}`,
          cta: 'Manage Job',
        },
      }
    })

    return NextResponse.json({ data: formatted }, { status: 200 })
  } catch (error: unknown) {
    console.error('GET /getalljobs error:', error)
    return NextResponse.json(
      { error: 'Internal server error', detail: (error as Error).message },
      { status: 500 }
    )
  }
}
