/** CL grants.rank — 27c scoring extracted (name-anchored) 2026-05-19.
 *  see modular-prompts/27-v2-grants-rank.md. No behavior change.
 *  Oversized size-exception (~795 L, user-approved): contiguous 27c band,
 *  no documented split point — single-lane "no split" per CC_LANE_B_ROUND_2_V1b.
 *  Reads inline shared grantState / GRANT_SCORING_PROFILES via shared
 *  classic-script global scope (grants-rank-init / cmf-search precedent). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim, app/index.html L30108–L30902) ───
// ============================================================
// ENHANCED GRANT MATCHING ALGORITHM
// Based on FHWA guidelines and traffic engineering best practices
// ============================================================

// Pre-compiled regex patterns for crash pattern analysis (performance optimization)
var CRASH_PATTERN_REGEX = {
    nightLight: /dark|night|dusk|dawn/i,
    wetSurface: /wet|ice|snow|slush/i,
    angleCollision: /angle/i,
    headOnCollision: /head.*on/i,
    rearEndCollision: /rear.*end/i,
    sideswipeCollision: /sideswipe/i,
    runOffRoad: /fixed.?object|run.?off|overturn/i
};

// Analyze crash patterns for a location (used for grant matching and scoring)
// Optimized version with pre-compiled regex and reduced string operations
function analyzeCrashPatterns(crashes) {
    const patterns = {
        total: crashes.length,
        night: 0,           // Dark/night crashes
        impaired: 0,        // Alcohol or drug related
        speed: 0,           // Speed related
        distracted: 0,      // Distracted driving
        angle: 0,           // Angle collisions (intersection safety)
        headOn: 0,          // Head-on collisions
        rearEnd: 0,         // Rear-end collisions
        sideswipe: 0,       // Sideswipe collisions
        runOffRoad: 0,      // Run-off-road / fixed object
        wetRoad: 0,         // Wet/icy road surface
        weekendNight: 0,    // Fri/Sat night (DUI indicator)
        rushHour: 0,        // Peak hour crashes
        byYear: {},         // For trend analysis
        collisionTypes: {}, // Collision type distribution
        lightConditions: {} // Light condition distribution
    };

    if (!crashes || crashes.length === 0) return patterns;

    // Use for loop instead of forEach for better performance with large arrays
    const len = crashes.length;
    for (let i = 0; i < len; i++) {
        const row = crashes[i];

        // Light conditions - use pre-compiled regex
        const lightVal = row[COL.LIGHT] || 'Unknown';
        if (CRASH_PATTERN_REGEX.nightLight.test(lightVal)) {
            patterns.night++;
        }
        patterns.lightConditions[lightVal] = (patterns.lightConditions[lightVal] || 0) + 1;

        // Contributing factors - isYes is already optimized
        if (isYes(row[COL.ALCOHOL]) || isYes(row[COL.DRUG])) patterns.impaired++;
        if (isYes(row[COL.SPEED])) patterns.speed++;
        if (isYes(row[COL.DISTRACTED])) patterns.distracted++;

        // Collision types - use pre-compiled regex
        const collisionVal = (row[COL.COLLISION] || '').trim() || 'Unknown';
        patterns.collisionTypes[collisionVal] = (patterns.collisionTypes[collisionVal] || 0) + 1;

        if (CRASH_PATTERN_REGEX.angleCollision.test(collisionVal)) patterns.angle++;
        if (CRASH_PATTERN_REGEX.headOnCollision.test(collisionVal)) patterns.headOn++;
        if (CRASH_PATTERN_REGEX.rearEndCollision.test(collisionVal)) patterns.rearEnd++;
        if (CRASH_PATTERN_REGEX.sideswipeCollision.test(collisionVal)) patterns.sideswipe++;
        if (CRASH_PATTERN_REGEX.runOffRoad.test(collisionVal)) patterns.runOffRoad++;

        // Road surface - use pre-compiled regex
        const surfaceVal = row[COL.SURFACE] || '';
        if (surfaceVal && CRASH_PATTERN_REGEX.wetSurface.test(surfaceVal)) {
            patterns.wetRoad++;
        }

        // Time-based patterns
        const dateVal = row[COL.DATE];
        if (dateVal) {
            const ts = Number(dateVal);
            if (!isNaN(ts)) {
                const crashDate = new Date(ts);
                const year = crashDate.getFullYear();
                patterns.byYear[year] = (patterns.byYear[year] || 0) + 1;

                // Weekend night (Fri 8PM - Sun 4AM)
                const dow = crashDate.getDay();
                const hour = getHour(row[COL.TIME]);
                if ((dow === 5 && hour >= 20) || (dow === 6) || (dow === 0 && hour < 4)) {
                    patterns.weekendNight++;
                }

                // Rush hour (7-9 AM, 4-7 PM)
                if (hour !== null && ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19))) {
                    patterns.rushHour++;
                }
            }
        }
    }

    return patterns;
}

// Calculate severity trend (positive = worsening, negative = improving)
function calculateSeverityTrend(patterns) {
    const years = Object.keys(patterns.byYear).map(Number).sort();
    if (years.length < 2) return { trend: 0, direction: 'stable' };

    // Compare recent vs older periods
    const midpoint = Math.floor(years.length / 2);
    const olderYears = years.slice(0, midpoint);
    const recentYears = years.slice(midpoint);

    const olderAvg = olderYears.reduce((s, y) => s + (patterns.byYear[y] || 0), 0) / olderYears.length;
    const recentAvg = recentYears.reduce((s, y) => s + (patterns.byYear[y] || 0), 0) / recentYears.length;

    if (olderAvg === 0) return { trend: 0, direction: 'stable' };

    const pctChange = ((recentAvg - olderAvg) / olderAvg) * 100;

    return {
        trend: pctChange,
        direction: pctChange > 10 ? 'worsening' : pctChange < -10 ? 'improving' : 'stable',
        olderAvg: olderAvg.toFixed(1),
        recentAvg: recentAvg.toFixed(1)
    };
}

// Calculate enhanced grant score using selected scoring profile
function calculateEnhancedGrantScore_legacy(locationData, patterns, crashes) {
    const profile = GRANT_SCORING_PROFILES[grantState.scoringProfile] || GRANT_SCORING_PROFILES.balanced;
    const w = profile.weights;

    let score = 0;

    // Severity scoring with exponential fatality weighting
    // K^exponent * multiplier creates non-linear emphasis on fatalities
    const fatalScore = Math.pow(locationData.K || 0, w.fatal) * w.fatalMult;
    score += fatalScore;
    score += (locationData.A || 0) * w.seriousInj;
    score += (locationData.B || 0) * w.minorInj;
    score += (locationData.C || 0) * w.possibleInj;
    score += (locationData.O || 0) * w.pdo;

    // VRU scoring (pedestrians and bicyclists)
    score += (locationData.ped || 0) * w.vruPed;
    score += (locationData.bike || 0) * w.vruBike;

    // Pattern-based scoring
    if (patterns && patterns.total > 0) {
        score += patterns.night * w.nightCrash;
        score += patterns.impaired * w.impairedCrash;
        score += patterns.angle * w.angleCollision;
        score += patterns.headOn * w.headOn;
        score += patterns.speed * w.speedRelated;
        score += patterns.wetRoad * w.wetRoad;
    }

    // Concentration bonus: if most crashes at same node within a route
    if (locationData.type === 'route' && locationData.nodeConcentration > 0.5) {
        score *= w.concentration;
    }

    // ADT-based rate adjustment (if ADT data available)
    if (grantState.useRateBasedScoring && grantState.adtData[locationData.name]) {
        const adt = grantState.adtData[locationData.name];
        // Calculate crash rate per 100 million VMT (standard VDOT metric)
        // Simplified: crashes per 1000 ADT
        const rate = (locationData.total / (adt / 1000));
        // Apply rate multiplier: higher rate = higher score
        if (rate > 2.0) score *= 1.5;      // Very high rate
        else if (rate > 1.0) score *= 1.25; // High rate
        else if (rate < 0.5) score *= 0.8;  // Low rate (well-performing)
    }

    // Trend adjustment
    if (patterns && patterns.total >= 5) {
        const trend = calculateSeverityTrend(patterns);
        if (trend.direction === 'worsening') score *= 1.15;
        else if (trend.direction === 'improving') score *= 0.9;
    }

    return Math.round(score);
}

// Determine best matching grants based on crash characteristics (enhanced)
function getMatchingGrantsEnhanced_legacy(locationData, patterns) {
    const matches = [];
    const vru = (locationData.ped || 0) + (locationData.bike || 0);
    const kaPct = locationData.total > 0 ? ((locationData.K + locationData.A) / locationData.total) * 100 : 0;
    const nightPct = patterns && patterns.total > 0 ? (patterns.night / patterns.total) * 100 : 0;
    const impairedPct = patterns && patterns.total > 0 ? (patterns.impaired / patterns.total) * 100 : 0;
    const speedPct = patterns && patterns.total > 0 ? (patterns.speed / patterns.total) * 100 : 0;

    // SS4A - prioritize VRU crashes, fatalities, and serious injuries
    if (vru > 0 || kaPct > 10 || (locationData.K + locationData.A) >= 2 || locationData.K >= 1) {
        const reasons = [];
        if (vru > 0) reasons.push(`${vru} VRU crashes`);
        if (locationData.K >= 1) reasons.push(`${locationData.K} fatal`);
        if (locationData.A >= 2) reasons.push(`${locationData.A} serious injuries`);
        matches.push({
            program: 'ss4a',
            reason: reasons.length > 0 ? reasons.join(', ') : 'High severity',
            strength: vru > 2 || locationData.K >= 2 ? 'strong' : 'moderate'
        });
    }

    // HSIP - infrastructure safety, intersection focus, systemic improvements
    if (locationData.total >= 5 || (locationData.K + locationData.A) >= 1 ||
        (patterns && (patterns.angle > 2 || patterns.headOn > 0 || patterns.runOffRoad > 2))) {
        const reasons = [];
        if (patterns && patterns.angle > 2) reasons.push('angle collision pattern');
        if (patterns && patterns.headOn > 0) reasons.push('head-on crashes');
        if (patterns && patterns.wetRoad > 2) reasons.push('wet road crashes');
        if (locationData.type === 'intersection') reasons.push('intersection location');
        matches.push({
            program: 'hsip',
            reason: reasons.length > 0 ? reasons.join(', ') : 'Infrastructure safety',
            strength: (locationData.K + locationData.A) >= 3 ? 'strong' : 'moderate'
        });
    }

    // NHTSA 402 - behavioral programs (speed, distracted, occupant protection)
    if (locationData.total >= 3 || speedPct > 20 || (patterns && patterns.distracted > 1)) {
        const reasons = [];
        if (speedPct > 20) reasons.push(`${speedPct.toFixed(0)}% speed-related`);
        if (patterns && patterns.distracted > 1) reasons.push('distracted driving');
        matches.push({
            program: '402',
            reason: reasons.length > 0 ? reasons.join(', ') : 'Behavioral safety',
            strength: speedPct > 30 ? 'strong' : 'moderate'
        });
    }

    // NHTSA 405d - impaired driving
    if (impairedPct > 15 || (patterns && patterns.impaired >= 2) ||
        (patterns && patterns.weekendNight > 3 && nightPct > 40)) {
        const reasons = [];
        if (impairedPct > 15) reasons.push(`${impairedPct.toFixed(0)}% impaired`);
        if (patterns && patterns.weekendNight > 3) reasons.push('weekend night pattern');
        if (nightPct > 40) reasons.push(`${nightPct.toFixed(0)}% night crashes`);
        matches.push({
            program: '405d',
            reason: reasons.length > 0 ? reasons.join(', ') : 'Impaired driving pattern',
            strength: impairedPct > 25 ? 'strong' : 'moderate'
        });
    }

    return matches;
}

// Get primary best match program (enhanced with pattern analysis)
function getBestMatchProgramEnhanced_legacy(locationData, patterns) {
    const vru = (locationData.ped || 0) + (locationData.bike || 0);
    const impairedPct = patterns && patterns.total > 0 ? (patterns.impaired / patterns.total) * 100 : 0;
    const speedPct = patterns && patterns.total > 0 ? (patterns.speed / patterns.total) * 100 : 0;

    // Priority 1: High impaired driving → 405d
    if (impairedPct > 25 || (patterns && patterns.impaired >= 3)) return '405d';

    // Priority 2: VRU crashes with severity → SS4A
    if (vru > 0 && (locationData.K + locationData.A) > 0) return 'ss4a';

    // Priority 3: Multiple fatalities → SS4A
    if (locationData.K >= 2) return 'ss4a';

    // Priority 4: High speed involvement → 402
    if (speedPct > 35) return '402';

    // Priority 5: High crash volume with severity → SS4A
    if (locationData.total > 15 && (locationData.K + locationData.A) > 2) return 'ss4a';

    // Priority 6: Intersection with angle crashes → HSIP
    if (locationData.type === 'intersection' && patterns && patterns.angle > 2) return 'hsip';

    // Priority 7: Any K or A crashes → HSIP
    if (locationData.K > 0 || locationData.A > 0) return 'hsip';

    // Default to HSIP for infrastructure
    return 'hsip';
}

// Simple wrapper for getBestMatchProgram (used by polygon/dropdown selection)
function getBestMatchProgram(stats) {
    const locationData = {
        total: stats.total || 0,
        K: stats.K || 0, A: stats.A || 0, B: stats.B || 0,
        C: stats.C || 0, O: stats.O || 0,
        ped: stats.ped || 0, bike: stats.bike || 0
    };
    if (grantState.baselines) {
        const patterns = stats.patterns || { total: locationData.total, night: 0, impaired: 0, speed: 0, angle: 0, headOn: 0, rearEnd: 0, runOffRoad: 0, wetRoad: 0, weekendNight: 0, distracted: 0 };
        return getImprovedBestMatch(locationData, patterns, grantState.baselines);
    }
    return getBestMatchProgramEnhanced_legacy(locationData, null);
}

// Simple wrapper for getMatchingGrants (used by polygon/dropdown selection)
function getMatchingGrants(stats) {
    const locationData = {
        total: stats.total || 0,
        K: stats.K || 0, A: stats.A || 0, B: stats.B || 0,
        C: stats.C || 0, O: stats.O || 0,
        ped: stats.ped || 0, bike: stats.bike || 0
    };
    if (grantState.baselines) {
        const patterns = stats.patterns || { total: locationData.total, night: 0, impaired: 0, speed: 0, angle: 0, headOn: 0, rearEnd: 0, runOffRoad: 0, wetRoad: 0, weekendNight: 0, distracted: 0 };
        return getImprovedGrantMatches(locationData, patterns, grantState.baselines);
    }
    return getMatchingGrantsEnhanced_legacy(locationData, null);
}

// ============================================================================
// IMPROVED GRANT SCORING ALGORITHM v2.0
// Statistical, Evidence-Based Scoring with ORI, PSI, B/C Estimation
// ============================================================================

// Virginia HSIP crash cost values (2024 dollars)
const CRASH_COSTS = {
    K: 12800000,  // Fatal
    A: 526000,    // Serious Injury (Suspected Serious)
    B: 155000,    // Minor Injury (Suspected Minor)
    C: 78000,     // Possible Injury
    O: 12000      // Property Damage Only
};

// Countermeasure lookup: pattern → { cmf, avgCost, name, applicableTo, grantPrograms }
const COUNTERMEASURE_LOOKUP = {
    angle_intersection: {
        cmf: 0.56, avgCost: 350000, name: 'Roundabout conversion',
        applicableTo: 'intersection', grantPrograms: ['hsip', 'ss4a']
    },
    angle_signal: {
        cmf: 0.75, avgCost: 50000, name: 'Protected left-turn phase',
        applicableTo: 'intersection', grantPrograms: ['hsip']
    },
    rearEnd_intersection: {
        cmf: 0.85, avgCost: 25000, name: 'Signal timing optimization',
        applicableTo: 'intersection', grantPrograms: ['hsip']
    },
    headOn_segment: {
        cmf: 0.56, avgCost: 150000, name: 'Median barrier/cable median',
        applicableTo: 'route', grantPrograms: ['hsip']
    },
    runOff_segment: {
        cmf: 0.72, avgCost: 80000, name: 'Rumble strips + clear zone',
        applicableTo: 'route', grantPrograms: ['hsip']
    },
    pedestrian: {
        cmf: 0.56, avgCost: 250000, name: 'Pedestrian hybrid beacon (HAWK)',
        applicableTo: 'both', grantPrograms: ['hsip', 'ss4a']
    },
    pedestrian_crosswalk: {
        cmf: 0.69, avgCost: 50000, name: 'High-visibility crosswalk + lighting',
        applicableTo: 'both', grantPrograms: ['hsip', 'ss4a']
    },
    bicycle: {
        cmf: 0.55, avgCost: 200000, name: 'Protected bike lane',
        applicableTo: 'both', grantPrograms: ['ss4a']
    },
    speed_segment: {
        cmf: 0.67, avgCost: 100000, name: 'Road diet / lane reduction',
        applicableTo: 'route', grantPrograms: ['hsip', 'ss4a']
    },
    speed_intersection: {
        cmf: 0.80, avgCost: 75000, name: 'Speed management (curb extensions, raised crosswalk)',
        applicableTo: 'intersection', grantPrograms: ['hsip', 'ss4a']
    },
    night: {
        cmf: 0.62, avgCost: 120000, name: 'Intersection/segment lighting',
        applicableTo: 'both', grantPrograms: ['hsip', 'ss4a']
    },
    wet_segment: {
        cmf: 0.80, avgCost: 200000, name: 'High-friction surface treatment',
        applicableTo: 'route', grantPrograms: ['hsip']
    },
    impaired: {
        cmf: 0.85, avgCost: 50000, name: 'DUI enforcement zone / sobriety checkpoints',
        applicableTo: 'both', grantPrograms: ['405d', '402']
    }
};

/**
 * Calculates county-wide baseline statistics for comparison.
 * Run once after crash data loads; cache in grantState.baselines.
 */
