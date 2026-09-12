import React from 'react';
import type { AnalysisResponse, TrajectoryResponse } from '../types/analysis';
import { VideoViewport } from '../components/VideoViewport';
import { OverallScoreRing } from '../components/OverallScoreRing';
import { MetricCards } from '../components/MetricCards';
import { TrajectoryCanvas } from '../components/TrajectoryCanvas';
import { MetricTimelines } from '../components/MetricTimelines';
import { Download, RotateCcw, CheckCircle } from 'lucide-react';

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
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--chalk-yellow)', fontFamily: 'var(--font-typewriter)', letterSpacing: '0.05em' }}>
            PHYSICS LAB GRADE · REPORT CARD
          </div>
          <OverallScoreRing
            score={overallScore}
            title="EXAM SCORE"
            subtitle="Calculated from angular velocity, knuckle axis orbit & desk stability."
          />

          {/* Aura Banner Card - Styled as a Pinned Yellow Sticky Note */}
          {(results.aura_level || results.aura_score !== undefined) && (
            <div className="post-it-note" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              color: '#1C1917',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#FDE047',
                  border: '2px solid #CA8A04',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}>
                  <span style={{ fontSize: '20px' }}>⭐</span>
                </div>
                <div>
                  <div style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-typewriter)',
                    fontWeight: 700,
                    color: '#854D0E',
                    letterSpacing: '0.06em',
                  }}>
                    CLASSROOM AURA RANK
                  </div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-handwriting)',
                    color: '#1C1917',
                    marginTop: '2px',
                  }}>
                    {results.aura_level || 'Calculating...'}
                  </div>
                </div>
              </div>

              {results.aura_score !== undefined && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-typewriter)',
                    color: '#713F12',
                    letterSpacing: '0.05em',
                  }}>
                    POINTS
                  </div>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-chalk)',
                    color: '#DC2626',
                    letterSpacing: '-0.02em',
                  }}>
                    {results.aura_score.toLocaleString()} <span style={{ fontSize: '11px', fontWeight: 700, color: '#1C1917' }}>PTS</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Verdict Banner - Teacher's Red Ink Note */}
          {results.verdict && (
            <div style={{
              padding: '16px 20px',
              borderRadius: '8px',
              background: results.is_fake_flicker ? 'rgba(220, 38, 38, 0.12)' : 'rgba(248, 250, 252, 0.06)',
              border: results.is_fake_flicker ? '2px dashed #DC2626' : '2px dashed var(--border-chalk)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              <div style={{
                fontSize: '12px',
                fontFamily: 'var(--font-typewriter)',
                fontWeight: 700,
                color: results.is_fake_flicker ? '#EF4444' : '#86EFAC',
                letterSpacing: '0.05em',
              }}>
                {results.is_fake_flicker ? '🚨 DETENTION SLIP · FAKE FLICKER' : '🍎 TEACHER REMARK · FLIP EVALUATION'}
              </div>
              <div style={{
                fontSize: '15px',
                fontFamily: 'var(--font-handwriting)',
                color: results.is_fake_flicker ? '#FCA5A5' : 'var(--chalk-white)',
                lineHeight: 1.4,
              }}>
                "{results.verdict}"
              </div>
            </div>
          )}

          {/* Desk Lab Telemetry Breakdown Panel */}
          <div className="telemetry-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--chalk-yellow)', fontFamily: 'var(--font-typewriter)', letterSpacing: '0.04em' }}>
              DESK LAB TELEMETRY SUMMARY
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Camera Frame Rate</span>
              <span style={{ fontFamily: 'var(--font-typewriter)', color: 'var(--chalk-yellow)', fontWeight: 600 }}>
                {analysis.video?.fps || 240} FPS
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Duration / Exam Frames</span>
              <span style={{ fontFamily: 'var(--font-typewriter)' }}>
                {analysis.video?.duration || 2.4}s ({analysis.video?.total_frames || 576} frames)
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Confidence Metric</span>
              <span style={{ fontFamily: 'var(--font-typewriter)', color: 'var(--chalk-green)', fontWeight: 600 }}>
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
