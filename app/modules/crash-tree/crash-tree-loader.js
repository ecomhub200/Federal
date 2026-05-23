/**
 * CL crashTree.loader module
 *
 * Extracted from app/index.html (name-anchored, live L83989-L84569)
 * on 2026-05-23. Round X modular refactor — CC 200 Pass B.
 * Responsibility: tab init, tree-type switch, severity/date filter wiring,
 * filtered-rows helpers, refresh.
 *
 * Moved fns (13): initCrashTreeTab, initCrashTreeFromMatview,
 *   setCrashTreeType, toggleCrashTreeSeverity, updateCrashTreeSeverity,
 *   setTreeSeverityPreset, applyCrashTreeDateFilter, setCrashTreeDatePreset,
 *   clearCrashTreeDateFilter, updateCrashTreeDateFilterStatus,
 *   getCrashTreeFilteredCrashes, getCrashTreeDateOnlyFilteredCrashes,
 *   refreshCrashTreeAnalysis.
 *
 * Shared globals (crashTreeState L22185 const, crashState, COL,
 * jurisdictionContext, isIntersection, isYes, showToast, showTab,
 * appConfig, _resolveActiveState) are NOT moved and NOT mirrored — they
 * resolve via the shared classic-script global lexical environment
 * (cmfState precedent — see cmf/cmf-search.js).
 *
 * Public API (back-compat dual exposure): window.<fn> + CL.crashTree.<fn>
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L83989-L84569) ───
// Initialize Crash Tree tab
function initCrashTreeTab() {
    const _ctTier = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext?.viewTier) || 'county';

    // Supabase-first for ALL tiers: try matview path first.
    // Falls back to sampleRows only if matview fails or data-client is unavailable.
    var _dcCT = (window.CL && CL.data) ? CL.data.client : null;
    if (_dcCT && typeof _dcCT.getCrashTree === 'function') {
        initCrashTreeFromMatview(_ctTier);
        return;
    }

    if (!crashState.loaded || !crashState.sampleRows?.length) {
        console.log('[CrashTree] No crash data loaded');
        document.getElementById('crashTreePlaceholder').style.display = 'block';
        document.getElementById('crashTreeViz').style.display = 'none';
        return;
    }

    console.log('[CrashTree] Initializing with', crashState.sampleRows.length, 'records');
    crashTreeState.loaded = true;

    // Build tree data
    buildCrashTreeData();

    // Render tree visualization
    renderCrashTree();

    // Update statistics
    updateCrashTreeStats();

    // Update date filter status display
    updateCrashTreeDateFilterStatus();

    // AUTO-UX: Automatically identify focus and analyze risk factors
    // This eliminates the need for users to click multiple buttons
    setTimeout(() => {
        autoExpandDominantPath();
        analyzeRiskFactors();

        // Also build and show the secondary tree analysis
        buildSecondaryTreeAnalysis();
    }, 100);

    // Show Over-Represented Segments panel if Facility tree is active (default)
    const segmentPanel = document.getElementById('facilitySegmentAnalysis');
    if (segmentPanel && crashTreeState.treeType === 'facility') {
        segmentPanel.style.display = 'block';
    }
}

// Aggregate-tier path: build the crash tree from mv_crash_tree.
// Used when sampleRows is unavailable (state/region/MPO/planning_district).
async function initCrashTreeFromMatview(tier) {
    const dc = (window.CL && CL.data) ? CL.data.client : null;
    const placeholder = document.getElementById('crashTreePlaceholder');
    const viz = document.getElementById('crashTreeViz');
    if (!dc) {
        console.warn('[CrashTree] No data client available');
        if (placeholder) placeholder.style.display = 'block';
        if (viz) viz.style.display = 'none';
        return;
    }

    // Resolve tier value via supabase-bridge (matches city → county semantics already)
    let tierResolved = { tier: tier, value: null };
    try {
        if (CL.data.supabaseBridge && typeof CL.data.supabaseBridge.resolveTier === 'function') {
            tierResolved = CL.data.supabaseBridge.resolveTier();
        }
    } catch (e) { /* fall through */ }

    const treeType = crashTreeState.treeType || 'facility';

    try {
        const data = await dc.getCrashTree(tierResolved.tier, tierResolved.value, { treeType });
        if (!data || data.length === 0) {
            console.log('[CrashTree] mv_crash_tree returned no rows for', tierResolved.tier, tierResolved.value, treeType);
            if (placeholder) placeholder.style.display = 'block';
            if (viz) viz.style.display = 'none';
            return;
        }

        console.log('[CrashTree] Loaded', data.length, 'rows from mv_crash_tree (' + treeType + ')');

        // Aggregate matview rows into the {id, name, total, pct, K, A, B, C, O, children:[]}
        // node tree shape that renderCrashTree() expects.
        const idSafe = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unknown';

        const rootStats = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        const l1Map = new Map(); // l1 → { stats, l2Map: Map(l2 → { stats, l3Map: Map(l3 → stats) }) }

        for (const r of data) {
            const total = r.total || 0;
            const k = r.k || 0, a = r.a || 0, b = r.b || 0, c = r.c || 0, o = r.o || 0;
            rootStats.total += total;
            rootStats.K += k; rootStats.A += a; rootStats.B += b; rootStats.C += c; rootStats.O += o;

            const l1 = (r.level1 || '').trim() || 'Unknown';
            const l2 = (r.level2 || '').trim();
            const l3 = (r.level3 || '').trim();

            if (!l1Map.has(l1)) l1Map.set(l1, { stats: { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 }, l2Map: new Map() });
            const l1Entry = l1Map.get(l1);
            l1Entry.stats.total += total;
            l1Entry.stats.K += k; l1Entry.stats.A += a; l1Entry.stats.B += b; l1Entry.stats.C += c; l1Entry.stats.O += o;

            if (l2) {
                if (!l1Entry.l2Map.has(l2)) l1Entry.l2Map.set(l2, { stats: { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 }, l3Map: new Map() });
                const l2Entry = l1Entry.l2Map.get(l2);
                l2Entry.stats.total += total;
                l2Entry.stats.K += k; l2Entry.stats.A += a; l2Entry.stats.B += b; l2Entry.stats.C += c; l2Entry.stats.O += o;

                if (l3) {
                    if (!l2Entry.l3Map.has(l3)) l2Entry.l3Map.set(l3, { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 });
                    const l3Entry = l2Entry.l3Map.get(l3);
                    l3Entry.total += total;
                    l3Entry.K += k; l3Entry.A += a; l3Entry.B += b; l3Entry.C += c; l3Entry.O += o;
                }
            }
        }

        const buildNode = (id, name, stats, children) => {
            const k = stats.K || 0, a = stats.A || 0;
            const ka = k + a;
            return {
                id, name,
                total: stats.total, K: stats.K, A: stats.A, B: stats.B, C: stats.C, O: stats.O,
                k: k, a: a, b: stats.B || 0, c: stats.C || 0, o: stats.O || 0,
                ka: ka,
                kaPct: stats.total > 0 ? (ka / stats.total * 100).toFixed(1) + '%' : '0.0%',
                pct: rootStats.total > 0 ? (stats.total / rootStats.total * 100) : 0,
                unfilteredTotal: stats.total,
                unfilteredKA: ka,
                children: children || []
            };
        };

        const l1Children = [];
        for (const [l1Name, l1Entry] of l1Map.entries()) {
            const l1Id = idSafe(l1Name);
            const l2Children = [];
            for (const [l2Name, l2Entry] of l1Entry.l2Map.entries()) {
                const l2Id = `${l1Id}-${idSafe(l2Name)}`;
                const l3Children = [];
                for (const [l3Name, l3Stats] of l2Entry.l3Map.entries()) {
                    l3Children.push(buildNode(`${l2Id}-${idSafe(l3Name)}`, l3Name, l3Stats, []));
                }
                l3Children.sort((a, b) => b.total - a.total);
                l2Children.push(buildNode(l2Id, l2Name, l2Entry.stats, l3Children));
            }
            l2Children.sort((a, b) => b.total - a.total);
            l1Children.push(buildNode(l1Id, l1Name, l1Entry.stats, l2Children));
        }
        l1Children.sort((a, b) => b.total - a.total);

        const rootNode = buildNode('root', 'All Crashes', rootStats, l1Children);

        // §0 (Round 16) — defensive post-order severity walker.
        // Round 15 §0 specified this; the prior accumulator relied on every
        // matview row carrying its own k/a, which is fragile. Walking the tree
        // post-order and summing k/a from children guarantees every non-leaf
        // node reflects real KA — even if the underlying matview ever emits
        // rollup rows with NULL severities, or a future rename drops the
        // per-row severity columns.
        const propagateSeverity = (node) => {
            if (!node) return;
            if (node.children && node.children.length > 0) {
                node.children.forEach(propagateSeverity);
                const ck = node.children.reduce((s, c) => s + (Number(c.k) || 0), 0);
                const ca = node.children.reduce((s, c) => s + (Number(c.a) || 0), 0);
                const cb = node.children.reduce((s, c) => s + (Number(c.b) || 0), 0);
                const cc = node.children.reduce((s, c) => s + (Number(c.c) || 0), 0);
                const co = node.children.reduce((s, c) => s + (Number(c.o) || 0), 0);
                // Prefer child-derived values whenever they are non-zero; this
                // makes the walker robust to leaf rows that lacked k/a.
                if (ck + ca + cb + cc + co > 0 || !((node.k || 0) + (node.a || 0))) {
                    node.k  = ck; node.a = ca;
                    node.b  = cb; node.c = cc; node.o = co;
                    node.K  = ck; node.A = ca;
                    node.B  = cb; node.C = cc; node.O = co;
                    node.ka = ck + ca;
                    node.kaPct = node.total > 0
                        ? (node.ka / node.total * 100).toFixed(1) + '%'
                        : '0.0%';
                    node.unfilteredKA = node.ka;
                }
            }
        };
        propagateSeverity(rootNode);

        crashTreeState.treeData = rootNode;
        crashTreeState.totalCrashes = rootStats.total;
        crashTreeState.totalKA = (rootStats.K || 0) + (rootStats.A || 0);
        crashTreeState.loaded = true;
        crashTreeState.source = 'supabase';

        if (placeholder) placeholder.style.display = 'none';
        if (viz) viz.style.display = 'block';

        renderCrashTree();
        if (typeof updateCrashTreeStats === 'function') updateCrashTreeStats();

        setTimeout(() => {
            if (typeof autoExpandDominantPath === 'function') autoExpandDominantPath();
            if (typeof analyzeRiskFactors === 'function') analyzeRiskFactors();
            if (typeof buildSecondaryTreeAnalysis === 'function') buildSecondaryTreeAnalysis();
        }, 100);

        // Show Over-Represented Segments panel if Facility tree is active
        const segmentPanel = document.getElementById('facilitySegmentAnalysis');
        if (segmentPanel) {
            segmentPanel.style.display = treeType === 'facility' ? 'block' : 'none';
        }
    } catch (e) {
        console.warn('[CrashTree] Matview load failed:', e.message, '— attempting sampleRows fallback');
        if (crashState.loaded && crashState.sampleRows && crashState.sampleRows.length > 0) {
            try {
                buildCrashTreeData();
                crashTreeState.loaded = true;
            } catch (fallbackErr) {
                console.warn('[CrashTree] sampleRows fallback also failed:', fallbackErr.message);
                if (placeholder) placeholder.style.display = 'block';
                if (viz) viz.style.display = 'none';
            }
        } else {
            if (placeholder) placeholder.style.display = 'block';
            if (viz) viz.style.display = 'none';
        }
    }
}

