/**
 * CL ai.domainKnowledge (query) — extracted (name-anchored) 2026-05-17.
 * Round X modular refactor — see modular-prompts/41-v2-ai-domain-knowledge.md
 * + MODULAR_PLAN_PROMPT_41_FIX.md.
 * Responsibility: Domain Knowledge tab — query.
 * Depends on (script-tag order): ai/ai-mode-toggle; 41b–41f after 41a.
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L74954-L75292) ───
async function loadCorpusCounts() {
    const el = document.getElementById('corpusPendingCount');
    const banner = document.getElementById('domainKnowledgeEmbedBanner');
    if (el) el.textContent = '…';
    try {
        const dc = window.crashLensClient;
        if (!dc || typeof dc.listPendingCorpusChunks !== 'function') {
            if (el) el.textContent = 'unavailable';
            if (banner) banner.style.display = 'none';
            return;
        }
        const rows = await dc.listPendingCorpusChunks({ limit: 1000 });
        const pendingCount = (rows && rows.length != null) ? rows.length : 0;
        if (el) el.textContent = pendingCount.toLocaleString();
        if (banner) {
            if (pendingCount > 0) {
                // Round 21 §16.7 — when there's nothing to embed against (no
                // OpenAI key in the header), surface that pre-emptively
                // instead of waiting for the user to click Embed and fail.
                const key = (typeof _dkResolveOpenAIKey === 'function') ? _dkResolveOpenAIKey() : null;
                banner.style.display = 'block';
                if (!key) {
                    banner.style.background = '#fef2f2';
                    banner.style.borderLeftColor = '#dc2626';
                    banner.style.color = '#991b1b';
                    banner.innerHTML = `<strong>${pendingCount.toLocaleString()} reference chunks are unembedded</strong> — and no OpenAI API key is configured. Add a key in the header to enable embedding.`;
                } else {
                    banner.style.background = '#fef3c7';
                    banner.style.borderLeftColor = '#d97706';
                    banner.style.color = '#92400e';
                    banner.innerHTML = `<strong>${pendingCount.toLocaleString()} reference chunks are unembedded.</strong>
                        RAG search will return nothing until you embed them.
                        <button onclick="embedPendingCorpus()" class="btn btn-sm btn-primary" style="margin-left:.5rem">📚 Embed now</button>`;
                }
            } else {
                banner.style.display = 'none';
            }
        }
    } catch (e) {
        if (el) el.textContent = '?';
        if (banner) banner.style.display = 'none';
    }
}
window.addEventListener('crashtab:knowledge:shown', loadCorpusCounts);
window.addEventListener('crashtab:cmf:shown', loadCorpusCounts);

async function embedPendingCorpus() {
    const btn = document.getElementById('embedCorpusBtn');
    const resultEl = document.getElementById('corpusEmbedResult');
    if (!resultEl) return;
    const apiKey = _dkResolveOpenAIKey();
    if (!apiKey) {
        resultEl.innerHTML = '<span style="color:#dc2626">⚠️ Configure an OpenAI API key in the header first (used for embeddings).</span>';
        return;
    }
    const dc = window.crashLensClient;
    if (!dc || typeof dc.listPendingCorpusChunks !== 'function' || typeof dc.embedPendingChunks !== 'function') {
        resultEl.innerHTML = '<span style="color:#dc2626">⚠️ Data client missing embed RPCs — refresh and retry.</span>';
        return;
    }

    if (btn) { btn.disabled = true; btn.textContent = '⏳ Embedding…'; }
    resultEl.innerHTML = '<span style="color:#0369a1">Fetching pending chunks…</span>';
    try {
        const pending = await dc.listPendingCorpusChunks({ limit: 500 });
        if (!Array.isArray(pending) || pending.length === 0) {
            resultEl.innerHTML = '<span style="color:#475569">ℹ️ No pending chunks.</span>';
            return;
        }
        const BATCH = 100;
        const embeddings = [];
        for (let i = 0; i < pending.length; i += BATCH) {
            const batch = pending.slice(i, i + BATCH);
            resultEl.innerHTML = `<span style="color:#0369a1">Embedding ${i + 1}–${Math.min(i + BATCH, pending.length)} of ${pending.length}…</span>`;
            const resp = await fetch('https://api.openai.com/v1/embeddings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
                body: JSON.stringify({
                    model: 'text-embedding-3-small',
                    input: batch.map(c => c.chunk_text || '')
                })
            });
            if (!resp.ok) {
                const errText = await resp.text().catch(() => '');
                throw new Error('OpenAI embeddings failed: HTTP ' + resp.status + ' ' + errText.slice(0, 200));
            }
            const data = await resp.json();
            (data.data || []).forEach((d, j) => {
                if (Array.isArray(d.embedding) && batch[j]) {
                    embeddings.push({ id: batch[j].id, embedding: d.embedding });
                }
            });
        }
        if (embeddings.length === 0) {
            resultEl.innerHTML = '<span style="color:#dc2626">⚠️ No embeddings generated.</span>';
            return;
        }
        resultEl.innerHTML = `<span style="color:#0369a1">Submitting ${embeddings.length} embeddings to Supabase…</span>`;
        const submit = await dc.embedPendingChunks(embeddings);
        if (!submit) throw new Error('embed_pending_chunks returned null');
        resultEl.innerHTML = `<span style="color:#065f46;font-weight:600">✅ Submitted ${submit.submitted ?? embeddings.length} • Inserted into corpus: ${submit.inserted ?? '?'}</span>`;
        await loadCorpusCounts();
    } catch (e) {
        const safeMsg = String(e && e.message || e).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
        resultEl.innerHTML = `<span style="color:#dc2626">❌ Failed: ${safeMsg}</span>`;
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = '📚 Embed pending chunks'; }
    }
}

// Round 15 §5 — pgvector helpers for the knowledge_corpus RAG path.
// State-agnostic — knowledge_corpus.state column scopes the search to the
// active jurisdiction; null state matches federal-scope documents.
async function _dkOpenAIEmbed(text) {
    // text-embedding-3-small produces 1536-dim vectors which matches the
    // knowledge_corpus.embedding column. Returns null if the user has no
    // OpenAI key configured.
    try {
        const apiKey = (typeof getStoredOpenAIKey === 'function')
            ? getStoredOpenAIKey()
            : (localStorage.getItem('openaiApiKey') || null);
        if (!apiKey) return null;
        const resp = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
            body: JSON.stringify({ model: 'text-embedding-3-small', input: text })
        });
        if (!resp.ok) return null;
        const j = await resp.json();
        return (j && j.data && j.data[0] && j.data[0].embedding) || null;
    } catch (e) { return null; }
}

async function _dkPgvectorSearch(question, enabledSources, topK) {
    if (!window.crashLensClient || typeof window.crashLensClient.searchKnowledgeCorpus !== 'function') {
        return [];
    }
    const embedding = await _dkOpenAIEmbed(question);
    if (!embedding) return [];
    const stateKey = (window.crashLensClient.state || '').toLowerCase();
    const hits = await window.crashLensClient.searchKnowledgeCorpus({
        embedding,
        state: stateKey,
        sources: (enabledSources && enabledSources.length) ? enabledSources : null,
        topK: topK || 8,
        minSimilarity: 0.5
    });
    if (!Array.isArray(hits)) return [];
    return hits.map(h => ({
        score:    h.similarity,
        source:   h.source,
        section:  h.section || '',
        title:    h.document_title || '',
        content:  h.chunk_text || '',
        chapter:  '',
        page:     h.page || null,
        metadata: h.metadata || {},
        _via:     'pgvector'
    }));
}

// Query knowledge sources (placeholder - will integrate with RAG)
async function queryDKSources(question, context) {
    const sourceNames = context.sourceNames.join(', ');
    const locationInfo = context.location ? `for ${context.location.name}` : '';
    const crashInfo = context.crashProfile ? `(${context.crashProfile.total} crashes)` : '';

    try {
        // 1. Get Qdrant sources (exclude va_mutcd which uses Pinecone)
        const qdrantSources = context.enabledSources.filter(s =>
            dkState.sources[s]?.db === 'qdrant'
        );

        // 2. Search Qdrant for relevant documents
        let ragResults = [];
        if (qdrantSources.length > 0) {
            console.log('[DK] Searching Qdrant for sources:', qdrantSources);
            try {
                ragResults = await ragSearch(question, qdrantSources, 10);
            } catch (qdrantErr) {
                console.warn('[DK] Qdrant search failed (non-fatal):', qdrantErr && qdrantErr.message);
                ragResults = [];
            }
        }
        // Round 15 §5 — pgvector knowledge_corpus search (parallel / fallback).
        // Augments Qdrant results when both are configured; sole source when
        // Qdrant is unavailable. Graceful no-op when corpus is empty (the
        // table currently ships with 0 rows; Round 16 ingest populates it).
        if (typeof _dkPgvectorSearch === 'function') {
            try {
                const pgHits = await _dkPgvectorSearch(question, context.enabledSources, 8);
                if (pgHits && pgHits.length) {
                    console.log('[DK] pgvector knowledge_corpus returned', pgHits.length, 'hits');
                    // Dedupe-merge by (source, section): keep the higher-scored entry
                    const _key = (r) => (r.source || '') + '|' + (r.section || '') + '|' + (r.title || '').slice(0, 30);
                    const merged = new Map();
                    [...ragResults, ...pgHits].forEach(r => {
                        const k = _key(r);
                        if (!merged.has(k) || (merged.get(k).score || 0) < (r.score || 0)) {
                            merged.set(k, r);
                        }
                    });
                    ragResults = [...merged.values()].sort((a, b) => (b.score || 0) - (a.score || 0));
                }
            } catch (pgErr) {
                console.warn('[DK] pgvector search failed (non-fatal):', pgErr && pgErr.message);
            }
        }

        // 3. Also query Pinecone for VA MUTCD if selected (using existing function)
        let pineconeResults = [];
        if (context.enabledSources.includes('va_mutcd')) {
            console.log('[DK] VA MUTCD selected - will use existing Pinecone integration');
            // TODO: Integrate with existing Pinecone MUTCD query
            // For now, we'll include it in the prompt context
        }

        // 4. Build citations from results
        const citations = ragResults.map(r => ({
            source: r.source,
            section: r.section,
            title: r.title,
            text: r.content,
            score: r.score
        }));

        // 5. Build context for AI response
        let retrievedContext = '';
        if (ragResults.length > 0) {
            retrievedContext = '\n\nRELEVANT STANDARDS:\n' + ragResults.map((r, i) =>
                `[${i+1}] ${dkState.sources[r.source]?.name || r.source} - Section ${r.section}: ${r.title}\n${r.content}\n`
            ).join('\n---\n');
        }

        // 6. Generate response using AI
        const systemPrompt = `You are a traffic safety engineering assistant. Answer questions using ONLY the provided source documents.
Always cite sources using the format [SOURCE SECTION] (e.g., [AASHTO 9.4.2]).
If no relevant source is found, say "I could not find specific guidance in the selected standards."
Be precise and quote directly from standards when possible.`;

        const userPrompt = `Question: ${question}

Location context: ${locationInfo} ${crashInfo}
Selected sources: ${sourceNames}
${retrievedContext}

Provide a grounded answer with citations:`;

        let answer = '';

        // Check if we have retrieved content
        if (ragResults.length === 0 && !context.enabledSources.includes('va_mutcd')) {
            answer = `I searched the selected sources (${sourceNames}) but found no indexed documents yet.

To use the RAG system:
1. Open browser console (F12)
2. Run: \`await indexSampleDocuments()\` to add test documents
3. Try your question again

Or the collection may be empty. Run \`await testRAGPipeline()\` to verify the setup.`;
        } else if (ragResults.length > 0) {
            // Try to get AI response
            try {
                const apiKey = getActiveApiKey();
                if (apiKey) {
                    answer = await callClaudeSimple(apiKey, systemPrompt, userPrompt);
                } else {
                    // No API key - provide manual summary
                    answer = `Based on the retrieved documents ${locationInfo}:\n\n`;
                    ragResults.slice(0, 3).forEach((r, i) => {
                        answer += `**${dkState.sources[r.source]?.name || r.source} ${r.section}** - ${r.title}\n`;
                        answer += `> "${r.content.substring(0, 300)}..."\n\n`;
                    });
                    answer += `\n📎 Sources: ${ragResults.map(r => `[${r.source.toUpperCase()} ${r.section}]`).join(' ')}`;
                }
            } catch (aiError) {
                console.error('[DK] AI call failed:', aiError);
                // Fallback to showing retrieved content
                answer = `Found ${ragResults.length} relevant sections ${locationInfo}:\n\n`;
                ragResults.slice(0, 3).forEach((r, i) => {
                    answer += `**${dkState.sources[r.source]?.name || r.source} ${r.section}** - ${r.title}\n`;
                    answer += `> "${r.content.substring(0, 300)}..."\n\n`;
                });
            }
        } else {
            answer = `Searching selected sources (${sourceNames}) ${locationInfo}...\n\nNo Qdrant results found. VA MUTCD via Pinecone may have results - full integration pending.`;
        }

        return { answer, citations };

    } catch (error) {
        console.error('[DK] Query failed:', error);
        return {
            answer: `Error querying sources: ${error.message}\n\nTry running \`await testRAGPipeline()\` in the console to diagnose.`,
            citations: []
        };
    }
}

// Simple Claude call for DK responses
async function callClaudeSimple(apiKey, systemPrompt, userMessage) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1500,
            system: systemPrompt,
            messages: [{ role: 'user', content: userMessage }]
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Claude API error');
    }

    const data = await response.json();
    return data.content[0].text;
}

// Get active API key from header
function getActiveApiKey() {
    // Try to get from existing AI state or header
    const headerInput = document.getElementById('apiKeyInput');
    if (headerInput && headerInput.value) {
        return headerInput.value;
    }
    // Check localStorage
    const stored = localStorage.getItem('anthropicApiKey');
    if (stored) return stored;
    return null;
}

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {}; CL.ai = CL.ai || {};
  CL.ai.domainKnowledge = CL.ai.domainKnowledge || {};
  window.loadCorpusCounts = loadCorpusCounts; CL.ai.domainKnowledge.loadCorpusCounts = loadCorpusCounts;
  window.embedPendingCorpus = embedPendingCorpus; CL.ai.domainKnowledge.embedPendingCorpus = embedPendingCorpus;
  window._dkOpenAIEmbed = _dkOpenAIEmbed; CL.ai.domainKnowledge._dkOpenAIEmbed = _dkOpenAIEmbed;
  window._dkPgvectorSearch = _dkPgvectorSearch; CL.ai.domainKnowledge._dkPgvectorSearch = _dkPgvectorSearch;
  window.queryDKSources = queryDKSources; CL.ai.domainKnowledge.queryDKSources = queryDKSources;
  window.callClaudeSimple = callClaudeSimple; CL.ai.domainKnowledge.callClaudeSimple = callClaudeSimple;
  window.getActiveApiKey = getActiveApiKey; CL.ai.domainKnowledge.getActiveApiKey = getActiveApiKey;
  CL._registerModule('ai/ai-domain-knowledge-query');
})();
