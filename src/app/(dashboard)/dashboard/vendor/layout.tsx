
import { ReactNode } from "react";
import { requireDashboardUser } from "@/lib/require-dashboard-user";

export default async function VendorLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireDashboardUser(["vendor"]);

  return <>{children}</>;
}
