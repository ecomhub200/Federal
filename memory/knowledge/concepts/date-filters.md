---
title: "Date Filters (Cross-Tab Pattern)"
aliases: [date-filter, dateRange, time-filter]
tags: [conventions, state, ui]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Date Filters (Cross-Tab Pattern)

Several tabs support a date-range filter, but the **scope** at which
each one applies the filter differs. Getting this wrong is a common
source of "counts don't match" bugs. This article codifies when a
date filter applies pre-scope vs post-scope, which tabs support it
at all, and the shape every tab agrees on.

## Key Points

- **Shape is uniform**: `{ from: "YYYY-MM-DD" | null, to: "YYYY-MM-DD" | null }`.
- **Null on either side means open-ended** in that direction.
- **`from` and `to` are inclusive**.
- **Tabs differ on when the filter applies**: CMF/Warrants apply it
  *after* location selection; Grants applies it *before* ranking;
  Map uses Year as its temporal filter, not a range; Hotspots /
  Dashboard / Analysis don't support a filter at all.
- **AI resolver carries the active filter** on its return value as
  `dateRange`, so the AI tab's answers stay scoped correctly.

## Details

### Per-tab behavior

| Tab              | Supports filter? | Applied… |
|------------------|------------------|----------|
| Dashboard        | No               | — |
| Analysis         | No               | — |
| Map              | No (uses Year multi-select) | — |
| Hotspots         | No               | — |
| CMF              | Yes              | **post**-location (on `locationCrashes`) |
| Warrants         | Yes              | **post**-location (on `locationCrashes`) |
| Grants           | Yes (optional)   | **pre**-rank (on `sampleRows`) |
| Before/After     | Engine-controlled (before/after windows come from the treatment date, not a user filter) | — |
| Safety Focus     | Yes              | post-category |
| AI Assistant     | Inherited        | whatever the currently-selected scope carries |

### Why the split

- **CMF / Warrants** are location-specific; the user picks a location
  first, then narrows in time. Applying the filter pre-location
  would produce nonsense — you can't select a location out of a set
  that's already been time-pruned without showing totals drift.
- **Grants** ranks across the dataset, so pruning to a specific
  year range before ranking produces the grant-ready list for that
  period. Post-rank filtering would require re-ranking anyway.
- **Batch B/A** derives its windows from treatment dates, not a
  global user filter. A user-set filter here would fight with the
  before/after window logic.

### Canonical filter application

```javascript
function applyDateFilter(rows, dateRange) {
  if (!dateRange || (!dateRange.from && !dateRange.to)) return rows;
  const from = dateRange.from ? new Date(dateRange.from) : null;
  const to   = dateRange.to   ? new Date(dateRange.to)   : null;
  return rows.filter(r => {
    const d = new Date(r[COL.DATE]);
    if (from && d < from) return false;
    if (to   && d > to)   return false;
    return true;
  });
}
```

Every tab should use the same helper; divergent per-tab date
filtering is a smell. Place it in `CL.utils.date` (or wherever
`date-utils.js` lives — see [[concepts/module-architecture]]).

### Interaction with aggregates

`crashState.aggregates` is **not** date-filtered — it represents the
full loaded dataset. If a date-filtered aggregate is needed, build
it fresh from `sampleRows`; don't try to "subtract" from the global
aggregate.

### AI resolver hand-off

When the AI resolver resolves a scope, it includes the active
`dateRange` (or null). The AI prompt builder must include that range
in the context so the AI doesn't produce answers that contradict
the visible filter. See [[concepts/ai-context-awareness]].

## Common Pitfalls

- **Mixing pre-rank and post-location semantics** in a new tab —
  pick one, document it in this article.
- **Inconsistent inclusivity** — `from`/`to` are inclusive; off-by-
  one errors on ISO parse (`new Date("2024-12-31")` is midnight UTC)
  can drop the last day for east-coast users. Test with a row dated
  exactly on `to`.
- **Applying the filter multiple times** as the row moves through
  layers (e.g. pre-location then again post-location) — silently
  correct but wastes cycles; keep the application point explicit.
- **Bypassing the shared helper** — hand-rolled predicates drift.

## Related Concepts

- [[concepts/state-management]] — each tab's `dateRange` lives on
  the tab's state object
- [[concepts/cmf-tab]], [[concepts/warrants-analysis]],
  [[concepts/grants-ranking]], [[concepts/safety-focus]],
  [[concepts/batch-before-after]] — the tabs that (don't) support a
  filter, each in their own way
- [[concepts/ai-context-awareness]] — resolver carries `dateRange`
- [[concepts/module-architecture]] — the shared helper lives in
  `CL.utils.date`
- [[concepts/golden-columns]] — `COL.DATE` is the column the
  predicate reads

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding
  from CLAUDE.md "Tab-Specific Data Sources" filter column
