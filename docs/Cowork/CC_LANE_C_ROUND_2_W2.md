# CC Lane C — Round 2 — W2 filter-chips render (single-lane, §0 ABORT-gated)

**Goal:** IF a single contiguous "filter chips render" block exists in
`app/index.html`, extract it to `filters/filter-chips.js`. **If it does not
exist (the expected state today), §0 ABORTS cleanly and this lane is a
no-op.** One extraction or one clean abort. No PR either way.

> **Authoring note (read first):** as of authoring there is **no** contiguous
> filter-chips render block in `app/index.html`. The only filters prompt,
> `modular-prompts/44-data-filter-wiring.md`, is **aspirational** — its
> `_r18*`/`_r19*`/`_bindFilterInputs` functions are not yet inline, and there
> is **no W1/W2 distinction** in the repo. This prompt is authored with a
> hard §0 ABORT gate **by design** so Round 2 stays parallel-safe: it
> contributes nothing if there is nothing to extract, and never blocks Lane
> A/B or the round.

**Cluster:** `app/modules/filters/` ONLY. **Conflict awareness:** parallel
with Lane A (`pedbike/`) and Lane B (`grants/`) — disjoint clusters.

## Branch

Harness-designated branch. Nominal lane branch
`claude/lane-c-r2-filter-chips`; harness mandate wins. No push elsewhere
without permission. **No PR.**

## Pre-flight

```bash
cd <repo root>
git checkout main && git pull origin main
git checkout <harness-designated branch>
wc -l app/index.html                          # RECORD BASELINE
```

⚠️ All line numbers advisory; re-derive by name anchor at run time.

## §0 Pre-flight — ABORT GATE (this is the load-bearing step)

```bash
grep -nE '^(async )?function +(renderFilterChips?|buildFilterChips|updateFilterChips|createFilterChip|renderActiveFilters|renderFilterPills)\b' app/index.html
grep -nE 'filter-chip' app/index.html | grep -viE 'css|style|\.filter-chip *\{' | head
test -f app/modules/filters/filter-chips.js && echo ABORT-EXISTS || echo OK
```

**ABORT (clean, exit 0, report "no Round 2 filter-chips candidate yet") if
ANY of:**
- the grep finds **no contiguous block** of chip-render functions (the
  expected case today), OR
- only scattered `.filter-chip` CSS / one-off helpers (e.g.
  `updateFilterLocationDropdown`, `resetFilterUI`, `renderSignFilterItems`)
  with no cohesive render module, OR
- the candidate functions are interleaved with non-filter code (not
  contiguous), OR
- target `filters/filter-chips.js` already exists.

On abort: **do NOT improvise, do NOT touch `data/`/dashboard filter wiring**
(that is `modular-prompts/44-data-filter-wiring.md`'s scope, a different
lane/round). Emit the report line, push nothing, exit 0. This is success for
this lane.

**Proceed to §1+ ONLY if** a single contiguous chip-render block is found and
brace-reads cleanly ≤500 LOC.

## §1 Boundaries (only if §0 passed)

Brace-read the first chip-render fn → last contiguous chip-render fn. Record
start/end + LOC. If > 500, ABORT and escalate (no split heuristic is
pre-approved for an unmapped block — surface for human review).

## §2 Skeleton (only if §0 passed)

```js
/** CL filters.chips — W2 extracted (name-anchored) <run date>. No behavior change. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.filters=CL.filters||{};
  CL.filters.chips=CL.filters.chips||{};
  CL._registerModule('filters/filter-chips');
})();
```

Dual public API: `window.<fn>` AND `CL.filters.chips.<fn>` for every moved fn.

**Loader note:** if `CL.filters` is absent from `app/modules/loader.js`, add
**only** that one top-level key (the single loader edit CLAUDE.md permits — a
new `CL.*` root). Do not touch any other loader line.

## §3 Script tag (only if §0 passed)

LATE cluster, after `<script src="modules/reports/reports-custom.js">` (the
filter/late anchor named by prompt 44) — **verify the anchor exists at run
time**; if absent, place at the end of the LATE cluster and note it.

## §4 Remove / §5 Post-flight / §6 Smoke / §7 Rollback

Standard (only if §0 passed): delete verbatim block; `wc -l` drops ≈ block
size; `node --check`; moved-fn grep → 0; one script tag; `git diff --stat` =
`app/index.html` + the one module (+ `loader.js` only if `CL.filters` added);
console `[CL] Module loaded: filters/filter-chips`; playwright-cli smoke on
`https://ecomhub200.github.io/Federal/app/` (apply filters → chips render/
remove, console clean); rollback `git checkout -- app/index.html && rm
app/modules/filters/filter-chips.js`.

## §8 Out of scope

`data/`/dashboard filter wiring (prompt 44 scope); any non-filters cluster;
renames; reformatting; PR; **inventing a filter-chips module from scratch**
(extraction only — if nothing to extract, abort).

## Commit & push

Only if §0 passed and an extraction was made: one commit
(`Lane C R2: extract W2 filter-chips`), push to the harness-designated branch
(retry backoff 2s/4s/8s/16s, max 4). **No PR.** If §0 aborted: no commit, no
push — report the abort line and stop.

## Final report

```
CC Lane C R2: <EXTRACTED | ABORTED-no-candidate>.
- if extracted: app/index.html <baseline>→<new> (−<delta>); new module
  filters/filter-chips.js; CL.filters root <added|present>; smoke green.
- if aborted: "no Round 2 filter-chips candidate yet" — no contiguous block;
  data/filter-wiring (prompt 44) intentionally untouched. Parallel-safe no-op.
- Branch: <harness branch> (pushed only if extracted; no PR)
```
