"use client";

import { useEffect, useRef, useState } from "react";

import { DitherShader } from "@/components/ui/dither-shader";

import styles from "./metrics-section.module.css";

const METRICS = [
  { value: "800B", suffix: "+", label: "Tokens Scraped" },
  { value: "1M", suffix: "+", label: "Browser Hours Served" },
  { value: "<1s", suffix: "", label: "Avg. Session Start" },
];

function parseMetricNum(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  return Number.parseFloat(cleaned) || 0;
}

function useCountUp(target: number, duration: number, started: boolean): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started || target === 0) return;

    startTimeRef.current = null;

    const animate = (now: number) => {
      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, started]);

  return count;
}

function Metric({
  raw,
  suffix,
  label,
  started,
}: {
  raw: string;
  suffix: string;
  label: string;
  started: boolean;
}) {
  const isStatic = raw.startsWith("<");
  const target = parseMetricNum(raw);
  const count = useCountUp(target, 1200, started && !isStatic);

  return (
    <div className={styles.metric}>
      <span className={styles.value}>
        {isStatic ? raw : `${count.toLocaleString()}${suffix}`}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export function MetricsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.ditherBg}>
        <DitherShader
          src="/ascii-hero-2.png"
          ditherMode="bayer"
          colorMode="grayscale"
          gridSize={5}
          brightness={-0.15}
          contrast={1.8}
          className="h-full w-full"
        />
      </div>
      <div className={styles.grid} ref={ref}>
        {METRICS.map((m) => (
          <Metric key={m.label} raw={m.value} suffix={m.suffix} label={m.label} started={started} />
        ))}
      </div>
    </div>
  );
}
