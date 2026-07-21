export interface VncProxy { startStream(id: string, ws: WebSocket): void; stopStream(id: string): void; getActive(): string[]; }

export class NoVncProxy implements VncProxy {
  private readonly streams = new Map<string, Set<WebSocket>>();

  startStream(id: string, ws: WebSocket) {
    if (!this.streams.has(id)) this.streams.set(id, new Set());
    this.streams.get(id)!.add(ws);
    ws.onclose = () => { this.streams.get(id)?.delete(ws); if (!this.streams.get(id)?.size) this.streams.delete(id); };
  }

  stopStream(id: string) { this.streams.get(id)?.forEach((ws) => ws.close()); this.streams.delete(id); }
  getActive() { return Array.from(this.streams.keys()); }
}
