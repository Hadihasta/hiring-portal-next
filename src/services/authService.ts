import axios from "../lib/axios";

interface LoginPayload {
  email: string
  password: string
}

export async function login(payload: LoginPayload) {
  try {
    const res = await axios.post('/auth/login', payload)
    return res.data.data
  } catch (err) {
    console.error('Login gagal:', err)
    throw err
  }
}
