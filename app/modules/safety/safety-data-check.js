/**
 * CL safety.dataCheck — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.safety.dataCheck.<fn>; module-private
 * state (0 external refs) stays inside this IIFE.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
function runSafetyDataCheck() {
    if (!safetyState.loaded) {
        showToast('Load crash data first', 'warning');
        return;
    }

    const results = {
        timestamp: new Date().toISOString(),
        passed: 0,
        failed: 0,
        warnings: 0,
        checks: []
    };

    // Run all check categories
    sfCheckSeverityTotals(results);
    sfCheckEPDOCalculations(results);
    sfCheckCategorySums(results);
    sfCheckLocationTableConsistency(results);
    sfCheckCrossAnalysisConsistency(results);
    sfCheckFilterConsistency(results);
    sfCheckDetailPanelAccuracy(results);
    sfCheckPercentageDenominators(results);

    // Display results
    displaySafetyDataCheckResults(results);
    console.log('[Safety Data Check]', results);
}

// Helper to add a check result
function sfAddCheck(results, category, name, passed, details, expected, actual) {
    const status = passed ? 'pass' : (expected !== undefined ? 'fail' : 'warn');
    if (status === 'pass') results.passed++;
    else if (status === 'fail') results.failed++;
    else results.warnings++;
    results.checks.push({ category, name, status, details, expected, actual });
}

// Check 1: Severity Distribution Integrity
function sfCheckSeverityTotals(results) {
    Object.keys(safetyCategories).forEach(catKey => {
        const catData = safetyState.data[catKey];
        if (!catData) return;

        // Recount severity from crashes
        const recount = { K: 0, A: 0, B: 0, C: 0, O: 0 };
        catData.crashes.forEach(row => {
            const sev = extractSeverity(row);
            if (recount[sev] !== undefined) recount[sev]++;
        });

        // Check each severity level
        const stored = catData.severity;
        let match = true;
        const mismatches = [];
        ['K', 'A', 'B', 'C', 'O'].forEach(s => {
            if (recount[s] !== stored[s]) {
                match = false;
                mismatches.push(`${s}: stored=${stored[s]} recounted=${recount[s]}`);
            }
        });

        sfAddCheck(results, catKey, 'Severity distribution',
            match,
            match ? `All severity counts match (${catData.crashes.length} crashes)` : `Mismatch: ${mismatches.join(', ')}`,
            match ? undefined : JSON.stringify(recount),
            match ? undefined : JSON.stringify(stored)
        );

        // Check total = sum of severity
        const sevSum = stored.K + stored.A + stored.B + stored.C + stored.O;
        const totalMatch = sevSum === catData.crashes.length;
        sfAddCheck(results, catKey, 'Severity sum = total crashes',
            totalMatch,
            totalMatch ? `Sum ${sevSum} = ${catData.crashes.length} total` : `Sum ${sevSum} != ${catData.crashes.length} total`,
            totalMatch ? undefined : catData.crashes.length,
            totalMatch ? undefined : sevSum
        );
    });
}

// Check 2: EPDO Score Accuracy
function sfCheckEPDOCalculations(results) {
    Object.keys(safetyCategories).forEach(catKey => {
        const catData = safetyState.data[catKey];
        if (!catData) return;

        const expected = calcEPDO(catData.severity);
        const actual = calculateEPDO(catData.severity);
        const match = expected === actual;

        sfAddCheck(results, catKey, 'EPDO calculation',
            match,
            match ? `EPDO=${expected} consistent` : `calcEPDO=${expected} vs calculateEPDO=${actual}`,
            match ? undefined : expected,
            match ? undefined : actual
        );

        // Check route-level EPDO
        let routeEpdoIssues = 0;
        Object.entries(catData.byRoute).forEach(([route, routeData]) => {
            const routeEpdo = calculateEPDO(routeData.severity);
            if (isNaN(routeEpdo)) routeEpdoIssues++;
        });

        if (routeEpdoIssues > 0) {
            sfAddCheck(results, catKey, 'Route EPDO validity',
                false,
                `${routeEpdoIssues} route(s) have NaN EPDO`,
                0, routeEpdoIssues
            );
        }
    });
}

// Check 3: Category vs Route Totals
function sfCheckCategorySums(results) {
    Object.keys(safetyCategories).forEach(catKey => {
        const catData = safetyState.data[catKey];
        if (!catData) return;

        // Sum crashes across all routes
        let routeCrashSum = 0;
        const routeSeverity = { K: 0, A: 0, B: 0, C: 0, O: 0 };

        Object.values(catData.byRoute).forEach(routeData => {
            routeCrashSum += routeData.crashes.length;
            ['K', 'A', 'B', 'C', 'O'].forEach(s => {
                routeSeverity[s] += routeData.severity[s];
            });
        });

        // Check crash count
        const countMatch = routeCrashSum === catData.crashes.length;
        sfAddCheck(results, catKey, 'Route crash sum = category total',
            countMatch,
            countMatch ? `${routeCrashSum} crashes across ${Object.keys(catData.byRoute).length} routes` : `Route sum ${routeCrashSum} != category total ${catData.crashes.length}`,
            countMatch ? undefined : catData.crashes.length,
            countMatch ? undefined : routeCrashSum
        );

        // Check severity sum across routes
        let sevMatch = true;
        const sevMismatches = [];
        ['K', 'A', 'B', 'C', 'O'].forEach(s => {
            if (routeSeverity[s] !== catData.severity[s]) {
                sevMatch = false;
                sevMismatches.push(`${s}: routes=${routeSeverity[s]} cat=${catData.severity[s]}`);
            }
        });

        sfAddCheck(results, catKey, 'Route severity sum = category severity',
            sevMatch,
            sevMatch ? 'Severity sums match across routes' : `Mismatch: ${sevMismatches.join(', ')}`,
            sevMatch ? undefined : JSON.stringify(catData.severity),
            sevMatch ? undefined : JSON.stringify(routeSeverity)
        );
    });
}

// Check 4: Location Table Data Consistency
function sfCheckLocationTableConsistency(results) {
    Object.keys(safetyCategories).forEach(catKey => {
        const catData = safetyState.data[catKey];
        if (!catData) return;

        let issues = 0;
        const routeNames = new Set();
        let duplicates = 0;

        Object.entries(catData.byRoute).forEach(([route, routeData]) => {
            if (routeNames.has(route)) duplicates++;
            routeNames.add(route);

            // Verify crash count = crashes array length
            if (routeData.crashes.length !== (routeData.severity.K + routeData.severity.A + routeData.severity.B + routeData.severity.C + routeData.severity.O)) {
                issues++;
            }

            // Verify EPDO is valid
            if (isNaN(calculateEPDO(routeData.severity))) issues++;
        });

        sfAddCheck(results, catKey, 'Location table integrity',
            issues === 0 && duplicates === 0,
            issues === 0 && duplicates === 0
                ? `${routeNames.size} locations validated`
                : `${issues} data issues, ${duplicates} duplicate routes`,
            0, issues + duplicates
        );
    });
}

// Check 5: Cross-Analysis Consistency
function sfCheckCrossAnalysisConsistency(results) {
    const data = crashState.sampleRows || [];
    if (data.length === 0) return;

    // Define cross-analysis pairs with their DOM element IDs
    const crossPairs = [
        { cat1: 'curves', cat2: 'guardrail', id: 'crossCurveGuardrail', name: 'Curves + Guardrail',
          filter: (row) => safetyCategories.curves.filter(row) && safetyCategories.guardrail.filter(row) },
        { cat1: 'school', cat2: 'young', id: 'crossSchoolYoung', name: 'School + Young',
          filter: (row) => safetyCategories.school.filter(row) && safetyCategories.young.filter(row) },
        { cat1: 'workzone', cat2: 'nighttime', id: 'crossWorkzoneNight', name: 'Workzone + Night',
          filter: (row) => safetyCategories.workzone.filter(row) && safetyCategories.nighttime.filter(row) },
        { cat1: 'senior', cat2: 'curves', id: 'crossSeniorCurves', name: 'Senior + Curves',
          filter: (row) => safetyCategories.senior.filter(row) && safetyCategories.curves.filter(row) },
        { cat1: 'school', cat2: 'pedestrian', id: 'crossSchoolPed', name: 'School + Pedestrian',
          filter: (row) => safetyCategories.school.filter(row) && safetyCategories.pedestrian.filter(row) },
        { cat1: 'roaddeparture', cat2: 'curves', id: 'crossRwdCurves', name: 'RoadDep + Curves',
          filter: (row) => safetyCategories.roaddeparture.filter(row) && safetyCategories.curves.filter(row) },
        { cat1: 'roaddeparture', cat2: 'speed', id: 'crossRwdSpeed', name: 'RoadDep + Speed',
          filter: (row) => safetyCategories.roaddeparture.filter(row) && safetyCategories.speed.filter(row) },
        { cat1: 'roaddeparture', cat2: 'nighttime', id: 'crossRwdNight', name: 'RoadDep + Night',
          filter: (row) => safetyCategories.roaddeparture.filter(row) && safetyCategories.nighttime.filter(row) },
        { cat1: 'lgtruck', cat2: 'intersection', id: 'crossTruckIntersection', name: 'Truck + Intersection',
          filter: (row) => safetyCategories.lgtruck.filter(row) && safetyCategories.intersection.filter(row) },
        { cat1: 'lgtruck', cat2: 'workzone', id: 'crossTruckWorkzone', name: 'Truck + Workzone',
          filter: (row) => safetyCategories.lgtruck.filter(row) && safetyCategories.workzone.filter(row) },
        { cat1: 'pedestrian', cat2: 'nighttime', id: 'crossPedNight', name: 'Ped + Night',
          filter: (row) => safetyCategories.pedestrian.filter(row) && safetyCategories.nighttime.filter(row) },
        { cat1: 'pedestrian', cat2: 'intersection', id: 'crossPedIntersection', name: 'Ped + Intersection',
          filter: (row) => safetyCategories.pedestrian.filter(row) && safetyCategories.intersection.filter(row) },
        { cat1: 'bicycle', cat2: 'intersection', id: 'crossBikeIntersection', name: 'Bike + Intersection',
          filter: (row) => safetyCategories.bicycle.filter(row) && safetyCategories.intersection.filter(row) },
        { cat1: 'speed', cat2: 'curves', id: 'crossSpeedCurves', name: 'Speed + Curves',
          filter: (row) => safetyCategories.speed.filter(row) && safetyCategories.curves.filter(row) },
        { cat1: 'impaired', cat2: 'nighttime', id: 'crossImpairedNight', name: 'Impaired + Night',
          filter: (row) => safetyCategories.impaired.filter(row) && safetyCategories.nighttime.filter(row) },
        { cat1: 'impaired', cat2: 'roaddeparture', id: 'crossImpairedRwd', name: 'Impaired + RoadDep',
          filter: (row) => safetyCategories.impaired.filter(row) && safetyCategories.roaddeparture.filter(row) },
        { cat1: 'motorcycle', cat2: 'curves', id: 'crossMotorcycleCurves', name: 'Motorcycle + Curves',
          filter: (row) => safetyCategories.motorcycle.filter(row) && safetyCategories.curves.filter(row) },
        { cat1: 'distracted', cat2: 'intersection', id: 'crossDistractedIntersection', name: 'Distracted + Intersection',
          filter: (row) => safetyCategories.distracted.filter(row) && safetyCategories.intersection.filter(row) }
    ];

    // Parse current date filters for cross-analysis recount
    const startDateVal = document.getElementById('safetyStartDate')?.value;
    const endDateVal = document.getElementById('safetyEndDate')?.value;
    let startTs = null, endTs = null;
    if (startDateVal && startDateVal.includes('-')) {
        const parts = startDateVal.split('-').map(Number);
        if (parts.length === 3 && !parts.some(isNaN)) {
            const [y, m, d] = parts;
            startTs = new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
            if (isNaN(startTs)) startTs = null;
        }
    }
    if (endDateVal && endDateVal.includes('-')) {
        const parts = endDateVal.split('-').map(Number);
        if (parts.length === 3 && !parts.some(isNaN)) {
            const [y, m, d] = parts;
            endTs = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
            if (isNaN(endTs)) endTs = null;
        }
    }

    // Recount each cross-analysis pair
    const recounts = {};
    crossPairs.forEach(pair => { recounts[pair.id] = 0; });

    data.forEach(row => {
        const sev = extractSeverity(row);
        if (!safetyState.filters.severity.includes(sev)) return;

        // Date filter
        if (startTs !== null || endTs !== null) {
            const dateVal = row[COL.DATE];
            if (!dateVal) return;
            let crashTs;
            if (typeof dateVal === 'number' && dateVal > 1000000000) crashTs = dateVal;
            else if (typeof dateVal === 'string') {
                const numVal = Number(dateVal);
                crashTs = (!isNaN(numVal) && numVal > 1000000000) ? numVal : new Date(dateVal).getTime();
            } else crashTs = Number(dateVal);
            if (isNaN(crashTs)) return;
            if (startTs !== null && crashTs < startTs) return;
            if (endTs !== null && crashTs > endTs) return;
        }

        crossPairs.forEach(pair => {
            // Special case: curves + no guardrail K/A
            if (pair.id === 'crossCurveNoGuardrail') {
                if (safetyCategories.curves.filter(row) && !safetyCategories.guardrail.filter(row) && (sev === 'K' || sev === 'A')) {
                    recounts[pair.id]++;
                }
                return;
            }
            if (pair.filter(row)) recounts[pair.id]++;
        });
    });

    // Compare recounts with displayed values
    crossPairs.forEach(pair => {
        const el = document.getElementById(pair.id);
        const displayed = el ? parseInt(el.textContent.replace(/,/g, ''), 10) : -1;
        const recounted = recounts[pair.id];
        const match = displayed === recounted;

        sfAddCheck(results, 'cross-analysis', pair.name,
            match,
            match ? `${displayed} matches recount` : `Displayed=${displayed} Recounted=${recounted}`,
            match ? undefined : recounted,
            match ? undefined : displayed
        );

        // Bounds check: cross count <= min(cat1, cat2)
        const cat1Count = safetyState.data[pair.cat1]?.crashes.length || 0;
        const cat2Count = safetyState.data[pair.cat2]?.crashes.length || 0;
        const minCat = Math.min(cat1Count, cat2Count);
        const boundsOk = recounted <= minCat;

        if (!boundsOk) {
            sfAddCheck(results, 'cross-analysis', `${pair.name} bounds`,
                false,
                `Cross count ${recounted} > min(${pair.cat1}:${cat1Count}, ${pair.cat2}:${cat2Count})=${minCat}`,
                minCat, recounted
            );
        }
    });
}

// Check 6: Filter Consistency
function sfCheckFilterConsistency(results) {
    const data = crashState.sampleRows || [];
    if (data.length === 0) return;

    const startDateVal = document.getElementById('safetyStartDate')?.value;
    const endDateVal = document.getElementById('safetyEndDate')?.value;
    let startTs = null, endTs = null;
    if (startDateVal && startDateVal.includes('-')) {
        const parts = startDateVal.split('-').map(Number);
        if (parts.length === 3 && !parts.some(isNaN)) {
            const [y, m, d] = parts;
            startTs = new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
            if (isNaN(startTs)) startTs = null;
        }
    }
    if (endDateVal && endDateVal.includes('-')) {
        const parts = endDateVal.split('-').map(Number);
        if (parts.length === 3 && !parts.some(isNaN)) {
            const [y, m, d] = parts;
            endTs = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
            if (isNaN(endTs)) endTs = null;
        }
    }

    let recount = 0;
    data.forEach(row => {
        const sev = extractSeverity(row);
        if (!safetyState.filters.severity.includes(sev)) return;

        if (startTs !== null || endTs !== null) {
            const dateVal = row[COL.DATE];
            if (!dateVal) return;
            let crashTs;
            if (typeof dateVal === 'number' && dateVal > 1000000000) crashTs = dateVal;
            else if (typeof dateVal === 'string') {
                const numVal = Number(dateVal);
                crashTs = (!isNaN(numVal) && numVal > 1000000000) ? numVal : new Date(dateVal).getTime();
            } else crashTs = Number(dateVal);
            if (isNaN(crashTs)) return;
            if (startTs !== null && crashTs < startTs) return;
            if (endTs !== null && crashTs > endTs) return;
        }
        recount++;
    });

    const stored = safetyState.filteredTotal;
    const match = recount === stored;

    sfAddCheck(results, 'filters', 'Filtered total count',
        match,
        match ? `${stored} rows match recount` : `Stored ${stored} != recounted ${recount}`,
        match ? undefined : recount,
        match ? undefined : stored
    );

    // Verify severity filter state matches UI checkboxes
    const uiSeverity = [];
    if (document.getElementById('safetyFilterK')?.checked) uiSeverity.push('K');
    if (document.getElementById('safetyFilterA')?.checked) uiSeverity.push('A');
    if (document.getElementById('safetyFilterB')?.checked) uiSeverity.push('B');
    if (document.getElementById('safetyFilterC')?.checked) uiSeverity.push('C');
    if (document.getElementById('safetyFilterO')?.checked) uiSeverity.push('O');

    const sevMatch = JSON.stringify(uiSeverity.sort()) === JSON.stringify([...safetyState.filters.severity].sort());
    sfAddCheck(results, 'filters', 'Severity filter sync',
        sevMatch,
        sevMatch ? 'UI checkboxes match filter state' : `UI=[${uiSeverity}] State=[${safetyState.filters.severity}]`,
        sevMatch ? undefined : uiSeverity.join(','),
        sevMatch ? undefined : safetyState.filters.severity.join(',')
    );
}

// Check 7: Detail Panel Accuracy
function sfCheckDetailPanelAccuracy(results) {
    const aggData = sfDetailState.aggregatedData;
    if (!aggData || sfDetailState.selectedLocations.length === 0) {
        sfAddCheck(results, 'detail-panel', 'Detail panel active',
            true,
            'No locations selected - skipping detail panel checks'
        );
        return;
    }

    const category = safetyState.activeCategory;
    const catData = safetyState.data[category];
    if (!catData) return;

    // Recount from selected locations
    let recountTotal = 0;
    const recountSev = { K: 0, A: 0, B: 0, C: 0, O: 0 };
    const recountFactors = { alcohol: 0, speed: 0, distracted: 0, drowsy: 0, drug: 0, hitrun: 0 };
    const recountVru = { pedestrian: 0, bicycle: 0, motorcycle: 0 };
    const recountDemo = { senior: 0, young: 0, unrestrained: 0 };
    const recountZones = { workZone: 0, schoolZone: 0 };

    sfDetailState.selectedLocations.forEach(route => {
        const routeData = catData.byRoute[route];
        if (!routeData) return;

        routeData.crashes.forEach(row => {
            recountTotal++;
            const sev = extractSeverity(row);
            if (recountSev[sev] !== undefined) recountSev[sev]++;

            if (isYes(row[COL.ALCOHOL])) recountFactors.alcohol++;
            if (isYes(row[COL.SPEED])) recountFactors.speed++;
            if (isYes(row[COL.DISTRACTED])) recountFactors.distracted++;
            if (isYes(row[COL.DROWSY])) recountFactors.drowsy++;
            if (isYes(row[COL.DRUG])) recountFactors.drug++;
            if (isYes(row[COL.HITRUN])) recountFactors.hitrun++;

            if (isYes(row[COL.PED])) recountVru.pedestrian++;
            if (isYes(row[COL.BIKE])) recountVru.bicycle++;
            if (isYes(row[COL.MOTORCYCLE])) recountVru.motorcycle++;

            if (isYes(row[COL.SENIOR])) recountDemo.senior++;
            if (isYes(row[COL.YOUNG])) recountDemo.young++;
            if (row[COL.UNRESTRAINED] === 'Unbelted' || isYes(row[COL.UNRESTRAINED])) recountDemo.unrestrained++;

            if (isYes(row[COL.WORKZONE])) recountZones.workZone++;
            if (isYes(row[COL.SCHOOL])) recountZones.schoolZone++;
        });
    });

    // Check total
    sfAddCheck(results, 'detail-panel', 'Total crash count',
        aggData.total === recountTotal,
        aggData.total === recountTotal ? `${recountTotal} matches` : `Stored=${aggData.total} Recounted=${recountTotal}`,
        aggData.total === recountTotal ? undefined : recountTotal,
        aggData.total === recountTotal ? undefined : aggData.total
    );

    // Check severity
    let sevMatch = true;
    ['K', 'A', 'B', 'C', 'O'].forEach(s => {
        if (aggData.severity[s] !== recountSev[s]) sevMatch = false;
    });
    sfAddCheck(results, 'detail-panel', 'Severity breakdown',
        sevMatch,
        sevMatch ? 'All severity counts match' : `Stored=${JSON.stringify(aggData.severity)} Recounted=${JSON.stringify(recountSev)}`,
        sevMatch ? undefined : JSON.stringify(recountSev),
        sevMatch ? undefined : JSON.stringify(aggData.severity)
    );

    // Check EPDO
    const expectedEpdo = calcEPDO(recountSev);
    sfAddCheck(results, 'detail-panel', 'EPDO score',
        aggData.epdo === expectedEpdo,
        aggData.epdo === expectedEpdo ? `EPDO=${expectedEpdo} matches` : `Stored=${aggData.epdo} Expected=${expectedEpdo}`,
        aggData.epdo === expectedEpdo ? undefined : expectedEpdo,
        aggData.epdo === expectedEpdo ? undefined : aggData.epdo
    );

    // Check contributing factors
    Object.keys(recountFactors).forEach(factor => {
        const stored = aggData.factors[factor];
        const recounted = recountFactors[factor];
        sfAddCheck(results, 'detail-panel', `Factor: ${factor}`,
            stored === recounted,
            stored === recounted ? `${recounted} matches` : `Stored=${stored} Recounted=${recounted}`,
            stored === recounted ? undefined : recounted,
            stored === recounted ? undefined : stored
        );
    });

    // Check VRU
    sfAddCheck(results, 'detail-panel', 'Pedestrian count',
        aggData.vru.pedestrian.total === recountVru.pedestrian,
        aggData.vru.pedestrian.total === recountVru.pedestrian ? `${recountVru.pedestrian} matches` : `Stored=${aggData.vru.pedestrian.total} Recounted=${recountVru.pedestrian}`,
        aggData.vru.pedestrian.total === recountVru.pedestrian ? undefined : recountVru.pedestrian,
        aggData.vru.pedestrian.total === recountVru.pedestrian ? undefined : aggData.vru.pedestrian.total
    );
    sfAddCheck(results, 'detail-panel', 'Bicycle count',
        aggData.vru.bicycle.total === recountVru.bicycle,
        aggData.vru.bicycle.total === recountVru.bicycle ? `${recountVru.bicycle} matches` : `Stored=${aggData.vru.bicycle.total} Recounted=${recountVru.bicycle}`,
        aggData.vru.bicycle.total === recountVru.bicycle ? undefined : recountVru.bicycle,
        aggData.vru.bicycle.total === recountVru.bicycle ? undefined : aggData.vru.bicycle.total
    );
    sfAddCheck(results, 'detail-panel', 'Motorcycle count',
        aggData.vru.motorcycle.total === recountVru.motorcycle,
        aggData.vru.motorcycle.total === recountVru.motorcycle ? `${recountVru.motorcycle} matches` : `Stored=${aggData.vru.motorcycle.total} Recounted=${recountVru.motorcycle}`,
        aggData.vru.motorcycle.total === recountVru.motorcycle ? undefined : recountVru.motorcycle,
        aggData.vru.motorcycle.total === recountVru.motorcycle ? undefined : aggData.vru.motorcycle.total
    );

    // Check demographics
    sfAddCheck(results, 'detail-panel', 'Senior count',
        aggData.demographics.senior === recountDemo.senior,
        aggData.demographics.senior === recountDemo.senior ? `${recountDemo.senior} matches` : `Stored=${aggData.demographics.senior} Recounted=${recountDemo.senior}`,
        aggData.demographics.senior === recountDemo.senior ? undefined : recountDemo.senior,
        aggData.demographics.senior === recountDemo.senior ? undefined : aggData.demographics.senior
    );
    sfAddCheck(results, 'detail-panel', 'Young count',
        aggData.demographics.young === recountDemo.young,
        aggData.demographics.young === recountDemo.young ? `${recountDemo.young} matches` : `Stored=${aggData.demographics.young} Recounted=${recountDemo.young}`,
        aggData.demographics.young === recountDemo.young ? undefined : recountDemo.young,
        aggData.demographics.young === recountDemo.young ? undefined : aggData.demographics.young
    );
    sfAddCheck(results, 'detail-panel', 'Unrestrained count',
        aggData.demographics.unrestrained === recountDemo.unrestrained,
        aggData.demographics.unrestrained === recountDemo.unrestrained ? `${recountDemo.unrestrained} matches` : `Stored=${aggData.demographics.unrestrained} Recounted=${recountDemo.unrestrained}`,
        aggData.demographics.unrestrained === recountDemo.unrestrained ? undefined : recountDemo.unrestrained,
        aggData.demographics.unrestrained === recountDemo.unrestrained ? undefined : aggData.demographics.unrestrained
    );

    // Check special zones
    sfAddCheck(results, 'detail-panel', 'Work zone count',
        aggData.specialZones.workZone === recountZones.workZone,
        aggData.specialZones.workZone === recountZones.workZone ? `${recountZones.workZone} matches` : `Stored=${aggData.specialZones.workZone} Recounted=${recountZones.workZone}`,
        aggData.specialZones.workZone === recountZones.workZone ? undefined : recountZones.workZone,
        aggData.specialZones.workZone === recountZones.workZone ? undefined : aggData.specialZones.workZone
    );
    sfAddCheck(results, 'detail-panel', 'School zone count',
        aggData.specialZones.schoolZone === recountZones.schoolZone,
        aggData.specialZones.schoolZone === recountZones.schoolZone ? `${recountZones.schoolZone} matches` : `Stored=${aggData.specialZones.schoolZone} Recounted=${recountZones.schoolZone}`,
        aggData.specialZones.schoolZone === recountZones.schoolZone ? undefined : recountZones.schoolZone,
        aggData.specialZones.schoolZone === recountZones.schoolZone ? undefined : aggData.specialZones.schoolZone
    );

    // Check byYear totals sum
    const yearTotal = Object.values(aggData.byYear).reduce((s, y) => s + (y.total || 0), 0);
    sfAddCheck(results, 'detail-panel', 'Year totals sum',
        yearTotal === aggData.total,
        yearTotal === aggData.total ? `Year sum ${yearTotal} = total ${aggData.total}` : `Year sum ${yearTotal} != total ${aggData.total}`,
        yearTotal === aggData.total ? undefined : aggData.total,
        yearTotal === aggData.total ? undefined : yearTotal
    );
}

// Check 8: Percentage Denominators
function sfCheckPercentageDenominators(results) {
    const total = safetyState.filteredTotal || crashState.totalRows || crashState.sampleRows?.length || 0;

    if (total === 0) {
        sfAddCheck(results, 'percentages', 'Denominator validity',
            false, 'Denominator is 0 - percentages cannot be calculated', '>0', 0
        );
        return;
    }

    sfAddCheck(results, 'percentages', 'Denominator source',
        true,
        safetyState.filteredTotal > 0
            ? `Using filteredTotal=${safetyState.filteredTotal} (filters active)`
            : `Using totalRows=${total} (no filters)`
    );

    // Check displayed percentages match computed values
    let pctIssues = 0;
    Object.keys(safetyCategories).forEach(catKey => {
        const count = safetyState.data[catKey].crashes.length;
        const expectedPct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';

        const capKey = catKey.charAt(0).toUpperCase() + catKey.slice(1);
        const pctEl = document.getElementById(`safety${capKey}Pct`);
        if (pctEl) {
            const displayed = pctEl.textContent.replace('%', '').trim();
            if (displayed !== expectedPct && displayed !== String(parseFloat(expectedPct))) {
                pctIssues++;
            }
        }
    });

    sfAddCheck(results, 'percentages', 'Card percentage accuracy',
        pctIssues === 0,
        pctIssues === 0 ? 'All card percentages match computed values' : `${pctIssues} card(s) show incorrect percentages`,
        0, pctIssues
    );
}

// Display data check results
function displaySafetyDataCheckResults(results) {
    const container = document.getElementById('safetyDataCheckResults');
    if (!container) return;

    container.style.display = 'block';

    // Group checks by category
    const grouped = {};
    results.checks.forEach(check => {
        if (!grouped[check.category]) grouped[check.category] = [];
        grouped[check.category].push(check);
    });

    const statusIcon = (status) => status === 'pass' ? '<span style="color:#16a34a">PASS</span>' : status === 'fail' ? '<span style="color:#dc2626">FAIL</span>' : '<span style="color:#d97706">WARN</span>';
    const statusColor = results.failed > 0 ? '#dc2626' : results.warnings > 0 ? '#d97706' : '#16a34a';

    let html = `
        <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem 1rem;background:${statusColor}10;border-bottom:1px solid var(--border)">
                <div style="display:flex;align-items:center;gap:1rem">
                    <strong style="color:${statusColor}">Safety Data Check</strong>
                    <span style="color:#16a34a;font-size:.85rem">${results.passed} passed</span>
                    ${results.failed > 0 ? `<span style="color:#dc2626;font-size:.85rem">${results.failed} failed</span>` : ''}
                    ${results.warnings > 0 ? `<span style="color:#d97706;font-size:.85rem">${results.warnings} warnings</span>` : ''}
                </div>
                <div style="display:flex;align-items:center;gap:.5rem">
                    <span style="font-size:.75rem;color:#64748b">${new Date(results.timestamp).toLocaleString()}</span>
                    <button onclick="exportSafetyDataCheckResults()" class="btn btn-sm btn-outline" style="font-size:.65rem;padding:.15rem .4rem" title="Export results to JSON">Export</button>
                    <button onclick="document.getElementById('safetyDataCheckResults').style.display='none'" style="background:none;border:none;cursor:pointer;color:#64748b;font-size:1.1rem">&times;</button>
                </div>
            </div>
            <div style="max-height:400px;overflow-y:auto;padding:.5rem">`;

    // Render grouped results
    Object.entries(grouped).forEach(([category, checks]) => {
        const catPassed = checks.filter(c => c.status === 'pass').length;
        const catFailed = checks.filter(c => c.status === 'fail').length;
        const catWarn = checks.filter(c => c.status === 'warn').length;
        const catColor = catFailed > 0 ? '#dc2626' : catWarn > 0 ? '#d97706' : '#16a34a';
        const catName = safetyCategories[category]?.name || category.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());

        html += `
            <details style="margin-bottom:.25rem" ${catFailed > 0 ? 'open' : ''}>
                <summary style="cursor:pointer;padding:.4rem .5rem;background:#f8fafc;border-radius:4px;font-size:.8rem;display:flex;align-items:center;gap:.5rem">
                    <span style="width:8px;height:8px;border-radius:50%;background:${catColor};display:inline-block"></span>
                    <strong>${esc(catName)}</strong>
                    <span style="color:#64748b;font-size:.7rem;margin-left:auto">${catPassed}/${checks.length} passed</span>
                </summary>
                <div style="padding:.25rem .5rem .25rem 1.5rem">`;

        checks.forEach(check => {
            html += `
                <div style="display:flex;align-items:baseline;gap:.5rem;padding:.2rem 0;font-size:.75rem;border-bottom:1px solid #f1f5f9">
                    ${statusIcon(check.status)}
                    <span style="color:#334155">${esc(check.name)}</span>
                    <span style="color:#64748b;margin-left:auto;text-align:right;max-width:50%">${esc(check.details)}</span>
                </div>`;
            if (check.status === 'fail' && check.expected !== undefined) {
                html += `<div style="font-size:.65rem;color:#dc2626;padding-left:3rem">Expected: ${esc(String(check.expected))} | Actual: ${esc(String(check.actual))}</div>`;
            }
        });

        html += '</div></details>';
    });

    html += '</div></div>';
    container.innerHTML = html;

    // Store results for export
    container._lastResults = results;

    showToast(
        results.failed > 0
            ? `Data check: ${results.failed} issue(s) found`
            : `Data check: All ${results.passed} checks passed`,
        results.failed > 0 ? 'error' : 'success'
    );
}

// Export data check results to JSON
function exportSafetyDataCheckResults() {
    const container = document.getElementById('safetyDataCheckResults');
    const results = container?._lastResults;
    if (!results) {
        showToast('No results to export', 'warning');
        return;
    }

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safety_data_check_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data check results exported', 'success');
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.safety = CL.safety || {};
  CL.safety.dataCheck = CL.safety.dataCheck || {};
  window.runSafetyDataCheck = runSafetyDataCheck; CL.safety.dataCheck.runSafetyDataCheck = runSafetyDataCheck;
  window.sfAddCheck = sfAddCheck; CL.safety.dataCheck.sfAddCheck = sfAddCheck;
  window.sfCheckSeverityTotals = sfCheckSeverityTotals; CL.safety.dataCheck.sfCheckSeverityTotals = sfCheckSeverityTotals;
  window.sfCheckEPDOCalculations = sfCheckEPDOCalculations; CL.safety.dataCheck.sfCheckEPDOCalculations = sfCheckEPDOCalculations;
  window.sfCheckCategorySums = sfCheckCategorySums; CL.safety.dataCheck.sfCheckCategorySums = sfCheckCategorySums;
  window.sfCheckLocationTableConsistency = sfCheckLocationTableConsistency; CL.safety.dataCheck.sfCheckLocationTableConsistency = sfCheckLocationTableConsistency;
  window.sfCheckCrossAnalysisConsistency = sfCheckCrossAnalysisConsistency; CL.safety.dataCheck.sfCheckCrossAnalysisConsistency = sfCheckCrossAnalysisConsistency;
  window.sfCheckFilterConsistency = sfCheckFilterConsistency; CL.safety.dataCheck.sfCheckFilterConsistency = sfCheckFilterConsistency;
  window.sfCheckDetailPanelAccuracy = sfCheckDetailPanelAccuracy; CL.safety.dataCheck.sfCheckDetailPanelAccuracy = sfCheckDetailPanelAccuracy;
  window.sfCheckPercentageDenominators = sfCheckPercentageDenominators; CL.safety.dataCheck.sfCheckPercentageDenominators = sfCheckPercentageDenominators;
  window.displaySafetyDataCheckResults = displaySafetyDataCheckResults; CL.safety.dataCheck.displaySafetyDataCheckResults = displaySafetyDataCheckResults;
  window.exportSafetyDataCheckResults = exportSafetyDataCheckResults; CL.safety.dataCheck.exportSafetyDataCheckResults = exportSafetyDataCheckResults;
  CL._registerModule('safety/safety-data-check');
})();
