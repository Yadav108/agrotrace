import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "BUYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const buyer = await prisma.user.findUnique({ where: { email: session.user!.email! } })
  if (!buyer) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const { batchId, quantityOrdered } = await req.json()

  if (!batchId || !quantityOrdered || quantityOrdered <= 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: { orders: true },
  })
  if (!batch) return NextResponse.json({ error: "Batch not found" }, { status: 404 })

  const totalOrdered = batch.orders.reduce((sum, o) => sum + o.quantityOrdered, 0)
  const remaining = batch.quantityKg - totalOrdered

  if (quantityOrdered > remaining) {
    return NextResponse.json({ error: "Quantity exceeds available stock" }, { status: 400 })
  }

  const totalAmount = quantityOrdered * batch.pricePerKg

  await prisma.order.create({
    data: {
      batchId,
      buyerId: buyer.id,
      quantityOrdered,
      pricePerKg: batch.pricePerKg,
      totalAmount,
    },
  })

  const newRemaining = remaining - quantityOrdered
  await prisma.batch.update({
    where: { id: batchId },
    data: { status: newRemaining <= 0 ? "SOLD_OUT" : "PARTIALLY_SOLD" },
  })

  return NextResponse.json({ success: true })
}