// Set tree type (facility or crashType)
function setCrashTreeType(type) {
    crashTreeState.treeType = type;

    // Update button styles for all three tree types
    const btnFacility = document.getElementById('btnTreeTypeFacility');
    const btnCrash = document.getElementById('btnTreeTypeCrash');
    const btnContributing = document.getElementById('btnTreeTypeContributing');

    // Reset all buttons first
    [btnFacility, btnCrash, btnContributing].forEach(btn => {
        if (btn) {
            btn.classList.remove('active');
            btn.style.borderColor = 'var(--border)';
            btn.style.background = '#fff';
            btn.style.color = 'var(--gray)';
        }
    });

    // Set active button
    const activeBtn = type === 'facility' ? btnFacility :
                      type === 'crashType' ? btnCrash : btnContributing;
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.borderColor = '#059669';
        activeBtn.style.background = '#ecfdf5';
        activeBtn.style.color = '#065f46';
    }

    // Supabase-first: re-fetch from matview with the new tree type at ALL tiers
    var _dcSCT = (window.CL && CL.data) ? CL.data.client : null;
    if (_dcSCT && typeof _dcSCT.getCrashTree === 'function') {
        crashTreeState.expandedNodes = new Set(['root']);
        const _ctTier = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext?.viewTier) || 'county';
        initCrashTreeFromMatview(_ctTier);

        const segmentPanelAgg = document.getElementById('facilitySegmentAnalysis');
        if (segmentPanelAgg) {
            segmentPanelAgg.style.display = type === 'facility' ? 'block' : 'none';
        }
        return;
    }

    // Rebuild tree
    if (crashTreeState.loaded) {
        crashTreeState.expandedNodes = new Set(['root']);
        buildCrashTreeData();
        renderCrashTree();

        // Auto-update analyses when tree type changes
        setTimeout(() => {
            autoExpandDominantPath();
            buildSecondaryTreeAnalysis();
        }, 50);
    }

    // Show/hide Over-Represented Segments panel (FACILITY tree only)
    const segmentPanel = document.getElementById('facilitySegmentAnalysis');
    if (segmentPanel) {
        segmentPanel.style.display = type === 'facility' ? 'block' : 'none';
    }
}

