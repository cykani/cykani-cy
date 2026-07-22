import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@cykani/db/client";
import { organizations, memberships } from "@cykani/db/schema";
import { validateSlug, slugify } from "@cykani/lib/validators/slug";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, slug: rawSlug } = await req.json();
  if (!name || !rawSlug) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 422 });
  }

  const slug = rawSlug.toLowerCase().trim();
  const slugError = validateSlug(slug);
  if (slugError) {
    return NextResponse.json({ error: slugError }, { status: 422 });
  }

  const existingOrg = await db.select({ id: organizations.id }).from(organizations).where(eq(organizations.slug, slug)).limit(1);
  if (existingOrg.length > 0) {
    return NextResponse.json({ error: "This workspace URL is already taken" }, { status: 409 });
  }

  const [org] = await db.insert(organizations).values({ name: name.trim(), slug, ownerId: userId }).returning();
  await db.insert(memberships).values({ orgId: org.id, userId, role: "owner" });

  return NextResponse.json({ slug: org.slug, name: org.name });
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgs = await db
    .select({ id: organizations.id, name: organizations.name, slug: organizations.slug, plan: organizations.plan })
    .from(organizations)
    .innerJoin(memberships, eq(memberships.orgId, organizations.id))
    .where(eq(memberships.userId, userId));

  return NextResponse.json(orgs);
}
