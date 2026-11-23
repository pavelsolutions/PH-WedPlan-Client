
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  Search,
  MapPin,
  Camera,
  Flower2,
  Utensils,
  Building2,
  Sparkles,
  ArrowRight,
  Star,
  Users,
  CalendarDays,
  Store,
  Play,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WhyChooseSection from "./WhyChooseSection";
import FeaturedServicesSection from "./FeaturedServicesSection";
import HowItWorksSection from "./HowItWorksSection";
import TestimonialsSection from "./TestimonialsSection";
import FinalCTASection from "./FinalCTASection";

const categories = [
  {
    title: "Photography",
    subtitle: "Capture every moment",
    icon: Camera,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
  },
  {
    title: "Decoration & Florist",
    subtitle: "Beautiful wedding setups",
    icon: Flower2,
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500",
  },
  {
    title: "Catering Services",
    subtitle: "Delicious wedding menus",
    icon: Utensils,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500",
  },
  {
    title: "Wedding Venues",
    subtitle: "Find your perfect venue",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500",
  },
  {
    title: "Makeup & Styling",
    subtitle: "Look stunning on your day",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500",
  },
];

const stats = [
  { icon: Store, value: "500+", label: "Trusted Vendors" },
  { icon: Users, value: "50K+", label: "Happy Couples" },
  { icon: Star, value: "4.8/5", label: "Average Rating" },
  { icon: CalendarDays, value: "10K+", label: "Bookings Completed" },
];

