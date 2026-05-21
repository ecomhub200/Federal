# CC Lane K — extract security settings modal handlers (single-lane)

**Goal:** Extract 9 security-settings modal handlers (showSecuritySettings through dismissExitWarning) from `app/index.html` to `settings/security-settings.js`. Tight cluster.

**Pre-flighted by Cowork (2026-05-19):**
- Anchor `showSecuritySettings` @ L26641
- Last fn in band: `dismissExitWarning` @ L26702
- Band END marker (NOT moved): `getStateHSO` @ L26769 (state lookup, unrelated cluster)
- 9 contiguous functions, ~70 LOC
- Target FREE (`app/modules/settings/security-settings.js` does not exist; no `settings/` cluster yet — this creates it)

**Cluster:** `app/modules/settings/` (NEW).

## Branch

Harness-designated branch. Nominal: `claude/lane-k-security-settings`. **No PR.**

## Pre-flight

```bash
cd <repo root>
git checkout main && git pull origin main
git checkout <harness-designated branch>
wc -l app/index.html
```

## §0 Anchor verification + ABORT gate

```bash
grep -nE '^function +showSecuritySettings\b' app/index.html # ~L26641
grep -nE '^function +(closeSecurityModal|updateSecurityOptionsUI|selectSecurityMode|updateSecurityTimeout|extendKeySession|clearKeyNow|clearAllApiKeysSecure|dismissExitWarning)\b' app/index.html
grep -nE '^function +getStateHSO\b' app/index.html # band END marker
test -f app/modules/settings/security-settings.js && echo ABORT-EXISTS || echo OK
```

Brace-read from `showSecuritySettings` → last fn BEFORE `getStateHSO`. Record start/end + LOC (~70).

**ABORT if:** target exists · band not contiguous · `getStateHSO` consumed · any moved name maps to off-limits.

## §2 Skeleton

```js
/** CL settings.security — security settings modal handlers extracted 2026-05-19.
* No behavior change. Reads inline securityState / keyManager via window-mirror. */
(function(){ 'use strict';
// ─── EXTRACTED CODE START (verbatim) ───
// ─── EXTRACTED CODE END ───
window.CL=window.CL||{}; CL.settings=CL.settings||{};
CL.settings.security=CL.settings.security||{};
window.showSecuritySettings=showSecuritySettings; CL.settings.security.showSecuritySettings=showSecuritySettings;
window.closeSecurityModal=closeSecurityModal; CL.settings.security.closeSecurityModal=closeSecurityModal;
window.updateSecurityOptionsUI=updateSecurityOptionsUI; CL.settings.security.updateSecurityOptionsUI=updateSecurityOptionsUI;
window.selectSecurityMode=selectSecurityMode; CL.settings.security.selectSecurityMode=selectSecurityMode;
window.updateSecurityTimeout=updateSecurityTimeout; CL.settings.security.updateSecurityTimeout=updateSecurityTimeout;
window.extendKeySession=extendKeySession; CL.settings.security.extendKeySession=extendKeySession;
window.clearKeyNow=clearKeyNow; CL.settings.security.clearKeyNow=clearKeyNow;
window.clearAllApiKeysSecure=clearAllApiKeysSecure; CL.settings.security.clearAllApiKeysSecure=clearAllApiKeysSecure;
window.dismissExitWarning=dismissExitWarning; CL.settings.security.dismissExitWarning=dismissExitWarning;
CL._registerModule('settings/security-settings');
})();
```

**Loader edit:** if `CL.settings` is absent from `app/modules/loader.js`, add ONLY that one top-level key.

## §3 Script tag

LATE cluster. Insert after the most recent late-loaded module (e.g., `scorecard/scorecard.js`). Verify at runtime.

## §4 Remove

```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
```
Delete verbatim block. Do NOT touch `getStateHSO`.

## §5 Post-flight

```bash
wc -l app/index.html # drops ~70
node --check app/modules/settings/security-settings.js
grep -nE 'function +(showSecuritySettings|closeSecurityModal|updateSecurityOptionsUI|selectSecurityMode|updateSecurityTimeout|extendKeySession|clearKeyNow|clearAllApiKeysSecure|dismissExitWarning)\b' app/index.html # 0
grep -c '<script src="modules/settings/security-settings.js"></script>' app/index.html # 1
git diff --stat
```

Console: `[CL] Module loaded: settings/security-settings`.

## §6 Smoke

```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli console # NO new errors
# Open Security Settings modal (look for cog icon in sidebar) → switch security mode → close modal → re-open. No errors.
playwright-cli close
```

## §7 Rollback

```bash
git checkout -- app/index.html && rm app/modules/settings/security-settings.js
# also revert loader.js if you added CL.settings root
```

## §8 Out of scope

`getStateHSO` (state lookup, separate concern); `securityState` / `keyManager` globals (stay inline); any non-security-settings code; renames; reformatting; PR.

## Commit & push

```bash
git add app/modules/settings/security-settings.js app/index.html app/modules/loader.js
git commit -m "refactor: extract security settings modal handlers to settings/security-settings.js"
git push -u origin <harness branch>
```

## Final report

```
Lane K complete (security settings).
- app/index.html: <baseline> → <new> (−<delta>, target ~70)
- new module: settings/security-settings.js (node --check clean, registered)
- CL.settings root added to loader.js: yes|no
- 9 fns moved
- Smoke: security modal open/switch/close green, console clean
- Branch: <harness branch> (pushed; no PR)
```
