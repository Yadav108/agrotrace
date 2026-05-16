import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="font-sans">

      {/* ── SECTION 1: HERO ─────────────────────────────────────────── */}
      <section
        className="min-h-screen flex items-center px-6 md:px-16"
        style={{ backgroundColor: "#f5f0e8" }}
      >
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-5 gap-12 items-center py-20">

          {/* Left — 60% */}
          <div className="md:col-span-3 space-y-7">
            <span
              className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full border"
              style={{ color: "#1a3a2a", borderColor: "#a3c4a8", backgroundColor: "#e8f4e8" }}
            >
              🇮🇳 Built for Indian Agriculture
            </span>

            <h1
              className="text-4xl md:text-5xl font-extrabold leading-tight"
              style={{ color: "#1a3a2a" }}
            >
              From Farm to Table —<br />
              <span style={{ color: "#d97706" }}>Every Step Traced</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              AgroTrace eliminates middlemen opacity. Farmers get fair prices. Buyers get
              verified produce. Every rupee, every kilometer — on record.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/register">
                <button
                  className="px-7 py-3.5 rounded-xl text-white font-semibold text-base shadow-md hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#1a3a2a" }}
                >
                  Get Started
                </button>
              </Link>
              <Link href="/trace">
                <button
                  className="px-7 py-3.5 rounded-xl font-semibold text-base border-2 hover:bg-green-50 transition-colors"
                  style={{ borderColor: "#1a3a2a", color: "#1a3a2a" }}
                >
                  Trace a Batch
                </button>
              </Link>
            </div>
          </div>

          {/* Right — 40%: Stats card */}
          <div className="md:col-span-2">
            <div
              className="rounded-2xl p-8 shadow-xl border"
              style={{ backgroundColor: "#1a3a2a", borderColor: "#2d5a3d" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#a3c4a8" }}>
                Platform at a glance
              </p>
              <div className="space-y-7">
                {[
                  { value: "₹2,400 Cr+", label: "Produce tracked on-chain" },
                  { value: "48,000+", label: "Farmers onboarded" },
                  { value: "99.2%", label: "Delivery accuracy" },
                ].map((s) => (
                  <div key={s.label} className="border-b pb-5" style={{ borderColor: "#2d5a3d" }}>
                    <div
                      className="text-3xl font-extrabold"
                      style={{ color: "#d97706" }}
                    >
                      {s.value}
                    </div>
                    <div className="text-sm mt-1" style={{ color: "#a3c4a8" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE PROBLEM ──────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16" style={{ backgroundColor: "#0c2218" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#a3c4a8" }}>
              The Problem
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              The Invisible Gap Between Farm and Fork
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🧅",
                title: "Farmers earn 15–20% of final price",
                body: "Layers of middlemen extract value at every handoff, leaving farmers with a fraction of the shelf price.",
              },
              {
                icon: "📦",
                title: "No visibility for buyers",
                body: "Buyers can't verify origin, handling conditions, or whether the produce is what it claims to be.",
              },
              {
                icon: "🕐",
                title: "40% post-harvest loss",
                body: "Without cold chain accountability or real-time tracking, spoilage goes undetected and unaddressed.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-xl p-7"
                style={{ backgroundColor: "#153320", border: "1px solid #1f4a2d" }}
              >
                <div className="text-4xl mb-4">{c.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8ab89a" }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16" style={{ backgroundColor: "#f5f0e8" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#d97706" }}>
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#1a3a2a" }}>
              Three Actors. One Chain. Zero Opacity.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌾",
                role: "Farmer",
                desc: "List produce, set your price, and track every order in real time. No middlemen, no mystery.",
                accent: "#16a34a",
              },
              {
                icon: "🚛",
                role: "Transporter",
                desc: "Log each checkpoint, update temperature and conditions, and build a verifiable trust record.",
                accent: "#d97706",
              },
              {
                icon: "🛒",
                role: "Buyer",
                desc: "Browse verified produce, place orders directly with farmers, and trace every batch end-to-end.",
                accent: "#2563eb",
              },
            ].map((c) => (
              <div
                key={c.role}
                className="bg-white rounded-xl p-8 shadow-sm border border-green-100"
                style={{ borderTop: `4px solid ${c.accent}` }}
              >
                <div className="text-5xl mb-5">{c.icon}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "#1a3a2a" }}>
                  {c.role}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: DEMO CREDENTIALS ─────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 bg-amber-50">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl border-2 border-amber-200 p-10"
            style={{ backgroundColor: "#fffbeb" }}
          >
            <div className="text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-amber-600 mb-3">
                Live Demo
              </p>
              <h2 className="text-3xl font-bold" style={{ color: "#1a3a2a" }}>
                Try the Live Demo
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Login as any role to explore the full supply chain experience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🌾",
                  role: "Farmer",
                  email: "rajesh@agrotrace.in",
                  password: "farmer123",
                },
                {
                  icon: "🛒",
                  role: "Buyer",
                  email: "prashant@agrotrace.in",
                  password: "buyer123",
                },
                {
                  icon: "🚛",
                  role: "Transporter",
                  email: "fastmove@agrotrace.in",
                  password: "transport123",
                },
              ].map((c) => (
                <div
                  key={c.role}
                  className="bg-white rounded-xl p-6 border border-amber-100 shadow-sm"
                >
                  <div className="text-3xl mb-3">{c.icon}</div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    {c.role} Login
                  </div>
                  <div className="space-y-1.5 mb-5">
                    <div className="font-mono text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
                      {c.email}
                    </div>
                    <div className="font-mono text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
                      {c.password}
                    </div>
                  </div>
                  <Link href="/login">
                    <button
                      className="w-full py-2.5 rounded-lg text-sm font-semibold text-white"
                      style={{ backgroundColor: "#1a3a2a" }}
                    >
                      Login as {c.role}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: FOOTER ───────────────────────────────────────── */}
      <footer className="py-12 px-6 md:px-16" style={{ backgroundColor: "#1a3a2a" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xl font-bold text-white">🌿 AgroTrace</div>
            <div className="text-sm mt-1" style={{ color: "#a3c4a8" }}>
              Farm to Table, Every Step Traced
            </div>
          </div>
          <div className="text-sm" style={{ color: "#6b9e7a" }}>
            Built with{" "}
            <span className="text-white font-medium">Next.js</span>
            {" · "}
            <span className="text-white font-medium">Prisma</span>
            {" · "}
            <span className="text-white font-medium">SQLite</span>
            {" · "}
            <span className="text-white font-medium">Leaflet</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
