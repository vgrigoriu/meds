'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { AppShell } from '@/components/shell'
import { InventoryList, SortOption } from '@/components/inventory'
import type { Medication, ActiveSubstance } from '@/types'

interface InventoryClientProps {
  user?: {
    name: string
    avatarUrl?: string
  }
  medications: Medication[]
  activeSubstances: ActiveSubstance[]
}

export function InventoryClient({
  user,
  medications,
  activeSubstances,
}: InventoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('expiration')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleLogout = () => {
    signOut({ callbackUrl: '/login?signedOut=true' })
  }

  return (
    <AppShell user={user} onLogout={handleLogout} onSearch={setSearchQuery}>
      <InventoryList
        medications={medications}
        activeSubstances={activeSubstances}
        searchQuery={searchQuery}
        sortBy={sortBy}
        selectedId={selectedId}
        onSortChange={setSortBy}
        onSelect={setSelectedId}
      />
    </AppShell>
  )
}
