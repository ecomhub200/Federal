// assets/js/chart-registry.js — Round 18
// Centralized Chart.js instance lifecycle manager. Destroys any existing
// instance bound to a canvas before creating a new one, preventing the
// "Canvas is already in use" runtime error when tabs/subtabs re-render.
(function (global) {
    'use strict';

    const _registry = new Map();   // canvasId → Chart instance

    function create(canvasId, config) {
        // Destroy any existing instance before creating a new one
        if (_registry.has(canvasId)) {
            try { _registry.get(canvasId).destroy(); }
            catch (e) { console.warn('[ChartRegistry] destroy failed for ' + canvasId + ':', e && e.message); }
            _registry.delete(canvasId);
        }
        // Also guard against any Chart.js-owned instance attached to a canvas
        // we don't yet track (e.g. created before ChartRegistry existed).
        try {
            if (typeof Chart !== 'undefined' && typeof Chart.getChart === 'function') {
                const existing = Chart.getChart(canvasId);
                if (existing) {
                    try { existing.destroy(); } catch (e) { /* ignore */ }
                }
            }
        } catch (e) { /* ignore */ }
        const el = document.getElementById(canvasId);
        if (!el) {
            console.warn('[ChartRegistry] canvas not found:', canvasId);
            return null;
        }
        const ctx = el.getContext('2d');
        const chart = new Chart(ctx, config);
        _registry.set(canvasId, chart);
        return chart;
    }

    function destroy(canvasId) {
        if (_registry.has(canvasId)) {
            try { _registry.get(canvasId).destroy(); } catch (e) { /* ignore */ }
            _registry.delete(canvasId);
        }
    }

    function destroyAll() { _registry.forEach((c, id) => destroy(id)); }
    function get(canvasId) { return _registry.get(canvasId); }
    function has(canvasId) { return _registry.has(canvasId); }

    global.ChartRegistry = { create, destroy, destroyAll, get, has };

    // ---------------------------------------------------------------
    // Round 18 §6 — global Chart construction guard.
    // The codebase has ~80 raw `new Chart(ctx, ...)` callsites. Rather
    // than rewrite each one, install a once-only constructor wrapper
    // that destroys any prior instance attached to the same canvas
    // before delegating to the original constructor. This kills
    // "Canvas is already in use" errors (audit F017) without
    // touching the existing callsites.
    // ---------------------------------------------------------------
    function _installChartGuard() {
        if (typeof Chart === 'undefined') return;
        if (Chart.__round18Wrapped) return;
        const _OrigChart = Chart;
        function _resolveCanvas(arg) {
            if (!arg) return null;
            if (typeof arg === 'string') return document.getElementById(arg);
            if (typeof HTMLCanvasElement !== 'undefined' && arg instanceof HTMLCanvasElement) return arg;
            // CanvasRenderingContext2D
            if (arg.canvas && typeof HTMLCanvasElement !== 'undefined' && arg.canvas instanceof HTMLCanvasElement) return arg.canvas;
            return null;
        }
        function GuardedChart(ctxOrCanvas, config) {
            try {
                const canvas = _resolveCanvas(ctxOrCanvas);
                if (canvas && typeof _OrigChart.getChart === 'function') {
                    const existing = _OrigChart.getChart(canvas);
                    if (existing) {
                        try { existing.destroy(); } catch (e) { /* ignore */ }
                    }
                }
            } catch (e) { /* never block instantiation */ }
            return new _OrigChart(ctxOrCanvas, config);
        }
        // Preserve static API (Chart.register, Chart.getChart, etc.)
        GuardedChart.prototype = _OrigChart.prototype;
        Object.setPrototypeOf(GuardedChart, _OrigChart);
        for (const k of Object.keys(_OrigChart)) {
            try { GuardedChart[k] = _OrigChart[k]; } catch (e) { /* ignore */ }
        }
        GuardedChart.__round18Wrapped = true;
        global.Chart = GuardedChart;
        console.log('[ChartRegistry] Chart constructor guarded — canvas-in-use errors now suppressed.');
    }
    if (typeof Chart !== 'undefined') {
        _installChartGuard();
    } else {
        // Chart.js loads from CDN; the script tag is right before us, so it
        // should already be present, but fall back to DOMContentLoaded.
        document.addEventListener('DOMContentLoaded', _installChartGuard);
    }
})(window);
