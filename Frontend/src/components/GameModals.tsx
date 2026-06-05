import React from 'react';
import { 
  FaTrophy, FaSkull, FaHandshake, 
  FaRedo, FaBolt, FaCrown, FaChessQueen, 
  FaChessRook, FaChessBishop, FaChessKnight 
} from 'react-icons/fa';
import { PendingPromotion } from '../hooks/useChessGame';
import { useLanguage } from '../context/LanguageContext';

// ── 1. Game Result Modal ──
interface GameResultModalProps {
  result: 'win' | 'loss' | 'draw' | null;
  onClose: () => void;
  onNewGame: () => void;
  wins: number;
  losses: number;
  draws: number;
}

export function GameResultModal({ result, onClose, onNewGame, wins, losses, draws }: GameResultModalProps) {
  const { t } = useLanguage();
  
  if (!result) return null;

  const config = {
    win: {
      title: t.winTitle,
      icon: <FaTrophy />,
      message: t.winMessage,
      color: 'var(--green)',
    },
    loss: {
      title: t.lossTitle,
      icon: <FaSkull />,
      message: t.lossMessage,
      color: 'var(--red)',
    },
    draw: {
      title: t.drawTitle,
      icon: <FaHandshake />,
      message: t.drawMessage,
      color: 'var(--yellow)',
    },
  };

  const { title, icon, message, color } = config[result] || config.draw;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon" style={{ color }}>
          {icon}
        </div>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>

        <div className="modal-stats">
          <div className="modal-stat">
            <span className="modal-stat-value" style={{ color: 'var(--green)' }}>
              {wins}
            </span>
            <span className="modal-stat-label">{t.winStat}</span>
          </div>
          <div className="modal-stat">
            <span className="modal-stat-value" style={{ color: 'var(--red)' }}>
              {losses}
            </span>
            <span className="modal-stat-label">{t.lossStat}</span>
          </div>
          <div className="modal-stat">
            <span className="modal-stat-value" style={{ color: '#c49b00' }}>
              {draws}
            </span>
            <span className="modal-stat-label">{t.drawStat}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-yellow" onClick={onNewGame}>
            <FaRedo /> {t.btnNewGame}
          </button>
          <button className="btn btn-white" onClick={onClose}>
            {t.modalBtnClose}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 2. Confirmation Modal ──
interface ConfirmationModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

export function ConfirmationModal({ show, onConfirm, onCancel, title, message }: ConfirmationModalProps) {
  const { t } = useLanguage();
  
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon" style={{ color: 'var(--yellow)' }}>
          <FaBolt />
        </div>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>

        <div className="modal-actions">
          <button className="btn btn-yellow" onClick={onConfirm}>
            <FaRedo /> {t.confirmBtnConfirm}
          </button>
          <button className="btn btn-white" onClick={onCancel}>
            {t.confirmBtnCancel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 3. Pawn Promotion Modal ──
interface PromotionModalProps {
  pendingPromotion: PendingPromotion | null;
  onResolve: (piece: 'q' | 'r' | 'b' | 'n') => void;
  onCancel: () => void;
}

export function PromotionModal({ pendingPromotion, onResolve, onCancel }: PromotionModalProps) {
  const { t } = useLanguage();
  
  if (!pendingPromotion) return null;

  const options = [
    { key: 'q' as const, label: t.promoQueen, icon: <FaChessQueen /> },
    { key: 'r' as const, label: t.promoRook, icon: <FaChessRook /> },
    { key: 'b' as const, label: t.promoBishop, icon: <FaChessBishop /> },
    { key: 'n' as const, label: t.promoKnight, icon: <FaChessKnight /> },
  ];

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content promotion-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon" style={{ color: 'var(--purple)' }}>
          <FaCrown />
        </div>
        <h2 className="modal-title">{t.promoTitle}</h2>
        <p className="modal-message">{t.promoMessage}</p>

        <div className="promotion-options-grid">
          {options.map((opt) => (
            <button
              key={opt.key}
              className="promotion-option-btn"
              onClick={() => onResolve(opt.key)}
            >
              <span className="promo-icon">{opt.icon}</span>
              <span className="promo-label">{opt.label}</span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: '20px' }}>
          <button className="btn btn-white" style={{ width: '100%' }} onClick={onCancel}>
            {t.confirmBtnCancel}
          </button>
        </div>
      </div>
    </div>
  );
}
