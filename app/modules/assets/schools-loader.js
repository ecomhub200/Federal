/**
 * CL assets.schoolsLoader — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.assets.schoolsLoader.<fn>; module-private
 * state (0 external refs) stays inside this IIFE.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
/**
 * Update the schools tab - populate jurisdiction dropdown
 */
function schoolsUpdateJurisdictionInfo() {
    const selectEl = document.getElementById('schoolsJurisdictionSelect');
    const leaInfoEl = document.getElementById('schoolsLeaInfo');
    const fetchBtn = document.getElementById('schoolsFetchBtn');
    const yearEl = document.getElementById('schoolsDataYear');

    if (!selectEl || !leaInfoEl || !fetchBtn) return;

    // Hide year display initially
    if (yearEl) yearEl.style.display = 'none';

    // Populate dropdown with all jurisdictions that have FIPS codes
    if (window.appConfig && window.appConfig.jurisdictions) {
        const jurisdictions = Object.entries(window.appConfig.jurisdictions)
            .filter(([key, j]) => j.fips) // Only jurisdictions with FIPS codes
            .sort((a, b) => a[1].name.localeCompare(b[1].name));

        // Clear and repopulate
        selectEl.innerHTML = '<option value="">-- Select a jurisdiction --</option>';
        jurisdictions.forEach(([key, j]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = j.name;
            selectEl.appendChild(option);
        });

        // Try to auto-select detected jurisdiction
        const detectedJuris = detectCurrentJurisdiction();
        if (detectedJuris && window.appConfig.jurisdictions[detectedJuris]) {
            selectEl.value = detectedJuris;
            schoolsOnJurisdictionChange();
        }
    }
}

/**
 * Handle jurisdiction dropdown change
 */
function schoolsOnJurisdictionChange() {
    const selectEl = document.getElementById('schoolsJurisdictionSelect');
    const leaInfoEl = document.getElementById('schoolsLeaInfo');
    const fetchBtn = document.getElementById('schoolsFetchBtn');
    const yearEl = document.getElementById('schoolsDataYear');

    if (!selectEl) return;

    const selectedKey = selectEl.value;

    // Reset year display
    if (yearEl) yearEl.style.display = 'none';

    if (selectedKey && window.appConfig?.jurisdictions?.[selectedKey]) {
        const jurisConfig = window.appConfig.jurisdictions[selectedKey];
        schoolsState.jurisdiction = selectedKey;

        if (jurisConfig.fips) {
            schoolsState.countyFips = jurisConfig.fips;
            leaInfoEl.textContent = `FIPS: ${jurisConfig.fips} • Will load all schools in this jurisdiction`;
            fetchBtn.disabled = false;
        } else {
            leaInfoEl.textContent = 'FIPS code not configured for this jurisdiction';
            fetchBtn.disabled = true;
        }
    } else {
        schoolsState.jurisdiction = null;
        schoolsState.countyFips = null;
        leaInfoEl.textContent = 'Select a jurisdiction to load school data';
        fetchBtn.disabled = true;
    }
}

/**
 * Detect current jurisdiction from crash data or config
 */
function detectCurrentJurisdiction() {
    // First check if there's a selected jurisdiction in settings
    if (window.appConfig && window.appConfig.defaults && window.appConfig.defaults.jurisdiction) {
        return window.appConfig.defaults.jurisdiction;
    }

    // Try to detect from crash data filename or other indicators
    // For now, default to henrico if crash data is loaded
    if (crashState && crashState.loaded) {
        return 'henrico'; // Default - can be enhanced to auto-detect
    }

    return null;
}

/**
 * Show status message in the schools panel
 */
function schoolsShowStatus(message, type = 'loading') {
    const statusEl = document.getElementById('schoolsStatus');
    if (!statusEl) return;

    statusEl.className = 'arcgis-status ' + type;

    if (type === 'loading') {
        statusEl.innerHTML = `<div class="arcgis-spinner"></div><span>${message}</span>`;
    } else {
        statusEl.innerHTML = `<span>${message}</span>`;
    }

    statusEl.style.display = 'flex';
}

/**
 * Hide status message
 */
function schoolsHideStatus() {
    const statusEl = document.getElementById('schoolsStatus');
    if (statusEl) {
        statusEl.style.display = 'none';
    }
}

/**
 * Fetch schools data from Urban Institute API
 * Fetches ALL Virginia schools at once, then filters by county FIPS code
 * Auto-detects the latest available data year
 */
