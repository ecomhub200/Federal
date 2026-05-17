/**
 * CL ai.domainKnowledge (core) — extracted (name-anchored) 2026-05-17.
 * Round X modular refactor — see modular-prompts/41-v2-ai-domain-knowledge.md
 * + MODULAR_PLAN_PROMPT_41_FIX.md.
 * Responsibility: Domain Knowledge tab — core (state + init + Qdrant).
 * Depends on (script-tag order): ai/ai-mode-toggle; 41b–41f after 41a.
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L75086-L75456) ───
// ============================================================
// DOMAIN KNOWLEDGE STATE
// ============================================================

const dkState = {
    // Location (mirrors cmfState pattern)
    selectedLocation: null,
    locationCrashes: [],
    filteredCrashes: [],
    crashProfile: null,

    // Date filtering
    dateRange: { start: null, end: null },

    // Polygon selection
    polygonSelection: null,
    polygonCrashes: [],

    // Knowledge sources - user selects which to query.
    // Round 14 §6 — registry now includes Delaware sources. The visible bar
    // is rendered state-aware by renderDomainKnowledgeSources(); this registry
    // catalogs every known source so syncDKSourcesFromUI() can iterate.
    enabledSources: ['fed_mutcd', 'aashto', 'hsm'],
    sources: {
        // Federal / national
        fed_mutcd:     { db: 'qdrant',   name: 'Federal MUTCD',         icon: '🇺🇸', category: 'federal' },
        federal_mutcd: { db: 'qdrant',   name: 'Federal MUTCD (alias)', icon: '🇺🇸', category: 'federal' },
        aashto:        { db: 'qdrant',   name: 'AASHTO Green Book',     icon: '📗', category: 'federal' },
        hsm:           { db: 'qdrant',   name: 'Highway Safety Manual', icon: '📕', category: 'federal' },
        ada:           { db: 'qdrant',   name: 'ADA Guidelines',        icon: '♿', category: 'federal' },
        // State catalogs (rendered only for matching active state)
        va_mutcd:      { db: 'pinecone', name: 'Virginia MUTCD',        icon: '🦃', category: 'virginia' },
        vdot:          { db: 'qdrant',   name: 'VDOT Road Design',      icon: '🛣️', category: 'virginia' },
        henrico:       { db: 'qdrant',   name: 'Henrico Standards',     icon: '🌳', category: 'virginia' },
        de_mutcd:      { db: 'qdrant',   name: 'Delaware MUTCD',        icon: '🦋', category: 'delaware' },
        deldot:        { db: 'qdrant',   name: 'DelDOT Standards',      icon: '🛣️', category: 'delaware' },
    },

    // Qdrant configuration
    qdrant: {
        endpoint: 'https://b6241048-2ec5-4e12-94ee-ceecd2e68b75.us-east4-0.gcp.cloud.qdrant.io:6333',
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.kSewQz40hEUchM9wWeT6cKisE2DhjkRUtkquJaGxGsc',
        collectionName: 'traffic-standards',
        initialized: false,
        // Proxy configuration for CORS workaround
        useProxy: null,  // Auto-detect: null = auto, true = force proxy, false = direct
        proxyEndpoint: '/api/qdrant-proxy'
    },

    // Voyage AI configuration (for embeddings)
    voyage: {
        apiKey: 'pa-CM9De6UDPvWp3dIENWFfpPFpJX5s1extMj1gEt8jRtN',
        model: 'voyage-3',
        dimensions: 1024,
        endpoint: 'https://api.voyageai.com/v1/embeddings'
    },

    // Chat state
    messages: [],
    isLoading: false,

    // Reference panel
    activeReference: null,
    highlightedText: null,
    referenceSources: [],  // Sources used in current response

    // Street view
    streetViewProvider: 'mapillary',  // 'mapillary' | 'mapbox'
    streetViewDirection: 'north',
    streetViewCoords: null,

    // Initialization
    initialized: false
};

// ============================================================
// DOMAIN KNOWLEDGE FUNCTIONS
// ============================================================

// Initialize Domain Knowledge tab
function initDomainKnowledge() {
    // Aggregate tiers have no row-level R2 data. Render the empty-state so
    // domain extraction doesn't run on stale county-tier sampleRows.
    try {
        const _tabTier = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext.viewTier) || 'county';
        if (new Set(['federal','state','region','mpo','planning_district']).has(_tabTier)) {
            const _container = document.getElementById('tab-domain-knowledge');
            if (_container) {
                _container.innerHTML = '<div style="padding:2rem;text-align:center;color:#475569">' +
                    '<div style="font-size:2rem;margin-bottom:.5rem">📍</div>' +
                    '<div style="font-weight:600;margin-bottom:.25rem">Pick a county or city to see this analysis</div>' +
                    '<div style="font-size:.85rem;color:#94a3b8">This tab needs row-level crash data, which is only available at county and city tiers right now. Aggregate matviews for ' + _tabTier + ' are on the backend roadmap.</div>' +
                    '</div>';
            }
            return;
        }
    } catch (e) { /* non-fatal — fall through to normal init */ }

    if (dkState.initialized) return;

    // Round 19 §6 — refresh the corpus-pending counter once the tab loads.
    try { if (typeof loadCorpusCounts === 'function') loadCorpusCounts(); } catch (e) { /* non-fatal */ }

    // Initialize Location Type Selector (if not already created)
    const typeSelector = document.getElementById('dkLocationTypeSelector');
    if (typeSelector && !typeSelector.hasChildNodes()) {
        createLocationTypeSelector('dkLocationTypeSelector', 'dkLocationType', 'updateDKLocationDropdown()', 'all');
    }

    // Populate location dropdown from crashState
    populateDKLocationDropdown();

    // Round 14 §6 — render the source filter bar state-aware (federal +
    // matching state catalog), then sync. State-agnostic: STATE_CATALOG is
    // a lookup keyed on the state, never a `state ===` branch.
    if (typeof renderDomainKnowledgeSources === 'function') {
        renderDomainKnowledgeSources();
    }

    // Sync enabled sources from checkboxes
    syncDKSourcesFromUI();

    // Initialize Qdrant connection
    initQdrantConnection();

    dkState.initialized = true;
    console.log('[DK] Domain Knowledge tab initialized');
}

