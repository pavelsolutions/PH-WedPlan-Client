
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
  BriefcaseBusiness,
  MessageSquare,
  X,
  Loader2,
  Filter,
  CalendarCheck,
  TrendingUp,
  Phone,
  ChevronRight,
  ClipboardList,
  Mail,
  AlertTriangle,
} from "lucide-react";

// ================= TYPES =================

type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Rejected"
  | "Cancelled";

type FilterStatus = "All" | BookingStatus;

interface Booking {
  _id: string;

  customer?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    image?: string;
  };

  service?: {
    _id?: string;
    name?: string;
    image?: string;
    price?: number;
  };

  eventDate?: string;
  eventLocation?: string;
  message?: string;
  status: BookingStatus;
  createdAt?: string;
}

// ================= API =================

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL

// ================= HELPERS =================

const getStatus = (status?: string): BookingStatus => {
  switch (status?.toLowerCase()) {
    case "confirmed":
    case "accepted":
      return "Confirmed";

    case "rejected":
      return "Rejected";

    case "cancelled":
      return "Cancelled";

    default:
      return "Pending";
  }
};

const formatDate = (date?: string) => {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not specified";
  }

  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name?: string) => {
  if (!name) return "U";

  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

// ================= MAIN COMPONENT =================

export default function VendorBookingsPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const vendorId = session?.user?.id;

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<FilterStatus>("All");

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(
    null
  );

  // Confirmation modal state

  const [confirmAction, setConfirmAction] = useState<{
    booking: Booking;
    status: "Confirmed" | "Rejected";
  } | null>(null);

  // ================= FETCH BOOKINGS =================

  const fetchBookings = async (refresh = false) => {
    if (!vendorId) return;

    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        `${API_URL}/vendor/bookings/${vendorId}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const result = await response.json();

      const bookingData =
        result?.data?.data ??
        result?.data ??
        result?.bookings ??
        [];

      if (!Array.isArray(bookingData)) {
        throw new Error("Invalid booking response");
      }

      setBookings(
        bookingData.map((booking: Booking) => ({
          ...booking,
          status: getStatus(booking.status),
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Unable to load bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (sessionLoading) return;

    if (!vendorId) {
      setLoading(false);
      return;
    }

    fetchBookings();
  }, [vendorId, sessionLoading]);

  // ================= UPDATE STATUS =================

  const updateBookingStatus = async (
    booking: Booking,
    status: "Confirmed" | "Rejected"
  ) => {
    if (booking.status !== "Pending") {
      toast.error("This booking has already been processed");
      return false;
    }

    try {
      setUpdatingId(booking._id);

      const response = await fetch(
        `${API_URL}/vendor/bookings/${vendorId}/${booking._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to update booking"
        );
      }

      // Update booking list

      setBookings((previous) =>
        previous.map((item) =>
          item._id === booking._id
            ? { ...item, status }
            : item
        )
      );

      // Update details modal

      setSelectedBooking((previous) =>
        previous?._id === booking._id
          ? { ...previous, status }
          : previous
      );

      toast.success(
        status === "Confirmed"
          ? "Booking accepted successfully!"
          : "Booking rejected successfully!"
      );

      return true;
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );

      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  // ================= CONFIRM ACTION =================

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    const success = await updateBookingStatus(
      confirmAction.booking,
      confirmAction.status
    );

    if (success) {
      setConfirmAction(null);
    }
  };

  // ================= STATISTICS =================

  const stats = useMemo(() => {
    return {
      total: bookings.length,

      pending: bookings.filter(
        (b) => b.status === "Pending"
      ).length,

      confirmed: bookings.filter(
        (b) => b.status === "Confirmed"
      ).length,

      rejected: bookings.filter(
        (b) => b.status === "Rejected"
      ).length,
    };
  }, [bookings]);

  // ================= FILTER =================

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const keyword = search.toLowerCase();

      const customerName =
        booking.customer?.name?.toLowerCase() || "";

      const serviceName =
        booking.service?.name?.toLowerCase() || "";

      const location =
        booking.eventLocation?.toLowerCase() || "";

      const matchesSearch =
        customerName.includes(keyword) ||
        serviceName.includes(keyword) ||
        location.includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  // ================= STATUS BADGE =================

  const StatusBadge = ({
    status,
  }: {
    status: BookingStatus;
  }) => {
    const styles: Record<BookingStatus, string> = {
      Pending:
        "bg-amber-50 text-amber-700 border-amber-200",

      Confirmed:
        "bg-emerald-50 text-emerald-700 border-emerald-200",

      Rejected:
        "bg-red-50 text-red-600 border-red-200",

      Cancelled:
        "bg-gray-100 text-gray-600 border-gray-200",
    };

    const icons = {
      Pending: <Clock size={12} />,
      Confirmed: <CheckCircle2 size={12} />,
      Rejected: <XCircle size={12} />,
      Cancelled: <XCircle size={12} />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}
      >
        {icons[status]}
        {status}
      </span>
    );
  };

  // ================= LOADING =================

  if (sessionLoading || loading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#f45b4f]" />
          <p className="text-sm text-gray-500">
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================

  return (
    <div className="min-h-screen bg-[#fffaf7] p-3 sm:p-5 lg:p-6">

      <div className="mx-auto max-w-[1450px] space-y-5">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-[#f45b4f]">
              <span>Dashboard</span>
              <ChevronRight size={13} />
              <span>Bookings</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Booking Requests
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and track your customer bookings.
            </p>
          </div>

          <button
            onClick={() => fetchBookings(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#f45b4f] hover:text-[#f45b4f] disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

        </div>

        {/* STATISTICS */}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-[#f45b4f]">
              <ClipboardList size={18} />
            </div>

            <p className="mt-3 text-2xl font-bold text-gray-900">
              {stats.total}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              Total Bookings
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock size={18} />
            </div>

            <p className="mt-3 text-2xl font-bold text-gray-900">
              {stats.pending}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              Pending Requests
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={18} />
            </div>

            <p className="mt-3 text-2xl font-bold text-gray-900">
              {stats.confirmed}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              Confirmed
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <XCircle size={18} />
            </div>

            <p className="mt-3 text-2xl font-bold text-gray-900">
              {stats.rejected}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              Rejected
            </p>
          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="border-b border-gray-100 p-4">

            <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  All Bookings
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  View and manage your booking requests
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">

                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm outline-none transition focus:border-[#f45b4f] focus:bg-white sm:w-60"
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as FilterStatus
                      )
                    }
                    className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-8 text-sm outline-none focus:border-[#f45b4f] sm:w-40"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

              </div>

            </div>

          </div>

          {/* TABLE BODY */}

          {filteredBookings.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-left">

                <thead className="bg-gray-50/80">

                  <tr className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wider text-gray-500">

                    <th className="px-5 py-3">Customer</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Event Date</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredBookings.map((booking) => (

                    <tr
                      key={booking._id}
                      className="transition hover:bg-[#fffaf7]"
                    >

                      {/* CUSTOMER */}

                      <td className="px-5 py-3.5">

                        <div className="flex items-center gap-2.5">

                          {booking.customer?.image ? (

                            <img
                              src={booking.customer.image}
                              alt=""
                              className="h-9 w-9 rounded-full border border-gray-100 object-cover"
                            />

                          ) : (

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-[#f45b4f]">
                              {getInitials(booking.customer?.name)}
                            </div>

                          )}

                          <div className="min-w-0">
                            <p className="max-w-[150px] truncate text-sm font-semibold text-gray-800">
                              {booking.customer?.name ||
                                "Unknown Customer"}
                            </p>

                            <p className="max-w-[150px] truncate text-[11px] text-gray-400">
                              {booking.customer?.email || "No email"}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* SERVICE */}

                      <td className="px-4 py-3.5">

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">

                            {booking.service?.image ? (
                              <img
                                src={booking.service.image}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <BriefcaseBusiness
                                size={15}
                                className="text-gray-400"
                              />
                            )}

                          </div>

                          <span className="max-w-[130px] truncate text-sm font-medium text-gray-700">
                            {booking.service?.name ||
                              "Unknown Service"}
                          </span>

                        </div>

                      </td>

                      {/* DATE */}

                      <td className="px-4 py-3.5">

                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <CalendarDays
                            size={14}
                            className="text-[#f45b4f]"
                          />
                          {formatDate(booking.eventDate)}
                        </div>

                      </td>

                      {/* LOCATION */}

                      <td className="px-4 py-3.5">

                        <div className="flex max-w-[140px] items-center gap-1.5 text-sm text-gray-500">
                          <MapPin
                            size={14}
                            className="shrink-0 text-gray-400"
                          />

                          <span className="truncate">
                            {booking.eventLocation ||
                              "Not specified"}
                          </span>
                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-3.5">
                        <StatusBadge status={booking.status} />
                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-3.5">

                        <div className="flex justify-end">

                          <button
                            onClick={() =>
                              setSelectedBooking(booking)
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-[#f45b4f] hover:bg-orange-50 hover:text-[#f45b4f]"
                          >
                            <Eye size={14} />
                            View Details
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-12 text-center">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-[#f45b4f]">
                <CalendarCheck size={28} />
              </div>

              <h3 className="text-base font-bold text-gray-800">
                No bookings found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                {search || statusFilter !== "All"
                  ? "Try changing your search or filter."
                  : "You don't have any booking requests yet."}
              </p>

              {(search || statusFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="mt-4 text-sm font-semibold text-[#f45b4f] hover:underline"
                >
                  Clear Filters
                </button>
              )}

            </div>

          )}

          {/* FOOTER */}

          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-3">

            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {filteredBookings.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">
                {bookings.length}
              </span>{" "}
              bookings
            </p>

            <span className="text-[11px] font-medium text-gray-400">
              WedPlan
            </span>

          </div>

        </div>

      </div>

      {/* =====================================
          BOOKING DETAILS MODAL
      ===================================== */}

      {selectedBooking && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px]"
          onClick={() => {
            if (!updatingId && !confirmAction) {
              setSelectedBooking(null);
            }
          }}
        >

          <div
            className="max-h-[90vh] w-full max-w-[500px] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Booking Details
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Review customer booking information
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                disabled={!!updatingId}
                className="rounded-lg bg-gray-100 p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-500"
              >
                <X size={18} />
              </button>

            </div>

            {/* BODY */}

            <div className="space-y-4 p-5">

              {/* CUSTOMER */}

              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#fffaf7] p-3">

                {selectedBooking.customer?.image ? (

                  <img
                    src={selectedBooking.customer.image}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                  />

                ) : (

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 font-bold text-[#f45b4f]">
                    {getInitials(selectedBooking.customer?.name)}
                  </div>

                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900">
                    {selectedBooking.customer?.name ||
                      "Unknown Customer"}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {selectedBooking.customer?.email ||
                      "No email provided"}
                  </p>
                </div>

                <StatusBadge status={selectedBooking.status} />

              </div>

              {/* SERVICE */}

              <div className="rounded-xl border border-gray-100 p-4">

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Service Information
                </p>

                <div className="flex items-center gap-3">

                  {selectedBooking.service?.image ? (

                    <img
                      src={selectedBooking.service.image}
                      alt=""
                      className="h-14 w-14 rounded-xl object-cover"
                    />

                  ) : (

                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-[#f45b4f]">
                      <BriefcaseBusiness size={23} />
                    </div>

                  )}

                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {selectedBooking.service?.name ||
                        "Unknown Service"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Booking Request
                    </p>
                  </div>

                </div>

              </div>

              {/* EVENT INFORMATION */}

              <div className="rounded-xl border border-gray-100 p-4">

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Event Information
                </p>

                <div className="space-y-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-[#f45b4f]">
                      <CalendarDays size={17} />
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-400">
                        Event Date
                      </p>

                      <p className="text-sm font-semibold text-gray-800">
                        {formatDate(selectedBooking.eventDate)}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                      <MapPin size={17} />
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-400">
                        Event Location
                      </p>

                      <p className="text-sm font-semibold text-gray-800">
                        {selectedBooking.eventLocation ||
                          "Not specified"}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
                      <Clock size={17} />
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-400">
                        Request Submitted
                      </p>

                      <p className="text-sm font-semibold text-gray-800">
                        {formatDate(selectedBooking.createdAt)}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              {/* MESSAGE */}

              <div className="rounded-xl border border-gray-100 p-4">

                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare
                    size={15}
                    className="text-[#f45b4f]"
                  />

                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Customer Message
                  </p>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                  {selectedBooking.message ||
                    "No additional message provided."}
                </p>

              </div>

              {/* PHONE */}

              {selectedBooking.customer?.phone && (

                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">

                  <Phone size={15} className="text-gray-400" />

                  <span className="text-sm text-gray-700">
                    {selectedBooking.customer.phone}
                  </span>

                </div>

              )}

            </div>

            {/* FOOTER */}

            <div className="border-t border-gray-100 bg-gray-50/70 p-4">

              {selectedBooking.status === "Pending" ? (

                <div className="flex gap-3">

                  {/* REJECT */}

                  <button
                    onClick={() =>
                      setConfirmAction({
                        booking: selectedBooking,
                        status: "Rejected",
                      })
                    }
                    disabled={!!updatingId}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>

                  {/* ACCEPT */}

                  <button
                    onClick={() =>
                      setConfirmAction({
                        booking: selectedBooking,
                        status: "Confirmed",
                      })
                    }
                    disabled={!!updatingId}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f45b4f] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#e64d42] disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    Accept
                  </button>

                </div>

              ) : (

                <div className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-gray-500">

                  {selectedBooking.status === "Confirmed" ? (
                    <>
                      <CheckCircle2
                        size={17}
                        className="text-emerald-500"
                      />
                      This booking has been confirmed.
                    </>
                  ) : (
                    <>
                      <XCircle
                        size={17}
                        className="text-red-500"
                      />
                      This booking has been {selectedBooking.status.toLowerCase()}.
                    </>
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      )}

      {/* =====================================
          ACCEPT / REJECT CONFIRMATION MODAL
      ===================================== */}

      {confirmAction && (

        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!updatingId) {
              setConfirmAction(null);
            }
          }}
        >

          <div
            className="w-full max-w-[390px] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE */}

            <div className="flex justify-end px-4 pt-4">

              <button
                onClick={() => setConfirmAction(null)}
                disabled={!!updatingId}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={19} />
              </button>

            </div>

            <div className="px-6 pb-6 text-center">

              {/* ICON */}

              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  confirmAction.status === "Confirmed"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >

                {confirmAction.status === "Confirmed" ? (
                  <CheckCircle2 size={32} />
                ) : (
                  <AlertTriangle size={32} />
                )}

              </div>

              {/* TITLE */}

              <h3 className="mt-4 text-xl font-bold text-gray-900">

                {confirmAction.status === "Confirmed"
                  ? "Accept Booking?"
                  : "Reject Booking?"}

              </h3>

              {/* DESCRIPTION */}

              <p className="mt-2 text-sm leading-6 text-gray-500">

                {confirmAction.status === "Confirmed"
                  ? `Are you sure you want to accept the booking from ${confirmAction.booking.customer?.name || "this customer"}?`
                  : `Are you sure you want to reject the booking from ${confirmAction.booking.customer?.name || "this customer"}?`}

              </p>

              <p className="mt-2 text-xs text-gray-400">
                {confirmAction.status === "Confirmed"
                  ? "The booking status will change to Confirmed."
                  : "The booking status will change to Rejected."}
              </p>

              {/* ACTION BUTTONS */}

              <div className="mt-6 flex gap-3">

                {/* CANCEL */}

                <button
                  onClick={() => setConfirmAction(null)}
                  disabled={!!updatingId}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* CONFIRM */}

                <button
                  onClick={handleConfirmAction}
                  disabled={!!updatingId}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    confirmAction.status === "Confirmed"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >

                  {updatingId ? (

                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                  ) : confirmAction.status === "Confirmed" ? (

                    <CheckCircle2 size={17} />

                  ) : (

                    <XCircle size={17} />

                  )}

                  {updatingId
                    ? "Processing..."
                    : confirmAction.status === "Confirmed"
                      ? "Yes, Accept"
                      : "Yes, Reject"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
