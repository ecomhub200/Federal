/**
 * CL crashTree.render module
 *
 * Extracted from app/index.html (name-anchored, live L85443-L85852)
 * on 2026-05-23. Round X modular refactor — CC 200 Pass B.
 * Responsibility: render the crash tree visualization (node HTML, severity
 * bars), navigation map + cross-tab handoff, expand/collapse interactions,
 * summary + stats panels.
 *
 * Moved decls (12): renderCrashTree, const CRASH_TREE_NAV_MAP,
 *   navigateFromCrashTree, renderTreeNode, toggleCrashTreeNode,
 *   expandAllTreeNodes, collapseAllTreeNodes, autoExpandDominantPath,
 *   findNodeById, getTreeTypeLabel, updateCrashTreeSummary,
 *   updateCrashTreeStats.
 *
 * CRASH_TREE_NAV_MAP is module-private (verified zero external refs).
 *
 * Shared globals (crashTreeState, crashState, COL, isIntersection, isYes,
 * showToast, showTab) resolve via the shared classic-script global lexical
 * environment.
 *
 * Public API (back-compat dual exposure): window.<fn> + CL.crashTree.<fn>
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L85443-L85852) ───
// Render crash tree visualization
function renderCrashTree() {
    const container = document.getElementById('crashTreeViz');
    const placeholder = document.getElementById('crashTreePlaceholder');
    const tree = crashTreeState.treeData;

    if (!tree || tree.total === 0) {
        placeholder.style.display = 'block';
        container.style.display = 'none';
        return;
    }

    placeholder.style.display = 'none';
    container.style.display = 'block';

    // Build HTML tree
    const html = renderTreeNode(tree, 0, []);
    container.innerHTML = `<div class="crash-tree-root">${html}</div>`;

    // Update summary
    updateCrashTreeSummary();
}

// Crash Tree node-to-tab navigation mapping (direct matches only)
const CRASH_TREE_NAV_MAP = {
    // Facility Type Tree
    'intersection': { tab: 'intersection', tooltip: 'Go to Intersections tab' },
    'segment': { tab: 'hotspots', tooltip: 'Go to Hot Spots tab' },
    // Crash Type Tree
    'pedestrian': { tab: 'pedestrian', tooltip: 'Go to Ped/Bike tab' },
    'bicycle': { tab: 'pedestrian', tooltip: 'Go to Ped/Bike tab' },
    // Contributing Factors Tree
    'cf-impaired': { tab: 'safety', tooltip: 'Go to Safety Focus tab' },
    'cf-alcohol': { tab: 'safety', tooltip: 'Go to Safety Focus tab' },
    'cf-drug': { tab: 'safety', tooltip: 'Go to Safety Focus tab' },
    'cf-speeding': { tab: 'fatalspeeding', tooltip: 'Go to Fatal & Speeding tab' },
    'cf-distracted': { tab: 'safety', tooltip: 'Go to Safety Focus tab' },
    'cf-drowsy': { tab: 'safety', tooltip: 'Go to Safety Focus tab' },
    'cf-young-driver': { tab: 'safety', tooltip: 'Go to Safety Focus tab' },
    'cf-senior-driver': { tab: 'safety', tooltip: 'Go to Safety Focus tab' },
    'cf-darkness': { tab: 'safety', tooltip: 'Go to Safety Focus tab' },
    'cf-weather': { tab: 'safety', tooltip: 'Go to Safety Focus tab' }
};

// Navigate from Crash Tree branch to destination tab
function navigateFromCrashTree(tabId, event) {
    event.stopPropagation(); // Prevent triggering the node expand/collapse

    // Check if severity filter is active (not showing all severities)
    const allSeverities = ['K', 'A', 'B', 'C', 'O'];
    const currentFilter = crashTreeState.severityFilter || ['K', 'A'];
    const isFiltered = currentFilter.length < allSeverities.length;

    // Show warning about potential count discrepancy
    if (isFiltered) {
        const filterLabel = currentFilter.join('+');
        showToast(`Note: Crash Tree shows ${filterLabel} severity only. Destination tab displays all crash severities.`, 'info', 5000);
    }

    showTab(tabId);
}

// Render a single tree node - MODERNIZED UI
function renderTreeNode(node, level, path) {
    if (!node) return '';

    const isExpanded = crashTreeState.expandedNodes.has(node.id);
    const isSelected = crashTreeState.selectedNode === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isDominant = crashTreeState.dominantPath.includes(node.id);

    // Use unfiltered KA count and total for accurate KA% regardless of severity filter
    const kaCount = node.unfilteredKA !== undefined ? node.unfilteredKA : ((node.K || 0) + (node.A || 0));
    const baseForKAPct = node.unfilteredTotal || node.total;
    const kaPct = baseForKAPct > 0 ? (kaCount / baseForKAPct * 100).toFixed(1) : 0;

    // Determine comparison badge
    let comparisonHtml = '';
    if (node.stateAvg !== undefined && level > 0) {
        const diff = node.pct - node.stateAvg;
        const diffAbs = Math.abs(diff).toFixed(1);
        if (diff > 5) {
            comparisonHtml = `<span class="ct-comparison ct-higher">▲ +${diffAbs}%</span>`;
        } else if (diff < -5) {
            comparisonHtml = `<span class="ct-comparison ct-lower">▼ ${diffAbs}%</span>`;
        }
    }

    // Build severity bar segments with tooltips
    const buildSeverityBar = () => {
        const segments = [];
        const severities = [
            { key: 'K', label: 'Fatal', count: node.K || 0 },
            { key: 'A', label: 'Serious Injury', count: node.A || 0 },
            { key: 'B', label: 'Minor Injury', count: node.B || 0 },
            { key: 'C', label: 'Possible Injury', count: node.C || 0 },
            { key: 'O', label: 'PDO', count: node.O || 0 }
        ];

        severities.forEach(sev => {
            if (sev.count > 0) {
                const pct = (sev.count / node.total * 100);
                const width = Math.max(pct, 0.5); // Min width for visibility
                const showLabel = sev.count > 2 && pct > 8;
                segments.push(`<div class="ct-severity-segment ct-sev-${sev.key.toLowerCase()}"
                    style="width:${width}%"
                    data-tooltip="${sev.label}: ${sev.count} (${pct.toFixed(1)}%)">${showLabel ? sev.count : ''}</div>`);
            }
        });
        return segments.join('');
    };

    // Chevron SVG
    const chevronSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

    // Navigation link arrow SVG
    const navArrowSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

    // Check if this node has a direct navigation mapping
    const navMapping = CRASH_TREE_NAV_MAP[node.id];
    const navLinkHtml = navMapping ?
        `<span class="ct-nav-link" data-tooltip="${navMapping.tooltip}" onclick="navigateFromCrashTree('${navMapping.tab}', event)">${navArrowSvg}</span>` : '';

    // Build node classes
    const nodeClasses = ['ct-tree-node'];
    if (isDominant) nodeClasses.push('ct-dominant');
    if (isSelected) nodeClasses.push('ct-selected');
    if (isExpanded) nodeClasses.push('ct-expanded');

    // Build children HTML
    let childrenHtml = '';
    if (hasChildren) {
        const childNodes = node.children.map((child, idx) =>
            `<div class="ct-tree-node-wrapper">${renderTreeNode(child, level + 1, [...path, node.id])}</div>`
        ).join('');
        childrenHtml = `<div class="ct-tree-children ${isExpanded ? 'ct-expanded' : 'ct-collapsed'}">${childNodes}</div>`;
    }

    return `
        <div class="${nodeClasses.join(' ')}" data-node-id="${node.id}" style="margin-left:${level > 0 ? '0' : '0'}px;">
            <div class="ct-node-header" onclick="toggleCrashTreeNode('${node.id}')">
                <div class="ct-node-left">
                    ${hasChildren ? `<span class="ct-chevron">${chevronSvg}</span>` : '<span style="width:18px;"></span>'}
                    <span class="ct-node-name">${node.name}</span>
                    ${isDominant && level > 0 ? '<span class="ct-focus-badge">Focus</span>' : ''}
                    ${comparisonHtml}
                    ${navLinkHtml}
                </div>
                <div class="ct-node-right">
                    <span class="ct-node-count ct-stat-value">${node.total.toLocaleString()}</span>
                    <span class="ct-node-pct ct-stat-value">(${node.pct.toFixed(1)}%)</span>
                </div>
            </div>
            <div class="ct-severity-bar">
                ${buildSeverityBar()}
            </div>
            <div class="ct-ka-summary">
                KA: <span class="ct-ka-count ct-stat-value">${kaCount}</span> (${kaPct}%)
            </div>
        </div>
        ${childrenHtml}
    `;
}

// Toggle tree node expand/collapse
function toggleCrashTreeNode(nodeId) {
    if (crashTreeState.expandedNodes.has(nodeId)) {
        crashTreeState.expandedNodes.delete(nodeId);
    } else {
        crashTreeState.expandedNodes.add(nodeId);
    }
    crashTreeState.selectedNode = nodeId;
    renderCrashTree();
}

// Expand all tree nodes
function expandAllTreeNodes() {
    const addAllIds = (node) => {
        if (!node) return;
        crashTreeState.expandedNodes.add(node.id);
        if (node.children) {
            node.children.forEach(addAllIds);
        }
    };
    addAllIds(crashTreeState.treeData);
    renderCrashTree();
}

// Collapse all tree nodes
function collapseAllTreeNodes() {
    crashTreeState.expandedNodes = new Set(['root']);
    renderCrashTree();
}

// Auto-expand dominant path
function autoExpandDominantPath() {
    if (!crashTreeState.treeData) return;

    // Find dominant path (highest count at each level)
    const path = ['root'];
    let node = crashTreeState.treeData;
    let isRootLevel = true;

    while (node.children && node.children.length > 0) {
        let dominant;
        if (isRootLevel && crashTreeState.treeType === 'facility') {
            // CT-A: in facility mode, level1 IS the severity bucket
            // (K/A/B/C/O). Picking max.total always lands on O (PDOs
            // dominate) -- every descendant of O has K=0/A=0 by
            // definition, useless for safety targeting. Pick max K+A
            // so focus lands on a real fatal/serious branch.
            dominant = node.children.reduce((best, c) => {
                const ka = (c.K || 0) + (c.A || 0);
                const bestKa = best ? ((best.K || 0) + (best.A || 0)) : -1;
                return ka > bestKa ? c : best;
            }, null);
        } else {
            dominant = node.children.reduce((max, child) =>
                child.total > max.total ? child : max
            );
        }
        if (!dominant) break;
        path.push(dominant.id);
        node = dominant;
        isRootLevel = false;
    }

    crashTreeState.dominantPath = path;
    crashTreeState.expandedNodes = new Set(path);

    // Set focus based on tree type
    let focusName = null;
    if (crashTreeState.treeType === 'facility') {
        const lastNode = findNodeById(crashTreeState.treeData, path[path.length - 1]);
        crashTreeState.focusFacility = lastNode ? lastNode.name : null;
        focusName = crashTreeState.focusFacility;
    } else if (crashTreeState.treeType === 'crashType') {
        const firstChild = path.length > 1 ? findNodeById(crashTreeState.treeData, path[1]) : null;
        crashTreeState.focusCrashType = firstChild ? firstChild.name : null;
        focusName = crashTreeState.focusCrashType;
    } else if (crashTreeState.treeType === 'contributingFactors') {
        // For contributing factors, get the dominant factor category
        const firstChild = path.length > 1 ? findNodeById(crashTreeState.treeData, path[1]) : null;
        crashTreeState.focusContributingFactor = firstChild ? firstChild.name : null;
        focusName = crashTreeState.focusContributingFactor;
    }

    renderCrashTree();
    updateCrashTreeSummary();

    showToast('Focus identified: ' + (focusName || 'Not identified'), 'success');
}

// Find node by ID
function findNodeById(node, id) {
    if (!node) return null;
    if (node.id === id) return node;
    if (node.children) {
        for (const child of node.children) {
            const found = findNodeById(child, id);
            if (found) return found;
        }
    }
    return null;
}

// Helper function to get tree type labels for display and reports
function getTreeTypeLabel(format = 'full') {
    const labels = {
        facility: {
            full: 'Facility Type',
            short: 'Facility',
            icon: '🏗️',
            analysis: 'Facility Type Analysis',
            description: 'crashes at this facility type'
        },
        crashType: {
            full: 'Crash Type',
            short: 'Crash Type',
            icon: '💥',
            analysis: 'Crash Type Analysis',
            description: 'this crash type'
        },
        contributingFactors: {
            full: 'Contributing Factors',
            short: 'Contributing Factor',
            icon: '🧩',
            analysis: 'Contributing Factors Analysis',
            description: 'crashes with this contributing factor'
        }
    };
    const treeLabels = labels[crashTreeState.treeType] || labels.crashType;
    return treeLabels[format] || treeLabels.full;
}

// Update summary panel
function updateCrashTreeSummary() {
    const summaryEl = document.getElementById('crashTreeSummary');
    if (!summaryEl) return;

    if (!crashTreeState.treeData) {
        summaryEl.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--gray);">No data</div>';
        return;
    }

    const tree = crashTreeState.treeData;
    // Use unfiltered KA count for accurate display regardless of severity filter
    const kaTotal = tree.unfilteredKA !== undefined ? tree.unfilteredKA : ((tree.K || 0) + (tree.A || 0));
    const baseForKAPct = tree.unfilteredTotal || tree.total;
    const kaPct = baseForKAPct > 0 ? ((kaTotal / baseForKAPct) * 100).toFixed(1) : 0;
    const treeLabel = crashTreeState.treeType === 'facility' ? '🏗️ Facility'
        : crashTreeState.treeType === 'crashType' ? '💥 Crash Type'
        : '🧩 Contributing Factors';

    let focusHtml = '';
    if (crashTreeState.dominantPath.length > 1) {
        const pathNames = crashTreeState.dominantPath.slice(1).map(id => {
            const node = findNodeById(tree, id);
            return node ? node.name : id;
        });

        // Get the final node for additional stats - use unfiltered KA for accuracy
        const finalNode = findNodeById(tree, crashTreeState.dominantPath[crashTreeState.dominantPath.length - 1]);
        const finalKA = finalNode ? (finalNode.unfilteredKA !== undefined ? finalNode.unfilteredKA : ((finalNode.K || 0) + (finalNode.A || 0))) : 0;
        const finalPct = finalNode ? finalNode.pct.toFixed(1) : 0;

        focusHtml = `
            <div style="background:#f0fdf4;border:1px solid #a7f3d0;border-radius:var(--radius);padding:.75rem;margin-top:.5rem;">
                <div style="font-weight:600;color:#065f46;font-size:.75rem;margin-bottom:.35rem;">
                    ${treeLabel} Focus:
                </div>
                <div style="font-size:.9rem;color:#047857;font-weight:600;margin-bottom:.35rem;">
                    ${pathNames.join(' → ')}
                </div>
                <div style="font-size:.7rem;color:#059669;">
                    ${finalNode ? finalNode.total.toLocaleString() : 0} crashes (${finalPct}%) • ${finalKA} KA injuries
                </div>
            </div>
        `;
    }

    summaryEl.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;">
            <div style="text-align:center;padding:.4rem;background:#f8fafc;border-radius:var(--radius);">
                <div style="font-size:1.1rem;font-weight:700;color:var(--dark);">${tree.total.toLocaleString()}</div>
                <div style="font-size:.65rem;color:var(--gray);">Total Crashes</div>
            </div>
            <div style="text-align:center;padding:.4rem;background:#fef2f2;border-radius:var(--radius);">
                <div style="font-size:1.1rem;font-weight:700;color:#dc2626;">${kaTotal.toLocaleString()}</div>
                <div style="font-size:.65rem;color:#991b1b;">KA (${kaPct}%)</div>
            </div>
        </div>
        ${focusHtml}
    `;
}

// Update statistics panel
function updateCrashTreeStats() {
    const el = document.getElementById('ctStatsContent');
    if (!el) return;

    // Matview-only path (county rollup with no sampleRows): synthesize stats
    // from crashTreeState totals so the panel doesn't render zeros.
    if (!crashState.loaded) {
        if (crashTreeState.loaded && crashTreeState.treeData) {
            const t = crashTreeState.totalCrashes || 0;
            const root = crashTreeState.treeData || {};
            const k = root.K || 0, a = root.A || 0;
            const kaPct = t > 0 ? ((k + a) / t * 100).toFixed(1) : '0.0';
            el.innerHTML = `
                <div style="font-size:.8rem;line-height:1.8;">
                    <div style="display:flex;justify-content:space-between;"><span>Total Records:</span><strong>${t.toLocaleString()}</strong></div>
                    <div style="display:flex;justify-content:space-between;"><span>Fatal (K):</span><strong style="color:#dc2626;">${k.toLocaleString()}</strong></div>
                    <div style="display:flex;justify-content:space-between;"><span>Serious (A):</span><strong style="color:#ea580c;">${a.toLocaleString()}</strong></div>
                    <div style="display:flex;justify-content:space-between;"><span>KA Rate:</span><strong>${kaPct}%</strong></div>
                </div>
            `;
            return;
        }
        el.innerHTML = '<div style="text-align:center;color:var(--gray);">Load data to view statistics</div>';
        return;
    }

    // Use date-only filtered data to match tree's date range (not severity-filtered)
    const dateFiltered = getCrashTreeDateOnlyFilteredCrashes();
    const hasDateFilter = crashTreeState.dateFilter.startDate || crashTreeState.dateFilter.endDate;

    // If date filter is active, compute stats from date-filtered data; otherwise use pre-computed aggregates
    let total, kCount, aCount, kaTotal, intTotal, pedTotal, bikeTotal;
    if (hasDateFilter && dateFiltered.length > 0) {
        total = dateFiltered.length;
        kCount = 0; aCount = 0; intTotal = 0; pedTotal = 0; bikeTotal = 0;
        dateFiltered.forEach(r => {
            const sev = (r[COL.SEVERITY] || '').charAt(0).toUpperCase();
            if (sev === 'K') kCount++;
            if (sev === 'A') aCount++;
            if (isIntersection(r)) intTotal++;
            if (isYes(r[COL.PED])) pedTotal++;
            if (isYes(r[COL.BIKE])) bikeTotal++;
        });
        kaTotal = kCount + aCount;
    } else {
        const agg = crashState.aggregates;
        total = crashState.totalRows;
        kCount = agg.bySeverity.K || 0;
        aCount = agg.bySeverity.A || 0;
        kaTotal = kCount + aCount;
        intTotal = agg.intersection?.total || 0;
        pedTotal = agg.ped?.total || 0;
        bikeTotal = agg.bike?.total || 0;
    }

    const dateLabel = hasDateFilter ? ' <span style="font-size:.6rem;color:#0369a1;">(filtered)</span>' : '';

    el.innerHTML = `
        <div style="font-size:.8rem;line-height:1.8;">
            <div style="display:flex;justify-content:space-between;"><span>Total Records${dateLabel}:</span><strong>${total.toLocaleString()}</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>Fatal (K):</span><strong style="color:#dc2626;">${kCount.toLocaleString()}</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>Serious (A):</span><strong style="color:#ea580c;">${aCount.toLocaleString()}</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>KA Rate:</span><strong>${total > 0 ? (kaTotal/total*100).toFixed(1) : 0}%</strong></div>
            <hr style="border:none;border-top:1px solid var(--border);margin:.5rem 0;">
            <div style="display:flex;justify-content:space-between;"><span>Intersection:</span><strong>${intTotal.toLocaleString()}</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>Pedestrian:</span><strong>${pedTotal.toLocaleString()}</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>Bicycle:</span><strong>${bikeTotal.toLocaleString()}</strong></div>
        </div>
    `;
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.crashTree = CL.crashTree || {};
  window.renderCrashTree = renderCrashTree; CL.crashTree.renderCrashTree = renderCrashTree;
  window.navigateFromCrashTree = navigateFromCrashTree; CL.crashTree.navigateFromCrashTree = navigateFromCrashTree;
  window.renderTreeNode = renderTreeNode; CL.crashTree.renderTreeNode = renderTreeNode;
  window.toggleCrashTreeNode = toggleCrashTreeNode; CL.crashTree.toggleCrashTreeNode = toggleCrashTreeNode;
  window.expandAllTreeNodes = expandAllTreeNodes; CL.crashTree.expandAllTreeNodes = expandAllTreeNodes;
  window.collapseAllTreeNodes = collapseAllTreeNodes; CL.crashTree.collapseAllTreeNodes = collapseAllTreeNodes;
  window.autoExpandDominantPath = autoExpandDominantPath; CL.crashTree.autoExpandDominantPath = autoExpandDominantPath;
  window.findNodeById = findNodeById; CL.crashTree.findNodeById = findNodeById;
  window.getTreeTypeLabel = getTreeTypeLabel; CL.crashTree.getTreeTypeLabel = getTreeTypeLabel;
  window.updateCrashTreeSummary = updateCrashTreeSummary; CL.crashTree.updateCrashTreeSummary = updateCrashTreeSummary;
  window.updateCrashTreeStats = updateCrashTreeStats; CL.crashTree.updateCrashTreeStats = updateCrashTreeStats;
  CL._registerModule('crash-tree/render');
})();