function calculateCountyBaselines(sampleRows, aggregates) {
    return CL.analysis.baselines.calculateCountyBaselines(sampleRows, aggregates);
}

/**
 * Over-Representation Index: ORI = (Location %) / (County %)
 * ORI > 1.0 = over-represented, > 1.5 = notably, > 2.0 = strongly
 */
function calculateORI(patterns, baselines) {
    return CL.analysis.baselines.calculateORI(patterns, baselines);
}

/**
 * Standard normal CDF approximation (Abramowitz & Stegun formula 26.2.17)
 */
function normalCDF(x) {
    return CL.analysis.baselines.normalCDF(x);
}

/**
 * Statistical significance testing for each crash pattern vs county baseline.
 * Uses normal approximation to binomial test.
 */
function testPatternSignificance(patterns, baselines, alpha) {
    return CL.analysis.baselines.testPatternSignificance(patterns, baselines, alpha);
}

/**
 * Potential for Safety Improvement using simplified Empirical Bayes.
 * PSI = EB estimate - Expected. Higher = more excess crashes.
 */
function calculatePSI(locationData, baselines) {
    return CL.analysis.baselines.calculatePSI(locationData, baselines, typeof grantState !== 'undefined' ? grantState : undefined);
}

/**
 * Estimates B/C ratio based on crash patterns and applicable countermeasures.
 */
