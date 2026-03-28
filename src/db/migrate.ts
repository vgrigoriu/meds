// Run migrations locally without restarting the app.
// In production, migrations run automatically on server startup via instrumentation.ts.

import { runMigrationsWithBackup } from '@/db/migration-runner'

runMigrationsWithBackup().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
