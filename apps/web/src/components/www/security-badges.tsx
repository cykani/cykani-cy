import styles from "./security-badges.module.css";

const BADGES = [
  { icon: "◈", label: "SOC 2 Type II" },
  { icon: "◈", label: "GDPR Compliant" },
  { icon: "◈", label: "SSO / SAML" },
  { icon: "◈", label: "99.9% SLA" },
  { icon: "◈", label: "Data Residency" },
];

export function SecurityBadges() {
  return (
    <div className={styles.bar}>
      {BADGES.map((badge) => (
        <div className={styles.badge} key={badge.label}>
          <span className={styles.icon}>{badge.icon}</span>
          <span className={styles.label}>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
