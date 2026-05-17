# MODULAR PLAN — Prompt 44 v2: Whole-IIFE Wholesale Extraction

**Status:** Plan (Session I, 2026-05-17). Documentation only — no code moved.
**Supersedes:** `MODULAR_PLAN_PROMPT_44_RESOLUTION.md` (Session A diagnosis)
and the BLOCKED `modular-prompts/44-data-filter-wiring.md`.
**Produces:** `modular-prompts/44-v2-iife-wholesale.md` (the runnable
replacement prompt).

---

## 1. Why prompt 44 was BLOCKED

`modular-prompts/44-data-filter-wiring.md` targeted **5** filter-wiring
functions for isolated extraction:

- `_r18ApplyDashboardYearFilter`
- `_r18ReloadHotspots`
- `_r19LoadSafetyCategoriesWithFilter`
- `_bindFilterInputs`
- `_restoreFilterInputs`

Session A's `MODULAR_PLAN_PROMPT_44_RESOLUTION.md` found these 5 are **not a
contiguous standalone block**. They are declared *inside* a single shared
`(function () { 'use strict'; … })();` IIFE that also encloses unrelated
helpers and one piece of closure-private state (`_trafficCtrlCache`). You
cannot lift 5 functions out of a closure and leave the closure behind:

- The 5 functions and their 9 siblings share the IIFE's lexical scope.
- They reference each other and the closure-private `_trafficCtrlCache`.
- Splitting the closure changes scope/identity semantics → behavior change,
  which the refactor rules forbid (§"NO behavior changes").

**Resolution:** extract the **entire IIFE as one coherent module**. The IIFE
*is* the unit of extraction — it is already a self-contained, self-invoking
"Round 18/19 filter-audit wiring" bundle.

---

## 2. Current IIFE survey (re-derived 2026-05-17 — Session A range is STALE)

`app/index.html` is now **149,314 lines** (Session A snapshot: 153,085 —
drift ≈ −3,771). Session A's quoted range **L151953–L152643 no longer
applies**. Re-derived against the live file by function-name anchor:

| Item | Value |
|---|---|
| Banner comment start | **L148178** (`// ====…` + state-agnostic note) |
| IIFE wrapper open | **L148182** `(function () {` (`'use strict';` @ L148183) |
| First inner declaration | **L148185** `_activeStateKey` |
| Closure-private state | **L148202** `const _trafficCtrlCache = new Map();` |
| Final log line | **L148873** `console.log('[Round 18] Filter-audit wiring loaded.');` |
| IIFE close | **L148874** `})();` |
| `</script>` boundary | **L148876** (inline HTML "Account & Billing Modal" @ L148878) |
| **Extraction block (IIFE)** | **L148182–L148874 — 693 lines** |

> ⚠️ These line numbers WILL drift again before 44-v2 runs (other sessions
> extract code above this point). The runnable prompt anchors on
> **function names + the `[Round 18] Filter-audit wiring loaded.` log**,
> never on these numbers. They are recorded here only as a snapshot.

### Inner declarations — 14 functions (Session A guessed 7; the IIFE grew)

| # | Function | prompt-44 anchor? | Disposition in 44-v2 |
|---|---|---|---|
| 1 | `_activeStateKey` | no | module-private |
| 2 | `_yearFromIsoDate` | no | module-private |
| 3 | `populateTrafficControlDropdown` | no | module-private |
| 4 | `_applyTrafficCtrlOptions` | no | module-private |
| 5 | `applyStateAwareCheckboxDefaults` | no | module-private |
| 6 | `_hasCMFLocationSelected` | no | module-private |
| 7 | `_refreshActiveScopeCard` | no | module-private |
| 8 | `_r18ApplyDashboardYearFilter` | **YES** | `window.*` + `CL.data.*` |
| 9 | `_r18ReloadHotspots` | **YES** | `window.*` + `CL.data.*` |
| 10 | `_r18ReloadIntersections` | no | module-private |
| 11 | `_r19LoadSafetyCategoriesWithFilter` | **YES** | `window.*` + `CL.data.*` |
| 12 | `_bindOnce` | no | module-private |
| 13 | `_bindFilterInputs` | **YES** | `window.*` + `CL.data.*` |
| 14 | `_restoreFilterInputs` | **YES** | `window.*` + `CL.data.*` |

### Self-containment (verified — the key enabling fact)

