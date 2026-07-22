"use client";

import { useCallback, useRef, useState } from "react";

import styles from "./faq-section.module.css";

const FAQS = [
  {
    q: "What is Cykani?",
    a: "Cykani is a stealth browser automation platform. We provide anti-fingerprint Chromium, session persistence, proxy rotation, and CDP-native automation for AI agents and developers.",
  },
  {
    q: "How does fingerprint isolation work?",
    a: "We patch Chromium at the binary level with 26 C++ stealth patches. This isolates canvas, WebGL, audio context, timezone, and other browser signals so detection scripts cannot fingerprint your sessions.",
  },
  {
    q: "Can I use my own proxies?",
    a: "Yes. Cykani supports residential and datacenter proxies across 190+ countries. You can rotate IPs per session or per request with automatic failover.",
  },
  {
    q: "Which automation frameworks are supported?",
    a: "We support Playwright, Puppeteer, and any CDP-compatible client. Our TypeScript, Python, and Go SDKs provide async context managers, type hints, and full IntelliSense support.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes. The Free tier includes 3 concurrent sessions, 100 fingerprint signals, community support, and shared infrastructure. No credit card required.",
  },
  {
    q: "How is billing handled?",
    a: "Pro plans are billed monthly at $49/mo. Enterprise plans are custom-priced. All plans can be upgraded or downgraded at any time.",
  },
  {
    q: "Can I self-host Cykani?",
    a: "Yes. Enterprise customers can deploy Cykani on-premise with custom fingerprint configs, SSO/SAML, and dedicated infrastructure.",
  },
  {
    q: "How do I get support?",
    a: "Community support is available for Free users. Pro users get priority support. Enterprise users get a dedicated support channel and SLA guarantees.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = useCallback((i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  }, []);

  return (
    <div className={styles.list}>
      {FAQS.map((faq, i) => (
        <FaqItem key={faq.q} faq={faq} isOpen={openIndex === i} onToggle={() => toggle(i)} index={i} />
      ))}
    </div>
  );
}

function FaqItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`${styles.item} ${isOpen ? styles.open : ""}`}>
      <button className={styles.q} onClick={onToggle} type="button">
        <span className={styles.qNum}>0{index + 1}</span>
        <span className={styles.qText}>{faq.q}</span>
        <span className={styles.icon}>{isOpen ? "−" : "+"}</span>
      </button>
      <div
        className={styles.a}
        style={{
          height: isOpen ? contentRef.current?.scrollHeight ?? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef} className={styles.aInner}>
          {faq.a}
        </div>
      </div>
    </div>
  );
}
