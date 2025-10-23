import axios from '../lib/axios'

export interface CreateCandidatePayload {
  jobId: string | number
  fields: Record<string, { value?: string | number | boolean | null }>
  configs: { field_key: string; label?: string; order_index?: number }[]
}

export async function createCandidate(payload: CreateCandidatePayload) {
  try {
    const res = await axios.post('/candidates/create-candidate-by-jobid', payload)
    return res.data
  } catch (err) {
    console.error('Failed to create candidate:', err)
    throw err
  }
}

export interface CreateCandidateByUserId {
  userId: string | number
  jobId: string | number
}

export async function createCandidateByJobId(payload: CreateCandidateByUserId) {
  try {
    const res = await axios.post('/candidates/create-candidate/by-userid', payload)
    return res.data
  } catch (error) {
    console.log('error create candidate by user id', error)
  }
}
