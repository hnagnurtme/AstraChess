import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaTrophy, FaSignOutAlt, FaChess, FaPlay } from 'react-icons/fa';
import { getLeaderboard, LeaderboardEntry, UserSession } from '../api/api';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

interface LeaderboardPageProps {
  onBack: () => void;
  onPlay: () => void;
  onNavToHistory: () => void;
  onOpenAuth: () => void;
  user: UserSession | null;
  onLogout: (direct?: boolean) => void;
}

export function LeaderboardPage({
  onBack,
  onPlay,
  onNavToHistory,
  onOpenAuth,
  user,
  onLogout
}: LeaderboardPageProps) {
  const { t, language } = useLanguage();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err: any) {
        setError(t.leaderboardError);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [t.leaderboardError]);

  return (
    <div className="page">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-logo">
          <button className="btn-back-home" onClick={onBack} title={language === 'vi' ? 'Quay về trang chủ' : 'Back to home'}>
            <FaArrowLeft />
          </button>
          <img src="/logo.png" alt="AstraChess Logo" className="logo-img-header" onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }} />
          <div>
            <div className="header-title">{t.leaderboardPageTitle}</div>
            <div className="header-subtitle">{t.leaderboardPageSubtitle}</div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="header-nav">
          <button className="nav-link" onClick={onBack}>{t.home}</button>
          <button className="nav-link" onClick={onPlay}>{t.play}</button>
          <button className="nav-link" onClick={onNavToHistory}>{t.history}</button>
          <button className="nav-link active">{t.leaderboard}</button>
        </nav>

        {/* Auth controls */}
        <div className="header-auth-controls">
          <LanguageSelector />
          {user ? (
            <div className="user-profile-badge-container">
              <span className="user-profile-badge">
                <span className="profile-avatar">{user.avatar}</span> {user.fullname.toUpperCase()}
              </span>
              <button className="btn btn-white btn-logout-nav" onClick={() => onLogout(false)} title={t.logout}>
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

      {/* ── Main Layout ── */}
      <main className="history-main-layout">
        <div className="history-container">
          <div className="history-header-actions">
            <h2><FaTrophy /> {t.leaderboardPageHeader}</h2>
            <div className="leaderboard-info-pill">
              {t.leaderboardInfoPill}
            </div>
          </div>

          {loading ? (
            <div className="history-empty-card card">
              <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px auto' }} />
              <h3>{t.leaderboardLoading}</h3>
            </div>
          ) : error ? (
            <div className="history-empty-card card" style={{ borderColor: 'var(--red)' }}>
              <div className="empty-icon" style={{ color: 'var(--red)' }}>⚠️</div>
              <h3>{language === 'vi' ? 'Có lỗi xảy ra' : 'An error occurred'}</h3>
              <p>{error}</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="history-empty-card card">
              <div className="empty-icon"><FaChess /></div>
              <h3>{t.leaderboardEmpty}</h3>
              <p>{language === 'vi' ? 'Hãy là người đầu tiên đăng ký tài khoản và chinh phục vị trí số 1!' : 'Be the first to register an account and claim the 1st position!'}</p>
              <button className="btn btn-yellow btn-large" style={{ marginTop: '20px' }} onClick={onPlay}>
                <FaPlay /> {t.leaderboardEmptyBtn}
              </button>
            </div>
          ) : (
            <div className="history-table-wrapper card">
              <table className="history-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px', textAlign: 'center' }}>{t.leaderboardTableColRank}</th>
                    <th>{t.leaderboardTableColPlayer}</th>
                    <th style={{ textAlign: 'center' }}>{t.winStat}</th>
                    <th style={{ textAlign: 'center' }}>{t.drawStat}</th>
                    <th style={{ textAlign: 'center' }}>{t.lossStat}</th>
                    <th style={{ textAlign: 'center' }}>{t.leaderboardTableColScore}</th>
                    <th style={{ textAlign: 'center' }}>{t.leaderboardTableColWinRate}</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, idx) => {
                    const rank = idx + 1;
                    const totalGames = player.wins + player.losses + player.draws;
                    const winRate = totalGames > 0 ? ((player.wins / totalGames) * 100).toFixed(1) : '0.0';

                    let rankBadge = '';
                    let rowClass = '';
                    if (rank === 1) {
                      rankBadge = '🥇';
                      rowClass = 'rank-gold';
                    } else if (rank === 2) {
                      rankBadge = '🥈';
                      rowClass = 'rank-silver';
                    } else if (rank === 3) {
                      rankBadge = '🥉';
                      rowClass = 'rank-bronze';
                    }

                    const isSelf = user?.username.toLowerCase() === player.username.toLowerCase();
                    const selfClass = isSelf ? 'rank-self' : '';

                    return (
                      <tr key={player.username} className={`${rowClass} ${selfClass}`}>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                          {rankBadge ? <span className="rank-emoji-badge">{rankBadge}</span> : rank}
                        </td>
                        <td>
                          <div className="leaderboard-player-cell">
                            <span className="leaderboard-player-avatar">{player.avatar}</span>
                            <div className="leaderboard-player-names">
                              <span className="leaderboard-player-fullname">{player.fullname}</span>
                              <span className="leaderboard-player-username">@{player.username}</span>
                            </div>
                            {isSelf && <span className="self-tag-badge">{t.leaderboardSelfTag}</span>}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }} className="font-mono text-green">{player.wins}</td>
                        <td style={{ textAlign: 'center' }} className="font-mono text-yellow">{player.draws}</td>
                        <td style={{ textAlign: 'center' }} className="font-mono text-red">{player.losses}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }} className="font-mono">
                          {player.score}{language === 'vi' ? 'đ' : ' pts'}
                        </td>
                        <td style={{ textAlign: 'center' }} className="font-mono">{winRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
