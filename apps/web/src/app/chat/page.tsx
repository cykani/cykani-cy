import { ComingSoonOverlay } from "@/app/[slug]/dashboard/_components/coming-soon-overlay";

import { Chat } from "./_components/chat";
import { conversations } from "./_components/data";

export default function Page() {
  return (
    <ComingSoonOverlay>
      <Chat conversations={conversations} />
    </ComingSoonOverlay>
  );
}
