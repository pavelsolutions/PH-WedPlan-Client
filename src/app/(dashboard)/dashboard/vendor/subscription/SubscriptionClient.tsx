"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Crown,
  CreditCard,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Payment = {
  id: string;
  sessionId?: string;
  transactionId?: string;
  amount: number;
  currency: string;
  plan: string;
  status: string;
  paymentDate: string | null;
  email?: string;
};

type Props = {
  vendorName: string;
  vendorEmail: string;
  subscriptionPlan: string;
  isPremium: boolean;
  totalPaid: number;
  paymentCount: number;
  payments: Payment[];
  premiumActivatedAt: string | null;
};

const RED = "#dc2027";

function formatMoney(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isPaid(status: string) {
  const value = String(status).toLowerCase();

  return value === "paid" || value === "complete";
}

export default function SubscriptionClient({
  vendorName,
  vendorEmail,
  subscriptionPlan,
  isPremium,
  totalPaid,
  paymentCount,
  payments,
  premiumActivatedAt,
}: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyTransaction = async (transactionId: string) => {
    try {
      await navigator.clipboard.writeText(transactionId);
      setCopied(transactionId);

      setTimeout(() => {
        setCopied(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy transaction ID:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* ================= PAGE HEADER ================= */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: RED }}
            >
              Vendor Account
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#201A1B] sm:text-4xl">
              Membership & Billing
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#817879]">
              Manage your membership and view your payment activity.
            </p>
          </div>

          <Link
            href="/dashboard/vendor"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E9E4E2] bg-white px-4 text-sm font-medium text-[#55494B] transition hover:border-[#dc2027]/30 hover:text-[#dc2027]"
          >
            Back to dashboard
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ================= MEMBERSHIP HERO ================= */}
        <section
          className="relative overflow-hidden rounded-[28px] text-white shadow-[0_18px_50px_-25px_rgba(220,32,39,0.45)]"
          style={{ backgroundColor: RED }}
        >
          {/* Background decorations */}
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/[0.10]" />

          <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border border-white/[0.10]" />

          <div className="pointer-events-none absolute -bottom-32 left-[35%] h-72 w-72 rounded-full bg-white/[0.06] blur-3xl" />

          <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_290px] lg:items-center lg:p-11">
            {/* Left side */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white">
                <Crown className="h-3.5 w-3.5" />
                WEDPLAN MEMBERSHIP
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {isPremium
                    ? "Premium Membership"
                    : "Free Membership"}
                </h2>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    isPremium
                      ? "bg-white text-[#16804A]"
                      : "border border-white/20 bg-white/10 text-white"
                  }`}
                >
                  {isPremium && (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}

                  {isPremium ? "Active" : "Current Plan"}
                </span>
              </div>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/85">
                {isPremium
                  ? "Your business is now part of WedPlan Premium. Enjoy exclusive benefits, increased visibility and more opportunities to connect with couples."
                  : "Grow your wedding business with WedPlan. Upgrade to Premium to get a verified premium badge, featured service listings and more visibility."}
              </p>

              {/* Free: Upgrade button */}
              {!isPremium && (
                <Link
                  href="/checkout"
                  className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#dc2027] shadow-sm transition-all duration-200 hover:bg-[#FFF2F2] hover:shadow-md active:scale-[0.98]"
                >
                  <Crown className="h-4 w-4" />
                  Upgrade to Premium
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              {/* Premium: Active status */}
              {isPremium && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white">
                  <CheckCircle2 className="h-4 w-4" />
                  Premium Membership Active
                </div>
              )}

              {isPremium && premiumActivatedAt && (
                <p className="mt-4 text-xs text-white/75">
                  Member since {formatDate(premiumActivatedAt)}
                </p>
              )}
            </div>

            {/* Right side membership price */}
            <div className="relative rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm lg:ml-auto lg:w-full">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/80">
                  Membership plan
                </p>

                <Sparkles className="h-4 w-4 text-white" />
              </div>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight">
                  {isPremium ? "$25" : "$0"}
                </span>

                <span className="text-sm text-white/80">USD</span>
              </div>

              <p className="mt-2 text-sm text-white/80">
                {isPremium
                  ? "One-time premium membership fee"
                  : "Free plan · No payment required"}
              </p>

              <div className="mt-5 border-t border-white/20 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/75">Current plan</span>

                  <span className="font-semibold capitalize text-white">
                    {subscriptionPlan || "free"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">

          {/* Total Paid */}
          <div className="rounded-2xl border border-[#EAE5E3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dc2027]/10 text-[#dc2027]">
                <CreditCard className="h-5 w-5" />
              </div>

              <p className="text-sm text-[#817879]">
                Total paid
              </p>
            </div>

            <h3 className="mt-4 text-2xl font-semibold text-[#251B1D]">
              {formatMoney(totalPaid)}
            </h3>

            <p className="mt-1 text-xs text-[#A19896]">
              Successful payment amount
            </p>
          </div>

          {/* Transaction count */}
          <div className="rounded-2xl border border-[#EAE5E3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F1ED] text-[#77614B]">
                <Receipt className="h-5 w-5" />
              </div>

              <p className="text-sm text-[#817879]">
                Transactions
              </p>
            </div>

            <h3 className="mt-4 text-2xl font-semibold text-[#251B1D]">
              {paymentCount}
            </h3>

            <p className="mt-1 text-xs text-[#A19896]">
              Successful payments
            </p>
          </div>

          {/* Account status */}
          <div className="rounded-2xl border border-[#EAE5E3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isPremium
                    ? "bg-[#EAF5ED] text-[#328251]"
                    : "bg-[#F5F1ED] text-[#77614B]"
                }`}
              >
                <ShieldCheck className="h-5 w-5" />
              </div>

              <p className="text-sm text-[#817879]">
                Account status
              </p>
            </div>

            <h3 className="mt-4 text-2xl font-semibold capitalize text-[#251B1D]">
              {subscriptionPlan || "free"}
            </h3>

            <p className="mt-1 text-xs text-[#A19896]">
              {isPremium
                ? "Premium membership activated"
                : "Upgrade to unlock premium benefits"}
            </p>
          </div>
        </section>

        {/* ================= PAYMENT HISTORY ================= */}
        <section className="mt-8 overflow-hidden rounded-[24px] border border-[#EAE5E3] bg-white">

          {/* Header */}
          <div className="flex flex-col justify-between gap-3 border-b border-[#F0ECEA] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
            <div>
              <h2 className="text-lg font-semibold text-[#251B1D]">
                Payment history
              </h2>

              <p className="mt-1 text-sm text-[#958B89]">
                View your membership payments and transaction details.
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full bg-[#F8F5F3] px-3 py-1.5 text-xs font-medium text-[#786C6A]">
              {payments.length} records
            </span>
          </div>

          {/* Empty state */}
          {payments.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F5F3] text-[#A29592]">
                <Receipt className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-[#342729]">
                No payment history yet
              </h3>

              <p className="mt-2 text-sm text-[#958B89]">
                Your membership transactions will appear here after payment.
              </p>

              {!isPremium && (
                <Link
                  href="/checkout"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: RED }}
                >
                  Upgrade to Premium
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* ================= DESKTOP TABLE ================= */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#FCFBFA] text-left">
                      <th className="px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A09694]">
                        Payment
                      </th>

                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A09694]">
                        Transaction ID
                      </th>

                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A09694]">
                        Date
                      </th>

                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A09694]">
                        Amount
                      </th>

                      <th className="px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A09694]">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments.map((payment) => {
                      const paid = isPaid(payment.status);

                      return (
                        <tr
                          key={payment.id}
                          className="border-t border-[#F2EEEC] transition hover:bg-[#FCFBFA]"
                        >
                          {/* Payment */}
                          <td className="px-7 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dc2027]/10 text-[#dc2027]">
                                <Crown className="h-4 w-4" />
                              </div>

                              <div>
                                <p className="text-sm font-medium capitalize text-[#342729]">
                                  {payment.plan} membership
                                </p>

                                <p className="mt-1 text-xs text-[#A09694]">
                                  WedPlan checkout
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Transaction ID */}
                          <td className="px-5 py-5">
                            {payment.transactionId ? (
                              <div className="flex max-w-[230px] items-center gap-2 rounded-lg border border-[#F0ECEA] bg-[#FCFBFA] px-2.5 py-2">
                                <span className="truncate font-mono text-xs text-[#756A68]">
                                  {payment.transactionId}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    copyTransaction(
                                      payment.transactionId!
                                    )
                                  }
                                  className="shrink-0 text-[#9B8F8D] transition hover:text-[#dc2027]"
                                  title="Copy transaction ID"
                                >
                                  {copied === payment.transactionId ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-[#A09694]">
                                Not available
                              </span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="px-5 py-5 text-sm text-[#756A68]">
                            {formatDate(payment.paymentDate)}
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-5 text-sm font-semibold text-[#342729]">
                            {formatMoney(
                              payment.amount,
                              payment.currency
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-7 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium ${
                                paid
                                  ? "bg-[#EDF6F0] text-[#39734E]"
                                  : "bg-[#F8F1E8] text-[#986A32]"
                              }`}
                            >
                              {paid && (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              )}

                              {paid ? "Paid" : payment.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ================= MOBILE PAYMENT CARDS ================= */}
              <div className="divide-y divide-[#F0ECEA] md:hidden">
                {payments.map((payment) => {
                  const paid = isPaid(payment.status);

                  return (
                    <div key={payment.id} className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dc2027]/10 text-[#dc2027]">
                            <Crown className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold capitalize text-[#342729]">
                              {payment.plan} membership
                            </p>

                            <p className="mt-1 text-xs text-[#958B89]">
                              {formatDate(payment.paymentDate)}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-[#342729]">
                          {formatMoney(
                            payment.amount,
                            payment.currency
                          )}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            paid
                              ? "bg-[#EDF6F0] text-[#39734E]"
                              : "bg-[#F8F1E8] text-[#986A32]"
                          }`}
                        >
                          {paid ? "Paid" : payment.status}
                        </span>

                        {payment.transactionId && (
                          <button
                            type="button"
                            onClick={() =>
                              copyTransaction(
                                payment.transactionId!
                              )
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#dc2027]"
                          >
                            {copied === payment.transactionId ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                Copy transaction ID
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Transaction ID */}
                      {payment.transactionId && (
                        <div className="mt-3 rounded-xl bg-[#FCFBFA] p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A09694]">
                            Transaction ID
                          </p>

                          <p className="mt-1 break-all font-mono text-xs leading-5 text-[#756A68]">
                            {payment.transactionId}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* ================= SECURITY FOOTER ================= */}
        <div className="mt-5 flex items-start gap-3 px-1">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#928582]" />

          <p className="text-xs leading-5 text-[#928582]">
            Payments are securely processed through Stripe. Your card
            details are never stored by WedPlan.
          </p>
        </div>
      </div>
    </main>
  );
}