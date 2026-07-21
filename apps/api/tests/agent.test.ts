import { describe, it, expect } from "vitest";
import { Agent } from "../src/lib/agent/entity";

describe("Agent Entity", () => {
  const task = {
    goal: "Fill form",
    steps: [
      { action: "navigate", target: "https://example.com" },
      { action: "click", target: "#submit" },
    ],
  };

  it("creates an agent with steps", () => {
    const agent = Agent.create({ orgId: "org1", sessionId: "sess1", profileId: "prof1", task });
    expect(agent.orgId).toBe("org1");
    expect(agent.sessionId).toBe("sess1");
    expect(agent.status).toBe("idle");
    expect(agent.steps).toHaveLength(2);
    expect(agent.steps[0].action).toBe("navigate");
    expect(agent.steps[0].status).toBe("pending");
  });

  it("tracks progress", () => {
    const agent = Agent.create({ orgId: "org1", sessionId: "sess1", profileId: "prof1", task });
    expect(agent.progress.completed).toBe(0);
    expect(agent.progress.percentage).toBe(0);

    agent.completeStep(0, { url: "https://example.com" });
    expect(agent.progress.completed).toBe(1);
    expect(agent.progress.percentage).toBe(50);
  });

  it("starts and completes", () => {
    const agent = Agent.create({ orgId: "org1", sessionId: "sess1", profileId: "prof1", task });
    agent.start();
    expect(agent.status).toBe("running");
    expect(agent.startedAt).toBeTruthy();

    agent.complete({ result: "done" });
    expect(agent.status).toBe("completed");
    expect(agent.result).toEqual({ result: "done" });
  });

  it("handles failures", () => {
    const agent = Agent.create({ orgId: "org1", sessionId: "sess1", profileId: "prof1", task });
    agent.start();
    agent.fail("Page not found");
    expect(agent.status).toBe("failed");
    expect(agent.error).toBe("Page not found");
  });

  it("can be cancelled", () => {
    const agent = Agent.create({ orgId: "org1", sessionId: "sess1", profileId: "prof1", task });
    agent.start();
    agent.cancel();
    expect(agent.status).toBe("cancelled");
  });

  it("serializes to JSON", () => {
    const agent = Agent.create({ orgId: "org1", sessionId: "sess1", profileId: "prof1", task });
    const json = agent.toJSON();
    expect(json.id).toBeTruthy();
    expect(json.orgId).toBe("org1");
    expect(json.task.goal).toBe("Fill form");
    expect(json.steps).toHaveLength(2);
  });
});
