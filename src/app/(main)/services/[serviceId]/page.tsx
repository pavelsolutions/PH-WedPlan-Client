
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Heart,
  Loader2,
  MapPin,
  ShieldCheck,
  Store,
  UserRound,
  XCircle,
  Clock,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { createBooking } from "@/lib/actions/bookings";
import { getServiceById } from "@/lib/actions/api/services";
import { toast } from "sonner";

// Service Type
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
  isActive: boolean;

  vendor?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    businessName?: string;
  };
};

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

  // Service States
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Image Gallery
  const [selectedImage, setSelectedImage] = useState(0);

  // Booking Form
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");

  // Fetch Service Details
  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getServiceById(serviceId);

        console.log("Service Details:", data);
        console.log("Service Images:", data.images);

        setService(data);
        setSelectedImage(0);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  // User Role
  const userRole = user?.role?.toLowerCase();

  const isCustomer = userRole === "customer";
  const isAdmin = userRole === "admin";
  const isBlocked = user?.isBlocked === true;

  const isOwnService =
    !!user?.id &&
    !!service?.vendorId &&
    String(user.id) === String(service.vendorId);

  // Service Availability
  const normalizedStatus = service?.status?.trim().toLowerCase();

//   const isAvailable =
//     normalizedStatus === "approved" &&
//     service?.isActive === true;

  const isAvailable =
    normalizedStatus === "approved"

  // Image Handling
  const images = [
    ...(Array.isArray(service?.images)
      ? service.images
      : typeof service?.images === "string"
        ? [service.images]
        : []),
    service?.image,
    service?.imageUrl,
  ].filter(
    (image): image is string =>
      typeof image === "string" && image.trim().length > 0
  );

  // Vendor Name
  const vendorName =
    service?.vendor?.businessName ||
    service?.vendor?.name ||
    "Wedding Service Provider";

  // Booking Submission
  const handleBooking = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setBookingError("");
    setBookingSuccess("");

    if (!user) {
      router.push(
        `/signin?callbackUrl=${encodeURIComponent(
          `/services/${serviceId}`
        )}`
      );
      return;
    }

    if (isBlocked) {
      setBookingError(
        "Your account is blocked. You cannot submit bookings."
      );
      return;
    }

    if (isAdmin) {
      setBookingError(
        "Admins cannot submit customer booking requests."
      );
      return;
    }

    if (!isCustomer) {
      setBookingError(
        "Only customers can submit booking requests."
      );
      return;
    }

    if (isOwnService) {
      setBookingError(
        "You cannot book your own service."
      );
      return;
    }

    if (!isAvailable) {
      setBookingError(
        "This service is currently unavailable."
      );
      return;
    }

    if (!eventDate || !eventLocation.trim()) {
      setBookingError(
        "Please provide your event date and location."
      );
      return;
    }

    try {
      setBookingLoading(true);


      const result = await createBooking({
        customerId: session?.user?.id,
        serviceId,
        eventDate,
        eventLocation,
        message,
      });

      toast.success(
        result.message ||
          "Booking request submitted successfully!"
      );

      router.push('/dashboard/customer/bookings');

      setBookingSuccess(
        "Your booking request has been submitted successfully!"
      );

      setEventDate("");
      setEventLocation("");
      setMessage("");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong.";

      setBookingError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  // Loading State
  if (loading || sessionLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fffaf7]">
        <div className="text-center">
          <Loader2
            className="mx-auto animate-spin text-[#f45b4f]"
            size={38}
          />

          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading service details...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !service) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fffaf7] px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#f1e8e3] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <XCircle size={32} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#302521]">
            Service Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error || "The requested service could not be found."}
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#f45b4f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#df493f]"
          >
            <ArrowLeft size={17} />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Breadcrumb */}
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#f45b4f]"
          >
            <ArrowLeft size={17} />
            Back to Browse Services
          </Link>
        </div>

        {/* Main Layout */}
        <section className="grid grid-cols-1 items-start gap-7 lg:grid-cols-3">

          {/* Left Content */}
          <div className="space-y-5 lg:col-span-2">

            {/* Image Gallery */}
            <div className="overflow-hidden rounded-2xl border border-[#f1e8e3] bg-white p-2 shadow-sm">

              {/* Main Image */}
              <div className="group relative h-[280px] overflow-hidden rounded-xl bg-[#fff1ee] sm:h-[380px] lg:h-[420px]">

                {images.length > 0 ? (
                  <img
                    key={images[selectedImage]}
                    src={images[selectedImage]}
                    alt={service.serviceName}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    onError={() =>
                      console.error(
                        "Image failed to load:",
                        images[selectedImage]
                      )
                    }
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
                    <Store size={42} />
                    <p className="text-sm">
                      No service image available
                    </p>
                  </div>
                )}

                {/* Top Badges */}
                <div className="absolute inset-x-0 top-0 flex flex-wrap items-center justify-between gap-2 p-4">
                  <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#302521] shadow-sm">
                    {service.category}
                  </span>

                  {isAvailable && (
                    <span className="flex items-center gap-1 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-green-600 shadow-sm">
                      <CheckCircle2 size={13} />
                      Available
                    </span>
                  )}
                </div>

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={() =>
                        setSelectedImage(
                          (selectedImage - 1 + images.length) %
                            images.length
                        )
                      }
                      className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#302521] shadow-md transition hover:bg-[#f45b4f] hover:text-white"
                    >
                      <ArrowLeft size={19} />
                    </button>

                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={() =>
                        setSelectedImage(
                          (selectedImage + 1) % images.length
                        )
                      }
                      className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#302521] shadow-md transition hover:bg-[#f45b4f] hover:text-white"
                    >
                      <ArrowRight size={19} />
                    </button>

                    <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-4 py-2 text-xs font-medium text-white">
                      {selectedImage + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`h-20 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        selectedImage === index
                          ? "border-[#f45b4f]"
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

            {/* Service Information */}
            <div className="rounded-2xl border border-[#f1e8e3] bg-white p-5 shadow-sm sm:p-6">

              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold leading-tight text-[#302521] sm:text-3xl">
                  {service.serviceName}
                </h1>

                <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin
                    size={17}
                    className="text-[#f45b4f]"
                  />
                  {service.location}
                </p>
              </div>

              {/* Price */}
              <div className="mt-5 inline-block rounded-xl bg-[#fff1ee] px-5 py-3">
                <p className="text-xs font-medium text-gray-500">
                  Starting Price
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#f45b4f]">
                  {typeof service.price === "number"
                    ? `$${service.price.toLocaleString()}`
                    : service.price}
                </h2>
              </div>

              <div className="my-5 border-t border-[#f1e8e3]" />

              {/* Description */}
              <div>
                <h2 className="text-lg font-bold text-[#302521]">
                  About This Service
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {service.description}
                </p>
              </div>

              {/* Service Details */}
              <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#f1e8e3] pt-5 sm:grid-cols-2">

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#fff1ee] p-3 text-[#f45b4f]">
                    <Store size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Category
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#302521]">
                      {service.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#fff1ee] p-3 text-[#f45b4f]">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Location
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#302521]">
                      {service.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#fff1ee] p-3 text-[#f45b4f]">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Booking
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#302521]">
                      {isAvailable ? "Open for Booking" : "Unavailable"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#fff1ee] p-3 text-[#f45b4f]">
                    <Clock size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Service Status
                    </p>
                    <p className="mt-1 text-sm font-semibold capitalize text-[#302521]">
                      {normalizedStatus}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              <div className="mt-6 border-t border-[#f1e8e3] pt-5">
                <h2 className="text-lg font-bold text-[#302521]">
                  Vendor Information
                </h2>

                <div className="mt-4 flex items-center gap-4 rounded-xl border border-[#f1e8e3] bg-[#fffaf7] p-4">

                  <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#fff1ee] text-[#f45b4f]">
                    {service.vendor?.image ? (
                      <img
                        src={service.vendor.image}
                        alt={vendorName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound size={27} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-[#302521]">
                      {vendorName}
                    </h3>

                    {service.vendor?.email && (
                      <p className="mt-1 truncate text-sm text-gray-500">
                        {service.vendor.email}
                      </p>
                    )}

                    <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                      <ShieldCheck size={14} />
                      Verified Service Provider
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Booking Card */}
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-[#f1e8e3] bg-white p-5 shadow-sm sm:p-6">

              {/* Price */}
              <p className="text-sm font-medium text-gray-500">
                Service Price
              </p>

              <h2 className="mt-1 text-3xl font-bold text-[#f45b4f]">
                {typeof service.price === "number"
                  ? `$${service.price.toLocaleString()}`
                  : service.price}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Contact vendor for final pricing details.
              </p>

              <div className="my-5 border-t border-[#f1e8e3]" />

              {/* Availability */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <MapPin
                    size={17}
                    className="text-[#f45b4f]"
                  />
                  {service.location}
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={17}
                    className={
                      isAvailable
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  />
                  {isAvailable
                    ? "Available for booking"
                    : "Not available"}
                </div>
              </div>

              <div className="my-5 border-t border-[#f1e8e3]" />

              {/* Booking Heading */}
              <h3 className="text-xl font-bold text-[#302521]">
                Request a Booking
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Reserve this vendor for your wedding date and share your celebration details.
              </p>

              {/* Guest User */}
              {!user && (
                <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                  Please sign in as a customer to submit a booking request.

                  <Link
                    href="/signin"
                    className="mt-2 block font-bold underline"
                  >
                    Sign In Now
                  </Link>
                </div>
              )}

              {/* Non Customer */}
              {user && !isCustomer && (
                <div className="mt-5 rounded-xl bg-orange-50 p-4 text-sm text-orange-700">
                  {isAdmin
                    ? "Admins cannot submit customer booking requests."
                    : isOwnService
                      ? "You cannot book your own service."
                      : "Only customer accounts can submit booking requests."}
                </div>
              )}

              {/* Blocked User */}
              {isBlocked && user && (
                <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                  Your account is blocked. Booking is unavailable.
                </div>
              )}

              {/* Unavailable Service */}
              {!isAvailable && (
                <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
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
                    className="mt-5 space-y-4"
                  >

                    {/* Event Date */}
                    <div>
                      <label
                        htmlFor="eventDate"
                        className="mb-2 block text-sm font-semibold text-[#302521]"
                      >
                        Event Date
                      </label>

                      <input
                        id="eventDate"
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={eventDate}
                        onChange={(e) =>
                          setEventDate(e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#f45b4f] focus:ring-2 focus:ring-[#f45b4f]/10"
                      />
                    </div>

                    {/* Event Location */}
                    <div>
                      <label
                        htmlFor="eventLocation"
                        className="mb-2 block text-sm font-semibold text-[#302521]"
                      >
                        Event Location / Venue
                      </label>

                      <input
                        id="eventLocation"
                        type="text"
                        required
                        placeholder="Enter your event location"
                        value={eventLocation}
                        onChange={(e) =>
                          setEventLocation(e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#f45b4f] focus:ring-2 focus:ring-[#f45b4f]/10"
                      />
                    </div>

                    {/* Additional Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-semibold text-[#302521]"
                      >
                        Additional Message (Optional)
                      </label>

                      <textarea
                        id="message"
                        rows={4}
                        placeholder="Tell the vendor about your requirements..."
                        value={message}
                        onChange={(e) =>
                          setMessage(e.target.value)
                        }
                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#f45b4f] focus:ring-2 focus:ring-[#f45b4f]/10"
                      />
                    </div>

                    {/* Booking Error */}
                    {bookingError && (
                      <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                        {bookingError}
                      </div>
                    )}

                    {/* Booking Success */}
                    {bookingSuccess && (
                      <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
                        {bookingSuccess}

                        <Link
                          href="/dashboard/customer/bookings"
                          className="mt-2 block font-semibold underline"
                        >
                          View My Bookings
                        </Link>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f45b4f] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#df493f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {bookingLoading ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CalendarDays size={18} />
                          Send Booking Request
                        </>
                      )}
                    </button>

                    <p className="flex items-center justify-center gap-1 text-center text-xs text-gray-400">
                      <ShieldCheck size={14} />
                      Your booking request will be sent securely.
                    </p>
                  </form>
                )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
