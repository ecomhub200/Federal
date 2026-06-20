/**
 * CL warrants.signalTab — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.warrants.signalTab.<fn>; any
 * module-private state stays inside this IIFE (no external refs).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
/**
 * Initialize/reset signal warrant state
 */
function signal_initState() {
    warrantsState.signal = {
        multiDayData: {},
        averagingMethod: 'tue-wed-thu',
        includeWeekend: false,
        config: {
            intersectionName: '',
            majorStreet: '',
            minorStreet: '',
            majorLanes: 2,
            minorLanes: 1,
            majorDirection: 'EW',
            intersectionLegs: 4,
            speedLimit: 35,
            communityPop: 50000,
            apply70pct: false,
            countType: '12hr',
            uturnSelection: 'none'
        },
        rtAdjustment: {
            method: 'pagones',
            fixedPercent: 30,
            pagonesConfig: 'sharedLane'
        },
        virginiaMode: (typeof _getActiveStateKey === 'function' && _getActiveStateKey() === 'virginia'),
        warrant4: { enabled: false, analysisType: '4hour', pedCrossingSpeed: 'normal', hourlyPedCounts: [0,0,0,0], hourlyMajorVolumes: [0,0,0,0] },
        warrant5: { enabled: false, childrenCount: 0, crossingMinutes: 60, adequateGaps: 0, gapStudyDone: false },
        warrant7: { enabled: false, period: '1year', angleCrashesTotal: 0, angleCrashesInjury: 0, pedCrashesTotal: 0, pedCrashesInjury: 0, alternativesTried: false, autoPopulated: true, sourceData: null },
        uploadedFiles: {},
        extractionStatus: null,
        pendingExtractions: [],
        reviewQueue: [],
        isReviewMode: false,
        analysisResults: null,
        lastAnalysisTimestamp: null,
        currentTab: 'config',
        showAdvanced: false
    };
    console.log('[Signal] State initialized');
}

/**
 * Get lane configuration string (e.g., '2x1', '2x2')
 */
function signal_getLaneConfig() {
    return CL.warrants.signal.getLaneConfig(warrantsState.signal.config.majorLanes, warrantsState.signal.config.minorLanes);
}

/**
 * Get reduction factor based on population/speed
 */
function signal_getReductionFactor() {
    return CL.warrants.signal.getReductionFactor(warrantsState.signal.config);
}

/**
 * Apply Pagones Theorem right-turn adjustment
 */
function signal_applyPagonesAdjustment(rtVolume, majorVolumePerLane) {
    const pagonesConfig = warrantsState.signal.rtAdjustment.pagonesConfig;
    const minorFactor = SIGNAL_PAGONES_FACTORS.minorStreet[pagonesConfig] || 0.30;

    // Find mainline congestion factor
    let congestionFactor = 0;
    for (const tier of SIGNAL_PAGONES_FACTORS.mainlineCongestion) {
        if (majorVolumePerLane <= tier.maxVolPerLane) {
            congestionFactor = tier.factor;
            break;
        }
    }

    const adjustedRT = rtVolume * minorFactor * (1 - congestionFactor);
    return Math.round(adjustedRT);
}

/**
 * Apply right-turn adjustment to approach volumes
 */
function signal_applyRTAdjustment(hourlyData, majorVolumePerLane) {
    const method = warrantsState.signal.rtAdjustment.method;
    if (method === 'none') return hourlyData;

    const adjusted = JSON.parse(JSON.stringify(hourlyData));

    for (const approach of ['NB', 'SB', 'EB', 'WB']) {
        if (!adjusted[approach]) continue;
        const rtVol = adjusted[approach].R || 0;
        let reduction = 0;

        if (method === 'fixed') {
            reduction = Math.round(rtVol * (warrantsState.signal.rtAdjustment.fixedPercent / 100));
        } else if (method === 'pagones') {
            reduction = rtVol - signal_applyPagonesAdjustment(rtVol, majorVolumePerLane);
        }

        adjusted[approach].R = Math.max(0, rtVol - reduction);
    }

    return adjusted;
}

/**
 * Compute hourly aggregates from TMC data based on averaging method
 */
function signal_computeHourlyAggregates() {
    const multiDay = warrantsState.signal.multiDayData;
    const method = warrantsState.signal.averagingMethod;
    const dayKeys = Object.keys(multiDay);

    if (dayKeys.length === 0) return null;

    // Filter days based on averaging method
    let validDays = [];
    for (const key of dayKeys) {
        const dow = multiDay[key].dow;
        if (method === 'tue-wed-thu' && [2, 3, 4].includes(dow)) {
            validDays.push(key);
        } else if (method === 'all-weekdays' && dow >= 1 && dow <= 5) {
            validDays.push(key);
        } else if (method === 'any-single-day') {
            validDays.push(key);
        } else if (method === 'custom') {
            validDays.push(key); // Include all for custom
        }
    }

    if (validDays.length === 0) validDays = dayKeys;

    // For "any-single-day" mode, return aggregates for ALL valid days
    // The individual day analysis is handled in signal_runAnalysis()
    // Note: Do NOT restrict to first day here - each day will be analyzed separately

    // Aggregate hourly data (including U-turn)
    const aggregated = {};
    const allMovements = ['L', 'T', 'R', 'U']; // Include U-turn in aggregation
    for (let hour = 0; hour < 24; hour++) {
        aggregated[hour] = { NB: { L: 0, T: 0, R: 0, U: 0 }, SB: { L: 0, T: 0, R: 0, U: 0 }, EB: { L: 0, T: 0, R: 0, U: 0 }, WB: { L: 0, T: 0, R: 0, U: 0 } };

        for (const dayKey of validDays) {
            const dayData = multiDay[dayKey].hourlyData?.[hour];
            if (!dayData) continue;

            for (const approach of SIGNAL_TMC_APPROACHES) {
                for (const mov of allMovements) {
                    aggregated[hour][approach][mov] += (dayData[approach]?.[mov] || 0);
                }
            }
        }

        // Average if multiple days
        if (validDays.length > 1) {
            for (const approach of SIGNAL_TMC_APPROACHES) {
                for (const mov of allMovements) {
                    aggregated[hour][approach][mov] = Math.round(aggregated[hour][approach][mov] / validDays.length);
                }
            }
        }
    }

    return aggregated;
}

/**
 * Compute hourly aggregates for a SINGLE day (used in "any-single-day" mode)
 * @param {string} dayKey - The key of the day in multiDayData
 * @returns {Object} Hourly aggregates for that specific day
 */
function signal_computeHourlyAggregatesForDay(dayKey) {
    const multiDay = warrantsState.signal.multiDayData;
    const dayData = multiDay[dayKey];
    if (!dayData) return null;

    const aggregated = {};
    const allMovements = ['L', 'T', 'R', 'U'];

    for (let hour = 0; hour < 24; hour++) {
        aggregated[hour] = { NB: { L: 0, T: 0, R: 0, U: 0 }, SB: { L: 0, T: 0, R: 0, U: 0 }, EB: { L: 0, T: 0, R: 0, U: 0 }, WB: { L: 0, T: 0, R: 0, U: 0 } };
        const hourData = dayData.hourlyData?.[hour];
        if (!hourData) continue;

        for (const approach of SIGNAL_TMC_APPROACHES) {
            for (const mov of allMovements) {
                aggregated[hour][approach][mov] = hourData[approach]?.[mov] || 0;
            }
        }
    }

    return aggregated;
}

/**
 * Calculate major and minor street volumes from hourly data
 */
function signal_calculateStreetVolumes(hourlyData) {
    return CL.warrants.signal.calculateStreetVolumes(hourlyData, warrantsState.signal.config.majorDirection, SIGNAL_TMC_APPROACHES);
}

/**
 * Interpolate threshold from curve
 */
function signal_interpolateThreshold(curve, majorVol) {
    return CL.warrants.signal.interpolateThreshold(curve, majorVol);
}

/**
 * Evaluate Warrant 1: Eight-Hour Vehicular Volume
 */
function signal_evaluateWarrant1(hourlyAggregates) {
    const laneConfig = signal_getLaneConfig();
    const reduction = signal_getReductionFactor();
    const thresholdsA = SIGNAL_WARRANT1_THRESHOLDS.conditionA[laneConfig][reduction];
    const thresholdsB = SIGNAL_WARRANT1_THRESHOLDS.conditionB[laneConfig][reduction];

    // 80% thresholds for combination condition
    const thresholdsA80 = { major: Math.round(thresholdsA.major * 0.8), minor: Math.round(thresholdsA.minor * 0.8) };
    const thresholdsB80 = { major: Math.round(thresholdsB.major * 0.8), minor: Math.round(thresholdsB.minor * 0.8) };

    let hoursMeetA = 0, hoursMeetB = 0, hoursMeetA80 = 0, hoursMeetB80 = 0;
    const hourlyResults = [];

    for (let hour = 0; hour < 24; hour++) {
        const hourData = hourlyAggregates[hour];
        if (!hourData) continue;

        // Use pre-computed values if available, otherwise calculate
        const majorTotal = hourData.majorTotal !== undefined ? hourData.majorTotal : signal_calculateStreetVolumes(hourData).major;
        const minorAdjusted = hourData.minorAdjusted !== undefined ? hourData.minorAdjusted : signal_calculateStreetVolumes(hourData).minor;

        // 100% threshold checks
        const meetsCondA = majorTotal >= thresholdsA.major && minorAdjusted >= thresholdsA.minor;
        const meetsCondB = majorTotal >= thresholdsB.major && minorAdjusted >= thresholdsB.minor;

        // 80% threshold checks
        const meetsCondA80 = majorTotal >= thresholdsA80.major && minorAdjusted >= thresholdsA80.minor;
        const meetsCondB80 = majorTotal >= thresholdsB80.major && minorAdjusted >= thresholdsB80.minor;

        if (meetsCondA) hoursMeetA++;
        if (meetsCondB) hoursMeetB++;
        if (meetsCondA80) hoursMeetA80++;
        if (meetsCondB80) hoursMeetB80++;

        hourlyResults.push({
            hour,
            majorTotal,
            minorAdjusted,
            // Keep legacy property names for backward compatibility
            major: majorTotal,
            minor: minorAdjusted,
            meetsA: meetsCondA,
            meetsB: meetsCondB,
            // New property names expected by UI
            meetsCondA,
            meetsCondB,
            meetsCondA80,
            meetsCondB80
        });
    }

    const metConditionA = hoursMeetA >= 8;
    const metConditionB = hoursMeetB >= 8;
    // 80% combination: both A and B must have 8 hours at 80% threshold
    const metCombination80 = hoursMeetA80 >= 8 && hoursMeetB80 >= 8;
    const met = metConditionA || metConditionB || metCombination80;

    return {
        warrant: 1,
        met,
        conditionA: { met: metConditionA, hoursMet: hoursMeetA, threshold: 8 },
        conditionB: { met: metConditionB, hoursMet: hoursMeetB, threshold: 8 },
        combination80A: hoursMeetA80,
        combination80B: hoursMeetB80,
        thresholds: { conditionA: thresholdsA, conditionB: thresholdsB },
        thresholdA: thresholdsA,
        thresholdB: thresholdsB,
        hourlyResults,
        laneConfig,
        reduction
    };
}

/**
 * Evaluate Warrant 2: Four-Hour Vehicular Volume
 */
function signal_evaluateWarrant2(hourlyAggregates) {
    const laneConfig = signal_getLaneConfig();
    const reduction = signal_getReductionFactor();
    const curve = SIGNAL_WARRANT2_CURVES[laneConfig];

    // Apply reduction if needed
    let adjustedCurve = curve;
    if (reduction === 'p70') {
        adjustedCurve = curve.map(pt => ({ major: Math.round(pt.major * 0.7), minor: Math.round(pt.minor * 0.7) }));
    } else if (reduction === 'p80') {
        adjustedCurve = curve.map(pt => ({ major: Math.round(pt.major * 0.8), minor: Math.round(pt.minor * 0.8) }));
    }

    let hoursMet = 0;
    const hourlyResults = [];

    for (let hour = 0; hour < 24; hour++) {
        const hourData = hourlyAggregates[hour];
        if (!hourData) continue;

        const vols = signal_calculateStreetVolumes(hourData);
        const threshold = signal_interpolateThreshold(adjustedCurve, vols.major);
        const meets = vols.minor >= threshold;

        if (meets) hoursMet++;
        hourlyResults.push({ hour, major: vols.major, minor: vols.minor, threshold, meets });
    }

    const met = hoursMet >= 4;

    return {
        warrant: 2,
        met,
        hoursMet,
        threshold: 4,
        curve: adjustedCurve,
        hourlyResults,
        laneConfig,
        reduction
    };
}

/**
 * Evaluate Warrant 3: Peak Hour
 */
function signal_evaluateWarrant3(hourlyAggregates) {
    const laneConfig = signal_getLaneConfig();
    const reduction = signal_getReductionFactor();
    const curve = SIGNAL_WARRANT3_CURVES[laneConfig];

    // Apply reduction
    let adjustedCurve = curve;
    if (reduction === 'p70') {
        adjustedCurve = curve.map(pt => ({ major: Math.round(pt.major * 0.7), minor: Math.round(pt.minor * 0.7) }));
    } else if (reduction === 'p80') {
        adjustedCurve = curve.map(pt => ({ major: Math.round(pt.major * 0.8), minor: Math.round(pt.minor * 0.8) }));
    }

    // Find peak hour
    let peakHour = 0, peakTotal = 0;
    const hourlyResults = [];

    for (let hour = 0; hour < 24; hour++) {
        const hourData = hourlyAggregates[hour];
        if (!hourData) continue;

        const vols = signal_calculateStreetVolumes(hourData);
        const total = vols.major + vols.minor;
        const threshold = signal_interpolateThreshold(adjustedCurve, vols.major);
        const meets = vols.minor >= threshold;

        if (total > peakTotal) {
            peakTotal = total;
            peakHour = hour;
        }

        hourlyResults.push({ hour, major: vols.major, minor: vols.minor, threshold, meets });
    }

    const peakResult = hourlyResults.find(h => h.hour === peakHour);
    const met = peakResult ? peakResult.meets : false;

    // Additional check: delay >= 4 vehicle-hours (simplified)
    const vehicleHoursDelay = peakResult ? Math.max(0, peakResult.minor - peakResult.threshold) / 60 : 0;

    return {
        warrant: 3,
        met,
        peakHour,
        peakVolumes: peakResult ? { major: peakResult.major, minor: peakResult.minor } : null,
        threshold: peakResult?.threshold,
        vehicleHoursDelay,
        curve: adjustedCurve,
        hourlyResults,
        laneConfig,
        reduction
    };
}

/**
 * Evaluate Warrant 4: Pedestrian Volume
 */
function signal_evaluateWarrant4() {
    const w4 = warrantsState.signal.warrant4;
    if (!w4.enabled) return { enabled: false, met: false };

    const use70 = warrantsState.signal.config.apply70pct;
    const isSlow = w4.pedCrossingSpeed === 'slow';
    const isPeak = w4.analysisType === 'peakhour';

    // Select the appropriate curve
    const curveKey = isPeak
        ? (use70 ? 'peakHour_70' : 'peakHour_100')
        : (use70 ? 'fourHour_70' : 'fourHour_100');
    const curve = SIGNAL_WARRANT4_CURVES[curveKey];
    const minThreshold = SIGNAL_WARRANT4_CURVES.minThresholds[curveKey][isSlow ? 'slow' : 'normal'];

    // Get threshold from curve for given major street volume
    function getPedThreshold(majorVol) {
        if (majorVol < curve[0].major) return Infinity;
        for (let i = 0; i < curve.length - 1; i++) {
            if (majorVol >= curve[i].major && majorVol < curve[i + 1].major) {
                const t = (majorVol - curve[i].major) / (curve[i + 1].major - curve[i].major);
                let threshold = curve[i].ped + t * (curve[i + 1].ped - curve[i].ped);
                if (isSlow) threshold *= 0.5; // 50% reduction for slow crossers
                return Math.max(threshold, minThreshold);
            }
        }
        return isSlow ? minThreshold : curve[curve.length - 1].ped;
    }

    // Evaluate each hour
    const hoursToCheck = isPeak ? 1 : 4;
    const hourlyResults = [];
    let hoursMet = 0;

    for (let i = 0; i < hoursToCheck; i++) {
        const pedVol = w4.hourlyPedCounts[i] || 0;
        const majorVol = w4.hourlyMajorVolumes[i] || 0;
        const threshold = getPedThreshold(majorVol);
        const met = pedVol >= threshold && pedVol >= minThreshold;
        hourlyResults.push({ hour: i + 1, pedVol, majorVol, threshold: Math.round(threshold), met });
        if (met) hoursMet++;
    }

    // For 4-hour: need 4 hours above curve. For peak: need 1 hour above curve.
    const met = isPeak ? hoursMet >= 1 : hoursMet >= 4;

    return {
        warrant: 4,
        enabled: true,
        met,
        analysisType: w4.analysisType,
        crossingSpeed: w4.pedCrossingSpeed,
        use70,
        curveKey,
        figureName: isPeak ? (use70 ? '4C-8' : '4C-6') : (use70 ? '4C-7' : '4C-5'),
        minThreshold,
        hoursMet,
        hoursRequired: isPeak ? 1 : 4,
        hourlyResults
    };
}

/**
 * Evaluate Warrant 5: School Crossing
 */
function signal_evaluateWarrant5() {
    const w5 = warrantsState.signal.warrant5;
    if (!w5.enabled) return { enabled: false, met: false };

    const schoolchildren = w5.childrenCount || 0;
    const minutes = w5.crossingMinutes || 60;
    const adequateGaps = w5.adequateGaps || 0;
    const gapStudyDone = w5.gapStudyDone || false;

    // Warrant 5 conditions:
    // 1. Minimum 20 schoolchildren during highest crossing hour
    // 2. Number of adequate gaps < number of minutes in crossing period
    // 3. Gap study must be completed
    const conditionA = schoolchildren >= SIGNAL_WARRANT5_MIN_SCHOOLCHILDREN;
    const conditionB = adequateGaps < minutes;
    const conditionC = gapStudyDone;

    const met = conditionA && conditionB && conditionC;

    return {
        warrant: 5,
        enabled: true,
        met,
        schoolchildren,
        minRequired: SIGNAL_WARRANT5_MIN_SCHOOLCHILDREN,
        minutes,
        adequateGaps,
        gapStudyDone,
        conditionA,
        conditionB,
        conditionC
    };
}

/**
 * Evaluate Warrant 7: Crash Experience
 */
function signal_evaluateWarrant7(hourlyAggregates) {
    const w7 = warrantsState.signal.warrant7;
    const laneConfig = signal_getLaneConfig();
    const legs = warrantsState.signal.config.intersectionLegs;
    const legKey = legs === 3 ? 'threeLeg' : 'fourLeg';

    // Determine which threshold set to use
    const useReduced = warrantsState.signal.config.apply70pct;
    const periodKey = w7.period === '3year' ? (useReduced ? 'reduced_3year' : 'standard_3year') : (useReduced ? 'reduced_1year' : 'standard_1year');

    const thresholds = SIGNAL_WARRANT7_THRESHOLDS[periodKey][laneConfig][legKey];

    // Calculate total susceptible crashes (angle + ped)
    const totalSusceptible = w7.angleCrashesTotal + w7.pedCrashesTotal;
    const totalInjury = w7.angleCrashesInjury + w7.pedCrashesInjury;

    // Check volume criterion (80% of Warrant 1 thresholds for 8 hours)
    let volumeCriterionMet = false;
    if (hourlyAggregates) {
        const reduction = signal_getReductionFactor();
        const w1Thresholds = SIGNAL_WARRANT1_THRESHOLDS.conditionA[laneConfig][reduction];
        const threshold80Pct = { major: Math.round(w1Thresholds.major * 0.8), minor: Math.round(w1Thresholds.minor * 0.8) };

        let hoursMet = 0;
        for (let hour = 0; hour < 24; hour++) {
            const hourData = hourlyAggregates[hour];
            if (!hourData) continue;
            const vols = signal_calculateStreetVolumes(hourData);
            if (vols.major >= threshold80Pct.major && vols.minor >= threshold80Pct.minor) hoursMet++;
        }
        volumeCriterionMet = hoursMet >= 8;
    }

    // Crash criterion per MUTCD 4C.08 (02) B: "at least ONE of the following conditions"
    // Either total angle+ped >= threshold OR fatal-and-injury (K/A/B) >= threshold
    const crashCriterionMet = totalSusceptible >= thresholds.total || totalInjury >= thresholds.injury;

    // Alternative tried
    const alternativesTried = w7.alternativesTried;

    const met = crashCriterionMet && volumeCriterionMet && alternativesTried;

    return {
        warrant: 7,
        met,
        crashCriterion: {
            met: crashCriterionMet,
            totalSusceptible,
            totalInjury,
            thresholds
        },
        volumeCriterion: {
            met: volumeCriterionMet
        },
        alternativesTried,
        period: w7.period,
        autoPopulated: w7.autoPopulated,
        sourceData: w7.sourceData,
        laneConfig,
        legKey
    };
}

/**
 * Auto-populate Warrant 7 from crash data
 * Per MUTCD 4C.08: Counts angle crashes and pedestrian crashes susceptible to correction by signal
 */
function signal_autoPopulateWarrant7() {
    // Round 21 §3 — Supabase fallback. On aggregate tiers where sampleRows is
    // empty (county-rollup / planning_district / region / state), warrantsState
    // has no filteredCrashes to analyze. Pull intersection-level rows directly
    // from mv_intersection_summary so the warrant analysis isn't a no-op.
    // Idempotent — does nothing on tiers where filteredCrashes is already
    // populated. State-agnostic — keys on resolved tier + crashLensClient.state.
    if ((!warrantsState.filteredCrashes || warrantsState.filteredCrashes.length === 0)
        && (!warrantsState.locationCrashes || warrantsState.locationCrashes.length === 0)
        && window.crashLensClient
        && window.CL && CL.data && CL.data.supabaseBridge
        && !warrantsState._w7SupabaseFallbackInFlight) {
        const t = (typeof CL.data.supabaseBridge.resolveTier === 'function')
            ? CL.data.supabaseBridge.resolveTier()
            : null;
        if (t && t.tier && t.value) {
            const dc = window.crashLensClient;
            const tierColMap = {
                state: null, region: 'dot_district', mpo: 'mpo_name',
                planning_district: 'planning_district', county: 'planning_district',
                city: 'physical_juris_name', city_town: 'physical_juris_name'
            };
            const tierCol = tierColMap[t.tier];
            const params = new URLSearchParams({
                state: 'eq.' + String(dc.state || '').toLowerCase(),
                // Round 21.1 §1 — column list aligned with mv_intersection_summary
                // shape (intersection_name lives on mv_hotspots, NOT this view).
                // Verified live: state, planning_district, intersection_type,
                // traffic_control_type, collision_type, crash_year, total, k, a, b, c, o, ka, epdo.
                select: 'intersection_type,traffic_control_type,collision_type,total,k,a,b,c,o,crash_year',
                limit: '20000'
            });
            if (tierCol && t.value) params.set(tierCol, 'eq.' + t.value);
            warrantsState._w7SupabaseFallbackInFlight = true;
            fetch(`${dc.supabaseUrl}/mv_intersection_summary?${params}`, {
                headers: { apikey: dc.supabaseKey, Authorization: 'Bearer ' + dc.supabaseKey }
            })
                .then(r => r.ok ? r.json() : [])
                .then(rows => {
                    warrantsState._w7SupabaseFallbackInFlight = false;
                    if (Array.isArray(rows) && rows.length > 0) {
                        warrantsState.filteredCrashes = rows;
                        console.log('[Warrant 7] Supabase fallback hydrated', rows.length, 'rows');
                        signal_autoPopulateWarrant7();   // re-enter with populated crashes
                    } else {
                        console.warn('[Warrant 7] Supabase fallback returned no rows for tier', t);
                    }
                })
                .catch(err => {
                    warrantsState._w7SupabaseFallbackInFlight = false;
                    console.warn('[Warrant 7] Supabase fallback failed:', err && err.message);
                });
            return;
        }
    }

    // Ensure filtered crashes are synced from location crashes
    if (warrantsState.locationCrashes && warrantsState.locationCrashes.length > 0) {
        filterWarrantCrashesByDate();

        // CRITICAL: Ensure crash profile and UI are in sync with filtered crashes
        // This prevents count mismatch between date info (filteredCrashes.length) and profile display
        const profileTotal = warrantsState.crashProfile?.total || 0;
        const filteredCount = warrantsState.filteredCrashes?.length || 0;
        if (profileTotal !== filteredCount) {
            console.log('[Signal] Profile/Filter mismatch detected, rebuilding profile:', { profileTotal, filteredCount });
            const profile = buildWarrantCrashProfile(warrantsState.filteredCrashes);
            warrantsState.crashProfile = profile;
            updateWarrantCrashDisplay(profile);
            updateWarrantDateInfo();
        }
    }

    const crashes = warrantsState.filteredCrashes;
    // Preserve current enabled state (don't auto-enable)
    const currentEnabled = warrantsState.signal.warrant7?.enabled || false;

    // Diagnostic: Log collision types found in data for debugging
    if (crashes && crashes.length > 0) {
        const collisionTypes = {};
        crashes.forEach(c => {
            const type = c[COL.COLLISION] || 'Unknown';
            collisionTypes[type] = (collisionTypes[type] || 0) + 1;
        });
        console.log('[Warrant 7] Collision types in filtered crashes:', collisionTypes);
    }

    if (!crashes || crashes.length === 0) {
        console.warn('[Warrant 7] No filtered crashes available for analysis', {
            location: warrantsState.selectedLocation,
            locationCrashes: warrantsState.locationCrashes?.length || 0,
            dateFilter: warrantsState.dateFilter
        });
        warrantsState.signal.warrant7 = {
            enabled: currentEnabled,
            period: signal_detectWarrant7Period(),
            angleCrashesTotal: 0,
            angleCrashesInjury: 0,
            pedCrashesTotal: 0,
            pedCrashesInjury: 0,
            alternativesTried: false,
            autoPopulated: true,
            sourceData: null
        };
        signal_updateWarrant7Display();
        return;
    }

    /**
     * MUTCD Angle Crash Patterns
     * Per MUTCD 4C.08, angle crashes are "susceptible to correction by a traffic control signal"
     * These patterns match common Virginia DMV crash coding conventions
     */
    const ANGLE_CRASH_PATTERNS = [
        'angle',           // Direct match: "Angle", "Right Angle", "Left Angle"
        'broadside',       // T-bone collisions
        't-bone',          // T-bone collisions
        'right turn',      // Right turn angle crashes
        'left turn',       // Left turn angle crashes
        'turning',         // Turning movement crashes at intersections
        'cross traffic',   // Cross traffic crashes
        'ran red',         // Red light running (signal correctable)
        'ran stop',        // Stop sign violation (signal correctable)
        'failure to yield' // Yield violations at intersections
    ];

    /**
     * MUTCD Pedestrian Crash Patterns
     * Per MUTCD 4C.08, pedestrian crashes correctable by signals
     */
    const PEDESTRIAN_CRASH_PATTERNS = [
        'pedestrian',      // Direct match
        'ped',             // Abbreviated
        'walker',          // Alternate terminology
        'crosswalk',       // Crosswalk-related
        'foot traffic'     // Foot traffic
    ];

    // Filter for angle crashes using comprehensive pattern matching
    const angleCrashes = crashes.filter(c => {
        const type = (c[COL.COLLISION] || '').toLowerCase();
        return ANGLE_CRASH_PATTERNS.some(pattern => type.includes(pattern));
    });

    // Filter for pedestrian crashes using PED flag OR collision type
    const pedCrashes = crashes.filter(c => {
        const type = (c[COL.COLLISION] || '').toLowerCase();
        const pedFlag = c[COL.PED];
        // Use isYes helper for consistent flag checking (handles Y, Yes, 1, true, etc.)
        const isPedByFlag = isYes(pedFlag);
        const isPedByType = PEDESTRIAN_CRASH_PATTERNS.some(pattern => type.includes(pattern));
        return isPedByFlag || isPedByType;
    });

    // Count injuries (K, A, B per MUTCD 4C.08 - personal injury crashes)
    const countInjury = (arr) => arr.filter(c => {
        const sev = (c[COL.SEVERITY] || '').toString().trim().toUpperCase().charAt(0);
        return ['K', 'A', 'B'].includes(sev);
    }).length;

    warrantsState.signal.warrant7 = {
        enabled: currentEnabled,
        period: signal_detectWarrant7Period(),
        angleCrashesTotal: angleCrashes.length,
        angleCrashesInjury: countInjury(angleCrashes),
        pedCrashesTotal: pedCrashes.length,
        pedCrashesInjury: countInjury(pedCrashes),
        alternativesTried: warrantsState.signal.warrant7?.alternativesTried || false,
        autoPopulated: true,
        sourceData: { angleCrashes, pedCrashes }
    };

    signal_updateWarrant7Display();

    // Enhanced diagnostic logging
    console.log('[Warrant 7] Auto-populated from crash data:', {
        location: warrantsState.selectedLocation,
        dateRange: `${warrantsState.dateFilter.startDate} to ${warrantsState.dateFilter.endDate}`,
        totalFilteredCrashes: crashes.length,
        angleCrashes: {
            total: angleCrashes.length,
            injury: countInjury(angleCrashes),
            collisionTypes: [...new Set(angleCrashes.map(c => c[COL.COLLISION]))]
        },
        pedestrianCrashes: {
            total: pedCrashes.length,
            injury: countInjury(pedCrashes),
            byFlag: pedCrashes.filter(c => isYes(c[COL.PED])).length,
            byCollisionType: pedCrashes.filter(c => (c[COL.COLLISION] || '').toLowerCase().includes('pedestrian')).length
        }
    });
}

