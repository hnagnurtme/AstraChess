import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || '/api',
  timeout: 60000,
});

export interface EngineInfo {
  name: string;
  description: string;
  supports_time_limit: boolean;
}

export interface EnginesResponse {
  engines: EngineInfo[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface MoveRequest {
  fen: string;
  engine: string;
  depth: number;
  time_limit?: number;
}

export interface MoveResponse {
  move: string;
  engine_used: string;
  nodes: number | null;
  elapsed_ms: number | null;
}

/**
 * Lấy danh sách engine khả dụng.
 */
export async function getEngines(): Promise<EngineInfo[]> {
  const { data } = await api.get<ApiResponse<EnginesResponse>>('/api/engines');
  return data.data?.engines ?? (data as any).engines ?? [];
}

/**
 * Gọi AI engine để lấy nước đi tốt nhất.
 */
export async function getBestMove(
  fen: string,
  engine = 'vip',
  depth = 4,
  timeLimit = 1.0
): Promise<MoveResponse> {
  const { data } = await api.post<ApiResponse<MoveResponse>>('/api/move', {
    fen,
    engine,
    depth,
    time_limit: timeLimit,
  });
  return data.data ?? (data as any);
}

// ── Auth, Matches & Leaderboard Interfaces ──
export interface UserSession {
  username: string;
  fullname: string;
  avatar: string;
  wins: number;
  losses: number;
  draws: number;
}

export interface MatchListItem {
  id: string;
  date: string;
  difficulty: string;
  playerColor: string;
  result: string;
  movesCount: number;
}

export interface LeaderboardEntry {
  username: string;
  fullname: string;
  avatar: string;
  wins: number;
  losses: number;
  draws: number;
  score: number;
}

/**
 * Đăng ký tài khoản.
 */
export async function registerUser(
  username: string,
  password: string,
  fullname: string,
  avatar: string
): Promise<UserSession> {
  const { data } = await api.post<ApiResponse<UserSession>>('/api/auth/register', {
    username,
    password,
    fullname,
    avatar,
  });
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Đăng ký không thành công');
  }
  return data.data;
}

/**
 * Đăng nhập tài khoản.
 */
export async function loginUser(
  username: string,
  password: string
): Promise<UserSession> {
  const { data } = await api.post<ApiResponse<UserSession>>('/api/auth/login', {
    username,
    password,
  });
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Đăng nhập không thành công');
  }
  return data.data;
}

/**
 * Lưu lịch sử trận đấu lên database.
 */
export async function saveMatch(matchData: {
  id: string;
  username: string;
  date: string;
  difficulty: string;
  playerColor: string;
  result: string;
  movesCount: number;
}): Promise<void> {
  const { data } = await api.post<ApiResponse<void>>('/api/history', matchData);
  if (!data.success) {
    throw new Error(data.message || 'Không thể lưu lịch sử ván cờ');
  }
}

/**
 * Lấy lịch sử ván cờ của người dùng.
 */
export async function getMatchHistory(username: string): Promise<MatchListItem[]> {
  const { data } = await api.get<ApiResponse<MatchListItem[]>>(`/api/history/${username}`);
  return data.data ?? [];
}

/**
 * Xóa lịch sử ván cờ của người dùng.
 */
export async function clearMatchHistory(username: string): Promise<void> {
  const { data } = await api.delete<ApiResponse<void>>(`/api/history/${username}`);
  if (!data.success) {
    throw new Error(data.message || 'Không thể xóa lịch sử ván cờ');
  }
}

/**
 * Lấy bảng xếp hạng.
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data } = await api.get<ApiResponse<LeaderboardEntry[]>>('/api/leaderboard');
  return data.data ?? [];
}

export default api;

