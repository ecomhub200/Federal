# Session M — Autonomous extraction queue

> Generated 2026-05-17 (CC Session L). Companion:
> `REMAINING_WORK_INVENTORY.md`. **One module per session. Verbatim
> only. NO behavior changes.** Run prompts in the order below; each is a
> separate session and must complete §5 post-flight + §6 smoke test
> before the next starts.
>
> **Line numbers are live as of 2026-05-17 and WILL DRIFT** after every
> extraction. They are anchors to *locate* the block — always re-derive
> `[BLK_START, BLK_END]` by the §0 grep + brace read at run time. Do not
> trust `INDEX_MAP*.md` ranges.

`app/index.html` baseline for this queue: **146,633 lines**.
`loader.js` already has the roots `CL.app CL.cmf CL.safety CL.ai
CL.data CL.reports` — **no new namespace root needed** for any item
below.

---

## Order & rationale

1. **44-v2** — zero gate, fully self-contained IIFE → lowest risk, ship first.
2. **42b2** — prereq 42b1 already shipped; supervised brace-read.
3. **42b3** — trivial 4-fn block; must run *after* 42b2 wires its tag.
4. **31** — prereq grants-ui shipped; LARGE/SUPERVISED (likely sub-split).
5. **32** — must run *after* 31 wires its tag.

