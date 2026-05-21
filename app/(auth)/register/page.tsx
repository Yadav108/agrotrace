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
    <div className="relative min-h-screen py-10 flex items-center justify-center overflow-hidden">

      {/* Agricultural bokeh background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div style={{
          position: "absolute", width: 700, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(140,90,8,0.16), transparent 70%)",
          bottom: "-10%", right: "-12%", filter: "blur(100px)",
        }} />
        <div style={{
          position: "absolute", width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(22,65,10,0.12), transparent 70%)",
          top: "-5%", left: "-8%", filter: "blur(90px)",
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">

        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="text-brand-red">Agro</span>
            <span className="text-white">Trace</span>
          </h1>
          <p className="text-sm mt-2 text-zinc-500">Farm to Table, Every Step Traced</p>
        </div>

        {/* Glassmorphic card */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6 text-white">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-400">Full Name</label>
              <input type="text" required placeholder="Rajesh Kumar"
                value={name} onChange={(e) => setName(e.target.value)} className="input-dark" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-400">Email</label>
              <input type="email" required placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} className="input-dark" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-400">Password</label>
              <input type="password" required placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} className="input-dark" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-400">Confirm Password</label>
              <input type="password" required placeholder="••••••••"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-dark" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-400">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className="p-3 rounded-xl border-2 text-center transition-all"
                    style={{
                      borderColor: role === r.value ? "#dc2626" : "rgba(255,255,255,0.08)",
                      background: role === r.value ? "rgba(69,10,10,0.7)" : "rgba(255,255,255,0.04)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div className="text-2xl">{r.icon}</div>
                    <div className="text-xs font-semibold mt-1 text-zinc-300">{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-4 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-sm text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-brand-red hover:text-red-400 transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
