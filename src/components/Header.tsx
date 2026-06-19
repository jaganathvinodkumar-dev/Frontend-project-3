import React from 'react'
import { useStore } from '../store/useStore'
import DarkModeToggle from './DarkModeToggle'
import Presence from './Presence'

export default function Header() {
  const toggle = useStore((s) => s.toggleSidebar)
  return (
    <header role="banner" className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <button aria-label="Toggle sidebar" onClick={toggle} className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">☰</button>
        <div className="text-lg font-bold">Collab Dashboard</div>
      </div>
      <div className="flex items-center gap-3">
        <Presence />
        <DarkModeToggle />
      </div>
    </header>
  )
}
