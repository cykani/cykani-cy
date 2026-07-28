import { ProfileGrid } from "./_components/profile-grid";
import { ProfileStats } from "./_components/profile-stats";

export default async function ProfilesPage() {
  // Profiles are stored client-side (localStorage) for demo — API wiring can replace this
  return (
    <div className="@container/main flex flex-col gap-6">
      <ProfileStats profiles={[]} />
      <ProfileGrid profiles={[]} />
    </div>
  );
}
