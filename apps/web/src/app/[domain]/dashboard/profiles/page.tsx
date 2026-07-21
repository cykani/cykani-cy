import { api } from "@cykani/lib/api/client";

import { ProfileGrid } from "./_components/profile-grid";
import { ProfileStats } from "./_components/profile-stats";
import { ComingSoonOverlay } from "../_components/coming-soon-overlay";

export default async function ProfilesPage() {
  let profiles: any[] = [];
  try {
    const data = await api.profiles.list({ limit: 20 });
    profiles = data.profiles;
  } catch {
    // Use empty array if API unavailable
  }

  return (
    <ComingSoonOverlay>
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <ProfileStats profiles={profiles} />
        <ProfileGrid profiles={profiles} />
      </div>
    </ComingSoonOverlay>
  );
}
