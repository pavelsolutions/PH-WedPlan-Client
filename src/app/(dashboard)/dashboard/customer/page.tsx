import Link from "next/link";
import {
  Heart,
  CalendarDays,
  Wallet,
  ClipboardCheck,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Plus,
  Star,
  CheckCircle2,
  PartyPopper,
  Search,
} from "lucide-react";

const stats = [
  {
    title: "My Bookings",
    value: "08",
    subtitle: "2 pending confirmation",
    icon: CalendarDays,
    color: "bg-orange-50 text-[#f45b4f]",
  },
  {
    title: "Wedding Budget",
    value: "৳ 4,50,000",
    subtitle: "65% budget utilized",
    icon: Wallet,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Tasks Completed",
    value: "18/32",
    subtitle: "14 tasks remaining",
    icon: ClipboardCheck,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Favorite Vendors",
    value: "12",
    subtitle: "Your saved vendors",
    icon: Heart,
    color: "bg-pink-50 text-pink-600",
  },
];

const bookings = [
  {
    name: "Dreamy Wedding Photography",
    category: "Photography",
    date: "18 December, 2026",
    status: "Confirmed",
    price: "৳ 45,000",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
  },
  {
    name: "Royal Convention Hall",
    category: "Venue",
    date: "22 December, 2026",
    status: "Pending",
    price: "৳ 1,20,000",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
  },
];

const checklist = [
  { title: "Book your wedding venue", done: true },
  { title: "Choose your photographer", done: true },
  { title: "Finalize guest list", done: false },
  { title: "Book makeup artist", done: false },
];

