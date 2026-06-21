/**
 * CL grants.ui module
 *
 * Extracted from app/index.html (block L37263-L39447, 2185 lines) on 2026-05-16.
 * Round X modular refactor — see modular-prompts/30-grants-grants-ui.md.
 * Responsibility: Grants tab UI — application/help modals, grant program
 * dropdown + writing context, AI system-prompt builders, and the 4-agent
 * grant-analysis orchestration + PDF/Word export.
 *
 * Public API (back-compat dual exposure):
 *   - window.scrollToGrantSearch → CL.grants.ui.scrollToGrantSearch
 *   - window.populateGrantProgramDropdown → CL.grants.ui.populateGrantProgramDropdown
 *   - window.getGrantAISystemPrompt → CL.grants.ui.getGrantAISystemPrompt
 *   - window.runGrant4AgentAnalysis → CL.grants.ui.runGrant4AgentAnalysis
 *   - window.updateGrantProgramUI → CL.grants.ui.updateGrantProgramUI
 *   (all 36 extracted decls were top-level/global before extraction and are
 *    mirrored to window verbatim to preserve zero behavior change.)
 *
 * Note: prompts 27/28/29 (grants-rank/ai/email) have NOT run; those helpers
 * plus grantState and the grant*Attachments vars remain inline/global in
 * index.html. This module only calls them at runtime (after the inline
 * script executes), so loading right after
 * <script src="modules/grants/ranking.js"> is behavior-safe.
 */
