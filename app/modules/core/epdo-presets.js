/**
 * CL core.epdoPresets module
 *
 * Extracted from app/index.html (snapshot L20090-L20399) on 2026-05-16.
 * Round X modular refactor — see modular-prompts/23-core-epdo-presets.md.
 * Responsibility: EPDO preset load/save/UI + per-state weights.
 *
 * Public API (back-compat dual exposure): all 10 top-level fns in the block
 * are window.<fn> + CL.core.<fn> (safeJsonParse incl. — 7 external inline
 * callers). EPDO_WEIGHTS/EPDO_ACTIVE_PRESET/EPDO_PRESETS/STATE_EPDO_WEIGHTS
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
    if (EPDO_ACTIVE_PRESET !== 'stateDefault') return;
    const stateEntry = getStateEPDOWeights(stateFips);
    EPDO_WEIGHTS = { ...stateEntry.weights };
    EPDO_PRESETS.stateDefault.weights = { ...stateEntry.weights };
    EPDO_PRESETS.stateDefault.name = `State Default (${stateEntry.name})`;
    EPDO_PRESETS.stateDefault.description = stateEntry.source;
    updateEPDOPresetUI();
    updateEPDOWeightLabels();
    console.log(`[EPDO] Auto-applied state weights for ${stateName || stateEntry.name}:`, EPDO_WEIGHTS);
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
        EPDO_WEIGHTS = {
            K: parseInt(document.getElementById('epdoCustomK')?.value) || 462,
            A: parseInt(document.getElementById('epdoCustomA')?.value) || 62,
            B: parseInt(document.getElementById('epdoCustomB')?.value) || 12,
            C: parseInt(document.getElementById('epdoCustomC')?.value) || 5,
            O: parseInt(document.getElementById('epdoCustomO')?.value) || 1
        };
        EPDO_PRESETS.custom.weights = { ...EPDO_WEIGHTS };
    } else if (presetKey === 'stateDefault') {
        // Resolve weights from the current state selection
        const currentStateFips = getCurrentStateFips();
        const stateEntry = getStateEPDOWeights(currentStateFips);
        EPDO_WEIGHTS = { ...stateEntry.weights };
        EPDO_PRESETS.stateDefault.weights = { ...stateEntry.weights };
        EPDO_PRESETS.stateDefault.name = `State Default (${stateEntry.name})`;
        EPDO_PRESETS.stateDefault.description = stateEntry.source;
    } else {
        const preset = EPDO_PRESETS[presetKey];
        if (!preset) { console.warn('[EPDO] Unknown preset:', presetKey); return; }
        EPDO_WEIGHTS = { ...preset.weights };
    }
    EPDO_ACTIVE_PRESET = presetKey;
    localStorage.setItem('epdoActivePreset', presetKey);
    if (presetKey === 'custom') localStorage.setItem('epdoCustomWeights', JSON.stringify(EPDO_WEIGHTS));
    updateEPDOPresetUI();
    updateEPDOWeightLabels();
    recalculateAllEPDO();
    // Round 21 §6 — When sampleRows is empty (every aggregate tier), the
    // in-memory recalculateAllEPDO() has nothing to walk and the EPDO tile
    // doesn't refresh. Force a matview re-paint so the Dashboard reflects
    // the new weights immediately. State-agnostic.
    try {
        const _hasRows = !!(typeof window.crashState !== 'undefined' && window.crashState && window.crashState.sampleRows && window.crashState.sampleRows.length > 0);
        if (!_hasRows && typeof updateDashboardFromMatview === 'function') {
            const spec = (typeof window._readGlobalFilterSpec === 'function')
                ? window._readGlobalFilterSpec()
                : { yearStart: null, yearEnd: null, severities: null };
            updateDashboardFromMatview(spec);
        }
    } catch (e) { /* non-fatal */ }
    // Broadcast so any other tab that caches EPDO-derived values can refresh.
    try {
        window.dispatchEvent(new CustomEvent('epdo:weights-changed', {
            detail: { preset: presetKey, weights: Object.assign({}, EPDO_WEIGHTS) }
        }));
    } catch (e) { /* non-fatal */ }
    console.log('[EPDO] Preset changed to:', presetKey, EPDO_WEIGHTS);
}

