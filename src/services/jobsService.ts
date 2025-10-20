import axios from "../lib/axios";

interface CreateJob {
 slug: string;
  title: string;
  description: string;
  candidate_needed: number;
  job_type: string;
  salary_min?: number | null;
  salary_max?: number | null;
  created_by : number,
  configurations: Configuration[];
}

export interface Configuration {
  field_key: string;
  label: string;
  required: boolean;
  visible: boolean;
}

export async function createJob(payload: CreateJob) {
  try {
    const res = await axios.post('/jobs/addjobs', payload)
    return res.data
  } catch (err) {
    console.error('Failed Create Job:', err)
    throw err
  }
}
