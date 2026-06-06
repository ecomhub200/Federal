# v1.1 backlog — DO NOT FIX UNTIL A PAYING CUSTOMER COMPLAINS

This file is the official deferred-polish list for CRASH LENS v1.0 → v1.1.
Items here are real and visible but NOT shipping-blockers — every one of them
has a workable user path today (the Comprehensive PDF download still works,
all 15 report types generate, the numbers are correct).

**Discipline rule (from SHIP_TO_PRODUCTION_PLAN):** every cosmetic finding
goes HERE, not into a new CC prompt. CC's role on this file is APPEND-ONLY —
add new findings to the bottom, never delete or "fix" items.

When does v1.1 work resume?
1. A paying customer reports one of these as a blocker for their workflow.
2. OR Murad explicitly says "now do v1.1 polish."
3. OR a new state is onboarded and one of these items blocks that state's data.

---

## Comprehensive Quarterly Report HTML preview

- Header shows "COUNTY" placeholder instead of "New Castle County" when generated at county tier (PDF export header is correct — only the HTML preview is affected).
- Funding Opportunities section is not visible in the HTML preview (rendering throws partway through the template literal). The PDF export DOES include the funding page correctly.
- Chart canvases (`compChartSeverity`, `compChartTrend`) exist in the DOM but Chart.js never draws into them — no helper is wired. PDF export uses text bullets instead of charts, which still communicates the data.

## Backend matview gaps

- `mv_hotspots_with_rates?is_interstate=eq.false` returns 404 — that matview is missing the `is_interstate` column. Hotspot report at planning_district tier shows zero rows for the non-interstate filter; falls back to all-roads which works.

## Console noise (non-functional)

- `[CONFIG] getCurrentStateFips: no state could be determined` startup log — self-heals 200 ms later when `appConfig.defaultState` loads.
- `/api/notify/status:404` and `/api/r2/worker-status:404` — Coolify-only endpoints, expected to 404 on GitHub Pages.
- `[Subscribers] Firestore sync error, falling back to R2` — Firestore quota / project mismatch; R2 fallback works.

## Multi-state expansion (post-v1.0)

- Only Delaware is fully onboarded. Colorado / Virginia / others deferred per Murad's "ship Delaware first" direction.

---

## How to use this file

When a finding is reported:
1. Reproduce + capture the symptom.
2. Add a 2-3 line entry to the appropriate section above.
3. STOP. Do NOT draft a CC prompt unless rule 1, 2, or 3 above applies.

When v1.1 work begins:
1. Sort entries by paying-customer impact.
2. Take the top 3.
3. Write CC prompts targeting ONLY those 3.
4. Defer the rest until v1.2.