/**
 * Detect Warrant 7 analysis period from date filter
 */
function signal_detectWarrant7Period() {
    const { startDate, endDate } = warrantsState.dateFilter;
    if (!startDate || !endDate) return '1year';

    const months = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24 * 30);
    return months >= 30 ? '3year' : '1year';
}

// NOTE: Duplicate signal_refreshWarrant7() removed - see definition below at line ~50532

/**
 * Update Warrant 7 display in UI
 */
function signal_updateWarrant7Display() {
    const w7 = warrantsState.signal.warrant7;

    // Update checkbox and panel visibility
    const checkbox = document.getElementById('signalW7Enable');
    const panel = document.getElementById('signalW7Panel');
    if (checkbox) checkbox.checked = w7.enabled;
    if (panel) panel.classList.toggle('hidden', !w7.enabled);

    // Update display elements if they exist
    const angleTotal = document.getElementById('signalW7AngleTotal');
    const angleInjury = document.getElementById('signalW7AngleInjury');
    const pedTotal = document.getElementById('signalW7PedTotal');
    const pedInjury = document.getElementById('signalW7PedInjury');
    const periodSelect = document.getElementById('signalW7Period');
    const sourceIndicator = document.getElementById('signalW7Source');

    if (angleTotal) angleTotal.value = w7.angleCrashesTotal;
    if (angleInjury) angleInjury.value = w7.angleCrashesInjury;
    if (pedTotal) pedTotal.value = w7.pedCrashesTotal;
    if (pedInjury) pedInjury.value = w7.pedCrashesInjury;
    if (periodSelect) periodSelect.value = w7.period;

    if (sourceIndicator) {
        if (w7.autoPopulated && w7.sourceData) {
            sourceIndicator.textContent = 'Optional';
        } else {
            sourceIndicator.textContent = 'Optional';
        }
    }
}

/**
 * Refresh Warrant 7 data when period is changed
 * Called when the Warrant 7 Analysis Period dropdown is changed
 */
function signal_refreshWarrant7() {
    const selectedPeriod = warrantsState.signal.warrant7?.period || '1year';
    const years = selectedPeriod === '3year' ? 3 : 1;

    // Update the main crash analysis date filter to match
    const maxDate = getMaxCrashDate();
    const endDate = new Date(maxDate);
    endDate.setHours(0, 0, 0, 0);

    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - years);
    startDate.setDate(startDate.getDate() + 1);

    const formatDate = (d) => d.toISOString().split('T')[0];

    // Update date filter inputs
    document.getElementById('warrantStartDate').value = formatDate(startDate);
    document.getElementById('warrantEndDate').value = formatDate(endDate);

    // Update warrantsState date filter
    warrantsState.dateFilter.startDate = formatDate(startDate);
    warrantsState.dateFilter.endDate = formatDate(endDate);
    warrantsState.dateFilter.preset = (years * 12) + 'mo';

    // Update button states to reflect the period
    document.querySelectorAll('.warrant-date-preset').forEach(btn => btn.classList.remove('active'));
    const presetBtn = years === 1
        ? document.querySelector('.warrant-date-preset[onclick*="applyWarrantDatePreset(1)"]')
        : document.querySelector('.warrant-date-preset[onclick*="applyWarrantDatePreset(3)"]');
    if (presetBtn) presetBtn.classList.add('active');

    // Re-filter crashes with new date range
    filterWarrantCrashesByDate();

    // Update date info display to show correct filtered count
    updateWarrantDateInfo();

    // Rebuild crash profile and update UI
    const profile = buildWarrantCrashProfile(warrantsState.filteredCrashes);
    warrantsState.crashProfile = profile;
    updateWarrantCrashDisplay(profile);

    // Re-populate Warrant 7 with newly filtered data
    signal_autoPopulateWarrant7();

    console.log('[Signal] Warrant 7 refreshed with period:', selectedPeriod, 'Filtered crashes:', warrantsState.filteredCrashes.length, 'Profile total:', profile.total);
}

/**
 * Run full signal warrant analysis
 */
function signal_runAnalysis() {
    console.log('[Signal] Running analysis...');

    // Compute hourly aggregates
    const hourlyAggregates = signal_computeHourlyAggregates();

    if (!hourlyAggregates) {
        showToast('No TMC data available. Please enter or upload turning movement counts.', 'warning');
        return null;
    }

    // Get configuration
    const majorLanes = warrantsState.signal.config.majorLanes;
    const majorDir = warrantsState.signal.config.majorDirection;
    const isMajorEW = majorDir === 'EW';
    const rtMethod = warrantsState.signal.rtAdjustment?.method || 'pagones';

    // Apply right-turn adjustment to each hour and compute summary totals
    for (let hour = 0; hour < 24; hour++) {
        if (hourlyAggregates[hour]) {
            // Calculate volumes BEFORE RT adjustment
            const volsBefore = signal_calculateStreetVolumes(hourlyAggregates[hour]);
            const majorVolumePerLane = Math.round(volsBefore.major / (majorLanes * 2));

            // Calculate minor RT volume before adjustment
            let minorRTBefore = 0;
            for (const approach of ['NB', 'SB', 'EB', 'WB']) {
                const isMinor = (isMajorEW && (approach === 'NB' || approach === 'SB')) ||
                               (!isMajorEW && (approach === 'EB' || approach === 'WB'));
                if (isMinor && hourlyAggregates[hour][approach]) {
                    minorRTBefore += hourlyAggregates[hour][approach].R || 0;
                }
            }

            // Apply RT adjustment
            hourlyAggregates[hour] = signal_applyRTAdjustment(hourlyAggregates[hour], majorVolumePerLane);

            // Calculate volumes AFTER RT adjustment
            const volsAfter = signal_calculateStreetVolumes(hourlyAggregates[hour]);

            // Calculate minor RT volume after adjustment
            let minorRTAfter = 0;
            for (const approach of ['NB', 'SB', 'EB', 'WB']) {
                const isMinor = (isMajorEW && (approach === 'NB' || approach === 'SB')) ||
                               (!isMajorEW && (approach === 'EB' || approach === 'WB'));
                if (isMinor && hourlyAggregates[hour][approach]) {
                    minorRTAfter += hourlyAggregates[hour][approach].R || 0;
                }
            }

            // Add computed summary properties to each hour
            hourlyAggregates[hour].majorTotal = volsAfter.major;
            hourlyAggregates[hour].minorTotal = volsBefore.minor;
            hourlyAggregates[hour].minorAdjusted = volsAfter.minor;
            hourlyAggregates[hour].minorRT = minorRTBefore;
            hourlyAggregates[hour].rtReduction = volsBefore.minor - volsAfter.minor;
        }
    }

    // Calculate average volume across all hours
    let totalVol = 0, hourCount = 0;
    for (let h = 0; h < 24; h++) {
        if (hourlyAggregates[h]) {
            totalVol += (hourlyAggregates[h].majorTotal || 0) + (hourlyAggregates[h].minorAdjusted || 0);
            hourCount++;
        }
    }
    const avgVolume = hourCount > 0 ? Math.round(totalVol / hourCount) : 0;

    // Get days used info
    const multiDay = warrantsState.signal.multiDayData || {};
    const dayKeys = Object.keys(multiDay);
    const averagingMethod = warrantsState.signal.averagingMethod || 'tue-wed-thu';

    // Filter days based on averaging method to get actual days used
    let validDays = [];
    for (const key of dayKeys) {
        const dow = multiDay[key].dow;
        if (averagingMethod === 'tue-wed-thu' && [2, 3, 4].includes(dow)) {
            validDays.push(key);
        } else if (averagingMethod === 'all-weekdays' && dow >= 1 && dow <= 5) {
            validDays.push(key);
        } else if (averagingMethod === 'any-single-day') {
            validDays.push(key);
        } else if (averagingMethod === 'custom' || averagingMethod === 'weekend') {
            validDays.push(key);
        }
    }
    if (validDays.length === 0) validDays = dayKeys;
    const daysUsed = validDays.length;
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // For "any-single-day" mode: evaluate each day individually, warrant passes if ANY day passes
    if (averagingMethod === 'any-single-day' && validDays.length > 1) {
        console.log('[Signal] Any-single-day mode: evaluating', validDays.length, 'days individually');

        // Track which days satisfy each warrant
        const w1SatisfiedBy = [], w2SatisfiedBy = [], w3SatisfiedBy = [];
        let bestW1Result = null, bestW2Result = null, bestW3Result = null;
        const perDayResults = [];

        for (const dayKey of validDays) {
            // Get aggregates for this specific day
            const dayAggregates = signal_computeHourlyAggregatesForDay(dayKey);
            if (!dayAggregates) continue;

            // Apply RT adjustment to this day's data
            for (let hour = 0; hour < 24; hour++) {
                if (dayAggregates[hour]) {
                    const volsBefore = signal_calculateStreetVolumes(dayAggregates[hour]);
                    const majorVolumePerLane = Math.round(volsBefore.major / (majorLanes * 2));
                    dayAggregates[hour] = signal_applyRTAdjustment(dayAggregates[hour], majorVolumePerLane);
                    const volsAfter = signal_calculateStreetVolumes(dayAggregates[hour]);
                    dayAggregates[hour].majorTotal = volsAfter.major;
                    dayAggregates[hour].minorTotal = volsBefore.minor;
                    dayAggregates[hour].minorAdjusted = volsAfter.minor;
                }
            }

            // Evaluate warrants for this day
            const w1 = signal_evaluateWarrant1(dayAggregates);
            const w2 = signal_evaluateWarrant2(dayAggregates);
            const w3 = signal_evaluateWarrant3(dayAggregates);

            const dayInfo = multiDay[dayKey];
            const dayLabel = dayInfo.date || dayNames[dayInfo.dow] || dayKey;

            perDayResults.push({ dayKey, dayLabel, w1, w2, w3 });

            if (w1.met) {
                w1SatisfiedBy.push(dayLabel);
                if (!bestW1Result) bestW1Result = w1;
            }
            if (w2.met) {
                w2SatisfiedBy.push(dayLabel);
                if (!bestW2Result) bestW2Result = w2;
            }
            if (w3.met) {
                w3SatisfiedBy.push(dayLabel);
                if (!bestW3Result) bestW3Result = w3;
            }
        }

        // Build results - warrant passes if ANY day satisfied it
        const results = {
            timestamp: new Date().toISOString(),
            config: { ...warrantsState.signal.config },
            laneConfig: signal_getLaneConfig(),
            reduction: signal_getReductionFactor(),
            averagingMethod: averagingMethod,
            daysUsed: daysUsed,
            rtMethod: rtMethod,
            avgVolume: avgVolume,
            warrant1: bestW1Result || signal_evaluateWarrant1(hourlyAggregates),
            warrant2: bestW2Result || signal_evaluateWarrant2(hourlyAggregates),
            warrant3: bestW3Result || signal_evaluateWarrant3(hourlyAggregates),
            warrant4: signal_evaluateWarrant4(),
            warrant5: signal_evaluateWarrant5(),
            warrant7: signal_evaluateWarrant7(hourlyAggregates),
            hourlyAggregates,
            // Add "any-single-day" specific info
            anySingleDayMode: true,
            perDayResults: perDayResults
        };

        // Override met status based on any day passing
        results.warrant1.met = w1SatisfiedBy.length > 0;
        results.warrant1.satisfiedBy = w1SatisfiedBy.length > 0 ? w1SatisfiedBy.join(', ') : null;
        results.warrant2.met = w2SatisfiedBy.length > 0;
        results.warrant2.satisfiedBy = w2SatisfiedBy.length > 0 ? w2SatisfiedBy.join(', ') : null;
        results.warrant3.met = w3SatisfiedBy.length > 0;
        results.warrant3.satisfiedBy = w3SatisfiedBy.length > 0 ? w3SatisfiedBy.join(', ') : null;

        // Build dayResults for Individual Day Breakdown
        results.dayResults = signal_buildDayResults(multiDay, validDays, results);

        // Count warrants met
        results.warrantsMet = [
            results.warrant1.met,
            results.warrant2.met,
            results.warrant3.met,
            results.warrant4?.enabled && results.warrant4?.met,
            results.warrant5?.enabled && results.warrant5?.met,
            results.warrant7.met
        ].filter(Boolean).length;

        results.recommendation = results.warrantsMet > 0
            ? 'Signal installation may be warranted. Further engineering study recommended.'
            : 'No warrants met. Signal installation not recommended at this time.';

        // Store and display results
        warrantsState.signal.analysisResults = results;
        warrantsState.signal.lastAnalysisTimestamp = results.timestamp;
        signal_updateResultsDisplay(results);

        console.log('[Signal] Any-single-day analysis complete:', results);
        return results;
    }

    // Standard analysis for other averaging methods
    const results = {
        timestamp: new Date().toISOString(),
        config: { ...warrantsState.signal.config },
        laneConfig: signal_getLaneConfig(),
        reduction: signal_getReductionFactor(),
        averagingMethod: averagingMethod,
        daysUsed: daysUsed,
        rtMethod: rtMethod,
        avgVolume: avgVolume,
        warrant1: signal_evaluateWarrant1(hourlyAggregates),
        warrant2: signal_evaluateWarrant2(hourlyAggregates),
        warrant3: signal_evaluateWarrant3(hourlyAggregates),
        warrant4: signal_evaluateWarrant4(),
        warrant5: signal_evaluateWarrant5(),
        warrant7: signal_evaluateWarrant7(hourlyAggregates),
        hourlyAggregates
    };

    // Build dayResults for Individual Day Breakdown
    results.dayResults = signal_buildDayResults(multiDay, validDays, results);

    // Count warrants met
    results.warrantsMet = [
        results.warrant1.met,
        results.warrant2.met,
        results.warrant3.met,
        results.warrant4?.enabled && results.warrant4?.met,
        results.warrant5?.enabled && results.warrant5?.met,
        results.warrant7.met
    ].filter(Boolean).length;

    results.recommendation = results.warrantsMet > 0
        ? 'Signal installation may be warranted. Further engineering study recommended.'
        : 'No warrants met. Signal installation not recommended at this time.';

    // Store results
    warrantsState.signal.analysisResults = results;
    warrantsState.signal.lastAnalysisTimestamp = results.timestamp;

    // Update UI
    signal_updateResultsDisplay(results);

    console.log('[Signal] Analysis complete:', results);
    return results;
}

/**
 * Build per-day results for the Individual Day Breakdown section
 */
function signal_buildDayResults(multiDay, validDays, results) {
    const dayResults = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Calculate total volumes for each day
    let totalAllDays = 0;
    const dayVolumes = [];

    for (const dayKey of validDays) {
        const day = multiDay[dayKey];
        if (!day) continue;

        let dayVol = 0;
        for (let hour = 0; hour < 24; hour++) {
            const hourData = day.hourlyData?.[hour];
            if (!hourData) continue;
            for (const approach of ['NB', 'SB', 'EB', 'WB']) {
                const data = hourData[approach] || {};
                dayVol += (data.L || 0) + (data.T || 0) + (data.R || 0) + (data.U || 0) + (data.total || 0);
            }
        }

        dayVolumes.push({ dayKey, day, volume: dayVol });
        totalAllDays += dayVol;
    }

    const meanVolume = dayVolumes.length > 0 ? totalAllDays / dayVolumes.length : 0;

    // Build results for each day
    for (let i = 0; i < dayVolumes.length; i++) {
        const { dayKey, day, volume } = dayVolumes[i];
        const deviation = meanVolume > 0 ? ((volume - meanVolume) / meanVolume) * 100 : 0;

        // For accurate per-day warrant evaluation, we'd need to run warrants on each day's data
        // For now, mark the first/primary day and show overall results
        dayResults.push({
            dayKey: dayKey,
            date: day.date || dayKey,
            dow: day.dow,
            dayName: dayNames[day.dow] || 'Unknown',
            totalVolume: volume,
            deviation: deviation,
            isPrimary: i === 0,
            // Use overall results for warrant status (proper per-day evaluation would require more computation)
            w1Met: results.warrant1?.met || false,
            w2Met: results.warrant2?.met || false,
            w3Met: results.warrant3?.met || false
        });
    }

    return dayResults;
}

/**
 * Update results display in UI
 */
