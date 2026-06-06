# CRASH LENS v1.0 — shipped 2026-06-06

## What v1.0 includes

- 16 working tabs: Upload, Dashboard, Map, Hot Spots, Crash Tree, Safety Scorecard, Safety Focus, Intersections, Ped/Bike, Analysis, Countermeasures, Warrants, MUTCD AI, Domain Knowledge, Grants, Reports.
- 15 report types: Crash Poster Infographic, Comprehensive Quarterly, Executive Dashboard, Corridor & Segment, Systemic Safety (Crash Tree), Safety Focus Category, Fatal & Speed-Related, High-Crash Location (Hotspot), Intersection Safety, Vulnerable Road User (Ped/Bike), Countermeasures, Before/After Study, Grant Application Support, Safety Performance, Multi-Year Trend.
- Authentication via Firebase (Google OAuth + email).
- Payments via Stripe Checkout (Trial / Individual / Team / Agency tiers).
- Schedule Email via Brevo + node-cron + Firestore (operator-deployed via Coolify).
- Self-hosted Supabase at srv1503081.hstgr.cloud with 14+ materialized views.
- State-agnostic architecture supporting Delaware fully (other states pending v1.x).

## What was deferred to v1.1

See `docs/v1_1_backlog.md`.

## Operator runbooks

- Schedule Email Coolify activation: `queue/331b-SCHEDULE-EMAIL-OPERATOR-RUNBOOK.md`
- 60-cell report sweep verification: `queue/341b-CHROME-CLAUDE-reports-sweep-download-all-15.md`

## Major recent fixes shipped

- CC 351 + CC 353 — Comprehensive + all 15 report types no longer hang at 25 s
- CC 346 + CC 347 — display polish helpers + comma formatting
- CC 350 — multi-state grant catalog (federal + 17 states)
- CC 345 — PDF font / character spacing fixes
- CC 342 — infographic top-5 duplicate disambiguation
- CC 341 — state-aware DOT name in footer + FHWA 2025 EPDO weights

## What CC must NOT change in v1.0 maintenance mode

- The 13 generator functions in `app/modules/reports/reports-standard-*.js` (frozen)
- The dispatcher's `MATVIEW_REPORT_TYPES` Set and `_resolveMatviewDataForReport` switch (frozen)
- The matview hydration pipeline (`_hydrateWithBudget`) (frozen)
- The Stripe / Firebase / Supabase wiring (frozen)
- Any other tab's UI (frozen until v1.1 explicitly opens it)
