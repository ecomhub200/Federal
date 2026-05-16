/**
 * CL warrants.signalTmc module
 *
 * Extracted from app/index.html (snapshot L16558-L17403) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/06-warrants-signal-tmc.md.
 * Responsibility: Signal-warrant TMC grid + day-card data entry UI (signal_* fns).
 *
 * Public API (back-compat dual exposure):
 *   - window.signal_updateTMCGrid → CL.warrants.signal_updateTMCGrid
 *   - window.signal_generateTMCRows → CL.warrants.signal_generateTMCRows
 *   - window.signal_addCurrentDay → CL.warrants.signal_addCurrentDay
 *   - window.signal_saveData → CL.warrants.signal_saveData
 *   - window.signal_renderDayCards → CL.warrants.signal_renderDayCards
 *   (all 29 top-level signal_* fns dual-exposed below for onclick back-compat)
 *
 * Depends on (must load before this file): `warrants/signal`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

// Signal Warrant Analyzer Helper Functions (Redesigned Single-Page Layout)

// Toggle AI Panel
function signal_toggleAIPanel() {
    const panel = document.getElementById('signalAIPanel');
    const toggleText = document.getElementById('signalAIPanelToggleText');
    panel.classList.toggle('expanded');
    toggleText.textContent = panel.classList.contains('expanded') ? 'Collapse' : 'Expand';
}

// Toggle Legal Disclaimer
function signal_toggleDisclaimer() {
    const disclaimer = document.getElementById('signalDisclaimerCollapsible');
    disclaimer.classList.toggle('expanded');
}

/**
 * Toggle export button enabled/disabled state based on disclaimer checkbox
 */
function signal_toggleExportButtons() {
    const checkbox = document.getElementById('signalExportDisclaimer');
    const exportBtns = ['signalExportWord', 'signalExportPDF', 'signalExportCSV'];

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

// Update day slots based on weekday/weekend selection
function signal_updateDaySlots() {
    const dayType = document.getElementById('signalDayType')?.value || 'weekday';
    const maxDays = dayType === 'weekday' ? 5 : 2;

    // Show/hide day slots based on selection using display style
    for (let i = 1; i <= 7; i++) {
        const slot = document.getElementById(`signalSlot${i}`);
        if (slot) {
            if (i <= maxDays) {
                slot.style.display = '';  // Show slot
            } else {
                slot.style.display = 'none';  // Hide slot
                // Reset hidden slots
                slot.classList.remove('has-file');
                const icon = slot.querySelector('.slot-icon');
                if (icon) icon.textContent = '○';
            }
        }
    }

    // Update the file count display text
    const maxFilesText = document.getElementById('signalMaxFilesText');
    if (maxFilesText) {
        maxFilesText.textContent = `(Max ${maxDays} files - .xlsx, .xls, .csv, .pdf)`;
    }
}

// Handle Disclaimer Checkbox - enables/disables Extract button
function signal_handleDisclaimerCheckbox() {
    const checkbox = document.getElementById('signalDisclaimerCheckbox');
    const extractBtn = document.getElementById('signalExtractBtn');
    extractBtn.disabled = !checkbox.checked;
}

// Toggle Virginia Info
function signal_toggleVirginiaInfo() {
    const info = document.getElementById('signalVirginiaInfo');
    const checked = document.getElementById('signalVirginiaMode')?.checked;
    if (info) info.classList.toggle('hidden', !checked);
}

// Check and suggest 70% reduction
function signal_check70pct() {
    const speed = parseInt(document.getElementById('signalSpeedLimit')?.value) || 35;
    const pop = parseInt(document.getElementById('signalCommunityPop')?.value) || 50000;
    const suggestion = document.getElementById('signal70pctSuggestion');
    const reason = document.getElementById('signal70pctReason');

    if (speed > 40 || pop < 10000) {
        suggestion?.classList.remove('hidden');
        if (reason) {
            const reasons = [];
            if (speed > 40) reasons.push(`speed limit ${speed} mph > 40 mph`);
            if (pop < 10000) reasons.push(`population ${pop.toLocaleString()} < 10,000`);
            reason.textContent = `Consider applying 70% reduction: ${reasons.join(', ')}.`;
        }
    } else {
        suggestion?.classList.add('hidden');
    }
}

// Toggle RT options visibility
function signal_toggleRTOptions() {
    const method = document.getElementById('signalRTMethod')?.value;
    const fixedGroup = document.getElementById('signalRTFixedGroup');
    const pagonesGroup = document.getElementById('signalPagonesGroup');
    if (fixedGroup) fixedGroup.style.display = method === 'fixed' ? 'block' : 'none';
    if (pagonesGroup) pagonesGroup.style.display = method === 'pagones' ? 'block' : 'none';
}

// Toggle Warrant 4 panel
function signal_toggleWarrant4() {
    const panel = document.getElementById('signalW4Panel');
    const checked = document.getElementById('signalW4Enable')?.checked;
    if (panel) panel.classList.toggle('hidden', !checked);
    if (checked) signal_updateW4HourVisibility();
}

// Update Warrant 4 hour visibility based on analysis type
function signal_updateW4HourVisibility() {
    const analysisType = document.getElementById('signalW4Type')?.value || '4hour';
    const isPeakHour = analysisType === 'peakhour';

    // Hide hours 2-4 for peak hour analysis
    ['signalW4PedHour2Group', 'signalW4PedHour3Group', 'signalW4PedHour4Group',
     'signalW4MajorHour2Group', 'signalW4MajorHour3Group', 'signalW4MajorHour4Group'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = isPeakHour ? 'none' : 'block';
    });
}

