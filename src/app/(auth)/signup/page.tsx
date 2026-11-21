"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import {
  Heart,
  User,
  Mail,
  Lock,
  UploadCloud,
  Store,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Loader2,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"vendor" | "customer">("customer");

  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);



  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Password validation
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  const passwordValid =
    hasMinLength && hasUppercase && hasLowercase;

  // Handle Image Selection
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

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "Image size must be less than 5MB.",
      });
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    toast.success("Image selected successfully!");
  };

  // Remove Selected Image
  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");
  };

  // Upload Image to ImgBB
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Image upload failed.");
    }

    return data.imageUrl;
  };

  // Email and Password Signup
  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Missing information", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    if (!passwordValid) {
      toast.error("Invalid password", {
        description: "Please follow all password requirements.",
      });
      return;
    }

    let toastId: string | number | undefined;

    try {
      setLoading(true);

      toastId = toast.loading("Creating your account...");

      let uploadedImageUrl = "";

      // Upload image if selected
      if (imageFile) {
        toast.loading("Uploading profile image...", {
          id: toastId,
        });

        uploadedImageUrl = await uploadImage(imageFile);
      }

      // Better Auth Signup
      toast.loading("Registering your account...", {
        id: toastId,
      });

      const { data, error: authError } =
        await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
          image: uploadedImageUrl || undefined,
          role,
        });


      if (authError) {
        throw new Error(
          authError.message || "Registration failed."
        );
      }

      if (!data) {
        throw new Error(
          "Registration failed. Please try again."
        );
      }

      toast.success("Registration successful!", {
        id: toastId,
        description: `Welcome to WedPlan! Your ${role} account has been created.`,
        duration: 2500,
      });

      // Redirect based on account role

      const dashboard =
        role === "vendor"
          ? "/dashboard/vendor"
          : role === "customer"
            ? "/dashboard/customer"
            : "/dashboard/admin";

            
            setTimeout(() => {
                router.push(dashboard);
                router.refresh();
            }, 1200);

      // setTimeout(() => {
      //   router.push(
      //     role === "vendor"
      //       ? "/vendor/dashboard"
      //       : "/customer/dashboard"
      //   )
      //   router.refresh();
      // }, 1200);

    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong.";

      toast.error("Registration failed!", {
        id: toastId,
        description: message,
        duration: 4000,
      });

    } finally {
      setLoading(false);
    }
  };
  // Google Signup
  const handleGoogleSignup = async () => {
    let toastId: string | number | undefined;

    try {
      setGoogleLoading(true);

      toastId = toast.loading("Connecting to Google...");

      const { error: googleError } =
        await authClient.signIn.social({
          provider: "google",
          callbackURL: `/dashboard/${role}`,
          // callbackURL: "dashboard",
        });

      if (googleError) {
        throw new Error(
          googleError.message || "Google authentication failed."
        );
      }

      toast.success("Google authentication successful!", {
        id: toastId,
        description: "Redirecting you to your account...",
      });

    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Google authentication failed.";

      toast.error("Google sign-in failed!", {
        id: toastId,
        description: message,
      });

      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-10 sm:px-6 lg:py-16">

      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#302521]/5 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#302521] p-10 text-white lg:flex xl:p-14">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#f45b4f]/20 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#f45b4f]/20 blur-3xl" />

          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f45b4f]">
              <Heart size={22} fill="white" />
            </div>

            <span className="text-2xl font-bold">
              Wed<span className="text-[#f45b4f]">Plan</span>
            </span>
          </Link>

          <Link
            href="/"
            className="relative z-10 mt-6 inline-flex w-fit items-center gap-2 text-sm text-[#d2c2bc] transition hover:text-white"
          >
            <ArrowRight className="rotate-180" size={16} />
            Back to Home
          </Link>

          {/* Information */}
          <div className="relative z-10 my-12">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
              <Sparkles size={15} className="text-[#f45b4f]" />

              <span className="text-xs font-medium tracking-wide text-[#e4c8bd]">
                YOUR DREAM WEDDING STARTS HERE
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
              Create Beautiful
              <span className="block text-[#f45b4f]">
                Moments Together.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-8 text-[#d2c2bc]">
              Join WedPlan and discover everything you need
              to create your perfect wedding. Connect with
              talented professionals and turn your dream
              celebration into reality.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Discover trusted wedding professionals",
                "Explore beautiful wedding services",
                "Make your wedding planning easier",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-[#f45b4f]"
                  />

                  <span className="text-sm text-[#e6d9d4]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

          </div>

          <div className="relative z-10 border-t border-white/10 pt-6">
            <p className="text-xs text-[#bca9a1]">
              Made with love for your most special moments.
            </p>
          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="p-6 sm:p-10 lg:p-12 xl:p-14">

          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-between lg:hidden">

            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f45b4f] text-white">
                <Heart size={20} fill="white" />
              </div>

              <span className="text-xl font-bold text-[#302521]">
                Wed<span className="text-[#f45b4f]">Plan</span>
              </span>
            </Link>

            <Link href="/" className="text-sm text-[#88766e]">
              Home
            </Link>

          </div>


          {/* Heading */}
          <div className="mb-8">

            <span className="text-xs font-bold uppercase tracking-[3px] text-[#f45b4f]">
              Get Started
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#302521]">
              Create Your Account
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#88766e]">
              Join our community and start your wedding
              planning journey today.
            </p>

          </div>


          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-5">

            {/* Full Name */}
            <div className="space-y-2">

              <Label htmlFor="name" className="text-sm font-semibold text-[#302521]">
                Full Name
              </Label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a18d84]" />

                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 rounded-xl border-[#eadfd9] pl-10"
                />
              </div>

            </div>


            {/* Email */}
            <div className="space-y-2">

              <Label htmlFor="email" className="text-sm font-semibold text-[#302521]">
                Email Address
              </Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a18d84]" />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 rounded-xl border-[#eadfd9] pl-10"
                />
              </div>

            </div>


            {/* Password */}
            <div className="space-y-2">

              <Label htmlFor="password" className="text-sm font-semibold text-[#302521]">
                Password
              </Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a18d84]" />

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="h-12 rounded-xl border-[#eadfd9] pl-10 pr-11"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a18d84]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* Password Rules */}
              {/* Password Requirements - Show only when invalid */}
              {password.length > 0 && !passwordValid && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-4">

                  <p className="mb-2 text-sm font-semibold text-red-700">
                    Password must contain:
                  </p>

                  <div className="space-y-2 text-xs text-red-600">

                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        size={15}
                        className={
                          password.length >= 6
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      />
                      At least 6 characters
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        size={15}
                        className={
                          /[A-Z]/.test(password)
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      />
                      One uppercase letter
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        size={15}
                        className={
                          /[a-z]/.test(password)
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      />
                      One lowercase letter
                    </div>

                  </div>
                </div>
              )}

            </div>


            {/* Profile Image */}
            <div className="space-y-2">

              <Label htmlFor="image" className="text-sm font-semibold text-[#302521]">
                Profile Image
                <span className="ml-2 text-xs font-normal text-[#a18d84]">
                  (Optional)
                </span>
              </Label>

              <div className="rounded-xl border-2 border-dashed border-[#eadfd9] bg-[#fffaf7] p-4">

                {imagePreview ? (

                  <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center gap-3">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="h-14 w-14 rounded-full object-cover"
                      />

                      <div>
                        <p className="text-sm font-semibold text-[#302521]">
                          Image selected
                        </p>
                        <p className="text-xs text-[#a18d84]">
                          {(imageFile!.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="rounded-full p-2 text-red-500 hover:bg-red-50"
                      aria-label="Remove image"
                    >
                      <X size={18} />
                    </button>

                  </div>

                ) : (

                  <label
                    htmlFor="image"
                    className="flex cursor-pointer flex-col items-center justify-center py-3 text-center"
                  >
                    <UploadCloud size={25} className="mb-3 text-[#f45b4f]" />

                    <p className="text-sm font-semibold text-[#302521]">
                      Click to upload your image
                    </p>

                    <p className="mt-1 text-xs text-[#a18d84]">
                      PNG, JPG or JPEG (Max 5MB)
                    </p>
                  </label>

                )}

                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </div>

            </div>


            {/* Account Role */}
            <div className="space-y-3">

              <Label className="text-sm font-semibold text-[#302521]">
                Choose Account Type
              </Label>

              <div className="grid grid-cols-2 gap-3">

                {/* Vendor */}
                <button
                  type="button"
                  onClick={() => setRole("vendor")}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${role === "vendor"
                    ? "border-[#f45b4f] bg-[#fff5f1]"
                    : "border-[#eadfd9] hover:border-[#f45b4f]"
                    }`}
                >

                  <Store size={21} className="mt-1 shrink-0 text-[#f45b4f]" />

                  <div>
                    <p className="text-sm font-semibold text-[#302521]">
                      Vendor
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#a18d84]">
                      Offer wedding services
                    </p>
                  </div>

                </button>


                {/* Customer */}
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${role === "customer"
                    ? "border-[#f45b4f] bg-[#fff5f1]"
                    : "border-[#eadfd9] hover:border-[#f45b4f]"
                    }`}
                >

                  <Users size={21} className="mt-1 shrink-0 text-[#f45b4f]" />

                  <div>
                    <p className="text-sm font-semibold text-[#302521]">
                      Customer
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#a18d84]">
                      Find wedding services
                    </p>
                  </div>

                </button>

              </div>

            </div>


            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || googleLoading}
              size="lg"
              className="h-12 w-full rounded-xl bg-[#f45b4f] text-white shadow-lg shadow-[#f45b4f]/20 hover:bg-[#df493e]"
            >

              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}

            </Button>


            {/* Divider */}
            <div className="relative py-2">

              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#eadfd9]" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-[#a18d84]">
                  OR CONTINUE WITH
                </span>
              </div>

            </div>


            {/* Google Signup */}
            <Button
              type="button"
              variant="outline"
              disabled={loading || googleLoading}
              onClick={handleGoogleSignup}
              className="h-12 w-full rounded-xl border-[#eadfd9] bg-white text-sm font-semibold text-[#302521] hover:bg-[#fffaf7]"
            >

              {googleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <span className="mr-2 text-lg font-bold text-[#4285F4]">
                    G
                  </span>
                  Sign up with Google
                </>
              )}

            </Button>


            {/* Sign In */}
            <p className="pt-3 text-center text-sm text-[#88766e]">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-bold text-[#f45b4f] hover:text-[#df493e]"
              >
                Sign In
              </Link>
            </p>

          </form>


          {/* Security Note */}
          {/* <div className="mt-7 rounded-xl border border-[#f1e5df] bg-[#fffaf7] p-4">
            <div className="flex items-start gap-3">
              <Lock size={17} className="mt-0.5 shrink-0 text-[#f45b4f]" />
              <p className="text-xs leading-6 text-[#88766e]">
                Your account information will be kept secure.
                Admin accounts cannot be created through public
                registration.
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </main>
  );
}