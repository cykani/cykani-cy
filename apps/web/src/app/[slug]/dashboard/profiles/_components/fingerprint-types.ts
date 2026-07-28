export interface BrowserFingerprint {
  // Navigator
  userAgent: string;
  platform: string;
  vendor: string;
  language: string;
  languages: string[];
  doNotTrack: string;
  cookieEnabled: boolean;
  onLine: boolean;
  hardwareConcurrency: number;
  deviceMemory: number;
  maxTouchPoints: number;

  // Screen
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  pixelRatio: number;
  availWidth: number;
  availHeight: number;
  innerWidth: number;
  innerHeight: number;

  // WebGL
  webglVendor: string;
  webglRenderer: string;
  webglVersion: string;
  webglShadingLanguageVersion: string;
  webglExtensions: string[];

  // Canvas
  canvasFingerprint: string; // hash

  // Audio
  audioFingerprint: string; // hash

  // Fonts
  fonts: string[];

  // Timezone
  timezone: string;
  timezoneOffset: number;

  // Connection
  connectionType: string;
  connectionDownlink: number;
  connectionRtt: number;

  // Battery (if available)
  batteryCharging?: boolean;
  batteryLevel?: number;

  // Media devices
  audioInputs: number;
  audioOutputs: number;
  videoInputs: number;
}

export interface BrowserProfile {
  id: string;
  name: string;
  os: "windows" | "macos" | "linux" | "android" | "ios";
  osVersion: string;
  browser: "chrome" | "firefox" | "safari" | "edge";
  browserVersion: string;
  fingerprintSeed: number;
  fingerprint: BrowserFingerprint;
  proxy?: string;
  notes?: string;
  createdAt: string;
  lastUsed?: string;
  sessionCount: number;
  tags: string[];
}

// ---------------------------------------------------------------------------
// OS / Browser config pools used by the generator
// ---------------------------------------------------------------------------

const WIN_UAS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
];

const MAC_UAS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
];

const LINUX_UAS = [
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0",
];

const WEBGL_VENDORS = [
  { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)" },
  { vendor: "Google Inc. (Intel)", renderer: "ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0, D3D11)" },
  { vendor: "Google Inc. (AMD)", renderer: "ANGLE (AMD, AMD Radeon RX 6700 XT Direct3D11 vs_5_0 ps_5_0, D3D11)" },
  { vendor: "Apple Inc.", renderer: "Apple M2 Pro" },
  { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce GTX 1080 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)" },
  { vendor: "Intel Inc.", renderer: "Intel Iris OpenGL Engine" },
];

const TIMEZONES = [
  { tz: "America/New_York", offset: -240 },
  { tz: "America/Chicago", offset: -300 },
  { tz: "America/Los_Angeles", offset: -420 },
  { tz: "Europe/London", offset: 60 },
  { tz: "Europe/Berlin", offset: 120 },
  { tz: "Asia/Tokyo", offset: 540 },
  { tz: "Asia/Singapore", offset: 480 },
  { tz: "Africa/Johannesburg", offset: 120 },
  { tz: "Australia/Sydney", offset: 660 },
];

const COMMON_FONTS = [
  "Arial", "Arial Black", "Calibri", "Cambria", "Comic Sans MS", "Courier New",
  "Georgia", "Helvetica", "Impact", "Lucida Console", "Palatino Linotype",
  "Segoe UI", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana",
];

const SCREEN_CONFIGS = [
  { w: 1920, h: 1080, aw: 1920, ah: 1040 },
  { w: 2560, h: 1440, aw: 2560, ah: 1400 },
  { w: 1366, h: 768, aw: 1366, ah: 728 },
  { w: 1440, h: 900, aw: 1440, ah: 860 },
  { w: 1280, h: 800, aw: 1280, ah: 760 },
  { w: 3840, h: 2160, aw: 3840, ah: 2120 },
];

