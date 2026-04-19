---
title: "Firebase Auth (CrashLensAuth Module)"
aliases: [auth, firebase, CrashLensAuth, google-oauth, email-password]
tags: [auth, firebase, client, identity]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Firebase Auth (CrashLensAuth Module)

CrashLens authenticates users via **Firebase Auth** with two providers:
**Google OAuth** and **Email/Password**. The `CrashLensAuth` client
module in `assets/js/auth.js` wraps sign-in/out, user-doc reads,
pending-checkout hand-off, and Stripe Billing Portal redirects.
Firebase initialization lives in `assets/js/firebase-config.js` (actual
config) with `firebase-config.example.js` as the template.

## Key Points

- **Two providers only**: Google OAuth + Email/Password. No magic-link,
  no phone, no anonymous auth.
- **Firestore is the user database**: subscription state, plan, and
  user metadata live on each user's doc; see
  [[concepts/stripe-payment-flow]] for how it's written.
- **`CrashLensAuth`** is the single surface the rest of the client
  should use — do not reach into `firebase.auth()` directly from
  feature modules.
- **Pre-namespace module**: `CrashLensAuth` pre-dates the `CL.*`
  namespace convention. New auth code should go under `CL.auth` when
  the module is migrated; see
  [[connections/module-namespace-vs-legacy-state]].
- **Login page** is at `/login/index.html`; the marketing site sends
  unauthenticated users there before any paid flow.

## Details

### Client surface (`assets/js/auth.js`)

```javascript
CrashLensAuth.signInWithGoogle();
CrashLensAuth.signInWithEmail(email, password);
CrashLensAuth.signUpWithEmail(email, password);
CrashLensAuth.signOut();

CrashLensAuth.getCurrentUser();      // returns Firebase user or null
CrashLensAuth.onAuthChanged(cb);     // observer

// Stripe helpers (see concepts/stripe-payment-flow):
CrashLensAuth.initiateCheckout(plan, billingCycle);
CrashLensAuth.openBillingPortal();
CrashLensAuth.setPendingCheckout(plan);
CrashLensAuth.getPendingCheckout();
```

### Firebase config

`assets/js/firebase-config.js` exports a minimal client config (API key,
auth domain, project ID, app ID). The API key in this file is **not a
secret** — it identifies the Firebase project to the client; security
is enforced by Firebase rules and by the server's service-account
credentials. Still, the file is gitignored per `.env.example` guidance
in favor of the `.example` template.

### Sign-in flow

1. User clicks "Sign in with Google" or submits email/password on
   `/login/`.
2. `CrashLensAuth` resolves the Firebase user and reads the user's
   Firestore doc (creating it on first sign-in).
3. `onAuthChanged` observers fire; app shell updates UI based on plan.
4. If a `pendingCheckout` was set before login, `CrashLensAuth` reads
   it and kicks off `initiateCheckout` immediately. See
   [[concepts/stripe-payment-flow]].

### Firestore user-doc shape

A minimal user doc looks like:

```javascript
{
  uid:                  "...",
  email:                "user@example.com",
  plan:                 "trial" | "individual" | "team" | "agency",
  status:               "active" | "past_due" | "canceled" | "trialing",
  stripeCustomerId:     "cus_...",
  currentPeriodEnd:     1710000000,
  createdAt:            1700000000,
  lastSeenAt:           1710000000,
}
```

The webhook (server-side) owns `plan`, `status`, `stripeCustomerId`,
and `currentPeriodEnd`. The client may write `lastSeenAt`, display
name, and non-billing metadata.

### Security notes

- **Firestore rules** must gate reads/writes by `request.auth.uid`; the
  client never assumes another user's doc is readable.
- **`FIREBASE_SERVICE_ACCOUNT`** is server-only (see
  [[concepts/coolify-deployment]]); it must never land in
  `config/api-keys.json`.
- **Custom claims** (not currently used) would be set via the Admin SDK
  on the server and read on the client via
  `user.getIdTokenResult(true)`.

## Common Pitfalls

- **Calling `firebase.auth()` directly from feature modules** — bypasses
  the `CrashLensAuth` surface and fragments the auth logic.
- **Reading plan from local state instead of Firestore** — the webhook
  is the source of truth; local fields drift.
- **Committing `firebase-config.js`** when only `*.example.js` should
  be versioned (check `.gitignore`).
- **Forgetting to reload the user doc after checkout** — the webhook
  updates Firestore, but the client needs to re-read on return from
  Stripe.

## Related Concepts

- [[concepts/stripe-payment-flow]] — Firestore user doc is the bridge
- [[concepts/coolify-deployment]] — Firebase Admin credentials live
  server-side, injected via env var
- [[concepts/module-architecture]] — `CrashLensAuth` will eventually
  move under `CL.auth`
- [[concepts/upload-pipeline]] — uploads use `CrashLensAuth` to
  authenticate server-side
- [[concepts/qdrant-proxy-server]] — server verifies Firebase ID
  tokens via the Admin SDK
- [[connections/module-namespace-vs-legacy-state]] — tracks the legacy
  modules (including this one) awaiting migration
- [[connections/server-api-topology]] — auth is enforced at the Node
  layer, not at Nginx

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  CLAUDE.md "Authentication via Firebase Auth" + `assets/js/auth.js` +
  `assets/js/firebase-config.example.js`
