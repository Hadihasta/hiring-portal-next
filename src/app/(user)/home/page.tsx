'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { getJob } from '@/services/jobsService'

export interface JobItem {
  id: string
  slug: string
  title: string
  description: string
  status: string
  salary_range: {
    min: number
    max: number
    currency: string
    display_text: string
  }
  list_card: {
    badge: string
    started_on_text: string
    cta: string
  }
}

const Page = () => {
  const [listJobs, setListJobs] = useState<JobItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null)

  const fetchFirstData = async () => {
    try {
      const res = await getJob()
      setListJobs(res)
      if (res.length > 0) setSelectedJob(res[0]) // auto select first job
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFirstData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[94vh]">
        <p className="text-gray-500">Loading jobs...</p>
      </div>
    )
  }


   const handleApplyButton = (job: JobItem) => {
    console.log('Selected Job:', job)
    // you can redirect or open a modal later
    // example: router.push(`/apply/${job.id}`)
  }
  //  Empty state — when no jobs are available
  if (listJobs.length === 0) {
    return (
      <div className="flex flex-col flex-grow justify-center items-center text-center gap-3 h-[94vh]">
        <div className="relative w-[320px] h-[320px]">
          <Image
            src="/asset/vektor/SearchJob.svg"
            alt="Search Job"
            fill
            className="object-contain"
          />
        </div>

        <p className="text-xl font-bold">No job openings available</p>
        <div className="text-greyNeutral text-base">
          Please wait for the next batch of openings
        </div>
      </div>
    )
  }

  //  Show job list & detail only if we have jobs
  return (
    <div className="px-[104px] py-[40px] h-[94vh]">
      <div className="flex gap-6 h-full">
        {/* LEFT SIDE — List of Jobs */}
        <div
          id="jobsDisplay"
          className="w-[384px] flex flex-col gap-4 overflow-y-auto pr-2"
        >
          {listJobs.map((job,index) => (
            <div
              key={index}
              onClick={() => setSelectedJob(job)}
              className={`p-4 rounded-lg shadow-sm border-2 cursor-pointer transition ${
                selectedJob?.id === job.id
                  ? 'bg-greenSurface border-greenBorder'
                  : 'bg-white border-greyBorder hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Logo */}
                <div className="w-10 h-10 relative flex-shrink-0">
                  <Image
                    src="/asset/global/Logo.svg"
                    alt="Company logo"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-[16px] font-semibold text-gray-800">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600">Rakamin</p>
                  <p className="text-sm text-gray-700 font-medium">
                    {job.salary_range.display_text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE — Job Detail */}
        {selectedJob && (
          <div
            id="jobsDescription"
            className="flex-1 bg-white border border-greyBorder rounded-lg shadow-sm p-8 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4 border-b border-greyBorder pb-4">
              <div className="flex items-start gap-3">
                <div className="w-15 h-15 relative rounded-lg">
                  <Image
                    src="/asset/global/Logo.svg"
                    alt="Company logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="bg-successText text-white px-4 py-1 text-xs font-medium rounded-sm w-fit">
                    {selectedJob.list_card.badge}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedJob.title}
                  </h2>
                  <p className="text-sm text-gray-600">Rakamin</p>
                </div>
              </div>

              <button onClick={() => handleApplyButton(selectedJob)} className="bg-yellowBg hover:bg-yellowHover font-bold px-5 py-2 rounded-lg text-sm transition">
                Apply
              </button>
            </div>

            {/* Job Description */}
            <div className="text-gray-700 text-sm leading-relaxed space-y-3">
              <p className="whitespace-pre-line">{selectedJob.description}</p>
             
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
