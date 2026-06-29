/**
 * Crash Lens Service Worker (Round 9 — Fix 4).
 *
 * Strategy:
 *   - Pre-cache the static module manifest on install so the second visit
 *     loads from cache (no network for app shell).
 *   - Stale-while-revalidate for ALL static assets (.js/.css/.svg/.png/woff*).
 *     Returns the cached copy instantly and revalidates in the background;
 *     fresh copy used on the next request.
 *   - Pass-through (no interception) for Supabase REST, R2 parquet, Mapbox /
 *     pmtiles tiles, and anything else that must always be live.
 *
 * Bump CACHE_NAME on every release so old caches get evicted on activate.
 */

const CACHE_NAME = 'crashlens-v20260629-r16';

// Pre-cache the critical app shell. Other modules will be lazy-cached on
// first fetch via the stale-while-revalidate handler below — listing every
// file here is unnecessary and brittle. These are the bytes the very first
// paint depends on.
const STATIC_PRECACHE = [
    '/Federal/app/',                  // directory URL — most users land here
    '/Federal/app/index.html',
    '/Federal/app/css/app.css',       // main stylesheet — first-paint critical
    '/Federal/app/modules/loader.js',
    '/Federal/app/modules/ui/skeletons.js',
    '/Federal/app/modules/data/road-type-mapping.js',
    '/Federal/app/modules/data/matview-cache.js',
    '/Federal/app/modules/data/prewarm.js',
    '/Federal/app/modules/data/supabase-bridge.js',
    '/Federal/app/modules/data/lazy-loader.js',
    '/Federal/app/modules/data/tab-loaders.js',
    '/Federal/app/modules/data/supabase-map-bridge.js',
    '/Federal/assets/js/data-client.js',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.min.js'
];

// Hosts whose responses we should NOT cache (always live).
const NEVER_CACHE_HOSTS = [
    'srv1503081.hstgr.cloud',          // self-hosted Supabase REST
    'r2.cloudflarestorage.com',        // R2 parquet
    'api.mapbox.com',
    'tiles.mapbox.com',
    'unpkg.com'                        // pmtiles loader can be cached separately if desired
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Precache best-effort — don't fail the install if a single
                // optional URL 404s (e.g. CDN hiccup).
                return Promise.all(STATIC_PRECACHE.map((url) =>
                    cache.add(url).catch((err) =>
                        console.warn('[SW] precache miss', url, err && err.message))
                ));
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

function _isStaticAsset(url) {
    return /\.(?:js|mjs|css|svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|ico)(?:\?|$)/i.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    let url;
    try { url = new URL(req.url); } catch (e) { return; }

    // Skip live-data hosts entirely.
    if (NEVER_CACHE_HOSTS.some((h) => url.host === h || url.host.endsWith('.' + h))) {
        return;
    }

    // Skip Supabase / Postgres / R2 / Mapbox path patterns regardless of host.
    if (/\/rest\/v1\//.test(url.pathname) || /\.parquet(?:\?|$)/i.test(url.pathname)) {
        return;
    }

    // Round-10 — alias the directory URL to index.html so warm reloads of
    // /Federal/app/ hit the precached shell instead of a 12 MB network fetch.
    if (url.pathname === '/Federal/app/' || url.pathname === '/Federal/app/index.html') {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) =>
                cache.match('/Federal/app/index.html').then((cached) => {
                    const fresh = fetch(req).then((res) => {
                        if (res && res.ok) cache.put('/Federal/app/index.html', res.clone()).catch(() => {});
                        return res;
                    }).catch(() => cached);
                    return cached || fresh;
                })
            )
        );
        return;
    }

    // Stale-while-revalidate for static assets.
    if (_isStaticAsset(url) || /\.html?$/i.test(url.pathname) || url.pathname.endsWith('/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) =>
                cache.match(req).then((cached) => {
                    const networkFetch = fetch(req).then((res) => {
                        if (res && res.ok && (res.type === 'basic' || res.type === 'cors')) {
                            cache.put(req, res.clone()).catch(() => {});
                        }
                        return res;
                    }).catch(() => cached);
                    return cached || networkFetch;
                })
            )
        );
    }
});