function signal_updateResultsDisplay(results) {
    // Show the results section
    const section = document.getElementById('signalResultsSection');
    if (section) section.classList.remove('hidden');

    // Update the result banner
    const banner = document.getElementById('signalResultBanner');
    const title = document.getElementById('signalResultTitle');
    const subtitle = document.getElementById('signalResultSubtitle');

    if (banner) {
        banner.classList.remove('not-warranted', 'warranted');
        banner.classList.add(results.warrantsMet > 0 ? 'warranted' : 'not-warranted');
    }
    if (title) {
        title.textContent = results.warrantsMet > 0
            ? `${results.warrantsMet} Warrant(s) Met`
            : 'No Warrants Met';
    }
    if (subtitle) {
        subtitle.textContent = results.recommendation;
    }

    // Show/hide alternative options based on warrant result
    const altOptions = document.getElementById('signalAlternativeOptions');
    if (altOptions) {
        altOptions.style.display = results.warrantsMet > 0 ? 'none' : 'block';
    }

    // Auto-save after analysis is complete
    warrantDbScheduleAutoSave('signal');

    // Build warrant cards - add "satisfied by" info for any-single-day mode
    const isAnySingleDay = results.anySingleDayMode;
    const warrantCards = [
        {
            num: 1, name: 'Eight-Hour Volume', met: results.warrant1.met,
            detail: `${results.warrant1.conditionA.hoursMet}/8 hrs (Cond A), ${results.warrant1.conditionB.hoursMet}/8 hrs (Cond B)`,
            satisfiedBy: isAnySingleDay && results.warrant1.satisfiedBy ? results.warrant1.satisfiedBy : null
        },
        {
            num: 2, name: 'Four-Hour Volume', met: results.warrant2.met,
            detail: `${results.warrant2.hoursMet}/4 hrs met`,
            satisfiedBy: isAnySingleDay && results.warrant2.satisfiedBy ? results.warrant2.satisfiedBy : null
        },
        {
            num: 3, name: 'Peak Hour', met: results.warrant3.met,
            detail: results.warrant3.peakHour !== undefined ? `Peak @ ${String(results.warrant3.peakHour).padStart(2,'0')}:00` : 'N/A',
            satisfiedBy: isAnySingleDay && results.warrant3.satisfiedBy ? results.warrant3.satisfiedBy : null
        }
    ];

    // Add Warrant 4 if enabled
    if (results.warrant4?.enabled) {
        warrantCards.push({
            num: 4,
            name: 'Pedestrian Volume',
            met: results.warrant4.met,
            detail: `Fig ${results.warrant4.figureName}: ${results.warrant4.hoursMet}/${results.warrant4.hoursRequired} hrs met`
        });
    }

    // Add Warrant 5 if enabled
    if (results.warrant5?.enabled) {
        warrantCards.push({
            num: 5,
            name: 'School Crossing',
            met: results.warrant5.met,
            detail: `${results.warrant5.schoolchildren} students, ${results.warrant5.adequateGaps}/${results.warrant5.minutes} gaps`
        });
    }

    // Add Warrant 7
    warrantCards.push({
        num: 7,
        name: 'Crash Experience',
        met: results.warrant7.met,
        detail: `${results.warrant7.crashCriterion.totalSusceptible} susceptible, ${results.warrant7.crashCriterion.totalInjury} injury`
    });

    // Update warrant results grid
    const grid = document.getElementById('signalWarrantResultsGrid');
    if (grid) {
        grid.innerHTML = warrantCards.map(w => `
            <div class="signal-warrant-card ${w.met ? 'met' : ''}">
                <div class="signal-warrant-card-header">
                    <span class="signal-warrant-card-title">Warrant ${w.num}</span>
                    <span class="signal-warrant-status ${w.met ? 'met' : 'not-met'}">
                        ${w.met ? '✓ MET' : '✗ NOT MET'}
                    </span>
                </div>
                <div style="font-size:.8rem;color:#64748b;margin-bottom:4px">${w.name}</div>
                <div style="font-size:.75rem;color:#94a3b8">${w.detail}</div>
                ${w.satisfiedBy ? `<div style="font-size:.7rem;color:#22c55e;margin-top:4px;font-style:italic">Satisfied by: ${w.satisfiedBy}</div>` : ''}
            </div>
        `).join('');
    }

    // Update multi-day breakdown table
    signal_renderMultiDayTable(results);

    // Update hourly TMC data tables
    signal_renderHourlyTMC(results);

    // Update RT Adjustment tab
    signal_renderRTAdjustment(results);

    // Update detailed results section (Individual Day Breakdown, Detailed Analysis, Export Reports)
    const detailedResults = document.getElementById('signalDetailedResultsContainer');
    if (detailedResults) {
        detailedResults.innerHTML = signal_buildDetailedResultsHTML(results);
    }

    // Scroll to results
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Build detailed results HTML with tabbed interface
 */
function signal_buildDetailedResultsHTML(results) {
    return `
        <!-- Individual Day Breakdown -->
        <div class="signal-card" style="margin-top:16px">
            <div class="signal-card-header">
                <div class="signal-card-title"><span class="icon">📅</span> Individual Day Breakdown</div>
            </div>
            <div style="padding:16px;overflow-x:auto">
                ${signal_buildDayBreakdownTable(results)}
            </div>
        </div>

        <!-- Detailed Analysis Tabs -->
        <div class="signal-card" style="margin-top:16px">
            <div class="signal-card-header">
                <div class="signal-card-title"><span class="icon">📋</span> Detailed Analysis</div>
            </div>
            <div style="border-bottom:1px solid var(--border);overflow-x:auto">
                <div style="display:flex;gap:0;min-width:max-content">
                    <button class="signal-detail-tab active" data-tab="summary" onclick="signal_switchDetailTab('summary')">Summary</button>
                    <button class="signal-detail-tab" data-tab="warrant1" onclick="signal_switchDetailTab('warrant1')">Warrant 1</button>
                    <button class="signal-detail-tab" data-tab="warrant2" onclick="signal_switchDetailTab('warrant2')">Warrant 2</button>
                    <button class="signal-detail-tab" data-tab="warrant3" onclick="signal_switchDetailTab('warrant3')">Warrant 3</button>
                    <button class="signal-detail-tab" data-tab="warrant4" onclick="signal_switchDetailTab('warrant4')">Warrant 4</button>
                    <button class="signal-detail-tab" data-tab="warrant5" onclick="signal_switchDetailTab('warrant5')">Warrant 5</button>
                    <button class="signal-detail-tab" data-tab="warrant7" onclick="signal_switchDetailTab('warrant7')">Warrant 7</button>
                    <button class="signal-detail-tab" data-tab="hourly" onclick="signal_switchDetailTab('hourly')">Hourly TMC</button>
                    <button class="signal-detail-tab" data-tab="rt" onclick="signal_switchDetailTab('rt')">RT Adjustment</button>
                </div>
            </div>
            <div style="padding:16px">
                <div id="signal-detail-summary" class="signal-detail-content">${signal_buildSummaryTab(results)}</div>
                <div id="signal-detail-warrant1" class="signal-detail-content" style="display:none">${signal_buildWarrant1Tab(results)}</div>
                <div id="signal-detail-warrant2" class="signal-detail-content" style="display:none">${signal_buildWarrant2Tab(results)}</div>
                <div id="signal-detail-warrant3" class="signal-detail-content" style="display:none">${signal_buildWarrant3Tab(results)}</div>
                <div id="signal-detail-warrant4" class="signal-detail-content" style="display:none">${signal_buildWarrant4Tab(results)}</div>
                <div id="signal-detail-warrant5" class="signal-detail-content" style="display:none">${signal_buildWarrant5Tab(results)}</div>
                <div id="signal-detail-warrant7" class="signal-detail-content" style="display:none">${signal_buildWarrant7Tab(results)}</div>
                <div id="signal-detail-hourly" class="signal-detail-content" style="display:none">${signal_buildHourlyTab(results)}</div>
                <div id="signal-detail-rt" class="signal-detail-content" style="display:none">${signal_buildRTTab(results)}</div>
            </div>
        </div>

        <!-- Disclaimer & Export Section -->
        <div class="signal-card" style="margin-top:16px;background:#fef3c7;border:2px solid #f59e0b">
            <div class="signal-card-header" style="background:transparent;border-bottom:1px solid #fbbf24">
                <div class="signal-card-title" style="color:#92400e"><span class="icon">⚠️</span> Disclaimer & Export</div>
            </div>
            <div style="padding:16px">
                <div class="export-disclaimer-box" style="background:white">
                    <label class="export-disclaimer-label">
                        <input type="checkbox" id="signalExportDisclaimer" onchange="signal_toggleExportButtons()">
                        <span>I acknowledge that this analysis is for <strong>screening purposes only</strong> and does not constitute professional engineering advice. Final warrant determinations require review by a licensed Professional Engineer and field verification of all data inputs.</span>
                    </label>
                </div>
                <div id="signalExportGrid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px">
                    <div class="signal-export-btn disabled" id="signalExportWord" onclick="signal_generateWordMemo()">
                        <div class="signal-export-icon">📝</div>
                        <div class="signal-export-title">Word Memo</div>
                        <div class="signal-export-desc">Official memorandum for project file</div>
                    </div>
                    <div class="signal-export-btn disabled" id="signalExportPDF" onclick="signal_generatePDFReport()">
                        <div class="signal-export-icon">📄</div>
                        <div class="signal-export-title">PDF Report</div>
                        <div class="signal-export-desc">Comprehensive analysis with calculations</div>
                    </div>
                    <div class="signal-export-btn disabled" id="signalExportCSV" onclick="signal_exportCSV()">
                        <div class="signal-export-icon">📊</div>
                        <div class="signal-export-title">CSV Data</div>
                        <div class="signal-export-desc">Raw hourly data for further analysis</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Switch between detailed analysis tabs
 */
function signal_switchDetailTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.signal-detail-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    // Update tab content
    document.querySelectorAll('.signal-detail-content').forEach(content => {
        content.style.display = 'none';
    });
    const targetContent = document.getElementById(`signal-detail-${tabName}`);
    if (targetContent) targetContent.style.display = 'block';
}

/**
 * Build day breakdown table
 */
function signal_buildDayBreakdownTable(results) {
    const days = results.dayResults || [];
    if (days.length === 0) {
        return '<p style="color:var(--text-secondary)">No individual day data available.</p>';
    }

    let rows = days.map((d, i) => {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[d.dow] || 'Unknown';
        const isWeekend = d.dow === 0 || d.dow === 6;
        const isPrimary = i === 0 || d.isPrimary;
        return `<tr${isPrimary ? ' style="background:var(--primary);color:white"' : ''}>
            <td style="padding:8px 12px">${dayName}</td>
            <td style="padding:8px 12px;text-align:center"><span style="background:${isWeekend ? '#f59e0b' : '#3b82f6'};color:white;padding:2px 8px;border-radius:4px;font-size:.75rem">${isWeekend ? 'WEEKEND' : 'WEEKDAY'}</span></td>
            <td style="padding:8px 12px;text-align:center">${(d.totalVolume || 0).toLocaleString()}</td>
            <td style="padding:8px 12px;text-align:center">${d.deviation ? d.deviation.toFixed(1) + '%' : '—'}</td>
            <td style="padding:8px 12px;text-align:center"><span style="color:${d.w1Met ? '#22c55e' : '#ef4444'}">${d.w1Met ? '✓' : '✗'}</span></td>
            <td style="padding:8px 12px;text-align:center"><span style="color:${d.w2Met ? '#22c55e' : '#ef4444'}">${d.w2Met ? '✓' : '✗'}</span></td>
            <td style="padding:8px 12px;text-align:center"><span style="color:${d.w3Met ? '#22c55e' : '#ef4444'}">${d.w3Met ? '✓' : '✗'}</span></td>
        </tr>`;
    }).join('');

    // Add average row
    const avgRow = `<tr style="background:var(--primary);color:white;font-weight:600">
        <td style="padding:8px 12px"><span style="display:flex;align-items:center;gap:4px">📊 AVERAGE (${days.length} days)</span></td>
        <td style="padding:8px 12px;text-align:center">Primary</td>
        <td style="padding:8px 12px;text-align:center">${(results.avgVolume || 0).toLocaleString()}</td>
        <td style="padding:8px 12px;text-align:center">—</td>
        <td style="padding:8px 12px;text-align:center"><span style="color:${results.warrant1?.met ? '#86efac' : '#fca5a5'}">${results.warrant1?.met ? '✓' : '✗'}</span></td>
        <td style="padding:8px 12px;text-align:center"><span style="color:${results.warrant2?.met ? '#86efac' : '#fca5a5'}">${results.warrant2?.met ? '✓' : '✗'}</span></td>
        <td style="padding:8px 12px;text-align:center"><span style="color:${results.warrant3?.met ? '#86efac' : '#fca5a5'}">${results.warrant3?.met ? '✓' : '✗'}</span></td>
    </tr>`;

    return `<table style="width:100%;border-collapse:collapse;font-size:.875rem">
        <thead><tr style="background:var(--bg-secondary);border-bottom:2px solid var(--border)">
            <th style="padding:8px 12px;text-align:left">Day</th>
            <th style="padding:8px 12px;text-align:center">Type</th>
            <th style="padding:8px 12px;text-align:center">Volume</th>
            <th style="padding:8px 12px;text-align:center">Dev.</th>
            <th style="padding:8px 12px;text-align:center">W1</th>
            <th style="padding:8px 12px;text-align:center">W2</th>
            <th style="padding:8px 12px;text-align:center">W3</th>
        </tr></thead>
        <tbody>${rows}${avgRow}</tbody>
    </table>`;
}

/**
 * Build Summary tab content
 */
function signal_buildSummaryTab(results) {
    const c = results.config;
    const avgMethodNames = {
        'tue-wed-thu': 'Tue/Wed/Thu',
        'all-weekdays': 'All Weekdays',
        'any-single-day': 'Any Single Day',
        'weekend': 'Weekend'
    };
    return `
        <h4 style="margin:0 0 16px;color:var(--primary)">Configuration Summary</h4>
        <table style="width:100%;border-collapse:collapse;font-size:.875rem">
            <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:12px 16px;font-weight:600;width:200px">Intersection</td>
                <td style="padding:12px 16px;text-align:center">${c.intersectionName || 'Unnamed Intersection'}</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:12px 16px;font-weight:600">Major Street</td>
                <td style="padding:12px 16px;text-align:center">${c.majorStreet || 'Major Street'} (${c.majorLanes} lanes, ${c.majorDirection})</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:12px 16px;font-weight:600">Minor Street</td>
                <td style="padding:12px 16px;text-align:center">${c.minorStreet || 'Minor Street'} (${c.minorLanes} lanes)</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:12px 16px;font-weight:600">Speed Limit</td>
                <td style="padding:12px 16px;text-align:center">${c.speedLimit} mph</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:12px 16px;font-weight:600">70% Factor</td>
                <td style="padding:12px 16px;text-align:center">${c.apply70pct ? 'Applied' : 'Not Applied'}</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:12px 16px;font-weight:600">Averaging Method</td>
                <td style="padding:12px 16px;text-align:center">${avgMethodNames[results.averagingMethod] || results.averagingMethod}</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:12px 16px;font-weight:600">Days Analyzed</td>
                <td style="padding:12px 16px;text-align:center">${results.daysUsed || 1}</td>
            </tr>
            <tr>
                <td style="padding:12px 16px;font-weight:600">RT Method</td>
                <td style="padding:12px 16px;text-align:center">${results.rtMethod || 'pagones'}</td>
            </tr>
        </table>
    `;
}

/**
 * Build Warrant 1 tab content
 */
function signal_buildWarrant1Tab(results) {
    const w = results.warrant1;
    if (!w) return '<p style="color:var(--text-secondary)">Warrant 1 data not available.</p>';

    const laneConfig = results.laneConfig || signal_getLaneConfig();
    const thresholdA = w.thresholdA || { major: 600, minor: 150 };
    const thresholdB = w.thresholdB || { major: 900, minor: 75 };

    // Build hourly analysis table
    let hourlyRows = '';
    const hourlyResults = w.hourlyResults || [];
    const sortedHours = [...hourlyResults].sort((a, b) => (b.majorTotal || 0) - (a.majorTotal || 0)).slice(0, 12);

    sortedHours.forEach(h => {
        const condAMet = h.meetsCondA || ((h.majorTotal >= thresholdA.major) && (h.minorAdjusted >= thresholdA.minor));
        const condBMet = h.meetsCondB || ((h.majorTotal >= thresholdB.major) && (h.minorAdjusted >= thresholdB.minor));
        const condA80Met = h.meetsCondA80 || ((h.majorTotal >= thresholdA.major * 0.8) && (h.minorAdjusted >= thresholdA.minor * 0.8));
        const condB80Met = h.meetsCondB80 || ((h.majorTotal >= thresholdB.major * 0.8) && (h.minorAdjusted >= thresholdB.minor * 0.8));

        hourlyRows += `<tr>
            <td style="padding:6px 8px">${String(h.hour).padStart(2, '0')}:00</td>
            <td style="padding:6px 8px;text-align:center">${h.majorTotal || 0}</td>
            <td style="padding:6px 8px;text-align:center">${h.minorAdjusted || 0}</td>
            <td style="padding:6px 8px;text-align:center;color:${condAMet ? '#22c55e' : '#ef4444'}">${condAMet ? '✓' : '✗'}</td>
            <td style="padding:6px 8px;text-align:center;color:${condBMet ? '#22c55e' : '#ef4444'}">${condBMet ? '✓' : '✗'}</td>
            <td style="padding:6px 8px;text-align:center;color:${condA80Met ? '#22c55e' : '#ef4444'}">${condA80Met ? '✓' : '✗'}</td>
            <td style="padding:6px 8px;text-align:center;color:${condB80Met ? '#22c55e' : '#ef4444'}">${condB80Met ? '✓' : '✗'}</td>
        </tr>`;
    });

    return `
        <h4 style="margin:0 0 8px;color:var(--primary)">Warrant 1: Eight-Hour Vehicular Volume</h4>
        <p style="margin:0 0 16px"><strong>Status:</strong> <span style="color:${w.met ? '#22c55e' : '#ef4444'};font-weight:600">${w.met ? '✓ SATISFIED' : '✗ NOT SATISFIED'}</span></p>

        <div style="background:var(--bg-secondary);padding:12px;border-radius:8px;margin-bottom:16px">
            <h5 style="margin:0 0 8px">Summary</h5>
            <table style="width:100%;border-collapse:collapse;font-size:.85rem">
                <tr><td style="padding:4px 8px">Condition A (100%)</td><td style="padding:4px 8px;text-align:center;font-weight:600">${w.conditionA?.hoursMet || 0}/8 hours</td><td style="padding:4px 8px;text-align:right;color:${(w.conditionA?.hoursMet || 0) >= 8 ? '#22c55e' : '#ef4444'}">${(w.conditionA?.hoursMet || 0) >= 8 ? '✓ MET' : '✗ NOT MET'}</td></tr>
                <tr><td style="padding:4px 8px">Condition B (100%)</td><td style="padding:4px 8px;text-align:center;font-weight:600">${w.conditionB?.hoursMet || 0}/8 hours</td><td style="padding:4px 8px;text-align:right;color:${(w.conditionB?.hoursMet || 0) >= 8 ? '#22c55e' : '#ef4444'}">${(w.conditionB?.hoursMet || 0) >= 8 ? '✓ MET' : '✗ NOT MET'}</td></tr>
                <tr><td style="padding:4px 8px">Combination (80%)</td><td style="padding:4px 8px;text-align:center">A=${w.combination80A || 0}/8, B=${w.combination80B || 0}/8</td><td style="padding:4px 8px;text-align:right;color:${((w.combination80A || 0) >= 8 && (w.combination80B || 0) >= 8) ? '#22c55e' : '#ef4444'}">${((w.combination80A || 0) >= 8 && (w.combination80B || 0) >= 8) ? '✓ MET' : '✗ NOT MET'}</td></tr>
            </table>
        </div>

        <div style="background:#fef3c7;padding:12px;border-radius:8px;margin-bottom:16px;border:1px solid #fcd34d;font-size:.8rem">
            <h5 style="margin:0 0 6px;color:#92400e;display:flex;align-items:center;gap:6px"><span>💡</span> Understanding the 80% Combination Condition</h5>
            <p style="margin:0 0 8px;color:#78350f;line-height:1.4">
                <strong>MUTCD 4C.02:</strong> Warrant 1 is satisfied if <em>any</em> of these three conditions is met:
            </p>
            <ul style="margin:0;padding-left:20px;color:#78350f;line-height:1.5">
                <li><strong>Condition A alone:</strong> 8+ hours meet 100% thresholds for Condition A</li>
                <li><strong>Condition B alone:</strong> 8+ hours meet 100% thresholds for Condition B</li>
                <li><strong>80% Combination:</strong> <em>Both</em> Condition A <em>and</em> Condition B must have 8+ hours meeting their respective 80% thresholds <em>simultaneously</em></li>
            </ul>
            <p style="margin:8px 0 0;color:#78350f;font-style:italic;font-size:.75rem">
                Note: The 80% combination is an alternative pathway per MUTCD 4C.02(b) for locations that nearly meet both conditions but don't fully satisfy either at 100%.
            </p>
        </div>

        <div style="background:#eff6ff;padding:12px;border-radius:8px;margin-bottom:16px;border:1px solid #bfdbfe">
            <h5 style="margin:0 0 8px;color:#1e40af">Thresholds (Lane Config: ${laneConfig})</h5>
            <table style="width:100%;border-collapse:collapse;font-size:.85rem">
                <tr><td style="padding:4px 8px"><strong>Condition A:</strong></td><td style="padding:4px 8px">Major ≥ ${thresholdA.major} vph</td><td style="padding:4px 8px">Minor ≥ ${thresholdA.minor} vph</td></tr>
                <tr><td style="padding:4px 8px"><strong>Condition B:</strong></td><td style="padding:4px 8px">Major ≥ ${thresholdB.major} vph</td><td style="padding:4px 8px">Minor ≥ ${thresholdB.minor} vph</td></tr>
                <tr><td style="padding:4px 8px"><strong>80% Thresholds:</strong></td><td style="padding:4px 8px">Major A: ${Math.round(thresholdA.major * 0.8)}, B: ${Math.round(thresholdB.major * 0.8)}</td><td style="padding:4px 8px">Minor A: ${Math.round(thresholdA.minor * 0.8)}, B: ${Math.round(thresholdB.minor * 0.8)}</td></tr>
            </table>
        </div>

        <h5 style="margin:0 0 8px">Hour-by-Hour Analysis (Top 12 Hours by Volume)</h5>
        <div style="overflow-x:auto;max-height:300px;overflow-y:auto;border:1px solid var(--border);border-radius:8px">
            <table style="width:100%;border-collapse:collapse;font-size:.8rem">
                <thead style="position:sticky;top:0;background:white">
                    <tr style="background:var(--bg-secondary);border-bottom:1px solid var(--border)">
                        <th style="padding:8px">Hour</th>
                        <th style="padding:8px">Major (vph)</th>
                        <th style="padding:8px">Minor Adj (vph)</th>
                        <th style="padding:8px">Cond A</th>
                        <th style="padding:8px">Cond B</th>
                        <th style="padding:8px">A (80%)</th>
                        <th style="padding:8px">B (80%)</th>
                    </tr>
                </thead>
                <tbody>${hourlyRows || '<tr><td colspan="7" style="padding:12px;text-align:center;color:var(--text-secondary)">No hourly data available</td></tr>'}</tbody>
            </table>
        </div>
    `;
}

/**
 * Build Warrant 2 tab content
 */
function signal_buildWarrant2Tab(results) {
    const w = results.warrant2;
    if (!w) return '<p style="color:var(--text-secondary)">Warrant 2 data not available.</p>';

    let hourlyRows = '';
    const hourlyResults = w.hourlyResults || [];
    const sortedHours = [...hourlyResults].sort((a, b) => (b.major || 0) - (a.major || 0)).slice(0, 12);

    sortedHours.forEach(h => {
        hourlyRows += `<tr>
            <td style="padding:6px 8px">${String(h.hour).padStart(2, '0')}:00</td>
            <td style="padding:6px 8px;text-align:center">${h.major || 0}</td>
            <td style="padding:6px 8px;text-align:center">${h.minor || 0}</td>
            <td style="padding:6px 8px;text-align:center;color:${h.meets ? '#22c55e' : '#ef4444'}">${h.meets ? '✓' : '✗'}</td>
        </tr>`;
    });

    return `
        <h4 style="margin:0 0 8px;color:var(--primary)">Warrant 2: Four-Hour Vehicular Volume</h4>
        <p style="margin:0 0 16px"><strong>Status:</strong> <span style="color:${w.met ? '#22c55e' : '#ef4444'};font-weight:600">${w.met ? '✓ SATISFIED' : '✗ NOT SATISFIED'}</span></p>

        <div style="background:var(--bg-secondary);padding:12px;border-radius:8px;margin-bottom:16px">
            <h5 style="margin:0 0 8px">Summary</h5>
            <table style="width:100%;border-collapse:collapse;font-size:.85rem">
                <tr><td style="padding:4px 8px">Hours Above Curve</td><td style="padding:4px 8px;text-align:center;font-weight:600">${w.hoursMet || 0}/4 required</td><td style="padding:4px 8px;text-align:right;color:${(w.hoursMet || 0) >= 4 ? '#22c55e' : '#ef4444'}">${(w.hoursMet || 0) >= 4 ? '✓ MET' : '✗ NOT MET'}</td></tr>
            </table>
        </div>

        <div style="background:#eff6ff;padding:12px;border-radius:8px;margin-bottom:16px;border:1px solid #bfdbfe">
            <h5 style="margin:0 0 8px;color:#1e40af">Warrant 2 Threshold Curve (Lane Config: ${results.laneConfig || signal_getLaneConfig()})</h5>
            <p style="font-size:.85rem;color:#64748b;margin:0">
                Warrant 2 uses a curve where at least 4 hours must have major/minor volume combinations above the threshold.
            </p>
        </div>

        <h5 style="margin:0 0 8px">Hour-by-Hour Analysis (Top 12 Hours by Volume)</h5>
        <div style="overflow-x:auto;max-height:300px;overflow-y:auto;border:1px solid var(--border);border-radius:8px">
            <table style="width:100%;border-collapse:collapse;font-size:.8rem">
                <thead style="position:sticky;top:0;background:white">
                    <tr style="background:var(--bg-secondary);border-bottom:1px solid var(--border)">
                        <th style="padding:8px">Hour</th>
                        <th style="padding:8px">Major (vph)</th>
                        <th style="padding:8px">Minor Adj (vph)</th>
                        <th style="padding:8px">Above Curve</th>
                    </tr>
                </thead>
                <tbody>${hourlyRows || '<tr><td colspan="4" style="padding:12px;text-align:center;color:var(--text-secondary)">No hourly data available</td></tr>'}</tbody>
            </table>
        </div>
    `;
}

/**
 * Build Warrant 3 tab content
 */
function signal_buildWarrant3Tab(results) {
    const w = results.warrant3;
    if (!w) return '<p style="color:var(--text-secondary)">Warrant 3 data not available.</p>';

    return `
        <h4 style="margin:0 0 8px;color:var(--primary)">Warrant 3: Peak Hour</h4>
        <p style="margin:0 0 16px"><strong>Status:</strong> <span style="color:${w.met ? '#22c55e' : '#ef4444'};font-weight:600">${w.met ? '✓ SATISFIED' : '✗ NOT SATISFIED'}</span></p>

        <div style="background:var(--bg-secondary);padding:12px;border-radius:8px;margin-bottom:16px">
            <h5 style="margin:0 0 8px">Peak Hour Analysis</h5>
            <table style="width:100%;border-collapse:collapse;font-size:.85rem">
                <tr><td style="padding:8px">Peak Hour</td><td style="padding:8px;text-align:right;font-weight:600">${String(w.peakHour || 0).padStart(2, '0')}:00</td></tr>
                <tr><td style="padding:8px">Major Street Volume</td><td style="padding:8px;text-align:right;font-weight:600">${w.majorVolume || 0} vph</td></tr>
                <tr><td style="padding:8px">Minor Street Volume</td><td style="padding:8px;text-align:right;font-weight:600">${w.minorVolume || 0} vph</td></tr>
            </table>
        </div>

        <div style="background:#eff6ff;padding:12px;border-radius:8px;border:1px solid #bfdbfe">
            <h5 style="margin:0 0 8px;color:#1e40af">Threshold (Lane Config: ${results.laneConfig || signal_getLaneConfig()})</h5>
            <table style="width:100%;border-collapse:collapse;font-size:.85rem">
                <tr><td style="padding:4px 8px"><strong>Peak Hour Threshold:</strong></td><td style="padding:4px 8px">${w.threshold || 0} vph total entering intersection</td></tr>
                <tr><td style="padding:4px 8px"><strong>Your Peak Hour Total:</strong></td><td style="padding:4px 8px">${(w.majorVolume || 0) + (w.minorVolume || 0)} vph</td></tr>
            </table>
            <p style="font-size:.85rem;color:#64748b;margin:12px 0 0">
                Warrant 3 requires the peak hour volume to exceed the threshold AND the minor street delay/volume criteria to be met.
            </p>
        </div>
    `;
}

/**
 * Build Warrant 4 tab content
 */
function signal_buildWarrant4Tab(results) {
    const w = results.warrant4;
    if (!w || !w.enabled) {
        return '<p style="color:var(--text-secondary)">Warrant 4 (Pedestrian Volume) was not enabled for this analysis. Enable it in the input section to analyze pedestrian volumes.</p>';
    }

    let hourlyRows = '';
    (w.hourlyResults || []).forEach(hr => {
        const thresholdDisplay = !isFinite(hr.threshold) ? '<span style="color:#94a3b8">N/A</span>' : `${hr.threshold} pph`;
        const statusDisplay = !isFinite(hr.threshold) ? '<span style="color:#94a3b8">Volume too low</span>' : (hr.met ? '<span style="color:#22c55e">✓ Above</span>' : '<span style="color:#ef4444">✗ Below</span>');
        hourlyRows += `<tr>
            <td style="padding:6px 8px">Hour ${hr.hour}</td>
            <td style="padding:6px 8px;text-align:center">${hr.majorVol} vph</td>
            <td style="padding:6px 8px;text-align:center">${hr.pedVol} pph</td>
            <td style="padding:6px 8px;text-align:center">${thresholdDisplay}</td>
            <td style="padding:6px 8px;text-align:center">${statusDisplay}</td>
        </tr>`;
    });

    return `
        <h4 style="margin:0 0 8px;color:var(--primary)">Warrant 4: Pedestrian Volume</h4>
        <p style="margin:0 0 16px"><strong>Status:</strong> <span style="color:${w.met ? '#22c55e' : '#ef4444'};font-weight:600">${w.met ? '✓ SATISFIED' : '✗ NOT SATISFIED'}</span></p>

        <table style="width:100%;border-collapse:collapse;font-size:.85rem;margin-bottom:16px">
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px"><strong>Analysis Type</strong></td><td style="padding:8px;text-align:right">${w.analysisType === 'peakhour' ? 'Peak Hour' : 'Four-Hour'}</td></tr>
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px"><strong>Figure Used</strong></td><td style="padding:8px;text-align:right">${w.figureName || 'N/A'}</td></tr>
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px"><strong>Crossing Speed</strong></td><td style="padding:8px;text-align:right">${w.crossingSpeed === 'slow' ? 'Slow (<3.5 ft/s)' : 'Normal (≥3.5 ft/s)'}</td></tr>
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px"><strong>Hours Required</strong></td><td style="padding:8px;text-align:right">${w.hoursRequired || 1} hour(s) above curve</td></tr>
            <tr><td style="padding:8px"><strong>Hours Met</strong></td><td style="padding:8px;text-align:right;color:${(w.hoursMet || 0) >= (w.hoursRequired || 1) ? '#22c55e' : '#ef4444'}">${w.hoursMet || 0} / ${w.hoursRequired || 1}</td></tr>
        </table>

        <h5 style="margin:0 0 8px">Hourly Analysis</h5>
        <div style="overflow-x:auto;border:1px solid var(--border);border-radius:8px">
            <table style="width:100%;border-collapse:collapse;font-size:.8rem">
                <thead><tr style="background:var(--bg-secondary);border-bottom:1px solid var(--border)">
                    <th style="padding:8px">Hour</th>
                    <th style="padding:8px">Major St Volume</th>
                    <th style="padding:8px">Pedestrians</th>
                    <th style="padding:8px">Threshold</th>
                    <th style="padding:8px">Status</th>
                </tr></thead>
                <tbody>${hourlyRows || '<tr><td colspan="5" style="padding:12px;text-align:center;color:var(--text-secondary)">No data</td></tr>'}</tbody>
            </table>
        </div>
    `;
}

/**
 * Build Warrant 5 tab content
 */
function signal_buildWarrant5Tab(results) {
    const w = results.warrant5;
    if (!w || !w.enabled) {
        return '<p style="color:var(--text-secondary)">Warrant 5 (School Crossing) was not enabled for this analysis. Enable it in the input section to analyze school crossing data.</p>';
    }

    return `
        <h4 style="margin:0 0 8px;color:var(--primary)">Warrant 5: School Crossing</h4>
        <p style="margin:0 0 16px"><strong>Status:</strong> <span style="color:${w.met ? '#22c55e' : '#ef4444'};font-weight:600">${w.met ? '✓ SATISFIED' : '✗ NOT SATISFIED'}</span></p>

        <table style="width:100%;border-collapse:collapse;font-size:.85rem">
            <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:12px"><strong>Condition A: Minimum Schoolchildren</strong></td>
                <td style="padding:12px;text-align:center">${w.schoolchildren || 0} students (min: ${w.minRequired || 20})</td>
                <td style="padding:12px;text-align:right;color:${w.conditionA ? '#22c55e' : '#ef4444'}">${w.conditionA ? '✓ MET' : '✗ NOT MET'}</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:12px"><strong>Condition B: Inadequate Gaps</strong></td>
                <td style="padding:12px;text-align:center">${w.adequateGaps || 0} gaps < ${w.minutes || 60} minutes</td>
                <td style="padding:12px;text-align:right;color:${w.conditionB ? '#22c55e' : '#ef4444'}">${w.conditionB ? '✓ MET' : '✗ NOT MET'}</td>
            </tr>
            <tr>
                <td style="padding:12px"><strong>Condition C: Gap Study Completed</strong></td>
                <td style="padding:12px;text-align:center">${w.gapStudyDone ? 'Yes' : 'No'}</td>
                <td style="padding:12px;text-align:right;color:${w.conditionC ? '#22c55e' : '#ef4444'}">${w.conditionC ? '✓ MET' : '✗ NOT MET'}</td>
            </tr>
        </table>

        <div style="margin-top:16px;padding:12px;background:var(--bg-secondary);border-radius:8px;font-size:.85rem">
            <strong>Virginia MUTCD Reference:</strong> Section 4C.06 - School Crossing Warrant
        </div>
    `;
}

/**
 * Build Warrant 7 tab content
 */
function signal_buildWarrant7Tab(results) {
    const w = results.warrant7;
    if (!w) return '<p style="color:var(--text-secondary)">Warrant 7 data not available.</p>';

    const c = w.crashCriterion || {};
    const t = c.thresholds || { total: 5, injury: 3 };

    return `
        <h4 style="margin:0 0 8px;color:var(--primary)">Warrant 7: Crash Experience</h4>
        <p style="margin:0 0 16px"><strong>Status:</strong> <span style="color:${w.met ? '#22c55e' : '#ef4444'};font-weight:600">${w.met ? '✓ SATISFIED' : '✗ NOT SATISFIED'}</span></p>

        <div style="background:var(--bg-secondary);padding:12px;border-radius:8px;margin-bottom:16px">
            <h5 style="margin:0 0 8px">Crash Summary</h5>
            <table style="width:100%;border-collapse:collapse;font-size:.85rem">
                <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px">Analysis Period</td><td style="padding:8px;text-align:right">${w.period === '3year' ? '36 months' : '12 months'}</td></tr>
                <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px">Total Susceptible Crashes</td><td style="padding:8px;text-align:right;font-weight:600">${c.totalSusceptible || 0} (threshold: ${t.total})</td></tr>
                <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px">Injury Crashes (K/A/B)</td><td style="padding:8px;text-align:right;font-weight:600">${c.totalInjury || 0} (threshold: ${t.injury})</td></tr>
                <tr><td style="padding:8px">Alternatives Tried</td><td style="padding:8px;text-align:right">${w.alternativesTried ? 'Yes' : 'No'}</td></tr>
            </table>
        </div>

        <div style="background:#eff6ff;padding:12px;border-radius:8px;border:1px solid #bfdbfe">
            <h5 style="margin:0 0 8px;color:#1e40af">Crash Breakdown</h5>
            <table style="width:100%;border-collapse:collapse;font-size:.85rem">
                <thead><tr style="border-bottom:1px solid var(--border)">
                    <th style="padding:8px;text-align:left">Crash Type</th>
                    <th style="padding:8px;text-align:center">Total</th>
                    <th style="padding:8px;text-align:center">Injury (K/A/B)</th>
                </tr></thead>
                <tbody>
                    <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px">Angle/Left-Turn</td><td style="padding:8px;text-align:center">${w.angleCrashesTotal || 0}</td><td style="padding:8px;text-align:center">${w.angleCrashesInjury || 0}</td></tr>
                    <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px">Pedestrian</td><td style="padding:8px;text-align:center">${w.pedCrashesTotal || 0}</td><td style="padding:8px;text-align:center">${w.pedCrashesInjury || 0}</td></tr>
                    <tr style="font-weight:600"><td style="padding:8px">Total Susceptible</td><td style="padding:8px;text-align:center">${c.totalSusceptible || 0}</td><td style="padding:8px;text-align:center">${c.totalInjury || 0}</td></tr>
                </tbody>
            </table>
        </div>

        <div style="margin-top:16px;padding:12px;background:${w.met ? '#dcfce7' : '#fef2f2'};border-radius:8px;border:1px solid ${w.met ? '#86efac' : '#fecaca'}">
            <p style="margin:0;font-size:.85rem;color:${w.met ? '#166534' : '#991b1b'}">
                ${w.met ? '✓ Crash experience warrant is satisfied. Both total and injury crash thresholds have been met.' : '✗ Crash experience warrant is not satisfied. Review crash data and consider additional safety countermeasures.'}
            </p>
        </div>
    `;
}

/**
 * Build Hourly TMC tab content
 */
function signal_buildHourlyTab(results) {
    const hourlyAgg = results.hourlyAggregates || [];
    if (hourlyAgg.length === 0) {
        return '<p style="color:var(--text-secondary)">No hourly TMC data available.</p>';
    }

    let rows = '';
    for (let h = 0; h < 24; h++) {
        const a = hourlyAgg[h] || {};
        if ((a.majorTotal || 0) === 0 && (a.minorTotal || 0) === 0) continue;
        rows += `<tr>
            <td style="padding:6px 8px">${String(h).padStart(2, '0')}:00</td>
            <td style="padding:6px 8px;text-align:center">${a.majorTotal || 0}</td>
            <td style="padding:6px 8px;text-align:center">${a.minorTotal || 0}</td>
            <td style="padding:6px 8px;text-align:center">${a.minorAdjusted || a.minorTotal || 0}</td>
            <td style="padding:6px 8px;text-align:center">${(a.majorTotal || 0) + (a.minorTotal || 0)}</td>
        </tr>`;
    }

    return `
        <h4 style="margin:0 0 8px;color:var(--primary)">Hourly TMC Data Summary</h4>
        <p style="margin:0 0 16px;font-size:.85rem;color:var(--text-secondary)">Aggregated hourly volumes from all analyzed days.</p>

        <div style="overflow-x:auto;max-height:400px;overflow-y:auto;border:1px solid var(--border);border-radius:8px">
            <table style="width:100%;border-collapse:collapse;font-size:.8rem">
                <thead style="position:sticky;top:0;background:white">
                    <tr style="background:var(--bg-secondary);border-bottom:1px solid var(--border)">
                        <th style="padding:8px">Hour</th>
                        <th style="padding:8px">Major (vph)</th>
                        <th style="padding:8px">Minor Raw (vph)</th>
                        <th style="padding:8px">Minor Adj (vph)</th>
                        <th style="padding:8px">Total (vph)</th>
                    </tr>
                </thead>
                <tbody>${rows || '<tr><td colspan="5" style="padding:12px;text-align:center;color:var(--text-secondary)">No data</td></tr>'}</tbody>
            </table>
        </div>
    `;
}

/**
 * Build RT Adjustment tab content
 */
function signal_buildRTTab(results) {
    const cfg = results.config || {};
    const rtMethod = cfg.rtMethod || results.rtMethod || 'pagones';
    const hourlyAgg = results.hourlyAggregates || [];

    let rows = '';
    for (let h = 0; h < 24; h++) {
        const a = hourlyAgg[h] || {};
        if ((a.minorTotal || 0) === 0) continue;
        rows += `<tr>
            <td style="padding:6px 8px">${String(h).padStart(2, '0')}:00</td>
            <td style="padding:6px 8px;text-align:center">${a.minorTotal || 0}</td>
            <td style="padding:6px 8px;text-align:center">${a.minorRT || 0}</td>
            <td style="padding:6px 8px;text-align:center">${a.rtReduction || 0}</td>
            <td style="padding:6px 8px;text-align:center;font-weight:600">${a.minorAdjusted || a.minorTotal || 0}</td>
        </tr>`;
    }

    return `
        <h4 style="margin:0 0 8px;color:var(--primary)">Right-Turn Adjustment Details</h4>

        <table style="width:100%;border-collapse:collapse;font-size:.85rem;margin-bottom:16px">
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px"><strong>Method</strong></td><td style="padding:8px;text-align:right">${rtMethod}</td></tr>
            <tr><td style="padding:8px"><strong>Pagones Config</strong></td><td style="padding:8px;text-align:right">${cfg.pagonesConfig || 'sharedLane'}</td></tr>
        </table>

        <div style="overflow-x:auto;max-height:400px;overflow-y:auto;border:1px solid var(--border);border-radius:8px">
            <table style="width:100%;border-collapse:collapse;font-size:.8rem">
                <thead style="position:sticky;top:0;background:white">
                    <tr style="background:var(--bg-secondary);border-bottom:1px solid var(--border)">
                        <th style="padding:8px">Hour</th>
                        <th style="padding:8px">Minor Raw</th>
                        <th style="padding:8px">RT Volume</th>
                        <th style="padding:8px">Reduction</th>
                        <th style="padding:8px">Adjusted</th>
                    </tr>
                </thead>
                <tbody>${rows || '<tr><td colspan="5" style="padding:12px;text-align:center;color:var(--text-secondary)">No data</td></tr>'}</tbody>
            </table>
        </div>
    `;
}

/**
 * Switch between result tabs
 */
function signal_switchResultTab(tabId) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.signal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.signal-tab-content').forEach(c => c.classList.remove('active'));

    // Add active class to selected tab and content
    const tab = document.querySelector(`.signal-tab[data-tab="${tabId}"]`);
    const content = document.getElementById(`signalResult-${tabId}`);
    if (tab) tab.classList.add('active');
    if (content) content.classList.add('active');
}

/**
 * Render the multi-day breakdown table
 */
function signal_renderMultiDayTable(results) {
    const table = document.getElementById('signalMultiDayTable');
    const multiDay = warrantsState.signal.multiDayData || {};
    const dayKeys = Object.keys(multiDay);

    if (!table || dayKeys.length === 0) {
        if (table) table.innerHTML = '<tbody><tr><td colspan="7" style="padding:20px;text-align:center;color:#64748b">No individual day data available.</td></tr></tbody>';
        return;
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Calculate volumes for each day
    let totalVolume = 0;
    const dayData = [];

    for (const key of dayKeys) {
        const day = multiDay[key];
        let dayVol = 0;

        // Sum all hourly volumes for this day
        for (const hour in day.hourlyData) {
            for (const approach of ['NB', 'SB', 'EB', 'WB']) {
                const data = day.hourlyData[hour]?.[approach] || {};
                dayVol += (data.L || 0) + (data.T || 0) + (data.R || 0) + (data.U || 0) + (data.total || 0);
            }
        }

        const isWeekend = day.dow === 0 || day.dow === 6;
        dayData.push({
            key,
            date: day.date || key,
            dayName: dayNames[day.dow] || 'Unknown',
            dow: day.dow,
            volume: dayVol,
            isWeekend
        });
        totalVolume += dayVol;
    }

    const mean = dayData.length > 0 ? Math.round(totalVolume / dayData.length) : 0;

    let html = `
        <thead><tr>
            <th class="day-name">Day</th>
            <th>Date</th>
            <th>Type</th>
            <th>Volume</th>
            <th>Dev.</th>
            <th>W1</th>
            <th>W2</th>
            <th>W3</th>
        </tr></thead>
        <tbody>
    `;

    for (const d of dayData) {
        const dev = mean > 0 ? ((d.volume - mean) / mean * 100).toFixed(1) : 0;
        const dayType = d.isWeekend ? 'weekend' : 'weekday';

        html += `<tr class="${d.isWeekend ? 'weekend-row' : ''}">
            <td class="day-name">${d.dayName}</td>
            <td>${d.date}</td>
            <td><span class="signal-day-badge ${dayType}">${dayType}</span></td>
            <td>${d.volume.toLocaleString()}</td>
            <td>${dev > 0 ? '+' : ''}${dev}%</td>
            <td><span class="status-icon not-met">—</span></td>
            <td><span class="status-icon not-met">—</span></td>
            <td><span class="status-icon not-met">—</span></td>
        </tr>`;
    }

    // Add average row
    html += `<tr class="average-row">
        <td class="day-name">📊 AVERAGE</td>
        <td>(${dayData.length} days)</td>
        <td>Primary</td>
        <td>${mean.toLocaleString()}</td>
        <td>—</td>
        <td><span class="status-icon ${results?.warrant1?.met ? 'met' : 'not-met'}">${results?.warrant1?.met ? '✓' : '✗'}</span></td>
        <td><span class="status-icon ${results?.warrant2?.met ? 'met' : 'not-met'}">${results?.warrant2?.met ? '✓' : '✗'}</span></td>
        <td><span class="status-icon ${results?.warrant3?.met ? 'met' : 'not-met'}">${results?.warrant3?.met ? '✓' : '✗'}</span></td>
    </tr>`;

    html += '</tbody>';
    table.innerHTML = html;
}

/**
 * Render hourly TMC data summary
 */
function signal_renderHourlyTMC(results) {
    const tbody = document.getElementById('signalHourlyTableBody');
    const summaryBody = document.getElementById('signalSummaryTableBody');

    if (!results?.hourlyAggregates) {
        const noData = '<tr><td colspan="5" style="padding:20px;text-align:center;color:#64748b">No data</td></tr>';
        if (tbody) tbody.innerHTML = noData;
        if (summaryBody) summaryBody.innerHTML = noData;
        return;
    }

    const hourlyData = results.hourlyAggregates;
    const config = warrantsState.signal.config || {};
    const majorDir = config.majorDirection || 'EW';
    const isMajorEW = majorDir === 'EW';

    let html = '';

    // Generate rows for hours 6-22 (typical analysis period)
    for (let hour = 6; hour <= 22; hour++) {
        const hd = hourlyData[hour];
        if (!hd) continue;

        // Calculate major and minor volumes
        let major = 0, minorRaw = 0, minorAdj = 0;
        for (const approach of ['NB', 'SB', 'EB', 'WB']) {
            const data = hd[approach] || {};
            const vol = (data.L || 0) + (data.T || 0) + (data.R || 0) + (data.U || 0) + (data.total || 0);
            const isMajor = (isMajorEW && (approach === 'EB' || approach === 'WB')) ||
                           (!isMajorEW && (approach === 'NB' || approach === 'SB'));
            if (isMajor) {
                major += vol;
            } else {
                minorRaw += vol;
                minorAdj += data.adjusted || vol;
            }
        }

        const total = major + minorAdj;
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;

        html += `<tr>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:left">${timeStr}</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">${major.toLocaleString()}</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">${minorRaw.toLocaleString()}</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">${minorAdj.toLocaleString()}</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:500">${total.toLocaleString()}</td>
        </tr>`;
    }

    if (!html) {
        html = '<tr><td colspan="5" style="padding:20px;text-align:center;color:#64748b">No hourly data available</td></tr>';
    }

    if (tbody) tbody.innerHTML = html;
    if (summaryBody) summaryBody.innerHTML = html;
}

/**
 * Render RT Adjustment tab content
 */
function signal_renderRTAdjustment(results) {
    const container = document.getElementById('signalResult-rt');
    if (!container) return;

    const config = warrantsState.signal.config || {};
    const rtMethod = config.rtAdjustmentMethod || 'pagones';
    const pagonesConfig = config.pagonesConfig || 'sharedLane';

    let html = `
        <h4 style="margin-bottom:12px;color:#475569">Right-Turn Adjustment Details</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
            <div style="padding:12px;background:#f8fafc;border-radius:8px">
                <div style="font-size:.8rem;color:#64748b">Method</div>
                <div style="font-weight:600;color:#1e293b">${rtMethod}</div>
            </div>
            <div style="padding:12px;background:#f8fafc;border-radius:8px">
                <div style="font-size:.8rem;color:#64748b">Pagones Config</div>
                <div style="font-weight:600;color:#1e293b">${pagonesConfig}</div>
            </div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:.85rem">
            <thead><tr>
                <th style="padding:10px;border-bottom:2px solid #e2e8f0;text-align:left">Hour</th>
                <th style="padding:10px;border-bottom:2px solid #e2e8f0;text-align:right">Minor Raw</th>
                <th style="padding:10px;border-bottom:2px solid #e2e8f0;text-align:right">RT Volume</th>
                <th style="padding:10px;border-bottom:2px solid #e2e8f0;text-align:right">Reduction</th>
                <th style="padding:10px;border-bottom:2px solid #e2e8f0;text-align:right">Adjusted</th>
            </tr></thead>
            <tbody id="signalRTTableBody">
    `;

    if (results?.hourlyAggregates) {
        const hourlyData = results.hourlyAggregates;
        const majorDir = config.majorDirection || 'EW';
        const isMajorEW = majorDir === 'EW';

        for (let hour = 6; hour <= 22; hour++) {
            const hd = hourlyData[hour];
            if (!hd) continue;

            let minorRaw = 0, rtVol = 0, adjusted = 0;
            for (const approach of ['NB', 'SB', 'EB', 'WB']) {
                const data = hd[approach] || {};
                const isMinor = (isMajorEW && (approach === 'NB' || approach === 'SB')) ||
                               (!isMajorEW && (approach === 'EB' || approach === 'WB'));
                if (isMinor) {
                    const vol = (data.L || 0) + (data.T || 0) + (data.R || 0) + (data.U || 0) + (data.total || 0);
                    minorRaw += vol;
                    rtVol += data.R || 0;
                    adjusted += data.adjusted || vol;
                }
            }

            const reduction = minorRaw - adjusted;
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;

            html += `<tr>
                <td style="padding:10px;border-bottom:1px solid #e2e8f0">${timeStr}</td>
                <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">${minorRaw.toLocaleString()}</td>
                <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">${rtVol.toLocaleString()}</td>
                <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;color:#ef4444">-${reduction.toLocaleString()}</td>
                <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:500">${adjusted.toLocaleString()}</td>
            </tr>`;
        }
    } else {
        html += '<tr><td colspan="5" style="padding:20px;text-align:center;color:#64748b">No data</td></tr>';
    }

    html += '</tbody></table>';
    container.innerHTML = html;
}

/**
 * Add a new TMC day entry
 */
function signal_addDay(dayKey, date, hourlyData = {}, dow = null) {
    // Use provided dow, or calculate from date, or default to Tuesday (2)
    const dayOfWeek = dow !== null ? dow : (date ? new Date(date).getDay() : 2);
    warrantsState.signal.multiDayData[dayKey] = {
        date: date || '',
        dow: dayOfWeek,
        hourlyData: hourlyData
    };
    signal_renderDayCards();
    console.log('[Signal] Day added:', dayKey);
}

/**
 * Remove a TMC day entry
 */
function signal_removeDay(dayKey) {
    delete warrantsState.signal.multiDayData[dayKey];
    signal_renderDayCards();
    console.log('[Signal] Day removed:', dayKey);
}

/**
 * Clear all TMC day entries
 */
function signal_clearAllDays() {
    if (!confirm('Are you sure you want to clear all count days?')) return;

    // Initialize state if needed
    warrantsState.signal = warrantsState.signal || {};
    warrantsState.signal.multiDayData = {};

    signal_renderDayCards();

    // Sync with IndexedDB
    if (typeof warrantDbTriggerAutoSave === 'function') {
        warrantDbTriggerAutoSave('signal');
    }

    console.log('[Signal] All days cleared');
}

/**
 * Calculate total volume for a day (including U-turn)
 */
function signal_calculateDayTotal(hourlyData) {
    let total = 0;
    const allMovements = ['L', 'T', 'R', 'U']; // Include U-turn
    for (let hour = 0; hour < 24; hour++) {
        const hourData = hourlyData?.[hour];
        if (!hourData) continue;
        for (const approach of SIGNAL_TMC_APPROACHES) {
            for (const mov of allMovements) {
                total += hourData[approach]?.[mov] || 0;
            }
        }
    }
    return total;
}

/**
 * Open TMC grid editor for a day
 */
function signal_editDay(dayKey) {
    const modal = document.getElementById('signalTMCModal');
    if (!modal) return;

    const day = warrantsState.signal.multiDayData[dayKey];
    if (!day) return;

    // Populate modal with day data
    document.getElementById('signalTMCModalTitle').textContent = `Edit TMC Data: ${day.date || dayKey}`;
    signal_renderTMCGrid(dayKey, day.hourlyData);

    modal.style.display = 'flex';
}

/**
 * Render TMC grid in modal (with U-turn support)
 */
function signal_renderTMCGrid(dayKey, hourlyData) {
    const container = document.getElementById('signalTMCGridContainer');
    if (!container) return;

    const majorDir = warrantsState.signal.config.majorDirection;
    const countType = warrantsState.signal.config.countType;
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;
    const uturnSelection = warrantsState.signal.config.uturnSelection || 'none';
    const isMajorEW = majorDir === 'EW';

    // Determine which approaches get U-turn columns
    const hasUTurn = {
        NB: (uturnSelection === 'minor' && isMajorEW) || (uturnSelection === 'major' && !isMajorEW),
        SB: (uturnSelection === 'minor' && isMajorEW) || (uturnSelection === 'major' && !isMajorEW),
        EB: (uturnSelection === 'major' && isMajorEW) || (uturnSelection === 'minor' && !isMajorEW),
        WB: (uturnSelection === 'major' && isMajorEW) || (uturnSelection === 'minor' && !isMajorEW)
    };

    // Build grid header
    let html = `
        <input type="hidden" id="signalTMCEditingDay" value="${dayKey}">
        <div style="overflow-x:auto">
        <table class="signal-tmc-table" style="width:100%;font-size:.75rem;border-collapse:collapse">
        <thead>
            <tr style="background:var(--bg-secondary)">
                <th style="padding:.5rem;border:1px solid var(--border)">Hour</th>
    `;

    // Column headers for each approach and movement
    for (const approach of SIGNAL_TMC_APPROACHES) {
        const isMajor = (majorDir === 'EW' && (approach === 'EB' || approach === 'WB')) ||
                        (majorDir === 'NS' && (approach === 'NB' || approach === 'SB'));
        const bgColor = isMajor ? 'rgba(59,130,246,.1)' : 'rgba(168,85,247,.1)';
        const colspan = hasUTurn[approach] ? 4 : 3; // L, T, R, [U]
        html += `<th colspan="${colspan}" style="padding:.5rem;border:1px solid var(--border);background:${bgColor}">${approach}</th>`;
    }
    html += `<th style="padding:.5rem;border:1px solid var(--border)">Total</th></tr>`;

    // Movement sub-headers
    html += `<tr style="background:var(--bg-secondary)"><th></th>`;
    for (const approach of SIGNAL_TMC_APPROACHES) {
        for (const mov of SIGNAL_TMC_MOVEMENTS) {
            html += `<th style="padding:.25rem;border:1px solid var(--border);font-size:.7rem">${mov}</th>`;
        }
        if (hasUTurn[approach]) {
            html += `<th style="padding:.25rem;border:1px solid var(--border);font-size:.7rem;background:#fef3c7;color:#92400e">U</th>`;
        }
    }
    html += `<th></th></tr></thead><tbody>`;

    // Data rows
    for (let hour = startHour; hour < endHour; hour++) {
        const hourData = hourlyData?.[hour] || {};
        let rowTotal = 0;

        html += `<tr><td style="padding:.5rem;border:1px solid var(--border);font-weight:600">${String(hour).padStart(2,'0')}:00</td>`;

        for (const approach of SIGNAL_TMC_APPROACHES) {
            // Standard movements (L, T, R)
            for (const mov of SIGNAL_TMC_MOVEMENTS) {
                const val = hourData[approach]?.[mov] || 0;
                rowTotal += val;
                html += `<td style="border:1px solid var(--border);padding:0">
                    <input type="number" min="0" value="${val}"
                           id="tmc_${hour}_${approach}_${mov}"
                           class="signal-tmc-input"
                           style="width:100%;padding:.25rem;border:none;text-align:center;font-size:.75rem"
                           onchange="signal_onTMCInput(${hour},'${approach}','${mov}',this.value)">
                </td>`;
            }
            // U-turn column if applicable
            if (hasUTurn[approach]) {
                const uVal = hourData[approach]?.U || 0;
                rowTotal += uVal;
                html += `<td style="border:1px solid var(--border);padding:0;background:#fffbeb">
                    <input type="number" min="0" value="${uVal}"
                           id="tmc_${hour}_${approach}_U"
                           class="signal-tmc-input"
                           style="width:100%;padding:.25rem;border:none;text-align:center;font-size:.75rem;background:#fffbeb"
                           onchange="signal_onTMCInput(${hour},'${approach}','U',this.value)">
                </td>`;
            }
        }

        html += `<td style="padding:.5rem;border:1px solid var(--border);font-weight:600;text-align:right" id="tmcRowTotal_${hour}">${rowTotal}</td></tr>`;
    }

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

/**
 * Handle TMC input change
 */
function signal_onTMCInput(hour, approach, movement, value) {
    const dayKey = document.getElementById('signalTMCEditingDay')?.value;
    if (!dayKey) return;

    const val = parseInt(value) || 0;

    // Ensure structure exists
    if (!warrantsState.signal.multiDayData[dayKey].hourlyData[hour]) {
        warrantsState.signal.multiDayData[dayKey].hourlyData[hour] = {};
    }
    if (!warrantsState.signal.multiDayData[dayKey].hourlyData[hour][approach]) {
        warrantsState.signal.multiDayData[dayKey].hourlyData[hour][approach] = { L: 0, T: 0, R: 0, U: 0 };
    }

    warrantsState.signal.multiDayData[dayKey].hourlyData[hour][approach][movement] = val;

    // Update row total in modal
    signal_updateModalRowTotal(hour);
}

/**
 * Update row total in TMC modal grid (including U-turn)
 */
function signal_updateModalRowTotal(hour) {
    const dayKey = document.getElementById('signalTMCEditingDay')?.value;
    if (!dayKey) return;

    const hourData = warrantsState.signal.multiDayData[dayKey].hourlyData[hour] || {};
    let total = 0;
    const allMovements = ['L', 'T', 'R', 'U']; // Include U-turn

    for (const approach of SIGNAL_TMC_APPROACHES) {
        for (const mov of allMovements) {
            total += hourData[approach]?.[mov] || 0;
        }
    }

    const el = document.getElementById(`tmcRowTotal_${hour}`);
    if (el) el.textContent = total;
}

/**
 * Save TMC modal data and close
 */
function signal_saveTMCModal() {
    signal_renderDayCards();
    document.getElementById('signalTMCModal').style.display = 'none';
    showToast('TMC data saved', 'success');
}

/**
 * Close TMC modal without saving
 */
function signal_closeTMCModal() {
    document.getElementById('signalTMCModal').style.display = 'none';
}

/**
 * Update config from UI elements
 */
function signal_updateConfigFromUI() {
    const cfg = warrantsState.signal.config;

    cfg.intersectionName = document.getElementById('signalIntersectionName')?.value || '';
    cfg.majorStreet = document.getElementById('signalMajorStreet')?.value || '';
    cfg.minorStreet = document.getElementById('signalMinorStreet')?.value || '';
    cfg.majorLanes = parseInt(document.getElementById('signalMajorLanes')?.value) || 2;
    cfg.minorLanes = parseInt(document.getElementById('signalMinorLanes')?.value) || 1;
    cfg.majorDirection = document.getElementById('signalMajorDirection')?.value || 'EW';
    cfg.uturnSelection = document.getElementById('signalUTurnSelection')?.value || 'none';
    cfg.intersectionLegs = parseInt(document.getElementById('signalIntersectionLegs')?.value) || 4;
    cfg.speedLimit = parseInt(document.getElementById('signalSpeedLimit')?.value) || 35;
    cfg.communityPop = parseInt(document.getElementById('signalCommunityPop')?.value) || 50000;
    cfg.apply70pct = document.getElementById('signalApply70pct')?.checked || false;
    cfg.countType = document.getElementById('signalCountType')?.value || '12hr';

    // RT adjustment
    warrantsState.signal.rtAdjustment.method = document.getElementById('signalRTMethod')?.value || 'pagones';
    warrantsState.signal.rtAdjustment.fixedPercent = parseInt(document.getElementById('signalRTFixedPct')?.value) || 30;
    warrantsState.signal.rtAdjustment.pagonesConfig = document.getElementById('signalPagonesConfig')?.value || 'sharedLane';

    // Virginia mode
    warrantsState.signal.virginiaMode = document.getElementById('signalVirginiaMode')?.checked
        ?? (typeof _getActiveStateKey === 'function' && _getActiveStateKey() === 'virginia');

    // Averaging method
    warrantsState.signal.averagingMethod = document.getElementById('signalAveragingMethod')?.value || 'tue-wed-thu';

    console.log('[Signal] Config updated:', cfg);
}

/**
 * Populate UI from config
 */
function signal_populateUIFromConfig() {
    const cfg = warrantsState.signal.config;

    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    const setChecked = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };

    setVal('signalIntersectionName', cfg.intersectionName);
    setVal('signalMajorStreet', cfg.majorStreet);
    setVal('signalMinorStreet', cfg.minorStreet);
    setVal('signalMajorLanes', cfg.majorLanes);
    setVal('signalMinorLanes', cfg.minorLanes);
    setVal('signalMajorDirection', cfg.majorDirection);
    setVal('signalUTurnSelection', cfg.uturnSelection || 'none');
    setVal('signalIntersectionLegs', cfg.intersectionLegs);
    setVal('signalSpeedLimit', cfg.speedLimit);
    setVal('signalCommunityPop', cfg.communityPop);
    setChecked('signalApply70pct', cfg.apply70pct);
    setVal('signalCountType', cfg.countType);

    setVal('signalRTMethod', warrantsState.signal.rtAdjustment.method);
    setVal('signalRTFixedPct', warrantsState.signal.rtAdjustment.fixedPercent);
    setVal('signalPagonesConfig', warrantsState.signal.rtAdjustment.pagonesConfig);

    setChecked('signalVirginiaMode', warrantsState.signal.virginiaMode);
    setVal('signalAveragingMethod', warrantsState.signal.averagingMethod);

    // Populate intersection name from selected location if available (use displayName for cross-streets)
    if (warrantsState.selectedLocation && !cfg.intersectionName) {
        const el = document.getElementById('signalIntersectionName');
        const displayName = warrantsState.displayName || formatRouteName(warrantsState.selectedLocation);
        if (el) el.value = displayName;
        cfg.intersectionName = displayName;
    }
}

/**
 * Initialize signal warrant UI when tab is shown
 */
function signal_onTabShow() {
    // Initialize state if needed
    if (!warrantsState.signal || !warrantsState.signal.config) {
        signal_initState();

        // First try to load from IndexedDB, fall back to localStorage
        warrantDbRestoreSignal().then(loaded => {
            if (loaded) {
                console.log('[Signal] Restored saved data from IndexedDB');
                signal_populateUIFromConfig();
                signal_renderDayCards();
            } else {
                // Fall back to localStorage
                const localLoaded = signal_loadSavedData();
                if (localLoaded) {
                    console.log('[Signal] Restored saved data from localStorage');
                }
            }
        }).catch(() => {
            // Fall back to localStorage on error
            signal_loadSavedData();
        });
    }

    // Populate UI from current config
    signal_populateUIFromConfig();

    // Auto-populate Warrant 7 from crash data
    signal_autoPopulateWarrant7();

    // Render day cards
    signal_renderDayCards();

    console.log('[Signal] Tab shown, state:', warrantsState.signal);
}

/**
 * Generate professional PDF report for Signal Warrant Analysis
 */
async function signal_generatePDFReport() {
    const results = warrantsState.signal.analysisResults;
    if (!results) {
        showToast('Please run analysis first before exporting PDF', 'warning');
        return;
    }

    showLoading('Generating PDF report with location map...');

    try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'letter');
    const cfg = warrantsState.signal.config;

    // Colors
    const primaryColor = [34, 197, 94]; // Green
    const headerBg = [45, 55, 72];

    // Page 1: Summary
    let yPos = 15;

    // Header
    doc.setFillColor(...headerBg);
    doc.rect(0, 0, 220, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Signal Warrant Analysis Report', 15, 17);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('MUTCD 11th Edition' + (warrantsState.signal.virginiaMode ? ' - Virginia Supplement' : ''), 170, 17);

    yPos = 35;
    doc.setTextColor(0, 0, 0);

    // Intersection Info Box
    doc.setFillColor(245, 245, 245);
    doc.rect(15, yPos, 180, 35, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, yPos, 180, 35, 'S');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(cfg.intersectionName || 'Unnamed Intersection', 20, yPos + 8);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Major Street: ${cfg.majorStreet || 'N/A'}`, 20, yPos + 16);
    doc.text(`Minor Street: ${cfg.minorStreet || 'N/A'}`, 100, yPos + 16);
    doc.text(`Lane Config: ${results.laneConfig}`, 20, yPos + 24);
    doc.text(`Reduction Factor: ${results.reduction}`, 100, yPos + 24);
    doc.text(`Intersection Type: ${cfg.intersectionLegs}-leg`, 20, yPos + 32);
    doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`, 100, yPos + 32);

    yPos += 45;

    // Add Static Location Map (if crash data available with coordinates)
    const mapCrashes = (warrantsState.filteredCrashes || warrantsState.locationCrashes || [])
        .filter(c => c[COL.Y] && c[COL.X])
        .map(c => ({
            lat: parseFloat(c[COL.Y]),
            lng: parseFloat(c[COL.X]),
            sev: (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase()
        }))
        .filter(c => !isNaN(c.lat) && !isNaN(c.lng));

    if (mapCrashes.length > 0) {
        const mapAdded = await addStaticMapToPDF(doc, {
            crashes: mapCrashes,
            style: 'streets',
            showMarkers: true,
            maxMarkers: 50
        }, 15, yPos, 85, 55);

        if (mapAdded) {
            // Add map legend beside the map
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('Location Map', 105, yPos + 5);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text(`${mapCrashes.length} crash${mapCrashes.length !== 1 ? 'es' : ''} shown`, 105, yPos + 12);

            // Severity legend
            doc.setFillColor(220, 38, 38);
            doc.circle(108, yPos + 18, 2, 'F');
            doc.text('Fatal (K)', 112, yPos + 19);

            doc.setFillColor(249, 115, 22);
            doc.circle(108, yPos + 24, 2, 'F');
            doc.text('Serious (A)', 112, yPos + 25);

            doc.setFillColor(234, 179, 8);
            doc.circle(108, yPos + 30, 2, 'F');
            doc.text('Minor (B)', 112, yPos + 31);

            doc.setFillColor(34, 197, 94);
            doc.circle(108, yPos + 36, 2, 'F');
            doc.text('Possible (C)', 112, yPos + 37);

            doc.setFillColor(59, 130, 246);
            doc.circle(108, yPos + 42, 2, 'F');
            doc.text('PDO (O)', 112, yPos + 43);

            yPos += 62;
        }
    }

    // Warrant Summary Cards
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('WARRANT EVALUATION SUMMARY', 15, yPos);
    yPos += 8;

    const warrantSummary = [
        { num: 1, name: 'Eight-Hour Volume', met: results.warrant1?.met, detail: `Cond A: ${results.warrant1?.conditionA?.hoursMet}/8, Cond B: ${results.warrant1?.conditionB?.hoursMet}/8` },
        { num: 2, name: 'Four-Hour Volume', met: results.warrant2?.met, detail: `${results.warrant2?.hoursMet}/4 hours met` },
        { num: 3, name: 'Peak Hour', met: results.warrant3?.met, detail: `Peak @ ${String(results.warrant3?.peakHour || 0).padStart(2, '0')}:00` }
    ];

    // Add Warrant 4 if enabled
    if (results.warrant4?.enabled) {
        warrantSummary.push({
            num: 4,
            name: 'Pedestrian Volume',
            met: results.warrant4.met,
            detail: `Fig ${results.warrant4.figureName}: ${results.warrant4.hoursMet}/${results.warrant4.hoursRequired} hrs`
        });
    }

    // Add Warrant 5 if enabled
    if (results.warrant5?.enabled) {
        warrantSummary.push({
            num: 5,
            name: 'School Crossing',
            met: results.warrant5.met,
            detail: `${results.warrant5.schoolchildren} students, ${results.warrant5.adequateGaps} gaps`
        });
    }

    // Add Warrant 7
    warrantSummary.push({
        num: 7,
        name: 'Crash Experience',
        met: results.warrant7?.met,
        detail: `${results.warrant7?.crashCriterion?.totalSusceptible || 0} susceptible crashes`
    });

    doc.autoTable({
        startY: yPos,
        head: [['Warrant', 'Description', 'Status', 'Details']],
        body: warrantSummary.map(w => [
            `Warrant ${w.num}`,
            w.name,
            w.met ? 'MET' : 'NOT MET',
            w.detail
        ]),
        theme: 'striped',
        headStyles: { fillColor: primaryColor, fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 45 },
            2: { cellWidth: 25 },
            3: { cellWidth: 85 }
        },
        didParseCell: function(data) {
            if (data.column.index === 2 && data.section === 'body') {
                if (data.cell.text[0] === 'MET') {
                    data.cell.styles.textColor = [34, 197, 94];
                    data.cell.styles.fontStyle = 'bold';
                } else {
                    data.cell.styles.textColor = [220, 38, 38];
                }
            }
        },
        margin: { left: 15, right: 15 }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Overall Decision
    const warrantsMet = results.warrantsMet || 0;
    doc.setFillColor(warrantsMet > 0 ? 34 : 220, warrantsMet > 0 ? 197 : 38, warrantsMet > 0 ? 94 : 38);
    doc.rect(15, yPos, 180, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(warrantsMet > 0 ? `${warrantsMet} WARRANT(S) MET - Signal May Be Justified` : 'NO WARRANTS MET', 105, yPos + 10, { align: 'center' });

    yPos += 25;
    doc.setTextColor(0, 0, 0);

    // Warrant 4: Pedestrian Volume Section (if enabled)
    if (results.warrant4?.enabled) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('PEDESTRIAN VOLUME (Warrant 4)', 15, yPos);
        yPos += 8;

        const w4Body = results.warrant4.hourlyResults?.map(hr => [
            `Hour ${hr.hour}`,
            `${hr.majorVol} vph`,
            `${hr.pedVol} ped/hr`,
            isFinite(hr.threshold) ? `${hr.threshold} ped/hr` : 'N/A',
            hr.met ? 'ABOVE' : 'Below'
        ]) || [];

        doc.autoTable({
            startY: yPos,
            head: [['Hour', 'Major St Vol', 'Pedestrians', 'Threshold', 'Status']],
            body: w4Body,
            theme: 'striped',
            headStyles: { fillColor: [245, 158, 11], fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            margin: { left: 15, right: 15 },
            didParseCell: function(data) {
                if (data.column.index === 4 && data.section === 'body') {
                    data.cell.styles.textColor = data.cell.text[0] === 'ABOVE' ? [34, 197, 94] : [220, 38, 38];
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });

        yPos = doc.lastAutoTable.finalY + 10;
    }

    // Warrant 5: School Crossing Section (if enabled)
    if (results.warrant5?.enabled) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('SCHOOL CROSSING (Warrant 5)', 15, yPos);
        yPos += 8;

        doc.autoTable({
            startY: yPos,
            head: [['Condition', 'Value', 'Requirement', 'Status']],
            body: [
                ['Schoolchildren Count', results.warrant5.schoolchildren, `>= ${results.warrant5.minRequired}`, results.warrant5.conditionA ? 'MET' : 'NOT MET'],
                ['Adequate Gaps', results.warrant5.adequateGaps, `< ${results.warrant5.minutes} min`, results.warrant5.conditionB ? 'MET' : 'NOT MET'],
                ['Gap Study Completed', results.warrant5.gapStudyDone ? 'Yes' : 'No', 'Required', results.warrant5.conditionC ? 'MET' : 'NOT MET']
            ],
            theme: 'striped',
            headStyles: { fillColor: [34, 197, 94], fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            margin: { left: 15, right: 15 },
            didParseCell: function(data) {
                if (data.column.index === 3 && data.section === 'body') {
                    data.cell.styles.textColor = data.cell.text[0] === 'MET' ? [34, 197, 94] : [220, 38, 38];
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });

        yPos = doc.lastAutoTable.finalY + 10;
    }

    // Crash Data Section (Warrant 7)
    if (results.warrant7 && results.warrant7.autoPopulated) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('CRASH DATA (Warrant 7 - Auto-populated from CrashLens)', 15, yPos);
        yPos += 8;

        const w7 = results.warrant7.crashCriterion;
        doc.autoTable({
            startY: yPos,
            head: [['Crash Type', 'Total', 'Injury (K/A/B)', 'Threshold']],
            body: [
                ['Angle Crashes', warrantsState.signal.warrant7.angleCrashesTotal, warrantsState.signal.warrant7.angleCrashesInjury, `${w7.thresholds.total} total`],
                ['Pedestrian Crashes', warrantsState.signal.warrant7.pedCrashesTotal, warrantsState.signal.warrant7.pedCrashesInjury, `${w7.thresholds.injury} injury`],
                ['Alternatives Tried', warrantsState.signal.warrant7.alternativesTried ? 'Yes' : 'No', '-', results.warrant7.alternativesTried ? 'MET' : 'NOT MET']
            ],
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            margin: { left: 15, right: 15 }
        });

        yPos = doc.lastAutoTable.finalY + 10;
    }

    // Footer for Page 1
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated by ${getReportAttribution()} - Signal Warrant Analyzer | ${new Date().toLocaleString()}`, 105, 270, { align: 'center' });
    doc.text('Page 1', 195, 270);

    // ============================================
    // APPENDIX A: Detailed Calculations
    // ============================================
    doc.addPage();
    yPos = 15;

    // Appendix Header
    doc.setFillColor(...headerBg);
    doc.rect(0, 0, 220, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('APPENDIX A: Detailed Warrant Calculations', 15, 14);

    yPos = 30;
    doc.setTextColor(0, 0, 0);

    // Hourly Volume Data with Thresholds
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Hourly Volume Analysis', 15, yPos);
    yPos += 6;

    const hourlyBody = [];
    if (results.warrant2?.hourlyResults) {
        results.warrant2.hourlyResults.forEach(h => {
            const w1 = results.warrant1?.hourlyResults?.find(r => r.hour === h.hour);
            hourlyBody.push([
                `${String(h.hour).padStart(2, '0')}:00`,
                h.major.toString(),
                h.minor.toString(),
                (h.major + h.minor).toString(),
                w1?.thresholdA?.major || '-',
                w1?.thresholdA?.minor || '-',
                w1?.meetsA ? 'Yes' : 'No',
                h.threshold.toString(),
                h.meets ? 'Yes' : 'No'
            ]);
        });
    }

    doc.autoTable({
        startY: yPos,
        head: [['Hour', 'Major', 'Minor', 'Total', 'W1-A Maj', 'W1-A Min', 'W1-A', 'W2 Thr', 'W2']],
        body: hourlyBody,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246], fontSize: 7 },
        bodyStyles: { fontSize: 7 },
        columnStyles: {
            0: { cellWidth: 18 },
            1: { cellWidth: 18 },
            2: { cellWidth: 18 },
            3: { cellWidth: 18 },
            4: { cellWidth: 22 },
            5: { cellWidth: 22 },
            6: { cellWidth: 15 },
            7: { cellWidth: 22 },
            8: { cellWidth: 15 }
        },
        margin: { left: 15, right: 15 },
        didParseCell: function(data) {
            if ((data.column.index === 6 || data.column.index === 8) && data.section === 'body') {
                data.cell.styles.textColor = data.cell.text[0] === 'Yes' ? [34, 197, 94] : [220, 38, 38];
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });

    yPos = doc.lastAutoTable.finalY + 12;

    // Right-Turn Adjustment Details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Right-Turn Adjustment Calculation', 15, yPos);
    yPos += 6;

    const rtMethod = cfg.rtAdjustmentMethod || 'pagones';
    const rtFactor = signal_getReductionFactor();

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Method: ${rtMethod === 'pagones' ? 'Pagones Theorem' : rtMethod === 'ohio' ? 'Ohio DOT' : 'None'}`, 20, yPos);
    yPos += 5;
    doc.text(`Reduction Factor Applied: ${rtFactor}`, 20, yPos);
    yPos += 5;
    doc.text(`Lane Configuration: ${results.laneConfig}`, 20, yPos);
    yPos += 10;

    // Warrant Threshold Reference
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Warrant Threshold Reference (MUTCD)', 15, yPos);
    yPos += 6;

    doc.autoTable({
        startY: yPos,
        head: [['Warrant', 'Condition', 'Major St Threshold', 'Minor St Threshold', 'Hours Required']],
        body: [
            ['Warrant 1', 'Condition A (70%)', `${Math.round(results.thresholds?.w1A?.major * 0.7) || 'N/A'} vph`, `${Math.round(results.thresholds?.w1A?.minor * 0.7) || 'N/A'} vph`, '8 of any 8'],
            ['Warrant 1', 'Condition B (70%)', `${Math.round(results.thresholds?.w1B?.major * 0.7) || 'N/A'} vph`, `${Math.round(results.thresholds?.w1B?.minor * 0.7) || 'N/A'} vph`, '8 of any 8'],
            ['Warrant 2', 'Four-Hour Volume', 'See Figure 4C-2', 'See Figure 4C-2', '4 of any 4'],
            ['Warrant 3', 'Peak Hour', 'See Figure 4C-3', 'See Figure 4C-3', '1 hour'],
            ['Warrant 7', 'Crash Experience', `${results.warrant7?.crashCriterion?.thresholds?.total || 5} total`, `${results.warrant7?.crashCriterion?.thresholds?.injury || 3} injury`, '12 or 36 months']
        ],
        theme: 'striped',
        headStyles: { fillColor: [107, 114, 128], fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 15, right: 15 }
    });

    yPos = doc.lastAutoTable.finalY + 12;

    // Average Day Counts if available
    if (warrantsState.signal.days && Object.keys(warrantsState.signal.days).length > 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Average Hourly Counts (All Days)', 15, yPos);
        yPos += 6;

        const avgBody = [];
        const avgData = results.averageHourlyVolumes || {};
        Object.keys(avgData).sort((a, b) => parseInt(a) - parseInt(b)).forEach(hour => {
            const h = avgData[hour];
            avgBody.push([
                `${String(hour).padStart(2, '0')}:00`,
                Math.round(h.majorRaw || 0).toString(),
                Math.round(h.minorRaw || 0).toString(),
                Math.round(h.minorAdj || 0).toString(),
                Math.round((h.majorRaw || 0) + (h.minorAdj || 0)).toString()
            ]);
        });

        if (avgBody.length > 0) {
            doc.autoTable({
                startY: yPos,
                head: [['Hour', 'Major Raw', 'Minor Raw', 'Minor Adj', 'Total']],
                body: avgBody,
                theme: 'striped',
                headStyles: { fillColor: [16, 185, 129], fontSize: 8 },
                bodyStyles: { fontSize: 8 },
                margin: { left: 15, right: 15 }
            });
        }
    }

    // Footer for Appendix
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated by ${getReportAttribution()} - Signal Warrant Analyzer | ${new Date().toLocaleString()}`, 105, 270, { align: 'center' });
    doc.text('Page 2 - Appendix A', 185, 270);

    // Save
    const filename = `Signal_Warrant_${(cfg.intersectionName || 'Analysis').replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    showToast('PDF report exported successfully', 'success');

    } catch (err) {
        console.error('[Signal PDF] Error generating report:', err);
        showToast('Error generating PDF report', 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Export Signal Warrant data to CSV
 */
function signal_exportCSV() {
    const results = warrantsState.signal.analysisResults;
    const cfg = warrantsState.signal.config;

    // Build CSV content
    let csv = 'Signal Warrant Analysis Export\n';
    csv += `Generated,${new Date().toISOString()}\n`;
    csv += `MUTCD Version,${warrantsState.signal.virginiaMode ? 'Virginia MUTCD 11.0' : 'MUTCD 11th Edition'}\n\n`;

    // Intersection Info
    csv += 'INTERSECTION INFORMATION\n';
    csv += `Intersection Name,${cfg.intersectionName}\n`;
    csv += `Major Street,${cfg.majorStreet}\n`;
    csv += `Minor Street,${cfg.minorStreet}\n`;
    csv += `Lane Configuration,${signal_getLaneConfig()}\n`;
    csv += `Intersection Legs,${cfg.intersectionLegs}\n`;
    csv += `Speed Limit (mph),${cfg.speedLimit}\n`;
    csv += `Community Population,${cfg.communityPop}\n`;
    csv += `Reduction Factor,${signal_getReductionFactor()}\n\n`;

    // Warrant Results
    if (results) {
        csv += 'WARRANT EVALUATION RESULTS\n';
        csv += 'Warrant,Description,Status,Hours Met,Threshold\n';
        csv += `1,Eight-Hour Volume (Cond A),${results.warrant1?.conditionA?.met ? 'MET' : 'NOT MET'},${results.warrant1?.conditionA?.hoursMet},8\n`;
        csv += `1,Eight-Hour Volume (Cond B),${results.warrant1?.conditionB?.met ? 'MET' : 'NOT MET'},${results.warrant1?.conditionB?.hoursMet},8\n`;
        csv += `2,Four-Hour Volume,${results.warrant2?.met ? 'MET' : 'NOT MET'},${results.warrant2?.hoursMet},4\n`;
        csv += `3,Peak Hour,${results.warrant3?.met ? 'MET' : 'NOT MET'},Peak @ ${results.warrant3?.peakHour || 'N/A'},1\n`;
        if (results.warrant4?.enabled) {
            csv += `4,Pedestrian Volume (Fig ${results.warrant4?.figureName || 'N/A'}),${results.warrant4?.met ? 'MET' : 'NOT MET'},${results.warrant4?.hoursMet},${results.warrant4?.hoursRequired}\n`;
        }
        if (results.warrant5?.enabled) {
            csv += `5,School Crossing,${results.warrant5?.met ? 'MET' : 'NOT MET'},${results.warrant5?.schoolchildren} students,${results.warrant5?.minRequired} min\n`;
        }
        csv += `7,Crash Experience,${results.warrant7?.met ? 'MET' : 'NOT MET'},${results.warrant7?.crashCriterion?.totalSusceptible} crashes,${results.warrant7?.crashCriterion?.thresholds?.total}\n\n`;

        // Hourly Data
        csv += 'HOURLY VOLUME DATA\n';
        csv += 'Hour,Major Volume,Minor Volume,W1 Cond A,W1 Cond B,W2 Threshold,W2 Met\n';
        if (results.warrant2?.hourlyResults) {
            results.warrant2.hourlyResults.forEach(h => {
                const w1 = results.warrant1?.hourlyResults?.find(r => r.hour === h.hour);
                csv += `${String(h.hour).padStart(2, '0')}:00,${h.major},${h.minor},${w1?.meetsA ? 'Yes' : 'No'},${w1?.meetsB ? 'Yes' : 'No'},${h.threshold},${h.meets ? 'Yes' : 'No'}\n`;
            });
        }
        csv += '\n';
    }

    // Warrant 4 Data (Pedestrian Volume)
    if (results?.warrant4?.enabled) {
        csv += '\nPEDESTRIAN VOLUME DATA (Warrant 4)\n';
        csv += `Analysis Type,${results.warrant4.analysisType === 'peakhour' ? 'Peak Hour' : '4-Hour'}\n`;
        csv += `Crossing Speed,${results.warrant4.crossingSpeed === 'slow' ? 'Slow (<3.5 ft/s)' : 'Normal (>=3.5 ft/s)'}\n`;
        csv += `Figure Used,${results.warrant4.figureName}\n`;
        csv += `70% Factor,${results.warrant4.use70 ? 'Applied' : 'Not Applied'}\n`;
        csv += `Min Threshold,${results.warrant4.minThreshold} ped/hr\n`;
        csv += '\nHour,Pedestrian Vol,Major St Vol,Threshold,Status\n';
        results.warrant4.hourlyResults?.forEach(hr => {
            csv += `${hr.hour},${hr.pedVol},${hr.majorVol},${isFinite(hr.threshold) ? hr.threshold : 'N/A'},${hr.met ? 'Above' : 'Below'}\n`;
        });
    }

    // Warrant 5 Data (School Crossing)
    if (results?.warrant5?.enabled) {
        csv += '\nSCHOOL CROSSING DATA (Warrant 5)\n';
        csv += 'Condition,Value,Required,Status\n';
        csv += `Schoolchildren Count,${results.warrant5.schoolchildren},${results.warrant5.minRequired},${results.warrant5.conditionA ? 'MET' : 'NOT MET'}\n`;
        csv += `Adequate Gaps,${results.warrant5.adequateGaps},< ${results.warrant5.minutes} min,${results.warrant5.conditionB ? 'MET' : 'NOT MET'}\n`;
        csv += `Gap Study Completed,${results.warrant5.gapStudyDone ? 'Yes' : 'No'},Required,${results.warrant5.conditionC ? 'MET' : 'NOT MET'}\n`;
    }

    // Crash Data (Warrant 7)
    csv += '\nCRASH DATA (Warrant 7)\n';
    csv += 'Type,Total,Injury (K/A/B)\n';
    csv += `Angle Crashes,${warrantsState.signal.warrant7.angleCrashesTotal},${warrantsState.signal.warrant7.angleCrashesInjury}\n`;
    csv += `Pedestrian Crashes,${warrantsState.signal.warrant7.pedCrashesTotal},${warrantsState.signal.warrant7.pedCrashesInjury}\n`;
    csv += `Analysis Period,${warrantsState.signal.warrant7.period === '3year' ? '36 months' : '12 months'}\n`;
    csv += `Alternatives Tried,${warrantsState.signal.warrant7.alternativesTried ? 'Yes' : 'No'}\n`;

    // Average Hourly Counts (if multiple days)
    if (results?.averageHourlyVolumes && Object.keys(results.averageHourlyVolumes).length > 0) {
        csv += '\nAVERAGE HOURLY COUNTS (All Days Combined)\n';
        csv += 'Hour,Major Raw (vph),Minor Raw (vph),Minor Adjusted (vph),Total (vph)\n';
        Object.keys(results.averageHourlyVolumes).sort((a, b) => parseInt(a) - parseInt(b)).forEach(hour => {
            const h = results.averageHourlyVolumes[hour];
            const majorRaw = Math.round(h.majorRaw || 0);
            const minorRaw = Math.round(h.minorRaw || 0);
            const minorAdj = Math.round(h.minorAdj || 0);
            const total = majorRaw + minorAdj;
            csv += `${String(hour).padStart(2, '0')}:00,${majorRaw},${minorRaw},${minorAdj},${total}\n`;
        });
    }

    // Individual Day Data Summary
    if (warrantsState.signal.days && Object.keys(warrantsState.signal.days).length > 0) {
        csv += '\nINDIVIDUAL DAY SUMMARY\n';
        csv += 'Day Key,Date,Day of Week,Type,Total Volume\n';
        Object.entries(warrantsState.signal.days).forEach(([key, day]) => {
            const dowNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const totalVol = Object.values(day.hourlyData || {}).reduce((sum, h) => {
                return sum + Object.values(h).reduce((hSum, approach) => {
                    return hSum + (approach.total || (approach.L || 0) + (approach.T || 0) + (approach.R || 0) + (approach.U || 0));
                }, 0);
            }, 0);
            csv += `${key},${day.date || 'N/A'},${dowNames[day.dow] || 'N/A'},${day.dow >= 1 && day.dow <= 5 ? 'Weekday' : 'Weekend'},${totalVol}\n`;
        });
    }

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Signal_Warrant_${(cfg.intersectionName || 'Export').replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('CSV exported successfully', 'success');
}

/**
 * Generate Word Memo for Signal Warrant Analysis
 */
async function signal_generateWordMemo() {
    const results = warrantsState.signal.analysisResults;
    if (!results) {
        showToast('Please run analysis first before exporting Word memo', 'warning');
        return;
    }

    const cfg = warrantsState.signal.config;
    const { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType, AlignmentType, BorderStyle } = docx;

    try {
        // Build warrant summary data
        const warrantsMet = results.warrantsMet || 0;
        const warrantsData = [
            { num: 1, name: 'Eight-Hour Volume', met: results.warrant1?.met, detail: `Cond A: ${results.warrant1?.conditionA?.hoursMet || 0}/8, Cond B: ${results.warrant1?.conditionB?.hoursMet || 0}/8` },
            { num: 2, name: 'Four-Hour Volume', met: results.warrant2?.met, detail: `${results.warrant2?.hoursMet || 0}/4 hours met` },
            { num: 3, name: 'Peak Hour', met: results.warrant3?.met, detail: `Peak @ ${String(results.warrant3?.peakHour || 0).padStart(2, '0')}:00` }
        ];

        if (results.warrant4?.enabled) {
            warrantsData.push({
                num: 4,
                name: 'Pedestrian Volume',
                met: results.warrant4.met,
                detail: `Fig ${results.warrant4.figureName || 'N/A'}: ${results.warrant4.hoursMet || 0}/${results.warrant4.hoursRequired || 4} hrs`
            });
        }

        if (results.warrant5?.enabled) {
            warrantsData.push({
                num: 5,
                name: 'School Crossing',
                met: results.warrant5.met,
                detail: `${results.warrant5.schoolchildren || 0} students`
            });
        }

        warrantsData.push({
            num: 7,
            name: 'Crash Experience',
            met: results.warrant7?.met,
            detail: `${results.warrant7?.crashCriterion?.totalSusceptible || 0} susceptible crashes`
        });

        // Create the document
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    // Header
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'MEMORANDUM',
                                bold: true,
                                size: 32,
                            })
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 }
                    }),

                    // To/From/Date/Subject
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'TO:\t\t', bold: true }),
                            new TextRun({ text: 'Project File' })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'FROM:\t\t', bold: true }),
                            new TextRun({ text: 'Traffic Engineering Division' })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'DATE:\t\t', bold: true }),
                            new TextRun({ text: new Date().toLocaleDateString() })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'SUBJECT:\t', bold: true }),
                            new TextRun({ text: `Signal Warrant Analysis - ${cfg.intersectionName || 'Intersection'}` })
                        ],
                        spacing: { after: 300 }
                    }),

                    // Horizontal line
                    new Paragraph({
                        border: {
                            bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 }
                        },
                        spacing: { after: 300 }
                    }),

                    // Introduction
                    new Paragraph({
                        text: 'PURPOSE',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: `A signal warrant analysis was conducted at the intersection of ${cfg.majorStreet || 'Major Street'} and ${cfg.minorStreet || 'Minor Street'} in accordance with the Manual on Uniform Traffic Control Devices (MUTCD) 11th Edition${warrantsState.signal.virginiaMode ? ' and Virginia MUTCD Supplement' : ''}. This memorandum summarizes the findings and recommendations.`,
                        spacing: { after: 300 }
                    }),

                    // Intersection Details
                    new Paragraph({
                        text: 'INTERSECTION CONFIGURATION',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Location: ', bold: true }),
                            new TextRun({ text: cfg.intersectionName || 'Not specified' })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Major Street: ', bold: true }),
                            new TextRun({ text: `${cfg.majorStreet || 'Not specified'} (${cfg.majorLanes} lanes, ${cfg.majorDirection})` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Minor Street: ', bold: true }),
                            new TextRun({ text: `${cfg.minorStreet || 'Not specified'} (${cfg.minorLanes} lanes)` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Intersection Type: ', bold: true }),
                            new TextRun({ text: `${cfg.intersectionLegs || 4}-leg` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Speed Limit: ', bold: true }),
                            new TextRun({ text: `${cfg.speedLimit || 35} mph` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: '70% Reduction Factor: ', bold: true }),
                            new TextRun({ text: cfg.apply70pct ? 'Applied' : 'Not Applied' })
                        ],
                        spacing: { after: 300 }
                    }),

                    // Analysis Results
                    new Paragraph({
                        text: 'WARRANT ANALYSIS RESULTS',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: 'The following warrants were evaluated:',
                        spacing: { after: 200 }
                    }),

                    // Warrant results table
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ text: 'Warrant', bold: true })],
                                        width: { size: 20, type: WidthType.PERCENTAGE }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: 'Description', bold: true })],
                                        width: { size: 35, type: WidthType.PERCENTAGE }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: 'Status', bold: true })],
                                        width: { size: 15, type: WidthType.PERCENTAGE }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: 'Details', bold: true })],
                                        width: { size: 30, type: WidthType.PERCENTAGE }
                                    })
                                ]
                            }),
                            ...warrantsData.map(w => new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ text: `Warrant ${w.num}` })] }),
                                    new TableCell({ children: [new Paragraph({ text: w.name })] }),
                                    new TableCell({ children: [new Paragraph({ text: w.met ? 'MET' : 'NOT MET' })] }),
                                    new TableCell({ children: [new Paragraph({ text: w.detail })] })
                                ]
                            }))
                        ]
                    }),

                    new Paragraph({ text: '', spacing: { after: 300 } }),

                    // Conclusion
                    new Paragraph({
                        text: 'CONCLUSION',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: warrantsMet > 0
                            ? `Based on the analysis, ${warrantsMet} signal warrant(s) have been satisfied. Signal installation may be warranted at this intersection. However, satisfaction of a warrant does not mandate signal installation. A comprehensive engineering study should be conducted to determine if a traffic signal is the appropriate solution for this location.`
                            : 'Based on the analysis, no signal warrants have been satisfied. Signal installation is not warranted at this time. Alternative traffic control measures may be considered to address any identified safety or operational concerns.',
                        spacing: { after: 300 }
                    }),

                    // Recommendation
                    new Paragraph({
                        text: 'RECOMMENDATION',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: warrantsMet > 0
                            ? 'It is recommended that a traffic signal engineering study be conducted to evaluate the feasibility of signal installation at this location. The study should consider factors including but not limited to: sight distance, geometric constraints, signal coordination, and impacts to adjacent intersections.'
                            : 'It is recommended that the intersection continue to be monitored for changes in traffic patterns. Alternative countermeasures such as improved signing, pavement markings, or geometric modifications may be considered if safety concerns exist.',
                        spacing: { after: 300 }
                    }),

                    // Signature line
                    new Paragraph({
                        text: '_______________________________',
                        spacing: { before: 400, after: 100 }
                    }),
                    new Paragraph({
                        text: 'Prepared By: ________________________',
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        text: `Date: ${new Date().toLocaleDateString()}`,
                        spacing: { after: 300 }
                    }),

                    // Disclaimer
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'DISCLAIMER: ',
                                bold: true,
                                italics: true,
                                size: 18
                            }),
                            new TextRun({
                                text: 'This analysis was performed using the CrashLens Signal Warrant Analyzer tool. All results should be verified by a licensed Professional Engineer before being used for official purposes.',
                                italics: true,
                                size: 18
                            })
                        ],
                        spacing: { before: 200 }
                    })
                ]
            }]
        });

        // Generate and download
        const blob = await docx.Packer.toBlob(doc);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Signal_Warrant_Memo_${(cfg.intersectionName || 'Intersection').replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
        link.click();
        URL.revokeObjectURL(link.href);

        showToast('Word memo exported successfully', 'success');
    } catch (error) {
        console.error('[Signal] Error generating Word memo:', error);
        showToast('Failed to generate Word memo', 'danger');
    }
}

// ============================================================
// AI-POWERED DUAL-AGENT TMC EXTRACTION SYSTEM
// Agent 1: Extraction - Extracts all TMC data and intersection config
// Agent 2: Validation - QA/QC to verify and correct extracted data
// ============================================================

// State for AI extraction and review
let signalPendingExtractions = [];
let signalReviewQueue = [];
let signalCurrentReviewIndex = 0;
let signalIsReviewMode = false;
let signalUploadedFiles = {}; // Store uploaded files for re-extraction
let signalAllValidationResults = []; // Store validation results for display
let signalExpectedHourCount = 12; // User-selected count type (12 or 24 hours)

/**
 * Read file content for AI extraction (handles Excel, CSV, PDF)
 */
function signal_readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        if (file.name.endsWith('.csv')) {
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        } else if (file.name.match(/\.xlsx?$/i)) {
            // Excel file - use XLSX library if available
            reader.onload = e => {
                try {
                    if (typeof XLSX !== 'undefined') {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        let fullText = '';
                        workbook.SheetNames.forEach(sheetName => {
                            fullText += `\n=== Sheet: ${sheetName} ===\n`;
                            const sheet = workbook.Sheets[sheetName];
                            fullText += XLSX.utils.sheet_to_csv(sheet);
                        });
                        resolve(fullText);
                    } else {
                        // Fallback to base64 for AI processing
                        const base64 = btoa(String.fromCharCode(...new Uint8Array(e.target.result)));
                        resolve(`[Excel file - base64 encoded]\n${base64.substring(0, 50000)}`);
                    }
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        } else {
            // PDF or other - read as base64 for AI
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        }
    });
}

/**
 * Dual-Agent TMC Extraction: Agent 1 (Extraction) + Agent 2 (Validation)
 */
async function signal_extractSingleFileWithDualAI(apiKey, file, slotNum) {
    const fileContent = await signal_readFileContent(file);
    const countType = document.getElementById('signalAICountType')?.value || document.getElementById('signalCountType')?.value || '12hr';
    const is24hr = countType === '24hr' || countType === '24';
    const expectedHours = is24hr ? 24 : 12;
    const hourRange = is24hr ? 'all 24 hours (0-23)' : '12 hours from 6 AM to 6 PM (hours 6-17)';
    const hoursList = is24hr ? '0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23' : '6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17';

    // ========== AGENT 1: EXTRACTION ==========
    const extractionPrompt = `You are an expert traffic data extraction specialist. Your task is to extract Turning Movement Count (TMC) data from traffic count files.

