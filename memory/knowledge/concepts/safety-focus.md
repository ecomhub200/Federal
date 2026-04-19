---
title: "Safety Focus Tab"
aliases: [safety-focus, safetyState, focus-area]
tags: [tab, safety, vulnerable-users, category]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Safety Focus Tab

The Safety Focus tab surfaces crashes for specific focus areas (e.g.
pedestrian, bicycle, teen driver, older driver, large truck, distracted
driving, impaired driving, night-time) so planners can see where each
focus group's crashes cluster and how severity stacks up. State is kept
on `safetyState.data[category]`.

## Key Points

- **Category-scoped**: each tab view is one focus category at a time;
  users switch categories via a selector.
- **Date filter**: optional; applies to each category's crash list
  before any rendering.
- **Vulnerable-user flags** (`COL.PED`, `COL.BIKE`) drive two of the
  most important categories.
- **Other categories** rely on collision-type, age, distraction, and
  time-of-day flags extracted from `sampleRows`.
- **Output**: per-category severity breakdown, EPDO, typical collision
  types, and a map-ready subset for plotting.

## Details

### State shape

```javascript
safetyState = {
  data: {
    pedestrian:   { crashes: [...], crashProfile: {...}, lastBuilt: 1710... },
    bicycle:      { crashes: [...], crashProfile: {...} },
    teenDriver:   { crashes: [...], crashProfile: {...} },
    nightTime:    { crashes: [...], crashProfile: {...} },
    // ... etc.
  },
};
```

Each entry is lazily built when the category is first viewed, then
cached until the global dataset or date filter changes.

### Category predicates

The predicate for each category lives near the Safety Focus module (as
the app modularizes, this should land at
`app/modules/safety-focus/safety-focus-categories.js` alongside the
state/engine/ui split, per [[concepts/module-architecture]]). Typical
predicates:

| Category       | Predicate |
|----------------|-----------|
| Pedestrian     | `row[COL.PED] === 1` |
| Bicycle        | `row[COL.BIKE] === 1` |
| Teen driver    | driver age ∈ `[15, 19]` |
| Older driver   | driver age ≥ `65` |
| Night-time     | `COL.LIGHT` indicates dark-no-light / dark-lit |
| Impaired       | alcohol/drug flag set on any person in the crash |
| Distracted     | distraction attribute set |
| Large truck    | vehicle type indicates truck |

Different states may expose different raw fields for these flags; the
normalizer (see [[concepts/state-onboarding]]) is responsible for
translating them so the predicates above work uniformly.

### AI scope

Safety Focus categories are **not** in the AI resolver's priority order
as a distinct scope. If the user asks the AI about a focus category,
the correct pattern is to synthesize a location-like context using
`selectionState` with a `fromTab: "safety-focus"` tag, or have the AI
tab read `safetyState.data[currentCategory]` explicitly when it
detects the Safety Focus tab is active. This is a known gap; see
`connections/` candidates for a future write-up.

## Common Pitfalls

- **Building every category eagerly** on load — unnecessary work; be
  lazy.
- **Forgetting to invalidate cached categories** when the global date
  filter changes — results drift.
- **Using a raw state's non-normalized fields** (e.g. VDOT-specific
  person flags) in the predicate; use only the normalized fields
  guaranteed by the adapter.

## Related Concepts

- [[concepts/state-management]] — `safetyState` scope
- [[concepts/epdo-weights]] — severity weighting inside each category's
  `crashProfile`
- [[concepts/dot-neutral-naming]] — predicates must use normalized
  columns only
- [[concepts/module-architecture]] — the module layout this tab should
  migrate to
- [[concepts/state-onboarding]] — normalizer emits the flags the
  predicates rely on
- [[concepts/date-filters]] — post-category date filter semantics
- [[concepts/golden-columns]] — predicates read `COL.PED` /
  `COL.BIKE` / `COL.LIGHT` / etc. from the canonical schema

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  CLAUDE.md "Tab-Specific Data Sources"; predicates are the typical
  FHWA/HSIP focus-area set pending module-level verification