(function(){
  'use strict';

function runFullAnalysis() {
    if (grantState.selectedLocationIndices.length === 0) {
        alert('Please select at least one location first.');
        return;
    }
    generateAppPreview();
    document.querySelector('.app-builder-grid').scrollIntoView({ behavior: 'smooth' });
}

function scrollToGrantSearch() {
    document.getElementById('grantSearchMessages').scrollIntoView({ behavior: 'smooth' });
}

function scrollToWritingAssistant() {
    document.getElementById('grantWritingMessages').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// MY APPLICATIONS - MANAGEMENT & EXPORT
// ============================================================

/**
 * Round 14 §5 — Populate the New Application "Grant Program" dropdown from
 * the grant_programs lookup table (federal-scope OR matching the active
 * state). State-agnostic — adding a new state means INSERTing rows in the
 * database, never a code branch. Returns a Promise that resolves when the
 * dropdown is populated.
 */
async function populateGrantProgramDropdown(selectId = 'newAppGrant') {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    if (!window.crashLensClient || typeof window.crashLensClient.getGrantPrograms !== 'function') return;

    const stateKey = (window.crashLensClient.state || '').toLowerCase();
    let programs = null;
    try {
        programs = await window.crashLensClient.getGrantPrograms({ state: stateKey });
    } catch (e) {
        console.warn('[Grants] populateGrantProgramDropdown failed:', e && e.message);
        return;
    }
    if (!Array.isArray(programs) || programs.length === 0) {
        // Backend returned nothing — leave the existing hard-coded options in place.
        return;
    }
    const escapeHtml = (s) => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const buildOpt = (p) => {
        const opt = document.createElement('option');
        opt.value = p.program_id || p.id || p.program_name;
        const fed = p.federal_share_pct ? ' (' + p.federal_share_pct + '% federal)' : '';
        opt.textContent = (p.program_name || 'Program') + fed;
        if (p.agency)             opt.dataset.agency   = p.agency;
        if (p.max_award_amount)   opt.dataset.maxAward = p.max_award_amount;
        if (p.typical_deadline)   opt.dataset.deadline = p.typical_deadline;
        if (p.scope)              opt.dataset.scope    = p.scope;
        return opt;
    };
    const federal = programs.filter(p => p.scope === 'federal');
    const stateP  = programs.filter(p => p.scope === 'state');
    sel.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '-- Select Grant Program --';
    sel.appendChild(placeholder);
    if (federal.length) {
        const g = document.createElement('optgroup');
        g.label = '🇺🇸 Federal Programs';
        federal.forEach(p => g.appendChild(buildOpt(p)));
        sel.appendChild(g);
    }
    if (stateP.length) {
        const g = document.createElement('optgroup');
        g.label = '🏛️ State Programs';
        stateP.forEach(p => g.appendChild(buildOpt(p)));
        sel.appendChild(g);
    }
}

/**
 * Round 14 §5 — Build a crash-context bundle from the user's currently
 * checked rows in the Grant-Ready table. Used to enrich AI grant-writing
 * prompts with hard data (location names, crash counts, top collision types,
 * VRU exposure). Returns null when no row is checked.
 */
async function buildGrantWritingContext() {
    if (!window.crashLensClient || typeof window.crashLensClient.getHotspotDetail !== 'function') {
        return null;
    }
    const stateKey = (window.crashLensClient.state || '').toLowerCase();
    // Pull from the authoritative selection state used by the Grant-Ready table.
    const indices = (typeof grantState !== 'undefined' && Array.isArray(grantState.selectedLocationIndices))
        ? grantState.selectedLocationIndices : [];
    if (!indices.length) return null;
    const all = (grantState && grantState.rankedLocations) || [];
    const picked = indices.map(i => all[i]).filter(Boolean);
    if (!picked.length) return null;

    const details = await Promise.all(picked.map(loc => {
        const t = loc.type === 'intersection' ? 'intersection' : 'segment';
        return window.crashLensClient.getHotspotDetail(stateKey, t, loc.name)
            .then(r => Array.isArray(r) ? r[0] : r)
            .catch(() => null);
    }));

    return {
        state: stateKey,
        locations: picked.map((loc, i) => {
            const d = details[i] || {};
            const byColl = d.by_collision || {};
            const top = Object.entries(byColl).sort((a, b) => Number(b[1]) - Number(a[1]))[0];
            return {
                name:           loc.name,
                type:           loc.type,
                display_name:   d.display_name || loc.name,
                total:          d.total != null ? d.total : (loc.crashes || 0),
                k:              d.k != null ? d.k : (loc.K || 0),
                a:              d.a != null ? d.a : (loc.A || 0),
                ped_count:      d.ped_count  || loc.ped  || 0,
                bike_count:     d.bike_count || loc.bike || 0,
                top_collision:  top ? top[0] : 'unknown',
            };
        }),
    };
}

function openNewAppModal() {
    const locationSelect = document.getElementById('newAppLocation');

    // Round 14 §5 — populate the Grant Program dropdown from grant_programs
    // (federal + active-state scope). Awaiting is not necessary: the modal
    // shows immediately and the dropdown fills as the request returns.
    if (typeof populateGrantProgramDropdown === 'function') {
        populateGrantProgramDropdown('newAppGrant').catch(e => {
            console.warn('[Grants] program dropdown populate failed:', e && e.message);
        });
    }


    // Round 13 — Supabase-backed picker. Falls back to the legacy ranked-list
    // when LocationPicker isn't loaded (file:// reviews, hard caching).
    if (window.LocationPicker && window.crashLensClient && window.crashLensClient.preferSupabase) {
        window.LocationPicker.register('newAppLocation', {
            placeholder: 'Select Location...',
            locationType: null,
            useOptgroups: true,
            showCrashCount: true,
            onPopulated: function () {
                // Pre-select the first checked row from the Grant-Ready table if any
                if (grantState.selectedLocationIndices && grantState.selectedLocationIndices.length > 0) {
                    const firstSelected = grantState.rankedLocations[grantState.selectedLocationIndices[0]];
                    if (firstSelected) {
                        const opt = Array.from(locationSelect.options).find(function (o) {
                            return o.value && o.value.split(':').pop() === firstSelected.name;
                        });
                        if (opt) locationSelect.value = opt.value;
                    }
                }
            }
        });
        document.getElementById('newAppModal').classList.add('visible');
        return;
    }

    locationSelect.innerHTML = '<option value="">Select Location...</option>';

    if (grantState.rankedLocations && grantState.rankedLocations.length > 0) {
        grantState.rankedLocations.forEach((loc, idx) => {
            locationSelect.innerHTML += `<option value="${loc.name}">${loc.name} (${loc.crashes} crashes)</option>`;
        });
    }

    if (grantState.selectedLocationIndices.length > 0) {
        const firstSelected = grantState.rankedLocations[grantState.selectedLocationIndices[0]];
        if (firstSelected) {
            locationSelect.value = firstSelected.name;
        }
    }

    document.getElementById('newAppModal').classList.add('visible');
}

function closeNewAppModal() {
    document.getElementById('newAppModal').classList.remove('visible');
}

// Help Modal Functions
function showHelpModal() {
    document.getElementById('helpModal').classList.add('visible');
    document.body.style.overflow = 'hidden';
}

function closeHelpModal() {
    document.getElementById('helpModal').classList.remove('visible');
    document.body.style.overflow = '';
}

// Switch Help Tabs
function switchHelpTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.help-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });
    // Update tab content
    document.querySelectorAll('.help-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const targetContent = document.getElementById('help-' + tabName);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// Toggle Concept Card
function toggleConceptCard(header) {
    const card = header.parentElement;
    card.classList.toggle('collapsed');
}

// Help Navigate To - close modal and switch to specific tab
function helpNavigateTo(destination) {
    closeHelpModal();
    const tabMap = {
        'upload': 'upload',
        'hotspots': 'hotspots',
        'grants': 'grants',
        'reports': 'reports',
        'pedbike': 'pedestrian',
        'pedestrian': 'pedestrian',
        'countermeasures': 'cmf',
        'cmf': 'cmf',
        'ai': 'ai',
        'warrants': 'warrants',
        'dashboard': 'dashboard',
        'map': 'map',
        'analysis': 'analysis',
        'intersection': 'intersection',
        'safety': 'safety',
        'crashtree': 'crashtree',
        'fatalspeeding': 'fatalspeeding',
        'domain-knowledge': 'domain-knowledge',
        'domain': 'domain-knowledge',
        'inventory': 'analysis',
        'inventorymanager': 'analysis',
        'mcp-setup': 'dashboard'
    };
    const tabId = tabMap[destination] || 'dashboard';
    showTab(tabId);
}

// Show How-To Guide
function showHowTo(guideType) {
    const guideArea = document.getElementById('howToGuideArea');
    if (!guideArea) return;

    const guides = {
        'hotspots': {
            title: 'Find the Most Dangerous Intersections',
            steps: [
                { num: 1, text: '<strong>Go to the Hotspots tab</strong> - Click "Hotspots" in the navigation bar' },
                { num: 2, text: '<strong>Set "Sort by" to EPDO Score</strong> - This prioritizes locations with severe crashes, not just high volume' },
                { num: 3, text: '<strong>Set "Group by" to Intersection Node</strong> - Groups crashes by intersection' },
                { num: 4, text: '<strong>Set minimum crashes to 5</strong> - Filters out locations with too few crashes for reliable analysis' },
                { num: 5, text: '<strong>Review the ranked table</strong> - Click "View on Map" or "Get Countermeasures" for any location' }
            ],
            tip: 'For grant applications, focus on locations with high K+A (Fatal + Serious) counts.'
        },
        'corridor': {
            title: 'Analyze a Specific Road Corridor',
            steps: [
                { num: 1, text: '<strong>Go to the Map tab</strong> - Click "Map" in the navigation' },
                { num: 2, text: '<strong>Use the Route selector</strong> - Choose your road from the dropdown' },
                { num: 3, text: '<strong>Or draw a selection</strong> - Use polygon or circle tools to select an area' },
                { num: 4, text: '<strong>View statistics</strong> - See crash counts, severity breakdown, and EPDO for your selection' },
                { num: 5, text: '<strong>Generate report</strong> - Click "Generate Report" for a professional PDF' }
            ],
            tip: 'Use 5-year data for more reliable trend analysis.'
        },
        'cmf': {
            title: 'Find Countermeasures for a Location',
            steps: [
                { num: 1, text: '<strong>Go to Countermeasures tab</strong> - Click "Countermeasures" in the navigation' },
                { num: 2, text: '<strong>Enter location</strong> - Type a road name or select from dropdown' },
                { num: 3, text: '<strong>Set filters</strong> - Choose location type (intersection/segment), area type, min star rating' },
                { num: 4, text: '<strong>Click "Find Countermeasures"</strong> - Get recommendations from FHWA CMF Clearinghouse' },
                { num: 5, text: '<strong>Review results</strong> - Lower CMF = more effective. Look for 3+ star ratings.' }
            ],
            tip: 'Use "AI Recommended" for pattern-based suggestions (requires API key).'
        },
        'hsip': {
            title: 'Prepare Data for HSIP Application',
            steps: [
                { num: 1, text: '<strong>Identify location</strong> - Use Hotspots tab to find high K+A crash locations' },
                { num: 2, text: '<strong>Document crash history</strong> - Go to Reports tab and generate a Corridor Analysis report' },
                { num: 3, text: '<strong>Find countermeasures</strong> - Use Countermeasures tab to get evidence-based solutions with CMFs' },
                { num: 4, text: '<strong>Calculate benefit</strong> - CMF shows expected crash reduction for cost-benefit analysis' },
                { num: 5, text: '<strong>Track application</strong> - Use Grants tab to add to Application Tracker' }
            ],
            tip: 'HSIP requires documented crash history and proven countermeasures (3+ star CMFs).'
        },
        'report': {
            title: 'Generate a Professional PDF Report',
            steps: [
                { num: 1, text: '<strong>Go to Reports tab</strong> - Click "Reports" in the navigation' },
                { num: 2, text: '<strong>Select report type</strong> - Choose from Corridor, Intersection, System-Wide, etc.' },
                { num: 3, text: '<strong>Configure options</strong> - Select route, date range, add title and author' },
                { num: 4, text: '<strong>Click Generate</strong> - Preview the report in the panel' },
                { num: 5, text: '<strong>Download PDF</strong> - Click the download button for a professional document' }
            ],
            tip: 'Reports include charts, tables, and findings suitable for presentations and grant applications.'
        },
        'aisetup': {
            title: 'Set Up and Use the AI Assistant',
            steps: [
                { num: 1, text: '<strong>Get a free API key</strong> - Google Gemini recommended: visit ai.google.dev' },
                { num: 2, text: '<strong>Enter API key</strong> - Paste in the API Key field in the header' },
                { num: 3, text: '<strong>Save the key</strong> - Click Save to store for your session' },
                { num: 4, text: '<strong>Go to AI tab</strong> - Click "AI" in the navigation' },
                { num: 5, text: '<strong>Ask questions</strong> - Query crash patterns, safety recommendations, or MUTCD guidance' }
            ],
            tip: 'Use Signal Warrant Checker for MUTCD 4C.08 analysis at intersections.'
        },
        'pedhotspots': {
            title: 'Identify Pedestrian Crash Hotspots',
            steps: [
                { num: 1, text: '<strong>Go to Ped/Bike tab</strong> - Click "Ped/Bike" in the navigation' },
                { num: 2, text: '<strong>Review pedestrian section</strong> - See total pedestrian crashes, K+A, and EPDO' },
                { num: 3, text: '<strong>Check top locations</strong> - View the ranked list of routes with pedestrian crashes' },
                { num: 4, text: '<strong>Analyze patterns</strong> - Review light condition and year trends' },
                { num: 5, text: '<strong>Use Crossing Evaluation</strong> - Click the tool to assess crosswalk needs (VDOT IIM-TE-384.1)' }
            ],
            tip: 'Pedestrian data shows people injured, not crash count - numbers may differ from total crashes.'
        },
        'grantfind': {
            title: 'Find Open Grant Opportunities',
            steps: [
                { num: 1, text: '<strong>Go to Grants tab</strong> - Click "Grants" in the navigation' },
                { num: 2, text: '<strong>Browse opportunities</strong> - View Virginia State and Federal grants' },
                { num: 3, text: '<strong>Filter by focus</strong> - Select pedestrian, bicycle, infrastructure, etc.' },
                { num: 4, text: '<strong>Check status</strong> - Filter by Open or Forecasted grants' },
                { num: 5, text: '<strong>Click for details</strong> - Follow links to official grant portals' }
            ],
            tip: 'Use quick links for VA DMV Safety Grants, VDOT HSIP, SS4A, and Grants.gov.'
        },
        'export': {
            title: 'Export Data to Excel/CSV',
            steps: [
                { num: 1, text: '<strong>Find the export button</strong> - Look for CSV or Export icon on tables and charts' },
                { num: 2, text: '<strong>In Hotspots</strong> - Click "Export CSV" to download ranked locations' },
                { num: 3, text: '<strong>In Analysis</strong> - Use Advanced Search to filter, then export results' },
                { num: 4, text: '<strong>On Map</strong> - Selection statistics can be copied or exported' },
                { num: 5, text: '<strong>Open in Excel</strong> - CSV files open directly in Excel or Google Sheets' }
            ],
            tip: 'Most tables have export options - look for download icons or buttons.'
        },
        'severity': {
            title: 'Read the Severity Breakdown',
            steps: [
                { num: 1, text: '<strong>Understand KABCO</strong> - K=Fatal, A=Serious Injury, B=Minor Injury, C=Possible Injury, O=Property Damage Only' },
                { num: 2, text: '<strong>Check the Dashboard</strong> - KPI cards at the top show total crashes by severity' },
                { num: 3, text: '<strong>Look at severity bars</strong> - Color-coded bars (red=K, orange=A, yellow=B, green=C, gray=O) appear throughout the tool' },
                { num: 4, text: '<strong>Focus on K+A</strong> - Fatal and Serious Injury crashes are the priority for safety improvements and grants' },
                { num: 5, text: '<strong>Compare with EPDO</strong> - The EPDO score weights severity so you can compare locations fairly' }
            ],
            tip: 'K+A crashes are the primary metric for HSIP and SS4A grant applications.'
        },
        'compare': {
            title: 'Compare Crash Trends Across Years',
            steps: [
                { num: 1, text: '<strong>Go to Analysis tab</strong> - Click "Analysis" in the sidebar' },
                { num: 2, text: '<strong>View yearly summary</strong> - The table shows crash counts by year with change indicators' },
                { num: 3, text: '<strong>Check trend arrows</strong> - Green arrows indicate decreases, red arrows indicate increases' },
                { num: 4, text: '<strong>Use date presets</strong> - Click 3Y or 5Y buttons to set consistent comparison periods' },
                { num: 5, text: '<strong>Generate trend report</strong> - Go to Reports tab and select "Trend Analysis Report" for a professional comparison document' }
            ],
            tip: 'Use at least 3-5 years of data for statistically meaningful trend comparisons.'
        },
        'epdo': {
            title: 'Understand EPDO Scores',
            steps: [
                { num: 1, text: '<strong>What is EPDO?</strong> - Equivalent Property Damage Only score weights crashes by severity (FHWA 2025): K=883, A=94, B=21, C=11, O=1' },
                { num: 2, text: '<strong>Why it matters</strong> - 2 fatal crashes (EPDO=924) rank higher than 100 PDO crashes (EPDO=100)' },
                { num: 3, text: '<strong>Find EPDO in Hotspots</strong> - Sort by EPDO Score to rank locations by true danger level' },
                { num: 4, text: '<strong>EPDO on Dashboard</strong> - The total EPDO KPI card shows the weighted severity across all crashes' },
                { num: 5, text: '<strong>Use for prioritization</strong> - EPDO helps justify grant applications by showing severity concentration' }
            ],
            tip: 'Always use EPDO rather than raw crash count to prioritize locations for safety improvements.'
        },
        'signal': {
            title: 'Check If a Location Needs a Traffic Signal',
            steps: [
                { num: 1, text: '<strong>Go to Warrant Analyzer tab</strong> - Click "Warrant Analyzer" in the Solutions section of the sidebar' },
                { num: 2, text: '<strong>Select your intersection</strong> - Enter the location details at the top of the form' },
                { num: 3, text: '<strong>Fill in traffic data</strong> - Enter volumes, speeds, and intersection characteristics (or use AI Fill to auto-populate)' },
                { num: 4, text: '<strong>Check all 9 warrants</strong> - The tool evaluates all MUTCD traffic signal warrant criteria' },
                { num: 5, text: '<strong>Export results</strong> - Generate a professional PDF warrant analysis document for your records' }
            ],
            tip: 'Use the AI Fill button to automatically populate crash and volume data from your uploaded dataset.'
        },
        'granttrack': {
            title: 'Track Grant Applications',
            steps: [
                { num: 1, text: '<strong>Go to Grants tab</strong> - Click "Grants" in the sidebar' },
                { num: 2, text: '<strong>Find Application Tracker</strong> - Look for the tracking section within the Grants tab' },
                { num: 3, text: '<strong>Add new application</strong> - Enter the grant name, location, submission date, and status' },
                { num: 4, text: '<strong>Update status</strong> - Change status as your application progresses (Submitted, Under Review, Awarded, etc.)' },
                { num: 5, text: '<strong>Set reminders</strong> - Track deadlines and follow-up dates to stay on schedule' }
            ],
            tip: 'Keep your application tracker updated - it helps build an institutional record of safety improvement efforts.'
        },
        'crashtree': {
            title: 'Use Crash Tree Analysis',
            steps: [
                { num: 1, text: '<strong>Go to Crash Tree tab</strong> - Click "Crash Tree" in the Explore section of the sidebar' },
                { num: 2, text: '<strong>Select tree view</strong> - Choose Facility Type, Crash Type, or Contributing Factors' },
                { num: 3, text: '<strong>Filter by severity</strong> - Use KA Only preset for grant-focused analysis, or toggle individual severity levels' },
                { num: 4, text: '<strong>Apply date range</strong> - Use date filters to focus on a specific time period' },
                { num: 5, text: '<strong>Export results</strong> - Click Export Image for presentations or Export PDF for formal documentation' }
            ],
            tip: 'The Crash Tree follows FHWA Systemic Safety methodology - use KA severity to identify focus crash types for HSIP applications.'
        },
        'beforeafter': {
            title: 'Run a Before & After Study',
            steps: [
                { num: 1, text: '<strong>Go to Reports tab</strong> - Click "Reports" in the sidebar' },
                { num: 2, text: '<strong>Select Before & After Study</strong> - Click the "Before & After Study" sub-tab at the top' },
                { num: 3, text: '<strong>Choose your location</strong> - Select the road or intersection where the improvement was made' },
                { num: 4, text: '<strong>Set the project date</strong> - Enter the date when the safety improvement was completed' },
                { num: 5, text: '<strong>Review results</strong> - Compare crash statistics before and after the improvement to measure effectiveness' }
            ],
            tip: 'Before & After studies are essential for documenting the effectiveness of past safety improvements in future grant applications.'
        },
        'mapview': {
            title: 'Use the Map to Visualize Crash Locations',
            steps: [
                { num: 1, text: '<strong>Go to Map tab</strong> - Click "Map" in the Explore section of the sidebar' },
                { num: 2, text: '<strong>Apply filters</strong> - Use year, route, and severity filters to narrow down displayed crashes' },
                { num: 3, text: '<strong>Explore clusters</strong> - Zoom in on crash clusters to identify high-concentration areas' },
                { num: 4, text: '<strong>Click a crash marker</strong> - View detailed crash information including severity, collision type, and contributing factors' },
                { num: 5, text: '<strong>Select a location</strong> - Click an intersection or segment to send it to other tabs (CMF, Warrants, Grants) for deeper analysis' }
            ],
            tip: 'Use the Map tab as your starting point for exploration — visually identify problem areas, then jump to specialized tabs for detailed analysis and countermeasure recommendations.'
        },
        'intersection': {
            title: 'Perform Intersection-Specific Analysis',
            steps: [
                { num: 1, text: '<strong>Go to Intersection tab</strong> - Click "Intersection" in the Explore section of the sidebar' },
                { num: 2, text: '<strong>Select an intersection</strong> - Choose an intersection from the dropdown or click one from the Map or Hotspots tab' },
                { num: 3, text: '<strong>Review crash summary</strong> - Examine the severity distribution, collision types, and contributing factors for that intersection' },
                { num: 4, text: '<strong>Analyze patterns</strong> - Look for recurring crash types, time-of-day patterns, and weather-related trends' },
                { num: 5, text: '<strong>Take action</strong> - Jump to the Countermeasures tab for safety solutions or the Warrants tab to evaluate signal needs' }
            ],
            tip: 'Intersection analysis pairs well with the Warrant Analyzer — if you see a high crash count at an unsignalized intersection, check signal warrants to build a strong case for improvement.'
        },
        'dashboard': {
            title: 'Read the Dashboard KPIs and Trends',
            steps: [
                { num: 1, text: '<strong>Go to Dashboard tab</strong> - Click "Dashboard" in the Explore section (this is also the default landing page)' },
                { num: 2, text: '<strong>Review KPI cards</strong> - Check total crashes, fatalities (K), serious injuries (A), and EPDO score at the top' },
                { num: 3, text: '<strong>Examine trend charts</strong> - Look at year-over-year crash trends to identify whether safety is improving or declining' },
                { num: 4, text: '<strong>Review severity distribution</strong> - Understand the KABCO breakdown to prioritize the most severe crash types' },
                { num: 5, text: '<strong>Identify top locations</strong> - Check the top crash locations summary to quickly spot where to focus safety efforts' }
            ],
            tip: 'The Dashboard gives you a high-level overview — use it to quickly assess the overall safety picture before diving into specific tabs for detailed analysis.'
        },
        'fatalspeeding': {
            title: 'Analyze Fatal and Speed-Related Crashes',
            steps: [
                { num: 1, text: '<strong>Go to Fatal & Speeding tab</strong> - Click "Fatal & Speeding" in the Explore section of the sidebar' },
                { num: 2, text: '<strong>Review fatal crash summary</strong> - Examine the total fatal (K) crashes, locations, and contributing factors' },
                { num: 3, text: '<strong>Analyze speed-related crashes</strong> - Review crashes where speed was a contributing factor, including severity outcomes' },
                { num: 4, text: '<strong>Examine location patterns</strong> - Identify roads and intersections with concentrated fatal or speed-related crashes' },
                { num: 5, text: '<strong>Use for grant applications</strong> - Fatal and speed-related crash data strengthens HSIP and SS4A grant applications significantly' }
            ],
            tip: 'Fatal and speed-related crashes receive the highest weight in most grant scoring criteria — highlighting these in your applications can significantly improve your chances of funding.'
        },
        'safetyfocus': {
            title: 'Use Safety Focus for Deep-Dive Analysis',
            steps: [
                { num: 1, text: '<strong>Go to Safety Focus tab</strong> - Click "Safety Focus" in the Explore section of the sidebar' },
                { num: 2, text: '<strong>Select a focus area</strong> - Choose from 16 categories like Impaired Driving, Work Zones, Young Drivers, Older Drivers, and more' },
                { num: 3, text: '<strong>Review crash statistics</strong> - Examine the severity breakdown, trends, and contributing factors specific to your chosen focus area' },
                { num: 4, text: '<strong>Apply date filters</strong> - Narrow the analysis to a specific time period to identify recent trends or changes' },
                { num: 5, text: '<strong>Compare focus areas</strong> - Switch between categories to understand which safety issues are most pressing in your jurisdiction' }
            ],
            tip: 'Safety Focus areas align with NHTSA behavioral safety categories — use these deep-dive analyses to support Section 402 and Section 405 grant applications.'
        },
        'domainknowledge': {
            title: 'Search Traffic Safety Standards and References',
            steps: [
                { num: 1, text: '<strong>Go to Domain Knowledge tab</strong> - Click "Domain Knowledge" in the Solutions section of the sidebar' },
                { num: 2, text: '<strong>Enter your question</strong> - Type a question about traffic safety standards, MUTCD, AASHTO, or FHWA guidelines' },
                { num: 3, text: '<strong>Review AI-powered results</strong> - The assistant searches its knowledge base of standards and guidelines to provide relevant answers' },
                { num: 4, text: '<strong>Follow up for details</strong> - Ask follow-up questions to drill down into specific sections, warrants, or design standards' },
                { num: 5, text: '<strong>Apply to your project</strong> - Use the referenced standards to support your engineering decisions and grant applications' }
            ],
            tip: 'Domain Knowledge is your in-app reference librarian — use it to quickly find MUTCD sections, AASHTO standards, or FHWA guidance without leaving the tool.'
        },
        'mcpsetup': {
            title: 'Set Up CrashLens MCP Server for Claude Desktop',
            steps: [
                { num: 1, text: '<strong>Get your API key</strong> - Log in to CrashLens, go to Account → API Keys' },
                { num: 2, text: '<strong>Generate a key</strong> - Click "Generate API Key" and copy the ready-to-use config snippet' },
                { num: 3, text: '<strong>Open Claude Desktop settings</strong> - Go to Settings → Developer → Edit Config' },
                { num: 4, text: '<strong>Paste the config</strong> - Add the CrashLens MCP server configuration with your API key' },
                { num: 5, text: '<strong>Restart Claude Desktop</strong> - Data auto-downloads in ~30 seconds on first launch' }
            ],
            tip: 'After initial setup, all queries run locally against cached data — no network needed for analysis.'
        },
        'mcpapikey': {
            title: 'Generate an MCP API Key',
            steps: [
                { num: 1, text: '<strong>Log in to CrashLens</strong> - Sign in at CrashLens.aicreatesai.com' },
                { num: 2, text: '<strong>Open account settings</strong> - Click your avatar → Account' },
                { num: 3, text: '<strong>Go to API Keys tab</strong> - Select the API Keys section in your account' },
                { num: 4, text: '<strong>Click "Generate API Key"</strong> - A new key will be created for your account' },
                { num: 5, text: '<strong>Copy and save securely</strong> - The key is shown once — copy it immediately and store it safely' }
            ],
            tip: 'You can revoke and regenerate API keys at any time from your account settings.'
        },
        'mcpuse': {
            title: 'Use Crash Data in Claude Desktop',
            steps: [
                { num: 1, text: '<strong>Complete MCP setup</strong> - Follow the MCP Server setup guide above to connect your data' },
                { num: 2, text: '<strong>Open Claude Desktop</strong> - Launch the app and start a new conversation' },
                { num: 3, text: '<strong>Ask about your data</strong> - Try: "What are the top 5 crash hotspots?" or "Recommend countermeasures for Route 7"' },
                { num: 4, text: '<strong>Claude uses 22 tools</strong> - It can query crashes, analyze hotspots, search CMFs, evaluate warrants, and score grants' },
                { num: 5, text: '<strong>Get detailed analysis</strong> - Claude provides countermeasure recommendations, severity profiles, and trend analysis' }
            ],
            tip: 'Claude can analyze hotspots, recommend countermeasures, evaluate signal warrants, score grant eligibility, and run before/after studies — all from natural language.'
        },
        'inventory': {
            title: 'Use the Inventory Downloader to Detect Traffic Signs',
            steps: [
                { num: 1, text: '<strong>Go to Analysis tab</strong> - Click "Analysis" in the sidebar' },
                { num: 2, text: '<strong>Select Inventory Downloader</strong> - Click the "Inventory Downloader" sub-tab' },
                { num: 3, text: '<strong>Choose jurisdiction</strong> - Select your state and county/jurisdiction' },
                { num: 4, text: '<strong>Browse detected signs</strong> - View traffic signs, signals, and markings detected from Mapillary street-level imagery' },
                { num: 5, text: '<strong>Export inventory</strong> - Download as CSV or GeoJSON for GIS mapping and analysis' }
            ],
            tip: 'Use the Inventory Manager sub-tab to edit, filter, and manage your downloaded inventory data. Edits are saved as overlays on the original data.'
        }
    };

    const guide = guides[guideType];
    if (!guide) {
        guideArea.innerHTML = '<p style="color:var(--gray);font-style:italic">Guide coming soon...</p>';
        return;
    }

    let stepsHtml = guide.steps.map(s =>
        `<div class="step-guide-step"><span class="step-guide-num">${s.num}</span><div class="step-guide-text">${s.text}</div></div>`
    ).join('');

    guideArea.innerHTML = `
        <div class="step-guide">
            <div class="step-guide-title">📋 ${guide.title}</div>
            <div class="step-guide-steps">${stepsHtml}</div>
            <div class="pro-tip" style="margin-top:1rem">
                <span class="pro-tip-icon">💡</span>
                <div class="pro-tip-text"><strong>Pro Tip:</strong> ${guide.tip}</div>
            </div>
        </div>
    `;

    // Scroll to guide
    guideArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Close help modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const helpModal = document.getElementById('helpModal');
        if (helpModal && helpModal.classList.contains('visible')) {
            closeHelpModal();
        }
    }
});

