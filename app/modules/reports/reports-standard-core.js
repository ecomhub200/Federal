/**
 * CL reports.standardCore — extracted (name-anchored). navigateTo-split
 * round, prompt 42b1. Dispatcher + systemwide report generators.
 * Depends: core/epdo-presets, analysis/crash-profile (via window/CL mirrors).
 * Public API (dual exposure): window.<fn> ↔ CL.reports.standardCore.<fn>
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───

// CC 346 §2 (was CC 340) — display polish helpers shared by every
// standard report generator. Pure transforms — no DOM, no fetches.
// Call sites are wired in CC 347; window-exposed at the bottom of this
// module so sibling report modules can reach them.

/**
 * Format any integer (or numeric string) with thousands separators.
 * Non-numeric / null / undefined → '0'. Negatives preserved. Floats
 * are rounded (call .toFixed() yourself for decimals).
 */
function fmtNum(n) {
    if (n === null || n === undefined || n === '') return '0';
    var v = Number(n);
    if (!isFinite(v)) return '0';
    return Math.round(v).toLocaleString('en-US');
}

/**
 * Strip a leading numeric code + separator from a categorical label.
 * "1 - Daylight" → "Daylight", "05 - Sideswipe Same Direction" →
 * "Sideswipe Same Direction", "12: Wet" → "Wet". Preserves any
 * internal " - " (e.g. "Dark - lighted roadway" stays intact — we
 * only strip the FIRST `\d+ [-.:]` segment). Falsy input → ''.
 */
function stripEnumPrefix(s) {
    if (s === null || s === undefined) return '';
    var str = String(s).trim();
    if (!str) return '';
    return str.replace(/^\s*\d+\s*[-.:]\s*/, '').trim();
}

/**
 * True for buckets that should be treated as missing data:
 *   '', null, undefined, 'Unknown', 'N/A', '99 - Unknown',
 *   '0 - Not Applicable', '99 - Other', etc.
 */
function isUnknownBucket(label) {
    if (label === null || label === undefined) return true;
    var s = String(label).trim().toLowerCase();
    if (!s) return true;
    if (s === 'unknown' || s === 'n/a' || s === 'na' || s === 'null') return true;
    if (/^\s*\d+\s*[-.:]\s*(unknown|not\s+applicable|other|none)\s*$/i.test(label)) return true;
    return false;
}

/**
 * Take a [label, count][] array and (a) drop Unknown buckets whose
 * share < threshold (default 1%), (b) collapse remaining Unknown
 * buckets into ONE "Other / Unknown" row at the end. Returns a NEW
 * array — does NOT mutate input.
 */
function filterUnknown(entries, total, threshold) {
    threshold = (typeof threshold === 'number') ? threshold : 0.01;
    if (!Array.isArray(entries) || entries.length === 0) return [];
    if (!total || total <= 0) return entries.slice();
    var kept = [];
    var unknownSum = 0;
    for (var i = 0; i < entries.length; i++) {
        var label = entries[i][0];
        var count = Number(entries[i][1]) || 0;
        if (isUnknownBucket(label)) {
            unknownSum += count;
        } else {
            kept.push([stripEnumPrefix(label), count]);
        }
    }
    if (unknownSum > 0 && (unknownSum / total) >= threshold) {
        kept.push(['Other / Unknown', unknownSum]);
    }
    return kept;
}

/**
 * Render a gap-state `<tr>` for an otherwise-empty `<tbody>`. Used by
 * every table-render block: keep the table grid alive but say "no
 * data" politely. The .report-gap class is the signal §3 uses to
 * auto-collapse a section.
 */
function renderGapRow(colspan, category) {
    var cat = category ? String(category) : 'data';
    return '<tr><td colspan="' + colspan + '" class="report-gap" style="text-align:center;color:#6b7280;padding:1rem;font-style:italic">No ' + cat + ' data available for this selection.</td></tr>';
}

/**
 * CC 363 — Normalize a route / intersection / location label so spelling
 * variants collapse to the same canonical key. Examples:
 *   "KOREAN WAR VETERANS MEM. HIGHWAY"  → "KOREAN WAR VETERANS MEMORIAL HIGHWAY"
 *   "KOREAN WAR VETS MEM HIGHWAY"        → "KOREAN WAR VETERANS MEMORIAL HIGHWAY"
 *   "US 13 / College Road & North Dupont Highway"
 *                                         → "US 13 / COLLEGE ROAD & N DUPONT HIGHWAY"
 *   "I-95 N"                              → "I 95 N"
 *
 * Used as the DEDUP KEY only — never displayed. The display name is kept
 * as-is from the matview row (so the user sees the source spelling).
 * State-agnostic: the abbreviation table is universal.
 */
