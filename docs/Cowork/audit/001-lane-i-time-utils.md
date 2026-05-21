# CC Lane I — extract time + clearDateFilter utilities (single-lane)

**Goal:** Extract 3 small utility functions (parseMilitaryTime, timeToMinutes, clearDateFilter) from `app/index.html` to `utils/time-utils.js`. Smallest/safest extraction — perfect for first orchestrator run to validate the loop.

**Pre-flighted by Cowork (2026-05-19):**
- `parseMilitaryTime` @ L26995, `timeToMinutes` @ L27004, `clearDateFilter` @ L27014
- Band END marker (NOT moved): `toggleSidebarSection` @ L27024
- Total block ~28 LOC. 3 contiguous pure-ish utilities.
- Target FREE (`app/modules/utils/time-utils.js` does not exist; `utils/` cluster has `date-utils.js` only).

**Cluster:** `app/modules/utils/` (existing).

## Branch

Harness-designated branch. Nominal: `claude/lane-i-time-utils`. **No PR.**

## Pre-flight

```bash
cd <repo root>
git checkout main && git pull origin main
git checkout <harness-designated branch>
wc -l app/index.html # baseline
```

## §0 Anchor verification + ABORT gate

```bash
grep -nE '^function +(parseMilitaryTime|timeToMinutes|clearDateFilter)\b' app/index.html # expect 3 matches
grep -nE '^function +toggleSidebarSection\b' app/index.html # band END marker — DO NOT include
test -f app/modules/utils/time-utils.js && echo ABORT-EXISTS || echo OK
```

Brace-read from `parseMilitaryTime` → last fn BEFORE `toggleSidebarSection`. Record start/end + LOC (~28).

**ABORT if:** target exists · band not contiguous · `toggleSidebarSection` consumed (means slice too greedy) · any moved name maps to off-limits.

## §2 Skeleton

```js
/** CL utils.timeUtils — small time + date-filter utilities extracted 2026-05-19.
* Pure helpers. No shared state. */
(function(){ 'use strict';
// ─── EXTRACTED CODE START (verbatim) ───
// ─── EXTRACTED CODE END ───
window.CL=window.CL||{}; CL.utils=CL.utils||{};
CL.utils.timeUtils=CL.utils.timeUtils||{};
window.parseMilitaryTime=parseMilitaryTime; CL.utils.timeUtils.parseMilitaryTime=parseMilitaryTime;
window.timeToMinutes=timeToMinutes; CL.utils.timeUtils.timeToMinutes=timeToMinutes;
window.clearDateFilter=clearDateFilter; CL.utils.timeUtils.clearDateFilter=clearDateFilter;
CL._registerModule('utils/time-utils');
})();
```

## §3 Script tag

Insert in the EARLY cluster after `<script src="modules/utils/date-utils.js">`. Verify at runtime.

## §4 Remove

```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
```
Delete verbatim block. Do NOT touch `toggleSidebarSection` or anything after it.

## §5 Post-flight

```bash
wc -l app/index.html # drops ~28
node --check app/modules/utils/time-utils.js
grep -nE 'function +(parseMilitaryTime|timeToMinutes|clearDateFilter)\b' app/index.html # 0
grep -c '<script src="modules/utils/time-utils.js"></script>' app/index.html # 1
git diff --stat
```

Console: `[CL] Module loaded: utils/time-utils`.

## §6 Smoke

```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli console # NO new errors
# In DevTools: parseMilitaryTime('14:30') returns numeric; clearDateFilter() runs without throw
playwright-cli close
```

## §7 Rollback

```bash
git checkout -- app/index.html && rm app/modules/utils/time-utils.js
```

## §8 Out of scope

`toggleSidebarSection` and downstream sidebar fns; any non-utility helpers; renames; reformatting; PR.

## Commit & push

```bash
git add app/modules/utils/time-utils.js app/index.html
git commit -m "refactor: extract time + date-filter utilities to utils/time-utils.js"
git push -u origin <harness branch>
```

## Final report

```
Lane I complete (time utils).
- app/index.html: <baseline> → <new> (−<delta>, target ~28)
- new module: utils/time-utils.js (≤500, node --check clean, registered)
- 3 fns moved (parseMilitaryTime, timeToMinutes, clearDateFilter)
- Smoke: console clean
- Branch: <harness branch> (pushed; no PR)
```
