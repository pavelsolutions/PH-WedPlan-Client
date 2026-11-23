
"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import DashboardSidebar, {
  navigation,
  type DashboardRole,
} from "./dashboard-sidebar";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Heart,
  ChevronDown,
  LogOut,
  User,
  Menu,
  CalendarDays,
  LayoutDashboard,
  BriefcaseBusiness,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import { DashboardUserProvider, useDashboardUser } from "@/app/context/dashboard-user-context";

interface DashboardShellProps {
  children: ReactNode;
  role: DashboardRole;
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

function DashboardShellContent({
  children,
  role,
}: {
  children: ReactNode;
  role: DashboardRole;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useDashboardUser();

  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic navigation based on user role
  const navbarNavigation = {
    vendor: [
      { title: "Home", href: "/" },
      { title: "Browse Services", href: "/services" },
      { title: "My Services", href: "/dashboard/vendor/services" },
      { title: "Bookings", href: "/dashboard/vendor/bookings" },
    ],
    customer: [
      { title: "Home", href: "/" },
      { title: "Browse Services", href: "/services" },
      { title: "My Bookings", href: "/dashboard/customer/bookings" },
    ],
    admin: [
      { title: "Home", href: "/" },
      { title: "Browse Services", href: "/services" },
      { title: "Users", href: "/dashboard/admin/users" },
      { title: "Services", href: "/dashboard/admin/services" },
    ],
  };

  const navLinks = navbarNavigation[role] ?? [];


  const initials = (user.name || "User")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const dashboardPath = {
    vendor: "/dashboard/vendor",
    customer: "/dashboard/customer",
    admin: "/dashboard/admin",
  }[role];

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || "Logout failed");
      }

