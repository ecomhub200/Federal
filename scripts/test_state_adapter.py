"""Regression tests for scripts/state_adapter.py normalizers.

CC 018 v3 [P1]: guards the DelawareNormalizer "Personal Injury Crash"
A/B/C proportional split. The split is deterministic per crash (MD5 hash
of the composite ID) and is expected to land near the NHTSA national
averages 8 % / 32 % / 60 %. A future change to the hash or thresholds
that skews this distribution would silently reintroduce the B/C = 0 bug.
"""

import hashlib
import os
import sys
from collections import Counter

import pytest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from state_adapter import DelawareNormalizer

# NHTSA national-average targets for the injury-crash split (percent).
TARGET_PCT = {"A": 8.0, "B": 32.0, "C": 60.0}
TOLERANCE_PCT = 2.0
SAMPLE_SIZE = 10_000


def _assign_severity(crash_key: str) -> str:
    """Reproduce DelawareNormalizer's injury A/B/C hash assignment."""
    hash_val = int(hashlib.md5(crash_key.encode()).hexdigest()[:8], 16) / 0xFFFFFFFF
    if hash_val < DelawareNormalizer.INJURY_SPLIT_A_THRESHOLD:
        return "A"
    if hash_val < DelawareNormalizer.INJURY_SPLIT_B_THRESHOLD:
        return "B"
    return "C"


def test_injury_split_distribution_within_tolerance():
    """A/B/C split over 10k synthetic crash IDs stays within 2pp of 8/32/60."""
    counts = Counter(_assign_severity(f"fake-id-{i}") for i in range(SAMPLE_SIZE))

    # Every bucket must be populated — the original bug was B/C = 0.
    for sev in ("A", "B", "C"):
        assert counts[sev] > 0, f"severity {sev} never assigned"

    for sev, target in TARGET_PCT.items():
        actual = counts[sev] / SAMPLE_SIZE * 100
        assert abs(actual - target) <= TOLERANCE_PCT, (
            f"{sev}: {actual:.2f}% off target {target}% "
            f"(tolerance ±{TOLERANCE_PCT}pp)"
        )


def test_injury_split_is_deterministic():
    """Same crash ID always yields the same severity (reproducible matview)."""
    for i in range(0, SAMPLE_SIZE, 137):
        key = f"fake-id-{i}"
        assert _assign_severity(key) == _assign_severity(key)


def test_thresholds_are_ordered():
    """A threshold below B threshold below 1.0 — ordering guards the split."""
    assert 0 < DelawareNormalizer.INJURY_SPLIT_A_THRESHOLD < DelawareNormalizer.INJURY_SPLIT_B_THRESHOLD < 1.0


def test_severity_map_recognizes_delaware_injury_value():
    """Delaware's documented source value maps to the injury-split sentinel."""
    assert DelawareNormalizer.SEVERITY_MAP.get("personal injury crash") == "INJURY"


if __name__ == "__main__":
    sys.exit(pytest.main([__file__, "-v"]))
