/**
 * CL warrants.streetlight — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.warrants.streetlight.<fn>; any
 * module-private state stays inside this IIFE (no external refs).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
/**
 * Initialize Street Light Warrant tab when shown
 */
function streetlight_onTabShow() {
    console.log('[Street Light] Tab shown, initializing...');
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('streetlightAnalysisDate').value = today;
    warrantsState.streetlight.config.analysisDate = today;
    streetlight_loadCrashData();
}

/**
 * Load and analyze crash data by light condition
 */
function streetlight_loadCrashData() {
    const noDataDiv = document.getElementById('streetlightNoData');
    const crashSummary = document.getElementById('streetlightCrashSummary');
    const warrantNoData = document.getElementById('streetlightWarrantNoData');
    const warrantResults = document.getElementById('streetlightWarrantResults');

    if (warrantsState.selectedLocation) {
        document.getElementById('streetlightLocationName').value = warrantsState.selectedLocation;
        warrantsState.streetlight.config.locationName = warrantsState.selectedLocation;
    }
    if (warrantsState.locationType) {
        const typeLabel = warrantsState.locationType === 'route' ? 'Route/Corridor' :
                         warrantsState.locationType === 'node' ? 'Intersection' : 'Segment';
        document.getElementById('streetlightLocationType').value = typeLabel;
        warrantsState.streetlight.config.locationType = warrantsState.locationType;
    }

    const startDate = document.getElementById('warrantStartDate')?.value;
    const endDate = document.getElementById('warrantEndDate')?.value;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const months = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30));
        document.getElementById('streetlightAnalysisPeriod').value = `${months} months (${startDate} to ${endDate})`;
        warrantsState.streetlight.config.analysisPeriod = `${months} months`;
    }

    if (!warrantsState.filteredCrashes || warrantsState.filteredCrashes.length === 0) {
        noDataDiv.style.display = 'block';
        crashSummary.style.display = 'none';
        warrantNoData.style.display = 'block';
        warrantResults.style.display = 'none';
        return;
    }

    noDataDiv.style.display = 'none';
    crashSummary.style.display = 'block';
    warrantNoData.style.display = 'none';
    warrantResults.style.display = 'block';

    const crashes = warrantsState.filteredCrashes;
    const crashData = streetlight_analyzeCrashesByLight(crashes);
    warrantsState.streetlight.crashData = crashData;
    warrantsState.streetlight.sourceData = crashes;
    warrantsState.streetlight.autoPopulated = true;

    streetlight_calculateMetrics();
    streetlight_updateUI();
    streetlight_evaluateWarrant();

    warrantsState.streetlight.analysisResults = {
        crashData: warrantsState.streetlight.crashData,
        metrics: warrantsState.streetlight.metrics,
        evaluation: warrantsState.streetlight.evaluation,
        config: warrantsState.streetlight.config,
        timestamp: Date.now()
    };
    warrantsState.streetlight.lastAnalysisTimestamp = Date.now();
}

/**
 * Analyze crashes by light condition
 */
function streetlight_analyzeCrashesByLight(crashes) {
    // CC 341 F3 — FHWA 2025 EPDO weights (FHWA-SA-25-021), sourced from the shared constants.
    const EPDO_WEIGHTS = (window.CL && window.CL.core && window.CL.core.constants && window.CL.core.constants.EPDO_WEIGHTS_DEFAULT)
                      || { K: 883, A: 94, B: 21, C: 11, O: 1 };
    const data = {
        total: 0,
        daytime: { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0, epdo: 0 },
        nighttime: { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0, epdo: 0 },
        byLightCondition: {},
        unknown: { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0, epdo: 0 }
    };

    const nighttimePatterns = /dark|night|dusk|dawn/i;
    const daylightPattern = /daylight/i;

    crashes.forEach(crash => {
        const lightCondition = (crash[COL.LIGHT] || 'Unknown').trim();
        const severity = (crash[COL.SEVERITY] || 'O').toUpperCase().charAt(0);
        const validSeverity = ['K', 'A', 'B', 'C', 'O'].includes(severity) ? severity : 'O';

        data.total++;

        if (!data.byLightCondition[lightCondition]) {
            data.byLightCondition[lightCondition] = { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0, epdo: 0 };
        }
        data.byLightCondition[lightCondition].count++;
        data.byLightCondition[lightCondition][validSeverity]++;
        data.byLightCondition[lightCondition].epdo += EPDO_WEIGHTS[validSeverity];

        if (daylightPattern.test(lightCondition)) {
            data.daytime.count++;
            data.daytime[validSeverity]++;
            data.daytime.epdo += EPDO_WEIGHTS[validSeverity];
        } else if (nighttimePatterns.test(lightCondition)) {
            data.nighttime.count++;
            data.nighttime[validSeverity]++;
            data.nighttime.epdo += EPDO_WEIGHTS[validSeverity];
        } else {
            data.unknown.count++;
            data.unknown[validSeverity]++;
            data.unknown.epdo += EPDO_WEIGHTS[validSeverity];
        }
    });

    return data;
}

/**
 * Calculate NTDCRR and other metrics
 */
function streetlight_calculateMetrics() {
    const crashData = warrantsState.streetlight.crashData;
    const metrics = warrantsState.streetlight.metrics;

    const daytime = crashData.daytime.count;
    const nighttime = crashData.nighttime.count;
    const knownTotal = daytime + nighttime;

    if (daytime > 0) {
        metrics.ntdcrr = nighttime / daytime;
    } else if (nighttime > 0) {
        metrics.ntdcrr = Infinity;
    } else {
        metrics.ntdcrr = null;
    }

    if (knownTotal > 0) {
        metrics.nightPercent = (nighttime / knownTotal) * 100;
        metrics.dayPercent = (daytime / knownTotal) * 100;
    } else {
        metrics.nightPercent = null;
        metrics.dayPercent = null;
    }

    metrics.nightKACount = crashData.nighttime.K + crashData.nighttime.A;
    metrics.dayKACount = crashData.daytime.K + crashData.daytime.A;
}

