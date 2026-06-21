/**
 * CL map.overture — Overture Maps layer integration (single module).
 * Verbatim from app/index.html. NO behavior change. overtureStacState +
 * OvertureVTDecoder stay module-private; OVERTURE_ENDPOINTS is window-mirrored
 * (read by 7 external sites). Functions dual-exposed window.<fn> + CL.map.overture.<fn>.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
/**
 * Overture Maps STAC state — tracks latest release and PMTiles instances.
 */
const overtureStacState = {
    latestRelease: null,       // e.g. "2026-01-21.0"
    releaseDate: null,         // e.g. "2026-01-21" (for PMTiles URL)
    pmtilesInstances: {},      // theme -> PMTiles instance
    stacLoaded: false,
    stacError: null
};

/**
 * Resolve the latest Overture Maps release that has PMTiles available.
 * The STAC catalog's "latest" release may not have PMTiles generated yet
 * (PMTiles generation lags behind Parquet data releases), so we verify
 * availability via a HEAD request and fall back to older releases if needed.
 * Caches the result in overtureStacState.
 */
async function overtureResolveLatestRelease() {
    if (overtureStacState.stacLoaded) return overtureStacState.releaseDate;

    try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 10000);
        const res = await fetch('https://stac.overturemaps.org/catalog.json', { signal: ctrl.signal });
        clearTimeout(timer);

        if (!res.ok) throw new Error(`STAC HTTP ${res.status}`);
        const catalog = await res.json();

        // Extract all release versions from catalog child links (newest first)
        const releaseVersions = (catalog.links || [])
            .filter(l => l.rel === 'child' && l.href)
            .map(l => {
                const m = l.href.match(/(\d{4}-\d{2}-\d{2}\.\d+)/);
                return m ? m[1] : null;
            })
            .filter(Boolean)
            .sort((a, b) => b.localeCompare(a));

        // Ensure the declared "latest" is tried first
        const declaredLatest = catalog.latest || catalog.links?.find(l => l.latest)?.href?.match(/(\d{4}-\d{2}-\d{2}\.\d+)/)?.[1];
        if (declaredLatest) {
            const idx = releaseVersions.indexOf(declaredLatest);
            if (idx > 0) {
                releaseVersions.splice(idx, 1);
                releaseVersions.unshift(declaredLatest);
            } else if (idx === -1) {
                releaseVersions.unshift(declaredLatest);
            }
        }

        // Try each release (up to 5) until we find one with available PMTiles
        const candidates = releaseVersions.slice(0, 5);
        for (const version of candidates) {
            const date = version.replace(/\.\d+$/, '');
            const testUrl = `https://overturemaps-tiles-us-west-2-beta.s3.amazonaws.com/${date}/base.pmtiles`;
            try {
                const headCtrl = new AbortController();
                const headTimer = setTimeout(() => headCtrl.abort(), 6000);
                const headRes = await fetch(testUrl, { method: 'HEAD', signal: headCtrl.signal });
                clearTimeout(headTimer);
                if (headRes.ok || headRes.status === 206) {
                    overtureStacState.latestRelease = version;
                    overtureStacState.releaseDate = date;
                    overtureStacState.stacLoaded = true;
                    if (version === declaredLatest) {
                        console.log(`[Overture] Resolved latest release: ${version} (tiles: ${date})`);
                    } else {
                        console.log(`[Overture] Latest release ${declaredLatest} has no PMTiles yet, using ${version} (tiles: ${date})`);
                    }
                    return date;
                }
                console.warn(`[Overture] PMTiles not available for ${version} (HTTP ${headRes.status}), trying older release...`);
            } catch (headErr) {
                console.warn(`[Overture] PMTiles check failed for ${version}: ${headErr.message}, trying older release...`);
            }
        }

        throw new Error('No releases with available PMTiles found in STAC catalog');
    } catch (err) {
        console.warn('[Overture] STAC resolution failed, using fallback date:', err.message);
        overtureStacState.stacError = err.message;
        // Fallback to known working release
        overtureStacState.releaseDate = '2026-01-21';
        overtureStacState.stacLoaded = true;
        return overtureStacState.releaseDate;
    }
}

/**
 * Get or create a PMTiles instance for a given Overture theme.
 * Reuses cached instances to avoid re-reading the PMTiles header.
 */
function overtureGetPMTiles(theme) {
    if (!overtureStacState.releaseDate) return null;
    if (overtureStacState.pmtilesInstances[theme]) return overtureStacState.pmtilesInstances[theme];

    if (typeof pmtiles === 'undefined' || !pmtiles.PMTiles) {
        console.error('[Overture] PMTiles library not loaded — check CDN availability');
        throw new Error('PMTiles library not loaded. Check browser console for CDN errors.');
    }

    const url = `https://overturemaps-tiles-us-west-2-beta.s3.amazonaws.com/${overtureStacState.releaseDate}/${theme}.pmtiles`;
    const instance = new pmtiles.PMTiles(url);
    overtureStacState.pmtilesInstances[theme] = instance;
    console.log(`[Overture] Created PMTiles instance for ${theme}: ${url}`);
    return instance;
}

// ---- Minimal MVT (Mapbox Vector Tile) Protobuf Decoder ----
// Decodes vector tile binary data into GeoJSON features.
// Only depends on ArrayBuffer — no external protobuf library needed.

