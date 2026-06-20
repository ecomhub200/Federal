/**
 * CL reports.recommend — memo recommendation + trend-analysis builders.
 * Extracted verbatim from app/index.html (was L60405-60656), modular
 * refactor prompt 42d (c). NO behavior change.
 *
 * Public API (back-compat dual exposure): window.<fn> + CL.reports.recommend.<fn>
 *   buildCollisionTypeBreakdown, buildSevereCrashPatterns,
 *   generateMemoRecommendations, generateSafetyMemoRecommendations,
 *   generateVRURecommendations, generateTrendAnalysis
 *
 * Depends (resolved at call time via global scope): docx (global lib),
 * MEMO_STYLES (inline const). All six are called from inline memo builders
 * in index.html, hence the window mirror.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
/**
 * Build collision type breakdown for memos
 */
function buildCollisionTypeBreakdown(crashes) {
    const { Paragraph, TextRun } = docx;

    const byType = {};
    crashes.forEach(c => {
        const type = c[COL.COLLISION] || 'Unknown';
        byType[type] = (byType[type] || 0) + 1;
    });

    const sorted = Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const total = crashes.length;

    return sorted.map(([type, count]) => new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: `${type}: ${count} crashes (${(count / total * 100).toFixed(1)}%)`, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
        spacing: { after: 80 }
    }));
}

/**
 * Build severe crash pattern analysis
 */
function buildSevereCrashPatterns(byType, byLight, total) {
    const { Paragraph, TextRun } = docx;
    const paragraphs = [];

    // Top collision types for severe crashes
    const topTypes = Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (topTypes.length > 0) {
        paragraphs.push(new Paragraph({
            children: [new TextRun({ text: 'Top Collision Types (K+A):', bold: true, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 100 }
        }));
        topTypes.forEach(([type, count]) => {
            paragraphs.push(new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: `${type}: ${count} crashes (${(count / total * 100).toFixed(1)}%)`, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
                spacing: { after: 80 }
            }));
        });
    }

    // Light conditions
    const darkCrashes = Object.entries(byLight).filter(([k]) => k.toLowerCase().includes('dark')).reduce((s, e) => s + e[1], 0);
    if (darkCrashes > 0) {
        paragraphs.push(new Paragraph({ spacing: { after: 150 } }));
        paragraphs.push(new Paragraph({
            children: [
                new TextRun({ text: 'Dark Conditions: ', bold: true, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily }),
                new TextRun({ text: `${darkCrashes} K+A crashes (${(darkCrashes / total * 100).toFixed(1)}%) occurred in dark conditions`, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })
            ],
            spacing: { after: 100 }
        }));
    }

    return paragraphs;
}

/**
 * Generate recommendations for memo
 */
function generateMemoRecommendations(stats, crashes) {
    const { Paragraph, TextRun } = docx;
    const recs = [];

    // Based on crash patterns
    if (stats.K > 0 || stats.A > 5) {
        recs.push(new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'Conduct Road Safety Audits at high-severity crash locations to identify systemic safety issues.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 100 }
        }));
    }

    if (stats.ped > 5) {
        recs.push(new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'Implement pedestrian safety countermeasures including Rectangular Rapid Flashing Beacons (RRFBs), Leading Pedestrian Intervals, and enhanced crosswalk markings.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 100 }
        }));
    }

    if (stats.bike > 3) {
        recs.push(new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'Consider bicycle infrastructure improvements such as protected bike lanes, bike boxes, and improved intersection treatments.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 100 }
        }));
    }

    // Generic recommendations
    recs.push(new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: 'Apply for HSIP funding for evidence-based countermeasures at high-priority locations.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
        spacing: { after: 100 }
    }));

    recs.push(new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: 'Continue monitoring crash trends and evaluate effectiveness of implemented safety improvements.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
        spacing: { after: 100 }
    }));

    return recs;
}

/**
 * Generate safety-specific recommendations
 */
