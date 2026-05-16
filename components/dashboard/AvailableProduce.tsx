"use client"

type Batch = {
  id: string
  batchCode: string
  cropType: string
  farmLocation: string
  quantityKg: number
  pricePerKg: number
  farmer: { name: string }
}

export default function AvailableProduce({ batches }: { batches: Batch[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-green-100">
        <h2 className="font-semibold" style={{ color: "#1a4d2e" }}>Available Produce</h2>
      </div>
      <table className="w-full text-sm">
        <thead style={{ backgroundColor: "#f5f0e8" }}>
          <tr>
            {["Batch Code", "Crop", "Farmer", "Location", "Available (kg)", "Price/kg", "Action"].map(h => (
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
              <td className="px-4 py-3">{b.quantityKg} kg</td>
              <td className="px-4 py-3">₹{b.pricePerKg}/kg</td>
              <td className="px-4 py-3">
                <button
                  className="px-3 py-1 rounded-lg text-xs font-medium text-white"
                  style={{ backgroundColor: "#f4a935" }}
                  onClick={() => alert("Order placement coming soon!")}
                >
                  Place Order
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
