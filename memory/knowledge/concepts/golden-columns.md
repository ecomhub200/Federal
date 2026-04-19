---
title: "GOLDEN_COLUMNS (canonical crash schema)"
aliases: [golden-columns, canonical-schema, column-layout, COL]
tags: [data-schema, normalizer, core]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# GOLDEN_COLUMNS (canonical crash schema)

`GOLDEN_COLUMNS` is the canonical, position-indexed crash schema that
every state normalizer emits and every feature module reads from. It
is the **contract between the data pipeline and the front-end**. The
named indices in the `COL` object (e.g. `COL.ROUTE`, `COL.SEVERITY`)
are the only way new code should reference columns — never raw
integer indices, never string headers.

## Key Points

- **Positional, not key-based**: rows in `crashState.sampleRows` are
  arrays; each index has a named constant in `COL`.
- **Stable order**: adding a column means appending to the end, not
  reordering. Reordering is a breaking change for every aggregate,
  cached view, and downstream module.
- **Documented in CLAUDE.md's "Column Reference (COL object)"
  section** — the key indices (ROUTE, NODE, SEVERITY, COLLISION,
  PED, BIKE, WEATHER, LIGHT, DATE) are the ones every new feature
  is expected to already know.
- **Position 53 = `DOT District`**, position 60 = `VSP` — see
  [[concepts/dot-neutral-naming]] for the full DOT-neutral vs legacy
  mapping.
- **Normalizers must emit every `GOLDEN_COLUMNS` slot** in order, with
  empty string or null where the source doesn't provide a value. No
  fabricating, no reusing adjacent fields.

## Details

### Named constants (the `COL` object, partial list)

| Constant         | Purpose |
|------------------|---------|
| `COL.ROUTE`      | Normalized road/route name |
| `COL.NODE`       | Intersection node ID |
| `COL.SEVERITY`   | KABCO severity (`K` / `A` / `B` / `C` / `O`) |
| `COL.COLLISION`  | Collision type (rear-end, angle, etc.) |
| `COL.PED`        | Pedestrian-involved flag (1/0) |
| `COL.BIKE`       | Bicycle-involved flag (1/0) |
| `COL.WEATHER`    | Weather conditions |
| `COL.LIGHT`      | Light conditions |
| `COL.DATE`       | Crash date |
| `COL.YEAR`       | 4-digit year |
| `COL.LAT` / `COL.LON` | Coordinates |
| `COL.DISTRICT`   | "DOT District" (position 53) |
| `COL.VSP`        | Virginia State Police flag (position 60, Virginia-specific) |

`COL` lives under `CL.core.constants` (or the legacy global `COL`;
see [[connections/module-namespace-vs-legacy-state]]).

### Canonical severity values

Only `K`, `A`, `B`, `C`, `O` are valid in `COL.SEVERITY`. Normalizers
convert whatever the source uses (e.g. Virginia "1" through "5",
Delaware "Fatal"/"Serious Injury"/...) into these letters. EPDO
(see [[concepts/epdo-weights]]) is defined only for this set.

### DOT-neutral values in `SYSTEM`-like columns

Road classification columns use DOT-neutral values (`DOT Interstate`,
`DOT Primary`, `Non-DOT secondary`, ...) — see
[[concepts/dot-neutral-naming]] for the full mapping. Normalizers
that emit legacy `VDOT`/`NonVDOT` strings will break filter
dropdowns for every state.

### Adding a new column

1. Pick a position at the end of `GOLDEN_COLUMNS`.
2. Add a constant to `COL` with a clear name.
3. Update every `{State}Normalizer` to emit the new column (empty
   string if the source doesn't provide it).
4. Update any aggregate builder that should now roll up the new
   column.
5. Update this article and the onboarding doc references.

Do **not** reorder existing columns to "group related fields." The
array-index contract is more valuable than readability of the
schema definition.

## Common Pitfalls

- **Using raw integer indices** (`row[14]`) in feature code — silent
  breakage when the schema appends a new column.
- **Mixing state-specific raw columns** into normalized processing
  — breaks multi-state. The normalizer is the only place that should
  know about source-specific fields.
- **Persisting column layout** (e.g. writing the positional array to
  a file and then comparing by position months later) without a
  version tag — future additions break the comparison.

## Related Concepts

- [[concepts/dot-neutral-naming]] — DOT-neutral values for position
  53 and related SYSTEM columns
- [[concepts/state-onboarding]] — normalizers must produce this
  schema
- [[concepts/epdo-weights]] — `COL.SEVERITY` values feed `calcEPDO`
- [[concepts/state-management]] — `crashState.sampleRows` arrays
  conform to this schema
- [[concepts/module-architecture]] — `COL` lives under
  `CL.core.constants`
- [[concepts/date-filters]] — `COL.DATE` is the column the filter
  predicate reads
- [[concepts/safety-focus]] — predicates read `COL.PED` / `COL.BIKE`
  / etc.
- [[concepts/upload-pipeline]] — normalized output conforms to this
  schema
- [[connections/module-namespace-vs-legacy-state]] — `COL` is
  accessed both through `CL.core` and via a legacy global

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding
  from CLAUDE.md "Column Reference (COL object)" and "DOT-Neutral
  Column Naming Convention"
