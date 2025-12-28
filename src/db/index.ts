import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { DATABASE_PATH } from './config'

const sqlite = new Database(DATABASE_PATH)
export const db = drizzle(sqlite, { schema })
