
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import {
  Heart,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
];

export default function Navbar() {
  const router = useRouter();

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;

  // Get user role
  const role =
    (user as typeof user & { role?: string })?.role || "customer";

  // Dashboard based on role
  const dashboardLink =
    role === "vendor"
      ? "/vendor/dashboard"
      : "/customer/dashboard";

  // Logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const toastId = toast.loading("Logging out...");
      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || "Logout failed.");
      }

      toast.success("Logout successful!", {
        id: toastId,
        description: "You have been logged out successfully.",
        duration: 2000,
      });

      setMenuOpen(false);

      setTimeout(() => {
        router.push("/signin");
        router.refresh();
      }, 1000);

    } catch (error) {
      toast.error("Logout failed!", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });

    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f4dcd5] bg-[#fffaf7]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-4 sm:flex-row lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f45b4f] text-white">
            <Heart size={21} fill="currentColor" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide text-[#302521]">
              Wed<span className="text-[#f45b4f]">Plan</span>
            </h1>

            <p className="text-[9px] tracking-[3px] text-[#a58b80]">
              MAKE YOUR DAY SPECIAL
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#51413b] transition-colors hover:text-[#f45b4f]"
            >
              {link.name}
            </Link>
          ))}

          {/* Authentication Loading */}
          {isPending ? (
            <Loader2
              className="animate-spin text-[#f45b4f]"
              size={20}
            />
          ) : user ? (

            /* Authenticated User Dropdown */
            <div className="relative">

              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full border border-[#eadfd9] bg-white px-3 py-2 transition hover:border-[#f45b4f]"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f45b4f] text-white">
                    <User size={17} />
                  </div>
                )}

                <span className="max-w-24 truncate text-sm font-semibold text-[#302521]">
                  {user.name || "User"}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-[#88766e] transition-transform ${menuOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-[#f4dcd5] bg-white shadow-xl">

                  {/* User Information */}
                  <div className="border-b border-[#f4dcd5] bg-[#fffaf7] p-4">

                    <div className="flex items-center gap-3">

                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f45b4f] text-white">
                          <User size={20} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#302521]">
                          {user.name || "User"}
                        </p>

                        <p className="truncate text-xs text-[#88766e]">
                          {user.email}
                        </p>

                        <p className="mt-1 text-[10px] font-semibold uppercase text-[#f45b4f]">
                          {role}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">

                    <Link
                      href={dashboardLink}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#51413b] transition hover:bg-[#fff3ef] hover:text-[#f45b4f]"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#51413b] transition hover:bg-[#fff3ef] hover:text-[#f45b4f]"
                    >
                      <Settings size={18} />
                      Profile Settings
                    </Link>

                    <div className="my-2 border-t border-[#f4dcd5]" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {loggingOut ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <LogOut size={18} />
                      )}

                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>

                  </div>
                </div>
              )}

            </div>

          ) : (

            /* Guest Navigation */
            <>
              <Link
                href="/signin"
                className="text-sm font-medium text-[#51413b] transition-colors hover:text-[#f45b4f]"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-full bg-[#f45b4f] px-6 py-2 text-sm font-medium text-white shadow-md shadow-[#f45b4f]/20 transition hover:bg-[#df493e]"
              >
                Sign Up
              </Link>
            </>
          )}

        </div>
      </nav>
    </header>
  );
}
