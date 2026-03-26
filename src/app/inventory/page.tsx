import { auth } from '@/auth'
import { getMedications, getActiveSubstances } from '@/db/queries'
import { getFeedToken } from '@/db/settings'
import { InventoryClient } from './client'
import { redirect } from 'next/navigation'

export default async function InventoryPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const user = {
    name: session.user.name ?? 'User',
    avatarUrl: session.user.image ?? undefined,
  }

  const medications = await getMedications()
  const activeSubstances = await getActiveSubstances()
  const feedToken = await getFeedToken()

  return (
    <InventoryClient
      user={user}
      medications={medications}
      activeSubstances={activeSubstances}
      feedToken={feedToken}
    />
  )
}
