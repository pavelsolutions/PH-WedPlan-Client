
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  PlusCircle,
  CalendarDays,
  CreditCard,
  Users,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type DashboardRole = "vendor" | "customer" | "admin";

interface DashboardSidebarProps {
  role: DashboardRole;
  onNavigate?: () => void;
}

// Important: navigation must be exported
export const navigation = {
  vendor: [
    { title: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { title: "My Services", href: "/dashboard/vendor/services", icon: BriefcaseBusiness },
    { title: "Add Service", href: "/dashboard/vendor/services/add", icon: PlusCircle },
    { title: "Booking Requests", href: "/dashboard/vendor/bookings", icon: CalendarDays },
    { title: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCard },
    { title: "Profile Settings", href: "/dashboard/profile", icon: Settings },
  ],

  customer: [
    { title: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { title: "My Bookings", href: "/dashboard/customer/bookings", icon: CalendarDays },
    { title: "Profile Settings", href: "/dashboard/profile", icon: Settings },
  ],

  admin: [
    { title: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { title: "Manage Services", href: "/dashboard/admin/services", icon: BriefcaseBusiness },
    { title: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
  ],
};

export default function DashboardSidebar({
  role,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const links = navigation[role];

  const workspaceTitle = {
    vendor: "Vendor Portal",
    customer: "Customer Portal",
    admin: "Admin Portal",
  }[role];

  return (
    <aside className="h-fit w-full rounded-xl border border-[#eadfd8] bg-white p-3 shadow-sm">
      <div className="px-1 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-[#a58b80]">
          Workspace
        </p>

        <h2 className="mt-1 text-sm font-bold text-[#302521]">
          {workspaceTitle}
        </h2>
      </div>

      <div className="mb-3 border-t border-[#f1e5df]" />

      <nav className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== `/dashboard/${role}` &&
              pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-xs font-medium transition-colors",
                active
                  ? "bg-[#dc2027] text-white shadow-sm"
                  : "text-[#75645d] hover:bg-[#fff0ec] hover:text-[#dc2027]"
              )}
            >
              <Icon size={14} className="shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
