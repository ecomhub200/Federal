/**
 * upload-tier-ui.js
 *
 * Keeps the Upload tab honest when the user changes the View Level (tier).
 * Without this module, switching from County → State leaves the old county
 * dropdown locked, the "Current: <county>" line stale, and the success card
 * still bragging "loaded from delaware/kent/all_roads.parquet" — even though
 * the actual data source is now the Supabase statewide matview.
 *
 * Data-source contract (effective 2026-04-25):
 *   ALL TIERS (county / city / state / federal / region / mpo /
 *   planning_district)             → Supabase matview (PRIMARY)
 *   FALLBACK (all tiers)           → R2 parquet auto-fetched when Supabase
 *                                    is unreachable. County/city use the
 *                                    county-level parquet; aggregate tiers
 *                                    use {state}/_state/{road_type}.parquet.
 *                                    A console warning is logged for
 *                                    aggregate tiers because the statewide
 *                                    file can be large enough to stress
 *                                    in-browser parsing.
 *   ALSO LAZY (county/city + 9 detail tabs) → R2 parquet auto-fetched when
 *                                    Analysis / Hotspots / Crash Tree /
 *                                    Grants / Deep Dive / Safety / Fatal
 *                                    Speeding / Intersection / Pedestrian
 *                                    opens (these need row-level data).
 */
