# Cykani Development Commands

## Lint and Typecheck

```bash
pnpm typecheck
pnpm lint
pnpm turbo typecheck
pnpm turbo lint
```

## Install Browser Binary

```bash
CYKANI_BINARY_PATH=/path/to/cykani-browser/chrome node -e "require('./src/download.js').install()" || \
node /home/trend/Desktop/cykani-stealth/src/download.js
```

## Running Tests

```bash
pnpm --filter @cykani/api test
CYKANI_BINARY_PATH=/path/to/chrome pnpm --filter cykani-stealth-warp test:integration
```

## WSL2-Native Development (Required)

The app stack runs natively in WSL2 as regular Linux processes. No Docker Desktop.
Docker Engine inside WSL2 is used only for `cykani-browser` session containers.

### One-Time Setup

```bash
# Inside WSL2
bash wsl-setup.sh
```

This installs: Node.js 22, pnpm, PostgreSQL, Redis, Docker Engine (Linux daemon), nginx, and project dependencies.

### Starting the App

```bash
./start.sh
```

This starts:
- API on http://localhost:3000
- Web on http://localhost:3001

### Stopping the App

```bash
./stop.sh
```

### Service URLs (Native WSL2)

- API: http://localhost:3000
- Docs: http://localhost:3000/docs
- Web: http://localhost:3001
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- PostgreSQL user: cykani / password: cykani-dev (dev only)
- PostgreSQL DB: cykani

### Managing Native Services

```bash
# PostgreSQL
sudo systemctl status postgresql
sudo systemctl restart postgresql
sudo -u postgres psql -d cykani

# Redis
sudo systemctl status redis-server
sudo systemctl restart redis-server
redis-cli ping
```

## Docker in WSL2 (Browser Infrastructure Only)

Docker Engine runs natively inside WSL2 (not Docker Desktop).
Only `cykani-browser` session containers use Docker.

```bash
# Start browser infrastructure
docker compose -f docker-compose.browser.yml up -d

# Stop browser infrastructure
docker compose -f docker-compose.browser.yml down
```

### Important: No Docker Desktop

- Do not install Docker Desktop on Windows
- Docker Engine is installed and runs inside WSL2 Linux
- The Windows Docker socket is not used
- Browser containers run through the WSL2 Docker daemon

## Optional Services (Experimental)

These can be run as Docker containers if needed (via WSL2 Docker Engine):

### Email — Listmonk

```bash
docker compose --profile experimental up -d listmonk
open http://localhost:9000
# Default login: admin / ${LISTMONK_ADMIN_PASSWORD:-changeme}
```

### VNC — noVNC

```bash
docker compose --profile experimental up -d novnc
open http://localhost:6080
```

### Cache — Valkey

```bash
docker compose --profile experimental up -d valkey
redis-cli -p 6378 ping
```

## Environment Variables

### Core
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection (default: redis://localhost:6379)
- `VALKEY_URL` — Valkey connection (optional, takes precedence over REDIS_URL)
- `JWT_SECRET` — JWT signing secret (min 32 chars)
- `DOCKER_SOCKET` — Docker socket path for browser sessions
- `BROWSER_IMAGE` — Browser container image

### Email (Listmonk)
- `EMAIL_API_URL` — Listmonk API URL (e.g., http://localhost:9000)
- `EMAIL_API_KEY` — Listmonk API key

### VNC
- `VNC_BASE_PORT` — Base VNC port (default: 5900)
- `VNC_WS_PORT` — WebSocket port for noVNC (default: 6080)
- `VNC_PROXY_URL` — noVNC proxy URL (e.g., http://novnc:6080)

### Browser Sessions
- `MAX_SESSIONS_PER_ORG` — Max concurrent sessions per org (default: 10)
- `SESSION_TIMEOUT_MINUTES` — Session timeout (default: 30)

## Development Workflow

```bash
# Install dependencies
pnpm install

# Run API in dev mode
cd apps/api && pnpm dev

# Run Web in dev mode
cd apps/web && pnpm dev

# Typecheck all packages
pnpm typecheck

# Lint all packages
pnpm lint
```

## Architecture

```
┌─────────────────────────────────────────┐
│  Windows Host                           │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │  Browser UI  │    │  Port 3001   │  │
│  │  (localhost) │    │  Web (Next)  │  │
│  └──────┬───────┘    └──────┬───────┘  │
│         │                   │          │
├─────────┼───────────────────┼──────────┤
│         ▼                   ▼          │
│  WSL2 (Linux)                         │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │  Port 3000   │    │  Port 5432   │  │
│  │  API (Node)  │    │  PostgreSQL  │  │
│  └──────────────┘    └──────────────┘  │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │  Port 6379   │    │  Docker      │  │
│  │  Redis       │    │  Engine      │  │
│  └──────────────┘    └──────┬───────┘  │
│                             │          │
│                    ┌──────────────┐   │
│                    │ cykani-      │   │
│                    │ browser      │   │
│                    │ containers   │   │
│                    └──────────────┘   │
└─────────────────────────────────────────┘
```