function calculateFeasibilityAndBC(locationData, patterns, ori, significance) {
    const applicableCountermeasures = [];
    let bestBCRatio = 0;
    let bestCountermeasure = null;
    const type = locationData.type;

    const checkAndAdd = (patternKey, lookupKey, count, oriData, sigData) => {
        if (count >= 2 && oriData && oriData.ori > 1.2) {
            const cm = COUNTERMEASURE_LOOKUP[lookupKey];
            if (cm && (cm.applicableTo === 'both' || cm.applicableTo === type)) {
                const crf = 1 - cm.cmf;
                const reducedCrashes = count * crf;
                const total = locationData.total || 1;
                const benefit = reducedCrashes * (
                    ((locationData.K || 0) / total) * CRASH_COSTS.K +
                    ((locationData.A || 0) / total) * CRASH_COSTS.A +
                    ((locationData.B || 0) / total) * CRASH_COSTS.B +
                    ((locationData.C || 0) / total) * CRASH_COSTS.C +
                    ((locationData.O || 0) / total) * CRASH_COSTS.O
                );
                const serviceLife = 15;
                const discountRate = 0.04;
                const annualizedCost = cm.avgCost * (discountRate * Math.pow(1 + discountRate, serviceLife)) /
                    (Math.pow(1 + discountRate, serviceLife) - 1);
                const bcRatio = annualizedCost > 0 ? benefit / annualizedCost : 0;

                applicableCountermeasures.push({
                    name: cm.name, cmf: cm.cmf, estimatedCost: cm.avgCost,
                    estimatedAnnualBenefit: Math.round(benefit),
                    bcRatio: Math.round(bcRatio * 100) / 100,
                    crashReduction: Math.round(reducedCrashes * 10) / 10,
                    isSignificant: sigData ? sigData.significant : false,
                    grantPrograms: cm.grantPrograms
                });

                if (bcRatio > bestBCRatio) {
                    bestBCRatio = bcRatio;
                    bestCountermeasure = cm.name;
                }
            }
        }
    };

    checkAndAdd('angle', type === 'intersection' ? 'angle_intersection' : 'angle_signal',
        patterns.angle, ori.angle, significance.angle);
    checkAndAdd('rearEnd', 'rearEnd_intersection',
        patterns.rearEnd || 0, ori.rearEnd, significance.rearEnd);
    checkAndAdd('headOn', 'headOn_segment',
        patterns.headOn, ori.headOn, significance.headOn);
    checkAndAdd('runOff', 'runOff_segment',
        patterns.runOffRoad || patterns.runOff || 0, ori.runOff, null);
    checkAndAdd('ped', 'pedestrian',
        locationData.ped || 0, ori.ped, significance.ped);
    checkAndAdd('bike', 'bicycle',
        locationData.bike || 0, ori.bike, significance.bike);
    checkAndAdd('speed', type === 'route' ? 'speed_segment' : 'speed_intersection',
        patterns.speed, ori.speed, significance.speed);
    checkAndAdd('night', 'night',
        patterns.night, ori.night, significance.night);
    checkAndAdd('wet', 'wet_segment',
        patterns.wetRoad || patterns.wet || 0, ori.wet, significance.wet);
    checkAndAdd('impaired', 'impaired',
        patterns.impaired, ori.impaired, significance.impaired);

    return {
        countermeasures: applicableCountermeasures.sort((a, b) => b.bcRatio - a.bcRatio),
        bestBCRatio: Math.round(bestBCRatio * 100) / 100,
        bestCountermeasure,
        feasibilityScore: calculateFeasibilitySubScore(applicableCountermeasures, significance),
        countermeasureCount: applicableCountermeasures.length
    };
}