const vendors = [
  {
    name: "Elegant Moments",
    category: "Wedding Photography",
    rating: "4.9",
    price: "From ৳25,000",
    image:
      "https://images.unsplash.com/photo-1537633553341-d1d6d4e3c3c5?w=800",
  },
  {
    name: "Bloom & Bliss",
    category: "Wedding Decoration",
    rating: "4.8",
    price: "From ৳18,000",
    image:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800",
  },
  {
    name: "Royal Feast",
    category: "Catering",
    rating: "4.9",
    price: "From ৳650/person",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
  },
];

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-8 pb-10">

      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#fff0ec] via-[#fff7f4] to-[#fff4eb] p-6 sm:p-9">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-[#f45b4f]">
            <Sparkles size={14} />
            Your wedding journey starts here
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#302521] sm:text-4xl">
            Welcome back, <span className="text-[#f45b4f]">Bride & Groom!</span>
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-[#8f766c] sm:text-base">
            Every beautiful wedding starts with a plan. Let&apos;s make
            your dream day unforgettable.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-[#f45b4f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e84e43]"
            >
              Explore Vendors
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center gap-2 rounded-xl border border-[#f2d8d0] bg-white px-5 py-3 text-sm font-semibold text-[#5b453d] transition hover:bg-[#fff8f5]"
            >
              My Bookings
            </Link>
          </div>
        </div>

        {/* Decorative icon */}
        <div className="absolute -right-6 -top-8 hidden h-64 w-64 items-center justify-center rounded-full bg-white/40 md:flex">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/50">
            <Heart
              size={100}
              strokeWidth={1}
              className="text-[#f5b0a5]"
              fill="#fbd6ce"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#f1e5df] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#9b857b]">
                    {stat.title}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-[#302521]">
                    {stat.value}
                  </h3>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-3 text-xs text-[#a58b80]">
                {stat.subtitle}
              </p>
            </div>
          );
        })}
      </section>

      {/* Wedding Countdown & Budget */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* Countdown */}
        <div className="relative overflow-hidden rounded-2xl bg-[#302521] p-6 text-white xl:col-span-2">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#f45b4f]/10" />
          <div className="absolute -bottom-16 right-20 h-40 w-40 rounded-full bg-[#f45b4f]/10" />

          <div className="relative">
            <div className="flex items-center gap-2 text-[#f5b0a5]">
              <PartyPopper size={18} />
              <span className="text-sm font-medium">
                Your Big Day Countdown
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              30 Days to Go! 💍
            </h2>

            <p className="mt-2 text-sm text-white/60">
              22 December, 2026 · Your dream day is getting closer.
            </p>

            <div className="mt-6 grid max-w-md grid-cols-4 gap-3">
              {[
                ["30", "Days"],
                ["12", "Hours"],
                ["45", "Minutes"],
                ["20", "Seconds"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur"
                >
                  <div className="text-2xl font-bold text-white">
                    {value}
                  </div>
                  <div className="mt-1 text-xs text-white/50">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="rounded-2xl border border-[#f1e5df] bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#302521]">
              Budget Overview
            </h3>

            <Wallet size={18} className="text-[#f45b4f]" />
          </div>

          <p className="mt-5 text-sm text-[#a58b80]">
            Total Wedding Budget
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#302521]">
            ৳ 4,50,000
          </h2>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#f5ebe6]">
            <div className="h-full w-[65%] rounded-full bg-[#f45b4f]" />
          </div>

          <div className="mt-3 flex justify-between text-xs">
            <span className="text-[#f45b4f]">
              ৳2,92,500 spent (65%)
            </span>
            <span className="text-[#a58b80]">65%</span>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#8f766c]">Remaining</span>
              <span className="font-semibold text-[#302521]">
                ৳1,57,500
              </span>
            </div>

            <Link
              href="/dashboard/customer/budget"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#f1e5df] py-2.5 text-sm font-semibold text-[#f45b4f] transition hover:bg-[#fff7f4]"
            >
              Manage Budget
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Bookings + Checklist */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Bookings */}
        <div className="rounded-2xl border border-[#f1e5df] bg-white p-5 sm:p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#302521]">
                Upcoming Bookings
              </h2>
              <p className="mt-1 text-sm text-[#a58b80]">
                Your confirmed and pending vendors
              </p>
            </div>

            <Link
              href="/dashboard/customer/bookings"
              className="text-sm font-semibold text-[#f45b4f] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.name}
                className="flex flex-col gap-4 rounded-2xl border border-[#f5ebe6] p-3 sm:flex-row sm:items-center"
              >
                <img
                  src={booking.image}
                  alt={booking.name}
                  className="h-36 w-full rounded-xl object-cover sm:h-24 sm:w-28"
                />

                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-[#f45b4f]">
                    {booking.category}
                  </span>

                  <h3 className="mt-1 font-semibold text-[#302521]">
                    {booking.name}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#a58b80]">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={13} />
                      {booking.date}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        booking.status === "Confirmed"
                          ? "bg-green-50 text-green-600"
                          : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {booking.status === "Confirmed" ? (
                        <CheckCircle2 className="mr-1 inline" size={12} />
                      ) : (
                        <Clock className="mr-1 inline" size={12} />
                      )}
                      {booking.status}
                    </span>

                    <span className="text-sm font-bold text-[#302521]">
                      {booking.price}
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard/customer/bookings"
                  className="flex h-10 items-center justify-center rounded-lg border border-[#f1e5df] px-4 text-sm font-medium text-[#75645d] hover:bg-[#fff7f4]"
                >
                  Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className="rounded-2xl border border-[#f1e5df] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#302521]">
                Wedding Checklist
              </h2>
              <p className="mt-1 text-sm text-[#a58b80]">
                Stay on track
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0ec] text-[#f45b4f]">
              <ClipboardCheck size={20} />
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#f5ebe6]">
            <div className="h-full w-[56%] rounded-full bg-green-500" />
          </div>

          <p className="mt-2 text-xs text-[#a58b80]">
            18 of 32 tasks completed
          </p>

          <div className="mt-5 space-y-4">
            {checklist.map((task) => (
              <div key={task.title} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    task.done
                      ? "bg-green-100 text-green-600"
                      : "border border-[#eadbd4] text-transparent"
                  }`}
                >
                  {task.done && <CheckCircle2 size={14} />}
                </div>

                <p
                  className={`text-sm ${
                    task.done
                      ? "text-[#a58b80] line-through"
                      : "font-medium text-[#302521]"
                  }`}
                >
                  {task.title}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/customer/checklist"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#fff7f4] py-3 text-sm font-semibold text-[#f45b4f] transition hover:bg-[#fff0ec]"
          >
            View Full Checklist
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Recommended Vendors */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#302521]">
              Recommended Vendors
            </h2>
            <p className="mt-1 text-sm text-[#a58b80]">
              Handpicked services to make your day special
            </p>
          </div>

          <Link
            href="/services"
            className="flex items-center gap-2 text-sm font-semibold text-[#f45b4f] hover:underline"
          >
            Explore All
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {vendors.map((vendor) => (
            <div
              key={vendor.name}
              className="group overflow-hidden rounded-2xl border border-[#f1e5df] bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <button
                  type="button"
                  aria-label="Add to favorites"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#f45b4f] shadow-sm hover:bg-white"
                >
                  <Heart size={17} />
                </button>

                <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-[#302521] backdrop-blur">
                  {vendor.category}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-[#302521]">
                    {vendor.name}
                  </h3>

                  <div className="flex items-center gap-1 text-sm font-semibold text-[#302521]">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    {vendor.rating}
                  </div>
                </div>

                <p className="mt-2 text-sm text-[#a58b80]">
                  {vendor.price}
                </p>

                <Link
                  href="/services"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#f1e5df] py-2.5 text-sm font-semibold text-[#f45b4f] transition hover:bg-[#fff7f4]"
                >
                  View Vendor
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="rounded-2xl border border-[#f1e5df] bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[#302521]">
          Quick Actions
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Find Vendors",
              description: "Explore wedding services",
              icon: Search,
              href: "/services",
            },
            {
              title: "My Bookings",
              description: "Manage your bookings",
              icon: CalendarDays,
              href: "/dashboard/customer/bookings",
            },
            {
              title: "Favorites",
              description: "Your favorite vendors",
              icon: Heart,
              href: "/dashboard/customer/favorites",
            },
            {
              title: "Create Checklist",
              description: "Plan your wedding tasks",
              icon: Plus,
              href: "/dashboard/customer/checklist",
            },
          ].map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="flex items-center gap-3 rounded-xl border border-[#f1e5df] p-4 transition hover:border-[#f45b4f]/30 hover:bg-[#fff7f4]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0ec] text-[#f45b4f]">
                  <Icon size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#302521]">
                    {action.title}
                  </p>
                  <p className="mt-1 text-xs text-[#a58b80]">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}