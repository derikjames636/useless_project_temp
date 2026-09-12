import React from 'react';
import type { AnalysisResponse, TrajectoryResponse } from '../types/analysis';
import { VideoViewport } from '../components/VideoViewport';
import { OverallScoreRing } from '../components/OverallScoreRing';
import { MetricCards } from '../components/MetricCards';
import { TrajectoryCanvas } from '../components/TrajectoryCanvas';
import { MetricTimelines } from '../components/MetricTimelines';
import { Download, RotateCcw, CheckCircle, Sparkles } from 'lucide-react';

interface ResultsPageProps {
  analysis: AnalysisResponse;
  trajectory: TrajectoryResponse | null;
  videoSrc: string;
  onNewAnalysis: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  analysis,
  trajectory,
  videoSrc,
  onNewAnalysis,
}) => {
  const results = analysis.results;
  if (!results) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        No analysis results available.
      </div>
    );
  }

  // If backend provided overall_score use it, otherwise derive cleanly
  const overallScore =
    results.overall_score ??
    Math.round(
      Math.min(100, Math.max(0, (results.center_accuracy * 0.45) + ((100 - results.wobble_percent * 5) * 0.35) + (Math.min(100, results.rpm / 8) * 0.2)))
    );

  const points = trajectory?.points || [];
  const rotationCenter = trajectory?.rotation_center || { x: 960, y: 540 };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ analysis, trajectory }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `penflip_analysis_${analysis.analysis_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '32px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px',
    }}>
      {/* Top Bar: Title & Primary Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--status-success)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '0.06em',
          }}>
            <CheckCircle size={14} color="var(--status-success)" />
            POP QUIZ GRADED · TEST ID #{analysis.analysis_id}
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            Teacher's Kinematic Evaluation & Technique Report
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleExportJson}
            className="btn-secondary"
            style={{ padding: '10px 16px', fontSize: '13px' }}
          >
            <Download size={15} />
            <span>Export Desk Telemetry</span>
          </button>

          <button
            onClick={onNewAnalysis}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '13px' }}
          >
            <RotateCcw size={15} />
            <span>Spin Again (New Video)</span>
          </button>
        </div>
      </div>

      {/* TOP ZONE: Replay Video Viewport (60%) + Score Card & Key Summary (40%) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(340px, 1.4fr) minmax(280px, 1fr)',
        gap: '24px',
        alignItems: 'stretch',
      }}>
        {/* Left: Replay Video with synchronized HUD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            CHALKBOARD REPLAY & INTERACTIVE DESK HUD
          </div>
          <VideoViewport
            videoSrc={videoSrc}
            trajectoryPoints={points}
            rotationCenter={rotationCenter}
            currentRpm={Math.round(results.rpm)}
            currentAccuracy={Math.round(results.center_accuracy)}
            currentWobble={results.wobble_percent}
            trackingStatus="TRACKING"
          />
        </div>

        {/* Right: Technique Score Ring & Summary Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            CLASSROOM TECHNIQUE EVALUATION
          </div>
          <OverallScoreRing
            score={overallScore}
            title="ASSIGNMENT SCORE"
            subtitle="Calculated from angular momentum, knuckle axis & orbit stability."
          />

          {/* Aura Banner Card */}
          {(results.aura_level || results.aura_score !== undefined) && (
            <div className="telemetry-card" style={{
              padding: '18px 22px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.12) 0%, rgba(0, 240, 255, 0.08) 50%, rgba(192, 132, 252, 0.1) 100%)',
              border: '1px solid rgba(0, 255, 136, 0.4)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 136, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(0, 255, 136, 0.18)',
                  color: '#00FF88',
                  border: '1px solid rgba(0, 255, 136, 0.4)',
                  boxShadow: '0 0 14px rgba(0, 255, 136, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Sparkles size={24} />
                </div>
                <div>
                  <div style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#00FF88',
                    letterSpacing: '0.08em',
                  }}>
                    CLASSROOM AURA RANK
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#F0FDF4',
                    marginTop: '2px',
                    textShadow: '0 0 14px rgba(0, 255, 136, 0.4)',
                  }}>
                    {results.aura_level || 'Calculating...'}
                  </div>
                </div>
              </div>

              {results.aura_score !== undefined && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.05em',
                  }}>
                    AURA POINTS
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: '#00F0FF',
                    textShadow: '0 0 12px rgba(0, 240, 255, 0.5)',
                    letterSpacing: '-0.02em',
                  }}>
                    {results.aura_score.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>PTS</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Verdict Banner */}
          {results.verdict && (
            <div className="telemetry-card" style={{
              padding: '16px 20px',
              borderRadius: '10px',
              background: results.is_fake_flicker ? 'rgba(255, 71, 87, 0.08)' : 'rgba(90, 228, 168, 0.08)',
              border: results.is_fake_flicker ? '1px solid rgba(255, 71, 87, 0.35)' : '1px solid rgba(90, 228, 168, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              <div style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: results.is_fake_flicker ? 'var(--teacher-red)' : 'var(--status-success)',
                letterSpacing: '0.05em',
              }}>
                {results.is_fake_flicker ? '🚨 DETENTION SLIP · FAKE FLICKER' : '🍎 TEACHER REMARK · FLIP EVALUATION'}
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: results.is_fake_flicker ? '#FFA4A9' : 'var(--text-primary)',
                lineHeight: 1.4,
              }}>
                "{results.verdict}"
              </div>
            </div>
          )}

          {/* Quick breakdown panel */}
          <div className="telemetry-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
              DESK LAB TELEMETRY SUMMARY
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Camera Frame Rate</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', fontWeight: 600 }}>
                {analysis.video?.fps || 240} FPS
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Duration / Exam Frames</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {analysis.video?.duration || 2.4}s ({analysis.video?.total_frames || 576} frames)
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Confidence Metric</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--status-success)', fontWeight: 600 }}>
                {results.tracking_confidence.toFixed(1)}% High Accuracy
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* MIDDLE ZONE: Metric Cards (RPM, Center, Wobble + Kinetics) */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
          PERFORMANCE BREAKDOWN
        </div>
        <MetricCards results={results} />
      </div>

      {/* BOTTOM ZONE: Trajectory Canvas & Dynamic Timelines */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1fr)',
        gap: '24px',
      }}>
        {/* Trajectory Plot */}
        <TrajectoryCanvas
          points={points}
          rotationCenter={rotationCenter}
        />

        {/* Timelines */}
        <MetricTimelines
          totalDuration={analysis.video?.duration || 2.4}
          baseRpm={results.rpm}
          baseWobble={results.wobble_percent}
        />
      </div>
    </div>
  );
};
