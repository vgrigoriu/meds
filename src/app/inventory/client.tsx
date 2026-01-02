'use client'

import { useState, useRef } from 'react'
import { signOut } from 'next-auth/react'
import { AppShell } from '@/components/shell'
import { InventoryList, SortOption, InventoryListHandle } from '@/components/inventory'
import { UndoToast } from '@/components/inventory/UndoToast'
import { deleteMedication } from './actions'
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
  const [pendingDelete, setPendingDelete] = useState<{ id: number; name: string } | null>(null)
  const inventoryListRef = useRef<InventoryListHandle>(null)

  const handleNavigateToList = () => {
    inventoryListRef.current?.selectFirst()
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/login?signedOut=true' })
  }

  const handleDelete = (id: number) => {
    const medication = medications.find((m) => m.id === id)
    if (!medication) return

    // Mark as pending delete (show strikethrough), keep it selected
    setPendingDelete({ id, name: medication.name })
  }

  const handleUndo = () => {
    // Just clear pending delete - medication was never actually deleted
    if (pendingDelete) {
      setSelectedId(pendingDelete.id)
    }
    setPendingDelete(null)
  }

  const handleConfirmDelete = async () => {
    // Toast dismissed - now actually delete
    if (pendingDelete) {
      await deleteMedication(pendingDelete.id)
    }
    setPendingDelete(null)
  }

  return (
    <AppShell user={user} onLogout={handleLogout} onSearch={setSearchQuery} onNavigateToList={handleNavigateToList}>
      <InventoryList
        ref={inventoryListRef}
        medications={medications}
        activeSubstances={activeSubstances}
        searchQuery={searchQuery}
        sortBy={sortBy}
        selectedId={selectedId}
        pendingDeleteId={pendingDelete?.id}
        onSortChange={setSortBy}
        onSelect={setSelectedId}
        onDelete={handleDelete}
        onUndo={handleUndo}
      />
      {pendingDelete && (
        <UndoToast
          message={`${pendingDelete.name} va fi șters`}
          onUndo={handleUndo}
          onDismiss={handleConfirmDelete}
        />
      )}
    </AppShell>
  )
}
