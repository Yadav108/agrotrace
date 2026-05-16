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
    <div className="min-h-screen flex">
      <aside className="w-60 bg-white border-r border-green-200 p-6 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold text-[#1a4d2e] mb-6">🌾 AgroTrace</div>

          <nav className="flex flex-col space-y-2">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="px-3 py-2 rounded hover:bg-gray-50 text-[#1a4d2e] font-medium">{l.label}</Link>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-green-100">
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-gray-500 mb-2">{role}</div>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 bg-[#f5f0e8] p-8">
        {children}
      </main>
    </div>
  )
}
