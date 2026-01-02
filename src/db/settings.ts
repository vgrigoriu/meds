import { randomBytes } from 'crypto'
import { eq } from 'drizzle-orm'
import { db } from '.'
import { settings } from './schema'

const FEED_TOKEN_KEY = 'feed_token'

export async function getFeedToken(): Promise<string> {
  const existing = await db
    .select()
    .from(settings)
    .where(eq(settings.key, FEED_TOKEN_KEY))
    .get()

  if (existing) {
    return existing.value
  }

  return regenerateFeedToken()
}

export async function regenerateFeedToken(): Promise<string> {
  const token = randomBytes(32).toString('hex')
  await db
    .insert(settings)
    .values({ key: FEED_TOKEN_KEY, value: token })
    .onConflictDoUpdate({ target: settings.key, set: { value: token } })
  return token
}

export async function isFeedTokenValid(token: string): Promise<boolean> {
  const stored = await db
    .select()
    .from(settings)
    .where(eq(settings.key, FEED_TOKEN_KEY))
    .get()

  return stored?.value === token
}
