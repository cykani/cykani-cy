# Sweepstakes Casino Farming

> Zero KYC · Zero deposit · Pure profit per account

---

## How It Works

Sweepstakes casinos are US-legal social casinos. They give away **free Sweeps Coins (SC)** at signup — no deposit required. SC converts 1:1 to real cash after a 1x playthrough. Your stealth browser stack is purpose-built for this:

- Each account = unique browser fingerprint (stymie seed)
- Each account = unique proxy, GeoIP-matched (datacenter often works; test per platform)
- Humor module = human-like registration (hesitation, mouse movements, keystroke timing)
- Session state persistence = save cookies for automated daily login bonus collection

---

## Top Platforms & Payouts

| Platform | Signup Bonus | SC Value | Daily Login | Playthrough | Min. Withdrawal |
|----------|-------------|----------|-------------|-------------|----------------|
| **Stake.us** | 25 SC + 250K GC | ~$25 | 1 SC + 10K GC | 3x | 40 SC |
| **RealPrize** | 2 SC + 100K GC | ~$2 | 0.3 SC + 5K GC | 1x | 45 GC / 100 cash |
| **Crown Coins** | 2 SC + 100K CC | ~$2 | varies (wheel) | 1x | 50 SC |
| **McLuck** | 2.5 SC + 7.5K GC | ~$2.50 | 0.2 SC + 1.5K GC | 1x | 50 SC |
| **Pulsz** | 2.3 SC + 5K GC | ~$2.30 | varies by level | 1x | 100 cash / 10 GC |
| **MegaBonanza** | 2.5 SC + 7.5K GC | ~$2.50 | 0.2 SC + 1.5K GC | 1x | 10 GC / 75 cash |
| **HelloMillions** | 2.5 SC + 15K GC | ~$2.50 | 0.2 SC + 1.5K GC | 1x | 10 GC / 50 cash |
| **WOW Vegas** | 5 SC + 250K WC | ~$5 | 1.5 SC + 50K WC (first 30d) | 1x | 25 SC |
| **LoneStar** | 2.5 SC + 100K GC | ~$2.50 | 0.3 SC + 5K GC | 1x | 45 GC / 100 cash |

---

## Per-Account Math

| Platform | Signup SC | Signup Value | Daily SC/Month | Total Value |
|----------|-----------|-------------|----------------|-------------|
| Stake.us | 25 | $25.00 | 30 SC | $55.00 |
| RealPrize | 2 | $2.00 | 9 SC | $11.00 |
| Crown Coins | 2 | $2.00 | 9 SC (est.) | $11.00 |
| McLuck | 2.5 | $2.50 | 6 SC | $8.50 |
| Pulsz | 2.3 | $2.30 | 6 SC (est.) | $8.30 |
| MegaBonanza | 2.5 | $2.50 | 6 SC | $8.50 |
| HelloMillions | 2.5 | $2.50 | 6 SC | $8.50 |
| WOW Vegas | 5 | $5.00 | 45 SC | $50.00 |
| LoneStar | 2.5 | $2.50 | 9 SC | $11.50 |
| **Total** | **46.3 SC** | **$46.30** | — | **~$172/account** |

---

## Scale Scenarios

| Accounts/Day | Setup Time | Daily Revenue | Monthly Revenue |
|-------------|-----------|--------------|-----------------|
| 10 | ~5 min each | ~$1,693 | ~$50,790 |
| 25 | ~3 min each | ~$4,232 | ~$126,975 |
| 50 | ~2 min each | ~$8,465 | ~$253,950 |
| 100 | automated | ~$16,930 | ~$507,900 |

---

## Infrastructure Requirements

| Resource | Per 10 Accounts | Per 100 Accounts |
|----------|----------------|------------------|
| **Proxies** (datacenter OK) | 10 unique IPs | 100 unique IPs |
| **Disposable emails** | 10 inboxes | 100 inboxes |
| **Browser profiles** | 10 fingerprints | 100 fingerprints |
| **Disk** | ~200 MB (cookies/session) | ~2 GB |

---

## The Pipeline

```
┌────────────┐   ┌───────────┐   ┌────────────┐   ┌───────────┐
│  Identity   │   │  Browser   │   │  Register   │   │  Verify   │
│  Generator  ───▶│  Launch   ───▶│  + Claim    ───▶│  Email    │
│  (Faker)    │   │  (Stealth) │   │  Bonus      │   │  (IMAP)   │
└────────────┘   └───────────┘   └────────────┘   └──────────┘
                                                         │
┌────────────┐   ┌───────────┐   ┌────────────┐         │
│  Withdraw   │   │  Play      │   │  Bonus     │         │
│  → Bank/PayPal│◀──│  1x       ◀───│  Collected │◀────────┘
└────────────┘   └───────────┘   └────────────┘
```

---

## Playthrough Strategy

SC requires **1x playthrough** before withdrawal. Minimize risk:

1. Play **high RTP slots** (96%+) — expected loss is ~4% of SC
2. Or play **blackjack** with basic strategy (~0.5% house edge)
3. Withdraw immediately after playthrough requirement met

**Expected loss per $100 SC**: ~$0.50–$4.00 (net profit: $96–$99.50)

---

## Automation Checklist

- [ ] Identity generation (name, email, DOB, address per locale)
- [ ] Proxy pool (1 per account, GeoIP-matched; datacenter often sufficient)
- [ ] Fingerprint rotation (unique stymie seed per account)
- [ ] Registration flow (humor-emulated typing, clicks, delays)
- [ ] Email verification (IMAP polling, auto-click confirm link)
- [ ] Bonus tracking (which platforms credited, which didn't)
- [ ] Playthrough automation (high-RTP slot scripts, bet sizing)
- [ ] Withdrawal funnel (bank/PayPal per account)
- [ ] Daily login bot (recurring session restore for SC drip)

---

## Platform-Specific Notes

### Stake.us
- Strongest overall: 25 SC free + 1 SC daily login
- Telegram-based giveaways
- 1x playthrough on slots, 5x on table games

### RealPrize
- Modest signup (2 SC) but 1x playthrough
- Daily login: 0.3 SC + 5K GC
- 45 GC / 100 cash minimum withdrawal

### WOW Vegas
- Good daily SC (1 SC/day)
- Social media bonuses

### LoneStar
- Daily SC (1 SC/day) + frequent promos
- 45 SC minimum withdrawal

---

## Legal

Sweepstakes casinos operate legally in the US under sweepstakes law — no purchase necessary, void where prohibited. All platforms require 18+ (21+ in some states). This is not financial advice. Verify compliance with your jurisdiction.