function calculateFeasibilitySubScore(countermeasures, significance) {
    if (countermeasures.length === 0) return 10;
    let score = 0;
    score += Math.min(countermeasures.length * 10, 30);
    const bestBC = Math.max(...countermeasures.map(c => c.bcRatio));
    if (bestBC > 10) score += 40;
    else if (bestBC > 5) score += 30;
    else if (bestBC > 2) score += 20;
    else if (bestBC > 1) score += 10;
    const significantCMs = countermeasures.filter(c => c.isSignificant).length;
    score += Math.min(significantCMs * 15, 30);
    return Math.min(score, 100);
}

// --- Grant-Specific Fit Scoring ---

function calculateGrantFitScores(locationData, patterns, ori, significance, psi, feasibility) {
    return {
        hsip:  calculateHSIPFit(locationData, patterns, ori, significance, psi, feasibility),
        ss4a:  calculateSS4AFit(locationData, patterns, ori, significance, psi),
        n402:  calculate402Fit(locationData, patterns, ori, significance),
        n405d: calculate405dFit(locationData, patterns, ori, significance)
    };
}

function calculateHSIPFit(locationData, patterns, ori, significance, psi, feasibility) {
    let score = 0;
    const reasons = [];

    // B/C Ratio component (35 pts max)
    if (feasibility.bestBCRatio > 10) { score += 35; reasons.push(`Excellent B/C: ${feasibility.bestBCRatio}`); }
    else if (feasibility.bestBCRatio > 5) { score += 28; reasons.push(`Strong B/C: ${feasibility.bestBCRatio}`); }
    else if (feasibility.bestBCRatio > 2) { score += 20; reasons.push(`Good B/C: ${feasibility.bestBCRatio}`); }
    else if (feasibility.bestBCRatio > 1) { score += 12; reasons.push(`Positive B/C: ${feasibility.bestBCRatio}`); }

    // Crash Reduction Potential (25 pts max) - based on PSI
    if (psi.exceedsCritical) {
        const excessRatio = psi.observed / psi.expected;
        if (excessRatio > 3) { score += 25; reasons.push('Very high excess crashes'); }
        else if (excessRatio > 2) { score += 20; reasons.push('High excess crashes'); }
        else if (excessRatio > 1.5) { score += 15; reasons.push('Moderate excess crashes'); }
        else { score += 10; reasons.push('Above expected crashes'); }
    }

    // SHSP Alignment (15 pts max)
    const shspAreas = ['angle', 'headOn', 'speed', 'impaired', 'ped', 'bike'];
    const alignedAreas = shspAreas.filter(area =>
        significance[area] && significance[area].significant
    );
    score += Math.min(alignedAreas.length * 5, 15);
    if (alignedAreas.length > 0) reasons.push(`SHSP: ${alignedAreas.join(', ')}`);

    // Systemic Applicability (15 pts max)
    if (feasibility.countermeasureCount >= 3) { score += 15; reasons.push('Multiple systemic solutions'); }
    else if (feasibility.countermeasureCount >= 2) { score += 10; reasons.push('Systemic solutions available'); }
    else if (feasibility.countermeasureCount >= 1) { score += 5; }

    // Project Readiness proxy (10 pts max)
    const significantPatterns = Object.values(significance).filter(s => s && s.significant).length;
    if (significantPatterns >= 3) { score += 10; }
    else if (significantPatterns >= 2) { score += 7; }
    else if (significantPatterns >= 1) { score += 4; }

    return { score: Math.min(score, 100), reasons, program: 'hsip' };
}

