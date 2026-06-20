/**
 * CL studies.trafficData — Traffic Data Collection tab (single cohesive module).
 * Extracted verbatim from app/index.html. Size-exception (~2072 lines) by design:
 * the band carries module-private mutable state (trafficdataReviewQueue,
 * trafficdataCurrentReviewIndex, etc.) shared across its functions, so it stays
 * one IIFE rather than a state-mirrored split. NO behavior change. Functions
 * dual-exposed window.<fn> + CL.studies.trafficData.<fn> (onclick + cross-calls);
 * the 6 trafficdata* state vars remain module-private (no external refs).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
/**
 * Initialize Traffic Data Entry tab when shown
 */
function trafficdata_onTabShow() {
    console.log('[Traffic Data] Tab shown, initializing...');

    // Initialize TMC table
    trafficdata_renderTmcTable();

    // Update day counts
    trafficdata_updateDayCounts();

    // Update study readiness dashboard
    trafficdata_updateReadiness();

    // Load any saved data
    trafficdata_loadSavedData();

    // Sync location from other warrant selections if available
    if (warrantsState.selectedLocation && !warrantsState.trafficData.config.locationName) {
        trafficdata_syncFromWarrantSelection();
    }

    // Sync crash profile display if location is selected
    // Uses mismatch-detection pattern from signal_autoPopulateWarrant7 to ensure
    // crash data is always shown correctly when visiting Traffic Data tab
    if (warrantsState.selectedLocation && warrantsState.locationCrashes && warrantsState.locationCrashes.length > 0) {
        filterWarrantCrashesByDate();

        // Always ensure crash profile and UI are in sync with filtered crashes
        const profileTotal = warrantsState.crashProfile?.total || 0;
        const filteredCount = warrantsState.filteredCrashes?.length || 0;
        if (!warrantsState.crashProfile || profileTotal !== filteredCount) {
            console.log('[Traffic Data] Syncing crash profile display:', { profileTotal, filteredCount });
            const profile = buildWarrantCrashProfile(warrantsState.filteredCrashes);
            warrantsState.crashProfile = profile;
            updateWarrantCrashDisplay(profile);
            updateWarrantDateInfo();
        }

        // Auto-populate the Traffic Data-specific linked crash data panel
        trafficdata_refreshCrashData();
    }
}

/**
 * Update config from UI inputs
 */
function trafficdata_updateConfig() {
    const config = warrantsState.trafficData.config;
    config.locationName = document.getElementById('trafficdataLocationName')?.value || '';
    config.majorStreet = document.getElementById('trafficdataMajorStreet')?.value || '';
    config.minorStreet = document.getElementById('trafficdataMinorStreet')?.value || '';
    config.intersectionType = document.getElementById('trafficdataIntersectionType')?.value || '4leg';
    config.majorDirection = document.getElementById('trafficdataMajorDirection')?.value || 'EW';
    config.analyst = document.getElementById('trafficdataAnalyst')?.value || '';

    // Update street name displays in Speed section
    document.getElementById('trafficdataSpeedMajorName').textContent = config.majorStreet || '--';
    document.getElementById('trafficdataSpeedMinorName').textContent = config.minorStreet || '--';

    // Mark as dirty
    warrantsState.trafficData.isDirty = true;

    // Update readiness
    trafficdata_updateReadiness();
}

/**
 * Sync location from warrant selection state
 */
function trafficdata_syncFromWarrantSelection() {
    if (!warrantsState.selectedLocation) return;

    const displayName = warrantsState.displayName || warrantsState.selectedLocation;
    document.getElementById('trafficdataLocationName').value = displayName;
    warrantsState.trafficData.config.locationName = displayName;

    // Parse and sync street names from displayName (supports ' & ', ' @ ', ' AT ' separators)
    let streets = [];
    if (displayName.includes(' & ')) streets = displayName.split(' & ').map(s => s.trim());
    else if (displayName.includes(' @ ')) streets = displayName.split(' @ ').map(s => s.trim());
    else if (displayName.toLowerCase().includes(' at ')) streets = displayName.split(/ at /i).map(s => s.trim());

    if (streets.length >= 2) {
        const majorEl = document.getElementById('trafficdataMajorStreet');
        const minorEl = document.getElementById('trafficdataMinorStreet');
        if (majorEl && !majorEl.value) {
            majorEl.value = streets[0];
            warrantsState.trafficData.config.majorStreet = streets[0];
        }
        if (minorEl && !minorEl.value) {
            minorEl.value = streets[1];
            warrantsState.trafficData.config.minorStreet = streets[1];
        }
    }

    // Sync intersection type from road properties
    const props = warrantsState.roadProperties;
    if (props?.intType) {
        const intType = props.intType.toLowerCase();
        const intTypeEl = document.getElementById('trafficdataIntersectionType');
        if (intTypeEl) {
            intTypeEl.value = (intType.includes('3') || intType.includes('t-')) ? '3leg' : '4leg';
        }
    }
}

/**
 * Toggle AI Panel expand/collapse
 */
function trafficdata_toggleAIPanel() {
    const content = document.getElementById('trafficdataAIPanelContent');
    const arrow = document.getElementById('trafficdataAIPanelArrow');
    const toggleText = document.getElementById('trafficdataAIPanelToggleText');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        arrow.textContent = '▲';
        toggleText.textContent = 'Collapse';
    } else {
        content.style.display = 'none';
        arrow.textContent = '▼';
        toggleText.textContent = 'Expand';
    }
}

/**
 * Toggle disclaimer visibility
 */
function trafficdata_toggleDisclaimer() {
    const content = document.getElementById('trafficdataDisclaimerContent');
    const arrow = document.getElementById('trafficdataDisclaimerArrow');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
    arrow.textContent = content.style.display === 'none' ? '▼' : '▲';
}

/**
 * Handle disclaimer checkbox
 */
function trafficdata_handleDisclaimerCheckbox() {
    const checkbox = document.getElementById('trafficdataDisclaimerCheckbox');
    const extractBtn = document.getElementById('trafficdataExtractBtn');
    extractBtn.disabled = !checkbox.checked;
}

/**
 * Set count type (12hr/24hr)
 */
function trafficdata_setCountType(type) {
    warrantsState.trafficData.config.countType = type;
    trafficdata_renderTmcTable();
}

/**
 * Update day slots display
 */
function trafficdata_updateDaySlots() {
    const dayType = document.getElementById('trafficdataDayType')?.value || 'weekday';
    const maxSlots = dayType === 'weekday' ? 5 : 2;

    for (let i = 1; i <= 5; i++) {
        const slot = document.getElementById(`trafficdataSlot${i}`);
        if (slot) {
            slot.style.display = i <= maxSlots ? 'flex' : 'none';
        }
    }
}

/**
 * Toggle collapsible sections
 */
function trafficdata_toggleSection(section) {
    const contentId = `trafficdata${section.charAt(0).toUpperCase() + section.slice(1)}Content`;
    const arrowId = `trafficdata${section.charAt(0).toUpperCase() + section.slice(1)}Arrow`;

    // Map section names to content IDs
    const sectionMap = {
        'tmc': { content: 'trafficdataTmcContent', arrow: 'trafficdataTmcArrow' },
        'pedbike': { content: 'trafficdataPedContent', arrow: 'trafficdataPedArrow' },
        'speed': { content: 'trafficdataSpeedContent', arrow: 'trafficdataSpeedArrow' },
        'conversion': { content: 'trafficdataConversionContent', arrow: 'trafficdataConversionArrow' },
        'geometry': { content: 'trafficdataGeometryContent', arrow: 'trafficdataGeometryArrow' },
        'crashes': { content: 'trafficdataCrashContent', arrow: 'trafficdataCrashArrow' }
    };

    const mapping = sectionMap[section];
    if (!mapping) return;

    const content = document.getElementById(mapping.content);
    const arrow = document.getElementById(mapping.arrow);

    if (content && arrow) {
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        arrow.textContent = isHidden ? '▲' : '▼';
    }
}

/**
 * Render TMC entry table
 */
function trafficdata_renderTmcTable() {
    const container = document.getElementById('trafficdataTmcGrid');
    if (!container) return;

    const countType = warrantsState.trafficData.config.countType || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;
    const majorDir = warrantsState.trafficData.config.majorDirection || 'EW';

    // Determine approach labels based on major direction
    const approaches = majorDir === 'EW'
        ? { major1: 'EB', major2: 'WB', minor1: 'NB', minor2: 'SB' }
        : { major1: 'NB', major2: 'SB', minor1: 'EB', minor2: 'WB' };

    let html = `
    <table style="width:100%;border-collapse:collapse;font-size:.8rem">
    <thead>
    <tr style="background:#ecfdf5">
        <th rowspan="2" style="padding:8px;border:1px solid #a7f3d0;min-width:60px">Hour</th>
        <th colspan="4" style="padding:6px;border:1px solid #a7f3d0;background:#d1fae5;color:#065f46">${approaches.minor1}<br><span style="font-size:.7rem;font-weight:normal">(Minor)</span></th>
        <th colspan="4" style="padding:6px;border:1px solid #a7f3d0;background:#d1fae5;color:#065f46">${approaches.minor2}<br><span style="font-size:.7rem;font-weight:normal">(Minor)</span></th>
        <th colspan="4" style="padding:6px;border:1px solid #a7f3d0;background:#059669;color:white">${approaches.major1}<br><span style="font-size:.7rem;font-weight:normal">(Major)</span></th>
        <th colspan="4" style="padding:6px;border:1px solid #a7f3d0;background:#059669;color:white">${approaches.major2}<br><span style="font-size:.7rem;font-weight:normal">(Major)</span></th>
    </tr>
    <tr style="background:#f0fdf4;font-size:.7rem">
        <th style="padding:4px;border:1px solid #a7f3d0">LT</th>
        <th style="padding:4px;border:1px solid #a7f3d0">T</th>
        <th style="padding:4px;border:1px solid #a7f3d0">RT</th>
        <th style="padding:4px;border:1px solid #a7f3d0;font-weight:bold">Total</th>
        <th style="padding:4px;border:1px solid #a7f3d0">LT</th>
        <th style="padding:4px;border:1px solid #a7f3d0">T</th>
        <th style="padding:4px;border:1px solid #a7f3d0">RT</th>
        <th style="padding:4px;border:1px solid #a7f3d0;font-weight:bold">Total</th>
        <th style="padding:4px;border:1px solid #a7f3d0">LT</th>
        <th style="padding:4px;border:1px solid #a7f3d0">T</th>
        <th style="padding:4px;border:1px solid #a7f3d0">RT</th>
        <th style="padding:4px;border:1px solid #a7f3d0;font-weight:bold">Total</th>
        <th style="padding:4px;border:1px solid #a7f3d0">LT</th>
        <th style="padding:4px;border:1px solid #a7f3d0">T</th>
        <th style="padding:4px;border:1px solid #a7f3d0">RT</th>
        <th style="padding:4px;border:1px solid #a7f3d0;font-weight:bold">Total</th>
    </tr>
    </thead>
    <tbody>`;

    for (let hour = startHour; hour < endHour; hour++) {
        const hourDisplay = hour.toString().padStart(2, '0') + ':00';
        html += `<tr>
            <td style="padding:4px 8px;border:1px solid #a7f3d0;font-weight:500;background:#f0fdf4">${hourDisplay}</td>`;

        // Add input cells for each approach (minor1, minor2, major1, major2)
        ['minor1', 'minor2', 'major1', 'major2'].forEach(app => {
            const dir = approaches[app];
            ['LT', 'T', 'RT'].forEach(move => {
                html += `<td style="padding:2px;border:1px solid #a7f3d0">
                    <input type="number" id="tmc_${hour}_${dir}_${move}" class="warrant-input"
                           style="width:40px;text-align:center;padding:2px;font-size:.8rem"
                           min="0" value="0" oninput="trafficdata_updateTmcTotals(${hour},'${dir}')">
                </td>`;
            });
            html += `<td id="tmc_${hour}_${dir}_total" style="padding:4px;border:1px solid #a7f3d0;font-weight:bold;background:#ecfdf5;text-align:center">0</td>`;
        });

        html += `</tr>`;
    }

    html += `</tbody></table>`;
    container.innerHTML = html;
}

