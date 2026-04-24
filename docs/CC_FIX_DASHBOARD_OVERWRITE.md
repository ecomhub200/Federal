# Claude Code Fix Prompt — Dashboard Overwrite + Road Type Default + Progressive UI

Copy everything below the line and paste it into Claude Code:

---

Read `CLAUDE.md` first for full project context. Create a single PR for all fixes (never push directly to main).

## Background — What the Previous PR Fixed vs What's Still Broken

The previous PR (`claude/fix-supabase-bridge-race`) correctly fixed the Supabase bridge race condition — `injectFastDashboard({ force: true })` now fetches and paints statewide data (569,829 crashes). **However, the painted KPIs are immediately overwritten by `updateDashboard()` which reads from `crashState.aggregates` — still populated with Sussex County data (87,073).**

This is why the user sees Sussex County numbers in State view despite the Supabase bridge having correctly fetched statewide data.

### Bug Flow (What Happens Now)

1. User loads County view (Sussex) → R2 downloads 87K rows → `crashState.aggregates` = Sussex stats → `updateDashboard()` paints KPIs with 87,073 ✓
2. User clicks **State** → `handleTierChange('state')` runs:
   - Previous PR resets `crashState.loaded = false; sampleRows = []; mapPoints = [];` ✓
   - `injectFastDashboard({ force: true })` → fetches Supabase → paints KPIs with **569,829** ✓
   - Sets `crashState.loaded = true`
3. Then `showTab('dashboard')` is called (from STEP 0b at ~line 32076, or from showTab at ~line 30880)
4. `showTab('dashboard')` sees `crashState.loaded === true` → calls **`updateDashboard()`** (line ~30881)
5. `updateDashboard()` → `getFilteredStats()` → returns **`crashState.aggregates`** ← still Sussex County's 87,073!
6. `updateDashboard()` overwrites ALL KPIs → user sees **87,073** instead of 569,829 ✗

---

## Fix 1 (CRITICAL): Guard `updateDashboard()` for Aggregate Tiers

**File:** `app/index.html`

Find `function updateDashboard()` (around line 46829):

```javascript
function updateDashboard() {
    if (!crashState.loaded) return;
```

Change to:

```javascript
function updateDashboard() {
    if (!crashState.loaded) return;

    // For aggregate tiers (State/Federal/Region/MPO/PD), the Supabase bridge
    // paints KPIs directly from the matview — crashState.aggregates still has
    // stale county data from a prior R2 load. Skip the R2-based repaint.
    const _AGG_TIERS = new Set(['federal', 'state', 'region', 'mpo', 'planning_district']);
    const _curTier = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext)
        ? (jurisdictionContext.viewTier || 'county') : 'county';
    if (_AGG_TIERS.has(_curTier) && (!crashState.sampleRows || crashState.sampleRows.length === 0)) {
        console.log('[Dashboard] Skipping R2-based repaint for aggregate tier:', _curTier);
        return;
    }
```

**Why this works:** For aggregate tiers, the previous PR already clears `crashState.sampleRows = []`. No R2 data means nothing to paint from. The Supabase bridge's paint is authoritative. For County/City tiers, sampleRows IS populated from R2, so `updateDashboard()` runs normally.

## Fix 2: Clear `crashState.aggregates` When Switching to Aggregate Tiers

**File:** `app/index.html`

In ALL 5 aggregate-tier code paths (from the previous PR), the reset block currently does:

```javascript
crashState.loaded = false;
crashState.sampleRows = [];
crashState.mapPoints = [];
```

Change EACH occurrence to:

```javascript
crashState.loaded = false;
crashState.sampleRows = [];
crashState.mapPoints = [];
crashState.aggregates = {};
crashState.totalRows = 0;
```

These 5 locations are:

1. **`handleTierChange()`** — inside `if (tier === 'state' || tier === 'federal')` block
2. **`handleRegionSelection()`** — inside the Supabase bridge try block
3. **`handleMPOSelection()`** — inside the Supabase bridge try block
4. **`handlePlanningDistrictSelection()`** — inside the Supabase bridge try block
5. **STEP 0b in `autoLoadCrashData()`** — inside the `AGGREGATE_TIERS.has(tier)` block

