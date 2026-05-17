# Stage A (ESM Cutover) — Go / No-Go Report

**Date:** 2026-05-17 (Session I)
**Scope:** Readiness check of everything Stage A needs **before** scheduling
the single-shot ESM cutover day. Documentation only — no code changed.
**Inputs:** live tree vs Session C's frozen IIFE-era snapshot
(`STAGE_A_MODULE_SURVEY.md` = 53, `STAGE_A_ONCLICK_API.md` = 25 floor,
`STAGE_A_IMPORT_GRAPH.md` = 12 edges / 41 leaves,
`STAGE_A_CONVERSION_TEMPLATE.md`, `STAGE_A_01..54-cutover` prompts).

Stage A is a **single coordinated cutover**: a file with `export` cannot
load via classic `<script src>` (`Unexpected token 'export'`), so all
52+1 script tags swap to one `<script type="module" src="main.js">` in
**`STAGE_A_62-cutover`**. The app runs again only after 54. Therefore
*every* module must be conversion-ready before the cutover is scheduled.

---

## §1 — Module inventory

| Metric | Session C survey | Live tree (2026-05-17) | Status |
|---|---|---|---|
| `app/modules/**/*.js` files | **53** | **56** | **+3 drift** |
| Have `CL._registerModule()` | 53 (all) | 55 / 56 | 1 expected gap |
| `_registerModule` gap | — | `worker/csv-worker.js` | **expected** |

`worker/csv-worker.js` legitimately has no `_registerModule` — it runs in a
`Worker` thread, is not loaded by the CL `<script>` loader, and is a
documented special case in `STAGE_A_MODULE_SURVEY.md` §Special cases. **Not
a gap.**

**The +3 modules added since Session C froze its snapshot:**

| New module | Origin (IIFE prompt) | Has `STAGE_A_NN` conversion prompt? |
|---|---|---|
| `ai/ai-mode-toggle.js` | prompt 40b | **NO** |
| `grants/grants-ui.js` | prompt 30 (2,185-line block) | **NO** |
| `spatial/geo-tier.js` | batch 4 (geo-tier, 1,357-line block) | **NO** |

None of the three appears in `STAGE_A_MODULE_SURVEY.md`'s 53-row table, in
`STAGE_A_ONCLICK_API.md`, in `STAGE_A_IMPORT_GRAPH.md`, or as a numbered
`STAGE_A_NN-*.md` conversion prompt. The 54-prompt queue
(`STAGE_A_01..53` convert + `STAGE_A_62-cutover`) maps 1:1 to the **53**
surveyed modules only. **3 conversion prompts are missing.** This is
exactly the "counts will grow — re-run the survey before executing"
condition the survey doc itself flags.

---

## §2 — Onclick API drift

| Metric | Session C | Live tree | Status |
|---|---|---|---|
| Module-owned `window.*` in onclick (survivor floor) | **25** (explicit floor) | not re-scanned | **stale** |
| Unique `onclick="fn("` names in `app/index.html` | — | **616** | re-scan needed |

`STAGE_A_ONCLICK_API.md` states "**Treat 25 as a floor, not a ceiling**…
re-run the scan against the final tree." Since the snapshot, prompt 30
(`grants/grants-ui.js`, ~36 previously-global fns, several onclick-bound per
CLAUDE.md), prompt 40b (`ai/ai-mode-toggle.js`), and the geo-tier batch
landed — each can move onclick-bound functions into a module. The 616
`index.html` onclick names are the universe to re-resolve; the
**module-owned** subset that must keep a `window.*` legacy block has almost
certainly grown past 25. **The survivor table is out of date and must be
re-scanned against the final post-IIFE tree** (including the
string-injected `onclick=` built inside modules, and `onchange`/`oninput`/
`onsubmit`).

---

## §3 — Import-graph delta

`STAGE_A_IMPORT_GRAPH.md` derives edges for **53** modules (12 with real
static-export `import` edges, 41 leaves) and explicitly says "re-derive
edges against the final post-IIFE tree." The +3 modules have **no** entry:

| New module | Likely import profile | Action |
|---|---|---|
| `grants/grants-ui.js` | 2,185-line block; per CLAUDE.md calls `grants/ranking` + grant helpers + 4-agent orchestration → **probable real cross-module `import` edges** + onclick survivors | full edge + onclick analysis required |
| `ai/ai-mode-toggle.js` | small toggle module → likely a **leaf**, but verify against `ai/context` | verify |
| `spatial/geo-tier.js` | 1,357-line geo-tier helpers; reads `core/tier`, map/supabase bridges → **probable edges and/or singleton-slot reads** | full edge analysis required |

Until these are folded in, `STAGE_A_IMPORT_GRAPH.md`'s topological order and
`app/main.js` import list are **incomplete** — a missed edge becomes a
load-time `ReferenceError`/TDZ after cutover.

