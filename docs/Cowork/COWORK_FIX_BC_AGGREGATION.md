# Cowork backend fix — "Other Injury (B+C)" KPI = 0

**Audit:** Chrome Claude 2026-05-20. **Severity:** P1. **Owner:** Murad (apply via Supabase Studio).

## Symptom

Dashboard KPI cards (Delaware, County tier — Sussex):

| KPI | Value |
|---|---|
| Total Crashes | 134,159 |
| Fatal (K) | 546 |
| Serious Injury (A) | 19,428 |
| **Other Injury (B+C)** | **0** ⚠️ |
| PDO (O) | 114,185 |
| K+A Combined | 19,974 |

Hotspots table B/C columns are also 0 for high-crash rows — same root cause.

## Diagnosis — Case A (backend matview data gap)

`546 (K) + 19,428 (A) + 114,185 (O) = 134,159 (Total)` exactly. Every crash in
`dashboard_summary` for Delaware resolves to **K, A, or O only** — there are no
rows whose `crash_severity` begins with `B` or `C`.

The frontend is not at fault:
- `app/modules/data/supabase-bridge.js` `aggregate()` buckets by
  `crash_severity.charAt(0)` into `{K,A,B,C,O}` and `paintKPIs()` renders
  `kpiInjuryBC = sev.B + sev.C`. K and A render correctly, so the field and the
  aggregation work — the matview simply contains no B/C rows.
- `applyInjuryBCCapabilityGate()` (`app/index.html`) already blanks the tile to
  `—` **only when** `caps.has_severity_b === false && has_severity_c === false`.
  Delaware shows a literal `0`, so its capability flags are NOT both false —
  the frontend currently *expects* B/C data that the matview never delivers.

Delaware DMV uses the KABCO scale, so B (minor) and C (possible) injuries do
exist in the raw crash data. The loss is happening upstream — either in the
state normalizer's severity mapping or in the `dashboard_summary` matview's
`GROUP BY crash_severity`.

## What Murad needs to check (in Supabase Studio)

Run, in order, against the self-hosted Supabase (`srv1503081.hstgr.cloud`):

```sql
-- 1. Does the matview have B/C rows at all?
SELECT crash_severity, COUNT(*) AS rows, SUM(crash_count) AS crashes
FROM dashboard_summary
WHERE state = 'delaware'
GROUP BY crash_severity
ORDER BY crash_severity;

-- 2. Does the underlying crashes table have B/C? (substitute the real table)
SELECT severity, COUNT(*)
FROM crashes
WHERE state = 'delaware'
GROUP BY severity
ORDER BY severity;
```

- **If query 2 has B/C but query 1 does not** → the matview definition (or the
  ETL feeding it) is dropping/collapsing B and C. Fix the matview SELECT/
  GROUP BY so `crash_severity` preserves the `B` and `C` codes, then
  `REFRESH MATERIALIZED VIEW dashboard_summary;`.
- **If query 2 also lacks B/C** → the Delaware normalizer
  (`scripts/state_adapter.py`, `DelawareNormalizer` severity mapping) is
  collapsing B/C into A or O. Fix the severity map, re-run the Delaware
  download/normalize pipeline, then refresh the matview.
- **If Delaware genuinely cannot classify B/C** (unlikely for KABCO) → set
  `has_severity_b = false` and `has_severity_c = false` in the state
  capabilities row so `applyInjuryBCCapabilityGate()` shows `—` instead of a
  misleading `0`.

## Frontend follow-up (after backend is fixed)

No frontend code change is required if the backend fix lands — `paintKPIs()`
will pick up the B/C rows automatically. If the decision is "Delaware has no
B/C", the only change is the capability-flag row above; the existing gate
handles the rest.
