// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  blog: create.doc("blog", {"introducing-cykani.mdx": () => import("../content/blog/introducing-cykani.mdx?collection=blog"), "proxy-rotation-best-practices.mdx": () => import("../content/blog/proxy-rotation-best-practices.mdx?collection=blog"), "stealth-browser-detection-2026.mdx": () => import("../content/blog/stealth-browser-detection-2026.mdx?collection=blog"), }),
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "getting-started/installation.mdx": () => import("../content/docs/getting-started/installation.mdx?collection=docs"), "getting-started/quickstart.mdx": () => import("../content/docs/getting-started/quickstart.mdx?collection=docs"), "guides/stealth-mode.mdx": () => import("../content/docs/guides/stealth-mode.mdx?collection=docs"), "sdk/autopilot.mdx": () => import("../content/docs/sdk/autopilot.mdx?collection=docs"), "sdk/cdp-connection.mdx": () => import("../content/docs/sdk/cdp-connection.mdx?collection=docs"), "sdk/humor-mode.mdx": () => import("../content/docs/sdk/humor-mode.mdx?collection=docs"), "sdk/overview.mdx": () => import("../content/docs/sdk/overview.mdx?collection=docs"), "sdk/presets.mdx": () => import("../content/docs/sdk/presets.mdx?collection=docs"), }),
};
export default browserCollections;