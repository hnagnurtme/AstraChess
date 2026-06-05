import React, { useState, useEffect } from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

interface ChessClockProps {
  playerColor: 'white' | 'black';
  currentTurn: 'white' | 'black';
  thinking: boolean;
  onTimeOut: (who: 'player' | 'bot') => void;
}

export function ChessClock({ playerColor, currentTurn, thinking, onTimeOut }: ChessClockProps) {
  const { t } = useLanguage();
  const [playerTime, setPlayerTime] = useState(600); // 10 minutes (600s)
  const [botTime, setBotTime] = useState(600);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTurn === playerColor) {
        setPlayerTime((t) => {
          const newTime = Math.max(0, t - 1);
          if (newTime === 0 && t > 0) {
            onTimeOut('player');
          }
          return newTime;
        });
      } else {
        setBotTime((t) => {
          const newTime = Math.max(0, t - 1);
          if (newTime === 0 && t > 0) {
            onTimeOut('bot');
          }
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTurn, playerColor, onTimeOut]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isPlayerActive = currentTurn === playerColor && !thinking;
  const isBotActive = currentTurn !== playerColor || thinking;

  return (
    <div className="chess-timers">
      <div className={`timer bot-timer ${isBotActive ? 'active' : ''}`}>
        <div className="timer-label">
          <FaRobot /> {t.timerBot}
        </div>
        <div className="timer-value">{formatTime(botTime)}</div>
      </div>
      <div className={`timer player-timer ${isPlayerActive ? 'active' : ''}`}>
        <div className="timer-label">
          <FaUser /> {t.timerPlayer}
        </div>
        <div className="timer-value">{formatTime(playerTime)}</div>
      </div>
    </div>
  );
}
