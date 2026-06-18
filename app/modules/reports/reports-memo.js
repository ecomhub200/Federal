/**
 * CL reports.memo — Word-memo paragraph builders (header/stats/findings/
 * locations/footer) + createWordDocumentWithHeaderFooter. Extracted verbatim
 * from app/index.html (prompt 42d-b). NO behavior change. The 4 generate*WordMemo
 * orchestrators stay inline and call these via the window mirror; MEMO_STYLES
 * stays inline (shared global, read by other modules via global scope).
 * Dual-exposed window.<fn> + CL.reports.memo.<fn>. Depends: docx, MEMO_STYLES.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
/**
 * Build standard memo header paragraphs
 */
function buildMemoHeader(subject, author) {
    const { Paragraph, TextRun, BorderStyle, AlignmentType } = docx;

    return [
        // MEMORANDUM title
        new Paragraph({
            children: [new TextRun({ text: 'MEMORANDUM', bold: true, size: 36, font: MEMO_STYLES.fontFamily })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
        }),
        // TO
        new Paragraph({
            children: [
                new TextRun({ text: 'TO:\t\t', bold: true, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily }),
                new TextRun({ text: 'Project File', size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })
            ],
            spacing: { after: 100 }
        }),
        // FROM
        new Paragraph({
            children: [
                new TextRun({ text: 'FROM:\t\t', bold: true, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily }),
                new TextRun({ text: author, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })
            ],
            spacing: { after: 100 }
        }),
        // DATE
        new Paragraph({
            children: [
                new TextRun({ text: 'DATE:\t\t', bold: true, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily }),
                new TextRun({ text: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })
            ],
            spacing: { after: 100 }
        }),
        // SUBJECT
        new Paragraph({
            children: [
                new TextRun({ text: 'SUBJECT:\t', bold: true, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily }),
                new TextRun({ text: subject, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })
            ],
            spacing: { after: 200 }
        }),
        // Horizontal line
        new Paragraph({
            border: { bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 } },
            spacing: { after: 300 }
        })
    ];
}

/**
 * Build statistics table for memo
 */
function buildMemoStatsTable(stats) {
    const { Table, TableRow, TableCell, Paragraph, TextRun, WidthType, AlignmentType, BorderStyle, ShadingType } = docx;

    const cellBorders = {
        top: { style: BorderStyle.SINGLE, size: 1, color: MEMO_STYLES.borderColor },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: MEMO_STYLES.borderColor },
        left: { style: BorderStyle.SINGLE, size: 1, color: MEMO_STYLES.borderColor },
        right: { style: BorderStyle.SINGLE, size: 1, color: MEMO_STYLES.borderColor }
    };

    const headerShading = { fill: MEMO_STYLES.headerColor, type: ShadingType.CLEAR };

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            // Header row
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 17, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Total', bold: true, size: 20, color: 'FFFFFF', font: MEMO_STYLES.fontFamily })] })] }),
                    new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 17, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Fatal (K)', bold: true, size: 20, color: 'FFFFFF', font: MEMO_STYLES.fontFamily })] })] }),
                    new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 17, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Serious (A)', bold: true, size: 20, color: 'FFFFFF', font: MEMO_STYLES.fontFamily })] })] }),
                    new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 17, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Injury (BC)', bold: true, size: 20, color: 'FFFFFF', font: MEMO_STYLES.fontFamily })] })] }),
                    new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 17, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'PDO (O)', bold: true, size: 20, color: 'FFFFFF', font: MEMO_STYLES.fontFamily })] })] }),
                    new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 15, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'EPDO', bold: true, size: 20, color: 'FFFFFF', font: MEMO_STYLES.fontFamily })] })] })
                ]
            }),
            // Data row
            new TableRow({
                children: [
                    new TableCell({ borders: cellBorders, shading: { fill: MEMO_STYLES.shadingColor, type: ShadingType.CLEAR },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: stats.total.toLocaleString(), bold: true, size: 24, font: MEMO_STYLES.fontFamily })] })] }),
                    new TableCell({ borders: cellBorders, shading: { fill: 'FEE2E2', type: ShadingType.CLEAR },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(stats.K), bold: true, size: 24, color: MEMO_STYLES.dangerColor, font: MEMO_STYLES.fontFamily })] })] }),
                    new TableCell({ borders: cellBorders, shading: { fill: 'FEF3C7', type: ShadingType.CLEAR },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(stats.A), bold: true, size: 24, color: 'B45309', font: MEMO_STYLES.fontFamily })] })] }),
                    new TableCell({ borders: cellBorders, shading: { fill: MEMO_STYLES.shadingColor, type: ShadingType.CLEAR },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(stats.B + stats.C), bold: true, size: 24, font: MEMO_STYLES.fontFamily })] })] }),
                    new TableCell({ borders: cellBorders, shading: { fill: MEMO_STYLES.shadingColor, type: ShadingType.CLEAR },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: stats.O.toLocaleString(), bold: true, size: 24, font: MEMO_STYLES.fontFamily })] })] }),
                    new TableCell({ borders: cellBorders, shading: { fill: 'EDE9FE', type: ShadingType.CLEAR },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: calcEPDO(stats).toLocaleString(), bold: true, size: 24, color: '7C3AED', font: MEMO_STYLES.fontFamily })] })] })
                ]
            })
        ]
    });
}

