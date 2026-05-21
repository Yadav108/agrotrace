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
      <body className="bg-brand-dark font-sans min-h-screen text-white">
        <header className="py-5 border-b border-brand-border">
          <div className="max-w-6xl mx-auto px-4">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              <span className="text-brand-red">Agro</span>Trace
            </Link>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  )
}
