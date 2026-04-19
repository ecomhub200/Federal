---
title: "AI Context Awareness (getAIAnalysisContext)"
aliases: [ai-context, getAIAnalysisContext, ai-scope, updateAIContextIndicator]
tags: [ai, architecture, cross-tab]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# AI Context Awareness (getAIAnalysisContext)

The AI Assistant tab reasons about *different scopes* depending on what
the user is currently inspecting — a specific intersection, a corridor,
or the whole county. `getAIAnalysisContext()` is the single resolver that
picks the right scope, and `updateAIContextIndicator()` is the UI hook
that tells the user which scope is in play.

## Key Points

- **One resolver, one place**: all AI scope decisions go through
  `getAIAnalysisContext()`. Do not read state directly from inside the AI
  prompt builder.
- **Priority order** is fixed: CMF > cross-tab selection > Warrants >
  county-wide.
- **County-wide fallback** uses `crashState.aggregates`, not
  `sampleRows`, so the prompt stays small.
- Whenever a feature changes the user's focus, it must update the
  relevant state object **and** call `updateAIContextIndicator()` so the
  AI tab's badge/label stays in sync.
- The AI tab must never mix scopes in a single response — if it's
  answering about Route X, every count, EPDO, and recommendation should
  come from the Route X dataset.

## Details

### Resolution priority

```
1. cmfState.selectedLocation          ← CMF tab active + location chosen
2. selectionState.location            ← cross-tab selection
                                         (Map → CMF, Hotspots → Grants, ...)
3. warrantsState.selectedLocation     ← Warrants tab active + location chosen
4. (fallback) crashState.aggregates   ← county-wide
```

Each branch returns a consistent shape:

```javascript
{
  scope:         "location" | "county",
  location:      { route, node, ... } | null,
  crashes:       Array | null,          // location scope only
  crashProfile:  { total, K, A, B, C, O, epdo, ... },
  dateRange:     { from, to } | null,   // if a date filter is applied
  sourceTab:     "cmf" | "selection" | "warrants" | "county",
}
```

See [[concepts/state-management]] for how each of those state objects is
populated.

### Cross-tab selection channel

When the Map or Hotspots tab hands off a location to another tab, it
does not mutate CMF/Warrants state directly. Instead:

1. Write the selection into `selectionState` (location + crashes +
   crashProfile + `fromTab`).
2. Call `updateAIContextIndicator()`.
3. Let the receiving tab (or the AI tab) read via
   `getAIAnalysisContext()`.

This keeps each tab's own filters independent while still giving the AI
a consistent view.

### Crash-profile builders

Four similarly-named helpers exist. Using the wrong one silently mixes
scopes — see the "Function Naming Conventions" warning in the root
CLAUDE.md.

| Function                              | Returns                                      | Used by |
|---------------------------------------|----------------------------------------------|---------|
| `buildCountyWideCrashProfile()`       | aggregate stats for ALL crashes              | Main AI tab (county-wide) |
| `buildCMFCrashProfile()`              | location + date filtered profile             | CMF tab |
| `buildLocationCrashProfile(crashes)`  | simple `{total, K, A, B, C, O, epdo}`        | AI context assembly |
| `buildDetailedLocationProfile(crashes)` | severity/collision/weather/light breakdowns | Map-jump handlers |

### UI indicator

`updateAIContextIndicator()` updates a badge in the AI tab header that
reads, e.g. *"Analyzing: Route 29 @ Node 12345 (2022-2024)"* or
*"Analyzing: County-wide"*. Any tab that mutates a scope-relevant state
field must call this function after the mutation, on the same turn — do
not debounce or defer, or the AI response will be built against the old
indicator.

### Debugging

```javascript
console.log('[AI Context]', getAIAnalysisContext());
console.log('[Selection]', selectionState.location, selectionState.crashes?.length);
console.log('[CMF]', cmfState.selectedLocation, cmfState.filteredCrashes.length);
```

If the returned `scope` disagrees with what the UI shows, the fix is
almost always a missing `updateAIContextIndicator()` call somewhere, not
a bug in the resolver.

## Common Pitfalls

- Reading `crashState.aggregates` straight from the AI prompt builder,
  bypassing the resolver — breaks location-scoped conversations.
- Changing `cmfState.selectedLocation` without writing through to
  `selectionState` when the change originated from a non-CMF tab.
- Forgetting to clear `selectionState` when the user explicitly returns
  to county-wide, leaving a stale location in priority slot 2.

## Related Concepts

- [[concepts/state-management]] — the state objects this resolver reads
  from
- [[concepts/epdo-weights]] — every returned `crashProfile` carries an
  EPDO score computed via `calcEPDO`
- [[concepts/module-architecture]] — the resolver lives under `CL.ai`
- [[concepts/crash-profile-shapes]] — the four `build*CrashProfile`
  helpers referenced in the resolver
- [[concepts/hotspots]], [[concepts/grants-ranking]],
  [[concepts/warrants-analysis]], [[concepts/batch-before-after]] —
  tabs whose cross-tab selections feed the resolver
- [[connections/state-scope-and-ai-context]] — the cross-cutting
  contract this resolver participates in
- [[connections/epdo-across-tabs]] — EPDO parity requirement the
  resolver inherits

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  the "AI Tab Context Awareness" and "Function Naming Conventions"
  sections of CLAUDE.md
