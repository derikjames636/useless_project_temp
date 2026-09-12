import type { AnalysisResponse, TrajectoryResponse, TrajectoryPoint } from '../types/analysis';

/**
 * Mock data matching docs/TEAM_SHARED_CONTRACT.md section 7, 10, 14
 */
export const MOCK_ANALYSIS_COMPLETED: AnalysisResponse = {
  analysis_id: 'a8f31c',
  status: 'completed',
  video: {
    fps: 240,
    duration: 2.4,
    total_frames: 576,
    width: 1920,
    height: 1080,
  },
  results: {
    rpm: 742.4,
    center_accuracy: 94.2,
    wobble_percent: 3.8,
    average_velocity: 2.4,
    peak_velocity: 4.8,
    average_acceleration: 5.1,
    peak_acceleration: 8.1,
    tracking_confidence: 97.0,
    rotations: 12,
    overall_score: 87,
  },
  files: {
    trajectory: '/api/analyses/a8f31c/trajectory',
    overlay_video: '/api/analyses/a8f31c/video',
  },
};

/**
 * Dynamically generates realistic, unique pen-spinning analysis per video upload
 */
export function generateDynamicMockAnalysis(
  analysisId: string,
  fileInfo?: { name: string; size: number }
): AnalysisResponse {
  const seedString = analysisId + (fileInfo ? `${fileInfo.name}_${fileInfo.size}` : '');
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const rpm = Math.round(480 + (absHash % 480) + (absHash % 13) * 1.5);
  const centerAccuracy = Math.round((78 + (absHash % 20) + (absHash % 7) * 0.2) * 10) / 10;
  const wobblePercent = Math.round((1.8 + (absHash % 55) / 10) * 10) / 10;
  const rotations = Math.max(4, Math.round((rpm / 60) * 1.8));
  const avgVel = Math.round((1.9 + (absHash % 22) / 10) * 10) / 10;
  const peakVel = Math.round((avgVel * (1.5 + (absHash % 8) / 10)) * 10) / 10;
  const confidence = Math.round((91 + (absHash % 8)) * 10) / 10;

  const rawScore = Math.round((rpm / 1000) * 40 + centerAccuracy * 0.45 - wobblePercent * 2.5);
  const overallScore = Math.min(98, Math.max(52, rawScore));

  return {
    analysis_id: analysisId,
    status: 'completed',
    video: {
      fps: 240,
      duration: 2.4,
      total_frames: 576,
      width: 1920,
      height: 1080,
    },
    results: {
      rpm,
      center_accuracy: centerAccuracy,
      wobble_percent: wobblePercent,
      average_velocity: avgVel,
      peak_velocity: peakVel,
      average_acceleration: Math.round(avgVel * 2.1 * 10) / 10,
      peak_acceleration: Math.round(peakVel * 1.8 * 10) / 10,
      tracking_confidence: confidence,
      rotations,
      overall_score: overallScore,
    },
    files: {
      trajectory: `/api/analyses/${analysisId}/trajectory`,
      overlay_video: `/api/analyses/${analysisId}/video`,
    },
  };
}

/**
 * Generates realistic pen-spinning trajectory points simulating 12 rotations over 576 frames (240 FPS, 2.4s)
 * Around rotation center (960, 540) in a 1920x1080 canvas
 */
export function generateMockTrajectory(totalFrames = 576): TrajectoryResponse {
  const points: TrajectoryPoint[] = [];
  const centerX = 960;
  const centerY = 540;
  const radius = 220; // pixels
  const rotations = 12;
  const totalAngle = rotations * 2 * Math.PI;

  for (let i = 1; i <= totalFrames; i++) {
    const progress = i / totalFrames;
    const currentAngle = progress * totalAngle;
    
    // Controlled sinusoidal wobble mimicking pen wobble
    const wobbleNoise = Math.sin(currentAngle * 3.7) * 8.4 + Math.cos(currentAngle * 2.1) * 4.2;
    const currentRadius = radius + wobbleNoise;
    
    // Slight center drift
    const centerDriftX = Math.sin(progress * Math.PI * 2) * 12;
    const centerDriftY = Math.cos(progress * Math.PI * 2) * 10;
    
    const penCenterX = centerX + centerDriftX + currentRadius * Math.cos(currentAngle);
    const penCenterY = centerY + centerDriftY + currentRadius * Math.sin(currentAngle);
    
    // Simulated temporary occlusion around frames 230-245 (finger cross)
    const isOccluded = i >= 230 && i <= 245;

    points.push({
      frame: i,
      x: Math.round(penCenterX - 45), // bounding box top-left x
      y: Math.round(penCenterY - 12), // bounding box top-left y
      width: 90,
      height: 24,
      center_x: Math.round(penCenterX),
      center_y: Math.round(penCenterY),
      confidence: isOccluded ? 0.42 : 0.98,
      tracking_state: isOccluded ? 'estimated' : 'detected',
    });
  }

  return {
    points,
    rotation_center: {
      x: centerX,
      y: centerY,
    },
  };
}

export const MOCK_TRAJECTORY: TrajectoryResponse = generateMockTrajectory(576);
