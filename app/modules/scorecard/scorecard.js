/**
 * CL scorecard module (coordinated 12+13+14 extraction)
 *
 * Extracted from app/index.html (main Safety Scorecard <script>, snapshot
 * L158397-L159347) on 2026-05-16. Round X modular refactor — coordinated
 * single-module extraction of prompts 12 (tier), 13 (render), 14 (choropleth)
 * because they share reassigned _scorecard* state that cannot cross an IIFE
 * boundary without a behavior change. See modular-prompts/12,13,14.
 *
 * Public API (back-compat dual exposure): all 25 top-level scorecard fns are
 * exposed as window.<fn> + CL.scorecard.<fn>. _scorecardData is exposed via a
 * live window getter (2 HTML inline handlers read it: renderScorecardTable
 * (_scorecardData) at index.html scorecard-normalize/scorecard-search). All
 * other _scorecard* state is fully internal (verified 0 external refs).
 *
 * Self-contained _earlySkel mini-IIFE (separate <script>) intentionally left
 * in app/index.html — it is independent of this block (0 refs here).
 *
 * NOTE: wrapper IIFE is intentionally NON-strict — the original inline
 * <script> ran in sloppy mode; adding 'use strict' to this 900+-line verbatim
 * move could change behavior. Verbatim, no behavior change.
 *
 * Depends on (load before): spatial/aggregate-loader, spatial/federal-boundaries,
 * ui/skeletons, core/tier (all referenced lazily inside fn bodies).
 */
