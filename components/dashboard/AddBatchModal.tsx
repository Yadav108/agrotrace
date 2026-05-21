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
      <button
        onClick={openModal}
        className="btn-primary px-4 py-2 text-sm"
      >
        + Add New Batch
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={closeModal} />

          <div className="relative glass rounded-2xl p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-1 text-white">Add New Batch</h3>
            <p className="text-sm text-zinc-500 mb-6">List a new produce batch for buyers to discover.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-400">
                  Crop Type <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tomatoes"
                  value={form.cropType}
                  onChange={(e) => set("cropType", e.target.value)}
                  className="input-dark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-400">Variety</label>
                <input
                  type="text"
                  placeholder="e.g. Hybrid (optional)"
                  value={form.variety}
                  onChange={(e) => set("variety", e.target.value)}
                  className="input-dark"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-400">
                    Quantity (kg) <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 500"
                    value={form.quantityKg}
                    onChange={(e) => set("quantityKg", e.target.value)}
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-400">
                    Price per kg (₹) <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 18"
                    value={form.pricePerKg}
                    onChange={(e) => set("pricePerKg", e.target.value)}
                    className="input-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-400">
                  Harvest Date <span className="text-brand-red">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={form.harvestDate}
                  onChange={(e) => set("harvestDate", e.target.value)}
                  className="input-dark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-400">
                  Farm Location <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nashik, Maharashtra"
                  value={form.farmLocation}
                  onChange={(e) => set("farmLocation", e.target.value)}
                  className="input-dark"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-outline flex-1 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-2.5 text-sm"
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white bg-brand-red">
          ✅ {toast}
        </div>
      )}
    </>
  )
}
