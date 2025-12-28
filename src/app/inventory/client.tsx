'use client'

import { signOut } from 'next-auth/react'
import { AppShell } from '@/components/shell'

interface InventoryClientProps {
  user?: {
    name: string
    avatarUrl?: string
  }
}

export function InventoryClient({ user }: InventoryClientProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: '/login?signedOut=true' })
  }

  const handleSearch = (query: string) => {
    console.log('Search:', query)
  }

  return (
    <AppShell user={user} onLogout={handleLogout} onSearch={handleSearch}>
      <div className="p-6">
        <h2 className="font-heading text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Medication Inventory
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Your medications will appear here. This page will be populated in the Inventory milestone.
        </p>
      </div>
    </AppShell>
  )
}
