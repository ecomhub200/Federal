/**
 * CL assets.arcgis — URL validate/fetch + field modal + projection helpers
 * Extracted verbatim from app/index.html (ArcGIS feature-service import
 * pipeline). NO behavior change. Dual-exposed window.<fn> + CL.assets.arcgis.<fn>.
 * Self-contained; reads crashState/COL/showToast/DOM via global scope.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
/**
 * Show status message in the ArcGIS panel
 */
function arcgisShowStatus(message, type = 'loading') {
    const statusEl = document.getElementById('arcgisStatus');
    if (!statusEl) return;

    statusEl.style.display = 'flex';
    statusEl.className = `arcgis-status ${type}`;

    if (type === 'loading') {
        statusEl.innerHTML = `<div class="arcgis-spinner"></div><span>${message}</span>`;
    } else {
        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
        statusEl.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    }
}

/**
 * Hide status message
 */
function arcgisHideStatus() {
    const statusEl = document.getElementById('arcgisStatus');
    if (statusEl) {
        statusEl.style.display = 'none';
    }
}

/**
 * Normalize ArcGIS service URL to ensure it has the correct format
 */
function arcgisNormalizeUrl(url) {
    if (!url) return null;

    let normalized = url.trim();

    // Remove trailing slashes
    normalized = normalized.replace(/\/+$/, '');

    // Remove query parameters
    normalized = normalized.split('?')[0];

    // Ensure it ends with a layer index if not present
    if (!normalized.match(/\/\d+$/)) {
        // Check if it ends with FeatureServer or MapServer
        if (normalized.match(/\/(FeatureServer|MapServer)$/i)) {
            normalized += '/0';
        }
    }

    return normalized;
}

/**
 * Validate ArcGIS service URL format
 */