Expected `app/index.html` reduction after the full queue: **≈ 1,700–
2,200 lines** (44-v2 ~691 + 42b2 ~500–700 + 42b3 ~66 + 31 ≥500 + 32
~354; 31's true size resolved by its §0 brace read).

---

### 1 — `44-v2-iife-wholesale.md` → `app/modules/data/dashboard-filter-bindings.js`

- **Status:** READY. No prerequisite gate.
- **Verified §0 (2026-05-17):**
  - `(function () {` wrapper @ **L145501** — **note: a 2nd unrelated
    `(function () {` exists @ L146550.** The target IIFE is the one
    bounded by the close-log below; the banner
    `// All event handlers are idempotent — safe to re-run on tab change.`
    sits 4 lines above L145501.
  - close anchor `console.log('[Round 18] Filter-audit wiring loaded.');`
    @ **L146191** → next non-blank line `})();` then `</script>`.
  - sampled inner decls present: `_activeStateKey` L145504,
    `populateTrafficControlDropdown` L145522 (async),
    `_r18ApplyDashboardYearFilter` L145754, `_restoreFilterInputs`
    L146150. All 14 expected inner functions in one contiguous run.
  - target `data/dashboard-filter-bindings.js` — **FREE**.
- **Block:** `[L145501, L146192]` (~691 LOC) — confirm by brace read.
- **Risk:** very low — provably self-contained (the only out-of-IIFE
  hit is a coincidental local `const _activeStateKey` ~L100645, a
  different binding, per the prompt's documented exception).
- **Caution:** §0.1 of the prompt says "exactly ONE matching wrapper" —
  the file has two `^(function () {$`. Disambiguate by the
  banner + `[Round 18]` close-log, not by uniqueness of the wrapper
  regex.

### 2 — `42b2-reports-pdf.md` → `app/modules/reports/reports-pdf.js`

- **Status:** READY. Prereq **42b1 shipped** (`reports-standard-*`
  modules exist; script tag `modules/reports/reports-standard-types.js`
  @ **L4484**).
- **Verified §0 (2026-05-17):** `printReport` @ **L64332**,
  `downloadReportPDF` @ **L64359**, `generateStandardReportPDF` @
  **L64415**, `copyReportText` @ **L65398**. Target `reports-pdf.js`
  — **FREE**.
- **🔴 SUPERVISED brace-read.** The 42b3 chart builders sit **just
  above** at L64264–L64317 (`createReportCharts`…`createTrendCharts`).
  `BLK_START` must begin at/after `printReport` (L64332) — **do NOT
  over-capture the chart fns** (they belong to 42b3). `copyReportText`
  (L65398) is ~1,000 lines below the print cluster — confirm the band is
  one contiguous run by brace read; if it isn't, STOP and report (likely
  needs `-pdf` + `-pdf2` split per the prompt).
- **Est. block:** ~500–700 LOC.

### 3 — `42b3-reports-charts.md` → `app/modules/reports/reports-charts.js`

- **Status:** READY, **gated behind 42b2** (its load anchor
  `modules/reports/reports-pdf.js` = 0 matches until 42b2 ships). Queue
  immediately after 42b2.
- **Verified §0 (2026-05-17):** 4 contiguous fns —
  `createReportCharts` L64264, `createSafetyCharts` L64279,
  `createPedBikeCharts` L64301, `createTrendCharts` L64317. Target
  **FREE**.
- **Block:** ~`[L64264, L64331]` (~66 LOC) — re-derive by brace read;
  stop before `printReport` (42b2's territory, which by then will have
  been removed — re-anchor at run time).
- **Risk:** very low — tiny, clean Chart.js builder block.

### 4 — `31-cmf-cmf-search.md` → `app/modules/cmf/cmf-search.js`

- **Status:** READY, **🔴 LARGE / SUPERVISED**. Prereq **shipped**
  (script tag `modules/grants/grants-ui.js` @ **L4466**).
- **Verified §0 (2026-05-17):** `loadCMFDatabase` (async) @ **L81808**,
  `populateCMFLocations` @ **L82047**. Module-private `cmfState`
  declared @ **L76502** — **NON-CONTIGUOUS** (~5,300 lines above the
  block, same hazard class as prompt 20-v2's `crashTreeState`). Target
  dir `cmf/` and `cmf/cmf-search.js` — **FREE**. `CL.cmf` root present
  (`loader.js` L12).
- **Decisions required at §0 (surface for human verification before any
  delete):**
  1. `cmfState` move-decl-vs-`window`-mirror: prefer moving the single
     `const cmfState = {…}` line into the module **only if** no inline
     reader survives outside `[BLK_START,BLK_END]`; otherwise keep it
     inline + `window.cmfState` mirror.
  2. Size: the prompt's snapshot implies ~3,672 LOC. The prompt itself
     says **if >500 LOC STOP and sub-split** per `MODULAR_PLAN.md` §2.
     Brace-read the true span first; expect a sub-split into
     `cmf-search` + sibling(s).
- **Treat as a multi-session item** (the sub-split alone is one session
  of planning). Do not auto-run through to deletion.

### 5 — `32-cmf-cmf-ai.md` → `app/modules/cmf/cmf-ai.js`

- **Status:** READY, **gated behind 31** (load anchor
  `modules/cmf/cmf-search.js` = 0 until 31 ships). Queue after 31.
- **Verified §0 (2026-05-17):** `initCMFAI` @ **L41049** (~354 LOC,
  self-contained — far from the cmf-search block, independent). Target
  `cmf/cmf-ai.js` — **FREE**.
- **Risk:** low — clean isolated block once 31's script tag exists.

---

## Not in Session M (and why)

| Prompt | Reason | Needs |
|---|---|---|
| 46 app-bootstrap | anchors non-contiguous; `_supabaseTabReady` absent | re-anchor resolution doc |
| 43 reports-custom | placeholder `[Rr]eport` anchor | re-author resolution doc |
| 20-v2 / 21-v2 / 22-v2 | chain gated on prompt 19 | ship 19 (after its resolution doc) |
| 19, 41 | anchor unisolable | their existing resolution docs → re-authored prompts |
| 33-v2 | gated behind cmf 31+32 | runs in Session N after 31/32 land |
| 37-v2 | prereq 36 met but §0 not re-verified this session | re-run §0 grep before queuing |
| 15/16/17/18, 27/28/29, 40c1-3, 42c*, 42d | inline, not yet started | normal queue once Session M clears |

**Session N seed:** author resolution docs for **19, 41, 43, 46**, then
the `19 → 20-v2 → 21-v2 → 22-v2` chain becomes runnable and the cmf
`33-v2` unblocks after Session M.

---

## Per-session checklist (apply to every queued prompt)

- [ ] Re-run the prompt's §0 grep — confirm anchors still resolve
      (line numbers will differ from this doc — that is expected).
- [ ] Confirm prereq script tag present; target module FREE.
- [ ] Extract verbatim; dual-expose `window.<fn>` + `CL.<area>.<fn>`;
      `CL._registerModule(...)`.
- [ ] §5 post-flight: `wc -l` drop ≈ block; fn-count drop = moved count;
      `node --check` passes; exactly one new script tag; `git diff
      --stat` shows only `app/index.html` + the one new module.
- [ ] §6 smoke test on `https://ecomhub200.github.io/Federal/app/`
      (console clean; the feature still works).
