'use client'
import React from 'react'
import { motion } from 'motion/react'
import { AnimatePresence } from 'motion/react'

// isopen untuk menampilkan modal true akan muncul modalnya, false tidak muncul
// onclose untuk menutup modal, biasanya diisi dengan fungsi yang mengubah isopen menjadi false
interface ModalJobOpeningFormProps {
  isOpen: boolean
  onClose: () => void
}

const ModalJobOpeningForm: React.FC<ModalJobOpeningFormProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            id='jobOpeningForm'
            className="bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg "
          >
            {/* Header */}
            <div id='Head_form' className="flex justify-between items-center border-b border-greyBorder ">
              <h2 className="text-xl font-bold">Job Opening</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <div className=" p-[16px] space-y-4">
              {/* Job Name */}
              <div>
                <label className="flex text-sm font-medium mb-1">Job Name</label>
                <input
                  type="text"
                  placeholder="Ex: Front End Engineer"
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#01959f]"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium mb-1">Job Type</label>
                <select className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#01959f]">
                  <option value="">Select job type</option>
                  <option value="fulltime">Full-time</option>
                  <option value="parttime">Part-time</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Job Description</label>
                <textarea
                  placeholder="Ex..."
                  className="w-full border rounded-md p-2 h-24 focus:outline-none focus:ring-2 focus:ring-[#01959f]"
                ></textarea>
              </div>

              {/* Number of Candidate */}
              <div>
                <label className="block text-sm font-medium mb-1">Number of Candidate Needed</label>
                <input
                  type="number"
                  placeholder="Ex: 2"
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#01959f]"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium mb-1">Job Salary</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Rp 7.000.000"
                    className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#01959f]"
                  />
                  <input
                    type="text"
                    placeholder="Rp 10.000.000"
                    className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#01959f]"
                  />
                </div>
              </div>

              {/* Candidate Info List */}
              <div className="border rounded-lg p-4 mt-6">
                <h3 className="font-medium mb-3 text-sm">Minimum Profile Information Required</h3>

                <div className="divide-y text-sm">
                  {[
                    'Full name',
                    'Photo Profile',
                    'Gender',
                    'Domicile',
                    'Email',
                    'Phone number',
                    'LinkedIn Link',
                    'Date of Birth',
                  ].map((label) => (
                    <div
                      key={label}
                      className="flex justify-between items-center py-2"
                    >
                      <span>{label}</span>
                      <div className="flex items-center gap-3">
                        <button className="text-xs bg-[#01959f]/10 text-[#01959f] px-3 py-1 rounded-md">
                          Mandatory
                        </button>
                        <button className="text-xs text-gray-500 hover:text-[#01959f]">Optional</button>
                        <label className="flex items-center gap-1 text-xs text-gray-600">
                          <span>Off</span>
                          <input
                            type="checkbox"
                            className="accent-[#01959f]"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-[#01959f] hover:bg-[#017a84] text-white px-5 py-2 rounded-md"
                >
                  Publish Job
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ModalJobOpeningForm
