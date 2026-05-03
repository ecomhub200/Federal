# CC Fix — Safety Scorecard: relocate, dedupe, state-agnostic, drill-down

**Diagnostic results (locked in 2026-05-03 from live `scorecard_rankings` matview):**

| State | 2023 rows | Sum(total_crashes) | Duplicates |
|---|---:|---:|---|
| delaware | 90 | 372,695 | Kent×6, New Castle×4, Sussex×3, Milford×2, Smyrna×2 |
| colorado | 0 | 0 | — (no data) |
| virginia | 0 | 0 | — (no data) |

**Schema (47 columns, NO tier discriminator exists):**
```
state, jurisdiction, dot_district, planning_district, mpo_name, crash_year,
total_crashes, fatal_crashes, ksi_crashes, total_epdo, total_injured, total_killed,
ped_crashes, bike_crashes, motorcycle_crashes, ped_killed, ped_injured,
senior_crashes, young_crashes, impaired_crashes, speed_crashes, distracted_crashes,
unrestrained_crashes, night_crashes, workzone_crashes, school_zone_crashes,
intersection_crashes, road_departure_crashes,
near_school_crashes, near_bridge_crashes, near_rail_crashes, near_transit_crashes,
fatality_rate, ksi_rate, ped_rate, night_rate, impaired_rate, speed_rate,
rank_total_crashes, rank_fatal, rank_ksi, rank_epdo, rank_ped, rank_bike,
rank_impaired, rank_speed, rank_night
```

**Critical finding:** The matview emits one row per `(state × jurisdiction × dot_district × planning_district × mpo_name × year)` combination. Kent appears 6× in 2023 because each parent-MPO/PD/region combination produces another row with the same Kent crashes. Sum across all 90 rows = 372,695 — about 10× what one year should be (DE total all-years is 569,829, so 2023 alone ≈ 38K).

**There is NO `tier` / `jurisdiction_type` / `juris_type` / `place_type` / `lsad` / `funcstat` column.** Frontend can't render a tier badge. We have to dedupe instead.

---

## Files you may modify

- `app/index.html` — Fix 1 (sidebar reorder), Fix 2 (dedupe), Fix 3 (state-agnostic), Fix 4 (auto-refresh), Fix 5 (drill-down), Fix 6 (tier-inferred sub-tabs)
- `assets/js/data-client.js` — Fix 2 only, dedupe inside `getScorecard`

## Files you must NOT modify

- `app/modules/data/road-type-mapping.js`
- `app/modules/data/supabase-bridge.js`
- The matview SQL itself (this fix is client-side only — the matview rebuild is a separate backend ticket, see Appendix)
- `tests/oracle-captured-2026-05-03.{md,json}`
- Any other state's hierarchy.json

---

## Fix 1 — Move "Safety Scorecard" nav item BELOW Crash Tree

**Where:** `app/index.html`, lines 4667–4674 (Crash Tree) and 4789–4797 (current standalone Safety Scorecard).

**1a — Delete the standalone block at 4789–4797 (the entire `<!-- Safety Scorecard - Standalone item -->` block, 9 lines).**

**1b — Insert as `<li>` between line 4674 (end of Crash Tree `</li>`) and line 4675 (start of Safety Focus `<li>`):**

```html
<li class="sidebar-nav-item" data-tab="scorecard" data-tooltip="Safety Scorecard" onclick="navigateTo('scorecard')">
<span class="icon">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/>
</svg>
</span>
<span class="nav-label">Safety Scorecard</span>
</li>
```

Change `<div class="sidebar-standalone-item">` to `<li class="sidebar-nav-item">` because EXPLORE uses `<ul>`.

**Acceptance.** EXPLORE order: Dashboard → Map → Crash Tree → **Safety Scorecard** → Safety Focus → Fatal & Speeding → Hot Spots → Intersections → Ped/Bike → Analysis → Crash Prediction → Deep Dive. Bottom of sidebar: NO Safety Scorecard.

