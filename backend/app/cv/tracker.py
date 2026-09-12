"""
Frame-by-frame tracking orchestrator.

Integrates pen detection, hand detection, occlusion handling, and
tracking-failure logic into a single pipeline.

Tracking states per frame (docs/BACKEND.md §19, §20):
  "detected"   — pen found directly via CV
  "estimated"  — interpolated during short occlusion
  "lost"       — tracking failed irrecoverably

Tracking terminates if pen is not recoverable within MAX_OCCLUDED_FRAMES.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, List, Optional, Tuple

import cv2
import numpy as np

from app.config import MAX_OCCLUDED_FRAMES
from app.cv.hand_detector import detect_finger_roi, detect_hand_bbox, detect_rotation_center
from app.cv.pen_detector import bounding_box_center, detect_motion_pen, detect_pen


@dataclass
class FrameRecord:
    """Per-frame tracking data — mirrors BACKEND.md §13 JSON structure."""

    frame: int
    timestamp: float
    x: float
    y: float
    width: int
    height: int
    center_x: float
    center_y: float
    tracking_confidence: float
    tracking_state: str  # "detected" | "estimated" | "lost"


@dataclass
class TrackingResult:
    """Aggregate output of the full tracking pass."""

    records: List[FrameRecord] = field(default_factory=list)
    rotation_center: Optional[Tuple[float, float]] = None
    tracking_lost: bool = False
    failure_reason: str = ""


def _interpolate_gap(records: List[FrameRecord], start_idx: int, end_idx: int) -> None:
    """
    Retroactively interpolate estimated records between start_idx and end_idx (inclusive)
    using linear position interpolation between bounding anchors.
    """
    if start_idx <= 0 or end_idx >= len(records) - 1 or start_idx > end_idx:
        return

    prev_rec = records[start_idx - 1]
    next_rec = records[end_idx + 1]

    gap_count = (end_idx - start_idx + 1) + 1  # total steps between anchors

    for idx in range(start_idx, end_idx + 1):
        step = idx - start_idx + 1
        alpha = step / gap_count

        interp_cx = prev_rec.center_x + alpha * (next_rec.center_x - prev_rec.center_x)
        interp_cy = prev_rec.center_y + alpha * (next_rec.center_y - prev_rec.center_y)
        interp_w = int(prev_rec.width + alpha * (next_rec.width - prev_rec.width))
        interp_h = int(prev_rec.height + alpha * (next_rec.height - prev_rec.height))
        interp_x = interp_cx - interp_w / 2.0
        interp_y = interp_cy - interp_h / 2.0

        records[idx].x = interp_x
        records[idx].y = interp_y
        records[idx].width = interp_w
        records[idx].height = interp_h
        records[idx].center_x = interp_cx
        records[idx].center_y = interp_cy


def track_video(
    video_path: Path,
    progress_callback: Optional[Callable[[int, int], None]] = None,
) -> TrackingResult:
    """
    Process every frame in the video file.

    Parameters
    ----------
    video_path        : absolute path to the uploaded video.
    progress_callback : optional callable(current_frame, total_frames) for
                        streaming progress to the status endpoint.

    Returns
    -------
    TrackingResult with per-frame records and aggregated tracking state.
    """
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        return TrackingResult(tracking_lost=True, failure_reason="Cannot open video file")

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    result = TrackingResult()
    occluded_count = 0
    last_bbox: Optional[Tuple[int, int, int, int]] = None
    last_center: Optional[Tuple[float, float]] = None
    velocity: Tuple[float, float] = (0.0, 0.0)
    rotation_center_found = False
    rotation_center: Optional[Tuple[float, float]] = None

    # Center-Screen Auto-Color Calibration from Frame 0
    hsv_bounds: Optional[Tuple[np.ndarray, np.ndarray]] = None
    ret0, frame0 = cap.read()
    if ret0 and frame0 is not None and frame0.size > 0:
        fh, fw = frame0.shape[:2]
        cx, cy = fw // 2, fh // 2

        # 50x50 bounding box in exact dead center
        y1, y2 = max(0, cy - 25), min(fh, cy + 25)
        x1, x2 = max(0, cx - 25), min(fw, cx + 25)
        center_roi = frame0[y1:y2, x1:x2]

        if center_roi.size > 0:
            hsv_roi = cv2.cvtColor(center_roi, cv2.COLOR_BGR2HSV)
            avg_hsv = cv2.mean(hsv_roi)[:3]

            lower_h = max(0, int(avg_hsv[0] - 20))
            upper_h = min(180, int(avg_hsv[0] + 20))
            lower_s = max(0, int(avg_hsv[1] - 60))
            upper_s = min(255, int(avg_hsv[1] + 60))
            lower_v = max(0, int(avg_hsv[2] - 60))
            upper_v = min(255, int(avg_hsv[2] + 60))

            lower_color = np.array([lower_h, lower_s, lower_v], dtype=np.uint8)
            upper_color = np.array([upper_h, upper_s, upper_v], dtype=np.uint8)
            hsv_bounds = (lower_color, upper_color)

    # Fallback if frame 0 read failed
    if hsv_bounds is None:
        lower_color = np.array([100, 150, 50], dtype=np.uint8)
        upper_color = np.array([140, 255, 255], dtype=np.uint8)
        hsv_bounds = (lower_color, upper_color)

    # Reset position pointer back to frame 0
    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

    frame_idx = 0
    estimated_gap_start_idx: Optional[int] = None
    prev_gray_blur: Optional[np.ndarray] = None

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        timestamp = frame_idx / fps

        # Dynamic ROI around Palm Base (LM0), Thumb Tip (LM4), Index Tip (LM8) with 30px padding
        finger_roi = detect_finger_roi(frame, padding=30)
        hand_bbox = detect_hand_bbox(frame, padding=100)

        # Try to establish/update rotation centre (only when hand is visible)
        if not rotation_center_found or frame_idx % 30 == 0:
            rc = detect_rotation_center(frame)
            if rc is not None:
                rotation_center = rc
                rotation_center_found = True

        # Frame-difference motion masking (cv2.absdiff + finger ROI mask + cv2.moments)
        m_bbox, m_conf, m_center, prev_gray_blur = detect_motion_pen(
            frame, prev_gray_blur, finger_roi=finger_roi
        )

        bbox = m_bbox
        confidence = m_conf
        motion_cx_cy = m_center

        # Fallback to geometry/color detector if motion contour unavailable
        if bbox is None:
            bbox, confidence = detect_pen(frame, hand_bbox=hand_bbox, hsv_bounds=hsv_bounds)
            if bbox is not None:
                motion_cx_cy = bounding_box_center(bbox)

        if bbox is not None and motion_cx_cy is not None:
            # DETECTED — direct CV detection
            cx, cy = motion_cx_cy
            x, y, w, h = bbox

            # Calculate velocity vector from previous detected position
            if last_center is not None:
                velocity = (cx - last_center[0], cy - last_center[1])

            record = FrameRecord(
                frame=frame_idx,
                timestamp=timestamp,
                x=float(x),
                y=float(y),
                width=w,
                height=h,
                center_x=cx,
                center_y=cy,
                tracking_confidence=confidence,
                tracking_state="detected",
            )
            result.records.append(record)

            # Method 2: If we just recovered from an occlusion gap, retroactively interpolate
            if estimated_gap_start_idx is not None:
                gap_end_idx = len(result.records) - 2
                _interpolate_gap(result.records, estimated_gap_start_idx, gap_end_idx)
                estimated_gap_start_idx = None

            last_bbox = bbox
            last_center = (cx, cy)
            occluded_count = 0
        else:
            # No direct detection (e.g. motion blur / severe occlusion)
            occluded_count += 1

            if occluded_count > MAX_OCCLUDED_FRAMES:
                # TRACKING LOST — irrecoverable
                result.tracking_lost = True
                result.failure_reason = (
                    f"Pen lost for {occluded_count} consecutive frames "
                    f"(threshold: {MAX_OCCLUDED_FRAMES})"
                )
                break

            if last_center is not None and last_bbox is not None:
                # Method 2: ESTIMATED — extrapolate using kinematic velocity during blur
                vx, vy = velocity
                # Dampen velocity slightly over frames to prevent runaway extrapolation
                damp = 0.9 ** occluded_count
                cx = last_center[0] + vx * damp
                cy = last_center[1] + vy * damp
                w, h = last_bbox[2], last_bbox[3]
                x = cx - w / 2.0
                y = cy - h / 2.0

                record = FrameRecord(
                    frame=frame_idx,
                    timestamp=timestamp,
                    x=float(x),
                    y=float(y),
                    width=w,
                    height=h,
                    center_x=cx,
                    center_y=cy,
                    tracking_confidence=0.0,
                    tracking_state="estimated",
                )
                result.records.append(record)

                if estimated_gap_start_idx is None:
                    estimated_gap_start_idx = len(result.records) - 1
            else:
                # No prior data yet — skip frame
                frame_idx += 1
                if progress_callback and total_frames > 0:
                    progress_callback(frame_idx, total_frames)
                continue

        frame_idx += 1
        if progress_callback and total_frames > 0:
            progress_callback(frame_idx, total_frames)

    cap.release()
    result.rotation_center = rotation_center
    return result