function arcgisValidateUrl(url) {
    if (!url) {
        return { valid: false, error: 'Please enter a URL' };
    }

    // Check for basic URL structure
    if (!url.match(/^https?:\/\//i)) {
        return { valid: false, error: 'URL must start with http:// or https://' };
    }

    // Check for ArcGIS service pattern
    if (!url.match(/\/(FeatureServer|MapServer)\/\d+$/i) &&
        !url.match(/\/(FeatureServer|MapServer)$/i)) {
        return { valid: false, error: 'URL should end with /FeatureServer/0 or /MapServer/0' };
    }

    // Check for ArcGIS REST services domain patterns
    const validPatterns = [
        /services\d*\.arcgis\.com/i,
        /arcgis\.com/i,
        /\/arcgis\/rest\/services\//i,
        /\/rest\/services\//i
    ];

    const hasValidPattern = validPatterns.some(p => p.test(url));
    if (!hasValidPattern) {
        return { valid: false, error: 'URL does not appear to be a valid ArcGIS REST service' };
    }

    return { valid: true };
}

/**
 * Fetch ArcGIS Feature Service metadata and validate geometry
 */
async function arcgisFetchService() {
    const urlInput = document.getElementById('arcgisServiceUrl');
    const rawUrl = urlInput?.value;

    if (!rawUrl) {
        arcgisShowStatus('Please enter a Feature Service URL', 'error');
        return;
    }

    const normalizedUrl = arcgisNormalizeUrl(rawUrl);
    const validation = arcgisValidateUrl(normalizedUrl);

    if (!validation.valid) {
        arcgisShowStatus(validation.error, 'error');
        return;
    }

    arcgisState.serviceUrl = normalizedUrl;
    arcgisState.loading = true;

    const fetchBtn = document.getElementById('arcgisFetchBtn');
    if (fetchBtn) {
        fetchBtn.disabled = true;
        fetchBtn.innerHTML = '<div class="arcgis-spinner"></div> Connecting...';
    }

    arcgisShowStatus('Connecting to ArcGIS service...', 'loading');

    try {
        // Fetch service metadata
        console.log(`[ArcGIS] Fetching service info from: ${normalizedUrl}`);
        const metadataUrl = `${normalizedUrl}?f=json`;

        const response = await fetch(metadataUrl);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const serviceInfo = await response.json();
        console.log('[ArcGIS] Service info:', serviceInfo);

        // Check for ArcGIS error response
        if (serviceInfo.error) {
            throw new Error(serviceInfo.error.message || 'Service returned an error');
        }

        // Validate geometry type
        const geomType = serviceInfo.geometryType;
        if (!geomType) {
            throw new Error('Could not determine geometry type. Service may not contain spatial data.');
        }

        if (geomType !== 'esriGeometryPoint') {
            throw new Error(`This service has ${geomType} geometry. Only Point geometry is supported for infrastructure assets.`);
        }

        // Store service info
        arcgisState.serviceInfo = serviceInfo;
        arcgisState.fields = serviceInfo.fields || [];
        arcgisState.geometryType = geomType;
        arcgisState.spatialReference = serviceInfo.extent?.spatialReference || serviceInfo.sourceSpatialReference;

        // Get feature count (use maxRecordCount as estimate if count not available)
        let featureCount = 'Unknown';
        try {
            const countUrl = `${normalizedUrl}/query?where=1=1&returnCountOnly=true&f=json`;
            const countResponse = await fetch(countUrl);
            const countData = await countResponse.json();
            if (countData.count !== undefined) {
                featureCount = countData.count.toLocaleString();
            }
        } catch (e) {
            console.warn('[ArcGIS] Could not get exact count:', e);
            if (serviceInfo.maxRecordCount) {
                featureCount = `up to ${serviceInfo.maxRecordCount.toLocaleString()}`;
            }
        }

        // Update UI with service info
        const serviceInfoEl = document.getElementById('arcgisServiceInfo');
        if (serviceInfoEl) {
            document.getElementById('arcgisServiceName').textContent = serviceInfo.name || 'Unnamed Service';
            document.getElementById('arcgisFeatureCount').textContent = `${featureCount} features`;
            document.getElementById('arcgisGeometryType').textContent = 'Point Geometry';
            serviceInfoEl.style.display = 'block';
        }

        arcgisShowStatus(`Connected successfully! ${featureCount} features available.`, 'success');

        // Open field mapping modal
        arcgisShowFieldModal(serviceInfo, featureCount);

    } catch (error) {
        console.error('[ArcGIS] Fetch error:', error);

        let errorMessage = error.message;
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = 'Network error. Check if the service URL is correct and publicly accessible (CORS-enabled).';
        }

        arcgisShowStatus(errorMessage, 'error');

        // Hide service info on error
        const serviceInfoEl = document.getElementById('arcgisServiceInfo');
        if (serviceInfoEl) {
            serviceInfoEl.style.display = 'none';
        }

    } finally {
        arcgisState.loading = false;
        if (fetchBtn) {
            fetchBtn.disabled = false;
            fetchBtn.innerHTML = '<span>🔍</span> Connect';
        }
    }
}

/**
 * Show the field mapping modal
 */
function arcgisShowFieldModal(serviceInfo, featureCount) {
    const modal = document.getElementById('arcgisFieldModal');
    if (!modal) return;

    // Update service info in modal
    document.getElementById('arcgisModalServiceName').textContent = serviceInfo.name || 'ArcGIS Feature Service';
    document.getElementById('arcgisModalFeatureCount').textContent = `${featureCount} features will be imported`;

    // Populate name field dropdown
    const nameFieldSelect = document.getElementById('arcgisNameField');
    if (nameFieldSelect) {
        const fields = arcgisState.fields.filter(f =>
            f.type === 'esriFieldTypeString' ||
            f.type === 'esriFieldTypeInteger' ||
            f.type === 'esriFieldTypeSmallInteger' ||
            f.type === 'esriFieldTypeOID'
        );

        nameFieldSelect.innerHTML = '<option value="">-- Auto-generate IDs --</option>';
        fields.forEach(field => {
            const displayName = field.alias || field.name;
            nameFieldSelect.innerHTML += `<option value="${field.name}">${esc(displayName)}</option>`;
        });

        // Try to auto-select a likely ID field
        const idPatterns = ['id', 'objectid', 'signal_id', 'asset_id', 'pole_id', 'sign_id', 'name'];
        for (const pattern of idPatterns) {
            const match = fields.find(f => f.name.toLowerCase().includes(pattern));
            if (match) {
                nameFieldSelect.value = match.name;
                break;
            }
        }
    }

    // Update geometry info
    const wkid = arcgisState.spatialReference?.wkid || arcgisState.spatialReference?.latestWkid;
    let geomInfo = 'Point geometry will be used for coordinates';
    if (wkid) {
        if (wkid === 4326) {
            geomInfo = 'Point geometry (WGS 84 - ready to use)';
        } else if (wkid === 102100 || wkid === 3857) {
            geomInfo = 'Point geometry (Web Mercator - will be converted)';
        } else {
            geomInfo = `Point geometry (WKID: ${wkid} - will be converted)`;
        }
    }
    document.getElementById('arcgisGeometryInfo').textContent = geomInfo;

    // Set default asset name from service name
    const assetNameInput = document.getElementById('arcgisAssetName');
    if (assetNameInput && serviceInfo.name) {
        assetNameInput.value = serviceInfo.name;
    }

    // Try to auto-detect asset type from service name
    const assetTypeSelect = document.getElementById('arcgisAssetType');
    if (assetTypeSelect && serviceInfo.name) {
        const name = serviceInfo.name.toLowerCase();
        if (name.includes('signal')) assetTypeSelect.value = 'traffic_signal';
        else if (name.includes('stop')) assetTypeSelect.value = 'stop_sign';
        else if (name.includes('light') || name.includes('lamp')) assetTypeSelect.value = 'streetlight';
        else if (name.includes('beacon') || name.includes('rrfb') || name.includes('phb')) assetTypeSelect.value = 'pedestrian_beacon';
        else if (name.includes('crosswalk') || name.includes('xwalk')) assetTypeSelect.value = 'crosswalk';
    }

    modal.style.display = 'flex';
}

