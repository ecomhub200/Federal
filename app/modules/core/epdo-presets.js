/**
 * CL core.epdoPresets module
 *
 * Extracted from app/index.html (snapshot L20090-L20399) on 2026-05-16.
 * Round X modular refactor — see modular-prompts/23-core-epdo-presets.md.
 * Responsibility: EPDO preset load/save/UI + per-state weights.
 *
 * Stage A v3 Phase 2.6 (FINAL Phase 2 module): native ES module. All
 * reassignments of the EPDO weights / active-preset globals are rewritten
 * to window.X = ... so the mutation propagates to the global object — the
 * arity-1 calcEPDO wrapper at app/index.html:26893 plus every classic + ESM
 * reader sees the new value immediately. Bare reads of the EPDO globals,
 * the per-tab state objects (window.crashState / window.grantState / window.cmfState /
 * window.safetyState / window.baState / window.jurisdictionContext), every typeof-guarded
 * external function call, and the two top-level wrapper fns (the state
 * EPDO weights lookup at app/index.html:19247 and the current state FIPS
 * lookup at app/index.html:19256) are rewritten to window.X. Internal
 * helpers defined in this module stay as bare module-scope refs.
 *
 * Public API (back-compat dual exposure): all 10 top-level fns in the block
 * are window.<fn> + window.CL.core.<fn> (safeJsonParse incl. — 7 external inline
 * callers). The EPDO weights/active-preset/presets globals + STATE_window.EPDO_WEIGHTS
 * are app-wide shared (declared in index.html, read by calcEPDO everywhere,
 * reassigned here) — intentionally NOT moved (global-lexical free-var refs;
 * §1's "move globals" list is pre-drift; §8 governs).
 *
 * Depends on (must load before this file): `core/epdo`, `core/constants`
 */
'use strict';
// ─── EXTRACTED CODE START (verbatim from index.html) ───

/**
 * Auto-apply state-specific EPDO weights when using stateDefault preset.
 * Called after state selection or state detection.
 * @param {string} stateFips - Two-digit state FIPS code
 * @param {string} [stateName] - State name for logging
 */
function applyStateDefaultEPDO(stateFips, stateName) {
    if (window.EPDO_ACTIVE_PRESET !== 'stateDefault') return;
    const stateEntry = window.getStateEPDOWeights(stateFips);
    window.EPDO_WEIGHTS = { ...stateEntry.weights };
    window.EPDO_PRESETS.stateDefault.weights = { ...stateEntry.weights };
    window.EPDO_PRESETS.stateDefault.name = `State Default (${stateEntry.name})`;
    window.EPDO_PRESETS.stateDefault.description = stateEntry.source;
    updateEPDOPresetUI();
    updateEPDOWeightLabels();
    console.log(`[EPDO] Auto-applied state weights for ${stateName || stateEntry.name}:`, window.EPDO_WEIGHTS);
}

// BUG-007 fix: Safe JSON parsing helper to prevent crashes from corrupted localStorage
function safeJsonParse(str, fallback = null) {
    if (!str) return fallback;
    try {
        return JSON.parse(str);
    } catch (e) {
        console.warn('[safeJsonParse] Failed to parse:', e.message);
        return fallback;
    }
}

// ============================================================
// EPDO PRESET SWITCHING & RECALCULATION
// ============================================================