// Auto-populate Warrant 4 major street volumes from TMC data
function signal_autoPopulateW4MajorVolumes() {
    // Compute hourly aggregates from TMC data
    const hourlyAggregates = signal_computeHourlyAggregates();
    if (!hourlyAggregates) {
        showToast('No TMC data available. Please enter turning movement counts first.', 'warning');
        return;
    }

    // Get major direction
    const majorDir = warrantsState.signal.config.majorDirection;
    const isMajorEW = majorDir === 'EW';

    // Calculate major street volumes for each hour and find the 4 highest
    const hourlyMajor = [];
    for (let hour = 0; hour < 24; hour++) {
        if (hourlyAggregates[hour]) {
            let majorVol = 0;
            for (const approach of ['NB', 'SB', 'EB', 'WB']) {
                const data = hourlyAggregates[hour][approach] || {};
                const approachTotal = (data.L || 0) + (data.T || 0) + (data.R || 0) + (data.U || 0);
                const isMajor = (isMajorEW && (approach === 'EB' || approach === 'WB')) ||
                               (!isMajorEW && (approach === 'NB' || approach === 'SB'));
                if (isMajor) majorVol += approachTotal;
            }
            if (majorVol > 0) {
                hourlyMajor.push({ hour, volume: majorVol });
            }
        }
    }

    if (hourlyMajor.length === 0) {
        showToast('No major street volume data found in TMC entries.', 'warning');
        return;
    }

    // Sort by volume descending to get highest hours
    hourlyMajor.sort((a, b) => b.volume - a.volume);

    // Take top 4 (or 1 for peak hour analysis)
    const analysisType = warrantsState.signal.warrant4.analysisType || '4hour';
    const hoursNeeded = analysisType === 'peakhour' ? 1 : 4;
    const topHours = hourlyMajor.slice(0, hoursNeeded);

    // Populate the state and UI
    for (let i = 0; i < 4; i++) {
        const vol = i < topHours.length ? topHours[i].volume : 0;
        warrantsState.signal.warrant4.hourlyMajorVolumes[i] = vol;
        const input = document.getElementById(`signalW4MajorHour${i + 1}`);
        if (input) input.value = vol;
    }

    const hourLabels = topHours.map(h => `${h.hour}:00 (${h.volume} vph)`).join(', ');
    showToast(`Auto-filled ${topHours.length} highest-volume hour(s): ${hourLabels}`, 'success');
    console.log('[Signal] Auto-populated W4 major volumes:', topHours);
}

// Toggle Warrant 5 panel
function signal_toggleWarrant5() {
    const panel = document.getElementById('signalW5Panel');
    const checked = document.getElementById('signalW5Enable')?.checked;
    if (panel) panel.classList.toggle('hidden', !checked);
}

// Toggle Warrant 7 panel
function signal_toggleWarrant7() {
    const panel = document.getElementById('signalW7Panel');
    const checked = document.getElementById('signalW7Enable')?.checked;
    if (panel) panel.classList.toggle('hidden', !checked);
    warrantsState.signal.warrant7.enabled = checked;
}

// Select averaging method
function signal_selectAveragingMethod(method) {
    console.log('[Signal] Averaging method selected:', method);

    // Update visual state
    document.querySelectorAll('.signal-avg-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.method === method);
    });

    // Update state
    warrantsState.signal.averagingMethod = method;
    signal_updateConfigFromUI();

    // Update day cards to reflect new selection
    signal_renderDayCards();

    // Re-run analysis if results exist
    if (warrantsState.signal.analysisResults) {
        signal_runAnalysis();
    }
}

// Toggle weekend analysis option
function signal_toggleWeekendAnalysis(checked) {
    console.log('[Signal] Weekend analysis toggled:', checked);
    warrantsState.signal.includeWeekend = checked;

    // Update day cards to reflect weekend selection
    signal_renderDayCards();

    // Re-run analysis if results exist
    if (warrantsState.signal.analysisResults) {
        signal_runAnalysis();
    }
}

