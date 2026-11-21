
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  UserRound,
  BriefcaseBusiness,
  ShieldCheck,
  Ban,
  RefreshCw,
  Eye,
  X,
  Mail,
  CalendarDays,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { getAdminUsers, updateAdminUser } from "@/lib/actions/api/users";


type User = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getAdminUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Block / Unblock user
  const handleBlockUser = async (
    userId: string,
    isBlocked: boolean
  ) => {
    try {
      setUpdatingId(userId);

      await updateAdminUser(userId, isBlocked);

      setUsers((prev) =>
        prev.map((user) =>
          (user._id || user.id) === userId
            ? { ...user, isBlocked }
            : user
        )
      );

      setSelectedUser((prev) =>
        prev && (prev._id || prev.id) === userId
          ? { ...prev, isBlocked }
          : prev
      );

      toast.success(
        isBlocked
          ? "User blocked successfully"
          : "User unblocked successfully"
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    } finally {
      setUpdatingId(null);
    }
  };

  // Search and role filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = (user.name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const role = (user.role || "customer").toUpperCase();

      const matchesSearch =
        name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase());

      const matchesRole =
        filter === "ALL" || role === filter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, filter]);

  // Statistics
  const stats = {
    total: users.length,
    customers: users.filter(
      (user) =>
        (user.role || "customer").toUpperCase() === "CUSTOMER"
    ).length,
    vendors: users.filter(
      (user) => (user.role || "").toUpperCase() === "VENDOR"
    ).length,
    blocked: users.filter(
      (user) => user.isBlocked === true
    ).length,
  };

  const getRoleStyle = (role?: string) => {
    switch ((role || "customer").toUpperCase()) {
      case "ADMIN":
        return "bg-purple-50 text-purple-700";
      case "VENDOR":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-green-50 text-green-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-[#f45b4f]">
              Admin Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#302521] sm:text-3xl">
              Manage Users
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              View and manage all registered platform users.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#f1e5df] bg-white px-4 py-2.5 text-sm font-semibold text-[#302521] transition hover:bg-[#fff1ed] disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Total Users",
              value: stats.total,
              icon: Users,
              color: "text-[#f45b4f]",
              bg: "bg-[#fff0eb]",
            },
            {
              label: "Customers",
              value: stats.customers,
              icon: UserRound,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Vendors",
              value: stats.vendors,
              icon: BriefcaseBusiness,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Blocked Users",
              value: stats.blocked,
              icon: Ban,
              color: "text-red-600",
              bg: "bg-red-50",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#f1e5df] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.label}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[#302521]">
                    {item.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${item.bg}`}>
                  <item.icon className={item.color} size={22} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Role Filter */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[#f1e5df] bg-white p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-[#eee4df] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#f45b4f]"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-[#eee4df] bg-white px-4 py-3 text-sm outline-none focus:border-[#f45b4f]"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="VENDOR">Vendor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-2xl border border-[#f1e5df] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#f1e5df] px-5 py-4">
            <h2 className="font-bold text-[#302521]">
              Registered Users
            </h2>

            <span className="text-sm text-gray-500">
              {filteredUsers.length} users
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <RefreshCw
                className="animate-spin text-[#f45b4f]"
                size={28}
              />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
              <Users size={38} className="text-gray-300" />
              <p className="mt-3 font-semibold text-[#302521]">
                No users found
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or role filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#fffaf7] text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-5 py-4">Account Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f4eeeb]">
                  {filteredUsers.map((user) => {
                    const userId = user._id || user.id;
                    const blocked = user.isBlocked === true;
                    const isAdmin =
                      (user.role || "").toUpperCase() === "ADMIN";
                    const busy = updatingId === userId;

                    return (
                      <tr
                        key={userId || user.email}
                        className="transition hover:bg-[#fffaf7]"
                      >
                        {/* User */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#fff0eb] font-bold text-[#f45b4f]">
                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt={user.name || "User"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                (user.name || user.email || "U")
                                  .charAt(0)
                                  .toUpperCase()
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-[#302521]">
                                {user.name || "Unnamed User"}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {user.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getRoleStyle(user.role)}`}
                          >
                            {(user.role || "CUSTOMER").toUpperCase()}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-4 text-sm text-gray-500">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>

                        {/* Account Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              blocked
                                ? "bg-red-50 text-red-600"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            {blocked ? (
                              <Ban size={13} />
                            ) : (
                              <CheckCircle2 size={13} />
                            )}
                            {blocked ? "Blocked" : "Active"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              title="View Details"
                              onClick={() => setSelectedUser(user)}
                              className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              title={blocked ? "Unblock User" : "Block User"}
                              disabled={busy || !userId || isAdmin}
                              onClick={() =>
                                userId &&
                                handleBlockUser(userId, !blocked)
                              }
                              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                blocked
                                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                                  : "bg-red-50 text-red-600 hover:bg-red-100"
                              }`}
                            >
                              {busy ? (
                                <RefreshCw
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : blocked ? (
                                <ShieldCheck size={15} />
                              ) : (
                                <ShieldAlert size={15} />
                              )}

                              {busy
                                ? "Updating..."
                                : blocked
                                  ? "Unblock"
                                  : "Block"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#302521]">
                User Details
              </h2>

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#fff0eb] text-2xl font-bold text-[#f45b4f]">
                {selectedUser.image ? (
                  <img
                    src={selectedUser.image}
                    alt={selectedUser.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (selectedUser.name || selectedUser.email || "U")
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>

              <h3 className="mt-3 text-xl font-bold text-[#302521]">
                {selectedUser.name || "Unnamed User"}
              </h3>

              <span
                className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(selectedUser.role)}`}
              >
                {(selectedUser.role || "CUSTOMER").toUpperCase()}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-[#fffaf7] p-3">
                <Mail size={19} className="text-[#f45b4f]" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="break-all text-sm font-medium text-[#302521]">
                    {selectedUser.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#fffaf7] p-3">
                <CalendarDays size={19} className="text-[#f45b4f]" />
                <div>
                  <p className="text-xs text-gray-500">Joined Date</p>
                  <p className="text-sm font-medium text-[#302521]">
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#fffaf7] p-3">
                {selectedUser.isBlocked ? (
                  <Ban size={19} className="text-red-500" />
                ) : (
                  <CheckCircle2 size={19} className="text-green-600" />
                )}

                <div>
                  <p className="text-xs text-gray-500">Account Status</p>
                  <p
                    className={`text-sm font-semibold ${
                      selectedUser.isBlocked
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {selectedUser.isBlocked ? "Blocked" : "Active"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full rounded-xl bg-[#f45b4f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e84d42]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