/**
 * Update UI with crash data and metrics
 */
function streetlight_updateUI() {
    const crashData = warrantsState.streetlight.crashData;
    const metrics = warrantsState.streetlight.metrics;

    document.getElementById('streetlightTotalCrashes').textContent = crashData.total;
    document.getElementById('streetlightDaytimeCrashes').textContent = crashData.daytime.count;
    document.getElementById('streetlightNighttimeCrashes').textContent = crashData.nighttime.count;

    const ntdcrrBox = document.getElementById('streetlightNTDCRRBox');
    const ntdcrrValue = document.getElementById('streetlightNTDCRR');

    if (metrics.ntdcrr === null) {
        ntdcrrValue.textContent = '--';
    } else if (metrics.ntdcrr === Infinity) {
        ntdcrrValue.textContent = '∞';
        ntdcrrBox.style.background = 'linear-gradient(135deg,#dc2626 0%,#b91c1c 100%)';
    } else {
        ntdcrrValue.textContent = metrics.ntdcrr.toFixed(2);
        if (metrics.ntdcrr >= 2.0) {
            ntdcrrBox.style.background = 'linear-gradient(135deg,#dc2626 0%,#b91c1c 100%)';
        } else if (metrics.ntdcrr >= 1.0) {
            ntdcrrBox.style.background = 'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)';
        } else {
            ntdcrrBox.style.background = 'linear-gradient(135deg,#22c55e 0%,#16a34a 100%)';
        }
    }

    const breakdownDiv = document.getElementById('streetlightLightBreakdown');
    let breakdownHTML = '';
    const sortOrder = ['Daylight', 'Dark - Lighted', 'Dark - Not Lighted', 'Dark', 'Dusk', 'Dawn'];
    const conditions = Object.keys(crashData.byLightCondition).sort((a, b) => {
        const aIdx = sortOrder.findIndex(s => a.toLowerCase().includes(s.toLowerCase()));
        const bIdx = sortOrder.findIndex(s => b.toLowerCase().includes(s.toLowerCase()));
        if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
    });

    conditions.forEach(condition => {
        const data = crashData.byLightCondition[condition];
        const isNight = /dark|night|dusk|dawn/i.test(condition);
        const isDay = /daylight/i.test(condition);
        const bgColor = isDay ? '#fef3c7' : isNight ? '#1e293b' : '#f1f5f9';
        const textColor = isNight ? '#fff' : '#334155';
        const pct = crashData.total > 0 ? ((data.count / crashData.total) * 100).toFixed(1) : '0';
        breakdownHTML += `<div style="background:${bgColor};color:${textColor};padding:.75rem;border-radius:6px;text-align:center">
            <div style="font-size:1.25rem;font-weight:700">${data.count}</div>
            <div style="font-size:.75rem;opacity:.85">${condition}</div>
            <div style="font-size:.7rem;opacity:.7">${pct}%</div></div>`;
    });
    breakdownDiv.innerHTML = breakdownHTML;

    const tableBody = document.getElementById('streetlightSeverityTable');
    const tableFooter = document.getElementById('streetlightSeverityFooter');
    let tableHTML = '';
    const categories = [
        { name: 'Daytime (Daylight)', data: crashData.daytime, icon: '☀️' },
        { name: 'Nighttime (Dark/Dusk/Dawn)', data: crashData.nighttime, icon: '🌙' }
    ];
    if (crashData.unknown.count > 0) {
        categories.push({ name: 'Unknown', data: crashData.unknown, icon: '❓' });
    }

    categories.forEach(cat => {
        tableHTML += `<tr>
            <td style="padding:.6rem;border-bottom:1px solid #e2e8f0">${cat.icon} ${cat.name}</td>
            <td style="padding:.6rem;text-align:center;border-bottom:1px solid #e2e8f0;font-weight:600">${cat.data.count}</td>
            <td style="padding:.6rem;text-align:center;border-bottom:1px solid #e2e8f0">${cat.data.K}</td>
            <td style="padding:.6rem;text-align:center;border-bottom:1px solid #e2e8f0">${cat.data.A}</td>
            <td style="padding:.6rem;text-align:center;border-bottom:1px solid #e2e8f0">${cat.data.B}</td>
            <td style="padding:.6rem;text-align:center;border-bottom:1px solid #e2e8f0">${cat.data.C}</td>
            <td style="padding:.6rem;text-align:center;border-bottom:1px solid #e2e8f0">${cat.data.O}</td>
            <td style="padding:.6rem;text-align:center;border-bottom:1px solid #e2e8f0">${cat.data.epdo.toLocaleString()}</td></tr>`;
    });
    tableBody.innerHTML = tableHTML;

    const totalEPDO = crashData.daytime.epdo + crashData.nighttime.epdo + crashData.unknown.epdo;
    tableFooter.innerHTML = `<tr>
        <td style="padding:.6rem">TOTAL</td>
        <td style="padding:.6rem;text-align:center">${crashData.total}</td>
        <td style="padding:.6rem;text-align:center">${crashData.daytime.K + crashData.nighttime.K + crashData.unknown.K}</td>
        <td style="padding:.6rem;text-align:center">${crashData.daytime.A + crashData.nighttime.A + crashData.unknown.A}</td>
        <td style="padding:.6rem;text-align:center">${crashData.daytime.B + crashData.nighttime.B + crashData.unknown.B}</td>
        <td style="padding:.6rem;text-align:center">${crashData.daytime.C + crashData.nighttime.C + crashData.unknown.C}</td>
        <td style="padding:.6rem;text-align:center">${crashData.daytime.O + crashData.nighttime.O + crashData.unknown.O}</td>
        <td style="padding:.6rem;text-align:center">${totalEPDO.toLocaleString()}</td></tr>`;
}

