/**
 * CL cmf.ai module
 *
 * Extracted from app/index.html on 2026-05-17.
 * Round X modular refactor — see modular-prompts/32-cmf-cmf-ai.md.
 * Responsibility: CMF AI init (provider + API key bootstrap on page load).
 *
 * Public API (back-compat dual exposure):
 *   - window.initCMFAI -> CL.cmf.initCMFAI
 *
 * NOTE: external caller `setTimeout(initCMFAI, 500)` (index.html) resolves
 * via window.initCMFAI at runtime. `cmfAIState` is an inline shared global
 * (const @ index.html, OUTSIDE this block) — referenced only at runtime,
 * intentionally NOT moved. No behavior change.
 *
 * Depends on (must load before this file): `cmf/cmf-search`; runtime:
 * cmfAIState (inline global), ApiKeySecurity.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

// Initialize CMF AI on page load
function initCMFAI() {
    // Load saved provider
    const savedProvider = localStorage.getItem('cmfAI_provider') || localStorage.getItem('grantTool_ai_provider') || 'claude';
    cmfAIState.provider = savedProvider;
    // Sync with header provider
    const headerProvider = document.getElementById('headerAIProvider');
    if (headerProvider) headerProvider.value = savedProvider;
    // Also sync with popover provider
    const popoverProvider = document.getElementById('cmfPopoverProvider');
    if (popoverProvider) popoverProvider.value = savedProvider;

    // Load saved API key from security manager
    const savedKey = ApiKeySecurity.getKey();
    if (savedKey) {
        cmfAIState.apiKey = savedKey;
    }
}

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.cmf = CL.cmf || {};
  window.initCMFAI = initCMFAI; CL.cmf.initCMFAI = initCMFAI;
  CL._registerModule('cmf/cmf-ai');
})();
