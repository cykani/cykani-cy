import { nanoid } from "nanoid";

export interface ScreenshotOptions {
  format?: "png" | "jpeg";
  quality?: number;
  fullPage?: boolean;
  clip?: { x: number; y: number; width: number; height: number };
}

export interface ScreenshotResult {
  id: string;
  sessionId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  size: number;
  createdAt: Date;
}

export class ScreenshotService {
  private readonly screenshots = new Map<string, ScreenshotResult[]>();

  async capture(
    sessionId: string,
    cdpSession: any,
    options: ScreenshotOptions = {}
  ): Promise<ScreenshotResult | null> {
    try {
      const format = options.format ?? "png";
      const result = await cdpSession.send("Page.captureScreenshot", {
        format,
        quality: options.quality,
        captureBeyondViewport: options.fullPage ?? false,
        clip: options.clip,
      });

      const buffer = Buffer.from(result.data, "base64");
      const screenshot: ScreenshotResult = {
        id: nanoid(),
        sessionId,
        url: `screenshots/${sessionId}/${nanoid()}.${format}`,
        width: result.viewport?.width ?? 0,
        height: result.viewport?.height ?? 0,
        format,
        size: buffer.length,
        createdAt: new Date(),
      };

      if (!this.screenshots.has(sessionId)) {
        this.screenshots.set(sessionId, []);
      }
      this.screenshots.get(sessionId)!.push(screenshot);

      return screenshot;
    } catch {
      return null;
    }
  }

  listBySession(sessionId: string): ScreenshotResult[] {
    return this.screenshots.get(sessionId) ?? [];
  }

  listByOrg(orgId: string, allRecordings: Map<string, { orgId: string }>): ScreenshotResult[] {
    const results: ScreenshotResult[] = [];
    for (const [sessionId, screenshots] of this.screenshots) {
      const recording = allRecordings.get(sessionId);
      if (recording?.orgId === orgId) {
        results.push(...screenshots);
      }
    }
    return results;
  }

  getStats(sessionId: string) {
    const shots = this.screenshots.get(sessionId) ?? [];
    return {
      count: shots.length,
      totalSize: shots.reduce((s, sh) => s + sh.size, 0),
      formats: [...new Set(shots.map((s) => s.format))],
    };
  }
}
