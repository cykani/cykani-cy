import styles from "./comparison-section.module.css";

const ROWS = [
  { feature: "Binary-level stealth", cykani: true, a: "Browserless", b: "Playwright" },
  { feature: "Fingerprint isolation", cykani: true, a: false, b: false },
  { feature: "Session persistence", cykani: true, a: "Limited", b: false },
  { feature: "Proxy rotation", cykani: true, a: false, b: false },
  { feature: "CDP-native", cykani: true, a: true, b: true },
  { feature: "Auto-scaling", cykani: true, a: true, b: false },
  { feature: "GeoIP routing", cykani: true, a: false, b: false },
];

function Check({ label }: { label: string | boolean }) {
  if (label === true) {
    return <span className={styles.check}>✓</span>;
  }
  if (label === false) {
    return <span className={styles.dash}>—</span>;
  }
  return <span className={styles.limited}>{label}</span>;
}

export function ComparisonSection() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.table}>
        <div className={styles.header}>
          <div className={styles.cell} />
          <div className={`${styles.cell} ${styles.highlight}`}>Cykani</div>
          <div className={styles.cell}>Browserless</div>
          <div className={styles.cell}>Playwright</div>
        </div>
        {ROWS.map((row) => (
          <div className={styles.row} key={row.feature}>
            <div className={styles.cell}>
              <span className={styles.feature}>{row.feature}</span>
            </div>
            <div className={`${styles.cell} ${styles.highlight}`}>
              <Check label={row.cykani} />
            </div>
            <div className={styles.cell}>
              <Check label={row.a} />
            </div>
            <div className={styles.cell}>
              <Check label={row.b} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