const OvertureVTDecoder = {
    /**
     * Decode a vector tile ArrayBuffer into an object of { layerName: [GeoJSON features] }.
     * @param {ArrayBuffer} buf - Raw MVT protobuf bytes
     * @param {number} z - Tile zoom
     * @param {number} x - Tile column
     * @param {number} y - Tile row
     * @returns {Object} { layerName: [GeoJSON Feature, ...] }
     */
    decode(buf, z, x, y) {
        const pbf = new OvertureVTDecoder.Pbf(new Uint8Array(buf));
        const layers = {};
        while (pbf.pos < pbf.buf.length) {
            const tag = pbf.readTag();
            if ((tag >> 3) === 3) { // Layer field
                const end = pbf.pos + pbf.readVarint();
                const layer = this._readLayer(pbf, end);
                if (layer.name && layer.features.length > 0) {
                    layers[layer.name] = layer.features.map(f =>
                        this._toGeoJSON(f, layer.keys, layer.values, layer.extent, z, x, y)
                    ).filter(Boolean);
                }
            } else {
                pbf.skip(tag & 7);
            }
        }
        return layers;
    },

    _readLayer(pbf, end) {
        const layer = { name: '', features: [], keys: [], values: [], extent: 4096 };
        while (pbf.pos < end) {
            const tag = pbf.readTag();
            const field = tag >> 3;
            if (field === 1) layer.name = pbf.readString();
            else if (field === 2) {
                const fEnd = pbf.pos + pbf.readVarint();
                layer.features.push(this._readFeature(pbf, fEnd));
            }
            else if (field === 3) layer.keys.push(pbf.readString());
            else if (field === 4) {
                const vEnd = pbf.pos + pbf.readVarint();
                layer.values.push(this._readValue(pbf, vEnd));
            }
            else if (field === 5) layer.extent = pbf.readVarint();
            else if (field === 15) pbf.readVarint(); // version
            else pbf.skip(tag & 7);
        }
        return layer;
    },

    _readFeature(pbf, end) {
        const feature = { id: null, tags: [], type: 0, geometry: [] };
        while (pbf.pos < end) {
            const tag = pbf.readTag();
            const field = tag >> 3;
            if (field === 1) feature.id = pbf.readVarint();
            else if (field === 2) {
                const tEnd = pbf.pos + pbf.readVarint();
                while (pbf.pos < tEnd) feature.tags.push(pbf.readVarint());
            }
            else if (field === 3) feature.type = pbf.readVarint();
            else if (field === 4) {
                const gEnd = pbf.pos + pbf.readVarint();
                while (pbf.pos < gEnd) feature.geometry.push(pbf.readVarint());
            }
            else pbf.skip(tag & 7);
        }
        return feature;
    },

    _readValue(pbf, end) {
        let val = null;
        while (pbf.pos < end) {
            const tag = pbf.readTag();
            const field = tag >> 3;
            if (field === 1) val = pbf.readString();
            else if (field === 2) val = pbf.readFloat();
            else if (field === 3) val = pbf.readDouble();
            else if (field === 4) val = pbf.readVarint64();
            else if (field === 5) val = pbf.readVarint();
            else if (field === 6) val = pbf.readSVarint();
            else if (field === 7) val = pbf.readVarint() !== 0;
            else pbf.skip(tag & 7);
        }
        return val;
    },

    _toGeoJSON(feature, keys, values, extent, z, x, y) {
        // Build properties from tags
        const props = {};
        for (let i = 0; i < feature.tags.length; i += 2) {
            const k = keys[feature.tags[i]];
            const v = values[feature.tags[i + 1]];
            if (k !== undefined && v !== undefined) props[k] = v;
        }

        // Decode geometry commands
        const geom = this._decodeGeometry(feature.geometry, feature.type, extent, z, x, y);
        if (!geom) return null;

        return { type: 'Feature', properties: props, geometry: geom };
    },

    _decodeGeometry(cmds, type, extent, z, x, y) {
        const rings = [];
        let ring = [];
        let cx = 0, cy = 0;

        let i = 0;
        while (i < cmds.length) {
            const cmdInt = cmds[i++];
            const cmd = cmdInt & 7;
            const count = cmdInt >> 3;

            if (cmd === 1) { // MoveTo
                if (ring.length > 0) rings.push(ring);
                ring = [];
                for (let j = 0; j < count; j++) {
                    cx += this._zigzag(cmds[i++]);
                    cy += this._zigzag(cmds[i++]);
                    const [lng, lat] = this._tileToLngLat(cx, cy, extent, z, x, y);
                    ring.push([lng, lat]);
                }
            } else if (cmd === 2) { // LineTo
                for (let j = 0; j < count; j++) {
                    cx += this._zigzag(cmds[i++]);
                    cy += this._zigzag(cmds[i++]);
                    const [lng, lat] = this._tileToLngLat(cx, cy, extent, z, x, y);
                    ring.push([lng, lat]);
                }
            } else if (cmd === 7) { // ClosePath
                if (ring.length > 0) ring.push([...ring[0]]);
            }
        }
        if (ring.length > 0) rings.push(ring);
        if (rings.length === 0) return null;

        // type 1=POINT, 2=LINESTRING, 3=POLYGON
        if (type === 1) {
            const pts = rings.flat();
            if (pts.length === 1) return { type: 'Point', coordinates: pts[0] };
            return { type: 'MultiPoint', coordinates: pts };
        } else if (type === 2) {
            if (rings.length === 1) return { type: 'LineString', coordinates: rings[0] };
            return { type: 'MultiLineString', coordinates: rings };
        } else if (type === 3) {
            if (rings.length === 1) return { type: 'Polygon', coordinates: rings };
            return { type: 'MultiPolygon', coordinates: [rings] };
        }
        return null;
    },

    _zigzag(n) { return (n >> 1) ^ -(n & 1); },

    _tileToLngLat(px, py, extent, z, x, y) {
        const size = extent * Math.pow(2, z);
        const lng = (x * extent + px) / size * 360 - 180;
        const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y * extent + py) / size)));
        const lat = latRad * 180 / Math.PI;
        return [Math.round(lng * 1e6) / 1e6, Math.round(lat * 1e6) / 1e6];
    },

    // Minimal protobuf reader (only the wire types we need for MVT)
    Pbf: class {
        constructor(buf) { this.buf = buf; this.pos = 0; }
        readTag() { return this.readVarint(); }
        readVarint() {
            let val = 0, shift = 0;
            while (this.pos < this.buf.length) {
                const b = this.buf[this.pos++];
                if (shift < 28) {
                    val |= (b & 0x7f) << shift;
                } else {
                    // For bits beyond 32, use multiplication to avoid overflow
                    val += (b & 0x7f) * Math.pow(2, shift);
                }
                if (!(b & 0x80)) return val >>> 0;
                shift += 7;
                if (shift > 63) break; // max 10 bytes for varint64
            }
            return val >>> 0;
        }
        readVarint64() {
            // Read as Number (ok for values < 2^53)
            let val = 0, shift = 0;
            while (this.pos < this.buf.length) {
                const b = this.buf[this.pos++];
                val += (b & 0x7f) * Math.pow(2, shift);
                if (!(b & 0x80)) return val;
                shift += 7;
            }
            return val;
        }
        readSVarint() { const n = this.readVarint(); return (n >> 1) ^ -(n & 1); }
        readFloat() {
            const val = new DataView(this.buf.buffer, this.buf.byteOffset + this.pos, 4).getFloat32(0, true);
            this.pos += 4; return val;
        }
        readDouble() {
            const val = new DataView(this.buf.buffer, this.buf.byteOffset + this.pos, 8).getFloat64(0, true);
            this.pos += 8; return val;
        }
        readString() {
            const len = this.readVarint();
            const str = new TextDecoder().decode(this.buf.subarray(this.pos, this.pos + len));
            this.pos += len; return str;
        }
        skip(wireType) {
            if (wireType === 0) this.readVarint();
            else if (wireType === 1) this.pos += 8;
            else if (wireType === 2) this.pos += this.readVarint();
            else if (wireType === 5) this.pos += 4;
        }
    }
};

