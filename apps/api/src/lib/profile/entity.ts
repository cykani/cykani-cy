import { nanoid } from "nanoid";

export interface ProfileProps {
  id: string; orgId: string; name: string; fingerprintSeed: number;
  platform: "windows" | "macos" | "linux" | "android";
  proxyUrl: string | null; viewportWidth: number; viewportHeight: number;
  locale: string; timezone: string; userAgent: string | null;
  cookies: Record<string, unknown> | null; localStorage: Record<string, string> | null;
  extensions: string[]; createdAt: Date; updatedAt: Date;
}

export class Profile {
  readonly id: string; readonly orgId: string;
  private _name: string; private _fingerprintSeed: number;
  private _platform: ProfileProps["platform"]; private _proxyUrl: string | null;
  private _viewportWidth: number; private _viewportHeight: number;
  private _locale: string; private _timezone: string;
  private _userAgent: string | null; private _cookies: Record<string, unknown> | null;
  private _localStorage: Record<string, string> | null; private _extensions: string[];
  readonly createdAt: Date; private _updatedAt: Date;

  private constructor(p: ProfileProps) {
    this.id = p.id; this.orgId = p.orgId; this._name = p.name;
    this._fingerprintSeed = p.fingerprintSeed; this._platform = p.platform;
    this._proxyUrl = p.proxyUrl; this._viewportWidth = p.viewportWidth;
    this._viewportHeight = p.viewportHeight; this._locale = p.locale;
    this._timezone = p.timezone; this._userAgent = p.userAgent;
    this._cookies = p.cookies; this._localStorage = p.localStorage;
    this._extensions = p.extensions; this.createdAt = p.createdAt;
    this._updatedAt = p.updatedAt;
  }

  get name() { return this._name; }
  get fingerprintSeed() { return this._fingerprintSeed; }
  get platform() { return this._platform; }
  get proxyUrl() { return this._proxyUrl; }
  get viewportWidth() { return this._viewportWidth; }
  get viewportHeight() { return this._viewportHeight; }
  get locale() { return this._locale; }
  get timezone() { return this._timezone; }
  get extensions() { return this._extensions; }
  get updatedAt() { return this._updatedAt; }

  get browserArgs(): string[] {
    const args = [`--fingerprint=${this._fingerprintSeed}`, `--fingerprint-platform=${this._platform}`];
    if (this._proxyUrl) args.push(`--proxy-server=${this._proxyUrl}`);
    return args;
  }

  toStealthEntity(base?: Partial<{ humor: boolean; userDataDir: string }>): {
    fingerprint: number;
    platform: string;
    locale: string;
    timezone: string;
    viewport: { width: number; height: number };
    proxy?: string;
    humor: boolean;
  } {
    return {
      fingerprint: this._fingerprintSeed,
      platform: this._platform,
      locale: this._locale,
      timezone: this._timezone,
      viewport: { width: this._viewportWidth, height: this._viewportHeight },
      proxy: this._proxyUrl ?? undefined,
      humor: true,
      ...base,
    };
  }

  static create(input: { orgId: string; name: string; fingerprintSeed?: number; platform?: ProfileProps["platform"]; proxyUrl?: string; viewportWidth?: number; viewportHeight?: number; locale?: string; timezone?: string; extensions?: string[] }): Profile {
    const now = new Date();
    return new Profile({
      id: nanoid(), orgId: input.orgId, name: input.name,
      fingerprintSeed: input.fingerprintSeed ?? Math.floor(Math.random() * 10000),
      platform: input.platform ?? "windows", proxyUrl: input.proxyUrl ?? null,
      viewportWidth: input.viewportWidth ?? 1280, viewportHeight: input.viewportHeight ?? 800,
      locale: input.locale ?? "en-US", timezone: input.timezone ?? "America/New_York",
      userAgent: null, cookies: null, localStorage: null,
      extensions: input.extensions ?? [], createdAt: now, updatedAt: now,
    });
  }

  static reconstitute(p: ProfileProps) { return new Profile(p); }

  update(input: Partial<Pick<ProfileProps, "name" | "platform" | "proxyUrl" | "viewportWidth" | "viewportHeight" | "locale" | "timezone" | "extensions">>) {
    if (input.name !== undefined) this._name = input.name;
    if (input.platform !== undefined) this._platform = input.platform;
    if (input.proxyUrl !== undefined) this._proxyUrl = input.proxyUrl;
    if (input.viewportWidth !== undefined) this._viewportWidth = input.viewportWidth;
    if (input.viewportHeight !== undefined) this._viewportHeight = input.viewportHeight;
    if (input.locale !== undefined) this._locale = input.locale;
    if (input.timezone !== undefined) this._timezone = input.timezone;
    if (input.extensions !== undefined) this._extensions = input.extensions;
    this._updatedAt = new Date();
  }

  clone(newOrgId: string, newName: string) {
    return Profile.create({ orgId: newOrgId, name: newName, fingerprintSeed: Math.floor(Math.random() * 10000), platform: this._platform, proxyUrl: this._proxyUrl ?? undefined, viewportWidth: this._viewportWidth, viewportHeight: this._viewportHeight, locale: this._locale, timezone: this._timezone, extensions: [...this._extensions] });
  }

  toJSON(): ProfileProps {
    return { id: this.id, orgId: this.orgId, name: this._name, fingerprintSeed: this._fingerprintSeed, platform: this._platform, proxyUrl: this._proxyUrl, viewportWidth: this._viewportWidth, viewportHeight: this._viewportHeight, locale: this._locale, timezone: this._timezone, userAgent: this._userAgent, cookies: this._cookies, localStorage: this._localStorage, extensions: this._extensions, createdAt: this.createdAt, updatedAt: this._updatedAt };
  }
}
