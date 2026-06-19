import React, { useEffect } from 'react'
import { useStore } from '../store/useStore'

export default function Presence(){
  const presence = useStore((s) => s.presence)
  return (
    <div className="flex items-center gap-2">
      {presence.map((p) => (
        <div key={p.id} title={p.name} className="flex items-center gap-2">
          <div style={{background:p.color}} className={`h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 ${p.online ? 'opacity-100' : 'opacity-40'}`} />
        </div>
      ))}
    </div>
  )
}