// Close help modal when clicking outside
document.getElementById('helpModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeHelpModal();
    }
});

function saveNewApplication() {
    const name = document.getElementById('newAppName').value.trim();
    const grant = document.getElementById('newAppGrant').value;
    const location = document.getElementById('newAppLocation').value;
    const amount = document.getElementById('newAppAmount').value;
    const deadline = document.getElementById('newAppDeadline').value;
    const notes = document.getElementById('newAppNotes').value;
    
    if (!name || !location || !deadline) {
        alert('Please fill in Project Name, Location, and Deadline.');
        return;
    }
    
    const app = {
        id: Date.now(),
        name: name,
        grant: grant,
        location: location,
        amount: amount,
        deadline: deadline,
        notes: notes,
        status: 'draft',
        created: new Date().toISOString()
    };
    
    grantState.applications.push(app);
    saveApplications();
    displayApplications();
    closeNewAppModal();
    
    // Clear form
    document.getElementById('newAppName').value = '';
    document.getElementById('newAppAmount').value = '';
    document.getElementById('newAppDeadline').value = '';
    document.getElementById('newAppNotes').value = '';
    
    alert('✅ Application saved!');
}

function saveApplications() {
    localStorage.setItem('grantApplications', JSON.stringify(grantState.applications));
}

function loadApplications() {
    // BUG-002 fix: consolidated with proper error handling and migration
    let saved = localStorage.getItem('grantApplications');

    // Migrate from old key if no data exists under new key
    if (!saved) {
        const oldSaved = localStorage.getItem('grantTool_applications');
        if (oldSaved) {
            saved = oldSaved;
            // Migrate to new key
            localStorage.setItem('grantApplications', oldSaved);
            localStorage.removeItem('grantTool_applications');
            console.log('[Grants] Migrated applications from old localStorage key');
        }
    }

    if (saved) {
        try {
            grantState.applications = JSON.parse(saved);
            displayApplications();
        } catch (e) {
            console.error('[Grants] Error loading applications:', e);
            grantState.applications = [];
        }
    }
}

function displayApplications() {
    const tbody = document.getElementById('appTrackerBody');
    
    if (!grantState.applications || grantState.applications.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--gray)"><div style="font-size:2rem;margin-bottom:.5rem">📋</div><strong>No Applications Yet</strong><br><span style="font-size:.85rem">Click "New Application" to start tracking your grant applications</span></td></tr>`;
        return;
    }
    
    const grantLabels = { ss4a: 'SS4A', hsip: 'HSIP', nhtsa402: 'NHTSA 402', nhtsa405: 'NHTSA 405' };
    const statusColors = { draft: '#4338ca', submitted: '#d97706', review: '#1e40af', awarded: '#059669', denied: '#dc2626' };
    
    tbody.innerHTML = grantState.applications.map((app, idx) => {
        const deadlineDate = new Date(app.deadline);
        const daysUntil = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
        const deadlineClass = daysUntil < 0 ? 'past' : daysUntil <= 30 ? 'urgent' : daysUntil <= 90 ? 'soon' : 'ok';
        
        return `<tr>
            <td><strong>${app.name}</strong></td>
            <td><span style="padding:.2rem .5rem;background:var(--primary-light);color:var(--primary);border-radius:4px;font-size:.75rem;font-weight:600">${grantLabels[app.grant] || app.grant}</span></td>
            <td style="font-size:.85rem">${app.location}</td>
            <td>${app.amount ? '$' + parseInt(app.amount).toLocaleString() : '--'}</td>
            <td><span style="padding:.2rem .5rem;background:${deadlineClass === 'urgent' ? '#fee2e2' : deadlineClass === 'soon' ? '#fef3c7' : '#d1fae5'};color:${deadlineClass === 'urgent' ? '#dc2626' : deadlineClass === 'soon' ? '#d97706' : '#059669'};border-radius:4px;font-size:.75rem">${deadlineDate.toLocaleDateString()}</span></td>
            <td><select onchange="updateAppStatus(${idx}, this.value)" style="padding:.2rem .4rem;border:1px solid var(--border);border-radius:4px;font-size:.75rem;background:${statusColors[app.status]}22;color:${statusColors[app.status]}">
                <option value="draft" ${app.status === 'draft' ? 'selected' : ''}>📝 Draft</option>
                <option value="submitted" ${app.status === 'submitted' ? 'selected' : ''}>📤 Submitted</option>
                <option value="review" ${app.status === 'review' ? 'selected' : ''}>🔍 In Review</option>
                <option value="awarded" ${app.status === 'awarded' ? 'selected' : ''}>🎉 Awarded</option>
                <option value="denied" ${app.status === 'denied' ? 'selected' : ''}>❌ Denied</option>
            </select></td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="exportSingleApplication(${idx})" title="Export to Word">📄</button>
                <button class="btn btn-sm btn-danger" onclick="deleteApplication(${idx})" title="Delete" style="padding:.25rem .4rem">🗑️</button>
            </td>
        </tr>`;
    }).join('');
}

function updateAppStatus(idx, status) {
    grantState.applications[idx].status = status;
    saveApplications();
    displayApplications();
}

function deleteApplication(idx) {
    if (confirm('Delete this application?')) {
        grantState.applications.splice(idx, 1);
        saveApplications();
        displayApplications();
    }
}

async function exportSingleApplication(idx) {
    const app = grantState.applications[idx];
    if (!app) return;
    
    const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;
    
    const grantLabels = { ss4a: 'SS4A (USDOT)', hsip: 'HSIP (VDOT)', nhtsa402: 'NHTSA Section 402', nhtsa405: 'NHTSA Section 405' };
    const statusLabels = { draft: 'Draft', submitted: 'Submitted', review: 'In Review', awarded: 'Awarded', denied: 'Denied' };
    
    const children = [
        new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [new TextRun({ text: app.name, bold: true, size: 48, color: "1E40AF", font: "Arial" })]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [new TextRun({ text: "Grant Application Summary", size: 24, color: "64748B", font: "Arial" })]
        }),
        new Paragraph({
            spacing: { after: 200 },
            children: [
                new TextRun({ text: "Grant Program: ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: grantLabels[app.grant] || app.grant, size: 24, font: "Arial" })
            ]
        }),
        new Paragraph({
            spacing: { after: 200 },
            children: [
                new TextRun({ text: "Location: ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: app.location, size: 24, font: "Arial" })
            ]
        }),
        new Paragraph({
            spacing: { after: 200 },
            children: [
                new TextRun({ text: "Requested Amount: ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: app.amount ? '$' + parseInt(app.amount).toLocaleString() : 'N/A', size: 24, font: "Arial" })
            ]
        }),
        new Paragraph({
            spacing: { after: 200 },
            children: [
                new TextRun({ text: "Deadline: ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: new Date(app.deadline).toLocaleDateString(), size: 24, font: "Arial" })
            ]
        }),
        new Paragraph({
            spacing: { after: 200 },
            children: [
                new TextRun({ text: "Status: ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: statusLabels[app.status] || app.status, size: 24, font: "Arial" })
            ]
        })
    ];
    
    if (app.notes) {
        children.push(
            new Paragraph({
                spacing: { before: 400, after: 200 },
                children: [new TextRun({ text: "Notes:", bold: true, size: 24, font: "Arial" })]
            }),
            new Paragraph({
                spacing: { after: 200 },
                children: [new TextRun({ text: app.notes, size: 22, font: "Arial" })]
            })
        );
    }
    
    const doc = new Document({
        sections: [{ properties: {}, children: children }]
    });
    
    const blob = await docx.Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = app.name.replace(/[^a-zA-Z0-9]/g, '_') + '_Application.docx';
    a.click();
    URL.revokeObjectURL(url);
}

async function exportAllApplications() {
    if (!grantState.applications || grantState.applications.length === 0) {
        alert('No applications to export.');
        return;
    }
    
    const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } = docx;
    
    const grantLabels = { ss4a: 'SS4A (USDOT)', hsip: 'HSIP (VDOT)', nhtsa402: 'NHTSA Section 402', nhtsa405: 'NHTSA Section 405' };
    const statusLabels = { draft: 'Draft', submitted: 'Submitted', review: 'In Review', awarded: 'Awarded', denied: 'Denied' };
    
    const children = [
        new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: "GRANT APPLICATION SUMMARY", bold: true, size: 48, color: "1E40AF", font: "Arial" })]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: getReportAgencyLabel() + ' ' + getReportDeptLabel(), size: 24, font: "Arial" })]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [new TextRun({ text: `Generated: ${new Date().toLocaleDateString()}`, size: 22, color: "64748B", font: "Arial" })]
        })
    ];
    
    grantState.applications.forEach((app, idx) => {
        if (idx > 0) {
            children.push(new Paragraph({ children: [new PageBreak()] }));
        }
        
        children.push(
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 300 },
                children: [new TextRun({ text: `Application ${idx + 1}: ${app.name}`, bold: true, size: 32, color: "1E40AF", font: "Arial" })]
            }),
            new Paragraph({
                spacing: { after: 100 },
                children: [new TextRun({ text: "─".repeat(50), size: 22, color: "CBD5E1", font: "Arial" })]
            }),
            new Paragraph({
                spacing: { after: 150 },
                children: [
                    new TextRun({ text: "Grant Program: ", bold: true, size: 22, font: "Arial" }),
                    new TextRun({ text: grantLabels[app.grant] || app.grant, size: 22, font: "Arial" })
                ]
            }),
            new Paragraph({
                spacing: { after: 150 },
                children: [
                    new TextRun({ text: "Location: ", bold: true, size: 22, font: "Arial" }),
                    new TextRun({ text: app.location, size: 22, font: "Arial" })
                ]
            }),
            new Paragraph({
                spacing: { after: 150 },
                children: [
                    new TextRun({ text: "Requested Amount: ", bold: true, size: 22, font: "Arial" }),
                    new TextRun({ text: app.amount ? '$' + parseInt(app.amount).toLocaleString() : 'N/A', size: 22, font: "Arial" })
                ]
            }),
            new Paragraph({
                spacing: { after: 150 },
                children: [
                    new TextRun({ text: "Application Deadline: ", bold: true, size: 22, font: "Arial" }),
                    new TextRun({ text: new Date(app.deadline).toLocaleDateString(), size: 22, font: "Arial" })
                ]
            }),
            new Paragraph({
                spacing: { after: 150 },
                children: [
                    new TextRun({ text: "Status: ", bold: true, size: 22, font: "Arial" }),
                    new TextRun({ text: statusLabels[app.status] || app.status, size: 22, font: "Arial" })
                ]
            })
        );
        
        if (app.notes) {
            children.push(
                new Paragraph({
                    spacing: { before: 200, after: 100 },
                    children: [new TextRun({ text: "Notes:", bold: true, size: 22, font: "Arial" })]
                }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: app.notes, size: 20, font: "Arial" })]
                })
            );
        }
    });
    
    const doc = new Document({
        sections: [{ properties: {}, children: children }]
    });
    
    const blob = await docx.Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Grant_Applications_Summary_' + new Date().toISOString().split('T')[0] + '.docx';
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================================
// GRANT AI ASSISTANTS - SHARED SETTINGS (State-Aware)
// These functions generate prompts dynamically based on jurisdictionContext.
// ============================================================

