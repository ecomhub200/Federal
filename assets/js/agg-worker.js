/**
 * Dashboard summary aggregator — Web Worker (Phase 6 §6.7)
 *
 * Mirrors aggregate(rows) from app/modules/data/supabase-bridge.js so the
 * 100K-row dashboard_summary aggregation runs off the main thread. Frees
 * up ~150–300ms on Sussex / state-tier loads where the bridge would
 * otherwise block paint.
 *
 * Protocol:
 *   main → worker:  { id, rows }
 *   worker → main:  { id, agg } | { id, error }
 *
 * Each message is independent — no state is retained between calls.
 *
 * Bucket counts and severity codes match the matview schema exactly:
 *   crash_severity ∈ {K, A, B, C, O}
 *   crash_year is a YYYY integer
 *   functional_class / collision_type are nullable strings
 */
'use strict';

function aggregate(rows) {
    var agg = {
        total: 0,
        bySeverity: { K: 0, A: 0, B: 0, C: 0, O: 0 },
        byYear: {},
        byFuncClass: {},
        byCollision: {},
        safety: {
            ped: 0, bike: 0, speed: 0, alcohol: 0, night: 0, animal: 0,
            fatals: 0, seriousInjured: 0, totalInjured: 0
        }
    };
    if (!Array.isArray(rows)) return agg;
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var c = parseInt(r.crash_count, 10) || 0;
        var s = ((r.crash_severity || '').toUpperCase()).charAt(0);
        var y = parseInt(r.crash_year, 10) || 0;
        var fc = r.functional_class || '';
        var coll = r.collision_type || '';

        agg.total += c;
        if (Object.prototype.hasOwnProperty.call(agg.bySeverity, s)) agg.bySeverity[s] += c;

        if (y) {
            if (!agg.byYear[y]) agg.byYear[y] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0, speed: 0, night: 0 };
            var yd = agg.byYear[y];
            yd.total += c;
            if (Object.prototype.hasOwnProperty.call(yd, s)) yd[s] += c;
            yd.ped   += parseInt(r.ped_crashes,   10) || 0;
            yd.bike  += parseInt(r.bike_crashes,  10) || 0;
            yd.speed += parseInt(r.speed_crashes, 10) || 0;
            yd.night += parseInt(r.night_crashes, 10) || 0;
        }

        if (fc) {
            if (!agg.byFuncClass[fc]) agg.byFuncClass[fc] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
            var fd = agg.byFuncClass[fc];
            fd.total += c;
            if (Object.prototype.hasOwnProperty.call(fd, s)) fd[s] += c;
        }

        if (coll) agg.byCollision[coll] = (agg.byCollision[coll] || 0) + c;

        agg.safety.ped            += parseInt(r.ped_crashes,      10) || 0;
        agg.safety.bike           += parseInt(r.bike_crashes,     10) || 0;
        agg.safety.speed          += parseInt(r.speed_crashes,    10) || 0;
        agg.safety.alcohol        += parseInt(r.alcohol_crashes,  10) || 0;
        agg.safety.night          += parseInt(r.night_crashes,    10) || 0;
        agg.safety.animal         += parseInt(r.animal_crashes,   10) || 0;
        agg.safety.fatals         += parseInt(r.fatals,           10) || 0;
        agg.safety.seriousInjured += parseInt(r.serious_injuries, 10) || 0;
        agg.safety.totalInjured   += parseInt(r.total_injured,    10) || 0;
    }
    return agg;
}

// Expose for Node test harnesses.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { aggregate: aggregate };
}

// Web Worker entry point. Guarded so this file also loads cleanly under
// jsdom / Node test runners that don't define `self`.
if (typeof self !== 'undefined' && typeof self.addEventListener === 'function') {
    self.addEventListener('message', function (e) {
        var msg = e.data || {};
        try {
            var result = aggregate(msg.rows);
            self.postMessage({ id: msg.id, agg: result });
        } catch (err) {
            self.postMessage({ id: msg.id, error: (err && err.message) || String(err) });
        }
    });
}
