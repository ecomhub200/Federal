/**
 * CL assets.signDef — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.assets.signDef.<fn>; any
 * module-private state stays inside this IIFE (no external refs).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
// Helper: get cutoff date for a given number of months back
function signDef_getCutoffDate(months) {
    if (!months || months <= 0) return null;
    var d = new Date();
    d.setMonth(d.getMonth() - months);
    return d;
}

// Helper: filter crashes to a specific month window
function signDef_filterByMonths(crashes, months) {
    if (!months || months <= 0) return crashes;
    var cutoff = signDef_getCutoffDate(months);
    return crashes.filter(function(r) {
        var dateStr = r[COL.DATE];
        if (!dateStr) return false;
        var d = new Date(dateStr);
        return !isNaN(d.getTime()) && d >= cutoff;
    });
}

// EPDO weights (reuse project constant)
const SIGNDEF_EPDO = { K: 462, A: 62, B: 12, C: 5, O: 1 };

function signDef_calcEPDO(sev) {
    return (sev.K || 0) * SIGNDEF_EPDO.K + (sev.A || 0) * SIGNDEF_EPDO.A +
           (sev.B || 0) * SIGNDEF_EPDO.B + (sev.C || 0) * SIGNDEF_EPDO.C + (sev.O || 0) * SIGNDEF_EPDO.O;
}

function signDef_nextId() {
    return 'SD-' + String(++signDefState.idCounter).padStart(4, '0');
}

// ── Entry Point ─────────────────────────────────────────────
function signDef_init() {
    console.log('[SignDef] Initializing...');

    if (!crashState.loaded || !crashState.sampleRows || crashState.sampleRows.length === 0) {
        document.getElementById('signDefEmptyState').style.display = 'block';
        document.getElementById('signDefContent').style.display = 'none';
        return;
    }

    document.getElementById('signDefEmptyState').style.display = 'none';
    document.getElementById('signDefContent').style.display = 'block';

    // Prevent concurrent analyses (race condition on rapid tab switching)
    if (signDefState.analyzing) return;

    if (signDefState.loaded) {
        // Already loaded — just refresh map size (Leaflet needs this after display:none toggle)
        if (signDefState.map) {
            setTimeout(function() { signDefState.map.invalidateSize(); }, 100);
        }
        return;
    }

    signDefState.analyzing = true;
    signDefState.idCounter = 0;

    // Read filter values
    signDefState.timeframe = parseInt(document.getElementById('signDefTimeframe').value) || 36;
    signDefState.minCrashes = parseInt(document.getElementById('signDefMinCrashes').value) || 3;
    signDefState.severityFilter = document.getElementById('signDefSeverityFilter').value || 'all';

    // Load inventory (non-blocking) then analyze
    signDef_loadInventory().finally(function() {
        signDef_analyze();
        signDef_initMap();
        signDef_renderUI();
        signDefState.loaded = true;
        signDefState.analyzing = false;
        console.log('[SignDef] Analysis complete:', signDefState.deficiencies.length, 'deficiencies found');
    });
}

function signDef_reanalyze() {
    signDefState.loaded = false;
    signDefState.analyzing = false;
    signDef_init();
}

function signDef_onFilterChange() {
    // Debounce: don't re-analyze on every keystroke
    clearTimeout(signDefState._filterTimer);
    signDefState._filterTimer = setTimeout(function() {
        signDefState.loaded = false;
        signDefState.analyzing = false;
        signDef_init();
    }, 400);
}

// ── Load Traffic Inventory from R2 ──────────────────────────
async function signDef_loadInventory() {
    if (signDefState.inventoryLoaded) return;

    try {
        const stateKey = _resolveActiveState();
        const stateConfig = (typeof appConfig !== 'undefined') ? appConfig?.states?.[stateKey] : null;
        const r2Prefix = stateConfig?.r2Prefix || stateKey;
        const jurisdiction = (typeof getActiveJurisdictionId === 'function') ? getActiveJurisdictionId() : ((typeof _getDefaultJurisdictionForActiveState === 'function') ? _getDefaultJurisdictionForActiveState() : 'douglas');

        const r2Path = r2Prefix + '/' + jurisdiction + '/traffic-inventory.parquet.gz';
        const baseUrl = (typeof r2State !== 'undefined' && r2State.manifest?.r2BaseUrl) ? r2State.manifest.r2BaseUrl : R2_BASE_URL;
        const url = baseUrl + '/' + r2Path;

        console.log('[SignDef] Fetching traffic inventory:', url);
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('HTTP ' + resp.status);

        const gzBytes = new Uint8Array(await resp.arrayBuffer());
        const pqBytes = pako.ungzip(gzBytes);
        const pqBuf = pqBytes.buffer.slice(pqBytes.byteOffset, pqBytes.byteOffset + pqBytes.byteLength);
        const hp = await import('https://cdn.jsdelivr.net/npm/hyparquet@1.7.0/+esm');
        const meta = hp.parquetMetadata(pqBuf);
        const headers = meta.schema.slice(1).map(function(s) { return s.name.toLowerCase(); });
        const idxMutcd = headers.indexOf('mutcd');
        const idxName = headers.indexOf('name');
        const idxClass = headers.indexOf('class');
        const idxSpeed = headers.indexOf('speed');
        const idxLat = headers.indexOf('lat');
        const idxLon = headers.indexOf('lon');

        let pqRows;
        await hp.parquetRead({ file: pqBuf, onComplete: function(d) { pqRows = d; } });

        signDefState.inventoryData = [];
        for (var i = 0; i < pqRows.length; i++) {
            var lat = parseFloat(pqRows[i][idxLat]);
            var lon = parseFloat(pqRows[i][idxLon]);
            if (isNaN(lat) || isNaN(lon)) continue;
            signDefState.inventoryData.push({
                mutcd: String(pqRows[i][idxMutcd] || '').trim(),
                name: String(pqRows[i][idxName] || '').trim(),
                cls: String(pqRows[i][idxClass] || '').trim(),
                speed: parseInt(pqRows[i][idxSpeed]) || 0,
                lat: lat,
                lon: lon
            });
        }

        signDefState.inventoryLoaded = true;
        console.log('[SignDef] Inventory loaded:', signDefState.inventoryData.length, 'assets');
    } catch (e) {
        var errMsg = e.message || 'Unknown error';
        if (errMsg.includes('404') || errMsg.includes('HTTP 4')) {
            errMsg = 'No traffic inventory data available for this jurisdiction';
        }
        console.warn('[SignDef] Traffic inventory not available:', errMsg);
        signDefState.inventoryData = [];
    }
}

// ── Proximity helper: check if any inventory item of given types is within radius ──
function signDef_hasNearbyInventory(lat, lon, mutcdPrefixes, radiusMeters) {
    if (!signDefState.inventoryData.length) return false;
    var R = 6371000; // Earth radius in meters
    var rlat = lat * Math.PI / 180;
    for (var i = 0; i < signDefState.inventoryData.length; i++) {
        var item = signDefState.inventoryData[i];
        var matchesMutcd = false;
        for (var j = 0; j < mutcdPrefixes.length; j++) {
            if (item.mutcd.toUpperCase().startsWith(mutcdPrefixes[j].toUpperCase()) ||
                item.cls.toLowerCase() === mutcdPrefixes[j].toLowerCase()) {
                matchesMutcd = true;
                break;
            }
        }
        if (!matchesMutcd) continue;
        var dlat = (item.lat - lat) * Math.PI / 180;
        var dlon = (item.lon - lon) * Math.PI / 180;
        var a = Math.sin(dlat/2)*Math.sin(dlat/2) + Math.cos(rlat)*Math.cos(item.lat*Math.PI/180)*Math.sin(dlon/2)*Math.sin(dlon/2);
        var d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        if (d <= radiusMeters) return true;
    }
    return false;
}

// ── Get posted speed near a location from inventory ──
function signDef_getPostedSpeed(lat, lon) {
    if (!signDefState.inventoryData.length) return 0;
    var best = 0, bestDist = 200; // 200m search radius
    var R = 6371000;
    var rlat = lat * Math.PI / 180;
    for (var i = 0; i < signDefState.inventoryData.length; i++) {
        var item = signDefState.inventoryData[i];
        if (!item.speed || !item.mutcd.toUpperCase().startsWith('R2')) continue;
        var dlat = (item.lat - lat) * Math.PI / 180;
        var dlon = (item.lon - lon) * Math.PI / 180;
        var a = Math.sin(dlat/2)*Math.sin(dlat/2) + Math.cos(rlat)*Math.cos(item.lat*Math.PI/180)*Math.sin(dlon/2)*Math.sin(dlon/2);
        var d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        if (d < bestDist) { bestDist = d; best = item.speed; }
    }
    return best;
}

// ── Core Analysis Engine ────────────────────────────────────
function signDef_analyze() {
    console.log('[SignDef] Running analysis (per-category MUTCD timeframes)...');
    signDefState.deficiencies = [];

    // Reset category counts
    Object.keys(signDefState.categories).forEach(function(k) {
        signDefState.categories[k].count = 0;
        signDefState.categories[k].locations = [];
    });

    var rows = crashState.sampleRows;
    if (!rows || rows.length === 0) return;

    // Per-category timeframes are now enforced inside each signDef_check*() function.
    // The global timeframe is used only as a broad outer bound for initial grouping.
    // Use the maximum of user's timeframe and 36 months (broadest MUTCD window).
    var outerMonths = signDefState.timeframe > 0 ? Math.max(signDefState.timeframe, 36) : 0;
    var cutoff = outerMonths > 0 ? signDef_getCutoffDate(outerMonths) : null;

    // Group crashes by NODE (intersection-level analysis)
    var byNode = {};
    var byRoute = {}; // For segment-level analysis (animal, speed)
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];

        // Apply broad outer date filter
        if (cutoff) {
            var dateStr = row[COL.DATE];
            if (dateStr) {
                var d = new Date(dateStr);
                if (!isNaN(d.getTime()) && d < cutoff) continue;
            }
        }

        var node = String(row[COL.NODE] || '').trim();
        var route = String(row[COL.ROUTE] || '').trim();

        if (node && node !== '0' && node !== '') {
            if (!byNode[node]) byNode[node] = { crashes: [], route: route };
            byNode[node].crashes.push(row);
            if (route && !byNode[node].route) byNode[node].route = route;
        }

        if (route) {
            if (!byRoute[route]) byRoute[route] = [];
            byRoute[route].push(row);
        }
    }

    // Analyze each node
    Object.keys(byNode).forEach(function(node) {
        var group = byNode[node];
        var crashes = group.crashes;
        var route = group.route || 'Unknown';

        // Calculate centroid
        var latSum = 0, lonSum = 0, coordCount = 0;
        crashes.forEach(function(r) {
            var lat = parseFloat(r[COL.Y]);
            var lon = parseFloat(r[COL.X]);
            if (!isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
                latSum += lat; lonSum += lon; coordCount++;
            }
        });
        if (coordCount === 0) return; // Skip nodes without coordinates
        var cLat = latSum / coordCount;
        var cLon = lonSum / coordCount;

        // Build severity summary
        function buildSev(crashList) {
            var s = { K: 0, A: 0, B: 0, C: 0, O: 0, total: crashList.length };
            crashList.forEach(function(r) {
                var sev = String(r[COL.SEVERITY] || '').trim();
                if (s.hasOwnProperty(sev)) s[sev]++;
            });
            return s;
        }

        // Check each deficiency type for this node
        signDef_checkSignal(node, route, crashes, cLat, cLon);
        signDef_checkStopSign(node, route, crashes, cLat, cLon);
        signDef_checkStreetLight(node, route, crashes, cLat, cLon);
        signDef_checkCrosswalk(node, route, crashes, cLat, cLon);
        signDef_checkSchoolZone(node, route, crashes, cLat, cLon);
        signDef_checkAnimal(node, route, crashes, cLat, cLon);
        signDef_checkBike(node, route, crashes, cLat, cLon);
        signDef_checkSpeed(node, route, crashes, cLat, cLon);
    });

    // Sort by EPDO descending (highest priority first)
    signDefState.deficiencies.sort(function(a, b) { return b.epdo - a.epdo; });

    // Apply severity filter
    signDef_applyFilters();

    // Update subtitle
    var subtitle = document.getElementById('signDefSubtitle');
    if (subtitle) {
        subtitle.textContent = signDefState.deficiencies.length + ' candidate locations identified \u2014 MUTCD timeframes enforced per category (Signal/Stop: 12 mo, Street Light: 36 mo)';
    }
}

function signDef_applyFilters() {
    var sf = signDefState.severityFilter;
    signDefState.filteredDeficiencies = signDefState.deficiencies.filter(function(d) {
        if (!signDefState.activeCategories.has(d.category)) return false;
        if (sf === 'ka') return (d.severitySummary.K + d.severitySummary.A) > 0;
        if (sf === 'kab') return (d.severitySummary.K + d.severitySummary.A + d.severitySummary.B) > 0;
        return true;
    });
}

function signDef_addDeficiency(category, node, route, lat, lon, relevantCrashes, recommendation, confidence, mutcdExtra) {
    var sev = { K: 0, A: 0, B: 0, C: 0, O: 0 };
    relevantCrashes.forEach(function(r) {
        var s = String(r[COL.SEVERITY] || '').trim();
        if (sev.hasOwnProperty(s)) sev[s]++;
    });
    var epdo = signDef_calcEPDO(sev);
    var invMatch = signDefState.inventoryLoaded;
    var cfg = SIGNDEF_MUTCD_CONFIG[category] || {};

    var def = {
        id: signDef_nextId(),
        category: category,
        node: node,
        route: route,
        lat: lat,
        lon: lon,
        crashCount: relevantCrashes.length,
        severitySummary: sev,
        epdo: epdo,
        recommendation: recommendation,
        warrantType: signDefState.categories[category].warrantType,
        inventoryMatch: invMatch,
        confidence: confidence,
        crashes: relevantCrashes,
        // MUTCD metadata
        mutcdRef: cfg.mutcdRef || '',
        mutcdMet: (mutcdExtra && mutcdExtra.mutcdMet) || false,
        thresholdDesc: cfg.thresholdDesc || '',
        analysisMonths: (mutcdExtra && mutcdExtra.analysisMonths) || cfg.requiredMonths || signDefState.timeframe,
        warrantLevel: (mutcdExtra && mutcdExtra.warrantLevel) || (confidence === 'high' ? 'met' : 'investigate'),
        criteriaDetail: (mutcdExtra && mutcdExtra.criteriaDetail) || null
    };

    signDefState.deficiencies.push(def);
    signDefState.categories[category].count++;
    signDefState.categories[category].locations.push(def);
}

// ── Individual Deficiency Checks ────────────────────────────

function signDef_checkSignal(node, route, crashes, lat, lon, buildSev) {
    // Signal Warrant 7 (MUTCD 4C.08): Crashes susceptible to correction by signal
    // MUTCD requires analysis within a 12-month period
    var cfg = SIGNDEF_MUTCD_CONFIG.signal;
    var filtered = signDef_filterByMonths(crashes, cfg.requiredMonths);

    // Susceptible crashes: angle + ped crashes at uncontrolled intersections
    var susceptibleCrashes = filtered.filter(function(r) {
        var ctrl = String(r[COL.TRAFFIC_CTRL] || '');
        var coll = String(r[COL.COLLISION] || '');
        var intType = String(r[COL.INT_TYPE] || '');
        var isPed = String(r[COL.PED] || '');
        var isUncontrolled = ctrl.indexOf('No Traffic Control') >= 0;
        var isAtIntersection = intType.indexOf('Not at Intersection') < 0;
        var isAngle = coll.indexOf('Angle') >= 0;
        var isPedCrash = isPed === 'Yes' || isPed === '1' || coll.indexOf('Ped') >= 0;
        return isUncontrolled && isAtIntersection && (isAngle || isPedCrash);
    });

    // Use MUTCD threshold: 5 for 4-leg, 4 for 3-leg
    var threshold = cfg.minCrashes; // default 5 (4-leg)
    var mutcdMet = susceptibleCrashes.length >= threshold;

    // Still flag if approaching threshold (use user minCrashes as lower bound)
    if (susceptibleCrashes.length < Math.min(signDefState.minCrashes, threshold)) return;

    // Cross-ref with inventory (check for signals within 50m)
    if (signDef_hasNearbyInventory(lat, lon, ['R10', 'signal', 'infra'], 50)) return;

    // Check for K/A severity — boost confidence
    var hasSevere = susceptibleCrashes.some(function(r) {
        var s = String(r[COL.SEVERITY] || '');
        return s === 'K' || s === 'A';
    });

    var confidence = mutcdMet ? 'high' : (hasSevere ? 'medium' : 'low');
    var warrantLevel = mutcdMet ? 'met' : (susceptibleCrashes.length >= threshold - 1 ? 'investigate' : 'monitor');

    signDef_addDeficiency('signal', node, route, lat, lon, susceptibleCrashes,
        (mutcdMet ? 'MUTCD Warrant 7 threshold MET' : 'Approaching Warrant 7 threshold') +
        ' \u2014 ' + susceptibleCrashes.length + '/' + threshold + ' susceptible crashes (angle+ped) in 12 months at uncontrolled intersection',
        confidence,
        { mutcdMet: mutcdMet, analysisMonths: cfg.requiredMonths, warrantLevel: warrantLevel });
}

function signDef_checkStopSign(node, route, crashes, lat, lon, buildSev) {
    // Stop Sign Criterion B (MUTCD 2B.07): 5+ susceptible crashes in 12 months
    var cfg = SIGNDEF_MUTCD_CONFIG.stopSign;
    var filtered = signDef_filterByMonths(crashes, cfg.requiredMonths);

    // Use STOPSIGN_SUSCEPTIBLE_CRASH_TYPES if available, otherwise fallback
    var susceptibleTypes = (typeof STOPSIGN_SUSCEPTIBLE_CRASH_TYPES !== 'undefined')
        ? STOPSIGN_SUSCEPTIBLE_CRASH_TYPES
        : ['ANGLE', 'RIGHT ANGLE', 'LEFT TURN', 'RIGHT TURN', 'TURNING', 'HEAD ON', 'SIDESWIPE'];

    var susceptibleCrashes = filtered.filter(function(r) {
        var ctrl = String(r[COL.TRAFFIC_CTRL] || '');
        var coll = String(r[COL.COLLISION] || '').toUpperCase();
        var intType = String(r[COL.INT_TYPE] || '');
        var isUncontrolled = ctrl.indexOf('No Traffic Control') >= 0;
        var isAtIntersection = intType.indexOf('Not at Intersection') < 0;
        var isSusceptible = susceptibleTypes.some(function(t) {
            return coll.indexOf(t) >= 0;
        });
        return isUncontrolled && isAtIntersection && isSusceptible;
    });

    // Don't flag if already flagged as signal candidate (signal takes priority)
    var alreadySignal = signDefState.deficiencies.some(function(d) {
        return d.category === 'signal' && d.node === node;
    });
    if (alreadySignal) return;

    // MUTCD threshold: 5 susceptible crashes in 12 months
    var threshold = cfg.minCrashes; // 5
    var mutcdMet = susceptibleCrashes.length >= threshold;

    // Still flag if approaching threshold (use user minCrashes as lower bound)
    if (susceptibleCrashes.length < Math.min(signDefState.minCrashes, threshold)) return;

    // Cross-ref with inventory
    if (signDef_hasNearbyInventory(lat, lon, ['R1-1', 'stop'], 50)) return;

    var confidence = mutcdMet ? 'high' : 'medium';
    var warrantLevel = mutcdMet ? 'met' : (susceptibleCrashes.length >= threshold - 1 ? 'investigate' : 'monitor');

    signDef_addDeficiency('stopSign', node, route, lat, lon, susceptibleCrashes,
        (mutcdMet ? 'MUTCD 2B.07 Criterion B MET' : 'Approaching MUTCD 2B.07 threshold') +
        ' \u2014 ' + susceptibleCrashes.length + '/' + threshold + ' susceptible crashes in 12 months at uncontrolled intersection',
        confidence,
        { mutcdMet: mutcdMet, analysisMonths: cfg.requiredMonths, warrantLevel: warrantLevel });
}

function signDef_checkStreetLight(node, route, crashes, lat, lon, buildSev) {
    // Street Light Warrant (FHWA NTDCRR Method) — 4 criteria, 36-month analysis
    var cfg = SIGNDEF_MUTCD_CONFIG.streetLight;
    var filtered = signDef_filterByMonths(crashes, cfg.requiredMonths);

    // Classify crashes by light condition
    var nightCrashes = filtered.filter(function(r) {
        var light = String(r[COL.LIGHT] || '').toLowerCase();
        return light.indexOf('dark') >= 0 || light.indexOf('dusk') >= 0 || light.indexOf('dawn') >= 0;
    });
    var dayCrashes = filtered.filter(function(r) {
        var light = String(r[COL.LIGHT] || '').toLowerCase();
        return light.indexOf('daylight') >= 0;
    });

    // Must have at least some night crashes to evaluate
    if (nightCrashes.length === 0) return;

    // Calculate FHWA criteria (matching streetlight_evaluateWarrant logic)
    var ntdcrr = dayCrashes.length > 0 ? (nightCrashes.length / dayCrashes.length) : (nightCrashes.length > 0 ? 99 : 0);
    var nightPercent = filtered.length > 0 ? (nightCrashes.length / filtered.length * 100) : 0;
    var nightKA = nightCrashes.filter(function(r) {
        var s = String(r[COL.SEVERITY] || '');
        return s === 'K' || s === 'A';
    }).length;

    // Evaluate 4 FHWA criteria
    var c1 = ntdcrr >= cfg.ntdcrrThreshold;           // NTDCRR >= 2.0
    var c2 = nightCrashes.length >= cfg.minNightCrashes; // >= 3 nighttime crashes
    var c3 = nightPercent > cfg.nightPercentThreshold; // Night% > 27%
    var c4 = nightKA > 0;                              // Any nighttime K+A

    var criteriaMetCount = [c1, c2, c3, c4].filter(Boolean).length;

    // Determine warrant level (matching streetlight_evaluateWarrant)
    var warrantLevel, mutcdMet;
    if (c1) {
        warrantLevel = 'met'; mutcdMet = true;
    } else if (criteriaMetCount >= 2) {
        warrantLevel = 'investigate'; mutcdMet = false;
    } else if (criteriaMetCount === 1) {
        warrantLevel = 'monitor'; mutcdMet = false;
    } else {
        return; // No criteria met — no deficiency
    }

    // Cross-ref inventory for lighting
    if (signDef_hasNearbyInventory(lat, lon, ['infra', 'light', 'pole'], 75)) return;

    var confidence = mutcdMet ? 'high' : (criteriaMetCount >= 2 ? 'medium' : 'low');
    var statusText = mutcdMet ? 'LIGHTING WARRANTED (NTDCRR ' + ntdcrr.toFixed(2) + ' \u2265 2.0)' :
        'Investigation recommended (' + criteriaMetCount + '/4 FHWA criteria met)';

    signDef_addDeficiency('streetLight', node, route, lat, lon, nightCrashes,
        statusText + ' \u2014 ' + nightCrashes.length + ' nighttime crashes, Night:Day ratio ' + ntdcrr.toFixed(2) +
        ', Night% ' + nightPercent.toFixed(1) + '%' + (nightKA > 0 ? ', ' + nightKA + ' fatal/serious at night' : ''),
        confidence,
        {
            mutcdMet: mutcdMet,
            analysisMonths: cfg.requiredMonths,
            warrantLevel: warrantLevel,
            criteriaDetail: {
                criterion1: { met: c1, label: 'NTDCRR \u2265 2.0', value: ntdcrr.toFixed(2) },
                criterion2: { met: c2, label: '\u2265 3 night crashes', value: nightCrashes.length },
                criterion3: { met: c3, label: 'Night% > 27%', value: nightPercent.toFixed(1) + '%' },
                criterion4: { met: c4, label: 'Nighttime K+A', value: nightKA },
                totalMet: criteriaMetCount
            }
        });
}

function signDef_checkCrosswalk(node, route, crashes, lat, lon, buildSev) {
    var cfg = SIGNDEF_MUTCD_CONFIG.crosswalk;
    var filtered = signDef_filterByMonths(crashes, cfg.requiredMonths);

    var pedCrashes = filtered.filter(function(r) {
        var isPed = String(r[COL.PED] || '');
        var ctrl = String(r[COL.TRAFFIC_CTRL] || '');
        return (isYes(r[COL.PED]) || String(r[COL.COLLISION] || '').indexOf('Ped') >= 0) &&
               ctrl.indexOf('Ped Crosswalk') < 0;
    });

    if (pedCrashes.length < cfg.minCrashes) return;

    if (signDef_hasNearbyInventory(lat, lon, ['W11-2', 'crosswalk', 'R1-5', 'ped'], 75)) return;

    var hasFatal = pedCrashes.some(function(r) { return String(r[COL.SEVERITY] || '') === 'K'; });
    var mutcdMet = pedCrashes.length >= cfg.minCrashes;
    signDef_addDeficiency('crosswalk', node, route, lat, lon, pedCrashes,
        pedCrashes.length + ' pedestrian crashes without crosswalk control' + (hasFatal ? ' (includes fatal crash)' : ''),
        hasFatal ? 'high' : 'medium',
        { mutcdMet: mutcdMet, analysisMonths: cfg.requiredMonths, warrantLevel: hasFatal ? 'met' : 'investigate' });
}

function signDef_checkSchoolZone(node, route, crashes, lat, lon, buildSev) {
    var cfg = SIGNDEF_MUTCD_CONFIG.schoolZone;
    var filtered = signDef_filterByMonths(crashes, cfg.requiredMonths);

    var schoolCrashes = filtered.filter(function(r) {
        var isSchool = String(r[COL.SCHOOL] || '');
        var ctrl = String(r[COL.TRAFFIC_CTRL] || '');
        return isYes(r[COL.SCHOOL]) &&
               ctrl.indexOf('Reduced Speed - School Zone') < 0;
    });

    if (schoolCrashes.length < cfg.minCrashes) return;

    if (signDef_hasNearbyInventory(lat, lon, ['S1', 'S2', 'S3', 'S4', 'S5', 'school'], 200)) return;

    signDef_addDeficiency('schoolZone', node, route, lat, lon, schoolCrashes,
        schoolCrashes.length + ' crashes in school zone area without school zone traffic control',
        'medium',
        { mutcdMet: true, analysisMonths: cfg.requiredMonths, warrantLevel: 'investigate' });
}

function signDef_checkAnimal(node, route, crashes, lat, lon, buildSev) {
    var cfg = SIGNDEF_MUTCD_CONFIG.animalWarning;
    var filtered = signDef_filterByMonths(crashes, cfg.requiredMonths);

    var animalCrashes = filtered.filter(function(r) {
        var isAnimal = String(r[COL.ANIMAL] || '');
        var coll = String(r[COL.COLLISION] || '');
        return isYes(r[COL.ANIMAL]) ||
               coll.indexOf('Deer') >= 0 || coll.indexOf('Other Animal') >= 0;
    });

    if (animalCrashes.length < cfg.minCrashes) return;

    if (signDef_hasNearbyInventory(lat, lon, ['W11-3', 'W11-4', 'animal', 'deer'], 200)) return;

    signDef_addDeficiency('animalWarning', node, route, lat, lon, animalCrashes,
        animalCrashes.length + ' animal-related crashes in this area',
        animalCrashes.length >= 5 ? 'high' : 'medium',
        { mutcdMet: true, analysisMonths: cfg.requiredMonths, warrantLevel: 'investigate' });
}

function signDef_checkBike(node, route, crashes, lat, lon, buildSev) {
    var cfg = SIGNDEF_MUTCD_CONFIG.bikeInfra;
    var filtered = signDef_filterByMonths(crashes, cfg.requiredMonths);

    var bikeCrashes = filtered.filter(function(r) {
        var isBike = String(r[COL.BIKE] || '');
        var coll = String(r[COL.COLLISION] || '');
        return isYes(r[COL.BIKE]) || coll.indexOf('Bicyclist') >= 0;
    });

    if (bikeCrashes.length < cfg.minCrashes) return;

    if (signDef_hasNearbyInventory(lat, lon, ['W11-1', 'bike', 'bicycle', 'D11-1'], 100)) return;

    var hasFatal = bikeCrashes.some(function(r) { return String(r[COL.SEVERITY] || '') === 'K'; });
    signDef_addDeficiency('bikeInfra', node, route, lat, lon, bikeCrashes,
        bikeCrashes.length + ' bicycle crashes without bicycle signage' + (hasFatal ? ' (includes fatal crash)' : ''),
        hasFatal ? 'high' : 'medium',
        { mutcdMet: true, analysisMonths: cfg.requiredMonths, warrantLevel: hasFatal ? 'met' : 'investigate' });
}

function signDef_checkSpeed(node, route, crashes, lat, lon, buildSev) {
    var cfg = SIGNDEF_MUTCD_CONFIG.speedReduction;
    var filtered = signDef_filterByMonths(crashes, cfg.requiredMonths);

    var speedCrashes = filtered.filter(function(r) {
        var isSpeed = String(r[COL.SPEED] || '');
        return isSpeed === 'Yes' || isSpeed === '1';
    });

    if (speedCrashes.length < cfg.minCrashes) return;

    var postedSpeed = signDef_getPostedSpeed(lat, lon);
    if (signDefState.inventoryLoaded && signDefState.inventoryData.length > 0 && postedSpeed > 0 && postedSpeed <= 35) return;

    var hasSevere = speedCrashes.some(function(r) {
        var s = String(r[COL.SEVERITY] || '');
        return s === 'K' || s === 'A';
    });

    var speedNote = postedSpeed > 35 ? ' (posted speed: ' + postedSpeed + ' mph)' : '';
    signDef_addDeficiency('speedReduction', node, route, lat, lon, speedCrashes,
        speedCrashes.length + ' speed-related crashes' + speedNote + (hasSevere ? ' including fatal/serious injury' : ''),
        hasSevere ? 'high' : 'medium',
        { mutcdMet: true, analysisMonths: cfg.requiredMonths, warrantLevel: hasSevere ? 'met' : 'investigate' });
}

// ── Map ─────────────────────────────────────────────────────
function signDef_initMap() {
    var mapEl = document.getElementById('signDefMap');
    if (!mapEl) return;

    // Destroy existing map
    if (signDefState.map) {
        signDefState.map.remove();
        signDefState.map = null;
        signDefState.layerGroups = {};
    }

    // Calculate center from deficiencies or crash data centroid
    // Map center: prefer the active state's default jurisdiction from appConfig;
    // fall back to the legacy literal when appConfig hasn't loaded yet.
    var center = (typeof appConfig !== 'undefined' && appConfig?.jurisdictions?.[appConfig?.states?.[appConfig?.defaultState]?.defaultJurisdiction]?.mapCenter) || [39.0, -105.0];
    var zoom = 11;
    if (signDefState.deficiencies.length > 0) {
        var lats = signDefState.deficiencies.map(function(d) { return d.lat; });
        var lons = signDefState.deficiencies.map(function(d) { return d.lon; });
        center = [(Math.min.apply(null, lats) + Math.max.apply(null, lats)) / 2,
                   (Math.min.apply(null, lons) + Math.max.apply(null, lons)) / 2];
    } else if (crashState.sampleRows.length > 0) {
        var sLat = 0, sLon = 0, sC = 0;
        for (var i = 0; i < Math.min(crashState.sampleRows.length, 500); i++) {
            var r = crashState.sampleRows[i];
            var la = parseFloat(r[COL.Y]), lo = parseFloat(r[COL.X]);
            if (!isNaN(la) && !isNaN(lo) && la !== 0) { sLat += la; sLon += lo; sC++; }
        }
        if (sC > 0) center = [sLat / sC, sLon / sC];
    }

    signDefState.map = L.map('signDefMap', { zoomControl: true, scrollWheelZoom: true }).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(signDefState.map);

    // Create layer groups per category
    var catKeys = Object.keys(signDefState.categories);
    catKeys.forEach(function(key) {
        signDefState.layerGroups[key] = L.layerGroup();
        if (signDefState.activeCategories.has(key)) {
            signDefState.layerGroups[key].addTo(signDefState.map);
        }
    });

    // Add markers
    signDefState.filteredDeficiencies.forEach(function(def) {
        signDef_addMarker(def);
    });

    // Fit bounds if we have deficiencies
    if (signDefState.filteredDeficiencies.length > 0) {
        var bounds = L.latLngBounds(signDefState.filteredDeficiencies.map(function(d) { return [d.lat, d.lon]; }));
        signDefState.map.fitBounds(bounds, { padding: [30, 30] });
    }

    // Render legend and toggles
    signDef_renderLegend();
    signDef_renderLayerToggles();
}

function signDef_addMarker(def) {
    var cat = signDefState.categories[def.category];
    if (!cat) return;

    var marker = L.circleMarker([def.lat, def.lon], {
        radius: Math.min(6 + Math.log2(def.crashCount + 1) * 2, 14),
        fillColor: cat.color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    });

    // Popup content
    var sevBadges = '';
    if (def.severitySummary.K > 0) sevBadges += '<span style="background:#991b1b;color:#fff;padding:1px 5px;border-radius:3px;font-size:.7rem;margin-right:3px">' + def.severitySummary.K + 'K</span>';
    if (def.severitySummary.A > 0) sevBadges += '<span style="background:#dc2626;color:#fff;padding:1px 5px;border-radius:3px;font-size:.7rem;margin-right:3px">' + def.severitySummary.A + 'A</span>';
    if (def.severitySummary.B > 0) sevBadges += '<span style="background:#f97316;color:#fff;padding:1px 5px;border-radius:3px;font-size:.7rem;margin-right:3px">' + def.severitySummary.B + 'B</span>';
    if (def.severitySummary.C > 0) sevBadges += '<span style="background:#eab308;color:#000;padding:1px 5px;border-radius:3px;font-size:.7rem;margin-right:3px">' + def.severitySummary.C + 'C</span>';
    if (def.severitySummary.O > 0) sevBadges += '<span style="background:#6b7280;color:#fff;padding:1px 5px;border-radius:3px;font-size:.7rem">' + def.severitySummary.O + 'O</span>';

    var warrantBtn = '';
    if (def.warrantType) {
        warrantBtn = '<button onclick="signDef_navigateToWarrant(\'' + def.id + '\')" style="margin-top:6px;padding:4px 10px;background:#1e3a5f;color:#fff;border:none;border-radius:4px;font-size:.75rem;cursor:pointer;width:100%">🔍 Investigate in Warrant Tab →</button>';
    }

    // MUTCD status badge for popup
    var mutcdBadge = '';
    if (def.mutcdMet) {
        mutcdBadge = '<span style="display:inline-block;padding:2px 6px;border-radius:3px;font-size:.68rem;font-weight:600;color:white;background:#16a34a;margin-right:4px">THRESHOLD MET</span>';
    } else if (def.warrantLevel === 'investigate') {
        mutcdBadge = '<span style="display:inline-block;padding:2px 6px;border-radius:3px;font-size:.68rem;font-weight:600;color:white;background:#f59e0b;margin-right:4px">INVESTIGATE</span>';
    } else if (def.warrantLevel === 'monitor') {
        mutcdBadge = '<span style="display:inline-block;padding:2px 6px;border-radius:3px;font-size:.68rem;font-weight:600;color:white;background:#94a3b8;margin-right:4px">MONITOR</span>';
    }

    // Criteria detail for street light
    var criteriaHtml = '';
    if (def.criteriaDetail) {
        var cd = def.criteriaDetail;
        criteriaHtml = '<div style="font-size:.72rem;margin-top:4px;padding:4px 6px;background:#f8fafc;border-radius:3px;border:1px solid #e2e8f0">' +
            '<div style="font-weight:600;color:#475569;margin-bottom:2px">FHWA Criteria (' + cd.totalMet + '/4 met):</div>' +
            '<div style="color:' + (cd.criterion1.met ? '#16a34a' : '#94a3b8') + '">' + (cd.criterion1.met ? '\u2713' : '\u2717') + ' NTDCRR: ' + cd.criterion1.value + ' (\u2265 2.0)</div>' +
            '<div style="color:' + (cd.criterion2.met ? '#16a34a' : '#94a3b8') + '">' + (cd.criterion2.met ? '\u2713' : '\u2717') + ' Night crashes: ' + cd.criterion2.value + ' (\u2265 3)</div>' +
            '<div style="color:' + (cd.criterion3.met ? '#16a34a' : '#94a3b8') + '">' + (cd.criterion3.met ? '\u2713' : '\u2717') + ' Night %: ' + cd.criterion3.value + ' (> 27%)</div>' +
            '<div style="color:' + (cd.criterion4.met ? '#16a34a' : '#94a3b8') + '">' + (cd.criterion4.met ? '\u2713' : '\u2717') + ' Night K+A: ' + cd.criterion4.value + '</div>' +
            '</div>';
    }

    var popup = '<div style="min-width:240px;font-size:.82rem">' +
        '<div style="font-weight:700;color:' + cat.color + ';margin-bottom:4px">' + cat.icon + ' ' + cat.label + '</div>' +
        '<div style="font-weight:600;margin-bottom:3px">' + def.route + (def.node ? ' (Node ' + def.node + ')' : '') + '</div>' +
        '<div style="margin-bottom:4px">' + mutcdBadge + sevBadges + '</div>' +
        '<div style="color:#666;margin-bottom:3px"><strong>' + def.crashCount + '</strong> crashes | EPDO: <strong>' + def.epdo.toLocaleString() + '</strong></div>' +
        (def.mutcdRef ? '<div style="font-size:.72rem;color:#64748b;margin-bottom:3px">' + def.mutcdRef + ' | ' + (def.analysisMonths || '') + '-month analysis</div>' : '') +
        '<div style="color:#444;font-size:.78rem;margin-bottom:4px;border-top:1px solid #e5e7eb;padding-top:4px">' + def.recommendation + '</div>' +
        criteriaHtml +
        '<div style="font-size:.72rem;color:#888;margin-top:3px">Confidence: ' + def.confidence + (def.inventoryMatch ? ' (verified with sign inventory)' : '') + '</div>' +
        warrantBtn +
        '</div>';

    marker.bindPopup(popup, { maxWidth: 300 });
    marker.on('click', function() { signDefState.selectedDeficiency = def; });

    var lg = signDefState.layerGroups[def.category];
    if (lg) marker.addTo(lg);
}

function signDef_renderLegend() {
    var el = document.getElementById('signDefMapLegend');
    if (!el) return;
    var html = '';
    Object.keys(signDefState.categories).forEach(function(key) {
        var cat = signDefState.categories[key];
        if (cat.count === 0) return;
        html += '<span style="display:inline-flex;align-items:center;gap:3px">' +
            '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + cat.color + '"></span>' +
            cat.label + ' (' + cat.count + ')' +
            '</span>';
    });
    el.innerHTML = html;
}

function signDef_renderLayerToggles() {
    var el = document.getElementById('signDefLayerToggles');
    if (!el) return;
    var html = '';
    Object.keys(signDefState.categories).forEach(function(key) {
        var cat = signDefState.categories[key];
        var checked = signDefState.activeCategories.has(key) ? 'checked' : '';
        html += '<label style="display:inline-flex;align-items:center;gap:4px;font-size:.82rem;cursor:pointer;padding:3px 8px;border-radius:var(--radius);border:1px solid ' + (signDefState.activeCategories.has(key) ? cat.color : 'var(--border)') + ';background:' + (signDefState.activeCategories.has(key) ? cat.color + '15' : 'transparent') + '">' +
            '<input type="checkbox" ' + checked + ' onchange="signDef_toggleCategory(\'' + key + '\', this.checked)" style="accent-color:' + cat.color + '">' +
            '<span style="color:' + cat.color + '">' + cat.icon + '</span> ' + cat.label +
            ' <span style="font-weight:600;color:var(--text)">(' + cat.count + ')</span>' +
            '</label>';
    });
    el.innerHTML = html;
}

function signDef_toggleCategory(key, enabled) {
    if (enabled) {
        signDefState.activeCategories.add(key);
        if (signDefState.layerGroups[key] && signDefState.map) {
            signDefState.layerGroups[key].addTo(signDefState.map);
        }
    } else {
        signDefState.activeCategories.delete(key);
        if (signDefState.layerGroups[key] && signDefState.map) {
            signDefState.map.removeLayer(signDefState.layerGroups[key]);
        }
    }
    signDef_applyFilters();
    signDef_renderTable();
    signDef_renderLayerToggles();
}

// ── UI Rendering ────────────────────────────────────────────
function signDef_renderUI() {
    signDef_renderSummaryCards();
    signDef_renderTable();
}

function signDef_renderSummaryCards() {
    var el = document.getElementById('signDefSummaryCards');
    if (!el) return;
    var html = '';
    var totalDeficiencies = 0;

    Object.keys(signDefState.categories).forEach(function(key) {
        var cat = signDefState.categories[key];
        var cfg = SIGNDEF_MUTCD_CONFIG[key] || {};
        totalDeficiencies += cat.count;

        // Calculate total EPDO for this category
        var catEpdo = 0;
        cat.locations.forEach(function(d) { catEpdo += d.epdo; });

        // Get worst severity
        var worstSev = '-';
        cat.locations.forEach(function(d) {
            if (d.severitySummary.K > 0) worstSev = 'K';
            else if (d.severitySummary.A > 0 && worstSev !== 'K') worstSev = 'A';
            else if (d.severitySummary.B > 0 && worstSev !== 'K' && worstSev !== 'A') worstSev = 'B';
        });

        // Count locations meeting MUTCD threshold
        var mutcdMetCount = cat.locations.filter(function(d) { return d.mutcdMet; }).length;

        var sevColor = worstSev === 'K' ? '#991b1b' : worstSev === 'A' ? '#dc2626' : worstSev === 'B' ? '#f97316' : '#6b7280';
        var isActive = signDefState.activeCategories.has(key);

        // Warrant level badge color
        var wlColor = mutcdMetCount > 0 ? '#16a34a' : (cat.count > 0 ? '#f59e0b' : '#94a3b8');
        var wlText = mutcdMetCount > 0 ? (mutcdMetCount + ' meet threshold') : (cat.count > 0 ? 'Investigation' : 'None');

        var barPct = cat.count > 0 ? Math.round(mutcdMetCount / cat.count * 100) : 0;

        html += '<div class="signdef-card' + (isActive ? ' active' : '') + '" onclick="signDef_toggleCategory(\'' + key + '\', ' + (!isActive) + ')" ' +
            'title="' + (cfg.thresholdDesc || '').replace(/"/g, '&quot;') + '" ' +
            'style="border-left:4px solid ' + cat.color + (isActive ? ';border-color:' + cat.color + ';background:' + cat.color + '10' : '') + '">' +

            '<div class="signdef-card-icon">' + cat.icon + '</div>' +
            '<div class="signdef-card-count" style="color:' + cat.color + '">' + cat.count + '</div>' +
            '<div class="signdef-card-label">' + cat.label + '</div>' +

            // MUTCD Reference + Period badge
            '<div class="signdef-card-ref">' +
            '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (cfg.mutcdRef || '') + '</span>' +
            '<span class="signdef-period-badge">' + (cfg.requiredMonths || 36) + ' mo</span>' +
            '</div>' +

            // EPDO + Worst severity
            '<div class="signdef-card-meta">' +
            '<span>EPDO: ' + catEpdo.toLocaleString() + '</span>' +
            (worstSev !== '-' ? '<span style="color:' + sevColor + ';font-weight:600">Worst: ' + worstSev + '</span>' : '') +
            '</div>' +

            // Warrant status bar
            (cat.count > 0 ?
                '<div class="signdef-card-bar"><div class="signdef-card-bar-fill" style="width:' + barPct + '%;background:' + wlColor + '"></div></div>' +
                '<div class="signdef-card-status" style="color:' + wlColor + '">' + wlText + '</div>'
            : '') +

            '</div>';
    });

    el.innerHTML = html;
}

function signDef_renderTable() {
    var tbody = document.getElementById('signDefTableBody');
    var countEl = document.getElementById('signDefTableCount');
    if (!tbody) return;

    var data = signDefState.filteredDeficiencies.slice();
    var search = (document.getElementById('signDefTableSearch')?.value || '').toLowerCase();
    if (search) {
        data = data.filter(function(d) {
            return d.route.toLowerCase().indexOf(search) >= 0 ||
                   d.node.toLowerCase().indexOf(search) >= 0 ||
                   d.recommendation.toLowerCase().indexOf(search) >= 0 ||
                   signDefState.categories[d.category].label.toLowerCase().indexOf(search) >= 0;
        });
    }

    // Sort
    var col = signDefState.sortColumn;
    var asc = signDefState.sortAsc;
    data.sort(function(a, b) {
        var va, vb;
        if (col === 'epdo') { va = a.epdo; vb = b.epdo; }
        else if (col === 'crashes') { va = a.crashCount; vb = b.crashCount; }
        else if (col === 'category') { va = signDefState.categories[a.category].label; vb = signDefState.categories[b.category].label; }
        else if (col === 'location') { va = a.route; vb = b.route; }
        else { va = a.epdo; vb = b.epdo; }
        if (typeof va === 'string') return asc ? va.localeCompare(vb) : vb.localeCompare(va);
        return asc ? va - vb : vb - va;
    });

    if (countEl) countEl.textContent = data.length + ' location' + (data.length !== 1 ? 's' : '');

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;padding:2rem;color:var(--text-light)">No deficiencies found matching current filters</td></tr>';
        return;
    }

    var html = '';
    data.forEach(function(d, idx) {
        var cat = signDefState.categories[d.category];
        var confColor = d.confidence === 'high' ? '#16a34a' : d.confidence === 'medium' ? '#eab308' : '#9ca3af';
        var warrantLink = '';
        if (d.warrantType) {
            warrantLink = '<button onclick="event.stopPropagation();signDef_navigateToWarrant(\'' + d.id + '\')" style="padding:2px 8px;background:#1e3a5f;color:#fff;border:none;border-radius:3px;font-size:.72rem;cursor:pointer;white-space:nowrap" title="Investigate in Warrant Tab">🔍 Warrant</button>';
        } else {
            warrantLink = '<button onclick="event.stopPropagation();signDef_zoomTo(\'' + d.id + '\')" style="padding:2px 8px;background:#0ea5e9;color:#fff;border:none;border-radius:3px;font-size:.72rem;cursor:pointer;white-space:nowrap" title="Zoom to location on map">📍 Map</button>';
        }

        // Status badge
        var statusBg, statusText;
        if (d.mutcdMet) {
            statusBg = '#16a34a'; statusText = 'MET';
        } else if (d.warrantLevel === 'investigate') {
            statusBg = '#f59e0b'; statusText = 'INVESTIGATE';
        } else if (d.warrantLevel === 'monitor') {
            statusBg = '#94a3b8'; statusText = 'MONITOR';
        } else {
            statusBg = '#e2e8f0'; statusText = 'REVIEW';
        }

        html += '<tr onclick="signDef_zoomTo(\'' + d.id + '\')" style="cursor:pointer;border-bottom:1px solid var(--border)" onmouseover="this.style.background=\'#f0f9ff\'" onmouseout="this.style.background=\'\'">' +
            '<td style="padding:.4rem .6rem"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + confColor + ';margin-right:4px" title="' + d.confidence + ' confidence"></span>' + (idx + 1) + '</td>' +
            '<td style="padding:.4rem .6rem;white-space:nowrap"><span style="color:' + cat.color + '">' + cat.icon + '</span> ' + cat.label + '</td>' +
            '<td style="padding:.4rem .6rem;font-size:.7rem;color:#64748b;white-space:nowrap" title="' + (d.thresholdDesc || '').replace(/"/g, '&quot;') + '">' + (d.mutcdRef || '') + '<br><span style="color:#94a3b8">' + (d.analysisMonths || '') + ' mo</span></td>' +
            '<td style="padding:.4rem .6rem;font-weight:500">' + d.route + (d.node ? ' <span style="color:#9ca3af;font-size:.75rem">(N:' + d.node + ')</span>' : '') + '</td>' +
            '<td style="padding:.4rem .6rem;text-align:center;font-weight:600">' + d.crashCount + '</td>' +
            '<td style="padding:.4rem .6rem;text-align:center;color:#991b1b;font-weight:' + (d.severitySummary.K > 0 ? '700' : '400') + '">' + d.severitySummary.K + '</td>' +
            '<td style="padding:.4rem .6rem;text-align:center;color:#dc2626">' + d.severitySummary.A + '</td>' +
            '<td style="padding:.4rem .6rem;text-align:center;font-weight:700;color:var(--primary)">' + d.epdo.toLocaleString() + '</td>' +
            '<td style="padding:.4rem .6rem;text-align:center"><span style="display:inline-block;padding:2px 6px;border-radius:3px;font-size:.68rem;font-weight:600;color:white;background:' + statusBg + '">' + statusText + '</span></td>' +
            '<td style="padding:.4rem .6rem;font-size:.78rem;max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + d.recommendation.replace(/"/g, '&quot;') + '">' + d.recommendation + '</td>' +
            '<td style="padding:.4rem .6rem;text-align:center">' + warrantLink + '</td>' +
            '</tr>';
    });

    tbody.innerHTML = html;
}

function signDef_sortTable(col) {
    if (signDefState.sortColumn === col) {
        signDefState.sortAsc = !signDefState.sortAsc;
    } else {
        signDefState.sortColumn = col;
        signDefState.sortAsc = col === 'location' || col === 'category'; // asc for text, desc for numbers
    }
    signDef_renderTable();
}

function signDef_filterTable() {
    signDef_renderTable();
}

function signDef_zoomTo(defId) {
    var def = signDefState.deficiencies.find(function(d) { return d.id === defId; });
    if (!def || !signDefState.map) return;
    signDefState.map.setView([def.lat, def.lon], 16);
    signDefState.selectedDeficiency = def;

    // Open popup for this marker
    signDefState.layerGroups[def.category]?.eachLayer(function(layer) {
        var ll = layer.getLatLng();
        if (Math.abs(ll.lat - def.lat) < 0.0001 && Math.abs(ll.lng - def.lon) < 0.0001) {
            layer.openPopup();
        }
    });
}

// ── Warrant Navigation ──────────────────────────────────────
function signDef_navigateToWarrant(defId) {
    var def = signDefState.deficiencies.find(function(d) { return d.id === defId; });
    if (!def) return;

    // Set cross-tab selection state
    if (typeof selectionState !== 'undefined') {
        selectionState.location = def.route + (def.node ? ' (Node ' + def.node + ')' : '');
        selectionState.crashes = def.crashes;
        selectionState.locationType = 'route';
        selectionState.fromTab = 'signdeficiency';
    }

    // Set warrant location
    if (typeof warrantsState !== 'undefined') {
        warrantsState.selectedLocation = def.route;
        warrantsState.locationCrashes = def.crashes;
        warrantsState.filteredCrashes = def.crashes;
    }

    // Navigate to warrants tab
    navigateTo('warrants');

    // Show appropriate warrant study
    if (def.warrantType && typeof showWarrantStudy === 'function') {
        setTimeout(function() {
            showWarrantStudy(def.warrantType);
        }, 200);
    }

    showToast('Navigating to ' + (signDefState.categories[def.category]?.label || '') + ' warrant analysis for ' + def.route, 'info');
}

// ── Export Functions ─────────────────────────────────────────
function signDef_exportCSV() {
    var data = signDefState.filteredDeficiencies;
    if (data.length === 0) { showToast('No data to export', 'warning'); return; }

    var headers = ['ID', 'Category', 'Location', 'Route', 'Node', 'Latitude', 'Longitude', 'Crashes', 'K', 'A', 'B', 'C', 'O', 'EPDO', 'Confidence', 'Recommendation'];
    var rows = data.map(function(d) {
        return [
            d.id,
            signDefState.categories[d.category].label,
            d.route + (d.node ? ' (Node ' + d.node + ')' : ''),
            d.route,
            d.node,
            d.lat.toFixed(6),
            d.lon.toFixed(6),
            d.crashCount,
            d.severitySummary.K,
            d.severitySummary.A,
            d.severitySummary.B,
            d.severitySummary.C,
            d.severitySummary.O,
            d.epdo,
            d.confidence,
            '"' + d.recommendation.replace(/[\r\n]+/g, ' ').replace(/"/g, '""') + '"'
        ].join(',');
    });

    var csv = headers.join(',') + '\n' + rows.join('\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'sign_deficiency_candidates.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported: ' + data.length + ' candidate locations', 'success');
}

function signDef_exportKML() {
    var data = signDefState.filteredDeficiencies;
    if (data.length === 0) { showToast('No data to export', 'warning'); return; }

    var kml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n' +
        '<name>Sign Deficiency Candidates</name>\n' +
        '<description>Candidate locations for traffic control improvements</description>\n';

    // Add styles for each category
    Object.keys(signDefState.categories).forEach(function(key) {
        var cat = signDefState.categories[key];
        var hex = cat.color.replace('#', '');
        // KML uses aabbggrr format
        var kmlColor = 'ff' + hex.substring(4, 6) + hex.substring(2, 4) + hex.substring(0, 2);
        kml += '<Style id="style_' + key + '">\n' +
            '<IconStyle><color>' + kmlColor + '</color><scale>1.0</scale>' +
            '<Icon><href>http://maps.google.com/mapfiles/kml/paddle/wht-blank.png</href></Icon></IconStyle>\n' +
            '</Style>\n';
    });

    data.forEach(function(d) {
        var cat = signDefState.categories[d.category];
        kml += '<Placemark>\n' +
            '<name>' + signDef_escXml(cat.icon + ' ' + cat.label + ' - ' + d.route) + '</name>\n' +
            '<description>' + signDef_escXml(d.recommendation + '\nCrashes: ' + d.crashCount + ' | EPDO: ' + d.epdo + '\nSeverity: K=' + d.severitySummary.K + ' A=' + d.severitySummary.A + ' B=' + d.severitySummary.B + ' C=' + d.severitySummary.C + ' O=' + d.severitySummary.O + '\nConfidence: ' + d.confidence) + '</description>\n' +
            '<styleUrl>#style_' + d.category + '</styleUrl>\n' +
            '<Point><coordinates>' + d.lon + ',' + d.lat + ',0</coordinates></Point>\n' +
            '</Placemark>\n';
    });

    kml += '</Document>\n</kml>';

    var blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'sign_deficiency_candidates.kml';
    a.click();
    URL.revokeObjectURL(url);
    showToast('KML exported: ' + data.length + ' candidate locations', 'success');
}

function signDef_escXml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function signDef_exportGeoJSON() {
    var data = signDefState.filteredDeficiencies;
    if (data.length === 0) { showToast('No data to export', 'warning'); return; }

    var features = data.map(function(d) {
        return {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [d.lon, d.lat] },
            properties: {
                id: d.id,
                category: d.category,
                categoryLabel: signDefState.categories[d.category].label,
                route: d.route,
                node: d.node,
                crashes: d.crashCount,
                K: d.severitySummary.K,
                A: d.severitySummary.A,
                B: d.severitySummary.B,
                C: d.severitySummary.C,
                O: d.severitySummary.O,
                epdo: d.epdo,
                confidence: d.confidence,
                recommendation: d.recommendation
            }
        };
    });

    var geojson = { type: 'FeatureCollection', features: features };
    var blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'sign_deficiency_candidates.geojson';
    a.click();
    URL.revokeObjectURL(url);
    showToast('GeoJSON exported: ' + data.length + ' candidate locations', 'success');
}

function signDef_exportPDF() {
    if (typeof window.jspdf === 'undefined') {
        showToast('PDF library not loaded. Please try again.', 'warning');
        return;
    }

    showToast('Generating Sign Deficiency PDF report...', 'info');

    var data = signDefState.filteredDeficiencies;
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF('p', 'mm', 'letter');
    var pageWidth = 215.9;
    var margin = 15;
    var contentWidth = pageWidth - (margin * 2);
    var y = margin;

    // Colors
    var primary = [30, 58, 95];
    var textDark = [55, 65, 81];

    // ─── Cover / Header ───
    doc.setFillColor(30, 58, 95);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Sign Deficiency Analysis Report', margin, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    var jurisdiction = (typeof getActiveJurisdictionId === 'function') ? getActiveJurisdictionId() : 'Unknown';
    doc.text('Jurisdiction: ' + jurisdiction.replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); }), margin, 28);
    doc.text('Generated: ' + new Date().toLocaleDateString() + ' | Timeframe: ' + (signDefState.timeframe > 0 ? 'Last ' + signDefState.timeframe + ' months' : 'All data'), margin, 34);

    y = 50;

    // ─── Summary ───
    doc.setTextColor(primary[0], primary[1], primary[2]);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', margin, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);

    var totalDef = signDefState.deficiencies.length;
    var totalEpdo = 0;
    signDefState.deficiencies.forEach(function(d) { totalEpdo += d.epdo; });
    doc.text('Total Candidate Locations: ' + totalDef, margin, y); y += 5;
    doc.text('Total EPDO: ' + totalEpdo.toLocaleString(), margin, y); y += 5;
    doc.text('Minimum Crash Threshold: ' + signDefState.minCrashes, margin, y); y += 8;

    // Category breakdown
    Object.keys(signDefState.categories).forEach(function(key) {
        var cat = signDefState.categories[key];
        if (cat.count > 0) {
            doc.text(cat.label + ': ' + cat.count + ' locations', margin + 5, y);
            y += 4.5;
        }
    });

    y += 6;

    // ─── Top Locations Table ───
    doc.setTextColor(primary[0], primary[1], primary[2]);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Top Priority Locations', margin, y);
    y += 5;

    var tableData = data.slice(0, 30).map(function(d, i) {
        return [
            i + 1,
            signDefState.categories[d.category].label,
            d.route.substring(0, 25),
            d.crashCount,
            d.severitySummary.K + '/' + d.severitySummary.A + '/' + d.severitySummary.B,
            d.epdo,
            d.confidence
        ];
    });

    if (typeof doc.autoTable === 'function') {
        doc.autoTable({
            startY: y,
            head: [['#', 'Category', 'Location', 'Crashes', 'K/A/B', 'EPDO', 'Confidence']],
            body: tableData,
            headStyles: { fillColor: primary, textColor: 255, fontStyle: 'bold', fontSize: 8 },
            styles: { fontSize: 7, cellPadding: 2 },
            alternateRowStyles: { fillColor: [245, 247, 250] },
            margin: { left: margin, right: margin }
        });
        y = doc.lastAutoTable.finalY + 10;
    } else {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        tableData.forEach(function(row) {
            doc.text(row.join(' | '), margin, y);
            y += 4;
            if (y > 260) { doc.addPage(); y = margin; }
        });
    }

    // ─── Truncation note ───
    if (data.length > 30) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(107, 114, 128);
        doc.text('Showing top 30 of ' + data.length + ' total candidate locations. Export CSV/GeoJSON for the complete dataset.', margin, y);
        y += 8;
    }

    // ─── Disclaimer ───
    if (y > 240) { doc.addPage(); y = margin; }
    doc.setFillColor(255, 251, 235);
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(146, 64, 14);
    doc.setFont('helvetica', 'bold');
    doc.text('Engineering Review Required', margin + 3, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.text('This tool identifies candidate locations based on crash pattern analysis. Field observation and professional', margin + 3, y + 10);
    doc.text('engineering judgment are required before making any traffic control decisions. This is NOT a final engineering recommendation.', margin + 3, y + 14);

    doc.save('sign_deficiency_report.pdf');
    showToast('PDF report generated: ' + data.length + ' candidate locations', 'success');
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.assets = CL.assets || {};
  CL.assets.signDef = CL.assets.signDef || {};
  window.signDef_getCutoffDate = signDef_getCutoffDate; CL.assets.signDef.signDef_getCutoffDate = signDef_getCutoffDate;
  window.signDef_filterByMonths = signDef_filterByMonths; CL.assets.signDef.signDef_filterByMonths = signDef_filterByMonths;
  window.signDef_calcEPDO = signDef_calcEPDO; CL.assets.signDef.signDef_calcEPDO = signDef_calcEPDO;
  window.signDef_nextId = signDef_nextId; CL.assets.signDef.signDef_nextId = signDef_nextId;
  window.signDef_init = signDef_init; CL.assets.signDef.signDef_init = signDef_init;
  window.signDef_reanalyze = signDef_reanalyze; CL.assets.signDef.signDef_reanalyze = signDef_reanalyze;
  window.signDef_onFilterChange = signDef_onFilterChange; CL.assets.signDef.signDef_onFilterChange = signDef_onFilterChange;
  window.signDef_loadInventory = signDef_loadInventory; CL.assets.signDef.signDef_loadInventory = signDef_loadInventory;
  window.signDef_hasNearbyInventory = signDef_hasNearbyInventory; CL.assets.signDef.signDef_hasNearbyInventory = signDef_hasNearbyInventory;
  window.signDef_getPostedSpeed = signDef_getPostedSpeed; CL.assets.signDef.signDef_getPostedSpeed = signDef_getPostedSpeed;
  window.signDef_analyze = signDef_analyze; CL.assets.signDef.signDef_analyze = signDef_analyze;
  window.signDef_applyFilters = signDef_applyFilters; CL.assets.signDef.signDef_applyFilters = signDef_applyFilters;
  window.signDef_addDeficiency = signDef_addDeficiency; CL.assets.signDef.signDef_addDeficiency = signDef_addDeficiency;
  window.signDef_checkSignal = signDef_checkSignal; CL.assets.signDef.signDef_checkSignal = signDef_checkSignal;
  window.signDef_checkStopSign = signDef_checkStopSign; CL.assets.signDef.signDef_checkStopSign = signDef_checkStopSign;
  window.signDef_checkStreetLight = signDef_checkStreetLight; CL.assets.signDef.signDef_checkStreetLight = signDef_checkStreetLight;
  window.signDef_checkCrosswalk = signDef_checkCrosswalk; CL.assets.signDef.signDef_checkCrosswalk = signDef_checkCrosswalk;
  window.signDef_checkSchoolZone = signDef_checkSchoolZone; CL.assets.signDef.signDef_checkSchoolZone = signDef_checkSchoolZone;
  window.signDef_checkAnimal = signDef_checkAnimal; CL.assets.signDef.signDef_checkAnimal = signDef_checkAnimal;
  window.signDef_checkBike = signDef_checkBike; CL.assets.signDef.signDef_checkBike = signDef_checkBike;
  window.signDef_checkSpeed = signDef_checkSpeed; CL.assets.signDef.signDef_checkSpeed = signDef_checkSpeed;
  window.signDef_initMap = signDef_initMap; CL.assets.signDef.signDef_initMap = signDef_initMap;
  window.signDef_addMarker = signDef_addMarker; CL.assets.signDef.signDef_addMarker = signDef_addMarker;
  window.signDef_renderLegend = signDef_renderLegend; CL.assets.signDef.signDef_renderLegend = signDef_renderLegend;
  window.signDef_renderLayerToggles = signDef_renderLayerToggles; CL.assets.signDef.signDef_renderLayerToggles = signDef_renderLayerToggles;
  window.signDef_toggleCategory = signDef_toggleCategory; CL.assets.signDef.signDef_toggleCategory = signDef_toggleCategory;
  window.signDef_renderUI = signDef_renderUI; CL.assets.signDef.signDef_renderUI = signDef_renderUI;
  window.signDef_renderSummaryCards = signDef_renderSummaryCards; CL.assets.signDef.signDef_renderSummaryCards = signDef_renderSummaryCards;
  window.signDef_renderTable = signDef_renderTable; CL.assets.signDef.signDef_renderTable = signDef_renderTable;
  window.signDef_sortTable = signDef_sortTable; CL.assets.signDef.signDef_sortTable = signDef_sortTable;
  window.signDef_filterTable = signDef_filterTable; CL.assets.signDef.signDef_filterTable = signDef_filterTable;
  window.signDef_zoomTo = signDef_zoomTo; CL.assets.signDef.signDef_zoomTo = signDef_zoomTo;
  window.signDef_navigateToWarrant = signDef_navigateToWarrant; CL.assets.signDef.signDef_navigateToWarrant = signDef_navigateToWarrant;
  window.signDef_exportCSV = signDef_exportCSV; CL.assets.signDef.signDef_exportCSV = signDef_exportCSV;
  window.signDef_exportKML = signDef_exportKML; CL.assets.signDef.signDef_exportKML = signDef_exportKML;
  window.signDef_escXml = signDef_escXml; CL.assets.signDef.signDef_escXml = signDef_escXml;
  window.signDef_exportGeoJSON = signDef_exportGeoJSON; CL.assets.signDef.signDef_exportGeoJSON = signDef_exportGeoJSON;
  window.signDef_exportPDF = signDef_exportPDF; CL.assets.signDef.signDef_exportPDF = signDef_exportPDF;
  CL._registerModule('assets/sign-deficiency');
})();
