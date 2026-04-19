---
title: "Batch Before/After Tab"
aliases: [batch-ba, before-after, batch-evaluation, CL.batchBA]
tags: [tab, evaluation, cmf, export]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Batch Before/After Tab

The Batch Before/After tab runs observational before/after evaluations
across a list of treated locations at once, producing CMF-style effect
estimates plus export artifacts (CSV, PDF detailed and summary, KML).
It lives under `CL.batchBA` in `app/modules/batch-ba/` and is split
across ten sub-modules to respect the 500-line per-file cap.

## Key Points

- **Input:** a user-uploaded list of locations + treatment dates + the
  already-loaded crash dataset (`crashState.sampleRows`).
- **Per-location state:** `baState.locationCrashes` /
  `baState.locationStats`; the "batch" is an outer loop that processes
  each location independently.
- **Evaluation period:** default is 3 years before and 3 years after
  the treatment date (duration is configurable via
  `batch-ba-duration.js`).
- **Outputs:** per-location and aggregate effect estimates (simple
  before/after), severity-weighted outcomes (EPDO), plus charts and
  exports.
- **Uploads** are handled separately in `batch-ba-upload.js` because
  location lists often come as CSV with quirky headers.

## Details

### Module map

| File                             | Role |
|----------------------------------|------|
| `batch-ba-state.js`              | `baState` definition + mutation helpers |
| `batch-ba-upload.js`             | CSV upload + parse of location list |
| `batch-ba-duration.js`           | Before/after window configuration |
| `batch-ba-engine.js`             | Per-location evaluation loop |
| `batch-ba-results.js`            | Results table rendering |
| `batch-ba-charts.js`             | Visualizations |
| `batch-ba-export-csv.js`         | CSV export |
| `batch-ba-export-pdf.js`         | Summary PDF |
| `batch-ba-export-pdf-details.js` | Per-location detailed PDF |
| `batch-ba-export-kml.js`         | KML for Google Earth |

### Evaluation math (observational B/A)

For each location and each severity category (K, A, B, C, O, total,
EPDO):

```
percentChange = (after - before) / before * 100
effect        = 1 - (after / before)      // positive = reduction
```

Engineers typically report **percent change in total crashes** and
**percent change in EPDO** as the headline numbers; individual severity
classes are shown for context but are statistically noisy at small
locations.

### Subcategory support

Recent work added **Streetlight (Nighttime)** as a subcategory (see the
merge commits on `main`). Subcategories pre-filter `sampleRows` by a
specific crash condition (e.g. night-time crashes only) before running
the B/A math. Any new subcategory must:

1. Define its filter predicate in `batch-ba-state.js` (or near it).
2. Appear in the subcategory dropdown built by `batch-ba-results.js`.
3. Feed the filtered rows into the engine so the B/A windows are
   computed on the correct subset.

### Relationship to the single-location CMF tab

Both tabs compute before/after-style effects, but:

- **CMF tab** is one location at a time, interactive, with countermeasure
  selection and CMF multiplication.
- **Batch B/A** skips countermeasure selection — it's purely an
  observational evaluation across a provided list.
- They do **not** share the same helpers; each tab owns its own
  evaluation code to keep the batch path fast and the CMF path
  configurable.

## Common Pitfalls

- **Reusing `cmfState` fields inside the batch engine** — batch must
  read only from its own `baState`. Mixing these breaks the AI
  resolver's priority order (see [[concepts/ai-context-awareness]]).
- **Editing one export module without the others** — headers often need
  to match across CSV/PDF exports; a field added to one should be added
  to all that are relevant.
- **Treating subcategory rollout as UI-only** — a new subcategory
  without an engine filter silently evaluates against *all* crashes.
  There was a recent 4-bug regression on the Streetlight subcategory;
  future subcategory PRs should add a regression test or at least a
  screenshot showing filtered counts matching expectations.

## Related Concepts

- [[concepts/state-management]] — `baState` scope
- [[concepts/epdo-weights]] — severity-weighted outcome metric
- [[concepts/module-architecture]] — `CL.batchBA` is the canonical
  example of a feature split into sub-modules under the 500-line cap
- [[concepts/crash-profile-shapes]] — per-location profiles for the
  export rollups
- [[concepts/ai-context-awareness]] — batch-selected locations feed
  `selectionState` so the AI resolver picks them up
- [[concepts/cmf-tab]] — a-priori counterpart to this a-posteriori
  evaluation
- [[concepts/date-filters]] — windows come from treatment dates, not
  from the user-set global date filter
- [[connections/epdo-across-tabs]] — B/A deltas use the same
  `calcEPDO` as every other tab

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  CLAUDE.md + verified against `app/modules/batch-ba/*.js`
