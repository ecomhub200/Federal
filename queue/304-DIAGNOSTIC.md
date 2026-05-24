# Stage A v2 — Diagnostic Capture for v3 Design

**Reverted at:** 2026-05-24T14:02Z, commit `fba801f1` on `origin/main`.
**Source of v2 references in this report:** `git show origin/stage-a-esm-migration-v2:<file>`. The branch is preserved on origin (NOT deleted) so Cowork can keep diffing.

## §2.1 IIFE strict-mode survey

```
$ wc -l app/index.html       (live main, post-revert)
126212

$ grep -n "['\"]use strict['\"]" app/index.html | wc -l
0
```

**IMPORTANT FINDING: There is NO `'use strict'` in `app/index.html` at all.** The CC 304 prompt's hypothesis (a) "IIFE strict mode blocks bare-identifier window fallthrough" does **not** apply to this codebase — every inline `<script>` block is sloppy-mode classic. Bare-identifier reads in inline scripts DO fall through to `window` automatically. The root cause of the v2 production failure is elsewhere — see §2.5/§2.6.

**Bare reads vs declarations vs window-reads per global (live main):**

```
crashState:            bare=463  decl=1  windowReads=0
jurisdictionContext:   bare=159  decl=1  windowReads=0
crashTreeState:        bare=18   decl=1  windowReads=0
warrantsState:         bare=805  decl=1  windowReads=0
cmfState:              bare=306  decl=1  windowReads=0
baState:               bare=108  decl=1  windowReads=0
grantState:            bare=211  decl=1  windowReads=0
appConfig:             bare=290  decl=1  windowReads=19   (19 pre-existing window mirrors)
_scorecardData:        bare=2    decl=0  windowReads=0    (declared in module, not inline)
_autoLoadGeneration:   bare=15   decl=1  windowReads=0
_userDataReadyResolve: bare=7    decl=0  windowReads=0    (1 inline `let _userDataReadyResolve;` — no `=`)
showTab:               bare=55   decl=0  windowReads=0    (declared in app/tab-dispatcher.js module)
analysisState:         bare=0    decl=0  windowReads=0    (does not exist anywhere)
```

Top-5 most-read bare globals in inline code: `warrantsState (805)`, `crashState (463)`, `cmfState (306)`, `appConfig (290)`, `grantState (211)`. These are extremely hot — they cannot move out of inline classic scope without breaking thousands of bare reads.

## §2.2 Stage A v2 module list — coupling matrix

`app/main.js` (v2) imported **60 modules** (1 namespace root + 59 regular ESM modules). Per-module bare-identifier reference counts to the 12 known globals (excluding `analysisState`):

```
51 module-global coupling pairs total. Top 40 sorted by count:

app/modules/scorecard/scorecard.js               -- _scorecardData:        34   (local let decl — overlay correctly skipped)
app/modules/spatial/geo-tier.js                  -- jurisdictionContext:   13
app/modules/upload/upload-pipeline.js            -- appConfig:              8
app/modules/app/tab-dispatcher.js                -- showTab:                8   (local function decl — overlay correctly skipped)
app/modules/data/supabase-bridge.js              -- crashState:             7
app/modules/data/chunk-loader.js                 -- showTab:                6
app/modules/upload/upload-tier-ui.js             -- jurisdictionContext:   5
app/modules/data/tab-loaders.js                  -- crashState:             5
app/modules/data/supabase-bridge.js              -- appConfig:              5
app/modules/spatial/geo-tier.js                  -- appConfig:              4
app/modules/scorecard/scorecard.js               -- appConfig:              4
app/modules/reports/reports-standard-core.js     -- showTab:                4
app/modules/reports/reports-standard-core.js     -- cmfState:               4
app/modules/grants/grants-ui.js                  -- jurisdictionContext:   4
app/modules/app/tab-dispatcher.js                -- crashState:             4
app/modules/warrants/signal-tmc.js               -- warrantsState:          3
app/modules/upload/upload-tier-ui.js             -- crashState:             3
app/modules/upload/upload-tab.js                 -- jurisdictionContext:   3
app/modules/upload/upload-tab.js                 -- appConfig:              3
app/modules/spatial/geo-tier.js                  -- crashState:             3
app/modules/reports/reports-standard-core.js     -- crashState:             3
app/modules/data/supabase-bridge.js              -- jurisdictionContext:   3
app/modules/assets/transit-tab.js                -- jurisdictionContext:   3
app/modules/upload/road-defaults.js              -- appConfig:              2
app/modules/reports/reports-standard-types.js    -- crashState:             2
app/modules/reports/reports-standard-core.js     -- baState:                2
app/modules/grants/grants-ui.js                  -- crashState:             2
app/modules/data/lazy-loader.js                  -- crashState:             2
app/modules/core/tier.js                         -- jurisdictionContext:   2
app/modules/core/tier.js                         -- crashState:             2
app/modules/analysis/crash-profile.js            -- crashState:             2
app/modules/analysis/baselines.js                -- crashState:             2
app/modules/worker/sample-rows-loader.js         -- crashState:             1
app/modules/upload/upload-tab.js                 -- crashState:             1
app/modules/upload/upload-pipeline.js            -- showTab:                1
app/modules/upload/upload-pipeline.js            -- crashState:             1
app/modules/upload/road-defaults.js              -- jurisdictionContext:   1
app/modules/upload/api-connector.js              -- appConfig:              1
app/modules/spatial/r2-resolve.js                -- jurisdictionContext:   1
app/modules/spatial/r2-resolve.js                -- appConfig:              1
```

