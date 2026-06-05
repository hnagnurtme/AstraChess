import React from 'react';
import { 
  FaChess, FaPlay, FaBolt, FaCircle, 
  FaInfoCircle, FaTrophy, FaRobot, FaBrain, FaUser, FaHistory, FaSignOutAlt 
} from 'react-icons/fa';
import { UserSession } from '../api/api';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

interface LandingPageProps {
  onPlay: () => void;
  onNavToHistory: () => void;
  onNavToLeaderboard: () => void;
  onOpenAuth: () => void;
  user: UserSession | null;
  onLogout: () => void;
}

export function LandingPage({ onPlay, onNavToHistory, onNavToLeaderboard, onOpenAuth, user, onLogout }: LandingPageProps) {
  const { t } = useLanguage();

  return (
    <div className="landing-page">
      {/* ── Navbar ── */}
      <header className="header header-landing">
        <div className="header-logo">
          <img src="/logo.png" alt="AstraChess Logo" className="logo-img-header" onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }} />
          <div>
            <div className="header-title">ASTRACHESS</div>
            <div className="header-subtitle">Play vs AI Engine</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="header-nav">
          <button className="nav-link active">{t.home}</button>
          <button className="nav-link" onClick={onPlay}>{t.play}</button>
          <button className="nav-link" onClick={onNavToHistory}>{t.history}</button>
          <button className="nav-link" onClick={onNavToLeaderboard}>{t.leaderboard}</button>
        </nav>

        {/* Auth status on right */}
        <div className="header-auth-controls">
          <LanguageSelector />
          {user ? (
            <div className="user-profile-badge-container">
              <span className="user-profile-badge">
                <span className="profile-avatar">{user.avatar}</span> {user.fullname.toUpperCase()}
              </span>
              <button className="btn btn-white btn-logout-nav" onClick={onLogout} title={t.logout}>
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <button className="btn btn-yellow btn-login-nav" onClick={onOpenAuth}>
              {t.login}
            </button>
          )}
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">{t.heroBadge}</div>
            <h1 className="hero-title">
              {t.heroTitle1} <span className="highlight">{t.heroTitleHighlight}</span> {t.heroTitle2}
            </h1>
            <p className="hero-description">
              {t.heroDesc}
            </p>
            <div className="hero-actions">
              <button className="btn btn-yellow btn-large" onClick={onPlay}>
                <FaPlay /> {t.btnPlayNow}
              </button>
              <a href="#engines" className="btn btn-white btn-large">
                <FaInfoCircle /> {t.btnExploreEngines}
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-container card">
              <div className="visual-header">
                <div className="window-dots">
                  <span className="dot red-dot"></span>
                  <span className="dot yellow-dot"></span>
                  <span className="dot green-dot"></span>
                </div>
                <div className="window-title">astrachess_preview.exe</div>
              </div>
              <div className="visual-body">
                <img src="/logo.png" alt="AstraChess Logo Large" className="hero-logo-large" />
                <div className="mini-chessboard">
                  {/* Decorative checker pattern */}
                  {Array.from({ length: 16 }).map((_, i) => {
                    const row = Math.floor(i / 4);
                    const col = i % 4;
                    const isDark = (row + col) % 2 === 1;
                    return (
                      <div 
                        key={i} 
                        className={`mini-square ${isDark ? 'dark' : 'light'}`}
                      >
                        {i === 5 && <span className="mini-piece">♔</span>}
                        {i === 10 && <span className="mini-piece">♘</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="visual-stats">
                  <span>Engine Depth: 6 Plies</span>
                  <span>|</span>
                  <span>Evaluation: +0.45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Engines Section ── */}
      <section id="engines" className="engines-section">
        <div className="section-header">
          <h2 className="section-title">{t.enginesTitle}</h2>
          <p className="section-subtitle">{t.enginesSubtitle}</p>
        </div>

        <div className="engines-grid">
          {/* Engine Casual */}
          <div className="engine-card card">
            <div className="engine-card-header cls-v1">
              <span className="engine-badge">V1</span>
              <h3>CASUAL ENGINE</h3>
            </div>
            <div className="engine-card-body">
              <p className="engine-desc">
                {t.engineCasualDesc}
              </p>
              <ul className="engine-features">
                <li>{t.engineCasualFeature1}</li>
                <li>{t.engineCasualFeature2}</li>
                <li>{t.engineCasualFeature3}</li>
              </ul>
            </div>
          </div>

          {/* Engine Tactical */}
          <div className="engine-card card">
            <div className="engine-card-header cls-v2">
              <span className="engine-badge">V2</span>
              <h3>TACTICAL ENGINE</h3>
            </div>
            <div className="engine-card-body">
              <p className="engine-desc">
                {t.engineTacticalDesc}
              </p>
              <ul className="engine-features">
                <li>{t.engineTacticalFeature1}</li>
                <li>{t.engineTacticalFeature2}</li>
                <li>{t.engineTacticalFeature3}</li>
              </ul>
            </div>
          </div>

          {/* Engine VIP */}
          <div className="engine-card card card-vip-highlight">
            <div className="engine-card-header cls-vip">
              <span className="engine-badge badge-vip">VIP</span>
              <h3>MASTER ENGINE</h3>
            </div>
            <div className="engine-card-body">
              <p className="engine-desc">
                {t.engineMasterDesc}
              </p>
              <ul className="engine-features">
                <li>{t.engineMasterFeature1}</li>
                <li>{t.engineMasterFeature2}</li>
                <li>{t.engineMasterFeature3}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Guidelines Section ── */}
      <section className="guide-section">
        <div className="guide-grid">
          <div className="guide-info card">
            <h3>{t.guideTitle}</h3>
            <div className="guide-steps">
              <div className="guide-step">
                <span className="step-num">1</span>
                <div>
                  <strong>{t.guideStep1Title}</strong>
                  <p>{t.guideStep1Desc}</p>
                </div>
              </div>
              <div className="guide-step">
                <span className="step-num">2</span>
                <div>
                  <strong>{t.guideStep2Title}</strong>
                  <p>{t.guideStep2Desc}</p>
                </div>
              </div>
              <div className="guide-step">
                <span className="step-num">3</span>
                <div>
                  <strong>{t.guideStep3Title}</strong>
                  <p>{t.guideStep3Desc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="system-stats card">
            <h3>{t.sysStatusTitle}</h3>
            <div className="sys-stats-grid">
              <div className="sys-stat-item">
                <span className="sys-label">{t.sysStatusLabel}</span>
                <span className="sys-value text-green"><FaCircle className="pulse-icon" /> {t.sysOnline}</span>
              </div>
              <div className="sys-stat-item">
                <span className="sys-label">{t.sysLatencyLabel}</span>
                <span className="sys-value">~120ms</span>
              </div>
              <div className="sys-stat-item">
                <span className="sys-label">{t.sysMaxDepthLabel}</span>
                <span className="sys-value">12 Plies</span>
              </div>
              <div className="sys-stat-item">
                <span className="sys-label">{t.sysEnginesLabel}</span>
                <span className="sys-value">{t.sysLoaded}</span>
              </div>
            </div>
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button className="btn btn-yellow" style={{ width: '100%' }} onClick={onPlay}>
                {t.btnPlayNow}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer footer-landing">
        <span>{t.footerTitle}</span>
        <span>
          Documentation:{' '}
          <a href="/docs" target="_blank" rel="noreferrer">
            Swagger API Docs
          </a>
        </span>
      </footer>
    </div>
  );
}
