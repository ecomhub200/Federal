/**
 * CL studies.speed — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.studies.speed.<fn>; any
 * module-private state stays inside this IIFE (no external refs).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
/**
 * Initialize Speed Study tab when shown (P1 FIX)
 * Now auto-loads crash data from any available source
 */
function speedstudy_onTabShow() {
    console.log('[Speed Study] Tab shown, initializing...');

    // Generate speed data table rows
    speedstudy_generateTableRows();

    // Load saved data if available
    speedstudy_loadSavedData();

    // Update day count
    speedstudy_updateDayCount();

    // Always try to load crash data from any available source:
    // 1. warrantsState.selectedLocation (Map/Hotspots selection)
    // 2. Study name input (user typed route name)
    // 3. selectionState.location (cross-tab selection)
    // 4. Saved config.studyName (from previous session)
    const hasMapSelection = !!warrantsState.selectedLocation;
    const hasCrossTabSelection = !!selectionState?.location;
    const hasStudyName = !!document.getElementById('speedstudyName')?.value?.trim();
    const hasSavedStudyName = !!warrantsState.speedstudy?.config?.studyName;

    if (hasMapSelection || hasCrossTabSelection || hasStudyName || hasSavedStudyName) {
        speedstudy_loadCrashData();
    }

    // Auto-populate road properties if available from warrantsState
    speedstudy_autoPopulateFromRoadProps();

    // Update location source indicator
    speedstudy_updateLocationSourceIndicator();
}

/**
 * Generate hourly speed data table rows
 */
function speedstudy_generateTableRows() {
    const tbody = document.getElementById('speedstudyTableBody');
    if (!tbody) return;

    const countType = warrantsState.speedstudy?.config?.countType || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;

    let html = '';
    for (let hour = startHour; hour < endHour; hour++) {
        const hourDisplay = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
        html += `
        <tr>
            <td style="padding:6px;border:1px solid #fcd34d;font-weight:500;background:#fffbeb">${hourDisplay}</td>
            <td style="padding:4px;border:1px solid #fcd34d"><input type="number" id="speed_${hour}_n" class="warrant-input" style="width:50px;text-align:center;padding:4px" min="0" oninput="speedstudy_updateTotals()"></td>
            <td style="padding:4px;border:1px solid #fcd34d"><input type="number" id="speed_${hour}_mean" class="warrant-input" style="width:60px;text-align:center;padding:4px" min="0" max="100" step="0.1" oninput="speedstudy_updateTotals()"></td>
            <td style="padding:4px;border:1px solid #fcd34d"><input type="number" id="speed_${hour}_p50" class="warrant-input" style="width:60px;text-align:center;padding:4px" min="0" max="100" step="0.1"></td>
            <td style="padding:4px;border:1px solid #fcd34d;background:#fef9c3"><input type="number" id="speed_${hour}_p85" class="warrant-input" style="width:60px;text-align:center;padding:4px;font-weight:600" min="0" max="100" step="0.1" oninput="speedstudy_updateTotals()"></td>
            <td style="padding:4px;border:1px solid #fcd34d"><input type="number" id="speed_${hour}_p95" class="warrant-input" style="width:60px;text-align:center;padding:4px" min="0" max="100" step="0.1"></td>
            <td style="padding:4px;border:1px solid #fcd34d"><input type="number" id="speed_${hour}_above" class="warrant-input" style="width:50px;text-align:center;padding:4px" min="0" oninput="speedstudy_updateTotals()"></td>
        </tr>`;
    }
    tbody.innerHTML = html;
}

/**
 * Update totals in the speed data table footer
 */
function speedstudy_updateTotals() {
    const countType = warrantsState.speedstudy?.config?.countType || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;

    let totalN = 0;
    let totalAbove = 0;
    let weightedMean = 0;
    let weightedP85 = 0;

    for (let hour = startHour; hour < endHour; hour++) {
        const n = parseInt(document.getElementById(`speed_${hour}_n`)?.value) || 0;
        const mean = parseFloat(document.getElementById(`speed_${hour}_mean`)?.value) || 0;
        const p85 = parseFloat(document.getElementById(`speed_${hour}_p85`)?.value) || 0;
        const above = parseInt(document.getElementById(`speed_${hour}_above`)?.value) || 0;

        totalN += n;
        totalAbove += above;
        if (n > 0) {
            weightedMean += mean * n;
            weightedP85 += p85 * n;
        }
    }

    // Update footer values
    document.getElementById('speedstudyTotalN').textContent = totalN;
    document.getElementById('speedstudyTotalMean').textContent = totalN > 0 ? (weightedMean / totalN).toFixed(1) : '--';
    document.getElementById('speedstudyTotalP85').textContent = totalN > 0 ? (weightedP85 / totalN).toFixed(1) : '--';
    document.getElementById('speedstudyTotalAbove').textContent = totalAbove;
}

/**
 * Set count type (12hr or 24hr) (P2 FIX - Now syncs all controls)
 */
function speedstudy_setCountType(type) {
    warrantsState.speedstudy.config.countType = type;

    // Update UI toggle buttons
    const btn12 = document.getElementById('speedCountType12hrBtn');
    const btn24 = document.getElementById('speedCountType24hrBtn');

    if (type === '12hr') {
        if (btn12) {
            btn12.style.background = 'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)';
            btn12.style.color = 'white';
        }
        if (btn24) {
            btn24.style.background = 'transparent';
            btn24.style.color = '#64748b';
        }
        const indicator = document.getElementById('speedstudyCountTypeIndicator');
        if (indicator) indicator.textContent = 'Table shows 12 hours';
        const periodDisplay = document.getElementById('speedstudyPeriodDisplay');
        if (periodDisplay) periodDisplay.textContent = '12-hour';
    } else {
        if (btn24) {
            btn24.style.background = 'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)';
            btn24.style.color = 'white';
        }
        if (btn12) {
            btn12.style.background = 'transparent';
            btn12.style.color = '#64748b';
        }
        const indicator = document.getElementById('speedstudyCountTypeIndicator');
        if (indicator) indicator.textContent = 'Table shows 24 hours';
        const periodDisplay = document.getElementById('speedstudyPeriodDisplay');
        if (periodDisplay) periodDisplay.textContent = '24-hour';
    }

    // Sync AI panel dropdown (P2 FIX)
    const aiCountTypeSelect = document.getElementById('speedstudyAICountType');
    if (aiCountTypeSelect && aiCountTypeSelect.value !== type) {
        aiCountTypeSelect.value = type;
    }

    // Regenerate table rows
    speedstudy_generateTableRows();

    // Schedule auto-save
    speedstudy_scheduleAutoSave();

    console.log(`[Speed Study] Count type set to ${type}`);
}

/**
 * Update config from UI inputs
 */
function speedstudy_updateConfigFromUI() {
    const config = warrantsState.speedstudy.config;
    config.studyName = document.getElementById('speedstudyName')?.value || '';
    config.studyType = document.getElementById('speedstudyType')?.value || 'spot';
    config.postedSpeedLimit = parseInt(document.getElementById('speedstudyPostedLimit')?.value) || 35;
    config.roadwayClass = document.getElementById('speedstudyRoadClass')?.value || 'arterial';
    config.areaType = document.getElementById('speedstudyAreaType')?.value || 'urban';
    config.numberOfLanes = parseInt(document.getElementById('speedstudyLanes')?.value) || 2;
    config.medianType = document.getElementById('speedstudyMedian')?.value || 'none';
    config.horizontalAlignment = document.getElementById('speedstudyAlignment')?.value || 'tangent';
    config.grade = parseFloat(document.getElementById('speedstudyGrade')?.value) || 0;

    // Schedule auto-save
    speedstudy_scheduleAutoSave();
}

/**
 * Clear speed data form
 */
function speedstudy_clearForm() {
    const countType = warrantsState.speedstudy?.config?.countType || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;

    for (let hour = startHour; hour < endHour; hour++) {
        ['n', 'mean', 'p50', 'p85', 'p95', 'above'].forEach(field => {
            const el = document.getElementById(`speed_${hour}_${field}`);
            if (el) el.value = '';
        });
    }

    document.getElementById('speedstudyDate').value = '';
    speedstudy_updateTotals();
}

/**
 * Initialize/reset speed data table (P0 FIX)
 * Called by speedstudy_newStudy() and when clearing the form
 */
function speedstudy_initTable() {
    // Regenerate table rows based on current count type
    speedstudy_generateTableRows();

    // Clear all input values
    speedstudy_clearForm();

    // Reset totals display
    document.getElementById('speedstudyTotalN').textContent = '0';
    document.getElementById('speedstudyTotalMean').textContent = '--';
    document.getElementById('speedstudyTotalP85').textContent = '--';
    document.getElementById('speedstudyTotalAbove').textContent = '0';

    console.log('[Speed Study] Table initialized');
}

/**
 * Add current day's data to the multi-day storage
 */
function speedstudy_addCurrentDay() {
    const date = document.getElementById('speedstudyDate')?.value;
    const dow = parseInt(document.getElementById('speedstudyDow')?.value) || 2;
    const weather = document.getElementById('speedstudyWeather')?.value || 'clear';

    const dayKey = date ? `day_${date}` : `day_${Date.now()}`;

    const countType = warrantsState.speedstudy?.config?.countType || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;

    // Collect hourly data
    const hourlyData = {};
    let totalN = 0;

    for (let hour = startHour; hour < endHour; hour++) {
        const n = parseInt(document.getElementById(`speed_${hour}_n`)?.value) || 0;
        const mean = parseFloat(document.getElementById(`speed_${hour}_mean`)?.value) || 0;
        const p50 = parseFloat(document.getElementById(`speed_${hour}_p50`)?.value) || 0;
        const p85 = parseFloat(document.getElementById(`speed_${hour}_p85`)?.value) || 0;
        const p95 = parseFloat(document.getElementById(`speed_${hour}_p95`)?.value) || 0;
        const above = parseInt(document.getElementById(`speed_${hour}_above`)?.value) || 0;

        hourlyData[hour] = { n, mean, p50, p85, p95, aboveLimit: above };
        totalN += n;
    }

    if (totalN === 0) {
        showToast('Please enter some speed data before adding this day', 'warning');
        return;
    }

    // Add to state
    warrantsState.speedstudy.multiDayData[dayKey] = {
        date: date || new Date().toISOString().split('T')[0],
        dayOfWeek: dow,
        weatherCondition: weather,
        collectionMethod: warrantsState.speedstudy.config?.collectionMethod || 'radar',
        hourlyData: hourlyData
    };

    // Update UI
    speedstudy_renderDayCards();
    speedstudy_updateDayCount();
    speedstudy_clearForm();

    // Advance to next day
    const dowSelect = document.getElementById('speedstudyDow');
    if (dowSelect) {
        const nextDow = dow === 6 ? 0 : dow + 1;
        dowSelect.value = nextDow.toString();
    }

    showToast(`Speed data for ${date || 'today'} added successfully!`, 'success');
    speedstudy_scheduleAutoSave();
}

/**
 * Render day cards for added speed study days
 */
function speedstudy_renderDayCards() {
    const grid = document.getElementById('speedstudyDayCardsGrid');
    const section = document.getElementById('speedstudyAddedDaysSection');

    if (!grid) return;

    const days = Object.entries(warrantsState.speedstudy.multiDayData);

    if (days.length === 0) {
        section?.classList.add('hidden');
        grid.innerHTML = '';
        return;
    }

    section?.classList.remove('hidden');

    const dowNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    grid.innerHTML = days.map(([key, data]) => {
        // Calculate summary stats
        let totalN = 0;
        let weightedP85 = 0;
        Object.values(data.hourlyData || {}).forEach(h => {
            totalN += h.n || 0;
            if (h.n > 0) weightedP85 += (h.p85 || 0) * h.n;
        });
        const avgP85 = totalN > 0 ? (weightedP85 / totalN).toFixed(1) : '--';

        return `
        <div class="signal-day-card" style="background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border:2px solid #f59e0b;border-radius:8px;padding:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <span style="font-weight:600;color:#92400e">${dowNames[data.dayOfWeek]} ${data.date || ''}</span>
                <button onclick="speedstudy_removeDay('${key}')" style="background:none;border:none;color:#dc2626;cursor:pointer;font-size:1rem" title="Remove">✕</button>
            </div>
            <div style="font-size:.8rem;color:#92400e">
                <div>Sample: <strong>${totalN}</strong> vehicles</div>
                <div>85th %: <strong>${avgP85}</strong> mph</div>
                <div>Weather: ${data.weatherCondition || 'Clear'}</div>
            </div>
        </div>`;
    }).join('');
}

/**
 * Remove a day from the multi-day data
 */
function speedstudy_removeDay(key) {
    delete warrantsState.speedstudy.multiDayData[key];
    speedstudy_renderDayCards();
    speedstudy_updateDayCount();
    speedstudy_scheduleAutoSave();
}

/**
 * Update day count badge
 */
function speedstudy_updateDayCount() {
    const count = Object.keys(warrantsState.speedstudy.multiDayData).length;
    const badge = document.getElementById('speedstudyDayCount');
    if (badge) {
        badge.textContent = `${count} day${count !== 1 ? 's' : ''} entered`;
    }
}

/**
 * Select averaging method
 */
function speedstudy_selectAveragingMethod(method) {
    warrantsState.speedstudy.averagingMethod = method;

    // Update UI
    document.querySelectorAll('#speedstudyAddedDaysSection .signal-avg-option').forEach(opt => {
        const isSelected = opt.dataset.method === method;
        opt.style.border = isSelected ? '2px solid #f59e0b' : '2px solid #e2e8f0';
        opt.style.background = isSelected ? '#fffbeb' : 'transparent';
    });

    speedstudy_scheduleAutoSave();
}

