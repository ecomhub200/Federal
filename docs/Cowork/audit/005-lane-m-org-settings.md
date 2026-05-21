# CC Lane M — extract org settings modal + handlers (single-lane)

**Goal:** Extract 8 org-settings functions (getOrgSettings through closeSidebarSettings) from `app/index.html` to `settings/org-settings.js`.

**Pre-flighted by Cowork (2026-05-19):**
- Anchor `getOrgSettings` @ L27203
- Last fn in band: `closeSidebarSettings` @ L27343
- Band END marker (NOT moved): `resetSidebarState` @ L27348 (a later sidebar fn, different cluster — leave inline for future)
- 8 contiguous functions, ~145 LOC
- Target FREE (`app/modules/settings/org-settings.js` does not exist)

**Cluster:** `app/modules/settings/` (NEW — also used by Lane K if K runs first).

**Conflict awareness:** Lanes K and M both target `settings/` cluster. Orchestrator runs them sequentially anyway. If K ran first and created `CL.settings`, this lane reuses; otherwise creates it.

## Branch

Harness-designated branch. Nominal: `claude/lane-m-org-settings`. **No PR.**

## Pre-flight

```bash
cd <repo root>
git checkout main && git pull origin main
git checkout <harness-designated branch>
wc -l app/index.html
```

## §0 Anchor verification + ABORT gate

```bash
grep -nE '^function +getOrgSettings\b' app/index.html # ~L27203
grep -nE '^function +(saveOrgSettings|getReportAttribution|updateOrgSettingsPreview|showSidebarSettings|clearOrgSettings|initOrgSettingsInForms|closeSidebarSettings)\b' app/index.html
grep -nE '^function +resetSidebarState\b' app/index.html # band END marker — DO NOT include
test -f app/modules/settings/org-settings.js && echo ABORT-EXISTS || echo OK
```

Brace-read from `getOrgSettings` → last fn BEFORE `resetSidebarState`. Record start/end + LOC (~145).

**ABORT if:** target exists · band not contiguous · `resetSidebarState` consumed · any moved name maps to off-limits.

## §2 Skeleton

```js
/** CL settings.org — org settings modal + handlers extracted 2026-05-19.
* Reads/writes localStorage for org name + sub-dept. */
(function(){ 'use strict';
// ─── EXTRACTED CODE START (verbatim) ───
// ─── EXTRACTED CODE END ───
window.CL=window.CL||{}; CL.settings=CL.settings||{};
CL.settings.org=CL.settings.org||{};
window.getOrgSettings=getOrgSettings; CL.settings.org.getOrgSettings=getOrgSettings;
window.saveOrgSettings=saveOrgSettings; CL.settings.org.saveOrgSettings=saveOrgSettings;
window.getReportAttribution=getReportAttribution; CL.settings.org.getReportAttribution=getReportAttribution;
window.updateOrgSettingsPreview=updateOrgSettingsPreview; CL.settings.org.updateOrgSettingsPreview=updateOrgSettingsPreview;
window.showSidebarSettings=showSidebarSettings; CL.settings.org.showSidebarSettings=showSidebarSettings;
window.clearOrgSettings=clearOrgSettings; CL.settings.org.clearOrgSettings=clearOrgSettings;
window.initOrgSettingsInForms=initOrgSettingsInForms; CL.settings.org.initOrgSettingsInForms=initOrgSettingsInForms;
window.closeSidebarSettings=closeSidebarSettings; CL.settings.org.closeSidebarSettings=closeSidebarSettings;
CL._registerModule('settings/org-settings');
})();
```

**Loader edit:** if `CL.settings` is absent from `app/modules/loader.js`, add ONLY that one top-level key (skip if Lane K already added it).

## §3 Script tag

LATE cluster. Insert after the most recent `<script src="modules/settings/*">` tag (e.g., security-settings.js if Lane K ran first), else after scorecard. Verify at runtime.

## §4 Remove

```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
```
Delete verbatim block. Do NOT touch `resetSidebarState`.

## §5 Post-flight

```bash
wc -l app/index.html # drops ~145
node --check app/modules/settings/org-settings.js
grep -nE 'function +(getOrgSettings|saveOrgSettings|getReportAttribution|updateOrgSettingsPreview|showSidebarSettings|clearOrgSettings|initOrgSettingsInForms|closeSidebarSettings)\b' app/index.html # 0
grep -c '<script src="modules/settings/org-settings.js"></script>' app/index.html # 1
git diff --stat
```

Console: `[CL] Module loaded: settings/org-settings`.

## §6 Smoke

```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli console # NO new errors
# Open Sidebar Settings (gear icon) → set Org Name + Sub-Dept → save → preview updates →
# refresh page → settings persisted from localStorage. Generate a report → org attribution appears in PDF.
playwright-cli close
```

## §7 Rollback

```bash
git checkout -- app/index.html && rm app/modules/settings/org-settings.js
# also revert loader.js if you added CL.settings root
```

## §8 Out of scope

`resetSidebarState`/`expandAllSections`/`collapseAllSections` (the tail of sidebar cluster, future lane); `getStateHSO` and other state-lookup helpers; any non-org-settings code; renames; reformatting; PR.

## Commit & push

```bash
git add app/modules/settings/org-settings.js app/index.html app/modules/loader.js
git commit -m "refactor: extract org settings handlers to settings/org-settings.js"
git push -u origin <harness branch>
```

## Final report

```
Lane M complete (org settings).
- app/index.html: <baseline> → <new> (−<delta>, target ~145)
- new module: settings/org-settings.js (node --check clean, registered)
- CL.settings root added to loader.js: yes|no (already present if Lane K ran)
- 8 fns moved
- Smoke: org settings save/persist/attribution green, console clean
- Branch: <harness branch> (pushed; no PR)
```