All 14 names are referenced **only within L148182–L148874**. There are
**zero** external inline references and **zero**
`onclick=/onchange=/oninput=` references anywhere in `app/index.html` or
`app/modules/`. (The `_activeStateKey` hits at `app/index.html:148645`-area
elsewhere are a *coincidentally named local `const`* in a different
function — not a call into this IIFE.)

⇒ A verbatim whole-IIFE move is **behaviorally inert**. The `window.*` +
`CL.data.*` mirrors for the 5 anchors are **convention/forward-compat
(belt-and-suspenders), not a correctness requirement** — nothing calls them
from outside the closure today. The prompt still adds them per the refactor's
mandatory dual-public-API rule and the Session I task spec.

---

## 3. Module name decision

**Chosen:** `app/modules/data/dashboard-filter-bindings.js`

**Rationale (user-confirmed):**

- **`data/` directory** — consistent with the original prompt's intended
  path (`44-data-filter-wiring.md`) and with the `CL.data.*` exposure target
  the Session I task mandates for the 5 anchors. No new top-level namespace
  key needed in `loader.js` (`CL.data` already exists).
- **Functional name over versioned name** — the IIFE hosts R18 dashboard/
  hotspots/intersections wiring + R19 safety-category wiring + traffic-
  control/scope-card helpers. "dashboard-filter-bindings" describes the
  *responsibility*; a round-versioned name (`r18-r19-…`) ages poorly once
  "Round 18/19" loses meaning, and `round-fixes/` would invent a top-level
  directory absent from `loader.js` and the existing module map.
- Rejected: `data/r18-r19-filter-wiring.js` (version-coupled),
  `round-fixes/r18-r19-wiring.js` (new namespace root, off-pattern).

**Load cluster:** **LATE** (with the other late-loaded `data/*` scripts).
The IIFE today self-invokes near end-of-`<body>` and only *binds* on
DOM-ready / user interaction (idempotent handlers, safe to re-run on tab
change — per its own banner comment). LATE placement preserves that timing.
44-v2 §0 must re-confirm the exact anchor `<script>` line before insertion.

---

## 4. Extraction strategy (what 44-v2 instructs)

1. Move the **entire IIFE verbatim** (`(function () {` … `})();`,
   L148182–L148874) into the new module.
2. The original inner `(function () { 'use strict'; … })();` is pasted
   **inside** the standard outer module IIFE wrapper. A nested IIFE is fine:
   it self-invokes on script load exactly as before. No reformat, no rename,
   no comment edits — byte-for-byte.
3. The 5 anchor functions are closure-private to the **inner** IIFE.
   To mirror them, the prompt instructs adding the
   `window.* = …` / `CL.data.* = …` assignments **inside the inner IIFE,
   immediately before its closing `})();`** (where those names are in
   scope) — *not* in the outer module scope (where they are invisible).
   This is the one surgical addition; everything else is verbatim.
4. `_r18ReloadIntersections`, `_bindOnce`, and the 7 helper functions stay
   inner-IIFE-private (no mirror) — preserves closure semantics for
   `_trafficCtrlCache` and the helper graph.
5. End the module body with `CL._registerModule('data/dashboard-filter-bindings');`.
6. Add the `<script src="modules/data/dashboard-filter-bindings.js">` tag in
   the LATE cluster; delete L148182–L148874 from `app/index.html` (boundary
   re-verified by `sed` head/tail before the cut).

After 44-v2 runs, **prompt 44 is COMPLETE**. Do not also run
`44-data-filter-wiring.md`.

---

## 5. Verification expectations (encoded in 44-v2 §5–§6)

- `wc -l app/index.html` drops by ≈ 693.
- Named-function count drops by 14.
- `node --check app/modules/data/dashboard-filter-bindings.js` passes.
- `git diff --stat` shows ONLY `app/index.html` + the one new module.
- Console shows `[CL] Module loaded: data/dashboard-filter-bindings` AND the
  original `[Round 18] Filter-audit wiring loaded.` still logs.
- Playwright smoke on `https://ecomhub200.github.io/Federal/app/`: change
  the Dashboard year filter → hotspots, intersections, and safety
  categories re-render; `playwright-cli console` shows no new errors.

---

## 6. Effect on the refactor queue

- Unblocks the prompt-44 slot in the IIFE round.
- `modular-prompts/SUPERSEDED.md` records the supersession.
- The new module `data/dashboard-filter-bindings.js` must be appended to the
  CLAUDE.md off-limits list once 44-v2 verifies green (orchestrator action,
  not this session).
