import { describe, it, expect } from "vitest";
import { Proxy } from "../src/lib/proxy/entity";

describe("Proxy Entity", () => {
  it("creates a proxy with correct defaults", () => {
    const proxy = Proxy.create({ orgId: "org1", name: "US Proxy", url: "http://proxy:8080" });
    expect(proxy.orgId).toBe("org1");
    expect(proxy.name).toBe("US Proxy");
    expect(proxy.url).toBe("http://proxy:8080");
    expect(proxy.protocol).toBe("http");
    expect(proxy.status).toBe("active");
  });

  it("builds proxy URL with credentials", () => {
    const proxy = Proxy.create({
      orgId: "org1",
      name: "Auth Proxy",
      url: "http://proxy:8080",
      username: "user",
      password: "pass",
    });
    expect(proxy.proxyUrl).toContain("user");
    expect(proxy.proxyUrl).toContain("pass");
  });

  it("updates proxy fields", () => {
    const proxy = Proxy.create({ orgId: "org1", name: "Test", url: "http://proxy:8080" });
    proxy.update({ name: "Updated", protocol: "socks5" });
    expect(proxy.name).toBe("Updated");
    expect(proxy.protocol).toBe("socks5");
  });

  it("tracks health check results", () => {
    const proxy = Proxy.create({ orgId: "org1", name: "Test", url: "http://proxy:8080" });
    proxy.markChecked(150, "active");
    expect(proxy.status).toBe("active");
    expect(proxy.responseTimeMs).toBe(150);
    expect(proxy.lastCheckedAt).toBeTruthy();
  });

  it("serializes to JSON", () => {
    const proxy = Proxy.create({ orgId: "org1", name: "Test", url: "http://proxy:8080" });
    const json = proxy.toJSON();
    expect(json.id).toBeTruthy();
    expect(json.orgId).toBe("org1");
    expect(json.name).toBe("Test");
  });
});
