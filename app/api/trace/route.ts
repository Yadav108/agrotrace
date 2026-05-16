import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const batchCode = searchParams.get("batch")?.trim()

  if (!batchCode) {
    return NextResponse.json({ error: "batch parameter required" }, { status: 400 })
  }

  const batch = await prisma.batch.findUnique({
    where: { batchCode },
    include: {
      farmer: true,
      orders: true,
      events: {
        include: { actor: true },
        orderBy: { timestamp: "asc" },
      },
    },
  })

  if (!batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 })
  }

  const totalOrdered = batch.orders.reduce((sum, o) => sum + o.quantityOrdered, 0)
  const remainingKg = batch.quantityKg - totalOrdered

  return NextResponse.json({
    batch: {
      id: batch.id,
      batchCode: batch.batchCode,
      cropType: batch.cropType,
      variety: batch.variety,
      quantityKg: batch.quantityKg,
      remainingKg,
      pricePerKg: batch.pricePerKg,
      harvestDate: batch.harvestDate,
      status: batch.status,
      farmer: {
        name: batch.farmer.name,
        farmLocation: batch.farmLocation,
      },
    },
    events: batch.events.map((e) => ({
      id: e.id,
      eventType: e.eventType,
      locationName: e.locationName,
      lat: e.lat,
      lon: e.lon,
      timestamp: e.timestamp,
      actor: { name: e.actor.name, role: e.actor.role },
      temperature: e.temperature,
      humidity: e.humidity,
      notes: e.notes,
    })),
  })
}
