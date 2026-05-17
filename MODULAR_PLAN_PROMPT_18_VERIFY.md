# Prompt 18-v2 verification (Day 2 Lane 2)

**Reference commit:** `9be31e5c4c0f375bc282c842c174c06bc7ddd9e6`
**Date:** 2026-05-17
**Prompt:** `modular-prompts/18-v2-pedbike-tab.md` (7-child re-split)
**Live file:** `app/index.html` = 142,804 lines (prompt snapshot was 145,624 → Δ ≈ −1067 in this band)

## Per-anchor status

- Parent anchor `function updatePedBikeTab`: **FOUND @ 58158** (prompt ~59225)
- Band START (BLK_START): **58158**
- Band END divider `// PEOPLE INJURY ANALYSIS`: **FOUND @ 61626**
  (the `// ===` divider block spans 61624–61628)
- Band END (BLK_END, last line of pedbike band): **61625**
- **Parent LOC: 58158 → 61625 = 3,468** (matches task estimate exactly)

## Per-child status

All child anchors FOUND. Drift Δ ≈ −1067 (uniform across the band).
Child internal cuts are brace-derived at execution per prompt §1.

| Child | Band | Anchor(s) | LOC | Load anchor | Target |
|---|---|---|---|---|---|
| 18a `pedbike-tab-ped-core` | 58158 → before 58611 | `updatePedBikeTab`@58158 | ~453 | n/a (script-tag set) | FREE |
| 18b `pedbike-tab-ped-detail` | 58611 → before 59333 | `_fetchPedBikeDetailAggregates`@58611 | ~722 (prompt splits ≤500) | n/a | FREE |
| 18c `pedbike-tab-bike-core` | 59333 → before 59562 | `applyBikeFilters`@59333 | ~229 | n/a | FREE |
| 18d `pedbike-tab-bike-detail` | 59562 → before 60115 | `updateBikeDetailPanel`@59562 | ~553 (prompt splits ≤500) | n/a | FREE |
| 18e `pedbike-tab-ped-export` | 60115 → before 60749 | `setPedViewMode`@60115 | ~634 (prompt splits ≤500) | n/a | FREE |
| 18f `pedbike-tab-bike-export` | 60749 → before legacy wrappers | `setBikeViewMode`@60749 | ~459 | n/a | FREE |
| 18g `pedbike-tab-shared` | legacy wrappers → 61625 | `jumpToCMFFromPedBike`@61415, `showLocationDetail`@61519 | ~217 | n/a | FREE |

- Load anchor `<script src="modules/data/supabase-map-bridge.js"></script>`: **FOUND, count = 1** ✓
- Target dir `app/modules/pedbike/`: **ABSENT** ✓ (no collision; new `CL.pedbike` root needed in `loader.js`)

### 18g tail detail (verified by read of L61515–61628)

The contiguous tail that moves with **18g**:
- `showLocationDetail`@61519 closes ≈ L61613
- `// Note: closeModal() is defined earlier …` comment @ ≈ L61615
- A "Close modal when clicking outside" `addEventListener` block @ ≈ L61617–61623
- Band ends at L61625; `// PEOPLE INJURY ANALYSIS` divider @ 61624–61628 is **out of scope**

`showLocationDetail` external-caller check (prompt §0 ⚠️) is still required at
execution time — if shared beyond pedbike, window-mirror and leave inline.

## Verdict

**STATUS: GREEN**

All parent + child anchors FOUND. Parent band contiguous, LOC matches the
task estimate exactly (3,468). Band ends cleanly before the PEOPLE INJURY
ANALYSIS divider. No target collision.

## Required edits before Session U runs

- **No §0 snapshot edit strictly required** — prompt 18-v2 §0 uses
  **name-grep anchors** (`^function updatePedBikeTab\b`, etc.), not line
  ranges, so it self-corrects for the Δ −1067 drift.
- The §1 child table line numbers (`@59225`, `@59678`, …) are advisory;
  re-derive every child boundary by **brace read** as the prompt already
  mandates. Subtract ≈1067 from each prompt §1 line number as a sighting aid
  only.
- Session U must still run the `showLocationDetail` external-caller grep
  before moving 18g (prompt §0 ⚠️).
- **Re-derive against latest `main`** — R/S/T (or any parallel) extraction
  will shift these numbers further. This report = starting point only.
