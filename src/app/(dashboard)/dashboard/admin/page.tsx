
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  Users,
  Store,
  BriefcaseBusiness,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Ban,
  ClipboardList,
  Loader2,
  RefreshCw,
  UserRound,
} from "lucide-react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type DashboardStats = {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  publishedServices: number;
  totalTransactions: number;
  activeUsers: number;
  blockedUsers: number;
  pendingServices: number;
};

const managementCards = [
  {
    title: "Manage Users",
    description:
      "View, search, and manage all registered users on the platform.",
    href: "/dashboard/admin/users",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
    features: ["View all users", "Search users", "Block / Unblock"],
  },
  {
    title: "Manage Vendors & Customers",
    description:
      "Manage vendors and customers based on their assigned roles.",
    href: "/dashboard/admin/users",
    icon: Store,
    color: "bg-purple-50 text-purple-600",
    features: ["View vendors", "View customers", "Filter by role"],
  },
  {
    title: "Manage Published Services",
    description:
      "Review published services and manage service availability.",
    href: "/dashboard/admin/services",
    icon: BriefcaseBusiness,
    color: "bg-orange-50 text-orange-600",
    features: ["Review services", "Approve / Reject", "Manage services"],
  },
  {
    title: "Platform Transactions",
    description:
      "Monitor platform payments and review transaction records.",
    href: "/dashboard/admin/transactions",
    icon: CreditCard,
    color: "bg-green-50 text-green-600",
    features: ["View transactions", "Payment history", "Track status"],
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BASE_URL}/admin/dashboard/stats`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load dashboard statistics"
        );
      }

      setStats(result.data);
    } catch (err) {
      console.error("Dashboard Stats Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Vendors",
      value: stats?.totalVendors ?? 0,
      icon: Store,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Published Services",
      value: stats?.publishedServices ?? 0,
      icon: BriefcaseBusiness,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Transactions",
      value: stats?.totalTransactions ?? 0,
      icon: CreditCard,
      color: "bg-green-50 text-green-600",
    },
  ];

  const overview = [
    {
      title: "Active Users",
      value: stats?.activeUsers ?? 0,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Blocked Users",
      value: stats?.blockedUsers ?? 0,
      icon: Ban,
      color: "text-red-500",
    },
    {
      title: "Pending Services",
      value: stats?.pendingServices ?? 0,
      icon: Clock,
      color: "text-orange-500",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fffaf7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#f45b4f]">
              <ShieldCheck size={17} />
              Admin Control Panel
            </div>

            <h1 className="text-2xl font-bold text-[#302521] sm:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage users, vendors, services and platform transactions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchDashboardStats}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-[#f1e8e3] bg-white px-4 py-3 text-sm font-medium text-[#302521] shadow-sm transition hover:bg-[#fff1ee] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-[#f1e8e3] bg-white px-4 py-3 shadow-sm">
              <div className="flex size-9 items-center justify-center rounded-full bg-[#fff1ee] text-[#f45b4f]">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#302521]">
                  Administrator
                </p>
                <p className="text-xs text-gray-500">
                  Platform Management
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-600">{error}</p>

            <button
              onClick={fetchDashboardStats}
              className="w-fit rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#302521]">
              Platform Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              A quick overview of your platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-[#f1e8e3] bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-xl p-3 ${stat.color}`}>
                      <Icon size={22} />
                    </div>

                    <ArrowUpRight
                      size={19}
                      className="text-gray-300"
                    />
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-[#302521]">
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-[#f45b4f]" />
                    ) : (
                      stat.value.toLocaleString()
                    )}
                  </h3>
                </div>
              );
            })}
          </div>
        </section>

        {/* Management Sections */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#302521]">
              Management Center
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage every important aspect of your platform from here.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {managementCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group rounded-2xl border border-[#f1e8e3] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#f45b4f]/40 hover:shadow-md sm:p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className={`rounded-xl p-3 ${card.color}`}>
                      <Icon size={25} />
                    </div>

                    <div className="flex size-9 items-center justify-center rounded-full bg-gray-50 transition group-hover:bg-[#fff1ee]">
                      <ArrowUpRight
                        size={19}
                        className="text-gray-400 transition group-hover:text-[#f45b4f]"
                      />
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#302521]">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {card.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {card.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-lg bg-[#fff7f3] px-2.5 py-1.5 text-xs font-medium text-[#a65b4d]"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-sm font-semibold text-[#f45b4f]">
                      Manage Now
                    </span>

                    <ArrowUpRight
                      size={17}
                      className="text-[#f45b4f] transition group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Overview */}
        <section className="rounded-2xl border border-[#f1e8e3] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#302521]">
              Management Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Important information requiring admin attention.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {overview.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-xl bg-[#fffaf7] p-4"
                >
                  <div className={`rounded-xl bg-white p-3 ${item.color}`}>
                    <Icon size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      {item.title}
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-[#302521]">
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-[#f45b4f]" />
                      ) : (
                        item.value.toLocaleString()
                      )}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          {!loading && stats && (
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <UserRound size={14} />
              Total customers: {stats.totalCustomers.toLocaleString()}
            </div>
          )}
        </section>

        {/* Admin Responsibilities */}
        <section className="rounded-2xl bg-[#302521] p-6 text-white sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-orange-200">
                <ShieldCheck size={18} />
                Admin Responsibilities
              </div>

              <h2 className="text-xl font-bold">
                Keep Your Platform Under Control
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-300">
                Monitor registered users, manage vendors and customers,
                review published services and track platform transactions.
              </p>
            </div>

            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <ClipboardList
                size={32}
                className="text-[#ff8a78]"
              />
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
