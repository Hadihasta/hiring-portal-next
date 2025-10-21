'use client'

import React, { useEffect, useReducer, useState, ChangeEvent } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import axios from '@/lib/axios'

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
  fields: Record<string, FieldState>
  configs: JobConfiguration[]
  submitting: boolean
}

type Action =
  | { type: 'setConfigs'; configs: JobConfiguration[] }
  | { type: 'setField'; key: string; value: string }
  | { type: 'setError'; key: string; error: boolean }
  | { type: 'setSubmitting'; value: boolean }

function reducer(state: State, action: Action): State {
  switch (action.type) {
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

const ApplyJobPage = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [state, dispatch] = useReducer(reducer, { fields: {}, configs: [], submitting: false })
  const [photo, setPhoto] = useState<string | null>(null)

  useEffect(() => {
    if (!jobId) return
    fetchJobById(jobId).then((job: JobData) => {
      dispatch({ type: 'setConfigs', configs: job.job_configurations })
    })
  }, [jobId])

  const handleChange = (key: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    dispatch({ type: 'setField', key, value: e.target.value })
    dispatch({ type: 'setError', key, error: false })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateAndSubmit = () => {
    let hasError = false
    state.configs.forEach((cfg) => {
      if (cfg.required && cfg.visible) {
        const field = state.fields[cfg.field_key]
        if (!field?.value.trim()) {
          dispatch({ type: 'setError', key: cfg.field_key, error: true })
          hasError = true
        }
      }
    })

    if (!hasError) {
      dispatch({ type: 'setSubmitting', value: true })
      setTimeout(() => {
        alert('Form submitted successfully ✅')
        dispatch({ type: 'setSubmitting', value: false })
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-pureWhite flex justify-center py-10 px-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow p-8">
        {/* Header */}
        <div className="flex flex-row items-center pb-4 mb-6 gap-4">
          <button className="cursor-pointer border-greyBorder border-2 rounded-lg hover:shadow-md p-2">
            <Image
              src="/asset/icon/icon-back.svg"
              alt="back"
              width={20}
              height={20}
              className="object-cover"
            />
          </button>
          <h1 className="text-lg font-bold text-blackText grow">
            Apply Front End at Rakamin
          </h1>
          <p className="text-sm text-greyNeutral mt-1">
            This field required to fill
          </p>
        </div>

        <form className="space-y-5">
          {/* PHOTO UPLOAD SECTION */}
           <span className="text-redDanger text-sm font-bold">*Required</span>
          <div className="flex flex-col items-start my-8">
            <div className="text-xs font-bold">Photo Profile</div>
            <div className="relative w-28 h-28 my-4">
              <Image
                src={photo || "/asset/global/avatar-placeholder.svg"}
                alt="Default Avatar"
                fill
                className="object-cover rounded-full border"
              />
            </div>
            <label className="flex items-center cursor-pointer border-greyBorder border-2 text-blackText px-4 py-2 rounded-lg hover:bg-gray-200 text-sm gap-2">
              <Image
                src="/asset/icon/download-icon.svg"
                alt="upload"
                width={20}
                height={20}
                className="object-cover"
              />
              <div className="text-sm font-bold">Take a Picture</div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* DYNAMIC FORM FIELDS */}
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
                        {cfg.label} {cfg.required && <span className="text-red-500">*</span>}
                      </label>
                      <select
                        value={field.value}
                        onChange={handleChange(cfg.field_key)}
                        className={`w-full border rounded-md px-3 py-2 ${
                          field.error ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {field.error && <p className="text-xs text-red-500">This field is required</p>}
                    </div>
                  )

                default:
                  return (
                    <div key={cfg.id}>
                      <label className="block text-sm font-medium mb-1">
                        {cfg.label} {cfg.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter your ${cfg.label.toLowerCase()}`}
                        value={field.value}
                        onChange={handleChange(cfg.field_key)}
                        className={`w-full border rounded-md px-3 py-2 ${
                          field.error ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {field.error && <p className="text-xs text-red-500">This field is required</p>}
                    </div>
                  )
              }
            })}

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
