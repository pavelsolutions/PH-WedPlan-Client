
import { ReactNode } from "react";
import { requireDashboardUser } from "@/lib/require-dashboard-user";

export default async function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireDashboardUser(["customer"]);

  return <>{children}</>;
}
