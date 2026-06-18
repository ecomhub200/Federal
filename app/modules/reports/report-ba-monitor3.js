/**
 * CL reports.ba — BA monitoring status/subscribers + server sync
 * Extracted verbatim from app/index.html (Before/After report band, prompt
 * 42c, size-split). NO behavior change. baState stays INLINE (read via global
 * scope); all fns dual-exposed window.<fn> + CL.reports.ba.<fn> (onclick + cross-file).
 * Depends at call time: baState, COL, crashState, docx, jsPDF, html2canvas, Chart.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
function renderBAMonitoringStatus() {
    const badge = document.getElementById('baMonitoringStatusBadge');
    if (!badge) return;

    const monitoring = notificationState.preferences.ba?.monitoring;
    if (!monitoring?.enabled) {
        badge.style.display = 'none';
        return;
    }

    const hasAlerts = monitoring.alerts?.crashCountEnabled || monitoring.alerts?.severityEnabled ||
                      monitoring.alerts?.trendEnabled || monitoring.alerts?.cmfDeteriorationEnabled;
    const hasSchedule = monitoring.schedule?.enabled;
    const lastSent = monitoring.lastAlertSent ? new Date(monitoring.lastAlertSent).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}) : null;

    let statusParts = [];
    if (hasAlerts) statusParts.push('Condition alerts ON');
    if (hasSchedule) statusParts.push(`${monitoring.schedule.frequency} reports ON`);

    badge.style.display = 'flex';
    badge.style.background = '#f0fdf4';
    badge.style.border = '1px solid #bbf7d0';
    badge.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg>
        <span style="color:#166534;font-weight:500">Active</span>
        <span style="color:#64748b;margin-left:.25rem">&mdash; ${statusParts.join(' | ') || 'No conditions configured'}</span>
        ${lastSent ? `<span style="color:#94a3b8;margin-left:auto;font-size:.75rem">Last alert: ${lastSent}</span>` : ''}
    `;
}

function checkBAMonitoringOnDataLoad() {
    const monitoring = notificationState.preferences.ba?.monitoring;
    if (!monitoring?.enabled) return;

    const evaluation = evaluateBAAlertConditions();
    if (!evaluation.triggered) return;

    // Check cooldown
    if (monitoring.lastAlertSent) {
        const cooldownMs = (monitoring.cooldownDays || 30) * 24 * 60 * 60 * 1000;
        const lastSent = new Date(monitoring.lastAlertSent).getTime();
        if (Date.now() - lastSent < cooldownMs) {
            console.log('[BA Monitoring] Alert conditions met but within cooldown period');
            return;
        }
    }

    // Send alert
    const emails = notificationState.preferences.emails || [];
    if (emails.length === 0) {
        console.log('[BA Monitoring] Alert conditions met but no subscribers configured');
        return;
    }

    const locationName = monitoring.locationName || baState.locationName || 'Unknown Location';
    const html = buildBAAlertEmailHtml(evaluation.conditions, locationName);
    const recipients = emails.map(e => e.address || e).filter(Boolean);
    const subject = `Crash Monitoring Alert — ${locationName}`;
    const plainText = evaluation.conditions.map(c => `${c.title}: ${c.message}`).join('\n');

    const brevoSource = notificationState.preferences.brevo?.source || 'auto';
    const hasCoolifyBackend = brevoSource === 'auto';

    (async () => {
        try {
            let sent = false;

            // Try Coolify backend first
            if (hasCoolifyBackend) {
                try {
                    const resp = await fetch('/api/notify/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ to: recipients, subject, html, text: plainText, tag: 'ba-monitoring-alert' })
                    });
                    if (resp.ok) {
                        const result = await resp.json();
                        if (result.success) { sent = true; }
                    } else {
                        console.warn('[BA Monitoring] Coolify send failed:', resp.status, '— trying direct Brevo...');
                    }
                } catch (coolifyErr) {
                    console.warn('[BA Monitoring] Coolify backend unavailable:', coolifyErr.message);
                }
            }

            // Fallback: direct Brevo API
            if (!sent) {
                const apiKey = document.getElementById('brevoApiKeyInput')?.value?.trim() || notificationState.preferences.brevo?.apiKey;
                const fromEmail = document.getElementById('brevoFromEmail')?.value?.trim() || notificationState.preferences.brevo?.fromEmail;
                const fromName = document.getElementById('brevoFromName')?.value?.trim() || notificationState.preferences.brevo?.fromName || 'CRASH LENS';

                if (apiKey && fromEmail) {
                    const brevoPayload = {
                        sender: { email: fromEmail, name: fromName },
                        replyTo: { email: 'support@aicreatesai.com', name: 'CRASH LENS Support' },
                        to: recipients.map(email => ({ email })),
                        subject, htmlContent: html,
                        tags: ['crash-lens', 'ba-monitoring-alert'],
                        headers: { 'X-Entity-Ref-ID': crypto.randomUUID() }
                    };
                    const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
                        method: 'POST',
                        headers: { 'accept': 'application/json', 'content-type': 'application/json', 'api-key': apiKey },
                        body: JSON.stringify(brevoPayload)
                    });
                    if (resp.ok) { sent = true; }
                }
            }

            if (sent) {
                monitoring.lastAlertSent = new Date().toISOString();
                saveNotificationPreferences();
                renderBAMonitoringStatus();
                showToast(`Monitoring alert sent to ${recipients.length} recipient(s)`, 'info');
            }
        } catch (err) {
            console.error('[BA Monitoring] Failed to send alert:', err);
        }
    })();
}

function addBAMonitorSubscriber() {
    const input = document.getElementById('baMonitorEmailInput');
    if (!input) return;
    const email = input.value.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address', 'warning');
        return;
    }

    if (!notificationState.preferences.emails) notificationState.preferences.emails = [];
    const existing = notificationState.preferences.emails.find(e => (e.address || e).toLowerCase() === email);
    if (existing) {
        showToast('This email is already in the subscriber list', 'info');
        input.value = '';
        return;
    }

    notificationState.preferences.emails.push({ address: email, isPrimary: notificationState.preferences.emails.length === 0 });
    saveNotificationPreferences();
    input.value = '';
    refreshBAMonitorSubscriberChips();
    showToast(`${email} added to subscribers`, 'success');
}

function removeBAMonitorSubscriber(email) {
    if (!notificationState.preferences.emails) return;
    notificationState.preferences.emails = notificationState.preferences.emails.filter(e => (e.address || e).toLowerCase() !== email.toLowerCase());
    saveNotificationPreferences();
    refreshBAMonitorSubscriberChips();
}

function refreshBAMonitorSubscriberChips() {
    const container = document.getElementById('baMonitorSubscriberChips');
    if (!container) return;

    const emails = notificationState.preferences.emails || [];
    if (emails.length === 0) {
        container.innerHTML = '<span style="font-size:.8rem;color:#94a3b8">No subscribers configured</span>';
        return;
    }

    const maxShow = 3;
    const shown = emails.slice(0, maxShow);
    const remaining = emails.length - maxShow;

    container.innerHTML = shown.map(e => {
        const addr = e.address || e;
        return `<span style="display:inline-flex;align-items:center;gap:.3rem;padding:.2rem .55rem;background:#dbeafe;color:#1e40af;border-radius:12px;font-size:.78rem;border:1px solid #93c5fd">
            ${addr}
            <span onclick="removeBAMonitorSubscriber('${addr}')" style="cursor:pointer;color:#64748b;font-weight:bold;font-size:.9rem;line-height:1" title="Remove">&times;</span>
        </span>`;
    }).join('') + (remaining > 0 ? `<span style="font-size:.78rem;color:#64748b;padding:.2rem .4rem">+${remaining} more</span>` : '');
}

/**
 * Sync B/A monitoring alert config to server (Firestore crashAlerts collection).
 * This enables server-side automated monitoring every 6 hours without requiring
 * the user to have the app open.
 */
