
import Link from "next/link";
import {
  Camera,
  MapPin,
  Flower2,
  UtensilsCrossed,
  Sparkles,
  Shirt,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Photography & Videography",
    description: "Capture every beautiful moment of your special day.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85",
    icon: Camera,
    count: "Capture moments",
  },
  {
    name: "Wedding Venues",
    description: "Find the perfect setting for your dream wedding.",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=85",
    icon: MapPin,
    count: "Dream locations",
  },
  {
    name: "Decoration & Florist",
    description: "Beautiful decor and flowers to create your dream setup.",
    image:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=900&q=85",
    icon: Flower2,
    count: "Beautiful details",
  },
  {
    name: "Catering Services",
    description: "Delight your guests with unforgettable wedding cuisine.",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85",
    icon: UtensilsCrossed,
    count: "Taste & celebrate",
  },
  {
    name: "Makeup & Styling",
    description: "Look and feel your best on your big day.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85",
    icon: Sparkles,
    count: "Beauty & glam",
  },
  {
    name: "Wedding Fashion",
    description: "Discover stunning outfits for your wedding celebration.",
    image:
      "https://images.unsplash.com/photo-1594552072238-b4a3a0f2a9e6?auto=format&fit=crop&w=900&q=85",
    icon: Shirt,
    count: "Style your day",
  },
];

export default function WeddingServiceCategories() {
  return (
    <section className="bg-[#FCF9F7] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#92283D]/15 bg-[#92283D]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#92283D]">
            <Sparkles size={14} />
            Explore Our Services
          </span>

          <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-[#2D2022] sm:text-4xl lg:text-5xl">
            Everything You Need for
            <span className="mt-2 block font-serif italic font-medium text-[#92283D]">
              Your Perfect Wedding
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#78666A] sm:text-base">
            From dreamy venues to beautiful details, discover trusted wedding
            professionals to make your special day unforgettable.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group relative isolate h-[340px] overflow-hidden rounded-2xl bg-[#E8DCD8] shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:h-[380px]"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5 transition-all duration-500 group-hover:from-[#641C2C]/90 group-hover:via-black/30" />

                {/* Top Icon */}
                <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-[#92283D]">
                  <Icon size={21} strokeWidth={1.8} />
                </div>

                {/* Top Label */}
                <span className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-white/90 backdrop-blur-md">
                  {category.count}
                </span>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <span className="mb-3 block text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                    Category {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="max-w-[280px] text-2xl font-semibold leading-tight text-white sm:text-[27px]">
                    {category.name}
                  </h3>

                  <p className="mt-3 max-w-[290px] text-sm leading-6 text-white/75">
                    {category.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
                    <span className="text-sm font-medium text-white">
                      Explore Category
                    </span>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#92283D] transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#92283D] group-hover:text-white">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 rounded-full border border-[#92283D]/20 px-7 py-3.5 text-sm font-semibold text-[#92283D] transition-all duration-300 hover:bg-[#92283D] hover:text-white"
          >
            Explore All Services
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