function loadEPDOPreset(presetKey) {
    if (presetKey === 'custom') {
        window.EPDO_WEIGHTS = {
            K: parseInt(document.getElementById('epdoCustomK')?.value) || 462,
            A: parseInt(document.getElementById('epdoCustomA')?.value) || 62,
            B: parseInt(document.getElementById('epdoCustomB')?.value) || 12,
            C: parseInt(document.getElementById('epdoCustomC')?.value) || 5,
            O: parseInt(document.getElementById('epdoCustomO')?.value) || 1
        };
        window.EPDO_PRESETS.custom.weights = { ...window.EPDO_WEIGHTS };
    } else if (presetKey === 'stateDefault') {
        // Resolve weights from the current state selection
        const currentStateFips = window.getCurrentStateFips();
        const stateEntry = window.getStateEPDOWeights(currentStateFips);
        window.EPDO_WEIGHTS = { ...stateEntry.weights };
        window.EPDO_PRESETS.stateDefault.weights = { ...stateEntry.weights };
        window.EPDO_PRESETS.stateDefault.name = `State Default (${stateEntry.name})`;
        window.EPDO_PRESETS.stateDefault.description = stateEntry.source;
    } else {
        const preset = window.EPDO_PRESETS[presetKey];
        if (!preset) { console.warn('[EPDO] Unknown preset:', presetKey); return; }
        window.EPDO_WEIGHTS = { ...preset.weights };
    }
    window.EPDO_ACTIVE_PRESET = presetKey;
    localStorage.setItem('epdoActivePreset', presetKey);
    if (presetKey === 'custom') localStorage.setItem('epdoCustomWeights', JSON.stringify(window.EPDO_WEIGHTS));
    updateEPDOPresetUI();
    updateEPDOWeightLabels();
    recalculateAllEPDO();
    // Round 21 §6 — When sampleRows is empty (every aggregate tier), the
    // in-memory recalculateAllEPDO() has nothing to walk and the EPDO tile
    // doesn't refresh. Force a matview re-paint so the Dashboard reflects
    // the new weights immediately. State-agnostic.
    try {
        const _hasRows = !!(typeof window.crashState !== 'undefined' && window.crashState && window.crashState.sampleRows && window.crashState.sampleRows.length > 0);
        if (!_hasRows && typeof window.updateDashboardFromMatview === 'function') {
            const spec = (typeof window._readGlobalFilterSpec === 'function')
                ? window._readGlobalFilterSpec()
                : { yearStart: null, yearEnd: null, severities: null };
            window.updateDashboardFromMatview(spec);
        }
    } catch (e) { /* non-fatal */ }
    // Broadcast so any other tab that caches EPDO-derived values can refresh.
    try {
        window.dispatchEvent(new CustomEvent('epdo:weights-changed', {
            detail: { preset: presetKey, weights: Object.assign({}, window.EPDO_WEIGHTS) }
        }));
    } catch (e) { /* non-fatal */ }
    console.log('[EPDO] Preset changed to:', presetKey, window.EPDO_WEIGHTS);
}

function loadSavedEPDOPreset() {
    let saved = localStorage.getItem('epdoActivePreset');
    // If no saved preset, default to stateDefault
    if (!saved) {
        saved = 'stateDefault';
        localStorage.setItem('epdoActivePreset', 'stateDefault');
    }
    if (saved && window.EPDO_PRESETS[saved]) {
        if (saved === 'custom') {
            const cw = safeJsonParse(localStorage.getItem('epdoCustomWeights'), null);
            if (cw) {
                window.EPDO_PRESETS.custom.weights = cw;
                ['K','A','B','C','O'].forEach(f => {
                    const el = document.getElementById('epdoCustom' + f);
                    if (el) el.value = cw[f] || (f === 'O' ? 1 : 0);
                });
            }
        }
        // Apply without recalculation cascade (data may not be loaded yet)
        if (saved === 'stateDefault') {
            // Resolve weights from current state (may refine later when state loads)
            const currentStateFips = window.getCurrentStateFips();
            const stateEntry = window.getStateEPDOWeights(currentStateFips);
            window.EPDO_WEIGHTS = { ...stateEntry.weights };
            window.EPDO_PRESETS.stateDefault.weights = { ...stateEntry.weights };
            window.EPDO_PRESETS.stateDefault.name = `State Default (${stateEntry.name})`;
            window.EPDO_PRESETS.stateDefault.description = stateEntry.source;
        } else if (saved === 'custom') {
            window.EPDO_WEIGHTS = { ...window.EPDO_PRESETS.custom.weights };
        } else {
            const preset = window.EPDO_PRESETS[saved];
            window.EPDO_WEIGHTS = { ...preset.weights };
        }
        window.EPDO_ACTIVE_PRESET = saved;
        updateEPDOPresetUI();
        updateEPDOWeightLabels();
        console.log('[EPDO] Restored saved preset:', saved, window.EPDO_WEIGHTS);
    }
}

