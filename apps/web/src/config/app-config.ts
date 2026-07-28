export const APP_CONFIG = {
  name: "Cykani",
  meta: {
    title: "Cykani — Stealth Browser Infrastructure for AI Agents",
    description:
      "Build, run and scale AI browser agents that cannot be detected. Cykani provides a patched Chromium binary with 26 C++ anti-fingerprint patches, session orchestration, proxy rotation, and a CDP-native automation SDK.",
  },
  copyright: `© ${new Date().getFullYear()} Cykani. All rights reserved.`,
} as const;
