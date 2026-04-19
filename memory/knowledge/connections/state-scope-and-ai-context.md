---
title: "Connection: State Scope and AI Context"
connects:
  - "concepts/state-management"
  - "concepts/ai-context-awareness"
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Connection: State Scope and AI Context

## The Connection

The tab-level state objects ([[concepts/state-management]]) and the AI
Assistant's scope resolver ([[concepts/ai-context-awareness]]) are two
sides of the same contract. Tabs own the data; the resolver decides
which tab's data the AI is currently reasoning about. When a tab
mutates scope-relevant state, it must also update the cross-tab
selection and the UI indicator — otherwise the AI silently drifts out
of sync with what the user sees.

## Key Insight

**The AI tab has no filters of its own.** Its entire "scope" is a
**read** through `getAIAnalysisContext()`, which is just a prioritized
lookup across the state objects. That makes the resolver cheap and
deterministic, but it also means every scope change has to be
*visible* in the state — it's not enough for the AI to be told about a
new location; that location must actually live in `selectionState` (or
a tab-specific `selectedLocation` field) before the next AI turn.

The pattern that works:

1. A tab updates its own state (`cmfState.selectedLocation = ...`,
   `warrantsState.filteredCrashes = ...`).
2. If the change originated from a cross-tab hand-off (Map → CMF,
   Hotspots → Grants, ...), also write to `selectionState`.
3. Call `updateAIContextIndicator()` on the **same turn**.
4. The resolver's priority order then naturally produces the right
   scope on the next AI query.

The anti-pattern is having the AI prompt builder reach directly into
`crashState.aggregates` or `cmfState.filteredCrashes`. That skips the
resolver, couples the AI to a single scope, and produces the classic
bug where the AI confidently answers a county-wide question with
location-specific numbers (or vice-versa).

## Evidence

- **Priority order exists to linearize scope**: CMF > cross-tab >
  Warrants > county-wide. Without this, two tabs could both claim a
  location simultaneously and the AI would have no tie-breaker.
- **`updateAIContextIndicator()` exists specifically to close the
  visibility gap** — the AI tab's header badge is the user's only
  confirmation that the AI knows what they're asking about. It's tied
  1:1 to `getAIAnalysisContext()`.
- **County-wide fallback uses `aggregates`, not `sampleRows`** — a
  deliberate choice to keep the county-wide prompt small. If an AI
  feature ever needs per-crash detail county-wide, that's a new scope,
  not a widening of the fallback.
- **Four `build*CrashProfile` helpers exist** because different scopes
  need different granularity, but they share a minimum shape
  (`{total, K, A, B, C, O, epdo}`) so the resolver can return a
  uniform `crashProfile` regardless of branch.

## Implications

- **Adding a new tab with its own location picker** requires extending
  the priority order, updating the resolver, and teaching every
  relevant handoff to write `selectionState`.
- **Removing a filter from a tab** requires auditing whether the
  resolver's priority still makes sense without that filter in the mix.
- **Caching AI responses** must key on the resolver output, not on
  user-typed query text alone — the same question at a different
  scope should not hit the cache.

## Related Concepts

- [[concepts/state-management]]
- [[concepts/ai-context-awareness]]
- [[concepts/epdo-weights]] — every `crashProfile` returned by the
  resolver carries an EPDO score
- [[concepts/hotspots]], [[concepts/grants-ranking]],
  [[concepts/warrants-analysis]], [[concepts/cmf-tab]],
  [[concepts/map-tab]] — tabs whose click-handoff flows implement
  this contract
