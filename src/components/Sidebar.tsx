import React from 'react'
import { useStore } from '../store/useStore'

export default function Sidebar() {
  const open = useStore((s) => s.sidebarOpen)
  if (!open) return null
  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
      <div className="mb-4 font-semibold">Projects</div>
      <ul className="space-y-2 text-sm">
        <li className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Board Alpha</li>
        <li className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Design</li>
        <li className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Sprint</li>
      </ul>
    </aside>
  )
}
