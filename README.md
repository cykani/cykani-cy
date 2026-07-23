<br />
<p align="center">
<a href="https://cykani.dev">
  <img src="apps/web/public/logo_black.png" alt="Cykani Logo" width="100">
</a>
</p>

<h3 align="center"><b>Cykani</b></h3>
<p align="center">
    <b>The stealth browser platform for AI agents & automation.</b> <br />
    Undetectable by design. Built for scale.
</p>

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://typescriptlang.org)
[![Discord](https://img.shields.io/discord/cykani?label=discord)](https://discord.gg/cykani)
[![GitHub stars](https://img.shields.io/github/stars/cykani/cykani-stealth)](https://github.com/cykani/cykani-stealth)

</div>

<h4 align="center">
    <a href="https://cykani.dev/pricing" target="_blank">Buy Now</a>  ·
    <a href="https://cykani.dev/docs" target="_blank">Documentation</a>  ·
    <a href="https://cykani.dev" target="_blank">Website</a> ·
    <a href="https://github.com/cykani/cykani-stealth" target="_blank">SDK</a>
</h4>

## Highlights

[Cykani](https://cykani.dev) is a stealth browser automation platform that makes your automation invisible. Instead of fighting bot detection, Cykani patches Chromium at the C++ level — websites can't tell it from a real browser.

Under the hood, it manages sessions, fingerprints, proxies, and browser processes:

- **26 C++ Stealth Patches** — Canvas, WebGL, audio, fonts, GPU, timezone all patched before compilation
- **Passes Every Detection Test** — Cloudflare Turnstile, reCAPTCHA v3, FingerprintJS, Akamai, BrowserScan
- **Human-Like Behavior** — Bezier mouse curves, cognitive hesitation, idle micro-movements, coffee breaks
- **Session Persistence** — Cookies, localStorage, IndexedDB preserved across sessions
- **Proxy Network** — Residential & datacenter proxies across 190+ countries with auto-rotation
- **AI Agents** — Autonomous browser automation with heuristic decision-making
- **CDP Compatible** — Works with Playwright, Puppeteer, or any CDP client
- **Enterprise Dashboard** — Manage teams, billing, API keys, and analytics

> Cykani is in active development. Your feedback helps us improve. Join the conversation on [Discord](https://discord.gg/cykani) or open a [GitHub issue](https://github.com/cykani/cykani-cy/issues).

### Make sure to give us a star ⭐

[![Star on GitHub](https://img.shields.io/badge/Star-GitHub-yellow?style=for-the-badge&logo=github&logoColor=white)](https://github.com/cykani/cykani-stealth)

## Quick Deploy

| Deployment | Link |
|------------|------|
| Vercel (Marketing + Dashboard) | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cykani/cykani-cy) |
| Docker (Full Stack) | [![Deploy with Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://github.com/cykani/cykani-cy#docker) |
| cykani-stealth SDK | [![npm](https://img.shields.io/badge/npm-cykani--stealth-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/cykani-stealth) |

## Running Locally

### Docker

The simplest way to run Cykani locally:

```bash
# Clone the repo
git clone https://github.com/cykani/cykani-cy.git
cd cykani-cy

# Start infrastructure (PostgreSQL + Redis)
docker compose up -d postgres redis

# Install dependencies
pnpm install

# Push database schema
cd apps/api && pnpm db:push && cd ../..

# Start dev servers
pnpm dev
```

This starts:
- **Marketing Site** → `http://localhost:3001`
- **API** → `http://localhost:3000`
- **API Docs** → `http://localhost:3000/docs`

### Quick Start with SDK

```bash
# Install the stealth SDK
npm install cykani-stealth
```

```javascript
import { strike } from 'cykani-stealth';

// Launch a stealth session
const session = await strike({ humor: true, fingerprint: 42 });

// Browse like a human
await session.goto('https://example.com');
await session.autoPilot().signIn({ 
  email: 'user@site.com', 
  password: 'secret' 
});

await session.close();
```

## Usage

There are three ways to use Cykani:

1. **[SDK](#sdk-usage)** — Direct integration with Playwright/Puppeteer
2. **[REST API](#rest-api)** — HTTP endpoints for session management
3. **[Dashboard](#dashboard)** — Web UI for team management

### SDK Usage

The `cykani-stealth` SDK is a drop-in Playwright replacement with stealth patches.

<details open>
<summary><b>Basic Session</b></summary>

```javascript
import { strike, highTrust, aggressive } from 'cykani-stealth';

// Default stealth mode
const session = await strike();
await session.goto('https://example.com');

// High trust mode (slower, more human-like)
const safe = await highTrust();
await safe.goto('https://sensitive-site.com');

// Aggressive mode (fast, minimal delay)
const fast = await aggressive();
await fast.goto('https://target.com');
```
</details>

<details>
<summary><b>AutoPilot (No Selectors)</b></summary>

```javascript
const session = await strike({ humor: true });
const ap = session.autoPilot();

await ap.signIn({ email: 'user@site.com', password: 'pass' });
await ap.search('cykani stealth');
await ap.paginate('next');
await ap.findAndFill('email', 'user@site.com');
await ap.findAndClick('submit');
```
</details>

<details>
<summary><b>Autonomous Browsing</b></summary>

```javascript
const session = await strike();
const auto = session.autonomous();

// Browse naturally for 30 seconds
await auto.act(30000);

// Analyze page and get recommendations
const analysis = await auto.analyze();
console.log(analysis.pageType); // "login", "captcha", "article", etc.
```
</details>

<details>
<summary><b>CDP Connection</b></summary>

```javascript
import { connectOverCDP } from 'cykani-stealth';

const session = await connectOverCDP('http://127.0.0.1:9222', { humor: true });
await session.goto('https://example.com');
await session.close();
```
</details>

### REST API

All routes under `/v1/`. Authenticated via JWT or API key.

<details open>
<summary><b>Create a Session</b></summary>

```bash
curl -X POST http://localhost:3000/v1/sessions \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "profileId": "<profile-id>",
    "proxy": "http://user:pass@host:port"
  }'
```
</details>

<details>
<summary><b>Create a Profile</b></summary>

```bash
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
```
</details>

<details>
<summary><b>List Plans</b></summary>

```bash
curl http://localhost:3000/v1/billing/plans
```
</details>

### Dashboard

The Next.js dashboard provides:

- **Organization Management** — Create workspaces, invite team members
- **Billing** — Upgrade plans, manage subscriptions via Lemon Squeezy
- **API Keys** — Generate and manage programmatic access keys
- **Settings** — Appearance, email, usage tracking

Access at `http://localhost:3001` after starting dev servers.

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      CYKANI PLATFORM                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Marketing   │  │  Dashboard   │  │  REST API        │  │
│  │  Next.js 16  │  │  Next.js 16  │  │  Hono            │  │
│  │  Landing +   │  │  Auth, Orgs, │  │  Sessions,       │  │
│  │  Docs        │  │  Billing     │  │  Profiles,       │  │
│  │              │  │              │  │  Agents, Proxies │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Infrastructure                      │   │
│  │  PostgreSQL 16  │  Redis 7  │  Docker Engine         │   │
│  │  (Neon/Supabase) │ (Upstash) │ (cykani-browser)      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 cykani-stealth SDK                    │   │
│  │  26 C++ stealth patches · Fingerprint isolation       │   │
│  │  Human-like behavior · GeoIP auto-detection           │   │
│  │  Playwright/Puppeteer/CDP compatible                  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## Pricing

| Plan | Price | Sessions | Features |
|------|-------|----------|----------|
| **Free** | $0 | 3 | Fingerprint signals, community support |
| **Pro** | $19/mo | 25 | GeoIP rotation, HAR export, priority support |
| **Enterprise** | $79/mo | Unlimited | Custom configs, SSO/SAML, SLA, on-prem |

[**Buy Now →**](https://cykani.dev/pricing) · Card, PayPal, Alipay, crypto (USDT, USDC, BTC, ETH)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS v4, shadcn/ui |
| **Backend** | Hono, TypeScript, Drizzle ORM |
| **Database** | PostgreSQL 16 (Neon for production) |
| **Cache** | Redis 7 (Upstash for production) |
| **Auth** | NextAuth v5 (Google, GitHub, Email) |
| **Payments** | Lemon Squeezy (120+ payment methods) |
| **Build** | Turborepo, pnpm workspaces |
| **Deploy** | Vercel (frontend), Docker (backend) |
| **Stealth** | cykani-stealth (26 C++ patches) |

## Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

Join our [Discord](https://discord.gg/cykani) for discussion.

## License

[MIT License](LICENSE) — Free for commercial use.

---

Made with precision by the [Cykani](https://cykani.dev) team.
