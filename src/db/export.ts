import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { DATABASE_PATH } from '@/db/config'

function resolveOutputPath(arg?: string) {
  if (arg) {
    return path.resolve(arg)
  }

  const timestamp = new Date().toISOString().replaceAll(':', '-')
  return path.resolve(`meds-export-${timestamp}.db`)
}

async function main() {
  const outputPath = resolveOutputPath(process.argv[2])
  const outputDir = path.dirname(outputPath)

  if (!fs.existsSync(DATABASE_PATH)) {
    throw new Error(`Database file does not exist: ${DATABASE_PATH}`)
  }

  fs.mkdirSync(outputDir, { recursive: true })

  const source = new Database(DATABASE_PATH, { readonly: true })

  try {
    console.log(`Exporting ${DATABASE_PATH} to ${outputPath}...`)
    await source.backup(outputPath)
    console.log(`Export complete: ${outputPath}`)
  } finally {
    source.close()
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
