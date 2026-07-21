# Cykani

**Browser automation platform.** Launch undetectable, fingerprinted browser sessions in Docker containers — controlled via REST API, automated by AI agents, and streamed over VNC.

> Built with [Hono](https://hono.dev), [Next.js](https://nextjs.org), [Drizzle ORM](https://orm.drizzle.team), [Redis](https://redis.io), [Docker](https://docker.com), and [Turborepo](https://turbo.build).

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Cykani SDK                        │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │  Hono    │  │  Next.js 16  │  │  Trigger.dev   │ │
│  │  API     │  │  Studio UI   │  │  Background    │ │
│  │  :3000   │  │  :3001       │  │  Jobs          │ │
│  └────┬─────┘  └──────────────┘  └───────┬────────┘ │
│       │                                   │          │
│  ┌────▼───────────────────────────────────▼────────┐ │
│  │           Container (DI) + Routes               │ │
│  │  /v1/sessions · /v1/profiles · /v1/agents       │ │
│  │  /v1/proxies · /v1/orgs · /v1/billing           │ │
│  │  /v1/analytics · /v1/realtime (SSE)             │ │
│  └─────────────────────┬───────────────────────────┘ │
│                        │                              │
│  ┌─────────────────────▼───────────────────────────┐ │
│  │  Docker Engine  │  Redis  │  PostgreSQL 16      │ │
│  │  (cykani-browser│  (cache,│  (Drizzle ORM)      │ │
│  │   containers)   │  pubsub,│                     │ │
│  │                 │  queue) │                     │ │
│  └─────────────────┴─────────┴─────────────────────┘ │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │  cykani-stealth-warp                            │ │
│  │  └─ connectOverCDP() → stealth session          │ │
│  │  └─ Humor module (human-like behavior)          │ │
│  │  └─ Constellation injection (stealth patches)   │ │
│  │  └─ Fingerprint by seed + proxy geoip           │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Services

| Component | Description |
|-----------|-------------|
| **API** | Hono HTTP server. REST API for sessions, profiles, agents, proxies, orgs, billing, analytics. Real-time SSE streaming. OpenAPI docs at `/docs`. |
| **Web** | Next.js 16 admin dashboard (studio-admin). shadcn/ui + Radix UI + Tailwind CSS v4. |
| **Trigger** | Trigger.dev background tasks — session launch (Docker), session cleanup, agent step execution via CDP. |
| **Database** | PostgreSQL 16 with Drizzle ORM. Schema: organizations, profiles, sessions, agents, proxies, subscriptions, api_keys, usage_records. |
| **Redis** | Caching (session cache), pub/sub (domain events), rate limiting (sliding window), BullMQ job queues. |
| **Docker** | Launches `cykani-browser` containers with fingerprint flags. Each session = isolated browser instance with VNC + CDP ports. |
| **Stealth** | `cykani-stealth-warp` wraps each browser with undetectable fingerprints, human-like behavior emulation, and anti-detection patches. |

### Domain Model

```
Organization
  ├── Profiles (fingerprint config: seed, platform, viewport, locale, proxy)
  ├── Sessions (browser instances: Docker container + VNC + CDP)
  │     └── Agents (AI step execution over CDP)
  ├── Proxies (HTTP/HTTPS/SOCKS5 per profile)
  ├── Subscriptions (plan, Stripe billing)
  ├── Usage Records (session minutes, agent steps)
  └── API Keys (scoped access)
```

### Session Lifecycle

```
idle → launching → running → stopping → stopped
                                └──→ error
```

- **launching**: DockerEngine pulls image, starts container, assigns ports
- **running**: Browser accessible via CDP (`ws://host:cdpPort`) + VNC (`ws://host:vncPort`)
- **stopping**: StealthService disconnects, container destroyed, ports freed

---

## Getting Started

### Prerequisites

- Node.js ≥20
- pnpm 9.15+
- Docker + Docker Compose
- PostgreSQL 16
- Redis 7

### Install

```bash
# Clone
git clone <repo> cykani && cd cykani

# Install dependencies
pnpm install

# Start databases (PostgreSQL + Redis)
docker compose -f deploy/docker-compose.databases.yml up -d

# Set up environment
cp apps/api/.env.example apps/api/.env
# Edit .env with your values

# Push database schema
pnpm db:push

# Start development
pnpm dev
```

This starts:
- **API** → `http://localhost:3000`
- **Web** → `http://localhost:3001`
- **Docs** → `http://localhost:3000/docs`
- **DB** → `localhost:5432`
- **Redis** → `localhost:6379`

### Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment |
| `PORT` | `3000` | API HTTP port |
| `DATABASE_URL` | — | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `JWT_SECRET` | — | JWT signing key (min 32 chars) |
| `DOCKER_SOCKET` | `/var/run/docker.sock` | Docker socket path |
| `BROWSER_IMAGE` | `cykani-browser:latest` | Browser container image |
| `MAX_SESSIONS_PER_ORG` | `10` | Concurrent session limit |

---

## Packages

| Package | Description |
|---------|-------------|
| `@cykani/api` | Hono API server — routes, services, DI container |
| `studio-admin` | Next.js 16 admin dashboard |
| `@cykani/db` | Drizzle ORM schema + PostgreSQL client |
| `@cykani/redis` | Redis client, pub/sub, rate limiter, BullMQ queues |
| `@cykani/types` | Shared TypeScript types |
| `@cykani/vnc` | NoVNC WebSocket proxy |
| `@cykani/config` | Shared tsconfig |
| `@cykani/trigger` | Trigger.dev background tasks |

---

## API Overview

All routes under `/v1/`. Authenticated via JWT (`Authorization: Bearer <token>`) or API key (`X-API-Key: ck_...`).

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/v1/sessions` | GET, POST | List / create browser sessions |
| `/v1/profiles` | GET, POST | List / create fingerprint profiles |
| `/v1/agents` | GET, POST | List / create automation agents |
| `/v1/proxies` | GET, POST | List / create proxy configurations |
| `/v1/orgs` | GET, POST | Organization management |
| `/v1/billing` | GET, POST | Subscription plans + Stripe checkout |
| `/v1/analytics` | GET | Usage analytics |
| `/v1/realtime` | GET | SSE event stream |
| `/health` | GET | Health check |
| `/docs` | GET | Swagger UI |

### Creating a Session

```bash
# Create a profile first
curl -X POST http://localhost:3000/v1/profiles \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Windows Chrome",
    "fingerprintSeed": 4764,
    "platform": "windows",
    "locale": "en-US",
    "timezone": "America/New_York"
  }'

