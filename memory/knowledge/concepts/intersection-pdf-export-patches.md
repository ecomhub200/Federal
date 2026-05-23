---
title: "Intersection PDF export patches — year-range fallback, K-segment fix, chart force-paint"
aliases: [intersection-pdf-fixes, exportIntersectionPDF, intersection-pdf-round8]
tags: [reports, intersection, pdf, charts, round8, chartjs]
sources:
  - "daily/2026-05-09.md"
created: 2026-05-09
updated: 2026-05-09
---

# Intersection PDF export patches (Round 8)

## Context

`exportIntersectionPDF()` in `app/index.html` generates a PDF report for intersection crash analysis. Three independent bugs produced broken output at aggregate tiers (where `crashState.sampleRows` is empty): a missing year-range, an invisible K severity bar segment, and blank Chart.js canvases.

## Key Points

- **Year-range "N/A"** on the cover page: added a four-level fallback chain so the period never reads "N/A".
- **K-segment invisible**: the minimum visible bar width was raised from 2mm → 4mm, and a colored callout annotation is pinned above the bar when the segment is too narrow for an inline label.
- **Blank charts**: a force-paint pass before `toDataURL()` ensures Chart.js has rendered before the canvas is captured; if the Intersections tab was never opened, `updateIntersectionTab()` is called to initialize the charts.
- All three fixes are in `exportIntersectionPDF()` in `app/index.html` — no new files.

## Details

### Fix 1 — Year-range cascading fallback

The cover page previously showed "Period: N/A" whenever `crashState.years` was undefined (which is always true at aggregate tiers). Round 8 adds a cascading fallback:

```
crashState.years
  → aggregates.yearRange.{min,max}
  → Object.keys(aggregates.byYear) min/max
  → "N/A"
```

Each level is tried in order; the first that yields a real value wins. In practice `aggregates.yearRange` is populated from the matview `mv_dashboard_summary` at aggregate tiers, so the second level resolves correctly.

### Fix 2 — K-segment minimum width and callout

The intersection severity bar is drawn as a stacked horizontal bar (K/A/B/C/O segments). A fatal count of 253 out of 77,715 total crashes is ≈0.3%, which at typical bar width maps to ≈0.6mm — below the minimum rendering threshold for most PDF engines, causing the red K segment to silently disappear.

Two changes:
1. **Minimum width floor**: any non-zero K segment is rendered at least 4mm wide (up from 2mm).
2. **Callout annotation**: when the K segment can't fit an inline numeric label (segment < label width), a small colored callout (arrow + "Fatal: N (X%)") is pinned above the bar. The legend already showed the fatal count correctly; the fix makes it visible in the bar itself.

### Fix 3 — Chart force-paint before canvas capture

`exportIntersectionPDF()` calls `canvas.toDataURL()` to embed four Chart.js charts (Type / Traffic Control / Collision / Year Trend). If the user generated the PDF without first clicking the Intersections tab, the Chart.js instances have never been initialized and the canvases are blank.

Fix: before calling `toDataURL()`, check whether `chartIntType` (the intersection-type Chart.js instance) is initialized. If not:
1. Call `updateIntersectionTab()` to trigger the full tab initialization.
2. If that's unavailable, fall back to `_loadIntersectionsFromHotspots()`.
3. Wait 250–500ms for Chart.js to complete its animation cycle before capturing.

The 250–500ms sleep is intentional — Chart.js `animation.onComplete` callbacks are not reliably awaitable in the current codebase without refactoring the chart configuration.

## Related Concepts

- [[concepts/aggregate-tier-samplerows-empty]] — Root precondition: `sampleRows` is empty, metadata like `crashState.years` undefined, and tabs potentially uninitialized at aggregate tiers
- [[concepts/report-generator-supabase-hydration]] — Universal hydration pattern; `exportIntersectionPDF()` uses a similar on-demand fetch for row data
- [[concepts/speed-cofactor-denominator-bug]] — Sister fix in `exportFSToPDF()` in the same Round 8 branch; same root cause (aggregate tier + empty sampleRows)

## Sources

- [[daily/2026-05-09.md]] — Round 8 description of all three `exportIntersectionPDF()` fixes: year-range cascading fallback, 2mm→4mm K-segment minimum + callout, chart force-paint with 250–500ms settle wait
