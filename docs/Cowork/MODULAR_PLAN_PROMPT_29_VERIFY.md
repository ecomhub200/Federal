# Prompt 29-v2 verification (Day 2 Lane 2)

**Reference commit:** `9be31e5c4c0f375bc282c842c174c06bc7ddd9e6`
**Date:** 2026-05-17
**Prompt:** `modular-prompts/29-v2-grants-email.md` (7-child re-split, EMAIL NOTIFICATION band)
**Live file:** `app/index.html` = 142,804 lines (prompt snapshot 145,624; this band drifted)

## Per-anchor status

- Band START `// EMAIL NOTIFICATION SYSTEM`: **FOUND @ 31821** (prompt ~31814)
- Band END `// CRASH COST VALUE PRESETS & STATE-SPECIFIC CRASH COSTS`:
  **FOUND @ 35473** (prompt `// CRASH COST VALUE PRESETS` ~L35466)
- BLK_START: **31821**
- BLK_END: **35472** (line before the CRASH COST VALUE PRESETS divider)
- **Parent LOC: 31821 → 35472 = 3,652** (matches ~3,651 task estimate)

All 6 §0 anchors FOUND:

| Anchor | Line | Prompt |
|---|---|---|
| `showNotifTab` | **33071** | ~33064 |
| `generateReportForEmail` | **34573** | @34566 |
| `buildEmailSubjectLine` | **34651** | (mid) |
| `displayGrantLocations` | **34821** | ~34814 |
| `buildEnrichedGrantContext` | **35102** | ~35095 |
| `toggleSelectionAnalysis` | **35192** | ~35185 |

## Per-child status — sub-header map (verified by enumeration 31821–35472)

| Child | Sub-header band (anchor) | Target |
|---|---|---|
| 29a `grants-email-state` | `// EMAIL NOTIFICATION SYSTEM`@31821 / `// Notification State Management`@31824 → before `// Get R2-compatible…`@32208 | FREE |
| 29b `grants-email-prefs` | `// Get R2-compatible…`@32208 → before `// MULTI-EMAIL INPUT MANAGEMENT`@33346 | FREE |
| 29c `grants-email-chips` | `// MULTI-EMAIL INPUT MANAGEMENT`@33346 → before `// Save Email Notification Settings` | FREE |
| 29d `grants-email-settings` | save-settings band → before summary-email HTML builder | FREE |
| 29e `grants-email-send` | summary-email HTML → before `generateReportForEmail`@34573 | FREE |
| 29f `grants-email-report` | `generateReportForEmail`@34573 → before `displayGrantLocations`@34821 | FREE |
| 29g `grants-email-locations` | `displayGrantLocations`@34821 → band END 35472 | FREE |

- Load-after anchor `<script src="modules/grants/grants-ui.js"></script>`: **FOUND, count = 1** ✓
- Target `app/modules/grants/grants-email-*.js`: **ABSENT** ✓

### Oversized-fn caveat (verified by enumeration)

`openEmailNotificationModal`@**32370** → next top-level fn `showNotifTab`@33071
= **≈ 701 lines** with no intervening top-level fn. This single function sits
inside the **29b** candidate band (`// Get R2-compatible…`@32208 → `// MULTI-
EMAIL INPUT MANAGEMENT`@33346) and **cannot be cut ≤500 without splitting a
function**.

## Verdict

**STATUS: YELLOW** (anchors GREEN; child ≤500 split caveat)

Band START/END + all 6 anchors FOUND, band contiguous, LOC matches estimate
(3,652). Sub-headers present for the 7-child cuts. **However** 29b is blocked
from a ≤500 cut by the single ~701-line `openEmailNotificationModal`.

## Required edits before Session V runs

1. **Brace-verify** `openEmailNotificationModal`@32370. If it is one
   indivisible ~701-line function (as the gross span indicates):
2. Ship **29b as a documented size-exception** (precedent:
   `assets/transit-tab`, `reports/reports-pdf`) — the child file exceeds 500
   because it wraps one indivisible fn. Note it in `MODULAR_PLAN.md` + the
   module header.
3. Re-confirm the remaining 6 child sub-header boundaries by brace read at
   execution (the 29c–29g sub-headers are present and look cuttable ≤500).
4. Prompt §0 ⚠️: re-verify external (non-email) callers of
   `displayGrantLocations`@34821 / `buildEnrichedGrantContext`@35102 /
   `toggleSelectionAnalysis`@35192 before moving 29g — window-mirror if shared
   (they stay in the band regardless, contiguous).
- This is **runnable, not blocked** — anchors valid, band contiguous.
- 29-v2 is **highest split risk** (7-child + oversized fn) → Session V
  supervised slot, run **after 27-v2 + 28-v2** (it absorbs 28's stray email
  anchors; 28-v2 must ship its AI-app-gen scope first).
- **Re-derive against latest `main`** — starting point only.
