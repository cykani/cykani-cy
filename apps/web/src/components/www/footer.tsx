"use client";

import Image from "next/image";
import Link from "next/link";

import { APP_CONFIG } from "@/config/app-config";

import styles from "./footer.module.css";

const links = [
  {
    title: "Product",
    items: [
      { name: "Products", href: "/products" },
      { name: "Clients", href: "/clients" },
      { name: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    items: [
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/docs" },
      { name: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    items: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Link href="/" scroll={false} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={styles.logo}>
              <Image src="/logo_black.png" alt="Cykani" width={32} height={32} className={styles.logoImg} />
              {APP_CONFIG.name}
            </Link>
            <p className={styles.description}>
              Stealth browser automation with anti-fingerprint capabilities.
            </p>
          </div>
          {links.map((group) => (
            <div key={group.title}>
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <ul className={styles.linkList}>
                {group.items.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className={styles.link}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>{APP_CONFIG.copyright}</p>
          <div className={styles.legal}>
            <Link href="/privacy" className={styles.legalLink}>
              Privacy
            </Link>
            <Link href="/terms" className={styles.legalLink}>
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
