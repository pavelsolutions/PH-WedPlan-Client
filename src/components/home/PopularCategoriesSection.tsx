
import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  MapPin,
  Flower2,
  Utensils,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    name: "Photography & Videography",
    description: "Capture every beautiful moment.",
    icon: Camera,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=85",
  },
  {
    name: "Wedding Venues",
    description: "Find the perfect place to celebrate.",
    icon: MapPin,
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=700&q=85",
  },
  {
    name: "Decoration & Florist",
    description: "Create a magical wedding atmosphere.",
    icon: Flower2,
    image:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fee?w=700&q=85",
  },
  {
    name: "Catering Services",
    description: "Delight your guests with delicious food.",
    icon: Utensils,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700&q=85",
  },
  {
    name: "Makeup & Styling",
    description: "Look and feel your most beautiful.",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=700&q=85",
  },
];

export default function PopularCategoriesSection() {
  return (
    <section className="bg-[#fffaf7] px-5 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[3px] text-[#f45b4f]">
              Explore Categories
            </span>

            <h2 className="mt-4 text-3xl font-bold text-[#302521] sm:text-4xl">
              Everything for Your{" "}
              <span className="text-[#f45b4f]">Big Day</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#88766e]">
              Explore our wedding categories and discover
              the right professionals to bring your dream
              celebration to life.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#f45b4f] transition hover:gap-3"
          >
            Browse All Services
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                href="/services"
                key={category.name}
                className="group relative h-[300px] overflow-hidden rounded-2xl bg-[#302521] shadow-sm"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url("${category.image}")`,
                  }}
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#211713]/90 via-[#211713]/25 to-transparent" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f45b4f] text-white">
                    <Icon size={22} />
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm text-white/75">
                    {category.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#ff9b8e]">
                    Explore Category
                    <ArrowUpRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