/**
 * Evaluate warrant criteria based on FHWA guidelines
 */
function streetlight_evaluateWarrant() {
    const crashData = warrantsState.streetlight.crashData;
    const metrics = warrantsState.streetlight.metrics;
    const evaluation = warrantsState.streetlight.evaluation;

    evaluation.criterion1_ntdcrr = metrics.ntdcrr !== null && metrics.ntdcrr >= 2.0;
    evaluation.criterion2_frequency = crashData.nighttime.count >= 3;
    evaluation.criterion3_percentage = metrics.nightPercent !== null && metrics.nightPercent > 27;
    evaluation.criterion4_severity = metrics.nightKACount > 0;

    const criteriaMetCount = [
        evaluation.criterion1_ntdcrr,
        evaluation.criterion2_frequency,
        evaluation.criterion3_percentage,
        evaluation.criterion4_severity
    ].filter(Boolean).length;

    if (evaluation.criterion1_ntdcrr) {
        evaluation.overallWarranted = true;
        evaluation.warrantLevel = 'warranted';
        evaluation.recommendation = 'Lighting is WARRANTED based on night-to-day crash ratio >= 2.0. Per FHWA/TAC guidelines, this automatically warrants lighting regardless of point score.';
    } else if (criteriaMetCount >= 2) {
        evaluation.overallWarranted = false;
        evaluation.warrantLevel = 'investigate';
        evaluation.recommendation = 'Lighting INVESTIGATION RECOMMENDED. Multiple crash-based criteria indicate elevated nighttime risk. Conduct field review and photometric analysis.';
    } else if (criteriaMetCount === 1) {
        evaluation.overallWarranted = false;
        evaluation.warrantLevel = 'monitor';
        evaluation.recommendation = 'Lighting may be beneficial. One criterion met - continue monitoring and consider other factors such as pedestrian activity, area type, and land use.';
    } else {
        evaluation.overallWarranted = false;
        evaluation.warrantLevel = 'none';
        evaluation.recommendation = 'Lighting NOT warranted based on crash history. No crash-based criteria met. Consider other factors before final determination.';
    }

    streetlight_updateWarrantUI();
}

/**
 * Update warrant evaluation UI
 */
function streetlight_updateWarrantUI() {
    const evaluation = warrantsState.streetlight.evaluation;
    const metrics = warrantsState.streetlight.metrics;
    const crashData = warrantsState.streetlight.crashData;

    const statusBox = document.getElementById('streetlightWarrantStatus');
    const statusText = document.getElementById('streetlightWarrantStatusText');
    const statusDesc = document.getElementById('streetlightWarrantStatusDesc');

    if (evaluation.warrantLevel === 'warranted') {
        statusBox.style.background = 'linear-gradient(135deg,#dc2626 0%,#b91c1c 100%)';
        statusBox.style.color = 'white';
        statusText.textContent = '⚠️ LIGHTING WARRANTED';
        statusDesc.textContent = evaluation.recommendation;
    } else if (evaluation.warrantLevel === 'investigate') {
        statusBox.style.background = 'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)';
        statusBox.style.color = 'white';
        statusText.textContent = '🔍 INVESTIGATION RECOMMENDED';
        statusDesc.textContent = evaluation.recommendation;
    } else if (evaluation.warrantLevel === 'monitor') {
        statusBox.style.background = 'linear-gradient(135deg,#3b82f6 0%,#2563eb 100%)';
        statusBox.style.color = 'white';
        statusText.textContent = '📊 MONITOR';
        statusDesc.textContent = evaluation.recommendation;
    } else {
        statusBox.style.background = 'linear-gradient(135deg,#22c55e 0%,#16a34a 100%)';
        statusBox.style.color = 'white';
        statusText.textContent = '✓ NOT WARRANTED';
        statusDesc.textContent = evaluation.recommendation;
    }

    const updateCriterion = (id, met, valueText) => {
        const statusEl = document.getElementById(id + 'Status');
        const valueEl = document.getElementById(id + 'Value');
        const criterionEl = document.getElementById(id);
        if (met) {
            statusEl.textContent = 'MET';
            statusEl.style.background = '#dc2626';
            statusEl.style.color = 'white';
            criterionEl.style.borderColor = '#dc2626';
            criterionEl.style.background = '#fef2f2';
        } else {
            statusEl.textContent = 'NOT MET';
            statusEl.style.background = '#22c55e';
            statusEl.style.color = 'white';
            criterionEl.style.borderColor = '#22c55e';
            criterionEl.style.background = '#f0fdf4';
        }
        valueEl.textContent = valueText;
    };

    const ntdcrrText = metrics.ntdcrr === null ? 'N/A' : metrics.ntdcrr === Infinity ? '∞' : metrics.ntdcrr.toFixed(2);
    updateCriterion('streetlightCrit1', evaluation.criterion1_ntdcrr, ntdcrrText);
    updateCriterion('streetlightCrit2', evaluation.criterion2_frequency, crashData.nighttime.count.toString());
    const pctText = metrics.nightPercent === null ? 'N/A' : metrics.nightPercent.toFixed(1) + '%';
    updateCriterion('streetlightCrit3', evaluation.criterion3_percentage, pctText);
    updateCriterion('streetlightCrit4', evaluation.criterion4_severity, metrics.nightKACount.toString());
}

