import React from 'react'
import Image from 'next/image'

interface NavbarProps {
  src?: string
}

const NavbarProgress = ({ src }: NavbarProps) => {
  return (
    <div className="flex justify-between items-center h-[6vh] w-full border border-greyBorder bg-white px-4">
      <div className="flex items-center">
        <div className='border border-greyBorder py-[4px] px-[16px] rounded-lg font-bold'>Job list</div>
        <Image
          src="/asset/icon/arrow-right.svg"
          alt="arrow"
          height={20}
          width={20}
          className="w-5 h-5 object-contain"
        />

        <div className='border border-greyBorder py-[4px] px-[16px] rounded-lg bg-greyOutline font-bold'> Manage Candidate</div>
      </div>
      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
        <Image
          src={src ? src : '/asset/global/TemplateAdmin.jpg'}
          alt="profile-placeholder"
          width={32}
          height={32}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  )
}

export default NavbarProgress
