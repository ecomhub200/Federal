/**
 * CL warrants.stopsign — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.warrants.stopsign.<fn>; any
 * module-private state stays inside this IIFE (no external refs).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
/**
 * Initialize stop sign warrant form and generate TMC table
 */
function stopsign_initForm() {
    console.log('[StopSign] Initializing form (TMC-based analysis)');

    // Initialize uploaded files object
    if (!warrantsState.stopsign.uploadedFiles) {
        warrantsState.stopsign.uploadedFiles = {};
    }

    // Set default evaluation date to today
    const today = new Date().toISOString().split('T')[0];
    const evalDateInput = document.getElementById('stopEvalDate');
    if (evalDateInput && !evalDateInput.value) {
        evalDateInput.value = today;
    }

    // Set default count date to today (TMC date input)
    const countDateInput = document.getElementById('stopsignTMCDate');
    if (countDateInput && !countDateInput.value) {
        countDateInput.value = today;
    }

    // Generate TMC table
    stopsign_updateTMCGrid();

    // Update speed threshold display
    stopsign_updateSpeedThreshold();

    // Initialize AI panel as expanded (it starts expanded in the new design)
    const aiPanelContent = document.getElementById('stopsignAIPanelContent');
    const aiPanelText = document.getElementById('stopsignAIPanelToggleText');
    const aiPanelArrow = document.getElementById('stopsignAIPanelArrow');
    const aiPanel = document.getElementById('stopsignAIPanel');

    if (aiPanelContent) aiPanelContent.style.display = 'block';
    if (aiPanelText) aiPanelText.textContent = 'Collapse';
    if (aiPanelArrow) aiPanelArrow.textContent = '▲';
    if (aiPanel) aiPanel.classList.add('expanded');

    // Hide results section initially
    const resultsSection = document.getElementById('stopsignResultsSection');
    if (resultsSection) resultsSection.classList.add('hidden');

    // Hide multi-day section initially
    const daysSection = document.getElementById('stopsignAddedDaysSection');
    if (daysSection) daysSection.classList.add('hidden');

    // Try to restore from IndexedDB, fall back to localStorage
    warrantDbRestoreStopSign().then(loaded => {
        if (loaded) {
            console.log('[StopSign] Restored saved data from IndexedDB');
            stopsign_updateTMCGrid();
            stopsign_updateDayCards();
        } else {
            // Fall back to localStorage
            stopsign_loadSavedData();
        }
    }).catch(() => {
        stopsign_loadSavedData();
    });

    // Auto-populate crash data if location is selected
    if (warrantsState.selectedLocation) {
        stopsign_autoPopulateCriterionB();
    }

    console.log('[StopSign] Form initialized successfully');
}

/**
 * Show a specific tab in the stop sign analyzer
 */
function stopsign_showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.stopsign-tab-content').forEach(content => {
        content.style.display = 'none';
    });

    // Remove active class from all tabs
    document.querySelectorAll('.stopsign-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected content and activate tab
    const contentId = `stopsignContent${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
    const tabId = `stopsignTab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;

    const content = document.getElementById(contentId);
    const tab = document.getElementById(tabId);

    if (content) content.style.display = 'block';
    if (tab) tab.classList.add('active');

    // Update state
    warrantsState.stopsign.currentTab = tabName;

    // Special actions per tab
    if (tabName === 'criteria') {
        stopsign_evaluateAllCriteria();
    } else if (tabName === 'results') {
        stopsign_updateResultsTab();
    }
}

/**
 * Update speed threshold and 70% reduction indicator
 */
function stopsign_updateSpeedThreshold() {
    const speed85th = parseFloat(document.getElementById('stopSpeed85th')?.value) || null;
    const postedSpeed = parseFloat(document.getElementById('stopMajorSpeed')?.value) || 35;

    // Use 85th percentile if available, otherwise posted speed
    const effectiveSpeed = speed85th || postedSpeed;
    const apply70pct = effectiveSpeed > STOPSIGN_SPEED_THRESHOLD;

    // Update state
    warrantsState.stopsign.criterionC.apply70pct = apply70pct;

    // Get thresholds
    const thresholds = apply70pct ? STOPSIGN_VOLUME_THRESHOLDS.reduced70pct : STOPSIGN_VOLUME_THRESHOLDS.standard;
    const thresholds80pct = STOPSIGN_VOLUME_THRESHOLDS.threshold80pct;
    warrantsState.stopsign.criterionC.majorThreshold = thresholds.majorStreet;
    warrantsState.stopsign.criterionC.minorThreshold = thresholds.minorStreet;

    // Update UI indicators - 70% reduction indicator (new design uses hidden class)
    const indicator = document.getElementById('stopsign70pctIndicator');
    if (indicator) {
        if (apply70pct) {
            indicator.classList.remove('hidden');
        } else {
            indicator.classList.add('hidden');
        }
    }

    // Update threshold badge in card header
    const badge = document.getElementById('stopsignThresholdBadge');
    if (badge) {
        if (apply70pct) {
            badge.textContent = '70% Reduced: 210/140 vph';
            badge.style.background = '#fef3c7';
            badge.style.color = '#92400e';
        } else {
            badge.textContent = 'Standard: 300/200 vph';
            badge.style.background = '#dcfce7';
            badge.style.color = '#166534';
        }
    }

    // Update speed threshold display in config info box
    const speedThresholdDisplay = document.getElementById('stopsignSpeedThresholdDisplay');
    if (speedThresholdDisplay) {
        speedThresholdDisplay.textContent = apply70pct ? `Reduced (>${STOPSIGN_SPEED_THRESHOLD} mph)` : `Standard (≤${STOPSIGN_SPEED_THRESHOLD} mph)`;
    }

    // Update volume threshold display in config info box
    const volumeThresholdDisplay = document.getElementById('stopsignVolumeThresholdDisplay');
    if (volumeThresholdDisplay) {
        volumeThresholdDisplay.textContent = `Major ≥${thresholds.majorStreet} vph, Minor ≥${thresholds.minorStreet} vph`;
    }

    // Update table header labels
    const majorLabel = document.getElementById('stopsignMajorThresholdLabel');
    const minorLabel = document.getElementById('stopsignMinorThresholdLabel');
    if (majorLabel) majorLabel.textContent = thresholds.majorStreet;
    if (minorLabel) minorLabel.textContent = thresholds.minorStreet;

    // Update criteria card threshold displays
    const c1Threshold = document.getElementById('stopsignC1Threshold');
    const c2Threshold = document.getElementById('stopsignC2Threshold');
    if (c1Threshold) c1Threshold.textContent = thresholds.majorStreet;
    if (c2Threshold) c2Threshold.textContent = thresholds.minorStreet;

    // Update 80% threshold displays in Criterion D card
    const d_c1Threshold = document.getElementById('stopsignD_C1Threshold');
    const d_c2Threshold = document.getElementById('stopsignD_C2Threshold');
    if (d_c1Threshold) d_c1Threshold.textContent = apply70pct ? 168 : 240;  // 80% of 210 or 300
    if (d_c2Threshold) d_c2Threshold.textContent = apply70pct ? 112 : 160;  // 80% of 140 or 200

    // Re-evaluate volume data
    stopsign_updateVolumeAnalysis();
}

/**
 * Update configuration state
 */
function stopsign_updateConfig() {
    const state = warrantsState.stopsign;

    state.config.intersectionLegs = parseInt(document.getElementById('stopIntersectionLegs')?.value) || 4;
    state.config.existingControl = document.getElementById('stopExistingControl')?.value || 'two-way-stop';
    state.config.majorSpeedLimit = parseFloat(document.getElementById('stopMajorSpeed')?.value) || 35;
    state.config.areaType = document.getElementById('stopAreaType')?.value || 'urban';
}

/**
 * Update TMC grid headers based on major direction
 */
function stopsign_updateTMCGrid() {
    const majorDir = document.getElementById('stopsignMajorDirection')?.value || 'EW';
    const countType = document.getElementById('stopsignCountType')?.value || '12hr';
    const isMajorEW = majorDir === 'EW';

    console.log('[StopSign] Updating TMC Grid - Major Dir:', majorDir, 'Count Type:', countType);

    // Update state
    warrantsState.stopsign.config.majorDirection = majorDir;
    warrantsState.stopsign.config.countType = countType;

    // Generate header rows dynamically
    const thead = document.getElementById('stopsignTMCTableHead');
    if (!thead) return;

    // Build header row 1 (approach headers)
    let headerRow1 = '<tr><th class="tmc-hour-header" rowspan="2">Hour</th>';
    for (const approach of ['NB', 'SB', 'EB', 'WB']) {
        const isMajor = (isMajorEW && (approach === 'EB' || approach === 'WB')) ||
                       (!isMajorEW && (approach === 'NB' || approach === 'SB'));
        const typeClass = isMajor ? 'major' : 'minor';
        const typeLabel = isMajor ? 'Major' : 'Minor';
        headerRow1 += `<th class="tmc-approach-header ${typeClass}" colspan="4">${approach}<br><small>(${typeLabel})</small></th>`;
    }
    headerRow1 += '</tr>';

    // Build header row 2 (subheaders for LT, T, RT, Total)
    let headerRow2 = '<tr>';
    for (const approach of ['NB', 'SB', 'EB', 'WB']) {
        headerRow2 += '<th class="tmc-subheader">LT</th><th class="tmc-subheader">T</th><th class="tmc-subheader">RT</th>';
        headerRow2 += '<th class="tmc-subheader total">Total</th>';
    }
    headerRow2 += '</tr>';

    thead.innerHTML = headerRow1 + headerRow2;

    // Regenerate table body to match header
    stopsign_generateTMCRows();

    // Update volume summary labels based on major direction
    const majorLabel = document.querySelector('#stopsignMajorVolumeSum + div');
    const minorLabel = document.querySelector('#stopsignMinorVolumeSum + div');
    if (majorLabel) majorLabel.textContent = isMajorEW ? 'vph (EB+WB)' : 'vph (NB+SB)';
    if (minorLabel) minorLabel.textContent = isMajorEW ? 'vph (NB+SB)' : 'vph (EB+WB)';
}

/**
 * Generate TMC table rows
 */
function stopsign_generateTMCRows() {
    const tbody = document.getElementById('stopsignTMCTableBody');
    if (!tbody) return;

    // Clear existing rows
    tbody.innerHTML = '';

    const countType = document.getElementById('stopsignCountType')?.value || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;

    console.log('[StopSign] Generating TMC Rows - Count Type:', countType, 'Hours:', startHour, '-', endHour);

    const majorDir = document.getElementById('stopsignMajorDirection')?.value || 'EW';
    const isMajorEW = majorDir === 'EW';

    let html = '';
    for (let hour = startHour; hour < endHour; hour++) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        html += `<tr>
            <td class="tmc-hour-cell">${timeStr}</td>`;

        for (const approach of ['NB', 'SB', 'EB', 'WB']) {
            const isMajor = (isMajorEW && (approach === 'EB' || approach === 'WB')) ||
                           (!isMajorEW && (approach === 'NB' || approach === 'SB'));
            const bgClass = isMajor ? 'major-bg' : 'minor-bg';

            // Add LT, T, RT columns
            for (const mov of ['L', 'T', 'R']) {
                html += `<td class="tmc-cell ${bgClass}">
                    <input type="number" min="0" id="stopsign_tmc_${hour}_${approach}_${mov}"
                           onchange="stopsign_updateRowTotal(${hour},'${approach}')" placeholder="0">
                </td>`;
            }

            // Total column
            html += `<td class="tmc-cell total-cell">
                <input type="number" min="0" class="total-input" id="stopsign_tmc_${hour}_${approach}_total"
                       value="0" onchange="stopsign_markTotalManual(${hour},'${approach}')">
            </td>`;
        }
        html += '</tr>';
    }
    tbody.innerHTML = html;
}

// Track manually edited totals for stop sign TMC
const stopsignManualTotals = {};

/**
 * Update row total (L + T + R) unless manually edited
 */
function stopsign_updateRowTotal(hour, approach) {
    const key = `${hour}_${approach}`;
    // If user manually edited the total, don't auto-update
    if (stopsignManualTotals[key]) return;

    const L = parseInt(document.getElementById(`stopsign_tmc_${hour}_${approach}_L`)?.value) || 0;
    const T = parseInt(document.getElementById(`stopsign_tmc_${hour}_${approach}_T`)?.value) || 0;
    const R = parseInt(document.getElementById(`stopsign_tmc_${hour}_${approach}_R`)?.value) || 0;
    const totalEl = document.getElementById(`stopsign_tmc_${hour}_${approach}_total`);
    if (totalEl) totalEl.value = L + T + R;

    // Update volume summary
    stopsign_updateVolumeSummary();
}

/**
 * Mark a total as manually edited
 */
function stopsign_markTotalManual(hour, approach) {
    const key = `${hour}_${approach}`;
    stopsignManualTotals[key] = true;
    // Still update volume summary
    stopsign_updateVolumeSummary();
}

/**
 * Calculate approach volumes from TMC data for a specific hour
 */
function stopsign_calculateApproachVolumes(hour) {
    const majorDir = warrantsState.stopsign.config.majorDirection || 'EW';
    const isMajorEW = majorDir === 'EW';

    const approaches = ['NB', 'SB', 'EB', 'WB'];
    let majorSum = 0, minorSum = 0;

    for (const app of approaches) {
        const total = parseInt(document.getElementById(`stopsign_tmc_${hour}_${app}_total`)?.value) || 0;
        const isMajor = (isMajorEW && (app === 'EB' || app === 'WB')) ||
                        (!isMajorEW && (app === 'NB' || app === 'SB'));
        if (isMajor) majorSum += total;
        else minorSum += total;
    }

    return { major: majorSum, minor: minorSum };
}

/**
 * Compute hourly aggregates from multi-day TMC data based on averaging method
 * MUTCD 2B.07 requires volumes for an "average day"
 * @returns {Object} Hourly aggregates with major/minor volumes per hour
 */
function stopsign_computeHourlyAggregates() {
    const multiDay = warrantsState.stopsign.multiDayData;
    const method = warrantsState.stopsign.averagingMethod || 'tue-wed-thu';
    const dayKeys = Object.keys(multiDay);
    const majorDir = warrantsState.stopsign.config.majorDirection || 'EW';
    const isMajorEW = majorDir === 'EW';

    if (dayKeys.length === 0) return null;

    // Filter days based on averaging method
    let validDays = [];
    for (const key of dayKeys) {
        const dow = multiDay[key].dayOfWeek;
        if (method === 'tue-wed-thu' && [2, 3, 4].includes(dow)) {
            validDays.push(key);
        } else if (method === 'all-weekdays' && dow >= 1 && dow <= 5) {
            validDays.push(key);
        } else if (method === 'any-single-day') {
            validDays.push(key); // All days are valid for single-day mode
        }
    }

    // Fallback: if no days match the filter, use all available days
    if (validDays.length === 0) validDays = dayKeys;

    // Initialize aggregated data structure
    const aggregated = {};
    for (let hour = 0; hour < 24; hour++) {
        aggregated[hour] = { major: 0, minor: 0, hasData: false };
    }

    // Sum volumes across valid days
    for (const dayKey of validDays) {
        const dayData = multiDay[dayKey].hourlyData;
        if (!dayData) continue;

        for (const [hourStr, hourData] of Object.entries(dayData)) {
            const hour = parseInt(hourStr);
            if (isNaN(hour)) continue;

            // Handle both legacy format and TMC format
            if (hourData.majorVol !== undefined) {
                // Legacy format
                aggregated[hour].major += hourData.majorVol || 0;
                aggregated[hour].minor += hourData.minorVol || 0;
                if (hourData.majorVol > 0 || hourData.minorVol > 0) {
                    aggregated[hour].hasData = true;
                }
            } else {
                // TMC format: { NB: {L,T,R,total}, SB: {...}, EB: {...}, WB: {...} }
                for (const approach of ['NB', 'SB', 'EB', 'WB']) {
                    if (hourData[approach]) {
                        const isMajor = (isMajorEW && (approach === 'EB' || approach === 'WB')) ||
                                        (!isMajorEW && (approach === 'NB' || approach === 'SB'));
                        const approachTotal = hourData[approach].total || 0;
                        if (isMajor) aggregated[hour].major += approachTotal;
                        else aggregated[hour].minor += approachTotal;
                        if (approachTotal > 0) aggregated[hour].hasData = true;
                    }
                }
            }
        }
    }

    // Average if multiple days used (except for any-single-day mode which evaluates each day)
    if (validDays.length > 1 && method !== 'any-single-day') {
        for (let hour = 0; hour < 24; hour++) {
            aggregated[hour].major = Math.round(aggregated[hour].major / validDays.length);
            aggregated[hour].minor = Math.round(aggregated[hour].minor / validDays.length);
        }
    }

    // Store metadata
    aggregated._meta = {
        method: method,
        validDays: validDays.length,
        dayNames: validDays.map(k => multiDay[k].dayName)
    };

    return aggregated;
}

/**
 * Evaluate Criterion C from aggregated multi-day data
 * MUTCD 2B.07: Must be the SAME 8 hours where BOTH major AND minor thresholds are met
 * @returns {Object} Criterion C evaluation results
 */
function stopsign_evaluateCriterionCFromAggregates() {
    const aggregated = stopsign_computeHourlyAggregates();
    if (!aggregated) {
        return {
            hoursMeetingBoth: 0,
            hoursMeetingC1Only: 0,
            hoursMeetingC2Only: 0,
            c1Met: false,
            c2Met: false,
            bothMet: false,
            hourlyDetails: [],
            peakHour: null,
            peakMinorVolume: 0
        };
    }

    const thresholds = warrantsState.stopsign.criterionC.apply70pct
        ? STOPSIGN_VOLUME_THRESHOLDS.reduced70pct
        : STOPSIGN_VOLUME_THRESHOLDS.standard;

    const thresholds80 = STOPSIGN_VOLUME_THRESHOLDS.threshold80pct;

    let hoursMeetingBoth = 0;      // Per MUTCD: same 8 hours for both
    let hoursMeetingC1Only = 0;
    let hoursMeetingC2Only = 0;
    let hoursMeetingBoth80 = 0;    // For Criterion D
    let peakHour = null;
    let peakMinorVolume = 0;
    const hourlyDetails = [];

    for (let hour = 0; hour < 24; hour++) {
        const data = aggregated[hour];
        if (!data.hasData) continue;

        const meetsC1 = data.major >= thresholds.majorStreet;
        const meetsC2 = data.minor >= thresholds.minorStreet;
        const meetsBoth = meetsC1 && meetsC2;

        const meetsC1_80 = data.major >= thresholds80.majorStreet;
        const meetsC2_80 = data.minor >= thresholds80.minorStreet;

        // MUTCD requires the SAME 8 hours to meet BOTH thresholds
        if (meetsBoth) hoursMeetingBoth++;
        if (meetsC1 && !meetsC2) hoursMeetingC1Only++;
        if (meetsC2 && !meetsC1) hoursMeetingC2Only++;
        if (meetsC1_80 && meetsC2_80) hoursMeetingBoth80++;

        // Track peak hour based on minor street volume
        if (data.minor > peakMinorVolume) {
            peakMinorVolume = data.minor;
            peakHour = hour;
        }

        hourlyDetails.push({
            hour,
            major: data.major,
            minor: data.minor,
            meetsC1,
            meetsC2,
            meetsBoth
        });
    }

    // Per MUTCD 2B.07: Need 8 hours where BOTH C.1 AND C.2 are satisfied simultaneously
    const bothMet = hoursMeetingBoth >= 8;

    return {
        hoursMeetingBoth,       // This is the key metric per MUTCD
        hoursMeetingC1Only,     // For informational display
        hoursMeetingC2Only,     // For informational display
        hoursMeetingBoth80,     // For Criterion D
        c1Met: (hoursMeetingBoth + hoursMeetingC1Only) >= 8,  // Legacy: hours meeting C.1
        c2Met: (hoursMeetingBoth + hoursMeetingC2Only) >= 8,  // Legacy: hours meeting C.2
        bothMet,                // MUTCD-compliant: same 8 hours
        hourlyDetails,
        peakHour,
        peakMinorVolume,
        aggregatedData: aggregated
    };
}

/**
 * Update volume summary display - reads from current form OR aggregated multi-day data
 */