function getGrantAISystemPrompt() {
    const stateName = jurisdictionContext?.stateName || 'the state';
    const fips = jurisdictionContext?.stateFips || '08';
    const stateInfo = (typeof FIPSDatabase !== 'undefined') ? FIPSDatabase.getState(fips) : null;
    const dotName = stateInfo?.dotName || 'State DOT';
    // window.EPDO_WEIGHTS may be unset at module-load (this fn is also called by a dead eager const);
    // the optional read + fallback keeps load safe and uses the active jurisdiction weights at runtime.
    const w = window.EPDO_WEIGHTS || { K: 883, A: 94, B: 21, C: 11, O: 1 };

    return `You are a world-class transportation safety grant writer with 20+ years winning competitive federal and state highway safety grants. You have served as both an applicant (90%+ win rate) and a federal grant reviewer for USDOT. You specialize in SS4A, HSIP, NHTSA 402/405, RAISE, and INFRA programs.

You work for a traffic engineering division in ${stateName}, preparing applications for ${dotName} and USDOT programs.

=== CORE EXPERTISE ===
- FHWA Proven Safety Countermeasures (all 28 countermeasures and their applications)
- CMF Clearinghouse: cite specific CMF IDs, star ratings, and applicability
- Safe System Approach (5 pillars): Safer Roads, Safer Speeds, Safer Vehicles, Safer Road Users, Post-Crash Care
- Vision Zero principles and action plan development
- Strategic Highway Safety Plan (SHSP) emphasis area alignment
- Highway Safety Improvement Program (HSIP) systemic safety methodology
- Benefit-Cost Analysis using FHWA crash cost values and EPDO scoring
- Vulnerable Road User (VRU) safety analysis per FHWA VRU Safety Assessment guidance
- Equity analysis using USDOT Justice40, EJ Screen, and CDC SVI tools
- Safe Routes to School, Complete Streets, and context-sensitive solutions
- NHTSA "Countermeasures That Work" evidence base for behavioral programs

=== WRITING STANDARDS ===
1. VOICE: Confident, professional, active voice. NEVER use hedging: "may," "might," "could," "possibly," "believed to be"
2. DATA-FIRST: Lead every argument with specific statistics. Provide context (rates, rankings, comparisons to state/national averages)
3. TERMINOLOGY: Use "crash" (never "accident"), "KA crashes," "VRU," "Safe System approach," "systemic safety," "FHWA Proven Safety Countermeasure"
4. SPECIFICITY: Name exact locations, cite exact counts, reference specific CMF IDs and star ratings
5. STRUCTURE: Max 5 sentences per paragraph. One main idea per paragraph. Lead with the strongest data point
6. GRANT AWARENESS: Tailor language and emphasis to the specific grant program's scoring criteria
7. PATTERNS: Connect crash patterns (angle, head-on, night, impaired, speed-related) to specific countermeasures. Every countermeasure must address a documented crash pattern.

=== GRANT PROGRAM KNOWLEDGE ===
- SS4A: Prioritize Safe System alignment, equity (Justice40 — 25% of score), VRU safety, community engagement. Frame through 5 Safe System pillars. Never use infrastructure-only framing
- HSIP: B/C ratio is the primary scoring metric (35% of score). Cite CMF values with Clearinghouse IDs and star ratings. Emphasize systemic approach and SHSP alignment
- NHTSA 402: Focus on behavioral countermeasures from "Countermeasures That Work." Include law enforcement partnerships. Define SMART performance measures
- NHTSA 405d: Impaired driving focus. Emphasize statewide coordination, DUI courts, ignition interlock. Must meet sub-program eligibility criteria
- RAISE/INFRA: Multi-modal, economic competitiveness, environmental sustainability. Larger projects ($5M+)

=== WHEN ANALYZING CRASH DATA ===
- Calculate and interpret EPDO scores: K×${w.K} + A×${w.A} + B×${w.B} + C×${w.C} + O×${w.O}
- Identify dominant crash PATTERNS (collision types, temporal, contributing factors) — these drive countermeasure selection
- Compare K+A rates to state averages (~5%) to establish severity context
- Flag VRU involvement and calculate VRU crash rates
- Note behavioral factors (impaired, speed, distracted) and map to appropriate grant programs
- Use night crash and weekend-night rates as DUI/impaired driving indicators
- Assess crash trend direction when multi-year data available
- Connect EVERY crash pattern to a specific countermeasure with CMF value
- Calculate financial impact (annual crash cost, 10-year projection) to build urgency

Use markdown formatting for readability. Be thorough, data-driven, and write to win.`;
}
// Legacy constant alias (for any code still referencing the old constant)
const GRANT_AI_SYSTEM_PROMPT = getGrantAISystemPrompt();

function getGrantSearchSystemPrompt() {
    const fips = jurisdictionContext?.stateFips || '08';
    const stateInfo = (typeof FIPSDatabase !== 'undefined') ? FIPSDatabase.getState(fips) : null;
    const dotName = stateInfo?.dotName || 'State DOT';
    // Defensive: getStateHSO is defined inline in app/index.html and not all
    // load orders guarantee it's available at module top-level eval time.
    // L1178 in this file already uses this pattern; mirror it here.
    const hso = (typeof getStateHSO === 'function') ? getStateHSO(fips) : {};
    const hsoAgency = hso.agency || dotName;
    const stateName = jurisdictionContext?.stateName || 'the state';

    return `You are a Grant Search Strategist specializing in highway safety funding. You help traffic engineers in ${stateName} identify the best-fit grants, assess competitiveness, and develop winning application strategies.

=== GRANT PROGRAMS DATABASE ===

INFRASTRUCTURE GRANTS (Capital Projects):
• SS4A (Safe Streets and Roads for All) — USDOT, 80% federal. Focus: Vision Zero, Safe System approach, equity (Justice40), VRU safety, community engagement. Typical: $500K-$30M. Requires Safety Action Plan or implementation project. Scoring: Safety Impact 30%, Equity 25%, Effective Practices 20%, Collaboration 15%, Climate 10%
• HSIP (Highway Safety Improvement Program) — ${dotName}, 90% federal/10% state. Focus: Data-driven, CMF-based countermeasures, systemic safety, FHWA Proven Safety Countermeasures. B/C ratio is primary scoring criterion (35%). Apply through state DOT call for projects
• RAISE Discretionary Grants — USDOT, 80% federal. Focus: Multi-modal, economic competitiveness, environmental sustainability, equity. $5M-$45M typical
• INFRA Grants — USDOT, 60% federal. Focus: Nationally significant freight/highway projects. $5M+ typical
• TAP (Transportation Alternatives Program) — ${dotName}, 80% federal. Focus: Bike/ped facilities, Safe Routes to School, recreational trails. Typically $200K-$2M
• SRTS (Safe Routes to School) — ${dotName}/NHTSA. Focus: School zone safety, walking/biking infrastructure and education

BEHAVIORAL/ENFORCEMENT GRANTS (Non-Infrastructure):
• NHTSA Section 402 — ${hsoAgency}, 100% federal. Focus: Occupant protection, impaired driving, speed enforcement, distracted driving, ped/bike safety education. Evidence base: "Countermeasures That Work"
• NHTSA Section 405b — ${hsoAgency}, 100% federal. Focus: Occupant protection (seat belt) programs
• NHTSA Section 405c — ${hsoAgency}, 100% federal. Focus: Traffic safety information system improvements (data quality)
• NHTSA Section 405d — ${hsoAgency}, 100% federal. Focus: Impaired driving countermeasures — DUI courts, ignition interlock, high-visibility enforcement
• NHTSA Section 405f — ${hsoAgency}, 100% federal. Focus: Motorcycle safety programs

=== CRASH-PATTERN-TO-GRANT MATCHING ===
Use these rules when recommending grants based on crash data:
• High VRU crashes (ped/bike) → SS4A (strongest), TAP, SRTS (near schools)
• High K+A rate (>10%) → HSIP (infrastructure), SS4A (if VRU involved)
• High angle/turning crashes → HSIP (intersection improvements, CMF-based)
• High impaired/DUI (>15%) → NHTSA 405d (primary), 402 (secondary)
• High speed-related (>20%) → HSIP (speed management), 402 (enforcement)
• High night crashes (>30%) → HSIP (lighting, delineation), 402 (enforcement)
• High rear-end crashes → HSIP (signal timing, turn lanes)
• High head-on crashes → HSIP (median barriers, rumble strips)
• Run-off-road pattern → HSIP (shoulders, guardrail, rumble strips)
• Multiple patterns → Recommend grant stacking (e.g., SS4A planning + HSIP construction + 402 enforcement)

=== WHEN RECOMMENDING GRANTS ===
1. Match crash patterns to grant focus areas using the rules above
2. Consider project readiness: design complete → HSIP; planning needed → SS4A Action Plan
3. Assess competitiveness honestly: provide strength/weakness assessment
4. Recommend grant stacking where appropriate
5. Note match requirements and local funding implications
6. Mention typical timelines: federal grants are 6-18 months from application to award
7. Reference the state SHSP emphasis areas when applicable
8. Estimate potential funding amounts based on crash data severity and project scope

Be specific and actionable. Estimate potential funding. Be direct about weak vs. strong matches.`;
}
const GRANT_SEARCH_SYSTEM_PROMPT = getGrantSearchSystemPrompt();

function getFullApplicationSystemPrompt() {
    const fips = jurisdictionContext?.stateFips || '08';
    const stateInfo = (typeof FIPSDatabase !== 'undefined') ? FIPSDatabase.getState(fips) : null;
    const dotName = stateInfo?.dotName || 'State DOT';
    const stateName = jurisdictionContext?.stateName || 'the state';
    const countyName = jurisdictionContext?.jurisdictionName || 'the county';
    const eK = EPDO_WEIGHTS.K, eA = EPDO_WEIGHTS.A, eB = EPDO_WEIGHTS.B, eC = EPDO_WEIGHTS.C, eO = EPDO_WEIGHTS.O;

    return `You are a senior transportation safety grant writer with 15+ years of experience winning competitive federal highway safety grants including SS4A, HSIP, and NHTSA 402/405 programs. You have served as both an applicant and a USDOT grant reviewer. Your applications have a 90% success rate because you understand exactly what reviewers look for.

=== ROLE AND EXPERTISE ===
- Expert in all 28 FHWA Proven Safety Countermeasures and their applications
- Proficient in CMF Clearinghouse data — cite specific CMF IDs, star ratings, and study counts
- Deep knowledge of Safe System approach (5 pillars: Safer Roads, Safer Speeds, Safer Vehicles, Safer Road Users, Post-Crash Care) and Vision Zero principles
- Understanding of federal grant scoring criteria and reviewer expectations for SS4A, HSIP, NHTSA 402/405
- Experience with ${dotName} standards, terminology, and SHSP emphasis areas
- Expert in equity analysis using USDOT Justice40 Initiative, CDC SVI, and EPA EJ Screen
- Proficient in NHTSA "Countermeasures That Work" evidence base for behavioral programs
- Knowledge of crash pattern analysis — connecting collision types, behavioral factors (impaired, speed, distracted), and temporal patterns to specific countermeasures

=== WRITING STANDARDS (MANDATORY) ===

1. VOICE AND TONE
   - Write in confident, professional, active voice
   - NEVER use hedging words: "may," "might," "could," "possibly," "believed to be," "it appears"
   - Let data create urgency - avoid emotional phrases like "unacceptable," "alarming," "critical crisis"
   - Be direct and specific, not vague and general

2. DATA-FIRST APPROACH
   - Lead every section with specific statistics, not general statements
   - Provide context for all numbers (comparisons, rankings, percentages)
   - Ensure all crash numbers are consistent throughout the document
   - Show calculations clearly (especially EPDO and B/C ratio)

3. FEDERAL TERMINOLOGY (use correctly)
   - "KA crashes" for fatal and serious injury (after defining once)
   - "Vulnerable Road Users (VRUs)" for pedestrians and bicyclists
   - "Safe System approach" for SS4A applications
   - "Systemic safety" when addressing network-wide patterns
   - "FHWA Proven Safety Countermeasures" (official capitalization)

4. SPECIFICITY REQUIREMENTS
   - Always name specific locations (road names, intersections)
   - Include quantities: number of crashes, locations, feet, costs
   - Cite CMF ID numbers from CMF Clearinghouse with star ratings when known
   - Reference local planning documents by name when applicable

5. PARAGRAPH STRUCTURE
   - Maximum 5 sentences per paragraph
   - One main idea per paragraph
   - No repetition of the same point across sections
   - Smooth transitions between sections

=== OUTPUT FORMAT ===

Generate a complete, professional grant application with clean formatting:
- Use clear section headings (e.g., "1. COVER PAGE", "2. EXECUTIVE SUMMARY")
- Use proper paragraph spacing
- Present tables in clean, readable format
- No raw markdown syntax (no #, *, \\\`\\\`\\\`, |---|)
- Professional spacing between sections

=== SECTION REQUIREMENTS ===

1. COVER PAGE: Project title, grant program, applicant (${countyName}, ${stateName}, Department of Public Works, Traffic Engineering Division), date, funding request amount

2. EXECUTIVE SUMMARY (250-300 words): Opening hook with key statistic, project description, safety need with data, proposed solution, expected outcomes with B/C ratio, alignment with Vision Zero

3. PROBLEM STATEMENT (4 paragraphs): Lead with crash statistics and K+A rate (compare to state average ~5%). Analyze crash patterns — collision types, behavioral factors (impaired %, speed %, night %), temporal patterns. State contributing factors confidently (no hedging). Project crash trajectory without intervention to build urgency. Connect to state SHSP emphasis areas.

4. CRASH HISTORY ANALYSIS: Clean data table with severity breakdown. EPDO calculation using formula: EPDO = (K \u00d7 ${eK}) + (A \u00d7 ${eA}) + (B \u00d7 ${eB}) + (C \u00d7 ${eC}) + (O \u00d7 ${eO}). Interpretation of score in context. Crash pattern breakdown: dominant collision types with percentages, behavioral factors (impaired, speed, distracted rates), temporal patterns (night, rush hour, weekend night). Financial impact: total crash cost, annual cost, 10-year projection.

5. LOCATION DESCRIPTION (2-3 paragraphs): Road names, functional classification, lanes, speed limits, AADT context, land use, pedestrian/bicycle facilities (or deficiencies). ADA accessibility gaps. Transit proximity.

6. VULNERABLE ROAD USER ANALYSIS (2 paragraphs): VRU crash data with severity distribution and VRU crash rate. Infrastructure deficiencies for pedestrians/bicyclists. Proposed VRU safety improvements. Reference FHWA Pedestrian/Bicycle Safety guides. Note Complete Streets policy alignment if applicable.

7. EQUITY ANALYSIS (2-3 paragraphs): Reference USDOT Justice40 Initiative (is project area in a disadvantaged community?). Cite CDC Social Vulnerability Index (SVI) score or EPA EJ Screen results for the area. Quantify disproportionate crash impact on underserved populations. Transportation equity considerations — transit-dependent, low-income, minority populations. Title VI compliance statement. How project benefits will reach underserved communities.

8. PROPOSED COUNTERMEASURES: For EACH countermeasure include — name, specific application locations, which crash pattern it addresses (with data: "28% angle crashes → protected left-turn phases"), CMF value with Clearinghouse ID and star rating, FHWA Proven Safety Countermeasure status (Yes/No), estimated cost. Every countermeasure MUST link to a documented crash pattern from Section 4.

9. BENEFIT-COST ANALYSIS: Project cost breakdown. Crash cost values used (cite FHWA/state values). Step-by-step benefit calculation: (1) annual crash cost, (2) expected crash reduction (CRF from CMF), (3) annual benefit, (4) total benefit over analysis period, (5) B/C ratio. Interpret ratio: "A B/C of X indicates every dollar invested returns $X in crash reduction benefits."

10. PROJECT SCHEDULE: Milestone-based timeline with phases: Design (X months), Environmental Review (X months), ROW Acquisition (if needed), Procurement (X months), Construction (X months), Closeout (X months). Total project duration.

11. BUDGET SUMMARY: Itemized costs by category (design, construction, ROW, utilities, contingency). Federal share calculation. Local match amount and source. Contingency (typically 10-15%).

12. CONCLUSION (1 paragraph): Restate the core problem with key statistic. Summarize the proposed solution and expected crash reduction. State the B/C ratio. Affirm commitment to Vision Zero / Safe System approach. Call to action for funding.

=== QUALITY STANDARDS ===
- All crash numbers must be 100% consistent across every section (Total = K+A+B+C+O)
- EPDO calculation must match the formula and input data exactly
- B/C ratio calculation must be mathematically correct with shown steps
- Every countermeasure must link to a documented crash pattern from the data
- Crash pattern percentages must be mathematically correct
- Equity section must reference at least one of: Justice40, CDC SVI, EJ Screen
- Professional, confident tone throughout - this application will be scored competitively
- Never use "accident," "may," "might," "could," or "possibly"`;
}
// NOTE: getFullApplicationSystemPrompt() must be called LAZILY (on demand) via
// window.getFullApplicationSystemPrompt — never at module-load time. This module's
// <script> loads from the <head> (index.html), before the inline body script that
// defines the EPDO_WEIGHTS global. An eager call here threw "EPDO_WEIGHTS is not
// defined", which aborted this whole IIFE and left every grants-ui function
// unexposed (window.* / CL.grants.* assignments below never ran). The pre-computed
// constant was unused anyway. (Removed: const FULL_APPLICATION_SYSTEM_PROMPT = …)

