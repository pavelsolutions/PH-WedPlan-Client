
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import ServiceCard from "../shared/ServiceCard";
import { getAllServices } from "@/lib/api/services";
import { IService } from "@/types";

// const featuredServices = [
//   {
//     name: "Elegant Wedding Photography",
//     category: "Photography",
//     vendor: "Dream Moments Studio",
//     location: "Dhaka, Bangladesh",
//     price: "৳15,000",
//     rating: "4.9",
//     image:
//       "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=85",
//   },
//   {
//     name: "Luxury Wedding Decoration",
//     category: "Decoration",
//     vendor: "Blossom Wedding House",
//     location: "Dhaka, Bangladesh",
//     price: "৳25,000",
//     rating: "4.8",
//     image:
//       "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=85",
//   },
//   {
//     name: "Premium Wedding Venue",
//     category: "Wedding Venue",
//     vendor: "Royal Celebration",
//     location: "Dhaka, Bangladesh",
//     price: "৳40,000",
//     rating: "4.9",
//     image:
//       "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=85",
//   },
// ];

export default async function FeaturedServicesSection() {
  const featuredServices = await getAllServices();
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
          {featuredServices.map((service:IService) => (
            <ServiceCard key={service._id} service={service} />
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
