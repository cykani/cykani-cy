import type { Context } from "hono";

export function errorResponse(c: Context, result: any, status = 400) {
  return c.json({ error: { code: result.error.code, message: result.error.message } }, status as any);
}

export function notFound(c: Context, entity: string, id: string) {
  return c.json({ error: { code: "NOT_FOUND", message: `${entity} '${id}' not found` } }, 404);
}

export function validationError(c: Context, message: string, fields?: Record<string, string>) {
  return c.json({ error: { code: "VALIDATION_ERROR", message, fields } }, 400);
}

export function unauthorized(c: Context, message = "Authentication required") {
  return c.json({ error: { code: "UNAUTHORIZED", message } }, 401);
}

export function forbidden(c: Context, message = "Insufficient permissions") {
  return c.json({ error: { code: "FORBIDDEN", message } }, 403);
}

export function conflict(c: Context, message: string) {
  return c.json({ error: { code: "CONFLICT", message } }, 409);
}

export function rateLimited(c: Context, retryAfterMs: number) {
  return c.json({ error: { code: "RATE_LIMITED", message: `Rate limited. Retry after ${retryAfterMs}ms` }, retryAfterMs }, 429);
}

export function sessionLimit(c: Context, limit: number) {
  return c.json({ error: { code: "SESSION_LIMIT_EXCEEDED", message: `Max ${limit} concurrent sessions` } }, 429);
}

export function internalError(c: Context, message = "Internal server error") {
  return c.json({ error: { code: "INTERNAL_ERROR", message } }, 500);
}
