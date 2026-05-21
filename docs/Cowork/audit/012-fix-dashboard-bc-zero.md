# CC 012 — [P1] Fix "Other Injury (B+C)" KPI = 0 on Dashboard

**From:** Chrome Claude audit 2026-05-20. **Severity:** P1 regression.

**Branch:** `claude/fix-dashboard-bc-zero`. **No PR.**

## The bug

Dashboard KPI cards show:
- Total Crashes: 134,159
- Fatal (K): 546
- Serious Injury (A): 19,428
- **Other Injury (B+C): 0** ⚠️
- PDO (O): 114,185
- K+A Combined: 19,974

Math check: 134,159 - 546 - 19,428 - 114,185 = **0** ← so the displayed B+C of 0 mathematically resolves, BUT this means EITHER:
(a) Delaware genuinely has no B+C crashes (unlikely — most states classify minor injuries B/C), or
(b) The matview is not returning B+C counts, and the visible "0" is a null falsely rendered as 0.

The Hotspots table ALSO shows B and C columns = 0 for high-crash rows → same root cause.

## §0 Pre-flight (MANDATORY — per CLAUDE.md Policy 1)

```bash
# Read map for B+C-related code
grep -i "B+C\|bc_combined\|sev_b\|sev_c\|otherInjury\|other_injury" app/CODE_MAP.md | head -20

# Find frontend B+C consumers
grep -rn "B+C\|bcCombined\|sev_b\|sev_c\|otherInjury" app/modules/dashboard/ app/modules/hotspots/ app/index.html | head -30

# Probe Supabase directly (the matview the dashboard hits) — REPLACE KEY if missing:
SUPA="https://srv1503081.hstgr.cloud/rest/v1"
KEY="$(grep -oE 'eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+' app/index.html | head -1)"
# Try the likely matview names; pick whichever returns 200
curl -s -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
  "$SUPA/mv_dashboard_summary?state=eq.delaware&limit=1" | head -c 600
echo
# Or the federal-summary endpoint:
curl -s -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
  "$SUPA/rpc/get_federal_summary" -X POST -H "Content-Type: application/json" -d '{"p_state":"delaware"}' | head -c 600
```

Look at the JSON response — is there a `bc_combined`, `b_count + c_count`, `total_b`, `total_c`, or similar field? If yes but it's null/0, it's a backend matview bug. If the field doesn't exist at all, it's a missing column.

## Fix approach

Two possibilities:

**Case A — Backend matview is missing B+C aggregation:**
The matview SELECT doesn't `SUM(sev='B') + SUM(sev='C')` or equivalent. This is a **Supabase-side fix** (Cowork's job — Murad needs to apply via Studio Monaco). Document in `docs/Cowork/COWORK_FIX_BC_AGGREGATION.md` what SQL to apply.

**Case B — Backend returns B+C in a different field name than frontend expects:**
E.g., backend returns `minor_injury_count` but frontend reads `bc_combined`. Update the frontend to read the correct field.

**Case C — Frontend math is wrong:**
Frontend computes B+C as `total - K - A - O` and one of those values is double-counted. Fix the computation.

Diagnose via the Supabase probe in §0. Likely **Case A or B**.

## Per-CLAUDE.md policies

- **Policy 2 (Extract-on-touch):** B+C handling is likely in `dashboard/dashboard-tab-kpi.js` or inline. If you touch a >100 LOC function, extract.
- **Policy 3 (Update map):** update affected map rows if anything moves.

## §5 Post-flight

```bash
node --check <touched module>
git diff --stat
```

## §6 Smoke

```
Hard-reload https://ecomhub200.github.io/Federal/app/?_cb=fix012

Dashboard KPIs:
  - Total Crashes: 134,159
  - Other Injury (B+C): should now be > 0 (likely several thousand)

Hotspots tab:
  - Click Analyze
  - High-crash rows (top 5) should have non-zero B and C column values

Math check: K + A + (B+C) + O should approximately equal Total Crashes.
```

## Commit + push

```bash
git add app/modules/ app/index.html app/CODE_MAP.md docs/Cowork/COWORK_FIX_BC_AGGREGATION.md
git commit -m "fix(dashboard,hotspots): resolve B+C aggregate = 0 [P1]

Root cause: <Case A/B/C>
Fix: <one line>
B+C now displays correct count on Dashboard + Hotspots."
git push -u origin claude/fix-dashboard-bc-zero
```

## Final report

```
CC 012 complete (B+C zero fix).
Root cause: <case>
B+C value before: 0
B+C value after: <number>
If Case A: COWORK_FIX_BC_AGGREGATION.md created for Murad to apply via Studio.
Branch pushed; no PR.
```
