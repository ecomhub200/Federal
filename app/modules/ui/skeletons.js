/**
 * Skeleton screen helpers (Round 9 — Fix 3).
 *
 * Cuts perceived TTI by showing shimmer placeholders inside KPI cards and
 * over chart canvases until real data arrives. The shimmer is purely visual
 * — no behavior change. KPI skeletons are auto-replaced when paint code
 * does `el.textContent = '...'` because the skeleton is a child span.
 *
 * Public API:
 *   CL.ui.skeletons.showKpis()                  // inject into all .kpi-value
 *   CL.ui.skeletons.hideKpis()                  // strip if any remain
 *   CL.ui.skeletons.wrapCharts(['chartYoY',...])// add .chart-skel-wrap shimmer
 *   CL.ui.skeletons.markChartPainted(canvasId)  // clear shimmer on a single chart
 */
window.CL = window.CL || {};
CL.ui = CL.ui || {};

(function () {
    'use strict';

    function showKpis(root) {
        try {
            var scope = root || document;
            var nodes = scope.querySelectorAll('.kpi-value');
            for (var i = 0; i < nodes.length; i++) {
                var el = nodes[i];
                // Don't overwrite cards that already have non-zero text content.
                var txt = (el.textContent || '').trim();
                if (txt && txt !== '0' && txt !== '—' && txt !== '-') continue;
                if (el.querySelector('.kpi-skel')) continue;
                el.innerHTML = '<span class="kpi-skel" aria-hidden="true"></span>';
            }
        } catch (e) { /* non-fatal */ }
    }

    function hideKpis(root) {
        try {
            var scope = root || document;
            var nodes = scope.querySelectorAll('.kpi-value .kpi-skel');
            for (var i = 0; i < nodes.length; i++) {
                var skel = nodes[i];
                var parent = skel.parentNode;
                if (parent) parent.removeChild(skel);
            }
        } catch (e) { /* non-fatal */ }
    }

    function wrapCharts(canvasIds) {
        try {
            (canvasIds || []).forEach(function (id) {
                var c = document.getElementById(id);
                if (!c) return;
                var parent = c.parentNode;
                if (!parent) return;
                if (parent.classList && parent.classList.contains('chart-skel-wrap')) return;
                // Wrap the canvas in a div.chart-skel-wrap if not already wrapped.
                var wrap = document.createElement('div');
                wrap.className = 'chart-skel-wrap';
                parent.insertBefore(wrap, c);
                wrap.appendChild(c);
            });
        } catch (e) { /* non-fatal */ }
    }

    function markChartPainted(canvasId) {
        try {
            var c = document.getElementById(canvasId);
            if (!c) return;
            var p = c.parentNode;
            if (p && p.classList && p.classList.contains('chart-skel-wrap')) {
                p.classList.add('is-painted');
            }
        } catch (e) { /* non-fatal */ }
    }

    CL.ui.skeletons = {
        showKpis: showKpis,
        hideKpis: hideKpis,
        wrapCharts: wrapCharts,
        markChartPainted: markChartPainted
    };

    if (typeof CL._registerModule === 'function') {
        CL._registerModule('ui/skeletons');
    }
})();
