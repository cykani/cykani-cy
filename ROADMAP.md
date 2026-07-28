# Cykani — Revenue & Growth Roadmap

> Last updated: July 2026
> Status: Binary compilation in progress. Marketing site live at cykani.com.

---

## Product Architecture

| Product | License | Status | Revenue role |
|---|---|---|---|
| **cykani-cy** (this repo) | Apache 2.0 — open source | Live at cykani.com | Community, trust, GitHub stars, sponsors |
| **cykani-stealth** | Private / BSL | Binary compiling | Primary SDK revenue — developer licenses |
| **cykani-browser** | Private / closed | Binary compiling | Core execution engine, not sold separately |
| **cyka-agent** | BSL (in cyka-agent/) | Built, TypeScript | SDK revenue — commercial license required |

**Key insight:** cykani-cy being open source is a feature, not a liability. It builds community trust and GitHub stars while cykani-stealth and cykani-browser remain the closed commercial moat.

---

## Revenue Tracks (priority order)

### Track 1 — cykani-stealth SDK Licenses (HIGHEST PRIORITY)

**What:** Sell commercial licenses for cykani-stealth to developers who need stealth browser automation in their Node.js/TypeScript applications.

**Why now:** The binary is compiling. The BSL license is already in place. Zero infrastructure needed — just a license key server and payment link.

**Pricing (already on cykani.com):**
- Free: 3 sessions, open source cykani-cy only
- Pro: $19/month — 25 concurrent sessions, GeoIP rotation
- Enterprise: $79/month — unlimited, custom fingerprints, on-prem

**Payment:** Lemon Squeezy (configured but pending optimization per founder note). Currently redirecting to /contact — this is correct while binary compilation is in progress.

**Action items:**
- [ ] Complete Chromium binary compilation
- [ ] Configure Lemon Squeezy product variants for each tier
- [ ] Replace /contact redirects with Lemon Squeezy checkout links
- [ ] Post on r/webdev, r/webscraping, Hacker News (Show HN)

**Target timeline:** First paying customer within 2-4 weeks of binary completion.

---

### Track 2 — Done-for-you Automation Gigs (IMMEDIATE CASH, ZERO INFRA)

**What:** Sell the OUTPUT of automation, not the platform. Run workflows manually for clients.

**Why now:** No infrastructure needed. Run locally on your machine. Pure profit.

**Hot markets (from our workflow templates):**
- Job application campaigns: $200-500 per campaign (submit CV to 100+ jobs)
- Web research reports: $100-300 per report (law firms, consultancies)
- Bulk form submissions: $300-800 per batch (government portals, supplier onboarding)
- Booking automation: $150-400 per service setup

**Where to find clients:**
- r/forhire, r/slavelabour
- Upwork, PeoplePerHour, Fiverr
- LinkedIn outreach to law firms, agencies, e-commerce companies

**Action items:**
- [ ] Create service listings on Upwork and Fiverr
- [ ] Post 1 offer per week on r/forhire

**Target timeline:** First gig within 1-2 weeks.

---

### Track 3 — cykani.com Hosted Service (MONTH 3+ AFTER AWS CREDITS)

**What:** Users sign up on cykani.com, pay per browser session or monthly, you run everything on AWS infrastructure.

**Requires:** AWS Activate credits (apply now — see Infrastructure section below).

**Pricing model (session-based, like Browserbase):**
- Free tier: 10 sessions/month
- Starter: $29/month — 200 sessions
- Pro: $99/month — 1,000 sessions
- Enterprise: custom pricing

**What "one session" means:** One browser launch → task → close. The job application bot above would be ~100 sessions.

**Target timeline:** Month 3 after AWS credits received.

---

### Track 4 — GitHub Sponsors / Open Source Sponsorship

**What:** Companies and individuals sponsor cykani-cy development via GitHub Sponsors.

**Realistic revenue:** $200-2,000/month at scale. Supplementary, not primary.

**Prerequisites:** Needs GitHub stars (500+) and active community first.

