"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Batch = {
  id: string
  batchCode: string
  cropType: string
  farmLocation: string
  farmer: { name: string }
  lastEvent: string | null
}

const EVENT_OPTIONS = [
  { label: "Dispatched", value: "PICKUP" },
  { label: "Checkpoint Passed", value: "CHECKPOINT_PASSED" },
  { label: "Arrived at Destination", value: "WAREHOUSE_ENTRY" },
  { label: "Delivered", value: "DELIVERED" },
]

const eventColors: Record<string, string> = {
  PICKUP: "#2563eb",
  CHECKPOINT_PASSED: "#d97706",
  WAREHOUSE_ENTRY: "#7c3aed",
  DELIVERED: "#16a34a",
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return "just now"
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function TransporterShipmentsTable({ batches }: { batches: Batch[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<Batch | null>(null)
  const [eventType, setEventType] = useState("PICKUP")
  const [locationName, setLocationName] = useState("")
  const [notes, setNotes] = useState("")
  const [temperature, setTemperature] = useState("")
  const [humidity, setHumidity] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function openModal(batch: Batch) {
    setSelected(batch)
    setEventType("PICKUP")
    setLocationName("")
    setNotes("")
    setTemperature("")
    setHumidity("")
    setError("")
  }

  function closeModal() {
    setSelected(null)
    setError("")
  }

  async function logEvent() {
    if (!selected || !locationName.trim()) {
      setError("Location name is required")
      return
    }
    setLoading(true)
    setError("")

    const res = await fetch("/api/events/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        batchId: selected.id,
        eventType,
        locationName: locationName.trim(),
        notes: notes.trim() || null,
        temperature: temperature !== "" ? temperature : null,
        humidity: humidity !== "" ? humidity : null,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "Failed to log event")
      setLoading(false)
      return
    }

    setLoading(false)
    closeModal()
    router.refresh()
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-green-100">
          <h2 className="font-semibold" style={{ color: "#1a4d2e" }}>Active Shipments</h2>
        </div>
        {batches.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">🚛</div>
            <p>No active shipments right now.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "#f5f0e8" }}>
              <tr>
                {["Batch Code", "Crop", "Farmer", "Origin", "Current Status", "Last Event", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {batches.map((b, i) => (
                <tr key={b.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: "#1a4d2e" }}>{b.batchCode}</td>
                  <td className="px-4 py-3 font-medium">{b.cropType}</td>
                  <td className="px-4 py-3 text-gray-600">{b.farmer.name}</td>
                  <td className="px-4 py-3 text-gray-500">{b.farmLocation}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs text-white font-medium" style={{ backgroundColor: "#d97706" }}>
                      IN TRANSIT
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {b.lastEvent ? b.lastEvent : "No events yet"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openModal(b)}
                      className="px-3 py-1 rounded-lg text-xs font-medium text-white"
                      style={{ backgroundColor: "#1a4d2e" }}
                    >
                      Log Event
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-green-100">
            <h3 className="text-lg font-bold mb-1" style={{ color: "#1a4d2e" }}>Log Shipment Event</h3>
            <p className="text-sm text-gray-500 mb-6">
              {selected.batchCode} · {selected.cropType}
            </p>

            <div className="space-y-4">
              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800 bg-white"
                >
                  {EVENT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>Location Name</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Nashik Checkpoint, Mumbai Warehouse"
                  className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800 resize-none"
                />
              </div>

              {/* Temperature + Humidity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>Temp (°C)</label>
                  <input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="e.g. 22"
                    className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>Humidity (%)</label>
                  <input
                    type="number"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    placeholder="e.g. 65"
                    className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-lg border border-green-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={logEvent}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
                  style={{ backgroundColor: "#1a4d2e" }}
                >
                  {loading ? "Logging..." : "Log Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
