"use client"
import { signOut } from "next-auth/react"
import React from "react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm text-zinc-500 px-3 py-1.5 rounded-md border border-brand-border hover:bg-brand-elevated hover:text-zinc-300 transition-colors w-full text-left"
    >
      Sign out
    </button>
  )
}
