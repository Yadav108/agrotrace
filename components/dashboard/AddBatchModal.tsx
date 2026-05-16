"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const EMPTY = {
  cropType: "",
  variety: "",
  quantityKg: "",
  pricePerKg: "",
  harvestDate: "",
  farmLocation: "",
}

export default function AddBatchModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState("")

  function set(field: keyof typeof EMPTY, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function openModal() {
    setForm(EMPTY)
    setError("")
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
    setError("")
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3500)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/batches/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "Failed to create batch")
      setLoading(false)
      return
    }

    setLoading(false)
    closeModal()
    router.refresh()
    showToast("Batch listed successfully!")
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={openModal}
        className="px-4 py-2 rounded-lg text-white text-sm font-semibold"
        style={{ backgroundColor: "#f4a935" }}
      >
        + Add New Batch
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 border border-green-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-1" style={{ color: "#1a4d2e" }}>
              Add New Batch
            </h3>
            <p className="text-sm text-gray-400 mb-6">List a new produce batch for buyers to discover.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Crop Type */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>
                  Crop Type <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tomatoes"
                  value={form.cropType}
                  onChange={(e) => set("cropType", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800"
                />
              </div>

              {/* Variety */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>
                  Variety
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hybrid (optional)"
                  value={form.variety}
                  onChange={(e) => set("variety", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800"
                />
              </div>

              {/* Quantity + Price — side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>
                    Quantity (kg) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 500"
                    value={form.quantityKg}
                    onChange={(e) => set("quantityKg", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>
                    Price per kg (₹) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 18"
                    value={form.pricePerKg}
                    onChange={(e) => set("pricePerKg", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800"
                  />
                </div>
              </div>

              {/* Harvest Date */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>
                  Harvest Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={form.harvestDate}
                  onChange={(e) => set("harvestDate", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800"
                />
              </div>

              {/* Farm Location */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>
                  Farm Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nashik, Maharashtra"
                  value={form.farmLocation}
                  onChange={(e) => set("farmLocation", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-lg border border-green-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
                  style={{ backgroundColor: "#1a4d2e" }}
                >
                  {loading ? "Listing..." : "List Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#1a4d2e" }}>
          ✅ {toast}
        </div>
      )}
    </>
  )
}
