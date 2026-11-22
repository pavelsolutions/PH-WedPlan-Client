
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
  CalendarDays,
  Receipt,
  Wallet,
} from "lucide-react";

import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

type Transaction = {
  _id: string;
  vendorId?: string;
  plan?: string;
  amount?: number;
  currency?: string;
  status?: string;
  stripeSessionId?: string;
  stripeSubscriptionId?: string;
  createdAt?: string | Date;
};

const managementCards = [
  {
    title: "Manage Users",
    description: "View and manage registered platform users.",
    href: "/dashboard/admin/users",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
    features: ["View users", "Search users", "Block / Unblock"],
  },
  {
    title: "Manage Vendors & Customers",
    description: "Manage vendors and customers by their roles.",
    href: "/dashboard/admin/users",
    icon: Store,
    color: "bg-purple-50 text-purple-600",
    features: ["View vendors", "View customers", "Filter by role"],
  },
  {
    title: "Manage Published Services",
    description: "Review and manage vendor service listings.",
    href: "/dashboard/admin/services",
    icon: BriefcaseBusiness,
    color: "bg-orange-50 text-orange-600",
    features: ["Review services", "Approve / Reject", "Manage services"],
  },
  {
    title: "Platform Transactions",
    description: "Monitor payments and subscription transactions.",
    href: "/dashboard/admin/transactions",
    icon: CreditCard,
    color: "bg-green-50 text-green-600",
    features: ["View transactions", "Payment history", "Track status"],
  },
];

// Status formatting
const normalizeStatus = (status?: string) =>
  (status?.trim() || "pending")
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());

// Plan formatting
const normalizePlan = (plan?: string) =>
  (plan?.trim() || "Unknown")
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());

