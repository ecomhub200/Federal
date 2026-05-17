/**
 * CL analysis.tab module
 * Extracted from app/index.html (name-anchored; snapshot ~L63942-L64252).
 * Round X modular refactor — see modular-prompts/19-analysis-analysis-tab.md
 * and MODULAR_PLAN_PROMPT_19_RESOLUTION.md (Session G re-derivation).
 * Responsibility: Analysis tab merged-search feature (Supabase-paginated /
 *   client-fallback crash search, quick-location filter, CSV export).
 * Public API (dual exposure): window.<fn> ↔ CL.analysis.<fn> ↔ CL.analysis.tab.<fn>
 * Module-private (verified zero external refs — no window mirror):
 *   analysisSearchResults, analysisSearchTotal, analysisCurrentSearchPage,
 *   analysisSearchFilters, analysisSearchMode, analysisSearchInFlight,
 *   analysisSelectedQuickLocation.
 * Anchor note: prompt's `updateAnalysis` anchor is stale (a different fn);
 *   real identity is the `analysis*`/`initAnalysisSearch` set — deviation
 *   pre-authorized by Session J runbook + Session G resolution doc.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
// ============================================================
// ANALYSIS TAB SEARCH FUNCTIONS (Merged Search Feature)
// ============================================================
// Phase 4: server-paginated search via Supabase (window.crashLensClient).
// Falls back to client-side sampleRows filtering if Supabase unavailable.

let analysisSearchResults = [];       // Current PAGE of rows (server mode) or full results (fallback)
let analysisSearchTotal = 0;
let analysisCurrentSearchPage = 1;
let analysisSearchFilters = {};
let analysisSearchMode = 'local';
let analysisSearchInFlight = 0;
let analysisSelectedQuickLocation = null;

function _analysisReadFilters() {
    return {
        text: (document.getElementById('analysisSearchText').value || '').trim(),
        year: document.getElementById('analysisSearchYear').value || null,
        severity: document.getElementById('analysisSearchSeverity').value || null,
        pedBike: document.getElementById('analysisSearchPedBike').value || null,
    };
}
function _analysisCanUseSupabase() {
    return !!(window.crashLensClient && window.crashLensClient.supabaseKey);
}
function _analysisResolveTier() {
    try {
        if (window.CL && CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.resolveTier) {
            return CL.data.supabaseBridge.resolveTier();
        }
    } catch (e) { /* fall through */ }
    return { tier: 'state', value: null };
}

function analysisQuickLocationFilter(searchText) {
    const resultsDiv = document.getElementById('analysisQuickLocationResults');
    const previewDiv = document.getElementById('analysisQuickLocationPreview');

    if (!searchText || searchText.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }

    const search = searchText.toLowerCase();
    const matches = quickLocationData.filter(loc =>
        loc.label.toLowerCase().includes(search) ||
        loc.value.toLowerCase().includes(search)
    ).slice(0, 12);

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<div style="padding:.5rem;color:var(--gray)">No locations found</div>';
        resultsDiv.style.display = 'block';
        return;
    }

    resultsDiv.innerHTML = matches.map((loc, i) => {
        const routeCode = loc.value;
        const formattedName = formatRouteName(routeCode);
        const shortLabel = loc.label.length > 60 ? loc.label.substring(0, 60) + '...' : loc.label;
        const hasFatal = loc.k > 0;
        return `<div class="location-result" style="padding:.6rem .8rem;cursor:pointer;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center"
                    onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='white'"
                    onclick="analysisSelectLocation(${i})">
            <div>
                <div style="font-weight:500;color:#1e40af;font-size:.85rem">${esc(formattedName)}</div>
                <div style="font-size:.72rem;color:#64748b">${esc(shortLabel)}</div>
            </div>
            <div style="display:flex;gap:.3rem;align-items:center">
                <span style="background:#e5e7eb;padding:.15rem .4rem;border-radius:10px;font-size:.7rem;color:#374151">${loc.total} crashes</span>
                ${hasFatal ? '<span style="background:#dc2626;color:white;padding:.1rem .3rem;border-radius:8px;font-size:.65rem">FATAL</span>' : ''}
                ${loc.k > 0 ? `<span class="severity-badge severity-K" style="font-size:.6rem;padding:.1rem .25rem">${loc.k}K</span>` : ''}
                ${loc.a > 0 ? `<span class="severity-badge severity-A" style="font-size:.6rem;padding:.1rem .25rem">${loc.a}A</span>` : ''}
            </div>
        </div>`;
    }).join('');

    resultsDiv.style.display = 'block';
    // Store matches for selection
    resultsDiv.dataset.matches = JSON.stringify(matches);
}