function stopsign_updateVolumeSummary() {
    const countType = document.getElementById('stopsignCountType')?.value || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;
    const daysCount = Object.keys(warrantsState.stopsign.multiDayData).length;

    // Update day count badge
    const dayCountEl = document.getElementById('stopsignTMCDayCount');
    if (dayCountEl) {
        dayCountEl.textContent = `${daysCount} day${daysCount !== 1 ? 's' : ''} entered`;
    }

    // If we have multi-day data, compute from aggregates
    if (daysCount > 0) {
        const evalResult = stopsign_evaluateCriterionCFromAggregates();

        // Update state with MUTCD-compliant values
        warrantsState.stopsign.criterionC.hoursMeetingBoth = evalResult.hoursMeetingBoth;
        warrantsState.stopsign.criterionC.hoursMeetingC1 = evalResult.hoursMeetingBoth + evalResult.hoursMeetingC1Only;
        warrantsState.stopsign.criterionC.hoursMeetingC2 = evalResult.hoursMeetingBoth + evalResult.hoursMeetingC2Only;
        warrantsState.stopsign.criterionC.autoPeakHour = evalResult.peakHour;
        warrantsState.stopsign.criterionC.peakMinorVolume = evalResult.peakMinorVolume;

        // Update Criterion D 80% values
        warrantsState.stopsign.criterionD.c1_80pct = evalResult.hoursMeetingBoth80 >= 8;
        warrantsState.stopsign.criterionD.c2_80pct = evalResult.hoursMeetingBoth80 >= 8;

        // Store aggregated data for PDF export
        warrantsState.stopsign.aggregatedHourlyData = evalResult.aggregatedData;
        warrantsState.stopsign.hourlyDetails = evalResult.hourlyDetails;

        // Calculate average volumes for display
        const hoursWithData = evalResult.hourlyDetails.length;
        const totalMajor = evalResult.hourlyDetails.reduce((sum, h) => sum + h.major, 0);
        const totalMinor = evalResult.hourlyDetails.reduce((sum, h) => sum + h.minor, 0);

        // Update summary display
        const majorEl = document.getElementById('stopsignMajorVolumeSum');
        const minorEl = document.getElementById('stopsignMinorVolumeSum');
        const badgeEl = document.getElementById('stopsignThresholdBadge');

        if (majorEl) majorEl.textContent = hoursWithData > 0 ? Math.round(totalMajor / hoursWithData) : '0';
        if (minorEl) minorEl.textContent = hoursWithData > 0 ? Math.round(totalMinor / hoursWithData) : '0';

        // Update threshold badge - show MUTCD-compliant "same 8 hours" status
        if (badgeEl) {
            if (evalResult.bothMet) {
                badgeEl.textContent = `C.1 & C.2 MET (${evalResult.hoursMeetingBoth} hrs)`;
                badgeEl.style.background = '#dcfce7';
                badgeEl.style.color = '#166534';
            } else if (evalResult.hoursMeetingBoth > 0) {
                badgeEl.textContent = `Partial (${evalResult.hoursMeetingBoth}/8 hrs meet both)`;
                badgeEl.style.background = '#fef9c3';
                badgeEl.style.color = '#854d0e';
            } else {
                badgeEl.textContent = `Not met (0/8 hrs meet both)`;
                badgeEl.style.background = '#fef2f2';
                badgeEl.style.color = '#dc2626';
            }
        }

        // Auto-populate peak hour dropdown
        if (evalResult.peakHour !== null) {
            const peakHourDropdown = document.getElementById('stopsignDelayPeakHour');
            if (peakHourDropdown) {
                peakHourDropdown.value = String(evalResult.peakHour);
            }
        }

        return;
    }

    // Original logic for current form (when no multi-day data exists)
    let totalMajor = 0;
    let totalMinor = 0;
    let hoursWithData = 0;
    let hoursC1 = 0;
    let hoursC2 = 0;

    const thresholds = warrantsState.stopsign.criterionC.apply70pct
        ? STOPSIGN_VOLUME_THRESHOLDS.reduced70pct
        : STOPSIGN_VOLUME_THRESHOLDS.standard;

    for (let hour = startHour; hour < endHour; hour++) {
        const volumes = stopsign_calculateApproachVolumes(hour);
        if (volumes.major > 0 || volumes.minor > 0) {
            hoursWithData++;
            totalMajor += volumes.major;
            totalMinor += volumes.minor;

            // Check thresholds
            if (volumes.major >= thresholds.majorStreet) hoursC1++;
            if (volumes.minor >= thresholds.minorStreet) hoursC2++;
        }
    }

    // Update summary display
    const majorEl = document.getElementById('stopsignMajorVolumeSum');
    const minorEl = document.getElementById('stopsignMinorVolumeSum');
    const badgeEl = document.getElementById('stopsignThresholdBadge');

    if (majorEl) majorEl.textContent = hoursWithData > 0 ? Math.round(totalMajor / hoursWithData) : '0';
    if (minorEl) minorEl.textContent = hoursWithData > 0 ? Math.round(totalMinor / hoursWithData) : '0';

    // Update threshold badge
    if (badgeEl) {
        if (hoursWithData === 0) {
            badgeEl.textContent = 'Enter data';
            badgeEl.style.background = '#fef3c7';
            badgeEl.style.color = '#92400e';
        } else {
            const c1Met = hoursC1 >= 8;
            const c2Met = hoursC2 >= 8;
            if (c1Met && c2Met) {
                badgeEl.textContent = `C.1 & C.2 MET (${hoursC1}/${hoursC2} hrs)`;
                badgeEl.style.background = '#dcfce7';
                badgeEl.style.color = '#166534';
            } else if (c1Met || c2Met) {
                badgeEl.textContent = `Partial (C1:${hoursC1} C2:${hoursC2} hrs)`;
                badgeEl.style.background = '#fef9c3';
                badgeEl.style.color = '#854d0e';
            } else {
                badgeEl.textContent = `Not met (C1:${hoursC1} C2:${hoursC2} hrs)`;
                badgeEl.style.background = '#fef2f2';
                badgeEl.style.color = '#dc2626';
            }
        }
    }

    // Update state
    warrantsState.stopsign.criterionC.hoursMeetingC1 = hoursC1;
    warrantsState.stopsign.criterionC.hoursMeetingC2 = hoursC2;
}

/**
 * Set count type (12hr or 24hr) and regenerate table
 */
function stopsign_setCountType(type) {
    document.getElementById('stopsignCountType').value = type;
    document.getElementById('stopsignAICountType').value = type;
    warrantsState.stopsign.config.countType = type;

    // Update button styles
    const btn12 = document.getElementById('stopsignCountType12hrBtn');
    const btn24 = document.getElementById('stopsignCountType24hrBtn');
    if (btn12 && btn24) {
        if (type === '12hr') {
            btn12.style.background = 'linear-gradient(135deg,#dc2626 0%,#b91c1c 100%)';
            btn12.style.color = 'white';
            btn12.style.boxShadow = '0 2px 8px rgba(220,38,38,0.3)';
            btn24.style.background = 'transparent';
            btn24.style.color = '#64748b';
            btn24.style.boxShadow = 'none';
        } else {
            btn24.style.background = 'linear-gradient(135deg,#dc2626 0%,#b91c1c 100%)';
            btn24.style.color = 'white';
            btn24.style.boxShadow = '0 2px 8px rgba(220,38,38,0.3)';
            btn12.style.background = 'transparent';
            btn12.style.color = '#64748b';
            btn12.style.boxShadow = 'none';
        }
    }

    // Update indicator
    const indicator = document.getElementById('stopsignCountTypeIndicator');
    if (indicator) {
        indicator.textContent = `Table shows ${type === '12hr' ? '12' : '24'} hours`;
    }

    // Regenerate table
    stopsign_updateTMCGrid();
}

/**
 * Clear TMC form
 */
function stopsign_clearTMCForm() {
    const countType = document.getElementById('stopsignCountType')?.value || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;

    for (let hour = startHour; hour < endHour; hour++) {
        for (const approach of ['NB', 'SB', 'EB', 'WB']) {
            for (const mov of ['L', 'T', 'R']) {
                const el = document.getElementById(`stopsign_tmc_${hour}_${approach}_${mov}`);
                if (el) el.value = '';
            }
            const totalEl = document.getElementById(`stopsign_tmc_${hour}_${approach}_total`);
            if (totalEl) totalEl.value = '0';
        }
    }

    // Clear manual totals tracking
    Object.keys(stopsignManualTotals).forEach(key => delete stopsignManualTotals[key]);

    // Clear date
    const dateEl = document.getElementById('stopsignTMCDate');
    if (dateEl) dateEl.value = '';

    // Update summary
    stopsign_updateVolumeSummary();
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use stopsign_updateTMCGrid() instead
 */
function stopsign_generateVolumeTable() {
    // Redirect to new TMC grid generation
    stopsign_updateTMCGrid();
}

/**
 * Update volume analysis when inputs change
 */
function stopsign_updateVolumeAnalysis() {
    const thresholds = warrantsState.stopsign.criterionC.apply70pct
        ? STOPSIGN_VOLUME_THRESHOLDS.reduced70pct
        : STOPSIGN_VOLUME_THRESHOLDS.standard;

    let hoursC1 = 0;
    let hoursC2 = 0;
    let hoursC1_80pct = 0;
    let hoursC2_80pct = 0;

    // Track peak hour (highest minor street volume)
    let peakHour = null;
    let peakMinorVol = 0;

    for (let hour = 6; hour <= 18; hour++) {
        const majorVol = parseFloat(document.getElementById(`stopsignMajor_${hour}`)?.value) || 0;
        const minorVol = parseFloat(document.getElementById(`stopsignMinor_${hour}`)?.value) || 0;

        // Track peak hour based on minor street volume
        if (minorVol > peakMinorVol) {
            peakMinorVol = minorVol;
            peakHour = hour;
        }

        // Check C.1 (Major street)
        const meetsC1 = majorVol >= thresholds.majorStreet;
        const meetsC1_80 = majorVol >= STOPSIGN_VOLUME_THRESHOLDS.threshold80pct.majorStreet;
        if (meetsC1) hoursC1++;
        if (meetsC1_80) hoursC1_80pct++;

        // Check C.2 (Minor street)
        const meetsC2 = minorVol >= thresholds.minorStreet;
        const meetsC2_80 = minorVol >= STOPSIGN_VOLUME_THRESHOLDS.threshold80pct.minorStreet;
        if (meetsC2) hoursC2++;
        if (meetsC2_80) hoursC2_80pct++;

        // Update check cells
        const checkC1 = document.getElementById(`stopsignCheckC1_${hour}`);
        const checkC2 = document.getElementById(`stopsignCheckC2_${hour}`);

        if (checkC1) {
            if (majorVol > 0) {
                checkC1.textContent = meetsC1 ? '✓' : '✗';
                checkC1.className = `check-cell ${meetsC1 ? 'met' : 'not-met'}`;
            } else {
                checkC1.textContent = '-';
                checkC1.className = 'check-cell';
            }
        }

        if (checkC2) {
            if (minorVol > 0) {
                checkC2.textContent = meetsC2 ? '✓' : '✗';
                checkC2.className = `check-cell ${meetsC2 ? 'met' : 'not-met'}`;
            } else {
                checkC2.textContent = '-';
                checkC2.className = 'check-cell';
            }
        }
    }

    // Update state
    warrantsState.stopsign.criterionC.hoursMeetingC1 = hoursC1;
    warrantsState.stopsign.criterionC.hoursMeetingC2 = hoursC2;

    // Update summary cells
    const hoursC1El = document.getElementById('stopsignHoursC1');
    const hoursC2El = document.getElementById('stopsignHoursC2');
    if (hoursC1El) {
        hoursC1El.textContent = hoursC1;
        hoursC1El.style.color = hoursC1 >= 8 ? '#16a34a' : '#dc2626';
    }
    if (hoursC2El) {
        hoursC2El.textContent = hoursC2;
        hoursC2El.style.color = hoursC2 >= 8 ? '#16a34a' : '#dc2626';
    }

    // Store 80% values for Criterion D
    warrantsState.stopsign.criterionD.c1_80pct = hoursC1_80pct >= 8;
    warrantsState.stopsign.criterionD.c2_80pct = hoursC2_80pct >= 8;

    // Auto-populate peak hour dropdown based on highest minor street volume
    if (peakHour !== null && peakMinorVol > 0) {
        const peakHourDropdown = document.getElementById('stopsignDelayPeakHour');
        if (peakHourDropdown) {
            peakHourDropdown.value = String(peakHour);
            // Store in state
            warrantsState.stopsign.criterionC.autoPeakHour = peakHour;
            warrantsState.stopsign.criterionC.peakMinorVolume = peakMinorVol;
        }
    }
}

/**
 * Build crash profile specifically for stop sign warrant (susceptible crashes)
 */
function stopsign_buildCrashProfile(crashes) {
    const profile = {
        total: crashes.length,
        angleCount: 0,
        leftTurnCount: 0,
        rightTurnCount: 0,
        susceptibleCount: 0,
        severity: { K: 0, A: 0, B: 0, C: 0, O: 0 },
        epdo: 0
    };

    crashes.forEach(crash => {
        const collType = (crash[COL.COLLISION] || crash['COLLISION_TYPE'] || '').toUpperCase();
        const severity = crash[COL.SEVERITY] || crash['CRASH_SEVERITY'] || '';

        // Count severity
        if (severity === 'K') { profile.severity.K++; profile.epdo += EPDO_WEIGHTS.K; }
        else if (severity === 'A') { profile.severity.A++; profile.epdo += EPDO_WEIGHTS.A; }
        else if (severity === 'B') { profile.severity.B++; profile.epdo += EPDO_WEIGHTS.B; }
        else if (severity === 'C') { profile.severity.C++; profile.epdo += EPDO_WEIGHTS.C; }
        else { profile.severity.O++; profile.epdo += EPDO_WEIGHTS.O; }

        // Check if susceptible crash type
        const isSusceptible = STOPSIGN_SUSCEPTIBLE_CRASH_TYPES.some(type =>
            collType.includes(type)
        );

        if (isSusceptible) {
            profile.susceptibleCount++;

            // Categorize
            if (collType.includes('ANGLE') || collType.includes('RIGHT ANGLE')) {
                profile.angleCount++;
            } else if (collType.includes('LEFT TURN')) {
                profile.leftTurnCount++;
            } else if (collType.includes('RIGHT TURN')) {
                profile.rightTurnCount++;
            }
        }
    });

    return profile;
}

/**
 * Auto-populate Criterion B from crash data
 */
function stopsign_autoPopulateCriterionB() {
    const crashes = warrantsState.filteredCrashes || [];
    const profile = stopsign_buildCrashProfile(crashes);

    // Update state
    warrantsState.stopsign.criterionB.susceptibleCrashes = profile.susceptibleCount;
    warrantsState.stopsign.criterionB.crashBreakdown = {
        rightAngle: profile.angleCount,
        leftTurn: profile.leftTurnCount,
        rightTurn: profile.rightTurnCount
    };
    warrantsState.stopsign.criterionB.autoPopulated = true;

    // Update UI elements
    document.getElementById('stopsignCrashTotal').textContent = profile.total;
    document.getElementById('stopsignCrashAngle').textContent = profile.angleCount;
    document.getElementById('stopsignCrashLeftTurn').textContent = profile.leftTurnCount;
    document.getElementById('stopsignCrashRightTurn').textContent = profile.rightTurnCount;
    document.getElementById('stopsignCrashSusceptible').textContent = profile.susceptibleCount;
    document.getElementById('stopsignCritBActual').textContent = profile.susceptibleCount;

    // Update Criterion D crash check
    warrantsState.stopsign.criterionD.b80pct = profile.susceptibleCount >= STOPSIGN_CRASH_THRESHOLDS.reduced80pct;

    // Evaluate criteria
    stopsign_evaluateCriterionB();

    console.log('[StopSign] Auto-populated Criterion B:', profile);
}

/**
 * Evaluate Criterion A (Interim Measure)
 */
function stopsign_evaluateCriterionA() {
    const signalMet = document.getElementById('stopsignCritASignalMet')?.checked || false;
    const signalPending = document.getElementById('stopsignCritASignalPending')?.checked || false;

    const met = signalMet && signalPending;

    // Update state
    warrantsState.stopsign.criterionA.signalWarrantMet = signalMet;
    warrantsState.stopsign.criterionA.signalPending = signalPending;

    // Update UI
    const resultEl = document.getElementById('stopsignCritAResult');
    const cardEl = document.getElementById('stopsignCritACard');

    if (resultEl) {
        resultEl.textContent = met ? 'MET' : (signalMet || signalPending ? 'PARTIAL' : 'NOT APPLICABLE');
        resultEl.className = `stopsign-criterion-result ${met ? 'met' : (signalMet || signalPending ? 'partial' : '')}`;
    }

    if (cardEl) {
        cardEl.className = `stopsign-criterion-card ${met ? 'met' : ''}`;
    }

    return met;
}

/**
 * Evaluate Criterion B (Crash Experience)
 */
function stopsign_evaluateCriterionB() {
    const susceptible = warrantsState.stopsign.criterionB.susceptibleCrashes;
    const threshold = STOPSIGN_CRASH_THRESHOLDS.standard;
    const met = susceptible >= threshold;

    // Update UI
    const resultEl = document.getElementById('stopsignCritBResult');
    const cardEl = document.getElementById('stopsignCritBCard');
    const statusEl = document.getElementById('stopsignCritBStatus');

    if (resultEl) {
        resultEl.textContent = met ? 'MET' : 'NOT MET';
        resultEl.className = `stopsign-criterion-result ${met ? 'met' : 'not-met'}`;
    }

    if (cardEl) {
        cardEl.className = `stopsign-criterion-card highlight ${met ? 'met' : 'not-met'}`;
    }

    if (statusEl) {
        statusEl.textContent = met ? `MET (${susceptible} ≥ ${threshold})` : `NOT MET (${susceptible} < ${threshold})`;
        statusEl.className = `stopsign-status-indicator ${met ? 'met' : 'not-met'}`;
    }

    return met;
}

/**
 * Evaluate Criterion C (8-Hour Volume)
 */
function stopsign_evaluateCriterionC() {
    const state = warrantsState.stopsign.criterionC;
    const hoursC1 = state.hoursMeetingC1;
    const hoursC2 = state.hoursMeetingC2;
    const delay = parseFloat(document.getElementById('stopsignAvgDelay')?.value) || null;

    const c1Met = hoursC1 >= STOPSIGN_REQUIRED_HOURS;
    const c2Met = hoursC2 >= STOPSIGN_REQUIRED_HOURS;
    const c3Met = delay !== null && delay >= state.delayThreshold;

    const allMet = c1Met && c2Met && c3Met;

    // Update sub-criteria UI
    const updateSubcriterion = (id, met, hasData) => {
        const el = document.getElementById(id);
        if (el) {
            el.className = `stopsign-subcriterion ${hasData ? (met ? 'met' : 'not-met') : ''}`;
        }
    };

    updateSubcriterion('stopsignSubC1', c1Met, hoursC1 > 0);
    updateSubcriterion('stopsignSubC2', c2Met, hoursC2 > 0);
    updateSubcriterion('stopsignSubC3', c3Met, delay !== null);

    // Update value displays
    document.getElementById('stopsignC1Value').textContent = hoursC1;
    document.getElementById('stopsignC2Value').textContent = hoursC2;
    document.getElementById('stopsignC3Value').textContent = delay !== null ? delay : '--';

    // Update status badges
    const updateBadge = (id, met, hasData) => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = hasData ? (met ? 'MET' : 'NOT MET') : 'NOT ENTERED';
            el.className = `stopsign-subcriterion-status`;
        }
    };

    updateBadge('stopsignC1StatusBadge', c1Met, hoursC1 > 0);
    updateBadge('stopsignC2StatusBadge', c2Met, hoursC2 > 0);
    updateBadge('stopsignC3StatusBadge', c3Met, delay !== null);

    // Update overall Criterion C
    const resultEl = document.getElementById('stopsignCritCResult');
    const cardEl = document.getElementById('stopsignCritCCard');

    if (resultEl) {
        const status = allMet ? 'MET' : (c1Met || c2Met || c3Met ? 'PARTIAL' : 'INCOMPLETE');
        resultEl.textContent = status;
        resultEl.className = `stopsign-criterion-result ${allMet ? 'met' : (c1Met || c2Met ? 'partial' : '')}`;
    }

    if (cardEl) {
        cardEl.className = `stopsign-criterion-card ${allMet ? 'met' : ''}`;
    }

    // Calculate and display LOS
    stopsign_calculateLOS();

    return allMet;
}

