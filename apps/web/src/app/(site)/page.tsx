import type { Metadata } from "next";

import { ComparisonSection } from "@/components/www/comparison-section";
import { CtaSection } from "@/components/www/cta-section";
import { FaqSection } from "@/components/www/faq-section";
import { FeatureGrid } from "@/components/www/feature-grid";
import { HeroSection } from "@/components/www/hero-section";
import { MetricsSection } from "@/components/www/metrics-section";
import { PricingCard } from "@/components/www/pricing-card";
import { SecurityBadges } from "@/components/www/security-badges";
import { TestimonialsSection } from "@/components/www/testimonials-section";

import styles from "./landing.module.css";

const products = [
  {
    name: "Stealth Browser",
    tag: "CORE",
    desc: "Anti-fingerprint Chromium with 26 C++ stealth patches. Canvas, WebGL, audio, and timezone isolation out of the box.",
  },
  {
    name: "Session Cloud",
    tag: "INFRA",
    desc: "Persistent browser sessions with cookie, localStorage, and IndexedDB preservation. Scalable from 1 to 10,000 concurrent sessions.",
  },
  {
    name: "Proxy Network",
    tag: "NETWORK",
    desc: "Residential and datacenter proxies across 190+ countries. Rotate per session or per request with automatic failover.",
  },
  {
    name: "AutoPilot",
    tag: "AI",
    desc: "Heuristic browser automation without selectors. Bezier curves, cognitive hesitation, and idle micro-movements for human-like behavior.",
  },
  {
    name: "SDKs",
    tag: "DEVELOPER",
    desc: "TypeScript, Python, and Go clients with async context managers, type hints, and full IntelliSense support.",
  },
  {
    name: "CDP Gateway",
    tag: "PROTOCOL",
    desc: "Full Chrome DevTools Protocol support. Connect with Playwright, Puppeteer, or any CDP-compatible client.",
  },
];

const clients = [
  { name: "Acme Corp", type: "Enterprise" },
  { name: "Globex", type: "Enterprise" },
  { name: "Soylent", type: "Enterprise" },
  { name: "Initech", type: "Enterprise" },
  { name: "Umbrella", type: "Enterprise" },
  { name: "Stark Industries", type: "Enterprise" },
];

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "For prototyping and personal projects.",
    features: ["3 concurrent sessions", "100 fingerprint signals", "Community support", "Shared infrastructure"],
    cta: "Start Free",
    href: "/cykani/dashboard/settings",
  },
  {
    name: "Pro",
    price: "$49",
    period: "mo",
    description: "For teams shipping production automation.",
    features: [
      "25 concurrent sessions",
      "100+ fingerprint signals",
      "GeoIP rotation",
      "HAR export",
      "Priority support",
      "Dedicated infrastructure",
    ],
    cta: "Get Started",
    href: "/cykani/dashboard/settings",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For orgs with compliance and scale requirements.",
    features: [
      "Unlimited sessions",
      "Custom fingerprint configs",
      "SSO / SAML",
      "SLA guarantee",
      "Dedicated support",
      "On-prem deployment",
    ],
    cta: "Contact Sales",
    href: "mailto:info@cykani.com",
  },
];

const releases = [
  {
    version: "v0.9.0",
    date: "2026-07-18",
    title: "Stealth Browser Beta",
    changes: [
      "Initial Chromium binary with 26 C++ stealth patches",
      "Fingerprint isolation: canvas, WebGL, audio, timezone randomization",
      "Session persistence via Redis backplane",
      "CDP-native automation layer with Playwright compatibility",
    ],
  },
  {
    version: "v0.8.0",
    date: "2026-07-10",
    title: "Proxy Rotation & GeoIP",
    changes: [
      "Residential and datacenter proxy pools",
      "GeoIP rotation per session or per request",
      "HAR export for automation debugging",
      "Session proxy health monitoring",
    ],
  },
  {
    version: "v0.7.0",
    date: "2026-07-01",
    title: "Session Orchestration",
    changes: [
      "Concurrent session management with configurable limits",
      "Session lifecycle hooks: create, rotate, destroy",
      "Cookie, localStorage, and IndexedDB preservation",
      "Auto-scaler for burst automation workloads",
    ],
  },
];

export const metadata: Metadata = {
  title: "Cykani — Stealth Browser Automation Platform",
  description:
    "Anti-fingerprint Chromium with GeoIP rotation, session orchestration, and CDP-native automation. Undetectable by design.",
};

function Divider() {
  return (
    <div className={styles.dividerWrapper}>
      <div className={styles.dividerNode} />
      <div className={styles.dividerNodeRight} />
      <div className={styles.divider} />
    </div>
  );
}

