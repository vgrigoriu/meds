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
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = filterSubstances(substances, query)
  const showAddOption = shouldShowAddOption(substances, query)

  // Build list of options: "add new" first (if shown), then filtered substances
  const options = [
    ...(showAddOption ? [{ type: 'add' as const, name: query.trim() }] : []),
    ...filtered.map((s) => ({ type: 'existing' as const, name: s.name })),
  ]

  // Reset highlight when options change
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [query, substances.length])

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
    setHighlightedIndex(-1)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || options.length === 0) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true)
        setHighlightedIndex(0)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && options[highlightedIndex]) {
          handleSelect(options[highlightedIndex].name)
        } else if (options.length > 0) {
          handleSelect(options[0].name)
        }
        break
      case 'Escape':
        if (isOpen) {
          e.preventDefault() // Signal to parent that we handled it
          setIsOpen(false)
          setHighlightedIndex(-1)
        }
        break
      case 'Tab':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
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

      {isOpen && options.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {options.map((option, index) => (
            <button
              type="button"
              key={option.type === 'add' ? '__add__' : option.name}
              tabIndex={-1}
              onClick={() => handleSelect(option.name)}
              className={`w-full px-3 py-2 text-sm text-left ${
                option.type === 'add'
                  ? 'flex items-center gap-2 text-teal-600 dark:text-teal-400'
                  : 'text-slate-700 dark:text-slate-300'
              } ${
                highlightedIndex === index
                  ? 'bg-slate-100 dark:bg-slate-700'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {option.type === 'add' && <Plus className="w-4 h-4" />}
              {option.type === 'add' ? `Adaugă „${option.name}"` : option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