/**
 * Calculate Level of Service (LOS) based on HCM for unsignalized intersections (TWSC)
 * Per HCM 6th Edition, Chapter 20 - Two-Way STOP-Controlled Intersections
 */
function stopsign_calculateLOS() {
    const delay = parseFloat(document.getElementById('stopsignAvgDelay')?.value) || null;

    // HCM LOS thresholds for unsignalized intersections (TWSC)
    // Source: Highway Capacity Manual 6th Edition, Exhibit 20-2
    const LOS_THRESHOLDS = {
        A: { max: 10, color: '#22c55e', bgColor: '#dcfce7', description: 'Free flow' },
        B: { max: 15, color: '#84cc16', bgColor: '#ecfccb', description: 'Stable flow' },
        C: { max: 25, color: '#eab308', bgColor: '#fef9c3', description: 'Stable flow' },
        D: { max: 35, color: '#f97316', bgColor: '#ffedd5', description: 'Approaching unstable' },
        E: { max: 50, color: '#ef4444', bgColor: '#fee2e2', description: 'Unstable flow' },
        F: { max: Infinity, color: '#dc2626', bgColor: '#fecaca', description: 'Forced/breakdown' }
    };

    let los = '--';
    let losInfo = null;

    if (delay !== null && delay >= 0) {
        if (delay <= LOS_THRESHOLDS.A.max) {
            los = 'A';
            losInfo = LOS_THRESHOLDS.A;
        } else if (delay <= LOS_THRESHOLDS.B.max) {
            los = 'B';
            losInfo = LOS_THRESHOLDS.B;
        } else if (delay <= LOS_THRESHOLDS.C.max) {
            los = 'C';
            losInfo = LOS_THRESHOLDS.C;
        } else if (delay <= LOS_THRESHOLDS.D.max) {
            los = 'D';
            losInfo = LOS_THRESHOLDS.D;
        } else if (delay <= LOS_THRESHOLDS.E.max) {
            los = 'E';
            losInfo = LOS_THRESHOLDS.E;
        } else {
            los = 'F';
            losInfo = LOS_THRESHOLDS.F;
        }
    }

    // Update LOS display in C.3 section
    const losEl = document.getElementById('stopsignMinorLOS');
    if (losEl) {
        losEl.textContent = los;
        if (losInfo) {
            losEl.style.background = losInfo.bgColor;
            losEl.style.color = losInfo.color;
            losEl.style.borderColor = losInfo.color;
            losEl.title = `LOS ${los}: ${losInfo.description} (≤${losInfo.max === Infinity ? '50+' : losInfo.max} sec delay)`;
        } else {
            losEl.style.background = '#f1f5f9';
            losEl.style.color = '#64748b';
            losEl.style.borderColor = '#e2e8f0';
            losEl.title = '';
        }
    }

    // Update LOS in results summary table
    const losActualEl = document.getElementById('stopsignSummaryLOSActual');
    const losGradeEl = document.getElementById('stopsignSummaryLOSGrade');

    if (losActualEl) {
        losActualEl.textContent = delay !== null ? `${delay} sec delay` : '--';
    }

    if (losGradeEl) {
        losGradeEl.textContent = los;
        if (losInfo) {
            losGradeEl.style.background = losInfo.bgColor;
            losGradeEl.style.color = losInfo.color;
        } else {
            losGradeEl.style.background = '';
            losGradeEl.style.color = '';
        }
    }

    // Store LOS in state for reports
    warrantsState.stopsign.criterionC.calculatedLOS = los;
    warrantsState.stopsign.criterionC.losDescription = losInfo?.description || '';

    return los;
}

/**
 * Toggle HCS Configuration panel visibility based on study method selection
 */
function stopsign_toggleHCSConfig() {
    const method = document.getElementById('stopsignDelayMethod')?.value;
    const hcsPanel = document.getElementById('stopsignHCSConfigPanel');
    if (hcsPanel) {
        hcsPanel.style.display = method === 'hcs' ? 'block' : 'none';
    }
}

/**
 * Evaluate Criterion D (Combined 80% Rule)
 */
function stopsign_evaluateCriterionD() {
    const state = warrantsState.stopsign;
    const susceptible = state.criterionB.susceptibleCrashes;

    const b80 = susceptible >= STOPSIGN_CRASH_THRESHOLDS.reduced80pct;
    const c1_80 = state.criterionD.c1_80pct;
    const c2_80 = state.criterionD.c2_80pct;

    const met = b80 && c1_80 && c2_80;

    // Update state
    state.criterionD.b80pct = b80;

    // Update UI
    document.getElementById('stopsignD_B').textContent = susceptible;
    document.getElementById('stopsignD_BStatus').textContent = b80 ? '✓' : '✗';
    document.getElementById('stopsignD_BStatus').className = `stopsign-80pct-status ${b80 ? 'met' : 'not-met'}`;

    document.getElementById('stopsignD_C1').textContent = state.criterionC.hoursMeetingC1;
    document.getElementById('stopsignD_C1Status').textContent = c1_80 ? '✓' : '✗';
    document.getElementById('stopsignD_C1Status').className = `stopsign-80pct-status ${c1_80 ? 'met' : 'not-met'}`;

    document.getElementById('stopsignD_C2').textContent = state.criterionC.hoursMeetingC2;
    document.getElementById('stopsignD_C2Status').textContent = c2_80 ? '✓' : '✗';
    document.getElementById('stopsignD_C2Status').className = `stopsign-80pct-status ${c2_80 ? 'met' : 'not-met'}`;

    const resultEl = document.getElementById('stopsignCritDResult');
    const cardEl = document.getElementById('stopsignCritDCard');

    if (resultEl) {
        resultEl.textContent = met ? 'MET' : 'NOT MET';
        resultEl.className = `stopsign-criterion-result ${met ? 'met' : 'not-met'}`;
    }

    if (cardEl) {
        cardEl.className = `stopsign-criterion-card ${met ? 'met' : ''}`;
    }

    return met;
}

/**
 * Evaluate all criteria and determine overall warrant status
 */
function stopsign_evaluateAllCriteria() {
    console.log('[StopSign] Evaluating all criteria');

    // Update volume analysis first
    stopsign_updateVolumeAnalysis();

    // Evaluate each criterion
    const critA = stopsign_evaluateCriterionA();
    const critB = stopsign_evaluateCriterionB();
    const critC = stopsign_evaluateCriterionC();
    const critD = stopsign_evaluateCriterionD();

    // Determine overall result per MUTCD 2B.07:
    // Warranted if A OR B OR (C.1 AND C.2 AND C.3) OR D
    const warranted = critA || critB || critC || critD;

    // Store results
    warrantsState.stopsign.analysisResults = {
        warranted,
        criteriaResults: { A: critA, B: critB, C: critC, D: critD },
        timestamp: Date.now()
    };
    warrantsState.stopsign.lastAnalysisTimestamp = Date.now();

    // Show results section
    const resultsSection = document.getElementById('stopsignResultsSection');
    if (resultsSection) {
        resultsSection.classList.remove('hidden');
    }

    // Update results display
    stopsign_updateResultsTab();

    // Update progress indicators
    stopsign_updateProgressIndicator();

    // Show toast notification
    if (warranted) {
        showToast('Multi-way stop IS warranted based on MUTCD 2B.07', 'success');
    } else {
        showToast('Multi-way stop NOT warranted - criteria not met', 'info');
    }

    return warranted;
}

/**
 * Update the results tab with evaluation outcome
 */
function stopsign_updateResultsTab() {
    const results = warrantsState.stopsign.analysisResults;
    if (!results) return;

    const { warranted, criteriaResults } = results;
    const state = warrantsState.stopsign;

    // Update banner
    const banner = document.getElementById('stopsignResultBanner');
    if (banner) {
        banner.className = `stopsign-result-banner ${warranted ? 'warranted' : 'not-warranted'}`;
        banner.innerHTML = warranted ? `
            <div class="stopsign-result-icon">✓</div>
            <div class="stopsign-result-text">
                <h3>MULTI-WAY STOP IS WARRANTED</h3>
                <p>Based on MUTCD 2009 Section 2B.07 (Virginia 2011 Supplement)</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="stopsign_askAI()" style="background:rgba(255,255,255,0.9);color:#166534;border:1px solid #22c55e;margin-left:auto">
                <span>🤖</span> Ask AI About This
            </button>
        ` : `
            <div class="stopsign-result-icon">⚠️</div>
            <div class="stopsign-result-text">
                <h3>MULTI-WAY STOP NOT WARRANTED</h3>
                <p>Criteria not met per MUTCD 2009 Section 2B.07</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="stopsign_askAI()" style="background:rgba(255,255,255,0.9);color:#dc2626;border:1px solid #f87171;margin-left:auto">
                <span>🤖</span> Ask AI About This
            </button>
        `;
    }

    // Update summary table
    const thresholds = state.criterionC.apply70pct
        ? STOPSIGN_VOLUME_THRESHOLDS.reduced70pct
        : STOPSIGN_VOLUME_THRESHOLDS.standard;

    // Criterion A
    const aActual = state.criterionA.signalWarrantMet && state.criterionA.signalPending ? 'Yes' : 'No';
    document.getElementById('stopsignSummaryAActual').textContent = aActual;
    stopsign_updateResultCell('stopsignSummaryAResult', criteriaResults.A);

    // Criterion B
    document.getElementById('stopsignSummaryBActual').textContent = state.criterionB.susceptibleCrashes;
    stopsign_updateResultCell('stopsignSummaryBResult', criteriaResults.B);

    // Criterion C.1
    document.getElementById('stopsignSummaryC1Threshold').textContent = `≥${thresholds.majorStreet} vph × 8 hrs`;
    document.getElementById('stopsignSummaryC1Actual').textContent = `${state.criterionC.hoursMeetingC1} hrs`;
    stopsign_updateResultCell('stopsignSummaryC1Result', state.criterionC.hoursMeetingC1 >= 8);

    // Criterion C.2
    document.getElementById('stopsignSummaryC2Threshold').textContent = `≥${thresholds.minorStreet} vph × 8 hrs`;
    document.getElementById('stopsignSummaryC2Actual').textContent = `${state.criterionC.hoursMeetingC2} hrs`;
    stopsign_updateResultCell('stopsignSummaryC2Result', state.criterionC.hoursMeetingC2 >= 8);

    // Criterion C.3
    const delay = parseFloat(document.getElementById('stopsignAvgDelay')?.value) || null;
    document.getElementById('stopsignSummaryC3Actual').textContent = delay !== null ? `${delay} sec` : '--';
    stopsign_updateResultCell('stopsignSummaryC3Result', delay !== null && delay >= 30);

    // Criterion D
    const dMet = state.criterionD.b80pct && state.criterionD.c1_80pct && state.criterionD.c2_80pct;
    document.getElementById('stopsignSummaryDActual').textContent = dMet ? 'All met' : 'Not all met';
    stopsign_updateResultCell('stopsignSummaryDResult', dMet);
}

/**
 * Helper to update result cell styling
 */
function stopsign_updateResultCell(id, met) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = met ? 'MET' : 'NOT MET';
        el.className = `result-cell ${met ? 'met' : 'not-met'}`;
    }
}

/**
 * Toggle AI panel expansion
 */
function stopsign_toggleAIPanel() {
    const panel = document.getElementById('stopsignAIPanel');
    const content = document.getElementById('stopsignAIPanelContent');
    const text = document.getElementById('stopsignAIPanelToggleText');
    const arrow = document.getElementById('stopsignAIPanelArrow');

    const isExpanded = content.style.display !== 'none';

    if (isExpanded) {
        content.style.display = 'none';
        text.textContent = 'Expand';
        arrow.textContent = '▼';
        panel.classList.remove('expanded');
    } else {
        content.style.display = 'block';
        text.textContent = 'Collapse';
        arrow.textContent = '▲';
        panel.classList.add('expanded');
    }
}

/**
 * Toggle legal disclaimer collapsible
 */
function stopsign_toggleDisclaimer() {
    const disclaimer = document.getElementById('stopsignDisclaimerCollapsible');
    const content = document.getElementById('stopsignDisclaimerContent');
    const arrow = document.getElementById('stopsignDisclaimerArrow');

    const isExpanded = content.style.display !== 'none';

    if (isExpanded) {
        content.style.display = 'none';
        arrow.textContent = '▼';
        disclaimer.classList.remove('expanded');
    } else {
        content.style.display = 'block';
        arrow.textContent = '▲';
        disclaimer.classList.add('expanded');
    }
}

/**
 * Handle disclaimer checkbox change - enables/disables Extract button
 */
function stopsign_handleDisclaimerCheckbox() {
    const checkbox = document.getElementById('stopsignDisclaimerCheckbox');
    const extractBtn = document.getElementById('stopsignExtractBtn');
    const hasFiles = Object.keys(warrantsState.stopsign.uploadedFiles || {}).length > 0;

    extractBtn.disabled = !checkbox.checked || !hasFiles;
}

/**
 * Toggle export button enabled/disabled state based on disclaimer checkbox
 */
function stopsign_toggleExportButtons() {
    const checkbox = document.getElementById('stopsignExportDisclaimer');
    const exportBtns = ['stopsignExportPDF', 'stopsignExportWord', 'stopsignExportCSV', 'stopsignExportJSON'];

    exportBtns.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            if (checkbox.checked) {
                btn.classList.remove('disabled');
            } else {
                btn.classList.add('disabled');
            }
        }
    });
}

/**
 * Clear volume table
 */
function stopsign_clearVolumeTable() {
    for (let hour = 6; hour <= 18; hour++) {
        const majorInput = document.getElementById(`stopsignMajor_${hour}`);
        const minorInput = document.getElementById(`stopsignMinor_${hour}`);
        const pedBikeInput = document.getElementById(`stopsignPedBike_${hour}`);

        if (majorInput) majorInput.value = '';
        if (minorInput) minorInput.value = '';
        if (pedBikeInput) pedBikeInput.value = '';
    }

    // Clear delay inputs
    document.getElementById('stopsignAvgDelay').value = '';
    document.getElementById('stopsignDelayPeakHour').value = '';

    // Update analysis
    stopsign_updateVolumeAnalysis();
    showToast('Volume table cleared', 'info');
}

/**
 * Save stop sign warrant data to localStorage and IndexedDB
 */
function stopsign_saveData() {
    try {
        const data = {
            savedAt: new Date().toISOString(),
            version: '2.0', // TMC format version
            config: {
                intersectionName: document.getElementById('stopIntersectionName')?.value || '',
                majorStreet: document.getElementById('stopMajorStreet')?.value || '',
                minorStreet: document.getElementById('stopMinorStreet')?.value || '',
                evalDate: document.getElementById('stopEvalDate')?.value || '',
                intersectionLegs: document.getElementById('stopIntersectionLegs')?.value || '4',
                existingControl: document.getElementById('stopExistingControl')?.value || 'two-way-stop',
                majorSpeed: document.getElementById('stopMajorSpeed')?.value || '35',
                speed85th: document.getElementById('stopSpeed85th')?.value || '',
                areaType: document.getElementById('stopAreaType')?.value || 'urban',
                majorAADT: document.getElementById('stopMajorAADT')?.value || '',
                majorDirection: warrantsState.stopsign.config?.majorDirection || 'EW',
                countType: warrantsState.stopsign.config?.countType || '12hr'
            },
            multiDayData: warrantsState.stopsign.multiDayData || {},
            delayData: {
                peakHour: document.getElementById('stopsignDelayPeakHour')?.value || '',
                avgDelay: document.getElementById('stopsignAvgDelay')?.value || '',
                method: document.getElementById('stopsignDelayMethod')?.value || 'manual'
            },
            criteriaA: {
                signalMet: document.getElementById('stopsignCritASignalMet')?.checked || false,
                signalPending: document.getElementById('stopsignCritASignalPending')?.checked || false
            },
            criteriaState: {
                criterionB: warrantsState.stopsign.criterionB,
                criterionC: warrantsState.stopsign.criterionC,
                criterionD: warrantsState.stopsign.criterionD
            },
            notes: document.getElementById('stopsignEngineeringNotes')?.value || '',
            analysisResults: warrantsState.stopsign.analysisResults
        };

        // Save to localStorage (legacy)
        localStorage.setItem('stopsignWarrantData', JSON.stringify(data));

        // Save to IndexedDB (new persistent storage)
        warrantDbSave('stopsign', {
            ...data,
            intersectionName: data.config?.intersectionName || ''
        }).then(() => {
            console.log('[StopSign] Data saved to IndexedDB');
        }).catch(e => {
            console.error('[StopSign] IndexedDB save error:', e);
        });

        console.log('[StopSign] Data saved to localStorage');
        showToast('Stop sign warrant data saved', 'success');
    } catch (error) {
        console.error('[StopSign] Error saving data:', error);
        showToast('Error saving data', 'error');
    }
}

/**
 * Load stop sign warrant data from localStorage
 */
function stopsign_loadSavedData() {
    try {
        const savedData = localStorage.getItem('stopsignWarrantData');
        if (!savedData) return false;

        const data = JSON.parse(savedData);

        // Restore config fields
        if (data.config) {
            const fields = {
                'stopIntersectionName': data.config.intersectionName,
                'stopMajorStreet': data.config.majorStreet,
                'stopMinorStreet': data.config.minorStreet,
                'stopEvalDate': data.config.evalDate,
                'stopIntersectionLegs': data.config.intersectionLegs,
                'stopExistingControl': data.config.existingControl,
                'stopMajorSpeed': data.config.majorSpeed,
                'stopSpeed85th': data.config.speed85th,
                'stopAreaType': data.config.areaType,
                'stopMajorAADT': data.config.majorAADT
            };

            for (const [id, value] of Object.entries(fields)) {
                const el = document.getElementById(id);
                if (el && value !== undefined) el.value = value;
            }

            // Restore major direction and count type
            if (data.config.majorDirection) {
                warrantsState.stopsign.config.majorDirection = data.config.majorDirection;
            }
            if (data.config.countType) {
                warrantsState.stopsign.config.countType = data.config.countType;
                stopsign_setCountType(data.config.countType);
            }
        }

        // Restore multi-day data
        if (data.multiDayData && Object.keys(data.multiDayData).length > 0) {
            warrantsState.stopsign.multiDayData = data.multiDayData;
            stopsign_updateDayCards();
        }

        // Restore delay data
        if (data.delayData) {
            const delayFields = {
                'stopsignDelayPeakHour': data.delayData.peakHour,
                'stopsignAvgDelay': data.delayData.avgDelay,
                'stopsignDelayMethod': data.delayData.method
            };
            for (const [id, value] of Object.entries(delayFields)) {
                const el = document.getElementById(id);
                if (el && value) el.value = value;
            }
        }

        // Restore criteria A checkboxes
        if (data.criteriaA) {
            const signalMet = document.getElementById('stopsignCritASignalMet');
            const signalPending = document.getElementById('stopsignCritASignalPending');
            if (signalMet) signalMet.checked = data.criteriaA.signalMet || false;
            if (signalPending) signalPending.checked = data.criteriaA.signalPending || false;
        }

        // Restore criteria state
        if (data.criteriaState) {
            if (data.criteriaState.criterionB) warrantsState.stopsign.criterionB = data.criteriaState.criterionB;
            if (data.criteriaState.criterionC) warrantsState.stopsign.criterionC = data.criteriaState.criterionC;
            if (data.criteriaState.criterionD) warrantsState.stopsign.criterionD = data.criteriaState.criterionD;
        }

        // Restore notes
        if (data.notes) {
            const notesEl = document.getElementById('stopsignEngineeringNotes');
            if (notesEl) notesEl.value = data.notes;
        }

        // Restore analysis results
        if (data.analysisResults) {
            warrantsState.stopsign.analysisResults = data.analysisResults;
        }

        // Update UI
        stopsign_updateSpeedThreshold();
        stopsign_updateTMCGrid();

        console.log('[StopSign] Data loaded from localStorage:', data.savedAt);
        showToast('Saved data restored', 'success');
        return true;
    } catch (error) {
        console.error('[StopSign] Error loading from localStorage:', error);
        return false;
    }
}

