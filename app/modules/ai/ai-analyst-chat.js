/**
 * CL ai.analystChat — extracted from app/index.html (name-anchored,
 * live L64205-L64482). navigateTo-split round, prompt 40c1.
 * Responsibility: AI Analyst chat — state (aiState), attachments, message
 * render, suggestions, API-key loader, crash-data context builder.
 * Owns `aiState` (mirrored to window.aiState + CL.ai.aiState for the
 * other 40c modules and any remaining inline reader).
 */
(function () {
  'use strict';
  window.CL = window.CL || {};
  CL.ai = CL.ai || {};

  // ─── EXTRACTED CODE START (verbatim from index.html L64205-L64482) ───

const aiState = {
    messages: [],
    attachments: [],
    conversationHistory: []
};

function loadSavedKey() {
    // Use header provider
    const headerProvider = document.getElementById('headerAIProvider');
    const provider = headerProvider ? headerProvider.value : 'claude';

    // Use security manager to get key (handles both session and local storage)
    // Defensive check: ApiKeySecurity may not be defined if main script failed
    let savedKey = null;
    if (typeof ApiKeySecurity !== 'undefined' && ApiKeySecurity.getKey) {
        savedKey = ApiKeySecurity.getKey(provider);
    } else {
        // Fallback: try localStorage directly
        const legacyKeys = {
            'claude': 'crashAI_key_claude',
            'gemini': 'crashAI_key_gemini',
            'openai': 'crashAI_key_openai'
        };
        const storageKey = legacyKeys[provider] || 'crashAI_key_claude';
        try {
            savedKey = localStorage.getItem(storageKey);
        } catch (e) {
            console.warn('[loadSavedKey] Could not access localStorage:', e);
        }
    }

    if (savedKey) {
        // Sync with header API key field
        const headerKey = document.getElementById('headerApiKey');
        if (headerKey) headerKey.value = savedKey;
    }
}

function handleAIFileSelect(event) {
    const files = event.target.files;
    for (const file of files) {
        if (aiState.attachments.length >= 5) {
            alert('Maximum 5 attachments allowed');
            break;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const attachment = {
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result
            };

            // For images, create thumbnail
            if (file.type.startsWith('image/')) {
                attachment.isImage = true;
                attachment.preview = e.target.result;
            }

            aiState.attachments.push(attachment);
            renderAttachments();
        };

        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
    }
    event.target.value = '';
}

function renderAttachments() {
    const container = document.getElementById('aiAttachments');
    container.innerHTML = aiState.attachments.map((att, i) => `
        <div class="ai-attachment">
            ${att.isImage ? `<img src="${att.preview}" alt="${esc(att.name)}">` : '📄'}
            <span>${esc(att.name.substring(0, 20))}${att.name.length > 20 ? '...' : ''}</span>
            <span class="remove" onclick="removeAttachment(${i})">&times;</span>
        </div>
    `).join('');
}

function removeAttachment(index) {
    aiState.attachments.splice(index, 1);
    renderAttachments();
}

function askSuggestion(btn) {
    document.getElementById('aiQuestion').value = btn.dataset.question || btn.textContent;
    askAI();
}

function clearAIChat() {
    aiState.messages = [];
    aiState.conversationHistory = [];
    // Reset reference counters
    const sEl = document.getElementById('aiRefStandard');
    const gEl = document.getElementById('aiRefGuidance');
    const oEl = document.getElementById('aiRefOption');
    if (sEl) sEl.textContent = '0';
    if (gEl) gEl.textContent = '0';
    if (oEl) oEl.textContent = '0';
    document.getElementById('aiChatMessages').innerHTML = `
        <div id="aiLocationContext" class="ai-location-bar ghost">
            <span class="ghost-text">Select a location from Map or Hotspots for intersection-specific analysis</span>
        </div>
        <div id="aiWelcomeScreen" class="ai-welcome-screen">
            <div class="ai-welcome-icon"><span>📘</span></div>
            <h3 class="ai-welcome-heading">MUTCD AI Assistant</h3>
            <p class="ai-welcome-subtitle">Your expert guide to the Manual on Uniform Traffic Control Devices. Ask about signal warrants, signs, markings, and safety standards.</p>
            <div class="ai-welcome-suggestions-label">Prompt Suggestions For You</div>
            <div id="aiWelcomeActions" class="ai-welcome-actions">
                <button class="ai-welcome-card card-signal" onclick="askSuggestion(this)" data-question="Evaluate signal warrant eligibility for this location based on crash data and MUTCD Warrant 7 criteria">
                    <span class="ai-welcome-card-icon">🚦</span>
                    <span class="ai-welcome-card-label">Signal Warrants</span>
                </button>
                <button class="ai-welcome-card card-crash" onclick="askSuggestion(this)" data-question="What are the main crash patterns, severity trends, and contributing factors?">
                    <span class="ai-welcome-card-icon">📊</span>
                    <span class="ai-welcome-card-label">Crash Analysis</span>
                </button>
                <button class="ai-welcome-card card-signs" onclick="askSuggestion(this)" data-question="What are the MUTCD sign and pavement marking requirements for this location? Include regulatory, warning, and guide sign standards.">
                    <span class="ai-welcome-card-icon">🪧</span>
                    <span class="ai-welcome-card-label">Signs & Markings</span>
                </button>
                <button class="ai-welcome-card card-ped" onclick="askSuggestion(this)" data-question="What are the MUTCD crosswalk, pedestrian signal, and bicycle facility requirements? Include ADA accessibility standards.">
                    <span class="ai-welcome-card-icon">🚶</span>
                    <span class="ai-welcome-card-label">Pedestrian & Bike</span>
                </button>
                <button class="ai-welcome-card card-speed" onclick="askSuggestion(this)" data-question="What are the MUTCD requirements for speed limits, school zones, and work zone traffic control?">
                    <span class="ai-welcome-card-icon">⚡</span>
                    <span class="ai-welcome-card-label">Speed & Work Zones</span>
                </button>
                <button class="ai-welcome-card card-deep" onclick="triggerMUTCDAnalysis()" title="Run comprehensive multi-agent MUTCD analysis">
                    <span class="ai-welcome-card-icon">🔬</span>
                    <span class="ai-welcome-card-label">Deep MUTCD Analysis</span>
                </button>
            </div>
            <div id="aiMutcdChips" class="ai-mutcd-chips">
                <button class="ai-mutcd-chip" onclick="askSuggestion(this)" data-question="Summarize MUTCD Part 2 (Signs) requirements relevant to this location, including regulatory, warning, and guide signs">Part 2: Signs</button>
                <button class="ai-mutcd-chip" onclick="askSuggestion(this)" data-question="Summarize MUTCD Part 3 (Markings) requirements relevant to this location, including pavement markings, delineators, and channelization">Part 3: Markings</button>
                <button class="ai-mutcd-chip" onclick="askSuggestion(this)" data-question="Summarize MUTCD Part 4 (Highway Traffic Signals) requirements relevant to this location, including signal warrants, timing, and phasing">Part 4: Signals</button>
                <button class="ai-mutcd-chip" onclick="askSuggestion(this)" data-question="Summarize MUTCD Part 5 (Traffic Control Devices for Low-Volume Roads) requirements relevant to this location">Part 5: Low-Volume</button>
                <button class="ai-mutcd-chip" onclick="askSuggestion(this)" data-question="Summarize MUTCD Part 6 (Temporary Traffic Control) requirements for work zones at this location">Part 6: Work Zones</button>
                <button class="ai-mutcd-chip" onclick="askSuggestion(this)" data-question="Summarize MUTCD Part 9 (Traffic Control for Bicycle Facilities) requirements relevant to this location">Part 9: Bicycle</button>
            </div>
        </div>
    `;
    updateMUTCDAILocationBar();
    const suggChips = document.getElementById('aiSuggestionChips');
    if (suggChips) suggChips.style.display = 'none';
}

function clearApiKey() {
    clearAllApiKeys();
    alert('API key has been cleared from all assistants.');
}

function addMessage(role, content, attachmentPreviews = []) {
    const container = document.getElementById('aiChatMessages');
    const isUser = role === 'user';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const aiDisclaimer = `<div style="margin-top:1rem;padding:.75rem;background:rgba(245,158,11,.08);border-left:3px solid #f59e0b;border-radius:4px;font-size:.75rem;color:#92400e;">
        ⚠️ <strong>AI DISCLAIMER:</strong> This output was generated by Artificial Intelligence. Human review is required to validate and oversee these results.
    </div>`;

    let attachHtml = '';
    if (attachmentPreviews.length > 0) {
        attachHtml = '<div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem">' +
            attachmentPreviews.map(a => a.isImage ?
                `<img src="${a.preview}" style="max-width:100px;max-height:80px;border-radius:4px">` :
                `<span style="padding:.25rem .5rem;background:rgba(0,0,0,.1);border-radius:4px;font-size:.75rem">📄 ${esc(a.name)}</span>`
            ).join('') + '</div>';
    }

    const metaHtml = isUser
        ? `<div class="ai-msg-meta"><span class="ai-msg-time">${timeStr}</span></div>`
        : `<div class="ai-msg-meta"><span class="ai-msg-time">${timeStr}</span><button class="ai-msg-copy" onclick="copyMessageContent(this)">📋 Copy</button></div>`;

    const messageHtml = `
        <div class="ai-message ${isUser ? 'user' : 'assistant'}">
            <div class="ai-avatar">${isUser ? '👤' : '⭐'}</div>
            <div class="ai-bubble">${isUser ? esc(content) + attachHtml : content + aiDisclaimer}${metaHtml}</div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', messageHtml);
    container.scrollTop = container.scrollHeight;

    // Update reference counters after assistant messages
    if (!isUser) updateMUTCDRefCounters();

    // Store message for PDF export
    aiState.messages.push({ role, content });
}

function addTypingIndicator() {
    const container = document.getElementById('aiChatMessages');
    container.insertAdjacentHTML('beforeend', `
        <div class="ai-message assistant" id="aiTyping">
            <div class="ai-avatar">⭐</div>
            <div class="ai-bubble">
                <div class="ai-typing"><span></span><span></span><span></span></div>
            </div>
        </div>
    `);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById('aiTyping');
    if (typing) typing.remove();
}

function buildCrashDataContext() {
    if (!crashState.loaded) return null;

    const agg = crashState.aggregates;
    const sev = agg.bySeverity;
    const years = crashState.years;
    const yearRange = years.length > 0 ? `${years[0]}-${years[years.length-1]}` : 'N/A';

    return {
        summary: {
            totalCrashes: crashState.totalRows,
            yearRange: yearRange,
            yearsAnalyzed: years.length
        },
        severity: {
            fatal_K: sev.K,
            seriousInjury_A: sev.A,
            minorInjury_B: sev.B,
            possibleInjury_C: sev.C,
            propertyDamageOnly_O: sev.O,
            totalEPDO: calcEPDO(sev),
            fatalRate: (sev.K / crashState.totalRows * 100).toFixed(2) + '%',
            KA_rate: ((sev.K + sev.A) / crashState.totalRows * 100).toFixed(2) + '%'
        },
        pedestrianBicycle: {
            pedestrianCrashes: agg.ped.total,
            pedestrianFatal: agg.ped.K,
            pedestrianKA: agg.ped.K + agg.ped.A,
            bicycleCrashes: agg.bike.total,
            bicycleFatal: agg.bike.K,
            bicycleKA: agg.bike.K + agg.bike.A
        },
        intersectionAnalysis: {
            intersectionCrashes: agg.intersection.total,
            intersectionFatal: agg.intersection.K,
            nonIntersectionCrashes: agg.nonIntersection.total,
            intersectionPercent: (agg.intersection.total / crashState.totalRows * 100).toFixed(1) + '%'
        },
        topCollisionTypes: Object.entries(agg.byCollision).sort((a,b) => b[1]-a[1]).slice(0,8).map(e => ({type: e[0], count: e[1]})),
        topLocations: Object.entries(agg.byRoute).sort((a,b) => b[1].total - a[1].total).slice(0,10).map(e => ({
            route: e[0], total: e[1].total, fatal: e[1].K, serious: e[1].A, epdo: calcEPDO(e[1])
        })),
        weatherConditions: Object.entries(agg.byWeather).sort((a,b) => b[1]-a[1]).slice(0,6),
        lightConditions: Object.entries(agg.byLight).sort((a,b) => b[1]-a[1]).slice(0,6),
        yearlyTrend: Object.entries(agg.byYear).sort((a,b) => a[0]-b[0]).map(([y,d]) => ({
            year: y, total: d.total, fatal: d.K, serious: d.A, epdo: calcEPDO(d)
        })),
        // Road profile context
        roadProfile: {
            functionalClass: Object.entries(agg.byFuncClass || {}).sort((a,b) => b[1].total - a[1].total).slice(0,6).map(e => ({
                type: e[0], total: e[1].total, fatal: e[1].K, serious: e[1].A
            })),
            intersectionTypes: Object.entries(agg.byIntType || {}).sort((a,b) => b[1].total - a[1].total).slice(0,6).map(e => ({
                type: e[0], total: e[1].total, fatal: e[1].K || 0, serious: e[1].A || 0
            })),
            trafficControl: Object.entries(agg.byTrafficCtrl || {}).sort((a,b) => b[1] - a[1]).slice(0,6).map(e => ({
                type: e[0], count: e[1]
            }))
        }
    };
}

  // ─── EXTRACTED CODE END ───

  // Public API — dual exposure (window for HTML onclick=, CL.ai.* for in-module consumers)
  window.aiState = aiState;                                   CL.ai.aiState = aiState;
  window.loadSavedKey = loadSavedKey;                         CL.ai.loadSavedKey = loadSavedKey;
  window.handleAIFileSelect = handleAIFileSelect;             CL.ai.handleAIFileSelect = handleAIFileSelect;
  window.renderAttachments = renderAttachments;               CL.ai.renderAttachments = renderAttachments;
  window.removeAttachment = removeAttachment;                 CL.ai.removeAttachment = removeAttachment;
  window.askSuggestion = askSuggestion;                       CL.ai.askSuggestion = askSuggestion;
  window.clearAIChat = clearAIChat;                           CL.ai.clearAIChat = clearAIChat;
  window.clearApiKey = clearApiKey;                           CL.ai.clearApiKey = clearApiKey;
  window.addMessage = addMessage;                             CL.ai.addMessage = addMessage;
  window.addTypingIndicator = addTypingIndicator;             CL.ai.addTypingIndicator = addTypingIndicator;
  window.removeTypingIndicator = removeTypingIndicator;       CL.ai.removeTypingIndicator = removeTypingIndicator;
  window.buildCrashDataContext = buildCrashDataContext;       CL.ai.buildCrashDataContext = buildCrashDataContext;

  CL._registerModule('ai/ai-analyst-chat');
})();
