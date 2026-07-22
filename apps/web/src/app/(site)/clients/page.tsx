import type { Metadata } from "next";

import styles from "./clients.module.css";

export const metadata: Metadata = {
  title: "Clients — Cykani",
  description: "Companies that trust Cykani for stealth browser infrastructure.",
};

export default function ClientsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.tag}>Clients</span>
          <h1 className={styles.heading}>
            Trusted by teams
            <br />
            that ship automation.
          </h1>
          <p className={styles.subhead}>
            From AI labs to security firms, organizations rely on Cykani to run undetectable browser infrastructure at
            scale.
          </p>
        </div>
      </section>

      <div className={styles.divider} />

      <section className={styles.grid}>
        {[
          { name: "Acme Corp", type: "Enterprise" },
          { name: "Globex", type: "Enterprise" },
          { name: "Soylent", type: "Enterprise" },
          { name: "Initech", type: "Enterprise" },
          { name: "Umbrella", type: "Enterprise" },
          { name: "Stark Industries", type: "Enterprise" },
        ].map((client) => (
          <div className={styles.card} key={client.name}>
            <div className={styles.cardInitial}>{client.name[0]}</div>
            <span className={styles.cardName}>{client.name}</span>
            <span className={styles.cardType}>{client.type}</span>
          </div>
        ))}
      </section>

      <div className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.inner}>
          <p className={styles.ctaText}>
            Want to be the first?{" "}
            <a href="mailto:sales@cykani.com" className={styles.ctaLink}>
              Get early access
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
