
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
  ClipboardList,
  Settings,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DashboardRole = "vendor" | "customer" | "admin";

interface DashboardSidebarProps {
  role: DashboardRole;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  onNavigate?: () => void;
}

const navigation = {
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
  collapsed,
  setCollapsed,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const links = navigation[role];

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-[#f1e5df] bg-white transition-all duration-300",
        collapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-[76px] items-center justify-between border-b border-[#f1e5df] px-4">

        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f45b4f] text-white">
            <Heart size={22} fill="currentColor" />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-[#302521]">
                Wed<span className="text-[#f45b4f]">Plan</span>
              </h1>
              <p className="text-[9px] tracking-[2px] text-[#a58b80]">
                MAKE YOUR DAY SPECIAL
              </p>
            </div>
          )}
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden h-8 w-8 shrink-0 text-[#88766e] hover:bg-[#fff0ec] lg:flex"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </Button>
      </div>

      {/* Role */}
      {!collapsed && (
        <div className="px-5 pb-3 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#b39b91]">
            {role} workspace
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">

        {links.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.title : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-[#fff0ec] text-[#f45b4f]"
                  : "text-[#75645d] hover:bg-[#fff7f4] hover:text-[#f45b4f]",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon size={19} className="shrink-0" />

              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}

      </nav>

      {/* Bottom */}
      <div className="border-t border-[#f1e5df] p-4">
        {!collapsed ? (
          <div className="rounded-xl bg-[#fff7f4] p-3">
            <p className="text-xs font-semibold text-[#302521]">
              WedPlan Dashboard
            </p>
            <p className="mt-1 text-[11px] text-[#a58b80]">
              Manage your wedding journey.
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <Heart size={20} className="text-[#f45b4f]" />
          </div>
        )}
      </div>
    </aside>
  );
}
