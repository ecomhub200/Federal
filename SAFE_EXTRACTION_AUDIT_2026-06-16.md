# Safe-Extraction Audit — `app/index.html` modularization

> **Date:** 2026-06-16 · **Branch:** `modularize/config-layer` · **Base:** `origin/main` @ `9fa0801c`
> **Author:** CC session (autonomous overnight run)
> **Scope:** Continue the `app/index.html` → `app/modules/` modularization "industry standard"
> per the approved plan, while honoring `CLAUDE.md`'s hard discipline:
> *extract verbatim, one module per session, no behavior changes, mandatory deployed
> `playwright-cli` smoke test on app/ changes.*

---

## 0. TL;DR for the morning

- ✅ **DONE & committed** (`b446b325`): **CSS extraction** — three inline `<style>` blocks
  moved to `app/css/{app,report-design,domain-knowledge}.css`. `app/index.html`
  127,410 → **122,598 lines** (−4,812). This is the safe, high-value, low-risk win.
- ⛔ **NOT done — config module (Phase 1):** on inspection it is **NOT a safe
  unsupervised extraction** (non-contiguous, interwoven with core bootstrap
  globals, load-order hazard). See §2. Deferred to a supervised session.
- ⛔ **NOT done — reports/tabs JS (Phases 2–3):** these are static-analysis
  *candidates* only. Each needs a supervised per-module session **and the
  deployed smoke test**, which cannot be run from here. See §3 for the
  execution-ready queue.
- ⛔ **NOT done — ESM cutover (Phase 5):** by design a single coordinated step
  *after* all inline JS is extracted. Not started.

**One hard gate before merging ANYTHING under `app/` (including the CSS commit):**
run the `playwright-cli` smoke test against `https://ecomhub200.github.io/Federal/app/`
once the branch is deployed. CLAUDE.md makes this mandatory; it could not be run
locally because the changes are not yet on GitHub Pages.

---

## 1. What was completed tonight — CSS extraction (commit `b446b325`)

| File | Content | Was |
|---|---|---|
| `app/css/app.css` | main stylesheet, 4,321 lines | inline L172–4494 |
| `app/css/report-design.css` | CC365 report design system, 405 lines | `<style id="cc365-report-design">` L4495–4901 |
| `app/css/domain-knowledge.css` | Domain Knowledge tab styles, 83 lines | inline L13097–13181 |

Each block was replaced by a single `<link rel="stylesheet">`. Byte-faithful
(CRLF preserved). **Safety evidence:**
- No `url(...)` in any extracted block → no relative-path breakage on the `css/` subdir move.
- No JS references these `<style>` elements by `id` (the `getElementById('...Style...')`
  hits at L32877/L77427 are unrelated JS-injected style elements).
- Brace balance per file: app.css 3265/3265, report-design 82/82, DK 18/18.
- Seams verified clean; `<style>`/`</style>` now 7/7 balanced (kept: the
  above-the-fold app-loading overlay and the one-line `dashboardSpin` keyframe,
  plus JS template-string/KML `<style>` that must stay inline).
- `git diff --stat`: only `app/index.html` (+3/−4815), `app/sw.js`,
  `app/css/*` (new), `app/CODE_MAP.md`.

Also updated: `app/sw.js` `CACHE_NAME` → `crashlens-v20260616-r12` + precache
`app/css/app.css` (now first-paint critical); `app/CODE_MAP.md` banner noting
the line-number shift.

**Still required for this commit:** deployed smoke test (visual check that the
app renders styled, no FOUC, reports/DK tabs styled correctly).

---

## 2. Phase 1 (config module) — WHY IT IS NOT SAFE UNSUPERVISED

The plan assumed config was a small clean win. Reading the code disproves that.
The config symbols are **scattered and interwoven with core bootstrap globals**:

