import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password, role, phone, location } = body

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Name, email, password and role are required" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role, phone, location }
  })

  return NextResponse.json({ success: true, userId: user.id })
}
