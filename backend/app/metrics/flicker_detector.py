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
) -> Tuple[float, bool, str]:
    """
    Realistic Physics Engine: Evaluate net_rotation vs absolute_rotation.
    Rewards smooth continuous momentum and penalizes high finger jitter.

    Parameters
    ----------
    pen_positions  : list of (x, y) coordinates of the pen center per frame.
    timestamps     : list of timestamps in seconds.
    rotation_center: (x_c, y_c) center of rotation (e.g. thumb landmark).

    Returns
    -------
    (score: float, is_fake_flicker: bool, verdict: str)
    """
    if len(pen_positions) < 3 or len(timestamps) < 3:
        return 0.0, False, "INCOMPLETE: Insufficient rotation."

    smoothed_positions = _smooth_positions(pen_positions, window_size=3)

    x_c, y_c = rotation_center

    angles: List[float] = [
        math.degrees(math.atan2(y - y_c, x - x_c))
        for x, y in smoothed_positions
    ]

    net_rotation = 0.0
    absolute_rotation = 0.0

    for i in range(1, len(angles)):
        raw_delta = angles[i] - angles[i - 1]
        delta_angle = (raw_delta + 180) % 360 - 180
        net_rotation += delta_angle
        absolute_rotation += abs(delta_angle)

    if abs(net_rotation) >= 270:
        score = min(100.0, (abs(net_rotation) / 360.0) * 100.0)
        verdict = "EXCELLENT: Stable and covers full rotations."
        is_fake_flicker = False
    elif abs(net_rotation) >= 120 and abs(net_rotation) < 270:
        score = (abs(net_rotation) / 360.0) * 100.0
        verdict = "INCOMPLETE: Stable but only half rotations."
        is_fake_flicker = False
    elif absolute_rotation > (abs(net_rotation) * 2.5):
        score = 15.0
        verdict = "POOR: Pen is moving back and forth without progressing."
        is_fake_flicker = True
    else:
        score = 10.0
        verdict = "FAIL: Insufficient momentum."
        is_fake_flicker = True

    return round(score, 1), is_fake_flicker, verdict


