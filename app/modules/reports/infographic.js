/**
 * CL reports.infographic — Infographic + Comprehensive Report generation
 * (single cohesive module, size-exception). Verbatim from app/index.html, 2-segment
 * cut around the inline `comprehensiveReportData` state (13 external readers). NO
 * behavior change. hexToRgb + getQuarterLabel moved + window-mirrored (generic, used
 * app-wide). Depends on utils/report-helpers + reports-* via window/CL. Dual-exposed.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim, 2 segments) ───
async function generateInfographic(allCrashes, title, agency, department, startDate, endDate) {
    // CC 330 — when the dispatcher hydrated stub crashes from a matview
    // (new Array(N).fill({}) in _hydrateWithBudget), `allCrashes` is an
    // array of empty objects. The compute* helpers below would iterate
    // each one calling new Date(Number(undefined)) and producing all-zero
    // histograms, then Chart.js would silently render an empty timeseries
    // with NaN axes — past behavior was a 30s overlay-watchdog hang. Treat
    // stubs as empty so the matview-only `_supabaseMode` branch runs and
    // the row-iterating helpers short-circuit cleanly. State-agnostic.
    const _isStubArray = Array.isArray(allCrashes) && allCrashes.length > 0
        && allCrashes.every(r => !r || Object.keys(r).length === 0);

    // Filter crashes by date if specified
    let crashes = _isStubArray ? [] : (allCrashes || []).slice();
    if (startDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) >= new Date(startDate));
    if (endDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) <= new Date(endDate));

    // Round 7 (2026-05-09): in Supabase-only mode (county-rollup, region,
    // MPO, PD, state, federal) sampleRows is empty and every compute*()
    // below returns zeros. Pre-fetch matview data so the infographic shows
    // real numbers instead of an "all 0" report. The compute*() blocks
    // below still run on the (empty) crashes array; we override their
    // outputs with matview-derived values further down.
    let _supaSummary = null, _supaAnalysis = null, _supaCats = null;
    const _supabaseMode = !crashes.length && window.crashLensClient
        && window.CL?.data?.supabaseBridge?.resolveTier;
    if (_supabaseMode) {
        try {
            const t = window.CL.data.supabaseBridge.resolveTier();
            // Year from the ISO date STRING (local), not new Date().getFullYear()
            // — the UTC parse rolls '2024-01-01' back to 2023 in western zones,
            // inflating the report's matview totals by the adjacent prior year.
            const _isoYr = s => { const m = /^(\d{4})/.exec(String(s || '')); return m ? parseInt(m[1], 10) : null; };
            const yearFrom = startDate ? _isoYr(startDate) : null;
            const yearTo   = endDate   ? _isoYr(endDate)   : null;
            const sumOpts = {};
            if (yearFrom) sumOpts.yearFrom = yearFrom;
            if (yearTo)   sumOpts.yearTo   = yearTo;
            // Road-type filter parity with the standard-report path (PR #275).
            // The infographic hydrates its OWN matviews, so without this it
            // always shows ALL roads regardless of the road-type radio. Fold
            // the spec into the fetch opts AND the cachedMatview keyExtra so a
            // road-type change can't serve the prior road-type's cached slot.
            let _rtSpec = {};
            try { _rtSpec = (CL.data.supabaseBridge.roadTypeSpec && CL.data.supabaseBridge.roadTypeSpec()) || {}; } catch (e) { _rtSpec = {}; }
            const rtOpts = {};
            if (_rtSpec.roadType) rtOpts.roadType = _rtSpec.roadType;
            else if (Array.isArray(_rtSpec.roadTypes) && _rtSpec.roadTypes.length) rtOpts.roadTypes = _rtSpec.roadTypes;
            else if (_rtSpec.noInterstate) rtOpts.noInterstate = true;
            Object.assign(sumOpts, rtOpts);
            const _catKE = Object.keys(rtOpts).length ? rtOpts : undefined;
            [_supaSummary, _supaAnalysis, _supaCats] = await Promise.all([
                CL.data.cachedMatview('dashboard_summary', t.tier, t.value,
                    () => window.crashLensClient.getSummary(t.tier, t.value, sumOpts), sumOpts),
                CL.data.cachedMatview('mv_analysis_summary', t.tier, t.value,
                    () => window.crashLensClient.getAnalysisBreakdown(t.tier, t.value, rtOpts), _catKE),
                CL.data.cachedMatview('mv_safety_categories', t.tier, t.value,
                    () => window.crashLensClient.getSafetyCategories(t.tier, t.value, rtOpts), _catKE),
            ]);
            console.log('[Infographic] matview hydration: summary=' +
                (Array.isArray(_supaSummary) ? _supaSummary.length : 0) + ' rows.');
        } catch (e) {
            console.warn('[Infographic] matview hydration failed:', e && e.message);
        }
    }

    // Compute statistics
    let stats = computeStats(crashes);
    if (_supabaseMode && _supaSummary) {
        // Roll up dashboard_summary rows into the same shape computeStats() returns.
        const s = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0, intersection: 0 };
        _supaSummary.forEach(r => {
            const cnt = r.crash_count || 0;
            s.total += cnt;
            const sev = (r.crash_severity || '').toString().trim().toUpperCase().charAt(0);
            if (['K','A','B','C','O'].includes(sev)) s[sev] += cnt;
            else s.O += cnt;
            s.ped  += r.ped_crashes  || 0;
            s.bike += r.bike_crashes || 0;
        });
        stats = s;
    }
    const total = stats.total;

    // Determine quarter based on date range or current date
    const quarter = getQuarterLabel(startDate, endDate);

    // Compute peak time patterns
    let peakPatterns = computePeakPatterns(crashes);

    // Compute contributing factors
    let factors = computeContributingFactors(crashes);

    // Compute top locations
    let topLocations = computeTopLocations(crashes, 5);

    // Compute trend data — CC 330: skip on stub-array (matview hydration);
    // these helpers iterate per-row date fields and would spin on undefined.
    // CC 332: shape the stub like computeTrendComparison()'s return so
    // populateInfographicPage2 (reads trendData.current.total/.K/.ped) renders
    // the matview totals instead of throwing on (0).total. previous-period and
    // QoQ deltas aren't available in matview mode → zero/neutral badges.
    const trendData = _isStubArray
        ? { current: { total: total, K: stats.K, A: stats.A, B: stats.B, C: stats.C,
                       O: stats.O, ped: stats.ped, bike: stats.bike },
            previous: { total: 0, K: 0, A: 0, ped: 0, bike: 0 },
            totalChange: 0, fatalChange: 0, pedChange: 0, bikeChange: 0 }
        : computeTrendComparison(allCrashes, startDate, endDate);

    // Compute Quarter-over-Quarter comparison (the main focus for quarterly reports)
    const quarterComparison = _isStubArray
        ? null
        : computeYoYComparison(allCrashes, startDate, endDate);

    // Determine focus topic based on crash patterns
    const focusTopic = determineFocusTopic(crashes, stats);

    // Compute risky behaviors for public-friendly display
    let riskyBehaviors = computeRiskyBehaviors(crashes, total);

    // Compute year-over-year trends — CC 330: same per-row reason as above.
    let yearTrends = _isStubArray ? [] : computeYearTrends(allCrashes);

    // Round 7 (2026-05-09): override the row-based compute*() outputs above
    // with matview-derived equivalents when in Supabase-only mode. Keeps
    // the function signature stable so populate*Page() still works.
    if (_supabaseMode && _supaAnalysis) {
        // peakPatterns: derive byHour from mv_analysis_summary.byHour. byDay
        // is not stored in any matview today (round-8 backlog); approximate
        // by spreading total uniformly across days so Sat/Sun patterns
        // aren't wrongly visualized as peak. Round-8 will add a day-of-week
        // dimension to mv_analysis_summary.
        const byHour = {};
        Object.entries(_supaAnalysis.byHour || {}).forEach(([h, c]) => {
            byHour[parseInt(h, 10)] = c;
        });
        const totalForDay = total || 1;
        const dayShare = Math.round(totalForDay / 7);
        const byDay = {
            Sunday: dayShare, Monday: dayShare, Tuesday: dayShare,
            Wednesday: dayShare, Thursday: dayShare, Friday: dayShare,
            Saturday: dayShare
        };
        // Find peak hour window from real byHour; day "peak" is unknown → use Friday as a benign default.
        let maxHourSum = 0, peakStartHour = 0;
        for (let h = 0; h < 22; h++) {
            const sum = (byHour[h] || 0) + (byHour[h+1] || 0) + (byHour[h+2] || 0);
            if (sum > maxHourSum) { maxHourSum = sum; peakStartHour = h; }
        }
        const formatHour = h => h === 0 ? '12 AM' : h === 12 ? '12 PM' : h < 12 ? h + ' AM' : (h - 12) + ' PM';
        peakPatterns = {
            peakDay: 'Friday', lowestDay: 'Sunday',
            peakTime: formatHour(peakStartHour) + '-' + formatHour(peakStartHour + 2),
            lowestTime: '4 AM-6 AM',
            byDay, byHour
        };
    }
    if (_supabaseMode && _supaCats) {
        // factors: top 4 by total. Map matview category keys → display labels.
        const labelMap = {
            speed: 'Speed-Related',
            impaired: 'Alcohol/Impaired',
            distracted: 'Distracted Driving',
            unrestrained: 'Unrestrained',
            nighttime: 'Dark Conditions',
            weather: 'Wet Road',
            intersection: 'Intersection',
            pedestrian: 'Pedestrian',
            bicycle: 'Bicycle',
            motorcycle: 'Motorcycle',
        };
        const factorEntries = Object.entries(_supaCats || {})
            .map(([k, v]) => [labelMap[k] || k, v.total || 0])
            .filter(([_, n]) => n > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4);
        if (factorEntries.length) factors = factorEntries;
        // riskyBehaviors: read alcohol/unrestrained/speed straight from cats.
        const safeTotal = total || 1;
        const alc = _supaCats.impaired?.total     || 0;
        const unr = _supaCats.unrestrained?.total || 0;
        const spd = _supaCats.speed?.total        || 0;
        riskyBehaviors = {
            alcohol:      { count: alc, pct: Math.round(alc / safeTotal * 100) },
            unrestrained: { count: unr, pct: Math.round(unr / safeTotal * 100) },
            speed:        { count: spd, pct: Math.round(spd / safeTotal * 100) },
        };
    }
    if (_supabaseMode && _supaAnalysis) {
        // yearTrends: last 4 years from mv_analysis_summary.byYear.
        const yrs = Object.keys(_supaAnalysis.byYear || {})
            .map(Number).filter(y => y >= 2000).sort((a, b) => b - a)
            .slice(0, 4).reverse();
        if (yrs.length) {
            yearTrends = yrs.map(y => ({
                year: y,
                total: _supaAnalysis.byYear[y].total || 0,
                K:     _supaAnalysis.byYear[y].K     || 0,
                A:     _supaAnalysis.byYear[y].A     || 0,
            }));
        }
    }
    if (_supabaseMode && window.crashLensClient && window.CL?.data?.supabaseBridge?.resolveTier) {
        // topLocations: top-5 hotspots from mv_hotspots, sorted by EPDO.
        try {
            const t = window.CL.data.supabaseBridge.resolveTier();
            const hot = await CL.data.cachedMatview('mv_hotspots', t.tier, t.value,
                () => window.crashLensClient.getHotspots(t.tier, t.value, { limit: 25 }),
                { limit: 25 });
            const merged = [...(hot?.intersections || []), ...(hot?.segments || [])];
            const enriched = merged
                .map(r => {
                    const intName = String(r['Intersection Name'] || r.intersection_name || '').trim();
                    const rteName = String(r['RTE Name'] || r.rte_name || '').trim();
                    const nodeId  = String(r.location_name || '').trim();
                    // Capture coords + node ID for disambiguation when two rows
                    // share the same display label (different physical intersections
                    // — typically two approach nodes of the same junction system).
                    const lat = Number(r.lat_centroid);
                    const lon = Number(r.lon_centroid);
                    let baseName;
                    if (rteName && intName)      baseName = rteName + ' / ' + intName;
                    else if (intName)            baseName = intName;
                    else if (rteName)            baseName = rteName;
                    else                          baseName = nodeId || 'Unknown';
                    const K = r.k || 0, A = r.a || 0, B = r.b || 0, C = r.c || 0, O = r.o || 0;
                    return { baseName, name: baseName, total: r.total_crashes || 0, K, A, B, C, O,
                             epdo: r.epdo || 0, ka: K + A, nodeId, lat, lon };
                })
                .sort((a, b) => b.epdo - a.epdo);
            // CC 342 — disambiguate top-5 display labels.
            // When two rows share the same baseName, append a stable suffix
            // so the user can tell them apart. Do NOT merge counts — these
            // are separate physical intersections with distinct node IDs.
            // Strategy: among rows that share a baseName, the highest-EPDO
            // one keeps the bare label; subsequent rows get "(approach 2)",
            // "(approach 3)", ... appended in EPDO-descending order. This
            // mirrors how engineers refer to multi-leg junction systems.
            // CC 363 — collapse spelling variants BEFORE the exact-match
            // disambiguation, so "...VETERANS MEM. HIGHWAY" and "...VETS MEM
            // HIGHWAY" merge into one summed row. The "(approach N)" suffix
            // below then only disambiguates genuinely-separate physical
            // locations (different coords) that still share a normalized name.
            const deduped = (typeof _fuzzyDedupeHotspots === 'function') ? _fuzzyDedupeHotspots(enriched) : enriched;
            const _seenLabel = Object.create(null);
            for (const row of deduped) {
                const baseName = row.baseName || row.name || '';
                const key = baseName.toLowerCase();
                const seenCount = _seenLabel[key] || 0;
                if (seenCount === 0) {
                    row.name = baseName;              // first occurrence — bare
                } else {
                    row.name = baseName + ' (approach ' + (seenCount + 1) + ')';
                }
                _seenLabel[key] = seenCount + 1;
            }
            const top = deduped.slice(0, 5);
            if (top.length) topLocations = top;
        } catch (e) { /* non-fatal — leave row-based result (empty array) */ }
    }

    // Compute heat map data (re-runs after peakPatterns override above so
    // the heatmap reflects matview byHour data).
    const heatmapData = computeHeatmapData(peakPatterns);

    // Store defaults for reset functionality
    infographicDefaults = {
        agency, department, title, quarter,
        total, stats, peakPatterns, factors, topLocations, trendData, focusTopic, quarterComparison,
        riskyBehaviors, yearTrends, heatmapData
    };

    // Populate Page 1: Overview
    populateInfographicPage1(agency, department, title, quarter, total, stats, peakPatterns, factors, trendData, quarterComparison, yearTrends, heatmapData);

    // Populate Page 2: Safety Focus
    populateInfographicPage2(agency, department, quarter, topLocations, trendData, focusTopic, riskyBehaviors);

    // Hide regular report output, show infographic output
    document.getElementById('reportOutput').style.display = 'none';
    document.getElementById('infographicOutput').style.display = 'block';

    // Show page 1 by default
    showInfographicPage(1);

    // Scroll to infographic
    document.getElementById('infographicOutput').scrollIntoView({ behavior: 'smooth' });
}

function getQuarterLabel(startDate, endDate) {
    // CC 348 — auto-derive a sensible period label from the available
    // inputs. Order of preference:
    //   1. Explicit start + end → "Jan 1, 2024 – Dec 31, 2024" (or
    //      "Q2 2024" when exact-quarter aligned, or "2024" when full-year).
    //   2. Start-only → "Since Jan 1, 2024".
    //   3. End-only → "Through Dec 31, 2024".
    //   4. No filter → derive from crashState.years if available
    //      ("All Available Data (2018–2025)"), else "Current Reporting Period".
    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const parseLocal = (str) => {
        if (!str) return null;
        const parts = String(str).split('-').map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) return null;
        return new Date(parts[0], parts[1] - 1, parts[2]);
    };
    const s = parseLocal(startDate);
    const e = parseLocal(endDate);

    if (s && e) {
        // Exact-quarter detection: start is first day of a quarter, end is last day of same quarter.
        const sm = s.getMonth(), sd = s.getDate(), sy = s.getFullYear();
        const em = e.getMonth(), ed = e.getDate(), ey = e.getFullYear();
        const isQuarterStart = (sd === 1) && (sm % 3 === 0);
        const qLastDays = [2, 5, 8, 11].map(m => new Date(sy, m + 1, 0).getDate());
        const isQuarterEnd = (em === sm + 2) && (ed === qLastDays[Math.floor(sm / 3)]);
        if (sy === ey && isQuarterStart && isQuarterEnd) {
            return `Q${Math.floor(sm / 3) + 1} ${sy}`;
        }
        // Exact-year
        if (sd === 1 && sm === 0 && em === 11 && ed === 31 && sy === ey) {
            return `${sy}`;
        }
        return `${fmt(s)} – ${fmt(e)}`;
    }
    if (s) return `Since ${fmt(s)}`;
    if (e) return `Through ${fmt(e)}`;

    // No filter — use crashState.years if available
    if (window.crashState && Array.isArray(window.crashState.years) && window.crashState.years.length) {
        const years = window.crashState.years.slice().sort((a, b) => a - b);
        const first = years[0], last = years[years.length - 1];
        return first === last ? `${first}` : `All Available Data (${first}–${last})`;
    }
    return 'Current Reporting Period';
}

function computePeakPatterns(crashes) {
    const byDay = { 'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0 };
    const byHour = {};

    crashes.forEach(c => {
        const dateVal = c[COL.DATE];
        if (dateVal) {
            const date = new Date(Number(dateVal));
            const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
            byDay[dayName]++;

            const hour = date.getHours();
            byHour[hour] = (byHour[hour] || 0) + 1;
        }
    });

    // Find peak and lowest days
    const sortedDays = Object.entries(byDay).sort((a, b) => b[1] - a[1]);
    const peakDay = sortedDays[0][0];
    const lowestDay = sortedDays[sortedDays.length - 1][0];

    // Find peak and lowest time ranges
    let maxHourSum = 0;
    let minHourSum = Infinity;
    let peakStartHour = 0;
    let lowestStartHour = 0;
    for (let h = 0; h < 22; h++) {
        const sum = (byHour[h] || 0) + (byHour[h + 1] || 0) + (byHour[h + 2] || 0);
        if (sum > maxHourSum) {
            maxHourSum = sum;
            peakStartHour = h;
        }
        if (sum < minHourSum) {
            minHourSum = sum;
            lowestStartHour = h;
        }
    }

    const formatHour = h => {
        if (h === 0) return '12 AM';
        if (h === 12) return '12 PM';
        return h < 12 ? `${h} AM` : `${h - 12} PM`;
    };

    const peakTime = `${formatHour(peakStartHour)}-${formatHour(peakStartHour + 2)}`;
    const lowestTime = `${formatHour(lowestStartHour)}-${formatHour(lowestStartHour + 2)}`;

    return { peakDay, peakTime, lowestDay, lowestTime, byDay, byHour };
}

function computeContributingFactors(crashes) {
    const factors = {
        'Speed-Related': 0,
        'Failure to Yield': 0,
        'Distracted Driving': 0,
        'Alcohol/Impaired': 0,
        'Wet Road': 0,
        'Dark Conditions': 0
    };

    crashes.forEach(c => {
        const collision = (c[COL.COLLISION] || '').toLowerCase();
        const alcohol = c[COL.ALCOHOL];
        const light = (c[COL.LIGHT] || '').toLowerCase();
        const surface = (c[COL.SURFACE] || '').toLowerCase();
        const driver = (c[COL.DRIVER_ACTION] || '').toLowerCase();

        // Estimate based on available data
        if (collision.includes('rear') || collision.includes('speed') || driver.includes('speed')) {
            factors['Speed-Related']++;
        }
        if (collision.includes('angle') || collision.includes('turn') || driver.includes('yield') || driver.includes('fail')) {
            factors['Failure to Yield']++;
        }
        if (driver.includes('distract') || driver.includes('inatten') || driver.includes('phone')) {
            factors['Distracted Driving']++;
        }
        if (alcohol === 'Y' || alcohol === '1' || driver.includes('alcohol') || driver.includes('impair')) {
            factors['Alcohol/Impaired']++;
        }
        if (surface.includes('wet') || surface.includes('rain') || surface.includes('snow') || surface.includes('ice')) {
            factors['Wet Road']++;
        }
        if (light.includes('dark')) {
            factors['Dark Conditions']++;
        }
    });

    // Sort by count and take top 4
    return Object.entries(factors)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);
}

function computeTopLocations(crashes, limit = 5) {
    const byRoute = {};

    crashes.forEach(c => {
        const route = c[COL.ROUTE] || 'Unknown';
        if (!byRoute[route]) {
            byRoute[route] = { name: route, total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        }
        byRoute[route].total++;
        const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        if (byRoute[route][sev] !== undefined) byRoute[route][sev]++;
    });

    return Object.values(byRoute)
        .map(r => ({ ...r, epdo: calcEPDO(r), ka: r.K + r.A }))
        .sort((a, b) => b.epdo - a.epdo)
        .slice(0, limit);
}

function computeTrendComparison(allCrashes, startDate, endDate) {
    // Get current period crashes
    let currentCrashes = allCrashes.slice();
    if (startDate) currentCrashes = currentCrashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) >= new Date(startDate));
    if (endDate) currentCrashes = currentCrashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) <= new Date(endDate));

    const currentStats = computeStats(currentCrashes);

    // Estimate previous period (same duration, earlier)
    let prevStart = null, prevEnd = null;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const duration = end - start;
        prevEnd = new Date(start.getTime() - 1);
        prevStart = new Date(prevEnd.getTime() - duration);
    } else {
        // Default to comparing with previous year
        const now = new Date();
        prevEnd = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        prevStart = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
    }

    let prevCrashes = allCrashes.filter(r => {
        if (!r[COL.DATE]) return false;
        const d = new Date(Number(r[COL.DATE]));
        return d >= prevStart && d <= prevEnd;
    });

    const prevStats = computeStats(prevCrashes);

    const calcChange = (curr, prev) => {
        if (prev === 0) return curr > 0 ? 100 : 0;
        return Math.round((curr - prev) / prev * 100);
    };

    return {
        current: currentStats,
        previous: prevStats,
        totalChange: calcChange(currentStats.total, prevStats.total),
        fatalChange: calcChange(currentStats.K, prevStats.K),
        pedChange: calcChange(currentStats.ped, prevStats.ped),
        bikeChange: calcChange(currentStats.bike, prevStats.bike)
    };
}

function computeRiskyBehaviors(crashes, total) {
    let alcohol = 0;
    let unrestrained = 0;
    let speedRelated = 0;

    crashes.forEach(c => {
        const alcoholVal = c[COL.ALCOHOL];
        const restraintVal = (c[COL.RESTRAINT] || '').toLowerCase();
        const driverAction = (c[COL.DRIVER_ACTION] || '').toLowerCase();
        const collision = (c[COL.COLLISION] || '').toLowerCase();

        // Alcohol-related
        if (alcoholVal === 'Y' || alcoholVal === '1' || alcoholVal === 'Yes' ||
            driverAction.includes('alcohol') || driverAction.includes('impair') || driverAction.includes('dui')) {
            alcohol++;
        }

        // Unrestrained - check for no seatbelt
        if (restraintVal.includes('none') || restraintVal.includes('not used') ||
            restraintVal.includes('unrestrained') || restraintVal === 'n' || restraintVal === '0') {
            unrestrained++;
        }

        // Speed-related
        if (driverAction.includes('speed') || driverAction.includes('too fast') ||
            driverAction.includes('exceed') || collision.includes('rear end')) {
            speedRelated++;
        }
    });

    return {
        alcohol: { count: alcohol, pct: total > 0 ? Math.round(alcohol / total * 100) : 0 },
        unrestrained: { count: unrestrained, pct: total > 0 ? Math.round(unrestrained / total * 100) : 0 },
        speed: { count: speedRelated, pct: total > 0 ? Math.round(speedRelated / total * 100) : 0 }
    };
}

function computeYearTrends(allCrashes) {
    const byYear = {};

    allCrashes.forEach(c => {
        const dateVal = c[COL.DATE];
        if (dateVal) {
            const year = new Date(Number(dateVal)).getFullYear();
            if (!byYear[year]) {
                byYear[year] = { total: 0, K: 0, A: 0 };
            }
            byYear[year].total++;
            const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
            if (sev === 'K') byYear[year].K++;
            if (sev === 'A') byYear[year].A++;
        }
    });

    // Get last 3-4 years
    const years = Object.keys(byYear).map(Number).sort((a, b) => b - a).slice(0, 4).reverse();
    return years.map(y => ({
        year: y,
        total: byYear[y].total,
        fatal: byYear[y].K,
        serious: byYear[y].A
    }));
}

