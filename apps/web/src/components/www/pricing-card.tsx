import Link from "next/link";

import styles from "./pricing-card.module.css";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}

export function PricingCard({ name, price, period, description, features, cta, href, highlighted }: PricingCardProps) {
  return (
    <div className={`${styles.card} ${highlighted ? styles.highlighted : ""}`}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.desc}>{description}</p>
      <div className={styles.priceRow}>
        <span className={styles.price}>{price}</span>
        {period && <span className={styles.period}>/{period}</span>}
      </div>
      <div className={styles.divider} />
      <ul className={styles.features}>
        {features.map((f) => (
          <li key={f} className={styles.feature}>
            <span className={styles.featureIcon}>{">"}</span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`${styles.cta} ${highlighted ? styles.ctaHighlighted : ""}`}
      >
        {cta}
      </Link>
    </div>
  );
}
