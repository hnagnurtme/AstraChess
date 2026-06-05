import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

export interface TranslationDict {
  home: string;
  play: string;
  history: string;
  leaderboard: string;
  login: string;
  logout: string;
  loginTab: string;
  registerTab: string;
  username: string;
  usernamePlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  fullname: string;
  fullnamePlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  chooseAvatar: string;
  authErrorEmpty: string;
  authErrorFullname: string;
  authErrorPasswordMismatch: string;
  noAccount: string;
  hasAccount: string;
  registerNow: string;
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroTitle2: string;
  heroDesc: string;
  btnPlayNow: string;
  btnExploreEngines: string;
  enginesTitle: string;
  enginesSubtitle: string;
  engineCasualDesc: string;
  engineTacticalDesc: string;
  engineMasterDesc: string;
  engineCasualFeature1: string;
  engineCasualFeature2: string;
  engineCasualFeature3: string;
  engineTacticalFeature1: string;
  engineTacticalFeature2: string;
  engineTacticalFeature3: string;
  engineMasterFeature1: string;
  engineMasterFeature2: string;
  engineMasterFeature3: string;
  guideTitle: string;
  guideStep1Title: string;
  guideStep1Desc: string;
  guideStep2Title: string;
  guideStep2Desc: string;
  guideStep3Title: string;
  guideStep3Desc: string;
  sysStatusTitle: string;
  sysStatusLabel: string;
  sysLatencyLabel: string;
  sysMaxDepthLabel: string;
  sysEnginesLabel: string;
  sysOnline: string;
  sysLoaded: string;
  footerTitle: string;
  gameTitle: string;
  gameSubtitle: string;
  difficultyLabel: string;
  colorLabel: string;
  colorWhite: string;
  colorBlack: string;
  timerBot: string;
  timerPlayer: string;
  btnNewGame: string;
  btnUndo: string;
  btnResign: string;
  historyTitle: string;
  historyEmpty: string;
  confirmResignTitle: string;
  confirmResignMessage: string;
  confirmDifficultyTitle: string;
  confirmDifficultyMessage: string;
  confirmColorTitle: string;
  confirmColorMessage: string;
  confirmLogoutTitle: string;
  confirmLogoutMessage: string;
  confirmClearHistoryTitle: string;
  confirmClearHistoryMessage: string;
  confirmBtnConfirm: string;
  confirmBtnCancel: string;
  winTitle: string;
  winMessage: string;
  lossTitle: string;
  lossMessage: string;
  drawTitle: string;
  drawMessage: string;
  winStat: string;
  lossStat: string;
  drawStat: string;
  modalBtnClose: string;
  promoTitle: string;
  promoMessage: string;
  promoQueen: string;
  promoRook: string;
  promoBishop: string;
  promoKnight: string;
  toastSaveSuccess: string;
  toastSaveFailed: string;
  toastSaveFailedLocal: string;
  toastSaveLocal: string;
  toastTimeoutLoss: string;
  toastTimeoutWin: string;
  toastResignLoss: string;
  toastGuestTrialFinished: string;
  guestPlayOption: string;
  historyPageTitle: string;
  historyPageSubtitle: string;
  historyPageHeader: string;
  btnClearHistory: string;
  historyEmptyCardTitle: string;
  historyEmptyCardDesc: string;
  historyTableColSTT: string;
  historyTableColDate: string;
  historyTableColDiff: string;
  historyTableColColor: string;
  historyTableColMoves: string;
  historyTableColResult: string;
  historyTableColActions: string;
  outcomeWin: string;
  outcomeLoss: string;
  outcomeDraw: string;
  leaderboardPageTitle: string;
  leaderboardPageSubtitle: string;
  leaderboardPageHeader: string;
  leaderboardInfoPill: string;
  leaderboardTableColRank: string;
  leaderboardTableColPlayer: string;
  leaderboardTableColScore: string;
  leaderboardTableColWinRate: string;
  leaderboardSelfTag: string;
  leaderboardEmpty: string;
  leaderboardEmptyBtn: string;
  leaderboardLoading: string;
  leaderboardError: string;
}

