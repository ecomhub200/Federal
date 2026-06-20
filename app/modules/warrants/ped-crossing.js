/**
 * CL warrants.pedCrossing — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.warrants.pedCrossing.<fn>; any
 * module-private state stays inside this IIFE (no external refs).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
function evaluatePedScreening() {
    const distance = parseFloat(document.getElementById('pedCrosswalkDist').value) || 0;
    const speed = parseFloat(document.getElementById('pedPostedSpeed').value) || 0;
    const grade = parseInt(document.getElementById('pedRoadGrade')?.value) || 0;
    const sightDist = parseFloat(document.getElementById('pedSightDist').value) || 0;

    let allPass = true;
    let results = [];

    // Spacing requirement (min 300 ft)
    if (distance > 0) {
        if (distance < 300) {
            results.push({ pass: false, text: `❌ Spacing: ${distance} ft < 300 ft minimum` });
            allPass = false;
        } else {
            results.push({ pass: true, text: `✓ Spacing: ${distance} ft ≥ 300 ft` });
        }
    }

    // Speed limit check (max 55 mph for unsignalized crossings)
    if (speed > 55) {
        results.push({ pass: false, text: `❌ Speed Limit: ${speed} mph > 55 mph maximum for unsignalized crossings` });
        allPass = false;
    } else if (speed > 0) {
        results.push({ pass: true, text: `✓ Speed Limit: ${speed} mph ≤ 55 mph` });
    }

    // Sight distance requirement (grade-adjusted per IIM Table 2)
    if (speed > 0 && speed <= 55 && sightDist > 0) {
        const requiredSSD = getRequiredSSD(speed, grade);
        const gradeText = grade !== 0 ? ` at ${grade > 0 ? '+' : ''}${grade}% grade` : '';
        if (sightDist < requiredSSD) {
            results.push({ pass: false, text: `❌ Sight Distance: ${sightDist} ft < ${requiredSSD} ft required${gradeText}` });
            allPass = false;
        } else {
            results.push({ pass: true, text: `✓ Sight Distance: ${sightDist} ft ≥ ${requiredSSD} ft${gradeText}` });
        }
    }

    const resultDiv = document.getElementById('pedScreeningResult');
    if (results.length > 0) {
        const boxClass = allPass ? 'pass' : 'fail';
        resultDiv.innerHTML = `
            <div class="warrant-result-box ${boxClass}">
                <h4>${allPass ? '✓ Safety Screening PASSED' : '❌ Safety Screening FAILED'}</h4>
                ${results.map(r => `<p>${r.text}</p>`).join('')}
                ${allPass ? '<p><strong>Proceed to Step 3: Installation Criteria</strong></p>' : '<p><strong>A crosswalk SHALL NOT be installed at this location.</strong></p>'}
            </div>
        `;

        // Show/hide step 3
        document.getElementById('pedStep3').style.display = allPass ? 'block' : 'none';
        if (!allPass) {
            document.getElementById('pedStep4').style.display = 'none';
            document.getElementById('pedStep5').style.display = 'none';
        }
    }
}

// Grade-adjusted Stopping Sight Distance Table (per VDOT IIM-TE-384.1 Table 2)
const PED_SSD_TABLE = {
    // speed: { grade: SSD in feet }
    25: { '-9': 173, '-6': 165, '-3': 158, '0': 155, '3': 147, '6': 143, '9': 140 },
    30: { '-9': 227, '-6': 215, '-3': 205, '0': 200, '3': 200, '6': 184, '9': 179 },
    35: { '-9': 287, '-6': 271, '-3': 257, '0': 250, '3': 237, '6': 229, '9': 222 },
    40: { '-9': 354, '-6': 333, '-3': 315, '0': 305, '3': 289, '6': 278, '9': 269 },
    45: { '-9': 427, '-6': 400, '-3': 378, '0': 360, '3': 344, '6': 331, '9': 320 },
    50: { '-9': 507, '-6': 474, '-3': 446, '0': 425, '3': 405, '6': 388, '9': 375 },
    55: { '-9': 593, '-6': 553, '-3': 520, '0': 495, '3': 469, '6': 450, '9': 433 }
};

// Get required stopping sight distance based on speed and grade
function getRequiredSSD(speed, grade = 0) {
    // Speeds > 55 mph should not have marked crosswalks
    if (speed > 55) return 999999;

    // Find closest speed in table
    const speeds = [25, 30, 35, 40, 45, 50, 55];
    let closestSpeed = speeds.reduce((prev, curr) =>
        Math.abs(curr - speed) < Math.abs(prev - speed) ? curr : prev
    );

    // Get grade key
    const gradeKey = String(grade);
    const gradeKeys = ['-9', '-6', '-3', '0', '3', '6', '9'];
    let closestGrade = gradeKeys.reduce((prev, curr) =>
        Math.abs(parseInt(curr) - grade) < Math.abs(parseInt(prev) - grade) ? curr : prev
    );

    return PED_SSD_TABLE[closestSpeed]?.[closestGrade] || PED_SSD_TABLE[closestSpeed]?.['0'] || 200;
}

// Update required SSD display based on speed and grade
function updatePedSSDRequired() {
    const speed = parseFloat(document.getElementById('pedPostedSpeed')?.value) || 0;
    const grade = parseInt(document.getElementById('pedRoadGrade')?.value) || 0;
    const ssdInput = document.getElementById('pedSSDRequired');

    if (speed > 0 && ssdInput) {
        if (speed > 55) {
            ssdInput.value = 'N/A (>55 mph)';
            ssdInput.style.color = '#dc2626';
        } else {
            const required = getRequiredSSD(speed, grade);
            ssdInput.value = `${required} ft`;
            ssdInput.style.color = '#334155';
        }
    } else if (ssdInput) {
        ssdInput.value = '--';
    }

    // Re-evaluate screening with new SSD
    evaluatePedScreening();
}

// Update context-based spacing for Criterion D
function updatePedContextSpacing() {
    const context = document.getElementById('pedContextClass')?.value || '';
    const critDLabel = document.querySelector('label[for="pedCritD"] span, #pedCritD')?.closest('label')?.querySelector('span');

    if (critDLabel) {
        const isUrban = context === 'urban' || context === 'urban_core';
        const spacing = isUrban ? '600' : '1,000';
        const contextLabel = isUrban ? 'urban' : 'suburban/rural';
        critDLabel.innerHTML = `<strong>D:</strong> >${spacing} ft (${contextLabel} context) to nearest crosswalk`;
    }
}

// Update pedestrian form Street View status indicator
function updatePedStreetViewStatus() {
    const locationInput = document.getElementById('pedProjectLocation');
    const indicator = document.getElementById('pedSvIndicator');
    const svBtn = document.getElementById('pedStreetViewBtn');

    if (!locationInput || !indicator || !svBtn) return;

    const location = locationInput.value.trim();
    if (!location) {
        // No location entered - neutral state
        indicator.style.background = '#94a3b8'; // gray
        indicator.title = 'Enter a location name';
        svBtn.style.background = '#94a3b8';
        svBtn.style.cursor = 'not-allowed';
        return;
    }

    // Check if crash data is loaded
    if (!crashState.loaded || !crashState.sampleRows || crashState.sampleRows.length === 0) {
        indicator.style.background = '#94a3b8'; // gray
        indicator.title = 'Load crash data first';
        svBtn.style.background = '#94a3b8';
        svBtn.style.cursor = 'not-allowed';
        return;
    }

    // Try to find crashes for this location (checking both route and node)
    const hasCoords = hasValidCoordsForLocation(location, 'node') || hasValidCoordsForLocation(location, 'route');

    if (hasCoords) {
        // Green - coordinates available
        indicator.style.background = '#10b981';
        indicator.title = 'Street View available - click to view';
        svBtn.style.background = '#0ea5e9';
        svBtn.style.cursor = 'pointer';
    } else {
        // Red - no coordinates found
        indicator.style.background = '#dc2626';
        indicator.title = 'No coordinates found for this location - try using "&" instead of "and"';
        svBtn.style.background = '#dc2626';
        svBtn.style.cursor = 'help';
    }
}

// Open Street View for the pedestrian form location
function openPedStreetView() {
    const locationInput = document.getElementById('pedProjectLocation');
    if (!locationInput) return;

    const location = locationInput.value.trim();
    if (!location) {
        alert('Please enter a project location first.');
        return;
    }

    // Try node first (intersection), then route
    const nodeType = hasValidCoordsForLocation(location, 'node') ? 'node' : 'route';
    openStreetViewForLocation(location, nodeType);
}

// Load and analyze pedestrian crash data from warrants state
function ped_loadCrashData() {
    const noDataDiv = document.getElementById('pedCrashNoData');
    const contentDiv = document.getElementById('pedCrashDataContent');
    const clusterAlert = document.getElementById('pedCrashClusterAlert');

    if (!noDataDiv || !contentDiv) return;

    // Check if we have location data
    if (!warrantsState.filteredCrashes || warrantsState.filteredCrashes.length === 0) {
        noDataDiv.style.display = 'block';
        contentDiv.style.display = 'none';
        if (clusterAlert) clusterAlert.style.display = 'none';
        return;
    }

    noDataDiv.style.display = 'none';
    contentDiv.style.display = 'block';

    // Filter for pedestrian crashes using isYes helper for consistent flag checking
    // (handles Y, Yes, yes, 1, true - matching createPseudoRows and sampleRows formats)
    const pedCrashes = warrantsState.filteredCrashes.filter(crash => {
        return isYes(crash[COL.PED]);
    });

    // Calculate statistics
    let K = 0, A = 0, B = 0, C = 0, O = 0;
    let nighttime = 0, wetSurface = 0, atIntersection = 0;

    pedCrashes.forEach(crash => {
        const severity = (crash[COL.SEVERITY] || '').toUpperCase().charAt(0);
        switch(severity) {
            case 'K': K++; break;
            case 'A': A++; break;
            case 'B': B++; break;
            case 'C': C++; break;
            default: O++;
        }

        // Check conditions
        const light = (crash[COL.LIGHT] || '').toLowerCase();
        if (light.includes('dark') || light.includes('night')) nighttime++;

        const surface = (crash[COL.SURFACE] || '').toLowerCase();
        if (surface.includes('wet') || surface.includes('rain') || surface.includes('snow') || surface.includes('ice')) wetSurface++;

        const intType = (crash[COL.INT_TYPE] || '').toLowerCase();
        if (intType && !intType.includes('non') && !intType.includes('midblock')) atIntersection++;
    });

    const total = pedCrashes.length;
    const kaCount = K + A;
    const bcCount = B + C;
    const epdo = (K * EPDO_WEIGHTS.K) + (A * EPDO_WEIGHTS.A) + (B * EPDO_WEIGHTS.B) + (C * EPDO_WEIGHTS.C) + (O * EPDO_WEIGHTS.O);

    // Update UI
    document.getElementById('pedCrashTotal').textContent = total;
    document.getElementById('pedCrashKA').textContent = kaCount;
    document.getElementById('pedCrashBC').textContent = bcCount;
    document.getElementById('pedCrashEPDO').textContent = epdo.toLocaleString();

    document.getElementById('pedCrashNight').textContent = total > 0 ? `${nighttime} (${Math.round(nighttime/total*100)}%)` : '--';
    document.getElementById('pedCrashWet').textContent = total > 0 ? `${wetSurface} (${Math.round(wetSurface/total*100)}%)` : '--';
    document.getElementById('pedCrashInt').textContent = total > 0 ? `${atIntersection} (${Math.round(atIntersection/total*100)}%)` : '--';

    // PSAP Crash Cluster Analysis (per IIM-TE-384.1 Criterion E)
    // A crash cluster is typically defined as 3+ crashes within 36 months
    const psapStatus = document.getElementById('pedPSAPStatus');
    const isCrashCluster = total >= 3 || kaCount >= 1;

    if (psapStatus) {
        if (isCrashCluster) {
            psapStatus.innerHTML = `
                <div style="color:#dc2626;font-weight:600">
                    <span>🚨</span> CRASH CLUSTER DETECTED
                </div>
                <div style="color:#64748b;font-size:.8rem;margin-top:.25rem">
                    ${total} pedestrian crash${total !== 1 ? 'es' : ''} (${kaCount} fatal/serious) in analysis period
                </div>
            `;
            if (clusterAlert) clusterAlert.style.display = 'block';

            // Auto-check Criterion E
            const critE = document.getElementById('pedCritE');
            if (critE && !critE.checked) {
                critE.checked = true;
                evaluatePedCriteria();
            }
        } else if (total > 0) {
            psapStatus.innerHTML = `
                <div style="color:#f59e0b;font-weight:600">
                    <span>⚠️</span> Elevated Concern
                </div>
                <div style="color:#64748b;font-size:.8rem;margin-top:.25rem">
                    ${total} pedestrian crash${total !== 1 ? 'es' : ''} - review for PSAP corridor status
                </div>
            `;
            if (clusterAlert) clusterAlert.style.display = 'none';
        } else {
            psapStatus.innerHTML = `
                <div style="color:#22c55e;font-weight:600">
                    <span>✓</span> No Pedestrian Crashes
                </div>
                <div style="color:#64748b;font-size:.8rem;margin-top:.25rem">
                    Check VDOT PSAP map for corridor priority status
                </div>
            `;
            if (clusterAlert) clusterAlert.style.display = 'none';
        }
    }

    console.log('[Ped Crossing] Crash data loaded:', { total, K, A, B, C, O, epdo, isCrashCluster });
}

function evaluatePedCriteria() {
    const critA = document.getElementById('pedCritA').checked;
    const critB = document.getElementById('pedCritB').checked;
    const critC = document.getElementById('pedCritC').checked;
    const critD = document.getElementById('pedCritD').checked;
    const critE = document.getElementById('pedCritE').checked;
    const pedCount = parseFloat(document.getElementById('pedPedCount').value) || 0;

    const metCount = [critA, critB, critC, critD, critE].filter(Boolean).length;

    let recommendation = '';
    let boxClass = 'info';

    if (metCount === 5 || pedCount >= 20) {
        recommendation = `
            <h4>✓ SHALL Install Crosswalk</h4>
            <p><strong>Criteria Met:</strong> ${metCount} of 5${pedCount >= 20 ? ' + 20+ pedestrians/hour' : ''}</p>
            <p>A marked crosswalk SHALL be installed. Proceed to Step 4 for tier determination.</p>
        `;
        boxClass = 'pass';
        document.getElementById('pedStep4').style.display = 'block';
    } else if (metCount >= 3) {
        recommendation = `
            <h4>✓ SHOULD Install Crosswalk</h4>
            <p><strong>Criteria Met:</strong> ${metCount} of 5</p>
            <p>A marked crosswalk SHOULD be installed. Proceed to Step 4 for tier determination.</p>
        `;
        boxClass = 'pass';
        document.getElementById('pedStep4').style.display = 'block';
    } else if (metCount >= 1) {
        recommendation = `
            <h4>⚠️ MAY Install Crosswalk</h4>
            <p><strong>Criteria Met:</strong> ${metCount} of 5</p>
            <p>A marked crosswalk MAY be installed based on engineering judgment.</p>
        `;
        boxClass = 'warning';
        document.getElementById('pedStep4').style.display = 'block';
    } else {
        recommendation = `
            <h4>❌ DO NOT Install Crosswalk</h4>
            <p><strong>Criteria Met:</strong> 0 of 5</p>
            <p>No crosswalk installation criteria are met.</p>
        `;
        boxClass = 'fail';
        document.getElementById('pedStep4').style.display = 'none';
    }

    document.getElementById('pedCriteriaResult').innerHTML = `<div class="warrant-result-box ${boxClass}">${recommendation}</div>`;
}

// Complete Tier Tables per VDOT IIM-TE-384.1 Tables 3 & 4
// Structure: [config][adt][speedCategory] = { tier, code }
// Speed categories: '<=30', '35', '>=40'
// ADT categories: '1500-9000', '9000-12000', '12000-15000', '15000+'
const PED_TIER_TABLE_UNDIVIDED = {
    // Table 3: Undivided/Single-Lane Roads
    'single_oneway': {
        '1500-9000':  { '<=30': {t:1,c:'VE/TC'}, '35': {t:1,c:'VE/TC'}, '>=40': {t:1,c:'VE/TC'} },
        '9000-12000': { '<=30': {t:1,c:'VE/TC'}, '35': {t:1,c:'VE/TC'}, '>=40': {t:1,c:'VE/TC'} },
        '12000-15000':{ '<=30': {t:1,c:'VE/TC'}, '35': {t:1,c:'VE/TC'}, '>=40': {t:1,c:'VE/TC'} },
        '15000+':     { '<=30': {t:1,c:'VE/TC'}, '35': {t:1,c:'VE/TC'}, '>=40': {t:1,c:'VE/TC'} }
    },
    '2lane_undivided': {
        '1500-9000':  { '<=30': {t:1,c:'VE/TC'}, '35': {t:1,c:'VE/TC'}, '>=40': {t:2,c:'VE/RRFB'} },
        '9000-12000': { '<=30': {t:1,c:'VE/TC'}, '35': {t:1,c:'VE/TC'}, '>=40': {t:2,c:'VE/RRFB'} },
        '12000-15000':{ '<=30': {t:1,c:'VE/TC'}, '35': {t:2,c:'VE/RRFB'}, '>=40': {t:2,c:'VE/RRFB'} },
        '15000+':     { '<=30': {t:2,c:'VE/RRFB'}, '35': {t:2,c:'VE/RRFB'}, '>=40': {t:4,c:'PHB'} }
    },
    '3lane_turn': {
        '1500-9000':  { '<=30': {t:1,c:'VE/TC'}, '35': {t:2,c:'VE/RI'}, '>=40': {t:2,c:'RI/RRFB'} },
        '9000-12000': { '<=30': {t:2,c:'VE/RI'}, '35': {t:2,c:'RI/RRFB'}, '>=40': {t:2,c:'RI/RRFB'} },
        '12000-15000':{ '<=30': {t:2,c:'RI/RRFB'}, '35': {t:2,c:'RI/RRFB'}, '>=40': {t:3,c:'PHB/RD'} },
        '15000+':     { '<=30': {t:2,c:'RI/RRFB'}, '35': {t:3,c:'PHB/RD'}, '>=40': {t:3,c:'PHB/RD'} }
    },
    '4lane_undivided': {
        '1500-9000':  { '<=30': {t:3,c:'RD/RRFB'}, '35': {t:3,c:'RD/RRFB'}, '>=40': {t:3,c:'PHB/RD'} },
        '9000-12000': { '<=30': {t:3,c:'RD/RRFB'}, '35': {t:3,c:'RD/RRFB'}, '>=40': {t:3,c:'PHB/RD'} },
        '12000-15000':{ '<=30': {t:3,c:'RD/RRFB'}, '35': {t:3,c:'PHB/RD'}, '>=40': {t:3,c:'PHB/RD'} },
        '15000+':     { '<=30': {t:3,c:'PHB/RD'}, '35': {t:3,c:'PHB/RD'}, '>=40': {t:3,c:'PHB/RD'} }
    },
    '5lane_turn': {
        '1500-9000':  { '<=30': {t:3,c:'RD/RRFB'}, '35': {t:3,c:'PHB/RD'}, '>=40': {t:3,c:'PHB/RD'} },
        '9000-12000': { '<=30': {t:3,c:'RD/RRFB'}, '35': {t:3,c:'PHB/RD'}, '>=40': {t:3,c:'PHB/RD'} },
        '12000-15000':{ '<=30': {t:3,c:'PHB/RD'}, '35': {t:3,c:'PHB/RD'}, '>=40': {t:3,c:'PHB/RD'} },
        '15000+':     { '<=30': {t:3,c:'PHB/RD'}, '35': {t:3,c:'PHB/RD'}, '>=40': {t:3,c:'PHB/RD'} }
    },
    '6lane_undivided': {
        '1500-9000':  { '<=30': {t:3,c:'PHB/RD'}, '35': {t:3,c:'PHB/RD'}, '>=40': {t:3,c:'PHB/RD'} },
        '9000-12000': { '<=30': {t:4,c:'RD'}, '35': {t:3,c:'PHB/RD'}, '>=40': {t:3,c:'PHB/RD'} },
        '12000-15000':{ '<=30': {t:3,c:'PHB/RD'}, '35': {t:3,c:'PHB/RD'}, '>=40': {t:3,c:'PHB/RD'} },
        '15000+':     { '<=30': {t:3,c:'PHB/RD'}, '35': {t:3,c:'PHB/RD'}, '>=40': {t:3,c:'PHB/RD'} }
    }
};

const PED_TIER_TABLE_DIVIDED = {
    // Table 4: Divided or One-Way Roads
    '2lane_divided': {
        '1500-9000':  { '<=30': {t:1,c:'VE/TC'}, '35': {t:1,c:'VE/RI'}, '>=40': {t:2,c:'RRFB/RI'} },
        '9000-12000': { '<=30': {t:1,c:'VE/TC'}, '35': {t:1,c:'VE/RI'}, '>=40': {t:2,c:'RRFB/RI'} },
        '12000-15000':{ '<=30': {t:1,c:'VE/RI'}, '35': {t:2,c:'RRFB/RI'}, '>=40': {t:2,c:'RRFB/RI'} },
        '15000+':     { '<=30': {t:2,c:'RRFB/RI'}, '35': {t:2,c:'RRFB/RI'}, '>=40': {t:4,c:'PHB'} }
    },
    '2lane_oneway': {
        '1500-9000':  { '<=30': {t:1,c:'VE/ADV'}, '35': {t:2,c:'ADV/RRFB'}, '>=40': {t:3,c:'RD/RRFB'} },
        '9000-12000': { '<=30': {t:1,c:'VE/ADV'}, '35': {t:3,c:'RD/RRFB'}, '>=40': {t:3,c:'RD/PHB'} },
        '12000-15000':{ '<=30': {t:2,c:'ADV/RRFB'}, '35': {t:3,c:'RD/RRFB'}, '>=40': {t:3,c:'RD/PHB'} },
        '15000+':     { '<=30': {t:3,c:'RD/RRFB'}, '35': {t:3,c:'RD/RRFB'}, '>=40': {t:3,c:'RD/PHB'} }
    },
    '4lane_divided': {
        '1500-9000':  { '<=30': {t:3,c:'RD/RRFB'}, '35': {t:3,c:'RD/RRFB'}, '>=40': {t:3,c:'RD/PHB'} },
        '9000-12000': { '<=30': {t:3,c:'RD/RRFB'}, '35': {t:3,c:'RD/RRFB'}, '>=40': {t:3,c:'RD/PHB'} },
        '12000-15000':{ '<=30': {t:3,c:'RD/RRFB'}, '35': {t:3,c:'RD/RRFB'}, '>=40': {t:3,c:'RD/PHB'} },
        '15000+':     { '<=30': {t:3,c:'RD/RRFB'}, '35': {t:3,c:'RD/PHB'}, '>=40': {t:3,c:'RD/PHB'} }
    },
    '3lane_oneway': {
        '1500-9000':  { '<=30': {t:3,c:'RD/RRFB'}, '35': {t:3,c:'RD/RRFB'}, '>=40': {t:3,c:'RD/PHB'} },
        '9000-12000': { '<=30': {t:3,c:'RD/RRFB'}, '35': {t:3,c:'RD/PHB'}, '>=40': {t:3,c:'RD/PHB'} },
        '12000-15000':{ '<=30': {t:3,c:'RD/PHB'}, '35': {t:3,c:'RD/PHB'}, '>=40': {t:3,c:'RD/PHB'} },
        '15000+':     { '<=30': {t:3,c:'RD/PHB'}, '35': {t:3,c:'RD/PHB'}, '>=40': {t:3,c:'RD/PHB'} }
    },
    '6lane_divided': {
        '1500-9000':  { '<=30': {t:3,c:'RD/RRFB'}, '35': {t:3,c:'RD/PHB'}, '>=40': {t:3,c:'RD/PHB'} },
        '9000-12000': { '<=30': {t:3,c:'RD/PHB'}, '35': {t:3,c:'RD/PHB'}, '>=40': {t:3,c:'RD/PHB'} },
        '12000-15000':{ '<=30': {t:3,c:'RD/PHB'}, '35': {t:3,c:'RD/PHB'}, '>=40': {t:3,c:'RD/PHB'} },
        '15000+':     { '<=30': {t:3,c:'RD/PHB'}, '35': {t:3,c:'RD/PHB'}, '>=40': {t:3,c:'RD/PHB'} }
    }
};

// Countermeasure code expansions
const PED_COUNTERMEASURE_CODES = {
    'VE': 'Visibility Enhancements (in-street signs, parking restriction, curb extension)',
    'TC': 'Traffic Calming Measures (raised crosswalk for speeds <35 mph)',
    'RI': 'Refuge Island with in-street signs',
    'RRFB': 'Rectangular Rapid Flashing Beacon',
    'RD': 'Roadway Reconfiguration (road diet to reduce lanes)',
    'PHB': 'Pedestrian Hybrid Beacon (HAWK signal)',
    'ADV': 'Advance yield markings and R1-5 signs'
};

function determinePedTier() {
    const config = document.getElementById('pedRoadConfig').value;
    const adt = document.getElementById('pedTrafficADT').value;
    const speed = parseFloat(document.getElementById('pedPostedSpeed').value) || 0;

    if (!config || !adt) return;

    // Determine speed category
    let speedCat = '<=30';
    if (speed > 35) speedCat = '>=40';
    else if (speed > 30) speedCat = '35';

    // Determine if divided or undivided
    const isDivided = config.includes('divided') || config.includes('oneway');
    const tierTable = isDivided ? PED_TIER_TABLE_DIVIDED : PED_TIER_TABLE_UNDIVIDED;

    // Lookup tier and countermeasures
    let result = tierTable[config]?.[adt]?.[speedCat];

    // Fallback for configs not in divided table
    if (!result && isDivided) {
        result = PED_TIER_TABLE_UNDIVIDED[config]?.[adt]?.[speedCat];
    }

    // Default fallback
    if (!result) {
        result = { t: 2, c: 'RRFB/RI' };
    }

    // Apply Tier 4 override for high-speed/high-volume (per IIM footnote)
    if (adt === '15000+' && speed >= 45) {
        result = { t: 4, c: 'PHB/RD' };
    }

    const tier = result.t;
    const codes = result.c.split('/');

    // Build countermeasure descriptions
    const cmDescriptions = codes.map(code => {
        const desc = PED_COUNTERMEASURE_CODES[code.trim()];
        return desc ? `<li><strong>${code}:</strong> ${desc}</li>` : `<li>${code}</li>`;
    }).join('');

    // Tier descriptions per IIM
    const tierDescriptions = {
        1: { title: 'TIER 1 - Low Risk', color: '#22c55e', bg: '#dcfce7',
             req: 'High-visibility crosswalk with W11-2 signage required. Consider visibility enhancements.' },
        2: { title: 'TIER 2 - Moderate Risk', color: '#0ea5e9', bg: '#e0f2fe',
             req: 'High-visibility crosswalk required. Refuge Island and/or RRFB recommended.' },
        3: { title: 'TIER 3 - Elevated Risk', color: '#f59e0b', bg: '#fef3c7',
             req: 'High-visibility crosswalk required. Engineering study required. PHB or roadway reconfiguration recommended.' },
        4: { title: 'TIER 4 - High Risk', color: '#dc2626', bg: '#fee2e2',
             req: 'High-visibility crosswalk required. Engineering study required. PHB strongly recommended. Consider signal warrant analysis.' }
    };

    const tierInfo = tierDescriptions[tier] || tierDescriptions[2];
    const needsStudy = tier >= 3;

    document.getElementById('pedTierResult').innerHTML = `
        <div class="warrant-tier-display" style="background:${tierInfo.bg};border-left:4px solid ${tierInfo.color}">
            <div class="tier-label" style="color:${tierInfo.color}">${tierInfo.title}</div>
            <div class="tier-number" style="color:${tierInfo.color}">TIER ${tier}</div>
        </div>
        <div class="warrant-result-box info" style="margin-top:1rem">
            <h4>Requirements (per IIM-TE-384.1)</h4>
            <p>${tierInfo.req}</p>
            <h4 style="margin-top:.75rem">Recommended Countermeasures</h4>
            <ul style="margin-left:1rem;font-size:.9rem">${cmDescriptions}</ul>
            ${needsStudy ? `
                <div style="margin-top:1rem;padding:.75rem;background:#fef3c7;border-radius:6px;border-left:3px solid #f59e0b">
                    <strong>⚠️ Engineering Study Required</strong>
                    <p style="font-size:.85rem;margin-top:.25rem">Tier 3/4 locations require an engineering study per VDOT IIM-TE-384.1 to determine final countermeasures.</p>
                </div>
            ` : ''}
        </div>
    `;

    document.getElementById('pedStep5').style.display = 'block';

    // Show/hide engineering study section based on tier
    const engStudySection = document.getElementById('pedEngStudySection');
    if (engStudySection) {
        engStudySection.style.display = needsStudy ? 'block' : 'none';
        // Auto-set study date to today if not set
        const studyDateInput = document.getElementById('pedEngStudyDate');
        if (needsStudy && studyDateInput && !studyDateInput.value) {
            studyDateInput.value = new Date().toISOString().split('T')[0];
        }
    }
}

function determinePedMarking() {
    const stopControlled = document.querySelector('input[name="pedStopControlled"]:checked');
    if (!stopControlled) return;

    let result = '';
    if (stopControlled.value === 'yes') {
        result = `
            <div class="warrant-result-box info">
                <h4>Standard Crosswalk Marking</h4>
                <p><strong>Pattern:</strong> Two parallel white lines (transverse)</p>
                <p><strong>Width:</strong> 6-12 inches (typically 6")</p>
                <p><strong>Crosswalk Width:</strong> Minimum 6 feet</p>
            </div>
        `;
    } else {
        result = `
            <div class="warrant-result-box info">
                <h4>High-Visibility Crosswalk Required</h4>
                <p><strong>Recommended:</strong> Bar Pairs Pattern (8/8/8 design)</p>
                <p><strong>Alternative:</strong> Longitudinal Lines (Continental)</p>
                <p><strong>Advantages:</strong> Better visibility, less slippery for cyclists</p>
            </div>
        `;
    }
    document.getElementById('pedMarkingResult').innerHTML = result;
}

/**
 * Generate PDF Report for Pedestrian Crossing Warrant Analysis
 * Per VDOT IIM-TE-384.1 format
 */