CRITICAL: READ THE ENTIRE FILE AND EXTRACT ALL DATA

FILE FORMAT GUIDANCE:
- Excel files (.xlsx, .xls): Check ALL sheets - data may be split across multiple tabs (AM/PM, by direction, by date)
- PDF files: Data may span multiple pages - extract from ALL pages. Look for continuation of hourly data
- Images: Read all visible data in tables/grids carefully
- CSV/Text: Parse column structure from headers

STEP 1: EXTRACT INTERSECTION CONFIGURATION
Look for and extract these details (often in header/title area):
- Intersection name (e.g., "Main St & Oak Ave", "SR-123 at Commerce Dr")
- Major street name and minor street name
- Number of lanes per approach (e.g., "2-lane", "4-lane divided")
- Speed limit (e.g., "Posted Speed: 45 mph", "35 MPH")
- Intersection type: 4-leg (standard crossroads) or 3-leg (T-intersection)
- Count type or study info

STEP 2: ANALYZE THE TMC DATA STRUCTURE
- Look for a header row containing direction indicators: NB, SB, EB, WB (or North, South, East, West)
- Identify movement columns: L (Left), T (Thru/Through), R (Right), U or UT (U-Turn)
- Find the time/hour column (usually first column)
- Note: Some files have directions as row groups, others as column groups

