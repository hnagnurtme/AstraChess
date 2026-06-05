import React, { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { FaArrowLeft, FaRedo, FaUndo, FaSignOutAlt } from 'react-icons/fa';
import useChessGame, { Difficulty } from '../hooks/useChessGame';
import { ChessClock } from '../components/ChessClock';
import { MoveHistory } from '../components/MoveHistory';
import { 
  DifficultySelector, 
  ColorSelector
} from '../components/Controls';
import { 
  GameResultModal, 
  ConfirmationModal, 
  PromotionModal 
} from '../components/GameModals';
import { ToastContainer, ToastItem } from '../components/Toast';
import { UserSession, saveMatch } from '../api/api';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

interface ChessGamePageProps {
  onBack: () => void;
  onNavToHistory: () => void;
  onNavToLeaderboard: () => void;
  onOpenAuth: () => void;
  user: UserSession | null;
  onLogout: (direct?: boolean) => void;
}

export function ChessGamePage({ onBack, onNavToHistory, onNavToLeaderboard, onOpenAuth, user, onLogout }: ChessGamePageProps) {
  const { t, language } = useLanguage();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [gameKey, setGameKey] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<'difficulty' | 'color' | 'resign' | null>(null);
  const [pendingValue, setPendingValue] = useState<any>(null);

  const addToast = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const chess = useChessGame({ onToast: addToast });

  const {
    difficulty,
    setDifficulty,
    playerColor,
    setPlayerColor,
    wins,
    losses,
    draws,
    moveHistory,
    thinking,
    banner,
    fen,
    onDrop,
    boardOrientation,
    customSquareStyles,
    newGame: originalNewGame,
    undo,
    canUndo,
    gameResult,
    game,
    handleTimeLoss,
    pendingPromotion,
    resolvePromotion,
    cancelPromotion,
  } = chess;

  // Auto-save completed games to Match History database/localstorage
  useEffect(() => {
    if (gameResult) {
      const matchId = `match_${Date.now()}`;
      const matchDate = new Date().toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      const matchDifficulty = difficulty.label;
      const matchColor = playerColor === 'white' ? 'Trắng' : 'Đen';
      const matchResultText = gameResult === 'win' ? 'Thắng' : gameResult === 'loss' ? 'Thua' : 'Hòa';

      const newMatch = {
        id: matchId,
        date: matchDate,
        difficulty: matchDifficulty,
        playerColor: matchColor,
        result: matchResultText,
        movesCount: moveHistory.length,
      };

      async function persistMatch() {
        if (user && user.username !== 'guest') {
          try {
            await saveMatch({
              id: matchId,
              username: user.username,
              date: matchDate,
              difficulty: matchDifficulty,
              playerColor: matchColor,
              result: matchResultText,
              movesCount: moveHistory.length
            });
            addToast(t.toastSaveSuccess, 'success');
          } catch (err) {
            console.error('Lỗi khi lưu lịch sử lên server:', err);
            addToast(t.toastSaveFailedLocal, 'error');
            saveLocally(newMatch);
          }
        } else {
          saveLocally(newMatch);
        }
      }

      function saveLocally(match: any) {
        try {
          const historyStr = localStorage.getItem('astrachess_history');
          const history = historyStr ? JSON.parse(historyStr) : [];
          localStorage.setItem('astrachess_history', JSON.stringify([match, ...history]));
          addToast(t.toastSaveLocal, 'success');
        } catch (err) {
          console.error('Lỗi khi lưu lịch sử cục bộ:', err);
        }
      }

      persistMatch();
    }
  }, [gameResult, user, difficulty, playerColor, moveHistory.length, addToast, t]);

  const handleTimeOut = useCallback((who: 'player' | 'bot') => {
    if (gameResult) return;
    if (who === 'player') {
      handleTimeLoss('player');
      addToast(t.toastTimeoutLoss, 'error');
    } else {
      handleTimeLoss('bot');
      addToast(t.toastTimeoutWin, 'success');
    }
  }, [gameResult, handleTimeLoss, addToast, t]);

  const handleResign = useCallback(() => {
    setPendingAction('resign');
    setShowConfirmModal(true);
  }, []);

  const newGame = useCallback(() => {
    originalNewGame();
    setGameKey((prev) => prev + 1);
  }, [originalNewGame]);

  const handleCloseResultModal = useCallback(() => {
    if (user && user.username === 'guest') {
      onLogout(true); // Logs guest out directly and redirects/opens AuthModal
      addToast(t.toastGuestTrialFinished, 'info');
    } else {
      newGame();
    }
  }, [user, onLogout, newGame, addToast, t]);

  const handleSetDifficulty = useCallback((d: Difficulty) => {
    if (moveHistory.length > 0) {
      setPendingAction('difficulty');
      setPendingValue(d);
      setShowConfirmModal(true);
    } else {
      setDifficulty(d);
      setGameKey((prev) => prev + 1);
    }
  }, [setDifficulty, moveHistory]);

  const handleSetPlayerColor = useCallback((color: 'white' | 'black') => {
    if (moveHistory.length > 0) {
      setPendingAction('color');
      setPendingValue(color);
      setShowConfirmModal(true);
    } else {
      setPlayerColor(color);
      setGameKey((prev) => prev + 1);
    }
  }, [setPlayerColor, moveHistory]);

  const handleConfirm = useCallback(() => {
    if (pendingAction === 'difficulty') {
      setDifficulty(pendingValue);
      originalNewGame();
      setGameKey((prev) => prev + 1);
    } else if (pendingAction === 'color') {
      setPlayerColor(pendingValue);
      originalNewGame();
      setGameKey((prev) => prev + 1);
    } else if (pendingAction === 'resign') {
      handleTimeLoss('player');
      addToast(t.toastResignLoss, 'error');
    }
    setShowConfirmModal(false);
    setPendingAction(null);
    setPendingValue(null);
  }, [pendingAction, pendingValue, setDifficulty, setPlayerColor, originalNewGame, handleTimeLoss, addToast, t]);

  const handleCancel = useCallback(() => {
    setShowConfirmModal(false);
    setPendingAction(null);
    setPendingValue(null);
  }, []);

  const currentTurn = game.turn() === 'w' ? 'white' : 'black';

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
            <div className="header-title">{t.gameTitle}</div>
            <div className="header-subtitle">{t.gameSubtitle}</div>
          </div>
        </div>

        {/* Navigation links inside playroom */}
        <nav className="header-nav">
          <button className="nav-link" onClick={onBack}>{t.home}</button>
          <button className="nav-link active">{t.play}</button>
          <button className="nav-link" onClick={onNavToHistory}>{t.history}</button>
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

      {/* ── Main layout ── */}
      <main className="main-layout">
        {/* ── Left Sidebar: Controls ── */}
        <aside className="sidebar sidebar-left">
          <DifficultySelector 
            activeDifficulty={difficulty} 
            onSelect={handleSetDifficulty} 
          />
          <ColorSelector 
            playerColor={playerColor} 
            onSelect={handleSetPlayerColor} 
          />
        </aside>

        {/* ── Board Area ── */}
        <section className="board-area">
          {/* Banner */}
          {banner.title && (
            <div className={`game-banner ${banner.cls}`}>
              <span className="banner-icon">{banner.icon}</span>
              <div className="banner-text">
                <div className="banner-title">{banner.title}</div>
                <div className="banner-sub">{banner.sub}</div>
              </div>
              {thinking && <div className="spinner" />}
            </div>
          )}

          {/* Board */}
          <div className="board-container">
            <Chessboard
              id="main-board"
              position={fen}
              onPieceDrop={onDrop}
              boardOrientation={boardOrientation}
              customSquareStyles={customSquareStyles}
              customBoardStyle={{
                borderRadius: 0,
                boxShadow: 'none',
              }}
              customDarkSquareStyle={{ backgroundColor: '#2b2b2b' }}
              customLightSquareStyle={{ backgroundColor: '#f5eedc' }}
              arePiecesDraggable={true}
              areArrowsAllowed={false}
              animationDuration={200}
            />
          </div>
        </section>

        {/* ── Right Sidebar: Move History ── */}
        <aside className="sidebar sidebar-right">
          {/* Timer */}
          <ChessClock
            key={gameKey}
            playerColor={playerColor}
            currentTurn={currentTurn}
            thinking={thinking}
            onTimeOut={handleTimeOut}
          />

          {/* Action buttons */}
          <div className="action-buttons">
            <button className="btn btn-yellow" onClick={newGame}>
              <FaRedo /> {t.btnNewGame}
            </button>
            <button className="btn btn-white" onClick={undo} disabled={!canUndo}>
              <FaUndo /> {t.btnUndo}
            </button>
          </div>
          <button 
            className="btn btn-red" 
            onClick={handleResign} 
            disabled={!!gameResult}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            🏳️ {t.btnResign}
          </button>

          {/* Move history */}
          <MoveHistory moveHistory={moveHistory} />
        </aside>
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <span>{language === 'vi' ? 'AstraChess — Động cơ trí tuệ nhân tạo Python cực kỳ mạnh mẽ' : 'AstraChess — Extremely powerful Python artificial intelligence engine'}</span>
        <span>
          Swagger docs:{' '}
          <a href={`${(import.meta as any).env.VITE_API_URL || '/api'}/docs`} target="_blank" rel="noreferrer">
            /docs
          </a>
        </span>
      </footer>

      {/* Modals */}
      <GameResultModal
        result={gameResult}
        onClose={handleCloseResultModal}
        onNewGame={handleCloseResultModal}
        wins={wins}
        losses={losses}
        draws={draws}
      />

      <ConfirmationModal
        show={showConfirmModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={
          pendingAction === 'difficulty' ? t.confirmDifficultyTitle : 
          pendingAction === 'color' ? t.confirmColorTitle : 
          t.confirmResignTitle
        }
        message={
          pendingAction === 'difficulty' ? t.confirmDifficultyMessage :
          pendingAction === 'color' ? t.confirmColorMessage :
          t.confirmResignMessage
        }
      />

      <PromotionModal
        pendingPromotion={pendingPromotion}
        onResolve={resolvePromotion}
        onCancel={cancelPromotion}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
