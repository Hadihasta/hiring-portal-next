import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signJwt } from '@/lib/jwt'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    console.log(email, password, " <<<< ")

    // Cek apakah email & password diisi
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Cari user berdasarkan email
    const user = await prisma.users.findUnique({
      where: { email },
    })

    // Jika user tidak ditemukan
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials Email not Found' }, { status: 401 })
    }

    // Bandingkan password secara langsung (karena tidak di-hash)
    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Buat token JWT
    const token = signJwt({
      email: user.email,
      password: user.password,
    })

    // Response sukses
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        // bigint tidak bisa di-serialize ke JSON, jadi di-convert ke number
        id: Number(user.id),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