// Toggle severity button in segmented control
function toggleCrashTreeSeverity(btn) {
    const checkbox = btn.querySelector('input[type="checkbox"]');
    if (checkbox) {
        checkbox.checked = !checkbox.checked;
        btn.classList.toggle('active', checkbox.checked);
        btn.setAttribute('aria-pressed', checkbox.checked.toString());
    }
    updateCrashTreeSeverity();
}

// Update severity filter
function updateCrashTreeSeverity() {
    const severities = [];
    if (document.getElementById('ctSevK')?.checked) severities.push('K');
    if (document.getElementById('ctSevA')?.checked) severities.push('A');
    if (document.getElementById('ctSevB')?.checked) severities.push('B');
    if (document.getElementById('ctSevC')?.checked) severities.push('C');
    if (document.getElementById('ctSevO')?.checked) severities.push('O');

    crashTreeState.severityFilter = severities.length > 0 ? severities : ['K', 'A'];

    if (crashTreeState.loaded) {
        buildCrashTreeData();
        renderCrashTree();
        updateCrashTreeStats();

        // Auto-update analysis when severity changes
        setTimeout(() => {
            autoExpandDominantPath();
            analyzeRiskFactors();
            buildSecondaryTreeAnalysis();
        }, 50);
    }
}

// Severity preset helper - updated for segmented control
function setTreeSeverityPreset(preset) {
    const buttons = document.querySelectorAll('.ct-severity-btn');
    const checkboxes = {
        K: document.getElementById('ctSevK'),
        A: document.getElementById('ctSevA'),
        B: document.getElementById('ctSevB'),
        C: document.getElementById('ctSevC'),
        O: document.getElementById('ctSevO')
    };

    const presets = {
        ka: ['K', 'A'],
        all: ['K', 'A', 'B', 'C', 'O']
    };

    const activeSeverities = presets[preset] || presets.ka;

    // Update checkboxes and button states
    buttons.forEach(btn => {
        const sev = btn.dataset.severity;
        const isActive = activeSeverities.includes(sev);
        const checkbox = checkboxes[sev];
        if (checkbox) checkbox.checked = isActive;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive.toString());
    });

    updateCrashTreeSeverity();
}

