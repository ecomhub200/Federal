# Phase 6: Lazy R2 Load — Implementation Plan

**Date:** 2026-04-23  
**Status:** Analysis complete — ready for implementation

---

## Problem Statement

Currently, `autoLoadCrashData()` (line 31865) immediately downloads the full R2 CSV/parquet file (~500KB–50MB depending on jurisdiction) on every page load. This blocks the dashboard for seconds while it downloads, parses every row, and builds 13+ aggregate objects.

However, **the Dashboard and Map tabs can already render from Supabase alone** (via `supabase-bridge.js`). The full R2 file is only needed when the user opens tabs requiring row-level data (Analysis, Hotspots, Grants, Before/After, Safety Focus, etc.).

**Goal:** Defer R2 download until the user clicks a tab that actually needs `crashState.sampleRows` or the full `crashState.aggregates` breakdowns (byRoute, byNode, byHour, etc.).

---

## Current Architecture

### What Supabase Provides (Fast, ~200-500ms)

The `dashboard_summary` matview (49,210 rows, 20 columns) gives us:

| Column | Maps to processRow Aggregate |
|--------|------------------------------|
| `crash_year` | `aggregates.byYear` |
| `crash_severity` | `aggregates.bySeverity` (K/A/B/C/O counts) |
| `functional_class` | `aggregates.byFuncClass` |
| `area_type` | Part of collision context |
| `collision_type` | `aggregates.byCollisionType` |
| `crash_count` | `aggregates.total` |
| `fatals` | `aggregates.fatalities` |
| `serious_injuries` | `aggregates.seriousInjuries` |
| `total_injured` | `aggregates.totalInjured` |
| `ped_crashes` | `aggregates.pedestrian.total` |
| `bike_crashes` | `aggregates.bicycle.total` |
| `speed_crashes` | `aggregates.speed.total` |
| `alcohol_crashes` | `aggregates.alcohol.total` |
| `night_crashes` | `aggregates.nighttime.total` |
| `animal_crashes` | `aggregates.animal.total` |

### What Only R2 Provides (Slow, 2-15s)

These require row-level iteration via `processRow()` / `processRowForAggregates()`:

| Aggregate | Used By |
|-----------|---------|
| `byRoute` | Hotspots, Analysis route tables, Map route search |
| `byNode` | Hotspots (intersection mode), CMF location list |
| `byHour` | Analysis hourly chart, Deep Dive |
| `byDOW` | Analysis day-of-week chart |
| `byMonth` | Analysis monthly chart |
| `byWeather` | Analysis weather chart, Deep Dive |
| `byLight` | Analysis light conditions chart |
| `byIntType` | Analysis intersection type breakdown |
| `byTrafficCtrl` | Analysis traffic control breakdown |
| `intersection` / `nonIntersection` | Analysis split, Dashboard detail |
| `sampleRows[]` | Map pins, CMF crash list, Warrants crash list, Safety Focus, Search, Before/After |
| `mapPoints[]` | Map markers/clusters |

### Existing Supabase-First Flow (supabase-bridge.js)

`injectFastDashboard()` (line 285) already races Supabase against R2:
1. If `crashState.loaded` is already true → skip (R2 won)
2. Fetch `getSummary(tier, value)` from matview
3. If R2 finishes during fetch → discard Supabase result
4. Otherwise → paint KPIs, yearly table, func class table + show "loading details" banner
5. When R2 completes → `onR2LoadComplete()` removes the banner

**This means the Dashboard already works without R2.** Phase 6 formalizes this pattern.

---

## Tab Classification

### Tier 1: Supabase-Only (no R2 needed)

| Tab | showTab Line | What It Needs | Current Guard |
|-----|-------------|---------------|---------------|
| Dashboard | 30810 | `crashState.aggregates` (KPIs, yearly, func class) | `crashState.loaded` |
| Map | 30693 | `crashState.mapPoints` OR Supabase `getCrashes()` for viewport | `crashState.loaded` |

