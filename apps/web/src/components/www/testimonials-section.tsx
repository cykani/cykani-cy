import styles from "./testimonials-section.module.css";

const TESTIMONIALS = [
  {
    quote:
      "We cut our detection rate from 35% to 0.2% after switching to Cykani. The binary-level patches make a real difference — nothing else comes close.",
    name: "Alex Chen",
    role: "CTO, Acme Corp",
  },
  {
    quote:
      "Five hundred concurrent sessions, zero bans. The session persistence alone saves my team hours of re-authentication every day.",
    name: "Sarah Mitchell",
    role: "Lead Engineer, Globex",
  },
  {
    quote:
      "We evaluated every headless browser provider. Cykani was the only one that passed our fingerprint audit. It's not even close.",
    name: "Marcus Rivera",
    role: "Staff Engineer, Stark Industries",
  },
];

export function TestimonialsSection() {
  return (
    <div className={styles.grid}>
      {TESTIMONIALS.map((t) => (
        <div className={styles.card} key={t.name}>
          <div className={styles.quoteIcon}>"</div>
          <p className={styles.quote}>{t.quote}</p>
          <div className={styles.author}>
            <div className={styles.avatar}>{t.name.charAt(0)}</div>
            <div className={styles.authorInfo}>
              <span className={styles.name}>{t.name}</span>
              <span className={styles.role}>{t.role}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
