import { nanoid } from "nanoid";
import { SessionStatus, transition } from "./state-machine";
import type { DomainEvent } from "../../shared/events";

export interface SessionProps {
  id: string;
  orgId: string;
  profileId: string;
  status: SessionStatus;
  containerId: string | null;
  vncPort: number | null;
  cdpPort: number | null;
  vncPassword: string | null;
  startedAt: Date | null;
  expiresAt: Date | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class Session {
  readonly id: string;
  readonly orgId: string;
  readonly profileId: string;
  private _status: SessionStatus;
  private _containerId: string | null;
  private _vncPort: number | null;
  private _cdpPort: number | null;
  private _vncPassword: string | null;
  private _startedAt: Date | null;
  private _expiresAt: Date | null;
  private _metadata: Record<string, unknown>;
  readonly createdAt: Date;
  private _updatedAt: Date;
  private _events: DomainEvent[] = [];

  private constructor(props: SessionProps) {
    this.id = props.id;
    this.orgId = props.orgId;
    this.profileId = props.profileId;
    this._status = props.status;
    this._containerId = props.containerId;
    this._vncPort = props.vncPort;
    this._cdpPort = props.cdpPort;
    this._vncPassword = props.vncPassword;
    this._startedAt = props.startedAt;
    this._expiresAt = props.expiresAt;
    this._metadata = props.metadata;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get status() { return this._status; }
  get containerId() { return this._containerId; }
  get vncPort() { return this._vncPort; }
  get cdpPort() { return this._cdpPort; }
  get vncPassword() { return this._vncPassword; }
  get startedAt() { return this._startedAt; }
  get expiresAt() { return this._expiresAt; }
  get metadata() { return this._metadata; }
  get updatedAt() { return this._updatedAt; }
  get events() { return this._events; }

  get isExpired() { return this._expiresAt !== null && new Date() > this._expiresAt; }
  get wsUrl() { return this._cdpPort ? `ws://localhost:${this._cdpPort}` : null; }
  get vncWsUrl() { return this._vncPort ? `ws://localhost:${this._vncPort}` : null; }

  static create(orgId: string, profileId: string, ttlMinutes = 30): Session {
    const now = new Date();
    return new Session({
      id: nanoid(),
      orgId,
      profileId,
      status: SessionStatus.IDLE,
      containerId: null,
      vncPort: null,
      cdpPort: null,
      vncPassword: null,
      startedAt: null,
      expiresAt: new Date(now.getTime() + ttlMinutes * 60_000),
      metadata: {},
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: SessionProps): Session {
    return new Session(props);
  }

  launch(containerId: string, vncPort: number, cdpPort: number, vncPassword: string) {
    this._status = transition(this._status, "launching");
    this._containerId = containerId;
    this._vncPort = vncPort;
    this._cdpPort = cdpPort;
    this._vncPassword = vncPassword;
    this._updatedAt = new Date();
    this.emit("session.launched", { containerId, vncPort, cdpPort, profileId: this.profileId, orgId: this.orgId });
  }

  markRunning() {
    this._status = transition(this._status, "running");
    this._startedAt = new Date();
    this._updatedAt = new Date();
  }

  terminate() {
    this._status = transition(this._status, "stopping");
    this._updatedAt = new Date();
    this.emit("session.terminated", { containerId: this._containerId, profileId: this.profileId, orgId: this.orgId });
  }

  markStopped() {
    this._status = transition(this._status, "stopped");
    this._updatedAt = new Date();
  }

  markError(error: string) {
    this._status = transition(this._status, "error");
    this._metadata = { ...this._metadata, lastError: error };
    this._updatedAt = new Date();
    this.emit("session.error", { error, containerId: this._containerId, profileId: this.profileId, orgId: this.orgId });
  }

  private emit(eventType: string, payload: Record<string, unknown>) {
    this._events.push({
      eventId: crypto.randomUUID(),
      eventType,
      aggregateId: this.id,
      aggregateType: "session",
      occurredAt: new Date(),
      payload,
    });
  }

  clearEvents() { this._events = []; }

  toJSON(): SessionProps {
    return {
      id: this.id, orgId: this.orgId, profileId: this.profileId,
      status: this._status, containerId: this._containerId,
      vncPort: this._vncPort, cdpPort: this._cdpPort,
      vncPassword: this._vncPassword, startedAt: this._startedAt,
      expiresAt: this._expiresAt, metadata: this._metadata,
      createdAt: this.createdAt, updatedAt: this._updatedAt,
    };
  }
}
