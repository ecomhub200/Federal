---
title: "Warrants Tab (Signal Warrant Analysis, MUTCD)"
aliases: [warrants, signal-warrant, mutcd-warrants]
tags: [tab, mutcd, traffic-engineering, intersection]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Warrants Tab (Signal Warrant Analysis, MUTCD)

The Warrants tab evaluates whether an intersection meets one or more of
the **MUTCD signal warrants** based on the loaded crash history
(supplementing volume data when available). Engine code lives under
`CL.warrants` in `app/modules/warrants/signal.js`.

## Key Points

- **Location-scoped**: Warrants always operates against
  `warrantsState.selectedLocation` (an intersection/node), never county-
  wide.
- **Two filters apply**: location (required) and date range (optional).
  Results read from `warrantsState.filteredCrashes`.
- **Standards reference**: MUTCD warrants — most commonly Warrant 7
  (Crash Experience) is the one the tool can evaluate from crash data
  alone; warrants 1–6 require volume data that may not be in the loaded
  dataset.
- **Output includes a pass/fail per evaluated warrant**, the relevant
  threshold, and the crash-derived inputs that fed the calculation, so
  the engineer can defend the result in a report.

## Details

### State shape

```javascript
warrantsState = {
  selectedLocation: { route, node, ... } | null,
  locationCrashes: [/* all crashes at the location */],
  filteredCrashes: [/* after date filter */],
  crashProfile: { /* severity + EPDO + ... */ },
};
```

### What the engine needs

- **3 years of crash data minimum** for Warrant 7 (Crash Experience) per
  MUTCD; the engine must surface a warning if the date-filtered window
  is shorter.
- **Correctable-by-signalization** crash types are the relevant subset
  for Warrant 7; the engine filters collision types that signals can
  remediate (typically angle, left-turn head-on, rear-end under
  specific conditions).
- **Severity threshold**: Warrant 7 classically requires 5+ reported
  crashes of types susceptible to correction by signal control within
  a 12-month period; the engine evaluates rolling 12-month windows
  across the filtered range.

### Cross-tab flow

Warrants only accepts a location — users typically enter the tab after
picking an intersection on the Map or Hotspots tab. When that happens:

1. Writer tab sets `selectionState.location` + `selectionState.crashes`.
2. Warrants tab copies into `warrantsState.selectedLocation` and
   `warrantsState.locationCrashes`.
3. The date filter rebuilds `warrantsState.filteredCrashes`.
4. The engine evaluates the warrants on the filtered set.

The AI resolver falls through to Warrants only when CMF isn't holding a
location — see [[concepts/ai-context-awareness]].

### Output shape

```javascript
{
  warrants: [
    {
      id: "warrant_7",
      name: "Crash Experience",
      met: true,
      threshold: { crashesIn12Months: 5, window: "12 months" },
      observed: { maxIn12Months: 6, windowStart: "2023-05", windowEnd: "2024-04" },
      correctableTypes: ["Angle", "Left-turn head-on"],
    },
    // ...
  ],
  dataWarnings: [
    /* e.g. "Filtered range is 18 months; MUTCD recommends 36+." */
  ],
}
```

## Common Pitfalls

- **Using unfiltered `locationCrashes`** instead of `filteredCrashes` —
  gives inconsistent results when a user sets a date range.
- **Counting non-correctable collision types** in Warrant 7 — inflates
  the crash count and produces false "warrant met" conclusions.
- **Silently evaluating against < 12 months of data** — must surface a
  `dataWarnings` entry so the user doesn't cite a misleading result.

## Related Concepts

- [[concepts/state-management]] — `warrantsState` scope
- [[concepts/ai-context-awareness]] — Warrants is priority slot 3 in
  the resolver
- [[concepts/module-architecture]] — `CL.warrants` in
  `app/modules/warrants/signal.js`
- [[concepts/crash-profile-shapes]] — the `crashProfile` stored on
  `warrantsState` comes from `buildLocationCrashProfile()`
- [[concepts/date-filters]] — post-location date filter semantics
- [[connections/state-scope-and-ai-context]] — warrants selection
  must update the AI indicator like every other tab

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  CLAUDE.md "Tab-Specific Data Sources" + `app/modules/warrants/signal.js`
