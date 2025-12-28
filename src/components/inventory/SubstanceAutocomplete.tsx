'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import type { ActiveSubstance } from '@/types'

interface SubstanceAutocompleteProps {
  substances: ActiveSubstance[]
  onSelect: (name: string) => void
  placeholder?: string
}

export function filterSubstances(
  substances: ActiveSubstance[],
  query: string
): ActiveSubstance[] {
  const sorted = [...substances].sort((a, b) => a.name.localeCompare(b.name, 'ro'))
  if (!query.trim()) return sorted
  const lowerQuery = query.toLowerCase()
  return sorted.filter((s) => s.name.toLowerCase().includes(lowerQuery))
}

export function shouldShowAddOption(
  substances: ActiveSubstance[],
  query: string
): boolean {
  if (!query.trim()) return false
  const lowerQuery = query.toLowerCase().trim()
  return !substances.some((s) => s.name.toLowerCase() === lowerQuery)
}

export function SubstanceAutocomplete({
  substances,
  onSelect,
  placeholder = 'Caută sau adaugă substanță...',
}: SubstanceAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = filterSubstances(substances, query)
  const showAddOption = shouldShowAddOption(substances, query)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(name: string) {
    onSelect(name)
    setQuery('')
    setIsOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault()
      // If there's an exact match or filtered results, select first result
      // Otherwise, add as new
      if (filtered.length > 0 && !showAddOption) {
        handleSelect(filtered[0].name)
      } else if (showAddOption) {
        handleSelect(query.trim())
      } else if (filtered.length > 0) {
        handleSelect(filtered[0].name)
      }
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-base bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 outline-none"
      />

      {isOpen && (filtered.length > 0 || showAddOption) && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {showAddOption && (
            <button
              type="button"
              onClick={() => handleSelect(query.trim())}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-teal-600 dark:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Plus className="w-4 h-4" />
              Adaugă „{query.trim()}"
            </button>
          )}
          {filtered.map((substance) => (
            <button
              type="button"
              key={substance.id}
              onClick={() => handleSelect(substance.name)}
              className="w-full px-3 py-2 text-sm text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {substance.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