---

## §4 — Outstanding IIFE work (the dominant blocker)

CLAUDE.md is explicit: **"Stage A — next stage, AFTER IIFE round 01–46."**
The IIFE round is **not** complete:

- `modular-prompts/` holds **61** non-STAGE_A, non-SUPERSEDED prompts; only
  ~20 have a clearly corresponding extracted module — **the majority of the
  IIFE extraction queue is unrun.**
- **Blocked:** prompt 44 — this session only *plans* its unblock
  (`44-v2-iife-wholesale.md`); the extraction itself is a later session.
- **Superseded/redirected:** 40, 41, 42, 43 (replaced by
  40a/40b/40c\*/42b\*/42c\*/42d per CLAUDE.md); 40 & 42 must NOT run.
- **Never ran:** prompts 27/28/29 (grants-rank/ai/email) — those helpers +
  `grantState` stay inline/global.
- **Unextracted families** (representative, not exhaustive): tab modules
  (15–22), cmf-\* (31–33), map-\* (35–38), reports chain (42b\*–42d, 43),
  ai-analyst chain (40c\*), app-bootstrap (46).

`app/index.html` is still **149,314 lines** — far from the refactor's
"< 30,000 lines / all inline JS moved" definition of done. Stage A converts
modules; it cannot convert inline code that has not yet been extracted into
modules. **Until the IIFE round substantially completes, a clean Stage A
cutover is not possible** — newly extracted modules would arrive *after* the
cutover with no conversion prompt, in IIFE form, unable to load alongside a
`type="module"` graph.

---

## §5 — Verdict: **NO-GO**

Stage A's **design is sound** — the atomic single-shot cutover model, the
static-export-vs-singleton-slot import methodology, the onclick-survivor
methodology, and the `loader.js`-first / worker-special-case handling are
all correct and ready in principle. But Stage A **must not be scheduled
now**:

1. **(Blocking) The IIFE round 01–46 is far from complete.** Stage A's own
   stated prerequisite is unmet; converting a partial module set while large
   inline IIFEs remain guarantees post-cutover load failures for
   not-yet-extracted code.
2. **(Blocking) +3 modules have no conversion prompt** and are absent from
   all 3 design docs. The 54-prompt queue covers 53/56 modules.
3. **(Blocking) The 3 frozen design docs are stale** and each self-flags
   "re-scan before executing": survey count (53→56+), onclick floor
   (25→TBD, universe 616), import edges (12→TBD).

