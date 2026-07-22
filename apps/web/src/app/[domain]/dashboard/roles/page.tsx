import { ComingSoonOverlay } from "../_components/coming-soon-overlay";
import { Roles } from "./_components/roles";
import { roles } from "./_components/roles-table/data";

export default function Page() {
  return (
    <ComingSoonOverlay>
      <Roles roles={roles} />
    </ComingSoonOverlay>
  );
}