/**
 * Overture Maps layer configurations — similar to BTS_ENDPOINTS.
 * Each entry defines a toggleable map layer fetched from Overture PMTiles.
 */
const OVERTURE_ENDPOINTS = {
    roads: {
        id: 'overtureRoads',
        name: 'Road Centerlines',
        desc: 'Road centerlines color-coded by functional class from Overture Maps',
        theme: 'transportation',
        sourceLayer: 'segment',
        geom: 'line',
        color: '#2563eb',
        icon: '\u{1F6E3}',  // motorway
        minZoom: 12,
        filter(props) {
            // Only road segments (exclude rail, water)
            return props.subtype === 'road' || !props.subtype;
        },
        style(feature) {
            const classColors = {
                motorway: '#dc2626', trunk: '#ea580c',
                primary: '#d97706', secondary: '#ca8a04',
                tertiary: '#65a30d', residential: '#60a5fa',
                service: '#93c5fd', unclassified: '#a3a3a3',
                living_street: '#86efac', pedestrian: '#a78bfa',
                track: '#d4d4d4'
            };
            const c = feature.properties.class || 'unclassified';
            return {
                color: classColors[c] || '#94a3b8',
                weight: (c === 'motorway' || c === 'trunk') ? 4 : (c === 'primary' || c === 'secondary') ? 3 : 2,
                opacity: 0.75
            };
        },
        popup(p) {
            const classColors = {
                motorway: '#dc2626', trunk: '#ea580c', primary: '#d97706',
                secondary: '#ca8a04', tertiary: '#65a30d', residential: '#60a5fa'
            };
            const color = classColors[p.class] || '#2563eb';
            const name = p.name || p.names_primary || 'Unnamed Road';
            let h = `<div style="font-weight:700;font-size:13px;color:${color};margin-bottom:6px">\u{1F6E3} ${name}</div>`;
            if (p.class) h += `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#666;font-size:10px">Road Class</span><span style="font-weight:600">${p.class}</span></div>`;
            if (p.subclass) h += `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#666;font-size:10px">Subclass</span><span>${p.subclass}</span></div>`;
            if (p.speed_limits || p.max_speed) {
                const spd = p.max_speed || p.speed_limits;
                h += `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#666;font-size:10px">Speed Limit</span><span style="font-weight:600">${spd}</span></div>`;
            }
            if (p.surface) h += `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#666;font-size:10px">Surface</span><span>${p.surface}</span></div>`;
            if (p.lanes) h += `<div style="display:flex;justify-content:space-between;padding:3px 0"><span style="color:#666;font-size:10px">Lanes</span><span>${p.lanes}</span></div>`;
            h += `<div style="margin-top:4px;font-size:9px;color:#999">Source: Overture Maps ${overtureStacState.latestRelease || ''} (ODbL)</div>`;
            return h;
        }
    },
    infrastructure: {
        id: 'overtureInfra',
        name: 'Crosswalks & Barriers',
        desc: 'Pedestrian crossings, guard rails, barriers from Overture Maps',
        theme: 'base',
        sourceLayer: 'infrastructure',
        geom: 'point',
        color: '#dc2626',
        icon: '\u{1F6B6}',  // pedestrian
        minZoom: 13,
        filter(props) {
            const safetyClasses = ['crossing', 'pedestrian_crossing', 'traffic_signal',
                'guard_rail', 'cable_barrier', 'jersey_barrier', 'barrier', 'bollard'];
            return safetyClasses.some(c => (props.class || '').includes(c) || (props.subtype || '').includes(c));
        },
        popup(p) {
            const icons = { crossing: '\u{1F6B6}', pedestrian_crossing: '\u{1F6B6}',
                traffic_signal: '\u{1F6A6}', guard_rail: '\u{1F6E1}',
                cable_barrier: '\u{1F6E1}', barrier: '\u{1F6E1}', bollard: '\u{1F6E1}' };
            const cls = p.class || p.subtype || 'infrastructure';
            const icon = Object.entries(icons).find(([k]) => cls.includes(k))?.[1] || '\u{1F4CD}';
            let h = `<div style="font-weight:700;font-size:13px;color:#dc2626;margin-bottom:6px">${icon} ${cls.replace(/_/g, ' ')}</div>`;
            if (p.subtype) h += `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#666;font-size:10px">Type</span><span>${p.subtype}</span></div>`;
            if (p.class && p.class !== cls) h += `<div style="display:flex;justify-content:space-between;padding:3px 0"><span style="color:#666;font-size:10px">Class</span><span>${p.class}</span></div>`;
            h += `<div style="margin-top:4px;font-size:9px;color:#999">Source: Overture Maps (ODbL)</div>`;
            return h;
        }
    },
    pois: {
        id: 'overturePOIs',
        name: 'Safety-Relevant POIs',
        desc: 'Bars, gas stations, senior living, daycare, parks, hospitals near crash sites',
        theme: 'places',
        sourceLayer: 'place',
        geom: 'point',
        color: '#7c3aed',
        icon: '\u{1F4CD}',  // round pushpin
        minZoom: 12,
        filter(props) {
            const name = (props.category || props.main_category || '').toLowerCase();
            const safetyCategories = [
                'bar', 'pub', 'nightclub', 'brewery', 'winery', 'lounge',
                'gas_station', 'fuel', 'convenience_store',
                'nursing_home', 'assisted_living', 'senior', 'retirement',
                'daycare', 'childcare', 'preschool', 'kindergarten',
                'park', 'recreation', 'playground', 'sports',
                'church', 'mosque', 'synagogue', 'temple', 'worship',
                'shopping', 'mall', 'supermarket', 'department_store',
                'hotel', 'motel', 'resort', 'inn', 'lodging',
                'hospital', 'urgent_care', 'medical', 'emergency_room',
                'stadium', 'arena', 'concert', 'convention'
            ];
            return safetyCategories.some(c => name.includes(c));
        },
        popup(p) {
            const name = p.name || p.names_primary || 'Unknown Place';
            const cat = p.category || p.main_category || '';
            const catIcons = {
                bar: '\u{1F37A}', pub: '\u{1F37A}', nightclub: '\u{1F37A}', brewery: '\u{1F37A}',
                gas_station: '\u26FD', fuel: '\u26FD', convenience: '\u{1F3EA}',
                nursing: '\u{1F9D3}', senior: '\u{1F9D3}', assisted: '\u{1F9D3}', retirement: '\u{1F9D3}',
                daycare: '\u{1F476}', childcare: '\u{1F476}', preschool: '\u{1F476}',
                park: '\u{1F3DE}', recreation: '\u{1F3DE}', playground: '\u{1F3DE}',
                church: '\u26EA', mosque: '\u{1F54C}', synagogue: '\u{1F54D}', temple: '\u26E9', worship: '\u26EA',
                hospital: '\u{1F3E5}', urgent: '\u{1F3E5}', medical: '\u{1F3E5}',
                hotel: '\u{1F3E8}', motel: '\u{1F3E8}', resort: '\u{1F3E8}',
                shopping: '\u{1F6CD}', mall: '\u{1F6CD}', supermarket: '\u{1F6D2}',
                stadium: '\u{1F3DF}', arena: '\u{1F3DF}', concert: '\u{1F3B5}'
            };
            const icon = Object.entries(catIcons).find(([k]) => cat.toLowerCase().includes(k))?.[1] || '\u{1F4CD}';
            let h = `<div style="font-weight:700;font-size:13px;color:#7c3aed;margin-bottom:6px">${icon} ${name}</div>`;
            if (cat) h += `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#666;font-size:10px">Category</span><span>${cat.replace(/_/g, ' ')}</span></div>`;
            if (p.confidence) h += `<div style="display:flex;justify-content:space-between;padding:3px 0"><span style="color:#666;font-size:10px">Confidence</span><span>${(p.confidence * 100).toFixed(0)}%</span></div>`;
            h += `<div style="margin-top:4px;font-size:9px;color:#999">Source: Overture Maps (CDLA Permissive)</div>`;
            return h;
        }
    },

    speedLimits: {
        id: 'overtureSpeedLimits',
        name: 'Speed Limits',
        desc: 'Roads color-coded by posted speed limit from Overture Maps',
        theme: 'transportation',
        sourceLayer: 'segment',
        geom: 'line',
        color: '#059669',  // emerald
        icon: '\u{1F6A8}', // rotating light
        minZoom: 12,
        filter(props) {
            return (props.subtype === 'road' || !props.subtype) && props.speed_limits;
        },
        style(feature) {
            const mph = feature.properties._speedMph;
            if (!mph) return { color: '#94a3b8', weight: 2, opacity: 0.6 };
            let color;
            if (mph <= 25) color = '#22c55e';       // green
            else if (mph <= 35) color = '#84cc16';   // lime
            else if (mph <= 45) color = '#eab308';   // yellow
            else if (mph <= 55) color = '#f97316';   // orange
            else color = '#dc2626';                   // red
            return { color, weight: 4, opacity: 0.85 };
        },
        popup(p) {
            const mph = p._speedMph;
            const name = p['@name'] || p.name || 'Unnamed Road';
            const speedColor = !mph ? '#999' : mph <= 25 ? '#22c55e' : mph <= 35 ? '#84cc16' :
                mph <= 45 ? '#eab308' : mph <= 55 ? '#f97316' : '#dc2626';
            let h = `<div style="font-weight:700;font-size:15px;color:${speedColor};margin-bottom:6px">`;
            h += mph ? `${mph} mph` : 'Speed N/A';
            h += `</div><div style="font-size:12px;color:#333;margin-bottom:4px">${name}</div>`;
            if (p.class) h += `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#666;font-size:10px">Road Class</span><span>${p.class}</span></div>`;
            h += `<div style="margin-top:4px;font-size:9px;color:#999">Source: Overture Maps (ODbL)</div>`;
            return h;
        }
    },

    intersections: {
        id: 'overtureIntersections',
        name: 'Intersections',
        desc: 'Road intersection and junction points from Overture Maps',
        theme: 'transportation',
        sourceLayer: 'connector',
        geom: 'point',
        color: '#6366f1',  // indigo
        icon: '\u2795',     // plus sign
        minZoom: 13,
        filter(props) {
            return true;
        },
        popup(p) {
            let h = `<div style="font-weight:700;font-size:13px;color:#6366f1;margin-bottom:6px">\u2795 Intersection</div>`;
            if (p.id) h += `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#666;font-size:10px">Overture ID</span><span style="font-size:10px">${p.id}</span></div>`;
            h += `<div style="margin-top:4px;font-size:9px;color:#999">Source: Overture Maps (ODbL)</div>`;
            return h;
        }
    }
};

