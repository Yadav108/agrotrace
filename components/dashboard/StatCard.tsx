import React from 'react'

export default function StatCard({ title, value, icon }: { title: string; value: string | number; icon?: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
      <div className="text-3xl">{icon || '📊'}</div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  )
}