/**
 * Update TMC totals for a specific hour and direction
 */
function trafficdata_updateTmcTotals(hour, direction) {
    const lt = parseInt(document.getElementById(`tmc_${hour}_${direction}_LT`)?.value) || 0;
    const t = parseInt(document.getElementById(`tmc_${hour}_${direction}_T`)?.value) || 0;
    const rt = parseInt(document.getElementById(`tmc_${hour}_${direction}_RT`)?.value) || 0;
    const total = lt + t + rt;

    const totalCell = document.getElementById(`tmc_${hour}_${direction}_total`);
    if (totalCell) {
        totalCell.textContent = total;
    }

    warrantsState.trafficData.isDirty = true;
}

/**
 * Set TMC count type
 */
function trafficdata_setTmcCountType(type) {
    warrantsState.trafficData.config.countType = type;

    // Update button styles
    const btn12 = document.getElementById('trafficdataTmc12hrBtn');
    const btn24 = document.getElementById('trafficdataTmc24hrBtn');

    if (type === '12hr') {
        btn12.style.background = '#10b981';
        btn12.style.color = 'white';
        btn12.classList.remove('btn-outline');
        btn24.style.background = '';
        btn24.style.color = '';
        btn24.classList.add('btn-outline');
    } else {
        btn24.style.background = '#10b981';
        btn24.style.color = 'white';
        btn24.classList.remove('btn-outline');
        btn12.style.background = '';
        btn12.style.color = '';
        btn12.classList.add('btn-outline');
    }

    trafficdata_renderTmcTable();
}

/**
 * Update TMC date and auto-set day of week
 */
function trafficdata_updateTmcDate() {
    const dateInput = document.getElementById('trafficdataTmcDate');
    const dowSelect = document.getElementById('trafficdataTmcDayOfWeek');

    if (dateInput?.value) {
        const date = new Date(dateInput.value);
        const dow = date.getDay();
        dowSelect.value = dow;
    }
}

/**
 * Add TMC day to multi-day data
 * Handles review mode: after confirming, advances to next item in queue
 */
function trafficdata_addTmcDay() {
    const dateInput = document.getElementById('trafficdataTmcDate');
    const dowSelect = document.getElementById('trafficdataTmcDayOfWeek');

    if (!dateInput?.value) {
        showToast('Please enter a count date', 'warning');
        return;
    }

    const dateKey = `day_${dateInput.value}`;
    const countType = warrantsState.trafficData.config.countType || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;

    // Collect hourly data from inputs
    const hourlyData = {};
    for (let hour = startHour; hour < endHour; hour++) {
        hourlyData[hour] = {};
        ['NB', 'SB', 'EB', 'WB'].forEach(dir => {
            const lt = parseInt(document.getElementById(`tmc_${hour}_${dir}_LT`)?.value) || 0;
            const t = parseInt(document.getElementById(`tmc_${hour}_${dir}_T`)?.value) || 0;
            const rt = parseInt(document.getElementById(`tmc_${hour}_${dir}_RT`)?.value) || 0;
            hourlyData[hour][dir] = { LT: lt, T: t, RT: rt, total: lt + t + rt };
        });
    }

    // Save to state
    warrantsState.trafficData.tmcData.multiDayData[dateKey] = {
        date: dateInput.value,
        dayOfWeek: parseInt(dowSelect?.value) || 2,
        countType: countType,
        hourlyData: hourlyData
    };

    // Update counts
    warrantsState.trafficData.tmcData.daysEntered = Object.keys(warrantsState.trafficData.tmcData.multiDayData).length;

    // Update UI
    trafficdata_updateDayCounts();
    trafficdata_updateReadiness();
    trafficdata_showDaysSummary();

    showToast(`TMC data for ${dateInput.value} added successfully`, 'success');

    // Handle review mode - advance to next item or exit
    if (trafficdataIsReviewMode) {
        trafficdataCurrentReviewIndex++;
        trafficdata_clearTmcForm();

        if (trafficdataCurrentReviewIndex >= trafficdataReviewQueue.length) {
            // All items reviewed
            trafficdata_exitReviewMode();
            const statusEl = document.getElementById('trafficdataExtractionStatus');
            if (statusEl) {
                statusEl.innerHTML = '<span style="color:#22c55e">✅ All extractions reviewed and added!</span>';
            }
        } else {
            // Load next item
            trafficdata_loadCurrentReviewData();
        }
    }
}

/**
 * Clear TMC form
 */
function trafficdata_clearTmcForm() {
    const countType = warrantsState.trafficData.config.countType || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;

    for (let hour = startHour; hour < endHour; hour++) {
        ['NB', 'SB', 'EB', 'WB'].forEach(dir => {
            ['LT', 'T', 'RT'].forEach(move => {
                const input = document.getElementById(`tmc_${hour}_${dir}_${move}`);
                if (input) input.value = '0';
            });
            const total = document.getElementById(`tmc_${hour}_${dir}_total`);
            if (total) total.textContent = '0';
        });
    }

    document.getElementById('trafficdataTmcDate').value = '';
}

/**
 * Show days summary
 */
function trafficdata_showDaysSummary() {
    const summary = document.getElementById('trafficdataTmcDaysSummary');
    const list = document.getElementById('trafficdataTmcDaysList');
    const data = warrantsState.trafficData.tmcData.multiDayData;

    if (Object.keys(data).length === 0) {
        summary.style.display = 'none';
        return;
    }

    summary.style.display = 'block';

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = '<table style="width:100%;font-size:.85rem;border-collapse:collapse">';
    html += '<tr style="background:#f1f5f9"><th style="padding:6px;text-align:left">Date</th><th style="padding:6px">Day</th><th style="padding:6px">Type</th><th style="padding:6px">Total Vol</th><th style="padding:6px">Actions</th></tr>';

    Object.entries(data).forEach(([key, day]) => {
        const totalVol = calculateDayTotalVolume(day.hourlyData);
        html += `<tr>
            <td style="padding:6px;border-top:1px solid #e2e8f0">${day.date}</td>
            <td style="padding:6px;border-top:1px solid #e2e8f0;text-align:center">${dayNames[day.dayOfWeek]}</td>
            <td style="padding:6px;border-top:1px solid #e2e8f0;text-align:center">${day.countType}</td>
            <td style="padding:6px;border-top:1px solid #e2e8f0;text-align:center;font-weight:500">${totalVol.toLocaleString()}</td>
            <td style="padding:6px;border-top:1px solid #e2e8f0;text-align:center">
                <button class="btn btn-sm btn-outline" onclick="trafficdata_editDay('${key}')" style="padding:2px 8px;font-size:.75rem">Edit</button>
                <button class="btn btn-sm" onclick="trafficdata_deleteDay('${key}')" style="padding:2px 8px;font-size:.75rem;background:#dc2626;color:white;border:none">×</button>
            </td>
        </tr>`;
    });

    html += '</table>';
    list.innerHTML = html;
}

/**
 * Calculate total volume for a day
 */
function calculateDayTotalVolume(hourlyData) {
    let total = 0;
    Object.values(hourlyData).forEach(hour => {
        Object.values(hour).forEach(dir => {
            if (typeof dir === 'object' && dir.total) {
                total += dir.total;
            }
        });
    });
    return total;
}

/**
 * Delete a TMC day
 */
function trafficdata_deleteDay(key) {
    if (confirm('Delete this count day?')) {
        delete warrantsState.trafficData.tmcData.multiDayData[key];
        warrantsState.trafficData.tmcData.daysEntered = Object.keys(warrantsState.trafficData.tmcData.multiDayData).length;
        trafficdata_updateDayCounts();
        trafficdata_updateReadiness();
        trafficdata_showDaysSummary();
        showToast('Count day deleted', 'info');
    }
}

/**
 * Update day count indicators
 */
function trafficdata_updateDayCounts() {
    const tmcDays = Object.keys(warrantsState.trafficData.tmcData.multiDayData).length;
    const pedDays = Object.keys(warrantsState.trafficData.pedBikeData.multiDayData).length;

    document.getElementById('trafficdataTmcDaysCount').textContent = `${tmcDays} day${tmcDays !== 1 ? 's' : ''}`;
    document.getElementById('trafficdataPedDaysCount').textContent = `${pedDays} day${pedDays !== 1 ? 's' : ''}`;
    document.getElementById('trafficDataDaysIndicator').textContent = `${tmcDays} days entered`;

    // Update speed status
    const hasSpeed = warrantsState.trafficData.speedData.majorStreet.percentile85 !== null;
    const speedStatus = document.getElementById('trafficdataSpeedStatus');
    if (hasSpeed) {
        speedStatus.textContent = 'Entered';
        speedStatus.style.background = '#dcfce7';
        speedStatus.style.color = '#166534';
    }
}

/**
 * Update pedestrian counts
 */
function trafficdata_updatePedCounts() {
    warrantsState.trafficData.isDirty = true;
    trafficdata_updateReadiness();
}

/**
 * Add pedestrian count day
 */
function trafficdata_addPedDay() {
    const pedMajor = parseInt(document.getElementById('trafficdataPedCrossingMajor')?.value) || 0;
    const pedMinor = parseInt(document.getElementById('trafficdataPedCrossingMinor')?.value) || 0;
    const bikeCount = parseInt(document.getElementById('trafficdataBikeCount')?.value) || 0;
    const schoolChildren = parseInt(document.getElementById('trafficdataSchoolChildren')?.value) || 0;

    if (pedMajor === 0 && pedMinor === 0 && bikeCount === 0) {
        showToast('Please enter pedestrian or bicycle counts', 'warning');
        return;
    }

    const dateKey = `day_${new Date().toISOString().split('T')[0]}`;

    warrantsState.trafficData.pedBikeData.multiDayData[dateKey] = {
        date: new Date().toISOString().split('T')[0],
        pedCrossingMajor: pedMajor,
        pedCrossingMinor: pedMinor,
        bikeCount: bikeCount,
        schoolChildren: schoolChildren,
        elderlyDisabled: parseInt(document.getElementById('trafficdataElderlyDisabled')?.value) || 0
    };

    warrantsState.trafficData.pedBikeData.daysEntered = Object.keys(warrantsState.trafficData.pedBikeData.multiDayData).length;

    trafficdata_updateDayCounts();
    trafficdata_updateReadiness();

    showToast('Pedestrian count data added', 'success');
}

