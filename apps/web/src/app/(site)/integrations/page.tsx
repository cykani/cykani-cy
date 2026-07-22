import type { Metadata } from "next";

import styles from "./integrations.module.css";

const integrations = [
  {
    name: "Playwright",
    desc: "CDP-native automation with full selector compatibility.",
    tag: "SDK",
  },
  {
    name: "Puppeteer",
    desc: "Connect to any running Cykani session via Chrome DevTools Protocol.",
    tag: "SDK",
  },
  {
    name: "Python",
    desc: "First-class SDK with async context managers and type hints.",
    tag: "SDK",
  },
  {
    name: "Go",
    desc: "Low-latency client for high-throughput session orchestration.",
    tag: "SDK",
  },
  {
    name: "TypeScript",
    desc: "Typed session proxy with full IntelliSense support.",
    tag: "SDK",
  },
  {
    name: "GitHub Actions",
    desc: "Run stealth browsers in CI without IP blocking or fingerprint leaks.",
    tag: "CI/CD",
  },
  {
    name: "Docker",
    desc: "Containerized browser sessions with isolated network namespaces.",
    tag: "INFRA",
  },
  {
    name: "Redis",
    desc: "Session state, cookie jars, and coordination layer.",
    tag: "INFRA",
  },
  {
    name: "PostgreSQL",
    desc: "Audit logs, session history, and org-level access control.",
    tag: "INFRA",
  },
];

export const metadata: Metadata = {
  title: "Integrations — Cykani",
  description: "Connect Cykani with your existing toolchain. SDKs, CI/CD, and infrastructure integrations.",
};

export default function IntegrationsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.tag}>Ecosystem</span>
          <h1 className={styles.heading}>Integrations</h1>
          <p className={styles.subhead}>
            Cykani fits into your existing stack. Drop-in SDKs, CDP compatibility, and infrastructure integrations for
            every environment.
          </p>
        </div>
      </section>

      <div className={styles.divider} />

      <section className={styles.grid}>
        {integrations.map((item) => (
          <div className={styles.card} key={item.name}>
            <span className={styles.cardTag}>{item.tag}</span>
            <h3 className={styles.cardName}>{item.name}</h3>
            <p className={styles.cardDesc}>{item.desc}</p>
          </div>
        ))}
      </section>

      <div className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.inner}>
          <p className={styles.ctaText}>
            Don&apos;t see your stack?{" "}
            <a href="mailto:info@cykani.com" className={styles.ctaLink}>
              Ask for a custom integration
            </a>{" "}
            or{" "}
            <a href="/docs" className={styles.ctaLink}>
              build your own
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
