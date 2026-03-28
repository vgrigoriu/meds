# Meds

A medication inventory tracker. Keep track of your medications, their active
substances, and expiration dates.

**Live:** <https://meds.fly.dev/>

Built with Next.js, SQLite (better-sqlite3), and Drizzle ORM.

## Run Locally

```bash
cp .env.example .env.local
# Fill in the values in .env.local
npm install
npm run db:migrate
npm run dev
```

Open <http://localhost:3000>

## Deploy to Fly.io

First-time setup:

```bash
fly launch
fly secrets set AUTH_SECRET=$(openssl rand -base64 32)
fly secrets set AUTH_GOOGLE_ID=your-google-client-id
fly secrets set AUTH_GOOGLE_SECRET=your-google-client-secret
fly secrets set AUTH_GITHUB_ID=your-github-client-id
fly secrets set AUTH_GITHUB_SECRET=your-github-client-secret
```

Deploy:

```bash
fly deploy
```

## Export / Import SQLite Data

Export the current database to a portable SQLite backup file:

```bash
npm run db:export -- ./meds-export.db
```

Import a backup file into the database configured by `DATABASE_PATH`:

```bash
npm run db:import -- ./meds-export.db
```

Use `--force` to replace an existing database after stopping the app. A
timestamped rollback copy is created automatically.

## Deploy on a Raspberry Pi

See the full migration and Raspberry Pi deployment guide:

- [docs/raspberry-pi.md](/Users/grigoriu/src/github.com/vgrigoriu/meds/docs/raspberry-pi.md)

For ongoing deploys on the Pi:

```bash
cd /home/victor/projects/meds
jj git fetch
jj rebase -d main
npm ci
npm run build
systemctl --user restart meds.service
```

Because migrations run on startup, schema changes are applied when the service
restarts.

## Database Migrations

Generate a new migration after changing `src/db/schema.ts`:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

If there are pending migrations and the database file already exists, the app
creates a timestamped `*.pre-migrate-*.bak` backup before applying them. If
there are no pending migrations, it skips backup creation.

To roll back manually on the server, stop the app and restore a backup:

```bash
npm run db:rollback -- /path/to/meds.db.pre-migrate-2026-03-28T12-34-56.000Z.bak
```

The rollback command also saves the current database to a
`*.before-rollback-*.bak` file before replacing it.

## Gotchas

- **OAuth setup**: Google allows multiple redirect URLs in a single OAuth app,
  so you can use the same credentials for local development and production.
  GitHub only allows one callback URL per app, so you need separate OAuth apps
  for dev and prod.
