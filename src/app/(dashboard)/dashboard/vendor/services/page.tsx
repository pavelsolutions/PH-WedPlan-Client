
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
    Search,
    Plus,
    SlidersHorizontal,
    Pencil,
    Trash2,
    BriefcaseBusiness,
    MapPin,
    RefreshCw,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import {
    deleteService,
    getVendorServices
} from "@/lib/api/services";

import { IService } from "@/types";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateService } from "@/lib/actions/services";

type ServiceStatus = "Approved" | "Pending" | "Rejected";

const statusStyles: Record<ServiceStatus, string> = {
    Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Pending: "border-amber-200 bg-amber-50 text-amber-700",
    Rejected: "border-red-200 bg-red-50 text-red-700",
};

export default function VendorServicesPage() {
    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    const vendorId = session?.user?.id;

    const [services, setServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search and filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All categories");

    // Delete states
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    // Edit states
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<IService | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const [editForm, setEditForm] = useState({
        serviceName: "",
        category: "",
        price: "",
        location: "",
        description: "",
        image: "",
    });

    // Fetch vendor services
    useEffect(() => {
        if (sessionLoading) return;

        if (!vendorId) {
            setServices([]);
            setLoading(false);
            return;
        }

        const fetchVendorServices = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getVendorServices(vendorId);

                setServices(data);
            } catch (err) {
                console.error("Fetch services error:", err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load services"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchVendorServices();
    }, [vendorId, sessionLoading]);

    // Categories
    const categories = useMemo(() => {
        return [
            "All categories",
            ...Array.from(new Set(services.map((s) => s.category))),
        ];
    }, [services]);

    // Filter services
    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                service.serviceName.toLowerCase().includes(searchText) ||
                service.category.toLowerCase().includes(searchText) ||
                service._id.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === "All" ||
                service.status === statusFilter;

            const matchesCategory =
                categoryFilter === "All categories" ||
                service.category === categoryFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );
        });
    }, [services, search, statusFilter, categoryFilter]);

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-BD").format(price);
    };

    // Open Edit Modal
    const handleEditClick = (service: IService) => {
        setEditingService(service);

        setEditForm({
            serviceName: service.serviceName || "",
            category: service.category || "",
            price: String(service.price ?? ""),
            location: service.location || "",
            description: service.description || "",
            image: service.image || "",
        });

        setEditDialogOpen(true);
    };

    // Handle edit form changes
    const handleEditChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Update Service
    const handleUpdateService = async () => {
        if (!editingService) return;

        if (
            !editForm.serviceName.trim() ||
            !editForm.category.trim() ||
            !editForm.price ||
            !editForm.location.trim()
        ) {
            toast.error("Please fill in all required fields");
            return;
        }

        const price = Number(editForm.price);

        if (!Number.isFinite(price) || price <= 0) {
            toast.error("Please enter a valid price");
            return;
        }

        try {
            setEditLoading(true);

            const updatedData = {
                serviceName: editForm.serviceName.trim(),
                category: editForm.category.trim(),
                price,
                location: editForm.location.trim(),
                description: editForm.description.trim(),
                image: editForm.image.trim(),
            };

            const response = await updateService(
                editingService._id,
                updatedData
            );

            setServices((prev) =>
                prev.map((service) =>
                    service._id === editingService._id
                        ? {
                            ...service,
                            ...updatedData,
                            ...(response?.service || {}),
                        }
                        : service
                )
            );

            toast.success("Service updated successfully!");

            setEditDialogOpen(false);
            setEditingService(null);

        } catch (err) {
            console.error("Update service error:", err);

            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to update service"
            );
        } finally {
            setEditLoading(false);
        }
    };

    // Open delete confirmation
    const handleDeleteClick = (serviceId: string) => {
        setSelectedServiceId(serviceId);
        setDeleteDialogOpen(true);
    };

    // Delete service
    const handleDeleteService = async () => {
        if (!selectedServiceId) return;

        try {
            setDeleteLoading(true);
            setError("");

            await deleteService(selectedServiceId);

            setServices((prev) =>
                prev.filter(
                    (service) => service._id !== selectedServiceId
                )
            );

            toast.success("Service deleted successfully!", {
                description: "Your wedding service has been removed.",
            });

            setDeleteDialogOpen(false);
            setSelectedServiceId(null);

        } catch (err) {
            console.error("Delete service error:", err);

            toast.error("Failed to delete service", {
                description:
                    err instanceof Error
                        ? err.message
                        : "Something went wrong.",
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    // const handleAddNewService = async() => {
    //     if(!vendorId){
    //         router.push(`/signin`);
    //     } else if(user.role == '')
    // }

    // Loading state
    if (sessionLoading || loading) {
        return (
            <div className="min-h-screen bg-[#fcfaf9] p-5 sm:p-8">
                <div className="mx-auto max-w-[1500px] space-y-5">
                    <div className="h-16 animate-pulse rounded-xl bg-[#eee5e1]" />

                    <div className="flex justify-end">
                        <div className="h-11 w-40 animate-pulse rounded-xl bg-[#eee5e1]" />
                    </div>

                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-32 animate-pulse rounded-2xl bg-[#eee5e1]"
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
                <div className="max-w-md rounded-2xl border border-[#eadfd9] bg-white p-8 text-center shadow-sm">
                    <BriefcaseBusiness
                        className="mx-auto text-[#922638]"
                        size={38}
                    />

                    <h2 className="mt-4 font-serif text-xl font-bold text-[#421b24]">
                        Login Required
                    </h2>

                    <p className="mt-2 text-sm text-[#8b7478]">
                        Please login to manage your wedding services.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfaf9]">
            <div className="mx-auto max-w-[1500px] space-y-6 p-5 sm:p-7 lg:p-8">

                {/* Header */}
                <div className="border-b border-[#e9dfda] pb-4">
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-[#421b24]">
                        My Wedding Services
                    </h1>

                    <p className="mt-1 text-sm text-[#8b7478]">
                        Edit service packages, track admin approval status,
                        and toggle availability.
                    </p>
                </div>

                {/* Add New Service */}
                <div className="flex justify-end">
                    <Link
                        href="/dashboard/vendor/services/add"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#dc2027] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#761d2e]"
                    >
                        <Plus size={17} />
                        Add New Service
                    </Link>
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <div className="flex items-center justify-between gap-3">
                            <p>{error}</p>

                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center gap-1 font-medium"
                            >
                                <RefreshCw size={14} />
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="rounded-2xl border border-[#eadfd9] bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                        {/* Search */}
                        <div className="relative w-full lg:max-w-sm">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ad9699]"
                            />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search wedding services..."
                                className="w-full rounded-xl border border-[#eadfd9] bg-[#fcfaf9] py-2.5 pl-10 pr-4 text-sm text-[#421b24] outline-none transition placeholder:text-[#b49fa2] focus:border-[#922638] focus:bg-white focus:ring-2 focus:ring-[#922638]/10"
                            />
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">

                            {/* Category Filter */}
                            <div className="flex items-center gap-2 rounded-xl border border-[#eadfd9] px-3 py-2.5">
                                <SlidersHorizontal
                                    size={15}
                                    className="text-[#a58c90]"
                                />

                                <select
                                    value={categoryFilter}
                                    onChange={(e) =>
                                        setCategoryFilter(e.target.value)
                                    }
                                    className="w-full bg-transparent text-sm text-[#735b60] outline-none sm:w-auto"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div className="flex flex-wrap rounded-xl bg-[#f8f2ef] p-1">
                                {[
                                    "All",
                                    "Approved",
                                    "Pending",
                                    "Rejected",
                                ].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                                            statusFilter === status
                                                ? "bg-white text-[#922638] shadow-sm"
                                                : "text-[#987f83] hover:text-[#421b24]"
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="font-serif text-xl font-bold text-[#421b24]">
                            Service Listings
                        </h2>

                        <p className="mt-1 text-xs text-[#a18c90]">
                            Showing {filteredServices.length} of{" "}
                            {services.length} services
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setSearch("");
                            setStatusFilter("All");
                            setCategoryFilter("All categories");
                        }}
                        className="text-xs font-semibold text-[#922638] transition hover:text-[#761d2e]"
                    >
                        Reset filters
                    </button>
                </div>

                {/* Service Listings */}
                <div className="space-y-4">
                    {filteredServices.length > 0 ? (
                        filteredServices.map((service) => (
                            <div
                                key={service._id}
                                className="flex flex-col gap-5 rounded-2xl border border-[#e9ded8] bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:p-5"
                            >
                                {/* Service Image */}
                                <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl border border-[#eee4df] bg-[#faf5f2] sm:w-28">
                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.serviceName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-[#b99da2]">
                                            <BriefcaseBusiness size={32} />
                                        </div>
                                    )}
                                </div>

                                {/* Service Information */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-serif text-lg font-bold text-[#421b24]">
                                            {service.serviceName}
                                        </h3>

                                        <span
                                            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                                                statusStyles[
                                                    service.status as ServiceStatus
                                                ] ||
                                                "border-gray-200 bg-gray-50 text-gray-600"
                                            }`}
                                        >
                                            {service.status}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-xs text-[#8b7478]">
                                        {service.category} • ৳
                                        {formatPrice(service.price)}
                                    </p>

                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#9b8589]">
                                        <MapPin
                                            size={14}
                                            className="shrink-0 text-[#922638]"
                                        />

                                        <span className="truncate">
                                            {service.location}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex shrink-0 flex-wrap items-center gap-3">

                                    {/* Edit Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEditClick(service)
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-[#e8dcd6] px-4 py-2.5 text-xs font-semibold text-[#421b24] transition hover:bg-[#faf4f1]"
                                    >
                                        <Pencil size={14} />
                                        Edit
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        disabled={deleteLoading}
                                        onClick={() =>
                                            handleDeleteClick(service._id)
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#dc2027] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#bd171e] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-[#e9ded8] bg-white px-6 py-16 text-center shadow-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8f0ed] text-[#922638]">
                                <BriefcaseBusiness size={28} />
                            </div>

                            <h3 className="mt-4 font-serif text-xl font-bold text-[#421b24]">
                                {services.length === 0
                                    ? "No services yet"
                                    : "No services found"}
                            </h3>

                            <p className="mt-2 text-sm text-[#8b7478]">
                                {services.length === 0
                                    ? "Add your first wedding service package to get started."
                                    : "Try changing your search or filters."}
                            </p>

                            {services.length === 0 && (
                                <Link
                                    href="/dashboard/vendor/services/add"
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#dc2027] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#761d2e]"
                                >
                                    <Plus size={16} />
                                    Add New Service
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-[#e9dfda] py-5">
                    <p className="text-xs text-[#a18c90]">
                        Showing {filteredServices.length} service listings
                    </p>
                </div>
            </div>

            {/* EDIT MODAL */}
            <AlertDialog
                open={editDialogOpen}
                onOpenChange={(open) => {
                    if (!editLoading) {
                        setEditDialogOpen(open);

                        if (!open) {
                            setEditingService(null);
                        }
                    }
                }}
            >
                <AlertDialogContent className="!w-[95vw] !max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-[#eadfd9]">
                    <AlertDialogHeader>
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f0ed]">
                            <Pencil className="text-[#922638]" size={22} />
                        </div>

                        <AlertDialogTitle className="font-serif text-2xl text-[#421b24]">
                            Edit Wedding Service
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-sm leading-6 text-[#8b7478]">
                            Update your service details and save your changes.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-4 py-3">

                        {/* Service Name */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[#421b24]">
                                Service Name *
                            </label>

                            <input
                                name="serviceName"
                                value={editForm.serviceName}
                                onChange={handleEditChange}
                                placeholder="Enter service name"
                                className="w-full rounded-xl border border-[#eadfd9] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#922638] focus:ring-2 focus:ring-[#922638]/10"
                            />
                        </div>

                        {/* Category and Price */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[#421b24]">
                                    Category *
                                </label>

                                <input
                                    name="category"
                                    value={editForm.category}
                                    onChange={handleEditChange}
                                    placeholder="Photography"
                                    className="w-full rounded-xl border border-[#eadfd9] px-4 py-3 text-sm outline-none focus:border-[#922638]"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[#421b24]">
                                    Price (BDT) *
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    name="price"
                                    value={editForm.price}
                                    onChange={handleEditChange}
                                    placeholder="Enter price"
                                    className="w-full rounded-xl border border-[#eadfd9] px-4 py-3 text-sm outline-none focus:border-[#922638]"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[#421b24]">
                                Location *
                            </label>

                            <input
                                name="location"
                                value={editForm.location}
                                onChange={handleEditChange}
                                placeholder="Enter service location"
                                className="w-full rounded-xl border border-[#eadfd9] px-4 py-3 text-sm outline-none focus:border-[#922638]"
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[#421b24]">
                                Image URL
                            </label>

                            <input
                                name="image"
                                value={editForm.image}
                                onChange={handleEditChange}
                                placeholder="Enter image URL"
                                className="w-full rounded-xl border border-[#eadfd9] px-4 py-3 text-sm outline-none focus:border-[#922638]"
                            />
                        </div>

                        {/* Image Preview */}
                        {editForm.image && (
                            <div className="overflow-hidden rounded-xl border border-[#eadfd9]">
                                <img
                                    src={editForm.image}
                                    alt="Service preview"
                                    className="h-40 w-full object-cover"
                                />
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[#421b24]">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                rows={4}
                                placeholder="Describe your wedding service..."
                                className="w-full resize-none rounded-xl border border-[#eadfd9] px-4 py-3 text-sm outline-none focus:border-[#922638]"
                            />
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={editLoading}
                            className="rounded-xl border-[#eadfd9]"
                        >
                            Cancel
                        </AlertDialogCancel>

                        <button
                            type="button"
                            disabled={editLoading}
                            onClick={handleUpdateService}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#922638] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#761d2e] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {editLoading ? (
                                <>
                                    <RefreshCw
                                        size={15}
                                        className="animate-spin"
                                    />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Pencil size={15} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* DELETE CONFIRMATION MODAL */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!deleteLoading) {
                        setDeleteDialogOpen(open);

                        if (!open) {
                            setSelectedServiceId(null);
                        }
                    }
                }}
            >
                <AlertDialogContent className="rounded-2xl border-[#eadfd9]">
                    <AlertDialogHeader>
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                            <Trash2 className="text-red-600" size={22} />
                        </div>

                        <AlertDialogTitle className="font-serif text-xl text-[#421b24]">
                            Delete Wedding Service?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-sm leading-6 text-[#8b7478]">
                            Are you sure you want to delete this service?
                            This action cannot be undone, and the service
                            will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel
                            disabled={deleteLoading}
                            className="rounded-xl border-[#eadfd9]"
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            disabled={deleteLoading}
                            onClick={(event) => {
                                event.preventDefault();
                                void handleDeleteService();
                            }}
                            className="rounded-xl bg-[#dc2027] text-white hover:bg-[#bd171e]"
                        >
                            {deleteLoading ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Yes, Delete
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