function _normalizeRouteLabel(label) {
    if (label === null || label === undefined) return '';
    var s = String(label).toUpperCase();
    // 1. Strip periods, commas, double-quotes — keep `/`, `&`, `-` as semantic separators
    s = s.replace(/[.,"']/g, '');
    // 2. Expand common road-name abbreviations (longest first to avoid partial matches)
    var ABBREV = [
        [/\bMEMORIAL\b/g, 'MEMORIAL'],
        [/\bMEM\b/g,      'MEMORIAL'],
        [/\bVETERANS?\b/g,'VETERANS'],   // VETERAN or VETERANS → VETERANS
        [/\bVETS\b/g,     'VETERANS'],
        [/\bHIGHWAY\b/g,  'HIGHWAY'],
        [/\bHWY\b/g,      'HIGHWAY'],
        [/\bROAD\b/g,     'ROAD'],
        [/\bRD\b/g,       'ROAD'],
        [/\bSTREET\b/g,   'STREET'],
        [/\bST\b/g,       'STREET'],
        [/\bAVENUE\b/g,   'AVENUE'],
        [/\bAVE\b/g,      'AVENUE'],
        [/\bBOULEVARD\b/g,'BOULEVARD'],
        [/\bBLVD\b/g,     'BOULEVARD'],
        [/\bDRIVE\b/g,    'DRIVE'],
        [/\bDR\b/g,       'DRIVE'],
        [/\bLANE\b/g,     'LANE'],
        [/\bLN\b/g,       'LANE'],
        [/\bPARKWAY\b/g,  'PARKWAY'],
        [/\bPKWY\b/g,     'PARKWAY'],
        [/\bPLACE\b/g,    'PLACE'],
        [/\bPL\b/g,       'PLACE'],
        [/\bCOURT\b/g,    'COURT'],
        [/\bCT\b/g,       'COURT'],
        [/\bTURNPIKE\b/g, 'TURNPIKE'],
        [/\bTPKE\b/g,     'TURNPIKE'],
        [/\bEXPRESSWAY\b/g,'EXPRESSWAY'],
        [/\bEXPY\b/g,     'EXPRESSWAY'],
        [/\bBRIDGE\b/g,   'BRIDGE'],
        [/\bBR\b/g,       'BRIDGE'],
        // Directional
        [/\bN\b/g,        'N'],
        [/\bNORTH\b/g,    'N'],
        [/\bS\b/g,        'S'],
        [/\bSOUTH\b/g,    'S'],
        [/\bE\b/g,        'E'],
        [/\bEAST\b/g,     'E'],
        [/\bW\b/g,        'W'],
        [/\bWEST\b/g,     'W'],
        // Interstate / state-route prefix variants
        [/\bI-(\d+)\b/g,  'I $1'],
        [/\bUS-(\d+)\b/g, 'US $1'],
        [/\bDE-(\d+)\b/g, 'DE $1'],
        [/\bVA-(\d+)\b/g, 'VA $1'],
        [/\bCO-(\d+)\b/g, 'CO $1']
    ];
    ABBREV.forEach(function (p) { s = s.replace(p[0], p[1]); });
    // 3. Collapse whitespace to single space, trim
    s = s.replace(/\s+/g, ' ').trim();
    return s;
}

/**
 * CC 363 — Group hotspot rows by normalized label and SUM their counts.
 * Input: array of rows shaped like `{name, total, K, A, B, C, O, epdo, ka, nodeId, lat, lon}`.
 * Output: same shape, but rows whose `_normalizeRouteLabel(name)` matches are merged.
 *   - `name` keeps the LONGEST source spelling (most descriptive).
 *   - `total / K / A / B / C / O / epdo / ka` are summed.
 *   - other fields (e.g. `nodeId`, `type`) are kept from the first row in the group.
 *
 * The disambiguation suffix CC 342 adds ("(approach N)") is applied AFTER this
 * fuzzy dedup, so a row whose normalized key collides with another but at a
 * DIFFERENT physical location (different coords) still gets the suffix.
 *
 * Distance-threshold rule for location collision: if two rows share a
 * normalized name AND lat/lon are within ~120 m (≈0.0015°), treat as
 * SAME physical location and merge. Beyond that, they're different
 * approaches of the same road system — keep both. Rows without coords
 * (e.g. matview spelling variants) merge by name alone, which is the
 * desired behavior here.
 */
function _fuzzyDedupeHotspots(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return [];
    // Build groups keyed by normalized name
    var groups = {};
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var rawName = r.name || r.baseName || '';
        var key = _normalizeRouteLabel(rawName);
        if (!key) key = '__unnamed_' + i;
        if (!groups[key]) groups[key] = [];
        groups[key].push(r);
    }
    // Merge each group
    var out = [];
    Object.keys(groups).forEach(function (k) {
        var group = groups[k];
        if (group.length === 1) { out.push(group[0]); return; }
        // Multiple rows in this group — decide if same location or different approaches
        var subGroups = [[group[0]]];  // start with first row in its own sub-group
        for (var i = 1; i < group.length; i++) {
            var r = group[i];
            var placed = false;
            for (var j = 0; j < subGroups.length; j++) {
                var ref = subGroups[j][0];
                var dlat = Math.abs((r.lat || 0) - (ref.lat || 0));
                var dlon = Math.abs((r.lon || 0) - (ref.lon || 0));
                // 120 m ≈ 0.001° lat, slightly less in lon at mid-latitudes — use 0.0015 to be generous
                if (dlat < 0.0015 && dlon < 0.0015) { subGroups[j].push(r); placed = true; break; }
            }
            if (!placed) subGroups.push([r]);
        }
        // Each sub-group is "same physical place, different spellings" — sum counts
        subGroups.forEach(function (sg) {
            if (sg.length === 1) { out.push(sg[0]); return; }
            // Pick the LONGEST spelling as display name
            sg.sort(function (a, b) { return (b.name || '').length - (a.name || '').length; });
            var merged = Object.assign({}, sg[0]);
            merged.total = sg.reduce(function (s, r) { return s + (Number(r.total) || 0); }, 0);
            merged.K = sg.reduce(function (s, r) { return s + (Number(r.K) || 0); }, 0);
            merged.A = sg.reduce(function (s, r) { return s + (Number(r.A) || 0); }, 0);
            merged.B = sg.reduce(function (s, r) { return s + (Number(r.B) || 0); }, 0);
            merged.C = sg.reduce(function (s, r) { return s + (Number(r.C) || 0); }, 0);
            merged.O = sg.reduce(function (s, r) { return s + (Number(r.O) || 0); }, 0);
            merged.epdo = sg.reduce(function (s, r) { return s + (Number(r.epdo) || 0); }, 0);
            merged.ka = merged.K + merged.A;
            out.push(merged);
        });
    });
    // Re-sort by EPDO descending (preserving CC 342's ordering)
    out.sort(function (a, b) { return (b.epdo || 0) - (a.epdo || 0); });
    return out;
}

window._normalizeRouteLabel = _normalizeRouteLabel;
window._fuzzyDedupeHotspots = _fuzzyDedupeHotspots;

// CC 346 §3 (was CC 343) — collapse `.report-section` blocks whose
// content is empty or gap-state only. Pure DOM walk. Called at the end
// of every generator (see §3.1 call sites). Never mutates the data store.

function autoCollapseEmptyReportSections() {
    var rootIds = [
        'reportOutput', 'rptOutput',
        'rptYearlySection', 'rptChartsSection', 'rptTablesSection', 'rptRecommendations',
        'comprehensiveReportOutput', 'comprehensivePreviewContent',
        'infographicOutput'
    ];
    var collapsed = 0;
    for (var i = 0; i < rootIds.length; i++) {
        var root = document.getElementById(rootIds[i]);
        if (!root) continue;
        var sections = root.querySelectorAll('.report-section');
        for (var s = 0; s < sections.length; s++) {
            var sec = sections[s];
            if (_isReportSectionEmpty(sec)) {
                sec.style.display = 'none';
                sec.setAttribute('data-cc346-collapsed', 'true');
                collapsed += 1;
            }
        }
    }
    if (collapsed > 0) {
        console.log('[Reports:autoCollapse] hid', collapsed, 'empty section(s).');
    }
}

function _isReportSectionEmpty(sec) {
    try {
        // Tables: if EVERY tbody row is a `.report-gap` placeholder OR there
        // are no body rows at all, count as empty. If any data row exists,
        // the section is NOT empty.
        var tables = sec.querySelectorAll('table');
        if (tables.length > 0) {
            for (var t = 0; t < tables.length; t++) {
                var bodyRows = tables[t].querySelectorAll('tbody tr');
                if (bodyRows.length === 0) continue;
                var allGap = true;
                for (var r = 0; r < bodyRows.length; r++) {
                    if (!bodyRows[r].querySelector('.report-gap')) { allGap = false; break; }
                }
                if (!allGap) return false;
            }
            return true;  // every table empty or gap-only
        }
        // Canvases: a section with ONLY a canvas of width 0 (Chart.js
        // never rendered) AND nothing else is empty.
        var canvases = sec.querySelectorAll('canvas');
        if (canvases.length > 0) {
            for (var c = 0; c < canvases.length; c++) {
                if (canvases[c].width > 0) return false;
            }
        }
        // Lists / images
        var lists = sec.querySelectorAll('ul, ol');
        for (var l = 0; l < lists.length; l++) {
            if (lists[l].children.length > 0) return false;
        }
        if (sec.querySelectorAll('img').length > 0) return false;
        // Last-resort: 40-char text floor. A section that's just an `<h4>`
        // + ~25 chars of helper text is empty.
        var txt = (sec.textContent || '').trim();
        return txt.length < 40;
    } catch (e) {
        // Defence-in-depth: any error means we KEEP the section visible
        // (today's behavior). Never collapse on uncertainty.
        console.warn('[Reports:autoCollapse] check threw — keeping section visible:', e);
        return false;
    }
}

function showReportSubTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('#tab-reports .grant-tabs .grant-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    if (tabName === 'standard') {
        document.getElementById('reportSubTabStandard').classList.add('active');
    } else if (tabName === 'beforeafter') {
        document.getElementById('reportSubTabBA').classList.add('active');
    }

    // Show/hide content
    document.querySelectorAll('#tab-reports .grant-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`reportSubTabContent-${tabName}`).classList.add('active');

    // Initialize BA location dropdown when switching to Before & After tab
    if (tabName === 'beforeafter') {
        initBALocationDropdown();
    }
    // CC 324 BUG K — populate the corridor/intersection legacy dropdowns when
    // the user opens the standard reports tab (catches aggregate-tier sessions
    // where crashState.aggregates is empty and initDropdowns left the selects
    // with just the placeholder option).
    if (tabName === 'standard') {
        populateReportLocations();
    }
}

/**
 * CC 324 BUG K — fill the legacy reportRoute / reportNode selects from
 * crashState.aggregates when those are populated (tier modes where rows are
 * loaded), else fall back to mv_hotspots so users on aggregate tiers can pick
 * a route or intersection. State-agnostic — mirrors the Hot Spots tab pattern.
 */
function populateReportLocations() {
    const routeSel = document.getElementById('reportRoute');
    const nodeSel = document.getElementById('reportNode');
    if (!routeSel && !nodeSel) return;

    const escHtml = s => String(s).replace(/[&<>"']/g, c => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));

    const fillRoutes = (entries) => {
        if (!routeSel || entries.length === 0) return;
        const opts = entries
            .filter(([name]) => name && name !== 'Unknown')
            .sort((a, b) => (b[1].total || 0) - (a[1].total || 0))
            .map(([name, d]) => `<option value="${escHtml(name)}">${escHtml(name)}${d.total ? ` (${Number(d.total).toLocaleString()} crashes)` : ''}</option>`)
            .join('');
        routeSel.innerHTML = '<option value="">All Routes</option>' + opts;
    };

    const fillNodes = (entries) => {
        if (!nodeSel || entries.length === 0) return;
        const opts = entries
            .filter(([id]) => id)
            .sort((a, b) => (b[1].total || 0) - (a[1].total || 0))
            .map(([id, d]) => {
                const label = d.label || d.intersection_name || (`Node ${id}`);
                return `<option value="${escHtml(id)}">${escHtml(label)}${d.total ? ` (${Number(d.total).toLocaleString()} crashes)` : ''}</option>`;
            })
            .join('');
        nodeSel.innerHTML = '<option value="">All Intersections</option>' + opts;
    };

    // 1) Prefer locally-loaded aggregates when present.
    const agg = (window.crashState && window.crashState.aggregates) || {};
    const routeEntries = Object.entries(agg.byRoute || {});
    const nodeEntries = Object.entries(agg.byNode || {});
    if (routeEntries.length > 0 || nodeEntries.length > 0) {
        fillRoutes(routeEntries);
        fillNodes(nodeEntries);
        return;
    }

    // 2) Aggregate-tier fallback — pull from mv_hotspots. Mirrors the canonical
    // matview reader at app/modules/hotspots/hotspots-tab-render.js.
    const dc = window.crashLensClient;
    if (!dc || !window.CL || !CL.data || !CL.data.supabaseBridge) return;
    const t = CL.data.supabaseBridge.resolveTier && CL.data.supabaseBridge.resolveTier();
    if (!t || !t.tier) return;
    const tierColMap = {
        federal: null, state: null, region: 'dot_district', mpo: 'mpo_name',
        planning_district: 'planning_district', county: 'planning_district',
        city: 'physical_juris_name', city_town: 'physical_juris_name'
    };
    const tierCol = tierColMap[t.tier];
    const stateKey = String(dc.state || '').toLowerCase();
    const params = new URLSearchParams({ state: 'eq.' + stateKey, select: '*', order: 'total_crashes.desc', limit: '500' });
    if (tierCol && t.value) params.set(tierCol, 'eq.' + t.value);
    fetch(`${dc.supabaseUrl}/mv_hotspots?${params.toString()}`, {
        headers: { apikey: dc.supabaseKey, Authorization: 'Bearer ' + dc.supabaseKey }
    })
        .then(r => r.ok ? r.json() : [])
        .then(rows => {
            if (!Array.isArray(rows) || rows.length === 0) return;
            const routeAgg = {};
            const nodeAgg = {};
            rows.forEach(r => {
                const total = Number(r.total_crashes) || 0;
                const rte = r.rte_name || r.route || '';
                if (rte && rte !== 'Unknown') {
                    if (!routeAgg[rte]) routeAgg[rte] = { total: 0 };
                    routeAgg[rte].total += total;
                }
                const nodeId = r.node_id || r.node || '';
                if (nodeId && String(nodeId) !== '0') {
                    if (!nodeAgg[nodeId]) nodeAgg[nodeId] = { total: 0, label: r.intersection_name || '' };
                    nodeAgg[nodeId].total += total;
                    if (r.intersection_name && !nodeAgg[nodeId].label) nodeAgg[nodeId].label = r.intersection_name;
                }
            });
            fillRoutes(Object.entries(routeAgg));
            fillNodes(Object.entries(nodeAgg));
        })
        .catch(e => console.warn('[Reports] populateReportLocations matview fallback failed:', e && e.message));
}

function updateReportOptions() {
    const type = document.getElementById('reportType').value;

    // Hide route/node selectors for countermeasures (uses CMF tab selection)
    const showRouteGroup = (type === 'corridor' || type === 'intersection');
    document.getElementById('reportRouteGroup').style.display = showRouteGroup ? 'flex' : 'none';
    document.getElementById('reportNodeGroup').style.display = type === 'intersection' ? 'flex' : 'none';
    // CC 324 BUG K — top-up the dropdowns when the user switches to a
    // corridor/intersection report type. Idempotent (no-op if already filled).
    if (showRouteGroup) populateReportLocations();

    // Show/hide CMF location info for countermeasures report
    let cmfLocationInfo = document.getElementById('cmfLocationInfo');
    if (!cmfLocationInfo) {
        // Create the info element if it doesn't exist
        const container = document.getElementById('reportRouteGroup').parentElement;
        cmfLocationInfo = document.createElement('div');
        cmfLocationInfo.id = 'cmfLocationInfo';
        cmfLocationInfo.className = 'filter-group';
        cmfLocationInfo.style.flex = '2';
        container.insertBefore(cmfLocationInfo, document.getElementById('reportRouteGroup'));
    }

    if (type === 'countermeasures') {
        if (cmfState.selectedLocation && cmfState.locationCrashes.length > 0) {
            const locName = cmfState.selectedLocation.type === 'node'
                ? `Node ${cmfState.selectedLocation.name}`
                : formatRouteName(cmfState.selectedLocation.name);
            cmfLocationInfo.innerHTML = `
                <label>Selected Location (from Countermeasures tab)</label>
                <div style="padding:.5rem .75rem;background:#dcfce7;border:2px solid #22c55e;border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center">
                    <span>
                        <strong style="color:#166534">${cmfState.selectedLocation.type === 'node' ? '🚦' : '🛣️'} ${locName}</strong>
                        <span style="color:#15803d;margin-left:.5rem">(${cmfState.locationCrashes.length} crashes)</span>
                    </span>
                    <button class="btn btn-sm" style="background:#22c55e;color:white;padding:.2rem .5rem;font-size:.7rem" onclick="showTab('cmf')">Change</button>
                </div>
            `;
            cmfLocationInfo.style.display = 'flex';
        } else {
            cmfLocationInfo.innerHTML = `
                <label>Selected Location</label>
                <div style="padding:.5rem .75rem;background:#fef3c7;border:2px solid #f59e0b;border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center">
                    <span style="color:#92400e">⚠️ No location selected</span>
                    <button class="btn btn-sm" style="background:#f59e0b;color:white;padding:.2rem .5rem;font-size:.7rem" onclick="showTab('cmf')">Select Location</button>
                </div>
            `;
            cmfLocationInfo.style.display = 'flex';
        }
    } else if (type === 'beforeafter') {
        if (baState.selectedLocation && baState.locationCrashes.length > 0) {
            cmfLocationInfo.innerHTML = `
                <label>Selected Location (from Before/After tab)</label>
                <div style="padding:.5rem .75rem;background:#dcfce7;border:2px solid #22c55e;border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center">
                    <span>
                        <strong style="color:#166534">📍 ${baState.locationName || 'Selected Location'}</strong>
                        <span style="color:#15803d;margin-left:.5rem">(${baState.locationCrashes.length} crashes)</span>
                    </span>
                    <button class="btn btn-sm" style="background:#22c55e;color:white;padding:.2rem .5rem;font-size:.7rem" onclick="showTab('beforeafter')">Change</button>
                </div>
            `;
            cmfLocationInfo.style.display = 'flex';
        } else {
            cmfLocationInfo.innerHTML = `
                <label>Selected Location</label>
                <div style="padding:.5rem .75rem;background:#fef3c7;border:2px solid #f59e0b;border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center">
                    <span style="color:#92400e">⚠️ No location selected - go to Before/After tab first</span>
                    <button class="btn btn-sm" style="background:#f59e0b;color:white;padding:.2rem .5rem;font-size:.7rem" onclick="showTab('beforeafter')">Select Location</button>
                </div>
            `;
            cmfLocationInfo.style.display = 'flex';
        }
    } else {
        cmfLocationInfo.style.display = 'none';
    }

    // Update title based on type
    const titles = {
        'corridor': 'Corridor & Segment Analysis Report',
        'intersection': 'Intersection Safety Analysis Report',
        'dashboard': 'Executive Dashboard Summary',
        'systemwide': 'System-Wide Crash Summary',
        'safety': 'Safety Performance Report',
        'safetyfocus': 'Safety Focus Category Report',
        'pedbike': 'Vulnerable Road User Safety Report',
        'trend': 'Multi-Year Trend Analysis Report',
        'countermeasures': 'Countermeasures Effectiveness Report',
        'infographic': 'Traffic Safety Report',
        'comprehensive': 'Quarterly Traffic Safety Report',
        'crashtree': 'Systemic Safety Analysis Report',
        'fatalspeed': 'Fatal & Speed-Related Analysis Report',
        'hotspot': 'High-Crash Location Report',
        'beforeafter': 'Before/After Study Report',
        'grantsupport': 'Grant Application Support Package'
    };
    document.getElementById('reportTitle').value = titles[type] || 'Crash Analysis Report';

    // Stale-report fix: switching the report type clears any previously
    // rendered report from view so the user never mistakes it for the new one.
    _hideAllReportOutputs();
}

/**
 * Round 14 §7 — shared AI context builder used by the 5 AI chats
 * (Countermeasure, Domain Knowledge, MUTCD, Grant Search, Grant Writing).
 * Each chat now starts every prompt with a JSON header that captures the
 * user's active state, jurisdiction, road-type, and selected location row
 * (when one of the LocationPicker dropdowns has a value). State-agnostic.
 *
 * Returns an object — callers JSON.stringify it and prepend to the user
 * prompt. Lookups are best-effort: missing pieces simply land as null in
 * the context.
 */
function buildAIContext() {
    const stateKey = (window.crashLensClient && window.crashLensClient.state)
        ? String(window.crashLensClient.state).toLowerCase() : '';

    let tier = null, jurisdiction = null, roadType = null;
    try {
        if (window.CL && CL.data && CL.data.supabaseBridge && typeof CL.data.supabaseBridge.resolveTier === 'function') {
            const t = CL.data.supabaseBridge.resolveTier();
            if (t) { tier = t.tier; jurisdiction = t.value; }
            const rt = (CL.data.supabaseBridge.roadTypeSpec && CL.data.supabaseBridge.roadTypeSpec()) || {};
            roadType = rt.noInterstate ? 'all_no_interstate'
                       : (rt.roadType || (Array.isArray(rt.roadTypes) && rt.roadTypes[0]) || 'all');
        }
    } catch (e) { /* fall through */ }

    const ctx = {
        state: stateKey,
        tier: tier,
        jurisdiction: jurisdiction,
        road_type: roadType,
        active_location: null,
    };

    // Locate the active LocationPicker selection from any of the 7 dropdowns
    // wired in Round 13 (cmf, warrant, dk, report, ba, newApp, mutcd).
    const ids = [
        'cmfLocationSelect', 'warrantLocationSelect', 'dkLocationSelect',
        'reportLocationSelect', 'baLocationSelect', 'newAppLocation',
        'mutcdLocationSelect',
    ];
    if (window.LocationPicker && typeof window.LocationPicker.resolveValue === 'function') {
        for (const id of ids) {
            const el = document.getElementById(id);
            if (!el || !el.value) continue;
            const row = window.LocationPicker.resolveValue(el.value);
            if (row) {
                ctx.active_location = {
                    type:    row.location_type,
                    name:    row.location_name,
                    display: row.display_name,
                    total:   row.total_crashes,
                    k:       row.k,
                    a:       row.a,
                    county:  row.jurisdiction_county || null,
                    mpo:     row.jurisdiction_mpo || null,
                };
                break;
            }
        }
    }
    return ctx;
}

/**
 * Round 14 §0.2 — defensive accessor for crashState.aggregates paths used
 * across the Reports tab. In Supabase-only mode the aggregates object can be
 * partially initialised (e.g. byCollision is empty when no row hydration ran),
 * which crashed Comprehensive Quarterly with "Cannot read properties of
 * undefined (reading 'count')". _safeAgg returns the requested nested value
 * or the supplied fallback when any segment is missing.
 *
 * Usage: _safeAgg('byCollision.Angle.count', 0)
 */
function _safeAgg(path, fallback) {
    try {
        if (typeof crashState === 'undefined' || !crashState || !crashState.aggregates) return fallback;
        const parts = String(path).split('.');
        let v = crashState.aggregates;
        for (const p of parts) {
            if (v == null) return fallback;
            v = v[p];
        }
        return v == null ? fallback : v;
    } catch (e) {
        return fallback;
    }
}

/**
 * Round 14 §0.3 — per-type Supabase data dispatcher for the Reports tab.
 * Returns a Promise that resolves to a payload bundle the matching report
 * generator can read from window._reportDataCache, OR returns null to let
 * the legacy row-hydration code-path render the report (for types that
 * already work end-to-end without a Supabase pre-fetch — comprehensive,
 * infographic, executive_summary).
 *
 * Each report type maps to an existing data-client method. State-agnostic —
 * keys on tier resolved from the supabase-bridge.
 */
// Round 23 §1.1 — for matview-friendly report types, skip the 100K-row pull
// and hydrate aggregations directly from matviews. Mirrors what each tab
// already reads from Supabase. Cuts report-generate wall time from 50-100s
// to ~3s. State-agnostic: keys on resolved tier + stateKey.
async function hydrateReportFromMatviews(reportType, tier, value, yearRange) {
    const dc = window.crashLensClient;
    if (!dc || !window.CL || !CL.data || !CL.data.supabaseBridge) return null;
    // Route through resolveTier() so Reports applies the same silent
    // county→planning_district (and county→region) rollup that the
    // Dashboard / Hot Spots / Safety Focus tabs use. Without this, a
    // Delaware/Sussex caller passes (county, Sussex) straight into
    // mv_hotspots, which has rows only under planning_district='South
    // District' → 0 rows → undefined downstream fields → textContent
    // null crash (the sibling fix in this PR). Falls back to the raw
    // tier/value args if resolveTier isn't available (defensive).
    let effTier = tier, effValue = value;
    if (typeof CL.data.supabaseBridge.resolveTier === 'function') {
        const t = CL.data.supabaseBridge.resolveTier();
        if (t && t.tier) { effTier = t.tier; effValue = t.value; }
    }
    const tierColMap = {
        federal: null, state: null, region: 'dot_district', mpo: 'mpo_name',
        planning_district: 'planning_district', county: 'planning_district',
        city: 'physical_juris_name', city_town: 'physical_juris_name'
    };
    const tierCol = tierColMap[effTier];
    const stateKey = String(dc.state || '').toLowerCase();
    // CC 329 — observability for the still-leaking-scope mystery. Logs the
    // resolved scope so the user can verify in DevTools that Sussex County
    // is rolling up to its PD (not silently fetching state-wide rows).
    console.log('[Report] resolveTier →', { effTier, effValue, originalTier: tier, originalValue: value, tierCol, stateKey });
    // CC 329 — refuse-and-warn guard: if the matview has a tier column to
    // filter on but resolveTier handed us no value, every fetcher would
    // silently return state-wide rows and the report would render an
    // incorrect total. Better to bail out so the caller falls back to the
    // row-level hydration path (or surfaces an error) than to mislead.
    if (tierCol && !effValue) {
        console.warn(`[Report] resolveTier returned ${effTier} with null value — refusing to fetch state-wide rows (would leak scope)`);
        return null;
    }
    const headers = { apikey: dc.supabaseKey, Authorization: 'Bearer ' + dc.supabaseKey };
    const baseParams = (extra = {}) => {
        const p = new URLSearchParams({ state: 'eq.' + stateKey, ...extra });
        if (tierCol && effValue) p.set(tierCol, 'eq.' + effValue);
        return p.toString();
    };
    const fetchJson = async (path, extra) => {
        try {
            const r = await fetch(`${dc.supabaseUrl}/${path}?${baseParams(extra)}`, { headers });
            return r.ok ? await r.json() : [];
        } catch (e) {
            return [];
        }
    };

    // CC 324 BUGs E/H — fetch mv_safety_focus_locations alongside the existing
    // matviews so the dashboard report's Top Locations section can render real
    // top-N per category at aggregate tiers (same matview the Safety Focus
    // detail panel uses).
    //
    // CC 327 — route through CL.data.cachedMatview so back-to-back Generate
    // clicks on the same (mvName, effTier, effValue) hit the in-memory cache
    // (~1.1s → <50ms). Cache keys aligned with CL.data.prewarm literals where
    // possible so prewarm slots are shared. Notes:
    //   - mv_hotspots prewarm uses {limit:25}; Reports needs 100 rows →
    //     separate cache slot (intentional, both kept hot independently).
    //   - mv_safety_focus_locations / mv_fatal_factors / mv_speed_summary
    //     aren't prewarmed today, so first click is cold; re-click is hot.
    // CC 329 — observability for the cache-not-engaging mystery. Logs a
    // per-matview pre-hit flag so re-clicks within TTL can be verified to
    // hit the in-memory cache. If any preHit is false on a second generate
    // within ~60s of the first, the cache-key drifted between calls.
    const cached = (mvName, fetcher, keyExtra) => {
        const cacheKey = `${mvName}:${effTier || ''}:${effValue || ''}` + (keyExtra != null ? ':' + JSON.stringify(keyExtra) : '');
        let preHit = false;
        try {
            const stats = CL.data.matviewCacheStats && CL.data.matviewCacheStats();
            if (stats && Array.isArray(stats.entries)) {
                preHit = stats.entries.some(e => e && e.key === cacheKey);
            }
        } catch (e) { /* non-fatal */ }
        console.log(`[Report cache] ${mvName} key=${cacheKey} preHit=${preHit}`);
        return CL.data.cachedMatview(mvName, effTier, effValue, fetcher, keyExtra);
    };
    // CC 329 — defense-in-depth arrify. cachedMatview returns the fetcher's
    // resolved value unchanged; if for any reason a downstream caller stored
    // a wrapped object (e.g. {rows:[…]} from an upstream API shape drift),
    // every downstream `.forEach`/`.map` would throw `forEach is not a
    // function`. Coerce to array here so generators can assume array shape.
    const arrify = (x) => Array.isArray(x) ? x
                        : (x && Array.isArray(x.rows)) ? x.rows
                        : (x && Array.isArray(x.data)) ? x.data
                        : [];
    const t0 = performance.now();
    const [dashRaw, hotspotsRaw, fatalRaw, speedRaw, safetyRaw, intersectionRaw, analysisRaw, safetyLocationsRaw] = await Promise.all([
        cached('dashboard_summary',          () => fetchJson('dashboard_summary', { select: 'crash_count,fatals,serious_injuries,total_injured,ped_crashes,bike_crashes,speed_crashes,night_crashes,alcohol_crashes,animal_crashes,crash_severity,crash_year,collision_type,functional_class,road_type,is_interstate' })),
        cached('mv_hotspots',                () => fetchJson('mv_hotspots', { select: '*', order: 'total_crashes.desc', limit: '100' }), { limit: 100 }),
        cached('mv_fatal_factors',           () => fetchJson('mv_fatal_factors', { select: '*' })),
        cached('mv_speed_summary',           () => fetchJson('mv_speed_summary', { select: '*' })),
        cached('mv_safety_categories',       () => fetchJson('mv_safety_categories', { select: '*' })),
        cached('mv_intersection_summary',    () => fetchJson('mv_intersection_summary', { select: 'intersection_type,traffic_control_type,collision_type,total,k,a,b,c,o,crash_year' })),
        cached('mv_analysis_summary',        () => fetchJson('mv_analysis_summary', { select: 'dimension,dim_value,total,k,a,b,c,o' })),
        cached('mv_safety_focus_locations',  () => fetchJson('mv_safety_focus_locations', { select: '*', order: 'total.desc', limit: '500' }), { limit: 500 })
    ]);
    let   dash             = arrify(dashRaw);
    const hotspots         = arrify(hotspotsRaw);
    const fatal            = arrify(fatalRaw);
    const speed            = arrify(speedRaw);
    const safety           = arrify(safetyRaw);
    let   intersection     = arrify(intersectionRaw);
    const analysis         = arrify(analysisRaw);
    const safetyLocations  = arrify(safetyLocationsRaw);

    // Timeframe-filter fix (year-level). dashboard_summary and
    // mv_intersection_summary carry crash_year, so a calendar-year range can be
    // applied client-side here. The pre-aggregated ranking matviews (hotspots /
    // fatal / speed / safety / analysis / safety-focus locations) have no
    // crash_year and therefore stay all-years — the report surfaces a caveat
    // when _yearFiltered is set.
    if (yearRange && (yearRange.startYear != null || yearRange.endYear != null)) {
        const inYears = (y) => {
            const yy = Number(y);
            if (!isFinite(yy)) return false;
            if (yearRange.startYear != null && yy < yearRange.startYear) return false;
            if (yearRange.endYear != null && yy > yearRange.endYear) return false;
            return true;
        };
        dash = dash.filter(r => inYears(r.crash_year));
        intersection = intersection.filter(r => inYears(r.crash_year));
    }
    console.log(`[Report] Matview hydration complete in ${Math.round(performance.now() - t0)}ms (scope=${effTier}:${effValue || '∅'}, yearRange=${yearRange ? JSON.stringify(yearRange) : 'all'})`);

    const aggregated = {
        total: dash.reduce((s, r) => s + (Number(r.crash_count) || 0), 0),
        fatals: dash.reduce((s, r) => s + (Number(r.fatals) || 0), 0),
        seriousInjuries: dash.reduce((s, r) => s + (Number(r.serious_injuries) || 0), 0),
        totalInjured: dash.reduce((s, r) => s + (Number(r.total_injured) || 0), 0),
        ped: dash.reduce((s, r) => s + (Number(r.ped_crashes) || 0), 0),
        bike: dash.reduce((s, r) => s + (Number(r.bike_crashes) || 0), 0),
        speed: dash.reduce((s, r) => s + (Number(r.speed_crashes) || 0), 0),
        night: dash.reduce((s, r) => s + (Number(r.night_crashes) || 0), 0),
        alcohol: dash.reduce((s, r) => s + (Number(r.alcohol_crashes) || 0), 0),
        animal: dash.reduce((s, r) => s + (Number(r.animal_crashes) || 0), 0),
        bySeverity: { K: 0, A: 0, B: 0, C: 0, O: 0 },
        byYear: {},
        // CC 324 BUG E — per-year severity + VRU breakdown so the YoY table
        // renders non-zero K/A/Ped/Bike per row. Same dashboard_summary rows,
        // just grouped (year × severity) instead of year only.
        byYearDetail: {},
        byCollision: {},
        byFuncClass: {},
        topHotspots: hotspots,
        fatalFactors: fatal,
        speedSummary: speed,
        safetyCategories: safety,
        intersectionSummary: intersection,
        analysisSummary: analysis,
        safetyFocusLocations: safetyLocations,
        // CC 329 — expose the scope this aggregation was computed over so
        // generators can introspect (and the caller can log it next to the
        // total). Helps diagnose the Sussex-shows-Delaware-total leak.
        _scope: { tier: effTier, value: effValue },
        // Timeframe-filter fix — true when totals/severity/year/collision and
        // intersection aggregates were filtered to a calendar-year range while
        // the ranking matviews remain all-years (no crash_year column). Lets
        // generators render an "approximate to whole years" caveat.
        _yearFiltered: !!(yearRange && (yearRange.startYear != null || yearRange.endYear != null)),
        _yearRange: yearRange || null,
    };
    dash.forEach(r => {
        const sev = String(r.crash_severity || '').charAt(0).toUpperCase();
        const cnt = Number(r.crash_count) || 0;
        if (sev in aggregated.bySeverity) aggregated.bySeverity[sev] += cnt;
        const y = r.crash_year;
        if (y) {
            aggregated.byYear[y] = (aggregated.byYear[y] || 0) + cnt;
            if (!aggregated.byYearDetail[y]) {
                aggregated.byYearDetail[y] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0 };
            }
            const yd = aggregated.byYearDetail[y];
            yd.total += cnt;
            if (sev in aggregated.bySeverity) yd[sev] += cnt;
            yd.ped += Number(r.ped_crashes) || 0;
            yd.bike += Number(r.bike_crashes) || 0;
        }
        if (r.collision_type) aggregated.byCollision[r.collision_type] = (aggregated.byCollision[r.collision_type] || 0) + cnt;
        if (r.functional_class) aggregated.byFuncClass[r.functional_class] = (aggregated.byFuncClass[r.functional_class] || 0) + cnt;
    });
    return aggregated;
}
window.hydrateReportFromMatviews = hydrateReportFromMatviews;

async function fetchReportDataForType(reportType, ctx) {
    if (!window.crashLensClient || !window.CL || !CL.data || !CL.data.supabaseBridge) return null;
    const t = CL.data.supabaseBridge.resolveTier();
    const stateKey = (window.crashLensClient.state || '').toLowerCase();
    const c = window.crashLensClient;
    const rt = (CL.data.supabaseBridge.roadTypeSpec && CL.data.supabaseBridge.roadTypeSpec()) || {};
    const roadType = rt.noInterstate ? 'all_no_interstate'
                    : (rt.roadType || (Array.isArray(rt.roadTypes) && rt.roadTypes[0]) || 'all');
    ctx = ctx || {};

    try {
        switch (reportType) {
            case 'comprehensive':
            case 'infographic':
            case 'executive_summary':
                return null; // existing flow (with _safeAgg) handles these
            case 'corridor':
            case 'segment_analysis':
                if (!ctx.locationName) return { error: 'Select a location.' };
                return c.getHotspotDetail(stateKey, 'segment', ctx.locationName);
            case 'crashtree':
            case 'systemic':
                return c.getCrashTree(t.tier, t.value, { roadType });
            case 'safety':
            case 'safety_focus':
            case 'safetyfocus':
                return c.getSafetyCategories(t.tier, t.value, { roadType });
            case 'fatal_speed':
            case 'fatalspeed':
                return Promise.all([
                    c.getFatalFactors(t.tier, t.value, { roadType }),
                    c.getSpeedSummary(t.tier, t.value, { roadType }),
                    c.getSafetyFocusLocations(t.tier, t.value, 'speed', { limit: 25 }),
                ]).then(([fatal, speed, locs]) => ({ fatal, speed, locs }));
            case 'hotspot':
                return c.getHotspots(t.tier, t.value, { roadType, limit: 25 });
            case 'intersection':
                return c.getIntersectionSummary(t.tier, t.value, { roadType });
            case 'pedbike':
                return Promise.all([
                    c.getPedBikeLocations(t.tier, t.value, 'pedestrian', { limit: 25 }),
                    c.getPedBikeLocations(t.tier, t.value, 'bicycle',    { limit: 25 }),
                ]).then(([ped, bike]) => ({ ped, bike }));
            case 'countermeasures':
                // Countermeasures uses the in-memory cmfLibrary; no matview wiring needed.
                return null;
            case 'beforeafter':
                if (!ctx.locationName || !ctx.installDate) return { error: 'Provide Treatment Date and Location.' };
                return c.runBeforeAfterStudy({
                    state: stateKey,
                    locationName: ctx.locationName,
                    locationType: ctx.locationType || 'segment',
                    installDate: ctx.installDate,
                });
            case 'grant':
            case 'grantsupport':
                return c.getGrantReadyLocations({ roadType, limit: 50 });
            case 'performance':
            case 'trend':
                return c.getSafetyCategories(t.tier, t.value, { roadType });
            default:
                return null;
        }
    } catch (e) {
        console.warn('[Report] fetchReportDataForType(' + reportType + ') failed:', e && e.message);
        return null;
    }
}

// ── Report output management (stale-report fix) ──────────────────────────
// There are three mutually-exclusive report output containers. Historically
// each generation path showed its own container but only the comprehensive
// path hid the other two — so switching Comprehensive → any other report left
// the old 20-page report stranded below the new one. _hideAllReportOutputs()
// is called at the very start of generation so exactly one report is ever
// visible; each path re-shows only its own container afterward.
function _hideAllReportOutputs() {
    ['reportOutput', 'infographicOutput', 'comprehensiveReportOutput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

// Clear the standard-report sub-sections so a report that doesn't populate a
// given section can't show the *previous* report's content there. Resets the
// optional Executive Summary / Table of Contents boxes back to hidden too.
function _resetStandardReportSections() {
    ['rptKPIs', 'rptFindings', 'rptYearlySection', 'rptChartsSection',
     'rptTablesSection', 'rptCountermeasures', 'rptRecommendations',
     'rptExecContent', 'rptTOCContent'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });
    ['rptExecutiveSummary', 'rptTableOfContents'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

// Auto re-run hook for the timeframe filter. Wired to the Start/End date
// inputs (onchange) and the 3 Mo / 6 Mo / 1 Yr / 3 Yr / 5 Yr / Clear quick
// buttons (as their optional callback). Only regenerates when a report is
// already on screen — never fires before the user's first Generate. Debounced
// so typing a date or rapid button clicks collapse into one regeneration.
function _reportDateChanged() {
    const anyVisible = ['reportOutput', 'infographicOutput', 'comprehensiveReportOutput']
        .some(id => { const el = document.getElementById(id); return el && el.style.display !== 'none'; });
    if (!anyVisible) return;
    if (window._reportDateDebounce) clearTimeout(window._reportDateDebounce);
    window._reportDateDebounce = setTimeout(() => {
        if (typeof generateReport === 'function') generateReport();
    }, 250);
}

function generateReport() {
    let type = document.getElementById('reportType').value;
    // Backward compatibility: map systemwide to dashboard
    if (type === 'systemwide') type = 'dashboard';

    // Round 15 §12.9 — validate location before kicking off generation.
    // Corridor / intersection report types require a route or node — without
    // one the generators silently produce an empty PDF. Surface a clear toast
    // and focus the input instead of failing silently. countermeasures and
    // beforeafter are still validated downstream against their own state.
    if (type === 'corridor' || type === 'intersection') {
        const routeEl = document.getElementById('reportRoute');
        const nodeEl  = document.getElementById('reportNode');
        const hasRoute = routeEl && String(routeEl.value || '').trim();
        const hasNode  = (type === 'intersection') ? (nodeEl && String(nodeEl.value || '').trim()) : true;
        if (!hasRoute || (type === 'intersection' && !hasNode)) {
            const fld = (!hasRoute) ? 'Route' : 'Node';
            const target = (!hasRoute) ? routeEl : nodeEl;
            if (typeof showToast === 'function') {
                showToast('This report type requires a ' + fld + '. Please select one before generating.', 'warning', 5000);
            }
            // CC 361 — clear any stale report and render an inline empty-state so
            // the user never mistakes the previous report for the new one. Covers
            // both corridor (no Route) and intersection (no Route/Node) since both
            // funnel through generateReport(). Replaces the old modal alert
            // fallback — the empty-state is the visible feedback.
            const label = (type === 'intersection') ? 'Intersection Safety Analysis'
                                                    : 'Corridor & Segment Analysis';
            const missing = (type === 'intersection') ? 'an Intersection (node) selection'
                                                      : 'a Route or Corridor selection';
            const howTo = (type === 'intersection')
                ? 'Pick a specific intersection from the Location dropdown above, then click Generate Report again. To see top intersections county-wide, use the High-Crash Location (Hotspot) report instead.'
                : 'Pick a specific route from the Location dropdown above, then click Generate Report again. To analyze every route, use the Safety Performance or Multi-Year Trend reports instead.';
            if (typeof renderRequiredInputEmptyState === 'function') {
                renderRequiredInputEmptyState(label, missing, howTo);
            }
            if (target && typeof target.focus === 'function') target.focus();
            return;
        }
    }

    showLoading('Generating report...');

    // CC 328 BUG I — overlay watchdog. The "Generating report..." overlay is
    // page-level fixed (covers the whole window); if a generator hangs
    // (Infographic / Comprehensive / Hotspot — open as of CC 329), the
    // user can't even switch tabs. After 30s, dismiss the overlay and
    // surface a clear error so the page stays usable. The check on the
    // overlay's `visible` class avoids an annoying alert on the normal
    // success path (where hideLoading already fired before 30s elapsed).
    if (window._reportWatchdog) clearTimeout(window._reportWatchdog);
    window._reportWatchdog = setTimeout(() => {
        const ov = document.getElementById('loadingOverlay');
        if (ov && ov.classList.contains('visible')) {
            hideLoading();
            alert('Report generation timed out after 30 seconds. Check the console for details.');
        }
        window._reportWatchdog = null;
    }, 30000);
    // CC 328 BUG J — timing markers so the next hang investigation can pinpoint
    // which step is slow (matview hydrate vs row hydrate vs the per-type
    // generator vs DOM mount). Logs are cheap; remove later if noisy.
    const _reportT0 = performance.now();
    const _reportType = type;
    const _reportMark = (label) =>
        console.log(`[Report:${_reportType}] ${label} @${Math.round(performance.now() - _reportT0)}ms`);
    _reportMark('start');

    // Round 14 §0.3 — kick off the per-type Supabase pre-fetch in parallel
    // with the row hydration. The result lands on window._reportDataCache for
    // generators that opt in; legacy generators continue to read crashState
    // unchanged. Errors here are non-fatal — generators fall back to the
    // legacy data path.
    try {
        const reportLocSelect = document.getElementById('reportLocationSelect');
        const installDateEl = document.getElementById('baTreatmentDate');
        const pickerRow = (window.LocationPicker && reportLocSelect)
            ? window.LocationPicker.resolveValue(reportLocSelect.value)
            : null;
        const ctx = {
            locationName: pickerRow ? pickerRow.location_name : null,
            locationType: pickerRow ? pickerRow.location_type : null,
            installDate:  installDateEl ? installDateEl.value : null,
        };
        Promise.resolve(fetchReportDataForType(type, ctx))
            .then(data => {
                if (data && data.error) {
                    console.warn('[Report] Pre-fetch error for', type, ':', data.error);
                    return;
                }
                if (data) window._reportDataCache = data;
            })
            .catch(e => console.warn('[Report] Pre-fetch failed:', e && e.message));
    } catch (e) {
        console.warn('[Report] Pre-fetch setup failed:', e && e.message);
    }

    // CC 330 — unwrap the setTimeout(async ()=>{},100) IIFE into a top-level
    // async runner. Pure readability — the await-Promise/setTimeout-50 at the
    // top preserves the deferred-tick yield so the spinner paints before any
    // heavy work begins. The .catch on the call site guarantees that any
    // unexpected throw still releases the spinner.
    _runReportGeneration(type, _reportT0, _reportMark).catch(err => {
        console.error('[Report] dispatcher crashed:', err);
        hideLoading();
    });
}

// CC 333 — shared gap-state renderer for report types that fundamentally need
// per-row data (countermeasures, before/after). Populates the existing report
// sub-elements (never overwrites #reportOutput, which would destroy the
// template the other generators depend on) with an explanatory panel plus a
// one-click link to the relevant live tab. All arguments are static strings
// controlled by the caller (no user input), so innerHTML injection is safe.
function _renderReportGapState(title, heading, body, tabId, buttonLabel, howTo) {
    const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
    const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    setTxt('rptTitle', title);
    setTxt('rptSubtitle', heading);
    setTxt('rptMeta', '');
    set('rptFindings',
        '<div style="padding:1.5rem;color:#78350f;background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;max-width:700px;margin:1rem auto;text-align:center;">' +
        '<p style="margin:0 0 .75rem;font-weight:600;color:#92400e;">' + heading + '</p>' +
        '<p style="margin:0 0 1rem;">' + body + '</p>' +
        '<p style="margin:0 0 1rem;">' + howTo + '</p>' +
        '<button class="btn btn-sm" style="background:#f59e0b;color:#fff;padding:.4rem .9rem;font-size:.8rem;border:none;border-radius:6px;cursor:pointer" onclick="showTab(\'' + tabId + '\')">' + buttonLabel + '</button>' +
        '</div>');
    ['rptKPIs','rptYearlySection','rptChartsSection','rptTablesSection','rptRecommendations','rptCountermeasures'].forEach(id => set(id, ''));
    const out = document.getElementById('reportOutput');
    if (out) { out.style.display = 'block'; out.scrollIntoView({ behavior: 'smooth' }); }
}

// CC 361 — render an inline empty-state inside the standard report output when a
// report type requires a user selection that isn't set. Mirrors the known-safe
// _renderReportGapState pattern above: writes into the rpt* sub-elements and
// NEVER overwrites #reportOutput, so the report template survives and the next
// valid report renders normally. All arguments are static strings controlled by
// the caller (no user input), so innerHTML is safe.
function renderRequiredInputEmptyState(reportLabel, missingInputName, howToFix) {
    const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
    const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    setTxt('rptTitle', reportLabel + ' — selection required');
    setTxt('rptSubtitle', '');
    setTxt('rptMeta', '');
    set('rptFindings',
        '<div style="padding:2rem;text-align:center;background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;max-width:700px;margin:1rem auto">' +
        '<h3 style="color:#92400e;margin-top:0">' + reportLabel + ' — selection required</h3>' +
        '<p style="color:#78350f">This report needs <strong>' + missingInputName + '</strong> before it can run.</p>' +
        (howToFix ? '<p style="color:#78350f">' + howToFix + '</p>' : '') +
        '</div>');
    ['rptKPIs','rptYearlySection','rptChartsSection','rptTablesSection','rptRecommendations','rptCountermeasures']
        .forEach(id => set(id, ''));
    const out = document.getElementById('reportOutput');
    if (out) { out.style.display = 'block'; out.scrollIntoView({ behavior: 'smooth' }); }
    ['infographicOutput','comprehensiveReportOutput']
        .forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
}
window.renderRequiredInputEmptyState = renderRequiredInputEmptyState;

// CC 341 F5 — auto-regenerate the open report when jurisdiction/tier/state changes.
// Purely additive: wires listeners once. Only regenerates when a report output is
// already visible — we never generate on the user's behalf before they've clicked
// Generate (that would mask the explicit "go" gesture and waste data pulls while
// they're just exploring jurisdictions).
(function _wireReportsAutoUpdate() {
    if (window._reportsAutoUpdateWired) return;
    window._reportsAutoUpdateWired = true;
    var DEBOUNCE_MS = 600;
    var _debounceTimer = null;
    function _maybeRegenerate(reason) {
        var anyReportVisible = ['reportOutput', 'infographicOutput', 'comprehensiveReportOutput']
            .map(function(id){ var el = document.getElementById(id); return el && el.style.display !== 'none'; })
            .some(Boolean);
        if (!anyReportVisible) return;
        clearTimeout(_debounceTimer);
        _debounceTimer = setTimeout(function() {
            console.log('[Reports:autoUpdate] regenerating because:', reason);
            try {
                var fn = window.generateReport
                      || (window.CL && window.CL.reports && window.CL.reports.standardCore && window.CL.reports.standardCore.generateReport);
                if (typeof fn === 'function') fn();
            } catch (e) {
                console.warn('[Reports:autoUpdate] generateReport threw — user can click Generate manually:', e);
            }
        }, DEBOUNCE_MS);
    }
    // The app dispatches a `jurisdictionChanged` CustomEvent on `document`
    // (app/index.html — fired after every state/tier/jurisdiction change). Listen
    // there, plus a belt-and-suspenders `change` on the header selects in case the
    // event path changes. Any missing element/event is simply a no-op — safe.
    document.addEventListener('jurisdictionChanged', function() { _maybeRegenerate('jurisdictionChanged'); });
    // CC 359 — the View-Level / tier switch (county↔state↔region↔MPO↔planning
    // district↔city) dispatches `tierChanged` on `document` (core/tier.js,
    // spatial/geo-tier.js) without firing a `change` on any wired <select>, so
    // the listeners below alone never caught it. Listen for the real event on
    // its real target. (The app emits `tierChanged`, NOT `TierEvent` — that
    // string is only a transit-tab console prefix — and dispatches on
    // `document`, not `window`.)
    document.addEventListener('tierChanged', function() { _maybeRegenerate('tierChanged'); });
    ['stateSelect', 'jurisdictionSelect', 'tierRegionSelect', 'tierMPOSelect', 'tierPlanningDistrictSelect', 'tierCountySelect', 'tierCitySelect']
        .forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('change', function() { _maybeRegenerate('select:' + id); });
        });
})();

// CC 330 — race matview + row-hydrate against a 25s timer so the dispatcher
// can never sit past the 30s overlay watchdog. The MATVIEW set stays narrow
// (only generators that read matview data — window._reportMatviewData or, for
// infographic, their own _supabaseMode matview fetch); everything else uses
// the row-hydrate fallback (≤100k rows over ~10 chunks).
//
// CC 332 — infographic joins the matview set: generateInfographic already has
// a complete _supabaseMode matview path (app/index.html) but was never reached
// because row-hydrate at aggregate tier hung the full 25s budget. Routing it
// through the matview branch hands it a stub crash array, which triggers that
// existing path and renders in ~2-3s like Dashboard.
//
// CC 351 — comprehensive joins the matview set for the same reason. At aggregate
// tiers (state/region/MPO/PD) and large counties (e.g. New Castle, Delaware) the
// comprehensive report previously fell into the row-hydrate fallback and timed
// out at the 25s budget before generateComprehensiveReport was ever reached.
// Routing it through the matview branch populates window._reportMatviewData and
// hands it a stub array; generateComprehensiveReport now has its own matview-mode
// path (reports-standard-core2.js) that renders from those aggregates in ~2-3s.
//
// Promise.race leaks the slow promise on timeout — accept it. The
// dispatched fetch eventually resolves into the void; the next click resets
// window._reportMatviewData. Memory cost is negligible.
async function _hydrateWithBudget(type, route, startDate, endDate, _reportMark) {
    // CC 353 — tightened 25s → 15s. The matview path resolves in ~1-3s, and
    // the row-hydrate fallback now only runs when there is genuinely no matview
    // rollup (matviewData === null); an aggregate-tier 0-row rollup fails fast
    // via matviewEmpty instead of burning the full budget.
    const INNER_BUDGET_MS = 15000;
    // CC 333 — every report type whose generator reads window._reportMatviewData
    // (directly or via the matview-aware shared helpers computeStats /
    // generateYearlySection / generateTopLocationsTable / generateNodeTable),
    // plus infographic + fatalspeed which run their own _supabaseMode matview
    // fetch. Types in this set hydrate from matviews (~3s) at aggregate tiers
    // instead of taking the slow row-hydrate fallback (which hangs / aborts at
    // 25s). countermeasures + beforeafter are intentionally absent — they
    // require per-row data and render a gap-state panel at aggregate tiers.
    const MATVIEW_REPORT_TYPES = new Set([
        'dashboard', 'systemwide',
        // Treatment A — stats-object templates (computeStats + shared helpers)
        'comprehensive', 'corridor', 'safety', 'trend', 'grantsupport', 'infographic',
        // Treatment B — direct matview-slice templates (hotspot ranking,
        // fatal/speed self-hydration, ped/bike category roll-up, safety-focus
        // via safetyState; intersection delegates to corridor; crashtree shows
        // a per-row-required gap-state)
        'safetyfocus', 'fatalspeed', 'hotspot', 'intersection', 'pedbike', 'crashtree'
    ]);

    // Date-range classification (timeframe-filter fix). At aggregate tiers the
    // matviews are pre-aggregated by calendar year, so:
    //   • No dates                  → matview path, all years (unchanged).
    //   • Span ≤ ~400 days          → force the row-hydrate path for PRECISE
    //     (3 Mo / 6 Mo / 1 Yr)        per-row date filtering (getCrashes already
    //                                 honors dateFrom/dateTo).
    //   • Span > ~400 days          → matview path, filtered by whole calendar
    //     (3 Yr / 5 Yr)               year (fast). Approximate at year grain.
    let yearRange = null;
    let forceRowHydrate = false;
    if (startDate || endDate) {
        const _sd = startDate ? new Date(startDate) : null;
        const _ed = endDate ? new Date(endDate) : null;
        const _spanDays = (_sd && _ed) ? (_ed - _sd) / 86400000 : Infinity;
        if (_sd && _ed && _spanDays <= 400) {
            forceRowHydrate = true;
        } else {
            yearRange = {
                startYear: _sd ? _sd.getFullYear() : null,
                endYear: _ed ? _ed.getFullYear() : null
            };
        }
        console.log(`[Report:${type}] date range ${startDate || '∅'}→${endDate || '∅'} ` +
            `→ ${forceRowHydrate ? 'row-hydrate (precise)' : 'matview yearRange ' + JSON.stringify(yearRange)}`);
    }

    const real = (async () => {
        let crashes = null, hydrated = false;
        // CC 353 — fail-fast signal. Set when the matview path runs at an
        // aggregate tier and the rollup resolves to 0 crashes. In that case
        // the row-hydrate fallback below would also return 0 rows (or hang the
        // full budget on a ≤100k-row page) — so we skip it and let the caller
        // render an instant gap-state instead of timing out. emptyScope carries
        // the resolved {tier, value} so the caller (and DevTools) can see
        // exactly which scope came back empty.
        let matviewEmpty = false, emptyScope = null;

        // Matview path — fast (~3s) when the generator is ported to read
        // window._reportMatviewData.
        if (!forceRowHydrate && MATVIEW_REPORT_TYPES.has(type) &&
            window.CL && CL.data && CL.data.supabaseBridge &&
            typeof CL.data.supabaseBridge.resolveTier === 'function') {
            console.log(`[Report:${type}] sampleRows empty — entering matview fallback path (aggregate tier)`);
            try {
                const t = CL.data.supabaseBridge.resolveTier();
                if (t && t.tier) {
                    const t0 = Date.now();
                    const matviewData = await hydrateReportFromMatviews(type, t.tier, t.value, yearRange);
                    if (matviewData && matviewData.total > 0) {
                        window._reportMatviewData = matviewData;
                        // Stub crashes (length = total, capped 10k) so
                        // generators that gate on length>0 don't bail.
                        // Ported generators read window._reportMatviewData
                        // for the real numbers and never iterate the stubs.
                        crashes = new Array(Math.min(matviewData.total, 10000)).fill(null).map(() => ({}));
                        hydrated = true;
                        console.log('[Report] Matview hydration complete in ' + (Date.now() - t0) + 'ms (total=' + matviewData.total + ', scope=' + (matviewData._scope && matviewData._scope.tier) + ':' + ((matviewData._scope && matviewData._scope.value) || '∅') + ')');
                        _reportMark('matview-hydrate done');
                    } else if (matviewData && matviewData.total === 0) {
                        // CC 353 — the matviews fetched successfully but the
                        // resolved scope has no crashes (empty jurisdiction, or
                        // a resolveTier/dbName mismatch that doesn't exist in
                        // the matview). Fail fast: never drop into the 25s
                        // row-hydrate path for an aggregate-tier zero rollup.
                        matviewEmpty = true;
                        emptyScope = (matviewData._scope) || { tier: t.tier, value: t.value };
                        console.warn(`[Report:${type}] CC 353 — matview rollup is 0 rows for scope ${emptyScope.tier || '?'}:${emptyScope.value || '∅'} — skipping row-hydrate, will render gap-state`);
                        _reportMark('matview-empty fail-fast');
                    }
                }
            } catch (e) {
                console.warn('[Report] Matview hydration failed:', e && e.message);
            }
        }

        // Row-hydrate fallback — slow (~30-90s) but works for any tier +
        // any unported generator. getCrashes pages internally at 10k/req.
        // CC 353 — skipped when the matview path already proved the scope is
        // empty (matviewEmpty); the caller renders a gap-state instead.
        if (!hydrated && !matviewEmpty && window.crashLensClient &&
            window.CL && window.CL.data && window.CL.data.supabaseBridge &&
            typeof window.CL.data.supabaseBridge.resolveTier === 'function') {
            console.log(`[Report:${type}] sampleRows + matview empty — entering row-hydrate fallback (≤100k rows)`);
            try {
                const t = window.CL.data.supabaseBridge.resolveTier();
                const fetchOpts = { all: true, maxRows: 100000 };
                if (route) fetchOpts.route = route;
                if (startDate) fetchOpts.dateFrom = startDate;
                if (endDate) fetchOpts.dateTo = endDate;
                const result = await window.crashLensClient.getCrashes(t.tier, t.value, fetchOpts);
                if (result && Array.isArray(result.rows) && result.rows.length > 0) {
                    crashes = result.rows;
                    hydrated = true;
                    console.log('[Report] Hydrated ' + crashes.length + ' crashes from Supabase for tier=' + t.tier);
                    _reportMark('row-hydrate done');
                }
            } catch (e) {
                console.warn('[Report] Hydration failed:', e && e.message);
            }
        }

        return { crashes, hydrated, timedOut: false, matviewEmpty, emptyScope };
    })();

    const timeout = new Promise(resolve =>
        setTimeout(() => resolve({ crashes: null, hydrated: false, timedOut: true }), INNER_BUDGET_MS)
    );

    return Promise.race([real, timeout]);
}

async function _runReportGeneration(type, _reportT0, _reportMark) {
    await new Promise(r => setTimeout(r, 50));
    // Stale-report fix: hide every output container up front so the previous
    // report can never linger below the new one. Each path re-shows its own.
    // Also clear the standard-template sub-sections so every path that reuses
    // #reportOutput (main generators, countermeasures/beforeafter, gap-states)
    // starts clean — a section the new report doesn't populate can't show the
    // previous report's content.
    _hideAllReportOutputs();
    _resetStandardReportSections();
    {
        const title = document.getElementById('reportTitle').value || 'Crash Analysis Report';
        const author = document.getElementById('reportAuthor').value || 'Traffic Engineering Division';
        const route = document.getElementById('reportRoute').value;
        const startDate = document.getElementById('reportStartDate').value;
        const endDate = document.getElementById('reportEndDate').value;

        // For countermeasures report, use CMF tab selection
        if (type === 'countermeasures') {
            if (!cmfState.selectedLocation || cmfState.locationCrashes.length === 0) {
                // CC 333 — render an in-report gap-state instead of a jarring
                // alert. Countermeasures need CMF lookups against a specific
                // location's crash characteristics (collision type, intersection
                // type, speed), which require a selected location with per-row
                // data — matview aggregates can't produce them. State-agnostic.
                _renderReportGapState(
                    'Countermeasures Report',
                    'Countermeasures Report requires a selected location',
                    'The Countermeasures Report runs CMF (Crash Modification Factor) lookups against an individual location’s crash characteristics — collision type, intersection type, and speed — which require per-row data for a specific road or intersection.',
                    'cmf', 'Open Countermeasures Tab',
                    'Go to the Countermeasures tab, search for a road or intersection, then return here and click Generate Report again.'
                );
                hideLoading();
                return;
            }
            let crashes = cmfState.locationCrashes;
            if (startDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) >= new Date(startDate));
            if (endDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) <= new Date(endDate));
            const locationName = cmfState.selectedLocation.type === 'node'
                ? `Node ${cmfState.selectedLocation.name}`
                : formatRouteName(cmfState.selectedLocation.name);
            generateCountermeasuresReport(crashes, locationName, title, author);
            document.getElementById('reportOutput').style.display = 'block';
            hideLoading();
            document.getElementById('reportOutput').scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // For before/after report, use BA tab data
        if (type === 'beforeafter') {
            if (!baState.selectedLocation || baState.locationCrashes.length === 0) {
                // CC 333 — in-report gap-state. The Before/After study splits
                // per-row crash dates into BEFORE/AFTER periods and runs a
                // statistical comparison, which needs a location's row-level
                // crashes — not available from matview annual aggregates.
                _renderReportGapState(
                    'Before / After Study Report',
                    'Before/After Study Report requires a completed study',
                    'The Before/After Study Report splits a location’s crashes into BEFORE and AFTER periods and runs a statistical comparison (Naïve, Comparison-Group, or Empirical-Bayes), which requires per-row crash dates for a selected location.',
                    'beforeafter', 'Open Before/After Study Tab',
                    'Go to the Before/After Study tab, select a location and run the study, then return here and click Generate Report again.'
                );
                hideLoading();
                return;
            }
            generateBeforeAfterStudyReport(title, author);
            document.getElementById('reportOutput').style.display = 'block';
            hideLoading();
            document.getElementById('reportOutput').scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Round 8 (2026-05-09) + CC 330: at county/city tier sampleRows is
        // already loaded — use it directly (fast path). At aggregate tier
        // (state/MPO/PD/region/federal) sampleRows is empty and we hydrate
        // via _hydrateWithBudget, which races matview → row-hydrate against
        // a 25s timer. Anything slower aborts cleanly before the 30s overlay
        // watchdog can fire. State-agnostic.
        let crashes = crashState.sampleRows;
        let _hydratedFromSupabase = false;
        window._reportMatviewData = null;

        if (crashes && crashes.length > 0) {
            console.log(`[Report:${type}] using sampleRows fast-path (${crashes.length} rows)`);
        } else {
            const hydration = await _hydrateWithBudget(type, route, startDate, endDate, _reportMark);
            // CC 353 — aggregate-tier scope resolved to 0 crashes. Render an
            // instant gap-state (reusing the shared _renderReportGapState panel)
            // instead of waiting out the budget on a row-hydrate that would also
            // return nothing. Surfaces the real cause (empty / mismatched scope)
            // rather than a generic timeout. Applies uniformly to every matview
            // report type. State-agnostic.
            if (hydration.matviewEmpty) {
                const sc = hydration.emptyScope || {};
                const scopeTxt = sc.tier ? (sc.tier + ' = ' + (sc.value || '(none)')) : 'the current selection';
                console.warn(`[Report:${type}] CC 353 — rendering 0-row gap-state for scope ${sc.tier || '?'}:${sc.value || '∅'} (no 25s hang)`);
                _renderReportGapState(
                    title,
                    'No crash data for the selected scope',
                    'The crash matviews returned 0 rows for ' + scopeTxt + '. This usually means the selected tier or jurisdiction has no crashes in the dataset, or its name does not match the data warehouse.',
                    'upload', 'Open Upload Tab',
                    'Verify the State and jurisdiction selection (or widen the date range), then click Generate Report again.'
                );
                hideLoading();
                return;
            }
            if (hydration.timedOut) {
                console.warn(`[Report:${type}] hydration exceeded 15s budget — aborting before overlay watchdog`);
                hideLoading();
                alert('Report hydration took longer than 15 seconds. Try a smaller tier or a narrower date range.');
                return;
            }
            if (hydration.crashes) {
                crashes = hydration.crashes;
                _hydratedFromSupabase = hydration.hydrated;
            }
        }

        // For infographic, use dedicated generator
        if (type === 'infographic') {
            const agency = document.getElementById('reportAgency').value || getJurisdictionLabel();
            const department = document.getElementById('reportDepartment').value || 'Traffic Engineering Division';
            // CC 324 BUG A — defensive try/finally so a throw inside
            // generateInfographic (e.g. an undefined-deref in
            // populateInfographicPage1/2 when crashes is a hydrated stub) can
            // never strand the "Generating report..." overlay. The console
            // surfaces the underlying error so a post-deploy verify pass can
            // patch the real cause. State-agnostic; behaviorally inert when
            // generateInfographic completes normally.
            try {
                _reportMark('infographic-start');
                await generateInfographic(crashes, title, agency, department, startDate, endDate);
                _reportMark('infographic done');
            } catch (e) {
                console.error('[Report][BUG A] generateInfographic threw — spinner dismissed defensively:', e);
            } finally {
                hideLoading();
            }
            return;
        }

        // For comprehensive quarterly report, use dedicated generator.
        // CC 330 — match the infographic try/catch/finally pattern so a
        // throw inside generateComprehensiveReport (or one of the awaited
        // AI insights / computeLocationDetails) can never strand the
        // spinner. generateComprehensiveReport is async.
        if (type === 'comprehensive') {
            const agency = document.getElementById('reportAgency').value || getJurisdictionLabel();
            const department = document.getElementById('reportDepartment').value || 'Traffic Engineering Division';
            try {
                _reportMark('comprehensive-start');
                await generateComprehensiveReport(crashes, title, agency, department, author, startDate, endDate);
                _reportMark('comprehensive done');
            } catch (e) {
                console.error('[Report] generateComprehensiveReport threw — spinner dismissed defensively:', e);
            } finally {
                hideLoading();
            }
            return;
        }

        // Filter data for other report types. Skip post-filtering when we
        // hydrated from Supabase — server-side already applied route +
        // dateFrom/dateTo and the row date format differs (string ISO vs.
        // legacy epoch milliseconds), which would otherwise null out the
        // hydrated set.
        if (!_hydratedFromSupabase) {
            if (route) crashes = crashes.filter(r => r[COL.ROUTE] === route);
            if (startDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) >= new Date(startDate));
            if (endDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) <= new Date(endDate));
        }

        if (!crashes || crashes.length === 0) {
            hideLoading();
            alert('No crash data available for the current tier/filter. Try selecting a different tier or removing date filters.');
            return;
        }

        try {
            _reportMark('generator-start');
            // Generate based on type (sub-sections were cleared at the top of
            // _runReportGeneration so no stale content can bleed through).
            if (type === 'dashboard') generateDashboardReport(crashes, title, author);
            else if (type === 'corridor') generateCorridorReport(crashes, route || 'All Routes', title, author);
            else if (type === 'safety') generateSafetyReport(crashes, title, author);
            else if (type === 'safetyfocus') generateSafetyFocusReport(crashes, title, author, startDate, endDate);
            else if (type === 'pedbike') generatePedBikeReport(crashes, title, author);
            else if (type === 'trend') generateTrendReport(crashes, title, author);
            else if (type === 'intersection') generateIntersectionReport(crashes, route, title, author);
            else if (type === 'crashtree') generateCrashTreeSystemicReport(crashes, title, author);
            else if (type === 'fatalspeed') await generateFatalSpeedReport(crashes, title, author);
            else if (type === 'hotspot') generateHotspotRankingReport(crashes, title, author);
            else if (type === 'grantsupport') generateGrantSupportReport(crashes, title, author);
            _reportMark('generator done');

            // Timeframe-filter caveat — when the data came from a year-level
            // matview filter (aggregate tier, multi-year range), the range is
            // approximate to whole calendar years and ranked-location tables
            // remain all-years. Surface that honestly so the header period and
            // the numbers can't be misread as an exact sub-year match.
            const _mvYF = window._reportMatviewData;
            if (_mvYF && _mvYF._yearFiltered) {
                const _yr = _mvYF._yearRange || {};
                const _findings = document.getElementById('rptFindings');
                if (_findings) {
                    _findings.insertAdjacentHTML('afterbegin',
                        '<div class="finding-item warning" style="margin-bottom:1rem">' +
                        '<strong>Note:</strong> At this jurisdiction level the date range is applied at the whole–calendar-year level (' +
                        (_yr.startYear || '…') + '–' + (_yr.endYear || '…') +
                        '). Severity, yearly, and collision-type figures reflect these years; ranked-location tables (hot spots, top factors) reflect all available years. For exact sub-year filtering, select a county-level jurisdiction.' +
                        '</div>');
                }
            }

            document.getElementById('reportOutput').style.display = 'block';
            document.getElementById('reportOutput').scrollIntoView({ behavior: 'smooth' });
            _reportMark('complete');
        } catch (err) {
            console.error('Report generation error:', err);
            alert('Error generating report: ' + err.message);
        } finally {
            hideLoading();
        }
    }
}

function generateSystemwideReport(crashes, title, author) {
    // Backward compatibility: delegate to dashboard report
    return generateDashboardReport(crashes, title, author);
}

/**
 * CC 365 — render the report cover band (visual only). Injects a #rptCover
 * div at the top of the report output container and hides the legacy
 * rptTitle/rptSubtitle/rptMeta lines. Purely additive DOM; never mutates data.
 * Shared by every standard report generator (dual-exposed on window).
 */
function _rdsRenderCoverBand(title, subtitle, yearRange, author, reportId) {
    try {
        var parent = document.getElementById('rptOutput') || document.getElementById('reportOutput');
        var c = document.getElementById('rptCover');
        if (!c) {
            c = document.createElement('div');
            c.id = 'rptCover';
            if (parent) parent.insertBefore(c, parent.firstChild);
        }
        c.className = 'rds-cover';
        c.innerHTML = `
            <div class="rds-cover-eyebrow">${(typeof _activeTierLabel === 'function' ? _activeTierLabel() : 'Statewide')} · Crash Analysis</div>
            <h1 class="rds-cover-title">${title}</h1>
            <p class="rds-cover-subtitle">${subtitle || ((typeof getJurisdictionLabel === 'function' ? getJurisdictionLabel() : '') + ' — Traffic Safety Report')}</p>
            <div class="rds-cover-meta">
                <span><span class="rds-cover-meta-label">Period</span><span class="rds-cover-meta-value">${yearRange}</span></span>
                <span><span class="rds-cover-meta-label">Prepared by</span><span class="rds-cover-meta-value">${author || 'Traffic Engineering Division'}</span></span>
                <span><span class="rds-cover-meta-label">Generated</span><span class="rds-cover-meta-value">${typeof getShortTimestamp === 'function' ? getShortTimestamp() : ''}</span></span>
                <span><span class="rds-cover-meta-label">Report ID</span><span class="rds-cover-meta-value">${reportId || '—'}</span></span>
            </div>
        `;
        ['rptTitle', 'rptSubtitle', 'rptMeta'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    } catch (e) { /* cosmetic only — never block report rendering */ }
}

function _legacySystemwideReport(crashes, title, author) {
    const stats = computeStats(crashes);
    // Prefer the Reports tab's user-selected timeline (reportStartDate /
    // reportEndDate) so the rendered HTML preview and the Word memo both
    // show the same period the user asked for. Fall back to the crash
    // min/max when no filter is set (legacy behavior).
    const yearRange = (document.getElementById('reportStartDate')?.value || document.getElementById('reportEndDate')?.value)
        ? resolveReportPeriod('reportStartDate', 'reportEndDate')
        : getDateRange(crashes);
    const reportId = generateReportId();

    const rptTitle = document.getElementById('rptTitle');
    if (rptTitle) rptTitle.textContent = title;
    const rptSubtitle = document.getElementById('rptSubtitle');
    if (rptSubtitle) rptSubtitle.textContent = `${getJurisdictionLabel()} System-Wide Safety Analysis`;
    const rptMeta = document.getElementById('rptMeta');
    if (rptMeta) rptMeta.textContent = `Period: ${yearRange} | Prepared by: ${author} | Generated: ${getShortTimestamp()}`;

    // CC 365 — cover band (visual only; hides the legacy title/subtitle/meta lines)
    _rdsRenderCoverBand(title, `${getJurisdictionLabel()} — Traffic Safety Report`, yearRange, author, reportId);

    // Update footer and report ID with crash count
    updateReportFooter(yearRange, reportId, stats.total);

    // Show executive summary
    showExecutiveSummary(stats, crashes, 'system-wide analysis', getJurisdictionLabel());

    // Show Table of Contents with new structure
    showTableOfContents('systemwide');

    // Compute category-specific data for the report
    const categoryData = computeSystemwideCategoryData(crashes);

    // Primary KPIs - Key safety metrics
    document.getElementById('rptKPIs').innerHTML = `
        <div class="rds-kpi-grid">
            <div class="rds-kpi" data-tone="fatal"><div class="rds-kpi-label">Fatal Crashes</div><div class="rds-kpi-value">${stats.K}</div></div>
            <div class="rds-kpi" data-tone="serious"><div class="rds-kpi-label">Serious Injury</div><div class="rds-kpi-value">${stats.A}</div></div>
            <div class="rds-kpi"><div class="rds-kpi-label">Total Crashes</div><div class="rds-kpi-value">${stats.total.toLocaleString()}</div></div>
            <div class="rds-kpi" data-tone="warning"><div class="rds-kpi-label">K+A Rate</div><div class="rds-kpi-value">${pct(stats.K + stats.A, stats.total)}%</div></div>
            <div class="rds-kpi" data-tone="minor"><div class="rds-kpi-label">Pedestrian</div><div class="rds-kpi-value">${stats.ped}</div></div>
            <div class="rds-kpi" data-tone="positive"><div class="rds-kpi-label">Bicycle</div><div class="rds-kpi-value">${stats.bike}</div></div>
            <div class="rds-kpi"><div class="rds-kpi-label">Speed-Related</div><div class="rds-kpi-value">${categoryData.speed.total}</div></div>
            <div class="rds-kpi"><div class="rds-kpi-label">EPDO Score</div><div class="rds-kpi-value">${calcEPDO(stats).toLocaleString()}</div></div>
        </div>
    `;

    // Safety Focus Exploration Dashboard - Visual tiles for key categories
    const explorationHtml = generateExplorationDashboard(crashes, categoryData);

    // Key Findings with enhanced insights
    const findings = generateEnhancedFindings(stats, crashes, categoryData);
    document.getElementById('rptFindings').innerHTML = `
        <div class="rds-findings">
            <h4>Key Safety Insights</h4>
            ${findings.map(f => `<div class="rds-finding-item ${f.type ? 'is-' + f.type : ''}">${f.text}</div>`).join('')}
        </div>
    `;

    // Yearly section
    document.getElementById('rptYearlySection').innerHTML = generateYearlySection(crashes);

    // Charts section with exploration dashboard
    document.getElementById('rptChartsSection').innerHTML = `
        <section class="rds-section">
            <div class="rds-section-eyebrow">SECTION 02</div>
            <h2 class="rds-section-title">Visual Analysis</h2>
            <p class="rds-section-deck">Collision-type and severity distributions for the selected period.</p>
            <div class="report-section" style="grid-column:1/-1">
                <h4 style="display:flex;align-items:center;gap:.5rem">
                    <svg style="width:18px;height:18px" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                    Safety Focus Exploration
                </h4>
                ${explorationHtml}
            </div>
            <div class="rds-chart"><div class="rds-chart-title">Collision Types</div><div class="rds-chart-canvas"><canvas id="rptChartCollision"></canvas></div></div>
            <div class="rds-chart"><div class="rds-chart-title">Severity Distribution</div><div class="rds-chart-canvas"><canvas id="rptChartSeverity"></canvas></div></div>
        </section>
    `;

    setTimeout(() => {
        createReportCharts(stats, crashes);
    }, 100);

    // Top Locations by Category - Replace the large uninformative table
    document.getElementById('rptTablesSection').innerHTML = generateCategoryTopLocations(crashes, categoryData);

    // Enhanced Recommendations based on category data
    document.getElementById('rptRecommendations').innerHTML = generateEnhancedRecommendations(stats, crashes, categoryData);

    // CC 365 — footer credit band (visual only)
    const _rptFooterEl = document.getElementById('rptFooter') || (function(){
        var f = document.createElement('footer');
        f.id = 'rptFooter';
        f.className = 'rds-footer';
        var parent = document.getElementById('rptOutput') || document.getElementById('reportOutput');
        if (parent) parent.appendChild(f);
        return f;
    })();
    _rptFooterEl.className = 'rds-footer';
    _rptFooterEl.innerHTML = `
        <span><span class="rds-footer-brand">CRASH LENS</span> · Crash Analysis Tool · ${(typeof appConfig !== 'undefined' && appConfig.version) || 'v1.0'}</span>
        <span>${typeof getDataSourceLabel === 'function' ? getDataSourceLabel() : ''}</span>
        <span>Generated ${getShortTimestamp()}</span>
    `;

    // CC 346 §3.1 — collapse empty sections (no-op when every section has data).
    setTimeout(autoCollapseEmptyReportSections, 50);
}

/**
 * Compute category-specific crash data for systemwide report
 */
function computeSystemwideCategoryData(crashes) {
    const categories = {
        fatal: { total: 0, crashes: [], byRoute: {} },
        pedestrian: { total: 0, crashes: [], byRoute: {}, K: 0, A: 0 },
        bicycle: { total: 0, crashes: [], byRoute: {}, K: 0, A: 0 },
        speed: { total: 0, crashes: [], byRoute: {}, K: 0, A: 0 },
        intersection: { total: 0, crashes: [], byRoute: {}, K: 0, A: 0 },
        nighttime: { total: 0, crashes: [], byRoute: {}, K: 0, A: 0 },
        impaired: { total: 0, crashes: [], byRoute: {}, K: 0, A: 0 }
    };

    crashes.forEach(row => {
        const sev = (row[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        const route = row[COL.ROUTE] || 'Unknown';

        // Fatal crashes
        if (sev === 'K') {
            categories.fatal.total++;
            categories.fatal.crashes.push(row);
            categories.fatal.byRoute[route] = (categories.fatal.byRoute[route] || 0) + 1;
        }

        // Pedestrian crashes
        if ((row[COL.PED] || '').toLowerCase() === 'yes') {
            categories.pedestrian.total++;
            categories.pedestrian.crashes.push(row);
            categories.pedestrian.byRoute[route] = (categories.pedestrian.byRoute[route] || 0) + 1;
            if (sev === 'K') categories.pedestrian.K++;
            if (sev === 'A') categories.pedestrian.A++;
        }

        // Bicycle crashes
        if ((row[COL.BIKE] || '').toLowerCase() === 'yes') {
            categories.bicycle.total++;
            categories.bicycle.crashes.push(row);
            categories.bicycle.byRoute[route] = (categories.bicycle.byRoute[route] || 0) + 1;
            if (sev === 'K') categories.bicycle.K++;
            if (sev === 'A') categories.bicycle.A++;
        }

        // Speed-related crashes
        if ((row[COL.SPEED] || '').toLowerCase() === 'yes') {
            categories.speed.total++;
            categories.speed.crashes.push(row);
            categories.speed.byRoute[route] = (categories.speed.byRoute[route] || 0) + 1;
            if (sev === 'K') categories.speed.K++;
            if (sev === 'A') categories.speed.A++;
        }

        // Intersection crashes
        const intAnalysis = (row['Intersection Analysis'] || '').toLowerCase();
        const intType = row[COL.INT_TYPE] || row['Intersection Type'] || '';
        if ((intAnalysis !== '' && !intAnalysis.includes('not intersection')) ||
            (intType !== '' && !intType.toLowerCase().includes('not at intersection') && !intType.startsWith('0.'))) {
            categories.intersection.total++;
            categories.intersection.crashes.push(row);
            categories.intersection.byRoute[route] = (categories.intersection.byRoute[route] || 0) + 1;
            if (sev === 'K') categories.intersection.K++;
            if (sev === 'A') categories.intersection.A++;
        }

        // Nighttime crashes
        if ((row[COL.NIGHT] || row['Night?'] || '').toLowerCase() === 'yes') {
            categories.nighttime.total++;
            categories.nighttime.crashes.push(row);
            categories.nighttime.byRoute[route] = (categories.nighttime.byRoute[route] || 0) + 1;
            if (sev === 'K') categories.nighttime.K++;
            if (sev === 'A') categories.nighttime.A++;
        }

        // Impaired driving crashes
        const alc = row[COL.ALCOHOL] || row['Alcohol?'] || '';
        const drug = row[COL.DRUG] || row['Drug Related?'] || '';
        if (alc.toLowerCase() === 'yes' || drug.toLowerCase() === 'yes') {
            categories.impaired.total++;
            categories.impaired.crashes.push(row);
            categories.impaired.byRoute[route] = (categories.impaired.byRoute[route] || 0) + 1;
            if (sev === 'K') categories.impaired.K++;
            if (sev === 'A') categories.impaired.A++;
        }
    });

    return categories;
}
  // ─── EXTRACTED CODE END ───
  window.CL = window.CL || {}; CL.reports = CL.reports || {};
  CL.reports.standardCore = CL.reports.standardCore || {};
  window.showReportSubTab = showReportSubTab; CL.reports.standardCore.showReportSubTab = showReportSubTab;
  window.updateReportOptions = updateReportOptions; CL.reports.standardCore.updateReportOptions = updateReportOptions;
  window.populateReportLocations = populateReportLocations; CL.reports.standardCore.populateReportLocations = populateReportLocations;
  window.buildAIContext = buildAIContext; CL.reports.standardCore.buildAIContext = buildAIContext;
  window._safeAgg = _safeAgg; CL.reports.standardCore._safeAgg = _safeAgg;
  window.hydrateReportFromMatviews = hydrateReportFromMatviews; CL.reports.standardCore.hydrateReportFromMatviews = hydrateReportFromMatviews;
  window.fetchReportDataForType = fetchReportDataForType; CL.reports.standardCore.fetchReportDataForType = fetchReportDataForType;
  window.generateReport = generateReport; CL.reports.standardCore.generateReport = generateReport;
  // Stale-report fix + timeframe auto-rerun helpers. _reportDateChanged is
  // referenced from inline app/index.html onclick/onchange handlers, so it
  // MUST be on window; the other two are exposed for parity.
  window._hideAllReportOutputs = _hideAllReportOutputs; CL.reports.standardCore._hideAllReportOutputs = _hideAllReportOutputs;
  window._resetStandardReportSections = _resetStandardReportSections; CL.reports.standardCore._resetStandardReportSections = _resetStandardReportSections;
  window._reportDateChanged = _reportDateChanged; CL.reports.standardCore._reportDateChanged = _reportDateChanged;
  window.generateSystemwideReport = generateSystemwideReport; CL.reports.standardCore.generateSystemwideReport = generateSystemwideReport;
  window._legacySystemwideReport = _legacySystemwideReport; CL.reports.standardCore._legacySystemwideReport = _legacySystemwideReport;
  window._rdsRenderCoverBand = _rdsRenderCoverBand; CL.reports.standardCore._rdsRenderCoverBand = _rdsRenderCoverBand;
  window.computeSystemwideCategoryData = computeSystemwideCategoryData; CL.reports.standardCore.computeSystemwideCategoryData = computeSystemwideCategoryData;
  // CC 346 §2/§3 — display-polish helpers + empty-section auto-collapse.
  // Window-exposed so sibling report modules (types/types2/core2) can reach
  // them — IIFE-wrapped modules share only via window.*, never lexical scope.
  window.fmtNum = fmtNum; CL.reports.standardCore.fmtNum = fmtNum;
  window.stripEnumPrefix = stripEnumPrefix; CL.reports.standardCore.stripEnumPrefix = stripEnumPrefix;
  window.isUnknownBucket = isUnknownBucket; CL.reports.standardCore.isUnknownBucket = isUnknownBucket;
  window.filterUnknown = filterUnknown; CL.reports.standardCore.filterUnknown = filterUnknown;
  window.renderGapRow = renderGapRow; CL.reports.standardCore.renderGapRow = renderGapRow;
  window.renderRequiredInputEmptyState = renderRequiredInputEmptyState; CL.reports.standardCore.renderRequiredInputEmptyState = renderRequiredInputEmptyState;
  window.autoCollapseEmptyReportSections = autoCollapseEmptyReportSections; CL.reports.standardCore.autoCollapseEmptyReportSections = autoCollapseEmptyReportSections;
  window._isReportSectionEmpty = _isReportSectionEmpty; CL.reports.standardCore._isReportSectionEmpty = _isReportSectionEmpty;
  CL._registerModule('reports/reports-standard-core');
})();
