"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import DashboardSidebar, {
  type DashboardRole,
} from "./dashboard-sidebar";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Menu,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

interface DashboardShellProps {
  children: ReactNode;
  role: DashboardRole;
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

export default function DashboardShell({
  children,
  role,
  user,
}: DashboardShellProps) {
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initials = (user.name || "User")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || "Logout failed");
      }

      toast.success("Logged out successfully!");

      router.push("/signin");
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

  return (
    <div className="min-h-screen bg-[#fffaf7]">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
          <DashboardSidebar
            role={role}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </div>

        {/* Main Dashboard */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-[#f1e5df] bg-white/95 px-4 backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile Sidebar */}
              <Sheet
                open={mobileOpen}
                onOpenChange={setMobileOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="lg:hidden"
                  >
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="w-[280px] p-0"
                >
                  <SheetTitle className="sr-only">
                    Dashboard Navigation
                  </SheetTitle>

                  <DashboardSidebar
                    role={role}
                    collapsed={false}
                    setCollapsed={() => { }}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              {/* Dashboard Title */}
              <div>
                <h2 className="text-base font-bold capitalize text-[#302521] sm:text-lg">
                  {role} Dashboard
                </h2>

                <p className="hidden text-xs text-[#a58b80] sm:block">
                  Welcome back to WedPlan
                </p>
              </div>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="flex h-auto items-center gap-2 rounded-full px-2 py-1.5 outline-none hover:bg-[#fff7f4] focus-visible:ring-2 focus-visible:ring-[#f45b4f]"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.image || ""} />

                      <AvatarFallback className="bg-[#f45b4f] text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="hidden text-left sm:block">
                      <p className="max-w-28 truncate text-sm font-semibold text-[#302521]">
                        {user.name || "User"}
                      </p>

                      <p className="text-[10px] capitalize text-[#a58b80]">
                        {role}
                      </p>
                    </div>

                    <ChevronDown size={15} />
                  </button>
                }
              />

              <DropdownMenuContent
                align="end"
                className="w-56"
              >
                {/* User Information */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <p>{user.name || "User"}</p>

                    <p className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Profile Settings */}
                <DropdownMenuItem
                  onClick={() => router.push(`/dashboard/${role}/profile`)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout */}
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
          </header>

          {/* Page Content */}
          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[1600px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}