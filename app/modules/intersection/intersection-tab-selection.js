/** CL intersection.tab (selection) — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/17-v2-intersection-tab.md + MODULAR_PLAN_PROMPT_17-v2_VERIFY.md.
 *  Verbatim. No behavior change. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L55378-L55545) ───
// Toggle single intersection selection
function toggleIntSelection(checkbox) {
    const node = checkbox.dataset.node;
    const routes = checkbox.dataset.routes || '';
    const isChecked = checkbox.checked;

    if (isChecked) {
        if (intDetailState.selectedLocations.length >= intDetailState.maxSelections) {
            checkbox.checked = false;
            alert(`Maximum ${intDetailState.maxSelections} intersections can be selected for analysis.`);
            return;
        }
        if (!intDetailState.selectedLocations.some(loc => loc.node === node)) {
            intDetailState.selectedLocations.push({ node, routes });
        }
    } else {
        const idx = intDetailState.selectedLocations.findIndex(loc => loc.node === node);
        if (idx > -1) intDetailState.selectedLocations.splice(idx, 1);
    }

    updateIntSelectionCount();
    updateIntDetailPanel();
}

// Toggle all intersections (up to max)
function toggleAllIntSelection(checked) {
    const data = getFilteredIntersectionData();
    const nodeSorted = Object.entries(data.byNode).sort((a,b) => b[1].total - a[1].total);

    if (checked) {
        intDetailState.selectedLocations = nodeSorted
            .slice(0, intDetailState.maxSelections)
            .map(([node, d]) => ({ node, routes: d.routes ? [...d.routes].join(', ') : '' }));
    } else {
        intDetailState.selectedLocations = [];
    }

    document.querySelectorAll('#intBody .int-checkbox').forEach((cb, i) => {
        cb.checked = checked && i < intDetailState.maxSelections;
        cb.disabled = checked && i >= intDetailState.maxSelections;
    });

    updateIntSelectionCount();
    updateIntDetailPanel();
}

// Clear all selections
function clearIntSelection() {
    intDetailState.selectedLocations = [];
    document.querySelectorAll('#intBody .int-checkbox').forEach(cb => {
        cb.checked = false;
        cb.disabled = false;
    });
    const selectAll = document.getElementById('intSelectAll');
    if (selectAll) selectAll.checked = false;
    updateIntSelectionCount();
    document.getElementById('intDetailPanel').classList.remove('visible');
}

// Update selection count display
function updateIntSelectionCount() {
    const count = intDetailState.selectedLocations.length;
    const countEl = document.getElementById('intSelectCount');
    if (countEl) countEl.textContent = `${count} of ${intDetailState.maxSelections} selected`;

    const selectAll = document.getElementById('intSelectAll');
    if (selectAll) {
        const data = getFilteredIntersectionData();
        const totalNodes = Object.keys(data.byNode).length;
        if (count === 0) {
            selectAll.checked = false;
            selectAll.indeterminate = false;
        } else if (count >= intDetailState.maxSelections || count === totalNodes) {
            selectAll.checked = true;
            selectAll.indeterminate = false;
        } else {
            selectAll.indeterminate = true;
        }
    }
}

// Set view mode
function setIntViewMode(mode) {
    intDetailState.viewMode = mode;
    document.getElementById('btnIntViewCombined').classList.toggle('active', mode === 'combined');
    document.getElementById('btnIntViewCompare').classList.toggle('active', mode === 'compare');
    renderIntDetailContent();
}

// Reset peak hour defaults
function resetIntPeakDefaults() {
    document.getElementById('intPeakAMStart').value = '06:00';
    document.getElementById('intPeakAMEnd').value = '09:00';
    document.getElementById('intPeakMidStart').value = '09:00';
    document.getElementById('intPeakMidEnd').value = '15:00';
    document.getElementById('intPeakPMStart').value = '15:00';
    document.getElementById('intPeakPMEnd').value = '19:00';
    document.getElementById('intPeakNightStart').value = '19:00';
    document.getElementById('intPeakNightEnd').value = '06:00';
    intDetailState.peakHours = {
        am: { start: '06:00', end: '09:00' },
        midday: { start: '09:00', end: '15:00' },
        pm: { start: '15:00', end: '19:00' },
        night: { start: '19:00', end: '06:00' }
    };
    updateIntDetailPanel();
}

// Get peak hours from UI
function getIntPeakHours() {
    return {
        am: { start: document.getElementById('intPeakAMStart')?.value || '06:00', end: document.getElementById('intPeakAMEnd')?.value || '09:00' },
        midday: { start: document.getElementById('intPeakMidStart')?.value || '09:00', end: document.getElementById('intPeakMidEnd')?.value || '15:00' },
        pm: { start: document.getElementById('intPeakPMStart')?.value || '15:00', end: document.getElementById('intPeakPMEnd')?.value || '19:00' },
        night: { start: document.getElementById('intPeakNightStart')?.value || '19:00', end: document.getElementById('intPeakNightEnd')?.value || '06:00' }
    };
}

// Check if time is in peak period
function isInIntPeakPeriod(timeStr, peakStart, peakEnd) {
    if (!timeStr) return false;
    // timeStr is military time HHMM format (e.g., "1430" for 2:30 PM)
    const padded = String(timeStr).padStart(4, '0');
    const hour = parseInt(padded.substring(0, 2)) || 0;
    const minute = parseInt(padded.substring(2, 4)) || 0;
    const time = hour * 60 + minute;
    // peakStart/peakEnd are HH:MM format from UI controls
    const startHour = parseInt(peakStart.split(':')[0]) || 0;
    const startMin = parseInt(peakStart.split(':')[1]) || 0;
    const start = startHour * 60 + startMin;
    const endHour = parseInt(peakEnd.split(':')[0]) || 0;
    const endMin = parseInt(peakEnd.split(':')[1]) || 0;
    const end = endHour * 60 + endMin;
    if (start > end) return time >= start || time < end;
    return time >= start && time < end;
}

// Main function to update the detail panel
function updateIntDetailPanel(skipScroll = false) {
    const panel = document.getElementById('intDetailPanel');
    if (intDetailState.selectedLocations.length === 0) {
        panel.classList.remove('visible');
        return;
    }
    panel.classList.add('visible');
    intDetailState.peakHours = getIntPeakHours();
    const count = intDetailState.selectedLocations.length;
    document.getElementById('intDetailTitle').textContent = `Intersection Detailed Analysis: ${count} Location${count > 1 ? 's' : ''} Selected`;
    aggregateIntDetailData();
    calculateIntCountyBenchmarks();
    renderIntDetailContent();

    // Round 12: matview-only mode — hydrate the JSONB breakdowns from
    // mv_hotspots_detail so the Yearly/Monthly/DOW/Hour/Collision/Weather/
    // Light/Surface/TrafficCtrl/Factors charts populate. Re-renders on success.
    const _sampleRowsEmpty = !crashState.sampleRows || crashState.sampleRows.length === 0;
    if (_sampleRowsEmpty) {
        _hydrateHotspotDetailFromMatview('intersection').then(merged => {
            if (merged) renderIntDetailContent();
        }).catch(e => console.warn('[Int Detail] mv_hotspots_detail hydrate failed:', e && e.message));
    }

    // Scroll panel into view (skip on initial auto-select)
    if (!skipScroll) {
        setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
}

  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.intersection=CL.intersection||{};
  CL.intersection.tab=CL.intersection.tab||{};
  window.toggleIntSelection=toggleIntSelection; CL.intersection.tab.toggleIntSelection=toggleIntSelection;
  window.toggleAllIntSelection=toggleAllIntSelection; CL.intersection.tab.toggleAllIntSelection=toggleAllIntSelection;
  window.clearIntSelection=clearIntSelection; CL.intersection.tab.clearIntSelection=clearIntSelection;
  window.updateIntSelectionCount=updateIntSelectionCount; CL.intersection.tab.updateIntSelectionCount=updateIntSelectionCount;
  window.setIntViewMode=setIntViewMode; CL.intersection.tab.setIntViewMode=setIntViewMode;
  window.resetIntPeakDefaults=resetIntPeakDefaults; CL.intersection.tab.resetIntPeakDefaults=resetIntPeakDefaults;
  window.getIntPeakHours=getIntPeakHours; CL.intersection.tab.getIntPeakHours=getIntPeakHours;
  window.isInIntPeakPeriod=isInIntPeakPeriod; CL.intersection.tab.isInIntPeakPeriod=isInIntPeakPeriod;
  window.updateIntDetailPanel=updateIntDetailPanel; CL.intersection.tab.updateIntDetailPanel=updateIntDetailPanel;
  CL._registerModule('intersection/intersection-tab-selection');
})();
