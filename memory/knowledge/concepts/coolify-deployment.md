---
title: "Coolify Deployment (Docker + Nginx + supervisord)"
aliases: [coolify, deployment, docker, nginx, supervisord, entrypoint]
tags: [infra, devops, hosting]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Coolify Deployment (Docker + Nginx + supervisord)

Production runs as a **single Docker container on Coolify** that hosts
both the static front-end (Nginx on port 80) and the Node.js API
(`qdrant-proxy.js` on port 3001). `supervisord` owns both processes.
Nginx proxies `/api/*` to the Node process on 127.0.0.1:3001.

## Key Points

- **One container, two processes**, managed by supervisord.
- **Nginx** serves static files from the image and proxies `/api/*` to
  the Node server.
- **`entrypoint.sh`** runs at container start, reads environment
  variables injected by the Coolify dashboard, and writes the
  client-safe ones into `config/api-keys.json`.
- **Server secrets never touch `api-keys.json`** — Stripe secret key,
  Firebase Admin, Brevo, and Qdrant credentials stay as env vars
  consumed directly by the Node server.
- **Netlify deploy exists as a secondary option** (`netlify.toml`,
  `netlify/functions/`) but Coolify is primary.

## Details

### Process topology

```
┌─────────────────────── Docker container ────────────────────────┐
│                                                                 │
│   supervisord                                                   │
│    ├── nginx     (port 80)    ────► static files (/app/*)       │
│    │                           ────► proxy_pass /api/*          │
│    │                                       │                    │
│    └── node qdrant-proxy.js   ◄────────────┘  (127.0.0.1:3001)  │
│                               ◄──── Stripe, Firebase, R2,       │
│                                     Brevo, Qdrant               │
└─────────────────────────────────────────────────────────────────┘
         ▲
         │ HTTP(S) from the public internet
```

### Key files

| File                | Role |
|---------------------|------|
| `Dockerfile`        | Image definition — installs Nginx, Node, deps |
| `nginx.conf`        | Static-file rules + `/api/*` proxy_pass |
| `supervisord.conf`  | Starts Nginx + Node, restarts on crash |
| `entrypoint.sh`     | Renders `config/api-keys.json` from env vars, then `exec` supervisord |
| `server/qdrant-proxy.js` | Node API server, all `/api/*` logic |
| `server/package.json`    | Server deps: `stripe`, `firebase-admin`, `@aws-sdk/client-s3`, ... |

### Env-var → `api-keys.json` flow

`entrypoint.sh` reads a small set of client-safe env vars and writes
them to `config/api-keys.json`, which the browser can fetch. Typical
entries:

- Mapbox public token
- Google Maps JS API key
- Firebase Web config
- `STRIPE_PUBLISHABLE_KEY` (see [[concepts/stripe-payment-flow]])

Secrets that must **never** appear in `api-keys.json`:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FIREBASE_SERVICE_ACCOUNT`
- Brevo, Qdrant admin credentials

### Rollout workflow

1. Push to the target branch; Coolify watches it.
2. Coolify builds the Docker image using `Dockerfile`.
3. Container starts → `entrypoint.sh` writes `api-keys.json` → hands off
   to `supervisord`.
4. Nginx serves `/app/` immediately; Node becomes ready within a few
   seconds.
5. `/api/stripe/status` is a cheap liveness probe that also reports
   whether Stripe is configured.

### Debugging tips

- `docker logs` shows supervisord's combined stdout; each child process
  is prefixed.
- If the site loads but `/api/*` 502s, Node crashed — check env vars in
  the Coolify dashboard; missing secrets are the most common cause.
- If `config/api-keys.json` is present but empty fields show up in the
  browser, `entrypoint.sh` ran before a new env var was added to the
  rendering logic — update `entrypoint.sh` and redeploy.

## Common Pitfalls

- **Baking secrets into the image** at build time instead of injecting
  them at runtime — breaks rotation and leaks to anyone with image
  access.
- **Writing server-only keys into `api-keys.json`** — they reach the
  browser.
- **Editing `nginx.conf` without updating `supervisord.conf`** — Nginx
  won't pick up the new config until the container is restarted.
- **Modifying Netlify config expecting prod to change** — Netlify is the
  secondary path; Coolify is primary.

## Related Concepts

- [[concepts/stripe-payment-flow]] — consumes both client and server
  env vars wired by this deployment
- [[concepts/module-architecture]] — client modules read from
  `config/api-keys.json` for their keys
- [[concepts/firebase-auth]] — Firebase Admin service account is a
  server-only env var
- [[concepts/r2-storage-paths]] — R2 write credentials are injected as
  server-side env vars here
- [[concepts/upload-pipeline]] — server uses those R2 credentials to
  accept client uploads

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  the "Hosting: Coolify (Docker)" section of CLAUDE.md
