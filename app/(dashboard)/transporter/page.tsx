import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import TransporterShipmentsTable from "@/components/dashboard/TransporterShipmentsTable"

export default async function TransporterDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if ((session.user as any).role !== "TRANSPORTER") redirect("/login")

  const transporter = await prisma.user.findUnique({ where: { email: session.user!.email! } })
  if (!transporter) redirect("/login")

  const myEventBatchIds = await prisma.shipmentEvent.findMany({
    where: { actorId: transporter.id },
    select: { batchId: true },
    distinct: ["batchId"],
  })
  const handledIds = myEventBatchIds.map(e => e.batchId)

  const activeBatches = await prisma.batch.findMany({
    where: { status: "IN_TRANSIT" },
    include: {
      farmer: true,
      events: { orderBy: { timestamp: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  })

  const myEvents = await prisma.shipmentEvent.findMany({
    where: { actorId: transporter.id },
    include: { batch: true },
    orderBy: { timestamp: "desc" },
  })

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const eventsToday = myEvents.filter(e => new Date(e.timestamp) >= todayStart).length

  const deliveredCount = await prisma.batch.count({
    where: {
      status: "DELIVERED",
      id: { in: handledIds.length > 0 ? handledIds : ["__none__"] },
    },
  })

  const stats = [
    { label: "Active Shipments", value: activeBatches.length, icon: "🚛" },
    { label: "Events Logged Today", value: eventsToday, icon: "📋" },
    { label: "Batches Delivered", value: deliveredCount, icon: "✅" },
  ]

  function timeAgo(date: Date) {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return "just now"
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const eventColors: Record<string, string> = {
    BATCH_CREATED: "#52525b",
    PICKUP: "#2563eb",
    CHECKPOINT_PASSED: "#d97706",
    WAREHOUSE_ENTRY: "#7c3aed",
    WAREHOUSE_EXIT: "#db2777",
    DELIVERED: "#059669",
    QUALITY_CHECK: "#0891b2",
  }

  const eventLabels: Record<string, string> = {
    BATCH_CREATED: "Batch Created",
    PICKUP: "Dispatched",
    CHECKPOINT_PASSED: "Checkpoint Passed",
    WAREHOUSE_ENTRY: "Arrived",
    WAREHOUSE_EXIT: "Warehouse Exit",
    DELIVERED: "Delivered",
    QUALITY_CHECK: "Quality Check",
  }

  const shipmentsForClient = activeBatches.map(b => ({
    id: b.id,
    batchCode: b.batchCode,
    cropType: b.cropType,
    farmLocation: b.farmLocation,
    farmer: { name: b.farmer.name },
    lastEvent: b.events[0]
      ? `${b.events[0].locationName} · ${timeAgo(b.events[0].timestamp)}`
      : null,
  }))

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Transporter Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Welcome back, {transporter.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-xl p-5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-zinc-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active Shipments */}
      <TransporterShipmentsTable batches={shipmentsForClient} />

      {/* Log History */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="font-semibold text-white">Log History</h2>
        </div>
        {myEvents.length === 0 ? (
          <div className="p-12 text-center text-zinc-600">
            <p>No events logged yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: "rgba(255,255,255,0.03)" }}>
              <tr>
                {["Batch Code", "Event Type", "Location", "Timestamp", "Notes"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myEvents.slice(0, 10).map((e, i) => (
                <tr key={e.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-red">{e.batch.batchCode}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded-full text-xs text-white font-medium whitespace-nowrap"
                      style={{ backgroundColor: eventColors[e.eventType] || "#52525b" }}
                    >
                      {eventLabels[e.eventType] || e.eventType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{e.locationName}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">
                    {new Date(e.timestamp).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{e.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