function calculateSS4AFit(locationData, patterns, ori, significance, psi) {
    let score = 0;
    const reasons = [];

    const ka = (locationData.K || 0) + (locationData.A || 0);
    const vru = (locationData.ped || 0) + (locationData.bike || 0);

    if (locationData.K >= 2) { score += 30; reasons.push(`${locationData.K} fatalities`); }
    else if (locationData.K >= 1 && vru > 0) { score += 28; reasons.push('Fatal + VRU crashes'); }
    else if (ka >= 3 && vru > 0) { score += 25; reasons.push('Severe injuries + VRU'); }
    else if (ka >= 2) { score += 18; reasons.push(`${ka} K/A crashes`); }
    else if (vru >= 2) { score += 20; reasons.push(`${vru} VRU crashes`); }
    else if (ka >= 1 || vru >= 1) { score += 10; }

    // Equity placeholder
    if (vru >= 3) { score += 15; reasons.push('High VRU exposure (equity proxy)'); }
    else if (vru >= 1) { score += 8; }

    // Effective Practices
    if (vru > 0 && ori.ped && ori.ped.ori > 1.5) { score += 10; reasons.push('VRU over-represented'); }
    if (ori.speed && ori.speed.ori > 1.5) { score += 5; reasons.push('Speed management opportunity'); }
    if (ori.night && ori.night.ori > 1.5) { score += 5; reasons.push('Lighting/visibility opportunity'); }

    // Demonstrated Need
    if (psi.exceedsCritical) { score += 10; reasons.push('Exceeds expected crash frequency'); }
    else if (psi.psi > 0) { score += 5; }

    // Climate bonus - multimodal
    if (vru > 0) { score += 7; reasons.push('Multimodal safety'); }

    // Collaboration baseline
    score += 5;

    return { score: Math.min(score, 100), reasons, program: 'ss4a' };
}