/**
 * Run speed analysis (P3 FIX - Enhanced with validation and loading indicator)
 */
function speedstudy_runAnalysis() {
    const days = Object.values(warrantsState.speedstudy.multiDayData);

    // P3 FIX: Enhanced validation
    if (days.length === 0) {
        showToast('Please add at least one day of speed data before running analysis.', 'warning');
        return;
    }

    // Show loading indicator
    showLoading('Analyzing speed data...');

    // Use setTimeout to allow UI to update
    setTimeout(() => {
        try {
            speedstudy_runAnalysisInternal(days);
        } catch (error) {
            hideLoading();
            console.error('[Speed Study] Analysis error:', error);
            showToast('Analysis failed: ' + error.message, 'danger');
        }
    }, 100);
}

/**
 * Internal analysis function (separated for loading indicator)
 */
function speedstudy_runAnalysisInternal(days) {
    // Aggregate all hourly data
    let totalN = 0;
    let weightedMean = 0;
    let weightedP50 = 0;
    let weightedP85 = 0;
    let weightedP95 = 0;
    let totalAbove = 0;
    const allP85Values = [];

    days.forEach(day => {
        Object.values(day.hourlyData || {}).forEach(h => {
            const n = h.n || 0;
            totalN += n;
            totalAbove += h.aboveLimit || 0;
            if (n > 0) {
                weightedMean += (h.mean || 0) * n;
                weightedP50 += (h.p50 || 0) * n;
                weightedP85 += (h.p85 || 0) * n;
                weightedP95 += (h.p95 || 0) * n;
                allP85Values.push(h.p85 || 0);
            }
        });
    });

    if (totalN === 0) {
        hideLoading();
        showToast('No speed data found in added days', 'warning');
        return;
    }

    // P3 FIX: Data validation warnings
    const validationWarnings = [];

    // Check minimum sample size (ITE recommends 100+ vehicles)
    const minSampleSize = warrantsState.speedstudy.config?.minimumSampleSize || 100;
    if (totalN < minSampleSize) {
        validationWarnings.push(`Sample size (${totalN}) is below recommended minimum (${minSampleSize}).`);
    }

    // Check number of days (ITE recommends 3 days for Tue-Wed-Thu)
    if (days.length < 3) {
        validationWarnings.push(`Only ${days.length} day(s) of data. ITE recommends 3 mid-week days for reliable results.`);
    }

    // Calculate results
    const meanSpeed = weightedMean / totalN;
    const medianSpeed = weightedP50 / totalN;
    const p85 = weightedP85 / totalN;
    const p95 = weightedP95 / totalN;

    // P3 FIX: Data consistency check
    if (p85 > p95 && p95 > 0) {
        validationWarnings.push('Data inconsistency: 85th percentile exceeds 95th percentile. Check data entry.');
    }

    if (meanSpeed > p85) {
        validationWarnings.push('Data inconsistency: Mean speed exceeds 85th percentile. Check data entry.');
    }

    // Calculate standard deviation (approximate from percentiles)
    const stdDev = (p85 - meanSpeed) / 1.04;  // Approximate using normal distribution

    // Compliance calculations
    const postedLimit = warrantsState.speedstudy.config.postedSpeedLimit || 35;
    const compliancePct = ((totalN - totalAbove) / totalN * 100).toFixed(1);

    // Calculate pace (10 mph range with most vehicles)
    const paceStart = Math.floor(p85 / 5) * 5 - 5;
    const paceEnd = paceStart + 10;

    // Store results
    const results = {
        timestamp: new Date().toISOString(),
        totalObservations: totalN,
        daysAnalyzed: days.length,
        meanSpeed: meanSpeed.toFixed(1),
        medianSpeed: medianSpeed.toFixed(1),
        percentile85: p85.toFixed(1),
        percentile95: p95.toFixed(1),
        standardDeviation: stdDev.toFixed(1),
        percentAboveLimit: ((totalAbove / totalN) * 100).toFixed(1),
        pace: { low: paceStart, high: paceEnd, percent: '~70' },
        validationWarnings: validationWarnings
    };

    warrantsState.speedstudy.analysisResults = results;
    warrantsState.speedstudy.lastAnalysisTimestamp = results.timestamp;

    // Calculate ITE recommendation
    const suggestedLimit = Math.round(p85 / 5) * 5;  // Round to nearest 5 mph
    results.recommendation = {
        suggestedLimit: suggestedLimit,
        adjustmentReason: speedstudy_getRecommendationReason(postedLimit, suggestedLimit, p85),
        confidence: totalN >= 100 ? 'high' : totalN >= 50 ? 'medium' : 'low'
    };

    // Hide loading indicator
    hideLoading();

    // Update UI
    speedstudy_displayResults(results);
    speedstudy_scheduleAutoSave();

    // Show completion message with validation warnings if any
    if (validationWarnings.length > 0) {
        showToast(`Analysis complete with ${validationWarnings.length} warning(s). Review results carefully.`, 'warning');
        console.log('[Speed Study] Validation warnings:', validationWarnings);
    } else {
        showToast('Speed analysis complete!', 'success');
    }
}

/**
 * Get recommendation reason text
 */
function speedstudy_getRecommendationReason(current, suggested, p85) {
    const diff = suggested - current;
    if (Math.abs(diff) <= 5) {
        return `The 85th percentile speed (${p85.toFixed(1)} mph) supports the current posted limit of ${current} mph. No change recommended.`;
    } else if (diff > 0) {
        return `The 85th percentile speed (${p85.toFixed(1)} mph) is significantly higher than the posted limit. Consider increasing to ${suggested} mph per ITE guidelines, or implement speed management countermeasures.`;
    } else {
        return `The 85th percentile speed (${p85.toFixed(1)} mph) supports a lower speed limit of ${suggested} mph. Consider environmental factors before reducing.`;
    }
}

/**
 * Display analysis results in the UI
 */
function speedstudy_displayResults(results) {
    // Show results dashboard, hide no data message
    document.getElementById('speedstudyResultsDashboard').style.display = 'block';
    document.getElementById('speedstudyNoResults').style.display = 'none';

    // Update metric cards
    document.getElementById('speedstudyResultMean').textContent = results.meanSpeed;
    document.getElementById('speedstudyResultP50').textContent = results.medianSpeed;
    document.getElementById('speedstudyResultP85').textContent = results.percentile85;
    document.getElementById('speedstudyResultP95').textContent = results.percentile95;
    document.getElementById('speedstudyResultStdDev').textContent = results.standardDeviation;
    document.getElementById('speedstudyResultN').textContent = results.totalObservations.toLocaleString();

    // Compliance (with note that >5 and >10 are estimates)
    const compliance = (100 - parseFloat(results.percentAboveLimit)).toFixed(1);
    document.getElementById('speedstudyCompliance').textContent = `${compliance}%`;
    // Note: These are estimates based on typical speed distributions
    // For precise values, individual vehicle speeds would need to be analyzed
    document.getElementById('speedstudyAbove5').textContent = `~${(parseFloat(results.percentAboveLimit) * 0.7).toFixed(1)}%`;
    document.getElementById('speedstudyAbove10').textContent = `~${(parseFloat(results.percentAboveLimit) * 0.3).toFixed(1)}%`;

    // Pace
    document.getElementById('speedstudyPaceRange').textContent = `${results.pace.low}-${results.pace.high} mph`;
    document.getElementById('speedstudyPacePct').textContent = `${results.pace.percent}%`;

    // Recommendation
    const postedLimit = warrantsState.speedstudy.config.postedSpeedLimit || 35;
    document.getElementById('speedstudyRecCurrent').textContent = `${postedLimit} mph`;
    document.getElementById('speedstudyRecP85').textContent = `${results.percentile85} mph`;
    document.getElementById('speedstudyRecSuggested').textContent = `${results.recommendation.suggestedLimit} mph`;
    document.getElementById('speedstudyRecReason').textContent = results.recommendation.adjustmentReason;

    // Sample Size Warning (ITE recommends minimum 100 vehicles)
    const sampleWarning = document.getElementById('speedstudySampleWarning');
    if (sampleWarning) {
        if (results.totalObservations < 100) {
            sampleWarning.style.display = 'block';
            sampleWarning.innerHTML = `⚠️ <strong>Low Sample Size (${results.totalObservations} vehicles):</strong> ITE recommends minimum 100 vehicles for reliable 85th percentile calculation. Results may have higher margin of error.`;
        } else {
            sampleWarning.style.display = 'none';
        }
    }

    // Confidence Indicator based on sample size
    const confidenceEl = document.getElementById('speedstudyConfidenceLevel');
    if (confidenceEl) {
        let confidence = '';
        let confidenceColor = '';
        const n = results.totalObservations;

        if (n >= 384) {
            confidence = 'HIGH (95% confidence, ±5% margin)';
            confidenceColor = '#10b981';
        } else if (n >= 100) {
            confidence = 'MODERATE (adequate sample per ITE)';
            confidenceColor = '#3b82f6';
        } else if (n >= 50) {
            confidence = 'LOW (below ITE minimum of 100)';
            confidenceColor = '#f59e0b';
        } else {
            confidence = 'VERY LOW (insufficient data)';
            confidenceColor = '#dc2626';
        }

        confidenceEl.innerHTML = `<strong style="color:${confidenceColor}">${confidence}</strong> (n=${n.toLocaleString()})`;
    }

    // P3 FIX: Display validation warnings if any
    const warningsContainer = document.getElementById('speedstudyValidationWarnings');
    if (warningsContainer) {
        if (results.validationWarnings && results.validationWarnings.length > 0) {
            warningsContainer.style.display = 'block';
            warningsContainer.innerHTML = `
                <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px;margin-bottom:16px">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                        <span style="font-size:1.25rem">⚠️</span>
                        <strong style="color:#dc2626">Data Quality Warnings (${results.validationWarnings.length})</strong>
                    </div>
                    <ul style="margin:0;padding-left:1.5rem;color:#7f1d1d;font-size:.85rem">
                        ${results.validationWarnings.map(w => `<li>${w}</li>`).join('')}
                    </ul>
                </div>`;
        } else {
            warningsContainer.style.display = 'none';
            warningsContainer.innerHTML = '';
        }
    }

    // Generate histogram
    speedstudy_generateHistogram(results);
}

/**
 * Generate speed distribution histogram
 */