(function () {
    'use strict';
    if (typeof window === 'undefined') return;
    window.CL = window.CL || {};
    CL.upload = CL.upload || {};

    var TIER_LABELS = {
        federal: 'Federal',
        state: 'State',
        region: 'Region',
        mpo: 'MPO',
        planning_district: 'Planning District',
        county: 'County',
        city: 'City / Town'
    };

    var COUNTY_LIKE = { county: 1, city: 1 };

    function $(id) { return document.getElementById(id); }

    function activeStateName() {
        try {
            if (typeof jurisdictionContext !== 'undefined') {
                var name = jurisdictionContext.tierState && jurisdictionContext.tierState.name;
                if (name) return name;
                if (jurisdictionContext.stateName) return jurisdictionContext.stateName;
            }
        } catch (e) {}
        var sel = $('stateSelect');
        if (sel && sel.options && sel.selectedIndex >= 0) {
            return sel.options[sel.selectedIndex].text || '';
        }
        return '';
    }

    function activeRoadTypeLabel() {
        var checked = document.querySelector('input[name="roadTypeFilter"]:checked');
        if (!checked) return 'All Roads';
        var labelEl = checked.parentNode && checked.parentNode.querySelector('span');
        if (!labelEl) return checked.value;
        // Strip HTML tags for plain text reuse
        var tmp = document.createElement('div');
        tmp.innerHTML = labelEl.innerHTML;
        return (tmp.textContent || tmp.innerText || '').trim();
    }

    function activeRoadTypeSuffix(tier) {
        try {
            if (typeof getActiveRoadTypeSuffix === 'function') {
                return getActiveRoadTypeSuffix(tier);
            }
        } catch (e) {}
        return 'all_roads';
    }

    function activeStateKey() {
        try {
            if (typeof _getActiveStateKey === 'function') return _getActiveStateKey();
        } catch (e) {}
        return null;
    }

    /**
     * URL of the R2 parquet that backs this tier (documented fallback path).
     * Returns null if the tier doesn't have a meaningful statewide-or-broader file.
     */
    function fallbackR2Url(tier) {
        var stateKey = activeStateKey();
        if (!stateKey) return null;
        var r2Base = (typeof R2_BASE_URL !== 'undefined' && R2_BASE_URL) ? R2_BASE_URL : null;
        try {
            if (typeof r2State !== 'undefined' && r2State && r2State.manifest && r2State.manifest.r2BaseUrl) {
                r2Base = r2State.manifest.r2BaseUrl;
            }
        } catch (e) {}
        if (!r2Base) return null;
        var roadType = activeRoadTypeSuffix(tier);
        if (tier === 'state') return r2Base + '/' + stateKey + '/_state/' + roadType + '.parquet';
        if (tier === 'federal') return r2Base + '/_national/' + roadType + '.parquet';
        return null;
    }

    /**
     * Hide / show the right-hand county-or-jurisdiction picker based on tier.
     * For non-county tiers we collapse the dropdown row (don't just lock it)
     * and surface a scope card so the user reads "Statewide" instead of
     * "Kent County (Locked)".
     */
    function paintJurisdictionRow(tier) {
        var settings = document.querySelector('.jurisdiction-settings');
        if (!settings) return;
        var dropdownGroup = (function () {
            var sel = $('jurisdictionSelect');
            return sel ? sel.closest('.filter-group') : null;
        })();

        // The bottom-card "Select County/Jurisdiction" filter-group is hidden
        // for ALL tiers now — county/city pick their scope from the top-card
        // dropdown (tierCountySelect / tierCitySelect) and the lower card
        // shows the read-only Active Scope card. The legacy
        // "Current: <jurisdiction> | <road type>" panel is also redundant.
        if (dropdownGroup) dropdownGroup.style.display = 'none';
        var currentPanel = $('currentJurisdictionDisplay');
        if (currentPanel) currentPanel.style.display = 'none';

        renderTierScopeCard(tier);
    }

    /**
     * Tier scope card that replaces the bottom-card jurisdiction dropdown
     * for every tier (federal / state / region / mpo / planning_district /
     * county / city). The active scope is picked from the matching top-card
     * dropdown in the View Level section; this card just mirrors it as
     * read-only text so the layout is uniform across all seven tiers.
     */
    function renderTierScopeCard(tier) {
        var settings = document.querySelector('.jurisdiction-settings');
        if (!settings) return;
        var existing = $('tierScopeCard');

        var stateName = activeStateName() || 'Selected state';
        var tierLabel = TIER_LABELS[tier] || tier;
        var scopeText, helperText;
        if (tier === 'state') {
            scopeText = 'Statewide — ' + stateName;
            helperText = 'Pre-aggregated KPIs from Supabase. R2 parquet fallback: ' +
                stateName + '/_state/' + activeRoadTypeSuffix(tier) + '.parquet';
        } else if (tier === 'federal') {
            scopeText = 'Federal — all states with data';
            helperText = 'Pre-aggregated nationwide totals from Supabase.';
        } else if (tier === 'region') {
            var rname = (jurisdictionContext.tierRegion && jurisdictionContext.tierRegion.name) || 'Select a region above';
            scopeText = stateName + ' — Region: ' + rname;
            helperText = 'Pre-aggregated regional totals from Supabase.';
        } else if (tier === 'mpo') {
            var mname = (jurisdictionContext.tierMpo && jurisdictionContext.tierMpo.name) || 'Select an MPO above';
            scopeText = stateName + ' — MPO: ' + mname;
            helperText = 'Pre-aggregated MPO totals from Supabase.';
        } else if (tier === 'planning_district') {
            var pname = (jurisdictionContext.tierPlanningDistrict && jurisdictionContext.tierPlanningDistrict.name) || 'Select a planning district above';
            scopeText = stateName + ' — Planning District: ' + pname;
            helperText = 'Pre-aggregated planning-district totals from Supabase.';
        } else if (tier === 'county') {
            var jurName = '';
            try {
                jurName = (typeof jurisdictionContext !== 'undefined' &&
                           jurisdictionContext.jurisdictionName) || '';
            } catch (e) {}
            if (!jurName) {
                var jSel = $('jurisdictionSelect');
                if (jSel && jSel.options[jSel.selectedIndex]) {
                    jurName = jSel.options[jSel.selectedIndex].text || '';
                }
            }
            scopeText = stateName + ' — County: ' + (jurName || 'Select a county above');
            helperText = 'County-level crash data from Supabase (R2 parquet on demand for detail tabs).';
        } else if (tier === 'city') {
            var cname = '';
            try {
                cname = (typeof jurisdictionContext !== 'undefined' &&
                         jurisdictionContext.tierCity && jurisdictionContext.tierCity.name) || '';
            } catch (e) {}
            scopeText = stateName + ' — City / Town: ' + (cname || 'Select a city / town above');
            helperText = 'City/town crash data from Supabase (R2 parquet on demand for detail tabs).';
        } else {
            scopeText = tierLabel;
            helperText = '';
        }

        var html =
            '<div class="filter-group" id="tierScopeCard" style="flex:1;min-width:260px">' +
                '<label style="font-weight:600;color:#0369a1;display:flex;align-items:center;gap:.4rem;margin-bottom:.5rem">' +
                    '<span aria-hidden="true">🌐</span> Active Scope' +
                    '<span style="margin-left:auto;font-size:.7rem;color:#0369a1;background:#e0f2fe;border:1px solid #7dd3fc;border-radius:4px;padding:1px 7px;white-space:nowrap">' +
                    tierLabel + ' view</span>' +
                '</label>' +
                '<div style="padding:.6rem .75rem;border-radius:var(--radius,4px);border:2px solid #0ea5e9;background:white;font-size:.9rem;color:#0c4a6e;font-weight:600">' +
                    escapeHtml(scopeText) +
                '</div>' +
                (helperText ?
                    '<p style="font-size:.7rem;color:#64748b;margin-top:.35rem">' + escapeHtml(helperText) + '</p>' :
                    '') +
            '</div>';

        if (existing) {
            existing.outerHTML = html;
        } else {
            // Insert next to the (now-hidden) jurisdiction dropdown so layout stays balanced
            var anchor = $('jurisdictionSelect') ? $('jurisdictionSelect').closest('.filter-group') : null;
            if (anchor && anchor.parentNode) {
                anchor.insertAdjacentHTML('afterend', html);
            } else {
                settings.insertAdjacentHTML('beforeend', html);
            }
        }
    }

    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    /**
     * Repaint the upload-zone success card (or "loading" card) so it doesn't
     * lie about the active tier. Called both on tier change and on
     * crashDataLoaded events.
     */
    function paintUploadCard(tier, opts) {
        opts = opts || {};
        var titleEl = $('loadingTitle');
        var subtitleEl = $('loadingSubtitle');
        var iconHost = (function () {
            var zone = $('uploadZone');
            return zone ? zone.querySelector('div') : null;
        })();
        if (!titleEl || !subtitleEl) return;

        if (COUNTY_LIKE[tier] || tier === 'county') {
            // Let existing county/auto-load flow own the success copy.
            return;
        }

        var stateName = activeStateName() || 'selected state';
        var roadLabel = activeRoadTypeLabel();
        var fallback = fallbackR2Url(tier);

        if (opts.phase === 'loading') {
            if (iconHost) iconHost.textContent = '⏳';
            titleEl.textContent = 'Loading ' + (TIER_LABELS[tier] || tier) + ' aggregates…';
            subtitleEl.textContent = 'Source: Supabase matview' + (stateName ? ' — ' + stateName : '');
            return;
        }

        if (opts.phase === 'success') {
            if (iconHost) iconHost.textContent = '✅';
            var total = (typeof opts.total === 'number') ? opts.total : null;
            var source = opts.source || 'Supabase';
            var headline;
            if (tier === 'state') headline = 'Statewide aggregates loaded — ' + stateName;
            else if (tier === 'federal') headline = 'Federal aggregates loaded';
            else if (tier === 'region') headline = 'Regional aggregates loaded — ' + stateName;
            else if (tier === 'mpo') headline = 'MPO aggregates loaded — ' + stateName;
            else if (tier === 'planning_district') headline = 'Planning-district aggregates loaded — ' + stateName;
            else headline = 'Aggregates loaded';
            titleEl.textContent = headline;

            var parts = [];
            if (total != null) parts.push(total.toLocaleString() + ' crashes');
            parts.push('source: ' + source);
            if (roadLabel) parts.push('filter: ' + roadLabel);
            subtitleEl.textContent = parts.join(' · ');

            // Stash R2 fallback URL on the element title for power-users and devtools.
            if (fallback) subtitleEl.title = 'R2 fallback: ' + fallback;
            return;
        }

        if (opts.phase === 'reset') {
            if (iconHost) iconHost.textContent = '📁';
            titleEl.textContent = 'Switching to ' + (TIER_LABELS[tier] || tier) + ' view…';
            subtitleEl.textContent = 'Loading from Supabase…';

            // Add a progress bar below the subtitle so the user has feedback
            // during the multi-second tier switch.
            var progressContainer = document.getElementById('tierSwitchProgress');
            if (!progressContainer) {
                progressContainer = document.createElement('div');
                progressContainer.id = 'tierSwitchProgress';
                progressContainer.style.cssText = 'margin-top:12px;width:100%;max-width:400px;';
                progressContainer.innerHTML = [
                    '<div style="background:rgba(255,255,255,0.15);border-radius:6px;height:8px;overflow:hidden;position:relative;">',
                    '  <div id="tierSwitchProgressBar" style="height:100%;width:5%;background:linear-gradient(90deg,#3b82f6,#60a5fa);border-radius:6px;transition:width 0.3s ease;"></div>',
                    '</div>',
                    '<div id="tierSwitchProgressLabel" style="margin-top:6px;font-size:0.8rem;color:#94a3b8;text-align:center;">Connecting to Supabase…</div>'
                ].join('');
                if (subtitleEl.parentNode) {
                    subtitleEl.parentNode.insertBefore(progressContainer, subtitleEl.nextSibling);
                }
            }
            return;
        }
    }

    function updateTierSwitchProgress(pct, label) {
        var bar = document.getElementById('tierSwitchProgressBar');
        var lbl = document.getElementById('tierSwitchProgressLabel');
        if (bar) bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
        if (lbl && label) lbl.textContent = label;
    }

    function removeTierSwitchProgress() {
        var el = document.getElementById('tierSwitchProgress');
        if (el) el.remove();
    }

    // Cached counts from the most recent Supabase paint. Lets us repaint a
    // truthful success card after a user flips tiers back and forth without
    // re-querying.
    var _lastSupabaseTotal = null;
    var _lastSupabaseTier = null;

    function restoreCountySuccessCard() {
        // When a user flips State → County, repaint the county success copy
        // so the card matches the active source. Two cases:
        //   • R2 already loaded (totalRows > 0) → "Data Auto-Loaded! N records loaded from <path>"
        //   • Supabase-only (R2 deferred)        → "Dashboard ready — <county> · N crashes · source: Supabase matview"
        try {
            if (typeof crashState === 'undefined' || !crashState || !crashState.loaded) return;
            var titleEl = $('loadingTitle');
            var subtitleEl = $('loadingSubtitle');
            if (!titleEl || !subtitleEl) return;
            var iconHost = (function () {
                var zone = $('uploadZone');
                return zone ? zone.querySelector('div') : null;
            })();

            var rows = (typeof crashState.totalRows === 'number') ? crashState.totalRows : 0;
            if (rows > 0 && (crashState.sampleRows && crashState.sampleRows.length > 0)) {
                // R2 has loaded — paint the canonical R2 success copy.
                var path = '';
                try {
                    if (typeof getDataFilePath === 'function') path = getDataFilePath();
                } catch (e) {}
                if (iconHost) iconHost.textContent = '✅';
                titleEl.textContent = 'Data Auto-Loaded!';
                subtitleEl.textContent = rows.toLocaleString() + ' crash records loaded' + (path ? ' from ' + path : '');
                subtitleEl.title = '';
                return;
            }

            // R2 deferred — paint the Supabase-aware county copy.
            paintCountySupabaseCard(_lastSupabaseTotal);
        } catch (e) { /* non-fatal */ }
    }

    function paintCountySupabaseCard(total) {
        var titleEl = $('loadingTitle');
        var subtitleEl = $('loadingSubtitle');
        if (!titleEl || !subtitleEl) return;
        var iconHost = (function () {
            var zone = $('uploadZone');
            return zone ? zone.querySelector('div') : null;
        })();

        var jurisdictionName = '';
        try {
            jurisdictionName = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext.jurisdictionName) || '';
        } catch (e) {}

        if (iconHost) iconHost.textContent = '✅';
        titleEl.textContent = 'Dashboard ready' + (jurisdictionName ? ' — ' + jurisdictionName : '');
        var parts = [];
        if (typeof total === 'number' && total > 0) parts.push(total.toLocaleString() + ' crashes');
        parts.push('source: Supabase matview');
        parts.push('detail tabs load full data on demand');
        subtitleEl.textContent = parts.join(' · ');
        subtitleEl.title = '';
    }

    /**
     * Public entry point. Call from handleTierChange() right after the tier
     * flag is flipped, BEFORE async data work begins, so the UI never lies.
     */
    function applyUploadTierUI(tier) {
        try {
            paintJurisdictionRow(tier);
            if (COUNTY_LIKE[tier] || tier === 'county') {
                restoreCountySuccessCard();
            } else {
                paintUploadCard(tier, { phase: 'reset' });
            }
        } catch (e) {
            console.warn('[TierUI] applyUploadTierUI failed:', e && e.message);
        }
    }

    function getActiveTier() {
        try {
            if (typeof jurisdictionContext !== 'undefined' && jurisdictionContext.viewTier) {
                return jurisdictionContext.viewTier;
            }
        } catch (e) {}
        return 'county';
    }

    // Wire to crashDataLoaded so when the Supabase bridge finishes painting
    // KPIs, the upload card converges to a truthful "loaded" state. Only
    // react to the Supabase source — 'autoload' / 'cache' / 'lazy-empty'
    // are county-tier R2 events with their own copy.
    document.addEventListener('crashDataLoaded', function (evt) {
        var detail = (evt && evt.detail) || {};
        if (detail.source !== 'supabase') return;
        var tier = getActiveTier();
        var total = typeof detail.total === 'number' ? detail.total : null;

        // Stash the most recent Supabase total so a later tier flip can
        // repaint truthfully without re-querying.
        _lastSupabaseTotal = total;
        _lastSupabaseTier = tier;

        if (COUNTY_LIKE[tier] || tier === 'county') {
            paintCountySupabaseCard(total);
            return;
        }
        paintUploadCard(tier, {
            phase: 'success',
            total: total,
            source: 'Supabase matview'
        });
    });

    CL.upload.tierUI = {
        applyUploadTierUI: applyUploadTierUI,
        paintUploadCard: paintUploadCard,
        renderTierScopeCard: renderTierScopeCard,
        fallbackR2Url: fallbackR2Url,
        updateTierSwitchProgress: updateTierSwitchProgress,
        removeTierSwitchProgress: removeTierSwitchProgress
    };

    if (typeof CL._registerModule === 'function') {
        CL._registerModule('upload/upload-tier-ui');
    }
})();
