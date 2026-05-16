import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "FARMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const farmer = await prisma.user.findUnique({ where: { email: session.user!.email! } })
  if (!farmer) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const { cropType, variety, quantityKg, pricePerKg, harvestDate, farmLocation } = await req.json()

  if (!cropType || !quantityKg || !pricePerKg || !harvestDate || !farmLocation) {
    return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 })
  }

  // Generate batchCode: e.g. TOM-2026-0003
  const prefix = `${cropType.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}`
  const count = await prisma.batch.count({ where: { batchCode: { startsWith: prefix } } })
  const batchCode = `${prefix}-${String(count + 1).padStart(4, "0")}`

  const batch = await prisma.batch.create({
    data: {
      batchCode,
      cropType,
      variety: variety || null,
      quantityKg: parseFloat(quantityKg),
      pricePerKg: parseFloat(pricePerKg),
      harvestDate: new Date(harvestDate),
      farmLocation,
      farmerId: farmer.id,
      status: "AVAILABLE",
    },
  })

  return NextResponse.json(batch)
}