| Symbol | Current line | Problem |
|---|---|---|
| `const R2_BASE_URL` | L19897 | wedged between `r2State`, `appConfig`, `MAP_CENTER`, `jurisdictionContext` — all app-wide shared globals |
| `let appConfig` | L19907 | app-wide global, read everywhere; explicitly must NOT be relocated |
| `const API_AVAILABILITY` + `isApiAvailableForState` | L20138–20157 | clean 20-line unit BUT reads `jurisdictionContext` (shared global) |
| `loadApiKeys` | L20645 | inside the large interwoven "CONFIG LOADING & JURISDICTION MANAGEMENT" bootstrap region (CONFIG_RETRY, cache helpers, fetch wrappers) |

**Blocking reasons (any one is fatal under CLAUDE.md rules):**
1. **Not contiguous** — symbols span ~750 lines with unrelated bootstrap code between them. Rule §2 says ABORT if not contiguous.
2. **Load-order hazard** — the planned EARLY-cluster `<script>` for `CL.config` would load *before* `appConfig`/`jurisdictionContext`/`r2State` are declared (those live deep in a later inline script at L19897+). An external classic script reading those bareword globals before they exist would throw / read `undefined`.
3. **Shared-global relocation forbidden** — `appConfig`, `jurisdictionContext`, `r2State` are read by hundreds of inline call-sites; rule §8 forbids moving them.

This is the **same class of problem** that already blocks prompt 46 (app-bootstrap:
"anchors non-contiguous"). It needs a **resolution doc** and a supervised session,
exactly like prompts 19/41/44 got.

**Recommended path for the API-config goal (supervised):** Create
`app/modules/config/config.js` that owns ONLY the cleanly-isolable, late-loadable
pieces — `API_AVAILABILITY` + `isApiAvailableForState` (a clean contiguous unit) —
wired in the **LATE** cluster (after the bootstrap declares `jurisdictionContext`),
with `jurisdictionContext` window-mirrored. Leave `appConfig`/`R2_BASE_URL`/
`loadApiKeys` inline (they are bootstrap, not feature config). For the user's
"easy API configuration" goal, the bigger lever is already in place:
`config/api-keys.json` is the single runtime source for keys/URLs — document it,
and add `r2Worker.publicUrl` as the canonical R2 base so `R2_BASE_URL` becomes a
pure fallback. That is a **config/docs change, not a risky JS extraction.**

---

## 3. Remaining inline JS — execution-ready queue (SUPERVISED, one per session)

Line numbers below were re-derived by function-name grep on the **current**
122,598-line file (post-CSS). They drift after every extraction — re-grep each
time. Verdicts are **static-analysis** classifications; **none are behavior-verified**.
Every one requires the deployed `playwright-cli` smoke test before merge.

| # | Cluster | Current range | ~LOC | Anchors (grep these) | Verdict | Notes / hazard |
|---|---|---|---|---|---|---|
| 1 | Countermeasures + Memo + Recommendations | L53501–55867 | 2,366 | `generateCountermeasuresReport` … `generateTrendAnalysis` | **SAFE** (split 3-way) | contiguous; reads `crashState`/`COL`/`baState` (keep inline); move `MEMO_STYLES` const with memo fns; prompt `42d` |
| 2 | Before/After study engine + export + monitoring | L55868–58530 | 2,662 | `switchBAMode` … `refreshBAMonitorSubscriberChips` | **SUPERVISED** | `baState` (init ~L55849) MUST be window-mirrored (inline code reads it bareword); split per `42c1/42c3/42c2`; server sync side-effects |
| 3 | Map init + display | L36434–37431 | 997 | `initMap`, `updateMapDisplay` | **SAFE** | contiguous pair; `crashMap` stays a window global; `MAP_CENTER/MAP_ZOOM` move with module; prompt `35` (target `map/map-init.js`) |
| 4 | Signal warrant analysis + reports + AI | L91955–94810 | 2,855 | `signal_runAnalysis` … `signal_extractSingleFileWithDualAI` | **SAFE** (split 3-way) | reads `warrantsState.signal`; AI via already-extracted `CL.ai.*`; no oversized fn (largest 457 L) — needs new prompt |
| 5 | District / Magisterial matrix + drill + report | L110582–113890 | 3,308 | `loadMagisterialDistricts` … `generateDistrictReport` | **SAFE** (split 2–3-way) | matview-backed; `districtSelectedCache` moves with module; Chart.js clean — needs new prompt |
| 6 | School Safety tab | L116455–117570 | 1,115 | `assetLoadSchools`, `updateSchoolSafetyMetrics` | **SAFE** | `schoolState` moves with module; matview-backed; **NOTE** an `assets/school-tab.js` already exists — confirm no overlap before extracting |
| 7 | Transit Safety tab | L117570–120087 | 2,517 | `updateTransitSafetyMetrics`, `transitLoadStops` | **SAFE** | `transitState` moves; **NOTE** `assets/transit-tab.js` already exists — confirm no overlap |
| 8 | Mapillary layers (coverage/signs/graph) | L114600–116075 | 1,475 | mapillary loaders | **SAFE** (LOW priority) | orthogonal to crash analysis; reads `crashMap`/`mapLayerControl` |
| 9 | ArcGIS feature-service import | L116162–118517 | 2,355 | `arcgisFetchService`, `arcgisSaveAsset` | **SAFE** | self-contained import pipeline; `assetState` |
| 10 | Fatal Speeding tab + PDF | L75973–79476 | 3,503 | `initFatalSpeedingFromMatview` … `exportFSToPDF` | **BLOCKED** | `exportFSToPDF` is a ~982-line indivisible fn (size-exception precedent: `assets/transit-tab`, `reports/reports-pdf`); needs a prompt + size-exception sign-off |

