
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Heart,
  Mail,
  Lock,
  User,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SigninPage() {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Email and Password Login
  const handleSignin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Missing information", {
        description: "Please enter your email and password.",
      });
      return;
    }

    let toastId: string | number | undefined;

    try {
      setLoading(true);

      toastId = toast.loading("Signing you in...");

      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        throw new Error(
          error.message || "Invalid email or password."
        );
      }

      // Get authenticated user session
      const sessionResult = await authClient.getSession();

      const loggedInUser =
        sessionResult.data?.user || data?.user;

      if (!loggedInUser) {
        throw new Error("Unable to retrieve your user session.");
      }

      // Get user role
      const userRole = (
        loggedInUser as typeof loggedInUser & {
          role?: string;
        }
      ).role;

      toast.success("Login successful!", {
        id: toastId,
        description: `Welcome back, ${loggedInUser.name || "User"}!`,
        duration: 2000,
      });

      // Role-based dashboard redirect
      const dashboard =
        userRole === "vendor"
          ? "/vendor/dashboard"
          : "/customer/dashboard";

      setTimeout(() => {
        router.push(dashboard);
        router.refresh();
      }, 1000);

    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      toast.error("Login failed!", {
        id: toastId,
        description: message,
        duration: 4000,
      });

    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleSignin = async () => {
    try {
      setGoogleLoading(true);

      toast.loading("Connecting to Google...", {
        id: "google-login",
      });

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        throw new Error(
          error.message || "Google authentication failed."
        );
      }

    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Google authentication failed.";

      toast.error("Google login failed!", {
        id: "google-login",
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

          {/* Information */}
          <div className="relative z-10 my-12">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">

              <Sparkles size={15} className="text-[#f45b4f]" />

              <span className="text-xs font-medium tracking-wide text-[#e4c8bd]">
                WELCOME BACK TO WEDPLAN
              </span>

            </div>

            <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
              Your Dream Wedding
              <span className="block text-[#f45b4f]">
                Starts Here.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-8 text-[#d2c2bc]">
              Sign in to continue your wedding planning journey.
              Discover trusted professionals, manage your services,
              and make every special moment unforgettable.
            </p>

            <div className="mt-10 space-y-5">

              {[
                "Access your personalized dashboard",
                "Manage your wedding services",
                "Connect with trusted professionals",
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
              Welcome Back
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#302521]">
              Sign In to Your Account
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#88766e]">
              Enter your account details to continue your journey
              with WedPlan.
            </p>

          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSignin} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">

              <Label
                htmlFor="email"
                className="text-sm font-semibold text-[#302521]"
              >
                Email Address
              </Label>

              <div className="relative">

                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a18d84]" />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 rounded-xl border-[#eadfd9] pl-10"
                />

              </div>

            </div>

            {/* Password */}
            <div className="space-y-2">

              <Label
                htmlFor="password"
                className="text-sm font-semibold text-[#302521]"
              >
                Password
              </Label>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a18d84]" />

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#f45b4f] transition hover:text-[#df493e]"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="h-12 w-full rounded-xl bg-[#f45b4f] text-white shadow-md shadow-[#f45b4f]/20 transition hover:bg-[#df493e]"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>

          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">

            <div className="h-px flex-1 bg-[#eadfd9]" />

            <span className="text-xs text-[#a18d84]">
              OR CONTINUE WITH
            </span>

            <div className="h-px flex-1 bg-[#eadfd9]" />

          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            disabled={googleLoading || loading}
            onClick={handleGoogleSignin}
            className="h-12 w-full rounded-xl border-[#eadfd9] bg-white text-[#302521] hover:bg-[#fffaf7]"
          >
            {googleLoading ? (
              <Loader2 size={18} className="mr-2 animate-spin" />
            ) : (
              <svg
                viewBox="0 0 48 48"
                className="mr-2 h-5 w-5"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.73 7.17l7.26 5.63c4.24-3.92 6.69-9.71 6.69-17.27z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.78l-7.26-5.63c-2.01 1.35-4.59 2.15-8.65 2.15-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
            )}

            Continue with Google
          </Button>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-[#88766e]">

            Don't have an account?{" "}

            <Link
              href="/signup"
              className="font-semibold text-[#f45b4f] transition hover:text-[#df493e]"
            >
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </main>
  );
}
