---
title: Backend is self-hosted Supabase — Claude Code MCP cannot reach it
sources:
  - daily/2026-05-30.md
created: 2026-05-30
updated: 2026-05-30
---

# Backend is self-hosted Supabase — Claude Code MCP cannot reach it

## Fact

The Crash Lens crash/analytics backend is a **self-hosted Supabase** instance on
a Hostinger VPS at `https://srv1503081.hstgr.cloud` (PostgREST under
`/rest/v1`, RPCs under `/rest/v1/rpc/`). It is **not** a Supabase Cloud project.
The URL is the hardcoded default in `assets/js/data-client.js`
(`CrashLensDataClient.DEFAULTS.supabaseUrl`) and `assets/js/supabase-auth.js`;
`config.json` / `api-keys.json` can override `url` / `anonKey`. The frontend
uses the **anon JWT only** — there is no `service_role` key client-side, and
none should ever be added.

## Why it matters

The Supabase **MCP tools** wired into the Claude Code environment
(`mcp__*__execute_sql`, `list_tables`, `apply_migration`, …) are bound to
**unrelated hosted Supabase projects**. Querying the self-hosted instance
through them returns `permission denied` / "not in accessible list". Confirmed
2026-05-30 while diagnosing the magisterial-district dashboard: every
`execute_sql` against the app's data returned `-32600 permission denied`.

**Consequence:** Claude Code **cannot read or mutate the production DB.** Do not
claim backend behavior was "verified against prod" — that is unverifiable from
this environment. (A first-pass commit message made exactly this false claim and
had to be corrected.)

## Operating rule

- **Frontend-only** changes (how `data-client.js` calls an existing RPC/matview,
  fallback wiring, column mapping) → do in-repo as normal; verify with
  `node --check` + deployed-page Playwright.
- **Backend** changes (new/edited matview, RPC, index, `GRANT`, cron, column) →
  **never attempt directly.** Author a self-contained **CoWork prompt** under
  `docs/` for the operator with DB access. Pattern:
  [[concepts/supabase-cowork-prompt-pattern]] — see
  `docs/SUPABASE_BACKEND_COWORK_PROMPT.md` (matviews) and
  `docs/SUPABASE_MAGISTERIAL_DASHBOARD_COWORK_PROMPT.md` (the
  `get_jurisdiction_breakdown` RPC).
- If a fix needs **both**, ship the frontend half and flag the backend half as
  **blocked-on-CoWork / unverified** — don't call the bug fixed until the prompt
  is executed and reported back.

Codified in `CLAUDE.md` → "Backend: SELF-HOSTED Supabase (NOT Supabase Cloud)".
