
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Search,
  Heart,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Eye,
  Sparkles,
  Camera,
  Flower2,
  Utensils,
  Music,
  Star,
  Shirt,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Booking = {
  _id: string;
  serviceId: string;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: string;
  createdAt?: string;
  service?: {
    serviceName?: string;
    category?: string;
    price?: number | string;
    image?: string;
    images?: string[];
  };
  vendor?: {
    name?: string;
    email?: string;
  };
};

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  price: number | string;
  location?: string;
  image?: string;
  images?: string[];
  vendor?: {
    name?: string;
  };
  vendorName?: string;
};

const categories = [
  { name: "Photography & Videography", icon: Camera },
  { name: "Wedding Venues", icon: Flower2 },
  { name: "Decoration & Florist", icon: Flower2 },
  { name: "Catering Services", icon: Utensils },
  { name: "Makeup & Styling", icon: Sparkles },
  { name: "Wedding Fashion", icon: Shirt },
];

const normalizeStatus = (status?: string) =>
  (status || "").trim().toLowerCase();

const formatDate = (date?: string) => {
  if (!date) return "Date not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getServiceImage = (service?: Service | Booking["service"]) => {
  if (!service) return "";

  if (service.images?.length) {
    const firstImage = service.images[0];

    if (typeof firstImage === "string") return firstImage;

    if (typeof firstImage === "object") {
      return (
        (firstImage as { url?: string; secure_url?: string }).url ||
        (firstImage as { secure_url?: string }).secure_url ||
        ""
      );
    }
  }

  return service.image || "";
};

const getStatusStyle = (status: string) => {
  const normalized = normalizeStatus(status);

  if (["confirmed", "accepted"].includes(normalized)) {
    return "bg-green-50 text-green-600";
  }

  if (normalized === "rejected") {
    return "bg-red-50 text-red-600";
  }

  if (normalized === "cancelled" || normalized === "canceled") {
    return "bg-gray-100 text-gray-600";
  }

  return "bg-orange-50 text-orange-600";
};

const getStatusLabel = (status: string) => {
  const normalized = normalizeStatus(status);

  if (normalized === "confirmed" || normalized === "accepted") {
    return "Accepted";
  }

  if (normalized === "rejected") return "Rejected";

  if (normalized === "pending") return "Pending";

  return status || "Pending";
};