function saveCustomEPDOWeights() {
    if (window.EPDO_ACTIVE_PRESET === 'custom') loadEPDOPreset('custom');
}

function toggleEPDOSection() {
    const content = document.getElementById('epdoSectionContent');
    const chevron = document.getElementById('epdoChevron');
    const toggle = document.getElementById('epdoSectionToggle');
    if (!content) return;
    const isExpanded = content.style.display !== 'none';
    const willOpen = !isExpanded;
    content.style.display = willOpen ? 'flex' : 'none';
    if (chevron) {
        // Round 18 §11 — keep CSS rotation for transition-smoothness, but
        // also swap the textContent so screen readers + the audit-runner
        // see the right character even if transform rendering is suppressed.
        chevron.style.transform = willOpen ? 'rotate(0deg)' : 'rotate(-90deg)';
        chevron.textContent = willOpen ? '▼' : '▶';
    }
    if (toggle) toggle.setAttribute('aria-expanded', String(willOpen));
}

function updateEPDOPresetUI() {
    const radioMap = {
        stateDefault: 'epdoPresetStateDefault',
        hsm2010: 'epdoPresetHSM',
        vdot2024: 'epdoPresetVDOT',
        fhwa2022: 'epdoPresetFHWA',
        custom: 'epdoPresetCustom'
    };
    Object.entries(radioMap).forEach(([key, id]) => {
        const radio = document.getElementById(id);
        if (radio) radio.checked = (key === window.EPDO_ACTIVE_PRESET);
    });
    const customInputs = document.getElementById('epdoCustomInputs');
    if (customInputs) customInputs.style.display = window.EPDO_ACTIVE_PRESET === 'custom' ? 'grid' : 'none';

    // Update the compact active label in the collapsed header
    const activeLabel = document.getElementById('epdoActiveLabel');
    if (activeLabel) {
        const presetName = window.EPDO_PRESETS[window.EPDO_ACTIVE_PRESET]?.name || 'Custom';
        activeLabel.textContent = `${presetName} — K=${window.EPDO_WEIGHTS.K}`;
    }

    // Update the State Default description to show current state weights
    const stateDescEl = document.getElementById('epdoStateDefaultDesc');
    if (stateDescEl && window.EPDO_PRESETS.stateDefault) {
        const w = window.EPDO_PRESETS.stateDefault.weights;
        stateDescEl.textContent = `${window.EPDO_PRESETS.stateDefault.name}: K=${w.K}, A=${w.A}, B=${w.B}, C=${w.C}, O=1`;
    }
}

function updateEPDOWeightLabels() {
    const label = `Weights: K=${window.EPDO_WEIGHTS.K}, A=${window.EPDO_WEIGHTS.A}, B=${window.EPDO_WEIGHTS.B}, C=${window.EPDO_WEIGHTS.C}, O=${window.EPDO_WEIGHTS.O}`;
    const presetName = window.EPDO_PRESETS[window.EPDO_ACTIVE_PRESET]?.name || 'Custom';
    const dashLabel = document.getElementById('epdoWeightsLabel');
    if (dashLabel) dashLabel.textContent = `${label} (${presetName})`;
    const glossaryDef = document.getElementById('epdoGlossaryDef');
    if (glossaryDef) glossaryDef.textContent = `Weighted severity score: ${label}. Prioritizes locations with severe crashes over high-volume minor crash locations. Using ${presetName} preset.`;
    // Update glossary visual numbers dynamically
    ['K','A','B','C','O'].forEach(sev => {
        const el = document.getElementById('epdoGlossary' + sev);
        if (el) el.textContent = window.EPDO_WEIGHTS[sev];
    });
    // Update glossary example dynamically
    const exampleEl = document.getElementById('epdoExampleValue');
    if (exampleEl) exampleEl.textContent = (2 * window.EPDO_WEIGHTS.K).toLocaleString();
    // Also update grant tab EPDO indicator if available
    if (typeof window.updateGrantEPDOIndicator === 'function') window.updateGrantEPDOIndicator();
}

