import { requireDashboardUser } from "@/lib/dashboard-auth";
import DashboardOverview from "./_components/dashboard/dashboard-overview";

export default async function DashboardPage() {
  const user = await requireDashboardUser();

  return <DashboardOverview role={user.role} />;
}