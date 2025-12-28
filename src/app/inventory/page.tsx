import { auth } from '@/auth'
import { InventoryClient } from './client'

export default async function InventoryPage() {
  const session = await auth()

  const user = session?.user
    ? {
        name: session.user.name ?? 'User',
        avatarUrl: session.user.image ?? undefined,
      }
    : undefined

  return <InventoryClient user={user} />
}
