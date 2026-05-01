-- =============================================================================
-- §6.3 — PostgREST response cache headers
-- =============================================================================
-- Adds a tiny pre-request function that tells PostgREST to send a 5-minute
-- Cache-Control header with stale-while-revalidate=600 on every response.
-- Pairs with the front-end's IndexedDB SWR cache (assets/js/data-client.js
-- _swrQuery) — the browser serves the cached body immediately, refreshes
-- in the background.
--
-- After applying this migration, set the PostgREST env var
--   PGRST_DB_PRE_REQUEST=public.add_cache_headers
-- and reload PostgREST. Without that env var, PostgREST won't invoke the
-- function and the headers won't appear.
--
-- Verification (after PostgREST reload):
--   curl -sI "$URL/dashboard_summary?limit=1" \
--        -H "apikey: $KEY" -H "Authorization: Bearer $KEY" | grep -i cache
--   Expected: Cache-Control: public, max-age=300, stale-while-revalidate=600
-- =============================================================================

CREATE OR REPLACE FUNCTION public.add_cache_headers()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- 5 min fresh, 10 min stale — matches the front-end SWR window.
    PERFORM set_config(
        'response.headers',
        '[{"Cache-Control": "public, max-age=300, stale-while-revalidate=600"}]',
        true   -- is_local = true → only applies to current request
    );
END
$$;

ALTER FUNCTION public.add_cache_headers() OWNER TO postgres;

-- PostgREST runs the pre-request as the authenticator role (anon for our
-- anon-only setup). Make sure the role has EXECUTE permission.
GRANT EXECUTE ON FUNCTION public.add_cache_headers() TO anon;
GRANT EXECUTE ON FUNCTION public.add_cache_headers() TO authenticator;