export default function CustomerDashboardPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const customerId = session?.user?.id;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionLoading) return;

    if (!customerId) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [bookingResponse, serviceResponse] = await Promise.all([
          fetch(`${BASE_URL}/customer/bookings/${customerId}`, {
            credentials: "include",
            cache: "no-store",
          }),
          fetch(`${BASE_URL}/services`, {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        const bookingData = await bookingResponse.json();
        const serviceData = await serviceResponse.json();

        if (!bookingResponse.ok) {
          throw new Error(
            bookingData.message || "Failed to load your bookings"
          );
        }

        if (!serviceResponse.ok) {
          throw new Error(
            serviceData.message || "Failed to load services"
          );
        }

        // Supports both { data: [...] } and { data: { bookings: [...] } }
        const bookingList = Array.isArray(bookingData)
          ? bookingData
          : Array.isArray(bookingData.data)
            ? bookingData.data
            : Array.isArray(bookingData.data?.bookings)
              ? bookingData.data.bookings
              : Array.isArray(bookingData.bookings)
                ? bookingData.bookings
                : [];

        console.log("Customer ID:", customerId);
        console.log("Booking API Response:", bookingData);
        console.log("Customer Bookings:", bookingList);

        setBookings(bookingList);

        const serviceList = Array.isArray(serviceData)
          ? serviceData
          : serviceData.data?.services ||
          serviceData.data ||
          serviceData.services ||
          [];

        setBookings(bookingList);
        setServices(serviceList);
      } catch (err) {
        console.error("Customer dashboard error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [customerId, sessionLoading]);

  const stats = useMemo(() => {
    const total = bookings.length;

    const pending = bookings.filter(
      (booking) => normalizeStatus(booking.status) === "pending"
    ).length;

    const accepted = bookings.filter((booking) =>
      ["confirmed", "accepted"].includes(
        normalizeStatus(booking.status)
      )
    ).length;

    const rejected = bookings.filter(
      (booking) => normalizeStatus(booking.status) === "rejected"
    ).length;

    return [
      {
        title: "Total Booking Requests",
        value: total,
        description: "All your booking requests",
        icon: CalendarDays,
        color: "bg-blue-50 text-blue-600",
      },
      {
        title: "Pending Bookings",
        value: pending,
        description: "Waiting for vendor response",
        icon: Clock,
        color: "bg-orange-50 text-orange-600",
      },
      {
        title: "Accepted Bookings",
        value: accepted,
        description: "Successfully accepted",
        icon: CheckCircle2,
        color: "bg-green-50 text-green-600",
      },
      {
        title: "Rejected Bookings",
        value: rejected,
        description: "Requests declined by vendors",
        icon: XCircle,
        color: "bg-red-50 text-red-600",
      },
    ];
  }, [bookings]);

  const recentBookings = useMemo(
    () =>
      [...bookings]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 5),
    [bookings]
  );

  const featuredServices = services.slice(0, 3);

  if (sessionLoading || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fffaf7]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#f45b4f]/20 border-t-[#f45b4f]" />
          <p className="mt-4 text-sm text-gray-500">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!customerId) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fffaf7] p-5">
        <div className="rounded-2xl border border-[#f1e8e3] bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-[#302521]">
            Please login first
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Login to view your customer dashboard.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-xl bg-[#f45b4f] px-5 py-3 text-sm font-semibold text-white"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#f45b4f]">
              <Heart size={17} />
              Customer Dashboard
            </div>

            <h1 className="text-2xl font-bold text-[#302521] sm:text-3xl">
              Welcome Back, {session?.user?.name || "Customer"}!
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Plan your dream wedding and manage all your bookings in one place.
            </p>
          </div>

          <Link
            href="/services"
            className="flex w-fit items-center gap-2 rounded-xl bg-[#f45b4f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#df493f]"
          >
            <Search size={18} />
            Explore Services
          </Link>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Wedding Planning Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-[#302521] p-6 text-white sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-sm text-orange-200">
              <Sparkles size={18} />
              Your Dream Wedding Starts Here
            </div>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Make Your Special Day Unforgettable!
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-300">
              Discover talented wedding vendors, explore services and
              book everything you need for your perfect celebration.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#f45b4f] px-5 py-3 text-sm font-semibold transition hover:bg-[#df493f]"
            >
              Browse Wedding Services
              <ArrowRight size={17} />
            </Link>
          </div>

          <Heart
            size={180}
            className="absolute -right-8 -bottom-12 hidden text-white/5 sm:block"
          />
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#302521]">
              My Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your real booking activity at a glance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
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
                    {stat.value.toString().padStart(2, "0")}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Browse Categories */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#302521]">
                Browse Categories
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Find services for every wedding need.
              </p>
            </div>

            <Link
              href="/services"
              className="text-sm font-semibold text-[#f45b4f] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="group flex items-center gap-3 rounded-2xl border border-[#f1e8e3] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#f45b4f]/40 hover:shadow-md"
                >
                  <div className="rounded-xl bg-[#fff1ee] p-3 text-[#f45b4f]">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#302521]">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      Explore services
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Services */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#302521]">
                Explore Wedding Services
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Discover services for your special day.
              </p>
            </div>

            <Link
              href="/services"
              className="flex items-center gap-2 text-sm font-semibold text-[#f45b4f] hover:underline"
            >
              Browse All Services
              <ArrowRight size={16} />
            </Link>
          </div>

          {featuredServices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#eadbd4] bg-white p-10 text-center">
              <Search className="mx-auto text-gray-300" size={30} />
              <p className="mt-3 text-sm text-gray-500">
                No services available right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredServices.map((service) => {
                const image = getServiceImage(service);

                return (
                  <div
                    key={service._id}
                    className="group overflow-hidden rounded-2xl border border-[#f1e8e3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative h-48 overflow-hidden bg-[#fff1ee]">
                      {image ? (
                        <img
                          src={image}
                          alt={service.serviceName}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#f45b4f]">
                          <Camera size={40} />
                        </div>
                      )}

                      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#f45b4f]">
                        {service.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-[#302521]">
                        {service.serviceName}
                      </h3>

                      <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={14} />
                        {service.location || "Location not specified"}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-xs text-gray-400">
                            Starting from
                          </p>
                          <p className="mt-1 text-lg font-bold text-[#f45b4f]">
                            ৳{Number(service.price || 0).toLocaleString("en-BD")}
                          </p>
                        </div>

                        <Link
                          href={`/services/${service._id}`}
                          className="flex items-center gap-2 rounded-lg bg-[#fff1ee] px-3 py-2 text-sm font-semibold text-[#f45b4f] transition hover:bg-[#f45b4f] hover:text-white"
                        >
                          <Eye size={16} />
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* My Bookings */}
        <section className="overflow-hidden rounded-2xl border border-[#f1e8e3] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-[#302521]">
                My Recent Bookings
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Track your booking requests and their current status.
              </p>
            </div>

            <Link
              href="/dashboard/customer/bookings"
              className="flex items-center gap-2 text-sm font-semibold text-[#f45b4f] hover:underline"
            >
              View All Bookings
              <ArrowRight size={16} />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="border-y border-gray-100 px-6 py-12 text-center">
              <CalendarDays className="mx-auto text-gray-300" size={36} />
              <h3 className="mt-3 font-semibold text-[#302521]">
                No bookings yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Explore wedding services and make your first booking.
              </p>
              <Link
                href="/services"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#f45b4f] px-5 py-3 text-sm font-semibold text-white"
              >
                Explore Services
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-y border-gray-100 bg-[#fffaf7] text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-6 py-4 font-semibold">Booking ID</th>
                    <th className="px-6 py-4 font-semibold">Service</th>
                    <th className="px-6 py-4 font-semibold">Vendor</th>
                    <th className="px-6 py-4 font-semibold">Event Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-[#302521]">
                        #{booking._id.slice(-6).toUpperCase()}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.service?.serviceName || "Wedding Service"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.vendor?.name || "Vendor"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(booking.eventDate)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(booking.status)}`}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          href="/dashboard/customer/bookings"
                          className="text-sm font-semibold text-[#f45b4f] hover:underline"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {recentBookings.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-4">
              <Link
                href="/dashboard/customer/bookings"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-[#f45b4f] hover:underline"
              >
                Manage All Bookings
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        <section className="rounded-2xl bg-[#302521] p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-orange-200">
                <Sparkles size={18} />
                Wedding Planning
              </div>

              <h2 className="text-xl font-bold">
                Let's Make Your Dream Wedding Come True!
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-300">
                Find the perfect vendors and services to make your
                wedding day truly memorable.
              </p>
            </div>

            <Link
              href="/services"
              className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[#f45b4f] px-5 py-3 text-sm font-semibold transition hover:bg-[#df493f]"
            >
              Find Services
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