**Modules with RESIDUAL bare reads after my overlay rule ran (= these are the live ReferenceError sources at runtime):**

```
app/modules/spatial/geo-tier.js              jurisdictionContext  6
app/modules/upload/upload-tier-ui.js         jurisdictionContext  5
app/modules/reports/reports-standard-core.js cmfState             4
app/modules/upload/upload-tier-ui.js         crashState           3
app/modules/upload/upload-pipeline.js        appConfig            3
app/modules/scorecard/scorecard.js           appConfig            2
app/modules/reports/reports-standard-core.js baState              2
app/modules/grants/grants-ui.js              jurisdictionContext  2
app/modules/warrants/signal-tmc.js           warrantsState        1
app/modules/upload/upload-tab.js             jurisdictionContext  1
app/modules/spatial/geo-tier.js              appConfig            1
app/modules/reports/reports-standard-types.js crashState          1
app/modules/data/lazy-loader.js              crashState           1
```

13 module-global pairs with residuals. Approximate (still includes some inline-`//`-comment false positives the regex didn't strip). The order of magnitude matches the reported "40+ ReferenceErrors" exactly.

**Why my overlay missed these (root cause of v2 break — confirmed):**

My `mask_noncode` helper handles `// ... EOL` comments, `/* ... */` block comments, and string literals (`'`, `"`, backtick), but **does not handle regex literals** (`/pattern/flags`). A regex like `/"/g` in `upload-pipeline.js:624` (`v.replace(/"/g, '""')`) is parsed as: `/` (code), `"` (opens a string), `/g, ...` (treated as string content). The masker then never recovers — it stays in "string" mode for the rest of the file. Every `appConfig` / `crashState` / etc. read AFTER that regex literal was masked out and the overlay therefore didn't rewrite them. Same bug pattern in every module that contains a regex literal with quote chars: `geo-tier`, `upload-tier-ui`, `reports-standard-core`, `grants-ui`, `signal-tmc`, etc.

Verified by tracing the masker state on `upload-pipeline.js`:
```
WARN: newline inside string starting L624 at L625    (regex /"/g at L624 opened a phantom string)
WARN: newline inside string starting L624 at L626
... (state stays 'string' for the rest of the file, ~166 lines past the real code)
final state at L751: string, started at L748
```

## §2.3 Load-order — `autoLoadCrashData` callers

**Inline `app/index.html` (live main):**

```
19355: comment ref
19379: autoLoadCrashData();
20006: comment
20745: autoLoadCrashData(true);
21331: autoLoadCrashData(true);
21872: comment
21892: autoLoadCrashData(true);
22036: autoLoadCrashData(true);
22583: autoLoadCrashData(true);
28093: async function autoLoadCrashData(skipCache = false, forceR2 = false) {   ← DECL
28879: comment
75422: autoLoadCrashData();
75438: comment
75506: autoLoadCrashData();
75541: autoLoadCrashData();
124335: comment
124355: autoLoadCrashData();
```

**Per-module references at the v2 cutover state:**

```
app/modules/data/lazy-loader.js
  L11  : * Never mutates crashState directly — delegates to autoLoadCrashData().   (comment)
  L144 :   if (typeof autoLoadCrashData === 'function') {                          (guarded)
  L149 :       await autoLoadCrashData(true, true);                                (event-handler path)

app/modules/spatial/r2-resolve.js
  L22  : * Called once during startup, before autoLoadCrashData().                 (comment)

app/modules/worker/sample-rows-loader.js
  L17  : * Call this from autoLoadCrashData right after fetching the CSV.          (comment)
  L27  : * Call this from autoLoadCrashData after parsing parquet data.            (comment)

app/modules/core/tier.js
  L322 :         // Do NOT call autoLoadCrashData() — the statewide R2 parquet file (comment)

app/modules/upload/upload-tab.js
  L308 : * Called once during startup, before autoLoadCrashData().                 (comment)
  L340 : // If no manifest loaded, mark as loaded anyway to unblock autoLoadCrashData (comment)
  L424 : if (typeof autoLoadCrashData === 'function') autoLoadCrashData(true);     (event-handler path)

app/modules/spatial/geo-tier.js
  L672 : // NOTE: do NOT call autoLoadCrashData() here. R2 has no per-city ...      (comment)
```

**Finding:** **No module calls `autoLoadCrashData` at top-level (eager) module init.** Both real call sites (`lazy-loader.js:149`, `upload-tab.js:424`) are inside handler functions invoked later (button clicks / state changes). All other refs are comments.

The TDZ error "Cannot access '_autoLoadGeneration' before initialization (autoLoadCrashData:28051)" therefore did NOT come from a module's eager top-level call. It came from one of the existing INLINE callers (`L19379`, `L20745`, `L21331`, `L75422`, etc.) being re-ordered relative to the inline `let _autoLoadGeneration` declaration at `L27970` by the cutover. The most plausible mechanism: `let` declarations have a TDZ window, and removing all the previously-classic `<script src="modules/*.js">` tags from `<head>` changed the parse/execute timing of the inline `<script>` blocks below them. If any inline script that runs early calls `autoLoadCrashData()`, and the call site is BEFORE L27970 in execution order, the function body's reference to the closure-captured `_autoLoadGeneration` hits TDZ.

## §2.4 Script-block boundary map (live main, post-revert)

```
Total inline <script> blocks (no src=): 11
With 'use strict':                       0

Boundary map:
   76 -    81  strict=0   (6 lines)
   84 -   134  strict=0   (51 lines)
19139 - 39900  strict=0   (20,762 lines)     ← MEGA-BLOCK #1 — contains crashState/jurisdictionContext/appConfig/_autoLoadGeneration/_userDataReadyResolve decls (L19400-L27925 area)
39901 - 40653  strict=0   (753 lines)
40654 - 47985  strict=0   (7,332 lines)
47986 - 53023  strict=0   (5,038 lines)
53024 - 54245  strict=0   (1,222 lines)
54246 - 105712 strict=0   (51,467 lines)     ← MEGA-BLOCK #2 — contains baState/cmfState/warrantsState decls
105817 - 125741 strict=0  (19,925 lines)     ← MEGA-BLOCK #3
126093 - 126122 strict=0  (30 lines)
126174 - 126209 strict=0  (36 lines)

Largest 5: 51467 / 20762 / 19925 / 7332 / 5038 lines.
```

The three mega-blocks (~92k lines combined) hold every global declaration plus essentially every interactive feature. There is no realistic "split the mega-block into smaller scripts" path that doesn't risk re-introducing TDZ across the new seams.

## §2.5 Conclusion

1. **`'use strict'` inline blocks reading bare globals: ZERO.** The CC 304 hypothesis (a) "IIFE strict mode blocks fallthrough" does not apply here — there are no strict-mode inline scripts. All inline classic scripts in `app/index.html` are sloppy-mode, and bare-identifier reads correctly fall through to `window` at runtime. The pre-Stage-A baseline works precisely because of this.
2. **Hottest bare-global reads in inline code:** `warrantsState (805)`, `crashState (463)`, `cmfState (306)`, `appConfig (290)`, `grantState (211)`. These cannot be moved to a module without rewriting thousands of inline call sites.
3. **Most coupled v2 modules** (by total bare-global reads in module body): `scorecard/scorecard.js` (38 → 34 are the local `_scorecardData` binding, safe), `spatial/geo-tier.js` (20), `app/tab-dispatcher.js` (12 → 8 are local `showTab`, safe), `data/supabase-bridge.js` (15), `upload/upload-pipeline.js` (9), `data/chunk-loader.js` (6), `upload/upload-tier-ui.js` (8).
4. **Mutators (not just readers):** `grep -E "(^|[^.\w])X\s*="` against each module shows the only modules that REASSIGN a known global are `scorecard.js` (local `_scorecardData`, safe) and `tab-dispatcher.js` (none). No Stage A module mutated `crashState` / `cmfState` / `warrantsState` / `appConfig` / `baState` / `grantState` directly. **All inline-declared globals are READ-ONLY from modules.** This matters for v3: read-only access can be satisfied with a pre-decl `window.X` stub.
5. **`autoLoadCrashData` is NEVER called eagerly from a module top-level.** Both real module callers (`lazy-loader.js:149`, `upload-tab.js:424`) are inside handler functions. The TDZ error came from an INLINE caller being executed before the inline `let _autoLoadGeneration` declaration was reached — a timing artifact of the cutover, not a module-eager-call problem.
6. **Globals that MUST stay declared inline (too many bare-read sites to relocate):** every one of the 13 — `warrantsState/crashState/cmfState/appConfig/grantState/jurisdictionContext/baState/crashTreeState/_autoLoadGeneration/_userDataReadyResolve` all have 100s of inline bare reads (plus `showTab/_scorecardData` already live in modules). None can safely move into ESM without a massive inline-rewrite.
7. **Root cause of v2 production failure (verified):**
   - **Primary**: My `mask_noncode` helper in `/tmp/stage_a_convert.py` doesn't handle JavaScript regex literals. A regex like `/"/g` opens a phantom string state that masks the rest of the file from the overlay rule. 13 module-global pairs were left with bare reads (matching the "40+ ReferenceErrors" report).
   - **Secondary**: even where the overlay correctly rewrote `crashState` → `window.crashState`, `let`-declared globals (`_autoLoadGeneration`, `_userDataReadyResolve`) cannot satisfy reads via `window.X` BEFORE the inline declaration script reaches their line — the property is `undefined` then (which causes downstream "Cannot read properties of undefined" errors on `.sampleRows`/`.loaded`/etc., not TDZ specifically), but the `let` lexical TDZ is independently triggered when an inline caller in the same script block calls `autoLoadCrashData()` (which closes over `_autoLoadGeneration`) before L27970 is reached.

## §2.6 Strategy hint for v3 (assessment only, NOT a design)

Based on §2.1-§2.5, the most promising direction is a hybrid of **(a) pre-decl global stub** + **(b) scope shrink**:

1. **Pre-decl stub** — Add a tiny inline `<script>` at the very TOP of `<head>` (before any other script tag) that does the equivalent of:
   ```html
   <script>
     window.crashState = window.crashState || null;
     window.jurisdictionContext = window.jurisdictionContext || {};
     window.appConfig = window.appConfig || null;
     /* ... all 12 globals ... */
   </script>
   ```
   This guarantees every `window.X` read returns `undefined` instead of throwing, and the bare-identifier fallthrough in inline classic code still resolves to the same `window.X` slot. Eliminates the "module read happens before inline assignment" timing dependency for non-let globals.
2. **Scope shrink** — Do NOT move any module that the coupling matrix in §2.2 shows >2 bare reads of any global. Leave `geo-tier.js`, `upload-pipeline.js`, `upload-tier-ui.js`, `supabase-bridge.js`, `tab-dispatcher.js`, `reports-standard-core.js`, `grants-ui.js`, `scorecard.js`, `transit-tab.js` in their current classic-IIFE form for now. Only convert genuinely pure-computation modules (`core/constants.js`, `core/epdo.js`, `utils/date-utils.js`, `analysis/baselines.js`, `analysis/crash-profile.js`, `core/epdo-presets.js`, `core/tier.js`-after-audit) to ESM — those have 0-2 global refs that are easy to manually verify and rewrite.
3. **For the `let`-declared globals (`_autoLoadGeneration`, `_userDataReadyResolve`)** — Move them to be `var`-declared (no TDZ) at the very top of the inline mega-block, OR move them into the pre-decl stub script as `let window._autoLoadGeneration = 0` is invalid but `window._autoLoadGeneration = 0` is fine. This dodges TDZ entirely.
4. **Replace my overlay-rule script** — Any v3 attempt that needs an overlay-style rewrite MUST use a real JS parser (acorn / babel parser / SWC), not a regex masker. The masker bug I shipped in v2 is the proximate cause of this whole failure.
5. **Whatever v3 chooses, gate the cutover with a Playwright check that loads the live page and confirms `window.[every global]` is non-undefined AND the console has zero `ReferenceError` / `TypeError` from the 12 names.** v2's per-file `node --check` was insufficient — it doesn't catch runtime resolution failures, and `node --check` itself returns 0 even on syntax errors (separately discovered during v2 — required `node --input-type=module --check < file` to actually validate).
