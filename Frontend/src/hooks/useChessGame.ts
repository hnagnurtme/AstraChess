import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess, ChessInstance, Square } from 'chess.js';
import { getBestMove } from '../api/api';
import { useLanguage } from '../context/LanguageContext';

export interface Difficulty {
  key: string;
  label: string;
  badge: string;
  desc: string;
  depth: number;
  timeLimit: number;
  cls: string;
}

export interface MoveHistoryItem {
  san: string;
  side: 'me' | 'bot';
}

export interface LastStats {
  nodes?: number | null;
  elapsed_ms?: number | null;
  engine?: string;
}

export interface PendingPromotion {
  from: Square;
  to: Square;
  fen: string;
}

export const DIFFICULTIES: Difficulty[] = [
  {
    key: 'v1',
    label: 'Casual',
    badge: 'V1',
    desc: 'Alpha-Beta đơn giản. Phù hợp người mới.',
    depth: 3,
    timeLimit: 1.0,
    cls: 'd-v1',
  },
  {
    key: 'v2',
    label: 'Tactical',
    badge: 'V2',
    desc: 'Iterative Deepening + TT. Thách thức hơn.',
    depth: 5,
    timeLimit: 1.0,
    cls: 'd-v2',
  },
  {
    key: 'vip',
    label: 'Master',
    badge: 'VIP',
    desc: 'Engine mạnh nhất. SEE + Aspiration Window.',
    depth: 6,
    timeLimit: 2.0,
    cls: 'd-vip',
  },
];

