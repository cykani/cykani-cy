import { Roles } from "./_components/roles";
import { roles } from "./_components/roles-table/data";
import { ComingSoonOverlay } from "../_components/coming-soon-overlay";

export default function Page() {
  return (
    <ComingSoonOverlay>
      <Roles roles={roles} />
    </ComingSoonOverlay>
  );
}
