import Link from "next/link";

import styles from "./cta-section.module.css";

export function CtaSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.tag}>GET STARTED</span>
        <h2 className={styles.heading}>
          Ready to build
          <br />
          with Cykani?
        </h2>
        <p className={styles.subhead}>Start scraping today. No credit card required.</p>
        <div className={styles.ctaRow}>
          <Link href="/default/dashboard/default" className={styles.ctaPrimary}>
            Start For Free
          </Link>
          <Link href="/docs" className={styles.ctaSecondary}>
            Read the Docs
          </Link>
        </div>
      </div>
    </section>
  );
}
