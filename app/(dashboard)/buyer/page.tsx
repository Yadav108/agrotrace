import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import BuyerProduceTable from "@/components/dashboard/BuyerProduceTable"

export default async function BuyerDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if ((session.user as any).role !== "BUYER") redirect("/login")

  const buyer = await prisma.user.findUnique({ where: { email: session.user!.email! } })
  if (!buyer) redirect("/login")

  const myOrders = await prisma.order.findMany({
    where: { buyerId: buyer.id },
    include: { batch: true },
    orderBy: { createdAt: "desc" },
  })

  const activeOrders = myOrders.filter(o => o.status === "PENDING" || o.status === "CONFIRMED").length
  const totalSpent = myOrders
    .filter(o => o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.totalAmount, 0)
  const uniqueCrops = new Set(myOrders.map(o => o.batch.cropType)).size

  const stats = [
    { label: "Total Orders", value: myOrders.length, icon: "🛒" },
    { label: "Active Orders", value: activeOrders, icon: "⏳" },
    { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: "💰" },
    { label: "Unique Crops", value: uniqueCrops, icon: "🌾" },
  ]

  const rawBatches = await prisma.batch.findMany({
    where: { status: { in: ["AVAILABLE", "PARTIALLY_SOLD"] } },
    include: { farmer: true, orders: true },
    orderBy: { createdAt: "desc" },
  })

  const availableBatches = rawBatches
    .map(b => {
      const ordered = b.orders.reduce((sum, o) => sum + o.quantityOrdered, 0)
      const remainingKg = b.quantityKg - ordered
      return {
        id: b.id,
        batchCode: b.batchCode,
        cropType: b.cropType,
        variety: b.variety,
        farmLocation: b.farmLocation,
        remainingKg,
        pricePerKg: b.pricePerKg,
        farmer: { name: b.farmer.name },
      }
    })
    .filter(b => b.remainingKg > 0)

  const statusColors: Record<string, string> = {
    PENDING: "#d97706",
    CONFIRMED: "#2563eb",
    IN_TRANSIT: "#7c3aed",
    DELIVERED: "#059669",
    CANCELLED: "#52525b",
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Buyer Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Welcome back, {buyer.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-xl p-5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-zinc-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Available Produce */}
      <BuyerProduceTable batches={availableBatches} />

      {/* My Orders */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="font-semibold text-white">My Orders</h2>
        </div>
        {myOrders.length === 0 ? (
          <div className="p-12 text-center text-zinc-600">
            <div className="text-4xl mb-3">🛒</div>
            <p>No orders placed yet. Browse available produce above.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: "rgba(255,255,255,0.03)" }}>
              <tr>
                {["Order ID", "Batch Code", "Crop", "Qty (kg)", "Total (₹)", "Status", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myOrders.map((o, i) => (
                <tr key={o.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-600">{o.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-red">{o.batch.batchCode}</td>
                  <td className="px-4 py-3 font-medium text-white">{o.batch.cropType}</td>
                  <td className="px-4 py-3 text-zinc-300">{o.quantityOrdered} kg</td>
                  <td className="px-4 py-3 font-semibold text-white">₹{o.totalAmount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded-full text-xs text-white font-medium"
                      style={{ backgroundColor: statusColors[o.status] || "#52525b" }}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/trace/${o.batch.batchCode}`}>
                      <button className="px-3 py-1 rounded-lg text-xs font-medium text-white bg-brand-red hover:bg-brand-red-hover transition-colors">
                        Track
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
