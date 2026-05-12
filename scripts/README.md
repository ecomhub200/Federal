# Firestore → Supabase user sync — setup & run

One-shot copy of every Firebase Auth user into Supabase auth.users + seed `public.profiles`. Idempotent (safe to re-run). Defaults to **dry-run** so you can see what it would do before flipping.

## Prerequisites

- Node 18 or newer
- The Phase 1+2 SQL migration must already be applied (it is — confirmed 2026-05-12)
- Network reach to `https://srv1503081.hstgr.cloud` (works from your laptop with the SSH tunnel up, or directly if you're on the VPS)

## 1. Drop the Firebase service account JSON

1. Open Firebase Console → ⚙️ **Project settings** → **Service accounts**
2. Click **Generate new private key** → confirm → it downloads
3. Rename the downloaded file to `firebase-admin.json`
4. Place it next to this script: `Federal/scripts/firebase-admin.json`

⚠️ This file grants admin access to your entire Firebase project. **Never commit it to git.** A `.gitignore` is set up in this folder to block it.

## 2. Get the Supabase service role key

```bash
# On the VPS:
ssh root@srv1503081.hstgr.cloud
grep '^SERVICE_ROLE_KEY=' /root/supabase/docker/.env
```

That prints `SERVICE_ROLE_KEY=eyJ...` — copy the JWT (the `eyJ...` part, no quotes).

⚠️ The service role key bypasses RLS — treat it like a root password. Don't paste it into chat unless you're going to rotate it after.

## 3. Install deps

```bash
cd Federal/scripts
npm install
```

## 4. Set env vars + dry-run

**Windows PowerShell:**
```powershell
$env:SUPABASE_URL = "https://srv1503081.hstgr.cloud"
$env:SUPABASE_SERVICE_ROLE_KEY = "eyJ..."   # paste the JWT
node firestore-to-supabase-sync.js
```

**macOS / Linux:**
```bash
export SUPABASE_URL="https://srv1503081.hstgr.cloud"
export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
node firestore-to-supabase-sync.js
```

You'll see something like:
```
============================================================
 Firestore -> Supabase user sync
   Mode: DRY-RUN (no writes)
   ...
============================================================
[progress] 25 processed | 25 ok | 0 fail | 25 new auth.users | 23 profiles upserted
...
   Total processed:        47
   Successful:             47
   Failed:                 0
   New auth.users:         47 (would be created)
   Profile rows upserted:  44 (would be upserted)
   No Firestore doc:       3
   ** DRY-RUN: re-run with --apply to actually write **
```

## 5. Spot-check 5 users with full detail

```bash
node firestore-to-supabase-sync.js --limit 5 --verbose
```

Confirms the field mapping looks right per user.

## 6. Apply for real

```bash
node firestore-to-supabase-sync.js --apply
```

Prints the same report with **"would be"** removed — those are the actual writes. The script preserves the Firebase UID as the Supabase auth.users.id, so future logins (once `useSupabaseAuth=true` flips) recognize the same user.

## 7. Verify in Supabase

```bash
# From the VPS
ANON_KEY=$(grep '^ANON_KEY=' /root/supabase/docker/.env | cut -d= -f2)
SERVICE=$(grep '^SERVICE_ROLE_KEY=' /root/supabase/docker/.env | cut -d= -f2)

# Count auth.users (service-role bypasses RLS)
curl -s -H "apikey: $SERVICE" -H "Authorization: Bearer $SERVICE" \
  'https://srv1503081.hstgr.cloud/rest/v1/profiles?select=user_id,email,plan,home_state,home_jurisdiction_name&limit=10'
```

You should see profile rows for the migrated users. The plan/jurisdiction/email fields should match what's in Firestore.

## Re-running

The script is idempotent — re-running:
- Skips users that already have an auth.users row (no recreate)
- Upserts profile rows on `user_id` (overwrites with latest Firestore values)

Safe to run hourly via cron during the cutover week if you want a continuous mirror.

## Troubleshooting

**"FirebaseAuthError: Invalid credential" / "Could not load the default credentials"**
The service account JSON path is wrong. Pass `--service-account /full/path/to/firebase-admin.json`.

**"401 invalid_grant" or 401s from Supabase**
Wrong SERVICE_ROLE_KEY — re-grep it from `.env`. The anon JWT will not work; it must be the service role.

**"42501: new row violates row-level security policy"**
You're using the anon key, not the service role. The script needs service role to bypass RLS.

**"23503: insert or update on table profiles violates foreign key constraint"**
The auth.users row didn't get created first. Re-run without `--skip-profiles`.

**"23505: duplicate key value violates unique constraint profiles_pkey"**
Profile already exists — this should be impossible since we `upsert(..., {onConflict:'user_id'})`. If you see this, paste the error and we'll adjust.