function speedstudy_generateHistogram(results) {
    const container = document.getElementById('speedstudyHistogram');
    if (!container) return;

    // Create bins from 20 to 65 mph in 5 mph increments
    const bins = {};
    for (let i = 20; i <= 65; i += 5) {
        bins[i] = 0;
    }

    // Simulate distribution based on mean and std dev (normal distribution approximation)
    const mean = parseFloat(results.meanSpeed);
    const stdDev = parseFloat(results.standardDeviation);
    const n = results.totalObservations;

    // Generate approximate distribution
    for (let speed = 20; speed <= 65; speed += 5) {
        const z = (speed + 2.5 - mean) / stdDev;
        const probability = Math.exp(-0.5 * z * z) / (stdDev * Math.sqrt(2 * Math.PI));
        bins[speed] = Math.round(probability * n * 5);  // Scale by bin width
    }

    // Find max for scaling
    const maxCount = Math.max(...Object.values(bins));
    const postedLimit = warrantsState.speedstudy.config.postedSpeedLimit || 35;

    // Generate bars
    container.innerHTML = Object.entries(bins).map(([speed, count]) => {
        const height = maxCount > 0 ? (count / maxCount * 130) : 0;
        const isAboveLimit = parseInt(speed) >= postedLimit;
        const isP85 = Math.abs(parseInt(speed) - parseFloat(results.percentile85)) < 5;
        const color = isP85 ? '#f59e0b' : isAboveLimit ? '#ef4444' : '#3b82f6';
        return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end">
            <div style="width:100%;height:${height}px;background:${color};border-radius:2px 2px 0 0;min-height:2px" title="${speed}-${parseInt(speed)+5} mph: ${count} vehicles"></div>
        </div>`;
    }).join('');
}

/**
 * Load crash data for speed study location (P1 FIX - Enhanced)
 * Now supports multiple location sources with proper priority and indicator updates
 */
function speedstudy_loadCrashData() {
    const noDataEl = document.getElementById('speedstudyCrashNoData');
    const dataContentEl = document.getElementById('speedstudyCrashDataContent');

    if (!crashState.sampleRows?.length) {
        if (noDataEl) {
            noDataEl.style.display = 'block';
            noDataEl.innerHTML = '<p style="font-size:.8rem;color:#64748b;margin:0">Crash data not loaded. Please load crash data first.</p>';
        }
        if (dataContentEl) dataContentEl.style.display = 'none';
        speedstudy_updateLocationSourceIndicator();
        return;
    }

    // Try multiple sources for location with clear priority:
    // 1. warrantsState.selectedLocation (from Map/Hotspots - highest priority)
    // 2. Study Name input (user typed route name)
    // 3. selectionState.location (cross-tab selection)
    // 4. Saved config.studyName (from previous session - lowest priority)
    let location = warrantsState.selectedLocation;
    let locationSource = 'selected';

    if (!location) {
        // Try study name input
        const studyName = document.getElementById('speedstudyName')?.value?.trim();
        if (studyName) {
            const matchingRoute = findMatchingRoute(studyName);
            if (matchingRoute) {
                location = matchingRoute;
                locationSource = 'studyName';
            }
        }
    }

    if (!location && selectionState?.location) {
        location = typeof selectionState.location === 'object'
            ? selectionState.location.name || selectionState.location
            : selectionState.location;
        locationSource = 'crossTab';
    }

    // Try saved config as last resort
    if (!location && warrantsState.speedstudy?.config?.studyName) {
        const savedName = warrantsState.speedstudy.config.studyName;
        const matchingRoute = findMatchingRoute(savedName);
        if (matchingRoute) {
            location = matchingRoute;
            locationSource = 'saved';
        }
    }

    if (!location) {
        if (noDataEl) {
            noDataEl.style.display = 'block';
            noDataEl.innerHTML = `
                <p style="font-size:.8rem;color:#64748b;margin:0 0 .5rem">
                    <strong>To auto-populate crash data:</strong>
                </p>
                <ul style="font-size:.75rem;color:#64748b;margin:0;padding-left:1.2rem">
                    <li>Enter a route name in "Study Name" (e.g., "BROAD ST" or "US-250")</li>
                    <li>Or select a location from the <strong>Map</strong> or <strong>Hotspots</strong> tab</li>
                </ul>`;
        }
        if (dataContentEl) dataContentEl.style.display = 'none';
        speedstudy_updateLocationSourceIndicator();
        return;
    }

    // Use warrant-filtered crashes when location is selected via the warrant panel
    // This ensures consistency with the shared date filter used by all other warrant sub-tabs
    let crashes;
    if (warrantsState.selectedLocation && location === warrantsState.selectedLocation && warrantsState.filteredCrashes?.length > 0) {
        crashes = warrantsState.filteredCrashes;
        console.log('[Speed Study] Using warrant-filtered crashes:', crashes.length);
    } else {
        // Fallback: independent crash filtering for user-typed study names
        const period = parseInt(document.getElementById('speedstudyCrashPeriod')?.value) || 3;
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - period);

        crashes = crashState.sampleRows.filter(row => {
            const route = row[COL.ROUTE] || '';
            const node = row[COL.NODE] || '';
            const crashDate = new Date(row[COL.DATE]);

            // Skip if outside date range
            if (crashDate < cutoffDate) return false;

            // Improved route matching (P1 FIX):
            // 1. Exact match (highest confidence)
            if (route === location || node === location) return true;
            if (route.toUpperCase() === location.toUpperCase()) return true;
            if (node.toUpperCase() === location.toUpperCase()) return true;

            // 2. Word-boundary match (medium confidence)
            const locWords = location.toUpperCase().split(/[\s\-@&]+/).filter(w => w.length > 1);
            const routeWords = route.toUpperCase().split(/[\s\-@&]+/).filter(w => w.length > 1);

            // Check if all significant words in location appear in route
            const allWordsMatch = locWords.every(lw =>
                routeWords.some(rw => rw === lw || rw.startsWith(lw) || lw.startsWith(rw))
            );
            if (allWordsMatch && locWords.length > 0) return true;

            // 3. Only allow substring match if the search term is long enough (avoid false positives)
            // This prevents "I-64" from matching "I-640"
            if (location.length >= 6) {
                if (route.toUpperCase().includes(location.toUpperCase())) return true;
            }

            return false;
        });
    }

    if (crashes.length === 0) {
        if (noDataEl) {
            noDataEl.style.display = 'block';
            noDataEl.innerHTML = `<p style="font-size:.8rem;color:#64748b;margin:0">No crashes found for "${location}" in the last ${period} years.</p>`;
        }
        if (dataContentEl) dataContentEl.style.display = 'none';
        return;
    }

    if (noDataEl) noDataEl.style.display = 'none';
    if (dataContentEl) dataContentEl.style.display = 'block';

    // Calculate crash statistics
    let k = 0, a = 0, b = 0, c = 0, o = 0;
    let speedRelated = 0;

    crashes.forEach(row => {
        const severity = row[COL.SEVERITY];
        if (severity === 'K') k++;
        else if (severity === 'A') a++;
        else if (severity === 'B') b++;
        else if (severity === 'C') c++;
        else o++;

        // Check for speed-related (check collision type, contributing factors)
        const collision = (row[COL.COLLISION] || '').toLowerCase();
        const contributing = (row[COL.CONTRIBUTING] || '').toLowerCase();
        if (collision.includes('speed') || collision.includes('fixed object') ||
            collision.includes('run off') || collision.includes('overturn') ||
            contributing.includes('speed') || contributing.includes('too fast')) {
            speedRelated++;
        }
    });

    // Update UI
    document.getElementById('speedstudyCrashTotal').textContent = crashes.length;
    document.getElementById('speedstudyCrashSpeedRelated').textContent = speedRelated;
    document.getElementById('speedstudyCrashK').textContent = k;
    document.getElementById('speedstudyCrashA').textContent = a;

    // Store in state
    warrantsState.speedstudy.crashAnalysis = {
        period: `${period}year`,
        totalCrashes: crashes.length,
        speedRelatedCrashes: speedRelated,
        severityBreakdown: { K: k, A: a, B: b, C: c, O: o },
        autoPopulated: true,
        sourceData: crashes,
        locationUsed: location,
        locationSource: locationSource
    };

    // Calculate crash rate if AADT and segment length are provided
    speedstudy_calculateCrashRate();

    // Update location source indicator (P1 FIX)
    speedstudy_updateLocationSourceIndicator();

    console.log(`[Speed Study] Loaded ${crashes.length} crashes for "${location}" (source: ${locationSource})`);
}

/**
 * Find matching route name in crash data
 */
function findMatchingRoute(searchTerm) {
    if (!crashState.sampleRows?.length || !searchTerm) return null;

    const normalizedSearch = searchTerm.toUpperCase().trim();

    // Get unique routes from crash data
    const routes = new Set();
    crashState.sampleRows.forEach(row => {
        if (row[COL.ROUTE]) routes.add(row[COL.ROUTE]);
    });

    // Try exact match first
    for (const route of routes) {
        if (route.toUpperCase() === normalizedSearch) return route;
    }

    // Try partial match
    for (const route of routes) {
        if (route.toUpperCase().includes(normalizedSearch) ||
            normalizedSearch.includes(route.toUpperCase())) {
            return route;
        }
    }

    // Try word-based match (e.g., "Broad St" matches "BROAD ST")
    const searchWords = normalizedSearch.split(/\s+/);
    for (const route of routes) {
        const routeWords = route.toUpperCase().split(/\s+/);
        const hasMatch = searchWords.some(sw =>
            routeWords.some(rw => rw.includes(sw) || sw.includes(rw))
        );
        if (hasMatch) return route;
    }

    return null;
}

/**
 * Calculate crash rate
 */
function speedstudy_calculateCrashRate() {
    const aadt = parseInt(document.getElementById('speedstudyAADT')?.value) || 0;
    const segmentLength = parseFloat(document.getElementById('speedstudySegmentLength')?.value) || 0;
    const period = parseInt(document.getElementById('speedstudyCrashPeriod')?.value) || 3;
    const totalCrashes = warrantsState.speedstudy.crashAnalysis?.totalCrashes || 0;
    const speedRelated = warrantsState.speedstudy.crashAnalysis?.speedRelatedCrashes || 0;

    if (aadt > 0 && segmentLength > 0 && totalCrashes > 0) {
        // Crash Rate = (Crashes × 100,000,000) / (AADT × 365 × Years × Miles)
        const vmt = aadt * 365 * period * segmentLength;
        const crashRate = (totalCrashes * 100000000) / vmt;
        const speedCrashRate = (speedRelated * 100000000) / vmt;

        document.getElementById('speedstudyCrashRate').textContent = crashRate.toFixed(2);
        document.getElementById('speedstudySpeedCrashRate').textContent = speedCrashRate.toFixed(2);
        document.getElementById('speedstudyCrashRateCalc').textContent = crashRate.toFixed(2);
        document.getElementById('speedstudyCrashRateDisplay').style.display = 'block';

        warrantsState.speedstudy.crashAnalysis.crashRate = crashRate;
        warrantsState.speedstudy.crashAnalysis.speedRelatedRate = speedCrashRate;
    } else {
        document.getElementById('speedstudyCrashRateDisplay').style.display = 'none';
    }
}

/**
 * Update location source indicator (P1 FIX)
 * Shows which source is being used for crash data lookup
 */
function speedstudy_updateLocationSourceIndicator() {
    const sourceDiv = document.getElementById('speedstudyLocationSource');
    const nameSpan = document.getElementById('speedstudyLocationName');
    const badgeSpan = document.getElementById('speedstudySourceBadge');

    if (!sourceDiv || !nameSpan || !badgeSpan) return;

    const crashAnalysis = warrantsState.speedstudy?.crashAnalysis;
    if (!crashAnalysis || !crashAnalysis.locationUsed) {
        sourceDiv.style.display = 'none';
        return;
    }

    const location = crashAnalysis.locationUsed;
    const source = crashAnalysis.locationSource || 'unknown';

    // Set location name (truncate if too long)
    const displayName = location.length > 40 ? location.substring(0, 37) + '...' : location;
    nameSpan.textContent = displayName;
    nameSpan.title = location;

    // Set source badge with color coding
    const sourceConfig = {
        'selected': { label: 'Map Selection', bg: '#22c55e', color: 'white' },
        'studyName': { label: 'Study Name', bg: '#3b82f6', color: 'white' },
        'crossTab': { label: 'Cross-Tab', bg: '#8b5cf6', color: 'white' },
        'saved': { label: 'Saved', bg: '#64748b', color: 'white' },
        'unknown': { label: 'Auto', bg: '#94a3b8', color: 'white' }
    };

    const config = sourceConfig[source] || sourceConfig['unknown'];
    badgeSpan.textContent = config.label;
    badgeSpan.style.background = config.bg;
    badgeSpan.style.color = config.color;

    sourceDiv.style.display = 'block';
    console.log(`[Speed Study] Location source indicator: ${location} (${source})`);
}

/**
 * Clear location binding and allow study name input to take priority (P1 FIX)
 */
function speedstudy_clearLocationBinding() {
    // Clear the map/cross-tab selection
    warrantsState.selectedLocation = null;
    selectionState.location = null;

    // Clear crash analysis
    warrantsState.speedstudy.crashAnalysis = {
        period: warrantsState.speedstudy.crashAnalysis?.period || '3year',
        totalCrashes: 0,
        speedRelatedCrashes: 0,
        severityBreakdown: { K: 0, A: 0, B: 0, C: 0, O: 0 },
        autoPopulated: false,
        locationUsed: null,
        locationSource: null
    };

    // Hide location source indicator
    const sourceDiv = document.getElementById('speedstudyLocationSource');
    if (sourceDiv) sourceDiv.style.display = 'none';

    // Reset crash data display
    document.getElementById('speedstudyCrashDataContent').style.display = 'none';
    document.getElementById('speedstudyCrashNoData').style.display = 'block';
    document.getElementById('speedstudyCrashRateDisplay').style.display = 'none';

    showToast('Location binding cleared. Enter a study name to load crash data.', 'info');

    // If there's a study name in the input, try to load for that
    const studyName = document.getElementById('speedstudyName')?.value?.trim();
    if (studyName) {
        speedstudy_loadCrashData();
    }
}

/**
 * Auto-populate form fields from road properties (P2 FIX)
 * Uses data from warrantsState.roadProperties when available
 */
function speedstudy_autoPopulateFromRoadProps() {
    const roadProps = warrantsState.roadProperties;
    if (!roadProps) return;

    let fieldsPopulated = 0;

    // Auto-populate posted speed limit
    if (roadProps.postedSpeed) {
        const speedInput = document.getElementById('speedstudyPostedLimit');
        if (speedInput && !speedInput.value) {
            speedInput.value = roadProps.postedSpeed;
            warrantsState.speedstudy.config.postedSpeedLimit = parseInt(roadProps.postedSpeed);
            fieldsPopulated++;
        }
    }

    // Auto-populate AADT
    if (roadProps.aadt) {
        const aadtInput = document.getElementById('speedstudyAADT');
        if (aadtInput && !aadtInput.value) {
            aadtInput.value = roadProps.aadt;
            fieldsPopulated++;
        }
    }

    // Auto-populate area type
    if (roadProps.areaType) {
        const areaInput = document.getElementById('speedstudyAreaType');
        if (areaInput) {
            const areaType = roadProps.areaType.toLowerCase();
            if (areaType.includes('urban')) areaInput.value = 'urban';
            else if (areaType.includes('suburban')) areaInput.value = 'suburban';
            else if (areaType.includes('rural')) areaInput.value = 'rural';
            fieldsPopulated++;
        }
    }

    // Auto-populate road class based on functional class
    if (roadProps.funcClass) {
        const roadClassInput = document.getElementById('speedstudyRoadClass');
        if (roadClassInput) {
            const funcClass = roadProps.funcClass.toLowerCase();
            if (funcClass.includes('interstate') || funcClass.includes('freeway')) {
                roadClassInput.value = 'freeway';
            } else if (funcClass.includes('arterial') || funcClass.includes('principal')) {
                roadClassInput.value = 'arterial';
            } else if (funcClass.includes('collector')) {
                roadClassInput.value = 'collector';
            } else if (funcClass.includes('local')) {
                roadClassInput.value = 'local';
            }
            fieldsPopulated++;
        }
    }

    // Auto-populate number of lanes
    if (roadProps.lanes) {
        const lanesInput = document.getElementById('speedstudyLanes');
        if (lanesInput && !lanesInput.value) {
            lanesInput.value = roadProps.lanes;
            fieldsPopulated++;
        }
    }

    // Auto-populate median type
    if (roadProps.median) {
        const medianInput = document.getElementById('speedstudyMedian');
        if (medianInput) {
            const median = roadProps.median.toLowerCase();
            if (median.includes('raised') || median.includes('curbed')) {
                medianInput.value = 'raised';
            } else if (median.includes('painted') || median.includes('twltl')) {
                medianInput.value = 'painted';
            } else if (median.includes('none') || median.includes('undivided')) {
                medianInput.value = 'none';
            }
            fieldsPopulated++;
        }
    }

    if (fieldsPopulated > 0) {
        speedstudy_updateConfigFromUI();
        console.log(`[Speed Study] Auto-populated ${fieldsPopulated} field(s) from road properties`);
    }
}

/**
 * Toggle AI panel
 */
function speedstudy_toggleAIPanel() {
    const content = document.getElementById('speedstudyAIPanelContent');
    const arrow = document.getElementById('speedstudyAIPanelArrow');
    const text = document.getElementById('speedstudyAIPanelToggleText');

    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        arrow.textContent = '▲';
        text.textContent = 'Collapse';
    } else {
        content.style.display = 'none';
        arrow.textContent = '▼';
        text.textContent = 'Expand';
    }
}

/**
 * Handle disclaimer checkbox
 */
function speedstudy_handleDisclaimerCheckbox() {
    const checkbox = document.getElementById('speedstudyDisclaimerCheckbox');
    const extractBtn = document.getElementById('speedstudyExtractBtn');
    extractBtn.disabled = !checkbox.checked;
}

/**
 * Toggle disclaimer section visibility
 */
function speedstudy_toggleDisclaimer() {
    const content = document.getElementById('speedstudyDisclaimerContent');
    const arrow = document.getElementById('speedstudyDisclaimerArrow');

    if (content.style.display === 'block') {
        content.style.display = 'none';
        arrow.textContent = '▼';
    } else {
        content.style.display = 'block';
        arrow.textContent = '▲';
    }
}

/**
 * Clear AI uploads and reset state
 */
function speedstudy_clearAIUploads() {
    speedstudyUploadedFiles = {};
    speedstudyAllValidationResults = [];

    // Reset day slots
    for (let i = 1; i <= 5; i++) {
        const slot = document.getElementById(`speedstudySlot${i}`);
        if (slot) {
            slot.style.border = '2px solid #e2e8f0';
            slot.style.background = 'transparent';
            slot.querySelector('.slot-icon').textContent = '○';
        }
    }

    // Clear file input
    const fileInput = document.getElementById('speedstudyBulkFileInput');
    if (fileInput) fileInput.value = '';

    // Reset status
    const statusEl = document.getElementById('speedstudyExtractionStatus');
    if (statusEl) statusEl.innerHTML = '';

    // Hide progress
    document.getElementById('speedstudyExtractionProgress')?.classList.add('hidden');

    // Hide validation and preview panels
    const validationPanel = document.getElementById('speedstudyValidationPanel');
    const previewPanel = document.getElementById('speedstudyDataPreviewPanel');
    if (validationPanel) validationPanel.style.display = 'none';
    if (previewPanel) previewPanel.style.display = 'none';

    showToast('AI uploads cleared', 'info');
}

// Note: speedstudyUploadedFiles, speedstudyAllValidationResults, speedstudyPendingExtractions
// are declared earlier in the Speed Study Global State section (around line 59605)

/**
 * Handle files selected for AI extraction
 */
function speedstudy_onFilesSelected(files) {
    if (!files || files.length === 0) return;

    const maxFiles = 5;
    const filesToProcess = Array.from(files).slice(0, maxFiles);

    // Update day slots
    filesToProcess.forEach((file, index) => {
        const slot = document.getElementById(`speedstudySlot${index + 1}`);
        if (slot) {
            slot.style.border = '2px solid #22c55e';
            slot.style.background = '#f0fdf4';
            slot.querySelector('.slot-icon').textContent = '✓';
        }
        speedstudyUploadedFiles[`slot${index + 1}`] = { file, status: 'ready' };
    });

    showToast(`${filesToProcess.length} file(s) ready for extraction`, 'success');
}

/**
 * Read file content for Speed Study extraction (supports Excel, PDF, CSV, images)
 */
function speedstudy_readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        } else if (file.name.match(/\.xlsx?$/i)) {
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
                        const base64 = btoa(String.fromCharCode(...new Uint8Array(e.target.result)));
                        resolve(`[Excel file - base64 encoded]\n${base64.substring(0, 50000)}`);
                    }
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        } else if (file.type.startsWith('image/')) {
            reader.onload = e => {
                const base64 = e.target.result.split(',')[1];
                resolve(`[Image file - base64 encoded]\n${base64.substring(0, 50000)}`);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        } else if (file.name.endsWith('.pdf')) {
            reader.onload = e => {
                const base64 = btoa(String.fromCharCode(...new Uint8Array(e.target.result)));
                resolve(`[PDF file - base64 encoded]\n${base64.substring(0, 50000)}`);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        } else {
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        }
    });
}

/**
 * Extract single speed study file with dual-agent AI
 */
async function speedstudy_extractSingleFileWithDualAI(apiKey, file, slotNum) {
    const fileContent = await speedstudy_readFileContent(file);
    const countType = warrantsState.speedstudy?.config?.countType || '12hr';
    const is24hr = countType === '24hr';
    const expectedHours = is24hr ? 24 : 12;
    const hourRange = is24hr ? 'all 24 hours (0-23)' : '12 hours from 6 AM to 6 PM (hours 6-17)';
    const hoursList = is24hr ? '0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23' : '6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17';
    const postedLimit = warrantsState.speedstudy?.config?.postedSpeedLimit || 35;

    // ========== AGENT 1: EXTRACTION ==========
    const extractionPrompt = `You are an expert traffic speed study data extraction specialist. Your task is to extract speed study data from traffic speed measurement files.

CRITICAL: READ THE ENTIRE FILE AND EXTRACT ALL SPEED DATA

FILE FORMAT GUIDANCE:
- Excel files (.xlsx, .xls): Check ALL sheets - data may be split across multiple tabs (by direction, by date, hourly summaries)
- PDF files: Data may span multiple pages - extract from ALL pages
- Images: Read all visible data in tables/charts carefully
- CSV/Text: Parse column structure from headers

STEP 1: EXTRACT STUDY CONFIGURATION
Look for and extract these details:
- Study location/road name (e.g., "Broad Street", "SR-250", "Rt 33 near Bypass")
- Study type: "spot" (single location) or "corridor" (multiple points)
- Posted speed limit (e.g., "Posted: 35 mph", "Speed Limit: 45")
- Roadway classification (arterial, collector, local, freeway)
- Area type (urban, suburban, rural)
- Number of lanes, median type if shown
- Study date(s) and time period
- Collection method (radar, tube counter, laser, video)
- Direction of travel studied (NB, SB, EB, WB, or both)

STEP 2: EXTRACT HOURLY SPEED DATA
For each hour, extract these statistics if available:
- N or Sample Size: Number of vehicles measured
- Mean Speed: Average speed of vehicles
- P50 or Median: 50th percentile speed
- P85 or 85th Percentile: 85th percentile speed (KEY METRIC for speed limit setting)
- P95 or 95th Percentile: 95th percentile speed
- % Above Limit: Percentage exceeding posted speed limit

Count Type: ${expectedHours}-HOUR (${hourRange})
You MUST extract exactly these hours: ${hoursList}
Posted Speed Limit to check against: ${postedLimit} mph

STEP 3: IDENTIFY KEY METRICS
- Overall 85th percentile speed (most important for speed limit determination)
- Average daily sample size
- Pace speed (10 mph range with highest % of vehicles)
- Speed compliance rate

STEP 4: EXTRACT DATE AND CONDITIONS
- Date of study in YYYY-MM-DD format
- Day of week
- Weather conditions if noted (clear, cloudy, rain)
- Any special conditions (school zone, work zone)

STEP 5: VERIFY YOUR EXTRACTION
- Sum all sample sizes
- Check that 85th percentile values are reasonable (typically between 5 mph below to 15 mph above posted limit)
- Ensure all required hours are captured

Return ONLY valid JSON (no markdown, no explanation):
{
  "locationName": "Broad Street near Willow Lawn",
  "studyType": "spot",
  "postedSpeedLimit": 35,
  "roadwayClass": "arterial",
  "areaType": "urban",
  "numberOfLanes": 4,
  "medianType": "raised",
  "collectionMethod": "radar",
  "direction": "both",
  "date": "2024-03-15",
  "dayOfWeek": "Friday",
  "weatherCondition": "clear",
  "totalSampleSize": 1250,
  "overallMeanSpeed": 38.2,
  "overallP85": 44.5,
  "overallP95": 48.1,
  "percentAboveLimit": 68.5,
  "confidence": 95,
  "hourlyData": {
    "6": { "n": 45, "mean": 36.5, "p50": 35.0, "p85": 42.0, "p95": 46.0, "aboveLimit": 28 },
    "7": { "n": 120, "mean": 37.8, "p50": 37.0, "p85": 43.5, "p95": 47.5, "aboveLimit": 75 },
    ...
  }
}

IMPORTANT NOTES:
- P85 (85th percentile) is the KEY METRIC used for speed limit setting per ITE guidelines
- If only raw vehicle speeds are provided, calculate the statistics
- If data is by direction, combine or report primary direction
- ALWAYS include all ${expectedHours} hours
- Report confidence 0-100 based on data completeness`;

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
                    content: `Extract speed study data from this file. Pay attention to 85th percentile speeds.\n\nFilename: "${file.name}"\n\nFile content:\n${fileContent.substring(0, 120000)}`
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

        if (!extractedData.hourlyData) return { success: false, error: 'Missing hourlyData in extraction' };

        // ========== AGENT 2: VALIDATION ==========
        const validationPrompt = `You are an expert QA/QC speed study data validator. Your task is to VERIFY and CORRECT extracted speed data.

CRITICAL SETTINGS:
- COUNT TYPE: ${expectedHours}-HOUR COUNT
- EXPECTED HOURS: ${hourRange}
- POSTED SPEED LIMIT: ${postedLimit} mph

VALIDATION PROCEDURE:

STEP 1: VERIFY HOUR COUNT
- User expects ${expectedHours} hours of data
- Check that all expected hours are present
- If hours are missing, extract from source

STEP 2: VALIDATE SPEED VALUES
- 85th percentile should typically be within 5-15 mph of posted limit
- Mean speed should be less than 85th percentile
- P50 (median) should be between mean and P85
- P95 should be greater than P85
- Flag any statistically improbable values

STEP 3: CHECK SAMPLE SIZES
- Each hour should have a reasonable sample size
- Very low counts (<10) reduce reliability
- Total sample should be adequate (ITE recommends 100+ vehicles minimum)

STEP 4: VERIFY CALCULATIONS
- % above limit should match N values and posted limit
- Overall statistics should reflect hourly data aggregation

STEP 5: CHECK FOR MISSING DATA
- Were all hours extracted?
- Was data from all directions/sheets captured?

EXTRACTED DATA:
${JSON.stringify(extractedData, null, 2)}

ORIGINAL SOURCE FILE (filename: "${file.name}"):
${fileContent.substring(0, 80000)}

Return ONLY valid JSON:
{
  "isValid": true,
  "confidence": 95,
  "totalSampleSize": 1250,
  "calculatedP85": 44.5,
  "spotCheckResults": [
    {"hour": "7", "status": "match"},
    {"hour": "12", "status": "match"},
    {"hour": "17", "status": "match"}
  ],
  "errors": [],
  "warnings": [],
  "correctedHourlyData": null,
  "correctedConfig": null,
  "summary": "All values verified, speed data looks consistent"
}

OR if corrections needed:
{
  "isValid": false,
  "confidence": 75,
  "errors": [{"issue": "Hour 12 P85 was incorrectly extracted, corrected from 55 to 45"}],
  "warnings": [{"issue": "Sample sizes appear low for morning hours"}],
  "correctedHourlyData": { ... },
  "correctedConfig": {
    "locationName": "corrected name if needed",
    "postedSpeedLimit": 35
  },
  "summary": "Corrected P85 value for hour 12"
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
                    messages: [{ role: 'user', content: 'Validate this extracted speed study data against the source file. Check all P85 values carefully.' }]
                })
            });

            if (validationResponse.ok) {
                const validationResult = await validationResponse.json();
                const validationText = validationResult.content[0].text;
                const validationJsonMatch = validationText.match(/\{[\s\S]*\}/);

                if (validationJsonMatch) {
                    const validationData = JSON.parse(validationJsonMatch[0]);

                    // Use corrected data if available
                    const finalData = validationData.correctedHourlyData
                        ? { ...extractedData, hourlyData: validationData.correctedHourlyData }
                        : extractedData;

                    // Apply config corrections if provided
                    if (validationData.correctedConfig) {
                        Object.assign(finalData, validationData.correctedConfig);
                    }

                    return { success: true, data: finalData, validation: validationData };
                }
            }
        } catch (e) {
            console.warn('[Speed Study] Validation agent error:', e);
        }

        // Return extraction data even if validation failed
        return { success: true, data: extractedData, validation: null };

    } catch (e) {
        console.error('[Speed Study] Extraction error:', e);
        return { success: false, error: e.message };
    }
}

