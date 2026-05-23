---
title: "jurisdictionChanged event over-firing — 4-7× per tier-button click"
aliases: [jurisdictionchanged-debounce, jurisdiction-changed-overfiring, upload-debounce]
tags: [upload, events, debounce, performance, upload-tab]
sources:
  - "daily/2026-05-22.md"
created: 2026-05-22
updated: 2026-05-22
---

# `jurisdictionChanged` event over-firing — 4-7× per tier-button click

## Core Fact

A single tier-button click in the Upload tab dispatches the `jurisdictionChanged` custom event 4–7 times. Every listener — Schools, Transit, BTS, Overture, Scorecard — responds to each fire, wasting cycles. Only `mapPointsHydrate` has its own dedup guard. The fix is a `fireJurisdictionChanged(detail)` wrapper function with a 250 ms debounce applied at the **dispatch source**, not at listener side.

## Key Points

- Multiple Upload modules each independently call `document.dispatchEvent(new CustomEvent('jurisdictionChanged', ...))`, producing 4-7 dispatches per click.
- Evidenced by Chrome DevTools MCP console log during Upload Phase 1 certification testing.
- `mapPointsHydrate` is the only listener with its own dedup guard; all other listeners (Schools, Transit, BTS, Overture, Scorecard) process every fire redundantly.
- **Fix location:** wrap all `document.dispatchEvent(new CustomEvent('jurisdictionChanged', ...))` call sites in `app/modules/upload/` with a single `fireJurisdictionChanged(detail)` debounce wrapper.
- **Debounce must be at the dispatch source**, not the listener side — adding per-listener debounces would require touching every listener independently and would not reduce the dispatch count.
- 250 ms debounce window: long enough to absorb the burst from a single tier-button click cascade, short enough to feel instant to the user.
- Verification: after fix, a single tier-button click must produce exactly 1 `jurisdictionChanged` fire (confirmed via Chrome MCP console log counting).

## Details

### Why multiple dispatches per click

A tier-button click in the Upload tab triggers a chain of state updates across Upload sub-modules. Each sub-module that cares about tier/jurisdiction change calls `document.dispatchEvent(new CustomEvent('jurisdictionChanged', ...))` independently when it finishes its own state update. Because there is no shared dispatcher, the same logical event is broadcast multiple times — once per sub-module that handles the click's side effects.

The exact count (4-7) varies based on which tier is selected, because different tiers activate different sub-modules (e.g., Region tier triggers hierarchy resolution, then dropdown population, then selection — each of which may dispatch).

### Why debounce at dispatch source

Debouncing at the listener side would require each of the 5+ affected listeners to maintain its own debounce timer independently. This is fragile (each listener must be modified), redundant (5 debounces instead of 1), and still allows 4-7 events to propagate through the event bus before being dropped. Debouncing at the single shared dispatch wrapper collapses all bursts before they leave the Upload module boundary — cleaner and more maintainable.

### Relationship to F1 auto-select

The F1 auto-select fix (automatically selecting the first non-empty option after tier change) can itself trigger additional `jurisdictionChanged` dispatches if the dropdown's selection handler also dispatches the event. This makes F4 debounce a prerequisite for F1 to behave correctly — without debounce, F1 could worsen the over-firing. See [[connections/upload-tier-change-cascade]].

### Grep before implementing

Before adding the `fireJurisdictionChanged` wrapper, grep all dispatch sites:
```
grep -rn "dispatchEvent.*jurisdictionChanged" app/modules/upload/
```
Replace every found call site with `fireJurisdictionChanged(detail)`. Do NOT touch listeners or any code outside `app/modules/upload/`.

## Related Concepts

- [[concepts/upload-tab-phase1-certification]] — F4 (debounce) is one of four Upload Phase 1 certification fixes; this article covers the root cause in depth
- [[connections/upload-tier-change-cascade]] — Causal chain: F1 auto-select → more dispatches → worsens over-firing → F4 debounce required to suppress
- [[concepts/dashboard-tier-kpi-regression]] — Parallel tier-event wiring problem in the Dashboard tab; events not propagated to all listeners in both cases

## Sources

- [[daily/2026-05-22.md]] — Chrome MCP console log evidence of 4-7 fires per click; `mapPointsHydrate` as the only listener with dedup; dispatch-source debounce rationale; 250 ms window; grep-before-implement requirement; F4 verification via fire count === 1
