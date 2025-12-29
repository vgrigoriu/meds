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

## Database Migrations

Generate a new migration after changing `src/db/schema.ts`:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

## Gotchas

- **OAuth setup**: Google allows multiple redirect URLs in a single OAuth app,
  so you can use the same credentials for local development and production.
  GitHub only allows one callback URL per app, so you need separate OAuth apps
  for dev and prod.
