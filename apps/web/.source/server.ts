// @ts-nocheck
import * as __fd_glob_13 from "../content/docs/sdk/presets.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/sdk/overview.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/sdk/humor-mode.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/sdk/cdp-connection.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/sdk/autopilot.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/guides/stealth-mode.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/getting-started/quickstart.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/getting-started/installation.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/index.mdx?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/meta.json?collection=docs"
import * as __fd_glob_3 from "../content/blog/stealth-browser-detection-2026.mdx?collection=blog"
import * as __fd_glob_2 from "../content/blog/proxy-rotation-best-practices.mdx?collection=blog"
import * as __fd_glob_1 from "../content/blog/introducing-cykani.mdx?collection=blog"
import { default as __fd_glob_0 } from "../content/blog/meta.json?collection=blog"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: object
}>();

export const blog = await create.docs("blog", "content/blog", {"meta.json": __fd_glob_0, }, {"introducing-cykani.mdx": __fd_glob_1, "proxy-rotation-best-practices.mdx": __fd_glob_2, "stealth-browser-detection-2026.mdx": __fd_glob_3, });

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_4, }, {"index.mdx": __fd_glob_5, "getting-started/installation.mdx": __fd_glob_6, "getting-started/quickstart.mdx": __fd_glob_7, "guides/stealth-mode.mdx": __fd_glob_8, "sdk/autopilot.mdx": __fd_glob_9, "sdk/cdp-connection.mdx": __fd_glob_10, "sdk/humor-mode.mdx": __fd_glob_11, "sdk/overview.mdx": __fd_glob_12, "sdk/presets.mdx": __fd_glob_13, });