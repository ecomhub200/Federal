# Claude Code Fix Prompt — OOM Prevention + Forecast API + Email Scheduling

Copy everything below the line and paste it into Claude Code:

---

Read `CLAUDE.md` first for full project context. Create a single PR for all fixes (never push directly to main).

## Fix 1 (CRITICAL): Aggregate Tiers Crash Browser with Out-of-Memory

**Problem:** When users click State, Federal, Region, MPO, or Planning District view, the app downloads the full R2 parquet/CSV file for that tier. For Delaware statewide, that's 569,829 rows × 550 columns — the browser runs out of memory and crashes. County view works fine (~87K rows).

**Root Cause:** `handleTierChange()` and the tier selection handlers call `autoLoadCrashData(true)` with `skipCache=true`, which bypasses the Phase 6 lazy loader guard and downloads the massive R2 file. The Supabase matview (49K rows, 20 pre-aggregated columns) exists specifically to serve these aggregate tiers without needing row-level R2 data.

### Fix 1a: Add aggregate-tier guard to `autoLoadCrashData()` in `app/index.html`

Find the function `autoLoadCrashData()` (around line 31882). After the existing Phase 6 lazy guard (the block that checks `!skipCache && CL.data && CL.data.lazyLoader` and ends with `return; // Skip R2 download`), add a NEW guard block:

```javascript
    // ========================================
    // STEP 0b: Aggregate-Tier Guard
    // ========================================
    // State/Federal/Region/MPO/PD tiers should NEVER download R2 data —
    // the statewide parquet (569K+ rows × 550 cols) causes browser OOM.
    // These tiers use Supabase matview data exclusively.
    // Only county and city tiers are small enough for in-browser R2 parsing.
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
                crashState.sampleRowsLoaded = false;
                if (typeof crashState.totalRows !== 'number') crashState.totalRows = 0;
            }
            try { updateDataConnectionStatus('connected'); } catch (e) {}
            if (uploadIcon) uploadIcon.textContent = '✅';
            if (loadingTitle) loadingTitle.textContent = 'Dashboard Ready';
            if (loadingSubtitle) loadingSubtitle.textContent = `${jurisdictionName} — aggregated view`;
            setTimeout(function () {
                if (prog) prog.style.display = 'none';
                try { if (typeof showUploadSummary === 'function') showUploadSummary(); } catch (e) {}
                try { showTab('dashboard'); } catch (e) {}
            }, 300);
        } catch (e) {
            console.warn('[AutoLoad] Supabase bridge for aggregate tier failed:', e);
        }
        return;
    }
```

This must go BEFORE "STEP 1: Check IndexedDB cache first" and AFTER the existing Phase 6 lazy guard. The `tier` variable is already defined earlier in the function as:
```javascript
const tier = typeof jurisdictionContext !== 'undefined' ? jurisdictionContext.viewTier : 'county';
```

### Fix 1b: Update `handleTierChange()` — stop calling `autoLoadCrashData(true)` for state/federal

In the `handleTierChange()` function (around line 20906), find this block inside the `if (tier === 'federal' || tier === 'state')` section:

```javascript
            // For state/federal tiers: load the CSV for the selected road type
            // Uses getDataFilePath() which returns tier-aware R2 paths (e.g., colorado/_state/dot_roads.csv)
            if (tier === 'state' || tier === 'federal') {
                autoLoadCrashData(true).catch(e => {
                    console.warn(`[Tier] Background ${tier} CSV load failed:`, e.message);
                });
            }
```

Replace with:

```javascript
            // For state/federal tiers: use Supabase matview (pre-aggregated).
            // Do NOT call autoLoadCrashData() — the statewide R2 parquet file
            // (569K+ rows × 550 cols) causes browser out-of-memory crashes.
            // Dashboard/Map render from Supabase summary; detail tabs trigger
            // lazy R2 download for the *county-level* file if needed.
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
                    try { updateDataConnectionStatus('connected'); } catch (e2) {}
                    console.log(`[Tier] ${tier} view using Supabase matview (R2 download skipped)`);
                } catch (e) {
                    console.warn(`[Tier] Supabase bridge for ${tier} failed:`, e.message);
                }
            }
```

### Fix 1c: Update `handleRegionSelection()` — use Supabase instead of R2

Find the region handler (search for `handleRegionSelection`). Replace:

```javascript
        // Load region CSV from R2 for detailed analysis tabs
        // Path: {state}/_region/{regionId}/{roadType}.csv (resolved via getDataFilePath → resolveDataUrl)
        autoLoadCrashData(true).catch(e => {
            console.warn('[Tier] Region CSV load failed (data may not be uploaded yet):', e.message);
        });
```

