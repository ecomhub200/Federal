/**
 * CL ai.domainKnowledge (rag) — extracted (name-anchored) 2026-05-17.
 * Round X modular refactor — see modular-prompts/41-v2-ai-domain-knowledge.md
 * + MODULAR_PLAN_PROMPT_41_FIX.md.
 * Responsibility: Domain Knowledge tab — rag.
 * Depends on (script-tag order): ai/ai-mode-toggle; 41b–41f after 41a.
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L74016-L74333) ───
// ============================================================
// VOYAGE AI EMBEDDINGS
// ============================================================

// Get embeddings for text using Voyage AI
async function voyageEmbed(texts, inputType = 'query') {
    // texts can be a single string or array of strings
    const textArray = Array.isArray(texts) ? texts : [texts];

    const response = await fetch(dkState.voyage.endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${dkState.voyage.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: dkState.voyage.model,
            input: textArray,
            input_type: inputType  // 'query' for search, 'document' for indexing
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Voyage API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data.data.map(d => d.embedding);
}

// Embed a single query
async function voyageEmbedQuery(text) {
    const embeddings = await voyageEmbed(text, 'query');
    return embeddings[0];
}

// Embed documents for indexing
async function voyageEmbedDocuments(texts) {
    return await voyageEmbed(texts, 'document');
}

// Test Voyage connection
async function testVoyageConnection() {
    try {
        console.log('[Voyage] Testing connection...');
        const testText = 'Traffic signal warrant requirements';
        const embedding = await voyageEmbedQuery(testText);
        console.log('[Voyage] ✅ Connection successful!');
        console.log('[Voyage] Embedding dimensions:', embedding.length);
        console.log('[Voyage] Sample values:', embedding.slice(0, 5));
        showNotification('Voyage AI connection successful!', 'success');
        return embedding;
    } catch (error) {
        console.error('[Voyage] ❌ Connection failed:', error);
        showNotification('Voyage connection failed: ' + error.message, 'error');
        return null;
    }
}

// ============================================================
// RAG PIPELINE - SEARCH & RETRIEVAL
// ============================================================

// Full RAG search: embed query → search Qdrant → return results
async function ragSearch(query, sourceFilters = [], limit = 10) {
    try {
        // 1. Embed the query
        console.log('[RAG] Embedding query:', query);
        const queryVector = await voyageEmbedQuery(query);

        // 2. Search Qdrant
        console.log('[RAG] Searching Qdrant with filters:', sourceFilters);
        const results = await qdrantSearch(queryVector, sourceFilters, limit);

        // 3. Format results
        const formattedResults = results.map(r => ({
            score: r.score,
            source: r.payload?.source || 'unknown',
            section: r.payload?.section || '',
            title: r.payload?.title || '',
            content: r.payload?.content || '',
            chapter: r.payload?.chapter || '',
            page: r.payload?.page || null,
            metadata: r.payload
        }));

        console.log('[RAG] Found', formattedResults.length, 'results');
        return formattedResults;

    } catch (error) {
        console.error('[RAG] Search failed:', error);
        throw error;
    }
}

// Generate a valid Qdrant point ID (UUID format)
// Qdrant requires IDs to be either unsigned integers or UUIDs
function generateQdrantId(stringId) {
    // If already a valid UUID format, return as-is
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(stringId)) {
        return stringId;
    }
    // Generate a new UUID using crypto API
    return crypto.randomUUID();
}

// Index a document to Qdrant
async function indexDocument(doc) {
    // doc should have: id, content, source, section, title, chapter, page, etc.
    try {
        // 1. Embed the content
        const embeddings = await voyageEmbedDocuments([doc.content]);
        const vector = embeddings[0];

        // 2. Create point with UUID (Qdrant requires UUID or integer IDs)
        const point = {
            id: generateQdrantId(doc.id),
            vector: vector,
            payload: {
                doc_id: doc.id || null,  // Store original string ID for reference
                source: doc.source,
                section: doc.section,
                title: doc.title,
                content: doc.content,
                chapter: doc.chapter || '',
                page: doc.page || null,
                keywords: doc.keywords || [],
                compliance_level: doc.compliance_level || 'guidance',
                indexed_at: new Date().toISOString()
            }
        };

        // 3. Upsert to Qdrant
        await qdrantUpsertPoints([point]);
        console.log('[Index] Document indexed:', doc.section);
        return true;

    } catch (error) {
        console.error('[Index] Failed to index document:', error);
        throw error;
    }
}

// Batch index multiple documents
async function indexDocumentsBatch(docs, batchSize = 10) {
    console.log(`[Index] Indexing ${docs.length} documents in batches of ${batchSize}...`);

    for (let i = 0; i < docs.length; i += batchSize) {
        const batch = docs.slice(i, i + batchSize);

        // Embed all documents in batch
        const contents = batch.map(d => d.content);
        const embeddings = await voyageEmbedDocuments(contents);

        // Create points with UUID IDs (Qdrant requires UUID or integer IDs)
        const points = batch.map((doc, idx) => ({
            id: generateQdrantId(doc.id),
            vector: embeddings[idx],
            payload: {
                doc_id: doc.id || null,  // Store original string ID for reference
                source: doc.source,
                section: doc.section,
                title: doc.title,
                content: doc.content,
                chapter: doc.chapter || '',
                page: doc.page || null,
                keywords: doc.keywords || [],
                compliance_level: doc.compliance_level || 'guidance',
                indexed_at: new Date().toISOString()
            }
        }));

        // Upsert batch
        await qdrantUpsertPoints(points);
        console.log(`[Index] Batch ${Math.floor(i/batchSize) + 1} complete (${i + batch.length}/${docs.length})`);

        // Small delay to avoid rate limits
        if (i + batchSize < docs.length) {
            await new Promise(r => setTimeout(r, 200));
        }
    }

    console.log('[Index] ✅ All documents indexed!');
    showNotification(`Indexed ${docs.length} documents`, 'success');
}

// Test the full RAG pipeline
async function testRAGPipeline() {
    try {
        console.log('[RAG] Testing full pipeline...');

        // 1. Test Voyage
        console.log('[RAG] Step 1: Testing Voyage embeddings...');
        const embedding = await testVoyageConnection();
        if (!embedding) throw new Error('Voyage test failed');

        // 2. Test Qdrant
        console.log('[RAG] Step 2: Testing Qdrant connection...');
        await testQdrantConnection();

        // 3. Check if collection exists and has data
        const info = await qdrantGetCollectionInfo();
        if (info) {
            console.log('[RAG] Collection has', info.points_count, 'points');
        } else {
            console.log('[RAG] Collection does not exist. Creating...');
            await qdrantCreateCollection(dkState.voyage.dimensions);
            await qdrantEnsurePayloadIndexes();
        }

        // 4. Test search (will return empty if no documents indexed)
        console.log('[RAG] Step 3: Testing search...');
        const results = await ragSearch('traffic signal warrant crash experience', [], 5);
        console.log('[RAG] Search returned', results.length, 'results');

        console.log('[RAG] ✅ Pipeline test complete!');
        showNotification('RAG pipeline test complete!', 'success');
        return true;

    } catch (error) {
        console.error('[RAG] ❌ Pipeline test failed:', error);
        showNotification('RAG pipeline test failed: ' + error.message, 'error');
        return false;
    }
}

// Index sample documents for testing
async function indexSampleDocuments() {
    const sampleDocs = [
        {
            id: 'federal_mutcd_4c08_001',
            source: 'federal_mutcd',
            section: '4C.08',
            title: 'Warrant 7, Crash Experience',
            chapter: '4C',
            page: 199,
            compliance_level: 'standard',
            keywords: ['signal warrant', 'crash', 'intersection', 'traffic control'],
            content: `Section 4C.08 Warrant 7, Crash Experience

STANDARD:
The Crash Experience signal warrant shall be applied only after less restrictive remedies have been attempted without success.

GUIDANCE:
The Crash Experience warrant is satisfied when:
A. Adequate trial of alternatives with satisfactory observance and enforcement has failed to reduce the crash frequency; and
B. Five or more reported crashes, of types susceptible to correction by a traffic control signal, have occurred within a 12-month period, each crash involving personal injury or property damage apparently exceeding the applicable requirements for a reportable crash; and
C. For each of any 5 years, the vehicular volumes given in Condition A of Warrant 1 have been met.

OPTION:
If the posted or statutory speed limit or the 85th-percentile speed on the major street exceeds 40 mph, the traffic volumes in Condition C of this warrant may be reduced by 30 percent.`
        },
        {
            id: 'aashto_9_4_2_001',
            source: 'aashto',
            section: '9.4.2',
            title: 'Intersection Sight Distance',
            chapter: '9',
            page: 523,
            compliance_level: 'guidance',
            keywords: ['sight distance', 'intersection', 'geometry', 'design'],
            content: `Section 9.4.2 Intersection Sight Distance

At intersections, drivers must be able to see potentially conflicting vehicles in sufficient time to make appropriate decisions. Intersection sight distance (ISD) is the distance required for a driver to perceive and react to the presence of potentially conflicting vehicles.

For Case B1 (left turn from minor road), the minimum intersection sight distance shall be calculated based on the design speed of the major road:

Design Speed (mph) | ISD (feet)
40                 | 445
45                 | 500
50                 | 555
55                 | 610
60                 | 665

The sight triangle should be kept clear of obstructions that would block a driver's view of potentially conflicting traffic.`
        },
        {
            id: 'vdot_6_3_1_001',
            source: 'vdot',
            section: '6.3.1',
            title: 'Intersection Sight Distance Requirements',
            chapter: '6',
            page: 112,
            compliance_level: 'standard',
            keywords: ['sight distance', 'intersection', 'Virginia', 'design'],
            content: `Section 6.3.1 Intersection Sight Distance Requirements

In Virginia, intersection sight distance requirements follow AASHTO guidelines with the following modifications:

1. For locations with documented sight distance-related crash history, ISD may be increased by 20% above AASHTO minimums.

2. At signalized intersections, sight distance for right-turn-on-red movements shall be provided in accordance with Section 6.3.4.

3. For new intersection designs, the minimum clear sight triangle shall be calculated using the 85th percentile operating speed, not the posted speed limit.

VDOT Form LD-440 shall be used to document sight distance measurements for all intersection improvement projects.`
        }
    ];

    console.log('[Index] Indexing sample documents for testing...');

    // First ensure collection exists with proper indexes
    const info = await qdrantGetCollectionInfo();
    if (!info) {
        console.log('[Index] Creating collection first...');
        await qdrantCreateCollection(dkState.voyage.dimensions);
        await qdrantEnsurePayloadIndexes();
    } else {
        // Collection exists, ensure indexes are present
        await qdrantEnsurePayloadIndexes();
    }

    await indexDocumentsBatch(sampleDocs);
    return sampleDocs.length;
}

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {}; CL.ai = CL.ai || {};
  CL.ai.domainKnowledge = CL.ai.domainKnowledge || {};
  window.voyageEmbed = voyageEmbed; CL.ai.domainKnowledge.voyageEmbed = voyageEmbed;
  window.voyageEmbedQuery = voyageEmbedQuery; CL.ai.domainKnowledge.voyageEmbedQuery = voyageEmbedQuery;
  window.voyageEmbedDocuments = voyageEmbedDocuments; CL.ai.domainKnowledge.voyageEmbedDocuments = voyageEmbedDocuments;
  window.testVoyageConnection = testVoyageConnection; CL.ai.domainKnowledge.testVoyageConnection = testVoyageConnection;
  window.ragSearch = ragSearch; CL.ai.domainKnowledge.ragSearch = ragSearch;
  window.generateQdrantId = generateQdrantId; CL.ai.domainKnowledge.generateQdrantId = generateQdrantId;
  window.indexDocument = indexDocument; CL.ai.domainKnowledge.indexDocument = indexDocument;
  window.indexDocumentsBatch = indexDocumentsBatch; CL.ai.domainKnowledge.indexDocumentsBatch = indexDocumentsBatch;
  window.testRAGPipeline = testRAGPipeline; CL.ai.domainKnowledge.testRAGPipeline = testRAGPipeline;
  window.indexSampleDocuments = indexSampleDocuments; CL.ai.domainKnowledge.indexSampleDocuments = indexSampleDocuments;
  CL._registerModule('ai/ai-domain-knowledge-rag');
})();
