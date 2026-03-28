import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { DATABASE_PATH } from '@/db/config'

const MIGRATIONS_FOLDER = './drizzle'
const MIGRATIONS_TABLE = '__drizzle_migrations'

interface JournalEntry {
  when: number
  tag: string
}

function ensureDatabaseDirectory() {
  const dbDir = path.dirname(DATABASE_PATH)
  if (dbDir && dbDir !== '.' && !fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
}

function readMigrationJournal(): JournalEntry[] {
  const journalPath = path.join(MIGRATIONS_FOLDER, 'meta', '_journal.json')

  if (!fs.existsSync(journalPath)) {
    throw new Error(`Can't find migration journal: ${journalPath}`)
  }

  const journal = JSON.parse(fs.readFileSync(journalPath, 'utf8')) as { entries?: JournalEntry[] }
  return journal.entries ?? []
}

function readMigrationFiles() {
  return readMigrationJournal().map((entry) => {
    const migrationPath = path.join(MIGRATIONS_FOLDER, `${entry.tag}.sql`)

    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Missing migration file: ${migrationPath}`)
    }

    return {
      tag: entry.tag,
      folderMillis: entry.when,
    }
  })
}

function getLastAppliedMigrationMillis(sqlite: Database.Database): number | null {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash text NOT NULL,
      created_at numeric
    )
  `)

  const row = sqlite
    .prepare(`SELECT created_at FROM ${MIGRATIONS_TABLE} ORDER BY created_at DESC LIMIT 1`)
    .get() as { created_at: number | null } | undefined

  return row?.created_at ?? null
}

function getPendingMigrationTags(sqlite: Database.Database): string[] {
  const migrations = readMigrationFiles()
  const lastAppliedMillis = getLastAppliedMigrationMillis(sqlite)

  return migrations
    .filter((migration) => lastAppliedMillis === null || migration.folderMillis > lastAppliedMillis)
    .map((migration) => migration.tag)
}

function formatTimestampForFilename(date: Date): string {
  return date.toISOString().replaceAll(':', '-')
}

export async function createDatabaseBackup(label = 'manual'): Promise<string> {
  if (!fs.existsSync(DATABASE_PATH)) {
    throw new Error(`Database file does not exist: ${DATABASE_PATH}`)
  }

  const backupPath = `${DATABASE_PATH}.${label}-${formatTimestampForFilename(new Date())}.bak`
  const source = new Database(DATABASE_PATH, { readonly: true })

  try {
    await source.backup(backupPath)
    return backupPath
  } finally {
    source.close()
  }
}

export interface MigrationRunResult {
  pendingMigrationTags: string[]
  backupPath: string | null
  applied: boolean
}

export async function runMigrationsWithBackup(): Promise<MigrationRunResult> {
  console.log('Database path:', DATABASE_PATH)
  ensureDatabaseDirectory()
  const databaseExistedBeforeOpen = fs.existsSync(DATABASE_PATH)

  const inspectionDb = new Database(DATABASE_PATH)
  let pendingMigrationTags: string[]

  try {
    pendingMigrationTags = getPendingMigrationTags(inspectionDb)
  } finally {
    inspectionDb.close()
  }

  if (pendingMigrationTags.length === 0) {
    console.log('No pending migrations.')
    return {
      pendingMigrationTags,
      backupPath: null,
      applied: false,
    }
  }

  console.log(`Pending migrations: ${pendingMigrationTags.join(', ')}`)

  let backupPath: string | null = null
  if (databaseExistedBeforeOpen) {
    console.log('Creating pre-migration backup...')
    backupPath = await createDatabaseBackup('pre-migrate')
    console.log(`Backup created: ${backupPath}`)
  } else {
    console.log('No existing database file found; skipping pre-migration backup.')
  }

  const sqlite = new Database(DATABASE_PATH)

  try {
    const db = drizzle(sqlite)

    try {
      console.log('Running migrations...')
      migrate(db, { migrationsFolder: MIGRATIONS_FOLDER })
      console.log('Migrations complete!')
    } catch (error) {
      console.error('Migration failed.')
      if (backupPath) {
        console.error(`Rollback with: npm run db:rollback -- ${backupPath}`)
      }
      throw error
    }

    return {
      pendingMigrationTags,
      backupPath,
      applied: true,
    }
  } finally {
    sqlite.close()
  }
}