/**
 * Close field mapping modal
 */
function arcgisCloseFieldModal() {
    const modal = document.getElementById('arcgisFieldModal');
    if (modal) {
        modal.style.display = 'none';
    }
    arcgisState.features = null;
}

/**
 * Toggle custom type input visibility based on dropdown selection
 */
function arcgisToggleCustomType() {
    const assetTypeSelect = document.getElementById('arcgisAssetType');
    const customContainer = document.getElementById('arcgisCustomTypeContainer');
    if (assetTypeSelect && customContainer) {
        customContainer.style.display = assetTypeSelect.value === 'custom' ? 'block' : 'none';
        // Focus the input when showing
        if (assetTypeSelect.value === 'custom') {
            const customInput = document.getElementById('arcgisCustomTypeName');
            if (customInput) customInput.focus();
        }
    }
}

/**
 * Convert Web Mercator (EPSG:3857) coordinates to WGS84 (EPSG:4326)
 */
function arcgisWebMercatorToWGS84(x, y) {
    const lng = (x / 20037508.34) * 180;
    let lat = (y / 20037508.34) * 180;
    lat = (180 / Math.PI) * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
    return { lat, lng };
}

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.assets = CL.assets || {};
  CL.assets.arcgis = CL.assets.arcgis || {};
  window.arcgisShowStatus = arcgisShowStatus; CL.assets.arcgis.arcgisShowStatus = arcgisShowStatus;
  window.arcgisHideStatus = arcgisHideStatus; CL.assets.arcgis.arcgisHideStatus = arcgisHideStatus;
  window.arcgisNormalizeUrl = arcgisNormalizeUrl; CL.assets.arcgis.arcgisNormalizeUrl = arcgisNormalizeUrl;
  window.arcgisValidateUrl = arcgisValidateUrl; CL.assets.arcgis.arcgisValidateUrl = arcgisValidateUrl;
  window.arcgisFetchService = arcgisFetchService; CL.assets.arcgis.arcgisFetchService = arcgisFetchService;
  window.arcgisShowFieldModal = arcgisShowFieldModal; CL.assets.arcgis.arcgisShowFieldModal = arcgisShowFieldModal;
  window.arcgisCloseFieldModal = arcgisCloseFieldModal; CL.assets.arcgis.arcgisCloseFieldModal = arcgisCloseFieldModal;
  window.arcgisToggleCustomType = arcgisToggleCustomType; CL.assets.arcgis.arcgisToggleCustomType = arcgisToggleCustomType;
  window.arcgisWebMercatorToWGS84 = arcgisWebMercatorToWGS84; CL.assets.arcgis.arcgisWebMercatorToWGS84 = arcgisWebMercatorToWGS84;
  CL._registerModule('assets/assets-arcgis');
})();
