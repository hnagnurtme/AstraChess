import React, { useEffect, useRef } from 'react';
import { FaHistory } from 'react-icons/fa';
import { MoveHistoryItem } from '../hooks/useChessGame';
import { useLanguage } from '../context/LanguageContext';

interface MoveHistoryProps {
  moveHistory: MoveHistoryItem[];
}

export function MoveHistory({ moveHistory }: MoveHistoryProps) {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory]);

  const pairCount = Math.ceil(moveHistory.length / 2);

  return (
    <div className="sidebar-section move-history-section">
      <div className="sidebar-section-title">
        <FaHistory /> {t.historyTitle}
      </div>
      <div className="move-history-scroll" ref={scrollRef}>
        {moveHistory.length === 0 ? (
          <div className="move-history-empty">{t.historyEmpty}</div>
        ) : (
          <div className="move-history-list">
            {Array.from({ length: pairCount }).map((_, pairIdx) => {
              const whiteMove = moveHistory[pairIdx * 2];
              const blackMove = moveHistory[pairIdx * 2 + 1];
              return (
                <div key={pairIdx} className="move-pair">
                  <div className="move-number">{pairIdx + 1}.</div>
                  <div
                    className={`move-item ${
                      whiteMove?.side === 'me' ? 'player-move' : 'bot-move'
                    }`}
                  >
                    {whiteMove?.san || '...'}
                  </div>
                  {blackMove ? (
                    <div
                      className={`move-item ${
                        blackMove?.side === 'me' ? 'player-move' : 'bot-move'
                      }`}
                    >
                      {blackMove.san}
                    </div>
                  ) : (
                    <div className="move-item move-placeholder">—</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
