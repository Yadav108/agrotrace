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
      <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-green-100">
          <h2 className="font-semibold" style={{ color: "#1a4d2e" }}>Available Produce</h2>
        </div>
        {batches.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">🌾</div>
            <p>No produce available right now.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "#f5f0e8" }}>
              <tr>
                {["Batch Code", "Crop", "Variety", "Origin Farm", "Available (kg)", "Price/kg", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {batches.map((b, i) => (
                <tr key={b.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: "#1a4d2e" }}>{b.batchCode}</td>
                  <td className="px-4 py-3 font-medium">{b.cropType}</td>
                  <td className="px-4 py-3 text-gray-500">{b.variety || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{b.farmer.name} · {b.farmLocation}</td>
                  <td className="px-4 py-3">{b.remainingKg.toFixed(1)} kg</td>
                  <td className="px-4 py-3">₹{b.pricePerKg}/kg</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openModal(b)}
                      className="px-3 py-1 rounded-lg text-xs font-medium text-white"
                      style={{ backgroundColor: "#f4a935" }}
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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-green-100">
            <h3 className="text-lg font-bold mb-1" style={{ color: "#1a4d2e" }}>Place Order</h3>
            <p className="text-sm text-gray-500 mb-6">
              {selected.cropType} · {selected.farmer.name} · ₹{selected.pricePerKg}/kg
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  min={1}
                  max={selected.remainingKg}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800"
                />
                <p className="text-xs text-gray-400 mt-1">Max: {selected.remainingKg.toFixed(1)} kg available</p>
              </div>

              <div className="rounded-lg p-4" style={{ backgroundColor: "#f5f0e8" }}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per kg</span>
                  <span className="font-medium">₹{selected.pricePerKg}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{quantity} kg</span>
                </div>
                <div className="flex justify-between font-bold text-base mt-3 pt-3 border-t border-stone-300">
                  <span style={{ color: "#1a4d2e" }}>Total Cost</span>
                  <span style={{ color: "#1a4d2e" }}>₹{(quantity * selected.pricePerKg).toLocaleString("en-IN")}</span>
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
                  onClick={placeOrder}
                  disabled={loading || quantity <= 0 || quantity > selected.remainingKg}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
                  style={{ backgroundColor: "#1a4d2e" }}
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
