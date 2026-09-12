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


def detect_pen(
    frame: np.ndarray,
    hand_bbox: Optional[Tuple[int, int, int, int]] = None,
    hsv_bounds: Optional[Tuple[np.ndarray, np.ndarray]] = None,
) -> Tuple[BoundingBox, float]:
    """
    Detect a pen in a BGR video frame using geometric shape & edge analysis,
    optionally filtered by calibrated HSV color bounds.

    Parameters
    ----------
    frame      : input BGR image frame.
    hand_bbox  : optional (hx, hy, hw, hh) padded hand ROI bounding box.
    hsv_bounds : optional (lower_color, upper_color) numpy array bounds.

    Returns
    -------
    (bounding_box, confidence)
    """
    if frame is None or frame.size == 0:
        return None, 0.0

    working_frame = frame
    if hand_bbox is not None:
        hx, hy, hw, hh = hand_bbox
        mask = np.zeros(frame.shape[:2], dtype=np.uint8)
        mask[hy : hy + hh, hx : hx + hw] = 255
        working_frame = cv2.bitwise_and(frame, frame, mask=mask)

    if hsv_bounds is not None:
        lower_color, upper_color = hsv_bounds
        hsv = cv2.cvtColor(working_frame, cv2.COLOR_BGR2HSV)
        color_mask = cv2.inRange(hsv, lower_color, upper_color)
        working_frame = cv2.bitwise_and(working_frame, working_frame, mask=color_mask)

    gray = cv2.cvtColor(working_frame, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Edge detection to capture the pen boundary regardless of surface colour
    edges = cv2.Canny(blurred, 50, 150)

    # Dilate slightly to join edges broken by motion blur or specular reflection
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    edges = cv2.dilate(edges, kernel, iterations=1)

    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        return None, 0.0

    best_bbox = None
    best_score = 0.0
    best_aspect_ratio = 1.0

    for c in contours:
        area = cv2.contourArea(c)
        if area < PEN_MIN_CONTOUR_AREA:
            continue

        c_bbox = cv2.boundingRect(c)
        cx, cy = bounding_box_center(c_bbox)

        # Method 1 & 3: Force strict spatial constraint if hand_bbox is present
        if hand_bbox is not None:
            hx, hy, hw, hh = hand_bbox
            # Ignore artificial contour created by the ROI mask rectangle boundary
            if abs(c_bbox[2] - hw) <= 4 and abs(c_bbox[3] - hh) <= 4:
                continue
            if not (hx <= cx <= hx + hw and hy <= cy <= hy + hh):
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
                best_bbox = c_bbox
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


def detect_motion_pen(
    curr_frame: np.ndarray,
    prev_gray_blur: Optional[np.ndarray],
    finger_roi: Optional[Tuple[int, int, int, int]] = None,
) -> Tuple[BoundingBox, float, Optional[Tuple[float, float]], np.ndarray]:
    """
    Detect pen movement using cv2.absdiff motion masking between MediaPipe finger ROI points (LM 0, 4, 8).
    Calculates center (x, y) using cv2.moments.

    Returns
    -------
    (bounding_box, confidence, center_pt, curr_gray_blur)
    """
    if curr_frame is None or curr_frame.size == 0:
        return None, 0.0, None, np.zeros((1, 1), dtype=np.uint8)

    gray = cv2.cvtColor(curr_frame, cv2.COLOR_BGR2GRAY)
    curr_gray_blur = cv2.GaussianBlur(gray, (5, 5), 0)

    if prev_gray_blur is None or prev_gray_blur.shape != curr_gray_blur.shape:
        return None, 0.0, None, curr_gray_blur

    diff = cv2.absdiff(curr_gray_blur, prev_gray_blur)
    _, thresh = cv2.threshold(diff, 20, 255, cv2.THRESH_BINARY)

    # Apply MediaPipe finger ROI as mask over motion data
    mask = np.zeros_like(thresh)
    if finger_roi is not None:
        fx, fy, fw, fh = finger_roi
        mask[fy : fy + fh, fx : fx + fw] = 255
    else:
        mask[:] = 255

    masked_motion = cv2.bitwise_and(thresh, thresh, mask=mask)

    contours, _ = cv2.findContours(masked_motion, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None, 0.0, None, curr_gray_blur

    largest_c = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(largest_c)

    if area < 10:
        return None, 0.0, None, curr_gray_blur

    M = cv2.moments(largest_c)
    if M["m00"] > 0:
        cx = float(M["m10"] / M["m00"])
        cy = float(M["m01"] / M["m00"])
        bbox = cv2.boundingRect(largest_c)
        return bbox, 0.95, (cx, cy), curr_gray_blur

    return None, 0.0, None, curr_gray_blur
