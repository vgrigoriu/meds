'use client'

import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/shell'

// Mock user for foundation phase
const mockUser = {
  name: 'Demo User',
}

export default function InventoryPage() {
  const router = useRouter()

  const handleLogout = () => {
    // Fake logout for foundation phase - navigates to login
    // Will be replaced with real session clearing in Users milestone
    router.push('/login')
  }

  const handleSearch = (query: string) => {
    console.log('Search:', query)
  }

  return (
    <AppShell user={mockUser} onLogout={handleLogout} onSearch={handleSearch}>
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
