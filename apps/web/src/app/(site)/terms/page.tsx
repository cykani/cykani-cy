import type { Metadata } from "next";

import styles from "./terms.module.css";

export const metadata: Metadata = {
  title: "Terms of Service — Cykani",
  description: "Terms and conditions for using Cykani services.",
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.tag}>Legal</span>
          <h1 className={styles.heading}>Terms of Service</h1>
          <p className={styles.subhead}>Last updated: July 22, 2026</p>
        </div>
      </section>

      <div className={styles.divider} />

      <section className={styles.content}>
        <div className={styles.prose}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Cykani services, you agree to be bound by these Terms of Service. If you do not
            agree, do not use the services. Continued use after updates constitutes acceptance of the revised terms.
          </p>

          <h2>2. Service Description</h2>
          <p>
            Cykani provides a stealth browser automation platform including anti-fingerprint Chromium instances,
            session persistence, proxy rotation, and CDP-native automation tools. Services are provided on a
            subscription basis with tiered pricing as described on our pricing page.
          </p>

          <h2>3. User Obligations</h2>
          <p>
            You agree to use Cykani services in compliance with all applicable laws. You may not use the platform for
            illegal activities, including unauthorized access to systems, credential stuffing, or distribution of
            malware. You are responsible for maintaining the confidentiality of your API keys.
          </p>

          <h2>4. Acceptable Use</h2>
          <p>
            Cykani is designed for legitimate automation use cases including web scraping, AI training data collection,
            quality assurance testing, and monitoring. Automated browsing must respect robots.txt directives and
            website terms of service where applicable.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            The Cykani platform, including its Chromium patches, SDKs, and documentation, is proprietary software. You
            receive a limited, non-exclusive, non-transferable license to use the service. No ownership rights are
            transferred.
          </p>

          <h2>6. Service Level</h2>
          <p>
            Cykani targets 99.9% uptime for paid plans as measured over a calendar month. Credits are issued for
            verified downtime exceeding the SLA threshold. Free tier users receive best-effort availability with no
            SLA guarantee.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            Cykani is provided &quot;as is&quot; without warranties of merchantability or fitness for a particular
            purpose. In no event shall Cykani be liable for indirect, incidental, or consequential damages. Total
            liability is limited to the amount paid in the 12 months preceding the claim.
          </p>

          <h2>8. Termination</h2>
          <p>
            Either party may terminate the agreement at any time. Upon termination, your access to the service ceases.
            Data is retained for 30 days after termination to allow for export. We may terminate for violation of
            these terms with immediate effect.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of Delaware, United States. Any disputes shall be
            resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
          </p>

          <h2>10. Contact</h2>
          <p>
            For legal inquiries, contact{" "}
            <a href="mailto:legal@cykani.com" className={styles.inlineLink}>
              legal@cykani.com
            </a>
            . For general support, visit our documentation or email{" "}
            <a href="mailto:support@cykani.com" className={styles.inlineLink}>
              support@cykani.com
            </a>
            .
          </p>
        </div>
      </section>

      <div className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.inner}>
          <p className={styles.ctaText}>
            Questions about these terms?{" "}
            <a href="mailto:legal@cykani.com" className={styles.ctaLink}>
              Contact legal
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
