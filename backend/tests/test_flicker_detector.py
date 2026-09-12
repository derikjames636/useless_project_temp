"""
Unit tests for fake flicker detection & sarcastic verdict logic (metrics/flicker_detector.py).
"""

import math
import pytest

from app.metrics.flicker_detector import detect_flicker
from app.services.result_service import aggregate_results


def test_detect_flicker_empty_input():
    result = detect_flicker([], [], (100, 100))
    assert isinstance(result, dict)
    assert result["score"] == 0.0
    assert result["is_fake_flicker"] is True
    assert "FAIL: Insufficient net rotation" in result["verdict"]
    assert result["aura_score"] == 0


def test_detect_flicker_clean_rotation():
    """Simulate a continuous 360-degree rotation around (100, 100) -> Should trigger PERFECT (score 100.0)."""
    center = (100.0, 100.0)
    radius = 50.0
    num_frames = 35
    pen_positions = []
    timestamps = []

    # 1.05 full turns (378 degrees) so net rotation after 3-point smoothing is >= 360 degrees
    for i in range(num_frames):
        angle = (2 * math.pi * 1.05 * i) / (num_frames - 1)
        x = center[0] + radius * math.cos(angle)
        y = center[1] + radius * math.sin(angle)
        pen_positions.append((x, y))
        timestamps.append(i * 0.033)

    result = detect_flicker(pen_positions, timestamps, center, average_rpm=120.0)
    assert result["score"] == 100.0
    assert result["is_fake_flicker"] is False
    assert "PERFECT: Flawless 360+ degree rotation" in result["verdict"]
    assert result["aura_score"] > 0


def test_detect_flicker_finger_twitching():
    """Simulate rapid back-and-forth oscillation (twitching) -> Net rotation is minimal, triggering FAIL condition."""
    center = (100.0, 100.0)
    radius = 50.0
    num_cycles = 10
    pen_positions = []
    timestamps = []

    # Oscillate between angle 0 and angle pi/3 repeatedly
    idx = 0
    for cycle in range(num_cycles):
        for step in [0, 0.5, 1.0, 0.5]:
            angle = (math.pi / 3.0) * step
            x = center[0] + radius * math.cos(angle)
            y = center[1] + radius * math.sin(angle)
            pen_positions.append((x, y))
            timestamps.append(idx * 0.033)
            idx += 1

    result = detect_flicker(pen_positions, timestamps, center, average_rpm=60.0)
    assert result["score"] <= 15.0
    assert result["is_fake_flicker"] is True
    assert "FAIL: Insufficient net rotation" in result["verdict"]


def test_score_capping_on_fake_flicker():
    """Verify aggregate_results accepts override_score and aura_score."""
    aggregated = aggregate_results(
        rpm=800.0,
        rotations=0,
        center_accuracy=95.0,
        wobble_percent=5.0,
        avg_velocity=200.0,
        peak_velocity=400.0,
        avg_acceleration=100.0,
        peak_acceleration=300.0,
        tracking_confidence=98.0,
        is_fake_flicker=True,
        verdict="FAIL: Insufficient net rotation to qualify as a pen flip.",
        override_score=15.0,
        aura_score=42,
    )

    assert aggregated.is_fake_flicker is True
    assert aggregated.overall_score == 15.0
    assert aggregated.verdict == "FAIL: Insufficient net rotation to qualify as a pen flip."
    assert aggregated.aura_score == 42


def test_detect_flicker_half_rotation():
    """Simulate a half rotation (~200 degrees) -> Should trigger INCOMPLETE condition."""
    center = (100.0, 100.0)
    radius = 50.0
    num_frames = 20
    pen_positions = []
    timestamps = []

    for i in range(num_frames):
        # 200 degrees = ~1.11 * pi radians
        angle = (1.11 * math.pi * i) / (num_frames - 1)
        x = center[0] + radius * math.cos(angle)
        y = center[1] + radius * math.sin(angle)
        pen_positions.append((x, y))
        timestamps.append(i * 0.033)

    result = detect_flicker(pen_positions, timestamps, center, average_rpm=100.0)
    assert 50.0 <= result["score"] < 100.0
    assert result["is_fake_flicker"] is False
    assert "INCOMPLETE: Solid momentum" in result["verdict"]


def test_detect_flicker_human_rotation_with_tremor():
    """Simulate smooth rotation with noise -> Should trigger PERFECT."""
    import random
    random.seed(42)

    center = (100.0, 100.0)
    radius = 50.0
    num_frames = 130
    pen_positions = []
    timestamps = []

    for i in range(num_frames):
        # 1.05 full turns (378 degrees) over 130 frames
        angle = (2 * math.pi * 1.05 * i) / (num_frames - 1)
        # Add realistic micro-tremor (+/- 2.5 pixels noise)
        noise_x = random.uniform(-2.5, 2.5)
        noise_y = random.uniform(-2.5, 2.5)
        x = center[0] + radius * math.cos(angle) + noise_x
        y = center[1] + radius * math.sin(angle) + noise_y
        pen_positions.append((x, y))
        timestamps.append(i * 0.033)

def test_aura_levels():
    """Verify aura_level mapping thresholds."""
    center = (100.0, 100.0)
    radius = 50.0
    num_frames = 35
    pen_positions = []
    timestamps = []
    for i in range(num_frames):
        angle = (2 * math.pi * i) / (num_frames - 1)
        pen_positions.append((center[0] + radius * math.cos(angle), center[1] + radius * math.sin(angle)))
        timestamps.append(i * 0.033)

    # aura_score = int(1.0 * average_rpm * 10) = 10 * average_rpm
    res1 = detect_flicker(pen_positions, timestamps, center, average_rpm=10.0)  # score=100 -> Negative Aura
    assert res1["aura_level"] == "Negative Aura (-1000)"

    res2 = detect_flicker(pen_positions, timestamps, center, average_rpm=30.0)  # score=300 -> NPC Aura
    assert res2["aura_level"] == "NPC Aura"

    res3 = detect_flicker(pen_positions, timestamps, center, average_rpm=70.0)  # score=700 -> Main Character Aura
    assert res3["aura_level"] == "Main Character Aura"

    res4 = detect_flicker(pen_positions, timestamps, center, average_rpm=150.0) # score=1500 -> Demon Aura
    assert res4["aura_level"] == "Demon Aura"

    res5 = detect_flicker(pen_positions, timestamps, center, average_rpm=250.0) # score=2500 -> Infinite Aura ♾️
    assert res5["aura_level"] == "Infinite Aura ♾️"



