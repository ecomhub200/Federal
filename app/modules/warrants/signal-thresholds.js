/**
 * CL warrants.signalThresholds module
 *
 * Extracted from app/index.html (snapshot L30362-L30460) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/07-warrants-signal-thresholds.md.
 * Responsibility: MUTCD signal warrant threshold tables/curves (constants).
 *
 * Public API (back-compat dual exposure):
 *   - window.SIGNAL_WARRANT1_THRESHOLDS → CL.warrants.SIGNAL_WARRANT1_THRESHOLDS
 *   - window.SIGNAL_WARRANT2_CURVES → CL.warrants.SIGNAL_WARRANT2_CURVES
 *   - window.SIGNAL_WARRANT3_CURVES → CL.warrants.SIGNAL_WARRANT3_CURVES
 *   - window.SIGNAL_WARRANT4_CURVES → CL.warrants.SIGNAL_WARRANT4_CURVES
 *   - window.SIGNAL_WARRANT5_MIN_SCHOOLCHILDREN → CL.warrants.SIGNAL_WARRANT5_MIN_SCHOOLCHILDREN
 *
 * Depends on (must load before this file): `warrants/signal`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

// ============================================================
// SIGNAL WARRANT MUTCD THRESHOLDS (11th Edition)
// ============================================================

// Warrant 1: Eight-Hour Vehicular Volume (MUTCD Table 4C-1)
const SIGNAL_WARRANT1_THRESHOLDS = {
    conditionA: {
        '1x1': { p100: { major: 500, minor: 150 }, p80: { major: 400, minor: 120 }, p70: { major: 350, minor: 105 }, p56: { major: 280, minor: 84 } },
        '2x1': { p100: { major: 600, minor: 150 }, p80: { major: 480, minor: 120 }, p70: { major: 420, minor: 105 }, p56: { major: 336, minor: 84 } },
        '2x2': { p100: { major: 600, minor: 200 }, p80: { major: 480, minor: 160 }, p70: { major: 420, minor: 140 }, p56: { major: 336, minor: 112 } },
        '1x2': { p100: { major: 500, minor: 200 }, p80: { major: 400, minor: 160 }, p70: { major: 350, minor: 140 }, p56: { major: 280, minor: 112 } }
    },
    conditionB: {
        '1x1': { p100: { major: 750, minor: 75 }, p80: { major: 600, minor: 60 }, p70: { major: 525, minor: 53 }, p56: { major: 420, minor: 42 } },
        '2x1': { p100: { major: 900, minor: 75 }, p80: { major: 720, minor: 60 }, p70: { major: 630, minor: 53 }, p56: { major: 504, minor: 42 } },
        '2x2': { p100: { major: 900, minor: 100 }, p80: { major: 720, minor: 80 }, p70: { major: 630, minor: 70 }, p56: { major: 504, minor: 56 } },
        '1x2': { p100: { major: 750, minor: 100 }, p80: { major: 600, minor: 80 }, p70: { major: 525, minor: 70 }, p56: { major: 420, minor: 56 } }
    }
};

// Warrant 2: Four-Hour Vehicular Volume (MUTCD Figure 4C-1)
const SIGNAL_WARRANT2_CURVES = {
    '2x2': [{ major: 300, minor: 200 }, { major: 400, minor: 165 }, { major: 500, minor: 140 }, { major: 600, minor: 125 }, { major: 700, minor: 115 }, { major: 900, minor: 115 }, { major: 1200, minor: 115 }],
    '2x1': [{ major: 300, minor: 150 }, { major: 400, minor: 120 }, { major: 500, minor: 100 }, { major: 600, minor: 85 }, { major: 800, minor: 80 }, { major: 1200, minor: 80 }],
    '1x1': [{ major: 300, minor: 150 }, { major: 400, minor: 120 }, { major: 500, minor: 100 }, { major: 600, minor: 85 }, { major: 800, minor: 80 }, { major: 1200, minor: 80 }],
    '1x2': [{ major: 300, minor: 200 }, { major: 400, minor: 165 }, { major: 500, minor: 140 }, { major: 600, minor: 125 }, { major: 700, minor: 115 }, { major: 900, minor: 115 }, { major: 1200, minor: 115 }]
};

// Warrant 3: Peak Hour (MUTCD Figure 4C-2)
const SIGNAL_WARRANT3_CURVES = {
    '2x2': [{ major: 400, minor: 250 }, { major: 600, minor: 190 }, { major: 800, minor: 150 }, { major: 1000, minor: 150 }, { major: 1400, minor: 150 }],
    '2x1': [{ major: 400, minor: 200 }, { major: 600, minor: 145 }, { major: 800, minor: 100 }, { major: 1000, minor: 100 }, { major: 1400, minor: 100 }],
    '1x1': [{ major: 400, minor: 200 }, { major: 600, minor: 145 }, { major: 800, minor: 100 }, { major: 1000, minor: 100 }, { major: 1400, minor: 100 }],
    '1x2': [{ major: 400, minor: 250 }, { major: 600, minor: 190 }, { major: 800, minor: 150 }, { major: 1000, minor: 150 }, { major: 1400, minor: 150 }]
};

// Warrant 4: Pedestrian Volume Curves (Virginia MUTCD Figures 4C-5 through 4C-8)
const SIGNAL_WARRANT4_CURVES = {
    fourHour_100: [
        { major: 300, ped: 500 }, { major: 400, ped: 390 }, { major: 500, ped: 310 },
        { major: 600, ped: 250 }, { major: 700, ped: 205 }, { major: 800, ped: 170 },
        { major: 900, ped: 145 }, { major: 1000, ped: 125 }, { major: 1100, ped: 115 },
        { major: 1200, ped: 110 }, { major: 1400, ped: 107 }
    ],
    peakHour_100: [
        { major: 300, ped: 700 }, { major: 400, ped: 580 }, { major: 500, ped: 480 },
        { major: 600, ped: 400 }, { major: 700, ped: 340 }, { major: 800, ped: 290 },
        { major: 900, ped: 250 }, { major: 1000, ped: 215 }, { major: 1100, ped: 190 },
        { major: 1200, ped: 170 }, { major: 1400, ped: 145 }, { major: 1600, ped: 135 },
        { major: 1800, ped: 133 }
    ],
    fourHour_70: [
        { major: 200, ped: 400 }, { major: 300, ped: 280 }, { major: 400, ped: 200 },
        { major: 500, ped: 150 }, { major: 600, ped: 115 }, { major: 700, ped: 95 },
        { major: 800, ped: 82 }, { major: 900, ped: 77 }, { major: 1000, ped: 75 }
    ],
    peakHour_70: [
        { major: 200, ped: 500 }, { major: 300, ped: 380 }, { major: 400, ped: 290 },
        { major: 500, ped: 225 }, { major: 600, ped: 175 }, { major: 700, ped: 145 },
        { major: 800, ped: 120 }, { major: 900, ped: 105 }, { major: 1000, ped: 97 },
        { major: 1100, ped: 94 }, { major: 1200, ped: 93 }
    ],
    minThresholds: {
        fourHour_100: { normal: 107, slow: 53 },
        peakHour_100: { normal: 133, slow: 66 },
        fourHour_70: { normal: 75, slow: 37 },
        peakHour_70: { normal: 93, slow: 46 }
    }
};

// Warrant 5: School Crossing minimum
const SIGNAL_WARRANT5_MIN_SCHOOLCHILDREN = 20;

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.warrants = CL.warrants || {};
  window.SIGNAL_WARRANT1_THRESHOLDS = SIGNAL_WARRANT1_THRESHOLDS; CL.warrants.SIGNAL_WARRANT1_THRESHOLDS = SIGNAL_WARRANT1_THRESHOLDS;
  window.SIGNAL_WARRANT2_CURVES = SIGNAL_WARRANT2_CURVES; CL.warrants.SIGNAL_WARRANT2_CURVES = SIGNAL_WARRANT2_CURVES;
  window.SIGNAL_WARRANT3_CURVES = SIGNAL_WARRANT3_CURVES; CL.warrants.SIGNAL_WARRANT3_CURVES = SIGNAL_WARRANT3_CURVES;
  window.SIGNAL_WARRANT4_CURVES = SIGNAL_WARRANT4_CURVES; CL.warrants.SIGNAL_WARRANT4_CURVES = SIGNAL_WARRANT4_CURVES;
  window.SIGNAL_WARRANT5_MIN_SCHOOLCHILDREN = SIGNAL_WARRANT5_MIN_SCHOOLCHILDREN; CL.warrants.SIGNAL_WARRANT5_MIN_SCHOOLCHILDREN = SIGNAL_WARRANT5_MIN_SCHOOLCHILDREN;
  CL._registerModule('warrants/signal-thresholds');
})();