Search for all 5 occurrences of the pattern `crashState.sampleRows = [];` that are followed by `crashState.mapPoints = [];` and add the two extra lines after mapPoints.

## Fix 3: Guard `showTab('dashboard')` Call to `updateDashboard()`

**File:** `app/index.html`

Find this block in the `showTab()` function (around line 30880):

```javascript
    if (tabId === 'dashboard' && crashState.loaded) {
        updateDashboard();
```

Change to:

```javascript
    if (tabId === 'dashboard' && crashState.loaded) {
        // updateDashboard() reads crashState.aggregates which may contain stale
        // county data. The guard inside updateDashboard (Fix 1) handles this,
        // but call it unconditionally — the guard will skip when appropriate.
        updateDashboard();
```

Actually, Fix 1's guard inside `updateDashboard()` itself is sufficient. No change needed here — the guard catches ALL callers. **Skip this fix — Fix 1 handles it.**

## Fix 4 (CRITICAL): Road Type — Default to "All Roads" and Show Correct Controls Per Tier

### Fix 4a: Change default checked radio to "All Roads"

**File:** `app/index.html`

Find the road type radio buttons (around line 4918). The `countyOnly` radio currently has `checked`:

```html
<input type="radio" name="roadTypeFilter" id="filterCountyOnly" value="countyOnly" checked onchange="saveFilterProfile()" style="accent-color:#0ea5e9">
```

Remove `checked` from `filterCountyOnly` and add it to `filterAllRoads`:

```html
<input type="radio" name="roadTypeFilter" id="filterCountyOnly" value="countyOnly" onchange="saveFilterProfile()" style="accent-color:#0ea5e9">
```

And change (around line 4930):

```html
<input type="radio" name="roadTypeFilter" id="filterAllRoads" value="allRoads" onchange="saveFilterProfile()" style="accent-color:#0ea5e9">
```

To:

```html
<input type="radio" name="roadTypeFilter" id="filterAllRoads" value="allRoads" checked onchange="saveFilterProfile()" style="accent-color:#0ea5e9">
```

### Fix 4b: Ensure "All Roads" is selected on every tier change

**File:** `app/index.html`

At the END of the `updateRoadTypeLabels(tier)` function (around line 24249, before the closing `}`), add:

```javascript
    // Always default to "All Roads" when switching tiers
    const allRoadsRadio = document.getElementById('filterAllRoads');
    if (allRoadsRadio && !allRoadsRadio.checked) {
        allRoadsRadio.checked = true;
        console.log(`[RoadType] Defaulted to All Roads for tier: ${tier}`);
    }
```

### Fix 4c: Progressive disclosure — show only relevant controls per tier

**File:** `app/index.html`

At the END of `handleTierChange(tier)` (right before the `document.dispatchEvent(new CustomEvent('tierChanged'...))` line), add:

```javascript
        // ── Progressive disclosure: show/hide controls based on tier ──
        const AGGREGATE_VIEW_TIERS = new Set(['federal', 'state', 'region', 'mpo', 'planning_district']);
        const countyJurisdictionSelect = document.getElementById('jurisdictionSelect');
        const roadTypeContainer = document.querySelector('.radio-item')?.closest('.filter-group')
            || document.getElementById('filterCountyOnly')?.closest('div[style*="flex-direction:column"]')?.parentElement;
        
        if (AGGREGATE_VIEW_TIERS.has(tier)) {
            // Hide county/jurisdiction dropdown for aggregate tiers
            if (countyJurisdictionSelect) {
                const jWrapper = countyJurisdictionSelect.closest('.filter-group') || countyJurisdictionSelect.parentElement;
                if (jWrapper) jWrapper.style.display = 'none';
            }
            // Hide road type filter for aggregate tiers (always uses All Roads from Supabase)
            if (roadTypeContainer) roadTypeContainer.style.display = 'none';
        } else {
            // Show county/jurisdiction dropdown for county/city tiers
            if (countyJurisdictionSelect) {
                const jWrapper = countyJurisdictionSelect.closest('.filter-group') || countyJurisdictionSelect.parentElement;
                if (jWrapper) jWrapper.style.display = '';
            }
            // Show road type filter for county/city tiers
            if (roadTypeContainer) roadTypeContainer.style.display = '';
        }
```