**Dashboard** can work from Supabase bridge aggregates alone — the bridge already paints KPIs, yearly table, and func class table from the matview.

**Map** is more nuanced: cluster markers need `mapPoints[]` (R2), but boundary overlays and tier navigation work without it. Map can show an empty state initially, then populate when R2 loads.

### Tier 2: Supabase + Deferred R2 (hybrid)

| Tab | showTab Line | What It Needs | Why |
|-----|-------------|---------------|-----|
| CMF | 30842 | `getCrashesByLocation()` from Supabase, fallback to sampleRows | Already has Supabase path (line 85804) |
| Warrants | 30845 | `getCrashesByLocation()` from Supabase, fallback to sampleRows | Already has Supabase path (line 105773) |

These tabs already call Supabase `getCrashesByLocation()` and only fallback to `sampleRows` if Supabase unavailable.

### Tier 3: R2 Required (must trigger lazy load)

| Tab | showTab Line | What It Needs | Key Dependencies |
|-----|-------------|---------------|------------------|
| Analysis | 30838 | `byHour`, `byDOW`, `byMonth`, `byWeather`, `byLight`, `byIntType`, `byTrafficCtrl` | `updateAnalysis()` reads all aggregate sub-objects |
| Intersection | 30839 | `byNode`, `byRoute`, `intersection`/`nonIntersection` | `updateIntersectionTab()` |
| Ped/Bike | 30840 | `sampleRows` filtered for ped/bike | `updatePedBikeTab()` |
| Hotspots | 30841 | `byRoute` OR `byNode` | `analyzeHotspots()` in `hotspots.js` |
| Crash Tree | 30831 | `sampleRows` | `initCrashTreeTab()` / `buildCrashTreeData()` |
| Grants | 30843 | Pre-aggregated from `byRoute`/`byNode` + `sampleRows` for baselines | `initGrantModule()` → `calculateCountyBaselines()` |
| Before/After | — | `sampleRows` for location filtering | `baState.locationCrashes` |
| Deep Dive | 30852 | `sampleRows` + multiple aggregate breakdowns | `initDeepDiveTab()` |
| Safety Focus | 30857 | `sampleRows` | `initSafetyFocus()` (line 92839 guard) |
| Fatal/Speeding | 30890 | `sampleRows` | `initFatalSpeedingTab()` |
| Domain Knowledge | 30856 | `sampleRows` + aggregates | `initDomainKnowledge()` |

---

## Key Code Locations

| What | File | Line |
|------|------|------|
| `autoLoadCrashData()` | app/index.html | 31865 |
| `showTab()` | app/index.html | 30668 |
| `FinalGuarantee` IIFE | app/index.html | 146473 |
| `loadSampleRowsInBackground()` | app/index.html | 27371 |
| `getDataFilePath()` | app/index.html | 24183 |
| `processRow()` / aggregates | csv-worker.js (via index.html) | ~32900+ |
| `injectFastDashboard()` | supabase-bridge.js | 285 |
| `resolveTier()` | supabase-bridge.js | 38 |
| `crashState` init | app/index.html | ~25600 |
| `crashState.loaded` set true | app/index.html | 21416, 27345, 31549, 31588, 32197, 32352, 32444 |
| `crashState.loaded` set false | app/index.html | 32578 |
| `crashState.sampleRowsLoaded` | app/index.html | 27357, 27531, 27622, 32363, 32957 |

---

## Implementation Plan

### Step 1: Create `app/modules/data/lazy-loader.js`

New module: `CL.data.lazyLoader`

