# MODULAR_PLAN — 42b family pre-flight (Reports Standard band)

**Prepared:** 2026-05-17 (CC Session H). **Documentation only — nothing
extracted.** Source of truth: live `app/index.html` @ **149,314 lines**.

This document is the **authoritative correction layer** for the existing
(unmodified) `modular-prompts/42b1-reports-standard-core.md`,
`42b2-reports-pdf.md`, `42b3-reports-charts.md`. A future Session J **MUST read
this doc alongside each 42b prompt** and apply the §0 overrides below before any
extraction. The 42b prompt files themselves are byte-unmodified (hard
constraint); this doc supersedes their stale band model.

---

## 1. Status

`modular-prompts/42b-reports-standard.md` (parent index) +
`42b1-reports-standard-core.md` + `42b2-reports-pdf.md` +
`42b3-reports-charts.md` **all already exist**. Step 1.1 of the Session-H task
("if sub-prompts missing, write them") is **not applicable** — they are
present and were *not* rewritten. Part 1 = anchor verification + discrepancy
documentation only.

`app/modules/reports/` does **not** exist yet → all four target module files are
free (no target-exists ABORT).

---

## 2. Live anchor verification (every anchor = exactly 1 declaration match)

Re-derived against the live 149,314-line `app/index.html` on 2026-05-17. The
parent index assumed band L68281–L70781; the live band is **L64510–L68090**
(drift ≈ −3,771 to −2,691). **Range-based locating is dead — re-derive by NAME
+ brace read at §0.**

### 2.1 — 42b1 core → `app/modules/reports/reports-standard-core.js`

| Anchor | Live L | Matches |
|---|---|---|
| `showReportSubTab` | 64510 | 1 |
| `updateReportOptions` | 64533 | 1 |
| `buildAIContext` | 64639 | 1 |
| `_safeAgg` | 64702 | 1 |
| `generateReport` | 64870 | 1 |
| `generateSystemwideReport` | 65107 | 1 |
| `_legacySystemwideReport` | 65112 | 1 |
| `computeSystemwideCategoryData` | 65207 | 1 |
| `generateExplorationDashboard` | 65295 | 1 |
| `getTopLocation` | 65371 | 1 |
| `truncateRoute` | 65381 | 1 |
| `generateCategoryTopLocations` | 65391 | 1 |
| `generateEnhancedFindings` | 65446 | 1 |
| `generateEnhancedRecommendations` | 65524 | 1 |

**Unlisted band-internal helpers** (NOT in the prompt's anchor list but inside
the contiguous band — carried verbatim by the [start,end] cut; count them in
the post-flight moved-fn delta): `hydrateReportFromMatviews` **L64732**,
`fetchReportDataForType` **L64801**.

Core band ≈ **L64510 – L65612 (~1,103 LOC)**. >500 → the prompt's existing
"cut at `generateExplorationDashboard` (L65295) → `-core` + `-core2`"
instruction is correct.

### 2.2 — 42b1 types → `app/modules/reports/reports-standard-types.js`

| Anchor | Live L | | Anchor | Live L |
|---|---|---|---|---|
| `generateCorridorReport` | 65613 | | `showExecutiveSummary` | 66368 |
| `generateSafetyReport` | 65680 | | `computeStats` | 66379 |
| `generatePedBikeReport` | 65764 | | `validateReportData` | 66426 |
| `createEnhancedPedBikeCharts` | 65930 | | `getDateRange` | 66449 |
| `generateTrendReport` | 65980 | | `resolveReportPeriod` | **66479** |
| `generateReportId` | 66100 | | `generateFindings` | **66510** |
| `getFullTimestamp` | 66114 | | `generateSafetyFocusReport` | 66531 |
| `getShortTimestamp` | 66132 | | `generateSafetyFocusRecommendations` | 66741 |
| `buildExecutiveSummary` | 66139 | | `generateYearlySection` | 66806 |
| `updateReportFooter` | 66188 | | `generateTopLocationsTable` | 66827 |
| `showTableOfContents` | 66214 | | `generateNodeTable` | 66846 |
| `getDefaultTOCSections` | 66242 | | `generateRecommendations` | 66865 |
| | | | `generateSafetyRecommendations` | 66874 |
| | | | `generatePedBikeRecommendations` | 66884 |
| | | | `generatePedBikeYearlySection` | 66915 |
| | | | `generatePedBikeLocationTable` | 66927 |

All 1× match. Types band ≈ **L65613 – L66944 (~1,332 LOC)**. >500 → the
prompt's existing "cut at `generateSafetyFocusReport` (L66531) → `-types` +
`-types2`" instruction is correct.

