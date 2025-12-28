'use client'

import type { Medication, ActiveSubstance } from '@/types'
import { PresentationIcon } from './PresentationIcon'
import { AlertTriangle, Trash2, Undo2 } from 'lucide-react'

interface MedicationRowProps {
  medication: Medication
  activeSubstances: ActiveSubstance[]
  isSelected?: boolean
  isPendingDelete?: boolean
  showSubstances?: boolean
  searchQuery?: string
  onSelect?: () => void
  onDelete?: () => void
  onUndo?: () => void
}

function formatExpiration(year: number, month: number): string {
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' })
}

function isExpired(year: number, month: number): boolean {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  return year < currentYear || (year === currentYear && month < currentMonth)
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text

  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return text

  const before = text.slice(0, index)
  const match = text.slice(index, index + query.length)
  const after = text.slice(index + query.length)

  return (
    <>
      {before}
      <mark className="bg-amber-200 dark:bg-amber-700 rounded px-0.5">{match}</mark>
      {after}
    </>
  )
}

export function MedicationRow({
  medication,
  activeSubstances,
  isSelected = false,
  isPendingDelete = false,
  showSubstances = false,
  searchQuery = '',
  onSelect,
  onDelete,
  onUndo,
}: MedicationRowProps) {
  const expired = isExpired(medication.expirationYear, medication.expirationMonth)

  const substancesWithNames = medication.substances
    .map((ms) => {
      const substance = activeSubstances.find((s) => s.id === ms.substanceId)
      return substance ? { name: substance.name, concentration: ms.concentration } : null
    })
    .filter(Boolean) as { name: string; concentration: string | null }[]

  return (
    <div
      onClick={isPendingDelete ? undefined : onSelect}
      style={{
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
        borderLeftColor: isSelected ? '#14b8a6' : 'transparent',
      }}
      className={`
        group transition-all duration-200 ease-out
        border-b border-slate-100 dark:border-slate-800
        ${isPendingDelete
          ? 'cursor-default'
          : 'cursor-pointer'
        }
        ${isSelected
          ? 'bg-teal-50 dark:bg-teal-950/30'
          : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
        }
      `}
    >
      {/* Main row content */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Presentation icon */}
        <div className="flex-shrink-0 p-2 rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <PresentationIcon presentation={medication.presentation} />
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <p
            style={{ textDecoration: isPendingDelete ? 'line-through' : 'none' }}
            className="font-medium truncate text-slate-900 dark:text-slate-100"
          >
            {medication.name}
          </p>
        </div>

        {/* Expiration date */}
        <div className={`
          flex-shrink-0 text-sm font-medium flex items-center gap-1.5
          ${expired
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-slate-500 dark:text-slate-400'
          }
        `}>
          {expired && (
            <AlertTriangle className="w-4 h-4" />
          )}
          {formatExpiration(medication.expirationYear, medication.expirationMonth)}
        </div>

        {/* Delete/Undo button - visible when selected or pending delete */}
        {isSelected && isPendingDelete && onUndo && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUndo()
            }}
            className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:text-teal-400 dark:hover:bg-teal-950/30 transition-colors"
            title="Anulează"
          >
            <Undo2 className="w-4 h-4" />
          </button>
        )}
        {isSelected && !isPendingDelete && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/30 transition-colors"
            title="Șterge"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Substances shown when searching by substance OR when selected */}
      {(showSubstances || isSelected) && substancesWithNames.length > 0 && (
        <ul className="px-4 pb-3 space-y-1">
          {substancesWithNames.map(({ name, concentration }) => (
            <li
              key={name}
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              {highlightMatch(name, searchQuery)}{concentration && ` (${concentration})`}
            </li>
          ))}
        </ul>
      )}

      {/* "No active substances" message when selected */}
      {isSelected && substancesWithNames.length === 0 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">
            Fără substanțe active
          </p>
        </div>
      )}
    </div>
  )
}
