'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react'
import type { Medication, ActiveSubstance } from '@/types'
import { MedicationRow } from './MedicationRow'
import { EmptyState } from './EmptyState'

export type SortOption = 'expiration' | 'name'

interface InventoryListProps {
  medications: Medication[]
  activeSubstances: ActiveSubstance[]
  searchQuery?: string
  sortBy?: SortOption
  selectedId?: number | null
  onSearchChange?: (query: string) => void
  onSortChange?: (sortBy: SortOption) => void
  onSelect?: (id: number | null) => void
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'expiration', label: 'Data expirării' },
  { value: 'name', label: 'Nume' },
]

export function InventoryList({
  medications,
  activeSubstances,
  searchQuery = '',
  sortBy = 'expiration',
  selectedId,
  onSortChange,
  onSelect,
}: InventoryListProps) {
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const sortMenuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setSortMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  // Filter medications based on search query
  const filteredMedications = useMemo(() => {
    if (!searchQuery.trim()) return medications

    const query = searchQuery.toLowerCase()
    return medications.filter((med) => {
      // Match by medication name
      if (med.name.toLowerCase().includes(query)) return true

      // Match by active substance name
      const substanceNames = med.substances
        .map((ms) => activeSubstances.find((s) => s.id === ms.substanceId)?.name?.toLowerCase())
        .filter(Boolean)

      return substanceNames.some((name) => name?.includes(query))
    })
  }, [medications, activeSubstances, searchQuery])

  // Sort medications
  const sortedMedications = useMemo(() => {
    return [...filteredMedications].sort((a, b) => {
      if (sortBy === 'expiration') {
        // Compare by year first, then by month
        if (a.expirationYear !== b.expirationYear) {
          return a.expirationYear - b.expirationYear
        }
        return a.expirationMonth - b.expirationMonth
      }
      return a.name.localeCompare(b.name)
    })
  }, [filteredMedications, sortBy])

  // For each medication, check if any of its substances match the search
  const medicationMatchesSubstance = useMemo(() => {
    if (!searchQuery.trim()) return new Set<number>()
    const query = searchQuery.toLowerCase()

    const matchingIds = new Set<number>()
    for (const med of medications) {
      const hasMatchingSubstance = med.substances.some((ms) => {
        const substance = activeSubstances.find((s) => s.id === ms.substanceId)
        return substance?.name.toLowerCase().includes(query)
      })
      if (hasMatchingSubstance) {
        matchingIds.add(med.id)
      }
    }
    return matchingIds
  }, [medications, activeSubstances, searchQuery])

  const isEmpty = medications.length === 0
  const noResults = !isEmpty && sortedMedications.length === 0

  return (
    <div className="h-full">
      {/* Sort toggle - only show if there are medications */}
      {!isEmpty && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {sortedMedications.length} {sortedMedications.length === 1 ? 'medicament' : 'medicamente'}
            {searchQuery && ` pentru "${searchQuery}"`}
          </span>

          <div className="relative" ref={sortMenuRef}>
            <button
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm
                text-slate-600 dark:text-slate-400
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortOptions.find((o) => o.value === sortBy)?.label}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {sortMenuOpen && (
              <div style={{ minWidth: 'max-content' }} className="absolute right-0 mt-1 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange?.(option.value)
                      setSortMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left whitespace-nowrap
                      text-slate-700 dark:text-slate-300
                      hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Check className="w-4 h-4 text-teal-500" style={{ visibility: sortBy === option.value ? 'visible' : 'hidden' }} />
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && <EmptyState onAdd={() => onSelect?.(null)} />}

      {/* No results state */}
      {noResults && (
        <div className="py-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Niciun medicament găsit pentru „{searchQuery}"
          </p>
        </div>
      )}

      {/* Medication list */}
      {!isEmpty && !noResults && (
        <div>
          {sortedMedications.map((medication) => (
            <MedicationRow
              key={medication.id}
              medication={medication}
              activeSubstances={activeSubstances}
              isSelected={selectedId === medication.id}
              showSubstances={medicationMatchesSubstance.has(medication.id)}
              searchQuery={searchQuery}
              onSelect={() =>
                onSelect?.(selectedId === medication.id ? null : medication.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
