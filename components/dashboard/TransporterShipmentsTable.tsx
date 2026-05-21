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
      <div className="glass rounded-xl overflow-hidden mb-6">
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="font-semibold text-white">Active Shipments</h2>
        </div>
        {batches.length === 0 ? (
          <div className="p-12 text-center text-zinc-600">
            <div className="text-4xl mb-3">🚛</div>
            <p>No active shipments right now.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: "rgba(255,255,255,0.03)" }}>
              <tr>
                {["Batch Code", "Crop", "Farmer", "Origin", "Current Status", "Last Event", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {batches.map((b, i) => (
                <tr key={b.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-red">{b.batchCode}</td>
                  <td className="px-4 py-3 font-medium text-white">{b.cropType}</td>
                  <td className="px-4 py-3 text-zinc-400">{b.farmer.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{b.farmLocation}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs text-white font-medium bg-amber-700">
                      IN TRANSIT
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">
                    {b.lastEvent ?? "No events yet"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openModal(b)}
                      className="px-3 py-1 rounded-lg text-xs font-medium text-white bg-brand-red hover:bg-brand-red-hover transition-colors"
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

      {/* Log Event Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={closeModal} />

          <div className="relative glass rounded-2xl p-8 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-1 text-white">Log Shipment Event</h3>
            <p className="text-sm text-zinc-500 mb-6">
              {selected.batchCode} · {selected.cropType}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-400">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="input-dark"
                >
                  {EVENT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-400">Location Name</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Nashik Checkpoint, Mumbai Warehouse"
                  className="input-dark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-400">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes..."
                  rows={2}
                  className="input-dark resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-400">Temp (°C)</label>
                  <input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="e.g. 22"
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-400">Humidity (%)</label>
                  <input
                    type="number"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    placeholder="e.g. 65"
                    className="input-dark"
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="btn-outline flex-1 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={logEvent}
                  disabled={loading}
                  className="btn-primary flex-1 py-2.5 text-sm"
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
