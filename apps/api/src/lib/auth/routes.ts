import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import { eq } from "drizzle-orm";
import { authUsers, organizations, memberships } from "../db/schema";
import { AuthService } from "./service";
import type { Container } from "../../container";

export function authRouter(container: Container): Hono<ApiEnv> {
  const authService = new AuthService(container.env.JWT_SECRET);
  const r = new Hono<ApiEnv>();

  r.post("/register", async (c) => {
    const body = await c.req.json<{ email: string; password: string; name?: string }>();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: { code: "VALIDATION_ERROR", message: "Email and password are required" } }, 400);
    }

    const existing = await container.db.select().from(authUsers).where(eq(authUsers.email, email)).limit(1);
    if (existing.length > 0) {
      return c.json({ error: { code: "CONFLICT", message: "User already exists" } }, 409);
    }

    const passwordHash = await authService.hashPassword(password);
    const userId = crypto.randomUUID();
    const orgId = crypto.randomUUID();

    await container.db.insert(authUsers).values({
      id: userId,
      email,
      passwordHash,
      name: name || email.split("@")[0],
    });

    await container.db.insert(organizations).values({
      id: orgId,
      name: name || email.split("@")[0],
      ownerId: userId,
    });

    await container.db.insert(memberships).values({
      id: crypto.randomUUID(),
      orgId,
      userId,
      role: "owner",
    });

    const token = await authService.generateToken(
      { id: userId, email, name: name || email.split("@")[0] },
      orgId,
      "owner"
    );

    return c.json({
      user: { id: userId, email, name: name || email.split("@")[0] },
      orgId,
      token,
    }, 201);
  });

  r.post("/login", async (c) => {
    const body = await c.req.json<{ email: string; password: string }>();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: { code: "VALIDATION_ERROR", message: "Email and password are required" } }, 400);
    }

    const [user] = await container.db.select().from(authUsers).where(eq(authUsers.email, email)).limit(1);
    if (!user) {
      return c.json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials" } }, 401);
    }

    const valid = await authService.verifyPassword(password, user.passwordHash);
    if (!valid) {
      return c.json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials" } }, 401);
    }

    const membership = await container.db.select().from(memberships).where(eq(memberships.userId, user.id)).limit(1);
    const orgId = membership[0]?.orgId ?? user.id;
    const role = membership[0]?.role ?? "member";

    const token = await authService.generateToken(
      { id: user.id, email: user.email, name: user.name ?? undefined, image: user.image ?? undefined },
      orgId,
      role
    );

    return c.json({
      user: { id: user.id, email: user.email, name: user.name ?? undefined, image: user.image ?? undefined },
      orgId,
      token,
    });
  });

  r.get("/me", async (c) => {
    const userId = c.get("userId");
    const orgId = c.get("orgId");

    const [user] = await container.db.select().from(authUsers).where(eq(authUsers.id, userId as string)).limit(1);
    if (!user) {
      return c.json({ error: { code: "NOT_FOUND", message: "User not found" } }, 404);
    }

    const membership = await container.db.select().from(memberships).where(eq(memberships.userId, user.id)).limit(1);

    return c.json({
      user: { id: user.id, email: user.email, name: user.name, image: user.image },
      orgId: orgId as string,
      role: membership[0]?.role || "member",
    });
  });

  r.post("/logout", async (c) => {
    return c.json({ success: true });
  });

  return r;
}
