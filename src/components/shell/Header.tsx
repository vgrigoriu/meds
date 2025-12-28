'use client'

import { UserMenu } from './UserMenu'
import { SearchBar } from './SearchBar'
import { Logo } from '@/components/Logo'

interface HeaderProps {
  user?: {
    name: string
    avatarUrl?: string
  }
  searchValue: string
  onSearchChange: (value: string) => void
  onLogout?: () => void
}

export function Header({ user, searchValue, onSearchChange, onLogout }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      {/* Desktop: single row */}
      <div className="hidden sm:flex items-center gap-4 px-4 py-3 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 shrink-0">
          <Logo size="sm" />
          <h1 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">
            Meds
          </h1>
        </div>
        <div className="flex-1 max-w-md mx-auto">
          <SearchBar value={searchValue} onChange={onSearchChange} />
        </div>
        {user && <UserMenu user={user} onLogout={onLogout} />}
      </div>

      {/* Mobile: two rows */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <h1 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">
              Meds
            </h1>
          </div>
          {user && <UserMenu user={user} onLogout={onLogout} />}
        </div>
        <div className="px-4 pb-3">
          <SearchBar value={searchValue} onChange={onSearchChange} />
        </div>
      </div>
    </header>
  )
}
