# Claude Code Fix Prompt — Supabase Bridge Race Condition + State-Agnostic OOM Prevention

Copy everything below the line and paste it into Claude Code:

---

Read `CLAUDE.md` first for full project context. Create a single PR for all fixes (never push directly to main).

## Background

The OOM prevention changes from the previous PR (STEP 0b aggregate-tier guard, tier handler rewrites) are correctly in place — aggregate tiers now call `supabaseBridge.injectFastDashboard({ force: true })` instead of downloading R2 data. **However, the Supabase data is being silently discarded due to a race condition bug in supabase-bridge.js.** This is why State/Region/MPO/PD views show no data or crash.

## Fix 1 (CRITICAL): Race Condition in `injectFastDashboard()` — supabase-bridge.js line 304

**Problem:** `injectFastDashboard()` has TWO `crashState.loaded` checks:
- Line 289: `if (!force && crashState.loaded)` — correctly skips when `force=true` ✓
- Line 304: `if (crashState.loaded)` — does NOT check `force` ✗ ← **THIS IS THE BUG**

After loading County view (R2 download → `crashState.loaded = true`), every subsequent `injectFastDashboard({ force: true })` call for State/Region/MPO/PD fetches Supabase data successfully, then hits line 304 and **discards it** because `crashState.loaded` is still `true` from the county load.

**File:** `app/modules/data/supabase-bridge.js`

**Fix:** Find this block (around line 304):

```javascript
            if (typeof crashState !== 'undefined' && crashState && crashState.loaded) {
                console.log('[Phase2] R2 won the race (' + fetchMs + 'ms fetch, but R2 finished first), discarding');
                return;
            }
```

Change to:

```javascript
            if (!force && typeof crashState !== 'undefined' && crashState && crashState.loaded) {
                console.log('[Phase2] R2 won the race (' + fetchMs + 'ms fetch, but R2 finished first), discarding');
                return;
            }
```

This makes line 304 consistent with line 289 — both respect the `force` flag.

## Fix 2: Reset crashState Before Calling injectFastDashboard (Belt-and-Suspenders)

**Problem:** All aggregate tier handlers set `crashState.loaded = true` and `crashState.sampleRows = crashState.sampleRows || []` AFTER calling `injectFastDashboard`. The `|| []` preserves stale county R2 data (up to 87K rows) which other tabs may incorrectly use as if it belongs to the current aggregate tier.

**Fix:** In each of the following locations, add `crashState.loaded = false;` and `crashState.sampleRows = [];` BEFORE the `injectFastDashboard({ force: true })` call, and change `crashState.sampleRows || []` to `[]` in the post-call block.

### Fix 2a: `handleTierChange()` in `app/index.html`

Find this block inside `handleTierChange()` (the `if (tier === 'state' || tier === 'federal')` section):

```javascript
            if (tier === 'state' || tier === 'federal') {
                try {
                    if (CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.injectFastDashboard) {
                        await CL.data.supabaseBridge.injectFastDashboard({ force: true });
                    }
                    if (typeof crashState !== 'undefined') {
                        crashState.loaded = true;
                        crashState.sampleRows = crashState.sampleRows || [];
                        crashState.mapPoints = crashState.mapPoints || [];
                        crashState.sampleRowsLoaded = false;
                        if (typeof crashState.totalRows !== 'number') crashState.totalRows = 0;
                    }
```

Replace with:

```javascript
            if (tier === 'state' || tier === 'federal') {
                try {
                    // Reset stale R2 state before Supabase fetch
                    if (typeof crashState !== 'undefined') {
                        crashState.loaded = false;
                        crashState.sampleRows = [];
                        crashState.mapPoints = [];
                    }
                    if (CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.injectFastDashboard) {
                        await CL.data.supabaseBridge.injectFastDashboard({ force: true });
                    }
                    if (typeof crashState !== 'undefined') {
                        crashState.loaded = true;
                        crashState.sampleRowsLoaded = false;
                        if (typeof crashState.totalRows !== 'number') crashState.totalRows = 0;
                    }
```

### Fix 2b: `handleRegionSelection()` in `app/index.html`

Find this block inside `handleRegionSelection()`:

```javascript
        try {
            if (CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.injectFastDashboard) {
                await CL.data.supabaseBridge.injectFastDashboard({ force: true });
            }
            if (typeof crashState !== 'undefined') {
                crashState.loaded = true;
                crashState.sampleRows = crashState.sampleRows || [];
                crashState.mapPoints = crashState.mapPoints || [];
                crashState.sampleRowsLoaded = false;
            }
            try { updateDataConnectionStatus('connected'); } catch (e2) {}
            console.log('[Tier] Region view using Supabase matview (R2 download skipped)');
```

Replace with:

```javascript
        try {
            // Reset stale R2 state before Supabase fetch
            if (typeof crashState !== 'undefined') {
                crashState.loaded = false;
                crashState.sampleRows = [];
                crashState.mapPoints = [];
            }
            if (CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.injectFastDashboard) {
                await CL.data.supabaseBridge.injectFastDashboard({ force: true });
            }
            if (typeof crashState !== 'undefined') {
                crashState.loaded = true;
                crashState.sampleRowsLoaded = false;
            }
            try { updateDataConnectionStatus('connected'); } catch (e2) {}
            console.log('[Tier] Region view using Supabase matview (R2 download skipped)');
```

### Fix 2c: `handleMPOSelection()` in `app/index.html`

Find the same pattern inside `handleMPOSelection()` and apply the identical change:
- Add `crashState.loaded = false; crashState.sampleRows = []; crashState.mapPoints = [];` BEFORE the `injectFastDashboard` call
- Remove `crashState.sampleRows = crashState.sampleRows || [];` and `crashState.mapPoints = crashState.mapPoints || [];` from after the call

