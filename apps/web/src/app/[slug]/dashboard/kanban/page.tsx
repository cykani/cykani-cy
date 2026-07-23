import { ComingSoonOverlay } from "../_components/coming-soon-overlay";
import { initialBoard } from "./_components/data";
import { Kanban } from "./_components/kanban";

export default function Page() {
  return (
    <ComingSoonOverlay>
      <div data-content-padding="false">
        <Kanban initialBoard={initialBoard} />
      </div>
    </ComingSoonOverlay>
  );
}
