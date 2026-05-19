# CC Session V — 27+28+29-v2 grants family mega-batch

**Goal:** Extract all 3 grants v2 prompts (15 children, ~7,252 LOC) in
sequence. The three bands share the Grants tab and a strict load/extraction
order — extract together, in order.

**Source prompts (authoritative, do NOT edit):**
`modular-prompts/27-v2-grants-rank.md`, `modular-prompts/28-v2-grants-ai.md`,
`modular-prompts/29-v2-grants-email.md` — all verified **GREEN** in
`SESSION_P_AGGREGATE_REPORT.md` (5/5, 3/3, 7/7).

## Branch

Develop, commit, and push on **`claude/pre-author-extraction-prompts-kObuK`**
(the harness Git Development Branch Requirement). The task's nominal
`claude/session-v-grants-family` is **overridden** by the harness mandate —
same precedent as `SESSION_P_AGGREGATE_REPORT.md`. No push elsewhere without
explicit permission. No PR.

## Load order (CRITICAL — gate-locked)

```
1. 27-v2 grants-rank   (run AFTER off-limits grants/ranking.js — already shipped)
2. 28-v2 grants-ai     (run AFTER 27-v2 — shares Grants tab, grants-ui load anchor)
3. 29-v2 grants-email  (run AFTER 27-v2 + 28-v2)
```

**Why the order is locked:** 29-v2's band **absorbs prompt 28's stray email-UI
anchors** (`showNotifTab`, `syncFromStandardReportsTab`,
`updateEmailLocationVisibility`, `toggleGrantAlertOptions`,
`calculateGrantNextDelivery` — they live in the EMAIL NOTIFICATION SYSTEM band,
not the AI-app-gen band). 28-v2 must ship its AI-app-gen scope **first** so 29
cleanly owns those anchors. Per SESSION_P ordering (slots 5→6→8) and each v2's
"Ordering" footer. Script tags: LATE cluster, after
`<script src="modules/grants/ranking.js">` (V1) and after
`<script src="modules/grants/grants-ui.js">` (V2, V3).

## Pre-batch

```bash
cd <repo root>
git checkout main && git pull origin main
git checkout claude/pre-author-extraction-prompts-kObuK   # harness-mandated branch
cat SESSION_P_AGGREGATE_REPORT.md          # 27/28/29-v2 GREEN rows + live anchors
cat NEVER_RUN_PROMPTS_ANALYSIS.md          # per-child LOC rationale
cat modular-prompts/27-v2-grants-rank.md modular-prompts/28-v2-grants-ai.md modular-prompts/29-v2-grants-email.md
wc -l app/index.html                       # RECORD BASELINE
```

⚠️ **`grantState`@~22691 / `GRANT_SCORING_PROFILES`@~22745 STAY INLINE.** They
live in a *shared state-declaration cluster* (interleaved with `districtState`,
`mutcdState`, `selectionState`, `warrantsState` — all OTHER features), ~7,200
lines from the grant engine. CLAUDE.md mandates `grantState` stays inline. Do
**NOT** relocate them. In **27a only**, add
`window.grantState = grantState; window.GRANT_SCORING_PROFILES = GRANT_SCORING_PROFILES;`
adjacent to their inline declarations if not already mirrored. `CL.grants` root
already exists in `loader.js` (from off-limits `ranking.js` + `grants-ui.js`) —
no `loader.js` change needed for V.

⚠️ **Snapshot line numbers below are advisory only.** Every §0 is
name-anchored; re-derive every child boundary by brace read at run-time.
Session P live was 144,245; R+S+T + Day-2 tabs (incl. Session U) shift lines.
Do NOT trust the `@NNNNN` numbers.

## 15 children (5 + 3 + 7) — real v2 designs

Every shipped child MUST be ≤500 by brace read. Copy bytes **verbatim**.

