'use client'
import React from 'react'
import Button from '@/components/global/Button'

interface SalaryRange {
  min: number
  max: number
  currency: string
  display_text: string
}

interface ListCard {
  badge: string
  started_on_text: string
  cta: string
}

export interface JobItem {
  id: string
  slug: string
  title: string
  status: string
  salary_range: SalaryRange
  list_card: ListCard
}

interface ListJobsProps {
  data: JobItem[]
}

const statusBadgeColor: Record<string, string> = {
  active: 'bg-green-100 text-green-700 border border-green-300',
  inactive: 'bg-red-100 text-red-700 border border-red-300',
  draft: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
}

const ListJobs: React.FC<ListJobsProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-12 text-gray-500">
        No job openings found.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((job) => (
        <div
          key={job.id}
          className="w-full bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center border border-gray-100"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-[2px] text-xs font-medium rounded-full ${statusBadgeColor[job.status.toLowerCase()] ?? ''}`}
              >
                {job.list_card.badge}
              </span>
              <span className="text-xs text-gray-400">{job.list_card.started_on_text}</span>
            </div>

            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-gray-600 text-sm">{job.salary_range.display_text}</p>
          </div>

          <Button
            color="green"
            label={job.list_card.cta}
            onClick={() => console.log('Manage job clicked', job.id)}
          />
        </div>
      ))}
    </div>
  )
}

export default ListJobs
