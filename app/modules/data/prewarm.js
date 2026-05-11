/**
 * Tab pre-warm orchestrator (Round 11).
 *
 * Strategy:
 *   - When the user picks a state + county/jurisdiction on the Upload tab,
 *     trigger a background batch of matview fetches for all the tabs they
 *     might visit next (Map, Hot Spots, Intersections, Ped/Bike, Analysis,
 *     F&S, Safety Focus, Crash Tree).
 *   - Each fetch goes through CL.data.cachedMatview, so when the user later
 *     clicks a tab, the matview lookup is an instant cache hit instead of
 *     a fresh 1-2 s RPC.
 *   - Fetches fire in 3-at-a-time waves (Promise.allSettled per wave) so the
 *     self-hosted Supabase connection pool doesn't get saturated and starve
 *     the user-visible dashboard_summary fetch. Failures don't block other
 *     fetches, and we don't crash the app if one matview is missing on this
 *     state's instance.
 *   - Debounced 800 ms after the last jurisdictionChanged event so rapid
 *     dropdown navigation (state → county → road type) only fires one batch.
 *   - Skipped if the user is already on a non-upload tab (they're driving,
 *     not browsing).
 *
 * Public API:
 *   CL.data.prewarm.schedule(tier, value)   // debounced; idempotent
 *   CL.data.prewarm.runNow(tier, value)     // immediate (used by autoLoad)
 *   CL.data.prewarm.cancel()                // abort pending schedule
 *   CL.data.prewarm.stats()                 // { lastRunMs, lastBatchSize, hits, misses }
 *
 * Diagnostic helper for live profiling. In DevTools after a state change:
 *   CL.data.prewarm.stats()
 *   → { lastRunMs: 1840, lastBatchSize: 9, hits: 9, misses: 0, lastTier: 'planning_district:Central District' }
 *   CL.data.matviewCacheStats()
 *   → { entries: [{key: 'mv_hotspots:planning_district:Central District', ageMs: 2103, ...}, ...], inflight: 0 }
 */
window.CL = window.CL || {};
CL.data = CL.data || {};

