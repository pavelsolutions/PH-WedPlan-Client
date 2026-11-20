
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f4dcd5] bg-[#fffaf7]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-4 sm:flex-row lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f45b4f] text-white">
            <Heart size={21} fill="currentColor" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide text-[#302521]">
              Wed<span className="text-[#f45b4f]">Plan</span>
            </h1>
            <p className="text-[9px] tracking-[3px] text-[#a58b80]">
              MAKE YOUR DAY SPECIAL
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#51413b] transition-colors hover:text-[#f45b4f]"
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/signin"
            className="text-sm font-medium text-[#51413b] transition-colors hover:text-[#f45b4f]"
          >
            Sign In
          </Link>

          <Button
            asChild
            className="rounded-full bg-[#f45b4f] px-6 text-white shadow-md shadow-[#f45b4f]/20 hover:bg-[#df493e]"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
