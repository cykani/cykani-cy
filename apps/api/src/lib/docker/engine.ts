import Dockerode from "dockerode";
import { nanoid } from "nanoid";

export interface ContainerInfo { containerId: string; vncPort: number; cdpPort: number; vncPassword: string; wsEndpoint: string; }

export class DockerEngine {
  private readonly docker: Dockerode;
  private readonly image: string;
  private readonly sessions = new Map<string, ContainerInfo>();

  constructor(socketPath: string, image: string) { this.docker = new Dockerode({ socketPath }); this.image = image; }

  async launch(input: { sessionId: string; profileId: string; fingerprintSeed: number; platform: string; proxyUrl?: string }): Promise<ContainerInfo> {
    const vncPassword = nanoid(12);
    const vncPort = await this.findPort(5900);
    const cdpPort = await this.findPort(9222);
    const container = await this.docker.createContainer({
      Image: this.image,
      Env: [`VNC_PASSWORD=${vncPassword}`, `FINGERPRINT_SEED=${input.fingerprintSeed}`, `FINGERPRINT_PLATFORM=${input.platform}`, `CDP_PORT=9222`, `VNC_PORT=5900`, input.proxyUrl ? `PROXY_URL=${input.proxyUrl}` : ""].filter(Boolean),
      ExposedPorts: { "5900/tcp": {}, "9222/tcp": {} },
      HostConfig: { PortBindings: { "5900/tcp": [{ HostPort: String(vncPort) }], "9222/tcp": [{ HostPort: String(cdpPort) }] }, Memory: 512 * 1024 * 1024, AutoRemove: false },
      Labels: { "cykani.session": input.sessionId, "cykani.profile": input.profileId, "cykani.managed": "true" },
    });
    await container.start();
    const info: ContainerInfo = { containerId: container.id, vncPort, cdpPort, vncPassword, wsEndpoint: `ws://localhost:${cdpPort}` };
    this.sessions.set(input.sessionId, info);
    return info;
  }

  async destroy(containerId: string) {
    try { const c = this.docker.getContainer(containerId); const i = await c.inspect(); if (i.State.Running) await c.stop({ t: 5 }); await c.remove({ force: true }); } catch {}
    for (const [sid, info] of this.sessions) { if (info.containerId === containerId) { this.sessions.delete(sid); break; } }
  }

  async getStatus(containerId: string): Promise<"running" | "stopped" | "unknown"> {
    try { const i = await this.docker.getContainer(containerId).inspect(); return i.State.Running ? "running" : "stopped"; } catch { return "unknown"; }
  }

  getContainerId(sessionId: string) { return this.sessions.get(sessionId)?.containerId ?? null; }

  private async findPort(start: number) {
    const used = new Set<number>();
    for (const info of this.sessions.values()) { used.add(info.vncPort); used.add(info.cdpPort); }
    let p = start; while (used.has(p)) p++; return p;
  }
}
