/**
 * CrashLens Data Client v1.0
 * Dual-source module: Supabase REST API (primary) → R2 parquet (fallback)
 *
 * Usage:
 *   const client = new CrashLensDataClient({ state: 'delaware' });
 *   const summary = await client.getSummary('county', 'Kent');
 *   const crashes = await client.getCrashes('county', 'Kent', { year: 2023 });
 *   const mapDots = await client.getMapCrashes(bounds, { severity: ['K','A'] });
 */

class CrashLensDataClient {

  // ─────────────────────────────────────────────────────────
  //  CONFIG
  // ─────────────────────────────────────────────────────────

  static DEFAULTS = {
    supabaseUrl:  'https://srv1503081.hstgr.cloud/rest/v1',
    supabaseKey:  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc0OTEyNDczLCJleHAiOjIwOTAyNzI0NzN9.5arUDeH3ccQ9O-UK57wFu7w1jKaIoIq3uroqithXjQs',
    r2BaseUrl:    'https://data.aicreatesai.com',
    timeout:      30000,   // 30s for Supabase (text ILIKE on large jurisdictions can take >15s), then fallback
    mapLimit:     10000,   // max crash dots per viewport (raised for Phase 3 viewport queries)
    pageSize:     25,      // rows per page for detail tables
    preferSupabase: true,
  };

  // 7-tier hierarchy: tier name → Supabase column.
  // Default shape used by dashboard_summary, mv_safety_categories,
  // mv_crash_tree, and mv_analysis_summary.
  static TIER_COLUMNS = {
    federal:           null,                   // no filter, all states
    state:             'state',
    region:            'dot_district',
    planning_district: 'planning_district',
    mpo:               'mpo_name',
    county:            'physical_juris_name',
    city:              'physical_juris_name',
  };

  // Per-matview column overrides. mv_hotspots and mv_grants_baseline
  // aliased physical_juris_name → county, dot_district → region,
  // mpo_name → mpo at CREATE time. PostgREST surfaces the alias, not
  // the source column, so requests using the dashboard_summary names
  // against those two matviews return HTTP 400 (which the data-client
  // catches and logs as "matview missing?"). Default to the
  // dashboard_summary names; override only where the alias differs.
  // Tier-column map per matview.
  //
  // Two distinct naming conventions exist in the Supabase matviews; the wrong
  // entry here sends PostgREST a column filter that doesn't exist and returns
  // HTTP 400 (or silent zero rows). When adding a new matview, check its
  // columns with `pg_attribute` and register the right convention.
  //
  //   Convention A (jurisdictional facts):
  //     region            → dot_district
  //     mpo               → mpo_name
  //     county / city     → physical_juris_name
  //     planning_district → planning_district
  //   Matviews: dashboard_summary, mv_crash_tree, mv_intersection_summary,
  //     mv_safety_categories, mv_safety_focus_locations, mv_pedbike_locations,
  //     mv_pedbike_breakdowns, mv_fatal_factors, mv_speed_summary.
  //   Used by the `default` map.
  //
  //   Convention B (location/hotspot tables — shorter names):
  //     region            → region
  //     mpo               → mpo
  //     county / city     → county
  //     planning_district → planning_district
  //   Matviews: mv_hotspots, mv_hotspots_with_rates, mv_grant_ready_locations,
  //     mv_grants_baseline.
  //   Each gets its own named entry below.
  //
  // Rule when adding a matview: pick the entry whose `region` / `mpo` /
  // `county` column names match the matview's `pg_attribute` list, or add
  // a new entry. NEVER let it fall through to `default` if the matview uses
  // Convention B — the silent-zero-rows mode is hard to detect downstream.
  static TIER_COLUMNS_BY_MATVIEW = {
    // Convention A (default)
    default: {
      federal:           null,
      state:             'state',
      region:            'dot_district',
      planning_district: 'planning_district',
      mpo:               'mpo_name',
      county:            'physical_juris_name',
      city:              'physical_juris_name',
    },
    // Convention B
    mv_hotspots: {
      federal:           null,
      state:             'state',
      region:            'region',
      planning_district: 'planning_district',
      mpo:               'mpo',
      county:            'county',
      city:              'county',
    },
    mv_hotspots_with_rates: {
      federal:           null,
      state:             'state',
      region:            'region',
      planning_district: 'planning_district',
      mpo:               'mpo',
      county:            'county',
      city:              'county',
    },
    mv_grant_ready_locations: {
      federal:           null,
      state:             'state',
      region:            'region',
      planning_district: 'planning_district',
      mpo:               'mpo',
      county:            'county',
      city:              'county',
    },
    mv_grants_baseline: {
      federal:           null,
      state:             'state',
      region:            'region',
      planning_district: 'planning_district',
      mpo:               'mpo',
      county:            'county',
      city:              'county',
    },
    // mv_safety_categories_yearly: Convention A but no dot_district column.
    // Null out region tier so we don't send a non-existent column filter and
    // PostgREST 400s.
    mv_safety_categories_yearly: {
      federal:           null,
      state:             'state',
      region:            null,
      planning_district: 'planning_district',
      mpo:               'mpo_name',
      county:            'physical_juris_name',
      city:              'physical_juris_name',
    },
  };

  // Frontend column names (Title Case) → Supabase column names (snake_case)
  static COL_MAP = {
    'OBJECTID':                'objectid',
    'Document Nbr':            'document_nbr',
    'Crash Year':              'crash_year',
    'Crash Date':              'crash_date',
    'Crash Military Time':     'crash_military_time',
    'Crash Severity':          'crash_severity',
    'K_People':                'k_people',
    'A_People':                'a_people',
    'B_People':                'b_people',
    'C_People':                'c_people',
    'Persons Injured':         'persons_injured',
    'Pedestrians Killed':      'pedestrians_killed',
    'Pedestrians Injured':     'pedestrians_injured',
    'Vehicle Count':           'vehicle_count',
    'Collision Type':          'collision_type',
    'Weather Condition':       'weather_condition',
    'Light Condition':         'light_condition',
    'Roadway Surface Condition': 'roadway_surface_cond',
    'Relation To Roadway':     'relation_to_roadway',
    'Roadway Alignment':       'roadway_alignment',
    'Roadway Surface Type':    'roadway_surface_type',
    'Roadway Defect':          'roadway_defect',
    'Roadway Description':     'roadway_description',
    'Intersection Type':       'intersection_type',
    'Traffic Control Type':    'traffic_control_type',
    'Traffic Control Status':  'traffic_control_status',
    'Work Zone Related':       'work_zone_related',
    'Work Zone Location':      'work_zone_location',
    'Work Zone Type':          'work_zone_type',
    'School Zone':             'school_zone',
    'First Harmful Event':     'first_harmful_event',
    'First Harmful Event Loc': 'first_harmful_event_loc',
    'Alcohol?':                'alcohol',
    'Animal Related?':         'animal_related',
    'Unrestrained?':           'unrestrained',
    'Bike?':                   'bike',
    'Distracted?':             'distracted',
    'Drowsy?':                 'drowsy',
    'Drug Related?':           'drug_related',
    'Guardrail Related?':      'guardrail_related',
    'Hitrun?':                 'hitrun',
    'Lgtruck?':                'lgtruck',
    'Motorcycle?':             'motorcycle',
    'Pedestrian?':             'pedestrian',
    'Speed?':                  'speed',
    'Max Speed Diff':          'max_speed_diff',
    'RoadDeparture Type':      'road_departure_type',
    'Intersection Analysis':   'intersection_analysis',
    'Senior?':                 'senior',
    'Young?':                  'young',
    'Mainline?':               'mainline',
    'Night?':                  'night',
    'DOT District':            'dot_district',
    'Juris Code':              'juris_code',
    'Physical Juris Name':     'physical_juris_name',
    'Functional Class':        'functional_class',
    'Facility Type':           'facility_type',
    'Area Type':               'area_type',
    'SYSTEM':                  'system',
    'VSP':                     'vsp',
    'Ownership':               'ownership',
    'Planning District':       'planning_district',
    'MPO Name':                'mpo_name',
    'RTE Name':                'rte_name',
    'RNS MP':                  'rns_mp',
    'Node':                    'node',
    'Node Offset (ft)':        'node_offset_ft',
    'x':                       'x',
    'y':                       'y',
    'Intersection Name':       'intersection_name',
    'EPDO_Score':              'epdo_score',
    'FIPS':                    'fips',
    'Place FIPS':              'place_fips',
  };

  // Reverse map: snake_case → Title Case
  static PG_TO_FRONTEND = Object.fromEntries(
    Object.entries(CrashLensDataClient.COL_MAP).map(([k, v]) => [v, k])
  );

  // EPDO weights (FHWA 2025)
  static EPDO = { K: 883, A: 94, B: 21, C: 11, O: 1 };

  // Map a road-type bucket → list of crashes.ownership values that fall in it.
  // Used by _supabaseCrashes / _supabaseMapCrashes when filtering the raw
  // crashes table by bucket (the matviews have a real road_type column, but
  // the base table only has `ownership`).
  //
  // The 4-bucket model rebuilds (2026-04-30) derive road_type from
  // crashes.ownership directly. These lists cover the values seen in the
  // Delaware dataset; states using different ownership labels can extend the
  // map at runtime via:
  //
  //   CrashLensDataClient.OWNERSHIP_BUCKETS.dot_roads.push('My State DOT');
  //
  // When no entry matches a bucket, the filter is dropped (= no filter)
  // rather than producing a 0-row query.
  static OWNERSHIP_BUCKETS = {
    dot_roads:    ['State Highway Agency', 'State', 'State Highway'],
    county_roads: ['County Highway Agency', 'County'],
    city_roads:   ['City or Municipal Highway Agency', 'City', 'Municipal', 'Town'],
    other_roads:  ['Other', 'Federal', 'Private', 'Tribal', 'Other Local Agency']
  };

  /**
   * Map a "Road Type" radio value (countyOnly / cityOnly / countyPlusVDOT /
   * allRoads) to a bucket-spec object {roadType?, roadTypes?, noInterstate?}.
   *
   * Delegates to CL.data.roadTypeMapping — the single source of truth shared
   * with supabase-bridge.roadTypeSpec(), updateRoadTypeLabels(), and
   * getActiveRoadTypeSuffix(). Only federal/state/region are aggregate tiers;
   * mpo / planning_district / county / city are place tiers.
   */
  static radioToBucket(radioValue, tier) {
    const t = tier || 'county';
    if (typeof window !== 'undefined' && window.CL && window.CL.data && window.CL.data.roadTypeMapping) {
      const src = window.CL.data.roadTypeMapping.specFor(t, radioValue) || {};
      // Defensive copy — caller may mutate.
      const out = {};
      if (src.roadType) out.roadType = src.roadType;
      if (Array.isArray(src.roadTypes)) out.roadTypes = src.roadTypes.slice();
      if (src.noInterstate) out.noInterstate = true;
      return out;
    }
    // Headless / non-DOM context (tests in Node) — inline mirror of the
    // mapping table. Keep in sync with road-type-mapping.js.
    const aggregate = (t === 'federal' || t === 'state' || t === 'region');
    if (radioValue === 'allRoads')   return {};
    if (radioValue === 'countyOnly') return { roadType: aggregate ? 'dot_roads' : 'county_roads' };
    if (radioValue === 'cityOnly')   return { roadType: 'city_roads' };
    if (radioValue === 'countyPlusVDOT') {
      if (aggregate) {
        return { roadTypes: ['city_roads', 'county_roads', 'other_roads'] };
      }
      return { noInterstate: true };
    }
    return {};
  }

  /**
   * Read the active "Road Type" radio in the DOM and return the bucket spec
   * for the given tier. Returns {} if no radio is found (= "all roads").
   */
  static activeRoadType(tier) {
    if (typeof document === 'undefined') return {};
    const radio = document.querySelector('input[name="roadTypeFilter"]:checked');
    const val = radio ? radio.value : ((typeof localStorage !== 'undefined' && localStorage.getItem('selectedFilterProfile')) || 'allRoads');
    return CrashLensDataClient.radioToBucket(val, tier);
  }

  // ─────────────────────────────────────────────────────────
  //  CONSTRUCTOR
  // ─────────────────────────────────────────────────────────

  constructor(opts = {}) {
    this.supabaseUrl    = opts.supabaseUrl  || CrashLensDataClient.DEFAULTS.supabaseUrl;
    this.supabaseKey    = opts.supabaseKey  || CrashLensDataClient.DEFAULTS.supabaseKey;
    this.r2BaseUrl      = opts.r2BaseUrl    || CrashLensDataClient.DEFAULTS.r2BaseUrl;
    this.timeout        = opts.timeout      || CrashLensDataClient.DEFAULTS.timeout;
    this.mapLimit       = opts.mapLimit     || CrashLensDataClient.DEFAULTS.mapLimit;
    this.pageSize       = opts.pageSize     || CrashLensDataClient.DEFAULTS.pageSize;
    this.preferSupabase = opts.preferSupabase ?? CrashLensDataClient.DEFAULTS.preferSupabase;
    this.state          = opts.state        || null;
    this._source        = 'none'; // Track last data source for debugging
  }

  /** Last data source used: 'supabase' | 'r2' | 'none' */
  get source() { return this._source; }

  // ─────────────────────────────────────────────────────────
  //  PUBLIC API
  // ─────────────────────────────────────────────────────────

  /**
   * Get summary statistics for a tier/jurisdiction.
   * Source: dashboard_summary matview (instant, ~50K rows total)
   *
   * @deprecated For pure KPI reads, prefer getDashboardTierKpi() — it hits
   *   mv_dashboard_tier_kpi (~1600 rows/state, ~50 KB) instead of the
   *   58K-row dashboard_summary (~31 MB). dashboard_summary is retained for
   *   per-severity breakdown (B/C/O cards) and the per-func-class/per-
   *   collision-type tables until mv_dashboard_tier_kpi carries those
   *   dimensions.
   *
   * @param {string} tier - 'federal'|'state'|'region'|'planning_district'|'mpo'|'county'|'city'
   * @param {string} value - Jurisdiction name (e.g. 'Kent', 'North District')
   * @param {object} filters - { yearFrom, yearTo, severity, fc, areaType, roadType }
   *                           roadType: matview road_type bucket ('dot_roads', 'city_roads',
   *                           'non_dot_roads', etc.). Omit for all-roads (no filter).
   * @returns {Promise<Array>} Summary rows with crash_count, fatals, ped_crashes, etc.
   */
  async getSummary(tier, value, filters = {}) {
    if (this.preferSupabase && this.supabaseKey) {
      // Normalize roadTypes order before keying — SQL `IN(...)` is
      // order-insensitive so two equivalent calls (['city_roads',...]) and
      // (['county_roads','city_roads',...]) must hit the same cache slot.
      // Defensive copy so we don't mutate caller's filters object.
      const keyFilters = (Array.isArray(filters.roadTypes) && filters.roadTypes.length > 1)
        ? { ...filters, roadTypes: filters.roadTypes.slice().sort() }
        : filters;
      const swrKey = CrashLensDataClient._swrKey({
        op: 'getSummary', state: this.state, tier, value, filters: keyFilters
      });
      try {
        const data = await this._swr(swrKey, () => this._supabaseSummary(tier, value, filters));
        this._source = 'supabase';
        return data;
      } catch (e) {
        console.warn('[DataClient] Supabase summary failed, falling back to R2:', e.message);
      }
    }
    // Fallback: load R2 parquet + aggregate client-side
    const rows = await this._r2LoadCrashes(tier, value);
    this._source = 'r2';
    return this._aggregateLocally(rows, filters);
  }

  /**
   * Get individual crash rows for detail tables, CMF, Warrants, etc.
   * Source: crashes table with filters + pagination
   *
   * @param {string} tier
   * @param {string} value
   * @param {object} filters - {
   *     year, severity (string or array), route, node,
   *     text (searches route/collision/doc_nbr/intersection/weather),
   *     pedBike ('ped'|'bike'|'either'),
   *     dateFrom (YYYY-MM-DD), dateTo (YYYY-MM-DD),
   *     page, pageSize,
   *     all (bool) — if true, bypass pagination and fetch up to maxRows rows,
   *     maxRows (default 10000)
   * }
   * @returns {Promise<{rows: Array, total: number, page: number}>}
   */
  async getCrashes(tier, value, filters = {}) {
    if (this.preferSupabase && this.supabaseKey) {
      try {
        const data = await this._supabaseCrashes(tier, value, filters);
        this._source = 'supabase';
        return data;
      } catch (e) {
        console.warn('[DataClient] Supabase crashes failed, falling back to R2:', e.message);
      }
    }
    const rows = await this._r2LoadCrashes(tier, value);
    this._source = 'r2';
    return this._filterLocally(rows, filters);
  }