/**
 * Export stop sign warrant data as JSON file
 */
function stopsign_exportData() {
    const data = {
        exportedAt: new Date().toISOString(),
        version: '2.0',
        type: 'stopsign_warrant',
        config: {
            intersectionName: document.getElementById('stopIntersectionName')?.value || '',
            majorStreet: document.getElementById('stopMajorStreet')?.value || '',
            minorStreet: document.getElementById('stopMinorStreet')?.value || '',
            evalDate: document.getElementById('stopEvalDate')?.value || '',
            intersectionLegs: document.getElementById('stopIntersectionLegs')?.value || '4',
            majorSpeed: document.getElementById('stopMajorSpeed')?.value || '35',
            majorDirection: warrantsState.stopsign.config?.majorDirection || 'EW',
            countType: warrantsState.stopsign.config?.countType || '12hr'
        },
        multiDayData: warrantsState.stopsign.multiDayData || {},
        criteriaResults: {
            criterionA: warrantsState.stopsign.criterionA,
            criterionB: warrantsState.stopsign.criterionB,
            criterionC: warrantsState.stopsign.criterionC,
            criterionD: warrantsState.stopsign.criterionD
        },
        analysisResults: warrantsState.stopsign.analysisResults,
        notes: document.getElementById('stopsignEngineeringNotes')?.value || ''
    };

    const intersectionName = data.config.intersectionName || 'intersection';
    const filename = `stopsign_warrant_${intersectionName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0, 10)}.json`;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported as JSON file', 'success');
}

/**
 * Import stop sign warrant data from JSON file
 */