/**
 * Fetch GeoJSON features from Overture PMTiles for a given jurisdiction bbox.
 * Calculates covering tiles at the appropriate zoom, fetches each tile via
 * HTTP range requests, decodes MVT protobuf, and returns a GeoJSON FeatureCollection.
 *
 * @param {Object} endpoint - OVERTURE_ENDPOINTS entry
 * @param {Object} bounds - {north, south, east, west}
 * @returns {Object} GeoJSON FeatureCollection
 */
async function overtureFetchLayerData(endpoint, bounds) {
    // Resolve STAC release if needed
    await overtureResolveLatestRelease();

    const p = overtureGetPMTiles(endpoint.theme);
    if (!p) throw new Error('PMTiles not available for theme: ' + endpoint.theme);

    // Determine optimal zoom for the bbox size
    let fetchZoom;
    if (endpoint._forceZoom) {
        // Respect forced zoom from recursion (tile-count reduction)
        fetchZoom = endpoint._forceZoom;
    } else {
        const bboxWidth = bounds.east - bounds.west;
        const bboxHeight = bounds.north - bounds.south;
        const maxDim = Math.max(bboxWidth, bboxHeight);
        // ~zoom 12 for a county, zoom 13-14 for a city, zoom 10-11 for a large area
        fetchZoom = Math.max(8, Math.min(14, Math.round(14 - Math.log2(maxDim / 0.01))));
        // Ensure fetch zoom is at least the endpoint's minZoom for data availability
        if (endpoint.minZoom && fetchZoom < endpoint.minZoom) {
            fetchZoom = Math.min(14, endpoint.minZoom);
        }
    }

    // Calculate tile range
    const { minTileX, maxTileX, minTileY, maxTileY } = overtureBboxToTiles(bounds, fetchZoom);
    const totalTiles = (maxTileX - minTileX + 1) * (maxTileY - minTileY + 1);

    console.log(`[Overture] Fetching ${endpoint.name}: z${fetchZoom}, ${totalTiles} tiles (${minTileX}-${maxTileX} x ${minTileY}-${maxTileY})`);

    // Cap tile count to prevent excessive fetching (max 2 reductions)
    if (totalTiles > 100 && fetchZoom > 8) {
        const reducedZoom = Math.max(8, fetchZoom - 1);
        const reduced = overtureBboxToTiles(bounds, reducedZoom);
        const reducedCount = (reduced.maxTileX - reduced.minTileX + 1) * (reduced.maxTileY - reduced.minTileY + 1);
        console.log(`[Overture] Reducing from z${fetchZoom} (${totalTiles} tiles) to z${reducedZoom} (${reducedCount} tiles)`);
        return overtureFetchLayerData({ ...endpoint, _forceZoom: reducedZoom }, bounds);
    }

    const allFeatures = [];
    const seenIds = new Set(); // Dedup features that span tiles
    let tilesLoaded = 0;
    let tileErrors = 0;

    const tilePromises = [];
    for (let tx = minTileX; tx <= maxTileX; tx++) {
        for (let ty = minTileY; ty <= maxTileY; ty++) {
            tilePromises.push(
                overtureFetchTile(p, fetchZoom, tx, ty, endpoint, seenIds)
                    .then(features => {
                        allFeatures.push(...features);
                        tilesLoaded++;
                    })
                    .catch(err => {
                        tileErrors++;
                        // Tile-level errors are expected (empty tiles, missing data)
                        if (!err.message?.includes('404') && !err.message?.includes('not found')) {
                            console.warn(`[Overture] Tile error z${fetchZoom}/${tx}/${ty}:`, err.message);
                        }
                    })
            );
        }
    }

    await Promise.all(tilePromises);

    // If ALL tiles failed, the PMTiles file itself likely doesn't exist (404).
    // Invalidate the cached release so the next layer attempt re-resolves STAC.
    if (tileErrors > 0 && tilesLoaded === 0 && totalTiles > 0) {
        console.warn(`[Overture] All ${tileErrors} tiles failed for ${endpoint.name} — PMTiles file may not exist for release ${overtureStacState.releaseDate}`);
        // Reset STAC state so next attempt re-resolves (potentially finding an older release)
        overtureStacState.stacLoaded = false;
        overtureStacState.pmtilesInstances = {};
    }

    console.log(`[Overture] ${endpoint.name}: ${allFeatures.length} features from ${tilesLoaded} tiles (${tileErrors} empty/missing)`);
    return { type: 'FeatureCollection', features: allFeatures };
}

