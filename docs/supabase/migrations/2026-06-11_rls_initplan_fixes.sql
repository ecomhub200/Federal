-- 2026-06-11 — RLS init-plan optimization
--
-- get_advisors('performance') flagged 6 `auth_rls_initplan` warnings: policies
-- that call uid() per-row. Wrapping the call in a scalar subselect `(select
-- uid())` makes Postgres evaluate it ONCE per query instead of once per row
-- (standard Supabase RLS perf pattern). Logic is unchanged.
--
-- NOTE: the ~695 `unused_index` INFO notices are intentionally NOT actioned
-- here — on a low-traffic / recently-restarted instance those stats are
-- unreliable, and the flagged crashes_delaware indexes back nightly matview
-- REFRESHes and the spatial RPC (find_crashes_near_assets). Pruning them is a
-- minor write-speed optimization that should wait for real pg_stat_user_indexes
-- evidence under production traffic, not a user-facing loading win.

ALTER POLICY profiles_select_own  ON public.profiles      USING      ((select uid()) = user_id);
ALTER POLICY profiles_update_own  ON public.profiles      USING      ((select uid()) = user_id);
ALTER POLICY profiles_insert_own  ON public.profiles      WITH CHECK ((select uid()) = user_id);
ALTER POLICY subs_select_own      ON public.subscriptions USING      ((select uid()) = user_id);
ALTER POLICY quota_select_own     ON public.ai_quota_usage USING     ((select uid()) = user_id);
ALTER POLICY quota_insert_own     ON public.ai_quota_usage WITH CHECK ((select uid()) = user_id);