function computeHeatmapData(peakPatterns) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const periods = [
        { label: '12a-6a', hours: [0, 1, 2, 3, 4, 5] },
        { label: '6a-12p', hours: [6, 7, 8, 9, 10, 11] },
        { label: '12p-6p', hours: [12, 13, 14, 15, 16, 17] },
        { label: '6p-12a', hours: [18, 19, 20, 21, 22, 23] }
    ];

    const dayMap = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
    const grid = [];
    let maxVal = 0;

    // Calculate values for each cell
    for (let p = 0; p < periods.length; p++) {
        for (let d = 0; d < 7; d++) {
            const dayName = Object.keys(dayMap).find(k => dayMap[k] === d);
            const dayTotal = peakPatterns.byDay[dayName] || 0;
            let periodSum = 0;
            periods[p].hours.forEach(h => {
                periodSum += (peakPatterns.byHour[h] || 0);
            });
            // Approximate cell value
            const cellVal = Math.round((dayTotal / 7) * (periodSum / (Object.values(peakPatterns.byHour).reduce((a, b) => a + b, 0) || 1)) * 100);
            grid.push({ day: d, period: p, value: cellVal, dayLabel: days[d], periodLabel: periods[p].label });
            if (cellVal > maxVal) maxVal = cellVal;
        }
    }

    // Normalize values for color intensity
    grid.forEach(cell => {
        cell.intensity = maxVal > 0 ? cell.value / maxVal : 0;
    });

    return { grid, periods, days };
}

function determineFocusTopic(crashes, stats) {
    const total = stats.total;

    // Check various focus areas
    const factors = {
        'Distracted Driving': 0,
        'Impaired Driving': 0,
        'Speeding': 0,
        'Pedestrian Safety': stats.ped,
        'Bicycle Safety': stats.bike,
        'Nighttime Crashes': 0,
        'Intersection Safety': 0
    };

    crashes.forEach(c => {
        const driver = (c[COL.DRIVER_ACTION] || '').toLowerCase();
        const light = (c[COL.LIGHT] || '').toLowerCase();
        const alcohol = c[COL.ALCOHOL];
        const collision = (c[COL.COLLISION] || '').toLowerCase();

        if (driver.includes('distract') || driver.includes('inatten') || driver.includes('phone')) {
            factors['Distracted Driving']++;
        }
        if (alcohol === 'Y' || alcohol === '1' || driver.includes('alcohol')) {
            factors['Impaired Driving']++;
        }
        if (driver.includes('speed') || collision.includes('rear')) {
            factors['Speeding']++;
        }
        if (light.includes('dark')) {
            factors['Nighttime Crashes']++;
        }
        if (collision.includes('angle') || collision.includes('turn')) {
            factors['Intersection Safety']++;
        }
    });

    // Find top concern
    const sorted = Object.entries(factors).sort((a, b) => b[1] - a[1]);
    const topTopic = sorted[0];

    // Safety tips based on topic - action-oriented language
    const tips = {
        'Distracted Driving': [
            '📵 Phone down, eyes up—no exceptions',
            '🗺️ Set GPS before you shift into drive',
            '🛑 Need to text? Pull over completely first',
            '🔕 Turn on Do Not Disturb mode every trip'
        ],
        'Impaired Driving': [
            '🚕 Book your ride home before your first drink',
            '🤝 Pick your designated driver at the start',
            '📱 Keep rideshare apps ready on your phone',
            '📞 See impaired driving? Call #77 immediately'
        ],
        'Speeding': [
            '⏱️ Leave 10 minutes early—speed won\'t save time',
            '🚗 Match the limit, not the traffic flow',
            '🌧️ Rain or dark? Drop 5-10 mph automatically',
            '👀 School zones: 25 mph means 25 mph'
        ],
        'Pedestrian Safety': [
            '🚶 Cross only at marked crosswalks',
            '👁️ Lock eyes with drivers before stepping out',
            '🦺 After dark: wear reflective gear or lights',
            '⚠️ Assume turning cars don\'t see you'
        ],
        'Bicycle Safety': [
            '⛑️ Helmet on—every ride, no matter how short',
            '💡 Lights front and back after sunset',
            '🔄 Ride with traffic, never against it',
            '✋ Signal every turn—drivers need warning'
        ],
        'Nighttime Crashes': [
            '💡 Check all lights monthly—don\'t guess',
            '🐢 Cut your speed 10+ mph after dark',
            '👀 Scan sidewalks and shoulders constantly',
            '😴 Drowsy? Stop and rest—coffee isn\'t enough'
        ],
        'Intersection Safety': [
            '🛑 Full stop at red—no rolling allowed',
            '👀 Look left-right-left before entering',
            '🚶 Pedestrians always have the right of way',
            '📍 Don\'t enter unless you can clear it'
        ]
    };

    return {
        topic: topTopic[0],
        count: topTopic[1],
        percent: total > 0 ? Math.round(topTopic[1] / total * 100) : 0,
        tips: tips[topTopic[0]] || tips['Distracted Driving']
    };
}

// CC 360 — tier-correct text for the infographic hero band. Replaces the
// hardcoded "COUNTY" lie that showed at Planning District / State / MPO tiers.
// Based on the user-selected view tier (immune to the county→planning_district
// DATA rollup in resolveTier) + getJurisdictionLabel()'s tier-aware base name,
// then the proper per-tier suffix. Never throws; ultimate fallback "JURISDICTION".
function _activeTierLabel() {
    var ctx = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext) ? jurisdictionContext : null;
    var tier = ctx && ctx.viewTier ? ctx.viewTier : null;
    // Secondary tier source only if viewTier is unset.
    if (!tier) {
        try {
            if (window.CL && CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.resolveTier) {
                var t = CL.data.supabaseBridge.resolveTier();
                tier = (t && (t.rolledUpFrom || t.tier)) || null;
            }
        } catch (e) {}
    }
    // Base display value per the SELECTED tier (getJurisdictionLabel is already
    // tier-aware: county/PD/MPO/region/city name, or state/federal label).
    var base = (typeof getJurisdictionLabel === 'function') ? (getJurisdictionLabel() || '') : '';
    if (!base && ctx) base = ctx.stateName || ctx.jurisdictionName || '';
    var v = String(base).trim();
    var up = v.toUpperCase();
    switch (tier) {
        case 'county':
            return (v.replace(/\s+county\s*$/i, '') + ' COUNTY').toUpperCase();
        case 'planning_district':
            return (v.replace(/\s+(planning\s+)?district\s*$/i, '') + ' PLANNING DISTRICT').toUpperCase();
        case 'mpo':
            return /\bMPO\b/i.test(v) ? up : (up + ' MPO');
        case 'region':
            return /\bregion\b/i.test(v) ? up : (up + ' REGION');
        case 'city':
            return (v.replace(/\s+(city|town)\s*$/i, '') + ' CITY').toUpperCase();
        case 'state':
            return ('STATE OF ' + ((ctx && ctx.stateName) ? ctx.stateName : v)).toUpperCase();
        case 'federal':
            return 'UNITED STATES';
        default:
            return up || 'JURISDICTION';
    }
}

function populateInfographicPage1(agency, department, title, quarter, total, stats, peakPatterns, factors, trendData, quarterComparison, yearTrends, heatmapData) {
    // Header — CC 360: always render the active-tier label (the stale #reportAgency
    // auto-fill is no longer trusted for the band). The div stays contenteditable
    // so a user can still hand-edit a custom agency name after generation.
    document.getElementById('ig1AgencyName').textContent = _activeTierLabel();
    document.getElementById('ig1MainTitle').textContent = title;
    document.getElementById('ig1Subtitle').textContent = 'Quarterly Crash Analysis Summary';
    document.getElementById('ig1Quarter').textContent = quarter;
    document.getElementById('ig1Department').textContent = department;

    // Hero stat
    document.getElementById('ig1HeroNumber').textContent = total.toLocaleString();
    document.getElementById('ig1HeroLabel').textContent = 'Total Crashes';

    // Trend indicator (comparing to previous period)
    const trendEl = document.getElementById('ig1TrendIndicator');
    if (trendData && trendData.totalChange !== undefined) {
        const change = trendData.totalChange;
        if (change > 0) {
            trendEl.innerHTML = `<span style="background:#fee2e2;color:#dc2626;padding:.4rem .8rem;border-radius:20px;font-size:.9rem">▲ ${change}% vs prior quarter</span>`;
        } else if (change < 0) {
            trendEl.innerHTML = `<span style="background:#dcfce7;color:#16a34a;padding:.4rem .8rem;border-radius:20px;font-size:.9rem">▼ ${Math.abs(change)}% vs prior quarter</span>`;
        } else {
            trendEl.innerHTML = `<span style="background:#f1f5f9;color:#64748b;padding:.4rem .8rem;border-radius:20px;font-size:.9rem">— No change vs prior quarter</span>`;
        }
    } else {
        trendEl.innerHTML = '';
    }

    // Quarter-over-Quarter Comparison section (THE MAIN FOCUS)
    const qcSection = document.getElementById('ig1QuarterComparison');
    if (qcSection && quarterComparison?.hasPreviousData) {
        qcSection.style.display = 'block';

        // Labels
        document.getElementById('ig1PrevQuarterLabel').textContent = quarterComparison.previousQuarter || 'Previous Quarter';
        document.getElementById('ig1CurrQuarterLabel').textContent = quarterComparison.currentQuarter || 'Current Quarter';

        // Totals
        document.getElementById('ig1PrevQuarterTotal').textContent = quarterComparison.previous.total.toLocaleString();
        document.getElementById('ig1CurrQuarterTotal').textContent = quarterComparison.current.total.toLocaleString();

        // Severity breakdown
        document.getElementById('ig1PrevQuarterSev').innerHTML = `<span style="color:#fca5a5">${quarterComparison.previous.K} fatal</span> • <span style="color:#fed7aa">${quarterComparison.previous.A} serious</span>`;
        document.getElementById('ig1CurrQuarterSev').innerHTML = `<span style="color:#fca5a5">${quarterComparison.current.K} fatal</span> • <span style="color:#fed7aa">${quarterComparison.current.A} serious</span>`;

        // Main change indicator
        const totalChange = quarterComparison.changes.total;
        const changeEl = document.getElementById('ig1QuarterChange');
        changeEl.textContent = `${totalChange > 0 ? '▲' : totalChange < 0 ? '▼' : '—'} ${Math.abs(totalChange)}%`;
        changeEl.style.background = totalChange > 0 ? 'rgba(220,38,38,.9)' : totalChange < 0 ? 'rgba(22,163,74,.9)' : 'rgba(255,255,255,.2)';

        // Change breakdown
        const fmtChange = (val) => `${val > 0 ? '+' : ''}${val}%`;
        const colorChange = (val) => val > 0 ? '#fca5a5' : val < 0 ? '#86efac' : '#fff';

        const fatalChangeEl = document.getElementById('ig1FatalChange');
        fatalChangeEl.textContent = fmtChange(quarterComparison.changes.fatal);
        fatalChangeEl.style.color = colorChange(quarterComparison.changes.fatal);

        const seriousChangeEl = document.getElementById('ig1SeriousChange');
        seriousChangeEl.textContent = fmtChange(quarterComparison.changes.serious);
        seriousChangeEl.style.color = colorChange(quarterComparison.changes.serious);

        const pedChangeEl = document.getElementById('ig1PedChange');
        pedChangeEl.textContent = fmtChange(quarterComparison.changes.ped);
        pedChangeEl.style.color = colorChange(quarterComparison.changes.ped);
    } else if (qcSection) {
        qcSection.style.display = 'none';
    }

    // Severity counts
    document.getElementById('ig1FatalCount').textContent = stats.K;
    document.getElementById('ig1SeriousCount').textContent = stats.A;
    document.getElementById('ig1ModerateCount').textContent = stats.B;
    document.getElementById('ig1MinorCount').textContent = stats.C;
    document.getElementById('ig1PDOCount').textContent = stats.O;

    // Peak patterns (with lowest period)
    document.getElementById('ig1PeakDay').textContent = peakPatterns.peakDay;
    document.getElementById('ig1PeakTime').textContent = peakPatterns.peakTime;

    // Update lowest period if element exists
    const lowestEl = document.getElementById('ig1LowestPeriod');
    if (lowestEl && peakPatterns.lowestDay && peakPatterns.lowestTime) {
        lowestEl.textContent = `${peakPatterns.lowestDay.substring(0, 3)} ${peakPatterns.lowestTime.split('-')[0]}`;
    }

    // Populate heat map grid
    const heatmapEl = document.getElementById('ig1HeatmapGrid');
    if (heatmapEl && heatmapData) {
        const getHeatColor = (intensity) => {
            if (intensity < 0.25) return '#dcfce7'; // green - low
            if (intensity < 0.5) return '#fef9c3';  // yellow - medium-low
            if (intensity < 0.75) return '#fed7aa'; // orange - medium-high
            return '#fecaca'; // red - high
        };

        // Create header row (days)
        let html = '<div style="grid-column:1/-1;display:grid;grid-template-columns:40px repeat(7,1fr);gap:3px;margin-bottom:3px">';
        html += '<div></div>';
        heatmapData.days.forEach(d => {
            html += `<div style="text-align:center;font-weight:600;color:#64748b">${d}</div>`;
        });
        html += '</div>';

        // Create grid rows (time periods x days)
        heatmapData.periods.forEach((period, pIdx) => {
            html += `<div style="grid-column:1/-1;display:grid;grid-template-columns:40px repeat(7,1fr);gap:3px">`;
            html += `<div style="font-size:.55rem;color:#64748b;display:flex;align-items:center">${period.label}</div>`;
            heatmapData.grid.filter(c => c.period === pIdx).forEach(cell => {
                const bgColor = getHeatColor(cell.intensity);
                html += `<div style="height:20px;background:${bgColor};border-radius:3px;border:1px solid rgba(0,0,0,.05)" title="${cell.dayLabel} ${cell.periodLabel}"></div>`;
            });
            html += '</div>';
        });

        heatmapEl.innerHTML = html;
    }

    // Populate year trends
    const yearTrendEl = document.getElementById('ig1YearTrendBars');
    if (yearTrendEl && yearTrends && yearTrends.length > 0) {
        const maxTotal = Math.max(...yearTrends.map(y => y.total));
        yearTrendEl.innerHTML = yearTrends.map((y, idx) => {
            const barPct = Math.round(y.total / maxTotal * 100);
            const isLatest = idx === yearTrends.length - 1;
            return `
                <div style="display:flex;align-items:center;gap:.5rem">
                    <div style="width:35px;font-size:.75rem;font-weight:600;color:${isLatest ? '#1e40af' : '#64748b'}">${y.year}</div>
                    <div style="flex:1;height:18px;background:#e2e8f0;border-radius:4px;overflow:hidden">
                        <div style="height:100%;width:${barPct}%;background:${isLatest ? 'linear-gradient(90deg,#1e40af,#3b82f6)' : '#94a3b8'};border-radius:4px;display:flex;align-items:center;justify-content:flex-end;padding-right:.5rem">
                            <span style="font-size:.65rem;font-weight:600;color:#fff">${y.total.toLocaleString()}</span>
                        </div>
                    </div>
                    <div style="font-size:.6rem;color:#64748b;min-width:50px">${y.fatal > 0 ? y.fatal + ' fatal' : ''}</div>
                </div>
            `;
        }).join('');
    }

    // Contributing factors with footnote
    const factorsEl = document.getElementById('ig1FactorsBars');
    const maxFactor = factors.length > 0 ? factors[0][1] : 1;
    const factorColors = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd'];

    factorsEl.innerHTML = factors.map(([name, count], idx) => {
        const pct = Math.round(count / total * 100);
        const barPct = Math.round(count / maxFactor * 100);
        return `
            <div class="ig-factor-bar">
                <div class="ig-factor-bar-fill" style="width:${barPct}%;background:${factorColors[idx] || '#94a3b8'}">${pct}%</div>
                <div class="ig-factor-bar-label" contenteditable="true">${name}</div>
            </div>
        `;
    }).join('') + `<div style="font-size:.7rem;color:#94a3b8;margin-top:.5rem;font-style:italic">* Crashes may include multiple contributing factors</div>`;

    // Vulnerable road users with rate context
    document.getElementById('ig1PedCount').textContent = stats.ped;
    document.getElementById('ig1BikeCount').textContent = stats.bike;

    // Update VRU rate context if elements exist (using quarter comparison if available)
    const pedRateEl = document.getElementById('ig1PedRate');
    const bikeRateEl = document.getElementById('ig1BikeRate');
    if (pedRateEl && quarterComparison?.hasPreviousData) {
        const pedChange = quarterComparison.changes.ped;
        if (pedChange > 0) {
            pedRateEl.innerHTML = `<span style="color:#dc2626;font-size:.75rem">▲ ${pedChange}% QoQ</span>`;
        } else if (pedChange < 0) {
            pedRateEl.innerHTML = `<span style="color:#16a34a;font-size:.75rem">▼ ${Math.abs(pedChange)}% QoQ</span>`;
        } else {
            pedRateEl.innerHTML = `<span style="color:#64748b;font-size:.75rem">— No change QoQ</span>`;
        }
    } else if (pedRateEl && trendData) {
        const pedChange = trendData.pedChange;
        if (pedChange > 0) {
            pedRateEl.innerHTML = `<span style="color:#dc2626;font-size:.75rem">▲ ${pedChange}%</span>`;
        } else if (pedChange < 0) {
            pedRateEl.innerHTML = `<span style="color:#16a34a;font-size:.75rem">▼ ${Math.abs(pedChange)}%</span>`;
        } else {
            pedRateEl.innerHTML = `<span style="color:#64748b;font-size:.75rem">—</span>`;
        }
    }
    if (bikeRateEl && quarterComparison?.hasPreviousData) {
        const bikeChange = quarterComparison.changes.bike;
        if (bikeChange > 0) {
            bikeRateEl.innerHTML = `<span style="color:#dc2626;font-size:.75rem">▲ ${bikeChange}% QoQ</span>`;
        } else if (bikeChange < 0) {
            bikeRateEl.innerHTML = `<span style="color:#16a34a;font-size:.75rem">▼ ${Math.abs(bikeChange)}% QoQ</span>`;
        } else {
            bikeRateEl.innerHTML = `<span style="color:#64748b;font-size:.75rem">— No change QoQ</span>`;
        }
    } else if (bikeRateEl && trendData) {
        const bikeChange = trendData.bikeChange || 0;
        if (bikeChange > 0) {
            bikeRateEl.innerHTML = `<span style="color:#dc2626;font-size:.75rem">▲ ${bikeChange}%</span>`;
        } else if (bikeChange < 0) {
            bikeRateEl.innerHTML = `<span style="color:#16a34a;font-size:.75rem">▼ ${Math.abs(bikeChange)}%</span>`;
        } else {
            bikeRateEl.innerHTML = `<span style="color:#64748b;font-size:.75rem">—</span>`;
        }
    }

    // Footer with enhanced branding
    document.getElementById('ig1FooterAgency').textContent = `${agency} ${department}`;
    const footerMsgEl = document.getElementById('ig1FooterMessage');
    if (footerMsgEl) footerMsgEl.textContent = 'Keeping Our Roads Safe';
    document.getElementById('ig1DataSource').textContent = 'Data: ' + getDataSourceLabel();
    document.getElementById('ig1GeneratedDate').textContent = `Generated: ${getShortTimestamp()}`;
}

function populateInfographicPage2(agency, department, quarter, topLocations, trendData, focusTopic, riskyBehaviors) {
    // Header
    // CC 360 — active-tier label (see populateInfographicPage1 for rationale).
    document.getElementById('ig2AgencyName').textContent = _activeTierLabel();
    document.getElementById('ig2Quarter').textContent = quarter;

    // Focus topic
    document.getElementById('ig2FocusTopic').textContent = focusTopic.topic;
    document.getElementById('ig2FocusCount').textContent = focusTopic.count.toLocaleString();
    document.getElementById('ig2FocusPercent').textContent = `${focusTopic.percent}%`;

    // Safety tips
    document.getElementById('ig2Tip1').textContent = focusTopic.tips[0];
    document.getElementById('ig2Tip2').textContent = focusTopic.tips[1];
    document.getElementById('ig2Tip3').textContent = focusTopic.tips[2];
    document.getElementById('ig2Tip4').textContent = focusTopic.tips[3];

    // Top locations with crash counts (public-friendly, no EPDO)
    const locationsEl = document.getElementById('ig2TopLocations');
    locationsEl.innerHTML = topLocations.slice(0, 5).map((loc, idx) => `
        <div class="ig-location-row" style="display:flex;align-items:center;gap:.75rem;padding:.75rem;background:#f8fafc;border-radius:8px;border-left:4px solid ${idx === 0 ? '#dc2626' : idx === 1 ? '#ea580c' : '#f59e0b'}">
            <div class="ig-location-rank" style="width:28px;height:28px;border-radius:50%;background:${idx === 0 ? '#dc2626' : idx === 1 ? '#ea580c' : '#f59e0b'};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.9rem">${idx + 1}</div>
            <div style="flex:1;min-width:0">
                <div style="font-weight:600;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" contenteditable="true">${formatRouteName(loc.name)}</div>
                <div style="font-size:.75rem;color:#64748b">${loc.K > 0 ? loc.K + ' fatal, ' : ''}${loc.A > 0 ? loc.A + ' serious injury' : 'No serious injuries'}</div>
            </div>
            <div style="text-align:right;min-width:70px">
                <div style="font-weight:700;color:#1e40af;font-family:ui-monospace,monospace;font-size:1.25rem">${loc.total}</div>
                <div style="font-size:.65rem;color:#64748b;text-transform:uppercase">crashes</div>
            </div>
        </div>
    `).join('');

    // Trend comparison
    const trendEl = document.getElementById('ig2TrendComparison');
    const formatChange = (val) => {
        if (val > 0) return `<span class="ig-trend-change negative">▲ ${val}%</span>`;
        if (val < 0) return `<span class="ig-trend-change positive">▼ ${Math.abs(val)}%</span>`;
        return `<span class="ig-trend-change neutral">— 0%</span>`;
    };

    trendEl.innerHTML = `
        <div class="ig-trend-card">
            <div class="ig-trend-value" style="color:#1e40af">${trendData.current.total.toLocaleString()}</div>
            <div class="ig-trend-label">Total Crashes</div>
            ${formatChange(trendData.totalChange)}
        </div>
        <div class="ig-trend-card">
            <div class="ig-trend-value" style="color:#dc2626">${trendData.current.K}</div>
            <div class="ig-trend-label">Fatal Crashes</div>
            ${formatChange(trendData.fatalChange)}
        </div>
        <div class="ig-trend-card">
            <div class="ig-trend-value" style="color:#0891b2">${trendData.current.ped}</div>
            <div class="ig-trend-label">Pedestrian</div>
            ${formatChange(trendData.pedChange)}
        </div>
    `;

    // Populate risky behaviors section
    if (riskyBehaviors) {
        const alcoholCountEl = document.getElementById('ig2AlcoholCount');
        const alcoholPctEl = document.getElementById('ig2AlcoholPct');
        const unrestrainedCountEl = document.getElementById('ig2UnrestrainedCount');
        const unrestrainedPctEl = document.getElementById('ig2UnrestrainedPct');
        const speedCountEl = document.getElementById('ig2SpeedCount');
        const speedPctEl = document.getElementById('ig2SpeedPct');

        if (alcoholCountEl) alcoholCountEl.textContent = riskyBehaviors.alcohol.count.toLocaleString();
        if (alcoholPctEl) alcoholPctEl.textContent = `${riskyBehaviors.alcohol.pct}% of crashes`;
        if (unrestrainedCountEl) unrestrainedCountEl.textContent = riskyBehaviors.unrestrained.count.toLocaleString();
        if (unrestrainedPctEl) unrestrainedPctEl.textContent = `${riskyBehaviors.unrestrained.pct}% of crashes`;
        if (speedCountEl) speedCountEl.textContent = riskyBehaviors.speed.count.toLocaleString();
        if (speedPctEl) speedPctEl.textContent = `${riskyBehaviors.speed.pct}% of crashes`;
    }

    // Footer with enhanced branding
    document.getElementById('ig2FooterAgency').textContent = `${agency} ${department}`;
    document.getElementById('ig2FooterMessage').textContent = 'Working together for safer roads';
    document.getElementById('ig2DataSource').textContent = 'Data: ' + getDataSourceLabel();
    document.getElementById('ig2GeneratedDate').textContent = `Generated: ${getShortTimestamp()}`;
}

