'use client'

import React, { useEffect, useReducer, useState, ChangeEvent } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import ModalPoseDetector from '@/components/camera/ModalPoseDetector'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { createCandidate , createCandidateByJobId } from '@/services/candidateService'

async function fetchJobById(id: string) {
  const res = await axios.get(`/jobs/byid/${id}`)
  return res.data.data
}

interface JobConfiguration {
  id: string
  field_key: string
  label: string
  required: boolean
  visible: boolean
  order_index: number
}

interface JobData {
  id: string
  title: string
  job_configurations: JobConfiguration[]
}

interface FieldState {
  value: string
  error: boolean
}

interface State {
  jobId: string | null
  fields: Record<string, FieldState>
  configs: JobConfiguration[]
  submitting: boolean
}

type Action =
  | { type: 'setJobId'; jobId: string }
  | { type: 'setConfigs'; configs: JobConfiguration[] }
  | { type: 'setField'; key: string; value: string }
  | { type: 'setError'; key: string; error: boolean }
  | { type: 'setSubmitting'; value: boolean }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setJobId':
      return { ...state, jobId: action.jobId }

    case 'setConfigs':
      const initialFields: Record<string, FieldState> = {}
      action.configs.forEach((c) => {
        if (c.visible) {
          initialFields[c.field_key] = { value: '', error: false }
        }
      })
      return { ...state, configs: action.configs, fields: initialFields }
    case 'setField':
      return {
        ...state,
        fields: { ...state.fields, [action.key]: { ...state.fields[action.key], value: action.value } },
      }
    case 'setError':
      return {
        ...state,
        fields: { ...state.fields, [action.key]: { ...state.fields[action.key], error: action.error } },
      }
    case 'setSubmitting':
      return { ...state, submitting: action.value }
    default:
      return state
  }
}
// fecth create candidate by job id dan user id , 
//  karena belum ada session hardcode dulu user id dengan 2 ===> itu user id user pada production database
const ApplyJobPage = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [state, dispatch] = useReducer(reducer, {
    jobId: jobId,
    fields: {},
    configs: [],
    submitting: false,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {



    if (!jobId) return
    // create candidate ketika pertama kali load 
    createCandidateByUserId()
    // dapatkan job info dari job id
    fetchJobById(jobId).then((job: JobData) => {
      dispatch({ type: 'setConfigs', configs: job.job_configurations })
    })
  }, [jobId])



  const createCandidateByUserId = async() => {
    try {

      const payload = {
        jobId : jobId,
        userId : 2
      }
      console.log(payload , " <<<< here job cahgned")

      const res = await createCandidateByJobId(payload)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCapture = async (dataUrl: string) => {
    try {
      const res = await axios.post('/upload', { imageBase64: dataUrl })
      const imagePath = res.data.publicUrl

      setPhoto(imagePath)
      dispatch({
        type: 'setField',
        key: 'photo_profile',
        value: imagePath,
      })
      // console.log('Foto berhasil diupload:', imagePath)
    } catch (err) {
      console.error('Upload gagal:', err)
      alert('Upload foto gagal.')
    }
  }

  const handleChange = (key: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    dispatch({ type: 'setField', key, value: e.target.value })
    dispatch({ type: 'setError', key, error: false })
  }

  const handleButtonBack = () => router.push(`/home`)

  const validateAndSubmit = async () => {
    let hasError = false

    // 🔍 Validasi semua field yang required & visible
    state.configs.forEach((cfg) => {
      if (cfg.required && cfg.visible) {
        const field = state.fields[cfg.field_key]
        if (!field?.value || String(field.value).trim() === '') {
          dispatch({ type: 'setError', key: cfg.field_key, error: true })
          hasError = true
        } else {
          dispatch({ type: 'setError', key: cfg.field_key, error: false })
        }
      }
    })

    if (hasError) return //  hentikan jika masih ada error

    try {
      dispatch({ type: 'setSubmitting', value: true })

      //  Buat payload untuk dikirim ke backend
      const payload = {
        jobId: Number(state.jobId ?? 0),
        fields: state.fields,
        configs: state.configs,
      }


      // butuh pembaruan harus create candidate dulu baru bisa uploud foto karena table candidate kosong
      //  Kirim ke service 
      const response = await createCandidate(payload)
      router.push(`/apply-job-form/succesfully-apply`)

      // console.log(" Submitted data:", response)
    } catch (err) {
      console.error(' Gagal submit kandidat:', err)
    } finally {
      dispatch({ type: 'setSubmitting', value: false })
    }
  }

  return (
    <div className="min-h-screen bg-pureWhite flex justify-center py-10 px-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow p-8">
        {/* Header */}
        <div className="flex flex-row items-center pb-4 mb-6 gap-4">
          <button
            onClick={handleButtonBack}
            className="cursor-pointer border-greyBorder border-2 rounded-lg hover:shadow-md p-2"
          >
            <Image
              src="/asset/icon/icon-back.svg"
              alt="back"
              width={20}
              height={20}
              className="object-cover"
            />
          </button>
          <h1 className="text-lg font-bold text-blackText grow">Apply Front End at Rakamin</h1>
          <p className="text-sm text-greyNeutral mt-1">This field required to fill</p>
        </div>

        <form className="space-y-5">
          {/* PHOTO UPLOAD SECTION */}
          <span className="text-redDanger text-sm font-bold">*Required</span>
          <div className="flex flex-col items-start my-8">
            <div className="text-xs font-bold">Photo Profile</div>
            <div className="relative w-28 h-28 my-4">
              {photo ? (
                <Image
                  src={photo}
                  alt="Captured Photo"
                  fill
                  className="object-cover rounded-md"
                />
              ) : (
                <Image
                  src="/asset/global/avatar-placeholder.svg"
                  alt="Default Avatar"
                  fill
                  className="object-cover rounded-md"
                />
              )}
            </div>
            <label
              className="flex items-center cursor-pointer border-greyBorder border-2 text-blackText 
                       px-4 py-2 rounded-lg hover:bg-gray-200 text-sm gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <Image
                src="/asset/icon/download-icon.svg"
                alt="Camera Icon"
                width={20}
                height={20}
                className="object-cover"
              />
              <div className="text-sm font-bold">Take a Picture</div>
            </label>
          </div>

          {/* DYNAMIC FIELDS */}
          {state.configs
            .filter((cfg) => cfg.visible && cfg.field_key !== 'photo_profile')
            .sort((a, b) => a.order_index - b.order_index)
            .map((cfg) => {
              const field = state.fields[cfg.field_key]
              if (!field) return null

              switch (cfg.field_key) {
                case 'gender':
                  return (
                    <div key={cfg.id}>
                      <label className="block text-sm font-medium mb-1">
                        {cfg.label} {cfg.required && <span className="text-redDanger">*</span>}
                      </label>
                      <select
                        value={field.value}
                        onChange={handleChange(cfg.field_key)}
                        className={`w-full border rounded-md px-3 py-2 ${
                          field.error ? 'border-redDanger' : 'border-greyBorder'
                        }`}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {field.error && <p className="text-xs text-redDanger">This field is required</p>}
                    </div>
                  )

                case 'date_of_birth':
                  return (
                    <div key={cfg.id}>
                      <label className="block text-sm font-medium mb-1">
                        {cfg.label} {cfg.required && <span className="text-redDanger">*</span>}
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={`w-full border border-greyBorder rounded-md px-3 py-2 text-left ${
                              field.value ? 'text-blackText' : 'text-gray-400'
                            } ${field.error ? 'border-redDanger' : ''}`}
                          >
                            {field.value
                              ? new Date(field.value).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'Select date'}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              dispatch({
                                type: 'setField',
                                key: cfg.field_key,
                                value: date ? date.toISOString() : '',
                              })
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {field.error && <p className="text-xs text-redDanger">This field is required</p>}
                    </div>
                  )

                case 'phone_number':
                  return (
                    <div key={cfg.id}>
                      <label className="block text-sm font-medium mb-1">
                        {cfg.label} {cfg.required && <span className="text-redDanger">*</span>}
                      </label>
                      <input
                        type="number"
                        placeholder="Enter phone number"
                        value={field.value}
                        onChange={handleChange(cfg.field_key)}
                        className={`w-full border border-greyBorder rounded-md p-2 focus:outline-none focus:ring-2 ${
                          field.error ? 'border-redDanger focus:ring-redDanger' : 'focus:ring-greenPrimary'
                        }`}
                      />
                      {field.error && <p className="text-xs text-redDanger">This field is required</p>}
                    </div>
                  )

                default:
                  return (
                    <div key={cfg.id}>
                      <label className="block text-sm font-medium mb-1">
                        {cfg.label} {cfg.required && <span className="text-redDanger">*</span>}
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter your ${cfg.label.toLowerCase()}`}
                        value={field.value}
                        onChange={handleChange(cfg.field_key)}
                        className={`w-full border border-greyBorder rounded-md p-2 focus:outline-none focus:ring-2  ${
                          field.error ? 'border-redDanger focus:ring-redDanger' : 'focus:ring-greenPrimary'
                        }`}
                      />
                      {field.error && <p className="text-xs text-redDanger">This field is required</p>}
                    </div>
                  )
              }
            })}

          <ModalPoseDetector
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCapture={handleCapture}
          />

          <button
            type="button"
            onClick={validateAndSubmit}
            disabled={state.submitting}
            className={`w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-md transition ${
              state.submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {state.submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ApplyJobPage