async function schoolsFetchData() {
    if (!schoolsState.countyFips) {
        schoolsShowStatus('No FIPS code configured for this jurisdiction', 'error');
        return;
    }

    if (schoolsState.loading) return;

    schoolsState.loading = true;
    const fetchBtn = document.getElementById('schoolsFetchBtn');
    if (fetchBtn) fetchBtn.disabled = true;

    schoolsShowStatus('Detecting latest available school data year...');

    try {
        // Auto-detect latest available year (data typically lags 1-2 years)
        const currentYear = new Date().getFullYear();
        const yearsToTry = [currentYear - 1, currentYear - 2, currentYear - 3];

        let data = null;
        let usedYear = null;

        for (const year of yearsToTry) {
            schoolsShowStatus(`Trying ${year} school data...`);
            const stateFipsNum = parseInt(jurisdictionContext.stateFips || (appConfig?.states?.[appConfig?.defaultState]?.fips || '08'), 10);
            const apiUrl = `https://educationdata.urban.org/api/v1/schools/ccd/directory/${year}/?fips=${stateFipsNum}`;
            console.log('[Schools] Trying year', year, ':', apiUrl);

            try {
                // Fetch all pages of results (API limits to 10,000 per page)
                let allResults = [];
                let nextUrl = apiUrl;
                let pageCount = 0;

                while (nextUrl && pageCount < 10) { // Max 10 pages safety limit
                    const response = await fetch(nextUrl);
                    if (!response.ok) break;

                    const result = await response.json();
                    if (result.results && result.results.length > 0) {
                        allResults = allResults.concat(result.results);
                        pageCount++;
                        console.log('[Schools] Page', pageCount, '- fetched', result.results.length, 'schools, total:', allResults.length);
                    }

                    // Check for next page
                    nextUrl = result.next || null;
                    if (nextUrl) {
                        schoolsShowStatus(`Fetching page ${pageCount + 1}...`);
                    }
                }

                if (allResults.length > 0) {
                    data = { results: allResults };
                    usedYear = year;
                    console.log('[Schools] Found data for year', year, '- total schools:', allResults.length);
                    break;
                }
            } catch (e) {
                console.log('[Schools] Year', year, 'failed:', e.message);
            }
        }

        if (!data || !usedYear) {
            throw new Error('No school data available for recent years');
        }

        schoolsShowStatus(`Found ${usedYear} data with ${data.results.length} schools. Filtering...`);

        // Get jurisdiction config for name matching fallback
        const jurisConfig = window.appConfig?.jurisdictions?.[schoolsState.jurisdiction];
        const jurisName = jurisConfig?.name || '';
        const jurisNameUpper = jurisName.toUpperCase();
        // Extract base name without "County" or "City" suffix for flexible matching
        const jurisBaseName = jurisName.replace(/ (County|City)$/i, '').toUpperCase();

        // Debug: Log first school to see ALL available fields
        // This helps identify the correct field names for county matching
        if (data.results.length > 0) {
            const sample = data.results[0];
            const allKeys = Object.keys(sample);
            console.log('[Schools] Sample school ALL KEYS:', allKeys);

            // Log all potential county-related fields
            const countyFields = allKeys.filter(k =>
                k.toLowerCase().includes('county') ||
                k.toLowerCase().includes('cnty') ||
                k.toLowerCase().includes('fips')
            );
            console.log('[Schools] County-related fields found:', countyFields);

            console.log('[Schools] Sample school county fields:', {
                county_code: sample.county_code,
                county_name: sample.county_name,
                county_fips: sample.county_fips,
                cnty: sample.cnty,
                fips: sample.fips,
                state_fips: sample.state_fips,
                leaid: sample.leaid,
                ncessch: sample.ncessch,
                targetFips: schoolsState.countyFips,
                targetName: jurisName
            });

            // Log unique county codes from ALL potential fields
            const getUniqueValues = (field) => [...new Set(data.results.map(s => s[field]).filter(Boolean))].slice(0, 10);
            console.log('[Schools] Unique county_code values:', getUniqueValues('county_code'));
            console.log('[Schools] Unique county_name values:', getUniqueValues('county_name'));
            console.log('[Schools] Unique cnty values:', getUniqueValues('cnty'));
            console.log('[Schools] Unique leaid values (first 10):', getUniqueValues('leaid'));
        }

        // Filter schools to match the current jurisdiction's county FIPS
        // Try multiple possible field names since the API schema may vary
        const targetFips = schoolsState.countyFips; // "087"
        const targetFipsNum = parseInt(targetFips, 10); // 87
        const stateFips = jurisdictionContext.stateFips || (appConfig?.states?.[appConfig?.defaultState]?.fips || '08');
        const fullStateFips = stateFips + targetFips; // e.g., "51087" for Virginia, "08035" for Colorado
        const fullStateFipsNum = parseInt(fullStateFips, 10);

        // Get LEA ID from config if available (for fallback matching)
        const configLeaId = jurisConfig?.education?.leaId;

        // Helper function to get county code from multiple possible fields
        const getCountyCode = (school) => {
            // Try various field names that APIs might use for county FIPS
            return school.county_code ??
                   school.county_fips ??
                   school.cnty ??
                   school.stcounty ??
                   school.county_fips_code ??
                   school.fips_county;
        };

        let matchMethod = 'none';
        const countySchools = data.results.filter(school => {
            // Method 1: Try county code from multiple possible field names
            const countyCode = getCountyCode(school);

            if (countyCode) {
                const codeStr = String(countyCode);
                const codeNum = parseInt(countyCode, 10);

                // Match full 5-digit state+county FIPS (51087)
                if (codeStr === fullStateFips || codeNum === fullStateFipsNum) {
                    matchMethod = 'fips_full';
                    return true;
                }

                // Match 3-digit county-only FIPS (087 or 87)
                if (codeStr === targetFips || codeStr.padStart(3, '0') === targetFips) {
                    matchMethod = 'fips_3digit';
                    return true;
                }
                if (codeNum === targetFipsNum) {
                    matchMethod = 'fips_num';
                    return true;
                }

                // Extract last 3 digits from 5-digit code
                if (codeStr.length >= 5) {
                    const last3 = codeStr.slice(-3);
                    if (last3 === targetFips || parseInt(last3, 10) === targetFipsNum) {
                        matchMethod = 'fips_last3';
                        return true;
                    }
                }
            }

            // Method 2: Match by LEA ID if configured
            if (configLeaId && school.leaid) {
                const schoolLeaId = String(school.leaid);
                if (schoolLeaId === configLeaId) {
                    matchMethod = 'leaid';
                    return true;
                }
            }

            // Method 3: Fallback to county_name matching
            if (school.county_name && jurisBaseName) {
                const schoolCountyName = String(school.county_name).toUpperCase().trim();
                // Also try removing common suffixes from API data
                const cleanedSchoolName = schoolCountyName.replace(/ (COUNTY|CITY)$/i, '');

                if (schoolCountyName === jurisNameUpper ||
                    schoolCountyName === jurisBaseName ||
                    cleanedSchoolName === jurisBaseName ||
                    schoolCountyName.includes(jurisBaseName) ||
                    jurisBaseName.includes(cleanedSchoolName)) {
                    matchMethod = 'name';
                    return true;
                }
            }

            return false;
        });

        console.log('[Schools] Filtered to', countySchools.length, 'schools for FIPS', targetFips, 'or name', jurisBaseName);
        console.log('[Schools] Primary match method:', matchMethod);

        if (countySchools.length === 0) {
            // Provide more helpful error message with comprehensive debug info
            const sampleSchools = data.results.slice(0, 5).map(s => ({
                county_code: s.county_code,
                county_fips: s.county_fips,
                cnty: s.cnty,
                county_name: s.county_name,
                leaid: s.leaid,
                school_name: s.school_name
            }));
            console.error('[Schools] No matches found. Sample schools:', sampleSchools);
            console.error('[Schools] Looking for:');
            console.error('  - Full FIPS:', fullStateFips);
            console.error('  - County FIPS:', targetFips);
            console.error('  - County name:', jurisBaseName);
            console.error('  - LEA ID:', configLeaId || 'not configured');

            // Try to suggest what the issue might be
            const firstSchool = data.results[0];
            if (firstSchool) {
                const allKeys = Object.keys(firstSchool);
                const possibleCountyFields = allKeys.filter(k =>
                    k.toLowerCase().includes('county') ||
                    k.toLowerCase().includes('cnty') ||
                    k.toLowerCase().includes('lea') ||
                    k.toLowerCase().includes('fips')
                );
                console.error('[Schools] Available fields that might contain county info:', possibleCountyFields);
            }

            throw new Error(`No schools found for ${jurisName} (FIPS ${schoolsState.countyFips}). Check browser console for debug info.`);
        }

        schoolsShowStatus(`Found ${countySchools.length} schools in county. Loading ${usedYear} enrollment...`);

        // Fetch enrollment data for the same year (with pagination support)
        const enrollStateFips = parseInt(jurisdictionContext.stateFips || (appConfig?.states?.[appConfig?.defaultState]?.fips || '08'), 10);
        const enrollmentUrl = `https://educationdata.urban.org/api/v1/schools/ccd/enrollment/${usedYear}/grade-99/?fips=${enrollStateFips}`;
        console.log('[Schools] Fetching enrollment from:', enrollmentUrl);

        // Fetch all enrollment pages
        let allEnrollment = [];
        let nextEnrollUrl = enrollmentUrl;
        let enrollPageCount = 0;

        while (nextEnrollUrl && enrollPageCount < 10) {
            const enrollResponse = await fetch(nextEnrollUrl);
            if (!enrollResponse.ok) break;

            const enrollData = await enrollResponse.json();
            if (enrollData.results && enrollData.results.length > 0) {
                allEnrollment = allEnrollment.concat(enrollData.results);
                enrollPageCount++;
            }

            nextEnrollUrl = enrollData.next || null;
            if (nextEnrollUrl) {
                schoolsShowStatus(`Loading enrollment page ${enrollPageCount + 1}...`);
            }
        }

        console.log('[Schools] Total enrollment records fetched:', allEnrollment.length);

        // Create enrollment lookup by ncessch
        const enrollmentMap = new Map();
        allEnrollment.forEach(e => {
            if (e.ncessch && e.enrollment) {
                const existing = enrollmentMap.get(e.ncessch) || 0;
                enrollmentMap.set(e.ncessch, existing + e.enrollment);
            }
        });

        console.log('[Schools] Enrollment records mapped:', enrollmentMap.size);

        // Store the year used for display
        schoolsState.dataYear = usedYear;

        // Process and combine data (only county-filtered schools)
        schoolsState.data = countySchools
            .filter(school => school.latitude && school.longitude)
            .map(school => ({
                ncessch: school.ncessch,
                name: school.school_name || 'Unknown School',
                lat: parseFloat(school.latitude),
                lng: parseFloat(school.longitude),
                level: school.school_level || 'Unknown',
                grades: `${school.lowest_grade_offered || '?'}-${school.highest_grade_offered || '?'}`,
                enrollment: enrollmentMap.get(school.ncessch) || 0,
                charter: school.charter === 1 ? 'Yes' : 'No',
                address: `${school.street_location || ''}, ${school.city_location || ''}`
            }));

        console.log('[Schools] Processed', schoolsState.data.length, 'schools for county', schoolsState.countyFips);

        schoolsShowStatus(`Loaded ${schoolsState.data.length} schools (${usedYear} data)`, 'success');

        // Show preview
        schoolsShowPreview();

    } catch (error) {
        console.error('[Schools] Fetch error:', error);
        schoolsShowStatus(`Error: ${error.message}`, 'error');
    } finally {
        schoolsState.loading = false;
        if (fetchBtn) fetchBtn.disabled = false;
    }
}