function loadSavedEPDOPreset() {
    let saved = localStorage.getItem('epdoActivePreset');
    // If no saved preset, default to stateDefault
    if (!saved) {
        saved = 'stateDefault';
        localStorage.setItem('epdoActivePreset', 'stateDefault');
    }
    if (saved && EPDO_PRESETS[saved]) {
        if (saved === 'custom') {
            const cw = safeJsonParse(localStorage.getItem('epdoCustomWeights'), null);
            if (cw) {
                EPDO_PRESETS.custom.weights = cw;
                ['K','A','B','C','O'].forEach(f => {
                    const el = document.getElementById('epdoCustom' + f);
                    if (el) el.value = cw[f] || (f === 'O' ? 1 : 0);
                });
            }
        }
        // Apply without recalculation cascade (data may not be loaded yet)
        if (saved === 'stateDefault') {
            // Resolve weights from current state (may refine later when state loads)
            const currentStateFips = getCurrentStateFips();
            const stateEntry = getStateEPDOWeights(currentStateFips);
            EPDO_WEIGHTS = { ...stateEntry.weights };
            EPDO_PRESETS.stateDefault.weights = { ...stateEntry.weights };
            EPDO_PRESETS.stateDefault.name = `State Default (${stateEntry.name})`;
            EPDO_PRESETS.stateDefault.description = stateEntry.source;
        } else if (saved === 'custom') {
            EPDO_WEIGHTS = { ...EPDO_PRESETS.custom.weights };
        } else {
            const preset = EPDO_PRESETS[saved];
            EPDO_WEIGHTS = { ...preset.weights };
        }
        EPDO_ACTIVE_PRESET = saved;
        updateEPDOPresetUI();
        updateEPDOWeightLabels();
        console.log('[EPDO] Restored saved preset:', saved, EPDO_WEIGHTS);
    }
}

function saveCustomEPDOWeights() {
    if (EPDO_ACTIVE_PRESET === 'custom') loadEPDOPreset('custom');
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
        if (radio) radio.checked = (key === EPDO_ACTIVE_PRESET);
    });
    const customInputs = document.getElementById('epdoCustomInputs');
    if (customInputs) customInputs.style.display = EPDO_ACTIVE_PRESET === 'custom' ? 'grid' : 'none';

    // Update the compact active label in the collapsed header
    const activeLabel = document.getElementById('epdoActiveLabel');
    if (activeLabel) {
        const presetName = EPDO_PRESETS[EPDO_ACTIVE_PRESET]?.name || 'Custom';
        activeLabel.textContent = `${presetName} — K=${EPDO_WEIGHTS.K}`;
    }

    // Update the State Default description to show current state weights
    const stateDescEl = document.getElementById('epdoStateDefaultDesc');
    if (stateDescEl && EPDO_PRESETS.stateDefault) {
        const w = EPDO_PRESETS.stateDefault.weights;
        stateDescEl.textContent = `${EPDO_PRESETS.stateDefault.name}: K=${w.K}, A=${w.A}, B=${w.B}, C=${w.C}, O=1`;
    }
}

function updateEPDOWeightLabels() {
    const label = `Weights: K=${EPDO_WEIGHTS.K}, A=${EPDO_WEIGHTS.A}, B=${EPDO_WEIGHTS.B}, C=${EPDO_WEIGHTS.C}, O=${EPDO_WEIGHTS.O}`;
    const presetName = EPDO_PRESETS[EPDO_ACTIVE_PRESET]?.name || 'Custom';
    const dashLabel = document.getElementById('epdoWeightsLabel');
    if (dashLabel) dashLabel.textContent = `${label} (${presetName})`;
    const glossaryDef = document.getElementById('epdoGlossaryDef');
    if (glossaryDef) glossaryDef.textContent = `Weighted severity score: ${label}. Prioritizes locations with severe crashes over high-volume minor crash locations. Using ${presetName} preset.`;
    // Update glossary visual numbers dynamically
    ['K','A','B','C','O'].forEach(sev => {
        const el = document.getElementById('epdoGlossary' + sev);
        if (el) el.textContent = EPDO_WEIGHTS[sev];
    });
    // Update glossary example dynamically
    const exampleEl = document.getElementById('epdoExampleValue');
    if (exampleEl) exampleEl.textContent = (2 * EPDO_WEIGHTS.K).toLocaleString();
    // Also update grant tab EPDO indicator if available
    if (typeof updateGrantEPDOIndicator === 'function') updateGrantEPDOIndicator();
}

