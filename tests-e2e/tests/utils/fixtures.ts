import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';

export interface StateExpected {
    total_crashes_state: number;
    total_crashes_default_county: number;
    fatal_K_state_min: number;
    fatal_K_default_county_min: number;
    ka_state_min: number;
    ka_default_county_min: number;
    required_populated_tabs: string[];
    required_categories_non_zero: string[];
}

export interface StateFixture {
    state_key: string;
    state_name: string;
    state_fips: string;
    default_jurisdiction: string;
    counties: string[];
    expected: StateExpected;
    known_null_categories: string[];
    notes?: string[];
}

const FIXTURES_PATH = path.resolve(__dirname, '..', '..', 'fixtures', 'states.yaml');

let _cache: Record<string, StateFixture> | null = null;

export function loadAllStates(): Record<string, StateFixture> {
    if (_cache) return _cache;
    const raw = fs.readFileSync(FIXTURES_PATH, 'utf8');
    _cache = yaml.load(raw) as Record<string, StateFixture>;
    return _cache;
}

export function loadState(key: string): StateFixture {
    const all = loadAllStates();
    const f = all[key];
    if (!f) {
        throw new Error(`No fixture for state '${key}'. Available: ${Object.keys(all).join(', ')}`);
    }
    return f;
}

export function activeStateKey(): string {
    return process.env.STATE_KEY ?? 'delaware';
}
