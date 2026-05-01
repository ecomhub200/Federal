/**
 * agg-worker.js — off-main-thread Web Worker mirror of supabase-bridge.js
 * aggregate(rows). Same function body; run here so the dashboard paint
 * doesn't block the main thread on state-tier (50K-row) queries.
 *
 * Contract:
 *   self.postMessage(agg) — the same {total, bySeverity, byYear, byFuncClass,
 *                          byCollision, safety} object the bridge already paints.
 *
 * Failures (out-of-memory, syntax error in the row stream) propagate as
 * 'error' events; the bridge falls back to in-thread aggregate() on first
 * error and never tries the worker again that session.
 *
 * Keep this file in sync with the aggregate() function in
 * app/modules/data/supabase-bridge.js. There is no shared module — workers
 * have their own scope and cannot import the bridge's IIFE.
 */

self.onmessage = function (e) {
    var rows = (e && e.data && e.data.rows) || [];

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

    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var c = parseInt(r.crash_count, 10) || 0;
        var s = ((r.crash_severity || '').toUpperCase()).charAt(0);
        var y = parseInt(r.crash_year, 10) || 0;
        var fc = r.functional_class || '';
        var coll = r.collision_type || '';

        agg.total += c;
        if (agg.bySeverity.hasOwnProperty(s)) agg.bySeverity[s] += c;

        if (y) {
            if (!agg.byYear[y]) {
                agg.byYear[y] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0, speed: 0, night: 0 };
            }
            var yd = agg.byYear[y];
            yd.total += c;
            if (yd.hasOwnProperty(s)) yd[s] += c;
            yd.ped   += parseInt(r.ped_crashes,   10) || 0;
            yd.bike  += parseInt(r.bike_crashes,  10) || 0;
            yd.speed += parseInt(r.speed_crashes, 10) || 0;
            yd.night += parseInt(r.night_crashes, 10) || 0;
        }

        if (fc) {
            if (!agg.byFuncClass[fc]) {
                agg.byFuncClass[fc] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
            }
            var fd = agg.byFuncClass[fc];
            fd.total += c;
            if (fd.hasOwnProperty(s)) fd[s] += c;
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

    self.postMessage(agg);
};
