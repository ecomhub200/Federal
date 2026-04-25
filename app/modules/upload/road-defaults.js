/**
 * CrashLens Road Type Defaults Module
 *
 * Always defaults the Road Type Filter to "All Roads" (value `allRoads`).
 * User selections persisted via the Save Preferences button take precedence
 * — explicit choices are never overridden on reload or on jurisdiction change.
 */
(function () {
    'use strict';

    var RADIO_MAP = {
        'countyOnly': 'filterCountyOnly',
        'cityOnly': 'filterCityOnly',
        'countyPlusVDOT': 'filterCountyPlusVDOT',
        'allRoads': 'filterAllRoads'
    };

    function getDefaultRoadType() {
        return 'allRoads';
    }

    /**
     * Apply the default road type to the UI radio buttons.
     * Respects user manual overrides on reload unless `options.force` is true.
     *
     * @param {string} [jurisdictionId] - Jurisdiction key (kept for API compat).
     * @param {Object} [options] - Options
     * @param {boolean} [options.force] - Force apply even if user explicitly saved a preference
     * @returns {string} The road type that was applied
     */
    function applyDefaultRoadType(jurisdictionId, options) {
        var opts = options || {};
        var defaultType = getDefaultRoadType();
        var radio = document.getElementById(RADIO_MAP[defaultType]);
        if (!radio) {
            console.warn('[RoadDefaults] Radio button not found for', defaultType);
            return defaultType;
        }

        if (!opts.force) {
            var userExplicitlySaved = localStorage.getItem('userPreferencesSaved') === 'true';
            var savedFilter = localStorage.getItem('selectedFilterProfile');
            if (userExplicitlySaved && savedFilter) {
                console.log('[RoadDefaults] User has explicit preference:', savedFilter, '— not overriding');
                return savedFilter;
            }
        }

        radio.checked = true;
        localStorage.setItem('selectedFilterProfile', defaultType);
        console.log('[RoadDefaults] Applied default:', defaultType,
            'for jurisdiction:', jurisdictionId || '(auto)');
        return defaultType;
    }

    CL.upload = CL.upload || {};
    CL.upload.roadDefaults = {
        getDefaultRoadType: getDefaultRoadType,
        applyDefaultRoadType: applyDefaultRoadType
    };

    CL._registerModule('upload/road-defaults');

})();
