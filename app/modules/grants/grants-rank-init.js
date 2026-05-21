/** CL grants.rank-init — extracted (name-anchored) 2026-05-18.
 *  27a of modular-prompts/27-v2-grants-rank.md. No behavior change.
 *  Reads inline shared globals (grantState etc.) via shared
 *  classic-script global scope — precedent: cmf-search, batch-ba-engine. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim, app/index.html L29888–L30021) ───
async function initGrantModule() {
    // Load grants from CSV first
    await loadGrantsCSV();

    // Round 15 §12.8 — merge grant_programs lookup-table rows into the
    // opportunities list so the Grants tab shows all 8 active programs
    // (federal + state-specific) instead of just the CSV's 1-2 entries.
    // State-agnostic — adding a new state means INSERTing rows in the
    // database, never a code branch.
    await mergeGrantProgramsFromSupabase();

    loadCrashCosts();
    // loadApplications lives in the separately-loaded grants-ui.js module and
    // is reachable here only via window. Guard the cross-module call so a
    // script-order regression can't throw a ReferenceError that aborts the
    // rest of grant init (audit 2026-05-20, P0).
    if (typeof loadApplications === 'function') {
        loadApplications();
    } else {
        console.warn('[Grants] loadApplications unavailable — grants-ui.js not loaded yet');
    }
    loadGrantAISettings();
    grantState._lastStateFips = jurisdictionContext.stateFips || '08';
    displayStateGrants();
    updateFavoritesCount();
    if (crashState.loaded) {
        initYearRangeFilter();
        rankLocationsForGrants();
        populateLocationDropdowns();
        document.getElementById('grantSearchDataBadge').innerHTML = '✅ Data Loaded';
        document.getElementById('grantWritingDataBadge').innerHTML = '✅ Data Loaded';
    }
    grantState.loaded = true;
}

/**
 * Round 15 §12.8 — fetch grant_programs from Supabase and merge any rows
 * that aren't already in grantState.opportunities (deduped by program_id).
 * Maps the lookup-table column shape to the front-end card shape so
 * displayStateGrants / renderGrantCard work without modification.
 */
async function mergeGrantProgramsFromSupabase() {
    try {
        if (!window.crashLensClient || typeof window.crashLensClient.getGrantPrograms !== 'function') {
            return;
        }
        const stateKey = (window.crashLensClient.state
                          || (typeof _getActiveStateKey === 'function' ? _getActiveStateKey() : '')
                          || '').toLowerCase();
        const programs = await window.crashLensClient.getGrantPrograms({ state: stateKey });
        if (!Array.isArray(programs) || programs.length === 0) return;
        const stateInfo = (typeof FIPSDatabase !== 'undefined' && jurisdictionContext.stateFips)
            ? FIPSDatabase.getState(String(jurisdictionContext.stateFips).padStart(2, '0'))
            : null;
        const stateAbbr = stateInfo?.abbr || jurisdictionContext.stateCode || '';
        const have = new Set((grantState.opportunities || []).map(g => g.id));
        const mapped = programs
            .filter(p => p && (p.program_id || p.id))
            .map(p => {
                const id = p.program_id || p.id;
                const stateSpecific = (p.scope === 'state');
                const fundingStr = p.max_award_amount
                    ? 'Up to $' + Number(p.max_award_amount).toLocaleString()
                    : 'Varies';
                const fedShareStr = p.federal_share_pct
                    ? p.federal_share_pct + '%'
                    : 'Varies';
                return {
                    id: id,
                    title: p.program_name || id,
                    agency: p.agency || (stateSpecific ? (stateAbbr + ' DOT') : 'USDOT'),
                    description: p.description || '',
                    funding: fundingStr,
                    federalShare: fedShareStr,
                    deadline: p.typical_deadline || null,
                    deadlineNote: p.deadline_note || (p.typical_deadline ? 'See agency NOFO' : 'Rolling / TBD'),
                    status: p.status || 'forecasted',
                    website: p.learn_more_url || p.website || '',
                    focus: Array.isArray(p.focus_areas) ? p.focus_areas
                        : (typeof p.focus_areas === 'string' ? [p.focus_areas] : []),
                    stateSpecific: stateSpecific,
                    stateCode: stateSpecific ? (stateAbbr || (p.state || '').toUpperCase()) : null,
                    _source: 'grant_programs'
                };
            })
            .filter(g => !have.has(g.id));
        if (mapped.length > 0) {
            grantState.opportunities = (grantState.opportunities || []).concat(mapped);
            console.log('[Grants] merged', mapped.length, 'programs from grant_programs lookup (state=' + stateKey + ')');
        }
    } catch (e) {
        console.warn('[Grants] mergeGrantProgramsFromSupabase failed (non-fatal):', e && e.message);
    }
}

