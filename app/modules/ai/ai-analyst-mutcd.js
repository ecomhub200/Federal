/**
 * CL ai.analystMutcd — extracted from app/index.html (name-anchored,
 * live L64206-L64502). navigateTo-split round, prompt 40c2(a).
 * Responsibility: MUTCD AI integration — location dropdown + index loader,
 * MUTCD context builder, Pinecone RAG retrieval + context formatter.
 *
 * Reads shared inline globals: `mutcdState` (declared inline ~L22873,
 * top-level const) — resolved via shared classic-script global lexical
 * env per CLAUDE.md `batch-ba/batch-ba-engine.js` precedent. NOT mirrored.
 *
 * Public API mirrors:
 *   - window.initMUTCDLocationDropdown (called from tab-dispatcher module)
 *   - window.loadMUTCDLocation (HTML onchange)
 *   - window.clearMUTCDLocation (HTML onclick)
 *   - window.loadMUTCDIndex (inline caller L66780)
 *   - window.buildMUTCDContext (inline caller L66440)
 *   - window.queryPineconeRAG (inline callers L65116, L66450)
 *   - window.buildPineconeRAGContext (inline caller L66452)
 *   PINECONE_CONFIG is module-private (no external refs).
 */
(function () {
  'use strict';
  window.CL = window.CL || {};
  CL.ai = CL.ai || {};

  // ─── EXTRACTED CODE START (verbatim from index.html L64206-L64502) ───
// ============================================================
// MUTCD AI INTEGRATION FUNCTIONS
// ============================================================

// Round 13 — universal LocationPicker for the MUTCD AI tab. Until now this
// tab had no location dropdown — users could only pick a location via Map
// or Hot Spots and have it pushed into context. Now they can pick one inline.
function initMUTCDLocationDropdown() {
    if (!window.LocationPicker) return;
    window.LocationPicker.register('mutcdLocationSelect', {
        placeholder: 'All Jurisdiction (no specific location)',
        locationType: null,
        useOptgroups: true,
        showCrashCount: true
    });
}
function loadMUTCDLocation(value) {
    const row = value && window.LocationPicker ? window.LocationPicker.resolveValue(value) : null;
    const ctx = document.getElementById('aiLocationContext');
    if (ctx) {
        if (row) {
            ctx.classList.remove('ghost');
            ctx.innerHTML = '<span style="font-weight:600">📍 ' + row.display_name + '</span>' +
                ' <span style="color:var(--gray);margin-left:.5rem">(' + row.total_crashes + ' crashes)</span>';
        } else {
            ctx.classList.add('ghost');
            ctx.innerHTML = '<span class="ghost-text">Select a location from Map or Hotspots for intersection-specific analysis</span>';
        }
    }
    // Stash for the AI prompt builder to pick up
    window._mutcdSelectedLocation = row;
}
function clearMUTCDLocation() {
    const sel = document.getElementById('mutcdLocationSelect');
    if (sel) sel.value = '';
    loadMUTCDLocation('');
}

// Load MUTCD index files (called on app initialization)
async function loadMUTCDIndex() {
    try {
        // Load the main index and keyword search index
        const [indexRes, keywordRes] = await Promise.all([
            fetch('../data/va_mutcd/index.json'),
            fetch('../data/va_mutcd/keyword_search_index.json')
        ]);

        if (indexRes.ok && keywordRes.ok) {
            mutcdState.index = await indexRes.json();
            mutcdState.keywordIndex = await keywordRes.json();
            mutcdState.loaded = true;
            console.log('[MUTCD] Index loaded successfully - Version', mutcdState.index.version);
        }
    } catch (error) {
        console.warn('[MUTCD] Could not load index files:', error);
    }
}

// Build MUTCD context based on crash profile
function buildMUTCDContext(crashProfile) {
    if (!mutcdState.loaded || !mutcdState.keywordIndex) return null;

    const relevantSections = [];
    const crashMapping = mutcdState.keywordIndex.crash_pattern_mapping;

    // Analyze crash profile to determine relevant MUTCD sections
    if (crashProfile) {
        // Check for angle crashes
        if (crashProfile.anglePercent > 20 || crashProfile.hasAngleCrashes) {
            const angleData = crashMapping.angle_crashes;
            if (angleData) {
                relevantSections.push({
                    pattern: 'Angle/Turning Crashes',
                    sections: angleData.relevant_sections,
                    references: angleData.specific_references,
                    keywords: angleData.keywords
                });
            }
        }

        // Check for pedestrian crashes
        if (crashProfile.pedPercent > 5 || crashProfile.hasPedCrashes) {
            const pedData = crashMapping.pedestrian_crashes;
            if (pedData) {
                relevantSections.push({
                    pattern: 'Pedestrian Crashes',
                    sections: pedData.relevant_sections,
                    references: pedData.specific_references,
                    keywords: pedData.keywords
                });
            }
        }

        // Check for bicycle crashes
        if (crashProfile.bikePercent > 2 || crashProfile.hasBikeCrashes) {
            const bikeData = crashMapping.bicycle_crashes;
            if (bikeData) {
                relevantSections.push({
                    pattern: 'Bicycle Crashes',
                    sections: bikeData.relevant_sections,
                    references: bikeData.specific_references,
                    keywords: bikeData.keywords
                });
            }
        }

        // Check for nighttime crashes
        if (crashProfile.nightPercent > 30 || crashProfile.hasNightCrashes) {
            const nightData = crashMapping.nighttime_crashes;
            if (nightData) {
                relevantSections.push({
                    pattern: 'Nighttime Crashes',
                    sections: nightData.relevant_sections,
                    references: nightData.specific_references,
                    keywords: nightData.keywords
                });
            }
        }

        // Check for speed-related crashes
        if (crashProfile.speedPercent > 10 || crashProfile.hasSpeedCrashes) {
            const speedData = crashMapping.speed_related_crashes;
            if (speedData) {
                relevantSections.push({
                    pattern: 'Speed-Related Crashes',
                    sections: speedData.relevant_sections,
                    references: speedData.specific_references,
                    keywords: speedData.keywords
                });
            }
        }

        // Check for school zone crashes
        if (crashProfile.hasSchoolZone) {
            const schoolData = crashMapping.school_zone_crashes;
            if (schoolData) {
                relevantSections.push({
                    pattern: 'School Zone',
                    sections: schoolData.relevant_sections,
                    references: schoolData.specific_references,
                    keywords: schoolData.keywords
                });
            }
        }

        // Check for rear-end crashes
        if (crashProfile.rearEndPercent > 25) {
            const rearEndData = crashMapping.rear_end_crashes;
            if (rearEndData) {
                relevantSections.push({
                    pattern: 'Rear-End Crashes',
                    sections: rearEndData.relevant_sections,
                    references: rearEndData.specific_references,
                    keywords: rearEndData.keywords
                });
            }
        }

        // Check for curve crashes
        if (crashProfile.hasCurveCrashes) {
            const curveData = crashMapping.curve_crashes;
            if (curveData) {
                relevantSections.push({
                    pattern: 'Curve Crashes',
                    sections: curveData.relevant_sections,
                    references: curveData.specific_references,
                    keywords: curveData.keywords
                });
            }
        }
    }

    return {
        version: mutcdState.version,
        effectiveDate: mutcdState.effectiveDate,
        source: 'Virginia MUTCD for Streets and Highways',
        relevantPatterns: relevantSections,
        signalWarrants: mutcdState.keywordIndex.signal_warrants,
        terminology: mutcdState.keywordIndex.terminology
    };
}

// ============================================================================
// PINECONE RAG - Semantic search for Virginia MUTCD content
// ============================================================================

const PINECONE_CONFIG = {
    apiKey: 'pcsk_2nM7Kz_N4J6XTqVyPS1XwHdR6NbzhB6HPGKpxTsWzw75otHQygEzRbdTfKYvPUhBYRCNW4',
    indexHost: 'https://va-mutcd-h0lxejj.svc.aped-4627-b74a.pinecone.io',
    embeddingModel: 'llama-text-embed-v2',
    topK: 5  // Number of relevant sections to retrieve
};

// Query Pinecone for relevant MUTCD sections using semantic search
async function queryPineconeRAG(query, topK = PINECONE_CONFIG.topK) {
    if (!query || query.trim().length < 3) return null;

    try {
        console.log('[Pinecone RAG] Searching for:', query.substring(0, 100) + '...');

        // Step 1: Create embedding for the query using Pinecone Inference API
        const embedResponse = await fetch('https://api.pinecone.io/embed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': PINECONE_CONFIG.apiKey,
                'X-Pinecone-API-Version': '2024-10'
            },
            body: JSON.stringify({
                model: PINECONE_CONFIG.embeddingModel,
                inputs: [{ text: query }],
                parameters: { input_type: 'query' }
            })
        });

        if (!embedResponse.ok) {
            console.warn('[Pinecone RAG] Embedding failed:', embedResponse.status);
            return null;
        }

        const embedData = await embedResponse.json();
        const queryVector = embedData.data[0].values;

        // Step 2: Query Pinecone index for similar vectors
        const queryResponse = await fetch(`${PINECONE_CONFIG.indexHost}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': PINECONE_CONFIG.apiKey,
                'X-Pinecone-API-Version': '2024-10'
            },
            body: JSON.stringify({
                vector: queryVector,
                topK: topK,
                includeMetadata: true
            })
        });

        if (!queryResponse.ok) {
            console.warn('[Pinecone RAG] Query failed:', queryResponse.status);
            return null;
        }

        const queryData = await queryResponse.json();

        if (!queryData.matches || queryData.matches.length === 0) {
            console.log('[Pinecone RAG] No matches found');
            return null;
        }

        // Step 3: Format results for AI context - INCLUDING actual content
        const results = queryData.matches.map(match => ({
            section: match.metadata.section_number,
            title: match.metadata.section_title,
            chapter: match.metadata.chapter_code,
            part: match.metadata.part_number,
            virginia_specific: match.metadata.virginia_specific,
            relevance: Math.round(match.score * 100) + '%',
            // Include actual MUTCD content text for accurate citations
            content: match.metadata.content_text || ''
        }));

        console.log('[Pinecone RAG] Found', results.length, 'relevant sections with content');
        return results;

    } catch (error) {
        console.warn('[Pinecone RAG] Error:', error.message);
        return null;
    }
}

// Build RAG context string for AI prompt - with ACTUAL MUTCD content
function buildPineconeRAGContext(ragResults) {
    if (!ragResults || ragResults.length === 0) return '';

    let context = '\n\n📚 RELEVANT VIRGINIA MUTCD SECTIONS (from semantic search):\n';
    context += '══════════════════════════════════════════════════════════════\n';
    context += 'IMPORTANT: Use ONLY the exact content below for citations. Do NOT paraphrase or guess.\n\n';

    ragResults.forEach((result, i) => {
        context += `───────────────────────────────────────────────────────────────\n`;
        context += `📖 SECTION ${result.section}: ${result.title}\n`;
        context += `   Chapter ${result.chapter} | Part ${result.part}`;
        if (result.virginia_specific) context += ' | ⚠️ Virginia-specific';
        context += ` | Relevance: ${result.relevance}\n\n`;

        // Include actual MUTCD content
        if (result.content) {
            context += `ACTUAL MUTCD CONTENT:\n${result.content}\n\n`;
        }
    });

    context += '══════════════════════════════════════════════════════════════\n';
    context += 'When citing, use the EXACT text from above. Reference specific paragraphs (01, 02, etc.) as shown.\n';

    return context;
}
  // ─── EXTRACTED CODE END ───

  // Public API — dual exposure (window for HTML onclick=/external module callers,
  // CL.ai.* for in-module consumers). PINECONE_CONFIG stays module-private.
  window.initMUTCDLocationDropdown = initMUTCDLocationDropdown;  CL.ai.initMUTCDLocationDropdown = initMUTCDLocationDropdown;
  window.loadMUTCDLocation = loadMUTCDLocation;                  CL.ai.loadMUTCDLocation = loadMUTCDLocation;
  window.clearMUTCDLocation = clearMUTCDLocation;                CL.ai.clearMUTCDLocation = clearMUTCDLocation;
  window.loadMUTCDIndex = loadMUTCDIndex;                        CL.ai.loadMUTCDIndex = loadMUTCDIndex;
  window.buildMUTCDContext = buildMUTCDContext;                  CL.ai.buildMUTCDContext = buildMUTCDContext;
  window.queryPineconeRAG = queryPineconeRAG;                    CL.ai.queryPineconeRAG = queryPineconeRAG;
  window.buildPineconeRAGContext = buildPineconeRAGContext;      CL.ai.buildPineconeRAGContext = buildPineconeRAGContext;

  CL._registerModule('ai/ai-analyst-mutcd');
})();
