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
      height: '72px',
      borderBottom: '4px solid #5C3A21',
      backgroundColor: 'var(--bg-chalkboard-dark)',
      backgroundImage: 'linear-gradient(180deg, rgba(30, 48, 38, 0.95) 0%, rgba(18, 29, 22, 0.98) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
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
          width: '42px',
          height: '42px',
          borderRadius: '8px',
          backgroundColor: '#351E0E',
          border: '2px solid #704727',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
        }}>
          <span style={{ fontSize: '22px' }}>✏️</span>
        </div>
        <div>
          <div style={{
            fontSize: '18px',
            fontWeight: '700',
            fontFamily: 'var(--font-chalk)',
            color: 'var(--chalk-yellow)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textShadow: '0 0 2px rgba(254, 240, 138, 0.6)',
          }}>
            Pen Flip Aura Calculator
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--font-typewriter)',
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
              color: '#F87171',
              border: '1px solid #DC2626',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}>
              ROOM 204 · PERIOD 3
            </span>
          </div>
          <div style={{
            fontSize: '12px',
            fontFamily: 'var(--font-handwriting)',
            color: 'var(--text-secondary)',
            marginTop: '-2px',
          }}>
            Chalkboard Physics & Back-Row Kinematic Engine
          </div>
        </div>
      </div>

      {/* Center: Navigation - Wooden Desk Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#16241C',
        padding: '5px 8px',
        borderRadius: '8px',
        border: '1px solid var(--border-chalk)',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
      }}>
        <button
          onClick={() => onSelectTab('home')}
          style={{
            background: currentTab === 'home' || currentTab === 'upload' ? 'linear-gradient(180deg, #FEF08A 0%, #FACC15 100%)' : 'transparent',
            color: currentTab === 'home' || currentTab === 'upload' ? '#1A1805' : 'var(--chalk-white)',
            border: currentTab === 'home' || currentTab === 'upload' ? '1px solid #CA8A04' : '1px solid transparent',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: '700',
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: currentTab === 'home' || currentTab === 'upload' ? '0 2px 6px rgba(0,0,0,0.3)' : 'none',
          }}
        >
          🪑 Desk Upload
        </button>

        <button
          onClick={() => onSelectTab('analysis')}
          disabled={!hasAnalysis && currentTab !== 'analysis'}
          style={{
            background: currentTab === 'analysis' ? 'linear-gradient(180deg, #93C5FD 0%, #60A5FA 100%)' : 'transparent',
            color: currentTab === 'analysis' ? '#0F172A' : (hasAnalysis ? 'var(--chalk-white)' : 'var(--text-muted)'),
            border: currentTab === 'analysis' ? '1px solid #3B82F6' : '1px solid transparent',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: '700',
            fontFamily: 'var(--font-sans)',
            cursor: hasAnalysis || currentTab === 'analysis' ? 'pointer' : 'not-allowed',
            opacity: hasAnalysis || currentTab === 'analysis' ? 1 : 0.45,
            transition: 'all 0.15s ease',
            boxShadow: currentTab === 'analysis' ? '0 2px 6px rgba(0,0,0,0.3)' : 'none',
          }}
        >
          👨‍🏫 Chalkboard Spin
        </button>

        <button
          onClick={() => onSelectTab('results')}
          disabled={!hasAnalysis}
          style={{
            background: currentTab === 'results' || currentTab === 'replay' ? 'linear-gradient(180deg, #86EFAC 0%, #4ADE80 100%)' : 'transparent',
            color: currentTab === 'results' || currentTab === 'replay' ? '#064E3B' : (hasAnalysis ? 'var(--chalk-white)' : 'var(--text-muted)'),
            border: currentTab === 'results' || currentTab === 'replay' ? '1px solid #16A34A' : '1px solid transparent',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: '700',
            fontFamily: 'var(--font-sans)',
            cursor: hasAnalysis ? 'pointer' : 'not-allowed',
            opacity: hasAnalysis ? 1 : 0.45,
            transition: 'all 0.15s ease',
            boxShadow: currentTab === 'results' || currentTab === 'replay' ? '0 2px 6px rgba(0,0,0,0.3)' : 'none',
          }}
        >
          📝 Report Card
        </button>
      </nav>

      {/* Right: API Mode / Environment Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onToggleMock}
          title="Toggle between Live Server and Offline Pencil Box Sim"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '6px',
            background: isMockMode ? '#3A2616' : 'rgba(74, 222, 128, 0.15)',
            border: `1px solid ${isMockMode ? '#704727' : 'rgba(74, 222, 128, 0.4)'}`,
            color: isMockMode ? '#FEF08A' : '#86EFAC',
            fontSize: '12px',
            fontFamily: 'var(--font-typewriter)',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
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
