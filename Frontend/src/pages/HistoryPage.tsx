import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaTrash, FaChess, FaPlay, FaHistory, FaSignOutAlt } from 'react-icons/fa';
import { ConfirmationModal } from '../components/GameModals';
import { UserSession, getMatchHistory, clearMatchHistory, MatchListItem } from '../api/api';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

interface HistoryPageProps {
  onBack: () => void;
  onPlay: () => void;
  onNavToLeaderboard: () => void;
  user: UserSession | null;
  onOpenAuth: () => void;
  onLogout: (direct?: boolean) => void;
}

export function HistoryPage({
  onBack,
  onPlay,
  onNavToLeaderboard,
  user,
  onOpenAuth,
  onLogout
}: HistoryPageProps) {
  const { t, language } = useLanguage();
  const [history, setHistory] = useState<MatchListItem[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadHistory() {
      if (user && user.username !== 'guest') {
        try {
          setLoading(true);
          const data = await getMatchHistory(user.username);
          setHistory(data);
        } catch (err) {
          console.error('Lỗi khi tải lịch sử:', err);
        } finally {
          setLoading(false);
        }
      } else {
        const historyStr = localStorage.getItem('astrachess_history');
        if (historyStr) {
          setHistory(JSON.parse(historyStr));
        } else {
          setHistory([]);
        }
      }
    }
    loadHistory();
  }, [user]);

  const handleClearAll = () => {
    setShowClearConfirm(true);
  };

  const confirmClearAll = async () => {
    if (user && user.username !== 'guest') {
      try {
        await clearMatchHistory(user.username);
        setHistory([]);
      } catch (err) {
        console.error('Lỗi khi xóa lịch sử:', err);
      }
    } else {
      localStorage.removeItem('astrachess_history');
      setHistory([]);
    }
    setShowClearConfirm(false);
  };

  const handleDeleteItem = (id: string) => {
    if (user && user.username !== 'guest') return; // Khóa chức năng xóa từng trận khi chơi tài khoản DB để tránh lệch stats
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem('astrachess_history', JSON.stringify(updated));
    setHistory(updated);
  };

  const isLocalHistory = !user || user.username === 'guest';

  return (
    <div className="page">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-logo">
          <button className="btn-back-home" onClick={onBack} title={language === 'vi' ? 'Quay lại' : 'Back'}>
            <FaArrowLeft />
          </button>
          <img src="/logo.png" alt="AstraChess Logo" className="logo-img-header" onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }} />
          <div>
            <div className="header-title">{t.historyPageTitle}</div>
            <div className="header-subtitle">{t.historyPageSubtitle}</div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="header-nav">
          <button className="nav-link" onClick={onBack}>{t.home}</button>
          <button className="nav-link" onClick={onPlay}>{t.play}</button>
          <button className="nav-link active">{t.history}</button>
          <button className="nav-link" onClick={onNavToLeaderboard}>{t.leaderboard}</button>
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

      {/* ── Main Area ── */}
      <main className="history-main-layout">
        <div className="history-container">
          <div className="history-header-actions">
            <h2><FaHistory /> {t.historyPageHeader}</h2>
            {history.length > 0 && (
              <button className="btn btn-red btn-clear-all" onClick={handleClearAll}>
                <FaTrash /> {t.btnClearHistory}
              </button>
            )}
          </div>

          {loading ? (
            <div className="history-empty-card card">
              <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px auto' }} />
              <h3>{language === 'vi' ? 'Đang tải lịch sử đấu...' : 'Loading match history...'}</h3>
            </div>
          ) : history.length === 0 ? (
            <div className="history-empty-card card">
              <div className="empty-icon"><FaChess /></div>
              <h3>{t.historyEmptyCardTitle}</h3>
              <p>{t.historyEmptyCardDesc}</p>
              <button className="btn btn-yellow btn-large" style={{ marginTop: '20px' }} onClick={onPlay}>
                <FaPlay /> {language === 'vi' ? 'ĐẤU VỚI BOT NGAY' : 'PLAY BOT NOW'}
              </button>
            </div>
          ) : (
            <div className="history-table-wrapper card">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>{t.historyTableColSTT}</th>
                    <th>{t.historyTableColDate}</th>
                    <th>{t.historyTableColDiff}</th>
                    <th>{t.historyTableColColor}</th>
                    <th>{t.historyTableColMoves}</th>
                    <th>{t.historyTableColResult}</th>
                    {isLocalHistory && <th style={{ textAlign: 'center' }}>{t.historyTableColActions}</th>}
                  </tr>
                </thead>
                <tbody>
                  {history.map((match, idx) => {
                    // Normalize result
                    const displayResult = 
                      match.result === 'Thắng' || match.result === 'Won' || match.result === 'win' ? t.outcomeWin :
                      match.result === 'Thua' || match.result === 'Lost' || match.result === 'loss' ? t.outcomeLoss :
                      t.outcomeDraw;

                    // Normalize result color class
                    const resultClass = 
                      match.result === 'Thắng' || match.result === 'Won' || match.result === 'win' ? 'outcome-win' : 
                      match.result === 'Thua' || match.result === 'Lost' || match.result === 'loss' ? 'outcome-loss' : 'outcome-draw';

                    // Normalize playing side display
                    const displayColor = 
                      match.playerColor === 'Trắng' || match.playerColor === 'White' || match.playerColor === 'white' 
                        ? t.colorWhite 
                        : t.colorBlack;

                    // Normalize difficulty display
                    const displayDiff = 
                      match.difficulty.includes('Casual') || match.difficulty.includes('v1') ? 'v1 (Casual)' :
                      match.difficulty.includes('Tactical') || match.difficulty.includes('v2') ? 'v2 (Tactical)' :
                      'VIP (Master)';

                    return (
                      <tr key={match.id}>
                        <td>{idx + 1}</td>
                        <td className="font-mono">{match.date}</td>
                        <td>
                          <span className="history-diff-badge">{displayDiff}</span>
                        </td>
                        <td>{displayColor}</td>
                        <td className="font-mono">
                          {match.movesCount} {language === 'vi' ? 'nước' : 'moves'}
                        </td>
                        <td>
                          <span className={`outcome-badge ${resultClass}`}>
                            {displayResult}
                          </span>
                        </td>
                        {isLocalHistory && (
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              className="btn-delete-item" 
                              onClick={() => handleDeleteItem(match.id)}
                              title={language === 'vi' ? 'Xóa trận này' : 'Delete this match'}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <ConfirmationModal
        show={showClearConfirm}
        onConfirm={confirmClearAll}
        onCancel={() => setShowClearConfirm(false)}
        title={t.confirmClearHistoryTitle}
        message={
          user && user.username !== 'guest'
            ? (language === 'vi' 
                ? "Bạn có chắc chắn muốn xóa toàn bộ lịch sử đấu? Hành động này sẽ đặt lại thành tích (Thắng/Thua/Hòa) của bạn về 0 trên Bảng Xếp Hạng."
                : "Are you sure you want to clear all match history? This will reset your stats (Wins/Losses/Draws) to 0 on the Leaderboard.")
            : t.confirmClearHistoryMessage
        }
      />
    </div>
  );
}