/**
 * Extract all files with AI (full implementation)
 */
async function speedstudy_extractAllWithAI() {
    const files = Object.values(speedstudyUploadedFiles).map(f => f.file).filter(Boolean);

    if (files.length === 0) {
        showToast('Please upload speed study files first', 'warning');
        return;
    }

    const apiKey = getCMFAIApiKey();
    if (!apiKey) {
        showToast('Please configure your API key in the header bar to use AI extraction', 'warning');
        return;
    }

    // Get UI elements
    const progressDiv = document.getElementById('speedstudyExtractionProgress');
    const progressFill = document.getElementById('speedstudyProgressFill');
    const progressText = document.getElementById('speedstudyProgressText');
    const statusEl = document.getElementById('speedstudyExtractionStatus');

    progressDiv.classList.remove('hidden');
    progressFill.style.width = '0%';

    let processedCount = 0;
    const totalFiles = files.length;
    const allExtractions = [];

    for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const slotNum = i + 1;
        const slot = document.getElementById(`speedstudySlot${slotNum}`);
        const slotIcon = slot?.querySelector('.slot-icon');

        if (slotIcon) slotIcon.textContent = '⏳';
        progressText.textContent = `Extracting Day ${slotNum}: ${file.name}...`;
        progressFill.style.width = `${(i / totalFiles) * 100}%`;

        try {
            const result = await speedstudy_extractSingleFileWithDualAI(apiKey, file, slotNum);

            if (result.success && result.data) {
                if (slotIcon) slotIcon.textContent = '✓';
                if (slot) slot.style.borderColor = '#22c55e';

                allExtractions.push({
                    slot: slotNum,
                    filename: file.name,
                    data: result.data,
                    validation: result.validation
                });

                // Populate grid with first file's data
                if (allExtractions.length === 1 && result.data.hourlyData) {
                    speedstudy_populateGridFromExtraction(result.data);
                }
            } else {
                if (slotIcon) slotIcon.textContent = '✗';
                if (slot) slot.style.borderColor = '#dc2626';
                console.error(`[Speed Study] Extraction failed for ${file.name}:`, result.error);
            }
        } catch (err) {
            if (slotIcon) slotIcon.textContent = '✗';
            if (slot) slot.style.borderColor = '#dc2626';
            console.error(`[Speed Study] Error processing ${file.name}:`, err);
        }

        processedCount++;
    }

    progressFill.style.width = '100%';
    progressText.textContent = `Extraction complete! ${allExtractions.length}/${totalFiles} files processed.`;

    // Store for later use
    speedstudyPendingExtractions = allExtractions;
    speedstudyAllValidationResults = allExtractions.map(ext => ({
        slot: ext.slot,
        filename: ext.filename,
        status: ext.validation?.isValid === false ? 'corrected' : 'success',
        message: ext.validation?.summary || 'Extraction successful',
        data: ext.data,
        validation: ext.validation,
        p85: ext.data?.overallP85 || '--'
    }));

    if (allExtractions.length > 0) {
        statusEl.innerHTML = `<span style="color:#22c55e">✓ Speed data extracted from ${allExtractions.length} file(s). Review results below.</span>`;

        // Show validation results panel
        const validationPanel = document.getElementById('speedstudyValidationPanel');
        const validationResults = document.getElementById('speedstudyValidationResults');
        if (validationPanel && validationResults) {
            validationPanel.style.display = 'block';

            let validationHtml = '<div style="display:flex;flex-direction:column;gap:8px">';
            speedstudyAllValidationResults.forEach(result => {
                const statusIcon = result.status === 'success' ? '✓' : result.status === 'corrected' ? '🔧' : '⚠️';
                const statusColor = result.status === 'success' ? '#22c55e' : result.status === 'corrected' ? '#f59e0b' : '#dc2626';
                validationHtml += `
                    <div style="padding:10px;background:white;border-radius:6px;border:1px solid #e2e8f0;display:flex;align-items:center;gap:12px">
                        <span style="font-size:1.25rem">${statusIcon}</span>
                        <div style="flex:1">
                            <div style="font-weight:600;font-size:.85rem;color:#334155">Day ${result.slot}: ${result.filename}</div>
                            <div style="font-size:.8rem;color:#64748b">${result.message}</div>
                        </div>
                        <div style="text-align:right">
                            <div style="font-size:.75rem;color:#64748b">85th Percentile</div>
                            <div style="font-size:1.1rem;font-weight:700;color:${statusColor}">${result.p85} mph</div>
                        </div>
                    </div>`;
            });
            validationHtml += '</div>';
            validationResults.innerHTML = validationHtml;
        }

        // Show data preview panel
        const previewPanel = document.getElementById('speedstudyDataPreviewPanel');
        const previewDiv = document.getElementById('speedstudyDataPreview');
        if (previewPanel && previewDiv) {
            previewPanel.style.display = 'block';

            const firstData = allExtractions[0].data;
            let previewHtml = `
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:16px">
                    <div style="padding:12px;background:#f0fdf4;border-radius:6px;text-align:center">
                        <div style="font-size:.75rem;color:#64748b">Location</div>
                        <div style="font-size:.9rem;font-weight:600;color:#166534">${firstData.locationName || 'Not specified'}</div>
                    </div>
                    <div style="padding:12px;background:#fffbeb;border-radius:6px;text-align:center">
                        <div style="font-size:.75rem;color:#64748b">Posted Limit</div>
                        <div style="font-size:1.25rem;font-weight:700;color:#92400e">${firstData.postedSpeedLimit || '--'} mph</div>
                    </div>
                    <div style="padding:12px;background:#f0f9ff;border-radius:6px;text-align:center">
                        <div style="font-size:.75rem;color:#64748b">Mean Speed</div>
                        <div style="font-size:1.25rem;font-weight:700;color:#0369a1">${firstData.overallMeanSpeed || '--'} mph</div>
                    </div>
                    <div style="padding:12px;background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);border-radius:6px;text-align:center;border:2px solid #f59e0b">
                        <div style="font-size:.75rem;color:#92400e">85th Percentile</div>
                        <div style="font-size:1.5rem;font-weight:800;color:#92400e">${firstData.overallP85 || '--'} mph</div>
                    </div>
                    <div style="padding:12px;background:#fef2f2;border-radius:6px;text-align:center">
                        <div style="font-size:.75rem;color:#64748b">95th Percentile</div>
                        <div style="font-size:1.25rem;font-weight:700;color:#dc2626">${firstData.overallP95 || '--'} mph</div>
                    </div>
                    <div style="padding:12px;background:#f8fafc;border-radius:6px;text-align:center">
                        <div style="font-size:.75rem;color:#64748b">Sample Size</div>
                        <div style="font-size:1.25rem;font-weight:700;color:#475569">${firstData.totalSampleSize || '--'}</div>
                    </div>
                </div>
                <div style="font-size:.85rem;color:#64748b">
                    <strong>Files Processed:</strong> ${allExtractions.length} |
                    <strong>Date:</strong> ${firstData.date || 'Not specified'} |
                    <strong>Method:</strong> ${firstData.collectionMethod || 'Not specified'}
                </div>`;
            previewDiv.innerHTML = previewHtml;
        }

        // Auto-fill config from first extraction
        const firstData = allExtractions[0].data;
        if (firstData.locationName) {
            const nameInput = document.getElementById('speedstudyName');
            if (nameInput && !nameInput.value) nameInput.value = firstData.locationName;
        }
        if (firstData.postedSpeedLimit) {
            const limitInput = document.getElementById('speedstudyPostedLimit');
            if (limitInput) limitInput.value = firstData.postedSpeedLimit;
        }
        if (firstData.roadwayClass) {
            const classInput = document.getElementById('speedstudyRoadClass');
            if (classInput) classInput.value = firstData.roadwayClass;
        }
        if (firstData.areaType) {
            const areaInput = document.getElementById('speedstudyAreaType');
            if (areaInput) areaInput.value = firstData.areaType;
        }
        if (firstData.numberOfLanes) {
            const lanesInput = document.getElementById('speedstudyLanes');
            if (lanesInput) lanesInput.value = firstData.numberOfLanes;
        }

        showToast(`AI extraction complete! ${allExtractions.length} file(s) processed.`, 'success');
    } else {
        statusEl.innerHTML = `<span style="color:#dc2626">✗ No data could be extracted. Please check your files.</span>`;
        showToast('Extraction failed. Please check file format.', 'danger');
    }
}

