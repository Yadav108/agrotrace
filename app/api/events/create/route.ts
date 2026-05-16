import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "TRANSPORTER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const transporter = await prisma.user.findUnique({ where: { email: session.user!.email! } })
  if (!transporter) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const { batchId, eventType, locationName, notes, temperature, humidity } = await req.json()

  if (!batchId || !eventType || !locationName) {
    return NextResponse.json({ error: "batchId, eventType, and locationName are required" }, { status: 400 })
  }

  await prisma.shipmentEvent.create({
    data: {
      batchId,
      actorId: transporter.id,
      eventType,
      locationName,
      notes: notes || null,
      temperature: temperature != null && temperature !== "" ? parseFloat(temperature) : null,
      humidity: humidity != null && humidity !== "" ? parseFloat(humidity) : null,
    },
  })

  if (eventType === "DELIVERED") {
    await prisma.batch.update({
      where: { id: batchId },
      data: { status: "DELIVERED" },
    })
  }

  return NextResponse.json({ success: true })
}
