export async function register() {
  // Only run migrations on Node.js runtime (not Edge)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { runMigrationsWithBackup } = await import('@/db/migration-runner')
    await runMigrationsWithBackup()
  }
}
