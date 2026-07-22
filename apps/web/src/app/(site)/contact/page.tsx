import type { Metadata } from "next";

import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact — Cykani",
  description: "Get in touch with the Cykani team.",
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.tag}>Contact</span>
          <h1 className={styles.heading}>Talk to us.</h1>
          <p className={styles.subhead}>
            For sales, partnerships, or support, reach out directly. We respond within 24 hours.
          </p>
        </div>
      </section>

      <div className={styles.divider} />

      <section className={styles.grid}>
        {[
          {
            label: "Sales",
            value: "sales@cykani.com",
            href: "mailto:sales@cykani.com",
          },
          {
            label: "Support",
            value: "support@cykani.com",
            href: "mailto:support@cykani.com",
          },
          {
            label: "Partnerships",
            value: "partners@cykani.com",
            href: "mailto:partners@cykani.com",
          },
        ].map((item) => (
          <a href={item.href} className={styles.card} key={item.label}>
            <span className={styles.cardLabel}>{item.label}</span>
            <span className={styles.cardValue}>{item.value}</span>
          </a>
        ))}
      </section>

      <div className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.inner}>
          <p className={styles.ctaText}>
            Prefer async?{" "}
            <a href="https://github.com/cykani/cykani" className={styles.ctaLink}>
              Open an issue on GitHub
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