function calculate402Fit(locationData, patterns, ori, significance) {
    let score = 0;
    const reasons = [];

    if (significance.speed && significance.speed.significant) {
        score += 15; reasons.push(`Speed: ${significance.speed.count} crashes (p=${significance.speed.pValue})`);
    }
    if (significance.impaired && significance.impaired.significant) {
        score += 10; reasons.push(`Impaired: ${significance.impaired.count} (p=${significance.impaired.pValue})`);
    }
    if (patterns.distracted >= 3) { score += 5; reasons.push('Distracted driving pattern'); }

    const behavioralORI = Math.max(
        ori.speed ? ori.speed.ori : 0,
        ori.impaired ? ori.impaired.ori : 0
    );
    if (behavioralORI > 2.0) { score += 25; reasons.push('Strong behavioral over-representation'); }
    else if (behavioralORI > 1.5) { score += 18; }
    else if (behavioralORI > 1.2) { score += 10; }

    if (patterns.total >= 10) { score += 20; reasons.push('Sufficient data for measurement'); }
    else if (patterns.total >= 5) { score += 12; }
    else { score += 5; }

    score += 10;
    if (ori.impaired && ori.impaired.ori > 1.5) { score += 10; reasons.push('LEO partnership opportunity'); }
    else if (ori.speed && ori.speed.ori > 1.5) { score += 5; }

    return { score: Math.min(score, 100), reasons, program: '402' };
}

