import { Page } from '@playwright/test';

/**
 * Scan the currently-active tab for empty matrices.
 *
 * Returns:
 *   {
 *     tabId: 'fatalspeeding',
 *     emptyCanvases: ['chartFSFatalCollision', 'chartFSFatalYear', ...],
 *     zeroKpis:      ['fsFatalCount', 'fsFatalKA', ...],
 *     zeroRowTables: ['fsCrossAnalysisTable', ...],
 *     scrollH: 2394,
 *   }
 *
 * Runs entirely client-side (page.evaluate) — same probe used during the
 * manual audits. Drop-in replacement.
 */
export interface TabScan {
    tabId: string;
    scrollH: number;
    canvasCount: number;
    emptyCanvases: string[];
    zeroKpis: string[];
    zeroRowTables: string[];
    populatedTables: { id: string; rows: number }[];
}

export async function scanActiveTab(page: Page): Promise<TabScan> {
    return await page.evaluate(() => {
        const t = (document.querySelector('.tab-content.active') as HTMLElement) ?? document.body;
        const tabId = t.id?.replace(/^tab-/, '') ?? 'unknown';

        // 1. Empty Chart.js canvases — toDataURL is too small if blank
        const canvases = Array.from(t.querySelectorAll('canvas')) as HTMLCanvasElement[];
        const emptyCanvases: string[] = [];
        for (const c of canvases) {
            try {
                const url = c.toDataURL('image/png');
                if (!url || url.length < 5000) emptyCanvases.push(c.id || '(no-id)');
            } catch { /* canvas may be tainted; skip */ }
        }

        // 2. KPI elements that read 0/—/empty
        const zeroKpis: string[] = [];
        const kpiEls = Array.from(t.querySelectorAll<HTMLElement>(
            '.kpi-card, [class*="kpi-stat"], [class*="kpi-tile"], [class*="kpi-value"]'
        ));
        for (const el of kpiEls) {
            const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
            // KPI is suspicious if its first numeric token is 0 / — / -- / empty
            const m = txt.match(/^([0-9.,—\-]+)\b/);
            if (m && (m[1] === '0' || m[1] === '0.0' || m[1] === '—' || m[1] === '--' || m[1] === '-')) {
                if (el.id) zeroKpis.push(el.id);
            }
        }

        // 3. Tables with 0 rows
        const tables = Array.from(t.querySelectorAll('table')) as HTMLTableElement[];
        const zeroRowTables: string[] = [];
        const populatedTables: { id: string; rows: number }[] = [];
        for (const tb of tables) {
            const rows = tb.querySelectorAll('tbody tr').length;
            const id = tb.id || '(no-id)';
            if (rows === 0) zeroRowTables.push(id);
            else            populatedTables.push({ id, rows });
        }

        return {
            tabId,
            scrollH: t.scrollHeight,
            canvasCount: canvases.length,
            emptyCanvases,
            zeroKpis,
            zeroRowTables,
            populatedTables,
        };
    });
}

/**
 * Probe the live state context (tier, jurisdiction, road-type filter).
 * Useful for asserting "the test setup actually selected what we asked for".
 */
export interface StateProbe {
    state: string | null;
    tier: string | null;
    jurisdiction: string | null;
    sampleRowsLen: number;
    csTotalRows: number;
    bridgeTotal: number | null;
}

export async function probeState(page: Page): Promise<StateProbe> {
    return await page.evaluate(() => {
        const w = window as any;
        const cl = w.crashLensClient;
        const cs = w.crashState;
        const ctx = w.jurisdictionContext;
        let bridgeTotal: number | null = null;
        try {
            bridgeTotal = w.CL?.data?.mapBridge?.getViewportTotal?.() ?? null;
        } catch { /* ok */ }
        return {
            state:         cl?.state ?? null,
            tier:          ctx?.viewTier ?? null,
            jurisdiction:  ctx?.jurisdictionName ?? null,
            sampleRowsLen: (cs?.sampleRows ?? []).length,
            csTotalRows:   cs?.totalRows ?? 0,
            bridgeTotal,
        };
    });
}

/**
 * Top-level KPI on the Dashboard. Fires after the Supabase bridge resolves.
 * Returns the integer (e.g. 134123) or null if not present.
 */
export async function readDashboardKpi(page: Page, elementId: string): Promise<number | null> {
    const txt = await page.locator(`#${elementId}`).textContent().catch(() => null);
    if (!txt) return null;
    const m = txt.replace(/[, ]/g, '').match(/-?\d+/);
    return m ? Number(m[0]) : null;
}
