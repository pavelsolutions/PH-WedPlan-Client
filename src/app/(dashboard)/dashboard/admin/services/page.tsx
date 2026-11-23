
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  BriefcaseBusiness,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
} from "lucide-react";

import { toast } from "sonner";

import {
  deleteAdminService,
  getAdminServices,
  updateAdminServices,
} from "@/lib/api/services";

// Shadcn UI
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Types
type Service = {
  _id: string;
  title?: string;
  serviceName?: string;
  name?: string;
  status?: string;
  vendorName?: string;
  vendorId?: string;
  category?: string;
  price?: number | string;
  createdAt?: string | number | Date;
};

type ServiceStatus = "APPROVED" | "REJECTED";

const ITEMS_PER_PAGE = 10;

// Normalize Status
const normalizeStatus = (status?: string) =>
  (status?.trim() || "pending")
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());

const getStatusValue = (status?: string) =>
  (status?.trim() || "pending").toUpperCase();

// Get Service Name
const getServiceName = (service: Service) =>
  service.title ||
  service.serviceName ||
  service.name ||
  "Untitled Service";

// Status Style
const getStatusClass = (status?: string) => {
  switch (getStatusValue(status)) {
    case "APPROVED":
      return "border-green-200 bg-green-50 text-green-700";

    case "REJECTED":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
};

// Format Date
const formatDate = (date?: string | number | Date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // Lowercase values for filtering
  const [filter, setFilter] = useState("all");

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [deleteModal, setDeleteModal] = useState(false);

  const [selectedService, setSelectedService] =
    useState<Service | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Services
  const fetchServices = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const data = await getAdminServices();

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch services:", error);

      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchServices();
  }, [fetchServices]);

  // Update Service Status
  const updateStatus = async (
    id: string,
    status: ServiceStatus
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

      toast.success(
        `Service ${normalizeStatus(status)} successfully`
      );
    } catch (error) {
      console.error("Failed to update service:", error);

      toast.error("Failed to update service status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Service
  const handleDeleteService = async () => {
    if (!selectedService) return;

    const id = selectedService._id;

    try {
      setUpdatingId(id);

      await deleteAdminService(id);

      setServices((prev) =>
        prev.filter((service) => service._id !== id)
      );

      toast.success("Service deleted successfully");

      setDeleteModal(false);
      setSelectedService(null);
    } catch (error) {
      console.error("Failed to delete service:", error);

      toast.error("Failed to delete service");
    } finally {
      setUpdatingId(null);
    }
  };

  // Statistics
  const stats = useMemo(() => {
    return {
      total: services.length,

      pending: services.filter(
        (service) =>
          getStatusValue(service.status) === "PENDING"
      ).length,

      approved: services.filter(
        (service) =>
          getStatusValue(service.status) === "APPROVED"
      ).length,

      rejected: services.filter(
        (service) =>
          getStatusValue(service.status) === "REJECTED"
      ).length,
    };
  }, [services]);

  // Search and Filter
  const filteredServices = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return services.filter((service) => {
      const serviceName = getServiceName(service);

      const matchesSearch =
        serviceName.toLowerCase().includes(searchTerm) ||
        (service.vendorName || "")
          .toLowerCase()
          .includes(searchTerm) ||
        (service.vendorId || "")
          .toLowerCase()
          .includes(searchTerm) ||
        (service.category || "")
          .toLowerCase()
          .includes(searchTerm);

      const matchesFilter =
        filter === "all" ||
        getStatusValue(service.status).toLowerCase() === filter;

      return matchesSearch && matchesFilter;
    });
  }, [services, search, filter]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / ITEMS_PER_PAGE)
  );

  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredServices.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredServices, currentPage]);

  // Reset Pagination
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Statistics Cards
  const statsCards = [
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
  ];

  return (
    <div className="min-h-screen bg-[#fffaf7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-[#f45b4f]">
              Admin Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#302521] sm:text-3xl">
              Manage Services
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage, review and monitor all vendor services.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => void fetchServices(true)}
            disabled={loading}
            className="gap-2 border-[#f1e5df] bg-white"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statsCards.map((item) => (
            <Card
              key={item.label}
              className="rounded-2xl border-[#f1e5df] shadow-sm"
            >
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {item.label}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-[#302521]">
                    {item.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${item.bg}`}>
                  <item.icon
                    className={item.color}
                    size={22}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <Card className="rounded-2xl border-[#f1e5df] shadow-sm">
          <CardContent className="grid grid-cols-1 items-center gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_190px]">

            {/* Search */}
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search service, vendor or category..."
                className="h-11 w-full border-[#eee4df] pl-10 focus-visible:ring-[#f45b4f]"
              />
            </div>

            {/* Status Filter */}
            <Select
              onValueChange={(value) =>
                setFilter(value as "all" | "pending" | "approved" | "rejected")
              }
            >
              <SelectTrigger className="h-11 w-full border-[#eee4df]">
                <div className="flex items-center gap-2">
                  <Filter size={16} />

                  <SelectValue placeholder="All Services" />
                </div>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Services
                </SelectItem>

                <SelectItem value="pending">
                  Pending
                </SelectItem>

                <SelectItem value="approved">
                  Approved
                </SelectItem>

                <SelectItem value="rejected">
                  Rejected
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Services Table */}
        <Card className="overflow-hidden rounded-2xl border-[#f1e5df] shadow-sm">

          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-[#f1e5df] px-5 py-4">
            <div>
              <CardTitle className="text-lg font-bold text-[#302521]">
                All Services
              </CardTitle>

              <CardDescription className="mt-1">
                Review and manage vendor service listings.
              </CardDescription>
            </div>

            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1"
            >
              {filteredServices.length} Services
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex min-h-72 flex-col items-center justify-center gap-3">
                <RefreshCw
                  className="animate-spin text-[#f45b4f]"
                  size={30}
                />

                <p className="text-sm text-muted-foreground">
                  Loading services...
                </p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center px-4 text-center">
                <div className="rounded-full bg-[#fff0eb] p-4">
                  <PackageSearch
                    size={35}
                    className="text-[#f45b4f]"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-[#302521]">
                  No Services Found
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Try changing your search or filter.
                </p>

                {(search || filter !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#fffaf7] hover:bg-[#fffaf7]">
                        <TableHead className="min-w-[230px] px-5 py-4">
                          Service
                        </TableHead>

                        <TableHead className="min-w-[170px]">
                          Vendor
                        </TableHead>

                        <TableHead className="min-w-[110px]">
                          Price
                        </TableHead>

                        <TableHead className="min-w-[130px]">
                          Created
                        </TableHead>

                        <TableHead className="min-w-[120px]">
                          Status
                        </TableHead>

                        <TableHead className="min-w-[160px] text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {paginatedServices.map((service) => {
                        const status = getStatusValue(service.status);
                        const busy = updatingId === service._id;

                        return (
                          <TableRow
                            key={service._id}
                            className="transition-colors hover:bg-[#fffaf7]"
                          >
                            {/* Service */}
                            <TableCell className="px-5 py-4">
                              <div>
                                <p className="font-semibold text-[#302521]">
                                  {getServiceName(service)}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                  {service.category || "Uncategorized"}
                                </p>
                              </div>
                            </TableCell>

                            {/* Vendor */}
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium text-[#302521]">
                                  {service.vendorName || "Unknown Vendor"}
                                </p>

                                {service.vendorId && (
                                  <p className="mt-1 max-w-[150px] truncate text-xs text-muted-foreground">
                                    ID: {service.vendorId}
                                  </p>
                                )}
                              </div>
                            </TableCell>

                            {/* Price */}
                            <TableCell>
                              <span className="font-semibold text-[#302521]">
                                {service.price != null
                                  ? `৳${Number(service.price).toLocaleString("en-BD")}`
                                  : "N/A"}
                              </span>
                            </TableCell>

                            {/* Created Date */}
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(service.createdAt)}
                              </span>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`rounded-full px-3 py-1 font-medium ${getStatusClass(service.status)}`}
                              >
                                {normalizeStatus(service.status)}
                              </Badge>
                            </TableCell>

                            {/* Actions */}
                            <TableCell>
                              <div className="flex items-center justify-end gap-1.5">

                                {status !== "APPROVED" && (
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    title="Approve Service"
                                    disabled={updatingId !== null}
                                    onClick={() =>
                                      void updateStatus(
                                        service._id,
                                        "APPROVED"
                                      )
                                    }
                                    className="h-9 w-9 text-green-600 hover:bg-green-50 hover:text-green-700"
                                  >
                                    {busy ? (
                                      <RefreshCw
                                        size={17}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <CheckCircle2 size={18} />
                                    )}
                                  </Button>
                                )}

                                {status !== "REJECTED" && (
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    title="Reject Service"
                                    disabled={updatingId !== null}
                                    onClick={() =>
                                      void updateStatus(
                                        service._id,
                                        "REJECTED"
                                      )
                                    }
                                    className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600"
                                  >
                                    <XCircle size={18} />
                                  </Button>
                                )}

                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  title="Delete Service"
                                  disabled={updatingId !== null}
                                  onClick={() => {
                                    setSelectedService(service);
                                    setDeleteModal(true);
                                  }}
                                  className="h-9 w-9 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 size={17} />
                                </Button>

                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-[#f1e5df] px-5 py-4 sm:flex-row">

                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-semibold text-[#302521]">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                    </span>
                    {" - "}
                    <span className="font-semibold text-[#302521]">
                      {Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        filteredServices.length
                      )}
                    </span>
                    {" of "}
                    <span className="font-semibold text-[#302521]">
                      {filteredServices.length}
                    </span>
                    {" services"}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.max(1, prev - 1)
                        )
                      }
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </Button>

                    <div className="flex h-9 min-w-9 items-center justify-center rounded-md border border-[#f1e5df] px-3 text-sm font-semibold">
                      {currentPage} / {totalPages}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(totalPages, prev + 1)
                        )
                      }
                    >
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteModal}
        onOpenChange={(open) => {
          if (updatingId !== null) return;

          setDeleteModal(open);

          if (!open) {
            setSelectedService(null);
          }
        }}
      >
        <DialogContent className="max-w-[420px] rounded-2xl">

          <DialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Trash2
                size={25}
                className="text-red-500"
              />
            </div>

            <DialogTitle className="text-center text-xl">
              Delete Service?
            </DialogTitle>

            <DialogDescription className="text-center">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedService
                  ? getServiceName(selectedService)
                  : "this service"}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-3 flex flex-row gap-2 sm:justify-center">

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={updatingId !== null}
              onClick={() => {
                setDeleteModal(false);
                setSelectedService(null);
              }}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              disabled={updatingId !== null}
              onClick={() => void handleDeleteService()}
            >
              {updatingId === selectedService?._id ? (
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
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
