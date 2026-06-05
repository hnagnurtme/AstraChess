import React from 'react';
import { 
  FaBolt, FaPalette, FaChartBar, FaTrophy, 
  FaSkull, FaHandshake, FaChess, FaRobot, 
  FaChessKing, FaChessQueen 
} from 'react-icons/fa';
import { Difficulty, LastStats, DIFFICULTIES, formatMs } from '../hooks/useChessGame';
import { useLanguage } from '../context/LanguageContext';

// ── 1. Difficulty Selector ──
interface DifficultySelectorProps {
  activeDifficulty: Difficulty;
  onSelect: (d: Difficulty) => void;
}

export function DifficultySelector({ activeDifficulty, onSelect }: DifficultySelectorProps) {
  const { t } = useLanguage();

  const getDifficultyDesc = (key: string, defaultDesc: string) => {
    if (key === 'v1') return t.engineCasualDesc;
    if (key === 'v2') return t.engineTacticalDesc;
    if (key === 'vip') return t.engineMasterDesc;
    return defaultDesc;
  };

  return (
    <div className="sidebar-section">
      <div className="sidebar-section-title">
        <FaBolt /> {t.difficultyLabel}
      </div>
      <div className="difficulty-grid">
        {DIFFICULTIES.map((d) => {
          const localizedDesc = getDifficultyDesc(d.key, d.desc);
          return (
            <button
              key={d.key}
              className={`difficulty-btn ${d.cls} ${
                activeDifficulty.key === d.key ? 'active' : ''
              }`}
              onClick={() => onSelect(d)}
              title={localizedDesc}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{d.label}</span>
                <span className="diff-badge">{d.badge}</span>
              </div>
              <div className="diff-desc">{localizedDesc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 2. Color Selector ──
interface ColorSelectorProps {
  playerColor: 'white' | 'black';
  onSelect: (color: 'white' | 'black') => void;
}

export function ColorSelector({ playerColor, onSelect }: ColorSelectorProps) {
  const { t } = useLanguage();

  return (
    <div className="sidebar-section">
      <div className="sidebar-section-title">
        <FaPalette /> {t.colorLabel}
      </div>
      <div className="color-picker">
        <button
          className={`color-opt ${playerColor === 'white' ? 'selected' : ''}`}
          onClick={() => onSelect('white')}
        >
          <FaChessKing /> {t.colorWhite}
        </button>
        <button
          className={`color-opt ${playerColor === 'black' ? 'selected' : ''}`}
          onClick={() => onSelect('black')}
        >
          <FaChessQueen /> {t.colorBlack}
        </button>
      </div>
    </div>
  );
}

// ── 3. Stats Grid ──
interface StatsGridProps {
  wins: number;
  losses: number;
  draws: number;
}

export function StatsGrid({ wins, losses, draws }: StatsGridProps) {
  const { t, language } = useLanguage();
  const total = wins + losses + draws;

  return (
    <div className="sidebar-section">
      <div className="sidebar-section-title">
        <FaChartBar /> {language === 'vi' ? 'KẾT QUẢ ĐẤU' : 'MATCH RESULTS'}
      </div>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">
            <FaTrophy /> {t.winStat}
          </div>
          <div className="stat-value green">{wins}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">
            <FaSkull /> {t.lossStat}
          </div>
          <div className="stat-value red">{losses}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">
            <FaHandshake /> {t.drawStat}
          </div>
          <div className="stat-value yellow">{draws}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">
            <FaChess /> {language === 'vi' ? 'Tổng' : 'Total'}
          </div>
          <div className="stat-value">{total}</div>
        </div>
      </div>
    </div>
  );
}

// ── 4. Bot Stats ──
interface BotStatsProps {
  lastStats: LastStats | null;
}

export function BotStats({ lastStats }: BotStatsProps) {
  const { language } = useLanguage();
  if (!lastStats) return null;

  return (
    <div className="sidebar-section card-yellow bot-stats-sidebar">
      <div className="sidebar-section-title">
        <FaRobot /> {language === 'vi' ? 'THÔNG SỐ BOT' : 'BOT STATS'}
      </div>
      <div className="last-stats-content">
        <div className="stat-row">
          <span>Engine:</span>
          <strong>{lastStats.engine?.toUpperCase() || '—'}</strong>
        </div>
        <div className="stat-row">
          <span>Nodes:</span>
          <strong>
            {lastStats.nodes != null ? lastStats.nodes.toLocaleString() : '—'}
          </strong>
        </div>
        <div className="stat-row">
          <span>{language === 'vi' ? 'Thời gian:' : 'Time:'}</span>
          <strong>{formatMs(lastStats.elapsed_ms ?? null)}</strong>
        </div>
      </div>
    </div>
  );
}
