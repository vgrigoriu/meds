const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || 'meds.db';
console.log('Database path:', dbPath);

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (dbDir && dbDir !== '.' && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Create migrations table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS __drizzle_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL
  )
`);

// Get already applied migrations
const applied = new Set(
  db.prepare('SELECT hash FROM __drizzle_migrations').all().map(r => r.hash)
);

// Read and apply migrations
const migrationsDir = path.join(__dirname, 'drizzle');
const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

for (const file of files) {
  const hash = file;

  if (applied.has(hash)) {
    console.log(`Skipping already applied: ${file}`);
    continue;
  }

  console.log(`Applying migration: ${file}`);
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

  // Split by statement breakpoint and execute each statement
  const statements = sql.split('--> statement-breakpoint');

  db.transaction(() => {
    for (const stmt of statements) {
      const trimmed = stmt.trim();
      if (trimmed) {
        db.exec(trimmed);
      }
    }

    // Record migration
    db.prepare('INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)')
      .run(hash, Date.now());
  })();

  console.log(`Applied: ${file}`);
}

console.log('Migrations complete!');
db.close();