function stopsign_importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.type !== 'stopsign_warrant') {
                showToast('Invalid file format - not a stop sign warrant export', 'warning');
                return;
            }

            // Store in localStorage format and load
            localStorage.setItem('stopsignWarrantData', JSON.stringify({
                ...data,
                savedAt: data.exportedAt
            }));
            stopsign_loadSavedData();
            showToast('Data imported successfully', 'success');
        } catch (error) {
            console.error('[StopSign] Import error:', error);
            showToast('Error importing file', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
}

/**
 * Toggle Virginia MUTCD mode
 */
function stopsign_toggleVirginiaMode() {
    const checkbox = document.getElementById('stopsignVirginiaMode');
    warrantsState.stopsign.virginiaMode = checkbox?.checked || false;
    console.log('[StopSign] Virginia Mode:', warrantsState.stopsign.virginiaMode);
}

/**
 * Toggle Virginia info panel visibility
 */
function stopsign_toggleVirginiaInfo() {
    const panel = document.getElementById('stopsignVirginiaInfoPanel');
    const toggle = document.getElementById('stopsignVirginiaInfoToggle');
    if (panel) {
        panel.classList.toggle('hidden');
        if (toggle) toggle.textContent = panel.classList.contains('hidden') ? '▼' : '▲';
    }
}

/**
 * Ask AI about stop sign warrant analysis
 */
function stopsign_askAI() {
    const results = warrantsState.stopsign.analysisResults;
    const config = warrantsState.stopsign.config;

    // Build context for AI
    let context = `Stop Sign Warrant Analysis for ${document.getElementById('stopIntersectionName')?.value || 'intersection'}:\n`;
    context += `- Major Street: ${document.getElementById('stopMajorStreet')?.value || 'N/A'}\n`;
    context += `- Minor Street: ${document.getElementById('stopMinorStreet')?.value || 'N/A'}\n`;
    context += `- Speed Limit: ${document.getElementById('stopMajorSpeed')?.value || 'N/A'} mph\n\n`;

    if (results) {
        context += `Criteria Results:\n`;
        context += `- Criterion A (Interim): ${results.criterionA?.met ? 'MET' : 'NOT MET'}\n`;
        context += `- Criterion B (Crashes): ${results.criterionB?.met ? 'MET' : 'NOT MET'} (${results.criterionB?.susceptibleCrashes || 0} susceptible crashes)\n`;
        context += `- Criterion C.1 (Major Vol): ${results.criterionC?.c1Met ? 'MET' : 'NOT MET'} (${results.criterionC?.hoursMeetingC1 || 0}/8 hours)\n`;
        context += `- Criterion C.2 (Minor Vol): ${results.criterionC?.c2Met ? 'MET' : 'NOT MET'} (${results.criterionC?.hoursMeetingC2 || 0}/8 hours)\n`;
        context += `- Criterion C.3 (Delay): ${results.criterionC?.c3Met ? 'MET' : 'NOT MET'}\n`;
        context += `- Criterion D (80%): ${results.criterionD?.met ? 'MET' : 'NOT MET'}\n\n`;
        context += `Overall: ${results.warranted ? 'WARRANTED' : 'NOT WARRANTED'}\n`;
    }

    // Switch to AI tab and prefill question
    const aiInput = document.getElementById('aiInput') || document.getElementById('mainAIInput');
    if (aiInput) {
        aiInput.value = `Based on this Stop Sign Warrant analysis per MUTCD 2B.07:\n\n${context}\n\nPlease explain the results and provide recommendations for next steps.`;
        // Switch to AI tab if available
        if (typeof showTab === 'function') {
            showTab('ai');
        }
        aiInput.focus();
        showToast('Context loaded - ask your question in the AI tab', 'info');
    } else {
        // Copy to clipboard as fallback
        navigator.clipboard.writeText(context).then(() => {
            showToast('Analysis context copied to clipboard', 'success');
        });
    }
}

/**
 * Update progress indicators
 */
function stopsign_updateProgressIndicator() {
    const results = warrantsState.stopsign.analysisResults;
    const multiDayData = warrantsState.stopsign.multiDayData || {};

    // Days added
    const daysEl = document.getElementById('stopsignProgressDays');
    if (daysEl) daysEl.textContent = Object.keys(multiDayData).length;

    // Hours meeting C.1
    const hoursEl = document.getElementById('stopsignProgressHoursMet');
    if (hoursEl && results?.criterionC) {
        hoursEl.textContent = results.criterionC.hoursMeetingC1 || 0;
    }

    // Criteria met count
    const criteriaEl = document.getElementById('stopsignProgressCriteria');
    if (criteriaEl && results) {
        let metCount = 0;
        if (results.criterionA?.met) metCount++;
        if (results.criterionB?.met) metCount++;
        if (results.criterionC?.c1Met && results.criterionC?.c2Met && results.criterionC?.c3Met) metCount++;
        if (results.criterionD?.met) metCount++;
        criteriaEl.textContent = `${metCount}/4`;
    }

    // Status badge
    const statusEl = document.getElementById('stopsignProgressStatus');
    if (statusEl) {
        if (results?.warranted) {
            statusEl.style.background = '#dcfce7';
            statusEl.style.color = '#166534';
            statusEl.textContent = 'WARRANTED';
        } else if (results && !results.warranted) {
            statusEl.style.background = '#fef2f2';
            statusEl.style.color = '#dc2626';
            statusEl.textContent = 'NOT WARRANTED';
        } else {
            statusEl.style.background = '#fef3c7';
            statusEl.style.color = '#92400e';
            statusEl.textContent = 'Analysis Pending';
        }
    }
}

/**
 * Clear all stop sign warrant data
 */
function stopsign_clearAll() {
    if (!confirm('Clear all stop sign warrant data? This cannot be undone.')) {
        return;
    }

    // Clear configuration
    document.getElementById('stopIntersectionName').value = '';
    document.getElementById('stopMajorStreet').value = '';
    document.getElementById('stopMinorStreet').value = '';
    document.getElementById('stopEvalDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('stopIntersectionLegs').value = '4';
    document.getElementById('stopExistingControl').value = 'two-way-stop';
    document.getElementById('stopMajorSpeed').value = '35';
    document.getElementById('stopSpeed85th').value = '';
    document.getElementById('stopAreaType').value = 'urban';
    document.getElementById('stopMajorAADT').value = '';

    // Clear volume table
    stopsign_clearVolumeTable();

    // Clear criteria A checkboxes
    document.getElementById('stopsignCritASignalMet').checked = false;
    document.getElementById('stopsignCritASignalPending').checked = false;

    // Clear notes
    document.getElementById('stopsignEngineeringNotes').value = '';

    // Clear uploaded files
    stopsign_clearUploadedFiles();

    // Clear multi-day data
    warrantsState.stopsign.multiDayData = {};
    stopsign_updateDayCards();

    // Reset state
    warrantsState.stopsign.analysisResults = null;
    warrantsState.stopsign.criterionB = { susceptibleCrashes: 0, met: false };
    warrantsState.stopsign.criterionC = {
        hoursMeetingC1: 0,
        hoursMeetingC2: 0,
        apply70pct: false,
        majorThreshold: 300,
        minorThreshold: 200
    };
    warrantsState.stopsign.criterionD = { b80pct: false, c1_80pct: false, c2_80pct: false };

    // Hide results section
    const resultsSection = document.getElementById('stopsignResultsSection');
    if (resultsSection) resultsSection.classList.add('hidden');

    // Update displays
    stopsign_updateSpeedThreshold();
    stopsign_evaluateAllCriteria();

    // Clear localStorage
    localStorage.removeItem('stopsignWarrantData');

    // Clear from IndexedDB
    warrantDbClear('stopsign').then(() => {
        console.log('[StopSign] IndexedDB data cleared');
    }).catch(e => {
        console.error('[StopSign] IndexedDB clear error:', e);
    });

    showToast('All stop sign warrant data cleared', 'info');
}

/**
 * Confirm and apply extracted data from AI
 */
function stopsign_confirmExtractedData() {
    const extractions = warrantsState.stopsign.pendingExtractions;
    if (!extractions || extractions.length === 0) {
        // Fallback to old single-extraction flow
        const data = warrantsState.stopsign.extractedData;
        if (data) {
            stopsign_populateFromExtractedData(data);
            document.getElementById('stopsignDataPreviewPanel').style.display = 'none';
            warrantsState.stopsign.extractedData = null;
            showToast('Extracted data applied to form', 'success');
        } else {
            showToast('No extracted data to apply', 'warning');
        }
        return;
    }

    // Enter review mode for multi-file extractions
    stopsign_enterReviewMode();
}

/**
 * Enter review mode to review each extracted file
 */
function stopsign_enterReviewMode() {
    const extractions = warrantsState.stopsign.pendingExtractions;
    if (!extractions || extractions.length === 0) {
        showToast('No extractions to review', 'warning');
        return;
    }

    warrantsState.stopsign.isReviewMode = true;
    warrantsState.stopsign.reviewQueue = [...extractions];

    // Hide preview panel
    document.getElementById('stopsignDataPreviewPanel').style.display = 'none';

    // Show review mode banner
    const banner = document.getElementById('stopsignReviewModeBanner');
    if (banner) banner.classList.remove('hidden');

    // Load first extraction
    stopsign_loadNextReview();
}

/**
 * Load next extraction in review queue
 */
function stopsign_loadNextReview() {
    const queue = warrantsState.stopsign.reviewQueue;
    if (!queue || queue.length === 0) {
        stopsign_exitReviewMode();
        return;
    }

    const currentIndex = warrantsState.stopsign.pendingExtractions.length - queue.length + 1;
    const totalCount = warrantsState.stopsign.pendingExtractions.length;
    const ext = queue[0];

    // Update review mode banner
    const queueIndicator = document.getElementById('stopsignReviewQueueIndicator');
    const filenameText = document.getElementById('stopsignReviewFilenameText');
    const countTypeIndicator = document.getElementById('stopsignReviewCountTypeIndicator');

    if (queueIndicator) queueIndicator.textContent = `Day ${currentIndex} of ${totalCount}`;
    if (filenameText) filenameText.textContent = ext.filename || 'Unknown file';
    if (countTypeIndicator) countTypeIndicator.textContent = ext.countType === '24hr' ? '24-Hour' : '12-Hour';

    // Populate TMC table with extraction data
    stopsign_populateTMCFromExtraction(ext);
}

/**
 * Populate TMC table from extraction data
 */
function stopsign_populateTMCFromExtraction(extraction) {
    if (!extraction) return;

    // Set date
    const dateEl = document.getElementById('stopsignTMCDate');
    if (dateEl && extraction.date) {
        dateEl.value = extraction.date;
    }

    // Set day of week
    const dowEl = document.getElementById('stopsignTMCDow');
    if (dowEl && extraction.dayOfWeek !== undefined) {
        dowEl.value = extraction.dayOfWeek;
    }

    // Set count type if different
    if (extraction.countType) {
        stopsign_setCountType(extraction.countType);
    }

    // Clear manual totals
    Object.keys(stopsignManualTotals).forEach(key => delete stopsignManualTotals[key]);

    // Populate TMC data
    const hourlyVolumes = extraction.hourlyVolumes || extraction.hourlyData;
    if (hourlyVolumes) {
        Object.entries(hourlyVolumes).forEach(([hour, hourData]) => {
            if (!hourData) return;
            const h = parseInt(hour);
            for (const approach of ['NB', 'SB', 'EB', 'WB']) {
                const appData = hourData[approach];
                if (appData) {
                    // Set L/T/R values
                    const leftVal = appData.left || appData.L || 0;
                    const thruVal = appData.thru || appData.T || 0;
                    const rightVal = appData.right || appData.R || 0;

                    const leftEl = document.getElementById(`stopsign_tmc_${h}_${approach}_L`);
                    const thruEl = document.getElementById(`stopsign_tmc_${h}_${approach}_T`);
                    const rightEl = document.getElementById(`stopsign_tmc_${h}_${approach}_R`);
                    const totalEl = document.getElementById(`stopsign_tmc_${h}_${approach}_total`);

                    if (leftEl) leftEl.value = leftVal;
                    if (thruEl) thruEl.value = thruVal;
                    if (rightEl) rightEl.value = rightVal;

                    // Calculate total from L+T+R
                    const calculatedTotal = leftVal + thruVal + rightVal;
                    if (totalEl) totalEl.value = calculatedTotal;
                }
            }
        });
    }

    // Update summary after populating all data
    stopsign_updateVolumeSummary();

    console.log('[StopSign] Populated TMC table from extraction:', extraction.filename);
}

/**
 * Populate TMC table from multiDayData day entry
 * Used when transferring data from Signal Warrant or loading existing day data
 * @param {Object} dayData - Day data object with {date, dow, hourlyData}
 */
function stopsign_populateTMCFromDayData(dayData) {
    if (!dayData) return;

    // Set date
    const dateEl = document.getElementById('stopsignTMCDate');
    if (dateEl && dayData.date) {
        dateEl.value = dayData.date;
    }

    // Set day of week - handle both 'dow' (signal) and 'dayOfWeek' (stop sign) field names
    const dowEl = document.getElementById('stopsignTMCDow');
    const dayOfWeek = dayData.dow !== undefined ? dayData.dow : dayData.dayOfWeek;
    if (dowEl && dayOfWeek !== undefined) {
        dowEl.value = dayOfWeek;
    }

    // Clear manual totals
    Object.keys(stopsignManualTotals).forEach(key => delete stopsignManualTotals[key]);

    // Populate TMC data from hourlyData
    const hourlyData = dayData.hourlyData;
    if (hourlyData) {
        Object.entries(hourlyData).forEach(([hour, hourData]) => {
            if (!hourData) return;
            const h = parseInt(hour);
            for (const approach of ['NB', 'SB', 'EB', 'WB']) {
                const appData = hourData[approach];
                if (appData) {
                    // Get L/T/R values (support both naming conventions)
                    const leftVal = appData.L || appData.left || 0;
                    const thruVal = appData.T || appData.thru || 0;
                    const rightVal = appData.R || appData.right || 0;

                    const leftEl = document.getElementById(`stopsign_tmc_${h}_${approach}_L`);
                    const thruEl = document.getElementById(`stopsign_tmc_${h}_${approach}_T`);
                    const rightEl = document.getElementById(`stopsign_tmc_${h}_${approach}_R`);
                    const totalEl = document.getElementById(`stopsign_tmc_${h}_${approach}_total`);

                    if (leftEl) leftEl.value = leftVal;
                    if (thruEl) thruEl.value = thruVal;
                    if (rightEl) rightEl.value = rightVal;

                    // Calculate total from L+T+R
                    const calculatedTotal = leftVal + thruVal + rightVal;
                    if (totalEl) totalEl.value = calculatedTotal;
                }
            }
        });
    }

    // Update summary after populating all data
    stopsign_updateVolumeSummary();

    console.log('[StopSign] Populated TMC table from day data:', dayData.date || 'unknown date');
}

/**
 * Skip current review and move to next
 */
function stopsign_skipCurrentReview() {
    const queue = warrantsState.stopsign.reviewQueue;
    if (queue && queue.length > 0) {
        queue.shift(); // Remove first item
    }
    stopsign_clearTMCForm();
    stopsign_loadNextReview();
}

/**
 * Advance to next item in review queue after adding current day
 */
function stopsign_advanceReviewQueue() {
    const queue = warrantsState.stopsign.reviewQueue;
    if (queue && queue.length > 0) {
        queue.shift(); // Remove first item
    }
    stopsign_clearTMCForm();
    stopsign_loadNextReview();
}

/**
 * Exit review mode
 */
function stopsign_exitReviewMode() {
    warrantsState.stopsign.isReviewMode = false;
    warrantsState.stopsign.reviewQueue = [];
    warrantsState.stopsign.pendingExtractions = [];

    // Hide review mode banner
    const banner = document.getElementById('stopsignReviewModeBanner');
    if (banner) banner.classList.add('hidden');

    // Clear form
    stopsign_clearTMCForm();

    showToast('Review mode complete', 'success');
}

/**
 * Discard extracted data from AI
 */
function stopsign_discardExtractedData() {
    warrantsState.stopsign.extractedData = null;
    warrantsState.stopsign.pendingExtractions = [];
    document.getElementById('stopsignDataPreviewPanel').style.display = 'none';
    document.getElementById('stopsignValidationPanel').style.display = 'none';
    stopsign_clearAIUploads();
    showToast('Extracted data discarded', 'info');
}

/**
 * Clear all count days
 */
function stopsign_clearAllDays() {
    if (!confirm('Are you sure you want to clear all count days?')) return;

    // Initialize state if needed
    warrantsState.stopsign = warrantsState.stopsign || {};
    warrantsState.stopsign.multiDayData = {};

    stopsign_updateDayCards();

    // Sync with IndexedDB
    if (typeof warrantDbTriggerAutoSave === 'function') {
        warrantDbTriggerAutoSave('stopsign');
    }

    showToast('All count days cleared', 'info');
}

/**
 * Handle file selection for AI extraction
 */
/**
 * Handle multi-file selection for D1-D5 slots
 */
function stopsign_onFilesSelected(files) {
    const dayType = document.getElementById('stopsignDayType')?.value || 'weekday';
    const maxFiles = dayType === 'weekday' ? 5 : 2;

    // Validate API key
    const apiKey = ApiKeySecurity?.getActiveKey?.();
    if (!apiKey) {
        showToast('Please enter an API key in Settings to use AI extraction', 'warning');
        return;
    }

    // Limit files
    const fileArray = Array.from(files).slice(0, maxFiles);
    if (files.length > maxFiles) {
        showToast(`Maximum ${maxFiles} files allowed for ${dayType}. Only first ${maxFiles} will be used.`, 'warning');
    }

    // Initialize state
    warrantsState.stopsign.uploadedFiles = {};

    // Reset all slot icons
    for (let i = 1; i <= 5; i++) {
        const slot = document.getElementById(`stopsignSlot${i}`);
        if (slot) {
            const icon = slot.querySelector('.slot-icon');
            if (icon) icon.textContent = '○';
            slot.style.borderColor = '#e2e8f0';
            slot.style.background = '#f8fafc';
        }
    }

    // Process files and update slot indicators
    fileArray.forEach((file, idx) => {
        const slotNum = idx + 1;
        const fileKey = `slot${slotNum}`;

        warrantsState.stopsign.uploadedFiles[fileKey] = {
            file: file,
            slot: slotNum,
            status: 'pending'
        };

        // Update slot indicator
        const slot = document.getElementById(`stopsignSlot${slotNum}`);
        if (slot) {
            const icon = slot.querySelector('.slot-icon');
            if (icon) icon.textContent = '📄';
            slot.style.borderColor = '#3b82f6';
            slot.style.background = '#eff6ff';
        }
    });

    // Enable extract button if disclaimer checked
    const extractBtn = document.getElementById('stopsignExtractBtn');
    const checkbox = document.getElementById('stopsignDisclaimerCheckbox');
    const hasFiles = fileArray.length > 0;
    const disclaimerChecked = checkbox?.checked || false;
    if (extractBtn) extractBtn.disabled = !hasFiles || !disclaimerChecked;

    console.log('[StopSign] Files selected:', fileArray.length, 'Max:', maxFiles);
}

/**
 * Update day slots visibility based on weekday/weekend selection
 */
function stopsign_updateDaySlots() {
    const dayType = document.getElementById('stopsignDayType')?.value || 'weekday';
    const maxSlots = dayType === 'weekday' ? 5 : 2;

    // Show/hide slots
    for (let i = 1; i <= 5; i++) {
        const slot = document.getElementById(`stopsignSlot${i}`);
        if (slot) {
            slot.style.display = i <= maxSlots ? 'flex' : 'none';
        }
    }

    // Update max files text
    const maxFilesText = document.getElementById('stopsignMaxFilesText');
    if (maxFilesText) {
        maxFilesText.textContent = `(Max ${maxSlots} files - .xlsx, .xls, .csv, .pdf)`;
    }
}

/**
 * Clear all AI uploads and reset slots
 */
function stopsign_clearAIUploads() {
    // Clear state
    warrantsState.stopsign.uploadedFiles = {};
    warrantsState.stopsign.pendingExtractions = [];
    warrantsState.stopsign.extractionStatus = 'idle';

    // Reset all slot icons
    for (let i = 1; i <= 5; i++) {
        const slot = document.getElementById(`stopsignSlot${i}`);
        if (slot) {
            const icon = slot.querySelector('.slot-icon');
            if (icon) icon.textContent = '○';
            slot.style.borderColor = '#e2e8f0';
            slot.style.background = '#f8fafc';
        }
    }

    // Reset file input
    const fileInput = document.getElementById('stopsignBulkFileInput');
    if (fileInput) fileInput.value = '';

    // Hide panels
    const validationPanel = document.getElementById('stopsignValidationPanel');
    const previewPanel = document.getElementById('stopsignDataPreviewPanel');
    const progressEl = document.getElementById('stopsignExtractionProgress');
    if (validationPanel) validationPanel.style.display = 'none';
    if (previewPanel) previewPanel.style.display = 'none';
    if (progressEl) progressEl.classList.add('hidden');

    // Clear status
    const statusEl = document.getElementById('stopsignExtractionStatus');
    if (statusEl) statusEl.innerHTML = '';

    // Disable extract button
    const extractBtn = document.getElementById('stopsignExtractBtn');
    if (extractBtn) extractBtn.disabled = true;

    console.log('[StopSign] AI uploads cleared');
}

/**
 * Select averaging method for multi-day analysis
 * Updates aggregation and triggers re-evaluation of Criterion C
 */
function stopsign_selectAveragingMethod(method) {
    warrantsState.stopsign.averagingMethod = method;

    // Update UI
    document.querySelectorAll('#stopsignAddedDaysSection .signal-avg-option').forEach(opt => {
        const isSelected = opt.dataset.method === method;
        opt.style.borderColor = isSelected ? '#dc2626' : '#e2e8f0';
        opt.style.background = isSelected ? '#fef2f2' : 'white';
        const h4 = opt.querySelector('h4');
        if (h4) h4.style.color = isSelected ? '#dc2626' : '#475569';
    });

    // Recalculate aggregates with new method and update UI
    stopsign_updateVolumeSummary();

    // If days exist, show which ones are being used
    const multiDay = warrantsState.stopsign.multiDayData;
    const dayKeys = Object.keys(multiDay);
    if (dayKeys.length > 0) {
        const aggregated = stopsign_computeHourlyAggregates();
        if (aggregated && aggregated._meta) {
            const usedDays = aggregated._meta.dayNames.join(', ') || 'None';
            console.log(`[StopSign] Averaging method "${method}" using days: ${usedDays}`);
            showToast(`Using ${aggregated._meta.validDays} day(s): ${usedDays}`, 'info');
        }
    }

    console.log('[StopSign] Averaging method set to:', method);
}

/**
 * Legacy file select handler (backward compatibility)
 */
function stopsign_handleFileSelect(event) {
    const files = event.target.files;
    stopsign_onFilesSelected(files);
}

/**
 * Handle file drop for AI extraction
 */
function stopsign_handleFileDrop(event) {
    event.preventDefault();
    event.target.classList.remove('dragover');
    const files = event.dataTransfer.files;
    stopsign_processUploadedFiles(files);
}

/**
 * Process uploaded files
 */
function stopsign_processUploadedFiles(files) {
    const container = document.getElementById('stopsignUploadedFiles');
    const extractBtn = document.getElementById('stopsignExtractBtn');
    const checkbox = document.getElementById('stopsignDisclaimerCheckbox');

    // Initialize uploadedFiles if not exists
    if (!warrantsState.stopsign.uploadedFiles) {
        warrantsState.stopsign.uploadedFiles = {};
    }

    let html = '';
    Array.from(files).forEach((file, idx) => {
        const fileKey = `file${Date.now()}_${idx}`;
        warrantsState.stopsign.uploadedFiles[fileKey] = {
            file: file,
            status: 'pending'
        };

        html += `
            <div class="file-item" style="display:flex;align-items:center;gap:.5rem;padding:.75rem;background:#f8fafc;border-radius:8px;margin-bottom:.5rem;border:1px solid #e2e8f0">
                <span style="font-size:1.2rem">📄</span>
                <span style="flex:1;font-size:.85rem;font-weight:500">${file.name}</span>
                <span class="badge" style="background:#dbeafe;color:#1e40af;font-size:.7rem">${(file.size / 1024).toFixed(1)} KB</span>
                <button onclick="stopsign_removeFile('${fileKey}')" class="btn btn-sm" style="padding:4px 8px;background:transparent;border:none;color:#ef4444;cursor:pointer">✕</button>
            </div>
        `;
    });

    container.innerHTML = html;

    // Enable extract button only if files exist AND disclaimer is checked
    const hasFiles = Object.keys(warrantsState.stopsign.uploadedFiles).length > 0;
    const disclaimerChecked = checkbox?.checked || false;
    extractBtn.disabled = !hasFiles || !disclaimerChecked;

    console.log('[StopSign] Files uploaded:', Object.keys(warrantsState.stopsign.uploadedFiles).length);
}

/**
 * Remove a single uploaded file
 */
function stopsign_removeFile(fileKey) {
    delete warrantsState.stopsign.uploadedFiles[fileKey];

    // Rebuild file list
    const container = document.getElementById('stopsignUploadedFiles');
    const extractBtn = document.getElementById('stopsignExtractBtn');
    const checkbox = document.getElementById('stopsignDisclaimerCheckbox');

    let html = '';
    Object.entries(warrantsState.stopsign.uploadedFiles).forEach(([key, value]) => {
        const file = value.file;
        html += `
            <div class="file-item" style="display:flex;align-items:center;gap:.5rem;padding:.75rem;background:#f8fafc;border-radius:8px;margin-bottom:.5rem;border:1px solid #e2e8f0">
                <span style="font-size:1.2rem">📄</span>
                <span style="flex:1;font-size:.85rem;font-weight:500">${file.name}</span>
                <span class="badge" style="background:#dbeafe;color:#1e40af;font-size:.7rem">${(file.size / 1024).toFixed(1)} KB</span>
                <button onclick="stopsign_removeFile('${key}')" class="btn btn-sm" style="padding:4px 8px;background:transparent;border:none;color:#ef4444;cursor:pointer">✕</button>
            </div>
        `;
    });

    container.innerHTML = html;

    const hasFiles = Object.keys(warrantsState.stopsign.uploadedFiles).length > 0;
    const disclaimerChecked = checkbox?.checked || false;
    extractBtn.disabled = !hasFiles || !disclaimerChecked;
}

/**
 * Clear uploaded files
 */
function stopsign_clearUploadedFiles() {
    warrantsState.stopsign.uploadedFiles = {};
    document.getElementById('stopsignUploadedFiles').innerHTML = '';
    document.getElementById('stopsignExtractBtn').disabled = true;
    document.getElementById('stopsignFileInput').value = '';
}

/**
 * Add current day's data to multi-day analysis
 */
function stopsign_addCurrentDayToAnalysis() {
    const date = document.getElementById('stopsignTMCDate')?.value;
    const dowSelect = document.getElementById('stopsignTMCDow');

    if (!date) {
        showToast('Please select a count date first', 'warning');
        return;
    }

    const countType = document.getElementById('stopsignCountType')?.value || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;

    // Collect current TMC table data
    const hourlyData = {};
    let hasData = false;

    for (let hour = startHour; hour < endHour; hour++) {
        const hourData = {};
        for (const approach of ['NB', 'SB', 'EB', 'WB']) {
            const L = parseInt(document.getElementById(`stopsign_tmc_${hour}_${approach}_L`)?.value) || 0;
            const T = parseInt(document.getElementById(`stopsign_tmc_${hour}_${approach}_T`)?.value) || 0;
            const R = parseInt(document.getElementById(`stopsign_tmc_${hour}_${approach}_R`)?.value) || 0;
            const total = parseInt(document.getElementById(`stopsign_tmc_${hour}_${approach}_total`)?.value) || 0;

            if (L > 0 || T > 0 || R > 0 || total > 0) hasData = true;

            hourData[approach] = { L, T, R, total };
        }
        hourlyData[hour] = hourData;
    }

    if (!hasData) {
        showToast('Please enter volume data before adding to analysis', 'warning');
        return;
    }

    // Create day key
    const dayKey = `day_${date}`;
    const dayOfWeek = dowSelect ? parseInt(dowSelect.value) : new Date(date).getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Store in state with TMC format
    warrantsState.stopsign.multiDayData[dayKey] = {
        date: date,
        dayOfWeek: dayOfWeek,
        dayName: dayNames[dayOfWeek],
        countType: countType,
        hourlyData: hourlyData
    };

    // Update day cards display
    stopsign_updateDayCards();

    // Update volume summary
    stopsign_updateVolumeSummary();

    // If in review mode, advance to next
    if (warrantsState.stopsign.isReviewMode) {
        stopsign_advanceReviewQueue();
    } else {
        // Clear form for next entry
        stopsign_clearTMCForm();
    }

    showToast(`Added ${dayNames[dayOfWeek]} (${date}) to analysis`, 'success');
}

/**
 * Update multi-day data cards (TMC format)
 */
function stopsign_updateDayCards() {
    const container = document.getElementById('stopsignDayCards');
    const section = document.getElementById('stopsignAddedDaysSection');
    const data = warrantsState.stopsign.multiDayData || {};
    const majorDir = warrantsState.stopsign.config.majorDirection || 'EW';
    const isMajorEW = majorDir === 'EW';

    // Show/hide the section based on whether there are days
    if (Object.keys(data).length === 0) {
        if (section) section.classList.add('hidden');
        if (container) container.innerHTML = '';
        return;
    }

    // Show the section
    if (section) section.classList.remove('hidden');

    let html = '';
    Object.entries(data).forEach(([key, day]) => {
        // Calculate totals for display from TMC data
        let totalMajor = 0, totalMinor = 0;

        // Check if data is in new TMC format or legacy format
        Object.entries(day.hourlyData).forEach(([hour, hourData]) => {
            if (hourData.majorVol !== undefined) {
                // Legacy format
                totalMajor += hourData.majorVol || 0;
                totalMinor += hourData.minorVol || 0;
            } else {
                // TMC format: { NB: {L,T,R,total}, SB: {...}, EB: {...}, WB: {...} }
                for (const approach of ['NB', 'SB', 'EB', 'WB']) {
                    if (hourData[approach]) {
                        const isMajor = (isMajorEW && (approach === 'EB' || approach === 'WB')) ||
                                        (!isMajorEW && (approach === 'NB' || approach === 'SB'));
                        const approachTotal = hourData[approach].total || 0;
                        if (isMajor) totalMajor += approachTotal;
                        else totalMinor += approachTotal;
                    }
                }
            }
        });

        html += `
            <div class="signal-day-card" style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:12px;min-width:150px">
                <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
                    <div style="font-weight:600;color:#1e293b">${day.dayName}</div>
                    <div style="display:flex;gap:6px">
                        <button onclick="stopsign_editDay('${key}')" style="background:none;border:none;color:#3b82f6;cursor:pointer;font-size:.85rem;padding:0;line-height:1" title="Edit">✎</button>
                        <button onclick="stopsign_removeDayFromAnalysis('${key}')" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:.85rem;padding:0;line-height:1" title="Remove">✕</button>
                    </div>
                </div>
                <div style="font-size:.75rem;color:#64748b;margin-bottom:8px">${day.date}</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                    <div style="text-align:center;padding:8px;background:#dcfce7;border-radius:6px">
                        <div style="font-weight:600;color:#166534;font-size:.9rem">${totalMajor.toLocaleString()}</div>
                        <div style="font-size:.65rem;color:#166534;opacity:.8">Major</div>
                    </div>
                    <div style="text-align:center;padding:8px;background:#dbeafe;border-radius:6px">
                        <div style="font-weight:600;color:#1e40af;font-size:.9rem">${totalMinor.toLocaleString()}</div>
                        <div style="font-size:.65rem;color:#1e40af;opacity:.8">Minor</div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Remove a day from multi-day analysis
 */
function stopsign_removeDayFromAnalysis(dayKey) {
    delete warrantsState.stopsign.multiDayData[dayKey];
    stopsign_updateDayCards();
    showToast('Day removed from analysis', 'info');
}

/**
 * Edit a day's TMC data in modal
 */
function stopsign_editDay(dayKey) {
    const dayData = warrantsState.stopsign.multiDayData[dayKey];
    if (!dayData) {
        showToast('Day data not found', 'warning');
        return;
    }

    // Store current editing day key
    warrantsState.stopsign.editingDayKey = dayKey;

    // Clear current TMC form
    stopsign_clearTMCForm();

    // Populate form with day data
    const dateEl = document.getElementById('stopsignTMCDate');
    const dowEl = document.getElementById('stopsignTMCDow');
    if (dateEl) dateEl.value = dayData.date || '';
    if (dowEl) dowEl.value = dayData.dow !== undefined ? dayData.dow : '';

    // Populate TMC data
    if (dayData.hourlyData) {
        Object.entries(dayData.hourlyData).forEach(([hour, hourData]) => {
            if (!hourData) return;
            const h = parseInt(hour);

            // Check format and populate
            if (hourData.NB || hourData.SB || hourData.EB || hourData.WB) {
                // TMC format
                for (const approach of ['NB', 'SB', 'EB', 'WB']) {
                    const appData = hourData[approach];
                    if (appData) {
                        const leftEl = document.getElementById(`stopsign_tmc_${h}_${approach}_L`);
                        const thruEl = document.getElementById(`stopsign_tmc_${h}_${approach}_T`);
                        const rightEl = document.getElementById(`stopsign_tmc_${h}_${approach}_R`);
                        const totalEl = document.getElementById(`stopsign_tmc_${h}_${approach}_total`);

                        if (leftEl) leftEl.value = appData.L || appData.left || 0;
                        if (thruEl) thruEl.value = appData.T || appData.thru || 0;
                        if (rightEl) rightEl.value = appData.R || appData.right || 0;
                        if (totalEl) totalEl.value = appData.total || ((appData.L || 0) + (appData.T || 0) + (appData.R || 0));
                    }
                }
            }
        });
    }

    // Update volume summary
    stopsign_updateVolumeSummary();

    // Show edit mode indicator
    const editBanner = document.getElementById('stopsignEditModeBanner');
    if (editBanner) {
        editBanner.classList.remove('hidden');
        editBanner.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;margin-bottom:16px">
                <div style="display:flex;align-items:center;gap:12px">
                    <span style="font-size:1.5rem">✏️</span>
                    <div>
                        <strong style="color:#92400e">Edit Mode</strong>
                        <span style="color:#78350f;font-size:.85rem"> - Editing ${dayData.dayName} (${dayData.date})</span>
                    </div>
                </div>
                <div style="display:flex;gap:8px">
                    <button class="btn btn-sm btn-success" onclick="stopsign_saveEditedDay()">💾 Save Changes</button>
                    <button class="btn btn-sm btn-outline" onclick="stopsign_cancelEdit()">Cancel</button>
                </div>
            </div>
        `;
    }

    // Scroll to TMC table
    document.getElementById('stopsignTMCTable')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`Editing ${dayData.dayName} - make changes and click Save`, 'info');
}

/**
 * Save edited day data
 */
function stopsign_saveEditedDay() {
    const dayKey = warrantsState.stopsign.editingDayKey;
    if (!dayKey || !warrantsState.stopsign.multiDayData[dayKey]) {
        showToast('No day being edited', 'warning');
        return;
    }

    // Collect TMC data from form
    const tmcData = stopsign_collectCurrentTMCData();
    if (!tmcData) {
        showToast('No TMC data to save', 'warning');
        return;
    }

    // Update the day data
    const date = document.getElementById('stopsignTMCDate')?.value || '';
    const dow = parseInt(document.getElementById('stopsignTMCDow')?.value) || 0;
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    warrantsState.stopsign.multiDayData[dayKey] = {
        ...warrantsState.stopsign.multiDayData[dayKey],
        date: date,
        dow: dow,
        dayName: dayNames[dow] || 'Unknown',
        hourlyData: tmcData.hourlyData,
        countType: warrantsState.stopsign.config.countType
    };

    // Clear edit mode
    warrantsState.stopsign.editingDayKey = null;
    const editBanner = document.getElementById('stopsignEditModeBanner');
    if (editBanner) editBanner.classList.add('hidden');

    // Update display
    stopsign_updateDayCards();
    stopsign_clearTMCForm();
    showToast('Day data updated successfully', 'success');
}

/**
 * Cancel day editing
 */
function stopsign_cancelEdit() {
    warrantsState.stopsign.editingDayKey = null;
    const editBanner = document.getElementById('stopsignEditModeBanner');
    if (editBanner) editBanner.classList.add('hidden');
    stopsign_clearTMCForm();
    showToast('Edit cancelled', 'info');
}

/**
 * Collect current TMC data from form
 */
function stopsign_collectCurrentTMCData() {
    const countType = warrantsState.stopsign.config.countType || '12hr';
    const startHour = countType === '24hr' ? 0 : 6;
    const endHour = countType === '24hr' ? 23 : 18;
    const hourlyData = {};
    let hasData = false;

    for (let hour = startHour; hour <= endHour; hour++) {
        hourlyData[hour] = {};
        for (const approach of ['NB', 'SB', 'EB', 'WB']) {
            const leftEl = document.getElementById(`stopsign_tmc_${hour}_${approach}_L`);
            const thruEl = document.getElementById(`stopsign_tmc_${hour}_${approach}_T`);
            const rightEl = document.getElementById(`stopsign_tmc_${hour}_${approach}_R`);

            const L = parseInt(leftEl?.value) || 0;
            const T = parseInt(thruEl?.value) || 0;
            const R = parseInt(rightEl?.value) || 0;
            const total = L + T + R;

            if (total > 0) hasData = true;

            hourlyData[hour][approach] = { L, T, R, total };
        }
    }

    if (!hasData) return null;

    return { hourlyData, countType };
}

/**
 * ============================================================
 * PHASE 3: AI DATA EXTRACTION FOR STOP SIGN WARRANT
 * ============================================================
 */

/**
 * Read file content for AI extraction
 */
async function stopsign_readFileContent(file) {
    const fileType = file.name.split('.').pop().toLowerCase();

    if (fileType === 'pdf') {
        // Use PDF.js for PDF extraction
        return await stopsign_extractPDFText(file);
    } else if (['xlsx', 'xls', 'csv'].includes(fileType)) {
        // Use SheetJS for Excel/CSV
        return await stopsign_extractExcelText(file);
    } else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileType)) {
        // For images, return base64 encoded content
        return await stopsign_fileToBase64(file);
    } else {
        // Plain text
        return await file.text();
    }
}

/**
 * Extract text from PDF using PDF.js
 */
async function stopsign_extractPDFText(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `\n--- Page ${i} ---\n${pageText}`;
        }

        return fullText;
    } catch (error) {
        console.error('[StopSign] PDF extraction error:', error);
        return `[PDF extraction failed: ${error.message}]`;
    }
}

