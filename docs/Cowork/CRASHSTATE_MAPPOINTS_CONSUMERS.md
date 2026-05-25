# `crashState.mapPoints` Consumer Audit

> Compiled for **CC 313 — Perf Phase 3 (re-scoped): lazy hydrate
> `crashState.mapPoints`**. Date: 2026-05-25.
>
> Purpose: enumerate every read of `crashState.mapPoints` in the front-end,
> identify which tab activates each consumer, and justify the consumer-tab
> set that the lazy-hydrate gate keys on.

## TL;DR

- `_hydrateMapPointsFromMatview` previously fired on every
  `jurisdictionChanged` / `tierChanged` event, paying a 50K-row fetch
  (~4s wall at state / planning_district tier) regardless of whether
  any tab actually consumes the dataset.
- Map-tab Leaflet rendering does NOT consume `crashState.mapPoints` —
  it goes through `app/modules/data/supabase-map-bridge.js` (Phase 3
  viewport RPC, writes ONLY to Leaflet layers, explicit
  `Never mutates crashState.mapPoints`).
- The actual consumers are per-row filter pipelines in a handful of
  tabs. CC 313 defers the hydrate until the user opens one of them.

## Consumer-tab gate set (wide / safer)

```
{ 'map', 'hotspots', 'intersection', 'pedestrian', 'analysis',
  'warrants', 'cmf', 'assets' }
```

Encoded as `CL.map._MAP_POINTS_CONSUMER_TABS` in
`app/modules/map/map-points-hydrate.js`. The tab dispatcher
(`app/modules/app/tab-dispatcher.js`) checks the set inside `showTab(tabId)`
and fires `_hydrateMapPointsIfNeeded(reason, true)` on activation.

**Tab-ID verification** — every string above matches a real `tabId` argument
the dispatcher accepts (cross-checked against the `if (tabId === '…')` ladder
in `app/modules/app/tab-dispatcher.js`):

| Set entry | Dispatcher branch | Notes |
|---|---|---|
| `map` | `tabId === 'map'` (L62) | ✓ |
| `hotspots` | `tabId === 'hotspots'` (L253) | ✓ |
| `intersection` | `tabId === 'intersection'` (L251) | ✓ — singular, not "intersections" |
| `pedestrian` | `tabId === 'pedestrian'` (L252) | ✓ — not "pedbike" |
| `analysis` | `tabId === 'analysis'` (L250) | ✓ |
| `warrants` | `tabId === 'warrants'` (L284) | ✓ |
| `cmf` | `tabId === 'cmf'` (L263) | ✓ |
| `assets` | (no top-level branch) | ⚠ assets is a sub-feature of `map` and is reached via map mode-toggles, NOT a top-level tab. Kept in the set as a future-proof no-op; if a top-level Assets tab is ever added with `data-tab="assets"`, the hook lights up automatically. Today, asset consumers (L111672, L119768) are activated only while on the Map tab — `'map'` covers them. |

## Confirmed consumers (line-by-line audit)

| Consumer site | File:line | Function / context | Tab(s) that activate | Falls back gracefully if empty? |
|---|---|---|---|---|
| Map init center-of-mass | `app/index.html:40789` | `initMap()` — averages first 1K valid points to compute initial Leaflet view center | Map | ✅ Falls back to `MAP_CENTER` constant |
| Address-search "crashes near point" | `app/modules/map/map-layers.js:241` | `findCrashesNearPoint()` — Haversine filter | Map (address search) | ✅ `if (!crashState.mapPoints \|\| .length === 0) return;` |
| Map selection — route/node filter | `app/index.html:42526–42528` | `updateMapSelectionDetails()` — filters mapPoints by selected route or node | Map (selection mode) | ✅ Empty filter result yields zero counts |
| Map selection — ped/bike counts | `app/index.html:42532` | same as above | Map (selection mode) | ✅ `forEach` over empty array is a no-op |
| Batch B/A — guard | `app/modules/batch-ba/batch-ba-engine.js:18` | `startProcessing()` aborts with alert if mapPoints empty | Warrants → Batch B/A | ✅ Explicit empty-check |
| Batch B/A — radius filter | `app/modules/batch-ba/batch-ba-engine.js:253` | `_findCrashesInRadius()` Haversine | Warrants → Batch B/A | ✅ Returns `[]` if no points |
| Batch B/A modal — node filter | `app/index.html:59934` | `populateBatchBAPanel()` filters by node | Warrants → Batch B/A | ✅ `.filter()` returns `[]` |
| Batch B/A modal — route filter | `app/index.html:59941` | same as above | Warrants → Batch B/A | ✅ |
| Asset spatial grid | `app/index.html:111672` | `_updateAssetMapDisplay()` — builds spatial index | Map → Assets sub-feature | ✅ Guarded `if (!crashState.mapPoints \|\| .length === 0) return;` at L111652 |
| Asset proximity filter | `app/index.html:119768` | `updateAssetVisibilityByFilter()` — checks for nearby crashes | Map → Assets sub-feature | ✅ Optional-chained: `crashState.mapPoints?.length > 0` |
| Supabase fallback filter | `assets/js/data-client.js:539` | `getCrashesByLocationFallback()` — client-side filter when Supabase RPC fails | CMF / Warrants | ✅ Returns `[]` if `!crashState.mapPoints` (L538) |

## Mutators (writes — out of scope, listed for completeness)

| File:line | Function | Purpose |
|---|---|---|
| `app/modules/map/map-points-hydrate.js:144` | `_hydrateMapPointsFromMatview` | Cache hit — clamp + assign |
| `app/modules/map/map-points-hydrate.js:154` | `_hydrateMapPointsFromMatview` | Cache miss — assign fetched rows |
| `app/geocode-engine.js:362` | `_insertGeocodeResult()` | Incremental append during geocoding batch |
| `app/modules/spatial/geo-tier.js:434,875,1055` | `handleTierChange()`, `handleScopeChange()` | Defensive reset to `[]` on tier/scope swap |
| (~9 other `= []` / `= null` reset sites in `app/index.html`) | Various boot and reload paths | State reset on data reload |

## Non-tab-driven callers (none)

No MutationObserver, cross-tab navigation handler, background timer, or
debugger panel consumes `crashState.mapPoints`. Every confirmed consumer
is reachable only via:

1. Direct tab click (`navigateTo(tabId)` → `showTab(tabId)` → tab init).
2. User interaction within a tab already on a consumer (map click,
   batch-upload submit, asset toggle, address-bar search).
3. Tier / jurisdiction change events (which now flow through the lazy
   gate — same code path).

The lazy gate is therefore safe: no consumer code path is reachable
without first activating one of the gate tabs.

## Narrow set (deferred follow-up)

A narrower set — `{ 'map', 'warrants', 'cmf' }` (+ `'assets'` if ever
promoted to a top-level tab) — is what the line-by-line audit actually
proves is needed. `hotspots`, `intersection`, `pedestrian`, `analysis`
primarily read `crashState.aggregates` (a matview-backed summary
object), not `crashState.mapPoints`. They are included in the wide set
as a safety margin pending telemetry; if Phase 4 telemetry shows the
wider set never triggers a hydrate for those four tabs that turns out
to be needed, drop them in a follow-up PR.

## Verification (post-merge)

See the regression checklist in
`/root/.claude/plans/cc-313-compressed-parnas.md` §Verification.
