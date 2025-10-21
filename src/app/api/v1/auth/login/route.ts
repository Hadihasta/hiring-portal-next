export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signJwt } from '@/lib/jwt'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await prisma.users.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials Email not Found' }, { status: 401 })
    }

    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    console.log("🔑 JWT_SECRET :", !!process.env.JWT_SECRET)

    const token = signJwt({ email: user.email, password: user.password })

    return NextResponse.json({
      message: 'Login successful',
      token,
      data: {
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