function showInfographicPage(pageNum) {
    // Update tabs
    document.getElementById('infographicPageTab1').classList.toggle('active', pageNum === 1);
    document.getElementById('infographicPageTab2').classList.toggle('active', pageNum === 2);

    // Show/hide pages
    document.getElementById('infographicPage1').style.display = pageNum === 1 ? 'block' : 'none';
    document.getElementById('infographicPage2').style.display = pageNum === 2 ? 'block' : 'none';
}

function resetInfographicDefaults() {
    if (!infographicDefaults || !infographicDefaults.agency) {
        alert('No defaults to reset. Please generate the infographic first.');
        return;
    }

    const d = infographicDefaults;
    populateInfographicPage1(d.agency, d.department, d.title, d.quarter, d.total, d.stats, d.peakPatterns, d.factors, d.trendData, d.quarterComparison, d.yearTrends, d.heatmapData);
    populateInfographicPage2(d.agency, d.department, d.quarter, d.topLocations, d.trendData, d.focusTopic, d.riskyBehaviors);
}

// CC 367 — unique, tier-stamped PDF/PNG filename so Kent vs Statewide vs
// New Castle exports don't collide/overwrite in the user's Downloads folder.
// Reuses the existing tier-aware _activeTierLabel() (KENT COUNTY / STATE OF
// DELAWARE / UNITED STATES). Falls back to 'report' so the basename is never empty.
window._cc367_filename = function (reportType, ext) {
    var slug = function (s) {
        return String(s || '').toLowerCase()
            .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'report';
    };
    var tier = '';
    try {
        if (typeof _activeTierLabel === 'function') tier = _activeTierLabel();
        else if (typeof jurisdictionContext !== 'undefined' && jurisdictionContext)
            tier = jurisdictionContext.label || jurisdictionContext.stateName || '';
    } catch (e) {}
    var d = new Date();
    var iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    return 'crashlens-' + slug(reportType || 'report') + '-' + slug(tier) + '-' + iso + '.' + (ext || 'pdf');
};

// CC 367 — html2canvas options that skip hidden / 0-dimension canvases and any
// canvas/img/iframe outside the report output roots. html2canvas clones the WHOLE
// document during capture; the Safety Focus detail panel keeps ~10 Chart.js
// canvases mounted at width=0 height=0 that are CORS-tainted (Mapbox/R2 imagery),
// and the clone step aborts on them ("Unable to clone canvas as it is tainted").
// We deliberately do NOT set allowTaint:true — the infographic is consumed via
// toDataURL()/addImage(), and allowTaint would taint the OUTPUT canvas and make
// toDataURL() throw. ignoreElements + useCORS keeps the cloned document clean.
var _cc367_h2cOpts = {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    ignoreElements: function (node) {
        try {
            if (!node || node.nodeType !== 1) return false;
            if (node.tagName === 'CANVAS' && (node.width === 0 || node.height === 0)) return true;
            var doc = node.ownerDocument;
            var view = doc && doc.defaultView;
            var style = view ? view.getComputedStyle(node) : null;
            if (style && (style.display === 'none' || style.visibility === 'hidden')) return true;
            var ROOTS = ['reportOutput', 'comprehensiveReportOutput', 'comprehensivePreview',
                         'comprehensivePreviewContent', 'infographicOutput',
                         'infographicContainer1', 'infographicContainer2'];
            var inReport = ROOTS.some(function (id) { var rt = doc && doc.getElementById(id); return rt && rt.contains(node); });
            if (!inReport && (node.tagName === 'CANVAS' || node.tagName === 'IMG' || node.tagName === 'IFRAME')) return true;
            return false;
        } catch (e) { return false; } // fail-open to today's behavior
    }
};

async function downloadInfographicPNG() {
    showLoading('Generating PNG images...');

    try {
        // Capture both pages
        const container1 = document.getElementById('infographicContainer1');
        const container2 = document.getElementById('infographicContainer2');

        // Make sure both pages are visible for capture
        const page1 = document.getElementById('infographicPage1');
        const page2 = document.getElementById('infographicPage2');
        const page1Display = page1.style.display;
        const page2Display = page2.style.display;

        // Capture page 1
        page1.style.display = 'block';
        const canvas1 = await html2canvas(container1, _cc367_h2cOpts);

        // Download page 1
        const link1 = document.createElement('a');
        link1.download = _cc367_filename('infographic-page1', 'png');
        link1.href = canvas1.toDataURL('image/png');
        link1.click();

        // Capture page 2
        page2.style.display = 'block';
        const canvas2 = await html2canvas(container2, _cc367_h2cOpts);

        // Download page 2
        const link2 = document.createElement('a');
        link2.download = _cc367_filename('infographic-page2', 'png');
        link2.href = canvas2.toDataURL('image/png');
        setTimeout(() => link2.click(), 500);

        // Restore display states
        page1.style.display = page1Display;
        page2.style.display = page2Display;

        hideLoading();
    } catch (e) {
        hideLoading();
        console.error('[CC 367] html2canvas failed →', e && e.message);
        alert('Error generating PNG: ' + e.message);
    }
}

// Professional standard-report PDF — snapshots the on-screen #reportOutput
// (branded rds theme) into a multi-page PDF via html2canvas → jsPDF, so the
// downloaded PDF matches the on-screen report exactly. Replaces the legacy
// text-only generateStandardReportPDF path for the standard-report band.
async function exportReportPDF() {
    const el = document.getElementById('reportOutput');
    if (!el || el.style.display === 'none' || el.offsetHeight < 100) {
        alert('Please click "Generate Report" first, then download the PDF.');
        return;
    }
    showLoading('Generating professional PDF report...');
    try {
        const { jsPDF } = window.jspdf;
        const canvas = await html2canvas(el, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            windowWidth: el.scrollWidth,
            // Don't rasterize the action toolbar (Print / Download / Copy buttons).
            ignoreElements: (node) => node.tagName === 'BUTTON' ||
                (node.classList && node.classList.contains('btn-group'))
        });
        const pdf = new jsPDF('p', 'mm', 'letter');
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        // Slice the tall canvas into one JPEG per page. A single full-length PNG
        // would balloon to tens of MB; per-page JPEG keeps the report emailable.
        const pxPerPage = Math.floor(canvas.width * (pageH / pageW));
        let rendered = 0, pageNum = 0;
        while (rendered < canvas.height) {
            const sliceH = Math.min(pxPerPage, canvas.height - rendered);
            const slice = document.createElement('canvas');
            slice.width = canvas.width;
            slice.height = sliceH;
            slice.getContext('2d').drawImage(canvas, 0, rendered, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
            const img = slice.toDataURL('image/jpeg', 0.92);
            if (pageNum > 0) pdf.addPage();
            pdf.addImage(img, 'JPEG', 0, 0, pageW, sliceH * pageW / canvas.width);
            rendered += sliceH;
            pageNum++;
        }
        const type = (document.getElementById('reportType') || {}).value || 'report';
        const filename = (typeof window._cc367_filename === 'function')
            ? window._cc367_filename(type)
            : ('crashlens-' + type + '-' + new Date().toISOString().split('T')[0] + '.pdf');
        pdf.save(filename);
        if (typeof showToast === 'function') showToast('Professional PDF report downloaded: ' + filename, 'success');
    } catch (e) {
        console.error('[Report PDF] html2canvas export failed:', e);
        alert('Error generating PDF: ' + (e && e.message ? e.message : e));
    } finally {
        hideLoading();
    }
}

async function downloadInfographicPDF() {
    showLoading('Generating PDF...');

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'letter'); // Letter size: 8.5 x 11 inches

        // Make sure both pages are visible for capture
        const page1 = document.getElementById('infographicPage1');
        const page2 = document.getElementById('infographicPage2');
        const page1Display = page1.style.display;
        const page2Display = page2.style.display;

        // Capture page 1
        page1.style.display = 'block';
        const container1 = document.getElementById('infographicContainer1');
        const canvas1 = await html2canvas(container1, _cc367_h2cOpts);

        // Add page 1 to PDF
        const imgWidth = 200; // mm (slightly less than letter width for margins)
        const imgHeight1 = canvas1.height * imgWidth / canvas1.width;
        pdf.addImage(canvas1.toDataURL('image/png'), 'PNG', 5, 5, imgWidth, imgHeight1);

        // Capture page 2
        page2.style.display = 'block';
        const container2 = document.getElementById('infographicContainer2');
        const canvas2 = await html2canvas(container2, _cc367_h2cOpts);

        // Add page 2 to PDF
        pdf.addPage();
        const imgHeight2 = canvas2.height * imgWidth / canvas2.width;
        pdf.addImage(canvas2.toDataURL('image/png'), 'PNG', 5, 5, imgWidth, imgHeight2);

        // Restore display states
        page1.style.display = page1Display;
        page2.style.display = page2Display;

        // CC 367 — tier-stamped filename so per-jurisdiction infographics don't collide.
        pdf.save(_cc367_filename('infographic'));

        hideLoading();
    } catch (e) {
        hideLoading();
        console.error('[CC 367] html2canvas failed →', e && e.message);
        alert('Error generating PDF: ' + e.message);
    }
}

// ============================================
// END INFOGRAPHIC GENERATOR FUNCTIONS
// ============================================

// ============================================
// COMPREHENSIVE QUARTERLY REPORT GENERATOR
// ============================================

// CC 330 — generateComprehensiveReport moved to
// app/modules/reports/reports-standard-core2.js (extracted with stub-array
// guard + computeLocationDetails timeout + per-section AI timeouts).

function computeCollisionBreakdown(crashes) {
    const types = {};
    crashes.forEach(c => {
        const type = c[COL.COLLISION] || 'Unknown';
        if (!types[type]) types[type] = { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        types[type].count++;
        const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        if (types[type][sev] !== undefined) types[type][sev]++;
    });
    return Object.entries(types)
        .map(([name, data]) => ({ name, ...data, epdo: calcEPDO(data) }))
        .sort((a, b) => b.epdo - a.epdo);
}

function computeMonthlyTrends(crashes) {
    const monthly = {};
    crashes.forEach(c => {
        if (!c[COL.DATE]) return;
        // Round 17 §9.5 — defensive parse (numeric epoch → ISO fallback).
        let date = new Date(Number(c[COL.DATE]));
        if (isNaN(date.getTime())) date = new Date(c[COL.DATE]);
        if (isNaN(date.getTime())) return;
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthly[key]) monthly[key] = { month: key, count: 0, K: 0, A: 0 };
        monthly[key].count++;
        const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        if (sev === 'K') monthly[key].K++;
        if (sev === 'A') monthly[key].A++;
    });
    return Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month));
}

function computeDayOfWeekAnalysis(crashes) {
    const days = { Sunday: {count: 0, K: 0, A: 0}, Monday: {count: 0, K: 0, A: 0}, Tuesday: {count: 0, K: 0, A: 0},
                   Wednesday: {count: 0, K: 0, A: 0}, Thursday: {count: 0, K: 0, A: 0}, Friday: {count: 0, K: 0, A: 0},
                   Saturday: {count: 0, K: 0, A: 0} };
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    crashes.forEach(c => {
        if (!c[COL.DATE]) return;
        // Round 17 §9.5 — defensive parse. Supabase hydrate may return ISO
        // strings; R2 hydrate returns ms-epoch numbers. Try numeric first,
        // then ISO; bail on Invalid Date so dayNames[NaN] never throws.
        let date = new Date(Number(c[COL.DATE]));
        if (isNaN(date.getTime())) date = new Date(c[COL.DATE]);
        if (isNaN(date.getTime())) return;
        const dayIdx = date.getDay();
        if (dayIdx < 0 || dayIdx > 6) return;
        const day = dayNames[dayIdx];
        if (!days[day]) return;
        days[day].count++;
        const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        if (sev === 'K') days[day].K++;
        if (sev === 'A') days[day].A++;
    });
    return days;
}

function computeHourlyDistribution(crashes) {
    const hours = Array(24).fill(null).map(() => ({ count: 0, K: 0, A: 0 }));
    crashes.forEach(c => {
        if (!c[COL.DATE]) return;
        // Round 17 §9.5 — same defensive parse as computeDayOfWeekAnalysis.
        let date = new Date(Number(c[COL.DATE]));
        if (isNaN(date.getTime())) date = new Date(c[COL.DATE]);
        if (isNaN(date.getTime())) return;
        const hour = date.getHours();
        if (hour < 0 || hour > 23) return;
        hours[hour].count++;
        const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        if (sev === 'K') hours[hour].K++;
        if (sev === 'A') hours[hour].A++;
    });
    return hours;
}

function computeWeatherImpact(crashes) {
    const weather = {};
    crashes.forEach(c => {
        const w = c[COL.WEATHER] || 'Unknown';
        if (!weather[w]) weather[w] = { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        weather[w].count++;
        const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        if (weather[w][sev] !== undefined) weather[w][sev]++;
    });
    return Object.entries(weather)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count);
}

function computeLightConditions(crashes) {
    const light = {};
    crashes.forEach(c => {
        const l = c[COL.LIGHT] || 'Unknown';
        if (!light[l]) light[l] = { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        light[l].count++;
        const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        if (light[l][sev] !== undefined) light[l][sev]++;
    });
    return Object.entries(light)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count);
}

function computeVulnerableUserAnalysis(crashes) {
    const ped = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, locations: {}, byHour: Array(24).fill(0), byDay: {}, byLight: {} };
    const bike = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, locations: {}, byHour: Array(24).fill(0), byDay: {}, byLight: {} };
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    crashes.forEach(c => {
        const route = c[COL.ROUTE] || 'Unknown';
        const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        const light = c[COL.LIGHT] || 'Unknown';
        let dayName = 'Unknown';
        let hour = null;

        if (c[COL.DATE]) {
            const date = new Date(Number(c[COL.DATE]));
            if (!isNaN(date.getTime())) {
                dayName = dayNames[date.getDay()];
                hour = date.getHours();
            }
        }

        // Use isYes() helper for consistent flag checking (handles Y, Yes, 1, true, etc.)
        if (isYes(c[COL.PED])) {
            ped.total++;
            if (ped[sev] !== undefined) ped[sev]++;
            ped.locations[route] = (ped.locations[route] || 0) + 1;
            if (hour !== null) ped.byHour[hour]++;
            ped.byDay[dayName] = (ped.byDay[dayName] || 0) + 1;
            ped.byLight[light] = (ped.byLight[light] || 0) + 1;
        }
        if (isYes(c[COL.BIKE])) {
            bike.total++;
            if (bike[sev] !== undefined) bike[sev]++;
            bike.locations[route] = (bike.locations[route] || 0) + 1;
            if (hour !== null) bike.byHour[hour]++;
            bike.byDay[dayName] = (bike.byDay[dayName] || 0) + 1;
            bike.byLight[light] = (bike.byLight[light] || 0) + 1;
        }
    });

    // Get top locations
    ped.topLocations = Object.entries(ped.locations).sort((a, b) => b[1] - a[1]).slice(0, 5);
    bike.topLocations = Object.entries(bike.locations).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Calculate EPDO for vulnerable users
    ped.epdo = calcEPDO(ped);
    bike.epdo = calcEPDO(bike);

    return { ped, bike };
}

// Compute Day×Hour heat matrix for temporal analysis visualization
function computeDayHourMatrix(crashes) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const matrix = {};
    let maxCount = 0;
    let peakCell = { day: '', hour: 0, count: 0 };

    // Initialize matrix
    dayNames.forEach(day => {
        matrix[day] = Array(24).fill(null).map(() => ({ count: 0, K: 0, A: 0 }));
    });

    crashes.forEach(c => {
        if (!c[COL.DATE]) return;
        const date = new Date(Number(c[COL.DATE]));
        if (isNaN(date.getTime())) return;

        const day = dayNames[date.getDay()];
        const hour = date.getHours();
        const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();

        matrix[day][hour].count++;
        if (sev === 'K') matrix[day][hour].K++;
        if (sev === 'A') matrix[day][hour].A++;

        if (matrix[day][hour].count > maxCount) {
            maxCount = matrix[day][hour].count;
            peakCell = { day, hour, count: matrix[day][hour].count };
        }
    });

    // Calculate risk levels (0-1 normalized)
    dayNames.forEach(day => {
        matrix[day].forEach(cell => {
            cell.risk = maxCount > 0 ? cell.count / maxCount : 0;
        });
    });

    return { matrix, maxCount, peakCell, dayNames };
}

// Compute Quarter-over-Quarter comparison data (also includes historical totals)
function computeYoYComparison(crashes, startDate, endDate) {
    const current = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0 };
    const previous = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0 };
    const historical = { total: 0, K: 0, A: 0, ped: 0, bike: 0, startYear: 2017 };

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Calculate previous period dates (same duration, immediately prior - for quarter comparison)
    let prevStart = null, prevEnd = null;
    if (start && end) {
        const duration = end.getTime() - start.getTime();
        prevEnd = new Date(start.getTime() - 1); // Day before current period starts
        prevStart = new Date(prevEnd.getTime() - duration);
    }

    // Track earliest date for historical context
    let earliestDate = null;

    crashes.forEach(c => {
        if (!c[COL.DATE]) return;
        const crashDate = new Date(Number(c[COL.DATE]));
        if (isNaN(crashDate.getTime())) return;

        const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        const isPed = isYes(c[COL.PED]);
        const isBike = isYes(c[COL.BIKE]);

        // Track earliest date
        if (!earliestDate || crashDate < earliestDate) earliestDate = crashDate;

        // Historical totals (all data)
        historical.total++;
        if (sev === 'K') historical.K++;
        if (sev === 'A') historical.A++;
        if (isPed) historical.ped++;
        if (isBike) historical.bike++;

        // Current period (selected quarter)
        if (start && end && crashDate >= start && crashDate <= end) {
            current.total++;
            if (sev === 'K') current.K++;
            if (sev === 'A') current.A++;
            if (sev === 'B') current.B++;
            if (sev === 'C') current.C++;
            if (sev === 'O') current.O++;
            if (isPed) current.ped++;
            if (isBike) current.bike++;
        }
        // Previous period (prior quarter)
        else if (prevStart && prevEnd && crashDate >= prevStart && crashDate <= prevEnd) {
            previous.total++;
            if (sev === 'K') previous.K++;
            if (sev === 'A') previous.A++;
            if (sev === 'B') previous.B++;
            if (sev === 'C') previous.C++;
            if (sev === 'O') previous.O++;
            if (isPed) previous.ped++;
            if (isBike) previous.bike++;
        }
    });

    // Set historical start year from earliest data
    if (earliestDate) {
        historical.startYear = earliestDate.getFullYear();
    }

    const calcChange = (curr, prev) => prev > 0 ? Math.round(((curr - prev) / prev) * 100) : (curr > 0 ? 100 : 0);

    // Format period strings for explicit disclosure
    const formatPeriod = (startDt, endDt) => {
        if (!startDt || !endDt) return null;
        const opts = { year: 'numeric', month: 'short' };
        return `${startDt.toLocaleDateString('en-US', opts)} - ${endDt.toLocaleDateString('en-US', opts)}`;
    };

    // Get quarter label (e.g., "Q1 2026")
    const getQuarterName = (startDt) => {
        if (!startDt) return null;
        const month = startDt.getMonth();
        const year = startDt.getFullYear();
        const q = Math.floor(month / 3) + 1;
        return `Q${q} ${year}`;
    };

    return {
        current,
        previous,
        historical, // NEW: Total crashes since start of data
        changes: {
            total: calcChange(current.total, previous.total),
            KA: calcChange(current.K + current.A, previous.K + previous.A),
            fatal: calcChange(current.K, previous.K),
            serious: calcChange(current.A, previous.A),
            ped: calcChange(current.ped, previous.ped),
            bike: calcChange(current.bike, previous.bike)
        },
        hasPreviousData: previous.total > 0,
        currentPeriod: formatPeriod(start, end),
        previousPeriod: formatPeriod(prevStart, prevEnd),
        currentQuarter: getQuarterName(start),
        previousQuarter: getQuarterName(prevStart)
    };
}


async function computeLocationDetails(crashes, topLocations) {
    return topLocations.map(loc => {
        const locCrashes = crashes.filter(c => c[COL.ROUTE] === loc.name);
        const collisions = {};
        locCrashes.forEach(c => {
            const type = c[COL.COLLISION] || 'Unknown';
            collisions[type] = (collisions[type] || 0) + 1;
        });
        const topCollisions = Object.entries(collisions).sort((a, b) => b[1] - a[1]).slice(0, 3);
        return { ...loc, topCollisions, crashDetails: locCrashes.length };
    });
}

async function generateAISectionInsight(section, data) {
    const apiKey = getGrantApiKey();
    if (!apiKey) return null;

    const prompts = {
        executive: `As a traffic safety analyst, provide a 2-3 sentence executive summary insight for a quarterly crash report.
Data: ${data.total} total crashes in ${data.quarter} for ${data.agency}
Severity: ${data.K} fatal, ${data.A} serious injury, EPDO score: ${data.epdo}
Trend: ${data.trend.totalChange > 0 ? 'Increase' : 'Decrease'} of ${Math.abs(data.trend.totalChange)}% from previous period
Vulnerable users: ${data.ped} pedestrian, ${data.bike} bicycle crashes
Provide actionable insight in professional government report style. No headers, just the insight paragraph.`,

        severity: `Analyze this crash severity distribution for a safety report:
Fatal (K): ${data.K}, Serious Injury (A): ${data.A}, Moderate (B): ${data.B}, Minor (C): ${data.C}, PDO (O): ${data.O}
Total: ${data.total}
Fatal trend: ${data.trend.fatalChange > 0 ? '+' : ''}${data.trend.fatalChange}% vs previous period
Provide a 2-sentence analysis of what this distribution indicates about safety. Professional tone.`,

        locations: `Identify safety patterns for these top crash locations:
${data.topLocations.map((l, i) => `${i+1}. ${l.name}: ${l.total} crashes, ${l.K} fatal, ${l.A} serious, EPDO ${l.epdo}`).join('\n')}
Total system crashes: ${data.total}
Provide a 2-3 sentence analysis of location patterns and concentration. Professional tone.`,

        temporal: `Analyze these temporal crash patterns for a safety report:
Peak day: ${data.peakPatterns.peakDay}
Peak time: ${data.peakPatterns.peakTime}
${data.monthlyTrends.length > 0 ? `Monthly range: ${data.monthlyTrends[0].month} to ${data.monthlyTrends[data.monthlyTrends.length-1].month}` : ''}
Provide 2-3 sentences on what these patterns suggest for safety interventions. Professional tone.`,

        focus: `Analyze this safety focus area for a quarterly report:
Primary concern: ${data.focusTopic.topic} (${data.focusTopic.count} crashes, ${data.focusTopic.percent}%)
Pedestrian crashes: ${data.vulnerableUsers.ped.total} (${data.vulnerableUsers.ped.K} fatal, ${data.vulnerableUsers.ped.A} serious)
Bicycle crashes: ${data.vulnerableUsers.bike.total} (${data.vulnerableUsers.bike.K} fatal, ${data.vulnerableUsers.bike.A} serious)
Provide 2-3 sentences on priorities and targeted interventions. Professional tone.`,

        countermeasures: `Recommend evidence-based countermeasures for these high-crash locations:
${data.topLocations.map(l => `${l.name}: ${l.total} crashes`).join(', ')}
Top collision types: ${data.collisionBreakdown.slice(0, 3).map(c => `${c.name} (${c.count})`).join(', ')}
Contributing factors: ${data.factors.map(f => `${f[0]} (${f[1]})`).join(', ')}
Provide 3-4 specific, actionable FHWA-approved countermeasure recommendations. Professional tone, bullet-point style.`
    };

    try {
        const result = await callGrantAI(prompts[section],
            'You are a senior traffic safety analyst writing insights for a government quarterly crash report. Be concise, data-driven, and professional. Focus on actionable insights.');
        return result;
    } catch (e) {
        console.warn(`[AI Insight] ${section} failed:`, e);
        return null;
    }
}