(function(){
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

// ================================================================
// Safety Scorecard — Jurisdiction Comparison & Ranking
// ================================================================

/** Column configs for each scorecard type */
const SCORECARD_COLUMNS = {
  volume: {
    label: 'Volume & Severity',
    cols: [
      { key: 'total_crashes',   label: 'Total',   rank: 'rank_total_crashes' },
      { key: 'fatal_crashes',   label: 'Fatal',   rank: 'rank_fatal' },
      { key: 'ksi_crashes',     label: 'KSI',     rank: 'rank_ksi' },
      { key: 'total_epdo',      label: 'EPDO',    rank: 'rank_epdo' },
      { key: 'total_injured',   label: 'Injured' },
      { key: 'total_killed',    label: 'Killed' },
      { key: 'fatality_rate',   label: 'Fatal %', pct: true },
      { key: 'ksi_rate',        label: 'KSI %',   pct: true },
    ]
  },
  vulnerable: {
    label: 'Vulnerable Users',
    cols: [
      { key: 'total_crashes',       label: 'Total',       rank: 'rank_total_crashes' },
      { key: 'ped_crashes',         label: 'Pedestrian',  rank: 'rank_ped' },
      { key: 'bike_crashes',        label: 'Bicycle',     rank: 'rank_bike' },
      { key: 'motorcycle_crashes',  label: 'Motorcycle' },
      { key: 'ped_killed',          label: 'Ped Killed' },
      { key: 'ped_injured',         label: 'Ped Injured' },
      { key: 'senior_crashes',      label: 'Senior' },
      { key: 'young_crashes',       label: 'Young' },
      { key: 'ped_rate',            label: 'Ped %', pct: true },
    ]
  },
  factors: {
    label: 'Contributing Factors',
    cols: [
      { key: 'total_crashes',        label: 'Total',       rank: 'rank_total_crashes' },
      { key: 'impaired_crashes',     label: 'Impaired',    rank: 'rank_impaired' },
      { key: 'speed_crashes',        label: 'Speed',       rank: 'rank_speed' },
      { key: 'distracted_crashes',   label: 'Distracted' },
      { key: 'unrestrained_crashes', label: 'Unrestrained' },
      { key: 'night_crashes',        label: 'Night',       rank: 'rank_night' },
      { key: 'impaired_rate',        label: 'Impaired %',  pct: true },
      { key: 'speed_rate',           label: 'Speed %',     pct: true },
      { key: 'night_rate',           label: 'Night %',     pct: true },
    ]
  },
  infrastructure: {
    label: 'Infrastructure',
    cols: [
      { key: 'total_crashes',          label: 'Total',        rank: 'rank_total_crashes' },
      { key: 'intersection_crashes',   label: 'Intersection' },
      { key: 'road_departure_crashes', label: 'Road Depart.' },
      { key: 'workzone_crashes',       label: 'Work Zone' },
      { key: 'school_zone_crashes',    label: 'School Zone' },
      { key: 'near_school_crashes',    label: 'Near School' },
      { key: 'near_bridge_crashes',    label: 'Near Bridge' },
      { key: 'near_rail_crashes',      label: 'Near Rail' },
      { key: 'near_transit_crashes',   label: 'Near Transit' },
    ]
  }
};

let _scorecardChart = null;   // Chart.js instance
let _scorecardData  = [];     // latest fetched rows
let _scorecardSortCol  = 'rank_total_crashes';
let _scorecardSortAsc  = true;
let _scorecardInited   = false;
let _scorecardTierFilter = 'all';   // 'county' | 'city' | 'all'  (legacy var, kept for backward compat)
let _scorecardActiveTier = 'state'; // 'federal' | 'state' | 'dot_district' | 'mpo' | 'planning_district' | 'county' | 'city'

// US Census 2023 vintage estimates — used for per-100K normalization toggle.
// Keyed by lowercase state name (matches `state` column in scorecard_rankings + federal_summary).
// Source: census.gov/data/tables/time-series/demo/popest/2020s-state-total.html
const _STATE_POP_2023 = {
  'alabama':5108468, 'alaska':733406, 'arizona':7431344, 'arkansas':3067732,
  'california':38965193, 'colorado':5877610, 'connecticut':3617176,
  'delaware':1031890, 'district of columbia':678972, 'florida':22610726,
  'georgia':11029227, 'hawaii':1435138, 'idaho':1964726, 'illinois':12549689,
  'indiana':6862199, 'iowa':3207004, 'kansas':2940546, 'kentucky':4526154,
  'louisiana':4573749, 'maine':1395722, 'maryland':6180253,
  'massachusetts':7001399, 'michigan':10037261, 'minnesota':5737915,
  'mississippi':2939690, 'missouri':6196156, 'montana':1132812,
  'nebraska':1978379, 'nevada':3194176, 'new hampshire':1402054,
  'new jersey':9290841, 'new mexico':2114371, 'new york':19571216,
  'north carolina':10835491, 'north dakota':783926, 'ohio':11785935,
  'oklahoma':4053824, 'oregon':4233358, 'pennsylvania':12961683,
  'rhode island':1095962, 'south carolina':5373555, 'south dakota':919318,
  'tennessee':7126489, 'texas':30503301, 'utah':3417734, 'vermont':647464,
  'virginia':8715698, 'washington':7812880, 'west virginia':1770071,
  'wisconsin':5910955, 'wyoming':584057
};
function _statePopulation(stateName) {
  return _STATE_POP_2023[String(stateName||'').toLowerCase()] || null;
}
function _titleCase(s) { return String(s||'').replace(/\b\w/g, c => c.toUpperCase()); }

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

// Legacy entry point — delegated to the new pill renderer.
function setScorecardTier(tier) {
  _scorecardTierFilter = tier;
  _scorecardActivePill = tier;
  _renderTierPills(_scorecardActiveTier);
  renderScorecardTable(_scorecardData);
  updateScorecardChart();
}

// ─────────────────────────────────────────────────────────────────────────
// Tier-aware peer pills.  The set of pills depends on the active tier —
// at federal we show regions, at county we show city/magisterial, etc.
// ─────────────────────────────────────────────────────────────────────────
const _SCORECARD_PEER_PILLS = {
  federal:           [['all','All states'],['ne','Northeast'],['s','South'],['mw','Midwest'],['w','West']],
  state:             [['all','All'],['county','Counties'],['city','Cities & towns']],
  dot_district:      [['all','All in region'],['county','Counties'],['city','Cities & towns']],
  mpo:               [['all','All in MPO'],['county','Counties'],['city','Cities & towns']],
  planning_district: [['all','All in PD'],['county','Counties'],['city','Cities & towns']],
  county:            [['all','All in county'],['city','Cities & towns'],['mag','Magisterial districts']],
  city:              [['route','Top routes'],['intersection','Top intersections'],['corridor','Corridors']]
};
let _scorecardActivePill = 'all';
function _renderTierPills(activeTier) {
  const wrap = document.getElementById('scorecard-tier-tabs');
  if (!wrap) return;
  const pills = _SCORECARD_PEER_PILLS[activeTier] || _SCORECARD_PEER_PILLS.state;
  if (!pills.some(p => p[0] === _scorecardActivePill)) _scorecardActivePill = pills[0][0];
  wrap.innerHTML = pills.map(([k, lbl]) =>
    `<button class="sc-pill ${k===_scorecardActivePill?'active':''}" data-pill="${k}">${lbl}</button>`
  ).join('');
  wrap.querySelectorAll('.sc-pill').forEach(b => b.addEventListener('click', () => {
    _scorecardActivePill = b.dataset.pill;
    _scorecardTierFilter = b.dataset.pill;
    wrap.querySelectorAll('.sc-pill').forEach(x => x.classList.toggle('active', x === b));
    renderScorecardTable(_scorecardData);
    updateScorecardChart();
  }));
}

// Auto-refresh on jurisdiction / state change. State-agnostic: works for
// every state via _resolveActiveState() in loadScorecardData. Triggers from
// jurisdictionChanged (county/city/region/MPO/PD picks in Upload Data),
// tierChanged (view-tier toggles), and crashDataLoaded (state switches).
(function () {
  let _scorecardReloadTimer = null;
  let _scorecardLastReloadAt = 0;
  function _invalidateScorecard(reason) {
    _scorecardData = [];
    const activePanel = document.querySelector('.tab-content.active');
    if (activePanel && activePanel.id === 'tab-scorecard') {
      // Round 24 §5 — debounce reload. Three events fire on every state switch:
      // jurisdictionChanged + tierChanged + crashDataLoaded. Coalesce them.
      if (_scorecardReloadTimer) clearTimeout(_scorecardReloadTimer);
      _scorecardReloadTimer = setTimeout(() => {
        _scorecardReloadTimer = null;
        _scorecardLastReloadAt = Date.now();
        console.log('[Scorecard] Active — refetching after ' + reason);
        if (typeof loadScorecardData === 'function') loadScorecardData();
      }, 250);   // 250ms gathers all coincident events into one fetch
    } else {
      console.log('[Scorecard] Inactive — marked for refresh on next visit (' + reason + ')');
      _scorecardInited = false;
    }
  }
  document.addEventListener('jurisdictionChanged', () => _invalidateScorecard('jurisdictionChanged'));
  document.addEventListener('tierChanged',         () => _invalidateScorecard('tierChanged'));
  document.addEventListener('crashDataLoaded',     (evt) => {
    if (evt && evt.detail && evt.detail.source === 'supabase') _invalidateScorecard('crashDataLoaded');
  });
})();

// Round-11 — debounced pre-warm on jurisdiction change (catches county/city
// switches that don't go through full state-change). schedule() is a no-op
// if user has already navigated off Upload tab.
document.addEventListener('jurisdictionChanged', function () {
    try {
        var t = (CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.resolveTier)
            ? CL.data.supabaseBridge.resolveTier()
            : null;
        if (t && CL.data.prewarm) CL.data.prewarm.schedule(t.tier, t.value);
    } catch (e) { /* non-fatal */ }
});

/**
 * Initialize the scorecard tab — populate year dropdowns, load data.
 * Called once on first tab visit via showTab().
 */
function initScorecardTab() {
  if (_scorecardInited) { loadScorecardData(); return; }
  _scorecardInited = true;

  const yearSel     = document.getElementById('scorecard-year');
  const compareSel  = document.getElementById('scorecard-compare-year');
  if (!yearSel) return;

  // Build year options 2025 → 2009
  for (let y = 2025; y >= 2009; y--) {
    yearSel.add(new Option(y, y));
    compareSel.add(new Option(y, y));
  }
  yearSel.value    = '2023';   // default to most-complete year
  compareSel.value = '2022';

  loadScorecardData();
}

/**
 * Toggle compare-year dropdown visibility based on mode.
 */
function onScorecardModeChange() {
  const mode = document.getElementById('scorecard-year-mode').value;
  const wrap = document.getElementById('scorecard-compare-wrap');
  wrap.style.display = (mode === 'compare') ? 'flex' : 'none';
  loadScorecardData();
}

/**
 * Fetch scorecard data from Supabase and render.
 */
async function loadScorecardData() {
  const statusEl = document.getElementById('scorecard-status');
  const yearSel  = document.getElementById('scorecard-year');
  const modeSel  = document.getElementById('scorecard-year-mode');
  if (!yearSel) return;

  const year = parseInt(yearSel.value, 10);
  const mode = modeSel ? modeSel.value : 'single';
  if (statusEl) statusEl.textContent = 'Loading…';

  // Resolve tier first — federal tier has its own data source and doesn't need stateKey.
  let activeTier = 'state';
  let opts = {};
  if (window.CL && CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.resolveTier) {
    const tier = CL.data.supabaseBridge.resolveTier();
    if (tier && tier.tier) {
      activeTier = tier.tier;
      if (tier.tier === 'dot_district')      opts.dotDistrict      = tier.value;
      if (tier.tier === 'planning_district') opts.planningDistrict = tier.value;
      if (tier.tier === 'mpo')               opts.mpoName          = tier.value;
      if (tier.tier === 'county' || tier.tier === 'city') opts.jurisdiction = tier.value;
    }
  }
  _scorecardActiveTier = activeTier;

  // ── Federal tier branch ──────────────────────────────────────────────
  // Pulls per-state totals from federal_summary; doesn't need stateKey.
  if (activeTier === 'federal') {
    const client = window.crashLensClient;
    if (!client || !client.getFederalSummary) {
      if (statusEl) statusEl.textContent = 'Data client not available';
      return;
    }
    try {
      let data;
      if (mode === 'rolling') {
        data = await client.getFederalSummary(year - 2, year);
      } else {
        data = await client.getFederalSummary(year, year);
      }
      _scorecardData = data || [];
      _renderFederalKpis(_scorecardData, year);
      _renderChoropleth(_scorecardData);
      const kpiEl = document.getElementById('scorecard-federal-kpis');
      const choroEl = document.getElementById('scorecard-choropleth-wrap');
      if (kpiEl) kpiEl.style.display = 'grid';
      if (choroEl) choroEl.style.display = 'block';
      _renderTierPills('federal');
      if (mode === 'compare') {
        const compareYear = parseInt(document.getElementById('scorecard-compare-year').value, 10);
        const compareData = await client.getFederalSummary(compareYear, compareYear);
        renderComparisonTable(_scorecardData, compareData || [], year, compareYear);
      } else {
        renderScorecardTable(_scorecardData);
      }
      updateScorecardChart();
      const banner = (_scorecardData.length === 1)
        ? ' (1 of 51 states ingested — auto-grows as backend ingests more)'
        : '';
      if (statusEl) statusEl.textContent = `${_scorecardData.length} state${_scorecardData.length===1?'':'s'} · ${mode === 'rolling' ? (year-2)+'–'+year : year}${banner}`;
    } catch (e) {
      console.error('[Scorecard/federal] load failed:', e);
      if (statusEl) statusEl.textContent = 'Federal load failed: ' + e.message;
    }
    return;
  }

  // ── Non-federal: hide federal-only widgets, render tier-aware pills, continue ──
  const kpiEl = document.getElementById('scorecard-federal-kpis');
  const choroEl = document.getElementById('scorecard-choropleth-wrap');
  if (kpiEl) kpiEl.style.display = 'none';
  if (choroEl) choroEl.style.display = 'none';
  _renderTierPills(activeTier);

  // State-agnostic resolution. Use the same picker every other tab uses so
  // switching state in Upload Data automatically swaps scorecard partitions.
  const stateKey = (typeof _resolveActiveState === 'function')
    ? _resolveActiveState()
    : (window.crashLensClient && window.crashLensClient.state) || null;
  if (!stateKey) {
    if (statusEl) statusEl.textContent = 'No state selected — pick a state in Upload Data first.';
    return;
  }

  const client = window.crashLensClient;
  if (!client || !client.getScorecard) {
    if (statusEl) statusEl.textContent = 'Data client not available';
    return;
  }

  try {
    let data;
    if (mode === 'rolling') {
      // 3-year rolling: fetch year-2 → year
      opts.yearEnd = year;
      data = await client.getScorecard(stateKey, year - 2, opts);
      // Aggregate across the 3 years per jurisdiction
      data = _aggregateRolling(data);
    } else {
      data = await client.getScorecard(stateKey, year, opts);
    }

    _scorecardData = data || [];

    // Empty-state UI — current state has no rows in the scorecard_rankings
    // matview yet; tell the user the front-end is ready and the backend
    // pipeline is the gate.
    if (_scorecardData.length === 0) {
      const tbody = document.getElementById('scorecardBody');
      const thead = document.getElementById('scorecardHead');
      if (thead) thead.innerHTML = '<tr><th colspan="99" style="text-align:left;padding:1rem;color:#475569">No scorecard data available for ' + stateKey + ' (' + year + ').</th></tr>';
      if (tbody) tbody.innerHTML = '<tr><td colspan="99" style="text-align:center;padding:2rem;color:#94a3b8">' +
        '<strong>State not yet populated.</strong><br>' +
        'No scorecard data for <strong>' + stateKey + '</strong> in the <code>scorecard_rankings</code> matview yet. ' +
        'When the backend pipeline ingests it, this view will work automatically — no frontend change needed.' +
        '</td></tr>';
      if (statusEl) statusEl.textContent = '0 jurisdictions · ' + stateKey + ' (' + year + ')';
      return;
    }

    // SC3: build 5-yr sparkline from per-year matview rows. The
    // scorecard_rankings matview is partitioned by (jurisdiction × crash_year);
    // a parallel fetch of year-4 → year gives us the trend without a matview
    // migration. Graceful: on failure the L560 flat fallback still renders.
    let sparkByJuris = {};
    try {
      const histOpts = Object.assign({}, opts, { yearEnd: year });
      const history = await client.getScorecard(stateKey, year - 4, histOpts);
      // scorecard_rankings returns multiple rows per (jurisdiction, year)
      // (sub-aggregations by road_type/area_type). Sum total_crashes per
      // (jurisdiction, year), then take the last 5 distinct years.
      const totalsByJurisYear = {};
      const yearsByJuris = {};
      (history || []).forEach(h => {
        const juris = h.jurisdiction;
        const yr = Number(h.crash_year);
        if (!juris || !Number.isFinite(yr)) return;
        const key = juris + '|' + yr;
        totalsByJurisYear[key] = (totalsByJurisYear[key] || 0) + (Number(h.total_crashes) || 0);
        if (!yearsByJuris[juris]) yearsByJuris[juris] = new Set();
        yearsByJuris[juris].add(yr);
      });
      Object.keys(yearsByJuris).forEach(juris => {
        const last5 = Array.from(yearsByJuris[juris]).sort((a, b) => a - b).slice(-5);
        sparkByJuris[juris] = last5.map(y => totalsByJurisYear[juris + '|' + y] || 0);
      });
      _scorecardData.forEach(r => {
        const arr = sparkByJuris[r.jurisdiction];
        if (arr && arr.length >= 2) r.spark_5yr = arr;
      });
    } catch (histErr) {
      console.warn('[Scorecard] 5-yr history fetch failed (sparkline will be flat):', histErr.message);
    }

    if (mode === 'compare') {
      const compareYear = parseInt(document.getElementById('scorecard-compare-year').value, 10);
      const opts2 = Object.assign({}, opts);
      const compareData = await client.getScorecard(stateKey, compareYear, opts2);
      (compareData || []).forEach(r => {
        const arr = sparkByJuris[r.jurisdiction];
        if (arr && arr.length >= 2) r.spark_5yr = arr;
      });
      renderComparisonTable(_scorecardData, compareData || [], year, compareYear);
    } else {
      renderScorecardTable(_scorecardData);
    }

    updateScorecardChart();
    if (statusEl) statusEl.textContent = `${_scorecardData.length} jurisdictions · ${mode === 'rolling' ? (year-2)+'–'+year : year}`;
  } catch (e) {
    console.error('[Scorecard] load failed:', e);
    if (statusEl) statusEl.textContent = 'Error: ' + e.message;
  }
}

/**
 * Aggregate multi-year rows into single row per jurisdiction (for rolling mode).
 */
function _aggregateRolling(rows) {
  if (!rows || !rows.length) return [];
  const map = {};
  const sumKeys = [
    'total_crashes','fatal_crashes','ksi_crashes','total_epdo','total_injured','total_killed',
    'ped_crashes','bike_crashes','ped_killed','ped_injured','school_zone_crashes',
    'senior_crashes','young_crashes','motorcycle_crashes','impaired_crashes','speed_crashes',
    'distracted_crashes','unrestrained_crashes','night_crashes','workzone_crashes',
    'intersection_crashes','road_departure_crashes','near_school_crashes','near_bridge_crashes',
    'near_rail_crashes','near_transit_crashes'
  ];
  rows.forEach(r => {
    const j = r.jurisdiction;
    if (!map[j]) {
      map[j] = Object.assign({}, r);
      sumKeys.forEach(k => map[j][k] = Number(r[k]) || 0);
    } else {
      sumKeys.forEach(k => map[j][k] += Number(r[k]) || 0);
    }
  });

  // Recalc rates and ranks
  const agg = Object.values(map);
  agg.forEach(r => {
    const t = r.total_crashes || 1;
    r.fatality_rate = ((r.fatal_crashes / t) * 100).toFixed(2);
    r.ksi_rate      = ((r.ksi_crashes / t) * 100).toFixed(2);
    r.ped_rate      = ((r.ped_crashes / t) * 100).toFixed(2);
    r.night_rate    = ((r.night_crashes / t) * 100).toFixed(2);
    r.impaired_rate = ((r.impaired_crashes / t) * 100).toFixed(2);
    r.speed_rate    = ((r.speed_crashes / t) * 100).toFixed(2);
  });
  // Re-rank
  _rerank(agg, 'total_crashes', 'rank_total_crashes');
  _rerank(agg, 'fatal_crashes', 'rank_fatal');
  _rerank(agg, 'ksi_crashes',   'rank_ksi');
  _rerank(agg, 'total_epdo',    'rank_epdo');
  _rerank(agg, 'ped_crashes',   'rank_ped');
  _rerank(agg, 'bike_crashes',  'rank_bike');
  _rerank(agg, 'impaired_crashes','rank_impaired');
  _rerank(agg, 'speed_crashes', 'rank_speed');
  _rerank(agg, 'night_crashes', 'rank_night');
  return agg;
}

/** Assign descending ranks (most crashes = rank 1). */
function _rerank(rows, valKey, rankKey) {
  const sorted = rows.slice().sort((a, b) => (Number(b[valKey]) || 0) - (Number(a[valKey]) || 0));
  sorted.forEach((r, i) => r[rankKey] = i + 1);
}

/**
 * Render the main scorecard table — sortable, search-filtered, peer-pill-filtered,
 * with sparkline + KSI/100K heatmap + pin row + per-100K normalize toggle.
 */
let _scorecardSortKey = 'total_crashes';
let _scorecardSortDir = 'desc';
const _scorecardPinned = new Set();

// SC3 fix — compute YoY delta from whichever data source is available.
// Federal tier: matview provides yoy_total / yoy_fatal pre-computed.
// State/jurisdiction tier: those columns are NULL on scorecard_rankings,
// so derive from the 5-yr history array (r.spark_5yr) populated at L417-420.
// Returns null when no comparable prior year exists (caller renders em-dash).
function _computeYoyDelta(r) {
  if (r && r.yoy_total != null && isFinite(Number(r.yoy_total))) return Number(r.yoy_total);
  if (r && r.yoy_fatal != null && isFinite(Number(r.yoy_fatal))) return Number(r.yoy_fatal);
  const s = r && r.spark_5yr;
  if (Array.isArray(s) && s.length >= 2) {
    const cur = Number(s[s.length - 1]) || 0;
    const prev = Number(s[s.length - 2]) || 0;
    if (prev > 0) return ((cur - prev) / prev) * 100;
  }
  return null;
}

function renderScorecardTable(data) {
  const head = document.getElementById('scorecardHead');
  const body = document.getElementById('scorecardBody');
  if (!head || !body) return;
  if (!data || !data.length) {
    head.innerHTML = '<tr><th colspan="99" style="text-align:left;padding:1rem;color:#475569">No scorecard data available.</th></tr>';
    body.innerHTML = '';
    return;
  }

  const isFederal = (_scorecardActiveTier === 'federal');
  const normalize = document.getElementById('scorecard-normalize') && document.getElementById('scorecard-normalize').checked;
  const search = (document.getElementById('scorecard-search') && document.getElementById('scorecard-search').value || '').trim().toLowerCase();

  // Apply peer-pill filter (federal regions OR jurisdiction-type heuristic)
  let rows = data.slice();
  if (_scorecardActivePill && _scorecardActivePill !== 'all') {
    rows = rows.filter(r => _matchesPeerPill(r, _scorecardActivePill, isFederal));
  }
  // Search filter
  if (search) {
    const nameKey = isFederal ? 'state' : 'jurisdiction';
    rows = rows.filter(r => String(r[nameKey]||'').toLowerCase().includes(search));
  }

  // Compute per-100K rates per row (used for normalize toggle + heatmap).
  // For federal tier we use 2023 state population; for state-tier rows we
  // fall back to the precomputed ksi_rate column from scorecard_rankings.
  rows.forEach(r => {
    const pop = isFederal ? _statePopulation(r.state) : null;
    r._ksiRate = pop ? (Number(r.ksi_crashes||0) / pop * 100000) : Number(r.ksi_rate || 0);
    r._totalRate = pop ? (Number(r.total_crashes||0) / pop * 100000) : null;
  });

  // Sort (pinned rows always float to top)
  const nameKey = isFederal ? 'state' : 'jurisdiction';
  rows.sort((a, b) => {
    const aPinned = _scorecardPinned.has(a[nameKey]);
    const bPinned = _scorecardPinned.has(b[nameKey]);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    const av = a[_scorecardSortKey], bv = b[_scorecardSortKey];
    if (typeof av === 'string' && typeof bv === 'string') {
      return _scorecardSortDir === 'desc' ? bv.localeCompare(av) : av.localeCompare(bv);
    }
    return _scorecardSortDir === 'desc' ? (Number(bv||0) - Number(av||0)) : (Number(av||0) - Number(bv||0));
  });

  // Build header
  const cols = [
    { k:'__rank',        l:'#',           sortable:false, num:false },
    { k: nameKey,        l: isFederal?'State':'Jurisdiction', sortable:true,  num:false },
    { k:'total_crashes', l: normalize?'Total/100K':'Total',  sortable:true,  num:true  },
    { k:'__spark',       l:'5-yr',        sortable:false, num:false },
    { k:'fatal_crashes', l:'Fatal',       sortable:true,  num:true  },
    { k:'ksi_crashes',   l: normalize?'KSI/100K':'KSI',     sortable:true,  num:true  },
    { k:'total_epdo',    l:'EPDO',        sortable:true,  num:true  },
    { k:'_ksiRate',      l:'KSI/100K',    sortable:true,  num:true  }
  ];
  head.innerHTML = '<tr>' + cols.map(c => {
    const sorted = c.k === _scorecardSortKey;
    const arr = sorted ? (_scorecardSortDir==='desc'?'▼':'▲') : '▼';
    return `<th class="${c.num?'num':''} ${sorted?'sorted':''}" data-k="${c.k}" ${c.sortable?'role="button"':''} style="${c.num?'text-align:right;':''}padding:.5rem .55rem;font-size:.75rem;color:#475569;font-weight:500">${c.l}${c.sortable?` <span class="sort-arr">${arr}</span>`:''}</th>`;
  }).join('') + '</tr>';
  head.querySelectorAll('th[role="button"]').forEach(th => th.addEventListener('click', () => {
    const k = th.dataset.k;
    if (_scorecardSortKey === k) _scorecardSortDir = _scorecardSortDir === 'desc' ? 'asc' : 'desc';
    else { _scorecardSortKey = k; _scorecardSortDir = 'desc'; }
    renderScorecardTable(data);
  }));

  // Heatmap rank (1-based) for KSI rate column
  const ksiSorted = rows.slice().sort((a,b) => Number(b._ksiRate||0) - Number(a._ksiRate||0));
  const ksiRankByName = {};
  ksiSorted.forEach((r, i) => { ksiRankByName[r[nameKey]] = i + 1; });

  // Build body
  body.innerHTML = rows.map((r, i) => {
    const name = r[nameKey];
    const isPinned = _scorecardPinned.has(name);
    const dispTotal = normalize && r._totalRate != null
      ? r._totalRate.toFixed(1)
      : Number(r.total_crashes||0).toLocaleString();
    const dispKsi = normalize ? Number(r._ksiRate||0).toFixed(1) : Number(r.ksi_crashes||0).toLocaleString();
    const yoyDelta = _computeYoyDelta(r);
    const _scMode = document.getElementById('scorecard-year-mode')?.value || 'single';
    let yoyArr;
    if (_scMode === 'rolling') {
      yoyArr = '';   // YoY is meaningless across a rolling 3-yr sum
    } else if (yoyDelta === null) {
      yoyArr = `<span class="delta-flat" title="No prior-year data">— </span>`;
    } else if (yoyDelta > 0.5) {
      yoyArr = `<span class="delta-up" title="${yoyDelta.toFixed(1)}% YoY">▲ ${yoyDelta.toFixed(1)}%</span>`;
    } else if (yoyDelta < -0.5) {
      yoyArr = `<span class="delta-down" title="${yoyDelta.toFixed(1)}% YoY">▼ ${Math.abs(yoyDelta).toFixed(1)}%</span>`;
    } else {
      yoyArr = `<span class="delta-flat" title="${yoyDelta.toFixed(1)}% YoY">▬ ${yoyDelta.toFixed(1)}%</span>`;
    }
    const sparkVals = Array.isArray(r.spark_5yr) && r.spark_5yr.length
      ? r.spark_5yr
      : [r.total_crashes, r.total_crashes, r.total_crashes, r.total_crashes, r.total_crashes];
    const sparkSvg = _spark(sparkVals);
    const heatRank = ksiRankByName[name] || rows.length;
    const heatBg = _heatColor(heatRank, rows.length || 1);
    const heatFg = ((heatRank - 1) / Math.max(rows.length, 1)) < 0.4 ? '#fff' : '#412402';
    const displayName = isFederal ? _titleCase(name) : (name || '—');
    return `<tr class="${isPinned?'pinned':''}" data-name="${_escapeAttr(name)}">
      <td class="rank" style="text-align:center;padding:.45rem;font-size:.7rem;font-weight:600;color:#64748b">${i + 1}</td>
      <td style="padding:.45rem .55rem;font-size:.8rem"><button class="pin-btn ${isPinned?'is-pinned':''}" data-pin="${_escapeAttr(name)}" aria-label="Pin row">${isPinned?'📍':'📌'}</button>${displayName}</td>
      <td class="num" style="text-align:right;padding:.45rem .55rem;font-size:.8rem;font-variant-numeric:tabular-nums">${dispTotal}${yoyArr}</td>
      <td style="padding:.3rem .55rem;color:#64748b">${sparkSvg}</td>
      <td class="num" style="text-align:right;padding:.45rem .55rem;font-size:.8rem;font-variant-numeric:tabular-nums">${Number(r.fatal_crashes||0).toLocaleString()}</td>
      <td class="num" style="text-align:right;padding:.45rem .55rem;font-size:.8rem;font-variant-numeric:tabular-nums">${dispKsi}</td>
      <td class="num" style="text-align:right;padding:.45rem .55rem;font-size:.8rem;font-variant-numeric:tabular-nums">${Number(r.total_epdo||0).toLocaleString()}</td>
      <td class="num" style="text-align:right;padding:.45rem .55rem"><span class="heat-cell" style="background:${heatBg};color:${heatFg}">${Number(r._ksiRate||0).toFixed(1)}</span></td>
    </tr>`;
  }).join('');
  body.querySelectorAll('.pin-btn').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    const n = btn.dataset.pin;
    if (_scorecardPinned.has(n)) _scorecardPinned.delete(n); else _scorecardPinned.add(n);
    renderScorecardTable(data);
  }));
}