function streetlight_toggleAdditionalFactors() {
    const panel = document.getElementById('streetlightAdditionalFactors');
    const toggle = document.getElementById('streetlightAdditionalToggle');
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        toggle.textContent = '▼';
    } else {
        panel.style.display = 'none';
        toggle.textContent = '▶';
    }
}

function streetlight_updateAdditionalFactors() {
    warrantsState.streetlight.additionalFactors = {
        pedestrianActivity: document.getElementById('streetlightPedActivity')?.value || '',
        bicycleActivity: document.getElementById('streetlightBikeActivity')?.value || '',
        currentLighting: document.getElementById('streetlightCurrentLighting')?.value || '',
        areaType: document.getElementById('streetlightAreaType')?.value || '',
        intersectionType: document.getElementById('streetlightIntersectionType')?.value || '',
        speedLimit: parseInt(document.getElementById('streetlightSpeedLimit')?.value) || null
    };
}

function streetlight_toggleExportButtons() {
    const checked = document.getElementById('streetlightExportDisclaimer')?.checked;
    const exportBtns = document.querySelectorAll('#streetlightExportGrid .signal-export-btn');
    exportBtns.forEach(btn => {
        if (checked && warrantsState.streetlight.analysisResults) {
            btn.classList.remove('disabled');
        } else {
            btn.classList.add('disabled');
        }
    });
}

function streetlight_newStudy() {
    if (!confirm('Clear all street light warrant data and start a new study?')) return;
    warrantsState.streetlight = {
        config: { locationName: '', locationType: '', analysisDate: '', analysisPeriod: '36 months' },
        crashData: { total: 0, daytime: { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0, epdo: 0 }, nighttime: { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0, epdo: 0 }, byLightCondition: {}, unknown: { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0, epdo: 0 } },
        metrics: { ntdcrr: null, nightPercent: null, dayPercent: null, nightKACount: 0, dayKACount: 0 },
        evaluation: { criterion1_ntdcrr: false, criterion2_frequency: false, criterion3_percentage: false, criterion4_severity: false, overallWarranted: false, warrantLevel: 'none', recommendation: '' },
        additionalFactors: { pedestrianActivity: '', bicycleActivity: '', currentLighting: '', areaType: '', intersectionType: '', speedLimit: null },
        analysisResults: null, lastAnalysisTimestamp: null, autoPopulated: true, sourceData: null
    };
    document.getElementById('streetlightLocationName').value = '';
    document.getElementById('streetlightLocationType').value = '';
    document.getElementById('streetlightAnalysisPeriod').value = '';
    document.getElementById('streetlightPedActivity').value = '';
    document.getElementById('streetlightBikeActivity').value = '';
    document.getElementById('streetlightCurrentLighting').value = '';
    document.getElementById('streetlightAreaType').value = '';
    document.getElementById('streetlightIntersectionType').value = '';
    document.getElementById('streetlightSpeedLimit').value = '';
    document.getElementById('streetlightExportDisclaimer').checked = false;
    streetlight_onTabShow();
    showToast('Street light warrant study cleared', 'success');
}

