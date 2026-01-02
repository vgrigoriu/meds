'use client'

import { useMemo, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { ArrowUpDown, ChevronDown, Check, Plus } from 'lucide-react'
import type { Medication, ActiveSubstance } from '@/types'
import { MedicationMatcher } from '@/lib/search'
import { MedicationRow } from './MedicationRow'
import { EmptyState } from './EmptyState'
import { AddMedicationForm } from './AddMedicationForm'

export type SortOption = 'expiration' | 'name'

export interface InventoryListHandle {
  selectFirst: () => void
}

interface InventoryListProps {
  medications: Medication[]
  activeSubstances: ActiveSubstance[]
  searchQuery?: string
  sortBy?: SortOption
  selectedId?: number | null
  pendingDeleteId?: number
  onSearchChange?: (query: string) => void
  onSortChange?: (sortBy: SortOption) => void
  onSelect?: (id: number | null) => void
  onDelete?: (id: number) => void
  onUndo?: () => void
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'expiration', label: 'Data expirării' },
  { value: 'name', label: 'Nume' },
]

export const InventoryList = forwardRef<InventoryListHandle, InventoryListProps>(function InventoryList({
  medications,
  activeSubstances,
  searchQuery = '',
  sortBy = 'expiration',
  selectedId,
  pendingDeleteId,
  onSortChange,
  onSelect,
  onDelete,
  onUndo,
}, ref) {
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
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

  // Create matchers for each medication
  const medicationsWithMatchers = useMemo(() => {
    return medications.map((med) => {
      const substances = med.substances
        .map((ms) => {
          const s = activeSubstances.find((s) => s.id === ms.substanceId)
          return s ? { name: s.name, concentration: ms.concentration } : null
        })
        .filter((s): s is { name: string; concentration: string | null } => s !== null)

      const matcher = new MedicationMatcher(med.name, substances, searchQuery)
      return { medication: med, matcher }
    })
  }, [medications, activeSubstances, searchQuery])

  // Filter medications based on search query
  const filteredMedications = useMemo(() => {
    if (!searchQuery.trim()) return medicationsWithMatchers
    return medicationsWithMatchers.filter(({ matcher }) => matcher.matches())
  }, [medicationsWithMatchers, searchQuery])

  // Sort medications
  const sortedMedications = useMemo(() => {
    return [...filteredMedications].sort((a, b) => {
      const medA = a.medication
      const medB = b.medication
      if (sortBy === 'expiration') {
        // Compare by year first, then by month
        if (medA.expirationYear !== medB.expirationYear) {
          return medA.expirationYear - medB.expirationYear
        }
        return medA.expirationMonth - medB.expirationMonth
      }
      return medA.name.localeCompare(medB.name)
    })
  }, [filteredMedications, sortBy])

  // Expose selectFirst method to parent via ref
  useImperativeHandle(ref, () => ({
    selectFirst: () => {
      const first = sortedMedications[0]
      if (first) {
        onSelect?.(first.medication.id)
      }
    }
  }), [sortedMedications, onSelect])

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target
      const isInInput = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement

      // Esc - close add form (but not if already handled by a child component)
      if (event.key === 'Escape' && isAdding && !event.defaultPrevented) {
        event.preventDefault()
        setIsAdding(false)
        return
      }

      // Don't handle other shortcuts when in input fields
      if (isInInput) return

      // + - open add form
      if (event.key === '+' && !isAdding) {
        event.preventDefault()
        setIsAdding(true)
        return
      }

      // / - focus search bar
      if (event.key === '/') {
        event.preventDefault()
        document.getElementById('search-input')?.focus()
        return
      }

      // Delete - delete selected medication
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId && !isAdding) {
        event.preventDefault()
        onDelete?.(selectedId)
        return
      }

      // Arrow navigation (only when not adding)
      if (isAdding) return
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return

      event.preventDefault()

      const currentIndex = selectedId
        ? sortedMedications.findIndex(({ medication }) => medication.id === selectedId)
        : -1

      let newIndex: number
      if (event.key === 'ArrowDown') {
        newIndex = currentIndex < sortedMedications.length - 1 ? currentIndex + 1 : currentIndex
      } else {
        newIndex = currentIndex > 0 ? currentIndex - 1 : 0
      }

      if (sortedMedications[newIndex]) {
        onSelect?.(sortedMedications[newIndex].medication.id)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isAdding, selectedId, sortedMedications, onSelect, onDelete])

  const isEmpty = medications.length === 0
  const noResults = !isEmpty && sortedMedications.length === 0

  return (
    <div className="h-full">
      {/* Header bar - only show if there are medications */}
      {!isEmpty && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {sortedMedications.length} {sortedMedications.length === 1 ? 'medicament' : 'medicamente'}
            {searchQuery && ` pentru "${searchQuery}"`}
          </span>

          <div className="flex items-center gap-2">
            {/* Add button */}
            <button
              onClick={() => setIsAdding(true)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Adaugă medicament"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Sort dropdown */}
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
        </div>
      )}

      {/* Add medication form */}
      {isAdding && (
        <AddMedicationForm
          activeSubstances={activeSubstances}
          onCancel={() => setIsAdding(false)}
          onSuccess={(medicationId) => {
            setIsAdding(false)
            onSelect?.(medicationId)
          }}
        />
      )}

      {/* Empty state */}
      {isEmpty && <EmptyState onAdd={() => setIsAdding(true)} />}

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
          {sortedMedications.map(({ medication, matcher }) => (
            <MedicationRow
              key={medication.id}
              medication={medication}
              matcher={matcher}
              isSelected={selectedId === medication.id}
              isPendingDelete={pendingDeleteId === medication.id}
              onSelect={() =>
                onSelect?.(selectedId === medication.id ? null : medication.id)
              }
              onDelete={() => onDelete?.(medication.id)}
              onUndo={onUndo}
            />
          ))}
        </div>
      )}
    </div>
  )
})