export default function Home() {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (service) params.set("category", service);
    if (location) params.set("location", location);

    window.location.href = `/services?${params.toString()}`;
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf8] text-[#302521]">

      {/* NAVBAR */}
      <header className="absolute left-0 top-0 z-50 w-full px-4 pt-5">
        <nav className="mx-auto flex max-w-[1350px] items-center justify-between rounded-2xl border border-white/60 bg-white/90 px-5 py-3 shadow-lg backdrop-blur-xl md:px-8">

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dc2027] text-white">
              <Heart size={25} fill="currentColor" />
            </div>

            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-[#c91f2b]">
                WedPlan
              </h1>
              <p className="text-[9px] font-semibold tracking-[2px] text-[#947e76]">
                WEDDING MARKETPLACE
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <Link href="/" className="font-semibold text-[#dc2027]">
              Home
            </Link>
            <Link href="/services" className="transition hover:text-[#dc2027]">
              Services
            </Link>
            <Link href="/vendors" className="transition hover:text-[#dc2027]">
              Vendors
            </Link>
            <Link href="/about" className="transition hover:text-[#dc2027]">
              About
            </Link>
            <Link href="/blog" className="transition hover:text-[#dc2027]">
              Blog
            </Link>
            <Link href="/contact" className="transition hover:text-[#dc2027]">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden items-center gap-2 rounded-full bg-[#dc2027] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b91620] sm:flex"
            >
              Dashboard <ArrowRight size={16} />
            </Link>

            <Link
              href="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dc2027] text-white sm:hidden"
            >
              <ArrowRight size={18} />
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section
        className="relative flex min-h-[690px] items-center bg-cover bg-center pt-28 md:min-h-[750px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=90')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff2ed]/95 via-[#fff2ed]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fffaf8]/20 to-transparent" />

        <div className="relative z-10 mx-auto grid w-full max-w-[1350px] items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">

          {/* HERO CONTENT */}
          <div className="max-w-[650px]">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f2c6c3] bg-white/70 px-4 py-2 text-sm font-medium text-[#a52a32] backdrop-blur-md">
              <Sparkles size={16} />
              Plan · Book · Celebrate
            </div>

            <h1 className="font-serif text-5xl font-bold leading-[1.12] tracking-tight text-[#302521] sm:text-6xl lg:text-[76px]">
              Your Dream{" "}
              <span className="text-[#dc2027]">Wedding</span>
              <br />
              Starts Here.
            </h1>

            <p className="mt-7 max-w-[500px] text-base leading-8 text-[#685650] md:text-lg">
              Discover the best wedding services, trusted vendors,
              and make your special day truly unforgettable.
            </p>

            {/* SEARCH BOX */}
            <div className="mt-9 rounded-2xl border border-white bg-white p-3 shadow-xl shadow-[#9b4b3d]/10 md:flex md:items-center md:gap-2">

              <div className="flex flex-1 items-center gap-3 px-3 py-2">
                <Search className="shrink-0 text-[#dc2027]" size={21} />

                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-semibold text-[#302521]">
                    What are you looking for?
                  </p>

                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger className="h-8 border-0 p-0 text-sm shadow-none focus:ring-0">
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Photography">Photography</SelectItem>
                      <SelectItem value="Decoration">Decoration</SelectItem>
                      <SelectItem value="Catering">Catering</SelectItem>
                      <SelectItem value="Wedding Venues">Wedding Venues</SelectItem>
                      <SelectItem value="Makeup">Makeup & Styling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="my-2 hidden h-12 w-px bg-[#eee0dc] md:block" />

              <div className="flex flex-1 items-center gap-3 border-t border-[#eee0dc] px-3 py-3 md:border-0">
                <MapPin className="shrink-0 text-[#dc2027]" size={21} />

                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-semibold text-[#302521]">
                    Location
                  </p>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Dhaka"
                    className="h-8 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>

              <Button
                onClick={handleSearch}
                className="h-12 w-full rounded-xl bg-[#dc2027] px-7 font-semibold text-white hover:bg-[#b91620] md:w-auto"
              >
                <Search size={17} className="mr-2" />
                Search
              </Button>
            </div>

            {/* BUTTONS */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Button
                asChild
                className="h-12 rounded-full bg-[#dc2027] px-7 text-sm font-semibold hover:bg-[#b91620]"
              >
                <Link href="/services">
                  Explore Services <ArrowRight className="ml-2" size={17} />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-[#dc2027]/50 bg-white/50 px-7 text-[#302521] hover:bg-white"
              >
                <Link href="/about">
                  <Play size={16} className="mr-2" />
                  Discover WedPlan
                </Link>
              </Button>
            </div>

            {/* TRUST */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#e9c4ba] text-xs font-bold text-[#8d3834]"
                  >
                    {["A", "S", "M", "R"][item - 1]}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center gap-1 text-sm font-bold">
                  <Star size={14} className="fill-[#e6a43c] text-[#e6a43c]" />
                  4.8/5 Rating
                </div>
                <p className="text-xs text-[#806e66]">
                  Trusted by happy couples
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE DECORATION */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="relative h-[440px] w-[350px]">
              <div className="absolute -right-2 top-5 h-[410px] w-[310px] rotate-3 rounded-[160px_160px_25px_25px] border-[10px] border-white/80 shadow-2xl">
                <div
                  className="h-full w-full rounded-[150px_150px_18px_18px] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&q=85')",
                  }}
                />
              </div>

              <div className="absolute -bottom-3 -left-10 rounded-2xl border border-white bg-white/95 p-4 shadow-xl backdrop-blur-lg">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#fff0ed] p-3 text-[#dc2027]">
                    <Heart size={22} fill="currentColor" />
                  </div>
                  <div>
                    <p className="font-serif text-xl font-bold">10K+</p>
                    <p className="text-xs text-[#89766d]">
                      Beautiful celebrations
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 top-24 rounded-xl bg-white/95 px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="text-green-600" size={18} />
                  Verified Vendors
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-20 mx-auto -mt-8 max-w-[1250px] px-5">
        <div className="grid grid-cols-2 gap-5 rounded-2xl border border-[#f4dfda] bg-white px-5 py-7 shadow-xl shadow-[#9b4b3d]/5 md:grid-cols-4 md:px-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`flex items-center justify-center gap-3 ${
                  index !== 0 ? "md:border-l md:border-[#f0d9d5]" : ""
                }`}
              >
                <Icon className="shrink-0 text-[#dc2027]" size={27} />
                <div>
                  <h3 className="font-serif text-xl font-bold md:text-2xl">
                    {stat.value}
                  </h3>
                  <p className="text-[11px] text-[#88766f] md:text-xs">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-[1350px] px-5 py-24 md:px-10">

        <div className="mx-auto mb-12 max-w-xl text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#e9a5a5]" />
            <Heart size={18} className="fill-[#dc2027] text-[#dc2027]" />
            <span className="h-px w-10 bg-[#e9a5a5]" />
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-[#dc2027]">
            Everything in one place
          </p>

          <h2 className="font-serif text-4xl font-bold md:text-5xl">
            Our Trusted <span className="text-[#dc2027]">Services</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#85746c] md:text-base">
            Everything you need for your perfect wedding, all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                href={`/services?category=${encodeURIComponent(category.title)}`}
                className="group overflow-hidden rounded-2xl border border-[#f2e4df] bg-white transition duration-300 hover:-translate-y-2 hover:border-[#e8b4b1] hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                  <div className="absolute bottom-3 left-3 rounded-xl bg-white/90 p-2 text-[#dc2027] backdrop-blur">
                    <Icon size={19} />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-serif text-lg font-bold">
                    {category.title}
                  </h3>

                  <p className="mt-1 text-xs text-[#95837b]">
                    {category.subtitle}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[#dc2027]">
                    Explore Services
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#dc2027] px-8 text-[#dc2027] hover:bg-[#dc2027] hover:text-white"
          >
            <Link href="/services">
              View All Services <ArrowRight className="ml-2" size={16} />
            </Link>
          </Button>
        </div>
      </section>

      {/* VENDOR CTA */}
      {/* <section className="mx-5 mb-20 overflow-hidden rounded-[30px] bg-[#302521] md:mx-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-8 px-8 py-14 text-center md:flex-row md:px-16 md:text-left">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-[#f4a6a6]">
              Grow with WedPlan
            </p>
            <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
              Are You a Wedding Professional?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
              Join our growing community of trusted wedding vendors and
              connect with couples looking for your services.
            </p>
          </div>

          <Button
            asChild
            className="shrink-0 rounded-full bg-[#dc2027] px-8 py-6 text-white hover:bg-[#b91620]"
          >
            <Link href="/dashboard/vendor">
              Become a Vendor <ArrowRight className="ml-2" size={18} />
            </Link>
          </Button>
        </div>
      </section> */}
            {/* <HeroSection />
      <WeddingServiceCategories/> */}
      {/* <PopularCategoriesSection /> */}
      <WhyChooseSection />
      <FeaturedServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FinalCTASection />

    </main>
  );
}