  /**
   * Canonical form of a route/node name: uppercased, stripped of every
   * non-alphanumeric character. Used to compare values across the
   * client-side CSV and server-side Postgres when formatting rules differ.
   *   'DE 18'  → 'DE18'
   *   'DE-18'  → 'DE18'
   *   'DE 18 ' → 'DE18'
   *   'SR 1'   → 'SR1'    (note: does NOT match 'SR0001' / zero-padding)
   */
  static canonicalLocationName(s) {
    return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  /**
   * Fetch ALL crash rows for a specific location (route or node) within a tier.
   * Used by CMF & Warrants tabs which need the complete set of location crashes
   * for profile/pattern analysis — pagination would break those aggregates.
   *
   * Resilience strategy for cross-state name-format drift:
   *   1. Try exact match: rte_name=eq.<value>. Fast, uses b-tree index.
   *   2. If 0 rows AND the value contains separators (space/dash/dot/underscore),
   *      retry with ILIKE — replace run of separators with a single `*` wildcard
   *      so 'DE 18' matches 'DE-18', 'DE18', 'DE  18', etc.
   *   3. Verify the ILIKE response client-side by canonicalising each row's
   *      name (strip non-alphanumerics, uppercase) — eliminates false
   *      positives like 'SR 1' accidentally matching 'SR 11'.
   *
   * @param {string} tier - 'county'|'state'|...
   * @param {string} tierValue - jurisdiction name (e.g. 'Kent')
   * @param {string} locationType - 'route' or 'node'
   * @param {string} locationValue - route name or node id
   * @param {number} maxRows - safety cap (default 10000)
   * @returns {Promise<Array>} Array of rows (Title Case keys, matching COL)
   */
  async getCrashesByLocation(tier, tierValue, locationType, locationValue, maxRows) {
    if (locationType !== 'route' && locationType !== 'node') {
      throw new Error('locationType must be "route" or "node"');
    }
    const cap = maxRows || 10000;

    // Stage 1: exact match
    const exactFilters = { all: true, maxRows: cap };
    if (locationType === 'route') exactFilters.route = locationValue;
    else exactFilters.node = locationValue;
    const exact = await this.getCrashes(tier, tierValue, exactFilters);
    const exactRows = exact.rows || [];
    if (exactRows.length > 0) return exactRows;

    // Stage 2 + 3: fuzzy ILIKE retry with canonical verification.
    // Only bother if the value has a separator we could normalise away.
    const raw = String(locationValue || '');
    const pattern = raw.replace(/[\s\-_.]+/g, '*').trim();
    if (!pattern || pattern === raw) return exactRows; // nothing to fuzz

    const fuzzyFilters = { all: true, maxRows: cap };
    if (locationType === 'route') fuzzyFilters.routePattern = pattern;
    else fuzzyFilters.nodePattern = pattern;

    let fuzzyRows;
    try {
      const fuzzy = await this.getCrashes(tier, tierValue, fuzzyFilters);
      fuzzyRows = fuzzy.rows || [];
    } catch (e) {
      console.warn('[DataClient] Fuzzy location retry failed:', e.message);
      return exactRows; // fall through to caller's own fallback (e.g. sampleRows)
    }

    // Client-side canonical verification
    const canonicalTarget = CrashLensDataClient.canonicalLocationName(raw);
    const key = locationType === 'route' ? 'RTE Name' : 'Node';
    const verified = fuzzyRows.filter(r =>
      CrashLensDataClient.canonicalLocationName(r[key]) === canonicalTarget
    );

    if (verified.length > 0) {
      console.log(
        `[DataClient] Fuzzy match recovered ${verified.length} rows for ${locationType}='${raw}' via pattern '${pattern}'`
      );
    }
    return verified;
  }

  /**
   * Get crash dots for map viewport.
   * Source: crashes table with PostGIS bounding box
   *
   * @param {object} bounds - { west, south, east, north } (lng/lat)
   * @param {object} filters - { severity, year, route }
   * @param {number} limit - Max points (default 5000)
   * @returns {Promise<Array>} Rows with x, y, crash_severity, objectid
   */
  async getMapCrashes(bounds, filters = {}, limit) {
    limit = limit || this.mapLimit;
    if (this.preferSupabase && this.supabaseKey) {
      try {
        const data = await this._supabaseMapCrashes(bounds, filters, limit);
        this._source = 'supabase';
        return data;
      } catch (e) {
        console.warn('[DataClient] Supabase map failed, falling back to R2:', e.message);
      }
    }
    // Fallback: filter from loaded data
    const tier = 'state';
    const rows = await this._r2LoadCrashes(tier, this.state);
    this._source = 'r2';
    return rows.filter(r => {
      const rx = parseFloat(r.x || r['x']), ry = parseFloat(r.y || r['y']);
      return rx >= bounds.west && rx <= bounds.east && ry >= bounds.south && ry <= bounds.north;
    }).slice(0, limit);
  }

  /**
   * Phase 3: Zoom-aware viewport crash query via PostGIS RPC.
   * Returns clusters at low zoom, individual points at high zoom.
   *
   * @param {object} bounds - { south, west, north, east } from crashMap.getBounds()
   * @param {number} zoom   - crashMap.getZoom()
   * @param {object} opts   - { tier, tierValue, year, severity[], limit, signal }
   *                          `signal` is an external AbortSignal — if it fires,
   *                          the error is propagated (NOT swallowed into fallback)
   *                          so the caller can ignore a superseded request.
   * @returns {Promise<Array>} rows with { cx, cy, n, fatals, serious, epdo, is_cluster, ...pointFields }
   */
  async getViewportCrashes(bounds, zoom, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) {
      return this._fallbackViewportFromMapPoints(bounds, zoom);
    }

    const tierCol = opts.tier ? CrashLensDataClient.TIER_COLUMNS[opts.tier] : null;
    // Federal tier spans every state — pass NULL so the RPC skips its
    // `AND state = $p_state` filter (verified backend behavior 2026-04-26).
    // All other tiers stay scoped to the active state.
    const body = {
      p_state:    opts.tier === 'federal' ? null : this.state,
      p_bbox:     `SRID=4326;POLYGON((${bounds.west} ${bounds.south},${bounds.east} ${bounds.south},${bounds.east} ${bounds.north},${bounds.west} ${bounds.north},${bounds.west} ${bounds.south}))`,
      p_zoom:     zoom,
      p_tier_col: tierCol || null,
      p_tier_val: opts.tierValue || null,
      p_year:     opts.year || null,
      p_severity: opts.severity || null,
      p_limit:    opts.limit || this.mapLimit,
      // 4-bucket road_type spec — RPC signature extended 2026-04-30 with three
      // new params keyed off the same is_interstate / road_type columns the
      // matviews use. NULL = unfiltered. p_road_types takes precedence over
      // p_road_type when both are supplied.
      p_road_type:     opts.roadType || null,
      p_road_types:    Array.isArray(opts.roadTypes) && opts.roadTypes.length > 0 ? opts.roadTypes : null,
      p_no_interstate: opts.noInterstate ? true : null
    };

    const url = `${this.supabaseUrl}/rpc/map_viewport_crashes`;
    // Combine: timeout (internal) + optional external abort signal
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, this.timeout);
    const onExternalAbort = () => controller.abort();
    if (opts.signal) {
      if (opts.signal.aborted) {
        clearTimeout(timer);
        const err = new DOMException('Aborted', 'AbortError');
        throw err;
      }
      opts.signal.addEventListener('abort', onExternalAbort, { once: true });
    }

    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (opts.signal) opts.signal.removeEventListener('abort', onExternalAbort);

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }

      this._source = 'supabase';
      return await resp.json();
    } catch (e) {
      clearTimeout(timer);
      if (opts.signal) opts.signal.removeEventListener('abort', onExternalAbort);
      // External abort (caller superseded the request): propagate — do NOT fallback
      if (e.name === 'AbortError' && !timedOut) throw e;
      // Timeout or network/server error: fall back to client-side filtering
      console.warn('[DataClient] Viewport query failed, falling back:', e.message);
      return this._fallbackViewportFromMapPoints(bounds, zoom);
    }
  }

  /**
   * Fallback: filter existing crashState.mapPoints client-side.
   * Used when Supabase is unavailable or during R2-only sessions.
   */
  _fallbackViewportFromMapPoints(bounds, zoom) {
    if (typeof crashState === 'undefined' || !crashState.mapPoints) return [];
    const pts = crashState.mapPoints.filter(p =>
      p.lat >= bounds.south && p.lat <= bounds.north &&
      p.lng >= bounds.west  && p.lng <= bounds.east
    );
    return pts.map(p => ({
      cx: p.lng, cy: p.lat, n: 1, fatals: p.sev === 'K' ? 1 : 0,
      serious: p.sev === 'A' ? 1 : 0,
      epdo: ({ K: 883, A: 94, B: 21, C: 11, O: 1 })[p.sev] || 1,
      is_cluster: false,
      objectid: p.docNum || null,
      crash_severity: p.sev, crash_year: null,
      collision_type: p.collision, rte_name: p.route,
      intersection_name: p.node,
      crash_date: p.date, crash_military_time: p.time,
      pedestrian: p.isPed ? 'Yes' : 'No',
      bike: p.isBike ? 'Yes' : 'No',
      speed: p.isSpeed ? 'Yes' : 'No',
      weather_condition: p.weather,
      light_condition: p.light,
      document_nbr: p.docNum || null,
      night: p.isNight ? 'Yes' : 'No'
    }));
  }

  /**
   * Get full crash detail (Tier 1 + JSONB road_data + state_extras).
   * Source: crashes table by objectid
   *
   * @param {string} objectid
   * @returns {Promise<object|null>} Full crash record
   */
  async getCrashDetail(objectid) {
    if (this.preferSupabase && this.supabaseKey) {
      try {
        const data = await this._supabaseQuery('crashes', {
          select: '*',
          filters: { state: `eq.${this.state}`, objectid: `eq.${objectid}` },
          single: true,
        });
        this._source = 'supabase';
        return data ? this._expandJsonb(data) : null;
      } catch (e) {
        console.warn('[DataClient] Supabase detail failed:', e.message);
      }
    }
    return null; // No R2 fallback for single crash detail
  }

  /**
   * Get jurisdiction baselines (14 metrics per jurisdiction).
   * Source: jurisdiction_baselines matview
   *
   * @param {string} state
   * @returns {Promise<Array>}
   */
  async getBaselines(state) {
    state = state || this.state;
    if (this.preferSupabase && this.supabaseKey) {
      try {
        const data = await this._supabaseQuery('jurisdiction_baselines', {
          filters: { state: `eq.${state}` },
          limit: 1000,
        });
        this._source = 'supabase';
        return data;
      } catch (e) {
        console.warn('[DataClient] Baselines failed:', e.message);
      }
    }
    return [];
  }

  /**
   * Get scorecard rankings from scorecard_rankings matview.
   * @param {string} state - State key (e.g. 'delaware')
   * @param {number} year - Crash year
   * @param {Object} options - Optional filters
   * @returns {Promise<Array>} Ranked jurisdiction rows
   */
  async getScorecard(state, year, options = {}) {
    state = state || this.state;
    if (this.preferSupabase && this.supabaseKey) {
      try {
        const filters = { state: `eq.${state}` };
        if (year) {
          if (options.yearEnd) {
            filters.and = `(crash_year.gte.${year},crash_year.lte.${options.yearEnd})`;
          } else {
            filters.crash_year = `eq.${year}`;
          }
        }
        if (options.dotDistrict) filters.dot_district = `eq.${options.dotDistrict}`;
        if (options.planningDistrict) filters.planning_district = `eq.${options.planningDistrict}`;
        if (options.mpoName) filters.mpo_name = `eq.${options.mpoName}`;
        if (options.jurisdiction) filters.jurisdiction = `eq.${options.jurisdiction}`;
        const data = await this._supabaseQuery('scorecard_rankings', {
          filters: filters,
          order: 'rank_total_crashes.asc',
          limit: 5000,
        });
        this._source = 'supabase';
        // Dedupe: the matview emits one row per (state × jurisdiction × dot_district
        // × planning_district × mpo_name × year). Kent shows up 6× in DE 2023, etc.
        // Keep the row with the largest total_crashes per (jurisdiction, year) — that's
        // the most-aggregated (parent-NULL) row, which represents the canonical totals.
        // State-agnostic: works for any state's partition.
        const dedupKey = (r) => `${r.jurisdiction}|${r.crash_year}`;
        const map = new Map();
        (data || []).forEach(r => {
          const k = dedupKey(r);
          const existing = map.get(k);
          if (!existing || (Number(r.total_crashes) || 0) > (Number(existing.total_crashes) || 0)) {
            map.set(k, r);
          }
        });
        const deduped = [...map.values()];
        // Re-rank after dedupe so rank_* columns reflect the canonical row order.
        const _resortByMetric = (key, rankKey) => {
          const sorted = deduped.slice().sort((a, b) => (Number(b[key]) || 0) - (Number(a[key]) || 0));
          sorted.forEach((r, i) => { r[rankKey] = i + 1; });
        };
        _resortByMetric('total_crashes',    'rank_total_crashes');
        _resortByMetric('fatal_crashes',    'rank_fatal');
        _resortByMetric('ksi_crashes',      'rank_ksi');
        _resortByMetric('total_epdo',       'rank_epdo');
        _resortByMetric('ped_crashes',      'rank_ped');
        _resortByMetric('bike_crashes',     'rank_bike');
        _resortByMetric('impaired_crashes', 'rank_impaired');
        _resortByMetric('speed_crashes',    'rank_speed');
        _resortByMetric('night_crashes',    'rank_night');
        console.log(`[Scorecard] Deduped ${(data || []).length} rows → ${deduped.length} unique jurisdictions for ${state}/${year}`);
        return deduped;
      } catch (e) {
        console.warn('[DataClient] Scorecard failed:', e.message);
      }
    }
    return [];
  }

  /**
   * mv federal_summary — per-state annual rollup.
   * Aggregates across area_type / functional_class / ownership / severity to
   * give one row per (state, year). Used by the federal-tier Safety Scorecard.
   *
   * Pulls 4 prior years too so the renderer can paint a 5-yr sparkline and
   * compute YoY deltas without a second request.
   *
   * @param {number} yearStart - inclusive
   * @param {number} yearEnd   - inclusive (set equal to yearStart for single year)
   * @returns {Promise<Array>} one row per state with totals + yoy_total/yoy_fatal/spark_5yr
   */
  async getFederalSummary(yearStart, yearEnd) {
    yearStart = parseInt(yearStart, 10);
    yearEnd   = parseInt(yearEnd, 10);
    if (!this.preferSupabase || !this.supabaseKey) return [];
    const params = new URLSearchParams({
      // Note: federal_summary has total_k (K-severity crash count) but NOT total_killed.
      // total_k is used as the killed/fatal metric for federal-tier display.
      select: 'state,crash_year,total_crashes,total_k,total_a,total_b,total_c,total_injured,total_ped_k,total_ped_inj,ped_crashes,bike_crashes,alcohol_crashes,distracted_crashes,speed_crashes,wz_crashes',
      crash_year: `gte.${yearStart - 4}`,  // pull 4 prior years for sparkline + YoY
      order: 'state,crash_year'
    });
    const url = `${this.supabaseUrl}/federal_summary?${params}`;
    try {
      const resp = await fetch(url, { headers: { apikey: this.supabaseKey, Authorization: 'Bearer ' + this.supabaseKey } });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const raw = await resp.json();
      // Roll up to one row per (state, year) — federal_summary is partitioned
      // by area_type/functional_class/ownership/severity so a single state-year
      // emits many rows.
      const byState = {};
      raw.forEach(r => {
        const yr = Number(r.crash_year);
        const s = r.state;
        if (!byState[s]) byState[s] = { state:s, _byYear:{} };
        if (!byState[s]._byYear[yr]) byState[s]._byYear[yr] = { total:0, k:0, a:0, b:0, c:0, ksi:0, epdo:0, killed:0, injured:0, ped:0, bike:0, alc:0, dist:0, spd:0, wz:0 };
        const b = byState[s]._byYear[yr];
        const k = Number(r.total_k||0), a = Number(r.total_a||0), bsev = Number(r.total_b||0), cs = Number(r.total_c||0);
        const tot = Number(r.total_crashes||0);
        b.total += tot;
        b.k += k; b.a += a; b.b += bsev; b.c += cs;
        b.ksi += k + a;
        b.killed  += Number(r.total_k||0);   // total_killed not in federal_summary; total_k (fatal crash count) is the proxy
        b.injured += Number(r.total_injured||0);
        b.ped     += Number(r.ped_crashes||0);
        b.bike    += Number(r.bike_crashes||0);
        b.alc     += Number(r.alcohol_crashes||0);
        b.dist    += Number(r.distracted_crashes||0);
        b.spd     += Number(r.speed_crashes||0);
        b.wz      += Number(r.wz_crashes||0);
        // EPDO using FHWA 2025 weights (federal default).
        const oCount = Math.max(0, tot - k - a - bsev - cs);
        b.epdo += k*883 + a*94 + bsev*21 + cs*11 + oCount;
      });
      const out = [];
      Object.values(byState).forEach(s => {
        const inRange = [];
        for (let y = yearStart; y <= yearEnd; y++) if (s._byYear[y]) inRange.push(s._byYear[y]);
        if (!inRange.length) return;
        const sum = (k) => inRange.reduce((acc, x) => acc + (x[k] || 0), 0);
        const total_crashes = sum('total'), fatal_crashes = sum('k'), ksi_crashes = sum('ksi');
        const prevYr = s._byYear[yearStart - 1];
        const yoyTotal = prevYr && prevYr.total ? ((total_crashes - prevYr.total) / Math.max(prevYr.total, 1) * 100) : null;
        const yoyFatal = prevYr ? ((fatal_crashes - prevYr.k) / Math.max(prevYr.k, 1) * 100) : null;
        const spark = [];
        for (let y = yearStart - 4; y <= yearStart; y++) spark.push(s._byYear[y] ? s._byYear[y].total : 0);
        out.push({
          state: s.state,
          total_crashes, fatal_crashes, ksi_crashes,
          total_epdo: sum('epdo'),
          total_killed: sum('killed'), total_injured: sum('injured'),
          ped_crashes: sum('ped'), bike_crashes: sum('bike'),
          impaired_crashes: sum('alc'), speed_crashes: sum('spd'),
          distracted_crashes: sum('dist'), workzone_crashes: sum('wz'),
          ksi_rate: 0,                         // renderer computes per-100K using state population
          yoy_total: yoyTotal, yoy_fatal: yoyFatal,
          spark_5yr: spark
        });
      });
      this._source = 'supabase';
      return out;
    } catch (e) {
      console.warn('[DataClient] getFederalSummary failed:', e.message);
      return [];
    }
  }

  /**
   * Get available states from states table.
   * @returns {Promise<Array>} [{abbr, name, display_name, total_crashes, ...}]
   */
  async getStates() {
    if (this.preferSupabase && this.supabaseKey) {
      try {
        const data = await this._supabaseQuery('states', {
          select: 'abbr,name,display_name,total_crashes,year_range,pipeline_status',
          filters: { pipeline_status: 'eq.active' },
        });
        this._source = 'supabase';
        return data;
      } catch (e) {
        console.warn('[DataClient] States query failed:', e.message);
      }
    }
    return [];
  }

  // ─────────────────────────────────────────────────────────
  //  TAB-AWARE SUPABASE METHODS (added 2026-04-25)
  //
  //  Each detail tab that previously required the full R2 parquet now has
  //  a dedicated client method here. Methods try the corresponding Supabase
  //  matview/RPC first and return null on failure — callers MUST treat null
  //  as "fall back to R2 sampleRows". This lets the frontend ship before
  //  the backend matviews are deployed (see docs/SUPABASE_BACKEND_COWORK_PROMPT.md).
  //
  //  Backend artefacts expected (see Cowork prompt for full SQL):
  //    mv_hotspots         — top intersections + segments per tier
  //    mv_crash_tree       — hierarchical severity → factor → location counts
  //    mv_grants_baseline  — per-location totals + EPDO + K/A counts
  //    mv_safety_categories — per-category counts (curves, ped, speed, ...)
  //    mv_analysis_summary — yearly/monthly/severity/collision-type breakdown
  // ─────────────────────────────────────────────────────────

  /**
   * Top crash locations (intersections + segments) for the Hot Spots tab.
   * @param {string} tier
   * @param {string} value
   * @param {object} opts - { roadType, limit (default 100) }
   * @returns {Promise<{intersections: Array, segments: Array}|null>}
   */
  async getHotspots(tier, value, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const keyFilters = (Array.isArray(opts.roadTypes) && opts.roadTypes.length > 1)
      ? { ...opts, roadTypes: opts.roadTypes.slice().sort() }
      : opts;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getHotspots', state: this.state, tier, value, opts: keyFilters
    });
    return this._swr(swrKey, async () => {
      try {
        const tierFilters = this._tierFilter(tier, value, 'mv_hotspots');
        const allFilters = { ...tierFilters };
        this._applyRoadTypeMatviewFilters(allFilters, opts);
        const limit = opts.limit || 100;
        // When no roadType filter is applied, the same location may appear up to
        // 4 times (one per road_type bucket), so over-fetch and merge below.
        // With a roadType filter we still over-fetch a bit to cover the
        // intersections + segments split.
        const fetchLimit = (opts.roadType || opts.roadTypes) ? limit * 2 : limit * 8;
        const data = await this._supabaseQuery('mv_hotspots', {
          filters: allFilters,
          order: 'epdo.desc',
          limit: fetchLimit,
          signal: opts && opts.signal,   // Round 21 §1.2 — prewarm cancel
        });
        this._source = 'supabase';
        this._warnIfZeroRows('mv_hotspots', data, tier, value, opts);

        // When no roadType filter is applied, rows for the same physical location
        // arrive once per road_type bucket. Merge them so totals/EPDO aren't split.
        let rows;
        if (opts.roadType || opts.roadTypes) {
          rows = data || [];
        } else {
          const merged = new Map();
          (data || []).forEach(r => {
            const key = `${r.location_type}|${r.location_name}|${r.rte_name}`;
            if (!merged.has(key)) {
              merged.set(key, { ...r, total_crashes: 0, k: 0, a: 0, b: 0, c: 0, o: 0, epdo: 0, ped_count: 0, bike_count: 0 });
            }
            const m = merged.get(key);
            m.total_crashes += (r.total_crashes || 0);
            m.k += (r.k || 0);
            m.a += (r.a || 0);
            m.b += (r.b || 0);
            m.c += (r.c || 0);
            m.o += (r.o || 0);
            m.epdo += (r.epdo || 0);
            m.ped_count += (r.ped_count || 0);
            m.bike_count += (r.bike_count || 0);
          });
          rows = [...merged.values()].sort((a, b) => (b.epdo || 0) - (a.epdo || 0));
        }

        // Bug 13a fix — drop "fake" hotspots where location_name is "0" (or
        // empty / NaN). These are the matview's catch-all bucket for crashes
        // that lack a specific node OR route — they aggregate per (county,
        // road_type) and produce inflated EPDO scores that pile to the top
        // of the ranking but aren't actionable locations. Detail PDFs on
        // these rows fail because sampleRows can't match the placeholder.
        // Jurisdiction-agnostic: keys on the "0" sentinel value, not on
        // any state/county name.
        rows = rows.filter(r => {
            const ln = String(r.location_name || '').trim();
            if (!ln || ln === '0' || ln === '0.0') {
                return r.rte_name && String(r.rte_name).trim();
            }
            return true;
        });

        // Group by location_type into the shape the Hot Spots tab expects,
        // applying the requested limit per group.
        const intersections = [], segments = [];
        rows.forEach(r => {
          const row = this._pgToFrontend(r);
          if (r.location_type === 'intersection' && intersections.length < limit) intersections.push(row);
          else if (r.location_type === 'segment' && segments.length < limit) segments.push(row);
        });
        return { intersections, segments };
      } catch (e) {
        console.warn('[DataClient] getHotspots failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  /**
   * Hierarchical crash counts for the Crash Tree tab.
   * Returns counts grouped by severity → contributing factor → location.
   * @param {string} tier
   * @param {string} value
   * @param {object} opts - { treeType: 'facility'|'crashType'|'contributing' }
   * @returns {Promise<Array|null>} Each row: { level1, level2, level3, count, K, A, B, C, O }
   */
  async getCrashTree(tier, value, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getCrashTree', state: this.state, tier, value, opts
    });
    return this._swr(swrKey, async () => {
      try {
        const tierFilters = this._tierFilter(tier, value);
        const allFilters = { ...tierFilters };
        if (opts.treeType) {
          // mv_crash_tree stores 'contributing' (singular, no Factors suffix);
          // frontend has historically passed 'contributingFactors'. Translate to
          // keep all R2 / CSV / agg-worker code paths unchanged.
          const matviewValue = opts.treeType === 'contributingFactors' ? 'contributing' : opts.treeType;
          allFilters.tree_type = `eq.${matviewValue}`;
        }
        const data = await this._supabaseQuery('mv_crash_tree', {
          filters: allFilters,
          limit: 50000,
          signal: opts && opts.signal,   // Round 21 §1.2 — prewarm cancel
        });
        this._source = 'supabase';
        return (data || []).map(r => {
          const out = this._pgToFrontend(r);
          // mv_crash_tree column is `total`; frontend callers read `count`
          // (the R2/local-aggregation convention). Alias it here.
          out.count = parseInt(r.total != null ? r.total : r.count, 10) || 0;
          return out;
        });
      } catch (e) {
        console.warn('[DataClient] getCrashTree failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  /**
   * Per-location baseline totals for the Grants tab (HSIP scoring).
   * @param {string} tier
   * @param {string} value
   * @param {object} opts - { roadType, yearFrom, yearTo }
   * @returns {Promise<Array|null>} Each row: { location_name, location_type,
   *           total_crashes, K, A, B, C, O, epdo, ped, bike }
   */
  async getGrantsBaseline(tier, value, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const keyFilters = (Array.isArray(opts.roadTypes) && opts.roadTypes.length > 1)
      ? { ...opts, roadTypes: opts.roadTypes.slice().sort() }
      : opts;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getGrantsBaseline', state: this.state, tier, value, opts: keyFilters
    });
    return this._swr(swrKey, async () => {
      try {
        const tierFilters = this._tierFilter(tier, value, 'mv_grants_baseline');
        const allFilters = { ...tierFilters };
        this._applyRoadTypeMatviewFilters(allFilters, opts);
        if (opts.yearFrom && opts.yearTo) {
          allFilters.and = `(crash_year.gte.${opts.yearFrom},crash_year.lte.${opts.yearTo})`;
        }
        const data = await this._supabaseQuery('mv_grants_baseline', {
          filters: allFilters,
          order: 'epdo.desc',
          // When merging across road_type buckets we may pull up to ~4x the rows.
          limit: (opts.roadType || opts.roadTypes) ? 5000 : 20000,
        });
        this._source = 'supabase';
        this._warnIfZeroRows('mv_grants_baseline', data, tier, value, opts);

        // When no roadType filter, the same (location, year) appears once per
        // road_type bucket. Merge them so EPDO ranking isn't split.
        if (!opts.roadType && !opts.roadTypes) {
          const merged = new Map();
          (data || []).forEach(r => {
            const key = `${r.location_type}|${r.location_name}|${r.rte_name}|${r.crash_year}`;
            if (!merged.has(key)) {
              merged.set(key, { ...r, total_crashes: 0, k: 0, a: 0, b: 0, c: 0, o: 0, epdo: 0, ped: 0, bike: 0 });
            }
            const m = merged.get(key);
            m.total_crashes += (r.total_crashes || 0);
            m.k += (r.k || 0);
            m.a += (r.a || 0);
            m.b += (r.b || 0);
            m.c += (r.c || 0);
            m.o += (r.o || 0);
            m.epdo += (r.epdo || 0);
            m.ped += (r.ped || 0);
            m.bike += (r.bike || 0);
          });
          const sorted = [...merged.values()]
            .sort((a, b) => (b.epdo || 0) - (a.epdo || 0))
            .slice(0, 5000);
          return sorted.map(r => this._pgToFrontend(r));
        }

        return (data || []).map(r => this._pgToFrontend(r));
      } catch (e) {
        console.warn('[DataClient] getGrantsBaseline failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  /**
   * Per-category counts for the Safety Focus tab (curves, work zones, ped, etc.).
   * @param {string} tier
   * @param {string} value
   * @param {object} opts - { yearFrom, yearTo }
   * @returns {Promise<object|null>} { categoryName: { total, K, A, B, C, O, crashes: [] }, ... }
   *           Note: crashes[] is empty when served by Supabase (counts only);
   *           tab must request individual crashes via getCrashes() on demand.
   */
  async getSafetyCategories(tier, value, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getSafetyCategories', state: this.state, tier, value, opts
    });
    return this._swr(swrKey, async () => {
      try {
        const tierFilters = this._tierFilter(tier, value);
        const allFilters = { ...tierFilters };
        // NOTE: mv_safety_categories has no crash_year column — it aggregates all
        // years by design. Year filtering is not supported for this matview.
        const data = await this._supabaseQuery('mv_safety_categories', {
          filters: allFilters,
          limit: 2000,
          signal: opts && opts.signal,   // Round 21 §1.2 — prewarm cancel
        });
        this._source = 'supabase';
        // Rows are grouped by (state, county, district, mpo, planning_district,
        // category). At any aggregate tier (state/region/MPO/PD) the same
        // category appears once per county — accumulate instead of overwrite.
        const out = {};
        (data || []).forEach(r => {
          if (!out[r.category]) {
            out[r.category] = {
              total: 0, K: 0, A: 0, B: 0, C: 0, O: 0,
              crashes: [],  // Lazily fetched if tab needs row detail
            };
          }
          const cat = out[r.category];
          cat.total += (r.total || 0);
          cat.K += (r.k || 0);
          cat.A += (r.a || 0);
          cat.B += (r.b || 0);
          cat.C += (r.c || 0);
          cat.O += (r.o || 0);
        });
        return out;
      } catch (e) {
        console.warn('[DataClient] getSafetyCategories failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  /**
   * CC 213 — Co-factor crosstab per category from mv_safety_co_factors.
   * Returns { [category]: { total, speed_count, senior_count, young_count,
   *   nighttime_count, impaired_count, distracted_count, fatal_count,
   *   ksi_count } } aggregated across the rows in scope. Powers the safety
   * focus sub-KPI cards (SF3) and the crash-tree Risk Factors matview-mode
   * fallback (CT2).
   */
  async getSafetyCoFactors(tier, value, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return {};
    if (this._traceFn) {
      this._traceFn({ op: 'getSafetyCoFactors', state: this.state, tier, value, opts });
    }
    try {
      const tierFilters = this._tierFilter(tier, value);
      const data = await this._supabaseQuery('mv_safety_co_factors', {
        filters: tierFilters,
        limit: 2000,
        signal: opts && opts.signal,
      });
      this._source = 'supabase';
      // At aggregate tiers (state/region/PD/MPO) the same category appears
      // once per (county × district × ...) row — accumulate.
      const byCategory = {};
      (data || []).forEach(r => {
        if (!r || !r.category) return;
        if (!byCategory[r.category]) {
          byCategory[r.category] = {
            total: 0, speed_count: 0, senior_count: 0, young_count: 0,
            nighttime_count: 0, impaired_count: 0, distracted_count: 0,
            fatal_count: 0, ksi_count: 0,
          };
        }
        const c = byCategory[r.category];
        c.total            += r.total            || 0;
        c.speed_count      += r.speed_count      || 0;
        c.senior_count     += r.senior_count     || 0;
        c.young_count      += r.young_count      || 0;
        c.nighttime_count  += r.nighttime_count  || 0;
        c.impaired_count   += r.impaired_count   || 0;
        c.distracted_count += r.distracted_count || 0;
        c.fatal_count      += r.fatal_count      || 0;
        c.ksi_count        += r.ksi_count        || 0;
      });
      return byCategory;
    } catch (e) {
      console.warn('[DataClient] getSafetyCoFactors failed (matview missing?):', e.message);
      return {};
    }
  }

  /**
   * CC 213 — Per-year totals for a single category from
   * mv_safety_categories_yearly. Returns
   * [{ crash_year, crash_count, k, a, epdo }, ...] sorted ascending.
   * Powers the Yearly Trend chart at aggregate tiers (SF4).
   *
   * Region tier (dot_district) is not supported — the matview has no
   * dot_district column. Returns [] when tier === 'region'.
   */
  async getSafetyCategoryYearly(tier, value, category, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return [];
    if (!category) return [];
    if (tier === 'region') return [];  // matview has no dot_district column
    if (this._traceFn) {
      this._traceFn({ op: 'getSafetyCategoryYearly', state: this.state, tier, value, category });
    }
    try {
      const tierFilters = this._tierFilter(tier, value, 'mv_safety_categories_yearly');
      const data = await this._supabaseQuery('mv_safety_categories_yearly', {
        filters: { ...tierFilters, category: `eq.${category}` },
        limit: 2000,
        signal: opts && opts.signal,
      });
      this._source = 'supabase';
      // Aggregate across rows that share a crash_year (same year may
      // appear once per county at aggregate tiers).
      const byYear = {};
      (data || []).forEach(r => {
        const y = Number(r && r.crash_year);
        if (!Number.isFinite(y)) return;
        if (!byYear[y]) byYear[y] = { crash_year: y, crash_count: 0, k: 0, a: 0, epdo: 0 };
        byYear[y].crash_count += Number(r.crash_count) || 0;
        byYear[y].k           += Number(r.k)           || 0;
        byYear[y].a           += Number(r.a)           || 0;
        byYear[y].epdo        += Number(r.epdo)        || 0;
      });
      return Object.values(byYear).sort((a, b) => a.crash_year - b.crash_year);
    } catch (e) {
      console.warn('[DataClient] getSafetyCategoryYearly failed (matview missing?):', e.message);
      return [];
    }
  }

  /**
   * Yearly / monthly / severity / collision-type breakdowns for the Analysis tab.
   * @param {string} tier
   * @param {string} value
   * @param {object} opts - { yearFrom, yearTo }
   * @returns {Promise<object|null>} {
   *           byYear: { 2020: {total,K,A,B,C,O}, ... },
   *           byMonth: { 1: {total,K,A,...}, ... },
   *           bySeverity: { K, A, B, C, O },
   *           byCollision: { 'Rear End': N, 'Angle': N, ... },
   *           byHour: { 0: N, 1: N, ... }
   *         }
   */
  async getAnalysisBreakdown(tier, value, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getAnalysisBreakdown', state: this.state, tier, value, opts
    });
    return this._swr(swrKey, async () => {
      try {
        const tierFilters = this._tierFilter(tier, value);
        const allFilters = { ...tierFilters };
        // NOTE: mv_analysis_summary has no crash_year column — 'year' is already
        // a breakdown axis (rows with dimension='year'), not a filter.
        const data = await this._supabaseQuery('mv_analysis_summary', {
          filters: allFilters,
          limit: 10000,
          signal: opts && opts.signal,   // Round 21 §1.2 — prewarm cancel
        });
        this._source = 'supabase';
        // Rows are grouped by (state, county, district, mpo, planning_district,
        // dimension, dim_value). At any aggregate tier each (dimension, dim_value)
        // appears once per county — accumulate instead of overwrite.
        const out = { byYear: {}, byMonth: {}, bySeverity: {K:0,A:0,B:0,C:0,O:0}, byCollision: {}, byCollisionDetail: {}, byHour: {}, byFuncClass: {}, byWeather: {}, byLight: {}, byDow: {}, byRoadSurface: {}, byTrafficControl: {}, byFirstEvent: {} };
        // Round 12: union mv_analysis_extra (dow/roadsurface/trafficcontrol/
        // firstevent) into the same response so existing placeholders (e.g.
        // Dashboard chartDOW) light up without callers having to coordinate
        // two fetches. mv_analysis_extra shares the same row schema as
        // mv_analysis_summary, so we merge on the same dim_value bucket.
        let extraData = [];
        try {
          extraData = await this._supabaseQuery('mv_analysis_extra', {
            filters: allFilters,
            limit: 10000,
            signal: opts && opts.signal,   // Round 21 §1.2 — prewarm cancel
          });
        } catch (extraErr) {
          // mv_analysis_extra may not exist on every state's instance.
          // Surface as a soft warning and continue with the base matview.
          console.warn('[DataClient] mv_analysis_extra unavailable:', extraErr && extraErr.message);
        }
        const allRows = [...(data || []), ...(extraData || [])];
        allRows.forEach(r => {
          const k = r.k || 0, a = r.a || 0, b = r.b || 0, c = r.c || 0, o = r.o || 0, total = r.total || 0;
          if (r.dimension === 'year') {
            if (!out.byYear[r.dim_value]) out.byYear[r.dim_value] = {K:0,A:0,B:0,C:0,O:0,total:0};
            const y = out.byYear[r.dim_value];
            y.K += k; y.A += a; y.B += b; y.C += c; y.O += o; y.total += total;
          } else if (r.dimension === 'month') {
            if (!out.byMonth[r.dim_value]) out.byMonth[r.dim_value] = {K:0,A:0,B:0,C:0,O:0,total:0};
            const m = out.byMonth[r.dim_value];
            m.K += k; m.A += a; m.B += b; m.C += c; m.O += o; m.total += total;
          } else if (r.dimension === 'severity') {
            if (out.bySeverity[r.dim_value] !== undefined) out.bySeverity[r.dim_value] += total;
          } else if (r.dimension === 'collision') {
            // Round 3 follow-up (2026-05-09): also expose per-severity collision
            // counts so F&S can pull K-only buckets for chartFSFatalCollision.
            // The plain `byCollision[name] = total` is preserved for backwards
            // compat with existing Crash Analysis chart consumers.
            out.byCollision[r.dim_value] = (out.byCollision[r.dim_value] || 0) + total;
            if (!out.byCollisionDetail[r.dim_value]) out.byCollisionDetail[r.dim_value] = {total:0,K:0,A:0,B:0,C:0,O:0};
            const cd = out.byCollisionDetail[r.dim_value];
            cd.total += total; cd.K += k; cd.A += a; cd.B += b; cd.C += c; cd.O += o;
          } else if (r.dimension === 'hour') {
            out.byHour[r.dim_value] = (out.byHour[r.dim_value] || 0) + total;
          } else if (r.dimension === 'funcclass') {
            // Round 3 follow-up (2026-05-09): mv_analysis_summary now exposes
            // funcclass / weather / light dimensions (8 total). Surface them
            // as per-severity buckets following the same shape as byYear.
            if (!out.byFuncClass[r.dim_value]) out.byFuncClass[r.dim_value] = {K:0,A:0,B:0,C:0,O:0,total:0};
            const f = out.byFuncClass[r.dim_value];
            f.K += k; f.A += a; f.B += b; f.C += c; f.O += o; f.total += total;
          } else if (r.dimension === 'weather') {
            if (!out.byWeather[r.dim_value]) out.byWeather[r.dim_value] = {K:0,A:0,B:0,C:0,O:0,total:0};
            const w = out.byWeather[r.dim_value];
            w.K += k; w.A += a; w.B += b; w.C += c; w.O += o; w.total += total;
          } else if (r.dimension === 'light') {
            if (!out.byLight[r.dim_value]) out.byLight[r.dim_value] = {K:0,A:0,B:0,C:0,O:0,total:0};
            const l = out.byLight[r.dim_value];
            l.K += k; l.A += a; l.B += b; l.C += c; l.O += o; l.total += total;
          } else if (r.dimension === 'dow') {
            // Round 12: dow comes from mv_analysis_extra. dim_value is 0-6
            // (Sun..Sat per Postgres EXTRACT(DOW FROM date)).
            if (!out.byDow[r.dim_value]) out.byDow[r.dim_value] = {K:0,A:0,B:0,C:0,O:0,total:0};
            const d = out.byDow[r.dim_value];
            d.K += k; d.A += a; d.B += b; d.C += c; d.O += o; d.total += total;
          } else if (r.dimension === 'roadsurface') {
            if (!out.byRoadSurface[r.dim_value]) out.byRoadSurface[r.dim_value] = {K:0,A:0,B:0,C:0,O:0,total:0};
            const rs = out.byRoadSurface[r.dim_value];
            rs.K += k; rs.A += a; rs.B += b; rs.C += c; rs.O += o; rs.total += total;
          } else if (r.dimension === 'trafficcontrol') {
            if (!out.byTrafficControl[r.dim_value]) out.byTrafficControl[r.dim_value] = {K:0,A:0,B:0,C:0,O:0,total:0};
            const tc = out.byTrafficControl[r.dim_value];
            tc.K += k; tc.A += a; tc.B += b; tc.C += c; tc.O += o; tc.total += total;
          } else if (r.dimension === 'firstevent') {
            if (!out.byFirstEvent[r.dim_value]) out.byFirstEvent[r.dim_value] = {K:0,A:0,B:0,C:0,O:0,total:0};
            const fe = out.byFirstEvent[r.dim_value];
            fe.K += k; fe.A += a; fe.B += b; fe.C += c; fe.O += o; fe.total += total;
          }
        });
        return out;
      } catch (e) {
        console.warn('[DataClient] getAnalysisBreakdown failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  /**
   * Per-tier intersection breakdowns for the Intersections tab.
   * Source: mv_intersection_summary (deployed 2026-05-05).
   *
   * Each row is one (state, county, region, mpo, PD, road_type, is_interstate,
   * intersection_type, traffic_control_type, crash_year) bucket. Filter and
   * pivot client-side for chart rendering.
   *
   * @param {string} tier
   * @param {string} value
   * @param {object} opts - { roadType, roadTypes, noInterstate, yearFrom, yearTo }
   * @returns {Promise<Array|null>} rows: { intersection_type, traffic_control_type,
   *           crash_year, total, k, a, b, c, o, ka, epdo }
   */
  async getIntersectionSummary(tier, value, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getIntersectionSummary', state: this.state, tier, value, opts
    });
    return this._swr(swrKey, async () => {
      try {
        const tierFilters = this._tierFilter(tier, value);
        const allFilters = { ...tierFilters };
        this._applyRoadTypeMatviewFilters(allFilters, opts);
        if (opts.yearFrom && opts.yearTo) {
          allFilters.and = `(crash_year.gte.${opts.yearFrom},crash_year.lte.${opts.yearTo})`;
        }
        // Round 3 follow-up (2026-05-09): include collision_type column added
        // to mv_intersection_summary so chartIntCollision can render real data
        // instead of a placeholder.
        const data = await this._supabaseQuery('mv_intersection_summary', {
          select: 'intersection_type,traffic_control_type,collision_type,crash_year,total,k,a,b,c,o,ka,epdo',
          filters: allFilters,
          limit: 50000,
          signal: opts && opts.signal,   // Round 21 §1.2 — prewarm cancel
        });
        this._source = 'supabase';
        this._warnIfZeroRows('mv_intersection_summary', data, tier, value, opts);
        return (data || []);
      } catch (e) {
        console.warn('[DataClient] getIntersectionSummary failed:', e.message);
        return null;
      }
    });
  }

  /**
   * Round 3 follow-up (2026-05-09): top collision-type per Hot Spots location.
   * Source: mv_hotspots_topcoll (deployed 2026-05-08).
   *
   * Returned shape: Map<key, top_collision_type> where
   *   key = `${location_type}|${location_name}` so Hot Spots renders can do
   *   `topcoll.get(key) ?? 'N/A'` against each row from getHotspots().
   *
   * @param {string} stateKey - state slug (e.g. 'delaware')
   * @returns {Promise<Map<string,string>|null>}
   */
  async getHotspotsTopCollision(stateKey, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getHotspotsTopCollision', state: stateKey || this.state
    });
    return this._swr(swrKey, async () => {
      try {
        const filters = {};
        const st = stateKey || this.state;
        if (st) filters.state = `eq.${st}`;
        const data = await this._supabaseQuery('mv_hotspots_topcoll', {
          select: 'location_type,location_name,top_collision_type',
          filters: filters,
          limit: 50000,
          signal: opts && opts.signal,   // Round 21 §1.2 — prewarm cancel
        });
        this._source = 'supabase';
        const map = new Map();
        (data || []).forEach(r => {
          const lt = r.location_type || '';
          const ln = r.location_name || '';
          const tc = r.top_collision_type || '';
          if (ln && tc) map.set(lt + '|' + ln, tc);
        });
        return map;
      } catch (e) {
        console.warn('[DataClient] getHotspotsTopCollision failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  /**
   * Round 3 follow-up (2026-05-09): per-location factor counts for Hot Spots.
   * Source: mv_hotspots_factors (deployed 2026-05-08).
   *
   * Returned shape: Map<key, {impaired,speed,distracted,unrestrained,motorcycle,night}>
   * where key matches getHotspotsTopCollision().
   *
   * @param {string} stateKey
   * @returns {Promise<Map<string,object>|null>}
   */
  async getHotspotsFactors(stateKey, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getHotspotsFactors', state: stateKey || this.state
    });
    return this._swr(swrKey, async () => {
      try {
        const filters = {};
        const st = stateKey || this.state;
        if (st) filters.state = `eq.${st}`;
        const data = await this._supabaseQuery('mv_hotspots_factors', {
          select: 'location_type,location_name,impaired_count,speed_count,distracted_count,unrestrained_count,motorcycle_count,night_count',
          filters: filters,
          limit: 50000,
          signal: opts && opts.signal,   // Round 21 §1.2 — prewarm cancel
        });
        this._source = 'supabase';
        const map = new Map();
        (data || []).forEach(r => {
          const lt = r.location_type || '';
          const ln = r.location_name || '';
          if (!ln) return;
          map.set(lt + '|' + ln, {
            impaired: r.impaired_count || 0,
            speed: r.speed_count || 0,
            distracted: r.distracted_count || 0,
            unrestrained: r.unrestrained_count || 0,
            motorcycle: r.motorcycle_count || 0,
            night: r.night_count || 0,
          });
        });
        return map;
      } catch (e) {
        console.warn('[DataClient] getHotspotsFactors failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  /**
   * Round 3 follow-up (2026-05-09): per-mode (pedestrian|bicycle) breakdowns
   * for the Ped/Bike tab's 7 per-mode charts.
   * Source: mv_pedbike_breakdowns (deployed 2026-05-08).
   *
   * Each row: (state, physical_juris_name, dot_district, mpo_name,
   *   planning_district, road_type, is_interstate, mode, dimension, dim_value,
   *   total, k, a, o)
   * Mode ∈ {pedestrian, bicycle}; Dimension ∈ {year, light, location}.
   *
   * @param {string} tier
   * @param {string} value
   * @returns {Promise<{pedestrian:object,bicycle:object}|null>} where each
   *   side is { byYear: {...}, byLight: {...}, byLocation: {...} } and each
   *   inner bucket is { K, A, O, total }.
   */
  async getPedBikeBreakdowns(tier, value, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getPedBikeBreakdowns', state: this.state, tier, value, opts
    });
    return this._swr(swrKey, async () => {
      try {
        const tierFilters = this._tierFilter(tier, value);
        const allFilters = { ...tierFilters };
        this._applyRoadTypeMatviewFilters(allFilters, opts);
        const data = await this._supabaseQuery('mv_pedbike_breakdowns', {
          filters: allFilters,
          limit: 50000,
          signal: opts && opts.signal,   // Round 21 §1.2 — prewarm cancel
        });
        this._source = 'supabase';
        const out = {
          pedestrian: { byYear: {}, byLight: {}, byLocation: {} },
          bicycle:    { byYear: {}, byLight: {}, byLocation: {} },
        };
        (data || []).forEach(r => {
          const mode = r.mode;
          if (mode !== 'pedestrian' && mode !== 'bicycle') return;
          const dim = r.dimension;
          let bucket;
          if (dim === 'year')          bucket = out[mode].byYear;
          else if (dim === 'light')    bucket = out[mode].byLight;
          else if (dim === 'location') bucket = out[mode].byLocation;
          else return;
          const dv = r.dim_value;
          if (dv === null || dv === undefined || dv === '') return;
          if (!bucket[dv]) bucket[dv] = { K:0, A:0, O:0, total:0 };
          const b = bucket[dv];
          b.K += r.k || 0; b.A += r.a || 0; b.O += r.o || 0; b.total += r.total || 0;
        });
        return out;
      } catch (e) {
        console.warn('[DataClient] getPedBikeBreakdowns failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  // ─────────────────────────────────────────────────────────
  //  CC 312 PHASE 2 — mv_dashboard_tier_kpi accessor
  // ─────────────────────────────────────────────────────────

  /**
   * Tier-rolled dashboard KPIs from mv_dashboard_tier_kpi.
   * Replaces client-side rollup of 58K-row dashboard_summary.
   *
   * The matview stores rows tagged with DATA-DIMENSION tier names
   * (state, dot_district, mpo, planning_district, jurisdiction) plus a
   * `federal` UNION for cross-state rollup. Frontend tier names like
   * `region`, `county`, `city` are translated here (mirroring the established
   * pattern at app/modules/map/map-points-hydrate.js:115) so callers can
   * use whatever resolveTier() returns without knowing the matview schema.
   *
   * State-agnostic — keys on (state, tier, jurisdiction_id, year). The
   * region→dot_district mapping is per-state metadata from hierarchy.json,
   * NOT a hardcoded if-else.
   *
   * @param {string} tier  frontend tier — any value resolveTier() can return:
   *                       state, federal, region, dot_district, mpo,
   *                       planning_district, county, city, jurisdiction
   * @param {string|null} jurisdictionId  the tier-specific id (e.g.
   *                       'North District' for dot_district, 'kent county'
   *                       for jurisdiction). Pass null for whole-state at
   *                       tier='state', or null for federal.
   * @param {number|null} year  filter to single year, or null for all years
   * @param {object} opts  { signal: AbortSignal? }
   */
  async getDashboardTierKpi(tier, jurisdictionId, year, opts = {}) {
    // ── Frontend-tier → matview-tier translation (state-agnostic) ──
    let mvTier = tier;
    let mvJurisdictionId = jurisdictionId;
    let mvState = this.state;   // by default scope to active state

    if (tier === 'federal') {
      // Federal rows have state=NULL in the matview
      mvTier = 'federal';
      mvJurisdictionId = null;        // ignore any passed id
      mvState = null;                  // sentinel — query `state=is.null`
    } else if (tier === 'city' || tier === 'jurisdiction') {
      // Both collapse to the jurisdiction dimension (physical_juris_name)
      mvTier = 'jurisdiction';
    } else if (tier === 'county') {
      // Silent rollup gotcha — for Delaware county → planning_district per
      // memory feedback_silent_county_to_pd_rollup_gotcha.md. For states with
      // genuine county-level rows in the future this can be promoted to a
      // per-state config lookup.
      mvTier = 'planning_district';
    } else if (tier === 'region') {
      // 'region' is per-state metadata. Look up the active state's hierarchy
      // to find what data column 'region' maps to. Delaware: regions equal
      // dot_district values (per CLAUDE.md `dbName` rule). Default fallback
      // is dot_district so the call still resolves to a real matview row.
      const reg = (window.CL && CL.spatial && CL.spatial.HierarchyRegistry
                   && CL.spatial.HierarchyRegistry.getRegionMatviewTier)
        ? CL.spatial.HierarchyRegistry.getRegionMatviewTier(this.state)
        : null;
      mvTier = (reg && reg.matviewTier) || 'dot_district';
      if (reg && typeof reg.translateId === 'function' && jurisdictionId) {
        mvJurisdictionId = reg.translateId(jurisdictionId);
      }
    }
    // 'state', 'dot_district', 'mpo', 'planning_district' pass through unchanged.

    // ── Build query ──
    const params = new URLSearchParams({
      tier: `eq.${mvTier}`,
      select: 'state,tier,jurisdiction_id,jurisdiction_name,crash_year,crashes,fatals,serious,injuries,ped,bike,speed,alcohol,night,epdo',
    });
    if (mvState === null) {
      params.append('state', 'is.null');          // federal tier filter
    } else {
      params.append('state', `eq.${mvState}`);
    }
    if (mvJurisdictionId) params.append('jurisdiction_id', `eq.${mvJurisdictionId}`);
    if (year != null)     params.append('crash_year', `eq.${year}`);
    const url = `${this.supabaseUrl}/mv_dashboard_tier_kpi?${params}`;

    // ── Standard timeout + external-signal fetch (mirrors getHotspots/getMapPoints) ──
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, this.timeout);
    const onExternalAbort = () => controller.abort();
    if (opts.signal) {
      if (opts.signal.aborted) {
        clearTimeout(timer);
        throw new DOMException('Aborted', 'AbortError');
      }
      opts.signal.addEventListener('abort', onExternalAbort, { once: true });
    }
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
        },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (opts.signal) opts.signal.removeEventListener('abort', onExternalAbort);
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      return await resp.json();
    } catch (e) {
      clearTimeout(timer);
      if (opts.signal) opts.signal.removeEventListener('abort', onExternalAbort);
      if (e.name === 'AbortError' && !timedOut) throw e;
      console.warn('[getDashboardTierKpi] fetch failed:', e.message || e);
      return [];        // gracefully degrade — callers can fall back to dashboard_summary
    }
  }

  // ─────────────────────────────────────────────────────────
  //  ROUND 12 — NEW MATVIEW ACCESSORS
  // ─────────────────────────────────────────────────────────

  /**
   * mv_analysis_extra — extra dimensions (dow, roadsurface, trafficcontrol,
   * firstevent) that share the same row shape as mv_analysis_summary.
   *
   * Returns the same envelope as getAnalysisBreakdown, but only the four
   * extra-dimension buckets are populated:
   *   { byDow, byRoadSurface, byTrafficControl, byFirstEvent }
   */
  async getAnalysisExtra(tier, value, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getAnalysisExtra', state: this.state, tier, value, opts
    });
    return this._swr(swrKey, async () => {
      try {
        const tierFilters = this._tierFilter(tier, value);
        const allFilters = { ...tierFilters };
        if (opts.dimension) allFilters.dimension = `eq.${opts.dimension}`;
        const data = await this._supabaseQuery('mv_analysis_extra', {
          filters: allFilters,
          limit: 10000,
          signal: opts && opts.signal,   // Round 21 §1.2 — prewarm cancel
        });
        this._source = 'supabase';
        const out = { byDow: {}, byRoadSurface: {}, byTrafficControl: {}, byFirstEvent: {} };
        (data || []).forEach(r => {
          const k = r.k || 0, a = r.a || 0, b = r.b || 0, c = r.c || 0, o = r.o || 0, total = r.total || 0;
          let bucket;
          if (r.dimension === 'dow')               bucket = out.byDow;
          else if (r.dimension === 'roadsurface')  bucket = out.byRoadSurface;
          else if (r.dimension === 'trafficcontrol') bucket = out.byTrafficControl;
          else if (r.dimension === 'firstevent')   bucket = out.byFirstEvent;
          else return;
          const dv = r.dim_value;
          if (dv === null || dv === undefined || dv === '') return;
          if (!bucket[dv]) bucket[dv] = { K:0, A:0, B:0, C:0, O:0, total:0 };
          const slot = bucket[dv];
          slot.K += k; slot.A += a; slot.B += b; slot.C += c; slot.O += o; slot.total += total;
        });
        return out;
      } catch (e) {
        console.warn('[DataClient] getAnalysisExtra failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  /**
   * mv_hotspots_detail — per-location JSONB breakdown for a single hot
   * spot / intersection. Returns the single row (or null) for the requested
   * (state, location_type, location_name) tuple. Each row exposes:
   *   by_year, by_month, by_dow, by_hour, by_collision, by_weather,
   *   by_light, by_roadsurface, by_trafficctrl, by_firstevent
   * plus per-factor counts (alcohol_count, speed_count, ...).
   */
  async getHotspotDetail(stateKey, locationType, locationName) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getHotspotDetail', state: stateKey || this.state, locationType, locationName
    });
    return this._swr(swrKey, async () => {
      try {
        const filters = {
          state: `eq.${stateKey || this.state}`,
          location_type: `eq.${locationType}`,
          location_name: `eq.${locationName}`,
        };
        const data = await this._supabaseQuery('mv_hotspots_detail', {
          filters,
          limit: 1,
        });
        this._source = 'supabase';
        return Array.isArray(data) && data.length > 0 ? data[0] : null;
      } catch (e) {
        console.warn('[DataClient] getHotspotDetail failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  /**
   * mv_pedbike_locations — top ped/bike crash locations.
   * @param {string} mode - 'pedestrian' | 'bicycle'
   */
  async getPedBikeLocations(tier, value, mode, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getPedBikeLocations', state: this.state, tier, value, mode, opts
    });
    return this._swr(swrKey, async () => {
      try {
        const tierFilters = this._tierFilter(tier, value);
        const allFilters = { ...tierFilters, mode: `eq.${mode}` };
        const data = await this._supabaseQuery('mv_pedbike_locations', {
          filters: allFilters,
          order: 'total.desc',
          limit: opts.limit || 50,
          signal: opts && opts.signal,   // Round 21 §1.2 — prewarm cancel
        });
        this._source = 'supabase';
        return data || [];
      } catch (e) {
        console.warn('[DataClient] getPedBikeLocations failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  /**
   * mv_safety_focus_locations — top crash locations per Safety Focus
   * category (curves, speed, alcohol, drug, distracted, motorcycle,
   * intersection, pedestrian, bicycle, ...).
   */
  async getSafetyFocusLocations(tier, value, category, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getSafetyFocusLocations', state: this.state, tier, value, category, opts
    });
    return this._swr(swrKey, async () => {
      try {
        const tierFilters = this._tierFilter(tier, value);
        const allFilters = { ...tierFilters, category: `eq.${category}` };
        const data = await this._supabaseQuery('mv_safety_focus_locations', {
          filters: allFilters,
          order: 'total.desc',
          limit: opts.limit || 25,
        });
        this._source = 'supabase';
        return data || [];
      } catch (e) {
        console.warn('[DataClient] getSafetyFocusLocations failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  /**
   * find_crashes_near_assets RPC — Asset Deficiency spatial join.
   * @param {string} stateKey
   * @param {Array<{id,type,lat,lng}>} assets
   * @param {object} opts - { radius_ft, start_date, end_date, ped_bike_only }
   * @returns {Promise<Array>} rows with asset_id, asset_type, lat, lng,
   *   crash_count, k_count, a_count, bc_count, o_count, epdo
   */
  async findCrashesNearAssets(stateKey, assets, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    if (!Array.isArray(assets) || assets.length === 0) return [];
    const body = {
      p_state: stateKey || this.state,
      p_assets: assets,
      p_radius_ft: opts.radius_ft || 300,
      p_start_date: opts.start_date || null,
      p_end_date: opts.end_date || null,
      p_ped_bike_only: !!opts.ped_bike_only,
    };
    const url = `${this.supabaseUrl}/rpc/find_crashes_near_assets`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      this._source = 'supabase';
      return Array.isArray(data) ? data : [];
    } catch (e) {
      clearTimeout(timer);
      console.warn('[DataClient] findCrashesNearAssets failed:', e.message);
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────
  //  ROUND 13 — Universal LocationPicker accessors
  // ─────────────────────────────────────────────────────────

  /**
   * State-agnostic location picker — drives every "Or Select Location"
   * dropdown across the app. Keys on (state, jurisdiction kind/value,
   * road_type, location_type) — no jurisdiction literals anywhere.
   *
   * road_type contract:
   *   'all_no_interstate' → translated server-side to is_interstate=false
   *   'all' / null         → no road_type filter
   *   anything else        → exact match against road_type column
   *
   * county input may include the trailing ' County' suffix; the RPC strips it.
   *
   * @param {object} opts {state, jurisdictionKind, jurisdictionValue,
   *                       roadType, locationType, minCrashes, limit}
   * @returns {Promise<Array>} rows sorted by total_crashes desc
   */
  async getLocationPicker(opts) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    opts = opts || {};
    // CC 329 — try the new mv_location_picker REST view first (created by
    // Cowork this week, indexed on state+jurisdiction+location_type). Falls
    // back transparently to the original rpc/get_location_picker on 404
    // (matview not deployed yet) or any non-2xx — no functional regression.
    const matviewResult = await this._getLocationPickerMatview(opts);
    if (matviewResult !== null) return matviewResult;
    return this._getLocationPickerRpc(opts);
  }

  /**
   * CC 329 — mv_location_picker REST source. Returns array on success, null
   * on any failure so the caller can fall back to the RPC. Tier-column map
   * mirrors the matview index layout (county/PD/MPO/region direct).
   */
  async _getLocationPickerMatview(opts) {
    const state = (opts.state || this.state || '').toLowerCase();
    if (!state) return null;
    const tierColMap = {
      region: 'region', mpo: 'mpo',
      planning_district: 'planning_district', county: 'county',
      city: 'county', city_town: 'county',
    };
    const tierCol = opts.jurisdictionKind ? tierColMap[opts.jurisdictionKind] : null;
    // county input may include the trailing ' County' suffix; matview rows
    // store the bare county name, so strip the suffix here for parity with
    // the RPC's server-side strip.
    let tierVal = opts.jurisdictionValue || null;
    if (tierCol === 'county' && tierVal && /\s+County\s*$/i.test(tierVal)) {
      tierVal = tierVal.replace(/\s+County\s*$/i, '');
    }
    const params = new URLSearchParams({
      state: 'eq.' + state,
      select: 'location_name,location_id,location_type,total_crashes,k,a,b,c,o,epdo,ped_count,bike_count,lat,lon',
      order: 'epdo.desc',
      limit: String(opts.limit || 500),
    });
    if (tierCol && tierVal) params.set(tierCol, 'eq.' + tierVal);
    if (opts.locationType)  params.set('location_type', 'eq.' + opts.locationType);
    if (opts.minCrashes)    params.set('total_crashes', 'gte.' + opts.minCrashes);
    const url = `${this.supabaseUrl}/mv_location_picker?${params}`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const resp = await fetch(url, { headers, signal: controller.signal });
      clearTimeout(timer);
      if (!resp.ok) {
        // 404 = matview not deployed in this environment yet. Quiet on first
        // miss; the RPC fallback handles it.
        if (resp.status !== 404) {
          console.warn(`[DataClient] mv_location_picker HTTP ${resp.status}, falling back to RPC`);
        }
        return null;
      }
      const data = await resp.json();
      if (!Array.isArray(data)) return null;
      this._source = 'supabase';
      return data;
    } catch (e) {
      clearTimeout(timer);
      console.warn('[DataClient] mv_location_picker failed, falling back to RPC:', e && e.message);
      return null;
    }
  }

  /** CC 329 — original RPC implementation, now used as fallback only. */
  async _getLocationPickerRpc(opts) {
    opts = opts || {};
    const body = {
      p_state:               (opts.state || this.state || '').toLowerCase(),
      p_jurisdiction_kind:   opts.jurisdictionKind || null,
      p_jurisdiction_value:  opts.jurisdictionValue || null,
      p_road_type:           opts.roadType || 'all_no_interstate',
      p_location_type:       opts.locationType || null,
      p_min_crashes:         opts.minCrashes || 1,
      p_limit:               opts.limit || 500,
    };
    const url = `${this.supabaseUrl}/rpc/get_location_picker`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      this._source = 'supabase';
      return Array.isArray(data) ? data : [];
    } catch (e) {
      clearTimeout(timer);
      console.warn('[DataClient] getLocationPicker failed:', e.message);
      return null;
    }
  }

  /**
   * Grant-Ready Locations table source. Same shape as getLocationPicker but
   * adds vru_count, score_balanced, confidence_high. State-agnostic.
   *
   * @param {object} opts {state, county, mpo, pd, roadType, locationType,
   *                       minCrashes, limit}
   */
  async getGrantReadyLocations(opts) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    opts = opts || {};
    const stateKey = (opts.state || this.state || '').toLowerCase();
    const params = new URLSearchParams({
      state: 'eq.' + stateKey,
      select: '*',
      order: 'score_balanced.desc',
      limit: String(opts.limit || 50),
    });
    const rt = opts.roadType || 'all_no_interstate';
    if (rt === 'all_no_interstate') {
      params.set('is_interstate', 'eq.false');
    } else if (rt && rt !== 'all') {
      params.set('road_type', 'eq.' + rt);
    }
    if (opts.locationType) params.set('location_type', 'eq.' + opts.locationType);
    if (opts.minCrashes) params.set('total_crashes', 'gte.' + opts.minCrashes);

    // Tier-aware filter (new). Reports + tabs that pass {tier, value} get
    // jurisdiction-scoped rows; older callers passing {county, mpo, pd}
    // still work via the explicit branches below.
    if (opts.tier && opts.value && opts.tier !== 'state' && opts.tier !== 'federal') {
      const tf = this._tierFilter(opts.tier, opts.value, 'mv_grant_ready_locations');
      // _tierFilter already injected state=eq.<this.state>; let opts.state win.
      Object.keys(tf).forEach(k => {
        if (k === 'state') return;
        params.set(k, tf[k]);
      });
    } else {
      // mv_grant_ready_locations uses Convention B columns:
      //   county / mpo / planning_district (no `jurisdiction_` prefix and no
      //   ` County` suffix in stored values).
      if (opts.county) {
        params.set('county', 'eq.' + String(opts.county).replace(/ County$/, ''));
      }
      if (opts.mpo) params.set('mpo', 'eq.' + opts.mpo);
      if (opts.pd)  params.set('planning_district',  'eq.' + opts.pd);
    }

    const url = `${this.supabaseUrl}/mv_grant_ready_locations?${params.toString()}`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const resp = await fetch(url, { headers, signal: controller.signal });
      clearTimeout(timer);
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      this._source = 'supabase';
      return Array.isArray(data) ? data : [];
    } catch (e) {
      clearTimeout(timer);
      console.warn('[DataClient] getGrantReadyLocations failed:', e.message);
      return null;
    }
  }

  /**
   * Magisterial District / CCD breakdown — guarded.
   *
   * Returns:
   *   - Array of CCD rows when mv_grants_ccd exists for this jurisdiction
   *   - null when the matview is missing (BLOCKED-UPSTREAM sentinel — frontend
   *     shows a "TIGERweb spatial join pending" banner instead of zeros)
   *   - [] when the matview exists but no rows match the filter
   *
   * @param {object} opts {state, county, roadType}
   */
  async getMagisterialDistricts(opts) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    opts = opts || {};
    const stateKey = (opts.state || this.state || '').toLowerCase();
    const params = new URLSearchParams({
      state: 'eq.' + stateKey,
      select: '*',
    });
    if (opts.county) {
      params.set('county', 'eq.' + String(opts.county).replace(/ County$/, ''));
    }
    if (opts.roadType && opts.roadType !== 'all' && opts.roadType !== 'all_no_interstate') {
      params.set('road_type', 'eq.' + opts.roadType);
    }
    const url = `${this.supabaseUrl}/mv_grants_ccd?${params.toString()}`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const resp = await fetch(url, { headers, signal: controller.signal });
      clearTimeout(timer);
      if (!resp.ok) {
        // PostgREST returns 404 with a relation-missing message in the body
        const text = await resp.text().catch(() => '');
        if (resp.status === 404 || /relation .* does not exist/i.test(text)) {
          return null;   // sentinel for BLOCKED-UPSTREAM
        }
        throw new Error(text || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      this._source = 'supabase';
      return Array.isArray(data) ? data : [];
    } catch (e) {
      clearTimeout(timer);
      if (/relation .* does not exist/i.test(String(e.message))) return null;
      console.warn('[DataClient] getMagisterialDistricts failed:', e.message);
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────
  //  ROUND 14 — Fatal/Speed factor matviews + grant programs +
  //             EB Before/After RPC + email subscribers + scheduled reports
  // ─────────────────────────────────────────────────────────

  /**
   * mv_fatal_factors — per-jurisdiction fatal-only factor breakdowns and
   * high-risk co-factor combos (speed×impaired, night×speed, …). Drives the
   * Fatal Crashes multi-factor panels and the Combined Analysis tab.
   */
  async getFatalFactors(tier, value, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getFatalFactors', state: this.state, tier, value, opts
    });
    return this._swr(swrKey, async () => {
      try {
        // Round 15 §12.1 — county-tier filter uses the new canonical
        // jurisdiction_county column (mv v2). Other tiers fall through
        // to _tierFilter (physical_juris_name / mpo_name / planning_district).
        let filters;
        if (tier === 'county' && value) {
          const canonical = String(value).endsWith(' County') ? value : value + ' County';
          filters = {};
          if (this.state) filters.state = `eq.${this.state}`;
          filters.jurisdiction_county = `eq.${canonical}`;
        } else {
          filters = this._tierFilter(tier, value);
        }
        if (opts.roadType === 'all_no_interstate') {
          filters.is_interstate = 'eq.false';
        } else if (opts.roadType && opts.roadType !== 'all') {
          filters.road_type = `eq.${opts.roadType}`;
        }
        const data = await this._supabaseQuery('mv_fatal_factors', { filters });
        this._source = 'supabase';
        return Array.isArray(data) ? data : [];
      } catch (e) {
        console.warn('[DataClient] getFatalFactors failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  /**
   * mv_speed_summary — per-jurisdiction speed-vs-non-speed breakdowns. Drives
   * the F&S Speed-Related sub-tab and the Non-Speed Severity pie.
   */
  async getSpeedSummary(tier, value, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const swrKey = CrashLensDataClient._swrKey({
      op: 'getSpeedSummary', state: this.state, tier, value, opts
    });
    return this._swr(swrKey, async () => {
      try {
        // Round 15 §12.1 — county-tier filter uses the new canonical
        // jurisdiction_county column (mv v2). See getFatalFactors above.
        let filters;
        if (tier === 'county' && value) {
          const canonical = String(value).endsWith(' County') ? value : value + ' County';
          filters = {};
          if (this.state) filters.state = `eq.${this.state}`;
          filters.jurisdiction_county = `eq.${canonical}`;
        } else {
          filters = this._tierFilter(tier, value);
        }
        if (opts.roadType === 'all_no_interstate') {
          filters.is_interstate = 'eq.false';
        } else if (opts.roadType && opts.roadType !== 'all') {
          filters.road_type = `eq.${opts.roadType}`;
        }
        const data = await this._supabaseQuery('mv_speed_summary', { filters });
        this._source = 'supabase';
        return Array.isArray(data) ? data : [];
      } catch (e) {
        console.warn('[DataClient] getSpeedSummary failed (matview missing?):', e.message);
        return null;
      }
    });
  }

  /**
   * grant_programs lookup table. Returns federal-scope programs OR the
   * caller's state-scope programs in one round-trip. State-agnostic — adding
   * new states is an INSERT to the lookup table, never a code change.
   */
  async getGrantPrograms(opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const stateKey = (opts.state || this.state || '').toLowerCase();
    const params = new URLSearchParams({
      active: 'eq.true',
      select: '*',
      order: 'scope.asc,program_name.asc',
    });
    if (opts.scope) params.set('scope', `eq.${opts.scope}`);
    // jurisdiction-aware: federal-scope OR matching this state
    if (stateKey) {
      params.append('or', `(scope.eq.federal,state.eq.${stateKey})`);
    }
    const url = `${this.supabaseUrl}/grant_programs?${params.toString()}`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const resp = await fetch(url, { headers, signal: controller.signal });
      clearTimeout(timer);
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      this._source = 'supabase';
      return Array.isArray(data) ? data : [];
    } catch (e) {
      clearTimeout(timer);
      console.warn('[DataClient] getGrantPrograms failed:', e.message);
      return null;
    }
  }

  /**
   * run_before_after_study RPC — Empirical-Bayes Before/After analysis.
   * @param {object} opts {state, locationType, locationName, installDate,
   *                       beforeMonths=36, afterMonths=36, constructionMonths=3}
   * @returns {Promise<object|null>} {observed_before, observed_after,
   *   predicted_after_no_treatment, eb_estimate, cmf_observed, pct_change, method}
   */
  async runBeforeAfterStudy(opts) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    if (!opts || !opts.locationName || !opts.installDate) return null;
    const body = {
      p_state:               (opts.state || this.state || '').toLowerCase(),
      p_location_type:       opts.locationType,
      p_location_name:       opts.locationName,
      p_install_date:        opts.installDate,
      p_before_months:       opts.beforeMonths || 36,
      p_after_months:        opts.afterMonths || 36,
      p_construction_months: opts.constructionMonths || 3,
    };
    const url = `${this.supabaseUrl}/rpc/run_before_after_study`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const resp = await fetch(url, {
        method: 'POST', headers, body: JSON.stringify(body), signal: controller.signal,
      });
      clearTimeout(timer);
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      this._source = 'supabase';
      return data;
    } catch (e) {
      clearTimeout(timer);
      console.warn('[DataClient] runBeforeAfterStudy failed:', e.message);
      return null;
    }
  }

  // Email subscribers (per-state, per-user)
  async listEmailSubscribers(state) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const stateKey = (state || this.state || '').toLowerCase();
    const params = new URLSearchParams({
      state: `eq.${stateKey}`,
      active: 'eq.true',
      select: '*',
      order: 'created_at.desc',
    });
    const url = `${this.supabaseUrl}/email_subscribers?${params.toString()}`;
    const headers = { 'apikey': this.supabaseKey, 'Authorization': `Bearer ${this.supabaseKey}` };
    try {
      const resp = await fetch(url, { headers });
      if (!resp.ok) return null;
      return await resp.json();
    } catch (e) {
      console.warn('[DataClient] listEmailSubscribers failed:', e.message);
      return null;
    }
  }

  async addEmailSubscriber(subscriber) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    if (!subscriber || !subscriber.email) return null;
    const url = `${this.supabaseUrl}/email_subscribers`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    };
    const body = JSON.stringify([{
      email: subscriber.email,
      state: (subscriber.state || this.state || '').toLowerCase(),
      label: subscriber.label || null,
      user_id: subscriber.user_id || null,
    }]);
    try {
      const resp = await fetch(url, { method: 'POST', headers, body });
      if (!resp.ok) {
        const err = await resp.text().catch(() => '');
        throw new Error(err || `HTTP ${resp.status}`);
      }
      return await resp.json();
    } catch (e) {
      console.warn('[DataClient] addEmailSubscriber failed:', e.message);
      return null;
    }
  }

  async removeEmailSubscriber(id) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    if (!id) return null;
    const url = `${this.supabaseUrl}/email_subscribers?id=eq.${encodeURIComponent(id)}`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
    };
    try {
      const resp = await fetch(url, { method: 'DELETE', headers });
      return resp.ok;
    } catch (e) {
      console.warn('[DataClient] removeEmailSubscriber failed:', e.message);
      return false;
    }
  }

  // Scheduled reports
  async listScheduledReports(state) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const stateKey = (state || this.state || '').toLowerCase();
    const params = new URLSearchParams({
      state: `eq.${stateKey}`,
      active: 'eq.true',
      select: '*',
      order: 'next_run_at.asc',
    });
    const url = `${this.supabaseUrl}/scheduled_reports?${params.toString()}`;
    const headers = { 'apikey': this.supabaseKey, 'Authorization': `Bearer ${this.supabaseKey}` };
    try {
      const resp = await fetch(url, { headers });
      if (!resp.ok) return null;
      return await resp.json();
    } catch (e) {
      console.warn('[DataClient] listScheduledReports failed:', e.message);
      return null;
    }
  }

  async createScheduledReport(cfg) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    if (!cfg) return null;
    const url = `${this.supabaseUrl}/scheduled_reports`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    };
    try {
      const resp = await fetch(url, {
        method: 'POST', headers, body: JSON.stringify([cfg]),
      });
      if (!resp.ok) {
        const err = await resp.text().catch(() => '');
        throw new Error(err || `HTTP ${resp.status}`);
      }
      return await resp.json();
    } catch (e) {
      console.warn('[DataClient] createScheduledReport failed:', e.message);
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────
  //  ROUND 15 — AADT rates / forecasts / knowledge corpus / email queue
  // ─────────────────────────────────────────────────────────

  /**
   * mv_hotspots_with_rates — Hot Spots with crash-rate-per-MVMT.
   * State-agnostic; filters by jurisdiction_county / road_type / location_type.
   * @param {object} opts {state?, roadType?, locationType?, county?, minRate?, requireAadt?, limit?}
   */
  async getHotspotsWithRates(opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const stateKey = (opts.state || this.state || '').toLowerCase();
    const params = new URLSearchParams({
      state: 'eq.' + stateKey,
      select: '*',
      order: 'crash_rate_mvmt.desc.nullslast',
      limit: String(opts.limit || 50),
    });
    const rt = opts.roadType || 'all_no_interstate';
    if (rt === 'all_no_interstate') {
      params.set('is_interstate', 'eq.false');
    } else if (rt && rt !== 'all') {
      params.set('road_type', 'eq.' + rt);
    }
    if (opts.locationType) params.set('location_type', 'eq.' + opts.locationType);

    // Tier-aware filter (new). Reports + tabs that pass {tier, value} get
    // jurisdiction-scoped rows.
    if (opts.tier && opts.value && opts.tier !== 'state' && opts.tier !== 'federal') {
      const tf = this._tierFilter(opts.tier, opts.value, 'mv_hotspots_with_rates');
      Object.keys(tf).forEach(k => {
        if (k === 'state') return;
        params.set(k, tf[k]);
      });
    } else if (opts.county) {
      // mv_hotspots_with_rates uses Convention B (`county` column, bare value,
      // no ` County` suffix). Strip suffix consistently.
      params.set('county', 'eq.' + String(opts.county).replace(/ County$/, ''));
    }
    if (opts.minRate) params.set('crash_rate_mvmt', 'gte.' + opts.minRate);
    if (opts.requireAadt) params.set('aadt', 'not.is.null');
    const url = `${this.supabaseUrl}/mv_hotspots_with_rates?${params.toString()}`;
    const headers = { 'apikey': this.supabaseKey, 'Authorization': `Bearer ${this.supabaseKey}` };
    try {
      // Round 21 §1.2 — accept an optional prewarm signal so we don't keep
      // a CO request running after the user switched to DE.
      const resp = await fetch(url, { headers, signal: opts && opts.signal });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        if (resp.status === 404 || /relation .* does not exist/i.test(text)) return null;
        throw new Error(text || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      this._source = 'supabase';
      return Array.isArray(data) ? data : [];
    } catch (e) {
      if (e && e.name === 'AbortError') return null;
      console.warn('[DataClient] getHotspotsWithRates failed:', e.message);
      return null;
    }
  }

  /**
   * search_knowledge_corpus RPC — pgvector-backed RAG retrieval.
   * @param {object} opts {embedding (number[1536]), state?, sources?, topK?, minSimilarity?}
   */
  async searchKnowledgeCorpus(opts) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    if (!opts || !Array.isArray(opts.embedding)) return null;
    const body = {
      p_query_embedding: opts.embedding,
      p_state:           (opts.state || this.state || '').toLowerCase() || null,
      p_sources:         opts.sources || null,
      p_top_k:           opts.topK || 8,
      p_min_similarity:  opts.minSimilarity != null ? opts.minSimilarity : 0.5,
    };
    const url = `${this.supabaseUrl}/rpc/search_knowledge_corpus`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
    };
    try {
      const resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        if (resp.status === 404 || /function .* does not exist/i.test(text)) return null;
        throw new Error(text || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      this._source = 'supabase';
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn('[DataClient] searchKnowledgeCorpus failed:', e.message);
      return null;
    }
  }

  /**
   * Round 19 §6 — list pending knowledge_corpus_pending chunks awaiting
   * embedding. Returns the rows with chunk_text so the caller can embed
   * client-side via OpenAI and submit back via embedPendingChunks().
   *
   * @param {object} [opts] { limit?: number, state?: string }
   * @returns {Promise<Array<{id, chunk_text}>|null>}
   */
  async listPendingCorpusChunks(opts) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    opts = opts || {};
    const params = new URLSearchParams({
      embedded_at: 'is.null',
      select: 'id,chunk_text',
      limit: String(opts.limit || 500),
    });
    if (opts.state) params.set('state', 'eq.' + String(opts.state).toLowerCase());
    const url = `${this.supabaseUrl}/knowledge_corpus_pending?${params.toString()}`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
    };
    try {
      const resp = await fetch(url, { headers });
      if (!resp.ok) return null;
      const rows = await resp.json();
      return Array.isArray(rows) ? rows : [];
    } catch (e) {
      console.warn('[DataClient] listPendingCorpusChunks failed:', e.message);
      return null;
    }
  }

  /**
   * Round 19 §6 — embed_pending_chunks(p_embeddings jsonb) RPC. Submits a
   * batch of {id, embedding} pairs from knowledge_corpus_pending so the
   * server moves them into knowledge_corpus with embeddings attached.
   * Idempotent — sets embedded_at on the source row so re-runs are safe.
   *
   * @param {Array<{id, embedding:number[1536]}>} embeddings
   * @returns {Promise<{submitted:number, inserted:number}|null>}
   */
  async embedPendingChunks(embeddings) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    if (!Array.isArray(embeddings) || embeddings.length === 0) return null;
    const url = `${this.supabaseUrl}/rpc/embed_pending_chunks`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
    };
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ p_embeddings: embeddings })
      });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(text || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      return data || null;
    } catch (e) {
      console.warn('[DataClient] embedPendingChunks failed:', e.message);
      return null;
    }
  }

  /** Manually trigger the scheduled-email fan-out (admin / debug). */
  async enqueueDueScheduledReports() {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const url = `${this.supabaseUrl}/rpc/enqueue_due_scheduled_reports`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
    };
    try {
      const resp = await fetch(url, { method: 'POST', headers, body: '{}' });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(text || `HTTP ${resp.status}`);
      }
      return await resp.json();
    } catch (e) {
      console.warn('[DataClient] enqueueDueScheduledReports failed:', e.message);
      return null;
    }
  }

  /** Pending email queue introspection. */
  async listPendingEmails(state) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const stateKey = (state || this.state || '').toLowerCase();
    const params = new URLSearchParams({
      state: 'eq.' + stateKey,
      sent_at: 'is.null',
      select: '*',
      order: 'scheduled_for.asc',
    });
    const url = `${this.supabaseUrl}/email_send_queue?${params.toString()}`;
    const headers = { 'apikey': this.supabaseKey, 'Authorization': `Bearer ${this.supabaseKey}` };
    try {
      const resp = await fetch(url, { headers });
      if (!resp.ok) return null;
      return await resp.json();
    } catch (e) {
      console.warn('[DataClient] listPendingEmails failed:', e.message);
      return null;
    }
  }

  /**
   * mv_dashboard_comparisons — per-(state, scope, jurisdiction) Dashboard
   * comparison rows for region/MPO/county tables.
   * @param {object} opts {state?, scope ('county'|'mpo'|'planning_district'), limit?}
   */
  async getDashboardComparisons(opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const stateKey = (opts.state || this.state || '').toLowerCase();
    const params = new URLSearchParams({
      state: 'eq.' + stateKey,
      scope: 'eq.' + (opts.scope || 'county'),
      select: '*',
      order: 'crash_count.desc',
    });
    if (opts.limit) params.set('limit', String(opts.limit));
    const url = `${this.supabaseUrl}/mv_dashboard_comparisons?${params.toString()}`;
    const headers = { 'apikey': this.supabaseKey, 'Authorization': `Bearer ${this.supabaseKey}` };
    try {
      const resp = await fetch(url, { headers });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        if (resp.status === 404 || /relation .* does not exist/i.test(text)) return null;
        throw new Error(text || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      this._source = 'supabase';
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn('[DataClient] getDashboardComparisons failed:', e.message);
      return null;
    }
  }

  /**
   * mv_speed_severity_matrix — Year × Severity speed-related crash matrix
   * for the F&S Speed-Related sub-tab.
   * @param {object} opts {state?, county?}
   */
  async getSpeedSeverityMatrix(opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const stateKey = (opts.state || this.state || '').toLowerCase();
    const params = new URLSearchParams({
      state: 'eq.' + stateKey,
      select: '*',
      order: 'crash_year.asc',
    });
    if (opts.county) {
      const canonical = String(opts.county).endsWith(' County') ? opts.county : opts.county + ' County';
      params.set('jurisdiction_county', 'eq.' + canonical);
    }
    const url = `${this.supabaseUrl}/mv_speed_severity_matrix?${params.toString()}`;
    const headers = { 'apikey': this.supabaseKey, 'Authorization': `Bearer ${this.supabaseKey}` };
    try {
      const resp = await fetch(url, { headers });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        if (resp.status === 404 || /relation .* does not exist/i.test(text)) return null;
        throw new Error(text || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      this._source = 'supabase';
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn('[DataClient] getSpeedSeverityMatrix failed:', e.message);
      return null;
    }
  }

  /**
   * Round 17 §2 — Tier-adaptive jurisdiction breakdown.
   * Drives the Dashboard / Grants widget. RPC returns one row per
   * county/CCD/host_county depending on the active tier.
   *
   * @param {object} opts {state?, tier, value?}
   * @returns {Promise<Array>} normalized rows (out_ prefix stripped)
   */
  async getJurisdictionBreakdown(opts) {
    if (!this.preferSupabase || !this.supabaseKey) return [];
    opts = opts || {};
    const body = {
      p_state: (opts.state || this.state || '').toLowerCase(),
      p_tier:  opts.tier  || 'state',
      p_value: opts.value || null,
    };
    const url = `${this.supabaseUrl}/rpc/get_jurisdiction_breakdown`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!resp.ok) {
        const err = await resp.text().catch(() => '');
        throw new Error(err || `HTTP ${resp.status}`);
      }
      const rows = await resp.json();
      this._source = 'supabase';
      // Unwrap the "out_" prefix the RPC uses to avoid column-name
      // ambiguity in PL/pgSQL.
      return (rows || []).map(r => ({
        breakdown_kind:      r.out_breakdown_kind,
        label:               r.out_label,
        crash_count:         Number(r.out_crash_count || 0),
        fatals:              Number(r.out_fatals || 0),
        serious:             Number(r.out_serious || 0),
        epdo:                Number(r.out_epdo || 0),
        ped_count:           Number(r.out_ped_count || 0),
        bike_count:          Number(r.out_bike_count || 0),
        ka_rate_pct:         Number(r.out_ka_rate_pct || 0),
        is_blocked_upstream: !!r.out_is_blocked_upstream,
      }));
    } catch (e) {
      clearTimeout(timer);
      console.warn('[DataClient] getJurisdictionBreakdown failed:', e.message);
      return [];
    }
  }

  // ─────────────────────────────────────────────────────────
  //  SUPABASE INTERNALS
  // ─────────────────────────────────────────────────────────

  /**
   * Build tier filter params for Supabase.
   *
   * @param {string} tier
   * @param {string} value
   * @param {string} [matview='default'] — name of the matview being queried.
   *   mv_hotspots and mv_grants_baseline aliased the tier columns at
   *   CREATE time (county / region / mpo) so they need their own column
   *   map. Every other matview accepts the dashboard_summary column names.
   */
  _tierFilter(tier, value, matview = 'default') {
    const map = CrashLensDataClient.TIER_COLUMNS_BY_MATVIEW[matview]
             || CrashLensDataClient.TIER_COLUMNS_BY_MATVIEW.default;
    const col = map[tier];
    const params = {};
    if (this.state && tier !== 'federal') {
      params.state = `eq.${this.state}`;
    }
    if (col && value) {
      params[col] = `eq.${value}`;
    }
    return params;
  }

  /**
   * Query dashboard_summary matview.
   * @deprecated Internal helper for the deprecated getSummary() path —
   *   see getDashboardTierKpi() for pure KPI reads.
   */
  async _supabaseSummary(tier, value, filters) {
    const tierFilters = this._tierFilter(tier, value);
    const allFilters = { ...tierFilters };

    if (filters.yearFrom) allFilters.crash_year = `gte.${filters.yearFrom}`;
    if (filters.yearTo) {
      // Supabase doesn't support two filters on same column easily,
      // use 'and' syntax for range
      if (filters.yearFrom) {
        delete allFilters.crash_year;
        allFilters.and = `(crash_year.gte.${filters.yearFrom},crash_year.lte.${filters.yearTo})`;
      } else {
        allFilters.crash_year = `lte.${filters.yearTo}`;
      }
    }
    if (filters.severity) allFilters.crash_severity = `eq.${filters.severity}`;
    if (filters.fc) allFilters.functional_class = `eq.${filters.fc}`;
    if (filters.areaType) allFilters.area_type = `eq.${filters.areaType}`;
    // road_type bucket filter — 4-bucket model on the matview (post-2026-04-30):
    //   dot_roads / county_roads / city_roads / other_roads, derived from
    //   crashes.ownership. is_interstate boolean is true only on dot_roads
    //   interstate segments.
    //
    //   - filters.roadType ........ single bucket (eq.)
    //   - filters.roadTypes ....... array of buckets (in.()) — used by Federal
    //                                "Non-DOT Roads" (county+city+other)
    //   - filters.noInterstate .... is_interstate=eq.false — used by County
    //                                "All Roads (No Interstate)"
    this._applyRoadTypeMatviewFilters(allFilters, filters);

    // Explicit projection — dashboard_summary has 22 columns but the bridge's
    // aggregate() only consumes 14. Dropping `SELECT *` cuts the JSON payload
    // by ~6× on county-tier queries (~8 MB → ~1.3 MB) and the wall-clock by
    // ~4× on the same queries. Jurisdictional columns (state, physical_juris_name,
    // dot_district, mpo_name, planning_district) are already in the WHERE
    // clause, so shipping them back per-row is dead weight. If a future card
    // breaks, add the column back to this list — that's the entire reverse path.
    const data = await this._supabaseQuery('dashboard_summary', {
      select: 'crash_year,crash_severity,road_type,is_interstate,crash_count,fatals,serious_injuries,total_injured,ped_crashes,bike_crashes,speed_crashes,alcohol_crashes,night_crashes,animal_crashes,functional_class,collision_type',
      filters: allFilters,
      order: 'crash_year.asc',
      limit: 100000,
      signal: filters && filters.signal,   // Round 21 §1.2 — prewarm cancel
    });
    this._warnIfZeroRows('dashboard_summary', data, tier, value, filters);
    return data;
  }

  /**
   * Surface a console.warn when a Supabase matview query returns zero rows
   * for a tier-scoped or filter-scoped request. Common root causes:
   *   - hierarchy.json `dbName` missing or out of sync with the matview's
   *     dot_district / mpo_name / planning_district column values
   *   - state key mismatch between window.crashLensClient.state and the
   *     actual `state` column (e.g. 'colorado' default leaking into a DE
   *     session before the dropdown propagates)
   *   - radio mapped to a bucket that genuinely has no rows for this
   *     jurisdiction (e.g. cityOnly at a region with no city roads)
   *
   * Quietly returns when the query was unscoped (federal × allRoads): empty
   * results there usually mean an outage, not a config issue, and the bridge
   * already logs that path.
   */
  _warnIfZeroRows(table, data, tier, value, filters) {
    try {
      const len = Array.isArray(data) ? data.length : (data?.rows?.length ?? 0);
      if (len !== 0) return;
      const f = filters || {};
      const hasFilter = !!(f.roadType || (Array.isArray(f.roadTypes) && f.roadTypes.length) ||
                          f.noInterstate || (tier && tier !== 'federal' && value));
      if (!hasFilter) return;
      console.warn(
        `[DataClient] 0 rows from ${table}`,
        {
          state: this.state,
          tier,
          value,
          roadType: f.roadType || null,
          roadTypes: f.roadTypes || null,
          noInterstate: !!f.noInterstate
        },
        '— check that the tier value matches the matview column. ' +
        'Common cause: hierarchy.json dbName mismatch (region/MPO/planning_district).'
      );
    } catch (e) { /* non-fatal — diagnostic only */ }
  }

  /**
   * Apply the road_type / roadTypes / noInterstate filter spec onto a Supabase
   * filters object meant for one of the matviews. Mutates `target` in place.
   *
   * Precedence: noInterstate is independent of roadType; roadTypes (array)
   * wins over roadType (scalar) when both are provided.
   */
  _applyRoadTypeMatviewFilters(target, opts) {
    if (!opts) return;
    if (Array.isArray(opts.roadTypes) && opts.roadTypes.length > 0) {
      target.road_type = `in.(${opts.roadTypes.join(',')})`;
    } else if (opts.roadType && opts.roadType !== 'all_roads' && opts.roadType !== 'allRoads') {
      // 'all_roads' / 'allRoads' are UI sentinels meaning "no filter".
      // The matview's road_type column only has the four bucket values
      // (dot_roads / county_roads / city_roads / other_roads); literal
      // 'all_roads' would match no rows. The single source of truth for
      // radio → spec is app/modules/data/road-type-mapping.js, which
      // emits {} for "All Roads" — this guard is a defense-in-depth
      // layer for callers that hardcode 'all_roads' as a default.
      target.road_type = `eq.${opts.roadType}`;
    }
    if (opts.noInterstate) {
      target.is_interstate = 'eq.false';
    }
  }

  /** Escape an ilike pattern: PostgREST uses `*` as wildcard, comma/parens are reserved */
  _escapeIlike(s) {
    return String(s || '').replace(/[,()]/g, ' ').trim();
  }

  /** Query crashes table with rich filters + pagination (or bulk fetch when filters.all) */
  async _supabaseCrashes(tier, value, filters) {
    const tierFilters = this._tierFilter(tier, value);
    const allFilters = { ...tierFilters };
    const page = filters.page || 1;
    const pageSize = filters.pageSize || this.pageSize;

    // Exact-match scalar filters
    if (filters.year) allFilters.crash_year = `eq.${filters.year}`;
    if (filters.route) allFilters.rte_name = `eq.${filters.route}`;
    if (filters.node) allFilters.node = `eq.${filters.node}`;

    // Road-type bucket filters against the raw `crashes` table use the
    // ownership column (the matview's road_type column doesn't exist on the
    // base table). is_interstate is honored directly when the column exists,
    // with a `system!=DOT Interstate` fallback baked into the ownership map.
    this._applyRoadTypeCrashesFilters(allFilters, filters);

    // Fuzzy-match filters — used by getCrashesByLocation retry when exact
    // matching fails due to route/node format drift between R2 CSV and Supabase.
    if (filters.routePattern) allFilters.rte_name = `ilike.${filters.routePattern}`;
    if (filters.nodePattern)  allFilters.node     = `ilike.${filters.nodePattern}`;

    // Severity: string or array (multi-severity via in.(...))
    if (filters.severity) {
      if (Array.isArray(filters.severity)) {
        if (filters.severity.length === 1) {
          allFilters.crash_severity = `eq.${filters.severity[0]}`;
        } else if (filters.severity.length > 1) {
          allFilters.crash_severity = `in.(${filters.severity.join(',')})`;
        }
      } else {
        allFilters.crash_severity = `eq.${filters.severity}`;
      }
    }

    // Ped / Bike flags
    if (filters.pedBike === 'ped') {
      allFilters.pedestrian = 'eq.Yes';
    } else if (filters.pedBike === 'bike') {
      allFilters.bike = 'eq.Yes';
    } else if (filters.pedBike === 'either') {
      // needs OR — handled in andParts below
    }

    // Date range (crash_date column)
    const andParts = [];
    if (filters.dateFrom) andParts.push(`crash_date.gte.${filters.dateFrom}`);
    if (filters.dateTo)   andParts.push(`crash_date.lte.${filters.dateTo}`);

    // Text search — narrowed to the two columns that actually matter (rte_name,
    // collision_type). Searching all 5 columns (doc_nbr/intersection/weather)
    // triggered `canceling statement due to statement timeout` on 86K-row
    // Sussex because the leading-wildcard ILIKE forces a full scan per column.
    // Until trigram/GIN indexes exist server-side, keep the scan narrow.
    if (filters.text && String(filters.text).trim()) {
      const t = this._escapeIlike(filters.text);
      const pattern = `*${t}*`;
      allFilters.or = `(rte_name.ilike.${pattern},collision_type.ilike.${pattern})`;
    }

    if (filters.pedBike === 'either') {
      // If we're already using `or` for text search, combine into `and` group
      if (allFilters.or) {
        andParts.push(`or(pedestrian.eq.Yes,bike.eq.Yes)`);
      } else {
        allFilters.or = `(pedestrian.eq.Yes,bike.eq.Yes)`;
      }
    }

    if (andParts.length) {
      allFilters.and = `(${andParts.join(',')})`;
    }

    // Bulk fetch mode (filters.all) — used by CMF/Warrants/CSV export.
    // Round 17 §9.6 — a single limit=200000 hits Supabase statement_timeout
    // and returns 500. Chunk anything above 10K via PostgREST `Range:`
    // header so each request stays well under the per-statement budget.
    if (filters.all) {
      const maxRows = filters.maxRows || 10000;
      const CHUNK = 10000;
      if (maxRows <= CHUNK) {
        const data = await this._supabaseQuery('crashes', {
          filters: allFilters,
          order: 'crash_year.desc,objectid.asc',
          limit: maxRows,
        });
        const rows = Array.isArray(data) ? data : (data.rows || []);
        return {
          rows: rows.map(r => this._pgToFrontend(r)),
          total: rows.length,
          page: 1,
        };
      }
      const out = [];
      for (let start = 0; start < maxRows; start += CHUNK) {
        const end = Math.min(start + CHUNK - 1, maxRows - 1);
        let chunk;
        try {
          chunk = await this._supabaseQuery('crashes', {
            filters: allFilters,
            order: 'crash_year.desc,objectid.asc',
            range: [start, end],
          });
        } catch (e) {
          console.warn('[DataClient] bulk chunk ' + start + '-' + end + ' failed:', e && e.message);
          break;
        }
        const rows = Array.isArray(chunk) ? chunk : (chunk.rows || []);
        if (!rows.length) break;
        for (let i = 0; i < rows.length; i++) out.push(this._pgToFrontend(rows[i]));
        if (rows.length < CHUNK) break;
      }
      return { rows: out, total: out.length, page: 1 };
    }

    // Paginated mode (default)
    const rangeStart = (page - 1) * pageSize;
    const rangeEnd = rangeStart + pageSize - 1;

    const data = await this._supabaseQuery('crashes', {
      filters: allFilters,
      order: 'crash_year.desc,objectid.asc',
      range: [rangeStart, rangeEnd],
      count: true,
    });

    return {
      rows: (data.rows || data).map(r => this._pgToFrontend(r)),
      total: data.count || 0,
      page: page,
      pageSize: pageSize,
    };
  }

  /** Query crashes for map viewport */
  async _supabaseMapCrashes(bounds, filters, limit) {
    // PostGIS viewport filter via RPC or raw filter on x/y
    const allFilters = {};
    if (this.state) allFilters.state = `eq.${this.state}`;

    // Use x/y range filters (works without PostGIS RPC)
    allFilters.x = `gte.${bounds.west}`;
    allFilters.y = `gte.${bounds.south}`;
    // Supabase column filters for range need special handling
    // We'll use the 'and' param for compound filters
    const andParts = [
      `x.gte.${bounds.west}`,
      `x.lte.${bounds.east}`,
      `y.gte.${bounds.south}`,
      `y.lte.${bounds.north}`,
    ];
    delete allFilters.x;
    delete allFilters.y;

    if (filters.year) andParts.push(`crash_year.eq.${filters.year}`);
    if (filters.severity) {
      if (Array.isArray(filters.severity)) {
        allFilters.crash_severity = `in.(${filters.severity.join(',')})`;
      } else {
        andParts.push(`crash_severity.eq.${filters.severity}`);
      }
    }

    // Road-type bucket filters against the raw crashes table — same
    // ownership-mapped path used by _supabaseCrashes.
    this._applyRoadTypeCrashesFilters(allFilters, filters);

    allFilters.and = `(${andParts.join(',')})`;

    return this._supabaseQuery('crashes', {
      select: 'objectid,x,y,crash_severity,crash_year,collision_type,rte_name,intersection_name',
      filters: allFilters,
      limit: limit,
    });
  }

  /**
   * Apply road-type bucket / noInterstate filters against the raw `crashes`
   * table. The base table doesn't have road_type, so buckets are translated to
   * an `ownership=in.(...)` clause via OWNERSHIP_BUCKETS. is_interstate is
   * applied directly (column present on crashes post-2026-04-30 migration);
   * if the column is missing the request 400s and the caller falls back to R2.
   */
  _applyRoadTypeCrashesFilters(target, opts) {
    if (!opts) return;
    const buckets = Array.isArray(opts.roadTypes) && opts.roadTypes.length > 0
      ? opts.roadTypes
      : (opts.roadType ? [opts.roadType] : []);
    if (buckets.length > 0) {
      const owners = [];
      for (const b of buckets) {
        const list = CrashLensDataClient.OWNERSHIP_BUCKETS[b];
        if (Array.isArray(list)) owners.push(...list);
      }
      if (owners.length > 0) {
        // Quote ownership values that contain commas/spaces — PostgREST
        // requires double-quotes around values inside in.(...).
        const quoted = owners.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
        target.ownership = `in.(${quoted})`;
      }
    }
    if (opts.noInterstate) {
      target.is_interstate = 'eq.false';
    }
  }

  /**
   * Generic Supabase REST query
   * @param {string} table - Table or matview name
   * @param {object} opts - { select, filters, order, limit, range, single, count }
   */
  async _supabaseQuery(table, opts = {}) {
    const url = new URL(`${this.supabaseUrl}/${table}`);

    // Select
    if (opts.select) url.searchParams.set('select', opts.select);

    // Filters
    if (opts.filters) {
      for (const [key, val] of Object.entries(opts.filters)) {
        url.searchParams.set(key, val);
      }
    }

    // Order
    if (opts.order) url.searchParams.set('order', opts.order);

    // Limit
    if (opts.limit) url.searchParams.set('limit', opts.limit);

    // Headers
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
    };

    if (opts.single) headers['Accept'] = 'application/vnd.pgrst.object+json';
    // count=estimated uses pg_class.reltuples (planner stats) instead of
    // running a second COUNT(*) query — saves ~50–80% of latency on
    // multi-million-row crashes table queries with a small accuracy trade-off
    // (within ~5% on freshly-VACUUM'd tables). Pagination UI rounds totals
    // anyway so this is invisible to the user.
    if (opts.count) headers['Prefer'] = 'count=estimated';

    // Range header for pagination
    if (opts.range) {
      headers['Range'] = `${opts.range[0]}-${opts.range[1]}`;
    }

    // Fetch with timeout. Round 17 §9.8 — Hostinger's reverse proxy
    // occasionally drops the TCP connection mid-request (manifests as
    // `ERR_CONNECTION_CLOSED` / "Failed to fetch"). Retry transient
    // network errors with exponential backoff before surfacing.
    const ATTEMPTS = 3;
    let lastError = null;
    // Round 21 §1.2 — accept an optional external AbortSignal (from prewarm's
    // cancellation token). If the caller aborts before/while we're fetching,
    // surface an AbortError so the prewarm batch can short-circuit cleanly.
    const externalSignal = opts.signal || null;
    if (externalSignal && externalSignal.aborted) {
      const e = new Error('Aborted by external signal');
      e.name = 'AbortError';
      throw e;
    }
    for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeout);
      let onExternalAbort = null;
      if (externalSignal) {
        onExternalAbort = () => controller.abort();
        externalSignal.addEventListener('abort', onExternalAbort, { once: true });
      }
      try {
        const resp = await fetch(url.toString(), { headers, signal: controller.signal });
        clearTimeout(timer);
        if (onExternalAbort) externalSignal.removeEventListener('abort', onExternalAbort);

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.message || `HTTP ${resp.status}`);
        }

        const data = await resp.json();

        if (opts.count) {
          const contentRange = resp.headers.get('Content-Range');
          const total = contentRange ? parseInt(contentRange.split('/')[1]) || 0 : data.length;
          return { rows: data, count: total };
        }

        return data;
      } catch (e) {
        clearTimeout(timer);
        if (onExternalAbort) externalSignal.removeEventListener('abort', onExternalAbort);
        lastError = e;
        // If the caller-supplied signal aborted, propagate AbortError without retry.
        if (externalSignal && externalSignal.aborted) {
          const ae = new Error('Aborted by external signal');
          ae.name = 'AbortError';
          throw ae;
        }
        const msg = String(e && e.message || '');
        const isTransient = /ERR_CONNECTION_CLOSED|Failed to fetch|NetworkError|aborted/i.test(msg);
        if (!isTransient || attempt === ATTEMPTS - 1) throw e;
        await new Promise(r => setTimeout(r, 200 * Math.pow(2, attempt)));   // 200ms, 400ms
        console.log('[DataClient] retry ' + (attempt + 1) + '/' + (ATTEMPTS - 1) + ' for ' + table + ' (' + msg + ')');
      }
    }
    throw lastError || new Error('Unknown fetch error');
  }

  // ─────────────────────────────────────────────────────────
  //  R2 FALLBACK
  // ─────────────────────────────────────────────────────────

  /**
   * Load crashes from R2 as a .parquet file.
   *
   * Policy (2026-04-23): R2 crash data is `.parquet` only — not `.parquet.gz`,
   * not `.csv`. The app's global _parseParquetGz() tolerates both raw and
   * gzipped bytes (it sniffs the 0x1F 0x8B magic bytes), so we delegate to
   * it and let it decide. We NEVER fall back to `.csv` — if the .parquet
   * isn't there, the fetch throws.
   */
  async _r2LoadCrashes(tier, value, opts = {}) {
    const path = this._r2Path(tier, value);        // always ends in .parquet
    const url = `${this.r2BaseUrl}/${path}`;

    // Round 15 §12.12 — accept an optional AbortSignal so a parallel race
    // (e.g. Supabase vs R2) can cancel the in-flight R2 download once the
    // winner returns. Bandwidth saved: ~50–250 MB per discarded race when
    // the parquet for a multi-county jurisdiction is fetched in parallel
    // with a Supabase summary that finishes first.
    const fetchOpts = {};
    if (opts && opts.signal) fetchOpts.signal = opts.signal;
    const resp = await fetch(url, fetchOpts);
    if (!resp.ok) throw new Error(`R2 parquet fetch failed (${resp.status}): ${url}`);
    const buf = await resp.arrayBuffer();

    // Prefer the app's shared parquet parser so we match the main pipeline's
    // column parsing exactly (Title Case keys, same hyparquet version).
    // Other modules reference `_parseParquetGz` as a bare global — do the same
    // so we work regardless of whether it's attached to window or not.
    const appParser =
      (typeof window !== 'undefined' && window._parseParquetGz) ||
      (typeof globalThis !== 'undefined' && globalThis._parseParquetGz) ||
      null;
    if (typeof appParser === 'function') {
      const { rows } = await appParser(buf);
      return rows;
    }

    // Test / Node environments: inline hyparquet — same logic as the in-app parser.
    const hp = await import('https://cdn.jsdelivr.net/npm/hyparquet@1.7.0/+esm');
    const meta = hp.parquetMetadata(buf);
    const fields = meta.schema.slice(1).map(s => s.name);
    let rawRows;
    await hp.parquetRead({ file: buf, onComplete: data => { rawRows = data; } });
    return rawRows.map(r => {
      const obj = {};
      for (let j = 0; j < fields.length; j++) obj[fields[j]] = r[j] != null ? String(r[j]) : '';
      return obj;
    });
  }

  /** Build R2 path for a tier/value */
  _r2Path(tier, value) {
    const statePrefix = this.state || 'delaware';
    const slug = value ? this._slugify(value) : '';

    switch (tier) {
      case 'state':
        return `${statePrefix}/_state/all_roads.parquet`;
      case 'region':
        return `${statePrefix}/_region/${slug}/all_roads.parquet`;
      case 'planning_district':
        return `${statePrefix}/_planning_district/${slug}/all_roads.parquet`;
      case 'mpo':
        return `${statePrefix}/_mpo/${slug}/all_roads.parquet`;
      case 'county':
        return `${statePrefix}/${slug}/all_roads.parquet`;
      case 'city':
        return `${statePrefix}/_city/${slug}/all_roads.parquet`;
      default:
        return `${statePrefix}/_state/all_roads.parquet`;
    }
  }

  // ─────────────────────────────────────────────────────────
  //  COLUMN MAPPING
  // ─────────────────────────────────────────────────────────

  /** Convert Supabase snake_case row to frontend Title Case */
  _pgToFrontend(row) {
    const out = {};
    for (const [pgCol, val] of Object.entries(row)) {
      const frontendCol = CrashLensDataClient.PG_TO_FRONTEND[pgCol] || pgCol;
      out[frontendCol] = val;
    }
    // Expand JSONB if present
    if (row.road_data && typeof row.road_data === 'object') {
      Object.assign(out, row.road_data);
    }
    if (row.state_extras && typeof row.state_extras === 'object') {
      Object.assign(out, row.state_extras);
    }
    if (row.ranking_data && typeof row.ranking_data === 'object') {
      Object.assign(out, row.ranking_data);
    }
    return out;
  }

  /** Expand JSONB fields into flat object */
  _expandJsonb(row) {
    const out = { ...row };
    if (row.road_data && typeof row.road_data === 'string') {
      try { Object.assign(out, JSON.parse(row.road_data)); } catch (e) {}
    } else if (row.road_data && typeof row.road_data === 'object') {
      Object.assign(out, row.road_data);
    }
    if (row.state_extras && typeof row.state_extras === 'string') {
      try { Object.assign(out, JSON.parse(row.state_extras)); } catch (e) {}
    } else if (row.state_extras && typeof row.state_extras === 'object') {
      Object.assign(out, row.state_extras);
    }
    if (row.ranking_data && typeof row.ranking_data === 'string') {
      try { Object.assign(out, JSON.parse(row.ranking_data)); } catch (e) {}
    } else if (row.ranking_data && typeof row.ranking_data === 'object') {
      Object.assign(out, row.ranking_data);
    }
    delete out.road_data;
    delete out.state_extras;
    delete out.ranking_data;
    return out;
  }

  // ─────────────────────────────────────────────────────────
  //  CLIENT-SIDE AGGREGATION (R2 fallback)
  // ─────────────────────────────────────────────────────────

  /** Aggregate loaded rows into summary format matching dashboard_summary */
  _aggregateLocally(rows, filters) {
    // Filter rows
    let filtered = rows;
    if (filters.yearFrom) filtered = filtered.filter(r => parseInt(r['Crash Year']) >= filters.yearFrom);
    if (filters.yearTo)   filtered = filtered.filter(r => parseInt(r['Crash Year']) <= filters.yearTo);
    if (filters.severity) filtered = filtered.filter(r => r['Crash Severity'] === filters.severity);

    // Group by year + severity
    const groups = {};
    for (const r of filtered) {
      const key = `${r['Crash Year']}|${r['Crash Severity']}`;
      if (!groups[key]) {
        groups[key] = {
          crash_year: parseInt(r['Crash Year']) || 0,
          crash_severity: r['Crash Severity'] || '',
          crash_count: 0,
          fatals: 0,
          serious_injuries: 0,
          total_injured: 0,
          ped_crashes: 0,
          bike_crashes: 0,
          speed_crashes: 0,
          alcohol_crashes: 0,
          night_crashes: 0,
          animal_crashes: 0,
        };
      }
      const g = groups[key];
      g.crash_count++;
      g.fatals         += parseInt(r['K_People']) || 0;
      g.serious_injuries += parseInt(r['A_People']) || 0;
      g.total_injured  += parseInt(r['Persons Injured']) || 0;
      if (r['Pedestrian?'] === 'Yes') g.ped_crashes++;
      if (r['Bike?'] === 'Yes')       g.bike_crashes++;
      if (r['Speed?'] === 'Yes')      g.speed_crashes++;
      if (r['Alcohol?'] === 'Yes')    g.alcohol_crashes++;
      if (r['Night?'] === 'Yes')      g.night_crashes++;
      if (r['Animal Related?'] === 'Yes') g.animal_crashes++;
    }

    return Object.values(groups).sort((a, b) => a.crash_year - b.crash_year);
  }

  /** Filter loaded rows with pagination (R2 fallback path) */
  _filterLocally(rows, filters) {
    const isYes = (v) => {
      const s = String(v || '').toLowerCase();
      return s === 'yes' || s === 'y' || s === 'true' || s === '1';
    };

    let filtered = rows;
    if (filters.year)     filtered = filtered.filter(r => String(r['Crash Year']) == String(filters.year));
    if (filters.route)    filtered = filtered.filter(r => r['RTE Name'] === filters.route);
    if (filters.node)     filtered = filtered.filter(r => r['Node'] === filters.node);
    if (filters.severity) {
      const sevSet = Array.isArray(filters.severity) ? new Set(filters.severity) : new Set([filters.severity]);
      filtered = filtered.filter(r => sevSet.has((r['Crash Severity'] || '').charAt(0) || r['Crash Severity']));
    }
    if (filters.pedBike === 'ped')    filtered = filtered.filter(r => isYes(r['Pedestrian?']));
    if (filters.pedBike === 'bike')   filtered = filtered.filter(r => isYes(r['Bike?']));
    if (filters.pedBike === 'either') filtered = filtered.filter(r => isYes(r['Pedestrian?']) || isYes(r['Bike?']));
    if (filters.dateFrom) filtered = filtered.filter(r => (r['Crash Date'] || '') >= filters.dateFrom);
    if (filters.dateTo)   filtered = filtered.filter(r => (r['Crash Date'] || '') <= filters.dateTo);
    if (filters.text && String(filters.text).trim()) {
      const t = String(filters.text).toLowerCase();
      filtered = filtered.filter(r => {
        const hay = [r['Document Nbr'], r['RTE Name'], r['Collision Type'], r['Weather Condition'], r['Node'], r['Intersection Name']].join(' ').toLowerCase();
        return hay.includes(t);
      });
    }

    if (filters.all) {
      const cap = filters.maxRows || 10000;
      return { rows: filtered.slice(0, cap), total: filtered.length, page: 1 };
    }

    const page = filters.page || 1;
    const pageSize = filters.pageSize || this.pageSize;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      rows: filtered.slice(start, end),
      total: filtered.length,
      page: page,
      pageSize: pageSize,
    };
  }

  // ─────────────────────────────────────────────────────────
  //  HELPERS
  // ─────────────────────────────────────────────────────────

  /** Calculate EPDO score for a severity distribution */
  static calcEPDO(severityCounts) {
    const w = CrashLensDataClient.EPDO;
    return (severityCounts.K || 0) * w.K +
           (severityCounts.A || 0) * w.A +
           (severityCounts.B || 0) * w.B +
           (severityCounts.C || 0) * w.C +
           (severityCounts.O || 0) * w.O;
  }

  // ─────────────────────────────────────────────────────────
  //  STALE-WHILE-REVALIDATE CACHE  (Phase 6 perf §6.2 / §6.6)
  //
  //  In-memory cache keyed by (tier, value, filters). On hit, returns the
  //  cached value immediately AND fires a background revalidation that
  //  overwrites the cached value when it lands. The bridge re-renders KPIs
  //  from whatever value sits in the cache at paint time, so SWR shaves the
  //  perceived latency of tier toggles without making the UI lie.
  //
  //  Pre-2026-04-30: Supabase responses had no Cache-Control headers —
  //  PostgREST add_cache_headers() hook is dormant on the host (see handoff
  //  §3.5). This client-side cache is the primary perf lever until that
  //  env var is set.
  // ─────────────────────────────────────────────────────────

  static SWR_TTL_MS = 60_000;          // serve stale up to 60s, then evict
  static _swrCache = new Map();        // shared across all clients in this tab
  static _swrInflight = new Map();     // de-dup concurrent revalidations

  /**
   * Stable JSON key for a cache entry. Sorts each level's keys so the
   * resulting string is deterministic regardless of the producer's property
   * insertion order — `{a:1,b:2}` and `{b:2,a:1}` hash to the same key.
   * Recurses into plain objects only; arrays/primitives pass through.
   */
  static _swrKey(parts) {
    const norm = (v) => {
      if (Array.isArray(v)) return v.map(norm);
      if (v && typeof v === 'object') {
        const out = {};
        for (const k of Object.keys(v).sort()) out[k] = norm(v[k]);
        return out;
      }
      return v;
    };
    return JSON.stringify(norm(parts));
  }

  /**
   * Wrap an async producer with stale-while-revalidate semantics. Returns the
   * cached value immediately when fresh; otherwise awaits the producer.
   * Concurrent calls with the same key share a single in-flight promise.
   *
   * @param {string} key - stable JSON key from _swrKey()
   * @param {function():Promise} producer - async fn returning the value
   * @returns {Promise<any>}
   */
  async _swr(key, producer) {
    const C = CrashLensDataClient;
    const now = Date.now();
    const hit = C._swrCache.get(key);
    if (hit && (now - hit.t) < C.SWR_TTL_MS) {
      return hit.v;
    }
    if (C._swrInflight.has(key)) {
      return C._swrInflight.get(key);
    }
    const p = (async () => {
      try {
        const v = await producer();
        C._swrCache.set(key, { v, t: Date.now() });
        return v;
      } finally {
        C._swrInflight.delete(key);
      }
    })();
    C._swrInflight.set(key, p);
    return p;
  }

  /**
   * Warm the dashboard_summary cache for an upcoming tier so the next
   * injectFastDashboard() call paints from cache. Fire-and-forget — never
   * throws (errors are swallowed). The bridge wires this in on tier change.
   *
   * @param {string} tier
   * @param {string} value
   * @param {object} opts - same shape as getSummary filters
   * @returns {Promise<void>}
   */
  async prefetchTier(tier, value, opts = {}) {
    try {
      await this.getSummary(tier, value, opts || {});
    } catch (e) {
      // Non-fatal — prefetch is best-effort
    }
  }

  /** Slugify a name for R2 paths */
  _slugify(name) {
    return (name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /** Minimal CSV parser (fallback) */
  _parseCSV(text) {
    const lines = text.split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].replace(/\r$/, '').split(',').map(h => h.replace(/^"|"$/g, '').trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].replace(/\r$/, '');
      if (!line.trim()) continue;
      const vals = line.split(',');
      const row = {};
      headers.forEach((h, j) => { row[h] = (vals[j] || '').replace(/^"|"$/g, '').trim(); });
      rows.push(row);
    }
    return rows;
  }

  // ─────────────────────────────────────────────────────────
  //  ROUND 16 — Map metrics, state capabilities, AADT bulk-import,
  //              scheduled-email transport helper.
  // ─────────────────────────────────────────────────────────

  /**
   * mv_map_metrics — 18 per-factor crash counts (fatal, serious, ka_combined,
   * pedestrian, bicycle, intersection, alcohol, speed, distracted,
   * unrestrained, nighttime, motorcycle, animal, workzone, school_zone,
   * guardrail, curves, weather) keyed on physical_juris_name / mpo_name /
   * planning_district / dot_district. Drives the Map factor-chip parity rail.
   *
   * @param {object} opts { state, juris, mpo, pd, factor }
   * @returns {Promise<Array|null>} matview rows
   */
  async getMapMetrics(opts) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    opts = opts || {};
    const stateKey = (opts.state || this.state || '').toLowerCase();
    const params = new URLSearchParams({ select: '*' });
    if (stateKey) params.set('state', `eq.${stateKey}`);
    if (opts.juris)  params.set('physical_juris_name', `eq.${opts.juris}`);
    if (opts.mpo)    params.set('mpo_name', `eq.${opts.mpo}`);
    if (opts.pd)     params.set('planning_district', `eq.${opts.pd}`);
    if (opts.factor) params.set('factor', `eq.${opts.factor}`);
    const url = `${this.supabaseUrl}/mv_map_metrics?${params.toString()}`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const resp = await fetch(url, { headers, signal: controller.signal });
      clearTimeout(timer);
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      this._source = 'supabase';
      return Array.isArray(data) ? data : [];
    } catch (e) {
      clearTimeout(timer);
      console.warn('[DataClient] getMapMetrics failed:', e.message);
      return null;
    }
  }

  /**
   * mv_map_points — ULTRA-SLIM per-marker projection for base map render.
   *
   * Round 26 v3: drops the 22 boolean flags + dimension strings from the base
   * select. Quick-filter activations lazily fetch their own match set via
   * getMapPointFlagMatches() (separate method, see below).
   *
   * Base payload: ~66 bytes/row (vs 695 in v2 = 90.5% smaller).
   * Wall time at 0.66 MB/s throughput floor: ~10s for 95K Central, ~60s for state.
   *
   * Parallel paged fetch only kicks in for tiers > 1M rows (federal).
   *
   * State-agnostic — keys on this.state + tier columns.
   */
  async getMapPoints(opts) {
    const baseParams = new URLSearchParams({
      state: 'eq.' + (this.state || '').toLowerCase(),
      // Ultra-slim: 4 columns only (90.5% smaller than R26 v2's slim).
      // Quick-filter flags are fetched on-demand by getMapPointFlagMatches().
      select: 'lat,lng,sev,road_type,is_ped,is_bike'
    });
    if (opts) {
      if (opts.dotDistrict)      baseParams.set('dot_district',         'eq.' + opts.dotDistrict);
      if (opts.planningDistrict) baseParams.set('planning_district',    'eq.' + opts.planningDistrict);
      if (opts.mpoName)          baseParams.set('mpo_name',             'eq.' + opts.mpoName);
      if (opts.jurisdiction)     baseParams.set('physical_juris_name',  'eq.' + opts.jurisdiction);
    }
    const headers = { apikey: this.supabaseKey, Authorization: 'Bearer ' + this.supabaseKey };
    // Step 1: count probe
    let totalCount = 0;
    try {
      const headRes = await fetch(`${this.supabaseUrl}/mv_map_points?${baseParams}&limit=1`, {
        headers: { ...headers, 'Prefer': 'count=exact' }
      });
      const range = headRes.headers.get('content-range') || '0/0';
      totalCount = parseInt(range.split('/')[1], 10) || 0;
    } catch (e) {
      console.warn('[getMapPoints] count probe failed:', e.message);
      return [];
    }
    if (totalCount === 0) return [];
    // Tier cap — at federal/state zoom individual markers aren't legible,
    // mv_hotspots heatmap carries the visual. Keys on tier, not state.
    const tier = opts && opts.tier;
    const POINT_CAPS = (typeof window !== 'undefined' && window.CL && window.CL.core && window.CL.core.POINT_CAPS) || {};
    const cap = POINT_CAPS[tier] || 200000;
    const effective = Math.min(totalCount, cap);
    if (effective < totalCount) {
      console.log(`[getMapPoints] capped at ${effective} for ${tier} tier (full: ${totalCount})`);
    }
    // Step 2: parallel page fetch (1M per page = current PostgREST cap)
    const PAGE_SIZE = 1000000;
    const pageCount = Math.ceil(effective / PAGE_SIZE);
    const t0 = Date.now();
    const pages = [];
    for (let i = 0; i < pageCount; i++) {
      const p = new URLSearchParams(baseParams);
      const remaining = effective - i * PAGE_SIZE;
      p.set('limit', String(Math.min(PAGE_SIZE, remaining)));
      p.set('offset', String(i * PAGE_SIZE));
      pages.push(fetch(`${this.supabaseUrl}/mv_map_points?${p}`, { headers })
        .then(r => r.ok ? r.json() : []));
    }
    let raw = [];
    try {
      const results = await Promise.all(pages);
      raw = [].concat(...results);
    } catch (e) {
      console.warn('[getMapPoints] paged fetch failed:', e.message);
      return [];
    }
    const wallMs = Date.now() - t0;
    const sizeMB = +(JSON.stringify(raw).length / 1024 / 1024).toFixed(1);
    console.log(`[getMapPoints] ULTRA-SLIM+pb ${raw.length}/${effective} rows (full: ${totalCount}), ${sizeMB}MB, ${pageCount} page(s), ${wallMs}ms`);
    // Each row gets a sequential index for use as a "match set ID" by lazy flag fetches
    return raw.map((r, idx) => ({
      _idx: idx,
      lat: r.lat, lng: r.lng, sev: r.sev,
      road_type: r.road_type,
      isPed: r.is_ped, isBike: r.is_bike
    }));
  }

  /**
   * Round 26 v3 §1b — lazy flag-match fetch.
   *
   * Returns a Set of {lat, lng} keys (stringified "lat,lng") matching the given
   * boolean flag at the active tier. Caller intersects with mapPoints by lat/lng
   * to filter client-side.
   *
   * Why a Set keyed by lat,lng instead of crash_id? The matview has no PK column.
   * Multiple crashes at the same lat/lng will all be flagged together — acceptable
   * for filter UI (the marker shows ALL crashes at that point anyway).
   *
   * Cached by `${tier_key}|${flag}` to avoid refetching when toggling on/off.
   *
   * @param {string} flag — column name like 'is_fatal', 'is_ksi', 'is_ped', etc.
   * @param {Object} opts — same shape as getMapPoints opts (tier filters)
   */
  async getMapPointFlagMatches(flag, opts) {
    const ALLOWED_FLAGS = new Set([
      'is_fatal','is_ksi','is_ped','is_bike','is_intersection','is_impaired',
      'is_alcohol','is_drug','is_speed','is_distracted','is_unrestrained','is_motorcycle',
      'is_animal','is_workzone','is_schoolzone','is_guardrail','is_curve','is_weather',
      'is_night','is_young','is_senior','is_drowsy','is_hitrun','is_lgtruck','is_interstate'
    ]);
    if (!ALLOWED_FLAGS.has(flag)) return new Set();
    // Cache: tier+flag → Set
    this._flagMatchCache = this._flagMatchCache || new Map();
    const tierKey = JSON.stringify(opts || {});
    const cacheKey = `${(this.state||'').toLowerCase()}|${tierKey}|${flag}`;
    if (this._flagMatchCache.has(cacheKey)) return this._flagMatchCache.get(cacheKey);
    const params = new URLSearchParams({
      state: 'eq.' + (this.state || '').toLowerCase(),
      select: 'lat,lng',
      limit: '1000000'
    });
    params.set(flag, 'eq.true');
    if (opts?.dotDistrict)      params.set('dot_district',        'eq.' + opts.dotDistrict);
    if (opts?.planningDistrict) params.set('planning_district',   'eq.' + opts.planningDistrict);
    if (opts?.mpoName)          params.set('mpo_name',            'eq.' + opts.mpoName);
    if (opts?.jurisdiction)     params.set('physical_juris_name', 'eq.' + opts.jurisdiction);
    const headers = { apikey: this.supabaseKey, Authorization: 'Bearer ' + this.supabaseKey };
    const t0 = Date.now();
    let rows = [];
    try {
      const r = await fetch(`${this.supabaseUrl}/mv_map_points?${params}`, { headers });
      rows = r.ok ? await r.json() : [];
      if (!Array.isArray(rows)) rows = [];
    } catch (e) {
      console.warn(`[getMapPointFlagMatches] ${flag} fetch failed:`, e.message);
      return new Set();
    }
    const matches = new Set(rows.map(r => `${r.lat},${r.lng}`));
    this._flagMatchCache.set(cacheKey, matches);
    console.log(`[getMapPointFlagMatches] ${flag}: ${rows.length} matches in ${Date.now() - t0}ms (cached)`);
    return matches;
  }

  /**
   * Round 26 v3.1 — fetch full crash row by lat/lng for popup display.
   *
   * mv_map_points has no PK column; lat+lng is the de-facto join key (with the
   * caveat that multiple crashes can share coords — we return the FIRST match).
   * For popup display this is acceptable since the user clicks one marker and
   * sees the representative crash; clustering already groups co-located crashes.
   *
   * Cached per (lat, lng) pair within the session — re-opening a popup is instant.
   *
   * @param {number} lat
   * @param {number} lng
   * @returns {Promise<Object|null>} full row or null on failure
   */
  async getMapPointDetail(lat, lng) {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    this._mapPointDetailCache = this._mapPointDetailCache || new Map();
    const key = `${lat},${lng}`;
    if (this._mapPointDetailCache.has(key)) return this._mapPointDetailCache.get(key);
    const params = new URLSearchParams({
      state: 'eq.' + (this.state || '').toLowerCase(),
      select: 'route,doc_id,crash_date,time_str,collision_type,weather_condition,light_condition,intersection_type,roadway_alignment,roadway_surface_cond,traffic_control_type,is_ped,is_bike,is_intersection',
      lat: 'eq.' + lat,
      lng: 'eq.' + lng,
      limit: '1'
    });
    const headers = { apikey: this.supabaseKey, Authorization: 'Bearer ' + this.supabaseKey };
    let detail = null;
    try {
      const r = await fetch(`${this.supabaseUrl}/mv_map_points?${params}`, { headers });
      if (r.ok) {
        const rows = await r.json();
        detail = (Array.isArray(rows) && rows[0]) ? rows[0] : null;
      }
    } catch (e) {
      console.warn('[getMapPointDetail] fetch failed:', e.message);
    }
    this._mapPointDetailCache.set(key, detail);
    return detail;
  }

  /**
   * states.capabilities jsonb — drives the BLOCKED-UPSTREAM honest banners
   * (Safety Focus cards, B/C severity cells, Magisterial District panels).
   * Returns the raw capabilities object or null.
   *
   * @param {string} [state]
   * @returns {Promise<object|null>}
   */
  async getStateCapabilities(state) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const stateKey = (state || this.state || '').toLowerCase();
    if (!stateKey) return null;
    const params = new URLSearchParams({
      select: 'abbr,name,fips,capabilities',
      or: `(abbr.ilike.${stateKey},name.ilike.${stateKey})`,
    });
    const url = `${this.supabaseUrl}/states?${params.toString()}`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
    };
    try {
      const resp = await fetch(url, { headers });
      if (!resp.ok) return null;
      const rows = await resp.json();
      return (rows && rows[0]) ? rows[0].capabilities : null;
    } catch (e) {
      console.warn('[DataClient] getStateCapabilities failed:', e.message);
      return null;
    }
  }

  /**
   * aadt_bulk_import RPC — accepts a JSON array of AADT rows and bulk-inserts
   * into aadt_lookup (idempotent via ON CONFLICT). Used by the paste-CSV
   * import UI to bring AADT coverage from 10.8% → 80%+.
   *
   * @param {Array<object>} rows
   * @returns {Promise<{submitted:number, inserted_or_updated:number, rejected:number}|null>}
   */
  async aadtBulkImport(rows) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    if (!Array.isArray(rows) || rows.length === 0) {
      return { submitted: 0, inserted_or_updated: 0, rejected: 0 };
    }
    const url = `${this.supabaseUrl}/rpc/aadt_bulk_import`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
    };
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ p_rows: rows }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      return await resp.json();
    } catch (e) {
      console.warn('[DataClient] aadtBulkImport failed:', e.message);
      return null;
    }
  }

  /**
   * format_scheduled_report_email RPC — invoked from the Deno Edge Function
   * to render a ready-to-send email payload (subject, body_html, body_text,
   * to) from a queued row.
   *
   * @param {number|string} queueId
   * @returns {Promise<object|null>}
   */
  async formatScheduledReportEmail(queueId) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    if (queueId == null) return null;
    const url = `${this.supabaseUrl}/rpc/format_scheduled_report_email`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
    };
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ p_queue_id: queueId }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      return await resp.json();
    } catch (e) {
      console.warn('[DataClient] formatScheduledReportEmail failed:', e.message);
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────
  //  ROUND 18 §1 — Filter-population RPCs
  // ─────────────────────────────────────────────────────────

  /**
   * Round 18 §1.1 — Populate Intersections Traffic Control dropdown.
   * Returns [{raw_value, label, crash_count}].
   */
  async getTrafficControlTypes(stateKey) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    const url = `${this.supabaseUrl}/rpc/get_traffic_control_types`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
    };
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ p_state: (stateKey || this.state || '').toLowerCase() }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      const rows = await resp.json();
      return Array.isArray(rows) ? rows : [];
    } catch (e) {
      console.warn('[DataClient] getTrafficControlTypes failed:', e.message);
      return null;
    }
  }

  /**
   * Round 18 §1.3 — Year-availability for date-picker bounds.
   * Returns [{crash_year, crash_count}].
   */
  async getYearFilterOptions(opts) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    opts = opts || {};
    const body = {
      p_state:              (opts.state || this.state || '').toLowerCase(),
      p_jurisdiction_kind:  opts.jurisdictionKind || null,
      p_jurisdiction_value: opts.jurisdictionValue || null,
    };
    const url = `${this.supabaseUrl}/rpc/get_year_filter_options`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
    };
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      const rows = await resp.json();
      return Array.isArray(rows) ? rows : [];
    } catch (e) {
      console.warn('[DataClient] getYearFilterOptions failed:', e.message);
      return null;
    }
  }

  /**
   * Round 18 §1.2 — mv_hotspots_yearly per-year rollup for date-filtered
   * hotspots / intersections / F&S queries. Pre-aggregated by Cowork.
   *
   * opts: { state, yearStart, yearEnd, locationType, limit }
   */
  async getHotspotsYearly(opts) {
    if (!this.preferSupabase || !this.supabaseKey) return null;
    opts = opts || {};
    const params = new URLSearchParams({
      state: 'eq.' + ((opts.state || this.state || '').toLowerCase()),
      select: 'location_type,location_name,crash_year,total_crashes,k,a,b,c,o,epdo,ped_count,bike_count,lat,lon,jurisdiction_county,jurisdiction_mpo,dot_district',
      order: 'total_crashes.desc',
      limit: String(opts.limit || 5000),
    });
    if (opts.yearStart != null) params.append('crash_year', 'gte.' + opts.yearStart);
    if (opts.yearEnd   != null) params.append('crash_year', 'lte.' + opts.yearEnd);
    if (opts.locationType)      params.set('location_type', 'eq.' + opts.locationType);
    if (opts.county) {
      // Round 19 §2 — mv_hotspots_yearly stores canonical "Kent County" (Round 14
      // pollution-fix pattern). Earlier code stripped the suffix → 0-row matches.
      const canonical = String(opts.county).endsWith(' County') ? opts.county : opts.county + ' County';
      params.set('jurisdiction_county', 'eq.' + canonical);
    }
    if (opts.mpo)               params.set('jurisdiction_mpo', 'eq.' + opts.mpo);
    if (opts.region)            params.set('dot_district', 'eq.' + opts.region);

    const url = `${this.supabaseUrl}/mv_hotspots_yearly?${params.toString()}`;
    const headers = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
    };
    try {
      const resp = await fetch(url, { headers });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      const rows = await resp.json();
      return Array.isArray(rows) ? rows : [];
    } catch (e) {
      console.warn('[DataClient] getHotspotsYearly failed:', e.message);
      return null;
    }
  }

  /** Health check — test Supabase connectivity */
  async healthCheck() {
    try {
      const data = await this._supabaseQuery('states', {
        select: 'abbr',
        limit: 1,
      });
      return { supabase: true, rows: data.length };
    } catch (e) {
      return { supabase: false, error: e.message };
    }
  }
}

// ─────────────────────────────────────────────────────────
//  CONVENIENCE: Global init function
// ─────────────────────────────────────────────────────────

/**
 * Initialize the data client. Call once on page load.
 *
 * Usage:
 *   const client = CrashLensDataClient.init({
 *     supabaseKey: 'eyJ...',
 *     state: 'delaware',
 *   });
 *
 *   // Or with all options:
 *   const client = CrashLensDataClient.init({
 *     supabaseUrl: 'https://srv1503081.hstgr.cloud/rest/v1',
 *     supabaseKey: 'eyJ...',
 *     r2BaseUrl: 'https://data.aicreatesai.com',
 *     state: 'delaware',
 *     preferSupabase: true,
 *   });
 */
CrashLensDataClient.init = function(opts) {
  const client = new CrashLensDataClient(opts);
  // Store globally for other scripts to access
  if (typeof window !== 'undefined') {
    window.crashLensClient = client;
  }
  console.log('[DataClient] Initialized:', {
    supabase: !!client.supabaseKey,
    state: client.state,
    r2: client.r2BaseUrl,
  });
  return client;
};