      toast.success("Logged out successfully!");

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoggingOut(false);
    }
  };

  // Active navigation checker
  const isActive = (href: string) => {
    if (pathname === href) return true;

    // Avoid keeping Overview active on every dashboard page
    if (href === dashboardPath) return false;

    return pathname.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] text-[#302521]">

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-[#eadfd8] bg-white/95 backdrop-blur-md">

        <div className="mx-auto flex h-[58px] w-full max-w-[1200px] items-center justify-between gap-3 px-4">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#dc2027] text-white">
              <Heart size={17} fill="currentColor" />
            </div>

            <div>
              <h1 className="text-base font-bold leading-4 text-[#dc2027]">
                WedPlan
              </h1>

              <p className="text-[8px] tracking-[1px] text-[#9a8580]">
                WEDDING MARKETPLACE
              </p>
            </div>

          </Link>

          {/* Desktop Dynamic Navigation */}
          <nav className="hidden items-center gap-1 overflow-x-auto sm:flex">

            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-2 text-xs transition-colors",
                  isActive(item.href)
                    ? "bg-[#f8e9ed] font-semibold text-[#dc2027]"
                    : "text-[#75645d] hover:bg-[#fff0ec] hover:text-[#dc2027]"
                )}
              >
                {item.title}
              </Link>
            ))}

          </nav>

          {/* Profile Dropdown */}
          <DropdownMenu>

            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex shrink-0 items-center gap-2 rounded-full border border-[#eadfd8] px-2 py-1 outline-none transition hover:bg-[#fff5f5]"
                >
                  <Avatar className="h-7 w-7">

                    <AvatarImage src={user.image || ""} />

                    <AvatarFallback className="bg-[#075c4c] text-xs text-white">
                      {initials}
                    </AvatarFallback>

                  </Avatar>

                  <div className="hidden text-left sm:block">

                    <p className="max-w-24 truncate text-[11px] font-semibold">
                      {user.name || "User"}
                    </p>

                    <p className="text-[9px] capitalize text-[#9a8580]">
                      {role}
                    </p>

                  </div>

                  <ChevronDown size={13} />
                </button>
              }
            />

            <DropdownMenuContent align="end" className="w-56">

              <DropdownMenuGroup>

                <DropdownMenuLabel>
                  <p>{user.name || "User"}</p>

                  <p className="truncate text-xs font-normal text-muted-foreground">
                    {user.email}
                  </p>
                </DropdownMenuLabel>

              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                disabled={loggingOut}
                className="cursor-pointer text-red-500 focus:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {loggingOut ? "Logging out..." : "Logout"}
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>
      </header>

      {/* Dashboard Container */}
      <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:py-7">

        {/* Mobile Navigation */}
        <div className="mb-4 sm:hidden">

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex w-full items-center justify-between rounded-lg border border-[#eadfd8] bg-white px-4 py-3 text-sm font-semibold"
          >

            <span className="flex items-center gap-2">
              <Menu size={17} />

              {role.charAt(0).toUpperCase() + role.slice(1)} Workspace
            </span>

            <ChevronDown
              size={16}
              className={cn(
                "transition-transform",
                mobileMenuOpen && "rotate-180"
              )}
            />

          </button>

          {mobileMenuOpen && (
            <div className="mt-2">
              <DashboardSidebar
                role={role}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </div>
          )}

        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-[250px_minmax(0,1fr)] sm:gap-6">

          {/* Sidebar */}
          <div className="hidden sm:block">
            <DashboardSidebar role={role} />
          </div>

          {/* Page Content */}
          <div className="min-w-0 w-full">
            {children}
          </div>

        </div>

      </main>

      {/* Dynamic Footer */}
      <footer className="mt-10 border-t border-[#eadfd8] bg-white">

        <div className="mx-auto w-full max-w-[1200px] px-4 py-8">

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

            {/* Brand */}
            <div>

              <Link href="/" className="flex items-center gap-2">

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#dc2027] text-white">
                  <Heart size={15} fill="currentColor" />
                </div>

                <span className="font-bold text-[#dc2027]">
                  WedPlan
                </span>

              </Link>

              <p className="mt-3 max-w-xs text-[11px] leading-5 text-[#8d7770]">
                Curating extraordinary wedding venues, photographers,
                florists and wedding professionals so couples can plan
                unforgettable celebrations with confidence.
              </p>

            </div>

            {/* Dynamic Navigation */}
            <div>

              <h3 className="text-[11px] font-bold uppercase tracking-wide text-[#302521]">
                {role} Navigation
              </h3>

              <div className="mt-3 space-y-2 text-[11px] text-[#8d7770]">

                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block transition-colors hover:text-[#dc2027]",
                      isActive(item.href) && "font-semibold text-[#dc2027]"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}

              </div>

            </div>

            {/* Categories */}
            <div>

              <h3 className="text-[11px] font-bold uppercase tracking-wide text-[#302521]">
                Categories
              </h3>

              <div className="mt-3 space-y-2 text-[11px] text-[#8d7770]">

                <Link href="/services" className="block hover:text-[#dc2027]">
                  Photography & Videography
                </Link>

                <Link href="/services" className="block hover:text-[#dc2027]">
                  Wedding Venues
                </Link>

                <Link href="/services" className="block hover:text-[#dc2027]">
                  Decoration & Florist
                </Link>

                <Link href="/services" className="block hover:text-[#dc2027]">
                  Catering Services
                </Link>

                <Link href="/services" className="block hover:text-[#dc2027]">
                  Makeup & Styling
                </Link>

              </div>

            </div>

            {/* Contact */}
            <div>

              <h3 className="text-[11px] font-bold uppercase tracking-wide text-[#302521]">
                Contact & Connect
              </h3>

              <div className="mt-3 space-y-2 text-[11px] text-[#8d7770]">

                <p>✉ concierge@wedplan.com</p>
                <p>☎ +880 1700-000000</p>
                <p>⌖ Bangladesh</p>

              </div>

            </div>

          </div>

          {/* Copyright */}
          <div className="mt-7 flex flex-col justify-between gap-2 border-t border-[#eadfd8] pt-5 text-[10px] text-[#9a8580] sm:flex-row">

            <p>
              © {new Date().getFullYear()} WedPlan Wedding Planning Platform.
              All rights reserved.
            </p>

            <p>
              Crafted for couples & verified wedding professionals.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default function DashboardShell({
  children,
  role,
  user,
}: DashboardShellProps) {
  return (
    <DashboardUserProvider initialUser={user}>
      <DashboardShellContent role={role}>
        {children}
      </DashboardShellContent>
    </DashboardUserProvider>
  );
}