async function streetlight_generatePDFReport() {
    const results = warrantsState.streetlight.analysisResults;
    if (!results) { showToast('Please load crash data before exporting PDF', 'warning'); return; }
    showLoading('Generating PDF report...');
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'letter');
        const state = warrantsState.streetlight;
        const yellowAccent = [234, 179, 8], greenMet = [22, 163, 74], redNotMet = [220, 38, 38], headerBg = [30, 41, 59];
        let yPos = 15;

        doc.setFillColor(...yellowAccent);
        doc.rect(0, 0, 220, 25, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Street Light Warrant Analysis', 15, 17);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('FHWA Night-to-Day Crash Ratio Method', 145, 17);
        yPos = 35;

        doc.setFillColor(245, 245, 245);
        doc.rect(15, yPos, 180, 30, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(15, yPos, 180, 30, 'S');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(state.config.locationName || 'Location Not Specified', 20, yPos + 8);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Location Type: ${state.config.locationType || 'N/A'}`, 20, yPos + 16);
        doc.text(`Analysis Date: ${state.config.analysisDate || 'N/A'}`, 100, yPos + 16);
        doc.text(`Analysis Period: ${state.config.analysisPeriod || 'N/A'}`, 20, yPos + 24);
        yPos += 40;

        const evaluation = state.evaluation;
        let statusColor, statusText;
        if (evaluation.warrantLevel === 'warranted') { statusColor = redNotMet; statusText = 'LIGHTING WARRANTED'; }
        else if (evaluation.warrantLevel === 'investigate') { statusColor = [245, 158, 11]; statusText = 'INVESTIGATION RECOMMENDED'; }
        else if (evaluation.warrantLevel === 'monitor') { statusColor = [59, 130, 246]; statusText = 'MONITOR'; }
        else { statusColor = greenMet; statusText = 'NOT WARRANTED'; }

        doc.setFillColor(...statusColor);
        doc.rect(15, yPos, 180, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(statusText, 105, yPos + 9, { align: 'center' });
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        const recText = doc.splitTextToSize(evaluation.recommendation, 170);
        doc.text(recText[0] || '', 105, yPos + 16, { align: 'center' });
        yPos += 30;
        doc.setTextColor(0, 0, 0);

        doc.setFillColor(...headerBg);
        doc.rect(15, yPos, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('CRASH DATA SUMMARY', 20, yPos + 6);
        yPos += 12;
        doc.setTextColor(0, 0, 0);

        const crashData = state.crashData, metrics = state.metrics;
        doc.setFontSize(9);
        doc.text(`Total Crashes: ${crashData.total}`, 20, yPos);
        doc.text(`Daytime Crashes: ${crashData.daytime.count}`, 70, yPos);
        doc.text(`Nighttime Crashes: ${crashData.nighttime.count}`, 120, yPos);
        yPos += 6;
        const ntdcrrText = metrics.ntdcrr === null ? 'N/A' : metrics.ntdcrr === Infinity ? '∞' : metrics.ntdcrr.toFixed(2);
        doc.text(`Night-to-Day Ratio: ${ntdcrrText}`, 20, yPos);
        doc.text(`Nighttime %: ${metrics.nightPercent?.toFixed(1) || 'N/A'}%`, 70, yPos);
        doc.text(`Nighttime K+A: ${metrics.nightKACount}`, 120, yPos);
        yPos += 10;

        doc.setFillColor(241, 245, 249);
        doc.rect(15, yPos, 180, 7, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Light Condition', 20, yPos + 5);
        doc.text('Total', 70, yPos + 5);
        doc.text('K', 90, yPos + 5);
        doc.text('A', 105, yPos + 5);
        doc.text('B', 120, yPos + 5);
        doc.text('C', 135, yPos + 5);
        doc.text('O', 150, yPos + 5);
        doc.text('EPDO', 165, yPos + 5);
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        doc.text('Daytime', 20, yPos);
        doc.text(String(crashData.daytime.count), 70, yPos);
        doc.text(String(crashData.daytime.K), 90, yPos);
        doc.text(String(crashData.daytime.A), 105, yPos);
        doc.text(String(crashData.daytime.B), 120, yPos);
        doc.text(String(crashData.daytime.C), 135, yPos);
        doc.text(String(crashData.daytime.O), 150, yPos);
        doc.text(String(crashData.daytime.epdo), 165, yPos);
        yPos += 6;
        doc.text('Nighttime', 20, yPos);
        doc.text(String(crashData.nighttime.count), 70, yPos);
        doc.text(String(crashData.nighttime.K), 90, yPos);
        doc.text(String(crashData.nighttime.A), 105, yPos);
        doc.text(String(crashData.nighttime.B), 120, yPos);
        doc.text(String(crashData.nighttime.C), 135, yPos);
        doc.text(String(crashData.nighttime.O), 150, yPos);
        doc.text(String(crashData.nighttime.epdo), 165, yPos);
        yPos += 12;

        doc.setFillColor(...headerBg);
        doc.rect(15, yPos, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('WARRANT CRITERIA EVALUATION', 20, yPos + 6);
        yPos += 12;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);

        const criteria = [
            { name: 'Criterion 1: NTDCRR >= 2.0', met: evaluation.criterion1_ntdcrr, value: ntdcrrText, desc: 'Automatic warrant per FHWA/TAC' },
            { name: 'Criterion 2: >= 3 Nighttime Crashes', met: evaluation.criterion2_frequency, value: String(crashData.nighttime.count), desc: 'MnDOT/FHWA threshold' },
            { name: 'Criterion 3: Night % > 27%', met: evaluation.criterion3_percentage, value: `${metrics.nightPercent?.toFixed(1) || 'N/A'}%`, desc: 'Above baseline VMT proportion' },
            { name: 'Criterion 4: Nighttime K+A Crashes', met: evaluation.criterion4_severity, value: String(metrics.nightKACount), desc: 'Any fatal/serious injury at night' }
        ];
        criteria.forEach(crit => {
            doc.setFont('helvetica', 'bold');
            doc.text(crit.name, 20, yPos);
            if (crit.met) { doc.setTextColor(...redNotMet); doc.text('MET', 130, yPos); }
            else { doc.setTextColor(...greenMet); doc.text('NOT MET', 130, yPos); }
            doc.setTextColor(0, 0, 0);
            doc.text(`Value: ${crit.value}`, 160, yPos);
            yPos += 5;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(crit.desc, 25, yPos);
            doc.setTextColor(0, 0, 0);
            yPos += 8;
        });
        yPos += 5;

        doc.setFillColor(254, 243, 199);
        doc.rect(15, yPos, 180, 25, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('EXPECTED SAFETY BENEFIT (FHWA CMF Reference)', 20, yPos + 6);
        doc.setFont('helvetica', 'normal');
        doc.text('Nighttime crash reduction: 33-45%', 20, yPos + 13);
        doc.text('Fatal crash reduction: 60-64%', 80, yPos + 13);
        doc.text('Ped injury reduction: 42%', 140, yPos + 13);
        doc.setFontSize(7);
        doc.text('Source: FHWA Lighting Handbook & Proven Safety Countermeasures', 20, yPos + 21);
        yPos += 30;

        doc.setFillColor(254, 226, 226);
        doc.rect(15, yPos, 180, 20, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('DISCLAIMER', 20, yPos + 5);
        doc.setFont('helvetica', 'normal');
        const disclaimer = 'This analysis is for screening purposes only and does not constitute professional engineering advice. Final lighting warrant determinations require review by a licensed Professional Engineer, field verification, and photometric analysis per FHWA/AASHTO guidelines.';
        const disclaimerLines = doc.splitTextToSize(disclaimer, 170);
        doc.text(disclaimerLines, 20, yPos + 10);

        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated: ${new Date().toLocaleString()} | CRASH LENS - Street Light Warrant Analyzer`, 15, 270);

        hideLoading();
        const filename = `StreetLight_Warrant_${(state.config.locationName || 'Location').replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        showToast('PDF report generated successfully', 'success');
    } catch (error) {
        hideLoading();
        console.error('[Street Light] PDF generation error:', error);
        showToast('Error generating PDF: ' + error.message, 'error');
    }
}

async function streetlight_generateWordMemo() {
    const results = warrantsState.streetlight.analysisResults;
    if (!results) { showToast('Please load crash data before exporting Word memo', 'warning'); return; }
    const state = warrantsState.streetlight;
    const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = docx;
    const locationName = state.config.locationName || 'Location';
    const evaluation = state.evaluation;
    const crashData = state.crashData;
    const metrics = state.metrics;

    let statusText;
    if (evaluation.warrantLevel === 'warranted') { statusText = 'LIGHTING WARRANTED'; }
    else if (evaluation.warrantLevel === 'investigate') { statusText = 'INVESTIGATION RECOMMENDED'; }
    else if (evaluation.warrantLevel === 'monitor') { statusText = 'MONITOR'; }
    else { statusText = 'NOT WARRANTED'; }

    const ntdcrrText = metrics.ntdcrr === null ? 'N/A' : metrics.ntdcrr === Infinity ? '∞' : metrics.ntdcrr.toFixed(2);

    try {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({ children: [new TextRun({ text: 'MEMORANDUM', bold: true, size: 32 })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
                    new Paragraph({ children: [new TextRun({ text: 'TO:\t\t', bold: true }), new TextRun({ text: 'Project File' })], spacing: { after: 100 } }),
                    new Paragraph({ children: [new TextRun({ text: 'FROM:\t\t', bold: true }), new TextRun({ text: 'Traffic Engineering Division' })], spacing: { after: 100 } }),
                    new Paragraph({ children: [new TextRun({ text: 'DATE:\t\t', bold: true }), new TextRun({ text: new Date().toLocaleDateString() })], spacing: { after: 100 } }),
                    new Paragraph({ children: [new TextRun({ text: 'SUBJECT:\t', bold: true }), new TextRun({ text: `Street Light Warrant Analysis - ${locationName}` })], spacing: { after: 300 } }),
                    new Paragraph({ border: { bottom: { color: '000000', size: 12, style: BorderStyle.SINGLE } }, spacing: { after: 200 } }),
                    new Paragraph({ children: [new TextRun({ text: 'PURPOSE', bold: true, size: 24 })], spacing: { after: 100 } }),
                    new Paragraph({ children: [new TextRun({ text: `This memorandum documents the street light warrant analysis conducted for ${locationName} using the FHWA Night-to-Day Crash Ratio methodology.`, size: 22 })], spacing: { after: 200 } }),
                    new Paragraph({ children: [new TextRun({ text: 'WARRANT STATUS', bold: true, size: 24 })], spacing: { after: 100 } }),
                    new Paragraph({ children: [new TextRun({ text: `Status: `, size: 22 }), new TextRun({ text: statusText, bold: true, size: 22 })], spacing: { after: 100 } }),
                    new Paragraph({ children: [new TextRun({ text: evaluation.recommendation, size: 22 })], spacing: { after: 200 } }),
                    new Paragraph({ children: [new TextRun({ text: 'CRASH DATA SUMMARY', bold: true, size: 24 })], spacing: { after: 100 } }),
                    new Paragraph({ children: [new TextRun({ text: `Analysis Period: ${state.config.analysisPeriod || 'N/A'}`, size: 22 })], spacing: { after: 50 } }),
                    new Paragraph({ children: [new TextRun({ text: `Total Crashes: ${crashData.total}`, size: 22 })], spacing: { after: 50 } }),
                    new Paragraph({ children: [new TextRun({ text: `Daytime Crashes: ${crashData.daytime.count}`, size: 22 })], spacing: { after: 50 } }),
                    new Paragraph({ children: [new TextRun({ text: `Nighttime Crashes: ${crashData.nighttime.count}`, size: 22 })], spacing: { after: 50 } }),
                    new Paragraph({ children: [new TextRun({ text: `Night-to-Day Crash Ratio: ${ntdcrrText}`, size: 22 })], spacing: { after: 50 } }),
                    new Paragraph({ children: [new TextRun({ text: `Nighttime Crash Percentage: ${metrics.nightPercent?.toFixed(1) || 'N/A'}%`, size: 22 })], spacing: { after: 200 } }),
                    new Paragraph({ children: [new TextRun({ text: 'WARRANT CRITERIA EVALUATION', bold: true, size: 24 })], spacing: { after: 100 } }),
                    new Paragraph({ children: [new TextRun({ text: `Criterion 1 (NTDCRR >= 2.0): `, size: 22 }), new TextRun({ text: evaluation.criterion1_ntdcrr ? 'MET' : 'NOT MET', bold: true, size: 22 }), new TextRun({ text: ` (Value: ${ntdcrrText})`, size: 22 })], spacing: { after: 50 } }),
                    new Paragraph({ children: [new TextRun({ text: `Criterion 2 (>= 3 Nighttime Crashes): `, size: 22 }), new TextRun({ text: evaluation.criterion2_frequency ? 'MET' : 'NOT MET', bold: true, size: 22 }), new TextRun({ text: ` (Value: ${crashData.nighttime.count})`, size: 22 })], spacing: { after: 50 } }),
                    new Paragraph({ children: [new TextRun({ text: `Criterion 3 (Night % > 27%): `, size: 22 }), new TextRun({ text: evaluation.criterion3_percentage ? 'MET' : 'NOT MET', bold: true, size: 22 }), new TextRun({ text: ` (Value: ${metrics.nightPercent?.toFixed(1) || 'N/A'}%)`, size: 22 })], spacing: { after: 50 } }),
                    new Paragraph({ children: [new TextRun({ text: `Criterion 4 (Nighttime K+A): `, size: 22 }), new TextRun({ text: evaluation.criterion4_severity ? 'MET' : 'NOT MET', bold: true, size: 22 }), new TextRun({ text: ` (Value: ${metrics.nightKACount})`, size: 22 })], spacing: { after: 200 } }),
                    new Paragraph({ children: [new TextRun({ text: 'DISCLAIMER', bold: true, size: 24 })], spacing: { after: 100 } }),
                    new Paragraph({ children: [new TextRun({ text: 'This analysis is for screening purposes only and does not constitute professional engineering advice. Final lighting warrant determinations require review by a licensed Professional Engineer, field verification, and photometric analysis per FHWA/AASHTO guidelines.', size: 20, italics: true })], spacing: { after: 200 } })
                ]
            }]
        });
        const blob = await docx.Packer.toBlob(doc);
        const filename = `StreetLight_Warrant_Memo_${locationName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
        saveAs(blob, filename);
        showToast('Word memo generated successfully', 'success');
    } catch (error) {
        console.error('[Street Light] Word memo generation error:', error);
        showToast('Error generating Word memo: ' + error.message, 'error');
    }
}