// ============================================================
// CRASH TREE DATE FILTER FUNCTIONS
// ============================================================

// Apply date filter and rebuild crash tree
function applyCrashTreeDateFilter() {
    const startVal = document.getElementById('ctStartDate')?.value;
    const endVal = document.getElementById('ctEndDate')?.value;

    crashTreeState.dateFilter.startDate = startVal || null;
    crashTreeState.dateFilter.endDate = endVal || null;
    crashTreeState.dateFilter.preset = null; // Custom selection

    // Update preset button states
    document.querySelectorAll('.ct-date-preset').forEach(btn => btn.classList.remove('active'));

    // Update status display
    updateCrashTreeDateFilterStatus();

    // Rebuild tree if loaded
    if (crashTreeState.loaded) {
        buildCrashTreeData();
        renderCrashTree();
        updateCrashTreeStats();

        // Re-run analysis with new date range
        setTimeout(() => {
            autoExpandDominantPath();
            analyzeRiskFactors();
            buildSecondaryTreeAnalysis();
        }, 50);
    }
}

// Set date preset (1, 3, or 5 years)
function setCrashTreeDatePreset(years) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - years);
    startDate.setDate(startDate.getDate() + 1);

    const formatDate = (d) => d.toISOString().split('T')[0];

    document.getElementById('ctStartDate').value = formatDate(startDate);
    document.getElementById('ctEndDate').value = formatDate(endDate);

    crashTreeState.dateFilter.startDate = formatDate(startDate);
    crashTreeState.dateFilter.endDate = formatDate(endDate);
    crashTreeState.dateFilter.preset = years + 'yr';

    // Update button states
    document.querySelectorAll('.ct-date-preset').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    // Update status and rebuild
    updateCrashTreeDateFilterStatus();

    if (crashTreeState.loaded) {
        buildCrashTreeData();
        renderCrashTree();
        updateCrashTreeStats();

        setTimeout(() => {
            autoExpandDominantPath();
            analyzeRiskFactors();
            buildSecondaryTreeAnalysis();
            showToast(`Showing last ${years} year${years > 1 ? 's' : ''} of data`, 'success');
        }, 50);
    }
}

