---
title: "Speed Co-Factor denominator bug — impossible 10,000%+ percentages in Fatal/Speed PDF"
aliases: [speed-cofactor-bug, fatalspeed-pdf-bug, cofactor-percentage-bug]
tags: [reports, fatalspeeding, matview, bug, round8, pdf]
sources:
  - "daily/2026-05-09.md"
created: 2026-05-09
updated: 2026-05-09
---

# Speed Co-Factor denominator bug

## The Bug

The Speed Co-Factor table in the Fatal/Speed PDF (`exportFSToPDF()`) produced impossible percentages — values like **Intersection: 10,116.8%** — whenever the user was at an aggregate tier where `crashState.sampleRows` was empty.

## Key Points

- **Root cause:** the factor count (`data.count`) came from the **global** `mv_safety_categories` matview for the entire jurisdiction, while the denominator was `sd.totalCrashes` — the crash count for a single route pulled from `sampleRows`. At aggregate tiers `sampleRows` is empty so `totalCrashes` defaulted to 0 or a very small number, making the percentage explode.
- **Concrete example:** Intersection factor count = 132,125 (jurisdiction-wide from matview) ÷ 1,306 (route total from sampleRows) = 10,116.8%.
- **Fix:** switch the denominator to **all crashes in the dataset** (total jurisdiction crashes), so the percentage correctly means "share of all crashes that have this factor."
- The column was also renamed from **"% of Speed"** to **"% of All"** to clarify the denominator semantics.
- Values are now **clamped to ≤ 100%** as a defensive guard.

## Details

### Why the mismatch existed

`mv_safety_categories` stores factor counts at the jurisdiction level (e.g., Delaware/Sussex: 132,125 crashes involved an intersection). These counts are correct for the jurisdiction. The Fatal/Speed PDF's co-factor table intended to show "of the speed-related crashes in this corridor, what fraction also had factor X?" — a per-route cross-tab that requires row-level data.

At county-leaf tiers where `sampleRows` is populated, the table was computing route-level statistics and dividing by the route crash count — a reasonable (if not perfectly labeled) operation. At aggregate tiers `totalCrashes` was 0 (or whatever the first route's row-count summed to), turning the global matview numerator into a runaway ratio.

### The fix in `exportFSToPDF()`

1. `exportFSToPDF()` was converted to `async` to allow `await getCrashes(...)` for on-demand hydration.
2. When sampleRows is empty AND `fatalSpeedingState.{fatal,speed}Data.byRoute` are empty, the function fetches row-level crashes from Supabase and locally aggregates K-only and speed-only `byRoute`/`byYear`/`byHour` distributions (which no existing matview exposes per-severity).
3. **`totalCrashes`** falls back through a chain: `fatalSpeedingState.totalFilteredCrashes` (matview K+A+B+C+O sum) → 0. The cover page "Total Crashes in Dataset" and executive-summary percentages now show real values instead of 0.
4. The co-factor denominator is set to `totalCrashes` (jurisdiction total), the column renamed to "% of All", and the result clamped: `Math.min(100, (count / totalCrashes) * 100).toFixed(1)`.

### Remaining gap

A true cross-tab — "of speed-related crashes, what fraction also involved factor X?" — requires a backend `mv_factor_pairs` matview that stores co-occurrence counts. Round 8's fix changes the semantics to "share of all crashes" which is directionally correct and non-impossible, but is not the original intent of the column. This is noted as future backend work.

## Related Concepts

- [[concepts/aggregate-tier-samplerows-empty]] — The precondition: `sampleRows` is empty at aggregate tiers, which makes route-level denominators collapse to near-zero
- [[concepts/report-generator-supabase-hydration]] — The broader on-demand hydration pattern of which `exportFSToPDF()` is a variant
- [[concepts/intersection-pdf-export-patches]] — Sister fix in the same Round 8 branch for `exportIntersectionPDF()`

## Sources

- [[daily/2026-05-09.md]] — Round 8 description of the bug (Intersection 132,125 / 1,306 = 10,116.8% concrete example), the denominator fix, column rename, and clamp; `exportFSToPDF()` async conversion and hydration steps
