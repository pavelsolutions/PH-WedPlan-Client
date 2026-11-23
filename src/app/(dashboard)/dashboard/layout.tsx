
import { ReactNode } from "react";

import { requireDashboardUser } from "@/lib/require-dashboard-user";
import DashboardShell from "./_components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireDashboardUser();

  return (
    <DashboardShell
      role={user.role}
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
      }}
    >
      {children}
    </DashboardShell>
  );
}
