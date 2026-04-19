---
title: "Connection: Module Namespace vs Legacy State"
connects:
  - "concepts/module-architecture"
  - "concepts/state-management"
  - "concepts/firebase-auth"
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Connection: Module Namespace vs Legacy State

## The Connection

CLAUDE.md declares the `CL.*` namespace **mandatory** for all new code,
and lists eight feature namespaces. In practice the codebase is mid-
migration: most features already live under `CL.*`, but the global
state objects (`crashState`, `cmfState`, `warrantsState`, etc.) and
`CrashLensAuth` still sit at `window` scope. This split is the most
common place new contributors trip — they see `CL.grants.ranking(...)`
in one file and `crashState.aggregates.byRoute` in another and assume
the app is inconsistent.

## Key Insight

**The split is deliberate, not drift.** Two kinds of globals exist:

1. **Feature modules** — behavior. Live under `CL.<feature>.<sub>`.
   Always namespaced.
2. **Shared mutable state** — data. Lives at `window` scope
   (`crashState`, `cmfState`, `warrantsState`, ...). Accessed from
   many features; namespacing under one `CL.<feature>` would be
   misleading, and putting it under `CL.state` is a
   future-refactor candidate that hasn't happened yet.

`CrashLensAuth` is a third, weaker category: it's both behavior and a
user-doc read surface, and predates the namespace convention entirely.
When it's migrated, it should land at `CL.auth`.

**The rule new code should follow**: if you're adding a new feature,
put its *code* under `CL.<feature>`. If you're adding *shared
mutable data* that three+ tabs will read, follow the existing top-
level pattern and name it `<feature>State` — until the broader refactor
happens, this is actually the less-surprising choice.

## Evidence

- **Existing module map** under `CL.*` (see [[concepts/module-architecture]]):
  `CL.core`, `CL.analysis`, `CL.warrants`, `CL.grants`, `CL.ai`,
  `CL.upload`, `CL.utils`, `CL.batchBA`.
- **Existing globals at `window`** (see [[concepts/state-management]]):
  `crashState`, `cmfState`, `warrantsState`, `grantState`, `baState`,
  `safetyState`, `selectionState`, `aiState`.
- **`CrashLensAuth`** sits in `assets/js/auth.js`, outside `app/modules/`
  entirely (see [[concepts/firebase-auth]]).
- **Loader conventions** (`app/modules/loader.js` runs first, each
  module calls `CL._registerModule('feature/name')`) only cover the
  `CL.*` side of the split; the top-level state objects have no
  equivalent registration.

## Implications

- **Refactor path (when it happens)** has three stages:
  1. Move each `<feature>State` object under `CL.<feature>.state`,
     keeping a top-level alias for one release so every reader
     migrates.
  2. Migrate `CrashLensAuth` to `CL.auth` with a compatibility shim on
     `window.CrashLensAuth`.
  3. Remove the top-level aliases; grep for any remaining direct
     references.
- **Don't half-migrate.** Moving `cmfState` under `CL.cmf` without
  updating the 10+ feature files that read it creates the exact
  silent-overwrite class of bug that CLAUDE.md's "no duplicate function
  names" rule warns against.
- **New auth code belongs at `CL.auth`** even before the migration —
  but it must interop with `CrashLensAuth` while the legacy module
  still exists.
- **Documenting *why* something is at `window` scope** in the relevant
  concept article (as we do in [[concepts/state-management]]) helps
  reviewers stop "fixing" it out of reflex.

## Related Concepts

- [[concepts/module-architecture]]
- [[concepts/state-management]]
- [[concepts/firebase-auth]]
- [[concepts/stripe-payment-flow]] — `CrashLensAuth` is the most
  visible legacy-at-window surface cited here
- [[concepts/golden-columns]] — `COL` is accessed both through
  `CL.core` and via a legacy global
- [[connections/server-api-topology]] — server-side analog:
  `qdrant-proxy.js` is the single-file pattern that mirrors the
  client's legacy globals
