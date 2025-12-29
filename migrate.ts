import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { DATABASE_PATH } from '@/db/config'
import fs from 'fs'
import path from 'path'

console.log('Database path:', DATABASE_PATH)

// Ensure directory exists
const dbDir = path.dirname(DATABASE_PATH)
if (dbDir && dbDir !== '.' && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const sqlite = new Database(DATABASE_PATH)
const db = drizzle(sqlite)

console.log('Running migrations...')
migrate(db, { migrationsFolder: './drizzle' })
console.log('Migrations complete!')

sqlite.close()