/**
 * Set count type (12hr/24hr) and update the TMC table
 * Called from Manual Entry toggle buttons
 * @param {string} countType - '12hr' or '24hr'
 * @param {boolean} skipWarning - If true, skip the review mode warning (used for auto-sync)
 */
function signal_setCountType(countType, skipWarning = false) {
    // Warn if changing count type during review mode (user-initiated change only)
    if (!skipWarning && signalIsReviewMode) {
        const currentCountType = document.getElementById('signalCountType')?.value || '12hr';
        if (currentCountType !== countType) {
            showToast('Warning: Changing count type during review may cause data loss for hours outside the new range', 'warning', 5000);
        }
    }

    // Update hidden input
    const countTypeInput = document.getElementById('signalCountType');
    if (countTypeInput) countTypeInput.value = countType;

    // Sync with AI panel dropdown if exists
    const aiCountType = document.getElementById('signalAICountType');
    if (aiCountType) aiCountType.value = countType;

    // Update toggle button styles
    const btn12hr = document.getElementById('countType12hrBtn');
    const btn24hr = document.getElementById('countType24hrBtn');

    if (countType === '12hr') {
        if (btn12hr) {
            btn12hr.style.background = 'linear-gradient(135deg,#3b82f6 0%,#1e40af 100%)';
            btn12hr.style.color = 'white';
            btn12hr.style.boxShadow = '0 2px 8px rgba(59,130,246,0.3)';
        }
        if (btn24hr) {
            btn24hr.style.background = 'transparent';
            btn24hr.style.color = '#64748b';
            btn24hr.style.boxShadow = 'none';
        }
    } else {
        if (btn24hr) {
            btn24hr.style.background = 'linear-gradient(135deg,#3b82f6 0%,#1e40af 100%)';
            btn24hr.style.color = 'white';
            btn24hr.style.boxShadow = '0 2px 8px rgba(59,130,246,0.3)';
        }
        if (btn12hr) {
            btn12hr.style.background = 'transparent';
            btn12hr.style.color = '#64748b';
            btn12hr.style.boxShadow = 'none';
        }
    }

    // Update indicator text
    const indicator = document.getElementById('signalCountTypeIndicator');
    if (indicator) {
        indicator.textContent = countType === '12hr' ? 'Table shows 12 hours' : 'Table shows 24 hours';
    }

    // Update review mode count type indicator if visible
    const reviewCountTypeIndicator = document.getElementById('signalReviewCountTypeIndicator');
    if (reviewCountTypeIndicator) {
        reviewCountTypeIndicator.textContent = countType === '12hr' ? '12-Hour' : '24-Hour';
    }

    // Update the config and regenerate the table
    signal_updateConfigFromUI();
    signal_updateTMCGrid();

    console.log('[Signal] Count type set to:', countType);
}

// Update TMC grid headers based on major direction, U-turn selection, and count type
function signal_updateTMCGrid() {
    const majorDir = document.getElementById('signalMajorDirection')?.value || 'EW';
    const uturnSelection = document.getElementById('signalUTurnSelection')?.value || 'none';
    const countType = document.getElementById('signalCountType')?.value || '12hr';
    const isMajorEW = majorDir === 'EW';

    console.log('[Signal] Updating TMC Grid - Count Type:', countType);

    // Determine which approaches get U-turn columns
    // U-turns typically originate from the approach, so:
    // - "major" = EB/WB get U-turn columns (when major is EW) or NB/SB (when major is NS)
    // - "minor" = NB/SB get U-turn columns (when major is EW) or EB/WB (when major is NS)
    const hasUTurn = {
        NB: (uturnSelection === 'minor' && isMajorEW) || (uturnSelection === 'major' && !isMajorEW),
        SB: (uturnSelection === 'minor' && isMajorEW) || (uturnSelection === 'major' && !isMajorEW),
        EB: (uturnSelection === 'major' && isMajorEW) || (uturnSelection === 'minor' && !isMajorEW),
        WB: (uturnSelection === 'major' && isMajorEW) || (uturnSelection === 'minor' && !isMajorEW)
    };

    // Generate header rows dynamically
    const thead = document.getElementById('signalTMCTableHead');
    if (!thead) return;

    // Build header row 1 (approach headers with dynamic colspan)
    let headerRow1 = '<tr><th class="tmc-hour-header" rowspan="2">Hour</th>';
    for (const approach of ['NB', 'SB', 'EB', 'WB']) {
        const isMajor = (isMajorEW && (approach === 'EB' || approach === 'WB')) ||
                       (!isMajorEW && (approach === 'NB' || approach === 'SB'));
        const colspan = hasUTurn[approach] ? 5 : 4; // LT, T, RT, [UT], Total
        const typeClass = isMajor ? 'major' : 'minor';
        const typeLabel = isMajor ? 'Major' : 'Minor';
        headerRow1 += `<th class="tmc-approach-header ${typeClass}" colspan="${colspan}" id="tmcHeader_${approach}">${approach}<br><small>(${typeLabel})</small></th>`;
    }
    headerRow1 += '</tr>';

    // Build header row 2 (subheaders for LT, T, RT, [UT], Total)
    let headerRow2 = '<tr>';
    for (const approach of ['NB', 'SB', 'EB', 'WB']) {
        headerRow2 += '<th class="tmc-subheader">LT</th><th class="tmc-subheader">T</th><th class="tmc-subheader">RT</th>';
        if (hasUTurn[approach]) {
            headerRow2 += '<th class="tmc-subheader" style="background:#fef3c7;color:#92400e">UT</th>';
        }
        headerRow2 += '<th class="tmc-subheader total">Total</th>';
    }
    headerRow2 += '</tr>';

    thead.innerHTML = headerRow1 + headerRow2;

    // Store U-turn config in warrantsState for use by other functions
    if (typeof warrantsState !== 'undefined' && warrantsState.signal) {
        warrantsState.signal.hasUTurn = hasUTurn;
    }

    // Regenerate table body to match new header structure and count type
    signal_generateTMCRows();
}