STEP 3: FIND AND VALIDATE AGAINST GRAND TOTAL
- Look for "Grand Total", "Daily Total", "Total Volume", "ADT", or similar row
- This number validates your extraction
- Report the Grand Total you find in the file
- Your extracted total should match this Grand Total

STEP 4: EXTRACT DATE AND DAY INFORMATION
- Look carefully for date information ANYWHERE in the file:
  * Title/header rows (e.g., "Traffic Count - March 15, 2024")
  * Column headers (e.g., "Date: 3/15/24")
  * File metadata or summary sections
  * Cell values containing dates
- Also check the FILENAME for date patterns: "${file.name}"
- Extract the date in YYYY-MM-DD format
- Determine the day of the week from the date

STEP 5: EXTRACT ALL HOURLY DATA
- COUNT TYPE: ${expectedHours}-HOUR COUNT (${hourRange})
- You MUST extract exactly these hours: ${hoursList}
- Read EVERY cell value EXACTLY as shown
- DO NOT stop at the first few rows - read ALL ${expectedHours} hours
- DO NOT default to 0 - only use 0 if the cell actually contains 0 or is empty
- If only totals are provided (no L/T/R breakdown), use total for "thru" and 0 for L/R/U
- Extract U-turn data if present (may be labeled U, UT, U-Turn) - set to 0 if not present
- IMPORTANT: User selected ${expectedHours}-hour count type. Extract all ${expectedHours} hours.

