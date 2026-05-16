"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const roles = [
  { value: "FARMER", icon: "🌾", label: "Farmer" },
  { value: "BUYER", icon: "🛒", label: "Buyer" },
  { value: "TRANSPORTER", icon: "🚛", label: "Transporter" },
]

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!role) { setError("Please select a role"); return }
    if (password !== confirmPassword) { setError("Passwords do not match"); return }
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); return }
    router.push("/login?registered=true")
  }

  return (
    <div className="min-h-screen py-10 flex items-center justify-center" style={{ backgroundColor: "#f5f0e8" }}>
      <div className="w-full max-w-md px-4">

        {/* Branding */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🌿</div>
          <h1 className="text-3xl font-bold" style={{ color: "#1a4d2e" }}>AgroTrace</h1>
          <p className="text-sm mt-1" style={{ color: "#4a7c59" }}>Farm to Table, Every Step Traced</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <h2 className="text-xl font-semibold mb-6" style={{ color: "#1a4d2e" }}>Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>Full Name</label>
              <input
                type="text"
                required
                placeholder="Rajesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#1a4d2e" }}>Confirm Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-800"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1a4d2e" }}>I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className="p-3 rounded-xl border-2 text-center transition-all"
                    style={{
                      borderColor: role === r.value ? "#1a4d2e" : "#d1fae5",
                      backgroundColor: role === r.value ? "#f0fdf4" : "white",
                    }}
                  >
                    <div className="text-2xl">{r.icon}</div>
                    <div className="text-xs font-semibold mt-1" style={{ color: "#1a4d2e" }}>{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#1a4d2e" }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-green-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium" style={{ color: "#f4a935" }}>
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