async function syncBAMonitoringToServer() {
    const monitoring = notificationState.preferences.ba?.monitoring;
    if (!monitoring) return;

    const user = typeof CrashLensAuth !== 'undefined' ? CrashLensAuth.getCurrentUser() : null;
    if (!user) {
        console.log('[BA Monitoring] User not authenticated, skipping server sync');
        return;
    }

    // Build R2 path for the current jurisdiction's crash data
    const stateKey = (typeof _getActiveStateKey === 'function') ? _getActiveStateKey() : (appConfig?.defaultState || '');
    const jurisdictionId = (typeof getActiveJurisdictionId === 'function') ? getActiveJurisdictionId() : '';
    const roadType = (typeof getActiveRoadTypeSuffix === 'function') ? getActiveRoadTypeSuffix() : 'all_roads';
    const r2Path = stateKey && jurisdictionId ? `${stateKey}/${jurisdictionId}/${roadType}.csv.gz` : '';

    if (!r2Path) {
        console.warn('[BA Monitoring] Cannot determine R2 path for crash data, skipping server sync');
        return;
    }

    const recipients = (notificationState.preferences.emails || []).map(e => e.address || e).filter(Boolean);
    const token = await user.getIdToken();

    const payload = {
        alertId: monitoring.serverAlertId || null,
        enabled: monitoring.enabled && recipients.length > 0,
        locationName: monitoring.locationName || baState.locationName || '',
        locationType: baState.selectedLocation?.type || 'route',
        locationValue: baState.selectedLocation?.value || '',
        r2Path: r2Path,
        recipients: recipients,
        thresholds: {
            crashCountEnabled: monitoring.alerts?.crashCountEnabled ?? false,
            crashCountThreshold: monitoring.alerts?.crashCountThreshold ?? 5,
            crashCountWindowMonths: monitoring.alerts?.crashCountWindowMonths ?? 6,
            severityEnabled: monitoring.alerts?.severityEnabled ?? false,
            severityLevel: monitoring.alerts?.severityLevel ?? 'KA',
            trendEnabled: monitoring.alerts?.trendEnabled ?? false,
            trendIncreasePercent: monitoring.alerts?.trendIncreasePercent ?? 25,
            trendWindowMonths: 12
        },
        cooldownDays: monitoring.cooldownDays || 30,
        state: stateKey,
        jurisdiction: jurisdictionId,
        agency: appConfig?.agency || ''
    };

    try {
        const resp = await fetch('/api/crash-alerts/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await resp.json().catch(() => ({ success: false, error: `Server returned ${resp.status}` }));
        if (result.success) {
            // Store the server alert ID so we can update it later
            if (!monitoring.serverAlertId) {
                monitoring.serverAlertId = result.alertId;
                saveNotificationPreferences();
            }
            console.log(`[BA Monitoring] Synced to server (alertId: ${result.alertId}, next check: ${result.nextCheckAt})`);
        } else {
            console.warn('[BA Monitoring] Server sync failed:', result.error || resp.status, '— alert saved locally only');
        }
    } catch (err) {
        console.warn('[BA Monitoring] Server sync unavailable:', err.message, '— alert saved locally only');
    }
}

/**
 * Delete the server-side crash alert when monitoring is disabled.
 */
async function deleteBAMonitoringFromServer() {
    const monitoring = notificationState.preferences.ba?.monitoring;
    const alertId = monitoring?.serverAlertId;
    if (!alertId) return;

    const user = typeof CrashLensAuth !== 'undefined' ? CrashLensAuth.getCurrentUser() : null;
    if (!user) return;

    try {
        const token = await user.getIdToken();
        await fetch(`/api/crash-alerts/${alertId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        monitoring.serverAlertId = null;
        saveNotificationPreferences();
        console.log(`[BA Monitoring] Deleted server alert ${alertId}`);
    } catch (err) {
        console.error('[BA Monitoring] Failed to delete server alert:', err);
    }
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.ba = CL.reports.ba || {};
  window.renderBAMonitoringStatus = renderBAMonitoringStatus; CL.reports.ba.renderBAMonitoringStatus = renderBAMonitoringStatus;
  window.checkBAMonitoringOnDataLoad = checkBAMonitoringOnDataLoad; CL.reports.ba.checkBAMonitoringOnDataLoad = checkBAMonitoringOnDataLoad;
  window.addBAMonitorSubscriber = addBAMonitorSubscriber; CL.reports.ba.addBAMonitorSubscriber = addBAMonitorSubscriber;
  window.removeBAMonitorSubscriber = removeBAMonitorSubscriber; CL.reports.ba.removeBAMonitorSubscriber = removeBAMonitorSubscriber;
  window.refreshBAMonitorSubscriberChips = refreshBAMonitorSubscriberChips; CL.reports.ba.refreshBAMonitorSubscriberChips = refreshBAMonitorSubscriberChips;
  window.syncBAMonitoringToServer = syncBAMonitoringToServer; CL.reports.ba.syncBAMonitoringToServer = syncBAMonitoringToServer;
  window.deleteBAMonitoringFromServer = deleteBAMonitoringFromServer; CL.reports.ba.deleteBAMonitoringFromServer = deleteBAMonitoringFromServer;
  CL._registerModule('reports/report-ba-monitor3');
})();
