/**
 * CL reports.ba — BA monitoring panel + settings
 * Extracted verbatim from app/index.html (Before/After report band, prompt
 * 42c, size-split). NO behavior change. baState stays INLINE (read via global
 * scope); all fns dual-exposed window.<fn> + CL.reports.ba.<fn> (onclick + cross-file).
 * Depends at call time: baState, COL, crashState, docx, jsPDF, html2canvas, Chart.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
function initBAMonitoringPanel() {
    // Load saved monitoring preferences
    const saved = notificationState.preferences.ba?.monitoring;
    if (!saved) return;

    baState.monitoringActive = !!saved.enabled;

    // Restore toggle state
    const track = document.getElementById('baMonitoringTrack');
    const thumb = document.getElementById('baMonitoringThumb');
    const label = document.getElementById('baMonitoringLabel');
    const content = document.getElementById('baMonitoringContent');
    if (baState.monitoringActive) {
        if (track) track.style.background = '#0ea5e9';
        if (thumb) thumb.style.left = '22px';
        if (label) { label.textContent = 'Enabled'; label.style.color = '#0ea5e9'; }
        if (content) content.style.display = 'block';
    }

    // Restore alert condition values
    if (saved.alerts) {
        const a = saved.alerts;
        const el = id => document.getElementById(id);
        if (el('baAlertCrashCount')) el('baAlertCrashCount').checked = !!a.crashCountEnabled;
        if (el('baAlertCrashCountVal')) el('baAlertCrashCountVal').value = a.crashCountThreshold || 5;
        if (el('baAlertCrashCountPeriod')) el('baAlertCrashCountPeriod').value = a.crashCountWindowMonths || 6;
        if (el('baAlertSeverity')) el('baAlertSeverity').checked = !!a.severityEnabled;
        if (el('baAlertSeverityLevel')) el('baAlertSeverityLevel').value = a.severityLevel || 'KA';
        if (el('baAlertTrend')) el('baAlertTrend').checked = !!a.trendEnabled;
        if (el('baAlertTrendPercent')) el('baAlertTrendPercent').value = a.trendIncreasePercent || 25;
        if (el('baAlertCMF')) el('baAlertCMF').checked = !!a.cmfDeteriorationEnabled;
        if (el('baAlertCMFThreshold')) el('baAlertCMFThreshold').value = a.cmfThreshold || 1.0;

        // Update row styles
        ['baAlertCrashCountRow','baAlertSeverityRow','baAlertTrendRow','baAlertCMFRow'].forEach(rowId => {
            const row = document.getElementById(rowId);
            const cb = row?.querySelector('input[type="checkbox"]');
            if (row && cb) updateBAAlertRowStyle(rowId, cb.checked);
        });
    }

    // Restore schedule values
    if (saved.schedule) {
        const s = saved.schedule;
        const el = id => document.getElementById(id);
        if (el('baMonitorScheduleEnabled')) el('baMonitorScheduleEnabled').checked = !!s.enabled;
        if (s.enabled) toggleBAMonitorScheduleUI(true);
        if (el('baMonitorFrequency')) el('baMonitorFrequency').value = s.frequency || 'monthly';
        if (el('baMonitorDayOfWeek')) el('baMonitorDayOfWeek').value = s.dayOfWeek ?? 1;
        if (el('baMonitorDayOfMonth')) el('baMonitorDayOfMonth').value = s.dayOfMonth ?? 1;
        if (el('baMonitorTime')) el('baMonitorTime').value = s.time || '08:00';
        if (el('baMonitorTimezone')) el('baMonitorTimezone').value = s.timezone || 'America/New_York';
        updateBAMonitorFreqUI();
    }

    // Update location display and subscriber chips
    updateBAMonitoringLocationDisplay();
    refreshBAMonitorSubscriberChips();
    renderBAMonitoringStatus();
}

function toggleBAMonitoringEnabled(enabled) {
    baState.monitoringActive = enabled;
    const track = document.getElementById('baMonitoringTrack');
    const thumb = document.getElementById('baMonitoringThumb');
    const label = document.getElementById('baMonitoringLabel');
    const content = document.getElementById('baMonitoringContent');

    if (enabled) {
        if (track) track.style.background = '#0ea5e9';
        if (thumb) thumb.style.left = '22px';
        if (label) { label.textContent = 'Enabled'; label.style.color = '#0ea5e9'; }
        if (content) content.style.display = 'block';
    } else {
        if (track) track.style.background = '#cbd5e1';
        if (thumb) thumb.style.left = '2px';
        if (label) { label.textContent = 'Disabled'; label.style.color = '#64748b'; }
        if (content) content.style.display = 'none';
    }
}

function updateBAMonitoringLocationDisplay() {
    const nameEl = document.getElementById('baMonitorLocationName');
    const hintEl = document.getElementById('baMonitorLocationHint');
    if (!nameEl) return;

    if (baState.locationName) {
        nameEl.textContent = baState.locationName;
        if (hintEl) hintEl.style.display = 'none';
    } else {
        nameEl.textContent = 'No location selected';
        if (hintEl) hintEl.style.display = 'inline';
    }
}

function updateBAAlertRowStyle(rowId, checked) {
    const row = document.getElementById(rowId);
    if (!row) return;
    row.style.background = checked ? '#f0f9ff' : 'white';
    row.style.borderColor = checked ? '#7dd3fc' : '#e2e8f0';
}

function toggleBAMonitorScheduleUI(enabled) {
    const opts = document.getElementById('baMonitorScheduleOptions');
    if (opts) opts.style.display = enabled ? 'block' : 'none';
}

function updateBAMonitorFreqUI() {
    const freq = document.getElementById('baMonitorFrequency')?.value || 'monthly';
    const weeklyDay = document.getElementById('baMonitorWeeklyDay');
    const monthlyDay = document.getElementById('baMonitorMonthlyDay');
    if (weeklyDay) weeklyDay.style.display = freq === 'weekly' ? 'block' : 'none';
    if (monthlyDay) monthlyDay.style.display = freq !== 'weekly' ? 'block' : 'none';
}

function saveBAMonitoringSettings() {
    const el = id => document.getElementById(id);

    // Build monitoring preferences
    const monitoring = {
        enabled: baState.monitoringActive,
        locationName: baState.locationName || '',
        locationKey: baState.selectedLocation ? `${baState.selectedLocation.type}:${baState.selectedLocation.value}` : '',
        alerts: {
            crashCountEnabled: el('baAlertCrashCount')?.checked || false,
            crashCountThreshold: parseInt(el('baAlertCrashCountVal')?.value) || 5,
            crashCountWindowMonths: parseInt(el('baAlertCrashCountPeriod')?.value) || 6,
            severityEnabled: el('baAlertSeverity')?.checked || false,
            severityLevel: el('baAlertSeverityLevel')?.value || 'KA',
            trendEnabled: el('baAlertTrend')?.checked || false,
            trendIncreasePercent: parseInt(el('baAlertTrendPercent')?.value) || 25,
            cmfDeteriorationEnabled: el('baAlertCMF')?.checked || false,
            cmfThreshold: parseFloat(el('baAlertCMFThreshold')?.value) || 1.0
        },
        schedule: {
            enabled: el('baMonitorScheduleEnabled')?.checked || false,
            frequency: el('baMonitorFrequency')?.value || 'monthly',
            dayOfWeek: parseInt(el('baMonitorDayOfWeek')?.value) || 1,
            dayOfMonth: parseInt(el('baMonitorDayOfMonth')?.value) || 1,
            time: el('baMonitorTime')?.value || '08:00',
            timezone: el('baMonitorTimezone')?.value || 'America/New_York'
        },
        cooldownDays: 30,
        lastAlertSent: notificationState.preferences.ba?.monitoring?.lastAlertSent || null
    };

    // Validate
    if (monitoring.enabled && !monitoring.locationName) {
        showToast('Please select a location before saving monitoring settings', 'warning');
        return;
    }

    const hasAnyAlert = monitoring.alerts.crashCountEnabled || monitoring.alerts.severityEnabled ||
                        monitoring.alerts.trendEnabled || monitoring.alerts.cmfDeteriorationEnabled;
    const hasSchedule = monitoring.schedule.enabled;

    if (monitoring.enabled && !hasAnyAlert && !hasSchedule) {
        showToast('Enable at least one alert condition or scheduled report', 'warning');
        return;
    }

    // Preserve server alert ID from previous save
    monitoring.serverAlertId = notificationState.preferences.ba?.monitoring?.serverAlertId || null;

    // Save locally
    if (!notificationState.preferences.ba) notificationState.preferences.ba = {};
    notificationState.preferences.ba.monitoring = monitoring;
    saveNotificationPreferences();

    renderBAMonitoringStatus();
    showToast('Monitoring settings saved', 'success');

    // Sync to server for automated background monitoring
    if (monitoring.enabled && hasAnyAlert) {
        syncBAMonitoringToServer();
    } else if (!monitoring.enabled && monitoring.serverAlertId) {
        deleteBAMonitoringFromServer();
    }
}

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.ba = CL.reports.ba || {};
  window.initBAMonitoringPanel = initBAMonitoringPanel; CL.reports.ba.initBAMonitoringPanel = initBAMonitoringPanel;
  window.toggleBAMonitoringEnabled = toggleBAMonitoringEnabled; CL.reports.ba.toggleBAMonitoringEnabled = toggleBAMonitoringEnabled;
  window.updateBAMonitoringLocationDisplay = updateBAMonitoringLocationDisplay; CL.reports.ba.updateBAMonitoringLocationDisplay = updateBAMonitoringLocationDisplay;
  window.updateBAAlertRowStyle = updateBAAlertRowStyle; CL.reports.ba.updateBAAlertRowStyle = updateBAAlertRowStyle;
  window.toggleBAMonitorScheduleUI = toggleBAMonitorScheduleUI; CL.reports.ba.toggleBAMonitorScheduleUI = toggleBAMonitorScheduleUI;
  window.updateBAMonitorFreqUI = updateBAMonitorFreqUI; CL.reports.ba.updateBAMonitorFreqUI = updateBAMonitorFreqUI;
  window.saveBAMonitoringSettings = saveBAMonitoringSettings; CL.reports.ba.saveBAMonitoringSettings = saveBAMonitoringSettings;
  CL._registerModule('reports/report-ba-monitor');
})();