STEP 6: IDENTIFY PEAK HOURS
- Calculate total intersection volume for each hour
- Identify the AM peak hour (typically 7-9 AM range) and PM peak hour (typically 4-6 PM range)
- Report these peak hours and their volumes

STEP 7: VERIFY YOUR EXTRACTION
- Sum all your extracted hourly totals
- Compare to Grand Total found in file
- If they don't match within 5%, re-read the file carefully
- Report your confidence level (0-100%)

CONFIDENCE SCORING:
- 95-100%: Found date, all hours extracted, sum matches Grand Total exactly
- 80-94%: Found date, most hours, sum within 5% of Grand Total
- 60-79%: Missing date OR sum differs >5% from Grand Total
- Below 60%: Major issues - missing lots of data

Return ONLY valid JSON (no markdown, no explanation):
{
  "intersection": "Main St & Oak Ave",
  "majorStreet": "Main St",
  "minorStreet": "Oak Ave",
  "majorLanes": "2",
  "minorLanes": "1",
  "speedLimit": "35",
  "intersectionLegs": "4",
  "date": "2023-05-21",
  "dayOfWeek": "Sunday",
  "grandTotalInFile": 19500,
  "extractedTotal": 19450,
  "confidence": 95,
  "peakHours": {
    "am": { "hour": 8, "volume": 1850 },
    "pm": { "hour": 17, "volume": 2100 }
  },
  "hourlyVolumes": {
    "6": {
      "NB": { "left": 5, "thru": 50, "right": 10, "uturn": 0, "total": 65 },
      "SB": { "left": 8, "thru": 45, "right": 12, "uturn": 0, "total": 65 },
      "EB": { "left": 20, "thru": 150, "right": 25, "uturn": 2, "total": 197 },
      "WB": { "left": 15, "thru": 140, "right": 20, "uturn": 1, "total": 176 }
    }
  }
}

CRITICAL RULES:
- Extract ALL hours for ${hourRange}
- total MUST equal left + thru + right + uturn
- Include "uturn" field for each direction (use 0 if not present in source)
- ALWAYS find and report grandTotalInFile if it exists
- ALWAYS include extractedTotal (sum of all your extracted data)
- ALWAYS include confidence score
- Return ONLY the JSON object, no other text`;

    try {
        const extractionResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 12000,
                system: extractionPrompt,
                messages: [{
                    role: 'user',
                    content: `Extract TMC data from this traffic count file. Pay special attention to finding the date and day of week.\n\nFilename: "${file.name}"\n\nFile content:\n${fileContent.substring(0, 120000)}`
                }]
            })
        });

        if (!extractionResponse.ok) {
            const errorData = await extractionResponse.json().catch(() => ({}));
            return { success: false, error: errorData.error?.message || `HTTP ${extractionResponse.status}` };
        }

        const extractionResult = await extractionResponse.json();
        const extractedText = extractionResult.content[0].text;

        const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return { success: false, error: 'Could not parse extraction response' };

        let extractedData;
        try {
            extractedData = JSON.parse(jsonMatch[0]);
        } catch (e) {
            return { success: false, error: 'Invalid JSON in extraction response' };
        }

        if (!extractedData.hourlyVolumes) return { success: false, error: 'Missing hourlyVolumes in extraction' };

        // ========== AGENT 2: VALIDATION ==========
        const validationPrompt = `You are an expert QA/QC traffic data validator. Your task is to VERIFY and CORRECT extracted TMC data by comparing it against the original source file.

CRITICAL SETTINGS FROM USER:
- COUNT TYPE: ${expectedHours}-HOUR COUNT
- EXPECTED HOURS: ${hourRange}
- HOURS TO EXTRACT: ${hoursList}

VALIDATION PROCEDURE:

STEP 1: VERIFY HOUR COUNT
- User selected ${expectedHours}-hour count type
- Extracted data should have exactly ${expectedHours} hours (hours: ${hoursList})
- If hours are missing, RE-EXTRACT the missing hours from source file
- If file only has 12 hours but user selected 24hr, note this discrepancy

STEP 2: FIND GRAND TOTAL IN SOURCE
- Look for "Grand Total", "Daily Total", "Total Volume", "ADT" row
- This is the authoritative number to validate against
- Report what you find

STEP 3: VERIFY EXTRACTED TOTAL
- Sum all hourly volumes from extracted data
- Compare to Grand Total found in source
- If mismatch > 5%, extraction likely missed data - FIND THE MISSING DATA

STEP 4: SPOT-CHECK AGAINST SOURCE
- Check hours 7:00, 9:00, 12:00, 15:00, 17:00 (or available peak hours)
- Verify each value against source (left, thru, right, uturn, total)
- If discrepancies found, RE-EXTRACT those values

STEP 5: VERIFY DATE AND DAY OF WEEK
- Confirm date matches source file
- Confirm day of week is correct for that date
- If missing or wrong, find correct date/day from source

STEP 6: VERIFY INTERSECTION CONFIGURATION
- Check if majorStreet, minorStreet, lanes, speedLimit, intersectionLegs were extracted
- intersectionLegs should be "4" for standard 4-leg intersection or "3" for T-intersection
- Verify against source file headers/title area
- Correct if wrong or provide if missing

STEP 7: CHECK FOR MISSED DATA
- Did extraction miss any sheets?
- Are there multiple time periods or directions not captured?
- Were all 4 directions (NB, SB, EB, WB) extracted?
- Were U-turn volumes captured if present in source?
- Are all ${expectedHours} hours present?

STEP 8: CORRECTIONS
If errors found, provide correctedVolumes with ALL ${expectedHours} hours re-extracted correctly.
Each direction must include: left, thru, right, uturn, total

EXTRACTED DATA:
${JSON.stringify(extractedData, null, 2)}

ORIGINAL SOURCE FILE (filename: "${file.name}"):
${fileContent.substring(0, 80000)}

Return ONLY valid JSON:
{
  "isValid": true,
  "grandTotalInFile": 19500,
  "calculatedTotal": 19450,
  "totalMatch": true,
  "confidence": 95,
  "correctedDate": "2023-05-21",
  "correctedDayOfWeek": "Sunday",
  "correctedMajorStreet": null,
  "correctedMinorStreet": null,
  "correctedMajorLanes": null,
  "correctedMinorLanes": null,
  "correctedSpeedLimit": null,
  "correctedIntersectionLegs": null,
  "spotCheckResults": [
    {"hour": "7", "status": "match"},
    {"hour": "12", "status": "match"}
  ],
  "errors": [],
  "warnings": [],
  "correctedVolumes": {},
  "summary": "All values verified correct against Grand Total"
}