/**
 * Populate speed data grid from AI extraction
 */
function speedstudy_populateGridFromExtraction(data) {
    if (!data.hourlyData) return;

    const countType = warrantsState.speedstudy?.config?.countType || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;

    for (let hour = startHour; hour < endHour; hour++) {
        const hourData = data.hourlyData[hour] || data.hourlyData[String(hour)];
        if (hourData) {
            const nInput = document.getElementById(`speed_${hour}_n`);
            const meanInput = document.getElementById(`speed_${hour}_mean`);
            const p50Input = document.getElementById(`speed_${hour}_p50`);
            const p85Input = document.getElementById(`speed_${hour}_p85`);
            const p95Input = document.getElementById(`speed_${hour}_p95`);
            const aboveInput = document.getElementById(`speed_${hour}_above`);

            if (nInput && hourData.n) nInput.value = hourData.n;
            if (meanInput && hourData.mean) meanInput.value = hourData.mean;
            if (p50Input && hourData.p50) p50Input.value = hourData.p50;
            if (p85Input && hourData.p85) p85Input.value = hourData.p85;
            if (p95Input && hourData.p95) p95Input.value = hourData.p95;
            if (aboveInput && hourData.aboveLimit !== undefined) aboveInput.value = hourData.aboveLimit;
        }
    }

    // Set date if available
    if (data.date) {
        const dateInput = document.getElementById('speedstudyDate');
        if (dateInput) dateInput.value = data.date;
    }

    // Update totals
    speedstudy_updateTotals();
    showToast('Speed data populated in grid. Review and edit as needed.', 'info');
}

/**
 * Update day slots display
 */
function speedstudy_updateDaySlots() {
    const dayType = document.getElementById('speedstudyDayType')?.value || 'weekday';
    // Show/hide weekend slots based on selection
    for (let i = 1; i <= 5; i++) {
        const slot = document.getElementById(`speedstudySlot${i}`);
        if (slot) slot.style.display = dayType === 'weekday' || i <= 2 ? 'block' : 'none';
    }
}

/**
 * Toggle study type specific options
 */
function speedstudy_toggleStudyType() {
    const studyType = document.getElementById('speedstudyType')?.value || 'spot';
    // Could add study-type specific panels here
    console.log('[Speed Study] Study type changed to:', studyType);
}

/**
 * Import data from TMC if available
 */
function speedstudy_importFromTMC() {
    // Check if signal warrant has TMC data
    if (warrantsState.signal?.multiDayData && Object.keys(warrantsState.signal.multiDayData).length > 0) {
        showToast('TMC data found! Volume data can be used for exposure calculations.', 'info');
        // Could auto-populate AADT from TMC data here
    } else {
        showToast('No TMC data available. Enter AADT manually.', 'warning');
    }
}

/**
 * Start a new speed study - clears all data from IndexedDB and resets form
 */
async function speedstudy_newStudy() {
    const confirmed = confirm(
        '🗑️ Start New Speed Study?\n\n' +
        'This will clear ALL current speed study data including:\n' +
        '• Study configuration\n' +
        '• All entered speed data\n' +
        '• Analysis results\n' +
        '• Saved IndexedDB data\n\n' +
        'This action cannot be undone. Continue?'
    );

    if (!confirmed) return;

    try {
        showLoading('Clearing speed study data...');

        // Clear IndexedDB data
        if (typeof warrantDbDelete === 'function') {
            await warrantDbDelete('speedstudy').catch(e => console.warn('[Speed Study] IndexedDB delete error:', e));
        }

        // Clear localStorage
        localStorage.removeItem('speedStudyData');

        // Reset state to defaults
        warrantsState.speedstudy = {
            config: {
                studyName: '',
                studyType: 'spot',
                locationName: '',
                postedSpeedLimit: 35,
                roadwayClass: 'arterial',
                areaType: 'urban',
                numberOfLanes: 2,
                medianType: 'none',
                horizontalAlignment: 'tangent',
                grade: 0,
                countType: '12hr',
                minimumSampleSize: 100
            },
            multiDayData: {},
            averagingMethod: 'tue-wed-thu',
            volumeData: {
                source: 'manual',
                aadt: null,
                peakHourVolume: null,
                kFactor: 0.10,
                segmentLength: null
            },
            crashAnalysis: {
                period: '3year',
                totalCrashes: 0,
                speedRelatedCrashes: 0,
                fatalCrashes: 0,
                injuryCrashes: 0,
                crashRate: null,
                speedCrashRate: null
            },
            analysisResults: null,
            uploadedFiles: {},
            extractedData: null,
            extractionStatus: 'idle',
            pendingExtractions: [],
            reviewQueue: [],
            isReviewMode: false
        };

        // Reset UI form fields
        const formFields = {
            'speedstudyName': '',
            'speedstudyType': 'spot',
            'speedstudyPostedLimit': '35',
            'speedstudyRoadClass': 'arterial',
            'speedstudyAreaType': 'urban',
            'speedstudyLanes': '2',
            'speedstudyMedian': 'none',
            'speedstudyAlignment': 'tangent',
            'speedstudyGrade': '0',
            'speedstudyMethod': 'radar',
            'speedstudyAADT': '',
            'speedstudySegmentLength': '',
            'speedstudyCrashPeriod': '3',
            'speedstudyDate': '',
            'speedstudyDow': '2',
            'speedstudyWeather': 'clear'
        };

        for (const [id, value] of Object.entries(formFields)) {
            const el = document.getElementById(id);
            if (el) el.value = value;
        }

        // Reset speed data table
        speedstudy_initTable();

        // Hide results dashboard
        document.getElementById('speedstudyResultsDashboard').style.display = 'none';
        document.getElementById('speedstudyNoResults').style.display = 'block';

        // Reset day cards
        document.getElementById('speedstudyDayCardsGrid').innerHTML = '';
        document.getElementById('speedstudyAddedDaysSection').classList.add('hidden');
        document.getElementById('speedstudyDayCount').textContent = '0 days entered';

        // Reset crash data display
        document.getElementById('speedstudyCrashDataContent').style.display = 'none';
        document.getElementById('speedstudyCrashNoData').style.display = 'block';
        document.getElementById('speedstudyCrashRateDisplay').style.display = 'none';

        // Reset AI upload area
        document.getElementById('speedstudyValidationPanel').style.display = 'none';
        document.getElementById('speedstudyDataPreviewPanel').style.display = 'none';
        document.getElementById('speedstudyDisclaimerCheckbox').checked = false;
        document.getElementById('speedstudyExtractBtn').disabled = true;

        // Reset day slots
        for (let i = 1; i <= 5; i++) {
            const slot = document.getElementById(`speedstudySlot${i}`);
            if (slot) {
                slot.style.borderColor = '#e2e8f0';
                slot.style.background = '';
                slot.querySelector('.slot-icon').textContent = '○';
            }
        }

        hideLoading();
        showToast('Speed study cleared. Ready for new study.', 'success');
        console.log('[Speed Study] Data cleared, ready for new study');

    } catch (error) {
        hideLoading();
        console.error('[Speed Study] Error clearing data:', error);
        showToast('Error clearing data. Please refresh the page.', 'danger');
    }
}

