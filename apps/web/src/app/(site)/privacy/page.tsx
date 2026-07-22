import type { Metadata } from "next";

import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy — Cykani",
  description: "How Cykani collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.tag}>Legal</span>
          <h1 className={styles.heading}>Privacy Policy</h1>
          <p className={styles.subhead}>Last updated: July 22, 2026</p>
        </div>
      </section>

      <div className={styles.divider} />

      <section className={styles.content}>
        <div className={styles.prose}>
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide when creating an account, such as your name, email address, and payment
            details. We also collect usage data including API requests, session metadata, and browser automation logs
            necessary to operate the service.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            Your information is used to provide, maintain, and improve Cykani services. This includes processing
            payments, diagnosing technical issues, and communicating service updates. We never sell your personal data
            to third parties.
          </p>

          <h2>3. Data Retention</h2>
          <p>
            Session logs are retained for 30 days. Account information is retained for the duration of your
            subscription plus 90 days after cancellation. You may request earlier deletion by contacting support.
          </p>

          <h2>4. Data Security</h2>
          <p>
            All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We maintain SOC 2 Type II compliance and
            conduct regular security audits. Infrastructure runs on isolated per-tenant environments.
          </p>

          <h2>5. Third-Party Services</h2>
          <p>
            We use select sub-processors for cloud infrastructure (AWS, GCP), payment processing (Stripe), and email
            delivery. Each sub-processor is contractually bound to data protection standards equivalent to our own.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have rights to access, correct, delete, or port your data. You may
            also object to or restrict certain processing. To exercise these rights, contact privacy@cykani.com.
          </p>

          <h2>7. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. No tracking cookies or third-party
            analytics scripts are used on the Cykani platform.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We will notify you of material changes via email or in-app notice 14 days before they take effect.
            Continued use of the service after changes constitutes acceptance of the updated policy.
          </p>

          <h2>9. Contact</h2>
          <p>
            For privacy-related inquiries, contact our Data Protection Officer at{" "}
            <a href="mailto:privacy@cykani.com" className={styles.inlineLink}>
              privacy@cykani.com
            </a>
            .
          </p>
        </div>
      </section>

      <div className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.inner}>
          <p className={styles.ctaText}>
            Have questions?{" "}
            <a href="mailto:privacy@cykani.com" className={styles.ctaLink}>
              Contact our DPO
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