---

## Fix 2 — Dedupe the matview's aggregation-level multiplication

**Symptom:** Kent appears 6 times in 2023 because the matview emits one row per `(jurisdiction × dot_district × planning_district × mpo_name × year)` combination. The frontend has to dedupe.

**Strategy: keep one row per (state, jurisdiction, crash_year) — the row with the LARGEST `total_crashes`.**

This works because the over-aggregated row (the one without parent filters in any rollup direction) is the most inclusive — its `total_crashes` is the sum of all the disaggregated rows. Picking the max gives us the canonical row.

**Where:** `assets/js/data-client.js` lines 566–594, in `getScorecard`. Add deduplication AFTER the Supabase query returns and BEFORE the function returns.

Find the body of `getScorecard`:
```js
        const data = await this._supabaseQuery('scorecard_rankings', {
          filters: filters,
          order: 'rank_total_crashes.asc',
          limit: 5000,
        });
        this._source = 'supabase';
        return data;
```

Replace with:
```js
        const data = await this._supabaseQuery('scorecard_rankings', {
          filters: filters,
          order: 'rank_total_crashes.asc',
          limit: 5000,
        });
        this._source = 'supabase';
        // Dedupe: the matview emits one row per (state × jurisdiction × dot_district
        // × planning_district × mpo_name × year). Kent shows up 6× in DE 2023, etc.
        // Keep the row with the largest total_crashes per (jurisdiction, year) — that's
        // the most-aggregated (parent-NULL) row, which represents the canonical totals.
        // State-agnostic: works for any state's partition.
        const dedupKey = (r) => `${r.jurisdiction}|${r.crash_year}`;
        const map = new Map();
        (data || []).forEach(r => {
          const k = dedupKey(r);
          const existing = map.get(k);
          if (!existing || (Number(r.total_crashes) || 0) > (Number(existing.total_crashes) || 0)) {
            map.set(k, r);
          }
        });
        const deduped = [...map.values()];
        // Re-rank after dedupe so rank_* columns reflect the canonical row order.
        const _resortByMetric = (key, rankKey) => {
          const sorted = deduped.slice().sort((a, b) => (Number(b[key]) || 0) - (Number(a[key]) || 0));
          sorted.forEach((r, i) => { r[rankKey] = i + 1; });
        };
        _resortByMetric('total_crashes',    'rank_total_crashes');
        _resortByMetric('fatal_crashes',    'rank_fatal');
        _resortByMetric('ksi_crashes',      'rank_ksi');
        _resortByMetric('total_epdo',       'rank_epdo');
        _resortByMetric('ped_crashes',      'rank_ped');
        _resortByMetric('bike_crashes',     'rank_bike');
        _resortByMetric('impaired_crashes', 'rank_impaired');
        _resortByMetric('speed_crashes',    'rank_speed');
        _resortByMetric('night_crashes',    'rank_night');
        console.log(`[Scorecard] Deduped ${data.length} rows → ${deduped.length} unique jurisdictions for ${state}/${year}`);
        return deduped;
```

