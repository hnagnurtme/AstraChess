import psycopg2
from psycopg2.extras import RealDictCursor
from core.config import settings

DATABASE_URL = settings.database_url

def get_connection():
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL is not set. Please set it in your environment or .env file.")
    return psycopg2.connect(DATABASE_URL)

def init_db():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # Create users table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(100) NOT NULL,
                    fullname VARCHAR(100) NOT NULL,
                    avatar VARCHAR(50) NOT NULL,
                    wins INT DEFAULT 0,
                    losses INT DEFAULT 0,
                    draws INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            # Create matches table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS matches (
                    id VARCHAR(100) PRIMARY KEY,
                    username VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
                    date VARCHAR(100) NOT NULL,
                    difficulty VARCHAR(50) NOT NULL,
                    player_color VARCHAR(20) NOT NULL,
                    result VARCHAR(20) NOT NULL,
                    moves_count INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()
            print("Database initialized successfully.")
    except Exception as e:
        conn.rollback()
        print(f"Error initializing database: {e}")
        raise e
    finally:
        conn.close()

def create_user(username, password, fullname, avatar):
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                INSERT INTO users (username, password, fullname, avatar)
                VALUES (%s, %s, %s, %s)
                RETURNING username, fullname, avatar, wins, losses, draws;
                """,
                (username, password, fullname, avatar)
            )
            user = cur.fetchone()
            conn.commit()
            return user
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def get_user_by_username(username):
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT username, password, fullname, avatar, wins, losses, draws FROM users WHERE username = %s;",
                (username,)
            )
            return cur.fetchone()
    finally:
        conn.close()

def get_leaderboard():
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT username, fullname, avatar, wins, losses, draws, (wins * 3 + draws) as score
                FROM users
                ORDER BY score DESC, wins DESC, username ASC
                LIMIT 50;
            """)
            return cur.fetchall()
    finally:
        conn.close()

def create_match(match_id, username, date, difficulty, player_color, result, moves_count):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO matches (id, username, date, difficulty, player_color, result, moves_count)
                VALUES (%s, %s, %s, %s, %s, %s, %s);
                """,
                (match_id, username, date, difficulty, player_color, result, moves_count)
            )
            if result == "Thắng":
                cur.execute("UPDATE users SET wins = wins + 1 WHERE username = %s;", (username,))
            elif result == "Thua":
                cur.execute("UPDATE users SET losses = losses + 1 WHERE username = %s;", (username,))
            elif result == "Hòa":
                cur.execute("UPDATE users SET draws = draws + 1 WHERE username = %s;", (username,))
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def get_user_history(username):
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT id, date, difficulty, player_color as "playerColor", result, moves_count as "movesCount"
                FROM matches
                WHERE username = %s
                ORDER BY created_at DESC;
                """,
                (username,)
            )
            return cur.fetchall()
    finally:
        conn.close()

def clear_user_history(username):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM matches WHERE username = %s;", (username,))
            cur.execute("UPDATE users SET wins = 0, losses = 0, draws = 0 WHERE username = %s;", (username,))
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()
