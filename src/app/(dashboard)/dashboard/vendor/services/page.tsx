
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  SlidersHorizontal,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Ban,
  Star,
  MapPin,
  CalendarDays,
  TrendingUp,
  Sparkles,
} from "lucide-react";

type Service = {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  priceType: string;
  status: "Active" | "Pending" | "Inactive";
  bookings: number;
  rating: number;
  reviews: number;
  location: string;
  icon: string;
  color: string;
  createdAt: string;
};

const initialServices: Service[] = [
  {
    id: "SRV-001",
    title: "Home Cleaning Service",
    category: "Home Services",
    description:
      "Professional home cleaning with experienced cleaners. We provide deep cleaning, regular cleaning and complete home care.",
    price: 1500,
    priceType: "per session",
    status: "Active",
    bookings: 48,
    rating: 4.9,
    reviews: 32,
    location: "Dhaka",
    icon: "🏠",
    color: "from-blue-500 to-cyan-400",
    createdAt: "Nov 12, 2026",
  },
  {
    id: "SRV-002",
    title: "AC Repair & Servicing",
    category: "Repair & Maintenance",
    description:
      "Expert AC servicing, repair, installation and maintenance. Fast response with reliable technicians.",
    price: 1200,
    priceType: "starting from",
    status: "Active",
    bookings: 36,
    rating: 4.8,
    reviews: 26,
    location: "Dhaka",
    icon: "❄️",
    color: "from-indigo-500 to-violet-400",
    createdAt: "Nov 10, 2026",
  },
  {
    id: "SRV-003",
    title: "Website Design & Development",
    category: "Digital Services",
    description:
      "Modern responsive website design and development for businesses, brands and online stores.",
    price: 12000,
    priceType: "starting from",
    status: "Pending",
    bookings: 12,
    rating: 4.7,
    reviews: 10,
    location: "Remote",
    icon: "💻",
    color: "from-violet-500 to-fuchsia-400",
    createdAt: "Nov 09, 2026",
  },
  {
    id: "SRV-004",
    title: "Photography & Videography",
    category: "Creative Services",
    description:
      "Professional event photography, product photography and cinematic video production.",
    price: 5000,
    priceType: "per event",
    status: "Active",
    bookings: 21,
    rating: 5.0,
    reviews: 18,
    location: "Dhaka",
    icon: "📸",
    color: "from-rose-500 to-orange-400",
    createdAt: "Nov 08, 2026",
  },
  {
    id: "SRV-005",
    title: "Electrical Installation",
    category: "Repair & Maintenance",
    description:
      "Safe electrical installation, troubleshooting, wiring and residential maintenance services.",
    price: 800,
    priceType: "starting from",
    status: "Inactive",
    bookings: 17,
    rating: 4.6,
    reviews: 14,
    location: "Dhaka",
    icon: "⚡",
    color: "from-amber-500 to-yellow-400",
    createdAt: "Nov 05, 2026",
  },
  {
    id: "SRV-006",
    title: "Personal Fitness Training",
    category: "Health & Fitness",
    description:
      "Personalized fitness coaching, workout programs and one-to-one training sessions.",
    price: 2000,
    priceType: "per session",
    status: "Active",
    bookings: 29,
    rating: 4.9,
    reviews: 22,
    location: "Dhaka",
    icon: "💪",
    color: "from-emerald-500 to-teal-400",
    createdAt: "Nov 03, 2026",
  },
];

const statusStyles: Record<Service["status"], string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Inactive: "bg-gray-100 text-gray-600 border-gray-200",
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconStyle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconStyle: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </h3>
        </div>
        <div className={`rounded-xl p-3 ${iconStyle}`}>
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}

