# Prompt 27-v2 verification (Day 2 Lane 2)

**Reference commit:** `9be31e5c4c0f375bc282c842c174c06bc7ddd9e6`
**Date:** 2026-05-17
**Prompt:** `modular-prompts/27-v2-grants-rank.md` (5-child re-split, engine block only)
**Live file:** `app/index.html` = 142,804 lines (prompt snapshot 145,624 → Δ ≈ +7 in this band)

## Per-anchor status

- Band START divider `// GRANT MODULE FUNCTIONS`: **FOUND @ 29672** (prompt ~29665)
- Engine anchor `initGrantModule`: **FOUND @ 29883** (prompt @29876)
- `displayStateGrants`: **FOUND @ 30018** (prompt @30011)
- `// ENHANCED GRANT MATCHING ALGORITHM`: **FOUND @ 30237** (prompt @30230)
- `// UI Control Handlers`: **FOUND @ 31504** (prompt @31497)
- `loadAadtCoverageBanner`: **FOUND @ 31770** (prompt @31763)
- Past-band-end `// EMAIL NOTIFICATION SYSTEM`: **FOUND @ 31821** (prompt ~31814)
- BLK_START (engine block): **29672** (or 29883 at the fn anchor)
- BLK_END (engine block incl. 2 grant listeners): **≈ 31820** (line before EMAIL divider @31821)
- **Engine-block LOC: 29672 → 31820 ≈ 2,149** (matches task estimate exactly)

Drift Δ ≈ +7 uniform across the grants region (different from 18-v2's −1067 —
each prompt drifts independently; do not cross-apply deltas).

### DO-NOT-MOVE globals (CLAUDE.md mandate — stay inline, window-mirror only)

- `const grantState`: **FOUND @ 22695** (prompt ~22688)
- `const GRANT_SCORING_PROFILES`: **FOUND @ 22749** (prompt ~22742)

These are inside the shared state-declaration cluster; **not moved**. 27a
adds `window.grantState` / `window.GRANT_SCORING_PROFILES` mirrors only.

## Per-child status

| Child | Band | LOC | Target |
|---|---|---|---|
| 27a `grants-rank-init` | `initGrantModule`@29883 → before `displayStateGrants`@30018 | ~135 | FREE |
| 27b `grants-rank-display` | `displayStateGrants`@30018 → before `// ENHANCED GRANT MATCHING`@30237 | ~219 | FREE |
| 27c `grants-rank-score` | `// ENHANCED GRANT MATCHING`@30237 → before main ranking fn (≈31031) | brace-derive ≤500 | FREE |
| 27d `grants-rank-engine` | main ranking fn (≈31031) → before `// UI Control Handlers`@31504 | brace-derive ≤500 | FREE |
| 27e `grants-rank-controls` | `// UI Control Handlers`@31504 → `loadAadtCoverageBanner`@31770 end + 2 grant listeners | ~330 | FREE |

- Load-after anchor `<script src="modules/grants/ranking.js"></script>`: **FOUND, count = 1** ✓
- Target `app/modules/grants/grants-rank-*.js`: **ABSENT** ✓

### 27e tail interleave — VERIFIED (read of L31790–31821)

Between `loadAadtCoverageBanner`'s closing brace (@ ≈ L31798) and the
`// EMAIL NOTIFICATION SYSTEM` divider (@31821) there are exactly **3
listeners**, matching the prompt §0 🔴 warning:

| Lines | Listener | Disposition |
|---|---|---|
| **31799** | `window.addEventListener('crashtab:hotspots:shown', loadAadtCoverageBanner);` | **GRANT — move with 27e** |
| **31801–31815** | `window.addEventListener('crashtab:dashboard:shown', …chart resize…)` | **DASHBOARD — LEAVE INLINE** |
| **31816–31818** | `document.addEventListener('jurisdictionChanged', …loadAadtCoverageBanner…)` | **GRANT — move with 27e** |

The dashboard-resize listener is a single self-contained `addEventListener`
block — **cleanly separable**. The interleave is tractable; 27e moves only
L31799 and L31816–31818, leaving L31801–31815 inline.

## Verdict

**STATUS: GREEN**

All anchors FOUND, engine block contiguous, LOC matches estimate exactly
(2,149). The 🔴 tail interleave is verified separable. `grantState` /
`GRANT_SCORING_PROFILES` confirmed present for inline + window-mirror.

## Required edits before Session V runs

- **No §0 snapshot edit required** — prompt §0 uses name/divider greps, not
  ranges; self-corrects for Δ +7.
- 27e: delete only L≈31799 and L≈31816–31818 (re-derive exact lines by
  reading L31790–31821 first, per prompt §4). Do **not** delete the
  dashboard-resize listener.
- 27c/27d internal cut: brace-derive the "main ranking function — async
  chunked" boundary at execution (≈ +7 from prompt's @31024 → ≈ L31031).
- **Re-derive against latest `main`** — line numbers shift with parallel
  extraction. Starting point only.
