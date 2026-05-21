import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import AddBatchModal from "@/components/dashboard/AddBatchModal"

export default async function FarmerDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const farmer = await prisma.user.findUnique({
    where: { email: session.user!.email! }
  })
  if (!farmer) redirect("/login")

  const batches = await prisma.batch.findMany({
    where: { farmerId: farmer.id },
    include: { orders: true },
    orderBy: { createdAt: "desc" }
  })

  const totalRevenue = batches.reduce((sum, b) => {
    const confirmed = b.orders.filter(o => o.status === "CONFIRMED" || o.status === "DELIVERED")
    return sum + confirmed.reduce((s, o) => s + o.totalAmount, 0)
  }, 0)

  const pendingOrders = batches.reduce((sum, b) => {
    return sum + b.orders.filter(o => o.status === "PENDING").length
  }, 0)

  const stats = [
    { label: "Total Batches", value: batches.length, icon: "📦" },
    { label: "Available", value: batches.filter(b => b.status === "AVAILABLE").length, icon: "✅" },
    { label: "Revenue (₹)", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: "💰" },
    { label: "Pending Orders", value: pendingOrders, icon: "⏳" },
  ]

  const statusColors: Record<string, string> = {
    AVAILABLE: "#059669",
    IN_TRANSIT: "#d97706",
    SOLD_OUT: "#52525b",
    PARTIALLY_SOLD: "#2563eb",
    DELIVERED: "#dc2626",
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Farmer Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Welcome back, {farmer.name}</p>
        </div>
        <AddBatchModal />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-xl p-5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-zinc-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Batches Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="font-semibold text-white">My Produce Listings</h2>
        </div>
        {batches.length === 0 ? (
          <div className="p-12 text-center text-zinc-600">
            <div className="text-4xl mb-3">🌱</div>
            <p>No batches yet. Add your first produce listing.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: "rgba(255,255,255,0.03)" }}>
              <tr>
                {["Batch Code", "Crop", "Variety", "Qty (kg)", "Price/kg", "Status", "Harvest Date", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {batches.map((b, i) => (
                <tr key={b.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-red">{b.batchCode}</td>
                  <td className="px-4 py-3 font-medium text-white">{b.cropType}</td>
                  <td className="px-4 py-3 text-zinc-500">{b.variety || "—"}</td>
                  <td className="px-4 py-3 text-zinc-300">{b.quantityKg}</td>
                  <td className="px-4 py-3 text-zinc-300">₹{b.pricePerKg}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs text-white font-medium"
                      style={{ backgroundColor: statusColors[b.status] || "#52525b" }}>
                      {b.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{new Date(b.harvestDate).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <Link href={`/trace/${b.batchCode}`}>
                      <button className="px-3 py-1 rounded-lg text-xs font-medium text-white bg-brand-red hover:bg-brand-red-hover transition-colors">
                        View Trace
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
