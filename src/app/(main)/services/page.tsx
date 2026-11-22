"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  ArrowUpDown,
  Heart,
  CheckCircle2,
  Loader2,
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
import { getAllServicesData } from "@/lib/actions/api/services";
import ServiceCard from "@/components/shared/ServiceCard";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function ServicesPage() {

  const router = useRouter();
  const searchParams = useSearchParams();

  // Services
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  // URL based filters
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "all"
  );
  const [location, setLocation] = useState(
    searchParams.get("location") ?? ""
  );
  const [sort, setSort] = useState(
    searchParams.get("sort") ?? "newest"
  );

  // Advanced filters
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minBudget, setMinBudget] = useState(
    searchParams.get("minBudget") ?? ""
  );
  const [maxBudget, setMaxBudget] = useState(
    searchParams.get("maxBudget") ?? ""
  );
  const [rating, setRating] = useState(
    searchParams.get("rating") ?? "all"
  );
  const [verified, setVerified] = useState(
    searchParams.get("verified") === "true"
  );
  const [featured, setFeatured] = useState(
    searchParams.get("featured") === "true"
  );

  const [refreshKey, setRefreshKey] = useState(0);

  // -----------------------------
  // Sync filters with URL
  // -----------------------------
  useEffect(() => {
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (category !== "all") params.set("category", category);
    if (location.trim()) params.set("location", location.trim());
    if (sort !== "newest") params.set("sort", sort);
    if (minBudget) params.set("minBudget", minBudget);
    if (maxBudget) params.set("maxBudget", maxBudget);
    if (rating !== "all") params.set("rating", rating);
    if (verified) params.set("verified", "true");
    if (featured) params.set("featured", "true");

    const query = params.toString();
    const newUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  }, [
    search,
    category,
    location,
    sort,
    minBudget,
    maxBudget,
    rating,
    verified,
    featured,
    router,
  ]);

  // -----------------------------
  // Browser Back / Forward support
  // -----------------------------
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);

      setSearch(params.get("search") ?? "");
      setCategory(params.get("category") ?? "all");
      setLocation(params.get("location") ?? "");
      setSort(params.get("sort") ?? "newest");
      setMinBudget(params.get("minBudget") ?? "");
      setMaxBudget(params.get("maxBudget") ?? "");
      setRating(params.get("rating") ?? "all");
      setVerified(params.get("verified") === "true");
      setFeatured(params.get("featured") === "true");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // -----------------------------
  // Fetch services
  // -----------------------------
  useEffect(() => {
    let active = true;

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getAllServicesData({
          search: search.trim(),
          category,
          location: location.trim(),
          sort,
          minBudget,
          maxBudget,
          rating,
          verified,
          featured,
        });

        if (!active) return;

        const serviceList = Array.isArray(result)
          ? result
          : result?.services ?? result?.data ?? [];

        setServices(serviceList);

        setTotal(
          Array.isArray(result)
            ? serviceList.length
            : result?.total ?? serviceList.length
        );
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );

        setServices([]);
        setTotal(0);
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(fetchServices, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [
    search,
    category,
    location,
    sort,
    minBudget,
    maxBudget,
    rating,
    verified,
    featured,
    refreshKey,
  ]);

  // -----------------------------
  // Clear all filters
  // -----------------------------
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setLocation("");
    setSort("newest");
    setMinBudget("");
    setMaxBudget("");
    setRating("all");
    setVerified(false);
    setFeatured(false);
    setRefreshKey((prev) => prev + 1);
  };

  // -----------------------------
  // Reset advanced filters
  // -----------------------------
  const clearAdvanced = () => {
    setMinBudget("");
    setMaxBudget("");
    setRating("all");
    setVerified(false);
    setFeatured(false);
  };

  // -----------------------------
  // Remove individual filter
  // -----------------------------
  const removeFilter = (key: string) => {
    switch (key) {
      case "search":
        setSearch("");
        break;

      case "category":
        setCategory("all");
        break;

      case "location":
        setLocation("");
        break;

      case "minBudget":
        setMinBudget("");
        break;

      case "maxBudget":
        setMaxBudget("");
        break;

      case "rating":
        setRating("all");
        break;

      case "verified":
        setVerified(false);
        break;

      case "featured":
        setFeatured(false);
        break;
    }
  };

  // -----------------------------
  // Active filter count
  // -----------------------------
  const activeFilters = [
    search.trim(),
    category !== "all" ? category : "",
    location.trim(),
    minBudget,
    maxBudget,
    rating !== "all" ? rating : "",
    verified ? "verified" : "",
    featured ? "featured" : "",
  ].filter(Boolean).length;

  // -----------------------------
  // Filter chips
  // -----------------------------
  const filterChips = [
    search.trim()
      ? { key: "search", label: `Search: ${search}` }
      : null,

    category !== "all"
      ? { key: "category", label: category }
      : null,

    location.trim()
      ? { key: "location", label: `Location: ${location}` }
      : null,

    minBudget
      ? { key: "minBudget", label: `Min ৳${minBudget}` }
      : null,

    maxBudget
      ? { key: "maxBudget", label: `Max ৳${maxBudget}` }
      : null,

    rating !== "all"
      ? { key: "rating", label: `${rating}+ Stars` }
      : null,

    verified
      ? { key: "verified", label: "Verified Vendors" }
      : null,

    featured
      ? { key: "featured", label: "Featured" }
      : null,
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <main className="min-h-screen bg-[#FCF9F7]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

        {/* HEADER */}
        <header className="mb-8">
          <Badge className="mb-4 rounded-full border border-[#F1DDE1] bg-[#F8E9ED] px-3 py-1.5 text-xs font-medium text-[#92283D] hover:bg-[#F8E9ED]">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Curated Wedding Marketplace
          </Badge>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-[#281C17] sm:text-4xl">
                Find Your Perfect{" "}
                <span className="text-[#92283D]">
                  Wedding Service
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#806D68] sm:text-base">
                Discover trusted photographers, beautiful venues,
                talented decorators, caterers and wedding professionals
                for your special day.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#806D68]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8E9ED] text-[#92283D]">
                <Heart className="h-4 w-4" />
              </div>
              <span>
                Make your dream wedding come to life
              </span>
            </div>
          </div>
        </header>

        {/* SEARCH CARD */}
        <Card className="mb-8 overflow-hidden rounded-2xl border-[#EADFD8] bg-white shadow-[0_8px_30px_rgba(40,28,23,0.04)]">
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.5fr_1fr_1fr_auto]">

              {/* SEARCH INPUT */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#967F79]" />

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search services, vendors, keywords..."
                  className="h-12 rounded-xl border-[#E7DAD2] bg-[#FFFCFB] pl-10 text-sm focus-visible:ring-[#92283D]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#967F79] hover:text-[#92283D]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* CATEGORY */}
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "all")}
              >
                <SelectTrigger className="h-12 rounded-xl border-[#E7DAD2] bg-[#FFFCFB] text-sm">
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

              {/* LOCATION */}
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#967F79]" />

                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or location..."
                  className="h-12 rounded-xl border-[#E7DAD2] bg-[#FFFCFB] pl-10 text-sm focus-visible:ring-[#92283D]"
                />
              </div>

              {/* SEARCH BUTTON */}
              <Button
                onClick={() => setRefreshKey((prev) => prev + 1)}
                className="h-12 rounded-xl bg-[#dc2027] px-6 text-sm font-semibold text-white hover:bg-[#7D2033]"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            {/* ADVANCED TOGGLE */}
            <div className="mt-4 flex flex-col justify-between gap-3 border-t border-[#F1E8E2] pt-4 sm:flex-row sm:items-center">
              <Button
                variant="ghost"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="h-auto w-fit rounded-lg px-2 py-2 text-sm font-medium text-[#92283D] hover:bg-[#F8E9ED] hover:text-[#7D2033]"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Advanced Filters

                {activeFilters > 0 && (
                  <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#92283D] px-1.5 text-[10px] text-white">
                    {activeFilters}
                  </span>
                )}

                {showAdvanced ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>

              <div className="flex items-center gap-2 text-xs text-[#967F79]">
                <Sparkles className="h-3.5 w-3.5 text-[#C28B94]" />
                Refine your search
              </div>
            </div>
          </div>

          {/* ADVANCED FILTER PANEL */}
          {showAdvanced && (
            <div className="border-t border-[#F1E8E2] bg-[#FFFCFB] p-4 sm:p-5">
              <div className="mb-5">
                <h3 className="font-serif text-xl font-semibold text-[#281C17]">
                  Refine Your Search
                </h3>

                <p className="mt-1 text-sm text-[#806D68]">
                  Choose your budget and preferences.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* MIN BUDGET */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#59453E]">
                    Minimum Budget
                  </label>

                  <Input
                    type="number"
                    min="0"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    placeholder="৳ Minimum price"
                    className="h-11 rounded-xl border-[#E7DAD2] bg-white"
                  />
                </div>

                {/* MAX BUDGET */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#59453E]">
                    Maximum Budget
                  </label>

                  <Input
                    type="number"
                    min="0"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="৳ Maximum price"
                    className="h-11 rounded-xl border-[#E7DAD2] bg-white"
                  />
                </div>

                {/* RATING */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#59453E]">
                    Minimum Rating
                  </label>

                  <Select
                    value={rating}
                     onValueChange={(value) => setRating(value ?? "all")}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-[#E7DAD2] bg-white">
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all">
                        Any Rating
                      </SelectItem>
                      <SelectItem value="3">
                        3+ Stars
                      </SelectItem>
                      <SelectItem value="4">
                        4+ Stars
                      </SelectItem>
                      <SelectItem value="4.5">
                        4.5+ Stars
                      </SelectItem>
                      <SelectItem value="5">
                        5 Stars
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* VERIFIED / FEATURED */}
              <div className="mt-5 flex flex-wrap gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition ${
                    verified
                      ? "border-[#92283D] bg-[#F8E9ED] text-[#92283D]"
                      : "border-[#E7DAD2] bg-white text-[#59453E] hover:bg-[#FCF9F7]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                    className="accent-[#92283D]"
                  />

                  <CheckCircle2 className="h-4 w-4" />
                  Verified Vendors
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition ${
                    featured
                      ? "border-[#92283D] bg-[#F8E9ED] text-[#92283D]"
                      : "border-[#E7DAD2] bg-white text-[#59453E] hover:bg-[#FCF9F7]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-[#92283D]"
                  />

                  <Sparkles className="h-4 w-4" />
                  Featured Partners
                </label>
              </div>

              {/* ADVANCED ACTIONS */}
              <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-[#F1E8E2] pt-4">
                <Button
                  variant="outline"
                  onClick={clearAdvanced}
                  className="h-10 rounded-xl border-[#E7DAD2] text-sm text-[#806D68] hover:bg-[#F9F3F0]"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>

                <Button
                  onClick={() => setRefreshKey((prev) => prev + 1)}
                  className="h-10 rounded-xl bg-[#92283D] px-5 text-sm text-white hover:bg-[#7D2033]"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* ACTIVE FILTER CHIPS */}
        {filterChips.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium text-[#806D68]">
              Active filters:
            </span>

            {filterChips.map((chip) => (
              <Badge
                key={chip.key}
                className="flex items-center gap-1.5 rounded-full border border-[#E8C9CF] bg-[#F8E9ED] px-3 py-1.5 text-xs font-medium text-[#92283D] hover:bg-[#F8E9ED]"
              >
                {chip.label}

                <button
                  type="button"
                  onClick={() => removeFilter(chip.key)}
                  aria-label={`Remove ${chip.label}`}
                  className="ml-1 rounded-full hover:text-[#5D1627]"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            <button
              type="button"
              onClick={clearFilters}
              className="ml-1 text-xs font-medium text-[#92283D] underline underline-offset-2 hover:text-[#7D2033]"
            >
              Clear all
            </button>
          </div>
        )}

        {/* RESULTS HEADER */}
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-[#281C17]">
              Explore Services
            </h2>

            <p className="mt-1 text-sm text-[#806D68]">
              {loading ? (
                "Finding services..."
              ) : (
                <>
                  <span className="font-semibold text-[#281C17]">
                    {total}
                  </span>{" "}
                  {total === 1 ? "service" : "services"} found
                </>
              )}
            </p>
          </div>

          {/* SORT */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-[#967F79]" />

            <span className="text-xs text-[#806D68]">
              Sort by
            </span>

            <Select value={sort} onValueChange={(value) => setSort(value ?? "default")}>
              <SelectTrigger className="h-10 w-[190px] rounded-xl border-[#E7DAD2] bg-white text-sm">
                <SelectValue placeholder="Sort services" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="newest">
                  Featured & Newest
                </SelectItem>
                <SelectItem value="price-low">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="rating">
                  Highest Rated
                </SelectItem>
                <SelectItem value="featured">
                  Featured First
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card
                key={item}
                className="overflow-hidden rounded-2xl border-[#EADFD8] bg-white"
              >
                <Skeleton className="h-[220px] w-full" />

                <div className="space-y-3 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <Card className="rounded-2xl border-red-200 bg-red-50 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <X className="h-5 w-5 text-red-600" />
            </div>

            <h3 className="text-lg font-semibold text-red-800">
              Failed to load services
            </h3>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <Button
              onClick={() => setRefreshKey((prev) => prev + 1)}
              variant="outline"
              className="mt-5 rounded-xl border-red-200"
            >
              Try Again
            </Button>
          </Card>
        )}

        {/* SERVICE GRID */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && services.length === 0 && (
          <Card className="rounded-2xl border border-dashed border-[#E8C9CF] bg-white px-5 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8E9ED]">
              <Search className="h-7 w-7 text-[#92283D]" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#281C17]">
              No Services Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#806D68]">
              We couldn&apos;t find services matching your search.
              Try adjusting your keywords or filters to discover
              more wedding professionals.
            </p>

            <Button
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-[#dc2027] px-5 text-white hover:bg-[#7D2033]"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear All Filters
            </Button>
          </Card>
        )}
      </div>
    </main>
  );
}