/**
 * CL dashboard.search — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.dashboard.search.<fn>; module-private
 * state (0 external refs) stays inside this IIFE.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
function _dashCanUseSupabase() {
    return !!(window.crashLensClient && window.crashLensClient.supabaseKey);
}

function initDashboardSearch() {
    // Populate year dropdown from whatever year list we have (crashState or state config)
    const yearSelect = document.getElementById('dashSearchYear');
    if (yearSelect && crashState.years && crashState.years.length > 0 && yearSelect.options.length <= 1) {
        yearSelect.innerHTML = '<option value="">All</option>' +
            crashState.years.map(y => `<option value="${y}">${y}</option>`).join('');
    }

    // Fire an initial (filter-less) search so the table is populated
    dashSearchCrashes();
}

async function dashSearchCrashes() {
    dashSearchFilters = _dashReadFilters();
    dashCurrentSearchPage = 1;

    if (_dashCanUseSupabase()) {
        dashSearchMode = 'supabase';
        await _dashFetchPage(1);
        return;
    }

    // Fallback: client-side filtering on sampleRows
    dashSearchMode = 'local';
    if (!crashState.sampleRowsLoaded || !crashState.sampleRows || crashState.sampleRows.length === 0) {
        if (typeof CL !== 'undefined' && CL.worker && CL.worker.ensureSampleRows) {
            showToast('Loading crash records for search...', 'info');
            CL.worker.ensureSampleRows().then(() => dashSearchCrashes());
        }
        return;
    }
    const f = dashSearchFilters;
    const textLower = (f.text || '').toLowerCase();
    dashSearchResults = crashState.sampleRows.filter(row => {
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
    dashSearchTotal = dashSearchResults.length;
    dashRenderSearchResults();
}

// Fetch a specific page from Supabase using the last applied filter set
async function _dashFetchPage(page) {
    const t = _dashResolveTier();
    const filters = Object.assign({}, dashSearchFilters, { page: page, pageSize: PAGE_SIZE });
    const myReq = ++dashSearchInFlight;

    const tbody = document.getElementById('dashSearchBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;color:var(--gray);padding:1rem">Loading…</td></tr>';

    try {
        const data = await window.crashLensClient.getCrashes(t.tier, t.value, filters);
        // Ignore stale responses (older than the most recent in-flight request)
        if (myReq !== dashSearchInFlight) return;
        dashSearchResults = data.rows || [];
        dashSearchTotal = data.total || dashSearchResults.length;
        dashCurrentSearchPage = page;
        dashRenderSearchResults();
    } catch (e) {
        console.warn('[Phase4] Dashboard search Supabase fetch failed:', e && e.message);
        // One-time fallback to local filtering for this search
        dashSearchMode = 'local';
        dashSearchCrashes();
    }
}

function dashClearSearch() {
    document.getElementById('dashSearchText').value = '';
    document.getElementById('dashSearchYear').value = '';
    document.getElementById('dashSearchSeverity').value = '';
    document.getElementById('dashSearchPedBike').value = '';
    dashSearchCrashes();
}

function dashRenderSearchResults() {
    // In Supabase mode, rows are already the current page. In local mode, slice here.
    const page = (dashSearchMode === 'supabase')
        ? dashSearchResults
        : dashSearchResults.slice((dashCurrentSearchPage - 1) * PAGE_SIZE, dashCurrentSearchPage * PAGE_SIZE);

    const tbody = document.getElementById('dashSearchBody');
    if (!tbody) return;

    tbody.innerHTML = page.map(r => {
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

    dashRenderSearchPagination();
}

function dashRenderSearchPagination() {
    const paginationEl = document.getElementById('dashSearchPagination');
    if (!paginationEl) return;

    const total = dashSearchTotal || 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    if (totalPages <= 1) {
        paginationEl.innerHTML = `<span style="color:var(--gray);font-size:.8rem">${total} results</span>`;
        return;
    }
    let html = `<span style="color:var(--gray);font-size:.8rem;margin-right:.5rem">${total.toLocaleString()} results</span>`;
    html += `<button class="page-btn" onclick="dashGoSearchPage(1)" ${dashCurrentSearchPage===1?'disabled':''}>«</button>`;
    html += `<button class="page-btn" onclick="dashGoSearchPage(${dashCurrentSearchPage-1})" ${dashCurrentSearchPage===1?'disabled':''}>‹</button>`;
    const start = Math.max(1, dashCurrentSearchPage - 2), end = Math.min(totalPages, dashCurrentSearchPage + 2);
    for (let i = start; i <= end; i++) html += `<button class="page-btn ${i===dashCurrentSearchPage?'active':''}" onclick="dashGoSearchPage(${i})">${i}</button>`;
    html += `<button class="page-btn" onclick="dashGoSearchPage(${dashCurrentSearchPage+1})" ${dashCurrentSearchPage===totalPages?'disabled':''}>›</button>`;
    html += `<button class="page-btn" onclick="dashGoSearchPage(${totalPages})" ${dashCurrentSearchPage===totalPages?'disabled':''}>»</button>`;
    paginationEl.innerHTML = html;
}

function dashGoSearchPage(p) {
    if (dashSearchMode === 'supabase') {
        _dashFetchPage(p);
    } else {
        dashCurrentSearchPage = p;
        dashRenderSearchResults();
    }
}

async function dashExportSearchCSV() {
    let rowsForExport = [];
    if (dashSearchMode === 'supabase' && _dashCanUseSupabase()) {
        // Bulk fetch all matching rows for export
        try {
            showToast('Exporting — fetching all matches…', 'info');
            const t = _dashResolveTier();
            const filters = Object.assign({}, dashSearchFilters, { all: true, maxRows: 50000 });
            const data = await window.crashLensClient.getCrashes(t.tier, t.value, filters);
            rowsForExport = data.rows || [];
        } catch (e) {
            console.warn('[Phase4] Bulk export fetch failed, using current page:', e && e.message);
            rowsForExport = dashSearchResults;
        }
    } else {
        rowsForExport = dashSearchResults;
    }
    if (!rowsForExport.length) { alert('No results'); return; }
    const headers = ['Date','Time','Severity','Route','Node','Collision Type','Weather','Light','Ped','Bike','Alcohol','Speed'];
    const rows = rowsForExport.map(r => [r[COL.DATE], r[COL.TIME], r[COL.SEVERITY], r[COL.ROUTE], r[COL.NODE], r[COL.COLLISION], r[COL.WEATHER], r[COL.LIGHT], r[COL.PED], r[COL.BIKE], r[COL.ALCOHOL], r[COL.SPEED]]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c||''}"`).join(',')).join('\n');
    downloadFile(csv, 'dashboard_crash_search_results.csv', 'text/csv');
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.dashboard = CL.dashboard || {};
  CL.dashboard.search = CL.dashboard.search || {};
  window._dashCanUseSupabase = _dashCanUseSupabase; CL.dashboard.search._dashCanUseSupabase = _dashCanUseSupabase;
  window.initDashboardSearch = initDashboardSearch; CL.dashboard.search.initDashboardSearch = initDashboardSearch;
  window.dashSearchCrashes = dashSearchCrashes; CL.dashboard.search.dashSearchCrashes = dashSearchCrashes;
  window._dashFetchPage = _dashFetchPage; CL.dashboard.search._dashFetchPage = _dashFetchPage;
  window.dashClearSearch = dashClearSearch; CL.dashboard.search.dashClearSearch = dashClearSearch;
  window.dashRenderSearchResults = dashRenderSearchResults; CL.dashboard.search.dashRenderSearchResults = dashRenderSearchResults;
  window.dashRenderSearchPagination = dashRenderSearchPagination; CL.dashboard.search.dashRenderSearchPagination = dashRenderSearchPagination;
  window.dashGoSearchPage = dashGoSearchPage; CL.dashboard.search.dashGoSearchPage = dashGoSearchPage;
  window.dashExportSearchCSV = dashExportSearchCSV; CL.dashboard.search.dashExportSearchCSV = dashExportSearchCSV;
  CL._registerModule('dashboard/dashboard-search');
})();
