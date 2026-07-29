/**
 * AnyIP proxy integration for Cykani.
 *
 * AnyIP (anyip.io) provides residential and datacenter proxies.
 * Cykani received a 5GB free trial tier — credentials are stored in env vars,
 * NOT hardcoded. Never commit real credentials to the repo.
 *
 * Portal format: http://username:password@portal.anyip.io:1080
 *
 * Usage:
 *   const proxyUrl = AnyIPProxy.getUrl();          // default pool
 *   const proxyUrl = AnyIPProxy.getUrl("US");      // US exit node
 *   const proxyUrl = AnyIPProxy.getUrl("ZA");      // South Africa exit node
 *
 * Set in .env:
 *   ANYIP_USERNAME=user_440259
 *   ANYIP_PASSWORD=your_password_here   ← never commit the real password
 *   ANYIP_HOST=portal.anyip.io
 *   ANYIP_PORT=1080
 */

export interface ProxyTestResult {
  success: boolean;
  ip?: string;
  country?: string;
  isp?: string;
  responseTimeMs?: number;
  error?: string;
}

export class AnyIPProxy {
  private static readonly DEFAULT_HOST = "portal.anyip.io";
  private static readonly DEFAULT_PORT = 1080;

  /**
   * Returns the proxy config in Playwright's native format.
   * Use this when launching browsers — avoids URL parsing issues with
   * AnyIP's comma-containing username (sesstime, session params).
   *
   * Example:
   *   const browser = await chromium.launch({ proxy: AnyIPProxy.getPlaywrightConfig() });
   */
  static getPlaywrightConfig(countryCode?: string): {
    server: string;
    username: string;
    password: string;
  } | null {
    const username = process.env["ANYIP_USERNAME"];
    const password = process.env["ANYIP_PASSWORD"];
    const host = process.env["ANYIP_HOST"] ?? this.DEFAULT_HOST;
    const port = process.env["ANYIP_PORT"] ?? String(this.DEFAULT_PORT);

    if (!username || !password) return null;

    let user = username;
    if (countryCode && !username.includes("country-")) {
      const base = username.split(",")[0] ?? username;
      const rest = username.includes(",") ? `,${username.split(",").slice(1).join(",")}` : "";
      user = `${base}_country-${countryCode.toUpperCase()}${rest}`;
    }

    return {
      server: `http://${host}:${port}`,
      username: user,
      password,
    };
  }

  /**
   * Returns the proxy URL for the given country exit node.
   * NOTE: For browser automation use getPlaywrightConfig() instead —
   * URL embedding of AnyIP's comma-containing username breaks Chrome's
   * proxy auth. This method is suitable for node-fetch / HTTP clients only.
   */
  static getUrl(countryCode?: string): string | null {
    const config = this.getPlaywrightConfig(countryCode);
    if (!config) return null;
    return `${config.server.replace("http://", `http://${encodeURIComponent(config.username)}:${encodeURIComponent(config.password)}@`)}`;
  }

  /**
   * Test a proxy URL by making a request to ip-api.com and measuring latency.
   * Returns the IP, country, ISP, and response time.
   *
   * Works with any proxy URL format: http://user:pass@host:port
   * or the AnyIP format built by getUrl().
   */
  static async test(proxyUrl: string): Promise<ProxyTestResult> {
    const start = Date.now();
    try {
      const { HttpsProxyAgent } = await import("https-proxy-agent");
      // Use node-fetch — native fetch doesn't tunnel HTTP correctly through SOCKS/HTTP proxies
      const { default: nodeFetch } = await import("node-fetch");
      const agent = new HttpsProxyAgent(proxyUrl);

      const res = await nodeFetch("http://ip-api.com/json", {
        // @ts-expect-error — node-fetch agent type
        agent,
        timeout: 10_000,
      });

      if (!res.ok) {
        return { success: false, error: `HTTP ${res.status}` };
      }

      const data = await res.json() as {
        status: string;
        query?: string;
        country?: string;
        isp?: string;
        message?: string;
      };

      if (data.status !== "success") {
        return { success: false, error: data.message ?? "ip-api returned failure" };
      }

      return {
        success: true,
        ip: data.query,
        country: data.country,
        isp: data.isp,
        responseTimeMs: Date.now() - start,
      };
    } catch (err) {
      return {
        success: false,
        error: (err as Error).message,
        responseTimeMs: Date.now() - start,
      };
    }
  }

  /**
   * Test the default AnyIP pool and return the result.
   * Returns { success: false, error: "not configured" } if env vars are missing.
   */
  static async testDefault(countryCode?: string): Promise<ProxyTestResult> {
    const url = this.getUrl(countryCode);
    if (!url) {
      return { success: false, error: "AnyIP credentials not configured (set ANYIP_USERNAME and ANYIP_PASSWORD)" };
    }
    return this.test(url);
  }
}