# Launch a session
curl -X POST http://localhost:3000/v1/sessions \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "profileId": "<profile-id>"
  }'

# Response includes containerId, cdpPort, vncPort, vncPassword
```

---

## Development

### Commands

```bash
pnpm dev              # Start all services
pnpm stop             # Stop all services
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm typecheck        # Type check all packages
pnpm test             # Run all tests
pnpm db:push          # Push Drizzle schema to database
pnpm db:studio        # Open Drizzle Studio
```

### Stealth Integration

Browser sessions connect to `cykani-stealth-warp` via `connectOverCDP()` for:

- **Fingerprint spoofing** per stymie seed (`--fingerprint`, `--fingerprint-platform`)
- **Human behavior emulation** (hesitation, precision, cognitive load, mouse movements)
- **Performance API stealth** (quantized `now()`, spoofed `memory`)
- **Session state persistence** (cookies, localStorage, sessionStorage)
- **GeoIP auto-resolution** from proxy IP (timezone + locale)

---

## Deployment

### Docker

```bash
docker compose -f deploy/docker-compose.databases.yml up -d
```

The API and web apps are run via `start.sh` in development. Production deployment uses the compiled `dist/` output from `pnpm build`.

### Infrastructure Requirements

- Docker with `cykani-browser:latest` image (or custom browser image)
- PostgreSQL 16
- Redis 7
- Docker socket accessible for container orchestration

---

## License

Private · All rights reserved.
