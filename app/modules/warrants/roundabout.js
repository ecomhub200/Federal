/**
 * CL warrants.roundabout — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.warrants.roundabout.<fn>; module-private
 * state (0 external refs) stays inside this IIFE.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
/**
 * SIDRA-Inspired Roundabout Operational Analysis
 * Calculates V/C ratio, LOS, queue, and recommended type based on SIDRA/HCM methodology
 * References: SIDRA Intersection, HCM 6th Edition, NCHRP 672
 */
function roundabout_calculateSIDRAMetrics(totalAADT, peakVol, designVehicle) {
    // Default capacity values based on SIDRA/HCM methodology
    const capacityThresholds = {
        mini: { aadt: 15000, peakCap: 1200, minICD: 70, maxICD: 90 },
        singleLane: { aadt: 25000, peakCap: 1800, minICD: 105, maxICD: 150 },
        multiLane: { aadt: 45000, peakCap: 3500, minICD: 150, maxICD: 220 }
    };

    // Design vehicle minimum ICD requirements (FHWA Roundabout Guide)
    const designVehicleICD = {
        'SU-30': 90,   // Single Unit 30ft
        'WB-40': 100,  // Tractor-Trailer 40ft
        'WB-50': 105,  // Tractor-Trailer 50ft (default)
        'WB-62': 130,  // Tractor-Trailer 62ft
        'WB-67': 150   // Tractor-Trailer 67ft
    };

    // Determine roundabout type based on AADT
    let roundaboutType = 'Unknown';
    let capacity = 0;
    let minICD = 90;
    let maxICD = 150;

    if (totalAADT <= capacityThresholds.mini.aadt && totalAADT > 0) {
        roundaboutType = 'Mini';
        capacity = capacityThresholds.mini.peakCap;
        minICD = capacityThresholds.mini.minICD;
        maxICD = capacityThresholds.mini.maxICD;
    } else if (totalAADT <= capacityThresholds.singleLane.aadt) {
        roundaboutType = 'Single-Lane';
        capacity = capacityThresholds.singleLane.peakCap;
        minICD = capacityThresholds.singleLane.minICD;
        maxICD = capacityThresholds.singleLane.maxICD;
    } else if (totalAADT <= capacityThresholds.multiLane.aadt) {
        roundaboutType = 'Multi-Lane';
        capacity = capacityThresholds.multiLane.peakCap;
        minICD = capacityThresholds.multiLane.minICD;
        maxICD = capacityThresholds.multiLane.maxICD;
    } else {
        roundaboutType = 'Over Capacity';
        capacity = capacityThresholds.multiLane.peakCap;
        minICD = capacityThresholds.multiLane.minICD;
        maxICD = capacityThresholds.multiLane.maxICD;
    }

    // Adjust minICD based on design vehicle
    const vehicleMinICD = designVehicleICD[designVehicle] || 105;
    minICD = Math.max(minICD, vehicleMinICD);

    // Calculate V/C ratio (volume-to-capacity)
    // Use peak hour volume if available, otherwise estimate from AADT (K-factor ~0.10)
    const effectivePeakVol = peakVol > 0 ? peakVol : (totalAADT * 0.10);
    const vcRatio = capacity > 0 ? (effectivePeakVol / capacity) : 0;

    // Estimate control delay based on V/C ratio (simplified HCM model)
    // d = d1 + d2 where d1 = uniform delay, d2 = incremental delay
    let controlDelay = 0;
    if (vcRatio > 0) {
        // Simplified delay estimation (seconds/vehicle)
        if (vcRatio <= 0.5) {
            controlDelay = 5 + (vcRatio * 10);
        } else if (vcRatio <= 0.85) {
            controlDelay = 10 + ((vcRatio - 0.5) * 30);
        } else if (vcRatio <= 1.0) {
            controlDelay = 20.5 + ((vcRatio - 0.85) * 100);
        } else {
            controlDelay = 35 + ((vcRatio - 1.0) * 200); // Over capacity
        }
    }

    // Determine LOS based on control delay (HCM criteria for roundabouts)
    let los = '--';
    if (controlDelay > 0) {
        if (controlDelay <= 10) los = 'A';
        else if (controlDelay <= 15) los = 'B';
        else if (controlDelay <= 25) los = 'C';
        else if (controlDelay <= 35) los = 'D';
        else if (controlDelay <= 50) los = 'E';
        else los = 'F';
    }

    // Estimate 95th percentile queue (vehicles) based on V/C ratio
    // Q95 = Q_avg * factor, simplified model
    let queue95 = 0;
    if (vcRatio > 0 && vcRatio <= 0.85) {
        queue95 = Math.round(vcRatio * 5);
    } else if (vcRatio > 0.85) {
        queue95 = Math.round(5 + ((vcRatio - 0.85) * 50));
    }

    // V/C status text
    let vcStatus = 'Enter AADT';
    let vcColor = '#64748b';
    if (vcRatio > 0) {
        if (vcRatio <= 0.85) {
            vcStatus = 'Good';
            vcColor = '#059669';
        } else if (vcRatio <= 0.95) {
            vcStatus = 'Acceptable';
            vcColor = '#d97706';
        } else {
            vcStatus = 'Over Capacity';
            vcColor = '#dc2626';
        }
    }

    // LOS color
    let losColor = '#64748b';
    if (los === 'A' || los === 'B') losColor = '#059669';
    else if (los === 'C' || los === 'D') losColor = '#d97706';
    else if (los === 'E' || los === 'F') losColor = '#dc2626';

    return {
        vcRatio: vcRatio,
        vcStatus: vcStatus,
        vcColor: vcColor,
        los: los,
        losColor: losColor,
        controlDelay: controlDelay,
        roundaboutType: roundaboutType,
        minICD: minICD,
        maxICD: maxICD,
        queue95: queue95,
        capacity: capacity
    };
}

/**
 * Update the SIDRA metrics display in the form
 */
function roundabout_updateSIDRADisplay(metrics) {
    // Update V/C ratio
    const vcEl = document.getElementById('roundVC');
    const vcStatusEl = document.getElementById('roundVCStatus');
    if (vcEl && vcStatusEl) {
        vcEl.textContent = metrics.vcRatio > 0 ? metrics.vcRatio.toFixed(2) : '--';
        vcEl.style.color = metrics.vcColor;
        vcStatusEl.textContent = metrics.vcStatus;
        vcStatusEl.style.color = metrics.vcColor;
    }

    // Update LOS
    const losEl = document.getElementById('roundLOS');
    const losDelayEl = document.getElementById('roundLOSDelay');
    if (losEl && losDelayEl) {
        losEl.textContent = metrics.los;
        losEl.style.color = metrics.losColor;
        losDelayEl.textContent = metrics.controlDelay > 0 ? `${metrics.controlDelay.toFixed(1)} sec/veh` : 'Control Delay';
    }

    // Update roundabout type
    const typeEl = document.getElementById('roundType');
    const typeICDEl = document.getElementById('roundTypeICD');
    if (typeEl && typeICDEl) {
        typeEl.textContent = metrics.roundaboutType;
        typeEl.style.color = metrics.roundaboutType === 'Over Capacity' ? '#dc2626' : '#8b5cf6';
        typeICDEl.textContent = metrics.minICD > 0 ? `ICD: ${metrics.minICD}-${metrics.maxICD} ft` : 'Min ICD';
    }

    // Update queue
    const queueEl = document.getElementById('roundQueue');
    if (queueEl) {
        queueEl.textContent = metrics.queue95 > 0 ? metrics.queue95 : '--';
        queueEl.style.color = metrics.queue95 > 10 ? '#dc2626' : (metrics.queue95 > 5 ? '#d97706' : '#059669');
    }

    // Store metrics in state
    warrantsState.roundabout.sidraMetrics = metrics;
}

/**
 * Update the result banner based on analysis
 */
function roundabout_updateResultBanner(feasibility, crashReduction) {
    const banner = document.getElementById('roundaboutResultBanner');
    const icon = document.getElementById('roundaboutResultIcon');
    const title = document.getElementById('roundaboutResultTitle');
    const subtitle = document.getElementById('roundaboutResultSubtitle');
    const metricsDiv = document.getElementById('roundaboutResultMetrics');
    const reductionEl = document.getElementById('roundaboutResultReduction');
    const wordMemoBtn = document.getElementById('roundaboutWordMemoBtn');

    if (!banner) return;

    // Remove all state classes
    banner.classList.remove('pending', 'feasible', 'conditional', 'not-feasible');
    banner.style.display = 'block';

    switch(feasibility) {
        case 'feasible':
            banner.classList.add('feasible');
            icon.textContent = '✓';
            title.textContent = 'Roundabout Feasible';
            subtitle.textContent = 'Analysis indicates roundabout is a viable alternative for this intersection';
            break;
        case 'conditional':
            banner.classList.add('conditional');
            icon.textContent = '⚠️';
            title.textContent = 'Conditionally Feasible';
            subtitle.textContent = 'Roundabout may be feasible with design modifications or constraint mitigation';
            break;
        case 'not_recommended':
            banner.classList.add('not-feasible');
            icon.textContent = '✗';
            title.textContent = 'Not Recommended';
            subtitle.textContent = 'Significant constraints or capacity issues identified';
            break;
        default:
            banner.classList.add('pending');
            icon.textContent = '⏳';
            title.textContent = 'Analysis Pending';
            subtitle.textContent = 'Enter traffic data to evaluate roundabout feasibility';
    }

    // Show crash reduction metric if available
    if (crashReduction > 0 && metricsDiv && reductionEl) {
        metricsDiv.style.display = 'block';
        reductionEl.textContent = `${Math.round(crashReduction)}%`;
    } else if (metricsDiv) {
        metricsDiv.style.display = 'none';
    }

    // Enable Word Memo button if analysis complete
    if (wordMemoBtn) {
        wordMemoBtn.disabled = feasibility === 'pending' || !feasibility;
    }
}

/**
 * ============================================================
 * AADT CONVERSION FUNCTIONS
 * Peak Hour → AADT Converter for Roundabout Analysis
 * Based on ITE, FHWA TMG, and NCHRP 765 methodologies
 * ============================================================
 */

// State for AADT converter
const roundaboutAADTConverterState = {
    kFactor: 0.095,      // Default: Suburban 9.5%
    kFactorType: 'suburban',
    seasonalFactor: 1.00,
    dowFactor: 1.00,
    dowDay: 'Tue',
    isCustomKFactor: false,
    calculatedAADT: null,
    source: 'peakHour'   // 'peakHour', 'tmc', 'direct'
};

/**
 * Toggle AADT Converter panel visibility
 */
function roundabout_toggleAADTConverter() {
    const content = document.getElementById('roundAADTConverterContent');
    const arrow = document.getElementById('roundAADTConverterArrow');
    if (content && arrow) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
    }
}

/**
 * Set AADT input source (peakHour, tmc, or direct)
 */
function roundabout_setAADTSource(source) {
    roundaboutAADTConverterState.source = source;

    // Update button states
    const buttons = ['roundAADTSrcPeak', 'roundAADTSrcTMC', 'roundAADTSrcDirect'];
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.classList.remove('active', 'btn-soft-purple');
            btn.classList.add('btn-soft');
        }
    });

    const activeBtn = document.getElementById(
        source === 'peakHour' ? 'roundAADTSrcPeak' :
        source === 'tmc' ? 'roundAADTSrcTMC' : 'roundAADTSrcDirect'
    );
    if (activeBtn) {
        activeBtn.classList.add('active', 'btn-soft-purple');
    }

    // Show/hide input sections
    const inputSection = document.getElementById('roundAADTInputSection');
    const calcResult = document.getElementById('roundAADTCalcResult');

    if (source === 'direct') {
        if (inputSection) inputSection.style.display = 'none';
        if (calcResult) calcResult.style.display = 'none';
        // Focus on the main AADT input
        const aadtInput = document.getElementById('roundTotalAADT');
        if (aadtInput) aadtInput.focus();
    } else {
        if (inputSection) inputSection.style.display = 'grid';
    }
}

/**
 * Set K-Factor from preset buttons
 * Based on ITE and FHWA TMG standards
 */
function roundabout_setKFactor(value, type) {
    roundaboutAADTConverterState.kFactor = value;
    roundaboutAADTConverterState.kFactorType = type;
    roundaboutAADTConverterState.isCustomKFactor = false;

    // Update button states
    const buttons = document.querySelectorAll('.k-factor-btn');
    buttons.forEach(btn => {
        btn.style.borderColor = '#e2e8f0';
        btn.style.background = 'white';
    });

    const btnId = {
        'urban': 'kfUrban',
        'suburban': 'kfSuburban',
        'rural': 'kfRural',
        'recreational': 'kfRec'
    }[type];

    const activeBtn = document.getElementById(btnId);
    if (activeBtn) {
        activeBtn.style.borderColor = '#8b5cf6';
        activeBtn.style.background = '#f3e8ff';
    }

    // Hide custom input
    const customRow = document.getElementById('roundCustomKFactorRow');
    if (customRow) customRow.style.display = 'none';

    // Recalculate
    roundabout_calculateAADT();
}

/**
 * Toggle custom K-Factor input
 */
function roundabout_toggleCustomKFactor() {
    roundaboutAADTConverterState.isCustomKFactor = true;

    // Update button states
    const buttons = document.querySelectorAll('.k-factor-btn');
    buttons.forEach(btn => {
        btn.style.borderColor = '#e2e8f0';
        btn.style.background = 'white';
    });

    const customBtn = document.getElementById('kfCustomBtn');
    if (customBtn) {
        customBtn.style.borderColor = '#8b5cf6';
        customBtn.style.background = '#f3e8ff';
    }

    // Show custom input row
    const customRow = document.getElementById('roundCustomKFactorRow');
    if (customRow) customRow.style.display = 'block';
}