// Legacy function kept for compatibility - no longer populates dropdowns
function initYearRangeFilter() {
    // Date inputs don't need initialization like select dropdowns did
    // This function is kept for backward compatibility
}

function applyGrantDateFilter() {
    const startDate = document.getElementById('grantStartDate').value;
    const endDate = document.getElementById('grantEndDate').value;
    grantState.dateRange.startDate = startDate || null;
    grantState.dateRange.endDate = endDate || null;
    rankLocationsForGrants();
}

function resetGrantDateFilter() {
    document.getElementById('grantStartDate').value = '';
    document.getElementById('grantEndDate').value = '';
    grantState.dateRange.startDate = null;
    grantState.dateRange.endDate = null;
    rankLocationsForGrants();
}

// Legacy functions for backward compatibility
function applyYearRangeFilter() { applyGrantDateFilter(); }
function resetYearRange() { resetGrantDateFilter(); }

function showGrantTab(tabId) {
    document.querySelectorAll('.grant-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.grant-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`.grant-tab[onclick="showGrantTab('${tabId}')"]`).classList.add('active');
    document.getElementById('grantTab-' + tabId).classList.add('active');
    const filtersBar = document.getElementById('grantFiltersBar');
    if (tabId === 'live') filtersBar.style.display = 'none';
    else filtersBar.style.display = 'flex';
    if (tabId === 'stateGrants') displayStateGrants();
    if (tabId === 'favorites') displayFavorites();
}

function searchGrantsGovKeyword(keyword) {
    const frame = document.getElementById('grantsGovFrame');
    const encodedKeyword = encodeURIComponent(keyword);
    frame.src = `https://www.grants.gov/search-grants?agencyCode=DOT&keywords=${encodedKeyword}`;
}

function openGrantsGovNewTab() {
    window.open('https://www.grants.gov/search-grants?agencyCode=DOT&keywords=traffic%20safety', '_blank');
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {}; CL.grants = CL.grants || {};
  CL.grants.rank = CL.grants.rank || {};
  // back-compat: were global; several bound from HTML onclick / inline callers
  window.initGrantModule = CL.grants.rank.initGrantModule = initGrantModule;
  window.mergeGrantProgramsFromSupabase = CL.grants.rank.mergeGrantProgramsFromSupabase = mergeGrantProgramsFromSupabase;
  window.initYearRangeFilter = CL.grants.rank.initYearRangeFilter = initYearRangeFilter;
  window.applyGrantDateFilter = CL.grants.rank.applyGrantDateFilter = applyGrantDateFilter;
  window.resetGrantDateFilter = CL.grants.rank.resetGrantDateFilter = resetGrantDateFilter;
  window.applyYearRangeFilter = CL.grants.rank.applyYearRangeFilter = applyYearRangeFilter;
  window.resetYearRange = CL.grants.rank.resetYearRange = resetYearRange;
  window.showGrantTab = CL.grants.rank.showGrantTab = showGrantTab;
  window.searchGrantsGovKeyword = CL.grants.rank.searchGrantsGovKeyword = searchGrantsGovKeyword;
  window.openGrantsGovNewTab = CL.grants.rank.openGrantsGovNewTab = openGrantsGovNewTab;
  CL._registerModule('grants/grants-rank-init');
})();
