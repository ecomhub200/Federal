/**
 * CL reports.ba — BA alert evaluation + alert-email + test alert
 * Extracted verbatim from app/index.html (Before/After report band, prompt
 * 42c, size-split). NO behavior change. baState stays INLINE (read via global
 * scope); all fns dual-exposed window.<fn> + CL.reports.ba.<fn> (onclick + cross-file).
 * Depends at call time: baState, COL, crashState, docx, jsPDF, html2canvas, Chart.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
function evaluateBAAlertConditions() {
    const monitoring = notificationState.preferences.ba?.monitoring;
    if (!monitoring?.enabled) return { triggered: false, conditions: [] };

    const conditions = [];
    const crashes = baState.locationCrashes || [];
    const results = baState.results;
    const alerts = monitoring.alerts;

    // 1. Crash Count Threshold
    if (alerts.crashCountEnabled) {
        const windowMonths = alerts.crashCountWindowMonths || 6;
        const threshold = alerts.crashCountThreshold || 5;
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - windowMonths);

        const recentCrashes = crashes.filter(c => {
            const d = c.date ? new Date(c.date) : null;
            return d && d >= cutoff;
        });

        if (recentCrashes.length > threshold) {
            conditions.push({
                type: 'crash_count',
                severity: 'warning',
                title: 'Crash Count Threshold Exceeded',
                message: `${recentCrashes.length} crashes in the last ${windowMonths} months (threshold: ${threshold})`,
                value: recentCrashes.length,
                threshold: threshold
            });
        }
    }

    // 2. Severity Alert
    if (alerts.severityEnabled) {
        const level = alerts.severityLevel || 'KA';
        const targetSevs = level === 'K' ? ['K'] : level === 'KA' ? ['K', 'A'] : ['K', 'A', 'B'];
        const last90Days = new Date();
        last90Days.setDate(last90Days.getDate() - 90);

        const severeCrashes = crashes.filter(c => {
            const d = c.date ? new Date(c.date) : null;
            const sev = (c.sev || '').charAt(0).toUpperCase();
            return d && d >= last90Days && targetSevs.includes(sev);
        });

        if (severeCrashes.length > 0) {
            const sevLabel = level === 'K' ? 'Fatal' : level === 'KA' ? 'Fatal + Serious Injury' : 'Any Injury';
            conditions.push({
                type: 'severity',
                severity: 'critical',
                title: `${sevLabel} Crash Detected`,
                message: `${severeCrashes.length} ${sevLabel.toLowerCase()} crash(es) in the last 90 days`,
                value: severeCrashes.length,
                threshold: 0
            });
        }
    }

    // 3. Trend Detection (requires analysis results)
    if (alerts.trendEnabled && results) {
        const increaseThreshold = alerts.trendIncreasePercent || 25;
        const beforeRate = results.before?.stats?.total || 0;
        const afterRate = results.after?.stats?.total || 0;

        if (beforeRate > 0) {
            const changePercent = ((afterRate - beforeRate) / beforeRate) * 100;
            if (changePercent >= increaseThreshold) {
                conditions.push({
                    type: 'trend',
                    severity: 'warning',
                    title: 'Crash Rate Increase Detected',
                    message: `Crash rate increased by ${changePercent.toFixed(1)}% after treatment (threshold: ${increaseThreshold}%)`,
                    value: changePercent.toFixed(1),
                    threshold: increaseThreshold
                });
            }
        }
    }

    // 4. CMF Deterioration (requires analysis results)
    if (alerts.cmfDeteriorationEnabled && results) {
        const cmfThreshold = alerts.cmfThreshold || 1.0;
        const currentCMF = results.cmf;

        if (currentCMF !== undefined && currentCMF > cmfThreshold) {
            conditions.push({
                type: 'cmf',
                severity: 'critical',
                title: 'CMF Deterioration Alert',
                message: `Current CMF is ${currentCMF.toFixed(3)} (threshold: ${cmfThreshold.toFixed(2)}) — treatment may be losing effectiveness`,
                value: currentCMF.toFixed(3),
                threshold: cmfThreshold
            });
        }
    }

    return { triggered: conditions.length > 0, conditions };
}

function buildBAAlertEmailHtml(conditions, locationName) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const results = baState.results;

    let conditionRows = conditions.map(c => {
        const bgColor = c.severity === 'critical' ? '#fef2f2' : '#fffbeb';
        const borderColor = c.severity === 'critical' ? '#fecaca' : '#fde68a';
        const iconColor = c.severity === 'critical' ? '#dc2626' : '#d97706';
        const icon = c.severity === 'critical' ? '&#9888;' : '&#9888;';
        return `
            <div style="background:${bgColor};border:1.5px solid ${borderColor};border-radius:8px;padding:14px 16px;margin-bottom:10px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                    <span style="color:${iconColor};font-size:16px">${icon}</span>
                    <strong style="color:${iconColor};font-size:14px">${c.title}</strong>
                </div>
                <p style="margin:0;color:#334155;font-size:13px;line-height:1.5">${c.message}</p>
            </div>`;
    }).join('');

    let summaryHtml = '';
    if (results) {
        const changeColor = results.crf >= 0 ? '#16a34a' : '#dc2626';
        const changeIcon = results.crf >= 0 ? '&#9660;' : '&#9650;';
        summaryHtml = `
            <div style="background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1.5px solid #7dd3fc;border-radius:10px;padding:16px;margin:16px 0">
                <h3 style="margin:0 0 12px;color:#0369a1;font-size:14px">Current Analysis Summary</h3>
                <div style="display:flex;gap:10px;flex-wrap:wrap">
                    <div style="flex:1;min-width:80px;background:white;border-radius:8px;padding:10px;text-align:center;border:1px solid #e2e8f0">
                        <div style="font-size:10px;color:#64748b;margin-bottom:3px">CMF</div>
                        <div style="font-size:18px;font-weight:700;color:#1e40af">${results.cmf.toFixed(3)}</div>
                    </div>
                    <div style="flex:1;min-width:80px;background:white;border-radius:8px;padding:10px;text-align:center;border:1px solid #e2e8f0">
                        <div style="font-size:10px;color:#64748b;margin-bottom:3px">Crash Change</div>
                        <div style="font-size:18px;font-weight:700;color:${changeColor}">${changeIcon} ${Math.abs(results.crf).toFixed(1)}%</div>
                    </div>
                    <div style="flex:1;min-width:80px;background:white;border-radius:8px;padding:10px;text-align:center;border:1px solid #e2e8f0">
                        <div style="font-size:10px;color:#64748b;margin-bottom:3px">Before Crashes</div>
                        <div style="font-size:18px;font-weight:700;color:#991b1b">${results.before?.stats?.total || 0}</div>
                    </div>
                    <div style="flex:1;min-width:80px;background:white;border-radius:8px;padding:10px;text-align:center;border:1px solid #e2e8f0">
                        <div style="font-size:10px;color:#64748b;margin-bottom:3px">After Crashes</div>
                        <div style="font-size:18px;font-weight:700;color:#166534">${results.after?.stats?.total || 0}</div>
                    </div>
                </div>
            </div>`;
    }

    return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#ffffff">
        <div style="background:linear-gradient(135deg,#dc2626 0%,#ea580c 50%,#d97706 100%);padding:28px 32px;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:22px;font-weight:600;letter-spacing:0.5px">CRASH LENS</h1>
            <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:15px;font-weight:500">&#9888; Crash Monitoring Alert</p>
        </div>
        <div style="padding:28px 32px;background:#ffffff;border:1px solid #e2e8f0;border-top:none">
            <p style="color:#1e293b;font-size:15px;margin:0 0 6px;line-height:1.6">
                Alert triggered for <strong>${locationName || 'Unknown Location'}</strong>
            </p>
            <p style="color:#64748b;font-size:13px;margin:0 0 20px">${dateStr}</p>

            <h3 style="margin:0 0 12px;color:#1e293b;font-size:15px;font-weight:600">Triggered Conditions</h3>
            ${conditionRows}
            ${summaryHtml}

            <div style="margin-top:20px;padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px">
                <p style="margin:0;color:#475569;font-size:12px;line-height:1.5">
                    This is an automated alert from Crash Lens crash monitoring.
                    Log in to your Crash Lens account to view the full Before/After analysis and adjust alert settings.
                </p>
            </div>
        </div>
        <div style="padding:16px 32px;background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;text-align:center">
            <p style="margin:0;color:#94a3b8;font-size:11px">Crash Lens &mdash; Traffic Safety Analysis Tool</p>
        </div>
    </div>`;
}

async function sendBAMonitoringTestAlert() {
    const emails = notificationState.preferences.emails || [];
    if (emails.length === 0) {
        showToast('Add at least one email subscriber first', 'warning');
        return;
    }

    const locationName = baState.locationName || 'Test Location';
    const sampleConditions = [
        {
            type: 'crash_count',
            severity: 'warning',
            title: 'Crash Count Threshold Exceeded',
            message: `7 crashes in the last 6 months (threshold: 5) — this is a TEST alert`,
            value: 7,
            threshold: 5
        },
        {
            type: 'severity',
            severity: 'critical',
            title: 'Fatal + Serious Injury Crash Detected',
            message: `2 fatal + serious injury crash(es) in the last 90 days — this is a TEST alert`,
            value: 2,
            threshold: 0
        }
    ];

    const html = buildBAAlertEmailHtml(sampleConditions, locationName);
    const recipients = emails.map(e => e.address || e).filter(Boolean);
    const subject = `[TEST] Crash Monitoring Alert — ${locationName}`;
    const plainText = `Test crash monitoring alert for ${locationName}. This is a test — no action required.`;

    const brevoSource = notificationState.preferences.brevo?.source || 'auto';
    const hasCoolifyBackend = brevoSource === 'auto';

    try {
        showToast('Sending test alert...', 'info');
        let sent = false;

        // Try Coolify backend first
        if (hasCoolifyBackend) {
            try {
                const resp = await fetch('/api/notify/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: recipients,
                        subject: subject,
                        html: html,
                        text: plainText,
                        tag: 'ba-monitoring-test'
                    })
                });
                if (resp.ok) {
                    const result = await resp.json();
                    if (result.success) { sent = true; }
                } else {
                    console.warn('[BA Monitoring] Coolify send failed:', resp.status, '— trying direct Brevo...');
                }
            } catch (coolifyErr) {
                console.warn('[BA Monitoring] Coolify backend unavailable:', coolifyErr.message, '— trying direct Brevo...');
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
                    subject: subject,
                    htmlContent: html,
                    tags: ['crash-lens', 'ba-monitoring-test'],
                    headers: { 'X-Entity-Ref-ID': crypto.randomUUID() }
                };
                const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
                    method: 'POST',
                    headers: { 'accept': 'application/json', 'content-type': 'application/json', 'api-key': apiKey },
                    body: JSON.stringify(brevoPayload)
                });
                if (resp.ok) { sent = true; }
                else { console.error('[BA Monitoring] Brevo direct send failed:', resp.status); }
            } else {
                console.warn('[BA Monitoring] No Brevo API key or sender email configured for direct fallback');
            }
        }

        if (sent) {
            showToast(`Test alert sent to ${recipients.length} recipient(s)`, 'success');
        } else {
            showToast('Failed to send test alert. Configure email settings under "Full Email Settings" or check server connection.', 'error');
        }
    } catch (err) {
        console.error('[BA Monitoring] Test alert error:', err);
        showToast('Failed to send test alert. Check email configuration.', 'error');
    }
}

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.ba = CL.reports.ba || {};
  window.evaluateBAAlertConditions = evaluateBAAlertConditions; CL.reports.ba.evaluateBAAlertConditions = evaluateBAAlertConditions;
  window.buildBAAlertEmailHtml = buildBAAlertEmailHtml; CL.reports.ba.buildBAAlertEmailHtml = buildBAAlertEmailHtml;
  window.sendBAMonitoringTestAlert = sendBAMonitoringTestAlert; CL.reports.ba.sendBAMonitoringTestAlert = sendBAMonitoringTestAlert;
  CL._registerModule('reports/report-ba-monitor2');
})();
