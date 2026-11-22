
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  CalendarDays,
  MapPin,
  Clock,
  Eye,
  XCircle,
  Loader2,
  PackageOpen,
  RefreshCw,
  X,
  User,
  Mail,
  MessageSquare,
  Tag,
  Hash,
} from "lucide-react";

import { toast } from "sonner";

import {
  cancelMyBooking,
  getMyBookings,
} from "@/lib/actions/bookings";

import { authClient } from "@/lib/auth-client";

// Types
type Booking = {
  _id: string;
  customerId: string;
  serviceId: string;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: string;
  createdAt: string;

  service?: {
    serviceName: string;
    image: string;
    category?: string;
    price?: number;
  };

  vendor?: {
    name: string;
    email: string;
    image?: string;
  };
};

// Status style
const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "accepted":
    case "confirmed":
      return "bg-green-50 text-green-700 border-green-200";

    case "rejected":
      return "bg-red-50 text-red-600 border-red-200";

    case "cancelled":
      return "bg-gray-100 text-gray-600 border-gray-200";

    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

// Date formatter
const formatDate = (date: string) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Modal states
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [cancelBooking, setCancelBooking] =
    useState<Booking | null>(null);

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();

  const customerId = session?.user?.id;

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    if (isPending) return;

    if (!customerId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getMyBookings(customerId);

      setBookings(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  }, [customerId, isPending]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Confirm cancel booking
  const handleCancel = async () => {
    if (!customerId || !cancelBooking) {
      toast.error("Please login first");
      return;
    }

    try {
      setCancellingId(cancelBooking._id);

      await cancelMyBooking(customerId, cancelBooking._id);

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === cancelBooking._id
            ? {
                ...booking,
                status: "Cancelled",
              }
            : booking
        )
      );

      toast.success("Booking cancelled successfully");

      setCancelBooking(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to cancel booking"
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Statistics
  const pendingCount = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "pending"
  ).length;

 const acceptedCount = bookings.filter(
  (booking) =>
    ["accepted", "confirmed"].includes(
      booking.status?.toLowerCase().trim()
    )
).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "cancelled"
  ).length;

  // Loading
  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fffaf7]">
        <Loader2 className="h-8 w-8 animate-spin text-[#f45b4f]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#eadbd4] pb-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-[#f45b4f]">
              Customer Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#302521] sm:text-3xl">
              My Bookings
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              View all your submitted booking requests and manage them.
            </p>
          </div>

          <button
            onClick={fetchBookings}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#eadbd4] bg-white px-4 py-2.5 text-sm font-medium text-[#302521] transition hover:bg-[#fff1ec]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#eadbd4] bg-white p-5">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <h2 className="mt-2 text-3xl font-bold text-[#302521]">
              {bookings.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#eadbd4] bg-white p-5">
            <p className="text-sm text-gray-500">Pending Requests</p>
            <h2 className="mt-2 text-3xl font-bold text-amber-600">
              {pendingCount}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#eadbd4] bg-white p-5">
            <p className="text-sm text-gray-500">Accepted Bookings</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {acceptedCount}
            </h2>
          </div>
        </div>

        {/* Booking List */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#302521]">
              All Booking Requests
            </h2>

            <span className="text-sm text-gray-500">
              {bookings.length} bookings
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-[#eadbd4] bg-white px-6 py-16 text-center">
              <PackageOpen className="mx-auto h-12 w-12 text-[#f4b2a8]" />

              <h3 className="mt-4 text-lg font-semibold text-[#302521]">
                No bookings yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                You have not submitted any booking requests.
              </p>

              <Link
                href="/services"
                className="mt-6 inline-block rounded-xl bg-[#f45b4f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e84b40]"
              >
                Explore Services
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="overflow-hidden rounded-xl border border-[#eadbd4] bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">

                    {/* Service Image */}
                    <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-[#fff1ec] sm:h-24 sm:w-28">
                      {booking.service?.image ? (
                        <Image
                          src={booking.service.image}
                          alt={booking.service.serviceName || "Service"}
                          fill
                          unoptimized
                          sizes="112px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <PackageOpen className="h-8 w-8 text-[#e6b8aa]" />
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[#302521] sm:text-lg">
                          {booking.service?.serviceName || "Service unavailable"}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500">
                        Vendor:{" "}
                        <span className="font-medium text-[#80645c]">
                          {booking.vendor?.name || "Vendor unavailable"}
                        </span>

                        {booking.service?.price != null && (
                          <>
                            {" "}• ${Number(booking.service.price).toLocaleString()}
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-[#b84b48]" />
                          <span>Event: {formatDate(booking.eventDate)}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#b84b48]" />
                          <span>{booking.eventLocation}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-[#b84b48]" />
                          <span>
                            Requested: {formatDate(booking.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#eadbd4] bg-[#fffdfb] px-3 py-2 text-xs font-medium text-[#302521] transition hover:bg-[#fff1ec]"
                      >
                        <Eye size={14} />
                        Details
                      </button>

                      {booking.status?.toLowerCase() === "pending" && (
                        <button
                          onClick={() => setCancelBooking(booking)}
                          className="flex items-center gap-1.5 rounded-lg bg-[#dc2626] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#b91c1c]"
                        >
                          <XCircle size={14} />
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================
          BOOKING DETAILS MODAL
      ========================== */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#eadbd4] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadbd4] bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#302521]">
                  Booking Details
                </h2>
                <p className="text-xs text-gray-500">
                  View your booking information
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-full p-2 text-gray-500 transition hover:bg-[#fff1ec] hover:text-[#f45b4f]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden rounded-xl bg-[#fff1ec]">
                {selectedBooking.service?.image ? (
                  <Image
                    src={selectedBooking.service.image}
                    alt={selectedBooking.service.serviceName || "Service"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <PackageOpen className="h-12 w-12 text-[#e6b8aa]" />
                  </div>
                )}
              </div>

              {/* Service Name and Status */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-[#302521]">
                  {selectedBooking.service?.serviceName || "Service unavailable"}
                </h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    selectedBooking.status
                  )}`}
                >
                  {selectedBooking.status}
                </span>
              </div>

              {/* Information */}
              <div className="space-y-3">
                <DetailRow
                  icon={<Hash size={16} />}
                  label="Booking ID"
                  value={selectedBooking._id}
                />

                <DetailRow
                  icon={<Tag size={16} />}
                  label="Category"
                  value={selectedBooking.service?.category || "N/A"}
                />

                <DetailRow
                  icon={<CalendarDays size={16} />}
                  label="Event Date"
                  value={formatDate(selectedBooking.eventDate)}
                />

                <DetailRow
                  icon={<MapPin size={16} />}
                  label="Event Location"
                  value={selectedBooking.eventLocation || "N/A"}
                />

                <DetailRow
                  icon={<Clock size={16} />}
                  label="Requested Date"
                  value={formatDate(selectedBooking.createdAt)}
                />

                <DetailRow
                  icon={<User size={16} />}
                  label="Vendor"
                  value={selectedBooking.vendor?.name || "Vendor unavailable"}
                />

                <DetailRow
                  icon={<Mail size={16} />}
                  label="Vendor Email"
                  value={selectedBooking.vendor?.email || "N/A"}
                />

                <DetailRow
                  icon={<Tag size={16} />}
                  label="Price"
                  value={
                    selectedBooking.service?.price != null
                      ? `$${Number(selectedBooking.service.price).toLocaleString()}`
                      : "N/A"
                  }
                />
              </div>

              {/* Message */}
              <div className="rounded-xl border border-[#eadbd4] bg-[#fffaf7] p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#302521]">
                  <MessageSquare size={16} className="text-[#f45b4f]" />
                  Your Message
                </div>

                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                  {selectedBooking.message || "No message provided."}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-xl bg-[#f45b4f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e84b40]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          CANCEL CONFIRMATION MODAL
      ========================== */}
      {cancelBooking && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!cancellingId) setCancelBooking(null);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[#eadbd4] bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-7 w-7 text-red-500" />
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-lg font-bold text-[#302521]">
                Cancel Booking?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Are you sure you want to cancel your booking for{" "}
                <span className="font-semibold text-[#302521]">
                  {cancelBooking.service?.serviceName || "this service"}
                </span>
                ? This action will update your booking status.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setCancelBooking(null)}
                disabled={!!cancellingId}
                className="flex-1 rounded-xl border border-[#eadbd4] bg-white px-4 py-2.5 text-sm font-semibold text-[#302521] transition hover:bg-[#fff1ec] disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                onClick={handleCancel}
                disabled={!!cancellingId}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancellingId === cancelBooking._id ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable detail row
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[#f1e5df] pb-3 last:border-0">
      <div className="mt-0.5 text-[#f45b4f]">{icon}</div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-[#302521]">
          {value}
        </p>
      </div>
    </div>
  );
}
