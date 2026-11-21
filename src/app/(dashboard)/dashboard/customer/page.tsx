
import Link from "next/link";
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
  Star,
  Camera,
  Flower2,
  Utensils,
  Music,
  Eye,
  Plus,
  Sparkles,
  ClipboardList,
} from "lucide-react";

const stats = [
  {
    title: "Available Services",
    value: "120+",
    description: "Explore wedding services",
    icon: Search,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "My Bookings",
    value: "08",
    description: "Total booking requests",
    icon: CalendarDays,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Pending Requests",
    value: "03",
    description: "Waiting for vendor response",
    icon: Clock,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Confirmed Bookings",
    value: "05",
    description: "Successfully accepted",
    icon: CheckCircle2,
    color: "bg-green-50 text-green-600",
  },
];

const categories = [
  { name: "Photography", icon: Camera },
  { name: "Decoration", icon: Flower2 },
  { name: "Catering", icon: Utensils },
  { name: "Music & DJ", icon: Music },
];

const services = [
  {
    id: 1,
    name: "Wedding Photography",
    vendor: "Dream Moments Studio",
    category: "Photography",
    price: "$500",
    rating: "4.9",
    location: "Dhaka",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
  },
  {
    id: 2,
    name: "Wedding Decoration",
    vendor: "Elegant Wedding Decor",
    category: "Decoration",
    price: "$800",
    rating: "4.8",
    location: "Dhaka",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
  },
  {
    id: 3,
    name: "Wedding Catering",
    vendor: "Royal Catering",
    category: "Catering",
    price: "$1,200",
    rating: "4.7",
    location: "Chattogram",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
  },
];

const bookings = [
  {
    id: "#BK-1024",
    service: "Wedding Photography",
    vendor: "Dream Moments Studio",
    date: "Dec 15, 2026",
    status: "Pending",
  },
  {
    id: "#BK-1023",
    service: "Wedding Decoration",
    vendor: "Elegant Wedding Decor",
    date: "Dec 18, 2026",
    status: "Accepted",
  },
  {
    id: "#BK-1022",
    service: "Wedding Catering",
    vendor: "Royal Catering",
    date: "Dec 20, 2026",
    status: "Accepted",
  },
];

export default function CustomerDashboardPage() {
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
              Welcome Back!
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
              Your wedding planning activity at a glance.
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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="group overflow-hidden rounded-2xl border border-[#f1e8e3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#f45b4f]">
                    {service.category}
                  </span>

                  <button
                    type="button"
                    aria-label="Add to favorites"
                    className="absolute right-3 top-3 rounded-full bg-white p-2 text-gray-500 shadow-sm transition hover:text-[#f45b4f]"
                  >
                    <Heart size={17} />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-[#302521]">
                      {service.name}
                    </h3>

                    <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-orange-500">
                      <Star size={15} fill="currentColor" />
                      {service.rating}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {service.vendor}
                  </p>

                  <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={14} />
                    {service.location}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-400">Starting from</p>
                      <p className="mt-1 text-lg font-bold text-[#f45b4f]">
                        {service.price}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service.id}`}
                      className="flex items-center gap-2 rounded-lg bg-[#fff1ee] px-3 py-2 text-sm font-semibold text-[#f45b4f] transition hover:bg-[#f45b4f] hover:text-white"
                    >
                      <Eye size={16} />
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-[#302521]">
                      {booking.id}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.service}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.vendor}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.date}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          booking.status === "Accepted"
                            ? "bg-green-50 text-green-600"
                            : booking.status === "Rejected"
                              ? "bg-red-50 text-red-600"
                              : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {booking.status}
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

          <div className="border-t border-gray-100 px-6 py-4">
            <Link
              href="/dashboard/customer/bookings"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-[#f45b4f] hover:underline"
            >
              Manage All Bookings
              <ArrowRight size={16} />
            </Link>
          </div>
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