function analysisSelectLocation(index) {
    const resultsDiv = document.getElementById('analysisQuickLocationResults');
    const previewDiv = document.getElementById('analysisQuickLocationPreview');
    const matches = JSON.parse(resultsDiv.dataset.matches || '[]');

    if (matches[index]) {
        analysisSelectedQuickLocation = matches[index];
        const loc = analysisSelectedQuickLocation;
        const formattedName = formatRouteName(loc.value);

        previewDiv.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center">
                <div>
                    <div style="font-weight:600;color:#1e40af">${esc(formattedName)}</div>
                    <div style="font-size:.8rem;color:#64748b">${esc(loc.label)}</div>
                </div>
                <div style="display:flex;gap:.4rem">
                    <span style="background:#f3f4f6;padding:.3rem .6rem;border-radius:6px;font-size:.8rem"><strong>${loc.total}</strong> crashes</span>
                    ${loc.k > 0 ? `<span class="severity-badge severity-K">${loc.k} Fatal</span>` : ''}
                    ${loc.a > 0 ? `<span class="severity-badge severity-A">${loc.a} Serious</span>` : ''}
                </div>
            </div>`;
        previewDiv.style.display = 'block';
        resultsDiv.style.display = 'none';
        document.getElementById('analysisQuickLocationSearch').value = formattedName;
    }
}

function analysisSelectTopQuickLocation() {
    const resultsDiv = document.getElementById('analysisQuickLocationResults');
    const matches = JSON.parse(resultsDiv.dataset.matches || '[]');
    if (matches.length > 0) {
        analysisSelectLocation(0);
    }
}

function analysisGoToCountermeasures() {
    if (!analysisSelectedQuickLocation) {
        alert('Please select a location first by searching for a road name.');
        return;
    }

    // Ensure CMF database is loaded first
    if (!cmfState.loaded) {
        loadCMFDatabase();
    }

    // Set the CMF location select
    const cmfSelect = document.getElementById('cmfLocationSelect');
    cmfSelect.value = 'route:' + analysisSelectedQuickLocation.value;

    // Load and switch tabs
    loadLocationForCMF();
    showTab('cmf');

    // Auto-find countermeasures after a short delay
    setTimeout(() => {
        findCountermeasures();
    }, 300);
}

async function analysisSearchCrashes() {
    analysisSearchFilters = _analysisReadFilters();
    analysisCurrentSearchPage = 1;

    if (_analysisCanUseSupabase()) {
        analysisSearchMode = 'supabase';
        await _analysisFetchPage(1);
        return;
    }

    analysisSearchMode = 'local';
    if (!crashState.sampleRowsLoaded || !crashState.sampleRows || crashState.sampleRows.length === 0) {
        if (typeof CL !== 'undefined' && CL.worker && CL.worker.ensureSampleRows) {
            showToast('Loading crash records for search...', 'info');
            CL.worker.ensureSampleRows().then(() => analysisSearchCrashes());
        }
        return;
    }
    const f = analysisSearchFilters;
    const textLower = (f.text || '').toLowerCase();
    analysisSearchResults = crashState.sampleRows.filter(row => {
        if (f.year && String(row[COL.YEAR]) !== f.year) return false;
        if (f.severity && (row[COL.SEVERITY]||'').charAt(0) !== f.severity) return false;
        if (f.pedBike === 'ped' && !isYes(row[COL.PED])) return false;
        if (f.pedBike === 'bike' && !isYes(row[COL.BIKE])) return false;
        if (textLower) {
            const searchable = [row[COL.ID], row[COL.ROUTE], row[COL.COLLISION], row[COL.WEATHER], row[COL.NODE]].join(' ').toLowerCase();
            if (!searchable.includes(textLower)) return false;
        }
        return true;
    });
    analysisSearchTotal = analysisSearchResults.length;
    analysisRenderSearchResults();
}

async function _analysisFetchPage(page) {
    const t = _analysisResolveTier();
    const filters = Object.assign({}, analysisSearchFilters, { page: page, pageSize: PAGE_SIZE });
    const myReq = ++analysisSearchInFlight;

    const tbody = document.getElementById('analysisSearchBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;color:var(--gray);padding:1rem">Loading…</td></tr>';

    try {
        const data = await window.crashLensClient.getCrashes(t.tier, t.value, filters);
        if (myReq !== analysisSearchInFlight) return;
        analysisSearchResults = data.rows || [];
        analysisSearchTotal = data.total || analysisSearchResults.length;
        analysisCurrentSearchPage = page;
        analysisRenderSearchResults();
    } catch (e) {
        console.warn('[Phase4] Analysis search Supabase fetch failed:', e && e.message);
        analysisSearchMode = 'local';
        analysisSearchCrashes();
    }
}

function analysisClearSearch() {
    document.getElementById('analysisSearchText').value = '';
    document.getElementById('analysisSearchYear').value = '';
    document.getElementById('analysisSearchSeverity').value = '';
    document.getElementById('analysisSearchPedBike').value = '';
    analysisSearchCrashes();
}

function analysisRenderSearchResults() {
    const page = (analysisSearchMode === 'supabase')
        ? analysisSearchResults
        : analysisSearchResults.slice((analysisCurrentSearchPage - 1) * PAGE_SIZE, analysisCurrentSearchPage * PAGE_SIZE);

    document.getElementById('analysisSearchBody').innerHTML = page.map(r => {
        const flags = [];
        if (isYes(r[COL.PED])) flags.push('🚶');
        if (isYes(r[COL.BIKE])) flags.push('🚴');
        if (isYes(r[COL.ALCOHOL])) flags.push('🍺');
        if (isYes(r[COL.SPEED])) flags.push('⚡');
        if (isYes(r[COL.HITRUN])) flags.push('🚗💨');
        const routeCode = r[COL.ROUTE] || '';
        const roadName = formatRouteName(routeCode);
        return `<tr>
            <td>${r[COL.DATE] || '--'}</td>
            <td style="font-size:.75rem">${esc(r[COL.ID] || '--')}</td>
            <td>${fmtTime(r[COL.TIME])}</td>
            <td><span class="severity-badge severity-${(r[COL.SEVERITY]||'').charAt(0)}">${(r[COL.SEVERITY]||'').charAt(0)}</span></td>
            <td style="font-size:.8rem" title="${esc(routeCode)}">${esc(roadName.substring(0,25))}</td>
            <td style="font-size:.75rem">${esc(formatNodeId(r[COL.NODE]||'').substring(0,15))}</td>
            <td style="font-size:.75rem">${esc((r[COL.COLLISION]||'').substring(0,25))}</td>
            <td style="font-size:.75rem">${esc((r[COL.WEATHER]||'').substring(0,15))}</td>
            <td style="font-size:.75rem">${esc((r[COL.LIGHT]||'').substring(0,15))}</td>
            <td>${flags.join(' ') || '-'}</td>
            <td><button class="btn btn-success btn-sm" style="padding:.15rem .4rem;font-size:.65rem" onclick="viewLocationCMF('${esc(routeCode)}')">💡 CMF</button></td>
        </tr>`;
    }).join('') || '<tr><td colspan="11" style="text-align:center;color:var(--gray)">No results</td></tr>';

    analysisRenderSearchPagination();
}

function analysisRenderSearchPagination() {
    const total = analysisSearchTotal || 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    if (totalPages <= 1) {
        document.getElementById('analysisSearchPagination').innerHTML = `<span style="color:var(--gray);font-size:.8rem">${total} results</span>`;
        return;
    }
    let html = `<span style="color:var(--gray);font-size:.8rem;margin-right:.5rem">${total.toLocaleString()} results</span>`;
    html += `<button class="page-btn" onclick="analysisGoSearchPage(1)" ${analysisCurrentSearchPage===1?'disabled':''}>«</button>`;
    html += `<button class="page-btn" onclick="analysisGoSearchPage(${analysisCurrentSearchPage-1})" ${analysisCurrentSearchPage===1?'disabled':''}>‹</button>`;
    const start = Math.max(1, analysisCurrentSearchPage - 2), end = Math.min(totalPages, analysisCurrentSearchPage + 2);
    for (let i = start; i <= end; i++) html += `<button class="page-btn ${i===analysisCurrentSearchPage?'active':''}" onclick="analysisGoSearchPage(${i})">${i}</button>`;
    html += `<button class="page-btn" onclick="analysisGoSearchPage(${analysisCurrentSearchPage+1})" ${analysisCurrentSearchPage===totalPages?'disabled':''}>›</button>`;
    html += `<button class="page-btn" onclick="analysisGoSearchPage(${totalPages})" ${analysisCurrentSearchPage===totalPages?'disabled':''}>»</button>`;
    document.getElementById('analysisSearchPagination').innerHTML = html;
}

function analysisGoSearchPage(p) {
    if (analysisSearchMode === 'supabase') {
        _analysisFetchPage(p);
    } else {
        analysisCurrentSearchPage = p;
        analysisRenderSearchResults();
    }
}

async function analysisExportSearchCSV() {
    let rowsForExport = [];
    if (analysisSearchMode === 'supabase' && _analysisCanUseSupabase()) {
        try {
            showToast('Exporting — fetching all matches…', 'info');
            const t = _analysisResolveTier();
            const filters = Object.assign({}, analysisSearchFilters, { all: true, maxRows: 50000 });
            const data = await window.crashLensClient.getCrashes(t.tier, t.value, filters);
            rowsForExport = data.rows || [];
        } catch (e) {
            console.warn('[Phase4] Bulk export fetch failed, using current page:', e && e.message);
            rowsForExport = analysisSearchResults;
        }
    } else {
        rowsForExport = analysisSearchResults;
    }
    if (!rowsForExport.length) { alert('No results'); return; }
    const headers = ['Date','Time','Severity','Route','Node','Collision Type','Weather','Light','Ped','Bike','Alcohol','Speed'];
    const rows = rowsForExport.map(r => [r[COL.DATE], r[COL.TIME], r[COL.SEVERITY], r[COL.ROUTE], r[COL.NODE], r[COL.COLLISION], r[COL.WEATHER], r[COL.LIGHT], r[COL.PED], r[COL.BIKE], r[COL.ALCOHOL], r[COL.SPEED]]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c||''}"`).join(',')).join('\n');
    downloadFile(csv, 'analysis_crash_search_results.csv', 'text/csv');
}

