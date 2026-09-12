"""
Hand/finger detection and rotation-centre extraction via MediaPipe Hands.

Pipeline (docs/BACKEND.md §12):
  Frame → MediaPipe Hands → hand landmarks → specific landmark → C = (x_c, y_c)

Decision: Landmark index 9 (Middle Finger MCP) is used as the rotation centre.
This is a stable, hardware-independent landmark at the base of the middle finger.
Fallback: palm centroid computed from landmarks 0, 5, 9, 13, 17.

Note: MediaPipe availability is checked at import time.  On systems where
Windows Application Control blocks matplotlib's DLL (which mediapipe pulls in),
the detector will silently return None for every frame.  The tracker treats a
missing rotation centre as a fallback to the pen-path centroid.
"""

from __future__ import annotations

from typing import Any, Optional, Tuple

import cv2
import numpy as np

from app.config import ROTATION_CENTER_LANDMARK

# --------------------------------------------------------------------------
# Attempt to import mediapipe.  On some Windows machines, a system-level
# Application Control policy blocks matplotlib's compiled DLL which mediapipe
# 1.0.x imports transitively.  We degrade gracefully rather than crashing.
# --------------------------------------------------------------------------
try:
    import mediapipe as mp  # type: ignore[import-untyped]
    _mp_hands_module = mp.solutions.hands
    _MEDIAPIPE_AVAILABLE = True
except Exception:
    _mp_hands_module = None
    _MEDIAPIPE_AVAILABLE = False


# Singleton instance — initialised lazily
_hands_detector: Optional[Any] = None


def _get_detector() -> Optional[Any]:
    """Return singleton Hands detector, or None if mediapipe is unavailable."""
    global _hands_detector
    if not _MEDIAPIPE_AVAILABLE:
        return None
    if _hands_detector is None:
        _hands_detector = _mp_hands_module.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )
    return _hands_detector


def detect_hand_features(
    frame: np.ndarray, padding_finger: int = 30, padding_hand: int = 100
) -> Tuple[
    Optional[Tuple[float, float]],
    Optional[Tuple[int, int, int, int]],
    Optional[Tuple[int, int, int, int]],
]:
    """
    Run MediaPipe detector ONCE per frame and return:
    (rotation_center, hand_bbox, finger_roi)
    """
    detector = _get_detector()
    if detector is None:
        return None, None, None

    h, w = frame.shape[:2]
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = detector.process(rgb)

    if not results.multi_hand_landmarks:
        return None, None, None

    landmarks = results.multi_hand_landmarks[0].landmark

    # 1. Rotation center
    rotation_center = None
    if ROTATION_CENTER_LANDMARK < len(landmarks):
        lm = landmarks[ROTATION_CENTER_LANDMARK]
        rotation_center = (lm.x * w, lm.y * h)
    else:
        palm_indices = [0, 5, 9, 13, 17]
        xs = [landmarks[i].x * w for i in palm_indices if i < len(landmarks)]
        ys = [landmarks[i].y * h for i in palm_indices if i < len(landmarks)]
        if xs:
            rotation_center = (float(np.mean(xs)), float(np.mean(ys)))

    # 2. Hand BBox
    xs_all = [lm.x * w for lm in landmarks]
    ys_all = [lm.y * h for lm in landmarks]
    x_min_h = max(0, int(min(xs_all) - padding_hand))
    y_min_h = max(0, int(min(ys_all) - padding_hand))
    x_max_h = min(w, int(max(xs_all) + padding_hand))
    y_max_h = min(h, int(max(ys_all) + padding_hand))
    hand_bbox = (x_min_h, y_min_h, max(1, x_max_h - x_min_h), max(1, y_max_h - y_min_h))

    # 3. Finger ROI (LM 0, 4, 8)
    target_indices = [0, 4, 8]
    xs_f = [landmarks[i].x * w for i in target_indices if i < len(landmarks)]
    ys_f = [landmarks[i].y * h for i in target_indices if i < len(landmarks)]
    finger_roi = None
    if xs_f:
        x_min_f = max(0, int(min(xs_f) - padding_finger))
        y_min_f = max(0, int(min(ys_f) - padding_finger))
        x_max_f = min(w, int(max(xs_f) + padding_finger))
        y_max_f = min(h, int(max(ys_f) + padding_finger))
        finger_roi = (x_min_f, y_min_f, max(1, x_max_f - x_min_f), max(1, y_max_f - y_min_f))

    return rotation_center, hand_bbox, finger_roi


def detect_rotation_center(frame: np.ndarray) -> Optional[Tuple[float, float]]:
    rc, _, _ = detect_hand_features(frame)
    return rc


def detect_hand_bbox(
    frame: np.ndarray, padding: int = 100
) -> Optional[Tuple[int, int, int, int]]:
    _, hb, _ = detect_hand_features(frame, padding_hand=padding)
    return hb


def detect_finger_roi(
    frame: np.ndarray, padding: int = 30
) -> Optional[Tuple[int, int, int, int]]:
    _, _, fr = detect_hand_features(frame, padding_finger=padding)
    return fr



def close_detector() -> None:
    """Release MediaPipe resources. Call on application shutdown."""
    global _hands_detector
    if _hands_detector is not None:
        _hands_detector.close()
        _hands_detector = None
