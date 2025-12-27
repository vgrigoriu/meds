import { useState } from 'react'
import { Plus, X, Check } from 'lucide-react'
import type { Medication, Presentation, ActiveSubstance } from '../types'
import { PresentationIcon } from './PresentationIcon'

interface AddMedicationRowProps {
  activeSubstances: ActiveSubstance[]
  onAdd?: (medication: Omit<Medication, 'id'>) => void
  onCancel?: () => void
}

const presentations: { value: Presentation; label: string }[] = [
  { value: 'pill', label: 'Pill' },
  { value: 'syrup', label: 'Syrup' },
  { value: 'nasal-spray', label: 'Nasal Spray' },
  { value: 'cream', label: 'Cream' },
  { value: 'drops', label: 'Drops' },
  { value: 'bandage', label: 'Bandage' },
]

export function AddMedicationRow({
  activeSubstances,
  onAdd,
  onCancel,
}: AddMedicationRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [name, setName] = useState('')
  const [presentation, setPresentation] = useState<Presentation>('pill')
  const [expirationDate, setExpirationDate] = useState('')
  const [selectedSubstanceIds, setSelectedSubstanceIds] = useState<string[]>([])
  const [substanceSearch, setSubstanceSearch] = useState('')

  const filteredSubstances = activeSubstances.filter(
    (s) =>
      s.name.toLowerCase().includes(substanceSearch.toLowerCase()) &&
      !selectedSubstanceIds.includes(s.id)
  )

  const handleSubmit = () => {
    if (!name.trim() || !expirationDate) return

    onAdd?.({
      name: name.trim(),
      presentation,
      expirationDate,
      activeSubstanceIds: selectedSubstanceIds,
    })

    // Reset form
    setName('')
    setPresentation('pill')
    setExpirationDate('')
    setSelectedSubstanceIds([])
    setSubstanceSearch('')
    setIsExpanded(false)
  }

  const handleCancel = () => {
    setName('')
    setPresentation('pill')
    setExpirationDate('')
    setSelectedSubstanceIds([])
    setSubstanceSearch('')
    setIsExpanded(false)
    onCancel?.()
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left
          border-b-2 border-dashed border-slate-200 dark:border-slate-700
          text-slate-500 dark:text-slate-400
          hover:bg-teal-50 hover:text-teal-600 hover:border-teal-300
          dark:hover:bg-teal-950/30 dark:hover:text-teal-400 dark:hover:border-teal-700
          transition-colors"
      >
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
          <Plus className="w-5 h-5" />
        </div>
        <span className="font-medium">Add medication</span>
      </button>
    )
  }

  return (
    <div className="border-b-2 border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-950/20 animate-in slide-in-from-top-2 duration-200">
      <div className="p-4 space-y-4">
        {/* Name and presentation row */}
        <div className="flex gap-3">
          {/* Presentation selector */}
          <div className="relative">
            <select
              value={presentation}
              onChange={(e) => setPresentation(e.target.value as Presentation)}
              className="appearance-none pl-10 pr-4 py-2 rounded-lg
                bg-white dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                text-slate-900 dark:text-slate-100
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                cursor-pointer"
            >
              {presentations.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <PresentationIcon presentation={presentation} className="w-4 h-4" />
            </div>
          </div>

          {/* Name input */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Medication name"
            autoFocus
            className="flex-1 px-3 py-2 rounded-lg
              bg-white dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              text-slate-900 dark:text-slate-100
              placeholder-slate-400 dark:placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />

          {/* Expiration date */}
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="px-3 py-2 rounded-lg
              bg-white dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              text-slate-900 dark:text-slate-100
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Active substances */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Active substances (optional)
          </label>

          {/* Selected substances */}
          {selectedSubstanceIds.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedSubstanceIds.map((id) => {
                const substance = activeSubstances.find((s) => s.id === id)
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full
                      bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
                  >
                    {substance?.name}
                    <button
                      onClick={() =>
                        setSelectedSubstanceIds((ids) => ids.filter((i) => i !== id))
                      }
                      className="hover:text-teal-900 dark:hover:text-teal-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )
              })}
            </div>
          )}

          {/* Substance search/autocomplete */}
          <input
            type="text"
            value={substanceSearch}
            onChange={(e) => setSubstanceSearch(e.target.value)}
            placeholder="Search or add substance..."
            className="w-full px-3 py-2 rounded-lg
              bg-white dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              text-slate-900 dark:text-slate-100
              placeholder-slate-400 dark:placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />

          {/* Autocomplete dropdown */}
          {substanceSearch && filteredSubstances.length > 0 && (
            <div className="mt-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
              {filteredSubstances.slice(0, 5).map((substance) => (
                <button
                  key={substance.id}
                  onClick={() => {
                    setSelectedSubstanceIds((ids) => [...ids, substance.id])
                    setSubstanceSearch('')
                  }}
                  className="w-full px-3 py-2 text-left text-sm
                    hover:bg-teal-50 dark:hover:bg-teal-950/30
                    text-slate-700 dark:text-slate-300"
                >
                  {substance.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
              text-slate-600 hover:bg-slate-100
              dark:text-slate-400 dark:hover:bg-slate-800
              transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !expirationDate}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg
              bg-teal-500 text-white hover:bg-teal-600
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors"
          >
            <Check className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