// ============================================================
// QDRANT INTEGRATION
// ============================================================

// Helper: Determine if we should use the proxy (for CORS workaround)
function shouldUseQdrantProxy() {
    // If explicitly set, use that value
    if (dkState.qdrant.useProxy !== null) {
        return dkState.qdrant.useProxy;
    }
    // Auto-detect: Use proxy on Netlify or GitHub Pages (where CORS is an issue)
    const hostname = window.location.hostname;
    return hostname.includes('netlify.app') ||
           hostname.includes('github.io') ||
           hostname.includes('vercel.app') ||
           hostname.includes('aicreatesai.com');  // Custom domain on Netlify
}

// Helper: Make a Qdrant API request (with proxy support)
async function qdrantFetch(path, options = {}) {
    const useProxy = shouldUseQdrantProxy();
    let url, headers;

    if (useProxy) {
        // Use Netlify Function proxy
        url = `${dkState.qdrant.proxyEndpoint}?path=${encodeURIComponent(path)}`;
        headers = {
            'Content-Type': 'application/json'
        };
        console.log('[Qdrant] Using proxy for:', path);
    } else {
        // Direct API call (local development or when CORS is not an issue)
        url = `${dkState.qdrant.endpoint}${path}`;
        headers = {
            'api-key': dkState.qdrant.apiKey,
            'Content-Type': 'application/json'
        };
    }

    const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...options.headers }
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
            errorData = JSON.parse(errorText);
        } catch {
            errorData = { message: errorText };
        }
        throw new Error(`Qdrant API error (${response.status}): ${JSON.stringify(errorData)}`);
    }

    return response.json();
}