// ============================================================
// GRANT 4-AGENT ORCHESTRATION SYSTEM
// Enhanced grant application generation with validation and reviewer simulation
// ============================================================

/**
 * Grant Agent State - Tracks multi-agent analysis progress
 */
const grantAgentState = {
    isRunning: false,
    currentAgent: 0,
    agentResults: {
        agent1: null,  // Data Synthesizer
        agent2: null,  // Program Specialist
        agent3: null,  // Section Generator
        agent4: null   // Reviewer Simulator
    },
    lastApplication: null,
    retryCount: 0,
    maxRetries: 3
};

/**
 * Grant Program Requirements Database
 */
/**
 * Grant Program Requirements — dynamically resolves state DOT and HSO agency names
 * using jurisdictionContext. Accessed as GRANT_PROGRAM_REQUIREMENTS.ss4a etc.
 */
function buildGrantProgramRequirements() {
    const fips = jurisdictionContext?.stateFips || '08';
    const stateInfo = (typeof FIPSDatabase !== 'undefined') ? FIPSDatabase.getState(fips) : null;
    const dotName = stateInfo?.dotName || 'State DOT';
    const hso = (typeof getStateHSO === 'function') ? getStateHSO(fips) : {};
    const hsoAgency = hso.agency || dotName;

    return {
        ss4a: {
            name: "Safe Streets and Roads for All (SS4A)",
            agency: "USDOT",
            federalShare: "80%",
            focusAreas: ["Safe System approach (5 pillars)", "Vision Zero", "Equity & Justice40", "Vulnerable Road Users", "Community engagement", "Climate & sustainability"],
            requiredSections: ["Equity Analysis (Justice40/EJ Screen/CDC SVI)", "Safe System Alignment (map to 5 pillars)", "Community Engagement Plan", "Safety Action Plan reference or development"],
            scoringEmphasis: { "Safety Impact & Effectiveness": 30, "Equity & Inclusion (Justice40)": 25, "Effective Practices & Strategies": 20, "Collaboration & Community": 15, "Climate & Sustainability": 10 },
            tips: "Equity is 25% of score — use Justice40, CDC SVI, EJ Screen data. Frame EVERY countermeasure through Safe System pillars. Show community engagement process with specific stakeholder groups. Never use 'accident'. Reference your Safety Action Plan. Address how project benefits underserved communities."
        },
        hsip: {
            name: "Highway Safety Improvement Program (HSIP)",
            agency: dotName,
            federalShare: "90%",
            focusAreas: ["Data-driven safety analysis", "CMF-based countermeasures", "Systemic safety approach", "FHWA Proven Safety Countermeasures", "SHSP emphasis area alignment"],
            requiredSections: ["Crash Analysis (severity, patterns, trends)", "CMF Justification (Clearinghouse IDs + star ratings)", "Benefit-Cost Analysis (full calculation)", "SHSP Emphasis Area Alignment"],
            scoringEmphasis: { "B/C Ratio": 35, "KA Crash Reduction Potential": 25, "SHSP Alignment": 15, "Systemic Approach": 15, "Project Readiness": 10 },
            tips: "B/C ratio is the #1 scoring criterion — show every calculation step. Cite CMF Clearinghouse IDs with star ratings and study counts. Demonstrate alignment to state SHSP emphasis areas. Systemic approach (addressing crash type across multiple locations) scores bonus points. Use FHWA Proven Safety Countermeasures when possible."
        },
        nhtsa402: {
            name: "NHTSA Section 402 - State and Community Highway Safety",
            agency: hsoAgency,
            federalShare: "100%",
            focusAreas: ["Behavioral countermeasures", "High-visibility enforcement (HVE)", "Public education/awareness campaigns", "Data-driven problem identification", "Impaired driving", "Speed enforcement", "Distracted driving"],
            requiredSections: ["Problem Identification (data-driven with crash statistics)", "Evidence-Based Strategy (cite 'Countermeasures That Work')", "Performance Measures (SMART goals)", "Evaluation Plan (process and outcome measures)", "Partnership Letters (law enforcement, community)"],
            scoringEmphasis: { "Problem Identification (data)": 25, "Evidence-Based Strategy": 25, "Performance Measures (SMART)": 20, "Evaluation Plan": 15, "Partnerships & Coordination": 15 },
            tips: "Cite NHTSA 'Countermeasures That Work' for every strategy. Include signed law enforcement partnership agreements. Define SMART performance measures (Specific, Measurable, Achievable, Relevant, Time-bound). Show how you will evaluate effectiveness with before/after data. Funds cannot supplant existing programs."
        },
        nhtsa405: {
            name: "NHTSA Section 405 - National Priority Safety Programs",
            agency: hsoAgency,
            federalShare: "100%",
            focusAreas: ["Occupant protection (405b)", "Impaired driving countermeasures (405d)", "Traffic records improvement (405c)", "Motorcycle safety (405f)", "Non-motorized safety (405h)"],
            requiredSections: ["Eligibility Certification (sub-program specific)", "Use of Funds Plan", "Performance Measures", "Statewide Coordination Documentation"],
            scoringEmphasis: { "Eligibility Criteria Met": 30, "Program Effectiveness": 25, "Statewide Coordination": 20, "Performance Tracking": 15, "Innovation": 10 },
            tips: "Must meet specific eligibility criteria for the sub-program (405b/c/d/f/h). For 405d: demonstrate impaired driving as significant problem with crash data, DUI arrest data, BAC testing rates. Emphasize statewide coordination with HSO. Show how funds supplement (not supplant) existing efforts. Include ignition interlock and DUI court partnerships."
        }
    };
}
const GRANT_PROGRAM_REQUIREMENTS = buildGrantProgramRequirements();

/**
 * GRANT AGENT 1: Data Synthesizer & Fact Validator
 */
const GRANT_AGENT1_SYSTEM_PROMPT = `You are Grant Agent 1: Data Synthesizer & Fact Validator - creating the authoritative fact base for a competitive grant application.

RESPONSIBILITIES:
1. VALIDATE crash data consistency (total = K+A+B+C+O)
2. EPDO: USE the authoritative EPDO value and the severity weights provided in the input. Never assume or substitute weights, and never recompute with different weights — the provided value is the official jurisdiction EPDO.
3. CALCULATE B/C ratio with full step-by-step methodology
4. COMPILE VRU statistics and VRU crash rate
5. ANALYZE crash patterns — collision types, behavioral factors, temporal patterns
6. CALCULATE financial impact (total crash cost, annual cost, 10-year projection)
7. COMPARE K+A rate to state average (~5%) for severity context
8. FLAG data quality issues or inconsistencies

OUTPUT FORMAT: Return ONLY valid JSON:
{
    "validationStatus": "PASSED|WARNINGS|FAILED",
    "crashFacts": {
        "total": 45,
        "severity": {"K": 2, "A": 5, "B": 12, "C": 15, "O": 11},
        "severityCheck": "VALID",
        "yearRange": "2020-2024",
        "annualized": 9.0,
        "epdo": {"value": 2664, "calculation": "(2×883)+(5×94)+(12×21)+(15×11)+(11×1)"},
        "kaCount": 7,
        "kaPercentage": 15.6,
        "kaContext": "3x the state average of 5%"
    },
    "collisionAnalysis": {
        "dominant": {"type": "Angle", "count": 18, "percentage": 40},
        "secondary": {"type": "Rear-End", "count": 12, "percentage": 26.7},
        "pattern": "Turning movement conflicts at signalized intersection",
        "allTypes": [{"type": "Angle", "count": 18, "pct": 40}, {"type": "Rear-End", "count": 12, "pct": 26.7}]
    },
    "behavioralFactors": {
        "night": {"count": 13, "percentage": 28.9},
        "impaired": {"count": 5, "percentage": 11.1},
        "speed": {"count": 8, "percentage": 17.8},
        "distracted": {"count": 3, "percentage": 6.7},
        "weekendNight": {"count": 4, "percentage": 8.9},
        "wetRoad": {"count": 6, "percentage": 13.3},
        "rushHour": {"count": 15, "percentage": 33.3},
        "dominantFactor": "Night crashes (28.9%) suggest lighting deficiency",
        "grantImplications": "High night crash rate supports HSIP lighting project; impaired rate supports 402/405d behavioral programs"
    },
    "vulnerableUsers": {
        "pedestrian": {"count": 4, "percentage": 8.9},
        "bicycle": {"count": 2, "percentage": 4.4},
        "total": 6,
        "vruRate": 13.3,
        "grantImplications": "VRU involvement supports SS4A application"
    },
    "costAnalysis": {
        "crashCosts": {"K": 12800000, "A": 655000, "B": 198000, "C": 125000, "O": 12400},
        "totalCost": 32450000,
        "annualCost": 6490000,
        "tenYearProjection": 64900000
    },
    "benefitCost": {
        "projectCost": 750000,
        "cmf": 0.70,
        "crf": 30,
        "analysisPeriod": 10,
        "annualBenefit": 1947000,
        "totalBenefit": 19470000,
        "bcRatio": 25.96,
        "interpretation": "Every dollar invested returns $25.96 in crash reduction benefits",
        "steps": ["Step 1: Annual crash cost = $6,490,000", "Step 2: CRF = 1 - CMF = 1 - 0.70 = 30%", "Step 3: Annual benefit = $6,490,000 × 30% = $1,947,000", "Step 4: Total benefit = $1,947,000 × 10 years = $19,470,000", "Step 5: B/C = $19,470,000 / $750,000 = 25.96"]
    },
    "dataWarnings": []
}

IMPORTANT: Return ONLY the JSON object. Use the actual crash data provided — never fabricate numbers.`;

/**
 * GRANT AGENT 2: Grant Program Specialist
 */
const GRANT_AGENT2_SYSTEM_PROMPT = `You are Grant Agent 2: Grant Program Specialist - expert in federal/state grant requirements with 15+ years experience as both applicant and federal reviewer.

RESPONSIBILITIES:
1. CUSTOMIZE application strategy to the specific grant program's scoring criteria
2. MAP crash patterns (collision types, behavioral factors, temporal patterns) to scoring criteria and emphasis areas
3. RECOMMEND emphasis areas for maximum competitive points
4. PROVIDE terminology and framing guidance specific to each grant program
5. IDENTIFY how crash patterns (impaired, speed, night, VRU) align with program priorities
6. CONNECT crash data to SHSP emphasis areas

GRANT-SPECIFIC STRATEGY GUIDANCE:
- SS4A: Frame through 5 Safe System pillars (Safer Roads, Safer Speeds, Safer Vehicles, Safer Road Users, Post-Crash Care). Equity is 25% of score — recommend Justice40, EJ Screen, CDC SVI data. Community engagement is critical. Climate/sustainability is 10%
- HSIP: B/C ratio is 35% of score — ensure math is prominent. Cite CMF Clearinghouse IDs with star ratings. SHSP alignment is 15%. Systemic approach (addressing patterns across locations) scores 15%
- NHTSA 402: Must cite "Countermeasures That Work" (NHTSA). Law enforcement partnerships essential. SMART performance measures required. Map behavioral crash patterns (impaired, speed, distracted) to program strategies
- NHTSA 405d: Demonstrate impaired driving as significant problem (% of crashes, weekend night patterns). DUI court and ignition interlock partnerships. Statewide coordination documentation

OUTPUT FORMAT: Return ONLY valid JSON:
{
    "program": {"code": "ss4a", "name": "Safe Streets and Roads for All", "agency": "USDOT", "federalShare": "80%"},
    "strategy": {
        "primaryTheme": "Vision Zero with equity focus",
        "safeSystemPillars": ["Safer Roads", "Safer Speeds"],
        "scoringPriorities": [
            {"criterion": "Safety Impact", "maxPoints": 30, "strategy": "Lead with KA rate", "dataToUse": "15.6% KA rate exceeds 5% state average"}
        ],
        "crashPatternStrategy": "Angle crashes (40%) drive intersection improvement countermeasures; night crashes (28%) support lighting improvements",
        "competitiveness": "Strong"
    },
    "requiredContent": {
        "mustInclude": ["Safe System Alignment", "Equity Analysis"],
        "recommended": ["Community Engagement", "SHSP Alignment"],
        "optional": ["Climate Benefits"]
    },
    "terminology": {
        "mustUse": ["crash", "Vision Zero", "VRU", "Safe System approach", "systemic safety"],
        "avoid": ["accident", "victim", "may", "might", "could"]
    },
    "dataPresentation": {
        "leadStatistic": "15.6% KA rate — 3x the state average",
        "narrativeHook": "Two lives lost in five years at this intersection...",
        "patternNarrative": "40% angle crashes indicate turning movement conflicts requiring protected phases"
    },
    "strengths": ["High KA rate", "Strong B/C", "Clear crash pattern"],
    "weaknesses": ["Need equity demographics", "Limited community engagement evidence"],
    "reviewerInsights": "SS4A reviewers prioritize Safe System alignment and measurable equity benefits. Applications that map countermeasures to specific crash patterns score highest.",
    "shspAlignment": "Aligns with state SHSP emphasis areas: Intersection Safety, Vulnerable Road Users"
}

IMPORTANT: Return ONLY the JSON object.`;

/**
 * GRANT AGENT 3: Section Generator
 */