**Acceptance for Fix 2.** After the patch, in DevTools console:
```js
(await window.crashLensClient.getScorecard('delaware', 2023, {})).length
```
Should return roughly **60** (3 counties + ~57 unique cities — Delaware's actual jurisdiction count) instead of **90**. The console shows `[Scorecard] Deduped 90 rows → ~60 unique jurisdictions for delaware/2023`. No more Kent×6 / Sussex×3 / etc. in the rendered table.

---

## Fix 3 — State-agnostic query path (works for all 50 states automatically)

**Where:** `app/index.html` lines 155116–155173 (`loadScorecardData`).

**Hoist state resolution to the top of the function.** Insert AFTER line 155123 (after `if (statusEl) statusEl.textContent = 'Loading…';`):
```js
  const stateKey = (typeof _resolveActiveState === 'function')
    ? _resolveActiveState()
    : (window.crashLensClient && window.crashLensClient.state) || null;
  if (!stateKey) {
    if (statusEl) statusEl.textContent = 'No state selected — pick a state in Upload Data first.';
    return;
  }
```

Replace all three `client.getScorecard(null, ...)` calls with `client.getScorecard(stateKey, ...)`:
- Line 155149 (rolling): `data = await client.getScorecard(null, year - 2, opts);` → `data = await client.getScorecard(stateKey, year - 2, opts);`
- Line 155153 (single):  `data = await client.getScorecard(null, year, opts);`     → `data = await client.getScorecard(stateKey, year, opts);`
- Line 155161 (compare): `const compareData = await client.getScorecard(null, compareYear, opts2);` → `const compareData = await client.getScorecard(stateKey, compareYear, opts2);`

**Add empty-state UI when matview has no data for the active state.** Replace the `_scorecardData = data || [];` line (around line 155156) with:
```js
    _scorecardData = data || [];
    if (_scorecardData.length === 0) {
      const tbody = document.getElementById('scorecardBody');
      const thead = document.getElementById('scorecardHead');
      if (thead) thead.innerHTML = '<tr><th colspan="99" style="text-align:left;padding:1rem;color:#475569">No scorecard data available for ' + stateKey + ' (' + year + ').</th></tr>';
      if (tbody) tbody.innerHTML = '<tr><td colspan="99" style="text-align:center;padding:2rem;color:#94a3b8">' +
        '<strong>State not yet populated.</strong><br>' +
        'Currently only Delaware data is in the <code>scorecard_rankings</code> matview. ' +
        'When the backend pipeline adds <strong>' + stateKey + '</strong>, this view will work automatically — no frontend change needed.' +
        '</td></tr>';
      if (statusEl) statusEl.textContent = '0 jurisdictions · ' + stateKey + ' (' + year + ')';
      return;
    }
```

**Acceptance for Fix 3.** With Delaware active, scorecard renders ~60 jurisdictions. Switch state to Colorado → empty-state message appears with "State not yet populated" and the state name. Switch back to Delaware → table re-populates with deduped Delaware data.

---

## Fix 4 — Auto-refresh on jurisdiction / state change

**Where:** `app/index.html` near line 155078 (after `let _scorecardInited = false;`).

Insert:
```js
// Auto-refresh on jurisdiction / state change. State-agnostic: works for
// every state via _resolveActiveState() in Fix 3. Triggers from
// jurisdictionChanged (county/city/region/MPO/PD picks in Upload Data),
// tierChanged (view-tier toggles), and crashDataLoaded (state switches).
(function () {
  function _invalidateScorecard(reason) {
    _scorecardData = [];
    const activePanel = document.querySelector('.tab-content.active');
    if (activePanel && activePanel.id === 'tab-scorecard') {
      console.log('[Scorecard] Active — refetching after ' + reason);
      if (typeof loadScorecardData === 'function') loadScorecardData();
    } else {
      console.log('[Scorecard] Inactive — marked for refresh on next visit (' + reason + ')');
      _scorecardInited = false;
    }
  }
  document.addEventListener('jurisdictionChanged', function () { _invalidateScorecard('jurisdictionChanged'); });
  document.addEventListener('tierChanged',         function () { _invalidateScorecard('tierChanged'); });
  document.addEventListener('crashDataLoaded',     function (evt) {
    if (evt && evt.detail && evt.detail.source === 'supabase') _invalidateScorecard('crashDataLoaded');
  });
})();
```

**Acceptance.** Open Scorecard. Switch county Sussex → New Castle in Upload Data. Console: `[Scorecard] Inactive — marked for refresh on next visit (jurisdictionChanged)`. Reopen Scorecard — table reloads.

---

## Fix 5 — Repair the broken drill-down (don't disable it)

**Where:** `app/index.html` line 155362, `scorecardDrillDown(jurisdiction)`.

**Current bugs (verified in code):**
1. Tries `document.getElementById('upload-tier-select')` — doesn't exist (tier picker is a button row with `[data-view-tier]` attributes).
2. Matches dropdown by `option.text === jurisdiction` — fails because options' text is `"Kent County"` while matview emits `"Kent"`.

**Replace lines 155362–155382 with:**
```js
/**
 * Drill into a jurisdiction from the scorecard table.
 *
 * Routes through appConfig.jurisdictions namePatterns / fullName so the
 * matview's "Kent" maps to the dropdown's "kent" key. State-agnostic —
 * works for any state's hierarchy. Then sets the tier button + dropdown
 * value, fires change events so the bridge picks up the new tier+value,
 * navigates to Dashboard.
 *
 * @param {string} jurisdiction - matview jurisdiction name (e.g. "Kent")
 */
function scorecardDrillDown(jurisdiction) {
  if (!jurisdiction) return;

  // Resolve the matview name → appConfig.jurisdictions key.
  let targetKey = null;
  let targetTier = 'county';   // default to county (most jurisdictions in scorecard ARE counties)
  try {
    const jurs = (typeof appConfig !== 'undefined' && appConfig && appConfig.jurisdictions) || {};
    const norm = (s) => String(s || '').toLowerCase().trim();
    for (const k in jurs) {
      const j = jurs[k];
      if (!j) continue;
      const candidates = [
        j.name, j.fullName, j.shortName, j.displayName,
        ...(Array.isArray(j.namePatterns) ? j.namePatterns : [])
      ].filter(Boolean).map(norm);
      if (candidates.includes(norm(jurisdiction))) {
        targetKey = k;
        if (j.tier) targetTier = j.tier;
        break;
      }
    }
  } catch (e) { /* non-fatal */ }

  if (!targetKey) {
    console.warn('[Scorecard] Drill-down failed: no appConfig.jurisdictions match for "' + jurisdiction + '"');
    if (typeof showToast === 'function') {
      showToast('Could not navigate to ' + jurisdiction + ' — not in current state config.', 'warning');
    }
    return;
  }

  // Set the tier (county/city/etc.) by clicking the matching tier button.
  // The tier picker is a button row with [data-view-tier] attributes —
  // NOT a <select>. Defensive: fall through silently if buttons aren't found.
  try {
    const tierBtns = document.querySelectorAll('[data-view-tier]');
    let tierBtn = null;
    tierBtns.forEach(btn => {
      if (btn.getAttribute('data-view-tier') === targetTier) tierBtn = btn;
    });
    if (tierBtn && typeof tierBtn.click === 'function') tierBtn.click();
  } catch (e) { /* non-fatal */ }

  // Set the jurisdiction dropdown by VALUE (not text). The dropdown's
  // values are 'kent' / 'sussex' / 'wilmington' etc.
  try {
    const sel = document.getElementById('jurisdictionSelect');
    if (sel && sel.querySelector('option[value="' + targetKey + '"]')) {
      sel.value = targetKey;
      sel.dispatchEvent(new Event('change'));
    }
  } catch (e) { /* non-fatal */ }

  // Navigate to Dashboard. The change events kick off the Supabase bridge
  // — KPIs paint within ~1s.
  if (typeof navigateTo === 'function') navigateTo('dashboard');
}
```

**Acceptance for Fix 5.** Click "Kent" row in scorecard. Console must NOT log "Drill-down failed". Dashboard opens with KPI total = `q15.sum` (98,201 — Kent rolled up to PD Central from oracle). NOT zero. NOT 38,614 (Kent unincorp).

---

## Fix 6 — Tier sub-tabs that infer tier from `hierarchy.json` (replaces "render tier badge")

Since the matview has no tier column, we infer tier from each state's `hierarchy.json` `allCounties` list. State-agnostic: every state's hierarchy.json has the same shape.

**6a — Add the tier-inference helper near `_scorecardInited` (line 155078):**

```js
let _scorecardTierFilter = 'all';   // 'county' | 'city' | 'all'

/**
 * Infer the tier of a scorecard row from the active state's hierarchy.json.
 * State-agnostic: every state has allCounties + cities.
 * Falls back to 'unknown' if hierarchy isn't loaded yet.
 */
function _inferScorecardTier(row) {
  if (!row || !row.jurisdiction) return 'unknown';
  try {
    const hier = (typeof HierarchyRegistry !== 'undefined') ? HierarchyRegistry.getData() : null;
    if (!hier) return 'unknown';
    const norm = (s) => String(s || '').toLowerCase().trim().replace(/\s+county$/i, '');
    const target = norm(row.jurisdiction);
    // Counties — hier.allCounties is a {fips: name} map.
    if (hier.allCounties) {
      for (const fips in hier.allCounties) {
        if (norm(hier.allCounties[fips]) === target) return 'county';
      }
    }
    // Otherwise treat as city/town/CDP. Future: refine with a places list.
    return 'city';
  } catch (e) {
    return 'unknown';
  }
}

function setScorecardTier(tier) {
  _scorecardTierFilter = tier;
  document.querySelectorAll('.scorecard-tier-btn').forEach(btn => {
    const active = btn.getAttribute('data-tier') === tier;
    btn.style.background = active ? '#1e293b' : '#fff';
    btn.style.color      = active ? '#fff'    : '#475569';
    btn.style.fontWeight = active ? '600'     : '400';
  });
  renderScorecardTable(_scorecardData);
  updateScorecardChart();
}
```

**6b — Add the sub-tab strip in HTML.** Insert at `app/index.html` line ~20612 (between the filters bar at line 20612 and the table at line 20614):

```html
<!-- Tier filter strip — splits the leaderboard by jurisdiction tier (Fix 6) -->
<div id="scorecard-tier-tabs" style="display:flex;gap:.5rem;margin-bottom:1rem">
  <button class="scorecard-tier-btn active" data-tier="all" onclick="setScorecardTier('all')"
    style="padding:.4rem .8rem;border:1px solid #cbd5e1;background:#1e293b;color:#fff;border-radius:6px;font-size:.8rem;cursor:pointer;font-weight:600">All</button>
  <button class="scorecard-tier-btn" data-tier="county" onclick="setScorecardTier('county')"
    style="padding:.4rem .8rem;border:1px solid #cbd5e1;background:#fff;color:#475569;border-radius:6px;font-size:.8rem;cursor:pointer">Counties</button>
  <button class="scorecard-tier-btn" data-tier="city" onclick="setScorecardTier('city')"
    style="padding:.4rem .8rem;border:1px solid #cbd5e1;background:#fff;color:#475569;border-radius:6px;font-size:.8rem;cursor:pointer">Cities &amp; Towns</button>
</div>
```

**6c — Filter rows by tier in `renderScorecardTable`.** At `app/index.html` line ~155240, BEFORE `const sorted = data.slice().sort(...)`:
```js
  const _filtered = (_scorecardTierFilter === 'all')
    ? data
    : data.filter(r => _inferScorecardTier(r) === _scorecardTierFilter);
```
Then change `data.slice()` on the next line to `_filtered.slice()`.

Same pattern in `renderComparisonTable` at line ~155288.

**6d — Show inferred tier as a small badge** on the jurisdiction column. Replace line 155264:
```js
html += `<td style="font-weight:600">${r.jurisdiction || '—'}</td>`;
```
With:
```js
const _inferredTier = _inferScorecardTier(r);
const _tierBadge = (_inferredTier && _inferredTier !== 'unknown')
  ? ` <span style="font-size:.65rem;color:#64748b;font-weight:500;margin-left:.4rem;padding:.1rem .35rem;background:#f1f5f9;border-radius:3px">${_inferredTier}</span>`
  : '';
html += `<td style="font-weight:600">${r.jurisdiction || '—'}${_tierBadge}</td>`;
```

**Acceptance for Fix 6.**
- All tab: shows ~60 deduped DE jurisdictions.
- Counties tab: 3 rows (Kent, New Castle, Sussex) with `(county)` badges.
- Cities tab: ~57 rows (Wilmington, Dover, Newark, …) with `(city)` badges.
- Each row has the small grey tier badge next to the jurisdiction name.

---

## Acceptance test — full sequence after all six fixes

1. **Hard-refresh.** Sidebar EXPLORE: Dashboard → Map → Crash Tree → **Safety Scorecard** → Safety Focus → Fatal & Speeding → … No standalone Safety Scorecard at the bottom.

2. **Click Safety Scorecard.** Sub-tab strip visible (All/Counties/Cities & Towns). Console contains `[Scorecard] Deduped 90 rows → ~60 unique jurisdictions for delaware/2023`. Table shows ~60 rows (NOT 90 — no more Kent×6 etc.).

3. **Click Counties tab.** Three rows: Kent / New Castle / Sussex, all with `(county)` badge.

4. **Click Cities & Towns tab.** ~57 rows, each with `(city)` badge. No counties.

5. **Click "Kent" row (counties tab).** Dashboard opens, KPI total ≈ **98,201** (Kent rolled up to PD Central per oracle q15). NOT 0. NOT 38,614 (unincorporated only).

6. **Switch state in Upload Data dropdown to Colorado.** Open Safety Scorecard. Status reads `0 jurisdictions · colorado (2023)` and the empty-state body reads "State not yet populated. Currently only Delaware data is in the scorecard_rankings matview. When the backend pipeline adds colorado, this view will work automatically — no frontend change needed."

7. **Switch state back to Delaware.** Same scorecard view restores within ~1s.

8. **Switch county in Upload Data Sussex → Kent without leaving Scorecard.** Console: `[Scorecard] Active — refetching after jurisdictionChanged`. Table re-queries (no visual change since Delaware still active, but the network tab shows the call).

Paste the console excerpt covering all eight steps + screenshot of step 5 (Dashboard showing Kent ≈ 98,201 KPI) into the PR.

---

## Don't list

- Don't change the matview SQL. Fix 2 dedupe is client-side. The "fix the matview to emit non-duplicate rows" backend ticket is in the Appendix below.
- Don't hardcode `'delaware'` or `'colorado'`. Use `_resolveActiveState()`.
- Don't disable the drill-down. Fix 5 makes it work.
- Don't add heatmaps / sparklines / per-capita toggles in this PR — Fix 6 (sub-tabs) is the high-impact presentation upgrade. Other cosmetics in a follow-up.
- Don't merge until step 5 (Kent drill-down → KPI 98,201) verifies. That's the load-bearing acceptance test.

---

## Appendix — Backend matview rebuild request (file separately as a backend ticket)

The frontend dedupe in Fix 2 is a workaround. The proper fix is server-side:

**Current schema:** `scorecard_rankings` emits one row per `(state × jurisdiction × dot_district × planning_district × mpo_name × year)` combination. For DE/2023 that's 90 rows for ~60 unique jurisdictions.

**Requested rebuild:**
1. Emit one row per `(state × jurisdiction × year)`. Drop the dot_district / planning_district / mpo_name from the GROUP BY.
2. Add a column `jurisdiction_type` with values `'county' | 'city' | 'town' | 'cdp' | 'village' | 'borough'` derived from Census Places `LSAD` or local equivalent.
3. Add a column `juris_fips` (5-digit county FIPS or 7-digit place FIPS) so the frontend has a stable identifier independent of name string.
4. Populate all 50 state partitions (currently only `delaware` has data).

After the rebuild, Fix 2's dedupe becomes a no-op (it'll see one row per jurisdiction already), Fix 6's `_inferScorecardTier` can read `r.jurisdiction_type` directly instead of cross-referencing hierarchy.json, and Fix 5's drill-down can use `juris_fips` to disambiguate same-named entities.

The frontend code in this PR will work for the rebuilt matview without further changes — the dedupe just becomes a safety belt.