### Fix 2d: `handlePlanningDistrictSelection()` in `app/index.html`

Same pattern — apply the identical change as Fix 2b/2c.

### Fix 2e: STEP 0b Aggregate-Tier Guard in `autoLoadCrashData()` in `app/index.html`

Find the STEP 0b block (search for `AGGREGATE_TIERS`):

```javascript
    const AGGREGATE_TIERS = new Set(['federal', 'state', 'region', 'mpo', 'planning_district']);
    if (AGGREGATE_TIERS.has(tier)
        && window.crashLensClient
        && typeof window.crashLensClient.getSummary === 'function') {
        console.log(`[AutoLoad] Tier "${tier}" uses Supabase matview — skipping R2 download (OOM prevention)`);
        try {
            if (CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.injectFastDashboard) {
                await CL.data.supabaseBridge.injectFastDashboard({ force: true });
            }
            if (typeof crashState !== 'undefined') {
                crashState.loaded = true;
                crashState.sampleRows = crashState.sampleRows || [];
                crashState.mapPoints = crashState.mapPoints || [];
```

Replace with:

```javascript
    const AGGREGATE_TIERS = new Set(['federal', 'state', 'region', 'mpo', 'planning_district']);
    if (AGGREGATE_TIERS.has(tier)
        && window.crashLensClient
        && typeof window.crashLensClient.getSummary === 'function') {
        console.log(`[AutoLoad] Tier "${tier}" uses Supabase matview — skipping R2 download (OOM prevention)`);
        try {
            // Reset stale R2 state before Supabase fetch
            if (typeof crashState !== 'undefined') {
                crashState.loaded = false;
                crashState.sampleRows = [];
                crashState.mapPoints = [];
            }
            if (CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.injectFastDashboard) {
                await CL.data.supabaseBridge.injectFastDashboard({ force: true });
            }
            if (typeof crashState !== 'undefined') {
                crashState.loaded = true;
```

And change `crashState.sampleRows = crashState.sampleRows || [];` to just remove it (it's already been set to `[]` above). Same for `crashState.mapPoints`.

## Fix 3: Make Supabase Client State-Agnostic

**Problem:** When users switch states (e.g., from Delaware to Colorado), the Supabase client's `state` property might not update, causing queries to return wrong-state data.

**File:** `app/modules/data/supabase-bridge.js`

**Fix:** In the `refresh()` function, the state key update is already there:

```javascript
if (key) window.crashLensClient.state = key;
```

But `handleTierChange()` and the other tier handlers do NOT update `crashLensClient.state` before calling `injectFastDashboard`. Add this to the start of `injectFastDashboard()`, right after `var force = ...`:

```javascript
        // Ensure Supabase client uses the currently active state
        try {
            if (window.crashLensClient) {
                var stateKey = (typeof _getActiveStateKey === 'function') ? _getActiveStateKey() : null;
                if (stateKey) window.crashLensClient.state = stateKey;
            }
        } catch (e) { /* non-fatal */ }
```

Add this block in `injectFastDashboard()` after `var force = !!(opts && opts.force);` and before the first `if (!force && ...)` check.

## Fix 4: Fallback When Supabase Client Not Available

**Problem:** The STEP 0b guard in `autoLoadCrashData()` checks for `window.crashLensClient`, but if it's not available (e.g., auth not loaded yet), the guard fails and falls through to R2 download — which causes OOM for aggregate tiers.

**Fix:** Change the STEP 0b condition to still block R2 for aggregate tiers even without Supabase:

Find:
```javascript
    if (AGGREGATE_TIERS.has(tier)
        && window.crashLensClient
        && typeof window.crashLensClient.getSummary === 'function') {
```

Change to:
```javascript
    if (AGGREGATE_TIERS.has(tier)) {
```

And inside the try block, wrap the Supabase call with a check:

```javascript
        try {
            // Reset stale R2 state
            if (typeof crashState !== 'undefined') {
                crashState.loaded = false;
                crashState.sampleRows = [];
                crashState.mapPoints = [];
            }
            if (window.crashLensClient
                && typeof window.crashLensClient.getSummary === 'function'
                && CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.injectFastDashboard) {
                await CL.data.supabaseBridge.injectFastDashboard({ force: true });
            } else {
                console.warn(`[AutoLoad] Tier "${tier}" needs Supabase but client not available — dashboard will be empty`);
            }
```

This ensures R2 is NEVER downloaded for aggregate tiers, regardless of Supabase availability.

---

## Verification Checklist

- [ ] **Fix 1:** In `supabase-bridge.js`, line 304 now has `!force &&` prefix — identical pattern to line 289
- [ ] **Fix 2:** All 5 aggregate-tier code paths reset `crashState.loaded = false` and clear `sampleRows/mapPoints` BEFORE calling `injectFastDashboard`
- [ ] **Fix 3:** `injectFastDashboard()` updates `crashLensClient.state` from `_getActiveStateKey()` at the start
- [ ] **Fix 4:** STEP 0b guard blocks R2 for aggregate tiers even without Supabase client
- [ ] **Test:** Load County view (R2 works) → Switch to State view → Dashboard shows statewide totals from Supabase
- [ ] **Test:** Switch to Region, MPO, Planning District → Each shows correct aggregated data
- [ ] **Test:** Switch back to County → R2 download works normally
- [ ] **Test:** Federal tier → Shows all-state data without state filter
- [ ] **No regressions:** County and City views still download R2 and work normally
- [ ] **No regressions:** Lazy loader still triggers R2 for detail tabs (Analysis, Hotspots)
