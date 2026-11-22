import Link from "next/link";
import {
  CircleX,
  ArrowLeft,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F7] px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
          <CircleX className="h-10 w-10 text-amber-500" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Your checkout was cancelled. No Premium subscription has
          been activated. You can try again whenever you are ready.
        </p>

        <div className="mt-7 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-left">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-gray-500" />

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Your account is safe
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                No subscription changes were made because checkout
                was cancelled.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/vendor/upgrade"
          className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#92283D] text-sm font-semibold text-white transition hover:bg-[#7B2032]"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Payment Again
        </Link>

        <Link
          href="/dashboard/vendor"
          className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#92283D]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}