// Date formatting
const formatDate = (date?: string | Date) => {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Currency formatting
const formatAmount = (
  amount?: number,
  currency?: string
) => {
  if (amount == null || !Number.isFinite(Number(amount))) {
    return "N/A";
  }

  const currencyCode = (currency || "usd").toUpperCase();

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Transaction status colors
const getTransactionStatusStyle = (status?: string) => {
  switch ((status || "pending").toLowerCase()) {
    case "paid":
      return "bg-green-50 text-green-700 border-green-200";

    case "failed":
      return "bg-red-50 text-red-600 border-red-200";

    case "refunded":
      return "bg-purple-50 text-purple-700 border-purple-200";

    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard statistics
  const fetchDashboardStats = useCallback(async () => {
    try {
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

  // Fetch real transactions
  const fetchRecentTransactions = useCallback(async () => {
    try {
      setTransactionLoading(true);

      const response = await fetch(
        `${BASE_URL}/admin/transactions?limit=5`,
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
          result.message || "Failed to load transactions"
        );
      }

      setTransactions(
        Array.isArray(result.data) ? result.data : []
      );
    } catch (err) {
      console.error("Transaction Fetch Error:", err);
      toast.error("Failed to load recent transactions");
    } finally {
      setTransactionLoading(false);
    }
  }, []);

  // Initial load + automatic refresh every 30 seconds
  const refreshDashboard = useCallback(async () => {
    await Promise.all([
      fetchDashboardStats(),
      fetchRecentTransactions(),
    ]);
  }, [fetchDashboardStats, fetchRecentTransactions]);

  useEffect(() => {
    void refreshDashboard();

    const interval = setInterval(() => {
      void refreshDashboard();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshDashboard]);

  // Main statistics
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

  // Overview
  const overview = [
    {
      title: "Active Users",
      value: stats?.activeUsers ?? 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Blocked Users",
      value: stats?.blockedUsers ?? 0,
      icon: Ban,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      title: "Pending Services",
      value: stats?.pendingServices ?? 0,
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fffaf7] p-4 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* Header */}
        <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#f45b4f]">
              <ShieldCheck size={16} />
              Admin Control Panel
            </div>

            <h1 className="text-2xl font-bold text-[#302521]">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage users, services and platform transactions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => void refreshDashboard()}
              disabled={loading || transactionLoading}
              className="flex items-center gap-2 rounded-lg border border-[#f1e8e3] bg-white px-3 py-2 text-sm font-medium text-[#302521] shadow-sm transition hover:bg-[#fff1ee] disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  loading || transactionLoading
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>

            <div className="flex items-center gap-2 rounded-lg border border-[#f1e8e3] bg-white px-3 py-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#fff1ee] text-[#f45b4f]">
                <ShieldCheck size={17} />
              </div>

              <div>
                <p className="text-xs font-semibold text-[#302521]">
                  Administrator
                </p>
                <p className="text-[10px] text-gray-500">
                  Platform Management
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>

            <button
              onClick={() => void fetchDashboardStats()}
              className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Statistics */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#302521]">
                Platform Overview
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Your platform statistics at a glance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-[#f1e8e3] bg-white p-3.5 shadow-sm transition hover:shadow-md sm:p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-lg p-2 ${stat.color}`}>
                      <Icon size={19} />
                    </div>

                    <ArrowUpRight
                      size={16}
                      className="text-gray-300"
                    />
                  </div>

                  <p className="mt-3 text-xs font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-[#302521]">
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-[#f45b4f]" />
                    ) : (
                      stat.value.toLocaleString()
                    )}
                  </h3>
                </div>
              );
            })}
          </div>
        </section>

        {/* Management Center */}
        <section>
          <div className="mb-3">
            <h2 className="text-base font-bold text-[#302521]">
              Management Center
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Manage every important aspect of your platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {managementCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group rounded-xl border border-[#f1e8e3] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#f45b4f]/40 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-lg p-2.5 ${card.color}`}>
                      <Icon size={21} />
                    </div>

                    <ArrowUpRight
                      size={17}
                      className="text-gray-300 transition group-hover:text-[#f45b4f]"
                    />
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-[#302521]">
                    {card.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {card.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {card.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-md bg-[#fff7f3] px-2 py-1 text-[10px] font-medium text-[#a65b4d]"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs font-semibold text-[#f45b4f]">
                      Manage Now
                    </span>

                    <ArrowUpRight
                      size={15}
                      className="text-[#f45b4f] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="overflow-hidden rounded-xl border border-[#f1e8e3] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-[#f1e8e3] px-4 py-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-green-50 p-2 text-green-600">
                  <Wallet size={18} />
                </div>

                <h2 className="text-base font-bold text-[#302521]">
                  Recent Transactions
                </h2>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Latest payment and subscription activities.
              </p>
            </div>

            <Link
              href="/dashboard/admin/transactions"
              className="flex items-center gap-1 text-xs font-semibold text-[#f45b4f] hover:underline"
            >
              View All Transactions
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {transactionLoading ? (
            <div className="flex min-h-44 items-center justify-center gap-2">
              <Loader2
                size={21}
                className="animate-spin text-[#f45b4f]"
              />
              <span className="text-sm text-gray-500">
                Loading transactions...
              </span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex min-h-44 flex-col items-center justify-center px-4 text-center">
              <div className="rounded-full bg-[#fff7f3] p-3">
                <Receipt size={25} className="text-[#f45b4f]" />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-[#302521]">
                No Transactions Yet
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Transactions will appear here when payments are recorded.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="bg-[#fffaf7]">
                  <tr className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">Transaction</th>
                    <th className="px-4 py-3">Vendor ID</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f4eeeb]">
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="transition hover:bg-[#fffaf7]"
                    >
                      <td className="px-4 py-3">
                        <p className="max-w-[150px] truncate text-xs font-semibold text-[#302521]">
                          {transaction._id}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          {transaction.stripeSessionId
                            ? "Stripe Payment"
                            : "Payment Record"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="max-w-[130px] truncate text-xs text-gray-600">
                          {transaction.vendorId || "N/A"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-md bg-[#fff7f3] px-2 py-1 text-xs font-medium text-[#a65b4d]">
                          {normalizePlan(transaction.plan)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-[#302521]">
                          {formatAmount(
                            transaction.amount,
                            transaction.currency
                          )}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getTransactionStatusStyle(transaction.status)}`}
                        >
                          {normalizeStatus(transaction.status)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <CalendarDays size={13} />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!transactionLoading && transactions.length > 0 && (
            <div className="flex items-center justify-between border-t border-[#f1e8e3] px-4 py-3">
              <p className="text-xs text-gray-500">
                Showing latest {transactions.length} transactions
              </p>

              <button
                onClick={() => void fetchRecentTransactions()}
                className="flex items-center gap-1.5 text-xs font-medium text-[#f45b4f] hover:underline"
              >
                <RefreshCw size={13} />
                Refresh
              </button>
            </div>
          )}
        </section>

        {/* Management Overview */}
        <section className="rounded-xl border border-[#f1e8e3] bg-white p-4 shadow-sm">
          <div className="mb-3">
            <h2 className="text-base font-bold text-[#302521]">
              Management Overview
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Important information requiring admin attention.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {overview.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-lg border border-[#f1e8e3] bg-[#fffaf7] p-3"
                >
                  <div className={`rounded-lg p-2 ${item.bg} ${item.color}`}>
                    <Icon size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      {item.title}
                    </p>

                    <h3 className="mt-0.5 text-lg font-bold text-[#302521]">
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#f45b4f]" />
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
            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-400">
              <UserRound size={14} />
              Total Customers: {stats.totalCustomers.toLocaleString()}
            </div>
          )}
        </section>

        {/* Admin Responsibilities */}
        <section className="rounded-xl bg-[#302521] p-5 text-white sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-orange-200">
                <ShieldCheck size={16} />
                Admin Responsibilities
              </div>

              <h2 className="text-lg font-bold">
                Keep Your Platform Under Control
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-5 text-gray-300">
                Monitor registered users, manage vendors and customers,
                review published services and track platform transactions.
              </p>
            </div>

            <div className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 sm:flex">
              <ClipboardList
                size={25}
                className="text-[#ff8a78]"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
