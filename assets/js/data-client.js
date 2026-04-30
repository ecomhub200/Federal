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

  // 7-tier hierarchy: tier name → Supabase column
  static TIER_COLUMNS = {
    federal:           null,                   // no filter, all states
    state:             'state',
    region:            'dot_district',
    planning_district: 'planning_district',
    mpo:               'mpo_name',
    county:            'physical_juris_name',
    city:              'physical_juris_name',
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
   * @param {string} tier - 'federal'|'state'|'region'|'planning_district'|'mpo'|'county'|'city'
   * @param {string} value - Jurisdiction name (e.g. 'Kent', 'North District')
   * @param {object} filters - { yearFrom, yearTo, severity, fc, areaType, roadType }
   *                           roadType: matview road_type bucket ('dot_roads', 'city_roads',
   *                           'non_dot_roads', etc.). Omit for all-roads (no filter).
   * @returns {Promise<Array>} Summary rows with crash_count, fatals, ped_crashes, etc.
   */
  async getSummary(tier, value, filters = {}) {
    if (this.preferSupabase && this.supabaseKey) {
      try {
        const data = await this._supabaseSummary(tier, value, filters);
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
      p_limit:    opts.limit || this.mapLimit
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
        return data;
      } catch (e) {
        console.warn('[DataClient] Scorecard failed:', e.message);
      }
    }
    return [];
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
    try {
      const tierFilters = this._tierFilter(tier, value);
      const allFilters = { ...tierFilters };
      if (opts.roadType) allFilters.road_type = `eq.${opts.roadType}`;
      const limit = opts.limit || 100;
      // When no roadType filter is applied, the same location may appear up to
      // 3 times (dot_roads / non_dot_roads / all_roads bucket), so over-fetch
      // and merge below. With a roadType filter we still over-fetch a bit to
      // cover the intersections + segments split.
      const fetchLimit = opts.roadType ? limit * 2 : limit * 6;
      const data = await this._supabaseQuery('mv_hotspots', {
        filters: allFilters,
        order: 'epdo.desc',
        limit: fetchLimit,
      });
      this._source = 'supabase';

      // When no roadType filter is applied, rows for the same physical location
      // arrive once per road_type bucket. Merge them so totals/EPDO aren't split.
      let rows;
      if (opts.roadType) {
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
    try {
      const tierFilters = this._tierFilter(tier, value);
      const allFilters = { ...tierFilters };
      if (opts.treeType) allFilters.tree_type = `eq.${opts.treeType}`;
      const data = await this._supabaseQuery('mv_crash_tree', {
        filters: allFilters,
        limit: 50000,
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
    try {
      const tierFilters = this._tierFilter(tier, value);
      const allFilters = { ...tierFilters };
      if (opts.roadType) allFilters.road_type = `eq.${opts.roadType}`;
      if (opts.yearFrom && opts.yearTo) {
        allFilters.and = `(crash_year.gte.${opts.yearFrom},crash_year.lte.${opts.yearTo})`;
      }
      const data = await this._supabaseQuery('mv_grants_baseline', {
        filters: allFilters,
        order: 'epdo.desc',
        // When merging across road_type buckets we may pull up to ~3x the rows.
        limit: opts.roadType ? 5000 : 15000,
      });
      this._source = 'supabase';

      // When no roadType filter, the same (location, year) appears once per
      // road_type bucket. Merge them so EPDO ranking isn't split.
      if (!opts.roadType) {
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
    try {
      const tierFilters = this._tierFilter(tier, value);
      const allFilters = { ...tierFilters };
      // NOTE: mv_safety_categories has no crash_year column — it aggregates all
      // years by design. Year filtering is not supported for this matview.
      const data = await this._supabaseQuery('mv_safety_categories', {
        filters: allFilters,
        limit: 2000,
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
    try {
      const tierFilters = this._tierFilter(tier, value);
      const allFilters = { ...tierFilters };
      // NOTE: mv_analysis_summary has no crash_year column — 'year' is already
      // a breakdown axis (rows with dimension='year'), not a filter.
      const data = await this._supabaseQuery('mv_analysis_summary', {
        filters: allFilters,
        limit: 10000,
      });
      this._source = 'supabase';
      // Rows are grouped by (state, county, district, mpo, planning_district,
      // dimension, dim_value). At any aggregate tier each (dimension, dim_value)
      // appears once per county — accumulate instead of overwrite.
      const out = { byYear: {}, byMonth: {}, bySeverity: {K:0,A:0,B:0,C:0,O:0}, byCollision: {}, byHour: {} };
      (data || []).forEach(r => {
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
          out.byCollision[r.dim_value] = (out.byCollision[r.dim_value] || 0) + total;
        } else if (r.dimension === 'hour') {
          out.byHour[r.dim_value] = (out.byHour[r.dim_value] || 0) + total;
        }
      });
      return out;
    } catch (e) {
      console.warn('[DataClient] getAnalysisBreakdown failed (matview missing?):', e.message);
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────
  //  SUPABASE INTERNALS
  // ─────────────────────────────────────────────────────────

  /** Build tier filter params for Supabase */
  _tierFilter(tier, value) {
    const col = CrashLensDataClient.TIER_COLUMNS[tier];
    const params = {};
    if (this.state && tier !== 'federal') {
      params.state = `eq.${this.state}`;
    }
    if (col && value) {
      params[col] = `eq.${value}`;
    }
    return params;
  }

  /** Query dashboard_summary matview */
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
    // road_type bucket filter — same column convention used by mv_hotspots /
    // mv_grants_baseline. When omitted, dashboard_summary returns all buckets
    // and the caller aggregates across them (= "all roads").
    if (filters.roadType) allFilters.road_type = `eq.${filters.roadType}`;

    return this._supabaseQuery('dashboard_summary', {
      filters: allFilters,
      order: 'crash_year.asc',
      limit: 100000,
    });
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

    // Bulk fetch mode (filters.all) — used by CMF/Warrants/CSV export
    if (filters.all) {
      const maxRows = filters.maxRows || 10000;
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

    allFilters.and = `(${andParts.join(',')})`;

    return this._supabaseQuery('crashes', {
      select: 'objectid,x,y,crash_severity,crash_year,collision_type,rte_name,intersection_name',
      filters: allFilters,
      limit: limit,
    });
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
    if (opts.count) headers['Prefer'] = 'count=exact';

    // Range header for pagination
    if (opts.range) {
      headers['Range'] = `${opts.range[0]}-${opts.range[1]}`;
    }

    // Fetch with timeout
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const resp = await fetch(url.toString(), { headers, signal: controller.signal });
      clearTimeout(timer);

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }

      const data = await resp.json();

      // Return with count if requested
      if (opts.count) {
        const contentRange = resp.headers.get('Content-Range');
        const total = contentRange ? parseInt(contentRange.split('/')[1]) || 0 : data.length;
        return { rows: data, count: total };
      }

      return data;
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
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
  async _r2LoadCrashes(tier, value) {
    const path = this._r2Path(tier, value);        // always ends in .parquet
    const url = `${this.r2BaseUrl}/${path}`;

    const resp = await fetch(url);
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
