import './globals.css'
import React from 'react'
import Link from 'next/link'
import Providers from './providers'

export const metadata = {
  title: 'Agrotrace',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f5f0e8] font-sans min-h-screen text-[#1a4d2e]">
        <header className="py-6">
          <div className="max-w-6xl mx-auto px-4">
            <Link href="/" className="text-2xl font-bold">🌿 AgroTrace</Link>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  )
}