This is a clean **NO-GO** with a deterministic prerequisite chain, not a
near-go — the gating item (#1) is large and outside this session's
documentation scope.

### Pre-cutover punch list (ordered — complete ALL before scheduling)

1. **Burn down the outstanding IIFE extraction queue**, including running
   `44-v2-iife-wholesale.md` (this session's deliverable) and every
   non-superseded prompt that lacks a module. Goal: `app/index.html`
   approaches the "all inline JS extracted" milestone.
2. **Re-run the module survey** against the final post-IIFE tree →
   regenerate `STAGE_A_MODULE_SURVEY.md` (expect ≥ 56, growing).
3. **Re-scan onclick** (`grep -rhoE 'onclick=\"<fn>\(' app/index.html app/modules`
   + `onchange/oninput/onsubmit`) → extend `STAGE_A_ONCLICK_API.md`; the
   25-survivor table will grow (grants-ui/geo-tier/ai-mode-toggle at
   minimum).
4. **Re-derive import edges** for every post-snapshot module → update
   `STAGE_A_IMPORT_GRAPH.md` topological order + the `app/main.js` list;
   verify no imported binding is referenced at module top level (TDZ).
5. **Author the missing `STAGE_A_NN` conversion prompts** for every module
   added after the snapshot (`ai/ai-mode-toggle`, `grants/grants-ui`,
   `spatial/geo-tier`, + any new ones from step 1), using
   `STAGE_A_CONVERSION_TEMPLATE.md`.
6. **Renumber/insert** so `STAGE_A_62-cutover` (or its successor number)
   remains the single terminal step that swaps all `<script src>` tags for
   one `<script type="module" src="main.js">`.
7. **Only then** re-run this go/no-go. A GO requires: every module has a
   conversion prompt; all 3 design docs match the live tree; the IIFE round
   is done; rollback (whole Stage A branch) is rehearsed.

---

## Session K addendum (2026-05-17) — punch-list items 2–6 closed

Session K executed the **deterministic, runnable-now** subset of the §5
punch list (items 2–6). Documentation only — no code extracted or
modified. Branch: `claude/session-k-stage-a-prep`. Full delta:
`STAGE_A_PRECUTOVER_DELTA.md`.

| Item | Before (Session I) | After (Session K) |
|---|---|---|
| 2 — Module survey | 53 (stale, "+3" est.) | **61** — `STAGE_A_MODULE_SURVEY.md` regenerated (+8 real) |
| 3 — Onclick floor | 25 (stale) | **72** — `STAGE_A_ONCLICK_API.md` regenerated; 14 owning modules; +5-fn watch list |
| 4 — Import edges | 12 (stale) | **15** clusters — `STAGE_A_IMPORT_GRAPH.md` + `STAGE_A_MAIN_ENTRY_DRAFT.js` regenerated (8 modules folded in) |
| 5 — Missing prompts | 3 missing (est.) | **8 authored** — `STAGE_A_54..61`; all 61 modules now covered 1:1 |
| 6 — Terminal cutover | `STAGE_A_54-cutover` | **`STAGE_A_62-cutover`** — renumbered, references swapped, verified last |

**Verdict: still NO-GO.** The three frozen design docs and the prompt
queue now match the live 61-module tree and the terminal cutover is
correctly positioned — the readiness gap is materially smaller than at
Session I. But the GO criteria are not met:

- **Item 1 (still PENDING, blocking, gated):** the outstanding IIFE
  extraction queue is not burned down. Stage A's own prerequisite
  ("AFTER IIFE round 01–46") remains unmet; not-yet-extracted inline
  IIFEs cannot coexist with a `type="module"` graph after cutover. This
  is large and outside Session K's documentation scope.
- **Item 7 (still PENDING, gated on Item 1):** re-run this go/no-go after
  Item 1 closes, and re-run the Items 2–6 scans once more against the
  final post-IIFE tree — every regenerated doc's KEEP/import/survivor
  list is an explicit **floor**, not a ceiling.

**Next blocker = Item 1.** No further deterministic prep is possible until
the IIFE round substantially completes.

---

## Session Q re-evaluation (2026-05-17)

Read-only recount + go/no-go re-run against the live tree. Documentation
only — no code extracted or modified. Branch:
`claude/sync-stage-a-docs-Re12D`. Survey delta:
`STAGE_A_MODULE_SURVEY.md` §"Session Q refresh".

### Criteria checklist

**Hard prerequisites**

- [ ] `app/index.html` ≤ 50,000 lines → **144,245 — FAIL** (down from
  149,314 at Session I; the gap is narrowing but the target is far off)
- [ ] ≥ 80 modules extracted → **66 — FAIL** (61 → 66 since Session K)
- [ ] All "Class A overlap" prompts resolved → **FAIL** — prompts
  41/19/32/44 carry open `MODULAR_PLAN_PROMPT_*_RESOLUTION.md` notes
  (44 superseded by the completed 44-v2; 41 re-anchored but unrun;
  32 skipped → 33-v2 only partially unblocked)
- [ ] No prompt BLOCKED for >2 sessions → **FAIL** — prompt 41
  (ai-domain-knowledge) skipped at §0 across Sessions G/J and still open
- [ ] All core/* + spatial/* + ai/* clusters complete → **MIXED**:
  `core/*` (4) and `spatial/*` (7) substantially extracted; `ai/*` is
  only `ai/context` + `ai/ai-mode-toggle` — the ai-analyst chain
  (40c\*) and `ai/ai-domain-knowledge` (41) are **not** done → FAIL

**Soft prerequisites**

- [ ] CLAUDE.md off-limits list up to date → **PASS** — Session Q audit
  found all 64 registered modules already named in the existing "Round X
  extracted (… off-limits)" prose bullets (the +5 are covered by the
  Session J/M bullets); no CLAUDE.md edit required
- [ ] Total module LOC > inline LOC remaining → **FAIL** — 27,167 module
  LOC vs 144,245 inline; inline still dominates ~5:1
- [ ] No console errors on deployed app → **NOT RE-CHECKED** this session
  (doc-only; no Playwright/Chrome run)

### Verdict: **NO-GO** (unchanged)

The dominant blocker is identical to Sessions I and K: **the IIFE
extraction round 01–46 is far from complete.** `app/index.html` is still
144,245 lines (definition of done: < 30,000 / all inline JS extracted).
The +5 post-Session-K modules have **no `STAGE_A_NN` conversion prompt**
and are absent from all three frozen design docs — the same Item 1 /
Item 2 failure mode the Session I report described, just with a larger
module count. The readiness gap continues to narrow slowly (149,314 →
144,245; 56 → 66 modules) but no hard prerequisite is met.

**Path to GO is unchanged** — execute the §5 punch list in order:
burn down the outstanding IIFE extraction queue (Item 1, the gating,
out-of-scope item), then re-run survey / onclick / import-edge scans,
author the now-**5** missing conversion prompts, keep `STAGE_A_62-cutover`
terminal, and only then re-run this go/no-go. Every regenerated doc's
KEEP/import/survivor list is a **floor, not a ceiling**.

**Next blocker = Item 1** (unchanged). No further deterministic doc prep
is possible until the IIFE round substantially completes.
