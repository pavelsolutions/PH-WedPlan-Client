
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="bg-white px-5 py-16 lg:px-8 lg:py-20">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#302521] px-6 py-16 text-center sm:px-12 lg:py-20">

        {/* Decorations */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#f45b4f]/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#f45b4f]/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f45b4f]/15 text-[#ff8b7f]">
            <Heart size={27} fill="currentColor" />
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[3px] text-[#ff9b8e]">
            <Sparkles size={15} />
            Your Dream Wedding Awaits
          </div>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Let's Make Your
            <span className="block text-[#f45b4f]">
              Dream Wedding Happen
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#d2c2bc] sm:text-base">
            Find the perfect wedding services, connect with
            talented professionals, and start planning a
            celebration that reflects your love story.
          </p>

          <div className="mt-9 flex justify-center">
            <Button
              asChild
              size="lg"
              className="h-12 min-w-[210px] rounded-full bg-[#f45b4f] px-7 text-white hover:bg-[#df493e]"
            >
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Explore Wedding Services</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </Button>
          </div>

          <p className="mt-5 text-xs text-[#bca9a1]">
            Made with love for your most special moments.
          </p>

        </div>
      </div>
    </section>
  );
}
