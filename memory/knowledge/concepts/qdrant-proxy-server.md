---
title: "Node API Server (server/qdrant-proxy.js)"
aliases: [qdrant-proxy, node-server, api-server, backend]
tags: [server, api, node, backend]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Node API Server (server/qdrant-proxy.js)

All `/api/*` routes in CrashLens terminate at a single Node.js server
that lives in `server/qdrant-proxy.js`. The name is historical — it
started as a thin proxy for Qdrant vector search — but it has grown
into the backend for Stripe checkout/webhooks, Firebase Admin user-
doc writes, R2 uploads, Brevo transactional email, and Qdrant
queries. Nginx proxies `/api/*` to it on port 3001 inside the same
Docker container.

## Key Points

- **One Node process, many surfaces**: Stripe, Firebase Admin, R2,
  Brevo, Qdrant. All in one file today; worth a future split along
  feature boundaries.
- **Holds every server-side secret** — `STRIPE_SECRET_KEY`,
  `STRIPE_WEBHOOK_SECRET`, `FIREBASE_SERVICE_ACCOUNT`, R2
  credentials, Brevo API key, Qdrant admin token. None of these are
  ever sent to the browser.
- **Port 3001, bound to 127.0.0.1** — only reachable from within the
  container via Nginx's `proxy_pass`. Not exposed publicly.
- **Deps** in `server/package.json`: `stripe`, `firebase-admin`,
  `@aws-sdk/client-s3`, Brevo/SendinBlue SDK, Qdrant client.

## Details

### Endpoint surface (by domain)

**Stripe** (see [[concepts/stripe-payment-flow]])

| Method | Path |
|--------|------|
| POST   | `/api/stripe/create-checkout-session` |
| POST   | `/api/stripe/webhook` |
| POST   | `/api/stripe/create-portal-session` |
| GET    | `/api/stripe/status` |

**Firebase / user** (internal, via `firebase-admin`)

- User-doc upserts on webhook events.
- User identification for authenticated `/api/*` requests (ID-token
  verification).

**R2 / uploads** (see [[concepts/upload-pipeline]],
[[concepts/r2-storage-paths]])

| Method | Path                         | Role |
|--------|------------------------------|------|
| POST   | `/api/upload/crash`          | Crash dataset upload + normalize |
| POST   | `/api/upload/roads`          | Road file upload |
| POST   | `/api/upload/traffic-inventory` | Traffic inventory upload |
| POST   | `/api/corrections/append`    | Append a correction to the ledger |
| GET    | `/api/r2/*`                  | Signed-URL brokerage for private reads (if used) |

Exact paths depend on how `server/qdrant-proxy.js` has been extended
over time — treat this as the pattern, not a fixed spec.

**Qdrant / AI** (semantic search + AI features)

- Vector search proxy: browser sends a query, server embeds via
  configured model, queries Qdrant, returns top-k.
- AI rate-limiting and user-plan gating lives here.

**Brevo / email** (contact forms, transactional)

- `POST /api/contact` — contact form submissions; sends via Brevo.
- Anything else transactional goes through here, never from the
  browser directly.

### Middleware stack

Minimum middleware in order:

1. **Raw body** for `/api/stripe/webhook` (Stripe signature
   verification needs the raw body).
2. **JSON body parser** for everything else.
3. **Auth middleware** that reads the Firebase ID token (from the
   `Authorization: Bearer <token>` header), verifies via
   `firebase-admin`, and attaches the user to `req.user`.
4. **Plan-gating middleware** on paid-feature routes (reads plan
   from Firestore user doc; rejects free users).
5. **Route handlers**.

### Secret hygiene

All secrets come from environment variables injected by Coolify (see
[[concepts/coolify-deployment]]). The server must:

- **Never** log secrets.
- **Never** include secret values in error messages returned to the
  client.
- **Never** write secrets to `config/api-keys.json` — that file is
  browser-bound.

### Liveness / readiness

`GET /api/stripe/status` is the cheap "is Stripe configured?" probe
and doubles as a server-reachable health check. Add explicit
`/api/health` if we ever want uptime pings that don't touch Stripe.

## Common Pitfalls

- **Moving logic to `server/qdrant-proxy.js` without adding auth** —
  every new route must assume a hostile client; auth middleware must
  run.
- **Forgetting the raw-body requirement** on the Stripe webhook —
  signatures will fail verification, Stripe will retry, the webhook
  will appear to be broken.
- **Importing Firebase Admin on the client** — impossible anyway, but
  worth calling out: Admin SDK requires the service account and must
  stay server-side.
- **Logging full request bodies** during debugging — may capture
  tokens or raw file contents; scrub before printing.
- **Returning Qdrant admin responses verbatim** — may expose
  internal vector IDs or collection names; wrap responses.

## Future Refactor

Split by feature into `server/stripe.js`, `server/uploads.js`,
`server/qdrant.js`, etc., each mounted as a router. Keep the single
entry point at `server/qdrant-proxy.js` for backwards compatibility
with `Dockerfile`/`supervisord.conf`.

## Related Concepts

- [[concepts/coolify-deployment]] — process topology, env-var
  injection
- [[concepts/stripe-payment-flow]] — Stripe endpoints and webhook
  rules
- [[concepts/firebase-auth]] — user identity surface shared with this
  server
- [[concepts/upload-pipeline]] — server-side branch of the upload
  flow
- [[concepts/r2-storage-paths]] — R2 writes happen here
- [[concepts/nginx-config]] — `/api/*` proxy rules
- [[concepts/module-architecture]] — server-side analog to `CL.*`
  (single Node file today)
- [[connections/server-api-topology]] — ties this server into the
  broader Coolify → Nginx → Node topology

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding
  from CLAUDE.md "Payment Architecture", "Hosting: Coolify (Docker)",
  and `server/package.json`