export function formatMs(ms: number | null): string {
  if (ms == null) return '—';
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

interface UseChessGameProps {
  onToast: (message: string, type?: 'info' | 'success' | 'error') => void;
}

export default function useChessGame({ onToast }: UseChessGameProps) {
  const { language } = useLanguage();
  // Use ChessInstance as the type for instances created by new Chess()
  const [game, setGame]               = useState<ChessInstance>(() => new Chess());
  const [fen,  setFen]                = useState<string>(() => new Chess().fen());
  const [difficulty, setDifficulty]   = useState<Difficulty>(DIFFICULTIES[2]);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [thinking, setThinking]       = useState<boolean>(false);
  const [lastBotMove, setLastBotMove] = useState<string | null>(null);
  const [lastStats, setLastStats]     = useState<LastStats | null>(null);
  const [moveHistory, setMoveHistory] = useState<MoveHistoryItem[]>([]);
  const [wins, setWins]               = useState<number>(0);
  const [losses, setLosses]           = useState<number>(0);
  const [draws, setDraws]             = useState<number>(0);
  const [gameResult, setGameResult]   = useState<'win' | 'loss' | 'draw' | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);

  const botLockRef      = useRef<boolean>(false);
  const gameRef         = useRef<ChessInstance>(game);
  const playerColorRef  = useRef<'white' | 'black'>(playerColor);
  const gameResultRef   = useRef<'win' | 'loss' | 'draw' | null>(gameResult);
  const difficultyRef   = useRef<Difficulty>(difficulty);

  gameRef.current        = game;
  playerColorRef.current = playerColor;
  gameResultRef.current  = gameResult;
  difficultyRef.current  = difficulty;

  const handleGameOver = useCallback((g: ChessInstance) => {
    const color = playerColorRef.current;
    if (g.in_checkmate()) {
      const winner = g.turn() === 'w' ? 'black' : 'white';
      if (winner === color) {
        setGameResult('win');
        setWins(w => w + 1);
        onToast('🎉 Bạn thắng!', 'success');
      } else {
        setGameResult('loss');
        setLosses(l => l + 1);
        onToast('💀 Bạn thua!', 'error');
      }
    } else {
      setGameResult('draw');
      setDraws(d => d + 1);
      onToast('🤝 Hòa!', 'info');
    }
  }, [onToast]);

  const handleTimeLoss = useCallback((who: 'player' | 'bot') => {
    if (gameResultRef.current) return;
    
    if (who === 'player') {
      setGameResult('loss');
      setLosses(l => l + 1);
    } else {
      setGameResult('win');
      setWins(w => w + 1);
    }
  }, []);

  const applyMove = useCallback((
    updatedGame: ChessInstance, 
    san: string, 
    side: 'me' | 'bot', 
    botMoveStr?: string | null, 
    stats?: LastStats | null
  ) => {
    setGame(updatedGame);
    setFen(updatedGame.fen());
    setMoveHistory(prev => [...prev, { san, side }]);
    if (botMoveStr != null) setLastBotMove(botMoveStr);
    if (stats != null)      setLastStats(stats);
    if (updatedGame.game_over()) handleGameOver(updatedGame);
  }, [handleGameOver]);

  const requestBotMove = useCallback(async (fenSnapshot: string) => {
    if (botLockRef.current) return;
    botLockRef.current = true;
    setThinking(true);

    const diff = difficultyRef.current;

    try {
      const res = await getBestMove(fenSnapshot, diff.key, diff.depth, diff.timeLimit);

      const updated = new Chess(fenSnapshot);
      const moveStr = res.move;
      const payload = {
        from: moveStr.slice(0, 2) as Square,
        to:   moveStr.slice(2, 4) as Square,
        ...(moveStr.length === 5 ? { promotion: moveStr[4] as 'q' | 'r' | 'b' | 'n' } : {}),
      };

      const moved = updated.move(payload);
      if (moved) {
        applyMove(updated, moved.san, 'bot', res.move, {
          nodes:      res.nodes,
          elapsed_ms: res.elapsed_ms,
          engine:     res.engine_used,
        });
      } else {
        console.error('Bot gửi nước đi không hợp lệ:', res.move);
        onToast('⚠️ Bot gửi nước đi không hợp lệ.', 'error');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Lỗi kết nối server.';
      onToast(msg, 'error');
    } finally {
      botLockRef.current = false;
      setThinking(false);
    }
  }, [applyMove, onToast]);

  const onDrop = useCallback((sourceSquare: string, targetSquare: string, piece: string) => {
    if (gameResultRef.current) return false;
    if (botLockRef.current)    return false;
    if (pendingPromotion)      return false;

    const isWhitePiece = piece[0] === 'w';
    const color = playerColorRef.current;
    if (color === 'white' && !isWhitePiece) return false;
    if (color === 'black' &&  isWhitePiece) return false;

    const currentFen = gameRef.current.fen();
    const updated    = new Chess(currentFen);

    const movingPiece = updated.get(sourceSquare as Square);
    const isPromotion =
      movingPiece?.type === 'p' &&
      ((movingPiece.color === 'w' && targetSquare[1] === '8') ||
       (movingPiece.color === 'b' && targetSquare[1] === '1'));

    if (isPromotion) {
      const legalMoves = updated.moves({ square: sourceSquare as Square, verbose: true }) as any[];
      const isLegal    = legalMoves.some(m => m.to === targetSquare);
      if (!isLegal) return false;
      setPendingPromotion({ 
        from: sourceSquare as Square, 
        to: targetSquare as Square, 
        fen: currentFen 
      });
      return true;
    }

    let move;
    try {
      move = updated.move({ from: sourceSquare as Square, to: targetSquare as Square });
    } catch {
      return false;
    }
    if (!move) return false;

    applyMove(updated, move.san, 'me', null, null);
    setLastBotMove(null);

    if (updated.game_over()) return true;

    const nextFen = updated.fen();
    setTimeout(() => requestBotMove(nextFen), 300);
    return true;
  }, [pendingPromotion, applyMove, requestBotMove]);

  // Set the promotion piece type parameter specifically to 'q' | 'r' | 'b' | 'n'
  const resolvePromotion = useCallback((pieceType: 'q' | 'r' | 'b' | 'n') => {
    if (!pendingPromotion) return;
    const { from, to, fen: snapFen } = pendingPromotion;
    setPendingPromotion(null);

    const updated = new Chess(snapFen);
    let move;
    try {
      move = updated.move({ from, to, promotion: pieceType });
    } catch {
      return;
    }
    if (!move) return;

    applyMove(updated, move.san, 'me', null, null);
    setLastBotMove(null);
    if (updated.game_over()) return;

    const nextFen = updated.fen();
    setTimeout(() => requestBotMove(nextFen), 300);
  }, [pendingPromotion, applyMove, requestBotMove]);

  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null);
  }, []);

  const prevColorRef = useRef(playerColor);
  useEffect(() => {
    const isColorChange = prevColorRef.current !== playerColor;
    prevColorRef.current = playerColor;

    if (!isColorChange && playerColor === 'white') return;

    const g      = new Chess();
    const initFen = g.fen();

    botLockRef.current = false;
    setGame(g);
    setFen(initFen);
    setThinking(false);
    setLastBotMove(null);
    setLastStats(null);
    setMoveHistory([]);
    setGameResult(null);
    setPendingPromotion(null);

    if (playerColor === 'black') {
      setTimeout(() => requestBotMove(initFen), 400);
    }
  }, [playerColor, requestBotMove]);

  const newGame = useCallback(() => {
    const g       = new Chess();
    const initFen = g.fen();

    botLockRef.current = false;
    setGame(g);
    setFen(initFen);
    setThinking(false);
    setLastBotMove(null);
    setLastStats(null);
    setMoveHistory([]);
    setGameResult(null);
    setPendingPromotion(null);

    if (playerColorRef.current === 'black') {
      setTimeout(() => requestBotMove(initFen), 400);
    }
  }, [requestBotMove]);

  const undo = useCallback(() => {
    if (botLockRef.current) return;
    const g = gameRef.current;
    if (g.history().length < 2) return;

    const result = gameResultRef.current;
    if (result === 'win')  setWins(w  => Math.max(0, w  - 1));
    if (result === 'loss') setLosses(l => Math.max(0, l - 1));
    if (result === 'draw') setDraws(d  => Math.max(0, d  - 1));

    const updated = new Chess(g.fen());
    updated.undo();
    updated.undo();

    setGame(updated);
    setFen(updated.fen());
    setMoveHistory(prev => prev.slice(0, -2));
    setLastBotMove(null);
    setLastStats(null);
    setGameResult(null);
    setPendingPromotion(null);
  }, []);

  const isCheck  = game.in_check() && !game.game_over();
  const isOver   = game.game_over();
  const isMyTurn = !isOver && !thinking && !gameResult &&
    ((game.turn() === 'w' && playerColor === 'white') ||
     (game.turn() === 'b' && playerColor === 'black'));

  let banner = { 
    cls: 'turn-white', 
    icon: '♟',  
    title: language === 'vi' ? 'Lượt Của Bạn' : 'Your Turn',          
    sub: language === 'vi' ? `Đang chơi quân màu ${playerColor === 'white' ? 'Trắng' : 'Đen'}` : `Playing as ${playerColor === 'white' ? 'White' : 'Black'}` 
  };
  if (!isMyTurn && !thinking && !isOver && !gameResult)
    banner =   { 
      cls: 'turn-black', 
      icon: '⏳',  
      title: language === 'vi' ? "Lượt Của Bot" : "Bot's Turn",         
      sub: language === 'vi' ? 'Chờ engine trả lời...' : 'Waiting for engine response...' 
    };
  if (isCheck)
    banner =   { 
      cls: 'check',      
      icon: '⚠️',  
      title: language === 'vi' ? 'Chiếu Tướng!' : 'Check!',             
      sub: language === 'vi' ? 'Vua đang bị chiếu!' : 'King is under check!' 
    };
  if (thinking && !pendingPromotion)
    banner =   { 
      cls: 'thinking',   
      icon: '🤖',  
      title: 'ASTRACHESS',       
      sub: language === 'vi' ? `Engine ${difficulty.label} đang tìm nước đi tốt nhất` : `Engine ${difficulty.label} is searching for the best move` 
    };
  if (pendingPromotion)
    banner =   { 
      cls: 'promotion',  
      icon: '👑',  
      title: language === 'vi' ? 'Chọn quân phong cấp' : 'Pawn Promotion', 
      sub: language === 'vi' ? 'Chọn quân để thay thế tốt' : 'Select a piece to replace your pawn' 
    };
  if (gameResult === 'win')
    banner =   { 
      cls: 'gameover',   
      icon: '🏆',  
      title: language === 'vi' ? 'Bạn Thắng!' : 'You Won!',            
      sub: language === 'vi' ? 'Chúc mừng chiến thắng xuất sắc!' : 'Congratulations on a brilliant victory!' 
    };
  if (gameResult === 'loss')
    banner =   { 
      cls: 'gameover',   
      icon: '😔',  
      title: language === 'vi' ? 'Bạn Thua!' : 'You Lost!',            
      sub: language === 'vi' ? 'Bot đã chiến thắng. Hãy thử lại!' : 'Bot won. Try again!' 
    };
  if (gameResult === 'draw')
    banner =   { 
      cls: 'gameover',   
      icon: '🤝',  
      title: language === 'vi' ? 'Hòa Cờ' : 'Draw Match',                
      sub: language === 'vi' ? 'Ván đấu kết thúc với kết quả hòa!' : 'The match ended in a draw!' 
    };

  const customSquareStyles: Record<string, any> = {};
  if (lastBotMove?.length && lastBotMove.length >= 4) {
    customSquareStyles[lastBotMove.slice(0, 2)] = { backgroundColor: 'rgba(255,193,7,0.4)' };
    customSquareStyles[lastBotMove.slice(2, 4)] = { backgroundColor: 'rgba(255,193,7,0.6)' };
  }

  return {
    difficulty,    setDifficulty,
    playerColor,   setPlayerColor,
    wins, losses, draws,
    moveHistory,
    lastStats,
    thinking,
    banner,
    fen,
    onDrop,
    boardOrientation: playerColor === 'black' ? 'black' as const : 'white' as const,
    customSquareStyles,
    pendingPromotion,
    resolvePromotion,
    cancelPromotion,
    newGame,
    undo,
    canUndo: !botLockRef.current && game.history().length >= 2,
    handleTimeLoss,
    game,
    gameResult,
  };
}
