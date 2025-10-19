'use client'
import React from 'react'
import { motion } from "motion/react"
import { AnimatePresence } from 'motion/react'


// isOpen: boolean to control modal visibility
// onClose: function to handle modal close action
interface ModalJobOpeningFormProps {
  isOpen: boolean
  onClose: () => void
}

const ModalJobOpeningForm: React.FC<ModalJobOpeningFormProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Modal box */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="bg-white w-[600px] rounded-lg shadow-lg p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg font-semibold">Job Opening</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            {/* Form content (placeholder) */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Job Title"
                className="w-full border rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Job Department"
                className="w-full border rounded-md p-2"
              />
              <textarea
                placeholder="Job Description"
                className="w-full border rounded-md p-2 h-24"
              ></textarea>

              <button className="bg-[#01959f] hover:bg-[#017a84] text-white px-4 py-2 rounded-md">
                Publish Job
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ModalJobOpeningForm
