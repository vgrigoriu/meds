import { defineConfig } from 'drizzle-kit'
import { DATABASE_PATH } from './src/db/config'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: DATABASE_PATH,
  },
})