/**
 * Build findings section as bullet points
 */
function buildMemoFindings(findings) {
    const { Paragraph, TextRun } = docx;

    return findings.slice(0, 8).map(f => new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: f.text, size: MEMO_STYLES.bodySize, font: MEMO_STYLES.fontFamily })],
        spacing: { after: 100 }
    }));
}

/**
 * Build top locations table
 */
function buildMemoLocationsTable(crashes, limit = 10) {
    const { Table, TableRow, TableCell, Paragraph, TextRun, WidthType, AlignmentType, BorderStyle, ShadingType } = docx;

    // Aggregate by route
    const byRoute = {};
    crashes.forEach(c => {
        const route = c[COL.ROUTE] || 'Unknown';
        if (!byRoute[route]) byRoute[route] = { name: route, total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        byRoute[route].total++;
        const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        if (byRoute[route][sev] !== undefined) byRoute[route][sev]++;
    });

    const sorted = Object.values(byRoute)
        .map(r => ({ ...r, epdo: calcEPDO(r) }))
        .sort((a, b) => b.epdo - a.epdo)
        .slice(0, limit);

    const cellBorders = {
        top: { style: BorderStyle.SINGLE, size: 1, color: MEMO_STYLES.borderColor },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: MEMO_STYLES.borderColor },
        left: { style: BorderStyle.SINGLE, size: 1, color: MEMO_STYLES.borderColor },
        right: { style: BorderStyle.SINGLE, size: 1, color: MEMO_STYLES.borderColor }
    };

    const headerShading = { fill: MEMO_STYLES.headerColor, type: ShadingType.CLEAR };

    const rows = [
        new TableRow({
            tableHeader: true,
            children: [
                new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 10, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Rank', bold: true, size: 18, color: 'FFFFFF', font: MEMO_STYLES.fontFamily })] })] }),
                new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 40, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Location', bold: true, size: 18, color: 'FFFFFF', font: MEMO_STYLES.fontFamily })] })] }),
                new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 15, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Total', bold: true, size: 18, color: 'FFFFFF', font: MEMO_STYLES.fontFamily })] })] }),
                new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 15, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'K+A', bold: true, size: 18, color: 'FFFFFF', font: MEMO_STYLES.fontFamily })] })] }),
                new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 20, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'EPDO', bold: true, size: 18, color: 'FFFFFF', font: MEMO_STYLES.fontFamily })] })] })
            ]
        })
    ];

    sorted.forEach((loc, idx) => {
        const rowShading = idx % 2 === 0 ? { fill: 'FFFFFF', type: ShadingType.CLEAR } : { fill: MEMO_STYLES.shadingColor, type: ShadingType.CLEAR };
        rows.push(new TableRow({
            children: [
                new TableCell({ borders: cellBorders, shading: rowShading,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), size: 20, font: MEMO_STYLES.fontFamily })] })] }),
                new TableCell({ borders: cellBorders, shading: rowShading,
                    children: [new Paragraph({ children: [new TextRun({ text: loc.name, size: 20, font: MEMO_STYLES.fontFamily })] })] }),
                new TableCell({ borders: cellBorders, shading: rowShading,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(loc.total), size: 20, font: MEMO_STYLES.fontFamily })] })] }),
                new TableCell({ borders: cellBorders, shading: rowShading,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(loc.K + loc.A), size: 20, color: loc.K + loc.A > 0 ? MEMO_STYLES.dangerColor : '000000', font: MEMO_STYLES.fontFamily })] })] }),
                new TableCell({ borders: cellBorders, shading: rowShading,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: loc.epdo.toLocaleString(), bold: true, size: 20, font: MEMO_STYLES.fontFamily })] })] })
            ]
        }));
    });

    return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rows });
}

/**
 * Build memo footer
 */
