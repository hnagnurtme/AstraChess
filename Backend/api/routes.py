"""
API Routes — Tất cả các endpoint của AstraChess API.
"""

import time
import chess
from fastapi import APIRouter, HTTPException

from models.schemas import (
    ApiResponse,
    MoveRequest,
    MoveResponse,
    EngineInfo,
    EnginesResponse,
    UserRegister,
    UserLogin,
    UserResponse,
    MatchCreate,
    MatchListItem,
    LeaderboardEntry,
)
from core import db
from engines.bot_v1 import BotV1
from engines.bot_v2 import BotV2
from engines.bot_vip import BotVIP

router = APIRouter()

# ─────────────────────────────────────────────────────────
# Engine registry — thêm engine mới ở đây
# ─────────────────────────────────────────────────────────
_ENGINE_META = {
    "v1": EngineInfo(
        name="v1",
        description="Alpha-Beta đơn giản + Quiescence. Nhanh, nhẹ.",
        supports_time_limit=False,
    ),
    "v2": EngineInfo(
        name="v2",
        description="Iterative Deepening + TT + Null-move + LMR. Mạnh hơn V1.",
        supports_time_limit=False,
    ),
    "vip": EngineInfo(
        name="vip",
        description="Engine đầy đủ nhất: SEE, Aspiration Window, Pawn Hash, History. Mạnh nhất.",
        supports_time_limit=True,
    ),
}


def _make_engine(name: str):
    """Tạo engine instance theo tên. Mỗi request dùng instance riêng."""
    if name == "v1":
        return BotV1()
    if name == "v2":
        return BotV2()
    if name == "vip":
        return BotVIP()
    raise HTTPException(status_code=400, detail=f'Engine "{name}" không tồn tại. Chọn: v1, v2, vip.')


# ─────────────────────────────────────────────────────────
# GET /engines
# ─────────────────────────────────────────────────────────
@router.get(
    "/engines",
    response_model=ApiResponse[EnginesResponse],
    summary="Liệt kê các engine",
    tags=["Engine"],
)
def list_engines() -> ApiResponse[EnginesResponse]:
    """Trả về danh sách engine và mô tả ngắn."""
    return ApiResponse(
        success=True,
        message="Lấy danh sách engine thành công.",
        data=EnginesResponse(engines=list(_ENGINE_META.values())),
    )


# ─────────────────────────────────────────────────────────
# POST /move
# ─────────────────────────────────────────────────────────
@router.post(
    "/move",
    response_model=ApiResponse[MoveResponse],
    summary="Lấy nước đi tốt nhất",
    tags=["Chess"],
)
def get_move(req: MoveRequest) -> ApiResponse[MoveResponse]:
    """
    Nhận FEN và tên engine → trả về nước đi tốt nhất (UCI format).

    - **fen**: Trạng thái bàn cờ (FEN string)
    - **engine**: `v1` | `v2` | `vip`
    - **depth**: Độ sâu (v1, v2)
    - **time_limit**: Giới hạn thời gian tính toán (chỉ VIP)
    """
    # Validate FEN
    try:
        board = chess.Board(req.fen)
    except ValueError:
        raise HTTPException(status_code=422, detail="FEN không hợp lệ.")

    if board.is_game_over():
        raise HTTPException(status_code=400, detail="Ván cờ đã kết thúc.")

    engine = _make_engine(req.engine)
    t0 = time.perf_counter()

    # Gọi engine
    if req.engine == "vip":
        move = engine.get_best_move(
            board,
            depth=req.depth,
            max_depth=req.depth,
            time_limit=req.time_limit,
        )
    else:
        move = engine.get_best_move(board, depth=req.depth)

    elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)

    if move is None:
        raise HTTPException(status_code=500, detail="Engine không tìm được nước đi.")

    return ApiResponse(
        success=True,
        message=f"Engine {req.engine} tính toán thành công.",
        data=MoveResponse(
            move=move.uci(),
            engine_used=req.engine,
            nodes=getattr(engine, "nodes", None),
            elapsed_ms=elapsed_ms,
        ),
    )


