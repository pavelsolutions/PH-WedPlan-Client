
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export type DashboardRole = "admin" | "vendor" | "customer";

export async function requireDashboardUser(
  allowedRoles?: DashboardRole[]
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as typeof session.user & {
    role?: DashboardRole;
    isBlocked?: boolean;
  };

  if (user.isBlocked) {
    redirect("/login?error=account-blocked");
  }

  if (!user.role) {
    redirect("/unauthorized");
  }

  // Prevent access to another role's dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect(`/dashboard/${user.role}`);
  }

  return {
    ...user,
    role: user.role,
  };
}