function buildMemoFooter() {
    const { Paragraph, TextRun, BorderStyle, AlignmentType } = docx;

    return [
        new Paragraph({
            border: { top: { color: 'CBD5E1', space: 1, style: BorderStyle.SINGLE, size: 6 } },
            spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({ text: 'CRASH LENS', bold: true, size: 20, color: '1E3A5F', font: MEMO_STYLES.fontFamily }),
                new TextRun({ text: ' | Crash Analysis Tool', size: 18, color: '64748B', font: MEMO_STYLES.fontFamily })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Data Source: ' + getDataSourceLabel(), size: 16, color: '94A3B8', font: MEMO_STYLES.fontFamily })]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `Generated: ${getFullTimestamp()}`, size: 16, color: '94A3B8', font: MEMO_STYLES.fontFamily })],
            spacing: { after: 100 }
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'This report contains analysis for planning purposes. The user is responsible for final decisions.', italics: true, size: 14, color: 'B0B8C4', font: MEMO_STYLES.fontFamily })]
        })
    ];
}

/**
 * Create document header and footer for Word export
 */
function createWordDocumentWithHeaderFooter(children, title) {
    const { Document, Paragraph, TextRun, Header, Footer, PageNumber, NumberFormat, AlignmentType, BorderStyle, Tab, TabStopType, TabStopPosition } = docx;

    // Create header
    const header = new Header({
        children: [
            new Paragraph({
                children: [
                    new TextRun({ text: 'CRASH LENS', bold: true, size: 16, color: '1E3A5F', font: MEMO_STYLES.fontFamily }),
                    new TextRun({ text: ' | ', size: 16, color: 'CBD5E1', font: MEMO_STYLES.fontFamily }),
                    new TextRun({ text: title || 'Crash Analysis Report', size: 16, color: '64748B', font: MEMO_STYLES.fontFamily })
                ],
                border: { bottom: { color: 'CBD5E1', style: BorderStyle.SINGLE, size: 6, space: 1 } },
                spacing: { after: 100 }
            })
        ]
    });

    // CC 324 BUG B (Word export sibling) — state-aware data-source citation
    // mirrors the HTML footer accessor at
    // app/modules/reports/reports-standard-types.js:617-628 so the .docx
    // footer reads "Data: Delaware DMV" / "Data: Colorado DMV" / etc.
    // instead of a Virginia literal. State-agnostic.
    const _wordFooterStateRaw = (window.crashLensClient && window.crashLensClient.state) || '';
    const wordFooterDataSource = _wordFooterStateRaw
        ? _wordFooterStateRaw.charAt(0).toUpperCase() + _wordFooterStateRaw.slice(1).toLowerCase()
        : 'State';

    // Create footer with page numbers
    const footer = new Footer({
        children: [
            new Paragraph({
                border: { top: { color: 'E2E8F0', style: BorderStyle.SINGLE, size: 4, space: 1 } },
                spacing: { before: 100 },
                tabStops: [
                    { type: TabStopType.CENTER, position: TabStopPosition.MAX / 2 },
                    { type: TabStopType.RIGHT, position: TabStopPosition.MAX }
                ],
                children: [
                    new TextRun({ text: 'Crash Analysis Tool', size: 14, color: '94A3B8', font: MEMO_STYLES.fontFamily }),
                    new TextRun({ children: [new Tab()] }),
                    new TextRun({ text: `Data: ${wordFooterDataSource} DMV`, size: 14, color: '94A3B8', font: MEMO_STYLES.fontFamily }),
                    new TextRun({ children: [new Tab()] }),
                    new TextRun({ text: 'Page ', size: 14, color: '64748B', font: MEMO_STYLES.fontFamily }),
                    new TextRun({ children: [PageNumber.CURRENT], size: 14, color: '64748B', font: MEMO_STYLES.fontFamily }),
                    new TextRun({ text: ' of ', size: 14, color: '64748B', font: MEMO_STYLES.fontFamily }),
                    new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: '64748B', font: MEMO_STYLES.fontFamily })
                ]
            })
        ]
    });

    return new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 1440, // 1 inch
                        right: 1440,
                        bottom: 1440,
                        left: 1440
                    }
                }
            },
            headers: { default: header },
            footers: { default: footer },
            children: children
        }]
    });
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.memo = CL.reports.memo || {};
  window.buildMemoHeader = buildMemoHeader; CL.reports.memo.buildMemoHeader = buildMemoHeader;
  window.buildMemoStatsTable = buildMemoStatsTable; CL.reports.memo.buildMemoStatsTable = buildMemoStatsTable;
  window.buildMemoFindings = buildMemoFindings; CL.reports.memo.buildMemoFindings = buildMemoFindings;
  window.buildMemoLocationsTable = buildMemoLocationsTable; CL.reports.memo.buildMemoLocationsTable = buildMemoLocationsTable;
  window.buildMemoFooter = buildMemoFooter; CL.reports.memo.buildMemoFooter = buildMemoFooter;
  window.createWordDocumentWithHeaderFooter = createWordDocumentWithHeaderFooter; CL.reports.memo.createWordDocumentWithHeaderFooter = createWordDocumentWithHeaderFooter;
  CL._registerModule('reports/reports-memo');
})();
