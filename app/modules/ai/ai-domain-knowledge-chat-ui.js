/**
 * CL ai.domainKnowledge (chat-ui) — extracted (name-anchored) 2026-05-17.
 * Round X modular refactor — see modular-prompts/41-v2-ai-domain-knowledge.md
 * + MODULAR_PLAN_PROMPT_41_FIX.md.
 * Responsibility: Domain Knowledge tab — chat-ui.
 * Depends on (script-tag order): ai/ai-mode-toggle; 41b–41f after 41a.
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L75293-L75438) ───
// Add message to chat
function addDKMessage(role, content, citations = []) {
    const messagesDiv = document.getElementById('dkChatMessages');

    // Process citations to make them clickable
    let processedContent = content;
    if (citations && citations.length > 0) {
        citations.forEach((cite, index) => {
            const sourceName = dkState.sources[cite.source]?.name || cite.source;
            const citationTag = `[${sourceName.replace(/^(Virginia |Federal )/, '')} ${cite.section}]`;
            const citationBtn = `<button class="dk-citation-btn" onclick="showDKCitation(${index})" title="View source">${citationTag}</button>`;
            processedContent = processedContent.replace(new RegExp(`\\[${cite.source.toUpperCase()}\\s+${cite.section}\\]`, 'gi'), citationBtn);
            processedContent = processedContent.replace(new RegExp(`\\[${sourceName}\\s+${cite.section}\\]`, 'gi'), citationBtn);
        });
    }

    // Store citations for reference
    if (citations && citations.length > 0) {
        dkState.referenceSources = citations;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `dk-message dk-message-${role}`;
    messageDiv.innerHTML = `
        <div class="dk-message-content">
            ${role === 'user' ? content : processedContent.replace(/\n/g, '<br>')}
        </div>
    `;

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Store in state
    dkState.messages.push({ role, content, citations });
}

// Show citation in reference panel
function showDKCitation(index) {
    const citation = dkState.referenceSources[index];
    if (!citation) return;

    const sourceInfo = dkState.sources[citation.source] || {};
    const sourceName = sourceInfo.name || citation.source;

    document.getElementById('dkSourceContent').innerHTML = `
        <div style="border-bottom:1px solid var(--border);padding-bottom:.75rem;margin-bottom:.75rem">
            <div style="font-weight:600;color:var(--primary)">${sourceInfo.icon || '📄'} ${sourceName}</div>
            <div style="font-size:.9rem;color:#4b5563">Section ${citation.section}: ${citation.title}</div>
        </div>
        <div style="line-height:1.7">
            ${citation.text || 'Full source text will be loaded here from the knowledge base.'}
        </div>
        <div style="margin-top:1rem;padding-top:.75rem;border-top:1px solid var(--border);font-size:.8rem;color:#6b7280">
            <span>📖 Source: ${sourceName}</span>
        </div>
    `;

    // Show other sources
    updateDKSourcesPanel(dkState.referenceSources);
}

// Update sources panel
function updateDKSourcesPanel(citations) {
    if (!citations || citations.length === 0) {
        document.getElementById('dkOtherSources').style.display = 'none';
        return;
    }

    document.getElementById('dkOtherSources').style.display = 'block';
    document.getElementById('dkSourcesList').innerHTML = citations.map((cite, index) => {
        const sourceInfo = dkState.sources[cite.source] || {};
        return `
            <div class="dk-source-item" style="padding:.4rem;background:#f9fafb;border-radius:4px;cursor:pointer;font-size:.8rem"
                 onclick="showDKCitation(${index})">
                ${sourceInfo.icon || '📄'} <strong>${cite.section}</strong> - ${cite.title}
            </div>
        `;
    }).join('');
}

// Load street view
function loadDKStreetView() {
    const container = document.getElementById('dkStreetViewContainer');

    if (!dkState.selectedLocation) {
        container.innerHTML = '<span style="color:#9ca3af;font-size:.85rem">Select a location to view</span>';
        return;
    }

    // Placeholder - will integrate with actual Mapillary/Mapbox
    container.innerHTML = `
        <div style="text-align:center;padding:1rem">
            <div style="font-size:2rem;margin-bottom:.5rem">🗺️</div>
            <div style="font-size:.85rem;color:#4b5563">${dkState.selectedLocation.name}</div>
            <div style="font-size:.75rem;color:#9ca3af;margin-top:.25rem">Street view will load here</div>
        </div>
    `;
}

// Switch street view provider
function switchDKStreetView(provider) {
    dkState.streetViewProvider = provider;

    // Update button states
    document.querySelectorAll('.dk-view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.provider === provider);
    });

    // Reload view
    loadDKStreetView();
}

// Change view direction
function changeDKViewDirection(direction) {
    dkState.streetViewDirection = direction;
    loadDKStreetView();
}

// Toggle reference panel
function toggleDKReferencePanel() {
    const panel = document.querySelector('.dk-reference-panel');
    const btn = document.getElementById('dkCollapseBtn');

    if (panel.style.display === 'none') {
        panel.style.display = 'flex';
        btn.textContent = '◀';
    } else {
        panel.style.display = 'none';
        btn.textContent = '▶';
    }
}

// Attach image
function attachDKImage() {
    showNotification('Image attachment: Coming soon - attach site photos for analysis', 'info');
}

// Run deep analysis
function runDKDeepAnalysis() {
    if (!dkState.selectedLocation) {
        showNotification('Please select a location first', 'warning');
        return;
    }

    showNotification('Deep Analysis: Multi-agent analysis coming soon', 'info');
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {}; CL.ai = CL.ai || {};
  CL.ai.domainKnowledge = CL.ai.domainKnowledge || {};
  window.addDKMessage = addDKMessage; CL.ai.domainKnowledge.addDKMessage = addDKMessage;
  window.showDKCitation = showDKCitation; CL.ai.domainKnowledge.showDKCitation = showDKCitation;
  window.updateDKSourcesPanel = updateDKSourcesPanel; CL.ai.domainKnowledge.updateDKSourcesPanel = updateDKSourcesPanel;
  window.loadDKStreetView = loadDKStreetView; CL.ai.domainKnowledge.loadDKStreetView = loadDKStreetView;
  window.switchDKStreetView = switchDKStreetView; CL.ai.domainKnowledge.switchDKStreetView = switchDKStreetView;
  window.changeDKViewDirection = changeDKViewDirection; CL.ai.domainKnowledge.changeDKViewDirection = changeDKViewDirection;
  window.toggleDKReferencePanel = toggleDKReferencePanel; CL.ai.domainKnowledge.toggleDKReferencePanel = toggleDKReferencePanel;
  window.attachDKImage = attachDKImage; CL.ai.domainKnowledge.attachDKImage = attachDKImage;
  window.runDKDeepAnalysis = runDKDeepAnalysis; CL.ai.domainKnowledge.runDKDeepAnalysis = runDKDeepAnalysis;
  CL._registerModule('ai/ai-domain-knowledge-chat-ui');
})();
