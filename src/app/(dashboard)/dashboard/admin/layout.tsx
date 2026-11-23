
import { ReactNode } from "react";
import { requireDashboardUser } from "@/lib/require-dashboard-user";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireDashboardUser(["admin"]);

  return <>{children}</>;
}
