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
  onNavigateToList?: () => void
  onLogout?: () => void
}

export function Header({ user, searchValue, onSearchChange, onNavigateToList, onLogout }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <style>{`
        .header-grid {
          display: grid;
          grid-template-areas:
            "logo user"
            "search search";
          grid-template-columns: auto 1fr;
          gap: 0.75rem 1rem;
          align-items: center;
        }
        .header-grid .logo { grid-area: logo; }
        .header-grid .search { grid-area: search; max-width: 28rem; margin: 0 auto; width: 100%; }
        .header-grid .user { grid-area: user; justify-self: end; }

        @media (min-width: 640px) {
          .header-grid {
            grid-template-areas: "logo search user";
            grid-template-columns: auto 1fr auto;
          }
          .header-grid .search { margin: 0 auto; }
        }
      `}</style>
      <div className="header-grid max-w-6xl mx-auto px-4 py-3">
        <div className="logo flex items-center gap-2">
          <Logo size="sm" />
          <h1 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">
            Meds
          </h1>
        </div>
        <div className="search">
          <SearchBar value={searchValue} onChange={onSearchChange} onNavigateToList={onNavigateToList} />
        </div>
        {user && <div className="user"><UserMenu user={user} onLogout={onLogout} /></div>}
      </div>
    </header>
  )
}