### Phase V1 — 27-v2 grants-rank (engine block only, ~2,149 LOC)
| Step | Child | Module | ~LOC | Candidate band (advisory) | Anchor set |
|---|---|---|---|---|---|
| V1a | 27a | `grants/grants-rank-init.js` | ~135 | `initGrantModule`@~29879 → before `displayStateGrants`@~30011 | `initGrantModule`,`mergeGrantProgramsFromSupabase`,`initYearRangeFilter`,`applyGrantDateFilter`,`resetGrantDateFilter`,`applyYearRangeFilter`,`resetYearRange`,`showGrantTab`,`searchGrantsGovKeyword`,`openGrantsGovNewTab` + the `window.grantState`/`window.GRANT_SCORING_PROFILES` mirror note |
| V1b | 27b | `grants/grants-rank-display.js` | ~219 | `displayStateGrants`@~30011 → before `// ENHANCED GRANT MATCHING`@~30230 | `displayStateGrants`,`_renderGrantDeadline`,`renderGrantCard`,`applyGrantFilters`,`applyGrantFiltersToList`,`updateGrantFilterInfo`,`toggleFavorite`,`updateFavoritesCount`,`displayFavorites`,`updateGrantEPDOIndicator`,`updateGrantsTabForState`,`updateGrantAgencyFilter`,`updateGrantQuickLinks` |
| V1c | 27c | `grants/grants-rank-score.js` | ~470 | `// ENHANCED GRANT MATCHING`@~30230 → before main ranking fn @~31024 | crash-pattern analysis + enhanced-score helpers (`// Calculate enhanced grant score`@~30354 …) |
| V1d | 27d | `grants/grants-rank-engine.js` | ~473 | main ranking fn @~31024 → before `// UI Control Handlers`@~31497 | `// Main ranking function - async chunked` + progress-indicator helpers |
| V1e | 27e | `grants/grants-rank-controls.js` | ~330 | `// UI Control Handlers`@~31497 → `loadAadtCoverageBanner`@~31766 end + **2 grant listeners only** | `changeGrantMinCrashes`,`showScoringProfileHelp`,`openADTInputModal`,`saveADTData`,`openAadtImportModal`,`_parseAadtCsv`,`submitAadtImport`,`loadAadtCoverageBanner` + 2 grant event-listeners |

🔴 **27e TAIL-INTERLEAVE CAVEAT (verbatim from 27-v2 §0).** Between
`loadAadtCoverageBanner`@~31766 and the `// EMAIL NOTIFICATION SYSTEM` divider
there are 3 event-listeners:
```
~L31793         window.addEventListener('crashtab:hotspots:shown', loadAadtCoverageBanner)        ← GRANT, MOVE
~L31794–L31808  window.addEventListener('crashtab:dashboard:shown', …resize charts…)              ← DASHBOARD, LEAVE INLINE
~L31810–L31812  document.addEventListener('jurisdictionChanged', …loadAadtCoverageBanner…)        ← GRANT, MOVE
```
27e **MUST move only the 2 grant listeners and leave the dashboard-resize
listener inline.** Re-read L31790–L31814 before any §4 delete; the §4 step for
27e must explicitly confirm L31794–L31808 is NOT in the deleted range.

### Phase V2 — 28-v2 grants-ai (AI-app-gen band only, ~1,452 LOC)
| Step | Child | Module | ~LOC | Candidate band (advisory) | Anchor set |
|---|---|---|---|---|---|
| V2a | 28a | `grants/grants-ai-generate.js` | ~480 | `// AI-POWERED FULL APPLICATION GENERATION`@~35594 → first ≤500 brace cut after `generateFullApplicationContent`@~35594 | `generateFullApplicationContent` + its prompt/section builders |
| V2b | 28b | `grants/grants-ai-sections.js` | ~485 | 28a end → next ≤500 brace cut | mid-band narrative/section-assembly helpers (enumerate in §0) |
| V2c | 28c | `grants/grants-ai-export.js` | ~485 | 28b end → band END (`exportAppWord`@~37038 close) | tail helpers + `exportAppWord` (Word/PDF export of generated application) |

⚠️ **Only 2 pre-known anchors** (`generateFullApplicationContent`,
`exportAppWord`). The runner enumerates the rest from the §0 fn-enumeration
grep and fixes the two internal brace cuts so each child is ≤500. Band ends
cleanly at `// AI COUNTERMEASURE ASSISTANT`@~37044 — a separate CMF-AI feature;
**do NOT cross it.**

### Phase V3 — 29-v2 grants-email (EMAIL NOTIFICATION SYSTEM band, ~3,652 LOC) 🔴 LARGE / SUPERVISED
🔴 **7× ceiling, high split-risk. Treat like Session U:** run §0 + brace-read,
**PAUSE and surface §0 for human review BEFORE §4**, smoke after the band,
PAUSE between children.

