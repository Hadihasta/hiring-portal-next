'use client'

import React, { useState } from 'react'
import Image from 'next/image'

const ApplyJobPage = () => {
  const [photo, setPhoto] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPhoto(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow p-8">
        {/* HEADER */}
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Apply Front End at Rakamin
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            <span className="text-red-500">*</span> Required field
          </p>
        </div>

        {/* PHOTO UPLOAD */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border border-gray-300">
            {photo ? (
              <Image src={photo} alt="Profile" fill className="object-cover" />
            ) : (
              <Image
                src="/asset/global/default-avatar.png"
                alt="Default Avatar"
                fill
                className="object-cover"
              />
            )}
          </div>
          <label className="mt-3 cursor-pointer bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm">
            📸 Take a Picture
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* FORM */}
        <form className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="female" /> Female
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="male" /> Male
              </label>
            </div>
          </div>

          {/* Domicile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domicile
            </label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="">Choose your domicile</option>
              <option value="jakarta">Jakarta</option>
              <option value="bandung">Bandung</option>
              <option value="surabaya">Surabaya</option>
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <span className="flex items-center border border-gray-300 rounded-md px-3 bg-gray-100">
                +62
              </span>
              <input
                type="tel"
                placeholder="81234567890"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-md transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default ApplyJobPage
