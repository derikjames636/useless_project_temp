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
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--chalk-yellow)', fontFamily: 'var(--font-typewriter)' }}>
              ANGULAR VELOCITY (RPM) ✏️
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#351E0E', color: 'var(--chalk-yellow)', border: '1px solid #704727' }}>
              <Zap size={16} />
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <div className="text-metric" style={{ color: 'var(--chalk-white)', fontFamily: 'var(--font-chalk)' }}>
              {Math.round(results.rpm)}
              <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--chalk-yellow)', marginLeft: '8px', fontFamily: 'var(--font-typewriter)' }}>
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
          }}>
            <span style={{
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(74, 222, 128, 0.15)',
              color: '#86EFAC',
              fontFamily: 'var(--font-typewriter)',
              fontWeight: 700,
              border: '1px solid rgba(74, 222, 128, 0.3)',
            }}>
              PEAK VELOCITY
            </span>
            <span style={{ color: '#94A3B8', fontFamily: 'var(--font-handwriting)' }}>Angular momentum constant</span>
          </div>
        </div>

        {/* Center Accuracy Card */}
        <div className="telemetry-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--chalk-yellow)', fontFamily: 'var(--font-typewriter)' }}>
              KNUCKLE AXIS PIVOT 🎯
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#351E0E', color: '#86EFAC', border: '1px solid #704727' }}>
              <Target size={16} />
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <div className="text-metric" style={{ color: '#86EFAC', fontFamily: 'var(--font-chalk)' }}>
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
              backgroundColor: 'rgba(74, 222, 128, 0.15)',
              color: '#86EFAC',
              fontFamily: 'var(--font-typewriter)',
              fontWeight: 700,
              border: '1px solid rgba(74, 222, 128, 0.3)',
            }}>
              BALANCED
            </span>
            <span style={{ color: '#94A3B8', fontFamily: 'var(--font-handwriting)' }}>Pivot drift &lt; 4.5%</span>
          </div>
        </div>

        {/* Wobble Card */}
        <div className="telemetry-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--chalk-yellow)', fontFamily: 'var(--font-typewriter)' }}>
              DESK CLATTER STABILITY 🌊
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#351E0E', color: 'var(--chalk-orange)', border: '1px solid #704727' }}>
              <Waves size={16} />
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <div className="text-metric" style={{ color: '#FDE047', fontFamily: 'var(--font-chalk)' }}>
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
              backgroundColor: 'rgba(254, 240, 138, 0.15)',
              color: '#FEF08A',
              fontFamily: 'var(--font-typewriter)',
              fontWeight: 700,
              border: '1px solid rgba(254, 240, 138, 0.3)',
            }}>
              SILENT SPIN
            </span>
            <span style={{ color: '#94A3B8', fontFamily: 'var(--font-handwriting)' }}>RMS orbital stability</span>
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
          <div style={{ background: '#351E0E', border: '1px solid #704727', borderRadius: '8px', padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#FEF08A', fontFamily: 'var(--font-typewriter)', fontWeight: 700 }}>
              <Sparkles size={13} color="#FEF08A" />
              <span>AURA SCORE</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-chalk)', marginTop: '4px', color: 'var(--chalk-yellow)' }}>
              {results.aura_score.toLocaleString()} <span style={{ fontSize: '12px', color: '#CBD5E1', fontFamily: 'var(--font-typewriter)' }}>pts</span>
            </div>
          </div>
        )}

        <div style={{ background: '#18281F', border: '1px solid var(--border-chalk)', borderRadius: '8px', padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-typewriter)' }}>
            <Gauge size={13} />
            <span>AVG VELOCITY</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-typewriter)', marginTop: '4px', color: 'var(--chalk-white)' }}>
            {results.average_velocity} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>m/s</span>
          </div>
        </div>

        <div style={{ background: '#18281F', border: '1px solid var(--border-chalk)', borderRadius: '8px', padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-typewriter)' }}>
            <Activity size={13} />
            <span>PEAK ACCEL</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-typewriter)', marginTop: '4px', color: 'var(--chalk-white)' }}>
            {results.peak_acceleration} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>m/s²</span>
          </div>
        </div>

        <div style={{ background: '#18281F', border: '1px solid var(--border-chalk)', borderRadius: '8px', padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-typewriter)' }}>
            <Compass size={13} />
            <span>ROTATIONS</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-typewriter)', marginTop: '4px', color: 'var(--chalk-white)' }}>
            {results.rotations} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>revs</span>
          </div>
        </div>

        <div style={{ background: '#18281F', border: '1px solid var(--border-chalk)', borderRadius: '8px', padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-typewriter)' }}>
            <ShieldCheck size={13} />
            <span>CONFIDENCE</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-typewriter)', marginTop: '4px', color: '#86EFAC' }}>
            {results.tracking_confidence.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};
