import { redirect } from "next/navigation";
import { requireDashboardUser } from "@/lib/require-dashboard-user";

export default async function DashboardRedirect() {
    const user = await requireDashboardUser();

    const routes = {
        admin: "/dashboard/admin",
        vendor: "/dashboard/vendor",
        customer: "/dashboard/customer",
    };

    redirect(routes[user.role]);
}