/**
 * Save speed data
 */
function trafficdata_saveSpeedData() {
    warrantsState.trafficData.speedData.majorStreet = {
        postedLimit: parseInt(document.getElementById('trafficdataMajorPosted')?.value) || 35,
        percentile85: parseFloat(document.getElementById('trafficdataMajor85th')?.value) || null,
        averageSpeed: parseFloat(document.getElementById('trafficdataMajorAvg')?.value) || null,
        sampleSize: parseInt(document.getElementById('trafficdataMajorSample')?.value) || 0,
        studyDate: new Date().toISOString().split('T')[0]
    };

    warrantsState.trafficData.speedData.minorStreet = {
        postedLimit: parseInt(document.getElementById('trafficdataMinorPosted')?.value) || 25,
        percentile85: parseFloat(document.getElementById('trafficdataMinor85th')?.value) || null,
        averageSpeed: parseFloat(document.getElementById('trafficdataMinorAvg')?.value) || null,
        sampleSize: parseInt(document.getElementById('trafficdataMinorSample')?.value) || 0,
        studyDate: new Date().toISOString().split('T')[0]
    };

    trafficdata_updateDayCounts();
    trafficdata_updateReadiness();

    showToast('Speed data saved', 'success');
}

/**
 * Update study readiness dashboard
 */
function trafficdata_updateReadiness() {
    const td = warrantsState.trafficData;

    // Signal Warrant readiness
    const signalReqs = ['tmcData', 'pedData', 'crashData'];
    let signalPct = 0;
    let signalMissing = [];

    if (Object.keys(td.tmcData.multiDayData).length > 0) signalPct += 50;
    else signalMissing.push('TMC data');

    if (td.config.locationName) signalPct += 25;
    else signalMissing.push('Location');

    if (td.crashData.totalCrashes > 0 || td.crashData.linkedNodeId) signalPct += 25;
    else signalMissing.push('Crash data');

    updateReadinessBar('Signal', signalPct, signalMissing);

    // Stop Sign readiness
    let stopPct = 0;
    let stopMissing = [];

    if (Object.keys(td.tmcData.multiDayData).length > 0) stopPct += 60;
    else stopMissing.push('Volume data');

    if (td.config.locationName) stopPct += 20;
    else stopMissing.push('Location');

    if (td.geometry.existingControl) stopPct += 20;
    else stopMissing.push('Existing control');

    updateReadinessBar('Stop', stopPct, stopMissing);

    // Pedestrian Crossing readiness
    let pedPct = 0;
    let pedMissing = [];

    if (Object.keys(td.pedBikeData.multiDayData).length > 0 || td.pedBikeData.aggregates.peakHourPedVolume > 0) pedPct += 40;
    else pedMissing.push('Ped counts');

    if (td.speedData.majorStreet.percentile85) pedPct += 30;
    else pedMissing.push('Speed data');

    if (td.tmcData.aggregates.majorStreetAADT) pedPct += 30;
    else pedMissing.push('AADT');

    updateReadinessBar('Ped', pedPct, pedMissing);

    // Roundabout readiness
    let roundPct = 0;
    let roundMissing = [];

    if (Object.keys(td.tmcData.multiDayData).length > 0) roundPct += 50;
    else roundMissing.push('TMC data');

    if (td.config.locationName) roundPct += 25;
    else roundMissing.push('Location');

    if (td.geometry.majorLanes) roundPct += 25;
    else roundMissing.push('Geometry');

    updateReadinessBar('Round', roundPct, roundMissing);

    // Speed Study readiness
    let speedPct = 0;
    let speedMissing = [];

    if (td.speedData.majorStreet.percentile85) speedPct += 50;
    else speedMissing.push('85th percentile');

    if (td.speedData.majorStreet.sampleSize >= 100) speedPct += 30;
    else speedMissing.push('Sample size (min 100)');

    if (td.config.locationName) speedPct += 20;
    else speedMissing.push('Location');

    updateReadinessBar('Speed', speedPct, speedMissing);
}

/**
 * Helper to update readiness bar
 */
function updateReadinessBar(study, pct, missing) {
    const bar = document.getElementById(`trafficdata${study}Bar`);
    const pctLabel = document.getElementById(`trafficdata${study}Pct`);
    const missingLabel = document.getElementById(`trafficdata${study}Missing`);

    if (bar) {
        bar.style.width = `${pct}%`;
        bar.style.background = pct >= 100 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';
    }
    if (pctLabel) {
        pctLabel.textContent = `${pct}%`;
        if (pct >= 100) pctLabel.textContent += ' ✓';
    }
    if (missingLabel) {
        missingLabel.textContent = missing.length > 0 ? `Missing: ${missing.join(', ')}` : '';
        missingLabel.style.color = missing.length > 0 ? '#dc2626' : '#22c55e';
    }
}

/**
 * Conversion: TMC to Totals
 */
function trafficdata_convertTmcToTotals() {
    const tmcData = warrantsState.trafficData.tmcData.multiDayData;
    if (Object.keys(tmcData).length === 0) {
        showToast('Enter TMC data first', 'warning');
        return;
    }

    // Calculate peak hour totals from first day
    const firstDay = Object.values(tmcData)[0];
    const majorDir = warrantsState.trafficData.config.majorDirection || 'EW';
    const majorApps = majorDir === 'EW' ? ['EB', 'WB'] : ['NB', 'SB'];
    const minorApps = majorDir === 'EW' ? ['NB', 'SB'] : ['EB', 'WB'];

    let maxMajor = 0, maxMinor = 0, peakHour = null;

    Object.entries(firstDay.hourlyData).forEach(([hour, data]) => {
        let majorTotal = 0, minorTotal = 0;
        majorApps.forEach(dir => majorTotal += data[dir]?.total || 0);
        minorApps.forEach(dir => minorTotal += data[dir]?.total || 0);

        if (majorTotal + minorTotal > maxMajor + maxMinor) {
            maxMajor = majorTotal;
            maxMinor = minorTotal;
            peakHour = hour;
        }
    });

    warrantsState.trafficData.tmcData.aggregates.majorStreetPeakHour = maxMajor;
    warrantsState.trafficData.tmcData.aggregates.minorStreetPeakHour = maxMinor;
    warrantsState.trafficData.tmcData.aggregates.intersectionTotal = maxMajor + maxMinor;

    const resultDiv = document.getElementById('trafficdataTmcTotalsResult');
    resultDiv.innerHTML = `
        <div style="color:#065f46">
            <strong>Peak Hour:</strong> ${peakHour}:00<br>
            <strong>Major Street:</strong> ${maxMajor.toLocaleString()} vph ○<br>
            <strong>Minor Street:</strong> ${maxMinor.toLocaleString()} vph ○<br>
            <strong>Total:</strong> ${(maxMajor + maxMinor).toLocaleString()} vph
        </div>`;

    trafficdata_updateReadiness();
    showToast('TMC totals calculated', 'success');
}

/**
 * Conversion: Peak Hour to AADT
 */
function trafficdata_convertPeakToAADT() {
    const majorPeak = warrantsState.trafficData.tmcData.aggregates.majorStreetPeakHour;
    const minorPeak = warrantsState.trafficData.tmcData.aggregates.minorStreetPeakHour;

    if (!majorPeak && !minorPeak) {
        showToast('Calculate TMC totals first', 'warning');
        return;
    }

    const kFactor = parseFloat(document.getElementById('trafficdataKFactor')?.value) || 0.095;
    const dFactor = parseFloat(document.getElementById('trafficdataDFactor')?.value) || 0.55;

    const majorAADT = Math.round(majorPeak / kFactor / dFactor);
    const minorAADT = Math.round(minorPeak / kFactor / dFactor);

    warrantsState.trafficData.tmcData.aggregates.majorStreetAADT = majorAADT;
    warrantsState.trafficData.tmcData.aggregates.minorStreetAADT = minorAADT;
    warrantsState.trafficData.tmcData.aggregates.aadtSource = 'estimated';

    const resultDiv = document.getElementById('trafficdataAADTResult');
    resultDiv.innerHTML = `
        <div style="color:#065f46">
            <strong>Major Street AADT:</strong> ${majorAADT.toLocaleString()} vpd △<br>
            <strong>Minor Street AADT:</strong> ${minorAADT.toLocaleString()} vpd △<br>
            <span style="font-size:.75rem;color:#64748b">(K=${kFactor}, D=${dFactor})</span>
        </div>`;

    trafficdata_updateReadiness();
    showToast('AADT estimated', 'success');
}

/**
 * Calculate roundabout volumes from TMC
 */
function trafficdata_calcRoundaboutVolumes() {
    const tmcData = warrantsState.trafficData.tmcData.multiDayData;
    if (Object.keys(tmcData).length === 0) {
        showToast('Enter TMC data first', 'warning');
        return;
    }

    // For roundabout, we need entry and circulating volumes
    // Entry = LT + T + RT for each approach
    // Circulating = Sum of conflicting movements

    const resultDiv = document.getElementById('trafficdataRoundaboutResult');
    resultDiv.innerHTML = `
        <div style="color:#065f46">
            <strong>Entry Volumes (Peak Hour):</strong><br>
            Calculated from TMC data. Go to Roundabout Analysis for detailed capacity analysis.
        </div>`;

    showToast('Roundabout volumes ready', 'success');
}

/**
 * Refresh crash data from crash state
 */