With:

```javascript
        // Region tier: use Supabase matview (pre-aggregated) instead of R2 CSV.
        // Region R2 files can be 300K+ rows which causes browser OOM.
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
        } catch (e) {
            console.warn('[Tier] Region Supabase bridge failed:', e.message);
        }
```

### Fix 1d: Update `handleMPOSelection()` — use Supabase instead of R2

Find the MPO handler (search for `handleMPOSelection`). Replace:

```javascript
        // Load MPO CSV from R2 for detailed analysis tabs
        // Path: {state}/_mpo/{mpoId}/{roadType}.csv (resolved via getDataFilePath → resolveDataUrl)
        autoLoadCrashData(true).catch(e => {
            console.warn('[Tier] MPO CSV load failed (data may not be uploaded yet):', e.message);
        });
```

With:

```javascript
        // MPO tier: use Supabase matview (pre-aggregated) instead of R2 CSV.
        // MPO R2 files can be 300K+ rows which causes browser OOM.
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
            console.log('[Tier] MPO view using Supabase matview (R2 download skipped)');
        } catch (e) {
            console.warn('[Tier] MPO Supabase bridge failed:', e.message);
        }
```

### Fix 1e: Update `handlePlanningDistrictSelection()` — use Supabase instead of R2

Find the PD handler (search for `handlePlanningDistrictSelection`). Replace:

```javascript
        autoLoadCrashData(true).catch(e => {
            console.warn('[Tier] Planning district CSV load failed (data may not be uploaded yet):', e.message);
        });
```

With:

```javascript
        // PD tier: use Supabase matview (pre-aggregated) instead of R2 CSV.
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
            console.log('[Tier] PD view using Supabase matview (R2 download skipped)');
        } catch (e) {
            console.warn('[Tier] PD Supabase bridge failed:', e.message);
        }
```

**NOTE:** Do NOT change `handleCitySelection()` — city data is small enough for R2 (like county). Keep its `autoLoadCrashData(true)` call as-is.

### Fix 1f: Fix `resolveTier()` in `app/modules/data/supabase-bridge.js`

Find `resolveTier()` (around line 42). Change:

```javascript
if (t === 'state' || t === 'federal') return { tier: 'state', value: null };
```

To:

```javascript
if (t === 'federal') return { tier: 'federal', value: null };
if (t === 'state')   return { tier: 'state', value: null };
```

This ensures the federal tier doesn't get a `WHERE state='delaware'` filter when multiple states are onboarded.

### Fix 1g: Remove 'beforeafter' from R2_REQUIRED_TABS in `app/modules/data/lazy-loader.js`

In the `R2_REQUIRED_TABS` Set (around line 26), remove `'beforeafter'` — it's a sub-tab of grants, not a top-level tab ID.

---

## Fix 2: Fix Crash Prediction Tab — Forecast API Routes Never Match

**Problem:** The Prediction tab cannot load forecast data from R2 storage. The server returns 404 for all forecast API calls.