/**
 * Fetch and decode a single vector tile from PMTiles.
 */
async function overtureFetchTile(pmtilesInstance, z, x, y, endpoint, seenIds) {
    const response = await pmtilesInstance.getZxy(z, x, y);
    if (!response || !response.data) return [];

    // Decompress if gzip (PMTiles v4 usually handles this, but check just in case)
    let data = response.data;
    try {
        const header = new Uint8Array(data instanceof ArrayBuffer ? data.slice(0, 2) : data.buffer ? data.buffer.slice(data.byteOffset, data.byteOffset + 2) : []);
        if (header.length >= 2 && header[0] === 0x1f && header[1] === 0x8b) {
            const ds = new DecompressionStream('gzip');
            const blob = new Blob([data]);
            data = await new Response(blob.stream().pipeThrough(ds)).arrayBuffer();
        }
    } catch (decompErr) {
        console.warn(`[Overture] Decompression check failed for z${z}/${x}/${y}, using raw data:`, decompErr.message);
    }

    let layers;
    try {
        layers = OvertureVTDecoder.decode(data, z, x, y);
    } catch (decodeErr) {
        console.warn(`[Overture] MVT decode failed for ${endpoint.sourceLayer} z${z}/${x}/${y}:`, decodeErr.message);
        return [];
    }
    const targetLayer = layers[endpoint.sourceLayer];
    if (!targetLayer) return [];

    const features = [];
    for (const f of targetLayer) {
        if (!f || !f.geometry) continue;

        // Apply endpoint-specific filter
        if (endpoint.filter && !endpoint.filter(f.properties)) continue;

        // Parse JSON-encoded properties from Overture vector tiles
        if (f.properties.speed_limits && typeof f.properties.speed_limits === 'string') {
            try {
                const parsed = JSON.parse(f.properties.speed_limits);
                if (Array.isArray(parsed) && parsed[0]?.max_speed?.value) {
                    let val = parsed[0].max_speed.value;
                    if (parsed[0].max_speed.unit === 'km/h') val = Math.round(val * 0.621371);
                    f.properties._speedMph = val;
                }
            } catch (e) { /* skip unparseable */ }
        }
        // Flatten @name to name for easier access
        if (f.properties['@name'] && !f.properties.name) {
            f.properties.name = f.properties['@name'];
        }

        // Dedup by feature ID or coordinate hash
        const fid = f.properties.id || f.properties['@id'] ||
            `${f.geometry.type}_${JSON.stringify(f.geometry.coordinates).substring(0, 60)}`;
        if (seenIds.has(fid)) continue;
        seenIds.add(fid);

        features.push(f);
    }

    return features;
}