const CODE_LINES = [
  { comment: "# TypeScript SDK" },
  { code: 'import { Cykani } from "@cykani/sdk";' },
  { blank: true },
  { comment: "# Create a stealth session" },
  { code: "const cykani = new Cykani({ apiKey: process.env.CYKANI_KEY });" },
  { code: "" },
  { code: 'const session = await cykani.sessions.create({' },
  { code: '  profile: "stealth-max",' },
  { code: '  proxy: { country: "DE" },' },
  { code: "});" },
  { blank: true },
  { comment: "# Connect with any CDP client" },
  { code: "const browser = await puppeteer.connect({ browserWSEndpoint: session.wsUrl });" },
];

export default function SitePage() {
  return (
    <>
      <HeroSection />

      <section id="features" className={styles.section}>
        <div className={styles.sectionInner}>
          <span className={styles.tag}>Platform</span>
          <h2 className={styles.sectionHeading}>
            Everything you need
            <br />
            to ship undetectable
            <br />
            automation.
          </h2>
          <p className={styles.sectionSubhead}>
            Anti-fingerprint Chromium with session persistence, proxy rotation, and CDP-native automation. Built for
            scale.
          </p>
        </div>
        <FeatureGrid />
      </section>

      <Divider />

      <section id="metrics" className={styles.section}>
        <MetricsSection />
      </section>

      <Divider />

      <section id="products" className={styles.section}>
        <div className={styles.sectionInner}>
          <span className={styles.tag}>Products</span>
          <h2 className={styles.sectionHeading}>
            Infrastructure
            <br />
            for undetectable
            <br />
            automation.
          </h2>
          <p className={styles.sectionSubhead}>
            Every layer is hardened by default. Pick what you need, drop it into your stack.
          </p>
        </div>
        <div className={styles.grid}>
          {products.map((product) => (
            <div className={styles.card} key={product.name}>
              <span className={styles.cardTag}>{product.tag}</span>
              <h3 className={styles.cardName}>{product.name}</h3>
              <p className={styles.cardDesc}>{product.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section id="code" className={styles.section}>
        <div className={styles.sectionInner}>
          <span className={styles.tag}>SDK</span>
          <h2 className={styles.sectionHeading}>
            One line to connect.
            <br />
            Zero fingerprints
            <br />
            detected.
          </h2>
        </div>
        <div className={styles.codeBlock}>
          <div className={styles.codeChrome}>
            <div className={styles.codeDots}>
              <span className={styles.codeDotRed} />
              <span className={styles.codeDotYellow} />
              <span className={styles.codeDotGreen} />
            </div>
            <span className={styles.codeTitle}>terminal — sdk.ts</span>
          </div>
          <div className={styles.codeBody}>
            {CODE_LINES.map((line, idx) => (
              <div className={styles.codeLine} key={idx}>
                {line.comment && <span className={styles.codeComment}># {line.comment}</span>}
                {line.code !== undefined && (
                  <>
                    <span className={styles.codePrompt}>$</span>
                    <span className={styles.codeText}>{line.code}</span>
                  </>
                )}
                {line.blank && <span className={styles.codeBlank} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      <section id="clients" className={styles.section}>
        <div className={styles.sectionInner}>
          <span className={styles.tag}>Clients</span>
          <h2 className={styles.sectionHeading}>
            Trusted by teams
            <br />
            that ship automation.
          </h2>
          <p className={styles.sectionSubhead}>
            From AI labs to security firms, organizations rely on Cykani to run undetectable browser infrastructure at
            scale.
          </p>
        </div>
        <div className={styles.grid}>
          {clients.map((client) => (
            <div className={styles.card} key={client.name}>
              <div className={styles.cardInitial}>{client.name[0]}</div>
              <span className={styles.cardName}>{client.name}</span>
              <span className={styles.cardType}>{client.type}</span>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section id="testimonials" className={styles.section}>
        <div className={styles.sectionInner}>
          <span className={styles.tag}>Testimonials</span>
          <h2 className={styles.sectionHeading}>
            Trusted by engineers
            <br />
            shipping at scale.
          </h2>
          <p className={styles.sectionSubhead}>
            Teams that rely on Cykani for production browser automation share their experience.
          </p>
        </div>
        <TestimonialsSection />
      </section>

      <Divider />

      <section id="comparison" className={styles.section}>
        <div className={styles.sectionInner}>
          <span className={styles.tag}>Why Cykani</span>
          <h2 className={styles.sectionHeading}>
            Built different.
            <br />
            By design.
          </h2>
          <p className={styles.sectionSubhead}>
            Binary-level stealth is not a feature checkbox. It is the foundation. Compare for yourself.
          </p>
        </div>
        <ComparisonSection />
      </section>

      <Divider />

      <section id="pricing" className={styles.section}>
        <div className={styles.sectionInner}>
          <span className={styles.tag}>Pricing</span>
          <h2 className={styles.sectionHeading}>Simple, transparent pricing.</h2>
          <p className={styles.sectionSubhead}>Start free, scale when ready. No surprises.</p>
        </div>
        <div className={styles.pricingGrid}>
          {tiers.map((t) => (
            <PricingCard key={t.name} {...t} />
          ))}
        </div>
        <p className={styles.pricingNote}>
          All plans include{" "}
          <a href="/docs" className={styles.pricingNoteLink}>
            SOC 2 Type II
          </a>{" "}
          ·{" "}
          <a href="/docs" className={styles.pricingNoteLink}>
            99.9% SLA
          </a>{" "}
          ·{" "}
          <a href="/docs" className={styles.pricingNoteLink}>
            Cancel anytime
          </a>
        </p>
        <SecurityBadges />
      </section>

      <Divider />

      <section id="about" className={`${styles.section} ${styles.aboutSection}`}>
        <div className={styles.aboutBg} />
        <div className={styles.sectionInner}>
          <span className={styles.tag}>About</span>
          <h2 className={styles.sectionHeading}>
            Browser automation
            <br />
            should not be a war.
          </h2>
          <p className={styles.sectionSubhead}>
            Cykani was built because we were tired of fighting bot detectors, CAPTCHAs, and fingerprinting scripts. We
            believe automation deserves first-class infrastructure — not workarounds.
          </p>
        </div>
        <div className={styles.story}>
          <div className={styles.storyLabel}>Origin</div>
          <p className={styles.storyText}>
            It started with a simple problem: we needed to run thousands of browser sessions for AI training data
            collection, and every existing tool left traces. Canvas fingerprints, WebGL rendering artifacts, timing
            inconsistencies — the signals were there, and the detectors were catching them.
          </p>
          <p className={styles.storyText}>
            We spent 18 months patching Chromium at the binary level. Not with JavaScript polyfills, but with C++
            changes to the actual browser engine. 26 stealth patches. Isolated fingerprint domains. Human-like behavior
            primitives.
          </p>
          <p className={styles.storyText}>
            Today, Cykani runs millions of sessions undetected. We don&apos;t sell scrapers or automation scripts. We
            sell the browser layer that makes whatever you build on top of it invisible.
          </p>
        </div>
      </section>

      <Divider />

      <section id="changelog" className={styles.section}>
        <div className={styles.sectionInner}>
          <span className={styles.tag}>Release Notes</span>
          <h2 className={styles.sectionHeading}>Changelog</h2>
          <p className={styles.sectionSubhead}>Every release is a step closer to undetectable automation.</p>
        </div>
        <div className={styles.timeline}>
          {releases.map((release, idx) => (
            <div className={styles.entry} key={release.version}>
              <div className={styles.entryHeader}>
                <span className={styles.version}>{release.version}</span>
                <span className={styles.date}>{release.date}</span>
              </div>
              <h3 className={styles.entryTitle}>{release.title}</h3>
              <ul className={styles.entryChanges}>
                {release.changes.map((change) => (
                  <li className={styles.changeItem} key={change}>
                    <span className={styles.changePrefix}>+</span>
                    {change}
                  </li>
                ))}
              </ul>
              {idx < releases.length - 1 && <div className={styles.entryDivider} />}
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section id="faq" className={styles.section}>
        <div className={styles.sectionInner}>
          <span className={styles.tag}>FAQ</span>
          <h2 className={styles.sectionHeading}>Questions, answered.</h2>
          <p className={styles.sectionSubhead}>
            Everything you need to know about Cykani. Can&apos;t find what you&apos;re looking for?{" "}
            <a href="/contact" className={styles.link}>
              Contact us
            </a>
            .
          </p>
        </div>
        <FaqSection />
      </section>

      <Divider />

      <section id="contact" className={styles.section}>
        <div className={styles.sectionInner}>
          <span className={styles.tag}>Contact</span>
          <h2 className={styles.sectionHeading}>Talk to us.</h2>
          <p className={styles.sectionSubhead}>
            For sales, partnerships, or support, reach out directly. We respond within 24 hours.
          </p>
        </div>
        <div className={styles.contactGrid}>
          {[
            { label: "Sales", value: "sales@cykani.com", href: "mailto:sales@cykani.com" },
            { label: "Support", value: "support@cykani.com", href: "mailto:support@cykani.com" },
            { label: "Partnerships", value: "partners@cykani.com", href: "mailto:partners@cykani.com" },
          ].map((item) => (
            <a href={item.href} className={styles.card} key={item.label}>
              <span className={styles.cardLabel}>{item.label}</span>
              <span className={styles.cardValue}>{item.value}</span>
            </a>
          ))}
        </div>
      </section>

      <Divider />

      <CtaSection />
    </>
  );
}