// Initialize Qdrant connection and verify collection
async function initQdrantConnection() {
    if (dkState.qdrant.initialized) return;

    const useProxy = shouldUseQdrantProxy();
    console.log('[Qdrant] Initializing... Mode:', useProxy ? 'Proxy' : 'Direct');

    // Round 21 §4 — On hosts without the Netlify/Coolify proxy (GitHub Pages),
    // /api/qdrant-proxy returns a 404 GH-Pages HTML page that the Qdrant client
    // then mis-parses as JSON. Skip the init when the backend isn't there and
    // surface a clear inline banner instead. State-agnostic — keys on the
    // existing _isApiBackendAvailable() probe (no host literal).
    if (useProxy && typeof _isApiBackendAvailable === 'function') {
        try {
            const apiAvailable = await _isApiBackendAvailable();
            if (!apiAvailable) {
                const banner = document.getElementById('dkQdrantUnavailableBanner');
                if (banner) {
                    banner.style.display = 'block';
                    banner.innerHTML = 'ⓘ Qdrant proxy is not deployed on this hosting (GitHub Pages). The Domain Knowledge RAG search relies on Qdrant; on this host the local <strong>Knowledge Corpus</strong> tab provides the same content via Supabase pgvector.';
                }
                console.log('[Qdrant] init skipped — Netlify/Coolify proxy unavailable on this host');
                dkState.qdrant.initialized = true;   // mark so we don't retry per session
                return;
            }
        } catch (e) { /* fall through to the normal init below */ }
    }

    try {
        const collections = await qdrantGetCollections();
        console.log('[Qdrant] Connected. Collections:', collections);

        // Check if our collection exists
        const exists = collections.some(c => c.name === dkState.qdrant.collectionName);
        if (!exists) {
            console.log('[Qdrant] Collection does not exist yet. Will create when documents are indexed.');
        } else {
            console.log('[Qdrant] Collection exists:', dkState.qdrant.collectionName);
            // Ensure payload indexes exist for filtering (source, compliance_level)
            await qdrantEnsurePayloadIndexes();
        }

        dkState.qdrant.initialized = true;
    } catch (error) {
        console.error('[Qdrant] Connection failed:', error);
        const hint = useProxy
            ? 'Ensure Netlify Functions are deployed correctly.'
            : 'CORS blocking detected. Deploy to Netlify for proxy support.';
        console.warn('[Qdrant] Hint:', hint);
        // Don't show notification on init - it's non-critical
    }
}

// Get all collections from Qdrant
async function qdrantGetCollections() {
    const data = await qdrantFetch('/collections', { method: 'GET' });
    return data.result?.collections || [];
}

// Create collection for traffic standards
async function qdrantCreateCollection(vectorSize = 1024) {
    await qdrantFetch(`/collections/${dkState.qdrant.collectionName}`, {
        method: 'PUT',
        body: JSON.stringify({
            vectors: {
                size: vectorSize,
                distance: 'Cosine'
            }
        })
    });
    console.log('[Qdrant] Collection created:', dkState.qdrant.collectionName);
    return true;
}

// Create payload index for filtering (keyword, integer, float, bool, geo, datetime, text)
async function qdrantCreatePayloadIndex(fieldName, fieldType = 'keyword') {
    try {
        await qdrantFetch(`/collections/${dkState.qdrant.collectionName}/index`, {
            method: 'PUT',
            body: JSON.stringify({
                field_name: fieldName,
                field_schema: fieldType
            })
        });
        console.log(`[Qdrant] Created ${fieldType} index for: ${fieldName}`);
        return true;
    } catch (error) {
        // Index may already exist - that's OK
        if (error.message && error.message.includes('already exists')) {
            console.log(`[Qdrant] Index already exists for: ${fieldName}`);
            return true;
        }
        console.warn(`[Qdrant] Failed to create index for ${fieldName}:`, error.message);
        return false;
    }
}

// Ensure all required payload indexes exist for filtering
async function qdrantEnsurePayloadIndexes() {
    console.log('[Qdrant] Ensuring payload indexes exist...');
    // source - required for filtering by document source (aashto, vdot, federal_mutcd, etc.)
    await qdrantCreatePayloadIndex('source', 'keyword');
    // compliance_level - useful for filtering standards vs guidance
    await qdrantCreatePayloadIndex('compliance_level', 'keyword');
    console.log('[Qdrant] Payload indexes verified');
}

// Search Qdrant for similar documents
async function qdrantSearch(queryVector, sourceFilters = [], limit = 10) {
    const body = {
        vector: queryVector,
        limit: limit,
        with_payload: true
    };

    // Add source filter if specified
    if (sourceFilters.length > 0) {
        body.filter = {
            should: sourceFilters.map(source => ({
                key: 'source',
                match: { value: source }
            }))
        };
    }

    const data = await qdrantFetch(`/collections/${dkState.qdrant.collectionName}/points/search`, {
        method: 'POST',
        body: JSON.stringify(body)
    });

    return data.result || [];
}

