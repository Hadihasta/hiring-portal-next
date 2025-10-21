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


export interface JobItem {
  id: string
  slug: string
  title: string
  description: string       
  status: string
  salary_range: {
    min: number
    max: number
    currency: string
    display_text: string
  }
  list_card: {
    badge: string
    started_on_text: string
    cta: string
  }
}
export async function getJob(): Promise<JobItem[]> {
  try {
    const res = await axios.get('/jobs/getalljobs')
    return res.data.data
  } catch (err) {
    console.error('Failed Create Job:', err)
    throw err
  }
}
