/**
 * CL warrants.db — IndexedDB persistence + data-transfer for warrant studies
 * (signal/stop-sign/roundabout). Verbatim from app/index.html, 2-segment cut around
 * the 3 inline Magisterial-cache fns (used by the district module, left inline).
 * NO behavior change. Dual-exposed window.<fn> + CL.warrants.db.<fn>.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim, 2 segments) ───
/**
 * Open/Initialize IndexedDB for warrant storage
 */
async function warrantDbOpen() {
    return new Promise((resolve, reject) => {
        if (warrantDbState.db) {
            resolve(warrantDbState.db);
            return;
        }

        const request = indexedDB.open(WARRANT_DB_CONSTANTS.DB_NAME, WARRANT_DB_CONSTANTS.DB_VERSION);

        request.onerror = () => {
            console.error('[WarrantDB] IndexedDB error:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            warrantDbState.db = request.result;
            console.log('%c[WarrantDB] IndexedDB opened successfully', 'color: #22c55e; font-weight: bold');
            resolve(warrantDbState.db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create stores with indexes for each warrant type
            Object.entries(WARRANT_DB_CONSTANTS.STORES).forEach(([key, storeName]) => {
                if (!db.objectStoreNames.contains(storeName)) {
                    // Magisterial store uses jurisdictionId as key
                    if (key === 'MAGISTERIAL') {
                        const store = db.createObjectStore(storeName, { keyPath: 'jurisdictionId' });
                        store.createIndex('cachedAt', 'cachedAt', { unique: false });
                        console.log(`[WarrantDB] Magisterial store created: ${storeName}`);
                    } else {
                        const store = db.createObjectStore(storeName, { keyPath: 'id' });
                        store.createIndex('intersectionName', 'intersectionName', { unique: false });
                        store.createIndex('timestamp', 'timestamp', { unique: false });
                        store.createIndex('savedAt', 'savedAt', { unique: false });
                        console.log(`[WarrantDB] Store created: ${storeName}`);
                    }
                }
            });
        };
    });
}

/**
 * Save warrant analysis to IndexedDB
 */
async function warrantDbSave(warrantType, data) {
    const db = await warrantDbOpen();
    const storeName = WARRANT_DB_CONSTANTS.STORES[warrantType.toUpperCase()];
    if (!storeName) throw new Error(`Invalid warrant type: ${warrantType}`);

    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        // Generate ID based on intersection name for auto-update
        const intersectionName = data.intersectionName || data.config?.intersectionName || 'Unknown';
        const record = {
            id: `${intersectionName}_current`,  // Single record per intersection
            intersectionName: intersectionName,
            data: data,
            savedAt: new Date().toISOString(),
            timestamp: Date.now(),
            version: '1.0'
        };

        const request = store.put(record);
        request.onsuccess = () => {
            warrantDbState.lastSaved[warrantType] = new Date().toISOString();
            console.log(`[WarrantDB] ${warrantType} saved:`, intersectionName);
            warrantDbUpdateStorageStats();
            resolve(record);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Save warrant analysis with custom ID (for history)
 */
async function warrantDbSaveWithId(warrantType, data, customId) {
    const db = await warrantDbOpen();
    const storeName = WARRANT_DB_CONSTANTS.STORES[warrantType.toUpperCase()];
    if (!storeName) throw new Error(`Invalid warrant type: ${warrantType}`);

    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        const intersectionName = data.intersectionName || data.config?.intersectionName || 'Unknown';
        const record = {
            id: customId,
            intersectionName: intersectionName,
            data: data,
            savedAt: new Date().toISOString(),
            timestamp: Date.now(),
            version: '1.0'
        };

        const request = store.put(record);
        request.onsuccess = () => resolve(record);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Load latest warrant analysis for type
 */
async function warrantDbLoadLatest(warrantType) {
    const db = await warrantDbOpen();
    const storeName = WARRANT_DB_CONSTANTS.STORES[warrantType.toUpperCase()];
    if (!storeName) return null;

    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const index = store.index('timestamp');

        const request = index.openCursor(null, 'prev');  // Get most recent
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            resolve(cursor ? cursor.value : null);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Load all warrant analyses for type
 */
async function warrantDbLoadAll(warrantType) {
    const db = await warrantDbOpen();
    const storeName = WARRANT_DB_CONSTANTS.STORES[warrantType.toUpperCase()];
    if (!storeName) return [];

    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => {
            const results = request.result || [];
            // Sort by timestamp descending
            results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Load warrant by ID
 */
async function warrantDbLoadById(warrantType, id) {
    const db = await warrantDbOpen();
    const storeName = WARRANT_DB_CONSTANTS.STORES[warrantType.toUpperCase()];
    if (!storeName) return null;

    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Delete warrant by ID
 */
async function warrantDbDelete(warrantType, id) {
    const db = await warrantDbOpen();
    const storeName = WARRANT_DB_CONSTANTS.STORES[warrantType.toUpperCase()];
    if (!storeName) return;

    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => {
            warrantDbUpdateStorageStats();
            resolve();
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Clear all data for warrant type
 */
async function warrantDbClear(warrantType) {
    const db = await warrantDbOpen();
    const storeName = WARRANT_DB_CONSTANTS.STORES[warrantType.toUpperCase()];
    if (!storeName) return;

    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = () => {
            warrantDbState.lastSaved[warrantType] = null;
            warrantDbUpdateStorageStats();
            resolve();
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Clear ALL warrant data from ALL stores
 */
async function warrantDbClearAll() {
    const db = await warrantDbOpen();
    const stores = Object.values(WARRANT_DB_CONSTANTS.STORES);

    return Promise.all(stores.map(storeName => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    })).then(() => {
        // Reset state
        Object.keys(warrantDbState.lastSaved).forEach(k => warrantDbState.lastSaved[k] = null);
        warrantDbUpdateStorageStats();
        console.log('[WarrantDB] All warrant data cleared');
    });
}

/**
 * Clear warrants older than specified date
 */
async function warrantDbClearByDate(beforeDate) {
    const db = await warrantDbOpen();
    const stores = Object.values(WARRANT_DB_CONSTANTS.STORES);
    const cutoffTimestamp = new Date(beforeDate).getTime();
    let totalDeleted = 0;

    for (const storeName of stores) {
        await new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const index = store.index('timestamp');
            const range = IDBKeyRange.upperBound(cutoffTimestamp);

            const request = index.openCursor(range);
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    // Don't delete "_current" records
                    if (!cursor.value.id.endsWith('_current')) {
                        cursor.delete();
                        totalDeleted++;
                    }
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    warrantDbUpdateStorageStats();
    console.log(`[WarrantDB] Deleted ${totalDeleted} records older than ${beforeDate}`);
    return totalDeleted;
}

// ============================================================
// MAGISTERIAL DISTRICT INDEXEDDB CACHE
// ============================================================

/**
 * Schedule auto-save with debouncing
 */
function warrantDbScheduleAutoSave(warrantType) {
    // Clear existing timer
    if (warrantDbState.autoSaveTimers[warrantType]) {
        clearTimeout(warrantDbState.autoSaveTimers[warrantType]);
    }

    // Schedule new save
    warrantDbState.autoSaveTimers[warrantType] = setTimeout(async () => {
        try {
            await warrantDbAutoSave(warrantType);
        } catch (e) {
            console.error(`[WarrantDB] Auto-save failed for ${warrantType}:`, e);
        }
    }, WARRANT_DB_CONSTANTS.AUTO_SAVE_DELAY);
}

/**
 * Auto-save current warrant state
 */
async function warrantDbAutoSave(warrantType) {
    let data;

    switch(warrantType) {
        case 'signal':
            data = warrantDbCollectSignalData();
            break;
        case 'stopsign':
            data = warrantDbCollectStopSignData();
            break;
        case 'roundabout':
            data = warrantDbCollectRoundaboutData();
            break;
        case 'pedestrian':
            data = warrantDbCollectPedestrianData();
            break;
        default:
            return;
    }

    if (data && (data.intersectionName || data.config?.intersectionName)) {
        await warrantDbSave(warrantType, data);
        warrantDbUpdateIndicator(warrantType);
    }
}

/**
 * Collect signal warrant data from current state
 */
function warrantDbCollectSignalData() {
    // DOM fallback: if state doesn't have intersectionName, try reading from DOM
    const intersectionNameFromDOM = document.getElementById('signalIntersectionName')?.value || '';
    const intersectionName = warrantsState.signal.config?.intersectionName || intersectionNameFromDOM;

    // Create config with DOM fallback for intersectionName
    const config = {
        ...warrantsState.signal.config,
        intersectionName: intersectionName
    };

    return {
        config: config,
        multiDayData: warrantsState.signal.multiDayData,
        warrant4: warrantsState.signal.warrant4,
        warrant5: warrantsState.signal.warrant5,
        warrant7: warrantsState.signal.warrant7,
        virginiaMode: warrantsState.signal.virginiaMode,
        averagingMethod: warrantsState.signal.averagingMethod,
        includeWeekend: warrantsState.signal.includeWeekend,
        rtAdjustment: warrantsState.signal.rtAdjustment,
        analysisResults: warrantsState.signal.analysisResults,
        intersectionName: intersectionName
    };
}

/**
 * Collect stop sign warrant data from current state
 */
function warrantDbCollectStopSignData() {
    return {
        config: {
            intersectionName: document.getElementById('stopIntersectionName')?.value || '',
            majorStreet: document.getElementById('stopMajorStreet')?.value || '',
            minorStreet: document.getElementById('stopMinorStreet')?.value || '',
            evalDate: document.getElementById('stopEvalDate')?.value || '',
            intersectionLegs: document.getElementById('stopIntersectionLegs')?.value || '4',
            existingControl: document.getElementById('stopExistingControl')?.value || 'two-way-stop',
            majorSpeed: document.getElementById('stopMajorSpeed')?.value || '35',
            speed85th: document.getElementById('stopSpeed85th')?.value || '',
            areaType: document.getElementById('stopAreaType')?.value || 'urban',
            majorAADT: document.getElementById('stopMajorAADT')?.value || '',
            majorDirection: warrantsState.stopsign?.config?.majorDirection || 'EW',
            countType: warrantsState.stopsign?.config?.countType || '12hr'
        },
        multiDayData: warrantsState.stopsign?.multiDayData || {},
        delayData: {
            peakHour: document.getElementById('stopsignDelayPeakHour')?.value || '',
            avgDelay: document.getElementById('stopsignAvgDelay')?.value || '',
            method: document.getElementById('stopsignDelayMethod')?.value || 'manual'
        },
        criterionB: warrantsState.stopsign?.criterionB,
        criterionC: warrantsState.stopsign?.criterionC,
        criterionD: warrantsState.stopsign?.criterionD,
        notes: document.getElementById('stopsignEngineeringNotes')?.value || '',
        analysisResults: warrantsState.stopsign?.analysisResults,
        intersectionName: document.getElementById('stopIntersectionName')?.value || ''
    };
}

/**
 * Collect roundabout data from current state
 */
function warrantDbCollectRoundaboutData() {
    return {
        config: {
            intersectionName: document.getElementById('roundIntersectionName')?.value || '',
            evalDate: document.getElementById('roundEvalDate')?.value || '',
            numberOfLegs: document.getElementById('roundApproaches')?.value || '4',
            currentControl: document.getElementById('roundExistingControl')?.value || '',
            areaType: document.getElementById('roundAreaType')?.value || 'suburban'
        },
        trafficData: {
            totalAADT: document.getElementById('roundTotalAADT')?.value || '',
            peakHourVolume: document.getElementById('roundPeakVol')?.value || '',
            designVehicle: document.getElementById('roundDesignVehicle')?.value || 'WB-50'
        },
        multiDayData: warrantsState.roundabout?.multiDayData || {},
        constraints: {
            row: document.getElementById('roundROW')?.value || '',
            icd: document.getElementById('roundICD')?.value || '',
            safetyChecks: [
                document.getElementById('roundSafety1')?.checked,
                document.getElementById('roundSafety2')?.checked,
                document.getElementById('roundSafety3')?.checked,
                document.getElementById('roundSafety4')?.checked,
                document.getElementById('roundSafety5')?.checked
            ],
            constraintChecks: [
                document.getElementById('roundConst1')?.checked,
                document.getElementById('roundConst2')?.checked,
                document.getElementById('roundConst3')?.checked,
                document.getElementById('roundConst4')?.checked
            ]
        },
        crashAnalysis: warrantsState.roundabout?.crashAnalysis,
        safetyPrediction: warrantsState.roundabout?.safetyPrediction,
        iceScores: warrantsState.roundabout?.iceScores,
        recommendation: warrantsState.roundabout?.recommendation,
        intersectionName: document.getElementById('roundIntersectionName')?.value || ''
    };
}

/**
 * Collect pedestrian crossing data
 */
function warrantDbCollectPedestrianData() {
    // Pedestrian is in iframe, get from localStorage if available
    try {
        const saved = localStorage.getItem('vdotCrosswalkEvaluation');
        if (saved) {
            const data = JSON.parse(saved);
            return {
                ...data,
                intersectionName: data.locationName || data.intersectionName || ''
            };
        }
    } catch (e) {}
    return null;
}

// ============================================================
// WARRANT DB: STORAGE INDICATOR
// ============================================================

/**
 * Update storage statistics
 */
async function warrantDbUpdateStorageStats() {
    try {
        const stores = Object.entries(WARRANT_DB_CONSTANTS.STORES);

        for (const [type, storeName] of stores) {
            const records = await warrantDbLoadAll(type.toLowerCase());
            const size = new Blob([JSON.stringify(records)]).size;
            warrantDbState.storageStats[type.toLowerCase()] = {
                count: records.length,
                size: size
            };
        }

        warrantDbUpdateStorageIndicatorUI();
    } catch (e) {
        console.error('[WarrantDB] Error updating storage stats:', e);
    }
}

/**
 * Update storage indicator UI
 */
function warrantDbUpdateStorageIndicatorUI() {
    const indicator = document.getElementById('warrantStorageIndicator');
    if (!indicator) return;

    const stats = warrantDbState.storageStats;
    const totalCount = Object.values(stats).reduce((sum, s) => sum + s.count, 0);
    const totalSize = Object.values(stats).reduce((sum, s) => sum + s.size, 0);

    const sizeStr = totalSize < 1024 ? `${totalSize} B` :
                    totalSize < 1048576 ? `${(totalSize / 1024).toFixed(1)} KB` :
                    `${(totalSize / 1048576).toFixed(1)} MB`;

    indicator.innerHTML = `
        <span style="opacity:0.7">💾</span>
        <span>${totalCount} saved</span>
        <span style="opacity:0.5">|</span>
        <span style="opacity:0.7">${sizeStr}</span>
    `;
}

/**
 * Update indicator for specific warrant type
 */
function warrantDbUpdateIndicator(warrantType) {
    const indicatorId = `${warrantType}SaveIndicator`;
    const indicator = document.getElementById(indicatorId);
    if (!indicator) return;

    const lastSaved = warrantDbState.lastSaved[warrantType];
    if (lastSaved) {
        const time = new Date(lastSaved);
        const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        indicator.innerHTML = `<span style="color:#22c55e">✓ Auto-saved ${timeStr}</span>`;
        indicator.style.display = 'inline-block';
    }
}

// ============================================================
// WARRANT DB: EXPORT/IMPORT
// ============================================================

/**
 * Export all warrant data as JSON file
 */
async function warrantDbExportAll() {
    try {
        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            application: 'CrashLens Warrant Analyzer',
            signal: await warrantDbLoadAll('signal'),
            stopsign: await warrantDbLoadAll('stopsign'),
            roundabout: await warrantDbLoadAll('roundabout'),
            pedestrian: await warrantDbLoadAll('pedestrian')
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `warrant_analyses_export_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        showToast('All warrant data exported successfully', 'success');
    } catch (e) {
        console.error('[WarrantDB] Export error:', e);
        showToast('Export failed', 'danger');
    }
}

/**
 * Export single warrant type
 */
async function warrantDbExportType(warrantType) {
    try {
        const records = await warrantDbLoadAll(warrantType);
        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            warrantType: warrantType,
            records: records
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${warrantType}_warrant_export_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        showToast(`${warrantType} data exported`, 'success');
    } catch (e) {
        console.error('[WarrantDB] Export error:', e);
        showToast('Export failed', 'danger');
    }
}

/**
 * Import warrant data from JSON file
 */
async function warrantDbImport(file) {
    try {
        const text = await file.text();
        const importData = JSON.parse(text);

        let imported = 0;

        // Handle multi-type export
        if (importData.signal || importData.stopsign || importData.roundabout || importData.pedestrian) {
            for (const type of ['signal', 'stopsign', 'roundabout', 'pedestrian']) {
                if (importData[type] && Array.isArray(importData[type])) {
                    for (const record of importData[type]) {
                        await warrantDbSaveWithId(type, record.data, record.id);
                        imported++;
                    }
                }
            }
        }
        // Handle single-type export
        else if (importData.warrantType && importData.records) {
            for (const record of importData.records) {
                await warrantDbSaveWithId(importData.warrantType, record.data, record.id);
                imported++;
            }
        }

        warrantDbUpdateStorageStats();
        showToast(`Imported ${imported} warrant analyses`, 'success');
        return imported;
    } catch (e) {
        console.error('[WarrantDB] Import error:', e);
        showToast('Import failed: Invalid file format', 'danger');
        return 0;
    }
}

/**
 * Show import file dialog
 */
function warrantDbShowImportDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await warrantDbImport(file);
        }
    };
    input.click();
}

// ============================================================
// WARRANT DB: DATA TRANSFER BETWEEN WARRANT TYPES
// ============================================================

/**
 * Transfer data from signal warrant to stop sign warrant
 */
async function warrantDbTransferSignalToStopSign() {
    // Sync DOM → State first to capture any unsaved form input values
    if (typeof signal_updateConfigFromUI === 'function') {
        signal_updateConfigFromUI();
    }

    const signalData = warrantDbCollectSignalData();
    if (!signalData.config?.intersectionName) {
        showToast('No signal warrant data to transfer', 'warning');
        return;
    }

    // Transfer relevant fields
    const stopFields = {
        'stopIntersectionName': signalData.config.intersectionName,
        'stopMajorStreet': signalData.config.majorStreet,
        'stopMinorStreet': signalData.config.minorStreet,
        'stopMajorSpeed': signalData.config.speedLimit,
        'stopIntersectionLegs': signalData.config.intersectionLegs,
        'stopAreaType': signalData.config.communityPop >= 10000 ? 'urban' : 'rural'
    };

    for (const [id, value] of Object.entries(stopFields)) {
        const el = document.getElementById(id);
        if (el && value) el.value = value;
    }

    // Transfer major direction and count type to both UI dropdowns and state
    warrantsState.stopsign = warrantsState.stopsign || {};
    warrantsState.stopsign.config = warrantsState.stopsign.config || {};
    warrantsState.stopsign.config.majorDirection = signalData.config.majorDirection || 'EW';
    warrantsState.stopsign.config.countType = signalData.config.countType || '12hr';

    // Update UI dropdowns for major direction and count type
    const majorDirEl = document.getElementById('stopsignMajorDirection');
    if (majorDirEl) majorDirEl.value = signalData.config.majorDirection || 'EW';

    const countTypeEl = document.getElementById('stopsignCountType');
    if (countTypeEl) countTypeEl.value = signalData.config.countType || '12hr';

    // Transfer TMC data if compatible - transform signal format to stop sign format
    let firstDayData = null;
    if (signalData.multiDayData && Object.keys(signalData.multiDayData).length > 0) {
        // Transform signal data format {date, dow, hourlyData} to stop sign format {dayName, hourlyData}
        const dowNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const transformedData = {};

        for (const [key, day] of Object.entries(signalData.multiDayData)) {
            // Handle both 'dow' and 'dayOfWeek' field names for compatibility
            const dayOfWeek = day.dow !== undefined ? day.dow : day.dayOfWeek;
            transformedData[key] = {
                ...day,
                // Add dayName property expected by stop sign cards
                dayName: day.date || dowNames[dayOfWeek] || 'Unknown',
                // Keep both field names for compatibility
                date: day.date,
                dow: dayOfWeek,
                dayOfWeek: dayOfWeek,
                hourlyData: day.hourlyData
            };
            // Keep track of first day for populating the TMC table
            if (!firstDayData) {
                firstDayData = transformedData[key];
            }
        }

        warrantsState.stopsign.multiDayData = transformedData;

        // Update stop sign TMC grid structure (headers/rows)
        if (typeof stopsign_updateTMCGrid === 'function') {
            stopsign_updateTMCGrid();
        }

        // Update day cards display
        if (typeof stopsign_updateDayCards === 'function') {
            stopsign_updateDayCards();
        }

        // IMPORTANT: Populate the TMC table with the first day's data
        // Use requestAnimationFrame to ensure DOM is updated after grid regeneration
        if (firstDayData && typeof stopsign_populateTMCFromDayData === 'function') {
            requestAnimationFrame(() => {
                stopsign_populateTMCFromDayData(firstDayData);
            });
        }
    }

    // Switch to stop sign tab
    showWarrantStudy('stopsign');

    const daysCount = Object.keys(signalData.multiDayData || {}).length;
    if (daysCount > 0) {
        showToast(`Data transferred: ${daysCount} day(s) of traffic counts`, 'success');
    } else {
        showToast('Intersection config transferred (no traffic count data)', 'info');
    }
}

/**
 * Transfer data from signal warrant to roundabout analysis
 */
async function warrantDbTransferSignalToRoundabout() {
    // Sync DOM → State first to capture any unsaved form input values
    if (typeof signal_updateConfigFromUI === 'function') {
        signal_updateConfigFromUI();
    }

    const signalData = warrantDbCollectSignalData();
    if (!signalData.config?.intersectionName) {
        showToast('No signal warrant data to transfer', 'warning');
        return;
    }

    // Transfer relevant fields
    const roundFields = {
        'roundIntersectionName': signalData.config.intersectionName,
        'roundApproaches': signalData.config.intersectionLegs,
        'roundAreaType': signalData.config.communityPop >= 50000 ? 'urban' :
                         signalData.config.communityPop >= 10000 ? 'suburban' : 'rural',
        'roundExistingControl': 'none'  // Signal not warranted, so no control
    };

    for (const [id, value] of Object.entries(roundFields)) {
        const el = document.getElementById(id);
        if (el && value) el.value = value;
    }

    // Calculate total volumes from TMC data for roundabout
    if (signalData.multiDayData && Object.keys(signalData.multiDayData).length > 0) {
        const firstDay = Object.values(signalData.multiDayData)[0];
        if (firstDay && firstDay.hourlyData) {
            let totalDailyVolume = 0;
            let peakHourVolume = 0;

            Object.values(firstDay.hourlyData).forEach(hourData => {
                const hourTotal = (hourData.NB?.total || 0) + (hourData.SB?.total || 0) +
                                 (hourData.EB?.total || 0) + (hourData.WB?.total || 0);
                totalDailyVolume += hourTotal;
                if (hourTotal > peakHourVolume) peakHourVolume = hourTotal;
            });

            // Estimate AADT (rough factor for 12-hour count)
            const estimatedAADT = Math.round(totalDailyVolume * 1.1);

            const aadtEl = document.getElementById('roundTotalAADT');
            const peakEl = document.getElementById('roundPeakVol');
            if (aadtEl) aadtEl.value = estimatedAADT;
            if (peakEl) peakEl.value = peakHourVolume;
        }

        // Transfer multi-day data for roundabout TMC (if implemented)
        // Transform signal format to include dayName for consistency
        warrantsState.roundabout = warrantsState.roundabout || {};

        const dowNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const transformedData = {};

        for (const [key, day] of Object.entries(signalData.multiDayData)) {
            transformedData[key] = {
                ...day,
                dayName: day.date || dowNames[day.dow] || 'Unknown',
                date: day.date,
                dow: day.dow,
                hourlyData: day.hourlyData
            };
        }

        warrantsState.roundabout.multiDayData = transformedData;

        // Update roundabout TMC grid if function exists
        if (typeof roundabout_updateTMCGrid === 'function') {
            roundabout_updateTMCGrid();
        }
        if (typeof roundabout_updateDayCards === 'function') {
            roundabout_updateDayCards();
        }
    }

    // Switch to roundabout tab
    showWarrantStudy('roundabout');

    // Trigger evaluation if function exists
    if (typeof evaluateRoundabout === 'function') {
        setTimeout(evaluateRoundabout, 100);
    }

    showToast('Data transferred from Signal Warrant', 'success');
}

/**
 * Transfer data from stop sign to roundabout
 */
async function warrantDbTransferStopSignToRoundabout() {
    const stopData = warrantDbCollectStopSignData();
    if (!stopData.config?.intersectionName) {
        showToast('No stop sign warrant data to transfer', 'warning');
        return;
    }

    const roundFields = {
        'roundIntersectionName': stopData.config.intersectionName,
        'roundApproaches': stopData.config.intersectionLegs,
        'roundAreaType': stopData.config.areaType,
        'roundExistingControl': stopData.config.existingControl
    };

    for (const [id, value] of Object.entries(roundFields)) {
        const el = document.getElementById(id);
        if (el && value) el.value = value;
    }

    // Transfer TMC data
    if (stopData.multiDayData && Object.keys(stopData.multiDayData).length > 0) {
        warrantsState.roundabout = warrantsState.roundabout || {};
        warrantsState.roundabout.multiDayData = stopData.multiDayData;

        if (typeof roundabout_updateTMCGrid === 'function') {
            roundabout_updateTMCGrid();
        }
    }

    showWarrantStudy('roundabout');
    showToast('Data transferred from Stop Sign Warrant', 'success');
}

/**
 * Transfer data from stop sign warrant to signal warrant
 * Enables bidirectional data transfer between warrant types
 */
async function warrantDbTransferStopSignToSignal() {
    // Sync DOM → State first to capture any unsaved form input values
    if (typeof stopsign_updateConfig === 'function') {
        stopsign_updateConfig();
    }

    const stopData = warrantDbCollectStopSignData();
    if (!stopData.config?.intersectionName) {
        showToast('No stop sign warrant data to transfer', 'warning');
        return;
    }

    // Transfer relevant fields to signal warrant form
    const signalFields = {
        'signalIntersectionName': stopData.config.intersectionName,
        'signalMajorStreet': stopData.config.majorStreet,
        'signalMinorStreet': stopData.config.minorStreet,
        'signalSpeedLimit': stopData.config.majorSpeed,
        'signalIntersectionLegs': stopData.config.intersectionLegs,
        // Map area type to community population estimate
        'signalCommunityPop': stopData.config.areaType === 'urban' ? 50000 :
                             stopData.config.areaType === 'suburban' ? 25000 : 5000
    };

    for (const [id, value] of Object.entries(signalFields)) {
        const el = document.getElementById(id);
        if (el && value) el.value = value;
    }

    // Transfer major direction and count type to both UI dropdowns and state
    warrantsState.signal = warrantsState.signal || {};
    warrantsState.signal.config = warrantsState.signal.config || {};
    warrantsState.signal.config.majorDirection = stopData.config.majorDirection || 'EW';
    warrantsState.signal.config.countType = stopData.config.countType || '12hr';

    // Update UI dropdowns
    const majorDirEl = document.getElementById('signalMajorDirection');
    if (majorDirEl) majorDirEl.value = stopData.config.majorDirection || 'EW';

    const countTypeEl = document.getElementById('signalCountType');
    if (countTypeEl) countTypeEl.value = stopData.config.countType || '12hr';

    // Transfer TMC data if available
    let firstDayData = null;
    if (stopData.multiDayData && Object.keys(stopData.multiDayData).length > 0) {
        // Transform stop sign data format to signal format
        const transformedData = {};

        for (const [key, day] of Object.entries(stopData.multiDayData)) {
            // Handle both 'dow' and 'dayOfWeek' field names for compatibility
            const dayOfWeek = day.dow !== undefined ? day.dow : day.dayOfWeek;
            transformedData[key] = {
                date: day.date,
                dow: dayOfWeek,  // Signal uses 'dow', stop sign uses 'dayOfWeek'
                hourlyData: day.hourlyData
            };
            // Keep track of first day for populating the TMC table
            if (!firstDayData) {
                firstDayData = transformedData[key];
            }
        }

        warrantsState.signal.multiDayData = transformedData;

        // Update signal day cards display
        if (typeof signal_renderDayCards === 'function') {
            signal_renderDayCards();
        }

        // IMPORTANT: Populate the TMC table with the first day's data
        if (firstDayData && typeof signal_populateTMCFromDayData === 'function') {
            // Small delay to ensure tab switch completes
            setTimeout(() => {
                signal_populateTMCFromDayData(firstDayData);
            }, 100);
        }
    }

    // Switch to signal warrant tab
    showWarrantStudy('signal');

    const daysCount = Object.keys(stopData.multiDayData || {}).length;
    if (daysCount > 0) {
        showToast(`Data transferred: ${daysCount} day(s) of traffic counts`, 'success');
    } else {
        showToast('Intersection config transferred (no traffic count data)', 'info');
    }
}

// ============================================================
// WARRANT DB: RESTORE DATA ON TAB SHOW
// ============================================================

/**
 * Restore signal warrant data from IndexedDB
 */
async function warrantDbRestoreSignal() {
    try {
        const saved = await warrantDbLoadLatest('signal');
        if (!saved || !saved.data) return false;

        const data = saved.data;

        // Restore config
        if (data.config) {
            warrantsState.signal.config = { ...warrantsState.signal.config, ...data.config };

            const fields = {
                'signalIntersectionName': data.config.intersectionName,
                'signalMajorStreet': data.config.majorStreet,
                'signalMinorStreet': data.config.minorStreet,
                'signalMajorLanes': data.config.majorLanes,
                'signalMinorLanes': data.config.minorLanes,
                'signalMajorDirection': data.config.majorDirection,
                'signalSpeedLimit': data.config.speedLimit,
                'signalCommunityPop': data.config.communityPop,
                'signalIntersectionLegs': data.config.intersectionLegs,
                'signalCountType': data.config.countType,
                'signalUTurnSelection': data.config.uturnSelection
            };

            for (const [id, value] of Object.entries(fields)) {
                const el = document.getElementById(id);
                if (el && value !== undefined) el.value = value;
            }

            const apply70pct = document.getElementById('signalApply70pct');
            if (apply70pct) apply70pct.checked = data.config.apply70pct || false;
        }

        // Restore multi-day data
        if (data.multiDayData) {
            warrantsState.signal.multiDayData = data.multiDayData;
            if (typeof signal_renderDayCards === 'function') signal_renderDayCards();
        }

        // Restore warrant settings
        if (data.warrant4) warrantsState.signal.warrant4 = data.warrant4;
        if (data.warrant5) warrantsState.signal.warrant5 = data.warrant5;
        if (data.warrant7) {
            warrantsState.signal.warrant7 = data.warrant7;
            const w7Enable = document.getElementById('signalW7Enable');
            if (w7Enable) w7Enable.checked = data.warrant7.enabled;
        }

        if (data.virginiaMode !== undefined) {
            warrantsState.signal.virginiaMode = data.virginiaMode;
            const virginiaMode = document.getElementById('signalVirginiaMode');
            if (virginiaMode) virginiaMode.checked = data.virginiaMode;
        }

        if (data.averagingMethod) {
            warrantsState.signal.averagingMethod = data.averagingMethod;
        }

        if (data.rtAdjustment) {
            warrantsState.signal.rtAdjustment = data.rtAdjustment;
        }

        if (data.analysisResults) {
            warrantsState.signal.analysisResults = data.analysisResults;
        }

        console.log('[WarrantDB] Signal data restored from IndexedDB:', saved.savedAt);
        return true;
    } catch (e) {
        console.error('[WarrantDB] Error restoring signal data:', e);
        return false;
    }
}

/**
 * Restore stop sign warrant data from IndexedDB
 */
async function warrantDbRestoreStopSign() {
    try {
        const saved = await warrantDbLoadLatest('stopsign');
        if (!saved || !saved.data) return false;

        const data = saved.data;

        if (data.config) {
            const fields = {
                'stopIntersectionName': data.config.intersectionName,
                'stopMajorStreet': data.config.majorStreet,
                'stopMinorStreet': data.config.minorStreet,
                'stopEvalDate': data.config.evalDate,
                'stopIntersectionLegs': data.config.intersectionLegs,
                'stopExistingControl': data.config.existingControl,
                'stopMajorSpeed': data.config.majorSpeed,
                'stopSpeed85th': data.config.speed85th,
                'stopAreaType': data.config.areaType,
                'stopMajorAADT': data.config.majorAADT
            };

            for (const [id, value] of Object.entries(fields)) {
                const el = document.getElementById(id);
                if (el && value !== undefined) el.value = value;
            }

            if (data.config.majorDirection) {
                warrantsState.stopsign = warrantsState.stopsign || {};
                warrantsState.stopsign.config = warrantsState.stopsign.config || {};
                warrantsState.stopsign.config.majorDirection = data.config.majorDirection;
            }
        }

        if (data.multiDayData) {
            warrantsState.stopsign = warrantsState.stopsign || {};
            warrantsState.stopsign.multiDayData = data.multiDayData;
            if (typeof stopsign_updateDayCards === 'function') stopsign_updateDayCards();
        }

        if (data.criterionB) warrantsState.stopsign.criterionB = data.criterionB;
        if (data.criterionC) warrantsState.stopsign.criterionC = data.criterionC;
        if (data.criterionD) warrantsState.stopsign.criterionD = data.criterionD;

        if (data.delayData) {
            const delayFields = {
                'stopsignDelayPeakHour': data.delayData.peakHour,
                'stopsignAvgDelay': data.delayData.avgDelay,
                'stopsignDelayMethod': data.delayData.method
            };
            for (const [id, value] of Object.entries(delayFields)) {
                const el = document.getElementById(id);
                if (el && value) el.value = value;
            }
        }

        if (data.notes) {
            const notesEl = document.getElementById('stopsignEngineeringNotes');
            if (notesEl) notesEl.value = data.notes;
        }

        if (data.analysisResults) {
            warrantsState.stopsign.analysisResults = data.analysisResults;
        }

        console.log('[WarrantDB] Stop sign data restored from IndexedDB:', saved.savedAt);
        return true;
    } catch (e) {
        console.error('[WarrantDB] Error restoring stop sign data:', e);
        return false;
    }
}

/**
 * Restore roundabout data from IndexedDB
 */
async function warrantDbRestoreRoundabout() {
    try {
        const saved = await warrantDbLoadLatest('roundabout');
        if (!saved || !saved.data) return false;

        const data = saved.data;

        if (data.config) {
            const fields = {
                'roundIntersectionName': data.config.intersectionName,
                'roundEvalDate': data.config.evalDate,
                'roundApproaches': data.config.numberOfLegs,
                'roundExistingControl': data.config.currentControl,
                'roundAreaType': data.config.areaType
            };

            for (const [id, value] of Object.entries(fields)) {
                const el = document.getElementById(id);
                if (el && value !== undefined) el.value = value;
            }
        }

        if (data.trafficData) {
            const trafficFields = {
                'roundTotalAADT': data.trafficData.totalAADT,
                'roundPeakVol': data.trafficData.peakHourVolume,
                'roundDesignVehicle': data.trafficData.designVehicle
            };

            for (const [id, value] of Object.entries(trafficFields)) {
                const el = document.getElementById(id);
                if (el && value !== undefined) el.value = value;
            }
        }

        if (data.constraints) {
            if (data.constraints.row) {
                const rowEl = document.getElementById('roundROW');
                if (rowEl) rowEl.value = data.constraints.row;
            }
            if (data.constraints.icd) {
                const icdEl = document.getElementById('roundICD');
                if (icdEl) icdEl.value = data.constraints.icd;
            }

            // Restore checkboxes
            if (data.constraints.safetyChecks) {
                data.constraints.safetyChecks.forEach((checked, i) => {
                    const el = document.getElementById(`roundSafety${i+1}`);
                    if (el) el.checked = checked;
                });
            }
            if (data.constraints.constraintChecks) {
                data.constraints.constraintChecks.forEach((checked, i) => {
                    const el = document.getElementById(`roundConst${i+1}`);
                    if (el) el.checked = checked;
                });
            }
        }

        if (data.multiDayData) {
            warrantsState.roundabout = warrantsState.roundabout || {};
            warrantsState.roundabout.multiDayData = data.multiDayData;
            if (typeof roundabout_updateDayCards === 'function') roundabout_updateDayCards();
        }

        if (data.crashAnalysis) warrantsState.roundabout.crashAnalysis = data.crashAnalysis;
        if (data.safetyPrediction) warrantsState.roundabout.safetyPrediction = data.safetyPrediction;
        if (data.iceScores) warrantsState.roundabout.iceScores = data.iceScores;
        if (data.recommendation) warrantsState.roundabout.recommendation = data.recommendation;

        console.log('[WarrantDB] Roundabout data restored from IndexedDB:', saved.savedAt);
        return true;
    } catch (e) {
        console.error('[WarrantDB] Error restoring roundabout data:', e);
        return false;
    }
}

// ============================================================
// WARRANT DB: INITIALIZATION
// ============================================================

/**
 * Initialize warrant database and restore data
 */
async function warrantDbInit() {
    try {
        await warrantDbOpen();
        await warrantDbUpdateStorageStats();
        console.log('%c[WarrantDB] Initialized', 'color: #22c55e; font-weight: bold');
    } catch (e) {
        console.error('[WarrantDB] Initialization error:', e);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    warrantDbInit();
    // Initialize crash cache DB (pre-open for faster access)
    crashCacheOpen().catch(err => console.warn('[CrashCache] Init error:', err));
});

// ============================================================
// WARRANT DB: UI HELPER FUNCTIONS
// ============================================================

/**
 * Toggle warrant data menu dropdown
 */
function toggleWarrantDataMenu() {
    const menu = document.getElementById('warrantDataMenu');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
}

/**
 * Toggle clear actions dropdown menu for specific warrant type
 */
function toggleClearActionsMenu(warrantType) {
    // Close any other open clear menus first
    document.querySelectorAll('.clear-actions-menu.show').forEach(m => {
        m.classList.remove('show');
    });

    const menuId = warrantType + 'ClearMenu';
    const menu = document.getElementById(menuId);
    if (menu) {
        menu.classList.toggle('show');
    }
}

/**
 * Close clear actions dropdown menu for specific warrant type
 */
function closeClearActionsMenu(warrantType) {
    const menuId = warrantType + 'ClearMenu';
    const menu = document.getElementById(menuId);
    if (menu) {
        menu.classList.remove('show');
    }
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.warrants = CL.warrants || {};
  CL.warrants.db = CL.warrants.db || {};
  window.warrantDbOpen = warrantDbOpen; CL.warrants.db.warrantDbOpen = warrantDbOpen;
  window.warrantDbSave = warrantDbSave; CL.warrants.db.warrantDbSave = warrantDbSave;
  window.warrantDbSaveWithId = warrantDbSaveWithId; CL.warrants.db.warrantDbSaveWithId = warrantDbSaveWithId;
  window.warrantDbLoadLatest = warrantDbLoadLatest; CL.warrants.db.warrantDbLoadLatest = warrantDbLoadLatest;
  window.warrantDbLoadAll = warrantDbLoadAll; CL.warrants.db.warrantDbLoadAll = warrantDbLoadAll;
  window.warrantDbLoadById = warrantDbLoadById; CL.warrants.db.warrantDbLoadById = warrantDbLoadById;
  window.warrantDbDelete = warrantDbDelete; CL.warrants.db.warrantDbDelete = warrantDbDelete;
  window.warrantDbClear = warrantDbClear; CL.warrants.db.warrantDbClear = warrantDbClear;
  window.warrantDbClearAll = warrantDbClearAll; CL.warrants.db.warrantDbClearAll = warrantDbClearAll;
  window.warrantDbClearByDate = warrantDbClearByDate; CL.warrants.db.warrantDbClearByDate = warrantDbClearByDate;
  window.warrantDbScheduleAutoSave = warrantDbScheduleAutoSave; CL.warrants.db.warrantDbScheduleAutoSave = warrantDbScheduleAutoSave;
  window.warrantDbAutoSave = warrantDbAutoSave; CL.warrants.db.warrantDbAutoSave = warrantDbAutoSave;
  window.warrantDbCollectSignalData = warrantDbCollectSignalData; CL.warrants.db.warrantDbCollectSignalData = warrantDbCollectSignalData;
  window.warrantDbCollectStopSignData = warrantDbCollectStopSignData; CL.warrants.db.warrantDbCollectStopSignData = warrantDbCollectStopSignData;
  window.warrantDbCollectRoundaboutData = warrantDbCollectRoundaboutData; CL.warrants.db.warrantDbCollectRoundaboutData = warrantDbCollectRoundaboutData;
  window.warrantDbCollectPedestrianData = warrantDbCollectPedestrianData; CL.warrants.db.warrantDbCollectPedestrianData = warrantDbCollectPedestrianData;
  window.warrantDbUpdateStorageStats = warrantDbUpdateStorageStats; CL.warrants.db.warrantDbUpdateStorageStats = warrantDbUpdateStorageStats;
  window.warrantDbUpdateStorageIndicatorUI = warrantDbUpdateStorageIndicatorUI; CL.warrants.db.warrantDbUpdateStorageIndicatorUI = warrantDbUpdateStorageIndicatorUI;
  window.warrantDbUpdateIndicator = warrantDbUpdateIndicator; CL.warrants.db.warrantDbUpdateIndicator = warrantDbUpdateIndicator;
  window.warrantDbExportAll = warrantDbExportAll; CL.warrants.db.warrantDbExportAll = warrantDbExportAll;
  window.warrantDbExportType = warrantDbExportType; CL.warrants.db.warrantDbExportType = warrantDbExportType;
  window.warrantDbImport = warrantDbImport; CL.warrants.db.warrantDbImport = warrantDbImport;
  window.warrantDbShowImportDialog = warrantDbShowImportDialog; CL.warrants.db.warrantDbShowImportDialog = warrantDbShowImportDialog;
  window.warrantDbTransferSignalToStopSign = warrantDbTransferSignalToStopSign; CL.warrants.db.warrantDbTransferSignalToStopSign = warrantDbTransferSignalToStopSign;
  window.warrantDbTransferSignalToRoundabout = warrantDbTransferSignalToRoundabout; CL.warrants.db.warrantDbTransferSignalToRoundabout = warrantDbTransferSignalToRoundabout;
  window.warrantDbTransferStopSignToRoundabout = warrantDbTransferStopSignToRoundabout; CL.warrants.db.warrantDbTransferStopSignToRoundabout = warrantDbTransferStopSignToRoundabout;
  window.warrantDbTransferStopSignToSignal = warrantDbTransferStopSignToSignal; CL.warrants.db.warrantDbTransferStopSignToSignal = warrantDbTransferStopSignToSignal;
  window.warrantDbRestoreSignal = warrantDbRestoreSignal; CL.warrants.db.warrantDbRestoreSignal = warrantDbRestoreSignal;
  window.warrantDbRestoreStopSign = warrantDbRestoreStopSign; CL.warrants.db.warrantDbRestoreStopSign = warrantDbRestoreStopSign;
  window.warrantDbRestoreRoundabout = warrantDbRestoreRoundabout; CL.warrants.db.warrantDbRestoreRoundabout = warrantDbRestoreRoundabout;
  window.warrantDbInit = warrantDbInit; CL.warrants.db.warrantDbInit = warrantDbInit;
  window.toggleWarrantDataMenu = toggleWarrantDataMenu; CL.warrants.db.toggleWarrantDataMenu = toggleWarrantDataMenu;
  window.toggleClearActionsMenu = toggleClearActionsMenu; CL.warrants.db.toggleClearActionsMenu = toggleClearActionsMenu;
  window.closeClearActionsMenu = closeClearActionsMenu; CL.warrants.db.closeClearActionsMenu = closeClearActionsMenu;
  CL._registerModule('warrants/warrant-db');
})();
