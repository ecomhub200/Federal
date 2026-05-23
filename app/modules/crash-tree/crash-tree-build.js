/**
 * CL crashTree.build module
 *
 * Extracted from app/index.html (name-anchored, live L84571-L85441)
 * on 2026-05-23. Round X modular refactor — CC 200 Pass B.
 * Responsibility: build the {id, name, total, pct, K, A, B, C, O, children}
 * tree shape from filtered crash rows (3 tree types).
 *
 * Moved fns (4): buildCrashTreeData, buildFacilityTree, buildCrashTypeTree,
 *   buildContributingFactorsTree.
 *
 * Size: 871 LOC verbatim — buildContributingFactorsTree alone is ~515 LOC
 * (indivisible single-fn block precedent: assets/transit-tab,
 * reports/reports-pdf, dashboard/dashboard-tab-comparison).
 *
 * Shared globals (crashTreeState, crashState, COL, isIntersection, isYes,
 * showCrashTreeFilterUnavailableToast L71263 — outlier, NOT moved) resolve
 * via the shared classic-script global lexical environment.
 *
 * Public API (back-compat dual exposure): window.<fn> + CL.crashTree.<fn>
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L84571-L85441) ───
// Build tree data from crash records
function buildCrashTreeData() {
    // Bug fix (round 2, 2026-05-08): in Supabase-only mode the row pipeline
    // can't filter — sampleRows is []. Calling this function would reset the
    // matview-built treeData to null. All callers (severity toggle, date
    // filter, date presets, clear-date) trip this. Skip the row pipeline
    // entirely and keep the matview-built state intact. The visible numbers
    // remain the full-period / all-severity totals from mv_crash_tree, which
    // is correct: matview-only mode cannot filter at row level.
    var _ctSupabaseMode =
        crashTreeState.source === 'supabase' ||
        !(crashState.sampleRows && crashState.sampleRows.length > 0);
    if (_ctSupabaseMode) {
        if (typeof showCrashTreeFilterUnavailableToast === 'function') {
            showCrashTreeFilterUnavailableToast();
        }
        // Re-paint from existing state. updateCrashTreeStats and renderCrashTree
        // are pure reads — they don't mutate crashTreeState.
        if (typeof renderCrashTree === 'function') renderCrashTree();
        if (typeof updateCrashTreeStats === 'function') updateCrashTreeStats();
        return;
    }
    const rows = crashState.sampleRows;
    const sevFilter = crashTreeState.severityFilter;

    // Parse date filter bounds
    const startDate = crashTreeState.dateFilter.startDate ? new Date(crashTreeState.dateFilter.startDate) : null;
    const endDate = crashTreeState.dateFilter.endDate ? new Date(crashTreeState.dateFilter.endDate) : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    // Filter crashes by severity AND date
    const filteredCrashes = rows.filter(row => {
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

    crashTreeState.totalCrashes = filteredCrashes.length;
    crashTreeState.totalKA = filteredCrashes.filter(r => {
        const s = (r[COL.SEVERITY] || '').charAt(0).toUpperCase();
        return s === 'K' || s === 'A';
    }).length;

    // Use date-only filtered crashes (NOT raw rows) for accurate KA% calculation
    // This ensures the KA% denominator respects the date filter while ignoring severity filter
    const dateOnlyFiltered = getCrashTreeDateOnlyFilteredCrashes();

    if (crashTreeState.treeType === 'facility') {
        crashTreeState.treeData = buildFacilityTree(filteredCrashes, dateOnlyFiltered);
    } else if (crashTreeState.treeType === 'crashType') {
        crashTreeState.treeData = buildCrashTypeTree(filteredCrashes, dateOnlyFiltered);
    } else if (crashTreeState.treeType === 'contributingFactors') {
        crashTreeState.treeData = buildContributingFactorsTree(filteredCrashes, dateOnlyFiltered);
    }

    // Update data table
    updateCrashTreeDataTable();
}

// Build facility type tree
// crashes: filtered by severity, allCrashes: unfiltered (for accurate KA% calculation)
function buildFacilityTree(crashes, allCrashes = null) {
    const total = crashes.length;
    if (total === 0) return null;

    // Use allCrashes for KA% calculation if provided, otherwise use crashes
    const baseData = allCrashes || crashes;

    // Helper to count severity from a list
    const countSeverity = (list) => {
        const result = { total: list.length, K: 0, A: 0, B: 0, C: 0, O: 0 };
        list.forEach(r => {
            const s = (r[COL.SEVERITY] || '').charAt(0).toUpperCase();
            if (result[s] !== undefined) result[s]++;
        });
        return result;
    };

    // Helper to get unfiltered total for a category (for accurate KA% display)
    const getUnfilteredTotal = (filterFn) => {
        return baseData.filter(filterFn).length;
    };

    // Helper to get unfiltered KA count for a category
    const getUnfilteredKA = (filterFn) => {
        return baseData.filter(r => {
            if (!filterFn(r)) return false;
            const s = (r[COL.SEVERITY] || '').charAt(0).toUpperCase();
            return s === 'K' || s === 'A';
        }).length;
    };

    // Level 1: Location Type (Intersection vs Segment)
    const atIntersection = crashes.filter(r => isIntersection(r));
    const atSegment = crashes.filter(r => !isIntersection(r));

    // Level 2: Traffic Control for intersections
    const signalFilter = r => {
        const ctrl = (r[COL.TRAFFIC_CTRL] || '').toLowerCase();
        return isIntersection(r) && (ctrl.includes('signal') || ctrl.includes('traffic light'));
    };
    const stopFilter = r => {
        const ctrl = (r[COL.TRAFFIC_CTRL] || '').toLowerCase();
        return isIntersection(r) && (ctrl.includes('stop') || ctrl.includes('yield'));
    };
    const uncontrolledFilter = r => {
        const ctrl = (r[COL.TRAFFIC_CTRL] || '').toLowerCase();
        return isIntersection(r) && !ctrl.includes('signal') && !ctrl.includes('stop') && !ctrl.includes('yield') && !ctrl.includes('traffic light');
    };

    const intSignalized = atIntersection.filter(r => {
        const ctrl = (r[COL.TRAFFIC_CTRL] || '').toLowerCase();
        return ctrl.includes('signal') || ctrl.includes('traffic light');
    });
    const intStopControlled = atIntersection.filter(r => {
        const ctrl = (r[COL.TRAFFIC_CTRL] || '').toLowerCase();
        return ctrl.includes('stop') || ctrl.includes('yield');
    });
    const intUncontrolled = atIntersection.filter(r => {
        const ctrl = (r[COL.TRAFFIC_CTRL] || '').toLowerCase();
        return !ctrl.includes('signal') && !ctrl.includes('stop') && !ctrl.includes('yield') && !ctrl.includes('traffic light');
    });

    // Level 2: Functional class for segments
    const arterialFilter = r => {
        const fc = (r[COL.FUNC_CLASS] || '').toLowerCase();
        return !isIntersection(r) && (fc.includes('arterial') || fc.includes('principal'));
    };
    const collectorFilter = r => {
        const fc = (r[COL.FUNC_CLASS] || '').toLowerCase();
        return !isIntersection(r) && fc.includes('collector');
    };
    const localFilter = r => {
        const fc = (r[COL.FUNC_CLASS] || '').toLowerCase();
        return !isIntersection(r) && (fc.includes('local') || (!fc.includes('arterial') && !fc.includes('principal') && !fc.includes('collector')));
    };

    const segArterial = atSegment.filter(r => {
        const fc = (r[COL.FUNC_CLASS] || '').toLowerCase();
        return fc.includes('arterial') || fc.includes('principal');
    });
    const segCollector = atSegment.filter(r => {
        const fc = (r[COL.FUNC_CLASS] || '').toLowerCase();
        return fc.includes('collector');
    });
    const segLocal = atSegment.filter(r => {
        const fc = (r[COL.FUNC_CLASS] || '').toLowerCase();
        return fc.includes('local') || (!fc.includes('arterial') && !fc.includes('principal') && !fc.includes('collector'));
    });

    // Build intersection children (filter out empty categories, sort by crash count)
    const intChildren = [
        { id: 'int-signalized', name: 'Signalized', list: intSignalized, stateAvg: 35, filterFn: signalFilter },
        { id: 'int-stop', name: 'Stop-Controlled', list: intStopControlled, stateAvg: 45, filterFn: stopFilter },
        { id: 'int-uncontrolled', name: 'Uncontrolled/Other', list: intUncontrolled, stateAvg: 20, filterFn: uncontrolledFilter }
    ].filter(c => c.list.length > 0).map(c => ({
        id: c.id,
        name: c.name,
        ...countSeverity(c.list),
        unfilteredTotal: getUnfilteredTotal(c.filterFn),
        unfilteredKA: getUnfilteredKA(c.filterFn),
        pct: atIntersection.length > 0 ? (c.list.length / atIntersection.length * 100) : 0,
        stateAvg: c.stateAvg,
        children: []
    })).sort((a, b) => b.total - a.total);

    // Build segment children (filter out empty categories, sort by crash count)
    const segChildren = [
        { id: 'seg-arterial', name: 'Arterial', list: segArterial, stateAvg: 40, filterFn: arterialFilter },
        { id: 'seg-collector', name: 'Collector', list: segCollector, stateAvg: 25, filterFn: collectorFilter },
        { id: 'seg-local', name: 'Local/Other', list: segLocal, stateAvg: 35, filterFn: localFilter }
    ].filter(c => c.list.length > 0).map(c => ({
        id: c.id,
        name: c.name,
        ...countSeverity(c.list),
        unfilteredTotal: getUnfilteredTotal(c.filterFn),
        unfilteredKA: getUnfilteredKA(c.filterFn),
        pct: atSegment.length > 0 ? (c.list.length / atSegment.length * 100) : 0,
        stateAvg: c.stateAvg,
        children: []
    })).sort((a, b) => b.total - a.total);

    // Build main tree (filter out empty top-level categories)
    const mainChildren = [];
    const unfilteredIntTotal = getUnfilteredTotal(r => isIntersection(r));
    const unfilteredSegTotal = getUnfilteredTotal(r => !isIntersection(r));

    if (atIntersection.length > 0) {
        mainChildren.push({
            id: 'intersection',
            name: 'Intersection',
            ...countSeverity(atIntersection),
            unfilteredTotal: unfilteredIntTotal,
            unfilteredKA: getUnfilteredKA(r => isIntersection(r)),
            pct: total > 0 ? (atIntersection.length / total * 100) : 0,
            stateAvg: 42,
            children: intChildren
        });
    }
    if (atSegment.length > 0) {
        mainChildren.push({
            id: 'segment',
            name: 'Segment/Non-Intersection',
            ...countSeverity(atSegment),
            unfilteredTotal: unfilteredSegTotal,
            unfilteredKA: getUnfilteredKA(r => !isIntersection(r)),
            pct: total > 0 ? (atSegment.length / total * 100) : 0,
            stateAvg: 58,
            children: segChildren
        });
    }

    // Sort main children by crash count (Intersection vs Segment)
    mainChildren.sort((a, b) => b.total - a.total);

    const rootUnfilteredKA = baseData.filter(r => {
        const s = (r[COL.SEVERITY] || '').charAt(0).toUpperCase();
        return s === 'K' || s === 'A';
    }).length;

    const tree = {
        id: 'root',
        name: 'All Crashes',
        ...countSeverity(crashes),
        unfilteredTotal: baseData.length,
        unfilteredKA: rootUnfilteredKA,
        pct: 100,
        children: mainChildren
    };

    return tree;
}

// Build crash type tree
// crashes: filtered by severity, allCrashes: unfiltered (for accurate KA% calculation)
function buildCrashTypeTree(crashes, allCrashes = null) {
    const total = crashes.length;
    if (total === 0) return null;

    // Use allCrashes for KA% calculation if provided, otherwise use crashes
    const baseData = allCrashes || crashes;

    const countSeverity = (list) => {
        const result = { total: list.length, K: 0, A: 0, B: 0, C: 0, O: 0 };
        list.forEach(r => {
            const s = (r[COL.SEVERITY] || '').charAt(0).toUpperCase();
            if (result[s] !== undefined) result[s]++;
        });
        return result;
    };

    // Helper to categorize a single crash
    const getCrashCategory = (crash) => {
        const collision = (crash[COL.COLLISION] || '').toLowerCase();
        const isPed = isYes(crash[COL.PED]);
        const isBike = isYes(crash[COL.BIKE]);

        if (isPed) return 'Pedestrian';
        if (isBike) return 'Bicycle';
        if (collision.includes('departure') || collision.includes('fixed object') || collision.includes('overturn') || collision.includes('ran off')) return 'Road Departure';
        if (collision.includes('angle') || collision.includes('turn') || collision.includes('right angle')) return 'Angle/Turning';
        if (collision.includes('rear') || collision.includes('following')) return 'Rear End';
        if (collision.includes('head') || collision.includes('sideswipe') || collision.includes('opposite')) return 'Head-On/Sideswipe';
        return 'Other';
    };

    // Calculate unfiltered totals and KA counts for each category (for accurate KA% display)
    const unfilteredTotals = {};
    const unfilteredKACounts = {};
    baseData.forEach(crash => {
        const cat = getCrashCategory(crash);
        unfilteredTotals[cat] = (unfilteredTotals[cat] || 0) + 1;
        const sev = (crash[COL.SEVERITY] || '').charAt(0).toUpperCase();
        if (sev === 'K' || sev === 'A') {
            unfilteredKACounts[cat] = (unfilteredKACounts[cat] || 0) + 1;
        }
    });

    // Categorize filtered crashes by collision type
    const categories = {
        'Road Departure': [],
        'Angle/Turning': [],
        'Rear End': [],
        'Head-On/Sideswipe': [],
        'Pedestrian': [],
        'Bicycle': [],
        'Other': []
    };

    crashes.forEach(crash => {
        const cat = getCrashCategory(crash);
        categories[cat].push(crash);
    });

    const stateAvgs = {
        'Road Departure': 31,
        'Angle/Turning': 24,
        'Rear End': 22,
        'Head-On/Sideswipe': 8,
        'Pedestrian': 5,
        'Bicycle': 2,
        'Other': 8
    };

    const children = Object.entries(categories)
        .filter(([_, list]) => list.length > 0)
        .map(([name, list]) => ({
            id: name.toLowerCase().replace(/[^a-z]/g, '-'),
            name: name,
            ...countSeverity(list),
            unfilteredTotal: unfilteredTotals[name] || list.length,
            unfilteredKA: unfilteredKACounts[name] || 0,
            pct: total > 0 ? (list.length / total * 100) : 0,
            stateAvg: stateAvgs[name] || 10,
            children: []
        }))
        .sort((a, b) => b.total - a.total);

    const rootUnfilteredKA = baseData.filter(r => {
        const s = (r[COL.SEVERITY] || '').charAt(0).toUpperCase();
        return s === 'K' || s === 'A';
    }).length;

    return {
        id: 'root',
        name: 'All Crashes',
        ...countSeverity(crashes),
        unfilteredTotal: baseData.length,
        unfilteredKA: rootUnfilteredKA,
        pct: 100,
        children: children
    };
}

// Build contributing factors tree
// crashes: filtered by severity, allCrashes: unfiltered (for accurate KA% calculation)
// NOTE: A crash can appear in multiple categories if it has multiple contributing factors
function buildContributingFactorsTree(crashes, allCrashes = null) {
    const total = crashes.length;
    if (total === 0) return null;

    // Use allCrashes for KA% calculation if provided, otherwise use crashes
    const baseData = allCrashes || crashes;
    const baseTotal = baseData.length;

    // Helper to count severity from a list
    const countSeverity = (list) => {
        const result = { total: list.length, K: 0, A: 0, B: 0, C: 0, O: 0 };
        list.forEach(r => {
            const s = (r[COL.SEVERITY] || '').charAt(0).toUpperCase();
            if (result[s] !== undefined) result[s]++;
        });
        return result;
    };

    // Helper to count crashes matching a filter in base data (for accurate KA%)
    const getUnfilteredTotal = (filterFn) => {
        return baseData.filter(filterFn).length;
    };

    // Helper to get unfiltered KA count for a category
    const getUnfilteredKA = (filterFn) => {
        return baseData.filter(r => {
            if (!filterFn(r)) return false;
            const s = (r[COL.SEVERITY] || '').charAt(0).toUpperCase();
            return s === 'K' || s === 'A';
        }).length;
    };

    // Get state baseline values
    const baselines = crashTreeState.stateBaseline.byContributingFactor || {};

    // ========== LEVEL 1: Main Categories ==========

    // --- Driver Behavior Category ---
    const impairedFilter = r => isYes(r[COL.ALCOHOL]) || isYes(r[COL.DRUG]);
    const alcoholFilter = r => isYes(r[COL.ALCOHOL]);
    const drugFilter = r => isYes(r[COL.DRUG]);
    const combinedSubstanceFilter = r => isYes(r[COL.ALCOHOL]) && isYes(r[COL.DRUG]);
    const speedingFilter = r => isYes(r[COL.SPEED]);
    const distractedFilter = r => isYes(r[COL.DISTRACTED]);
    const drowsyFilter = r => isYes(r[COL.DROWSY]);

    const impairedCrashes = crashes.filter(impairedFilter);
    const alcoholCrashes = crashes.filter(alcoholFilter);
    const drugCrashes = crashes.filter(drugFilter);
    const combinedSubstanceCrashes = crashes.filter(combinedSubstanceFilter);
    const speedingCrashes = crashes.filter(speedingFilter);
    const distractedCrashes = crashes.filter(distractedFilter);
    const drowsyCrashes = crashes.filter(drowsyFilter);

    // Build Impaired Driving children
    const impairedChildren = [];
    if (alcoholCrashes.length > 0) {
        impairedChildren.push({
            id: 'cf-alcohol',
            name: 'Alcohol-Involved',
            ...countSeverity(alcoholCrashes),
            unfilteredTotal: getUnfilteredTotal(alcoholFilter),
            unfilteredKA: getUnfilteredKA(alcoholFilter),
            pct: impairedCrashes.length > 0 ? (alcoholCrashes.length / impairedCrashes.length * 100) : 0,
            stateAvg: baselines.alcohol || 24,
            children: []
        });
    }
    if (drugCrashes.length > 0) {
        impairedChildren.push({
            id: 'cf-drug',
            name: 'Drug-Involved',
            ...countSeverity(drugCrashes),
            unfilteredTotal: getUnfilteredTotal(drugFilter),
            unfilteredKA: getUnfilteredKA(drugFilter),
            pct: impairedCrashes.length > 0 ? (drugCrashes.length / impairedCrashes.length * 100) : 0,
            stateAvg: baselines.drug || 8,
            children: []
        });
    }
    if (combinedSubstanceCrashes.length > 0) {
        impairedChildren.push({
            id: 'cf-combined-substance',
            name: 'Combined (Alcohol + Drug)',
            ...countSeverity(combinedSubstanceCrashes),
            unfilteredTotal: getUnfilteredTotal(combinedSubstanceFilter),
            unfilteredKA: getUnfilteredKA(combinedSubstanceFilter),
            pct: impairedCrashes.length > 0 ? (combinedSubstanceCrashes.length / impairedCrashes.length * 100) : 0,
            stateAvg: baselines.combinedSubstance || 4,
            children: []
        });
    }
    impairedChildren.sort((a, b) => b.total - a.total);

    // Build Driver Behavior children
    const driverBehaviorCrashes = crashes.filter(r =>
        impairedFilter(r) || speedingFilter(r) || distractedFilter(r) || drowsyFilter(r)
    );
    const driverBehaviorChildren = [];

    if (impairedCrashes.length > 0) {
        driverBehaviorChildren.push({
            id: 'cf-impaired',
            name: 'Impaired Driving',
            ...countSeverity(impairedCrashes),
            unfilteredTotal: getUnfilteredTotal(impairedFilter),
            unfilteredKA: getUnfilteredKA(impairedFilter),
            pct: driverBehaviorCrashes.length > 0 ? (impairedCrashes.length / driverBehaviorCrashes.length * 100) : 0,
            stateAvg: baselines.impaired || 28,
            children: impairedChildren
        });
    }
    if (speedingCrashes.length > 0) {
        driverBehaviorChildren.push({
            id: 'cf-speeding',
            name: 'Speeding',
            ...countSeverity(speedingCrashes),
            unfilteredTotal: getUnfilteredTotal(speedingFilter),
            unfilteredKA: getUnfilteredKA(speedingFilter),
            pct: driverBehaviorCrashes.length > 0 ? (speedingCrashes.length / driverBehaviorCrashes.length * 100) : 0,
            stateAvg: baselines.speeding || 25,
            children: []
        });
    }
    if (distractedCrashes.length > 0) {
        driverBehaviorChildren.push({
            id: 'cf-distracted',
            name: 'Distracted',
            ...countSeverity(distractedCrashes),
            unfilteredTotal: getUnfilteredTotal(distractedFilter),
            unfilteredKA: getUnfilteredKA(distractedFilter),
            pct: driverBehaviorCrashes.length > 0 ? (distractedCrashes.length / driverBehaviorCrashes.length * 100) : 0,
            stateAvg: baselines.distracted || 8,
            children: []
        });
    }
    if (drowsyCrashes.length > 0) {
        driverBehaviorChildren.push({
            id: 'cf-drowsy',
            name: 'Drowsy/Fatigued',
            ...countSeverity(drowsyCrashes),
            unfilteredTotal: getUnfilteredTotal(drowsyFilter),
            unfilteredKA: getUnfilteredKA(drowsyFilter),
            pct: driverBehaviorCrashes.length > 0 ? (drowsyCrashes.length / driverBehaviorCrashes.length * 100) : 0,
            stateAvg: baselines.drowsy || 3,
            children: []
        });
    }
    driverBehaviorChildren.sort((a, b) => b.total - a.total);

    // --- Driver Demographics Category ---
    const youngDriverFilter = r => isYes(r[COL.YOUNG]);
    const seniorDriverFilter = r => isYes(r[COL.SENIOR]);

    const youngDriverCrashes = crashes.filter(youngDriverFilter);
    const seniorDriverCrashes = crashes.filter(seniorDriverFilter);
    const demographicsCrashes = crashes.filter(r => youngDriverFilter(r) || seniorDriverFilter(r));

    const demographicsChildren = [];
    if (youngDriverCrashes.length > 0) {
        demographicsChildren.push({
            id: 'cf-young-driver',
            name: 'Young Driver',
            ...countSeverity(youngDriverCrashes),
            unfilteredTotal: getUnfilteredTotal(youngDriverFilter),
            unfilteredKA: getUnfilteredKA(youngDriverFilter),
            pct: demographicsCrashes.length > 0 ? (youngDriverCrashes.length / demographicsCrashes.length * 100) : 0,
            stateAvg: baselines.youngDriver || 18,
            children: []
        });
    }
    if (seniorDriverCrashes.length > 0) {
        demographicsChildren.push({
            id: 'cf-senior-driver',
            name: 'Senior Driver (65+)',
            ...countSeverity(seniorDriverCrashes),
            unfilteredTotal: getUnfilteredTotal(seniorDriverFilter),
            unfilteredKA: getUnfilteredKA(seniorDriverFilter),
            pct: demographicsCrashes.length > 0 ? (seniorDriverCrashes.length / demographicsCrashes.length * 100) : 0,
            stateAvg: baselines.seniorDriver || 15,
            children: []
        });
    }
    demographicsChildren.sort((a, b) => b.total - a.total);

    // --- Occupant Protection Category ---
    const unrestrainedFilter = r => r[COL.UNRESTRAINED] === 'Unbelted' || isYes(r[COL.UNRESTRAINED]);
    const unrestrainedCrashes = crashes.filter(unrestrainedFilter);

    // --- Environmental Conditions Category ---
    const nightFilter = r => isYes(r[COL.NIGHT]);
    const lightedFilter = r => {
        const light = (r[COL.LIGHT] || '').toLowerCase();
        return light.includes('dark') && light.includes('lighted') && !light.includes('not lighted');
    };
    const unlightedFilter = r => {
        const light = (r[COL.LIGHT] || '').toLowerCase();
        // Match "Dark - Not Lighted" OR just "Dark" (without "Lighted" modifier)
        return light.includes('dark') && (light.includes('not lighted') || !light.includes('lighted'));
    };

    const weatherFilter = r => {
        const weather = (r[COL.WEATHER] || '').toLowerCase();
        return weather && !weather.includes('clear') && !weather.includes('no adverse');
    };
    const rainFilter = r => {
        const weather = (r[COL.WEATHER] || '').toLowerCase();
        return weather.includes('rain');
    };
    const snowIceFilter = r => {
        const weather = (r[COL.WEATHER] || '').toLowerCase();
        return weather.includes('snow') || weather.includes('ice') || weather.includes('sleet');
    };
    const fogFilter = r => {
        const weather = (r[COL.WEATHER] || '').toLowerCase();
        return weather.includes('fog') || weather.includes('smoke');
    };

    const surfaceFilter = r => {
        const surface = (r[COL.SURFACE] || '').toLowerCase();
        return surface && !surface.includes('dry');
    };
    const wetFilter = r => {
        const surface = (r[COL.SURFACE] || '').toLowerCase();
        return surface.includes('wet');
    };
    const icyFilter = r => {
        const surface = (r[COL.SURFACE] || '').toLowerCase();
        return surface.includes('ice') || surface.includes('icy') || surface.includes('snow') || surface.includes('frozen');
    };

    const nightCrashes = crashes.filter(nightFilter);
    const lightedCrashes = crashes.filter(lightedFilter);
    const unlightedCrashes = crashes.filter(unlightedFilter);
    const weatherCrashes = crashes.filter(weatherFilter);
    const rainCrashes = crashes.filter(rainFilter);
    const snowIceCrashes = crashes.filter(snowIceFilter);
    const fogCrashes = crashes.filter(fogFilter);
    const surfaceCrashes = crashes.filter(surfaceFilter);
    const wetCrashes = crashes.filter(wetFilter);
    const icyCrashes = crashes.filter(icyFilter);

    const environmentalCrashes = crashes.filter(r => nightFilter(r) || weatherFilter(r) || surfaceFilter(r));

    // Build Darkness children
    const darknessChildren = [];
    if (lightedCrashes.length > 0) {
        darknessChildren.push({
            id: 'cf-darkness-lighted',
            name: 'Road Lighted',
            ...countSeverity(lightedCrashes),
            unfilteredTotal: getUnfilteredTotal(lightedFilter),
            unfilteredKA: getUnfilteredKA(lightedFilter),
            pct: nightCrashes.length > 0 ? (lightedCrashes.length / nightCrashes.length * 100) : 0,
            stateAvg: baselines.darknessLighted || 12,
            children: []
        });
    }
    if (unlightedCrashes.length > 0) {
        darknessChildren.push({
            id: 'cf-darkness-unlighted',
            name: 'Road Not Lighted',
            ...countSeverity(unlightedCrashes),
            unfilteredTotal: getUnfilteredTotal(unlightedFilter),
            unfilteredKA: getUnfilteredKA(unlightedFilter),
            pct: nightCrashes.length > 0 ? (unlightedCrashes.length / nightCrashes.length * 100) : 0,
            stateAvg: baselines.darknessUnlighted || 20,
            children: []
        });
    }
    darknessChildren.sort((a, b) => b.total - a.total);

    // Build Adverse Weather children
    const weatherChildren = [];
    if (rainCrashes.length > 0) {
        weatherChildren.push({
            id: 'cf-rain',
            name: 'Rain',
            ...countSeverity(rainCrashes),
            unfilteredTotal: getUnfilteredTotal(rainFilter),
            unfilteredKA: getUnfilteredKA(rainFilter),
            pct: weatherCrashes.length > 0 ? (rainCrashes.length / weatherCrashes.length * 100) : 0,
            stateAvg: baselines.rain || 10,
            children: []
        });
    }
    if (snowIceCrashes.length > 0) {
        weatherChildren.push({
            id: 'cf-snow-ice',
            name: 'Snow/Ice',
            ...countSeverity(snowIceCrashes),
            unfilteredTotal: getUnfilteredTotal(snowIceFilter),
            unfilteredKA: getUnfilteredKA(snowIceFilter),
            pct: weatherCrashes.length > 0 ? (snowIceCrashes.length / weatherCrashes.length * 100) : 0,
            stateAvg: baselines.snowIce || 4,
            children: []
        });
    }
    if (fogCrashes.length > 0) {
        weatherChildren.push({
            id: 'cf-fog',
            name: 'Fog/Smoke',
            ...countSeverity(fogCrashes),
            unfilteredTotal: getUnfilteredTotal(fogFilter),
            unfilteredKA: getUnfilteredKA(fogFilter),
            pct: weatherCrashes.length > 0 ? (fogCrashes.length / weatherCrashes.length * 100) : 0,
            stateAvg: baselines.fog || 1,
            children: []
        });
    }
    weatherChildren.sort((a, b) => b.total - a.total);

    // Build Surface Condition children
    const surfaceChildren = [];
    if (wetCrashes.length > 0) {
        surfaceChildren.push({
            id: 'cf-wet',
            name: 'Wet',
            ...countSeverity(wetCrashes),
            unfilteredTotal: getUnfilteredTotal(wetFilter),
            unfilteredKA: getUnfilteredKA(wetFilter),
            pct: surfaceCrashes.length > 0 ? (wetCrashes.length / surfaceCrashes.length * 100) : 0,
            stateAvg: baselines.wet || 14,
            children: []
        });
    }
    if (icyCrashes.length > 0) {
        surfaceChildren.push({
            id: 'cf-icy-snowy',
            name: 'Icy/Snow-Covered',
            ...countSeverity(icyCrashes),
            unfilteredTotal: getUnfilteredTotal(icyFilter),
            unfilteredKA: getUnfilteredKA(icyFilter),
            pct: surfaceCrashes.length > 0 ? (icyCrashes.length / surfaceCrashes.length * 100) : 0,
            stateAvg: baselines.icySnowy || 4,
            children: []
        });
    }
    surfaceChildren.sort((a, b) => b.total - a.total);

    // Build Environmental children
    const environmentalChildren = [];
    if (nightCrashes.length > 0) {
        environmentalChildren.push({
            id: 'cf-darkness',
            name: 'Darkness',
            ...countSeverity(nightCrashes),
            unfilteredTotal: getUnfilteredTotal(nightFilter),
            unfilteredKA: getUnfilteredKA(nightFilter),
            pct: environmentalCrashes.length > 0 ? (nightCrashes.length / environmentalCrashes.length * 100) : 0,
            stateAvg: baselines.darkness || 32,
            children: darknessChildren
        });
    }
    if (weatherCrashes.length > 0) {
        environmentalChildren.push({
            id: 'cf-adverse-weather',
            name: 'Adverse Weather',
            ...countSeverity(weatherCrashes),
            unfilteredTotal: getUnfilteredTotal(weatherFilter),
            unfilteredKA: getUnfilteredKA(weatherFilter),
            pct: environmentalCrashes.length > 0 ? (weatherCrashes.length / environmentalCrashes.length * 100) : 0,
            stateAvg: baselines.adverseWeather || 15,
            children: weatherChildren
        });
    }
    if (surfaceCrashes.length > 0) {
        environmentalChildren.push({
            id: 'cf-wet-icy-surface',
            name: 'Wet/Icy Surface',
            ...countSeverity(surfaceCrashes),
            unfilteredTotal: getUnfilteredTotal(surfaceFilter),
            unfilteredKA: getUnfilteredKA(surfaceFilter),
            pct: environmentalCrashes.length > 0 ? (surfaceCrashes.length / environmentalCrashes.length * 100) : 0,
            stateAvg: baselines.wetIcySurface || 18,
            children: surfaceChildren
        });
    }
    environmentalChildren.sort((a, b) => b.total - a.total);

    // --- Special Circumstances Category ---
    const hitRunFilter = r => isYes(r[COL.HITRUN]);
    const workZoneFilter = r => isYes(r[COL.WORKZONE]);
    const schoolZoneFilter = r => isYes(r[COL.SCHOOL]);

    const hitRunCrashes = crashes.filter(hitRunFilter);
    const workZoneCrashes = crashes.filter(workZoneFilter);
    const schoolZoneCrashes = crashes.filter(schoolZoneFilter);
    const specialCrashes = crashes.filter(r => hitRunFilter(r) || workZoneFilter(r) || schoolZoneFilter(r));

    const specialChildren = [];
    if (hitRunCrashes.length > 0) {
        specialChildren.push({
            id: 'cf-hit-run',
            name: 'Hit-and-Run',
            ...countSeverity(hitRunCrashes),
            unfilteredTotal: getUnfilteredTotal(hitRunFilter),
            unfilteredKA: getUnfilteredKA(hitRunFilter),
            pct: specialCrashes.length > 0 ? (hitRunCrashes.length / specialCrashes.length * 100) : 0,
            stateAvg: baselines.hitAndRun || 6,
            children: []
        });
    }
    if (workZoneCrashes.length > 0) {
        specialChildren.push({
            id: 'cf-work-zone',
            name: 'Work Zone',
            ...countSeverity(workZoneCrashes),
            unfilteredTotal: getUnfilteredTotal(workZoneFilter),
            unfilteredKA: getUnfilteredKA(workZoneFilter),
            pct: specialCrashes.length > 0 ? (workZoneCrashes.length / specialCrashes.length * 100) : 0,
            stateAvg: baselines.workZone || 2,
            children: []
        });
    }
    if (schoolZoneCrashes.length > 0) {
        specialChildren.push({
            id: 'cf-school-zone',
            name: 'School Zone',
            ...countSeverity(schoolZoneCrashes),
            unfilteredTotal: getUnfilteredTotal(schoolZoneFilter),
            unfilteredKA: getUnfilteredKA(schoolZoneFilter),
            pct: specialCrashes.length > 0 ? (schoolZoneCrashes.length / specialCrashes.length * 100) : 0,
            stateAvg: baselines.schoolZone || 1,
            children: []
        });
    }
    specialChildren.sort((a, b) => b.total - a.total);

    // ========== BUILD MAIN TREE ==========
    const mainChildren = [];

    // Driver Behavior
    if (driverBehaviorCrashes.length > 0) {
        mainChildren.push({
            id: 'cf-driver-behavior',
            name: 'Driver Behavior',
            ...countSeverity(driverBehaviorCrashes),
            unfilteredTotal: getUnfilteredTotal(r => impairedFilter(r) || speedingFilter(r) || distractedFilter(r) || drowsyFilter(r)),
            unfilteredKA: getUnfilteredKA(r => impairedFilter(r) || speedingFilter(r) || distractedFilter(r) || drowsyFilter(r)),
            pct: total > 0 ? (driverBehaviorCrashes.length / total * 100) : 0,
            stateAvg: baselines.driverBehavior || 45,
            children: driverBehaviorChildren
        });
    }

    // Driver Demographics
    if (demographicsCrashes.length > 0) {
        mainChildren.push({
            id: 'cf-driver-demographics',
            name: 'Driver Demographics',
            ...countSeverity(demographicsCrashes),
            unfilteredTotal: getUnfilteredTotal(r => youngDriverFilter(r) || seniorDriverFilter(r)),
            unfilteredKA: getUnfilteredKA(r => youngDriverFilter(r) || seniorDriverFilter(r)),
            pct: total > 0 ? (demographicsCrashes.length / total * 100) : 0,
            stateAvg: baselines.driverDemographics || 30,
            children: demographicsChildren
        });
    }

    // Occupant Protection
    if (unrestrainedCrashes.length > 0) {
        mainChildren.push({
            id: 'cf-unrestrained',
            name: 'Unrestrained Occupant',
            ...countSeverity(unrestrainedCrashes),
            unfilteredTotal: getUnfilteredTotal(unrestrainedFilter),
            unfilteredKA: getUnfilteredKA(unrestrainedFilter),
            pct: total > 0 ? (unrestrainedCrashes.length / total * 100) : 0,
            stateAvg: baselines.unrestrained || 45,
            children: []
        });
    }

    // Environmental Conditions
    if (environmentalCrashes.length > 0) {
        mainChildren.push({
            id: 'cf-environmental',
            name: 'Environmental Conditions',
            ...countSeverity(environmentalCrashes),
            unfilteredTotal: getUnfilteredTotal(r => nightFilter(r) || weatherFilter(r) || surfaceFilter(r)),
            unfilteredKA: getUnfilteredKA(r => nightFilter(r) || weatherFilter(r) || surfaceFilter(r)),
            pct: total > 0 ? (environmentalCrashes.length / total * 100) : 0,
            stateAvg: baselines.environmental || 35,
            children: environmentalChildren
        });
    }

    // Special Circumstances
    if (specialCrashes.length > 0) {
        mainChildren.push({
            id: 'cf-special',
            name: 'Special Circumstances',
            ...countSeverity(specialCrashes),
            unfilteredTotal: getUnfilteredTotal(r => hitRunFilter(r) || workZoneFilter(r) || schoolZoneFilter(r)),
            unfilteredKA: getUnfilteredKA(r => hitRunFilter(r) || workZoneFilter(r) || schoolZoneFilter(r)),
            pct: total > 0 ? (specialCrashes.length / total * 100) : 0,
            stateAvg: baselines.specialCircumstances || 8,
            children: specialChildren
        });
    }

    // Sort main children by crash count
    mainChildren.sort((a, b) => b.total - a.total);

    return {
        id: 'root',
        name: 'All Crashes',
        ...countSeverity(crashes),
        unfilteredTotal: baseTotal,
        unfilteredKA: baseData.filter(r => { const s = (r[COL.SEVERITY] || '').charAt(0).toUpperCase(); return s === 'K' || s === 'A'; }).length,
        pct: 100,
        children: mainChildren
    };
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.crashTree = CL.crashTree || {};
  window.buildCrashTreeData = buildCrashTreeData; CL.crashTree.buildCrashTreeData = buildCrashTreeData;
  window.buildFacilityTree = buildFacilityTree; CL.crashTree.buildFacilityTree = buildFacilityTree;
  window.buildCrashTypeTree = buildCrashTypeTree; CL.crashTree.buildCrashTypeTree = buildCrashTypeTree;
  window.buildContributingFactorsTree = buildContributingFactorsTree; CL.crashTree.buildContributingFactorsTree = buildContributingFactorsTree;
  CL._registerModule('crash-tree/build');
})();