/**
 * Extract text from Excel/CSV using SheetJS
 */
async function stopsign_extractExcelText(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        let fullText = '';

        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const csv = XLSX.utils.sheet_to_csv(sheet);
            fullText += `\n--- Sheet: ${sheetName} ---\n${csv}`;
        });

        return fullText;
    } catch (error) {
        console.error('[StopSign] Excel extraction error:', error);
        return `[Excel extraction failed: ${error.message}]`;
    }
}

/**
 * Convert file to base64
 */
async function stopsign_fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Main AI extraction function for stop sign warrant
 */
async function stopsign_extractAllWithAI() {
    const apiKey = ApiKeySecurity.getActiveKey();
    if (!apiKey) {
        showToast('Please enter an API key to use AI extraction', 'warning');
        return;
    }

    const files = Object.values(warrantsState.stopsign.uploadedFiles);
    if (files.length === 0) {
        showToast('Please upload files first', 'warning');
        return;
    }

    // Show progress bar
    const progressEl = document.getElementById('stopsignExtractionProgress');
    const progressFill = document.getElementById('stopsignProgressFill');
    const progressText = document.getElementById('stopsignProgressText');
    if (progressEl) progressEl.classList.remove('hidden');

    // Update status
    warrantsState.stopsign.extractionStatus = 'extracting';
    document.getElementById('stopsignExtractionStatus').innerHTML = `
        <div class="info-box info" style="font-size:.85rem">
            <span class="icon">⏳</span>
            <div class="content">Extracting data from ${files.length} file(s)... This may take a moment.</div>
        </div>
    `;

    let successCount = 0;
    let extractedData = null;
    let totalFiles = files.length;
    let processedFiles = 0;
    const pendingExtractions = [];

    for (const fileObj of files) {
        try {
            // Update progress
            processedFiles++;
            if (progressFill) progressFill.style.width = `${(processedFiles / totalFiles) * 100}%`;
            if (progressText) progressText.textContent = `Processing file ${processedFiles} of ${totalFiles}...`;

            const result = await stopsign_extractSingleFileWithDualAI(apiKey, fileObj.file);

            if (result.success) {
                successCount++;
                extractedData = result.data;
                fileObj.status = 'complete';

                // Store extraction for review mode
                pendingExtractions.push({
                    filename: fileObj.file.name,
                    slot: fileObj.slot,
                    date: extractedData.countDate,
                    dayOfWeek: extractedData.dayOfWeek,
                    countType: warrantsState.stopsign.config.countType,
                    hourlyData: extractedData.hourlyData,
                    confidence: extractedData.confidence,
                    intersectionName: extractedData.intersectionName,
                    majorStreet: extractedData.majorStreet,
                    minorStreet: extractedData.minorStreet,
                    majorDirection: extractedData.majorDirection,
                    speedLimit: extractedData.speedLimit,
                    delayData: extractedData.delayData,
                    validation: result.validation
                });
            } else {
                fileObj.status = 'error';
                fileObj.error = result.error;
            }
        } catch (error) {
            fileObj.status = 'error';
            fileObj.error = error.message;
        }
    }

    // Store pending extractions for review mode
    warrantsState.stopsign.pendingExtractions = pendingExtractions;

    // Hide progress bar
    if (progressEl) progressEl.classList.add('hidden');

    // Update status
    warrantsState.stopsign.extractionStatus = 'complete';

    if (successCount > 0 && extractedData) {
        // Store extracted data for review
        warrantsState.stopsign.extractedData = extractedData;

        // Show preview panel
        const previewPanel = document.getElementById('stopsignDataPreviewPanel');
        const previewContent = document.getElementById('stopsignDataPreview');

        if (previewPanel && previewContent) {
            // Build preview HTML
            let previewHtml = '<div style="display:grid;gap:12px">';

            // Intersection info
            if (extractedData.intersectionName || extractedData.majorStreet || extractedData.minorStreet) {
                previewHtml += `
                    <div style="padding:12px;background:#f8fafc;border-radius:8px;border-left:4px solid #3b82f6">
                        <h5 style="margin:0 0 8px;color:#1e40af;font-size:.85rem">📍 Intersection</h5>
                        <div style="font-size:.85rem;color:#334155">
                            ${extractedData.intersectionName ? `<strong>Name:</strong> ${extractedData.intersectionName}<br>` : ''}
                            ${extractedData.majorStreet ? `<strong>Major St:</strong> ${extractedData.majorStreet}<br>` : ''}
                            ${extractedData.minorStreet ? `<strong>Minor St:</strong> ${extractedData.minorStreet}<br>` : ''}
                            ${extractedData.countDate ? `<strong>Date:</strong> ${extractedData.countDate}` : ''}
                        </div>
                    </div>
                `;
            }

            // Volume summary - calculate from TMC data
            if (extractedData.hourlyData) {
                const majorDir = extractedData.majorDirection || warrantsState.stopsign.config.majorDirection || 'EW';
                let grandTotal = 0, totalMajor = 0, totalMinor = 0, hoursWithData = 0;

                Object.values(extractedData.hourlyData).forEach(h => {
                    if (!h) return;
                    // Calculate approach totals from TMC
                    const nb = (h.NB?.L || 0) + (h.NB?.T || 0) + (h.NB?.R || 0);
                    const sb = (h.SB?.L || 0) + (h.SB?.T || 0) + (h.SB?.R || 0);
                    const eb = (h.EB?.L || 0) + (h.EB?.T || 0) + (h.EB?.R || 0);
                    const wb = (h.WB?.L || 0) + (h.WB?.T || 0) + (h.WB?.R || 0);
                    const hourTotal = nb + sb + eb + wb;

                    if (hourTotal > 0) hoursWithData++;
                    grandTotal += hourTotal;

                    // Calculate major/minor based on direction
                    if (majorDir === 'EW') {
                        totalMajor += eb + wb;
                        totalMinor += nb + sb;
                    } else {
                        totalMajor += nb + sb;
                        totalMinor += eb + wb;
                    }
                });

                previewHtml += `
                    <div style="padding:12px;background:#f8fafc;border-radius:8px;border-left:4px solid #10b981">
                        <h5 style="margin:0 0 8px;color:#166534;font-size:.85rem">📊 TMC Volume Data</h5>
                        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center">
                            <div style="padding:8px;background:#fef3c7;border-radius:6px">
                                <div style="font-weight:600;color:#92400e">${grandTotal.toLocaleString()}</div>
                                <div style="font-size:.7rem;color:#92400e">Grand Total</div>
                            </div>
                            <div style="padding:8px;background:#dcfce7;border-radius:6px">
                                <div style="font-weight:600;color:#166534">${totalMajor.toLocaleString()}</div>
                                <div style="font-size:.7rem;color:#166534">Major (${majorDir})</div>
                            </div>
                            <div style="padding:8px;background:#dbeafe;border-radius:6px">
                                <div style="font-weight:600;color:#1e40af">${totalMinor.toLocaleString()}</div>
                                <div style="font-size:.7rem;color:#1e40af">Minor (${majorDir === 'EW' ? 'NS' : 'EW'})</div>
                            </div>
                            <div style="padding:8px;background:#f3f4f6;border-radius:6px">
                                <div style="font-weight:600;color:#334155">${hoursWithData}</div>
                                <div style="font-size:.7rem;color:#64748b">Hours</div>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Confidence
            if (extractedData.confidence) {
                const confPct = Math.round(extractedData.confidence * 100);
                const confColor = confPct >= 80 ? '#166534' : confPct >= 60 ? '#d97706' : '#dc2626';
                previewHtml += `
                    <div style="text-align:center;font-size:.85rem;color:${confColor}">
                        <strong>AI Confidence:</strong> ${confPct}%
                    </div>
                `;
            }

            previewHtml += '</div>';
            previewContent.innerHTML = previewHtml;
            previewPanel.style.display = 'block';
        }

        // Different message for single vs multi-file
        const reviewMsg = pendingExtractions.length > 1
            ? `Successfully extracted TMC data from ${successCount} file(s). Click "Review and Edit Data" to review each day's data and add to your analysis.`
            : `Successfully extracted TMC data. Click "Review and Edit Data" to verify and add to your analysis.`;

        document.getElementById('stopsignExtractionStatus').innerHTML = `
            <div class="info-box success" style="font-size:.85rem">
                <span class="icon">✓</span>
                <div class="content">${reviewMsg}</div>
            </div>
        `;
        showToast(`TMC data extracted from ${successCount} file(s) - click to review`, 'success');
    } else {
        document.getElementById('stopsignExtractionStatus').innerHTML = `
            <div class="info-box warning" style="font-size:.85rem">
                <span class="icon">⚠️</span>
                <div class="content">Could not extract data. Please enter volumes manually.</div>
            </div>
        `;
        showToast('Extraction failed - please enter data manually', 'warning');
    }
}

/**
 * Dual-Agent extraction for stop sign warrant traffic data
 */
async function stopsign_extractSingleFileWithDualAI(apiKey, file) {
    const fileContent = await stopsign_readFileContent(file);

    // Get current threshold settings
    const apply70pct = warrantsState.stopsign.criterionC.apply70pct;
    const majorThreshold = apply70pct ? 210 : 300;
    const minorThreshold = apply70pct ? 140 : 200;

    // ========== AGENT 1: EXTRACTION ==========
    // Get current configuration for extraction context
    const majorDirection = warrantsState.stopsign.config.majorDirection || 'EW';
    const countType = warrantsState.stopsign.config.countType || '12hr';
    const startHour = countType === '24hr' ? 0 : 6;
    const endHour = countType === '24hr' ? 23 : 18;

    const extractionPrompt = `You are an expert traffic data extraction specialist. Your task is to extract TURNING MOVEMENT COUNT (TMC) data for a MULTI-WAY STOP WARRANT ANALYSIS per MUTCD 2009 Section 2B.07.

IMPORTANT: This is for STOP SIGN warrant analysis requiring full TMC data for HCS Two-Way Stop Control delay analysis.

FILE INFORMATION:
- Filename: "${file.name}"
- Major Street Direction: ${majorDirection === 'EW' ? 'East-West (EB/WB)' : 'North-South (NB/SB)'}
- Count Type: ${countType === '24hr' ? '24-hour' : '12-hour (6 AM - 6 PM)'}

STEP 1: IDENTIFY INTERSECTION
Look for:
- Intersection name (e.g., "Main St & Oak Ave")
- Major street name (higher volume street)
- Minor street name (lower volume street)
- Count date and day of week
- Speed limit if available

STEP 2: EXTRACT HOURLY TURNING MOVEMENT COUNTS
For each hour from ${startHour === 0 ? '12 AM' : '6 AM'} to ${endHour === 23 ? '11 PM' : '6 PM'} (hours ${startHour}-${endHour}), extract TMC for all approaches:
- NB (Northbound): Left, Through, Right movements
- SB (Southbound): Left, Through, Right movements
- EB (Eastbound): Left, Through, Right movements
- WB (Westbound): Left, Through, Right movements
- Pedestrian/bicycle counts (if available, can be total or by crossing)

STEP 3: IDENTIFY PEAK HOUR DATA (if available)
Look for peak hour identification, delay study data, or level of service information.

STEP 4: CALCULATE AND VALIDATE
For each hour, calculate:
- Major street volume = ${majorDirection === 'EW' ? 'EB total + WB total' : 'NB total + SB total'}
- Minor street volume = ${majorDirection === 'EW' ? 'NB total + SB total' : 'EB total + WB total'}
- Check thresholds: Major ≥${majorThreshold} vph, Minor ≥${minorThreshold} vph

Return ONLY valid JSON (no markdown, no explanation):
{
  "confidence": 0.95,
  "intersectionName": "Main St & Oak Ave",
  "majorStreet": "Main St",
  "minorStreet": "Oak Ave",
  "majorDirection": "${majorDirection}",
  "countDate": "2024-03-15",
  "dayOfWeek": "Tuesday",
  "speedLimit": 35,
  "hourlyData": {
    "6": {
      "NB": { "L": 15, "T": 45, "R": 12 },
      "SB": { "L": 18, "T": 52, "R": 10 },
      "EB": { "L": 22, "T": 85, "R": 18 },
      "WB": { "L": 25, "T": 78, "R": 15 },
      "pedBike": 8
    },
    "7": {
      "NB": { "L": 28, "T": 72, "R": 20 },
      "SB": { "L": 32, "T": 85, "R": 18 },
      "EB": { "L": 45, "T": 125, "R": 32 },
      "WB": { "L": 42, "T": 118, "R": 28 },
      "pedBike": 15
    }
  },
  "totals": {
    "grandTotal": 8500,
    "majorTotal": 5200,
    "minorTotal": 3300,
    "hoursMeetingMajorThreshold": 8,
    "hoursMeetingMinorThreshold": 5,
    "peakHour": 17,
    "peakHourVolume": 850
  },
  "delayData": {
    "peakHour": 17,
    "avgDelay": 35,
    "los": "D"
  },
  "warnings": [],
  "missingData": []
}

CONFIDENCE SCORING:
- 90-100%: Found all hours with complete TMC data (L/T/R for all 4 approaches)
- 70-89%: Missing some movements or hours, but core data present
- 50-69%: Significant missing data, only totals available
- Below 50%: Major issues, sparse data

CRITICAL RULES:
- Return ONLY the JSON object, no other text
- Use integer values for all counts
- Hour keys should be integers (6, 7, 8... not "06:00")
- Each approach (NB, SB, EB, WB) must have L, T, R keys
- Set missing movements to 0, set entire missing hour to null
- If only totals are available (no L/T/R breakdown), estimate: L=20%, T=60%, R=20%
- Include confidence score reflecting data completeness`;

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
                max_tokens: 8000,
                system: extractionPrompt,
                messages: [{
                    role: 'user',
                    content: `Extract traffic volume data from this file for multi-way stop warrant analysis.\n\nFilename: "${file.name}"\n\nFile content:\n${fileContent.substring(0, 100000)}`
                }]
            })
        });

        if (!extractionResponse.ok) {
            const errorData = await extractionResponse.json().catch(() => ({}));
            return { success: false, error: errorData.error?.message || `HTTP ${extractionResponse.status}` };
        }

        const extractionResult = await extractionResponse.json();
        const extractedText = extractionResult.content[0].text;

        // Parse JSON from response
        const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return { success: false, error: 'Could not parse extraction response' };

        let extractedData;
        try {
            extractedData = JSON.parse(jsonMatch[0]);
        } catch (e) {
            return { success: false, error: 'Invalid JSON in response' };
        }

        // ========== AGENT 2: VALIDATION ==========
        const validationResult = stopsign_validateExtractedData(extractedData);

        return {
            success: true,
            data: extractedData,
            validation: validationResult
        };

    } catch (error) {
        console.error('[StopSign] AI extraction error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Validate extracted TMC data
 */
function stopsign_validateExtractedData(data) {
    const warnings = [];
    const errors = [];
    const approaches = ['NB', 'SB', 'EB', 'WB'];
    const movements = ['L', 'T', 'R'];

    // Check for required fields
    if (!data.hourlyData || Object.keys(data.hourlyData).length === 0) {
        errors.push('No hourly TMC data found');
    }

    // Validate TMC data structure and values
    if (data.hourlyData) {
        let hoursWithData = 0;
        let totalVolume = 0;
        let missingApproaches = 0;

        Object.entries(data.hourlyData).forEach(([hour, hourData]) => {
            if (!hourData) return;

            let hourTotal = 0;
            let approachCount = 0;

            approaches.forEach(approach => {
                if (hourData[approach]) {
                    approachCount++;
                    const l = hourData[approach].L || 0;
                    const t = hourData[approach].T || 0;
                    const r = hourData[approach].R || 0;
                    const approachTotal = l + t + r;
                    hourTotal += approachTotal;

                    // Check for unusually high single movement
                    if (l > 500 || t > 1000 || r > 500) {
                        warnings.push(`Hour ${hour} ${approach}: Movement count seems unusually high (L:${l}, T:${t}, R:${r})`);
                    }
                }
            });

            if (approachCount < 4) {
                missingApproaches++;
            }

            if (hourTotal > 0) {
                hoursWithData++;
                totalVolume += hourTotal;
            }

            // Check for unusually high hourly total
            if (hourTotal > 3000) {
                warnings.push(`Hour ${hour}: Total volume ${hourTotal} seems unusually high`);
            }
        });

        // Check for minimum hours
        if (hoursWithData < 8) {
            warnings.push(`Only ${hoursWithData} hours have TMC data (8+ recommended for analysis)`);
        }

        // Check for missing approaches
        if (missingApproaches > 0) {
            warnings.push(`${missingApproaches} hour(s) have incomplete approach data`);
        }

        // Check total volume reasonableness
        if (totalVolume > 0 && totalVolume < 1000) {
            warnings.push(`Total volume (${totalVolume}) seems low for a typical intersection`);
        }
    }

    // Check confidence
    if (data.confidence < 0.7) {
        warnings.push(`Low confidence score: ${Math.round(data.confidence * 100)}%`);
    }

    // Check major direction consistency
    if (data.majorDirection && !['EW', 'NS'].includes(data.majorDirection)) {
        warnings.push(`Invalid major direction: ${data.majorDirection}`);
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        confidence: data.confidence || 0.5
    };
}

/**
 * Populate form from extracted TMC data
 */
function stopsign_populateFromExtractedData(data) {
    // Populate intersection info
    if (data.intersectionName) {
        const el = document.getElementById('stopIntersectionName');
        if (el) el.value = data.intersectionName;
    }
    if (data.majorStreet) {
        const el = document.getElementById('stopMajorStreet');
        if (el) el.value = data.majorStreet;
    }
    if (data.minorStreet) {
        const el = document.getElementById('stopMinorStreet');
        if (el) el.value = data.minorStreet;
    }
    if (data.speedLimit) {
        const el = document.getElementById('stopMajorSpeed');
        if (el) {
            el.value = data.speedLimit;
            stopsign_updateSpeedThreshold();
        }
    }

    // Set major direction if extracted
    if (data.majorDirection) {
        warrantsState.stopsign.config.majorDirection = data.majorDirection;
        const directionBtns = document.querySelectorAll('[onclick^="stopsign_setMajorDirection"]');
        directionBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.includes(data.majorDirection === 'EW' ? 'E-W' : 'N-S')) {
                btn.classList.add('active');
            }
        });
        stopsign_updateTMCGrid();
    }

    // Build extraction object for TMC population
    const extraction = {
        date: data.countDate,
        dayOfWeek: data.dayOfWeek,
        countType: warrantsState.stopsign.config.countType,
        hourlyData: data.hourlyData,
        hourlyVolumes: data.hourlyData
    };

    // Use the TMC population function
    stopsign_populateTMCFromExtraction(extraction);

    // Populate delay data
    if (data.delayData) {
        if (data.delayData.peakHour) {
            const el = document.getElementById('stopsignDelayPeakHour');
            if (el) el.value = data.delayData.peakHour;
        }
        if (data.delayData.avgDelay) {
            const el = document.getElementById('stopsignAvgDelay');
            if (el) el.value = data.delayData.avgDelay;
        }
    }

    // Trigger analysis update
    stopsign_updateVolumeAnalysis();

    console.log('[StopSign] Populated form from extracted TMC data');
}

/**
 * ============================================================
 * PHASE 4: REPORT GENERATION FOR STOP SIGN WARRANT
 * ============================================================
 */

/**
 * Generate professional PDF report for Stop Sign Warrant Analysis
 */