const GRANT_AGENT3_SYSTEM_PROMPT = `You are Grant Agent 3: Section Generator - world-class grant writer with 20+ years winning federal safety grants.

RESPONSIBILITIES:
1. GENERATE each section using ONLY validated facts from Agent 1 — never invent data
2. APPLY program strategy and scoring optimization from Agent 2
3. FOLLOW federal grant writing standards and program-specific requirements
4. MAINTAIN 100% consistent numbers across all sections
5. CONNECT every countermeasure to a specific crash pattern from the data

WRITING STANDARDS:
- Professional, confident, active voice throughout
- NEVER use hedging: "may," "might," "could," "possibly," "believed to be"
- NEVER use "accident" — always "crash"
- Lead every section with the strongest relevant statistic
- Max 5 sentences per paragraph, one main idea per paragraph
- Provide context for all numbers (rates, rankings, comparisons to state/national averages)

SECTION-SPECIFIC BEST PRACTICES:
- EXECUTIVE SUMMARY: Open with the single most compelling statistic (fatalities or KA rate). State the problem, solution, and B/C ratio within 250-300 words. End with Vision Zero commitment
- PROBLEM STATEMENT: Compare K+A rate to state average (~5%). Show crash trend (improving/stable/worsening). Connect to SHSP emphasis areas. Use behavioral patterns (impaired, speed, night) to build urgency
- CRASH HISTORY: Present clean severity table. Show EPDO calculation with formula. Interpret the score in context ("an EPDO of 1,464 indicates severity-weighted impact far exceeding typical locations")
- LOCATION DESCRIPTION: Include road names, functional classification, lanes, speed limits, AADT context, land use, existing pedestrian/bicycle facilities (or lack thereof)
- VRU ANALYSIS: Cite FHWA Pedestrian/Bicycle Safety guides. Quantify VRU crash rate. Reference Complete Streets policy if applicable. Note ADA accessibility gaps
- EQUITY ANALYSIS: Reference USDOT Justice40 Initiative, EJ Screen, or CDC Social Vulnerability Index (SVI). Identify disadvantaged communities. Quantify disproportionate crash impact on underserved populations. Address Title VI compliance
- COUNTERMEASURES: For EACH countermeasure: name it, specify exact application location, identify which crash pattern it addresses, cite CMF value with Clearinghouse ID and star rating, note FHWA Proven Safety Countermeasure status, estimate cost
- B/C ANALYSIS: Show every calculation step. Use FHWA crash cost values. Calculate annual benefit, total benefit over analysis period, and B/C ratio. Interpret ratio ("a B/C of 25.9 indicates every dollar invested returns $25.90 in crash reduction")
- COMMUNITY ENGAGEMENT: Describe outreach methods, stakeholder groups, public meeting attendance, and how community input shaped the project design
- PROJECT SCHEDULE: Use milestone-based timeline with Design, Environmental, ROW, Procurement, Construction, and Closeout phases

OUTPUT FORMAT: Return ONLY valid JSON:
{
    "sections": [
        {
            "number": 1,
            "title": "COVER PAGE",
            "content": "Project Title: ...\\nGrant Program: ...\\nApplicant: [County/Agency]...",
            "wordCount": 35
        },
        {
            "number": 2,
            "title": "EXECUTIVE SUMMARY",
            "content": "Two lives lost. Five people seriously injured...",
            "wordCount": 280
        }
    ],
    "totalWordCount": 2500,
    "consistencyCheck": {"allFactsFromAgent1": true, "discrepancies": []}
}

SECTIONS TO GENERATE:
1. Cover Page 2. Executive Summary (250-300 words) 3. Problem Statement (4 paragraphs)
4. Crash History Analysis (severity table + EPDO + patterns) 5. Location Description 6. VRU Analysis
7. Equity Analysis (Justice40/SVI) 8. Proposed Countermeasures (with CMF IDs) 9. Benefit-Cost Analysis (full calculation)
10. Project Schedule (milestone timeline) 11. Budget Summary (itemized) 12. Conclusion

IMPORTANT: Return ONLY the JSON object.`;

/**
 * GRANT AGENT 4: Reviewer Simulator & Validator
 */
const GRANT_AGENT4_SYSTEM_PROMPT = `You are Grant Agent 4: Reviewer Simulator - 15+ years reviewing federal highway safety grants for USDOT, FHWA, and NHTSA.

You know EXACTLY what separates funded applications from rejected ones. You score ruthlessly but fairly.

RESPONSIBILITIES:
1. AUDIT all crash numbers, EPDO calculations, and B/C ratios for mathematical consistency
2. SIMULATE scoring using the ACTUAL program criteria (SS4A, HSIP, 402, 405 each have different weights)
3. VERIFY crash patterns are properly connected to proposed countermeasures (every countermeasure must address a documented crash pattern)
4. CHECK that CMF citations include Clearinghouse IDs and are appropriate for the crash type
5. ASSESS equity analysis quality (does it reference Justice40, SVI, or EJ Screen?)
6. IDENTIFY specific weaknesses with actionable fixes
7. POLISH executive summary and conclusion for maximum impact

SCORING KNOWLEDGE BY PROGRAM:
- SS4A: Safety Impact(30%), Equity(25%), Effective Practices(20%), Collaboration(15%), Climate(10%). Equity is the differentiator.
- HSIP: B/C Ratio(35%), KA Reduction(25%), SHSP Alignment(15%), Systemic(15%), Readiness(10%). Math must be bulletproof.
- NHTSA 402: Problem ID(25%), Evidence-Based(25%), Performance(20%), Evaluation(15%), Partners(15%). Must cite "Countermeasures That Work".
- NHTSA 405: Eligibility(30%), Effectiveness(25%), Coordination(20%), Tracking(15%), Innovation(10%). Eligibility is pass/fail.

COMMON REJECTION REASONS TO CHECK FOR:
- Crash numbers don't add up (Total ≠ K+A+B+C+O)
- EPDO calculation errors
- B/C ratio math errors
- Countermeasures don't match crash patterns
- Missing equity analysis (SS4A killer)
- Hedging language ("may," "might," "could")
- Using "accident" instead of "crash"
- Vague performance measures (not SMART)
- No SHSP alignment (HSIP)

OUTPUT FORMAT: Return ONLY valid JSON:
{
    "consistencyAudit": {
        "passed": true,
        "checks": [
            {"check": "Crash totals (K+A+B+C+O = Total)", "result": "PASS"},
            {"check": "EPDO calculation", "result": "PASS"},
            {"check": "B/C ratio math", "result": "PASS"},
            {"check": "Countermeasure-to-pattern linkage", "result": "PASS"}
        ],
        "errors": []
    },
    "completeness": {
        "requiredSections": {"present": ["all"], "missing": []},
        "programSpecific": {"present": ["Equity Analysis", "Safe System"], "missing": []},
        "score": 95
    },
    "simulatedScoring": {
        "criteria": [
            {"name": "Safety Impact", "max": 30, "estimated": 27, "notes": "Strong KA data, clear crash patterns"}
        ],
        "totalScore": 82,
        "maxScore": 100,
        "percentile": "Competitive — top 20% of applications",
        "fundingLikelihood": "High"
    },
    "qualityIssues": [
        {"severity": "CRITICAL", "section": "Equity", "issue": "No Justice40/SVI reference", "fix": "Add CDC SVI score for project area. Reference Justice40 disadvantaged community status."},
        {"severity": "MINOR", "section": "Problem Statement", "issue": "Passive voice in paragraph 2", "fix": "Rewrite: 'Angle crashes account for...' instead of 'It was found that...'"}
    ],
    "strengths": ["Excellent B/C ratio of 25.9", "Clear crash pattern analysis", "Strong countermeasure-to-pattern linkage"],
    "weaknesses": ["Equity section lacks demographic data", "Missing community engagement description"],
    "polishedSections": {
        "executiveSummary": "REVISED: Two lives lost...",
        "conclusion": "REVISED: This project represents..."
    },
    "overallAssessment": {
        "readyToSubmit": true,
        "confidence": 85,
        "competitiveness": "Strong",
        "recommendation": "Strengthen equity section with Justice40 data before submission",
        "estimatedScoreRange": "78-85 out of 100"
    }
}

IMPORTANT: Return ONLY the JSON object.`;

/**
 * API Call with Exponential Backoff
 */
