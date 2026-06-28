// CL.analysis.orchestrator — Analysis tab orchestrator (updateAnalysis +
// switchAnalysisSubtab). Verbatim lift from app/index.html L51334-L51477.
// CC 204 Pass B. Behavior-identical.
(function () {
    'use strict';
    window.CL = window.CL || {};
    CL.analysis = CL.analysis || {};
    CL.analysis.orchestrator = CL.analysis.orchestrator || {};

    // ============================================================
    // ANALYSIS TAB
    // ============================================================
    function updateAnalysis() {
        // Bug 4 fix — gate also accepts Supabase-matview path so the tab populates
        // at aggregate tiers (and rolled-up county tier) where the R2 sampleRows
        // pipeline is skipped and crashState.loaded never flips true.
        var _dcReady = (window.CL && CL.data && CL.data.client &&
                        typeof CL.data.client.getAnalysisBreakdown === 'function');
        if (!crashState.loaded && !_dcReady) return;
        // Bug 17 — at aggregate tiers (or county-rolled-up-to-PD), default to the
        // new Crash Analysis sub-tab (which renders from mv_analysis_summary) so
        // engineers see real data on first visit. Infrastructure Assets requires
        // row-level / city-tier data, so keep that as the default at city tier.
        if (!currentAnalysisSubtab) {
            var tr = (window.CL && CL.data && CL.data.supabaseBridge &&
                      typeof CL.data.supabaseBridge.resolveTier === 'function')
                      ? CL.data.supabaseBridge.resolveTier() : null;
            var isAggregate = tr && (tr.tier === 'state' || tr.tier === 'region' ||
                                      tr.tier === 'planning_district' || tr.tier === 'mpo' ||
                                      tr.rolledUpFrom === 'county');
            switchAnalysisSubtab(isAggregate ? 'crashanalysis' : 'infrastructure');
        }
    }

    // ============================================================
    // ANALYSIS TAB NAVIGATION
    // ============================================================

    // Track current analysis subtab for cleanup on tab switch
    let currentAnalysisSubtab = null;

    // Sub-tab Navigation
    function switchAnalysisSubtab(subtab) {
        // Cleanup when leaving school/transit subtabs (unload layers per user requirement)
        if (currentAnalysisSubtab && currentAnalysisSubtab !== subtab) {
            if (currentAnalysisSubtab === 'schools') {
                schoolTabClearAllSchools();
                console.log('[Analysis] Cleared school layers on tab leave');
            } else if (currentAnalysisSubtab === 'transit') {
                transitTabClearAllStops();
                console.log('[Analysis] Cleared transit layers on tab leave');
            }
        }

        // Update current subtab tracker
        currentAnalysisSubtab = subtab;

        document.querySelectorAll('.analysis-subtab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.subtab === subtab);
        });
        document.querySelectorAll('.analysis-subtab-content').forEach(content => {
            content.style.display = 'none';
        });
        const targetContent = document.getElementById('analysis-' + subtab);
        if (targetContent) targetContent.style.display = 'block';

        // Initialize and soft-activate layers for school/transit subtabs
        if (subtab === 'crashanalysis') {
            // Bug 17 — render the four crash-analysis charts from mv_analysis_summary.
            // No row-level dependency: works at every aggregate tier.
            (async () => {
                try {
                    const dc = window.crashLensClient;
                    const tr = window.CL && CL.data && CL.data.supabaseBridge
                               && typeof CL.data.supabaseBridge.resolveTier === 'function'
                               ? CL.data.supabaseBridge.resolveTier() : null;
                    if (!dc || !tr) return;
                    // Road Type Filter — pass the active spec so the four charts
                    // honor DOT/City/Non-DOT/All Roads, and fold it into the cache
                    // key so a road-type switch doesn't serve a stale all-roads
                    // result (mirrors hotspots-tab-core.js).
                    const _rtSpec = (CL.data.supabaseBridge && typeof CL.data.supabaseBridge.roadTypeSpec === 'function')
                        ? (CL.data.supabaseBridge.roadTypeSpec() || {}) : {};
                    const data = await CL.data.cachedMatview('mv_analysis_summary', tr.tier, tr.value,
                        () => dc.getAnalysisBreakdown(tr.tier, tr.value, _rtSpec),
                        _rtSpec);
                    if (!data) return;
                    if (typeof createChart !== 'function') return;
                    // Round 15 §12.6 — wrap each chart in paintWhenVisible so a 0×0
                    // canvas (sub-tab not yet expanded) doesn't produce a permanently
                    // blank Chart.js canvas.
                    const _paint = (typeof paintWhenVisible === 'function')
                        ? paintWhenVisible
                        : (id, fn) => fn();
                    // byYear → line
                    const years = Object.entries(data.byYear || {}).sort((a, b) => Number(a[0]) - Number(b[0]));
                    _paint('anaChartYear', () => createChart('anaChartYear', 'line', {
                        labels: years.map(y => y[0]),
                        datasets: [{ label: 'Crashes', data: years.map(y => y[1].total || 0),
                                     borderColor: '#1e40af', backgroundColor: 'rgba(30,64,175,0.1)',
                                     fill: true, tension: 0.2 }]
                    }));
                    // byMonth → bar
                    const monthNames = ['', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                    const months = Object.entries(data.byMonth || {}).sort((a, b) => Number(a[0]) - Number(b[0]));
                    _paint('anaChartMonth', () => createChart('anaChartMonth', 'bar', {
                        labels: months.map(m => monthNames[Number(m[0])] || m[0]),
                        datasets: [{ label: 'Crashes', data: months.map(m => m[1].total || 0),
                                     backgroundColor: '#1e40af' }]
                    }));
                    // bySeverity → doughnut (data-client returns flat counts: {K, A, B, C, O})
                    const sev = data.bySeverity || {};
                    _paint('anaChartSeverity', () => createChart('anaChartSeverity', 'doughnut', {
                        labels: ['K','A','B','C','O'],
                        datasets: [{ data: ['K','A','B','C','O'].map(k => Number(sev[k]) || 0),
                                     backgroundColor: ['#dc2626','#f59e0b','#fde047','#3b82f6','#94a3b8'] }]
                    }));
                    // byCollision (top 8) → horizontal bar (data-client returns flat counts)
                    const collisions = Object.entries(data.byCollision || {})
                        .sort((a, b) => Number(b[1]) - Number(a[1]))
                        .slice(0, 8);
                    _paint('anaChartCollision', () => createChart('anaChartCollision', 'bar', {
                        labels: collisions.map(c => String(c[0]).substring(0, 24)),
                        datasets: [{ label: 'Crashes', data: collisions.map(c => Number(c[1]) || 0),
                                     backgroundColor: '#7c3aed' }]
                    }, { indexAxis: 'y' }));
                    console.log('[Analysis] Crash analysis charts rendered from mv_analysis_summary');
                } catch (e) {
                    console.warn('[Analysis] Crash analysis render failed:', e && e.message);
                }
            })();
        } else if (subtab === 'schools') {
            initSchoolSafetyTab();
            softActivateSchoolLayer();
        } else if (subtab === 'transit') {
            initTransitSafetyTab();
            softActivateTransitLayer();
        } else if (subtab === 'trafficinventory') {
            // Lazy-load iframe on first visit (keeps app fast until user needs it)
            const frame = document.getElementById('trafficInventoryFrame');
            if (frame && frame.src === 'about:blank') {
                frame.src = 'traffic-inventory.html';
                console.log('[Analysis] Traffic Inventory iframe loaded');
            }
        } else if (subtab === 'inventorymanager') {
            // Lazy-load Inventory Manager iframe on first visit
            const frame = document.getElementById('inventoryManagerFrame');
            if (frame && frame.src === 'about:blank') {
                frame.src = 'inventory-manager.html';
                console.log('[Analysis] Inventory Manager iframe loaded');
            }
        } else if (subtab === 'assetdeficiency') {
            // Lazy-load Asset Deficiency iframe on first visit
            const frame = document.getElementById('assetDeficiencyFrame');
            if (frame && frame.src === 'about:blank') {
                frame.src = 'asset-deficiency.html';
                console.log('[Analysis] Asset Deficiency iframe loaded');
            }
        }
    }

    // Dual-expose: HTML onclick= (5 .analysis-subtab buttons) +
    // app/tab-dispatcher.js:250 both read globals; modules read
    // CL.analysis.orchestrator.*.
    window.updateAnalysis = updateAnalysis;
    window.switchAnalysisSubtab = switchAnalysisSubtab;
    CL.analysis.orchestrator.updateAnalysis = updateAnalysis;
    CL.analysis.orchestrator.switchAnalysisSubtab = switchAnalysisSubtab;

    if (typeof CL._registerModule === 'function') {
        CL._registerModule('analysis/orchestrator');
    }
})();