**Target timeline:** Month 6+.

---

## Hermes Agent as Autonomous Marketing Team

**The idea:** Run Nous Research's Hermes Agent (MIT-licensed, 220k GitHub stars) as a background process that handles online presence, community engagement, and content posting — freeing you to focus on building.

**What Hermes can do autonomously:**
- Monitor Reddit, Hacker News, Twitter for mentions of "stealth browser", "playwright blocked", "undetected chromium", "bot detection bypass"
- Engage with those conversations with accurate information about Cykani
- Post weekly updates to r/webdev, r/webscraping, DEV.to
- Write and publish blog posts to cykani.com/blog on a schedule
- Respond to GitHub issues with context
- Draft email responses to sales@cykani.com inquiries

**What Hermes CANNOT do:** Make decisions requiring your judgment (pricing deals, partnerships, legal).

**Infrastructure needed:**
- Hermes Agent framework: runs on your local machine OR a $5/month VPS
- LLM inference: Groq free tier (Llama 3.1 70B via API — same quality as Hermes 3)
- Browser actions: cykani-stealth binary (already building)
- Total cost: $0-5/month

**Setup steps (after binary is ready):**
```bash
# 1. Install Hermes Agent (MIT)
pip install hermes-agent

# 2. Configure with Groq API (free tier)
hermes config set provider groq
hermes config set api_key $GROQ_API_KEY
hermes config set model llama-3.1-70b-versatile

# 3. Give Hermes the Cykani context
# (document what Cykani is, pricing, target audience, tone of voice)

# 4. Set up scheduled tasks
hermes schedule add "daily-reddit-engagement" --cron "0 9 * * *"
hermes schedule add "weekly-blog-post" --cron "0 10 * * MON"
```

**Important:** Hermes needs clear instructions and constraints. It is NOT a fire-and-forget system. You review its draft posts before it sends, at least for the first month, then graduate to autonomous mode once the tone is calibrated.

---

## Infrastructure Plan

### Current state
- Frontend: Vercel (free tier) — cykani.com ✅
- Backend API: TBD
- Database: TBD
- cykani-stealth binary: compiling locally

### AWS Activate (apply immediately)
- Program: AWS Activate for Startups
- URL: https://aws.amazon.com/startups/credits
- Credits: up to $100,000 in AWS infrastructure credits
- Type: Infrastructure credits (NOT cash) — covers EC2, RDS, S3, ECS, Lambda
- Eligibility: Early-stage startup, no prior AWS credits required
- Application time: ~10 minutes
- Decision time: 2-5 business days

**Also apply:**
- AWS EEIP (South African Black-Owned SMEs): https://aws.amazon.com/partners/eeip/
- Startup Afrika Program (African startups on AWS): https://startupafrika.com/

### What AWS credits cover for Cykani

| Service | AWS product | Est. monthly |
|---|---|---|
| cykani-stealth runner (Linux + Chrome) | EC2 t3.medium | $30-60/mo |
| cykani-cy API (Hono) | EC2 t3.small or Lambda | $10-20/mo |
| Hermes Agent server | EC2 t3.small (4GB RAM) | $20-40/mo |
| Database | RDS Postgres t3.micro | $15-25/mo |
| Redis (BullMQ) | ElastiCache t3.micro | $15-20/mo |
| Storage (screenshots, sessions) | S3 | $2-10/mo |
| Container registry | ECR | $1-3/mo |
| **Total** | | **~$100-180/mo** |

At $25,000 credits: ~12-20 months runway at demo scale.

### What AWS credits DO NOT cover (use free tiers)

| Need | Free solution |
|---|---|
| LLM inference (AI agents) | Groq free tier — 14,400 req/day, Llama 3.1 70B |
| Hermes 3 model specifically | OpenRouter free tier — serves NousResearch/hermes-3-llama-3.1-405b |
| Email (transactional) | Resend free tier — 3,000 emails/month |
| Monitoring | Better Stack free tier |
| Error tracking | Sentry free tier |

