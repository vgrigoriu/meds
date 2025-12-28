'use client'

import { useState, useEffect } from 'react'

interface ToastProps {
  message: string
  duration?: number
}

export function Toast({ message, duration = 3000 }: ToastProps) {
  const [opacity, setOpacity] = useState(1)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial dark mode
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(darkQuery.matches)

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    darkQuery.addEventListener('change', handler)
    return () => darkQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setOpacity(0), duration - 2000)
    return () => clearTimeout(timer)
  }, [duration])

  return (
    <div
      style={{
        opacity,
        transition: 'opacity 2000ms ease-out',
        backgroundColor: isDark ? 'var(--color-slate-200)' : 'var(--color-slate-700)',
      }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-xl ${isDark ? 'text-slate-900' : 'text-white'}`}
    >
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}
