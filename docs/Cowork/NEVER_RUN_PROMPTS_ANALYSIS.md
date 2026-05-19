# Never-Run Modular-Refactor Prompts — Analysis (CC Session N)

**Date:** 2026-05-17 · **Session:** N (investigate-blocked, documentation only)
**Scope:** prompt 41 (`ai-domain-knowledge`, perpetually blocked) + the 7
prompts from the original 46 silently skipped in every batch
(15–18 dashboard/hotspots/intersection/pedbike-tab, 27–29
grants-rank/ai/email). No code extracted; `app/index.html` untouched.

`app/index.html` is **145,624 lines** live (snapshot all v1 prompts were
authored against = 159,387 — every v1 snapshot range is stale).

## Verdict table

| # | Prompt | Live anchor (verified) | Real contiguous block | ~LOC | Verdict | v2 |
|---|---|---|---|---|---|---|
| 41 | ai-domain-knowledge | `initDomainKnowledge`@76301 | L76221 → L78015 | ~1,795 | **READY** (was perpetually BLOCKED — 3 prompt-authoring defects, not drift) | `41-v2-ai-domain-knowledge.md` (6-child) |
| 15 | dashboard-tab | `updateDashboard`@41954 | L41954 → ~L43824 | ~1,871 | **READY** (stale snapshot only) | `15-v2-dashboard-tab.md` (4-child) |
| 16 | hotspots-tab | `analyzeHotspots`@54717 | L54717 → ~L55790 | ~1,074 | **READY** (cleanest; clean boundary both ends) | `16-v2-hotspots-tab.md` (3-child) |
| 17 | intersection-tab | `updateIntersectionTab`@57641 | L57641 → ~L59222 | ~1,582 | **READY** | `17-v2-intersection-tab.md` (4–5-child) |
| 18 | pedbike-tab | `updatePedBikeTab`@59225 | L59225 → ~L62692 | ~3,468 | **READY** (highest split risk) | `18-v2-pedbike-tab.md` (7-child) |
| 27 | grants-rank | `initGrantModule`@29876 | engine L29665 → L31813 | ~2,149 | **BLOCKED→READY** (v1 anchors non-contiguous + shared-state cluster) | `27-v2-grants-rank.md` (5-child) |
| 28 | grants-ai | (resp.) `generateFullApplicationContent`@35591 | L35588 → ~L37039 | ~1,452 | **BLOCKED→READY** (v1 anchor/responsibility mismatch) | `28-v2-grants-ai.md` (3-child) |
| 29 | grants-email | `generateReportForEmail`@34566 | EMAIL band L31814 → ~L35464 | ~3,651 | **BLOCKED→READY** (block 7× ceiling; absorbs 28's stray anchors) | `29-v2-grants-email.md` (7-child) |

**No prompt is SUPERSEDED.** Off-limits sweep of `app/modules/**` for every
anchor returned empty. `grants-ui.js` (prompt 30, extracted) was block
L37263–L39447 — it contains **zero** of the 27/28/29 anchors. **No prompt is
RETIRE-only** — every one is recoverable via a re-anchored v2 + sub-split.

## Per-prompt notes

### 41 ai-domain-knowledge — was perpetually blocked
Root cause = 3 prompt-authoring defects (full detail in
`MODULAR_PLAN_PROMPT_41_FIX.md`): placeholder anchor `(domain knowledge fns)`;
un-satisfiable `grep 'ai[A-Z]|[Aa]ssistant'` §5; wrong snapshot + "rescue"
satellite anchors that are Asset-Deficiency (a different feature). The real DK
block is contiguous and single-ownership — it just needed correct anchors and a
6-way split (it is 3.6× the 500 ceiling). `CL.ai` already in `loader.js`.

### 15 dashboard-tab
Pure drift. Clean upper boundary at `// DASHBOARD SEARCH FUNCTIONS`@~43825
(that search sub-feature is intentionally out of scope). 4 children. New
`CL.dashboard` root.

### 16 hotspots-tab
**NOT** superseded by off-limits `analysis/hotspots.js` (that is the
hotspot-*math* module `CL.analysis`; this is the *tab UI*). Clean boundary at
`// ANALYSIS TAB`@~55791; `updateAnalysis`@55794 stays inline (CLAUDE.md).
3 children. New `CL.hotspots` root. **Lowest risk of the set.**

### 17 intersection-tab
Clean boundary at `// PEDESTRIAN / BICYCLE TAB`@~59223. Detail-panel tail
(~743 LOC) splits into 2 by brace read → 4 or 5 children. New `CL.intersection`.

### 18 pedbike-tab
Largest band (~3,468 LOC, 7× ceiling) — true size is ~2× the stale v1 "~1729".
Clean boundary at `// PEOPLE INJURY ANALYSIS`@~62693. Ped + Bike are
near-symmetric (core/detail/export each) → 7 feature-band children.
`showLocationDetail`@~62586 needs an external-caller re-check at run time.
New `CL.pedbike` root. **Highest split risk.**

### 27 grants-rank — BLOCKED as authored
v1 anchor set is non-contiguous: `grantState`@22688 /
`GRANT_SCORING_PROFILES`@22742 live inside a *shared state-declaration cluster*
(with `districtState`/`mutcdState`/`selectionState`/`warrantsState`) ~7,200
lines from `initGrantModule`@29876, and CLAUDE.md mandates `grantState` stays
inline. v2 scope = the contiguous **grant engine** only
(`initGrantModule`@29876 → `loadAadtCoverageBanner`@31763, ~2,149 LOC, 5
children); `grantState`/`GRANT_SCORING_PROFILES` are window-mirrored, NOT moved.
**Tail caveat:** a dashboard-resize event-listener (L31794–31808) is
interleaved between two grant listeners — child 27e moves only the 2 grant
listeners, leaves the dashboard one inline.

### 28 grants-ai — BLOCKED as authored
Anchor/responsibility mismatch: v1 anchors (`showNotifTab` etc.) are
email-notification UI (→ owned by 29-v2). The v1 *responsibility* ("Grant AI
agents + narrative generation") = the contiguous **AI-POWERED FULL APPLICATION
GENERATION** band `generateFullApplicationContent`@35591 → `exportAppWord`@37035
(~1,452 LOC, 3 children), still inline (not in off-limits `grants-ui.js`).

### 29 grants-email — BLOCKED as authored (oversized)
Anchors valid but mid-block; true band = the whole EMAIL NOTIFICATION SYSTEM
region L31814 → ~L35464 (~3,651 LOC, 7× ceiling). Absorbs prompt 28's stray
email-UI anchors. 7 sub-header children. Clean boundary before
`// CRASH COST VALUE PRESETS`@~35466.

## Dependency / ordering notes
- 41-v2, 15-v2, 16-v2, 17-v2, 18-v2: **no external gate** (single-ownership
  tab bands; new `CL.*` roots).
- 27-v2 → 28-v2 → 29-v2: all share the Grants tab and load after the
  off-limits `grants/grants-ui.js` tag. Order matters: 27 (engine) →
  28 (AI-app-gen) → 29 (email, which absorbs 28's stray anchors so 28 must
  ship its scope first). `grants-ui.js` already calls these at runtime, so
  current load order is safe (CLAUDE.md).
- Adding `CL.dashboard`/`CL.hotspots`/`CL.intersection`/`CL.pedbike` roots to
  `loader.js` is the only permitted `loader.js` edit (one key each, if absent).

## Recommended Session O queue (cleanest-first, ascending split risk)

| Slot | Prompt | Children | Risk | ~LOC removed |
|---|---|---|---|---|
| 1 | `16-v2-hotspots-tab` | 3 | lowest (clean both ends) | ~1,074 |
| 2 | `17-v2-intersection-tab` | 4–5 | low | ~1,582 |
| 3 | `15-v2-dashboard-tab` | 4 | low | ~1,871 |
| 4 | `41-v2-ai-domain-knowledge` | 6 | low (single-ownership) | ~1,795 |
| 5 | `27-v2-grants-rank` | 5 | medium (tail interleave caveat) | ~2,149 |
| 6 | `28-v2-grants-ai` | 3 | medium (only 2 known anchors; §0 enumerates rest) | ~1,452 |
| 7 | `18-v2-pedbike-tab` | 7 | high | ~3,468 |
| 8 | `29-v2-grants-email` | 7 | high (run last; absorbs 28) | ~3,651 |

Each child = one session (verify green between). Total child sessions ≈ **39**.

**Expected `app/index.html` reduction if all 8 land: ≈ 17,042 lines**
(1,074+1,582+1,871+1,795+2,149+1,452+3,468+3,651, minus ~39 IIFE wrappers ≈
−900 net offset → **≈ 16,100 lines net**), taking the file from 145,624 toward
~129,500 — within striking distance of the `app/index.html < 30,000` end goal
relative to the remaining queue.