**Caveats on the "already exists" rows (#6, #7):** `assets/school-tab.js` and
`assets/transit-tab.js` were extracted in earlier rounds. The clusters above are
likely *different* functions in the same feature area (loaders/metrics vs. the
already-moved tab UI). **Verify via `grep` for name collisions before touching** —
do not re-extract or duplicate.

### Recommended supervised execution order (impact × safety)
1. **#3 Map init** (prompt 35 exists, clean, 997 L) — smallest clean win, validates the loop.
2. **#1 Countermeasures/Memo/Recommend** (prompt 42d, ~2,366 L) — big, contiguous, no state mutation.
3. **#2 Before/After** (prompts 42c1/42c3/42c2) — big, but needs the `baState` window-mirror discipline; do after #1 proves the reports cluster.
4. **#5 District matrix**, **#4 Signal warrants** — large SAFE clusters; author new prompts.
5. **#9 ArcGIS**, **#6/#7 School/Transit loaders** (after collision check), **#8 Mapillary** — lower priority.
6. **#10 Fatal Speeding** — last; needs size-exception sign-off.
7. **Then** the config resolution (§2) and finally the **Stage A ESM cutover** (Phase 5).

Each step: read the prompt → §0 pre-flight (re-grep anchors, confirm contiguous)
→ extract verbatim → dual-expose + register → wire `<script>` in the correct
cluster → `node --check` → `wc -l`/fn-count delta → `git diff --stat` clean →
**deployed smoke test** → update CODE_MAP → commit → append module to the
CLAUDE.md protected list.

---

## 4. Why not "just do it all tonight"

`CLAUDE.md` mandates one module per session, verbatim extraction, **and a
deployed `playwright-cli` smoke test for every app/ change** — precisely because
these clusters read shared state and back HTML `onclick=` handlers, where a wrong
dual-exposure decision breaks a feature *silently* (no error, just wrong output).
The existing program took ~20 supervised sessions (A–T) for this reason. The
smoke test is the safety net, and it requires a deploy. Doing 20K+ lines of
unverifiable JS surgery overnight would trade a shipped, working v1.0 for an
unreviewable diff with likely silent regressions — the opposite of the goal.
The CSS extraction was done because it is the one activity with no shared-state /
hoisting / onclick hazards and is locally verifiable.

---

## 5. State of the branch `modularize/config-layer`

- 1 commit ahead of `origin/main`: `b446b325` (CSS extraction).
- Working tree clean.
- **Next human action:** deploy the branch (or review locally), run the smoke
  test, and if green, open the PR for the CSS extraction. Then pick item #3 from
  the queue above for the next supervised session.