/**
 * Show preview table of fetched schools
 */
function schoolsShowPreview() {
    const previewEl = document.getElementById('schoolsPreview');
    const tableEl = document.getElementById('schoolsPreviewTable');
    const yearEl = document.getElementById('schoolsDataYear');

    if (!previewEl || !tableEl || schoolsState.data.length === 0) return;

    // Show data year
    if (yearEl && schoolsState.dataYear) {
        yearEl.textContent = `📅 Enrollment data from ${schoolsState.dataYear}-${schoolsState.dataYear + 1} school year`;
        yearEl.style.display = 'block';
    }

    // Sort by enrollment descending
    const sortedSchools = [...schoolsState.data].sort((a, b) => b.enrollment - a.enrollment);

    // Show first 10 schools
    const preview = sortedSchools.slice(0, 10);

    let html = `
        <table style="width:100%;border-collapse:collapse;font-size:.8rem">
            <thead>
                <tr style="background:var(--light)">
                    <th style="padding:.5rem;text-align:left;border-bottom:1px solid var(--border)">School</th>
                    <th style="padding:.5rem;text-align:center;border-bottom:1px solid var(--border)">Level</th>
                    <th style="padding:.5rem;text-align:right;border-bottom:1px solid var(--border)">Enrollment</th>
                </tr>
            </thead>
            <tbody>
    `;

    preview.forEach(school => {
        html += `
            <tr>
                <td style="padding:.4rem .5rem;border-bottom:1px solid var(--border)">${school.name}</td>
                <td style="padding:.4rem .5rem;text-align:center;border-bottom:1px solid var(--border)">${school.level}</td>
                <td style="padding:.4rem .5rem;text-align:right;border-bottom:1px solid var(--border)">${school.enrollment.toLocaleString()}</td>
            </tr>
        `;
    });

    if (sortedSchools.length > 10) {
        html += `
            <tr>
                <td colspan="3" style="padding:.4rem .5rem;text-align:center;color:var(--gray);font-style:italic">
                    ... and ${sortedSchools.length - 10} more schools
                </td>
            </tr>
        `;
    }

    html += '</tbody></table>';

    tableEl.innerHTML = html;
    previewEl.style.display = 'block';
}

