import styles from "./stats-section.module.css";

const STATS = [
  { value: "190+", label: "Proxy Countries" },
  { value: "< 1s", label: "Cold Start" },
  { value: "10M+", label: "Sessions Run" },
  { value: "99.9%", label: "Uptime" },
];

export function StatsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {STATS.map((s) => (
          <div className={styles.cell} key={s.label}>
            <span className={styles.value}>{s.value}</span>
            <span className={styles.label}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
