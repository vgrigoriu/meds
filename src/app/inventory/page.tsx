import { auth } from '@/auth'
import { getMedications, getActiveSubstances } from '@/db/queries'
import { InventoryClient } from './client'

export default async function InventoryPage() {
  const session = await auth()

  const user = session?.user
    ? {
        name: session.user.name ?? 'User',
        avatarUrl: session.user.image ?? undefined,
      }
    : undefined

  const medications = await getMedications()
  const activeSubstances = await getActiveSubstances()

  return (
    <InventoryClient
      user={user}
      medications={medications}
      activeSubstances={activeSubstances}
    />
  )
}
