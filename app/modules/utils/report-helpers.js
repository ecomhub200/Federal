/**
 * CL utils.reportHelpers — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.utils.reportHelpers.<fn>; module-private
 * state (0 external refs) stays inside this IIFE.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
// Generate data-driven insights based on crash patterns
function generateDataInsight(crashes, collisionBreakdown, dayHourMatrix, lightConditions) {
    const insights = [];
    const total = crashes.length;

    // Top collision type insight
    if (collisionBreakdown.length > 0) {
        const top = collisionBreakdown[0];
        const pct = ((top.count / total) * 100).toFixed(0);
        if (top.count > total * 0.25) {
            insights.push(`${top.name} crashes represent ${pct}% of incidents - ${top.K > 0 ? 'including ' + top.K + ' fatal' : 'consider targeted countermeasures'}`);
        }
    }

    // Peak time insight
    if (dayHourMatrix.peakCell.count > 0) {
        const hourStr = dayHourMatrix.peakCell.hour > 12
            ? `${dayHourMatrix.peakCell.hour - 12}:00 PM`
            : `${dayHourMatrix.peakCell.hour}:00 AM`;
        insights.push(`${dayHourMatrix.peakCell.day} at ${hourStr} shows highest crash concentration (${dayHourMatrix.peakCell.count} crashes)`);
    }

    // Light conditions insight
    const darkCrashes = lightConditions.filter(l =>
        l.name.toLowerCase().includes('dark') || l.name.toLowerCase().includes('night')
    ).reduce((sum, l) => sum + l.count, 0);
    const darkPct = ((darkCrashes / total) * 100).toFixed(0);
    if (darkPct > 35) {
        insights.push(`${darkPct}% of crashes occur in dark conditions - lighting improvements may reduce severity`);
    }

    return insights.slice(0, 3);
}

// Sanitize text for export (fix encoding issues)
function sanitizeTextForExport(text) {
    if (!text) return '';
    return String(text)
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, '-')
        .replace(/[\u2026]/g, '...')
        .replace(/[\u00A0]/g, ' ')
        .replace(/[^\x00-\x7F]/g, char => {
            const code = char.charCodeAt(0);
            if (code >= 0x80 && code <= 0xFF) return char;
            return '';
        });
}

// Format collision type name - remove leading code numbers (e.g., "2. Angle" -> "Angle")
function formatCollisionType(name) {
    if (!name) return 'Unknown';
    // Remove patterns like "2. ", "02. ", "2 - ", etc.
    return String(name).replace(/^\d+[\.\-\s]+\s*/, '').trim() || name;
}

// Check if location code is valid (filter out garbage codes)
function isValidLocationCode(code) {
    if (!code) return false;
    const str = String(code).trim();
    // Filter out codes ending with "UK" (unknown) or matching garbage patterns
    if (/UK$/i.test(str)) return false;
    if (/^U-VA.*UK$/i.test(str)) return false;
    if (/99999/i.test(str)) return false;
    // Must have some meaningful content
    if (str.length < 3) return false;
    return true;
}

// Calculate location data coverage percentage
function calculateLocationCoverage(crashes) {
    if (!crashes || crashes.length === 0) return { total: 0, withLocation: 0, percentage: 0 };
    const total = crashes.length;
    const withLocation = crashes.filter(c => {
        const route = c[COL.ROUTE];
        return route && isValidLocationCode(route);
    }).length;
    return {
        total,
        withLocation,
        percentage: ((withLocation / total) * 100).toFixed(1)
    };
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.utils = CL.utils || {};
  CL.utils.reportHelpers = CL.utils.reportHelpers || {};
  window.generateDataInsight = generateDataInsight; CL.utils.reportHelpers.generateDataInsight = generateDataInsight;
  window.sanitizeTextForExport = sanitizeTextForExport; CL.utils.reportHelpers.sanitizeTextForExport = sanitizeTextForExport;
  window.formatCollisionType = formatCollisionType; CL.utils.reportHelpers.formatCollisionType = formatCollisionType;
  window.isValidLocationCode = isValidLocationCode; CL.utils.reportHelpers.isValidLocationCode = isValidLocationCode;
  window.calculateLocationCoverage = calculateLocationCoverage; CL.utils.reportHelpers.calculateLocationCoverage = calculateLocationCoverage;
  CL._registerModule('utils/report-helpers');
})();