function streetlight_exportCSV() {
    const results = warrantsState.streetlight.analysisResults;
    if (!results) { showToast('Please load crash data before exporting CSV', 'warning'); return; }
    const state = warrantsState.streetlight;
    const crashData = state.crashData;
    const metrics = state.metrics;
    const evaluation = state.evaluation;

    let csv = 'Street Light Warrant Analysis\n';
    csv += `Location,${state.config.locationName || 'N/A'}\n`;
    csv += `Location Type,${state.config.locationType || 'N/A'}\n`;
    csv += `Analysis Date,${state.config.analysisDate || 'N/A'}\n`;
    csv += `Analysis Period,${state.config.analysisPeriod || 'N/A'}\n\n`;
    csv += 'CRASH DATA SUMMARY\nLight Condition,Count,K,A,B,C,O,EPDO\n';
    csv += `Daytime,${crashData.daytime.count},${crashData.daytime.K},${crashData.daytime.A},${crashData.daytime.B},${crashData.daytime.C},${crashData.daytime.O},${crashData.daytime.epdo}\n`;
    csv += `Nighttime,${crashData.nighttime.count},${crashData.nighttime.K},${crashData.nighttime.A},${crashData.nighttime.B},${crashData.nighttime.C},${crashData.nighttime.O},${crashData.nighttime.epdo}\n`;
    if (crashData.unknown.count > 0) {
        csv += `Unknown,${crashData.unknown.count},${crashData.unknown.K},${crashData.unknown.A},${crashData.unknown.B},${crashData.unknown.C},${crashData.unknown.O},${crashData.unknown.epdo}\n`;
    }
    csv += `TOTAL,${crashData.total},${crashData.daytime.K + crashData.nighttime.K + crashData.unknown.K},${crashData.daytime.A + crashData.nighttime.A + crashData.unknown.A},${crashData.daytime.B + crashData.nighttime.B + crashData.unknown.B},${crashData.daytime.C + crashData.nighttime.C + crashData.unknown.C},${crashData.daytime.O + crashData.nighttime.O + crashData.unknown.O},${crashData.daytime.epdo + crashData.nighttime.epdo + crashData.unknown.epdo}\n\n`;
    csv += 'DETAILED LIGHT CONDITIONS\nLight Condition,Count,K,A,B,C,O,EPDO\n';
    Object.entries(crashData.byLightCondition).forEach(([condition, data]) => {
        csv += `"${condition}",${data.count},${data.K},${data.A},${data.B},${data.C},${data.O},${data.epdo}\n`;
    });
    csv += '\nCALCULATED METRICS\n';
    csv += `Night-to-Day Crash Ratio,${metrics.ntdcrr === null ? 'N/A' : metrics.ntdcrr === Infinity ? 'Infinity' : metrics.ntdcrr.toFixed(4)}\n`;
    csv += `Nighttime Crash Percentage,${metrics.nightPercent?.toFixed(2) || 'N/A'}%\n`;
    csv += `Daytime Crash Percentage,${metrics.dayPercent?.toFixed(2) || 'N/A'}%\n`;
    csv += `Nighttime K+A Count,${metrics.nightKACount}\nDaytime K+A Count,${metrics.dayKACount}\n\n`;
    csv += 'WARRANT EVALUATION\n';
    csv += `Criterion 1 (NTDCRR >= 2.0),${evaluation.criterion1_ntdcrr ? 'MET' : 'NOT MET'}\n`;
    csv += `Criterion 2 (>= 3 Nighttime Crashes),${evaluation.criterion2_frequency ? 'MET' : 'NOT MET'}\n`;
    csv += `Criterion 3 (Night % > 27%),${evaluation.criterion3_percentage ? 'MET' : 'NOT MET'}\n`;
    csv += `Criterion 4 (Nighttime K+A),${evaluation.criterion4_severity ? 'MET' : 'NOT MET'}\n`;
    csv += `Overall Warrant Level,${evaluation.warrantLevel.toUpperCase()}\n`;
    csv += `Recommendation,"${evaluation.recommendation}"\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const filename = `StreetLight_Warrant_${(state.config.locationName || 'Location').replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, filename);
    showToast('CSV exported successfully', 'success');
}

