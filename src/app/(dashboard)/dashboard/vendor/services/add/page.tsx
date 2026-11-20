
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    ImagePlus,
    MapPin,
    X,
    Heart,
    Clock3,
} from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/uploadImage";
import { CreateServicePayload, ServiceCategory } from "@/types";
import { createService } from "@/lib/actions/services";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

const categories = [
    "Photography & Videography",
    "Wedding Venues",
    "Decoration & Florist",
    "Catering Services",
    "Makeup & Styling",
    "Wedding Fashion",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function AddServicePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user?.id;
    // console.log(user, "user data");

    // Form states
    const [serviceName, setServiceName] = useState("");
    // const [category, setCategory] = useState("");
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

    // ----------------------------------------
    // Handle image selection
    // ----------------------------------------
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Invalid image", {
                description: "Please select a valid image.",
            });

            e.target.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error("Image too large", {
                description: "Image size must be less than 5MB.",
            });

            e.target.value = "";
            return;
        }

        // Remove previous preview URL
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setError("");

        toast.success("Image selected successfully!");
    };

    // ----------------------------------------
    // Remove selected image
    // ----------------------------------------
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

    // ----------------------------------------
    // Form validation
    // ----------------------------------------
    const validateForm = () => {
        if (!serviceName.trim()) {
            setError("Service name is required.");
            return false;
        }

        if (!category) {
            setError("Please select a service category.");
            return false;
        }

        if (!price || Number(price) <= 0) {
            setError("Please enter a valid service price.");
            return false;
        }

        if (!location.trim()) {
            setError("Service location is required.");
            return false;
        }

        if (!description.trim()) {
            setError("Service description is required.");
            return false;
        }

        if (!imageFile) {
            setError("Please upload a service image.");
            return false;
        }

        setError("");
        return true;
    };

    // ----------------------------------------
    // Submit service
    // ----------------------------------------
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please complete the form");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // 1. Upload image
            toast.loading("Uploading service image...", {
                id: "service-upload",
            });

            const imageUrl = await uploadImage(imageFile!);

            toast.success("Image uploaded successfully!", {
                id: "service-upload",
            });

            // 2. Prepare service data
            // Better Auth session


            const serviceData: CreateServicePayload = {
                serviceName: serviceName.trim(),
                category: category as ServiceCategory,
                description: description.trim(),
                price: Number(price),
                location: location.trim(),
                image: imageUrl,
                vendorId: user,
            };

            //  3. Save to backend 
            // const response = await fetch(
            //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/services`,
            //   {
            //     method: "POST",
            //     headers: {
            //       "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(serviceData),
            //   }
            // );

            // API function call
            const result = await createService(serviceData);

            // 4. Success notification
            toast.success("Service submitted successfully!", {
                description: "Your service is now pending admin approval.",
            });

            // 5. Reset form
            setServiceName("");
            setCategory("");
            setPrice("");
            setLocation("");
            setDescription("");
            removeImage();

            // 6. Redirect
            router.push("/dashboard/vendor/services");

        } catch (err) {
            console.error("Add service error:", err);

            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.";

            setError(errorMessage);

            toast.error("Failed to add service", {
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-full bg-[#FCFAF8] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Page Header */}
                <div className="mb-6 border-b border-[#F0E3DC] pb-5">
                    <Link
                        href="/dashboard/vendor/services"
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#FF5B52] transition hover:text-[#E44840]"
                    >
                        <ArrowLeft size={16} />
                        Back to Services
                    </Link>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#352621] sm:text-4xl">
                                Add New Wedding Service
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-[#8C746B] sm:text-base">
                                Publish a new wedding package. Submissions start as Pending
                                until reviewed by an administrator.
                            </p>
                        </div>

                        {/* Status Badge */}
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F3D6CE] bg-[#FFF0EC] px-3 py-2 text-xs font-semibold text-[#C74D43]">
                            <Clock3 size={14} />
                            Pending Review
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-[#F0E3DC] bg-white p-5 shadow-[0_2px_5px_rgba(75,40,30,0.04)] sm:p-7 lg:p-8"
                >
                    {/* Form Heading */}
                    <div className="mb-7">
                        <h2 className="font-serif text-2xl font-bold text-[#352621]">
                            Service Details
                        </h2>

                        <p className="mt-2 text-sm text-[#8C746B]">
                            Provide clear pricing, location coverage, and a high-quality
                            photograph of your service.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2">

                        {/* Service Name */}
                        <div>
                            <label
                                htmlFor="serviceName"
                                className="mb-2 block text-sm font-medium text-[#352621]"
                            >
                                Service Name <span className="text-[#FF5B52]">*</span>
                            </label>

                            <input
                                id="serviceName"
                                type="text"
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                                placeholder="e.g. Full-Day Editorial Wedding Photography"
                                required
                                className="w-full rounded-xl border border-[#F0E3DC] bg-white px-3.5 py-3 text-sm text-[#352621] outline-none transition placeholder:text-[#A18C90] focus:border-[#FF5B52] focus:ring-4 focus:ring-[#FF5B52]/10"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label
                                htmlFor="category"
                                className="mb-2 block text-sm font-medium text-[#352621]"
                            >
                                Service Category <span className="text-[#FF5B52]">*</span>
                            </label>

                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full rounded-xl border border-[#F0E3DC] bg-white px-3.5 py-3 text-sm text-[#352621] outline-none transition focus:border-[#FF5B52] focus:ring-4 focus:ring-[#FF5B52]/10"
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
                                Starting Price (BDT){" "}
                                <span className="text-[#FF5B52]">*</span>
                            </label>

                            <div className="flex overflow-hidden rounded-xl border border-[#F0E3DC] bg-white transition focus-within:border-[#FF5B52] focus-within:ring-4 focus-within:ring-[#FF5B52]/10">
                                <span className="flex items-center border-r border-[#F0E3DC] bg-[#FCFAF8] px-4 text-sm font-medium text-[#8C746B]">
                                    ৳
                                </span>

                                <input
                                    id="price"
                                    type="number"
                                    min="1"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="25000"
                                    required
                                    className="w-full bg-white px-3.5 py-3 text-sm text-[#352621] outline-none placeholder:text-[#A18C90]"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label
                                htmlFor="location"
                                className="mb-2 block text-sm font-medium text-[#352621]"
                            >
                                Location / Coverage Area{" "}
                                <span className="text-[#FF5B52]">*</span>
                            </label>

                            <div className="flex items-center overflow-hidden rounded-xl border border-[#F0E3DC] bg-white transition focus-within:border-[#FF5B52] focus-within:ring-4 focus-within:ring-[#FF5B52]/10">
                                <MapPin
                                    size={17}
                                    className="ml-3.5 shrink-0 text-[#B49A91]"
                                />

                                <input
                                    id="location"
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. Dhaka, Bangladesh"
                                    required
                                    className="w-full bg-white px-3 py-3 text-sm text-[#352621] outline-none placeholder:text-[#A18C90]"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-[#352621]"
                            >
                                Service Description{" "}
                                <span className="text-[#FF5B52]">*</span>
                            </label>

                            <textarea
                                id="description"
                                rows={5}
                                maxLength={2000}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe deliverables, hours of coverage, customization options, and what makes your service special..."
                                required
                                className="w-full resize-y rounded-xl border border-[#F0E3DC] bg-white px-3.5 py-3 text-sm leading-6 text-[#352621] outline-none transition placeholder:text-[#A18C90] focus:border-[#FF5B52] focus:ring-4 focus:ring-[#FF5B52]/10"
                            />

                            <div className="mt-1.5 flex justify-end">
                                <span className="text-xs text-[#A18C90]">
                                    {description.length}/2000
                                </span>
                            </div>
                        </div>

                        {/* Single Image Upload */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-[#352621]">
                                Service Image <span className="text-[#FF5B52]">*</span>
                            </label>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {imagePreview ? (
                                <div className="relative overflow-hidden rounded-xl border border-[#F0E3DC] bg-white">
                                    <img
                                        src={imagePreview}
                                        alt="Selected service"
                                        className="h-64 w-full object-cover sm:h-80"
                                    />

                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        aria-label="Remove selected image"
                                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#9D263B] shadow-md transition hover:bg-[#FFF0EC]"
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
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#F0E3DC] bg-[#FCFAF8] p-8 text-center transition hover:border-[#FF5B52] hover:bg-[#FFF0EC] sm:p-10"
                                >
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0EC] text-[#FF5B52]">
                                        <ImagePlus size={24} />
                                    </div>

                                    <span className="text-sm font-semibold text-[#352621]">
                                        Click to upload service image
                                    </span>

                                    <span className="mt-2 text-xs text-[#8C746B]">
                                        PNG, JPG, or WebP · Maximum 5MB
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-5 rounded-xl border border-[#F5C6C2] bg-[#FFF0EC] px-4 py-3 text-sm text-[#B83C35]">
                            {error}
                        </div>
                    )}


                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9D263B] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#862033] focus:outline-none focus:ring-4 focus:ring-[#9D263B]/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Clock3 size={16} className="animate-spin" />
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
                            className="inline-flex items-center justify-center rounded-xl border border-[#F0E3DC] bg-white px-6 py-3.5 text-sm font-medium text-[#8C746B] transition hover:border-[#FF5B52] hover:bg-[#FFF0EC] hover:text-[#FF5B52]"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
