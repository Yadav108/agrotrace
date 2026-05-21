import React from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import SignOutButton from '@/components/shared/SignOutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions as any)
  if (!session) redirect('/login')
  const role = (session.user as any)?.role
  const name = session.user?.name || session.user?.email || 'User'

  const navLinks = role === 'FARMER'
    ? [ { href: '/farmer', label: 'Overview' }, { href: '/farmer/new-batch', label: 'New Batch' } ]
    : role === 'BUYER'
      ? [ { href: '/buyer', label: 'Marketplace' } ]
      : [ { href: '/transporter', label: 'Shipments' } ]

  return (
    <div className="relative min-h-screen flex overflow-hidden">

      {/* Persistent agricultural bokeh — visible through glass surfaces */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden style={{ zIndex: 0 }}>
        <div style={{
          position: "absolute", width: 700, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(140,90,8,0.15), transparent 70%)",
          bottom: "-20%", left: "-10%", filter: "blur(110px)",
        }} />
        <div style={{
          position: "absolute", width: 600, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(22,65,10,0.10), transparent 70%)",
          top: "-10%", right: "-8%", filter: "blur(120px)",
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,20,20,0.07), transparent 70%)",
          top: "40%", right: "30%", filter: "blur(90px)",
        }} />
      </div>

      {/* Glassmorphic sidebar */}
      <aside className="relative z-10 w-60 p-6 flex flex-col justify-between flex-shrink-0"
        style={{
          background: "rgba(6,6,6,0.65)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}>
        <div>
          <div className="text-2xl font-bold mb-8 tracking-tight">
            <span className="text-brand-red">Agro</span>
            <span className="text-white">Trace</span>
          </div>

          <nav className="flex flex-col space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2.5 rounded-lg text-zinc-400 font-medium hover:text-white hover:bg-white/5 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-sm font-medium text-white">{name}</div>
          <div className="text-xs text-zinc-500 mb-3">{role}</div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main content area — transparent so body gradient shows */}
      <main className="relative z-10 flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
