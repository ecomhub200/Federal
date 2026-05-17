# Session P — v2 anchor verification aggregate

**Date:** 2026-05-17
**Branch:** `claude/verify-v2-anchors-jpNKN` (harness-mandated; Session P doc's
`claude/session-p-anchor-verify` is overridden by the Git Development Branch
Requirements — no push elsewhere without explicit permission)
**`app/index.html` at verify:** 144,245 lines
**Prompts re-anchored at (Session N):** 145,624 lines
**Session M delta:** removed `reports-pdf` (~L64022–65091), `reports-charts`
(~L63954–64021), `cmf-search` (~L80361–80604) — net −1,379 lines, **all at
L63954+**, i.e. *below* every v2 band → bands at L29k–62k shifted by only a
uniform **+3 / +4 lines**.

## Summary

| Prompt | Status | Anchor line (live) | Band END (live) | LOC≈ | Children verified | Notes |
|---|---|---|---|---|---|---|
| 15-v2 dashboard | **GREEN** | `updateDashboard`@41957 | 43828 (`// DASHBOARD SEARCH`@43829) | 1872 | 4/4 | loader needs `CL.dashboard` |
| 16-v2 hotspots | **GREEN** | `analyzeHotspots`@54720 | ~55793 (`// ANALYSIS TAB`@55795) | ~1074 | 3/3 | cleanest; loader needs `CL.hotspots` |
| 17-v2 intersection | **GREEN** | `updateIntersectionTab`@57644 | 59225 (`// PEDESTRIAN / BICYCLE TAB`@59226) | 1582 | 5/5 | loader needs `CL.intersection` |
| 18-v2 pedbike | **GREEN** | `updatePedBikeTab`@59228 | 62695 (`// PEOPLE INJURY ANALYSIS`@62696) | 3468 | 7/7 | highest tab split-risk; loader needs `CL.pedbike` |
| 27-v2 grants-rank | **GREEN** | `initGrantModule`@29879 | `loadAadtCoverageBanner`@31766 +2 listeners, before `// EMAIL NOTIFICATION SYSTEM`@31817 | ~2149 | 5/5 | `grantState`@22691 / `GRANT_SCORING_PROFILES`@22745 still inline & singular; `CL.grants` ✓ |
| 28-v2 grants-ai | **GREEN** | `generateFullApplicationContent`@35594 | `exportAppWord`@37038 close, before `// AI COUNTERMEASURE…`@37044 | ~1452 | 3/3 | `CL.grants` ✓ |
| 29-v2 grants-email | **GREEN** | `showNotifTab`@33067 / `generateReportForEmail`@34569 | 35468 (`// CRASH COST VALUE PRESETS…`@35469) | ~3652 | 7/7 | absorbs 28's stray email anchors; `CL.grants` ✓ |

Load anchors all present exactly once: `data/supabase-map-bridge.js`,
`analysis/hotspots.js`, `grants/ranking.js`, `grants/grants-ui.js`. All target
module dirs/files FREE (`app/modules/{dashboard,hotspots,intersection,pedbike}`
absent; `app/modules/grants/` holds only off-limits `ranking.js` +
`grants-ui.js`). No off-limits-name collision. No new split plan needed (no
Session-N-style STOP condition).

## GREEN queue (ready for next extraction sessions)

- 15-v2 (4 children) — 16-v2 (3) — 17-v2 (5) — 18-v2 (7) — 27-v2 (5) —
  28-v2 (3) — 29-v2 (7)

**7/7 GREEN.**

## YELLOW queue (needs minor edits)

(none)

## RED queue (needs new investigation)

(none)

## Why no prompt edits despite +3 drift

Every prompt's §0 pre-flight is **name-anchored** (`grep -nE '^function
updateDashboard\b'`, divider text greps), not line-number-anchored, and each
prompt explicitly states "line numbers are live … and **will drift** —
re-derive by brace read in §0." A uniform +3/+4 shift is exactly what §0
already absorbs; no §0/§1 false-abort is possible. Snapshot line numbers in
each prompt body remain advisory and were intentionally left as-is.

## Recommended next-session ordering

Two independent chains:

**Tab chain (no inter-gate; split-risk ascending):**
1. **16-v2** — cleanest (clean boundary both ends, 3 children, lowest split risk)
2. **17-v2** — 4–5 children, clean both ends
3. **15-v2** — 4 children (DASHBOARD SEARCH excluded — separate sub-feature)
4. **18-v2** — 7 children, highest tab split-risk → run last of the tabs

**Grants chain (order-locked by stated gates):**
5. **27-v2** — run AFTER 41-v2 (41-v2 already consumed by Session O Step 2 —
   no action needed here; load order safe per CLAUDE.md)
6. **28-v2** — run AFTER 27-v2 (shares Grants tab, `grants-ui` load anchor)
7. **29-v2** — run AFTER 27-v2 + 28-v2 (absorbs 28's stray email anchors);
   7 children, highest grants split-risk → last

Each prompt is "one CHILD per session"; chains may interleave across sessions
since the two chains are independent.
