/**
 * CL ai.modeToggle module
 * Extracted from app/index.html (name-anchored; snapshot ~L28041-L28273).
 * navigateTo-split round — see NAVIGATETO_SPLIT_PLAN.md §3, prompt 40b.
 * Responsibility: AI Mode header toggle + header API-key manager.
 * Public API (dual exposure): window.<fn> ↔ CL.ai.modeToggle.<fn>
 * Module-private: AI_MODE_STORAGE_KEY (not read by remaining inline code —
 *   verified, no window mirror needed).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
const AI_MODE_STORAGE_KEY = 'crashLens_aiModeEnabled';

function toggleAIMode() {
    const toggle = document.getElementById('aiModeToggle');
    const container = document.getElementById('headerApiKeyContainer');
    if (!toggle || !container) return;

    const isActive = toggle.classList.toggle('active');
    toggle.setAttribute('aria-checked', isActive);

    if (isActive) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }

    // Save state to localStorage
    try {
        localStorage.setItem(AI_MODE_STORAGE_KEY, isActive ? 'true' : 'false');
    } catch (e) {
        console.warn('[AI Mode] Could not save state to localStorage:', e);
    }
}

function handleAIToggleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleAIMode();
    }
}

function initAIModeToggle() {
    const toggle = document.getElementById('aiModeToggle');
    const container = document.getElementById('headerApiKeyContainer');
    if (!toggle || !container) return;

    // Load saved state from localStorage
    let savedState = false;
    try {
        savedState = localStorage.getItem(AI_MODE_STORAGE_KEY) === 'true';
    } catch (e) {
        console.warn('[AI Mode] Could not read state from localStorage:', e);
    }

    // Apply saved state
    if (savedState) {
        toggle.classList.add('active');
        toggle.setAttribute('aria-checked', 'true');
        container.classList.remove('hidden');
    } else {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-checked', 'false');
        container.classList.add('hidden');
    }
}

// Initialize AI Mode toggle on DOM ready
document.addEventListener('DOMContentLoaded', initAIModeToggle);

// ============================================================
// CENTRALIZED HEADER API KEY FUNCTIONS
// ============================================================
function saveHeaderApiKey() {
    const key = document.getElementById('headerApiKey').value.trim();
    const provider = document.getElementById('headerAIProvider').value;

    if (!key) {
        alert('Please enter an API key');
        return;
    }

    // Store key using security manager
    ApiKeySecurity.storeKey(key, provider);

    // Update all state objects
    grantState.aiConfig.apiKey = key;
    grantState.aiConfig.provider = provider;
    if (typeof cmfAIState !== 'undefined') {
        cmfAIState.apiKey = key;
        cmfAIState.provider = provider;
    }

    // Save provider preference
    localStorage.setItem('grantTool_ai_provider', provider);

    // Update header status
    updateHeaderKeyStatus(true);

    // Show confirmation
    const statusText = document.getElementById('headerKeyStatusText');
    if (statusText) {
        statusText.textContent = '✓ Connected';
        setTimeout(() => updateHeaderKeyStatus(true), 2000);
    }

    console.log('[HeaderApiKey] Key saved for provider:', provider);
}

function clearHeaderApiKey() {
    // Clear via security manager
    ApiKeySecurity.clearAllKeys();

    // Clear header input
    document.getElementById('headerApiKey').value = '';

    // Update status
    updateHeaderKeyStatus(false);

    alert('API key cleared from all AI assistants.');
}

function updateHeaderKeyStatus(hasKey) {
    const status = document.getElementById('headerKeyStatus');
    const statusText = document.getElementById('headerKeyStatusText');
    const timer = document.getElementById('headerKeyTimer');

    if (!status) return;

    if (hasKey) {
        status.classList.remove('inactive');
        status.classList.add('active');
        statusText.textContent = '✓ Active';
        status.style.color = '#86efac';
    } else {
        status.classList.add('inactive');
        status.classList.remove('active');
        statusText.textContent = 'No key';
        status.style.color = '#fca5a5';
        if (timer) timer.textContent = '';
    }

    // Update all AI assistant status indicators
    updateAllAIStatusIndicators(hasKey);
}

function updateAllAIStatusIndicators(hasKey) {
    const statusElements = [
        'cmfAIKeyStatusText',
        'grantSearchKeyStatusText',
        'grantWritingKeyStatusText',
        'crashAIKeyStatusText'
    ];

    statusElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (hasKey) {
                el.textContent = '✓ Connected';
                el.style.color = '#059669';
            } else {
                el.textContent = 'Configure in header above ↑';
                el.style.color = '#f59e0b';
            }
        }
    });
    // Show/hide the MUTCD AI key status - only show when no key configured
    const crashKeyStatus = document.getElementById('crashAIKeyStatus');
    if (crashKeyStatus) {
        crashKeyStatus.style.display = hasKey ? 'none' : 'flex';
    }
}

function updateHeaderProviderLink() {
    const providerEl = document.getElementById('headerAIProvider');
    const link = document.getElementById('headerApiKeyLink');

    // Safe fallback if element doesn't exist
    const provider = providerEl?.value || 'claude';

    const links = {
        'claude': 'https://console.anthropic.com/settings/keys',
        'openai': 'https://platform.openai.com/api-keys',
        'openai-mini': 'https://platform.openai.com/api-keys',
        'gemini': 'https://aistudio.google.com/app/apikey'
    };

    const names = {
        'claude': 'Claude',
        'openai': 'OpenAI',
        'openai-mini': 'OpenAI',
        'gemini': 'Gemini'
    };

    if (link) {
        link.href = links[provider] || links['claude'];
        link.textContent = '🔑 Get ' + (names[provider] || 'API') + ' key';
    }

    // Sync provider to all AI assistants (with safe checks)
    if (typeof grantState !== 'undefined' && grantState.aiConfig) {
        grantState.aiConfig.provider = provider;
    }
    if (typeof cmfAIState !== 'undefined') cmfAIState.provider = provider;
    localStorage.setItem('grantTool_ai_provider', provider);
}

function initHeaderApiKey() {
    try {
        // Load saved provider
        const savedProvider = localStorage.getItem('grantTool_ai_provider');
        if (savedProvider) {
            const select = document.getElementById('headerAIProvider');
            if (select) select.value = savedProvider;
            updateHeaderProviderLink();
        }

        // Check for existing key
        const savedKey = ApiKeySecurity.getKey();
        if (savedKey) {
            const keyInput = document.getElementById('headerApiKey');
            if (keyInput) keyInput.value = savedKey;
            updateHeaderKeyStatus(true);
        }

        // Update timer display periodically
        setInterval(() => {
            if (ApiKeySecurity.state.hasActiveKey && ApiKeySecurity.state.expiryTimestamp) {
                const remaining = ApiKeySecurity.state.expiryTimestamp - Date.now();
                const timer = document.getElementById('headerKeyTimer');
                if (timer && remaining > 0) {
                    const mins = Math.floor(remaining / 60000);
                    const secs = Math.floor((remaining % 60000) / 1000);
                    timer.textContent = `(${mins}:${secs.toString().padStart(2, '0')})`;
                } else if (timer) {
                    timer.textContent = '';
                }
            }
        }, 1000);
    } catch (e) {
        console.warn('[InitHeaderApiKey] Error during initialization:', e.message);
    }
}
  // ─── EXTRACTED CODE END ───
  window.CL = window.CL || {};
  CL.ai = CL.ai || {};
  CL.ai.modeToggle = CL.ai.modeToggle || {};
  window.toggleAIMode = toggleAIMode;                       CL.ai.modeToggle.toggleAIMode = toggleAIMode;
  window.handleAIToggleKeydown = handleAIToggleKeydown;     CL.ai.modeToggle.handleAIToggleKeydown = handleAIToggleKeydown;
  window.initAIModeToggle = initAIModeToggle;               CL.ai.modeToggle.initAIModeToggle = initAIModeToggle;
  window.saveHeaderApiKey = saveHeaderApiKey;               CL.ai.modeToggle.saveHeaderApiKey = saveHeaderApiKey;
  window.clearHeaderApiKey = clearHeaderApiKey;             CL.ai.modeToggle.clearHeaderApiKey = clearHeaderApiKey;
  window.updateHeaderKeyStatus = updateHeaderKeyStatus;     CL.ai.modeToggle.updateHeaderKeyStatus = updateHeaderKeyStatus;
  window.updateAllAIStatusIndicators = updateAllAIStatusIndicators; CL.ai.modeToggle.updateAllAIStatusIndicators = updateAllAIStatusIndicators;
  window.updateHeaderProviderLink = updateHeaderProviderLink; CL.ai.modeToggle.updateHeaderProviderLink = updateHeaderProviderLink;
  window.initHeaderApiKey = initHeaderApiKey;               CL.ai.modeToggle.initHeaderApiKey = initHeaderApiKey;
  CL._registerModule('ai/ai-mode-toggle');
})();
