'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Button from '@/components/global/Button'
import ImageButton from '@/components/admin/jobs/dashboard/ImageButton'
import ModalJobOpeningForm from '@/components/admin/jobs/dashboard/ModalJobOpeningForm'
import ListJobs from '@/components/admin/jobs/dashboard/ListJobs'
import { getJob } from '@/services/jobsService'
const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [listJobs, setListJobs] = useState([])

  const fetchFirstData = async () => {
    try {
      const res = await getJob()
      console.log(res)
      setListJobs(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchFirstData()
  }, [])

  const handleClick = () => {
    setIsModalOpen(true)
    console.log('open modal')
  }

  return (
    <div className="flex m-(--paddingMainPage)  p-[16px] gap-[24px] h-[calc(94vh-32px)] pr-[16px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-greenPrimary scrollbar-track-greyTrack overflow-y-scroll">
      {/* search bar & order list */}
      <div
        id="jobs"
        className="grow flex flex-col  h-full "
      >
        <div
          id="searchJob_input"
          className="relative w-full mb-6 "
        >
          <input
            type="text"
            className="input-field w-full pr-10"
            placeholder="Search by job details"
          />
          <Image
            src="/asset/icon/SearchIcon.svg"
            alt="Search Icon"
            width={20}
            height={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          />
        </div>

        {/* list condition ListJob > 0 / list job ada lebih dari 0 tampilkan di list */}
        <ListJobs data={listJobs} />

        {/* empty jobs list Condition */}
        {/* <div className="flex flex-col flex-grow justify-center items-center text-center gap-3">
          <div className="relative w-[320px] h-[320px]">
            <Image
              src="/asset/vektor/SearchJob.svg"
              alt="Search Job"
              fill
              className="object-contain"
            />
          </div>

          <p className="text-xl font-bold">No job openings available</p>
          <div className="text-greyNeutral text-base">Create a job now and start the candidate process</div>
          <Button
            onClick={handleClick}
            color={'yellow'}
            label="Create a new job"
          />
        </div> */}
      </div>

      {/* image with overlay */}
      <ImageButton onClick={handleClick} />

      <ModalJobOpeningForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Page