function calculate405dFit(locationData, patterns, ori, significance) {
    let score = 0;
    const reasons = [];

    if (significance.impaired && significance.impaired.significant) {
        if (ori.impaired.ori > 2.0) { score += 30; reasons.push(`Impaired ORI: ${ori.impaired.ori.toFixed(1)}x county avg`); }
        else if (ori.impaired.ori > 1.5) { score += 22; reasons.push('Significant impaired over-representation'); }
        else { score += 15; reasons.push('Statistically significant impaired pattern'); }
    } else if (patterns.impaired >= 2) {
        score += 8; reasons.push(`${patterns.impaired} impaired crashes (not yet significant)`);
    }

    if (patterns.weekendNight >= 3 && ori.night && ori.night.ori > 1.3) {
        score += 25; reasons.push('Strong weekend-night corridor pattern');
    } else if (patterns.weekendNight >= 2) {
        score += 15; reasons.push('Weekend night crash pattern');
    }

    if (locationData.type === 'route' && patterns.impaired >= 3) {
        score += 20; reasons.push('Corridor-level impaired driving problem');
    } else if (patterns.impaired >= 2) {
        score += 10;
    }

    if (patterns.total >= 10) { score += 15; }
    else if (patterns.total >= 5) { score += 8; }

    score += 5;

    return { score: Math.min(score, 100), reasons, program: '405d' };
}

/**
 * Main improved scoring function. Returns composite score with sub-scores,
 * confidence level, grant fit, and human-readable reasons.
 */
function calculateImprovedGrantScore(locationData, patterns, crashes, baselines) {
    return CL.grants.ranking.calculateImprovedGrantScore(locationData, patterns, crashes, baselines, grantState.scoringProfile, {
        calculateORI: calculateORI,
        testPatternSignificance: testPatternSignificance,
        calculatePSI: calculatePSI,
        calculateFeasibilityAndBC: calculateFeasibilityAndBC,
        calculateGrantFitScores: calculateGrantFitScores,
        calculateSeverityTrend: calculateSeverityTrend,
        calculateEnhancedGrantScore_legacy: calculateEnhancedGrantScore_legacy,
        getBestMatchProgramEnhanced_legacy: getBestMatchProgramEnhanced_legacy,
        getMatchingGrantsEnhanced_legacy: getMatchingGrantsEnhanced_legacy
    });
}

/**
 * Evidence-based grant matching (replaces getMatchingGrantsEnhanced).
 */
function getImprovedGrantMatches(locationData, patterns, baselines) {
    const ori = calculateORI(patterns, baselines);
    const significance = testPatternSignificance(patterns, baselines);
    const matches = [];

    const vru = (locationData.ped || 0) + (locationData.bike || 0);
    const ka = (locationData.K || 0) + (locationData.A || 0);

    // SS4A
    if (vru > 0 || (locationData.K >= 1) || (ka >= 2 && locationData.total >= 10)) {
        const reasons = [];
        let strength = 'moderate';
        if (locationData.K >= 2 || (locationData.K >= 1 && vru > 0)) strength = 'strong';
        if (vru > 0) reasons.push(`${vru} VRU crashes`);
        if (locationData.K >= 1) reasons.push(`${locationData.K} fatal`);
        if (significance.ped && significance.ped.significant) {
            reasons.push(`Ped over-represented (p=${significance.ped.pValue})`);
            strength = 'strong';
        }
        matches.push({ program: 'ss4a', reasons, strength, reason: reasons.join('; '),
                       evidence: significance.ped || significance.ka || null });
    }

    // HSIP
    const infraPatterns = ['angle', 'headOn', 'rearEnd', 'wet', 'night'].filter(p =>
        significance[p] && significance[p].significant
    );
    if (infraPatterns.length > 0 || (ka >= 1 && locationData.total >= 5)) {
        const reasons = infraPatterns.map(p =>
            `${p}: ORI ${ori[p] ? ori[p].ori.toFixed(1) : '?'}x (p=${significance[p]?.pValue || '?'})`
        );
        if (ka >= 1 && reasons.length === 0) reasons.push('K/A crashes present');
        matches.push({
            program: 'hsip', reasons, reason: reasons.join('; '),
            strength: infraPatterns.length >= 2 ? 'strong' : 'moderate',
            evidence: { significantPatterns: infraPatterns }
        });
    }

    // 402
    if ((significance.speed && significance.speed.significant) ||
        (patterns.distracted >= 3) ||
        (significance.impaired && significance.impaired.significant && ori.impaired && ori.impaired.ori < 2.0)) {
        const reasons = [];
        if (significance.speed?.significant) reasons.push(`Speed ORI: ${ori.speed.ori.toFixed(1)}x`);
        if (patterns.distracted >= 3) reasons.push('Distracted driving cluster');
        matches.push({
            program: '402', reasons, reason: reasons.join('; '),
            strength: (significance.speed?.significant && ori.speed && ori.speed.ori > 2.0) ? 'strong' : 'moderate'
        });
    }

    // 405d
    if (significance.impaired && significance.impaired.significant) {
        const reasons = [`Impaired: ${patterns.impaired} crashes, ORI ${ori.impaired.ori.toFixed(1)}x`];
        if (patterns.weekendNight >= 3) reasons.push('Weekend night corridor pattern');
        matches.push({
            program: '405d', reasons, reason: reasons.join('; '),
            strength: ori.impaired.ori > 2.0 ? 'strong' : 'moderate'
        });
    }

    return matches;
}

/**
 * Best grant match using evidence-based scoring (replaces getBestMatchProgramEnhanced).
 */