// Generate TMC table rows
function signal_generateTMCRows() {
    const tbody = document.getElementById('signalTMCTableBody');
    if (!tbody) return;

    // Always clear and regenerate to handle count type changes
    tbody.innerHTML = '';

    const countType = document.getElementById('signalCountType')?.value || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;

    console.log('[Signal] Generating TMC Rows - Count Type:', countType, 'Hours:', startHour, '-', endHour);
    const majorDir = document.getElementById('signalMajorDirection')?.value || 'EW';
    const isMajorEW = majorDir === 'EW';

    // Get U-turn configuration from warrantsState or calculate it
    const uturnSelection = document.getElementById('signalUTurnSelection')?.value || 'none';
    const hasUTurn = (typeof warrantsState !== 'undefined' && warrantsState.signal?.hasUTurn) || {
        NB: (uturnSelection === 'minor' && isMajorEW) || (uturnSelection === 'major' && !isMajorEW),
        SB: (uturnSelection === 'minor' && isMajorEW) || (uturnSelection === 'major' && !isMajorEW),
        EB: (uturnSelection === 'major' && isMajorEW) || (uturnSelection === 'minor' && !isMajorEW),
        WB: (uturnSelection === 'major' && isMajorEW) || (uturnSelection === 'minor' && !isMajorEW)
    };

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
                    <input type="number" min="0" id="tmc_${hour}_${approach}_${mov}"
                           onchange="signal_updateRowTotal(${hour},'${approach}')" placeholder="0">
                </td>`;
            }

            // Add U-turn column if applicable
            if (hasUTurn[approach]) {
                html += `<td class="tmc-cell ${bgClass}" style="background:#fef9c3">
                    <input type="number" min="0" id="tmc_${hour}_${approach}_U"
                           onchange="signal_updateRowTotal(${hour},'${approach}')" placeholder="0"
                           style="background:#fffbeb">
                </td>`;
            }

            // Total column as editable input with auto-sum
            html += `<td class="tmc-cell total-cell">
                <input type="number" min="0" class="total-input" id="tmc_${hour}_${approach}_total"
                       value="0" onchange="signal_markTotalManual(${hour},'${approach}')">
            </td>`;
        }
        html += '</tr>';
    }
    tbody.innerHTML = html;
}

// Track manually edited totals
const manualTotals = {};

// Update row total (includes U-turn if present, auto-sum unless manually edited)
function signal_updateRowTotal(hour, approach) {
    const key = `${hour}_${approach}`;
    // If user manually edited the total, don't auto-update
    if (manualTotals[key]) return;

    const L = parseInt(document.getElementById(`tmc_${hour}_${approach}_L`)?.value) || 0;
    const T = parseInt(document.getElementById(`tmc_${hour}_${approach}_T`)?.value) || 0;
    const R = parseInt(document.getElementById(`tmc_${hour}_${approach}_R`)?.value) || 0;
    // Check if U-turn input exists for this approach
    const uEl = document.getElementById(`tmc_${hour}_${approach}_U`);
    const U = uEl ? (parseInt(uEl.value) || 0) : 0;
    const totalEl = document.getElementById(`tmc_${hour}_${approach}_total`);
    if (totalEl) totalEl.value = L + T + R + U;
}

// Mark a total as manually edited
function signal_markTotalManual(hour, approach) {
    const key = `${hour}_${approach}`;
    manualTotals[key] = true;
}

// Clear TMC form
function signal_clearTMCForm() {
    const tbody = document.getElementById('signalTMCTableBody');
    if (tbody) {
        tbody.querySelectorAll('input').forEach(inp => inp.value = '');
        // Reset total inputs to 0
        tbody.querySelectorAll('.total-input').forEach(inp => inp.value = '0');
    }
    // Reset manual totals tracking
    for (const key in manualTotals) {
        delete manualTotals[key];
    }
    document.getElementById('signalTMCDate').value = '';
}

// Add current day data
function signal_addCurrentDay() {
    const date = document.getElementById('signalTMCDate')?.value;
    const dow = parseInt(document.getElementById('signalTMCDow')?.value) || 2;

    // Date is optional - generate unique key if not provided
    const dayKey = date ? `day_${date}` : `day_${Date.now()}`;

    // Collect TMC data from form
    const hourlyData = {};
    const countType = document.getElementById('signalCountType')?.value || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;

    // Track any data entry discrepancies for warning
    const discrepancies = [];

    for (let hour = startHour; hour < endHour; hour++) {
        hourlyData[hour] = {};
        for (const approach of ['NB', 'SB', 'EB', 'WB']) {
            const data = {
                L: parseInt(document.getElementById(`tmc_${hour}_${approach}_L`)?.value) || 0,
                T: parseInt(document.getElementById(`tmc_${hour}_${approach}_T`)?.value) || 0,
                R: parseInt(document.getElementById(`tmc_${hour}_${approach}_R`)?.value) || 0
            };
            // Include U-turn data if the input exists for this approach
            const uEl = document.getElementById(`tmc_${hour}_${approach}_U`);
            if (uEl) {
                data.U = parseInt(uEl.value) || 0;
            }
            // Store the total field value (supports manual override)
            const totalEl = document.getElementById(`tmc_${hour}_${approach}_total`);
            if (totalEl) {
                data.total = parseInt(totalEl.value) || 0;
            }

            // Check for movement vs total discrepancy
            const movementSum = data.L + data.T + data.R + (data.U || 0);
            if (movementSum > 0 && data.total > 0 && movementSum !== data.total) {
                discrepancies.push(`Hour ${hour}:00 ${approach}: Movements sum to ${movementSum}, but total is ${data.total}`);
            }

            hourlyData[hour][approach] = data;
        }
    }

    // Show warning if discrepancies found
    if (discrepancies.length > 0) {
        const maxShow = 3;
        const moreCount = discrepancies.length > maxShow ? discrepancies.length - maxShow : 0;
        const msg = discrepancies.slice(0, maxShow).join('\n') + (moreCount > 0 ? `\n...and ${moreCount} more` : '');
        console.warn('[Signal] Movement vs Total discrepancies:', discrepancies);
        showToast(`Data entry mismatch detected:\n${msg}\n\nNote: When both are entered, movements (L+T+R+U) are used.`, 'warning', 6000);
    }

    // Add to state with dow from dropdown
    signal_addDay(dayKey, date, hourlyData, dow);

    // Update UI
    signal_renderDayCards();

    // If in review mode, advance to next day in queue
    if (signalIsReviewMode) {
        signal_advanceReviewQueue();
    } else {
        // Clear form only if not in review mode
        signal_clearTMCForm();

        // Auto-advance to next day of week
        signal_advanceToNextDay(dow);
    }
}

// Helper function to advance day of week dropdown to next day
function signal_advanceToNextDay(currentDayIndex) {
    const dowSelect = document.getElementById('signalTMCDow');
    if (!dowSelect) return;
    // Day values: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
    // Advance: Mon(1)→Tue(2)→Wed(3)→Thu(4)→Fri(5)→Sat(6)→Sun(0)→Mon(1)
    const nextDayIndex = currentDayIndex === 6 ? 0 : (currentDayIndex === 0 ? 1 : currentDayIndex + 1);
    dowSelect.value = nextDayIndex.toString();
}

// Clear all AI uploads (consolidated - BUG-001 fix)
function signal_clearAIUploads() {
    // Clear file slots (using both selectors for compatibility)
    for (let i = 1; i <= 7; i++) {
        const slot = document.getElementById(`signalSlot${i}`);
        if (slot) {
            slot.classList.remove('has-file', 'processing', 'error');
            slot.querySelector('.slot-icon').textContent = '○';
        }
    }
    // Clear all state
    warrantsState.signal.uploadedFiles = {};
    signalPendingExtractions = [];
    signalUploadedFiles = {};
    signalAllValidationResults = [];
    signalReviewQueue = [];
    signalCurrentReviewIndex = 0;
    // Exit review mode if active
    signalIsReviewMode = false;
    if (typeof signal_exitReviewMode === 'function') {
        signal_exitReviewMode();
    }
    // Reset disclaimer checkbox and disable button
    const checkbox = document.getElementById('signalDisclaimerCheckbox');
    if (checkbox) checkbox.checked = false;
    const extractBtn = document.getElementById('signalExtractBtn');
    if (extractBtn) extractBtn.disabled = true;
    // Collapse disclaimer if expanded
    const disclaimer = document.getElementById('signalDisclaimerCollapsible');
    if (disclaimer) disclaimer.classList.remove('expanded');
    // Hide validation and preview panels
    const validationPanel = document.getElementById('signalValidationPanel');
    if (validationPanel) validationPanel.style.display = 'none';
    const previewPanel = document.getElementById('signalDataPreviewPanel');
    if (previewPanel) previewPanel.style.display = 'none';
    // Clear file input
    const fileInput = document.getElementById('signalBulkFileInput');
    if (fileInput) fileInput.value = '';
    // Update status
    const statusEl = document.getElementById('signalExtractionStatus');
    if (statusEl) statusEl.innerHTML = '';
}

// Save signal warrant data to localStorage and IndexedDB
function signal_saveData() {
    try {
        const data = {
            config: warrantsState.signal.config,
            multiDayData: warrantsState.signal.multiDayData,
            warrant4: warrantsState.signal.warrant4,
            warrant5: warrantsState.signal.warrant5,
            warrant7: warrantsState.signal.warrant7,
            virginiaMode: warrantsState.signal.virginiaMode,
            averagingMethod: warrantsState.signal.averagingMethod,
            includeWeekend: warrantsState.signal.includeWeekend,
            rtAdjustment: warrantsState.signal.rtAdjustment,
            analysisResults: warrantsState.signal.analysisResults,
            savedAt: new Date().toISOString()
        };

        // Save to localStorage (legacy)
        localStorage.setItem('signalWarrantData', JSON.stringify(data));

        // Save to IndexedDB (new persistent storage)
        warrantDbSave('signal', {
            ...data,
            intersectionName: data.config?.intersectionName || ''
        }).then(() => {
            console.log('[Signal Warrant] Data saved to IndexedDB');
        }).catch(e => {
            console.error('[Signal Warrant] IndexedDB save error:', e);
        });

        showToast('Data saved to browser storage!', 'success');
        console.log('[Signal Warrant] Data saved to localStorage');
    } catch (error) {
        console.error('[Signal Warrant] Error saving to localStorage:', error);
        showToast('Failed to save data', 'danger');
    }
}

// Load signal warrant data from localStorage
function signal_loadSavedData() {
    try {
        const savedData = localStorage.getItem('signalWarrantData');
        if (!savedData) return false;

        const data = JSON.parse(savedData);

        // Restore config
        if (data.config) {
            warrantsState.signal.config = { ...warrantsState.signal.config, ...data.config };

            // Update UI fields
            const fields = {
                'signalIntersectionName': data.config.intersectionName,
                'signalMajorStreet': data.config.majorStreet,
                'signalMinorStreet': data.config.minorStreet,
                'signalMajorLanes': data.config.majorLanes,
                'signalMinorLanes': data.config.minorLanes,
                'signalMajorDirection': data.config.majorDirection,
                'signalSpeedLimit': data.config.speedLimit,
                'signalCommunityPop': data.config.communityPop,
                'signalIntersectionLegs': data.config.intersectionLegs,
                'signalCountType': data.config.countType,
                'signalUTurnSelection': data.config.uturnSelection
            };

            for (const [id, value] of Object.entries(fields)) {
                const el = document.getElementById(id);
                if (el && value !== undefined) el.value = value;
            }

            // Update checkboxes
            const apply70pct = document.getElementById('signalApply70pct');
            if (apply70pct) apply70pct.checked = data.config.apply70pct || false;

            const virginiaMode = document.getElementById('signalVirginiaMode');
            if (virginiaMode) virginiaMode.checked = data.virginiaMode || false;
        }

        // Restore multi-day data
        if (data.multiDayData) {
            warrantsState.signal.multiDayData = data.multiDayData;
            signal_renderDayCards();
        }

        // Restore warrant 4, 5, 7
        if (data.warrant4) warrantsState.signal.warrant4 = data.warrant4;
        if (data.warrant5) warrantsState.signal.warrant5 = data.warrant5;
        if (data.warrant7) {
            warrantsState.signal.warrant7 = data.warrant7;
            // Update W7 UI
            const w7Enable = document.getElementById('signalW7Enable');
            if (w7Enable) w7Enable.checked = data.warrant7.enabled;
            const w7Period = document.getElementById('signalW7Period');
            if (w7Period) w7Period.value = data.warrant7.period || '1year';
            const w7AngleTotal = document.getElementById('signalW7AngleTotal');
            if (w7AngleTotal) w7AngleTotal.value = data.warrant7.angleCrashesTotal || 0;
            const w7AngleInjury = document.getElementById('signalW7AngleInjury');
            if (w7AngleInjury) w7AngleInjury.value = data.warrant7.angleCrashesInjury || 0;
            const w7PedTotal = document.getElementById('signalW7PedTotal');
            if (w7PedTotal) w7PedTotal.value = data.warrant7.pedCrashesTotal || 0;
            const w7PedInjury = document.getElementById('signalW7PedInjury');
            if (w7PedInjury) w7PedInjury.value = data.warrant7.pedCrashesInjury || 0;
        }

        // Restore analysis results if available
        if (data.analysisResults) {
            warrantsState.signal.analysisResults = data.analysisResults;
        }

        if (data.averagingMethod) {
            warrantsState.signal.averagingMethod = data.averagingMethod;
            // Update averaging method UI
            document.querySelectorAll('.signal-avg-option').forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.method === data.averagingMethod);
            });
        }

        // Restore weekend analysis option
        if (data.includeWeekend !== undefined) {
            warrantsState.signal.includeWeekend = data.includeWeekend;
            const weekendCheckbox = document.getElementById('signalIncludeWeekend');
            if (weekendCheckbox) weekendCheckbox.checked = data.includeWeekend;
        }

        console.log('[Signal Warrant] Data loaded from localStorage:', data.savedAt);
        return true;
    } catch (error) {
        console.error('[Signal Warrant] Error loading from localStorage:', error);
        return false;
    }
}

// Export signal warrant data as JSON file
function signal_exportData() {
    const data = {
        config: warrantsState.signal.config,
        multiDayData: warrantsState.signal.multiDayData,
        warrant4: warrantsState.signal.warrant4,
        warrant5: warrantsState.signal.warrant5,
        warrant7: warrantsState.signal.warrant7,
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signal_warrant_${warrantsState.signal.config.intersectionName || 'data'}_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported as JSON file', 'success');
}

// Clear all signal warrant data
function signal_clearAll() {
    if (!confirm('Clear all signal warrant data? This cannot be undone.')) return;
    signal_initState();
    signal_clearTMCForm();
    signal_clearAIUploads();
    signal_renderDayCards();
    document.getElementById('signalResultsSection')?.classList.add('hidden');
    document.getElementById('signalAlternativeOptions')?.style.setProperty('display', 'none');
    // Also clear localStorage
    localStorage.removeItem('signalWarrantData');
    // Clear from IndexedDB
    warrantDbClear('signal').then(() => {
        console.log('[Signal Warrant] IndexedDB data cleared');
    }).catch(e => {
        console.error('[Signal Warrant] IndexedDB clear error:', e);
    });
    showToast('All data cleared', 'warning');
}

// Render day cards
function signal_renderDayCards() {
    const container = document.getElementById('signalDayCardsGrid');
    const section = document.getElementById('signalAddedDaysSection');
    const dayCount = document.getElementById('signalTMCDayCount');

    const days = Object.keys(warrantsState.signal.multiDayData || {});

    if (dayCount) dayCount.textContent = `${days.length} days entered`;

    if (days.length === 0) {
        section?.classList.add('hidden');
        return;
    }

    section?.classList.remove('hidden');

    let html = '';
    for (const key of days) {
        const day = warrantsState.signal.multiDayData[key];
        const dowNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dowName = dowNames[day.dow] || 'Unknown';
        const isWeekend = day.dow === 0 || day.dow === 6;

        // Calculate totals (including U-turn if present)
        let majorTotal = 0, minorTotal = 0;
        const majorDir = warrantsState.signal.config.majorDirection || 'EW';
        const isMajorEW = majorDir === 'EW';

        for (const hour in day.hourlyData) {
            for (const approach of ['NB', 'SB', 'EB', 'WB']) {
                const data = day.hourlyData[hour]?.[approach] || {};
                // Sum individual movements
                const sumMovements = (data.L || 0) + (data.T || 0) + (data.R || 0) + (data.U || 0);
                // Use stored total if individual movements sum to 0 (user entered total directly)
                const total = sumMovements > 0 ? sumMovements : (data.total || 0);
                const isMajor = (isMajorEW && (approach === 'EB' || approach === 'WB')) ||
                               (!isMajorEW && (approach === 'NB' || approach === 'SB'));
                if (isMajor) majorTotal += total;
                else minorTotal += total;
            }
        }

        html += `
        <div class="signal-day-card ${isWeekend ? 'weekend' : ''}">
            <div class="signal-day-card-header">
                <div>
                    <div class="signal-day-card-title">${dowName}</div>
                    <div class="signal-day-card-date">${day.date}</div>
                </div>
                <button class="btn btn-sm btn-outline" onclick="signal_removeDay('${key}')" title="Remove">&times;</button>
            </div>
            <div class="signal-day-card-stats">
                <div class="signal-day-stat">
                    <div class="signal-day-stat-value" style="color:#10b981">${majorTotal.toLocaleString()}</div>
                    <div class="signal-day-stat-label">Major</div>
                </div>
                <div class="signal-day-stat">
                    <div class="signal-day-stat-value" style="color:#3b82f6">${minorTotal.toLocaleString()}</div>
                    <div class="signal-day-stat-label">Minor</div>
                </div>
            </div>
        </div>`;
    }

    if (container) container.innerHTML = html;
}

// Initialize TMC grid on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        try {
            signal_updateTMCGrid();
        } catch (e) {
            console.warn('[Signal TMC] Deferred initialization - state not ready yet:', e.message);
        }
    }, 100);
});

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.warrants = CL.warrants || {};
  window.signal_toggleAIPanel = signal_toggleAIPanel; CL.warrants.signal_toggleAIPanel = signal_toggleAIPanel;
  window.signal_toggleDisclaimer = signal_toggleDisclaimer; CL.warrants.signal_toggleDisclaimer = signal_toggleDisclaimer;
  window.signal_toggleExportButtons = signal_toggleExportButtons; CL.warrants.signal_toggleExportButtons = signal_toggleExportButtons;
  window.signal_updateDaySlots = signal_updateDaySlots; CL.warrants.signal_updateDaySlots = signal_updateDaySlots;
  window.signal_handleDisclaimerCheckbox = signal_handleDisclaimerCheckbox; CL.warrants.signal_handleDisclaimerCheckbox = signal_handleDisclaimerCheckbox;
  window.signal_toggleVirginiaInfo = signal_toggleVirginiaInfo; CL.warrants.signal_toggleVirginiaInfo = signal_toggleVirginiaInfo;
  window.signal_check70pct = signal_check70pct; CL.warrants.signal_check70pct = signal_check70pct;
  window.signal_toggleRTOptions = signal_toggleRTOptions; CL.warrants.signal_toggleRTOptions = signal_toggleRTOptions;
  window.signal_toggleWarrant4 = signal_toggleWarrant4; CL.warrants.signal_toggleWarrant4 = signal_toggleWarrant4;
  window.signal_updateW4HourVisibility = signal_updateW4HourVisibility; CL.warrants.signal_updateW4HourVisibility = signal_updateW4HourVisibility;
  window.signal_autoPopulateW4MajorVolumes = signal_autoPopulateW4MajorVolumes; CL.warrants.signal_autoPopulateW4MajorVolumes = signal_autoPopulateW4MajorVolumes;
  window.signal_toggleWarrant5 = signal_toggleWarrant5; CL.warrants.signal_toggleWarrant5 = signal_toggleWarrant5;
  window.signal_toggleWarrant7 = signal_toggleWarrant7; CL.warrants.signal_toggleWarrant7 = signal_toggleWarrant7;
  window.signal_selectAveragingMethod = signal_selectAveragingMethod; CL.warrants.signal_selectAveragingMethod = signal_selectAveragingMethod;
  window.signal_toggleWeekendAnalysis = signal_toggleWeekendAnalysis; CL.warrants.signal_toggleWeekendAnalysis = signal_toggleWeekendAnalysis;
  window.signal_setCountType = signal_setCountType; CL.warrants.signal_setCountType = signal_setCountType;
  window.signal_updateTMCGrid = signal_updateTMCGrid; CL.warrants.signal_updateTMCGrid = signal_updateTMCGrid;
  window.signal_generateTMCRows = signal_generateTMCRows; CL.warrants.signal_generateTMCRows = signal_generateTMCRows;
  window.signal_updateRowTotal = signal_updateRowTotal; CL.warrants.signal_updateRowTotal = signal_updateRowTotal;
  window.signal_markTotalManual = signal_markTotalManual; CL.warrants.signal_markTotalManual = signal_markTotalManual;
  window.signal_clearTMCForm = signal_clearTMCForm; CL.warrants.signal_clearTMCForm = signal_clearTMCForm;
  window.signal_addCurrentDay = signal_addCurrentDay; CL.warrants.signal_addCurrentDay = signal_addCurrentDay;
  window.signal_advanceToNextDay = signal_advanceToNextDay; CL.warrants.signal_advanceToNextDay = signal_advanceToNextDay;
  window.signal_clearAIUploads = signal_clearAIUploads; CL.warrants.signal_clearAIUploads = signal_clearAIUploads;
  window.signal_saveData = signal_saveData; CL.warrants.signal_saveData = signal_saveData;
  window.signal_loadSavedData = signal_loadSavedData; CL.warrants.signal_loadSavedData = signal_loadSavedData;
  window.signal_exportData = signal_exportData; CL.warrants.signal_exportData = signal_exportData;
  window.signal_clearAll = signal_clearAll; CL.warrants.signal_clearAll = signal_clearAll;
  window.signal_renderDayCards = signal_renderDayCards; CL.warrants.signal_renderDayCards = signal_renderDayCards;
  CL._registerModule('warrants/signal-tmc');
})();
