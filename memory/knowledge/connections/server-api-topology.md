---
title: "Connection: Server API Topology"
connects:
  - "concepts/coolify-deployment"
  - "concepts/nginx-config"
  - "concepts/qdrant-proxy-server"
  - "concepts/stripe-payment-flow"
  - "concepts/upload-pipeline"
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Connection: Server API Topology

## The Connection

Every `/api/*` call in CrashLens — Stripe, uploads, R2, Firebase
user-doc reads/writes, Qdrant vector search, Brevo email — takes the
same path through the stack: browser → Coolify's public proxy →
Nginx (port 80) → Node (`server/qdrant-proxy.js` on 127.0.0.1:3001).
Understanding this as **one topology**, not three or four
independent things, is the difference between a 15-minute fix and a
two-hour debugging session when something breaks.

## Key Insight

**The stack is single-tenant by design.** One Docker container
hosts both Nginx and Node, sharing env vars injected once by
Coolify. That means:

- There is **no network hop** between Nginx and Node — Node is bound
  to loopback. If `/api/*` 502s, the Node process crashed; network
  is not the issue.
- There is **no service discovery** — Node is always at
  `127.0.0.1:3001`. If someone ever splits them, this assumption
  has to change in three places (nginx.conf, supervisord.conf,
  Dockerfile).
- **Secrets are loaded once** by `entrypoint.sh` when the container
  starts. Rotating a secret requires a container restart — there's
  no live-reload path.
- **Client-side keys** live in `config/api-keys.json`, served as a
  static file by Nginx. The browser fetches it at startup and uses
  what it finds. Anything not in that file but needed server-side
  goes through `/api/*`.

The single-tenant design is why the container is simple (and why
Coolify likes it). The cost is that every surface lives in one Node
file; see the refactor note in [[concepts/qdrant-proxy-server]].

## Evidence

- **Nginx config** ([[concepts/nginx-config]]): `location /api/
  { proxy_pass http://127.0.0.1:3001/; ... }` — single upstream,
  loopback only.
- **Supervisord** ([[concepts/coolify-deployment]]) starts Nginx and
  Node in the same container; either one dying takes a liveness
  hit.
- **Stripe webhook endpoint** ([[concepts/stripe-payment-flow]])
  needs a separate Nginx location block to disable proxy buffering
  — a correctness detail that's only visible when you look at the
  whole topology, not just the Stripe code.
- **Uploads** ([[concepts/upload-pipeline]]) require raising
  `client_max_body_size` at the Nginx layer AND having Node accept
  the body — both sides must agree or the user sees a 413.
- **Auth** is enforced in Node via Firebase Admin using the ID
  token the client attaches; Nginx doesn't enforce auth itself. Any
  endpoint Node doesn't gate is effectively public.

## Implications

- **Adding a new `/api/*` route** requires: the Node handler, any
  needed env var (injected via Coolify + consumed by
  `entrypoint.sh` or Node directly), and — rarely — an Nginx change
  if the route has special body/buffering needs.
- **Debugging a broken `/api/*` call** has a known hop order:
  - Browser devtools (client request shape)
  - Nginx access/error logs (did the request even reach Nginx?)
  - Supervisord logs for Node (did Node see it?)
  - Node handler logs (did the handler return an error?)
  - Downstream (Stripe API, R2, Firestore) — check Node's outbound
    request logs
- **Rotating a secret** means: update env var in Coolify dashboard →
  restart container → verify via `/api/stripe/status` or equivalent.
- **Splitting Node into multiple processes / containers** (currently
  not done) would require a new assumption layer around service
  discovery; until then, treat the Node file as the atomic unit of
  server surface.

## Related Concepts

- [[concepts/coolify-deployment]]
- [[concepts/nginx-config]]
- [[concepts/qdrant-proxy-server]]
- [[concepts/stripe-payment-flow]]
- [[concepts/upload-pipeline]]
- [[concepts/firebase-auth]] — the identity layer that gates most
  `/api/*` calls
- [[concepts/r2-storage-paths]] — R2 is the main downstream
- [[concepts/module-architecture]] — client-side analog of this
  server stack
- [[connections/module-namespace-vs-legacy-state]] — the
  `qdrant-proxy.js` single-file pattern is the server-side analog
  of the client's legacy-vs-namespace split
