---
title: "CMF / Countermeasures Tab"
aliases: [cmf, countermeasures, cmfState, crash-modification-factors]
tags: [tab, cmf, countermeasures, evaluation]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# CMF / Countermeasures Tab

The CMF tab is the single-location interactive workbench for applying
**Crash Modification Factors** to a selected intersection or corridor.
Users pick a location, set a date window, pick one or more
countermeasures, and the tab computes expected crash reductions by
severity and overall EPDO. State lives on `cmfState` and is priority
slot #1 in the AI resolver.

## Key Points

- **Scope**: location + date, always. CMF never runs county-wide.
- **Data path**: `crashState.sampleRows` → filter by location →
  `cmfState.locationCrashes` → filter by date →
  `cmfState.filteredCrashes` → `cmfState.crashProfile`.
- **Countermeasure multiplication**: picked CMFs multiply together;
  each severity class gets its own expected-reduction estimate.
- **AI priority**: CMF selection beats cross-tab selection beats
  Warrants in [[concepts/ai-context-awareness]].
- **Outputs**: before vs expected-after severity table, percent
  reduction, EPDO impact, exportable worksheet.

## Details

### State shape

```javascript
cmfState = {
  selectedLocation: { route, node, ... } | null,
  locationCrashes: [/* location-filtered rows */],
  filteredCrashes: [/* + date-filtered */],
  crashProfile: { total, K, A, B, C, O, epdo, ... },
  dateRange: { from, to } | null,
  selectedCMFs: [
    { id, name, appliesTo: ["K","A","B","C","O"], factor: 0.82, source: "FHWA CMF Clearinghouse" },
    // ...
  ],
  result: {
    expectedSeverity: { K, A, B, C, O },
    expectedTotal: Number,
    expectedEpdo: Number,
    percentReduction: Number,
  },
};
```

### CMF application math

For a severity class `s`, with selected CMFs `c1, c2, ..., cn` that
each apply to `s`:

```
expected_s = observed_s × c1.factor × c2.factor × ... × cn.factor
```

CMFs that don't apply to `s` are skipped. Total expected crashes is
the sum across severities; expected EPDO comes from
[[concepts/epdo-weights]] applied to the expected severity vector.

### CMF source of truth

Countermeasures reference the **FHWA CMF Clearinghouse**
(https://www.cmfclearinghouse.org/). Entries should include the
source ID, star rating, and the applicability (which severities/
crash types). If a countermeasure is not in the Clearinghouse, label
it explicitly as engineering judgement and don't represent it as
peer-reviewed.

### Cross-tab behavior

- When the user picks a location from the Map or Hotspots, the
  receiving flow writes both `selectionState` and `cmfState` so the AI
  tab also sees the scope (see [[connections/state-scope-and-ai-context]]).
- When the user clears the CMF location, the tab must reset
  `cmfState.*` back to null and fire `updateAIContextIndicator()`.
  The resolver then falls through to `selectionState`, Warrants, or
  county-wide as appropriate.

### Relationship to Batch Before/After

CMF is **a priori** — it says "if we apply X, we expect Y% reduction."
Batch B/A is **a posteriori** — "we applied treatments on these dates;
what actually happened." They share severity math and EPDO but are
distinct analyses. See [[concepts/batch-before-after]].

## Common Pitfalls

- **Applying a CMF that doesn't apply to the selected severity**
  silently inflates reductions — validate each CMF's `appliesTo`
  against the dataset's severity distribution before multiplying.
- **Chaining CMFs that target the same mechanism** (e.g. two
  countermeasures that each independently address left-turn head-on
  crashes) — multiplicative math over-credits the combined effect.
  Use engineering judgement or the Clearinghouse's combined-factor
  guidance when available.
- **Forgetting to rebuild `filteredCrashes`** when the date range
  changes — the CMF output lags the UI.
- **Mixing `locationCrashes` into the math** when a date filter is
  active — always read from `filteredCrashes`.

## Related Concepts

- [[concepts/state-management]] — `cmfState` scope
- [[concepts/epdo-weights]] — expected-EPDO math
- [[concepts/ai-context-awareness]] — CMF is priority slot #1
- [[concepts/crash-profile-shapes]] — `buildCMFCrashProfile()` is the
  builder for this tab
- [[concepts/batch-before-after]] — a-priori vs a-posteriori contrast
- [[concepts/module-architecture]] — this tab's code should live under
  `CL.cmf` (some of it currently lives in the monolithic areas of
  `app/index.html` awaiting extraction)
- [[concepts/proven-safety-countermeasures]] — PSC overlay on top of
  CMF selection
- [[concepts/grants-ranking]] — common upstream; grant rows jump here
- [[concepts/map-tab]] — common upstream; map clicks jump here
- [[concepts/date-filters]] — post-location date-filter semantics
- [[connections/state-scope-and-ai-context]] — location/date selection
  must pair with indicator updates
- [[connections/epdo-across-tabs]] — EPDO computed here must match
  EPDO reported elsewhere

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  CLAUDE.md "Tab-Specific Data Sources" + the `cmfState` shape in
  CLAUDE.md's State Management table