/**
 * Convert a geographic bounding box to tile coordinates at a given zoom level.
 */
function overtureBboxToTiles(bounds, zoom) {
    const n = Math.pow(2, zoom);
    const minTileX = Math.floor((bounds.west + 180) / 360 * n);
    const maxTileX = Math.floor((bounds.east + 180) / 360 * n);
    const minTileY = Math.floor((1 - Math.log(Math.tan(bounds.north * Math.PI / 180) + 1 / Math.cos(bounds.north * Math.PI / 180)) / Math.PI) / 2 * n);
    const maxTileY = Math.floor((1 - Math.log(Math.tan(bounds.south * Math.PI / 180) + 1 / Math.cos(bounds.south * Math.PI / 180)) / Math.PI) / 2 * n);
    return {
        minTileX: Math.max(0, Math.min(minTileX, maxTileX)),
        maxTileX: Math.min(n - 1, Math.max(minTileX, maxTileX)),
        minTileY: Math.max(0, Math.min(minTileY, maxTileY)),
        maxTileY: Math.min(n - 1, Math.max(minTileY, maxTileY))
    };
}

/**
 * Toggle an Overture layer on/off — mirrors toggleBTSLayer.
 */
function toggleOvertureLayer(layerKey, show) {
    const endpoint = OVERTURE_ENDPOINTS[layerKey];
    if (!endpoint) return;

    const stateKey = endpoint.id;
    const state = builtInLayersState[stateKey];
    if (!state) return;

    console.log(`[Overture] Toggle ${endpoint.name}: ${show}`);

    if (show) {
        state.enabled = true;
        const bounds = btsGetJurisdictionBounds(); // Reuse BTS bounds resolver
        if (bounds && crashMap) {
            addOvertureLayer(layerKey);
        } else {
            state.status = 'ready';
        }
    } else {
        state.enabled = false;
        removeOvertureLayer(layerKey);
    }

    saveOvertureLayerVisibility();
    updateMapAssetPanel();
}

