export interface VncProxy {
  startStream(containerId: string, ws: WebSocket): Promise<void>;
  stopStream(containerId: string): Promise<void>;
  getActiveStreams(): string[];
}

export class NoVncProxy implements VncProxy {
  private readonly activeStreams = new Map<string, Set<WebSocket>>();
  private readonly websockifyPort: number;

  constructor(websockifyPort: number) {
    this.websockifyPort = websockifyPort;
  }

  async startStream(containerId: string, ws: WebSocket): Promise<void> {
    if (!this.activeStreams.has(containerId)) {
      this.activeStreams.set(containerId, new Set());
    }
    this.activeStreams.get(containerId)!.add(ws);

    ws.onclose = () => {
      this.activeStreams.get(containerId)?.delete(ws);
      if (this.activeStreams.get(containerId)?.size === 0) {
        this.activeStreams.delete(containerId);
      }
    };
  }

  async stopStream(containerId: string): Promise<void> {
    const streams = this.activeStreams.get(containerId);
    if (streams) {
      for (const ws of streams) {
        ws.close();
      }
      this.activeStreams.delete(containerId);
    }
  }

  getActiveStreams(): string[] {
    return Array.from(this.activeStreams.keys());
  }
}
