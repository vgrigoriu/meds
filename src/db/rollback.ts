import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { DATABASE_PATH } from '@/db/config'

function usage() {
  console.error('Usage: npm run db:rollback -- <sqlite-backup-file>')
}

async function main() {
  const sourceArg = process.argv[2]

  if (!sourceArg) {
    usage()
    process.exit(1)
  }

  const sourcePath = path.resolve(sourceArg)

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Rollback file does not exist: ${sourcePath}`)
  }

  const destinationDir = path.dirname(DATABASE_PATH)
  if (destinationDir && destinationDir !== '.') {
    fs.mkdirSync(destinationDir, { recursive: true })
  }

  if (fs.existsSync(DATABASE_PATH)) {
    const rollbackSafetyCopy = `${DATABASE_PATH}.before-rollback-${new Date().toISOString().replaceAll(':', '-')}.bak`
    fs.copyFileSync(DATABASE_PATH, rollbackSafetyCopy)
    console.log(`Saved current database to ${rollbackSafetyCopy}`)
  }

  const source = new Database(sourcePath, { readonly: true })

  try {
    console.log(`Restoring ${sourcePath} to ${DATABASE_PATH}...`)
    await source.backup(DATABASE_PATH)
    console.log('Rollback complete.')
  } finally {
    source.close()
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
