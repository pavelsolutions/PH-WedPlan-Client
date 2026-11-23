
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  ArrowRight,
  Eye,
  MapPin,
  RefreshCw,
  Sparkles,
  XCircle,
  PackageCheck,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Service = {
  _id?: string;
  id?: string;
  serviceName?: string;
  title?: string;
  category?: string;
  price?: number;
  status?: string;
  location?: string;
  createdAt?: string;
};

type Booking = {
  _id?: string;
  id?: string;
  customerName?: string;
  customer?: {
    name?: string;
    email?: string;
  };
  serviceName?: string;
  service?: {
    serviceName?: string;
    title?: string;
  };
  eventDate?: string;
  eventLocation?: string;
  status?: string;
  createdAt?: string;
};

function getArray<T>(result: any, keys: string[] = []): T[] {
  if (Array.isArray(result)) return result;

  for (const key of keys) {
    if (Array.isArray(result?.[key])) return result[key];
    if (Array.isArray(result?.data?.[key])) return result.data[key];
  }

  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.result)) return result.result;

  return [];
}

function formatDate(date?: string) {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not specified";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusClass(status?: string) {
  switch (status?.toLowerCase()) {
    case "accepted":
    case "approved":
    case "active":
      return "bg-green-50 text-green-700";

    case "rejected":
    case "cancelled":
    case "blocked":
      return "bg-red-50 text-red-600";

    case "pending":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function VendorDashboardPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const vendorId = session?.user?.id;

  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    if (!vendorId) return;

    try {
      setLoading(true);
      setError("");

      const [servicesResponse, bookingsResponse] =
        await Promise.all([
          fetch(
            `${API_URL}/vendor/services?vendorId=${encodeURIComponent(vendorId)}`,
            { credentials: "include", cache: "no-store" }
          ),
          fetch(
            `${API_URL}/vendor/bookings/${encodeURIComponent(vendorId)}`,
            { credentials: "include", cache: "no-store" }
          ),
        ]);

      if (!servicesResponse.ok || !bookingsResponse.ok) {
        throw new Error("Failed to load dashboard information.");
      }

      const [servicesData, bookingsData] = await Promise.all([
        servicesResponse.json(),
        bookingsResponse.json(),
      ]);

      setServices(
        getArray<Service>(servicesData, ["services"])
      );

      setBookings(
        getArray<Booking>(bookingsData, ["bookings"])
      );
    } catch (err) {
      console.error("Vendor dashboard error:", err);
      setError("Unable to load dashboard data. Please try again.");
      toast.error("Failed to load dashboard information.");
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    if (sessionLoading) return;

    if (vendorId) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [vendorId, sessionLoading, fetchDashboardData]);

  const stats = useMemo(() => {
    const activeServices = services.filter(
      (service) =>
        ["approved", "active"].includes(
          service.status?.toLowerCase() || ""
        )
    ).length;

    const pendingBookings = bookings.filter(
      (booking) =>
        booking.status?.toLowerCase() === "pending"
    ).length;

    const acceptedBookings = bookings.filter(
      (booking) =>
        booking.status?.toLowerCase() === "accepted"
    ).length;

    return [
      {
        title: "Total Services",
        value: services.length,
        description: "Services you've created",
        icon: BriefcaseBusiness,
        iconBg: "bg-[#fce9eb]",
        iconColor: "text-[#92283b]",
      },
      {
        title: "Active Services",
        value: activeServices,
        description: "Approved services",
        icon: PackageCheck,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
      },
      {
        title: "Pending Bookings",
        value: pendingBookings,
        description: "Awaiting your response",
        icon: Clock3,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        title: "Accepted Bookings",
        value: acceptedBookings,
        description: "Confirmed requests",
        icon: CheckCircle2,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
    ];
  }, [services, bookings]);

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [bookings]);

  const recentServices = useMemo(() => {
    return [...services]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 4);
  }, [services]);

  if (sessionLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-xl bg-white" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl bg-white"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-xl bg-white" />
      </div>
    );
  }

  if (!vendorId) {
    return (
      <div className="rounded-xl border border-[#eadfd8] bg-white p-8 text-center">
        <XCircle className="mx-auto mb-3 text-red-500" size={36} />
        <h2 className="text-lg font-semibold text-[#302521]">
          Vendor session not found
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Please sign in with your vendor account to continue.
        </p>
        <Link
          href="/signin"
          className="mt-5 inline-flex rounded-lg bg-[#92283b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#762031]"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* Welcome Header */}
      <section className="relative overflow-hidden rounded-xl bg-[#92283b] p-6 text-white sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-white/80">
              <Sparkles size={16} />
              Vendor Workspace
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome back, {session?.user?.name || "Vendor"}!
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
              Manage your wedding services, track customer booking
              requests, and grow your business with WedPlan.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/services/add"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#92283b] transition hover:bg-[#fff1f2]"
          >
            <Plus size={18} />
            Add New Service
          </Link>
        </div>

        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
        <div className="absolute -bottom-28 right-40 h-64 w-64 rounded-full border-[35px] border-white/10" />
      </section>

      {/* Error Message */}
      {error && (
        <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-700"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#302521]">
              Dashboard Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Here's what's happening with your business.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="rounded-lg border border-[#eadfd8] bg-white p-2.5 text-gray-500 transition hover:bg-[#fcfaf8] hover:text-[#92283b]"
            title="Refresh dashboard"
          >
            <RefreshCw size={17} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-[#eadfd8] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.iconBg}`}
                  >
                    <Icon size={21} className={stat.iconColor} />
                  </div>

                  <span className="text-3xl font-bold text-[#302521]">
                    {stat.value}
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#302521]">
                  {stat.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="rounded-xl border border-[#eadfd8] bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[#302521]">
          Quick Actions
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your vendor account quickly.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/vendor/services/add"
            className="flex items-center gap-3 rounded-lg border border-[#eadfd8] p-4 transition hover:border-[#92283b] hover:bg-[#fcfaf8]"
          >
            <div className="rounded-lg bg-[#fce9eb] p-3 text-[#92283b]">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#302521]">
                Add Service
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Publish a new service
              </p>
            </div>
            <ArrowRight className="ml-auto text-gray-400" size={17} />
          </Link>

          <Link
            href="/dashboard/vendor/bookings"
            className="flex items-center gap-3 rounded-lg border border-[#eadfd8] p-4 transition hover:border-[#92283b] hover:bg-[#fcfaf8]"
          >
            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
              <CalendarDays size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#302521]">
                Booking Requests
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Manage customer bookings
              </p>
            </div>
            <ArrowRight className="ml-auto text-gray-400" size={17} />
          </Link>

          <Link
            href="/dashboard/vendor/subscription"
            className="flex items-center gap-3 rounded-lg border border-[#eadfd8] p-4 transition hover:border-[#92283b] hover:bg-[#fcfaf8] sm:col-span-2 lg:col-span-1"
          >
            <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#302521]">
                Upgrade Plan
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Explore Premium benefits
              </p>
            </div>
            <ArrowRight className="ml-auto text-gray-400" size={17} />
          </Link>
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="overflow-hidden rounded-xl border border-[#eadfd8] bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-[#eadfd8] p-5">
          <div>
            <h2 className="text-lg font-bold text-[#302521]">
              Recent Booking Requests
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Latest requests from your customers.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/bookings"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#92283b] hover:underline"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <CalendarDays
              className="mx-auto mb-3 text-gray-300"
              size={36}
            />
            <h3 className="font-semibold text-[#302521]">
              No Booking Requests Yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Customer booking requests will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-[#fcfaf8] text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Service</th>
                  <th className="px-5 py-4 font-semibold">Event Date</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f1e9e4]">
                {recentBookings.map((booking, index) => (
                  <tr
                    key={booking._id || booking.id || index}
                    className="transition hover:bg-[#fcfaf8]"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#302521]">
                        {booking.customerName ||
                          booking.customer?.name ||
                          "Customer"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {booking.customer?.email || "Booking request"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {booking.serviceName ||
                        booking.service?.serviceName ||
                        booking.service?.title ||
                        "Wedding Service"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(booking.eventDate)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent Services */}
      <section className="rounded-xl border border-[#eadfd8] bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#302521]">
              My Recent Services
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Recently added services in your account.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/services"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#92283b] hover:underline"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {recentServices.length === 0 ? (
          <div className="rounded-lg bg-[#fcfaf8] px-5 py-10 text-center">
            <BriefcaseBusiness
              className="mx-auto mb-3 text-gray-300"
              size={36}
            />
            <h3 className="font-semibold text-[#302521]">
              No Services Added
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start growing your business by adding your first service.
            </p>
            <Link
              href="/dashboard/vendor/services/add"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#92283b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#762031]"
            >
              <Plus size={16} />
              Add Your First Service
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {recentServices.map((service, index) => (
              <div
                key={service._id || service.id || index}
                className="rounded-lg border border-[#eadfd8] p-4 transition hover:border-[#92283b]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[#302521]">
                      {service.serviceName || service.title || "Untitled Service"}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {service.category || "Wedding Service"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClass(
                      service.status
                    )}`}
                  >
                    {service.status || "Unknown"}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[#92283b]">
                    ৳{Number(service.price || 0).toLocaleString("en-BD")}
                  </span>

                  <span className="inline-flex min-w-0 items-center gap-1 text-xs text-gray-500">
                    <MapPin size={13} />
                    <span className="truncate">
                      {service.location || "Location not set"}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer note */}
      <div className="flex items-center justify-center gap-2 pb-2 text-xs text-gray-400">
        <Eye size={14} />
        Your vendor dashboard is updated with your latest account data.
      </div>
    </div>
  );
}
