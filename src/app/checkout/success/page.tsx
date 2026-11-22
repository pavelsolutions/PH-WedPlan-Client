import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Crown,
  Mail,
  Receipt,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { checkoutVerify } from "@/lib/actions/payments";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import CopyTransactionId from "../CopyTransactionId";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/dashboard/vendor/upgrade");
  }

  // Retrieve Stripe Checkout Session
  const checkoutSession = await stripe.checkout.sessions.retrieve(
    session_id,
    {
      expand: ["line_items", "payment_intent"],
    }
  );

  const {
    status,
    payment_status,
    customer_email,
    customer_details,
    metadata,
    payment_intent,
    amount_total,
    currency,
    created,
  } = checkoutSession;

  // If checkout is still open
  if (status === "open") {
    redirect("/dashboard/vendor/upgrade");
  }

  // Payment must be complete and paid
  if (status !== "complete" || payment_status !== "paid") {
    redirect("/dashboard/vendor/upgrade?payment=failed");
  }

  // Verify payment in your backend/database
  const verificationResult = await checkoutVerify(session_id);

  console.log("Payment verification result:", verificationResult);

  // Extract Transaction ID / Payment Intent ID
  const transactionId =
    typeof payment_intent === "string"
      ? payment_intent
      : payment_intent?.id ?? "Unavailable";

  // Customer email
  const email =
    customer_email ||
    customer_details?.email ||
    "Not available";

  // Payment amount
  const paidAmount = ((amount_total ?? 0) / 100).toFixed(2);

  // Currency
  const currencyCode = (currency ?? "usd").toUpperCase();

  // Plan
  const planName = metadata?.plan || "premium";

  // Payment date
  const paymentDate = new Date(created * 1000).toLocaleString(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  return (
    <main className="min-h-screen bg-[#FAF8F7] px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-3xl">

        {/* Success Header */}
        <div className="text-center">
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-green-100 animate-pulse" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-green-500 shadow-lg shadow-green-500/20">
              <Check className="h-10 w-10 text-white" strokeWidth={3} />
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#92283D]/10 bg-[#92283D]/5 px-4 py-2 text-xs font-semibold text-[#92283D]">
            <Crown className="h-4 w-4" />
            WEDPLAN PREMIUM
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Payment Successful!
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
            Congratulations! Your Premium membership payment has
            been completed successfully. You can now enjoy all
            the exclusive benefits of WedPlan Premium.
          </p>
        </div>

        {/* Main Receipt Card */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_15px_60px_-25px_rgba(0,0,0,0.15)]">

          {/* Receipt Header */}
          <div className="relative overflow-hidden bg-[#92283D] px-6 py-8 text-white sm:px-8">
            <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-black/5" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-white/70">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                    Membership Upgrade
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-bold">
                  WedPlan Premium
                </h2>

                <p className="mt-1 text-sm text-white/75">
                  One-time membership payment
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <Crown className="h-6 w-6" />
              </div>
            </div>

            <div className="relative mt-8">
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                Amount Paid
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {currencyCode === "USD" ? "$" : ""}
                  {paidAmount}
                </span>

                <span className="text-sm font-medium text-white/75">
                  {currencyCode}
                </span>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/15">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Payment Completed
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-6 sm:p-8">

            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-[#92283D]" />

              <h3 className="text-base font-bold text-gray-900">
                Transaction Details
              </h3>
            </div>

            <div className="mt-6 space-y-5">

              {/* Transaction ID */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Transaction ID
                </p>

                <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="min-w-0 break-all font-mono text-xs leading-5 text-gray-700 sm:text-sm">
                    {transactionId}
                  </p>

                  {transactionId !== "Unavailable" && (
                    <CopyTransactionId
                      transactionId={transactionId}
                    />
                  )}
                </div>

                <p className="mt-1.5 text-xs text-gray-400">
                  Stripe Payment Intent ID
                </p>
              </div>

              {/* Payment Information */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Wallet className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      Payment Status
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />

                    <span className="text-sm font-semibold capitalize text-green-700">
                      {payment_status}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Crown className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      Membership Plan
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold capitalize text-gray-900">
                    {planName}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      Customer Email
                    </span>
                  </div>

                  <p className="mt-2 break-all text-sm font-semibold text-gray-900">
                    {email}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      Payment Date
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {paymentDate}
                  </p>
                </div>
              </div>

              {/* Checkout Session ID */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Checkout Session
                </p>

                <p className="mt-2 break-all rounded-xl border border-gray-100 bg-gray-50 p-3 font-mono text-xs leading-5 text-gray-500">
                  {checkoutSession.id}
                </p>
              </div>
            </div>

            {/* Security Info */}
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

              <div>
                <p className="text-sm font-semibold text-green-800">
                  Secure payment confirmed
                </p>

                <p className="mt-1 text-xs leading-5 text-green-700">
                  Your transaction was securely processed by Stripe.
                  Keep your Transaction ID for future reference.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard/vendor"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#92283D] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7B2032] hover:shadow-md"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard/vendor/subscription"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:border-[#92283D]/30 hover:bg-[#92283D]/5 hover:text-[#92283D]"
              >
                Membership Details
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          Thank you for choosing WedPlan. If you have any questions
          about your payment, please contact our support team.
        </p>
      </div>
    </main>
  );
}