| Step | Child | Module | ~LOC | Candidate band (advisory, by sub-header) | Contents |
|---|---|---|---|---|---|
| V3a | 29a | `grants/grants-email-state.js` | ~387 | `// EMAIL NOTIFICATION SYSTEM`@~31817 → before `// Get R2-compatible jurisdiction path`@~32201 | notification state mgmt, load notif prefs (Firestore), load email schedules (server) |
| V3b | 29b | `grants/grants-email-prefs.js` | ≤500 🔴 split | `// Get R2-compatible…`@~32201 → before `// MULTI-EMAIL INPUT MANAGEMENT`@~33339 | R2 path parts, `showNotifTab`,`syncFromStandardReportsTab`,`updateEmailLocationVisibility`,`toggleGrantAlertOptions`, schedule helpers, Coolify/Brevo toggle, time presets, delivery mode, `calculateGrantNextDelivery` (if >500: split before `// Toggle delivery mode`@~33297) |
| V3c | 29c | `grants/grants-email-chips.js` | ~257 | `// MULTI-EMAIL INPUT MANAGEMENT`@~33339 → before `// Save Email Notification Settings`@~33596 | temp email list, validate/add/remove/primary/clear chips, paste handler, chip toast |
| V3d | 29d | `grants/grants-email-settings.js` | ≤500 🔴 split | `// Save Email Notification Settings`@~33596 → before `// Generate grant summary email HTML`@~34217 | save settings, modal toast (if >500: split before `// Send test grant notification`@~34375) |
| V3e | 29e | `grants/grants-email-send.js` | ~349 | `// Generate grant summary email HTML`@~34217 → before `generateReportForEmail`@~34569 | summary-email HTML builder, send test email, notification history |
| V3f | 29f | `grants/grants-email-report.js` | ~248 | `generateReportForEmail`@~34569 → before `displayGrantLocations`@~34814 | `generateReportForEmail`,`buildEmailSubjectLine`,`buildEmailStatsSection`,`buildEmailFindings` |
| V3g | 29g | `grants/grants-email-locations.js` | ≤500 🔴 split | `displayGrantLocations`@~34814 → band END (`// CRASH COST VALUE PRESETS`@~35469) | `displayGrantLocations`,`goToGrantPage`,`updateTierLegend`,`toggleLocationSelection`,`toggleLocationCheckbox`,`toggleSelectAll`,`clearAllSelections`,`updateSelectionUI`,`getCombinedSelectionStats`,`buildEnrichedGrantContext`,`toggleSelectionAnalysis` + B/C cost-benefit tail (if >500: split before `buildEnrichedGrantContext`@~35095) |

⚠️ **External-caller re-check (29g):** `displayGrantLocations`,
`buildEnrichedGrantContext`, `toggleSelectionAnalysis` are
grant-location-table/selection helpers in the contiguous tail. Re-verify
external (non-email) callers by grep; if shared, window-mirror and keep, **but
they stay in the band (contiguous).** Band ends cleanly before
`// CRASH COST VALUE PRESETS` — **do NOT cross it.**

## Per-child loop (standard §0–§8)

Run V1a…V1e, then V2a…V2c, then V3a…V3g, strictly in order. For each child:

### §0 Pre-flight (per child)
Run the matching v2 prompt's §0 verbatim:
- **V1*** → `modular-prompts/27-v2-grants-rank.md` §0 (incl. the `grantState`/
  `GRANT_SCORING_PROFILES` "DO NOT MOVE" grep and the 27e tail-interleave
  comment block).
- **V2*** → `modular-prompts/28-v2-grants-ai.md` §0 (incl. the
  `awk '$1>=<start> && $1<=<end>'` fn-enumeration to fix the 3 ≤500 cuts).
- **V3*** → `modular-prompts/29-v2-grants-email.md` §0 (incl. the
  sub-header + fn enumeration to fix the 7 ≤500 cuts).
Common abort conditions: band not contiguous / target file exists /
off-limits-name collision / a slice splits a function. **For V3 (LARGE):
PAUSE and surface §0 for human review BEFORE §4.**

### §2 Skeleton (per child)
```js
/** CL grants.<rank|ai|email><X> — extracted (name-anchored) <run date>.
 *  see modular-prompts/2{7,8,9}-v2-grants-*.md. No behavior change.
 *  V1: reads inline shared grantState / GRANT_SCORING_PROFILES (window).
 *  V2/V3: depends on script order grants/grants-ui. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.grants=CL.grants||{};
  CL.grants.<rank|ai|email>=CL.grants.<rank|ai|email>||{};
  CL._registerModule('grants/grants-<rank|ai|email>-<child>');
})();
```
Dual public API: expose both `window.<fn>` AND `CL.grants.<area>.<fn>` for
every moved fn.

### §3 Script tags (LATE, in extraction order)
```html
<!-- after <script src="modules/grants/ranking.js"> -->
<script src="modules/grants/grants-rank-init.js"></script>
<script src="modules/grants/grants-rank-display.js"></script>
<script src="modules/grants/grants-rank-score.js"></script>
<script src="modules/grants/grants-rank-engine.js"></script>
<script src="modules/grants/grants-rank-controls.js"></script>
<!-- after <script src="modules/grants/grants-ui.js"> -->
<script src="modules/grants/grants-ai-generate.js"></script>
<script src="modules/grants/grants-ai-sections.js"></script>
<script src="modules/grants/grants-ai-export.js"></script>
<script src="modules/grants/grants-email-state.js"></script>
<script src="modules/grants/grants-email-prefs.js"></script>
<script src="modules/grants/grants-email-chips.js"></script>
<script src="modules/grants/grants-email-settings.js"></script>
<script src="modules/grants/grants-email-send.js"></script>
<script src="modules/grants/grants-email-report.js"></script>
<script src="modules/grants/grants-email-locations.js"></script>
```

