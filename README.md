<p align="center" style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 15px;">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" height="35" title="React" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" height="35" title="TypeScript" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg" height="35" title="FastAPI" />
  <img src="https://cdn.simpleicons.org/neon/00E599" height="35" title="Neon Database" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/cloudflare/cloudflare-original.svg" height="35" title="Cloudflare" />
  <img src="https://cdn.simpleicons.org/traefikproxy/24A1C1" height="35" title="Traefik" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" height="35" title="AWS" />
</p>

# AstraChess

A **premium, high-performance Chess application** allowing players to play against three levels of custom-built AI chess engines. It features an aesthetic **neo-brutalism design** frontend built using React and TypeScript, and an asynchronous, lightweight FastAPI backend.

---

## 🏛️ System Architecture

### Move Calculation Sequence Flow
```mermaid
%%{init: {
  'theme': 'neutral',
  'themeVariables': {
    'fontFamily': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, sans-serif',
    'primaryColor': '#ffffff',
    'primaryTextColor': '#000000',
    'primaryBorderColor': '#000000',
    'lineColor': '#000000',
    'secondaryColor': '#f4f4f5',
    'tertiaryColor': '#ffffff'
  }
}}%%
sequenceDiagram
    autonumber
    actor User as Client / Frontend
    participant API as FastAPI Backend
    participant Router as API Router
    participant Engine as Chess Engine (V1/V2/VIP)

    User->>API: Post FEN & Engine parameters (JSON)
    API->>Router: Parse and Validate request
    critical Move Search
        Router->>Engine: get_best_move(board, depth, time_limit)
        Engine->>Engine: Search game tree (Alpha-Beta / Iterative Deepening)
        Engine->>Engine: Evaluate positions & Order moves
    end
    Engine-->>Router: Return best Move (chess.Move)
    Router-->>API: Format MoveResponse (UCI + Stats)
    API-->>User: HTTP 200 OK (Success response with best move)
```

---

## 🖥️ Screen Previews

### 1. Match Playroom
<p align="center">
  <img src="docs/playroom.png" width="90%" style="border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" alt="AstraChess Playroom"/>
  <br/>
  <em>Interactive gameplay room against AI with move history and dynamic stats.</em>
</p>

### 2. Homepage & Difficulty Selection
<p align="center">
  <img src="docs/homepage.png" width="90%" style="border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" alt="AstraChess Homepage"/>
  <br/>
  <em>Aesthetic neo-brutalist landing page with quick match settings.</em>
</p>

### 3. AI Engine Levels
<p align="center">
  <img src="docs/3engine.png" width="90%" style="border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" alt="AI Engines"/>
  <br/>
  <em>Three custom AI engine difficulty levels: V1 (Alpha-Beta), V2 (ID + TT), and VIP (Advanced).</em>
</p>

---

## 🛠️ Technology Stack

| Component | Technical Selection | Purpose |
| :--- | :--- | :--- |
| **User Interface** | React 19 + TypeScript + Vite | Aesthetic dashboard, responsive styling, interactive chessboard. |
| **Chess rendering** | react-chessboard & chess.js | Move validation and graphic render pipeline. |
| **Gateway & Router** | Traefik (Production only) | Edge proxy routing secure HTTPS requests to Docker containers. |
| **API Web Server** | FastAPI (Python 3.11) | High-performance asynchronous REST endpoints. |
| **Chess Engines** | python-chess | Game state management and move generation. |
| **Database** | PostgreSQL (Neon DB) | Persistent storage for users, matches, and leaderboard. |
| **Containerization** | Docker & Docker Compose | Multi-stage slim container builds for production and development. |

---

## 📁 Repository Layout

```text
├── Backend/                 # FastAPI server codebase
│   ├── api/                 # FastAPI routes and endpoints
│   ├── core/                # App configuration, database sessions & models
│   ├── engines/             # Chess AI engines (BotV1, BotV2, BotVIP)
│   ├── models/              # Pydantic schemas for request/response
│   └── tests/               # Python unit testing suite
├── Frontend/                # React interface built using TypeScript
│   ├── public/              # Static assets (logo, preview)
│   ├── src/                 # React components, pages, hooks, state
│   └── index.html           # HTML entry point with SEO configuration
├── docker-compose.yml       # Local development multi-container setup
├── docker-compose.prod.yml  # Production container setup with Traefik
└── docs/                    # Interface screenshots and documentation assets
```

---

## ⚡ Quick Start Guide

### 1. Clone & Set Up Directory
```bash
git clone https://github.com/hnagnurtme/ChessAI.git
cd ChessAI
```

### 2. Configure Environment Variables
Create a `.env` configuration file in the project root:
```env
# Database connection URL
DATABASE_URL=postgresql://username:password@host:port/database_name?sslmode=require

# App settings
APP_NAME=chess-backend
APP_DOMAIN=api.astrachess.com

# Docker image configuration (optional)
DOCKERHUB_USERNAME=trunganh0106
IMAGE_BACKEND=chess-bot-backend
```

### 3. Run Locally with Docker Compose (Recommended)
This starts the backend container pulling from Docker Hub and exposes port `9999`:
```bash
docker compose up -d
```
Once healthy, navigate to:
* **Frontend UI:** `http://localhost:5173`
* **API Service:** `http://localhost:9999/health`

---

## ⚙️ Manual Development Setup

If you prefer to run the applications locally without Docker:

### Backend Development
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

### Frontend Development
```bash
cd Frontend
npm install
npm run dev
```

---

## 🧪 Testing and Formatting

Ensure all tests pass before making pull requests:

### Backend Tests
```bash
cd Backend
python -m unittest discover -s tests
```

### Frontend Code Quality
```bash
cd Frontend
npm run lint
npx tsc --noEmit
```

---

## 🛡️ Security, Licensing, and Contribution

This project follows professional open-source standards:

- **[MIT License](./LICENSE)** — Copyright (c) 2026 hnagnurtme.
- **[Contributing Guidelines](./CONTRIBUTING.md)** — Steps to report bugs, suggest features, and create pull requests.
- **[Security Policy](./SECURITY.md)** — Guide on reporting vulnerabilities and supported versions.
