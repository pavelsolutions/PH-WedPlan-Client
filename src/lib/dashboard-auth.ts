
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireDashboardUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const user = session.user as typeof session.user & {
    role?: string;
    isBlocked?: boolean;
  };

  if (user.isBlocked) {
    redirect("/signin?blocked=true");
  }

  if (
    !["vendor", "customer", "admin"].includes(user.role || "")
  ) {
    redirect("/signin");
  }

  return {
    ...user,
    role: user.role as "vendor" | "customer" | "admin",
  };
}