```javascript
/**
 * Lazy R2 Loader — defers full dataset download until a tab needs it.
 *
 * On page load, only Supabase summary data is fetched (via supabase-bridge).
 * When user clicks a tab that requires sampleRows or full aggregates,
 * this module triggers the R2 download on demand.
 */
window.CL = window.CL || {};
CL.data = CL.data || {};

CL.data.lazyLoader = (function () {
    'use strict';

    // ── State ──
    let _r2LoadPromise = null;   // Singleton promise — prevents duplicate downloads
    let _r2Loaded = false;       // True once full R2 data is available
    let _enabled = true;         // Feature flag — can be disabled for debugging

    // Tabs that require full R2 dataset (sampleRows + full aggregates)
    const R2_REQUIRED_TABS = new Set([
        'analysis',
        'intersection',
        'pedestrian',
        'hotspots',
        'crashtree',
        'grants',
        'beforeafter',
        'deepdive',
        'safety',
        'fatalspeeding',
        'domain-knowledge'
    ]);

    // Tabs that work with Supabase alone (no R2 needed)
    const SUPABASE_ONLY_TABS = new Set([
        'dashboard',
        'map',        // Map works partially — boundary/tier UI works, markers need R2
        'upload',
        'ai',
        'prediction',
        'cmf',        // Has Supabase getCrashesByLocation() path
        'warrants'    // Has Supabase getCrashesByLocation() path
    ]);

    /**
     * Check if a tab needs full R2 data.
     */
    function tabNeedsR2(tabId) {
        return R2_REQUIRED_TABS.has(tabId);
    }

    /**
     * Check if R2 data has been loaded.
     */
    function isR2Loaded() {
        return _r2Loaded || !_enabled;
    }

    /**
     * Mark R2 as loaded (called by autoLoadCrashData on completion).
     */
    function markR2Loaded() {
        _r2Loaded = true;
        _r2LoadPromise = null;
    }

    /**
     * Trigger lazy R2 download if not already loaded/loading.
     * Returns a promise that resolves when the data is ready.
     *
     * Shows a loading overlay on the requesting tab while downloading.
     */
    async function ensureR2Loaded(requestingTabId) {
        if (_r2Loaded || !_enabled) return true;

        // If already loading, return the existing promise
        if (_r2LoadPromise) {
            console.log(`[LazyLoader] R2 already loading, ${requestingTabId} waiting...`);
            return _r2LoadPromise;
        }

        console.log(`[LazyLoader] Tab "${requestingTabId}" requires R2 data — triggering download`);

        // Show loading state on the requesting tab
        _showTabLoadingOverlay(requestingTabId);

        // Trigger the actual download
        _r2LoadPromise = new Promise(async (resolve) => {
            try {
                if (typeof autoLoadCrashData === 'function') {
                    await autoLoadCrashData(true); // skipCache=true for fresh load
                }
                _r2Loaded = true;
                resolve(true);
            } catch (e) {
                console.error('[LazyLoader] R2 download failed:', e);
                resolve(false);
            } finally {
                _removeTabLoadingOverlay(requestingTabId);
                _r2LoadPromise = null;
            }
        });

        return _r2LoadPromise;
    }

    /**
     * Show a loading overlay on the tab content area.
     */
    function _showTabLoadingOverlay(tabId) {
        const tabEl = document.getElementById('tab-' + tabId);
        if (!tabEl) return;

        // Don't add duplicate overlays
        if (tabEl.querySelector('.lazy-load-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'lazy-load-overlay';
        overlay.style.cssText = [
            'position:absolute;top:0;left:0;right:0;bottom:0',
            'background:rgba(15,23,42,0.85)',
            'display:flex;flex-direction:column;align-items:center;justify-content:center',
            'z-index:1000;border-radius:8px;color:#e2e8f0;gap:16px'
        ].join(';');
        overlay.innerHTML = [
            '<div style="width:48px;height:48px;border:3px solid #334155;border-top-color:#60a5fa;border-radius:50%;animation:spin 1s linear infinite"></div>',
            '<div style="font-size:15px;font-weight:600">Loading detailed crash data...</div>',
            '<div style="font-size:13px;color:#94a3b8">Downloading full dataset for analysis</div>'
        ].join('');

        // Ensure parent has relative positioning for overlay
        if (getComputedStyle(tabEl).position === 'static') {
            tabEl.style.position = 'relative';
        }
        tabEl.appendChild(overlay);
    }

    /**
     * Remove the loading overlay from a tab.
     */
    function _removeTabLoadingOverlay(tabId) {
        const tabEl = document.getElementById('tab-' + tabId);
        if (!tabEl) return;
        const overlay = tabEl.querySelector('.lazy-load-overlay');
        if (overlay) overlay.remove();
    }

    /**
     * Enable/disable lazy loading (for debugging).
     */
    function setEnabled(enabled) {
        _enabled = enabled;
        console.log(`[LazyLoader] ${enabled ? 'Enabled' : 'Disabled'}`);
    }

    /**
     * Reset state (called on jurisdiction change).
     */
    function reset() {
        _r2Loaded = false;
        _r2LoadPromise = null;
    }

    return {
        tabNeedsR2:     tabNeedsR2,
        isR2Loaded:     isR2Loaded,
        markR2Loaded:   markR2Loaded,
        ensureR2Loaded: ensureR2Loaded,
        reset:          reset,
        setEnabled:     setEnabled,
        R2_REQUIRED_TABS: R2_REQUIRED_TABS,
        SUPABASE_ONLY_TABS: SUPABASE_ONLY_TABS
    };
})();

CL._registerModule('data/lazyLoader');
```

