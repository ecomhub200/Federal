# Prompt 29-v2 verification (Session P)

**Date:** 2026-05-17
**N_LINES at verify:** 144245
**Prompt re-anchored at (Session N):** 145,624 lines
**Measured uniform drift:** +3 lines (Session M removals all at L63954+, below this band)

## Per-anchor status

- Band-start divider `// EMAIL NOTIFICATION SYSTEM`: **FOUND @31817**
- Band-end divider `// CRASH COST VALUE PRESETS & STATE-SPECIFIC CRASH COSTS`: **FOUND @35469**
- BLK_START_NEW: 31817
- BLK_END_NEW: 35468 (line before `// CRASH COST VALUE PRESETS…` @35469)
- LOC: ~3652
- Drift from snapshot (`// EMAIL NOTIFICATION SYSTEM`@31814 / band end ~35466 Session N): +3 / +3 / +1 LOC

Supporting anchors all FOUND, live lines (incl. the ex-prompt-28 stray
email-UI anchors this band absorbs):
`showNotifTab`@33067, `generateReportForEmail`@34569,
`buildEmailSubjectLine`@34647, `displayGrantLocations`@34817,
`buildEnrichedGrantContext`@35098, `toggleSelectionAnalysis`@35188. Band ends
cleanly before `// CRASH COST VALUE PRESETS…`@35469 (not crossed).

## Per-child status (7 children, sub-header bands re-offset +3 from §1)

- 29a `grants/grants-email-state.js`: BLK 31817 → before `// Get R2-compatible jurisdiction path` (~32204), ~387 LOC, load anchor `grants/grants-ui.js` FOUND (1), target FREE
- 29b `grants/grants-email-prefs.js`: BLK ~32204 → before `// MULTI-EMAIL INPUT MANAGEMENT` (~33342), split →≤500, load anchor FOUND, target FREE
- 29c `grants/grants-email-chips.js`: BLK ~33342 → before `// Save Email Notification Settings` (~33599), ~257 LOC, load anchor FOUND, target FREE
- 29d `grants/grants-email-settings.js`: BLK ~33599 → before `// Generate grant summary email HTML` (~34220), split →≤500, load anchor FOUND, target FREE
- 29e `grants/grants-email-send.js`: BLK ~34220 → before `generateReportForEmail`@34569, ~349 LOC, load anchor FOUND, target FREE
- 29f `grants/grants-email-report.js`: BLK 34569 → before `displayGrantLocations`@34817, ~248 LOC, load anchor FOUND, target FREE
- 29g `grants/grants-email-locations.js`: BLK 34817 → band END 35468, split →≤500 (split before `buildEnrichedGrantContext`@35098 if >500), load anchor FOUND, target FREE

Sub-header offsets (~32204 / ~33342 / ~33599 / ~34220) are §0 re-derived at
extraction time (grep the sub-header text, not the line). `displayGrantLocations`
/ `buildEnrichedGrantContext` / `toggleSelectionAnalysis` external-caller
re-check is an extraction-time §0 step (they stay in the contiguous band
regardless). `CL.grants` root already in `loader.js`:11 — no loader edit.
`grants-email-*` targets FREE.

## Verdict

**STATUS: GREEN**

## Required prompt edits

None. §0 divider/name-anchored; +3 drift absorbed; band-end divider present
and unambiguous. Order-locked: run AFTER 27-v2 + 28-v2 (absorbs 28's stray
email anchors). Highest split-risk (7-child) — recommend last.
