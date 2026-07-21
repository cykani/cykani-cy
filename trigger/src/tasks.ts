import { task, logger } from "@trigger.dev/sdk";

export const sessionLaunchTask = task({
  id: "session-launch",
  maxDuration: "5 minutes",
  retry: { maxAttempts: 3 },
  run: async (payload: {
    sessionId: string;
    profileId: string;
    orgId: string;
    fingerprintSeed: number;
    platform: string;
  }) => {
    logger.info("Launching session", { sessionId: payload.sessionId });
    const { createContainer } = await import("@cykani/api/container");
    const container = createContainer();
    const result = await container.docker.launch({
      sessionId: payload.sessionId,
      profileId: payload.profileId,
      fingerprintSeed: payload.fingerprintSeed,
      platform: payload.platform,
    });
    await container.sessionService.launch(
      payload.sessionId,
      result.containerId,
      result.vncPort,
      result.cdpPort,
      result.vncPassword
    );
    await container.sessionService.markRunning(payload.sessionId);
    logger.info("Session launched", {
      sessionId: payload.sessionId,
      containerId: result.containerId,
      cdpEndpoint: result.wsEndpoint,
    });
    return result;
  },
});

export const sessionCleanupTask = task({
  id: "session-cleanup",
  maxDuration: "10 minutes",
  retry: { maxAttempts: 2 },
  run: async (payload: { sessionId: string; containerId: string; cdpEndpoint: string }) => {
    logger.info("Cleaning up session", { sessionId: payload.sessionId });
    const { createContainer } = await import("@cykani/api/container");
    const container = createContainer();
    await container.docker.destroy(payload.containerId);
    await container.sessionService.markStopped(payload.sessionId);
    logger.info("Session cleaned up", { sessionId: payload.sessionId });
  },
});

const ALLOWED_ACTIONS = new Set([
  "click", "type", "keypress", "fill", "hover", "dblclick",
  "scroll", "navigate", "goto", "wait", "idle",
  "screenshot", "reload", "back", "goback", "forward", "goforward",
]);

export const agentStepTask = task({
  id: "agent-step",
  maxDuration: "2 minutes",
  retry: { maxAttempts: 3 },
  run: async (payload: {
    agentId: string;
    stepIndex: number;
    action: string;
    target?: string;
    value?: string;
    sessionId: string;
    cdpEndpoint: string;
    profile: {
      fingerprintSeed: number;
      platform: "windows" | "macos" | "linux" | "android";
      locale: string;
      timezone: string;
      viewportWidth: number;
      viewportHeight: number;
      proxyUrl?: string;
    };
  }) => {
    logger.info("Executing agent step", {
      agentId: payload.agentId,
      step: payload.stepIndex,
      action: payload.action,
    });

    const { connectOverCDP } = await import("cykani-stealth");

    const entity = {
      fingerprint: payload.profile.fingerprintSeed,
      platform: payload.profile.platform,
      locale: payload.profile.locale,
      timezone: payload.profile.timezone,
      viewport: {
        width: payload.profile.viewportWidth,
        height: payload.profile.viewportHeight,
      },
      proxy: payload.profile.proxyUrl,
      humor: true,
    };

    const session = await connectOverCDP(payload.cdpEndpoint, entity);

    try {
      const action = payload.action.toLowerCase();
      let result;

      if (!ALLOWED_ACTIONS.has(action)) {
        throw new Error(`Disallowed action: ${action}`);
      }

      switch (action) {
        case "click":
          result = await session.click(payload.target ?? "");
          break;
        case "type":
        case "keypress":
          result = await session.type(payload.target ?? "", payload.value ?? "");
          break;
        case "fill":
          result = await session.fill(payload.target ?? "", payload.value ?? "");
          break;
        case "hover":
          result = await session.hover(payload.target ?? "");
          break;
        case "dblclick":
          result = await session.dblclick(payload.target ?? "");
          break;
        case "scroll":
          result = await session.scroll({ amount: payload.value ? parseInt(payload.value, 10) : 500 });
          break;
        case "navigate":
        case "goto":
          result = await session.goto(payload.target ?? "");
          break;
        case "wait":
          result = await session.wait(payload.target ?? 1000);
          break;
        case "idle":
          result = await session.idle(payload.value ? parseInt(payload.value, 10) : 2000);
          break;
        case "screenshot":
          result = await session.screenshot();
          break;
        case "reload":
          result = await session.reload();
          break;
        case "back":
        case "goback":
          result = await session.goBack();
          break;
        case "forward":
        case "goforward":
          result = await session.goForward();
          break;
      }

      const { createContainer } = await import("@cykani/api/container");
      const container = createContainer();

      await container.agentService.completeStep(payload.agentId, payload.stepIndex, {
        action: payload.action,
        status: "completed",
        result: session.state(),
      });

      const agent = await container.agentService.getById(payload.agentId);
      if (agent.ok && payload.stepIndex + 1 < agent.value.task.steps.length) {
        const nextStep = agent.value.task.steps[payload.stepIndex + 1];
        const sessionState = await container.sessionService.getById(payload.sessionId);
        const profile = await container.profileService.getById(agent.value.profileId);

        if (sessionState.ok && profile.ok && sessionState.value.cdpPort) {
          const nextCdpEndpoint = `ws://localhost:${sessionState.value.cdpPort}`;
          agentStepTask.trigger({
            agentId: payload.agentId,
            stepIndex: payload.stepIndex + 1,
            action: nextStep.action,
            target: nextStep.target,
            value: nextStep.value,
            sessionId: payload.sessionId,
            cdpEndpoint: nextCdpEndpoint,
            profile: payload.profile,
          }).catch((err) => {
            logger.error("Failed to trigger next step", { error: err });
          });
        }
      }

      await session.close();
      logger.info("Agent step completed", { agentId: payload.agentId, step: payload.stepIndex });
      return { success: true, result };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await session.close();

      const { createContainer } = await import("@cykani/api/container");
      const container = createContainer();
      await container.agentService.failStep(payload.agentId, payload.stepIndex, message);

      logger.error("Agent step failed", {
        agentId: payload.agentId,
        step: payload.stepIndex,
        error: message,
      });

      throw error;
    }
  },
});