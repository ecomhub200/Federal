/**
 * CrashLens Upload Tab Module
 * Handles R2 data loading, road type filtering, jurisdiction selection,
 * EPDO configuration, data caching, and connection status management.
 *
 * This module encapsulates the core data pipeline from R2 cloud storage
 * to the front-end application, ensuring modular separation from the
 * main index.html file.
 *
 * Dependencies: CL.core.constants, CL.core.epdo, Papa (PapaParse), StateAdapter
 * Globals accessed: crashState, r2State, appConfig, appSettings, connectionState,
 *                   jurisdictionContext, EPDO_WEIGHTS, EPDO_ACTIVE_PRESET, EPDO_PRESETS
 */
'use strict';

import * as roadTypeMapping from '../data/road-type-mapping.js';

    // F2/F3 — localStorage key for the user's last-selected state (FIPS).
    // This key is intentionally state-independent: it is NOT purged on a
    // state switch so the app reopens on the state the user last used.
    var SAVED_STATE_KEY = 'crashlens.lastSelectedState';

    // ============================================================
    // R2 DATA PATH UTILITIES
    // ============================================================

    /**
     * Get the R2 file suffix for the currently selected road type filter.
     * State/Region tiers use DOT/County naming; Federal uses DOT/Non-DOT; County/MPO use local road naming.
     *
     * @param {string} [tier] - View tier override (defaults to jurisdictionContext.viewTier)
     * @returns {string} File suffix like 'county_roads', 'dot_roads', 'statewide_all_roads', etc.
     */
    function getActiveRoadTypeSuffix(tier) {
        var activeTier = tier || (typeof jurisdictionContext !== 'undefined' ? jurisdictionContext.viewTier : 'county');
        // Delegate to the shared road-type-mapping module — single source of
        // truth across supabase-bridge / data-client / index.html.
        if (roadTypeMapping) {
            var radioVal = roadTypeMapping.activeRadioValue();
            var suffix = roadTypeMapping.suffixFor(activeTier, radioVal);
            // Preserve the legacy 'statewide_all_roads' filename for the state
            // tier's all-roads R2 file (matches existing R2 publish layout).
            if (activeTier === 'state' && suffix === 'all_roads') return 'statewide_all_roads';
            return suffix;
        }
        // Defensive fallback only.
        var filterRadio = document.querySelector('input[name="roadTypeFilter"]:checked');
        var filterValue = filterRadio ? filterRadio.value : (localStorage.getItem('selectedFilterProfile') || 'countyOnly');
        if (activeTier === 'state' || activeTier === 'federal' || activeTier === 'region') {
            var dotMap = { countyOnly: 'dot_roads', cityOnly: 'city_roads', countyPlusVDOT: 'non_dot_roads', allRoads: activeTier === 'state' ? 'statewide_all_roads' : 'all_roads' };
            return dotMap[filterValue] || (activeTier === 'state' ? 'statewide_all_roads' : 'all_roads');
        }
        var localMap = { countyOnly: 'county_roads', cityOnly: 'city_roads', countyPlusVDOT: 'no_interstate', allRoads: 'all_roads' };
        return localMap[filterValue] || 'county_roads';
    }

    /**
     * Build the tier-aware R2 base path (folder only, no filename).
     * Used by iframe sync functions so child modules receive the correct
     * R2 folder path from the parent — single source of truth.
     *
     * @returns {string} R2 folder path like 'virginia/henrico', 'colorado/_mpo/drcog', '_national'
     */
    function getR2BasePath() {
        var tier = typeof jurisdictionContext !== 'undefined' ? jurisdictionContext.viewTier : 'county';
        // Fix 7 — _resolveActiveState (defined in app/index.html) is the single
        // source of truth for the active state key. Returns null when neither
        // the user-selected state nor appConfig.defaultState resolves —
        // caller falls back to '' (R2 path becomes meaningless), which is the
        // honest answer rather than silently routing to 'colorado'.
        var stateKey = (typeof _resolveActiveState === 'function')
            ? (_resolveActiveState() || '')
            : ((typeof _getActiveStateKey === 'function' && _getActiveStateKey()) ||
               (typeof appConfig !== 'undefined' && appConfig && appConfig.defaultState) || '');
        var r2Prefix = (appConfig && appConfig.states && appConfig.states[stateKey] && appConfig.states[stateKey].r2Prefix) || stateKey;

        if (tier === 'federal') return '_national';
        if (tier === 'state') return r2Prefix + '/_state';

        if (tier === 'region') {
            var regionId = jurisdictionContext.tierRegion && jurisdictionContext.tierRegion.id;
            if (regionId) return r2Prefix + '/_region/' + regionId;
        }

        if (tier === 'mpo') {
            var mpoId = jurisdictionContext.tierMpo && jurisdictionContext.tierMpo.id;
            if (mpoId) return r2Prefix + '/_mpo/' + mpoId;
        }

        if (tier === 'planning_district') {
            var pdId = jurisdictionContext.tierPlanningDistrict && jurisdictionContext.tierPlanningDistrict.id;
            if (pdId) return r2Prefix + '/_planning_district/' + pdId.toLowerCase();
        }

        if (tier === 'city') {
            var cityId = jurisdictionContext.tierCity && jurisdictionContext.tierCity.id;
            if (cityId) return r2Prefix + '/_city/' + cityId.toLowerCase();
        }

        // County tier (default)
        var jurisdiction = (typeof getActiveJurisdictionId === 'function') ? getActiveJurisdictionId() : null;
        if (!jurisdiction) {
            var stateCfg = (appConfig && appConfig.states && stateKey) ? appConfig.states[stateKey] : null;
            jurisdiction = (stateCfg && stateCfg.defaultJurisdiction) || 'unknown';
            console.warn('[Upload] No active jurisdiction; falling back to', jurisdiction, 'for state', stateKey);
        }
        var r2Jurisdiction = jurisdiction;
        var stateAbbr = appConfig && appConfig.states && appConfig.states[stateKey] && appConfig.states[stateKey].abbreviation;
        if (stateAbbr) stateAbbr = stateAbbr.toLowerCase();
        if (stateAbbr && jurisdiction.startsWith(stateAbbr + '_')) {
            r2Jurisdiction = jurisdiction.substring(stateAbbr.length + 1);
        }
        r2Jurisdiction = r2Jurisdiction.toLowerCase();

        return r2Prefix + '/' + r2Jurisdiction;
    }

    /**
     * Build the R2 data file path based on current selection (tier-aware).
     * Normalizes jurisdiction to lowercase for R2 case-sensitive paths.
     *
     * @returns {string} R2-native path like 'virginia/henrico/county_roads.csv'
     */
    function getDataFilePath() {
        var tier = typeof jurisdictionContext !== 'undefined' ? jurisdictionContext.viewTier : 'county';
        // Fix 7 — _resolveActiveState (defined in app/index.html) is the single
        // source of truth for the active state key. Returns null when neither
        // the user-selected state nor appConfig.defaultState resolves —
        // caller falls back to '' (R2 path becomes meaningless), which is the
        // honest answer rather than silently routing to 'colorado'.
        var stateKey = (typeof _resolveActiveState === 'function')
            ? (_resolveActiveState() || '')
            : ((typeof _getActiveStateKey === 'function' && _getActiveStateKey()) ||
               (typeof appConfig !== 'undefined' && appConfig && appConfig.defaultState) || '');
        var r2Prefix = (appConfig && appConfig.states && appConfig.states[stateKey] && appConfig.states[stateKey].r2Prefix) || stateKey;
        var roadType = getActiveRoadTypeSuffix(tier);

        // R2 policy (effective 2026-04-23): all crash data is published as
        // uncompressed .parquet — no .parquet.gz, no .csv, no .csv.gz.
        if (tier === 'federal') return '_national/' + roadType + '.parquet';
        if (tier === 'state') return r2Prefix + '/_state/' + roadType + '.parquet';

        if (tier === 'region') {
            var regionId = jurisdictionContext.tierRegion && jurisdictionContext.tierRegion.id;
            if (regionId) return r2Prefix + '/_region/' + regionId + '/' + roadType + '.parquet';
        }

        if (tier === 'mpo') {
            var mpoId = jurisdictionContext.tierMpo && jurisdictionContext.tierMpo.id;
            if (mpoId) return r2Prefix + '/_mpo/' + mpoId + '/' + roadType + '.parquet';
        }

        if (tier === 'planning_district') {
            var pdId = jurisdictionContext.tierPlanningDistrict && jurisdictionContext.tierPlanningDistrict.id;
            if (pdId) return r2Prefix + '/_planning_district/' + pdId.toLowerCase() + '/' + roadType + '.parquet';
        }

        if (tier === 'city') {
            var cityId = jurisdictionContext.tierCity && jurisdictionContext.tierCity.id;
            if (cityId) return r2Prefix + '/_city/' + cityId.toLowerCase() + '/' + roadType + '.parquet';
        }

        // County tier (default)
        var jurisdiction = (typeof getActiveJurisdictionId === 'function') ? getActiveJurisdictionId() : null;
        if (!jurisdiction) {
            var stateCfg = (appConfig && appConfig.states && stateKey) ? appConfig.states[stateKey] : null;
            jurisdiction = (stateCfg && stateCfg.defaultJurisdiction) || 'unknown';
            console.warn('[Upload] No active jurisdiction; falling back to', jurisdiction, 'for state', stateKey);
        }
        var r2Jurisdiction = jurisdiction;
        var stateAbbr = appConfig && appConfig.states && appConfig.states[stateKey] && appConfig.states[stateKey].abbreviation;
        if (stateAbbr) stateAbbr = stateAbbr.toLowerCase();
        if (stateAbbr && jurisdiction.startsWith(stateAbbr + '_')) {
            r2Jurisdiction = jurisdiction.substring(stateAbbr.length + 1);
        }
        // Normalize to lowercase for R2 case-sensitive paths
        r2Jurisdiction = r2Jurisdiction.toLowerCase();

        return r2Prefix + '/' + r2Jurisdiction + '/' + roadType + '.parquet';
    }

    /**
     * Resolve a data path to a full URL (R2 or local).
     * Uses manifest lookup, dynamic construction, or R2-native path resolution.
     *
     * @param {string} localPath - Path to resolve
     * @returns {string} Full URL for fetching
     */
    function resolveDataUrl(localPath) {
        var baseUrl = (r2State.manifest && r2State.manifest.r2BaseUrl) || (typeof R2_BASE_URL !== 'undefined' ? R2_BASE_URL : 'https://data.aicreatesai.com');

        var normalizedPath = localPath;
        if (normalizedPath.indexOf('../') === 0) normalizedPath = normalizedPath.substring(3);
        if (normalizedPath.indexOf('./') === 0) normalizedPath = normalizedPath.substring(2);

        // Strategy 1: Exact match in manifest
        if (r2State.manifest && r2State.manifest.localPathMapping) {
            var r2Key = r2State.manifest.localPathMapping[normalizedPath];
            if (r2Key) {
                return baseUrl + '/' + r2Key;
            }
        }

        // Strategy 2: Dynamic R2 URL construction for legacy local paths
        if (normalizedPath.indexOf('data/') === 0 && typeof appConfig !== 'undefined' && appConfig && appConfig.states) {
            var activeStateKey = (typeof _getActiveStateKey === 'function') ? _getActiveStateKey() : null;
            var stateConfig = activeStateKey ? appConfig.states[activeStateKey] : null;
            if (stateConfig && stateConfig.r2Prefix) {
                var filename = normalizedPath.split('/').pop();
                if (filename) {
                    var knownSuffixes = ['_county_roads.parquet.gz', '_city_roads.parquet.gz', '_no_interstate.parquet.gz', '_all_roads.parquet.gz',
                                         '_county_roads.csv.gz', '_city_roads.csv.gz', '_no_interstate.csv.gz', '_all_roads.csv.gz',
                                         '_county_roads.csv', '_city_roads.csv', '_no_interstate.csv', '_all_roads.csv'];
                    var jurisdiction = null, filterWithExt = null;
                    for (var i = 0; i < knownSuffixes.length; i++) {
                        if (filename.indexOf(knownSuffixes[i], filename.length - knownSuffixes[i].length) !== -1) {
                            jurisdiction = filename.substring(0, filename.length - knownSuffixes[i].length);
                            filterWithExt = knownSuffixes[i].substring(1);
                            break;
                        }
                    }
                    if (!jurisdiction) {
                        var idx = filename.indexOf('_');
                        if (idx > 0) {
                            jurisdiction = filename.substring(0, idx);
                            filterWithExt = filename.substring(idx + 1);
                        }
                    }
                    if (jurisdiction && filterWithExt) {
                        var dynamicR2Key = stateConfig.r2Prefix + '/' + jurisdiction.toLowerCase() + '/' + filterWithExt;
                        return baseUrl + '/' + dynamicR2Key;
                    }
                }
            }
        }

        // Strategy 3: R2-native paths (direct R2 keys)
        var tierPrefixes = ['_state/', '_statewide/', '_region/', '_planning_district/', '_mpo/', '_city/', '_federal/', '_national/'];
        var isR2NativePath = normalizedPath.indexOf('data/') !== 0 &&
            normalizedPath.indexOf('/') !== -1 &&
            (normalizedPath.indexOf('.csv', normalizedPath.length - 4) !== -1 ||
             normalizedPath.indexOf('.json', normalizedPath.length - 5) !== -1 ||
             normalizedPath.indexOf('.csv.gz', normalizedPath.length - 7) !== -1 ||
             normalizedPath.indexOf('.parquet.gz', normalizedPath.length - 11) !== -1);

        var hasTierPrefix = false;
        for (var t = 0; t < tierPrefixes.length; t++) {
            if (normalizedPath.indexOf(tierPrefixes[t]) !== -1) { hasTierPrefix = true; break; }
        }

        if (isR2NativePath || hasTierPrefix) {
            return baseUrl + '/' + normalizedPath;
        }

        return localPath;
    }

    /**
     * Build local fallback paths from an R2-native path.
     * Used when R2 is inaccessible.
     *
     * @param {string} r2NativePath - R2-native path like "colorado/douglas/county_roads.csv"
     * @returns {string[]} Array of local paths to try
     */
    function buildLocalFallbackPaths(r2NativePath) {
        var fallbacks = [];
        if (!r2NativePath) return fallbacks;

        var parts = r2NativePath.replace(/^\//, '').split('/');
        if (parts.length < 3) {
            fallbacks.push('../data/' + r2NativePath);
            return fallbacks;
        }

        var statePrefix = parts[0];
        var jurisdiction = parts[1];
        // Normalize to .csv for local fallback paths
        // R2 uses .parquet.gz or .csv.gz, but local files are always .csv
        var filename = parts.slice(2).join('/');
        if (filename.indexOf('.parquet.gz', filename.length - 11) !== -1) {
            filename = filename.slice(0, -11) + '.csv'; // county_roads.parquet.gz → county_roads.csv
        } else if (filename.indexOf('.gz', filename.length - 3) !== -1) {
            filename = filename.slice(0, -3); // county_roads.csv.gz → county_roads.csv
        }
        var stateDataDir = appConfig && appConfig.states && appConfig.states[statePrefix] && appConfig.states[statePrefix].dataDir;

        if (stateDataDir) {
            fallbacks.push('../data/' + stateDataDir + '/' + jurisdiction + '_' + filename);
        }
        fallbacks.push('../data/' + jurisdiction + '_' + filename);

        if (filename.indexOf('all_roads') === -1) {
            if (stateDataDir) {
                fallbacks.push('../data/' + stateDataDir + '/' + jurisdiction + '_all_roads.csv');
            }
            fallbacks.push('../data/' + jurisdiction + '_all_roads.csv');
        }

        return fallbacks;
    }

    // ============================================================
    // R2 MANIFEST & AVAILABILITY
    // ============================================================

    /**
     * Load the R2 manifest from data/r2-manifest.json.
     * Called once during startup, before autoLoadCrashData().
     */
    async function loadR2Manifest() {
        var manifestPaths = [
            '../data/r2-manifest.json',
            './data/r2-manifest.json',
            'data/r2-manifest.json',
            '/data/r2-manifest.json'
        ];

        var cacheBuster = '?_t=' + Date.now();
        for (var i = 0; i < manifestPaths.length; i++) {
            try {
                var response = await fetch(manifestPaths[i] + cacheBuster);
                if (!response.ok) continue;

                var manifest = await response.json();
                if (!manifest.r2BaseUrl || !manifest.localPathMapping ||
                    Object.keys(manifest.localPathMapping).length === 0) {
                    continue;
                }

                r2State.manifest = manifest;
                r2State.loaded = true;
                console.log('[R2] Manifest loaded from ' + manifestPaths[i] + ': ' +
                    Object.keys(manifest.localPathMapping).length + ' files mapped');
                return;
            } catch (e) {
                continue;
            }
        }

        // If no manifest loaded, mark as loaded anyway to unblock autoLoadCrashData
        r2State.loaded = true;
        console.warn('[R2] No manifest found — will use direct R2 paths');
    }

    /**
     * Check if crash data is available in R2 for a given state/jurisdiction.
     * Tier-aware: constructs the correct path prefix based on the current view tier.
     * Always returns available=true so the frontend connects regardless of manifest state.
     *
     * @param {string} stateKey - State key (e.g., 'virginia')
     * @param {string} jurisdictionId - Jurisdiction ID (e.g., 'henrico')
     * @returns {{ available: boolean, reason: string, inManifest: boolean, files?: string[] }}
     */
    function checkR2DataAvailability(stateKey, jurisdictionId) {
        var prefix = (appConfig && appConfig.states && appConfig.states[stateKey] && appConfig.states[stateKey].r2Prefix) || stateKey;
        var tier = (typeof jurisdictionContext !== 'undefined') ? jurisdictionContext.viewTier : 'county';

        // Build path prefix based on tier
        var pathPrefix;
        if (tier === 'state') {
            pathPrefix = prefix + '/_state/';
        } else if (tier === 'region' && jurisdictionContext.tierRegion) {
            pathPrefix = prefix + '/_region/' + jurisdictionContext.tierRegion.id + '/';
        } else if (tier === 'planning_district' && jurisdictionContext.tierPlanningDistrict) {
            pathPrefix = prefix + '/_planning_district/' + jurisdictionContext.tierPlanningDistrict.id + '/';
        } else if (tier === 'mpo' && jurisdictionContext.tierMpo) {
            pathPrefix = prefix + '/_mpo/' + jurisdictionContext.tierMpo.id + '/';
        } else if (tier === 'city' && jurisdictionContext.tierCity) {
            pathPrefix = prefix + '/_city/' + jurisdictionContext.tierCity.id + '/';
        } else {
            pathPrefix = prefix + '/' + jurisdictionId.toLowerCase() + '/';
        }

        if (!r2State.manifest || !r2State.manifest.files) {
            return { available: true, inManifest: false, reason: 'No manifest — will attempt direct R2 fetch' };
        }

        var files = Object.keys(r2State.manifest.files);
        var matchingFiles = files.filter(function(f) { return f.indexOf(pathPrefix) === 0; });

        return {
            available: true,
            inManifest: matchingFiles.length > 0,
            files: matchingFiles,
            reason: matchingFiles.length > 0
                ? matchingFiles.length + ' file(s) confirmed in manifest'
                : 'Not in manifest — will attempt direct R2 fetch at ' + pathPrefix
        };
    }

    // ============================================================
    // FILTER PROFILE MANAGEMENT
    // ============================================================

    /**
     * Save the road type filter selection and trigger data reload.
     * Called when the user clicks a road type radio button.
     */
    function saveFilterProfile() {
        var selected = document.querySelector('input[name="roadTypeFilter"]:checked');
        if (!selected) return;

        localStorage.setItem('selectedFilterProfile', selected.value);
        if (typeof updateCurrentSelectionDisplay === 'function') updateCurrentSelectionDisplay();

        console.log('[Config] Filter profile saved:', selected.value, '→ will load:', getDataFilePath());

        // Reset prediction tab so it reloads the correct forecast file for the new road type
        if (typeof predictionState !== 'undefined') {
            predictionState.loadedFile = null;
            predictionState.data = null;
            predictionState.loaded = false;
        }

        // Reload data with the new filter if data was previously loaded
        if (typeof crashState !== 'undefined' && crashState.loaded) {
            console.log('[Config] Reloading data from:', getDataFilePath());
            if (typeof crashCacheClearAll === 'function') {
                crashCacheClearAll().catch(function(err) {
                    console.warn('[Config] Cache clear on filter change failed:', err);
                });
            }
            if (typeof showFilterLoadingState === 'function') showFilterLoadingState(true);
            if (typeof autoLoadCrashData === 'function') autoLoadCrashData(true);
        }
    }

    /**
     * Save all user preferences (state, jurisdiction, road type) to localStorage.
     */
    function saveUserPreferences() {
        var stateSelect = document.getElementById('stateSelect');
        var jurisdictionSelect = document.getElementById('jurisdictionSelect');
        var selectedFilter = document.querySelector('input[name="roadTypeFilter"]:checked');
        var prefs = {};

        if (stateSelect && stateSelect.value) {
            localStorage.setItem('selectedStateFips', stateSelect.value);
            prefs.state = stateSelect.options[stateSelect.selectedIndex] ?
                stateSelect.options[stateSelect.selectedIndex].textContent : stateSelect.value;
        }

        if (jurisdictionSelect && jurisdictionSelect.value) {
            localStorage.setItem('selectedJurisdiction', jurisdictionSelect.value);
            if (typeof appSettings !== 'undefined' && appSettings) {
                appSettings.selectedJurisdiction = jurisdictionSelect.value;
            }
            prefs.jurisdiction = jurisdictionSelect.options[jurisdictionSelect.selectedIndex] ?
                jurisdictionSelect.options[jurisdictionSelect.selectedIndex].textContent : jurisdictionSelect.value;
        }

        if (selectedFilter) {
            localStorage.setItem('selectedFilterProfile', selectedFilter.value);
            prefs.filter = selectedFilter.value;
        }

        localStorage.setItem('userPreferencesSaved', 'true');
        if (typeof updateCurrentSelectionDisplay === 'function') updateCurrentSelectionDisplay();

        // Visual feedback
        var saveBtn = document.getElementById('savePrefsBtn');
        if (saveBtn) {
            var originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '&#x2713; Saved!';
            saveBtn.style.background = '#16a34a';
            setTimeout(function() {
                saveBtn.innerHTML = originalText;
                saveBtn.style.background = '#22c55e';
            }, 2000);
        }

        if (typeof showToast === 'function') {
            showToast('Preferences saved: ' + [prefs.state, prefs.jurisdiction, prefs.filter].filter(Boolean).join(' | '), 'success');
        }
        console.log('[Preferences] Saved:', prefs);
    }

    /**
     * Clear all saved user preferences and reset to defaults.
     */
    function clearUserPreferences() {
        localStorage.removeItem('selectedStateFips');
        localStorage.removeItem('selectedJurisdiction');
        localStorage.removeItem('selectedFilterProfile');
        localStorage.removeItem('userPreferencesSaved');

        var stateSelect = document.getElementById('stateSelect');
        if (stateSelect) {
            // F2 — default to the user's last-saved state (or the first
            // available option), never a hardcoded FIPS literal.
            var savedState = null;
            try { savedState = localStorage.getItem(SAVED_STATE_KEY); } catch (e) {}
            var savedOpt = savedState ? stateSelect.querySelector('option[value="' + savedState + '"]') : null;
            stateSelect.value = savedOpt
                ? savedState
                : (stateSelect.options[0] ? stateSelect.options[0].value : '');
        }

        var jurisdictionSelect = document.getElementById('jurisdictionSelect');
        if (jurisdictionSelect && jurisdictionSelect.options.length > 0) {
            jurisdictionSelect.selectedIndex = 0;
            if (typeof appSettings !== 'undefined' && appSettings) {
                appSettings.selectedJurisdiction = jurisdictionSelect.value;
            }
        }

        var defaultRadio = document.getElementById('filterCountyOnly');
        if (defaultRadio) defaultRadio.checked = true;

        if (typeof updateCurrentSelectionDisplay === 'function') updateCurrentSelectionDisplay();

        var clearBtn = document.getElementById('clearPrefsBtn');
        if (clearBtn) {
            var originalText = clearBtn.innerHTML;
            clearBtn.innerHTML = '&#x2713; Cleared!';
            clearBtn.style.background = '#d97706';
            setTimeout(function() {
                clearBtn.innerHTML = originalText;
                clearBtn.style.background = '#f59e0b';
            }, 2000);
        }

        if (typeof showToast === 'function') {
            showToast('Preferences cleared - reset to defaults', 'info');
        }
        console.log('[Preferences] All saved preferences cleared');
    }

    /**
     * Force refresh all data and reset all tab states.
     * Clears cache and fetches fresh data from server.
     */
    async function forceRefreshAllData() {
        if (typeof crashState === 'undefined' || !crashState.loaded) {
            alert('No data loaded. Please upload a crash data file first.');
            return;
        }

        console.log('[Refresh] Force refreshing all data and tabs (clearing cache)...');
        if (typeof showFilterLoadingState === 'function') showFilterLoadingState(true);

        try {
            if (typeof crashCacheDelete === 'function') await crashCacheDelete();
            console.log('[Refresh] Cache cleared');
        } catch (err) {
            console.warn('[Refresh] Failed to clear cache:', err);
        }

        if (typeof autoLoadCrashData === 'function') autoLoadCrashData(true);
    }

    // ============================================================
    // UI HELPERS
    // ============================================================

    /**
     * Show/hide loading state on filter options.
     */
    function showFilterLoadingState(show) {
        var refreshBtn = document.getElementById('refreshDataBtn');
        var filterLabels = document.querySelectorAll('.radio-item');

        if (show) {
            if (refreshBtn) {
                refreshBtn.textContent = '\u23F3 Loading...';
                refreshBtn.disabled = true;
            }
            filterLabels.forEach(function(label) {
                label.style.opacity = '0.6';
                label.style.pointerEvents = 'none';
            });
        } else {
            if (refreshBtn) {
                refreshBtn.textContent = '\uD83D\uDD04 Refresh';
                refreshBtn.disabled = false;
                refreshBtn.style.display = 'inline-block';
            }
            filterLabels.forEach(function(label) {
                label.style.opacity = '1';
                label.style.pointerEvents = 'auto';
            });
        }
    }

    /**
     * Show the refresh button after data is loaded.
     */
    function showRefreshButton() {
        var refreshBtn = document.getElementById('refreshDataBtn');
        if (refreshBtn) refreshBtn.style.display = 'inline-block';
    }

    /**
     * Update the current selection display (jurisdiction + filter).
     * Now tier-aware: shows the active tier's selected entity.
     */
    function updateCurrentSelectionDisplay() {
        var display = document.getElementById('currentJurisdictionDisplay');
        var nameSpan = document.getElementById('currentJurisdictionName');
        var filterSpan = document.getElementById('currentFilterName');

        if (!display || !nameSpan || !filterSpan) return;

        var tier = (typeof jurisdictionContext !== 'undefined') ? jurisdictionContext.viewTier : 'county';

        var selectedFilterEl = document.querySelector('input[name="roadTypeFilter"]:checked');
        var profileId = selectedFilterEl ? selectedFilterEl.value : (localStorage.getItem('selectedFilterProfile') || 'countyOnly');
        var filterProfile = appConfig && appConfig.filterProfiles ? appConfig.filterProfiles[profileId] : null;

        var tierLabels = {
            state: 'Statewide',
            region: 'Region',
            planning_district: 'Planning District',
            mpo: 'MPO',
            county: '',
            city: 'City',
            town: 'Town',
            federal: 'Federal'
        };

        var entityName = null;
        if (tier === 'county' || tier === 'federal') {
            var jurisdictionId = (typeof getActiveJurisdictionId === 'function') ? getActiveJurisdictionId() : null;
            var jurisdiction = jurisdictionId && appConfig && appConfig.jurisdictions ? appConfig.jurisdictions[jurisdictionId] : null;
            entityName = jurisdiction ? jurisdiction.name : null;
        } else if (tier === 'state') {
            entityName = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext.tierState) ? jurisdictionContext.tierState.name : 'Statewide';
        } else if (tier === 'region') {
            entityName = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext.tierRegion) ? jurisdictionContext.tierRegion.name : null;
        } else if (tier === 'planning_district') {
            entityName = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext.tierPlanningDistrict) ? jurisdictionContext.tierPlanningDistrict.name : null;
        } else if (tier === 'mpo') {
            entityName = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext.tierMpo) ? jurisdictionContext.tierMpo.name : null;
        } else if (tier === 'city') {
            entityName = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext.tierCity) ? jurisdictionContext.tierCity.name : null;
        }

        if (entityName && filterProfile) {
            var prefix = tierLabels[tier] ? tierLabels[tier] + ': ' : '';
            nameSpan.textContent = prefix + entityName;
            filterSpan.textContent = filterProfile.name;
            display.style.display = 'block';
        }
    }

    /**
     * Update road type filter labels based on the current view tier.
     *
     * @param {string} tier - The active view tier
     */
    function updateRoadTypeLabels(tier) {
        // Delegate to the shared road-type-mapping module — single source of
        // truth. Pre-fix this file, app/index.html, and supabase-bridge.js
        // each had their own slightly different table.
        var map = roadTypeMapping || null;
        if (!map) return;
        var ids = {
            countyOnly:     'filterLabelCountyOnly',
            cityOnly:       'filterLabelCityOnly',
            countyPlusVDOT: 'filterLabelCountyPlusVDOT',
            allRoads:       'filterLabelAllRoads'
        };
        Object.keys(ids).forEach(function (radio) {
            var el = document.getElementById(ids[radio]);
            if (el) el.innerHTML = map.labelFor(tier, radio);
        });
    }

    // ============================================================
    // EPDO MANAGEMENT
    // ============================================================

    /**
     * Toggle the EPDO configuration section visibility.
     */
    function toggleEPDOSection() {
        var content = document.getElementById('epdoSectionContent');
        var chevron = document.getElementById('epdoChevron');
        var toggle = document.getElementById('epdoSectionToggle');
        if (!content) return;
        var isExpanded = content.style.display !== 'none';
        content.style.display = isExpanded ? 'none' : 'flex';
        if (chevron) chevron.style.transform = isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)';
        if (toggle) toggle.setAttribute('aria-expanded', String(!isExpanded));
    }

    /**
     * Load an EPDO preset and recalculate all EPDO scores.
     *
     * @param {string} presetKey - Preset key ('stateDefault', 'hsm2010', 'vdot2024', 'fhwa2022', 'custom')
     */
    function loadEPDOPreset(presetKey) {
        if (typeof EPDO_PRESETS === 'undefined' || typeof EPDO_WEIGHTS === 'undefined') return;

        if (presetKey === 'custom') {
            EPDO_WEIGHTS = {
                K: parseInt(document.getElementById('epdoCustomK') ? document.getElementById('epdoCustomK').value : 462) || 462,
                A: parseInt(document.getElementById('epdoCustomA') ? document.getElementById('epdoCustomA').value : 62) || 62,
                B: parseInt(document.getElementById('epdoCustomB') ? document.getElementById('epdoCustomB').value : 12) || 12,
                C: parseInt(document.getElementById('epdoCustomC') ? document.getElementById('epdoCustomC').value : 5) || 5,
                O: parseInt(document.getElementById('epdoCustomO') ? document.getElementById('epdoCustomO').value : 1) || 1
            };
            EPDO_PRESETS.custom.weights = Object.assign({}, EPDO_WEIGHTS);
        } else if (presetKey === 'stateDefault') {
            if (typeof getCurrentStateFips === 'function' && typeof getStateEPDOWeights === 'function') {
                var currentStateFips = getCurrentStateFips();
                var stateEntry = getStateEPDOWeights(currentStateFips);
                EPDO_WEIGHTS = Object.assign({}, stateEntry.weights);
                EPDO_PRESETS.stateDefault.weights = Object.assign({}, stateEntry.weights);
                EPDO_PRESETS.stateDefault.name = 'State Default (' + stateEntry.name + ')';
                EPDO_PRESETS.stateDefault.description = stateEntry.source;
            }
        } else {
            var preset = EPDO_PRESETS[presetKey];
            if (!preset) { console.warn('[EPDO] Unknown preset:', presetKey); return; }
            EPDO_WEIGHTS = Object.assign({}, preset.weights);
        }
        EPDO_ACTIVE_PRESET = presetKey;
        localStorage.setItem('epdoActivePreset', presetKey);
        if (presetKey === 'custom') localStorage.setItem('epdoCustomWeights', JSON.stringify(EPDO_WEIGHTS));
        if (typeof updateEPDOPresetUI === 'function') updateEPDOPresetUI();
        if (typeof updateEPDOWeightLabels === 'function') updateEPDOWeightLabels();
        if (typeof recalculateAllEPDO === 'function') recalculateAllEPDO();
        console.log('[EPDO] Preset changed to:', presetKey, EPDO_WEIGHTS);
    }

    /**
     * Save custom EPDO weights when inputs change.
     */
    function saveCustomEPDOWeights() {
        if (typeof EPDO_ACTIVE_PRESET !== 'undefined' && EPDO_ACTIVE_PRESET === 'custom') {
            loadEPDOPreset('custom');
        }
    }

    /**
     * Auto-apply state default EPDO weights when state changes.
     *
     * @param {string} stateFips - State FIPS code
     * @param {string} stateName - State display name
     */
    function applyStateDefaultEPDO(stateFips, stateName) {
        if (typeof EPDO_ACTIVE_PRESET === 'undefined' || EPDO_ACTIVE_PRESET !== 'stateDefault') return;
        if (typeof getStateEPDOWeights !== 'function') return;
        var stateEntry = getStateEPDOWeights(stateFips);
        EPDO_WEIGHTS = Object.assign({}, stateEntry.weights);
        EPDO_PRESETS.stateDefault.weights = Object.assign({}, stateEntry.weights);
        EPDO_PRESETS.stateDefault.name = 'State Default (' + stateEntry.name + ')';
        EPDO_PRESETS.stateDefault.description = stateEntry.source;
        if (typeof updateEPDOPresetUI === 'function') updateEPDOPresetUI();
        if (typeof updateEPDOWeightLabels === 'function') updateEPDOWeightLabels();
        console.log('[EPDO] Auto-applied state weights for ' + (stateName || stateEntry.name) + ':', EPDO_WEIGHTS);
    }

    // ============================================================
    // CONNECTION STATUS & DIAGNOSTICS
    // ============================================================

    /**
     * Get a summary of data availability across all states in R2.
     *
     * @returns {string} Human-readable availability summary
     */
    function getR2DataAvailabilitySummary() {
        if (!r2State.manifest || !r2State.manifest.files) {
            return 'R2 manifest not available';
        }
        var files = Object.keys(r2State.manifest.files);
        var states = {};
        files.forEach(function(f) {
            var parts = f.split('/');
            if (parts.length >= 2 && parts[0] !== '_national') {
                states[parts[0]] = (states[parts[0]] || 0) + 1;
            }
        });
        var stateList = Object.keys(states);
        if (stateList.length === 0) return 'No data in R2 storage';
        return 'Data available for ' + stateList.length + ' state(s): ' + stateList.join(', ');
    }

    /**
     * F3 — purge state-scoped localStorage when the user switches states, so a
     * jurisdiction from a previous state (e.g. a Colorado county) cannot leak
     * into a new state's session. Also performs the F2 save of the newly
     * selected state. Wired into #stateSelect's onchange ahead of the
     * downstream handleStateSelection() fetch.
     */
    function handleUploadStateChange() {
        var stateSelect = document.getElementById('stateSelect');
        var newState = stateSelect ? stateSelect.value : '';
        var prevState = null;
        try { prevState = localStorage.getItem(SAVED_STATE_KEY); } catch (e) {}

        if (prevState && newState && prevState !== newState) {
            // State-scoped keys — purged on every state switch. Deliberately
            // excludes SAVED_STATE_KEY, selectedStateFips, auth tokens, and
            // appearance/theme keys.
            ['selectedJurisdiction', 'jurisdictionContext'].forEach(function(k) {
                try { localStorage.removeItem(k); } catch (e) {}
            });
        }

        // F2 — remember the new selection so the app reopens on this state.
        try {
            if (newState) localStorage.setItem(SAVED_STATE_KEY, newState);
        } catch (e) {}
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

// --- Transitional CL.* namespace (stripped in Stage A-cleanup) ---
// NOTE: assign individual members rather than replacing CL.upload — the
// IIFE-era CL.upload = {…} replacement worked because of load order; under
// ESM cutover we keep sibling members (tierUI, pipeline, apiConnector,
// roadDefaults) intact.
window.CL = window.CL || {};
CL.upload = CL.upload || {};
CL.upload.getActiveRoadTypeSuffix = getActiveRoadTypeSuffix;
CL.upload.getR2BasePath = getR2BasePath;
CL.upload.getDataFilePath = getDataFilePath;
CL.upload.resolveDataUrl = resolveDataUrl;
CL.upload.buildLocalFallbackPaths = buildLocalFallbackPaths;
CL.upload.loadR2Manifest = loadR2Manifest;
CL.upload.checkR2DataAvailability = checkR2DataAvailability;
CL.upload.getR2DataAvailabilitySummary = getR2DataAvailabilitySummary;
CL.upload.saveFilterProfile = saveFilterProfile;
CL.upload.saveUserPreferences = saveUserPreferences;
CL.upload.clearUserPreferences = clearUserPreferences;
CL.upload.handleUploadStateChange = handleUploadStateChange;
CL.upload.forceRefreshAllData = forceRefreshAllData;
CL.upload.showFilterLoadingState = showFilterLoadingState;
CL.upload.showRefreshButton = showRefreshButton;
CL.upload.updateCurrentSelectionDisplay = updateCurrentSelectionDisplay;
CL.upload.updateRoadTypeLabels = updateRoadTypeLabels;
CL.upload.toggleEPDOSection = toggleEPDOSection;
CL.upload.loadEPDOPreset = loadEPDOPreset;
CL.upload.saveCustomEPDOWeights = saveCustomEPDOWeights;
CL.upload.applyStateDefaultEPDO = applyStateDefaultEPDO;

// --- Legacy global exposure for HTML onclick= (see STAGE_A_ONCLICK_API.md
//      watch list — these 4 became survivors after Item 1 deleted the
//      inline copies in index.html) ---
window.saveFilterProfile = saveFilterProfile;
window.saveUserPreferences = saveUserPreferences;
window.clearUserPreferences = clearUserPreferences;
window.forceRefreshAllData = forceRefreshAllData;

export {
    getActiveRoadTypeSuffix,
    getR2BasePath,
    getDataFilePath,
    resolveDataUrl,
    buildLocalFallbackPaths,
    loadR2Manifest,
    checkR2DataAvailability,
    getR2DataAvailabilitySummary,
    saveFilterProfile,
    saveUserPreferences,
    clearUserPreferences,
    handleUploadStateChange,
    forceRefreshAllData,
    showFilterLoadingState,
    showRefreshButton,
    updateCurrentSelectionDisplay,
    updateRoadTypeLabels
};

CL._registerModule('upload/upload-tab');
