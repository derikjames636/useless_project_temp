"""
Pen detection via geometric shape & edge analysis (colour-agnostic).

Pipeline:
  Frame → BGR→Grayscale → Gaussian Blur → Canny Edge Detection → Edge Dilation
        → Contours → Minimum Area Rectangle (Rotation-invariant)
        → Aspect Ratio Filtering (Rods / Pens) → Bounding Box & Confidence

This algorithm detects pens of any colour (black, blue, white, red, green, etc.)
by identifying elongated cylindrical / rod geometries with an aspect ratio >= 3.0.
"""

from __future__ import annotations

from typing import Optional, Tuple

import cv2
import numpy as np

from app.config import (
    PEN_HSV_LOWER,
    PEN_HSV_UPPER,
    PEN_MAX_ASPECT_RATIO,
    PEN_MIN_ASPECT_RATIO,
    PEN_MIN_CONTOUR_AREA,
)

# Type alias: bounding box (x, y, w, h) or None
BoundingBox = Optional[Tuple[int, int, int, int]]


def detect_pen(frame: np.ndarray) -> Tuple[BoundingBox, float]:
    """
    Detect a pen of any colour in a single BGR video frame using geometric shape detection.

    Returns
    -------
    (bounding_box, confidence)
        bounding_box : (x, y, w, h) or None if no pen detected.
        confidence   : 0.0–1.0 detection confidence based on aspect ratio and contour clarity.
    """
    if frame is None or frame.size == 0:
        return None, 0.0

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Edge detection to capture the pen boundary regardless of surface colour
    edges = cv2.Canny(blurred, 50, 150)

    # Dilate slightly to join edges broken by motion blur or specular reflection
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    edges = cv2.dilate(edges, kernel, iterations=1)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None, 0.0

    best_bbox = None
    best_score = 0.0
    best_aspect_ratio = 1.0

    for c in contours:
        area = cv2.contourArea(c)
        if area < PEN_MIN_CONTOUR_AREA:
            continue

        # Rotation-invariant minimum area bounding rectangle
        rect = cv2.minAreaRect(c)
        (_, _), (rw, rh), _ = rect

        min_dim = min(rw, rh)
        max_dim = max(rw, rh)
        if min_dim <= 0:
            continue

        aspect_ratio = max_dim / min_dim

        # Pens are elongated rods with aspect ratio typically between 3.0 and 25.0
        if PEN_MIN_ASPECT_RATIO <= aspect_ratio <= PEN_MAX_ASPECT_RATIO:
            score = area * aspect_ratio
            if score > best_score:
                best_score = score
                best_bbox = cv2.boundingRect(c)
                best_aspect_ratio = aspect_ratio

    if best_bbox is not None:
        # Confidence score derived from how distinctly elongated the contour is
        # Clamped between 0.50 and 0.99
        confidence = min(0.99, max(0.50, 0.50 + (best_aspect_ratio - PEN_MIN_ASPECT_RATIO) * 0.05))
        return best_bbox, round(confidence, 3)

    return None, 0.0


def bounding_box_center(bbox: Tuple[int, int, int, int]) -> Tuple[float, float]:
    """
    Return the geometric centre of a bounding box.

    (docs/BACKEND.md §11): x_p = x + w/2,  y_p = y + h/2
    """
    x, y, w, h = bbox
    return x + w / 2, y + h / 2