### Step 2: Wire `showTab()` to Lazy Loader (line 30668)

**Add before the existing tab-specific blocks (after line 30692):**

```javascript
    // ── Lazy R2 Load Gate ──
    // If this tab needs full R2 data and it hasn't loaded yet,
    // trigger the download and re-fire showTab when complete.
    if (CL.data?.lazyLoader && CL.data.lazyLoader.tabNeedsR2(tabId) && !CL.data.lazyLoader.isR2Loaded()) {
        CL.data.lazyLoader.ensureR2Loaded(tabId).then(success => {
            if (success) {
                // Re-trigger tab init now that data is available
                showTab(tabId);
            }
        });
        return; // Don't run tab init code yet — data not ready
    }
```

**Position:** Insert at line 30693 (before the `if (tabId === 'map' && crashState.loaded)` block), so it intercepts R2-dependent tabs before they hit the `crashState.loaded` guards.

**Important:** The `return` prevents the tab from trying to render with missing data. Once R2 loads, `showTab(tabId)` is called again and the normal init runs.

### Step 3: Modify `autoLoadCrashData()` to Support Lazy Mode (line 31865)

**Currently:** `autoLoadCrashData()` always downloads R2 immediately.

**Change:** When lazy loader is enabled AND Supabase is available, `autoLoadCrashData()` should:
1. Still run Supabase bridge (`injectFastDashboard`)
2. Set `crashState.loaded = true` with Supabase-only aggregates
3. Show the dashboard immediately
4. **Skip** R2 download — it will be triggered lazily by `showTab()`

**Add at line 31893 (after the "Starting automatic data load" log):**

```javascript
    // ── Lazy Load Mode ──
    // If Supabase is available and lazy loading is enabled, skip R2 download.
    // Dashboard will render from Supabase summary; R2 loads when a detail tab is clicked.
    if (CL.data?.lazyLoader && !CL.data.lazyLoader.isR2Loaded() &&
        window.crashLensClient && typeof window.crashLensClient.getSummary === 'function' &&
        !skipCache) {
        console.log('[AutoLoad] Lazy mode — deferring R2 download, using Supabase for dashboard');

        // Let supabase-bridge handle dashboard painting
        if (CL.data?.supabaseBridge) {
            await CL.data.supabaseBridge.injectFastDashboard({ force: true });
        }

        // Set minimal crashState so Dashboard/Map tabs can function
        if (!crashState.loaded) {
            crashState.loaded = true;
            crashState.sampleRows = [];
            crashState.mapPoints = [];
            crashState.sampleRowsLoaded = false;
            crashState.totalRows = 0; // Will be updated when R2 loads

            // Fire events so UI updates
            updateDataConnectionStatus('connected');
            logConnectionEvent('supabase_lazy', 'Dashboard loaded from Supabase, R2 deferred');
        }

        // Update UI
        if (uploadIcon) uploadIcon.textContent = '✅';
        if (loadingTitle) loadingTitle.textContent = 'Dashboard Ready';
        if (loadingSubtitle) loadingSubtitle.textContent = 'Detailed data loads on demand';
        setTimeout(() => {
            if (prog) prog.style.display = 'none';
            showUploadSummary();
            showTab('dashboard');
        }, 300);

        return; // Skip R2 download — it will be triggered by showTab() when needed
    }
```