export default function VendorServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All categories");

  const categories = [
    "All categories",
    ...Array.from(new Set(services.map((s) => s.category))),
  ];

  const stats = useMemo(
    () => ({
      total: services.length,
      active: services.filter((s) => s.status === "Active").length,
      pending: services.filter((s) => s.status === "Pending").length,
      inactive: services.filter((s) => s.status === "Inactive").length,
    }),
    [services]
  );

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.category.toLowerCase().includes(search.toLowerCase()) ||
      service.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || service.status === statusFilter;

    const matchesCategory =
      categoryFilter === "All categories" ||
      service.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  function handleDelete(id: string) {
    const confirmed = window.confirm("Are you sure you want to delete this service?");
    if (confirmed) {
      setServices((current) => current.filter((service) => service.id !== id));
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Vendor Dashboard</span>
              <span>/</span>
              <span className="text-violet-600">Services</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
              My Services
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your services, pricing, bookings and availability.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/services/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700"
          >
            <Plus size={17} />
            Add New Service
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Services"
            value={stats.total}
            subtitle="All services listed in your store"
            icon={BriefcaseBusiness}
            iconStyle="bg-violet-50 text-violet-600"
          />
          <StatCard
            title="Active Services"
            value={stats.active}
            subtitle="Currently visible to customers"
            icon={CheckCircle2}
            iconStyle="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title="Pending Review"
            value={stats.pending}
            subtitle="Waiting for admin approval"
            icon={Clock3}
            iconStyle="bg-amber-50 text-amber-600"
          />
          <StatCard
            title="Inactive Services"
            value={stats.inactive}
            subtitle="Paused or unavailable"
            icon={Ban}
            iconStyle="bg-gray-100 text-gray-500"
          />
        </div>

        {/* Highlight banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-5 text-white sm:p-6">
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white/15 p-2.5">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Grow your service business</h3>
                <p className="mt-1 max-w-lg text-sm text-violet-100">
                  Keep your services updated, respond quickly and improve your
                  customer ratings to get more bookings.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/vendor/services/new"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              Create a service <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="absolute -right-12 -top-20 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-indigo-300/20 blur-2xl" />
        </div>

        {/* Toolbar */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5">
                <SlidersHorizontal size={15} className="text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-600 outline-none sm:w-auto"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex rounded-xl bg-gray-100 p-1">
                {["All", "Active", "Pending", "Inactive"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                      statusFilter === status
                        ? "bg-white text-violet-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Service Listings</h2>
            <p className="mt-1 text-xs text-gray-400">
              Showing {filteredServices.length} of {services.length} services
            </p>
          </div>
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setCategoryFilter("All categories");
            }}
            className="text-xs font-medium text-violet-600 hover:text-violet-700"
          >
            Reset filters
          </button>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/60"
              >
                {/* Card visual */}
                <div
                  className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${service.color}`}
                >
                  <span className="text-6xl drop-shadow-sm transition duration-300 group-hover:scale-110">
                    {service.icon}
                  </span>

                  <span
                    className={`absolute left-4 top-4 rounded-full border px-2.5 py-1 text-xs font-medium ${
                      statusStyles[service.status]
                    }`}
                  >
                    {service.status}
                  </span>

                  <button
                    className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-gray-600 shadow-sm transition hover:bg-white"
                    aria-label="Service options"
                  >
                    <MoreHorizontal size={17} />
                  </button>

                  <span className="absolute bottom-3 right-3 rounded-lg bg-black/15 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                    {service.id}
                  </span>
                </div>

                {/* Card content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="inline-block rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-600">
                        {service.category}
                      </span>
                      <h3 className="mt-2 line-clamp-1 text-base font-semibold text-gray-900">
                        {service.title}
                      </h3>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ৳{service.price.toLocaleString("en-BD")}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {service.priceType}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 min-h-[40px] text-xs leading-5 text-gray-500">
                    {service.description}
                  </p>

                  {/* Meta */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <MapPin size={13} />
                      {service.location}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      {service.rating}
                      <span className="font-normal text-gray-400">
                        ({service.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <CalendarDays size={14} />
                      <span>{service.bookings} bookings</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <TrendingUp size={14} />
                      <span>Performance</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex gap-2">
                    <Link
                      href={`/dashboard/vendor/services/${service.id}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                      <Eye size={15} />
                      View
                    </Link>
                    <Link
                      href={`/dashboard/vendor/services/${service.id}/edit`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-violet-100 bg-violet-50 py-2.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-rose-500 transition hover:bg-rose-100"
                      aria-label={`Delete ${service.title}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <BriefcaseBusiness size={26} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No services found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try changing your filters or create a new service.
            </p>
            <Link
              href="/dashboard/vendor/services/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              <Plus size={16} />
              Add New Service
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-gray-100 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">
            Showing {filteredServices.length} service listings
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-400 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white">
              1
            </button>
            <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-500 hover:bg-gray-50">
              2
            </button>
            <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-500 hover:bg-gray-50">
              3
            </button>
            <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-500 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
