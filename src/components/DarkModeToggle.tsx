import React from 'react'
import { useStore } from '../store/useStore'

export default function DarkModeToggle(){
  const isDark = useStore((s) => s.isDark)
  const toggle = useStore((s) => s.toggleTheme)
  return (
    <button onClick={toggle} className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
