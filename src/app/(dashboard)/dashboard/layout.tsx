import { requireDashboardUser } from "@/lib/dashboard-auth";
import DashboardShell from "./_components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireDashboardUser();

  return (
    <DashboardShell user={user} role={user.role}>
      {children}
    </DashboardShell>
  );
}