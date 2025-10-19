import React from 'react'
import Image from 'next/image'


// navbar props interface
interface NavbarProps {
  label: string
  src?: string
}

// gunakan label untuk judul navbar
// gunakan src untuk gambar profil, jika tidak ada gunakan gambar default
const Navbar = ({ label, src }: NavbarProps) => {
  return (
    <div className="flex justify-between items-center h-[6vh] w-full border border-greyBorder bg-white px-4">
      <div className="font-bold text-xl">{label}</div>

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

export default Navbar
