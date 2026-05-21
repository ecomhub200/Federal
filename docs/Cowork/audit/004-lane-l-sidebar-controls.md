# CC Lane L — extract sidebar toggle + state functions (single-lane)

**Goal:** Extract 7 early-sidebar functions (toggleSidebarSection through loadSidebarState) from `app/index.html` to `ui/sidebar-controls.js`. 

**Pre-flighted by Cowork (2026-05-19):**
- Anchor `toggleSidebarSection` @ L27024
- Last fn in band: `loadSidebarState` @ L27169
- Band END marker (NOT moved): `getOrgSettings` @ L27203 (next block is org settings — separate lane M)
- 7 contiguous functions, ~165 LOC
- Target FREE (`app/modules/ui/sidebar-controls.js` does not exist; `ui/` cluster has `skeletons.js` only)

**Note:** there are MORE sidebar functions later (resetSidebarState @ L27348, expandAllSections @ L27362, collapseAllSections @ L27370) but they are NON-contiguous with this block (org-settings sits between them). They go in a future lane.

**Cluster:** `app/modules/ui/` (existing).

## Branch

Harness-designated branch. Nominal: `claude/lane-l-sidebar-controls`. **No PR.**

## Pre-flight

```bash
cd <repo root>
git checkout main && git pull origin main
git checkout <harness-designated branch>
wc -l app/index.html
```

## §0 Anchor verification + ABORT gate

```bash
grep -nE '^function +toggleSidebarSection\b' app/index.html # ~L27024
grep -nE '^function +(toggleMobileSidebar|toggleSidebarCollapse|loadSidebarCollapseState|initSidebarTooltips|saveSidebarState|loadSidebarState)\b' app/index.html
grep -nE '^function +getOrgSettings\b' app/index.html # band END marker
test -f app/modules/ui/sidebar-controls.js && echo ABORT-EXISTS || echo OK
```

Brace-read from `toggleSidebarSection` → last fn BEFORE `getOrgSettings`. Record start/end + LOC (~165).

**ABORT if:** target exists · band not contiguous · `getOrgSettings` consumed · any moved name maps to off-limits.

## §2 Skeleton

```js
/** CL ui.sidebarControls — sidebar toggle + state persistence extracted 2026-05-19.
* Reads/writes localStorage. No shared state beyond DOM + localStorage. */
(function(){ 'use strict';
// ─── EXTRACTED CODE START (verbatim) ───
// ─── EXTRACTED CODE END ───
window.CL=window.CL||{}; CL.ui=CL.ui||{};
CL.ui.sidebarControls=CL.ui.sidebarControls||{};
window.toggleSidebarSection=toggleSidebarSection; CL.ui.sidebarControls.toggleSidebarSection=toggleSidebarSection;
window.toggleMobileSidebar=toggleMobileSidebar; CL.ui.sidebarControls.toggleMobileSidebar=toggleMobileSidebar;
window.toggleSidebarCollapse=toggleSidebarCollapse; CL.ui.sidebarControls.toggleSidebarCollapse=toggleSidebarCollapse;
window.loadSidebarCollapseState=loadSidebarCollapseState; CL.ui.sidebarControls.loadSidebarCollapseState=loadSidebarCollapseState;
window.initSidebarTooltips=initSidebarTooltips; CL.ui.sidebarControls.initSidebarTooltips=initSidebarTooltips;
window.saveSidebarState=saveSidebarState; CL.ui.sidebarControls.saveSidebarState=saveSidebarState;
window.loadSidebarState=loadSidebarState; CL.ui.sidebarControls.loadSidebarState=loadSidebarState;
CL._registerModule('ui/sidebar-controls');
})();
```

## §3 Script tag

LATE cluster. Insert after `<script src="modules/ui/skeletons.js">`. Verify at runtime.

## §4 Remove

```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
```
Delete verbatim block. Do NOT touch `getOrgSettings` or anything after it.

## §5 Post-flight

```bash
wc -l app/index.html # drops ~165
node --check app/modules/ui/sidebar-controls.js
grep -nE 'function +(toggleSidebarSection|toggleMobileSidebar|toggleSidebarCollapse|loadSidebarCollapseState|initSidebarTooltips|saveSidebarState|loadSidebarState)\b' app/index.html # 0
grep -c '<script src="modules/ui/sidebar-controls.js"></script>' app/index.html # 1
git diff --stat
```

Console: `[CL] Module loaded: ui/sidebar-controls`.

## §6 Smoke

```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli console # NO new errors
# Click sidebar collapse arrow → collapses → click again → expands. Sidebar tooltip on hover.
# Refresh page → sidebar state restored from localStorage.
playwright-cli close
```

## §7 Rollback

```bash
git checkout -- app/index.html && rm app/modules/ui/sidebar-controls.js
```

## §8 Out of scope

`getOrgSettings` and downstream org-settings cluster (separate lane M); `resetSidebarState`/`expandAllSections`/`collapseAllSections` (non-contiguous tail, future lane); any non-sidebar code; renames; reformatting; PR.

## Commit & push

```bash
git add app/modules/ui/sidebar-controls.js app/index.html
git commit -m "refactor: extract sidebar toggle + state to ui/sidebar-controls.js"
git push -u origin <harness branch>
```

## Final report

```
Lane L complete (sidebar controls).
- app/index.html: <baseline> → <new> (−<delta>, target ~165)
- new module: ui/sidebar-controls.js (node --check clean, registered)
- 7 fns moved
- Smoke: sidebar collapse + restore green, console clean
- Branch: <harness branch> (pushed; no PR)
```