/**
 * Generate professional PDF report for Speed Study
 */
async function speedstudy_generatePDFReport() {
    const results = warrantsState.speedstudy.analysisResults;
    if (!results) {
        showToast('Please run analysis first before exporting PDF', 'warning');
        return;
    }

    showLoading('Generating professional PDF report...');

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'letter');
        const cfg = warrantsState.speedstudy.config;

        // Colors
        const primaryColor = [245, 158, 11]; // Amber
        const headerBg = [45, 55, 72];
        const successColor = [16, 185, 129];
        const dangerColor = [220, 38, 38];

        // ============================================
        // PAGE 1: Executive Summary
        // ============================================
        let yPos = 15;

        // Header
        doc.setFillColor(...headerBg);
        doc.rect(0, 0, 220, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Speed Study Analysis Report', 15, 17);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('ITE/FHWA Methodology', 175, 17);

        yPos = 35;
        doc.setTextColor(0, 0, 0);

        // Study Info Box
        doc.setFillColor(255, 251, 235); // Amber-50
        doc.rect(15, yPos, 180, 40, 'F');
        doc.setDrawColor(252, 211, 77);
        doc.rect(15, yPos, 180, 40, 'S');

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(cfg.studyName || 'Speed Study', 20, yPos + 10);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const studyTypeLabels = { 'spot': 'Spot Speed Study', 'corridor': 'Corridor Speed Study', 'zone': 'Speed Zone Justification' };
        doc.text(`Study Type: ${studyTypeLabels[cfg.studyType] || cfg.studyType}`, 20, yPos + 18);
        doc.text(`Posted Speed Limit: ${cfg.postedSpeedLimit} mph`, 100, yPos + 18);

        const roadwayLabels = { 'local': 'Local Road', 'collector': 'Collector', 'arterial': 'Arterial', 'freeway': 'Freeway' };
        doc.text(`Roadway Class: ${roadwayLabels[cfg.roadwayClass] || cfg.roadwayClass}`, 20, yPos + 26);
        doc.text(`Area Type: ${cfg.areaType?.charAt(0).toUpperCase() + cfg.areaType?.slice(1)}`, 100, yPos + 26);

        doc.text(`Number of Lanes: ${cfg.numberOfLanes}`, 20, yPos + 34);
        doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`, 100, yPos + 34);

        yPos += 50;

        // Key Metrics Section
        doc.setFillColor(...primaryColor);
        doc.rect(15, yPos, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('KEY SPEED METRICS', 20, yPos + 6);
        doc.setTextColor(0, 0, 0);
        yPos += 15;

        const metricsData = [
            ['Total Sample Size', `${results.totalObservations} vehicles`, results.totalObservations >= 100 ? 'Adequate' : 'Low Sample'],
            ['Mean Speed', `${results.meanSpeed} mph`, ''],
            ['Median Speed (P50)', `${results.medianSpeed} mph`, ''],
            ['85th Percentile Speed', `${results.percentile85} mph`, '** KEY METRIC **'],
            ['95th Percentile Speed', `${results.percentile95} mph`, ''],
            ['Standard Deviation', `${results.standardDeviation} mph`, ''],
            ['Pace Range', results.paceRange ? `${results.paceRange.low}-${results.paceRange.high} mph` : 'N/A', results.pacePercent ? `${results.pacePercent}% in pace` : '']
        ];

        doc.autoTable({
            startY: yPos,
            head: [['Metric', 'Value', 'Notes']],
            body: metricsData,
            theme: 'striped',
            headStyles: { fillColor: primaryColor, fontSize: 9 },
            bodyStyles: { fontSize: 9 },
            columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 40, halign: 'center' }, 2: { cellWidth: 85 } },
            didParseCell: function(data) {
                if (data.row.index === 3 && data.section === 'body') {
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.fillColor = [254, 243, 199]; // Highlight 85th percentile
                }
            },
            margin: { left: 15, right: 15 }
        });
        yPos = doc.lastAutoTable.finalY + 10;

        // Speed Limit Recommendation Box
        const suggestedLimit = results.recommendation?.suggestedLimit || 'N/A';
        const postedLimit = cfg.postedSpeedLimit;
        const p85 = parseFloat(results.percentile85);
        let recommendationStatus = 'APPROPRIATE';
        let statusColor = successColor;

        if (suggestedLimit !== 'N/A') {
            if (suggestedLimit > postedLimit + 5) {
                recommendationStatus = 'INCREASE MAY BE WARRANTED';
                statusColor = [59, 130, 246]; // Blue
            } else if (suggestedLimit < postedLimit - 5) {
                recommendationStatus = 'REVIEW REQUIRED';
                statusColor = dangerColor;
            }
        }

        doc.setFillColor(...statusColor);
        doc.rect(15, yPos, 180, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('SPEED LIMIT RECOMMENDATION', 105, yPos + 8, { align: 'center' });
        doc.setFontSize(16);
        doc.text(`${suggestedLimit} MPH`, 105, yPos + 19, { align: 'center' });
        doc.setFontSize(8);
        doc.text(`Current: ${postedLimit} mph | 85th %: ${results.percentile85} mph | ${recommendationStatus}`, 105, yPos + 24, { align: 'center' });

        yPos += 35;
        doc.setTextColor(0, 0, 0);

        // Compliance Analysis
        doc.setFillColor(...primaryColor);
        doc.rect(15, yPos, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('COMPLIANCE ANALYSIS', 20, yPos + 6);
        doc.setTextColor(0, 0, 0);
        yPos += 15;

        const withinLimit = results.percentAboveLimit ? (100 - parseFloat(results.percentAboveLimit)).toFixed(1) : 'N/A';
        const complianceData = [
            ['Vehicles Within Posted Limit', `${withinLimit}%`, withinLimit >= 85 ? 'Good Compliance' : 'Low Compliance'],
            ['Vehicles Exceeding Limit', `${results.percentAboveLimit || 'N/A'}%`, ''],
            ['Est. Vehicles > Limit + 5 mph', `~${results.percentAbove5 || 'N/A'}%`, 'Estimated'],
            ['Est. Vehicles > Limit + 10 mph', `~${results.percentAbove10 || 'N/A'}%`, 'Estimated']
        ];

        doc.autoTable({
            startY: yPos,
            head: [['Compliance Metric', 'Value', 'Assessment']],
            body: complianceData,
            theme: 'striped',
            headStyles: { fillColor: [100, 116, 139], fontSize: 9 },
            bodyStyles: { fontSize: 9 },
            margin: { left: 15, right: 15 },
            didParseCell: function(data) {
                if (data.column.index === 2 && data.section === 'body' && data.row.index === 0) {
                    const val = parseFloat(data.cell.text[0]);
                    if (data.cell.text[0].includes('Good')) {
                        data.cell.styles.textColor = successColor;
                        data.cell.styles.fontStyle = 'bold';
                    } else if (data.cell.text[0].includes('Low')) {
                        data.cell.styles.textColor = dangerColor;
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
            }
        });
        yPos = doc.lastAutoTable.finalY + 10;

        // Crash Data (if available)
        const crashData = warrantsState.speedstudy.crashAnalysis;
        if (crashData && crashData.totalCrashes > 0) {
            doc.setFillColor(...primaryColor);
            doc.rect(15, yPos, 180, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('CRASH DATA ANALYSIS', 20, yPos + 6);
            doc.setTextColor(0, 0, 0);
            yPos += 15;

            const crashTableData = [
                ['Total Crashes', crashData.totalCrashes, `${crashData.period || '3-year'} analysis period`],
                ['Speed-Related Crashes', crashData.speedRelatedCrashes, `${((crashData.speedRelatedCrashes / crashData.totalCrashes) * 100).toFixed(1)}% of total`],
                ['Fatal Crashes (K)', crashData.fatalCrashes || 0, ''],
                ['Serious Injury (A)', crashData.injuryCrashes || 0, ''],
                ['Crash Rate', crashData.crashRate ? `${crashData.crashRate} per 100M VMT` : 'N/A', ''],
                ['Speed Crash Rate', crashData.speedCrashRate ? `${crashData.speedCrashRate} per 100M VMT` : 'N/A', '']
            ];

            doc.autoTable({
                startY: yPos,
                head: [['Crash Metric', 'Value', 'Notes']],
                body: crashTableData,
                theme: 'striped',
                headStyles: { fillColor: dangerColor, fontSize: 9 },
                bodyStyles: { fontSize: 9 },
                margin: { left: 15, right: 15 }
            });
            yPos = doc.lastAutoTable.finalY + 10;
        }

        // Footer for Page 1
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(128, 128, 128);
        doc.text(`Generated by ${getReportAttribution()} - Speed Study Analyzer | ${new Date().toLocaleString()}`, 105, 270, { align: 'center' });
        doc.text('Page 1', 195, 270);

        // ============================================
        // PAGE 2: Hourly Data & Multi-Day Summary
        // ============================================
        doc.addPage();
        yPos = 15;

        // Appendix Header
        doc.setFillColor(...headerBg);
        doc.rect(0, 0, 220, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('APPENDIX A: Detailed Speed Data', 15, 14);
        doc.setTextColor(0, 0, 0);
        yPos = 30;

        // Multi-day summary
        const multiDayData = warrantsState.speedstudy.multiDayData;
        if (multiDayData && Object.keys(multiDayData).length > 0) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('Study Days Summary', 15, yPos);
            yPos += 8;

            const dayRows = Object.entries(multiDayData).map(([key, day]) => {
                const dowNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const hourlyData = day.hourlyData || {};
                const totalN = Object.values(hourlyData).reduce((sum, h) => sum + (parseInt(h.n) || 0), 0);
                const speeds = Object.values(hourlyData).filter(h => h.p85).map(h => parseFloat(h.p85));
                const avgP85 = speeds.length > 0 ? (speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(1) : 'N/A';

                return [
                    key,
                    day.date || 'N/A',
                    dowNames[day.dow] || 'N/A',
                    totalN,
                    avgP85,
                    day.weather?.charAt(0).toUpperCase() + day.weather?.slice(1) || 'Clear'
                ];
            });

            doc.autoTable({
                startY: yPos,
                head: [['Day Key', 'Date', 'Day of Week', 'Sample Size', 'Avg P85 (mph)', 'Weather']],
                body: dayRows,
                theme: 'striped',
                headStyles: { fillColor: primaryColor, fontSize: 8 },
                bodyStyles: { fontSize: 8 },
                margin: { left: 15, right: 15 }
            });
            yPos = doc.lastAutoTable.finalY + 15;
        }

        // Hourly breakdown if available
        if (results.hourlyBreakdown && results.hourlyBreakdown.length > 0) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('Hourly Speed Statistics (Averaged)', 15, yPos);
            yPos += 8;

            const hourlyRows = results.hourlyBreakdown.map(h => [
                `${String(h.hour).padStart(2, '0')}:00`,
                h.n || 0,
                h.mean || '--',
                h.p50 || '--',
                h.p85 || '--',
                h.p95 || '--',
                h.aboveLimit || '--'
            ]);

            doc.autoTable({
                startY: yPos,
                head: [['Hour', 'N', 'Mean', 'P50', 'P85', 'P95', '> Limit']],
                body: hourlyRows,
                theme: 'striped',
                headStyles: { fillColor: primaryColor, fontSize: 8 },
                bodyStyles: { fontSize: 8 },
                columnStyles: {
                    0: { cellWidth: 20 },
                    1: { cellWidth: 20, halign: 'center' },
                    2: { cellWidth: 25, halign: 'center' },
                    3: { cellWidth: 25, halign: 'center' },
                    4: { cellWidth: 25, halign: 'center', fontStyle: 'bold' },
                    5: { cellWidth: 25, halign: 'center' },
                    6: { cellWidth: 25, halign: 'center' }
                },
                margin: { left: 15, right: 15 }
            });
            yPos = doc.lastAutoTable.finalY + 15;
        }

        // Roadway characteristics
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Study Location Characteristics', 15, yPos);
        yPos += 8;

        const medianLabels = { 'none': 'No Median', 'twltl': 'Two-Way Left Turn Lane', 'raised': 'Raised Median', 'painted': 'Painted Median' };
        const alignmentLabels = { 'tangent': 'Tangent (Straight)', 'curve': 'Horizontal Curve' };
        const methodLabels = { 'radar': 'Radar/Lidar', 'tubes': 'Pneumatic Tubes', 'video': 'Video Analysis', 'probe': 'Probe Data', 'manual': 'Manual Stopwatch' };

        const locationData = [
            ['Posted Speed Limit', `${cfg.postedSpeedLimit} mph`],
            ['Roadway Classification', roadwayLabels[cfg.roadwayClass] || cfg.roadwayClass],
            ['Area Type', cfg.areaType?.charAt(0).toUpperCase() + cfg.areaType?.slice(1)],
            ['Number of Lanes', cfg.numberOfLanes],
            ['Median Type', medianLabels[cfg.medianType] || cfg.medianType],
            ['Horizontal Alignment', alignmentLabels[cfg.horizontalAlignment] || cfg.horizontalAlignment],
            ['Grade', `${cfg.grade}%`],
            ['Data Collection Method', methodLabels[cfg.method] || cfg.method || 'Not specified']
        ];

        doc.autoTable({
            startY: yPos,
            body: locationData,
            theme: 'plain',
            bodyStyles: { fontSize: 9 },
            columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold' }, 1: { cellWidth: 120 } },
            margin: { left: 15, right: 15 }
        });

        // Footer for Page 2
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(128, 128, 128);
        doc.text(`Generated by ${getReportAttribution()} - Speed Study Analyzer | ${new Date().toLocaleString()}`, 105, 270, { align: 'center' });
        doc.text('Page 2', 195, 270);

        // ============================================
        // PAGE 3: ITE Methodology Reference
        // ============================================
        doc.addPage();
        yPos = 15;

        doc.setFillColor(...headerBg);
        doc.rect(0, 0, 220, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('APPENDIX B: Methodology & References', 15, 14);
        doc.setTextColor(0, 0, 0);
        yPos = 30;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('ITE 85th Percentile Speed Methodology', 15, yPos);
        yPos += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const methodText = [
            'The 85th percentile speed is the speed at or below which 85% of vehicles travel under',
            'free-flow conditions. Per ITE guidelines, speed limits are typically set at the 85th',
            'percentile speed rounded to the nearest 5 mph increment.',
            '',
            'This methodology is based on:',
            '• ITE Manual of Transportation Engineering Studies, 3rd Edition',
            '• FHWA Speed Management Guidelines',
            '• NCHRP Report 504: Design Speed, Operating Speed, and Posted Speed'
        ];

        methodText.forEach(line => {
            doc.text(line, 20, yPos);
            yPos += 5;
        });

        yPos += 10;

        doc.setFont('helvetica', 'bold');
        doc.text('Sample Size Requirements', 15, yPos);
        yPos += 8;

        doc.setFont('helvetica', 'normal');
        const sampleText = [
            '• ITE Minimum: 100 vehicles for reliable percentile calculations',
            '• Preferred: 384+ vehicles for 95% confidence with ±5% margin of error',
            '• FHWA recommends at least 50 vehicles per hour during peak periods',
            `• This study collected ${results.totalObservations} vehicle observations`
        ];

        sampleText.forEach(line => {
            doc.text(line, 20, yPos);
            yPos += 5;
        });

        yPos += 10;

        doc.setFont('helvetica', 'bold');
        doc.text('Adjustment Factors Considered', 15, yPos);
        yPos += 8;

        doc.setFont('helvetica', 'normal');
        const adjustText = [
            '• Roadside Development: Schools, parks, hospitals, commercial areas',
            '• Crash History: Locations with high crash frequency may warrant lower limits',
            '• Pedestrian/Bicycle Activity: High non-motorized volumes support lower limits',
            '• Roadway Geometry: Horizontal curves, vertical grades, sight distance',
            '• Speed Consistency: Avoid large differentials between adjacent segments'
        ];

        adjustText.forEach(line => {
            doc.text(line, 20, yPos);
            yPos += 5;
        });

        yPos += 15;

        // Disclaimer
        doc.setFillColor(255, 243, 205);
        doc.rect(15, yPos, 180, 35, 'F');
        doc.setDrawColor(245, 158, 11);
        doc.rect(15, yPos, 180, 35, 'S');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL ENGINEERING DISCLAIMER', 20, yPos + 8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const disclaimerLines = doc.splitTextToSize(
            'This report is generated as an analysis aid and does NOT constitute professional engineering services. ' +
            'All speed study analyses and recommendations MUST be reviewed, verified, and approved by a licensed ' +
            'Professional Engineer (PE) before implementation. Speed limit decisions should consider local conditions, ' +
            'crash history, and community input in addition to the 85th percentile methodology.',
            170
        );
        doc.text(disclaimerLines, 20, yPos + 15);

        // Footer for Page 3
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(128, 128, 128);
        doc.text(`Generated by ${getReportAttribution()} - Speed Study Analyzer | ${new Date().toLocaleString()}`, 105, 270, { align: 'center' });
        doc.text('Page 3', 195, 270);

        // Save the PDF
        const filename = `Speed_Study_${(cfg.studyName || 'Report').replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);

        showToast('PDF report generated successfully!', 'success');

    } catch (error) {
        console.error('[Speed Study] PDF generation error:', error);
        showToast('Error generating PDF report', 'danger');
    } finally {
        hideLoading();
    }
}

