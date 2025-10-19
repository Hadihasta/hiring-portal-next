'use client'
import React from 'react'
import Image from 'next/image'
import Button from '@/components/global/Button'

interface ButtonProps {
  onClick?: () => void
}

const ImageButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <div
      id="image_background_button"
      className="flex justify-center items-center relative w-[300px] h-[168px] rounded-xl overflow-hidden"
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
      <div className="flex flex-col justify-center items-center  relative text-white  ">
        <div> Recruit the best candidates</div>
        <div className='pb-[24px]'>Create jobs, invite, and hire with ease</div>
        <Button
          onClick={onClick}
          color={'green'}
          label="Create a new job"
        />
      </div>
    </div>
  )
}

export default ImageButton