function trafficdata_refreshCrashData() {
    const location = warrantsState.selectedLocation || warrantsState.trafficData.config.locationName;

    if (!location) {
        showToast('Select a location first', 'warning');
        return;
    }

    // Use date-filtered crashes for consistency with other warrant sub-tabs
    const crashes = warrantsState.filteredCrashes?.length > 0 ? warrantsState.filteredCrashes : (warrantsState.locationCrashes || []);

    if (crashes.length > 0) {
        // Use the warrant crash profile for consistent data across all sub-tabs
        const profile = warrantsState.crashProfile || buildWarrantCrashProfile(crashes);

        warrantsState.trafficData.crashData = {
            linkedNodeId: location,
            analysisPeriod: 3,
            totalCrashes: profile.total || crashes.length,
            severityBreakdown: profile.severity || { K: 0, A: 0, B: 0, C: 0, O: 0 },
            epdoScore: profile.epdo || 0,
            correctableCrashes: Math.round(crashes.length * 0.7),
            topCrashTypes: Object.entries(profile.collisionTypes || {}).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([type, count]) => ({ type, count })),
            autoPopulated: true,
            lastUpdated: new Date().toISOString()
        };

        // Update crash count badge
        document.getElementById('trafficdataCrashCount').textContent = `${crashes.length} crashes`;
        document.getElementById('trafficdataCrashCount').style.background = '#dcfce7';
        document.getElementById('trafficdataCrashCount').style.color = '#166534';

        // Update crash summary
        const summary = document.getElementById('trafficdataCrashSummary');
        summary.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:1rem;margin-bottom:1rem">
                <div style="text-align:center;padding:12px;background:#fee2e2;border-radius:8px">
                    <div style="font-size:1.5rem;font-weight:bold;color:#991b1b">${crashes.length}</div>
                    <div style="font-size:.8rem;color:#991b1b">Total Crashes</div>
                </div>
                <div style="text-align:center;padding:12px;background:#fef3c7;border-radius:8px">
                    <div style="font-size:1.5rem;font-weight:bold;color:#92400e">${profile.epdo || 0}</div>
                    <div style="font-size:.8rem;color:#92400e">EPDO Score</div>
                </div>
            </div>
            <button class="btn btn-sm" onclick="trafficdata_refreshCrashData()" style="background:#3b82f6;color:white;border:none">🔄 Refresh</button>
        `;

        trafficdata_updateReadiness();
        showToast(`Linked ${crashes.length} crashes`, 'success');
    } else {
        showToast('No crash data found for this location', 'info');
    }
}

/**
 * New study - clear all data
 */
function trafficdata_newStudy() {
    if (!confirm('Clear all traffic data and start a new study?')) return;

    // Reset state
    warrantsState.trafficData = {
        config: { locationName: '', majorStreet: '', minorStreet: '', intersectionType: '4leg', majorDirection: 'EW', countType: '12hr', studyDate: null, analyst: '', dataSource: 'manual' },
        tmcData: { multiDayData: {}, averagingMethod: 'tue-wed-thu', daysEntered: 0, peakHourAM: null, peakHourPM: null, aggregates: { majorStreetPeakHour: 0, minorStreetPeakHour: 0, intersectionTotal: 0, majorStreetAADT: null, minorStreetAADT: null, aadtSource: null } },
        pedBikeData: { multiDayData: {}, daysEntered: 0, hourlyPedCounts: {}, hourlyBikeCounts: {}, peakPedHour: null, specialCounts: { schoolChildren: 0, elderlyDisabled: 0, wheelchairUsers: 0 }, aggregates: { peakHourPedVolume: 0, dailyPedVolume: 0, peakHourBikeVolume: 0 } },
        speedData: { multiDayData: {}, daysEntered: 0, majorStreet: { postedLimit: 35, percentile85: null, averageSpeed: null, sampleSize: 0, studyDate: null }, minorStreet: { postedLimit: 25, percentile85: null, averageSpeed: null, sampleSize: 0, studyDate: null } },
        geometry: { majorLanes: 2, minorLanes: 2, medianType: 'none', sightDistance: 'adequate', sightDistanceNotes: '', grade: 0, existingControl: 'none', distanceToNearestSignal: null, existingCrosswalks: { north: false, south: false, east: false, west: false } },
        specialConditions: { schoolZone: false, schoolName: '', hospitalNearby: false, seniorCenter: false, transitStop: false, emergencyRoute: false, railroadCrossing: false, highPedGenerator: false, communityInput: { residentComplaints: false, petitionSubmitted: false, councilRequest: false }, notes: '' },
        crashData: { linkedNodeId: null, analysisPeriod: 3, totalCrashes: 0, severityBreakdown: { K: 0, A: 0, B: 0, C: 0, O: 0 }, epdoScore: 0, correctableCrashes: 0, topCrashTypes: [], autoPopulated: true, lastUpdated: null },
        conversionFactors: { kFactor: 0.095, dFactor: 0.55, areaType: 'suburban' },
        aiExtraction: { uploadedFiles: {}, extractedData: null, extractionStatus: 'idle', pendingExtractions: [], reviewQueue: [], isReviewMode: false, currentReviewIndex: 0, detectedDocumentType: null },
        studyReadiness: { signalWarrant: { ready: false, missing: [], pctComplete: 0 }, stopSign: { ready: false, missing: [], pctComplete: 0 }, pedCrossing: { ready: false, missing: [], pctComplete: 0 }, roundabout: { ready: false, missing: [], pctComplete: 0 }, speedStudy: { ready: false, missing: [], pctComplete: 0 } },
        savedStudies: [], currentStudyId: null, lastSaved: null, isDirty: false
    };

    // Clear UI
    document.getElementById('trafficdataLocationName').value = '';
    document.getElementById('trafficdataMajorStreet').value = '';
    document.getElementById('trafficdataMinorStreet').value = '';

    trafficdata_renderTmcTable();
    trafficdata_updateDayCounts();
    trafficdata_updateReadiness();

    showToast('New study started', 'info');
}

/**
 * Save study to storage
 */
function trafficdata_saveStudy() {
    const studyId = warrantsState.trafficData.currentStudyId || `study_${Date.now()}`;
    warrantsState.trafficData.currentStudyId = studyId;
    warrantsState.trafficData.lastSaved = new Date().toISOString();
    warrantsState.trafficData.isDirty = false;

    // Save to localStorage
    try {
        const savedStudies = safeJsonParse(localStorage.getItem('trafficDataStudies'), {});
        savedStudies[studyId] = {
            id: studyId,
            name: warrantsState.trafficData.config.locationName || 'Untitled Study',
            savedAt: warrantsState.trafficData.lastSaved,
            data: warrantsState.trafficData
        };
        localStorage.setItem('trafficDataStudies', JSON.stringify(savedStudies));

        showToast('Study saved successfully', 'success');
    } catch (e) {
        console.error('Error saving study:', e);
        showToast('Error saving study', 'error');
    }
}

/**
 * Export study to JSON
 */
function trafficdata_exportStudy() {
    const data = JSON.stringify(warrantsState.trafficData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traffic_study_${warrantsState.trafficData.config.locationName || 'export'}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Study exported', 'success');
}

/**
 * Load study (placeholder)
 */
function trafficdata_loadStudy() {
    showToast('Load study dialog - coming soon', 'info');
}

/**
 * Load saved data on tab show
 */
function trafficdata_loadSavedData() {
    // Placeholder for loading from IndexedDB
    console.log('[Traffic Data] Loading saved data...');
}

// ========== AI EXTRACTION FUNCTIONS ==========

// State for AI extraction
let trafficdataPendingExtractions = [];
let trafficdataAllValidationResults = [];
let trafficdataUploadedFiles = {};
let trafficdataReviewQueue = [];
let trafficdataCurrentReviewIndex = 0;
let trafficdataIsReviewMode = false;

/**
 * Handle file selection for AI extraction
 */
function trafficdata_onFilesSelected(files) {
    if (!files || files.length === 0) return;

    const apiKey = getCMFAIApiKey();
    const extractBtn = document.getElementById('trafficdataExtractBtn');
    const statusEl = document.getElementById('trafficdataExtractionStatus');

    console.log('[Traffic Data] Files selected:', files.length);

    // Update status
    if (statusEl) {
        statusEl.innerHTML = `<span style="color:#10b981">📁 ${files.length} file(s) selected. Click "Extract & Validate" to process.</span>`;
    }

    // Check for API key
    if (!apiKey) {
        trafficdata_showAPIKeyWarning();
        if (extractBtn) {
            extractBtn.disabled = true;
            extractBtn.title = 'Please configure your API key in the header first';
        }
        if (statusEl) {
            statusEl.innerHTML = `<span style="color:#f59e0b">⚠️ API key required - configure in header bar.</span>`;
        }
        return;
    }

    // Check disclaimer checkbox
    const disclaimerChecked = document.getElementById('trafficdataDisclaimerCheckbox')?.checked;
    if (extractBtn) {
        extractBtn.disabled = !disclaimerChecked;
        extractBtn.title = disclaimerChecked ? 'Click to extract data using AI' : 'Please agree to terms first';
    }
}

/**
 * Show API key warning popup
 */
function trafficdata_showAPIKeyWarning() {
    const overlay = document.createElement('div');
    overlay.id = 'trafficdataAPIKeyWarningOverlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center';

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
        <button onclick="document.getElementById('trafficdataAPIKeyWarningOverlay').remove()"
                style="background:#10b981;color:white;border:none;padding:10px 24px;border-radius:6px;font-size:.95rem;cursor:pointer;font-weight:500">
            Got it
        </button>
    `;

    overlay.appendChild(popup);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
}

/**
 * Main AI extraction function with document type detection
 */
async function trafficdata_extractAllWithAI() {
    const fileInput = document.getElementById('trafficdataBulkFileInput');
    if (!fileInput || fileInput.files.length === 0) {
        showToast('Please upload files first', 'warning');
        return;
    }

    const apiKey = getCMFAIApiKey();
    if (!apiKey) {
        trafficdata_showAPIKeyWarning();
        return;
    }

    const files = fileInput.files;
    const countType = warrantsState.trafficData.config.countType || '12hr';
    const expectedHours = countType === '24hr' ? 24 : 12;

    console.log(`[Traffic Data] Starting extraction with ${files.length} file(s), Count Type: ${countType}`);

    // Get UI elements
    const statusEl = document.getElementById('trafficdataExtractionStatus');
    const progressDiv = document.getElementById('trafficdataExtractionProgress');
    const progressFill = document.getElementById('trafficdataProgressFill');
    const progressText = document.getElementById('trafficdataProgressText');
    const validationPanel = document.getElementById('trafficdataValidationPanel');
    const validationResults = document.getElementById('trafficdataValidationResults');
    const previewPanel = document.getElementById('trafficdataDataPreviewPanel');
    const previewDiv = document.getElementById('trafficdataDataPreview');
    const docTypeLabel = document.getElementById('trafficdataDocTypeLabel');

    // Reset state
    trafficdataPendingExtractions = [];
    trafficdataAllValidationResults = [];
    trafficdataUploadedFiles = {};

    // Store files
    for (let i = 0; i < files.length; i++) {
        trafficdataUploadedFiles[i + 1] = files[i];
    }

    // Show progress
    progressDiv.classList.remove('hidden');
    validationPanel.style.display = 'none';
    previewPanel.style.display = 'none';

    let processedCount = 0;
    const totalFiles = files.length;

    // Process each file
    for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const slotNum = i + 1;

        progressText.textContent = `Processing file ${slotNum}/${totalFiles}: ${file.name}...`;
        progressFill.style.width = `${(processedCount / totalFiles) * 100}%`;

        try {
            const result = await trafficdata_extractSingleFile(apiKey, file, slotNum, expectedHours);

            if (result.success && result.data) {
                const docType = result.data.documentType || 'tmc';
                trafficdataAllValidationResults.push({
                    slot: slotNum,
                    filename: file.name,
                    status: 'success',
                    documentType: docType,
                    message: `Extracted as ${docType.toUpperCase()}`,
                    data: result.data,
                    validation: result.validation
                });

                trafficdataPendingExtractions.push({
                    slot: slotNum,
                    filename: file.name,
                    documentType: docType,
                    ...result.data
                });

            } else {
                trafficdataAllValidationResults.push({
                    slot: slotNum,
                    filename: file.name,
                    status: 'error',
                    message: result.error || 'Extraction failed'
                });
            }
        } catch (err) {
            console.error(`[Traffic Data] Error processing ${file.name}:`, err);
            trafficdataAllValidationResults.push({
                slot: slotNum,
                filename: file.name,
                status: 'error',
                message: err.message
            });
        }

        processedCount++;
        progressFill.style.width = `${(processedCount / totalFiles) * 100}%`;
    }

    // Show results
    progressDiv.classList.add('hidden');
    progressText.textContent = 'Processing complete!';

    // Display validation results
    validationPanel.style.display = 'block';
    validationResults.innerHTML = trafficdataAllValidationResults.map(r => `
        <div style="display:flex;align-items:center;gap:8px;padding:8px;background:${r.status === 'success' ? '#ecfdf5' : '#fef2f2'};border-radius:6px;margin-bottom:8px">
            <span style="font-size:1.2rem">${r.status === 'success' ? '✅' : '❌'}</span>
            <div style="flex:1">
                <strong style="font-size:.85rem">${r.filename}</strong>
                <div style="font-size:.8rem;color:${r.status === 'success' ? '#059669' : '#dc2626'}">${r.message}</div>
            </div>
            ${r.documentType ? `<span style="background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:4px;font-size:.75rem">${r.documentType.toUpperCase()}</span>` : ''}
        </div>
    `).join('');

    // Show preview if we have extractions
    if (trafficdataPendingExtractions.length > 0) {
        previewPanel.style.display = 'block';

        // Determine dominant document type
        const docTypes = trafficdataPendingExtractions.map(e => e.documentType);
        const dominantType = docTypes.sort((a, b) =>
            docTypes.filter(v => v === a).length - docTypes.filter(v => v === b).length
        ).pop() || 'tmc';

        docTypeLabel.textContent = dominantType.toUpperCase();
        docTypeLabel.style.background = dominantType === 'tmc' ? '#dcfce7' :
                                         dominantType === 'pedestrian' ? '#dbeafe' :
                                         dominantType === 'speed' ? '#fef3c7' : '#e0e7ff';

        // Show preview of extracted data
        previewDiv.innerHTML = trafficdataPendingExtractions.map(ext => `
            <div style="padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:8px;border-left:4px solid #10b981">
                <div style="font-weight:600;margin-bottom:4px">${ext.filename}</div>
                <div style="font-size:.85rem;color:#64748b">
                    ${ext.documentType === 'tmc' ? `Date: ${ext.date || 'N/A'} | Total Volume: ${ext.extractedTotal?.toLocaleString() || 'N/A'}` :
                      ext.documentType === 'pedestrian' ? `Pedestrians: ${ext.totalPedestrians || 'N/A'} | Cyclists: ${ext.totalCyclists || 'N/A'}` :
                      ext.documentType === 'speed' ? `85th Percentile: ${ext.percentile85 || 'N/A'} mph` :
                      'Data extracted successfully'}
                </div>
            </div>
        `).join('');

        statusEl.innerHTML = `<span style="color:#22c55e">✅ Extracted ${trafficdataPendingExtractions.length} file(s). Click "Review and Edit Data" to proceed.</span>`;
    } else {
        statusEl.innerHTML = `<span style="color:#dc2626">❌ No data could be extracted. Please check file formats.</span>`;
    }
}

