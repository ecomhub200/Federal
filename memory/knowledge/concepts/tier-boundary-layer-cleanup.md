---
title: "Tier Boundary Layer Cleanup"
aliases: [handleTierChange cleanup, boundary clearing, remove boundary layer]
tags: [architecture, tier-navigation, map, leaflet]
sources:
  - "daily/2026-04-22.md"
created: 2026-04-22
updated: 2026-04-22
---

# Tier Boundary Layer Cleanup

Each tier in the Federal / CrashLens navigation system has its own colored boundary overlay on the Leaflet map (state outline, region, MPO, planning district = teal, city = amber, county jurisdiction). When the user switches tier or picks a new item within a tier, the previously-drawn overlay must be explicitly removed or it will linger on the map. The cleanup happens in two places: globally in `handleTierChange()`, and per-tier in each `handle{Tier}Selection()` handler.

## Key Points

- **`handleTierChange(tier)`** at `app/index.html:20896` runs on every tier dropdown switch. Its clearing block (lines 20903–20916) calls every `remove{Tier}BoundaryLayer()` helper unconditionally so the canvas is clean before the new tier draws.
- **`handle{Tier}Selection()`** handlers (one per tier) each call the other tiers' `remove*BoundaryLayer()` helpers before drawing their own overlay — enforcing mutual exclusion so only one tier boundary is ever on the map.
- The `remove{Tier}BoundaryLayer()` helpers are idempotent and safe to call when the layer isn't mounted (they check `crashMap` exists and the layer is non-null before removing).

## Details

### Cleanup sites per tier

| Tier | Remove helper | Defined at |
|------|---------------|------------|
| State outline | inline `crashMap.removeLayer(builtInLayersState._stateOutlineLayer)` | `handleTierChange` 20907–20910 |
| Region | `removeRegionBoundaryLayer()` | — |
| MPO | `removeMPOBoundaryLayer()` | — |
| Planning District | `removePlanningDistrictBoundaryLayer()` | `app/index.html:133963` |
| City | `removeCityBoundaryLayer()` | `app/index.html:134075` |
| County jurisdiction | `removeJurisdictionBoundaryLayer()` (guarded by `tier !== 'county'`) | `handleTierChange` 20911–20916 |

### Known failure mode: forgotten clear

Until 2026-04-22, `handleTierChange()` called `removeMPOBoundaryLayer` and `removeRegionBoundaryLayer` in its clearing block but *not* `removePlanningDistrictBoundaryLayer` or `removeCityBoundaryLayer`. The per-tier selection handlers (`handlePlanningDistrictSelection`, `handleCitySelection`) DID clear them as siblings, so mutual exclusion within a tier switch worked. But if the user picked a PD, saw the teal overlay, then switched the tier dropdown to State / County / Federal (without yet picking a new value), `handleTierChange` ran alone and the teal PD overlay stayed painted. Same symptom for the amber City overlay. Fixed by adding both unconditional calls to the cleanup block (commit `0deec0d` on `claude/fix-tier-scope-key-KDpje`).

### Checklist when adding a new tier

Based on the PR #5 review, adding a new tier to this navigation system requires updates at five coordinated sites. PR #5 updated the last three but missed the first two:

1. `getTierScopeKey()` at line 21792 — add a case emitting `<tier>_<id>`
2. `getTierScopeName()` at line 21812 — add a case returning the human-readable name
3. `handleTierChange()` clearing block (lines 20903–20916) — add `remove{Tier}BoundaryLayer()` call
4. `handle{Tier}Selection()` handler — clear ALL sibling boundaries, draw own boundary, load aggregates, dispatch `tierChanged` event
5. `remove{Tier}BoundaryLayer()` helper — idempotent Leaflet layer removal

Static-analysis assertions covering sites 1 and 3 now live in `tests/test_boundary_display.js` sections 7 and 7b.

## Related Concepts

- [[concepts/tier-scope-key]] — the complementary function that emits the scope identifier used in `tierChanged` events

## Sources

- [[daily/2026-04-22.md]] — bug discovery, fix, and the five-site checklist for adding a new tier
