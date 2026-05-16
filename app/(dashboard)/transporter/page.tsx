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

  // Batches this transporter has touched (via events)
  const myEventBatchIds = await prisma.shipmentEvent.findMany({
    where: { actorId: transporter.id },
    select: { batchId: true },
    distinct: ["batchId"],
  })
  const handledIds = myEventBatchIds.map(e => e.batchId)

  // Active shipments: IN_TRANSIT batches this transporter has logged on, OR all if none yet
  const activeBatches = await prisma.batch.findMany({
    where: { status: "IN_TRANSIT" },
    include: {
      farmer: true,
      events: { orderBy: { timestamp: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  })

  // Events logged by this transporter
  const myEvents = await prisma.shipmentEvent.findMany({
    where: { actorId: transporter.id },
    include: { batch: true },
    orderBy: { timestamp: "desc" },
  })

  // Today's event count
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const eventsToday = myEvents.filter(e => new Date(e.timestamp) >= todayStart).length

  // Delivered batches this transporter worked on
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
    BATCH_CREATED: "#6b7280",
    PICKUP: "#2563eb",
    CHECKPOINT_PASSED: "#d97706",
    WAREHOUSE_ENTRY: "#7c3aed",
    WAREHOUSE_EXIT: "#db2777",
    DELIVERED: "#16a34a",
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

  // Serialize for client component
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
        <h1 className="text-2xl font-bold" style={{ color: "#1a4d2e" }}>Transporter Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, {transporter.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-green-100">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold" style={{ color: "#1a4d2e" }}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active Shipments table + Log Event modal — client component */}
      <TransporterShipmentsTable batches={shipmentsForClient} />

      {/* Log History */}
      <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-green-100">
          <h2 className="font-semibold" style={{ color: "#1a4d2e" }}>Log History</h2>
        </div>
        {myEvents.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p>No events logged yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "#f5f0e8" }}>
              <tr>
                {["Batch Code", "Event Type", "Location", "Timestamp", "Notes"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myEvents.slice(0, 10).map((e, i) => (
                <tr key={e.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: "#1a4d2e" }}>{e.batch.batchCode}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded-full text-xs text-white font-medium whitespace-nowrap"
                      style={{ backgroundColor: eventColors[e.eventType] || "#6b7280" }}
                    >
                      {eventLabels[e.eventType] || e.eventType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{e.locationName}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(e.timestamp).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{e.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