// ── Peer-pill filter heuristic ──────────────────────────────────────────
function _matchesPeerPill(row, pill, isFederal) {
  if (isFederal) {
    const NORTHEAST = ['connecticut','maine','massachusetts','new hampshire','rhode island','vermont','new jersey','new york','pennsylvania'];
    const SOUTH = ['delaware','district of columbia','florida','georgia','maryland','north carolina','south carolina','virginia','west virginia','alabama','kentucky','mississippi','tennessee','arkansas','louisiana','oklahoma','texas'];
    const MIDWEST = ['illinois','indiana','michigan','ohio','wisconsin','iowa','kansas','minnesota','missouri','nebraska','north dakota','south dakota'];
    const WEST = ['arizona','colorado','idaho','montana','nevada','new mexico','utah','wyoming','alaska','california','hawaii','oregon','washington'];
    const s = String(row.state||'').toLowerCase();
    if (pill === 'ne') return NORTHEAST.includes(s);
    if (pill === 's')  return SOUTH.includes(s);
    if (pill === 'mw') return MIDWEST.includes(s);
    if (pill === 'w')  return WEST.includes(s);
    return true;
  }
  // Non-federal — use existing _inferScorecardTier heuristic ('county' / 'city').
  const inferred = (typeof _inferScorecardTier === 'function') ? _inferScorecardTier(row) : 'unknown';
  if (pill === 'county') return inferred === 'county';
  if (pill === 'city')   return inferred === 'city';
  if (pill === 'mag')    return row.jurisdiction_type === 'magisterial';
  return true;
}

