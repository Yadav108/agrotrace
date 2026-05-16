import React from 'react'

export default function StatusBadge({ status }: { status: string }) {
  const s = status?.toString() || ''
  let classes = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium '
  if (s === 'AVAILABLE') classes += 'bg-green-100 text-green-800'
  else if (s === 'IN_TRANSIT') classes += 'bg-yellow-100 text-yellow-800'
  else if (s === 'PARTIALLY_SOLD') classes += 'bg-yellow-50 text-yellow-800'
  else if (s === 'SOLD_OUT') classes += 'bg-gray-100 text-gray-700'
  else classes += 'bg-gray-100 text-gray-700'

  return <span className={classes}>{s.replace('_', ' ')}</span>
}
