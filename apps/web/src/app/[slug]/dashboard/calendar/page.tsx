import { ComingSoonOverlay } from "../_components/coming-soon-overlay";
import { Calendar } from "./_components/calendar";

export default function Page() {
  return (
    <ComingSoonOverlay>
      <Calendar />
    </ComingSoonOverlay>
  );
}
