'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { presentationLabels, type ActiveSubstance, type Presentation } from '@/types'
import { SubstanceAutocomplete } from './SubstanceAutocomplete'
import { addMedication } from '@/app/inventory/actions'

interface AddMedicationFormProps {
  activeSubstances: ActiveSubstance[]
  onCancel: () => void
  onSuccess: (medicationId: number) => void
}

interface SubstanceEntry {
  name: string
  concentration: string
}

const presentationOptions = (Object.entries(presentationLabels) as [Presentation, string][]).map(
  ([value, label]) => ({ value, label })
)

const monthOptions = [
  { value: 1, label: 'Ianuarie' },
  { value: 2, label: 'Februarie' },
  { value: 3, label: 'Martie' },
  { value: 4, label: 'Aprilie' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Iunie' },
  { value: 7, label: 'Iulie' },
  { value: 8, label: 'August' },
  { value: 9, label: 'Septembrie' },
  { value: 10, label: 'Octombrie' },
  { value: 11, label: 'Noiembrie' },
  { value: 12, label: 'Decembrie' },
]

export function AddMedicationForm({
  activeSubstances,
  onCancel,
  onSuccess,
}: AddMedicationFormProps) {
  const [name, setName] = useState('')
  const [presentation, setPresentation] = useState<Presentation>('pill')
  const [expirationMonth, setExpirationMonth] = useState('')
  const [expirationYear, setExpirationYear] = useState('')
  const [substances, setSubstances] = useState<SubstanceEntry[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter out already-added substances from autocomplete
  const availableSubstances = activeSubstances.filter(
    (s) => !substances.some((added) => added.name.toLowerCase() === s.name.toLowerCase())
  )

  function handleAddSubstance(substanceName: string) {
    if (!substances.some((s) => s.name.toLowerCase() === substanceName.toLowerCase())) {
      setSubstances([...substances, { name: substanceName, concentration: '' }])
    }
  }

  function handleRemoveSubstance(index: number) {
    setSubstances(substances.filter((_, i) => i !== index))
  }

  function handleConcentrationChange(index: number, value: string) {
    setSubstances(
      substances.map((s, i) => (i === index ? { ...s, concentration: value } : s))
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const result = await addMedication({
      name,
      presentation,
      expirationYear: parseInt(expirationYear, 10),
      expirationMonth: parseInt(expirationMonth, 10),
      substances: substances.map((s) => ({
        name: s.name,
        concentration: s.concentration || null,
      })),
    })

    setIsSubmitting(false)

    if (result.success && result.medicationId) {
      onSuccess(result.medicationId)
    } else {
      setError(result.error || 'A apărut o eroare')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4"
    >
      <div className="space-y-4 max-w-md">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Nume
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 text-base bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 outline-none"
          />
        </div>

        {/* Presentation */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Formă
          </label>
          <select
            value={presentation}
            onChange={(e) => setPresentation(e.target.value as Presentation)}
            className="w-full px-3 py-2 text-base bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 outline-none"
          >
            {presentationOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Expiration */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Data expirării
          </label>
          <div className="flex gap-2">
            <select
              value={expirationMonth}
              onChange={(e) => setExpirationMonth(e.target.value)}
              required
              className="px-3 py-2 text-base bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 outline-none"
            >
              <option value="">Luna</option>
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={expirationYear}
              onChange={(e) => setExpirationYear(e.target.value)}
              placeholder="Anul"
              min="2000"
              max="2100"
              required
              className="w-28 px-3 py-2 text-base bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 outline-none"
            />
          </div>
        </div>

        {/* Active Substances */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Substanțe active
          </label>

          {/* Added substances */}
          {substances.length > 0 && (
            <div className="space-y-2 mb-2">
              {substances.map((substance, index) => (
                <div key={substance.name} className="flex items-center gap-2">
                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                    {substance.name}
                  </span>
                  <input
                    type="text"
                    value={substance.concentration}
                    onChange={(e) => handleConcentrationChange(index, e.target.value)}
                    placeholder="Concentrație"
                    className="w-32 px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:border-teal-500 dark:focus:border-teal-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSubstance(index)}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Autocomplete */}
          <SubstanceAutocomplete
            substances={availableSubstances}
            onSelect={handleAddSubstance}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 disabled:opacity-50 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Se salvează...' : 'Salvează'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Anulează
          </button>
        </div>
      </div>
    </form>
  )
}
