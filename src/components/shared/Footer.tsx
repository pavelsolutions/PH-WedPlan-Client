
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
  { name: "Dashboard", href: "/dashboard" },
];

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
];

const socialLinks = ["Instagram", "Pinterest", "Facebook"];

export default function Footer() {
  return (
    <footer className="border-t border-[#eadfd9] bg-white text-[#dc2027]">
      <div className="mx-auto w-full max-w-[1200px] px-5 pt-10 sm:px-6 lg:px-8">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#dc2027]">
                <Heart size={18} fill="white" className="text-white" />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-wide text-[#302521]">
              Wed<span className="text-[#f45b4f]">Plan</span>
            </h2>
                <p className="text-[9px] tracking-[1.5px] text-[#a58b80]">
                  WEDDING MARKETPLACE
                </p>
              </div>
            </Link>

            <p className="max-w-xs text-xs leading-5 text-[#88766e]">
              Curating extraordinary wedding venues,
              photographers, florists, caterers, and
              bridal stylists so couples can plan
              unforgettable celebrations with confidence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#dc2027]">
              Navigation
            </h3>

            <ul className="space-y-2.5">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-[#88766e] transition-colors hover:text-[#92283c]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#dc2027]">
              Categories
            </h3>

            <ul className="space-y-2.5">
              {categories.map((category) => (
                <li key={category}>
                  <span className="cursor-default text-xs text-[#88766e] transition-colors hover:text-[#92283c]">
                    {category}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#dc2027]">
              Contact & Connect
            </h3>

            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-xs text-[#88766e]">
                <Mail size={14} className="shrink-0 text-[#92283c]" />
                <span>concierge@wedplan.com</span>
              </li>

              <li className="flex items-center gap-2 text-xs text-[#88766e]">
                <Phone size={14} className="shrink-0 text-[#92283c]" />
                <span>+1 (415) 890-4321</span>
              </li>

              <li className="flex items-start gap-2 text-xs text-[#88766e]">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#92283c]" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <span
                  key={social}
                  className="rounded-full border border-[#eadfd9] px-3 py-1 text-[10px] text-[#88766e] transition-all hover:border-[#92283c] hover:bg-[#92283c] hover:text-white"
                >
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#eadfd9] py-5 text-center sm:flex-row">

          <p className="text-[10px] text-[#a58b80]">
            © {new Date().getFullYear()} WedPlan Wedding Planning Platform.
            All rights reserved.
          </p>

          <p className="text-[10px] text-[#a58b80]">
            Crafted for couples & verified wedding artisans worldwide.
          </p>

        </div>
      </div>
    </footer>
  );
}
