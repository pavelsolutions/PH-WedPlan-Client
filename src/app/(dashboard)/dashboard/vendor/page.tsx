
import Link from "next/link";
import {
  Store,
  BriefcaseBusiness,
  CalendarDays,
  Wallet,
  ArrowUpRight,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Crown,
  UserRound,
  Eye,
  Pencil,
  Sparkles,
} from "lucide-react";

const stats = [
  {
    title: "Total Services",
    value: "12",
    description: "Your listed services",
    icon: BriefcaseBusiness,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Total Bookings",
    value: "48",
    description: "All booking requests",
    icon: CalendarDays,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Pending Requests",
    value: "08",
    description: "Awaiting your response",
    icon: Clock,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Total Earnings",
    value: "$4,850",
    description: "Your total earnings",
    icon: Wallet,
    color: "bg-green-50 text-green-600",
  },
];

const managementCards = [
  {
    title: "Vendor Profile",
    description:
      "Create and manage your business profile to showcase your wedding services.",
    href: "/dashboard/vendor/profile",
    icon: Store,
    color: "bg-blue-50 text-blue-600",
    action: "Manage Profile",
  },
  {
    title: "Manage Services",
    description:
      "Add new wedding services, update existing listings or remove services.",
    href: "/dashboard/vendor/services",
    icon: BriefcaseBusiness,
    color: "bg-purple-50 text-purple-600",
    action: "Manage Services",
  },
  {
    title: "Booking Requests",
    description:
      "View customer booking requests and accept or reject reservations.",
    href: "/dashboard/vendor/bookings",
    icon: CalendarDays,
    color: "bg-orange-50 text-orange-600",
    action: "View Bookings",
  },
  {
    title: "Subscription Plans",
    description:
      "View your current subscription and explore available plans.",
    href: "/dashboard/vendor/subscription",
    icon: Crown,
    color: "bg-green-50 text-green-600",
    action: "Manage Subscription",
  },
];

const bookings = [
  {
    id: "#BK-1024",
    customer: "Sarah Ahmed",
    service: "Wedding Photography",
    date: "Dec 15, 2026",
    status: "Pending",
  },
  {
    id: "#BK-1023",
    customer: "Nusrat Jahan",
    service: "Wedding Decoration",
    date: "Dec 18, 2026",
    status: "Accepted",
  },
  {
    id: "#BK-1022",
    customer: "Rahim Hasan",
    service: "Wedding Catering",
    date: "Dec 20, 2026",
    status: "Rejected",
  },
];

const serviceOverview = [
  {
    title: "Active Services",
    value: "09",
    color: "text-green-600",
    icon: CheckCircle2,
  },
  {
    title: "Pending Approval",
    value: "02",
    color: "text-orange-500",
    icon: Clock,
  },
  {
    title: "Inactive Services",
    value: "01",
    color: "text-gray-500",
    icon: XCircle,
  },
];

export default function VendorDashboardPage() {
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
              Welcome Back, Vendor!
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your wedding business, services and customer bookings.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/services"
            className="flex w-fit items-center gap-2 rounded-xl bg-[#f45b4f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#df493f]"
          >
            <Plus size={18} />
            Add New Service
          </Link>
        </section>

        {/* Vendor Profile & Subscription */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* Profile Card */}
          <div className="flex items-center gap-4 rounded-2xl border border-[#f1e8e3] bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#fff1ee] text-[#f45b4f]">
              <Store size={30} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-[#302521]">
                  Your Business Name
                </h2>
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                  Verified
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Wedding Service Provider
              </p>

              <Link
                href="/dashboard/vendor/profile"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#f45b4f] hover:underline"
              >
                Edit Profile <ArrowRight size={15} />
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

          {/* Subscription Card */}
          <div className="rounded-2xl bg-[#302521] p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-200">
                <Crown size={19} />
                <span className="text-sm font-semibold">Your Plan</span>
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                Active
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-bold">Free Plan</h2>

            <p className="mt-1 text-sm text-gray-300">
              Basic vendor subscription
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

        {/* Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#302521]">
              Business Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your business performance at a glance.
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {serviceOverview.map((item) => {
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

        {/* Recent Booking Requests */}
        <section className="overflow-hidden rounded-2xl border border-[#f1e8e3] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-[#302521]">
                Recent Booking Requests
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Keep track of your latest customer requests.
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
                  <th className="px-6 py-4 font-semibold">Booking ID</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Service</th>
                  <th className="px-6 py-4 font-semibold">Event Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-[#302521]">
                      {booking.id}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.customer}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.service}
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
                  </tr>
                ))}
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
