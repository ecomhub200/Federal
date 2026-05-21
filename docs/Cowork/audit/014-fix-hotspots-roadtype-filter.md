# CC 014 — [P1] Fix Hotspots road-type filter (no-op)

**From:** Chrome Claude audit 2026-05-20. **Severity:** P1 regression.

**Branch:** `claude/fix-hotspots-roadtype-filter`. **No PR.**

## The bug

Switching the road-type radio (All Roads / County Roads / City Roads / All Roads No Interstate) on the Hotspots tab does NOT re-run the analysis. The table shows the same 21 rows regardless. User has to click "Analyze" manually.

## §0 Pre-flight

```bash
# Map lookup for Hotspots
sed -n '/^### Hot Spots/,/^###/p' app/CODE_MAP.md | head -40

# Find road-type change handler
grep -rn "roadType\|road_type\|RoadType" app/modules/hotspots/ app/index.html | head -30

# Find the analyzeHotspots function (the re-run trigger)
grep -rn "function +analyzeHotspots\|window.analyzeHotspots" app/modules/hotspots/ | head -5
```

## Fix approach

Option A — **Auto-rerun (preferred for UX):**
Bind a change listener to the road-type radios that calls `analyzeHotspots()` (or the appropriate re-render function) when the value changes.

```js
// Inside hotspots module init (or a new initRoadTypeBindings function):
document.querySelectorAll('input[name="roadType"]').forEach(radio => {
  radio.addEventListener('change', () => {
    if (typeof analyzeHotspots === 'function') analyzeHotspots();
  });
});
```

Option B — **Show warning badge (less invasive):**
When road-type changes but no Analyze click followed, show a small "Filters changed — click Analyze to update" banner.

**Pick Option A** — auto-rerun matches user expectation and matches Map/Dashboard behavior.

## Per-CLAUDE.md policies

- **Policy 2 (Extract-on-touch):** if you add binding logic and it's in inline `app/index.html`, consider extracting into the hotspots module. If you add to existing `hotspots/hotspots-tab-core.js`, no extraction needed.
- **Policy 3 (Update map):** if you add a new function (e.g., `bindHotspotsRoadTypeChange`), add it to the Function index.

## §5 Post-flight

```bash
node --check app/modules/hotspots/hotspots-tab-core.js  # or wherever you put the binding
git diff --stat
```

## §6 Smoke (CRITICAL — verify all 4 road-types trigger reanalysis)

```
Hard-reload https://ecomhub200.github.io/Federal/app/?_cb=fix014

Navigate to Hotspots tab. Click Analyze (initial run).
Record top row EPDO value.

For each road-type in [County Roads Only, City Roads Only, All Roads (No Interstate), All Roads]:
  1. Click the radio
  2. Wait 2-3 seconds
  3. Verify table re-renders (top row may change)
  4. Record new top row EPDO

Top row EPDO should differ across road-types (different scope = different ranking).
```

## Commit + push

```bash
git add app/modules/hotspots/ app/index.html app/CODE_MAP.md
git commit -m "fix(hotspots): road-type radio auto-reruns analysis [P1]

Was: changing road-type did nothing; user had to click Analyze.
Now: changing road-type immediately re-ranks hotspots.
Added change listener on input[name='roadType']."
git push -u origin claude/fix-hotspots-roadtype-filter
```

## Final report

```
CC 014 complete (hotspots road-type filter).
Binding added in: <file>
Smoke: 4/4 road-types trigger re-ranking, top row EPDO differs.
Branch pushed; no PR.
```
