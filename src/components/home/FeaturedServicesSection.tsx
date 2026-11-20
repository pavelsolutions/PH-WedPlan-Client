
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";

const featuredServices = [
  {
    name: "Elegant Wedding Photography",
    category: "Photography",
    vendor: "Dream Moments Studio",
    location: "Dhaka, Bangladesh",
    price: "৳15,000",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=85",
  },
  {
    name: "Luxury Wedding Decoration",
    category: "Decoration",
    vendor: "Blossom Wedding House",
    location: "Dhaka, Bangladesh",
    price: "৳25,000",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=85",
  },
  {
    name: "Premium Wedding Venue",
    category: "Wedding Venue",
    vendor: "Royal Celebration",
    location: "Dhaka, Bangladesh",
    price: "৳40,000",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=85",
  },
];

export default function FeaturedServicesSection() {
  return (
    <section className="bg-white px-5 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-[3px] text-[#f45b4f]">
            Handpicked For You
          </span>

          <h2 className="mt-4 text-3xl font-bold text-[#302521] sm:text-4xl">
            Featured Wedding{" "}
            <span className="text-[#f45b4f]">Services</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#88766e]">
            Explore some inspiring wedding services and
            discover professionals for your special day.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <div
              key={service.name}
              className="group overflow-hidden rounded-2xl border border-[#f0e5df] bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#302521]/10"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url("${service.image}")`,
                  }}
                />

                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#f45b4f] shadow-sm">
                  {service.category}
                </span>

                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#302521] shadow-sm">
                  <Star
                    size={13}
                    fill="#f4ae45"
                    className="text-[#f4ae45]"
                  />
                  {service.rating}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-xs font-medium text-[#a18d84]">
                  {service.vendor}
                </p>

                <h3 className="mt-2 text-lg font-bold text-[#302521]">
                  {service.name}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-sm text-[#88766e]">
                  <MapPin size={15} className="text-[#f45b4f]" />
                  {service.location}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#f0e5df] pt-5">
                  <div>
                    <p className="text-xs text-[#a18d84]">
                      Starting from
                    </p>
                    <p className="mt-1 text-lg font-bold text-[#f45b4f]">
                      {service.price}
                    </p>
                  </div>

                  <Link
                    href="/services"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0eb] text-[#f45b4f] transition-all hover:bg-[#f45b4f] hover:text-white"
                    aria-label={`Explore ${service.name}`}
                  >
                    <ArrowRight size={19} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/services"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#f45b4f] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#df493e]"
          >
            Explore All Services
            <ArrowRight size={17} />
          </Link>
        </div>

      </div>
    </section>
  );
}