// ── Sparkline + heatmap helpers ─────────────────────────────────────────
function _spark(values) {
  if (!Array.isArray(values) || values.length < 2) return '';
  const nums = values.map(v => Number(v||0));
  const min = Math.min(...nums), max = Math.max(...nums);
  const w = 60, h = 18, range = (max - min) || 1;
  const pts = nums.map((v,i) => `${(i / (nums.length-1) * w).toFixed(1)},${(h - (v - min) / range * (h-2) - 1).toFixed(1)}`).join(' ');
  return `<svg class="spark-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`;
}
const _SCORECARD_HEAT_RAMP = ['#EAF3DE','#C0DD97','#FAC775','#EF9F27','#E24B4A','#A32D2D'];
function _heatColor(rank, total) {
  if (total <= 0) return _SCORECARD_HEAT_RAMP[0];
  const i = Math.min(_SCORECARD_HEAT_RAMP.length - 1, Math.floor((rank - 1) / total * _SCORECARD_HEAT_RAMP.length));
  return _SCORECARD_HEAT_RAMP[i];
}
function _escapeAttr(s) { return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;'); }

// ── Action buttons (reset pins / CSV export) ───────────────────────────
function resetScorecardPins() { _scorecardPinned.clear(); renderScorecardTable(_scorecardData); }
function exportScorecardCSV() {
  if (!_scorecardData || !_scorecardData.length) return;
  const isFederal = (_scorecardActiveTier === 'federal');
  const nameKey = isFederal ? 'state' : 'jurisdiction';
  const cols = [nameKey, 'total_crashes', 'fatal_crashes', 'ksi_crashes', 'total_epdo', 'total_killed', 'total_injured', 'ksi_rate'];
  const lines = [cols.join(',')];
  _scorecardData.forEach(r => lines.push(cols.map(c => `"${String(r[c] == null ? '' : r[c]).replace(/"/g,'""')}"`).join(',')));
  const blob = new Blob([lines.join('\n')], { type:'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const tag = isFederal ? 'federal' : (_scorecardData[0].state || 'data');
  a.href = url; a.download = `scorecard_${tag}_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Federal-only KPI cards ─────────────────────────────────────────────
function _renderFederalKpis(rows, year) {
  const wrap = document.getElementById('scorecard-federal-kpis');
  if (!wrap) return;
  if (!rows || !rows.length) { wrap.innerHTML = ''; return; }
  const withRate = rows.map(r => {
    const pop = _statePopulation(r.state);
    return Object.assign({}, r, { _ksiRate: pop ? (Number(r.ksi_crashes||0) / pop * 100000) : 0, _pop: pop });
  });
  const worstByKsi = withRate.slice().sort((a,b) => b._ksiRate - a._ksiRate)[0];
  const mostImproved = withRate.slice().sort((a,b) => (Number(a.yoy_fatal||0)) - (Number(b.yoy_fatal||0)))[0];
  const natFatal = rows.reduce((s,r) => s + Number(r.fatal_crashes||0), 0);
  const natKsi   = rows.reduce((s,r) => s + Number(r.ksi_crashes||0), 0);
  const natPop   = rows.reduce((s,r) => s + (_statePopulation(r.state) || 0), 0);
  const natKsiRate = natPop ? (natKsi / natPop * 100000).toFixed(1) : '—';
  const cards = [
    { cls:'up',   label:'Worst by KSI rate', val: _titleCase(worstByKsi.state),
      sub: worstByKsi._ksiRate.toFixed(1) + ' / 100K' + (worstByKsi.yoy_fatal != null ? ' • ' + (worstByKsi.yoy_fatal>0?'+':'') + Number(worstByKsi.yoy_fatal).toFixed(1)+'% YoY' : '') },
    { cls:'down', label:'Most improved YoY', val: _titleCase(mostImproved.state),
      sub: mostImproved.yoy_fatal != null ? Number(mostImproved.yoy_fatal).toFixed(1) + '% fatal crashes' : '—' },
    { cls:'',     label:'National fatal total', val: natFatal.toLocaleString(),
      sub: year + ' — Crash Lens federal_summary' },
    { cls:'',     label:'National KSI rate', val: natKsiRate + ' / 100K',
      sub: 'SS4A target ≤ 50' }
  ];
  wrap.innerHTML = cards.map(c => `<div class="sc-kpi ${c.cls}">
    <p class="kpi-label">${c.label}</p>
    <p class="kpi-val">${c.val}</p>
    <p class="kpi-sub">${c.sub}</p>
  </div>`).join('');
}

// ── D3 choropleth (federal tier only) ───────────────────────────────────
window._scorecardChoroplethLoaded = false;
function _loadChoroplethDeps() {
  if (window._scorecardChoroplethLoaded) return Promise.resolve();
  const load = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  return load('https://cdn.jsdelivr.net/npm/d3@7.8.5/dist/d3.min.js')
    .then(() => load('https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js'))
    .then(() => { window._scorecardChoroplethLoaded = true; });
}
async function _renderChoropleth(rows) {
  const wrap = document.getElementById('scorecard-choropleth');
  if (!wrap || !rows || !rows.length) return;
  wrap.innerHTML = '<div style="padding:1rem;color:#94a3b8;font-size:.8rem">Loading map…</div>';
  try {
    await _loadChoroplethDeps();
    if (typeof d3 === 'undefined' || typeof topojson === 'undefined') return;
    wrap.innerHTML = '';
    const fatalRateByName = {};
    rows.forEach(r => {
      const pop = _statePopulation(r.state);
      if (pop) fatalRateByName[_titleCase(r.state)] = Number(r.fatal_crashes||0) / pop * 100000;
    });
    const vals = Object.values(fatalRateByName);
    const max = vals.length ? Math.max(...vals, 1) : 1;
    const isDark = matchMedia('(prefers-color-scheme: dark)').matches;
    const scheme = isDark ? d3.schemeBlues[5].slice().reverse() : d3.schemeBlues[5];
    const color = d3.scaleQuantize([0, max], scheme);
    const svg = d3.select(wrap).append('svg').attr('viewBox', '0 0 900 470').attr('width', '100%');
    const path = d3.geoPath(d3.geoAlbersUsa().scale(1000).translate([450, 230]));
    const us = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json());
    svg.selectAll('path')
      .data(topojson.feature(us, us.objects.states).features)
      .join('path')
      .attr('d', path)
      .attr('stroke', isDark ? 'rgba(255,255,255,.2)' : '#fff')
      .attr('stroke-width', 0.5)
      .attr('fill', d => fatalRateByName[d.properties.name] != null ? color(fatalRateByName[d.properties.name]) : '#eee')
      .style('cursor','pointer')
      .on('click', (_e, d) => {
        if (typeof switchToState === 'function') switchToState(String(d.properties.name).toLowerCase());
      })
      .append('title').text(d => `${d.properties.name} — ${(fatalRateByName[d.properties.name]||0).toFixed(1)} fatal / 100K`);
  } catch (e) {
    wrap.innerHTML = '<div style="padding:1rem;color:#dc2626;font-size:.8rem">Choropleth failed to load: ' + e.message + '</div>';
  }
}

/**
 * Render comparison table showing deltas between two years.
 */
function renderComparisonTable(current, compare, yearA, yearB) {
  const type = document.getElementById('scorecard-type').value;
  const cfg  = SCORECARD_COLUMNS[type] || SCORECARD_COLUMNS.volume;
  const thead = document.getElementById('scorecardHead');
  const tbody = document.getElementById('scorecardBody');
  if (!thead || !tbody) return;

  // Index compare data by jurisdiction
  const compMap = {};
  (compare || []).forEach(r => compMap[r.jurisdiction] = r);

  // Tier filter (Fix 6) — also gate the compare view by sub-tab.
  const _filtered = (_scorecardTierFilter === 'all')
    ? current
    : current.filter(r => _inferScorecardTier(r) === _scorecardTierFilter);

  const maxRank = _filtered.length || 1;

  // Header with year labels
  let hdr = '<tr><th>#</th><th>Jurisdiction</th>';
  cfg.cols.forEach(c => {
    hdr += `<th style="text-align:right">${c.label}<br><span style="font-size:.65rem;color:#94a3b8">${yearA} vs ${yearB}</span></th>`;
  });
  hdr += '</tr>';
  thead.innerHTML = hdr;

  // Sort by rank
  const sorted = _filtered.slice().sort((a, b) => (Number(a.rank_total_crashes)||999) - (Number(b.rank_total_crashes)||999));

  let html = '';
  sorted.forEach(r => {
    const rank = Number(r.rank_total_crashes) || 999;
    const comp = compMap[r.jurisdiction] || {};
    html += '<tr>';
    html += `<td style="text-align:center"><span style="display:inline-block;width:28px;height:28px;line-height:28px;border-radius:50%;font-weight:700;font-size:.8rem;color:#fff;background:${_rankColor(rank, maxRank)}">${rank}</span></td>`;
    html += `<td style="font-weight:600">${r.jurisdiction || '—'}</td>`;
    cfg.cols.forEach(c => {
      const curVal  = Number(r[c.key]) || 0;
      const prevVal = Number(comp[c.key]) || 0;
      const delta   = curVal - prevVal;
      const arrow   = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';
      const color   = delta > 0 ? '#ef4444' : delta < 0 ? '#22c55e' : '#94a3b8';
      let display   = c.pct ? parseFloat(r[c.key]).toFixed(1) + '%' : curVal.toLocaleString();
      html += `<td style="text-align:right">${display} <span style="font-size:.75rem;color:${color};font-weight:600">${arrow}${Math.abs(delta).toLocaleString()}</span></td>`;
    });
    html += '</tr>';
  });
  tbody.innerHTML = html || '<tr><td colspan="99" style="text-align:center;padding:2rem;color:#94a3b8">No data</td></tr>';
}

/**
 * Return a hex colour for a rank: red (worst/highest) → amber → green (best/lowest).
 */
function _rankColor(rank, total) {
  if (total <= 1) return '#64748b';
  const pct = (rank - 1) / (total - 1);  // 0 = rank #1 (worst), 1 = last (best)
  if (pct <= 0.15) return '#ef4444';       // red — top 15%
  if (pct <= 0.35) return '#f97316';       // orange
  if (pct <= 0.55) return '#eab308';       // amber
  if (pct <= 0.75) return '#22c55e';       // green
  return '#16a34a';                        // dark green — best
}

/**
 * Sort handler — toggle direction if same column clicked again.
 */
function scorecardSort(col) {
  if (_scorecardSortCol === col) {
    _scorecardSortAsc = !_scorecardSortAsc;
  } else {
    _scorecardSortCol = col;
    _scorecardSortAsc = true;
  }
  renderScorecardTable(_scorecardData);
}

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

/**
 * Update the horizontal bar chart with the selected metric.
 * Works for both federal-tier rows (state column) and state-tier rows (jurisdiction column).
 */
function updateScorecardChart() {
  const canvas = document.getElementById('scorecardChart');
  const metricSel = document.getElementById('scorecard-chart-metric');
  if (!canvas || !metricSel || !_scorecardData.length) return;

  const isFederal = (_scorecardActiveTier === 'federal');
  const nameKey = isFederal ? 'state' : 'jurisdiction';
  const metric = metricSel.value;
  const metricLabel = (metricSel.options[metricSel.selectedIndex] && metricSel.options[metricSel.selectedIndex].text) || metric;

  // ksi_rate may not be precomputed for federal rows — fall back to _ksiRate
  // (set by renderScorecardTable) or compute on the fly.
  const valueOf = (r) => {
    if (metric === 'ksi_rate' && (r.ksi_rate == null || r.ksi_rate === 0)) {
      const pop = _statePopulation(r.state);
      if (pop) return Number(r.ksi_crashes||0) / pop * 100000;
    }
    return Number(r[metric]||0);
  };

  // Take top-12 by selected metric
  const sorted = _scorecardData.slice().sort((a,b) => valueOf(b) - valueOf(a)).slice(0, 12);
  const labels = sorted.map(r => isFederal ? _titleCase(r[nameKey]) : (r[nameKey] || '?'));
  const vals   = sorted.map(valueOf);
  // Rank-based color when rank_total_crashes is present (state-tier),
  // otherwise blue default for federal-tier rows.
  const maxRank = _scorecardData.length;
  const colors = sorted.map(r => {
    const rank = Number(r.rank_total_crashes);
    return rank ? _rankColor(rank, maxRank) : '#378ADD';
  });

  if (_scorecardChart) _scorecardChart.destroy();
  _scorecardChart = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: { labels, datasets: [{ label: metricLabel, data: vals, backgroundColor: colors, borderRadius: 4, barThickness: 16 }] },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${metricLabel}: ${ctx.parsed.x.toLocaleString()}` } }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,.06)' }, ticks: { callback: v => v.toLocaleString() } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });
}

