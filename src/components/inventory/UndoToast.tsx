'use client'

import { useEffect, useState } from 'react'
import { X, Undo2 } from 'lucide-react'

interface UndoToastProps {
  message: string
  duration?: number
  onUndo?: () => void
  onDismiss?: () => void
}

export function UndoToast({
  message,
  duration = 5000,
  onUndo,
  onDismiss,
}: UndoToastProps) {
  const [progress, setProgress] = useState(100)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)

      if (remaining === 0) {
        clearInterval(interval)
        handleDismiss()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [duration])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss?.(), 200)
  }

  const handleUndo = () => {
    setIsVisible(false)
    setTimeout(() => onUndo?.(), 200)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-3 px-4 py-3 rounded-xl
        bg-slate-900 dark:bg-slate-100
        text-white dark:text-slate-900
        shadow-xl
        animate-in slide-in-from-bottom-4 fade-in duration-200
        ${!isVisible ? 'animate-out slide-out-to-bottom-4 fade-out' : ''}
      `}
    >
      {/* Message */}
      <span className="text-sm font-medium">{message}</span>

      {/* Undo button */}
      <button
        onClick={handleUndo}
        className="flex items-center gap-1.5 px-3 py-1 rounded-lg
          bg-teal-500 text-white
          hover:bg-teal-400
          text-sm font-medium
          transition-colors"
      >
        <Undo2 className="w-3.5 h-3.5" />
        Anulează
      </button>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="p-1 rounded-lg
          hover:bg-white/10 dark:hover:bg-black/10
          transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden">
        <div
          className="h-full bg-teal-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
