import styles from "./feature-grid.module.css";

const FEATURES = [
  {
    num: "01",
    title: "Stealth Browser",
    desc: "Anti-fingerprint Chromium with randomized canvas, WebGL, audio context, and timezone. Undetectable by design.",
  },
  {
    num: "02",
    title: "Session Persistence",
    desc: "Store and reuse browser sessions across runs. Cookies, localStorage, and IndexedDB preserved automatically.",
  },
  {
    num: "03",
    title: "CDP Protocol",
    desc: "Full Chrome DevTools Protocol support. Connect with Puppeteer, Playwright, or any CDP-compatible client.",
  },
  {
    num: "04",
    title: "Proxy Rotation",
    desc: "Built-in residential and datacenter proxy support. Rotate IPs per session or per request.",
  },
  {
    num: "05",
    title: "Auto Scaler",
    desc: "Spin up hundreds of browser instances on demand. Scale from zero to production in seconds.",
  },
  {
    num: "06",
    title: "API First",
    desc: "RESTful API for session management, browser control, and data extraction. Ship fast.",
  },
];

export function FeatureGrid() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {FEATURES.map((f) => (
          <div className={styles.card} key={f.num}>
            <span className={styles.cardNum}>{f.num}</span>
            <h3 className={styles.cardTitle}>{f.title}</h3>
            <p className={styles.cardDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
