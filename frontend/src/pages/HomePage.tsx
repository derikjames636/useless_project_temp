import React from 'react';
import { Upload, Play, ArrowRight, Zap, Target, BookOpen, Bell } from 'lucide-react';

interface HomePageProps {
  onStartUpload: () => void;
  onLoadSample: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartUpload, onLoadSample }) => {
  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
    }}>
      {/* Chalkboard Hero Section with Wooden Frame */}
      <div className="chalkboard-frame" style={{
        padding: '48px 36px 36px 36px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '22px',
        position: 'relative',
      }}>
        {/* Sticky Note on Corner */}
        <div className="post-it-note" style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          maxWidth: '190px',
          textAlign: 'left',
          fontSize: '13px',
          lineHeight: '1.3',
          zIndex: 10,
          display: 'none', // Shown via media query or inline on desktop
        }}>
          <strong>📌 Hall Pass Rule:</strong><br />
          If pen drops during class, 10 minutes detention with Mr. Henderson.
        </div>

        {/* Vintage Chalk Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '6px',
          backgroundColor: 'rgba(254, 240, 138, 0.12)',
          border: '1px dashed #FEF08A',
          color: 'var(--chalk-yellow)',
          fontSize: '13px',
          fontFamily: 'var(--font-typewriter)',
          fontWeight: 700,
          letterSpacing: '0.04em',
        }}>
          <Bell size={14} color="#FEF08A" />
          PERIOD 3: BACKBENCHER PHYSICS TELEMETRY LAB
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 5vw, 58px)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          maxWidth: '850px',
          fontFamily: 'var(--font-chalk)',
          color: 'var(--chalk-white)',
          textShadow: '0 0 3px rgba(255, 255, 255, 0.9), 0 0 10px rgba(254, 240, 138, 0.4)',
        }}>
          Pen Flip Aura Calculator
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#CBD5E1',
          maxWidth: '720px',
          lineHeight: 1.6,
          fontFamily: 'var(--font-handwriting)',
        }}>
          POV: Back row of Period 3 Physics while the teacher is writing equations on the green chalkboard. 
          Drop your pen-spinning video on the desk to compute RPM velocity, knuckle axis center, 
          and calculate your official Classroom Aura score!
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '18px',
          marginTop: '8px',
          zIndex: 5,
        }}>
          <button
            className="btn-primary"
            onClick={onStartUpload}
            style={{ padding: '16px 36px', fontSize: '15px' }}
          >
            <Upload size={18} />
            <span>Slide Homework Clip Across Desk</span>
            <ArrowRight size={18} />
          </button>

          <button
            className="btn-secondary"
            onClick={onLoadSample}
            style={{ padding: '16px 26px', fontSize: '14px' }}
          >
            <Play size={16} color="#FEF08A" />
            <span>Borrow Smart Kid's 240 FPS Clip</span>
          </button>
        </div>

        {/* Chalk Tray at bottom of hero chalkboard */}
        <div style={{
          width: 'calc(100% + 72px)',
          margin: '32px -36px -36px -36px',
        }}>
          <div className="chalk-tray">
            <span style={{ fontSize: '10px', color: '#A07047', fontFamily: 'var(--font-typewriter)', marginRight: '8px' }}>
              CHALK TRAY:
            </span>
            <div className="chalk-stick" style={{ background: '#FFFFFF' }} title="White Chalk" />
            <div className="chalk-stick" style={{ background: '#FEF08A' }} title="Yellow Chalk" />
            <div className="chalk-stick" style={{ background: '#86EFAC' }} title="Mint Chalk" />
            <div className="chalk-stick" style={{ background: '#FDA4AF' }} title="Pink Chalk" />
            <div style={{
              marginLeft: 'auto',
              width: '45px',
              height: '12px',
              background: '#2A170A',
              border: '1px solid #5C3A21',
              borderRadius: '2px',
            }} title="Felt Eraser" />
          </div>
        </div>
      </div>

      {/* Feature Section: 3 Notebook Flashcards with ruled paper styling */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
        }}>
          <BookOpen size={18} color="#FEF08A" />
          <span style={{
            fontSize: '13px',
            fontFamily: 'var(--font-typewriter)',
            color: 'var(--chalk-yellow)',
            letterSpacing: '0.06em',
            fontWeight: 700,
          }}>
            LAB NOTEBOOK · KINEMATIC RUBRIC
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '22px',
        }}>
          {/* Card 1: Ruled Notebook Paper */}
          <div className="notebook-paper" style={{ transform: 'rotate(-0.5deg)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}>
              <Zap size={18} color="#B45309" />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B', fontFamily: 'var(--font-handwriting)' }}>
                Angular Velocity (RPM)
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Calculates continuous rotational velocity and peak cycles-per-second using sub-pixel knuckle tracking.
            </p>
            <div style={{
              marginTop: '12px',
              fontSize: '12px',
              color: '#DC2626',
              fontFamily: 'var(--font-chalk)',
              fontWeight: 700,
            }}>
              ✓ Formula: ω = 2π × (rev / sec)
            </div>
          </div>

          {/* Card 2: Ruled Notebook Paper */}
          <div className="notebook-paper" style={{ transform: 'rotate(0.5deg)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}>
              <Target size={18} color="#047857" />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B', fontFamily: 'var(--font-handwriting)' }}>
                Knuckle Pivot Accuracy
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Tracks pen center-of-mass against your index & middle finger coordinates to guarantee seamless orbit.
            </p>
            <div style={{
              marginTop: '12px',
              fontSize: '12px',
              color: '#DC2626',
              fontFamily: 'var(--font-chalk)',
              fontWeight: 700,
            }}>
              ✓ Tolerance: ≤ 4.2mm drift
            </div>
          </div>

          {/* Card 3: Post-it / Yellow Sticky Style */}
          <div className="post-it-note" style={{ transform: 'rotate(-1deg)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1C1917', fontFamily: 'var(--font-handwriting)' }}>
                Desk Clatter & Wobble
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: '#44403C', lineHeight: 1.5, margin: 0 }}>
              Detects off-axis precession before the pen hits the wooden desk and turns the teacher around.
            </p>
            <div style={{
              marginTop: '12px',
              fontSize: '12px',
              color: '#991B1B',
              fontFamily: 'var(--font-typewriter)',
              fontWeight: 700,
            }}>
              ⚠️ Clatter risk penalty: -150 Aura
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
