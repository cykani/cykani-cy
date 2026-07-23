# Cykani Development Commands

## Build-Verify (always run after any UI change)

```bash
pnpm --filter ./apps/web build
```

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

## Development Workflow — Canonical Setup (Windows)

This is the **only** supported local dev setup. Do not use Docker Desktop, Podman, or any other container runtime.

### Prerequisites

- WSL2 with Ubuntu (or any Linux distro)
- Docker Engine installed *inside* WSL2 (see [Setup Notes](#setup-notes-docker-engine-in-wsl2))
- `pnpm` available inside WSL2 (install via `corepack enable && corepack prepare pnpm@9.15.0 --activate` or `npm i -g pnpm@9.15.0`)

### Repository Locations

The project exists in two places — **do not confuse them**:

| Location | Path | Platform | Filesystem | Purpose |
|---|---|---|---|---|
| **WSL (primary)** | `~/cykani-app` | Linux (WSL2) | ext4 (native, fast) | **Run dev server, build, git commits, all work** |
| Windows (backup only) | `C:\Users\sekani\Desktop\cykani\cykani-app` | Windows | NTFS (slow via 9P) | Read-only backup. Do not run any commands here. |

**Why two copies?** Running Next.js/tsx from `/mnt/c/` (Windows NTFS mounted in WSL) is ~10× slower due to the 9P protocol boundary. Filesystem watchers, builds, and git all suffer. WSL's native ext4 has none of these issues.

**To restore from backup** (if WSL primary is lost):
```bash
cp -r /mnt/c/Users/sekani/Desktop/cykani/cykani-app ~/cykani-app
cd ~/cykani-app && rm -rf node_modules .next && pnpm install
```

### Accessing WSL Files from Windows

- **File Explorer**: `\\wsl.localhost\Ubuntu\home\sekani\cykani-app`
- **VS Code**: From within WSL, run `code .` — opens on Windows with full WSL integration
- **Terminal**: `wsl -d Ubuntu` then `cd ~/cykani-app`

### Dev Loop

All commands run **inside WSL2** from `~/cykani-app`.

```bash
# 1. Enter WSL2 (from PowerShell)
wsl -d Ubuntu

# 2. Navigate to project (WSL native ext4 — fast)
cd ~/cykani-app

# 3. Start infrastructure (postgres + redis in WSL2 Docker)
docker compose up -d postgres redis

# 4. Install dependencies (first time, or after pulling)
pnpm install

# 5. Apply DB schema
cd apps/api && pnpm db:push && cd ../..

# 6. Start both API + web dev server in one command
pnpm dev
```

`pnpm dev` runs `turbo run dev --filter=@cykani/api --filter=cykani`, which spawns both servers in parallel with clean interleaved output:
- Web → http://localhost:3000
- API → http://localhost:3000 (same port, different paths — thenproxy handles routing)

### Individual commands (if you need separate terminals)

```bash
# Terminal 1
pnpm dev:api

# Terminal 2
pnpm dev:web
```

### Other tasks

```bash
pnpm typecheck
pnpm lint
pnpm build
cd apps/api && pnpm db:push   # apply schema changes
cd apps/api && pnpm db:studio # open Drizzle Studio
```

### Git workflow

Git operations run inside WSL just like any Linux dev machine. The remote is GitHub — nothing changes.

```bash
# Inside WSL, ~/cykani-app
git add .
git commit -m "message"
git push
```

VS Code from WSL (`code .`) handles git, extensions, and terminal seamlessly.

## Docker

Local infrastructure runs **Docker Engine inside WSL2** (not Docker Desktop). Containers stay inside WSL2's network — the dev servers must also run inside WSL2 to reach them.

```bash
# Start required services only
docker compose up -d postgres redis

# Full stack (production build)
docker compose up -d
```

### Browser Containers (Optional)

```bash
docker compose -f docker-compose.browser.yml up -d
docker compose -f docker-compose.browser.yml down
```

### Email — Listmonk (Optional)

```bash
docker compose -f docker-compose.email.yml up -d
open http://localhost:9000
# Default login: admin / ${LISTMONK_ADMIN_PASSWORD:-changeme}
```

### Setup Notes — Docker Engine in WSL2

Do this **once** per machine:

```bash
# 1. Enable systemd in WSL (required for Docker daemon auto-start)
wsl -d Ubuntu -u root bash -c "printf '\n[boot]\nsystemd=true\n' >> /etc/wsl.conf"

# 2. Restart WSL
wsl --shutdown
wsl -d Ubuntu

# 3. Start Docker daemon
sudo systemctl start docker
sudo systemctl enable docker

# 4. Verify
docker info
```

> No Docker Desktop, no Podman, no Rancher, no alternatives. This is the one true path.

## Environment Variables

### Core
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection (default: redis://localhost:6379)
- `JWT_SECRET` — JWT signing secret (min 32 chars)
- `AUTH_SECRET` — NextAuth secret
- `AUTH_URL` — NextAuth public URL (e.g., http://localhost:3001)
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth credentials
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — GitHub OAuth credentials

### Docker
- `DOCKER_SOCKET` — Docker socket path for browser sessions
- `BROWSER_IMAGE` — Browser container image

### Email (Listmonk)
- `EMAIL_API_URL` — Listmonk API URL (e.g., http://localhost:9000)
- `EMAIL_API_KEY` — Listmonk API key

### Browser Sessions
- `MAX_SESSIONS_PER_ORG` — Max concurrent sessions per org (default: 10)
- `SESSION_TIMEOUT_MINUTES` — Session timeout (default: 30)

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Docker Compose                                              │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Port 3001   │    │  Port 3000   │    │  Port 5432   │  │
│  │  Web (Next)  │◄──►│  API (Node)  │◄──►│ PostgreSQL   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                            │                                 │
│                     ┌──────────────┐                        │
│                     │  Port 6379   │                        │
│                     │  Redis       │                        │
│                     └──────────────┘                        │
│                                                              │
│  Optional: browser containers (docker-compose.browser.yml)   │
│  Optional: listmonk email   (docker-compose.email.yml)       │
└──────────────────────────────────────────────────────────────┘
```

---

# Marketing Site — Design System

This section governs only the **public marketing pages** (route group `(site)/`). The product/dashboard UI inside `[domain]/dashboard/` follows its own DESIGN_SYSTEM.md with Geist font, rounded corners, and softer hierarchy. Do not conflate the two.

## Aesthetic — do not deviate without asking

This is a deliberate rejection of the default AI-generated aesthetic (warm cream+serif, soft SaaS gradients). Brutalist / terminal-native, not "clean SaaS."

- **Type**: JetBrains Mono for everything (headings AND body) — no serif, no rounded sans fallback, no Geist.
- **Colors**: pure monochrome — near-black `#0A0A0A` bg, off-white `#EDEDED` text. No accent color. Status indicators in the terminal chrome use green (`#22C55E`) for connected/online states only.
- **Borders**: 1–2px solid, **zero border-radius**, visible hairlines instead of shadows. Cards sit flush against the grid.
- **Texture**: Bayer/ordered dithering on hero imagery — not a CSS filter, but a canvas/WebGL pass using a threshold matrix. Reference: `apps/web/src/components/ui/dither-shader.tsx` (already implements bayer, halftone, noise, crosshatch modes with duotone support).
- **ASCII rendering**: Map pixel brightness to a character ramp (` .:-=+*#%@`) at a fixed monospace grid — JetBrains Mono ensures consistent character width for this.
- **Motion**: minimal, snap not ease — instant state changes over smooth transitions fit the raw terminal look. Exceptions: spring-based dropdown entrance (120–150ms) is acceptable for UX.
- **Terminal chrome**: scanlines (`repeating-linear-gradient`), dot-matrix grid backgrounds, `$` prompt prefix on interactive code blocks. Always use a green status indicator for "connected" states.

## Never (anti-patterns)

- ❌ Gradients of any kind
- ❌ Drop shadows or box-shadows
- ❌ Rounded corners (keep `border-radius: 0` everywhere on marketing pages)
- ❌ Cream/terracotta/warm palette
- ❌ Generic hero cards with icon grids
- ❌ Font mixing — JetBrains Mono is the only font on marketing pages

## Dithering Reference

The existing `apps/web/src/components/ui/dither-shader.tsx` is the canonical implementation. It supports:

| Mode | Description |
|------|-------------|
| `bayer` | Ordered dithering using a Bayer 4x4 or 8x8 matrix — use this for hero images |
| `halftone` | Circle-based halftone pattern |
| `noise` | Random noise dither |
| `crosshatch` | Cross-hatch pattern |

Usage: `<DitherShader src={imageUrl} ditherMode="bayer" colorMode="duotone" primaryColor="#0A0A0A" secondaryColor="#EDEDED" gridSize={3} />`

To coarsen the effect, increase `gridSize`. To pixelate, increase `pixelRatio`.

## Iteration workflow

- **Small, scoped diffs only.** Do not guess at "more premium" — that adds decoration. Instead, ask or act on specific instructions like: "increase hairline border weight on cards", "run hero through ASCII at 16px cells", "tighten type scale to terminal output".
- **Screenshot-in-the-loop.** After making visual changes, the user will provide screenshots. Wait for them before further iteration — do not chain aesthetic changes without feedback.
- **Build-verify every change.** Run `pnpm --filter ./apps/web build` after any marketing page edit.
