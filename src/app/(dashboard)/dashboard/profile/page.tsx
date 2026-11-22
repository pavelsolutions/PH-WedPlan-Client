
"use client";

import { useEffect, useRef, useState, ChangeEvent, FormEvent } from "react";
import {
  Camera, Loader2, UserRound, RefreshCw, ShieldCheck,
  CalendarDays, Mail, Store, Phone, MapPin, Save, Crown,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/uploadImage";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IProfile } from "@/types";
import { getProfile, updateProfile } from "@/lib/actions/api/users";

export default function VendorDashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    city: "",
    bio: "",
  });

  const fetchProfile = async (id: string) => {
    try {
      setLoading(true);
      const response = await getProfile(id);
      const data = response?.data || response;

      if (!data) {
        setProfile(null);
        return;
      }

      setProfile(data);
      setFormData({
        name: data.name || "",
        businessName: data.businessName || "",
        phone: data.phone || "",
        city: data.city || "",
        bio: data.bio || "",
      });
      setPreview(data.image || "");
      setPhoto(null);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) fetchProfile(session.user.id);
    else if (!isPending) setLoading(false);
  }, [session?.user?.id, isPending]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    try {
      setSaving(true);

      let image = profile?.image || "";
      if (photo) image = await uploadImage(photo);

      const payload = { ...formData, image };
      const response = await updateProfile(session.user.id, payload);

      if (response?.success === false) {
        throw new Error(response.message || "Update failed");
      }

      setProfile((prev) => prev ? { ...prev, ...payload } : prev);
      setPhoto(null);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    if (session?.user?.id) fetchProfile(session.user.id);
  };

  if (loading || isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#dc2027]" />
      </div>
    );
  }

  if (!session?.user) {
    return <p className="py-20 text-center">Please login first.</p>;
  }

  if (!profile) {
    return <p className="py-20 text-center">Profile not found.</p>;
  }

  const plan = profile.subscriptionPlan || "Free";

  return (
    <div className="min-h-screen bg-[#FCFAF9] px-4 py-6 md:px-7">
      <div className="mx-auto max-w-5xl space-y-5">

        {/* Heading */}
        <div>
          <p className="text-xs font-semibold tracking-wider text-[#dc2027]">
            VENDOR ACCOUNT
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#292020]">
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile and business information.
          </p>
        </div>

        {/* Profile Header */}
        <Card className="overflow-hidden rounded-xl border-[#eee3df] shadow-sm">
          <div className="h-1.5 bg-[#dc2027]" />
          <CardContent className="flex flex-col items-center justify-between gap-4 p-5 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-[#f5e5e5]">
                  <AvatarImage src={preview} />
                  <AvatarFallback className="bg-[#f8e9e9] text-[#dc2027]">
                    {profile.name?.charAt(0)?.toUpperCase() || "V"}
                  </AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 rounded-full bg-[#dc2027] p-1.5 text-white"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <h2 className="font-semibold text-[#292020]">
                  {profile.businessName || profile.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {profile.email}
                </p>
                <div className="mt-2 flex gap-2">
                  <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                    {profile.isBlocked ? "Blocked" : "Active"}
                  </Badge>
                  <Badge variant="outline" className="border-[#ead6d5] text-[#dc2027]">
                    {plan} Plan
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[#fff5f4] px-4 py-3">
              <Crown className="h-5 w-5 text-[#dc2027]" />
              <div>
                <p className="text-[11px] text-muted-foreground">Subscription</p>
                <p className="text-sm font-semibold text-[#dc2027]">{plan}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Summary */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="rounded-xl border-[#eee3df] shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <CalendarDays className="h-5 w-5 text-[#dc2027]" />
              <div>
                <p className="text-xs text-muted-foreground">Subscription Expiry</p>
                <p className="text-sm font-semibold">
                  {profile.subscriptionExpiresAt
                    ? new Date(profile.subscriptionExpiresAt).toLocaleDateString()
                    : "No expiry date"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-[#eee3df] shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <ShieldCheck className="h-5 w-5 text-[#dc2027]" />
              <div>
                <p className="text-xs text-muted-foreground">Account Status</p>
                <p className="text-sm font-semibold">
                  {profile.isBlocked ? "Blocked" : "Active"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Personal Details */}
          <Card className="rounded-xl border-[#eee3df] shadow-sm">
            <CardHeader className="px-5 pb-2 pt-5">
              <CardTitle className="text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 px-5 pb-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input name="name" value={formData.name} onChange={handleChange}
                    placeholder="Full name" className="h-10 pl-9" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input value={profile.email || ""} disabled className="h-10 pl-9" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="Phone number" className="h-10 pl-9" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>City / Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input name="city" value={formData.city} onChange={handleChange}
                    placeholder="Your city" className="h-10 pl-9" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card className="rounded-xl border-[#eee3df] shadow-sm">
            <CardHeader className="px-5 pb-2 pt-5">
              <CardTitle className="text-base">Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-5 pb-5">
              <div className="space-y-1.5">
                <Label>Business Name</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input name="businessName" value={formData.businessName}
                    onChange={handleChange} placeholder="Business name"
                    className="h-10 pl-9" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Business Description</Label>
                <Textarea name="bio" value={formData.bio} onChange={handleChange}
                  placeholder="Tell customers about your business..."
                  className="min-h-24 resize-none" />
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#ead6d5] bg-[#fffafa] p-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={preview} />
                  <AvatarFallback><UserRound className="h-5 w-5" /></AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Profile Photo</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {photo?.name || "JPG, PNG or WEBP · Max 5MB"}
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm"
                  onClick={() => fileRef.current?.click()}>
                  Change
                </Button>
              </div>

              <input ref={fileRef} type="file" accept="image/*"
                onChange={handlePhoto} className="hidden" />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleReset}
              disabled={saving}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button type="submit" disabled={saving}
              className="bg-[#dc2027] hover:bg-[#771d2d]">
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
