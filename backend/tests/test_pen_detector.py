"""
Unit tests for the color-agnostic pen detector (cv/pen_detector.py).
"""

import cv2
import numpy as np
import pytest

from app.cv.pen_detector import bounding_box_center, detect_pen


def create_blank_canvas(width=640, height=480, bg_color=(240, 240, 240)):
    canvas = np.zeros((height, width, 3), dtype=np.uint8)
    canvas[:] = bg_color
    return canvas


def test_detect_pen_empty_frame():
    bbox, conf = detect_pen(np.zeros((480, 640, 3), dtype=np.uint8))
    assert bbox is None
    assert conf == 0.0


def test_detect_pen_none_input():
    bbox, conf = detect_pen(None)  # type: ignore
    assert bbox is None
    assert conf == 0.0


@pytest.mark.parametrize(
    "pen_color, bg_color",
    [
        ((0, 0, 0), (255, 255, 255)),       # Black pen on white background
        ((255, 0, 0), (240, 240, 240)),     # Blue pen on light gray
        ((0, 0, 255), (240, 240, 240)),     # Red pen on light gray
        ((255, 255, 255), (40, 40, 40)),    # White pen on dark desk
        ((0, 255, 0), (50, 50, 50)),        # Green pen on dark desk
    ],
)
def test_detect_pen_various_colors(pen_color, bg_color):
    """Verify that pens of various colors are detected based on geometry."""
    canvas = create_blank_canvas(bg_color=bg_color)
    # Draw an elongated rod (160 x 14 px, aspect ratio ~ 11.4)
    pt1 = (200, 240)
    pt2 = (360, 240)
    cv2.line(canvas, pt1, pt2, pen_color, thickness=14)

    bbox, conf = detect_pen(canvas)
    assert bbox is not None, f"Failed to detect pen with color {pen_color}"
    assert conf >= 0.50

    x, y, w, h = bbox
    # Check that the bounding box covers the drawn pen
    assert w > 100
    assert h >= 10


def test_reject_square_or_circle():
    """Verify that non-elongated shapes (like hands, knuckles, or coins) are rejected."""
    canvas = create_blank_canvas()
    # Draw a 60x60 square (aspect ratio = 1.0)
    cv2.rectangle(canvas, (200, 200), (260, 260), (0, 0, 0), -1)

    bbox, conf = detect_pen(canvas)
    assert bbox is None
    assert conf == 0.0


def test_bounding_box_center():
    bbox = (100, 200, 50, 30)
    cx, cy = bounding_box_center(bbox)
    assert cx == 125.0
    assert cy == 215.0


def test_detect_pen_spatial_constraint():
    """Verify that detections outside the hand_bbox ROI are strictly rejected."""
    canvas = create_blank_canvas(bg_color=(240, 240, 240))
    # Draw blue pen far away at (500, 400)
    cv2.line(canvas, (450, 400), (550, 400), (255, 0, 0), thickness=14)

    # Define a hand_bbox far away at (50, 50, 200, 200)
    hand_bbox = (50, 50, 200, 200)

    # Detections outside hand_bbox should be rejected
    bbox, conf = detect_pen(canvas, hand_bbox=hand_bbox)
    assert bbox is None
    assert conf == 0.0

    # Draw blue pen INSIDE hand_bbox (100, 100) -> (180, 100)
    cv2.line(canvas, (100, 100), (180, 100), (255, 0, 0), thickness=14)
    bbox_inside, conf_inside = detect_pen(canvas, hand_bbox=hand_bbox)
    assert bbox_inside is not None
    assert conf_inside >= 0.50


