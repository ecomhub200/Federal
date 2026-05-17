/**
 * CL ai.domainKnowledge (sources) — extracted (name-anchored) 2026-05-17.
 * Round X modular refactor — see modular-prompts/41-v2-ai-domain-knowledge.md
 * + MODULAR_PLAN_PROMPT_41_FIX.md.
 * Responsibility: Domain Knowledge tab — sources.
 * Depends on (script-tag order): ai/ai-mode-toggle; 41b–41f after 41a.
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L74710-L74953) ───
// Toggle knowledge source
/**
 * Round 14 §6 — render the Domain Knowledge source-filter bar so each state
 * sees its own canonical sources alongside the always-on federal/national
 * sources. Adding a new state means INSERTing into STATE_CATALOG, never
 * branching on `state === 'foo'`. State-agnostic.
 */
function renderDomainKnowledgeSources() {
    const container = document.getElementById('dkSourceFilters');
    if (!container) return;

    const stateKey = (window.crashLensClient && window.crashLensClient.state)
        ? String(window.crashLensClient.state).toLowerCase() : '';

    const FEDERAL = [
        { id: 'fed_mutcd', label: '🇺🇸 Federal MUTCD',  default: true,  group: 'Federal' },
        { id: 'aashto',    label: '📗 AASHTO',          default: true,  group: 'Federal' },
        { id: 'hsm',       label: '📕 HSM',             default: true,  group: 'Federal' },
        { id: 'ada',       label: '♿ ADA',              default: false, group: 'Federal' },
    ];
    const STATE_CATALOG = {
        delaware: [
            { id: 'de_mutcd', label: '🦋 DE MUTCD', default: true,  group: 'State' },
            { id: 'deldot',   label: '🛣️ DelDOT',   default: true,  group: 'State' },
        ],
        virginia: [
            { id: 'va_mutcd', label: '🦃 VA MUTCD', default: true,  group: 'State' },
            { id: 'vdot',     label: '🛣️ VDOT',     default: true,  group: 'State' },
            { id: 'henrico',  label: '🌳 Henrico',  default: false, group: 'County' },
        ],
        // Add new states with an INSERT here — no code branching.
    };
    const stateSources = STATE_CATALOG[stateKey] || [];
    const all = [...FEDERAL, ...stateSources];

    const groups = {};
    for (const s of all) {
        if (!groups[s.group]) groups[s.group] = [];
        groups[s.group].push(s);
    }

    const escapeHtml = (str) => String(str == null ? '' : str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    let html = '<span style="font-weight:600;color:#92400e;font-size:.85rem">📚 Sources:</span>';
    for (const groupName of Object.keys(groups)) {
        html += '<div style="display:flex;align-items:center;gap:.5rem;padding:.25rem .5rem;background:rgba(255,255,255,0.7);border-radius:var(--radius)">';
        html += '<span style="font-size:.75rem;color:#92400e;font-weight:500">' + escapeHtml(groupName) + '</span>';
        for (const s of groups[groupName]) {
            const checked = s.default ? 'checked' : '';
            html += '<label class="dk-source-toggle" title="' + escapeHtml(s.label) + '">'
                  + '<input type="checkbox" id="dkSrc_' + escapeHtml(s.id) + '" data-source="' + escapeHtml(s.id) + '" ' + checked
                  + ' onchange="toggleDKSource(\'' + escapeHtml(s.id) + '\')">'
                  + '<span>' + escapeHtml(s.label) + '</span>'
                  + '</label>';
        }
        html += '</div>';
    }
    html += '<button class="btn-soft btn-soft-warning btn-soft-sm" onclick="autoSelectDKSources()" title="Auto-select based on crash profile" style="margin-left:auto">🎯 Auto</button>';
    container.innerHTML = html;
}

function toggleDKSource(sourceId) {
    const checkbox = document.getElementById(`dkSrc_${sourceId}`);
    if (!checkbox) return;
    if (checkbox.checked) {
        if (!dkState.enabledSources.includes(sourceId)) {
            dkState.enabledSources.push(sourceId);
        }
    } else {
        dkState.enabledSources = dkState.enabledSources.filter(s => s !== sourceId);
    }
    console.log('[DK] Enabled sources:', dkState.enabledSources);
}

// Sync sources from UI
function syncDKSourcesFromUI() {
    dkState.enabledSources = [];
    Object.keys(dkState.sources).forEach(sourceId => {
        const checkbox = document.getElementById(`dkSrc_${sourceId}`);
        if (checkbox && checkbox.checked) {
            dkState.enabledSources.push(sourceId);
        }
    });
}

// Auto-select sources based on crash profile
function autoSelectDKSources() {
    if (!dkState.crashProfile) {
        showNotification('Select a location first', 'warning');
        return;
    }

    // Reset all
    Object.keys(dkState.sources).forEach(sourceId => {
        const checkbox = document.getElementById(`dkSrc_${sourceId}`);
        if (checkbox) checkbox.checked = false;
    });

    // Round 14 §6 — defensive: each `dkSrc_*` element only exists when the
    // active state catalog rendered it. Skip missing ones silently rather
    // than crashing for jurisdictions that don't have e.g. `dkSrc_vdot`.
    const _dkCheck = (id) => {
        const el = document.getElementById(id);
        if (el) el.checked = true;
    };
    // Always enable AASHTO + Federal MUTCD as the universal defaults.
    _dkCheck('dkSrc_aashto');
    _dkCheck('dkSrc_fed_mutcd');
    _dkCheck('dkSrc_hsm');
    // State-specific MUTCDs (only one will exist per active state)
    _dkCheck('dkSrc_va_mutcd');
    _dkCheck('dkSrc_de_mutcd');

    // Enable based on crash profile
    const profile = dkState.crashProfile;

    // Pedestrian crashes - enable ADA
    if (parseFloat(profile.pedPercent) > 5) {
        _dkCheck('dkSrc_ada');
    }

    // Enable state DOT manuals for geometric issues
    if (profile.collisionTypes && (profile.collisionTypes['Angle'] > 3 || profile.collisionTypes['Rear End'] > 5)) {
        _dkCheck('dkSrc_vdot');
        _dkCheck('dkSrc_deldot');
    }

    // Sync state
    syncDKSourcesFromUI();
    showNotification('Sources auto-selected based on crash profile', 'success');
}

// Select from map
function selectDKFromMap() {
    showNotification('Map selection: Navigate to Map tab, select a location, then return here', 'info');
    // Could integrate with map selection state
}

// Enable polygon mode
function enableDKPolygonMode() {
    showNotification('Polygon selection: Coming soon - draw an area to analyze multiple locations', 'info');
}

// Clear chat
function clearDKChat() {
    dkState.messages = [];
    document.getElementById('dkChatMessages').innerHTML = `
        <div class="dk-message dk-message-assistant">
            <div class="dk-message-content">
                <p>👋 Chat cleared. Ask a new question about standards.</p>
            </div>
        </div>
    `;
    document.getElementById('dkSourceContent').innerHTML = '<p style="color:#9ca3af;text-align:center">Click a citation in the chat to view the full source text here.</p>';
    document.getElementById('dkOtherSources').style.display = 'none';
}

// Ask a suggested question
function askDKSuggestion(button) {
    const question = button.textContent;
    document.getElementById('dkChatInput').value = question;
    askDKQuestion();
}

// Ask question (main function)
async function askDKQuestion() {
    const input = document.getElementById('dkChatInput');
    const question = input.value.trim();

    if (!question) {
        showNotification('Please enter a question', 'warning');
        return;
    }

    if (dkState.enabledSources.length === 0) {
        showNotification('Please select at least one knowledge source', 'warning');
        return;
    }

    // Add user message to chat
    addDKMessage('user', question);
    input.value = '';

    // Show loading
    dkState.isLoading = true;
    document.getElementById('dkAskBtnText').textContent = '...';
    document.getElementById('dkAskBtn').disabled = true;

    try {
        // Build context
        const context = buildDKContext(question);

        // Query knowledge sources
        const response = await queryDKSources(question, context);

        // Add assistant message
        addDKMessage('assistant', response.answer, response.citations);

        // Update sources panel
        updateDKSourcesPanel(response.citations);

    } catch (error) {
        console.error('[DK] Error:', error);
        addDKMessage('assistant', `Sorry, I encountered an error: ${error.message}. Please try again.`);
    } finally {
        dkState.isLoading = false;
        document.getElementById('dkAskBtnText').textContent = 'Ask';
        document.getElementById('dkAskBtn').disabled = false;
    }
}

// Build context for query
function buildDKContext(question) {
    const context = {
        question,
        location: dkState.selectedLocation,
        crashProfile: dkState.crashProfile,
        enabledSources: dkState.enabledSources,
        sourceNames: dkState.enabledSources.map(s => dkState.sources[s]?.name || s)
    };

    return context;
}

// ─────────────────────────────────────────────────────────
// Round 19 §6 — Knowledge corpus embedding workflow.
// Reads pending chunks → batched OpenAI embeddings → embed_pending_chunks RPC.
// State-agnostic: the RPC keys on the row's existing state column. After this
// runs once, the 12 starter chunks (MUTCD Warrants, AASHTO SSD, HSM EB/CMF,
// DelDOT edge-lines / speed studies) become searchable via pgvector.
// ─────────────────────────────────────────────────────────
function _dkResolveOpenAIKey() {
    try {
        if (typeof getStoredOpenAIKey === 'function') {
            const k = getStoredOpenAIKey();
            if (k) return k;
        }
    } catch (e) { /* ignore */ }
    return (typeof localStorage !== 'undefined' ? localStorage.getItem('openaiApiKey') : null)
        || (typeof localStorage !== 'undefined' ? localStorage.getItem('ad_openai_key') : null)
        || null;
}

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {}; CL.ai = CL.ai || {};
  CL.ai.domainKnowledge = CL.ai.domainKnowledge || {};
  window.renderDomainKnowledgeSources = renderDomainKnowledgeSources; CL.ai.domainKnowledge.renderDomainKnowledgeSources = renderDomainKnowledgeSources;
  window.toggleDKSource = toggleDKSource; CL.ai.domainKnowledge.toggleDKSource = toggleDKSource;
  window.syncDKSourcesFromUI = syncDKSourcesFromUI; CL.ai.domainKnowledge.syncDKSourcesFromUI = syncDKSourcesFromUI;
  window.autoSelectDKSources = autoSelectDKSources; CL.ai.domainKnowledge.autoSelectDKSources = autoSelectDKSources;
  window.selectDKFromMap = selectDKFromMap; CL.ai.domainKnowledge.selectDKFromMap = selectDKFromMap;
  window.enableDKPolygonMode = enableDKPolygonMode; CL.ai.domainKnowledge.enableDKPolygonMode = enableDKPolygonMode;
  window.clearDKChat = clearDKChat; CL.ai.domainKnowledge.clearDKChat = clearDKChat;
  window.askDKSuggestion = askDKSuggestion; CL.ai.domainKnowledge.askDKSuggestion = askDKSuggestion;
  window.askDKQuestion = askDKQuestion; CL.ai.domainKnowledge.askDKQuestion = askDKQuestion;
  window.buildDKContext = buildDKContext; CL.ai.domainKnowledge.buildDKContext = buildDKContext;
  window._dkResolveOpenAIKey = _dkResolveOpenAIKey; CL.ai.domainKnowledge._dkResolveOpenAIKey = _dkResolveOpenAIKey;
  CL._registerModule('ai/ai-domain-knowledge-sources');
})();
