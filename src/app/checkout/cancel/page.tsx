
"use client";

import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  CreditCard,
  Heart,
} from "lucide-react";

export default function PaymentCancelled() {
  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-[#fffaf8] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-xl shadow-rose-100/50 sm:p-12">

        {/* Icon */}
        <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-rose-50">
          <div className="absolute inset-2 rounded-full border border-rose-200" />
          <XCircle size={48} className="text-rose-500" />
        </div>

        {/* Heading */}
        <span className="mb-4 inline-flex rounded-full bg-rose-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-500">
          Payment Cancelled
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          No Worries!
        </h1>

        <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
          Your payment process was cancelled. No amount has been charged
          through this cancelled checkout. You can try upgrading your
          vendor account whenever you're ready.
        </p>

        {/* Info */}
        <div className="my-8 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-left">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white p-3 text-rose-500 shadow-sm">
              <CreditCard size={21} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Your account is unchanged
              </h3>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Your current vendor plan and account information remain
                unchanged.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/vendor/upgrade"
            className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-6 py-4 font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
          >
            <RefreshCw size={18} />
            Try Again
          </Link>

          <Link
            href="/dashboard/vendor"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-4 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck size={15} />
          Secure payments powered by Stripe
          <Heart size={13} className="fill-rose-400 text-rose-400" />
        </div>
      </div>
    </section>
  );
}