/**
 * Add an Overture layer to the map — fetch data and render.
 * Mirrors addBTSLayer with the same caching, clipping, and display logic.
 */
async function addOvertureLayer(layerKey) {
    const endpoint = OVERTURE_ENDPOINTS[layerKey];
    const stateKey = endpoint.id;
    const state = builtInLayersState[stateKey];

    if (!crashMap) return;

    // Zoom-level gating
    const currentZoom = crashMap.getZoom();
    if (currentZoom < endpoint.minZoom) {
        state.status = 'ready';
        updateMapAssetPanel();
        return;
    }

    const jurisdictionId = localStorage.getItem('selectedJurisdiction');
    const bounds = btsGetJurisdictionBounds();
    if (!bounds) {
        state.status = 'ready';
        updateMapAssetPanel();
        return;
    }

    // Check cache
    if (state.geojsonCache[jurisdictionId]) {
        console.log(`[Overture] Using cached ${endpoint.name} for ${jurisdictionId}`);
        displayOvertureLayer(layerKey, state.geojsonCache[jurisdictionId]);
        return;
    }

    // Remove existing layer if jurisdiction changed
    if (state.currentJurisdictionId !== jurisdictionId) {
        removeOvertureLayer(layerKey);
    }

    state.status = 'loading';
    state.lastError = null;
    updateMapAssetPanel();

    try {
        const rawGeojson = await overtureFetchLayerData(endpoint, bounds);
        const rawCount = rawGeojson.features.length;
        console.log(`[Overture] ${endpoint.name}: ${rawCount} features fetched (pre-clip)`);

        // Clip to jurisdiction boundary (same as BTS)
        await ensureJurisdictionBoundaryLoaded(jurisdictionId);
        const geojson = clipBTSFeaturesToBoundary(rawGeojson, endpoint.geom, jurisdictionId);

        state.geojsonCache[jurisdictionId] = geojson;
        state.featureCount = geojson.features.length;
        console.log(`[Overture] ${endpoint.name}: ${geojson.features.length} features after boundary clip`);
        displayOvertureLayer(layerKey, geojson);
    } catch (err) {
        const errDetail = err.name === 'AbortError' ? 'Timeout'
            : err.message?.includes('PMTiles library') ? 'PMTiles library not loaded'
            : err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError') ? 'Network/CORS error — S3 may be blocked'
            : err.message || 'Unknown error';
        console.error(`[Overture] ${endpoint.name} error:`, err.name, err.message, err.stack?.split('\n')[1]);
        state.status = 'error';
        state.lastError = errDetail;
        updateMapAssetPanel();
    }
}

/**
 * Display a fetched Overture GeoJSON on the map — mirrors displayBTSLayer.
 */
function displayOvertureLayer(layerKey, geojson) {
    const endpoint = OVERTURE_ENDPOINTS[layerKey];
    const stateKey = endpoint.id;
    const state = builtInLayersState[stateKey];
    const jurisdictionId = localStorage.getItem('selectedJurisdiction');

    // Remove old layer
    if (state.layer) {
        crashMap.removeLayer(state.layer);
        state.layer = null;
    }

    if (!geojson || !geojson.features || geojson.features.length === 0) {
        state.status = 'active';
        state.featureCount = 0;
        state.currentJurisdictionId = jurisdictionId;
        updateMapAssetPanel();
        return;
    }

    const layer = L.geoJSON(geojson, {
        pointToLayer: (f, ll) => L.circleMarker(ll, {
            radius: 6,
            fillColor: endpoint.color,
            fillOpacity: 0.85,
            color: '#fff',
            weight: 1.5,
            opacity: 0.9
        }),
        style: endpoint.style || ((f) => {
            if (endpoint.geom === 'line') return { color: endpoint.color, weight: 3, opacity: 0.75 };
            return {};
        }),
        onEachFeature: (feature, lyr) => {
            try {
                lyr.bindPopup(endpoint.popup(feature.properties || {}), { maxWidth: 340 });
            } catch (e) { /* skip bad popups */ }
        }
    });

    layer.addTo(crashMap);
    state.layer = layer;
    state.status = 'active';
    state.featureCount = geojson.features.length;
    state.currentJurisdictionId = jurisdictionId;
    updateMapAssetPanel();
}

