import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { DATABASE_PATH } from '@/db/config'

function usage() {
  console.error('Usage: npm run db:import -- <sqlite-backup-file> [--force]')
}

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const sourceArg = args.find((arg) => !arg.startsWith('--'))

  if (!sourceArg) {
    usage()
    process.exit(1)
  }

  const sourcePath = path.resolve(sourceArg)

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Import file does not exist: ${sourcePath}`)
  }

  const destinationDir = path.dirname(DATABASE_PATH)
  if (destinationDir && destinationDir !== '.') {
    fs.mkdirSync(destinationDir, { recursive: true })
  }

  if (fs.existsSync(DATABASE_PATH) && !force) {
    throw new Error(
      `Destination database already exists: ${DATABASE_PATH}. Re-run with --force after stopping the app.`
    )
  }

  if (fs.existsSync(DATABASE_PATH) && force) {
    const backupPath = `${DATABASE_PATH}.before-import-${new Date().toISOString().replaceAll(':', '-')}.bak`
    fs.copyFileSync(DATABASE_PATH, backupPath)
    console.log(`Saved rollback copy to ${backupPath}`)
  }

  const source = new Database(sourcePath, { readonly: true })

  try {
    console.log(`Importing ${sourcePath} into ${DATABASE_PATH}...`)
    await source.backup(DATABASE_PATH)
    console.log(`Import complete: ${DATABASE_PATH}`)
  } finally {
    source.close()
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