// Refresh scorecard when the active tier changes — federal⇄state⇄county etc.
document.addEventListener('CL:tierChanged', () => {
  const panel = document.getElementById('tab-scorecard');
  if (panel && panel.classList.contains('active') && typeof loadScorecardData === 'function') {
    loadScorecardData();
  }
});

// ================================================================
// END SAFETY SCORECARD MODULE
// ================================================================

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.scorecard = CL.scorecard || {};
  window._aggregateRolling = _aggregateRolling; CL.scorecard._aggregateRolling = _aggregateRolling;
  window._escapeAttr = _escapeAttr; CL.scorecard._escapeAttr = _escapeAttr;
  window._heatColor = _heatColor; CL.scorecard._heatColor = _heatColor;
  window._inferScorecardTier = _inferScorecardTier; CL.scorecard._inferScorecardTier = _inferScorecardTier;
  window._loadChoroplethDeps = _loadChoroplethDeps; CL.scorecard._loadChoroplethDeps = _loadChoroplethDeps;
  window._matchesPeerPill = _matchesPeerPill; CL.scorecard._matchesPeerPill = _matchesPeerPill;
  window._rankColor = _rankColor; CL.scorecard._rankColor = _rankColor;
  window._renderChoropleth = _renderChoropleth; CL.scorecard._renderChoropleth = _renderChoropleth;
  window._renderFederalKpis = _renderFederalKpis; CL.scorecard._renderFederalKpis = _renderFederalKpis;
  window._renderTierPills = _renderTierPills; CL.scorecard._renderTierPills = _renderTierPills;
  window._rerank = _rerank; CL.scorecard._rerank = _rerank;
  window._spark = _spark; CL.scorecard._spark = _spark;
  window._statePopulation = _statePopulation; CL.scorecard._statePopulation = _statePopulation;
  window._titleCase = _titleCase; CL.scorecard._titleCase = _titleCase;
  window.exportScorecardCSV = exportScorecardCSV; CL.scorecard.exportScorecardCSV = exportScorecardCSV;
  window.initScorecardTab = initScorecardTab; CL.scorecard.initScorecardTab = initScorecardTab;
  window.loadScorecardData = loadScorecardData; CL.scorecard.loadScorecardData = loadScorecardData;
  window.onScorecardModeChange = onScorecardModeChange; CL.scorecard.onScorecardModeChange = onScorecardModeChange;
  window.renderComparisonTable = renderComparisonTable; CL.scorecard.renderComparisonTable = renderComparisonTable;
  window.renderScorecardTable = renderScorecardTable; CL.scorecard.renderScorecardTable = renderScorecardTable;
  window.resetScorecardPins = resetScorecardPins; CL.scorecard.resetScorecardPins = resetScorecardPins;
  window.scorecardDrillDown = scorecardDrillDown; CL.scorecard.scorecardDrillDown = scorecardDrillDown;
  window.scorecardSort = scorecardSort; CL.scorecard.scorecardSort = scorecardSort;
  window.setScorecardTier = setScorecardTier; CL.scorecard.setScorecardTier = setScorecardTier;
  window.updateScorecardChart = updateScorecardChart; CL.scorecard.updateScorecardChart = updateScorecardChart;
  // Live getter so the 2 inline HTML handlers (renderScorecardTable(_scorecardData))
  // keep seeing the current, reassigned module-private _scorecardData.
  try { Object.defineProperty(window, '_scorecardData', { get: function(){ return _scorecardData; }, configurable: true }); } catch (e) {}
  CL._registerModule('scorecard/scorecard');
})();
