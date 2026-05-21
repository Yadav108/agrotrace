import React from 'react'

export default function StatusBadge({ status }: { status: string }) {
  const s = status?.toString() || ''
  let classes = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium '
  if (s === 'AVAILABLE') classes += 'bg-emerald-950 text-emerald-400 border border-emerald-800'
  else if (s === 'IN_TRANSIT') classes += 'bg-amber-950 text-amber-400 border border-amber-800'
  else if (s === 'PARTIALLY_SOLD') classes += 'bg-blue-950 text-blue-400 border border-blue-800'
  else if (s === 'SOLD_OUT') classes += 'bg-zinc-800 text-zinc-400 border border-zinc-700'
  else classes += 'bg-zinc-800 text-zinc-400 border border-zinc-700'

  return <span className={classes}>{s.replace('_', ' ')}</span>
}
