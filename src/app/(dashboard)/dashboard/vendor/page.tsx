
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { authClient } from "@/lib/auth-client";

import {
  Store,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Crown,
  Pencil,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Wallet,
  UserRound,
  MapPin,
  RefreshCw,
  Loader2,
  Sparkles,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Service = {
  _id: string;
  serviceName?: string;
  title?: string;
  name?: string;
  category?: string;
  price?: number | string;
  status?: string;
  vendorId?: string;
  createdAt?: string;
};

type Booking = {
  _id: string;
  customerId: string;
  serviceId: string;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: string;
  createdAt?: string;
  service?: {
    serviceName?: string;
    price?: number | string;
    category?: string;
  };
  customer?: {
    name?: string;
    email?: string;
    image?: string;
  };
};

type Profile = {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  businessName?: string;
  phone?: string;
  city?: string;
  bio?: string;
  subscriptionPlan?: string;
};

export default function VendorDashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const [profileRes, servicesRes, bookingsRes] =
        await Promise.all([
          fetch(`${BASE_URL}/users/${user.id}`, {
            credentials: "include",
          }),

          fetch(
            `${BASE_URL}/vendor/services?vendorId=${encodeURIComponent(user.id)}`,
            {
              credentials: "include",
            }
          ),

          fetch(
            `${BASE_URL}/vendor/bookings?vendorId=${encodeURIComponent(user.id)}`,
            {
              credentials: "include",
            }
          ),
        ]);

      if (!profileRes.ok) {
        throw new Error("Failed to load vendor profile");
      }

      if (!servicesRes.ok) {
        throw new Error("Failed to load services");
      }

      if (!bookingsRes.ok) {
        throw new Error("Failed to load bookings");
      }

      const [profileData, servicesData, bookingsData] =
        await Promise.all([
          profileRes.json(),
          servicesRes.json(),
          bookingsRes.json(),
        ]);

      setProfile(profileData.data);

      setServices(
        Array.isArray(servicesData) ? servicesData : []
      );

      setBookings(
        Array.isArray(bookingsData.data)
          ? bookingsData.data
          : []
      );
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;

    if (!user?.id) {
      setLoading(false);
      return;
    }

    fetchDashboardData();
  }, [isPending, user?.id]);

  // Normalize service status
  const getStatus = (status?: string) =>
    String(status || "").trim().toUpperCase();

  // Service statistics
  const serviceStats = useMemo(() => {
    return {
      total: services.length,

      approved: services.filter(
        (service) => getStatus(service.status) === "APPROVED"
      ).length,

      pending: services.filter(
        (service) => getStatus(service.status) === "PENDING"
      ).length,

      rejected: services.filter(
        (service) => getStatus(service.status) === "REJECTED"
      ).length,
    };
  }, [services]);

  // Booking statistics
  const bookingStats = useMemo(() => {
    return {
      total: bookings.length,

      pending: bookings.filter(
        (booking) => getStatus(booking.status) === "PENDING"
      ).length,

      accepted: bookings.filter(
        (booking) => getStatus(booking.status) === "ACCEPTED"
      ).length,

      rejected: bookings.filter(
        (booking) => getStatus(booking.status) === "REJECTED"
      ).length,

      cancelled: bookings.filter(
        (booking) => getStatus(booking.status) === "CANCELLED"
      ).length,
    };
  }, [bookings]);

  const recentBookings = bookings.slice(0, 5);

  const plan =
    profile?.subscriptionPlan || "Free";

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const statusStyle = (status: string) => {
    switch (getStatus(status)) {
      case "ACCEPTED":
        return "bg-green-50 text-green-600";

      case "REJECTED":
        return "bg-red-50 text-red-600";

      case "CANCELLED":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-orange-50 text-orange-600";
    }
  };

  const statCards = [
    {
      title: "Total Services",
      value: serviceStats.total,
      description: "Your listed services",
      icon: BriefcaseBusiness,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Bookings",
      value: bookingStats.total,
      description: "Customer booking requests",
      icon: CalendarDays,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Pending Requests",
      value: bookingStats.pending,
      description: "Awaiting your response",
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Accepted Bookings",
      value: bookingStats.accepted,
      description: "Successfully accepted",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
  ];

  const managementCards = [
    {
      title: "Vendor Profile",
      description:
        "Manage your business information and contact details.",
      href: "/dashboard/profile",
      icon: Store,
      color: "bg-blue-50 text-blue-600",
      action: "Manage Profile",
    },
    {
      title: "Manage Services",
      description:
        "Add, update and manage your wedding service listings.",
      href: "/dashboard/vendor/services",
      icon: BriefcaseBusiness,
      color: "bg-purple-50 text-purple-600",
      action: "Manage Services",
    },
    {
      title: "Booking Requests",
      description:
        "Review customer requests and manage your bookings.",
      href: "/dashboard/vendor/bookings",
      icon: CalendarDays,
      color: "bg-orange-50 text-orange-600",
      action: "View Bookings",
    },
    {
      title: "Subscription Plans",
      description:
        "Manage your current subscription and explore plans.",
      href: "/dashboard/vendor/subscription",
      icon: Crown,
      color: "bg-green-50 text-green-600",
      action: "Manage Subscription",
    },
  ];

  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-9 animate-spin text-[#f45b4f]" />
          <p className="text-sm text-gray-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">
          Please sign in to access your dashboard.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#f45b4f]">
              <Store size={17} />
              Vendor Dashboard
            </div>

            <h1 className="text-2xl font-bold text-[#302521] sm:text-3xl">
              Welcome Back, {profile?.name || user.name || "Vendor"}!
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your wedding business, services and customer bookings.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <Link
              href="/dashboard/vendor/services"
              className="flex items-center gap-2 rounded-xl bg-[#f45b4f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#df493f]"
            >
              <Plus size={18} />
              Add New Service
            </Link>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <span>{error}</span>

            <button
              onClick={fetchDashboardData}
              className="shrink-0 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Profile & Subscription */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* Vendor Profile */}
          <div className="flex items-center gap-4 rounded-2xl border border-[#f1e8e3] bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#fff1ee] text-[#f45b4f]">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt="Vendor"
                  className="size-full object-cover"
                />
              ) : (
                <Store size={30} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-[#302521]">
                {profile?.name || "Your Business"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {profile?.email || user.email}
              </p>

              {profile?.city && (
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={13} />
                  {profile.city}
                </p>
              )}

              <Link
                href="/dashboard/profile"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#f45b4f] hover:underline"
              >
                Edit Profile
                <ArrowRight size={15} />
              </Link>
            </div>

            <Link
              href="/dashboard/vendor/profile"
              className="hidden rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 sm:block"
              aria-label="Edit profile"
            >
              <Pencil size={17} />
            </Link>
          </div>

          {/* Subscription */}
          <div className="rounded-2xl bg-[#302521] p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-200">
                <Crown size={19} />
                <span className="text-sm font-semibold">
                  Your Plan
                </span>
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                Current
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-bold capitalize">
              {plan}
            </h2>

            <p className="mt-1 text-sm text-gray-300">
              Your current vendor subscription
            </p>

            <Link
              href="/dashboard/vendor/subscription"
              className="mt-5 flex items-center justify-between rounded-xl bg-[#f45b4f] px-4 py-3 text-sm font-semibold transition hover:bg-[#df493f]"
            >
              Explore Plans
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>

        {/* Business Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#302521]">
              Business Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your business performance based on actual records.
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

                    <ArrowUpRight size={19} className="text-gray-300" />
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-[#302521]">
                    {stat.value}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Management Center */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#302521]">
              Manage Your Business
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Everything you need to manage your vendor account.
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
                        className="text-gray-400 group-hover:text-[#f45b4f]"
                      />
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#302521]">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {card.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-sm font-semibold text-[#f45b4f]">
                      {card.action}
                    </span>

                    <ArrowRight
                      size={17}
                      className="text-[#f45b4f] transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Service Overview */}
        <section className="rounded-2xl border border-[#f1e8e3] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#302521]">
                Service Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current status of your listed services.
              </p>
            </div>

            <Link
              href="/dashboard/vendor/services"
              className="text-sm font-semibold text-[#f45b4f] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Total Services",
                value: serviceStats.total,
                icon: BriefcaseBusiness,
                color: "text-blue-600",
              },
              {
                title: "Approved Services",
                value: serviceStats.approved,
                icon: CheckCircle2,
                color: "text-green-600",
              },
              {
                title: "Pending Approval",
                value: serviceStats.pending,
                icon: Clock,
                color: "text-orange-500",
              },
              {
                title: "Rejected Services",
                value: serviceStats.rejected,
                icon: XCircle,
                color: "text-red-500",
              },
            ].map((item) => {
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
                      {item.value}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Booking Overview */}
        <section className="rounded-2xl border border-[#f1e8e3] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#302521]">
              Booking Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Summary of your customer booking requests.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                title: "Total",
                value: bookingStats.total,
                color: "text-blue-600",
              },
              {
                title: "Pending",
                value: bookingStats.pending,
                color: "text-orange-500",
              },
              {
                title: "Accepted",
                value: bookingStats.accepted,
                color: "text-green-600",
              },
              {
                title: "Rejected",
                value: bookingStats.rejected,
                color: "text-red-500",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-[#fffaf7] p-4"
              >
                <p className="text-sm text-gray-500">
                  {item.title}
                </p>

                <h3 className={`mt-2 text-2xl font-bold ${item.color}`}>
                  {item.value}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Bookings */}
        <section className="overflow-hidden rounded-2xl border border-[#f1e8e3] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-[#302521]">
                Recent Booking Requests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest customer booking requests.
              </p>
            </div>

            <Link
              href="/dashboard/vendor/bookings"
              className="flex items-center gap-2 text-sm font-semibold text-[#f45b4f] hover:underline"
            >
              View All Bookings
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-y border-gray-100 bg-[#fffaf7] text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4 font-semibold">
                    Booking ID
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Customer
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Service
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Event Date
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-[#302521]">
                        #{booking._id.slice(-6).toUpperCase()}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-700">
                          {booking.customer?.name || "Unknown Customer"}
                        </p>

                        <p className="text-xs text-gray-400">
                          {booking.customer?.email || ""}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.service?.serviceName || "Service unavailable"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(booking.eventDate)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center"
                    >
                      <CalendarDays className="mx-auto mb-3 size-9 text-gray-300" />

                      <p className="font-semibold text-gray-600">
                        No bookings yet
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        Customer booking requests will appear here.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-6 py-4">
            <Link
              href="/dashboard/vendor/bookings"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-[#f45b4f] hover:underline"
            >
              Manage All Booking Requests
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Bottom Banner */}
        <section className="rounded-2xl bg-[#302521] p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-orange-200">
                <Sparkles size={18} />
                Grow Your Wedding Business
              </div>

              <h2 className="text-xl font-bold">
                Ready to Reach More Customers?
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-300">
                Explore subscription plans to unlock more opportunities
                and grow your business on phWedPlan.
              </p>
            </div>

            <Link
              href="/dashboard/vendor/subscription"
              className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[#f45b4f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#df493f]"
            >
              Explore Plans
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
