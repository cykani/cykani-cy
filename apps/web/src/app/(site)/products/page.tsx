import type { Metadata } from "next";

import styles from "./products.module.css";

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

export const metadata: Metadata = {
  title: "Products — Cykani",
  description: "Stealth browser infrastructure products for AI agents and automation.",
};

export default function ProductsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.tag}>Products</span>
          <h1 className={styles.heading}>
            Infrastructure
            <br />
            for undetectable
            <br />
            automation.
          </h1>
          <p className={styles.subhead}>
            Every layer is hardened by default. Pick what you need, drop it into your stack.
          </p>
        </div>
      </section>

      <div className={styles.divider} />

      <section className={styles.grid}>
        {products.map((product) => (
          <div className={styles.card} key={product.name}>
            <span className={styles.cardTag}>{product.tag}</span>
            <h3 className={styles.cardName}>{product.name}</h3>
            <p className={styles.cardDesc}>{product.desc}</p>
          </div>
        ))}
      </section>

      <div className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.inner}>
          <p className={styles.ctaText}>
            Need something custom?{" "}
            <a href="mailto:sales@cykani.com" className={styles.ctaLink}>
              Talk to sales
            </a>{" "}
            or{" "}
            <a href="/docs" className={styles.ctaLink}>
              read the docs
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
