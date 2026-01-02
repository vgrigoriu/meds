'use client'

import { useRef } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onNavigateToList?: () => void
  placeholder?: string
}

export function SearchBar({ value, onChange, onNavigateToList, placeholder = 'Caută medicamente...' }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      onChange('')
      inputRef.current?.blur()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      inputRef.current?.blur()
      onNavigateToList?.()
    }
  }

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
      <input
        ref={inputRef}
        id="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-teal-500 dark:focus:border-teal-400 rounded-lg text-base text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 outline-none transition-colors"
      />
    </div>
  )
}
