'use client'

interface FooterProps {
  feedUrl?: string
}

export function Footer({ feedUrl }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-center">
        {feedUrl && (
          <a
            href={feedUrl}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            Atom
          </a>
        )}
      </div>
    </footer>
  )
}
