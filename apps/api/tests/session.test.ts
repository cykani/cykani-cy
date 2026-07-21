import { describe, it, expect } from "vitest";
import { Session } from "../src/lib/session/entity";
import { SessionStatus, canTransition, transition } from "../src/lib/session/state-machine";

describe("Session Entity", () => {
  it("creates a session with correct defaults", () => {
    const session = Session.create("org1", "profile1", 30);
    expect(session.orgId).toBe("org1");
    expect(session.profileId).toBe("profile1");
    expect(session.status).toBe(SessionStatus.IDLE);
    expect(session.containerId).toBeNull();
    expect(session.isExpired).toBe(false);
  });

  it("transitions through launch flow", () => {
    const session = Session.create("org1", "profile1");
    session.launch("container1", 5900, 9222, "password123");
    expect(session.status).toBe(SessionStatus.LAUNCHING);
    expect(session.containerId).toBe("container1");
    expect(session.vncPort).toBe(5900);
    expect(session.cdpPort).toBe(9222);

    session.markRunning();
    expect(session.status).toBe(SessionStatus.RUNNING);
    expect(session.startedAt).toBeTruthy();
  });

  it("terminates a running session", () => {
    const session = Session.create("org1", "profile1");
    session.launch("container1", 5900, 9222, "pw");
    session.markRunning();
    session.terminate();
    expect(session.status).toBe(SessionStatus.STOPPING);
    expect(session.events.length).toBeGreaterThan(0);
  });

  it("handles errors", () => {
    const session = Session.create("org1", "profile1");
    session.launch("container1", 5900, 9222, "pw");
    session.markRunning();
    session.markError("Container crashed");
    expect(session.status).toBe(SessionStatus.ERROR);
  });

  it("serializes to JSON", () => {
    const session = Session.create("org1", "profile1");
    const json = session.toJSON();
    expect(json.id).toBeTruthy();
    expect(json.orgId).toBe("org1");
    expect(json.profileId).toBe("profile1");
    expect(json.status).toBe("idle");
  });
});

describe("Session State Machine", () => {
  it("allows valid transitions", () => {
    expect(canTransition("idle", "launching")).toBe(true);
    expect(canTransition("launching", "running")).toBe(true);
    expect(canTransition("running", "stopping")).toBe(true);
    expect(canTransition("stopping", "stopped")).toBe(true);
  });

  it("rejects invalid transitions", () => {
    expect(canTransition("idle", "running")).toBe(false);
    expect(canTransition("stopped", "running")).toBe(false);
  });

  it("throws on invalid transition", () => {
    expect(() => transition("idle", "running")).toThrow("Invalid session transition");
  });
});
