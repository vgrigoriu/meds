# Raspberry Pi Migration

This guide covers:

1. Exporting the SQLite database from the current Fly.io deployment
2. Importing that database onto a Raspberry Pi
3. Running the app on the Pi

## 1. Export the Database from Fly.io

The app stores SQLite at `/data/meds.db` on Fly.io, which matches the mounted
volume configured in [fly.toml](/Users/grigoriu/src/github.com/vgrigoriu/meds/fly.toml).

Create a consistent SQLite backup inside the running machine:

```bash
fly ssh console -a meds -C "sh -lc \"cd /app && node -e \\\"const Database=require('better-sqlite3'); const db=new Database('/data/meds.db', { readonly: true }); db.backup('/tmp/meds-export.db').then(() => db.close())\\\"\""
```

Download the exported file to your local machine using Fly's SFTP shell:

```bash
fly ssh sftp shell -a meds
get /tmp/meds-export.db ./meds-export.db
bye
```

If you want to inspect the data before migrating, keep `meds-export.db` as your
portable backup artifact.

Copy the exported database from your local machine to the Raspberry Pi:

```bash
scp ./meds-export.db victor@<raspberry-pi-host>:/home/victor/.local/share/meds/meds-export.db
```

## 2. Prepare the Raspberry Pi

These steps assume Raspberry Pi OS 64-bit and a public hostname that will point
to your Cloudflare Tunnel at `meds.grigoriii.org`.

Install Node.js 20 and build tools:

```bash
mkdir -p /tmp/nodesource
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key -o /tmp/nodesource/nodesource.gpg.key
sudo mkdir -p /etc/apt/keyrings
sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg /tmp/nodesource/nodesource.gpg.key
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list >/dev/null
sudo apt-get update
sudo apt-get install -y nodejs build-essential
```

`build-essential` is included because `better-sqlite3` may need to compile a
native addon during `npm ci` if a matching prebuilt binary is not available for
your Pi's Node.js and CPU combination.

Set up XDG directories for the `victor` user:

```bash
mkdir -p /home/victor/.config/meds
mkdir -p /home/victor/.local/share/meds
mkdir -p /home/victor/.local/state/meds
mkdir -p /home/victor/projects
git clone <your-repo-url> /home/victor/projects/meds
cd /home/victor/projects/meds
npm ci
npm run build
```

Create a production env file:

```bash
cp .env.example /home/victor/.config/meds/meds.env
```

Set at least these values:

```dotenv
AUTH_SECRET=generate-a-new-secret
AUTH_TRUST_HOST=true
AUTH_URL=https://meds.grigoriii.org
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
ALLOWED_EMAILS=you@example.com
DATABASE_PATH=/home/victor/.local/share/meds/meds.db
```

Notes:

- Generate `AUTH_SECRET` with `openssl rand -base64 32`.
- Update Google and GitHub OAuth callback URLs to `https://meds.grigoriii.org/api/auth/callback/google`
  and `https://meds.grigoriii.org/api/auth/callback/github`.
- The app runs migrations automatically on startup in
  [src/instrumentation.ts](/Users/grigoriu/src/github.com/vgrigoriu/meds/src/instrumentation.ts).
- This layout keeps config in `~/.config/meds`, persistent app data in
  `~/.local/share/meds`, and service state/log files in `~/.local/state/meds`.

### OAuth Provider Updates

For Google, you can usually reuse the existing OAuth app:

1. Open the Google Cloud Console credentials page for your OAuth client.
2. Add `https://meds.grigoriii.org` to Authorized JavaScript origins.
3. Add `https://meds.grigoriii.org/api/auth/callback/google` to Authorized redirect URIs.
4. Keep the existing client ID and secret, then place them in
   `/home/victor/.config/meds/meds.env`.

For GitHub, create a separate OAuth app for the Raspberry Pi deployment:

1. Open [GitHub Developer Settings](https://github.com/settings/developers).
2. Create a new OAuth App.
3. Set Homepage URL to `https://meds.grigoriii.org`.
4. Set Authorization callback URL to
   `https://meds.grigoriii.org/api/auth/callback/github`.
5. Copy the new client ID and client secret into
   `/home/victor/.config/meds/meds.env` as `AUTH_GITHUB_ID` and
   `AUTH_GITHUB_SECRET`.

## 3. Import the Database on the Pi

Copy `meds-export.db` to the Pi, then import it:

```bash
cd /home/victor/projects/meds
set -a
source /home/victor/.config/meds/meds.env
set +a
npm run db:import -- /home/victor/.local/share/meds/meds-export.db
```

If `/home/victor/.local/share/meds/meds.db` already exists and you intentionally want to
replace it, stop the app first and run:

```bash
npm run db:import -- /home/victor/.local/share/meds/meds-export.db --force
```

`--force` keeps a timestamped rollback copy next to the existing database
before overwriting it.

## 4. Run the App as a User systemd Service

Create `~/.config/systemd/user/meds.service`:

```ini
[Unit]
Description=Meds app
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/victor/projects/meds
EnvironmentFile=/home/victor/.config/meds/meds.env
Environment=NODE_ENV=production
Environment=PORT=4000
Environment=HOSTNAME=0.0.0.0
Environment=XDG_CONFIG_HOME=/home/victor/.config
Environment=XDG_DATA_HOME=/home/victor/.local/share
Environment=XDG_STATE_HOME=/home/victor/.local/state
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=5
StandardOutput=append:/home/victor/.local/state/meds/app.log
StandardError=append:/home/victor/.local/state/meds/app.log

[Install]
WantedBy=default.target
```

Then enable the service:

```bash
mkdir -p /home/victor/.config/systemd/user
$EDITOR /home/victor/.config/systemd/user/meds.service
systemctl --user daemon-reload
systemctl --user enable --now meds.service
systemctl --user status meds.service
```

The app should now be listening on `127.0.0.1:4000` or `0.0.0.0:4000`.

Because the service uses `Restart=on-failure`, `systemctl --user stop meds.service`
will keep it stopped until you start it again manually.

## Rollback Tips

- Keep each exported `.db` file as a point-in-time backup.
- Before risky upgrades on the Pi, copy `/home/victor/.local/share/meds/meds.db`
  somewhere safe.
- If the Pi migration fails, you can redeploy Fly.io using the original volume
  until the new host is ready.
