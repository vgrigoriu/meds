'use client'

import type { Medication } from '@/types'
import type { MedicationMatcher, MatchResult } from '@/lib/search'
import { PresentationIcon } from './PresentationIcon'
import { AlertTriangle, Trash2, Undo2 } from 'lucide-react'

interface MedicationRowProps {
  medication: Medication
  matcher: MedicationMatcher
  isSelected?: boolean
  isPendingDelete?: boolean
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

function renderWithHighlights(text: string, match: MatchResult | null): React.ReactNode {
  if (!match || match.spans.length === 0) return text

  const result: React.ReactNode[] = []
  let lastEnd = 0

  for (const span of match.spans) {
    if (span.start > lastEnd) {
      result.push(text.slice(lastEnd, span.start))
    }
    result.push(
      <mark key={span.start} className="bg-amber-100 dark:bg-amber-900/50 rounded px-0.5">
        {text.slice(span.start, span.start + span.length)}
      </mark>
    )
    lastEnd = span.start + span.length
  }

  if (lastEnd < text.length) {
    result.push(text.slice(lastEnd))
  }

  return <>{result}</>
}

export function MedicationRow({
  medication,
  matcher,
  isSelected = false,
  isPendingDelete = false,
  onSelect,
  onDelete,
  onUndo,
}: MedicationRowProps) {
  const expired = isExpired(medication.expirationYear, medication.expirationMonth)
  const substances = matcher.getSubstances()
  const showSubstances = matcher.hasSubstanceMatch() || isSelected

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
      {showSubstances && substances.length > 0 && (
        <ul className="px-4 pb-3 space-y-1">
          {substances.map(({ name, concentration, match }) => (
            <li
              key={name}
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              {renderWithHighlights(name, match)}{concentration && ` (${concentration})`}
            </li>
          ))}
        </ul>
      )}

      {/* "No active substances" message when selected */}
      {isSelected && substances.length === 0 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">
            Fără substanțe active
          </p>
        </div>
      )}
    </div>
  )
}