/**
 * Export comprehensive CSV for Speed Study analysis
 */
function speedstudy_exportCSV() {
    const results = warrantsState.speedstudy.analysisResults;
    const cfg = warrantsState.speedstudy.config;

    if (!results) {
        showToast('Please run analysis first before exporting CSV', 'warning');
        return;
    }

    // Build comprehensive CSV content
    let csv = 'Speed Study Analysis Export\n';
    csv += `Generated,${new Date().toISOString()}\n`;
    csv += `Methodology,ITE 85th Percentile Speed Study\n\n`;

    // Study Configuration Section
    csv += 'STUDY CONFIGURATION\n';
    csv += `Study Name,${cfg.studyName || 'Unnamed Study'}\n`;
    csv += `Study Type,${cfg.studyType}\n`;
    csv += `Posted Speed Limit (mph),${cfg.postedSpeedLimit}\n`;
    csv += `Roadway Classification,${cfg.roadwayClass}\n`;
    csv += `Area Type,${cfg.areaType}\n`;
    csv += `Number of Lanes,${cfg.numberOfLanes}\n`;
    csv += `Median Type,${cfg.medianType}\n`;
    csv += `Horizontal Alignment,${cfg.horizontalAlignment}\n`;
    csv += `Grade (%),${cfg.grade}\n`;
    csv += `Data Collection Method,${cfg.method || 'Not specified'}\n\n`;

    // Key Results Section
    csv += 'KEY SPEED METRICS\n';
    csv += `Total Sample Size (vehicles),${results.totalObservations}\n`;
    csv += `Mean Speed (mph),${results.meanSpeed}\n`;
    csv += `Median Speed / P50 (mph),${results.medianSpeed}\n`;
    csv += `85th Percentile Speed (mph),${results.percentile85}\n`;
    csv += `95th Percentile Speed (mph),${results.percentile95}\n`;
    csv += `Standard Deviation (mph),${results.standardDeviation}\n`;
    csv += `Pace Range (mph),${results.paceRange ? `${results.paceRange.low}-${results.paceRange.high}` : 'N/A'}\n`;
    csv += `Percent in Pace,${results.pacePercent || 'N/A'}%\n\n`;

    // Compliance Section
    csv += 'COMPLIANCE ANALYSIS\n';
    const withinLimit = results.percentAboveLimit ? (100 - parseFloat(results.percentAboveLimit)).toFixed(1) : 'N/A';
    csv += `Percent Within Posted Limit,${withinLimit}%\n`;
    csv += `Percent Exceeding Limit,${results.percentAboveLimit || 'N/A'}%\n`;
    csv += `Est. Percent > Limit + 5 mph,${results.percentAbove5 || 'N/A'}%\n`;
    csv += `Est. Percent > Limit + 10 mph,${results.percentAbove10 || 'N/A'}%\n\n`;

    // Recommendation Section
    csv += 'ITE SPEED LIMIT RECOMMENDATION\n';
    csv += `Current Posted Limit (mph),${cfg.postedSpeedLimit}\n`;
    csv += `85th Percentile (mph),${results.percentile85}\n`;
    csv += `Suggested Speed Limit (mph),${results.recommendation?.suggestedLimit || 'N/A'}\n`;
    csv += `Adjustment Reason,${(results.recommendation?.adjustmentReason || 'N/A').replace(/,/g, ';')}\n\n`;

    // Crash Data Section (if available)
    const crashData = warrantsState.speedstudy.crashAnalysis;
    if (crashData && crashData.totalCrashes > 0) {
        csv += 'CRASH DATA ANALYSIS\n';
        csv += `Analysis Period,${crashData.period || '3 years'}\n`;
        csv += `Total Crashes,${crashData.totalCrashes}\n`;
        csv += `Speed-Related Crashes,${crashData.speedRelatedCrashes}\n`;
        csv += `Fatal Crashes (K),${crashData.fatalCrashes || 0}\n`;
        csv += `Serious Injury Crashes (A),${crashData.injuryCrashes || 0}\n`;
        csv += `AADT (vpd),${warrantsState.speedstudy.volumeData?.aadt || 'N/A'}\n`;
        csv += `Segment Length (miles),${warrantsState.speedstudy.volumeData?.segmentLength || 'N/A'}\n`;
        csv += `Crash Rate (per 100M VMT),${crashData.crashRate || 'N/A'}\n`;
        csv += `Speed Crash Rate (per 100M VMT),${crashData.speedCrashRate || 'N/A'}\n\n`;
    }

    // Multi-day data section
    const multiDayData = warrantsState.speedstudy.multiDayData;
    if (multiDayData && Object.keys(multiDayData).length > 0) {
        csv += 'STUDY DAYS SUMMARY\n';
        csv += 'Day Key,Date,Day of Week,Weather,Total Sample,Data Points\n';

        Object.entries(multiDayData).forEach(([key, day]) => {
            const dowNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const hourlyData = day.hourlyData || {};
            const totalN = Object.values(hourlyData).reduce((sum, h) => sum + (parseInt(h.n) || 0), 0);
            const dataPoints = Object.keys(hourlyData).length;
            csv += `${key},${day.date || 'N/A'},${dowNames[day.dow] || 'N/A'},${day.weather || 'Clear'},${totalN},${dataPoints}\n`;
        });
        csv += '\n';

        // Detailed hourly data for each day
        csv += 'DETAILED HOURLY DATA BY DAY\n';
        csv += 'Day Key,Hour,N (Sample),Mean (mph),P50 (mph),P85 (mph),P95 (mph),Above Limit (count)\n';

        Object.entries(multiDayData).forEach(([dayKey, day]) => {
            const hourlyData = day.hourlyData || {};
            Object.entries(hourlyData).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).forEach(([hour, data]) => {
                csv += `${dayKey},${String(hour).padStart(2, '0')}:00,${data.n || 0},${data.mean || ''},${data.p50 || ''},${data.p85 || ''},${data.p95 || ''},${data.aboveLimit || ''}\n`;
            });
        });
        csv += '\n';
    }

    // Hourly averages (if computed)
    if (results.hourlyBreakdown && results.hourlyBreakdown.length > 0) {
        csv += 'AVERAGED HOURLY SPEED STATISTICS\n';
        csv += 'Hour,N (Sample),Mean (mph),P50 (mph),P85 (mph),P95 (mph),Above Limit (count)\n';

        results.hourlyBreakdown.forEach(h => {
            csv += `${String(h.hour).padStart(2, '0')}:00,${h.n || 0},${h.mean || ''},${h.p50 || ''},${h.p85 || ''},${h.p95 || ''},${h.aboveLimit || ''}\n`;
        });
        csv += '\n';
    }

    // Speed Distribution (for histogram recreation)
    if (results.speedDistribution) {
        csv += 'SPEED DISTRIBUTION (for histogram)\n';
        csv += 'Speed Bin (mph),Count,Percent\n';

        Object.entries(results.speedDistribution).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).forEach(([speed, count]) => {
            const pct = results.totalObservations > 0 ? ((count / results.totalObservations) * 100).toFixed(2) : 0;
            csv += `${speed},${count},${pct}%\n`;
        });
        csv += '\n';
    }

    // Methodology Notes
    csv += 'METHODOLOGY NOTES\n';
    csv += 'Standard,ITE Manual of Transportation Engineering Studies 3rd Edition\n';
    csv += 'Key Metric,85th Percentile Speed\n';
    csv += 'Minimum Sample,100 vehicles (ITE recommended)\n';
    csv += 'Preferred Sample,384+ vehicles (95% confidence)\n';
    csv += 'Rounding Rule,Nearest 5 mph increment\n';
    csv += `Averaging Method,${warrantsState.speedstudy.averagingMethod || 'tue-wed-thu'}\n\n`;

    csv += 'DISCLAIMER\n';
    csv += '"This data export is provided as an analysis aid only. All speed study analyses and recommendations must be reviewed and approved by a licensed Professional Engineer (PE) before implementation."\n';

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Speed_Study_${(cfg.studyName || 'Export').replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showToast('CSV exported successfully', 'success');
}

/**
 * Link to CMF tab for countermeasures
 */
function speedstudy_linkToCMF() {
    // Switch to CMF tab with speed-related filter
    showTab('cmf');
    showToast('Switched to Countermeasures tab. Search for speed management countermeasures.', 'info');
}

/**
 * Save speed study data
 */