/**
 * Apply custom K-Factor value
 */
function roundabout_applyCustomKFactor() {
    const input = document.getElementById('roundCustomKFactor');
    if (input && input.value) {
        roundaboutAADTConverterState.kFactor = parseFloat(input.value) / 100;
        roundaboutAADTConverterState.kFactorType = 'custom';
        roundabout_calculateAADT();
    }
}

/**
 * Set Day-of-Week factor
 * Based on FHWA Traffic Monitoring Guide patterns
 */
function roundabout_setDOWFactor(value, day) {
    roundaboutAADTConverterState.dowFactor = value;
    roundaboutAADTConverterState.dowDay = day;

    // Update button states
    const buttons = document.querySelectorAll('.dow-btn');
    buttons.forEach(btn => {
        btn.style.borderColor = '#e2e8f0';
        btn.style.background = 'white';
    });

    // Find and highlight active button
    buttons.forEach(btn => {
        if (btn.textContent.trim() === day.charAt(0) ||
            (day === 'Thu' && btn.textContent.trim() === 'Th') ||
            (day === 'Sat' && btn.textContent.trim() === 'Sa') ||
            (day === 'Sun' && btn.textContent.trim() === 'Su')) {
            btn.style.borderColor = '#8b5cf6';
            btn.style.background = '#f3e8ff';
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update display
    const dowValue = document.getElementById('roundDOWValue');
    const dowDay = document.getElementById('roundDOWDay');
    if (dowValue) dowValue.textContent = value.toFixed(2);
    if (dowDay) dowDay.textContent = day;

    roundabout_calculateAADT();
}

/**
 * Update seasonal factor based on count date
 * Uses approximate FHWA TMG seasonal patterns
 */
function roundabout_updateSeasonalFactor() {
    const dateInput = document.getElementById('roundConverterCountDate');
    if (!dateInput || !dateInput.value) return;

    const date = new Date(dateInput.value);
    const month = date.getMonth(); // 0-11
    const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, etc.

    // Seasonal factors (approximate - varies by region)
    // Based on FHWA TMG typical patterns for Virginia
    const seasonalFactors = {
        0: 0.88,   // January
        1: 0.90,   // February
        2: 0.98,   // March
        3: 1.02,   // April
        4: 1.05,   // May
        5: 1.08,   // June
        6: 1.04,   // July
        7: 1.06,   // August
        8: 1.02,   // September
        9: 1.02,   // October
        10: 0.96,  // November
        11: 0.92   // December
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Set seasonal factor
    const seasonalFactor = seasonalFactors[month] || 1.00;
    roundaboutAADTConverterState.seasonalFactor = seasonalFactor;

    const seasonalInput = document.getElementById('roundSeasonalFactor');
    const seasonalMonth = document.getElementById('roundSeasonalMonth');
    const seasonalBar = document.getElementById('roundSeasonalBar');

    if (seasonalInput) seasonalInput.value = seasonalFactor.toFixed(2);
    if (seasonalMonth) seasonalMonth.textContent = monthNames[month];
    if (seasonalBar) {
        // Map 0.85-1.15 to 0-100%
        const barWidth = Math.min(100, Math.max(0, ((seasonalFactor - 0.85) / 0.30) * 100));
        seasonalBar.querySelector('div').style.width = `${barWidth}%`;
    }

    // Also auto-set day of week
    const dowFactor = [0.75, 0.96, 1.00, 1.00, 1.00, 1.04, 0.88][dayOfWeek];
    roundabout_setDOWFactor(dowFactor, dayNames[dayOfWeek]);

    roundabout_calculateAADT();
}

/**
 * Main AADT calculation function
 * Formula: AADT = (Peak Hour Volume ÷ K-Factor) × Seasonal × DOW
 */
function roundabout_calculateAADT() {
    const peakHourInput = document.getElementById('roundConverterPeakHour');
    const peakHourVol = parseFloat(peakHourInput?.value) || 0;

    if (peakHourVol <= 0) {
        // Hide result if no input
        const resultDiv = document.getElementById('roundAADTCalcResult');
        if (resultDiv) resultDiv.style.display = 'none';
        return;
    }

    const state = roundaboutAADTConverterState;
    const kFactor = state.kFactor;
    const seasonalFactor = parseFloat(document.getElementById('roundSeasonalFactor')?.value) || 1.00;
    const dowFactor = state.dowFactor;

    // AADT Calculation
    // AADT = (Peak Hour / K) × Seasonal Adjustment × DOW Adjustment
    const rawAADT = peakHourVol / kFactor;
    const adjustedAADT = Math.round(rawAADT * seasonalFactor * dowFactor);

    state.calculatedAADT = adjustedAADT;

    // Calculate uncertainty range (±12.5%)
    const lowRange = Math.round(adjustedAADT * 0.875);
    const highRange = Math.round(adjustedAADT * 1.125);

    // Update UI
    const resultDiv = document.getElementById('roundAADTCalcResult');
    if (resultDiv) resultDiv.style.display = 'block';

    // Update calculation breakdown
    document.getElementById('roundCalcPeak').textContent = peakHourVol.toLocaleString();
    document.getElementById('roundCalcK').textContent = (kFactor * 100).toFixed(1) + '%';
    document.getElementById('roundCalcKType').textContent = state.kFactorType;
    document.getElementById('roundCalcSeasonal').textContent = seasonalFactor.toFixed(2);
    document.getElementById('roundCalcDOW').textContent = dowFactor.toFixed(2);
    document.getElementById('roundCalcAADT').textContent = adjustedAADT.toLocaleString();

    // Update large result display
    document.getElementById('roundCalcAADTLarge').textContent = adjustedAADT.toLocaleString();

    // Update range
    document.getElementById('roundAADTRangeLow').textContent = lowRange.toLocaleString();
    document.getElementById('roundAADTRangeHigh').textContent = highRange.toLocaleString();

    // Show badge in header
    const badge = document.getElementById('roundAADTConverterBadge');
    if (badge) badge.style.display = 'inline-block';
}

/**
 * Apply calculated AADT to the main analysis form
 */
function roundabout_applyCalculatedAADT() {
    const aadt = roundaboutAADTConverterState.calculatedAADT;
    if (!aadt) return;

    // Apply to main AADT input
    const aadtInput = document.getElementById('roundTotalAADT');
    if (aadtInput) {
        aadtInput.value = aadt;
        aadtInput.classList.add('ai-filled');

        // Show source note
        const sourceNote = document.getElementById('roundAADTSourceNote');
        if (sourceNote) {
            sourceNote.style.display = 'block';
            sourceNote.textContent = `Converted from ${roundaboutAADTConverterState.kFactorType} K-factor (${(roundaboutAADTConverterState.kFactor * 100).toFixed(1)}%)`;
        }
    }

    // Also copy peak hour to the peak hour field
    const peakInput = document.getElementById('roundConverterPeakHour');
    const peakVol = parseFloat(peakInput?.value) || 0;
    if (peakVol > 0) {
        const peakVolField = document.getElementById('roundPeakVol');
        if (peakVolField) peakVolField.value = peakVol;
    }

    // Also update quick panel if visible
    const quickAADT = document.getElementById('roundQuickAADT');
    if (quickAADT) quickAADT.value = aadt;

    // Collapse the converter panel
    const content = document.getElementById('roundAADTConverterContent');
    const arrow = document.getElementById('roundAADTConverterArrow');
    if (content) content.style.display = 'none';
    if (arrow) arrow.style.transform = 'rotate(0deg)';

    // Trigger evaluation
    evaluateRoundabout();
    evaluateRoundaboutQuick();

    // Show success notification
    showToast('AADT applied to roundabout analysis', 'success');
}

// ============================================
// QUICK PANEL AADT CONVERTER FUNCTIONS
// ============================================

/**
 * State/Regional Traffic Factor Data
 * Sources: FHWA TMG, State DOT Traffic Monitoring Programs
 */
const AADT_REGIONAL_FACTORS = {
    VA: {
        name: 'Virginia',
        source: 'VDOT Traffic Monitoring Program',
        sourceUrl: 'https://www.vdot.virginia.gov/doing-business/technical-guidance-and-support/traffic-operations/traffic-counts/',
        districts: {
            HENRICO: { name: 'Richmond District (Henrico)', kUrban: 0.085, kSuburban: 0.093, kRural: 0.11, growth: 0.01 },
            RICHMOND_CITY: { name: 'Richmond District (City)', kUrban: 0.082, kSuburban: 0.09, kRural: 0.10, growth: 0.008 },
            CHESTERFIELD: { name: 'Richmond District (Chesterfield)', kUrban: 0.085, kSuburban: 0.093, kRural: 0.11, growth: 0.012 },
            HANOVER: { name: 'Richmond District (Hanover)', kUrban: 0.088, kSuburban: 0.095, kRural: 0.115, growth: 0.015 },
            NOVA: { name: 'Northern Virginia District', kUrban: 0.08, kSuburban: 0.088, kRural: 0.10, growth: 0.015 },
            HAMPTON: { name: 'Hampton Roads District', kUrban: 0.083, kSuburban: 0.091, kRural: 0.105, growth: 0.01 },
            OTHER_VA: { name: 'Virginia (Statewide Average)', kUrban: 0.085, kSuburban: 0.093, kRural: 0.11, growth: 0.01 }
        },
        seasonal: { 1: 0.91, 2: 0.93, 3: 0.99, 4: 1.01, 5: 1.04, 6: 1.05, 7: 1.02, 8: 1.03, 9: 1.02, 10: 1.01, 11: 0.97, 12: 0.94 },
        dow: { Mon: 0.97, Tue: 1.00, Wed: 1.00, Thu: 1.00, Fri: 1.03, Sat: 0.85, Sun: 0.72 }
    },
    MD: {
        name: 'Maryland',
        source: 'MDOT SHA Traffic Monitoring',
        sourceUrl: 'https://roads.maryland.gov/mdotsha/pages/Index.aspx?PageId=827',
        kUrban: 0.084, kSuburban: 0.092, kRural: 0.11, growth: 0.01,
        seasonal: { 1: 0.90, 2: 0.92, 3: 0.98, 4: 1.01, 5: 1.04, 6: 1.06, 7: 1.03, 8: 1.04, 9: 1.02, 10: 1.01, 11: 0.97, 12: 0.93 },
        dow: { Mon: 0.96, Tue: 1.00, Wed: 1.00, Thu: 1.00, Fri: 1.04, Sat: 0.86, Sun: 0.73 }
    },
    NC: {
        name: 'North Carolina',
        source: 'NCDOT Traffic Survey Unit',
        sourceUrl: 'https://connect.ncdot.gov/resources/State-Mapping/Pages/Traffic-Survey-Maps.aspx',
        kUrban: 0.086, kSuburban: 0.094, kRural: 0.115, growth: 0.012,
        seasonal: { 1: 0.89, 2: 0.91, 3: 0.98, 4: 1.02, 5: 1.05, 6: 1.07, 7: 1.04, 8: 1.05, 9: 1.02, 10: 1.00, 11: 0.96, 12: 0.92 },
        dow: { Mon: 0.96, Tue: 1.00, Wed: 1.00, Thu: 1.00, Fri: 1.05, Sat: 0.87, Sun: 0.74 }
    },
    DC: {
        name: 'Washington D.C.',
        source: 'DDOT Traffic Volume Maps',
        sourceUrl: 'https://ddot.dc.gov/page/traffic-volume-maps',
        kUrban: 0.078, kSuburban: 0.085, kRural: 0.095, growth: 0.005,
        seasonal: { 1: 0.92, 2: 0.94, 3: 0.99, 4: 1.01, 5: 1.03, 6: 1.02, 7: 0.95, 8: 0.98, 9: 1.02, 10: 1.02, 11: 0.99, 12: 0.95 },
        dow: { Mon: 0.95, Tue: 1.00, Wed: 1.01, Thu: 1.00, Fri: 1.02, Sat: 0.82, Sun: 0.70 }
    },
    OTHER: {
        name: 'FHWA National Default',
        source: 'FHWA Traffic Monitoring Guide (2022)',
        sourceUrl: 'https://www.fhwa.dot.gov/policyinformation/tmguide/',
        kUrban: 0.085, kSuburban: 0.095, kRural: 0.12, growth: 0.01,
        seasonal: { 1: 0.88, 2: 0.90, 3: 0.98, 4: 1.02, 5: 1.05, 6: 1.08, 7: 1.04, 8: 1.06, 9: 1.02, 10: 1.02, 11: 0.96, 12: 0.92 },
        dow: { Mon: 0.96, Tue: 1.00, Wed: 1.00, Thu: 1.00, Fri: 1.04, Sat: 0.88, Sun: 0.75 }
    }
};

// Set OTHER states to use FHWA defaults
['WV', 'PA', 'DE', 'NJ', 'NY', 'FL', 'GA', 'SC', 'TN', 'TX', 'CA'].forEach(st => {
    AADT_REGIONAL_FACTORS[st] = { ...AADT_REGIONAL_FACTORS.OTHER, name: st + ' (FHWA Default)' };
});

/**
 * Toggle visibility of Quick Panel AADT Converter
 */
function roundaboutQuick_toggleAADTConverter() {
    const panel = document.getElementById('roundQuickAADTConverterPanel');
    if (!panel) return;

    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';

    // Focus on peak hour input when opening
    if (!isVisible) {
        setTimeout(() => {
            const input = document.getElementById('roundQuickPeakHour');
            if (input) input.focus();
        }, 100);
    }
}

/**
 * Update location-based factors when state/county changes
 */
function roundaboutQuick_updateLocationFactors() {
    const state = document.getElementById('roundQuickState')?.value || 'VA';
    const county = document.getElementById('roundQuickCounty')?.value || 'HENRICO';
    const countySelect = document.getElementById('roundQuickCounty');
    const locationNote = document.getElementById('roundQuickLocationNote');

    // Update county dropdown options based on state
    if (state === 'VA' && countySelect) {
        countySelect.innerHTML = `
            <option value="HENRICO">Henrico County (Richmond Dist.)</option>
            <option value="RICHMOND_CITY">City of Richmond</option>
            <option value="CHESTERFIELD">Chesterfield County</option>
            <option value="HANOVER">Hanover County</option>
            <option value="NOVA">Northern Virginia</option>
            <option value="HAMPTON">Hampton Roads</option>
            <option value="OTHER_VA">Other VA Location</option>
        `;
    } else if (countySelect) {
        countySelect.innerHTML = `<option value="DEFAULT">Statewide Average</option>`;
    }

    // Get regional data
    const stateData = AADT_REGIONAL_FACTORS[state] || AADT_REGIONAL_FACTORS.OTHER;
    let districtData = stateData;
    let sourceName = stateData.source;

    if (state === 'VA' && stateData.districts && stateData.districts[county]) {
        districtData = stateData.districts[county];
        sourceName = `VDOT ${districtData.name}`;
    }

    // Update location note
    if (locationNote) {
        locationNote.textContent = `Using ${sourceName} factors`;
    }

    // Update source labels
    const kSource = document.getElementById('roundQuickKSource');
    const dowSource = document.getElementById('roundQuickDOWSourceLabel');
    const seasonSource = document.getElementById('roundQuickSeasonSourceLabel');
    const growthSource = document.getElementById('roundQuickGrowthSourceLabel');

    const shortSource = state === 'VA' ? 'VDOT' : (state === 'OTHER' ? 'FHWA' : state + ' DOT');
    if (kSource) kSource.textContent = `(${shortSource})`;
    if (dowSource) dowSource.textContent = `(${shortSource})`;
    if (seasonSource) seasonSource.textContent = `(${shortSource})`;
    if (growthSource) growthSource.textContent = `(${shortSource} Forecast)`;

    // Recalculate if peak hour has value
    if (parseFloat(document.getElementById('roundQuickPeakHour')?.value) > 0) {
        roundaboutQuick_calculateAADT();
    }
}

/**
 * Toggle element visibility helper
 */
function toggleElement(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

/**
 * Calculate AADT from peak hour in Quick Panel
 * Includes: K-Factor, Day of Week, Seasonal, and Growth adjustments
 * Formula: AADT = (Peak Hour ÷ K) ÷ DOW ÷ Season × Growth
 */
function roundaboutQuick_calculateAADT() {
    const peakHour = parseFloat(document.getElementById('roundQuickPeakHour')?.value) || 0;
    const kFactorSelect = document.getElementById('roundQuickKFactor');
    const customKWrapper = document.getElementById('roundQuickCustomKWrapper');
    const resultDiv = document.getElementById('roundQuickAADTResult');
    const guidanceDiv = document.getElementById('roundQuickNCHRPGuidance');
    const referencesDiv = document.getElementById('roundQuickReferences');

    // Get location for source references
    const state = document.getElementById('roundQuickState')?.value || 'VA';
    const county = document.getElementById('roundQuickCounty')?.value || 'HENRICO';
    const stateData = AADT_REGIONAL_FACTORS[state] || AADT_REGIONAL_FACTORS.OTHER;
    let sourceName = stateData.source;
    if (state === 'VA' && stateData.districts && stateData.districts[county]) {
        sourceName = `VDOT ${stateData.districts[county].name}`;
    }

    // Handle custom K-factor
    let kFactor = parseFloat(kFactorSelect?.value);
    let kType = kFactorSelect?.options[kFactorSelect.selectedIndex]?.text || 'Custom';
    if (kFactorSelect?.value === 'custom') {
        if (customKWrapper) customKWrapper.style.display = 'block';
        const customK = parseFloat(document.getElementById('roundQuickCustomK')?.value) || 0;
        kFactor = customK / 100;
        kType = 'Custom';
    } else {
        if (customKWrapper) customKWrapper.style.display = 'none';
    }

    // Get Day of Week factor and label
    const dowSelect = document.getElementById('roundQuickDOW');
    const dowFactor = parseFloat(dowSelect?.value) || 1.00;
    const dowLabel = dowSelect?.options[dowSelect.selectedIndex]?.text.split(' ')[0] || 'Average';

    // Get Seasonal factor and label
    const seasonSelect = document.getElementById('roundQuickSeason');
    const seasonFactor = parseFloat(seasonSelect?.value) || 1.00;
    const seasonLabel = seasonSelect?.options[seasonSelect.selectedIndex]?.text.split(' ')[0] || 'Average';

    // Get Growth factor (handle custom)
    const growthSelect = document.getElementById('roundQuickGrowth');
    const customGrowthWrapper = document.getElementById('roundQuickCustomGrowthWrapper');
    let growthFactor = parseFloat(growthSelect?.value);
    let growthLabel = growthSelect?.options[growthSelect.selectedIndex]?.text || 'Current';
    if (growthSelect?.value === 'custom') {
        if (customGrowthWrapper) customGrowthWrapper.style.display = 'block';
        growthFactor = parseFloat(document.getElementById('roundQuickCustomGrowth')?.value) || 1.00;
        growthLabel = 'Custom';
    } else {
        if (customGrowthWrapper) customGrowthWrapper.style.display = 'none';
    }

    // Validate inputs
    if (peakHour <= 0 || kFactor <= 0) {
        if (resultDiv) resultDiv.style.display = 'none';
        if (guidanceDiv) guidanceDiv.style.display = 'none';
        if (referencesDiv) referencesDiv.style.display = 'none';
        return;
    }

    // Calculate AADT with all adjustment factors
    const baseAADT = peakHour / kFactor;
    const currentAADT = baseAADT / dowFactor / seasonFactor;
    const designYearAADT = Math.round(currentAADT * growthFactor);

    // Uncertainty range (±20% per FHWA TMG)
    const lowRange = Math.round(designYearAADT * 0.80);
    const highRange = Math.round(designYearAADT * 1.20);

    // Update result display
    if (resultDiv) {
        resultDiv.style.display = 'block';
        document.getElementById('roundQuickAADTValue').textContent = designYearAADT.toLocaleString();
        document.getElementById('roundQuickAADTRange').textContent = `Range: ${lowRange.toLocaleString()} to ${highRange.toLocaleString()}`;
    }

    // NCHRP 672 Guidance
    if (guidanceDiv) {
        guidanceDiv.style.display = 'block';
        const textEl = document.getElementById('roundQuickNCHRPText');
        let guidance = '';

        if (designYearAADT < 15000) {
            guidance = '✅ NCHRP 672: Single-lane roundabout likely suitable (AADT < 15K)';
            guidanceDiv.style.background = '#f0fdf4';
            guidanceDiv.style.borderColor = '#22c55e';
        } else if (designYearAADT < 25000) {
            guidance = '⚠️ NCHRP 672: Evaluate single vs multi-lane (15K-25K AADT)';
            guidanceDiv.style.background = '#fffbeb';
            guidanceDiv.style.borderColor = '#fbbf24';
        } else if (designYearAADT < 45000) {
            guidance = '🔶 NCHRP 672: Multi-lane roundabout recommended (25K-45K AADT)';
            guidanceDiv.style.background = '#fff7ed';
            guidanceDiv.style.borderColor = '#f97316';
        } else {
            guidance = '🔴 NCHRP 672: Consider grade separation (AADT > 45K)';
            guidanceDiv.style.background = '#fef2f2';
            guidanceDiv.style.borderColor = '#ef4444';
        }

        if (textEl) textEl.textContent = guidance;
    }

    // Update References Section
    if (referencesDiv) {
        referencesDiv.style.display = 'block';

        // Step-by-step calculation
        const setRef = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

        setRef('refPeakHour', peakHour.toLocaleString() + ' vph');
        setRef('refKType', kType.replace(/[()%\d.]/g, '').trim());
        setRef('refKFactor', '÷ ' + kFactor.toFixed(3));
        setRef('refBaseAADT', Math.round(baseAADT).toLocaleString());
        setRef('refDOWDay', dowLabel);
        setRef('refDOWFactor', '÷ ' + dowFactor.toFixed(2));
        setRef('refSeasonMonth', seasonLabel);
        setRef('refSeasonFactor', '÷ ' + seasonFactor.toFixed(2));
        setRef('refCurrentAADT', Math.round(currentAADT).toLocaleString());
        setRef('refGrowthYears', growthLabel.split('(')[0].trim());
        setRef('refGrowthFactor', '× ' + growthFactor.toFixed(2));
        setRef('refFinalAADT', designYearAADT.toLocaleString());

        // Data sources
        setRef('refKSourceDetail', `${sourceName} (${(kFactor * 100).toFixed(1)}%)`);
        setRef('refDOWSourceDetail', `${sourceName} DOW adjustment factors`);
        setRef('refSeasonSourceDetail', `${sourceName} seasonal patterns`);
        setRef('refGrowthSourceDetail', state === 'VA' ? 'VDOT Traffic Forecasting Guidebook (2024)' : 'State DOT traffic projections');

        // Confidence level based on data specificity
        const confFill = document.getElementById('refConfidenceFill');
        const confText = document.getElementById('refConfidenceText');
        const confNote = document.getElementById('refConfidenceNote');

        let confidence = 60; // Base confidence
        let confLabel = 'Moderate';
        let confColor = '#eab308';

        if (state === 'VA') {
            confidence = 80;
            confLabel = 'Good';
            confColor = '#22c55e';
            if (county !== 'OTHER_VA') {
                confidence = 85;
                confLabel = 'Good';
            }
        } else if (state !== 'OTHER') {
            confidence = 70;
            confLabel = 'Fair';
            confColor = '#3b82f6';
        }

        if (confFill) { confFill.style.width = confidence + '%'; confFill.style.background = confColor; }
        if (confText) { confText.textContent = confLabel; confText.style.color = confColor; }
        if (confNote) confNote.textContent = `Using ${sourceName} factors. Uncertainty: ±20% per FHWA TMG.`;
    }
}

/**
 * Apply calculated AADT from Quick Panel to the AADT input field
 */
function roundaboutQuick_applyAADT() {
    const aadtValue = document.getElementById('roundQuickAADTValue')?.textContent;
    if (!aadtValue || aadtValue === '--') return;

    const aadt = parseInt(aadtValue.replace(/,/g, ''), 10);

    // Apply to Quick Panel AADT input
    const quickAADTInput = document.getElementById('roundQuickAADT');
    if (quickAADTInput) {
        quickAADTInput.value = aadt;
        quickAADTInput.classList.add('ai-filled');
    }

    // Also sync to full form
    syncRoundaboutField('roundTotalAADT', aadt);

    // Hide converter panel
    roundaboutQuick_toggleAADTConverter();

    // Trigger evaluation
    evaluateRoundaboutQuick();

    // Show success toast
    showToast(`AADT set to ${aadt.toLocaleString()}`, 'success');
}

/**
 * Quick evaluation for the roundabout quick panel
 * Uses SIDRA-inspired metrics for instant feedback
 */
function evaluateRoundaboutQuick() {
    const aadt = parseFloat(document.getElementById('roundQuickAADT')?.value) || 0;
    const row = parseFloat(document.getElementById('roundQuickROW')?.value) || 0;
    const safetyCount = [
        document.getElementById('roundQuickSafety1')?.checked,
        document.getElementById('roundQuickSafety2')?.checked,
        document.getElementById('roundQuickSafety3')?.checked
    ].filter(Boolean).length;

    // Calculate SIDRA metrics (using WB-50 as default design vehicle)
    const metrics = roundabout_calculateSIDRAMetrics(aadt, 0, 'WB-50');

    // V/C Ratio display
    const vcEl = document.getElementById('roundQuickVC');
    if (vcEl) {
        vcEl.textContent = metrics.vcRatio > 0 ? metrics.vcRatio.toFixed(2) : '--';
        vcEl.style.color = metrics.vcColor;
    }

    // LOS display
    const losEl = document.getElementById('roundQuickLOS');
    if (losEl) {
        losEl.textContent = metrics.los;
        losEl.style.color = metrics.losColor;
    }

    // Type display
    const typeEl = document.getElementById('roundQuickType');
    if (typeEl) {
        // Abbreviate for quick panel
        let typeText = '--';
        if (metrics.roundaboutType === 'Mini') typeText = 'Mini';
        else if (metrics.roundaboutType === 'Single-Lane') typeText = '1-Lane';
        else if (metrics.roundaboutType === 'Multi-Lane') typeText = 'Multi';
        else if (metrics.roundaboutType === 'Over Capacity') typeText = 'Over';
        typeEl.textContent = typeText;
        typeEl.style.color = metrics.roundaboutType === 'Over Capacity' ? '#dc2626' : '#8b5cf6';
    }

    // ROW assessment
    let rowText = '--';
    let rowColor = '#8b5cf6';
    if (row > 0) {
        if (row < metrics.minICD) {
            rowText = 'Too Small';
            rowColor = '#dc2626';
        } else if (row < metrics.minICD + 30) {
            rowText = 'Tight';
            rowColor = '#d97706';
        } else {
            rowText = 'OK';
            rowColor = '#059669';
        }
    }
    const rowEl = document.getElementById('roundQuickROWStatus');
    if (rowEl) {
        rowEl.textContent = rowText;
        rowEl.style.color = rowColor;
    }

    // Overall feasibility assessment
    let feasibilityText = '--';
    let feasibilityColor = '#8b5cf6';
    if (aadt > 0 || row > 0 || safetyCount > 0) {
        if (metrics.vcRatio <= 0.85 && (row === 0 || row >= metrics.minICD) && safetyCount >= 1) {
            feasibilityText = 'Feasible';
            feasibilityColor = '#059669';
        } else if (metrics.vcRatio > 0.95 || (row > 0 && row < metrics.minICD)) {
            feasibilityText = 'Challenges';
            feasibilityColor = '#dc2626';
        } else if (aadt > 0) {
            feasibilityText = 'Evaluate';
            feasibilityColor = '#d97706';
        }
    }
    const feasibilityEl = document.getElementById('roundQuickFeasibility');
    if (feasibilityEl) {
        feasibilityEl.textContent = feasibilityText;
        feasibilityEl.style.color = feasibilityColor;
    }

    // Also trigger main form evaluation
    evaluateRoundabout();
}

/**
 * Scroll to the full roundabout analysis form
 */
function scrollToFullRoundaboutForm() {
    const form = document.getElementById('warrantFormRoundabout');
    if (form) {
        // Ensure the form is visible before scrolling
        if (form.style.display === 'none') {
            form.style.display = 'block';
        }
        // Add a small delay to ensure DOM is ready, then scroll
        setTimeout(() => {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

/**
 * Initialize roundabout feasibility form when tab is shown
 * Always displays the analysis form with default values
 */
function roundabout_onTabShow() {
    console.log('[Roundabout] Tab shown - initializing form');

    // Set today's date as default evaluation date
    const evalDateInput = document.getElementById('roundEvalDate');
    if (evalDateInput && !evalDateInput.value) {
        evalDateInput.value = new Date().toISOString().split('T')[0];
    }

    // Initialize roundabout state if needed
    if (!warrantsState.roundabout) {
        warrantsState.roundabout = {
            config: { availableROW: 0 },
            trafficData: { totalAADT: 0, peakHourVolume: 0 },
            crashAnalysis: {
                total: 0, angleLeftTurn: 0, headOn: 0, rearEnd: 0,
                sideswipe: 0, pedestrian: 0, bicycle: 0, kaCount: 0
            },
            safetyPrediction: {},
            constraints: {},
            iceScores: {},
            recommendation: null,
            multiDayData: {}
        };
    }

    // Try to restore from IndexedDB
    warrantDbRestoreRoundabout().then(loaded => {
        if (loaded) {
            console.log('[Roundabout] Restored saved data from IndexedDB');
            evaluateRoundabout();
        }
    }).catch(e => {
        console.error('[Roundabout] IndexedDB restore error:', e);
    });

    // If location is already selected, populate crash data and smart indicators
    if (warrantsState.selectedLocation && warrantsState.filteredCrashes?.length > 0) {
        roundabout_autoPopulateCrashData();
        roundabout_updateSmartIndicators();
    } else {
        // Reset to manual mode if no location selected
        roundabout_resetIndicatorsToManual();
    }

    // Run initial evaluation to show default state
    evaluateRoundabout();

    // Scroll the roundabout form into view for better UX
    setTimeout(() => {
        const form = document.getElementById('warrantFormRoundabout');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

function evaluateRoundabout() {
    const totalAADT = parseFloat(document.getElementById('roundTotalAADT').value) || 0;
    const peakVol = parseFloat(document.getElementById('roundPeakVol').value) || 0;
    const row = parseFloat(document.getElementById('roundROW').value) || 0;
    const designVehicle = document.getElementById('roundDesignVehicle')?.value || 'WB-50';

    // Calculate and display SIDRA metrics
    const sidraMetrics = roundabout_calculateSIDRAMetrics(totalAADT, peakVol, designVehicle);
    roundabout_updateSIDRADisplay(sidraMetrics);

    // Safety indicators
    const safetyIndicators = [
        document.getElementById('roundSafety1')?.checked,
        document.getElementById('roundSafety2')?.checked,
        document.getElementById('roundSafety3')?.checked,
        document.getElementById('roundSafety4')?.checked,
        document.getElementById('roundSafety5')?.checked
    ].filter(Boolean).length;

    // Constraints
    const constraints = [
        document.getElementById('roundConst1')?.checked,
        document.getElementById('roundConst2')?.checked,
        document.getElementById('roundConst3')?.checked,
        document.getElementById('roundConst4')?.checked
    ].filter(Boolean).length;

    // Check if form has any data entered
    const hasData = totalAADT > 0 || peakVol > 0 || row > 0 || safetyIndicators > 0 || constraints > 0;

    // Show getting started guide if no data entered
    if (!hasData) {
        // Update result banner to pending state
        roundabout_updateResultBanner('pending', 0);

        document.getElementById('roundaboutResult').innerHTML = `
            <div class="warrant-result-box info" style="background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border:2px solid #3b82f6">
                <h4 style="color:#1e40af;margin-bottom:.75rem">🔄 Roundabout Feasibility Analyzer</h4>
                <p style="margin-bottom:1rem;color:#334155">Complete the form above to evaluate roundabout feasibility for your intersection.</p>
                <div style="display:grid;gap:.5rem;font-size:.85rem">
                    <div style="padding:.5rem;background:white;border-radius:6px;border:1px solid #bfdbfe">
                        <strong style="color:#1e40af">Step 1:</strong> Select a location or enter intersection name manually
                    </div>
                    <div style="padding:.5rem;background:white;border-radius:6px;border:1px solid #bfdbfe">
                        <strong style="color:#1e40af">Step 2:</strong> Enter AADT and peak hour volume (required for V/C analysis)
                    </div>
                    <div style="padding:.5rem;background:white;border-radius:6px;border:1px solid #bfdbfe">
                        <strong style="color:#1e40af">Step 3:</strong> Check applicable safety indicators and constraints
                    </div>
                    <div style="padding:.5rem;background:white;border-radius:6px;border:1px solid #bfdbfe">
                        <strong style="color:#1e40af">Step 4:</strong> Enter available right-of-way (ROW) in feet
                    </div>
                </div>
                <div style="margin-top:1rem;padding:.75rem;background:#f0fdf4;border-radius:6px;border:1px solid #86efac">
                    <p style="font-size:.8rem;margin:0;color:#166534">
                        <strong>💡 SIDRA/HCM:</strong> V/C ≤ 0.85 = Good capacity | LOS A-C = Acceptable operations
                    </p>
                </div>
            </div>
        `;
        return;
    }

    let feasibility = 'Unknown';
    let boxClass = 'info';
    let details = [];

    // Capacity check with SIDRA V/C details
    if (totalAADT > 0) {
        const vcInfo = sidraMetrics.vcRatio > 0 ? ` (V/C: ${sidraMetrics.vcRatio.toFixed(2)}, LOS ${sidraMetrics.los})` : '';
        if (sidraMetrics.vcRatio <= 0.85) {
            details.push(`✓ ${sidraMetrics.roundaboutType} roundabout - Good capacity${vcInfo}`);
        } else if (sidraMetrics.vcRatio <= 0.95) {
            details.push(`⚠️ ${sidraMetrics.roundaboutType} roundabout - Acceptable but near capacity${vcInfo}`);
        } else {
            details.push(`❌ Over capacity - consider multi-lane or alternative control${vcInfo}`);
        }
    }

    // Safety benefit assessment
    if (safetyIndicators >= 3) {
        feasibility = 'Strongly Recommended';
        boxClass = 'pass';
        details.push(`✓ ${safetyIndicators} of 5 safety indicators present - strong safety case`);
    } else if (safetyIndicators >= 1) {
        feasibility = 'Consider Further';
        boxClass = 'warning';
        details.push(`⚠️ ${safetyIndicators} of 5 safety indicators present`);
    }

    // Constraint check
    if (constraints >= 2) {
        feasibility = 'Significant Constraints';
        boxClass = 'fail';
        details.push(`❌ ${constraints} physical constraints identified - may limit feasibility`);
    } else if (constraints === 1) {
        details.push(`⚠️ 1 physical constraint noted - requires engineering evaluation`);
    }

    // ROW check
    if (row > 0) {
        if (row < 90) {
            details.push('❌ ROW may be insufficient for minimum inscribed circle diameter');
        } else if (row < 130) {
            details.push('✓ ROW adequate for mini or single-lane roundabout');
        } else {
            details.push('✓ ROW adequate for multi-lane roundabout');
        }
    }

    // Run enhanced evaluation with safety prediction
    roundabout_runEnhancedEvaluation(totalAADT, peakVol, row, safetyIndicators, constraints, details);
}

/**
 * Smart Safety Indicators - Auto-link crash profile to roundabout indicators
 * Implements the full feature: auto-check, visual feedback, compound risk assessment
 */

// Thresholds for auto-detection
const ROUNDABOUT_INDICATOR_THRESHOLDS = {
    anglePercent: 25,      // ≥25% angle crashes = high risk
    speedPercent: 10,      // ≥10% speed-related = elevated risk
    minCrashesForConfidence: 20  // Minimum crashes for "High" confidence
};

// Track user overrides
const roundaboutIndicatorOverrides = { 1: false, 2: false };

/**
 * Update smart safety indicators based on crash profile data
 * Called when location is selected or crash data changes
 */
function roundabout_updateSmartIndicators() {
    const profile = warrantsState.crashProfile;
    const crashes = warrantsState.filteredCrashes || [];

    if (!profile || profile.total === 0) {
        // Reset to manual mode
        roundabout_resetIndicatorsToManual();
        return;
    }

    // Calculate percentages
    const totalCrashes = profile.total;
    const angleCount = profile.angleCount || 0;
    const speedCount = profile.factors?.speed || 0;
    const injuryCount = (profile.severity?.K || 0) + (profile.severity?.A || 0) +
                        (profile.severity?.B || 0) + (profile.severity?.C || 0);

    const anglePct = totalCrashes > 0 ? (angleCount / totalCrashes) * 100 : 0;
    const speedPct = totalCrashes > 0 ? (speedCount / totalCrashes) * 100 : 0;
    const injuryPct = totalCrashes > 0 ? (injuryCount / totalCrashes) * 100 : 0;

    // Update source indicator
    document.getElementById('roundIndicatorSource').textContent = 'Auto-Filled from Crash Data';
    document.getElementById('roundIndicatorSource').style.background = '#d1fae5';
    document.getElementById('roundIndicatorSource').style.color = '#065f46';

    // Update Indicator 1: Angle/Left-Turn Risk
    roundabout_updateIndicator1(angleCount, anglePct, totalCrashes);

    // Update Indicator 2: Speed-Related Risk
    roundabout_updateIndicator2(speedCount, speedPct, totalCrashes);

    // Update Compound Risk Assessment
    roundabout_updateRiskAssessment(totalCrashes, injuryCount, injuryPct, anglePct, speedPct);

    // Trigger evaluation update
    evaluateRoundaboutQuick();

    console.log('[Roundabout] Smart indicators updated:', {
        total: totalCrashes,
        anglePct: anglePct.toFixed(1) + '%',
        speedPct: speedPct.toFixed(1) + '%',
        injuryCount
    });
}

/**
 * Update Indicator 1: Angle/Left-Turn Crash Risk
 */
function roundabout_updateIndicator1(count, pct, total) {
    const checkbox = document.getElementById('roundQuickSafety1');
    const statusEl = document.getElementById('roundIndicator1Status');
    const detailsEl = document.getElementById('roundIndicator1Details');
    const angleEl = document.getElementById('roundIndicator1Angle');
    const barEl = document.getElementById('roundIndicator1Bar')?.querySelector('div');
    const cardEl = document.getElementById('roundIndicator1Card');

    // Determine risk level
    const threshold = ROUNDABOUT_INDICATOR_THRESHOLDS.anglePercent;
    const isHighRisk = pct >= threshold;
    const riskLevel = pct >= 40 ? 'HIGH' : (pct >= threshold ? 'MODERATE' : 'LOW');

    // Update display
    angleEl.textContent = `${pct.toFixed(0)}% (${count} of ${total})`;

    // Update progress bar (max at 100%)
    if (barEl) {
        barEl.style.width = Math.min(pct, 100) + '%';
        barEl.style.background = isHighRisk ? '#dc2626' : (pct >= threshold * 0.7 ? '#f59e0b' : '#22c55e');
    }

    // Update status badge
    if (isHighRisk) {
        statusEl.textContent = riskLevel;
        statusEl.style.background = riskLevel === 'HIGH' ? '#fee2e2' : '#fef3c7';
        statusEl.style.color = riskLevel === 'HIGH' ? '#dc2626' : '#92400e';
    } else {
        statusEl.textContent = 'LOW';
        statusEl.style.background = '#d1fae5';
        statusEl.style.color = '#065f46';
    }

    // Show details
    detailsEl.style.display = 'block';

    // Update card border
    if (isHighRisk) {
        cardEl.style.borderColor = riskLevel === 'HIGH' ? '#dc2626' : '#f59e0b';
        cardEl.style.background = riskLevel === 'HIGH' ? '#fef2f2' : '#fffbeb';
    } else {
        cardEl.style.borderColor = '#22c55e';
        cardEl.style.background = '#f0fdf4';
    }

    // Auto-check if not overridden by user
    if (!roundaboutIndicatorOverrides[1]) {
        checkbox.checked = isHighRisk;
        syncRoundaboutCheckbox('roundSafety1', isHighRisk);
    }
}

/**
 * Update Indicator 2: Speed-Related Crash Risk
 */
function roundabout_updateIndicator2(count, pct, total) {
    const checkbox = document.getElementById('roundQuickSafety2');
    const statusEl = document.getElementById('roundIndicator2Status');
    const detailsEl = document.getElementById('roundIndicator2Details');
    const speedEl = document.getElementById('roundIndicator2Speed');
    const barEl = document.getElementById('roundIndicator2Bar')?.querySelector('div');
    const cardEl = document.getElementById('roundIndicator2Card');

    // Determine risk level
    const threshold = ROUNDABOUT_INDICATOR_THRESHOLDS.speedPercent;
    const isElevated = pct >= threshold;
    const riskLevel = pct >= 25 ? 'HIGH' : (pct >= threshold ? 'MODERATE' : 'LOW');

    // Update display
    speedEl.textContent = `${pct.toFixed(0)}% (${count} of ${total})`;

    // Update progress bar
    if (barEl) {
        barEl.style.width = Math.min(pct * 2, 100) + '%'; // Scale for visibility
        barEl.style.background = isElevated ? '#f59e0b' : '#22c55e';
    }

    // Update status badge
    if (isElevated) {
        statusEl.textContent = riskLevel;
        statusEl.style.background = riskLevel === 'HIGH' ? '#fee2e2' : '#fef3c7';
        statusEl.style.color = riskLevel === 'HIGH' ? '#dc2626' : '#92400e';
    } else {
        statusEl.textContent = 'LOW';
        statusEl.style.background = '#d1fae5';
        statusEl.style.color = '#065f46';
    }

    // Show details
    detailsEl.style.display = 'block';

    // Update card border
    if (isElevated) {
        cardEl.style.borderColor = riskLevel === 'HIGH' ? '#dc2626' : '#f59e0b';
        cardEl.style.background = riskLevel === 'HIGH' ? '#fef2f2' : '#fffbeb';
    } else {
        cardEl.style.borderColor = '#22c55e';
        cardEl.style.background = '#f0fdf4';
    }

    // Auto-check if not overridden by user
    if (!roundaboutIndicatorOverrides[2]) {
        checkbox.checked = isElevated;
        syncRoundaboutCheckbox('roundSafety2', isElevated);
    }
}

/**
 * Update Compound Risk Assessment with confidence scoring
 */
function roundabout_updateRiskAssessment(totalCrashes, injuryCount, injuryPct, anglePct, speedPct) {
    const assessmentEl = document.getElementById('roundaboutRiskAssessment');
    const confidenceEl = document.getElementById('roundaboutConfidenceBadge');
    const scoreEl = document.getElementById('roundaboutCandidacyScore');
    const totalEl = document.getElementById('roundRiskTotalCrashes');
    const injuryEl = document.getElementById('roundRiskInjuryCrashes');
    const insightEl = document.getElementById('roundaboutInsightText');
    const benefitEl = document.getElementById('roundaboutBenefitProjection');
    const patternEl = document.getElementById('roundaboutPatternAnalysis');

    // Show assessment panel
    assessmentEl.style.display = 'block';

    // Update crash totals
    totalEl.textContent = totalCrashes;
    injuryEl.textContent = `${injuryCount} (${injuryPct.toFixed(0)}%)`;

    // Calculate confidence level based on sample size
    let confidence, confidenceColor;
    if (totalCrashes >= ROUNDABOUT_INDICATOR_THRESHOLDS.minCrashesForConfidence) {
        confidence = 'High Confidence';
        confidenceColor = '#d1fae5';
    } else if (totalCrashes >= 10) {
        confidence = 'Moderate Confidence';
        confidenceColor = '#fef3c7';
    } else {
        confidence = 'Low Sample Size';
        confidenceColor = '#fee2e2';
    }
    confidenceEl.textContent = confidence;
    confidenceEl.style.background = confidenceColor;

    // Calculate candidacy score (0-100)
    let score = 0;
    let patterns = [];

    // Angle crash contribution (0-40 points)
    if (anglePct >= 40) {
        score += 40;
        patterns.push('very high angle crash rate');
    } else if (anglePct >= 25) {
        score += 30;
        patterns.push('elevated angle crash rate');
    } else if (anglePct >= 15) {
        score += 15;
    }

    // Speed contribution (0-30 points)
    if (speedPct >= 25) {
        score += 30;
        patterns.push('significant speed-related crashes');
    } else if (speedPct >= 10) {
        score += 20;
        patterns.push('speed-related crashes present');
    } else if (speedPct >= 5) {
        score += 10;
    }

    // Injury severity contribution (0-30 points)
    if (injuryPct >= 40) {
        score += 30;
        patterns.push('high injury rate');
    } else if (injuryPct >= 25) {
        score += 20;
    } else if (injuryPct >= 10) {
        score += 10;
    }

    // Determine candidacy level
    let candidacy, candidacyColor;
    if (score >= 70) {
        candidacy = 'Strong';
        candidacyColor = '#22c55e';
    } else if (score >= 45) {
        candidacy = 'Moderate';
        candidacyColor = '#f59e0b';
    } else if (score >= 25) {
        candidacy = 'Consider';
        candidacyColor = '#3b82f6';
    } else {
        candidacy = 'Limited';
        candidacyColor = '#64748b';
    }

    scoreEl.textContent = candidacy;
    scoreEl.style.color = candidacyColor;

    // Generate plain language insight
    let insight = '';
    if (patterns.length === 0) {
        insight = `This location shows ${totalCrashes} crashes over the analysis period with no dominant crash pattern. Roundabout benefits may be limited based on crash data alone.`;
        patternEl.style.background = 'linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%)';
        patternEl.style.borderColor = '#e2e8f0';
        patternEl.querySelector('div').style.color = '#64748b';
        insightEl.style.color = '#64748b';
    } else if (score >= 70) {
        insight = `This location shows ${patterns.join(' combined with ')} (${totalCrashes} crashes). Roundabouts typically reduce angle crashes by 70-90% and naturally calm speeds, making this a strong candidate for roundabout consideration.`;
        patternEl.style.background = 'linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%)';
        patternEl.style.borderColor = '#22c55e';
        patternEl.querySelector('div').style.color = '#065f46';
        insightEl.style.color = '#065f46';
    } else if (score >= 45) {
        insight = `This location shows ${patterns.join(' and ')} (${totalCrashes} crashes). The crash pattern suggests potential roundabout benefits, though a detailed operational analysis is recommended.`;
        patternEl.style.background = 'linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)';
        patternEl.style.borderColor = '#f59e0b';
        patternEl.querySelector('div').style.color = '#92400e';
        insightEl.style.color = '#92400e';
    } else {
        insight = `This location shows ${totalCrashes} crashes with ${patterns.length > 0 ? patterns.join(', ') : 'no dominant pattern'}. Review operational factors to determine if a roundabout is appropriate.`;
        patternEl.style.background = 'linear-gradient(135deg,#dbeafe 0%,#bfdbfe 100%)';
        patternEl.style.borderColor = '#3b82f6';
        patternEl.querySelector('div').style.color = '#1e40af';
        insightEl.style.color = '#1e40af';
    }
    insightEl.textContent = insight;

    // Update benefit projection if significant crash pattern
    if (score >= 25 && totalCrashes >= 5) {
        benefitEl.style.display = 'block';

        // NCHRP 888 reduction factors
        const angleReduction = Math.round(anglePct * 0.8); // 80% of angle crashes reduced
        const injuryReduction = Math.round(injuryPct * 0.78); // 78% injury reduction
        const overallBenefit = Math.round((angleReduction + injuryReduction) / 2);

        document.getElementById('roundBenefitAngle').textContent = `-${Math.round(anglePct * 0.8)}%`;
        document.getElementById('roundBenefitInjury').textContent = `-${Math.round(injuryPct * 0.78)}%`;
        document.getElementById('roundBenefitOverall').textContent = score >= 70 ? 'High' : (score >= 45 ? 'Moderate' : 'Some');
    } else {
        benefitEl.style.display = 'none';
    }
}

/**
 * Reset indicators to manual entry mode
 */
function roundabout_resetIndicatorsToManual() {
    document.getElementById('roundIndicatorSource').textContent = 'Manual Entry';
    document.getElementById('roundIndicatorSource').style.background = '#f1f5f9';
    document.getElementById('roundIndicatorSource').style.color = '#64748b';

    // Reset indicator 1
    document.getElementById('roundIndicator1Details').style.display = 'none';
    document.getElementById('roundIndicator1Status').textContent = '--';
    document.getElementById('roundIndicator1Status').style.background = '#f1f5f9';
    document.getElementById('roundIndicator1Status').style.color = '#64748b';
    document.getElementById('roundIndicator1Card').style.borderColor = '#e2e8f0';
    document.getElementById('roundIndicator1Card').style.background = 'white';

    // Reset indicator 2
    document.getElementById('roundIndicator2Details').style.display = 'none';
    document.getElementById('roundIndicator2Status').textContent = '--';
    document.getElementById('roundIndicator2Status').style.background = '#f1f5f9';
    document.getElementById('roundIndicator2Status').style.color = '#64748b';
    document.getElementById('roundIndicator2Card').style.borderColor = '#e2e8f0';
    document.getElementById('roundIndicator2Card').style.background = 'white';

    // Hide risk assessment
    document.getElementById('roundaboutRiskAssessment').style.display = 'none';

    // Reset overrides
    roundaboutIndicatorOverrides[1] = false;
    roundaboutIndicatorOverrides[2] = false;
}

/**
 * Handle user override of auto-filled indicator
 */
function roundabout_toggleIndicatorOverride(indicatorNum) {
    roundaboutIndicatorOverrides[indicatorNum] = true;
    console.log(`[Roundabout] User override indicator ${indicatorNum}`);
}

/**
 * Auto-populate roundabout crash data from filtered crashes
 * Mirrors signal_autoPopulateWarrant7() pattern for consistency
 */
function roundabout_autoPopulateCrashData() {
    // Ensure filtered crashes are synced
    if (warrantsState.locationCrashes && warrantsState.locationCrashes.length > 0) {
        filterWarrantCrashesByDate();
    }

    const crashes = warrantsState.filteredCrashes;
    const crashAnalysis = warrantsState.roundabout.crashAnalysis;

    // Log collision types for debugging
    if (crashes && crashes.length > 0) {
        const collisionTypes = {};
        crashes.forEach(c => {
            const type = c[COL.COLLISION] || 'Unknown';
            collisionTypes[type] = (collisionTypes[type] || 0) + 1;
        });
        console.log('[Roundabout] Collision types in filtered crashes:', collisionTypes);
    }

    if (!crashes || crashes.length === 0) {
        console.warn('[Roundabout] No filtered crashes available for analysis', {
            location: warrantsState.selectedLocation,
            locationCrashes: warrantsState.locationCrashes?.length || 0,
            dateFilter: warrantsState.dateFilter
        });
        // Reset crash analysis
        Object.assign(crashAnalysis, {
            totalCrashes: 0, angleCrashes: 0, leftTurnCrashes: 0,
            rearEndCrashes: 0, sideswipeCrashes: 0, headOnCrashes: 0,
            pedestrianCrashes: 0, bicycleCrashes: 0,
            fatalSeriousCrashes: 0, injuryCrashes: 0, pdoCrashes: 0,
            epdoScore: 0, autoPopulated: true, sourceData: null
        });
        roundabout_updateCrashDisplay();
        return;
    }

    // Count crashes by type
    let angleCrashes = [], leftTurnCrashes = [], rearEndCrashes = [];
    let sideswipeCrashes = [], headOnCrashes = [];
    let pedestrianCrashes = [], bicycleCrashes = [];
    let fatalSerious = 0, injury = 0, pdo = 0;
    let epdoScore = 0;

    crashes.forEach(crash => {
        const collType = (crash[COL.COLLISION] || '').toLowerCase();
        const severity = (crash[COL.SEVERITY] || '').toUpperCase();

        // Count by collision type using pattern matching
        if (ROUNDABOUT_CRASH_PATTERNS.angle.some(p => collType.includes(p))) {
            angleCrashes.push(crash);
        }
        if (ROUNDABOUT_CRASH_PATTERNS.leftTurn.some(p => collType.includes(p))) {
            leftTurnCrashes.push(crash);
        }
        if (ROUNDABOUT_CRASH_PATTERNS.rearEnd.some(p => collType.includes(p))) {
            rearEndCrashes.push(crash);
        }
        if (ROUNDABOUT_CRASH_PATTERNS.sideswipe.some(p => collType.includes(p))) {
            sideswipeCrashes.push(crash);
        }
        if (ROUNDABOUT_CRASH_PATTERNS.headOn.some(p => collType.includes(p))) {
            headOnCrashes.push(crash);
        }

        // Check pedestrian/bicycle involvement
        const pedFlag = crash[COL.PED];
        const bikeFlag = crash[COL.BIKE];
        if (pedFlag === 'Y' || pedFlag === 1 || pedFlag === '1' ||
            ROUNDABOUT_CRASH_PATTERNS.pedestrian.some(p => collType.includes(p))) {
            pedestrianCrashes.push(crash);
        }
        if (bikeFlag === 'Y' || bikeFlag === 1 || bikeFlag === '1' ||
            ROUNDABOUT_CRASH_PATTERNS.bicycle.some(p => collType.includes(p))) {
            bicycleCrashes.push(crash);
        }

        // Severity counts (KABCO classification)
        // K = Fatal, A = Incapacitating, B = Non-Incapacitating, C = Possible Injury, O = PDO
        if (severity === 'K' || severity === 'A') {
            fatalSerious++;
            injury++;
        } else if (severity === 'B' || severity === 'C') {
            injury++;  // B and C are both injury crashes
        } else {
            pdo++;  // Only O (Property Damage Only) goes here
        }

        // EPDO calculation — CC 341 F3: FHWA 2025 weights (FHWA-SA-25-021)
        const weights = (window.CL && window.CL.core && window.CL.core.constants && window.CL.core.constants.EPDO_WEIGHTS_DEFAULT)
                     || { K: 883, A: 94, B: 21, C: 11, O: 1 };
        epdoScore += weights[severity] || 1;
    });

    // Update crash analysis state
    Object.assign(crashAnalysis, {
        totalCrashes: crashes.length,
        angleCrashes: angleCrashes.length,
        leftTurnCrashes: leftTurnCrashes.length,
        rearEndCrashes: rearEndCrashes.length,
        sideswipeCrashes: sideswipeCrashes.length,
        headOnCrashes: headOnCrashes.length,
        pedestrianCrashes: pedestrianCrashes.length,
        bicycleCrashes: bicycleCrashes.length,
        fatalSeriousCrashes: fatalSerious,
        injuryCrashes: injury,
        pdoCrashes: pdo,
        epdoScore: epdoScore,
        autoPopulated: true,
        sourceData: {
            angleCrashes, leftTurnCrashes, rearEndCrashes,
            sideswipeCrashes, headOnCrashes,
            pedestrianCrashes, bicycleCrashes
        }
    });

    console.log('[Roundabout] Crash analysis populated:', {
        total: crashes.length,
        angle: angleCrashes.length,
        leftTurn: leftTurnCrashes.length,
        headOn: headOnCrashes.length,
        fatalSerious: fatalSerious,
        epdo: epdoScore
    });

    // Update UI
    roundabout_updateCrashDisplay();

    // Calculate safety prediction
    roundabout_calculateSafetyPrediction();
}

/**
 * Update roundabout crash display in form
 */
function roundabout_updateCrashDisplay() {
    const ca = warrantsState.roundabout.crashAnalysis;

    // Update form fields
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    };

    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setVal('roundCrashTotal', ca.totalCrashes);
    setVal('roundCrashAngle', ca.angleCrashes + ca.leftTurnCrashes);
    setVal('roundCrashKA', ca.fatalSeriousCrashes);

    // Update detailed crash type breakdown
    setText('roundCrashHeadOn', ca.headOnCrashes);
    setText('roundCrashRearEnd', ca.rearEndCrashes);
    setText('roundCrashSideswipe', ca.sideswipeCrashes);
    setText('roundCrashPed', ca.pedestrianCrashes);

    // Update expected reduction display
    const prediction = warrantsState.roundabout.safetyPrediction;
    if (prediction.annualCrashSavings !== null) {
        const reductionPct = Math.round(prediction.crashReductionPct || 0);
        setVal('roundCrashReduction', `${prediction.annualCrashSavings.toFixed(1)}/yr (${reductionPct}%)`);
    } else if (ca.totalCrashes > 0) {
        // Estimate using default CMF
        const estimatedReduction = Math.round(ca.totalCrashes * 0.48);
        setVal('roundCrashReduction', `~${estimatedReduction} (est. 48%)`);
    }
}

/**
 * Toggle approach volume table visibility
 */
function roundabout_toggleApproachTable() {
    const container = document.getElementById('roundApproachTableContainer');
    const btn = document.getElementById('roundApproachToggle');
    if (container.style.display === 'none') {
        container.style.display = 'block';
        btn.textContent = 'Hide Table';
    } else {
        container.style.display = 'none';
        btn.textContent = 'Show Table';
    }
}

/**
 * Update total AADT from approach volumes
 */
function roundabout_updateTotalFromApproaches() {
    const approaches = ['NB', 'SB', 'EB', 'WB'];
    let total = 0;

    approaches.forEach(dir => {
        const val = parseFloat(document.getElementById(`round${dir}_AADT`)?.value) || 0;
        total += val;
    });

    if (total > 0) {
        document.getElementById('roundTotalAADT').value = total;
        warrantsState.roundabout.trafficData.totalAADT = total;
        evaluateRoundabout();
    }
}

/**
 * Trigger file upload for traffic study
 */
function roundabout_uploadTrafficStudy() {
    document.getElementById('roundTrafficStudyUpload').click();
}

/**
 * Handle traffic study file upload for AI extraction
 */
async function roundabout_handleTrafficUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    showToast(`Processing ${file.name}...`, 'info');

    try {
        // Read file content
        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrl = e.target.result;
            let content = '';

            // Parse based on file type
            if (file.name.toLowerCase().endsWith('.pdf')) {
                content = await parsePDFContent(dataUrl);
            } else if (file.name.toLowerCase().match(/\.(xlsx?|csv)$/)) {
                content = parseExcelContent(dataUrl, file.name);
            }

            if (content) {
                // Call AI extraction
                await roundabout_extractTrafficData(content, file.name);
            } else {
                showToast('Could not parse file content', 'warning');
            }
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('[Roundabout] Traffic upload error:', error);
        showToast('Error processing file', 'error');
    }
}

/**
 * AI extraction for roundabout traffic data
 */
async function roundabout_extractTrafficData(content, fileName) {
    const apiKey = await getApiKey();
    if (!apiKey) {
        showToast('API key required for AI extraction', 'warning');
        return;
    }

    showToast('Extracting traffic data with AI...', 'info');

    const prompt = `Extract traffic volume data from this document for a roundabout feasibility analysis.

DOCUMENT CONTENT:
${content.substring(0, 15000)}

Extract and return the following in JSON format:
{
    "totalAADT": number or null,
    "peakHourVolume": number or null,
    "heavyVehiclePercent": number or null,
    "approaches": [
        {"direction": "NB", "aadt": number, "peakVol": number, "leftPct": number, "thruPct": number, "rightPct": number, "hvPct": number},
        {"direction": "SB", ...},
        {"direction": "EB", ...},
        {"direction": "WB", ...}
    ],
    "intersectionName": string or null,
    "confidence": number (0-100)
}

If data is not available, use null. Return only valid JSON.`;

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
                max_tokens: 2000,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        const text = data.content[0].text;

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const extracted = JSON.parse(jsonMatch[0]);
            roundabout_applyExtractedData(extracted);
            showToast(`Extracted traffic data (${extracted.confidence || 'N/A'}% confidence)`, 'success');
        } else {
            showToast('Could not parse AI response', 'warning');
        }
    } catch (error) {
        console.error('[Roundabout] AI extraction error:', error);
        showToast('AI extraction failed', 'error');
    }
}

/**
 * Apply extracted traffic data to form
 */
function roundabout_applyExtractedData(data) {
    // Apply total AADT
    if (data.totalAADT) {
        document.getElementById('roundTotalAADT').value = data.totalAADT;
        document.getElementById('roundTotalAADT').classList.add('ai-filled');
    }

    // Apply peak hour volume
    if (data.peakHourVolume) {
        document.getElementById('roundPeakVol').value = data.peakHourVolume;
        document.getElementById('roundPeakVol').classList.add('ai-filled');
    }

    // Apply intersection name
    if (data.intersectionName) {
        document.getElementById('roundIntersectionName').value = data.intersectionName;
        document.getElementById('roundIntersectionName').classList.add('ai-filled');
    }

    // Apply approach data
    if (data.approaches && Array.isArray(data.approaches)) {
        data.approaches.forEach(app => {
            const dir = app.direction?.toUpperCase();
            if (!['NB', 'SB', 'EB', 'WB'].includes(dir)) return;

            const setField = (suffix, value) => {
                const el = document.getElementById(`round${dir}_${suffix}`);
                if (el && value !== null && value !== undefined) {
                    el.value = value;
                    el.classList.add('ai-filled');
                }
            };

            setField('AADT', app.aadt);
            setField('Peak', app.peakVol);
            setField('Left', app.leftPct);
            setField('Thru', app.thruPct);
            setField('Right', app.rightPct);
            setField('HV', app.hvPct);
        });

        // Show the approach table
        document.getElementById('roundApproachTableContainer').style.display = 'block';
        document.getElementById('roundApproachToggle').textContent = 'Hide Table';
    }

    // Update state and re-evaluate
    roundabout_updateTotalFromApproaches();
}

/**
 * Calculate safety prediction using NCHRP 888 SPF/CMF methodology
 */
function roundabout_calculateSafetyPrediction() {
    const config = warrantsState.roundabout.config;
    const traffic = warrantsState.roundabout.trafficData;
    const crashes = warrantsState.roundabout.crashAnalysis;
    const prediction = warrantsState.roundabout.safetyPrediction;

    // Get current control type from form
    const currentControl = document.getElementById('roundCurrentControl')?.value || config.currentControl || '2way_stop';
    config.currentControl = currentControl;

    // Get area type
    const areaType = document.getElementById('roundAreaType')?.value || config.areaType || 'suburban';
    config.areaType = areaType;

    // Get number of legs
    const legs = parseInt(document.getElementById('roundApproaches')?.value) || config.numberOfLegs || 4;
    config.numberOfLegs = legs;

    // Get AADT
    const aadt = traffic.totalAADT || parseFloat(document.getElementById('roundTotalAADT')?.value) || 0;
    traffic.totalAADT = aadt;

    // Get inscribed diameter
    const icd = config.inscribedDiameter || parseFloat(document.getElementById('roundICD')?.value) || 130;

    if (crashes.totalCrashes === 0 && aadt === 0) {
        // Not enough data
        Object.assign(prediction, {
            existingPredictedCrashes: null,
            roundaboutPredictedCrashes: null,
            crashReductionPct: null,
            injuryReductionPct: null,
            fatalSeriousReductionPct: null,
            annualCrashSavings: null,
            annualInjurySavings: null,
            epdoSavings: null
        });
        return;
    }

    // Get CMFs for conversion
    const totalCMF = ROUNDABOUT_CONVERSION_CMFS.totalCrashes[currentControl] || 0.50;
    const injuryCMF = ROUNDABOUT_CONVERSION_CMFS.injuryCrashes[currentControl] || 0.22;
    const fatalSeriousCMF = ROUNDABOUT_CONVERSION_CMFS.fatalSeriousCrashes[currentControl] || 0.20;

    // Apply leg CMF adjustment
    const legCMF = ROUNDABOUT_LEG_CMF[legs] || ROUNDABOUT_LEG_CMF[4];

    // Apply ICD CMF adjustment (NCHRP 888)
    let icdCMF = 1.0;
    if (icd > 0) {
        const adjustedICD = Math.max(ROUNDABOUT_ICD_CMF.minICD, Math.min(ROUNDABOUT_ICD_CMF.maxICD, icd));
        icdCMF = Math.exp(ROUNDABOUT_ICD_CMF.coefficient * (adjustedICD - ROUNDABOUT_ICD_CMF.baseICD));
        icdCMF = Math.max(ROUNDABOUT_ICD_CMF.minCMF, icdCMF);
    }

    // Calculate actual analysis period from date filter (dynamic, not hardcoded)
    const yearsOfData = calculateAnalysisPeriodYears();
    const annualCrashes = crashes.totalCrashes / yearsOfData;
    const annualInjury = crashes.injuryCrashes / yearsOfData;
    const annualFatalSerious = crashes.fatalSeriousCrashes / yearsOfData;

    // Apply combined CMFs
    const combinedTotalCMF = totalCMF * legCMF * icdCMF;
    const combinedInjuryCMF = injuryCMF * legCMF * icdCMF;
    const combinedFSCMF = fatalSeriousCMF * legCMF * icdCMF;

    // Calculate expected crashes with roundabout
    const expectedTotalWithRoundabout = annualCrashes * combinedTotalCMF;
    const expectedInjuryWithRoundabout = annualInjury * combinedInjuryCMF;
    const expectedFSWithRoundabout = annualFatalSerious * combinedFSCMF;

    // Calculate savings
    const totalSavings = annualCrashes - expectedTotalWithRoundabout;
    const injurySavings = annualInjury - expectedInjuryWithRoundabout;

    // EPDO savings
    const annualEPDO = crashes.epdoScore / yearsOfData;
    const epdoSavings = annualEPDO * (1 - combinedTotalCMF);

    // Store predictions
    Object.assign(prediction, {
        existingPredictedCrashes: annualCrashes,
        roundaboutPredictedCrashes: expectedTotalWithRoundabout,
        crashReductionPct: (1 - combinedTotalCMF) * 100,
        injuryReductionPct: (1 - combinedInjuryCMF) * 100,
        fatalSeriousReductionPct: (1 - combinedFSCMF) * 100,
        annualCrashSavings: totalSavings,
        annualInjurySavings: injurySavings,
        epdoSavings: epdoSavings
    });

    console.log('[Roundabout] Safety prediction:', {
        currentControl,
        totalCMF: combinedTotalCMF.toFixed(3),
        annualCrashes: annualCrashes.toFixed(1),
        expectedWithRoundabout: expectedTotalWithRoundabout.toFixed(1),
        reductionPct: prediction.crashReductionPct.toFixed(0) + '%',
        annualSavings: totalSavings.toFixed(1)
    });
}

/**
 * Calculate ICE (Intersection Control Evaluation) scores
 * Per Virginia iCAP methodology
 */
function roundabout_calculateICEScores() {
    const config = warrantsState.roundabout.config;
    const traffic = warrantsState.roundabout.trafficData;
    const crashes = warrantsState.roundabout.crashAnalysis;
    const prediction = warrantsState.roundabout.safetyPrediction;
    const constraints = warrantsState.roundabout.constraints;
    const ice = warrantsState.roundabout.iceScores;

    // ===== SAFETY SCORE (35% weight) =====
    let safetyScore = 50; // Base score

    // Crash reduction benefit
    if (prediction.crashReductionPct !== null) {
        safetyScore += Math.min(30, prediction.crashReductionPct * 0.6);
    }

    // Angle/left-turn crash history (roundabouts excel at reducing these)
    const angleLTCrashes = crashes.angleCrashes + crashes.leftTurnCrashes;
    if (angleLTCrashes >= 5) safetyScore += 15;
    else if (angleLTCrashes >= 3) safetyScore += 10;
    else if (angleLTCrashes >= 1) safetyScore += 5;

    // Head-on crashes (significant reduction opportunity)
    if (crashes.headOnCrashes >= 1) safetyScore += 10;

    // Fatal/serious crashes (high reduction potential)
    if (crashes.fatalSeriousCrashes >= 2) safetyScore += 10;
    else if (crashes.fatalSeriousCrashes >= 1) safetyScore += 5;

    // Pedestrian concerns (mixed results - slight deduction if high ped volume area)
    if (crashes.pedestrianCrashes >= 3) safetyScore -= 5;

    // Bicycle concerns (roundabouts can increase bike crashes)
    if (crashes.bicycleCrashes >= 2) safetyScore -= 10;

    ice.safety = Math.max(0, Math.min(100, safetyScore));

    // ===== OPERATIONS SCORE (25% weight) =====
    let opsScore = 50;
    const aadt = traffic.totalAADT || 0;

    // Capacity assessment
    if (aadt > 0) {
        if (aadt <= ROUNDABOUT_CAPACITY.singleLane.maxAADT) {
            opsScore += 25; // Within single-lane capacity
        } else if (aadt <= ROUNDABOUT_CAPACITY.multiLane.maxAADT) {
            opsScore += 15; // Within multi-lane capacity
        } else {
            opsScore -= 20; // Exceeds capacity
        }
    }

    // Current control type (delay improvement potential)
    const currentControl = config.currentControl;
    if (currentControl === 'signal') {
        opsScore += 10; // Potential delay reduction from signal
    } else if (currentControl === '4way_stop') {
        opsScore += 15; // Significant delay reduction from all-way stop
    } else if (currentControl === '2way_stop') {
        opsScore += 5; // Moderate improvement
    }

    ice.operations = Math.max(0, Math.min(100, opsScore));

    // ===== COST SCORE (20% weight) =====
    let costScore = 50;

    // ROW availability affects cost
    const row = config.availableROW || parseFloat(document.getElementById('roundROW')?.value) || 0;
    if (row >= 150) {
        costScore += 20; // Ample ROW
    } else if (row >= 120) {
        costScore += 10; // Adequate ROW
    } else if (row >= 90) {
        costScore -= 5; // Tight fit
    } else if (row > 0) {
        costScore -= 20; // May need ROW acquisition
    }

    // Existing control type affects conversion cost
    if (currentControl === 'signal') {
        costScore += 10; // Signal removal offsets some cost
    } else if (currentControl === 'none' || currentControl === 'yield') {
        costScore -= 10; // Lower baseline means higher relative cost
    }

    ice.cost = Math.max(0, Math.min(100, costScore));

    // ===== MULTIMODAL SCORE (10% weight) =====
    let multiScore = 50;

    // Single-lane better for pedestrians
    if (aadt > 0 && aadt <= ROUNDABOUT_CAPACITY.singleLane.maxAADT) {
        multiScore += 20;
    } else if (aadt > ROUNDABOUT_CAPACITY.singleLane.maxAADT) {
        multiScore -= 10; // Multi-lane more challenging for peds
    }

    // High pedestrian crash history is a concern
    if (crashes.pedestrianCrashes >= 3) {
        multiScore -= 15;
    }

    // High bicycle crash history is a concern
    if (crashes.bicycleCrashes >= 2) {
        multiScore -= 20;
    }

    ice.multimodal = Math.max(0, Math.min(100, multiScore));

    // ===== CONTEXT SCORE (10% weight) =====
    let contextScore = 60;

    // Area type considerations
    const areaType = config.areaType;
    if (areaType === 'suburban') {
        contextScore += 15; // Roundabouts work well in suburban areas
    } else if (areaType === 'rural') {
        contextScore += 10; // Good for rural intersections
    } else if (areaType === 'urban') {
        contextScore += 5; // Can work in urban but more challenging
    }

    // Constraint deductions
    if (constraints.rowInsufficient) contextScore -= 15;
    if (constraints.gradeIssues) contextScore -= 10;
    if (constraints.truckAccommodation) contextScore -= 10;
    if (constraints.railroadConflict) contextScore -= 20;

    ice.context = Math.max(0, Math.min(100, contextScore));

    // ===== OVERALL WEIGHTED SCORE =====
    ice.overall = Math.round(
        ice.safety * ICE_SCORING_WEIGHTS.safety +
        ice.operations * ICE_SCORING_WEIGHTS.operations +
        ice.cost * ICE_SCORING_WEIGHTS.cost +
        ice.multimodal * ICE_SCORING_WEIGHTS.multimodal +
        ice.context * ICE_SCORING_WEIGHTS.context
    );

    console.log('[Roundabout] ICE Scores:', ice);

    return ice;
}

/**
 * Run enhanced roundabout evaluation with safety prediction and ICE scoring
 */
function roundabout_runEnhancedEvaluation(totalAADT, peakVol, row, safetyIndicators, constraints, baseDetails) {
    // Update traffic data in state
    warrantsState.roundabout.trafficData.totalAADT = totalAADT;
    warrantsState.roundabout.trafficData.peakHourVolume = peakVol;
    warrantsState.roundabout.config.availableROW = row;

    // Update constraints in state
    warrantsState.roundabout.constraints.rowInsufficient = document.getElementById('roundConst1')?.checked || false;
    warrantsState.roundabout.constraints.gradeIssues = document.getElementById('roundConst2')?.checked || false;
    warrantsState.roundabout.constraints.truckAccommodation = document.getElementById('roundConst3')?.checked || false;
    warrantsState.roundabout.constraints.railroadConflict = document.getElementById('roundConst4')?.checked || false;

    // Calculate safety prediction
    roundabout_calculateSafetyPrediction();

    // Calculate ICE scores
    const ice = roundabout_calculateICEScores();

    // Determine recommendation
    let feasibility = 'Unknown';
    let boxClass = 'info';
    let details = [...baseDetails];

    // Add safety prediction details
    const prediction = warrantsState.roundabout.safetyPrediction;
    if (prediction.annualCrashSavings !== null) {
        const reductionPct = Math.round(prediction.crashReductionPct);
        const injuryReductionPct = Math.round(prediction.injuryReductionPct);
        details.push(`📊 <strong>Predicted Safety Benefit:</strong> ${reductionPct}% total crash reduction, ${injuryReductionPct}% injury reduction`);
        details.push(`💰 <strong>Annual Savings:</strong> ${prediction.annualCrashSavings.toFixed(1)} crashes/year, ${Math.round(prediction.epdoSavings)} EPDO`);
    }

    // Determine feasibility based on ICE score
    if (ice.overall >= 70) {
        feasibility = 'Strongly Recommended';
        boxClass = 'pass';
        warrantsState.roundabout.recommendation = 'feasible';
    } else if (ice.overall >= 50) {
        feasibility = 'Feasible with Conditions';
        boxClass = 'warning';
        warrantsState.roundabout.recommendation = 'conditional';
    } else {
        feasibility = 'Not Recommended';
        boxClass = 'fail';
        warrantsState.roundabout.recommendation = 'not_recommended';
    }

    // Override for severe constraints
    if (constraints >= 2) {
        feasibility = 'Significant Constraints';
        boxClass = 'fail';
        warrantsState.roundabout.recommendation = 'not_recommended';
    }

    // Build ICE score display
    const iceDisplay = `
        <div style="margin-top:1rem;padding:.75rem;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
            <h5 style="margin:0 0 .5rem 0;font-size:.9rem;color:#334155">📊 ICE Evaluation (Virginia iCAP)</h5>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;font-size:.8rem">
                <div>Safety: <strong style="color:${ice.safety >= 60 ? '#059669' : ice.safety >= 40 ? '#d97706' : '#dc2626'}">${ice.safety}</strong>/100</div>
                <div>Operations: <strong style="color:${ice.operations >= 60 ? '#059669' : ice.operations >= 40 ? '#d97706' : '#dc2626'}">${ice.operations}</strong>/100</div>
                <div>Cost: <strong style="color:${ice.cost >= 60 ? '#059669' : ice.cost >= 40 ? '#d97706' : '#dc2626'}">${ice.cost}</strong>/100</div>
                <div>Multimodal: <strong style="color:${ice.multimodal >= 60 ? '#059669' : ice.multimodal >= 40 ? '#d97706' : '#dc2626'}">${ice.multimodal}</strong>/100</div>
                <div>Context: <strong style="color:${ice.context >= 60 ? '#059669' : ice.context >= 40 ? '#d97706' : '#dc2626'}">${ice.context}</strong>/100</div>
                <div style="font-weight:bold">Overall: <span style="color:${ice.overall >= 70 ? '#059669' : ice.overall >= 50 ? '#d97706' : '#dc2626'}">${ice.overall}</span>/100</div>
            </div>
        </div>
    `;

    // Bicycle warning if applicable
    const crashes = warrantsState.roundabout.crashAnalysis;
    let bikeWarning = '';
    if (crashes.bicycleCrashes >= 1) {
        bikeWarning = `
            <div style="margin-top:.5rem;padding:.5rem;background:#fef3c7;border-radius:4px;border:1px solid #f59e0b;font-size:.8rem">
                ⚠️ <strong>Bicycle Consideration:</strong> ${crashes.bicycleCrashes} bicycle crash(es) at this location.
                Research shows bicycle crashes may increase at roundabouts. Consider enhanced bicycle facilities.
            </div>
        `;
    }

    // Period validation warning
    const yearsOfData = calculateAnalysisPeriodYears();
    let periodWarning = '';
    if (yearsOfData < 2.5 || yearsOfData > 3.5) {
        const monthsOfData = Math.round(yearsOfData * 12);
        const warningClass = yearsOfData < 2 ? 'background:#fef2f2;border:1px solid #fecaca;color:#991b1b' : 'background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af';
        periodWarning = `
            <div style="margin-top:.5rem;padding:.5rem;border-radius:4px;font-size:.8rem;${warningClass}">
                📅 <strong>Analysis Period:</strong> ${monthsOfData} months used. FHWA recommends 36-month period for safety assessments.
                ${yearsOfData < 2 ? ' Results may be less reliable with shorter periods.' : ''}
            </div>
        `;
    }

    document.getElementById('roundaboutResult').innerHTML = `
        <div class="warrant-result-box ${boxClass}">
            <h4>Roundabout Feasibility: ${feasibility}</h4>
            ${details.map(d => `<p>${d}</p>`).join('')}
            ${iceDisplay}
            ${bikeWarning}
            ${periodWarning}
            <p style="font-size:.8rem;margin-top:.5rem;color:#64748b">
                <strong>Standards:</strong> SIDRA/HCM Methodology, NCHRP 888, Virginia iCAP, FHWA Roundabout Guide
            </p>
        </div>
    `;

    // Update the result banner
    const crashReduction = prediction.crashReductionPct || 0;
    roundabout_updateResultBanner(warrantsState.roundabout.recommendation, crashReduction);

    warrantsState.roundabout.analysisTimestamp = Date.now();
}

/**
 * Refresh roundabout analysis when period changes
 */
function roundabout_refreshAnalysis() {
    // Re-filter crashes
    filterWarrantCrashesByDate();

    // Re-populate crash data
    roundabout_autoPopulateCrashData();

    // Re-run evaluation
    evaluateRoundabout();

    console.log('[Roundabout] Analysis refreshed with updated date range');
}

/**
 * Generate Word Memo for Roundabout Feasibility Study
 * Based on SIDRA/HCM methodology, NCHRP 888, and Virginia iCAP guidelines
 */
async function roundabout_generateWordMemo() {
    const state = warrantsState.roundabout;
    if (!state || !state.recommendation) {
        showToast('Please complete roundabout analysis before exporting', 'warning');
        return;
    }

    const { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType, AlignmentType, BorderStyle } = docx;

    const intersectionName = document.getElementById('roundIntersectionName')?.value || 'Intersection';
    const evalDate = document.getElementById('roundEvalDate')?.value || new Date().toISOString().split('T')[0];
    const areaType = document.getElementById('roundAreaType')?.value || 'suburban';
    const currentControl = document.getElementById('roundCurrentControl')?.value || 'unknown';
    const approaches = document.getElementById('roundApproaches')?.value || '4';
    const designVehicle = document.getElementById('roundDesignVehicle')?.value || 'WB-50';
    const totalAADT = document.getElementById('roundTotalAADT')?.value || '0';
    const peakVol = document.getElementById('roundPeakVol')?.value || '0';
    const availableROW = document.getElementById('roundROW')?.value || '0';

    // Get SIDRA metrics
    const sidraMetrics = state.sidraMetrics || {};
    const ice = state.iceScores || {};
    const prediction = state.safetyPrediction || {};
    const crashes = state.crashAnalysis || {};

    // Recommendation text
    const recommendationMap = {
        'feasible': 'ROUNDABOUT FEASIBLE - Analysis indicates a roundabout is a viable alternative',
        'conditional': 'CONDITIONALLY FEASIBLE - Roundabout may be feasible with design modifications',
        'not_recommended': 'NOT RECOMMENDED - Significant constraints or capacity issues identified'
    };
    const recommendationText = recommendationMap[state.recommendation] || 'Analysis Incomplete';

    try {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    // Header
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'MEMORANDUM', bold: true, size: 32 })
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
                            new TextRun({ text: `Roundabout Feasibility Study - ${intersectionName}` })
                        ],
                        spacing: { after: 300 }
                    }),

                    // Horizontal line
                    new Paragraph({
                        border: { bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 300 }
                    }),

                    // Purpose
                    new Paragraph({
                        text: 'PURPOSE',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: `A roundabout feasibility study was conducted at ${intersectionName} in accordance with FHWA Roundabouts: An Informational Guide (NCHRP Report 672), NCHRP Report 888 (Safety Prediction Functions), Virginia iCAP guidelines, and SIDRA/HCM operational methodology. This memorandum summarizes the findings and recommendations.`,
                        spacing: { after: 300 }
                    }),

                    // Recommendation Summary
                    new Paragraph({
                        text: 'RECOMMENDATION',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: recommendationText, bold: true, size: 28 })
                        ],
                        spacing: { after: 300 }
                    }),

                    // Location & Configuration
                    new Paragraph({
                        text: 'LOCATION & CONFIGURATION',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Intersection: ', bold: true }),
                            new TextRun({ text: intersectionName })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Evaluation Date: ', bold: true }),
                            new TextRun({ text: evalDate })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Area Type: ', bold: true }),
                            new TextRun({ text: areaType.charAt(0).toUpperCase() + areaType.slice(1) })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Current Control: ', bold: true }),
                            new TextRun({ text: currentControl.replace('_', ' ').toUpperCase() })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Number of Approaches: ', bold: true }),
                            new TextRun({ text: `${approaches}-leg` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Design Vehicle: ', bold: true }),
                            new TextRun({ text: designVehicle })
                        ],
                        spacing: { after: 300 }
                    }),

                    // Operational Analysis (SIDRA/HCM)
                    new Paragraph({
                        text: 'OPERATIONAL ANALYSIS (SIDRA/HCM METHODOLOGY)',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Total Entering AADT: ', bold: true }),
                            new TextRun({ text: `${parseInt(totalAADT).toLocaleString()} vehicles/day` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Peak Hour Volume: ', bold: true }),
                            new TextRun({ text: `${parseInt(peakVol).toLocaleString()} vehicles/hour` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'V/C Ratio: ', bold: true }),
                            new TextRun({ text: sidraMetrics.vcRatio ? sidraMetrics.vcRatio.toFixed(2) : 'N/A' }),
                            new TextRun({ text: ` (${sidraMetrics.vcStatus || 'N/A'})` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Level of Service: ', bold: true }),
                            new TextRun({ text: sidraMetrics.los || 'N/A' })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Control Delay: ', bold: true }),
                            new TextRun({ text: sidraMetrics.controlDelay ? `${sidraMetrics.controlDelay.toFixed(1)} sec/veh` : 'N/A' })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: '95th Percentile Queue: ', bold: true }),
                            new TextRun({ text: sidraMetrics.queue95 ? `${sidraMetrics.queue95} vehicles` : 'N/A' })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Recommended Type: ', bold: true }),
                            new TextRun({ text: sidraMetrics.roundaboutType || 'N/A' })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Minimum ICD: ', bold: true }),
                            new TextRun({ text: sidraMetrics.minICD ? `${sidraMetrics.minICD}-${sidraMetrics.maxICD} ft` : 'N/A' })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Available ROW: ', bold: true }),
                            new TextRun({ text: `${availableROW} ft` })
                        ],
                        spacing: { after: 300 }
                    }),

                    // Safety Analysis
                    new Paragraph({
                        text: 'SAFETY ANALYSIS (NCHRP 888)',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Analysis Period: ', bold: true }),
                            new TextRun({ text: `${Math.round(calculateAnalysisPeriodYears() * 12)} months` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Total Crashes: ', bold: true }),
                            new TextRun({ text: `${crashes.total || 0}` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Angle/Left-Turn: ', bold: true }),
                            new TextRun({ text: `${crashes.angleLeftTurn || 0} (roundabout CMF: 0.25-0.30)` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Head-On: ', bold: true }),
                            new TextRun({ text: `${crashes.headOn || 0} (roundabout CMF: 0.20)` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Fatal/Serious (K+A): ', bold: true }),
                            new TextRun({ text: `${crashes.kaCount || 0} (roundabout reduces injury severity 75-82%)` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Predicted Crash Reduction: ', bold: true }),
                            new TextRun({ text: prediction.crashReductionPct ? `${Math.round(prediction.crashReductionPct)}%` : 'N/A' })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Annual Crash Savings: ', bold: true }),
                            new TextRun({ text: prediction.annualCrashSavings ? `${prediction.annualCrashSavings.toFixed(1)} crashes/year` : 'N/A' })
                        ],
                        spacing: { after: 300 }
                    }),

                    // ICE Evaluation
                    new Paragraph({
                        text: 'ICE EVALUATION (VIRGINIA iCAP)',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Safety Score: ', bold: true }),
                            new TextRun({ text: `${ice.safety || 'N/A'}/100` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Operations Score: ', bold: true }),
                            new TextRun({ text: `${ice.operations || 'N/A'}/100` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Cost Score: ', bold: true }),
                            new TextRun({ text: `${ice.cost || 'N/A'}/100` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Multimodal Score: ', bold: true }),
                            new TextRun({ text: `${ice.multimodal || 'N/A'}/100` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Context Score: ', bold: true }),
                            new TextRun({ text: `${ice.context || 'N/A'}/100` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'OVERALL ICE SCORE: ', bold: true }),
                            new TextRun({ text: `${ice.overall || 'N/A'}/100`, bold: true })
                        ],
                        spacing: { after: 300 }
                    }),

                    // References
                    new Paragraph({
                        text: 'REFERENCES',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: '• FHWA Roundabouts: An Informational Guide (NCHRP Report 672)',
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        text: '• NCHRP Report 888: Development of Roundabout Crash Prediction Models and Methods',
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        text: '• SIDRA Intersection Software Methodology (HCM 6th Edition)',
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        text: '• Virginia iCAP (Intersection Control Analysis Policy)',
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        text: '• Highway Capacity Manual 6th Edition (TRB)',
                        spacing: { after: 300 }
                    }),

                    // Disclaimer
                    new Paragraph({
                        text: 'DISCLAIMER',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: 'This analysis is for screening purposes only and does not constitute professional engineering advice. Final roundabout feasibility determinations require review by a licensed Professional Engineer and field verification of all data inputs. Detailed capacity analysis should be performed using approved software (e.g., SIDRA Intersection, HCS) before final design.',
                        spacing: { after: 200 }
                    })
                ]
            }]
        });

        const blob = await docx.Packer.toBlob(doc);
        const filename = `Roundabout_Feasibility_${intersectionName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
        saveAs(blob, filename);
        showToast('Word memo exported successfully!', 'success');
    } catch (error) {
        console.error('[Roundabout] Word memo export error:', error);
        showToast('Error exporting Word memo: ' + error.message, 'error');
    }
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.warrants = CL.warrants || {};
  CL.warrants.roundabout = CL.warrants.roundabout || {};
  window.roundabout_calculateSIDRAMetrics = roundabout_calculateSIDRAMetrics; CL.warrants.roundabout.roundabout_calculateSIDRAMetrics = roundabout_calculateSIDRAMetrics;
  window.roundabout_updateSIDRADisplay = roundabout_updateSIDRADisplay; CL.warrants.roundabout.roundabout_updateSIDRADisplay = roundabout_updateSIDRADisplay;
  window.roundabout_updateResultBanner = roundabout_updateResultBanner; CL.warrants.roundabout.roundabout_updateResultBanner = roundabout_updateResultBanner;
  window.roundabout_toggleAADTConverter = roundabout_toggleAADTConverter; CL.warrants.roundabout.roundabout_toggleAADTConverter = roundabout_toggleAADTConverter;
  window.roundabout_setAADTSource = roundabout_setAADTSource; CL.warrants.roundabout.roundabout_setAADTSource = roundabout_setAADTSource;
  window.roundabout_setKFactor = roundabout_setKFactor; CL.warrants.roundabout.roundabout_setKFactor = roundabout_setKFactor;
  window.roundabout_toggleCustomKFactor = roundabout_toggleCustomKFactor; CL.warrants.roundabout.roundabout_toggleCustomKFactor = roundabout_toggleCustomKFactor;
  window.roundabout_applyCustomKFactor = roundabout_applyCustomKFactor; CL.warrants.roundabout.roundabout_applyCustomKFactor = roundabout_applyCustomKFactor;
  window.roundabout_setDOWFactor = roundabout_setDOWFactor; CL.warrants.roundabout.roundabout_setDOWFactor = roundabout_setDOWFactor;
  window.roundabout_updateSeasonalFactor = roundabout_updateSeasonalFactor; CL.warrants.roundabout.roundabout_updateSeasonalFactor = roundabout_updateSeasonalFactor;
  window.roundabout_calculateAADT = roundabout_calculateAADT; CL.warrants.roundabout.roundabout_calculateAADT = roundabout_calculateAADT;
  window.roundabout_applyCalculatedAADT = roundabout_applyCalculatedAADT; CL.warrants.roundabout.roundabout_applyCalculatedAADT = roundabout_applyCalculatedAADT;
  window.roundaboutQuick_toggleAADTConverter = roundaboutQuick_toggleAADTConverter; CL.warrants.roundabout.roundaboutQuick_toggleAADTConverter = roundaboutQuick_toggleAADTConverter;
  window.roundaboutQuick_updateLocationFactors = roundaboutQuick_updateLocationFactors; CL.warrants.roundabout.roundaboutQuick_updateLocationFactors = roundaboutQuick_updateLocationFactors;
  window.toggleElement = toggleElement; CL.warrants.roundabout.toggleElement = toggleElement;
  window.roundaboutQuick_calculateAADT = roundaboutQuick_calculateAADT; CL.warrants.roundabout.roundaboutQuick_calculateAADT = roundaboutQuick_calculateAADT;
  window.roundaboutQuick_applyAADT = roundaboutQuick_applyAADT; CL.warrants.roundabout.roundaboutQuick_applyAADT = roundaboutQuick_applyAADT;
  window.evaluateRoundaboutQuick = evaluateRoundaboutQuick; CL.warrants.roundabout.evaluateRoundaboutQuick = evaluateRoundaboutQuick;
  window.scrollToFullRoundaboutForm = scrollToFullRoundaboutForm; CL.warrants.roundabout.scrollToFullRoundaboutForm = scrollToFullRoundaboutForm;
  window.roundabout_onTabShow = roundabout_onTabShow; CL.warrants.roundabout.roundabout_onTabShow = roundabout_onTabShow;
  window.evaluateRoundabout = evaluateRoundabout; CL.warrants.roundabout.evaluateRoundabout = evaluateRoundabout;
  window.roundabout_updateSmartIndicators = roundabout_updateSmartIndicators; CL.warrants.roundabout.roundabout_updateSmartIndicators = roundabout_updateSmartIndicators;
  window.roundabout_updateIndicator1 = roundabout_updateIndicator1; CL.warrants.roundabout.roundabout_updateIndicator1 = roundabout_updateIndicator1;
  window.roundabout_updateIndicator2 = roundabout_updateIndicator2; CL.warrants.roundabout.roundabout_updateIndicator2 = roundabout_updateIndicator2;
  window.roundabout_updateRiskAssessment = roundabout_updateRiskAssessment; CL.warrants.roundabout.roundabout_updateRiskAssessment = roundabout_updateRiskAssessment;
  window.roundabout_resetIndicatorsToManual = roundabout_resetIndicatorsToManual; CL.warrants.roundabout.roundabout_resetIndicatorsToManual = roundabout_resetIndicatorsToManual;
  window.roundabout_toggleIndicatorOverride = roundabout_toggleIndicatorOverride; CL.warrants.roundabout.roundabout_toggleIndicatorOverride = roundabout_toggleIndicatorOverride;
  window.roundabout_autoPopulateCrashData = roundabout_autoPopulateCrashData; CL.warrants.roundabout.roundabout_autoPopulateCrashData = roundabout_autoPopulateCrashData;
  window.roundabout_updateCrashDisplay = roundabout_updateCrashDisplay; CL.warrants.roundabout.roundabout_updateCrashDisplay = roundabout_updateCrashDisplay;
  window.roundabout_toggleApproachTable = roundabout_toggleApproachTable; CL.warrants.roundabout.roundabout_toggleApproachTable = roundabout_toggleApproachTable;
  window.roundabout_updateTotalFromApproaches = roundabout_updateTotalFromApproaches; CL.warrants.roundabout.roundabout_updateTotalFromApproaches = roundabout_updateTotalFromApproaches;
  window.roundabout_uploadTrafficStudy = roundabout_uploadTrafficStudy; CL.warrants.roundabout.roundabout_uploadTrafficStudy = roundabout_uploadTrafficStudy;
  window.roundabout_handleTrafficUpload = roundabout_handleTrafficUpload; CL.warrants.roundabout.roundabout_handleTrafficUpload = roundabout_handleTrafficUpload;
  window.roundabout_extractTrafficData = roundabout_extractTrafficData; CL.warrants.roundabout.roundabout_extractTrafficData = roundabout_extractTrafficData;
  window.roundabout_applyExtractedData = roundabout_applyExtractedData; CL.warrants.roundabout.roundabout_applyExtractedData = roundabout_applyExtractedData;
  window.roundabout_calculateSafetyPrediction = roundabout_calculateSafetyPrediction; CL.warrants.roundabout.roundabout_calculateSafetyPrediction = roundabout_calculateSafetyPrediction;
  window.roundabout_calculateICEScores = roundabout_calculateICEScores; CL.warrants.roundabout.roundabout_calculateICEScores = roundabout_calculateICEScores;
  window.roundabout_runEnhancedEvaluation = roundabout_runEnhancedEvaluation; CL.warrants.roundabout.roundabout_runEnhancedEvaluation = roundabout_runEnhancedEvaluation;
  window.roundabout_refreshAnalysis = roundabout_refreshAnalysis; CL.warrants.roundabout.roundabout_refreshAnalysis = roundabout_refreshAnalysis;
  window.roundabout_generateWordMemo = roundabout_generateWordMemo; CL.warrants.roundabout.roundabout_generateWordMemo = roundabout_generateWordMemo;
  CL._registerModule('warrants/roundabout');
})();
