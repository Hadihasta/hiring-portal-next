'use client'
import axios from 'axios'
import { useReducer, ChangeEvent } from 'react'

interface State {
  email: string
  password: string
}

type CounterAction =
  | { type: 'reset' }
  | { type: 'setEmail'; value: State['email'] }
  | { type: 'setPassword'; value: State['password'] }

const initialState: State = { email: '', password: '' }

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case 'reset':
      return initialState
    case 'setEmail':
      return { ...state, email: action.value }
    case 'setPassword':
      return { ...state, password: action.value }
    default:
      throw new Error('Unknown action')
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(stateReducer, initialState)

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setEmail', value: e.target.value })
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setPassword', value: e.target.value })
  }

  const handleClick = () => {
    console.log('Email:', state.email)
    console.log('Password:', state.password)
    fetchData()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleClick()
    }
  }

  const fetchData = async () => {
    try {
      const payload = {
        email: state.email,
        password: state.password,
      }
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, payload)
      console.log(res)
    } catch (error) {
      console.error('Gagal mengambil data:', error)
    }
  }

  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
      onKeyDown={handleKeyDown}
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start shadow-form p-[40px] w-[500px] rounded-[8px] ">
        <div>
          <div className="font-bold">Masuk Ke Portal Hiring</div>
          <div className="text-sm">
            Belum punya akun?{' '}
            <span className="text-greenPrimary underline underline-offset-1 cursor-pointer">
              Daftar menggunakan email
            </span>
          </div>
        </div>

        <div
          id="form"
          className="w-full gap-3 flex flex-col"
        >
          <div className="flex flex-col gap-3 ">
            <span className="text-xs">
              Alamat email <span className="text-red-700 text-xs">*</span>
            </span>
            <input
              type="email"
              className="input-field"
              placeholder="Masukan email"
              value={state.email}
              onChange={handleEmailChange}
            />
          </div>

          <div className="flex flex-col gap-3 ">
            <span className="text-xs">
              Kata sandi <span className="text-red-700 text-xs">*</span>
            </span>
            <input
              type="password"
              className="input-field"
              placeholder="Masukan kata sandi"
              value={state.password}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="text-greenPrimary text-xs cursor-pointer hover:font-bold">Lupa kata sandi?</div>
        </div>

        <button
          onClick={handleClick}
          className="flex justify-center w-full  bg-yellowBg rounded-lg hover:bg-yellowHover p-(--paddingButton) cursor-pointer "
        >
          <span className="font-bold text-base">Masuk</span>
        </button>

        <div className="flex items-center w-full text-gray-400  text-xs">
          <div className="flex-1 h-px bg-[#E0E0E0]"></div>
          <span className="px-3">atau</span>
          <div className="flex-1 h-px bg-[#E0E0E0]"></div>
        </div>

        <button className="button-outline hover:bg-gray-50">Masuk dengan link via email</button>
        <button className="button-outline hover:bg-gray-50">Masuk dengan Google</button>
      </main>
      {/* <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer> */}
    </div>
  )
}
