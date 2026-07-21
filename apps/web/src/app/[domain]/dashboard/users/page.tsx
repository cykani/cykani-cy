import { users } from "./_components/data";
import { Users } from "./_components/users";
import { ComingSoonOverlay } from "../_components/coming-soon-overlay";

export default function Page() {
  return (
    <ComingSoonOverlay>
      <Users users={users} />
    </ComingSoonOverlay>
  );
}
