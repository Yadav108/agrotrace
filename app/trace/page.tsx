import { prisma } from "@/lib/prisma"
import dynamic from "next/dynamic"
import Link from "next/link"
import TraceSearch from "@/components/trace/TraceSearch"

const TraceMap = dynamic(() => import("@/components/trace/TraceMap"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-lg border border-green-100 flex items-center justify-center text-gray-400 text-sm"
      style={{ height: 420 }}
    >
      Loading map…
    </div>
  ),
})

const EVENT_LABELS: Record<string, string> = {
  BATCH_CREATED: "Registered at Farm",
  PICKUP: "Dispatched from Farm",
  CHECKPOINT_PASSED: "Checkpoint Cleared",
  WAREHOUSE_ENTRY: "Arrived at Warehouse",
  WAREHOUSE_EXIT: "Left Warehouse",
  DELIVERED: "Delivered to Buyer",
  QUALITY_CHECK: "Quality Check",
}

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "#16a34a",
  PARTIALLY_SOLD: "#2563eb",
  SOLD_OUT: "#6b7280",
  IN_TRANSIT: "#d97706",
  DELIVERED: "#1a4d2e",
}

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Available",
  PARTIALLY_SOLD: "Partially Sold",
  SOLD_OUT: "Sold Out",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
}

function formatTimestamp(d: Date) {
  return new Date(d).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

async function fetchBatch(batchCode: string) {
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
  if (!batch) return null
  const totalOrdered = batch.orders.reduce((sum, o) => sum + o.quantityOrdered, 0)
  return { batch, remainingKg: batch.quantityKg - totalOrdered }
}

type Props = { searchParams: { batch?: string } }

export default async function TracePage({ searchParams }: Props) {
  const batchCode = searchParams.batch?.trim() || ""
  const result = batchCode ? await fetchBatch(batchCode) : null
  const notFound = batchCode && !result

  // Serialize events for client components (Dates → ISO strings)
  const mapEvents = result
    ? result.batch.events.map((e) => ({
        id: e.id,
        eventType: e.eventType,
        locationName: e.locationName,
        lat: e.lat,
        lon: e.lon,
        timestamp: e.timestamp.toISOString(),
      }))
    : []

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "#1a4d2e" }}>
          Supply Chain Trace
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your produce from farm to table — every step verified.
        </p>
      </div>

      {/* Search */}
      <div className="mb-10">
        <TraceSearch initialValue={batchCode} />
      </div>

      {/* Not found */}
      {notFound && (
        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-semibold text-gray-700">
            No batch found for code{" "}
            <span className="font-mono" style={{ color: "#1a4d2e" }}>
              {batchCode}
            </span>
            .
          </p>
          <p className="text-sm text-gray-400 mt-1">Please check the batch code and try again.</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Two-column row */}
          <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1.15fr" }}>

            {/* LEFT — Batch Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="font-mono text-xl font-bold" style={{ color: "#1a4d2e" }}>
                    {result.batch.batchCode}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {result.batch.cropType}
                    {result.batch.variety ? ` · ${result.batch.variety}` : ""}
                  </div>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs text-white font-semibold"
                  style={{ backgroundColor: STATUS_COLORS[result.batch.status] || "#6b7280" }}
                >
                  {STATUS_LABELS[result.batch.status] || result.batch.status}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <SummaryRow label="Farmer" value={result.batch.farmer.name} />
                <SummaryRow label="Farm Location" value={result.batch.farmLocation} />
                <SummaryRow label="Harvest Date" value={formatDate(result.batch.harvestDate)} />
                <SummaryRow label="Original Quantity" value={`${result.batch.quantityKg} kg`} />
                <SummaryRow
                  label="Remaining Quantity"
                  value={`${result.remainingKg.toFixed(1)} kg`}
                />
                <SummaryRow label="Price per kg" value={`₹${result.batch.pricePerKg}`} />
              </div>
            </div>

            {/* RIGHT — Journey Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <h2 className="font-semibold mb-5" style={{ color: "#1a4d2e" }}>
                Journey Timeline
              </h2>

              {result.batch.events.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  No events recorded for this batch yet.
                </div>
              ) : (
                <div className="relative">
                  {result.batch.events.map((e, i) => {
                    const isLatest = i === result.batch.events.length - 1
                    return (
                      <div key={e.id} className="flex gap-4 relative">
                        {/* Vertical connector */}
                        {i < result.batch.events.length - 1 && (
                          <div
                            className="absolute top-5 bottom-0 w-px"
                            style={{ left: 9, backgroundColor: "#d1fae5" }}
                          />
                        )}

                        {/* Dot */}
                        <div
                          className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 z-10 border-2 ${
                            isLatest
                              ? "bg-green-600 border-green-600"
                              : "bg-gray-300 border-gray-300"
                          }`}
                        />

                        {/* Content */}
                        <div className="pb-6 flex-1 min-w-0">
                          <div className="font-semibold text-sm" style={{ color: "#1a4d2e" }}>
                            {EVENT_LABELS[e.eventType] || e.eventType.replace(/_/g, " ")}
                          </div>
                          <div className="text-sm text-gray-600">{e.locationName}</div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {formatTimestamp(e.timestamp)}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {e.actor.name}
                            <span className="opacity-50 ml-1">· {e.actor.role}</span>
                          </div>
                          {(e.temperature != null || e.humidity != null) && (
                            <div className="flex gap-3 mt-1 text-xs text-gray-500">
                              {e.temperature != null && (
                                <span>🌡️ {e.temperature}°C</span>
                              )}
                              {e.humidity != null && (
                                <span>💧 {e.humidity}%</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-green-100">
              <h2 className="font-semibold" style={{ color: "#1a4d2e" }}>
                Journey Map
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Events with GPS coordinates are shown on the map. Orange marker = latest stop.
              </p>
            </div>
            <div className="p-4">
              <TraceMap events={mapEvents} />
            </div>
          </div>
        </div>
      )}

      {/* Empty state — no search yet */}
      {!batchCode && (
        <div className="py-20 text-center text-gray-400">
          <div className="text-6xl mb-4">🌿</div>
          <p className="text-lg font-medium text-gray-600">Enter a batch code above to trace its journey</p>
          <p className="text-sm mt-1">
            Try{" "}
            <Link href="/trace?batch=WHT-2026-0001" className="font-mono underline" style={{ color: "#1a4d2e" }}>
              WHT-2026-0001
            </Link>{" "}
            to see a live example.
          </p>
        </div>
      )}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  )
}
