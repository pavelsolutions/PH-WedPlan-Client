
import { redirect } from "next/navigation";

import { requireDashboardUser } from "@/lib/dashboard-auth";
import DashboardShell from "./_components/dashboard/dashboard-shell";
import type { DashboardRole } from "./_components/dashboard/dashboard-sidebar";

const isDashboardRole = (role: string): role is DashboardRole => {
  return ["vendor", "customer", "admin"].includes(role);
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireDashboardUser();

  // Normalize role
  const role = String(user.role ?? "").trim().toLowerCase();

  // Validate role
  if (!isDashboardRole(role)) {
    redirect("/login");
  }

  return (
    <DashboardShell user={user} role={role}>
      {children}
    </DashboardShell>
  );
}
