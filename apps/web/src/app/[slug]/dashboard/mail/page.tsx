import { cookies } from "next/headers";

import { MailComponent } from "./_components/mail";
import { DEFAULT_MAIL_LAYOUT, MAIL_LAYOUT_COOKIE } from "./_components/mail-layout-config";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function MailPage({ params }: Props) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const layoutCookie = cookieStore.get(MAIL_LAYOUT_COOKIE)?.value;

  return (
    <div className="flex h-full min-h-0 overflow-hidden" data-content-padding="false">
      <MailComponent
        slug={slug}
        defaultLayout={layoutCookie ? JSON.parse(layoutCookie) : [...DEFAULT_MAIL_LAYOUT]}
      />
    </div>
  );
}