async function ped_generatePDFReport() {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        showToast('PDF library not loaded. Please try again.', 'error');
        return;
    }

    showLoading('Generating PDF report with location map...');

    try {
    const doc = new jsPDF('p', 'mm', 'letter');

    // Colors matching VDOT branding
    const vdotBlue = [0, 51, 102];
    const greenPass = [22, 163, 74];
    const orangeWarn = [245, 158, 11];
    const redFail = [220, 38, 38];
    const headerBg = [45, 55, 72];

    let yPos = 15;

    // ========== HEADER ==========
    doc.setFillColor(...vdotBlue);
    doc.rect(0, 0, 220, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Pedestrian Crossing Evaluation', 15, 14);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('VDOT IIM-TE-384.1 - Pedestrian Crossing Accommodations', 15, 22);
    doc.text('at Unsignalized Approaches', 15, 27);

    yPos = 38;
    doc.setTextColor(0, 0, 0);

    // ========== LOCATION INFO BOX ==========
    doc.setFillColor(245, 245, 245);
    doc.rect(15, yPos, 180, 30, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, yPos, 180, 30, 'S');

    const locationName = document.getElementById('pedProjectLocation')?.value || 'Not specified';
    const evalDate = document.getElementById('pedEvalDate')?.value || new Date().toISOString().split('T')[0];
    const evaluator = document.getElementById('pedEvaluator')?.value || 'Not specified';
    const evalTitle = document.getElementById('pedEvalTitle')?.value || '';
    const contextClass = document.getElementById('pedContextClass')?.value || '';
    const contextLabel = { 'rural': 'Rural', 'rural_town': 'Rural Town', 'suburban': 'Suburban', 'urban': 'Urban', 'urban_core': 'Urban Core' }[contextClass] || '--';

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(locationName, 20, yPos + 8);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Evaluation Date: ${evalDate}`, 20, yPos + 16);
    doc.text(`Context: ${contextLabel}`, 100, yPos + 16);
    doc.text(`Evaluator: ${evaluator}${evalTitle ? ' (' + evalTitle + ')' : ''}`, 20, yPos + 24);

    yPos += 40;

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

    // ========== STEP 1: SAFETY SCREENING ==========
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...vdotBlue);
    doc.text('STEP 1: SAFETY SCREENING (Table 1)', 15, yPos);
    yPos += 6;
    doc.setTextColor(0, 0, 0);

    const postedSpeed = document.getElementById('pedPostedSpeed')?.value || '--';
    const roadGrade = document.getElementById('pedRoadGrade')?.value || '0';
    const ssdRequired = document.getElementById('pedSSDRequired')?.value || '--';
    const ssdAvailable = document.getElementById('pedSSDAvailable')?.value || '--';

    // Check pass/fail status
    const speedCheck = parseInt(postedSpeed) <= 55;
    const ssdCheck = parseInt(ssdAvailable) >= parseInt(ssdRequired?.replace(/[^\d]/g, '')) || ssdAvailable === '--';

    const screeningData = [
        ['Posted Speed', `${postedSpeed} mph`, '≤55 mph', speedCheck ? 'PASS' : 'FAIL'],
        ['Roadway Grade', `${roadGrade}%`, 'Table 2 lookup', 'N/A'],
        ['Required SSD', ssdRequired, 'Per grade/speed', 'N/A'],
        ['Available SSD', `${ssdAvailable} ft`, `≥${ssdRequired}`, ssdCheck ? 'PASS' : 'VERIFY']
    ];

    doc.autoTable({
        startY: yPos,
        head: [['Parameter', 'Value', 'Threshold', 'Status']],
        body: screeningData,
        theme: 'striped',
        headStyles: { fillColor: vdotBlue, fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
            3: { halign: 'center' }
        },
        didParseCell: function(data) {
            if (data.column.index === 3 && data.section === 'body') {
                if (data.cell.text[0] === 'PASS') {
                    data.cell.styles.textColor = greenPass;
                    data.cell.styles.fontStyle = 'bold';
                } else if (data.cell.text[0] === 'FAIL') {
                    data.cell.styles.textColor = redFail;
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        },
        margin: { left: 15, right: 15 }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // ========== STEP 2: CRITERIA EVALUATION ==========
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...vdotBlue);
    doc.text('STEP 2: CRITERIA EVALUATION (Table 2)', 15, yPos);
    yPos += 6;
    doc.setTextColor(0, 0, 0);

    const critA = document.getElementById('pedCritA')?.checked;
    const critB = document.getElementById('pedCritB')?.checked;
    const critC = document.getElementById('pedCritC')?.checked;
    const critD = document.getElementById('pedCritD')?.checked;
    const critE = document.getElementById('pedCritE')?.checked;

    const criteriaCount = [critA, critB, critC, critD, critE].filter(Boolean).length;
    const criteriaPass = criteriaCount >= 3;

    const criteriaData = [
        ['A', 'Established or potential pedestrian route', critA ? 'YES' : 'NO'],
        ['B', 'Pedestrian activity (school, transit, shopping)', critB ? 'YES' : 'NO'],
        ['C', 'No feasible alternative crossing', critC ? 'YES' : 'NO'],
        ['D', '>600ft (urban) or >1000ft (suburban/rural) to nearest crosswalk', critD ? 'YES' : 'NO'],
        ['E', 'PSAP priority corridor or crash cluster', critE ? 'YES' : 'NO']
    ];

    doc.autoTable({
        startY: yPos,
        head: [['Criterion', 'Description', 'Met?']],
        body: criteriaData,
        theme: 'striped',
        headStyles: { fillColor: vdotBlue, fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 18, halign: 'center' },
            2: { cellWidth: 20, halign: 'center' }
        },
        didParseCell: function(data) {
            if (data.column.index === 2 && data.section === 'body') {
                if (data.cell.text[0] === 'YES') {
                    data.cell.styles.textColor = greenPass;
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        },
        margin: { left: 15, right: 15 }
    });

    yPos = doc.lastAutoTable.finalY + 5;

    // Criteria result banner
    doc.setFillColor(...(criteriaPass ? greenPass : redFail));
    doc.rect(15, yPos, 180, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Criteria Met: ${criteriaCount} of 5 (${criteriaPass ? 'MINIMUM 3 MET - PROCEED' : 'LESS THAN 3 - DO NOT MARK'})`, 105, yPos + 8, { align: 'center' });

    yPos += 20;
    doc.setTextColor(0, 0, 0);

    // ========== CRASH DATA (if available) ==========
    const pedCrashTotal = document.getElementById('pedCrashTotal')?.textContent || '0';
    const pedCrashKA = document.getElementById('pedCrashKA')?.textContent || '0';
    const pedCrashBC = document.getElementById('pedCrashBC')?.textContent || '0';
    const pedCrashEPDO = document.getElementById('pedCrashEPDO')?.textContent || '0';

    if (parseInt(pedCrashTotal) > 0 || warrantsState.selectedLocation) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...vdotBlue);
        doc.text('PEDESTRIAN CRASH DATA (36-Month Analysis)', 15, yPos);
        yPos += 6;
        doc.setTextColor(0, 0, 0);

        const crashData = [
            ['Total Pedestrian Crashes', pedCrashTotal],
            ['Fatal + Serious Injury (K+A)', pedCrashKA],
            ['Minor + Possible Injury (B+C)', pedCrashBC],
            ['EPDO Score', pedCrashEPDO]
        ];

        doc.autoTable({
            startY: yPos,
            body: crashData,
            theme: 'plain',
            bodyStyles: { fontSize: 9 },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 40, halign: 'center', fontStyle: 'bold' }
            },
            margin: { left: 15, right: 80 }
        });

        yPos = doc.lastAutoTable.finalY + 10;
    }

    // ========== STEP 3-4: TIER DETERMINATION ==========
    const roadConfig = document.getElementById('pedRoadConfig')?.value;
    const trafficADT = document.getElementById('pedTrafficADT')?.value;

    if (roadConfig && trafficADT) {
        // Check if we need a new page
        if (yPos > 200) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...vdotBlue);
        doc.text('STEP 3-4: ROADWAY CLASSIFICATION & TIER DETERMINATION', 15, yPos);
        yPos += 6;
        doc.setTextColor(0, 0, 0);

        // Calculate tier
        const speed = parseFloat(postedSpeed) || 0;
        let speedCat = '<=30';
        if (speed > 35) speedCat = '>=40';
        else if (speed > 30) speedCat = '35';

        const isDivided = roadConfig.includes('divided') || roadConfig.includes('oneway');
        const tierTable = isDivided ? PED_TIER_TABLE_DIVIDED : PED_TIER_TABLE_UNDIVIDED;
        let tierResult = tierTable[roadConfig]?.[trafficADT]?.[speedCat];
        if (!tierResult && isDivided) tierResult = PED_TIER_TABLE_UNDIVIDED[roadConfig]?.[trafficADT]?.[speedCat];
        if (!tierResult) tierResult = { t: 2, c: 'RRFB/RI' };
        if (trafficADT === '15000+' && speed >= 45) tierResult = { t: 4, c: 'PHB/RD' };

        const tier = tierResult.t;
        const configLabels = {
            'single_oneway': 'Single Lane One-Way',
            '2lane_undivided': '2-Lane Undivided',
            '2lane_divided': '2-Lane Divided',
            '2lane_oneway': '2-Lane One-Way',
            '3lane_turn': '3-Lane with Turn Lane',
            '3lane_oneway': '3-Lane One-Way',
            '4lane_undivided': '4-Lane Undivided',
            '4lane_divided': '4-Lane Divided',
            '5lane_turn': '5-Lane with Turn Lane',
            '6lane_undivided': '6-Lane Undivided',
            '6lane_divided': '6-Lane Divided'
        };

        const classData = [
            ['Road Configuration', configLabels[roadConfig] || roadConfig],
            ['Traffic Volume (ADT)', trafficADT + ' vpd'],
            ['Posted Speed', postedSpeed + ' mph'],
            ['Speed Category', speedCat === '<=30' ? '≤30 mph' : speedCat === '35' ? '35 mph' : '≥40 mph']
        ];

        doc.autoTable({
            startY: yPos,
            body: classData,
            theme: 'plain',
            bodyStyles: { fontSize: 9 },
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 80, fontStyle: 'bold' }
            },
            margin: { left: 15, right: 80 }
        });

        yPos = doc.lastAutoTable.finalY + 5;

        // Tier result banner
        const tierColors = {
            1: greenPass,
            2: [14, 165, 233], // sky blue
            3: orangeWarn,
            4: redFail
        };
        const tierLabels = {
            1: 'TIER 1 - Low Risk',
            2: 'TIER 2 - Moderate Risk',
            3: 'TIER 3 - Elevated Risk',
            4: 'TIER 4 - High Risk'
        };

        doc.setFillColor(...(tierColors[tier] || tierColors[2]));
        doc.rect(15, yPos, 180, 14, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(tierLabels[tier] || 'TIER ' + tier, 105, yPos + 9, { align: 'center' });

        yPos += 20;
        doc.setTextColor(0, 0, 0);

        // Recommended countermeasures
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Recommended Countermeasures:', 15, yPos);
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);

        const codes = tierResult.c.split('/');
        codes.forEach(code => {
            const desc = PED_COUNTERMEASURE_CODES[code.trim()] || code;
            doc.text(`• ${code}: ${desc}`, 20, yPos);
            yPos += 5;
        });

        yPos += 5;
    }

    // ========== ENGINEERING STUDY (if Tier 3/4) ==========
    const engStudySection = document.getElementById('pedEngStudySection');
    if (engStudySection && engStudySection.style.display !== 'none') {
        if (yPos > 220) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...orangeWarn);
        doc.text('ENGINEERING STUDY DOCUMENTATION', 15, yPos);
        yPos += 6;
        doc.setTextColor(0, 0, 0);

        const studyDate = document.getElementById('pedEngStudyDate')?.value || '--';
        const studyRef = document.getElementById('pedEngStudyRef')?.value || '--';
        const altCM = document.getElementById('pedAltCountermeasures')?.value || '--';
        const siteObs = document.getElementById('pedSiteObservations')?.value || '--';
        const finalRec = document.getElementById('pedFinalRecommendation')?.value || '--';
        const justification = document.getElementById('pedFinalJustification')?.value || '--';

        const recLabels = {
            'phb': 'Pedestrian Hybrid Beacon (PHB/HAWK)',
            'rrfb_ri': 'RRFB with Refuge Island',
            'road_diet': 'Road Diet/Reconfiguration',
            'signal': 'Full Traffic Signal',
            'grade_sep': 'Grade-Separated Crossing',
            'enhanced_xwalk': 'Enhanced Crosswalk Only',
            'no_install': 'No Marked Crosswalk Recommended',
            'other': 'Other'
        };

        doc.setFontSize(9);
        doc.text(`Study Date: ${studyDate}     Reference: ${studyRef}`, 15, yPos);
        yPos += 6;

        // Site factors checked
        const factors = [];
        for (let i = 1; i <= 8; i++) {
            if (document.getElementById(`pedSiteFactor${i}`)?.checked) {
                const labels = ['Ped Volumes', '85th% Speed', 'SSD Verified', 'Land Use', 'ADA', 'Lighting', 'Compliance', 'Delay'];
                factors.push(labels[i-1]);
            }
        }
        doc.text(`Factors Evaluated: ${factors.join(', ') || 'None specified'}`, 15, yPos);
        yPos += 8;

        doc.setFont('helvetica', 'bold');
        doc.text('Final Recommendation:', 15, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(recLabels[finalRec] || finalRec, 60, yPos);
        yPos += 8;

        if (justification && justification !== '--') {
            doc.setFont('helvetica', 'bold');
            doc.text('Justification:', 15, yPos);
            yPos += 5;
            doc.setFont('helvetica', 'normal');
            const justLines = doc.splitTextToSize(justification, 170);
            doc.text(justLines, 15, yPos);
            yPos += justLines.length * 4 + 5;
        }
    }

    // ========== NOTES ==========
    const notes = document.getElementById('pedNotes')?.value;
    if (notes) {
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Additional Notes:', 15, yPos);
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const noteLines = doc.splitTextToSize(notes, 170);
        doc.text(noteLines, 15, yPos);
    }

    // ========== FOOTER ==========
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Generated by ${getReportAttribution()} - ${new Date().toLocaleDateString()}`, 15, 272);
        doc.text(`Page ${i} of ${pageCount}`, 195, 272, { align: 'right' });
        doc.text('Per VDOT IIM-TE-384.1', 105, 272, { align: 'center' });
    }

    // Download
    const filename = `Pedestrian_Crossing_Evaluation_${locationName.replace(/[^a-zA-Z0-9]/g, '_')}_${evalDate}.pdf`;
    doc.save(filename);
    showToast('PDF report downloaded successfully', 'success');

    } catch (err) {
        console.error('[Ped PDF] Error generating report:', err);
        showToast('Error generating PDF report', 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Print the pedestrian crossing evaluation form
 */
function ped_printReport() {
    // Create a printable version by triggering browser print
    const formContainer = document.getElementById('warrantFormPedestrian');
    if (!formContainer) {
        showToast('Form not found', 'error');
        return;
    }

    // Open print dialog
    window.print();
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.warrants = CL.warrants || {};
  CL.warrants.pedCrossing = CL.warrants.pedCrossing || {};
  window.evaluatePedScreening = evaluatePedScreening; CL.warrants.pedCrossing.evaluatePedScreening = evaluatePedScreening;
  window.getRequiredSSD = getRequiredSSD; CL.warrants.pedCrossing.getRequiredSSD = getRequiredSSD;
  window.updatePedSSDRequired = updatePedSSDRequired; CL.warrants.pedCrossing.updatePedSSDRequired = updatePedSSDRequired;
  window.updatePedContextSpacing = updatePedContextSpacing; CL.warrants.pedCrossing.updatePedContextSpacing = updatePedContextSpacing;
  window.updatePedStreetViewStatus = updatePedStreetViewStatus; CL.warrants.pedCrossing.updatePedStreetViewStatus = updatePedStreetViewStatus;
  window.openPedStreetView = openPedStreetView; CL.warrants.pedCrossing.openPedStreetView = openPedStreetView;
  window.ped_loadCrashData = ped_loadCrashData; CL.warrants.pedCrossing.ped_loadCrashData = ped_loadCrashData;
  window.evaluatePedCriteria = evaluatePedCriteria; CL.warrants.pedCrossing.evaluatePedCriteria = evaluatePedCriteria;
  window.determinePedTier = determinePedTier; CL.warrants.pedCrossing.determinePedTier = determinePedTier;
  window.determinePedMarking = determinePedMarking; CL.warrants.pedCrossing.determinePedMarking = determinePedMarking;
  window.ped_generatePDFReport = ped_generatePDFReport; CL.warrants.pedCrossing.ped_generatePDFReport = ped_generatePDFReport;
  window.ped_printReport = ped_printReport; CL.warrants.pedCrossing.ped_printReport = ped_printReport;
  CL._registerModule('warrants/ped-crossing');
})();