// ---------------------------------------------------------------------------
// Seeded PRNG (mulberry32) — deterministic from seed
// ---------------------------------------------------------------------------

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0; s = s + 0x6d2b79f5 | 0;
    let z = Math.imul(s ^ (s >>> 15), 1 | s);
    z = z + Math.imul(z ^ (z >>> 7), 61 | z) ^ z;
    return ((z ^ (z >>> 14)) >>> 0) / 0x100000000;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function hexHash(seed: number, len = 16): string {
  let h = seed;
  let result = "";
  for (let i = 0; i < len; i++) {
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b) ^ (h >>> 16)) | 0;
    result += ((h >>> 0) % 16).toString(16);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function generateFingerprint(os: BrowserProfile["os"], seed: number): BrowserFingerprint {
  const rng = seededRng(seed);

  // Pick UA pool
  const uaPool = os === "windows" ? WIN_UAS : os === "macos" ? MAC_UAS : LINUX_UAS;
  const userAgent = pick(uaPool, rng);

  // Platform string
  const platformMap: Record<string, string> = {
    windows: "Win32",
    macos: "MacIntel",
    linux: "Linux x86_64",
    android: "Linux armv8l",
    ios: "iPhone",
  };
  const platform = platformMap[os] ?? "Win32";

  // Screen
  const screen = pick(SCREEN_CONFIGS, rng);
  const pixelRatio = pick([1, 1.25, 1.5, 2], rng);
  const innerW = Math.round(screen.aw - rng() * 40);
  const innerH = Math.round(screen.ah - rng() * 80);

  // WebGL
  const webgl = pick(WEBGL_VENDORS, rng);
  const webglExts = [
    "ANGLE_instanced_arrays", "EXT_blend_minmax", "EXT_color_buffer_half_float",
    "EXT_disjoint_timer_query", "EXT_float_blend", "EXT_frag_depth",
    "EXT_shader_texture_lod", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic",
    "WEBKIT_EXT_texture_filter_anisotropic", "EXT_sRGB", "OES_element_index_uint",
    "OES_fbo_render_mipmap", "OES_standard_derivatives", "OES_texture_float",
    "OES_texture_float_linear", "OES_texture_half_float", "OES_texture_half_float_linear",
    "OES_vertex_array_object", "WEBGL_color_buffer_float", "WEBGL_compressed_texture_s3tc",
    "WEBKIT_WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb",
    "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_depth_texture",
    "WEBKIT_WEBGL_depth_texture", "WEBGL_draw_buffers", "WEBGL_lose_context",
    "WEBKIT_WEBGL_lose_context", "WEBGL_multi_draw",
  ];
  const numExts = 18 + Math.floor(rng() * 10);
  const selectedExts = [...webglExts].sort(() => rng() - 0.5).slice(0, numExts);

  // Timezone
  const tz = pick(TIMEZONES, rng);

  // Fonts — pick a random subset of 8-14 fonts
  const numFonts = 8 + Math.floor(rng() * 6);
  const fonts = [...COMMON_FONTS].sort(() => rng() - 0.5).slice(0, numFonts);

  // Hardware
  const concurrency = pick([2, 4, 6, 8, 12, 16], rng);
  const memory = pick([2, 4, 8, 16, 32], rng);

  return {
    userAgent,
    platform,
    vendor: os === "macos" ? "Apple Computer, Inc." : "Google Inc.",
    language: pick(["en-US", "en-GB", "en-AU", "de-DE", "fr-FR", "es-ES", "ja-JP"], rng),
    languages: ["en-US", "en"],
    doNotTrack: pick(["1", "0", "unspecified"], rng),
    cookieEnabled: true,
    onLine: true,
    hardwareConcurrency: concurrency,
    deviceMemory: memory,
    maxTouchPoints: os === "android" || os === "ios" ? pick([5, 10], rng) : 0,

    screenWidth: screen.w,
    screenHeight: screen.h,
    colorDepth: 24,
    pixelRatio,
    availWidth: screen.aw,
    availHeight: screen.ah,
    innerWidth: innerW,
    innerHeight: innerH,

    webglVendor: webgl.vendor,
    webglRenderer: webgl.renderer,
    webglVersion: "WebGL 2.0 (OpenGL ES 3.0 Chromium)",
    webglShadingLanguageVersion: "WebGL GLSL ES 3.00 (OpenGL ES GLSL ES 3.0 Chromium)",
    webglExtensions: selectedExts,

    canvasFingerprint: hexHash(seed ^ 0xdeadbeef, 32),
    audioFingerprint: hexHash(seed ^ 0xcafebabe, 32),

    fonts,
    timezone: tz.tz,
    timezoneOffset: tz.offset,

    connectionType: pick(["wifi", "4g", "ethernet"], rng),
    connectionDownlink: Math.round((5 + rng() * 95) * 10) / 10,
    connectionRtt: Math.round(10 + rng() * 90),

    batteryCharging: rng() > 0.3,
    batteryLevel: Math.round(rng() * 100) / 100,

    audioInputs: pick([0, 1, 2], rng),
    audioOutputs: pick([1, 2], rng),
    videoInputs: pick([0, 1, 2], rng),
  };
}

export function generateProfile(
  os: BrowserProfile["os"],
  name?: string
): BrowserProfile {
  const seed = Math.floor(Math.random() * 0xffffffff);
  const rng = seededRng(seed);

  const browserMap: Record<BrowserProfile["os"], BrowserProfile["browser"][]> = {
    windows: ["chrome", "firefox", "edge"],
    macos: ["chrome", "safari", "firefox"],
    linux: ["chrome", "firefox"],
    android: ["chrome"],
    ios: ["safari"],
  };

  const browser = pick(browserMap[os], rng);
  const versionMap: Record<BrowserProfile["browser"], string[]> = {
    chrome: ["124.0.6367.82", "123.0.6312.122", "122.0.6261.128"],
    firefox: ["124.0.1", "123.0", "122.0.1"],
    safari: ["17.4.1", "17.3", "16.6"],
    edge: ["124.0.2478.51", "123.0.2420.97"],
  };
  const browserVersion = pick(versionMap[browser], rng);

  const osVersionMap: Record<BrowserProfile["os"], string[]> = {
    windows: ["10.0.19045", "10.0.22631", "11.0.22000"],
    macos: ["14.4.1", "13.6.6", "12.7.4"],
    linux: ["Ubuntu 22.04", "Fedora 39", "Debian 12"],
    android: ["14", "13", "12"],
    ios: ["17.4.1", "16.7.7"],
  };
  const osVersion = pick(osVersionMap[os], rng);

  const defaultNames: Record<BrowserProfile["os"], string[]> = {
    windows: ["Win10 Chrome", "Win11 Edge", "Windows Firefox"],
    macos: ["Mac Safari", "Mac Chrome", "macOS Firefox"],
    linux: ["Linux Chrome", "Linux Firefox"],
    android: ["Android Chrome"],
    ios: ["iOS Safari"],
  };

  return {
    id: `prof_${hexHash(seed, 12)}`,
    name: name ?? `${pick(defaultNames[os], rng)} ${(seed % 9000) + 1000}`,
    os,
    osVersion,
    browser,
    browserVersion,
    fingerprintSeed: seed,
    fingerprint: generateFingerprint(os, seed),
    createdAt: new Date().toISOString(),
    sessionCount: 0,
    tags: [],
  };
}
