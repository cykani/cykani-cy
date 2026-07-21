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
CYKANI_BINARY_PATH=/path/to/chrome pnpm --filter cykani-stealth test:integration
```

## Development Workflow

```bash
# Install dependencies
pnpm install

# Run API in dev mode
pnpm --filter @cykani/api dev

# Run Web in dev mode
pnpm --filter ./apps/web dev

# Or use the Windows PowerShell script:
# .\dev.ps1

# Typecheck all packages
pnpm typecheck

# Lint all packages
pnpm lint
```

## Databases (Optional)

If you need PostgreSQL or Redis locally for development:

```bash
# PostgreSQL (Windows service or Docker)
# Default: localhost:5432, user: cykani, password: cykani-dev, db: cykani

# Redis (Windows service or Docker)
# Default: localhost:6379
```

## Browser Infrastructure (Optional)

If you need to run browser session containers locally:

```bash
# Requires Docker Desktop or Docker Engine
docker compose -f docker-compose.browser.yml up -d
docker compose -f docker-compose.browser.yml down
```

## Optional Services (Experimental)

### Email — Listmonk

```bash
docker compose -f docker-compose.email.yml up -d
open http://localhost:9000
# Default login: admin / ${LISTMONK_ADMIN_PASSWORD:-changeme}
```

### VNC — noVNC

```bash
# Requires Docker
docker compose -f docker-compose.yml --profile experimental up -d novnc
open http://localhost:6080
```

### Cache — Valkey

```bash
# Requires Docker
docker compose -f docker-compose.yml --profile experimental up -d valkey
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

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Windows Host / Local Machine                                │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Port 3001   │    │  Port 3000   │    │  Port 5432   │  │
│  │  Web (Next)  │◄──►│  API (Node)  │◄──►│ PostgreSQL   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐                       │
│  │  Port 6379   │    │   Docker     │                       │
│  │  Redis       │    │  (optional)  │                       │
│  └──────────────┘    └──────┬───────┘                       │
│                             │                                │
│                    ┌──────────────┐                         │
│                    │ cykani-      │                         │
│                    │ browser      │                         │
│                    │ containers   │                         │
│                    └──────────────┘                         │
└──────────────────────────────────────────────────────────────┘
```