// Get collection info
async function qdrantGetCollectionInfo() {
    try {
        const data = await qdrantFetch(`/collections/${dkState.qdrant.collectionName}`, { method: 'GET' });
        return data.result;
    } catch {
        return null;  // Collection doesn't exist
    }
}

// Upsert points to Qdrant (for indexing documents)
async function qdrantUpsertPoints(points) {
    await qdrantFetch(`/collections/${dkState.qdrant.collectionName}/points`, {
        method: 'PUT',
        body: JSON.stringify({ points })
    });
    return true;
}

// Test Qdrant connection (callable from console)
async function testQdrantConnection() {
    try {
        const useProxy = shouldUseQdrantProxy();
        console.log('[Qdrant] Testing connection...');
        console.log('[Qdrant] Mode:', useProxy ? 'Proxy (Netlify Function)' : 'Direct API');
        console.log('[Qdrant] Endpoint:', useProxy ? dkState.qdrant.proxyEndpoint : dkState.qdrant.endpoint);

        const collections = await qdrantGetCollections();
        console.log('[Qdrant] ✅ Connection successful!');
        console.log('[Qdrant] Collections:', collections);

        const collectionInfo = await qdrantGetCollectionInfo();
        if (collectionInfo) {
            console.log('[Qdrant] Collection info:', collectionInfo);
        } else {
            console.log('[Qdrant] Collection not found. Ready to create.');
        }

        showNotification('Qdrant connection successful!' + (useProxy ? ' (via proxy)' : ''), 'success');
        return true;
    } catch (error) {
        console.error('[Qdrant] ❌ Connection failed:', error);
        const useProxy = shouldUseQdrantProxy();
        const hint = useProxy
            ? ' Make sure Netlify Functions are deployed.'
            : ' CORS may be blocking. Try deploying to Netlify.';
        showNotification('Qdrant connection failed: ' + error.message + hint, 'error');
        return false;
    }
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {}; CL.ai = CL.ai || {};
  CL.ai.domainKnowledge = CL.ai.domainKnowledge || {};
  window.dkState = dkState; CL.ai.domainKnowledge.dkState = dkState;
  window.initDomainKnowledge = initDomainKnowledge; CL.ai.domainKnowledge.initDomainKnowledge = initDomainKnowledge;
  window.shouldUseQdrantProxy = shouldUseQdrantProxy; CL.ai.domainKnowledge.shouldUseQdrantProxy = shouldUseQdrantProxy;
  window.qdrantFetch = qdrantFetch; CL.ai.domainKnowledge.qdrantFetch = qdrantFetch;
  window.initQdrantConnection = initQdrantConnection; CL.ai.domainKnowledge.initQdrantConnection = initQdrantConnection;
  window.qdrantGetCollections = qdrantGetCollections; CL.ai.domainKnowledge.qdrantGetCollections = qdrantGetCollections;
  window.qdrantCreateCollection = qdrantCreateCollection; CL.ai.domainKnowledge.qdrantCreateCollection = qdrantCreateCollection;
  window.qdrantCreatePayloadIndex = qdrantCreatePayloadIndex; CL.ai.domainKnowledge.qdrantCreatePayloadIndex = qdrantCreatePayloadIndex;
  window.qdrantEnsurePayloadIndexes = qdrantEnsurePayloadIndexes; CL.ai.domainKnowledge.qdrantEnsurePayloadIndexes = qdrantEnsurePayloadIndexes;
  window.qdrantSearch = qdrantSearch; CL.ai.domainKnowledge.qdrantSearch = qdrantSearch;
  window.qdrantGetCollectionInfo = qdrantGetCollectionInfo; CL.ai.domainKnowledge.qdrantGetCollectionInfo = qdrantGetCollectionInfo;
  window.qdrantUpsertPoints = qdrantUpsertPoints; CL.ai.domainKnowledge.qdrantUpsertPoints = qdrantUpsertPoints;
  window.testQdrantConnection = testQdrantConnection; CL.ai.domainKnowledge.testQdrantConnection = testQdrantConnection;
  CL._registerModule('ai/ai-domain-knowledge-core');
})();
