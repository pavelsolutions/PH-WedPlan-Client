
"use client";

import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  CalendarDays,
  MapPin,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  ClipboardList,
  Mail,
  User,
  BriefcaseBusiness,
  MessageSquare,
  Filter,
  X,
  Loader2,
} from "lucide-react";

import {
  getVendorBookings,
} from "@/lib/api/bookings";
import { updateVendorBookingStatus } from "@/lib/actions/bookings";

type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Rejected"
  | "Cancelled"
  | "Completed";

interface VendorBooking {
  _id: string;
  customerId: string;
  serviceId: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: BookingStatus | string;
  createdAt: string;

  customer?: {
    _id?: string;
    name?: string;
    email?: string;
    image?: string;
  };

  service?: {
    _id?: string;
    name?: string;
    serviceName?: string;
    image?: string;
    category?: string;
    price?: number;
  };
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
};

const normalizeStatus = (status: string) =>
  status?.toLowerCase().trim() || "pending";

const formatDate = (date: string) => {
  if (!date) return "Not specified";

  // Avoid timezone shifting for YYYY-MM-DD values.
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T00:00:00`)
    : new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatDateTime = (date: string) => {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not available";

  return parsed.toLocaleString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function VendorBookingsPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const vendorId = session?.user?.id;

  const [bookings, setBookings] = useState<VendorBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedBooking, setSelectedBooking] =
    useState<VendorBooking | null>(null);

  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch vendor bookings
  const fetchBookings = async (showLoader = true) => {
    if (!vendorId) return;

    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const data = await getVendorBookings(vendorId);

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Vendor bookings error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to load bookings";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (sessionLoading) return;

    if (!vendorId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    fetchBookings();
  }, [vendorId, sessionLoading]);

  // Accept or reject booking
  const handleBookingAction = async (
    booking: VendorBooking,
    status: "Confirmed" | "Rejected"
  ) => {
    if (!vendorId) {
      toast.error("Please login as a vendor.");
      return;
    }

    if (normalizeStatus(booking.status) !== "pending") {
      toast.error("This booking has already been processed.");
      return;
    }

    const action = status === "Confirmed" ? "accept" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this booking request?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(booking._id);

      const response = await updateVendorBookingStatus(
        vendorId,
        booking._id,
        status
      );

      // Update booking without reloading the page
      setBookings((previous) =>
        previous.map((item) =>
          item._id === booking._id
            ? { ...item, status }
            : item
        )
      );

      // Update selected modal booking too
      setSelectedBooking((previous) =>
        previous?._id === booking._id
          ? { ...previous, status }
          : previous
      );

      toast.success(
        response.message ||
          `Booking ${action}ed successfully`
      );
    } catch (err) {
      console.error("Booking action error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to update booking";

      toast.error(message);

      // Refresh in case another request processed this booking
      await fetchBookings(false);
    } finally {
      setProcessingId(null);
    }
  };

  // Statistics
  const stats = useMemo(() => {
    return {
      total: bookings.length,

      pending: bookings.filter(
        (b) => normalizeStatus(b.status) === "pending"
      ).length,

      confirmed: bookings.filter(
        (b) => normalizeStatus(b.status) === "confirmed"
      ).length,

      rejected: bookings.filter(
        (b) => normalizeStatus(b.status) === "rejected"
      ).length,
    };
  }, [bookings]);

  // Search and filter
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const customerName = booking.customer?.name || "";

      const serviceName =
        booking.service?.serviceName ||
        booking.service?.name ||
        "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        customerName.toLowerCase().includes(searchText) ||
        (booking.customer?.email || "")
          .toLowerCase()
          .includes(searchText) ||
        serviceName.toLowerCase().includes(searchText) ||
        (booking.eventLocation || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        normalizeStatus(booking.status) ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  // Loading
  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-[#fcfaf9] p-5 sm:p-8">
        <div className="mx-auto max-w-[1500px] space-y-5">
          <div className="h-16 animate-pulse rounded-xl bg-[#eee5e1]" />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-[#eee5e1]"
              />
            ))}
          </div>

          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-2xl bg-[#eee5e1]"
            />
          ))}
        </div>
      </div>
    );
  }

  // Login required
  if (!vendorId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fcfaf9] p-6">
        <div className="rounded-2xl border border-[#eadfd9] bg-white p-8 text-center">
          <BriefcaseBusiness
            size={38}
            className="mx-auto text-[#dc2027]"
          />

          <h2 className="mt-4 text-xl font-bold text-[#421b24]">
            Login Required
          </h2>

          <p className="mt-2 text-sm text-[#8b7478]">
            Please login to view your booking requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf9]">
      <div className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-7 lg:p-8">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#e9dfda] pb-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#421b24]">
              Booking Requests
            </h1>

            <p className="mt-2 text-sm text-[#8b7478]">
              Manage customer booking requests for your wedding services.
            </p>
          </div>

          <button
            onClick={() => fetchBookings(false)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eadfd9] bg-white px-4 py-2.5 text-sm font-semibold text-[#421b24] hover:bg-[#faf4f1] disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>

            <button
              onClick={() => fetchBookings()}
              className="font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <StatCard
            icon={<ClipboardList size={22} />}
            label="Total Bookings"
            value={stats.total}
            subtitle="All requests"
            color="burgundy"
          />

          <StatCard
            icon={<Clock size={22} />}
            label="Pending Requests"
            value={stats.pending}
            subtitle="Waiting for action"
            color="amber"
          />

          <StatCard
            icon={<CheckCircle2 size={22} />}
            label="Confirmed Bookings"
            value={stats.confirmed}
            subtitle="Accepted requests"
            color="green"
          />

          <StatCard
            icon={<XCircle size={22} />}
            label="Rejected Requests"
            value={stats.rejected}
            subtitle="Declined requests"
            color="red"
          />
        </div>

        {/* Search and Filters */}
        <div className="rounded-2xl border border-[#eadfd9] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-md">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ad9699]"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer or service..."
                className="w-full rounded-xl border border-[#eadfd9] bg-[#fcfaf9] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#dc2027]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Filter size={16} className="text-[#987f83]" />

              {[
                "All",
                "Pending",
                "Confirmed",
                "Rejected",
                "Cancelled",
                "Completed",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    statusFilter === status
                      ? "bg-[#dc2027] text-white"
                      : "bg-[#f8f2ef] text-[#8b7478] hover:bg-[#eee5e1]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="font-serif text-xl font-bold text-[#421b24]">
            Customer Requests
          </h2>

          <p className="mt-1 text-xs text-[#a18c90]">
            Showing {filteredBookings.length} of {bookings.length} requests
          </p>
        </div>

        {/* Booking List */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => {
              const status = normalizeStatus(booking.status);

              const isPending = status === "pending";

              const isProcessing = processingId === booking._id;

              const customerName =
                booking.customer?.name || "Unknown Customer";

              const serviceName =
                booking.service?.serviceName ||
                booking.service?.name ||
                "Wedding Service";

              return (
                <div
                  key={booking._id}
                  className="rounded-2xl border border-[#e9ded8] bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                    {/* Customer */}
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#f8f0ed]">
                        {booking.customer?.image ? (
                          <img
                            src={booking.customer.image}
                            alt={customerName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#dc2027]">
                            <User size={25} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-[#421b24]">
                          {customerName}
                        </h3>

                        <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#987f83]">
                          <Mail size={12} />
                          {booking.customer?.email || "No email"}
                        </p>

                        <p className="mt-1 text-xs text-[#b19b9f]">
                          Request #{booking._id.slice(-7)}
                        </p>
                      </div>
                    </div>

                    {/* Service */}
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f8f0ed]">
                        {booking.service?.image ? (
                          <img
                            src={booking.service.image}
                            alt={serviceName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#dc2027]">
                            <BriefcaseBusiness size={23} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold text-[#421b24]">
                          {serviceName}
                        </h4>

                        <p className="mt-1 text-xs text-[#987f83]">
                          {booking.service?.category || "Wedding Service"}
                        </p>

                        {booking.service?.price != null && (
                          <p className="mt-1 text-xs font-semibold text-[#dc2027]">
                            ৳{booking.service.price.toLocaleString("en-BD")}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs text-[#735b60]">
                        <CalendarDays
                          size={15}
                          className="shrink-0 text-[#dc2027]"
                        />
                        {formatDate(booking.eventDate)}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#735b60]">
                        <MapPin
                          size={15}
                          className="shrink-0 text-[#dc2027]"
                        />

                        <span className="truncate">
                          {booking.eventLocation || "Location not specified"}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 lg:flex-col lg:items-end">
                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${
                          statusStyles[status] ||
                          "border-gray-200 bg-gray-50 text-gray-600"
                        }`}
                      >
                        {status}
                      </span>

                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#eadfd9] px-4 py-2.5 text-xs font-semibold text-[#dc2027] transition hover:bg-[#faf4f1]"
                      >
                        <Eye size={15} />
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Customer Message */}
                  {booking.message && (
                    <div className="mt-5 rounded-xl bg-[#fcfaf9] p-3">
                      <p className="line-clamp-2 text-xs leading-6 text-[#8b7478]">
                        <MessageSquare
                          size={13}
                          className="mr-2 inline text-[#dc2027]"
                        />
                        {booking.message}
                      </p>
                    </div>
                  )}

                  {/* Accept / Reject Actions */}
                  {isPending && (
                    <div className="mt-5 flex flex-col gap-3 border-t border-[#f0e8e4] pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-[#987f83]">
                        This request is waiting for your response.
                      </p>

                      <div className="flex gap-3">
                        <button
                          disabled={isProcessing}
                          onClick={() =>
                            handleBookingAction(booking, "Rejected")
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                        >
                          {isProcessing ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <XCircle size={16} />
                          )}
                          Reject
                        </button>

                        <button
                          disabled={isProcessing}
                          onClick={() =>
                            handleBookingAction(booking, "Confirmed")
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#dc2027] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#761d2e] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                        >
                          {isProcessing ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                          Accept
                        </button>
                      </div>
                    </div>
                  )}

                  {!isPending && (
                    <div className="mt-5 flex items-center gap-2 border-t border-[#f0e8e4] pt-4 text-xs text-[#987f83]">
                      <CheckCircle2 size={14} />
                      This request has already been processed. No further action is available.
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-[#e9ded8] bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8f0ed] text-[#dc2027]">
                <CalendarDays size={28} />
              </div>

              <h3 className="mt-4 font-serif text-xl font-bold text-[#421b24]">
                {bookings.length === 0
                  ? "No Booking Requests Yet"
                  : "No Bookings Found"}
              </h3>

              <p className="mt-2 text-sm text-[#8b7478]">
                {bookings.length === 0
                  ? "Customer booking requests will appear here when someone books your services."
                  : "Try changing your search or status filter."}
              </p>

              {bookings.length > 0 && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="mt-4 text-sm font-semibold text-[#dc2027]"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#eadfd9] bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eee5e1] pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#421b24]">
                  Booking Details
                </h2>

                <p className="mt-1 text-xs text-[#987f83]">
                  Request #{selectedBooking._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-full p-2 text-[#8b7478] hover:bg-[#f8f2ef]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer Information */}
            <div className="mt-5">
              <h3 className="mb-3 text-sm font-bold text-[#421b24]">
                Customer Information
              </h3>

              <div className="flex items-center gap-3 rounded-xl bg-[#fcfaf9] p-4">
                {selectedBooking.customer?.image ? (
                  <img
                    src={selectedBooking.customer.image}
                    alt="Customer"
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f0ed] text-[#dc2027]">
                    <User size={25} />
                  </div>
                )}

                <div>
                  <p className="font-semibold text-[#421b24]">
                    {selectedBooking.customer?.name || "Unknown Customer"}
                  </p>

                  <p className="mt-1 text-sm text-[#8b7478]">
                    {selectedBooking.customer?.email || "No email"}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="mt-5">
              <h3 className="mb-3 text-sm font-bold text-[#421b24]">
                Service Information
              </h3>

              <div className="flex items-center gap-3 rounded-xl bg-[#fcfaf9] p-4">
                {selectedBooking.service?.image ? (
                  <img
                    src={selectedBooking.service.image}
                    alt="Service"
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#f8f0ed] text-[#dc2027]">
                    <BriefcaseBusiness size={25} />
                  </div>
                )}

                <div>
                  <p className="font-semibold text-[#421b24]">
                    {selectedBooking.service?.serviceName ||
                      selectedBooking.service?.name ||
                      "Wedding Service"}
                  </p>

                  <p className="mt-1 text-xs text-[#8b7478]">
                    {selectedBooking.service?.category || ""}
                  </p>

                  {selectedBooking.service?.price != null && (
                    <p className="mt-1 text-sm font-semibold text-[#dc2027]">
                      ৳{selectedBooking.service.price.toLocaleString("en-BD")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Event Information */}
            <div className="mt-5">
              <h3 className="mb-3 text-sm font-bold text-[#421b24]">
                Event Information
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoBox
                  label="Event Date"
                  value={formatDate(selectedBooking.eventDate)}
                  icon={<CalendarDays size={16} />}
                />

                <InfoBox
                  label="Event Location"
                  value={selectedBooking.eventLocation || "Not specified"}
                  icon={<MapPin size={16} />}
                />

                <div className="rounded-xl bg-[#fcfaf9] p-4">
                  <p className="text-xs text-[#987f83]">
                    Request Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                      statusStyles[
                        normalizeStatus(selectedBooking.status)
                      ] || ""
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>

                <InfoBox
                  label="Request Submitted"
                  value={formatDateTime(selectedBooking.createdAt)}
                  icon={<Clock size={16} />}
                />
              </div>
            </div>

            {/* Customer Message */}
            <div className="mt-5">
              <h3 className="mb-3 text-sm font-bold text-[#421b24]">
                Customer Message
              </h3>

              <div className="rounded-xl bg-[#fcfaf9] p-4 text-sm leading-7 text-[#735b60]">
                {selectedBooking.message ||
                  "No additional message provided."}
              </div>
            </div>

            {/* Modal Actions */}
            {normalizeStatus(selectedBooking.status) === "pending" && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  disabled={processingId === selectedBooking._id}
                  onClick={() =>
                    handleBookingAction(selectedBooking, "Rejected")
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <XCircle size={16} />
                  Reject
                </button>

                <button
                  disabled={processingId === selectedBooking._id}
                  onClick={() =>
                    handleBookingAction(selectedBooking, "Confirmed")
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#dc2027] py-3 text-sm font-semibold text-white hover:bg-[#761d2e] disabled:opacity-50"
                >
                  <CheckCircle2 size={16} />
                  Accept
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-3 w-full rounded-xl border border-[#eadfd9] py-3 text-sm font-semibold text-[#421b24] hover:bg-[#faf4f1]"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Statistics Card
function StatCard({
  icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  subtitle: string;
  color: "burgundy" | "amber" | "green" | "red";
}) {
  const styles = {
    burgundy: "bg-[#f8f0ed] text-[#dc2027]",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles[color]}`}
        >
          {icon}
        </div>

        <span className="text-xs text-[#a18c90]">{subtitle}</span>
      </div>

      <h3 className="mt-4 text-3xl font-bold text-[#421b24]">
        {value}
      </h3>

      <p className="mt-1 text-sm text-[#8b7478]">{label}</p>
    </div>
  );
}

// Information Box
function InfoBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-[#fcfaf9] p-4">
      <p className="text-xs text-[#987f83]">{label}</p>

      <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#421b24]">
        <span className="shrink-0 text-[#dc2027]">{icon}</span>
        {value}
      </p>
    </div>
  );
}
