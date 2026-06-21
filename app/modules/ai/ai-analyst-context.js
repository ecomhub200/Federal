/**
 * CL ai.analystContext — extracted from app/index.html (name-anchored,
 * live L65690-L65976). navigateTo-split round, prompt 40c3(a).
 * Responsibility: AI Analyst context — system prompt builder, multi-source
 * context picker (drawing/map/CMF/warrants/county-wide), context indicator.
 *
 * Reads shared inline globals (top-level consts) — resolved via shared
 * classic-script global lexical env, NOT mirrored:
 *   selectedCrashesFromDrawing (`typeof` guarded), selectionState, cmfState,
 *   warrantsState, crashState, EPDO_WEIGHTS, getJurisdictionStateLabel,
 *   getJurisdictionLabel, buildLocationCrashProfile, buildCountyWideCrashProfile,
 *   CL.ai.context.buildLocationCrashContext (off-limits module ref),
 *   updateMUTCDAILocationBar (still inline — 40c3(b) deferred).
 *
 * Public API mirrors (all 4 fns):
 *   - window.buildSystemPrompt (called by askAI L66104)
 *   - window.getAIAnalysisContext (many inline callers + tab-dispatcher,
 *     epdo-presets modules)
 *   - window.buildLocationCrashContext (inline caller L66114)
 *   - window.updateAIContextIndicator (many inline callers + module callers)
 *
 * Naming note: the moved global `buildLocationCrashContext` is the inline
 * 1-line wrapper that delegates to `CL.ai.context.buildLocationCrashContext`
 * (off-limits method on the `ai/context.js` object). They are NAME-DIFFERENT
 * at runtime (global fn vs method on CL.ai.context object) — no R1 collision.
 */
