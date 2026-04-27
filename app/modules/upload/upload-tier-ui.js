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
            // Hide the rich loading card and restore the upload-zone for the
            // success copy. The dashed CSV affordance is still meaningless
            // for aggregate views, but the headline + crash-count subtitle
            // belong here so the user gets the same "loaded" confirmation
            // they get in county view.
            removeTierLoadingCard();
            showUploadZone();
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
            // Hide the dashed CSV upload-zone — its "Drop CSV here" cue is
            // misleading for aggregate views, which load from Supabase. The
            // tierLoadingCard takes its place with a stage-segmented progress
            // bar, large % readout, and stage label so the user sees clearly
            // where the multi-second load is in its lifecycle.
            hideUploadZone();
            renderTierLoadingCard(tier, stateName);
            return;
        }
    }

    // ── Stage-segmented loading card (Connect → Query → Aggregate → Render) ──
    var STAGES = [
        { key: 'connect',   label: 'Connect',   defaultText: 'Connecting to Supabase…' },
        { key: 'query',     label: 'Query',     defaultText: 'Querying matview…' },
        { key: 'aggregate', label: 'Aggregate', defaultText: 'Aggregating crashes…' },
        { key: 'render',    label: 'Render',    defaultText: 'Rendering dashboard…' }
    ];

    function activeStageIndex(pct) {
        if (pct < 25) return 0;
        if (pct < 50) return 1;
        if (pct < 75) return 2;
        return 3;
    }

    function defaultStageText(pct) {
        return STAGES[activeStageIndex(pct)].defaultText;
    }

    function hideUploadZone() {
        var zone = $('uploadZone');
        if (zone) {
            zone.dataset._prevDisplay = zone.style.display || '';
            zone.style.display = 'none';
        }
    }

    function showUploadZone() {
        var zone = $('uploadZone');
        if (zone) {
            zone.style.display = zone.dataset._prevDisplay || '';
            delete zone.dataset._prevDisplay;
        }
    }

    function removeTierLoadingCard() {
        var el = $('tierLoadingCard');
        if (el) el.remove();
    }

    function renderTierLoadingCard(tier, stateName) {
        removeTierLoadingCard();
        var tierLabel = TIER_LABELS[tier] || tier;
        var subtitle = 'Loading from Supabase' + (stateName ? ' — ' + escapeHtml(stateName) : '');

        var segmentsHtml = STAGES.map(function (s, i) {
            return [
                '<div class="tier-stage" data-stage="' + i + '" style="flex:1;display:flex;flex-direction:column;gap:6px;align-items:center">',
                  '<div class="tier-stage-track" style="width:100%;height:10px;background:#e5e7eb;border-radius:5px;overflow:hidden">',
                    '<div class="tier-stage-fill" style="height:100%;width:0%;background:linear-gradient(90deg,#3b82f6,#60a5fa);border-radius:5px;transition:width .3s ease"></div>',
                  '</div>',
                  '<div class="tier-stage-label" style="font-size:.7rem;font-weight:600;color:#94a3b8;letter-spacing:.02em;text-transform:uppercase">' + s.label + '</div>',
                '</div>'
            ].join('');
        }).join('');

        var html = [
            '<div id="tierLoadingCard" style="margin:1rem auto;max-width:560px;padding:1.5rem 1.75rem;background:white;border-radius:var(--radius,8px);border:1px solid #e2e8f0;box-shadow:0 4px 12px rgba(15,23,42,.06)">',
              '<div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.25rem">',
                '<span aria-hidden="true" style="font-size:1.4rem">📂</span>',
                '<div style="font-size:1.05rem;font-weight:700;color:#0f172a">Switching to ' + escapeHtml(tierLabel) + ' view…</div>',
              '</div>',
              '<div style="font-size:.85rem;color:#64748b;margin-bottom:1.1rem">' + subtitle + '</div>',
              '<div style="display:flex;gap:10px;align-items:flex-end;margin-bottom:1.1rem">' + segmentsHtml + '</div>',
              '<div style="display:flex;align-items:baseline;justify-content:center;gap:.85rem">',
                '<div id="tierLoadingPct" style="font-size:2.75rem;font-weight:800;color:#0ea5e9;line-height:1;font-variant-numeric:tabular-nums">0%</div>',
                '<div id="tierLoadingStageText" style="font-size:.95rem;color:#475569;font-weight:500">' + escapeHtml(STAGES[0].defaultText) + '</div>',
              '</div>',
            '</div>'
        ].join('');

        var zone = $('uploadZone');
        if (zone && zone.parentNode) {
            zone.insertAdjacentHTML('beforebegin', html);
        } else {
            // Fallback: drop it at the end of the upload card body
            var card = document.querySelector('.card-body') || document.body;
            card.insertAdjacentHTML('beforeend', html);
        }
    }

    function updateTierSwitchProgress(pct, label) {
        pct = Math.min(100, Math.max(0, Number(pct) || 0));
        var pctEl = $('tierLoadingPct');
        var stageTextEl = $('tierLoadingStageText');
        var fills = document.querySelectorAll('#tierLoadingCard .tier-stage-fill');
        var labels = document.querySelectorAll('#tierLoadingCard .tier-stage-label');

        if (pctEl) pctEl.textContent = Math.round(pct) + '%';
        if (stageTextEl) stageTextEl.textContent = label || defaultStageText(pct);

        // Each segment owns a 25-point slice of the overall progress.
        for (var i = 0; i < fills.length; i++) {
            var lo = i * 25, hi = lo + 25;
            var segPct;
            if (pct >= hi) segPct = 100;
            else if (pct <= lo) segPct = 0;
            else segPct = ((pct - lo) / 25) * 100;
            fills[i].style.width = segPct + '%';
            // Light up the active/completed stage labels in the brand color so
            // the user can tell at a glance which stage is in progress.
            if (labels[i]) {
                labels[i].style.color = (pct >= lo) ? '#0369a1' : '#94a3b8';
            }
        }
    }

    function removeTierSwitchProgress() {
        removeTierLoadingCard();
        showUploadZone();
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