### 2.3 — 42b3 charts → `app/modules/reports/reports-charts.js`

| Anchor | Live L | Matches |
|---|---|---|
| `createReportCharts` | 66945 | 1 |
| `createSafetyCharts` | 66960 | 1 |
| `createPedBikeCharts` | 66982 | 1 |
| `createTrendCharts` | 66998 | 1 |

Charts band ≈ **L66945 – L67012 (~68 LOC)** — **under the 500-line cap, single
file, no split**. ✅ Cleanest of the four.

### 2.4 — 42b2 pdf → `app/modules/reports/reports-pdf.js`

| Anchor | Live L | Matches |
|---|---|---|
| `printReport` | 67013 | 1 |
| `storeReportData` *(unlisted helper)* | 67021 | 1 |
| `downloadReportPDF` | 67040 | 1 |
| `generateStandardReportPDF` | 67096 | 1 |
| `copyReportText` | 68079 | 1 |

PDF band ≈ **L67013 – L68090 (~1,078 LOC)**. Next decl after the band =
`generateInfographic` **L68091** (the 42d countermeasures band — STOP there).

---

## 3. Three blocking discrepancies vs. the parent-index band model

The parent `42b-reports-standard.md` band model (42b1 L68281–70249, 42b2
L70250–70715, 42b3 L70716–70781) is stale **in order and assignment**, not just
in line numbers. Session J MUST apply these three overrides at §0.

### 3.1 — Band order is inverted: core → types → **CHARTS → PDF**

Parent index assumes core → types → **pdf → charts** (42b2 *before* 42b3).
**Live order is core → types → charts → pdf:** the charts cluster
(`createReportCharts` L66945 … `createTrendCharts` L66998, ends ~L67012) sits
**immediately before** the PDF print cluster (`printReport` L67013 …).

Consequences (override the prompt text):
- **42b3 §0** says "Next decl after the block belongs to the countermeasures
  band (prompt 42d) — stop before it." **WRONG for the live file.** The decl
  immediately after `createTrendCharts` is **`printReport` (L67013)** — i.e.
  the 42b2 PDF band. 42b3's band ends at ~L67012; STOP before `printReport`.
- **42b2 §0** says "next is the charts cluster `createReportCharts` → 42b3."
  **WRONG.** In the live file the charts cluster is *above* the PDF band; the
  decl after the PDF band's `copyReportText` is **`generateInfographic`
  (L68091)** = the 42d countermeasures band. STOP there.
- **Script-tag (load) order is unaffected.** 42b2 §3 (load pdf after types) and
  42b3 §3 (load charts after pdf) describe `<script src>` ordering, which is
  independent of physical position in the file and remains valid: load core →
  types → pdf → charts. Runtime resolution is via window/CL mirrors; no
  load-order hazard.

**Recommended extraction sequence (override the parent-index order):** run
**42b1 (core, then types) → 42b3 (charts) → 42b2 (pdf)**. Extracting 42b3
before 42b2 keeps each delete a clean contiguous block (charts band is fully
self-contained between the types band and the PDF band). Extracting 42b2 first
would still work (its band L67013–L68090 is contiguous and does not include the
charts cluster), but 42b3-before-42b2 is the lower-risk order because 42b3 is
tiny, under-cap, and proves the band boundaries before the large PDF cut.

### 3.2 — `resolveReportPeriod` / `generateFindings` belong to 42b1-types, NOT 42b2

42b2 §0's grep list and §1 ("report period/findings helpers + printReport…")
imply `resolveReportPeriod` + `generateFindings` are contiguous with the PDF
print functions. **They are not.** Live: `resolveReportPeriod` **L66479** and
`generateFindings` **L66510** are physically **inside the 42b1 types band**
(between `getDateRange` L66449 and `generateSafetyFocusReport` L66531), ~530
lines above `printReport` (L67013), with the entire safety-focus /
recommendations / charts clusters in between.

**Override:** assign `resolveReportPeriod` + `generateFindings` to **42b1
(types)** — they fall inside the L65613–L66944 types band and move with it.
**42b2's actual contiguous block is ONLY L67013–L68090:** `printReport`,
`storeReportData`, `downloadReportPDF`, `generateStandardReportPDF`,
`copyReportText`. 42b2's §1 wording "report period/findings helpers" is stale
and must be ignored — those greps in 42b2 §0 are a *locator superset* only; the
actual cut starts at `printReport` (L67013).

### 3.3 — `generateStandardReportPDF` is an oversized indivisible function

