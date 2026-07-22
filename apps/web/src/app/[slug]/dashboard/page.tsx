import { KpiCards } from "./_components/crm/kpi-cards";
import { OpportunitiesSection } from "./_components/crm/opportunities-section";
import { PipelineActivity } from "./_components/crm/pipeline-activity";
import { TaskReminders } from "./_components/crm/task-reminders";

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <KpiCards />
      <PipelineActivity />
      <TaskReminders />
      <OpportunitiesSection />
    </div>
  );
}
