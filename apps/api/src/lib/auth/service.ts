import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified?: Date;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  orgId: string;
  role: string;
  exp: number;
}

export class AuthService {
  constructor(private readonly jwtSecret: string) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateToken(user: AuthUser, orgId: string, role: string = "owner"): Promise<string> {
    const payload: AuthTokenPayload = {
      sub: user.id,
      email: user.email,
      orgId,
      role,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    };

    return new SignJWT(payload as any)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .sign(new TextEncoder().encode(this.jwtSecret));
  }

  async verifyToken(token: string): Promise<AuthTokenPayload | null> {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(this.jwtSecret));
      return payload as unknown as AuthTokenPayload;
    } catch {
      return null;
    }
  }
}
