import type { Metadata } from "next";

import styles from "./changelog.module.css";

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
  {
    version: "v0.6.0",
    date: "2026-06-22",
    title: "SDK Release",
    changes: [
      "TypeScript / Python / Go SDKs",
      "AutoPilot heuristic automation (no selectors required)",
      "Humor Mode: Bezier curves, cognitive hesitation, idle micro-movements",
      "Binary auto-download from GitHub Releases",
    ],
  },
  {
    version: "v0.5.0",
    date: "2026-06-10",
    title: "API First",
    changes: [
      "RESTful API for session management",
      "WebSocket control plane for live browser instances",
      "API key rotation and org-level access control",
      "OpenAPI spec published",
    ],
  },
];

export const metadata: Metadata = {
  title: "Changelog — Cykani",
  description: "Release notes and version history for Cykani stealth browser automation.",
};

export default function ChangelogPage() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.tag}>Release Notes</span>
          <h1 className={styles.heading}>Changelog</h1>
          <p className={styles.subhead}>Every release is a step closer to undetectable automation.</p>
        </div>
      </section>

      <div className={styles.divider} />

      <section className={styles.timeline}>
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
      </section>

      <div className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.inner}>
          <p className={styles.ctaText}>
            Want to see what&apos;s coming?{" "}
            <a href="https://github.com/cykani/cykani" className={styles.ctaLink}>
              Star us on GitHub
            </a>{" "}
            or{" "}
            <a href="mailto:info@cykani.com" className={styles.ctaLink}>
              get early access
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
