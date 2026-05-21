import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="font-sans">

      {/* ── SECTION 1: HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center px-6 md:px-16 overflow-hidden">

        {/* Real farm image — lighter blur so the photo is actually visible */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "-20px",
            backgroundImage: "url('/farm.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            filter: "blur(3px) brightness(0.30) saturate(0.8)",
          }}
          aria-hidden
        />

        {/* Directional gradient for text contrast + depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(110deg, rgba(0,0,0,0.75) 0%, rgba(4,4,4,0.40) 55%, rgba(0,0,0,0.68) 100%)",
          }}
          aria-hidden
        />

        {/* Fade into the rest of the page */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #060606)" }}
          aria-hidden
        />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-5 gap-12 items-center py-24">

          {/* Left — 60% */}
          <div className="md:col-span-3 space-y-7">
            <span
              className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full border border-brand-red-border bg-brand-red-muted/60 text-red-400"
              style={{ backdropFilter: "blur(8px)" }}
            >
              Built for Indian Agriculture
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
              From Farm to Table —<br />
              <span className="text-brand-red">Every Step Traced</span>
            </h1>

            <p className="text-lg text-zinc-300 leading-relaxed max-w-xl">
              AgroTrace eliminates middlemen opacity. Farmers get fair prices. Buyers get
              verified produce. Every rupee, every kilometer — on record.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/register">
                <button className="px-7 py-3.5 rounded-xl text-white font-semibold text-base bg-brand-red hover:bg-brand-red-hover transition-colors shadow-lg shadow-red-900/40">
                  Get Started
                </button>
              </Link>
              <Link href="/trace">
                <button
                  className="px-7 py-3.5 rounded-xl font-semibold text-base text-zinc-200 transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  Trace a Batch
                </button>
              </Link>
            </div>
          </div>

          {/* Right — 40%: Glassmorphic stats card */}
          <div className="md:col-span-2">
            <div className="glass rounded-2xl p-8">
              <p className="text-xs font-semibold uppercase tracking-widest mb-6 text-zinc-500">
                Platform at a glance
              </p>
              <div className="space-y-7">
                {[
                  { value: "₹2,400 Cr+", label: "Produce tracked on-chain" },
                  { value: "48,000+",     label: "Farmers onboarded" },
                  { value: "99.2%",       label: "Delivery accuracy" },
                ].map((s) => (
                  <div key={s.label} className="border-b pb-5" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <div className="text-3xl font-extrabold text-brand-red">{s.value}</div>
                    <div className="text-sm mt-1 text-zinc-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE PROBLEM ──────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-brand-red">
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
              <div key={c.title} className="glass rounded-xl p-7">
                <div className="text-4xl mb-4">{c.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{c.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-brand-red">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Three Actors. One Chain. Zero Opacity.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌾",
                role: "Farmer",
                desc: "List produce, set your price, and track every order in real time. No middlemen, no mystery.",
                accent: "#dc2626",
              },
              {
                icon: "🚛",
                role: "Transporter",
                desc: "Log each checkpoint, update temperature and conditions, and build a verifiable trust record.",
                accent: "#b91c1c",
              },
              {
                icon: "🛒",
                role: "Buyer",
                desc: "Browse verified produce, place orders directly with farmers, and trace every batch end-to-end.",
                accent: "#991b1b",
              },
            ].map((c) => (
              <div
                key={c.role}
                className="glass rounded-xl p-8"
                style={{ borderTop: `3px solid ${c.accent}` }}
              >
                <div className="text-5xl mb-5">{c.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{c.role}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: DEMO CREDENTIALS ─────────────────────────────── */}
      <section className="py-24 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-10" style={{ borderColor: "rgba(220,38,38,0.18)" }}>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-red mb-3">
                Live Demo
              </p>
              <h2 className="text-3xl font-bold text-white">Try the Live Demo</h2>
              <p className="text-zinc-500 text-sm mt-2">
                Login as any role to explore the full supply chain experience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "🌾", role: "Farmer",      email: "rajesh@agrotrace.in",   password: "farmer123" },
                { icon: "🛒", role: "Buyer",       email: "prashant@agrotrace.in", password: "buyer123" },
                { icon: "🚛", role: "Transporter", email: "fastmove@agrotrace.in", password: "transport123" },
              ].map((c) => (
                <div key={c.role} className="glass-surface rounded-xl p-6">
                  <div className="text-3xl mb-3">{c.icon}</div>
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                    {c.role} Login
                  </div>
                  <div className="space-y-1.5 mb-5">
                    <div
                      className="font-mono text-sm text-zinc-300 px-3 py-1.5 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      {c.email}
                    </div>
                    <div
                      className="font-mono text-sm text-zinc-300 px-3 py-1.5 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      {c.password}
                    </div>
                  </div>
                  <Link href="/login">
                    <button className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-red hover:bg-brand-red-hover transition-colors">
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
      <footer
        className="py-12 px-6 md:px-16"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xl font-bold text-white">
              <span className="text-brand-red">Agro</span>Trace
            </div>
            <div className="text-sm mt-1 text-zinc-600">Farm to Table, Every Step Traced</div>
          </div>
          <div className="text-sm text-zinc-600">
            Built with{" "}
            <span className="text-zinc-400 font-medium">Next.js</span>
            {" · "}
            <span className="text-zinc-400 font-medium">Prisma</span>
            {" · "}
            <span className="text-zinc-400 font-medium">SQLite</span>
            {" · "}
            <span className="text-zinc-400 font-medium">Leaflet</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