// Initialize Analysis tab search when data is loaded
function initAnalysisSearch() {
    // Populate year dropdown from whatever year list we have
    const yearSelect = document.getElementById('analysisSearchYear');
    if (yearSelect && crashState.years && crashState.years.length > 0 && yearSelect.options.length <= 1) {
        yearSelect.innerHTML = '<option value="">All</option>' +
            crashState.years.map(y => `<option value="${y}">${y}</option>`).join('');
    }
    analysisSearchCrashes();
}

// Note: Analysis Summary content has been moved to Dashboard tab
// The old analysis search functions below are kept for backwards compatibility
// but are no longer actively used since the search UI is now in Dashboard

// Close dropdown when clicking outside (for Analysis tab)
document.addEventListener('click', (e) => {
    const searchWrapper = document.getElementById('analysisQuickLocationSearch')?.parentElement;
    const resultsDiv = document.getElementById('analysisQuickLocationResults');
    if (searchWrapper && resultsDiv && !searchWrapper.contains(e.target)) {
        resultsDiv.style.display = 'none';
    }
});
  // ─── EXTRACTED CODE END ───
  window.CL = window.CL || {};
  CL.analysis = CL.analysis || {};
  CL.analysis.tab = CL.analysis.tab || {};
  window._analysisReadFilters = _analysisReadFilters;                   CL.analysis._analysisReadFilters = _analysisReadFilters;                   CL.analysis.tab._analysisReadFilters = _analysisReadFilters;
  window._analysisCanUseSupabase = _analysisCanUseSupabase;             CL.analysis._analysisCanUseSupabase = _analysisCanUseSupabase;             CL.analysis.tab._analysisCanUseSupabase = _analysisCanUseSupabase;
  window._analysisResolveTier = _analysisResolveTier;                   CL.analysis._analysisResolveTier = _analysisResolveTier;                   CL.analysis.tab._analysisResolveTier = _analysisResolveTier;
  window.analysisQuickLocationFilter = analysisQuickLocationFilter;     CL.analysis.analysisQuickLocationFilter = analysisQuickLocationFilter;     CL.analysis.tab.analysisQuickLocationFilter = analysisQuickLocationFilter;
  window.analysisSelectLocation = analysisSelectLocation;               CL.analysis.analysisSelectLocation = analysisSelectLocation;               CL.analysis.tab.analysisSelectLocation = analysisSelectLocation;
  window.analysisSelectTopQuickLocation = analysisSelectTopQuickLocation; CL.analysis.analysisSelectTopQuickLocation = analysisSelectTopQuickLocation; CL.analysis.tab.analysisSelectTopQuickLocation = analysisSelectTopQuickLocation;
  window.analysisGoToCountermeasures = analysisGoToCountermeasures;     CL.analysis.analysisGoToCountermeasures = analysisGoToCountermeasures;     CL.analysis.tab.analysisGoToCountermeasures = analysisGoToCountermeasures;
  window.analysisSearchCrashes = analysisSearchCrashes;                 CL.analysis.analysisSearchCrashes = analysisSearchCrashes;                 CL.analysis.tab.analysisSearchCrashes = analysisSearchCrashes;
  window._analysisFetchPage = _analysisFetchPage;                       CL.analysis._analysisFetchPage = _analysisFetchPage;                       CL.analysis.tab._analysisFetchPage = _analysisFetchPage;
  window.analysisClearSearch = analysisClearSearch;                     CL.analysis.analysisClearSearch = analysisClearSearch;                     CL.analysis.tab.analysisClearSearch = analysisClearSearch;
  window.analysisRenderSearchResults = analysisRenderSearchResults;     CL.analysis.analysisRenderSearchResults = analysisRenderSearchResults;     CL.analysis.tab.analysisRenderSearchResults = analysisRenderSearchResults;
  window.analysisRenderSearchPagination = analysisRenderSearchPagination; CL.analysis.analysisRenderSearchPagination = analysisRenderSearchPagination; CL.analysis.tab.analysisRenderSearchPagination = analysisRenderSearchPagination;
  window.analysisGoSearchPage = analysisGoSearchPage;                   CL.analysis.analysisGoSearchPage = analysisGoSearchPage;                   CL.analysis.tab.analysisGoSearchPage = analysisGoSearchPage;
  window.analysisExportSearchCSV = analysisExportSearchCSV;             CL.analysis.analysisExportSearchCSV = analysisExportSearchCSV;             CL.analysis.tab.analysisExportSearchCSV = analysisExportSearchCSV;
  window.initAnalysisSearch = initAnalysisSearch;                       CL.analysis.initAnalysisSearch = initAnalysisSearch;                       CL.analysis.tab.initAnalysisSearch = initAnalysisSearch;
  CL._registerModule('analysis/analysis-tab');
})();