**IMPORTANT:** The DOM selectors above may not perfectly match the actual HTML structure. Before implementing, inspect the actual DOM structure around the jurisdiction dropdown and road type filter. The key IDs to look for are:
- Jurisdiction dropdown: `id="jurisdictionSelect"` (find the actual ID by searching for `Select County/Jurisdiction`)
- Road type container: look for the parent div that wraps all 4 radio labels with `name="roadTypeFilter"`
- Also look for the `Locked — State view` badge and REMOVE it — it's no longer needed since we're hiding the dropdown entirely

Search for the actual element IDs:
```
grep -n "jurisdictionSelect\|countySelect\|Select County" app/index.html | head -20
```

### Fix 4d: Update the "Current:" status line

**File:** `app/index.html`

Search for the element that shows `Current: Sussex County | All Roads (Including Interstate)` (the status bar below the EPDO section). When an aggregate tier is selected, this should show the tier scope instead of the county name. Search for `Current:` and update the logic:

```javascript
// When updating the "Current:" display, check the tier:
const AGGREGATE = new Set(['federal', 'state', 'region', 'mpo', 'planning_district']);
const vt = jurisdictionContext.viewTier || 'county';
if (AGGREGATE.has(vt)) {
    // Show tier-appropriate scope
    let scopeLabel = '';
    if (vt === 'federal') scopeLabel = 'Federal (All States)';
    else if (vt === 'state') scopeLabel = (jurisdictionContext.stateName || 'Statewide');
    else if (vt === 'region') scopeLabel = (jurisdictionContext.tierRegion?.name || 'Region');
    else if (vt === 'mpo') scopeLabel = (jurisdictionContext.tierMpo?.name || 'MPO');
    else if (vt === 'planning_district') scopeLabel = (jurisdictionContext.tierPlanningDistrict?.name || 'Planning District');
    currentDisplay.textContent = `Current: ${scopeLabel} | All Roads`;
}
```

---

## Fix 5: Uniform Road Type Labels Across All Tiers

**File:** `app/index.html`

The `updateRoadTypeLabels()` function (line ~24208) has tier-specific label configs. For simplicity and consistency, make ALL tiers use the same labels. Replace the entire `labelConfigs` object:

```javascript
    const labelConfigs = {
        _default: {
            countyOnly:      '<strong>County Roads Only</strong> - County-maintained roads',
            cityOnly:        '<strong>City Roads Only</strong> - City/town agency roads',
            countyPlusVDOT:  '<strong>All Roads (No Interstate)</strong> - Includes state routes',
            allRoads:        '<strong>All Roads</strong> - Including interstates'
        }
    };
```

Remove the `state`, `federal`, and `region` keys. All tiers use `_default`. The tier-specific labels ("DOT Roads Only", "Statewide All Roads", "Non-DOT Roads") were confusing users — the underlying data split is the same regardless of tier, and for aggregate tiers the road type filter is hidden anyway (Fix 4c).

---

## Verification Checklist

- [ ] **Fix 1:** Load County (Sussex) → shows 87,073. Switch to State → shows **569,829** (not 87,073)
- [ ] **Fix 2:** `crashState.aggregates` is empty `{}` after switching to State view
- [ ] **Fix 4a:** On fresh page load, "All Roads" radio is checked by default (not "County Roads Only")
- [ ] **Fix 4b:** After every tier switch, "All Roads" is auto-selected
- [ ] **Fix 4c:** State view → county dropdown and road type filter are hidden
- [ ] **Fix 4c:** County view → county dropdown and road type filter are visible
- [ ] **Fix 4c:** Region view → county dropdown hidden, region dropdown visible
- [ ] **Fix 4d:** "Current:" status shows "Delaware (Statewide) | All Roads" for State view
- [ ] **Fix 5:** Road type labels are consistent across all tiers
- [ ] Switch State → Region → MPO → PD → County → City — each shows correct data
- [ ] No "Page Unresponsive" dialog
- [ ] County/City views still load R2 data normally
- [ ] Console shows `[Dashboard] Skipping R2-based repaint for aggregate tier: state`
