// StealthService — connects to container browser via CDP and applies
// cykani-stealth-warp wrappers (humor, constellation, telemetry, etc.)

export class StealthService {
  private sessions: Map<string, { session: any; disconnect: () => void }> = new Map();

  async setup(sessionId: string, wsEndpoint: string, entity?: any): Promise<any> {
    try {
      // Dynamic import to avoid TypeScript errors - cykani-stealth-warp is integrated from sibling project
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { connectOverCDP } = require("cykani-stealth-warp");

      const session = await connectOverCDP(wsEndpoint, {
        humor: true,
        ...entity,
      });

      this.sessions.set(sessionId, {
        session,
        disconnect: () => session.close().catch(() => {}),
      });

      return session;
    } catch (err) {
      console.warn(`[stealth] setup failed for ${sessionId}:`, err instanceof Error ? err.message : err);
      return null;
    }
  }

  async teardown(sessionId: string): Promise<void> {
    const entry = this.sessions.get(sessionId);
    if (entry) {
      try { entry.disconnect(); } catch {}
      this.sessions.delete(sessionId);
    }
  }

  getSession(sessionId: string): any {
    return this.sessions.get(sessionId)?.session ?? null;
  }
}
