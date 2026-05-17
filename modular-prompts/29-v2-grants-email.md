# CC Modular Extraction Prompt 29-v2 — `app/modules/grants/grants-email*.js` (7-CHILD RE-SPLIT)

**Supersedes `modular-prompts/29-grants-grants-email.md`** (anchors valid but
mid-block; original snapshot L39673–L41500; true band = the whole **EMAIL
NOTIFICATION SYSTEM** region `// EMAIL NOTIFICATION SYSTEM`@~31814 →
line before `// CRASH COST VALUE PRESETS`@~35466, **~3,651 LOC**, 7× ceiling).
This band **absorbs prompt 28's stray email-UI anchors** (`showNotifTab`,
`syncFromStandardReportsTab`, `updateEmailLocationVisibility`,
`toggleGrantAlertOptions`, `calculateGrantNextDelivery` — all live here, NOT in
the AI-app-gen band). Byte-unmodified — see `modular-prompts/SUPERSEDED.md`.
Re-anchored 2026-05-17 (CC Session N) @ live **145,624 lines**. Analysis:
`NEVER_RUN_PROMPTS_ANALYSIS.md`.

**Severity:** Refactor. **One CHILD per session.** **SEVEN-MODULE re-split**.
High split-risk; re-derive every child boundary by brace read.

## §0 Pre-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
grep -nE '^// EMAIL NOTIFICATION SYSTEM' app/index.html            # band START = ====== divider above (~L31814)
grep -nE '^// CRASH COST VALUE PRESETS' app/index.html             # band END = ====== divider above this (~L35466)
grep -nE '^(async )?function +(showNotifTab|generateReportForEmail|buildEmailSubjectLine|displayGrantLocations|buildEnrichedGrantContext|toggleSelectionAnalysis)\b' app/index.html
# Enumerate ALL fns in the band to fix the 7 child cuts ≤500:
grep -nE '^(async )?function [a-zA-Z_]+ *\(|^// [A-Z][A-Za-z ].{4,}' app/index.html | awk -F: '$1>=31814 && $1<=35465'
test -f app/modules/grants/grants-email-<child>.js && echo ABORT || echo OK
grep -n '<script src="modules/grants/grants-ui.js"></script>' app/index.html  # load-after anchor, expect 1
```
⚠️ `displayGrantLocations`@~34814 … `buildEnrichedGrantContext`@~35095 …
`toggleSelectionAnalysis`@~35185 are grant-location-table/selection helpers in
the contiguous tail — re-verify external (non-email) callers by grep; if shared,
window-mirror and keep, but they stay in the band (contiguous). ABORT if band
not contiguous / target exists / off-limits / slice splits a fn. Band ends
cleanly before `// CRASH COST VALUE PRESETS` — do NOT cross it.

## §1 What to move — 7 children (sub-header bands; ≤500 by brace read)
| Order | Child | Candidate band (by sub-header) | ~LOC | Contents |
|---|---|---|---|---|
| 29a | `grants/grants-email-state.js` | `// EMAIL NOTIFICATION SYSTEM`@~31814 → before `// Get R2-compatible jurisdiction path`@~32201 | ~387 | notification state mgmt, load notif prefs (Firestore), load email schedules (server) |
| 29b | `grants/grants-email-prefs.js` | `// Get R2-compatible…`@~32201 → before `// MULTI-EMAIL INPUT MANAGEMENT`@~33339 | split → ≤500 | R2 path parts, `showNotifTab`,`syncFromStandardReportsTab`,`updateEmailLocationVisibility`,`toggleGrantAlertOptions`, schedule helpers, Coolify/Brevo toggle, time presets, delivery mode, `calculateGrantNextDelivery` (if >500: split before `// Toggle delivery mode`@~33297) |
| 29c | `grants/grants-email-chips.js` | `// MULTI-EMAIL INPUT MANAGEMENT`@~33339 → before `// Save Email Notification Settings`@~33596 | ~257 | temp email list, validate/add/remove/primary/clear chips, paste handler, chip toast |
| 29d | `grants/grants-email-settings.js` | `// Save Email Notification Settings`@~33596 → before `// Generate grant summary email HTML`@~34217 | split → ≤500 | save settings, modal toast (if >500: split before `// Send test grant notification`@~34375 — but that's 29e) |
| 29e | `grants/grants-email-send.js` | `// Generate grant summary email HTML`@~34217 → before `generateReportForEmail`@34566 | ~349 | summary-email HTML builder, send test email, notification history |
| 29f | `grants/grants-email-report.js` | `generateReportForEmail`@34566 → before `displayGrantLocations`@34814 | ~248 | `generateReportForEmail`,`buildEmailSubjectLine`,`buildEmailStatsSection`,`buildEmailFindings` |
| 29g | `grants/grants-email-locations.js` | `displayGrantLocations`@34814 → band END (~L35464) | split → ≤500 | `displayGrantLocations`,`goToGrantPage`,`updateTierLegend`,`toggleLocationSelection`,`toggleLocationCheckbox`,`toggleSelectAll`,`clearAllSelections`,`updateSelectionUI`,`getCombinedSelectionStats`,`buildEnrichedGrantContext`,`toggleSelectionAnalysis` + B/C cost-benefit tail (if >500: split before `buildEnrichedGrantContext`@~35095) |

Every shipped child ≤500 by brace read. Copy bytes **verbatim**.

## §2 Skeleton (per child)
```js
/** CL grants.email<X> — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/29-v2-grants-email.md. No behavior change.
 *  Depends on (script order): grants/grants-ui. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.grants=CL.grants||{};
  CL.grants.email=CL.grants.email||{};
  CL._registerModule('grants/grants-email-<child>');
})();
```

## §3 Script tags (LATE, after `<script src="modules/grants/grants-ui.js">`, 29a→29g)
```html
<script src="modules/grants/grants-email-state.js"></script>
<script src="modules/grants/grants-email-prefs.js"></script>
<script src="modules/grants/grants-email-chips.js"></script>
<script src="modules/grants/grants-email-settings.js"></script>
<script src="modules/grants/grants-email-send.js"></script>
<script src="modules/grants/grants-email-report.js"></script>
<script src="modules/grants/grants-email-locations.js"></script>
```

## §4 Remove (per child)
```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
```

## §5 Post-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
node --check app/modules/grants/grants-email-<child>.js
grep -nE 'function +(<this child anchors>)\b' app/index.html         # 0
grep -c '<script src="modules/grants/grants-email-<child>.js"></script>' app/index.html  # 1
git diff --stat
```
Console: `[CL] Module loaded: grants/grants-email-<child>`.

## §6 Smoke (after last child)
Open deployed app → Grants tab → Email notification modal: tabs toggle, prefs
load, multi-email chips add/remove/primary, save settings, send test email,
notification history, report-for-email generates, grant-location table renders
+ select + combined stats + selection analysis. No new console errors;
`typeof window.showNotifTab === 'function'` and
`typeof window.generateReportForEmail === 'function'`. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/grants/grants-email-<child>.js`

## §8 Out of scope
CRASH COST VALUE PRESETS band; AI-app-gen band (28-v2); grant engine (27-v2);
`grants/grants-ui.js`/`grants/ranking.js` (off-limits); renames; PR.

---
### Ordering
29a→…→29g. **Run AFTER 27-v2 + 28-v2** (shares Grants tab; absorbs 28's stray
email anchors so 28-v2 must ship its AI-app-gen scope first). **Session O slot:
8th / last (highest split risk).**