(function () {
  'use strict';
  window.CL = window.CL || {};
  CL.ai = CL.ai || {};

  // ─── EXTRACTED CODE START (verbatim from index.html L65690-L65976) ───
function buildSystemPrompt() {
    return `You are an expert Traffic Safety & MUTCD AI Assistant for ${getJurisdictionStateLabel()}. You combine crash data analysis expertise with comprehensive knowledge of the MUTCD (Manual on Uniform Traffic Control Devices).

## YOUR DUAL EXPERTISE:

**1. CRASH DATA ANALYSIS:**
- Analyze crash patterns and trends
- Identify high-risk locations and contributing factors
- Calculate severity metrics (K+A crashes, EPDO scores)
- Provide evidence-based countermeasure recommendations
- Prioritize by severity (fatal/serious injury first)

**2. VIRGINIA MUTCD STANDARDS:**
- Traffic signal warrants (Chapter 4C) - especially Warrant 7 (Crash Experience)
- Sign requirements - regulatory, warning, and guide signs (Part 2)
- Pavement markings and crosswalks (Part 3)
- Pedestrian facilities - PHB, RRFB, APS (Chapters 4I, 4J, 4K, 4L)
- Bicycle facilities (Part 9)
- School zones (Part 7)
- Signal timing and phases (Chapters 4D, 4F)

## REQUIREMENT LEVELS - CRITICAL DISTINCTION:
When citing MUTCD requirements, you MUST clearly identify the requirement level using these exact terms:

| Level | Keyword | Meaning | User Action |
|-------|---------|---------|-------------|
| **STANDARD** | SHALL, SHALL NOT, REQUIRED, MUST | Mandatory - legally binding | Must comply |
| **GUIDANCE** | SHOULD, SHOULD NOT, RECOMMENDED | Advisory - follow unless engineering judgment supports alternative | Follow unless justified |
| **OPTION** | MAY, MAY NOT | Permissive - discretionary | Engineer's choice |
| **SUPPORT** | (no keyword) | Informational background | Reference only |

Always use **bold** when stating the requirement level in your response (e.g., "This is a **STANDARD** requirement...").

## CITATION FORMAT - REQUIRED STRUCTURE:
When referencing MUTCD content, use this consistent format:

**For inline citations:**
"[Requirement text summary]" (Virginia MUTCD Section X.XX, Paragraph XX, **[STANDARD/GUIDANCE/OPTION]**)

**For detailed references, include a citation block:**
> **MUTCD Reference**
> - Section: [Chapter.Section] (e.g., 4C.08)
> - Paragraph: [Number] (e.g., 01, 02A, 03B)
> - Requirement Level: **[STANDARD/GUIDANCE/OPTION]**
> - Key Language: "[Exact key phrase with SHALL/SHOULD/MAY preserved]"

**Example citation:**
> **MUTCD Reference**
> - Section: 4C.08 (Warrant 7 - Crash Experience)
> - Paragraph: 01
> - Requirement Level: **GUIDANCE**
> - Key Language: "The Crash Experience signal warrant **SHOULD** be applied..."

## WHEN PROVIDING MUTCD GUIDANCE:
1. Always cite the specific section AND paragraph number (e.g., "Section 4C.08, Paragraph 02")
2. State the requirement level prominently using **bold** formatting
3. Preserve key MUTCD terminology (SHALL, SHOULD, MAY) exactly as written
4. Note Virginia-specific supplements when applicable (VA differs from federal MUTCD)
5. Connect recommendations to the crash data patterns

## SIGNAL WARRANT 7 (Crash Experience) - Key Thresholds:
- 4-leg intersection: 5 angle+ped crashes/year OR 3 fatal+injury crashes/year
- 3-leg intersection: 4 angle+ped crashes/year OR 3 fatal+injury crashes/year
- Must also meet minimum volume requirements (80% of Warrant 1 volumes)

## YOUR RESPONSES SHOULD BE:
- Professional and data-driven
- Formatted with clear structure using **bold** for emphasis
- Include specific numbers and percentages from the data
- Cite MUTCD sections with paragraph numbers when discussing standards
- Clearly state requirement levels (STANDARD/GUIDANCE/OPTION)
- Provide actionable, implementable recommendations

## FOR IMAGE ANALYSIS:
- Describe what you observe in the image
- Identify potential safety issues and MUTCD compliance concerns
- Suggest improvements based on both crash data and MUTCD requirements
- Reference specific MUTCD sections that apply

## IMPORTANT VERIFICATION NOTICE:
Always include this guidance when providing detailed MUTCD citations:
"For official compliance decisions, verify this reference against the current Virginia MUTCD at: https://www.virginiadot.org/business/locdes/rdmanual-index.asp"

This is especially important because:
- AI may paraphrase rather than quote verbatim
- MUTCD updates may have occurred since training data
- Virginia supplements may differ from federal MUTCD
- Local jurisdiction policies may add requirements

Always maintain a helpful, professional tone appropriate for government traffic engineering work.`;
}

// ============================================================
// AI CONTEXT AWARENESS - Detect and use location-specific data
// ============================================================

/**
 * Get the current AI analysis context - either location-specific or county-wide
 * This ensures the AI receives the same data as other tabs when a location is selected
 * Uses timestamps to prioritize the MOST RECENT selection across all sources
 */
function getAIAnalysisContext() {
    // Build list of available selections with timestamps for priority ordering
    const selections = [];

    // Check for polygon/drawing selection (selectedCrashesFromDrawing)
    if (typeof selectedCrashesFromDrawing !== 'undefined' && selectedCrashesFromDrawing.length > 0) {
        // Get timestamp from selectionState if it was a map drawing selection
        const drawingTimestamp = (selectionState.fromTab === 'map-drawing') ?
            selectionState.timestamp : Date.now();
        selections.push({
            type: 'drawing',
            timestamp: drawingTimestamp,
            getData: () => {
                // Build crash profile from drawing selection
                const crashes = selectedCrashesFromDrawing;
                const profile = {
                    total: crashes.length,
                    K: 0, A: 0, B: 0, C: 0, O: 0, epdo: 0,
                    collisionTypes: {}, factors: {}, lightConditions: {}, weatherConditions: {}
                };
                crashes.forEach(c => {
                    profile[c.sev] = (profile[c.sev] || 0) + 1;
                    profile.epdo += EPDO_WEIGHTS[c.sev] || 0;
                    // Count collision types, weather, light from map point data
                    if (c.collision) profile.collisionTypes[c.collision] = (profile.collisionTypes[c.collision] || 0) + 1;
                    if (c.weather) profile.weatherConditions[c.weather] = (profile.weatherConditions[c.weather] || 0) + 1;
                    if (c.light) profile.lightConditions[c.light] = (profile.lightConditions[c.light] || 0) + 1;
                });
                return {
                    mode: 'location',
                    source: 'Map Drawing',
                    locationName: `Map Selection (${crashes.length} crashes)`,
                    crashes: crashes,
                    crashCount: crashes.length,
                    dateRange: null,
                    profile: profile
                };
            }
        });
    }

    // Check for map dropdown selection (selectionState with fromTab === 'map')
    if (selectionState.location && selectionState.crashes && selectionState.crashes.length > 0 &&
        selectionState.fromTab === 'map') {
        selections.push({
            type: 'map',
            timestamp: selectionState.timestamp || 0,
            getData: () => ({
                mode: 'location',
                source: 'Map',
                locationName: selectionState.location,
                crashes: selectionState.crashes,
                crashCount: selectionState.crashes.length,
                dateRange: null,
                profile: selectionState.crashProfile || buildLocationCrashProfile(selectionState.crashes)
            })
        });
    }

    // Check CMF tab selection
    if (cmfState.selectedLocation &&
        (cmfState.locationCrashes.length > 0 || cmfState.filteredCrashes.length > 0)) {
        selections.push({
            type: 'cmf',
            timestamp: cmfState.selectionTimestamp || 0,
            getData: () => {
                const crashes = cmfState.filteredCrashes.length > 0 ? cmfState.filteredCrashes : cmfState.locationCrashes;
                const locationName = cmfState.selectedLocation.name || cmfState.selectedLocation;
                const hasDateFilter = cmfState.dateFilter?.startDate || cmfState.dateFilter?.endDate;
                const dateRange = hasDateFilter ?
                    `${cmfState.dateFilter.startDate || 'start'} to ${cmfState.dateFilter.endDate || 'end'}` : null;
                return {
                    mode: 'location',
                    source: 'CMF',
                    locationName: locationName,
                    crashes: crashes,
                    crashCount: cmfState.aggregateCount || crashes.length,
                    dateRange: dateRange,
                    profile: cmfState.crashProfile || buildLocationCrashProfile(crashes)
                };
            }
        });
    }

    // Check other selectionState sources (hotspots, etc.) - but not map since we handle that separately
    if (selectionState.location && selectionState.crashes && selectionState.crashes.length > 0 &&
        selectionState.fromTab && selectionState.fromTab !== 'map') {
        selections.push({
            type: 'selection',
            timestamp: selectionState.timestamp || 0,
            getData: () => ({
                mode: 'location',
                source: selectionState.fromTab || 'Selection',
                locationName: selectionState.location,
                crashes: selectionState.crashes,
                crashCount: selectionState.crashes.length,
                dateRange: null,
                profile: selectionState.crashProfile || buildLocationCrashProfile(selectionState.crashes)
            })
        });
    }

    // Check Warrants tab selection
    if (warrantsState.selectedLocation &&
        (warrantsState.locationCrashes.length > 0 || warrantsState.filteredCrashes.length > 0)) {
        selections.push({
            type: 'warrants',
            timestamp: warrantsState.selectionTimestamp || 0,
            getData: () => {
                const crashes = warrantsState.filteredCrashes.length > 0 ? warrantsState.filteredCrashes : warrantsState.locationCrashes;
                const locationName = warrantsState.selectedLocation.name || warrantsState.selectedLocation;
                const hasDateFilter = warrantsState.dateFilter?.startDate || warrantsState.dateFilter?.endDate;
                const dateRange = hasDateFilter ?
                    `${warrantsState.dateFilter.startDate || 'start'} to ${warrantsState.dateFilter.endDate || 'end'}` : null;
                return {
                    mode: 'location',
                    source: 'Warrants',
                    locationName: locationName,
                    crashes: crashes,
                    crashCount: crashes.length,
                    dateRange: dateRange,
                    profile: warrantsState.crashProfile || buildLocationCrashProfile(crashes)
                };
            }
        });
    }

    // Sort by timestamp (most recent first) and return the most recent selection
    if (selections.length > 0) {
        selections.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        console.log('[AI Context] Using most recent selection:', selections[0].type, 'timestamp:', selections[0].timestamp);
        const result = selections[0].getData();

        return result;
    }

    // No location selected - use county-wide data
    if (crashState.loaded) {
        return {
            mode: 'countywide',
            source: 'All Data',
            locationName: getJurisdictionLabel(),
            crashes: null,  // Don't send all raw crashes - use aggregates
            crashCount: crashState.totalRows,
            dateRange: crashState.years.length > 0 ? `${crashState.years[0]}-${crashState.years[crashState.years.length-1]}` : null,
            profile: buildCountyWideCrashProfile()
        };
    }

    return null;  // No data loaded
}

/**
 * Build location-specific crash context for AI
 */
function buildLocationCrashContext(context) {
    return CL.ai.context.buildLocationCrashContext(context);
}

/**
 * Update the AI context indicator in the UI
 */
function updateAIContextIndicator() {
    const indicator = document.getElementById('aiContextIndicator');
    if (!indicator) return;

    const context = getAIAnalysisContext();

    if (!context) {
        indicator.innerHTML = '<span style="color:var(--gray)">📊 No data loaded</span>';
        indicator.style.display = 'inline-flex';
        return;
    }

    if (context.mode === 'location') {
        const dateInfo = context.dateRange ? ` (${context.dateRange})` : '';
        indicator.innerHTML = `<span style="color:#059669">📍 Analyzing: <strong>${context.locationName}</strong> (${context.crashCount} crashes)${dateInfo}</span>`;
        indicator.title = `Location-specific analysis from ${context.source} tab`;
    } else {
        indicator.innerHTML = `<span style="color:#2563eb">🗺️ Analyzing: <strong>All ${getJurisdictionLabel()}</strong> (${context.crashCount.toLocaleString()} crashes)</span>`;
        indicator.title = 'County-wide analysis - select a location in CMF or Warrants tab for location-specific analysis';
    }

    indicator.style.display = 'inline-flex';
    updateMUTCDAILocationBar();
}
  // ─── EXTRACTED CODE END ───

  // Public API — dual exposure
  window.buildSystemPrompt = buildSystemPrompt;                   CL.ai.buildSystemPrompt = buildSystemPrompt;
  window.getAIAnalysisContext = getAIAnalysisContext;             CL.ai.getAIAnalysisContext = getAIAnalysisContext;
  window.buildLocationCrashContext = buildLocationCrashContext;   CL.ai.buildLocationCrashContext = buildLocationCrashContext;
  window.updateAIContextIndicator = updateAIContextIndicator;     CL.ai.updateAIContextIndicator = updateAIContextIndicator;

  CL._registerModule('ai/ai-analyst-context');
})();
