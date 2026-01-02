'use client'

import { useState } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface AppShellProps {
  children: React.ReactNode
  user?: {
    name: string
    avatarUrl?: string
  }
  feedUrl?: string
  onLogout?: () => void
  onSearch?: (query: string) => void
  onNavigateToList?: () => void
}

export function AppShell({ children, user, feedUrl, onLogout, onSearch, onNavigateToList }: AppShellProps) {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearch?.(value)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header
        user={user}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onNavigateToList={onNavigateToList}
        onLogout={onLogout}
      />
      <main className="max-w-6xl mx-auto">
        {children}
      </main>
      <Footer feedUrl={feedUrl} />
    </div>
  )
}
