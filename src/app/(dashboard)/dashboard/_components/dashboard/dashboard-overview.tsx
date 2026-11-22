
import Link from "next/link";

import {
  CalendarDays,
  BriefcaseBusiness,
  Users,
  CreditCard,
  TrendingUp,
  ClipboardList,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  Wallet,
  Sparkles,
  ChevronRight,
  Settings,
  Search,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { DashboardRole } from "./dashboard-sidebar";

interface DashboardOverviewProps {
  role: DashboardRole;
}

const dashboardData = {
  vendor: {
    title: "Vendor Dashboard",
    subtitle: "Manage your business and grow with WedPlan.",
    stats: [
      {
        title: "Total Services",
        value: "—",
        description: "Your listed services",
        icon: BriefcaseBusiness,
      },
      {
        title: "Booking Requests",
        value: "—",
        description: "Pending requests",
        icon: CalendarDays,
      },
      {
        title: "Total Earnings",
        value: "—",
        description: "Your business revenue",
        icon: Wallet,
      },
      {
        title: "Completed Bookings",
        value: "—",
        description: "Successfully completed",
        icon: CheckCircle2,
      },
    ],
    actions: [
      {
        title: "Add New Service",
        description: "List a new wedding service",
        href: "/dashboard/services/add",
        icon: Plus,
      },
      {
        title: "Manage Services",
        description: "Update your existing services",
        href: "/dashboard/services",
        icon: BriefcaseBusiness,
      },
      {
        title: "Booking Requests",
        description: "Review customer requests",
        href: "/dashboard/bookings",
        icon: CalendarDays,
      },
    ],
  },

  customer: {
    title: "Customer Dashboard",
    subtitle: "Plan your perfect wedding, one step at a time.",
    stats: [
      {
        title: "Total Bookings",
        value: "—",
        description: "All your bookings",
        icon: CalendarDays,
      },
      {
        title: "Upcoming Events",
        value: "—",
        description: "Your upcoming bookings",
        icon: Clock,
      },
      {
        title: "Completed Bookings",
        value: "—",
        description: "Successfully completed",
        icon: CheckCircle2,
      },
    ],
    actions: [
      {
        title: "Browse Services",
        description: "Discover wedding professionals",
        href: "/services",
        icon: Search,
      },
      {
        title: "My Bookings",
        description: "Track your bookings",
        href: "/dashboard/bookings",
        icon: CalendarDays,
      },
      {
        title: "Profile Settings",
        description: "Manage your account",
        href: "/dashboard/profile",
        icon: Settings,
      },
    ],
  },

  admin: {
    title: "Admin Dashboard",
    subtitle: "Monitor and manage your WedPlan platform.",
    stats: [
      {
        title: "Total Users",
        value: "—",
        description: "Registered platform users",
        icon: Users,
      },
      {
        title: "Total Vendors",
        value: "—",
        description: "Registered vendors",
        icon: BriefcaseBusiness,
      },
      {
        title: "Total Services",
        value: "—",
        description: "Listed wedding services",
        icon: ClipboardList,
      },
      {
        title: "Transactions",
        value: "—",
        description: "Platform transactions",
        icon: CreditCard,
      },
    ],
    actions: [
      {
        title: "Manage Users",
        description: "View and manage accounts",
        href: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Manage Services",
        description: "Review listed services",
        href: "/dashboard/services",
        icon: ClipboardList,
      },
      {
        title: "Transactions",
        description: "Monitor platform payments",
        href: "/dashboard/transactions",
        icon: CreditCard,
      },
    ],
  },
};

export default function DashboardOverview({
  role,
}: DashboardOverviewProps) {
  const data = dashboardData[role];

  return (
    <div className="space-y-8">

      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#302521] to-[#61443b] p-6 text-white shadow-lg sm:p-8">

        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-[#f45b4f]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

          <div>
            <Badge className="mb-4 border border-white/20 bg-white/10 text-white hover:bg-white/10">
              <Sparkles size={13} className="mr-2" />
              WEDPLAN DASHBOARD
            </Badge>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome to {data.title}!
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-white/70">
              {data.subtitle}
            </p>
          </div>

          {role === "vendor" && (
            <Button
              className="rounded-xl bg-[#f45b4f] text-white hover:bg-[#df493e]"
            >
              <Link href="/dashboard/services/add">
                <Plus size={17} className="mr-2" />
                Add New Service
              </Link>
            </Button>
          )}

          {role === "customer" && (
            <Button
              className="rounded-xl bg-[#f45b4f] text-white hover:bg-[#df493e]"
            >
              <Link href="/services">
                <Search size={17} className="mr-2" />
                Browse Services
              </Link>
            </Button>
          )}

          {role === "admin" && (
            <Button
              className="rounded-xl bg-[#f45b4f] text-white hover:bg-[#df493e]"
            >
              <Link href="/dashboard/users">
                <Users size={17} className="mr-2" />
                Manage Users
              </Link>
            </Button>
          )}

        </div>
      </section>

      {/* Statistics */}
      <section className="space-y-4">

        <div>
          <h2 className="text-lg font-bold text-[#302521]">
            Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Your dashboard statistics at a glance.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {data.stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.title}
                className="group rounded-2xl border-[#f1e5df] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <CardContent className="p-5">

                  <div className="flex items-center justify-between">

                    <div className="rounded-xl bg-[#fff0ec] p-3 transition-colors group-hover:bg-[#ffe1d9]">
                      <Icon size={21} className="text-[#f45b4f]" />
                    </div>

                    <Badge variant="outline" className="border-[#f1e5df] text-xs text-[#a58b80]">
                      Overview
                    </Badge>

                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-medium text-[#88766e]">
                      {stat.title}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold tracking-tight text-[#302521]">
                      {stat.value}
                    </h3>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>

                </CardContent>
              </Card>
            );
          })}

        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">

        <div>
          <h2 className="text-lg font-bold text-[#302521]">
            Quick Actions
          </h2>
          <p className="text-sm text-muted-foreground">
            Quickly access your frequently used features.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {data.actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group"
              >
                <Card className="h-full rounded-2xl border-[#f1e5df] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#f45b4f]/40 hover:shadow-md">

                  <CardContent className="flex items-center gap-4 p-5">

                    <div className="rounded-xl bg-[#fff0ec] p-3 transition-colors group-hover:bg-[#ffe1d9]">
                      <Icon size={22} className="text-[#f45b4f]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[#302521]">
                        {action.title}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>

                    <ChevronRight
                      size={19}
                      className="shrink-0 text-[#a58b80] transition-transform group-hover:translate-x-1 group-hover:text-[#f45b4f]"
                    />

                  </CardContent>

                </Card>
              </Link>
            );
          })}

        </div>
      </section>

      {/* Bottom Sections */}
      <section className="grid gap-5 xl:grid-cols-2">

        {/* Recent Activity */}
        <Card className="rounded-2xl border-[#f1e5df] shadow-sm">

          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-[#302521]">
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest account activities.
              </CardDescription>
            </div>

            <div className="rounded-xl bg-[#fff0ec] p-2">
              <TrendingUp size={19} className="text-[#f45b4f]" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex min-h-[190px] flex-col items-center justify-center text-center">

              <div className="mb-3 rounded-full bg-[#fff0ec] p-4">
                <ClipboardList size={25} className="text-[#f45b4f]" />
              </div>

              <h3 className="font-semibold text-[#302521]">
                No recent activity
              </h3>

              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Your recent activities will appear here once data is connected.
              </p>

            </div>
          </CardContent>

        </Card>

        {/* Upcoming / Platform Information */}
        <Card className="rounded-2xl border-[#f1e5df] shadow-sm">

          <CardHeader>
            <CardTitle className="text-base text-[#302521]">
              {role === "admin"
                ? "Platform Activity"
                : "Upcoming Bookings"}
            </CardTitle>

            <CardDescription>
              {role === "admin"
                ? "Keep track of platform updates."
                : "Keep track of your upcoming wedding events."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex min-h-[190px] flex-col items-center justify-center text-center">

              <div className="mb-3 rounded-full bg-[#fff0ec] p-4">
                {role === "admin" ? (
                  <Users size={25} className="text-[#f45b4f]" />
                ) : (
                  <CalendarDays size={25} className="text-[#f45b4f]" />
                )}
              </div>

              <h3 className="font-semibold text-[#302521]">
                Nothing to display yet
              </h3>

              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                {role === "admin"
                  ? "Platform updates will appear here."
                  : "Your upcoming booking information will appear here."}
              </p>

            </div>
          </CardContent>

        </Card>

      </section>

      {/* Footer */}
      <div className="border-t border-[#f1e5df] pt-5 text-center text-xs text-[#a58b80]">
        © 2026 WedPlan. All rights reserved.
      </div>

    </div>
  );
}
