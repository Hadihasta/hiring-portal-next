'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import PoseDetector from './PoseDetector'
import Helper from '@/components/global/Helper'
import Image from 'next/image'

interface ModalPoseDetectorProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (photo: string) => void
}

const ModalPoseDetector: React.FC<ModalPoseDetectorProps> = ({ isOpen, onClose, onCapture }) => {
  const [showHelper, setShowHelper] = useState(false)
  const [helperProps, setHelperProps] = useState({ action: 'success', message: '' })
  const [poseStep, setPoseStep] = useState(1)

  const handlePhotoCaptured = (dataUrl: string) => {
    // console.log(dataUrl, " <<< masuk component modal")
    onCapture(dataUrl)
    setHelperProps({ action: 'success', message: 'Photo captured successfully!' })
    setShowHelper(true)
    onClose()
  }

  const handleStepProgress = (poseStep: number) => {
    setPoseStep(poseStep)
  }

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
            className="bg-white p-[24px] w-[700px] min-h-[641px] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center  border-greyBorder p-4">
              <div>
                <h2 className="text-xl font-bold">Raise Your Hand to Capture</h2>
                <h2 className="text-sm font-light">{`We'll take the photo once your hand pose is detected`}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-greyNeutral font-bold hover:text-gray-700 text-2xl cursor-pointer"
              >
                X
              </button>
            </div>

            <div className="px-6 pb-6 flex justify-center items-center">
              <PoseDetector onCaptured={handlePhotoCaptured} stepProgress={handleStepProgress}  />
            </div>
            <div className="text-xs">
              To take a picture, follow the hand poses in the order shown below. The system will automatically capture
              the image once the final pose is detected.
            </div>
            <div className="flex justify-center items-center p-8 gap-5">
              <Image
                src="/asset/step/first-step.svg"
                alt="back"
                width={60}
                height={60}
              className={`object-cover border  transition-all duration-300 ${
                  poseStep === 1 ? 'border-greenBorder scale-110' : 'border-greyBorder opacity-60'
                }`}
              />

              <Image
                src="/asset/icon/arrow-right.svg"
                alt="arrow"
                height={20}
                width={20}
                className="w-10 h-10 object-contain"
              />

              <Image
                src="/asset/step/second-step.svg"
                alt="back"
                width={60}
                height={60}
            className={`object-cover border  transition-all duration-300 ${
                  poseStep === 2 ? 'border-greenBorder scale-110' : 'border-greyBorder opacity-60'
                }`}
              />

              <Image
                src="/asset/icon/arrow-right.svg"
                alt="arrow"
                height={20}
                width={20}
                className="w-10 h-10 object-contain"
              />
              <Image
                src="/asset/step/third-step.svg"
                alt="back"
                width={60}
                height={60}
              className={`object-cover border  transition-all duration-300 ${
                  poseStep === 3 ? 'border-greenBorder scale-110' : 'border-greyBorder opacity-60'
                }`}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {showHelper && (
        <Helper
          action={helperProps.action as 'success' | 'error'}
          message={helperProps.message}
          onClose={() => setShowHelper(false)}
        />
      )}
    </AnimatePresence>
  )
}

export default ModalPoseDetector
