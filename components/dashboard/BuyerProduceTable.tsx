"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Batch = {
  id: string
  batchCode: string
  cropType: string
  variety: string | null
  farmLocation: string
  remainingKg: number
  pricePerKg: number
  farmer: { name: string }
}

export default function BuyerProduceTable({ batches }: { batches: Batch[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<Batch | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function openModal(batch: Batch) {
    setSelected(batch)
    setQuantity(1)
    setError("")
  }

  function closeModal() {
    setSelected(null)
    setError("")
  }

  async function placeOrder() {
    if (!selected || quantity <= 0) return
    setLoading(true)
    setError("")

    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batchId: selected.id, quantityOrdered: quantity }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "Failed to place order")
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
          <h2 className="font-semibold text-white">Available Produce</h2>
        </div>
        {batches.length === 0 ? (
          <div className="p-12 text-center text-zinc-600">
            <div className="text-4xl mb-3">🌾</div>
            <p>No produce available right now.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: "rgba(255,255,255,0.03)" }}>
              <tr>
                {["Batch Code", "Crop", "Variety", "Origin Farm", "Available (kg)", "Price/kg", "Action"].map(h => (
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
                  <td className="px-4 py-3 text-zinc-400">{b.farmer.name} · {b.farmLocation}</td>
                  <td className="px-4 py-3 text-zinc-300">{b.remainingKg.toFixed(1)} kg</td>
                  <td className="px-4 py-3 text-zinc-300">₹{b.pricePerKg}/kg</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openModal(b)}
                      className="px-3 py-1 rounded-lg text-xs font-medium text-white bg-brand-red hover:bg-brand-red-hover transition-colors"
                    >
                      Place Order
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
          <div className="absolute inset-0 bg-black/70" onClick={closeModal} />

          <div className="relative glass rounded-2xl p-8 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-1 text-white">Place Order</h3>
            <p className="text-sm text-zinc-500 mb-6">
              {selected.cropType} · {selected.farmer.name} · ₹{selected.pricePerKg}/kg
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-400">
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  min={1}
                  max={selected.remainingKg}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="input-dark"
                />
                <p className="text-xs text-zinc-600 mt-1">Max: {selected.remainingKg.toFixed(1)} kg available</p>
              </div>

              <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Price per kg</span>
                  <span className="font-medium text-white">₹{selected.pricePerKg}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-zinc-500">Quantity</span>
                  <span className="font-medium text-white">{quantity} kg</span>
                </div>
                <div className="flex justify-between font-bold text-base mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-zinc-300">Total Cost</span>
                  <span className="text-brand-red">₹{(quantity * selected.pricePerKg).toLocaleString("en-IN")}</span>
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
                  onClick={placeOrder}
                  disabled={loading || quantity <= 0 || quantity > selected.remainingKg}
                  className="btn-primary flex-1 py-2.5 text-sm"
                >
                  {loading ? "Placing..." : "Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
