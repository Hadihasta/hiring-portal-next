import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_for_jwt' // ganti di .env di production

export function signJwt(payload: object) {
  // console.log(payload, " <<< ")
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}