async function stopsign_generatePDFReport() {
    const results = warrantsState.stopsign.analysisResults;
    if (!results) {
        showToast('Please run analysis first before exporting PDF', 'warning');
        return;
    }

    showLoading('Generating PDF report with location map...');

    try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'letter');
    const state = warrantsState.stopsign;
    const cfg = state.config;

    // Colors
    const stopSignRed = [220, 38, 38];
    const greenMet = [22, 163, 74];
    const headerBg = [45, 55, 72];

    // Thresholds
    const thresholds = state.criterionC.apply70pct
        ? STOPSIGN_VOLUME_THRESHOLDS.reduced70pct
        : STOPSIGN_VOLUME_THRESHOLDS.standard;

    let yPos = 15;

    // ========== PAGE 1: HEADER ==========
    doc.setFillColor(...stopSignRed);
    doc.rect(0, 0, 220, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Multi-Way Stop Warrant Analysis', 15, 17);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('MUTCD 2009 Section 2B.07 - Virginia 2011 Supplement', 145, 17);

    yPos = 35;
    doc.setTextColor(0, 0, 0);

    // ========== INTERSECTION INFO BOX ==========
    doc.setFillColor(245, 245, 245);
    doc.rect(15, yPos, 180, 40, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, yPos, 180, 40, 'S');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(document.getElementById('stopIntersectionName')?.value || 'Unnamed Intersection', 20, yPos + 8);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Major Street: ${document.getElementById('stopMajorStreet')?.value || 'N/A'}`, 20, yPos + 16);
    doc.text(`Minor Street: ${document.getElementById('stopMinorStreet')?.value || 'N/A'}`, 100, yPos + 16);
    doc.text(`Intersection Type: ${cfg.intersectionLegs}-leg`, 20, yPos + 24);
    doc.text(`Speed Limit: ${cfg.majorSpeedLimit} mph${state.criterionC.apply70pct ? ' (70% reduction applied)' : ''}`, 100, yPos + 24);

    // HCS Analysis Info
    const hcsVersion = document.getElementById('stopHCSVersion')?.value || 'N/A';
    const hcsType = document.getElementById('stopHCSAnalysisType')?.value || 'N/A';
    const hcsFile = document.getElementById('stopHCSFileRef')?.value || 'N/A';
    const hcsVersionLabel = { 'hcs2025': 'HCS 2025', 'hcs2022': 'HCS 2022', 'hcs7': 'HCS 7', 'other': 'Other' }[hcsVersion] || hcsVersion;
    const hcsTypeLabel = { 'twsc': 'TWSC', 'awsc': 'AWSC' }[hcsType] || hcsType;
    doc.text(`HCS Analysis: ${hcsVersionLabel} (${hcsTypeLabel})`, 20, yPos + 32);
    doc.text(`HCS File: ${hcsFile || 'Not specified'}`, 100, yPos + 32);

    yPos += 50;

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
        }, 125, yPos - 45, 70, 45);

        if (mapAdded) {
            // Add small legend
            doc.setFontSize(6);
            doc.setTextColor(100, 100, 100);
            doc.text(`${mapCrashes.length} crashes shown`, 160, yPos - 2, { align: 'center' });
            doc.setTextColor(0, 0, 0);
        }
    }

    // ========== OVERALL RESULT BANNER ==========
    const warranted = results.warranted;
    doc.setFillColor(...(warranted ? greenMet : stopSignRed));
    doc.rect(15, yPos, 180, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(warranted ? 'MULTI-WAY STOP IS WARRANTED' : 'MULTI-WAY STOP NOT WARRANTED', 105, yPos + 12, { align: 'center' });

    yPos += 28;
    doc.setTextColor(0, 0, 0);

    // ========== CRITERIA SUMMARY TABLE ==========
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CRITERIA EVALUATION SUMMARY', 15, yPos);
    yPos += 8;

    // Get hours meeting both thresholds (MUTCD-compliant) or legacy values
    const hoursMeetingBoth = state.criterionC.hoursMeetingBoth || 0;
    const hoursMeetingC1 = state.criterionC.hoursMeetingC1 || 0;
    const hoursMeetingC2 = state.criterionC.hoursMeetingC2 || 0;

    // MUTCD 2B.07 requires SAME 8 hours for both C.1 AND C.2
    const criterionCMet = hoursMeetingBoth >= 8;

    const criteriaData = [
        ['A', 'Interim Measure', 'Signal pending', state.criterionA.signalWarrantMet && state.criterionA.signalPending ? 'Yes' : 'No', results.criteriaResults.A ? 'MET' : 'N/A'],
        ['B', 'Crash Experience', '>=5 crashes/12 mo', String(state.criterionB.susceptibleCrashes), results.criteriaResults.B ? 'MET' : 'NOT MET'],
        ['C.1', 'Major Street Volume', `>=${thresholds.majorStreet} vph x 8 hrs`, `${hoursMeetingC1} hrs`, hoursMeetingC1 >= 8 ? 'MET' : 'NOT MET'],
        ['C.2', 'Minor Street Volume', `>=${thresholds.minorStreet} vph x 8 hrs`, `${hoursMeetingC2} hrs`, hoursMeetingC2 >= 8 ? 'MET' : 'NOT MET'],
        ['C.3', 'Minor Street Delay', '>=30 seconds', `${state.criterionC.avgDelayHighestHour || '--'} sec`, state.criterionC.avgDelayHighestHour >= 30 ? 'MET' : 'NOT MET'],
        ['LOS', 'Minor St. Level of Service', 'Per HCM (TWSC)', `LOS ${state.criterionC.calculatedLOS || '--'}`, state.criterionC.losDescription || 'Unstable flow'],
        ['D', 'Combined 80%', 'B+C.1+C.2 @ 80%', state.criterionD.b80pct && state.criterionD.c1_80pct && state.criterionD.c2_80pct ? 'All met' : 'Not all met', results.criteriaResults.D ? 'MET' : 'NOT MET']
    ];

    doc.autoTable({
        startY: yPos,
        head: [['Criterion', 'Description', 'Threshold', 'Actual', 'Result']],
        body: criteriaData,
        theme: 'striped',
        headStyles: { fillColor: stopSignRed, fontSize: 9, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8.5 },
        columnStyles: {
            0: { cellWidth: 18, halign: 'center' },
            1: { cellWidth: 48 },
            2: { cellWidth: 48 },
            3: { cellWidth: 32, halign: 'center' },
            4: { cellWidth: 28, halign: 'center' }
        },
        didParseCell: function(data) {
            if (data.column.index === 4 && data.section === 'body') {
                if (data.cell.text[0] === 'MET') {
                    data.cell.styles.textColor = greenMet;
                    data.cell.styles.fontStyle = 'bold';
                } else if (data.cell.text[0] === 'NOT MET') {
                    data.cell.styles.textColor = stopSignRed;
                }
            }
        },
        margin: { left: 15, right: 15 }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // ========== CRITERION B: CRASH ANALYSIS ==========
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CRITERION B: CRASH EXPERIENCE (Auto-populated)', 15, yPos);
    yPos += 8;

    const crashData = [
        ['Right-Angle / Angle', String(state.criterionB.crashBreakdown.rightAngle), 'Yes'],
        ['Left-Turn', String(state.criterionB.crashBreakdown.leftTurn), 'Yes'],
        ['Right-Turn', String(state.criterionB.crashBreakdown.rightTurn), 'Yes'],
        ['Total Susceptible', String(state.criterionB.susceptibleCrashes), '-'],
        ['All Crashes (12 mo)', String(warrantsState.filteredCrashes?.length || 0), 'Reference']
    ];

    doc.autoTable({
        startY: yPos,
        head: [['Crash Type', 'Count', 'Susceptible?']],
        body: crashData,
        theme: 'striped',
        headStyles: { fillColor: headerBg, fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 40 },
            2: { cellWidth: 40 }
        },
        margin: { left: 15, right: 90 }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // ========== HOURLY VOLUME DATA ==========
    if (yPos > 200) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CRITERION C: 8-HOUR VOLUME ANALYSIS', 15, yPos);
    yPos += 8;

    // Get hourly details from aggregated multi-day data or current form
    const hourlyDetails = state.hourlyDetails || [];
    const volumeData = [];

    if (hourlyDetails.length > 0) {
        // Use aggregated multi-day data
        for (const detail of hourlyDetails) {
            const hour = detail.hour;
            const hourLabel = hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
            const meetsBoth = detail.meetsBoth ? 'Yes' : 'No';

            volumeData.push([
                hourLabel,
                String(detail.major),
                String(detail.minor),
                detail.meetsC1 ? 'Yes' : 'No',
                detail.meetsC2 ? 'Yes' : 'No',
                meetsBoth
            ]);
        }
    } else {
        // Fallback: read from current TMC table
        const countType = cfg.countType || '12hr';
        const startHour = countType === '12hr' ? 6 : 0;
        const endHour = countType === '12hr' ? 18 : 24;

        for (let hour = startHour; hour < endHour; hour++) {
            const volumes = stopsign_calculateApproachVolumes(hour);
            if (volumes.major > 0 || volumes.minor > 0) {
                const hourLabel = hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
                const meetsC1 = volumes.major >= thresholds.majorStreet;
                const meetsC2 = volumes.minor >= thresholds.minorStreet;

                volumeData.push([
                    hourLabel,
                    String(volumes.major),
                    String(volumes.minor),
                    meetsC1 ? 'Yes' : 'No',
                    meetsC2 ? 'Yes' : 'No',
                    (meetsC1 && meetsC2) ? 'Yes' : 'No'
                ]);
            }
        }
    }

    if (volumeData.length > 0) {
        // Add "Meets Both" column header per MUTCD requirement
        doc.autoTable({
            startY: yPos,
            head: [['Hour', 'Major (vph)', 'Minor (vph)', `>=${thresholds.majorStreet}?`, `>=${thresholds.minorStreet}?`, 'Both Met?']],
            body: volumeData,
            theme: 'striped',
            headStyles: { fillColor: headerBg, fontSize: 8.5, fontStyle: 'bold' },
            bodyStyles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 28, halign: 'right' },
                2: { cellWidth: 28, halign: 'right' },
                3: { cellWidth: 28, halign: 'center' },
                4: { cellWidth: 28, halign: 'center' },
                5: { cellWidth: 25, halign: 'center' }
            },
            margin: { left: 15, right: 15 },
            didParseCell: function(data) {
                if (data.section === 'body') {
                    // Color the threshold check columns
                    if (data.column.index === 3 || data.column.index === 4) {
                        data.cell.styles.textColor = data.cell.text[0] === 'Yes' ? greenMet : stopSignRed;
                    }
                    // Highlight "Both Met" column
                    if (data.column.index === 5) {
                        if (data.cell.text[0] === 'Yes') {
                            data.cell.styles.textColor = greenMet;
                            data.cell.styles.fontStyle = 'bold';
                        } else {
                            data.cell.styles.textColor = [128, 128, 128];
                        }
                    }
                }
            }
        });

        yPos = doc.lastAutoTable.finalY + 8;

        // Add summary note about MUTCD requirement
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text(`Note: Per MUTCD 2B.07, Criterion C requires the SAME 8 hours to meet BOTH major (>=${thresholds.majorStreet} vph) AND minor (>=${thresholds.minorStreet} vph) thresholds.`, 15, yPos);
        doc.text(`Hours meeting both: ${hoursMeetingBoth} of 8 required`, 15, yPos + 5);
        doc.setTextColor(0, 0, 0);
        yPos += 12;
    } else {
        doc.setFontSize(9);
        doc.setTextColor(128, 128, 128);
        doc.text('No volume data entered. Add count days to the analysis.', 15, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 10;
    }

    // ========== ENGINEERING NOTES ==========
    const notes = document.getElementById('stopsignEngineeringNotes')?.value;
    if (notes) {
        if (yPos > 230) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('ENGINEERING NOTES', 15, yPos);
        yPos += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const splitNotes = doc.splitTextToSize(notes, 175);
        doc.text(splitNotes, 15, yPos);
    }

    // ========== FOOTER ==========
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Generated: ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`, 105, 275, { align: 'center' });
    }

    // Download
    const filename = `StopSign_Warrant_${(document.getElementById('stopIntersectionName')?.value || 'Analysis').replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    showToast('PDF report exported successfully', 'success');

    } catch (err) {
        console.error('[StopSign PDF] Error generating report:', err);
        showToast('Error generating PDF report', 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Generate Word Memo for Stop Sign Warrant Analysis
 */
async function stopsign_generateWordMemo() {
    const results = warrantsState.stopsign.analysisResults;
    if (!results) {
        showToast('Please run analysis first before exporting Word memo', 'warning');
        return;
    }

    const state = warrantsState.stopsign;
    const { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType, AlignmentType, BorderStyle } = docx;

    const thresholds = state.criterionC.apply70pct
        ? STOPSIGN_VOLUME_THRESHOLDS.reduced70pct
        : STOPSIGN_VOLUME_THRESHOLDS.standard;

    const intersectionName = document.getElementById('stopIntersectionName')?.value || 'Intersection';
    const majorStreet = document.getElementById('stopMajorStreet')?.value || 'Major Street';
    const minorStreet = document.getElementById('stopMinorStreet')?.value || 'Minor Street';

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
                            new TextRun({ text: `Multi-Way Stop Warrant Analysis - ${intersectionName}` })
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
                        text: `A multi-way stop warrant analysis was conducted at the intersection of ${majorStreet} and ${minorStreet} in accordance with the Manual on Uniform Traffic Control Devices (MUTCD) 2009 Edition, Section 2B.07, as adopted by Virginia's 2011 Supplement. This memorandum summarizes the findings and recommendations.`,
                        spacing: { after: 300 }
                    }),

                    // Location
                    new Paragraph({
                        text: 'LOCATION',
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
                            new TextRun({ text: 'Major Street: ', bold: true }),
                            new TextRun({ text: majorStreet })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Minor Street: ', bold: true }),
                            new TextRun({ text: minorStreet })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Intersection Type: ', bold: true }),
                            new TextRun({ text: `${state.config.intersectionLegs}-leg` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Posted Speed: ', bold: true }),
                            new TextRun({ text: `${state.config.majorSpeedLimit} mph` })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'HCS Analysis: ', bold: true }),
                            new TextRun({ text: (() => {
                                const ver = document.getElementById('stopHCSVersion')?.value || 'N/A';
                                const type = document.getElementById('stopHCSAnalysisType')?.value || 'N/A';
                                const verLabel = { 'hcs2025': 'HCS 2025', 'hcs2022': 'HCS 2022', 'hcs7': 'HCS 7', 'other': 'Other' }[ver] || ver;
                                const typeLabel = { 'twsc': 'TWSC (Two-Way Stop)', 'awsc': 'AWSC (All-Way Stop)' }[type] || type;
                                return `${verLabel} - ${typeLabel}`;
                            })() })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'HCS File Reference: ', bold: true }),
                            new TextRun({ text: document.getElementById('stopHCSFileRef')?.value || 'Not specified' })
                        ],
                        spacing: { after: 300 }
                    }),

                    // Analysis Summary
                    new Paragraph({
                        text: 'WARRANT ANALYSIS SUMMARY',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),

                    // Overall Result
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: results.warranted ? 'MULTI-WAY STOP IS WARRANTED' : 'MULTI-WAY STOP IS NOT WARRANTED',
                                bold: true,
                                size: 28,
                                color: results.warranted ? '16a34a' : 'dc2626'
                            })
                        ],
                        spacing: { after: 300 }
                    }),

                    // Criterion A
                    new Paragraph({ text: 'Criterion A: Interim Measure', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
                    new Paragraph({
                        text: results.criteriaResults.A
                            ? 'MET - Signal warrant is met and signal installation is pending.'
                            : 'NOT APPLICABLE - Signal warrant not met or signal not pending.',
                        spacing: { after: 200 }
                    }),

                    // Criterion B
                    new Paragraph({ text: 'Criterion B: Crash Experience', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
                    new Paragraph({
                        text: `Susceptible crashes in 12-month period: ${state.criterionB.susceptibleCrashes}`,
                        spacing: { after: 50 }
                    }),
                    new Paragraph({
                        text: `• Right-angle/angle crashes: ${state.criterionB.crashBreakdown.rightAngle}`,
                        spacing: { after: 50 }
                    }),
                    new Paragraph({
                        text: `• Left-turn crashes: ${state.criterionB.crashBreakdown.leftTurn}`,
                        spacing: { after: 50 }
                    }),
                    new Paragraph({
                        text: `• Right-turn crashes: ${state.criterionB.crashBreakdown.rightTurn}`,
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Result: ', bold: true }),
                            new TextRun({
                                text: results.criteriaResults.B ? 'MET' : 'NOT MET',
                                bold: true,
                                color: results.criteriaResults.B ? '16a34a' : 'dc2626'
                            }),
                            new TextRun({ text: ` (Threshold: 5 crashes)` })
                        ],
                        spacing: { after: 200 }
                    }),

                    // Criterion C
                    new Paragraph({ text: 'Criterion C: 8-Hour Volume', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
                    new Paragraph({
                        text: state.criterionC.apply70pct
                            ? `70% reduction applied (85th percentile speed > 40 mph)`
                            : `Standard thresholds (85th percentile speed ≤ 40 mph)`,
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        text: `• C.1 Major Street: ${state.criterionC.hoursMeetingC1} of 8 hours ≥ ${thresholds.majorStreet} vph - ${state.criterionC.hoursMeetingC1 >= 8 ? 'MET' : 'NOT MET'}`,
                        spacing: { after: 50 }
                    }),
                    new Paragraph({
                        text: `• C.2 Minor Street: ${state.criterionC.hoursMeetingC2} of 8 hours ≥ ${thresholds.minorStreet} vph - ${state.criterionC.hoursMeetingC2 >= 8 ? 'MET' : 'NOT MET'}`,
                        spacing: { after: 50 }
                    }),
                    new Paragraph({
                        text: `• C.3 Minor Street Delay: ${state.criterionC.avgDelayHighestHour || '--'} seconds - ${state.criterionC.avgDelayHighestHour >= 30 ? 'MET' : 'NOT MET'}`,
                        spacing: { after: 50 }
                    }),
                    new Paragraph({
                        text: `• Minor Street LOS: ${state.criterionC.calculatedLOS || '--'} (${state.criterionC.losDescription || 'Per HCM TWSC methodology'})`,
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Result: ', bold: true }),
                            new TextRun({
                                text: results.criteriaResults.C ? 'MET' : 'NOT MET',
                                bold: true,
                                color: results.criteriaResults.C ? '16a34a' : 'dc2626'
                            }),
                            new TextRun({ text: ` (All three sub-criteria required)` })
                        ],
                        spacing: { after: 200 }
                    }),

                    // Criterion D
                    new Paragraph({ text: 'Criterion D: Combined 80% Rule', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
                    new Paragraph({
                        text: `• Crashes at 80%: ${state.criterionB.susceptibleCrashes} ≥ 4 - ${state.criterionD.b80pct ? 'Yes' : 'No'}`,
                        spacing: { after: 50 }
                    }),
                    new Paragraph({
                        text: `• Major volume at 80%: ${state.criterionD.c1_80pct ? 'Yes' : 'No'}`,
                        spacing: { after: 50 }
                    }),
                    new Paragraph({
                        text: `• Minor volume at 80%: ${state.criterionD.c2_80pct ? 'Yes' : 'No'}`,
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Result: ', bold: true }),
                            new TextRun({
                                text: results.criteriaResults.D ? 'MET' : 'NOT MET',
                                bold: true,
                                color: results.criteriaResults.D ? '16a34a' : 'dc2626'
                            })
                        ],
                        spacing: { after: 300 }
                    }),

                    // Recommendation
                    new Paragraph({
                        text: 'RECOMMENDATION',
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: results.warranted
                            ? `Based on this analysis, the installation of multi-way STOP control at the intersection of ${majorStreet} and ${minorStreet} is supported per MUTCD 2009 Section 2B.07.`
                            : `Based on this analysis, multi-way STOP control at the intersection of ${majorStreet} and ${minorStreet} is NOT warranted per MUTCD 2009 Section 2B.07. Alternative traffic control measures may be considered.`,
                        spacing: { after: 300 }
                    }),

                    // Signature Block
                    new Paragraph({
                        border: { top: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { before: 400, after: 200 }
                    }),
                    new Paragraph({
                        text: 'Prepared By: _____________________________  Date: __________',
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: 'Reviewed By: _____________________________  Date: __________',
                        spacing: { after: 200 }
                    })
                ]
            }]
        });

        // Generate and download
        const blob = await docx.Packer.toBlob(doc);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `StopSign_Warrant_Memo_${intersectionName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
        link.click();

        showToast('Word memo exported successfully', 'success');

    } catch (error) {
        console.error('[StopSign] Word export error:', error);
        showToast('Error generating Word document: ' + error.message, 'error');
    }
}

/**
 * Export Stop Sign Warrant data to CSV
 */
function stopsign_exportCSV() {
    const results = warrantsState.stopsign.analysisResults;
    const state = warrantsState.stopsign;

    const thresholds = state.criterionC.apply70pct
        ? STOPSIGN_VOLUME_THRESHOLDS.reduced70pct
        : STOPSIGN_VOLUME_THRESHOLDS.standard;

    // Build CSV content
    let csv = 'Multi-Way Stop Warrant Analysis Export\n';
    csv += `Generated,${new Date().toISOString()}\n`;
    csv += `Standard,MUTCD 2009 Section 2B.07 (Virginia 2011 Supplement)\n\n`;

    // Intersection Info
    csv += 'INTERSECTION INFORMATION\n';
    csv += `Intersection Name,${document.getElementById('stopIntersectionName')?.value || ''}\n`;
    csv += `Major Street,${document.getElementById('stopMajorStreet')?.value || ''}\n`;
    csv += `Minor Street,${document.getElementById('stopMinorStreet')?.value || ''}\n`;
    csv += `Intersection Type,${state.config.intersectionLegs}-leg\n`;
    csv += `Posted Speed (mph),${state.config.majorSpeedLimit}\n`;
    csv += `85th Percentile Speed,${document.getElementById('stopSpeed85th')?.value || 'N/A'}\n`;
    csv += `70% Reduction Applied,${state.criterionC.apply70pct ? 'Yes' : 'No'}\n`;
    csv += `Existing Control,${state.config.existingControl}\n`;

    // HCS Analysis Info
    const hcsVersion = document.getElementById('stopHCSVersion')?.value || 'N/A';
    const hcsType = document.getElementById('stopHCSAnalysisType')?.value || 'N/A';
    const hcsFile = document.getElementById('stopHCSFileRef')?.value || 'N/A';
    const hcsVersionLabel = { 'hcs2025': 'HCS 2025', 'hcs2022': 'HCS 2022', 'hcs7': 'HCS 7', 'other': 'Other' }[hcsVersion] || hcsVersion;
    const hcsTypeLabel = { 'twsc': 'TWSC', 'awsc': 'AWSC' }[hcsType] || hcsType;
    csv += `HCS Software,${hcsVersionLabel}\n`;
    csv += `HCS Analysis Type,${hcsTypeLabel}\n`;
    csv += `HCS File Reference,${hcsFile}\n\n`;

    // Warrant Results
    if (results) {
        csv += 'WARRANT EVALUATION RESULTS\n';
        csv += 'Criterion,Description,Threshold,Actual,Result\n';
        csv += `A,Interim Measure,Signal pending,${state.criterionA.signalWarrantMet && state.criterionA.signalPending ? 'Yes' : 'No'},${results.criteriaResults.A ? 'MET' : 'N/A'}\n`;
        csv += `B,Crash Experience,≥5 in 12 mo,${state.criterionB.susceptibleCrashes},${results.criteriaResults.B ? 'MET' : 'NOT MET'}\n`;
        csv += `C.1,Major Street Volume,≥${thresholds.majorStreet} vph × 8 hrs,${state.criterionC.hoursMeetingC1} hrs,${state.criterionC.hoursMeetingC1 >= 8 ? 'MET' : 'NOT MET'}\n`;
        csv += `C.2,Minor Street Volume,≥${thresholds.minorStreet} vph × 8 hrs,${state.criterionC.hoursMeetingC2} hrs,${state.criterionC.hoursMeetingC2 >= 8 ? 'MET' : 'NOT MET'}\n`;
        csv += `C.3,Minor Street Delay,≥30 seconds,${state.criterionC.avgDelayHighestHour || '--'} sec,${state.criterionC.avgDelayHighestHour >= 30 ? 'MET' : 'NOT MET'}\n`;
        csv += `LOS,Minor Street Level of Service,Per HCM (TWSC),LOS ${state.criterionC.calculatedLOS || '--'},${state.criterionC.losDescription || '--'}\n`;
        csv += `D,Combined 80%,B+C.1+C.2 @ 80%,${state.criterionD.b80pct && state.criterionD.c1_80pct && state.criterionD.c2_80pct ? 'All met' : 'Not all met'},${results.criteriaResults.D ? 'MET' : 'NOT MET'}\n`;
        csv += `\nOVERALL RESULT,${results.warranted ? 'WARRANTED' : 'NOT WARRANTED'}\n\n`;
    }

    // Crash Data
    csv += 'CRASH DATA (Criterion B)\n';
    csv += 'Type,Count,Susceptible\n';
    csv += `Right-Angle/Angle,${state.criterionB.crashBreakdown.rightAngle},Yes\n`;
    csv += `Left-Turn,${state.criterionB.crashBreakdown.leftTurn},Yes\n`;
    csv += `Right-Turn,${state.criterionB.crashBreakdown.rightTurn},Yes\n`;
    csv += `Total Susceptible,${state.criterionB.susceptibleCrashes},-\n`;
    csv += `All Crashes (12 mo),${warrantsState.filteredCrashes?.length || 0},Reference\n\n`;

    // Hourly Volume Data
    csv += 'HOURLY VOLUME DATA (Criterion C)\n';
    csv += `Hour,Major Vol,Minor Vol,Ped/Bike,≥${thresholds.majorStreet}?,≥${thresholds.minorStreet}?\n`;

    for (let hour = 6; hour <= 18; hour++) {
        const majorVol = parseFloat(document.getElementById(`stopsignMajor_${hour}`)?.value) || 0;
        const minorVol = parseFloat(document.getElementById(`stopsignMinor_${hour}`)?.value) || 0;
        const pedBike = parseFloat(document.getElementById(`stopsignPedBike_${hour}`)?.value) || 0;
        const hourLabel = hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;

        csv += `${hourLabel},${majorVol},${minorVol},${pedBike},${majorVol >= thresholds.majorStreet ? 'Yes' : 'No'},${minorVol >= thresholds.minorStreet ? 'Yes' : 'No'}\n`;
    }

    csv += `\nHours Meeting Major Threshold,${state.criterionC.hoursMeetingC1}\n`;
    csv += `Hours Meeting Minor Threshold,${state.criterionC.hoursMeetingC2}\n`;

    // Delay Data
    csv += '\nDELAY DATA (Criterion C.3)\n';
    csv += `Peak Hour,${document.getElementById('stopsignDelayPeakHour')?.value || 'N/A'}\n`;
    csv += `Average Delay (seconds),${document.getElementById('stopsignAvgDelay')?.value || 'N/A'}\n`;
    csv += `Study Method,${document.getElementById('stopsignDelayMethod')?.value || 'N/A'}\n`;

    // Engineering Notes
    const notes = document.getElementById('stopsignEngineeringNotes')?.value;
    if (notes) {
        csv += '\nENGINEERING NOTES\n';
        csv += `"${notes.replace(/"/g, '""')}"\n`;
    }

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `StopSign_Warrant_${(document.getElementById('stopIntersectionName')?.value || 'Export').replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showToast('CSV exported successfully', 'success');
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.warrants = CL.warrants || {};
  CL.warrants.stopsign = CL.warrants.stopsign || {};
  window.stopsign_initForm = stopsign_initForm; CL.warrants.stopsign.stopsign_initForm = stopsign_initForm;
  window.stopsign_showTab = stopsign_showTab; CL.warrants.stopsign.stopsign_showTab = stopsign_showTab;
  window.stopsign_updateSpeedThreshold = stopsign_updateSpeedThreshold; CL.warrants.stopsign.stopsign_updateSpeedThreshold = stopsign_updateSpeedThreshold;
  window.stopsign_updateConfig = stopsign_updateConfig; CL.warrants.stopsign.stopsign_updateConfig = stopsign_updateConfig;
  window.stopsign_updateTMCGrid = stopsign_updateTMCGrid; CL.warrants.stopsign.stopsign_updateTMCGrid = stopsign_updateTMCGrid;
  window.stopsign_generateTMCRows = stopsign_generateTMCRows; CL.warrants.stopsign.stopsign_generateTMCRows = stopsign_generateTMCRows;
  window.stopsign_updateRowTotal = stopsign_updateRowTotal; CL.warrants.stopsign.stopsign_updateRowTotal = stopsign_updateRowTotal;
  window.stopsign_markTotalManual = stopsign_markTotalManual; CL.warrants.stopsign.stopsign_markTotalManual = stopsign_markTotalManual;
  window.stopsign_calculateApproachVolumes = stopsign_calculateApproachVolumes; CL.warrants.stopsign.stopsign_calculateApproachVolumes = stopsign_calculateApproachVolumes;
  window.stopsign_computeHourlyAggregates = stopsign_computeHourlyAggregates; CL.warrants.stopsign.stopsign_computeHourlyAggregates = stopsign_computeHourlyAggregates;
  window.stopsign_evaluateCriterionCFromAggregates = stopsign_evaluateCriterionCFromAggregates; CL.warrants.stopsign.stopsign_evaluateCriterionCFromAggregates = stopsign_evaluateCriterionCFromAggregates;
  window.stopsign_updateVolumeSummary = stopsign_updateVolumeSummary; CL.warrants.stopsign.stopsign_updateVolumeSummary = stopsign_updateVolumeSummary;
  window.stopsign_setCountType = stopsign_setCountType; CL.warrants.stopsign.stopsign_setCountType = stopsign_setCountType;
  window.stopsign_clearTMCForm = stopsign_clearTMCForm; CL.warrants.stopsign.stopsign_clearTMCForm = stopsign_clearTMCForm;
  window.stopsign_generateVolumeTable = stopsign_generateVolumeTable; CL.warrants.stopsign.stopsign_generateVolumeTable = stopsign_generateVolumeTable;
  window.stopsign_updateVolumeAnalysis = stopsign_updateVolumeAnalysis; CL.warrants.stopsign.stopsign_updateVolumeAnalysis = stopsign_updateVolumeAnalysis;
  window.stopsign_buildCrashProfile = stopsign_buildCrashProfile; CL.warrants.stopsign.stopsign_buildCrashProfile = stopsign_buildCrashProfile;
  window.stopsign_autoPopulateCriterionB = stopsign_autoPopulateCriterionB; CL.warrants.stopsign.stopsign_autoPopulateCriterionB = stopsign_autoPopulateCriterionB;
  window.stopsign_evaluateCriterionA = stopsign_evaluateCriterionA; CL.warrants.stopsign.stopsign_evaluateCriterionA = stopsign_evaluateCriterionA;
  window.stopsign_evaluateCriterionB = stopsign_evaluateCriterionB; CL.warrants.stopsign.stopsign_evaluateCriterionB = stopsign_evaluateCriterionB;
  window.stopsign_evaluateCriterionC = stopsign_evaluateCriterionC; CL.warrants.stopsign.stopsign_evaluateCriterionC = stopsign_evaluateCriterionC;
  window.stopsign_calculateLOS = stopsign_calculateLOS; CL.warrants.stopsign.stopsign_calculateLOS = stopsign_calculateLOS;
  window.stopsign_toggleHCSConfig = stopsign_toggleHCSConfig; CL.warrants.stopsign.stopsign_toggleHCSConfig = stopsign_toggleHCSConfig;
  window.stopsign_evaluateCriterionD = stopsign_evaluateCriterionD; CL.warrants.stopsign.stopsign_evaluateCriterionD = stopsign_evaluateCriterionD;
  window.stopsign_evaluateAllCriteria = stopsign_evaluateAllCriteria; CL.warrants.stopsign.stopsign_evaluateAllCriteria = stopsign_evaluateAllCriteria;
  window.stopsign_updateResultsTab = stopsign_updateResultsTab; CL.warrants.stopsign.stopsign_updateResultsTab = stopsign_updateResultsTab;
  window.stopsign_updateResultCell = stopsign_updateResultCell; CL.warrants.stopsign.stopsign_updateResultCell = stopsign_updateResultCell;
  window.stopsign_toggleAIPanel = stopsign_toggleAIPanel; CL.warrants.stopsign.stopsign_toggleAIPanel = stopsign_toggleAIPanel;
  window.stopsign_toggleDisclaimer = stopsign_toggleDisclaimer; CL.warrants.stopsign.stopsign_toggleDisclaimer = stopsign_toggleDisclaimer;
  window.stopsign_handleDisclaimerCheckbox = stopsign_handleDisclaimerCheckbox; CL.warrants.stopsign.stopsign_handleDisclaimerCheckbox = stopsign_handleDisclaimerCheckbox;
  window.stopsign_toggleExportButtons = stopsign_toggleExportButtons; CL.warrants.stopsign.stopsign_toggleExportButtons = stopsign_toggleExportButtons;
  window.stopsign_clearVolumeTable = stopsign_clearVolumeTable; CL.warrants.stopsign.stopsign_clearVolumeTable = stopsign_clearVolumeTable;
  window.stopsign_saveData = stopsign_saveData; CL.warrants.stopsign.stopsign_saveData = stopsign_saveData;
  window.stopsign_loadSavedData = stopsign_loadSavedData; CL.warrants.stopsign.stopsign_loadSavedData = stopsign_loadSavedData;
  window.stopsign_exportData = stopsign_exportData; CL.warrants.stopsign.stopsign_exportData = stopsign_exportData;
  window.stopsign_importData = stopsign_importData; CL.warrants.stopsign.stopsign_importData = stopsign_importData;
  window.stopsign_toggleVirginiaMode = stopsign_toggleVirginiaMode; CL.warrants.stopsign.stopsign_toggleVirginiaMode = stopsign_toggleVirginiaMode;
  window.stopsign_toggleVirginiaInfo = stopsign_toggleVirginiaInfo; CL.warrants.stopsign.stopsign_toggleVirginiaInfo = stopsign_toggleVirginiaInfo;
  window.stopsign_askAI = stopsign_askAI; CL.warrants.stopsign.stopsign_askAI = stopsign_askAI;
  window.stopsign_updateProgressIndicator = stopsign_updateProgressIndicator; CL.warrants.stopsign.stopsign_updateProgressIndicator = stopsign_updateProgressIndicator;
  window.stopsign_clearAll = stopsign_clearAll; CL.warrants.stopsign.stopsign_clearAll = stopsign_clearAll;
  window.stopsign_confirmExtractedData = stopsign_confirmExtractedData; CL.warrants.stopsign.stopsign_confirmExtractedData = stopsign_confirmExtractedData;
  window.stopsign_enterReviewMode = stopsign_enterReviewMode; CL.warrants.stopsign.stopsign_enterReviewMode = stopsign_enterReviewMode;
  window.stopsign_loadNextReview = stopsign_loadNextReview; CL.warrants.stopsign.stopsign_loadNextReview = stopsign_loadNextReview;
  window.stopsign_populateTMCFromExtraction = stopsign_populateTMCFromExtraction; CL.warrants.stopsign.stopsign_populateTMCFromExtraction = stopsign_populateTMCFromExtraction;
  window.stopsign_populateTMCFromDayData = stopsign_populateTMCFromDayData; CL.warrants.stopsign.stopsign_populateTMCFromDayData = stopsign_populateTMCFromDayData;
  window.stopsign_skipCurrentReview = stopsign_skipCurrentReview; CL.warrants.stopsign.stopsign_skipCurrentReview = stopsign_skipCurrentReview;
  window.stopsign_advanceReviewQueue = stopsign_advanceReviewQueue; CL.warrants.stopsign.stopsign_advanceReviewQueue = stopsign_advanceReviewQueue;
  window.stopsign_exitReviewMode = stopsign_exitReviewMode; CL.warrants.stopsign.stopsign_exitReviewMode = stopsign_exitReviewMode;
  window.stopsign_discardExtractedData = stopsign_discardExtractedData; CL.warrants.stopsign.stopsign_discardExtractedData = stopsign_discardExtractedData;
  window.stopsign_clearAllDays = stopsign_clearAllDays; CL.warrants.stopsign.stopsign_clearAllDays = stopsign_clearAllDays;
  window.stopsign_onFilesSelected = stopsign_onFilesSelected; CL.warrants.stopsign.stopsign_onFilesSelected = stopsign_onFilesSelected;
  window.stopsign_updateDaySlots = stopsign_updateDaySlots; CL.warrants.stopsign.stopsign_updateDaySlots = stopsign_updateDaySlots;
  window.stopsign_clearAIUploads = stopsign_clearAIUploads; CL.warrants.stopsign.stopsign_clearAIUploads = stopsign_clearAIUploads;
  window.stopsign_selectAveragingMethod = stopsign_selectAveragingMethod; CL.warrants.stopsign.stopsign_selectAveragingMethod = stopsign_selectAveragingMethod;
  window.stopsign_handleFileSelect = stopsign_handleFileSelect; CL.warrants.stopsign.stopsign_handleFileSelect = stopsign_handleFileSelect;
  window.stopsign_handleFileDrop = stopsign_handleFileDrop; CL.warrants.stopsign.stopsign_handleFileDrop = stopsign_handleFileDrop;
  window.stopsign_processUploadedFiles = stopsign_processUploadedFiles; CL.warrants.stopsign.stopsign_processUploadedFiles = stopsign_processUploadedFiles;
  window.stopsign_removeFile = stopsign_removeFile; CL.warrants.stopsign.stopsign_removeFile = stopsign_removeFile;
  window.stopsign_clearUploadedFiles = stopsign_clearUploadedFiles; CL.warrants.stopsign.stopsign_clearUploadedFiles = stopsign_clearUploadedFiles;
  window.stopsign_addCurrentDayToAnalysis = stopsign_addCurrentDayToAnalysis; CL.warrants.stopsign.stopsign_addCurrentDayToAnalysis = stopsign_addCurrentDayToAnalysis;
  window.stopsign_updateDayCards = stopsign_updateDayCards; CL.warrants.stopsign.stopsign_updateDayCards = stopsign_updateDayCards;
  window.stopsign_removeDayFromAnalysis = stopsign_removeDayFromAnalysis; CL.warrants.stopsign.stopsign_removeDayFromAnalysis = stopsign_removeDayFromAnalysis;
  window.stopsign_editDay = stopsign_editDay; CL.warrants.stopsign.stopsign_editDay = stopsign_editDay;
  window.stopsign_saveEditedDay = stopsign_saveEditedDay; CL.warrants.stopsign.stopsign_saveEditedDay = stopsign_saveEditedDay;
  window.stopsign_cancelEdit = stopsign_cancelEdit; CL.warrants.stopsign.stopsign_cancelEdit = stopsign_cancelEdit;
  window.stopsign_collectCurrentTMCData = stopsign_collectCurrentTMCData; CL.warrants.stopsign.stopsign_collectCurrentTMCData = stopsign_collectCurrentTMCData;
  window.stopsign_readFileContent = stopsign_readFileContent; CL.warrants.stopsign.stopsign_readFileContent = stopsign_readFileContent;
  window.stopsign_extractPDFText = stopsign_extractPDFText; CL.warrants.stopsign.stopsign_extractPDFText = stopsign_extractPDFText;
  window.stopsign_extractExcelText = stopsign_extractExcelText; CL.warrants.stopsign.stopsign_extractExcelText = stopsign_extractExcelText;
  window.stopsign_fileToBase64 = stopsign_fileToBase64; CL.warrants.stopsign.stopsign_fileToBase64 = stopsign_fileToBase64;
  window.stopsign_extractAllWithAI = stopsign_extractAllWithAI; CL.warrants.stopsign.stopsign_extractAllWithAI = stopsign_extractAllWithAI;
  window.stopsign_extractSingleFileWithDualAI = stopsign_extractSingleFileWithDualAI; CL.warrants.stopsign.stopsign_extractSingleFileWithDualAI = stopsign_extractSingleFileWithDualAI;
  window.stopsign_validateExtractedData = stopsign_validateExtractedData; CL.warrants.stopsign.stopsign_validateExtractedData = stopsign_validateExtractedData;
  window.stopsign_populateFromExtractedData = stopsign_populateFromExtractedData; CL.warrants.stopsign.stopsign_populateFromExtractedData = stopsign_populateFromExtractedData;
  window.stopsign_generatePDFReport = stopsign_generatePDFReport; CL.warrants.stopsign.stopsign_generatePDFReport = stopsign_generatePDFReport;
  window.stopsign_generateWordMemo = stopsign_generateWordMemo; CL.warrants.stopsign.stopsign_generateWordMemo = stopsign_generateWordMemo;
  window.stopsign_exportCSV = stopsign_exportCSV; CL.warrants.stopsign.stopsign_exportCSV = stopsign_exportCSV;
  CL._registerModule('warrants/stopsign');
})();
