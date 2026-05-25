'use strict';
/**
 * CrashLens EPDO Calculation Logic
 * Extracted from app/index.html — pure computation functions only
 *
 * Stage A v3 Phase 2.4: native ES module.
 */

/**
 * Look up recommended EPDO weights for a state by FIPS code.
 * Falls back to HSM Standard if state not found.
 * @param {string|number} stateFips - Two-digit state FIPS code
 * @returns {{ name: string, weights: {K:number,A:number,B:number,C:number,O:number}, source: string }}
 */
function getStateEPDOWeights(stateFips) {
    var stateWeights = window.CL.core.constants.STATE_EPDO_WEIGHTS;
    var padded = String(stateFips).padStart(2, '0');
    return stateWeights[padded] || stateWeights['_default'];
}

/**
 * Calculate EPDO score from severity counts using given weights.
 * @param {Object} severityObj - { K, A, B, C, O } counts
 * @param {Object} weights - { K, A, B, C, O } weight values
 * @returns {number} EPDO score
 */
function calcEPDO(severityObj, weights) {
    return (severityObj.K||0)*weights.K + (severityObj.A||0)*weights.A + (severityObj.B||0)*weights.B + (severityObj.C||0)*weights.C + (severityObj.O||0)*weights.O;
}

export { getStateEPDOWeights, calcEPDO };

// Dual-exposure footer: preserve the existing `CL.core.epdo.*` public API
// so all classic-script callers (app/index.html L19248, L26893; batch-ba/*;
// etc.) keep working unchanged. Intentionally NOT exposing a bare
// `window.calcEPDO` — that identifier is already bound at app/index.html
// L26893 to an arity-1 wrapper `s => CL.core.epdo.calcEPDO(s, EPDO_WEIGHTS)`
// that 28+ call sites depend on; overriding it with this arity-2 raw
// function would silently break those callers.
if (typeof window !== 'undefined') {
    window.CL = window.CL || {};
    window.CL.core = window.CL.core || {};
    window.CL.core.epdo = window.CL.core.epdo || {};
    window.CL.core.epdo.getStateEPDOWeights = getStateEPDOWeights;
    window.CL.core.epdo.calcEPDO = calcEPDO;
}
if (typeof CL !== 'undefined' && CL._registerModule) {
    CL._registerModule('core/epdo');
}
