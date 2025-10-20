'use client'

import React from 'react'
// import styles from './layout.module.css' // optional, for styling

export default function ManageCandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm p-6">
      <header className="mb-4 border-b pb-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Manage Candidates</h2>
        <p className="text-sm text-gray-500">View and manage job applicants</p>
      </header>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