function streetlight_exportData() {
    const results = warrantsState.streetlight.analysisResults;
    if (!results) { showToast('Please load crash data before exporting', 'warning'); return; }
    const exportData = {
        version: '1.0',
        type: 'streetlight_warrant',
        exportDate: new Date().toISOString(),
        data: {
            config: warrantsState.streetlight.config,
            crashData: warrantsState.streetlight.crashData,
            metrics: warrantsState.streetlight.metrics,
            evaluation: warrantsState.streetlight.evaluation,
            additionalFactors: warrantsState.streetlight.additionalFactors
        }
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const filename = `StreetLight_Warrant_${(warrantsState.streetlight.config.locationName || 'Location').replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    saveAs(blob, filename);
    showToast('JSON data exported successfully', 'success');
}

function streetlight_importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            if (importData.type !== 'streetlight_warrant') { throw new Error('Invalid file type. Expected street light warrant data.'); }
            if (!confirm(`Import street light warrant data for "${importData.data.config.locationName || 'Unknown'}"? This will replace current data.`)) { return; }

            warrantsState.streetlight.config = importData.data.config || warrantsState.streetlight.config;
            warrantsState.streetlight.crashData = importData.data.crashData || warrantsState.streetlight.crashData;
            warrantsState.streetlight.metrics = importData.data.metrics || warrantsState.streetlight.metrics;
            warrantsState.streetlight.evaluation = importData.data.evaluation || warrantsState.streetlight.evaluation;
            warrantsState.streetlight.additionalFactors = importData.data.additionalFactors || warrantsState.streetlight.additionalFactors;
            warrantsState.streetlight.analysisResults = { crashData: warrantsState.streetlight.crashData, metrics: warrantsState.streetlight.metrics, evaluation: warrantsState.streetlight.evaluation, config: warrantsState.streetlight.config, timestamp: Date.now() };

            document.getElementById('streetlightLocationName').value = warrantsState.streetlight.config.locationName || '';
            document.getElementById('streetlightLocationType').value = warrantsState.streetlight.config.locationType || '';
            document.getElementById('streetlightAnalysisDate').value = warrantsState.streetlight.config.analysisDate || '';
            document.getElementById('streetlightAnalysisPeriod').value = warrantsState.streetlight.config.analysisPeriod || '';
            document.getElementById('streetlightPedActivity').value = warrantsState.streetlight.additionalFactors.pedestrianActivity || '';
            document.getElementById('streetlightBikeActivity').value = warrantsState.streetlight.additionalFactors.bicycleActivity || '';
            document.getElementById('streetlightCurrentLighting').value = warrantsState.streetlight.additionalFactors.currentLighting || '';
            document.getElementById('streetlightAreaType').value = warrantsState.streetlight.additionalFactors.areaType || '';
            document.getElementById('streetlightIntersectionType').value = warrantsState.streetlight.additionalFactors.intersectionType || '';
            document.getElementById('streetlightSpeedLimit').value = warrantsState.streetlight.additionalFactors.speedLimit || '';

            document.getElementById('streetlightNoData').style.display = 'none';
            document.getElementById('streetlightCrashSummary').style.display = 'block';
            document.getElementById('streetlightWarrantNoData').style.display = 'none';
            document.getElementById('streetlightWarrantResults').style.display = 'block';

            streetlight_updateUI();
            streetlight_updateWarrantUI();
            showToast('Data imported successfully', 'success');
        } catch (error) {
            console.error('[Street Light] Import error:', error);
            showToast('Error importing data: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.warrants = CL.warrants || {};
  CL.warrants.streetlight = CL.warrants.streetlight || {};
  window.streetlight_onTabShow = streetlight_onTabShow; CL.warrants.streetlight.streetlight_onTabShow = streetlight_onTabShow;
  window.streetlight_loadCrashData = streetlight_loadCrashData; CL.warrants.streetlight.streetlight_loadCrashData = streetlight_loadCrashData;
  window.streetlight_analyzeCrashesByLight = streetlight_analyzeCrashesByLight; CL.warrants.streetlight.streetlight_analyzeCrashesByLight = streetlight_analyzeCrashesByLight;
  window.streetlight_calculateMetrics = streetlight_calculateMetrics; CL.warrants.streetlight.streetlight_calculateMetrics = streetlight_calculateMetrics;
  window.streetlight_updateUI = streetlight_updateUI; CL.warrants.streetlight.streetlight_updateUI = streetlight_updateUI;
  window.streetlight_evaluateWarrant = streetlight_evaluateWarrant; CL.warrants.streetlight.streetlight_evaluateWarrant = streetlight_evaluateWarrant;
  window.streetlight_updateWarrantUI = streetlight_updateWarrantUI; CL.warrants.streetlight.streetlight_updateWarrantUI = streetlight_updateWarrantUI;
  window.streetlight_toggleAdditionalFactors = streetlight_toggleAdditionalFactors; CL.warrants.streetlight.streetlight_toggleAdditionalFactors = streetlight_toggleAdditionalFactors;
  window.streetlight_updateAdditionalFactors = streetlight_updateAdditionalFactors; CL.warrants.streetlight.streetlight_updateAdditionalFactors = streetlight_updateAdditionalFactors;
  window.streetlight_toggleExportButtons = streetlight_toggleExportButtons; CL.warrants.streetlight.streetlight_toggleExportButtons = streetlight_toggleExportButtons;
  window.streetlight_newStudy = streetlight_newStudy; CL.warrants.streetlight.streetlight_newStudy = streetlight_newStudy;
  window.streetlight_generatePDFReport = streetlight_generatePDFReport; CL.warrants.streetlight.streetlight_generatePDFReport = streetlight_generatePDFReport;
  window.streetlight_generateWordMemo = streetlight_generateWordMemo; CL.warrants.streetlight.streetlight_generateWordMemo = streetlight_generateWordMemo;
  window.streetlight_exportCSV = streetlight_exportCSV; CL.warrants.streetlight.streetlight_exportCSV = streetlight_exportCSV;
  window.streetlight_exportData = streetlight_exportData; CL.warrants.streetlight.streetlight_exportData = streetlight_exportData;
  window.streetlight_importData = streetlight_importData; CL.warrants.streetlight.streetlight_importData = streetlight_importData;
  CL._registerModule('warrants/streetlight');
})();
