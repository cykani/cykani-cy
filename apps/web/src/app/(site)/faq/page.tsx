import type { Metadata } from "next";

import { FaqSection } from "@/components/www/faq-section";

import styles from "./faq.module.css";

export const metadata: Metadata = {
  title: "FAQ — Cykani",
  description: "Frequently asked questions about Cykani stealth browser automation.",
};

export default function FaqPage() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.tag}>FAQ</span>
          <h1 className={styles.heading}>
            Questions,
            <br />
            answered.
          </h1>
          <p className={styles.subhead}>
            Everything you need to know about Cykani. Can&apos;t find what you&apos;re looking for?{" "}
            <a href="/contact" className={styles.link}>
              Contact us
            </a>
            .
          </p>
        </div>
      </section>

      <div className={styles.divider} />

      <section className={styles.list}>
        <FaqSection />
      </section>

      <div className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.inner}>
          <p className={styles.ctaText}>
            Still have questions?{" "}
            <a href="mailto:support@cykani.com" className={styles.ctaLink}>
              Email support
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
