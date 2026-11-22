
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
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#F0E2DA] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100/50">

      {/* Image Section */}
      <Link
        href={`/services/${service._id}`}
        className="relative h-[180px] w-full shrink-0 overflow-hidden bg-[#F8F1EC]"
      >
        <Image
          src={service.image || "/placeholder.jpg"}
          alt={service.serviceName}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category Badge */}
        <span className="absolute left-3 top-3 max-w-[75%] truncate rounded-full border border-orange-100 bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#F75B50] shadow-sm">
          {service.category}
        </span>
      </Link>

      {/* Content Section */}
      <Link
        href={`/services/${service._id}`}
        className="flex flex-1 flex-col p-4"
      >
        {/* Service Name */}
        <h2 className="truncate font-serif text-lg font-bold text-[#281C17] transition-colors group-hover:text-[#F75B50]">
          {service.serviceName}
        </h2>

        {/* Location */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-[#8A7770]">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#F75B50]" />
          <span className="truncate">{service.location}</span>
        </div>

        {/* Description */}
        <p className="mt-3 line-clamp-2 min-h-[40px] text-xs leading-5 text-[#8A7770]">
          {service.description}
        </p>

        {/* Vendor Information */}
        <div className="mt-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF0ED] text-xs font-bold text-[#F75B50]">
            V
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-[#35251E]">
              Wedding Vendor
            </p>
            <p className="text-[10px] text-[#A18D83]">
              Service Provider
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto pt-4">
          <div className="mb-3 border-t border-[#F0E2DA]" />

          <div className="flex items-center justify-between gap-2">
            {/* Price */}
            <div>
              <p className="mb-0.5 text-[10px] text-[#A18D83]">
                Starting from
              </p>
              <p className="font-serif text-base font-bold text-[#F75B50]">
                {formatPrice(Number(service.price))}
              </p>
            </div>

            {/* View Details */}
            <div
              aria-label={`View details for ${service.serviceName}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF0ED] text-[#F75B50] transition-all duration-300 group-hover:rotate-[-35deg] group-hover:bg-[#F75B50] group-hover:text-white"
            >
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
