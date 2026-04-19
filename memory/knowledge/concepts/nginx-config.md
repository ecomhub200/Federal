---
title: "Nginx Config (static + /api/* proxy)"
aliases: [nginx, nginx.conf, proxy, reverse-proxy]
tags: [infra, nginx, routing, server]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Nginx Config (static + /api/* proxy)

Inside the production container, Nginx is the only process that binds
to port 80. It serves all static assets (the marketing site, `app/`,
`login/`, `assets/`, `config/api-keys.json`) directly off disk and
proxies every `/api/*` request to the Node server on port 3001. The
config lives at `nginx.conf` in the project root.

## Key Points

- **Single public port**: 80 (inside container). Coolify fronts this
  with TLS externally.
- **Static first**: any path that isn't `/api/*` is served from the
  image filesystem.
- **`/api/*` → `proxy_pass` → `127.0.0.1:3001/`**; strips nothing,
  preserves path.
- **`config/api-keys.json` is publicly readable** — that's intentional;
  only *client-safe* keys go in that file (see
  [[concepts/coolify-deployment]]).
- **No TLS in this container**: Coolify's proxy layer terminates
  TLS; Nginx here speaks plain HTTP.

## Details

### Proxy rule sketch

```nginx
location /api/ {
    proxy_pass         http://127.0.0.1:3001/;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    client_max_body_size 50M;            # uploads
}

location /api/stripe/webhook {
    # Stripe webhooks must get the RAW body (signature verification).
    proxy_pass         http://127.0.0.1:3001/api/stripe/webhook;
    proxy_http_version 1.1;
    proxy_request_buffering off;
    proxy_buffering         off;
    proxy_set_header   Host $host;
}
```

The Stripe webhook location is separate because any proxy-level
buffering/rewriting that mangles the raw body will break signature
verification — see [[concepts/stripe-payment-flow]].

### Static serving

- Marketing pages (`index.html`, `pricing.html`, `features.html`,
  `contact.html`) live at the repo root and are served directly.
- `/app/` is the analysis tool SPA.
- `/login/` is the auth page.
- `/assets/` is shared JS/CSS.
- `/config/api-keys.json` is served directly — its contents are
  whatever `entrypoint.sh` wrote at container start.

### Routing for SPA vs MPA

The marketing site is a classic multi-page HTML site; no rewrite
needed. The `/app/` SPA uses hash-based or query-string navigation
(no HTML5 history routes), so Nginx doesn't need an SPA fallback
rewrite rule. If that ever changes (proper HTML5 history routing in
`/app/`), a `try_files $uri /app/index.html` fallback must be added
or deep links will 404.

### Body size

Uploads go through `/api/upload/*`. `client_max_body_size` must
exceed typical upload sizes (tens of MB). If datasets grow beyond
that, raise the limit here — the Node server has its own body-size
guard, but Nginx rejects oversized bodies first.

## Common Pitfalls

- **Enabling `proxy_buffering` on the Stripe webhook location** —
  silently corrupts the raw body and breaks signature verification.
- **Rewriting `/api/` paths** — the Node server expects the full
  path including `/api/`. Any `proxy_pass` with a trailing path
  component must be audited to match.
- **Forgetting `client_max_body_size`** — uploads fail at the proxy
  before even reaching Node, producing a confusing 413.
- **Adding TLS here** — wrong layer. Coolify terminates TLS upstream;
  configuring TLS inside the container is redundant and risks double-
  termination issues.

## Related Concepts

- [[concepts/coolify-deployment]] — single-container topology this
  config is part of
- [[concepts/qdrant-proxy-server]] — the upstream for `/api/*`
- [[concepts/stripe-payment-flow]] — webhook raw-body requirement
- [[concepts/upload-pipeline]] — body-size concerns
- [[concepts/module-architecture]] — serves the `app/modules/`
  directory as static files
- [[connections/server-api-topology]] — Nginx's role in the single-
  container stack

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding
  from CLAUDE.md "Hosting: Coolify (Docker)" and the `nginx.conf`
  file in the project root
