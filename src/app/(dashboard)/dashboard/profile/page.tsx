
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

  // Load Profile
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

  // Handle Input Change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Photo Change
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

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  // Save Profile
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user?.id || !profile) {
      toast.error("Profile not found");
      return;
    }

    try {
      setIsSaving(true);

      let imageUrl = profile.image || "";

      if (photo) {
        imageUrl = await uploadImage(photo);
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

  // Reset Changes
  const handleReset = () => {
    if (!session?.user?.id) return;

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPhoto(null);
    fetchProfile(session.user.id);
  };

  // Shared Styles
  const inputClass =
    "w-full rounded-lg border border-[#eadfd9] bg-white px-3.5 py-2.5 text-sm text-[#421b24] outline-none transition placeholder:text-[#b49fa2] focus:border-[#922638] focus:ring-2 focus:ring-[#922638]/10 disabled:cursor-not-allowed disabled:bg-[#f8f5f3]";

  const labelClass =
    "mb-1.5 block text-xs font-semibold text-[#421b24]";

  // Loading
  if (isPending || isLoading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#922638]" />
      </div>
    );
  }

  // Not Logged In
  if (!session?.user?.id) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center gap-3">
        <UserRound className="h-10 w-10 text-[#b49fa2]" />

        <h2 className="font-semibold text-[#421b24]">
          Please sign in
        </h2>

        <p className="text-sm text-[#8b7478]">
          Sign in to view your vendor dashboard.
        </p>
      </div>
    );
  }

  // Profile Not Found
  if (!profile) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center gap-4">
        <UserRound className="h-10 w-10 text-[#b49fa2]" />

        <p className="text-sm text-[#8b7478]">
          Unable to load your profile.
        </p>

        <button
          onClick={() => fetchProfile(session.user.id)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#922638] px-4 py-2 text-sm font-semibold text-white hover:bg-[#761d2e]"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf9] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-4xl space-y-4">

        {/* Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#421b24]">
              Vendor Profile
            </h1>

            <p className="mt-1 text-xs text-[#8b7478]">
              Manage your personal and business information.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f8e9ec] px-3 py-1.5 text-xs font-semibold capitalize text-[#922638]">
            <Store size={14} />
            {profile.role || "Vendor"} Account
          </span>
        </div>

        {/* Profile Overview */}
        <div className="overflow-hidden rounded-xl border border-[#eadfd9] bg-white shadow-sm">
          <div className="h-20 bg-gradient-to-r from-[#761d2e] to-[#b64c60]" />

          <div className="px-4 pb-4 sm:px-5">
            <div className="-mt-9 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-xl border-[3px] border-white bg-[#922638] text-2xl font-bold text-white shadow-sm">
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

              <div className="min-w-0 flex-1 pb-1">
                <h2 className="truncate text-base font-bold text-[#421b24]">
                  {profile.name || "Unnamed User"}
                </h2>

                <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#8b7478]">
                  <Mail size={13} />
                  {profile.email}
                </p>

                {profile.businessName && (
                  <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#8b7478]">
                    <Store size={13} />
                    {profile.businessName}
                  </p>
                )}
              </div>

              <span
                className={`mb-1 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  profile.isBlocked
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-700"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {profile.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Personal Information */}
          <div className="rounded-xl border border-[#eadfd9] bg-white p-4 shadow-sm sm:p-5">

            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f8e9ec] text-[#922638]">
                <User size={17} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#421b24]">
                  Personal Information
                </h2>

                <p className="text-[11px] text-[#8b7478]">
                  Update your personal details.
                </p>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-[#eadfd9] bg-[#fcfaf9] p-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#922638] text-lg font-bold text-white">
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

              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-[#421b24]">
                  Profile Photo
                </h3>

                <p className="mt-1 text-[11px] text-[#8b7478]">
                  PNG, JPG or WebP · Maximum 5MB
                </p>

                {photo && (
                  <p className="mt-1 text-[11px] font-medium text-[#922638]">
                    New photo selected.
                  </p>
                )}
              </div>

              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#eadfd9] bg-white px-3 py-2 text-xs font-semibold text-[#421b24] transition hover:border-[#922638] hover:text-[#922638]">
                <Camera size={14} />
                Change Photo

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoChange}
                  disabled={isSaving}
                  className="hidden"
                />
              </label>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Full Name */}
              <div>
                <label className={labelClass}>
                  Full Name <span className="text-[#922638]">*</span>
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
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a18c90]"
                  />

                  <input
                    type="email"
                    value={profile.email || ""}
                    disabled
                    className={`${inputClass} cursor-not-allowed bg-[#f8f5f3] pl-9`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a18c90]"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1XXXXXXXXX"
                    disabled={isSaving}
                    className={`${inputClass} pl-9`}
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
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a18c90]"
                  />

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    disabled={isSaving}
                    className={`${inputClass} pl-9`}
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
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a18c90]"
                    />

                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Enter your business name"
                      disabled={isSaving}
                      className={`${inputClass} pl-9`}
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
                    size={15}
                    className="absolute left-3 top-3 text-[#a18c90]"
                  />

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                    disabled={isSaving}
                    placeholder="Tell customers about yourself and your business..."
                    className={`${inputClass} resize-none pl-9`}
                  />
                </div>

                <p className="mt-1 text-right text-[10px] text-[#a18c90]">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#f0e8e4] pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving || isLoading}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#eadfd9] bg-white px-4 py-2.5 text-xs font-semibold text-[#421b24] transition hover:bg-[#fcfaf9] disabled:opacity-50"
              >
                <RefreshCw size={14} />
                Reset
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#922638] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#761d2e] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Account Information */}
        <div className="rounded-xl border border-[#eadfd9] bg-white p-4 shadow-sm sm:p-5">

          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f8e9ec] text-[#922638]">
              <ShieldCheck size={17} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#421b24]">
                Account Information
              </h2>

              <p className="text-[11px] text-[#8b7478]">
                Your account and subscription details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {/* Account Status */}
            <div className="flex items-center gap-3 rounded-lg bg-[#fcfaf9] p-3">
              <ShieldCheck size={18} className="shrink-0 text-[#922638]" />

              <div>
                <p className="text-[11px] text-[#8b7478]">
                  Account Status
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#421b24]">
                  {profile.isBlocked ? "Blocked" : "Active"}
                </p>
              </div>
            </div>

            {/* Business Name */}
            <div className="flex items-center gap-3 rounded-lg bg-[#fcfaf9] p-3">
              <Store size={18} className="shrink-0 text-[#922638]" />

              <div className="min-w-0">
                <p className="text-[11px] text-[#8b7478]">
                  Business Name
                </p>

                <p className="mt-0.5 truncate text-xs font-semibold text-[#421b24]">
                  {profile.businessName || "Not added"}
                </p>
              </div>
            </div>

            {/* Subscription Expiry */}
            <div className="flex items-center gap-3 rounded-lg bg-[#fcfaf9] p-3">
              <CalendarDays size={18} className="shrink-0 text-[#922638]" />

              <div>
                <p className="text-[11px] text-[#8b7478]">
                  Subscription Expiry
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#421b24]">
                  {profile.subscriptionExpiresAt
                    ? new Date(
                        profile.subscriptionExpiresAt
                      ).toLocaleDateString()
                    : "No expiration"}
                </p>
              </div>
            </div>

            {/* Subscription Plan */}
            <div className="flex items-center gap-3 rounded-lg bg-[#fcfaf9] p-3">
              <ShieldCheck size={18} className="shrink-0 text-[#922638]" />

              <div>
                <p className="text-[11px] text-[#8b7478]">
                  Subscription Plan
                </p>

                <p className="mt-0.5 text-xs font-semibold capitalize text-[#421b24]">
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
