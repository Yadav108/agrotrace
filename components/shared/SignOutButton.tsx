"use client"
import { signOut } from "next-auth/react"
import React from "react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm text-gray-700 px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
    >
      Sign out
    </button>
  )
}
