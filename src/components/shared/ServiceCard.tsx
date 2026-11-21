
import Image from "next/image";
import Link from "next/link";

import { MapPin, ArrowUpRight } from "lucide-react";

import { IService } from "@/types";

interface ServiceCardProps {
  service: IService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#F0E2DA] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/40">

      {/* Image Section */}
      <Link href={`/services/${service._id}`} className="relative h-[240px] w-full shrink-0 overflow-hidden bg-[#F8F1EC]">
        <Image
          src={service.image || "/placeholder.jpg"}
          alt={service.serviceName}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category Badge */}
        <span className="absolute left-4 top-4 max-w-[75%] truncate rounded-full border border-orange-100 bg-white px-3 py-1.5 text-xs font-medium text-[#F75B50] shadow-sm">
          {service.category}
        </span>
      </Link>

      {/* Content Section */}
      <Link href={`/services/${service._id}`} className="flex flex-1 flex-col p-6">

        {/* Service Name */}
        <h2 className="truncate font-serif text-xl font-bold text-[#281C17] transition-colors group-hover:text-[#F75B50]">
          {service.serviceName}
        </h2>

        {/* Location */}
        <div className="mt-3 flex items-center gap-2 text-sm text-[#8A7770]">
          <MapPin className="h-4 w-4 shrink-0 text-[#F75B50]" />

          <span className="truncate">
            {service.location}
          </span>
        </div>

        {/* Description */}
        <p className="mt-4 h-[72px] line-clamp-3 text-sm leading-6 text-[#8A7770]">
          {service.description}
        </p>

        {/* Vendor Information */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0ED] text-sm font-bold text-[#F75B50]">
            V
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#35251E]">
              Wedding Vendor
            </p>

            <p className="text-xs text-[#A18D83]">
              Service Provider
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto pt-5">
          <div className="mb-4 border-t border-[#F0E2DA]" />

          <div className="flex items-center justify-between gap-3">

            {/* Price */}
            <div>
              <p className="mb-1 text-xs text-[#A18D83]">
                Starting from
              </p>

              <p className="font-serif text-lg font-bold text-[#F75B50]">
                {formatPrice(service.price)}
              </p>
            </div>

            {/* View Details */}
            <div
              aria-label={`View details for ${service.serviceName}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF0ED] text-[#F75B50] transition-all duration-300 hover:rotate-[-35deg] hover:bg-[#F75B50] hover:text-white"
            >
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
