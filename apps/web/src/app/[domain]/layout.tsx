import type { ReactNode } from "react";

import { redirect } from "next/navigation";

interface DomainLayoutProps {
  children: ReactNode;
  params: Promise<{ domain: string }>;
}

export default async function DomainLayout({ children, params }: DomainLayoutProps) {
  const { domain } = await params;

  // TODO: Validate domain/tenant exists in database
  // For now, allow all domains through
  // const tenant = await db.query.tenants.findFirst({ where: eq(tenants.domain, domain) });
  // if (!tenant) redirect("/");

  return <>{children}</>;
}
