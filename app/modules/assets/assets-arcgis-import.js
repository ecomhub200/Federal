/**
 * CL assets.arcgis — feature import + paged fetch + asset save
 * Extracted verbatim from app/index.html (ArcGIS feature-service import
 * pipeline). NO behavior change. Dual-exposed window.<fn> + CL.assets.arcgis.<fn>.
 * Self-contained; reads crashState/COL/showToast/DOM via global scope.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
/**
 * Import features from ArcGIS service
 */
async function arcgisImportFeatures() {
    let assetType = document.getElementById('arcgisAssetType')?.value || 'default';
    const nameField = document.getElementById('arcgisNameField')?.value || '';
    const assetName = document.getElementById('arcgisAssetName')?.value?.trim() || 'ArcGIS Assets';

    // Handle custom asset type
    let customTypeLabel = null;
    if (assetType === 'custom') {
        const customTypeName = document.getElementById('arcgisCustomTypeName')?.value?.trim();
        if (!customTypeName) {
            assetShowNotification('Please enter a custom asset type name.', 'error');
            return;
        }
        customTypeLabel = customTypeName;
        // Create a unique type key from the custom name
        assetType = 'custom_' + customTypeName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    }

    if (!arcgisState.serviceUrl) {
        assetShowNotification('No service connected. Please connect to a service first.', 'error');
        return;
    }

    const importBtn = document.getElementById('arcgisImportBtn');
    if (importBtn) {
        importBtn.disabled = true;
        importBtn.innerHTML = 'Importing...';
    }

    assetShowLoading(true, 'Fetching features from ArcGIS...');

    try {
        // Fetch all features with pagination handling
        const features = await arcgisFetchAllFeatures(arcgisState.serviceUrl, nameField);

        if (!features || features.length === 0) {
            throw new Error('No features returned from the service');
        }

        console.log(`[ArcGIS] Fetched ${features.length} features`);
        assetShowLoading(true, `Processing ${features.length} features...`);

        // Convert features to asset locations
        // Note: We request outSR=4326 in the query, so coordinates should already be WGS84
        const locations = [];
        let outOfBounds = 0;
        let skippedNoGeom = 0;
        let skippedInvalidCoords = 0;

        // Log first feature for debugging
        if (features.length > 0) {
            console.log('[ArcGIS] Sample feature structure:', JSON.stringify(features[0], null, 2).substring(0, 500));
        }

        for (let i = 0; i < features.length; i++) {
            const feature = features[i];
            const geom = feature.geometry;
            const attrs = feature.attributes || {};

            if (!geom || geom.x === undefined || geom.y === undefined) {
                skippedNoGeom++;
                if (skippedNoGeom <= 3) {
                    console.warn(`[ArcGIS] Feature ${i} missing geometry:`, { geom, attrs });
                }
                continue;
            }

            // Coordinates should be WGS84 since we requested outSR=4326
            const lat = geom.y;
            const lng = geom.x;

            // Validate coordinates
            if (isNaN(lat) || isNaN(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
                skippedInvalidCoords++;
                if (skippedInvalidCoords <= 3) {
                    console.warn(`[ArcGIS] Invalid coordinates for feature ${i}:`, { lat, lng, geom });
                }
                continue;
            }

            const inBounds = assetValidateVirginiaBounds(lat, lng);
            if (!inBounds) outOfBounds++;

            // Build name from selected field or generate
            let name = '';
            if (nameField && attrs[nameField] !== undefined && attrs[nameField] !== null) {
                name = String(attrs[nameField]);
            } else {
                name = `Location ${i + 1}`;
            }

            // Store all attributes as metadata
            const metadata = { ...attrs };

            locations.push({
                id: `loc_${i}`,
                name: name,
                lat: lat,
                lng: lng,
                inBounds: inBounds,
                metadata: metadata,
                sourceType: 'arcgis'
            });

            // Update progress
            if (i % 500 === 0) {
                assetUpdateProgress((i / features.length) * 80);
                await new Promise(r => setTimeout(r, 0));
            }
        }

        console.log(`[ArcGIS] Processing summary: ${locations.length} valid, ${skippedNoGeom} no geometry, ${skippedInvalidCoords} invalid coords, ${outOfBounds} outside ${jurisdictionContext?.stateName || 'state'} bounds`);

        if (locations.length === 0) {
            const errorDetails = [];
            if (skippedNoGeom > 0) errorDetails.push(`${skippedNoGeom} had no geometry`);
            if (skippedInvalidCoords > 0) errorDetails.push(`${skippedInvalidCoords} had invalid coordinates`);
            throw new Error(`No valid point locations found. ${errorDetails.join(', ') || 'Features may not have point geometry.'}`);
        }

        // Handle out-of-bounds locations
        if (outOfBounds > 0 && outOfBounds === locations.length) {
            assetShowLoading(false);
            arcgisCloseFieldModal();
            assetState.pendingUpload = { locations, filename: assetName, outOfBounds, assetType, customTypeLabel };
            assetShowBoundsWarning(outOfBounds, locations.length, locations, assetName);
            return;
        }

        if (outOfBounds > 0) {
            // Filter to only valid locations
            const validLocations = locations.filter(l => l.inBounds);
            assetShowNotification(`${outOfBounds} locations outside ${jurisdictionContext?.stateName || 'state'} bounds were excluded. ${validLocations.length} imported.`, 'warning');
            await arcgisSaveAsset(validLocations, assetName, assetType, customTypeLabel);
        } else {
            await arcgisSaveAsset(locations, assetName, assetType, customTypeLabel);
        }

        // Close modal and clear state
        arcgisCloseFieldModal();

        // Clear URL input
        const urlInput = document.getElementById('arcgisServiceUrl');
        if (urlInput) urlInput.value = '';

        // Hide service info
        const serviceInfoEl = document.getElementById('arcgisServiceInfo');
        if (serviceInfoEl) serviceInfoEl.style.display = 'none';

        arcgisHideStatus();

    } catch (error) {
        console.error('[ArcGIS] Import error:', error);
        assetShowNotification('Import failed: ' + error.message, 'error');
        assetShowLoading(false);

    } finally {
        if (importBtn) {
            importBtn.disabled = false;
            importBtn.innerHTML = 'Import Assets';
        }
    }
}

/**
 * Fetch all features from ArcGIS service with pagination
 */
async function arcgisFetchAllFeatures(serviceUrl, nameField) {
    const allFeatures = [];
    const batchSize = 1000; // Most ArcGIS services have maxRecordCount of 1000-2000
    let offset = 0;
    let hasMore = true;

    // Build outFields - get geometry fields and the name field
    let outFields = '*';
    if (nameField) {
        // Request only essential fields to reduce payload
        outFields = nameField;
    }

    while (hasMore) {
        const queryUrl = new URL(`${serviceUrl}/query`);
        queryUrl.searchParams.set('where', '1=1');
        queryUrl.searchParams.set('outFields', outFields);
        queryUrl.searchParams.set('returnGeometry', 'true');
        queryUrl.searchParams.set('outSR', '4326'); // Request WGS84 coordinates - fixes State Plane/other projections
        queryUrl.searchParams.set('resultOffset', offset.toString());
        queryUrl.searchParams.set('resultRecordCount', batchSize.toString());
        queryUrl.searchParams.set('f', 'json');

        console.log(`[ArcGIS] Fetching batch at offset ${offset}...`);

        const response = await fetch(queryUrl.toString());

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'Query failed');
        }

        const features = data.features || [];
        allFeatures.push(...features);

        console.log(`[ArcGIS] Received ${features.length} features (total: ${allFeatures.length})`);

        // Check if there are more features
        if (features.length < batchSize) {
            hasMore = false;
        } else {
            offset += batchSize;
        }

        // Safety limit to prevent infinite loops
        if (allFeatures.length > 100000) {
            console.warn('[ArcGIS] Reached safety limit of 100,000 features');
            hasMore = false;
        }

        // Update progress
        assetShowLoading(true, `Fetched ${allFeatures.length.toLocaleString()} features...`);
    }

    return allFeatures;
}