(function () {
    'use strict';

    var DEBOUNCE_MS = 800;
    var _timer = null;
    var _stats = { lastRunMs: 0, lastBatchSize: 0, hits: 0, misses: 0, lastTier: null };
    // Round 21 §1.1 — cancellation token. Switching state CO→DE while CO's
    // prewarm is in flight used to back-to-back two 60+s batches on the same
    // connection pool. We track the current batch's AbortController so a new
    // runNow() can abort the old.
    var _activeController = null;
    var _activeKey = null;

    function _onUploadTab() {
        // Active tab is "upload" by id, or no tab class is set yet (initial state).
        var active = document.querySelector('.tab-content.active, [class*=tab-active]');
        if (!active) return true;
        var id = active.id || '';
        return id === 'upload' || id === 'tab-upload' || /upload/i.test(id);
    }

    function _readClient() {
        return (typeof window.crashLensClient === 'object' && window.crashLensClient)
            ? window.crashLensClient
            : null;
    }

    /**
     * Build the list of (mvName, fetcher) pairs for the active tier.
     * Mirror every matview the tab-loaders eventually request — keep this
     * list in sync as new matviews are added. Ordered alphabetically-by-tab
     * (Analysis, Crash Tree, Dashboard, Fatal/Speed, Hot Spots, Intersections,
     * Ped/Bike, Safety Focus) so it's easy to audit.
     */
    function _buildBatch(client, tier, value) {
        var batch = [];
        var push = function (mvName, fetcher, keyExtra, tierOverride, valueOverride) {
            batch.push({
                mvName: mvName,
                fetcher: fetcher,
                keyExtra: keyExtra,                  // optional — passed as cachedMatview's 5th arg
                tier: tierOverride || tier,          // optional override (state-scoped fetchers)
                value: valueOverride || value
            });
        };

        // Round 21 §1.2 — every fetcher closure accepts an optional `callOpts`
        // argument carrying { signal } from prewarm's AbortController. The
        // signal is merged into the client method's opts so _supabaseQuery
        // can wire it through to fetch() and bail mid-flight on state switch.
        var withSignal = function (callOpts, extra) {
            var merged = Object.assign({}, extra || {});
            if (callOpts && callOpts.signal) merged.signal = callOpts.signal;
            return merged;
        };

        // Dashboard / cross-tab
        if (typeof client.getSummary === 'function') {
            push('dashboard_summary', function (callOpts) {
                return client.getSummary(tier, value, withSignal(callOpts));
            });
        }
        // Safety Focus (Safety Categories)
        if (typeof client.getSafetyCategories === 'function') {
            push('mv_safety_categories', function (callOpts) {
                return client.getSafetyCategories(tier, value, withSignal(callOpts));
            });
        }
        // Crash Tree
        if (typeof client.getCrashTree === 'function') {
            push('mv_crash_tree', function (callOpts) {
                return client.getCrashTree(tier, value, withSignal(callOpts));
            });
        }
        // Analysis
        if (typeof client.getAnalysisBreakdown === 'function') {
            push('mv_analysis_summary', function (callOpts) {
                return client.getAnalysisBreakdown(tier, value, withSignal(callOpts));
            });
        }
        // Hot Spots — main matview (per tier/value, with topN keyExtra to match tab loader)
        if (typeof client.getHotspots === 'function') {
            var topNEl = document.getElementById('hsTopN');
            var topN = parseInt(topNEl && topNEl.value, 10) || 25;
            push('mv_hotspots', function (callOpts) {
                return client.getHotspots(tier, value, withSignal(callOpts, { limit: topN }));
            }, { limit: topN });   // keyExtra — must match the tab loader's cachedMatview call
        }
        // Round 15 §3 — Hot Spots crash-rate matview (per tier/value).
        // keyExtra MUST match _loadHotspotsFromMatview (county + limit).
        if (typeof client.getHotspotsWithRates === 'function') {
            var topNEl2 = document.getElementById('hsTopN');
            var topN2 = parseInt(topNEl2 && topNEl2.value, 10) || 25;
            var rateLimit = Math.max(200, topN2 * 4);
            push('mv_hotspots_with_rates', function (callOpts) {
                return client.getHotspotsWithRates(withSignal(callOpts, {
                    county: tier === 'county' ? value : undefined,
                    limit: rateLimit
                }));
            }, { county: tier === 'county' ? value : null, limit: rateLimit });
        }
        // Hot Spots — top collision per location (STATE-SCOPED, not tier/value)
        if (typeof client.getHotspotsTopCollision === 'function') {
            var stateKey = (client.state || (typeof window.crashLensClient !== 'undefined' && window.crashLensClient.state) || '').toLowerCase();
            if (stateKey) {
                push('mv_hotspots_topcoll', function (callOpts) {
                    // getHotspotsTopCollision(stateKey, opts?) — pass signal as 2nd arg
                    return client.getHotspotsTopCollision(stateKey, withSignal(callOpts));
                }, undefined, /* tierOverride */ 'state', /* valueOverride */ stateKey);
            }
        }
        // Hot Spots — per-location factor counts (STATE-SCOPED)
        if (typeof client.getHotspotsFactors === 'function') {
            var stateKey2 = (client.state || (typeof window.crashLensClient !== 'undefined' && window.crashLensClient.state) || '').toLowerCase();
            if (stateKey2) {
                push('mv_hotspots_factors', function (callOpts) {
                    return client.getHotspotsFactors(stateKey2, withSignal(callOpts));
                }, undefined, /* tierOverride */ 'state', /* valueOverride */ stateKey2);
            }
        }
        // Intersections
        if (typeof client.getIntersectionSummary === 'function') {
            push('mv_intersection_summary', function (callOpts) {
                return client.getIntersectionSummary(tier, value, withSignal(callOpts));
            });
        }
        // Ped/Bike
        if (typeof client.getPedBikeBreakdowns === 'function') {
            push('mv_pedbike_breakdowns', function (callOpts) {
                return client.getPedBikeBreakdowns(tier, value, withSignal(callOpts));
            });
        }
        // Round 12 — mv_pedbike_locations: top ped/bike crash locations per
        // mode. Mirrors the cachedMatview key shape used by the tab loader
        // (see updatePeopleFromMatview → renderPedBikeLocationsFromMatview).
        if (typeof client.getPedBikeLocations === 'function') {
            push('mv_pedbike_locations:pedestrian', function (callOpts) {
                return client.getPedBikeLocations(tier, value, 'pedestrian', withSignal(callOpts, { limit: 50 }));
            }, { mode: 'pedestrian' });
            push('mv_pedbike_locations:bicycle', function (callOpts) {
                return client.getPedBikeLocations(tier, value, 'bicycle', withSignal(callOpts, { limit: 50 }));
            }, { mode: 'bicycle' });
        }
        // Round 12 — mv_analysis_extra is unioned by getAnalysisBreakdown's
        // existing fetch, so no extra prewarm entry is required (the SWR
        // cache key is shared). We DO want the standalone accessor warmed
        // for callers that fetch only the extra dimensions explicitly.
        if (typeof client.getAnalysisExtra === 'function') {
            push('mv_analysis_extra', function (callOpts) {
                return client.getAnalysisExtra(tier, value, withSignal(callOpts));
            });
        }

        return batch;
    }

    function runNow(tier, value) {
        var client = _readClient();
        if (!client) {
            console.log('[Prewarm] crashLensClient not ready — skipping');
            return Promise.resolve();
        }
        if (!tier || !value) {
            console.log('[Prewarm] no tier/value — skipping');
            return Promise.resolve();
        }
        if (typeof CL.data.cachedMatview !== 'function') {
            console.log('[Prewarm] matview-cache not available — skipping');
            return Promise.resolve();
        }

        // Round 21 §1.1 — dedupe & supersede. Same (state,tier,value) already
        // in flight? Skip. Different (state,tier,value)? Abort the old one
        // before starting the new one so the connection pool isn't doubled up.
        var stateKey = String(client.state || '').toLowerCase();
        var newKey = stateKey + ':' + tier + ':' + value;
        if (_activeKey === newKey && _activeController && !_activeController.signal.aborted) {
            console.log('[Prewarm] dedupe: same key already in flight for ' + newKey);
            return Promise.resolve();
        }
        if (_activeController && !_activeController.signal.aborted) {
            console.log('[Prewarm] superseded: aborting in-flight batch for ' + _activeKey);
            try { _activeController.abort(); } catch (e) { /* non-fatal */ }
        }
        _activeController = (typeof AbortController === 'function') ? new AbortController() : null;
        _activeKey = newKey;
        var ourSignal = _activeController ? _activeController.signal : null;

        var batch = _buildBatch(client, tier, value);
        if (batch.length === 0) {
            console.log('[Prewarm] empty batch (no matview methods on client) — skipping');
            return Promise.resolve();
        }

        var t0 = Date.now();
        console.log('[Prewarm] kicking off ' + batch.length + ' matview fetches (parallel) for ' + newKey);

        // Round 15 §12.10 — fire all matviews in parallel. The earlier
        // 3-at-a-time wave throttle (Round 11.1) was added to spare the
        // self-hosted Supabase connection pool, but live profiling in
        // Round 14 showed the pool now has headroom for 9-12 concurrent
        // matview reads, and the wave structure costs ~108s wall-clock vs
        // ~25s for the parallel form. The foreground dashboard_summary
        // request is debounced separately by the bridge, so it isn't
        // starved by this fan-out.
        var promises = batch.map(function (item) {
            // Round 21 §1.2 — 6th arg = { signal } so cachedMatview can pass
            // it into the fetcher (data-client methods that accept it forward
            // to fetch()).
            return CL.data.cachedMatview(item.mvName, item.tier, item.value, item.fetcher, item.keyExtra, ourSignal ? { signal: ourSignal } : undefined)
                .then(function () { _stats.hits++; return { mv: item.mvName, ok: true }; })
                .catch(function (err) {
                    if (err && (err.name === 'AbortError' || (ourSignal && ourSignal.aborted))) {
                        return { mv: item.mvName, ok: false, aborted: true };
                    }
                    _stats.misses++;
                    console.warn('[Prewarm] ' + item.mvName + ' failed (non-fatal):', err && err.message);
                    return { mv: item.mvName, ok: false, error: err && err.message };
                });
        });
        Promise.allSettled(promises).then(function (results) {
            if (ourSignal && ourSignal.aborted) {
                console.log('[Prewarm] aborted after ' + (Date.now() - t0) + 'ms (' + newKey + ')');
                return;
            }
            var elapsed = Date.now() - t0;
            _stats.lastRunMs = elapsed;
            _stats.lastBatchSize = batch.length;
            _stats.lastTier = newKey;
            try { window.crashState && (window.crashState._prewarmElapsedMs = elapsed); } catch (e) { /* non-fatal */ }
            var ok = results.filter(function (r) { return r.value && r.value.ok; }).length;
            console.log('[Prewarm] complete: ' + ok + '/' + batch.length + ' matviews warm in ' + elapsed + 'ms (parallel)');
            if (_activeKey === newKey) { _activeKey = null; _activeController = null; }
        });
        return Promise.resolve();   // outer schedule() doesn't await; fire-and-forget
    }

    function schedule(tier, value) {
        if (!_onUploadTab()) {
            // User is on a non-upload tab — they're already driving, the
            // tab-loaders will fetch what they need. Don't compete.
            return;
        }
        if (_timer) clearTimeout(_timer);
        _timer = setTimeout(function () {
            _timer = null;
            runNow(tier, value);
        }, DEBOUNCE_MS);
    }

    function cancel() {
        if (_timer) { clearTimeout(_timer); _timer = null; }
        // Round 21 §1.1 — also abort any in-flight batch so a state-switch
        // doesn't pile a second prewarm on top of the first.
        if (_activeController && !_activeController.signal.aborted) {
            try { _activeController.abort(); } catch (e) { /* non-fatal */ }
        }
        _activeKey = null;
        _activeController = null;
    }

    function stats() {
        return Object.assign({}, _stats);
    }

    CL.data.prewarm = { schedule: schedule, runNow: runNow, cancel: cancel, stats: stats };

    if (typeof CL._registerModule === 'function') {
        CL._registerModule('data/prewarm');
    }
})();
