# CC Modular Extraction Prompt 15-v2 — `app/modules/dashboard/dashboard-tab*.js` (4-CHILD RE-SPLIT)

**Supersedes `modular-prompts/15-dashboard-dashboard-tab.md`** (stale snapshot
L48699–L51326 / "~2628 lines"; live `updateDashboard`@41954). Byte-unmodified —
see `modular-prompts/SUPERSEDED.md`. Re-anchored 2026-05-17 (CC Session N)
against live `app/index.html` @ **145,624 lines**. Analysis:
`NEVER_RUN_PROMPTS_ANALYSIS.md`.

**Severity:** Refactor (no behavior change). **One CHILD per session.**
**FOUR-MODULE re-split** (15a→15b→15c→15d), one session each, in order.

Read `CLAUDE.md` "Modular Extraction Refactor" first. Names are anchors; line
numbers are live 2026-05-17 and **will drift** — re-derive by brace read in §0.
Full band ≈ **1,871 LOC** (4× the 500 ceiling) → mandatory MODULAR_PLAN §2
sub-split; never one file.

## §0 Pre-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
# Full band: updateDashboard@~41954 … line before  // ============ /
#            // DASHBOARD SEARCH FUNCTIONS  (~L43825). DASHBOARD SEARCH is a
#            SEPARATE sub-feature — it is NOT in scope here.
grep -nE '^function updateDashboard\b' app/index.html                       # band START
grep -nE '^// DASHBOARD SEARCH FUNCTIONS' app/index.html                    # band END = divider line above this
grep -nE '^(async )?function +(updateDashboard|updateCharts|buildTierComparison|hydrateComparisonsFromMatview|handleComparisonDrillDown|paintDashboardChartsFromMatview|updateDashboardTierSections|isMultiCountyTier)\b' app/index.html
# Brace-read THIS child's first+last anchor → exact [BLK_START,BLK_END] ≤500.
test -f app/modules/dashboard/dashboard-tab-<child>.js && echo ABORT || echo OK
grep -n '<script src="modules/data/supabase-map-bridge.js"></script>' app/index.html  # LATE-cluster load anchor, expect 1
```
ABORT if band not contiguous / target exists / anchor missing / any name
off-limits / slice would split a function.

## §1 What to move — 4 children (re-derive exact ≤500 ranges by brace read)
| Order | Child | Candidate band (live) | ~LOC | Anchor set |
|---|---|---|---|---|
| 15a | `dashboard/dashboard-tab-kpi.js` | `updateDashboard`@41954 → before `buildTierComparison`@42455 | ~501 | `updateDashboard`,`updateCharts`,`buildCustomLegend` (if >500: split before `updateCharts`@42335) |
| 15b | `dashboard/dashboard-tab-comparison.js` | `buildTierComparison`@42455 → before `hydrateComparisonsFromMatview`@42999 | ~544 | `build{Tier,Region,MPO}Comparison`,`getComparisonRowColor`,`buildComparison{Sparkline,Trend}`,`renderComparison{Rows,Footer}`,`sortComparisonTable`,`render{Region,MPO,County}ComparisonTable` (if >500: split before `renderComparisonRows`@42689) |
| 15c | `dashboard/dashboard-tab-drill.js` | `hydrateComparisonsFromMatview`@42999 → before `paintDashboardChartsFromMatview`@43346 | ~347 | `hydrateComparisonsFromMatview`,`exportComparisonCSV`,`handleComparisonDrillDown`,`navigateBreadcrumbTier`,`updateTierBreadcrumb`,`updateTierScopeHeader`,`paintWhenVisible` |
| 15d | `dashboard/dashboard-tab-matview.js` | `paintDashboardChartsFromMatview`@43346 → band END (~L43824) | ~478 | `paintDashboardChartsFromMatview`,`updateDashboardTierSections`,`isMultiCountyTier` + trailing helpers |

Copy bytes **verbatim**. New `CL.dashboard` root → add ONLY that key to
`loader.js` if absent.

## §2 Skeleton (per child)
```js
/** CL dashboard.tab<X> — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/15-v2-dashboard-tab.md. No behavior change. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.dashboard=CL.dashboard||{};
  CL.dashboard.tab=CL.dashboard.tab||{};
  // window.<fn>=<fn>; CL.dashboard.tab.<fn>=<fn>;  (onclick/hoist back-compat)
  CL._registerModule('dashboard/dashboard-tab-<child>');
})();
```

## §3 Script tags (LATE cluster, in order, after `data/supabase-map-bridge.js`)
```html
<script src="modules/dashboard/dashboard-tab-kpi.js"></script>
<script src="modules/dashboard/dashboard-tab-comparison.js"></script>
<script src="modules/dashboard/dashboard-tab-drill.js"></script>
<script src="modules/dashboard/dashboard-tab-matview.js"></script>
```

## §4 Remove (per child)
```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
# confirm, then delete the exact line range.
```

## §5 Post-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
node --check app/modules/dashboard/dashboard-tab-<child>.js
grep -nE 'function +(<this child's anchors>)\b' app/index.html        # 0
grep -c '<script src="modules/dashboard/dashboard-tab-<child>.js"></script>' app/index.html  # 1
git diff --stat   # ONLY app/index.html + new module
```
Console: `[CL] Module loaded: dashboard/dashboard-tab-<child>`.

## §6 Smoke (after last child)
`playwright-cli open https://ecomhub200.github.io/Federal/app/` → snapshot →
console (no new errors). Pick state+jurisdiction; Dashboard tab paints KPIs,
tier/region/MPO comparison tables render + sort + drill-down + breadcrumb;
matview charts paint. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/dashboard/dashboard-tab-<child>.js`

## §8 Out of scope
DASHBOARD SEARCH FUNCTIONS band (separate); renames/reformat; other/off-limits
modules; shared-global relocation (window-mirror only); CLAUDE.md; PR.

---
### Ordering
15a→15b→15c→15d. No external gate. Session O slot: 3rd (after 16-v2, 17-v2).
