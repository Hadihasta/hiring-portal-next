import React from 'react'
import Image from 'next/image'

const Page = () => {
  return (
    <div className="flex m-(--paddingMainPage) gap-[24px] h-[calc(94vh-32px)] px-[16px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-greenPrimary scrollbar-track-greyTrack overflow-y-scroll">
 
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

        {/* empty jobs list Condition */}
        <div className="flex flex-col flex-grow justify-center items-center text-center gap-3">
          <div className="relative w-[320px] h-[320px]">
            <Image
              src="/asset/vektor/SearchJob.svg"
              alt="Search Job"
              fill
              className="object-contain"
            />
          </div>

          <p className="text-lg font-semibold">No job openings available</p>
          <div className="text-gray-500 text-sm">Create a job now and start the candidate process</div>
          <button className="bg-greenPrimary hover:bg-green-600 text-white px-4 py-2 rounded-md mt-3">
            Create a new job
          </button>
        </div>

      
      </div>

      {/* image with overlay */}
      <div
        id="image_background_button"
        className="flex-none relative w-[300px] h-[168px] rounded-xl overflow-hidden"
      >
        {/* background image */}
        <div>
          <Image
            src="/asset/global/background-mask.jpg"
            alt="Illustration Dashboard"
            fill
            className="object-cover"
          />
          {/* black overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative"> recruite the best candidate </div>
      </div>

  
    </div>
  )
}

export default Page
