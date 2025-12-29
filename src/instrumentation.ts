export async function register() {
  // Only run migrations on Node.js runtime (not Edge)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { migrate } = await import('drizzle-orm/better-sqlite3/migrator')
    const { db } = await import('@/db')

    console.log('Running database migrations...')
    migrate(db, { migrationsFolder: './drizzle' })
    console.log('Migrations complete!')
  }
}
