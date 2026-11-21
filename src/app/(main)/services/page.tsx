
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Search,
  MapPin,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { IService } from "@/types";
import { getAllServices } from "@/lib/actions/api/services";
import ServiceCard from "@/components/shared/ServiceCard";


export default function ServicesPage() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");

  // Fetch Services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getAllServices();

        const serviceList: IService[] = Array.isArray(result)
          ? result
          : result.services ?? result.data ?? [];

        setServices(serviceList);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Dynamic Categories
  const categories = useMemo(
    () => [...new Set(services.map((s) => s.category))],
    [services]
  );

  // Filter and Sort
  const filteredServices = useMemo(() => {
    let result = services.filter(
      (service) =>
        String(service.status).toUpperCase() === "APPROVED"
    );

    // Search Filter
    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter(
        (service) =>
          service.serviceName.toLowerCase().includes(keyword) ||
          service.description.toLowerCase().includes(keyword) ||
          service.category.toLowerCase().includes(keyword)
      );
    }

    // Category Filter
    if (category !== "all") {
      result = result.filter(
        (service) => service.category === category
      );
    }

    // Location Filter
    if (location.trim()) {
      result = result.filter((service) =>
        service.location
          .toLowerCase()
          .includes(location.toLowerCase())
      );
    }

    // Newest First
    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    // Price Low to High
    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    // Price High to Low
    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [services, search, category, location, sort]);

  // Clear Filters
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setLocation("");
    setSort("newest");
  };

  return (
    <main className="min-h-screen bg-[#FFFBF7]">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <Badge className="mb-3 rounded-full border border-orange-100 bg-orange-50 px-4 py-1.5 text-orange-600 hover:bg-orange-50">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Curated Wedding Marketplace
          </Badge>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#281C17] sm:text-4xl">
            Browse Wedding Services
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8A7770] sm:text-base">
            Search verified photographers, dream venues,
            florists, caterers, and stylists. Discover the
            perfect services for your special day.
          </p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8 rounded-2xl border border-[#F0E5DC] bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_minmax(140px,0.7fr)_minmax(200px,1.2fr)_minmax(160px,0.8fr)_auto]">

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A18D83]" />

              <Input
                placeholder="Search service name or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 rounded-xl border-[#EDE1D8] bg-[#FFFEFC] pl-10 text-sm focus-visible:border-orange-400 focus-visible:ring-orange-200"
              />
            </div>

            {/* Category */}
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger className="h-12 rounded-xl border-[#EDE1D8] bg-[#FFFEFC] focus:ring-orange-200">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Categories
                </SelectItem>

                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A18D83]" />

              <Input
                placeholder="Filter by city / location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 rounded-xl border-[#EDE1D8] bg-[#FFFEFC] pl-10 text-sm focus-visible:border-orange-400 focus-visible:ring-orange-200"
              />
            </div>

            {/* Sorting */}
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-12 rounded-xl border-[#EDE1D8] bg-[#FFFEFC] focus:ring-orange-200">
                <SlidersHorizontal className="mr-2 h-4 w-4 text-[#F75B50]" />
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="newest">
                  Newest First
                </SelectItem>

                <SelectItem value="price-low">
                  Price: Low to High
                </SelectItem>

                <SelectItem value="price-high">
                  Price: High to Low
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button
              onClick={() => {}}
              className="h-12 rounded-xl bg-[#F75B50] px-8 font-semibold text-white shadow-sm transition-all hover:bg-[#E94D43] sm:col-span-2 xl:col-span-1"
            >
              Search
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Result Count */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-[#8A7770]">
            Showing{" "}
            <span className="font-bold text-[#281C17]">
              {loading ? "..." : filteredServices.length}
            </span>{" "}
            approved wedding services
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card
                key={item}
                className="overflow-hidden rounded-[20px]"
              >
                <Skeleton className="h-[240px] w-full" />

                <div className="space-y-4 p-6">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-1/2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600">{error}</p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-5 py-20 text-center">
            <Search className="mx-auto mb-4 h-10 w-10 text-[#F75B50]" />

            <h3 className="font-serif text-2xl font-bold text-[#281C17]">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-[#8A7770]">
              Try changing your search or filter criteria.
            </p>

            <Button
              className="mt-5 rounded-xl bg-[#F75B50] text-white hover:bg-[#E94D43]"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
