'use client'
import React from 'react'
import { motion } from 'motion/react'
import { AnimatePresence } from 'motion/react'
import { useReducer, ChangeEvent } from 'react'

// isopen untuk menampilkan modal true akan muncul modalnya, false tidak muncul
// onclose untuk menutup modal, biasanya diisi dengan fungsi yang mengubah isopen menjadi false
interface ModalJobOpeningFormProps {
  isOpen: boolean
  onClose: () => void
}

interface State {
  jobName: string
  jobType: string
  jobDesc: string
  numberCandidate: number
  minSalary: number
  maxSalary: number
  errors: {
    jobName: boolean
    jobType: boolean
    jobDesc: boolean
  }
}

type ActionForm =
  | { type: 'reset' }
  | { type: 'setJobName'; value: State['jobName'] }
  | { type: 'setJobType'; value: State['jobType'] }
  | { type: 'setJobDesc'; value: State['jobDesc'] }
  | { type: 'setnumberCandidate'; value: State['numberCandidate'] }
  | { type: 'setminSalary'; value: State['minSalary'] }
  | { type: 'setmaxSalary'; value: State['maxSalary'] }
  | { type: 'setError'; field: keyof State['errors']; value: boolean }

const initialState: State = {
  jobName: '',
  jobType: '',
  jobDesc: '',
  numberCandidate: 0,
  minSalary: 0,
  maxSalary: 0,
  errors: {
    jobName: false,
    jobType: false,
    jobDesc: false,
  },
}

function stateReducer(state: State, action: ActionForm): State {
  switch (action.type) {
    case 'reset':
      return initialState
    case 'setJobName':
      return { ...state, jobName: action.value }
    case 'setJobType':
      return { ...state, jobType: action.value }
    case 'setJobDesc':
      return { ...state, jobDesc: action.value }
    case 'setnumberCandidate':
      return { ...state, numberCandidate: action.value }
    case 'setminSalary':
      return { ...state, minSalary: action.value }
    case 'setmaxSalary':
      return { ...state, maxSalary: action.value }
    case 'setError':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.value },
      }

    default:
      throw new Error('Unknown action')
  }
}

const ModalJobOpeningForm: React.FC<ModalJobOpeningFormProps> = ({ isOpen, onClose }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState)

  const handleClick = () => {
    console.log('Form submitted:', state)
  }

  const handleChangeJobName = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    dispatch({ type: 'setJobName', value })
    dispatch({ type: 'setError', field: 'jobName', value: value.trim() === '' })
  }

  const handleChangeJobType = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    dispatch({ type: 'setJobType', value })
    dispatch({ type: 'setError', field: 'jobType', value: value.trim() === '' })
  }

  const handleChangeJobDesc = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    dispatch({ type: 'setJobDesc', value })
    dispatch({ type: 'setError', field: 'jobDesc', value: value.trim() === '' })
  }
  const handleErrorMessage = (type: string) => {
    switch (type) {
      case 'jobname':
        return 'Please input Job Name..'
      case 'jobtype':
        return 'Please select Job Type..'
      case 'jobdesc':
        return 'Please input Job Description..'
      default:
        return 'Field required'
    }
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
            id="jobOpeningForm"
            className="bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg "
          >
            {/* Header */}
            <div
              id="Head_form"
              className="flex justify-between items-center border-b border-greyBorder "
            >
              <h2 className="text-xl font-bold">Job Opening</h2>
              <button
                onClick={onClose}
                className="text-greyNeutral hover:text-gray-700 text-2xl cursor-pointer "
              >
                x
              </button>
            </div>

            {/* Form */}
            <div className=" p-[16px] space-y-4">
              {/* Job Name */}
              <div>
                <label className="flex text-xs font-medium mb-1">
                  Job Name <span className="text-redDanger text-xs">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Front End Engineer"
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
                    state.errors.jobName ? 'border-redDanger focus:ring-redDanger' : 'focus:ring-greenPrimary'
                  }`}
                  value={state.jobName}
                  onChange={handleChangeJobName}
                />
                {state.errors.jobName && (
                  <div className="flex text-redDanger pt-[8px] text-xs">{handleErrorMessage('jobname')}</div>
                )}
              </div>

              {/* Job Type */}
              <div>
                <label className="flex text-xs font-medium mb-1">
                  Job Type <span className="text-redDanger text-xs">*</span>
                </label>
                <select
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
                    state.errors.jobType ? 'border-redDanger focus:ring-redDanger' : 'focus:ring-greenPrimary'
                  }`}
                  value={state.jobType}
                  onChange={handleChangeJobType}
                >
                  <option value="">Select job type</option>
                  <option value="fulltime">Full-time</option>
                  <option value="contract">Contract</option>
                  <option value="parttime">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
                {state.errors.jobType && (
                  <div className="flex text-redDanger pt-[8px] text-xs">{handleErrorMessage('jobtype')}</div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="flex text-xs font-medium mb-1">
                  Job Description
                  <span className="text-redDanger text-xs">*</span>
                </label>
                <textarea
                  placeholder="Ex: Describe the job..."
                  className={`w-full border rounded-md p-2 h-24 focus:outline-none focus:ring-2 ${
                    state.errors.jobDesc ? 'border-redDanger focus:ring-redDanger' : 'focus:ring-greenPrimary'
                  }`}
                  value={state.jobDesc}
                  onChange={handleChangeJobDesc}
                />
                {state.errors.jobDesc && (
                  <div className="flex text-redDanger pt-[8px] text-xs">{handleErrorMessage('jobdesc')}</div>
                )}
              </div>

              {/* Number of Candidate */}
              <div>
                <label className="flex text-xs  font-medium mb-1">Number of Candidate Needed</label>
                <input
                  type="number"
                  placeholder="Ex: 2"
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-greenPrimary"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="flex text-xs  font-medium mb-1">Job Salary</label>
                <div className="flex gap-4">
                  <div>Minimum Estimated Salary</div>
                  <input
                    type="text"
                    placeholder="Rp 7.000.000"
                    className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-greenPrimary"
                  />
                  Maximum Estimated Salary
                  <input
                    type="text"
                    placeholder="Rp 10.000.000"
                    className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-greenPrimary"
                  />
                </div>
              </div>

              {/* Candidate Info List */}
              <div className="border rounded-lg p-4 mt-6">
                <h3 className="flex font-bold mb-3 text-sm ">Minimum Profile Information Required</h3>

                <div className="divide-y text-sm">
                  {[
                    'Full name',
                    'Photo Profile',
                    'Gender',
                    'Domicile',
                    'Email',
                    'Phone number',
                    'LinkedIn Link',
                    'Date of Birth',
                  ].map((label) => (
                    <div
                      key={label}
                      className="flex justify-between items-center py-2"
                    >
                      <span>{label}</span>
                      <div className="flex items-center gap-3">
                        <button className="text-xs bg-[#01959f]/10 text-[#01959f] px-3 py-1 rounded-md">
                          Mandatory
                        </button>
                        <button className="text-xs text-gray-500 hover:text-[#01959f]">Optional</button>
                        <label className="flex items-center gap-1 text-xs text-gray-600">
                          <span>Off</span>
                          <input
                            type="checkbox"
                            className="accent-[#01959f]"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  onClick={handleClick}
                  disabled={state.errors.jobDesc || state.errors.jobName || state.errors.jobType}
                  className={`px-5 py-2 rounded-md transition-all duration-200
    ${
      state.errors.jobDesc || state.errors.jobName || state.errors.jobType
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-[#01959f] hover:bg-[#017a84] text-white cursor-pointer'
    }`}
                >
                  Publish Job
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ModalJobOpeningForm