# ─────────────────────────────────────────────────────────
# Auth Endpoints
# ─────────────────────────────────────────────────────────
@router.post(
    "/auth/register",
    response_model=ApiResponse[UserResponse],
    summary="Đăng ký tài khoản mới",
    tags=["Auth"],
)
def register(req: UserRegister) -> ApiResponse[UserResponse]:
    existing = db.get_user_by_username(req.username)
    if existing:
        raise HTTPException(status_code=400, detail="Tên tài khoản đã tồn tại.")
    
    try:
        user = db.create_user(req.username, req.password, req.fullname, req.avatar)
        return ApiResponse(
            success=True,
            message="Đăng ký tài khoản thành công.",
            data=UserResponse(**user)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống khi đăng ký: {e}")


@router.post(
    "/auth/login",
    response_model=ApiResponse[UserResponse],
    summary="Đăng nhập tài khoản",
    tags=["Auth"],
)
def login(req: UserLogin) -> ApiResponse[UserResponse]:
    user = db.get_user_by_username(req.username)
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=400, detail="Tài khoản hoặc mật khẩu không đúng.")
    
    return ApiResponse(
        success=True,
        message="Đăng nhập thành công.",
        data=UserResponse(**user)
    )


# ─────────────────────────────────────────────────────────
# Leaderboard Endpoint
# ─────────────────────────────────────────────────────────
@router.get(
    "/leaderboard",
    response_model=ApiResponse[list[LeaderboardEntry]],
    summary="Lấy bảng xếp hạng hệ thống",
    tags=["Stats"],
)
def get_leaderboard_route() -> ApiResponse[list[LeaderboardEntry]]:
    try:
        entries = db.get_leaderboard()
        return ApiResponse(
            success=True,
            message="Lấy bảng xếp hạng thành công.",
            data=[LeaderboardEntry(**entry) for entry in entries]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy bảng xếp hạng: {e}")


# ─────────────────────────────────────────────────────────
# History / Match Logging Endpoints
# ─────────────────────────────────────────────────────────
@router.post(
    "/history",
    response_model=ApiResponse[None],
    summary="Lưu lịch sử ván cờ",
    tags=["Chess"],
)
def save_match_history(req: MatchCreate) -> ApiResponse[None]:
    user = db.get_user_by_username(req.username)
    if not user:
        raise HTTPException(status_code=400, detail="Tài khoản không tồn tại trên hệ thống.")
    
    try:
        db.create_match(
            match_id=req.id,
            username=req.username,
            date=req.date,
            difficulty=req.difficulty,
            player_color=req.playerColor,
            result=req.result,
            moves_count=req.movesCount
        )
        return ApiResponse(
            success=True,
            message="Đã lưu lịch sử ván cờ thành công.",
            data=None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lưu lịch sử: {e}")


@router.get(
    "/history/{username}",
    response_model=ApiResponse[list[MatchListItem]],
    summary="Lấy lịch sử ván cờ của người chơi",
    tags=["Chess"],
)
def get_history(username: str) -> ApiResponse[list[MatchListItem]]:
    user = db.get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=400, detail="Tài khoản không tồn tại.")
        
    try:
        matches = db.get_user_history(username)
        return ApiResponse(
            success=True,
            message="Lấy lịch sử ván cờ thành công.",
            data=[MatchListItem(**m) for m in matches]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy lịch sử ván cờ: {e}")


@router.delete(
    "/history/{username}",
    response_model=ApiResponse[None],
    summary="Xóa toàn bộ lịch sử ván cờ của người chơi",
    tags=["Chess"],
)
def clear_history(username: str) -> ApiResponse[None]:
    user = db.get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=400, detail="Tài khoản không tồn tại.")
        
    try:
        db.clear_user_history(username)
        return ApiResponse(
            success=True,
            message="Đã xóa toàn bộ lịch sử và đặt lại điểm số.",
            data=None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xóa lịch sử ván cờ: {e}")

