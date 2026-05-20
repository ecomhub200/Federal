/** CL notifications.emailTemplates \u2014 email subject + content builders extracted 2026-05-19.
 *  No behavior change. Pure-ish helpers; read inline globals (computeStats, EPDO_WEIGHTS, COL) via shared classic-script global scope. */
(function(){ 'use strict';
// ─── EXTRACTED CODE START (verbatim) ───
// Build a dynamic email subject line with crash stats
function buildEmailSubjectLine(reportType, jurisdiction, crashes, startDate, endDate) {
    const stats = computeStats(crashes);
    const shortLabels = {
        'infographic': 'Infographic',
        'comprehensive': 'Comprehensive Report',
        'corridor': 'Corridor Analysis',
        'intersection': 'Intersection Analysis',
        'systemwide': 'System-Wide Summary',
        'dashboard': 'Executive Dashboard',
        'safety': 'Safety Performance',
        'safetyfocus': 'Safety Focus',
        'pedbike': 'Ped/Bike Safety',
        'trend': 'Trend Analysis',
        'countermeasures': 'Countermeasures',
        'crashtree': 'Systemic Safety',
        'fatalspeed': 'Fatal & Speed',
        'hotspot': 'Hotspot Report',
        'beforeafter': 'Before/After Study',
        'grantsupport': 'Grant Support'
    };
    const typeLabel = shortLabels[reportType] || 'Crash Report';

    // Format time period
    let period = '';
    if (startDate && endDate) {
        const s = new Date(startDate);
        const e = new Date(endDate);
        const sMonth = s.toLocaleDateString('en-US', { month: 'short' });
        const eMonth = e.toLocaleDateString('en-US', { month: 'short' });
        if (s.getFullYear() === e.getFullYear()) {
            period = `${sMonth}\u2013${eMonth} ${e.getFullYear()}`;
        } else {
            period = `${sMonth} ${s.getFullYear()}\u2013${eMonth} ${e.getFullYear()}`;
        }
    }

    const totalStr = stats.total.toLocaleString();
    const fatalStr = stats.K > 0 ? `, ${stats.K} Fatal` : '';
    const periodPart = period ? ` \u2014 ${period}` : '';
    return `${jurisdiction} ${typeLabel}${periodPart} | ${totalStr} Crashes${fatalStr}`;
}

// Build email-safe HTML stats section with severity breakdown
function buildEmailStatsSection(crashes) {
    const stats = computeStats(crashes);
    const epdo = (stats.K * (EPDO_WEIGHTS?.K || 462)) + (stats.A * (EPDO_WEIGHTS?.A || 62)) +
                 (stats.B * (EPDO_WEIGHTS?.B || 12)) + (stats.C * (EPDO_WEIGHTS?.C || 5)) + (stats.O * (EPDO_WEIGHTS?.O || 1));

    // 4-column stats table
    const statsHtml = `
    <table style="width:100%;border-collapse:collapse;margin:16px 0" cellpadding="0" cellspacing="0">
        <tr>
            <td style="width:25%;text-align:center;padding:14px 8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px 0 0 0">
                <div style="font-size:24px;font-weight:700;color:#1e293b">${stats.total.toLocaleString()}</div>
                <div style="font-size:11px;color:#64748b;margin-top:2px">Total Crashes</div>
            </td>
            <td style="width:25%;text-align:center;padding:14px 8px;background:#fef2f2;border:1px solid #e2e8f0">
                <div style="font-size:24px;font-weight:700;color:#dc2626">${stats.K}</div>
                <div style="font-size:11px;color:#991b1b;margin-top:2px">Fatal (K)</div>
            </td>
            <td style="width:25%;text-align:center;padding:14px 8px;background:#fff7ed;border:1px solid #e2e8f0">
                <div style="font-size:24px;font-weight:700;color:#ea580c">${stats.A}</div>
                <div style="font-size:11px;color:#9a3412;margin-top:2px">Serious (A)</div>
            </td>
            <td style="width:25%;text-align:center;padding:14px 8px;background:#eff6ff;border:1px solid #e2e8f0;border-radius:0 8px 0 0">
                <div style="font-size:24px;font-weight:700;color:#1e40af">${epdo.toLocaleString()}</div>
                <div style="font-size:11px;color:#1e3a8a;margin-top:2px">EPDO Score</div>
            </td>
        </tr>
    </table>`;

    // Severity breakdown with colored bars
    const sevItems = [
        { label: 'Fatal (K)', count: stats.K, color: '#dc2626' },
        { label: 'Incapacitating (A)', count: stats.A, color: '#ea580c' },
        { label: 'Non-Incapacitating (B)', count: stats.B, color: '#ca8a04' },
        { label: 'Possible Injury (C)', count: stats.C, color: '#2563eb' },
        { label: 'Property Damage (O)', count: stats.O, color: '#64748b' }
    ];
    const maxCount = Math.max(...sevItems.map(s => s.count), 1);

    let barsHtml = '<div style="margin:0 0 16px">';
    sevItems.forEach(item => {
        const pct = Math.round((item.count / maxCount) * 100);
        barsHtml += `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <div style="width:130px;font-size:12px;color:#475569;text-align:right">${item.label}</div>
            <div style="flex:1;background:#f1f5f9;border-radius:4px;height:16px;overflow:hidden">
                <div style="width:${pct}%;min-width:${item.count > 0 ? '2px' : '0'};background:${item.color};height:100%;border-radius:4px"></div>
            </div>
            <div style="width:50px;font-size:12px;font-weight:600;color:#1e293b">${item.count.toLocaleString()}</div>
        </div>`;
    });
    barsHtml += '</div>';

    return statsHtml + barsHtml;
}

// Build email-safe key findings section
function buildEmailFindings(crashes) {
    const stats = computeStats(crashes);
    if (stats.total === 0) return '';

    const findings = [];

    // Top collision type
    const collisionCounts = {};
    crashes.forEach(row => {
        const col = (row[COL.COLLISION] || '').toString().trim();
        if (col) collisionCounts[col] = (collisionCounts[col] || 0) + 1;
    });
    const topCollision = Object.entries(collisionCounts).sort((a, b) => b[1] - a[1])[0];
    if (topCollision) {
        const pct = Math.round((topCollision[1] / stats.total) * 100);
        findings.push(`<strong>${topCollision[0]}</strong> is the leading collision type at ${pct}% (${topCollision[1].toLocaleString()} crashes)`);
    }

    // Vulnerable road users
    const vuCount = stats.ped + stats.bike;
    if (vuCount > 0) {
        findings.push(`<strong>${vuCount.toLocaleString()}</strong> crashes involved vulnerable road users (${stats.ped} pedestrian, ${stats.bike} bicycle)`);
    }

    // K+A rate
    const kaCount = stats.K + stats.A;
    if (kaCount > 0) {
        const kaRate = ((kaCount / stats.total) * 100).toFixed(1);
        findings.push(`<strong>${kaRate}%</strong> of crashes resulted in fatal or serious injury (${kaCount.toLocaleString()} K+A crashes)`);
    }

    if (findings.length === 0) return '';

    let html = `
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px 18px;margin:16px 0">
        <div style="font-size:13px;font-weight:600;color:#92400e;margin-bottom:10px;display:flex;align-items:center;gap:6px">
            <span style="font-size:16px">&#9888;</span> Key Findings
        </div>`;
    findings.forEach(f => {
        html += `<div style="font-size:13px;color:#78350f;line-height:1.5;margin-bottom:6px;padding-left:12px;border-left:3px solid #f59e0b">${f}</div>`;
    });
    html += '</div>';
    return html;
}

// Get default report title based on type
function getDefaultReportTitle(reportType, jurisdiction) {
    const titles = {
        'infographic': `${jurisdiction} Traffic Safety Infographic`,
        'comprehensive': `${jurisdiction} Comprehensive Quarterly Report`,
        'corridor': `${jurisdiction} Corridor & Segment Analysis`,
        'intersection': `${jurisdiction} Intersection Safety Analysis`,
        'systemwide': `${jurisdiction} Executive Dashboard Summary`,
        'dashboard': `${jurisdiction} Executive Dashboard Summary`,
        'safety': `${jurisdiction} Safety Performance Report`,
        'safetyfocus': `${jurisdiction} Safety Focus Category Report`,
        'pedbike': `${jurisdiction} Vulnerable Road User Report`,
        'trend': `${jurisdiction} Multi-Year Trend Analysis`,
        'countermeasures': `${jurisdiction} Countermeasures Effectiveness Report`,
        'crashtree': `${jurisdiction} Systemic Safety Analysis`,
        'fatalspeed': `${jurisdiction} Fatal & Speed-Related Analysis`,
        'hotspot': `${jurisdiction} High-Crash Location Report`,
        'beforeafter': `${jurisdiction} Before/After Study Report`,
        'grantsupport': `${jurisdiction} Grant Application Support Package`
    };
    return titles[reportType] || `${jurisdiction} Crash Report`;
}
// ─── EXTRACTED CODE END ───

window.CL = window.CL || {};
CL.notifications = CL.notifications || {};
CL.notifications.emailTemplates = CL.notifications.emailTemplates || {};

// Dual public API \u2014 called by saveEmailNotificationSettings + generateGrantSummaryEmail (inline)
window.buildEmailSubjectLine = buildEmailSubjectLine;
CL.notifications.emailTemplates.buildEmailSubjectLine = buildEmailSubjectLine;
window.buildEmailStatsSection = buildEmailStatsSection;
CL.notifications.emailTemplates.buildEmailStatsSection = buildEmailStatsSection;
window.buildEmailFindings = buildEmailFindings;
CL.notifications.emailTemplates.buildEmailFindings = buildEmailFindings;
window.getDefaultReportTitle = getDefaultReportTitle;
CL.notifications.emailTemplates.getDefaultReportTitle = getDefaultReportTitle;

CL._registerModule('notifications/email-templates');
})();
