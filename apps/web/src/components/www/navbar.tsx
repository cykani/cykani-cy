"use client";

import { useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { IconChevronDown, IconMenu2, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";

import { APP_CONFIG } from "@/config/app-config";
import { cn } from "@/lib/utils";

type NavChild = {
  name: string;
  link: string;
  icon: string;
  desc: string;
};

type NavItem = {
  label: string;
  link?: string;
  children?: NavChild[];
};

const navLinks: NavItem[] = [
  {
    label: "Product",
    children: [
      { name: "Features", link: "/#features", icon: "◆", desc: "Core capabilities" },
      { name: "Products", link: "/#products", icon: "◈", desc: "Browser infrastructure" },
      { name: "Integrations", link: "/integrations", icon: "◉", desc: "Connect your stack" },
      { name: "Changelog", link: "/#changelog", icon: "◇", desc: "Latest releases" },
    ],
  },
  {
    label: "Resources",
    children: [
      { name: "Documentation", link: "/docs", icon: "▸", desc: "Guides & references" },
      { name: "API Reference", link: "/docs", icon: "▹", desc: "Full API docs" },
      { name: "Blog", link: "/blog", icon: "▻", desc: "Engineering insights" },
      { name: "FAQ", link: "/#faq", icon: "?", desc: "Common questions" },
    ],
  },
  {
    label: "Pricing",
    link: "/#pricing",
  },
  {
    label: "Company",
    children: [
      { name: "About", link: "/#about", icon: "◈", desc: "Our mission" },
      { name: "Clients", link: "/#clients", icon: "◐", desc: "Trusted by teams" },
      { name: "Contact", link: "/#contact", icon: "◇", desc: "Get in touch" },
    ],
  },
];

const DROPDOWN_CLOSE_DELAY = 150;

function NavDropdown({ label, children }: { label: string; children: NavChild[] }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleClose = () => {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
    }, DROPDOWN_CLOSE_DELAY);
  };

  return (
    <div className="relative" onMouseEnter={handleOpen} onMouseLeave={handleClose}>
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 rounded-none px-3 py-1.5 text-sm font-medium transition-colors",
          open ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex"
        >
          <IconChevronDown className="h-3 w-3" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 26, mass: 0.7 }}
            className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2"
          >
            <div className="relative border border-border/60 bg-background/95 backdrop-blur-xl">
              <div className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-border/60 bg-background" />
              <div className="p-1.5">
                {children.map((child, idx) => (
                  <motion.div
                    key={child.name}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.15 }}
                  >
                    <Link
                      href={child.link}
                      className="group flex items-start gap-3 rounded-none px-3 py-2.5 transition-colors hover:bg-accent"
                    >
                      <span className="mt-0.5 font-mono text-xs text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/70">
                        {child.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                          {child.name}
                        </span>
                        <span className="text-xs text-muted-foreground/50 transition-colors group-hover:text-muted-foreground/70">
                          {child.desc}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SiteNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" scroll={false} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 font-bold text-lg">
          <Image src="/logo_black.png" alt="Cykani" width={32} height={32} className="h-8 w-auto" />
          <span>{APP_CONFIG.name}</span>
        </Link>

        <div className="hidden items-center lg:flex">
          {navLinks.map((item) =>
            item.children ? (
              <NavDropdown key={item.label} label={item.label} children={item.children} />
            ) : (
              <Link
                key={item.label}
                href={item.link!}
                className="inline-flex items-center rounded-none px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="https://github.com/cykani/cykani-cy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-accent"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Star on GitHub
          </a>
          <Link
            href="/sign-in"
            className="rounded-lg border border-border/60 bg-background px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-accent"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-foreground px-4 py-2 font-medium text-background text-sm transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center lg:hidden"
        >
          {mobileOpen ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/40 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-1 px-6 py-4">
              {navLinks.map((item) =>
                item.children ? (
                  <div key={item.label}>
                    <span className="block px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                      {item.label}
                    </span>
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.link}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 pl-6 text-sm text-foreground transition-colors hover:text-muted-foreground"
                      >
                        <span className="font-mono text-xs text-muted-foreground/40">{child.icon}</span>
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.link!}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
                  >
                    {item.label}
                  </Link>
                ),
              )}
              <div className="flex flex-col gap-2 pt-4">
                <a
                  href="https://github.com/cykani/cykani-cy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/60 px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-accent"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Star on GitHub
                </a>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg border border-border/60 px-4 py-2 text-center font-medium text-foreground text-sm transition-colors hover:bg-accent"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg bg-foreground px-4 py-2 text-center font-medium text-background text-sm"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