async function callGrantAgentWithRetry(agentNum, systemPrompt, userInput, apiKey, maxRetries = 3) {
    const baseDelay = 2000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[Grant Agent ${agentNum}] Attempt ${attempt + 1}/${maxRetries + 1}`);

            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-5-20250929',
                    max_tokens: 4096,
                    temperature: 0.2,
                    system: systemPrompt,
                    messages: [{ role: 'user', content: userInput }]
                })
            });

            if (response.status === 429) {
                const waitTime = Math.pow(2, attempt) * baseDelay;
                console.warn(`[Grant Agent ${agentNum}] Rate limited. Waiting ${waitTime/1000}s...`);
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
                throw new Error(`Agent ${agentNum}: Anthropic rate limit hit and still limited after ${maxRetries + 1} attempts. Wait a minute and try again.`);
            }

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error(`Agent ${agentNum}: API key rejected (HTTP ${response.status}). Check your Anthropic API key in the 🔑 field at the top of the page.`);
                }
                if (response.status >= 500 && attempt < maxRetries) {
                    const waitTime = Math.pow(2, attempt) * baseDelay;
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
                throw new Error(`Agent ${agentNum}: Anthropic API error (HTTP ${response.status}).`);
            }

            const data = await response.json();
            if (data.error) throw new Error(data.error.message);

            const textBlock = data.content.find(block => block.type === 'text');
            if (!textBlock) throw new Error('No response received');

            let parsed;
            try {
                const jsonMatch = textBlock.text.match(/```(?:json)?\s*([\s\S]*?)```/);
                parsed = jsonMatch ? JSON.parse(jsonMatch[1].trim()) : JSON.parse(textBlock.text.trim());
            } catch (e) {
                parsed = { rawResponse: textBlock.text, parseError: e.message };
            }

            console.log(`[Grant Agent ${agentNum}] Complete`);
            return parsed;

        } catch (error) {
            if (error.name === 'TypeError' && attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * baseDelay));
                continue;
            }
            if (error.name === 'TypeError') {
                throw new Error(`Agent ${agentNum}: Network error reaching the Anthropic API. Check your internet connection and try again.`);
            }
            throw error;
        }
    }
    throw new Error(`Agent ${agentNum} failed after ${maxRetries + 1} attempts`);
}

/**
 * Main Grant 4-Agent Orchestrator
 */
async function runGrant4AgentAnalysis(crashData, grantProgram, projectParams, apiKey, progressCallback = null) {
    if (grantAgentState.isRunning) {
        throw new Error('Grant generation already in progress');
    }

    grantAgentState.isRunning = true;
    grantAgentState.agentResults = { agent1: null, agent2: null, agent3: null, agent4: null };

    const startTime = Date.now();
    const updateProgress = (agent, status, message) => {
        if (progressCallback) progressCallback({ agent, status, message, elapsed: Date.now() - startTime });
    };

    try {
        // AGENT 1: Data Synthesizer
        updateProgress(1, 'running', 'Validating data and calculating B/C ratio...');
        const agent1Input = buildGrantAgent1Input(crashData, projectParams);
        const agent1Result = await callGrantAgentWithRetry(1, GRANT_AGENT1_SYSTEM_PROMPT, agent1Input, apiKey);
        grantAgentState.agentResults.agent1 = agent1Result;
        updateProgress(1, 'complete', `B/C Ratio: ${agent1Result.benefitCost?.bcRatio?.toFixed(2) || 'Calculated'}`);

        await new Promise(r => setTimeout(r, 1000));

        // AGENT 2: Program Specialist
        updateProgress(2, 'running', `Optimizing for ${grantProgram.toUpperCase()}...`);
        const programReqs = GRANT_PROGRAM_REQUIREMENTS[grantProgram] || GRANT_PROGRAM_REQUIREMENTS.ss4a;
        const agent2Input = `Analyze for ${programReqs.name}.\n\nPROGRAM: ${JSON.stringify(programReqs)}\n\nDATA: ${JSON.stringify(agent1Result)}`;
        const agent2Result = await callGrantAgentWithRetry(2, GRANT_AGENT2_SYSTEM_PROMPT, agent2Input, apiKey);
        grantAgentState.agentResults.agent2 = agent2Result;
        updateProgress(2, 'complete', agent2Result.strategy?.primaryTheme || 'Strategy defined');

        await new Promise(r => setTimeout(r, 1000));

        // AGENT 3: Section Generator
        updateProgress(3, 'running', 'Generating application sections...');
        const agent3Input = `Generate all 12 sections.\n\nPROJECT: ${projectParams.title}, $${projectParams.cost}, CMF ${projectParams.cmf}\nPROGRAM: ${grantProgram.toUpperCase()}\n\nFACTS: ${JSON.stringify(agent1Result)}\n\nSTRATEGY: ${JSON.stringify(agent2Result)}`;
        const agent3Result = await callGrantAgentWithRetry(3, GRANT_AGENT3_SYSTEM_PROMPT, agent3Input, apiKey);
        grantAgentState.agentResults.agent3 = agent3Result;
        updateProgress(3, 'complete', `${agent3Result.sections?.length || 12} sections generated`);

        await new Promise(r => setTimeout(r, 1000));

        // AGENT 4: Reviewer Simulator
        updateProgress(4, 'running', 'Simulating reviewer scoring...');
        const agent4Input = `Review application for ${grantProgram.toUpperCase()}.\n\nFACTS: ${JSON.stringify(agent1Result)}\n\nSTRATEGY: ${JSON.stringify(agent2Result)}\n\nSECTIONS: ${JSON.stringify(agent3Result)}`;
        const agent4Result = await callGrantAgentWithRetry(4, GRANT_AGENT4_SYSTEM_PROMPT, agent4Input, apiKey);
        grantAgentState.agentResults.agent4 = agent4Result;
        updateProgress(4, 'complete', `Score: ${agent4Result.simulatedScoring?.totalScore || 0}/100`);

        const finalResults = {
            success: true,
            timestamp: new Date().toISOString(),
            duration: Date.now() - startTime,
            grantProgram,
            projectTitle: projectParams.title,
            agents: grantAgentState.agentResults,
            sections: agent3Result.sections || [],
            validatedFacts: agent1Result,
            programStrategy: agent2Result,
            reviewerFeedback: agent4Result,
            simulatedScore: agent4Result.simulatedScoring || {},
            overallAssessment: agent4Result.overallAssessment || {}
        };

        grantAgentState.lastApplication = finalResults;
        grantAgentState.isRunning = false;
        return finalResults;

    } catch (error) {
        grantAgentState.isRunning = false;
        throw error;
    }
}

/**
 * Build input for Grant Agent 1
 */
function buildGrantAgent1Input(crashData, projectParams) {
    const w = window.EPDO_WEIGHTS || { K: 883, A: 94, B: 21, C: 11, O: 1 }; // active jurisdiction EPDO weights (FHWA 2025 default)
    let input = `Validate crash data and calculate B/C.

LOCATION: ${crashData.locationName || 'Selected Location'}
TYPE: ${crashData.locationType || 'Intersection'}
JURISDICTION: ${jurisdictionContext?.jurisdictionName || 'Unknown'}, ${jurisdictionContext?.stateName || 'Unknown'}

CRASHES: Total=${crashData.total}, K=${crashData.K||0}, A=${crashData.A||0}, B=${crashData.B||0}, C=${crashData.C||0}, O=${crashData.O||0}
EPDO (AUTHORITATIVE — already computed with this jurisdiction's official weights K=${w.K}, A=${w.A}, B=${w.B}, C=${w.C}, O=${w.O}): ${crashData.epdo || 0}. Use this exact EPDO value. When showing the EPDO formula, use ONLY these weights — never substitute other weights.
K+A RATE: ${crashData.total > 0 ? (((crashData.K||0) + (crashData.A||0)) / crashData.total * 100).toFixed(1) : 0}%
YEARS: ${crashData.yearRange || '5-year'}
ANNUALIZED: ${crashData.yearRange ? (crashData.total / (parseInt(crashData.yearRange.split('-').pop()) - parseInt(crashData.yearRange.split('-')[0]) + 1 || 1)).toFixed(1) : crashData.total} crashes/year
COLLISIONS: ${crashData.collisionTypes ? JSON.stringify(crashData.collisionTypes) : 'Not specified'}
VRU: Pedestrian=${crashData.pedestrian||0}, Bicycle=${crashData.bicycle||0}, VRU Rate=${crashData.total > 0 ? (((crashData.pedestrian||0) + (crashData.bicycle||0)) / crashData.total * 100).toFixed(1) : 0}%

PROJECT: Cost=$${projectParams.cost||500000}, CMF=${projectParams.cmf||0.70}, Period=${projectParams.analysisPeriod||10} years
CRASH COSTS: K=$${projectParams.crashCosts?.K||12800000}, A=$${projectParams.crashCosts?.A||655000}, B=$${projectParams.crashCosts?.B||198000}, C=$${projectParams.crashCosts?.C||125000}, O=$${projectParams.crashCosts?.O||12400}`;

    // Add crash patterns if available (from analyzeCrashPatterns)
    if (crashData.patterns) {
        const p = crashData.patterns;
        const t = crashData.total || 1;
        input += `

CRASH PATTERNS (Contributing Factors):
Night/Dark: ${p.night||0} (${((p.night||0)/t*100).toFixed(1)}%)
Impaired (Alcohol/Drug): ${p.impaired||0} (${((p.impaired||0)/t*100).toFixed(1)}%)
Speed-Related: ${p.speed||0} (${((p.speed||0)/t*100).toFixed(1)}%)
Distracted: ${p.distracted||0} (${((p.distracted||0)/t*100).toFixed(1)}%)
Wet Road Surface: ${p.wetRoad||0} (${((p.wetRoad||0)/t*100).toFixed(1)}%)
Weekend Night (DUI indicator): ${p.weekendNight||0}
Rush Hour: ${p.rushHour||0}

COLLISION TYPES:
Angle: ${p.angle||0}, Head-On: ${p.headOn||0}, Rear-End: ${p.rearEnd||0}, Sideswipe: ${p.sideswipe||0}, Run-Off-Road: ${p.runOffRoad||0}`;
    }

    return input;
}

/**
 * UI Helper: Update Grant Program Selection
 */
function updateGrantProgramUI() {
    const program = document.getElementById('appGrantProgram')?.value;
    const tipsEl = document.getElementById('grantProgramTips');
    const reqEl = document.getElementById('grantAIRequirements');
    const pdfBtn = document.getElementById('btnDownloadPDF4Agent');
    const wordBtn = document.getElementById('btnDownloadWord4Agent');
    const locationEl = document.getElementById('appLocation');

    // Check both table selection AND dropdown for location
    const tableSelectionExists = grantState.selectedLocationIndices && grantState.selectedLocationIndices.length > 0;
    const dropdownSelected = locationEl?.value && locationEl.value !== '';
    const locationSelected = tableSelectionExists || dropdownSelected;
    const programSelected = program && program !== '';
    const canGenerate = programSelected && locationSelected;

    if (pdfBtn) pdfBtn.disabled = !canGenerate;
    if (wordBtn) wordBtn.disabled = !canGenerate;

    if (reqEl) {
        if (canGenerate) {
            reqEl.style.background = '#d1fae5';
            reqEl.style.color = '#065f46';
            reqEl.innerHTML = '✓ Ready to generate 4-Agent AI application';
        } else {
            reqEl.style.background = '#fef3c7';
            reqEl.style.color = '#92400e';
            const missing = [];
            if (!programSelected) missing.push('Grant Program');
            if (!locationSelected) missing.push('Location');
            reqEl.innerHTML = `⚠️ Select ${missing.join(' and ')} to enable`;
        }
    }

    if (tipsEl && program && GRANT_PROGRAM_REQUIREMENTS[program]) {
        const req = GRANT_PROGRAM_REQUIREMENTS[program];
        const colors = { ss4a: '#dbeafe', hsip: '#d1fae5', nhtsa402: '#fef3c7', nhtsa405: '#fee2e2' };
        tipsEl.style.display = 'block';
        tipsEl.style.background = colors[program] || '#dbeafe';
        tipsEl.style.border = '1px solid #93c5fd';
        tipsEl.innerHTML = `<div style="font-weight:600">${req.name}</div><div style="font-size:.7rem">${req.agency} • ${req.federalShare} Federal</div><div style="font-size:.65rem;margin-top:.25rem">💡 ${req.tips}</div>`;
    } else if (tipsEl) {
        tipsEl.style.display = 'none';
    }

    if (typeof generateAppPreview === 'function') generateAppPreview();
}

/**
 * Download 4-Agent Application as PDF
 */
async function download4AgentApplicationPDF() {
    const program = document.getElementById('appGrantProgram')?.value;

    if (!program || program === '') {
        alert('Please select a Grant Program first.');
        return;
    }

    // Check for table selection first, then fall back to dropdown
    if (grantState.selectedLocationIndices.length === 0) {
        const locationName = document.getElementById('appLocation')?.value;
        if (!locationName || locationName === '') {
            alert('Please select at least one location from the Grant-Ready Locations table, or select a location from the dropdown.');
            return;
        }
    }

    const apiKey = getCMFAIApiKey?.() || getGrantApiKey?.();
    if (!apiKey) {
        // Reveal the centralized header API-key bar so the user can act immediately.
        const keyContainer = document.getElementById('headerApiKeyContainer');
        if (keyContainer) keyContainer.classList.remove('hidden');
        alert('No AI API key found. Enter your Anthropic (Claude) API key in the 🔑 field at the top of the page and click 💾 Save, then try generating again. Need a key? Use the "🔑 Get key" link in that bar.');
        const keyField = document.getElementById('headerApiKey');
        if (keyField) { keyField.scrollIntoView({ behavior: 'smooth', block: 'center' }); keyField.focus(); }
        return;
    }

    // Get location data - prioritize table selection over dropdown
    let location, locationNames, isMulti = false;
    if (grantState.selectedLocationIndices.length > 1) {
        isMulti = true;
        location = getCombinedSelectionStats();
        locationNames = grantState.selectedLocationIndices.map(idx => grantState.rankedLocations[idx]?.name).filter(Boolean);
    } else if (grantState.selectedLocationIndices.length === 1) {
        location = grantState.rankedLocations[grantState.selectedLocationIndices[0]];
        locationNames = [location.name];
    } else {
        const locationName = document.getElementById('appLocation')?.value;
        location = grantState.rankedLocations?.find(l => l.name === locationName) ||
                   grantState.allRankedLocations?.find(l => l.name === locationName);
        if (!location) {
            alert('Location data not found. Please select a valid location.');
            return;
        }
        locationNames = [location.name];
    }

    // Build crash data — include crash patterns for enriched AI context
    const crashData = {
        locationName: isMulti ? locationNames.join(', ') : location.name,
        locationType: isMulti ? 'Multi-Corridor' : (location.type === 'intersection' ? 'Intersection' : 'Segment'),
        total: location.crashes || 0,
        epdo: Math.round(location.epdo || 0), // authoritative EPDO from the app (official jurisdiction weights) — agents must use this, not recompute
        K: location.K || 0,
        A: location.A || 0,
        B: location.B || 0,
        C: location.C || 0,
        O: location.O || 0,
        yearRange: crashState.years?.length > 0 ? `${crashState.years[0]}-${crashState.years[crashState.years.length-1]}` : '5-year',
        pedestrian: location.ped || 0,
        bicycle: location.bike || 0,
        collisionTypes: location.collisionTypes || {},
        patterns: location.patterns || (isMulti ? (() => {
            // Aggregate patterns from all selected locations for multi-corridor
            const agg = {};
            grantState.selectedLocationIndices.forEach(idx => {
                const loc = grantState.rankedLocations[idx];
                if (loc && loc.patterns) {
                    Object.entries(loc.patterns).forEach(([k, v]) => {
                        if (typeof v === 'number') agg[k] = (agg[k] || 0) + v;
                        else if (typeof v === 'object' && v !== null) {
                            if (!agg[k]) agg[k] = {};
                            Object.entries(v).forEach(([sk, sv]) => { agg[k][sk] = (agg[k][sk] || 0) + sv; });
                        }
                    });
                }
            });
            return agg;
        })() : {})
    };

    // Pre-flight data validation — don't spend four Claude calls on empty or
    // self-inconsistent data. (Severity sum < total is normal: some states have
    // unknown-severity crashes, so only the clearly-wrong cases below abort/warn.)
    if (!(crashData.total > 0)) {
        alert('This location has no crashes in the selected analysis period. Choose a location with crash history, or widen the Grants date filter, before generating an application.');
        return;
    }
    const sevSum = crashData.K + crashData.A + crashData.B + crashData.C + crashData.O;
    if (sevSum > crashData.total) {
        if (!confirm(`Data check: the severity counts (K+A+B+C+O = ${sevSum}) exceed the total crash count (${crashData.total}) for this selection — the generated application may contain inconsistent numbers. Generate anyway?`)) return;
    }

    // Build project params
    const projectParams = {
        title: document.getElementById('appProjectTitle')?.value || (isMulti ? 'Multi-Corridor Safety Improvement' : `${location.name} Safety Improvement`),
        cost: parseFloat(document.getElementById('appProjectCost')?.value) || 500000,
        cmf: parseFloat(document.getElementById('appCMF')?.value) || 0.70,
        analysisPeriod: parseInt(document.getElementById('analysisPeriod')?.value) || 10,
        crashCosts: {
            K: parseFloat(document.getElementById('crashCostK')?.value) || 12800000,
            A: parseFloat(document.getElementById('crashCostA')?.value) || 655000,
            B: parseFloat(document.getElementById('crashCostB')?.value) || 198000,
            C: parseFloat(document.getElementById('crashCostC')?.value) || 125000,
            O: parseFloat(document.getElementById('crashCostO')?.value) || 12400
        }
    };

    // Show loading modal
    showGrant4AgentLoadingModal();

    try {
        const results = await runGrant4AgentAnalysis(crashData, program, projectParams, apiKey, updateGrant4AgentProgress);

        // Generate PDF
        await generateGrant4AgentPDF(results, projectParams);

        hideGrant4AgentLoadingModal();

    } catch (error) {
        console.error('4-Agent PDF generation error:', error);
        hideGrant4AgentLoadingModal();
        alert(`Error generating application: ${error.message}`);
    }
}

/**
 * Download 4-Agent Application as Word
 */
async function download4AgentApplicationWord() {
    const program = document.getElementById('appGrantProgram')?.value;

    if (!program || program === '') {
        alert('Please select a Grant Program first.');
        return;
    }

    // Check for table selection first, then fall back to dropdown
    if (grantState.selectedLocationIndices.length === 0) {
        const locationName = document.getElementById('appLocation')?.value;
        if (!locationName || locationName === '') {
            alert('Please select at least one location from the Grant-Ready Locations table, or select a location from the dropdown.');
            return;
        }
    }

    const apiKey = getCMFAIApiKey?.() || getGrantApiKey?.();
    if (!apiKey) {
        // Reveal the centralized header API-key bar so the user can act immediately.
        const keyContainer = document.getElementById('headerApiKeyContainer');
        if (keyContainer) keyContainer.classList.remove('hidden');
        alert('No AI API key found. Enter your Anthropic (Claude) API key in the 🔑 field at the top of the page and click 💾 Save, then try generating again. Need a key? Use the "🔑 Get key" link in that bar.');
        const keyField = document.getElementById('headerApiKey');
        if (keyField) { keyField.scrollIntoView({ behavior: 'smooth', block: 'center' }); keyField.focus(); }
        return;
    }

    // Get location data - prioritize table selection over dropdown
    let location, locationNames, isMulti = false;
    if (grantState.selectedLocationIndices.length > 1) {
        isMulti = true;
        location = getCombinedSelectionStats();
        locationNames = grantState.selectedLocationIndices.map(idx => grantState.rankedLocations[idx]?.name).filter(Boolean);
    } else if (grantState.selectedLocationIndices.length === 1) {
        location = grantState.rankedLocations[grantState.selectedLocationIndices[0]];
        locationNames = [location.name];
    } else {
        const locationName = document.getElementById('appLocation')?.value;
        location = grantState.rankedLocations?.find(l => l.name === locationName) ||
                   grantState.allRankedLocations?.find(l => l.name === locationName);
        if (!location) {
            alert('Location data not found. Please select a valid location.');
            return;
        }
        locationNames = [location.name];
    }

    // Build crash data — include crash patterns for enriched AI context
    const crashData = {
        locationName: isMulti ? locationNames.join(', ') : location.name,
        locationType: isMulti ? 'Multi-Corridor' : (location.type === 'intersection' ? 'Intersection' : 'Segment'),
        total: location.crashes || 0,
        epdo: Math.round(location.epdo || 0), // authoritative EPDO from the app (official jurisdiction weights) — agents must use this, not recompute
        K: location.K || 0, A: location.A || 0, B: location.B || 0, C: location.C || 0, O: location.O || 0,
        yearRange: crashState.years?.length > 0 ? `${crashState.years[0]}-${crashState.years[crashState.years.length-1]}` : '5-year',
        pedestrian: location.ped || 0,
        bicycle: location.bike || 0,
        collisionTypes: location.collisionTypes || {},
        patterns: location.patterns || (isMulti ? (() => {
            const agg = {};
            grantState.selectedLocationIndices.forEach(idx => {
                const loc = grantState.rankedLocations[idx];
                if (loc && loc.patterns) {
                    Object.entries(loc.patterns).forEach(([k, v]) => {
                        if (typeof v === 'number') agg[k] = (agg[k] || 0) + v;
                        else if (typeof v === 'object' && v !== null) {
                            if (!agg[k]) agg[k] = {};
                            Object.entries(v).forEach(([sk, sv]) => { agg[k][sk] = (agg[k][sk] || 0) + sv; });
                        }
                    });
                }
            });
            return agg;
        })() : {})
    };

    // Pre-flight data validation — see download4AgentApplicationPDF for rationale.
    if (!(crashData.total > 0)) {
        alert('This location has no crashes in the selected analysis period. Choose a location with crash history, or widen the Grants date filter, before generating an application.');
        return;
    }
    const sevSum = crashData.K + crashData.A + crashData.B + crashData.C + crashData.O;
    if (sevSum > crashData.total) {
        if (!confirm(`Data check: the severity counts (K+A+B+C+O = ${sevSum}) exceed the total crash count (${crashData.total}) for this selection — the generated application may contain inconsistent numbers. Generate anyway?`)) return;
    }

    const projectParams = {
        title: document.getElementById('appProjectTitle')?.value || (isMulti ? 'Multi-Corridor Safety Improvement' : `${location.name} Safety Improvement`),
        cost: parseFloat(document.getElementById('appProjectCost')?.value) || 500000,
        cmf: parseFloat(document.getElementById('appCMF')?.value) || 0.70,
        analysisPeriod: parseInt(document.getElementById('analysisPeriod')?.value) || 10,
        crashCosts: {
            K: parseFloat(document.getElementById('crashCostK')?.value) || 12800000,
            A: parseFloat(document.getElementById('crashCostA')?.value) || 655000,
            B: parseFloat(document.getElementById('crashCostB')?.value) || 198000,
            C: parseFloat(document.getElementById('crashCostC')?.value) || 125000,
            O: parseFloat(document.getElementById('crashCostO')?.value) || 12400
        }
    };

    showGrant4AgentLoadingModal();

    try {
        const results = await runGrant4AgentAnalysis(crashData, program, projectParams, apiKey, updateGrant4AgentProgress);
        await generateGrant4AgentWord(results, projectParams);
        hideGrant4AgentLoadingModal();
    } catch (error) {
        console.error('4-Agent Word generation error:', error);
        hideGrant4AgentLoadingModal();
        alert(`Error: ${error.message}`);
    }
}

/**
 * Show 4-Agent Loading Modal
 */
function showGrant4AgentLoadingModal() {
    let modal = document.getElementById('grant4AgentModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'grant4AgentModal';
        modal.innerHTML = `
            <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center">
                <div style="background:white;border-radius:12px;padding:2rem;max-width:450px;width:90%;box-shadow:0 25px 50px rgba(0,0,0,0.25)">
                    <div style="text-align:center;margin-bottom:1.5rem">
                        <div style="font-size:2.5rem;margin-bottom:.5rem">🤖</div>
                        <h3 style="margin:0;color:#5b21b6">4-Agent AI Application Generator</h3>
                        <p style="color:#6b7280;font-size:.85rem;margin-top:.5rem">Enhanced generation with validation & reviewer simulation</p>
                    </div>
                    <div id="grant4AgentSteps" style="margin-bottom:1.5rem">
                        <div class="g4a-step" data-step="1" style="display:flex;align-items:center;gap:.75rem;padding:.75rem;border-radius:8px;margin-bottom:.5rem;background:#f3f4f6">
                            <span class="g4a-icon" style="width:28px;height:28px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:.8rem">1</span>
                            <div><div style="font-weight:600;font-size:.85rem">Agent 1: Data Validator</div><div style="font-size:.75rem;color:#6b7280">Validating facts & calculating B/C</div></div>
                        </div>
                        <div class="g4a-step" data-step="2" style="display:flex;align-items:center;gap:.75rem;padding:.75rem;border-radius:8px;margin-bottom:.5rem;background:#f3f4f6">
                            <span class="g4a-icon" style="width:28px;height:28px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:.8rem">2</span>
                            <div><div style="font-weight:600;font-size:.85rem">Agent 2: Program Specialist</div><div style="font-size:.75rem;color:#6b7280">Optimizing for grant requirements</div></div>
                        </div>
                        <div class="g4a-step" data-step="3" style="display:flex;align-items:center;gap:.75rem;padding:.75rem;border-radius:8px;margin-bottom:.5rem;background:#f3f4f6">
                            <span class="g4a-icon" style="width:28px;height:28px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:.8rem">3</span>
                            <div><div style="font-weight:600;font-size:.85rem">Agent 3: Section Generator</div><div style="font-size:.75rem;color:#6b7280">Writing application sections</div></div>
                        </div>
                        <div class="g4a-step" data-step="4" style="display:flex;align-items:center;gap:.75rem;padding:.75rem;border-radius:8px;background:#f3f4f6">
                            <span class="g4a-icon" style="width:28px;height:28px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:.8rem">4</span>
                            <div><div style="font-weight:600;font-size:.85rem">Agent 4: Reviewer Simulator</div><div style="font-size:.75rem;color:#6b7280">Scoring & polishing</div></div>
                        </div>
                    </div>
                    <div id="grant4AgentStatus" style="text-align:center;font-size:.85rem;color:#6b7280">Initializing...</div>
                    <div style="margin-top:1rem;text-align:center;font-size:.75rem;color:#9ca3af">This may take 60-90 seconds</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'block';
}

function hideGrant4AgentLoadingModal() {
    const modal = document.getElementById('grant4AgentModal');
    if (modal) modal.style.display = 'none';
}

function updateGrant4AgentProgress(progress) {
    const { agent, status, message, elapsed } = progress;
    const statusEl = document.getElementById('grant4AgentStatus');
    if (statusEl) {
        statusEl.textContent = `${message} (${(elapsed/1000).toFixed(1)}s)`;
    }

    document.querySelectorAll('.g4a-step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        const icon = step.querySelector('.g4a-icon');
        if (stepNum < agent || (stepNum === agent && status === 'complete')) {
            step.style.background = '#d1fae5';
            icon.style.background = '#059669';
            icon.style.color = 'white';
            icon.innerHTML = '✓';
        } else if (stepNum === agent && status === 'running') {
            step.style.background = '#ede9fe';
            icon.style.background = '#7c3aed';
            icon.style.color = 'white';
            icon.innerHTML = '<span style="animation:spin 1s linear infinite;display:inline-block">⟳</span>';
        }
    });
}

