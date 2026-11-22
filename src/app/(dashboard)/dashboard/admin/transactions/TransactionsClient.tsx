"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Search,
  ShieldCheck,
  XCircle,
  Receipt,
  Crown,
  ChevronRight,
} from "lucide-react";

type Transaction = {
  id: string;
  transactionId: string;
  sessionId: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  amount: number;
  currency: string;
  plan: string;
  status: string;
  paymentDate: string | null;
};

type Props = {
  transactions: Transaction[];
};

const RED = "#dc2027";

function money(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(date: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const config =
    normalized === "paid"
      ? {
          label: "Paid",
          className: "bg-[#EAF5ED] text-[#287347]",
          icon: CheckCircle2,
        }
      : normalized === "pending"
        ? {
            label: "Pending",
            className: "bg-[#FFF5E5] text-[#A36A18]",
            icon: Clock3,
          }
        : {
            label: "Failed",
            className: "bg-[#FDECEE] text-[#B92C36]",
            icon: XCircle,
          };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

export default function TransactionsClient({
  transactions,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter transactions
const filteredTransactions = useMemo(() => {
  const query = search.toLowerCase().trim();

  return transactions.filter((transaction) => {
    // Hide zero or negative amount transactions
    if (transaction.amount <= 0) {
      return false;
    }

    const matchesSearch =
      !query ||
      transaction.vendorName.toLowerCase().includes(query) ||
      transaction.vendorEmail.toLowerCase().includes(query) ||
      transaction.transactionId.toLowerCase().includes(query) ||
      transaction.sessionId.toLowerCase().includes(query) ||
      transaction.vendorId.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      transaction.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [transactions, search, statusFilter]);

  // Stats
  const paidTransactions = transactions.filter(
    (transaction) => transaction.status === "paid"
  );

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "pending"
  );

  const failedTransactions = transactions.filter(
    (transaction) => transaction.status === "failed"
  );

  const totalRevenue = paidTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  // CSV export
  const exportCSV = () => {
    const headers = [
      "Vendor",
      "Email",
      "Transaction ID",
      "Checkout Session ID",
      "Plan",
      "Amount",
      "Currency",
      "Status",
      "Payment Date",
    ];

    const rows = filteredTransactions.map((transaction) => [
      transaction.vendorName,
      transaction.vendorEmail,
      transaction.transactionId,
      transaction.sessionId,
      transaction.plan,
      transaction.amount,
      transaction.currency,
      transaction.status,
      transaction.paymentDate || "",
    ]);

    const escapeCSV = (value: string | number) => {
      const text = String(value ?? "").replace(/"/g, '""');
      return `"${text}"`;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "wedplan-transactions.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#F8F8F9] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#929299]">
              <Link
                href="/dashboard/admin"
                className="transition hover:text-[#dc2027]"
              >
                Admin Dashboard
              </Link>

              <ChevronRight className="h-3.5 w-3.5" />

              <span className="text-[#dc2027]">
                Transactions
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#202024] sm:text-4xl">
              Transactions
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#85858D]">
              Monitor payments, revenue and vendor membership transactions.
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E6E6E9] bg-white px-5 text-sm font-medium text-[#414149] shadow-sm transition hover:border-[#dc2027]/30 hover:text-[#dc2027]"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* ================= STATS ================= */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Revenue */}
          <div className="rounded-2xl border border-[#E9E9EC] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#777780]">
                Total Revenue
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDECEE] text-[#dc2027]">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#202024]">
              {money(totalRevenue)}
            </h2>

            <p className="mt-1 text-xs text-[#96969C]">
              From successful payments
            </p>
          </div>

          {/* Total Transactions */}
          <div className="rounded-2xl border border-[#E9E9EC] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#777780]">
                Total Transactions
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F0F8] text-[#6666A5]">
                <Receipt className="h-5 w-5" />
              </div>
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#202024]">
              {transactions.length}
            </h2>

            <p className="mt-1 text-xs text-[#96969C]">
              All recorded payments
            </p>
          </div>

          {/* Successful */}
          <div className="rounded-2xl border border-[#E9E9EC] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#777780]">
                Successful
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF5ED] text-[#378453]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#202024]">
              {paidTransactions.length}
            </h2>

            <p className="mt-1 text-xs text-[#96969C]">
              Completed transactions
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-[#E9E9EC] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#777780]">
                Pending / Failed
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF5E5] text-[#B17B2D]">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#202024]">
              {pendingTransactions.length + failedTransactions.length}
            </h2>

            <p className="mt-1 text-xs text-[#96969C]">
              {pendingTransactions.length} pending · {failedTransactions.length} failed
            </p>
          </div>
        </section>

        {/* ================= TRANSACTION TABLE ================= */}
        <section className="mt-7 overflow-hidden rounded-2xl border border-[#E9E9EC] bg-white shadow-sm">

          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-[#EEEEF0] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#242429]">
                Payment Records
              </h2>

              <p className="mt-1 text-xs text-[#96969C]">
                {filteredTransactions.length} transactions found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative sm:w-[300px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1A8]" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search vendor, email or transaction..."
                  className="h-11 w-full rounded-xl border border-[#E7E7EA] bg-[#FCFCFD] pl-10 pr-4 text-sm text-[#33333A] outline-none transition placeholder:text-[#A4A4AB] focus:border-[#dc2027]/50 focus:ring-2 focus:ring-[#dc2027]/10"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-11 rounded-xl border border-[#E7E7EA] bg-white px-4 text-sm text-[#45454D] outline-none transition focus:border-[#dc2027]/50"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFB] text-left">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#98989F]">
                    Vendor
                  </th>

                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#98989F]">
                    Transaction ID
                  </th>

                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#98989F]">
                    Plan
                  </th>

                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#98989F]">
                    Date
                  </th>

                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#98989F]">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#98989F]">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-[#F0F0F2] transition hover:bg-[#FCFCFD]"
                  >
                    {/* Vendor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDECEE] text-sm font-semibold text-[#dc2027]">
                          {transaction.vendorName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#303037]">
                            {transaction.vendorName}
                          </p>

                          <p className="mt-1 truncate text-xs text-[#96969C]">
                            {transaction.vendorEmail || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Transaction ID */}
                    <td className="px-5 py-4">
                      <div className="max-w-[200px]">
                        <p className="truncate font-mono text-xs text-[#777780]">
                          {transaction.transactionId || "N/A"}
                        </p>

                        {transaction.sessionId && (
                          <p className="mt-1 truncate font-mono text-[10px] text-[#B0B0B5]">
                            {transaction.sessionId}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F2] px-2.5 py-1.5 text-xs font-medium capitalize text-[#76634F]">
                        <Crown className="h-3.5 w-3.5" />
                        {transaction.plan}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-[#686870]">
                        {formatDate(transaction.paymentDate)}
                      </p>

                      <p className="mt-1 text-[10px] text-[#A5A5AA]">
                        {transaction.paymentDate
                          ? new Date(
                              transaction.paymentDate
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : ""}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#303037]">
                        {money(
                          transaction.amount,
                          transaction.currency
                        )}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={transaction.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty */}
            {filteredTransactions.length === 0 && (
              <EmptyState />
            )}
          </div>

          {/* Mobile/tablet transaction cards */}
          <div className="divide-y divide-[#F0F0F2] lg:hidden">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDECEE] text-sm font-semibold text-[#dc2027]">
                      {transaction.vendorName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#303037]">
                        {transaction.vendorName}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#96969C]">
                        {transaction.vendorEmail}
                      </p>
                    </div>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-[#303037]">
                    {money(
                      transaction.amount,
                      transaction.currency
                    )}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <StatusBadge status={transaction.status} />

                  <span className="text-xs text-[#929299]">
                    {formatDate(transaction.paymentDate)}
                  </span>
                </div>

                <div className="mt-3 rounded-xl bg-[#FAFAFB] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1A8]">
                    Transaction ID
                  </p>

                  <p className="mt-1 break-all font-mono text-xs leading-5 text-[#72727A]">
                    {transaction.transactionId || "Not available"}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#777780]">
                    <Crown className="h-3.5 w-3.5 text-[#B38B54]" />
                    <span className="capitalize">
                      {transaction.plan} plan
                    </span>
                  </span>

                  <span className="text-[11px] text-[#A1A1A8]">
                    {transaction.sessionId
                      ? `Session: ${transaction.sessionId.slice(0, 15)}...`
                      : ""}
                  </span>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <EmptyState />
            )}
          </div>

          {/* Table footer */}
          <div className="flex flex-col justify-between gap-2 border-t border-[#EEEEF0] bg-[#FCFCFD] px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-xs text-[#96969C]">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>

            <p className="text-xs text-[#96969C]">
              Revenue counts successful payments only
            </p>
          </div>
        </section>

        {/* ================= SECURITY NOTE ================= */}
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#E9E9EC] bg-white p-4">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#777780]" />

          <p className="text-xs leading-5 text-[#85858D]">
            Transaction data is loaded from your MongoDB payment records.
            Stripe payment information is securely processed.
          </p>
        </div>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F5F6] text-[#9999A0]">
        <Search className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#303037]">
        No transactions found
      </h3>

      <p className="mt-2 text-xs text-[#96969C]">
        Try changing your search or status filter.
      </p>
    </div>
  );
}