---

## Competitive Context (from market research July 2026)

The stealth browser space is active. Known players:
- **Browserbase + Stagehand** (MIT) — cloud sessions, $0.10/session
- **Steel.dev** — stealth browser for agents
- **BotBrowser** — C++ Chromium patches, similar approach to cykani-stealth
- **CloakBrowser** — Python/JS wrapper, similar moat
- **browser-harness** (MIT, 15.8k stars) — thin CDP harness, complementary

**Cykani's differentiation:**
1. 26 C++ patches (binary-level, not JS injection) — same approach as BotBrowser/CloakBrowser but with full platform
2. cykani-cy open source platform — community flywheel BotBrowser doesn't have
3. Integrated AI agent layer (cyka-agent) — not just a browser, a full automation platform
4. African-founded — relevant for NYDA/SEDA/AWS EEIP programs

---

## Third-party integrations (strategic, not required now)

All MIT-licensed, zero licensing risk:

| Integration | What it adds | Priority |
|---|---|---|
| **Stagehand** (browserbase/stagehand) | Browserbase cloud sessions as alternative backend | Medium |
| **browser-harness** (browser-use/browser-harness) | Ultra-thin CDP, attach to existing Chrome | Medium |
| **Hermes Agent** (NousResearch/hermes-agent) | Self-improving agent with learning loop | High (marketing + product) |
| **browser-use** (browser-use/browser-use) | Python ecosystem compatibility | Low |

Users of cykani.com never install any of these — they run on your backend. Developers using cykani-stealth SDK get them as optional `provider:` config options.

---

## NYDA / SEDA

- **NYDA (National Youth Development Agency):** Youth-owned business funding. No deadline — waitlist. Apply at nyda.gov.za. Requires: registered SA business, under 35, business plan.
- **SEDA (Small Enterprise Development Agency):** SME funding and support. No deadline — rolling applications. Apply at seda.org.za.

Both require a registered business entity. If not registered yet, that is the prerequisite.

---

## Google for Startups Accelerator SA 2026 — APPLY NOW

**Up to R1,000,000 cash — non-dilutive, equity-free.**

- Program: 3-month hybrid accelerator, Sep 28 – Dec 4, 2026
- Applications: OPEN NOW (deadline TBC — apply immediately)
- Apply at: https://startup.google.com/programs/accelerator/south-africa/
- Also: Google Africa Applied AI Lab — open July 1–August 31, 2026

This is AI-focused. Cykani fits perfectly: AI-powered browser automation, stealth execution engine, South African-founded.

**What they're looking for:** Growth-stage, AI-driven startups based in South Africa. You qualify.

**The Idris Elba + Google $1M initiative** (announced July 2026 at Google Africa Cloud Summit in Johannesburg) is specifically for creative sector content creators — not directly applicable, but shows Google's deep commitment to the African tech ecosystem right now. The timing of Google for Startups SA 2026 launching simultaneously is not a coincidence.

---

## AWS Programs

- **AWS Activate:** Up to $100,000 in infrastructure credits. Apply at https://aws.amazon.com/startups/credits — rolling, no deadline.
- **AWS EEIP (South African Black-Owned SMEs):** 18-24 month program. https://aws.amazon.com/partners/eeip/
- **Startup Afrika Program:** Quarterly cohort for African startups on AWS. https://startupafrika.com

---

## 12-Month Revenue Projection (conservative)

| Month | Action | Est. MRR |
|---|---|---|
| 0-1 | Binary done, first Reddit posts, Upwork gigs | $0-500 |
| 2 | First SDK license customers via Lemon Squeezy | $500-1,500 |
| 3 | AWS credits received, hosted service launched | $1,000-3,000 |
| 6 | Growing SDK + hosted + gigs, Hermes running autonomously | $3,000-8,000 |
| 12 | Established community, referrals, enterprise inquiries | $8,000-20,000 |

These are conservative estimates. A single viral HN post or one enterprise contract changes the trajectory significantly.
