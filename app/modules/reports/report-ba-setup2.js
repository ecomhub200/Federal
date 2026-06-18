/**
 * CL reports.ba — BA map-selection + study-period setup
 * Extracted verbatim from app/index.html (Before/After report band, prompt
 * 42c, size-split). NO behavior change. baState stays INLINE (read via global
 * scope); all fns dual-exposed window.<fn> + CL.reports.ba.<fn> (onclick + cross-file).
 * Depends at call time: baState, COL, crashState, docx, jsPDF, html2canvas, Chart.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
// Select location from map
function selectBALocationFromMap() {
    // Show modal with instructions
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'baMapSelectionModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:500px">
            <div class="modal-header" style="background:linear-gradient(135deg,#22c55e,#16a34a);color:white">
                <h3 style="display:flex;align-items:center;gap:.5rem">🗺️ Select Area from Map</h3>
                <button class="modal-close" onclick="closeBAMapModal()" style="color:white">&times;</button>
            </div>
            <div class="modal-body" style="padding:1.5rem">
                <div style="text-align:center;margin-bottom:1.5rem">
                    <div style="font-size:3rem;margin-bottom:.5rem">🗺️</div>
                    <p style="font-size:.95rem;color:var(--gray)">Use the map drawing tools to select a custom area for Before & After analysis</p>
                </div>
                <div style="background:#f0fdf4;padding:1rem;border-radius:var(--radius);margin-bottom:1.5rem">
                    <h4 style="font-size:.9rem;font-weight:600;color:#059669;margin-bottom:.75rem">How to select an area:</h4>
                    <ol style="font-size:.85rem;color:var(--dark);margin:0;padding-left:1.25rem;line-height:1.6">
                        <li>Click <strong>"Go to Map"</strong> below to open the Map tab</li>
                        <li>Use the <strong>⬡ Polygon</strong> or <strong>◯ Circle</strong> drawing tools</li>
                        <li>Draw around the treatment area</li>
                        <li>Click <strong>"B/A Study"</strong> button in the selection panel</li>
                    </ol>
                </div>
                <div style="display:flex;gap:.75rem;justify-content:center">
                    <button class="btn btn-success" onclick="goToMapForBASelection()">🗺️ Go to Map</button>
                    <button class="btn btn-secondary" onclick="closeBAMapModal()">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeBAMapModal() {
    const modal = document.getElementById('baMapSelectionModal');
    if (modal) modal.remove();
}

function goToMapForBASelection() {
    closeBAMapModal();
    showTab('map');
    // Set a flag so we know to return to BA study after selection
    baState.mapSelectionPending = true;
}

// Called from drawing selection panel to use selection for B/A study
function useMapSelectionForBAStudy() {
    if (!selectedCrashesFromDrawing || selectedCrashesFromDrawing.length === 0) {
        alert('No crashes selected. Please draw a shape on the map first.');
        return;
    }

    // Store map selection in BA state
    baState.mapSelection = {
        crashes: selectedCrashesFromDrawing,
        count: selectedCrashesFromDrawing.length
    };

    // Navigate to Reports tab and select Before & After study sub-tab
    showTab('reports');
    showReportSubTab('beforeafter');

    // Update the location dropdown to include map selection
    setTimeout(() => {
        initBALocationDropdown();
        document.getElementById('baLocationSelect').value = 'map:selection';
        loadBALocation();
        document.getElementById('baMapSelectionStatus').textContent =
            `✓ ${selectedCrashesFromDrawing.length} crashes selected from map`;
    }, 100);
}

// Set study period length
function setBAStudyPeriod(years) {
    baState.studyPeriodYears = years;

    // Update toggle buttons
    document.querySelectorAll('#baStudyPeriodToggle .cmf-toggle-btn').forEach(btn => {
        btn.classList.remove('active', 'algo');
    });
    event.target.classList.add('active', 'algo');

    calculateBAPeriods();
}

// Calculate before/after periods based on treatment date
function calculateBAPeriods() {
    const treatmentDate = document.getElementById('baTreatmentDate').value;
    if (!treatmentDate) return;

    const constructionMonths = parseInt(document.getElementById('baConstructionDuration').value) || 3;
    const studyYears = baState.studyPeriodYears;

    const treatment = new Date(treatmentDate);
    const constructionEnd = new Date(treatment);
    constructionEnd.setMonth(constructionEnd.getMonth() + constructionMonths);

    // Before period: studyYears before treatment date
    const beforeEnd = new Date(treatment);
    beforeEnd.setDate(beforeEnd.getDate() - 1); // Day before treatment
    const beforeStart = new Date(beforeEnd);
    beforeStart.setFullYear(beforeStart.getFullYear() - studyYears);

    // After period: from construction end to studyYears after (or today)
    const afterStart = new Date(constructionEnd);
    afterStart.setDate(afterStart.getDate() + 1); // Day after construction
    const afterEnd = new Date();
    const maxAfterEnd = new Date(afterStart);
    maxAfterEnd.setFullYear(maxAfterEnd.getFullYear() + studyYears);
    if (afterEnd > maxAfterEnd) afterEnd.setTime(maxAfterEnd.getTime());

    // Update date inputs
    document.getElementById('baBeforeStart').value = beforeStart.toISOString().split('T')[0];
    document.getElementById('baBeforeEnd').value = beforeEnd.toISOString().split('T')[0];
    document.getElementById('baAfterStart').value = afterStart.toISOString().split('T')[0];
    document.getElementById('baAfterEnd').value = afterEnd.toISOString().split('T')[0];

    // Store in state
    baState.treatmentDate = treatment;
    baState.beforePeriod = { start: beforeStart, end: beforeEnd };
    baState.afterPeriod = { start: afterStart, end: afterEnd };

    updateBAPeriodDisplay();
}

// Update period duration display
function updateBAPeriodDisplay() {
    const beforeStart = new Date(document.getElementById('baBeforeStart').value);
    const beforeEnd = new Date(document.getElementById('baBeforeEnd').value);
    const afterStart = new Date(document.getElementById('baAfterStart').value);
    const afterEnd = new Date(document.getElementById('baAfterEnd').value);

    if (!isNaN(beforeStart) && !isNaN(beforeEnd)) {
        const beforeDays = Math.round((beforeEnd - beforeStart) / (1000 * 60 * 60 * 24));
        const beforeYears = (beforeDays / 365).toFixed(1);
        document.getElementById('baBeforeDuration').textContent = `${beforeYears} years (${beforeDays} days)`;
    }

    if (!isNaN(afterStart) && !isNaN(afterEnd)) {
        const afterDays = Math.round((afterEnd - afterStart) / (1000 * 60 * 60 * 24));
        const afterYears = (afterDays / 365).toFixed(1);
        document.getElementById('baAfterDuration').textContent = `${afterYears} years (${afterDays} days)`;
    }
}

// Update analysis method info
function updateBAMethodInfo() {
    const method = document.getElementById('baAnalysisMethod').value;
    const infoBox = document.getElementById('baMethodInfo');

    if (method === 'eb') {
        infoBox.innerHTML = `
            <span class="icon">💡</span>
            <div class="content">
                <p><strong>Empirical Bayes (EB) Method:</strong> This method accounts for regression-to-mean bias by using reference group data to establish expected crash frequency. It's the preferred method for HSIP documentation and provides more accurate effectiveness estimates.</p>
            </div>
        `;
        infoBox.className = 'info-box tip';
    } else {
        infoBox.innerHTML = `
            <span class="icon">⚠️</span>
            <div class="content">
                <p><strong>Naive Before/After Method:</strong> This simple comparison directly compares crash counts before and after treatment. It does NOT account for regression-to-mean or external factors. Use with caution - results may overestimate treatment effectiveness.</p>
            </div>
        `;
        infoBox.className = 'info-box warning';
    }

    baState.analysisMethod = method;
}

// Reset BA study
function resetBAStudy() {
    // Reset form inputs
    document.getElementById('baLocationSelect').value = '';
    document.getElementById('baTreatmentType').value = '';
    document.getElementById('baTreatmentDate').value = '';
    document.getElementById('baConstructionDuration').value = '3';
    document.getElementById('baBeforeStart').value = '';
    document.getElementById('baBeforeEnd').value = '';
    document.getElementById('baAfterStart').value = '';
    document.getElementById('baAfterEnd').value = '';
    document.getElementById('baAnalysisMethod').value = 'eb';

    // Reset state
    baState.selectedLocation = null;
    baState.locationCrashes = [];
    baState.studyPeriodYears = 3;
    baState.results = null;

    // Reset displays
    document.getElementById('baLocationSummary').style.display = 'none';
    document.getElementById('beforeAfterResults').style.display = 'none';
    document.getElementById('baBeforeDuration').textContent = '';
    document.getElementById('baAfterDuration').textContent = '';
    document.getElementById('baMapSelectionStatus').textContent = '';

    // Reset toggle buttons
    document.querySelectorAll('#baStudyPeriodToggle .cmf-toggle-btn').forEach((btn, i) => {
        btn.classList.remove('active', 'algo');
        if (i === 1) btn.classList.add('active', 'algo'); // 3 Yr default
    });

    updateBAMethodInfo();
    initBALocationDropdown();

    // Reset monitoring location display (but preserve saved preferences)
    updateBAMonitoringLocationDisplay();
}

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.ba = CL.reports.ba || {};
  window.selectBALocationFromMap = selectBALocationFromMap; CL.reports.ba.selectBALocationFromMap = selectBALocationFromMap;
  window.closeBAMapModal = closeBAMapModal; CL.reports.ba.closeBAMapModal = closeBAMapModal;
  window.goToMapForBASelection = goToMapForBASelection; CL.reports.ba.goToMapForBASelection = goToMapForBASelection;
  window.useMapSelectionForBAStudy = useMapSelectionForBAStudy; CL.reports.ba.useMapSelectionForBAStudy = useMapSelectionForBAStudy;
  window.setBAStudyPeriod = setBAStudyPeriod; CL.reports.ba.setBAStudyPeriod = setBAStudyPeriod;
  window.calculateBAPeriods = calculateBAPeriods; CL.reports.ba.calculateBAPeriods = calculateBAPeriods;
  window.updateBAPeriodDisplay = updateBAPeriodDisplay; CL.reports.ba.updateBAPeriodDisplay = updateBAPeriodDisplay;
  window.updateBAMethodInfo = updateBAMethodInfo; CL.reports.ba.updateBAMethodInfo = updateBAMethodInfo;
  window.resetBAStudy = resetBAStudy; CL.reports.ba.resetBAStudy = resetBAStudy;
  CL._registerModule('reports/report-ba-setup2');
})();
