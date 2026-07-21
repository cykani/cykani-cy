import { Calendar } from "./_components/calendar";
import { ComingSoonOverlay } from "../_components/coming-soon-overlay";

export default function Page() {
  return (
    <ComingSoonOverlay>
      <Calendar />
    </ComingSoonOverlay>
  );
}