/**
 * Remove an Overture layer from the map.
 */
function removeOvertureLayer(layerKey) {
    const endpoint = OVERTURE_ENDPOINTS[layerKey];
    const stateKey = endpoint.id;
    const state = builtInLayersState[stateKey];

    if (state.layer && crashMap) {
        crashMap.removeLayer(state.layer);
    }
    state.layer = null;
    state.status = state.enabled ? 'ready' : 'ready';
}

/**
 * Clear Overture layer caches (called on jurisdiction change).
 */
function clearOvertureLayerCaches() {
    Object.keys(OVERTURE_ENDPOINTS).forEach(key => {
        const stateKey = OVERTURE_ENDPOINTS[key].id;
        const state = builtInLayersState[stateKey];
        if (state) {
            state.geojsonCache = {};
            if (state.enabled) {
                removeOvertureLayer(key);
                addOvertureLayer(key);
            }
        }
    });
}

/**
 * Save Overture layer visibility to localStorage.
 */
function saveOvertureLayerVisibility() {
    try {
        const visibility = {};
        Object.keys(OVERTURE_ENDPOINTS).forEach(key => {
            const stateKey = OVERTURE_ENDPOINTS[key].id;
            visibility[key] = builtInLayersState[stateKey]?.enabled || false;
        });
        localStorage.setItem('overtureLayerVisibility', JSON.stringify(visibility));
    } catch (e) {
        console.warn('[Overture] Could not save visibility:', e);
    }
}

/**
 * Restore Overture layer visibility from localStorage.
 */
function restoreOvertureLayers() {
    try {
        const saved = localStorage.getItem('overtureLayerVisibility');
        if (!saved) return;
        const visibility = JSON.parse(saved);
        const enabledKeys = [];

        Object.keys(visibility).forEach(key => {
            if (visibility[key] && OVERTURE_ENDPOINTS[key]) {
                const stateKey = OVERTURE_ENDPOINTS[key].id;
                builtInLayersState[stateKey].enabled = true;
                enabledKeys.push(key);
                if (crashMap) addOvertureLayer(key);
            }
        });

        // Delayed retry for layers that failed on initial load
        if (enabledKeys.length > 0) {
            setTimeout(() => {
                enabledKeys.forEach(key => {
                    const ep = OVERTURE_ENDPOINTS[key];
                    const state = builtInLayersState[ep.id];
                    if (state?.enabled && (state.status === 'error' || state.status === 'ready')) {
                        console.log(`[Overture] Retry ${ep.name} after delayed init (was: ${state.status})`);
                        state.lastError = null;
                        if (crashMap) addOvertureLayer(key);
                    }
                });
                updateMapAssetPanel();
            }, 4000);
        }
    } catch (e) {
        console.warn('[Overture] Could not restore layers:', e);
    }
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.map = CL.map || {};
  CL.map.overture = CL.map.overture || {};
  window.OVERTURE_ENDPOINTS = OVERTURE_ENDPOINTS;
  window.overtureResolveLatestRelease = overtureResolveLatestRelease; CL.map.overture.overtureResolveLatestRelease = overtureResolveLatestRelease;
  window.overtureGetPMTiles = overtureGetPMTiles; CL.map.overture.overtureGetPMTiles = overtureGetPMTiles;
  window.overtureFetchLayerData = overtureFetchLayerData; CL.map.overture.overtureFetchLayerData = overtureFetchLayerData;
  window.overtureFetchTile = overtureFetchTile; CL.map.overture.overtureFetchTile = overtureFetchTile;
  window.overtureBboxToTiles = overtureBboxToTiles; CL.map.overture.overtureBboxToTiles = overtureBboxToTiles;
  window.toggleOvertureLayer = toggleOvertureLayer; CL.map.overture.toggleOvertureLayer = toggleOvertureLayer;
  window.addOvertureLayer = addOvertureLayer; CL.map.overture.addOvertureLayer = addOvertureLayer;
  window.displayOvertureLayer = displayOvertureLayer; CL.map.overture.displayOvertureLayer = displayOvertureLayer;
  window.removeOvertureLayer = removeOvertureLayer; CL.map.overture.removeOvertureLayer = removeOvertureLayer;
  window.clearOvertureLayerCaches = clearOvertureLayerCaches; CL.map.overture.clearOvertureLayerCaches = clearOvertureLayerCaches;
  window.saveOvertureLayerVisibility = saveOvertureLayerVisibility; CL.map.overture.saveOvertureLayerVisibility = saveOvertureLayerVisibility;
  window.restoreOvertureLayers = restoreOvertureLayers; CL.map.overture.restoreOvertureLayers = restoreOvertureLayers;
  CL._registerModule('map/overture-layers');
})();
