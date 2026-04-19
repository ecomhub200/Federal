---
title: "State Management (Global State Objects)"
aliases: [crashState, cmfState, warrantsState, selection-state]
tags: [architecture, data-flow, frontend]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# State Management (Global State Objects)

The crash-analysis SPA uses a set of named global state objects — one per
feature area — to share data across tabs. There is no reactive store
(Redux/Zustand/etc.); tabs read and write these globals directly, and
cross-tab coordination is done via a dedicated `selectionState` object.

## Key Points

- **`crashState`** is the primary raw-data store; everything else derives
  from it.
- **Per-tab state objects** hold tab-specific filters and results (CMF,
  Warrants, Grants, Before/After, Safety Focus).
- **`selectionState`** is the cross-tab channel used when a user jumps from
  Map → CMF, Hotspots → Grants, etc.
- **`aiState`** holds conversation history for the AI tab; its *context*
  (what the AI is reasoning about) comes from whichever feature state is
  currently selected.
- Mixing scopes (e.g. showing `crashState.aggregates` counts next to
  `cmfState.filteredCrashes` counts) is the most common source of UI
  inconsistency bugs.

## Details

### State inventory

| State object       | Purpose                       | Key properties |
|--------------------|-------------------------------|----------------|
| `crashState`       | Primary crash data storage    | `sampleRows[]`, `aggregates`, `totalRows`, `loaded` |
| `cmfState`         | CMF / Countermeasures tab     | `selectedLocation`, `locationCrashes[]`, `filteredCrashes[]`, `crashProfile` |
| `warrantsState`    | Warrants tab                  | `selectedLocation`, `locationCrashes[]`, `filteredCrashes[]`, `crashProfile` |
| `grantState`       | Grants tab                    | `allRankedLocations[]`, `loaded` |
| `baState`          | Before/After study            | `locationCrashes[]`, `locationStats` |
| `safetyState`      | Safety Focus tab              | `data[category].crashes[]` |
| `selectionState`   | Cross-tab selection channel   | `location`, `crashes[]`, `crashProfile`, `fromTab` |
| `aiState`          | AI assistant                  | `conversationHistory[]`, `attachments[]` |

### Data-flow hierarchy

```
crashState.sampleRows  (raw CSV data)
    │
    ├─► crashState.aggregates  (pre-computed statistics)
    │        └─► Main AI Tab (county-wide analysis)
    │        └─► Dashboard, Analysis tabs
    │
    ├─► cmfState.locationCrashes  (location-filtered)
    │        └─► cmfState.filteredCrashes  (+ date-filtered)
    │                 └─► CMF Tab & CMF AI Assistant
    │
    ├─► warrantsState.locationCrashes  (location-filtered)
    │        └─► warrantsState.filteredCrashes  (+ date-filtered)
    │                 └─► Warrants Tab
    │
    └─► selectionState.crashes  (user selection)
             └─► Cross-tab navigation (Map → CMF, Map → Grants, ...)
```

### Tab data sources

| Tab                  | Data source                          | Filters applied  |
|----------------------|--------------------------------------|------------------|
| Dashboard            | `crashState.aggregates`              | none             |
| Analysis             | `crashState.aggregates`              | none             |
| Map                  | `crashState.sampleRows`              | Year, Route, Severity |
| Hotspots             | `crashState.aggregates.byRoute`      | none             |
| CMF / Countermeasures| `cmfState.filteredCrashes`           | Location + Date  |
| Warrants             | `warrantsState.filteredCrashes`      | Location + Date  |
| Grants               | `grantState.allRankedLocations`      | Optional Date    |
| Before/After         | `baState.locationCrashes`            | Location         |
| Safety Focus         | `safetyState.data[category]`         | Category + Date  |
| AI Assistant         | context-aware (see below)            | matches selected location if any |

### AI context awareness

`getAIAnalysisContext()` resolves, in priority order:

1. `cmfState.selectedLocation`
2. `selectionState.location` (cross-tab selection from Map/Hotspots)
3. `warrantsState.selectedLocation`
4. Fallback: county-wide `crashState.aggregates`

Any tab that changes the user's "current focus" should update the cross-tab
selection via `selectionState` and trigger `updateAIContextIndicator()` so
the AI tab reflects the new scope.

### Practical rules

- Decide the scope (county-wide vs. location vs. date-filtered) **before**
  picking a state object; don't read across scopes.
- Use `crashState.aggregates` for fast, pre-computed totals; drop down to
  `sampleRows` only when you need per-crash detail.
- When a feature adds a new filter, make sure every tab that shares the
  underlying state respects it.
- Debugging helpers live on the window; ready-made console snippets for
  inspecting the state objects and verifying count parity live in the
  "Debugging Tips" section of the root `CLAUDE.md`.

## Related Concepts

- [[concepts/epdo-weights]] — applied to severity counts inside every state
  object's `crashProfile`
- [[concepts/module-architecture]] — defines where state objects live in
  the `CL.*` namespace
- [[concepts/dot-neutral-naming]] — column constants (`COL.*`) used when
  reading rows out of `crashState.sampleRows`
- [[concepts/ai-context-awareness]] — the resolver that reads *through*
  these state objects to build AI scope
- [[concepts/state-onboarding]] — normalized data ends up in
  `crashState.sampleRows` via this pipeline
- [[concepts/crash-profile-shapes]] — every state object's `crashProfile`
  matches one of the four canonical shapes
- [[concepts/hotspots]] — consumes `crashState.aggregates.byRoute`
- [[concepts/grants-ranking]] — owns `grantState`
- [[concepts/warrants-analysis]] — owns `warrantsState`
- [[concepts/batch-before-after]] — owns `baState`
- [[concepts/safety-focus]] — owns `safetyState`
- [[concepts/cmf-tab]] — owns `cmfState`
- [[concepts/map-tab]] — reads `crashState.sampleRows` directly, writes
  `selectionState`
- [[concepts/dashboard-analysis-tabs]] — reads `crashState.aggregates`
- [[concepts/golden-columns]] — positional schema that
  `crashState.sampleRows` rows conform to
- [[concepts/date-filters]] — per-tab date filter lives on each state
  object
- [[connections/state-scope-and-ai-context]] — why state-object mutations
  must be paired with UI indicator updates
- [[connections/module-namespace-vs-legacy-state]] — why these globals
  still live at `window` scope instead of `CL.*`

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from the
  "State Management" and "Tab-Specific Data Sources" sections of CLAUDE.md
