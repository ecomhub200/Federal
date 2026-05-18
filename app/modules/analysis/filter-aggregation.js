/**
 * CL analysis.filterAggregation module
 * Extracted from app/index.html on 2026-05-18.
 * Responsibility: getFilteredStats() — date/severity/route/intersection/
 *   DOT-district filtered crash aggregation feeding the Dashboard KPIs.
 * Reads inline globals at runtime: currentFilters, crashState, districtState,
 *   COL, getHour, isYes (shared classic-script global scope — left inline).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START ───

function getFilteredStats() {
    const f = currentFilters;
    const hasFilters = f.startDate || f.endDate || f.route || f.intersection || f.district || f.severity.length !== 5;

    if (!hasFilters) {
        return {
            agg: crashState.aggregates,
            total: crashState.totalRows,
            stats: crashState.aggregates.bySeverity,
            filtered: false
        };
    }

    // Build filtered aggregates
    const agg = {
        bySeverity: { K: 0, A: 0, B: 0, C: 0, O: 0 },
        byYear: {},
        byCollision: {},
        byWeather: {},
        byLight: {},
        byHour: {},
        byDOW: {},
        byMonth: {},
        byFuncClass: {},
        ped: { total: 0, K: 0, A: 0, byYear: {} },
        bike: { total: 0, K: 0, A: 0, byYear: {} },
        speed: { total: 0, K: 0, A: 0, byYear: {} },
        nighttime: { total: 0, K: 0, A: 0, byYear: {} }
    };

    let total = 0;

    crashState.sampleRows.forEach(row => {
        const crashDateStr = row[COL.DATE];
        const sev = (row[COL.SEVERITY] || '').trim().toUpperCase().charAt(0);
        const year = parseInt(row[COL.YEAR]);

        // Date filters - use Date objects for accurate comparison
        // Note: Crash dates are Unix timestamps in milliseconds stored as strings
        if (f.startDate || f.endDate) {
            if (!crashDateStr) return;
            const crashDate = new Date(Number(crashDateStr));
            if (isNaN(crashDate.getTime())) return;
            crashDate.setHours(0, 0, 0, 0);

            if (f.startDate) {
                const start = new Date(f.startDate);
                start.setHours(0, 0, 0, 0);
                if (crashDate < start) return;
            }
            if (f.endDate) {
                const end = new Date(f.endDate);
                end.setHours(23, 59, 59, 999);
                if (crashDate > end) return;
            }
        }

        // Location filter (supports route:XXX or node:XXX format)
        if (f.route) {
            if (f.route.startsWith('route:')) {
                if (row[COL.ROUTE] !== f.route.substring(6)) return;
            } else if (f.route.startsWith('node:')) {
                if (String(row[COL.NODE]) !== f.route.substring(5)) return;
            } else {
                // Legacy format: direct route match
                if (row[COL.ROUTE] !== f.route) return;
            }
        }

        // Intersection type filter
        if (f.intersection && row[COL.INT_TYPE] !== f.intersection) return;

        // District filter - uses districtState.crashAssignments
        if (f.district && districtState.loaded) {
            const crashId = row[COL.ID];
            const assignedDistrict = districtState.crashAssignments.get(crashId);
            if (assignedDistrict !== f.district) return;
        }

        // Severity filter
        if (!f.severity.includes(sev)) return;

        // Count this row
        total++;

        // Severity
        if (agg.bySeverity[sev] !== undefined) agg.bySeverity[sev]++;

        // By Year (with ped, bike, speed, nighttime for YoY trends)
        if (year) {
            if (!agg.byYear[year]) agg.byYear[year] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0, speed: 0, nighttime: 0 };
            agg.byYear[year].total++;
            if (agg.byYear[year][sev] !== undefined) agg.byYear[year][sev]++;
        }

        // Collision type
        const collision = (row[COL.COLLISION] || '').trim() || 'Unknown';
        agg.byCollision[collision] = (agg.byCollision[collision] || 0) + 1;

        // Weather
        const weather = (row[COL.WEATHER] || '').trim() || 'Unknown';
        agg.byWeather[weather] = (agg.byWeather[weather] || 0) + 1;

        // Light
        const light = (row[COL.LIGHT] || '').trim() || 'Unknown';
        agg.byLight[light] = (agg.byLight[light] || 0) + 1;

        // Hour
        const time = row[COL.TIME];
        if (time) {
            const hour = getHour(time) || 0;
            agg.byHour[hour] = (agg.byHour[hour] || 0) + 1;
        }

        // Day of week and Month
        if (crashDateStr) {
            const crashDate = new Date(Number(crashDateStr));
            const dow = crashDate.getDay();
            const month = crashDate.getMonth();
            agg.byDOW[dow] = (agg.byDOW[dow] || 0) + 1;
            agg.byMonth[month] = (agg.byMonth[month] || 0) + 1;
        }

        // Functional class
        const funcClass = row[COL.FUNC_CLASS] || 'Unknown';
        if (!agg.byFuncClass[funcClass]) agg.byFuncClass[funcClass] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        agg.byFuncClass[funcClass].total++;
        if (agg.byFuncClass[funcClass][sev] !== undefined) agg.byFuncClass[funcClass][sev]++;

        // Ped/Bike/Speed/Nighttime
        const isPed = isYes(row[COL.PED]);
        const isBike = isYes(row[COL.BIKE]);
        const isSpeed = isYes(row[COL.SPEED]);
        const isNight = isYes(row[COL.NIGHT]);

        if (isPed) {
            agg.ped.total++;
            if (sev === 'K') agg.ped.K++;
            if (sev === 'A') agg.ped.A++;
            if (year) {
                agg.ped.byYear[year] = (agg.ped.byYear[year] || 0) + 1;
                agg.byYear[year].ped++;
            }
        }
        if (isBike) {
            agg.bike.total++;
            if (sev === 'K') agg.bike.K++;
            if (sev === 'A') agg.bike.A++;
            if (year) {
                agg.bike.byYear[year] = (agg.bike.byYear[year] || 0) + 1;
                agg.byYear[year].bike++;
            }
        }
        if (isSpeed) {
            agg.speed.total++;
            if (sev === 'K') agg.speed.K++;
            if (sev === 'A') agg.speed.A++;
            if (year) {
                agg.speed.byYear[year] = (agg.speed.byYear[year] || 0) + 1;
                agg.byYear[year].speed++;
            }
        }
        if (isNight) {
            agg.nighttime.total++;
            if (sev === 'K') agg.nighttime.K++;
            if (sev === 'A') agg.nighttime.A++;
            if (year) {
                agg.nighttime.byYear[year] = (agg.nighttime.byYear[year] || 0) + 1;
                agg.byYear[year].nighttime++;
            }
        }
    });

    return {
        agg,
        total,
        stats: agg.bySeverity,
        filtered: true
    };
}

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.analysis = CL.analysis || {};
  window.getFilteredStats = getFilteredStats;
  CL.analysis.getFilteredStats = getFilteredStats;
  CL._registerModule('analysis/filter-aggregation');
})();
