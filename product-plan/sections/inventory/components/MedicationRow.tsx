import { Pencil, Trash2 } from 'lucide-react'
import type { Medication, ActiveSubstance } from '../types'
import { PresentationIcon } from './PresentationIcon'

interface MedicationRowProps {
  medication: Medication
  activeSubstances: ActiveSubstance[]
  isSelected?: boolean
  isExpired?: boolean
  showSubstances?: boolean
  onSelect?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function isExpiredDate(dateString: string): boolean {
  return new Date(dateString) < new Date()
}

export function MedicationRow({
  medication,
  activeSubstances,
  isSelected = false,
  showSubstances = false,
  onSelect,
  onEdit,
  onDelete,
}: MedicationRowProps) {
  const expired = isExpiredDate(medication.expirationDate)
  const substanceNames = medication.activeSubstanceIds
    .map((id) => activeSubstances.find((s) => s.id === id)?.name)
    .filter(Boolean)

  return (
    <div
      onClick={onSelect}
      className={`
        group cursor-pointer transition-all duration-200 ease-out
        border-b border-slate-100 dark:border-slate-800
        ${isSelected
          ? 'bg-teal-50 dark:bg-teal-950/30'
          : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
        }
        ${expired ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}
      `}
    >
      {/* Main row content */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Presentation icon */}
        <div className={`
          flex-shrink-0 p-2 rounded-lg
          ${expired
            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
          }
        `}>
          <PresentationIcon presentation={medication.presentation} />
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <p className={`
            font-medium truncate
            ${expired
              ? 'text-amber-900 dark:text-amber-200'
              : 'text-slate-900 dark:text-slate-100'
            }
          `}>
            {medication.name}
          </p>
        </div>

        {/* Expiration date */}
        <div className={`
          flex-shrink-0 text-sm font-medium
          ${expired
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-slate-500 dark:text-slate-400'
          }
        `}>
          {expired && (
            <span className="mr-1 text-xs uppercase tracking-wide">Expired</span>
          )}
          {formatDate(medication.expirationDate)}
        </div>
      </div>

      {/* Expanded content when selected */}
      {isSelected && (
        <div className="px-4 pb-3 animate-in slide-in-from-top-2 duration-200">
          {/* Active substances */}
          {(showSubstances || substanceNames.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {substanceNames.length > 0 ? (
                substanceNames.map((name) => (
                  <span
                    key={name}
                    className="px-2 py-0.5 text-xs font-medium rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
                  >
                    {name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                  No active substances
                </span>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.()
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
                bg-slate-100 text-slate-700 hover:bg-slate-200
                dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700
                transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.()
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
                bg-red-50 text-red-600 hover:bg-red-100
                dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50
                transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