**When `skipCache=true`:** This means the lazy loader is requesting the actual R2 download. The new guard is skipped because `skipCache` is true, so the existing R2 fetch logic runs normally.

### Step 4: Mark R2 Loaded on Completion

**At every location where `crashState.loaded = true` is set after R2 processing:**

Add `if (CL.data?.lazyLoader) CL.data.lazyLoader.markR2Loaded();` after:
- Line 31549 (CSV parse complete)
- Line 31588 (CSV parse complete alternate path)
- Line 32197 (parquet parse complete)
- Line 32352 (parquet parse complete alternate path)
- Line 32444 (processRow complete)
- Line 27345 (cache restore — this means full aggregates were cached)

### Step 5: Reset on Jurisdiction Change

**In `resetState()` (line ~32578):**

```javascript
    // Reset lazy loader state so new jurisdiction triggers fresh load
    if (CL.data?.lazyLoader) CL.data.lazyLoader.reset();
```

### Step 6: Add Script Tag

**In `app/index.html`, after the supabase-bridge.js script tag:**

```html
<script src="modules/data/lazy-loader.js"></script>
```

### Step 7: Update FinalGuarantee (line 146473)

**No change needed.** FinalGuarantee checks `crashState.loaded` — with lazy mode, `crashState.loaded` will be set to `true` after Supabase summary loads, so FinalGuarantee will see it as loaded and skip.

---

## Data Flow — Before vs After

### BEFORE (Current)

```
Page Load
  → FinalGuarantee fires
  → autoLoadCrashData()
  → R2 download (2-15s) ←── BLOCKING
  → processRow() builds ALL aggregates
  → crashState.loaded = true
  → showTab('dashboard')
  → Dashboard renders with full data
```

### AFTER (Lazy Load)

```
Page Load
  → FinalGuarantee fires
  → autoLoadCrashData()
  → Supabase getSummary() (~300ms) ←── FAST
  → crashState.loaded = true (minimal)
  → showTab('dashboard')
  → Dashboard renders from Supabase bridge ←── USER SEES DATA IN <1s

  ... user clicks "Analysis" tab ...

  → showTab('analysis')
  → lazyLoader.tabNeedsR2('analysis') → true
  → lazyLoader.isR2Loaded() → false
  → lazyLoader.ensureR2Loaded('analysis')
    → Shows loading overlay on Analysis tab
    → autoLoadCrashData(skipCache=true) ←── R2 download happens NOW
    → processRow() builds full aggregates
    → lazyLoader.markR2Loaded()
    → Removes overlay
  → showTab('analysis') re-fires
  → updateAnalysis() runs with full data
```

---

## Edge Cases

### 1. No Supabase Available (API key missing)
If `window.crashLensClient` doesn't exist or has no `getSummary`, the lazy mode guard in Step 3 is skipped. Falls through to normal R2-first behavior. **No regression.**

### 2. R2 File Doesn't Exist (non-county tiers)
For tiers like Region/MPO/City where R2 files may not exist yet, the lazy loader will attempt R2 download, fail, and the tab will show an error state. This is the **same behavior as today** — no regression.

