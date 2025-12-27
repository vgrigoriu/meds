import { Package, Plus } from 'lucide-react'

interface EmptyStateProps {
  onAdd?: () => void
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600" />
        </div>
        {/* Decorative pills */}
        <div className="absolute -top-2 -right-2 w-6 h-3 rounded-full bg-teal-200 dark:bg-teal-800 transform rotate-45" />
        <div className="absolute -bottom-1 -left-3 w-5 h-2.5 rounded-full bg-amber-200 dark:bg-amber-800 transform -rotate-12" />
        <div className="absolute top-1/2 -right-4 w-4 h-2 rounded-full bg-slate-200 dark:bg-slate-700 transform rotate-12" />
      </div>

      {/* Message */}
      <h3 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        Your medicine cabinet is empty
      </h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
        Start tracking your medications by adding your first item. You'll never lose track of expiration dates again.
      </p>

      {/* CTA */}
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
          bg-teal-500 text-white font-medium
          hover:bg-teal-600 active:bg-teal-700
          transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add your first medication
      </button>
    </div>
  )
}
