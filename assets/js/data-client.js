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
    timeout:      15000,   // 15s for Supabase, then fallback
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
   * @param {object} filters - { yearFrom, yearTo, severity, fc, areaType }
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
   * @param {object} filters - { year, severity, route, page }
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
    const body = {
      p_state:    this.state,
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

    return this._supabaseQuery('dashboard_summary', {
      filters: allFilters,
      order: 'crash_year.asc',
      limit: 100000,
    });
  }

  /** Query crashes table with pagination */
  async _supabaseCrashes(tier, value, filters) {
    const tierFilters = this._tierFilter(tier, value);
    const allFilters = { ...tierFilters };
    const page = filters.page || 1;

    if (filters.year) allFilters.crash_year = `eq.${filters.year}`;
    if (filters.severity) allFilters.crash_severity = `eq.${filters.severity}`;
    if (filters.route) allFilters.rte_name = `eq.${filters.route}`;

    const rangeStart = (page - 1) * this.pageSize;
    const rangeEnd = rangeStart + this.pageSize - 1;

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

  /** Load parquet from R2 — delegates to existing hyparquet loader */
  async _r2LoadCrashes(tier, value) {
    const path = this._r2Path(tier, value);
    const url = `${this.r2BaseUrl}/${path}`;

    // Use existing parquet loader if available
    if (typeof window !== 'undefined' && window.loadParquetFromUrl) {
      return window.loadParquetFromUrl(url);
    }

    // Fallback: fetch as CSV (legacy support)
    const csvUrl = url.replace('.parquet', '.csv');
    const resp = await fetch(csvUrl);
    if (!resp.ok) throw new Error(`R2 load failed: ${resp.status}`);
    const text = await resp.text();
    return this._parseCSV(text);
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

  /** Filter loaded rows with pagination */
  _filterLocally(rows, filters) {
    let filtered = rows;
    if (filters.year)     filtered = filtered.filter(r => r['Crash Year'] == filters.year);
    if (filters.severity) filtered = filtered.filter(r => r['Crash Severity'] === filters.severity);
    if (filters.route)    filtered = filtered.filter(r => r['RTE Name'] === filters.route);

    const page = filters.page || 1;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    return {
      rows: filtered.slice(start, end),
      total: filtered.length,
      page: page,
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
