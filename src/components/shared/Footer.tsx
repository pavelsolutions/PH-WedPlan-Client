
import Link from "next/link";

import {
  Heart,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
  { name: "Sign In", href: "/signin" },
  { name: "Create Account", href: "/signup" },
];

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
];

const socialLinks = [
  "Instagram",
  "Pinterest",
  "Facebook",
];

export default function Footer() {
  return (
    <footer className="bg-[#302521] text-white">

      <div className="mx-auto max-w-7xl px-6 pt-14 lg:px-8">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand Section */}
          <div>
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f45b4f]">
                <Heart
                  size={19}
                  fill="white"
                  className="text-white"
                />
              </div>

              <span className="text-xl font-bold tracking-tight">
                Wed<span className="text-[#f45b4f]">Plan</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-6 text-[#d2c2bc]">
              Curating extraordinary wedding venues,
              photographers, florists, caterers, and
              bridal stylists so couples can plan
              unforgettable celebrations with confidence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Navigation
            </h3>

            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#d2c2bc] transition-colors duration-200 hover:text-[#f45b4f]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Categories
            </h3>

            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <span className="cursor-default text-sm text-[#d2c2bc] transition-colors duration-200 hover:text-[#f45b4f]">
                    {category}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Connect */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Contact & Connect
            </h3>

            <ul className="space-y-4">

              <li className="flex items-center gap-3 text-sm text-[#d2c2bc]">
                <Mail
                  size={17}
                  className="shrink-0 text-[#f45b4f]"
                />
                <span>concierge@wedplan.com</span>
              </li>

              <li className="flex items-center gap-3 text-sm text-[#d2c2bc]">
                <Phone
                  size={17}
                  className="shrink-0 text-[#f45b4f]"
                />
                <span>+1 (415) 890-4321</span>
              </li>

              <li className="flex items-start gap-3 text-sm text-[#d2c2bc]">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-[#f45b4f]"
                />
                <span>Dhaka, Bangladesh</span>
              </li>

            </ul>

            {/* Social Links */}
            <div className="mt-6 flex flex-wrap gap-2">

              {socialLinks.map((social) => (
                <span
                  key={social}
                  className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-[#d2c2bc] transition-all duration-200 hover:border-[#f45b4f] hover:bg-[#f45b4f] hover:text-white"
                >
                  {social}
                </span>
              ))}

            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/15 py-6 text-center sm:flex-row">

          <p className="text-xs text-[#bca9a1]">
            © {new Date().getFullYear()} WedPlan Wedding Planning Platform.
            All rights reserved.
          </p>

          <p className="text-xs text-[#bca9a1]">
            Crafted for couples & verified wedding artisans worldwide.
          </p>

        </div>

      </div>
    </footer>
  );
}