// Clear date filter (show all data)
function clearCrashTreeDateFilter() {
    document.getElementById('ctStartDate').value = '';
    document.getElementById('ctEndDate').value = '';

    crashTreeState.dateFilter.startDate = null;
    crashTreeState.dateFilter.endDate = null;
    crashTreeState.dateFilter.preset = null;

    // Update button states
    document.querySelectorAll('.ct-date-preset').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    updateCrashTreeDateFilterStatus();

    if (crashTreeState.loaded) {
        buildCrashTreeData();
        renderCrashTree();
        updateCrashTreeStats();

        setTimeout(() => {
            autoExpandDominantPath();
            analyzeRiskFactors();
            buildSecondaryTreeAnalysis();
            showToast('Showing all available data', 'info');
        }, 50);
    }
}

// Update date filter status display
function updateCrashTreeDateFilterStatus() {
    const el = document.getElementById('ctDateFilterStatus');
    if (!el) return;

    const start = crashTreeState.dateFilter.startDate;
    const end = crashTreeState.dateFilter.endDate;

    if (!start && !end) {
        el.innerHTML = '<span style="color:#059669;">All dates</span>';
    } else if (crashTreeState.dateFilter.preset) {
        el.innerHTML = `<span style="color:#0369a1;">Last ${crashTreeState.dateFilter.preset.replace('yr', ' year')}${crashTreeState.dateFilter.preset !== '1yr' ? 's' : ''}</span>`;
    } else {
        const formatDisplay = (d) => {
            if (!d) return '...';
            const date = new Date(d);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        };
        el.innerHTML = `<span style="color:#0369a1;">${formatDisplay(start)} - ${formatDisplay(end)}</span>`;
    }

    // Also show crash count
    if (crashTreeState.loaded && crashTreeState.totalCrashes > 0) {
        el.innerHTML += ` <span style="opacity:.7;">(${crashTreeState.totalCrashes.toLocaleString()} crashes)</span>`;
    }
}

// Helper: Get crashes filtered by current severity AND date filters
function getCrashTreeFilteredCrashes() {
    const rows = crashState.sampleRows;
    if (!rows || rows.length === 0) return [];

    const sevFilter = crashTreeState.severityFilter;

    // Parse date filter bounds
    const startDate = crashTreeState.dateFilter.startDate ? new Date(crashTreeState.dateFilter.startDate) : null;
    const endDate = crashTreeState.dateFilter.endDate ? new Date(crashTreeState.dateFilter.endDate) : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    return rows.filter(row => {
        // Severity filter
        const sev = (row[COL.SEVERITY] || '').trim().toUpperCase().charAt(0);
        if (!sevFilter.includes(sev)) return false;

        // Date filter (if active)
        if (startDate || endDate) {
            const crashDateVal = row[COL.DATE];
            if (crashDateVal) {
                let crashDate;
                if (typeof crashDateVal === 'number' || !isNaN(crashDateVal)) {
                    crashDate = new Date(parseInt(crashDateVal));
                } else {
                    crashDate = new Date(crashDateVal);
                }
                if (!isNaN(crashDate.getTime())) {
                    if (startDate && crashDate < startDate) return false;
                    if (endDate && crashDate > endDate) return false;
                }
            }
        }
        return true;
    });
}

