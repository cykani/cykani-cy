import { ComingSoonOverlay } from "../_components/coming-soon-overlay";
import { users } from "./_components/data";
import { Users } from "./_components/users";

export default function Page() {
  return (
    <ComingSoonOverlay>
      <Users users={users} />
    </ComingSoonOverlay>
  );
}
