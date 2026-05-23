/** CL pedbike.memo — extracted (name-anchored) 2026-05-23.
 *  see queue/203-passb-pedbike.md. No behavior change.
 *  Reads inline shared crashState (global classic-script env). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
/**
 * Generate Pedestrian/Bicycle Word Memo
 */
async function generatePedBikeWordMemo(title, author, startDate, endDate) {
    const { Document, Paragraph, TextRun, HeadingLevel } = docx;

    let crashes = crashState.sampleRows.slice();
    if (startDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) >= new Date(startDate));
    if (endDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) <= new Date(endDate));

    const pedCrashes = crashes.filter(c => isYes(c[COL.PED]));
    const bikeCrashes = crashes.filter(c => isYes(c[COL.BIKE]));
    const pedStats = computeStats(pedCrashes);
    const bikeStats = computeStats(bikeCrashes);
    // Prefer the Reports tab's user-selected timeline (reportStartDate /
    // reportEndDate) so the rendered HTML preview and the Word memo both
    // show the same period the user asked for. Fall back to the crash
    // min/max when no filter is set (legacy behavior).
    const yearRange = (document.getElementById('reportStartDate')?.value || document.getElementById('reportEndDate')?.value)
        ? resolveReportPeriod('reportStartDate', 'reportEndDate')
        : getDateRange(crashes);

    const children = [
        ...buildMemoHeader(`Vulnerable Road User Analysis - ${getJurisdictionLabel()}`, author),

        // PURPOSE
        new Paragraph({ text: 'PURPOSE', heading: HeadingLevel.HEADING_1, spacing: { after: 200 } }),
        new Paragraph({
            children: [new TextRun({ text: `This memorandum analyzes pedestrian and bicycle crashes in ${getJurisdictionLabel()} for the period ${yearRange}. Vulnerable road users face elevated risk of severe injury, making this analysis critical for safety planning.`, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 300 }
        }),

        // PEDESTRIAN CRASHES
        new Paragraph({ text: 'PEDESTRIAN CRASH ANALYSIS', heading: HeadingLevel.HEADING_1, spacing: { after: 200 } }),
        new Paragraph({
            children: [
                new TextRun({ text: `Total Pedestrian Crashes: `, bold: true, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily }),
                new TextRun({ text: `${pedStats.total}`, size: 28, bold: true, color: '0891B2', font: MEMO_STYLES.fontFamily })
            ],
            spacing: { after: 100 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: `Fatal: ${pedStats.K}  |  Serious Injury: ${pedStats.A}  |  K+A Rate: ${pedStats.total > 0 ? ((pedStats.K + pedStats.A) / pedStats.total * 100).toFixed(1) : 0}%`, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })
            ],
            spacing: { after: 100 }
        }),
        new Paragraph({
            children: [new TextRun({ text: `EPDO Score: ${calcEPDO(pedStats).toLocaleString()}`, bold: true, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 300 }
        }),

        // BICYCLE CRASHES
        new Paragraph({ text: 'BICYCLE CRASH ANALYSIS', heading: HeadingLevel.HEADING_1, spacing: { after: 200 } }),
        new Paragraph({
            children: [
                new TextRun({ text: `Total Bicycle Crashes: `, bold: true, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily }),
                new TextRun({ text: `${bikeStats.total}`, size: 28, bold: true, color: MEMO_STYLES.successColor, font: MEMO_STYLES.fontFamily })
            ],
            spacing: { after: 100 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: `Fatal: ${bikeStats.K}  |  Serious Injury: ${bikeStats.A}  |  K+A Rate: ${bikeStats.total > 0 ? ((bikeStats.K + bikeStats.A) / bikeStats.total * 100).toFixed(1) : 0}%`, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })
            ],
            spacing: { after: 100 }
        }),
        new Paragraph({
            children: [new TextRun({ text: `EPDO Score: ${calcEPDO(bikeStats).toLocaleString()}`, bold: true, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
            spacing: { after: 300 }
        }),

        // VRU RECOMMENDATIONS
        new Paragraph({ text: 'VRU SAFETY RECOMMENDATIONS', heading: HeadingLevel.HEADING_1, spacing: { after: 200 } }),
        ...generateVRURecommendations(pedStats, bikeStats),

        ...buildMemoFooter()
    ];

    // Use enhanced document with header/footer and page numbers
    const doc = createWordDocumentWithHeaderFooter(children, 'Vulnerable Road User Analysis');

    const blob = await docx.Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `VRU_Memo_${getJurisdictionLabel().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
    link.click();
    URL.revokeObjectURL(link.href);
}
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.pedbike=CL.pedbike||{};
  CL.pedbike.memo=CL.pedbike.memo||{};
  window.generatePedBikeWordMemo=generatePedBikeWordMemo; CL.pedbike.memo.generatePedBikeWordMemo=generatePedBikeWordMemo;
  CL._registerModule('pedbike/pedbike-tab-memo');
})();