/**
 * Generate PDF from 4-Agent Results
 */
async function generateGrant4AgentPDF(results, projectParams) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'letter');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = margin;

    // Helper function
    const addPage = () => { doc.addPage(); y = margin; };
    const checkPageBreak = (needed) => { if (y + needed > pageHeight - margin) addPage(); };

    // Title Page
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('GRANT APPLICATION', pageWidth/2, 35, { align: 'center' });
    doc.setFontSize(12);
    doc.text(results.projectTitle || 'Safety Improvement Project', pageWidth/2, 48, { align: 'center' });

    y = 75;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    // Program info
    const programInfo = GRANT_PROGRAM_REQUIREMENTS[results.grantProgram] || {};
    doc.text(`Grant Program: ${programInfo.name || results.grantProgram.toUpperCase()}`, margin, y);
    y += 8;
    doc.text(`Agency: ${programInfo.agency || 'Federal/State'}`, margin, y);
    y += 8;
    doc.text(`Federal Share: ${programInfo.federalShare || '80%'}`, margin, y);
    y += 8;
    doc.text(`Applicant: ${jurisdictionContext?.jurisdictionName || 'County'}, ${jurisdictionContext?.stateName || 'State'} - Department of Public Works`, margin, y);
    y += 8;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y);
    y += 15;

    // Validation Summary
    const facts = results.validatedFacts || {};
    doc.setFillColor(209, 250, 229);
    doc.rect(margin, y, pageWidth - 2*margin, 25, 'F');
    doc.setFontSize(10);
    doc.text('✓ 4-AGENT AI VALIDATION SUMMARY', margin + 5, y + 7);
    doc.setFontSize(9);
    doc.text(`B/C Ratio: ${facts.benefitCost?.bcRatio?.toFixed(2) || 'N/A'} | EPDO: ${facts.crashFacts?.epdo?.value || 'N/A'} | KA Rate: ${facts.crashFacts?.kaPercentage?.toFixed(1) || 'N/A'}%`, margin + 5, y + 15);
    doc.text(`Estimated Score: ${results.simulatedScore?.totalScore || 'N/A'}/100 (${results.overallAssessment?.competitiveness || 'N/A'})`, margin + 5, y + 21);
    y += 35;

    // Sections
    const sections = results.sections || [];
    sections.forEach((section, idx) => {
        checkPageBreak(40);

        // Section header
        doc.setFillColor(243, 244, 246);
        doc.rect(margin, y, pageWidth - 2*margin, 8, 'F');
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`${section.number || idx + 1}. ${section.title || 'Section'}`, margin + 3, y + 6);
        y += 12;

        // Section content
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        const content = section.content || '';
        const lines = doc.splitTextToSize(content.replace(/\\n/g, '\n'), pageWidth - 2*margin);
        lines.forEach(line => {
            checkPageBreak(6);
            doc.text(line, margin, y);
            y += 5;
        });
        y += 8;
    });

    // Reviewer Feedback Page
    addPage();
    doc.setFillColor(237, 233, 254);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setFontSize(14);
    doc.setTextColor(91, 33, 182);
    doc.text('4-AGENT REVIEWER FEEDBACK', pageWidth/2, 13, { align: 'center' });
    y = 30;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    const feedback = results.reviewerFeedback || {};

    // Strengths
    doc.setFont(undefined, 'bold');
    doc.text('STRENGTHS:', margin, y);
    y += 6;
    doc.setFont(undefined, 'normal');
    (feedback.strengths || []).forEach(s => {
        checkPageBreak(6);
        doc.text(`• ${s}`, margin + 5, y);
        y += 5;
    });
    y += 5;

    // Weaknesses
    doc.setFont(undefined, 'bold');
    doc.text('AREAS FOR IMPROVEMENT:', margin, y);
    y += 6;
    doc.setFont(undefined, 'normal');
    (feedback.weaknesses || []).forEach(w => {
        checkPageBreak(6);
        doc.text(`• ${w}`, margin + 5, y);
        y += 5;
    });

    // Save
    const fileName = (results.projectTitle || 'Grant_Application').replace(/[^a-zA-Z0-9]/g, '_') + '_4Agent.pdf';
    doc.save(fileName);
}

/**
 * Generate Word from 4-Agent Results
 */
async function generateGrant4AgentWord(results, projectParams) {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } = docx;

    const sections = results.sections || [];
    const facts = results.validatedFacts || {};
    const feedback = results.reviewerFeedback || {};
    const programInfo = GRANT_PROGRAM_REQUIREMENTS[results.grantProgram] || {};

    const children = [
        // Title
        new Paragraph({
            children: [new TextRun({ text: 'GRANT APPLICATION', bold: true, size: 48, color: '1E40AF' })],
            alignment: 'center',
            spacing: { after: 200 }
        }),
        new Paragraph({
            children: [new TextRun({ text: results.projectTitle || 'Safety Improvement Project', size: 28, color: '64748B' })],
            alignment: 'center',
            spacing: { after: 400 }
        }),
        // Program info
        new Paragraph({ children: [new TextRun({ text: `Grant Program: ${programInfo.name || results.grantProgram.toUpperCase()}` })] }),
        new Paragraph({ children: [new TextRun({ text: `Agency: ${programInfo.agency || 'Federal/State'}` })] }),
        new Paragraph({ children: [new TextRun({ text: `Applicant: ${getJurisdictionStateLabel()}` })] }),
        new Paragraph({ children: [new TextRun({ text: `Date: ${new Date().toLocaleDateString()}` })], spacing: { after: 400 } }),
        // Validation summary
        new Paragraph({
            children: [new TextRun({ text: '4-AGENT AI VALIDATION SUMMARY', bold: true, color: '059669' })],
            spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ children: [new TextRun({ text: `B/C Ratio: ${facts.benefitCost?.bcRatio?.toFixed(2) || 'N/A'} | EPDO: ${facts.crashFacts?.epdo?.value || 'N/A'} | Estimated Score: ${results.simulatedScore?.totalScore || 'N/A'}/100` })] }),
        new Paragraph({ text: '', spacing: { after: 300 } })
    ];

    // Add sections
    sections.forEach((section, idx) => {
        children.push(new Paragraph({
            children: [new TextRun({ text: `${section.number || idx + 1}. ${section.title || 'Section'}`, bold: true, size: 26 })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 }
        }));
        const content = (section.content || '').replace(/\\n/g, '\n');
        content.split('\n').forEach(para => {
            if (para.trim()) {
                children.push(new Paragraph({ children: [new TextRun({ text: para.trim() })], spacing: { after: 100 } }));
            }
        });
    });

    // Reviewer feedback
    children.push(new Paragraph({
        children: [new TextRun({ text: 'REVIEWER FEEDBACK', bold: true, size: 28, color: '7C3AED' })],
        spacing: { before: 400, after: 200 }
    }));
    children.push(new Paragraph({ children: [new TextRun({ text: 'Strengths:', bold: true })] }));
    (feedback.strengths || []).forEach(s => {
        children.push(new Paragraph({ children: [new TextRun({ text: `• ${s}` })], indent: { left: 360 } }));
    });
    children.push(new Paragraph({ children: [new TextRun({ text: 'Areas for Improvement:', bold: true })], spacing: { before: 200 } }));
    (feedback.weaknesses || []).forEach(w => {
        children.push(new Paragraph({ children: [new TextRun({ text: `• ${w}` })], indent: { left: 360 } }));
    });

    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (results.projectTitle || 'Grant_Application').replace(/[^a-zA-Z0-9]/g, '_') + '_4Agent.docx';
    a.click();
    URL.revokeObjectURL(url);
}

  // ---- Public API: back-compat dual exposure ----
  window.CL = window.CL || {};
  CL.grants = CL.grants || {};
  CL.grants.ui = CL.grants.ui || {};

  // Every declaration above was a top-level (global) function before
  // extraction; mirror all to window so remaining inline code in
  // index.html keeps working unchanged.
  window.runFullAnalysis = runFullAnalysis;
  window.scrollToGrantSearch = scrollToGrantSearch;
  window.scrollToWritingAssistant = scrollToWritingAssistant;
  window.populateGrantProgramDropdown = populateGrantProgramDropdown;
  window.buildGrantWritingContext = buildGrantWritingContext;
  window.openNewAppModal = openNewAppModal;
  window.closeNewAppModal = closeNewAppModal;
  window.showHelpModal = showHelpModal;
  window.closeHelpModal = closeHelpModal;
  window.switchHelpTab = switchHelpTab;
  window.toggleConceptCard = toggleConceptCard;
  window.helpNavigateTo = helpNavigateTo;
  window.showHowTo = showHowTo;
  window.saveNewApplication = saveNewApplication;
  window.saveApplications = saveApplications;
  window.loadApplications = loadApplications;
  window.displayApplications = displayApplications;
  window.updateAppStatus = updateAppStatus;
  window.deleteApplication = deleteApplication;
  window.exportSingleApplication = exportSingleApplication;
  window.exportAllApplications = exportAllApplications;
  window.getGrantAISystemPrompt = getGrantAISystemPrompt;
  window.getGrantSearchSystemPrompt = getGrantSearchSystemPrompt;
  window.getFullApplicationSystemPrompt = getFullApplicationSystemPrompt;
  window.buildGrantProgramRequirements = buildGrantProgramRequirements;
  window.callGrantAgentWithRetry = callGrantAgentWithRetry;
  window.runGrant4AgentAnalysis = runGrant4AgentAnalysis;
  window.buildGrantAgent1Input = buildGrantAgent1Input;
  window.updateGrantProgramUI = updateGrantProgramUI;
  window.download4AgentApplicationPDF = download4AgentApplicationPDF;
  window.download4AgentApplicationWord = download4AgentApplicationWord;
  window.showGrant4AgentLoadingModal = showGrant4AgentLoadingModal;
  window.hideGrant4AgentLoadingModal = hideGrant4AgentLoadingModal;
  window.updateGrant4AgentProgress = updateGrant4AgentProgress;
  window.generateGrant4AgentPDF = generateGrant4AgentPDF;
  window.generateGrant4AgentWord = generateGrant4AgentWord;

  // Prompt 30 §2 — CL.grants + CL.grants.ui exposure for the anchors
  CL.grants.scrollToGrantSearch = CL.grants.ui.scrollToGrantSearch = scrollToGrantSearch;
  CL.grants.populateGrantProgramDropdown = CL.grants.ui.populateGrantProgramDropdown = populateGrantProgramDropdown;
  CL.grants.getGrantAISystemPrompt = CL.grants.ui.getGrantAISystemPrompt = getGrantAISystemPrompt;
  CL.grants.runGrant4AgentAnalysis = CL.grants.ui.runGrant4AgentAnalysis = runGrant4AgentAnalysis;
  CL.grants.updateGrantProgramUI = CL.grants.ui.updateGrantProgramUI = updateGrantProgramUI;

  CL._registerModule('grants/grants-ui');
})();
