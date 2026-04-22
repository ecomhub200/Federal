---
title: "Tier Scope Key"
aliases: [getTierScopeKey, tierChanged scope, scope key]
tags: [architecture, tier-navigation, events]
sources:
  - "daily/2026-04-22.md"
created: 2026-04-22
updated: 2026-04-22
---

# Tier Scope Key

`getTierScopeKey()` at `app/index.html:21792` returns a unique string identifying the currently active tier scope. The string shape is `<tier>_<id>` (e.g., `state_08`, `region_denver-metro`, `mpo_drcog`, `planning_district_pikes-peak`, `city_colorado-springs`, `county_08041`). It is the canonical identifier used by `tierChanged` CustomEvent listeners to decide whether their cached data for the previous scope is still valid.

## Key Points

- Consumed by the `tierChanged` event dispatched from every `handle{Tier}Selection()` handler via `detail.scopeKey`.
- Downstream listeners today include school, transit, and AI tabs; any tab that caches per-scope data must key its cache on this string.
- Reads its inputs from `jurisdictionContext`, which is populated by the per-tier selection handler before the event fires.
- Sibling function: `getTierScopeName()` at `app/index.html:21812` returns a human-readable name for the same scope (for UI indicators).

## Details

### Field sources per tier

| Tier | Key shape | Id read from |
|------|-----------|--------------|
| `state` | `state_<code>` | `jurisdictionContext.stateCode` (fallback `stateFips`) |
| `region` | `region_<id>` | `jurisdictionContext.tierRegion?.id` |
| `mpo` | `mpo_<id>` | `jurisdictionContext.tierMpo?.id` |
| `planning_district` | `planning_district_<id>` | `jurisdictionContext.tierPlanningDistrict?.id` |
| `city` | `city_<id>` | `jurisdictionContext.tierCity?.id` (the slug) |
| `county` (default) | `county_<fips>` | `jurisdictionContext.fullFips` (fallback `jurisdictionKey`) |

Every field falls back to the literal string `'unknown'` when missing, so the returned key is always non-empty. The `handle{Tier}Selection()` fallback `getTierScopeKey() || <rawId>` is therefore dead code and can be relied on to always get the computed key.

### Known failure mode: case collapsing

Until 2026-04-22 the function collapsed `'county'` and `'city'` into a single branch and had no case for `'planning_district'`. Because both `handlePlanningDistrictSelection()` and `handleCitySelection()` dispatch `tierChanged` events with `detail.scopeKey: getTierScopeKey()`, downstream listeners received a stale `county_<fips>` scope key while the user viewed a PD or City — silently miswiring caches to the wrong scope. Fixed by giving `'planning_district'` and `'city'` their own explicit cases (commit `0deec0d` on `claude/fix-tier-scope-key-KDpje`).

The general lesson: when a switch statement collapses N tiers into a `case 'a': case 'b': default:` block, adding a new tier will silently fall through to the default and nothing will alert you. Prefer explicit case-per-tier with exactly one true default.

### Sibling bug not yet fixed

`getTierScopeName()` at line 21812 has the same shape: `'city'` is grouped with `'county'` and `'planning_district'` has no case. When a user views a PD or City, the UI scope indicator falls back to `jurisdictionContext.jurisdictionName || 'County'`. This is flagged as a follow-up action item — see `daily/2026-04-22.md`.

## Related Concepts

- [[concepts/tier-boundary-layer-cleanup]] — the sibling site (`handleTierChange`) that also needs per-tier updates when a new tier is added

## Sources

- [[daily/2026-04-22.md]] — bug discovery, fix, and the five-site checklist for adding a new tier