OR if corrections needed:
{
  "isValid": false,
  "grandTotalInFile": 19500,
  "calculatedTotal": 5000,
  "totalMatch": false,
  "confidence": 60,
  "correctedDate": "2023-05-21",
  "correctedDayOfWeek": "Sunday",
  "correctedMajorStreet": "Main St",
  "correctedMinorStreet": "Oak Ave",
  "correctedMajorLanes": "2",
  "correctedMinorLanes": "1",
  "correctedSpeedLimit": "35",
  "correctedIntersectionLegs": "4",
  "errors": [{"issue": "Missing hours 12-17, re-extracted from source"}],
  "warnings": [],
  "correctedVolumes": {
    "6": { "NB": {"left":5,"thru":50,"right":10,"uturn":0,"total":65}, "SB": {...}, "EB": {...}, "WB": {...} },
    "7": { "NB": {...}, "SB": {...}, "EB": {...}, "WB": {...} }
  },
  "summary": "Re-extracted all hours - original extraction missed PM hours"
}`;

        try {
            const validationResponse = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 12000,
                    system: validationPrompt,
                    messages: [{ role: 'user', content: 'Validate this extracted traffic data against the source file. If you find ANY discrepancies, provide correctedVolumes.' }]
                })
            });

            if (validationResponse.ok) {
                const validationResult = await validationResponse.json();
                const validationText = validationResult.content[0].text;
                const validationJsonMatch = validationText.match(/\{[\s\S]*\}/);

                if (validationJsonMatch) {
                    const validationData = JSON.parse(validationJsonMatch[0]);

                    // Use corrected data if available
                    const finalData = validationData.correctedVolumes && Object.keys(validationData.correctedVolumes).length > 0
                        ? { ...extractedData, hourlyVolumes: validationData.correctedVolumes }
                        : extractedData;

                    // Use corrected date/day if provided by validator
                    if (validationData.correctedDate) finalData.date = validationData.correctedDate;
                    if (validationData.correctedDayOfWeek) finalData.dayOfWeek = validationData.correctedDayOfWeek;

                    // Use corrected intersection config if provided by validator
                    if (validationData.correctedMajorStreet) finalData.majorStreet = validationData.correctedMajorStreet;
                    if (validationData.correctedMinorStreet) finalData.minorStreet = validationData.correctedMinorStreet;
                    if (validationData.correctedMajorLanes) finalData.majorLanes = validationData.correctedMajorLanes;
                    if (validationData.correctedMinorLanes) finalData.minorLanes = validationData.correctedMinorLanes;
                    if (validationData.correctedSpeedLimit) finalData.speedLimit = validationData.correctedSpeedLimit;
                    if (validationData.correctedIntersectionLegs) finalData.intersectionLegs = validationData.correctedIntersectionLegs;

                    return { success: true, data: finalData, validation: validationData };
                }
            }
        } catch (e) {
            console.warn('[Signal] Validation agent error:', e);
        }

        // If validation fails, return extracted data with warning
        return { success: true, data: extractedData, validation: { isValid: true, warnings: [{ message: 'Validation agent unavailable' }] } };
    } catch (err) {
        console.error('[Signal] Dual-agent extraction error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Calculate total volume from extracted data
 */
function signal_calculateExtractedTotal(data) {
    let total = 0;
    if (data.hourlyVolumes) {
        Object.values(data.hourlyVolumes).forEach(hour => {
            ['NB', 'SB', 'EB', 'WB'].forEach(dir => {
                total += hour[dir]?.total || 0;
            });
        });
    }
    return total;
}

/**
 * Auto-fill form fields from extracted data
 */
function signal_autoFillFromExtraction(extractedData) {
    const cfg = warrantsState.signal.config;

    // Auto-fill intersection configuration
    if (extractedData.intersection) {
        document.getElementById('signalIntersectionName').value = extractedData.intersection;
        cfg.intersectionName = extractedData.intersection;
    }
    if (extractedData.majorStreet) {
        document.getElementById('signalMajorStreet').value = extractedData.majorStreet;
        cfg.majorStreet = extractedData.majorStreet;
    }
    if (extractedData.minorStreet) {
        document.getElementById('signalMinorStreet').value = extractedData.minorStreet;
        cfg.minorStreet = extractedData.minorStreet;
    }
    if (extractedData.majorLanes) {
        const majorLanesEl = document.getElementById('signalMajorLanes');
        if (majorLanesEl) {
            majorLanesEl.value = extractedData.majorLanes;
            cfg.majorLanes = extractedData.majorLanes;
        }
    }
    if (extractedData.minorLanes) {
        const minorLanesEl = document.getElementById('signalMinorLanes');
        if (minorLanesEl) {
            minorLanesEl.value = extractedData.minorLanes;
            cfg.minorLanes = extractedData.minorLanes;
        }
    }
    if (extractedData.speedLimit) {
        document.getElementById('signalSpeedLimit').value = extractedData.speedLimit;
        cfg.speedLimit = parseInt(extractedData.speedLimit) || 35;
    }
    if (extractedData.intersectionLegs) {
        const legsEl = document.getElementById('signalIntersectionLegs');
        if (legsEl) {
            legsEl.value = extractedData.intersectionLegs;
            cfg.intersectionLegs = extractedData.intersectionLegs;
        }
    }

    // Mark fields as AI-filled for visual feedback
    ['signalIntersectionName', 'signalMajorStreet', 'signalMinorStreet', 'signalMajorLanes',
     'signalMinorLanes', 'signalSpeedLimit', 'signalIntersectionLegs'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.value) {
            el.classList.add('ai-filled');
            el.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)';
            el.style.borderColor = '#22c55e';
        }
    });

    // Update the 70% reduction check
    signal_check70pct();
}

/**
 * Handle bulk file upload for TMC extraction with dual-agent system
 * Includes: Agent 1 (Extraction), Agent 2 (Validation), Agent 3 (Variance Check)
 */
async function signal_handleBulkFileUpload(files) {
    if (!files || files.length === 0) return;

    const apiKey = getCMFAIApiKey();
    if (!apiKey) {
        showToast('Please configure your API key in the header bar to use AI extraction', 'warning');
        signal_showAPIKeyWarning();
        return;
    }

    // Get user-selected count type and day type
    const countType = document.getElementById('signalAICountType')?.value || document.getElementById('signalCountType')?.value || '12hr';
    const dayType = document.getElementById('signalDayType')?.value || 'weekday';
    const expectedHourCount = (countType === '24hr' || countType === '24') ? 24 : 12;
    const maxDays = dayType === 'weekday' ? 5 : 2;

    console.log(`[Signal] Starting extraction with Count Type: ${countType}hr, Day Type: ${dayType} (max ${maxDays} days)`);

    // Get UI elements
    const statusEl = document.getElementById('signalExtractionStatus');
    const progressDiv = document.getElementById('signalExtractionProgress');
    const progressFill = document.getElementById('signalProgressFill');
    const progressText = document.getElementById('signalProgressText');
    const validationPanel = document.getElementById('signalValidationPanel');
    const validationResults = document.getElementById('signalValidationResults');
    const previewPanel = document.getElementById('signalDataPreviewPanel');
    const previewDiv = document.getElementById('signalDataPreview');

    // Reset state
    signalPendingExtractions = [];
    signalAllValidationResults = [];
    signalUploadedFiles = {};
    signalExpectedHourCount = expectedHourCount; // Store for Agent 3

    // Store files for potential re-extraction (limit to maxDays)
    for (let i = 0; i < Math.min(files.length, maxDays); i++) {
        signalUploadedFiles[i + 1] = files[i];
    }

    // Reset UI
    for (let i = 1; i <= 7; i++) {
        const slotEl = document.querySelector(`#signalDaySlots .day-slot-mini[data-slot="${i}"]`);
        if (slotEl) {
            slotEl.className = 'day-slot-mini';
            slotEl.querySelector('.slot-icon').textContent = '○';
        }
    }

    progressDiv.classList.remove('hidden');
    validationPanel.style.display = 'none';
    previewPanel.style.display = 'none';

    let processedCount = 0;
    const totalFiles = Math.min(files.length, maxDays);

    // Process each file with dual-agent AI
    for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const slotNum = i + 1;
        const slotEl = document.querySelector(`#signalDaySlots .day-slot-mini[data-slot="${slotNum}"]`);
        const statusSpan = slotEl?.querySelector('.slot-icon');

        if (slotEl) {
            slotEl.classList.add('processing');
            if (statusSpan) statusSpan.innerHTML = '<span style="color:#f59e0b">⏳</span>';
        }

        progressText.textContent = `Processing Day ${slotNum}: ${file.name}...`;
        progressFill.style.width = `${(processedCount / totalFiles) * 100}%`;

        try {
            const result = await signal_extractSingleFileWithDualAI(apiKey, file, slotNum);

            if (slotEl) slotEl.classList.remove('processing');

            if (result.success && result.data) {
                const totalVolume = signal_calculateExtractedTotal(result.data);

                if (totalVolume === 0) {
                    // Zero data warning
                    if (slotEl) slotEl.classList.add('error');
                    if (statusSpan) statusSpan.innerHTML = '<span style="color:#dc2626">⚠️</span>';
                    signalAllValidationResults.push({
                        slot: slotNum,
                        filename: file.name,
                        status: 'warning',
                        message: 'All volumes are zero - please verify source file',
                        data: result.data,
                        validation: result.validation
                    });
                } else if (result.validation && !result.validation.isValid) {
                    // Data was corrected by validation agent
                    if (slotEl) slotEl.classList.add('has-file');
                    if (statusSpan) statusSpan.innerHTML = '<span style="color:#f59e0b">🔧</span>';
                    signalAllValidationResults.push({
                        slot: slotNum,
                        filename: file.name,
                        status: 'corrected',
                        message: 'Data corrected by validation agent',
                        data: result.data,
                        validation: result.validation,
                        totalVolume
                    });
                } else {
                    // Success
                    if (slotEl) slotEl.classList.add('has-file');
                    if (statusSpan) statusSpan.innerHTML = '<span style="color:#22c55e">✓</span>';
                    signalAllValidationResults.push({
                        slot: slotNum,
                        filename: file.name,
                        status: 'success',
                        message: 'Extraction and validation successful',
                        data: result.data,
                        validation: result.validation,
                        totalVolume
                    });
                }

                // Add to pending extractions
                signalPendingExtractions.push({
                    slot: slotNum,
                    filename: file.name,
                    date: result.data.date,
                    dayOfWeek: result.data.dayOfWeek,
                    hourlyVolumes: result.data.hourlyVolumes,
                    totalVolume: totalVolume,
                    confidence: result.data.confidence || (result.validation?.confidence) || 80,
                    intersection: result.data.intersection,
                    majorStreet: result.data.majorStreet,
                    minorStreet: result.data.minorStreet,
                    majorLanes: result.data.majorLanes,
                    minorLanes: result.data.minorLanes,
                    speedLimit: result.data.speedLimit,
                    intersectionLegs: result.data.intersectionLegs,
                    peakHours: result.data.peakHours,
                    validation: result.validation
                });

                // Auto-fill form fields from first successful extraction
                if (signalPendingExtractions.length === 1) {
                    signal_autoFillFromExtraction(result.data);
                }
            } else {
                // Error
                if (slotEl) slotEl.classList.add('error');
                if (statusSpan) statusSpan.innerHTML = '<span style="color:#dc2626">✗</span>';
                signalAllValidationResults.push({
                    slot: slotNum,
                    filename: file.name,
                    status: 'error',
                    message: result.error || 'Extraction failed'
                });
            }
        } catch (err) {
            console.error(`[Signal] Error processing ${file.name}:`, err);
            if (slotEl) {
                slotEl.classList.remove('processing');
                slotEl.classList.add('error');
            }
            if (statusSpan) statusSpan.innerHTML = '<span style="color:#dc2626">✗</span>';
            signalAllValidationResults.push({
                slot: slotNum,
                filename: file.name,
                status: 'error',
                message: err.message
            });
        }

        processedCount++;
        progressFill.style.width = `${(processedCount / totalFiles) * 100}%`;
    }

    // ========== AGENT 3: COMPREHENSIVE DATA VALIDATION ==========
    // Step 1: Hour Count Consistency Check (using user-selected count type)
    // Step 2: Volume Variance Check (15% weekday, 30% weekend threshold)
    // Step 3: Re-extract anomalies

    let agent3Issues = [];

    if (signalPendingExtractions.length >= 2) {
        progressText.textContent = 'Agent 3: Running comprehensive data validation...';
        progressDiv.classList.remove('hidden');

        // Use user-selected expected hour count (from selector, stored in signalExpectedHourCount)
        const userExpectedHours = signalExpectedHourCount || 12;
        const is24hrExpected = userExpectedHours === 24;

        console.log(`[Agent 3] Validating against user-selected count type: ${userExpectedHours}hr`);

        // Step 1: Hour Count Consistency Check against user expectation
        const hourCounts = signalPendingExtractions.map(ext => {
            const hours = ext.hourlyVolumes ? Object.keys(ext.hourlyVolumes).length : 0;
            const minHour = ext.hourlyVolumes ? Math.min(...Object.keys(ext.hourlyVolumes).map(Number)) : 0;
            const maxHour = ext.hourlyVolumes ? Math.max(...Object.keys(ext.hourlyVolumes).map(Number)) : 0;
            return { slot: ext.slot, filename: ext.filename, hours, minHour, maxHour, is24hr: hours > 12 || minHour < 6 || maxHour > 17 };
        });

        // Check for files not matching expected hour count
        hourCounts.forEach(hc => {
            if (hc.hours < userExpectedHours) {
                const missingHours = userExpectedHours - hc.hours;
                agent3Issues.push({
                    slot: hc.slot,
                    filename: hc.filename,
                    type: 'hour_count',
                    severity: missingHours > 6 ? 'error' : 'warning',
                    message: `Missing ${missingHours} hours (has ${hc.hours}, expected ${userExpectedHours} based on Count Type setting)`,
                    expectedHours: userExpectedHours,
                    actualHours: hc.hours
                });
            }

            // Also check if file has more hours than expected (possible 24hr file when 12hr selected)
            if (!is24hrExpected && hc.is24hr) {
                agent3Issues.push({
                    slot: hc.slot,
                    filename: hc.filename,
                    type: 'count_type_mismatch',
                    severity: 'warning',
                    message: `File appears to have 24-hour data but Count Type is set to 12hr. Consider changing Count Type or verify file.`,
                    expectedHours: userExpectedHours,
                    actualHours: hc.hours
                });
            }
        });

        // Step 2: Volume Variance Check (15% threshold)
        const volumes = signalPendingExtractions.map(e => e.totalVolume);
        const mean = volumes.reduce((a, b) => a + b, 0) / volumes.length;
        const suspiciousDays = [];

        signalPendingExtractions.forEach((ext, idx) => {
            const deviation = Math.abs((ext.totalVolume - mean) / mean) * 100;
            ext.deviation = deviation;
            ext.deviationDirection = ext.totalVolume < mean ? 'below' : 'above';

            // Check if this is a weekend day (may legitimately have lower volumes)
            const isWeekend = ext.dayOfWeek?.toLowerCase() === 'sunday' || ext.dayOfWeek?.toLowerCase() === 'saturday';

            // Use different thresholds: 15% for weekdays, 30% for weekends
            const threshold = isWeekend ? 30 : 15;

            if (deviation > threshold) {
                // Check if it might be missing data (lower than expected)
                const hourCount = ext.hourlyVolumes ? Object.keys(ext.hourlyVolumes).length : 0;
                const isPossiblyMissingData = ext.totalVolume < mean && hourCount < userExpectedHours;

                suspiciousDays.push({
                    idx,
                    ext,
                    deviation,
                    isWeekend,
                    isPossiblyMissingData,
                    hourCount,
                    expectedHours: userExpectedHours
                });

                agent3Issues.push({
                    slot: ext.slot,
                    filename: ext.filename,
                    type: 'volume_variance',
                    severity: deviation > 25 ? 'error' : 'warning',
                    message: `Volume ${ext.deviationDirection} average by ${deviation.toFixed(1)}%${isWeekend ? ' (weekend)' : ''}${isPossiblyMissingData ? ' - possible missing data' : ''}`,
                    volume: ext.totalVolume,
                    mean: mean,
                    deviation: deviation
                });
            }
        });

        // Step 3: Re-extract anomalies with missing data
        if (suspiciousDays.length > 0) {
            progressText.textContent = `Agent 3: Re-analyzing ${suspiciousDays.length} anomaly file(s)...`;

            for (const { idx, ext, deviation, isPossiblyMissingData, hourCount, expectedHours } of suspiciousDays) {
                const file = signalUploadedFiles[ext.slot];
                if (!file) continue;

                progressText.textContent = `Re-analyzing ${ext.filename} (${deviation.toFixed(0)}% variance, ${hourCount}/${expectedHours} hours)...`;

                try {
                    const reExtractResult = await signal_agent3ReExtract(apiKey, ext, file, mean, expectedHours, userExpectedHours);

                    if (reExtractResult.success && reExtractResult.correctedVolumes) {
                        const newTotal = signal_calculateExtractedTotal({ hourlyVolumes: reExtractResult.correctedVolumes });
                        const newHourCount = Object.keys(reExtractResult.correctedVolumes).length;

                        // Accept if: volume improved OR hour count improved
                        const volumeImproved = newTotal > ext.totalVolume * 1.1;
                        const hoursImproved = newHourCount > hourCount;

                        if (volumeImproved || hoursImproved) {
                            const oldTotal = signalPendingExtractions[idx].totalVolume;
                            const oldHours = Object.keys(signalPendingExtractions[idx].hourlyVolumes).length;

                            signalPendingExtractions[idx].hourlyVolumes = reExtractResult.correctedVolumes;
                            signalPendingExtractions[idx].totalVolume = newTotal;
                            signalPendingExtractions[idx].reExtracted = true;
                            signalPendingExtractions[idx].agent3Notes = reExtractResult.analysisNotes;

                            // Update the corresponding issue
                            const issueIdx = agent3Issues.findIndex(i => i.slot === ext.slot && i.type === 'volume_variance');
                            if (issueIdx >= 0) {
                                agent3Issues[issueIdx].resolved = true;
                                agent3Issues[issueIdx].resolution = `Re-extracted: ${oldTotal.toLocaleString()} → ${newTotal.toLocaleString()} (${oldHours}→${newHourCount} hours)`;
                            }
                        }
                    }
                } catch (e) {
                    console.warn('[Signal] Agent 3 re-extraction error:', e);
                }
            }
        }

        // Final consistency check after re-extraction
        const finalHourCounts = signalPendingExtractions.map(ext =>
            ext.hourlyVolumes ? Object.keys(ext.hourlyVolumes).length : 0
        );
        const allSameHours = finalHourCounts.every(h => h === finalHourCounts[0]);

        if (!allSameHours) {
            agent3Issues.push({
                slot: 0,
                filename: 'All files',
                type: 'inconsistent_hours_final',
                severity: 'warning',
                message: `Hour counts still inconsistent after re-extraction: ${[...new Set(finalHourCounts)].join(', ')} hours. Manual review recommended.`
            });
        }
    }

    // Store agent3 issues for display
    signalPendingExtractions.forEach(ext => {
        ext.agent3Issues = agent3Issues.filter(i => i.slot === ext.slot || i.slot === 0);
    });

    // Display validation summary (show panel)
    validationPanel.style.display = 'block';
    let validationHtml = '<div style="margin-bottom:16px">';

    const successCount = signalAllValidationResults.filter(r => r.status === 'success').length;
    const correctedCount = signalAllValidationResults.filter(r => r.status === 'corrected').length;
    const warningCount = signalAllValidationResults.filter(r => r.status === 'warning').length;
    const errorCount = signalAllValidationResults.filter(r => r.status === 'error').length;

    validationHtml += `<div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px">`;
    if (successCount > 0) validationHtml += `<span style="color:#22c55e">✅ ${successCount} Passed</span>`;
    if (correctedCount > 0) validationHtml += `<span style="color:#f59e0b">🔧 ${correctedCount} Corrected</span>`;
    if (warningCount > 0) validationHtml += `<span style="color:#f59e0b">⚠️ ${warningCount} Zero Data</span>`;
    if (errorCount > 0) validationHtml += `<span style="color:#dc2626">❌ ${errorCount} Failed</span>`;
    validationHtml += `</div>`;

    // Agent 3 Validation Summary
    if (agent3Issues.length > 0) {
        validationHtml += `<div style="margin:12px 0;padding:12px;background:#fef3c7;border-radius:8px;border:1px solid #f59e0b">`;
        validationHtml += `<h5 style="margin:0 0 8px 0;color:#92400e;font-size:.85rem">🔍 Agent 3 Data Quality Check</h5>`;

        const unresolvedIssues = agent3Issues.filter(i => !i.resolved);
        const resolvedIssues = agent3Issues.filter(i => i.resolved);

        if (resolvedIssues.length > 0) {
            validationHtml += `<div style="margin-bottom:8px;padding:8px;background:#dcfce7;border-radius:4px">`;
            validationHtml += `<strong style="color:#166534">✓ ${resolvedIssues.length} issue(s) auto-corrected:</strong><ul style="margin:4px 0 0 16px;padding:0;font-size:.8rem">`;
            resolvedIssues.forEach(i => {
                validationHtml += `<li>Day ${i.slot}: ${i.resolution}</li>`;
            });
            validationHtml += `</ul></div>`;
        }

        if (unresolvedIssues.length > 0) {
            validationHtml += `<div style="padding:8px;background:#fee2e2;border-radius:4px">`;
            validationHtml += `<strong style="color:#991b1b">⚠️ ${unresolvedIssues.length} issue(s) need manual review:</strong><ul style="margin:4px 0 0 16px;padding:0;font-size:.8rem">`;
            unresolvedIssues.forEach(i => {
                if (i.slot > 0) {
                    validationHtml += `<li>Day ${i.slot}: ${i.message}</li>`;
                } else {
                    validationHtml += `<li>${i.message}</li>`;
                }
            });
            validationHtml += `</ul></div>`;
        }

        validationHtml += `</div>`;
    }

    // Detail each result
    signalAllValidationResults.forEach(r => {
        const icon = r.status === 'success' ? '✅' : r.status === 'corrected' ? '🔧' : r.status === 'warning' ? '⚠️' : '❌';
        const color = r.status === 'success' ? '#22c55e' : r.status === 'error' ? '#dc2626' : '#f59e0b';
        validationHtml += `<div style="padding:8px;margin-bottom:8px;background:#f9fafb;border-radius:4px;border-left:3px solid ${color}">`;
        validationHtml += `<strong>${icon} Day ${r.slot}</strong> - ${r.filename}<br>`;
        validationHtml += `<span style="font-size:.85rem;color:#64748b">${r.message}</span>`;
        if (r.totalVolume !== undefined) validationHtml += `<br><span style="font-size:.85rem">Total Volume: <strong>${r.totalVolume.toLocaleString()}</strong></span>`;
        if (r.data?.date || r.data?.dayOfWeek) {
            validationHtml += `<br><span style="font-size:.85rem;color:#3b82f6">📅 Detected: ${r.data.date || 'Unknown date'} (${r.data.dayOfWeek || 'Unknown day'})</span>`;
        }
        validationHtml += `</div>`;
    });

    validationHtml += '</div>';
    validationResults.innerHTML = validationHtml;

    // Show data preview if we have any successful extractions
    if (signalPendingExtractions.length > 0) {
        previewPanel.style.display = 'block';
        previewDiv.innerHTML = signal_generateDataPreview(signalPendingExtractions);
        if (statusEl) {
            statusEl.innerHTML = `<span style="color:#22c55e">✅ Extracted ${signalPendingExtractions.length} day(s). Review the preview below and confirm to add data.</span>`;
        }
    } else {
        if (statusEl) {
            statusEl.innerHTML = `<span style="color:#dc2626">❌ No data could be extracted. Please check your files.</span>`;
        }
    }

    progressDiv.classList.add('hidden');
}

/**
 * Extract all uploaded files with AI (called from Extract button)
 */
async function signal_extractAllWithAI() {
    const fileInput = document.getElementById('signalBulkFileInput');
    if (fileInput && fileInput.files.length > 0) {
        await signal_handleBulkFileUpload(fileInput.files);
    } else {
        showToast('Please upload files first', 'warning');
    }
}

// Note: signal_clearAIUploads() is defined earlier in the codebase (BUG-001 fix - removed duplicate)

/**
 * Handle file selection (updates UI, enables Extract button)
 */
function signal_onFilesSelected(files) {
    if (!files || files.length === 0) return;

    const apiKey = getCMFAIApiKey();
    const extractBtn = document.getElementById('signalExtractBtn');
    const statusEl = document.getElementById('signalExtractionStatus');
    const dayType = document.getElementById('signalDayType')?.value || 'weekday';
    const maxDays = dayType === 'weekday' ? 5 : 2;

    // Limit files based on day type
    const maxFiles = Math.min(files.length, maxDays);

    // Show selected files in visible day slots only
    for (let i = 0; i < maxFiles; i++) {
        const slotEl = document.querySelector(`#signalDaySlots .day-slot-mini[data-slot="${i+1}"]:not(.hidden)`);
        if (slotEl) {
            slotEl.classList.add('has-file');
            slotEl.querySelector('.slot-icon').textContent = '📄';
        }
    }

    // Update status
    if (statusEl) {
        statusEl.innerHTML = `<span style="color:var(--primary)">📁 ${maxFiles} file(s) selected. Click "Extract & Validate" to process.</span>`;
    }

    // Check for API key and show warning popup if not configured
    if (!apiKey) {
        signal_showAPIKeyWarning();
        if (extractBtn) {
            extractBtn.disabled = true;
            extractBtn.title = 'Please configure your API key in the header first';
        }
        if (statusEl) {
            statusEl.innerHTML = `<span style="color:var(--warning)">⚠️ API key required - see warning above.</span>`;
        }
        return;
    }

    // Enable extract button if API key exists
    if (extractBtn) {
        extractBtn.disabled = false;
        extractBtn.title = 'Click to extract TMC data using dual-agent AI';
    }
}

/**
 * Show API Key warning popup when user tries to upload files without API key
 */
function signal_showAPIKeyWarning() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'signalAPIKeyWarningOverlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center';

    // Create popup
    const popup = document.createElement('div');
    popup.style.cssText = 'background:white;border-radius:12px;padding:24px;max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);text-align:center';

    popup.innerHTML = `
        <div style="font-size:3rem;margin-bottom:16px">⚠️</div>
        <h3 style="color:#dc2626;margin-bottom:12px;font-size:1.2rem">API Key Required</h3>
        <p style="color:#475569;margin-bottom:20px;line-height:1.5">
            To use AI-powered data extraction, you need to configure your Claude API key first.
        </p>
        <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:12px;margin-bottom:20px;text-align:left">
            <p style="color:#92400e;font-size:.9rem;margin:0">
                <strong>How to add your API key:</strong><br>
                1. Look for the 🔑 icon in the header bar<br>
                2. Click "Configure API Key"<br>
                3. Enter your Claude API key from Anthropic
            </p>
        </div>
        <button onclick="document.getElementById('signalAPIKeyWarningOverlay').remove()"
                style="background:#3b82f6;color:white;border:none;padding:10px 24px;border-radius:6px;font-size:.95rem;cursor:pointer;font-weight:500">
            Got it
        </button>
    `;

    overlay.appendChild(popup);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    // Close on Escape key
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            const existingOverlay = document.getElementById('signalAPIKeyWarningOverlay');
            if (existingOverlay) existingOverlay.remove();
            document.removeEventListener('keydown', escHandler);
        }
    });

    document.body.appendChild(overlay);
}

/**
 * Agent 3: Comprehensive Data Re-extraction
 * Re-extracts suspicious days with volume variance or inconsistent hour counts
 * @param {string} apiKey - Claude API key
 * @param {object} dayData - Current extraction data
 * @param {File} file - Original file for re-extraction
 * @param {number} expectedMean - Expected mean volume based on other files
 * @param {number} expectedHours - Expected number of hours (from other files)
 * @param {number} maxHourCount - Maximum hour count found across all files
 */
async function signal_agent3ReExtract(apiKey, dayData, file, expectedMean, expectedHours = 12, maxHourCount = 12) {
    const fileContent = await signal_readFileContent(file);

    // Use user-selected count type from global state
    const userSelectedHours = signalExpectedHourCount || 12;
    const is24hrExpected = userSelectedHours === 24;
    const currentHours = dayData.hourlyVolumes ? Object.keys(dayData.hourlyVolumes).length : 0;
    const hourRangeExpected = is24hrExpected ? 'all 24 hours (0-23)' : '12 hours (6 AM to 6 PM, hours 6-17)';
    const hoursListExpected = is24hrExpected ? '0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23' : '6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17';

    const prompt = `CRITICAL DATA QUALITY CHECK: This file needs careful re-extraction.

## USER-SELECTED COUNT TYPE: ${userSelectedHours}-HOUR COUNT
- User has selected ${userSelectedHours}-hour count type
- Expected hours: ${hourRangeExpected}
- Hours to extract: ${hoursListExpected}

## DETECTED ISSUES:
- Current extracted volume: ${dayData.totalVolume.toLocaleString()}
- Expected volume (based on other files): approximately ${Math.round(expectedMean).toLocaleString()}
- Variance: ${dayData.deviation?.toFixed(1) || 'N/A'}%
- Current hour count: ${currentHours} hours
- Expected hour count: ${userSelectedHours} hours (user selection)
${currentHours < userSelectedHours ? `- ⚠️ MISSING ${userSelectedHours - currentHours} HOURS OF DATA` : ''}

## VALIDATION REQUIREMENTS:
1. **Hour Count Consistency**: User selected ${userSelectedHours}-hour count. This file should have ${userSelectedHours} hours.
   - ${is24hrExpected ? 'Extract all 24 hours (0-23)' : 'Extract 12 hours (6-17, i.e., 6 AM to 6 PM)'}
   - All files in a study should have the same hour range

2. **Volume Validation**: The total should be close to ${Math.round(expectedMean).toLocaleString()}
   - If significantly lower, you may have missed data sheets or hours
   - Check for multiple sheets (AM/PM sheets, Summary sheets)

3. **Direction Completeness**: Must have all 4 directions: NB, SB, EB, WB
   - Check if data is split across multiple sheets by direction

## COMMON EXTRACTION ERRORS TO AVOID:
- Only reading first sheet (Excel files often have AM/PM on separate sheets)
- Stopping extraction early (missing afternoon hours)
- Missing one direction entirely
- Confusing approach directions

## YOUR TASK:
1. First, find the GRAND TOTAL or DAILY TOTAL row - this tells you what the file's true total is
2. Extract ALL ${userSelectedHours} hours (${hoursListExpected}) for ALL 4 directions
3. Verify your extracted sum matches the Grand Total
4. If the file has fewer hours than expected, note it in analysisNotes

FILENAME: "${file.name}"
COUNT TYPE: ${userSelectedHours}-HOUR (user selected)
EXPECTED HOURS: ${hourRangeExpected}
EXPECTED VOLUME: approximately ${Math.round(expectedMean).toLocaleString()}

FILE CONTENT (read ALL sheets and sections):
${fileContent.substring(0, 120000)}

Return JSON:
{
  "success": true,
  "grandTotalFound": 19500,
  "newExtractedTotal": 19450,
  "hourCountFound": 12,
  "countType": "12hr or 24hr",
  "analysisNotes": "Explanation of what was found/fixed",
  "correctedVolumes": {
    "6": { "NB": {"left":0,"thru":0,"right":0,"uturn":0,"total":0}, "SB": {...}, "EB": {...}, "WB": {...} },
    "7": { "NB": {...}, "SB": {...}, "EB": {...}, "WB": {...} }
  }
}`;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 12000,
                system: prompt,
                messages: [{ role: 'user', content: 'Re-extract this traffic data file completely. Find ALL hours and ALL directions.' }]
            })
        });

        if (!response.ok) return { success: false };

        const result = await response.json();
        const text = result.content?.[0]?.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return { success: false };
    } catch (e) {
        console.warn('[Signal] Agent 3 error:', e);
        return { success: false };
    }
}

/**
 * Generate data preview HTML for extracted data
 */
function signal_generateDataPreview(extractions) {
    let html = '<div style="max-height:500px;overflow-y:auto">';

    extractions.forEach((ext, idx) => {
        const isZero = ext.totalVolume === 0;
        const previewId = `signal-preview-${idx}`;
        html += `<div style="margin-bottom:16px;padding:12px;background:${isZero ? '#fef3c7' : '#f9fafb'};border-radius:8px">`;
        // Calculate hour count and detect count type
        const hourCount = ext.hourlyVolumes ? Object.keys(ext.hourlyVolumes).length : 0;
        const minHour = ext.hourlyVolumes ? Math.min(...Object.keys(ext.hourlyVolumes).map(Number)) : 0;
        const maxHour = ext.hourlyVolumes ? Math.max(...Object.keys(ext.hourlyVolumes).map(Number)) : 0;
        const is24hr = hourCount > 12 || minHour < 6 || maxHour > 17;
        const countTypeLabel = is24hr ? '24-Hour' : '12-Hour';

        // Check if this file has fewer hours than others
        const maxHoursInBatch = Math.max(...extractions.map(e => e.hourlyVolumes ? Object.keys(e.hourlyVolumes).length : 0));
        const hasFewerHours = hourCount < maxHoursInBatch;

        html += `<div style="font-weight:600;margin-bottom:8px">Day ${ext.slot}: ${ext.filename}</div>`;

        // Show detected date and day
        if (ext.date || ext.dayOfWeek) {
            html += `<div style="margin-bottom:8px;padding:6px 10px;background:#dbeafe;border-radius:4px;font-size:.85rem">
                📅 <strong>${ext.date || 'Date not detected'}</strong> ${ext.dayOfWeek ? `(${ext.dayOfWeek})` : ''}
            </div>`;
        } else {
            html += `<div style="margin-bottom:8px;padding:6px 10px;background:#fef3c7;border-radius:4px;font-size:.85rem">
                ⚠️ Date/day not detected - will use default
            </div>`;
        }

        // Show hour count and count type
        const hourCountBg = hasFewerHours ? '#fef3c7' : '#f0fdf4';
        const hourCountColor = hasFewerHours ? '#92400e' : '#166534';
        html += `<div style="margin-bottom:8px;padding:6px 10px;background:${hourCountBg};border-radius:4px;font-size:.85rem;color:${hourCountColor}">
            🕐 <strong>${countTypeLabel} Count</strong> (${hourCount} hours: ${minHour}:00 - ${maxHour}:00)
            ${hasFewerHours ? `<span style="color:#dc2626;margin-left:8px">⚠️ Other files have ${maxHoursInBatch} hours</span>` : ''}
        </div>`;

        if (isZero) {
            html += `<div style="color:#dc2626;margin-bottom:8px">⚠️ WARNING: Total volume is 0. Please verify source file.</div>`;
        } else {
            // Show variance if calculated
            let varianceInfo = '';
            if (ext.deviation !== undefined) {
                const varianceColor = ext.deviation > 15 ? '#dc2626' : ext.deviation > 10 ? '#f59e0b' : '#22c55e';
                varianceInfo = ` <span style="color:${varianceColor};font-size:.8rem">(${ext.deviation.toFixed(1)}% ${ext.deviationDirection || ''} avg)</span>`;
            }
            html += `<div style="margin-bottom:8px">Total Volume: <strong>${ext.totalVolume.toLocaleString()}</strong>${varianceInfo}</div>`;
        }

        // Show Agent 3 issues if any
        if (ext.agent3Issues && ext.agent3Issues.length > 0) {
            const unresolvedIssues = ext.agent3Issues.filter(i => !i.resolved && i.slot === ext.slot);
            if (unresolvedIssues.length > 0) {
                html += `<div style="margin-bottom:8px;padding:6px 10px;background:#fee2e2;border-radius:4px;font-size:.8rem;color:#991b1b">`;
                unresolvedIssues.forEach(i => {
                    html += `⚠️ ${i.message}<br>`;
                });
                html += `</div>`;
            }
        }

        // Show re-extraction notes if any
        if (ext.reExtracted && ext.agent3Notes) {
            html += `<div style="margin-bottom:8px;padding:6px 10px;background:#dcfce7;border-radius:4px;font-size:.8rem;color:#166534">
                🔄 Re-extracted: ${ext.agent3Notes}
            </div>`;
        }

        // Show hours table with expand/collapse
        if (ext.hourlyVolumes) {
            const allHours = Object.keys(ext.hourlyVolumes).sort((a, b) => parseInt(a) - parseInt(b));

            html += `<table class="signal-preview-table"><thead><tr><th>Hour</th><th>NB</th><th>SB</th><th>EB</th><th>WB</th><th>Total</th></tr></thead><tbody id="${previewId}-body">`;

            allHours.forEach((h, hIdx) => {
                const hv = ext.hourlyVolumes[h];
                const hourTotal = (hv.NB?.total || 0) + (hv.SB?.total || 0) + (hv.EB?.total || 0) + (hv.WB?.total || 0);
                const rowClass = hourTotal === 0 ? 'warning-row' : '';
                const hiddenClass = hIdx >= 5 ? `hidden-row-${previewId}` : '';
                const hiddenStyle = hIdx >= 5 ? 'display:none;' : '';
                html += `<tr class="${rowClass} ${hiddenClass}" style="${hiddenStyle}">
                    <td>${h}:00</td>
                    <td>${hv.NB?.total || 0}</td>
                    <td>${hv.SB?.total || 0}</td>
                    <td>${hv.EB?.total || 0}</td>
                    <td>${hv.WB?.total || 0}</td>
                    <td><strong>${hourTotal}</strong></td>
                </tr>`;
            });

            html += '</tbody></table>';

            if (allHours.length > 5) {
                html += `<div style="text-align:center;margin-top:8px">
                    <button class="btn btn-sm btn-outline" id="toggle-${previewId}" onclick="signal_togglePreviewRows('${previewId}', ${allHours.length - 5})">
                        ▼ Show ${allHours.length - 5} more hours
                    </button>
                </div>`;
            }
        }

        html += '</div>';
    });

    html += '</div>';
    return html;
}

