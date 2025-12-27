import { useState } from 'react'
import { Header } from './Header'

interface AppShellProps {
  children: React.ReactNode
  user?: {
    name: string
    avatarUrl?: string
  }
  onLogout?: () => void
  onSearch?: (query: string) => void
}

export function AppShell({ children, user, onLogout, onSearch }: AppShellProps) {
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
        onLogout={onLogout}
      />
      <main className="max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  )
}
