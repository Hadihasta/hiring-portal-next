'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface HelperProps {
  action: 'success' | 'error'
  message: string
  duration?: number // waktu tampil dalam ms, default 3000
  onClose?: () => void
}

const Helper: React.FC<HelperProps> = ({
  action,
  message,
  duration = 3000,
  onClose
}) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-6 z-[9999]"
        >
          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-md shadow-md text-sm font-medium border ${
              action === 'success'
                ? 'bg-green-50 text-green-700 border-green-400'
                : 'bg-red-50 text-red-700 border-red-400'
            }`}
          >
            <span className="text-lg">{action === 'success' ? '✅' : '❌'}</span>
            <span>{message}</span>
            <button
              onClick={() => setVisible(false)}
              className="ml-2 text-gray-400 hover:text-gray-600 transition text-sm"
            >
              ✖
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Helper
