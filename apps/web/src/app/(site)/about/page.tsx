import type { Metadata } from "next";

import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About — Cykani",
  description: "We build undetectable browser infrastructure for AI agents.",
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.tag}>About</span>
          <h1 className={styles.heading}>
            Browser automation
            <br />
            should not be a war.
          </h1>
          <p className={styles.subhead}>
            Cykani was built because we were tired of fighting bot detectors, CAPTCHAs, and fingerprinting scripts. We
            believe automation deserves first-class infrastructure — not workarounds.
          </p>
        </div>
      </section>

      <div className={styles.divider} />

      <section className={styles.story}>
        <div className={styles.storyInner}>
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

      <div className={styles.divider} />

      <section className={styles.values}>
        <div className={styles.valuesInner}>
          <h2 className={styles.valuesHeading}>What we believe</h2>
          <div className={styles.valuesGrid}>
            {[
              {
                num: "01",
                title: "Infrastructure over workarounds",
                desc: "We patch the browser, not the application. Every layer below your code is hardened by default.",
              },
              {
                num: "02",
                title: "Local-first, self-hosted",
                desc: "No browser farms you don't control. Run Cykani on your metal, your network, your rules.",
              },
              {
                num: "03",
                title: "Transparent limits",
                desc: "Open specifications, published detection tests, and a public roadmap. Trust through verifiability.",
              },
            ].map((v) => (
              <div className={styles.valueCard} key={v.num}>
                <div className={styles.valueNum}>{v.num}</div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.inner}>
          <p className={styles.ctaText}>
            Ready to build on invisible infrastructure?{" "}
            <a href="/default/dashboard/default" className={styles.ctaLink}>
              Start for free
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
