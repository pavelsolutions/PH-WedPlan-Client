
import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffaf7] px-4 py-12">
      <div className="w-full max-w-lg text-center">

        {/* 404 Illustration */}
        <div className="relative mx-auto mb-8 flex h-48 w-48 items-center justify-center rounded-full bg-[#fff1ec]">
          <span className="text-7xl font-extrabold tracking-tight text-[#f45b4f]">
            404
          </span>

          <div className="absolute -right-2 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
            <Search className="h-6 w-6 text-[#f45b4f]" />
          </div>

          <div className="absolute -bottom-1 left-3 h-5 w-5 rounded-full bg-[#f4b2a8]" />
          <div className="absolute -left-4 top-10 h-3 w-3 rounded-full bg-[#f45b4f]" />
        </div>

        {/* Content */}
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f45b4f]">
          Page Not Found
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#302521] sm:text-4xl">
          Oops! Something went wrong.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to planning something beautiful!
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#f45b4f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e84b40]"
          >
            <Home size={17} />
            Back to Home
          </Link>

          <Link
            href="/services"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#eadbd4] bg-white px-6 py-3 text-sm font-semibold text-[#302521] transition hover:bg-[#fff1ec]"
          >
            <ArrowLeft size={17} />
            Explore Services
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-gray-400">
          © {new Date().getFullYear()} Wedding Planner. All rights reserved.
        </p>
      </div>
    </div>
  );
}
