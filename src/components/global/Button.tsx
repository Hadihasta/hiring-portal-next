'use client'
import React from 'react'

interface ButtonProps {
  label?: string
  color?: 'green' | 'yellow'
  onClick?: () => void
  className?: string
}

// A reusable Button component with customizable label, color, and click handler
// label untuk teks pada tombol
// color untuk menentukan warna tombol, bisa 'green' atau 'yellow'
// className untuk menambahkan kelas CSS tambahan sesuai kebutuhan
// onclick untuk menangani event klik fungsi yang dipanggil saat tombol diklik

const Button: React.FC<ButtonProps> = ({
  label ,
  color = 'green', 
  onClick,
  className,
}) => {
  const defaultStyle = 'font-bold p-[var(--paddingButton)] rounded-lg transition-colors duration-200 cursor-pointer '

  const colorStyle =
    color === 'yellow' ? 'bg-yellowBg rounded-lg hover:bg-yellowHover ' : 'bg-greenPrimary hover:bg-greenHover '

  return (
    <button
      onClick={onClick}
      className={`${defaultStyle} ${colorStyle} ${className}`}
    >
      {label}
    </button>
  )
}

export default Button