function speedstudy_saveData() {
    try {
        const data = {
            config: warrantsState.speedstudy.config,
            multiDayData: warrantsState.speedstudy.multiDayData,
            volumeData: warrantsState.speedstudy.volumeData,
            crashAnalysis: warrantsState.speedstudy.crashAnalysis,
            analysisResults: warrantsState.speedstudy.analysisResults,
            averagingMethod: warrantsState.speedstudy.averagingMethod,
            savedAt: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('speedStudyData', JSON.stringify(data));

        // Save to IndexedDB
        warrantDbSave('speedstudy', {
            ...data,
            intersectionName: data.config?.studyName || ''
        }).then(() => {
            console.log('[Speed Study] Data saved to IndexedDB');
        }).catch(e => {
            console.error('[Speed Study] IndexedDB save error:', e);
        });

        showToast('Speed study data saved!', 'success');
    } catch (error) {
        console.error('[Speed Study] Save error:', error);
        showToast('Failed to save data', 'danger');
    }
}

/**
 * Load saved speed study data
 */
function speedstudy_loadSavedData() {
    try {
        const savedData = localStorage.getItem('speedStudyData');
        if (!savedData) return;

        const data = JSON.parse(savedData);

        // Restore config
        if (data.config) {
            warrantsState.speedstudy.config = { ...warrantsState.speedstudy.config, ...data.config };

            // Update UI fields
            const fields = {
                'speedstudyName': data.config.studyName,
                'speedstudyType': data.config.studyType,
                'speedstudyPostedLimit': data.config.postedSpeedLimit,
                'speedstudyRoadClass': data.config.roadwayClass,
                'speedstudyAreaType': data.config.areaType,
                'speedstudyLanes': data.config.numberOfLanes,
                'speedstudyMedian': data.config.medianType,
                'speedstudyAlignment': data.config.horizontalAlignment,
                'speedstudyGrade': data.config.grade
            };

            for (const [id, value] of Object.entries(fields)) {
                const el = document.getElementById(id);
                if (el && value !== undefined) el.value = value;
            }
        }

        // Restore multi-day data
        if (data.multiDayData) {
            warrantsState.speedstudy.multiDayData = data.multiDayData;
            speedstudy_renderDayCards();
        }

        // Restore analysis results
        if (data.analysisResults) {
            warrantsState.speedstudy.analysisResults = data.analysisResults;
            speedstudy_displayResults(data.analysisResults);
        }

        console.log('[Speed Study] Loaded saved data');
    } catch (error) {
        console.error('[Speed Study] Load error:', error);
    }
}

/**
 * Schedule auto-save (debounced)
 */
let speedstudyAutoSaveTimer = null;
function speedstudy_scheduleAutoSave() {
    if (speedstudyAutoSaveTimer) {
        clearTimeout(speedstudyAutoSaveTimer);
    }
    speedstudyAutoSaveTimer = setTimeout(() => {
        speedstudy_saveData();
    }, 2000);
}

/**
 * Confirm and persist extracted data to state (P0 FIX)
 * Moves AI-extracted data from temp arrays to warrantsState.speedstudy.multiDayData
 */
function speedstudy_confirmExtractedData() {
    // Check if we have extracted data to confirm
    if (!speedstudyAllValidationResults || speedstudyAllValidationResults.length === 0) {
        showToast('No extracted data to confirm', 'warning');
        return;
    }

    let addedCount = 0;
    const countType = warrantsState.speedstudy?.config?.countType || '12hr';
    const startHour = countType === '12hr' ? 6 : 0;
    const endHour = countType === '12hr' ? 18 : 24;

    // Process each extracted file
    speedstudyAllValidationResults.forEach((result, index) => {
        if (!result.data || !result.data.hourlyData) {
            console.warn(`[Speed Study] Extraction ${index + 1} has no hourly data, skipping`);
            return;
        }

        // Determine date/key for this extraction
        const extractedDate = result.data.date || new Date().toISOString().split('T')[0];
        const dayKey = `day_${extractedDate}_${index}`;

        // Convert extracted hourlyData to our format
        const hourlyData = {};
        for (let hour = startHour; hour < endHour; hour++) {
            const hourStr = hour.toString();
            const extracted = result.data.hourlyData[hourStr] || result.data.hourlyData[hour] || {};

            hourlyData[hour] = {
                n: parseInt(extracted.n || extracted.sampleSize || extracted.count) || 0,
                mean: parseFloat(extracted.mean || extracted.meanSpeed || extracted.avg) || 0,
                p50: parseFloat(extracted.p50 || extracted.median || extracted.percentile50) || 0,
                p85: parseFloat(extracted.p85 || extracted.percentile85) || 0,
                p95: parseFloat(extracted.p95 || extracted.percentile95) || 0,
                aboveLimit: parseInt(extracted.aboveLimit || extracted.above || extracted.exceeding) || 0
            };
        }

        // Check if we actually have data
        const totalN = Object.values(hourlyData).reduce((sum, h) => sum + (h.n || 0), 0);
        if (totalN === 0) {
            console.warn(`[Speed Study] Extraction ${index + 1} has 0 total observations, skipping`);
            return;
        }

        // Determine day of week (default to Tuesday if not specified)
        let dayOfWeek = 2; // Tuesday default
        if (result.data.dayOfWeek !== undefined) {
            dayOfWeek = result.data.dayOfWeek;
        } else if (extractedDate) {
            const d = new Date(extractedDate);
            if (!isNaN(d.getTime())) {
                dayOfWeek = d.getDay();
            }
        }

        // Add to multiDayData
        warrantsState.speedstudy.multiDayData[dayKey] = {
            date: extractedDate,
            dayOfWeek: dayOfWeek,
            weatherCondition: result.data.weatherCondition || result.data.weather || 'clear',
            collectionMethod: result.data.collectionMethod || result.data.method || 'ai-extraction',
            hourlyData: hourlyData,
            sourceFile: result.filename,
            extractedAt: new Date().toISOString()
        };

        addedCount++;
        console.log(`[Speed Study] Added extraction ${index + 1}: ${result.filename} with ${totalN} observations`);
    });

    if (addedCount > 0) {
        // Update UI
        speedstudy_renderDayCards();
        speedstudy_updateDayCount();

        // Schedule auto-save
        speedstudy_scheduleAutoSave();

        // Clear form for next entry (but don't clear the config)
        speedstudy_clearForm();

        showToast(`${addedCount} day(s) of speed data added to study. Ready for analysis!`, 'success');
    } else {
        showToast('No valid data was found in extractions. Please check the source files.', 'warning');
    }

    // Hide panels
    document.getElementById('speedstudyDataPreviewPanel').style.display = 'none';
    document.getElementById('speedstudyValidationPanel').style.display = 'none';

    // Clear temp arrays
    speedstudyAllValidationResults = [];
    speedstudyPendingExtractions = [];

    console.log(`[Speed Study] Confirmed ${addedCount} extractions, multiDayData now has ${Object.keys(warrantsState.speedstudy.multiDayData).length} days`);
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.studies = CL.studies || {};
  CL.studies.speed = CL.studies.speed || {};
  window.speedstudy_onTabShow = speedstudy_onTabShow; CL.studies.speed.speedstudy_onTabShow = speedstudy_onTabShow;
  window.speedstudy_generateTableRows = speedstudy_generateTableRows; CL.studies.speed.speedstudy_generateTableRows = speedstudy_generateTableRows;
  window.speedstudy_updateTotals = speedstudy_updateTotals; CL.studies.speed.speedstudy_updateTotals = speedstudy_updateTotals;
  window.speedstudy_setCountType = speedstudy_setCountType; CL.studies.speed.speedstudy_setCountType = speedstudy_setCountType;
  window.speedstudy_updateConfigFromUI = speedstudy_updateConfigFromUI; CL.studies.speed.speedstudy_updateConfigFromUI = speedstudy_updateConfigFromUI;
  window.speedstudy_clearForm = speedstudy_clearForm; CL.studies.speed.speedstudy_clearForm = speedstudy_clearForm;
  window.speedstudy_initTable = speedstudy_initTable; CL.studies.speed.speedstudy_initTable = speedstudy_initTable;
  window.speedstudy_addCurrentDay = speedstudy_addCurrentDay; CL.studies.speed.speedstudy_addCurrentDay = speedstudy_addCurrentDay;
  window.speedstudy_renderDayCards = speedstudy_renderDayCards; CL.studies.speed.speedstudy_renderDayCards = speedstudy_renderDayCards;
  window.speedstudy_removeDay = speedstudy_removeDay; CL.studies.speed.speedstudy_removeDay = speedstudy_removeDay;
  window.speedstudy_updateDayCount = speedstudy_updateDayCount; CL.studies.speed.speedstudy_updateDayCount = speedstudy_updateDayCount;
  window.speedstudy_selectAveragingMethod = speedstudy_selectAveragingMethod; CL.studies.speed.speedstudy_selectAveragingMethod = speedstudy_selectAveragingMethod;
  window.speedstudy_runAnalysis = speedstudy_runAnalysis; CL.studies.speed.speedstudy_runAnalysis = speedstudy_runAnalysis;
  window.speedstudy_runAnalysisInternal = speedstudy_runAnalysisInternal; CL.studies.speed.speedstudy_runAnalysisInternal = speedstudy_runAnalysisInternal;
  window.speedstudy_getRecommendationReason = speedstudy_getRecommendationReason; CL.studies.speed.speedstudy_getRecommendationReason = speedstudy_getRecommendationReason;
  window.speedstudy_displayResults = speedstudy_displayResults; CL.studies.speed.speedstudy_displayResults = speedstudy_displayResults;
  window.speedstudy_generateHistogram = speedstudy_generateHistogram; CL.studies.speed.speedstudy_generateHistogram = speedstudy_generateHistogram;
  window.speedstudy_loadCrashData = speedstudy_loadCrashData; CL.studies.speed.speedstudy_loadCrashData = speedstudy_loadCrashData;
  window.findMatchingRoute = findMatchingRoute; CL.studies.speed.findMatchingRoute = findMatchingRoute;
  window.speedstudy_calculateCrashRate = speedstudy_calculateCrashRate; CL.studies.speed.speedstudy_calculateCrashRate = speedstudy_calculateCrashRate;
  window.speedstudy_updateLocationSourceIndicator = speedstudy_updateLocationSourceIndicator; CL.studies.speed.speedstudy_updateLocationSourceIndicator = speedstudy_updateLocationSourceIndicator;
  window.speedstudy_clearLocationBinding = speedstudy_clearLocationBinding; CL.studies.speed.speedstudy_clearLocationBinding = speedstudy_clearLocationBinding;
  window.speedstudy_autoPopulateFromRoadProps = speedstudy_autoPopulateFromRoadProps; CL.studies.speed.speedstudy_autoPopulateFromRoadProps = speedstudy_autoPopulateFromRoadProps;
  window.speedstudy_toggleAIPanel = speedstudy_toggleAIPanel; CL.studies.speed.speedstudy_toggleAIPanel = speedstudy_toggleAIPanel;
  window.speedstudy_handleDisclaimerCheckbox = speedstudy_handleDisclaimerCheckbox; CL.studies.speed.speedstudy_handleDisclaimerCheckbox = speedstudy_handleDisclaimerCheckbox;
  window.speedstudy_toggleDisclaimer = speedstudy_toggleDisclaimer; CL.studies.speed.speedstudy_toggleDisclaimer = speedstudy_toggleDisclaimer;
  window.speedstudy_clearAIUploads = speedstudy_clearAIUploads; CL.studies.speed.speedstudy_clearAIUploads = speedstudy_clearAIUploads;
  window.speedstudy_onFilesSelected = speedstudy_onFilesSelected; CL.studies.speed.speedstudy_onFilesSelected = speedstudy_onFilesSelected;
  window.speedstudy_readFileContent = speedstudy_readFileContent; CL.studies.speed.speedstudy_readFileContent = speedstudy_readFileContent;
  window.speedstudy_extractSingleFileWithDualAI = speedstudy_extractSingleFileWithDualAI; CL.studies.speed.speedstudy_extractSingleFileWithDualAI = speedstudy_extractSingleFileWithDualAI;
  window.speedstudy_extractAllWithAI = speedstudy_extractAllWithAI; CL.studies.speed.speedstudy_extractAllWithAI = speedstudy_extractAllWithAI;
  window.speedstudy_populateGridFromExtraction = speedstudy_populateGridFromExtraction; CL.studies.speed.speedstudy_populateGridFromExtraction = speedstudy_populateGridFromExtraction;
  window.speedstudy_updateDaySlots = speedstudy_updateDaySlots; CL.studies.speed.speedstudy_updateDaySlots = speedstudy_updateDaySlots;
  window.speedstudy_toggleStudyType = speedstudy_toggleStudyType; CL.studies.speed.speedstudy_toggleStudyType = speedstudy_toggleStudyType;
  window.speedstudy_importFromTMC = speedstudy_importFromTMC; CL.studies.speed.speedstudy_importFromTMC = speedstudy_importFromTMC;
  window.speedstudy_newStudy = speedstudy_newStudy; CL.studies.speed.speedstudy_newStudy = speedstudy_newStudy;
  window.speedstudy_generatePDFReport = speedstudy_generatePDFReport; CL.studies.speed.speedstudy_generatePDFReport = speedstudy_generatePDFReport;
  window.speedstudy_exportCSV = speedstudy_exportCSV; CL.studies.speed.speedstudy_exportCSV = speedstudy_exportCSV;
  window.speedstudy_linkToCMF = speedstudy_linkToCMF; CL.studies.speed.speedstudy_linkToCMF = speedstudy_linkToCMF;
  window.speedstudy_saveData = speedstudy_saveData; CL.studies.speed.speedstudy_saveData = speedstudy_saveData;
  window.speedstudy_loadSavedData = speedstudy_loadSavedData; CL.studies.speed.speedstudy_loadSavedData = speedstudy_loadSavedData;
  window.speedstudy_scheduleAutoSave = speedstudy_scheduleAutoSave; CL.studies.speed.speedstudy_scheduleAutoSave = speedstudy_scheduleAutoSave;
  window.speedstudy_confirmExtractedData = speedstudy_confirmExtractedData; CL.studies.speed.speedstudy_confirmExtractedData = speedstudy_confirmExtractedData;
  CL._registerModule('studies/speed-study');
})();
