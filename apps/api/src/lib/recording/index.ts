import { nanoid } from "nanoid";

export interface RecordingEvent {
  id: string;
  sessionId: string;
  type: string;
  timestamp: number;
  data: Record<string, unknown>;
}

export interface SessionRecording {
  id: string;
  sessionId: string;
  orgId: string;
  events: RecordingEvent[];
  startedAt: Date;
  endedAt: Date | null;
  duration: number;
  size: number;
}

export class RecordingService {
  private readonly recordings = new Map<string, SessionRecording>();
  private readonly activeBuffers = new Map<string, RecordingEvent[]>();

  start(sessionId: string, orgId: string) {
    const recording: SessionRecording = {
      id: nanoid(),
      sessionId,
      orgId,
      events: [],
      startedAt: new Date(),
      endedAt: null,
      duration: 0,
      size: 0,
    };
    this.recordings.set(sessionId, recording);
    this.activeBuffers.set(sessionId, []);
    return recording;
  }

  recordEvent(sessionId: string, type: string, data: Record<string, unknown>) {
    const buffer = this.activeBuffers.get(sessionId);
    if (!buffer) return;

    const event: RecordingEvent = {
      id: nanoid(),
      sessionId,
      type,
      timestamp: Date.now(),
      data,
    };

    buffer.push(event);

    const recording = this.recordings.get(sessionId);
    if (recording) {
      recording.events.push(event);
      recording.size += JSON.stringify(event).length;
    }
  }

  stop(sessionId: string) {
    const recording = this.recordings.get(sessionId);
    if (recording) {
      recording.endedAt = new Date();
      recording.duration = recording.endedAt.getTime() - recording.startedAt.getTime();
    }
    this.activeBuffers.delete(sessionId);
    return recording;
  }

  getRecording(sessionId: string): SessionRecording | null {
    return this.recordings.get(sessionId) ?? null;
  }

  listByOrg(orgId: string): SessionRecording[] {
    return Array.from(this.recordings.values()).filter((r) => r.orgId === orgId);
  }

  getEvents(sessionId: string, from?: number, to?: number): RecordingEvent[] {
    const recording = this.recordings.get(sessionId);
    if (!recording) return [];

    let events = recording.events;
    if (from) events = events.filter((e) => e.timestamp >= from);
    if (to) events = events.filter((e) => e.timestamp <= to);
    return events;
  }

  exportRecording(sessionId: string): string {
    const recording = this.recordings.get(sessionId);
    if (!recording) return "";

    return JSON.stringify({
      id: recording.id,
      sessionId: recording.sessionId,
      startedAt: recording.startedAt.toISOString(),
      endedAt: recording.endedAt?.toISOString(),
      duration: recording.duration,
      events: recording.events,
    });
  }
}
