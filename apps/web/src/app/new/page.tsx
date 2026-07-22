import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@cykani/db/client";
import { organizations, memberships } from "@cykani/db/schema";

import { auth } from "@/lib/auth";

import { CreateWorkspaceForm } from "./create-workspace-form";

export default async function NewWorkspacePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const existing = await db
    .select({ slug: organizations.slug })
    .from(organizations)
    .innerJoin(memberships, eq(memberships.orgId, organizations.id))
    .where(eq(memberships.userId, session.user.id))
    .limit(1);

  if (existing.length > 0) {
    redirect(`/${existing[0].slug}/dashboard`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-semibold text-2xl tracking-tight">Create your workspace</h1>
          <p className="text-muted-foreground text-sm">
            Choose a name and URL for your workspace.
          </p>
        </div>
        <CreateWorkspaceForm />
      </div>
    </div>
  );
}
