export class AppError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "AppError";
  }

  static notFound(entity: string, id: string) {
    return new AppError("NOT_FOUND", `${entity} '${id}' not found`);
  }

  static validation(message: string) {
    return new AppError("VALIDATION_ERROR", message);
  }

  static unauthorized(message = "Authentication required") {
    return new AppError("UNAUTHORIZED", message);
  }

  static forbidden(message = "Insufficient permissions") {
    return new AppError("FORBIDDEN", message);
  }

  static conflict(message: string) {
    return new AppError("CONFLICT", message);
  }

  static rateLimited(retryAfterMs: number) {
    return new AppError("RATE_LIMITED", `Rate limited. Retry after ${retryAfterMs}ms`);
  }

  static sessionLimit(limit: number) {
    return new AppError("SESSION_LIMIT_EXCEEDED", `Max ${limit} concurrent sessions per org`);
  }

  static container(message: string) {
    return new AppError("CONTAINER_ERROR", message);
  }
}

export type Result<T, E extends AppError = AppError> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function Err<E extends AppError>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function unwrap<T>(result: Result<T>): T {
  if (!result.ok) throw result.error;
  return result.value;
}

export function isError<T>(result: Result<T>): result is { ok: false; error: AppError } {
  return !result.ok;
}
