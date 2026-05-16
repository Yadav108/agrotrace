"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function TraceSearch({ initialValue }: { initialValue: string }) {
  const router = useRouter()
  const [input, setInput] = useState(initialValue)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = input.trim()
    if (code) router.push(`/trace?batch=${encodeURIComponent(code)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-2xl mx-auto">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter Batch Code (e.g. TMT-2026-0001)"
        className="flex-1 px-5 py-4 text-base rounded-xl border-2 border-green-200 focus:outline-none focus:border-green-700 bg-white text-gray-800 font-mono placeholder:font-sans placeholder:text-gray-400"
      />
      <button
        type="submit"
        className="px-8 py-4 rounded-xl text-white font-semibold text-base whitespace-nowrap"
        style={{ backgroundColor: "#1a4d2e" }}
      >
        Search
      </button>
    </form>
  )
}
