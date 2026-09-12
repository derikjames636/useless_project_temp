"""
Detection logic for distinguishing continuous physical 360-degree rotations
from rapid back-and-forth finger twitching (fake flicker).
"""

from __future__ import annotations

import math
from typing import List, Tuple

from app.metrics.rpm import _wrap_angle


def _smooth_positions(
    positions: List[Tuple[float, float]], window_size: int = 3
) -> List[Tuple[float, float]]:
    """Smooth (x, y) coordinates using a simple moving average to filter out high-frequency tracking noise."""
    if len(positions) < window_size:
        return positions
    smoothed = []
    half_w = window_size // 2
    n = len(positions)
    for i in range(n):
        start = max(0, i - half_w)
        end = min(n, i + half_w + 1)
        pts = positions[start:end]
        avg_x = sum(p[0] for p in pts) / len(pts)
        avg_y = sum(p[1] for p in pts) / len(pts)
        smoothed.append((avg_x, avg_y))
    return smoothed


def detect_flicker(
    pen_positions: List[Tuple[float, float]],
    timestamps: List[float],
    rotation_center: Tuple[float, float],
    average_rpm: float = 0.0,
) -> dict:
    """
    Evaluate pen flip attempts based purely on rotational completeness and speed.

    Parameters
    ----------
    pen_positions  : list of (x, y) coordinates of the pen center per frame.
    timestamps     : list of timestamps in seconds.
    rotation_center: (x_c, y_c) center of rotation (e.g. thumb landmark).
    average_rpm    : calculated average RPM for aura score calculation.

    Returns
    -------
    dict with keys: score, verdict, is_fake_flicker, aura_score
    """
    if len(pen_positions) < 3 or len(timestamps) < 3:
        return {
            "score": 0.0,
            "verdict": "FAIL: Insufficient net rotation to qualify as a pen flip.",
            "is_fake_flicker": True,
            "aura_score": 0,
            "aura_level": "Negative Aura (-1000)",
        }

    smoothed_positions = _smooth_positions(pen_positions, window_size=3)

    x_c, y_c = rotation_center

    angles: List[float] = [
        math.degrees(math.atan2(y - y_c, x - x_c))
        for x, y in smoothed_positions
    ]

    net_rotation = 0.0

    for i in range(1, len(angles)):
        raw_delta = angles[i] - angles[i - 1]
        delta_angle = (raw_delta + 180) % 360 - 180
        net_rotation += delta_angle

    aura_score = int((abs(net_rotation) / 360.0) * average_rpm * 10)

    if aura_score < 200:
        aura_level = "Negative Aura (-1000)"
    elif aura_score < 500:
        aura_level = "NPC Aura"
    elif aura_score < 1000:
        aura_level = "Main Character Aura"
    elif aura_score < 2000:
        aura_level = "Demon Aura"
    else:
        aura_level = "Infinite Aura ♾️"

    if abs(net_rotation) >= 360:
        score = 100.0
        verdict = "PERFECT: Flawless 360+ degree rotation at high velocity."
        is_fake_flicker = False
    elif abs(net_rotation) >= 180:
        score = (abs(net_rotation) / 360.0) * 100.0
        verdict = "INCOMPLETE: Solid momentum, but fell short of a full rotation."
        is_fake_flicker = False
    else:
        score = max(5.0, (abs(net_rotation) / 360.0) * 100.0)
        verdict = "FAIL: Insufficient net rotation to qualify as a pen flip."
        is_fake_flicker = True

    return {
        "score": round(score, 1),
        "verdict": verdict,
        "is_fake_flicker": is_fake_flicker,
        "aura_score": aura_score,
        "aura_level": aura_level,
    }