function getEPDOPresetLabel() {
    const preset = EPDO_PRESETS[EPDO_ACTIVE_PRESET];
    if (!preset) return 'Custom';
    if (EPDO_ACTIVE_PRESET === 'stateDefault') {
        return (typeof window.jurisdictionContext !== 'undefined' && window.jurisdictionContext.stateName ? window.jurisdictionContext.stateName : 'State') + ' Default';
    }
    return preset.name;
}

function recalculateAllEPDO() {
    if (!window.crashState.loaded) return;
    if (typeof updateDashboard === 'function') updateDashboard();
    if (typeof window.crashState !== 'undefined' && window.crashState.hotspots?.length > 0) {
        window.crashState.hotspots = [];
        if (typeof analyzeHotspots === 'function') analyzeHotspots();
    }
    if (typeof window.grantState !== 'undefined' && window.grantState.loaded) {
        if (window.grantState.rankingCache) window.grantState.rankingCache = { key: null, locations: [] };
        if (typeof rankLocationsForGrants === 'function') rankLocationsForGrants();
    }
    if (typeof window.cmfState !== 'undefined' && window.cmfState.selectedLocation) {
        if (typeof buildCMFCrashProfile === 'function') buildCMFCrashProfile();
        if (typeof updateCMFUI === 'function') updateCMFUI();
    }
    if (typeof safetyState !== 'undefined' && safetyState.activeCategory) {
        if (typeof updateSafetyCategory === 'function') updateSafetyCategory(safetyState.activeCategory);
    }
    if (typeof window.baState !== 'undefined' && window.baState.locationCrashes?.length > 0) {
        if (typeof updateBAStudy === 'function') updateBAStudy();
    }
    if (typeof updateMapStats === 'function') updateMapStats();
    if (typeof updateAIContextIndicator === 'function') updateAIContextIndicator();
    console.log('[EPDO] Full recalculation cascade complete');
}

// ─── EXTRACTED CODE END ───

// --- Transitional CL.* namespace (stripped in Stage A-cleanup) ---
window.CL = window.CL || {};
CL.core = CL.core || {};
CL.core.applyStateDefaultEPDO = applyStateDefaultEPDO;
CL.core.getEPDOPresetLabel = getEPDOPresetLabel;
CL.core.loadEPDOPreset = loadEPDOPreset;
CL.core.loadSavedEPDOPreset = loadSavedEPDOPreset;
CL.core.recalculateAllEPDO = recalculateAllEPDO;
CL.core.safeJsonParse = safeJsonParse;
CL.core.saveCustomEPDOWeights = saveCustomEPDOWeights;
CL.core.toggleEPDOSection = toggleEPDOSection;
CL.core.updateEPDOPresetUI = updateEPDOPresetUI;
CL.core.updateEPDOWeightLabels = updateEPDOWeightLabels;

// --- Legacy global exposure for HTML onclick= (see STAGE_A_ONCLICK_API.md) ---
window.loadEPDOPreset = loadEPDOPreset;
window.saveCustomEPDOWeights = saveCustomEPDOWeights;
window.toggleEPDOSection = toggleEPDOSection;

export {
    applyStateDefaultEPDO,
    getEPDOPresetLabel,
    loadEPDOPreset,
    loadSavedEPDOPreset,
    recalculateAllEPDO,
    safeJsonParse,
    saveCustomEPDOWeights,
    toggleEPDOSection,
    updateEPDOPresetUI,
    updateEPDOWeightLabels
};

CL._registerModule('core/epdo-presets');
