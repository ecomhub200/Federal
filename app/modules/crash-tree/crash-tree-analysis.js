/**
 * CL crashTree.analysis module
 *
 * Extracted from app/index.html (name-anchored, live L85854-L86248)
 * on 2026-05-23. Round X modular refactor — CC 200 Pass B.
 * Responsibility: data-table renderer, FHWA-style risk-factor
 * overrepresentation analysis, secondary tree analysis panel.
 *
 * Moved fns (3): updateCrashTreeDataTable, analyzeRiskFactors,
 *   buildSecondaryTreeAnalysis.
 *
 * Shared globals (crashTreeState, crashState, COL, isIntersection, isYes,
 * buildFacilityTree/buildCrashTypeTree/buildContributingFactorsTree from
 * crash-tree-build.js, findNodeById from crash-tree-render.js,
 * getCrashTreeFilteredCrashes/getCrashTreeDateOnlyFilteredCrashes from
 * crash-tree-loader.js) all resolve via window.* mirrors set by their
 * respective modules + the shared classic-script global lexical
 * environment.
 *
 * Public API (back-compat dual exposure): window.<fn> + CL.crashTree.<fn>
 */
(function(){
  'use strict';

  // Matview-only ("Supabase") mode predicate. Mirrors the same guard
  // crash-tree-build.js:34-36 uses inside buildCrashTreeData(): when
  // crashState.sampleRows is empty (large jurisdictions like Sussex
  // County, ~134K crashes), row-level analysis is impossible — the
  // primary tree is built from mv_crash_tree directly.
  const _isSupabaseMode = () =>
      crashTreeState.source === 'supabase' ||
      !(crashState.sampleRows && crashState.sampleRows.length > 0);

  // CT1 fallback: render the Secondary Analysis panel from the already-
  // built primary tree (crashTreeState.treeData) when we have no row data
  // to build a true secondary tree. Surfaces real, honest data — the
  // top-3 children of the deepest drilled node — instead of a misleading
  // "No crashes match" message.
  const _renderSecondaryFromPrimary = () => {
      const el = document.getElementById('crashTreeSecondaryAnalysis');
      if (!el) return;

      const tree = crashTreeState.treeData;
      if (!tree) {
          el.innerHTML =
              '<div style="text-align:center;padding:.75rem;color:var(--gray);font-size:.8rem;">'
              + 'Secondary analysis unavailable — primary tree not yet built.'
              + '</div>';
          return;
      }

      // Find the deepest node along the user's drill path; fall back to root.
      const path = Array.isArray(crashTreeState.dominantPath) ? crashTreeState.dominantPath : [];
      let node = tree;
      if (path.length > 0 && typeof findNodeById === 'function') {
          const lastId = path[path.length - 1];
          const resolved = findNodeById(tree, lastId);
          if (resolved) node = resolved;
      }

      const footnote =
          '<div style="margin-top:.35rem;font-size:.6rem;color:#6b7280;font-style:italic;">'
          + 'Row-level secondary tree unavailable at this scope — showing top categories from the primary tree.'
          + '</div>';

      const kids = (node.children || []);
      if (kids.length === 0) {
          el.innerHTML = `
              <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:var(--radius);padding:.6rem;">
                  <div style="font-weight:600;color:#0369a1;font-size:.75rem;margin-bottom:.3rem;">
                      🌳 Primary Tree Leaf
                  </div>
                  <div style="font-size:.85rem;color:#0c4a6e;font-weight:600;margin-bottom:.25rem;">
                      ${node.name || 'Selected node'}
                  </div>
                  <div style="font-size:.65rem;color:#0369a1;margin-bottom:.4rem;">
                      ${(node.total || 0).toLocaleString()} crashes • ${((node.K || 0) + (node.A || 0)).toLocaleString()} KA injuries
                  </div>
                  ${footnote}
              </div>`;
          return;
      }

      const sortedKids = kids.slice().sort((a, b) => (b.total || 0) - (a.total || 0));
      const topCategories = sortedKids.slice(0, 3).map(c => {
          const pct = typeof c.pct === 'number' ? c.pct.toFixed(0) : '0';
          return `<div style="display:flex;justify-content:space-between;align-items:center;padding:.25rem 0;border-bottom:1px solid #e5e7eb;">
              <span style="font-size:.75rem;color:#374151;">${c.name}</span>
              <span style="font-size:.75rem;font-weight:600;color:#0369a1;">${(c.total || 0).toLocaleString()} <span style="color:#6b7280;font-weight:400;">(${pct}%)</span></span>
          </div>`;
      }).join('');

      const nodeKA = node.unfilteredKA !== undefined
          ? node.unfilteredKA
          : ((node.K || 0) + (node.A || 0));

      el.innerHTML = `
          <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:var(--radius);padding:.6rem;">
              <div style="font-weight:600;color:#0369a1;font-size:.75rem;margin-bottom:.3rem;">
                  🌳 Top Categories Within Primary Scope:
              </div>
              <div style="font-size:.85rem;color:#0c4a6e;font-weight:600;margin-bottom:.25rem;">
                  ${node.name || 'All Crashes'}
              </div>
              <div style="font-size:.65rem;color:#0369a1;margin-bottom:.4rem;">
                  ${(node.total || 0).toLocaleString()} crashes • ${nodeKA.toLocaleString()} KA injuries
              </div>
              <div style="margin-top:.35rem;border-top:1px solid #bae6fd;padding-top:.35rem;">
                  <div style="font-size:.65rem;color:#6b7280;margin-bottom:.25rem;font-weight:600;">Top Categories:</div>
                  ${topCategories}
              </div>
              ${footnote}
          </div>`;
  };

  // CT2 helper: render the FHWA risk-factor panel from a results array.
  // Single source of truth for both the row-level (analyzeRiskFactors) path
  // and the matview-hydrated (analyzeRiskFactors matview branch +
  // generateCrashTreeReport pre-render) path.
  const _renderRiskFactorsPanel = (el, results, riskScore) => {
      if (!el) return;
      const overrepFactors = results.filter(r => r.overrep);
      const scoreLevel = riskScore > 70 ? 'ct-critical' : riskScore > 50 ? 'ct-high' : riskScore > 30 ? 'ct-medium' : 'ct-low';
      el.innerHTML = `
          <div class="ct-risk-score">
              <div class="ct-risk-score-bar">
                  <div class="ct-risk-score-fill ${scoreLevel}" style="width:${riskScore}%;"></div>
                  <div class="ct-risk-score-markers">
                      <div class="ct-risk-score-marker"></div>
                      <div class="ct-risk-score-marker"></div>
                      <div class="ct-risk-score-marker"></div>
                      <div class="ct-risk-score-marker"></div>
                  </div>
              </div>
              <div class="ct-risk-score-value ct-stat-value">${riskScore}</div>
          </div>
          <div style="font-size:.65rem;color:#6b7280;text-align:center;margin-bottom:.5rem;">${overrepFactors.length} overrepresented factor${overrepFactors.length !== 1 ? 's' : ''} detected</div>
          ${results.slice(0, 6).map(r => {
              const barWidth = Math.min(100, parseFloat(r.ratio) * 40);
              const ratioClass = r.severity === 'high' ? 'ct-high' : r.severity === 'medium' ? 'ct-medium' : 'ct-low';
              const barClass = r.overrep ? 'ct-overrep' : 'ct-normal';
              return `
              <div class="ct-risk-item">
                  <div class="ct-risk-item-icon">${r.icon}</div>
                  <div class="ct-risk-item-content">
                      <div class="ct-risk-item-name">${r.name}</div>
                      <div class="ct-risk-item-bar">
                          <div class="ct-risk-item-bar-fill ${barClass}" style="width:${barWidth}%;"></div>
                      </div>
                  </div>
                  <div class="ct-risk-item-ratio ${ratioClass}">${r.ratio}x</div>
              </div>`;
          }).join('')}
          <div style="margin-top:.5rem;padding:.3rem;background:#f8fafc;border-radius:4px;font-size:.6rem;color:#6b7280;text-align:center;">
              <span style="color:#dc2626;">●</span> &gt;1.2x = Overrepresented (FHWA methodology)
          </div>
      `;
  };

  // CT2 helper: hydrate risk-factor results from matviews when row-level
  // crash data isn't loaded (county tier / matview-only mode). Returns the
  // results array (sorted, ready to feed _renderRiskFactorsPanel) or null
  // if hydration isn't possible (no client, no tier, no crash totals).
  // Used by analyzeRiskFactors() matview branch and by
  // generateCrashTreeReport() in crash-tree-export.js as a fallback before
  // PDF generation.
  const _hydrateRiskFactorsFromMatviews = async () => {
      if (!(window.crashLensClient && window.CL?.data?.supabaseBridge?.resolveTier
          && window.CL?.data?.cachedMatview)) return null;
      const t = window.CL.data.supabaseBridge.resolveTier();
      const [sumRows, cats] = await Promise.all([
          CL.data.cachedMatview('dashboard_summary', t.tier, t.value,
              () => window.crashLensClient.getSummary(t.tier, t.value, {})),
          CL.data.cachedMatview('mv_safety_categories', t.tier, t.value,
              () => window.crashLensClient.getSafetyCategories(t.tier, t.value, {})),
      ]);
      let scopeTotal = 0, scopeKA = 0;
      (sumRows || []).forEach(r => {
          scopeTotal += r.crash_count || 0;
          scopeKA    += (r.fatals || 0) + (r.serious_injuries || 0);
      });
      if (!cats || scopeTotal === 0) return null;
      // Category keys / display names / FHWA baselines mirror the row-level
      // path in analyzeRiskFactors() so the ratio is computed against the
      // same expected values regardless of data source.
      const catMap = [
          { key: 'nighttime',    name: 'Nighttime',    icon: '🌙', baseline: 25 },
          { key: 'speed',        name: 'Speed-Related',icon: '⚡', baseline: 15 },
          { key: 'intersection', name: 'Intersection', icon: '🚦', baseline: 42 },
          { key: 'weather',      name: 'Weather',      icon: '🌧', baseline: 18 },
          { key: 'pedestrian',   name: 'Pedestrian',   icon: '🚶', baseline: 3  },
          { key: 'bicycle',      name: 'Bicycle',      icon: '🚴', baseline: 1  },
          { key: 'motorcycle',   name: 'Motorcycle',   icon: '🏍', baseline: 4  },
          { key: 'impaired',     name: 'Alcohol/Impaired', icon: '🍺', baseline: 6 },
      ];
      const hydrated = catMap.map(c => {
          const cat = cats[c.key] || { total: 0, K: 0, A: 0 };
          const allCount = cat.total || 0;
          const kaCount  = (cat.K || 0) + (cat.A || 0);
          const allPct   = (allCount / scopeTotal * 100);
          const kaPct    = scopeKA > 0 ? (kaCount / scopeKA * 100) : 0;
          const ratio    = allPct > 0 ? (kaPct / allPct) : 0;
          return {
              name: c.name, icon: c.icon,
              allCount, kaCount,
              allPct: allPct.toFixed(1),
              kaPct: kaPct.toFixed(1),
              ratio: ratio.toFixed(2),
              overrep: ratio > 1.2,
              severity: ratio > 1.5 ? 'high' : ratio > 1.2 ? 'medium' : 'low',
              baseline: c.baseline,
          };
      }).filter(r => r.allCount > 0);
      if (hydrated.length === 0) return null;
      hydrated.sort((a, b) => parseFloat(b.ratio) - parseFloat(a.ratio));
      return hydrated;
  };

  // CT2 helper: compute the FHWA risk score from a results array (same
  // formula as the inline analyzeRiskFactors row-level path).
  const _computeRiskScore = (results) => {
      const overrepFactors = results.filter(r => r.overrep);
      const highSeverityFactors = results.filter(r => r.severity === 'high');
      return Math.min(100, overrepFactors.length * 15 + highSeverityFactors.length * 10);
  };

  // Expose helpers so crash-tree-export.js can share the hydration path.
  window.CL = window.CL || {};
  window.CL.crashTree = window.CL.crashTree || {};
  window.CL.crashTree._hydrateRiskFactorsFromMatviews = _hydrateRiskFactorsFromMatviews;
  window.CL.crashTree._computeRiskScore = _computeRiskScore;

  // ─── EXTRACTED CODE START (verbatim from index.html L85854-L86248) ───
// Update data table
function updateCrashTreeDataTable() {
    const tbody = document.getElementById('crashTreeTableBody');
    if (!tbody || !crashTreeState.treeData) return;

    const rows = [];
    const addRows = (node, indent = 0) => {
        if (!node) return;
        // Use unfiltered KA count for accurate display regardless of severity filter
        const ka = node.unfilteredKA !== undefined ? node.unfilteredKA : ((node.K || 0) + (node.A || 0));
        const baseForKAPct = node.unfilteredTotal || node.total;
        const kaPct = baseForKAPct > 0 ? (ka / baseForKAPct * 100).toFixed(1) : '0.0';
        const diff = node.stateAvg !== undefined ? (node.pct - node.stateAvg).toFixed(1) : '-';
        const diffColor = parseFloat(diff) > 0 ? '#dc2626' : parseFloat(diff) < 0 ? '#059669' : 'var(--gray)';

        rows.push(`
            <tr>
                <td style="padding:.4rem .5rem;border-bottom:1px solid var(--border);padding-left:${indent * 20 + 8}px;">
                    ${indent > 0 ? '└ ' : ''}${node.name}
                </td>
                <td style="padding:.4rem .5rem;border-bottom:1px solid var(--border);text-align:right;">${node.total.toLocaleString()}</td>
                <td style="padding:.4rem .5rem;border-bottom:1px solid var(--border);text-align:right;color:#dc2626;">${node.K || 0}</td>
                <td style="padding:.4rem .5rem;border-bottom:1px solid var(--border);text-align:right;color:#ea580c;">${node.A || 0}</td>
                <td style="padding:.4rem .5rem;border-bottom:1px solid var(--border);text-align:right;">${kaPct}%</td>
                <td style="padding:.4rem .5rem;border-bottom:1px solid var(--border);text-align:right;">${node.pct.toFixed(1)}%</td>
                <td style="padding:.4rem .5rem;border-bottom:1px solid var(--border);text-align:right;">${node.stateAvg !== undefined ? node.stateAvg + '%' : '-'}</td>
                <td style="padding:.4rem .5rem;border-bottom:1px solid var(--border);text-align:right;color:${diffColor};">
                    ${diff !== '-' ? (parseFloat(diff) > 0 ? '+' : '') + diff + '%' : '-'}
                </td>
            </tr>
        `);

        if (node.children) {
            node.children.forEach(child => addRows(child, indent + 1));
        }
    };

    addRows(crashTreeState.treeData);
    tbody.innerHTML = rows.join('');
}

// Analyze risk factors with FHWA-style overrepresentation
function analyzeRiskFactors() {
    const el = document.getElementById('crashTreeRiskFactors');
    if (!el || !crashState.loaded) return;

    // Matview-only mode: row-level fields (NIGHT, SPEED, WEATHER, PED,
    // BIKE) are unavailable. CC 212: hydrate from mv_safety_categories +
    // dashboard_summary so the FHWA overrepresentation panel renders real
    // ratios. Render a loading state synchronously, then overwrite with
    // the real panel (success) or fall back to the unavailable placeholder
    // (no client / no data / no overrepresented categories).
    if (_isSupabaseMode()) {
        el.innerHTML = `
            <div class="ct-risk-empty" style="text-align:center;padding:.75rem;color:var(--gray);font-size:.75rem;line-height:1.4;">
              <div style="font-size:1.25rem;margin-bottom:.25rem;">⏳</div>
              <div>Loading risk-factor analysis from matviews…</div>
            </div>`;
        crashTreeState.riskFactors.analyzed = [];
        crashTreeState.riskFactors.score = 0;
        const _placeholderHtml = `
            <div class="ct-risk-empty" style="text-align:center;padding:.75rem;color:var(--gray);font-size:.75rem;line-height:1.4;">
              <div style="font-size:1.25rem;margin-bottom:.25rem;">📊</div>
              <div style="font-weight:600;color:#374151;margin-bottom:.2rem;">Risk-factor analysis unavailable at this scope</div>
              <div>Drill into a smaller area (city, intersection, or corridor) to see row-level risk-factor ratios.</div>
            </div>`;
        _hydrateRiskFactorsFromMatviews().then(hydrated => {
            if (!hydrated || hydrated.length === 0) {
                el.innerHTML = _placeholderHtml;
                return;
            }
            const riskScore = _computeRiskScore(hydrated);
            crashTreeState.riskFactors.analyzed = hydrated;
            crashTreeState.riskFactors.score = riskScore;
            _renderRiskFactorsPanel(el, hydrated, riskScore);
        }).catch(e => {
            console.warn('[CrashTree] risk factor matview hydration failed:', e && e.message);
            el.innerHTML = _placeholderHtml;
        });
        return;
    }

    // FHWA overrepresentation requires ALL crashes (not severity-filtered) as baseline
    // Use date-filtered only to ensure proper comparison between KA and all severities
    const rows = getCrashTreeDateOnlyFilteredCrashes();
    const total = rows.length;

    // Get KA (severe) crashes for overrepresentation analysis
    const kaCrashes = rows.filter(r => {
        const sev = (r[COL.SEVERITY] || '').trim().toUpperCase().charAt(0);
        return sev === 'K' || sev === 'A';
    });
    const kaTotal = kaCrashes.length;

    // Calculate FHWA-style overrepresentation for risk factors
    // Overrepresentation = (% of KA crashes with factor) / (% of all crashes with factor)
    const results = [];

    // Nighttime - FHWA considers ~25% of VMT occurs at night
    const nightAll = rows.filter(r => isYes(r[COL.NIGHT])).length;
    const nightKA = kaCrashes.filter(r => isYes(r[COL.NIGHT])).length;
    const nightAllPct = total > 0 ? (nightAll / total * 100) : 0;
    const nightKAPct = kaTotal > 0 ? (nightKA / kaTotal * 100) : 0;
    const nightRatio = nightAllPct > 0 ? (nightKAPct / nightAllPct) : 0;
    results.push({
        name: 'Nighttime',
        icon: '🌙',
        allCount: nightAll,
        kaCount: nightKA,
        allPct: nightAllPct.toFixed(1),
        kaPct: nightKAPct.toFixed(1),
        ratio: nightRatio.toFixed(2),
        overrep: nightRatio > 1.2,
        severity: nightRatio > 1.5 ? 'high' : nightRatio > 1.2 ? 'medium' : 'low',
        baseline: 25,
        cmfKeywords: ['lighting', 'illumination', 'retroreflective']
    });

    // Speed-related
    const speedAll = rows.filter(r => isYes(r[COL.SPEED])).length;
    const speedKA = kaCrashes.filter(r => isYes(r[COL.SPEED])).length;
    const speedAllPct = total > 0 ? (speedAll / total * 100) : 0;
    const speedKAPct = kaTotal > 0 ? (speedKA / kaTotal * 100) : 0;
    const speedRatio = speedAllPct > 0 ? (speedKAPct / speedAllPct) : 0;
    results.push({
        name: 'Speed-Related',
        icon: '⚡',
        allCount: speedAll,
        kaCount: speedKA,
        allPct: speedAllPct.toFixed(1),
        kaPct: speedKAPct.toFixed(1),
        ratio: speedRatio.toFixed(2),
        overrep: speedRatio > 1.2,
        severity: speedRatio > 1.5 ? 'high' : speedRatio > 1.2 ? 'medium' : 'low',
        baseline: 15,
        cmfKeywords: ['speed', 'traffic calming', 'speed limit']
    });

    // Intersection crashes
    const intAll = rows.filter(r => isIntersection(r)).length;
    const intKA = kaCrashes.filter(r => isIntersection(r)).length;
    const intAllPct = total > 0 ? (intAll / total * 100) : 0;
    const intKAPct = kaTotal > 0 ? (intKA / kaTotal * 100) : 0;
    const intRatio = intAllPct > 0 ? (intKAPct / intAllPct) : 0;
    results.push({
        name: 'Intersection',
        icon: '🚦',
        allCount: intAll,
        kaCount: intKA,
        allPct: intAllPct.toFixed(1),
        kaPct: intKAPct.toFixed(1),
        ratio: intRatio.toFixed(2),
        overrep: intRatio > 1.2,
        severity: intRatio > 1.5 ? 'high' : intRatio > 1.2 ? 'medium' : 'low',
        baseline: 42,
        cmfKeywords: ['intersection', 'signal', 'roundabout', 'turn lane']
    });

    // Wet/adverse weather
    const wetFilter = r => {
        const weather = (r[COL.WEATHER] || '').toLowerCase();
        return weather.includes('rain') || weather.includes('wet') || weather.includes('snow') || weather.includes('ice');
    };
    const wetAll = rows.filter(wetFilter).length;
    const wetKA = kaCrashes.filter(wetFilter).length;
    const wetAllPct = total > 0 ? (wetAll / total * 100) : 0;
    const wetKAPct = kaTotal > 0 ? (wetKA / kaTotal * 100) : 0;
    const wetRatio = wetAllPct > 0 ? (wetKAPct / wetAllPct) : 0;
    results.push({
        name: 'Wet/Weather',
        icon: '🌧️',
        allCount: wetAll,
        kaCount: wetKA,
        allPct: wetAllPct.toFixed(1),
        kaPct: wetKAPct.toFixed(1),
        ratio: wetRatio.toFixed(2),
        overrep: wetRatio > 1.2,
        severity: wetRatio > 1.5 ? 'high' : wetRatio > 1.2 ? 'medium' : 'low',
        baseline: 12,
        cmfKeywords: ['friction', 'drainage', 'pavement']
    });

    // Pedestrian involved
    const pedAll = rows.filter(r => isYes(r[COL.PED])).length;
    const pedKA = kaCrashes.filter(r => isYes(r[COL.PED])).length;
    const pedAllPct = total > 0 ? (pedAll / total * 100) : 0;
    const pedKAPct = kaTotal > 0 ? (pedKA / kaTotal * 100) : 0;
    const pedRatio = pedAllPct > 0 ? (pedKAPct / pedAllPct) : 0;
    results.push({
        name: 'Pedestrian',
        icon: '🚶',
        allCount: pedAll,
        kaCount: pedKA,
        allPct: pedAllPct.toFixed(1),
        kaPct: pedKAPct.toFixed(1),
        ratio: pedRatio.toFixed(2),
        overrep: pedRatio > 1.2,
        severity: pedRatio > 1.5 ? 'high' : pedRatio > 1.2 ? 'medium' : 'low',
        baseline: 3,
        cmfKeywords: ['pedestrian', 'crosswalk', 'sidewalk', 'RRFB']
    });

    // Bicycle involved
    const bikeAll = rows.filter(r => isYes(r[COL.BIKE])).length;
    const bikeKA = kaCrashes.filter(r => isYes(r[COL.BIKE])).length;
    const bikeAllPct = total > 0 ? (bikeAll / total * 100) : 0;
    const bikeKAPct = kaTotal > 0 ? (bikeKA / kaTotal * 100) : 0;
    const bikeRatio = bikeAllPct > 0 ? (bikeKAPct / bikeAllPct) : 0;
    results.push({
        name: 'Bicycle',
        icon: '🚴',
        allCount: bikeAll,
        kaCount: bikeKA,
        allPct: bikeAllPct.toFixed(1),
        kaPct: bikeKAPct.toFixed(1),
        ratio: bikeRatio.toFixed(2),
        overrep: bikeRatio > 1.2,
        severity: bikeRatio > 1.5 ? 'high' : bikeRatio > 1.2 ? 'medium' : 'low',
        baseline: 2,
        cmfKeywords: ['bicycle', 'bike lane', 'shared use path']
    });

    // Young driver (if available)
    if (COL.YOUNG_DRIVER !== undefined) {
        const youngAll = rows.filter(r => isYes(r[COL.YOUNG_DRIVER])).length;
        const youngKA = kaCrashes.filter(r => isYes(r[COL.YOUNG_DRIVER])).length;
        const youngAllPct = total > 0 ? (youngAll / total * 100) : 0;
        const youngKAPct = kaTotal > 0 ? (youngKA / kaTotal * 100) : 0;
        const youngRatio = youngAllPct > 0 ? (youngKAPct / youngAllPct) : 0;
        results.push({
            name: 'Young Driver',
            icon: '👤',
            allCount: youngAll,
            kaCount: youngKA,
            allPct: youngAllPct.toFixed(1),
            kaPct: youngKAPct.toFixed(1),
            ratio: youngRatio.toFixed(2),
            overrep: youngRatio > 1.2,
            severity: youngRatio > 1.5 ? 'high' : youngRatio > 1.2 ? 'medium' : 'low',
            baseline: 12,
            cmfKeywords: ['education', 'enforcement']
        });
    }

    // Calculate overall risk score
    const overrepFactors = results.filter(r => r.overrep);
    const highSeverityFactors = results.filter(r => r.severity === 'high');
    const riskScore = Math.min(100, overrepFactors.length * 15 + highSeverityFactors.length * 10);

    // Sort by overrepresentation ratio (highest first)
    results.sort((a, b) => parseFloat(b.ratio) - parseFloat(a.ratio));

    // Render enhanced results with modernized FHWA overrepresentation display
    const scoreLevel = riskScore > 70 ? 'ct-critical' : riskScore > 50 ? 'ct-high' : riskScore > 30 ? 'ct-medium' : 'ct-low';
    el.innerHTML = `
        <div class="ct-risk-score">
            <div class="ct-risk-score-bar">
                <div class="ct-risk-score-fill ${scoreLevel}" style="width:${riskScore}%;"></div>
                <div class="ct-risk-score-markers">
                    <div class="ct-risk-score-marker"></div>
                    <div class="ct-risk-score-marker"></div>
                    <div class="ct-risk-score-marker"></div>
                    <div class="ct-risk-score-marker"></div>
                </div>
            </div>
            <div class="ct-risk-score-value ct-stat-value">${riskScore}</div>
        </div>
        <div style="font-size:.65rem;color:#6b7280;text-align:center;margin-bottom:.5rem;">${overrepFactors.length} overrepresented factor${overrepFactors.length !== 1 ? 's' : ''} detected</div>
        ${results.slice(0, 6).map(r => {
            const barWidth = Math.min(100, parseFloat(r.ratio) * 40);
            const ratioClass = r.severity === 'high' ? 'ct-high' : r.severity === 'medium' ? 'ct-medium' : 'ct-low';
            const barClass = r.overrep ? 'ct-overrep' : 'ct-normal';
            return `
            <div class="ct-risk-item">
                <div class="ct-risk-item-icon">${r.icon}</div>
                <div class="ct-risk-item-content">
                    <div class="ct-risk-item-name">${r.name}</div>
                    <div class="ct-risk-item-bar">
                        <div class="ct-risk-item-bar-fill ${barClass}" style="width:${barWidth}%;"></div>
                    </div>
                </div>
                <div class="ct-risk-item-ratio ${ratioClass}">${r.ratio}x</div>
            </div>`;
        }).join('')}
        <div style="margin-top:.5rem;padding:.3rem;background:#f8fafc;border-radius:4px;font-size:.6rem;color:#6b7280;text-align:center;">
            <span style="color:#dc2626;">●</span> &gt;1.2x = Overrepresented (FHWA methodology)
        </div>
    `;

    crashTreeState.riskFactors.analyzed = results;
    crashTreeState.riskFactors.score = riskScore;
}

// Build and display secondary tree analysis (shows both Facility and Crash Type)
function buildSecondaryTreeAnalysis() {
    // The #crashTreeSecondaryAnalysis panel ships a "Building secondary
    // analysis..." spinner in its initial markup. This function is synchronous,
    // so the spinner only persists if we bail early or a tree helper throws —
    // guarantee the panel is rewritten on every exit path so it never sticks.
    const _secondaryEl = document.getElementById('crashTreeSecondaryAnalysis');
    const _setSecondaryMsg = (msg) => {
        if (_secondaryEl) {
            _secondaryEl.innerHTML =
                '<div style="text-align:center;padding:.75rem;color:var(--gray);font-size:.8rem;">'
                + msg + '</div>';
        }
    };
  try {
    // Matview-only mode: sampleRows is empty, so row-level secondary tree
    // cannot be built. Surface real data from the already-built primary
    // tree (top-3 children of the deepest drill-path node, or root).
    if (_isSupabaseMode()) {
        _renderSecondaryFromPrimary();
        return;
    }

    // Use date-filtered crashes (already filtered by severity and date)
    const filteredCrashes = getCrashTreeFilteredCrashes();

    if (filteredCrashes.length === 0) {
        // CC 212: row-level filtering excluded everything (or sampleRows
        // is a partial subset). If the primary tree has already been built
        // (from matview or earlier full data), surface its top categories
        // instead of an unhelpful "no matches" panel.
        if (crashTreeState.treeData) {
            _renderSecondaryFromPrimary();
        } else {
            _setSecondaryMsg('No crashes match the current filters.');
        }
        return;
    }

    // Determine secondary tree type based on current primary type
    // Facility → show Crash Type, Crash Type → show Facility, Contributing Factors → show Crash Type
    let secondaryType;
    if (crashTreeState.treeType === 'facility') {
        secondaryType = 'crashType';
    } else if (crashTreeState.treeType === 'crashType') {
        secondaryType = 'facility';
    } else {
        // Contributing Factors → show Crash Type as secondary (most complementary)
        secondaryType = 'crashType';
    }

    // Build the secondary tree - pass date-only filtered data for accurate KA% calculations
    const dateOnlyFiltered = getCrashTreeDateOnlyFilteredCrashes();
    let secondaryTree;
    if (secondaryType === 'facility') {
        secondaryTree = buildFacilityTree(filteredCrashes, dateOnlyFiltered);
    } else if (secondaryType === 'crashType') {
        secondaryTree = buildCrashTypeTree(filteredCrashes, dateOnlyFiltered);
    } else {
        secondaryTree = buildContributingFactorsTree(filteredCrashes, dateOnlyFiltered);
    }

    if (!secondaryTree) {
        _setSecondaryMsg('Secondary analysis unavailable for this selection.');
        return;
    }

    // Find dominant path in secondary tree
    const secondaryPath = ['root'];
    let node = secondaryTree;
    while (node.children && node.children.length > 0) {
        const dominant = node.children.reduce((max, child) =>
            child.total > max.total ? child : max
        );
        secondaryPath.push(dominant.id);
        node = dominant;
    }

    // Get focus for secondary tree - ONLY set the focus for the secondary type
    // Do not overwrite the primary focus that was set by autoExpandDominantPath
    let secondaryFocus = null;
    if (secondaryType === 'facility') {
        const lastNode = findNodeById(secondaryTree, secondaryPath[secondaryPath.length - 1]);
        secondaryFocus = lastNode ? lastNode.name : null;
        // Only set facility focus if primary was crashType or contributingFactors
        if (crashTreeState.treeType !== 'facility') {
            crashTreeState.focusFacility = secondaryFocus;
        }
    } else if (secondaryType === 'crashType') {
        const firstChild = secondaryPath.length > 1 ? findNodeById(secondaryTree, secondaryPath[1]) : null;
        secondaryFocus = firstChild ? firstChild.name : null;
        // Only set crashType focus if primary was facility or contributingFactors
        if (crashTreeState.treeType !== 'crashType') {
            crashTreeState.focusCrashType = secondaryFocus;
        }
    }

    // Get secondary tree icon and label
    const getTreeLabel = (type) => {
        if (type === 'facility') return { icon: '🏗️', label: 'Facility Focus' };
        if (type === 'crashType') return { icon: '💥', label: 'Crash Type Focus' };
        return { icon: '🧩', label: 'Contributing Factors Focus' };
    };
    const secondaryLabel = getTreeLabel(secondaryType);

    // Render secondary analysis in the summary panel
    const secondaryEl = document.getElementById('crashTreeSecondaryAnalysis');
    if (secondaryEl && secondaryTree) {
        const pathNames = secondaryPath.slice(1).map(id => {
            const n = findNodeById(secondaryTree, id);
            return n ? n.name : id;
        });

        // Get the final node for stats - use unfiltered KA for accuracy
        const finalNode = findNodeById(secondaryTree, secondaryPath[secondaryPath.length - 1]);
        const finalKA = finalNode ? (finalNode.unfilteredKA !== undefined ? finalNode.unfilteredKA : ((finalNode.K || 0) + (finalNode.A || 0))) : 0;

        // Get top 3 categories with their percentages
        const topCategories = secondaryTree.children
            .slice(0, 3)
            .map(c => {
                const cKA = (c.K || 0) + (c.A || 0);
                return `<div style="display:flex;justify-content:space-between;align-items:center;padding:.25rem 0;border-bottom:1px solid #e5e7eb;">
                    <span style="font-size:.75rem;color:#374151;">${c.name}</span>
                    <span style="font-size:.75rem;font-weight:600;color:#0369a1;">${c.total.toLocaleString()} <span style="color:#6b7280;font-weight:400;">(${c.pct.toFixed(0)}%)</span></span>
                </div>`;
            }).join('');

        secondaryEl.innerHTML = `
            <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:var(--radius);padding:.6rem;">
                <div style="font-weight:600;color:#0369a1;font-size:.75rem;margin-bottom:.3rem;">
                    ${secondaryLabel.icon} ${secondaryLabel.label}:
                </div>
                <div style="font-size:.85rem;color:#0c4a6e;font-weight:600;margin-bottom:.25rem;">
                    ${pathNames.join(' → ') || 'Not identified'}
                </div>
                <div style="font-size:.65rem;color:#0369a1;margin-bottom:.4rem;">
                    ${finalNode ? finalNode.total.toLocaleString() : 0} crashes • ${finalKA} KA injuries
                </div>
                <div style="margin-top:.35rem;border-top:1px solid #bae6fd;padding-top:.35rem;">
                    <div style="font-size:.65rem;color:#6b7280;margin-bottom:.25rem;font-weight:600;">Top Categories:</div>
                    ${topCategories}
                </div>
            </div>
        `;
    }

    console.log('[CrashTree] Both analyses complete - Facility:', crashTreeState.focusFacility, ', Crash Type:', crashTreeState.focusCrashType);
  } catch (e) {
    console.warn('[CrashTree] Secondary analysis failed:', e && e.message);
    _setSecondaryMsg('Secondary analysis unavailable: '
        + (e && e.message ? e.message : 'unexpected error'));
  }
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.crashTree = CL.crashTree || {};
  window.updateCrashTreeDataTable = updateCrashTreeDataTable; CL.crashTree.updateCrashTreeDataTable = updateCrashTreeDataTable;
  window.analyzeRiskFactors = analyzeRiskFactors; CL.crashTree.analyzeRiskFactors = analyzeRiskFactors;
  window.buildSecondaryTreeAnalysis = buildSecondaryTreeAnalysis; CL.crashTree.buildSecondaryTreeAnalysis = buildSecondaryTreeAnalysis;
  CL._registerModule('crash-tree/analysis');
})();