function generateSafetyMemoRecommendations(stats, severeCrashes, byType, byLight) {
    const { Paragraph, TextRun } = docx;
    const recs = [];

    // Based on severe crash patterns
    const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
    if (topType) {
        const typeLower = topType[0].toLowerCase();
        if (typeLower.includes('angle') || typeLower.includes('broadside')) {
            recs.push(new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: 'Prioritize intersection safety improvements including signal timing optimization, protected left-turn phases, and sight distance improvements.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
                spacing: { after: 100 }
            }));
        }
        if (typeLower.includes('rear') || typeLower.includes('end')) {
            recs.push(new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: 'Consider implementing queue warning systems, improving signal coordination, and extending turn lanes.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
                spacing: { after: 100 }
            }));
        }
        if (typeLower.includes('head') || typeLower.includes('run off')) {
            recs.push(new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: 'Install centerline rumble strips, widen shoulders, and implement systemic curve safety improvements.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
                spacing: { after: 100 }
            }));
        }
    }

    // Dark conditions
    const darkCrashes = Object.entries(byLight).filter(([k]) => k.toLowerCase().includes('dark')).reduce((s, e) => s + e[1], 0);
    if (darkCrashes > severeCrashes.length * 0.25) {
        recs.push(new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: `${((darkCrashes / severeCrashes.length) * 100).toFixed(0)}% of severe crashes occurred in dark conditions. Recommend lighting improvements and enhanced nighttime visibility measures.`, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 100 }
        }));
    }

    recs.push(new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: 'Apply for Highway Safety Improvement Program (HSIP) funding for systemic safety improvements targeting fatal and serious injury crashes.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
        spacing: { after: 100 }
    }));

    return recs;
}

/**
 * Generate VRU-specific recommendations
 */
function generateVRURecommendations(pedStats, bikeStats) {
    const { Paragraph, TextRun } = docx;
    const recs = [];

    if (pedStats.total > 0) {
        recs.push(new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'Install Rectangular Rapid Flashing Beacons (RRFBs) at uncontrolled pedestrian crossings.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 100 }
        }));
        recs.push(new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'Implement Leading Pedestrian Intervals (LPIs) at signalized intersections with high pedestrian activity.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 100 }
        }));
    }

    if (bikeStats.total > 0) {
        recs.push(new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'Install protected bicycle lanes or buffered bike lanes on high-crash corridors.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 100 }
        }));
        recs.push(new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'Consider bike boxes and green bike lane markings at signalized intersections.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 100 }
        }));
    }

    recs.push(new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: 'Conduct Complete Streets assessments to improve multimodal safety accommodations.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
        spacing: { after: 100 }
    }));

    return recs;
}

/**
 * Generate trend analysis paragraphs
 */
function generateTrendAnalysis(byYear, years) {
    const { Paragraph, TextRun } = docx;
    const paragraphs = [];

    if (years.length < 2) {
        paragraphs.push(new Paragraph({
            children: [new TextRun({ text: 'Insufficient data for trend analysis. At least two years of data are required.', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 100 }
        }));
        return paragraphs;
    }

    const firstYear = byYear[years[0]];
    const lastYear = byYear[years[years.length - 1]];

    // Overall trend
    const totalChange = ((lastYear.total - firstYear.total) / firstYear.total * 100).toFixed(1);
    paragraphs.push(new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: `Total crashes ${totalChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(totalChange)}% from ${years[0]} to ${years[years.length - 1]}.`, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
        spacing: { after: 100 }
    }));

    // Severe crash trend
    const firstKA = firstYear.K + firstYear.A;
    const lastKA = lastYear.K + lastYear.A;
    if (firstKA > 0) {
        const kaChange = ((lastKA - firstKA) / firstKA * 100).toFixed(1);
        paragraphs.push(new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: `K+A (fatal + serious injury) crashes ${kaChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(kaChange)}%.`, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 100 }
        }));
    }

    // Find peak year
    const peakYear = years.reduce((max, y) => byYear[y].total > byYear[max].total ? y : max, years[0]);
    paragraphs.push(new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: `Peak crash year: ${peakYear} with ${byYear[peakYear].total.toLocaleString()} crashes.`, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
        spacing: { after: 100 }
    }));

    return paragraphs;
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.recommend = CL.reports.recommend || {};
  window.buildCollisionTypeBreakdown = buildCollisionTypeBreakdown; CL.reports.recommend.buildCollisionTypeBreakdown = buildCollisionTypeBreakdown;
  window.buildSevereCrashPatterns = buildSevereCrashPatterns; CL.reports.recommend.buildSevereCrashPatterns = buildSevereCrashPatterns;
  window.generateMemoRecommendations = generateMemoRecommendations; CL.reports.recommend.generateMemoRecommendations = generateMemoRecommendations;
  window.generateSafetyMemoRecommendations = generateSafetyMemoRecommendations; CL.reports.recommend.generateSafetyMemoRecommendations = generateSafetyMemoRecommendations;
  window.generateVRURecommendations = generateVRURecommendations; CL.reports.recommend.generateVRURecommendations = generateVRURecommendations;
  window.generateTrendAnalysis = generateTrendAnalysis; CL.reports.recommend.generateTrendAnalysis = generateTrendAnalysis;
  CL._registerModule('reports/reports-recommend');
})();