function getImprovedBestMatch(locationData, patterns, baselines) {
    const ori = calculateORI(patterns, baselines);
    const significance = testPatternSignificance(patterns, baselines);
    const psi = calculatePSI(locationData, baselines);
    const feasibility = calculateFeasibilityAndBC(locationData, patterns, ori, significance);
    const grantFit = calculateGrantFitScores(locationData, patterns, ori, significance, psi, feasibility);

    const scores = [
        { program: 'hsip',  score: grantFit.hsip.score },
        { program: 'ss4a',  score: grantFit.ss4a.score },
        { program: '402',   score: grantFit.n402.score },
        { program: '405d',  score: grantFit.n405d.score }
    ].sort((a, b) => b.score - a.score);

    return scores[0].program;
}

// Generate cache key for grant ranking (for cache invalidation)
function getGrantRankingCacheKey() {
    return JSON.stringify({
        dateStart: grantState.dateRange.startDate,
        dateEnd: grantState.dateRange.endDate,
        aggregationLevel: grantState.aggregationLevel,
        scoringProfile: grantState.scoringProfile,
        minCrashThreshold: grantState.minCrashThreshold,
        useRateBasedScoring: grantState.useRateBasedScoring,
        crashDataHash: crashState.totalRows + '_' + crashState.sampleRows.length
    });
}

// Show/hide grant ranking progress indicator
function showGrantRankingProgress(show, status = '', percent = 0) {
    const progressEl = document.getElementById('grantRankingProgress');
    const statusEl = document.getElementById('grantRankingStatus');
    const barEl = document.getElementById('grantRankingBar');
    if (progressEl) {
        progressEl.style.display = show ? 'block' : 'none';
        if (statusEl) statusEl.textContent = status;
        if (barEl) barEl.style.width = percent + '%';
    }
}

// Async helper to yield to UI thread
function yieldToUI() {
    return new Promise(resolve => setTimeout(resolve, 0));
}

  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.grants=CL.grants||{};
  CL.grants.rank=CL.grants.rank||{};
  // dual public API — all 25 moved fns (HTML onclick / inline 27d /
  // grants-ui.js back-compat). 3 consts stay module-private.
  window.analyzeCrashPatterns = CL.grants.rank.analyzeCrashPatterns = analyzeCrashPatterns;
  window.calculateSeverityTrend = CL.grants.rank.calculateSeverityTrend = calculateSeverityTrend;
  window.calculateEnhancedGrantScore_legacy = CL.grants.rank.calculateEnhancedGrantScore_legacy = calculateEnhancedGrantScore_legacy;
  window.getMatchingGrantsEnhanced_legacy = CL.grants.rank.getMatchingGrantsEnhanced_legacy = getMatchingGrantsEnhanced_legacy;
  window.getBestMatchProgramEnhanced_legacy = CL.grants.rank.getBestMatchProgramEnhanced_legacy = getBestMatchProgramEnhanced_legacy;
  window.getBestMatchProgram = CL.grants.rank.getBestMatchProgram = getBestMatchProgram;
  window.getMatchingGrants = CL.grants.rank.getMatchingGrants = getMatchingGrants;
  window.calculateCountyBaselines = CL.grants.rank.calculateCountyBaselines = calculateCountyBaselines;
  window.calculateORI = CL.grants.rank.calculateORI = calculateORI;
  window.normalCDF = CL.grants.rank.normalCDF = normalCDF;
  window.testPatternSignificance = CL.grants.rank.testPatternSignificance = testPatternSignificance;
  window.calculatePSI = CL.grants.rank.calculatePSI = calculatePSI;
  window.calculateFeasibilityAndBC = CL.grants.rank.calculateFeasibilityAndBC = calculateFeasibilityAndBC;
  window.calculateFeasibilitySubScore = CL.grants.rank.calculateFeasibilitySubScore = calculateFeasibilitySubScore;
  window.calculateGrantFitScores = CL.grants.rank.calculateGrantFitScores = calculateGrantFitScores;
  window.calculateHSIPFit = CL.grants.rank.calculateHSIPFit = calculateHSIPFit;
  window.calculateSS4AFit = CL.grants.rank.calculateSS4AFit = calculateSS4AFit;
  window.calculate402Fit = CL.grants.rank.calculate402Fit = calculate402Fit;
  window.calculate405dFit = CL.grants.rank.calculate405dFit = calculate405dFit;
  window.calculateImprovedGrantScore = CL.grants.rank.calculateImprovedGrantScore = calculateImprovedGrantScore;
  window.getImprovedGrantMatches = CL.grants.rank.getImprovedGrantMatches = getImprovedGrantMatches;
  window.getImprovedBestMatch = CL.grants.rank.getImprovedBestMatch = getImprovedBestMatch;
  window.getGrantRankingCacheKey = CL.grants.rank.getGrantRankingCacheKey = getGrantRankingCacheKey;
  window.showGrantRankingProgress = CL.grants.rank.showGrantRankingProgress = showGrantRankingProgress;
  window.yieldToUI = CL.grants.rank.yieldToUI = yieldToUI;
  CL._registerModule('grants/grants-rank-score');
  if (typeof window !== 'undefined') window.CRASH_PATTERN_REGEX = CRASH_PATTERN_REGEX;
})();
