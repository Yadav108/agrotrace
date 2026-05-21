import React from 'react'

export default function StatCard({ title, value, icon }: { title: string; value: string | number; icon?: string }) {
  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-5 flex items-center gap-4">
      <div className="text-3xl">{icon || '📊'}</div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-zinc-500 mt-0.5">{title}</div>
      </div>
    </div>
  )
}