`generateStandardReportPDF` spans **L67096 → ~L68078 (~983 lines)** — a single
jsPDF-drawing function with ~20 nested arrow helpers (`hexToRgb`, `cleanText`,
`drawHeader`, `drawFooter`, `newPage`, `checkPageBreak`, `addText`,
`addSectionTitle`, `drawSeverityBar`, `drawKPICard`, …). It **cannot be cut at
an inner `function` boundary** (the helpers are arrow consts scoped inside it).

42b2 §0's "if brace count >500, cut at the nearest `function` boundary → `-pdf`
+ `-pdf2`" must be applied as:
- `reports-pdf.js` (`-pdf`) = `printReport`, `storeReportData`,
  `downloadReportPDF` (~L67013–L67095, ~83 LOC).
- `reports-pdf2.js` (`-pdf2`) = `generateStandardReportPDF`, `copyReportText`
  (~L67096–L68090, ~995 LOC).

`-pdf2` is **still >500 LOC but indivisible** — accept it as a documented
oversized-function exception, the same class as R3
`buildProgrammaticCrashAnalysis` in `MODULAR_PLAN.md`. Do **not** attempt to
break `generateStandardReportPDF` internally. Note this in the `-pdf2` module
header comment.

---

## 4. Off-limits & collision cross-check

- `reports/*` is a **brand-new CL namespace** — not on the CLAUDE.md off-limits
  list; no collision.
- `buildAIContext` (L64639) is the **report-local** AI-context helper, distinct
  from `ai/context`'s `getAIAnalysisContext` (different name, different module)
  — confirmed by name. 42b1's §0 note about this is satisfied.
- No anchor name in any 42b band collides with the R1/R3 off-limits names
  (`buildCountyWideCrashProfile`, `buildLocationCrashProfile`,
  `buildProgrammaticCrashAnalysis`) — those live at L79383–L80522, far above
  the L64510–L68090 reports band.

---

## 5. Inter-sub-prompt dependency

`reports-pdf*` and `reports-charts` call `reports-standard-core`/`-types`
functions at **runtime** (e.g. PDF builds from stored report data; charts use
report stats) via the `window.*` / `CL.reports.*` mirrors. There is **no
module-top-level reference** to a sibling, so the LATE-cluster load order
core → types → pdf → charts is safe. No module-private global is shared across
the four (each band's helpers are self-contained).

---

## 6. Per-sub-prompt verdict

| Sub-prompt | Anchors | Band (live) | LOC | Split needed | Verdict |
|---|---|---|---|---|---|
| 42b1 core | 14/14 ✅ +2 unlisted | L64510–L65612 | ~1,103 | yes → `-core`+`-core2` @ `generateExplorationDashboard` | SAFE-WITH-PAUSE |
| 42b1 types | 28/28 ✅ | L65613–L66944 | ~1,332 | yes → `-types`+`-types2` @ `generateSafetyFocusReport`; **incl. resolveReportPeriod+generateFindings (§3.2)** | SAFE-WITH-PAUSE |
| 42b3 charts | 4/4 ✅ | L66945–L67012 | ~68 | no — single file | **SAFE-WITH-PAUSE (lowest risk)** |
| 42b2 pdf | 5/5 ✅ (incl. 1 unlisted) | L67013–L68090 | ~1,078 | yes → `-pdf`+`-pdf2` @ `generateStandardReportPDF`; **-pdf2 oversized-fn exception (§3.3)** | SAFE-WITH-PAUSE |

---

## 7. OVERALL VERDICT: **SAFE-WITH-PAUSE**

The 42b1/42b2/42b3 sub-prompts are **structurally runnable** (their own §0
already mandates name-anchored brace re-derivation, which absorbs the line
drift). They are **not SAFE-AUTO** (band-order inversion §3.1 + helper
mis-assignment §3.2 + oversized indivisible fn §3.3 require the overrides in
this doc) and **not NEEDS-RESPLIT** (the splits the prompts already describe are
correct once re-anchored — no new sub-prompt files are needed).

**Session J mandate:** for each 42b sub-prompt, read this doc first; at §0
apply the three §3 overrides; re-derive every `[BLK_START,BLK_END]` by brace
read against the live file; **pause and surface §0 output for Cowork review
before any §4 delete** (every band except 42b3 exceeds 500 LOC). Recommended
extraction order: **42b1-core → 42b1-types → 42b3-charts → 42b2-pdf**
(§3.1). Standard §6 Playwright smoke test on
`https://ecomhub200.github.io/Federal/app/` after each.