### §4 Remove (per child)
```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
# 27e ONLY: also confirm the dashboard-resize listener L31794–L31808 is NOT in
#   the deleted range (it stays inline). Re-read L31790–L31814 first.
```

### §5 Post-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
node --check app/modules/grants/grants-<area>-<child>.js
grep -nE 'function +(<this child anchors>)\b' app/index.html         # expect 0
grep -nE '^const +grantState\b' app/index.html                       # V1: STILL 1 (not moved)
grep -c '<script src="modules/grants/grants-<area>-<child>.js"></script>' app/index.html  # 1
git diff --stat   # ONLY app/index.html + the one new module
```
Console must show `[CL] Module loaded: grants/grants-<area>-<child>`.

### §7 Rollback (per child)
```bash
git checkout -- app/index.html && rm app/modules/grants/grants-<area>-<child>.js
```

### §8 Out of scope
Moving `grantState`/`GRANT_SCORING_PROFILES` (inline, window-mirror only); the
dashboard-resize listener; `// AI COUNTERMEASURE ASSISTANT` band; `// CRASH
COST VALUE PRESETS` band; `grants/ranking.js` + `grants/grants-ui.js`
(off-limits); renames; reformatting; PR. No behavior changes.

## Per-phase commits (4 total)

- **Commit 1 — V1**: after V1a–V1e ship green (one commit covering the 5
  grants-rank modules, or 5 per-child commits then a phase tag — keep
  consistent with the per-child discipline; minimum = one commit at end of
  V1). Message: `Session V Phase 1: extract 27-v2 grants-rank (5 children)`.
- **Commit 2 — V2**: after V2a–V2c. `Session V Phase 2: extract 28-v2
  grants-ai (3 children)`.
- **Commit 3 — V3**: after V3a–V3g. `Session V Phase 3: extract 29-v2
  grants-email (7 children)`.
- **Commit 4 — CLAUDE.md**: append the 15 new grants modules to the
  off-limits list. `Session V: append grants family to off-limits list`.

Push each to `claude/pre-author-extraction-prompts-kObuK` with
`git push -u origin claude/pre-author-extraction-prompts-kObuK` (retry on
network error: exponential backoff 2s/4s/8s/16s). No PR.

## Single smoke at end (after all 15 children)

```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot
playwright-cli console            # must show NO new errors
# Grants tab:
#   - all 3 sub-areas render (Rank / AI / Email)
#   - run ranking → progress indicator → ranked locations (V1)
#   - select location(s) → "Generate full application" → AI narrative renders;
#     export to Word/PDF (V2)
#   - Email notification modal: tabs toggle, prefs load, multi-email chips
#     add/remove/primary, save settings, send test email, notification
#     history, report-for-email generates, grant-location table + select +
#     combined stats + selection analysis (V3)
playwright-cli screenshot --filename=grants-after.png
playwright-cli close
```
`typeof window.initGrantModule === 'function'` &&
`typeof window.generateFullApplicationContent === 'function'` &&
`typeof window.showNotifTab === 'function'` &&
`typeof window.generateReportForEmail === 'function'`. If deployed Pages is
behind this branch, state so explicitly rather than skipping.

## Expected end state

- `app/index.html`: `<baseline>` → `<baseline> − ~7,252` lines.
- 15 new modules under `app/modules/grants/`:
  `grants-rank-{init,display,score,engine,controls}.js`,
  `grants-ai-{generate,sections,export}.js`,
  `grants-email-{state,prefs,chips,settings,send,report,locations}.js`,
  each ≤500, each `node --check` clean, each registered.
- `CL.grants` namespace expanded (`.rank`, `.ai`, `.email`); no `loader.js`
  change (`CL.grants` root already exists).
- `grantState` / `GRANT_SCORING_PROFILES` still inline & singular (V1
  window-mirror only).
- CLAUDE.md off-limits list appended with the 15 grants modules.
- Zero behavior change (Grants tab works identically).

## Final report

```
CC Session V complete (27+28+29-v2 grants family).
- app/index.html: <baseline> → <new> (−<delta>, target ~7,252)
- 15 new grants/* modules (5 rank + 3 ai + 7 email), all ≤500, registered
- grantState / GRANT_SCORING_PROFILES untouched (window-mirror only)
- 27e: dashboard-resize listener left inline (verified)
- CL.grants expanded (.rank/.ai/.email); loader.js unchanged
- Smoke: Grants tab green (rank/AI/email), playwright-cli console clean
- Branch: claude/pre-author-extraction-prompts-kObuK (pushed; no PR)
```