function getEPDOPresetLabel() {
    const preset = window.EPDO_PRESETS[window.EPDO_ACTIVE_PRESET];
    if (!preset) return 'Custom';
    if (window.EPDO_ACTIVE_PRESET === 'stateDefault') {
        return (typeof window.jurisdictionContext !== 'undefined' && window.jurisdictionContext.stateName ? window.jurisdictionContext.stateName : 'State') + ' Default';
    }
    return preset.name;
}

function recalculateAllEPDO() {
    if (!window.crashState.loaded) return;
    if (typeof window.updateDashboard === 'function') window.updateDashboard();
    if (typeof window.crashState !== 'undefined' && window.crashState.hotspots?.length > 0) {
        window.crashState.hotspots = [];
        if (typeof window.analyzeHotspots === 'function') window.analyzeHotspots();
    }
    if (typeof window.grantState !== 'undefined' && window.grantState.loaded) {
        if (window.grantState.rankingCache) window.grantState.rankingCache = { key: null, locations: [] };
        if (typeof window.rankLocationsForGrants === 'function') window.rankLocationsForGrants();
    }
    if (typeof window.cmfState !== 'undefined' && window.cmfState.selectedLocation) {
        if (typeof window.buildCMFCrashProfile === 'function') window.buildCMFCrashProfile();
        if (typeof window.updateCMFUI === 'function') window.updateCMFUI();
    }
    if (typeof window.safetyState !== 'undefined' && window.safetyState.activeCategory) {
        if (typeof window.updateSafetyCategory === 'function') window.updateSafetyCategory(window.safetyState.activeCategory);
    }
    if (typeof window.baState !== 'undefined' && window.baState.locationCrashes?.length > 0) {
        if (typeof window.updateBAStudy === 'function') window.updateBAStudy();
    }
    if (typeof window.updateMapStats === 'function') window.updateMapStats();
    if (typeof window.updateAIContextIndicator === 'function') window.updateAIContextIndicator();
    console.log('[EPDO] Full recalculation cascade complete');
}

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  window.CL.core = window.CL.core || {};
  window.applyStateDefaultEPDO = applyStateDefaultEPDO; window.CL.core.applyStateDefaultEPDO = applyStateDefaultEPDO;
  window.getEPDOPresetLabel = getEPDOPresetLabel; window.CL.core.getEPDOPresetLabel = getEPDOPresetLabel;
  window.loadEPDOPreset = loadEPDOPreset; window.CL.core.loadEPDOPreset = loadEPDOPreset;
  window.loadSavedEPDOPreset = loadSavedEPDOPreset; window.CL.core.loadSavedEPDOPreset = loadSavedEPDOPreset;
  window.recalculateAllEPDO = recalculateAllEPDO; window.CL.core.recalculateAllEPDO = recalculateAllEPDO;
  window.safeJsonParse = safeJsonParse; window.CL.core.safeJsonParse = safeJsonParse;
  window.saveCustomEPDOWeights = saveCustomEPDOWeights; window.CL.core.saveCustomEPDOWeights = saveCustomEPDOWeights;
  window.toggleEPDOSection = toggleEPDOSection; window.CL.core.toggleEPDOSection = toggleEPDOSection;
  window.updateEPDOPresetUI = updateEPDOPresetUI; window.CL.core.updateEPDOPresetUI = updateEPDOPresetUI;
  window.updateEPDOWeightLabels = updateEPDOWeightLabels; window.CL.core.updateEPDOWeightLabels = updateEPDOWeightLabels;
  window.CL._registerModule('core/epdo-presets');

export {};
