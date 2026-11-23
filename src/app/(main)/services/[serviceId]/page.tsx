
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  ShieldCheck,
  Store,
  UserRound,
  XCircle,
  Images,
  MessageCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  createBooking,
  getMyBookings,
} from "@/lib/actions/bookings";
import { getServiceById } from "@/lib/api/services";
import { toast } from "sonner";

// ==============================
// Types
// ==============================

type Service = {
  _id?: string;
  id?: string;
  serviceName: string;
  category: string;
  description: string;
  price: number | string;
  location: string;
  images?: string[] | string;
  image?: string;
  imageUrl?: string;
  vendorId: string;
  status: string;

  vendor?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    businessName?: string;
  };
};

type ExistingBooking = {
  _id?: string;
  id?: string;
  serviceId?: string;
  eventDate?: string;
  status?: string;
};

// ==============================
// Helpers
// ==============================

// Local date: avoids UTC date mismatch.
const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Normalize event date to YYYY-MM-DD.
const normalizeDate = (date?: string) => {
  if (!date) return "";

  return String(date).slice(0, 10);
};

// ==============================
// Main Component
// ==============================

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const serviceId = params.serviceId as string;

  // Authentication
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const user = session?.user as
    | (NonNullable<typeof session>["user"] & {
        role?: string;
        isBlocked?: boolean;
      })
    | undefined;

  // Service states
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Gallery
  const [selectedImage, setSelectedImage] = useState(0);

  // Booking form
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // ==============================
  // Fetch Service
  // ==============================

  useEffect(() => {
    if (!serviceId) return;

    let isMounted = true;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getServiceById(serviceId);

        if (!data) {
          throw new Error("Service not found.");
        }

        if (isMounted) {
          setService(data);
          setSelectedImage(0);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchService();

    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  // ==============================
  // User Permissions
  // ==============================

  const userRole = user?.role?.toLowerCase();

  const isCustomer = userRole === "customer";
  const isAdmin = userRole === "admin";
  const isBlocked = user?.isBlocked === true;

  const isOwnService =
    !!user?.id &&
    !!service?.vendorId &&
    String(user.id) === String(service.vendorId);

  // Only approved services are available.
  const normalizedStatus = service?.status?.trim().toLowerCase();

  const isAvailable = normalizedStatus === "approved";

  // ==============================
  // Image Gallery
  // ==============================

  const images = useMemo(() => {
    const serviceImages = [
      ...(Array.isArray(service?.images)
        ? service.images
        : typeof service?.images === "string"
          ? [service.images]
          : []),

      service?.image,
      service?.imageUrl,
    ];

    return Array.from(
      new Set(
        serviceImages.filter(
          (image): image is string =>
            typeof image === "string" &&
            image.trim().length > 0
        )
      )
    );
  }, [service]);

  const handlePreviousImage = () => {
    setSelectedImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  // ==============================
  // Vendor Information
  // ==============================

  const vendorName =
    service?.vendor?.businessName ||
    service?.vendor?.name ||
    "Wedding Service Provider";

  // ==============================
  // Price Formatting
  // ==============================

  const formattedPrice =
    typeof service?.price === "number"
      ? `৳${service.price.toLocaleString("en-BD")}`
      : service?.price || "Contact for price";

  // ==============================
  // Booking Submission
  // ==============================

  const handleBooking = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setBookingError("");

    // Login validation
    if (!user) {
      router.push(
        `/signin?callbackUrl=${encodeURIComponent(
          `/services/${serviceId}`
        )}`
      );
      return;
    }

    // Blocked user
    if (isBlocked) {
      const errorMessage =
        "Your account is blocked. You cannot submit bookings.";

      setBookingError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Admin validation
    if (isAdmin) {
      const errorMessage =
        "Admins cannot submit customer booking requests.";

      setBookingError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Customer validation
    if (!isCustomer) {
      const errorMessage =
        "Only customers can submit booking requests.";

      setBookingError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Own service validation
    if (isOwnService) {
      const errorMessage =
        "You cannot book your own service.";

      setBookingError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Service availability
    if (!isAvailable) {
      const errorMessage =
        "This service is currently unavailable.";

      setBookingError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Form validation
    if (!eventDate || !eventLocation.trim()) {
      const errorMessage =
        "Please provide your event date and location.";

      setBookingError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Past date validation
    if (eventDate < getTodayDate()) {
      const errorMessage =
        "Please select today or a future event date.";

      setBookingError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    if (!user.id) {
      const errorMessage =
        "Unable to identify your account. Please sign in again.";

      setBookingError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    try {
      setBookingLoading(true);

      // =================================
      // 1. Check Existing Customer Bookings
      // =================================

      const existingBookings = await getMyBookings(user.id);

      const hasDuplicateBooking = (
        existingBookings as ExistingBooking[]
      ).some((booking) => {
        const sameService =
          String(booking.serviceId) === String(serviceId);

        const sameDate =
          normalizeDate(booking.eventDate) === eventDate;

        return sameService && sameDate;
      });

      if (hasDuplicateBooking) {
        throw new Error(
          "You have already booked this service for this date. Please choose another date."
        );
      }

      // =================================
      // 2. Create Booking
      // =================================

      const result = await createBooking({
        customerId: user.id,
        serviceId,
        eventDate,
        eventLocation: eventLocation.trim(),
        message: message.trim(),
      });

      toast.success(
        result?.message ||
          "Booking request submitted successfully!"
      );

      // Reset form
      setEventDate("");
      setEventLocation("");
      setMessage("");

      // Navigate to bookings
      router.push("/dashboard/customer/bookings");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setBookingError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  // ==============================
  // Loading State
  // ==============================

  if (loading || sessionLoading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-[#fffaf7] px-4">
        <div className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#fff0ed]">
            <Loader2
              size={32}
              className="animate-spin text-[#f45b4f]"
            />
          </div>

          <h2 className="mt-5 text-lg font-bold text-[#302521]">
            Loading Service
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we prepare the details.
          </p>
        </div>
      </div>
    );
  }

  // ==============================
  // Error State
  // ==============================

  if (error || !service) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-[#fffaf7] px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#f1e8e3] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <XCircle size={32} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-[#302521]">
            Service Not Found
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error ||
              "The requested service could not be found."}
          </p>

          <Link
            href="/services"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#f45b4f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#df493f]"
          >
            <ArrowLeft size={17} />
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  // ==============================
  // Main UI
  // ==============================

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#f45b4f]"
          >
            <ArrowLeft size={17} />
            Back to Services
          </Link>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Home</span>
            <span>/</span>
            <span>Services</span>
            <span>/</span>
            <span className="font-semibold text-[#f45b4f]">
              Details
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-7">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#fff0ed] px-3 py-1.5 text-xs font-bold text-[#f45b4f]">
              {service.category}
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                isAvailable
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-500"
              }`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#302521] sm:text-4xl">
            {service.serviceName}
          </h1>

          <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={17} className="text-[#f45b4f]" />
            {service.location}
          </p>
        </div>

        {/* Main Layout */}
        <section className="grid grid-cols-1 items-start gap-7 lg:grid-cols-3">

          {/* LEFT CONTENT */}
          <div className="space-y-6 lg:col-span-2">

            {/* ======================
                Image Gallery
            ====================== */}
            <div className="overflow-hidden rounded-3xl border border-[#f1e8e3] bg-white p-2 shadow-sm">

              {/* Main Image */}
              <div className="group relative h-[280px] overflow-hidden rounded-2xl bg-[#fff0ed] sm:h-[400px] lg:h-[460px]">

                {images.length > 0 ? (
                  <img
                    key={images[selectedImage]}
                    src={images[selectedImage]}
                    alt={service.serviceName}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    onError={(e) => {
                      e.currentTarget.style.opacity = "0";
                    }}
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
                    <Images size={48} />
                    <p className="text-sm font-medium">
                      No service images available
                    </p>
                  </div>
                )}

                {/* Image Overlay */}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#302521] shadow-sm backdrop-blur">
                    {service.category}
                  </span>

                  <span className="rounded-full bg-black/40 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
                    {images.length > 0
                      ? `${selectedImage + 1} / ${images.length}`
                      : "Service Gallery"}
                  </span>
                </div>

                {/* Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={handlePreviousImage}
                      className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#302521] shadow-lg transition hover:bg-[#f45b4f] hover:text-white"
                    >
                      <ArrowLeft size={20} />
                    </button>

                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#302521] shadow-lg transition hover:bg-[#f45b4f] hover:text-white"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="mt-3 flex gap-3 overflow-x-auto px-1 pb-1">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      aria-label={`View image ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      className={`h-[76px] w-[95px] shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        selectedImage === index
                          ? "border-[#f45b4f] opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${service.serviceName} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ======================
                About Service
            ====================== */}
            <div className="rounded-3xl border border-[#f1e8e3] bg-white p-5 shadow-sm sm:p-7">

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[2px] text-[#f45b4f]">
                    Service Overview
                  </p>

                  <h2 className="mt-2 text-xl font-extrabold text-[#302521] sm:text-2xl">
                    About This Service
                  </h2>
                </div>

                <div className="rounded-2xl bg-[#fff0ed] px-4 py-3">
                  <p className="text-xs font-medium text-gray-500">
                    Starting Price
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-[#f45b4f]">
                    {formattedPrice}
                  </p>
                </div>
              </div>

              <p className="mt-6 whitespace-pre-line text-sm leading-8 text-gray-600">
                {service.description ||
                  "No description has been provided for this service."}
              </p>

              {/* Information Grid */}
              <div className="mt-7 grid grid-cols-1 gap-3 border-t border-[#f1e8e3] pt-6 sm:grid-cols-2">

                <div className="flex items-center gap-3 rounded-2xl bg-[#fffaf7] p-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0ed] text-[#f45b4f]">
                    <Store size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">
                      Service Category
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-[#302521]">
                      {service.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-[#fffaf7] p-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0ed] text-[#f45b4f]">
                    <MapPin size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">
                      Service Location
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-[#302521]">
                      {service.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-[#fffaf7] p-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0ed] text-[#f45b4f]">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Booking Status
                    </p>
                    <p className={`mt-1 text-sm font-bold ${
                      isAvailable ? "text-green-600" : "text-red-500"
                    }`}>
                      {isAvailable ? "Open for Booking" : "Unavailable"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-[#fffaf7] p-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0ed] text-[#f45b4f]">
                    <Clock size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Service Status
                    </p>
                    <p className="mt-1 text-sm font-bold capitalize text-[#302521]">
                      {normalizedStatus || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================
                Vendor Information
            ====================== */}
            <div className="rounded-3xl border border-[#f1e8e3] bg-white p-5 shadow-sm sm:p-7">

              <div>
                <p className="text-xs font-bold uppercase tracking-[2px] text-[#f45b4f]">
                  Service Provider
                </p>

                <h2 className="mt-2 text-xl font-extrabold text-[#302521]">
                  Meet the Vendor
                </h2>
              </div>

              <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#f1e8e3] bg-[#fffaf7] p-4 sm:flex-row sm:items-center">

                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#fff0ed] text-[#f45b4f]">
                  {service.vendor?.image ? (
                    <img
                      src={service.vendor.image}
                      alt={vendorName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={30} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-extrabold text-[#302521]">
                    {vendorName}
                  </h3>

                  {service.vendor?.email && (
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {service.vendor.email}
                    </p>
                  )}

                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
                    <ShieldCheck size={14} />
                    Service Provider
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================
              RIGHT BOOKING PANEL
          ====================== */}
          <aside className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-3xl border border-[#f1e8e3] bg-white shadow-sm">

              {/* Booking Header */}
              <div className="bg-[#302521] px-6 py-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[2px] text-white/60">
                  Booking Information
                </p>

                <h2 className="mt-3 text-3xl font-extrabold">
                  {formattedPrice}
                </h2>

                <p className="mt-2 text-xs leading-5 text-white/60">
                  Starting price. Final pricing may vary depending on your requirements.
                </p>
              </div>

              <div className="p-5 sm:p-6">

                {/* Service Summary */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-[#f45b4f]"
                    />
                    <span>{service.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2
                      size={18}
                      className={
                        isAvailable
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    />
                    <span>
                      {isAvailable
                        ? "Available for booking"
                        : "Currently unavailable"}
                    </span>
                  </div>
                </div>

                <div className="my-6 border-t border-[#f1e8e3]" />

                {/* Booking Heading */}
                <div>
                  <h3 className="text-xl font-extrabold text-[#302521]">
                    Request a Booking
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Share your event details and send a booking request to the vendor.
                  </p>
                </div>

                {/* Guest User */}
                {!user && (
                  <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-sm leading-6 text-blue-700">
                      Sign in as a customer to request this wedding service.
                    </p>

                    <Link
                      href={`/signin?callbackUrl=${encodeURIComponent(
                        `/services/${serviceId}`
                      )}`}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-700 underline"
                    >
                      Sign In Now
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                )}

                {/* Non Customer */}
                {user && !isCustomer && (
                  <div className="mt-5 rounded-2xl bg-orange-50 p-4 text-sm leading-6 text-orange-700">
                    {isAdmin
                      ? "Admins cannot submit customer booking requests."
                      : isOwnService
                        ? "You cannot book your own service."
                        : "Only customer accounts can submit booking requests."}
                  </div>
                )}

                {/* Blocked User */}
                {user && isBlocked && (
                  <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm leading-6 text-red-600">
                    Your account is blocked. Booking is unavailable.
                  </div>
                )}

                {/* Unavailable Service */}
                {!isAvailable && (
                  <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm leading-6 text-red-600">
                    This service is not currently available for booking.
                  </div>
                )}

                {/* Booking Form */}
                {isCustomer &&
                  !isOwnService &&
                  !isBlocked &&
                  isAvailable && (
                    <form
                      onSubmit={handleBooking}
                      className="mt-6 space-y-5"
                    >
                      {/* Event Date */}
                      <div>
                        <label
                          htmlFor="eventDate"
                          className="mb-2 block text-sm font-bold text-[#302521]"
                        >
                          Event Date <span className="text-[#f45b4f]">*</span>
                        </label>

                        <div className="relative">
                          <CalendarDays
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />

                          <input
                            id="eventDate"
                            type="date"
                            required
                            min={getTodayDate()}
                            value={eventDate}
                            onChange={(e) => {
                              setEventDate(e.target.value);
                              setBookingError("");
                            }}
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-3 text-sm text-[#302521] outline-none transition focus:border-[#f45b4f] focus:ring-4 focus:ring-[#f45b4f]/10"
                          />
                        </div>
                      </div>

                      {/* Event Location */}
                      <div>
                        <label
                          htmlFor="eventLocation"
                          className="mb-2 block text-sm font-bold text-[#302521]"
                        >
                          Event Location <span className="text-[#f45b4f]">*</span>
                        </label>

                        <div className="relative">
                          <MapPin
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />

                          <input
                            id="eventLocation"
                            type="text"
                            required
                            maxLength={200}
                            placeholder="Enter your event venue"
                            value={eventLocation}
                            onChange={(e) => {
                              setEventLocation(e.target.value);
                              setBookingError("");
                            }}
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#f45b4f] focus:ring-4 focus:ring-[#f45b4f]/10"
                          />
                        </div>
                      </div>

                      {/* Additional Message */}
                      <div>
                        <label
                          htmlFor="message"
                          className="mb-2 flex items-center gap-2 text-sm font-bold text-[#302521]"
                        >
                          <MessageCircle
                            size={16}
                            className="text-[#f45b4f]"
                          />
                          Additional Message
                          <span className="font-normal text-gray-400">
                            (Optional)
                          </span>
                        </label>

                        <textarea
                          id="message"
                          rows={4}
                          maxLength={1000}
                          placeholder="Tell the vendor about your wedding requirements..."
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            setBookingError("");
                          }}
                          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-[#f45b4f] focus:ring-4 focus:ring-[#f45b4f]/10"
                        />

                        <p className="mt-1 text-right text-xs text-gray-400">
                          {message.length}/1000
                        </p>
                      </div>

                      {/* Booking Error */}
                      {bookingError && (
                        <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm leading-6 text-red-600">
                          <XCircle
                            size={17}
                            className="mt-0.5 shrink-0"
                          />
                          <p>{bookingError}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f45b4f] px-5 py-4 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#df493f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                      >
                        {bookingLoading ? (
                          <>
                            <Loader2
                              size={19}
                              className="animate-spin"
                            />
                            Checking & Submitting...
                          </>
                        ) : (
                          <>
                            <CalendarDays size={19} />
                            Send Booking Request
                            <ArrowRight size={17} />
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-2 text-center text-xs leading-5 text-gray-400">
                        <ShieldCheck
                          size={15}
                          className="shrink-0"
                        />
                        Your booking request will be submitted securely.
                      </div>
                    </form>
                  )}
              </div>
            </div>

            {/* Help Card */}
            <div className="mt-5 rounded-2xl border border-[#f1e8e3] bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0ed] text-[#f45b4f]">
                  <MessageCircle size={19} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#302521]">
                    Need help?
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Choose your event date and provide your venue details to get started.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
