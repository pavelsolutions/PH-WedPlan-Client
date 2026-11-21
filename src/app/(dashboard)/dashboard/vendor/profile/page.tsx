"use client";

import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";

import {
  Camera,
  Loader2,
  UserRound,
  RefreshCw,
  ShieldCheck,
  CalendarDays,
  Mail,
  Store,
  Phone,
  MapPin,
  FileText,
  Save,
  User,
} from "lucide-react";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

import {
  getProfile,
  updateProfile,
} from "@/lib/actions/api/users";

import { IProfile } from "@/types";
import { uploadImage } from "@/lib/uploadImage";

export default function VendorDashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  const [profile, setProfile] = useState<IProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    city: "",
    bio: "",
  });

  // Fetch Profile
  const fetchProfile = async (userId: string) => {
    try {
      setIsLoading(true);

      const data = await getProfile(userId);

      console.log("Fetched vendor profile:", data);

      setProfile(data);

      setFormData({
        name: data.name || "",
        businessName: data.businessName || "",
        phone: data.phone || "",
        city: data.city || "",
        bio: data.bio || "",
      });

      setPreview(data.image || null);
      setPhoto(null);
    } catch (error) {
      console.error("Profile fetch error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load profile"
      );

      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load profile when session is available
  useEffect(() => {
    if (isPending) return;

    const userId = session?.user?.id;

    if (!userId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    fetchProfile(userId);
  }, [session?.user?.id, isPending]);

  // Handle input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle photo selection and preview
  const handlePhotoChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    // Remove previous blob preview
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const imagePreview = URL.createObjectURL(file);

    setPhoto(file);
    setPreview(imagePreview);
  };

  // Save Profile + Upload Photo
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  console.log("Selected photo:", photo);
  console.log("Current profile image:", profile?.image);

  if (!session?.user?.id || !profile) {
    toast.error("Profile not found");
    return;
  }

  try {
    setIsSaving(true);

    let imageUrl = profile.image || "";

    if (photo) {
      console.log("Starting image upload...");

      imageUrl = await uploadImage(photo);

      console.log("Upload completed!");
      console.log("Uploaded URL:", imageUrl);
    }

    const payload = {
      ...formData,
      image: imageUrl,
    };

    const updatedProfile = await updateProfile(
      session.user.id,
      payload
    );

    setProfile(updatedProfile);
    setPreview(updatedProfile.image || imageUrl || null);
    setPhoto(null);

    toast.success("Profile updated successfully!");
  } catch (error) {
    console.error("Profile update error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to update profile"
    );
  } finally {
    setIsSaving(false);
  }
};

  // Reset changes
  const handleReset = () => {
    if (!session?.user?.id) return;

    // Revoke temporary preview URL
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPhoto(null);
    fetchProfile(session.user.id);
  };

  // Shared input style
  const inputClass =
    "w-full rounded-xl border border-[#eadfd9] bg-white px-4 py-3 text-sm text-[#421b24] outline-none transition placeholder:text-[#b49fa2] focus:border-[#922638] focus:ring-2 focus:ring-[#922638]/10 disabled:cursor-not-allowed disabled:bg-[#f8f5f3]";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#421b24]";

  // Loading
  if (isPending || isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#922638]" />
      </div>
    );
  }

  // Not logged in
  if (!session?.user?.id) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <UserRound className="h-12 w-12 text-[#b49fa2]" />

        <h2 className="text-lg font-semibold text-[#421b24]">
          Please sign in
        </h2>

        <p className="text-sm text-[#8b7478]">
          Sign in to view your vendor dashboard.
        </p>
      </div>
    );
  }

  // Profile not found
  if (!profile) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <UserRound className="h-12 w-12 text-[#b49fa2]" />

        <p className="text-sm text-[#8b7478]">
          Unable to load your profile.
        </p>

        <button
          onClick={() => fetchProfile(session.user.id)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#922638] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#761d2e]"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf9] p-4 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Page Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#421b24] sm:text-3xl">
              Vendor Profile
            </h1>

            <p className="mt-2 text-sm text-[#8b7478]">
              Manage your personal information and business details.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f8e9ec] px-4 py-2 text-xs font-semibold capitalize text-[#922638]">
            <Store size={15} />
            {profile.role || "Vendor"} Account
          </span>
        </div>

        {/* Profile Overview */}
        <div className="overflow-hidden rounded-2xl border border-[#eadfd9] bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#761d2e] to-[#b64c60]" />

          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#922638] text-3xl font-bold text-white shadow-md">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>

              <div className="flex-1 pb-1">
                <h2 className="text-xl font-bold text-[#421b24]">
                  {profile.name || "Unnamed User"}
                </h2>

                <p className="mt-1 flex items-center gap-2 text-sm text-[#8b7478]">
                  <Mail size={15} />
                  {profile.email}
                </p>

                {profile.businessName && (
                  <p className="mt-1 flex items-center gap-2 text-sm text-[#8b7478]">
                    <Store size={15} />
                    {profile.businessName}
                  </p>
                )}
              </div>

              <span
                className={`mb-1 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  profile.isBlocked
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-700"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {profile.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Information */}
          <div className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8e9ec] text-[#922638]">
                <User size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#421b24]">
                  Personal Information
                </h2>

                <p className="text-xs text-[#8b7478]">
                  Update your personal details.
                </p>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-dashed border-[#eadfd9] bg-[#fcfaf9] p-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#eadfd9] bg-[#922638] text-xl font-bold text-white">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#421b24]">
                  Profile Photo
                </h3>

                <p className="mt-1 text-xs text-[#8b7478]">
                  PNG, JPG or WebP. Maximum 5MB.
                </p>

                {photo && (
                  <p className="mt-1 text-xs font-medium text-[#922638]">
                    New photo selected. Save changes to apply.
                  </p>
                )}
              </div>

              <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-[#eadfd9] bg-white px-4 py-2.5 text-sm font-semibold text-[#421b24] transition hover:border-[#922638] hover:text-[#922638]">
                <Camera size={16} />
                Choose Photo

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoChange}
                  disabled={isSaving}
                  className="hidden"
                />
              </label>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Full Name */}
              <div>
                <label className={labelClass}>
                  Full Name <span className="text-[#922638">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  disabled={isSaving}
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a18c90]"
                  />

                  <input
                    type="email"
                    value={profile.email || ""}
                    disabled
                    className={`${inputClass} cursor-not-allowed bg-[#f8f5f3] pl-10`}
                  />
                </div>

                <p className="mt-1.5 text-xs text-[#a18c90]">
                  Email cannot be changed here.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a18c90]"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1XXXXXXXXX"
                    disabled={isSaving}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className={labelClass}>
                  City
                </label>

                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a18c90]"
                  />

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    disabled={isSaving}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Business Name */}
              {profile.role === "vendor" && (
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Business / Studio Name
                  </label>

                  <div className="relative">
                    <Store
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a18c90]"
                    />

                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Enter your business or studio name"
                      disabled={isSaving}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              )}

              {/* Bio */}
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  About You / Business Bio
                </label>

                <div className="relative">
                  <FileText
                    size={17}
                    className="absolute left-3 top-4 text-[#a18c90]"
                  />

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={5}
                    maxLength={500}
                    disabled={isSaving}
                    placeholder="Tell customers about yourself, your business, experience and services..."
                    className={`${inputClass} resize-none pl-10`}
                  />
                </div>

                <p className="mt-1.5 text-right text-xs text-[#a18c90]">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#f0e8e4] pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving || isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eadfd9] bg-white px-5 py-3 text-sm font-semibold text-[#421b24] transition hover:bg-[#fcfaf9] disabled:opacity-50"
              >
                <RefreshCw size={16} />
                Reset Changes
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#922638] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#761d2e] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Account Information */}
        <div className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8e9ec] text-[#922638]">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#421b24]">
                Account Information
              </h2>

              <p className="text-xs text-[#8b7478]">
                Your account and subscription details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Account Status */}
            <div className="flex items-start gap-3 rounded-xl bg-[#fcfaf9] p-4">
              <ShieldCheck className="mt-1 text-[#922638]" size={20} />

              <div>
                <p className="text-xs text-[#8b7478]">
                  Account Status
                </p>

                <p className="mt-1 text-sm font-semibold text-[#421b24]">
                  {profile.isBlocked ? "Blocked" : "Active"}
                </p>
              </div>
            </div>

            {/* Business Name */}
            <div className="flex items-start gap-3 rounded-xl bg-[#fcfaf9] p-4">
              <Store className="mt-1 text-[#922638]" size={20} />

              <div>
                <p className="text-xs text-[#8b7478]">
                  Business Name
                </p>

                <p className="mt-1 text-sm font-semibold text-[#421b24]">
                  {profile.businessName || "Not added"}
                </p>
              </div>
            </div>

            {/* Expiry */}
            <div className="flex items-start gap-3 rounded-xl bg-[#fcfaf9] p-4">
              <CalendarDays className="mt-1 text-[#922638]" size={20} />

              <div>
                <p className="text-xs text-[#8b7478]">
                  Subscription Expiry
                </p>

                <p className="mt-1 text-sm font-semibold text-[#421b24]">
                  {profile.subscriptionExpiresAt
                    ? new Date(
                        profile.subscriptionExpiresAt
                      ).toLocaleDateString()
                    : "No expiration"}
                </p>
              </div>
            </div>

            {/* Subscription */}
            <div className="flex items-start gap-3 rounded-xl bg-[#fcfaf9] p-4">
              <ShieldCheck className="mt-1 text-[#922638]" size={20} />

              <div>
                <p className="text-xs text-[#8b7478]">
                  Subscription Plan
                </p>

                <p className="mt-1 text-sm font-semibold capitalize text-[#421b24]">
                  {profile.subscriptionPlan || "Free"}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}