/**
 * Extract single file with AI - document type auto-detection
 */
async function trafficdata_extractSingleFile(apiKey, file, slotNum, expectedHours) {
    const fileContent = await trafficdata_readFileContent(file);
    const countType = expectedHours === 24 ? '24hr' : '12hr';
    const hourRange = expectedHours === 24 ? 'all 24 hours (0-23)' : '12 hours from 6 AM to 6 PM (hours 6-17)';

    // Unified extraction prompt with document type detection
    const extractionPrompt = `You are an expert traffic data extraction specialist. Your task is to:
1. DETECT the document type (TMC, Pedestrian, Speed Study, or Combined)
2. EXTRACT all relevant data based on the detected type

DOCUMENT TYPE DETECTION:
- TMC (Turning Movement Count): Look for directional movements (NB, SB, EB, WB), turning movements (Left, Thru, Right)
- Pedestrian Count: Look for pedestrian crossing data, crosswalk counts, cyclist counts
- Speed Study: Look for speed measurements, 85th percentile, average speed, speed limit
- Combined: Contains multiple data types

STEP 1: Identify document type from these indicators:
- TMC: Headers like "NB", "SB", "EB", "WB", "Left", "Thru", "Right", turning movement tables
- Pedestrian: "Pedestrian", "Ped", "Cyclist", "Bike", "Crossing", crosswalk references
- Speed: "Speed", "MPH", "85th percentile", "pace", "sample size"

STEP 2: Extract data according to detected type

FOR TMC DATA:
- Extract intersection name, major/minor streets
- Extract all hourly turning movement volumes for ${hourRange}
- Calculate totals and identify peak hours

FOR PEDESTRIAN DATA:
- Extract crossing volumes by direction/crosswalk
- Identify peak pedestrian hours
- Note any special populations (school children, elderly)

FOR SPEED DATA:
- Extract 85th percentile speed
- Extract average speed
- Extract sample size
- Note posted speed limit

Return ONLY valid JSON:
{
  "documentType": "tmc" | "pedestrian" | "speed" | "combined",
  "confidence": 0-100,
  "date": "YYYY-MM-DD",
  "dayOfWeek": "Monday",

  // For TMC:
  "intersection": "Main St & Oak Ave",
  "majorStreet": "Main St",
  "minorStreet": "Oak Ave",
  "extractedTotal": 19500,
  "hourlyVolumes": { "6": { "NB": {...}, "SB": {...}, "EB": {...}, "WB": {...} }, ... },
  "peakHours": { "am": { "hour": 8, "volume": 1850 }, "pm": { "hour": 17, "volume": 2100 } },

  // For Pedestrian:
  "totalPedestrians": 250,
  "totalCyclists": 45,
  "peakPedHour": 8,
  "crossingVolumes": { "north": 80, "south": 60, "east": 55, "west": 55 },

  // For Speed:
  "percentile85": 42,
  "averageSpeed": 38,
  "postedLimit": 35,
  "sampleSize": 100
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
                system: extractionPrompt,
                messages: [{
                    role: 'user',
                    content: `Extract traffic data from this file. Detect the document type first.\n\nFilename: "${file.name}"\n\nFile content:\n${fileContent.substring(0, 120000)}`
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { success: false, error: errorData.error?.message || `HTTP ${response.status}` };
        }

        const result = await response.json();
        const extractedText = result.content[0].text;

        const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return { success: false, error: 'Could not parse extraction response' };

        let extractedData;
        try {
            extractedData = JSON.parse(jsonMatch[0]);
        } catch (e) {
            return { success: false, error: 'Invalid JSON in extraction response' };
        }

        return { success: true, data: extractedData };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Read file content (supports various formats)
 */
async function trafficdata_readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        if (file.type.includes('image') || file.name.match(/\.(png|jpg|jpeg|gif|bmp)$/i)) {
            reader.onload = () => resolve(`[Image file: ${file.name}]\nBase64 data available for visual analysis.`);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        } else {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(file);
        }
    });
}

/**
 * Clear AI uploads and reset state
 */
function trafficdata_clearAIUploads() {
    trafficdataPendingExtractions = [];
    trafficdataAllValidationResults = [];
    trafficdataUploadedFiles = {};

    const fileInput = document.getElementById('trafficdataBulkFileInput');
    if (fileInput) fileInput.value = '';

    const statusEl = document.getElementById('trafficdataExtractionStatus');
    if (statusEl) statusEl.innerHTML = '<span style="color:#64748b">Ready for file upload</span>';

    document.getElementById('trafficdataValidationPanel').style.display = 'none';
    document.getElementById('trafficdataDataPreviewPanel').style.display = 'none';
    document.getElementById('trafficdataExtractionProgress').classList.add('hidden');

    showToast('AI uploads cleared', 'info');
}

/**
 * Confirm extracted data and enter review mode
 */
function trafficdata_confirmExtractedData() {
    if (trafficdataPendingExtractions.length === 0) {
        showToast('No extracted data to review', 'warning');
        return;
    }

    // Enter review mode
    trafficdataReviewQueue = [...trafficdataPendingExtractions];
    trafficdataCurrentReviewIndex = 0;
    trafficdata_enterReviewMode();

    // Hide preview panel
    document.getElementById('trafficdataDataPreviewPanel').style.display = 'none';
    document.getElementById('trafficdataExtractionStatus').innerHTML = `<span style="color:#10b981">📋 Review ${trafficdataReviewQueue.length} extraction(s) below. Edit values as needed, then confirm each.</span>`;

    trafficdataPendingExtractions = [];
}

/**
 * Enter review mode for extracted data
 */
function trafficdata_enterReviewMode() {
    trafficdataIsReviewMode = true;
    warrantsState.trafficData.aiExtraction.isReviewMode = true;

    // Show review banner
    const banner = document.getElementById('trafficdataReviewModeBanner');
    if (banner) banner.classList.remove('hidden');

    // Expand TMC section
    const tmcContent = document.getElementById('trafficdataTmcContent');
    const tmcArrow = document.getElementById('trafficdataTmcArrow');
    if (tmcContent) tmcContent.style.display = 'block';
    if (tmcArrow) tmcArrow.textContent = '▲';

    // Update button text
    const addDayBtn = document.getElementById('trafficdataAddDayBtn');
    if (addDayBtn) {
        addDayBtn.innerHTML = '✓ Confirm & Add Day';
        addDayBtn.style.background = '#22c55e';
    }

    // Update queue indicator
    trafficdata_updateReviewQueueIndicator();

    // Load first extraction into form
    trafficdata_loadCurrentReviewData();

    // Scroll to TMC section
    if (banner) {
        banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Exit review mode
 */
function trafficdata_exitReviewMode() {
    trafficdataIsReviewMode = false;
    warrantsState.trafficData.aiExtraction.isReviewMode = false;
    trafficdataReviewQueue = [];
    trafficdataCurrentReviewIndex = 0;

    // Hide banner
    const banner = document.getElementById('trafficdataReviewModeBanner');
    if (banner) banner.classList.add('hidden');

    // Reset button
    const addDayBtn = document.getElementById('trafficdataAddDayBtn');
    if (addDayBtn) {
        addDayBtn.innerHTML = '+ Add This Day';
        addDayBtn.style.background = '#10b981';
    }

    // Clear form
    trafficdata_clearTmcForm();

    const statusEl = document.getElementById('trafficdataExtractionStatus');
    if (statusEl) {
        statusEl.innerHTML = '<span style="color:#64748b">Review mode exited. You can still enter data manually.</span>';
    }
}

/**
 * Update review queue indicator
 */
function trafficdata_updateReviewQueueIndicator() {
    const indicator = document.getElementById('trafficdataReviewQueueIndicator');
    const skipBtn = document.getElementById('trafficdataSkipReviewBtn');

    if (indicator) {
        indicator.textContent = `Day ${trafficdataCurrentReviewIndex + 1} of ${trafficdataReviewQueue.length}`;
    }

    if (skipBtn) {
        skipBtn.style.display = trafficdataReviewQueue.length <= 1 ? 'none' : '';
    }
}

/**
 * Load current review data into form
 */
function trafficdata_loadCurrentReviewData() {
    if (trafficdataCurrentReviewIndex >= trafficdataReviewQueue.length) {
        trafficdata_exitReviewMode();
        document.getElementById('trafficdataExtractionStatus').innerHTML = '<span style="color:#22c55e">✅ All extractions reviewed!</span>';
        return;
    }

    const extraction = trafficdataReviewQueue[trafficdataCurrentReviewIndex];
    console.log('[Traffic Data] Loading review data:', extraction);

    // Handle based on document type
    if (extraction.documentType === 'tmc' && extraction.hourlyVolumes) {
        // Load TMC data into form
        if (extraction.date) {
            document.getElementById('trafficdataTmcDate').value = extraction.date;
        }

        // Auto-fill location if available
        if (extraction.intersection) {
            document.getElementById('trafficdataLocationName').value = extraction.intersection;
        }
        if (extraction.majorStreet) {
            document.getElementById('trafficdataMajorStreet').value = extraction.majorStreet;
        }
        if (extraction.minorStreet) {
            document.getElementById('trafficdataMinorStreet').value = extraction.minorStreet;
        }

        // Load hourly volumes into TMC grid
        trafficdata_loadHourlyDataIntoGrid(extraction.hourlyVolumes);

    } else if (extraction.documentType === 'pedestrian') {
        // Expand pedestrian section and load data
        trafficdata_toggleSection('pedbike');
        // Load pedestrian data
        if (extraction.crossingVolumes) {
            console.log('[Traffic Data] Loading pedestrian data:', extraction.crossingVolumes);
        }

    } else if (extraction.documentType === 'speed') {
        // Expand speed section and load data
        trafficdata_toggleSection('speed');
        // Load speed data
        if (extraction.percentile85) {
            const majorSpeedInput = document.getElementById('trafficdataMajor85th');
            if (majorSpeedInput) majorSpeedInput.value = extraction.percentile85;
        }
    }

    trafficdata_updateReviewQueueIndicator();
}

/**
 * Load hourly TMC data into the grid
 * Handles both AI extraction format (left/thru/right) and native format (LT/T/RT)
 */
function trafficdata_loadHourlyDataIntoGrid(hourlyVolumes) {
    if (!hourlyVolumes) return;

    const directions = ['NB', 'SB', 'EB', 'WB'];
    // Map AI extraction keys to grid input IDs
    const movementMap = {
        'left': 'LT', 'thru': 'T', 'right': 'RT',  // AI extraction format
        'LT': 'LT', 'T': 'T', 'RT': 'RT'           // Native format
    };

    Object.entries(hourlyVolumes).forEach(([hour, dirData]) => {
        directions.forEach(dir => {
            if (dirData[dir]) {
                Object.entries(dirData[dir]).forEach(([mov, value]) => {
                    const gridKey = movementMap[mov];
                    if (gridKey && value !== undefined) {
                        const inputId = `tmc_${hour}_${dir}_${gridKey}`;
                        const input = document.getElementById(inputId);
                        if (input) {
                            input.value = value;
                        }
                    }
                });
            }
        });
    });

    // Recalculate totals for all hours
    const countType = warrantsState.trafficData.config.countType || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;
    for (let hour = startHour; hour < endHour; hour++) {
        ['NB', 'SB', 'EB', 'WB'].forEach(dir => {
            trafficdata_updateTmcTotals(hour, dir);
        });
    }
}

/**
 * Skip current review and move to next
 */
function trafficdata_skipCurrentReview() {
    trafficdataCurrentReviewIndex++;
    trafficdata_loadCurrentReviewData();
}

/**
 * Update RT adjustment handler
 */
function trafficdata_updateRtAdjustment() {
    const rtSelect = document.getElementById('trafficdataRtAdjustment');
    const method = rtSelect?.value || 'none';
    console.log('[Traffic Data] RT adjustment method:', method);
    // Apply adjustment to displayed values based on method
    // TODO: Implement actual adjustment calculations
}

/**
 * Edit a specific day from the days list
 */
function trafficdata_editDay(key) {
    const dayData = warrantsState.trafficData.tmcData.multiDayData[key];
    if (!dayData) {
        showToast('Day not found', 'error');
        return;
    }

    // Expand TMC section
    const tmcContent = document.getElementById('trafficdataTmcContent');
    const tmcArrow = document.getElementById('trafficdataTmcArrow');
    if (tmcContent) tmcContent.style.display = 'block';
    if (tmcArrow) tmcArrow.textContent = '▲';

    // Load data into form for editing
    const dateInput = document.getElementById('trafficdataTmcDate');
    if (dateInput) dateInput.value = dayData.date || '';

    // Set day of week if available
    const dowSelect = document.getElementById('trafficdataTmcDayOfWeek');
    if (dowSelect && dayData.dayOfWeek !== undefined) {
        dowSelect.value = dayData.dayOfWeek;
    }

    if (dayData.hourlyData) {
        trafficdata_loadHourlyDataIntoGrid(dayData.hourlyData);
    }

    // Scroll to TMC section
    if (tmcContent) {
        tmcContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showToast(`Loaded ${key} for editing`, 'info');
}

// ============================================================
// TRAFFIC DATA: PUSH TO WARRANT TABS
// Transfer unified traffic data to individual warrant studies
// ============================================================

/**
 * Push Traffic Data to Signal Warrant Tab
 * Transfers TMC data, configuration, and crash data
 */
function trafficdata_pushToSignal() {
    const td = warrantsState.trafficData;

    // Check if there's data to transfer
    if (Object.keys(td.tmcData.multiDayData).length === 0 && !td.config.locationName) {
        showToast('No traffic data to transfer. Enter data first.', 'warning');
        return;
    }

    // Initialize signal state if needed
    warrantsState.signal = warrantsState.signal || {};
    warrantsState.signal.config = warrantsState.signal.config || {};
    warrantsState.signal.multiDayData = warrantsState.signal.multiDayData || {};

    // Transfer configuration
    if (td.config.locationName) {
        warrantsState.signal.config.intersectionName = td.config.locationName;
        const nameEl = document.getElementById('signalIntersectionName');
        if (nameEl) nameEl.value = td.config.locationName;
    }
    if (td.config.majorStreet) {
        warrantsState.signal.config.majorStreet = td.config.majorStreet;
        const el = document.getElementById('signalMajorStreet');
        if (el) el.value = td.config.majorStreet;
    }
    if (td.config.minorStreet) {
        warrantsState.signal.config.minorStreet = td.config.minorStreet;
        const el = document.getElementById('signalMinorStreet');
        if (el) el.value = td.config.minorStreet;
    }

    // Transfer major direction and count type
    warrantsState.signal.config.majorDirection = td.config.majorDirection || 'EW';
    warrantsState.signal.config.countType = td.config.countType || '12hr';

    const majorDirEl = document.getElementById('signalMajorDirection');
    if (majorDirEl) majorDirEl.value = td.config.majorDirection || 'EW';

    const countTypeEl = document.getElementById('signalCountType');
    if (countTypeEl) countTypeEl.value = td.config.countType || '12hr';

    // Transfer geometry
    if (td.geometry.majorLanes) {
        warrantsState.signal.config.majorLanes = td.geometry.majorLanes;
        const el = document.getElementById('signalMajorLanes');
        if (el) el.value = td.geometry.majorLanes;
    }
    if (td.geometry.minorLanes) {
        warrantsState.signal.config.minorLanes = td.geometry.minorLanes;
        const el = document.getElementById('signalMinorLanes');
        if (el) el.value = td.geometry.minorLanes;
    }

    // Transfer speed data
    if (td.speedData.majorStreet.percentile85) {
        const speedLimit = td.speedData.majorStreet.percentile85;
        warrantsState.signal.config.speedLimit = speedLimit;
        const el = document.getElementById('signalSpeedLimit');
        if (el) el.value = speedLimit;

        // Check if 70% reduction should apply
        if (speedLimit > 40) {
            warrantsState.signal.config.apply70pct = true;
            const apply70El = document.getElementById('signalApply70pct');
            if (apply70El) apply70El.checked = true;
        }
    }

    // Transfer TMC multi-day data
    let daysTransferred = 0;
    if (Object.keys(td.tmcData.multiDayData).length > 0) {
        // Transform traffic data format to signal format
        const transformedData = {};

        for (const [key, day] of Object.entries(td.tmcData.multiDayData)) {
            transformedData[key] = {
                date: day.date,
                dow: day.dayOfWeek,
                hourlyData: day.hourlyData
            };
            daysTransferred++;
        }

        warrantsState.signal.multiDayData = transformedData;

        // Update signal UI
        if (typeof signal_renderDayCards === 'function') {
            signal_renderDayCards();
        }

        // Populate first day into TMC grid
        const firstDay = Object.values(transformedData)[0];
        if (firstDay && typeof signal_populateTMCFromDayData === 'function') {
            setTimeout(() => {
                signal_populateTMCFromDayData(firstDay);
            }, 100);
        }
    }

    // Switch to signal tab
    showWarrantStudy('signal');

    if (daysTransferred > 0) {
        showToast(`Transferred ${daysTransferred} day(s) of traffic data to Signal Warrant`, 'success');
    } else {
        showToast('Configuration transferred to Signal Warrant', 'info');
    }
}

/**
 * Push Traffic Data to Stop Sign Warrant Tab
 * Transfers TMC data, configuration, and crash data
 */
function trafficdata_pushToStopSign() {
    const td = warrantsState.trafficData;

    // Check if there's data to transfer
    if (Object.keys(td.tmcData.multiDayData).length === 0 && !td.config.locationName) {
        showToast('No traffic data to transfer. Enter data first.', 'warning');
        return;
    }

    // Initialize stop sign state if needed
    warrantsState.stopsign = warrantsState.stopsign || {};
    warrantsState.stopsign.config = warrantsState.stopsign.config || {};
    warrantsState.stopsign.multiDayData = warrantsState.stopsign.multiDayData || {};

    // Transfer configuration
    if (td.config.locationName) {
        warrantsState.stopsign.config.intersectionName = td.config.locationName;
        const nameEl = document.getElementById('stopIntersectionName');
        if (nameEl) nameEl.value = td.config.locationName;
    }
    if (td.config.majorStreet) {
        warrantsState.stopsign.config.majorStreet = td.config.majorStreet;
        const el = document.getElementById('stopMajorStreet');
        if (el) el.value = td.config.majorStreet;
    }
    if (td.config.minorStreet) {
        warrantsState.stopsign.config.minorStreet = td.config.minorStreet;
        const el = document.getElementById('stopMinorStreet');
        if (el) el.value = td.config.minorStreet;
    }

    // Transfer major direction and count type
    warrantsState.stopsign.config.majorDirection = td.config.majorDirection || 'EW';
    warrantsState.stopsign.config.countType = td.config.countType || '12hr';

    const majorDirEl = document.getElementById('stopsignMajorDirection');
    if (majorDirEl) majorDirEl.value = td.config.majorDirection || 'EW';

    const countTypeEl = document.getElementById('stopsignCountType');
    if (countTypeEl) countTypeEl.value = td.config.countType || '12hr';

    // Transfer speed data (affects 70% reduction threshold)
    if (td.speedData.majorStreet.percentile85) {
        warrantsState.stopsign.config.majorSpeed85th = td.speedData.majorStreet.percentile85;
        const el = document.getElementById('stopMajorSpeed');
        if (el) el.value = td.speedData.majorStreet.percentile85;
    }

    // Transfer existing control
    if (td.geometry.existingControl) {
        warrantsState.stopsign.config.existingControl = td.geometry.existingControl;
        const el = document.getElementById('stopExistingControl');
        if (el) el.value = td.geometry.existingControl;
    }

    // Transfer TMC multi-day data
    let daysTransferred = 0;
    if (Object.keys(td.tmcData.multiDayData).length > 0) {
        const dowNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const transformedData = {};

        for (const [key, day] of Object.entries(td.tmcData.multiDayData)) {
            transformedData[key] = {
                ...day,
                dayName: day.date || dowNames[day.dayOfWeek] || 'Unknown',
                date: day.date,
                dayOfWeek: day.dayOfWeek,
                hourlyData: day.hourlyData
            };
            daysTransferred++;
        }

        warrantsState.stopsign.multiDayData = transformedData;

        // Update stop sign UI
        if (typeof stopsign_updateTMCGrid === 'function') {
            stopsign_updateTMCGrid();
        }
        if (typeof stopsign_updateDayCards === 'function') {
            stopsign_updateDayCards();
        }

        // Populate first day into grid
        const firstDay = Object.values(transformedData)[0];
        if (firstDay && typeof stopsign_populateTMCFromDayData === 'function') {
            setTimeout(() => {
                stopsign_populateTMCFromDayData(firstDay);
            }, 100);
        }
    }

    // Switch to stop sign tab
    showWarrantStudy('stopsign');

    if (daysTransferred > 0) {
        showToast(`Transferred ${daysTransferred} day(s) of traffic data to Stop Sign Warrant`, 'success');
    } else {
        showToast('Configuration transferred to Stop Sign Warrant', 'info');
    }
}

/**
 * Push Traffic Data to Roundabout Analysis Tab
 * Transfers TMC data, AADT, and configuration
 */
function trafficdata_pushToRoundabout() {
    const td = warrantsState.trafficData;

    // Check if there's data to transfer
    if (Object.keys(td.tmcData.multiDayData).length === 0 && !td.config.locationName) {
        showToast('No traffic data to transfer. Enter data first.', 'warning');
        return;
    }

    // Initialize roundabout state if needed
    warrantsState.roundabout = warrantsState.roundabout || {};
    warrantsState.roundabout.config = warrantsState.roundabout.config || {};
    warrantsState.roundabout.trafficData = warrantsState.roundabout.trafficData || {};

    // Transfer configuration
    if (td.config.locationName) {
        warrantsState.roundabout.config.intersectionName = td.config.locationName;
        const nameEl = document.getElementById('roundIntersectionName');
        if (nameEl) nameEl.value = td.config.locationName;
    }

    // Set intersection legs
    if (td.config.intersectionType) {
        const legs = td.config.intersectionType === '3leg' ? 3 : 4;
        warrantsState.roundabout.config.numberOfLegs = legs;
        const el = document.getElementById('roundApproaches');
        if (el) el.value = legs;
    }

    // Transfer existing control
    if (td.geometry.existingControl) {
        const controlMap = {
            'none': 'none',
            'stop_minor': '2way_stop',
            'stop_all': '4way_stop',
            'signal': 'signal'
        };
        warrantsState.roundabout.config.currentControl = controlMap[td.geometry.existingControl] || 'none';
        const el = document.getElementById('roundExistingControl');
        if (el) el.value = warrantsState.roundabout.config.currentControl;
    }

    // Transfer AADT data
    if (td.tmcData.aggregates.majorStreetAADT && td.tmcData.aggregates.minorStreetAADT) {
        const totalAADT = td.tmcData.aggregates.majorStreetAADT + td.tmcData.aggregates.minorStreetAADT;
        warrantsState.roundabout.trafficData.totalAADT = totalAADT;
        const aadtEl = document.getElementById('roundTotalAADT');
        if (aadtEl) aadtEl.value = totalAADT;
    }

    // Transfer peak hour volume
    if (td.tmcData.aggregates.intersectionTotal) {
        warrantsState.roundabout.trafficData.peakHourVolume = td.tmcData.aggregates.intersectionTotal;
        const peakEl = document.getElementById('roundPeakVol');
        if (peakEl) peakEl.value = td.tmcData.aggregates.intersectionTotal;
    }

    // Transfer TMC multi-day data
    let daysTransferred = 0;
    if (Object.keys(td.tmcData.multiDayData).length > 0) {
        const dowNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const transformedData = {};

        for (const [key, day] of Object.entries(td.tmcData.multiDayData)) {
            transformedData[key] = {
                ...day,
                dayName: day.date || dowNames[day.dayOfWeek] || 'Unknown',
                date: day.date,
                dow: day.dayOfWeek,
                hourlyData: day.hourlyData
            };
            daysTransferred++;
        }

        warrantsState.roundabout.multiDayData = transformedData;

        // Update roundabout UI
        if (typeof roundabout_updateTMCGrid === 'function') {
            roundabout_updateTMCGrid();
        }
        if (typeof roundabout_updateDayCards === 'function') {
            roundabout_updateDayCards();
        }
    }

    // Switch to roundabout tab
    showWarrantStudy('roundabout');

    // Trigger evaluation if function exists
    if (typeof evaluateRoundabout === 'function') {
        setTimeout(evaluateRoundabout, 100);
    }

    if (daysTransferred > 0) {
        showToast(`Transferred ${daysTransferred} day(s) of traffic data to Roundabout Analysis`, 'success');
    } else {
        showToast('Configuration transferred to Roundabout Analysis', 'info');
    }
}

/**
 * Push Traffic Data to Pedestrian Crossing Tab
 * Transfers pedestrian counts, speed data, and AADT
 */
function trafficdata_pushToPedCrossing() {
    const td = warrantsState.trafficData;

    // Check for pedestrian-specific data
    const hasPedData = Object.keys(td.pedBikeData.multiDayData).length > 0 ||
                       td.pedBikeData.aggregates.peakHourPedVolume > 0;
    const hasSpeedData = td.speedData.majorStreet.percentile85 !== null;
    const hasAADT = td.tmcData.aggregates.majorStreetAADT !== null;

    if (!hasPedData && !hasSpeedData && !hasAADT && !td.config.locationName) {
        showToast('No relevant data for Pedestrian Crossing. Enter ped counts, speed, or AADT first.', 'warning');
        return;
    }

    // Transfer to pedestrian form fields
    // Location
    if (td.config.locationName) {
        const nameEl = document.getElementById('pedLocationName');
        if (nameEl) nameEl.value = td.config.locationName;
    }

    // AADT
    if (td.tmcData.aggregates.majorStreetAADT) {
        const aadtEl = document.getElementById('pedAADT');
        if (aadtEl) aadtEl.value = td.tmcData.aggregates.majorStreetAADT;
    }

    // Speed data
    if (td.speedData.majorStreet.percentile85) {
        const speed85El = document.getElementById('pedSpeed85th');
        if (speed85El) speed85El.value = td.speedData.majorStreet.percentile85;
    }
    if (td.speedData.majorStreet.postedLimit) {
        const postedEl = document.getElementById('pedPostedSpeed');
        if (postedEl) postedEl.value = td.speedData.majorStreet.postedLimit;
    }

    // Pedestrian counts
    if (td.pedBikeData.aggregates.peakHourPedVolume > 0) {
        const pedVolEl = document.getElementById('pedPeakHourVolume');
        if (pedVolEl) pedVolEl.value = td.pedBikeData.aggregates.peakHourPedVolume;
    }

    // Lanes
    if (td.geometry.majorLanes) {
        const lanesEl = document.getElementById('pedLanes');
        if (lanesEl) lanesEl.value = td.geometry.majorLanes;
    }

    // Special conditions
    if (td.specialConditions.schoolZone) {
        const schoolEl = document.getElementById('pedSchoolZone');
        if (schoolEl) schoolEl.checked = true;
    }
    if (td.specialConditions.seniorCenter) {
        const seniorEl = document.getElementById('pedSeniorCenter');
        if (seniorEl) seniorEl.checked = true;
    }
    if (td.specialConditions.transitStop) {
        const transitEl = document.getElementById('pedTransitStop');
        if (transitEl) transitEl.checked = true;
    }

    // Switch to pedestrian crossing tab
    showWarrantStudy('pedestrian');

    const dataTypes = [];
    if (hasPedData) dataTypes.push('pedestrian counts');
    if (hasSpeedData) dataTypes.push('speed data');
    if (hasAADT) dataTypes.push('AADT');

    showToast(`Transferred ${dataTypes.join(', ')} to Pedestrian Crossing`, 'success');
}

/**
 * Push Traffic Data to Speed Study Tab
 * Transfers speed data and traffic volumes
 */
function trafficdata_pushToSpeedStudy() {
    const td = warrantsState.trafficData;

    // Check for speed-specific data
    const hasSpeedData = td.speedData.majorStreet.percentile85 !== null ||
                         td.speedData.majorStreet.averageSpeed !== null;

    if (!hasSpeedData && !td.config.locationName) {
        showToast('No speed data to transfer. Enter 85th percentile or average speed first.', 'warning');
        return;
    }

    // Initialize speed study state if needed
    warrantsState.speedstudy = warrantsState.speedstudy || {};
    warrantsState.speedstudy.config = warrantsState.speedstudy.config || {};

    // Transfer configuration
    if (td.config.locationName) {
        warrantsState.speedstudy.config.locationName = td.config.locationName;
        warrantsState.speedstudy.config.studyName = `Speed Study - ${td.config.locationName}`;
        const nameEl = document.getElementById('speedstudyLocationName');
        if (nameEl) nameEl.value = td.config.locationName;
    }

    // Transfer posted speed limit
    if (td.speedData.majorStreet.postedLimit) {
        warrantsState.speedstudy.config.postedSpeedLimit = td.speedData.majorStreet.postedLimit;
        const el = document.getElementById('speedstudyPostedLimit');
        if (el) el.value = td.speedData.majorStreet.postedLimit;
    }

    // Transfer 85th percentile
    if (td.speedData.majorStreet.percentile85) {
        warrantsState.speedstudy.analysisResults = warrantsState.speedstudy.analysisResults || {};
        warrantsState.speedstudy.analysisResults.percentile85 = td.speedData.majorStreet.percentile85;
        const el = document.getElementById('speedstudy85th');
        if (el) el.value = td.speedData.majorStreet.percentile85;
    }

    // Transfer average speed
    if (td.speedData.majorStreet.averageSpeed) {
        warrantsState.speedstudy.analysisResults = warrantsState.speedstudy.analysisResults || {};
        warrantsState.speedstudy.analysisResults.meanSpeed = td.speedData.majorStreet.averageSpeed;
        const el = document.getElementById('speedstudyMeanSpeed');
        if (el) el.value = td.speedData.majorStreet.averageSpeed;
    }

    // Transfer sample size
    if (td.speedData.majorStreet.sampleSize) {
        warrantsState.speedstudy.analysisResults = warrantsState.speedstudy.analysisResults || {};
        warrantsState.speedstudy.analysisResults.totalObservations = td.speedData.majorStreet.sampleSize;
        const el = document.getElementById('speedstudySampleSize');
        if (el) el.value = td.speedData.majorStreet.sampleSize;
    }

    // Transfer lanes
    if (td.geometry.majorLanes) {
        warrantsState.speedstudy.config.numberOfLanes = td.geometry.majorLanes;
        const el = document.getElementById('speedstudyLanes');
        if (el) el.value = td.geometry.majorLanes;
    }

    // Transfer volume data for crash rate calculations
    if (td.tmcData.aggregates.majorStreetAADT) {
        warrantsState.speedstudy.volumeData = warrantsState.speedstudy.volumeData || {};
        warrantsState.speedstudy.volumeData.aadt = td.tmcData.aggregates.majorStreetAADT;
        warrantsState.speedstudy.volumeData.source = 'tmc';
        const el = document.getElementById('speedstudyAADT');
        if (el) el.value = td.tmcData.aggregates.majorStreetAADT;
    }

    // Switch to speed study tab
    showWarrantStudy('speedstudy');

    const dataTypes = [];
    if (td.speedData.majorStreet.percentile85) dataTypes.push('85th percentile');
    if (td.speedData.majorStreet.averageSpeed) dataTypes.push('average speed');
    if (td.speedData.majorStreet.sampleSize) dataTypes.push('sample size');

    showToast(`Transferred ${dataTypes.length > 0 ? dataTypes.join(', ') : 'configuration'} to Speed Study`, 'success');
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.studies = CL.studies || {};
  CL.studies.trafficData = CL.studies.trafficData || {};
  window.trafficdata_onTabShow = trafficdata_onTabShow; CL.studies.trafficData.trafficdata_onTabShow = trafficdata_onTabShow;
  window.trafficdata_updateConfig = trafficdata_updateConfig; CL.studies.trafficData.trafficdata_updateConfig = trafficdata_updateConfig;
  window.trafficdata_syncFromWarrantSelection = trafficdata_syncFromWarrantSelection; CL.studies.trafficData.trafficdata_syncFromWarrantSelection = trafficdata_syncFromWarrantSelection;
  window.trafficdata_toggleAIPanel = trafficdata_toggleAIPanel; CL.studies.trafficData.trafficdata_toggleAIPanel = trafficdata_toggleAIPanel;
  window.trafficdata_toggleDisclaimer = trafficdata_toggleDisclaimer; CL.studies.trafficData.trafficdata_toggleDisclaimer = trafficdata_toggleDisclaimer;
  window.trafficdata_handleDisclaimerCheckbox = trafficdata_handleDisclaimerCheckbox; CL.studies.trafficData.trafficdata_handleDisclaimerCheckbox = trafficdata_handleDisclaimerCheckbox;
  window.trafficdata_setCountType = trafficdata_setCountType; CL.studies.trafficData.trafficdata_setCountType = trafficdata_setCountType;
  window.trafficdata_updateDaySlots = trafficdata_updateDaySlots; CL.studies.trafficData.trafficdata_updateDaySlots = trafficdata_updateDaySlots;
  window.trafficdata_toggleSection = trafficdata_toggleSection; CL.studies.trafficData.trafficdata_toggleSection = trafficdata_toggleSection;
  window.trafficdata_renderTmcTable = trafficdata_renderTmcTable; CL.studies.trafficData.trafficdata_renderTmcTable = trafficdata_renderTmcTable;
  window.trafficdata_updateTmcTotals = trafficdata_updateTmcTotals; CL.studies.trafficData.trafficdata_updateTmcTotals = trafficdata_updateTmcTotals;
  window.trafficdata_setTmcCountType = trafficdata_setTmcCountType; CL.studies.trafficData.trafficdata_setTmcCountType = trafficdata_setTmcCountType;
  window.trafficdata_updateTmcDate = trafficdata_updateTmcDate; CL.studies.trafficData.trafficdata_updateTmcDate = trafficdata_updateTmcDate;
  window.trafficdata_addTmcDay = trafficdata_addTmcDay; CL.studies.trafficData.trafficdata_addTmcDay = trafficdata_addTmcDay;
  window.trafficdata_clearTmcForm = trafficdata_clearTmcForm; CL.studies.trafficData.trafficdata_clearTmcForm = trafficdata_clearTmcForm;
  window.trafficdata_showDaysSummary = trafficdata_showDaysSummary; CL.studies.trafficData.trafficdata_showDaysSummary = trafficdata_showDaysSummary;
  window.calculateDayTotalVolume = calculateDayTotalVolume; CL.studies.trafficData.calculateDayTotalVolume = calculateDayTotalVolume;
  window.trafficdata_deleteDay = trafficdata_deleteDay; CL.studies.trafficData.trafficdata_deleteDay = trafficdata_deleteDay;
  window.trafficdata_updateDayCounts = trafficdata_updateDayCounts; CL.studies.trafficData.trafficdata_updateDayCounts = trafficdata_updateDayCounts;
  window.trafficdata_updatePedCounts = trafficdata_updatePedCounts; CL.studies.trafficData.trafficdata_updatePedCounts = trafficdata_updatePedCounts;
  window.trafficdata_addPedDay = trafficdata_addPedDay; CL.studies.trafficData.trafficdata_addPedDay = trafficdata_addPedDay;
  window.trafficdata_saveSpeedData = trafficdata_saveSpeedData; CL.studies.trafficData.trafficdata_saveSpeedData = trafficdata_saveSpeedData;
  window.trafficdata_updateReadiness = trafficdata_updateReadiness; CL.studies.trafficData.trafficdata_updateReadiness = trafficdata_updateReadiness;
  window.updateReadinessBar = updateReadinessBar; CL.studies.trafficData.updateReadinessBar = updateReadinessBar;
  window.trafficdata_convertTmcToTotals = trafficdata_convertTmcToTotals; CL.studies.trafficData.trafficdata_convertTmcToTotals = trafficdata_convertTmcToTotals;
  window.trafficdata_convertPeakToAADT = trafficdata_convertPeakToAADT; CL.studies.trafficData.trafficdata_convertPeakToAADT = trafficdata_convertPeakToAADT;
  window.trafficdata_calcRoundaboutVolumes = trafficdata_calcRoundaboutVolumes; CL.studies.trafficData.trafficdata_calcRoundaboutVolumes = trafficdata_calcRoundaboutVolumes;
  window.trafficdata_refreshCrashData = trafficdata_refreshCrashData; CL.studies.trafficData.trafficdata_refreshCrashData = trafficdata_refreshCrashData;
  window.trafficdata_newStudy = trafficdata_newStudy; CL.studies.trafficData.trafficdata_newStudy = trafficdata_newStudy;
  window.trafficdata_saveStudy = trafficdata_saveStudy; CL.studies.trafficData.trafficdata_saveStudy = trafficdata_saveStudy;
  window.trafficdata_exportStudy = trafficdata_exportStudy; CL.studies.trafficData.trafficdata_exportStudy = trafficdata_exportStudy;
  window.trafficdata_loadStudy = trafficdata_loadStudy; CL.studies.trafficData.trafficdata_loadStudy = trafficdata_loadStudy;
  window.trafficdata_loadSavedData = trafficdata_loadSavedData; CL.studies.trafficData.trafficdata_loadSavedData = trafficdata_loadSavedData;
  window.trafficdata_onFilesSelected = trafficdata_onFilesSelected; CL.studies.trafficData.trafficdata_onFilesSelected = trafficdata_onFilesSelected;
  window.trafficdata_showAPIKeyWarning = trafficdata_showAPIKeyWarning; CL.studies.trafficData.trafficdata_showAPIKeyWarning = trafficdata_showAPIKeyWarning;
  window.trafficdata_extractAllWithAI = trafficdata_extractAllWithAI; CL.studies.trafficData.trafficdata_extractAllWithAI = trafficdata_extractAllWithAI;
  window.trafficdata_extractSingleFile = trafficdata_extractSingleFile; CL.studies.trafficData.trafficdata_extractSingleFile = trafficdata_extractSingleFile;
  window.trafficdata_readFileContent = trafficdata_readFileContent; CL.studies.trafficData.trafficdata_readFileContent = trafficdata_readFileContent;
  window.trafficdata_clearAIUploads = trafficdata_clearAIUploads; CL.studies.trafficData.trafficdata_clearAIUploads = trafficdata_clearAIUploads;
  window.trafficdata_confirmExtractedData = trafficdata_confirmExtractedData; CL.studies.trafficData.trafficdata_confirmExtractedData = trafficdata_confirmExtractedData;
  window.trafficdata_enterReviewMode = trafficdata_enterReviewMode; CL.studies.trafficData.trafficdata_enterReviewMode = trafficdata_enterReviewMode;
  window.trafficdata_exitReviewMode = trafficdata_exitReviewMode; CL.studies.trafficData.trafficdata_exitReviewMode = trafficdata_exitReviewMode;
  window.trafficdata_updateReviewQueueIndicator = trafficdata_updateReviewQueueIndicator; CL.studies.trafficData.trafficdata_updateReviewQueueIndicator = trafficdata_updateReviewQueueIndicator;
  window.trafficdata_loadCurrentReviewData = trafficdata_loadCurrentReviewData; CL.studies.trafficData.trafficdata_loadCurrentReviewData = trafficdata_loadCurrentReviewData;
  window.trafficdata_loadHourlyDataIntoGrid = trafficdata_loadHourlyDataIntoGrid; CL.studies.trafficData.trafficdata_loadHourlyDataIntoGrid = trafficdata_loadHourlyDataIntoGrid;
  window.trafficdata_skipCurrentReview = trafficdata_skipCurrentReview; CL.studies.trafficData.trafficdata_skipCurrentReview = trafficdata_skipCurrentReview;
  window.trafficdata_updateRtAdjustment = trafficdata_updateRtAdjustment; CL.studies.trafficData.trafficdata_updateRtAdjustment = trafficdata_updateRtAdjustment;
  window.trafficdata_editDay = trafficdata_editDay; CL.studies.trafficData.trafficdata_editDay = trafficdata_editDay;
  window.trafficdata_pushToSignal = trafficdata_pushToSignal; CL.studies.trafficData.trafficdata_pushToSignal = trafficdata_pushToSignal;
  window.trafficdata_pushToStopSign = trafficdata_pushToStopSign; CL.studies.trafficData.trafficdata_pushToStopSign = trafficdata_pushToStopSign;
  window.trafficdata_pushToRoundabout = trafficdata_pushToRoundabout; CL.studies.trafficData.trafficdata_pushToRoundabout = trafficdata_pushToRoundabout;
  window.trafficdata_pushToPedCrossing = trafficdata_pushToPedCrossing; CL.studies.trafficData.trafficdata_pushToPedCrossing = trafficdata_pushToPedCrossing;
  window.trafficdata_pushToSpeedStudy = trafficdata_pushToSpeedStudy; CL.studies.trafficData.trafficdata_pushToSpeedStudy = trafficdata_pushToSpeedStudy;
  CL._registerModule('studies/traffic-data');
})();
