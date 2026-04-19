---
title: "Crash Profile Shapes (buildCountyWide / buildCMF / buildLocation / buildDetailedLocation)"
aliases: [crash-profile, build-profile, profile-builders]
tags: [data-shape, helpers, analysis]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Crash Profile Shapes

There are **four `build*CrashProfile(...)` helpers** in the codebase,
each producing a different shape for a different purpose. They are
easy to confuse because the names are nearly identical and JavaScript
function hoisting silently overwrites duplicate definitions. Picking
the wrong one is the most common source of subtle scope bugs in the
app.

## Key Points

- **Four helpers, four shapes**: county-wide aggregate, CMF-scoped
  aggregate, simple per-location, detailed per-location.
- **Do not rename these**. CLAUDE.md explicitly warns against it, and
  every state object stores a `crashProfile` that matches one of these
  shapes.
- **Shape determines consumer**: the AI resolver, the CMF UI, the Map
  jump handlers, and the Main AI tab each expect a specific shape.
- **Always compute from the right scope** — feeding county-wide
  `sampleRows` into `buildCMFCrashProfile` produces something nonsensical
  (and vice versa).

## Details

### The four builders

| Function                                | Returns                                      | Used by |
|-----------------------------------------|----------------------------------------------|---------|
| `buildCountyWideCrashProfile()`         | Aggregate stats for ALL crashes              | Main AI tab |
| `buildCMFCrashProfile()`                | Location + date filtered profile             | CMF tab |
| `buildLocationCrashProfile(crashes)`    | Simple `{total, K, A, B, C, O, epdo}`        | AI resolver, cross-tab handoffs |
| `buildDetailedLocationProfile(crashes)` | Detailed breakdowns (severity, collision, weather, light, ...) | Map jump handlers, richer selection UIs |

### Minimal shape (always present)

Every profile carries at least:

```javascript
{
  total: Number,
  K: Number, A: Number, B: Number, C: Number, O: Number,
  epdo: Number,
}
```

This minimum is what the AI resolver returns as `crashProfile` in any
scope — see [[concepts/ai-context-awareness]].

### Detailed shape (Map / rich UI)

```javascript
{
  ...minimum,
  severityDist: { K: 0.02, A: 0.07, B: 0.14, C: 0.25, O: 0.52 },
  collisionTypes: [{ label: "Rear-end", count: 87, pct: 0.34 }, ...],
  weatherDist:   [{ label: "Clear",    count: 180, pct: 0.71 }, ...],
  lightDist:     [{ label: "Daylight", count: 210, pct: 0.82 }, ...],
  nightCount:    46,
  pedCount:      3,
  bikeCount:     1,
  dateRange:     { from: "2022-01-01", to: "2024-12-31" },
}
```

The exact key set can grow, but everything downstream must be optional-
tolerant — downstream code must not assume `weatherDist` is present when
it was built by the simple helper.

### When to use which

- **Main AI tab (county-wide)** → `buildCountyWideCrashProfile()`
- **CMF tab** → `buildCMFCrashProfile()` (respects the CMF-specific date
  filter)
- **Cross-tab selection / AI handoffs** → `buildLocationCrashProfile()`
- **Map jump / richer selection panels / rich charts** →
  `buildDetailedLocationProfile()`

### Rules

1. **Never rename any of these functions.** Silent overwrite is the #1
   cause of hard-to-debug "the AI is giving wrong numbers" bugs.
2. **Do not add a 5th `build*CrashProfile` helper.** If a new shape is
   needed, add a non-`build*` helper (e.g. `summarizeBySubcategory`) so
   the naming collision surface stays fixed at four.
3. **Always feed the right input.** CMF expects the CMF-tab's
   `filteredCrashes`, not `sampleRows`. County-wide expects the full
   `aggregates`, not a slice.

## Common Pitfalls

- Passing a list of crash rows to `buildCountyWideCrashProfile()` — it
  doesn't take an argument; it reads the global aggregate.
- Using `buildLocationCrashProfile(crashes)` and expecting
  `severityDist` to be in the output — it isn't; use the detailed
  helper.
- Creating a helper in a new module with a name that looks similar
  (`buildProfile`, `getCrashProfile`, ...) — pollutes search and makes
  "which helper is used here?" harder to answer quickly.

## Related Concepts

- [[concepts/state-management]] — each state object stores a
  `crashProfile` built by one of these helpers
- [[concepts/ai-context-awareness]] — the resolver's return shape is
  the minimum profile
- [[concepts/epdo-weights]] — the `epdo` field on every profile
- [[concepts/module-architecture]] — keep these helpers in one module
  (`CL.analysis`) so the naming rule is enforceable
- [[concepts/grants-ranking]] — uses `buildLocationCrashProfile` for
  row selections
- [[concepts/warrants-analysis]] — `warrantsState.crashProfile` comes
  from `buildLocationCrashProfile`
- [[concepts/batch-before-after]] — per-location rollups
- [[connections/epdo-across-tabs]] — every profile's `epdo` field is
  part of the parity contract

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  CLAUDE.md "Function Naming Conventions" table
