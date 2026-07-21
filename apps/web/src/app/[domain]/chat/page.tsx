import { Chat } from "./_components/chat";
import { conversations } from "./_components/data";
import { ComingSoonOverlay } from "@/app/[domain]/dashboard/_components/coming-soon-overlay";

export default function Page() {
  return (
    <ComingSoonOverlay>
      <Chat conversations={conversations} />
    </ComingSoonOverlay>
  );
}
