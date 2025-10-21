'use client'
import React  from 'react'
import Button from '@/components/global/Button'
import { getJobNumber } from '@/lib/getJobNumber'

import { useRouter } from 'next/navigation'


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
  active: 'bg-successBg text-successText border border-successBorder',
  inactive: 'bg-dangerBg text-dangerText border border-dangerBorder',
  draft: 'bg-warningBg text-warningText border border-warningBorder',
}

const ListJobs: React.FC<ListJobsProps> = ({ data }) => {


  const router = useRouter()

   const handleViewCandidates = (id: string) => {
    const jobNumber = getJobNumber(id)
    router.push(`/table-candidate/${jobNumber}`)
  }
  if (!data || data.length === 0) {
    return 
    // <div className="flex flex-col justify-center items-center py-12 text-gray-500">No job openings found.</div>
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((job,index) => (
        <div
          key={index}
          className="w-full bg-white p-[24px] rounded-2xl shadow-sm  flex justify-between items-end border border-gray-100"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-[16px] py-[4px] text-xs font-medium rounded-lg ${
                  statusBadgeColor[job.status.toLowerCase()] ?? ''
                }`}
              >
                {job.list_card.badge}
              </span>
              <span className="text-xs text-greyNeutral border border-greyBorder px-[16px] py-[4px] rounded-sm ">
                {job.list_card.started_on_text}
              </span>
            </div>

            <h3 className="text-lg font-bold">{job.title}</h3>
            <p className="text-greyText  text-base ">{job.salary_range.display_text}</p>
          </div>

         <Button
            color="green"
            label={job.list_card.cta}
            className="text-white text-xs rounded-lg"
            onClick={() => handleViewCandidates(job.id)}
          />
        </div>
      ))}
    </div>
  )
}

export default ListJobs
