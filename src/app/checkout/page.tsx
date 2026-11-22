"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  ShieldCheck,
  Sparkles,
  Star,
  LockKeyhole,
  BadgeCheck,
} from "lucide-react";

const premiumFeatures = [
  {
    title: "Premium Vendor Badge",
    description: "Build trust with a premium badge on your vendor profile.",
  },
  {
    title: "Featured Service Listings",
    description: "Get highlighted and attract more potential wedding clients.",
  },
  {
    title: "Enhanced Visibility",
    description: "Stand out and get discovered by more couples.",
  },
  {
    title: "Unlimited Service Listings",
    description: "Showcase all your wedding services in one place.",
  },
  {
    title: "Business Analytics",
    description: "Monitor profile views and service performance.",
  },
  {
    title: "Priority Support",
    description: "Get dedicated assistance whenever you need it.",
  },
];

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [error, setError] = useState("");

  // Detect canceled checkout from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("canceled") === "true") {
      setCanceled(true);
    }
  }, []);

const handleCheckout = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
    });

    const contentType = response.headers.get("content-type");

    // API HTML return করলে JSON parse না করে error দেখাবে
    if (!contentType?.includes("application/json")) {
      const text = await response.text();

      console.error("API returned HTML:", text);

      throw new Error(
        `API route not found or server error (${response.status}). Check route.ts location.`
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Checkout failed");
    }

    if (!data.url) {
      throw new Error("Stripe Checkout URL missing");
    }

    window.location.href = data.url;
  } catch (error) {
    console.error("Checkout error:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );

    setLoading(false);
  }
};
  return (
    <main className="min-h-screen bg-[#F8F8F9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <Link
          href="/dashboard/vendor"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#DC2027]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Cancel message */}
        {canceled && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Payment was canceled. You can try again whenever you are ready.
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Header */}
        <section className="mb-10 mt-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DC2027]/10">
            <Crown className="h-8 w-8 text-[#DC2027]" />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DC2027]/15 bg-white px-4 py-2 text-xs font-semibold text-[#DC2027]">
            <Sparkles className="h-3.5 w-3.5" />
            WEDPLAN PREMIUM
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Elevate Your Wedding Business
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Unlock premium features, increase your visibility, and connect
            with more couples looking for their perfect wedding vendors.
          </p>
        </section>

        {/* Main Layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Features */}
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#DC2027]">
                  Membership Benefits
                </p>

                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  Everything you need to grow
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  One premium membership. More opportunities.
                </p>
              </div>

              <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#DC2027]/10 sm:flex">
                <Star className="h-6 w-6 text-[#DC2027]" />
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 space-y-4">
              {premiumFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="group flex items-start gap-4 rounded-2xl border border-gray-100 p-4 transition-all duration-200 hover:border-[#DC2027]/20 hover:bg-[#DC2027]/[0.02]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DC2027]/10 transition-colors group-hover:bg-[#DC2027]">
                    <Check className="h-5 w-5 text-[#DC2027] group-hover:text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {feature.title}
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Section */}
            <div className="mt-7 rounded-2xl bg-gray-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-green-600" />

                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Secure & Trusted Payments
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Your payment is securely processed by Stripe.
                    WedPlan never stores your card details.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Card */}
          <section className="h-fit overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {/* Premium Header */}
            <div className="relative overflow-hidden bg-[#DC2027] p-7 text-white">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/[0.07]" />
              <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-white/[0.06]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5">
                    <Crown className="h-4 w-4" />
                    <span className="text-xs font-semibold">
                      Premium Membership
                    </span>
                  </div>

                  <Sparkles className="h-5 w-5 text-white/80" />
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  WedPlan Premium
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/80">
                  Unlock your full potential and grow your business.
                </p>

                <div className="mt-7 flex items-end gap-2">
                  <span className="text-5xl font-bold tracking-tight">
                    $25
                  </span>

                  <span className="mb-1 text-sm text-white/80">
                    USD
                  </span>
                </div>

                <p className="mt-2 text-xs text-white/75">
                  One-time premium membership fee
                </p>
              </div>
            </div>

            {/* Payment Body */}
            <div className="p-6">
              {/* Summary */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DC2027]/10">
                    <Crown className="h-5 w-5 text-[#DC2027]" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Premium Membership
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Unlock all premium benefits
                    </p>
                  </div>

                  <span className="text-sm font-bold text-gray-900">
                    $25.00
                  </span>
                </div>
              </div>

              {/* Price Details */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Membership fee</span>
                  <span className="font-medium text-gray-800">
                    $25.00
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment type</span>
                  <span className="font-medium text-gray-800">
                    One-time
                  </span>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      Total Amount
                    </span>

                    <span className="text-2xl font-bold text-[#DC2027]">
                      $25.00
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#DC2027] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#B91C22] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    Upgrade to Premium
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Secure checkout */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <LockKeyhole className="h-3.5 w-3.5" />
                Secure checkout powered by Stripe
              </div>

              {/* Payment badges */}
              <div className="mt-5 flex items-center justify-center gap-2 border-t border-gray-100 pt-5">
                <div className="flex items-center gap-1.5 rounded-lg border border-gray-100 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span className="text-[11px] font-medium text-gray-500">
                    Secure Payment
                  </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg border border-gray-100 px-3 py-2">
                  <BadgeCheck className="h-4 w-4 text-[#DC2027]" />
                  <span className="text-[11px] font-medium text-gray-500">
                    Verified Checkout
                  </span>
                </div>
              </div>

              <p className="mt-5 text-center text-[11px] leading-5 text-gray-400">
                By proceeding, you agree to WedPlan&apos;s Terms of
                Service and Payment Policy.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-center text-xs text-gray-400">
          <ShieldCheck className="h-4 w-4" />
          Your payment information is encrypted and protected.
        </div>
      </div>
    </main>
  );
}