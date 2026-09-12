import React from 'react';

interface OverallScoreRingProps {
  score: number; // 0 - 100
  title?: string;
  subtitle?: string;
}

export const OverallScoreRing: React.FC<OverallScoreRingProps> = ({
  score = 87,
  title = 'ASSIGNMENT GRADE',
  subtitle = 'Teacher evaluation based on angular momentum & wobble stability.',
}) => {
  const radius = 64;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const letterGrade =
    score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'F';

  return (
    <div className="telemetry-card" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '24px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Title */}
      <div style={{
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: 'var(--chalk-yellow)',
        marginBottom: '16px',
        fontFamily: 'var(--font-typewriter)',
      }}>
        {title} 📝
      </div>

      {/* Chalk / Red Pen Circular Gauge */}
      <div style={{ position: 'relative', width: radius * 2, height: radius * 2 }}>
        <svg
          height={radius * 2}
          width={radius * 2}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background track */}
          <circle
            stroke="rgba(255, 255, 255, 0.12)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress bar */}
          <circle
            stroke="#FEF08A"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Score readout in Chalk Style */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: 700,
            lineHeight: 1,
            color: 'var(--chalk-white)',
            fontFamily: 'var(--font-chalk)',
            textShadow: '0 0 4px rgba(255, 255, 255, 0.7)',
          }}>
            {score}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--chalk-yellow)',
            fontFamily: 'var(--font-typewriter)',
            marginTop: '2px',
          }}>
            / 100
          </div>
        </div>
      </div>

      {/* Teacher's Red Ink Grade Stamp */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div className={`teacher-stamp ${score >= 70 ? 'approved' : ''}`} style={{ fontSize: '15px' }}>
          GRADE: {letterGrade} {score >= 80 ? '🍎' : '⚠️'}
        </div>
      </div>

      <div style={{
        fontSize: '13px',
        fontFamily: 'var(--font-handwriting)',
        color: 'var(--text-secondary)',
        marginTop: '8px',
        maxWidth: '240px',
        lineHeight: 1.4,
      }}>
        {subtitle}
      </div>
    </div>
  );
};
