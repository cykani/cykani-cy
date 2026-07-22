"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { DitherShader } from "@/components/ui/dither-shader";

import styles from "./cta-section.module.css";

const LINES = [
  { type: "comment", text: "# Quickstart — one command" },
  { type: "command", text: "$ ./cykani start --free" },
  { type: "blank" },
  { type: "output", text: " Initializing Cykani agent..." },
  { type: "success", text: " ✓ Session created" },
  { type: "success", text: " ✓ Fingerprint isolation active" },
  { type: "success", text: " ✓ Proxy: auto (geo-optimized)" },
  { type: "blank" },
  { type: "prompt", text: " Ready to build with Cykani?" },
  { type: "output", text: " From prototype to production. No credit card required." },
];

export function CtaSection() {
  const [visibleLines, setVisibleLines] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visibleLines >= LINES.length) return;
    const delay = visibleLines === 0 ? 800 : 60;
    timerRef.current = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visibleLines]);

  return (
    <section className={styles.section}>
      <div className={styles.ditherBg}>
        <DitherShader
          src="/ascii-hero-3.png"
          ditherMode="bayer"
          colorMode="grayscale"
          gridSize={5}
          brightness={-0.1}
          contrast={1.6}
          className="h-full w-full"
        />
      </div>
      <div className={styles.terminal}>
        <div className={styles.chrome}>
          <div className={styles.dots}>
            <span className={styles.dotRed} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen} />
          </div>
          <span className={styles.title}>cykani — quickstart</span>
          <div className={styles.status}>
            <span className={styles.statusDot} />
            <span className={styles.statusLabel}>ready</span>
          </div>
        </div>
        <div className={styles.body}>
          {LINES.map((line, i) => (
            <div
              key={i}
              className={`${styles.line} ${i < visibleLines ? styles.visible : ""}`}
              data-type={line.type}
            >
              {line.type === "command" && <span className={styles.prompt}>$</span>}
              {line.type === "success" && <span className={styles.check}>✓</span>}
              <span>{line.text}</span>
            </div>
          ))}
          <div className={styles.ctaRow}>
            <Link href="/default/dashboard/default" className={styles.ctaPrimary}>
              Start For Free
            </Link>
            <Link href="/docs" className={styles.ctaSecondary}>
              Read the Docs
            </Link>
          </div>
          <div className={styles.cursorLine}>
            <span className={styles.prompt}>$</span>
            <span className={styles.cursor} />
          </div>
        </div>
      </div>
    </section>
  );
}
