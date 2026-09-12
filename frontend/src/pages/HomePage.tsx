import React from 'react';
import { Upload, Play, Activity, ArrowRight, Zap, Target } from 'lucide-react';

interface HomePageProps {
  onStartUpload: () => void;
  onLoadSample: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartUpload, onLoadSample }) => {
  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '48px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '48px',
    }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        position: 'relative',
      }}>
        {/* Glow pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '6px',
          backgroundColor: 'rgba(254, 240, 138, 0.12)',
          border: '1px dashed rgba(254, 240, 138, 0.3)',
          color: '#FEF08A',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
        }}>
          <span style={{ fontSize: '14px' }}>✏️</span>
          PERIOD 3: BACKBENCHER PHYSICS TELEMETRY LAB
        </div>

        <h1 style={{
          fontSize: 'clamp(38px, 5.5vw, 64px)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1.08,
          maxWidth: '850px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #A7F3D0 60%, #38BDF8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 30px rgba(0, 255, 136, 0.2))',
        }}>
          Pen Flip Aura Calculator
        </h1>

        <p style={{
          fontSize: '17px',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          lineHeight: 1.6,
        }}>
          POV: Back row of Period 3 Physics while the teacher is busy on the chalkboard. 
          Upload your pen-spinning clip to run sub-pixel tracking, measure angular RPM, 
          and calculate your official Classroom Aura score.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '12px',
        }}>
          <button
            className="btn-primary"
            onClick={onStartUpload}
            style={{ padding: '16px 36px', fontSize: '15px' }}
          >
            <Upload size={18} />
            <span>Slide Video Across Desk</span>
            <ArrowRight size={18} />
          </button>

          <button
            className="btn-secondary"
            onClick={onLoadSample}
            style={{ padding: '16px 24px', fontSize: '14px' }}
          >
            <Play size={16} color="#FEF08A" />
            <span>Borrow Smart Kid's 240 FPS Demo</span>
          </button>
        </div>
      </div>

      {/* Feature Pillar Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginTop: '16px',
      }}>
        <div className="telemetry-card">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: 'rgba(93, 226, 255, 0.12)',
            color: 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '1px solid rgba(93, 226, 255, 0.25)',
          }}>
            <Zap size={20} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Rotational Velocity (RPM)
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
            Calculates high-velocity angular momentum and continuous rotation rate using sub-pixel coordinate tracking.
          </p>
        </div>

        <div className="telemetry-card">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: 'rgba(90, 228, 168, 0.12)',
            color: 'var(--status-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '1px solid rgba(90, 228, 168, 0.25)',
          }}>
            <Target size={20} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Finger Axis Accuracy
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
            Tracks the geometric pivot point relative to knuckles to ensure the pen stays centered on your hand.
          </p>
        </div>

        <div className="telemetry-card">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: 'rgba(254, 240, 138, 0.12)',
            color: '#FEF08A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '1px solid rgba(254, 240, 138, 0.25)',
          }}>
            <Activity size={20} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Stability & Desk Clatter Risk
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
            Quantifies orbital wobble and path deviations so your pen doesn't fly off the desk and alert the teacher.
          </p>
        </div>
      </div>
    </div>
  );
};
