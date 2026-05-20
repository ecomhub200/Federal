/** CL grants.controls — grant filter+aggregation control handlers extracted 2026-05-20.
 * No behavior change. Reads inline grantState + GRANT_SCORING_PROFILES (global). */
(function () {
  'use strict';

  // ─── EXTRACTED CODE START (verbatim from app/index.html L30561–L30613) ───
// Apply location limit based on dropdown selection
function applyLocationLimit() {
    const limit = grantState.locationLimit;
    if (limit === 'all' || limit === 0) {
        grantState.rankedLocations = [...grantState.allRankedLocations];
    } else {
        grantState.rankedLocations = grantState.allRankedLocations.slice(0, limit);
    }
}

// Handle location limit dropdown change
function changeLocationLimit() {
    const selectEl = document.getElementById('grantLocationLimit');
    const value = selectEl.value;
    grantState.locationLimit = value === 'all' ? 'all' : parseInt(value);
    applyLocationLimit();
    grantState.selectedLocationIndices = [];
    grantState.selectedLocationIdx = null;
    displayGrantLocations();
}

// UI Control Handlers for Enhanced Grant Matching
function changeGrantAggregation() {
    const select = document.getElementById('grantAggregationLevel');
    grantState.aggregationLevel = select.value;
    rankLocationsForGrants();
}

function changeGrantScoringProfile() {
    const select = document.getElementById('grantScoringProfile');
    grantState.scoringProfile = select.value;

    // Show profile banner
    const profile = GRANT_SCORING_PROFILES[select.value];
    if (profile) {
        const banner = document.getElementById('scoringProfileBanner');
        document.getElementById('scoringProfileName').textContent = profile.name;
        document.getElementById('scoringProfileDesc').textContent = profile.description;
        banner.style.display = 'block';
    }

    rankLocationsForGrants();
}

function hideScoringProfileBanner() {
    document.getElementById('scoringProfileBanner').style.display = 'none';
}

function changeGrantMinCrashes() {
    const input = document.getElementById('grantMinCrashes');
    grantState.minCrashThreshold = parseInt(input.value) || 3;
    rankLocationsForGrants();
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.grants = CL.grants || {};
  CL.grants.controls = CL.grants.controls || {};

  // Dual public API (HTML onclick + CL namespace)
  window.applyLocationLimit = applyLocationLimit;
  CL.grants.controls.applyLocationLimit = applyLocationLimit;
  window.changeLocationLimit = changeLocationLimit;
  CL.grants.controls.changeLocationLimit = changeLocationLimit;
  window.changeGrantAggregation = changeGrantAggregation;
  CL.grants.controls.changeGrantAggregation = changeGrantAggregation;
  window.changeGrantScoringProfile = changeGrantScoringProfile;
  CL.grants.controls.changeGrantScoringProfile = changeGrantScoringProfile;
  window.hideScoringProfileBanner = hideScoringProfileBanner;
  CL.grants.controls.hideScoringProfileBanner = hideScoringProfileBanner;
  window.changeGrantMinCrashes = changeGrantMinCrashes;
  CL.grants.controls.changeGrantMinCrashes = changeGrantMinCrashes;

  CL._registerModule('grants/grants-controls');
})();