const viDict: TranslationDict = {
  home: 'TRANG CHỦ',
  play: 'ĐẤU VỚI BOT',
  history: 'LỊCH SỬ ĐẤU',
  leaderboard: 'BẢNG XẾP HẠNG',
  login: 'ĐĂNG NHẬP',
  logout: 'Đăng Xuất',
  loginTab: 'Đăng Nhập',
  registerTab: 'Đăng Ký',
  username: 'Tên đăng nhập',
  usernamePlaceholder: 'Nhập tên đăng nhập...',
  password: 'Mật khẩu',
  passwordPlaceholder: 'Nhập mật khẩu...',
  fullname: 'Họ và tên',
  fullnamePlaceholder: 'Nhập họ và tên...',
  confirmPassword: 'Nhập lại mật khẩu',
  confirmPasswordPlaceholder: 'Xác nhận mật khẩu...',
  chooseAvatar: 'Chọn ảnh đại diện',
  authErrorEmpty: 'Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu.',
  authErrorFullname: 'Vui lòng điền Họ và tên.',
  authErrorPasswordMismatch: 'Mật khẩu nhập lại không khớp.',
  noAccount: 'Chưa có tài khoản?',
  hasAccount: 'Đã có tài khoản?',
  registerNow: 'Đăng ký ngay',
  heroBadge: 'AI CHESS ENGINE',
  heroTitle1: 'Chinh Phục',
  heroTitleHighlight: 'Trí Tuệ',
  heroTitle2: 'Cờ Vua Siêu Cấp',
  heroDesc: 'Trải nghiệm các ván đấu cờ vua đầy thách thức với động cơ AI hiện đại AstraChess, được tinh chỉnh bằng các giải thuật tìm kiếm Alpha-Beta và SEE thông minh. Thử sức mình qua 3 cấp độ từ người mới bắt đầu đến đại kiện tướng.',
  btnPlayNow: 'CHƠI NGAY',
  btnExploreEngines: 'TÌM HIỂU ENGINE',
  enginesTitle: 'Hệ Thống Động Cơ AI',
  enginesSubtitle: 'Được tối ưu hóa bằng các giải thuật cờ vua nâng cao',
  engineCasualDesc: 'Phiên bản tinh gọn sử dụng thuật toán tìm kiếm Minimax kết hợp cắt tỉa Alpha-Beta và tìm kiếm tĩnh (Quiescence Search) cơ bản.',
  engineTacticalDesc: 'Trang bị thuật toán tìm kiếm sâu dần (Iterative Deepening), bảng chuyển vị (Transposition Table) và kỹ thuật giảm nước đi muộn (LMR) để tìm kiếm hiệu quả hơn.',
  engineMasterDesc: 'Động cơ mạnh nhất của AstraChess. Tích hợp Đánh giá trao đổi tĩnh (SEE), Cửa sổ kỳ vọng (Aspiration Window), Bảng băm tốt (Pawn Hash) và Lịch sử nước đi.',
  engineCasualFeature1: 'Độ sâu tìm kiếm: 3-4 plies',
  engineCasualFeature2: 'Thời gian phản hồi: < 200ms',
  engineCasualFeature3: 'Phù hợp: Người mới học chơi',
  engineTacticalFeature1: 'Độ sâu tìm kiếm: 5-6 plies',
  engineTacticalFeature2: 'Bộ nhớ: Transposition Table',
  engineTacticalFeature3: 'Phù hợp: Người chơi có kinh nghiệm',
  engineMasterFeature1: 'Độ sâu tìm kiếm: 6-8 plies',
  engineMasterFeature2: 'Thuật toán: SEE + Aspiration',
  engineMasterFeature3: 'Phù hợp: Đại kiện tướng',
  guideTitle: 'HƯỚNG DẪN BẮT ĐẦU',
  guideStep1Title: 'Chọn Cấp Độ Bot',
  guideStep1Desc: 'Chọn v1 (Casual), v2 (Tactical), hoặc VIP (Master) tùy theo kỹ năng của bạn.',
  guideStep2Title: 'Chọn Màu Quân',
  guideStep2Desc: 'Bạn có thể chọn đi trước với quân Trắng, hoặc đi sau thách thức hơn với quân Đen.',
  guideStep3Title: 'Di Chuyển và Chiến Đấu',
  guideStep3Desc: 'Nhấp kéo thả quân cờ của bạn. Hệ thống sẽ tự động ghi nhận và bot AI sẽ trả lời sau vài mili-giây.',
  sysStatusTitle: 'TRẠNG THÁI HỆ THỐNG',
  sysStatusLabel: 'API Status',
  sysLatencyLabel: 'Engine Latency',
  sysMaxDepthLabel: 'Max Depth',
  sysEnginesLabel: 'Active Engines',
  sysOnline: 'ONLINE',
  sysLoaded: '3 Loaded',
  footerTitle: '© 2026 AstraChess — Powered by Python FastAPI AI Engine',
  gameTitle: 'ASTRACHESS PLAYROOM',
  gameSubtitle: 'Trận Đấu Cùng Trí Tuệ Nhân Tạo',
  difficultyLabel: 'CẤP ĐỘ BOT',
  colorLabel: 'MÀU QUÂN',
  colorWhite: 'TRẮNG',
  colorBlack: 'ĐEN',
  timerBot: 'BOT',
  timerPlayer: 'BẠN',
  btnNewGame: 'Ván Mới',
  btnUndo: 'Hoàn Tác',
  btnResign: 'Đầu Hàng',
  historyTitle: 'LỊCH SỬ NƯỚC ĐI',
  historyEmpty: 'Chưa có nước đi nào...',
  confirmResignTitle: 'Đầu Hàng Ván Đấu?',
  confirmResignMessage: 'Bạn có chắc chắn muốn đầu hàng ván cờ này? Hành động này sẽ ghi nhận một trận thua.',
  confirmDifficultyTitle: 'Đổi Cấp Độ Bot?',
  confirmDifficultyMessage: 'Thay đổi cấp độ bot sẽ reset bàn cờ và bắt đầu ván mới. Bạn có chắc chắn muốn tiếp tục?',
  confirmColorTitle: 'Đổi Màu Quân?',
  confirmColorMessage: 'Thay đổi màu quân sẽ reset bàn cờ và bắt đầu ván mới. Bạn có chắc chắn muốn tiếp tục?',
  confirmLogoutTitle: 'Đăng Xuất Tài Khoản?',
  confirmLogoutMessage: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản AstraChess hiện tại?',
  confirmClearHistoryTitle: 'Xóa Lịch Sử Đấu?',
  confirmClearHistoryMessage: 'Bạn có chắc chắn muốn xóa toàn bộ lịch sử đấu? Hành động này không thể hoàn tác.',
  confirmBtnConfirm: 'Xác Nhận',
  confirmBtnCancel: 'Hủy',
  winTitle: 'Chiến Thắng!',
  winMessage: 'Chúc mừng! Bạn đã thắng ván cờ này.',
  lossTitle: 'Thất Bại',
  lossMessage: 'Bot đã thắng ván này. Cố gắng lần sau nhé!',
  drawTitle: 'Hòa Cờ',
  drawMessage: 'Ván cờ kết thúc với kết quả hòa.',
  winStat: 'Thắng',
  lossStat: 'Thua',
  drawStat: 'Hòa',
  modalBtnClose: 'Đóng',
  promoTitle: 'Phong Cấp Tốt',
  promoMessage: 'Hãy chọn quân cờ bạn muốn phong cấp cho Tốt:',
  promoQueen: 'Hậu (Queen)',
  promoRook: 'Xe (Rook)',
  promoBishop: 'Tượng (Bishop)',
  promoKnight: 'Mã (Knight)',
  toastSaveSuccess: '💾 Đã lưu ván đấu vào hệ thống!',
  toastSaveFailed: 'Lỗi khi lưu lịch sử lên server.',
  toastSaveFailedLocal: '⚠️ Lỗi kết nối. Ván đấu tạm lưu cục bộ.',
  toastSaveLocal: '💾 Đã lưu ván đấu (Guest) vào Lịch Sử!',
  toastTimeoutLoss: '⏰ Hết giờ! Bạn thua!',
  toastTimeoutWin: '⏰ Bot hết giờ! Bạn thắng!',
  toastResignLoss: '🏳️ Bạn đã đầu hàng ván đấu!',
  toastGuestTrialFinished: 'Bạn đã hoàn thành ván đấu thử! Đăng ký để chơi tiếp.',
  guestPlayOption: 'Chơi Với Tư Cách Khách (1 Ván)',
  historyPageTitle: 'ASTRACHESS HISTORY',
  historyPageSubtitle: 'Lịch sử các ván cờ đã thi đấu',
  historyPageHeader: 'BẢNG VÀNG THÀNH TÍCH',
  btnClearHistory: 'XÓA TOÀN BỘ LỊCH SỬ',
  historyEmptyCardTitle: 'Không tìm thấy lịch sử đấu',
  historyEmptyCardDesc: 'Bạn chưa hoàn thành ván đấu nào với AI AstraChess. Hãy nhấp vào nút dưới đây để bắt đầu ngay trận đấu đầu tiên!',
  historyTableColSTT: 'STT',
  historyTableColDate: 'Ngày Đấu',
  historyTableColDiff: 'Cấp Độ Bot',
  historyTableColColor: 'Màu Quân',
  historyTableColMoves: 'Số Nước',
  historyTableColResult: 'Kết Quả',
  historyTableColActions: 'Thao Tác',
  outcomeWin: 'Thắng',
  outcomeLoss: 'Thua',
  outcomeDraw: 'Hòa',
  leaderboardPageTitle: 'ASTRACHESS LEADERBOARD',
  leaderboardPageSubtitle: 'Bảng Xếp Hạng Kỳ Thủ Toàn Hệ Thống',
  leaderboardPageHeader: 'BẢNG VÀNG KỲ THỦ',
  leaderboardInfoPill: '💡 Thắng = 3 điểm | Hòa = 1 điểm | Thua = 0 điểm',
  leaderboardTableColRank: 'Hạng',
  leaderboardTableColPlayer: 'Kỳ Thủ',
  leaderboardTableColScore: 'Điểm Số',
  leaderboardTableColWinRate: 'Tỉ Lệ Thắng',
  leaderboardSelfTag: 'BẠN',
  leaderboardEmpty: 'Chưa có kỳ thủ nào đăng ký',
  leaderboardEmptyBtn: 'ĐẤU VỚI BOT NGAY',
  leaderboardLoading: 'Đang tải dữ liệu...',
  leaderboardError: 'Không thể tải bảng xếp hạng. Vui lòng kiểm tra kết nối.',
};

