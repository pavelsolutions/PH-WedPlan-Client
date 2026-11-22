
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  ImagePlus,
  MapPin,
  X,
  Heart,
  Clock3,
  Loader2,
  Crown,
  LockKeyhole,
} from "lucide-react";

import { toast } from "sonner";
import { uploadImage } from "@/lib/uploadImage";
import { CreateServicePayload, ServiceCategory } from "@/types";
import { createService } from "@/lib/actions/services";
import { authClient } from "@/lib/auth-client";

const categories: ServiceCategory[] = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const FREE_SERVICE_LIMIT = 3;

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AddServicePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  // Form states
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState<ServiceCategory | "">("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Service count states
  const [serviceCount, setServiceCount] = useState(0);
  const [countLoading, setCountLoading] = useState(true);

  // Subscription
  const subscriptionPlan = String(
    user?.subscriptionPlan || "free"
  )
    .trim()
    .toLowerCase();

  const isPremium = subscriptionPlan === "premium";

  const isVendor =
    String(user?.role || "").toLowerCase() === "vendor";

  const hasReachedLimit =
    !isPremium && serviceCount >= FREE_SERVICE_LIMIT;

  const remainingServices = Math.max(
    FREE_SERVICE_LIMIT - serviceCount,
    0
  );

  // Authentication and role protection
  useEffect(() => {
    if (isPending) return;

    if (!user) {
      toast.error("Please login to continue.");
      router.replace("/login");
      return;
    }

    if (!isVendor) {
      toast.error("Only vendors can publish services.");
      router.replace("/");
      return;
    }

    if (user.isBlocked) {
      toast.error("Your account has been blocked.");
      router.replace("/");
    }
  }, [isPending, user, isVendor, router]);

  // Fetch vendor service count
  const fetchServiceCount = async () => {
    if (!user?.id || !isVendor) {
      setCountLoading(false);
      return;
    }

    try {
      setCountLoading(true);

      const response = await fetch(
        `${BASE_URL}/vendor/services/count/${encodeURIComponent(
          user.id
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch service count."
        );
      }

      setServiceCount(Number(data.count) || 0);

    } catch (err) {
      console.error("Service count error:", err);

      toast.error("Could not check your service limit.");

    } finally {
      setCountLoading(false);
    }
  };

  // Load service count
  useEffect(() => {
    if (isPending) return;

    if (user && isVendor) {
      fetchServiceCount();
    }
  }, [isPending, user?.id, isVendor]);

  // Image selection
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(
        file.type
      )
    ) {
      toast.error("Only JPG, PNG and WebP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");

    toast.success("Image selected successfully!");
  };

  // Remove image
  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Form validation
  const validateForm = () => {
    if (
      !serviceName.trim() ||
      serviceName.trim().length < 3
    ) {
      setError(
        "Service name must contain at least 3 characters."
      );
      return false;
    }

    if (!category) {
      setError("Please select a service category.");
      return false;
    }

    if (
      !price ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0
    ) {
      setError("Please enter a valid service price.");
      return false;
    }

    if (!location.trim()) {
      setError("Service location is required.");
      return false;
    }

    if (
      !description.trim() ||
      description.trim().length < 10
    ) {
      setError(
        "Description must contain at least 10 characters."
      );
      return false;
    }

    if (!imageFile) {
      setError("Please upload a service image.");
      return false;
    }

    setError("");
    return true;
  };

  // Submit service
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isPending || loading) return;

    if (!user || !isVendor) {
      toast.error(
        "Only authenticated vendors can publish services."
      );
      return;
    }

    if (user.isBlocked) {
      toast.error("Your account has been blocked.");
      return;
    }

    // Free plan limit check
    if (!isPremium && serviceCount >= FREE_SERVICE_LIMIT) {
      toast.error("Free plan service limit reached.");
      return;
    }

    if (!validateForm()) {
      toast.error("Please complete all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Upload image
      const uploadToast = toast.loading(
        "Uploading service image..."
      );

      let imageUrl: string;

      try {
        imageUrl = await uploadImage(imageFile!);
      } catch {
        toast.error("Image upload failed.", {
          id: uploadToast,
        });

        throw new Error(
          "Unable to upload service image."
        );
      }

      if (!imageUrl) {
        throw new Error(
          "Image URL was not generated."
        );
      }

      toast.success("Image uploaded successfully!", {
        id: uploadToast,
      });

      // Prepare service data
      const serviceData: CreateServicePayload = {
        serviceName: serviceName.trim(),
        category: category as ServiceCategory,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        image: imageUrl,
        vendorId: user.id,
      };

      // Create service
      await createService(serviceData);

      toast.success("Service submitted successfully!", {
        description:
          "Your service is waiting for admin approval.",
      });

      // Update service count
      setServiceCount((prev) => prev + 1);

      // Reset form
      setServiceName("");
      setCategory("");
      setPrice("");
      setLocation("");
      setDescription("");

      removeImage();

      // Navigate
      router.push("/dashboard/vendor/services");

    } catch (err) {
      console.error("Add service error:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(errorMessage);

      if (
        errorMessage.toLowerCase().includes("limit") ||
        errorMessage.toLowerCase().includes("maximum")
      ) {
        toast.error("Service limit reached!", {
          description: errorMessage,
        });

        fetchServiceCount();

      } else {
        toast.error("Failed to add service", {
          description: errorMessage,
        });
      }

    } finally {
      setLoading(false);
    }
  };

  // Loading screen
  if (
    isPending ||
    !user ||
    !isVendor ||
    user.isBlocked ||
    countLoading
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#9D263B]" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#FCFAF8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-6 border-b border-[#F0E3DC] pb-5">

          <Link
            href="/dashboard/vendor/services"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#FF5B52] hover:text-[#E44840]"
          >
            <ArrowLeft size={16} />
            Back to Services
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="font-serif text-3xl font-bold text-[#352621] sm:text-4xl">
                Add New Wedding Service
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#8C746B]">
                Publish a new wedding package. All submissions
                require admin approval.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F3D6CE] bg-[#FFF0EC] px-3 py-2 text-xs font-semibold text-[#C74D43]">
              <Clock3 size={14} />
              Pending Review
            </div>

          </div>
        </div>

        {/* Subscription Information */}
        <div className="mb-6 rounded-xl border border-[#F0E3DC] bg-white p-4">

          <div className="flex items-center justify-between gap-3">

            <div>
              <p className="text-sm font-semibold text-[#352621]">
                Your Subscription
              </p>

              <p className="mt-1 text-xs text-[#8C746B]">
                {isPremium
                  ? "You can publish unlimited services."
                  : `You have used ${serviceCount} of 3 services.`}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                isPremium
                  ? "bg-purple-100 text-[#dc2027]"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {isPremium ? "PREMIUM" : "FREE"}
            </span>

          </div>

          {!isPremium && (
            <>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-[#9D263B] transition-all"
                  style={{
                    width: `${Math.min(
                      (serviceCount / FREE_SERVICE_LIMIT) * 100,
                      100
                    )}%`,
                  }}
                />

              </div>

              <p className="mt-2 text-xs text-[#8C746B]">
                {remainingServices > 0
                  ? `${remainingServices} service slot(s) remaining.`
                  : "You have reached your service limit."}
              </p>
            </>
          )}

        </div>

        {/* Premium Upgrade Section */}
        {hasReachedLimit && (

          <div className="rounded-2xl border border-purple-200 bg-white p-6 text-center shadow-sm sm:p-10">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-[#dc2027]">
              <Crown size={32} />
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#352621] sm:text-3xl">
              Upgrade to Premium
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#8C746B]">
              You have already submitted 3 services with your Free
              subscription. Upgrade to Premium to publish unlimited
              wedding services and grow your business.
            </p>

            <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-3 rounded-xl bg-purple-50 p-4 text-left">

              <LockKeyhole
                className="shrink-0 text-[#dc2027]"
                size={22}
              />

              <div>
                <p className="text-sm font-semibold text-[#dc2027]">
                  Free plan limit reached
                </p>

                <p className="mt-1 text-xs text-[#dc2027]">
                  3 out of 3 services have been used.
                </p>
              </div>

            </div>

            <Link
              href="/checkout"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#dc2027] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#dc2027]"
            >
              <Crown size={17} />
              Upgrade to Premium
            </Link>

            <p className="mt-4 text-xs text-[#A18C90]">
              Already upgraded? Refresh the page to update your plan.
            </p>

          </div>
        )}

        {/* Service Form */}
        {!hasReachedLimit && (

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#F0E3DC] bg-white p-5 shadow-sm sm:p-7 lg:p-8"
          >

            <div className="mb-7">
              <h2 className="font-serif text-2xl font-bold text-[#352621]">
                Service Details
              </h2>

              <p className="mt-2 text-sm text-[#8C746B]">
                Provide accurate pricing, location and service information.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2">

              {/* Service Name */}
              <div>
                <label
                  htmlFor="serviceName"
                  className="mb-2 block text-sm font-medium text-[#352621]"
                >
                  Service Name *
                </label>

                <input
                  id="serviceName"
                  type="text"
                  value={serviceName}
                  onChange={(e) =>
                    setServiceName(e.target.value)
                  }
                  placeholder="e.g. Wedding Photography Package"
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-[#F0E3DC] px-3.5 py-3 text-sm outline-none focus:border-[#FF5B52] focus:ring-4 focus:ring-[#FF5B52]/10"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-[#352621]"
                >
                  Service Category *
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as ServiceCategory | ""
                    )
                  }
                  required
                  className="w-full rounded-xl border border-[#F0E3DC] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#FF5B52]"
                >
                  <option value="">Select a category</option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-[#352621]"
                >
                  Starting Price (BDT) *
                </label>

                <div className="flex overflow-hidden rounded-xl border border-[#F0E3DC]">

                  <span className="flex items-center border-r border-[#F0E3DC] bg-[#FCFAF8] px-4 text-sm font-medium">
                    ৳
                  </span>

                  <input
                    id="price"
                    type="number"
                    min="1"
                    step="1"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    placeholder="25000"
                    required
                    className="w-full px-3.5 py-3 text-sm outline-none"
                  />

                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-[#352621]"
                >
                  Location / Coverage Area *
                </label>

                <div className="flex items-center overflow-hidden rounded-xl border border-[#F0E3DC]">

                  <MapPin
                    size={17}
                    className="ml-3.5 shrink-0 text-[#B49A91]"
                  />

                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    placeholder="e.g. Dhaka, Bangladesh"
                    required
                    className="w-full px-3 py-3 text-sm outline-none"
                  />

                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">

                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-[#352621]"
                >
                  Service Description *
                </label>

                <textarea
                  id="description"
                  rows={5}
                  maxLength={2000}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe your service, packages, deliverables and customization options..."
                  required
                  className="w-full resize-y rounded-xl border border-[#F0E3DC] px-3.5 py-3 text-sm leading-6 outline-none focus:border-[#FF5B52] focus:ring-4 focus:ring-[#FF5B52]/10"
                />

                <div className="mt-1.5 flex justify-end">
                  <span className="text-xs text-[#A18C90]">
                    {description.length}/2000
                  </span>
                </div>

              </div>

              {/* Service Image */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-[#352621]">
                  Service Image *
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {imagePreview ? (

                  <div className="relative overflow-hidden rounded-xl border border-[#F0E3DC]">

                    <img
                      src={imagePreview}
                      alt="Selected service"
                      className="h-64 w-full object-cover sm:h-80"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      aria-label="Remove image"
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md"
                    >
                      <X size={18} />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">

                      <p className="truncate text-sm font-medium text-white">
                        {imageFile?.name}
                      </p>

                      <p className="mt-1 text-xs text-white/80">
                        Service image preview
                      </p>

                    </div>

                  </div>

                ) : (

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#F0E3DC] bg-[#FCFAF8] p-8 text-center transition hover:border-[#FF5B52] hover:bg-[#FFF0EC] sm:p-10"
                  >

                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0EC] text-[#FF5B52]">
                      <ImagePlus size={24} />
                    </div>

                    <span className="text-sm font-semibold text-[#352621]">
                      Click to upload service image
                    </span>

                    <span className="mt-2 text-xs text-[#8C746B]">
                      PNG, JPG or WebP · Maximum 5MB
                    </span>

                  </button>

                )}

              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-xl border border-[#F5C6C2] bg-[#FFF0EC] px-4 py-3 text-sm text-[#B83C35]">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">

              <button
                type="submit"
                disabled={
                  loading ||
                  isPending ||
                  hasReachedLimit
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9D263B] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#862033] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Heart size={16} />
                    Publish Service for Review
                  </>
                )}

              </button>

              <Link
                href="/dashboard/vendor/services"
                className="inline-flex items-center justify-center rounded-xl border border-[#F0E3DC] bg-white px-6 py-3.5 text-sm font-medium text-[#8C746B] transition hover:border-[#FF5B52] hover:bg-[#FFF0EC]"
              >
                Cancel
              </Link>

            </div>

          </form>

        )}

      </div>
    </div>
  );
}
