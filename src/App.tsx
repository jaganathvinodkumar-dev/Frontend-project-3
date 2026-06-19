import React, { useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import CommentsPanel from './components/CommentsPanel'
import Board from './components/Board'
import { useStore } from './store/useStore'

export default function App() {
  const toggleTheme = useStore((s) => s.toggleTheme)
  const toggleSidebar = useStore((s) => s.toggleSidebar)

  useEffect(() => {
    function onKey(e: KeyboardEvent){
      const target = document.activeElement as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as any).isContentEditable)) return
      if (e.key === 'c'){
        const el = document.getElementById('comment-input') as HTMLTextAreaElement | null
        if (el){ el.focus(); e.preventDefault() }
      }
      if (e.key === 'd'){
        toggleTheme()
      }
      if (e.key === 's'){
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleTheme, toggleSidebar])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <a href="#main" className="skip-link">Skip to main content</a>
      <Header />
      <div className="flex">
        <Sidebar />
        <main id="main" role="main" className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">Workspace</h1>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-transparent shadow-sm">
            <div className="bg-inherit">
              {/* Board */}
              <div className="mt-2">
                <Board />
              </div>
            </div>
          </div>
        </main>
        <aside role="complementary" className="w-96 border-l border-gray-200 dark:border-gray-800 p-4">
          <CommentsPanel />
        </aside>
      </div>
    </div>
  )
}