### 3. User Rapidly Switches Tabs
`_r2LoadPromise` is a singleton. Multiple tabs requesting R2 will share the same download. Only one R2 fetch occurs.

### 4. Cache Hit Path
When `restoreCrashStateFromCache()` succeeds (line 27345), `crashState.loaded = true` is set with full aggregates. `markR2Loaded()` is called, so lazy loader knows R2-level data is available. `loadSampleRowsInBackground()` still runs for `sampleRows`/`mapPoints`.

### 5. Dashboard Auto-Navigate
`autoLoadCrashData()` calls `showTab('dashboard')` at the end. With lazy mode, this happens after Supabase summary paints. Dashboard is a Supabase-only tab, so no R2 gate fires.

### 6. Jurisdiction Change
`resetState()` resets `crashState.loaded = false` and `CL.data.lazyLoader.reset()`. The next `autoLoadCrashData()` re-enters lazy mode for the new jurisdiction.

---

## Test Plan

### Test 1: Dashboard loads without R2

1. Open app with Supabase configured
2. Verify Dashboard shows KPIs, yearly table, func class table within 1 second
3. Verify NO R2 fetch request in Network tab
4. Verify `supabaseBridgeIndicator` banner appears

### Test 2: Analysis tab triggers R2 download

1. From Dashboard, click "Analysis" tab
2. Verify loading overlay appears on Analysis tab
3. Verify R2 fetch request starts in Network tab
4. Verify overlay disappears when R2 completes
5. Verify Analysis tab renders all charts (hourly, DOW, monthly, weather, light)

### Test 3: Singleton download (no duplicate fetches)

1. Click "Analysis" tab (triggers R2 download)
2. While loading, click "Hotspots" tab
3. Verify only ONE R2 fetch in Network tab
4. Verify both tabs render correctly after R2 completes

### Test 4: CMF works without R2 (Supabase path)

1. From Dashboard, click "CMF/Countermeasures" tab
2. Select a location and route
3. Verify crash data loads from Supabase `getCrashesByLocation()`
4. Verify NO R2 fetch triggered

### Test 5: Warrants works without R2 (Supabase path)

1. Same as Test 4 but for Warrants tab
2. Verify Supabase path used, no R2 trigger

### Test 6: No Supabase fallback (R2-first behavior)

1. Remove Supabase API key from config
2. Reload app
3. Verify R2 download starts immediately (old behavior)
4. Verify all tabs work normally

### Test 7: Jurisdiction change resets lazy state

1. Load Dashboard (Supabase-only)
2. Click Analysis (triggers R2)
3. Wait for R2 to complete
4. Switch jurisdiction (county dropdown)
5. Verify lazy state resets
6. Verify new Dashboard loads from Supabase
7. Verify clicking Analysis triggers new R2 download

### Test 8: Cache hit bypasses lazy mode

1. Load any jurisdiction fully (R2 completes)
2. Close and reopen app
3. Verify cache hit restores full data
4. Verify `lazyLoader.isR2Loaded()` returns `true`
5. Verify clicking Analysis tab renders immediately (no R2 re-download)

---

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `app/modules/data/lazy-loader.js` | **NEW** | CL.data.lazyLoader module (~150 lines) |
| `app/index.html` | MODIFY | Wire showTab() gate (~10 lines at L30693) |
| `app/index.html` | MODIFY | Add lazy mode guard in autoLoadCrashData (~25 lines at L31893) |
| `app/index.html` | MODIFY | Add markR2Loaded() calls at 6 locations (1 line each) |
| `app/index.html` | MODIFY | Add reset() call in resetState() (1 line) |
| `app/index.html` | MODIFY | Add script tag for lazy-loader.js (1 line) |

**Total new code:** ~200 lines  
**Total modified lines:** ~40 lines across 9 locations  
**Risk:** Low — all changes are additive with feature-flag escape hatch (`setEnabled(false)`)
