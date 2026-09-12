import React from 'react';
import { Radio, Cpu, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'upload' | 'analysis' | 'results' | 'replay';
  onSelectTab: (tab: 'home' | 'upload' | 'analysis' | 'results' | 'replay') => void;
  hasAnalysis: boolean;
  isMockMode: boolean;
  onToggleMock: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  hasAnalysis,
  isMockMode,
  onToggleMock,
}) => {
  return (
    <header style={{
      height: '68px',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Left: Logo + Wordmark */}
      <div 
        onClick={() => onSelectTab('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          backgroundColor: 'rgba(0, 255, 136, 0.12)',
          border: '1px solid rgba(0, 255, 136, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00FF88',
          boxShadow: '0 0 16px rgba(0, 255, 136, 0.25)',
        }}>
          <span style={{ fontSize: '18px' }}>✏️</span>
        </div>
        <div>
          <div style={{
            fontSize: '15px',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            Pen Flip Aura Calculator
            <span style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(0, 240, 255, 0.12)',
              color: '#00F0FF',
              border: '1px solid rgba(0, 240, 255, 0.35)',
              boxShadow: '0 0 8px rgba(0, 240, 255, 0.2)',
              fontWeight: 800,
              letterSpacing: '0.05em',
            }}>
              PERIOD 3 · PHYSICS HUD
            </span>
          </div>
          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            marginTop: '-2px',
          }}>
            Back-Row Desk Telemetry & Angular Momentum Engine
          </div>
        </div>
      </div>

      {/* Center: Navigation */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: 'var(--bg-secondary)',
        padding: '4px',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
      }}>
        <button
          onClick={() => onSelectTab('home')}
          style={{
            background: currentTab === 'home' || currentTab === 'upload' ? 'var(--bg-card)' : 'transparent',
            color: currentTab === 'home' || currentTab === 'upload' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: currentTab === 'home' || currentTab === 'upload' ? '1px solid var(--border-subtle)' : '1px solid transparent',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Desk Upload 🪑
        </button>

        <button
          onClick={() => onSelectTab('analysis')}
          disabled={!hasAnalysis && currentTab !== 'analysis'}
          style={{
            background: currentTab === 'analysis' ? 'var(--bg-card)' : 'transparent',
            color: currentTab === 'analysis' ? 'var(--accent-blue)' : (hasAnalysis ? 'var(--text-secondary)' : 'var(--text-muted)'),
            border: currentTab === 'analysis' ? '1px solid var(--border-subtle)' : '1px solid transparent',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: hasAnalysis || currentTab === 'analysis' ? 'pointer' : 'not-allowed',
            opacity: hasAnalysis || currentTab === 'analysis' ? 1 : 0.4,
            transition: 'all 0.15s ease',
          }}
        >
          Teacher Turnaround 👨‍🏫
        </button>

        <button
          onClick={() => onSelectTab('results')}
          disabled={!hasAnalysis}
          style={{
            background: currentTab === 'results' || currentTab === 'replay' ? 'var(--bg-card)' : 'transparent',
            color: currentTab === 'results' || currentTab === 'replay' ? 'var(--accent-purple)' : (hasAnalysis ? 'var(--text-secondary)' : 'var(--text-muted)'),
            border: currentTab === 'results' || currentTab === 'replay' ? '1px solid var(--border-subtle)' : '1px solid transparent',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: hasAnalysis ? 'pointer' : 'not-allowed',
            opacity: hasAnalysis ? 1 : 0.4,
            transition: 'all 0.15s ease',
          }}
        >
          Pop Quiz Report Card 📝
        </button>
      </nav>

      {/* Right: API Mode / Environment Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onToggleMock}
          title="Toggle between Backend Live API and Simulated Local Engine"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: isMockMode ? 'rgba(254, 240, 138, 0.1)' : 'rgba(90, 228, 168, 0.1)',
            border: `1px solid ${isMockMode ? 'rgba(254, 240, 138, 0.3)' : 'rgba(90, 228, 168, 0.3)'}`,
            color: isMockMode ? '#FEF08A' : 'var(--status-success)',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {isMockMode ? <Cpu size={14} /> : <Radio size={14} />}
          <span>{isMockMode ? 'PENCIL BOX SIM' : 'LIVE CHALKBOARD'}</span>
          <RefreshCw size={12} style={{ marginLeft: '4px', opacity: 0.7 }} />
        </button>
      </div>
    </header>
  );
};
