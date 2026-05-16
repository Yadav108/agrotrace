import React from 'react'
import Link from 'next/link'
import SignOutButton from './SignOutButton'

export default function Navbar({ user }: { user?: { name?: string; role?: string } }) {
  return (
    <div className="w-full bg-white rounded-lg px-4 py-3 flex items-center justify-between shadow-sm">
      <Link href="/" className="font-bold text-lg text-[#1a4d2e]">🌾 AgroTrace</Link>
      <div className="flex items-center gap-3">
        {user?.name && <div className="text-sm text-gray-700">{user.name}</div>}
        {user?.role && <div className="text-xs px-2 py-1 bg-green-50 text-[#1a4d2e] rounded">{user.role}</div>}
        <SignOutButton />
      </div>
    </div>
  )
}
