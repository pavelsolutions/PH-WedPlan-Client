
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Search,
    CheckCircle2,
    XCircle,
    Trash2,
    RefreshCw,
    BriefcaseBusiness,
    Clock,
    Eye,
} from "lucide-react";
import { toast } from "sonner";
import { IService } from "@/types";
import { deleteAdminService, getAdminServices, updateAdminServices } from "@/lib/actions/api/services";

type Service = {
    _id: string;
    title?: string;
    name?: string;
    status?: string;
};

const normalizeStatus = (status?: string) =>
    (status || "pending").toUpperCase();

export default function ManageServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [updatingId, setUpdatingId] = useState<string | null>(null);


    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);


    const fetchServices = async () => {
        try {
            setLoading(true);

            const data = await getAdminServices();

            setServices(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const updateStatus = async (
        id: string,
        status: "APPROVED" | "REJECTED"
    ) => {
        try {
            setUpdatingId(id);

            await updateAdminServices(id, status);

            setServices((prev) =>
                prev.map((service) =>
                    service._id === id
                        ? { ...service, status }
                        : service
                )
            );

            toast.success(`Service ${status.toLowerCase()} successfully`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update service status");
        } finally {
            setUpdatingId(null);
        }
    };
    const deleteService = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this service?"
        );

        if (!confirmed) return;

        try {
            setUpdatingId(id);

            await deleteAdminService(id);

            setServices((prev) =>
                prev.filter((service) => service._id !== id)
            );

            toast.success("Service deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete service");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteService = async () => {
        if (!selectedServiceId) return;

        try {
            setUpdatingId(selectedServiceId);

            await deleteAdminService(selectedServiceId);

            setServices((prev) =>
                prev.filter(
                    (service) => service._id !== selectedServiceId
                )
            );

            toast.success("Service deleted successfully");

            setDeleteModal(false);
            setSelectedServiceId(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete service");
        } finally {
            setUpdatingId(null);
        }
    };
    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            const name =
                service.title ||
                service.serviceName ||
                service.name ||
                "";

            const matchesSearch =
                name.toLowerCase().includes(search.toLowerCase()) ||
                (service.vendorName || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                (service.category || "")
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesFilter =
                filter === "ALL" ||
                normalizeStatus(service.status) === filter;

            return matchesSearch && matchesFilter;
        });
    }, [services, search, filter]);

    const stats = {
        total: services.length,
        pending: services.filter(
            (s) => normalizeStatus(s.status) === "PENDING"
        ).length,
        approved: services.filter(
            (s) => normalizeStatus(s.status) === "APPROVED"
        ).length,
        rejected: services.filter(
            (s) => normalizeStatus(s.status) === "REJECTED"
        ).length,
    };

    const getStatusStyle = (status?: string) => {
        switch (normalizeStatus(status)) {
            case "APPROVED":
                return "bg-green-50 text-green-700";
            case "REJECTED":
                return "bg-red-50 text-red-600";
            default:
                return "bg-amber-50 text-amber-700";
        }
    };

    return (
        <div className="min-h-screen bg-[#fffaf7] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px] space-y-7">

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-[#f45b4f]">
                            Admin Dashboard
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-[#302521] sm:text-3xl">
                            Manage Services
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Manage and review all vendor services.
                        </p>
                    </div>

                    <button
                        onClick={fetchServices}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-xl border border-[#f1e5df] bg-white px-4 py-2.5 text-sm font-semibold text-[#302521] transition hover:bg-[#fff1ed] disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                        {
                            label: "Total Services",
                            value: stats.total,
                            icon: BriefcaseBusiness,
                            color: "text-[#f45b4f]",
                            bg: "bg-[#fff0eb]",
                        },
                        {
                            label: "Pending",
                            value: stats.pending,
                            icon: Clock,
                            color: "text-amber-600",
                            bg: "bg-amber-50",
                        },
                        {
                            label: "Approved",
                            value: stats.approved,
                            icon: CheckCircle2,
                            color: "text-green-600",
                            bg: "bg-green-50",
                        },
                        {
                            label: "Rejected",
                            value: stats.rejected,
                            icon: XCircle,
                            color: "text-red-600",
                            bg: "bg-red-50",
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-[#f1e5df] bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {item.label}
                                    </p>
                                    <h2 className="mt-2 text-2xl font-bold text-[#302521]">
                                        {item.value}
                                    </h2>
                                </div>

                                <div className={`rounded-xl p-3 ${item.bg}`}>
                                    <item.icon className={item.color} size={22} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col gap-3 rounded-2xl border border-[#f1e5df] bg-white p-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search service, vendor or category..."
                            className="w-full rounded-xl border border-[#eee4df] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#f45b4f]"
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="rounded-xl border border-[#eee4df] bg-white px-4 py-3 text-sm outline-none focus:border-[#f45b4f]"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>

                {/* Services Table */}
                <div className="overflow-hidden rounded-2xl border border-[#f1e5df] bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#f1e5df] px-5 py-4">
                        <h2 className="font-bold text-[#302521]">
                            All Services
                        </h2>
                        <span className="text-sm text-gray-500">
                            {filteredServices.length} services
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex min-h-64 items-center justify-center">
                            <RefreshCw className="animate-spin text-[#f45b4f]" size={28} />
                        </div>
                    ) : filteredServices.length === 0 ? (
                        <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
                            <BriefcaseBusiness size={38} className="text-gray-300" />
                            <p className="mt-3 font-semibold text-[#302521]">
                                No services found
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Try changing your search or filter.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left">
                                <thead className="bg-[#fffaf7] text-xs uppercase tracking-wide text-gray-500">
                                    <tr>
                                        <th className="px-5 py-4">Service</th>
                                        <th className="px-5 py-4">Vendor</th>
                                        <th className="px-5 py-4">Price</th>
                                        <th className="px-5 py-4">Created</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#f4eeeb]">
                                    {filteredServices.map((service) => {
                                        const status = normalizeStatus(service.status);
                                        const busy = updatingId === service._id;

                                        return (
                                            <tr key={service._id} className="hover:bg-[#fffaf7]">
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-[#302521]">
                                                        {service.title ||
                                                            service.serviceName ||
                                                            service.name ||
                                                            "Untitled Service"}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {service.category || "Uncategorized"}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {service.vendorName || service.vendorId || "N/A"}
                                                </td>

                                                <td className="px-5 py-4 text-sm font-semibold text-[#302521]">
                                                    {service.price != null
                                                        ? `৳${service.price}`
                                                        : "N/A"}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-500">
                                                    {service.createdAt
                                                        ? new Date(service.createdAt).toLocaleDateString()
                                                        : "N/A"}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(service.status)}`}
                                                    >
                                                        {status}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {status !== "APPROVED" && (
                                                            <button
                                                                title="Approve"
                                                                disabled={busy}
                                                                onClick={() =>
                                                                    updateStatus(service._id, "APPROVED")
                                                                }
                                                                className="rounded-lg bg-green-50 p-2 text-green-600 transition hover:bg-green-100 disabled:opacity-40"
                                                            >
                                                                <CheckCircle2 size={17} />
                                                            </button>
                                                        )}

                                                        {status !== "REJECTED" && (
                                                            <button
                                                                title="Reject"
                                                                disabled={busy}
                                                                onClick={() =>
                                                                    updateStatus(service._id, "REJECTED")
                                                                }
                                                                className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:opacity-40"
                                                            >
                                                                <XCircle size={17} />
                                                            </button>
                                                        )}

                                                        <button
                                                            title="Delete"
                                                            onClick={() => {
                                                                setSelectedServiceId(service._id);
                                                                setDeleteModal(true);
                                                            }}
                                                            disabled={updatingId === service._id}
                                                            className="rounded-lg bg-gray-100 p-2 text-gray-600 transition hover:bg-red-50 hover:text-red-600"
                                                        >
                                                            <Trash2 size={17} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

           {deleteModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4">

    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <Trash2 size={26} className="text-red-500" />
      </div>

      <div className="mt-4 text-center">
        <h2 className="text-xl font-bold text-gray-800">
          Delete Service?
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to delete this service?
          This action cannot be undone.
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => {
            setDeleteModal(false);
            setSelectedServiceId(null);
          }}
          disabled={updatingId !== null}
          className="flex-1 rounded-xl border px-4 py-3 text-sm font-semibold"
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteService}
          disabled={updatingId !== null}
          className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600"
        >
          {updatingId === selectedServiceId
            ? "Deleting..."
            : "Yes, Delete"}
        </button>
      </div>

    </div>
  </div>
)}

        </div>
    );
}