function renderComprehensivePreview(data) {
    const container = document.getElementById('comprehensivePreviewContent');
    const m = data.metadata;
    const r = data.rawData;
    const ai = data.aiInsights || {};
    // CC 341 F3 — FHWA 2025 EPDO weights (FHWA-SA-25-021), sourced from the shared constants.
    const EPDO_W = (window.CL && window.CL.core && window.CL.core.constants && window.CL.core.constants.EPDO_WEIGHTS_DEFAULT)
                || { K: 883, A: 94, B: 21, C: 11, O: 1 };

    // ============================================
    // WORLD-CLASS DESIGN - COLOR PALETTE
    // ============================================
    const COLORS = {
        navy: '#1E3A5F',           // Primary headers, titles, authority
        navyLight: '#2563eb',      // Accents
        slate: '#475569',          // Body text, secondary
        slateLight: '#64748b',     // Muted text
        white: '#FFFFFF',
        lightGray: '#F1F5F9',      // Section backgrounds
        border: '#E2E8F0',
        // Severity accent colors
        fatal: '#991B1B',          // Dark red
        serious: '#C2410C',        // Burnt orange
        moderate: '#A16207',       // Amber
        minor: '#1D4ED8',          // Blue
        pdo: '#9CA3AF'             // Gray
    };

    // Helper: Generate severity stacked bar (horizontal) with segment labels
    const generateSeverityBar = (stats, maxWidth = 100) => {
        const total = stats.total || 1;
        const segments = [
            { key: 'O', color: COLORS.pdo, label: 'PDO' },
            { key: 'C', color: COLORS.minor, label: 'Minor' },
            { key: 'B', color: COLORS.moderate, label: 'Moderate' },
            { key: 'A', color: COLORS.serious, label: 'Serious' },
            { key: 'K', color: COLORS.fatal, label: 'Fatal' }
        ];
        return segments.map(s => {
            const pct = (stats[s.key] / total * 100);
            return pct > 1 ? `<div style="width:${pct}%;background:${s.color};height:100%;display:flex;align-items:center;justify-content:center;color:white;font-size:.65rem;font-weight:600;text-shadow:0 1px 2px rgba(0,0,0,.3)" title="${s.label}: ${stats[s.key]} (${pct.toFixed(1)}%)">${pct >= 5 ? s.label : ''}</div>` : '';
        }).join('');
    };

    // Helper: Generate trend indicator with arrow
    const trendIndicator = (change, label) => {
        const isUp = change > 0;
        const color = isUp ? COLORS.fatal : '#16a34a';
        const arrow = isUp ? '▲' : '▼';
        return `<span style="color:${color};font-weight:600;display:inline-flex;align-items:center;gap:2px">${arrow} ${Math.abs(change)}%</span>`;
    };

    // Helper: Format hour for display
    const formatHour = (h) => {
        if (h === 0) return '12 AM';
        if (h === 12) return '12 PM';
        return h > 12 ? `${h-12} PM` : `${h} AM`;
    };

    // Helper: Get heat color based on risk (0-1) - improved gradient
    const getHeatColor = (risk) => {
        if (risk === 0) return COLORS.lightGray;
        if (risk < 0.2) return '#FEE2E2';   // Very light red
        if (risk < 0.4) return '#FECACA';   // Light red
        if (risk < 0.6) return '#F87171';   // Medium red
        if (risk < 0.8) return '#DC2626';   // Red
        return COLORS.fatal;                 // Dark red for highest
    };

    // Generate Day×Hour Heat Matrix HTML - WORLD-CLASS DESIGN
    const generateDayHourMatrix = () => {
        if (!r.dayHourMatrix) return `<p style="color:${COLORS.slateLight}">Temporal data not available</p>`;
        const { matrix, dayNames, peakCell } = r.dayHourMatrix;
        const hours = [0, 3, 6, 9, 12, 15, 18, 21]; // Show every 3 hours for readability

        let html = `<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.7rem;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.05)">`;
        html += `<thead><tr><th style="padding:6px 4px;background:${COLORS.navy};color:white;font-weight:600"></th>`;
        hours.forEach(h => {
            html += `<th style="padding:6px 4px;background:${COLORS.navy};color:white;font-weight:500;font-size:.65rem">${formatHour(h)}</th>`;
        });
        html += '</tr></thead><tbody>';

        dayNames.forEach(day => {
            html += `<tr><td style="padding:6px 4px;border:1px solid ${COLORS.border};font-weight:600;background:${COLORS.lightGray};color:${COLORS.navy}">${day.slice(0,3)}</td>`;
            hours.forEach(h => {
                const cell = matrix[day][h];
                const bgColor = getHeatColor(cell.risk);
                const hasKA = cell.K > 0 || cell.A > 0;
                const isPeak = peakCell && peakCell.day === day && peakCell.hour === h;
                const textColor = cell.risk >= 0.6 ? 'white' : COLORS.slate;
                html += `<td style="padding:6px 4px;border:1px solid ${COLORS.border};background:${bgColor};text-align:center;color:${textColor};${hasKA ? 'font-weight:700;' : ''}${isPeak ? 'box-shadow:inset 0 0 0 2px #000;' : ''}" title="${day} ${formatHour(h)}: ${cell.count} crashes${hasKA ? ` (${cell.K}K, ${cell.A}A)` : ''}">${cell.count || '-'}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table></div>';
        // Improved color legend
        html += `<div style="display:flex;gap:.5rem;margin-top:.75rem;font-size:.7rem;align-items:center;flex-wrap:wrap">
            <span style="color:${COLORS.slate};font-weight:500">Risk Level:</span>
            <span style="background:${COLORS.lightGray};padding:3px 10px;border-radius:4px;border:1px solid ${COLORS.border}">Low</span>
            <span style="background:#FEE2E2;padding:3px 10px;border-radius:4px;border:1px solid #FECACA">Medium</span>
            <span style="background:#F87171;color:white;padding:3px 10px;border-radius:4px">High</span>
            <span style="background:${COLORS.fatal};color:white;padding:3px 10px;border-radius:4px;font-weight:600">Critical</span>
        </div>`;
        return html;
    };

    // Generate collision type horizontal bars - WORLD-CLASS DESIGN
    const generateCollisionBars = () => {
        const maxEpdo = Math.max(...r.collisionBreakdown.slice(0, 8).map(c => c.epdo)) || 1;
        return r.collisionBreakdown.slice(0, 8).map((ct, idx) => {
            const barWidth = (ct.epdo / maxEpdo * 100);
            const hasKA = ct.K > 0 || ct.A > 0;
            const hasFatal = ct.K > 0;
            const displayName = formatCollisionType(ct.name);
            // Use graduated colors based on severity
            const barColor = hasFatal ? COLORS.fatal : (hasKA ? COLORS.serious : COLORS.navy);
            return `<div style="margin-bottom:.75rem;padding:.5rem;background:${idx === 0 ? 'linear-gradient(135deg,#fef2f2,#fff)' : COLORS.white};border:1px solid ${COLORS.border};border-radius:6px;${hasFatal ? 'border-left:3px solid ' + COLORS.fatal : ''}">
                <div style="display:flex;justify-content:space-between;align-items:baseline;font-size:.8rem;margin-bottom:4px">
                    <span style="color:${COLORS.navy};font-weight:${hasKA ? '700' : '500'}">${displayName}</span>
                    <span style="color:${COLORS.slateLight};font-size:.7rem">${ct.count.toLocaleString()} crashes</span>
                </div>
                <div style="height:10px;background:${COLORS.lightGray};border-radius:5px;overflow:hidden;box-shadow:inset 0 1px 2px rgba(0,0,0,.05)">
                    <div style="height:100%;width:${barWidth}%;background:linear-gradient(90deg,${barColor} 0%,${barColor}dd 100%);border-radius:5px;transition:width .3s"></div>
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:.65rem;color:${COLORS.slateLight}">
                    <span>${hasFatal ? `<span style="color:${COLORS.fatal};font-weight:600">● ${ct.K} Fatal</span>` : ''}${ct.A > 0 ? ` <span style="color:${COLORS.serious}">● ${ct.A} Serious</span>` : ''}</span>
                    <span style="font-weight:600;color:${COLORS.navy}">EPDO: ${ct.epdo.toLocaleString()}</span>
                </div>
            </div>`;
        }).join('');
    };

    // Generate location cards with EPDO bars - WORLD-CLASS DESIGN
    const generateLocationCards = () => {
        const maxEpdo = Math.max(...r.topLocations.map(l => l.epdo)) || 1;
        return r.topLocations.slice(0, 5).map((loc, i) => {
            const barWidth = (loc.epdo / maxEpdo * 100);
            const hasFatal = loc.K > 0;
            const hasKA = hasFatal || loc.A > 0;
            // Rank badge colors
            const rankColors = [
                { bg: COLORS.fatal, border: COLORS.fatal },
                { bg: COLORS.serious, border: COLORS.serious },
                { bg: COLORS.moderate, border: COLORS.moderate },
                { bg: COLORS.slate, border: COLORS.slate },
                { bg: COLORS.slateLight, border: COLORS.slateLight }
            ];
            const rank = rankColors[i] || rankColors[4];

            return `<div style="background:${i === 0 ? 'linear-gradient(135deg,rgba(153,27,27,.05),#fff)' : COLORS.white};border:1px solid ${i === 0 ? COLORS.fatal + '40' : COLORS.border};border-left:4px solid ${rank.bg};border-radius:8px;padding:.85rem;margin-bottom:.6rem;box-shadow:0 2px 8px rgba(0,0,0,.05)">
                <div style="display:flex;justify-content:space-between;align-items:flex-start">
                    <div style="flex:1">
                        <div style="display:flex;align-items:center;gap:.6rem">
                            <span style="background:${rank.bg};color:white;font-size:.75rem;font-weight:700;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px ${rank.bg}60">${i+1}</span>
                            <span style="font-weight:600;color:${COLORS.navy};font-size:.9rem">${formatRouteName(loc.name)}</span>
                        </div>
                        <div style="display:flex;gap:.75rem;margin-top:.5rem;font-size:.75rem;color:${COLORS.slateLight}">
                            <span style="background:${COLORS.lightGray};padding:2px 8px;border-radius:4px">${loc.total.toLocaleString()} crashes</span>
                            ${hasFatal ? `<span style="color:${COLORS.fatal};font-weight:600;background:#fef2f2;padding:2px 8px;border-radius:4px">● ${loc.K} Fatal</span>` : ''}
                            ${loc.A > 0 ? `<span style="color:${COLORS.serious};background:#fff7ed;padding:2px 8px;border-radius:4px">● ${loc.A} Serious</span>` : ''}
                        </div>
                    </div>
                    <div style="text-align:right;min-width:70px">
                        <div style="font-size:1.4rem;font-weight:700;color:${COLORS.navy};letter-spacing:-.02em">${loc.epdo.toLocaleString()}</div>
                        <div style="font-size:.6rem;color:${COLORS.slateLight};text-transform:uppercase;letter-spacing:.05em">EPDO Score</div>
                    </div>
                </div>
                <div style="margin-top:.6rem">
                    <div style="display:flex;justify-content:space-between;margin-bottom:3px;font-size:.6rem;color:${COLORS.slateLight}">
                        <span>EPDO relative to top location</span>
                        <span>${barWidth.toFixed(0)}%</span>
                    </div>
                    <div style="height:8px;background:${COLORS.lightGray};border-radius:4px;overflow:hidden;box-shadow:inset 0 1px 2px rgba(0,0,0,.05)">
                        <div style="height:100%;width:${barWidth}%;background:linear-gradient(90deg,${hasFatal ? COLORS.fatal : COLORS.navy} 0%,${hasFatal ? COLORS.serious : COLORS.navyLight} 100%);border-radius:4px;transition:width .3s"></div>
                    </div>
                </div>
            </div>`;
        }).join('');
    };

    // AI disclaimer - enhanced design
    const aiDisclaimer = `<div style="margin-top:.75rem;padding:.6rem .8rem;background:linear-gradient(135deg,rgba(245,158,11,.08),rgba(245,158,11,.03));border-left:3px solid #f59e0b;border-radius:0 6px 6px 0;font-size:.7rem;color:#92400e;display:flex;align-items:center;gap:.5rem">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        AI-generated insight - requires human review and validation
    </div>`;

    // Helper: Calculate and validate EPDO totals
    const validateEPDO = () => {
        const computed = (r.stats.K * EPDO_W.K) + (r.stats.A * EPDO_W.A) + (r.stats.B * EPDO_W.B) + (r.stats.C * EPDO_W.C) + (r.stats.O * EPDO_W.O);
        const stored = calcEPDO(r.stats);
        const hasDiscrepancy = Math.abs(computed - stored) > 1;
        return { computed, stored, hasDiscrepancy };
    };
    const epdoValidation = validateEPDO();

    // CC 370 — preview parity with the exported document. The on-screen preview
    // previously omitted Contributing Factors (weather + light), Safety
    // Priorities/Recommendations, and Funding Opportunities even though the
    // PDF/Word exports render them (pages 9/12/13). These reuse the same rawData
    // (r.factors / r.weatherImpact / r.lightConditions / r.topLocations /
    // r.vulnerableUsers) and stay defensive (CC 367 style) so an empty or absent
    // array renders an honest empty-state line instead of a blank section.
    const cc370Factors = Array.isArray(r.factors) ? r.factors : [];
    const cc370Weather = Array.isArray(r.weatherImpact) ? r.weatherImpact : [];
    const cc370Light   = Array.isArray(r.lightConditions) ? r.lightConditions : [];
    const cc370TopLocs = Array.isArray(r.topLocations) ? r.topLocations : [];

    const cc370EmptyLine = (label) => `<p style="color:${COLORS.slateLight};font-size:.8rem;margin:.25rem 0">No ${label} data available for this scope.</p>`;

    // Shared labeled-bar list (factors / weather / light share this shape).
    const cc370BarList = (items, total, accent) => {
        if (!items.length) return '';
        const max = Math.max(...items.map(it => it.count)) || 1;
        return items.map(it => {
            const pct = total > 0 ? (it.count / total * 100) : 0;
            const w = (it.count / max * 100);
            return `<div style="margin-bottom:.6rem">
                <div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:3px">
                    <span style="color:${COLORS.navy};font-weight:500">${it.name}</span>
                    <span style="color:${COLORS.slateLight};font-size:.7rem">${it.count.toLocaleString()} (${pct.toFixed(1)}%)</span>
                </div>
                <div style="height:8px;background:${COLORS.lightGray};border-radius:4px;overflow:hidden">
                    <div style="height:100%;width:${w}%;background:${accent};border-radius:4px"></div>
                </div>
            </div>`;
        }).join('');
    };

    const generateContributingFactors = () => {
        // r.factors are [name, count] tuples (PDF reads f[0]/f[1]); normalize.
        const factorObjs = cc370Factors.map(f => Array.isArray(f)
            ? { name: f[0], count: Number(f[1]) || 0 }
            : { name: f && f.name, count: Number(f && f.count) || 0 });
        const total = r.stats.total || 1;
        return `
            <div style="display:grid;grid-template-columns:1fr;gap:1.25rem">
                <div>
                    <h4 style="margin:0 0 .6rem 0;color:${COLORS.navy};font-size:.9rem;font-weight:600">Primary Contributing Factors</h4>
                    ${factorObjs.length ? cc370BarList(factorObjs.slice(0, 8), total, '#f59e0b') : cc370EmptyLine('contributing factor')}
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem">
                    <div>
                        <h4 style="margin:0 0 .6rem 0;color:${COLORS.navy};font-size:.9rem;font-weight:600">Weather Conditions</h4>
                        ${cc370Weather.length ? cc370BarList(cc370Weather.slice(0, 5), total, '#0891b2') : cc370EmptyLine('weather')}
                    </div>
                    <div>
                        <h4 style="margin:0 0 .6rem 0;color:${COLORS.navy};font-size:.9rem;font-weight:600">Light Conditions</h4>
                        ${cc370Light.length ? cc370BarList(cc370Light.slice(0, 5), total, '#6366f1') : cc370EmptyLine('light condition')}
                    </div>
                </div>
            </div>`;
    };

    const generateRecommendations = () => {
        if (!cc370TopLocs.length) return cc370EmptyLine('priority location');
        const primaryType = (r.collisionBreakdown && r.collisionBreakdown[0] && r.collisionBreakdown[0].name)
            ? formatCollisionType(r.collisionBreakdown[0].name) : 'Various';
        return cc370TopLocs.slice(0, 5).map((loc, i) => `
            <div style="padding:.75rem;border:1px solid ${COLORS.border};border-left:4px solid ${i === 0 ? COLORS.fatal : COLORS.navy};border-radius:6px;margin-bottom:.5rem;background:${COLORS.white}">
                <div style="display:flex;justify-content:space-between;align-items:baseline">
                    <span style="font-weight:600;color:${i === 0 ? COLORS.fatal : COLORS.navy};font-size:.85rem">Priority ${i + 1}: ${formatRouteName(loc.name)}</span>
                    <span style="font-weight:700;color:${COLORS.navy};font-size:.85rem">EPDO ${(loc.epdo || 0).toLocaleString()}</span>
                </div>
                <div style="font-size:.7rem;color:${COLORS.slateLight};margin-top:.25rem">Total: ${(loc.total || 0).toLocaleString()} | Fatal: ${loc.K || 0} | Serious: ${loc.A || 0} | Primary crash type: ${primaryType}</div>
            </div>`).join('');
    };

    const generateFundingSection = () => {
        const pedTotal = r.vulnerableUsers?.ped?.total ?? 0;
        const bikeTotal = r.vulnerableUsers?.bike?.total ?? 0;
        const pedEligible = pedTotal > 10;
        const fatalEligible = (r.stats.K || 0) > 0;
        let statePrograms = [];
        try { statePrograms = _stateFundingPrograms() || []; } catch (e) { statePrograms = []; }
        return `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem">
                <div>
                    <h4 style="margin:0 0 .5rem 0;color:${COLORS.navy};font-size:.9rem;font-weight:600">Federal Programs</h4>
                    <ul style="margin:0;padding-left:1.1rem;font-size:.8rem;color:${COLORS.slate};line-height:1.7">
                        <li>Highway Safety Improvement Program (HSIP)</li>
                        <li>Safe Streets and Roads for All (SS4A)</li>
                        <li>NHTSA Section 402/405 Grants</li>
                    </ul>
                    <h4 style="margin:.85rem 0 .5rem 0;color:${COLORS.navy};font-size:.9rem;font-weight:600">State Programs</h4>
                    <ul style="margin:0;padding-left:1.1rem;font-size:.8rem;color:${COLORS.slate};line-height:1.7">
                        ${statePrograms.length ? statePrograms.map(p => `<li>${p}</li>`).join('') : `<li style="list-style:none;color:${COLORS.slateLight}">State-specific programs not configured</li>`}
                    </ul>
                </div>
                <div>
                    <h4 style="margin:0 0 .5rem 0;color:${COLORS.navy};font-size:.9rem;font-weight:600">Eligibility Indicators</h4>
                    <div style="font-size:.8rem;color:${pedEligible ? '#16a34a' : COLORS.slateLight};margin-bottom:.4rem">${pedEligible ? '✓' : '○'} Pedestrian/Bicycle Safety Funding (${pedTotal + bikeTotal} VRU crashes)</div>
                    <div style="font-size:.8rem;color:${fatalEligible ? '#16a34a' : COLORS.slateLight}">${fatalEligible ? '✓' : '○'} Fatal Crash Reduction Programs (${r.stats.K || 0} fatal crashes)</div>
                    <p style="font-size:.7rem;color:${COLORS.slateLight};margin:.6rem 0 0 0;line-height:1.5">Eligibility indicators are derived from the crash profile and require confirmation against current program guidance.</p>
                </div>
            </div>`;
    };

    // Build the complete preview - WORLD-CLASS DESIGN
    container.innerHTML = `
        <!-- Executive Dashboard Header - WORLD-CLASS DESIGN -->
        <div style="background:linear-gradient(135deg,${COLORS.navy} 0%,#2563eb 100%);color:white;padding:2rem;border-radius:12px;margin-bottom:1.5rem;box-shadow:0 4px 20px rgba(30,58,95,.25)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
                <div>
                    <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;opacity:.85;margin-bottom:.25rem">${m.agency.toUpperCase()}</div>
                    <h2 style="margin:0;font-size:1.75rem;font-weight:700;letter-spacing:-.02em">${m.title}</h2>
                    <p style="margin:.5rem 0 0 0;opacity:.9;font-size:.9rem">${m.department}</p>
                    <p style="margin:.5rem 0 0 0;opacity:.75;font-size:.85rem;display:flex;align-items:center;gap:.5rem">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ${m.quarter}
                    </p>
                </div>
                <div style="text-align:right">
                    <div style="font-size:3rem;font-weight:700;letter-spacing:-.02em">${m.crashCount.toLocaleString()}</div>
                    <div style="font-size:.8rem;opacity:.85;text-transform:uppercase;letter-spacing:.05em">Crashes Analyzed</div>
                </div>
            </div>
        </div>

        <!-- KPI Cards Row - WORLD-CLASS DESIGN with Icons -->
        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:1rem;margin-bottom:1.5rem">
            <div style="background:linear-gradient(135deg,#fef2f2,${COLORS.white});padding:1.25rem;border-radius:10px;border-left:4px solid ${COLORS.fatal};box-shadow:0 2px 8px rgba(0,0,0,.05)">
                <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem">
                    <svg width="18" height="18" fill="none" stroke="${COLORS.fatal}" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span style="font-size:.75rem;color:#7f1d1d;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Fatal (K)</span>
                </div>
                <div style="font-size:2.25rem;font-weight:700;color:${COLORS.fatal};letter-spacing:-.02em">${r.stats.K}</div>
                ${r.yoyComparison?.hasPreviousData ? `<div style="font-size:.7rem;margin-top:.35rem;color:${COLORS.slateLight}">vs prior: ${trendIndicator(r.yoyComparison.changes.fatal, 'fatal')}</div>` : `<div style="font-size:.7rem;margin-top:.35rem;color:${COLORS.slateLight}">Life-threatening incidents</div>`}
            </div>
            <div style="background:linear-gradient(135deg,#fff7ed,${COLORS.white});padding:1.25rem;border-radius:10px;border-left:4px solid ${COLORS.serious};box-shadow:0 2px 8px rgba(0,0,0,.05)">
                <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem">
                    <svg width="18" height="18" fill="none" stroke="${COLORS.serious}" stroke-width="2" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>
                    <span style="font-size:.75rem;color:#7c2d12;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Serious (A)</span>
                </div>
                <div style="font-size:2.25rem;font-weight:700;color:${COLORS.serious};letter-spacing:-.02em">${r.stats.A}</div>
                <div style="font-size:.7rem;margin-top:.35rem;color:${COLORS.slateLight}">K+A Rate: <strong>${((r.stats.K + r.stats.A) / (r.stats.total || 1) * 100).toFixed(1)}%</strong></div>
            </div>
            <div style="background:linear-gradient(135deg,#eff6ff,${COLORS.white});padding:1.25rem;border-radius:10px;border-left:4px solid ${COLORS.navy};box-shadow:0 2px 8px rgba(0,0,0,.05)">
                <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem">
                    <svg width="18" height="18" fill="none" stroke="${COLORS.navy}" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    <span style="font-size:.75rem;color:${COLORS.navy};font-weight:600;text-transform:uppercase;letter-spacing:.05em">EPDO Score</span>
                </div>
                <div style="font-size:2.25rem;font-weight:700;color:${COLORS.navy};letter-spacing:-.02em">${calcEPDO(r.stats).toLocaleString()}</div>
                <div style="font-size:.7rem;margin-top:.35rem;color:${COLORS.slateLight}">Severity-weighted impact</div>
            </div>
            <div style="background:linear-gradient(135deg,${r.trendData.totalChange > 0 ? '#fef2f2' : '#f0fdf4'},${COLORS.white});padding:1.25rem;border-radius:10px;border-left:4px solid ${r.trendData.totalChange > 0 ? COLORS.fatal : '#16a34a'};box-shadow:0 2px 8px rgba(0,0,0,.05)">
                <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem">
                    <svg width="18" height="18" fill="none" stroke="${r.trendData.totalChange > 0 ? COLORS.fatal : '#16a34a'}" stroke-width="2" viewBox="0 0 24 24"><polyline points="${r.trendData.totalChange > 0 ? '23 6 13.5 15.5 8.5 10.5 1 18' : '23 18 13.5 8.5 8.5 13.5 1 6'}"/><polyline points="${r.trendData.totalChange > 0 ? '17 6 23 6 23 12' : '17 18 23 18 23 12'}"/></svg>
                    <span style="font-size:.75rem;color:${r.trendData.totalChange > 0 ? '#7f1d1d' : '#14532d'};font-weight:600;text-transform:uppercase;letter-spacing:.05em">Trend</span>
                </div>
                <div style="font-size:2.25rem;font-weight:700;color:${r.trendData.totalChange > 0 ? COLORS.fatal : '#16a34a'};letter-spacing:-.02em">${r.trendData.totalChange > 0 ? '+' : ''}${r.trendData.totalChange}%</div>
                <div style="font-size:.7rem;margin-top:.35rem;color:${COLORS.slateLight}">vs prior period</div>
            </div>
        </div>

        <!-- QUARTER COMPARISON - THE MAIN FOCUS -->
        ${r.yoyComparison?.hasPreviousData ? `
        <div style="background:linear-gradient(135deg,#1E3A5F 0%,#2563eb 100%);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;color:white;box-shadow:0 4px 20px rgba(30,58,95,.25)">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1rem">
                <svg width="24" height="24" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                <h3 style="margin:0;font-size:1.25rem;font-weight:700">Quarter-over-Quarter Comparison</h3>
            </div>
            <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:1rem;align-items:center">
                <!-- Previous Quarter -->
                <div style="background:rgba(255,255,255,.1);padding:1rem;border-radius:8px;text-align:center">
                    <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;opacity:.8;margin-bottom:.5rem">${r.yoyComparison.previousQuarter || 'Previous Quarter'}</div>
                    <div style="font-size:2rem;font-weight:700">${r.yoyComparison.previous.total.toLocaleString()}</div>
                    <div style="font-size:.75rem;opacity:.9">crashes</div>
                    <div style="margin-top:.5rem;font-size:.7rem;opacity:.8">
                        <span style="color:#fca5a5">${r.yoyComparison.previous.K} fatal</span> •
                        <span style="color:#fed7aa">${r.yoyComparison.previous.A} serious</span>
                    </div>
                </div>
                <!-- Arrow & Change -->
                <div style="text-align:center">
                    <div style="font-size:2rem;margin-bottom:.25rem">→</div>
                    <div style="background:${r.yoyComparison.changes.total > 0 ? 'rgba(220,38,38,.9)' : 'rgba(22,163,74,.9)'};padding:.5rem 1rem;border-radius:20px;font-weight:700;font-size:1rem">
                        ${r.yoyComparison.changes.total > 0 ? '▲' : '▼'} ${Math.abs(r.yoyComparison.changes.total)}%
                    </div>
                </div>
                <!-- Current Quarter -->
                <div style="background:rgba(255,255,255,.15);padding:1rem;border-radius:8px;text-align:center;border:2px solid rgba(255,255,255,.3)">
                    <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;opacity:.8;margin-bottom:.5rem">${r.yoyComparison.currentQuarter || 'Current Quarter'}</div>
                    <div style="font-size:2rem;font-weight:700">${r.yoyComparison.current.total.toLocaleString()}</div>
                    <div style="font-size:.75rem;opacity:.9">crashes</div>
                    <div style="margin-top:.5rem;font-size:.7rem;opacity:.8">
                        <span style="color:#fca5a5">${r.yoyComparison.current.K} fatal</span> •
                        <span style="color:#fed7aa">${r.yoyComparison.current.A} serious</span>
                    </div>
                </div>
            </div>
            <!-- Additional Metrics -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.2)">
                <div style="text-align:center">
                    <div style="font-size:.65rem;text-transform:uppercase;opacity:.7">Fatal Change</div>
                    <div style="font-size:1.1rem;font-weight:700;color:${r.yoyComparison.changes.fatal > 0 ? '#fca5a5' : '#86efac'}">${r.yoyComparison.changes.fatal > 0 ? '+' : ''}${r.yoyComparison.changes.fatal}%</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:.65rem;text-transform:uppercase;opacity:.7">Serious Change</div>
                    <div style="font-size:1.1rem;font-weight:700;color:${r.yoyComparison.changes.serious > 0 ? '#fca5a5' : '#86efac'}">${r.yoyComparison.changes.serious > 0 ? '+' : ''}${r.yoyComparison.changes.serious}%</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:.65rem;text-transform:uppercase;opacity:.7">K+A Change</div>
                    <div style="font-size:1.1rem;font-weight:700;color:${r.yoyComparison.changes.KA > 0 ? '#fca5a5' : '#86efac'}">${r.yoyComparison.changes.KA > 0 ? '+' : ''}${r.yoyComparison.changes.KA}%</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:.65rem;text-transform:uppercase;opacity:.7">Pedestrian Change</div>
                    <div style="font-size:1.1rem;font-weight:700;color:${r.yoyComparison.changes.ped > 0 ? '#fca5a5' : '#86efac'}">${r.yoyComparison.changes.ped > 0 ? '+' : ''}${r.yoyComparison.changes.ped}%</div>
                </div>
            </div>
        </div>
        ` : ''}

        <!-- Historical Context - Total Since Database Start -->
        ${r.yoyComparison?.historical ? `
        <div style="background:${COLORS.lightGray};border:1px solid ${COLORS.border};border-radius:8px;padding:1rem;margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
            <div style="display:flex;align-items:center;gap:.75rem">
                <svg width="20" height="20" fill="none" stroke="${COLORS.navy}" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div>
                    <div style="font-size:.7rem;color:${COLORS.slateLight};text-transform:uppercase;letter-spacing:.05em">Historical Total (Since ${r.yoyComparison.historical.startYear})</div>
                    <div style="font-size:1.25rem;font-weight:700;color:${COLORS.navy}">${r.yoyComparison.historical.total.toLocaleString()} total crashes</div>
                </div>
            </div>
            <div style="display:flex;gap:1.5rem;font-size:.8rem">
                <div style="text-align:center">
                    <div style="font-weight:700;color:${COLORS.fatal}">${r.yoyComparison.historical.K}</div>
                    <div style="color:${COLORS.slateLight};font-size:.7rem">Fatal</div>
                </div>
                <div style="text-align:center">
                    <div style="font-weight:700;color:${COLORS.serious}">${r.yoyComparison.historical.A}</div>
                    <div style="color:${COLORS.slateLight};font-size:.7rem">Serious</div>
                </div>
                <div style="text-align:center">
                    <div style="font-weight:700;color:#0891b2">${r.yoyComparison.historical.ped}</div>
                    <div style="color:${COLORS.slateLight};font-size:.7rem">Pedestrian</div>
                </div>
                <div style="text-align:center">
                    <div style="font-weight:700;color:#059669">${r.yoyComparison.historical.bike}</div>
                    <div style="color:${COLORS.slateLight};font-size:.7rem">Bicycle</div>
                </div>
            </div>
        </div>
        ` : ''}

        <!-- Headlines / Key Insights - WORLD-CLASS DESIGN -->
        ${r.dataInsights && r.dataInsights.length > 0 ? `
        <div style="background:linear-gradient(135deg,${COLORS.lightGray},${COLORS.white});border:1px solid ${COLORS.border};border-radius:10px;padding:1.25rem;margin-bottom:1.5rem;box-shadow:0 2px 8px rgba(0,0,0,.03)">
            <h4 style="margin:0 0 1rem 0;color:${COLORS.navy};font-size:.95rem;display:flex;align-items:center;gap:.75rem">
                <span style="background:linear-gradient(135deg,#fef3c7,#fde68a);padding:6px 12px;border-radius:6px;font-size:.7rem;color:#92400e;font-weight:700;text-transform:uppercase;letter-spacing:.05em;box-shadow:0 1px 3px rgba(245,158,11,.2)">
                    <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="display:inline;vertical-align:middle;margin-right:4px"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                    KEY FINDINGS
                </span>
            </h4>
            <ul style="margin:0;padding-left:0;list-style:none;font-size:.85rem;color:${COLORS.slate};line-height:1.7">
                ${r.dataInsights.map(insight => `<li style="margin-bottom:.6rem;padding-left:1.5rem;position:relative"><span style="position:absolute;left:0;color:${COLORS.navy};font-weight:600">→</span> ${sanitizeTextForExport(insight)}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        <!-- Severity Distribution Bar - WORLD-CLASS DESIGN -->
        <div style="margin-bottom:1.5rem;background:${COLORS.white};padding:1.25rem;border-radius:10px;border:1px solid ${COLORS.border};box-shadow:0 2px 8px rgba(0,0,0,.03)">
            <h3 style="color:${COLORS.navy};margin:0 0 1rem 0;font-size:1.1rem;font-weight:600;display:flex;align-items:center;gap:.5rem">
                <svg width="20" height="20" fill="none" stroke="${COLORS.navy}" stroke-width="2" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                Severity Distribution
            </h3>
            <div style="height:32px;border-radius:8px;overflow:hidden;display:flex;box-shadow:0 2px 4px rgba(0,0,0,.1)">
                ${generateSeverityBar(r.stats)}
            </div>
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:.5rem;margin-top:1rem">
                <div style="text-align:center;padding:.5rem;background:rgba(153,27,27,.05);border-radius:6px">
                    <div style="font-size:.65rem;color:${COLORS.fatal};font-weight:600;text-transform:uppercase">Fatal</div>
                    <div style="font-size:1rem;font-weight:700;color:${COLORS.fatal}">${r.stats.K}</div>
                    <div style="font-size:.6rem;color:${COLORS.slateLight}">${(r.stats.K/r.stats.total*100).toFixed(1)}%</div>
                </div>
                <div style="text-align:center;padding:.5rem;background:rgba(194,65,12,.05);border-radius:6px">
                    <div style="font-size:.65rem;color:${COLORS.serious};font-weight:600;text-transform:uppercase">Serious</div>
                    <div style="font-size:1rem;font-weight:700;color:${COLORS.serious}">${r.stats.A}</div>
                    <div style="font-size:.6rem;color:${COLORS.slateLight}">${(r.stats.A/r.stats.total*100).toFixed(1)}%</div>
                </div>
                <div style="text-align:center;padding:.5rem;background:rgba(161,98,7,.05);border-radius:6px">
                    <div style="font-size:.65rem;color:${COLORS.moderate};font-weight:600;text-transform:uppercase">Moderate</div>
                    <div style="font-size:1rem;font-weight:700;color:${COLORS.moderate}">${r.stats.B}</div>
                    <div style="font-size:.6rem;color:${COLORS.slateLight}">${(r.stats.B/r.stats.total*100).toFixed(1)}%</div>
                </div>
                <div style="text-align:center;padding:.5rem;background:rgba(29,78,216,.05);border-radius:6px">
                    <div style="font-size:.65rem;color:${COLORS.minor};font-weight:600;text-transform:uppercase">Minor</div>
                    <div style="font-size:1rem;font-weight:700;color:${COLORS.minor}">${r.stats.C}</div>
                    <div style="font-size:.6rem;color:${COLORS.slateLight}">${(r.stats.C/r.stats.total*100).toFixed(1)}%</div>
                </div>
                <div style="text-align:center;padding:.5rem;background:rgba(156,163,175,.1);border-radius:6px">
                    <div style="font-size:.65rem;color:${COLORS.pdo};font-weight:600;text-transform:uppercase">PDO</div>
                    <div style="font-size:1rem;font-weight:700;color:${COLORS.pdo}">${r.stats.O.toLocaleString()}</div>
                    <div style="font-size:.6rem;color:${COLORS.slateLight}">${(r.stats.O/r.stats.total*100).toFixed(1)}%</div>
                </div>
            </div>
            <!-- CC 349 — severity donut (rendered after innerHTML via createChart) -->
            <div style="margin:1rem 0 0 0;height:240px"><canvas id="compChartSeverity"></canvas></div>
        </div>

        <!-- Two Column Layout: Locations & Temporal - WORLD-CLASS DESIGN -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
            <!-- High-Priority Locations -->
            <div style="background:${COLORS.white};padding:1.25rem;border-radius:10px;border:1px solid ${COLORS.border};box-shadow:0 2px 8px rgba(0,0,0,.03)">
                <h3 style="color:${COLORS.navy};margin:0 0 1rem 0;font-size:1.1rem;font-weight:600;display:flex;align-items:center;gap:.5rem">
                    <svg width="20" height="20" fill="none" stroke="${COLORS.fatal}" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    High-Priority Locations
                </h3>
                ${generateLocationCards()}
                ${ai.locations ? `<p style="color:${COLORS.slate};font-size:.8rem;margin-top:.75rem;line-height:1.6">${ai.locations}</p>${aiDisclaimer}` : ''}
            </div>

            <!-- Day×Hour Heat Matrix -->
            <div style="background:${COLORS.white};padding:1.25rem;border-radius:10px;border:1px solid ${COLORS.border};box-shadow:0 2px 8px rgba(0,0,0,.03)">
                <h3 style="color:${COLORS.navy};margin:0 0 1rem 0;font-size:1.1rem;font-weight:600;display:flex;align-items:center;gap:.5rem">
                    <svg width="20" height="20" fill="none" stroke="${COLORS.navy}" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Crash Risk by Day & Hour
                </h3>
                ${generateDayHourMatrix()}
                ${r.dayHourMatrix?.peakCell ? `<div style="margin-top:.75rem;padding:.75rem;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:6px;font-size:.8rem;display:flex;align-items:center;gap:.5rem;box-shadow:0 1px 3px rgba(245,158,11,.15)">
                    <svg width="16" height="16" fill="none" stroke="#b45309" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <span style="color:#92400e"><strong>Highest Risk Window:</strong> ${r.dayHourMatrix.peakCell.day} at ${formatHour(r.dayHourMatrix.peakCell.hour)} (${r.dayHourMatrix.peakCell.count} crashes)</span>
                </div>` : ''}
            </div>
        </div>

        <!-- Collision Types - WORLD-CLASS DESIGN -->
        <div style="margin-bottom:1.5rem;background:${COLORS.white};padding:1.25rem;border-radius:10px;border:1px solid ${COLORS.border};box-shadow:0 2px 8px rgba(0,0,0,.03)">
            <h3 style="color:${COLORS.navy};margin:0 0 1rem 0;font-size:1.1rem;font-weight:600;display:flex;align-items:center;gap:.5rem">
                <svg width="20" height="20" fill="none" stroke="${COLORS.navy}" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg>
                Collision Types by EPDO Impact
            </h3>
            ${generateCollisionBars()}
        </div>

        <!-- Vulnerable Road Users - WORLD-CLASS DESIGN -->
        <div style="margin-bottom:1.5rem;background:${COLORS.white};padding:1.25rem;border-radius:10px;border:1px solid ${COLORS.border};box-shadow:0 2px 8px rgba(0,0,0,.03)">
            <h3 style="color:${COLORS.navy};margin:0 0 1rem 0;font-size:1.1rem;font-weight:600;display:flex;align-items:center;gap:.5rem">
                <svg width="20" height="20" fill="none" stroke="${COLORS.navy}" stroke-width="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                Vulnerable Road Users
            </h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem">
                <!-- Pedestrian Card -->
                <div style="background:linear-gradient(135deg,#ecfeff,${COLORS.white});border:1px solid #67e8f9;padding:1.25rem;border-radius:10px;box-shadow:0 2px 8px rgba(8,145,178,.08)">
                    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
                        <div style="width:50px;height:50px;background:linear-gradient(135deg,#0891b2,#0e7490);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(8,145,178,.25)">
                            <svg width="24" height="24" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 100 6 3 3 0 000-6zM20 21l-4-4m0 4v-4m-9 4v-6l-3-3 3-3 3 3 3-3"/></svg>
                        </div>
                        <div>
                            <div style="font-weight:700;color:#0e7490;font-size:1.75rem;letter-spacing:-.02em">${r.vulnerableUsers?.ped?.total ?? 0}</div>
                            <div style="font-size:.75rem;color:#0891b2;text-transform:uppercase;letter-spacing:.05em">Pedestrian Crashes</div>
                        </div>
                    </div>
                    <div style="display:flex;gap:.75rem;font-size:.75rem;flex-wrap:wrap">
                        ${(r.vulnerableUsers?.ped?.K ?? 0) > 0 ? `<span style="color:${COLORS.fatal};font-weight:600;background:#fef2f2;padding:4px 10px;border-radius:4px">● ${r.vulnerableUsers?.ped?.K ?? 0} Fatal</span>` : ''}
                        ${(r.vulnerableUsers?.ped?.A ?? 0) > 0 ? `<span style="color:${COLORS.serious};background:#fff7ed;padding:4px 10px;border-radius:4px">● ${r.vulnerableUsers?.ped?.A ?? 0} Serious</span>` : ''}
                        <span style="color:${COLORS.navy};background:#eff6ff;padding:4px 10px;border-radius:4px;font-weight:600">EPDO: ${r.vulnerableUsers?.ped?.epdo?.toLocaleString() || calcEPDO(r.vulnerableUsers?.ped ?? {}).toLocaleString()}</span>
                    </div>
                    ${(r.vulnerableUsers?.ped?.topLocations?.length ?? 0) > 0 ? `<div style="margin-top:.75rem;padding-top:.75rem;border-top:1px solid #67e8f9;font-size:.7rem;color:${COLORS.slate}">
                        <strong style="color:#0e7490">Top Locations:</strong> ${(r.vulnerableUsers?.ped?.topLocations ?? []).slice(0,3).map(([loc]) => formatRouteName(loc)).join(', ')}
                    </div>` : ''}
                </div>
                <!-- Bicycle Card -->
                <div style="background:linear-gradient(135deg,#ecfdf5,${COLORS.white});border:1px solid #6ee7b7;padding:1.25rem;border-radius:10px;box-shadow:0 2px 8px rgba(5,150,105,.08)">
                    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
                        <div style="width:50px;height:50px;background:linear-gradient(135deg,#059669,#047857);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(5,150,105,.25)">
                            <svg width="24" height="24" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/><path d="M12 17V5l4 5h4M8 17l4-8"/></svg>
                        </div>
                        <div>
                            <div style="font-weight:700;color:#047857;font-size:1.75rem;letter-spacing:-.02em">${r.vulnerableUsers?.bike?.total ?? 0}</div>
                            <div style="font-size:.75rem;color:#059669;text-transform:uppercase;letter-spacing:.05em">Bicycle Crashes</div>
                        </div>
                    </div>
                    <div style="display:flex;gap:.75rem;font-size:.75rem;flex-wrap:wrap">
                        ${(r.vulnerableUsers?.bike?.K ?? 0) > 0 ? `<span style="color:${COLORS.fatal};font-weight:600;background:#fef2f2;padding:4px 10px;border-radius:4px">● ${r.vulnerableUsers?.bike?.K ?? 0} Fatal</span>` : ''}
                        ${(r.vulnerableUsers?.bike?.A ?? 0) > 0 ? `<span style="color:${COLORS.serious};background:#fff7ed;padding:4px 10px;border-radius:4px">● ${r.vulnerableUsers?.bike?.A ?? 0} Serious</span>` : ''}
                        <span style="color:${COLORS.navy};background:#eff6ff;padding:4px 10px;border-radius:4px;font-weight:600">EPDO: ${r.vulnerableUsers?.bike?.epdo?.toLocaleString() || calcEPDO(r.vulnerableUsers?.bike ?? {}).toLocaleString()}</span>
                    </div>
                    ${(r.vulnerableUsers?.bike?.topLocations?.length ?? 0) > 0 ? `<div style="margin-top:.75rem;padding-top:.75rem;border-top:1px solid #6ee7b7;font-size:.7rem;color:${COLORS.slate}">
                        <strong style="color:#047857">Top Locations:</strong> ${(r.vulnerableUsers?.bike?.topLocations ?? []).slice(0,3).map(([loc]) => formatRouteName(loc)).join(', ')}
                    </div>` : ''}
                </div>
            </div>
            ${ai.focus ? `<p style="color:${COLORS.slate};font-size:.85rem;margin-top:1rem;line-height:1.6">${ai.focus}</p>${aiDisclaimer}` : ''}
            <!-- VRU Context Note -->
            ${((r.vulnerableUsers?.ped?.total ?? 0) + (r.vulnerableUsers?.bike?.total ?? 0)) > 0 ? `
            <div style="margin-top:1rem;padding:.75rem;background:linear-gradient(135deg,#eff6ff,${COLORS.white});border:1px solid ${COLORS.border};border-radius:6px;font-size:.75rem;color:${COLORS.slate}">
                <strong style="color:${COLORS.navy}">Context:</strong> Vulnerable road users represent ${(((r.vulnerableUsers?.ped?.total ?? 0) + (r.vulnerableUsers?.bike?.total ?? 0)) / (r.stats.total || 1) * 100).toFixed(1)}% of total crashes${r.stats.K > 0 ? ` but ${((((r.vulnerableUsers?.ped?.K ?? 0) + (r.vulnerableUsers?.bike?.K ?? 0)) / r.stats.K) * 100).toFixed(0)}% of fatalities` : ''}, indicating significantly higher severity outcomes.
            </div>
            ` : ''}
        </div>

        <!-- CC 349 — Crash Trends chart (rendered after innerHTML via createChart) -->
        ${(Array.isArray(r.monthlyTrends) && r.monthlyTrends.length) ? `
        <div style="margin-bottom:1.5rem;background:${COLORS.white};padding:1.25rem;border-radius:10px;border:1px solid ${COLORS.border};box-shadow:0 2px 8px rgba(0,0,0,.03)">
            <h3 style="color:${COLORS.navy};margin:0 0 1rem 0;font-size:1.1rem;font-weight:600;display:flex;align-items:center;gap:.5rem">
                <svg width="20" height="20" fill="none" stroke="${COLORS.navy}" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3v18h18M7 14l4-4 4 4 5-6"/></svg>
                Crash Trends
            </h3>
            <div style="height:240px"><canvas id="compChartTrend"></canvas></div>
        </div>
        ` : ''}

        <!-- CC 370 — Contributing Factors (Weather + Light) -->
        <div style="margin-bottom:1.5rem;background:${COLORS.white};padding:1.25rem;border-radius:10px;border:1px solid ${COLORS.border};box-shadow:0 2px 8px rgba(0,0,0,.03)">
            <h3 style="color:${COLORS.navy};margin:0 0 1rem 0;font-size:1.1rem;font-weight:600;display:flex;align-items:center;gap:.5rem">
                <svg width="20" height="20" fill="none" stroke="${COLORS.navy}" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14"/></svg>
                Contributing Factors
            </h3>
            ${generateContributingFactors()}
        </div>

        <!-- CC 370 — Safety Priorities / Recommendations -->
        <div style="margin-bottom:1.5rem;background:${COLORS.white};padding:1.25rem;border-radius:10px;border:1px solid ${COLORS.border};box-shadow:0 2px 8px rgba(0,0,0,.03)">
            <h3 style="color:${COLORS.navy};margin:0 0 1rem 0;font-size:1.1rem;font-weight:600;display:flex;align-items:center;gap:.5rem">
                <svg width="20" height="20" fill="none" stroke="${COLORS.navy}" stroke-width="2" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                Safety Priorities &amp; Recommendations
            </h3>
            ${generateRecommendations()}
        </div>

        <!-- CC 370 — Funding Opportunities -->
        <div style="margin-bottom:1.5rem;background:${COLORS.white};padding:1.25rem;border-radius:10px;border:1px solid ${COLORS.border};box-shadow:0 2px 8px rgba(0,0,0,.03)">
            <h3 style="color:${COLORS.navy};margin:0 0 1rem 0;font-size:1.1rem;font-weight:600;display:flex;align-items:center;gap:.5rem">
                <svg width="20" height="20" fill="none" stroke="${COLORS.navy}" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                Funding Opportunities
            </h3>
            ${generateFundingSection()}
        </div>

        <!-- Executive Summary AI - WORLD-CLASS DESIGN -->
        ${ai.executive ? `
        <div style="border-left:4px solid ${COLORS.navy};margin-bottom:1.5rem;background:linear-gradient(135deg,${COLORS.lightGray},${COLORS.white});padding:1.25rem;border-radius:0 10px 10px 0;box-shadow:0 2px 8px rgba(0,0,0,.03)">
            <h3 style="color:${COLORS.navy};margin:0 0 .75rem 0;font-size:1.1rem;font-weight:600;display:flex;align-items:center;gap:.5rem">
                <svg width="20" height="20" fill="none" stroke="${COLORS.navy}" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 5a2 2 0 11-2 2 2 2 0 012-2zm3 9H9v-1a3 3 0 013-3 3 3 0 013 3z"/></svg>
                AI Executive Summary
            </h3>
            <p style="color:${COLORS.slate};line-height:1.7;font-size:.9rem;margin:0">${sanitizeTextForExport(ai.executive)}</p>
            ${aiDisclaimer}
        </div>
        ` : ''}

        <!-- Data Quality Notes - WORLD-CLASS DESIGN -->
        <div style="margin-bottom:1.5rem;background:linear-gradient(135deg,#fefce8,${COLORS.white});border:1px solid #fde68a;padding:1rem;border-radius:10px">
            <h4 style="color:#a16207;margin:0 0 .75rem 0;font-size:.9rem;font-weight:600;display:flex;align-items:center;gap:.5rem">
                <svg width="18" height="18" fill="none" stroke="#a16207" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Data Quality Notes
            </h4>
            <ul style="margin:0;padding-left:1.25rem;font-size:.8rem;color:${COLORS.slate};line-height:1.6">
                <li>Location data available for <strong>${r.locationCoverage?.withLocation?.toLocaleString() || 'N/A'}</strong> of ${m.crashCount.toLocaleString()} records (${r.locationCoverage?.percentage || 'N/A'}%)</li>
                <li>Records with severity data: <strong>${r.stats.total.toLocaleString()}</strong> (${((r.stats.total / m.crashCount) * 100).toFixed(1)}%)</li>
                ${epdoValidation.hasDiscrepancy ? `<li style="color:${COLORS.fatal}"><strong>EPDO Verification Required:</strong> Computed EPDO (${epdoValidation.computed.toLocaleString()}) differs from stored value</li>` : ''}
            </ul>
        </div>

        <!-- Report Footer - WORLD-CLASS DESIGN -->
        <div style="background:linear-gradient(135deg,${COLORS.navy},#0f172a);color:white;padding:1.5rem;border-radius:10px;margin-top:1.5rem;box-shadow:0 4px 12px rgba(30,58,95,.2)">
            <div style="display:flex;justify-content:space-between;align-items:center">
                <div>
                    <p style="font-size:.85rem;margin:0;opacity:.95;font-weight:500">
                        ${m.title}
                    </p>
                    <p style="font-size:.75rem;margin:.35rem 0 0 0;opacity:.8">
                        ${m.agency} • ${m.quarter}
                    </p>
                    <p style="font-size:.7rem;margin:.35rem 0 0 0;opacity:.6">
                        Data Source: ${getDataSourceLabel()} | Prepared by: ${m.author}
                    </p>
                </div>
                <div style="text-align:right">
                    <div style="background:rgba(255,255,255,.1);padding:.5rem 1rem;border-radius:6px;margin-bottom:.5rem">
                        <p style="font-size:.65rem;margin:0;opacity:.7;text-transform:uppercase;letter-spacing:.05em">Generated</p>
                        <p style="font-size:.8rem;margin:0;font-weight:500">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <p style="font-size:.65rem;margin:0;opacity:.5">${m.totalPages || 14} Pages | Powered by CRASH LENS</p>
                </div>
            </div>
        </div>
    `;

    // CC 349 — render Chart.js charts into the comprehensive preview after the
    // innerHTML (with the <canvas> slots) has attached to the DOM. Uses the
    // shared createChart() wrapper, which destroys any prior instance on the
    // canvas (no leak on regenerate / CC 346 autoUpdate).
    setTimeout(() => {
        try {
            if (typeof window.Chart === 'undefined' || typeof createChart !== 'function') return;
            // Severity donut
            if (document.getElementById('compChartSeverity') && r.stats) {
                createChart('compChartSeverity', 'doughnut', {
                    labels: ['Fatal (K)', 'Serious (A)', 'Moderate (B)', 'Minor (C)', 'PDO (O)'],
                    datasets: [{
                        data: [r.stats.K || 0, r.stats.A || 0, r.stats.B || 0, r.stats.C || 0, r.stats.O || 0],
                        backgroundColor: [COLORS.fatal, COLORS.serious, COLORS.moderate, COLORS.minor, COLORS.pdo]
                    }]
                }, { plugins: { legend: { position: 'right' } } });
            }
            // Monthly trend bars (Total + K+A)
            const mt = Array.isArray(r.monthlyTrends) ? r.monthlyTrends.slice(-12) : [];
            if (document.getElementById('compChartTrend') && mt.length) {
                createChart('compChartTrend', 'bar', {
                    labels: mt.map(m2 => m2.month),
                    datasets: [
                        { label: 'Total crashes', data: mt.map(m2 => m2.count || 0), backgroundColor: COLORS.navyLight },
                        { label: 'K + A', data: mt.map(m2 => (m2.K || 0) + (m2.A || 0)), backgroundColor: COLORS.fatal }
                    ]
                }, { scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'bottom' } } });
            }
        } catch (e) {
            console.warn('[Report:comprehensive] CC 349 — chart render threw:', e);
        }
    }, 80);
}

function renderComprehensiveTOC(data) {
    const container = document.getElementById('comprehensiveTOCContent');
    container.innerHTML = data.sections.map(s => `
        <div style="display:flex;justify-content:space-between;padding:.25rem 0;border-bottom:1px dotted #e2e8f0">
            <span>${s.title}</span>
            <span style="color:#64748b">Page ${s.page}</span>
        </div>
    `).join('');
}

// CC 341 F4 — state-aware funding program list. Extend the map as new states
// are onboarded; unknown states fall back to a generic DOT/HSO label pair.
function _stateFundingPrograms() {
    const stateName = (jurisdictionContext && jurisdictionContext.stateName) || appConfig?.stateName || '';
    // Normalize to the underscore key form (e.g. "New York" -> "new_york") so multi-word
    // state display names match the underscore keys in stateMap and appConfig.states.
    const key = stateName.toLowerCase().replace(/\s+/g, '_');
    const dotName = appConfig?.states?.[key]?.dotName || 'State DOT';

    // Federal programs — every state is eligible. Always shown.
    const federal = [
        'Highway Safety Improvement Program (HSIP) — FHWA, state allocation',
        'Safe Streets and Roads for All (SS4A) — USDOT, discretionary',
        'Reconnecting Communities Pilot Program — USDOT, discretionary',
        'NHTSA Section 402 (State and Community Highway Safety) Grants',
        'NHTSA Section 405 (National Priority Safety) Grants',
        'Strategic Highway Safety Plan (SHSP) Implementation — FHWA, state allocation',
        'Rural Surface Transportation Grant Program — USDOT, discretionary',
        'Promoting Resilient Operations for Transformative, Efficient, and Cost-Saving Transportation (PROTECT) — FHWA'
    ];

    // State-specific programs. Add a new state by appending one entry.
    const stateMap = {
        'colorado':       ['CDOT Highway Safety Office Grants', 'CDOT Revenue Sharing Program', 'Smart Scale (CDOT prioritization)'],
        'virginia':       ['Virginia Highway Safety Office Grants', 'VDOT Revenue Sharing Program', 'Smart Scale (VDOT prioritization)', 'Virginia DRPT Transit Capital Assistance'],
        'delaware':       ['Delaware Office of Highway Safety Grants', 'DelDOT Capital Transportation Program', 'Statewide Highway Safety Plan (SHSP) Implementation — Delaware'],
        'california':     ['Caltrans Highway Safety Improvement Program (HSIP-CA)', 'Active Transportation Program (ATP)', 'Office of Traffic Safety (OTS) Grants', 'Local Streets and Roads Program (SB 1)'],
        'texas':          ['TxDOT Highway Safety Plan Grants', 'TxDOT Transportation Alternatives Set-Aside (TA Set-Aside)', 'TxDOT Texas Mobility Fund', 'TxDOT Statewide Transportation Improvement Program (STIP)'],
        'florida':        ['FDOT Highway Safety Office Grants', 'FDOT Local Agency Program (LAP)', 'Strategic Intermodal System (SIS) Funding', 'Transportation Regional Incentive Program (TRIP)'],
        'new_york':       ['NYSDOT Governor\'s Traffic Safety Committee Grants', 'NYSDOT Local Bridge and Highway Aid (CHIPS)', 'New York Works Capital Plan', 'Federal-Aid Local Initiatives'],
        'pennsylvania':   ['PennDOT Pennsylvania Highway Safety Grants', 'PennDOT Multimodal Transportation Fund', 'PennDOT Automated Red Light Enforcement (ARLE)', 'Transportation Alternatives Set-Aside Program (TAP)'],
        'illinois':       ['IDOT Illinois Traffic Safety Resource Prosecutor Program', 'IDOT Highway Safety Improvement Program', 'Illinois Bicycle Path Grant Program', 'Federal-Aid to Local Agencies'],
        'ohio':           ['ODOT Highway Safety Improvement Program', 'ODOT Safe Routes to School', 'ODOT Local Public Agency (LPA) Program', 'Ohio Department of Public Safety (ODPS) Grants'],
        'georgia':        ['GDOT Highway Safety Improvement Program', 'Governor\'s Office of Highway Safety (GOHS) Grants', 'GDOT Off-System Safety Program', 'GDOT Local Maintenance and Improvement Grant (LMIG)'],
        'north_carolina': ['NCDOT Governor\'s Highway Safety Program (GHSP)', 'NCDOT Spot Safety Program', 'NCDOT Hazard Elimination Program', 'NCDOT Local Bicycle and Pedestrian Program'],
        'maryland':       ['MDOT State Highway Administration Safety Grants', 'Maryland Highway Safety Office (MHSO) Grants', 'MDOT Transportation Alternatives Program', 'Maryland Strategic Highway Safety Plan Implementation'],
        'new_jersey':     ['NJDOT Highway Safety Improvement Program', 'NJ Division of Highway Traffic Safety Grants', 'NJDOT Local Aid', 'NJDOT Safe Streets to Transit Program'],
        'washington':     ['WSDOT Highway Safety Improvement Program', 'Washington Traffic Safety Commission (WTSC) Grants', 'WSDOT Pedestrian and Bicycle Program', 'WSDOT Safe Routes to School Program'],
        'massachusetts':  ['MassDOT Highway Safety Office Grants', 'MassDOT Complete Streets Funding Program', 'Executive Office of Public Safety and Security (EOPSS) Grants', 'MassDOT Shared Streets and Spaces'],
        'arizona':        ['ADOT Highway Safety Office Grants', 'Governor\'s Office of Highway Safety (GOHS) Grants', 'ADOT Local Public Agency Program', 'Statewide Transportation Improvement Program (STIP)'],
        'tennessee':      ['TDOT Highway Safety Office Grants', 'Governor\'s Highway Safety Office (GHSO) Grants', 'TDOT Multimodal Access Grant Program', 'TDOT Transportation Alternatives Program']
    };

    const stateProgs = stateMap[key] || [
        `${stateName || 'State'} Highway Safety Office Grants`,
        `${dotName} Capital Improvement Program`,
        `${dotName} Local Agency Program`
    ];

    return federal.concat(stateProgs);
}

async function downloadComprehensivePDF() {
    if (!comprehensiveReportData) {
        alert('Please generate the report first.');
        return;
    }

    const totalPages = comprehensiveReportData.metadata.totalPages || 14;
    showLoading(`Generating ${totalPages}-page PDF report...`);

    // CC 341 F3 — FHWA 2025 EPDO weights (FHWA-SA-25-021), sourced from the shared constants.
    const EPDO_W = (window.CL && window.CL.core && window.CL.core.constants && window.CL.core.constants.EPDO_WEIGHTS_DEFAULT)
                || { K: 883, A: 94, B: 21, C: 11, O: 1 };

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'letter');
        const pageWidth = 215.9;
        const pageHeight = 279.4;
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        const m = comprehensiveReportData.metadata;
        const r = comprehensiveReportData.rawData;
        const ai = comprehensiveReportData.aiInsights || {};

        // CC 367 — defensive: never let an unexpected rawData shape abort the
        // export (e.g. .map/.slice on a non-array). Behavior-neutral for the
        // normal, already-typed case (matview + row builders both emit these).
        r.factors            = Array.isArray(r.factors) ? r.factors : [];
        r.monthlyTrends      = Array.isArray(r.monthlyTrends) ? r.monthlyTrends : [];
        r.collisionBreakdown = Array.isArray(r.collisionBreakdown) ? r.collisionBreakdown : [];
        r.weatherImpact      = Array.isArray(r.weatherImpact) ? r.weatherImpact : [];
        r.lightConditions    = Array.isArray(r.lightConditions) ? r.lightConditions : [];
        r.hourlyDistribution = Array.isArray(r.hourlyDistribution) ? r.hourlyDistribution : [];
        r.topLocations       = Array.isArray(r.topLocations) ? r.topLocations : [];
        r.dayOfWeekAnalysis  = (r.dayOfWeekAnalysis && typeof r.dayOfWeekAnalysis === 'object') ? r.dayOfWeekAnalysis : {};
        r.peakPatterns       = (r.peakPatterns && typeof r.peakPatterns === 'object') ? r.peakPatterns : {};

        let yPos = margin;

        const addText = (text, size, style = 'normal', color = '#1e293b') => {
            pdf.setFontSize(size);
            pdf.setFont('helvetica', style);
            const rgb = hexToRgb(color);
            pdf.setTextColor(rgb.r, rgb.g, rgb.b);
            const lines = pdf.splitTextToSize(text, contentWidth);
            lines.forEach(line => {
                if (yPos > pageHeight - margin - 10) {
                    pdf.addPage();
                    yPos = margin;
                }
                pdf.text(line, margin, yPos);
                yPos += size * 0.4;
            });
            yPos += 2;
        };

        const addSpacer = (h) => { yPos += h; };
        const newPage = () => { pdf.addPage(); yPos = margin; };

        // Enhanced page footer with CRASH LENS branding
        const addPageFooter = (num) => {
            // Footer line
            pdf.setDrawColor(226, 232, 240);
            pdf.setLineWidth(0.3);
            pdf.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);

            pdf.setFontSize(7);

            // Left: CRASH LENS branding
            pdf.setTextColor(30, 58, 95);
            pdf.setFont('helvetica', 'bold');
            pdf.text('CRASH LENS', margin, pageHeight - 13);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(100, 116, 139);
            pdf.text('Crash Analysis Tool', margin, pageHeight - 9);

            // Center: Agency and period
            const centerText = `${m.agency} | ${m.quarter}`;
            const centerWidth = pdf.getTextWidth(centerText);
            pdf.text(centerText, (pageWidth - centerWidth) / 2, pageHeight - 11);

            // Right: Page number and timestamp
            pdf.text(`Generated: ${getShortTimestamp()}`, pageWidth - margin - 45, pageHeight - 13);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Page ${num} of ${totalPages}`, pageWidth - margin - 22, pageHeight - 9);
            pdf.setFont('helvetica', 'normal');
        };

        // Legacy function for backwards compatibility
        const addPageNumber = addPageFooter;

        // Store page positions for clickable TOC
        const pageYPositions = {};

        // Helper: Format hour for display
        const fmtHour = (h) => h === 0 ? '12 AM' : (h === 12 ? '12 PM' : (h > 12 ? `${h-12} PM` : `${h} AM`));

        // Helper: Draw a horizontal bar (replaces Unicode block characters that cause encoding issues)
        const addBar = (value, maxValue, maxWidth = 40, color = '#3b82f6', xOffset = 0) => {
            if (maxValue <= 0) return;
            const barWidth = Math.max((value / maxValue) * maxWidth, 1);
            const rgb = hexToRgb(color);
            pdf.setFillColor(rgb.r, rgb.g, rgb.b);
            pdf.rect(margin + xOffset, yPos - 2, barWidth, 3, 'F');
        };

        // Helper: Draw labeled bar with text and bar on same line
        const addLabeledBar = (label, value, maxValue, maxBarWidth = 30, color = '#3b82f6') => {
            // Add the label text
            addText(label, 9, 'normal', '#374151');
            // Draw bar after text (offset to right side)
            yPos -= 5; // Go back up to same line
            const barWidth = Math.max((value / maxValue) * maxBarWidth, 1);
            const rgb = hexToRgb(color);
            pdf.setFillColor(rgb.r, rgb.g, rgb.b);
            pdf.rect(margin + 100, yPos, barWidth, 2.5, 'F');
            yPos += 3;
        };

        // World-class color palette for PDF
        const PDF_COLORS = {
            navy: '#1E3A5F',
            navyLight: '#2563eb',
            slate: '#475569',
            slateLight: '#64748b',
            fatal: '#991B1B',
            serious: '#C2410C',
            moderate: '#A16207'
        };

        // PAGE 1: Executive Dashboard
        yPos = 30;
        addText(m.agency.toUpperCase(), 20, 'bold', PDF_COLORS.navy);
        addText(m.department, 12, 'normal', PDF_COLORS.slateLight);
        addSpacer(8);
        addText(m.title, 24, 'bold', PDF_COLORS.navy);
        addText(m.quarter, 14, 'normal', PDF_COLORS.navyLight);
        addSpacer(15);

        // KPI Summary
        addText('KEY METRICS', 12, 'bold', PDF_COLORS.navy);
        addSpacer(3);
        addText(`Total Crashes: ${m.crashCount.toLocaleString()}  |  Fatal (K): ${r.stats.K}  |  Serious (A): ${r.stats.A}  |  EPDO: ${calcEPDO(r.stats).toLocaleString()}`, 11, 'normal', PDF_COLORS.slate);
        addText(`Trend: ${r.trendData.totalChange > 0 ? '+' : ''}${r.trendData.totalChange}% vs prior period  |  Pedestrian: ${(r.vulnerableUsers?.ped?.total ?? 0)}  |  Bicycle: ${(r.vulnerableUsers?.bike?.total ?? 0)}`, 10, 'normal', PDF_COLORS.slateLight);
        addSpacer(10);

        // Key Findings
        if (r.dataInsights && r.dataInsights.length > 0) {
            addText('KEY FINDINGS', 12, 'bold', PDF_COLORS.moderate);
            addSpacer(3);
            r.dataInsights.forEach(insight => {
                addText(`• ${sanitizeTextForExport(insight)}`, 10, 'normal', PDF_COLORS.slate);
            });
            addSpacer(8);
        }

        // Top 3 Locations Quick View
        addText('TOP PRIORITY LOCATIONS', 12, 'bold', PDF_COLORS.fatal);
        addSpacer(3);
        r.topLocations.slice(0, 3).forEach((loc, i) => {
            addText(`${i + 1}. ${formatRouteName(loc.name)} - ${loc.total} crashes (K:${loc.K}, A:${loc.A}) EPDO: ${loc.epdo.toLocaleString()}`, 10, 'normal', PDF_COLORS.slate);
        });
        addSpacer(15);

        addText(`Prepared by: ${m.author}`, 10, 'normal', PDF_COLORS.slateLight);
        addText(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 10, 'normal', PDF_COLORS.slateLight);
        addPageNumber(1);

        // PAGE 2: Table of Contents (with clickable links)
        newPage();
        addText('Table of Contents', 18, 'bold', PDF_COLORS.navy);
        addSpacer(5);

        // Add clickable instruction
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        pdf.setFont('helvetica', 'italic');
        pdf.text('Click any section title to jump to that page', margin, yPos);
        yPos += 8;

        // Generate clickable TOC entries
        comprehensiveReportData.sections.forEach(s => {
            const tocText = s.title;
            const pageNum = `Page ${s.page}`;

            // Draw dotted line
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(30, 58, 95);

            // Title text (left side)
            pdf.text(tocText, margin, yPos);

            // Page number (right side)
            pdf.setTextColor(100, 116, 139);
            const pageNumWidth = pdf.getTextWidth(pageNum);
            pdf.text(pageNum, pageWidth - margin - pageNumWidth, yPos);

            // Dotted line between title and page number
            const titleWidth = pdf.getTextWidth(tocText);
            const dotStart = margin + titleWidth + 3;
            const dotEnd = pageWidth - margin - pageNumWidth - 3;
            pdf.setDrawColor(203, 213, 225);
            pdf.setLineDashPattern([1, 2], 0);
            pdf.line(dotStart, yPos - 1, dotEnd, yPos - 1);
            pdf.setLineDashPattern([], 0);

            // Add clickable link (jsPDF internal link to page)
            const linkY = yPos - 4;
            const linkHeight = 6;
            pdf.link(margin, linkY, contentWidth, linkHeight, { pageNumber: s.page });

            yPos += 7;
        });

        addSpacer(10);

        // Add severity glossary on TOC page
        addText('Severity Codes', 12, 'bold', PDF_COLORS.navy);
        addSpacer(2);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const glossaryItems = [
            { code: 'K', desc: 'Fatal - Crash resulted in one or more fatalities', color: '#991B1B' },
            { code: 'A', desc: 'Serious Injury - Incapacitating injury requiring hospitalization', color: '#C2410C' },
            { code: 'B', desc: 'Moderate Injury - Visible injury not incapacitating', color: '#A16207' },
            { code: 'C', desc: 'Minor Injury - Possible injury, complaint of pain', color: '#1D4ED8' },
            { code: 'O', desc: 'Property Damage Only - No injuries reported', color: '#64748B' }
        ];
        glossaryItems.forEach(item => {
            const rgb = hexToRgb(item.color);
            pdf.setTextColor(rgb.r, rgb.g, rgb.b);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${item.code}:`, margin, yPos);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(71, 85, 105);
            pdf.text(item.desc, margin + 8, yPos);
            yPos += 4.5;
        });

        addPageFooter(2);

        // PAGE 3: Executive Summary
        newPage();
        addText('Executive Summary', 18, 'bold', PDF_COLORS.navy);
        addSpacer(5);
        if (ai.executive) {
            addText(sanitizeTextForExport(ai.executive), 11, 'normal', PDF_COLORS.slate);
        } else {
            addText(`This quarter, ${m.agency} recorded ${r.stats.total.toLocaleString()} crashes, including ${r.stats.K} fatal and ${r.stats.A} serious injury incidents.`, 11, 'normal', PDF_COLORS.slate);
        }
        addSpacer(10);
        addText('Crash Severity Overview', 14, 'bold', PDF_COLORS.navy);
        // BUG-009 fix: guard against division by zero
        const totalForPct = r.stats.total || 1;
        const sevData = [
            { label: 'Fatal (K)', count: r.stats.K, pct: ((r.stats.K / totalForPct) * 100).toFixed(1) },
            { label: 'Serious Injury (A)', count: r.stats.A, pct: ((r.stats.A / totalForPct) * 100).toFixed(1) },
            { label: 'Moderate Injury (B)', count: r.stats.B, pct: ((r.stats.B / totalForPct) * 100).toFixed(1) },
            { label: 'Minor Injury (C)', count: r.stats.C, pct: ((r.stats.C / totalForPct) * 100).toFixed(1) },
            { label: 'Property Damage Only (O)', count: r.stats.O, pct: ((r.stats.O / totalForPct) * 100).toFixed(1) }
        ];
        sevData.forEach(s => {
            addText(`${s.label}: ${s.count} (${s.pct}%)`, 10, 'normal', PDF_COLORS.slate);
        });
        addSpacer(5);
        addText(`EPDO Score: ${calcEPDO(r.stats).toLocaleString()}`, 12, 'bold', PDF_COLORS.navyLight);
        addSpacer(8);
        addText('Quarter-over-Quarter Comparison', 14, 'bold', PDF_COLORS.navy);
        if (r.yoyComparison?.hasPreviousData) {
            addText(`${r.yoyComparison.currentQuarter || 'Current Quarter'} vs ${r.yoyComparison.previousQuarter || 'Previous Quarter'}`, 10, 'italic', PDF_COLORS.slateLight);
            addText(`Total: ${r.yoyComparison.changes.total > 0 ? '+' : ''}${r.yoyComparison.changes.total}% | Fatal: ${r.yoyComparison.changes.fatal > 0 ? '+' : ''}${r.yoyComparison.changes.fatal}% | Serious (A): ${r.yoyComparison.changes.serious > 0 ? '+' : ''}${r.yoyComparison.changes.serious}%`, 11, 'normal', r.yoyComparison.changes.total > 0 ? PDF_COLORS.fatal : '#16a34a');
            addText(`Current Period: ${r.yoyComparison.current.total} crashes (${r.yoyComparison.current.K} K, ${r.yoyComparison.current.A} A)`, 10, 'normal', PDF_COLORS.slate);
            addText(`Previous Period: ${r.yoyComparison.previous.total} crashes (${r.yoyComparison.previous.K} K, ${r.yoyComparison.previous.A} A)`, 10, 'normal', PDF_COLORS.slate);
        } else {
            addText(`Total crashes: ${r.trendData.totalChange > 0 ? '+' : ''}${r.trendData.totalChange}% vs previous period`, 11, 'normal', PDF_COLORS.slate);
        }
        addPageNumber(3);

        // PAGE 4: Temporal Analysis
        newPage();
        addText('Temporal Analysis', 18, 'bold', PDF_COLORS.navy);
        addSpacer(5);
        addText(`Peak Crash Day: ${r.peakPatterns.peakDay}`, 12, 'bold', PDF_COLORS.navy);
        addText(`Peak Crash Time: ${r.peakPatterns.peakTime}`, 12, 'bold', PDF_COLORS.navy);
        if (r.dayHourMatrix?.peakCell) {
            addText(`Highest Risk Window: ${r.dayHourMatrix.peakCell.day} at ${fmtHour(r.dayHourMatrix.peakCell.hour)} (${r.dayHourMatrix.peakCell.count} crashes)`, 11, 'normal', PDF_COLORS.fatal);
        }
        addSpacer(5);
        if (ai.temporal) {
            addText(sanitizeTextForExport(ai.temporal), 10, 'normal', PDF_COLORS.slate);
        }
        addSpacer(10);
        addText('Day of Week Distribution', 14, 'bold', PDF_COLORS.navy);
        const maxDayCount = Math.max(...Object.values(r.dayOfWeekAnalysis).map(d => d.count));
        Object.entries(r.dayOfWeekAnalysis).forEach(([day, data]) => {
            addText(`${day.padEnd(10)}: ${data.count.toString().padStart(4)} crashes`, 9, 'normal', PDF_COLORS.slate);
            yPos -= 4;
            addBar(data.count, maxDayCount, 35, PDF_COLORS.navyLight, 55);
            yPos += 2;
        });
        addSpacer(10);
        addText('Hourly Distribution (Peak Hours)', 14, 'bold', PDF_COLORS.navy);
        const peakHours = r.hourlyDistribution.map((h, i) => ({ hour: i, ...h })).sort((a, b) => b.count - a.count).slice(0, 6);
        peakHours.forEach(h => {
            addText(`${fmtHour(h.hour)}: ${h.count} crashes ${h.K > 0 || h.A > 0 ? `(${h.K}K, ${h.A}A)` : ''}`, 10, 'normal', PDF_COLORS.slate);
        });
        addPageNumber(4);

        // PAGE 5: High-Priority Locations
        newPage();
        addText('High-Priority Locations', 18, 'bold', PDF_COLORS.navy);
        addSpacer(5);
        if (ai.locations) {
            addText(sanitizeTextForExport(ai.locations), 10, 'normal', PDF_COLORS.slate);
            addSpacer(5);
        }
        addText('Top 10 Locations by EPDO Score', 14, 'bold', PDF_COLORS.navy);
        addSpacer(3);
        r.topLocations.slice(0, 10).forEach((loc, i) => {
            const rankColor = i === 0 ? PDF_COLORS.fatal : (i < 3 ? PDF_COLORS.serious : PDF_COLORS.slate);
            addText(`${(i + 1).toString().padStart(2)}. ${formatRouteName(loc.name)}`, 11, 'bold', rankColor);
            addText(`    Total: ${loc.total} | Fatal: ${loc.K} | Serious: ${loc.A} | EPDO: ${loc.epdo.toLocaleString()}`, 9, 'normal', PDF_COLORS.slateLight);
            if (loc.topCollisions && loc.topCollisions.length > 0) {
                addText(`    Top crash types: ${loc.topCollisions.map(([type]) => type).join(', ')}`, 9, 'italic', '#94a3b8');
            }
            addSpacer(2);
        });
        addPageNumber(5);

        // PAGE 6: Crash Concentration Map
        newPage();
        addText('Crash Concentration Analysis', 18, 'bold', PDF_COLORS.navy);
        addSpacer(5);
        addText('Geographic Distribution of High-Crash Locations', 14, 'bold', PDF_COLORS.navy);
        addSpacer(5);
        addText('The following locations represent the highest crash concentration areas:', 10, 'normal', PDF_COLORS.slate);
        addSpacer(5);
        r.topLocations.slice(0, 5).forEach((loc, i) => {
            const pctOfTotal = ((loc.total / r.stats.total) * 100).toFixed(1);
            addText(`${i + 1}. ${formatRouteName(loc.name)}`, 12, 'bold', PDF_COLORS.navy);
            addText(`   ${loc.total} crashes (${pctOfTotal}% of total) | EPDO Score: ${loc.epdo.toLocaleString()}`, 10, 'normal', PDF_COLORS.slate);
            addText(`   Severity: ${loc.K} Fatal, ${loc.A} Serious, ${loc.B} Moderate, ${loc.C} Minor, ${loc.O} PDO`, 9, 'normal', PDF_COLORS.slateLight);
            addSpacer(3);
        });
        addSpacer(10);
        addText('Note: For interactive map visualization, please use the CRASH LENS web application.', 10, 'italic', PDF_COLORS.slateLight);
        addPageNumber(6);

        // PAGE 7: Collision Analysis
        newPage();
        addText('Collision Analysis', 18, 'bold', PDF_COLORS.navy);
        addSpacer(5);
        addText('Collision Types by EPDO Impact', 14, 'bold', PDF_COLORS.navy);
        addSpacer(3);
        const maxEpdo = Math.max(...r.collisionBreakdown.slice(0, 10).map(c => c.epdo));
        r.collisionBreakdown.slice(0, 10).forEach((ct, i) => {
            const barColor = ct.K > 0 ? PDF_COLORS.fatal : PDF_COLORS.navyLight;
            addText(`${formatCollisionType(ct.name)}`, 10, ct.K > 0 ? 'bold' : 'normal', ct.K > 0 ? PDF_COLORS.fatal : PDF_COLORS.slate);
            addText(`  ${ct.count} crashes | K:${ct.K} A:${ct.A} | EPDO: ${ct.epdo.toLocaleString()}`, 9, 'normal', PDF_COLORS.slateLight);
            yPos -= 4;
            addBar(ct.epdo, maxEpdo, 40, barColor, 90);
            yPos += 2;
        });
        addPageNumber(7);

        // PAGE 8: Severity Distribution
        newPage();
        addText('Severity Distribution', 18, 'bold', PDF_COLORS.navy);
        addSpacer(5);
        if (ai.severity) {
            addText(sanitizeTextForExport(ai.severity), 10, 'normal', PDF_COLORS.slate);
            addSpacer(5);
        }
        addText('Detailed Severity Breakdown', 14, 'bold', PDF_COLORS.navy);
        addSpacer(3);
        const sevBreakdown = [
            { sev: 'Fatal (K)', count: r.stats.K, weight: EPDO_W.K, color: PDF_COLORS.fatal },
            { sev: 'Serious Injury (A)', count: r.stats.A, weight: EPDO_W.A, color: PDF_COLORS.serious },
            { sev: 'Moderate Injury (B)', count: r.stats.B, weight: EPDO_W.B, color: PDF_COLORS.moderate },
            { sev: 'Minor Injury (C)', count: r.stats.C, weight: EPDO_W.C, color: '#1D4ED8' },
            { sev: 'Property Damage Only (O)', count: r.stats.O, weight: EPDO_W.O, color: '#9CA3AF' }
        ];
        sevBreakdown.forEach(s => {
            const pct = ((s.count / r.stats.total) * 100).toFixed(1);
            const epdo = s.count * s.weight;
            addText(`${s.sev}: ${s.count} crashes (${pct}%)`, 11, 'normal', s.color);
            addText(`  EPDO Contribution: ${epdo.toLocaleString()} (weight: ${s.weight}x)`, 9, 'normal', PDF_COLORS.slateLight);
        });
        addSpacer(8);
        addText(`Total EPDO Score: ${calcEPDO(r.stats).toLocaleString()}`, 14, 'bold', PDF_COLORS.navy);
        addPageNumber(8);

        // PAGE 9: Contributing Factors
        newPage();
        addText('Contributing Factors', 18, 'bold', PDF_COLORS.navy);
        addSpacer(5);
        addText('Primary Contributing Factors', 14, 'bold', PDF_COLORS.navy);
        // CC 370 — when an array is genuinely empty (no matview rows for this
        // scope), render an honest empty-state line instead of a bare header so
        // the page never looks "blank". r.factors/weatherImpact/lightConditions
        // are already array-coerced above (CC 367).
        if (r.factors.length) {
            const maxFactorCount = Math.max(...r.factors.map(f => f[1]));
            r.factors.forEach(f => {
                const pct = ((f[1] / r.stats.total) * 100).toFixed(1);
                addText(`${f[0]}: ${f[1]} crashes (${pct}%)`, 10, 'normal', PDF_COLORS.slate);
                yPos -= 4;
                addBar(f[1], maxFactorCount, 35, '#f59e0b', 70);
                yPos += 2;
            });
        } else {
            addText('No contributing factor data available for this scope.', 10, 'italic', PDF_COLORS.slateLight);
        }
        addSpacer(10);
        addText('Weather Conditions', 14, 'bold', PDF_COLORS.navy);
        if (r.weatherImpact.length) {
            r.weatherImpact.slice(0, 5).forEach(w => {
                const pct = ((w.count / r.stats.total) * 100).toFixed(1);
                addText(`${w.name}: ${w.count} crashes (${pct}%)`, 10, 'normal', PDF_COLORS.slate);
            });
        } else {
            addText('No weather data available for this scope.', 10, 'italic', PDF_COLORS.slateLight);
        }
        addSpacer(8);
        addText('Light Conditions', 14, 'bold', PDF_COLORS.navy);
        if (r.lightConditions.length) {
            r.lightConditions.slice(0, 5).forEach(l => {
                const pct = ((l.count / r.stats.total) * 100).toFixed(1);
                addText(`${l.name}: ${l.count} crashes (${pct}%)`, 10, 'normal', PDF_COLORS.slate);
            });
        } else {
            addText('No light condition data available for this scope.', 10, 'italic', PDF_COLORS.slateLight);
        }
        addPageNumber(9);

        // PAGE 10: Vulnerable Road Users
        newPage();
        addText('Vulnerable Road Users', 18, 'bold', PDF_COLORS.navy);
        addSpacer(5);
        if (ai.focus) {
            addText(sanitizeTextForExport(ai.focus), 10, 'normal', PDF_COLORS.slate);
            addSpacer(5);
        }
        addText('Pedestrian Safety', 14, 'bold', '#0891b2');
        addText(`Total Crashes: ${(r.vulnerableUsers?.ped?.total ?? 0)} | Fatal: ${(r.vulnerableUsers?.ped?.K ?? 0)} | Serious: ${(r.vulnerableUsers?.ped?.A ?? 0)}`, 11, 'normal', PDF_COLORS.slate);
        addText(`EPDO Score: ${r.vulnerableUsers?.ped?.epdo?.toLocaleString() || calcEPDO(r.vulnerableUsers?.ped ?? {}).toLocaleString()}`, 10, 'normal', PDF_COLORS.slateLight);
        addSpacer(3);
        addText('Top Pedestrian Crash Locations:', 10, 'bold', PDF_COLORS.navy);
        (r.vulnerableUsers?.ped?.topLocations ?? []).filter(([loc]) => isValidLocationCode(loc)).slice(0, 5).forEach(([loc, count]) => {
            addText(`  ${formatRouteName(loc)}: ${count} crashes`, 9, 'normal', PDF_COLORS.slate);
        });
        addSpacer(10);
        addText('Bicycle Safety', 14, 'bold', '#059669');
        addText(`Total Crashes: ${(r.vulnerableUsers?.bike?.total ?? 0)} | Fatal: ${(r.vulnerableUsers?.bike?.K ?? 0)} | Serious: ${(r.vulnerableUsers?.bike?.A ?? 0)}`, 11, 'normal', PDF_COLORS.slate);
        addText(`EPDO Score: ${r.vulnerableUsers?.bike?.epdo?.toLocaleString() || calcEPDO(r.vulnerableUsers?.bike ?? {}).toLocaleString()}`, 10, 'normal', PDF_COLORS.slateLight);
        addSpacer(3);
        addText('Top Bicycle Crash Locations:', 10, 'bold', PDF_COLORS.navy);
        (r.vulnerableUsers?.bike?.topLocations ?? []).filter(([loc]) => isValidLocationCode(loc)).slice(0, 5).forEach(([loc, count]) => {
            addText(`  ${formatRouteName(loc)}: ${count} crashes`, 9, 'normal', PDF_COLORS.slate);
        });
        addPageNumber(10);

        // PAGE 11: Trends & Comparison
        newPage();
        addText('Trends & Comparison', 18, 'bold', PDF_COLORS.navy);
        addSpacer(5);
        addText('Monthly Crash Trends', 14, 'bold', PDF_COLORS.navy);
        addSpacer(3);
        const recentMonths = r.monthlyTrends.slice(-12);
        const maxMonthCount = Math.max(...recentMonths.map(m => m.count));
        recentMonths.forEach(mt => {
            const sevSuffix = mt.K > 0 || mt.A > 0 ? ` (${mt.K}K, ${mt.A}A)` : '';
            addText(`${mt.month}: ${mt.count.toString().padStart(4)}${sevSuffix}`, 9, 'normal', PDF_COLORS.slate);
            yPos -= 4;
            addBar(mt.count, maxMonthCount, 40, PDF_COLORS.navyLight, 50);
            yPos += 2;
        });
        addSpacer(10);
        addText('Quarter-over-Quarter Comparison', 14, 'bold', PDF_COLORS.navy);
        if (r.yoyComparison?.hasPreviousData) {
            addText(`${r.yoyComparison.currentQuarter || 'Current Quarter'} vs ${r.yoyComparison.previousQuarter || 'Previous Quarter'}`, 10, 'italic', PDF_COLORS.slateLight);
            addText(`Current: ${r.yoyComparison.current.total} crashes (${r.yoyComparison.current.K} fatal, ${r.yoyComparison.current.A} serious)`, 10, 'normal', PDF_COLORS.slate);
            addText(`Previous: ${r.yoyComparison.previous.total} crashes (${r.yoyComparison.previous.K} fatal, ${r.yoyComparison.previous.A} serious)`, 10, 'normal', PDF_COLORS.slate);
            addText(`Change: ${r.yoyComparison.changes.total > 0 ? '+' : ''}${r.yoyComparison.changes.total}% total | ${r.yoyComparison.changes.fatal > 0 ? '+' : ''}${r.yoyComparison.changes.fatal}% fatal | ${r.yoyComparison.changes.serious > 0 ? '+' : ''}${r.yoyComparison.changes.serious}% serious`, 11, 'bold', r.yoyComparison.changes.total > 0 ? PDF_COLORS.fatal : '#16a34a');
        } else {
            addText(`Trend vs Prior: ${r.trendData.totalChange > 0 ? '+' : ''}${r.trendData.totalChange}%`, 11, 'normal', PDF_COLORS.slate);
            addText('Note: Comparison period not specified - showing change from previous available data', 9, 'italic', PDF_COLORS.slateLight);
        }
        addPageNumber(11);

        // PAGE 12: Safety Priorities
        newPage();
        addText('Safety Priorities', 18, 'bold', PDF_COLORS.navy);
        addSpacer(5);
        addText('Priority Ranking Methodology: EPDO-weighted analysis', 11, 'italic', PDF_COLORS.slateLight);
        addSpacer(8);
        addText('Top Priority Locations for Safety Improvements', 14, 'bold', PDF_COLORS.navy);
        addSpacer(3);
        r.topLocations.slice(0, 5).forEach((loc, i) => {
            addText(`PRIORITY ${i + 1}: ${formatRouteName(loc.name)}`, 12, 'bold', i === 0 ? PDF_COLORS.fatal : PDF_COLORS.navy);
            addText(`  EPDO Score: ${loc.epdo.toLocaleString()} | Total: ${loc.total} | Fatal: ${loc.K} | Serious: ${loc.A}`, 10, 'normal', PDF_COLORS.slate);
            // Top collision types for this location
            const topType = r.collisionBreakdown[0]?.name || 'Various';
            addText(`  Primary crash type at this location type: ${topType}`, 9, 'italic', PDF_COLORS.slateLight);
            addSpacer(3);
        });
        addPageNumber(12);

        // PAGE 13: Funding Opportunities
        newPage();
        addText('Funding Opportunities', 18, 'bold', PDF_COLORS.navy);
        addSpacer(5);
        addText('Based on the crash profile, the following grant programs may be applicable:', 10, 'normal', PDF_COLORS.slate);
        addSpacer(8);
        addText('Federal Programs', 14, 'bold', PDF_COLORS.navy);
        addText('✓ Highway Safety Improvement Program (HSIP)', 10, 'normal', PDF_COLORS.slate);
        addText('  - Eligible for locations with documented crash history', 9, 'normal', PDF_COLORS.slateLight);
        addText('✓ Safe Streets and Roads for All (SS4A)', 10, 'normal', PDF_COLORS.slate);
        addText('  - Supports comprehensive safety action plans', 9, 'normal', PDF_COLORS.slateLight);
        addText('✓ NHTSA Section 402/405 Grants', 10, 'normal', PDF_COLORS.slate);
        addText('  - Behavioral safety programs and enforcement', 9, 'normal', PDF_COLORS.slateLight);
        addSpacer(8);
        addText('State Programs', 14, 'bold', PDF_COLORS.navy);
        _stateFundingPrograms().forEach(p => addText('✓ ' + p, 10, 'normal', PDF_COLORS.slate));
        addSpacer(8);
        addText('Eligibility Indicators', 14, 'bold', PDF_COLORS.navy);
        const pedEligible = (r.vulnerableUsers?.ped?.total ?? 0) > 10;
        const fatalEligible = r.stats.K > 0;
        addText(`${pedEligible ? '✓' : '○'} Pedestrian/Bicycle Safety Funding (${(r.vulnerableUsers?.ped?.total ?? 0) + (r.vulnerableUsers?.bike?.total ?? 0)} VRU crashes)`, 10, 'normal', pedEligible ? '#16a34a' : '#94a3b8');
        addText(`${fatalEligible ? '✓' : '○'} Fatal Crash Reduction Programs (${r.stats.K} fatal crashes)`, 10, 'normal', fatalEligible ? '#16a34a' : '#94a3b8');
        addPageNumber(13);

        // PAGE 14: Data & Methodology
        newPage();
        addText('Data & Methodology', 18, 'bold', PDF_COLORS.navy);
        addSpacer(5);
        addText('Data Source', 14, 'bold', PDF_COLORS.navy);
        addText(getDataSourceLabel(), 11, 'normal', PDF_COLORS.slate);
        addSpacer(5);
        addText('Analysis Period', 14, 'bold', PDF_COLORS.navy);
        addText(`${m.startDate || 'All available data'} to ${m.endDate || 'Present'}`, 11, 'normal', PDF_COLORS.slate);
        addSpacer(5);
        addText('Crash Count', 14, 'bold', PDF_COLORS.navy);
        addText(`${m.crashCount.toLocaleString()} crashes analyzed`, 11, 'normal', PDF_COLORS.slate);
        addSpacer(8);
        addText('EPDO Weighting Methodology', 14, 'bold', PDF_COLORS.navy);
        addText('Equivalent Property Damage Only (EPDO) weights used:', 10, 'normal', PDF_COLORS.slate);
        addText('  K (Fatal): ' + EPDO_W.K + ' | A (Serious): ' + EPDO_W.A + ' | B (Moderate): ' + EPDO_W.B + ' | C (Minor): ' + EPDO_W.C + ' | O (PDO): ' + EPDO_W.O, 10, 'normal', PDF_COLORS.slateLight);
        addSpacer(10);
        addText('DATA NOTES', 14, 'bold', PDF_COLORS.moderate);
        // Calculate actual location coverage
        const locCoverage = r.locationCoverage || { total: m.crashCount, withLocation: r.topLocations.reduce((sum, l) => sum + l.total, 0), percentage: 0 };
        if (!locCoverage.percentage) {
            locCoverage.percentage = ((locCoverage.withLocation / locCoverage.total) * 100).toFixed(1);
        }
        addText(`• Location data available for ${locCoverage.withLocation.toLocaleString()} of ${locCoverage.total.toLocaleString()} records (${locCoverage.percentage}%)`, 10, 'normal', PDF_COLORS.slate);
        addText(`• Records with severity data: ${r.stats.total.toLocaleString()} (${((r.stats.total / m.crashCount) * 100).toFixed(1)}%)`, 10, 'normal', PDF_COLORS.slate);
        // Show comparison period if available
        if (r.yoyComparison?.hasPreviousData) {
            addText(`• Comparison period: ${r.yoyComparison.currentPeriod || 'Current 12 months'} vs ${r.yoyComparison.previousPeriod || 'Prior 12 months'}`, 10, 'normal', PDF_COLORS.slate);
        } else if (m.startDate && m.endDate) {
            addText(`• Analysis period: ${m.startDate} to ${m.endDate}`, 10, 'normal', PDF_COLORS.slate);
        }
        addText('• Source: ' + getDataSourceLabel(), 10, 'normal', PDF_COLORS.slate);
        addSpacer(8);
        // Visual highlight box for important limitation
        pdf.setFillColor(254, 243, 199); // Light amber background
        pdf.rect(margin, yPos - 2, contentWidth, 12, 'F');
        pdf.setDrawColor(245, 158, 11);
        pdf.rect(margin, yPos - 2, contentWidth, 12, 'S');
        addText(`⚠ IMPORTANT: Only ${locCoverage.percentage}% of crash records have valid location data. Location-based analyses may not represent all crashes.`, 9, 'bold', '#92400e');
        addSpacer(10);
        addText('Disclaimer', 14, 'bold', PDF_COLORS.navy);
        addText('This report contains AI-generated insights that require human review and validation. The user is responsible for final decisions based on this data. CRASH LENS and its developers are not liable for any errors or outcomes.', 10, 'italic', PDF_COLORS.slateLight);
        addPageNumber(14);

        // Save PDF — CC 367: tier-stamped filename so Kent vs Statewide don't collide.
        pdf.save(_cc367_filename('comprehensive'));

        hideLoading();
    } catch (e) {
        hideLoading();
        console.error('[PDF Export Error]', e);
        alert('Error generating PDF: ' + e.message);
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

async function downloadComprehensiveWord() {
    if (!comprehensiveReportData) {
        alert('Please generate the report first.');
        return;
    }

    showLoading('Generating Word document...');

    try {
        const m = comprehensiveReportData.metadata;
        const r = comprehensiveReportData.rawData;
        const ai = comprehensiveReportData.aiInsights || {};

        // CC 341 F3 — FHWA 2025 EPDO weights (FHWA-SA-25-021), sourced from the shared constants.
        const EPDO_W = (window.CL && window.CL.core && window.CL.core.constants && window.CL.core.constants.EPDO_WEIGHTS_DEFAULT)
                    || { K: 883, A: 94, B: 21, C: 11, O: 1 };

        // Helper: Format hour for display
        const fmtHour = (h) => h === 0 ? '12 AM' : (h === 12 ? '12 PM' : (h > 12 ? `${h-12} PM` : `${h} AM`));

        // Build HTML content for Word export - redesigned 14-page report
        let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${sanitizeTextForExport(m.title)}</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.6; max-width: 8.5in; margin: 0 auto; padding: 1in; }
h1 { color: #1e40af; font-size: 24pt; margin-top: 0; }
h2 { color: #1e40af; font-size: 16pt; margin-top: 24pt; border-bottom: 2px solid #3b82f6; padding-bottom: 4pt; }
h3 { color: #1e293b; font-size: 13pt; margin-top: 16pt; }
table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
th, td { border: 1px solid #e2e8f0; padding: 6pt 8pt; text-align: left; }
th { background: #f1f5f9; font-weight: bold; }
.kpi { display: inline-block; padding: 8pt 16pt; margin: 4pt; border-radius: 4pt; text-align: center; }
.kpi-fatal { background: #fef2f2; color: #dc2626; }
.kpi-serious { background: #fff7ed; color: #ea580c; }
.kpi-epdo { background: #eff6ff; color: #1e40af; }
.page-break { page-break-before: always; }
.disclaimer { background: #fef3c7; border-left: 4pt solid #f59e0b; padding: 8pt; margin: 12pt 0; font-size: 9pt; }
.key-finding { background: #f8fafc; border-left: 4pt solid #3b82f6; padding: 8pt; margin: 8pt 0; }
.priority-1 { background: #fef2f2; border-left: 4pt solid #dc2626; padding: 8pt; margin: 8pt 0; }
.priority-2 { background: #fff7ed; border-left: 4pt solid #ea580c; padding: 8pt; margin: 8pt 0; }
.footer { margin-top: 24pt; padding-top: 12pt; border-top: 1px solid #e2e8f0; font-size: 9pt; color: #64748b; }
</style>
</head>
<body>

<!-- PAGE 1: Executive Dashboard -->
<h1>${sanitizeTextForExport(m.agency.toUpperCase())}</h1>
<p style="font-size: 14pt; color: #64748b;">${sanitizeTextForExport(m.department)}</p>
<h1 style="font-size: 28pt; color: #1e293b; margin-top: 32pt;">${sanitizeTextForExport(m.title)}</h1>
<p style="font-size: 18pt; color: #3b82f6;">${sanitizeTextForExport(m.quarter)}</p>

<h3 style="margin-top: 24pt;">Key Metrics</h3>
<table>
<tr>
<th style="background:#fef2f2;color:#dc2626">Fatal (K)</th>
<th style="background:#fff7ed;color:#ea580c">Serious (A)</th>
<th style="background:#eff6ff;color:#1e40af">EPDO Score</th>
<th style="background:#f0fdf4;color:#16a34a">Trend</th>
</tr>
<tr>
<td style="text-align:center;font-size:18pt;font-weight:bold">${r.stats.K}</td>
<td style="text-align:center;font-size:18pt;font-weight:bold">${r.stats.A}</td>
<td style="text-align:center;font-size:18pt;font-weight:bold">${calcEPDO(r.stats).toLocaleString()}</td>
<td style="text-align:center;font-size:18pt;font-weight:bold;color:${r.trendData.totalChange > 0 ? '#dc2626' : '#16a34a'}">${r.trendData.totalChange > 0 ? '+' : ''}${r.trendData.totalChange}%</td>
</tr>
</table>

${r.dataInsights && r.dataInsights.length > 0 ? `
<h3>Key Findings</h3>
<ul>
${r.dataInsights.map(insight => `<li>${sanitizeTextForExport(insight)}</li>`).join('\n')}
</ul>
` : ''}

<h3>Top Priority Locations</h3>
<table>
<tr><th>#</th><th>Location</th><th>Crashes</th><th>K+A</th><th>EPDO</th></tr>
${r.topLocations.slice(0, 3).map((loc, i) =>
`<tr style="${i === 0 ? 'background:#fef2f2' : ''}"><td>${i + 1}</td><td>${formatRouteName(loc.name)}</td><td>${loc.total}</td><td style="color:#dc2626">${loc.K + loc.A}</td><td style="font-weight:bold">${loc.epdo.toLocaleString()}</td></tr>`
).join('\n')}
</table>

<p style="margin-top: 32pt;"><strong>${m.crashCount.toLocaleString()}</strong> Crashes Analyzed | Prepared by: ${sanitizeTextForExport(m.author)}</p>
<p>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

<div class="page-break"></div>

<!-- PAGE 2: Table of Contents -->
<h2>Table of Contents</h2>
<ol>
${comprehensiveReportData.sections.map(s => `<li>${s.title} (Page ${s.page})</li>`).join('\n')}
</ol>

<div class="page-break"></div>

<!-- PAGE 3: Executive Summary -->
<h2>Executive Summary</h2>
${ai.executive ? `<p>${sanitizeTextForExport(ai.executive)}</p><div class="disclaimer">AI-generated insight - requires human review</div>` :
`<p>This quarter, ${sanitizeTextForExport(m.agency)} recorded ${r.stats.total.toLocaleString()} crashes, including ${r.stats.K} fatal and ${r.stats.A} serious injury incidents.</p>`}

<h3>Crash Severity Overview</h3>
<table>
<tr><th>Severity</th><th>Count</th><th>Percentage</th><th>EPDO Weight</th><th>EPDO Contribution</th></tr>
<tr><td style="color:#dc2626;font-weight:bold">Fatal (K)</td><td>${r.stats.K}</td><td>${((r.stats.K / (r.stats.total || 1)) * 100).toFixed(1)}%</td><td>${EPDO_W.K}</td><td>${(r.stats.K * EPDO_W.K).toLocaleString()}</td></tr>
<tr><td style="color:#ea580c;font-weight:bold">Serious Injury (A)</td><td>${r.stats.A}</td><td>${((r.stats.A / (r.stats.total || 1)) * 100).toFixed(1)}%</td><td>${EPDO_W.A}</td><td>${(r.stats.A * EPDO_W.A).toLocaleString()}</td></tr>
<tr><td>Moderate Injury (B)</td><td>${r.stats.B}</td><td>${((r.stats.B / (r.stats.total || 1)) * 100).toFixed(1)}%</td><td>${EPDO_W.B}</td><td>${(r.stats.B * EPDO_W.B).toLocaleString()}</td></tr>
<tr><td>Minor Injury (C)</td><td>${r.stats.C}</td><td>${((r.stats.C / (r.stats.total || 1)) * 100).toFixed(1)}%</td><td>${EPDO_W.C}</td><td>${(r.stats.C * EPDO_W.C).toLocaleString()}</td></tr>
<tr><td>Property Damage Only (O)</td><td>${r.stats.O}</td><td>${((r.stats.O / (r.stats.total || 1)) * 100).toFixed(1)}%</td><td>${EPDO_W.O}</td><td>${(r.stats.O * EPDO_W.O).toLocaleString()}</td></tr>
<tr><th>Total</th><th>${r.stats.total}</th><th>100%</th><th></th><th style="color:#1e40af;font-weight:bold">${calcEPDO(r.stats).toLocaleString()}</th></tr>
</table>

${r.yoyComparison?.hasPreviousData ? `
<h3>Quarter-over-Quarter Comparison</h3>
<p><em>${r.yoyComparison.currentQuarter || 'Current Quarter'} vs ${r.yoyComparison.previousQuarter || 'Previous Quarter'}</em></p>
<table>
<tr><th>Period</th><th>Total Crashes</th><th>Fatal (K)</th><th>Serious (A)</th><th>Pedestrian</th><th>Bicycle</th></tr>
<tr><td>${r.yoyComparison.previousQuarter || 'Previous'}</td><td>${r.yoyComparison.previous.total}</td><td style="color:#dc2626">${r.yoyComparison.previous.K}</td><td style="color:#ea580c">${r.yoyComparison.previous.A}</td><td>${r.yoyComparison.previous.ped}</td><td>${r.yoyComparison.previous.bike}</td></tr>
<tr><td>${r.yoyComparison.currentQuarter || 'Current'}</td><td>${r.yoyComparison.current.total}</td><td style="color:#dc2626">${r.yoyComparison.current.K}</td><td style="color:#ea580c">${r.yoyComparison.current.A}</td><td>${r.yoyComparison.current.ped}</td><td>${r.yoyComparison.current.bike}</td></tr>
<tr style="background:#f0f9ff"><th>Change</th><th style="color:${r.yoyComparison.changes.total > 0 ? '#dc2626' : '#16a34a'}">${r.yoyComparison.changes.total > 0 ? '+' : ''}${r.yoyComparison.changes.total}%</th><th style="color:${r.yoyComparison.changes.fatal > 0 ? '#dc2626' : '#16a34a'}">${r.yoyComparison.changes.fatal > 0 ? '+' : ''}${r.yoyComparison.changes.fatal}%</th><th style="color:${r.yoyComparison.changes.serious > 0 ? '#dc2626' : '#16a34a'}">${r.yoyComparison.changes.serious > 0 ? '+' : ''}${r.yoyComparison.changes.serious}%</th><th style="color:${r.yoyComparison.changes.ped > 0 ? '#dc2626' : '#16a34a'}">${r.yoyComparison.changes.ped > 0 ? '+' : ''}${r.yoyComparison.changes.ped}%</th><th style="color:${r.yoyComparison.changes.bike > 0 ? '#dc2626' : '#16a34a'}">${r.yoyComparison.changes.bike > 0 ? '+' : ''}${r.yoyComparison.changes.bike}%</th></tr>
</table>
` : ''}

${r.yoyComparison?.historical ? `
<h3>Historical Context (Since ${r.yoyComparison.historical.startYear})</h3>
<p><strong>Total crashes in database:</strong> ${r.yoyComparison.historical.total.toLocaleString()} crashes</p>
<p><strong>Historical severity breakdown:</strong> ${r.yoyComparison.historical.K} fatal (K), ${r.yoyComparison.historical.A} serious (A), ${r.yoyComparison.historical.ped} pedestrian, ${r.yoyComparison.historical.bike} bicycle</p>
` : ''}

<div class="page-break"></div>

<!-- PAGE 4: Temporal Analysis -->
<h2>Temporal Analysis</h2>
<p><strong>Peak Crash Day:</strong> ${r.peakPatterns.peakDay} | <strong>Peak Crash Time:</strong> ${r.peakPatterns.peakTime}</p>
${r.dayHourMatrix?.peakCell ? `<p style="color:#dc2626"><strong>Highest Risk Window:</strong> ${r.dayHourMatrix.peakCell.day} at ${fmtHour(r.dayHourMatrix.peakCell.hour)} (${r.dayHourMatrix.peakCell.count} crashes)</p>` : ''}
${ai.temporal ? `<p>${sanitizeTextForExport(ai.temporal)}</p><div class="disclaimer">AI-generated insight - requires human review</div>` : ''}

<h3>Day of Week Distribution</h3>
<table>
<tr><th>Day</th><th>Total</th><th>Fatal (K)</th><th>Serious (A)</th></tr>
${Object.entries(r.dayOfWeekAnalysis).map(([day, data]) =>
`<tr><td>${day}</td><td>${data.count}</td><td style="color:#dc2626">${data.K}</td><td style="color:#ea580c">${data.A}</td></tr>`
).join('\n')}
</table>

<div class="page-break"></div>

<!-- PAGE 5: High-Priority Locations -->
<h2>High-Priority Locations</h2>
${ai.locations ? `<p>${sanitizeTextForExport(ai.locations)}</p><div class="disclaimer">AI-generated insight - requires human review</div>` : ''}

<h3>Top 10 Locations by EPDO Score</h3>
<table>
<tr><th>Rank</th><th>Location</th><th>Total</th><th>Fatal (K)</th><th>Serious (A)</th><th>EPDO</th></tr>
${r.topLocations.slice(0, 10).map((loc, i) =>
`<tr style="${i === 0 ? 'background:#fef2f2' : (i < 3 ? 'background:#fff7ed' : '')}"><td style="font-weight:bold">${i + 1}</td><td>${formatRouteName(loc.name)}</td><td>${loc.total}</td><td style="color:#dc2626">${loc.K}</td><td style="color:#ea580c">${loc.A}</td><td style="font-weight:bold">${loc.epdo.toLocaleString()}</td></tr>`
).join('\n')}
</table>

<div class="page-break"></div>

<!-- PAGE 6: Collision Analysis -->
<h2>Collision Analysis</h2>
<h3>Collision Types by EPDO Impact</h3>
<table>
<tr><th>Collision Type</th><th>Count</th><th>K</th><th>A</th><th>EPDO</th></tr>
${r.collisionBreakdown.slice(0, 10).map(ct =>
`<tr style="${ct.K > 0 ? 'background:#fef2f2' : ''}"><td>${formatCollisionType(ct.name)}</td><td>${ct.count}</td><td style="color:#dc2626">${ct.K}</td><td style="color:#ea580c">${ct.A}</td><td style="font-weight:bold">${ct.epdo.toLocaleString()}</td></tr>`
).join('\n')}
</table>

<div class="page-break"></div>

<!-- PAGE 7: Contributing Factors -->
<h2>Contributing Factors</h2>
<h3>Primary Contributing Factors</h3>
<table>
<tr><th>Factor</th><th>Count</th><th>Percentage</th></tr>
${r.factors.map(f =>
`<tr><td>${f[0]}</td><td>${f[1]}</td><td>${((f[1] / r.stats.total) * 100).toFixed(1)}%</td></tr>`
).join('\n')}
</table>

<h3>Weather Conditions</h3>
<table>
<tr><th>Condition</th><th>Count</th><th>Percentage</th></tr>
${r.weatherImpact.slice(0, 5).map(w =>
`<tr><td>${w.name}</td><td>${w.count}</td><td>${((w.count / r.stats.total) * 100).toFixed(1)}%</td></tr>`
).join('\n')}
</table>

<h3>Light Conditions</h3>
<table>
<tr><th>Condition</th><th>Count</th><th>Percentage</th></tr>
${r.lightConditions.slice(0, 5).map(l =>
`<tr><td>${l.name}</td><td>${l.count}</td><td>${((l.count / r.stats.total) * 100).toFixed(1)}%</td></tr>`
).join('\n')}
</table>

<div class="page-break"></div>

<!-- PAGE 8: Vulnerable Road Users -->
<h2>Vulnerable Road Users</h2>
${ai.focus ? `<p>${sanitizeTextForExport(ai.focus)}</p><div class="disclaimer">AI-generated insight - requires human review</div>` : ''}

<h3>Pedestrian Safety</h3>
<p><strong>Total Crashes:</strong> ${r.vulnerableUsers?.ped?.total ?? 0} | <strong style="color:#dc2626">Fatal:</strong> ${r.vulnerableUsers?.ped?.K ?? 0} | <strong style="color:#ea580c">Serious:</strong> ${r.vulnerableUsers?.ped?.A ?? 0} | <strong>EPDO:</strong> ${r.vulnerableUsers?.ped?.epdo?.toLocaleString() || calcEPDO(r.vulnerableUsers?.ped ?? {}).toLocaleString()}</p>
<p><strong>Top Pedestrian Crash Locations:</strong></p>
<ul>
${(r.vulnerableUsers?.ped?.topLocations ?? []).filter(([loc]) => isValidLocationCode(loc)).slice(0, 5).map(([loc, count]) => `<li>${formatRouteName(loc)}: ${count} crashes</li>`).join('\n')}
</ul>

<h3>Bicycle Safety</h3>
<p><strong>Total Crashes:</strong> ${r.vulnerableUsers?.bike?.total ?? 0} | <strong style="color:#dc2626">Fatal:</strong> ${r.vulnerableUsers?.bike?.K ?? 0} | <strong style="color:#ea580c">Serious:</strong> ${r.vulnerableUsers?.bike?.A ?? 0} | <strong>EPDO:</strong> ${r.vulnerableUsers?.bike?.epdo?.toLocaleString() || calcEPDO(r.vulnerableUsers?.bike ?? {}).toLocaleString()}</p>
<p><strong>Top Bicycle Crash Locations:</strong></p>
<ul>
${(r.vulnerableUsers?.bike?.topLocations ?? []).filter(([loc]) => isValidLocationCode(loc)).slice(0, 5).map(([loc, count]) => `<li>${formatRouteName(loc)}: ${count} crashes</li>`).join('\n')}
</ul>

<div class="page-break"></div>

<!-- PAGE 9: Trends -->
<h2>Trends & Comparison</h2>
<h3>Monthly Crash Trends</h3>
<table>
<tr><th>Month</th><th>Total</th><th>Fatal (K)</th><th>Serious (A)</th></tr>
${r.monthlyTrends.slice(-12).map(mt =>
`<tr><td>${mt.month}</td><td>${mt.count}</td><td style="color:#dc2626">${mt.K}</td><td style="color:#ea580c">${mt.A}</td></tr>`
).join('\n')}
</table>

<div class="page-break"></div>

<!-- PAGE 10: Safety Priorities -->
<h2>Safety Priorities</h2>
<p><em>Priority Ranking Methodology: EPDO-weighted analysis</em></p>

${r.topLocations.slice(0, 5).map((loc, i) => `
<div class="${i === 0 ? 'priority-1' : 'priority-2'}">
<p style="margin:0"><strong>PRIORITY ${i + 1}: ${formatRouteName(loc.name)}</strong></p>
<p style="margin:4pt 0 0 0">EPDO Score: ${loc.epdo.toLocaleString()} | Total: ${loc.total} | Fatal: ${loc.K} | Serious: ${loc.A}</p>
</div>
`).join('\n')}

<div class="page-break"></div>

<!-- PAGE 11: Funding Opportunities -->
<h2>Funding Opportunities</h2>
<p>Based on the crash profile, the following grant programs may be applicable:</p>

<h3>Federal Programs</h3>
<ul>
<li><strong>Highway Safety Improvement Program (HSIP)</strong> - Eligible for locations with documented crash history</li>
<li><strong>Safe Streets and Roads for All (SS4A)</strong> - Supports comprehensive safety action plans</li>
<li><strong>NHTSA Section 402/405 Grants</strong> - Behavioral safety programs and enforcement</li>
</ul>

<h3>State Programs</h3>
<ul>
${_stateFundingPrograms().map(p => `<li><strong>${p}</strong></li>`).join('')}
</ul>

<h3>Eligibility Indicators</h3>
<ul>
<li>${((r.vulnerableUsers?.ped?.total ?? 0) + (r.vulnerableUsers?.bike?.total ?? 0)) > 10 ? '✓' : '○'} Pedestrian/Bicycle Safety Funding (${(r.vulnerableUsers?.ped?.total ?? 0) + (r.vulnerableUsers?.bike?.total ?? 0)} VRU crashes)</li>
<li>${r.stats.K > 0 ? '✓' : '○'} Fatal Crash Reduction Programs (${r.stats.K} fatal crashes)</li>
</ul>

<div class="page-break"></div>

<!-- PAGE 12: Data & Methodology -->
<h2>Data & Methodology</h2>
<p><strong>Data Source:</strong> ${getDataSourceLabel()}</p>
<p><strong>Analysis Period:</strong> ${m.startDate || 'All available data'} to ${m.endDate || 'Present'}</p>
<p><strong>Crash Count:</strong> ${m.crashCount.toLocaleString()} crashes analyzed</p>

<h3>EPDO Weighting Methodology</h3>
<table>
<tr><th>Severity</th><th>Weight</th><th>Description</th></tr>
<tr><td>Fatal (K)</td><td>${EPDO_W.K}</td><td>Highest priority - life-threatening</td></tr>
<tr><td>Serious Injury (A)</td><td>${EPDO_W.A}</td><td>Incapacitating injuries</td></tr>
<tr><td>Moderate Injury (B)</td><td>${EPDO_W.B}</td><td>Non-incapacitating injuries</td></tr>
<tr><td>Minor Injury (C)</td><td>${EPDO_W.C}</td><td>Possible injuries</td></tr>
<tr><td>Property Damage Only (O)</td><td>${EPDO_W.O}</td><td>No injuries</td></tr>
</table>

<h3>Data Quality Notes</h3>
<ul>
<li>Total records analyzed: ${m.crashCount.toLocaleString()}</li>
<li>Records with severity data: ${r.stats.total.toLocaleString()} (${((r.stats.total / m.crashCount) * 100).toFixed(1)}%)</li>
</ul>

<div class="disclaimer">
<strong>Disclaimer:</strong> This report contains AI-generated insights that require human review and validation. The user is responsible for final decisions based on this data. CRASH LENS and its developers are not liable for any errors or outcomes.
</div>

<div class="footer">
<p>${sanitizeTextForExport(m.agency)} ${sanitizeTextForExport(m.department)} | ${sanitizeTextForExport(m.quarter)} Quarterly Crash Report</p>
<p>Generated by ${getReportAttribution()} on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} | ${m.totalPages || 14} Pages</p>
</div>

</body>
</html>`;

        // Create downloadable Word file
        const blob = new Blob([html], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        link.download = `comprehensive_quarterly_report_${dateStr}.doc`;
        link.click();
        URL.revokeObjectURL(url);

        hideLoading();
    } catch (e) {
        hideLoading();
        console.error('[Word Export Error]', e);
        alert('Error generating Word document: ' + e.message);
    }
}

// Print Preview Function - Opens browser print dialog for report preview
function printComprehensivePreview() {
    if (!comprehensiveReportData) {
        alert('Please generate the report first.');
        return;
    }

    // Get the preview content
    const previewContent = document.getElementById('comprehensivePreviewContent');
    if (!previewContent) {
        alert('Preview content not found.');
        return;
    }

    const m = comprehensiveReportData.metadata;

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=900,height=700');

    // Build print-optimized HTML
    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${m.title} - Print Preview</title>
    <style>
        @page {
            size: letter;
            margin: 0.75in;
        }
        * {
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #1e293b;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        /* Ensure colors print */
        [style*="background"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        /* Page break control */
        .page-break {
            page-break-before: always;
        }
        /* Hide scrollbars in print */
        ::-webkit-scrollbar {
            display: none;
        }
        /* SVG icons should print */
        svg {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        /* Print header */
        .print-header {
            text-align: center;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #1E3A5F;
        }
        .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9pt;
            color: #64748b;
            padding: 0.5rem;
            border-top: 1px solid #e2e8f0;
        }
        @media print {
            body {
                padding: 0;
            }
            .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <div class="print-header no-print">
        <strong>${m.agency}</strong> - ${m.title}<br>
        <small>Generated: ${new Date().toLocaleDateString()}</small>
    </div>
    ${previewContent.innerHTML}
</body>
</html>
    `);

    printWindow.document.close();

    // Wait for content to load, then trigger print
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 250);
    };
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.infographic = CL.reports.infographic || {};
  window.generateInfographic = generateInfographic; CL.reports.infographic.generateInfographic = generateInfographic;
  window.getQuarterLabel = getQuarterLabel; CL.reports.infographic.getQuarterLabel = getQuarterLabel;
  window.computePeakPatterns = computePeakPatterns; CL.reports.infographic.computePeakPatterns = computePeakPatterns;
  window.computeContributingFactors = computeContributingFactors; CL.reports.infographic.computeContributingFactors = computeContributingFactors;
  window.computeTopLocations = computeTopLocations; CL.reports.infographic.computeTopLocations = computeTopLocations;
  window.computeTrendComparison = computeTrendComparison; CL.reports.infographic.computeTrendComparison = computeTrendComparison;
  window.computeRiskyBehaviors = computeRiskyBehaviors; CL.reports.infographic.computeRiskyBehaviors = computeRiskyBehaviors;
  window.computeYearTrends = computeYearTrends; CL.reports.infographic.computeYearTrends = computeYearTrends;
  window.computeHeatmapData = computeHeatmapData; CL.reports.infographic.computeHeatmapData = computeHeatmapData;
  window.determineFocusTopic = determineFocusTopic; CL.reports.infographic.determineFocusTopic = determineFocusTopic;
  window._activeTierLabel = _activeTierLabel; CL.reports.infographic._activeTierLabel = _activeTierLabel;
  window.populateInfographicPage1 = populateInfographicPage1; CL.reports.infographic.populateInfographicPage1 = populateInfographicPage1;
  window.populateInfographicPage2 = populateInfographicPage2; CL.reports.infographic.populateInfographicPage2 = populateInfographicPage2;
  window.showInfographicPage = showInfographicPage; CL.reports.infographic.showInfographicPage = showInfographicPage;
  window.resetInfographicDefaults = resetInfographicDefaults; CL.reports.infographic.resetInfographicDefaults = resetInfographicDefaults;
  window.downloadInfographicPNG = downloadInfographicPNG; CL.reports.infographic.downloadInfographicPNG = downloadInfographicPNG;
  window.exportReportPDF = exportReportPDF; CL.reports.infographic.exportReportPDF = exportReportPDF;
  window.downloadInfographicPDF = downloadInfographicPDF; CL.reports.infographic.downloadInfographicPDF = downloadInfographicPDF;
  window.computeCollisionBreakdown = computeCollisionBreakdown; CL.reports.infographic.computeCollisionBreakdown = computeCollisionBreakdown;
  window.computeMonthlyTrends = computeMonthlyTrends; CL.reports.infographic.computeMonthlyTrends = computeMonthlyTrends;
  window.computeDayOfWeekAnalysis = computeDayOfWeekAnalysis; CL.reports.infographic.computeDayOfWeekAnalysis = computeDayOfWeekAnalysis;
  window.computeHourlyDistribution = computeHourlyDistribution; CL.reports.infographic.computeHourlyDistribution = computeHourlyDistribution;
  window.computeWeatherImpact = computeWeatherImpact; CL.reports.infographic.computeWeatherImpact = computeWeatherImpact;
  window.computeLightConditions = computeLightConditions; CL.reports.infographic.computeLightConditions = computeLightConditions;
  window.computeVulnerableUserAnalysis = computeVulnerableUserAnalysis; CL.reports.infographic.computeVulnerableUserAnalysis = computeVulnerableUserAnalysis;
  window.computeDayHourMatrix = computeDayHourMatrix; CL.reports.infographic.computeDayHourMatrix = computeDayHourMatrix;
  window.computeYoYComparison = computeYoYComparison; CL.reports.infographic.computeYoYComparison = computeYoYComparison;
  window.computeLocationDetails = computeLocationDetails; CL.reports.infographic.computeLocationDetails = computeLocationDetails;
  window.generateAISectionInsight = generateAISectionInsight; CL.reports.infographic.generateAISectionInsight = generateAISectionInsight;
  window.renderComprehensivePreview = renderComprehensivePreview; CL.reports.infographic.renderComprehensivePreview = renderComprehensivePreview;
  window.renderComprehensiveTOC = renderComprehensiveTOC; CL.reports.infographic.renderComprehensiveTOC = renderComprehensiveTOC;
  window._stateFundingPrograms = _stateFundingPrograms; CL.reports.infographic._stateFundingPrograms = _stateFundingPrograms;
  window.downloadComprehensivePDF = downloadComprehensivePDF; CL.reports.infographic.downloadComprehensivePDF = downloadComprehensivePDF;
  window.hexToRgb = hexToRgb; CL.reports.infographic.hexToRgb = hexToRgb;
  window.downloadComprehensiveWord = downloadComprehensiveWord; CL.reports.infographic.downloadComprehensiveWord = downloadComprehensiveWord;
  window.printComprehensivePreview = printComprehensivePreview; CL.reports.infographic.printComprehensivePreview = printComprehensivePreview;
  CL._registerModule('reports/infographic');
})();
