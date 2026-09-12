import React from 'react';
import type { AnalysisResults } from '../types/analysis';
import { Zap, Target, Waves, Gauge, Activity, Compass, ShieldCheck, Sparkles } from 'lucide-react';

interface MetricCardsProps {
  results: AnalysisResults;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ results }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Primary 3 Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
      }}>
        {/* RPM Card */}
        <div className="telemetry-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              ANGULAR SPEED (RPM) ✏️
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: 'rgba(93, 226, 255, 0.12)', color: 'var(--accent-blue)' }}>
              <Zap size={16} />
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <div className="text-metric" style={{ color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
              {Math.round(results.rpm)}
              <span style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '6px' }}>
                RPM
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '14px',
            fontSize: '12px',
            color: 'var(--status-success)',
          }}>
            <span style={{
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(90, 228, 168, 0.12)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
            }}>
              PEAK VELOCITY
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>Continuous angular momentum</span>
          </div>
        </div>

        {/* Center Accuracy Card */}
        <div className="telemetry-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              KNUCKLE AXIS PRECISION 🎯
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: 'rgba(90, 228, 168, 0.12)', color: 'var(--status-success)' }}>
              <Target size={16} />
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <div className="text-metric" style={{ color: 'var(--status-success)', fontFamily: 'var(--font-mono)' }}>
              {results.center_accuracy.toFixed(1)}%
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '14px',
            fontSize: '12px',
          }}>
            <span style={{
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(90, 228, 168, 0.12)',
              color: 'var(--status-success)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
            }}>
              BALANCED
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>Finger pivot offset &lt; 5%</span>
          </div>
        </div>

        {/* Wobble Card */}
        <div className="telemetry-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              DESK CLATTER STABILITY 🌊
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: 'rgba(254, 240, 138, 0.12)', color: '#FEF08A' }}>
              <Waves size={16} />
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <div className="text-metric" style={{ color: '#FEF08A', fontFamily: 'var(--font-mono)' }}>
              {results.wobble_percent.toFixed(1)}%
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '14px',
            fontSize: '12px',
          }}>
            <span style={{
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(254, 240, 138, 0.12)',
              color: '#FEF08A',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
            }}>
              SILENT SPIN
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>RMS path variance: 2.4 px</span>
          </div>
        </div>
      </div>

      {/* Supporting Kinetic Details Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '12px',
      }}>
        {results.aura_score !== undefined && (
          <div style={{ background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '10px', padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#C084FC', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              <Sparkles size={13} color="#E879F9" />
              <span>AURA SCORE</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '4px', color: '#F472B6' }}>
              {results.aura_score.toLocaleString()} <span style={{ fontSize: '12px', color: '#C084FC' }}>pts</span>
            </div>
          </div>
        )}

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <Gauge size={13} />
            <span>AVG VELOCITY</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {results.average_velocity} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>m/s</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <Activity size={13} />
            <span>PEAK ACCELERATION</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {results.peak_acceleration} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>m/s²</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <Compass size={13} />
            <span>ROTATIONS</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {results.rotations} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>revs</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <ShieldCheck size={13} />
            <span>CONFIDENCE</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '4px', color: 'var(--status-success)' }}>
            {results.tracking_confidence.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};
