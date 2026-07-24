"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { DitherShader } from "@/components/ui/dither-shader";

const HERO_BG = "/ascii-hero-1.png";

const TERMINAL_LINES = [
  { type: "comment", text: "# Start a new session" },
  { type: "command", text: "curl -X POST https://api.cykani.dev/v1/sessions \\" },
  { type: "arg", text: '  -H "Authorization: Bearer sk-cyk_..." \\' },
  { type: "arg", text: '  -H "Content-Type: application/json" \\' },
  { type: "arg", text: "  -d {" },
  { type: "key", text: '    "profile": "stealth-max",' },
  { type: "key", text: '    "proxy": { "country": "DE" },' },
  { type: "key", text: '    "fingerprint": { "mode": "random" }' },
  { type: "arg", text: "  }" },
  { type: "blank", text: "" },
  { type: "response", text: "{" },
  { type: "key", text: '  "session_id": "sess_2xK9mN...",' },
  { type: "key", text: '  "status": "ready",' },
  { type: "key", text: '  "ws_url": "wss://connect.cykani.dev/..."' },
  { type: "response", text: "}" },
];

const FEATURES = [
  { icon: "◐", label: "Fingerprint Isolation" },
  { icon: "◑", label: "GeoIP Rotation" },
  { icon: "◒", label: "Session Persistence" },
  { icon: "◓", label: "CDP Native" },
];

const TRUST_LOGOS = ["Acme Corp", "Globex", "Soylent", "Initech", "Stark Industries"];

export function HeroSection() {
  const [visibleLines, setVisibleLines] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (visibleLines >= TERMINAL_LINES.length) return;
    timerRef.current = setTimeout(() => setVisibleLines((v) => v + 1), visibleLines === 0 ? 1200 : 80);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visibleLines]);

  const handleTerminalMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotPos({ x, y });
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.ditherContainer}>
        <DitherShader
          src={HERO_BG}
          ditherMode="bayer"
          colorMode="duotone"
          primaryColor="#08090b"
          secondaryColor="#1a1b1f"
          gridSize={3}
          animated
          animationSpeed={0.08}
          brightness={0}
          contrast={1.6}
          className="h-full w-full"
        />
      </div>

      <div className={styles.bgGrid} />
      <div className={styles.scanlines} />

      <div className={styles.inner}>
        <div className={styles.left}>
          <h1 className={styles.headline}>
            <span>Browser</span> <span className={styles.highlight}>Infrastructure</span> <span>for</span>{" "}
            <span className={styles.highlight}>AI Agents</span>
          </h1>

          <p className={styles.subhead}>
            Cykani is a stealth browser automation platform with fingerprint isolation, proxy rotation, and session
            persistence. Built for scale. Undetectable by design.
          </p>

          <div className={styles.ctaRow}>
            <Link href="/#contact" className={styles.ctaPrimary}>
              Start For Free
            </Link>
            <Link href="/docs" className={styles.ctaSecondary}>
              Read the Docs
            </Link>
          </div>

          <div className={styles.features}>
            {FEATURES.map((f) => (
              <div className={styles.feature} key={f.label}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span className={styles.featureLabel}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.lampGlow} />
          <div className={styles.terminalGlow} />

          <div
            className={styles.terminal}
            ref={terminalRef}
            onMouseMove={handleTerminalMouse}
            role="presentation"
            style={
              {
                "--spot-x": `${spotPos.x}%`,
                "--spot-y": `${spotPos.y}%`,
              } as React.CSSProperties
            }
          >
            <div className={styles.spotlight} />

            <div className={styles.terminalChrome}>
              <div className={styles.terminalDots}>
                <span className={styles.dotRed} />
                <span className={styles.dotYellow} />
                <span className={styles.dotGreen} />
              </div>
              <span className={styles.terminalTitle}>cykani — api</span>
              <div className={styles.terminalStatus}>
                <span className={styles.statusDot} />
                <span className={styles.statusText}>connected</span>
              </div>
            </div>
            <div className={styles.terminalBody}>
              {TERMINAL_LINES.map((line, i) => (
                <div
                  key={i}
                  className={`${styles.terminalLine} ${styles[line.type] || ""} ${
                    i < visibleLines ? styles.visible : ""
                  }`}
                >
                  {line.type === "command" && <span className={styles.prompt}>$</span>}
                  <span>{line.text}</span>
                  {i === TERMINAL_LINES.length - 1 && i < visibleLines && <span className={styles.cursor} />}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.tag}>
            <span className={styles.tagLabel}>CYKANI_BROWSER</span>
          </div>

          <div className={styles.badge1}>
            <span className={styles.badgeNum}>800B+</span>
            <span className={styles.badgeLabel}>Tokens Scraped</span>
          </div>
          <div className={styles.badge2}>
            <span className={styles.badgeNum}>&lt;1s</span>
            <span className={styles.badgeLabel}>Session Start</span>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span className={styles.scrollLabel}>Scroll</span>
        <div className={styles.scrollChevron} />
      </div>
    </section>
  );
}

import styles from "./Hero.module.css";