/**
 * Toggle hidden rows in data preview
 */
function signal_togglePreviewRows(previewId, hiddenCount) {
    const rows = document.querySelectorAll(`.hidden-row-${previewId}`);
    const btn = document.getElementById(`toggle-${previewId}`);
    const isHidden = rows[0]?.style.display === 'none';

    rows.forEach(row => {
        row.style.display = isHidden ? '' : 'none';
    });

    btn.innerHTML = isHidden ? `▲ Hide ${hiddenCount} hours` : `▼ Show ${hiddenCount} more hours`;
}

/**
 * Confirm extracted data and enter review mode
 */
function signal_confirmExtractedData() {
    if (signalPendingExtractions.length === 0) return;

    // Enter review mode instead of adding directly
    signalReviewQueue = [...signalPendingExtractions];
    signalCurrentReviewIndex = 0;
    signal_enterReviewMode();

    // Hide the preview panel
    document.getElementById('signalDataPreviewPanel').style.display = 'none';
    document.getElementById('signalExtractionStatus').innerHTML = `<span style="color:#3b82f6">📋 Review ${signalReviewQueue.length} day(s) in the Manual Entry section below. Modify if needed, then confirm each day.</span>`;

    signalPendingExtractions = [];
}

/**
 * Enter review mode for extracted data
 */
function signal_enterReviewMode() {
    signalIsReviewMode = true;

    // Show review banner
    const banner = document.getElementById('signalReviewModeBanner');
    if (banner) {
        banner.classList.remove('hidden');
    }

    // Update button text
    const addDayBtn = document.getElementById('signalAddDayBtn');
    if (addDayBtn) {
        addDayBtn.innerHTML = '✓ Confirm & Add Day';
        addDayBtn.classList.add('btn-success');
    }

    // Update queue indicator
    signal_updateReviewQueueIndicator();

    // Load first extraction into grid
    signal_loadCurrentReviewData();

    // Scroll to Manual Entry section
    if (banner) {
        banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Exit review mode
 */
function signal_exitReviewMode() {
    signalIsReviewMode = false;
    signalReviewQueue = [];
    signalCurrentReviewIndex = 0;

    // Hide review banner
    const banner = document.getElementById('signalReviewModeBanner');
    if (banner) banner.classList.add('hidden');

    // Reset button text
    const addDayBtn = document.getElementById('signalAddDayBtn');
    if (addDayBtn) {
        addDayBtn.innerHTML = '<span>+</span> Add This Day';
        addDayBtn.classList.remove('btn-success');
    }

    // Clear the form
    signal_clearTMCForm();

    document.getElementById('signalExtractionStatus').innerHTML = '<span style="color:#64748b">Review mode exited. You can still enter data manually.</span>';
}

/**
 * Update the review queue indicator
 */
function signal_updateReviewQueueIndicator() {
    const indicator = document.getElementById('signalReviewQueueIndicator');
    const skipBtn = document.getElementById('signalSkipReviewBtn');

    if (indicator) {
        indicator.textContent = `Day ${signalCurrentReviewIndex + 1} of ${signalReviewQueue.length}`;
    }

    // Hide skip button if only one day or on last day
    if (skipBtn) {
        if (signalReviewQueue.length <= 1) {
            skipBtn.style.display = 'none';
        } else {
            skipBtn.style.display = '';
        }
    }
}

/**
 * Load current review data into the TMC form
 */
function signal_loadCurrentReviewData() {
    if (signalCurrentReviewIndex >= signalReviewQueue.length) {
        // All days reviewed
        signal_exitReviewMode();
        document.getElementById('signalExtractionStatus').innerHTML = '<span style="color:#22c55e">✅ All days reviewed!</span>';
        return;
    }

    const ext = signalReviewQueue[signalCurrentReviewIndex];

    // Update filename display
    const filenameText = document.getElementById('signalReviewFilenameText');
    if (filenameText) {
        filenameText.textContent = ext.filename || 'Unknown file';
    }

    // Update intersection configuration if available
    if (ext.intersection) {
        document.getElementById('signalIntersectionName').value = ext.intersection;
    }
    if (ext.majorStreet) {
        document.getElementById('signalMajorStreet').value = ext.majorStreet;
    }
    if (ext.minorStreet) {
        document.getElementById('signalMinorStreet').value = ext.minorStreet;
    }
    if (ext.majorLanes) {
        const el = document.getElementById('signalMajorLanes');
        if (el) el.value = ext.majorLanes;
    }
    if (ext.minorLanes) {
        const el = document.getElementById('signalMinorLanes');
        if (el) el.value = ext.minorLanes;
    }
    if (ext.speedLimit) {
        document.getElementById('signalSpeedLimit').value = ext.speedLimit;
    }
    if (ext.intersectionLegs) {
        const el = document.getElementById('signalIntersectionLegs');
        if (el) el.value = ext.intersectionLegs;
    }

    // Populate the TMC grid with extracted data
    signal_populateTMCGridFromExtraction(ext);

    signal_updateReviewQueueIndicator();
}

/**
 * Populate TMC grid from extracted data
 */
function signal_populateTMCGridFromExtraction(ext) {
    console.log('[Signal] Populating TMC grid from extraction:', ext.filename);

    // Detect extracted count type from hourly data and sync table before populating
    if (ext.hourlyVolumes) {
        const extractedHours = Object.keys(ext.hourlyVolumes).map(h => parseInt(h));
        const hasEarlyHours = extractedHours.some(h => h < 6);
        const hasLateHours = extractedHours.some(h => h >= 18);
        const extractedIs24hr = hasEarlyHours || hasLateHours;
        const currentCountType = document.getElementById('signalCountType')?.value || '12hr';

        // Sync table count type to match extracted data (skipWarning=true for auto-sync)
        if (extractedIs24hr && currentCountType !== '24hr') {
            console.log('[Signal] Detected 24hr extracted data, syncing table to 24hr mode');
            signal_setCountType('24hr', true);
            showToast('Table switched to 24-hour mode to match extracted data', 'info');
        } else if (!extractedIs24hr && extractedHours.length <= 12 && currentCountType !== '12hr') {
            // Only switch to 12hr if data is clearly 12hr (no hours outside 6-17 range)
            const allWithin12hr = extractedHours.every(h => h >= 6 && h < 18);
            if (allWithin12hr) {
                console.log('[Signal] Detected 12hr extracted data, syncing table to 12hr mode');
                signal_setCountType('12hr', true);
                showToast('Table switched to 12-hour mode to match extracted data', 'info');
            }
        }
    }

    // Set date (with fallback for missing date)
    const dateEl = document.getElementById('signalTMCDate');
    if (ext.date) {
        if (dateEl) dateEl.value = ext.date;
    } else if (dateEl && !dateEl.value) {
        // Fallback: use today's date if no date extracted and field is empty
        const today = new Date().toISOString().split('T')[0];
        dateEl.value = today;
        console.log('[Signal] No date in extraction, using today:', today);
    }

    // Set day of week
    if (ext.dayOfWeek) {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayIdx = dayNames.indexOf(ext.dayOfWeek.toLowerCase());
        if (dayIdx >= 0) {
            const dowEl = document.getElementById('signalTMCDow');
            if (dowEl) dowEl.value = dayIdx;
        }
    }

    // First regenerate the grid to ensure it's in correct state
    signal_updateTMCGrid();

    // Use requestAnimationFrame to ensure DOM is fully updated after innerHTML changes
    requestAnimationFrame(() => {
        signal_doPopulateTMCValues(ext);
    });
}

/**
 * Actually populate the TMC input values (called after DOM is ready)
 */
function signal_doPopulateTMCValues(ext) {
    const countType = document.getElementById('signalCountType')?.value || '12hr';
    const startHour = countType === '24hr' ? 0 : 6;
    const endHour = countType === '24hr' ? 24 : 18;

    console.log('[Signal] Populating values for hours', startHour, '-', endHour);

    if (ext.hourlyVolumes) {
        let populatedCount = 0;
        Object.entries(ext.hourlyVolumes).forEach(([hour, hv]) => {
            const h = parseInt(hour);
            if (h >= startHour && h < endHour) {
                // Set values for each direction and movement
                ['NB', 'SB', 'EB', 'WB'].forEach(dir => {
                    const data = hv[dir] || {};

                    // Use correct ID pattern: tmc_${hour}_${approach}_${movement}
                    const leftInput = document.getElementById(`tmc_${h}_${dir}_L`);
                    const thruInput = document.getElementById(`tmc_${h}_${dir}_T`);
                    const rightInput = document.getElementById(`tmc_${h}_${dir}_R`);
                    const uturnInput = document.getElementById(`tmc_${h}_${dir}_U`);
                    const totalInput = document.getElementById(`tmc_${h}_${dir}_total`);

                    if (leftInput) { leftInput.value = data.left || 0; populatedCount++; }
                    if (thruInput) thruInput.value = data.thru || 0;
                    if (rightInput) rightInput.value = data.right || 0;
                    if (uturnInput) uturnInput.value = data.uturn || 0;

                    // Calculate and update total
                    if (totalInput) {
                        const total = (data.left || 0) + (data.thru || 0) + (data.right || 0) + (data.uturn || 0);
                        totalInput.value = total;
                    }
                });
            }
        });
        console.log('[Signal] Populated', populatedCount, 'input cells');
    } else {
        console.warn('[Signal] No hourlyVolumes data in extraction');
    }
}

/**
 * Populate TMC grid from multiDayData day entry
 * Used when transferring data from Stop Sign Warrant or loading existing day data
 * @param {Object} dayData - Day data object with {date, dow, hourlyData}
 */
function signal_populateTMCFromDayData(dayData) {
    if (!dayData) return;

    console.log('[Signal] Populating TMC grid from day data');

    // Set date
    const dateEl = document.getElementById('signalTMCDate');
    if (dateEl && dayData.date) {
        dateEl.value = dayData.date;
    }

    // Set day of week - handle both 'dow' (signal) and 'dayOfWeek' (stop sign) field names
    const dowEl = document.getElementById('signalTMCDow');
    const dayOfWeek = dayData.dow !== undefined ? dayData.dow : dayData.dayOfWeek;
    if (dowEl && dayOfWeek !== undefined) {
        dowEl.value = dayOfWeek;
    }

    // First regenerate the grid to ensure it's in correct state
    if (typeof signal_updateTMCGrid === 'function') {
        signal_updateTMCGrid();
    }

    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
        const countType = document.getElementById('signalCountType')?.value || '12hr';
        const startHour = countType === '24hr' ? 0 : 6;
        const endHour = countType === '24hr' ? 24 : 18;

        const hourlyData = dayData.hourlyData;
        if (hourlyData) {
            Object.entries(hourlyData).forEach(([hour, hourData]) => {
                if (!hourData) return;
                const h = parseInt(hour);
                if (h >= startHour && h < endHour) {
                    for (const approach of ['NB', 'SB', 'EB', 'WB']) {
                        const appData = hourData[approach];
                        if (appData) {
                            // Get L/T/R/U values (support both naming conventions)
                            const leftVal = appData.L || appData.left || 0;
                            const thruVal = appData.T || appData.thru || 0;
                            const rightVal = appData.R || appData.right || 0;
                            const uturnVal = appData.U || appData.uturn || 0;

                            // Signal warrant uses 'tmc_' prefix without 'signal_'
                            const leftEl = document.getElementById(`tmc_${h}_${approach}_L`);
                            const thruEl = document.getElementById(`tmc_${h}_${approach}_T`);
                            const rightEl = document.getElementById(`tmc_${h}_${approach}_R`);
                            const uturnEl = document.getElementById(`tmc_${h}_${approach}_U`);
                            const totalEl = document.getElementById(`tmc_${h}_${approach}_total`);

                            if (leftEl) leftEl.value = leftVal;
                            if (thruEl) thruEl.value = thruVal;
                            if (rightEl) rightEl.value = rightVal;
                            if (uturnEl) uturnEl.value = uturnVal;

                            // Calculate total
                            const calculatedTotal = leftVal + thruVal + rightVal + uturnVal;
                            if (totalEl) totalEl.value = calculatedTotal;
                        }
                    }
                }
            });
        }

        // Update volume summary if function exists
        if (typeof signal_updateVolumeSummary === 'function') {
            signal_updateVolumeSummary();
        }

        console.log('[Signal] Populated TMC table from day data:', dayData.date || 'unknown date');
    });
}

/**
 * Skip current review day
 */
function signal_skipCurrentReview() {
    // Move to next day in queue without adding current
    // Capture current day before skipping
    const currentDayIndex = parseInt(document.getElementById('signalTMCDow')?.value) || 2;

    signalCurrentReviewIndex++;

    if (signalCurrentReviewIndex >= signalReviewQueue.length) {
        // Finished queue
        signal_exitReviewMode();
        document.getElementById('signalExtractionStatus').innerHTML = '<span style="color:#22c55e">✅ Review complete!</span>';

        // Auto-advance to next day of week after completing review
        signal_advanceToNextDay(currentDayIndex);
    } else {
        signal_loadCurrentReviewData();
    }
}

/**
 * Advance to next item in review queue (called after successfully adding a day)
 */
function signal_advanceReviewQueue() {
    // Called after successfully adding a day in review mode
    // Capture current day before advancing
    const currentDayIndex = parseInt(document.getElementById('signalTMCDow')?.value) || 2;

    signalCurrentReviewIndex++;

    if (signalCurrentReviewIndex >= signalReviewQueue.length) {
        // All days done
        signal_exitReviewMode();
        document.getElementById('signalExtractionStatus').innerHTML = '<span style="color:#22c55e">✅ All days added to analysis!</span>';

        // Auto-advance to next day of week after completing review
        signal_advanceToNextDay(currentDayIndex);
    } else {
        // Load next day
        signal_loadCurrentReviewData();
        document.getElementById('signalExtractionStatus').innerHTML = `<span style="color:#22c55e">✅ Day added! Now reviewing day ${signalCurrentReviewIndex + 1} of ${signalReviewQueue.length}.</span>`;
    }
}

/**
 * Reject extracted data and clear preview
 */
function signal_rejectExtractedData() {
    signalPendingExtractions = [];
    document.getElementById('signalDataPreviewPanel').style.display = 'none';
    document.getElementById('signalValidationPanel').style.display = 'none';
    document.getElementById('signalExtractionStatus').innerHTML = '<span style="color:#64748b">Data rejected. Please re-upload and try again.</span>';
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.warrants = CL.warrants || {};
  CL.warrants.signalTab = CL.warrants.signalTab || {};
  window.signal_initState = signal_initState; CL.warrants.signalTab.signal_initState = signal_initState;
  window.signal_getLaneConfig = signal_getLaneConfig; CL.warrants.signalTab.signal_getLaneConfig = signal_getLaneConfig;
  window.signal_getReductionFactor = signal_getReductionFactor; CL.warrants.signalTab.signal_getReductionFactor = signal_getReductionFactor;
  window.signal_applyPagonesAdjustment = signal_applyPagonesAdjustment; CL.warrants.signalTab.signal_applyPagonesAdjustment = signal_applyPagonesAdjustment;
  window.signal_applyRTAdjustment = signal_applyRTAdjustment; CL.warrants.signalTab.signal_applyRTAdjustment = signal_applyRTAdjustment;
  window.signal_computeHourlyAggregates = signal_computeHourlyAggregates; CL.warrants.signalTab.signal_computeHourlyAggregates = signal_computeHourlyAggregates;
  window.signal_computeHourlyAggregatesForDay = signal_computeHourlyAggregatesForDay; CL.warrants.signalTab.signal_computeHourlyAggregatesForDay = signal_computeHourlyAggregatesForDay;
  window.signal_calculateStreetVolumes = signal_calculateStreetVolumes; CL.warrants.signalTab.signal_calculateStreetVolumes = signal_calculateStreetVolumes;
  window.signal_interpolateThreshold = signal_interpolateThreshold; CL.warrants.signalTab.signal_interpolateThreshold = signal_interpolateThreshold;
  window.signal_evaluateWarrant1 = signal_evaluateWarrant1; CL.warrants.signalTab.signal_evaluateWarrant1 = signal_evaluateWarrant1;
  window.signal_evaluateWarrant2 = signal_evaluateWarrant2; CL.warrants.signalTab.signal_evaluateWarrant2 = signal_evaluateWarrant2;
  window.signal_evaluateWarrant3 = signal_evaluateWarrant3; CL.warrants.signalTab.signal_evaluateWarrant3 = signal_evaluateWarrant3;
  window.signal_evaluateWarrant4 = signal_evaluateWarrant4; CL.warrants.signalTab.signal_evaluateWarrant4 = signal_evaluateWarrant4;
  window.signal_evaluateWarrant5 = signal_evaluateWarrant5; CL.warrants.signalTab.signal_evaluateWarrant5 = signal_evaluateWarrant5;
  window.signal_evaluateWarrant7 = signal_evaluateWarrant7; CL.warrants.signalTab.signal_evaluateWarrant7 = signal_evaluateWarrant7;
  window.signal_autoPopulateWarrant7 = signal_autoPopulateWarrant7; CL.warrants.signalTab.signal_autoPopulateWarrant7 = signal_autoPopulateWarrant7;
  window.signal_detectWarrant7Period = signal_detectWarrant7Period; CL.warrants.signalTab.signal_detectWarrant7Period = signal_detectWarrant7Period;
  window.signal_updateWarrant7Display = signal_updateWarrant7Display; CL.warrants.signalTab.signal_updateWarrant7Display = signal_updateWarrant7Display;
  window.signal_refreshWarrant7 = signal_refreshWarrant7; CL.warrants.signalTab.signal_refreshWarrant7 = signal_refreshWarrant7;
  window.signal_runAnalysis = signal_runAnalysis; CL.warrants.signalTab.signal_runAnalysis = signal_runAnalysis;
  window.signal_buildDayResults = signal_buildDayResults; CL.warrants.signalTab.signal_buildDayResults = signal_buildDayResults;
  window.signal_updateResultsDisplay = signal_updateResultsDisplay; CL.warrants.signalTab.signal_updateResultsDisplay = signal_updateResultsDisplay;
  window.signal_buildDetailedResultsHTML = signal_buildDetailedResultsHTML; CL.warrants.signalTab.signal_buildDetailedResultsHTML = signal_buildDetailedResultsHTML;
  window.signal_switchDetailTab = signal_switchDetailTab; CL.warrants.signalTab.signal_switchDetailTab = signal_switchDetailTab;
  window.signal_buildDayBreakdownTable = signal_buildDayBreakdownTable; CL.warrants.signalTab.signal_buildDayBreakdownTable = signal_buildDayBreakdownTable;
  window.signal_buildSummaryTab = signal_buildSummaryTab; CL.warrants.signalTab.signal_buildSummaryTab = signal_buildSummaryTab;
  window.signal_buildWarrant1Tab = signal_buildWarrant1Tab; CL.warrants.signalTab.signal_buildWarrant1Tab = signal_buildWarrant1Tab;
  window.signal_buildWarrant2Tab = signal_buildWarrant2Tab; CL.warrants.signalTab.signal_buildWarrant2Tab = signal_buildWarrant2Tab;
  window.signal_buildWarrant3Tab = signal_buildWarrant3Tab; CL.warrants.signalTab.signal_buildWarrant3Tab = signal_buildWarrant3Tab;
  window.signal_buildWarrant4Tab = signal_buildWarrant4Tab; CL.warrants.signalTab.signal_buildWarrant4Tab = signal_buildWarrant4Tab;
  window.signal_buildWarrant5Tab = signal_buildWarrant5Tab; CL.warrants.signalTab.signal_buildWarrant5Tab = signal_buildWarrant5Tab;
  window.signal_buildWarrant7Tab = signal_buildWarrant7Tab; CL.warrants.signalTab.signal_buildWarrant7Tab = signal_buildWarrant7Tab;
  window.signal_buildHourlyTab = signal_buildHourlyTab; CL.warrants.signalTab.signal_buildHourlyTab = signal_buildHourlyTab;
  window.signal_buildRTTab = signal_buildRTTab; CL.warrants.signalTab.signal_buildRTTab = signal_buildRTTab;
  window.signal_switchResultTab = signal_switchResultTab; CL.warrants.signalTab.signal_switchResultTab = signal_switchResultTab;
  window.signal_renderMultiDayTable = signal_renderMultiDayTable; CL.warrants.signalTab.signal_renderMultiDayTable = signal_renderMultiDayTable;
  window.signal_renderHourlyTMC = signal_renderHourlyTMC; CL.warrants.signalTab.signal_renderHourlyTMC = signal_renderHourlyTMC;
  window.signal_renderRTAdjustment = signal_renderRTAdjustment; CL.warrants.signalTab.signal_renderRTAdjustment = signal_renderRTAdjustment;
  window.signal_addDay = signal_addDay; CL.warrants.signalTab.signal_addDay = signal_addDay;
  window.signal_removeDay = signal_removeDay; CL.warrants.signalTab.signal_removeDay = signal_removeDay;
  window.signal_clearAllDays = signal_clearAllDays; CL.warrants.signalTab.signal_clearAllDays = signal_clearAllDays;
  window.signal_calculateDayTotal = signal_calculateDayTotal; CL.warrants.signalTab.signal_calculateDayTotal = signal_calculateDayTotal;
  window.signal_editDay = signal_editDay; CL.warrants.signalTab.signal_editDay = signal_editDay;
  window.signal_renderTMCGrid = signal_renderTMCGrid; CL.warrants.signalTab.signal_renderTMCGrid = signal_renderTMCGrid;
  window.signal_onTMCInput = signal_onTMCInput; CL.warrants.signalTab.signal_onTMCInput = signal_onTMCInput;
  window.signal_updateModalRowTotal = signal_updateModalRowTotal; CL.warrants.signalTab.signal_updateModalRowTotal = signal_updateModalRowTotal;
  window.signal_saveTMCModal = signal_saveTMCModal; CL.warrants.signalTab.signal_saveTMCModal = signal_saveTMCModal;
  window.signal_closeTMCModal = signal_closeTMCModal; CL.warrants.signalTab.signal_closeTMCModal = signal_closeTMCModal;
  window.signal_updateConfigFromUI = signal_updateConfigFromUI; CL.warrants.signalTab.signal_updateConfigFromUI = signal_updateConfigFromUI;
  window.signal_populateUIFromConfig = signal_populateUIFromConfig; CL.warrants.signalTab.signal_populateUIFromConfig = signal_populateUIFromConfig;
  window.signal_onTabShow = signal_onTabShow; CL.warrants.signalTab.signal_onTabShow = signal_onTabShow;
  window.signal_generatePDFReport = signal_generatePDFReport; CL.warrants.signalTab.signal_generatePDFReport = signal_generatePDFReport;
  window.signal_exportCSV = signal_exportCSV; CL.warrants.signalTab.signal_exportCSV = signal_exportCSV;
  window.signal_generateWordMemo = signal_generateWordMemo; CL.warrants.signalTab.signal_generateWordMemo = signal_generateWordMemo;
  window.signal_readFileContent = signal_readFileContent; CL.warrants.signalTab.signal_readFileContent = signal_readFileContent;
  window.signal_extractSingleFileWithDualAI = signal_extractSingleFileWithDualAI; CL.warrants.signalTab.signal_extractSingleFileWithDualAI = signal_extractSingleFileWithDualAI;
  window.signal_calculateExtractedTotal = signal_calculateExtractedTotal; CL.warrants.signalTab.signal_calculateExtractedTotal = signal_calculateExtractedTotal;
  window.signal_autoFillFromExtraction = signal_autoFillFromExtraction; CL.warrants.signalTab.signal_autoFillFromExtraction = signal_autoFillFromExtraction;
  window.signal_handleBulkFileUpload = signal_handleBulkFileUpload; CL.warrants.signalTab.signal_handleBulkFileUpload = signal_handleBulkFileUpload;
  window.signal_extractAllWithAI = signal_extractAllWithAI; CL.warrants.signalTab.signal_extractAllWithAI = signal_extractAllWithAI;
  window.signal_onFilesSelected = signal_onFilesSelected; CL.warrants.signalTab.signal_onFilesSelected = signal_onFilesSelected;
  window.signal_showAPIKeyWarning = signal_showAPIKeyWarning; CL.warrants.signalTab.signal_showAPIKeyWarning = signal_showAPIKeyWarning;
  window.signal_agent3ReExtract = signal_agent3ReExtract; CL.warrants.signalTab.signal_agent3ReExtract = signal_agent3ReExtract;
  window.signal_generateDataPreview = signal_generateDataPreview; CL.warrants.signalTab.signal_generateDataPreview = signal_generateDataPreview;
  window.signal_togglePreviewRows = signal_togglePreviewRows; CL.warrants.signalTab.signal_togglePreviewRows = signal_togglePreviewRows;
  window.signal_confirmExtractedData = signal_confirmExtractedData; CL.warrants.signalTab.signal_confirmExtractedData = signal_confirmExtractedData;
  window.signal_enterReviewMode = signal_enterReviewMode; CL.warrants.signalTab.signal_enterReviewMode = signal_enterReviewMode;
  window.signal_exitReviewMode = signal_exitReviewMode; CL.warrants.signalTab.signal_exitReviewMode = signal_exitReviewMode;
  window.signal_updateReviewQueueIndicator = signal_updateReviewQueueIndicator; CL.warrants.signalTab.signal_updateReviewQueueIndicator = signal_updateReviewQueueIndicator;
  window.signal_loadCurrentReviewData = signal_loadCurrentReviewData; CL.warrants.signalTab.signal_loadCurrentReviewData = signal_loadCurrentReviewData;
  window.signal_populateTMCGridFromExtraction = signal_populateTMCGridFromExtraction; CL.warrants.signalTab.signal_populateTMCGridFromExtraction = signal_populateTMCGridFromExtraction;
  window.signal_doPopulateTMCValues = signal_doPopulateTMCValues; CL.warrants.signalTab.signal_doPopulateTMCValues = signal_doPopulateTMCValues;
  window.signal_populateTMCFromDayData = signal_populateTMCFromDayData; CL.warrants.signalTab.signal_populateTMCFromDayData = signal_populateTMCFromDayData;
  window.signal_skipCurrentReview = signal_skipCurrentReview; CL.warrants.signalTab.signal_skipCurrentReview = signal_skipCurrentReview;
  window.signal_advanceReviewQueue = signal_advanceReviewQueue; CL.warrants.signalTab.signal_advanceReviewQueue = signal_advanceReviewQueue;
  window.signal_rejectExtractedData = signal_rejectExtractedData; CL.warrants.signalTab.signal_rejectExtractedData = signal_rejectExtractedData;
  CL._registerModule('warrants/signal-tab');
})();
