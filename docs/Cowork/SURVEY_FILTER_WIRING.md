# Survey A — Filter Wiring

Reference: commit `9be31e5` · `app/index.html` @ 142,804 LOC · 2026-05-17

Scope: inline filter logic — date / severity / route / intersection / district
filters, quick-filter toggles, filter-profile persistence, tab-specific filter
readers, and the filtered-aggregate computation that feeds the dashboard.

## Genuine candidates (≥150 LOC, not extracted, not prompt-covered)

| Function | Start L | End L | LOC | Feature | Key deps | False positive? | Suggested cluster |
|---|---|---|---|---|---|---|---|
| `getFilteredStats` | 41753 | 41932 | 180 | Dashboard filter aggregation across date / severity / route / intersection / DOT-district filters | `crashState.sampleRows`, `COL.*`, `districtState`, `currentFilters` | No | `analysis/filter-aggregation.js` |
| email-chip cluster (`initEmailChipState` … `injectEmailChipStyles`) | 33353 | 33604 | 252 | Email-subscriber chip state + localStorage persistence + chip styles | `localStorage`, `notificationState.subscribers` | No — but **adjacent to Survey C** `openEmailNotificationModal`; treat as part of the email-notifications domain, not generic filter-wiring | `settings/email-notifications.js` (merge with Survey C block) |

**Genuine ≥150 LOC: 432 · Blocks: 2**

## False positives (already extracted — skip)

| Block | Where it lives now |
|---|---|
| Dashboard filter audit IIFE (`_r18ApplyDashboardYearFilter`, `_bindFilterInputs`, `_restoreFilterInputs`, `_r19LoadSafetyCategoriesWithFilter`, …) | `app/modules/data/dashboard-filter-bindings.js` (prompts 44 / 44-v2, off-limits) |

**False-positive count: 1**

## Below the bar (sub-150 LOC — listed for completeness, NOT Phase-4 candidates)

~18 small functions, ~2,500 LOC distributed and interleaved with UI code:

- `applyFilters` (~89), `resetFilters` (~66), `resetFilterUI` (~44)
- `saveFilterProfile` (~63), `showFilterLoadingState` (~48)
- `toggleQuickFilter` (~48), `toggleMapFilter` (~11),
  `updateMapFiltersBadge` (~17), `updateQuickFilterBadge` (~28),
  `renderMapFactorChips` (~61), `getFilteredMapPoints` (~120)
  → **these last six are MAP filters; deduped into Survey B's domain, not here**
- tab-specific filter readers: Intersection (~96), Ped (~115), Bike (~118)

These are too small individually and too entangled with surrounding UI to
warrant per-block extraction at the ≥150 bar. Disposition (lower the bar vs.
defer to Stage A) is a Murad decision — see `DAY2_LANE4_PHASE4_PLAN.md`.

## Cluster groupings

**Cluster A1 — Dashboard filter aggregation (180 LOC)**
- `getFilteredStats` (L41753–41932) → `analysis/filter-aggregation.js`.
  Self-contained reducer over `crashState.sampleRows`; clean to lift. Watch the
  off-limits name set — no collision with `analysis/hotspots.js` or
  `data/dashboard-filter-bindings.js`.

**Cluster A2 — Email-subscriber chips (252 LOC) → folds into Survey C**
- email-chip cluster (L33353–33604). Adjacent to
  `openEmailNotificationModal` (L32370–33067, Survey C) with only a ~285-line
  gap between them. Same feature domain (email notification subscriber
  management). Recommend a single `settings/email-notifications.js` extraction
  spanning both — see cross-survey note in the master plan.

## Aggregate

| Metric | Value |
|---|---|
| Genuine ≥150 LOC | 432 |
| Genuine blocks | 2 |
| False positives | 1 (`dashboard-filter-bindings.js`) |
| Sub-150 LOC tail | ~2,500 LOC across ~18 fns (not candidates at current bar) |
| Original Phase-4 estimate for this lane | ~8,000 LOC |
| **Estimate accuracy** | **Massively overstated (~18× the genuine ≥150 figure)** |