/**
 * Confirm loading schools into asset analysis
 */
async function schoolsConfirmLoad() {
    if (schoolsState.data.length === 0) return;

    schoolsShowStatus('Adding schools to analysis...', 'loading');

    try {
        // Create asset object compatible with the asset module
        const schoolAsset = {
            id: 'schools_' + Date.now(),
            name: `Schools - ${window.appConfig?.jurisdictions?.[schoolsState.jurisdiction]?.name || 'Jurisdiction'}`,
            type: 'school',
            source: 'urban_institute',
            uploadedAt: new Date().toISOString(),
            jurisdiction: (typeof jurisdictionContext !== 'undefined' && jurisdictionContext.jurisdictionName) || '',
            locations: schoolsState.data.map(school => ({
                id: school.ncessch,  // Unique ID required for crash association
                name: school.name,
                lat: school.lat,
                lng: school.lng,
                metadata: {
                    ncessch: school.ncessch,
                    level: school.level,
                    grades: school.grades,
                    enrollment: school.enrollment,
                    charter: school.charter,
                    address: school.address
                }
            }))
        };

        // Save to IndexedDB
        await assetDbSave(schoolAsset);

        // Add to state
        assetState.assets.push(schoolAsset);
        assetState.activeAssetIds.push(schoolAsset.id);

        // Update UI
        assetRenderList();
        document.getElementById('assetListContainer').style.display = 'block';
        document.getElementById('assetClearAllBtn').style.display = 'inline-flex';
        document.getElementById('assetRadiusCard').style.display = 'block';

        // Run analysis
        await assetRunAnalysis();

        schoolsShowStatus(`Added ${schoolsState.data.length} schools to analysis`, 'success');

        // Hide preview
        document.getElementById('schoolsPreview').style.display = 'none';

        // Clear schools data
        schoolsState.data = [];

    } catch (error) {
        console.error('[Schools] Error adding to analysis:', error);
        schoolsShowStatus(`Error: ${error.message}`, 'error');
    }
}