// Helper: Get crashes filtered by date only (NO severity filter)
// Used for FHWA overrepresentation analysis which requires ALL crashes as baseline
function getCrashTreeDateOnlyFilteredCrashes() {
    const rows = crashState.sampleRows;
    if (!rows || rows.length === 0) return [];

    // Parse date filter bounds
    const startDate = crashTreeState.dateFilter.startDate ? new Date(crashTreeState.dateFilter.startDate) : null;
    const endDate = crashTreeState.dateFilter.endDate ? new Date(crashTreeState.dateFilter.endDate) : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    // If no date filter, return all rows
    if (!startDate && !endDate) return rows;

    return rows.filter(row => {
        const crashDateVal = row[COL.DATE];
        if (crashDateVal) {
            let crashDate;
            if (typeof crashDateVal === 'number' || !isNaN(crashDateVal)) {
                crashDate = new Date(parseInt(crashDateVal));
            } else {
                crashDate = new Date(crashDateVal);
            }
            if (!isNaN(crashDate.getTime())) {
                if (startDate && crashDate < startDate) return false;
                if (endDate && crashDate > endDate) return false;
            }
        }
        return true;
    });
}

// Refresh crash tree analysis
function refreshCrashTreeAnalysis() {
    if (!crashTreeState.loaded) return;

    // Reset states
    crashTreeState.dominantPath = [];
    crashTreeState.focusCrashType = null;
    crashTreeState.focusFacility = null;

    // Rebuild and re-analyze
    buildCrashTreeData();
    renderCrashTree();
    updateCrashTreeStats();

    setTimeout(() => {
        autoExpandDominantPath();
        analyzeRiskFactors();
        buildSecondaryTreeAnalysis();
        showToast('Analysis refreshed', 'success');
    }, 50);
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.crashTree = CL.crashTree || {};
  window.initCrashTreeTab = initCrashTreeTab; CL.crashTree.initCrashTreeTab = initCrashTreeTab;
  window.initCrashTreeFromMatview = initCrashTreeFromMatview; CL.crashTree.initCrashTreeFromMatview = initCrashTreeFromMatview;
  window.setCrashTreeType = setCrashTreeType; CL.crashTree.setCrashTreeType = setCrashTreeType;
  window.toggleCrashTreeSeverity = toggleCrashTreeSeverity; CL.crashTree.toggleCrashTreeSeverity = toggleCrashTreeSeverity;
  window.updateCrashTreeSeverity = updateCrashTreeSeverity; CL.crashTree.updateCrashTreeSeverity = updateCrashTreeSeverity;
  window.setTreeSeverityPreset = setTreeSeverityPreset; CL.crashTree.setTreeSeverityPreset = setTreeSeverityPreset;
  window.applyCrashTreeDateFilter = applyCrashTreeDateFilter; CL.crashTree.applyCrashTreeDateFilter = applyCrashTreeDateFilter;
  window.setCrashTreeDatePreset = setCrashTreeDatePreset; CL.crashTree.setCrashTreeDatePreset = setCrashTreeDatePreset;
  window.clearCrashTreeDateFilter = clearCrashTreeDateFilter; CL.crashTree.clearCrashTreeDateFilter = clearCrashTreeDateFilter;
  window.updateCrashTreeDateFilterStatus = updateCrashTreeDateFilterStatus; CL.crashTree.updateCrashTreeDateFilterStatus = updateCrashTreeDateFilterStatus;
  window.getCrashTreeFilteredCrashes = getCrashTreeFilteredCrashes; CL.crashTree.getCrashTreeFilteredCrashes = getCrashTreeFilteredCrashes;
  window.getCrashTreeDateOnlyFilteredCrashes = getCrashTreeDateOnlyFilteredCrashes; CL.crashTree.getCrashTreeDateOnlyFilteredCrashes = getCrashTreeDateOnlyFilteredCrashes;
  window.refreshCrashTreeAnalysis = refreshCrashTreeAnalysis; CL.crashTree.refreshCrashTreeAnalysis = refreshCrashTreeAnalysis;
  CL._registerModule('crash-tree/loader');
})();