const enDict: TranslationDict = {
  home: 'HOME',
  play: 'PLAY BOT',
  history: 'MATCH HISTORY',
  leaderboard: 'LEADERBOARD',
  login: 'LOG IN',
  logout: 'Log Out',
  loginTab: 'Log In',
  registerTab: 'Register',
  username: 'Username',
  usernamePlaceholder: 'Enter your username...',
  password: 'Password',
  passwordPlaceholder: 'Enter your password...',
  fullname: 'Full Name',
  fullnamePlaceholder: 'Enter your full name...',
  confirmPassword: 'Confirm Password',
  confirmPasswordPlaceholder: 'Confirm your password...',
  chooseAvatar: 'Select Avatar Profile',
  authErrorEmpty: 'Please fill in both Username and Password.',
  authErrorFullname: 'Please enter your Full Name.',
  authErrorPasswordMismatch: 'Passwords do not match.',
  noAccount: "Don't have an account?",
  hasAccount: 'Already have an account?',
  registerNow: 'Register now',
  heroBadge: 'AI CHESS ENGINE',
  heroTitle1: 'Conquer the',
  heroTitleHighlight: 'Ultimate',
  heroTitle2: 'Chess Brains',
  heroDesc: 'Experience highly challenging chess matches against the state-of-the-art AstraChess AI engine, fine-tuned using smart Alpha-Beta search and Static Exchange Evaluation (SEE). Test your wits across 3 levels from casual to grandmaster.',
  btnPlayNow: 'PLAY NOW',
  btnExploreEngines: 'EXPLORE ENGINES',
  enginesTitle: 'AI Chess Engine System',
  enginesSubtitle: 'Optimized with advanced search and evaluation algorithms',
  engineCasualDesc: 'A lightweight engine version utilizing Minimax search with basic Alpha-Beta pruning and Quiescence Search.',
  engineTacticalDesc: 'Equipped with Iterative Deepening search, Transposition Table (TT), and Late Move Reductions (LMR) for much deeper tactical depth.',
  engineMasterDesc: 'The ultimate engine of AstraChess. Toggles Static Exchange Evaluation (SEE), Aspiration Window, Pawn Hash, and Move History heuristics.',
  engineCasualFeature1: 'Search depth: 3-4 plies',
  engineCasualFeature2: 'Response latency: < 200ms',
  engineCasualFeature3: 'Ideal for: Beginners',
  engineTacticalFeature1: 'Search depth: 5-6 plies',
  engineTacticalFeature2: 'Memory: Transposition Table',
  engineTacticalFeature3: 'Ideal for: Experienced players',
  engineMasterFeature1: 'Search depth: 6-8 plies',
  engineMasterFeature2: 'Algorithm: SEE + Aspiration',
  engineMasterFeature3: 'Ideal for: Grandmasters',
  guideTitle: 'QUICK START GUIDE',
  guideStep1Title: 'Select Bot Level',
  guideStep1Desc: 'Choose v1 (Casual), v2 (Tactical), or VIP (Master) matching your chess skill.',
  guideStep2Title: 'Select Playing Side',
  guideStep2Desc: 'Choose to play first as White, or play second as Black for an extra challenge.',
  guideStep3Title: 'Move and Battle',
  guideStep3Desc: 'Drag and drop your pieces on the board. The system automatically routes it and the bot responds in milliseconds.',
  sysStatusTitle: 'SYSTEM STATUS',
  sysStatusLabel: 'API Status',
  sysLatencyLabel: 'Engine Latency',
  sysMaxDepthLabel: 'Max Depth',
  sysEnginesLabel: 'Active Engines',
  sysOnline: 'ONLINE',
  sysLoaded: '3 Loaded',
  footerTitle: '© 2026 AstraChess — Powered by Python FastAPI AI Engine',
  gameTitle: 'ASTRACHESS PLAYROOM',
  gameSubtitle: 'Play Chess against Artificial Intelligence',
  difficultyLabel: 'BOT DIFFICULTY',
  colorLabel: 'YOUR SIDE',
  colorWhite: 'WHITE',
  colorBlack: 'BLACK',
  timerBot: 'BOT',
  timerPlayer: 'YOU',
  btnNewGame: 'New Game',
  btnUndo: 'Undo Move',
  btnResign: 'Resign',
  historyTitle: 'MOVE HISTORY',
  historyEmpty: 'No moves recorded yet...',
  confirmResignTitle: 'Resign Chess Match?',
  confirmResignMessage: 'Are you sure you want to resign this match? This will record a loss in your history.',
  confirmDifficultyTitle: 'Change Bot Difficulty?',
  confirmDifficultyMessage: 'Changing difficulty will reset the board and start a new game. Do you want to continue?',
  confirmColorTitle: 'Change Playing Color?',
  confirmColorMessage: 'Changing playing color will reset the board and start a new game. Do you want to continue?',
  confirmLogoutTitle: 'Sign Out Account?',
  confirmLogoutMessage: 'Are you sure you want to log out of your current AstraChess profile?',
  confirmClearHistoryTitle: 'Clear Match History?',
  confirmClearHistoryMessage: 'Are you sure you want to clear your entire match history? This action is permanent.',
  confirmBtnConfirm: 'Confirm',
  confirmBtnCancel: 'Cancel',
  winTitle: 'Victory!',
  winMessage: 'Congratulations! You won this chess match.',
  lossTitle: 'Game Over',
  lossMessage: 'The Bot won this game. Try again next time!',
  drawTitle: 'Draw Match',
  drawMessage: 'The game has concluded with a draw.',
  winStat: 'Wins',
  lossStat: 'Losses',
  drawStat: 'Draws',
  modalBtnClose: 'Close',
  promoTitle: 'Pawn Promotion',
  promoMessage: 'Select the piece you want to promote your pawn into:',
  promoQueen: 'Queen',
  promoRook: 'Rook',
  promoBishop: 'Bishop',
  promoKnight: 'Knight',
  toastSaveSuccess: '💾 Match successfully saved to the database!',
  toastSaveFailed: 'Error saving match to the server.',
  toastSaveFailedLocal: '⚠️ Connection error. Saved match locally.',
  toastSaveLocal: '💾 Match (Guest) saved to local history!',
  toastTimeoutLoss: '⏰ Time out! You lost!',
  toastTimeoutWin: '⏰ Bot timed out! You won!',
  toastResignLoss: '🏳️ You resigned the chess match!',
  toastGuestTrialFinished: 'You finished your trial match! Register to continue.',
  guestPlayOption: 'Play as Guest (1 Game)',
  historyPageTitle: 'ASTRACHESS HISTORY',
  historyPageSubtitle: 'Complete list of games played',
  historyPageHeader: 'HALL OF ACHIEVEMENTS',
  btnClearHistory: 'PURGE ALL HISTORY',
  historyEmptyCardTitle: 'No Match History Found',
  historyEmptyCardDesc: 'You have not completed any chess games against AstraChess AI yet. Click below to play your first match!',
  historyTableColSTT: 'No.',
  historyTableColDate: 'Date Played',
  historyTableColDiff: 'Opponent Bot',
  historyTableColColor: 'Your Color',
  historyTableColMoves: 'Moves',
  historyTableColResult: 'Outcome',
  historyTableColActions: 'Actions',
  outcomeWin: 'Won',
  outcomeLoss: 'Lost',
  outcomeDraw: 'Drawn',
  leaderboardPageTitle: 'ASTRACHESS LEADERBOARD',
  leaderboardPageSubtitle: 'Global System-Wide Player Rankings',
  leaderboardPageHeader: 'PLAYERS HALL OF FAME',
  leaderboardInfoPill: '💡 Win = 3 pts | Draw = 1 pt | Loss = 0 pts',
  leaderboardTableColRank: 'Rank',
  leaderboardTableColPlayer: 'Player',
  leaderboardTableColScore: 'Score',
  leaderboardTableColWinRate: 'Win Rate',
  leaderboardSelfTag: 'YOU',
  leaderboardEmpty: 'No players registered yet',
  leaderboardEmptyBtn: 'PLAY BOT NOW',
  leaderboardLoading: 'Loading leaderboard data...',
  leaderboardError: 'Unable to load leaderboard. Please check connection.',
};

interface LanguageContextProps {
  language: Language;
  t: TranslationDict;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('astrachess_lang');
    return (saved === 'en' || saved === 'vi') ? saved as Language : 'vi';
  });

  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const next = prev === 'vi' ? 'en' : 'vi';
      localStorage.setItem('astrachess_lang', next);
      return next;
    });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('astrachess_lang', lang);
  };

  const t = language === 'vi' ? viDict : enDict;

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
