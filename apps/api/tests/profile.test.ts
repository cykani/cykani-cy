import { describe, it, expect } from "vitest";
import { Profile } from "../src/lib/profile/entity";

describe("Profile Entity", () => {
  it("creates a profile with correct defaults", () => {
    const profile = Profile.create({ orgId: "org1", name: "Test Profile" });
    expect(profile.orgId).toBe("org1");
    expect(profile.name).toBe("Test Profile");
    expect(profile.platform).toBe("windows");
    expect(profile.viewportWidth).toBe(1280);
    expect(profile.viewportHeight).toBe(800);
    expect(profile.locale).toBe("en-US");
  });

  it("generates browser args", () => {
    const profile = Profile.create({ orgId: "org1", name: "Test", fingerprintSeed: 42 });
    const args = profile.browserArgs;
    expect(args).toContain("--fingerprint=42");
    expect(args).toContain("--fingerprint-platform=windows");
  });

  it("includes proxy in browser args", () => {
    const profile = Profile.create({ orgId: "org1", name: "Test", proxyUrl: "http://proxy:8080" });
    const args = profile.browserArgs;
    expect(args).toContain("--proxy-server=http://proxy:8080");
  });

  it("updates profile fields", () => {
    const profile = Profile.create({ orgId: "org1", name: "Test" });
    profile.update({ name: "Updated", platform: "macos" });
    expect(profile.name).toBe("Updated");
    expect(profile.platform).toBe("macos");
  });

  it("clones profile with new org", () => {
    const profile = Profile.create({ orgId: "org1", name: "Original" });
    const clone = profile.clone("org2", "Cloned");
    expect(clone.orgId).toBe("org2");
    expect(clone.name).toBe("Cloned");
    expect(clone.id).not.toBe(profile.id);
  });

  it("serializes to JSON", () => {
    const profile = Profile.create({ orgId: "org1", name: "Test" });
    const json = profile.toJSON();
    expect(json.id).toBeTruthy();
    expect(json.orgId).toBe("org1");
    expect(json.name).toBe("Test");
  });
});