/**
 * Save ArcGIS-imported asset to storage
 */
async function arcgisSaveAsset(locations, assetName, assetType, customTypeLabel = null) {
    assetShowLoading(true, 'Saving asset...');

    const asset = {
        id: 'asset_' + Date.now(),
        name: assetName,
        filename: `${assetName} (ArcGIS)`,
        type: assetType,
        customTypeLabel: customTypeLabel, // Store custom label for display
        uploadDate: new Date().toISOString(),
        locationCount: locations.length,
        active: true,
        locations: locations,
        source: 'arcgis',
        sourceUrl: arcgisState.serviceUrl
    };

    try {
        await assetDbSave(asset);
        assetState.assets.push(asset);
        assetState.activeAssetIds.push(asset.id);
        assetSaveSettings();

        console.log(`[ArcGIS] Saved asset: ${asset.name} (${locations.length} locations)`);
        assetShowNotification(`Imported ${asset.name}: ${locations.length} locations from ArcGIS`, 'success');

        assetRenderList();
        updateMapAssetPanel();
        assetShowLoading(false);

        // Trigger analysis
        await assetRunAnalysis();

    } catch (error) {
        console.error('[ArcGIS] Save error:', error);
        assetShowNotification('Error saving asset: ' + error.message, 'error');
        assetShowLoading(false);
    }
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.assets = CL.assets || {};
  CL.assets.arcgis = CL.assets.arcgis || {};
  window.arcgisImportFeatures = arcgisImportFeatures; CL.assets.arcgis.arcgisImportFeatures = arcgisImportFeatures;
  window.arcgisFetchAllFeatures = arcgisFetchAllFeatures; CL.assets.arcgis.arcgisFetchAllFeatures = arcgisFetchAllFeatures;
  window.arcgisSaveAsset = arcgisSaveAsset; CL.assets.arcgis.arcgisSaveAsset = arcgisSaveAsset;
  CL._registerModule('assets/assets-arcgis-import');
})();
