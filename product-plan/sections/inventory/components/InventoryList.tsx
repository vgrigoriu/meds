import { useMemo } from 'react'
import { ArrowUpDown } from 'lucide-react'
import type { InventoryProps, SortOption } from '../types'
import { MedicationRow } from './MedicationRow'
import { AddMedicationRow } from './AddMedicationRow'
import { EmptyState } from './EmptyState'

export function InventoryList({
  medications,
  activeSubstances,
  searchQuery = '',
  sortBy = 'expiration',
  selectedId,
  onSearchChange,
  onSortChange,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}: InventoryProps) {
  // Filter medications based on search query
  const filteredMedications = useMemo(() => {
    if (!searchQuery.trim()) return medications

    const query = searchQuery.toLowerCase()
    return medications.filter((med) => {
      // Match by medication name
      if (med.name.toLowerCase().includes(query)) return true

      // Match by active substance name
      const substanceNames = med.activeSubstanceIds
        .map((id) => activeSubstances.find((s) => s.id === id)?.name?.toLowerCase())
        .filter(Boolean)

      return substanceNames.some((name) => name?.includes(query))
    })
  }, [medications, activeSubstances, searchQuery])

  // Sort medications
  const sortedMedications = useMemo(() => {
    return [...filteredMedications].sort((a, b) => {
      if (sortBy === 'expiration') {
        return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
      }
      return a.name.localeCompare(b.name)
    })
  }, [filteredMedications, sortBy])

  // Check if search matches any substance (to show substances on all matching rows)
  const searchMatchesSubstance = useMemo(() => {
    if (!searchQuery.trim()) return false
    const query = searchQuery.toLowerCase()
    return activeSubstances.some((s) => s.name.toLowerCase().includes(query))
  }, [searchQuery, activeSubstances])

  const isEmpty = medications.length === 0
  const noResults = !isEmpty && sortedMedications.length === 0

  return (
    <div className="h-full">
      {/* Sort toggle - only show if there are medications */}
      {!isEmpty && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {sortedMedications.length} medication{sortedMedications.length !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>

          <button
            onClick={() => onSortChange?.(sortBy === 'expiration' ? 'name' : 'expiration')}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm
              text-slate-600 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortBy === 'expiration' ? 'By expiration' : 'By name'}
          </button>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && <EmptyState onAdd={() => onSelect?.(null)} />}

      {/* No results state */}
      {noResults && (
        <div className="py-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            No medications found matching "{searchQuery}"
          </p>
        </div>
      )}

      {/* Medication list */}
      {!isEmpty && !noResults && (
        <div>
          {/* Add row */}
          <AddMedicationRow
            activeSubstances={activeSubstances}
            onAdd={onAdd}
          />

          {/* Medication rows */}
          {sortedMedications.map((medication) => (
            <MedicationRow
              key={medication.id}
              medication={medication}
              activeSubstances={activeSubstances}
              isSelected={selectedId === medication.id}
              showSubstances={searchMatchesSubstance}
              onSelect={() =>
                onSelect?.(selectedId === medication.id ? null : medication.id)
              }
              onEdit={() => onEdit?.(medication.id, {})}
              onDelete={() => onDelete?.(medication.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
