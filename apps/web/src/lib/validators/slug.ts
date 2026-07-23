export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 48;

export const validSlugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const RESERVED_SLUGS = new Set([
  "sign-in",
  "sign-up",
  "new",
  "api",
  "admin",
  "dashboard",
  "settings",
  "profile",
  "unauthorized",
  "pricing",
  "docs",
  "blog",
  "changelog",
  "about",
  "contact",
  "faq",
  "terms",
  "privacy",
  "integrations",
  "products",
  "clients",
  "mail",
  "chat",
]);

export function validateSlug(slug: string): string | null {
  if (slug.length < SLUG_MIN_LENGTH) {
    return `Slug must be at least ${SLUG_MIN_LENGTH} characters`;
  }
  if (slug.length > SLUG_MAX_LENGTH) {
    return `Slug must be less than ${SLUG_MAX_LENGTH} characters`;
  }
  if (!validSlugRegex.test(slug)) {
    return "Slug must be lowercase letters, numbers, and hyphens (no leading/trailing hyphens)";
  }
  if (RESERVED_SLUGS.has(slug)) {
    return "This slug is reserved";
  }
  return null;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH);
}