/**
 * Cancel schools loading
 */
function schoolsCancelLoad() {
    schoolsState.data = [];
    document.getElementById('schoolsPreview').style.display = 'none';
    schoolsHideStatus();
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.assets = CL.assets || {};
  CL.assets.schoolsLoader = CL.assets.schoolsLoader || {};
  window.schoolsUpdateJurisdictionInfo = schoolsUpdateJurisdictionInfo; CL.assets.schoolsLoader.schoolsUpdateJurisdictionInfo = schoolsUpdateJurisdictionInfo;
  window.schoolsOnJurisdictionChange = schoolsOnJurisdictionChange; CL.assets.schoolsLoader.schoolsOnJurisdictionChange = schoolsOnJurisdictionChange;
  window.detectCurrentJurisdiction = detectCurrentJurisdiction; CL.assets.schoolsLoader.detectCurrentJurisdiction = detectCurrentJurisdiction;
  window.schoolsShowStatus = schoolsShowStatus; CL.assets.schoolsLoader.schoolsShowStatus = schoolsShowStatus;
  window.schoolsHideStatus = schoolsHideStatus; CL.assets.schoolsLoader.schoolsHideStatus = schoolsHideStatus;
  window.schoolsFetchData = schoolsFetchData; CL.assets.schoolsLoader.schoolsFetchData = schoolsFetchData;
  window.schoolsShowPreview = schoolsShowPreview; CL.assets.schoolsLoader.schoolsShowPreview = schoolsShowPreview;
  window.schoolsConfirmLoad = schoolsConfirmLoad; CL.assets.schoolsLoader.schoolsConfirmLoad = schoolsConfirmLoad;
  window.schoolsCancelLoad = schoolsCancelLoad; CL.assets.schoolsLoader.schoolsCancelLoad = schoolsCancelLoad;
  CL._registerModule('assets/schools-loader');
})();
