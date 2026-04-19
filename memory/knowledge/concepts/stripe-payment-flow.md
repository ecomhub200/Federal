---
title: "Stripe Payment Flow (Checkout + Webhook + Firestore)"
aliases: [stripe, checkout, billing, subscriptions]
tags: [payments, server, auth, firebase]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Stripe Payment Flow (Checkout + Webhook + Firestore)

CrashLens uses **Stripe Checkout (redirect mode)** for all paid plans. The
client never touches card details directly; it asks the Node.js server to
create a Checkout Session, Stripe hosts the payment page, and a webhook
writes the subscription state back to the user's Firestore document.

## Key Points

- **Checkout is redirect-based.** The browser is sent to
  `checkout.stripe.com`, not an in-page iframe, so no PCI burden on the
  client.
- **Plans**: `trial`, `individual`, `team`, `agency`. Price IDs come from
  env vars (one per plan × billing cycle).
- **Server endpoints** live in `server/qdrant-proxy.js`, proxied through
  Nginx at `/api/stripe/*`.
- **Webhook is the source of truth** for subscription status. Never infer
  state from the client-side success redirect.
- **Firebase Admin** on the server writes subscription fields directly to
  the user's Firestore doc from the webhook handler.
- **Billing Portal** is Stripe-hosted too — the server creates a portal
  session and the client redirects.

## Details

### Endpoints (`server/qdrant-proxy.js`)

| Method | Path                                     | Purpose |
|--------|------------------------------------------|---------|
| POST   | `/api/stripe/create-checkout-session`    | Create Checkout Session, return URL for redirect |
| POST   | `/api/stripe/webhook`                    | Receive Stripe events, update Firestore |
| POST   | `/api/stripe/create-portal-session`      | Create Stripe Customer Portal session |
| GET    | `/api/stripe/status`                     | Report whether Stripe is configured |

### Client helpers (`assets/js/auth.js` — `CrashLensAuth`)

```javascript
CrashLensAuth.initiateCheckout(plan, billingCycle);  // calls server, redirects
CrashLensAuth.openBillingPortal();                   // redirects to portal
CrashLensAuth.setPendingCheckout(plan);              // stores plan across login flow
CrashLensAuth.getPendingCheckout();                  // reads after login
```

`setPendingCheckout` / `getPendingCheckout` exist because the marketing
site sends unauthenticated users to `/login` before Checkout. The chosen
plan is stashed in `sessionStorage`, read back after auth completes, then
passed into `initiateCheckout`.

### Environment variables

| Name                                 | Scope   | Notes |
|--------------------------------------|---------|-------|
| `STRIPE_SECRET_KEY`                  | server  | never sent to client |
| `STRIPE_PUBLISHABLE_KEY`             | client  | injected into `config/api-keys.json` by `entrypoint.sh` |
| `STRIPE_WEBHOOK_SECRET`              | server  | HMAC verification of webhook payloads |
| `STRIPE_PRICE_INDIVIDUAL_MONTHLY`    | server  | Stripe Price IDs |
| `STRIPE_PRICE_INDIVIDUAL_ANNUAL`     | server  | |
| `STRIPE_PRICE_TEAM_MONTHLY`          | server  | |
| `STRIPE_PRICE_TEAM_ANNUAL`           | server  | |
| `FIREBASE_SERVICE_ACCOUNT`           | server  | Firebase Admin SDK JSON, used to write to Firestore |

All server-side secrets are injected by Coolify; see
[[concepts/coolify-deployment]] for the injection path.

### Checkout flow (happy path)

```
Browser                                    Server                         Stripe
───────                                    ──────                         ──────
user clicks "Subscribe"
  └─ CrashLensAuth.initiateCheckout()
       └─ POST /api/stripe/create-checkout-session
                                        lookup price ID per plan
                                        create Checkout Session  ───────► Stripe API
                                        return { url }           ◄───────
  redirect to url
                                                                 ◄─────── user pays on Stripe
                                                                 ───────► POST /api/stripe/webhook
                                        verify signature
                                        upsert Firestore user doc
                                            (plan, status, current_period_end)
  redirect to success_url
  on load: auth listener re-reads user doc
```

### Webhook events to handle

At minimum, handle `checkout.session.completed`,
`customer.subscription.updated`, `customer.subscription.deleted`, and
`invoice.payment_failed`. Each updates Firestore fields on the user doc
so the client UI can gate features by plan.

### Common pitfalls

- **Trusting the success redirect.** Never flip the user to "Pro" on
  redirect alone — Stripe can bounce the user to `success_url` before
  the webhook fires. Always gate on Firestore fields populated *by the
  webhook*.
- **Forgetting to verify the webhook signature.** The raw body is needed
  for signature verification — ensure Express gets the raw body on the
  webhook route (not the JSON-parsed body).
- **Hard-coded price IDs.** Always read from env vars; test keys and live
  keys have different IDs, and hard-coding breaks the Coolify dev/prod
  split.
- **Showing a publishable key you didn't intend.** Anything written into
  `config/api-keys.json` reaches the browser; keep secret keys out.

## Related Concepts

- [[concepts/coolify-deployment]] — how env vars become
  `config/api-keys.json` at container startup
- [[concepts/module-architecture]] — `CrashLensAuth` lives in
  `assets/js/auth.js`, not under `CL.*` (legacy pre-namespace module)
- [[concepts/firebase-auth]] — the auth surface Stripe hooks into
- [[concepts/upload-pipeline]] — both flows share the server's
  Firestore user-doc surface
- [[connections/module-namespace-vs-legacy-state]] — why
  `CrashLensAuth` is still at `window` scope

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from the
  "Payment Architecture (Stripe)" section of CLAUDE.md
