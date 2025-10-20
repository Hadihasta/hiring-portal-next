'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'

interface CandidateAttribute {
  key: string
  label: string
  value: string
}

interface CandidateUser {
  id: string
  name: string
  email: string
}

interface Candidate {
  id: string
  status?: string
  user: CandidateUser
  attributes: CandidateAttribute[]
}

export default function ManageCandidatePage() {
  const { jobId } = useParams()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!jobId) return
    const fetchCandidates = async () => {
      try {
        const res = await axios.get<{ data: Candidate[] }>(
          `/api/v1/candidates/by-job/${jobId}`
        )
        setCandidates(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCandidates()
  }, [jobId])

  if (loading) return <p>Loading candidates...</p>

  if (!candidates.length)
    return <p className="text-gray-500">No candidates found for this job.</p>

  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <div
          key={candidate.id}
          className="p-4 border rounded-lg shadow-sm hover:bg-gray-50"
        >
          <h3 className="font-semibold text-lg">{candidate.user.name}</h3>
          <p className="text-sm text-gray-600">{candidate.user.email}</p>
          <p className="text-sm text-gray-600">
            Status: {candidate.status || 'submitted'}
          </p>
          <ul className="mt-2 text-sm text-gray-700">
            {candidate.attributes.map((attr) => (
              <li key={attr.key}>
                {attr.label}: <b>{attr.value}</b>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