**Root Cause:** Nginx (`nginx.conf` line 63-64) strips the `/api/` prefix when proxying:
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001/;   # trailing slash strips /api/
}
```
So the client calling `GET /api/forecasts/virginia/henrico/county_roads` arrives at the Node.js server as `GET /forecasts/virginia/henrico/county_roads`. But the route matchers in `server/qdrant-proxy.js` still include `/api/` in their regex patterns, so they never match.

**Fixes required in `server/qdrant-proxy.js`:**

1. Find the forecast data endpoint (around line 980). Change the regex from:
   ```js
   req.url.match(/^\/api\/forecasts\/([a-z_]+)\/([a-z_]+)\/([a-z_]+)$/)
   ```
   to:
   ```js
   req.url.match(/^\/forecasts\/([a-z_]+)\/([a-z_]+)\/([a-z_]+)$/)
   ```

2. Find the forecast availability check endpoint (around line 1031). Change the regex from:
   ```js
   req.url.match(/^\/api\/forecasts\/check\/([a-z_]+)\/([a-z_]+)$/)
   ```
   to:
   ```js
   req.url.match(/^\/forecasts\/check\/([a-z_]+)\/([a-z_]+)$/)
   ```

3. **IMPORTANT:** Search the ENTIRE `server/qdrant-proxy.js` file for any other `req.url` route patterns that incorrectly include `/api/` prefix. All routes should match WITHOUT `/api/` since Nginx strips it. The existing working endpoints (`/notify/send`, `/subscribe`, `/health`, etc.) correctly omit it already — use those as the reference pattern.

**Verification:** After the fix, `GET /api/forecasts/virginia/henrico/county_roads` from the browser should return forecast JSON data.

---

## Fix 3: Implement Server-Side Email Scheduling

**Problem:** The Report tab's "Schedule Email" feature saves preferences to browser localStorage only. No server-side mechanism exists to send emails on the configured schedule. The Brevo API key and sender email ARE configured in Coolify (confirmed working).

**What exists today:**
- Client UI: `openEmailNotificationModal()` (app/index.html ~line 33917) — full scheduling config UI
- Client save: `saveNotificationPreferences()` (~line 33807) — saves to localStorage only
- Server send: `POST /notify/send` endpoint (qdrant-proxy.js ~line 267) — works, uses Brevo API
- Server send function: `sendViaBrevoApi()` (~line 139) — works when BREVO_API_KEY is set
- Test button: `testEmailNotification()` (~line 35357) — calls `/api/notify/send`, should work
- GitHub Actions: `send-notifications.yml` — separate cron system, disconnected from UI preferences

**Fixes required:**

### Step 1: Add schedule CRUD endpoints to `server/qdrant-proxy.js`

Add these routes (remember: NO `/api/` prefix since Nginx strips it):

```
POST /schedule/save     — Save/update a user's email schedule
GET  /schedule/list     — List active schedules for a user
DELETE /schedule/:id    — Delete a schedule
```

Store schedules in Firestore under `users/{uid}/emailSchedules/{scheduleId}`. Firebase Admin SDK is already initialized in the server for Stripe webhook processing — reuse that. Each schedule document should contain:
```json
{
  "enabled": true,
  "recipients": ["user@example.com"],
  "reportType": "comprehensive",
  "frequency": "weekly",
  "dayOfWeek": 1,
  "dayOfMonth": null,
  "time": "08:00",
  "timezone": "America/New_York",
  "jurisdiction": "henrico",
  "state": "virginia",
  "agency": "Henrico County",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp",
  "lastSentAt": null,
  "nextRunAt": "ISO timestamp"
}
```

Authenticate requests using Firebase ID token in the `Authorization: Bearer <token>` header (use `admin.auth().verifyIdToken()`).

### Step 2: Add server-side scheduler using `node-cron`

1. Add `node-cron` to `server/package.json` dependencies
2. On server startup, register a master cron job that runs every minute
3. Each minute, query Firestore for schedules where `enabled: true` and `nextRunAt <= now`
4. For each matching schedule:
   a. Send email using existing `sendViaBrevoApi()` with a professional HTML email body containing a link to open Crash Lens for the jurisdiction (full PDF generation can be a follow-up — for now send an email with key stats if available, plus a "View Full Report in CRASH LENS" button linking to `https://crashlens.aicreatesai.com/app`)
   b. Update `lastSentAt` to now
   c. Calculate and update `nextRunAt` based on frequency/day/time/timezone
5. Add error handling and logging so failed sends don't block other schedules
6. Cache loaded schedules in memory with a 5-minute TTL to avoid hammering Firestore every minute

### Step 3: Update client-side to sync with server

In `app/index.html`, update `saveNotificationPreferences()` (~line 33807) to:

1. Continue saving to localStorage (for immediate UI state)
2. Also call `POST /api/schedule/save` with the schedule config
3. Include the Firebase auth token: `await firebase.auth().currentUser.getIdToken()`
4. Show success toast: "Schedule saved — emails will be sent automatically"
5. Show error toast if the server call fails (but don't block the localStorage save)
6. When the modal opens, also load from server via `GET /api/schedule/list` and merge with localStorage data (server is source of truth)

### Step 4: Update Dockerfile if needed

If `node-cron` requires adding to dependencies, make sure the Docker build process runs `npm install` in the server directory. Check the existing `Dockerfile` for how server dependencies are installed and follow the same pattern.

---

## Verification Checklist

- [ ] **OOM Fix:** Click State view — dashboard renders from Supabase, no R2 download, no crash
- [ ] **OOM Fix:** Click Region, MPO, Planning District — same, no R2 download
- [ ] **OOM Fix:** County and City views still download R2 and work normally
- [ ] **OOM Fix:** Federal tier uses Supabase without state filter
- [ ] **Forecast:** `GET /api/forecasts/virginia/henrico/county_roads` returns JSON
- [ ] **Forecast:** Forecast availability check returns correct status
- [ ] **Email:** Schedule save persists to Firestore
- [ ] **Email:** Test email sends successfully via "Send Test" button
- [ ] **No regressions:** Existing endpoints still work (`/notify/send`, `/notify/status`, Stripe, Qdrant)
- [ ] **No regressions:** Lazy loader still works for detail tabs (Analysis, Hotspots, etc.)
